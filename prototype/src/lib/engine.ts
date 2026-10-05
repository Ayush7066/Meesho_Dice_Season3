// V1 rules-based, explainable risk + recovery engine. Deterministic. Not ML.

export type Payment = "COD" | "PREPAID";
export type AddressQuality = "CLEAN" | "MEDIUM" | "HIGH";
export type History = "NEW" | "RELIABLE" | "AT_RISK";
export type MessageType = "NONE" | "ADDRESS" | "INTENT" | "COMBINED";
export type RiskState = "LOW RISK" | "ADDRESS RISK" | "INTENT RISK" | "HIGHER RISK";

export interface RiskResult {
  riskState: RiskState;
  reason: string[];
  recommendedAction: string;
  messageType: MessageType;
  /** Exact WhatsApp nudge text, or null when the order ships normally. */
  message: string | null;
}

export const nudgeText: Record<Exclude<MessageType, "NONE">, string> = {
  ADDRESS: "Please confirm your house number / landmark before dispatch.",
  INTENT: "Still want this order? Confirm your intent or choose a better delivery time.",
  COMBINED: "Please confirm your order and correct your delivery address before dispatch.",
};
export const correctAddressText = "Please correct your delivery address before dispatch.";

/** NEW customers are treated as RELIABLE — no history is never a penalty. */
export function historyBucket(history: History): "RELIABLE" | "AT_RISK" {
  return history === "AT_RISK" ? "AT_RISK" : "RELIABLE";
}

function baseRisk(payment: Payment, address: AddressQuality, history: History): Omit<RiskResult, "message"> {
  if (payment === "PREPAID") {
    return {
      riskState: "LOW RISK",
      reason: ["Prepaid — no COD exposure"],
      recommendedAction: "Ship normally",
      messageType: "NONE",
    };
  }
  const bucket = historyBucket(history);
  const historyReason =
    history === "NEW" ? "New customer — treated as reliable by default" : history === "RELIABLE" ? "0–1 refusals in last 10 orders" : "2+ refusals in last 10 orders";

  if (bucket === "RELIABLE") {
    if (address === "CLEAN")
      return { riskState: "LOW RISK", reason: ["COD exposure", "Address looks complete", historyReason], recommendedAction: "Ship normally", messageType: "NONE" };
    if (address === "MEDIUM")
      return { riskState: "ADDRESS RISK", reason: ["COD exposure", "Address has incomplete house/building details", historyReason], recommendedAction: "Ask for address confirmation", messageType: "ADDRESS" };
    return { riskState: "ADDRESS RISK", reason: ["COD exposure", "Address likely unreachable", historyReason], recommendedAction: "Ask to correct address", messageType: "ADDRESS" };
  }
  if (address === "CLEAN")
    return { riskState: "INTENT RISK", reason: ["COD exposure", "Address looks complete", "2+ refusals in last 10 orders (account-level)"], recommendedAction: "Confirm intent + offer reschedule", messageType: "INTENT" };
  return {
    riskState: "HIGHER RISK",
    reason: ["COD exposure", address === "HIGH" ? "Address likely unreachable" : "Address issue", "2+ refusals in last 10 orders (account-level)"],
    recommendedAction: "Confirm address + delivery intent",
    messageType: "COMBINED",
  };
}

export function calculateRisk(payment: Payment, address: AddressQuality, history: History): RiskResult {
  const r = baseRisk(payment, address, history);
  let message: string | null = null;
  if (r.messageType === "ADDRESS") message = address === "HIGH" ? correctAddressText : nudgeText.ADDRESS;
  else if (r.messageType !== "NONE") message = nudgeText[r.messageType];
  return { ...r, message };
}

export const addressChecks = [
  "Pincode exists",
  "City / state match",
  "COD serviceability",
  "House / building completeness",
  "Previous successful address",
];

export type FailureReason = "NOT_HOME" | "SOMEONE_ELSE" | "CANT_FIND" | "DONT_WANT";

export interface RecoveryResult {
  recommendedRecovery: string;
  availableOptions: string[];
  priority: number | null;
  rescuable: boolean;
  note: string;
}

export const recoveryPriority = [
  "Reschedule",
  "Alternate receiver",
  "Address help · live location",
  "Hub hold / self-collect · fallback only",
];

export function getRecoveryAction(reason: FailureReason): RecoveryResult {
  switch (reason) {
    case "NOT_HOME":
      return { recommendedRecovery: "Reschedule", availableOptions: ["Today 6–8 PM", "Tomorrow 10 AM–1 PM", "Tomorrow 4–7 PM", "Weekend slot"], priority: 1, rescuable: true, note: "46.3% chose reschedule after a missed delivery." };
    case "SOMEONE_ELSE":
      return { recommendedRecovery: "Alternate receiver", availableOptions: ["Family member at home", "Neighbour (where validation allows)", "Colleague at work address"], priority: 2, rescuable: true, note: "28.4% would hand it to an alternate receiver." };
    case "CANT_FIND":
      return { recommendedRecovery: "Address help · live location", availableOptions: ["Share live location", "Explain route by phone", "Add landmark / photo"], priority: 3, rescuable: true, note: "40.3% would share live location; 31.3% would explain the route." };
    case "DONT_WANT":
      return { recommendedRecovery: "Standard refusal / RTO flow", availableOptions: [], priority: null, rescuable: false, note: "Not every refusal can be rescued — and we don't pretend otherwise." };
  }
}
