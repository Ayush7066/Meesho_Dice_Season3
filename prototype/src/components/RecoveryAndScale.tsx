import { useState } from "react";
import { casePack, plan90, rtoHypothesisPer100, sources } from "@/lib/data";
import { RecoveryFlow, StepBadge } from "./SystemSections";
import { getRecoveryAction, recoveryPriority, type FailureReason } from "@/lib/engine";
import { Phone } from "./RiskEngine";
import { Bar, CountUp, Pill, Reveal, SampleTag, Section, useInView } from "./ui-story";
import { cn } from "@/lib/utils";

const reasons: { id: FailureReason; label: string }[] = [
  { id: "NOT_HOME", label: "I wasn't home" },
  { id: "SOMEONE_ELSE", label: "Someone else can receive" },
  { id: "CANT_FIND", label: "Rider can't find me" },
  { id: "DONT_WANT", label: "I don't want it anymore" },
];

export function Recovery() {
  const [reason, setReason] = useState<FailureReason | null>(null);
  const [option, setOption] = useState<string | null>(null);
  const r = reason ? getRecoveryAction(reason) : null;
  return (
    <Section id="recovery">
      <p className="eyebrow">Recovery engine · when prevention fails</p>
      <h2 className="headline mt-4">Second chance before the ₹120 return.</h2>
      <p className="mt-6 max-w-2xl text-lg text-foreground/75">Customer refuses, delivery fails, or an NDR is generated. We don't mark it RTO straight away — the customer gets one simple question.</p>
      <RecoveryFlow />
      <div className="mt-14 grid items-start gap-12 lg:grid-cols-[380px_1fr]">
        <Phone title="Meesho" subtitle="Delivery attempt · failed">
          <div className="rounded-2xl rounded-tl-sm bg-card p-3 text-sm shadow-soft">
            <p>Hi Sunita, our delivery partner couldn't complete your delivery today.</p>
            <p className="mt-2 font-semibold">What happened?</p>
          </div>
          <div className="mt-2 space-y-1.5">
            {reasons.map((x) => (
              <button key={x.id} onClick={() => { setReason(x.id); setOption(null); }} className={cn("w-full rounded-xl py-2.5 text-sm font-semibold transition-colors", reason === x.id ? "bg-wa-head text-primary-foreground" : "bg-card text-wa-head")}>{x.label}</button>
            ))}
          </div>
          {r && (
            <div key={reason} className="animate-pop mt-3 rounded-2xl rounded-tl-sm bg-card p-3 text-sm shadow-soft">
              {r.rescuable ? <p className="font-semibold">{r.recommendedRecovery === "Reschedule" ? "Pick a time that works:" : r.recommendedRecovery === "Alternate receiver" ? "Who can receive it?" : "Help the rider find you:"}</p> : <p>Understood. We'll process the return as usual.</p>}
              <div className="mt-2 space-y-1.5">
                {r.availableOptions.map((o) => <button key={o} onClick={() => setOption(o)} className={cn("w-full rounded-lg border px-3 py-2 text-left text-xs font-semibold", option === o ? "border-wa-head bg-wa-bubble" : "border-border")}>{o}</button>)}
              </div>
            </div>
          )}
          {option && <div className="animate-pop ml-auto mt-3 w-fit rounded-2xl rounded-tr-sm bg-wa-bubble px-3 py-2 text-sm">{option} ✓</div>}
        </Phone>

        <div className="space-y-6">
          <div className="rounded-3xl bg-card p-7 shadow-soft">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Recovery engine output</p>
            {!r && <p className="mt-4 text-muted-foreground">Pick what happened on the phone to see the recommendation change.</p>}
            {r && (
              <div key={reason} className="mt-3">
                <p className={cn("animate-pop font-display text-4xl font-extrabold uppercase", r.rescuable ? "text-primary" : "text-orange")}>{r.recommendedRecovery}</p>
                <p className="mt-3 text-foreground/75">{r.note}</p>
                {r.priority && <p className="mt-3"><SampleTag>Priority {r.priority} of 4</SampleTag></p>}
              </div>
            )}
          </div>
          <div className="rounded-3xl bg-card p-7 shadow-soft">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Default recovery priority</p>
            <ol className="mt-4 space-y-2">
              {recoveryPriority.map((p, i) => (
                <li key={p} className={cn("flex items-center gap-4 rounded-xl px-4 py-3 transition-colors", r?.priority === i + 1 ? "bg-primary text-primary-foreground" : "bg-muted")}>
                  <span className="font-display text-lg font-extrabold">{i + 1}</span><span className="font-semibold">{p}</span>
                  {i === 3 && <span className="ml-auto text-xs opacity-75">6% · fallback</span>}
                </li>
              ))}
            </ol>
            <p className="mt-5 font-display text-lg font-bold text-primary">Self-collection is a fallback, not the default.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Operations() {
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Operations · protect Ravi</p>
          <h2 className="headline mt-4 text-[clamp(2rem,4vw,3.5rem)]">The rider shouldn't pay for our experiment.</h2>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-card p-5 shadow-soft"><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Risk check</p><p className="mt-1 font-display text-xl font-extrabold text-primary">Before dispatch</p></div>
            <div className="rounded-2xl bg-card p-5 shadow-soft"><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Rider pay</p><p className="mt-1 font-display text-xl font-extrabold text-primary">Unchanged</p></div>
          </div>
          <div className="mt-4 rounded-2xl bg-primary p-6 text-primary-foreground">
            <p className="text-xs font-bold uppercase tracking-widest text-pink">Proposed guardrail · hub hold</p>
            <p className="mt-2 font-display text-xl font-bold">Logged attempt + location evidence → eligible hold.</p>
            <p className="mt-1 text-sm opacity-80">Hub payment only after actual collection. Not Valmo's current production workflow.</p>
          </div>
        </div>
        <div className="rounded-3xl border-2 border-dashed border-primary/30 p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-orange">Hub / self-collection</p>
          <p className="mt-2 font-display text-4xl font-extrabold uppercase text-primary">Selective fallback</p>
          <p className="mt-4 text-lg">Only <b>6%</b> choose self-collection. 22% would not travel at all.</p>
          <div className="mt-6 space-y-3">
            <Bar label="Would travel under 500m" pct={40} />
            <Bar label="Would not travel" pct={22} tone="orange" />
            <Bar label="Pay by UPI at collection" pct={66} tone="plum" />
          </div>
          <p className="mt-6 rounded-xl bg-muted px-4 py-3 text-sm font-semibold">Operational validation required. COD self-collection at pickup points and nearby-agent payment are future hypotheses, not current capabilities.</p>
        </div>
      </div>
    </Section>
  );
}

export function Economics() {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const [cost, setCost] = useState(21);
  const ok = cost <= casePack.ceiling;
  return (
    <Section id="economics" tone="plum">
      <p className="eyebrow">Economics</p>
      <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,5rem)] font-extrabold uppercase leading-[0.95]">Stop at ₹99.</h2>
      <div ref={ref} className="mt-12 flex flex-wrap items-end gap-6 font-display font-extrabold">
        {[["₹120", "Reverse cost"], ["−", ""], ["₹21", "Additional last-mile attempt"], ["=", ""], ["₹99", "Recovery cost ceiling"]].map(([v, l], i) => (
          <div key={i} className={cn("transition-all duration-700", inView ? "opacity-100" : "translate-y-4 opacity-0")} style={{ transitionDelay: `${i * 250}ms` }}>
            <p className={cn(l ? "text-6xl md:text-7xl" : "pb-6 text-4xl opacity-50", i === 4 && "text-pink")}>{v}</p>
            {l && <p className="font-sans text-xs font-semibold uppercase tracking-wider opacity-70">{l}</p>}
          </div>
        ))}
      </div>
      <p className="mt-10 max-w-2xl text-lg opacity-85">If the incremental recovery cost approaches or exceeds the reverse cost we're trying to avoid, don't rescue the order.</p>

      <div className="mt-10 rounded-3xl bg-card p-7 text-card-foreground">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Money meter · incremental recovery cost per order</p>
          <p className="font-display text-4xl font-extrabold text-primary">₹{cost}</p>
        </div>
        <input type="range" min={0} max={150} value={cost} onChange={(e) => setCost(+e.target.value)} className="mt-5 w-full accent-[var(--orange)]" aria-label="Incremental recovery cost" />
        <div className="relative mt-2 h-3 rounded-full bg-muted">
          <div className={cn("h-full rounded-full transition-all", ok ? "bg-primary" : "bg-orange")} style={{ width: `${(cost / 150) * 100}%` }} />
          <span className="absolute -top-1 h-5 w-0.5 bg-orange" style={{ left: `${(99 / 150) * 100}%` }} />
          <span className="absolute -top-1 h-5 w-0.5 bg-foreground/40" style={{ left: `${(120 / 150) * 100}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-[11px] font-semibold text-muted-foreground"><span>₹0</span><span>₹99 ceiling · ₹120 reverse</span><span>₹150</span></div>
        <p className={cn("mt-5 font-display text-2xl font-extrabold uppercase", ok ? "text-primary" : "text-orange")}>{ok ? "Worth attempting recovery" : "Don't rescue — let the standard flow run"}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wider">
          <SampleTag>{sources.casePack}</SampleTag><SampleTag>Pilot recovery only below ₹99 per rescued order</SampleTag>
          <SampleTag>Not a vendor quote</SampleTag><SampleTag>Not a guaranteed saving</SampleTag><SampleTag>Not expected ROI</SampleTag>
        </div>
      </div>
    </Section>
  );
}

export function Experiment() {
  return (
    <Section id="experiment" tone="white">
      <p className="eyebrow">Experiment</p>
      <h2 className="headline mt-4">We don't claim impact yet.<br /><span className="text-orange">We test it.</span></h2>
      <div className="mt-12 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
        <Reveal><div className="h-full rounded-3xl bg-muted p-8"><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Control</p><p className="mt-2 font-display text-3xl font-extrabold text-primary">Normal process</p></div></Reveal>
        <p className="self-center text-center font-display text-xl font-extrabold uppercase text-muted-foreground">vs</p>
        <Reveal delay={150}><div className="h-full rounded-3xl bg-primary p-8 text-primary-foreground"><p className="text-xs font-bold uppercase tracking-widest text-pink">Treatment</p><p className="mt-2 font-display text-3xl font-extrabold">Risk engine + recovery</p></div></Reveal>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="rounded-3xl border-2 border-orange p-6"><p className="text-xs font-bold uppercase tracking-widest text-orange">Primary metric</p><p className="mt-2 font-display text-2xl font-extrabold text-primary">RTO rate vs control</p></div>
        <div className="rounded-3xl bg-background p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Secondary</p>
          <div className="mt-3 flex flex-wrap gap-2">{["Orders rescued", "Cost per rescued order", "Customer friction", "Complaints", "Rider impact", "Hub impact"].map((m) => <span key={m} className="rounded-full bg-card px-4 py-2 text-sm font-semibold shadow-soft">{m}</span>)}</div>
        </div>
      </div>
    </Section>
  );
}

export function Plan() {
  const [open, setOpen] = useState(0);
  const p = plan90[open]!;
  return (
    <Section id="plan">
      <p className="eyebrow">30 / 60 / 90 test plan</p>
      <h2 className="headline mt-4">Pilot. Measure. Gate. Expand.</h2>
      <div className="mt-10 grid gap-3 md:grid-cols-3">
        {plan90.map((x, i) => (
          <button key={x.t} onClick={() => setOpen(i)} className={cn("rounded-3xl p-6 text-left transition-colors", open === i ? "bg-primary text-primary-foreground" : "bg-card shadow-soft")}>
            <p className="text-xs font-bold uppercase tracking-widest text-orange">{x.d}</p>
            <p className="mt-1 font-display text-4xl font-extrabold uppercase">{x.t}</p>
          </button>
        ))}
      </div>
      <div key={open} className="animate-pop mt-6 grid gap-6 rounded-3xl bg-card p-8 shadow-soft md:grid-cols-3">
        <div><p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground"><StepBadge n={1} />Test</p><ul className="mt-3 space-y-2 text-sm">{p.test.map((l) => <li key={l}>· {l}</li>)}</ul>
          {p.hypothesis && <div className="mt-4 rounded-2xl bg-pink-soft p-4"><p className="font-display text-2xl font-extrabold text-primary">~{rtoHypothesisPer100} fewer RTOs / 100 orders</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-orange">{sources.hypothesis}</p></div>}
        </div>
        <div><p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground"><StepBadge n={2} />Measure</p><ul className="mt-3 space-y-2 text-sm">{p.measure.map((l) => <li key={l}>· {l}</li>)}</ul></div>
        <div><p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground"><StepBadge n={3} />Gate</p><p className="mt-3 font-display text-xl font-extrabold text-primary">{p.gate}</p></div>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 font-display text-lg font-extrabold uppercase text-primary">
        {["Pilot", "Measure", "Gate", "Expand"].map((x, i) => <span key={x} className="flex items-center gap-2">{i > 0 && <span className="text-orange">→</span>}<span className="rounded-full border-2 border-primary px-4 py-1.5">{x}</span></span>)}
      </div>
      <p className="mt-8 rounded-3xl bg-primary py-6 text-center font-display text-3xl font-extrabold uppercase text-primary-foreground">No evidence → no scale.</p>
    </Section>
  );
}

export function Risks() {
  const unsolved = [
    ["Hard refusals", "Some change-of-mind orders may still be unavoidable."],
    ["Valmo data calibration", "Our rules need actual Valmo data before scaling."],
    ["Small samples", "Town / village findings are directional."],
    ["Operational gaps", "Wrong-hub routing, incorrect attempt behaviour and other network-level issues need Valmo operational data."],
    ["Future test · unproven hypothesis", "Nearby-buyer / reseller re-offer."],
    ["Prepaid nudges · optional", "Any prepaid conversion is an optional lever to test — selection bias needs validation. COD is never forced to prepaid."],
  ];
  return (
    <>
      <Section tone="pink">
        <p className="eyebrow">Honesty</p>
        <h2 className="headline mt-4">What we haven't solved yet.</h2>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {unsolved.map(([t, b]) => (
            <div key={t} className="rounded-3xl bg-card p-6 shadow-soft">
              <p className="font-display text-xl font-extrabold uppercase text-primary">{t}</p>
              <p className="mt-2 text-foreground/75">{b}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

export function Final() {
  const loop = ["Prevent", "Recover", "Adapt", "Learn", "Scale"];
  return (
    <section className="bg-plum-deep px-5 py-28 text-primary-foreground md:px-10">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-display text-[clamp(2.4rem,6vw,5.5rem)] font-extrabold uppercase leading-[0.92]">One missed doorbell<br /><span className="text-pink">doesn't have to become an RTO.</span></h2>
        <div className="mx-auto mt-14 flex max-w-4xl flex-wrap items-center justify-center gap-3">
          {loop.map((l, i) => (
            <Reveal key={l} delay={i * 120} className="flex items-center gap-3">
              <span className="rounded-full border-2 border-pink px-5 py-2 font-display text-lg font-extrabold uppercase">{l}</span>
              {i < loop.length - 1 && <span className="text-orange">→</span>}
            </Reveal>
          ))}
        </div>
        <div className="mt-16 space-y-2 font-display text-2xl font-bold uppercase md:text-3xl">
          <p>This is not just a risk model.</p><p className="text-orange">It is a closed-loop RTO operating system.</p>
        </div>
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <a href="#top" className="rounded-full bg-pink px-7 py-4 text-sm font-bold uppercase tracking-wider text-primary">Replay the story</a>
          <a href="#try" className="rounded-full border-2 border-pink px-7 py-4 text-sm font-bold uppercase tracking-wider">Try another order</a>
        </div>
        <p className="mt-14 text-xs opacity-60">Illustrative product prototype for Meesho DICE Challenge Season 3 · Business Track. Not a live Valmo or Meesho system. Survey figures from our own two surveys; economics from the case pack.</p>
      </div>
    </section>
  );
}
