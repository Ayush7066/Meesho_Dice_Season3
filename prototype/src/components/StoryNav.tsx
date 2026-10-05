import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  ["Story", "doorbell"], ["Evidence", "surveys"], ["Solution", "solution"], ["Try it", "engine"], ["Recovery", "recovery"], ["Cohorts", "cohorts"], ["Test", "plan"], ["Guardrails", "guardrails"],
] as const;

export const journeySteps = [
  ["One missed doorbell", "doorbell"],
  ["100-order pattern", "pattern"],
  ["Two surveys", "surveys"],
  ["What customers told us", "wants"],
  ["Not just a risk score", "solution"],
  ["Journey", "journey"],
  ["Risk engine", "engine"],
  ["Try an order", "try"],
  ["Recovery", "recovery"],
  ["Cohorts", "cohorts"],
  ["Economics", "economics"],
  ["30 / 60 / 90", "plan"],
  ["Guardrails", "guardrails"],
] as const;

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export function StoryNav() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const ids = links.map((l) => l[1]);
    const onScroll = () => {
      let cur = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 160) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-10">
        <a href="#top" className="font-display text-lg font-extrabold tracking-tight text-primary">MEESHO</a>
        <span className="hidden font-display text-sm font-extrabold uppercase tracking-widest text-primary md:block">One missed doorbell</span>
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">DICE S3 · Business Track</span>
      </div>
      <nav className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-5 pb-3 md:px-10">
        {links.map(([label, id], i) => (
          <span key={id} className="flex shrink-0 items-center gap-1">
            {i > 0 && <span className="text-xs text-muted-foreground/50">→</span>}
            <button onClick={() => go(id)} className={cn("rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors", active === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary")}>{label}</button>
          </span>
        ))}
      </nav>
    </header>
  );
}

export function JudgeMode() {
  const [step, setStep] = useState<number | null>(null);
  const start = () => { setStep(0); go(journeySteps[0]![1]); };
  const move = (d: number) => {
    if (step === null) return;
    const n = step + d;
    if (n < 0) return;
    if (n >= journeySteps.length) { setStep(null); return; }
    setStep(n); go(journeySteps[n]![1]);
  };
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {step === null ? (
        <div className="flex flex-col items-end gap-2 sm:flex-row">
          <button onClick={() => go("engine")} className="rounded-full border-2 border-primary bg-card px-5 py-3 text-xs font-bold uppercase tracking-wider text-primary shadow-soft">Try the risk engine</button>
          <button onClick={start} className="rounded-full bg-orange px-5 py-3 text-xs font-bold uppercase tracking-wider text-orange-foreground shadow-lift">Take the 3-minute journey</button>
        </div>
      ) : (
        <div className="w-72 rounded-3xl bg-primary p-5 text-primary-foreground shadow-lift">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest opacity-80">
            <span>Judge journey · {step + 1}/{journeySteps.length}</span>
            <button onClick={() => setStep(null)} aria-label="Close journey">Close</button>
          </div>
          <p className="mt-2 font-display text-xl font-extrabold">{journeySteps[step]![0]}</p>
          <div className="mt-3 flex gap-1">{journeySteps.map((_, i) => <span key={i} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-pink" : "bg-primary-foreground/20")} />)}</div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => move(-1)} disabled={step === 0} className="flex-1 rounded-full border border-primary-foreground/30 py-2 text-xs font-bold uppercase disabled:opacity-40">Back</button>
            <button onClick={() => move(1)} className="flex-1 rounded-full bg-orange py-2 text-xs font-bold uppercase text-orange-foreground">{step === journeySteps.length - 1 ? "Finish" : "Next →"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
