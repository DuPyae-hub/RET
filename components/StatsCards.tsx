"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Briefcase, Sparkles } from "lucide-react";
import ScrollAnimation from "@/components/ScrollAnimation";

export default function StatsCards({
  counts,
  mission,
  vision,
}: {
  counts: { projects: number; clients: number };
  mission: string;
  vision: string;
}) {
  const [visibleProjects, setVisibleProjects] = useState(0);
  const [visibleClients, setVisibleClients] = useState(0);

  useEffect(() => {
    const duration = 900;
    const start = performance.now();

    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      setVisibleProjects(Math.round(counts.projects * ease));
      setVisibleClients(Math.round(counts.clients * ease));
      if (t < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [counts]);

  const fmt = (n: number) => n.toLocaleString();
  const truncate = (s: string, len = 140) =>
    s.length > len ? s.slice(0, len).trim() + "…" : s;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch pb-6 md:pb-8">
      {/* Left column: counts stacked (two even rows) */}
      <div className="grid grid-rows-2 gap-4 h-full">
        <ScrollAnimation direction="up" delay={90}>
          <div className="card-ret bg-white p-4 md:p-6 border-l-4 border-[#1A4A94] shadow-md ring-1 ring-gray-100 rounded-lg transform-gpu transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg h-full flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center gap-4">
              <div className="bg-[#1A4A94]/10 p-2.5 rounded-md">
                <Briefcase className="w-6 h-6 text-[#1A4A94]" />
              </div>
              <div>
                <div
                  className="text-2xl md:text-3xl font-extrabold text-[#1A4A94]"
                  aria-live="polite"
                >
                  {fmt(visibleProjects)}
                </div>
                <div className="text-sm text-gray-600">On Going Projects</div>
              </div>
            </div>
            <div className="mt-3">
              <Link
                href="/admin/projects"
                className="text-sm font-medium text-[#1A4A94] hover:text-[#FFC107]"
              >
                View Projects →
              </Link>
            </div>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={180}>
          <div className="card-ret bg-white p-4 md:p-6 border-l-4 border-[#1A4A94] shadow-md ring-1 ring-gray-100 rounded-lg transform-gpu transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg h-full flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center gap-4">
              <div className="bg-[#1A4A94]/10 p-2.5 rounded-md">
                <Users className="w-6 h-6 text-[#1A4A94]" />
              </div>
              <div>
                <div
                  className="text-2xl md:text-3xl font-extrabold text-[#1A4A94]"
                  aria-live="polite"
                >
                  {fmt(visibleClients)}
                </div>
                <div className="text-sm text-gray-600">Clients</div>
              </div>
            </div>
            <div className="mt-3">
              <Link
                href="/admin/clients"
                className="text-sm font-medium text-[#1A4A94] hover:text-[#FFC107]"
              >
                View Clients →
              </Link>
            </div>
          </div>
        </ScrollAnimation>
      </div>

      {/* Right column: mission & vision stacked (two even rows) */}
      <div className="grid grid-rows-2 gap-4 h-full">
        <ScrollAnimation direction="up" delay={135}>
          <div className="card-ret bg-white p-4 md:p-6 border-l-4 border-[#1A4A94] shadow-md ring-1 ring-gray-100 rounded-lg transform-gpu transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg h-full flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#1A4A94] rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#FFC107]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F2942]">
                Our Mission
              </h3>
            </div>
            <p className="text-sm text-black leading-relaxed">{mission}</p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={225}>
          <div className="card-ret bg-white p-4 md:p-6 border-l-4 border-[#1A4A94] shadow-md ring-1 ring-gray-100 rounded-lg transform-gpu transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg h-full flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#1A4A94] rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#FFC107]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F2942]">
                Our Vision
              </h3>
            </div>
            <p className="text-sm text-black leading-relaxed">{vision}</p>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
}
