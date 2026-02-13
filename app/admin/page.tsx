"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import { useEffect, useState } from "react";

const ADMIN_SECTIONS = [
  {
    title: "Content",
    description: "Manage what appears on your site",
    cards: [
      {
        href: "/admin/projects",
        label: "Projects",
        description: "Portfolio and case studies",
        icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
        countKey: "projects",
      },
      {
        href: "/admin/clients",
        label: "Clients",
        description: "Client logos and categories",
        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
        countKey: "clients",
      },
      {
        href: "/admin/banners",
        label: "Banners",
        description: "Hero carousel images per page",
        icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14",
        countKey: null,
      },
      {
        href: "/admin/legal-documents",
        label: "Legal documents",
        description: "Certificates and licenses",
        icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        countKey: null,
      },
    ],
  },
  {
    title: "Site",
    description: "Settings and structure",
    cards: [
      {
        href: "/admin/settings",
        label: "Site settings",
        description: "Mission, vision, address, org chart",
        icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
        countKey: null,
      },
      {
        href: "/admin/subsidiaries",
        label: "Subsidiaries",
        description: "Business units and display order",
        icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m3-13h2m-2 0v10m-2 0v-4m0-4h.01",
        countKey: null,
      },
    ],
  },
];

export default function AdminPage() {
  const [counts, setCounts] = useState<{ projects: number; clients: number }>({ projects: 0, clients: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [pRes, cRes] = await Promise.all([fetch("/api/projects"), fetch("/api/clients")]);
        const projects = pRes.ok ? await pRes.json() : [];
        const clients = cRes.ok ? await cRes.json() : [];
        setCounts({
          projects: Array.isArray(projects) ? projects.length : 0,
          clients: Array.isArray(clients) ? clients.length : 0,
        });
      } catch {
        setCounts({ projects: 0, clients: 0 });
      }
    }
    load();
  }, []);

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin" },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#0F2942]">Admin</h1>
          <p className="text-gray-600 text-sm mt-1">Manage content and settings for your site.</p>
        </div>

        {ADMIN_SECTIONS.map((section) => (
          <section key={section.title} className="mb-10">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
              {section.title}
            </h2>
            <p className="text-gray-600 text-sm mb-4">{section.description}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.cards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group flex items-start gap-4 rounded-xl border border-[#E9ECEF] bg-white p-5 transition-all hover:border-[#1A4A94]/30 hover:shadow-md"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1A4A94]/10 text-[#1A4A94] group-hover:bg-[#1A4A94]/15 transition-colors">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block font-medium text-[#0F2942] group-hover:text-[#1A4A94] transition-colors">
                      {card.label}
                    </span>
                    <span className="block text-sm text-gray-500 mt-0.5">{card.description}</span>
                    {card.countKey === "projects" && (
                      <span className="mt-2 inline-block text-xs font-medium text-[#1A4A94]">
                        {counts.projects} items
                      </span>
                    )}
                    {card.countKey === "clients" && (
                      <span className="mt-2 inline-block text-xs font-medium text-[#1A4A94]">
                        {counts.clients} items
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 text-gray-400 group-hover:text-[#1A4A94] transition-colors" aria-hidden>
                    →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
