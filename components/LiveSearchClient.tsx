"use client"

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LiveSearchClient() {
  const [searchTerm, setSearchTerm] = useState('')
  const [liveResults, setLiveResults] = useState<{ projects: any[]; clients: any[] } | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const ref = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative bg-white rounded-md shadow-sm px-3 py-2 flex items-center">
        <svg className="h-6 w-6 text-slate-400 mr-2 overflow-visible" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1016.65 16.65z" />
        </svg>
        <input
          ref={ref}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setShowDropdown(!!e.target.value.trim())
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
          placeholder="Search RET..."
          className="flex-1 bg-transparent outline-none"
          aria-label="Dashboard search"
        />

        {showDropdown && (
          <div className="absolute left-0 right-0 mt-12 bg-white border rounded-md shadow-lg z-50 max-h-72 overflow-auto">
            {!liveResults && <div className="p-2 text-sm text-slate-500">Searching…</div>}
            {liveResults && (
              <div>
                <div className="p-2 text-xs text-slate-500">Projects</div>
                {liveResults.projects.length === 0 && <div className="p-2 text-sm text-gray-600">No projects</div>}
                {liveResults.projects.map((p: any) => (
                  <a key={p.id} href={`/projects/${p.id}`} className="block px-3 py-2 hover:bg-slate-50 text-sm">
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-slate-500">{p.subsidiary || ''}</div>
                  </a>
                ))}

                <div className="border-t mt-1" />
                <div className="p-2 text-xs text-slate-500">Clients</div>
                {liveResults.clients.length === 0 && <div className="p-2 text-sm text-gray-600">No clients</div>}
                {liveResults.clients.map((c: any) => (
                  <a key={c.id} href={`/admin/clients`} className="block px-3 py-2 hover:bg-slate-50 text-sm">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-slate-500">{c.category || 'General'}</div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
