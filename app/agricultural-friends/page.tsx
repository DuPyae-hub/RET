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
      { subsidiary: 'Agricultural Friends' }
    )
  } catch (error) {
    return []
  }
}

export default async function AgriculturalFriendsPage() {
  const projects = await getProjects()
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Agricultural Friends', href: '/agricultural-friends' },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Agricultural Friends</h1>
          <p className="text-xl text-yellow-100 max-w-3xl">
            Supporting Myanmar's agricultural sector with comprehensive services and solutions.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">About Agricultural Friends</h2>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg leading-relaxed">
              Agricultural Friends is dedicated to supporting Myanmar's farming communities through a wide range of agricultural services. 
              We provide farmers with the tools, knowledge, and resources needed to improve productivity and sustainability.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              Our services encompass agricultural inputs, equipment distribution, training programs, and market access solutions 
              to help farmers thrive in an evolving agricultural landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Agricultural Inputs</h3>
              <p className="text-gray-600 text-sm">Seeds, fertilizers, and farming supplies</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Equipment</h3>
              <p className="text-gray-600 text-sm">Farming machinery and tools</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Training Programs</h3>
              <p className="text-gray-600 text-sm">Educational workshops and support</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Market Access</h3>
              <p className="text-gray-600 text-sm">Connecting farmers to markets</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Projects */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" delay={100}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Our Projects</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 mx-auto rounded-full"></div>
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
                              ? 'bg-yellow-600 text-white' 
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

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 p-8 rounded-lg border-l-4 border-yellow-600">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Commitment</h3>
            <p className="text-gray-700 text-lg">
              Agricultural Friends is committed to empowering Myanmar's farming communities by providing access to quality inputs, 
              modern equipment, and market opportunities. We believe in sustainable agriculture that benefits both farmers and the environment.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
