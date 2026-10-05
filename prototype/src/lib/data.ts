// Single source of truth for every case-pack and survey number.
// Do not edit figures without updating the source surveys.

export const surveyA = {
  name: "Survey A · Round 1",
  title: "Online Shopping & COD",
  question: "Why do customers refuse or miss COD orders?",
  respondents: 50,
  codUsers: 38,
  everRefused: { count: 22, pct: 58 },
  addressDifficulty: { count: 31, pct: 82 },
  addressRecurring: { count: 25, pct: 66 },
  fullAddressHard: { count: 12, pct: 32 },
  certainWhenOrdering: { count: 29, pct: 76 },
  unrememberedOrder: { count: 14, pct: 37, unsure: 4 },
  refusalReasons: {
    n: 22,
    behaviouralPct: 77,
    availabilityPct: 18,
    items: [
      { label: "Changed mind", pct: 32, kind: "behavioural" },
      { label: "Cheaper elsewhere", pct: 23, kind: "behavioural" },
      { label: "Unsure of product", pct: 18, kind: "behavioural" },
      { label: "Already bought similar", pct: 5, kind: "behavioural" },
      { label: "Not available", pct: 18, kind: "availability" },
      { label: "No cash", pct: 5, kind: "other" },
    ],
  },
} as const;

export const surveyB = {
  name: "Survey B · Round 2",
  title: "Delivery Experience",
  question:
    "What happened in the most recent failed COD delivery — and what would customers want next?",
  respondents: 73,
  codUsers: 67,
  hadFailed: 53,
  choiceAfterMiss: [
    { label: "Reschedule", pct: 46.3 },
    { label: "Alternate receiver", pct: 28.4 },
    { label: "Another home delivery", pct: 17.9 },
    { label: "Self-collect within 48h", pct: 6.0 },
    { label: "Cancel", pct: 1.5 },
  ],
  rescheduleOrAlternatePct: 75,
  riderCantFind: [
    { label: "Share live location", pct: 40.3, rung: "Digital help" },
    { label: "Explain route by phone", pct: 31.3, rung: "Phone guidance" },
    { label: "Landmark / photo", pct: 11.9, rung: "Digital help" },
    { label: "Collect nearby", pct: 10.4, rung: "Selective collection" },
    { label: "Shopkeeper / neighbour guide", pct: 6.0, rung: "Local guidance" },
  ],
  travel: [
    { label: "Under 500m", pct: 40 },
    { label: "500m–1km", pct: 16 },
    { label: "1–2km", pct: 13 },
    { label: "2–5km", pct: 7.5 },
    { label: "Would not travel", pct: 22 },
  ],
  paymentAtCollection: [
    { label: "UPI", pct: 66 },
    { label: "Cash", pct: 15 },
    { label: "Wait for home delivery, pay then", pct: 13 },
    { label: "Pay digitally, get home delivery", pct: 6 },
  ],
  localHelper: [
    { label: "Guide only", pct: 36 },
    { label: "Depends on who it is", pct: 39 },
    { label: "Can also hold parcel", pct: 15 },
    { label: "Uncomfortable", pct: 10 },
  ],
  whyRecovery: [
    { label: "Convenience", pct: 42 },
    { label: "Getting it quickly", pct: 16 },
    { label: "Flexible timing", pct: 13 },
    { label: "Not having to travel", pct: 10 },
  ],
  failureReasons: {
    n: 53,
    items: [
      { label: "Wasn't home", pct: 43 },
      { label: "No longer wanted", pct: 15 },
      { label: "Delivery-related issue", pct: 15 },
      { label: "Couldn't be reached on phone", pct: 11 },
      { label: "Rider couldn't find address", pct: 8 },
      { label: "No cash", pct: 6 },
      { label: "Unsure of product", pct: 2 },
    ],
    unreachablePlusAddress: { count: 10, pct: 19 },
  },
} as const;

export type Cohort = {
  id: string;
  name: string;
  n: number;
  directional?: boolean;
  reschedule: number;
  alternate: number;
  selfCollect: number;
  liveLocation: number;
  phone: number;
  extra?: { label: string; pct: number }[];
};

