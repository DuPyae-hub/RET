import Breadcrumbs from '@/components/Breadcrumbs'
import Image from 'next/image'
import { query } from '@/lib/db'
import ScrollAnimation from '@/components/ScrollAnimation'

interface Project {
  id: string
  title: string
  description: string | null
  category: string
  imageUrl: string
  subsidiary: string | null
  status: string | null
  createdAt: Date
  updatedAt: Date
}

async function getProjects(): Promise<Project[]> {
  try {
    return await query<Project[]>(
      'SELECT id, title, description, category, imageUrl, subsidiary, status, createdAt, updatedAt FROM Project WHERE subsidiary = :subsidiary ORDER BY createdAt DESC',
      { subsidiary: 'Million Zone' }
    )
  } catch (error) {
    return []
  }
}

export default async function MillionZonePage() {
  const projects = await getProjects()

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Million Zone', href: '/million-zone' },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Million Zone</h1>
          <p className="text-xl text-green-100 max-w-3xl">
            Leading construction, infrastructure development, and rural electrification services across Myanmar.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">About Million Zone</h2>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg leading-relaxed">
              Million Zone specializes in construction and infrastructure development, with a particular focus on rural electrification projects. 
              We bring reliable, sustainable solutions to communities across Myanmar, ensuring access to essential infrastructure and power.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              Our expertise spans residential and commercial construction, road infrastructure, electrical systems, and large-scale rural development projects.
            </p>
          </div>
        </div>
      </section>

      {/* Our Projects */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" delay={100}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Our Projects</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 mx-auto rounded-full"></div>
            </div>
          </ScrollAnimation>
          
          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {projects.map((project, index) => (
                <ScrollAnimation key={project.id} direction="up" delay={100 + index * 50}>
                  <div className="card-modern bg-white overflow-hidden group hover-lift">
                    <div className="relative h-64 w-full overflow-hidden">
                      <Image
                        src={project.imageUrl || 'https://via.placeholder.com/600x400?text=Project+Image'}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {project.status && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                            project.status === 'ongoing' 
                              ? 'bg-green-600 text-white' 
                              : project.status === 'finished' 
                              ? 'bg-gray-600 text-white'
                              : 'bg-gray-400 text-white'
                          }`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-gray-700 leading-relaxed">{project.description}</p>
                      )}
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects to display at this time. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Construction</h3>
              <p className="text-gray-600">Residential and commercial building construction</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Infrastructure</h3>
              <p className="text-gray-600">Roads, bridges, and public infrastructure development</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rural Electrification</h3>
              <p className="text-gray-600">Bringing power to rural communities across Myanmar</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
