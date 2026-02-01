'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [liveResults, setLiveResults] = useState<{ projects: any[]; clients: any[] } | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Debounced live search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setLiveResults(null)
      return
    }

    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm.trim())}`)
        if (res.ok) {
          const data = await res.json()
          setLiveResults(data)
        } else {
          setLiveResults({ projects: [], clients: [] })
        }
      } catch (err) {
        setLiveResults({ projects: [], clients: [] })
      }
    }, 300)

    return () => clearTimeout(id)
  }, [searchTerm])

  // noop — removed user menu logic after removing profile icon

  const isActive = (path: string) => pathname === path

  return (
    <nav
      className={`sticky top-0 z-50 transition-shadow duration-300 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-b border-white/10 dark:border-slate-800/40 ${
        scrolled ? 'shadow-lg' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 md:h-20">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 mr-6" aria-label="RET home">
            <Image src="/logo.png" alt="RET" width={56} height={56} className="rounded-sm shadow-sm" />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-sm font-extrabold text-sky-900 dark:text-white">RET Business Group</span>
              <span className="text-xs text-slate-700 dark:text-slate-300 -mt-0.5">Building trusted brands</span>
            </div>
          </Link>

          {/* Links (desktop) */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            <div className="flex items-center gap-1">
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
                  isActive('/')
                    ? 'text-sky-900 bg-amber-400/90 shadow-sm'
                    : 'text-slate-700 hover:text-sky-900 hover:bg-slate-100'
                }`}
              >
                Group Overview
              </Link>
              {subsidiaries.map((sub) => (
                <Link
                  key={sub.path}
                  href={sub.path}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
                    isActive(sub.path)
                      ? 'text-sky-900 bg-amber-400/90 shadow-sm'
                      : 'text-slate-700 hover:text-sky-900 hover:bg-slate-100'
                  }`}
                >
                  {sub.name}
                </Link>
              ))}
              <Link
                href="/admin"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
                  pathname?.startsWith('/admin')
                    ? 'text-sky-900 bg-amber-400/90 shadow-sm'
                    : 'text-slate-700 hover:text-sky-900 hover:bg-slate-100'
                }`}
              >
                Admin
              </Link>
            </div>

            {/* spacer */}
            <div className="flex-1" />

            {/* Search + CTA + User */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center bg-slate-50 rounded-md px-2 py-1 shadow-sm relative">
                <svg className="h-5 w-5 text-slate-400 mr-2 overflow-visible" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1016.65 16.65z" />
                </svg>
                <input
                  aria-label="Search"
                  placeholder="Search RET..."
                  className="bg-transparent outline-none text-sm text-slate-700 w-56"
                    value={searchTerm}
                    ref={searchRef}
                    onChange={(e) => {
                      const v = e.target.value
                      setSearchTerm(v)
                      setShowDropdown(!!v.trim())
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const q = searchTerm.trim()
                        if (q.length) {
                          setShowDropdown(false)
                          router.push(`/search?q=${encodeURIComponent(q)}`)
                        }
                      }
                    }}
                />

                {/* Live results dropdown */}
                {showDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white border rounded-md shadow-lg z-50 max-h-64 overflow-auto">
                    {!liveResults && <div className="p-2 text-sm text-slate-500">Searching…</div>}
                    {liveResults && (
                      <div>
                        <div className="p-2 text-xs text-slate-500">Projects</div>
                        {liveResults.projects.length === 0 && <div className="p-2 text-sm text-gray-600">No projects</div>}
                        {liveResults.projects.map((p: any) => (
                          <a
                            key={p.id}
                            href={`/projects/${p.id}`}
                            className="block px-3 py-2 hover:bg-slate-50 text-sm"
                            onClick={() => setShowDropdown(false)}
                          >
                            <div className="font-medium">{p.title}</div>
                            <div className="text-xs text-slate-500">{p.subsidiary || ''}</div>
                          </a>
                        ))}

                        <div className="border-t mt-1" />

                        <div className="p-2 text-xs text-slate-500">Clients</div>
                        {liveResults.clients.length === 0 && <div className="p-2 text-sm text-gray-600">No clients</div>}
                        {liveResults.clients.map((c: any) => (
                          <a
                            key={c.id}
                            href={`/admin/clients`}
                            className="block px-3 py-2 hover:bg-slate-50 text-sm"
                            onClick={() => setShowDropdown(false)}
                          >
                            <div className="font-medium">{c.name}</div>
                            <div className="text-xs text-slate-500">{c.category || 'General'}</div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

                {/* replace Contact with a compact search button on desktop */}
                <button
                  onClick={() => searchRef.current?.focus()}
                  className="hidden sm:inline-flex items-center px-3 py-2 bg-gradient-to-r from-sky-600 to-cyan-400 text-white rounded-lg font-semibold shadow-md hover:scale-[1.01] transition-transform"
                  aria-label="Focus search"
                >
                  <svg className="h-5 w-5 overflow-visible" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1016.65 16.65z" />
                  </svg>
                </button>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="ml-auto flex items-center gap-2 md:hidden">
            {/* on mobile, show a small search icon that focuses the input when menu open */}
              <button
              onClick={() => {
                setIsMenuOpen(false)
                // focus first visible search input if any
                setTimeout(() => searchRef.current?.focus(), 50)
              }}
              className="px-3 py-2 bg-amber-400 text-sky-900 rounded-md text-sm font-semibold"
              aria-label="Open search"
            >
              <svg className="h-5 w-5 overflow-visible" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1016.65 16.65z" />
              </svg>
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="py-3 space-y-1">
            <Link
              href="/"
              className={`block px-4 py-3 text-base font-medium rounded-lg ${
                isActive('/') ? 'bg-amber-400 text-sky-900 font-semibold' : 'text-slate-700 hover:bg-slate-100'
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
                  isActive(sub.path) ? 'bg-amber-400 text-sky-900 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {sub.name}
              </Link>
            ))}
            <Link
              href="/admin"
              className={`block px-4 py-3 text-base font-medium rounded-lg ${
                pathname?.startsWith('/admin') ? 'bg-amber-400 text-sky-900 font-semibold' : 'text-slate-700 hover:bg-slate-100'
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
