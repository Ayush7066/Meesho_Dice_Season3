import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <div ref={ref} className={cn("reveal", inView && "in", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function CountUp({ to, decimals = 0, prefix = "", suffix = "", duration = 1200 }: { to: number; decimals?: number; prefix?: string; suffix?: string; duration?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{prefix}{v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

export function Section({ id, children, className, tone = "cream" }: { id?: string; children: ReactNode; className?: string; tone?: "cream" | "white" | "plum" | "pink" }) {
  const tones = {
    cream: "bg-background",
    white: "bg-card",
    plum: "bg-primary text-primary-foreground",
    pink: "bg-pink-soft",
  };
  return (
    <section id={id} className={cn("px-5 py-24 md:px-10 md:py-32", tones[tone], className)}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function SampleTag({ children, warn }: { children: ReactNode; warn?: boolean }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
      warn ? "border-orange bg-orange/10 text-orange" : "border-border bg-card text-muted-foreground")}>
      {children}
    </span>
  );
}

export function Bar({ label, pct, highlight, tone = "pink", delay = 0, max = 100 }: { label: string; pct: number; highlight?: boolean; tone?: "pink" | "plum" | "orange"; delay?: number; max?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const fill = { pink: "bg-pink", plum: "bg-primary", orange: "bg-orange" }[tone];
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className={cn("font-medium", highlight ? "text-primary" : "text-foreground/80")}>{label}</span>
        <span className={cn("font-display font-bold tabular-nums", highlight ? "text-primary text-lg" : "text-foreground/70")}>{pct}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full transition-[width] duration-1000 ease-out", fill)} style={{ width: inView ? `${(pct / max) * 100}%` : "0%", transitionDelay: `${delay}ms` }} />
      </div>
    </div>
  );
}

export function NextCta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="group mt-14 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-primary">
      <span className="border-b-2 border-orange pb-1">{children}</span>
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </a>
  );
}

export function Pill({ active, onClick, children, size = "md" }: { active?: boolean; onClick?: () => void; children: ReactNode; size?: "md" | "lg" }) {
  return (
    <button type="button" onClick={onClick}
      className={cn("rounded-full border-2 font-bold uppercase tracking-wider transition-all",
        size === "lg" ? "px-6 py-3 text-sm" : "px-4 py-2 text-xs",
        active ? "border-primary bg-primary text-primary-foreground shadow-soft" : "border-border bg-card text-foreground/70 hover:border-pink hover:text-primary")}>
      {children}
    </button>
  );
}
