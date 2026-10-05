import { useEffect, useState } from "react";
import { casePack, surveyA, surveyB } from "@/lib/data";
import { Bar, CountUp, NextCta, Reveal, SampleTag, Section, useInView } from "./ui-story";
import { cn } from "@/lib/utils";

const journey = ["Customer", "Meesho order", "Valmo", "Delivery attempt", "Missed doorbell", "RTO"];

export function Hero() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % (journey.length + 2)), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <section id="top" className="relative overflow-hidden px-5 pb-24 pt-16 md:px-10 md:pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="eyebrow">Meesho DICE Challenge Season 3 · Business Track · Working Prototype</p>
          <h1 className="mt-6 font-display text-[clamp(3.2rem,9vw,7.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.04em] text-primary">
            One missed<br />doorbell.
          </h1>
          <p className="mt-6 max-w-lg text-xl text-foreground/80 md:text-2xl">How we turn a failed delivery into a second chance.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#doorbell" className="rounded-full bg-primary px-7 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5">Start the story →</a>
            <a href="#engine" className="rounded-full border-2 border-primary px-7 py-4 text-sm font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground">Try the risk engine →</a>
          </div>
          <p className="mt-8 text-xs text-muted-foreground">Illustrative product prototype — not a live Valmo system.</p>
        </div>
        <div className="rounded-3xl bg-card p-7 shadow-lift">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">An illustrative order journey</p>
          <ol className="mt-6 space-y-2">
            {journey.map((j, i) => {
              const active = step > i;
              const bad = i >= 4;
              return (
                <li key={j} className="flex items-center gap-4">
                  <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-xs font-bold transition-all duration-500",
                    active ? (bad ? "border-orange bg-orange text-orange-foreground" : "border-primary bg-primary text-primary-foreground") : "border-border text-muted-foreground")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={cn("font-display text-lg font-bold uppercase transition-colors duration-500", active ? (bad ? "text-orange" : "text-primary") : "text-muted-foreground/60")}>{j}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

const timeline = ["Ordered", "Shipped", "Local hub", "Out for delivery"];

export function SceneOneOrder() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [s, setS] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setS((x) => (x < 8 ? x + 1 : x)), 650);
    return () => clearInterval(t);
  }, [inView]);
  return (
    <Section id="doorbell" tone="white">
      <p className="eyebrow">Scene 01 · The story</p>
      <h2 className="headline mt-4">One order.<br />Everyone loses.</h2>
      <div ref={ref} className="mt-14 grid gap-6 md:grid-cols-2">
        {[{ name: "Sunita", role: "Illustrative customer", rows: [["Product", "Kurta"], ["Payment", "COD"], ["Location", "Small town"]], tone: "bg-pink-soft" },
          { name: "Ravi", role: "Illustrative delivery partner · Valmo delivery", rows: [["Route", "Local hub → Sunita"], ["Arrives", "2:00 PM"], ["Parcel", "COD · collect on delivery"]], tone: "bg-muted" }].map((p) => (
          <div key={p.name} className={cn("rounded-3xl p-7", p.tone)}>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{p.role}</p>
            <p className="mt-2 font-display text-4xl font-extrabold text-primary">{p.name}</p>
            <dl className="mt-5 space-y-2 text-sm">
              {p.rows.map(([k, v]) => <div key={k} className="flex justify-between border-b border-foreground/10 pb-2"><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>)}
            </dl>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border bg-background p-7">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {timeline.map((t, i) => (
            <div key={t} className={cn("rounded-2xl border-2 px-4 py-3 text-center text-xs font-bold uppercase tracking-wider transition-all duration-500", s > i ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground")}>{t}</div>
          ))}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[["2:00 PM", "Ravi reaches Sunita's location"], ["Call 1", "No answer"], ["Call 2", "No answer"]].map(([a, b], i) => (
            <div key={a} className={cn("rounded-2xl bg-card p-4 shadow-soft transition-all duration-500", s > 4 + i ? "opacity-100" : "translate-y-2 opacity-0")}>
              <p className="text-xs font-bold uppercase tracking-widest text-orange">{a}</p>
              <p className="mt-1 font-semibold">{b}</p>
            </div>
          ))}
        </div>
        <div className={cn("mt-6 rounded-2xl bg-orange px-5 py-4 text-center font-display text-2xl font-extrabold uppercase text-orange-foreground transition-all duration-500", s > 7 ? "opacity-100" : "opacity-0")}>
          Delivery failed. The parcel eventually returns.
        </div>
      </div>

      <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="flex flex-wrap items-end gap-4 font-display font-extrabold text-primary">
            <div><p className="text-5xl">₹{casePack.forward}</p><p className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground">Forward logistics</p></div>
            <p className="pb-5 text-3xl text-muted-foreground">+</p>
            <div><p className="text-5xl">₹{casePack.reverse}</p><p className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground">Reverse logistics</p></div>
            <p className="pb-5 text-3xl text-muted-foreground">=</p>
            <div><p className="text-6xl text-orange">₹{casePack.perFailure}</p><p className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground">At risk</p></div>
          </div>
          <p className="mt-8 font-display text-3xl font-extrabold uppercase leading-tight text-primary">One missed doorbell<br />≈ ₹170 of logistics at risk</p>
          <p className="mt-3 text-xs text-muted-foreground">Illustrative case-pack economics.</p>
        </Reveal>
        <Reveal delay={150}>
          <ul className="space-y-3">
            {["Customer doesn't get the product.", "Seller's inventory is tied up.", "Delivery effort doesn't become a successful delivery.", "Valmo bears avoidable reverse logistics cost."].map((c) => (
              <li key={c} className="flex gap-3 rounded-2xl bg-muted px-5 py-4 font-medium"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange" />{c}</li>
            ))}
          </ul>
        </Reveal>
      </div>
      <NextCta href="#pattern">See how often this happens</NextCta>
    </Section>
  );
}

