import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import Image from 'next/image'
import { query } from '@/lib/db'
import { FastForward, Users, Map, MapPin, Smartphone, Smile } from 'lucide-react'
import ClientShowcase from '@/components/ClientShowcase'

async function getSiteSettings() {
  try {
    const rows = await query<{ key: string; value: string }[]>(
      'SELECT `key`, `value` FROM site_settings WHERE `key` IN ("mission","vision","history","attitude","coreValues")'
    )
    const map = new Map<string, string>((rows as any[]).map((r) => [r.key, r.value]))
    return {
      mission: map.get('mission') || 'Work Together to Build Our Business.',
      vision: map.get('vision') || 'Be an Excellent Service Provider for Our Every Client.',
      history:
        map.get('history') ||
        'Established since 2007, providing professional overall Advertising & Media Services across the whole Myanmar territory.',
      attitude: map.get('attitude') || 'Learn to work hard on yourself; We have no competitor.',
      coreValues:
        map.get('coreValues') ||
        'Focus on being a "corporate partner," ensuring "complete satisfaction," and commitment to "quality and efficiency of outcome".',
    }
  } catch (error) {
    return {
      mission: 'Work Together to Build Our Business.',
      vision: 'Be an Excellent Service Provider for Our Every Client.',
      history:
        'Established since 2007, providing professional overall Advertising & Media Services across the whole Myanmar territory.',
      attitude: 'Learn to work hard on yourself; We have no competitor.',
      coreValues:
        'Focus on being a "corporate partner," ensuring "complete satisfaction," and commitment to "quality and efficiency of outcome".',
    }
  }
}

async function getLegalDocuments() {
  try {
    return await query(
      'SELECT id, title, description, documentUrl, type, createdAt, updatedAt FROM LegalDocument ORDER BY createdAt DESC LIMIT 6'
    )
  } catch (error) {
    return []
  }
}

async function getOrganizationChartUrl() {
  try {
    const settings = await query<{ value: string }[]>(
      'SELECT `value` FROM site_settings WHERE `key` = "organizationChartUrl" LIMIT 1'
    )
    return settings.length > 0 ? settings[0].value : '/org/organization-chart.png'
  } catch (error) {
    return '/org/organization-chart.png'
  }
}