export const cohorts: Cohort[] = [
  { id: "metro", name: "Metro habit", n: 27, reschedule: 48, alternate: 30, selfCollect: 4, liveLocation: 33, phone: 33 },
  { id: "other", name: "Other-city habit", n: 15, reschedule: 33, alternate: 40, selfCollect: 7, liveLocation: 60, phone: 33 },
  { id: "town", name: "Town / village habit", n: 8, directional: true, reschedule: 75, alternate: 12.5, selfCollect: 12.5, liveLocation: 50, phone: 25 },
  {
    id: "new", name: "New / occasional", n: 17, reschedule: 41, alternate: 24, selfCollect: 6, liveLocation: 29, phone: 29,
    extra: [
      { label: "Would not travel to collect", pct: 35 },
      { label: "Prefer a local guide", pct: 17.6 },
    ],
  },
];

export const casePack = {
  orders: 100,
  cod: 80,
  prepaid: 20,
  rto: 17,
  codRto: 16,
  prepaidRto: 1,
  codShareOfRtoPct: 94,
  forward: 50,
  reverse: 120,
  lastMile: 21,
  perFailure: 170,
  total: 2890,
  ceiling: 99,
  distance: [
    { label: "~2 km", pct: 15 },
    { label: "~5 km", pct: 17 },
    { label: "10 km+", pct: 22 },
  ],
} as const;

export const demoOrder = {
  id: "#VAL-28471",
  product: "Women's Kurta Set",
  value: "₹799",
  payment: "COD",
  location: "Guwahati",
  address: ["House No. 24", "XYZ Colony", "Pincode 7810XX"],
};

// ---- System upgrade content (Prevent → Recover → Adapt → Learn → Scale) ----

export const sources = {
  survey: "Source: Our survey — directional, small sample.",
  casePack: "Source: Meesho DICE Case Data Pack.",
  hypothesis: "Hypothesis — requires pilot validation.",
};

/** Recovery preference hierarchy shown as rounded research inputs (Survey B). */
export const recoveryPreferences = [
  { label: "Reschedule", pct: 46 },
  { label: "Alternate receiver", pct: 28 },
  { label: "Wait for another delivery", pct: 18 },
  { label: "Self-collect", pct: 6 },
];

export const recoveryClock = {
  windowHours: "0–36",
  hubHoldHours: "48–72",
  limits: ["One recovery cycle", "One reschedule", "One alternate-receiver change"],
};

export const cohortDefaults: Record<string, { tier: string; defaults: string[]; finding?: string }> = {
  metro: { tier: "Tier 1 / Metro", defaults: ["Reschedule", "Alternate receiver"] },
  other: { tier: "Tier 2 / Other cities", defaults: ["Alternate receiver", "Live-location address help"] },
  town: { tier: "Tier 3 / Towns & villages", defaults: ["Simple reschedule flow"], finding: "75% selected reschedule" },
  new: { tier: "Any tier", defaults: ["Reschedule", "Additional support", "Local-guide pilot only where evidence and coverage support it"] },
};

export const rtoHypothesisPer100 = 3.3;

export const plan90 = [
  { d: "Days 1–30", t: "Prove", test: ["Risk engine + reschedule + alternate receiver", "Against a same-size control group"], measure: ["RTO rate", "Nudge response", "Risk-engine coverage", "Complaints", "Delivery success"], gate: "No complaint increase + directional RTO improvement", hypothesis: true },
  { d: "Days 31–60", t: "Expand", test: ["2–3 regions", "Tier 2 behaviour", "Small hub-hold pilot"], measure: ["RTO reduction", "Rescue rate", "Cost per rescued order", "Gaming / abuse"], gate: "Recovery cost < ₹99 and no major operational or fairness issue" },
  { d: "Days 61–90", t: "Decide", test: ["Prevention + recovery across Tier 1 / 2 / 3"], measure: ["RTO reduction", "Cost per rescue", "Complaints", "Gaming / abuse", "Rider impact"], gate: "Scale / Iterate / Hold" },
];

export const guardrails = [
  ["Never block", "Risk scoring never automatically cancels or blocks an order."],
  ["New users protected", "No history ≠ high risk."],
  ["Rider pay protected", "Prevention happens before rider assignment."],
  ["One intervention", "No repeated WhatsApp chasing."],
  ["Cost-gated recovery", "Recovery must stay below the ₹99 incremental cost ceiling."],
  ["Attempts must be verified", "Use call logs + geotagging where operationally available."],
  ["No unsupported data", "Hub performance, wrong-hub routing, fake attempts and rider intent are pilot measurement areas, not assumed model inputs."],
] as const;

export const validationQuestions = [
  "Existing NDR / re-attempt workflow?",
  "Existing physical hub-hold capability?",
  "Latent Last Mile availability and location?",
  "Alternate-receiver regulatory / operational constraints?",
  "PayNearby / Spice Money coverage in target Tier 2 pincodes?",
];
