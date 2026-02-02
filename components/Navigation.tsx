"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const subsidiaries = [
  { name: "RET Advertising", path: "/ret-advertising" },
  { name: "Million Zone", path: "/million-zone" },
  { name: "Inner True", path: "/inner-true" },
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
    <nav
      className={`sticky top-0 z-50 bg-[#1A4A94] text-white border-b border-black/20 ${scrolled ? "shadow-lg" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center h-20">
          {/* Brand */}
          <Link href="/" className="mr-3" aria-label="RET home">
            <div className="bg-white rounded-md p-2 flex items-center gap-3 shadow-sm border border-slate-200">
              <Image
                src="/logo.png"
                alt="RET"
                width={64}
                height={64}
                className="rounded-sm shadow-sm"
              />
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-sm font-extrabold text-sky-900">
                  RET Business Group
                </span>
                <span className="text-xs text-sky-900/80 -mt-0.5">
                  Building trusted brands
                </span>
              </div>
            </div>
          </Link>

          {/* Links (desktop) */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
            <nav className="flex items-center gap-8">
              <Link
                href="/"
                className={`relative text-sm font-semibold tracking-wide pb-2 transition-colors after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-1 after:w-16 after:bg-amber-400 after:transform after:scale-x-0 after:origin-center after:transition-transform after:duration-300 ${isActive("/") ? "text-white after:scale-x-100" : "text-white/90 hover:text-white hover:after:scale-x-100"}`}
              >
                Group Overview
              </Link>

              {subsidiaries.map((sub) => (
                <Link
                  key={sub.path}
                  href={sub.path}
                  className={`relative text-sm font-semibold tracking-wide pb-2 transition-colors after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-1 after:w-16 after:bg-amber-400 after:transform after:scale-x-0 after:origin-center after:transition-transform after:duration-300 ${isActive(sub.path) ? "text-white after:scale-x-100" : "text-white/90 hover:text-white hover:after:scale-x-100"}`}
                >
                  {sub.name}
                </Link>
              ))}
            </nav>

            <div className="ml-6">
              <Link
                href="/admin"
                className={`text-xs font-medium tracking-wide pb-2 ${pathname?.startsWith("/admin") ? "text-white border-b-4 border-amber-400 pb-2" : "text-white/90 hover:text-white"}`}
              >
                Admin
              </Link>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="ml-auto flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-white/10"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${isMenuOpen ? "max-h-96" : "max-h-0"} bg-[#1A4A94]`}
        >
          <div className="py-3 space-y-1">
            <Link
              href="/"
              className={`block px-4 py-3 text-base font-medium rounded-lg ${
                isActive("/")
                  ? "bg-amber-400 text-sky-900 font-semibold"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Group Overview
            </Link>
            {subsidiaries.map((sub) => (
              <Link
                key={sub.path}
                href={sub.path}
                className={`block px-4 py-3 text-base font-medium rounded-lg ${
                  isActive(sub.path)
                    ? "bg-amber-400 text-sky-900 font-semibold"
                    : "text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {sub.name}
              </Link>
            ))}
            <Link
              href="/admin"
              className={`block px-4 py-3 text-base font-medium rounded-lg ${
                pathname?.startsWith("/admin")
                  ? "bg-amber-400 text-sky-900 font-semibold"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
