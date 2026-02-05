"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ScrollAnimation from "@/components/ScrollAnimation";

type StatsCounts = {
  projects: number;
  clients: number;
};

type StatsCardsProps = {
  counts: StatsCounts;
};

function animateCount(target: number, setValue: (n: number) => void) {
  const durationMs = 1200;
  const start = performance.now();
  let frameId = 0;

  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / durationMs);
    // Quartic ease-out for a smooth "landing"
    const ease = 1 - Math.pow(1 - t, 4);
    setValue(Math.round(target * ease));
    if (t < 1) frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frameId);
}

function StatItem({
  value,
  label,
  href,
  cta,
  delay,
  className = "",
}: {
  value: number;
  label: string;
  href: string;
  cta: string;
  delay: number;
  className?: string;
}) {
  const fmt = useMemo(() => new Intl.NumberFormat(), []);
  return (
    <ScrollAnimation direction="up" delay={delay}>
      <div
        className={`flex flex-col items-center justify-center text-center px-3 py-6 md:px-4 md:py-8 ${className}`}
      >
        <div
          className="text-5xl md:text-6xl lg:text-7xl font-black text-[#1A4A94] tracking-tight"
          aria-label={`${fmt.format(value)} ${label}`}
        >
          {fmt.format(value)}
        </div>
        <div className="text-[11px] md:text-sm font-semibold uppercase tracking-[0.3em] text-gray-600 mt-3">
          {label}
        </div>
        <Link
          href={href}
          className="mt-4 inline-flex items-center justify-center rounded-[12px] border border-[#FFC107] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#1A4A94] bg-white hover:bg-[#FFC107] hover:text-[#0F2942] transition-colors"
        >
          {cta} →
        </Link>
      </div>
    </ScrollAnimation>
  );
}

export default function StatsCards({ counts }: StatsCardsProps) {
  const projectsCount = Number(counts?.projects ?? 0);
  const clientsCount = Number(counts?.clients ?? 0);

  const [visibleProjects, setVisibleProjects] = useState(0);
  const [visibleClients, setVisibleClients] = useState(0);

  useEffect(() => {
    const stopA = animateCount(projectsCount, setVisibleProjects);
    const stopB = animateCount(clientsCount, setVisibleClients);
    return () => {
      stopA();
      stopB();
    };
  }, [projectsCount, clientsCount]);

  return (
    <section className="w-full text-[#0F2942] py-6 md:py-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-stretch justify-center">
        {/* Projects */}
        <div className="flex-1">
          <StatItem
            value={visibleProjects}
            label="Projects Completed"
            href="/admin/projects"
            cta="View Projects"
            delay={100}
          />
        </div>

        {/* Blue separator line: vertical on desktop, horizontal on mobile */}
        <div
          className="flex items-center justify-center my-1 md:my-0"
          aria-hidden="true"
        >
          {/* Horizontal line on mobile */}
          <div className="md:hidden h-[3px] w-16 bg-[#0B2C66] rounded-full" />
          {/* Vertical line on desktop */}
          <div className="hidden md:block w-[3px] h-24 bg-[#0B2C66] rounded-full" />
        </div>

        {/* Clients */}
        <div className="flex-1">
          <StatItem
            value={visibleClients}
            label="Satisfied Clients"
            href="/admin/clients"
            cta="View Clients"
            delay={200}
          />
        </div>
      </div>
    </section>
  );
}