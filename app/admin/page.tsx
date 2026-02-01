"use client"

import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [projectCount, setProjectCount] = useState<number | null>(null)
  const [clientCount, setClientCount] = useState<number | null>(null)

  useEffect(() => {
    async function loadCounts() {
      try {
        const [projectsRes, clientsRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/clients'),
        ])

        if (projectsRes.ok) {
          const projects = await projectsRes.json()
          setProjectCount(Array.isArray(projects) ? projects.length : 0)
        } else setProjectCount(0)

        if (clientsRes.ok) {
          const clients = await clientsRes.json()
          setClientCount(Array.isArray(clients) ? clients.length : 0)
        } else setClientCount(0)
      } catch (err) {
        setProjectCount(0)
        setClientCount(0)
      }
    }
    loadCounts()
  }, [])

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Admin', href: '/admin' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#0F2942] mb-6">Admin Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <Link href="/admin/projects" className="card-ret p-6 hover-lift group flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1A4A94]/10">
                <svg className="w-6 h-6 text-[#1A4A94]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
                </svg>
              </div>
              <div className="text-sm text-slate-500">Projects</div>
            </div>
            <div className="mt-auto">
              <div className="text-2xl font-bold text-[#0F2942]">{projectCount ?? '—'}</div>
              <div className="text-sm text-gray-500">Total projects across subsidiaries</div>
            </div>
          </Link>

          <Link href="/admin/clients" className="card-ret p-6 hover-lift group flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1A4A94]/10">
                <svg className="w-6 h-6 text-[#1A4A94]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857" />
                </svg>
              </div>
              <div className="text-sm text-slate-500">Clients</div>
            </div>
            <div className="mt-auto">
              <div className="text-2xl font-bold text-[#0F2942]">{clientCount ?? '—'}</div>
              <div className="text-sm text-gray-500">Total registered clients</div>
            </div>
          </Link>

          <Link href="/admin/settings" className="card-ret p-6 hover-lift group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 bg-[#1A4A94]/10">
              <svg className="w-6 h-6 text-[#1A4A94]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-1 text-[#0F2942]">Site Settings</h3>
            <p className="text-gray-600 text-sm">Mission, Vision, Office Address, organization chart.</p>
          </Link>

          <Link href="/admin/subsidiaries" className="card-ret p-6 hover-lift group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 bg-[#1A4A94]/10">
              <svg className="w-6 h-6 text-[#1A4A94]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-1 text-[#0F2942]">Subsidiaries</h3>
            <p className="text-gray-600 text-sm">Manage subsidiaries, images, descriptions, display order.</p>
          </Link>
        </div>

        {/* existing grid of admin sections */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/admin/projects" className="card-ret p-6 hover-lift group">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-[#1A4A94]/10 group-hover:bg-[#1A4A94]/15 transition-colors">
              <svg className="w-7 h-7 text-[#1A4A94]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2 text-[#0F2942]">Project Management</h2>
            <p className="text-gray-600 text-sm">Upload and manage portfolio projects for all categories.</p>
          </Link>

          <Link href="/admin/clients" className="card-ret p-6 hover-lift group">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-[#1A4A94]/10 group-hover:bg-[#1A4A94]/15 transition-colors">
              <svg className="w-7 h-7 text-[#1A4A94]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2 text-[#0F2942]">Client Management</h2>
            <p className="text-gray-600 text-sm">Manage client logos and categorize them.</p>
          </Link>

          <Link href="/admin/settings" className="card-ret p-6 hover-lift group">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-[#1A4A94]/10 group-hover:bg-[#1A4A94]/15 transition-colors">
              <svg className="w-7 h-7 text-[#1A4A94]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2 text-[#0F2942]">Site Settings</h2>
            <p className="text-gray-600 text-sm">Mission, Vision, Office Address, organization chart.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
