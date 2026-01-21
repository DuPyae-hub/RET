import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import Image from 'next/image'
import { query } from '@/lib/db'

const portfolioCategories = [
  'Nationwide Merchandising',
  'Event Management',
  'Building Paint Branding',
  'Vehicle Branding',
  'Signage',
]

async function getProjects(category?: string) {
  try {
    if (category && category !== 'All') {
      return await query(
        'SELECT id, title, description, category, imageUrl, subsidiary, createdAt, updatedAt FROM Project WHERE subsidiary = :subsidiary AND category = :category ORDER BY createdAt DESC',
        { subsidiary: 'RET Advertising', category }
      )
    }
    return await query(
      'SELECT id, title, description, category, imageUrl, subsidiary, createdAt, updatedAt FROM Project WHERE subsidiary = :subsidiary ORDER BY createdAt DESC',
      { subsidiary: 'RET Advertising' }
    )
  } catch (error) {
    return []
  }
}

async function getClients() {
  try {
    return await query(
      'SELECT id, name, logoUrl, category, subsidiary, createdAt, updatedAt FROM Client WHERE subsidiary = :subsidiary ORDER BY createdAt DESC',
      { subsidiary: 'RET Advertising' }
    )
  } catch (error) {
    return []
  }
}

export default async function RETAdvertisingPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const category = searchParams.category || 'All'
  const projects = await getProjects(category === 'All' ? undefined : category)
  const clients = await getClients()

  const contractClients = clients.filter((c) => c.category === 'Contract Clients')
  const campaignClients = clients.filter((c) => c.category === 'Campaign Clients')
  const sectorClients = clients.filter((c) => c.category === 'Sector Clients')

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'RET Advertising', href: '/ret-advertising' },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">RET Advertising</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Delivering exceptional branding, production, and CSR solutions that make a lasting impact.
          </p>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Portfolio Showcase</h2>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              href="/ret-advertising"
              className={`px-6 py-2 rounded-full transition-colors ${
                category === 'All'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </Link>
            {portfolioCategories.map((cat) => (
              <Link
                key={cat}
                href={`/ret-advertising?category=${encodeURIComponent(cat)}`}
                className={`px-6 py-2 rounded-full transition-colors ${
                  category === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Project Grid */}
          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={project.imageUrl || 'https://via.placeholder.com/400x300?text=Project+Image'}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold text-primary-600 uppercase">{project.category}</span>
                    <h3 className="text-lg font-semibold mt-2 mb-2">{project.title}</h3>
                    {project.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects found in this category. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Clients</h2>

          {/* Contract Clients */}
          {contractClients.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Contract Clients</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {contractClients.map((client) => (
                  <div
                    key={client.id}
                    className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-center h-32 hover:shadow-md transition-shadow"
                  >
                    <Image
                      src={client.logoUrl || 'https://via.placeholder.com/150x100?text=Client+Logo'}
                      alt={client.name}
                      width={120}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campaign Clients */}
          {campaignClients.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Campaign Clients</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {campaignClients.map((client) => (
                  <div
                    key={client.id}
                    className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-center h-32 hover:shadow-md transition-shadow"
                  >
                    <Image
                      src={client.logoUrl || 'https://via.placeholder.com/150x100?text=Client+Logo'}
                      alt={client.name}
                      width={120}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sector Clients */}
          {sectorClients.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Sector Clients</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {sectorClients.map((client) => (
                  <div
                    key={client.id}
                    className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-center h-32 hover:shadow-md transition-shadow"
                  >
                    <Image
                      src={client.logoUrl || 'https://via.placeholder.com/150x100?text=Client+Logo'}
                      alt={client.name}
                      width={120}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {contractClients.length === 0 && campaignClients.length === 0 && sectorClients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Client information coming soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
