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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: '#00008B' }}>
          Client Showcase
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Trusted by leading brands across Myanmar
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filterCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-primary-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={
                activeFilter === category
                  ? { backgroundColor: '#FFD700', color: '#ffffff' }
                  : {}
              }
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 animate-pulse rounded-lg h-32 flex items-center justify-center"
              >
                <div className="w-24 h-16 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredClients.length > 0 ? (
          /* Logo Grid */
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="bg-white p-4 rounded-lg border-2 border-gray-200 flex items-center justify-center h-32 hover:border-primary-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="relative w-full h-full grayscale group-hover:grayscale-0 transition-all duration-300">
                  <Image
                    src={client.logoUrl || 'https://via.placeholder.com/150x100?text=Client+Logo'}
                    alt={client.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
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
