"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const subsidiaries = [
  { name: "RET Advertising", path: "/ret-advertising" },
  { name: "Million Zone", path: "/million-zone" },
  { name: "NL Truth", path: "/nl-truth" },
  { name: "Agricultural Friends", path: "/agricultural-friends" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // noop — removed user menu logic after removing profile icon

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#1A4A94] text-white border-b-2 border-[#FFC107]/30">
      <nav className={`${scrolled ? "shadow-lg" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Brand - make logo distinct from nav background */}
            <Link
              href="/"
              className="shrink-0"
              aria-label="RET home"
            >
              <div className="flex items-center gap-3 rounded-md bg-white/95 px-2.5 py-1.5 shadow-sm border border-white/40">
                <Image
                  src="/logo.png"
                  alt="RET"
                  width={48}
                  height={48}
                  className="h-9 w-9 md:h-11 md:w-11 object-contain"
                />
                <div className="hidden sm:block">
                  <span className="text-sm md:text-base font-semibold text-[#0F2942] tracking-tight">
                    RET Business Group
                  </span>
                  <span className="block text-xs text-[#0F2942]/80 -mt-0.5">
                    Building trusted brands
                  </span>
                </div>
              </div>
            </Link>

            {/* Links (desktop) - Oxford-style: simple text links, gold for active */}
            <div className="hidden md:flex items-center gap-8 flex-1 justify-end ml-8">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${isActive("/") ? "text-[#FFC107]" : "text-white/90 hover:text-white"}`}
              >
                Group Overview
              </Link>
              {subsidiaries.map((sub) => (
                <Link
                  key={sub.path}
                  href={sub.path}
                  className={`text-sm font-medium transition-colors ${isActive(sub.path) ? "text-[#FFC107]" : "text-white/90 hover:text-white"}`}
                >
                  {sub.name}
                </Link>
              ))}
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors pl-4 border-l border-white/30 ${pathname?.startsWith("/admin") ? "text-[#FFC107]" : "text-white/90 hover:text-white"}`}
              >
                Admin
              </Link>
            </div>

            {/* Mobile controls */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 -mr-2 text-white hover:text-[#FFC107] transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Oxford-style simple list */}
        <div className={`md:hidden border-t border-white/20 overflow-hidden transition-[max-height] duration-300 ${isMenuOpen ? "max-h-96" : "max-h-0"}`}>
          <div className="bg-[#1A4A94] py-2">
            <Link href="/" className={`block px-6 py-3 text-sm font-medium ${isActive("/") ? "text-[#FFC107] bg-white/10" : "text-white hover:bg-white/10"}`} onClick={() => setIsMenuOpen(false)}>Group Overview</Link>
            {subsidiaries.map((sub) => (
              <Link key={sub.path} href={sub.path} className={`block px-6 py-3 text-sm font-medium ${isActive(sub.path) ? "text-[#FFC107] bg-white/10" : "text-white hover:bg-white/10"}`} onClick={() => setIsMenuOpen(false)}>{sub.name}</Link>
            ))}
            <Link href="/admin" className={`block px-6 py-3 text-sm font-medium border-t border-white/20 ${pathname?.startsWith("/admin") ? "text-[#FFC107] bg-white/10" : "text-white hover:bg-white/10"}`} onClick={() => setIsMenuOpen(false)}>Admin</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
