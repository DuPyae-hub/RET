'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const subsidiaries = [
  { name: 'RET Advertising', path: '/ret-advertising' },
  { name: 'Million Zone', path: '/million-zone' },
  { name: 'Inner True', path: '/inner-true' },
  { name: 'Agricultural Friends', path: '/agricultural-friends' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <nav
      className={`bg-[#1A4A94] sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity cursor-pointer"
            aria-label="Royal Ever Truth (RET) Business Group"
          >
            <Image
              src="/logo.png"
              alt="Royal Ever Truth (RET) Business Group"
              width={220}
              height={70}
              priority
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                isActive('/')
                  ? 'text-[#FFC107]'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Group Overview
              {isActive('/') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFC107]" />
              )}
            </Link>
            {subsidiaries.map((sub) => (
              <Link
                key={sub.path}
                href={sub.path}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  isActive(sub.path)
                    ? 'text-[#FFC107]'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {sub.name}
                {isActive(sub.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFC107]" />
                )}
              </Link>
            ))}
            <Link
              href="/admin"
              className={`px-4 py-3 text-sm font-medium transition-colors rounded relative ${
                pathname?.startsWith('/admin')
                  ? 'text-[#FFC107]'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Admin
              {pathname?.startsWith('/admin') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFC107] rounded" />
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
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

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
          }`}
        >
          <div className="pt-2 space-y-1 border-t border-white/20">
            <Link
              href="/"
              className={`block px-4 py-3 text-sm font-medium rounded-lg ${
                isActive('/')
                  ? 'text-[#FFC107] bg-white/10'
                  : 'text-white/90 hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Group Overview
            </Link>
            {subsidiaries.map((sub) => (
              <Link
                key={sub.path}
                href={sub.path}
                className={`block px-4 py-3 text-sm font-medium rounded-lg ${
                  isActive(sub.path)
                    ? 'text-[#FFC107] bg-white/10'
                    : 'text-white/90 hover:bg-white/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {sub.name}
              </Link>
            ))}
            <Link
              href="/admin"
              className={`block px-4 py-3 text-sm font-medium rounded-lg ${
                pathname?.startsWith('/admin')
                  ? 'text-[#FFC107] bg-white/10'
                  : 'text-white/90 hover:bg-white/10'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
