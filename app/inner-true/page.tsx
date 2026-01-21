import Breadcrumbs from '@/components/Breadcrumbs'
import ScrollAnimation from '@/components/ScrollAnimation'
import Image from 'next/image'
import { query } from '@/lib/db'

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
      { subsidiary: 'Inner True' }
    )
  } catch (error) {
    return []
  }
}

export default async function InnerTruePage() {
  const projects = await getProjects()
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Inner True', href: '/inner-true' },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border-4 border-white rotate-45 animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollAnimation direction="fade" delay={100}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">Inner True</h1>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={200}>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl leading-relaxed">
              Your trusted partner in distribution and logistics across Telecom, Online Money, and FMCG sectors.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">About Inner True</h2>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg leading-relaxed">
              Inner True is a leading distribution and logistics company specializing in fast-moving consumer goods (FMCG), 
              telecommunications products, and digital financial services. We ensure efficient, reliable delivery across Myanmar.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              With extensive networks and strategic partnerships, we connect businesses with consumers nationwide, 
              enabling seamless access to essential products and services.
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
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-purple-600 mx-auto rounded-full"></div>
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
                              ? 'bg-purple-600 text-white' 
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
                      {project.category && (
                        <span className="text-xs font-semibold text-purple-600 uppercase bg-purple-50 px-3 py-1 rounded-full inline-block mb-3">
                          {project.category}
                        </span>
                      )}
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
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Telecom Distribution</h3>
              <p className="text-gray-600">
                Distribution of mobile devices, accessories, and telecommunications equipment to retailers and consumers nationwide.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Online Money</h3>
              <p className="text-gray-600">
                Distribution and management of digital financial services, mobile payment solutions, and online money platforms.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">FMCG Distribution</h3>
              <p className="text-gray-600">
                Fast-moving consumer goods distribution including food, beverages, personal care, and household products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Network Coverage */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Our Network</h2>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-8 rounded-lg">
            <p className="text-center text-lg text-gray-700 max-w-3xl mx-auto">
              Inner True maintains an extensive distribution network covering major cities and rural areas across Myanmar, 
              ensuring timely and efficient delivery of products to our partners and end consumers.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
