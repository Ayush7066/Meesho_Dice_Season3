import { useEffect, useState } from "react";
import { demoOrder } from "@/lib/data";
import { addressChecks, calculateRisk, type AddressQuality, type History, type MessageType, type Payment, type RiskResult } from "@/lib/engine";
import { Pill, Section } from "./ui-story";
import { cn } from "@/lib/utils";

const scenarios: { name: string; p: Payment; a: AddressQuality; h: History; expect: string }[] = [
  { name: "Scenario 1", p: "COD", a: "CLEAN", h: "RELIABLE", expect: "Ship normally" },
  { name: "Scenario 2", p: "COD", a: "MEDIUM", h: "RELIABLE", expect: "Address confirmation" },
  { name: "Scenario 3", p: "COD", a: "HIGH", h: "NEW", expect: "Address correction" },
  { name: "Scenario 4", p: "COD", a: "CLEAN", h: "AT_RISK", expect: "Intent + reschedule" },
  { name: "Scenario 5", p: "COD", a: "HIGH", h: "AT_RISK", expect: "Combined intent + address" },
];

const stateTone: Record<string, string> = {
  "LOW RISK": "bg-muted text-primary",
  "ADDRESS RISK": "bg-pink text-primary",
  "INTENT RISK": "bg-pink text-primary",
  "HIGHER RISK": "bg-orange text-orange-foreground",
};

