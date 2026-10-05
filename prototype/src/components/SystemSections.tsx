import { useState } from "react";
import { cohorts, cohortDefaults, guardrails, recoveryClock, recoveryPreferences, sources, validationQuestions } from "@/lib/data";
import { Bar, Pill, SampleTag, Section } from "./ui-story";
import { cn } from "@/lib/utils";

export function StepBadge({ n, className }: { n: number; className?: string }) {
  return <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary font-display text-xs font-extrabold text-primary-foreground", className)}>{n}</span>;
}

const journey = [
  ["Customer places a COD order", "Sunita orders a kurta set, cash on delivery."],
  ["Risk engine checks payment + address + history", "Three signals. No black box."],
  ["System identifies the specific risk", "Address risk, intent risk, or both."],
  ["One lightweight WhatsApp nudge", "One message. Never a block, never a cancellation."],
  ["Customer confirms / corrects / reschedules", "If she ignores it, the order still ships."],
  ["Order reaches the customer", "Most orders end here."],
  ["Delivery still fails → recovery engine", "One evidence-backed second chance before the ₹120 return."],
  ["Only unresolved orders become RTO", "RTO is the last step, not the first."],
] as const;

export function SystemJourney() {
  const [i, setI] = useState(0);
  return (
    <Section id="journey" tone="white">
      <p className="eyebrow">One missed doorbell · the system in 8 clicks</p>
      <h2 className="headline mt-4 text-[clamp(2rem,4.5vw,3.75rem)]">Follow one order through the system.</h2>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <ol className="space-y-2">
          {journey.map(([t], k) => (
            <li key={t}>
              <button onClick={() => setI(k)} className={cn("flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors", k === i ? "bg-primary text-primary-foreground" : k < i ? "bg-pink-soft text-primary" : "bg-muted text-foreground/70")}>
                <StepBadge n={k + 1} className={k === i ? "bg-pink text-primary" : ""} />{t}
              </button>
            </li>
          ))}
        </ol>
        <div className="flex flex-col justify-between rounded-3xl bg-background p-8">
          <div key={i} className="animate-pop">
            <p className="text-xs font-bold uppercase tracking-widest text-orange">Step {i + 1} of {journey.length}</p>
            <p className="mt-2 font-display text-3xl font-extrabold uppercase leading-tight text-primary">{journey[i]![0]}</p>
            <p className="mt-4 text-lg text-foreground/75">{journey[i]![1]}</p>
          </div>
          <div className="mt-8 flex gap-2">
            <button onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0} className="flex-1 rounded-full border-2 border-primary py-3 text-xs font-bold uppercase tracking-wider text-primary disabled:opacity-40">Back</button>
            <button onClick={() => setI((i + 1) % journey.length)} className="flex-1 rounded-full bg-orange py-3 text-xs font-bold uppercase tracking-wider text-orange-foreground">{i === journey.length - 1 ? "Start again" : "Next step →"}</button>
          </div>
        </div>
      </div>
    </Section>
  );
}

const pillars = [
  ["Prevent", "Risk engine catches address, payment and history risk before dispatch."],
  ["Recover", "Refused or undelivered orders get one evidence-backed second chance."],
  ["Adapt", "Different behavioural and geographic cohorts get different defaults."],
  ["Learn", "Control-group testing decides what scales."],
] as const;