export default async function HomePage() {
  const settings = await getSiteSettings()
  const documents = await getLegalDocuments()
  const orgChartUrl = await getOrganizationChartUrl()

  const placeholderImage = 'https://via.placeholder.com/800x600?text=Document+Preview'
  const featuredLegalDocs = [
    {
      title: 'Certificate of Incorporation',
      description: 'Royal Ever Truth Business Group Co., Ltd registration (No. 102364597)',
      imageUrl: '/legal/certificate-of-incorporation.jpg',
    },
    {
      title: 'Supplier / Contractor Registration',
      description: 'Royal Ever Truth Co., Ltd supplier / contractor registration',
      imageUrl: '/legal/supplier-contractor-registration.jpg',
    },
    {
      title: 'Business Operating License (Advertising)',
      description: 'Royal Ever Truth Business Group Co., Ltd – Advertising license (valid to 26/Sep/2025)',
      imageUrl: '/legal/operating-license.jpg',
    },
  ]

  const subsidiaries = [
    {
      name: 'RET Advertising',
      path: '/ret-advertising',
      description: 'Branding, production, and CSR services',
      color: 'bg-blue-50 hover:bg-blue-100',
    },
    {
      name: 'Million Zone',
      path: '/million-zone',
      description: 'Construction, infrastructure, and rural electrification',
      color: 'bg-green-50 hover:bg-green-100',
    },
    {
      name: 'Inner True',
      path: '/inner-true',
      description: 'Distribution and logistics (Telecom, Online Money, FMCG)',
      color: 'bg-purple-50 hover:bg-purple-100',
    },
    {
      name: 'Agricultural Friends',
      path: '/agricultural-friends',
      description: 'General agricultural services',
      color: 'bg-yellow-50 hover:bg-yellow-100',
    },
  ]

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }]} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border-4 border-white rotate-45"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border-4 border-white rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Royal Ever True Business Group</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Established since 2007, providing professional overall Advertising & Media Services across the whole Myanmar territory.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-primary-50 p-8 rounded-lg border-l-4 border-primary-500">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">Our Mission</h2>
              <p className="text-gray-700 text-lg">{settings.mission}</p>
            </div>
            <div className="bg-secondary-50 p-8 rounded-lg border-l-4 border-secondary-500">
              <h2 className="text-2xl font-bold text-secondary-800 mb-4">Our Vision</h2>
              <p className="text-gray-700 text-lg">{settings.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Attitude & Core Values */}
      <section className="py-16 bg-gradient-to-br from-accent-500 to-accent-700" style={{ color: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-white/20">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>Our Attitude</h2>
              <p className="text-lg leading-relaxed" style={{ color: '#ffffff' }}>{settings.attitude}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-white/20">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>Core Values</h2>
              <p className="text-lg leading-relaxed" style={{ color: '#ffffff' }}>{settings.coreValues}</p>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Our History</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{settings.history}</p>
        </div>
      </section>

      {/* Our Strong Points */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Star Shape Watermark Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg width="600" height="600" viewBox="0 0 100 100" className="w-full h-full">
              {/* Double-layered Star Shape */}
              <path
                d="M50 5 L61 35 L95 35 L68 55 L79 85 L50 65 L21 85 L32 55 L5 35 L39 35 Z"
                fill="currentColor"
                className="text-accent-500"
              />
              <path
                d="M50 15 L58 38 L82 38 L62 53 L70 75 L50 60 L30 75 L38 53 L18 38 L42 38 Z"
                fill="currentColor"
                className="text-primary-500"
              />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-accent-500">
            Our Strong Points
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Smooth Progress - Dark Blue */}
            <div className="bg-accent-500 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:brightness-110" style={{ color: '#ffffff' }}>
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <FastForward className="w-10 h-10" style={{ color: '#ffffff' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#ffffff' }}>Smooth Progress</h3>
                <p className="text-sm" style={{ color: '#ffffff' }}>
                  Efficient workflow and seamless project execution
                </p>
              </div>
            </div>

            {/* Card 2: Organized Team Structure - Dark Blue */}
            <div className="bg-accent-500 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:brightness-110" style={{ color: '#ffffff' }}>
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <Users className="w-10 h-10" style={{ color: '#ffffff' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#ffffff' }}>Organized Team Structure</h3>
                <p className="text-sm" style={{ color: '#ffffff' }}>
                  Well-structured teams with clear hierarchy and roles
                </p>
              </div>
            </div>

            {/* Card 3: Nationwide Coverage - Solid Green */}
            <div className="bg-secondary-500 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:brightness-110" style={{ color: '#ffffff' }}>
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <Map className="w-10 h-10" style={{ color: '#ffffff' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#ffffff' }}>Nationwide Coverage</h3>
                <p className="text-sm" style={{ color: '#ffffff' }}>
                  Extensive reach across the whole Myanmar territory
                </p>
              </div>
            </div>

            {/* Card 4: Branch Offices - Solid Green */}
            <div className="bg-secondary-500 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:brightness-110" style={{ color: '#ffffff' }}>
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <MapPin className="w-10 h-10" style={{ color: '#ffffff' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#ffffff' }}>Branch Offices</h3>
                <p className="text-sm" style={{ color: '#ffffff' }}>
                  Strategic locations for better service delivery
                </p>
              </div>
            </div>

            {/* Card 5: Frequently Update Reports - Solid Green */}
            <div className="bg-secondary-500 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:brightness-110" style={{ color: '#ffffff' }}>
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <Smartphone className="w-10 h-10" style={{ color: '#ffffff' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#ffffff' }}>Frequently Update Reports</h3>
                <p className="text-sm" style={{ color: '#ffffff' }}>
                  Real-time updates and transparent communication
                </p>
              </div>
            </div>

            {/* Card 6: Customer Satisfaction - Solid Green */}
            <div className="bg-secondary-500 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:brightness-110" style={{ color: '#ffffff' }}>
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <Smile className="w-10 h-10" style={{ color: '#ffffff' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#ffffff' }}>Customer Satisfaction</h3>
                <p className="text-sm" style={{ color: '#ffffff' }}>
                  Commitment to complete satisfaction and quality service
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500" style={{ color: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8" style={{ color: '#ffffff' }}>Our Strength</h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-8 inline-block">
              <div className="text-5xl font-bold mb-2" style={{ color: '#ffffff' }}>Around 250</div>
              <div className="text-xl" style={{ color: '#ffffff' }}>Staff including Field Operations and Branch Offices</div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Showcase - Filterable Gallery */}
      <ClientShowcase />

      {/* Subsidiaries */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Subsidiaries</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subsidiaries.map((sub) => (
              <Link
                key={sub.path}
                href={sub.path}
                className="bg-white p-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-xl border-l-4 border-primary-500"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{sub.name}</h3>
                <p className="text-gray-600 text-sm">{sub.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <h2 className="text-3xl font-bold text-center mb-12">Organizational Structure</h2>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex flex-col items-center">
                <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-lg mb-6 shadow-lg">
                  <h3 className="text-xl font-bold">RET Business Group</h3>
                </div>
                <div className="grid md:grid-cols-4 gap-4 w-full">
                  {subsidiaries.map((sub) => (
                    <Link
                      key={sub.path}
                      href={sub.path}
                      className="bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded text-center transition-colors"
                    >
                      <span className="font-medium text-gray-800">{sub.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Organization Chart Image */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">Organization Chart</h3>
              <p className="text-gray-600 text-sm mt-2">
                Visual overview of leadership, functional managers, and teams across RET Business Group.
              </p>
            </div>
            <div className="relative w-full h-[420px] bg-gray-50">
              <Image
                src={orgChartUrl}
                alt="RET Business Group Organization Chart"
                fill
                className="object-contain p-6"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
            </div>
            {orgChartUrl === '/org/organization-chart.png' && (
              <div className="px-6 py-4 bg-gray-50 text-xs text-gray-500">
                Upload an organization chart in{' '}
                <Link href="/admin/settings" className="text-primary-600 hover:underline">
                  Admin Settings
                </Link>
                .
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Legal Documents */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Legal Documents</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {(documents.length > 0 ? documents : featuredLegalDocs).map((doc, idx) => {
              // Use documentUrl as image source if available, otherwise fallback to imageUrl or placeholder
              const imageSrc = (doc as any).documentUrl || (doc as any).imageUrl || placeholderImage
              const hasDocument = (doc as any).documentUrl || (doc as any).imageUrl

              return (
                <div
                  key={(doc as any).id ?? idx}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col"
                >
                  <div className="relative h-80 w-full bg-gray-50">
                    <Image
                      src={imageSrc}
                      alt={doc.title}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-2">
                      {(doc as any).type && (
                        <span className="text-xs font-semibold text-primary-600 uppercase">
                          {(doc as any).type}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
                    {(doc as any).description && (
                      <p className="text-gray-600 text-sm mb-4">{(doc as any).description}</p>
                    )}
                    {hasDocument ? (
                      <a
                        href={(doc as any).documentUrl || (doc as any).imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-auto inline-flex items-center gap-1"
                      >
                        View Full Document
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <p className="text-xs text-gray-500 mt-auto">
                        Upload documents in{' '}
                        <Link href="/admin/legal-documents" className="text-primary-600 hover:underline">
                          Admin → Legal Documents
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