export function RiskEngine() {
  const [payment, setPayment] = useState<Payment>("COD");
  const [address, setAddress] = useState<AddressQuality>("MEDIUM");
  const [history, setHistory] = useState<History>("AT_RISK");
  const [result, setResult] = useState<RiskResult | null>(null);
  const [running, setRunning] = useState(false);
  const [runId, setRunId] = useState(0);
  const [showMsg, setShowMsg] = useState(false);

  const run = (p = payment, a = address, h = history) => {
    setRunning(true);
    setShowMsg(false);
    setResult(null);
    setTimeout(() => {
      setResult(calculateRisk(p, a, h));
      setRunning(false);
      setRunId((x) => x + 1);
    }, 900);
  };

  const applyScenario = (s: (typeof scenarios)[number]) => {
    setPayment(s.p); setAddress(s.a); setHistory(s.h);
    run(s.p, s.a, s.h);
    document.getElementById("engine-console")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Section id="engine" className="bg-plum-deep text-primary-foreground">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Scene 11–12 · Working product</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,4.25rem)] font-extrabold uppercase leading-[0.95]">Three signals.<br />One explainable decision.</h2>
          </div>
          <p className="max-w-sm text-sm opacity-75">V1 rules-based risk engine. No machine learning, no AI, no probability score — every decision can be explained in one line.</p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
          {["Order", "Risk engine", "Decision", "Action"].map((x, i) => (
            <span key={x} className="flex items-center gap-2">
              {i > 0 && <span className="text-orange">→</span>}
              <span className="flex items-center gap-2 rounded-full border border-primary-foreground/25 px-3 py-1.5"><span className="grid h-5 w-5 place-items-center rounded-full bg-pink text-[10px] text-primary">{i + 1}</span>{x}</span>
            </span>
          ))}
        </div>

        <div id="engine-console" className="mt-12 overflow-hidden rounded-3xl bg-card text-card-foreground shadow-lift">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-primary px-6 py-4 text-primary-foreground">
            <div>
              <p className="font-display text-lg font-extrabold uppercase tracking-wide">Meesho Delivery Intelligence</p>
              <p className="text-xs opacity-75">Valmo RTO Prevention · Prototype</p>
            </div>
            <span className="rounded-full bg-pink px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">V1 rules-based</span>
          </div>

          <div className="grid lg:grid-cols-[300px_1fr_1fr]">
            <aside className="border-b p-6 lg:border-b-0 lg:border-r">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Order</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-primary">{demoOrder.id}</p>
              <dl className="mt-5 space-y-3 text-sm">
                {[["Product", demoOrder.product], ["Value", demoOrder.value], ["Payment", payment === "COD" ? "COD" : "Prepaid"], ["Location", demoOrder.location]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>
                ))}
                <div><dt className="text-muted-foreground">Address</dt><dd className="mt-1 font-semibold leading-snug">{demoOrder.address.map((l) => <span key={l} className="block">{l}</span>)}</dd></div>
              </dl>
              <div className="mt-6 rounded-2xl bg-muted p-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Address checks</p>
                <ul className="mt-2 space-y-1 text-xs">{addressChecks.map((c) => <li key={c} className="flex gap-2"><span className="text-orange">·</span>{c}</li>)}</ul>
              </div>
            </aside>

            <div className="space-y-7 border-b p-6 lg:border-b-0 lg:border-r">
              <Control n="01" label="Payment type">
                {(["COD", "PREPAID"] as Payment[]).map((p) => <Pill key={p} size="lg" active={payment === p} onClick={() => setPayment(p)}>{p}</Pill>)}
              </Control>
              <Control n="02" label="Address">
                {(["CLEAN", "MEDIUM", "HIGH"] as AddressQuality[]).map((a) => <Pill key={a} size="lg" active={address === a} onClick={() => setAddress(a)}>{a}</Pill>)}
              </Control>
              <Control n="03" label="Customer refusal history · last 10 orders">
                {(["NEW", "RELIABLE", "AT_RISK"] as History[]).map((h) => <Pill key={h} size="lg" active={history === h} onClick={() => setHistory(h)}>{h.replace("_", "-")}</Pill>)}
              </Control>
              <p className="text-xs text-muted-foreground">New / no history → reliable by default. 0–1 refusals → reliable. 2+ refusals → at-risk.<br /><b>History is account-level, not individual-level.</b></p>
              <button onClick={() => run()} className="w-full rounded-2xl bg-orange py-4 font-display text-lg font-extrabold uppercase tracking-wider text-orange-foreground shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60" disabled={running}>
                {running ? "Checking…" : "Run delivery check →"}
              </button>
            </div>

            <div className="p-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Result</p>
              {!result && !running && <p className="mt-6 text-sm text-muted-foreground">Choose the signals and run the check.</p>}
              {running && (
                <div className="mt-6 space-y-3">
                  {["Payment type", "Address", "Refusal history"].map((s) => (
                    <div key={s} className="relative overflow-hidden rounded-xl bg-muted px-4 py-3 text-sm font-semibold text-muted-foreground">
                      Checking {s.toLowerCase()}…
                      <span className="animate-scan absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-pink/60 to-transparent" />
                    </div>
                  ))}
                </div>
              )}
              {result && (
                <div key={runId} className="mt-4 space-y-5">
                  <div className={cn("animate-pop rounded-2xl px-5 py-4", stateTone[result.riskState])}>
                    <p className="text-[11px] font-bold uppercase tracking-widest opacity-75">Risk state</p>
                    <p className="font-display text-3xl font-extrabold uppercase">{result.riskState}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Why was this action triggered?</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {result.reason.map((r, i) => <span key={r} className="animate-pop rounded-full bg-pink-soft px-3 py-1.5 text-xs font-semibold text-primary" style={{ animationDelay: `${150 + i * 120}ms` }}>{r}</span>)}
                    </div>
                  </div>
                  <div className="animate-pop rounded-2xl border-2 border-primary p-4" style={{ animationDelay: "550ms" }}>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Action</p>
                    <p className="font-display text-xl font-extrabold uppercase text-primary">{result.recommendedAction}</p>
                    {result.message && <p className="mt-2 rounded-xl bg-wa-bubble px-3 py-2 text-sm">WhatsApp: "{result.message}"</p>}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Message</p>
                    {result.messageType === "NONE" ? (
                      <p className="mt-1 text-sm">No message needed. Order ships as usual.</p>
                    ) : (<>
                      <button onClick={() => { setShowMsg(true); setTimeout(() => document.getElementById("message")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); }} className="mt-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">Preview message →</button>
                      <p className="mt-2 text-xs text-muted-foreground">Ignored? The order ships normally.</p></>
                    )}
                  </div>
                  <div className="rounded-2xl bg-muted p-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Demo · what if delivery still fails?</p>
                    <button onClick={() => document.getElementById("recovery")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="mt-2 rounded-full bg-orange px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-orange-foreground">Delivery refused → Recovery engine</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-5">
          {["Never block", "Never penalise", "One message max", "No history ≠ high risk", "Ignored → ships normally"].map((g) => (
            <div key={g} className="rounded-2xl border border-primary-foreground/20 px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">{g}</div>
          ))}
        </div>
        <p className="mt-8 text-center font-display text-2xl font-bold text-pink">"Risk is a reason to help the customer — not a reason to reject them."</p>
      </Section>

      <MessagePreview type={showMsg && result ? result.messageType : result?.messageType ?? "COMBINED"} highlighted={showMsg} />

      <Section id="try" tone="white">
        <p className="eyebrow">Demo mode · Try to break the engine</p>
        <h2 className="headline mt-4">Try another order.</h2>
        <p className="mt-4 max-w-xl text-foreground/75">Each preset sets the signals and runs the real rules. The result appears in the console above.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {scenarios.map((s) => {
            const r = calculateRisk(s.p, s.a, s.h);
            return (
              <button key={s.name} onClick={() => applyScenario(s)} className="group rounded-3xl border-2 border-border bg-background p-5 text-left transition-all hover:-translate-y-1 hover:border-primary hover:shadow-soft">
                <p className="text-xs font-bold uppercase tracking-widest text-orange">{s.name}</p>
                <p className="mt-2 font-display text-lg font-extrabold leading-tight text-primary">{s.p === "COD" ? "COD" : "Prepaid"} + {cap(s.a)} + {s.h === "AT_RISK" ? "At-risk" : cap(s.h)}</p>
                <p className="mt-4 text-sm text-muted-foreground">→ {r.recommendedAction}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-primary group-hover:text-orange">Run →</p>
              </button>
            );
          })}
        </div>
      </Section>
    </>
  );
}

function cap(s: string) { return s.charAt(0) + s.slice(1).toLowerCase(); }

function Control({ n, label, children }: { n: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground"><span className="text-orange">{n}</span> · {label}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

const messages: Record<Exclude<MessageType, "NONE">, { text: string[]; buttons: string[]; label: string }> = {
  ADDRESS: { label: "Address risk", text: ["Hi Sunita, your Meesho order is almost ready to ship.", "Please confirm your house number / landmark before dispatch."], buttons: ["Confirm address", "Add landmark"] },
  INTENT: { label: "Intent risk", text: ["Hi Sunita, still want this order?", "Confirm your intent or choose a better delivery time."], buttons: ["Yes, I'd like it", "Choose delivery time"] },
  COMBINED: { label: "Combined risk · one message", text: ["Hi Sunita, your Meesho order is almost ready to ship.", "Please confirm your order and correct your delivery address before dispatch."], buttons: ["Confirm order", "Correct address"] },
};

export function MessagePreview({ type, highlighted }: { type: MessageType; highlighted?: boolean }) {
  const [tab, setTab] = useState<Exclude<MessageType, "NONE">>("COMBINED");
  const [tapped, setTapped] = useState<string | null>(null);
  useEffect(() => { if (type !== "NONE") setTab(type); setTapped(null); }, [type, highlighted]);
  const m = messages[tab];
  return (
    <Section id="message" tone="pink">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="eyebrow">Scene 13 · Customer message</p>
          <h2 className="headline mt-4 text-[clamp(2rem,4.5vw,3.75rem)]">One message.<br />Never more.</h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {(Object.keys(messages) as (keyof typeof messages)[]).map((k) => <Pill key={k} active={tab === k} onClick={() => { setTab(k); setTapped(null); }}>{messages[k].label}</Pill>)}
          </div>
          <div className="mt-10 rounded-3xl bg-card p-6 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-widest text-orange">If the customer ignores it</p>
            <p className="mt-2 font-display text-2xl font-extrabold uppercase text-primary">→ Order continues normally.</p>
            <div className="mt-4 flex flex-wrap gap-2">{["No cancellation", "No penalty", "No block"].map((x) => <span key={x} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{x}</span>)}</div>
          </div>
        </div>
        <Phone title="Meesho" subtitle="Order updates">
          <div key={tab} className="animate-pop rounded-2xl rounded-tl-sm bg-card p-3 text-sm shadow-soft">
            {m.text.map((t) => <p key={t} className="mb-2 last:mb-0">{t}</p>)}
            <p className="mt-1 text-right text-[10px] text-muted-foreground">2:14 PM</p>
          </div>
          <div className="mt-2 space-y-1.5">
            {m.buttons.map((b) => (
              <button key={b} onClick={() => setTapped(b)} className={cn("w-full rounded-xl py-2.5 text-sm font-semibold transition-colors", tapped === b ? "bg-wa-head text-primary-foreground" : "bg-card text-wa-head")}>{b}</button>
            ))}
          </div>
          {tapped && <div className="animate-pop ml-auto mt-3 w-fit rounded-2xl rounded-tr-sm bg-wa-bubble px-3 py-2 text-sm">{tapped}</div>}
        </Phone>
      </div>
    </Section>
  );
}

export function Phone({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[360px] rounded-[2.75rem] bg-plum-deep p-3 shadow-lift">
      <div className="overflow-hidden rounded-[2.2rem] bg-wa-bg">
        <div className="flex items-center gap-3 bg-wa-head px-5 pb-3 pt-6 text-primary-foreground">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-pink font-display text-sm font-extrabold text-primary">M</div>
          <div><p className="text-sm font-bold">{title}</p><p className="text-[11px] opacity-80">{subtitle}</p></div>
        </div>
        <div className="min-h-[420px] p-4">{children}</div>
      </div>
    </div>
  );
}