export function Differentiation() {
  return (
    <Section id="solution" tone="white">
      <p className="eyebrow">The solution</p>
      <h2 className="headline mt-4">Not just a risk score.</h2>
      <p className="mt-4 max-w-2xl text-lg text-foreground/75">A closed loop: prevent what we can, recover what we can't, and scale only what the pilot proves.</p>
      <div className="mt-12 grid gap-4 md:grid-cols-4">
        {pillars.map(([t, b], k) => (
          <div key={t} className={cn("rounded-3xl p-7", k % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-pink text-primary")}>
            <StepBadge n={k + 1} className={k % 2 === 0 ? "bg-pink text-primary" : ""} />
            <p className="mt-4 font-display text-3xl font-extrabold uppercase">{t}</p>
            <p className="mt-3 text-sm opacity-90">{b}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 font-display text-lg font-extrabold uppercase text-primary">
        {["Prevent", "Recover", "Adapt", "Learn", "Scale"].map((x, k) => (
          <span key={x} className="flex items-center gap-2">{k > 0 && <span className="text-orange">→</span>}<span className={cn("rounded-full border-2 px-4 py-1.5", x === "Scale" ? "border-orange text-orange" : "border-primary")}>{x}</span></span>
        ))}
      </div>
      <a href="#engine" className="mt-12 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-primary"><span className="border-b-2 border-orange pb-1">Open the working product</span>→</a>
    </Section>
  );
}

export function RecoveryFlow() {
  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl bg-card p-7 shadow-soft">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Recovery flow</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
          {["NDR", "Recovery window", "Recovery options"].map((x, k) => (
            <span key={x} className="flex items-center gap-2">{k > 0 && <span className="text-orange">→</span>}<span className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5"><StepBadge n={k + 1} className="h-5 w-5 text-[10px]" />{x}</span></span>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold">
          <p className="rounded-xl bg-primary px-4 py-3 text-primary-foreground">Resolved → Delivered</p>
          <p className="rounded-xl bg-orange px-4 py-3 text-orange-foreground">Unresolved → RTO</p>
        </div>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Customer preference after a miss</p>
        <div className="mt-3 space-y-3">{recoveryPreferences.map((p, k) => <Bar key={p.label} label={p.label} pct={p.pct} tone={k === 3 ? "orange" : "plum"} />)}</div>
        <p className="mt-4 text-xs text-muted-foreground">Research inputs, not guaranteed production outcomes. {sources.survey}</p>
      </div>
      <div className="rounded-3xl border-2 border-dashed border-primary/30 p-7">
        <p className="text-[11px] font-bold uppercase tracking-widest text-orange">Recovery clock · proposal</p>
        <ol className="mt-4 space-y-3">
          <li className="flex items-start gap-3"><StepBadge n={1} /><div><p className="font-display text-lg font-extrabold text-primary">NDR generated</p><p className="text-sm text-foreground/70">Order is not marked RTO yet.</p></div></li>
          <li className="flex items-start gap-3"><StepBadge n={2} /><div><p className="font-display text-lg font-extrabold text-primary">{recoveryClock.windowHours} hours</p><p className="text-sm text-foreground/70">Customer recovery window to resolve the NDR.</p></div></li>
          <li className="flex items-start gap-3"><StepBadge n={3} /><div><p className="font-display text-lg font-extrabold text-primary">Recovery accepted?</p><p className="text-sm text-foreground/70"><b>Yes</b> → resolve delivery. <b>No</b> → normal RTO.</p></div></li>
        </ol>
        <div className="mt-5 rounded-2xl bg-muted p-4 text-sm">
          <p className="font-bold text-primary">Hub hold: {recoveryClock.hubHoldHours} hours</p>
          <p className="mt-1 text-foreground/70">Only if a physical hub hold is available and accepted. The 36-hour window resolves the NDR; the 48–72 hours apply only after an approved hold — no contradiction.</p>
        </div>
        <p className="mt-5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">No endless chasing · maximum</p>
        <div className="mt-2 flex flex-wrap gap-2">{recoveryClock.limits.map((l) => <SampleTag key={l}>{l}</SampleTag>)}</div>
        <p className="mt-3 text-xs text-muted-foreground">Then normal RTO. Proposal only — not an existing Valmo SOP.</p>
      </div>
    </div>
  );
}

export function CohortDefaults() {
  const [id, setId] = useState(cohorts[0]!.id);
  const c = cohorts.find((x) => x.id === id)!;
  const d = cohortDefaults[id]!;
  return (
    <Section id="cohorts" tone="white">
      <p className="eyebrow">Behavioural user cohorts · India is not one market</p>
      <h2 className="headline mt-4 text-[clamp(2rem,4.5vw,3.75rem)]">One recovery system.<br />Different defaults.</h2>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {cohorts.filter((x) => x.id !== "new").map((x) => (
          <button key={x.id} onClick={() => setId(x.id)} className={cn("rounded-2xl p-4 text-left transition-colors", id === x.id ? "bg-primary text-primary-foreground" : "bg-background")}>
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-70">{cohortDefaults[x.id]!.tier}</p>
            <p className="mt-1 font-display text-lg font-extrabold">→ {cohortDefaults[x.id]!.defaults.join(" + ")}</p>
          </button>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-2">{cohorts.map((x) => <Pill key={x.id} size="lg" active={id === x.id} onClick={() => setId(x.id)}>{x.name} · n={x.n}</Pill>)}</div>
      <div key={id} className="mt-6 grid gap-6 rounded-3xl bg-background p-8 md:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="font-display text-3xl font-extrabold text-primary">{c.name}</p>
          <p className="mt-2 flex flex-wrap gap-2"><SampleTag>n={c.n}</SampleTag><SampleTag>{d.tier}</SampleTag>{c.directional && <SampleTag warn>Directional — small sample</SampleTag>}</p>
          <p className="mt-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Default recovery</p>
          <ol className="mt-2 space-y-2">{d.defaults.map((x, k) => <li key={x} className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 text-sm font-semibold"><StepBadge n={k + 1} />{x}</li>)}</ol>
          {d.finding && <p className="mt-4 text-sm"><b className="font-display text-xl text-orange">{d.finding}</b></p>}
          {c.extra && <div className="mt-4 space-y-2">{c.extra.map((e) => <p key={e.label} className="rounded-xl bg-card px-4 py-3 text-sm"><b className="font-display text-xl text-orange">{e.pct}%</b> {e.label.toLowerCase()}</p>)}</div>}
        </div>
        <div className="space-y-4">
          <Bar label="Reschedule" pct={c.reschedule} tone="plum" />
          <Bar label="Alternate receiver" pct={c.alternate} tone="plum" />
          <Bar label="Self-collect" pct={c.selfCollect} tone="orange" />
          <Bar label="Share live location" pct={c.liveLocation} />
          <Bar label="Explain by phone" pct={c.phone} />
          <p className="text-xs text-muted-foreground">{sources.survey} Cohort findings — not national behaviour.</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <p className="rounded-3xl bg-primary p-6 font-display text-xl font-extrabold text-primary-foreground">No history is not a risk signal.<br /><span className="text-pink">This is our policy choice.</span></p>
        <p className="rounded-3xl border-2 border-primary p-6 font-display text-xl font-extrabold text-primary">The system adapts the default intervention — never the customer's eligibility.</p>
      </div>
    </Section>
  );
}

export function GuardrailsPanel() {
  return (
    <Section id="guardrails" tone="white">
      <p className="eyebrow">Guardrails</p>
      <h2 className="headline mt-4 text-[clamp(2rem,4.5vw,3.75rem)]">Seven rules the system never breaks.</h2>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {guardrails.map(([t, b], k) => (
          <div key={t} className="rounded-3xl bg-background p-6">
            <StepBadge n={k + 1} />
            <p className="mt-3 font-display text-xl font-extrabold uppercase text-primary">{t}</p>
            <p className="mt-2 text-sm text-foreground/75">{b}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-primary p-7 text-primary-foreground">
          <p className="text-xs font-bold uppercase tracking-widest text-pink">Operational risk · fake or weak attempts</p>
          <p className="mt-3 text-sm opacity-85"><b>Problem:</b> a recovery system could accidentally reward poor delivery attempts or create false RTOs.</p>
          <p className="mt-2 text-sm opacity-85"><b>Guardrail:</b> logged call attempts + geotagged attempt evidence before certain recovery or hold actions are allowed.</p>
          <p className="mt-4 font-display text-lg font-bold text-pink">Measure fake/weak attempts in pilot — do not assume their scale.</p>
        </div>
        <div className="rounded-3xl border-2 border-dashed border-orange p-7">
          <p className="text-xs font-bold uppercase tracking-widest text-orange">Validate before scale · open questions for Meesho / Valmo</p>
          <ol className="mt-4 space-y-2">{validationQuestions.map((q, k) => <li key={q} className="flex items-center gap-3 text-sm font-semibold"><StepBadge n={k + 1} className="h-6 w-6 text-[10px]" />{q}</li>)}</ol>
          <p className="mt-4 text-xs text-muted-foreground">Open validation questions — not confirmed facts.</p>
        </div>
      </div>
    </Section>
  );
}
