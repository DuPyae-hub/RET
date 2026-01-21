import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import Image from 'next/image'
import { query } from '@/lib/db'
import ScrollAnimation from '@/components/ScrollAnimation'

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
        'SELECT id, title, description, category, imageUrl, subsidiary, status, createdAt, updatedAt FROM Project WHERE subsidiary = :subsidiary AND category = :category ORDER BY createdAt DESC',
        { subsidiary: 'RET Advertising', category }
      )
    }
    return await query(
      'SELECT id, title, description, category, imageUrl, subsidiary, status, createdAt, updatedAt FROM Project WHERE subsidiary = :subsidiary ORDER BY createdAt DESC',
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {projects.map((project, index) => (
                <ScrollAnimation key={project.id} direction="up" delay={100 + index * 50}>
                  <div className="card-modern bg-white overflow-hidden group hover-lift">
                    <div className="relative h-64 w-full overflow-hidden">
                      <Image
                        src={project.imageUrl || 'https://via.placeholder.com/400x300?text=Project+Image'}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {project.status && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                            project.status === 'ongoing' 
                              ? 'bg-blue-600 text-white' 
                              : project.status === 'finished' 
                              ? 'bg-gray-600 text-white'
                              : 'bg-gray-400 text-white'
                          }`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 md:p-6">
                      {project.category && (
                        <span className="text-xs font-semibold text-primary-600 uppercase bg-primary-50 px-3 py-1 rounded-full inline-block mb-3">
                          {project.category}
                        </span>
                      )}
                      <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects found in this category. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