export function SceneHundred() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const a = setTimeout(() => setPhase(1), 400);
    const b = setTimeout(() => setPhase(2), 1600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [inView]);
  // indices 0-79 COD, 80-99 prepaid. RTO: 16 COD spread, 1 prepaid.
  const rtoSet = new Set([3, 8, 14, 19, 22, 29, 33, 38, 44, 47, 53, 58, 61, 66, 72, 77, 91]);
  return (
    <Section id="pattern">
      <p className="eyebrow">Scene 02 · The pattern</p>
      <h2 className="headline mt-4">One order is a story.<br />100 orders reveal the pattern.</h2>
      <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div ref={ref} className="rounded-3xl bg-card p-6 shadow-soft">
          <div className="grid grid-cols-10 gap-2">
            {Array.from({ length: 100 }).map((_, i) => {
              const cod = i < 80;
              const rto = rtoSet.has(i);
              return (
                <div key={i} className={cn("aspect-square rounded-md transition-all duration-500",
                  phase === 0 ? "bg-muted" : phase === 2 && rto ? "scale-110 bg-orange" : cod ? "bg-primary/80" : "bg-pink")}
                  style={{ transitionDelay: `${phase === 1 ? i * 8 : rto ? i * 6 : 0}ms` }} />
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap gap-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-2"><i className="h-3 w-3 rounded bg-primary/80" />80 COD</span>
            <span className="flex items-center gap-2"><i className="h-3 w-3 rounded bg-pink" />20 Prepaid</span>
            <span className="flex items-center gap-2"><i className="h-3 w-3 rounded bg-orange" />17 RTO (16 COD · 1 prepaid)</span>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="font-display text-[8rem] font-extrabold leading-none text-orange"><CountUp to={casePack.codShareOfRtoPct} suffix="%" /></p>
          <p className="mt-2 text-lg font-semibold text-primary">16 of 17 RTOs in the case example were COD.</p>
          <p className="mt-1 text-sm text-muted-foreground">COD is disproportionately represented in the case's RTO volume.</p>
          <div className="mt-8 rounded-2xl bg-primary p-6 text-primary-foreground">
            <p className="font-display text-3xl font-extrabold">17 × ₹170 = ₹<CountUp to={casePack.total} /></p>
            <p className="mt-1 text-xs uppercase tracking-wider opacity-70">Illustrative case-pack economics</p>
          </div>
        </div>
      </div>
      <Reveal className="mt-14">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Returned undelivered by distance from hub · case-pack evidence</p>
        <div className="mt-5 grid grid-cols-3 gap-4">
          {casePack.distance.map((d, i) => (
            <div key={d.label} className="rounded-2xl bg-card p-5 shadow-soft">
              <p className="text-sm font-semibold text-muted-foreground">{d.label}</p>
              <p className="font-display text-5xl font-extrabold text-primary">{d.pct}%</p>
              <div className="mt-3 h-1.5 rounded-full bg-orange" style={{ width: `${40 + i * 30}%` }} />
            </div>
          ))}
        </div>
      </Reveal>
      <h3 className="mt-16 max-w-4xl font-display text-3xl font-extrabold uppercase leading-tight text-primary md:text-4xl">
        COD creates exposure. <span className="text-orange">Delivery conditions</span> determine whether it becomes RTO.
      </h3>
      <NextCta href="#surveys">So we asked customers why</NextCta>
    </Section>
  );
}

export function SceneSurveys() {
  const cards = [
    { s: surveyA, stats: [[surveyA.respondents, "unique respondents"], [surveyA.codUsers, "COD users"], [surveyA.everRefused.count, "had ever refused / missed"]], tone: "bg-primary text-primary-foreground", tag: "Before dispatch · intent" },
    { s: surveyB, stats: [[surveyB.respondents, "unique respondents"], [surveyB.codUsers, "COD users"], [surveyB.hadFailed, "had a failed COD delivery"]], tone: "bg-pink text-primary", tag: "After a failed attempt · recovery" },
  ] as const;
  return (
    <Section id="surveys" tone="white">
      <p className="eyebrow">Scene 03 · Evidence</p>
      <h2 className="headline mt-4">We didn't want to guess why orders fail.</h2>
      <p className="mt-6 max-w-2xl text-lg text-foreground/75">Two separate surveys. Two different questions. We never merge them.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.s.name} delay={i * 150}>
            <div className={cn("h-full rounded-3xl p-8", c.tone)}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">{c.s.name}</p>
                <span className="rounded-full bg-card/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">{c.tag}</span>
              </div>
              <p className="mt-2 font-display text-2xl font-bold">{c.s.title}</p>
              <p className="mt-6 font-display text-2xl font-semibold leading-snug md:text-3xl">"{c.s.question}"</p>
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-current/20 pt-6">
                {c.stats.map(([n, l]) => (
                  <div key={l}><p className="font-display text-4xl font-extrabold">{n}</p><p className="text-xs opacity-80">{l}</p></div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function SceneEvidence() {
  const r = surveyA.refusalReasons;
  const f = surveyB.failureReasons;
  return (
    <>
      <Section id="evidence">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Scene 04 · Survey A</p>
            <h2 className="headline mt-4 text-[clamp(2rem,4vw,3.5rem)]">Before dispatch, the problem is often intent.</h2>
            <div className="mt-10 flex items-end gap-6">
              <div className="rounded-3xl bg-primary p-6 text-primary-foreground">
                <p className="font-display text-6xl font-extrabold"><CountUp to={r.behaviouralPct} suffix="%" /></p>
                <p className="text-sm opacity-80">Behavioural reasons</p>
              </div>
              <div className="rounded-3xl bg-pink p-6 text-primary">
                <p className="font-display text-5xl font-extrabold"><CountUp to={r.availabilityPct} suffix="%" /></p>
                <p className="text-sm">Availability</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Among the {r.n} COD users who had ever refused or missed a COD order. <SampleTag warn>n=22 · directional</SampleTag></p>
            <blockquote className="mt-10 border-l-4 border-orange pl-5 font-display text-2xl font-bold leading-snug text-primary">
              Some COD failures are not delivery problems. They are intent problems.
            </blockquote>
            <p className="mt-3 text-sm text-muted-foreground">That's why we check refusal history before dispatch.</p>
          </div>
          <div className="rounded-3xl bg-card p-8 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Reasons for refusing / missing · n=22</p>
            <div className="mt-6 space-y-5">
              {r.items.map((it, i) => <Bar key={it.label} label={it.label} pct={it.pct} tone={it.kind === "behavioural" ? "plum" : "pink"} delay={i * 100} />)}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <div className="grid gap-14 lg:grid-cols-2">
          <div className="order-2 rounded-3xl bg-background p-8 lg:order-1">
            <div className="flex items-baseline gap-4">
              <p className="font-display text-8xl font-extrabold text-orange"><CountUp to={43} suffix="%" /></p>
              <p className="font-display text-2xl font-extrabold uppercase text-primary">Wasn't home</p>
            </div>
            <p className="text-sm text-muted-foreground">23 of 53 failed COD deliveries</p>
            <div className="mt-8 space-y-4">
              {f.items.slice(1).map((it, i) => <Bar key={it.label} label={it.label} pct={it.pct} max={43} delay={i * 80} />)}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="eyebrow">Scene 05 · Survey B</p>
            <h2 className="headline mt-4 text-[clamp(2rem,4vw,3.5rem)]">But the latest failure looks different.</h2>
            <p className="mt-6"><SampleTag>n=53 failed COD deliveries</SampleTag></p>
            <p className="mt-10 font-display text-3xl font-extrabold uppercase leading-tight text-primary">Availability is the biggest immediate failure.</p>
            <p className="mt-4 text-lg text-foreground/75">That means prevention and recovery need different logic.</p>
          </div>
        </div>
      </Section>

      <Section tone="pink">
        <p className="eyebrow">Scene 06 · The address insight</p>
        <h2 className="headline mt-4">Address is common.<br />But rarely the final cause.</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <Reveal>
            <div className="rounded-3xl bg-card p-8 shadow-soft">
              <p className="font-display text-8xl font-extrabold text-primary"><CountUp to={82} suffix="%" /></p>
              <p className="mt-3 text-lg">of COD users had <b>ever</b> faced difficulty because the rider couldn't find or reach their address.</p>
              <p className="mt-4"><SampleTag>Survey A · n=38</SampleTag></p>
            </div>
          </Reveal>
          <p className="text-center font-display text-2xl font-extrabold uppercase text-muted-foreground">vs</p>
          <Reveal delay={150}>
            <div className="rounded-3xl bg-card p-8 shadow-soft">
              <p className="font-display text-8xl font-extrabold text-orange"><CountUp to={8} suffix="%" /></p>
              <p className="mt-3 text-lg">named "rider couldn't find the address" as the main reason for their <b>latest</b> failed COD delivery.</p>
              <p className="mt-4 flex flex-wrap gap-2"><SampleTag>Survey B · n=53</SampleTag><SampleTag>19% if unreachable + address issue</SampleTag></p>
            </div>
          </Reveal>
        </div>
        <p className="mt-12 max-w-3xl font-display text-2xl font-bold leading-snug text-primary">
          Address quality matters — but we should not treat every address issue as the reason for RTO.
        </p>
      </Section>
    </>
  );
}

export function SceneQuestion() {
  const { ref, inView } = useInView<HTMLDivElement>(0.5);
  return (
    <Section id="decision" tone="plum">
      <p className="eyebrow">Scene 07 · Product decision</p>
      <h2 className="mt-4 font-display text-[clamp(2.4rem,5.5vw,4.75rem)] font-extrabold uppercase leading-[0.95]">We changed the question.</h2>
      <div ref={ref} className="mt-14 space-y-8">
        <p className="relative inline-block font-display text-2xl opacity-60 md:text-4xl">
          "How do we process RTO better?"
          <span className={cn("absolute left-0 top-1/2 h-1 bg-orange transition-all duration-700", inView ? "w-full" : "w-0")} />
        </p>
        <p className={cn("max-w-4xl font-display text-3xl font-bold leading-tight transition-all delay-700 duration-700 md:text-5xl", inView ? "opacity-100" : "translate-y-4 opacity-0")}>
          "Can we stop risky orders from reaching the failure point — and give failed orders a <span className="text-pink">better second chance</span>?"
        </p>
      </div>
      <div className="mt-14 flex flex-wrap items-center gap-4 font-display text-2xl font-extrabold uppercase">
        {["Prevent", "Recover", "Measure"].map((w, i) => (
          <span key={w} className="flex items-center gap-4">{i > 0 && <span className="text-pink">+</span>}<span className="rounded-full border-2 border-pink px-6 py-2">{w}</span></span>
        ))}
      </div>
    </Section>
  );
}

export function SceneWants() {
  const c = surveyB.choiceAfterMiss;
  return (
    <>
      <Section id="wants" tone="white">
        <p className="eyebrow">Scene 08 · What customers want</p>
        <h2 className="headline mt-4">The second chance should happen at the door.</h2>
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-3">
            {c.map((x, i) => {
              const top = i < 2;
              return (
                <Reveal key={x.label} delay={i * 100}>
                  <div className={cn("relative overflow-hidden rounded-2xl px-6 py-5", top ? "bg-primary text-primary-foreground" : "bg-muted")}>
                    <div className="flex items-baseline justify-between">
                      <span className="font-display text-xl font-bold uppercase">{x.label}</span>
                      <span className="font-display text-3xl font-extrabold tabular-nums">{x.pct.toFixed(1)}%</span>
                    </div>
                    <div className={cn("mt-3 h-1.5 rounded-full", top ? "bg-pink" : "bg-foreground/30")} style={{ width: `${x.pct * 2}%` }} />
                  </div>
                </Reveal>
              );
            })}
            <p className="pt-2 text-xs text-muted-foreground">Survey B · what customers would actually choose after a missed delivery.</p>
          </div>
          <div className="flex flex-col justify-center rounded-3xl bg-pink-soft p-8">
            <p className="font-display text-[7rem] font-extrabold leading-none text-primary"><CountUp to={75} suffix="%" /></p>
            <p className="mt-2 text-lg font-semibold">want either <b className="text-primary">reschedule</b> or <b className="text-primary">alternate receiver</b>.</p>
            <p className="mt-6 text-sm text-muted-foreground">46.3% + 28.4% = 74.6%</p>
            <div className="mt-6 rounded-2xl bg-card p-4">
              <p className="text-sm">Self-collect = only <b className="text-orange">6%</b></p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Last resort / selective fallback</p>
            </div>
          </div>
        </div>
        <p className="mt-12 max-w-3xl font-display text-2xl font-bold leading-snug text-primary">Don't make customers travel to recover a delivery when most want another chance at home.</p>
      </Section>

      <Section>
        <p className="eyebrow">Scene 09 · When the rider is lost</p>
        <h2 className="headline mt-4 text-[clamp(2rem,4.5vw,3.75rem)]">Customers want help —<br />not another failed attempt.</h2>
        <div className="mt-14 grid gap-4 md:grid-cols-4">
          {[
            { rung: "Digital help", items: [surveyB.riderCantFind[0], surveyB.riderCantFind[2]] },
            { rung: "Phone guidance", items: [surveyB.riderCantFind[1]] },
            { rung: "Local guidance", items: [surveyB.riderCantFind[4]] },
            { rung: "Selective collection", items: [surveyB.riderCantFind[3]] },
          ].map((r, i) => (
            <Reveal key={r.rung} delay={i * 120}>
              <div className="h-full rounded-3xl bg-card p-6 shadow-soft" style={{ marginTop: `${i * 24}px` }}>
                <p className="text-xs font-bold uppercase tracking-widest text-orange">Step {i + 1}</p>
                <p className="mt-1 font-display text-xl font-extrabold uppercase text-primary">{r.rung}</p>
                <div className="mt-5 space-y-3">
                  {r.items.map((it) => <div key={it.label}><p className="font-display text-3xl font-extrabold">{it.pct}%</p><p className="text-sm text-muted-foreground">{it.label}</p></div>)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Survey B · if the rider cannot find the address.</p>
      </Section>
    </>
  );
}

export function SceneSolution() {
  return (
    <Section id="solution" tone="white">
      <p className="eyebrow">Scene 10 · The solution</p>
      <h2 className="headline mt-4">Two layers.<br />One delivery goal.</h2>
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-3xl bg-primary p-9 text-primary-foreground">
            <p className="text-xs font-bold uppercase tracking-widest text-pink">Layer 1 · Before dispatch</p>
            <p className="mt-3 font-display text-4xl font-extrabold uppercase">Risk engine</p>
            <p className="mt-4 text-lg opacity-85">Check risky COD orders before dispatch — and help the customer, not block them.</p>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="h-full rounded-3xl bg-pink p-9 text-primary">
            <p className="text-xs font-bold uppercase tracking-widest">Layer 2 · After a failed attempt</p>
            <p className="mt-3 font-display text-4xl font-extrabold uppercase">Second chance</p>
            <p className="mt-4 text-lg">Give the customer another way to receive the order — before it is finally returned.</p>
          </div>
        </Reveal>
      </div>
      <div className="mt-6 rounded-3xl border-2 border-dashed border-orange p-6 text-center font-display text-2xl font-extrabold uppercase text-orange">Measure everything.</div>
      <NextCta href="#engine">Open the working product</NextCta>
    </Section>
  );
}
