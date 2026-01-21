'use client'

import Link from 'next/link'
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

  return (
    <nav className={`bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-primary-500 transition-all duration-300 ${
      scrolled ? 'shadow-xl' : 'shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
            >
              RET Business Group
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative ${
                pathname === '/'
                  ? 'text-primary-600 bg-primary-50 font-semibold'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              <span className="relative z-10">Group Overview</span>
              {pathname === '/' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></span>
              )}
            </Link>
            {subsidiaries.map((sub) => (
              <Link
                key={sub.path}
                href={sub.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative ${
                  pathname === sub.path
                    ? 'text-primary-600 bg-primary-50 font-semibold'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <span className="relative z-10">{sub.name}</span>
                {pathname === sub.path && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></span>
                )}
              </Link>
            ))}
            <Link
              href="/admin"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-700 focus:outline-none p-2 rounded-lg hover:bg-primary-50 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}>
          <div className="pt-2 space-y-1">
            <Link
              href="/"
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                pathname === '/'
                  ? 'text-primary-600 bg-primary-50 font-semibold'
                  : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Group Overview
            </Link>
            {subsidiaries.map((sub) => (
              <Link
                key={sub.path}
                href={sub.path}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                  pathname === sub.path
                    ? 'text-primary-600 bg-primary-50 font-semibold'
                    : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {sub.name}
              </Link>
            ))}
            <Link
              href="/admin"
              className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-primary-700 hover:bg-gray-50 transition-all duration-300"
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
