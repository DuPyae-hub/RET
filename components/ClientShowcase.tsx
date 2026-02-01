'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Client {
  id: string
  name: string
  logoUrl: string
  category: string
  subsidiary: string | null
}

const filterCategories = ['All', 'Contract Client', 'Campaign Client', 'Other Client']

export default function ClientShowcase() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredClients(clients)
    } else {
      setFilteredClients(clients.filter((client) => client.category === activeFilter))
    }
  }, [activeFilter, clients])

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients')
      if (res.ok) {
        const data = await res.json()
        setClients(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-[#0F2942] mb-3">Client Showcase</h2>
        <p className="text-center text-gray-600 mb-10 md:mb-12">Trusted by leading brands across Myanmar</p>

        <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-12">
          {filterCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === category
                  ? 'bg-[#1A4A94] text-white'
                  : 'bg-[#F8F9FA] border border-[#E9ECEF] text-gray-700 hover:border-[#1A4A94] hover:text-[#1A4A94]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-ret h-28 md:h-32 animate-pulse" />
            ))}
          </div>
        ) : filteredClients.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="card-ret p-4 flex items-center justify-center h-28 md:h-32 hover:border-[#1A4A94]/30 transition-colors group"
              >
                <div className="relative w-full h-full grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300">
                  <Image
                    src={client.logoUrl || 'https://via.placeholder.com/150x100?text=Client+Logo'}
                    alt={client.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="card-ret p-8 max-w-md mx-auto">
              <p className="text-gray-600 font-medium mb-2">No clients found</p>
              <p className="text-gray-500 text-sm">
                {activeFilter === 'All'
                  ? 'No clients have been added yet.'
                  : `No clients found in the "${activeFilter}" category.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
