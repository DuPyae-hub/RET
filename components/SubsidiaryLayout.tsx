import Breadcrumbs from './Breadcrumbs'
import ScrollAnimation from './ScrollAnimation'
import Image from 'next/image'
import Link from 'next/link'

export const SUBSIDIARY_ACCENTS: Record<string, string> = {
  'RET Advertising': '#FFC107',   // Gold
  'Million Zone': '#0D9488',      // Teal
  'Inner True': '#7C3AED',        // Purple
  'Agricultural Friends': '#059669', // Green
}

interface SubsidiaryLayoutProps {
  name: string
  breadcrumbs: { label: string; href: string }[]
  heroTitle: string
  heroDescription: string
  aboutTitle?: string
  aboutContent?: React.ReactNode
  projectsTitle?: string
  projects?: Array<{
    id: string
    title: string
    description: string | null
    category?: string | null
    imageUrl: string
    status?: string | null
  }>
  servicesTitle?: string
  services?: Array<{
    icon: React.ReactNode
    title: string
    description: string
  }>
  extraSections?: React.ReactNode
  categoryFilter?: {
    categories: string[]
    currentCategory: string
    basePath: string
  }
}

export default function SubsidiaryLayout({
  name,
  breadcrumbs,
  heroTitle,
  heroDescription,
  aboutTitle,
  aboutContent,
  projectsTitle = 'Our Projects',
  projects = [],
  servicesTitle = 'Our Services',
  services = [],
  extraSections,
  categoryFilter,
}: SubsidiaryLayoutProps) {
  const accent = SUBSIDIARY_ACCENTS[name] || '#FFC107'

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />

      {/* Hero - Royal Blue, consistent across subsidiaries */}
      <section className="bg-[#1A4A94] text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-100" aria-hidden />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-white">{heroTitle}</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl">{heroDescription}</p>
        </div>
      </section>

      {/* About */}
      {aboutTitle && aboutContent && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#0F2942] mb-8">{aboutTitle}</h2>
            <div className="prose max-w-none text-gray-600 text-base leading-relaxed">{aboutContent}</div>
          </div>
        </section>
      )}

      {/* Category Filter (RET Advertising only) */}
      {categoryFilter && (
        <section className="py-6 bg-[#F8F9FA] border-b border-[#E9ECEF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={categoryFilter.basePath}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter.currentCategory === 'All'
                    ? 'bg-[#1A4A94] text-white'
                    : 'bg-white border border-[#E9ECEF] text-gray-700 hover:border-[#1A4A94] hover:text-[#1A4A94]'
                }`}
              >
                All
              </Link>
              {categoryFilter.categories.map((cat) => (
                <Link
                  key={cat}
                  href={`${categoryFilter.basePath}?category=${encodeURIComponent(cat)}`}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    categoryFilter.currentCategory === cat
                      ? 'bg-[#1A4A94] text-white'
                      : 'bg-white border border-[#E9ECEF] text-gray-700 hover:border-[#1A4A94] hover:text-[#1A4A94]'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      <section className="py-12 md:py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#0F2942] mb-2">{projectsTitle}</h2>
            <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: accent }} />
          </div>
          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {projects.map((project, index) => (
                <ScrollAnimation key={project.id} direction="up" delay={100 + index * 50}>
                  <div className="card-ret overflow-hidden group hover-lift">
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={project.imageUrl || 'https://via.placeholder.com/400x300?text=Project+Image'}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {project.status && (
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            project.status === 'ongoing' ? 'bg-[#059669] text-white' :
                            project.status === 'finished' ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white'
                          }`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 md:p-6">
                      {project.category && (
                        <span className="text-xs font-semibold uppercase px-3 py-1 rounded-full inline-block mb-2" style={{ backgroundColor: `${accent}20`, color: accent }}>
                          {project.category}
                        </span>
                      )}
                      <h3 className="text-base md:text-lg font-semibold mb-2 text-[#0F2942]">{project.title}</h3>
                      {project.description && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{project.description}</p>
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
      {services.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#0F2942] mb-10">{servicesTitle}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.map((svc) => (
                <div key={svc.title} className="card-ret p-6 md:p-8 text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${accent}20` }}>
                    <div style={{ color: accent }}>{svc.icon}</div>
                  </div>
                  <h3 className="text-base font-semibold mb-2 text-[#0F2942]">{svc.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{svc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {extraSections}
    </div>
  )
}
