import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import Image from 'next/image'
import { query } from '@/lib/db'
import { FastForward, Users, Map, MapPin, Smartphone, Smile, Sparkles } from 'lucide-react'
import ClientShowcase from '@/components/ClientShowcase'
import ScrollAnimation from '@/components/ScrollAnimation'

// Force dynamic rendering to ensure settings updates are reflected immediately
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Disable all caching
export const fetchCache = 'force-no-store'
export const runtime = 'nodejs'

async function getSiteSettings() {
  // Default values - only used if database query fails or returns no data
  const defaults = {
    mission: 'Work Together to Build Our Business.',
    vision: 'Be an Excellent Service Provider for Our Every Client.',
    history: 'Established since 2007, providing professional overall Advertising & Media Services across the whole Myanmar territory.',
    attitude: 'Learn to work hard on yourself; We have no competitor.',
    coreValues: 'Focus on being a "corporate partner," ensuring "complete satisfaction," and commitment to "quality and efficiency of outcome".',
  }

  try {
    const rows = await query<{ key: string; value: string }[]>(
      'SELECT `key`, `value` FROM site_settings WHERE `key` IN ("mission","vision","history","attitude","coreValues")'
    )
    
    // Handle mysql2 RowDataPacket format - it returns an array
    const rowsArray = Array.isArray(rows) ? rows : []
    
    // If no rows returned, use defaults
    if (rowsArray.length === 0) {
      console.log('No settings found in database, using defaults')
      return defaults
    }
    
    // Build settings object from database - ALWAYS use database values
    const settings: Record<string, string> = {}
    
    // Process rows - mysql2 returns RowDataPacket objects
    rowsArray.forEach((row: any) => {
      // Access properties - mysql2 uses lowercase column names by default
      const key = row.key || row.KEY || row['key'] || row['KEY']
      const value = row.value || row.VALUE || row['value'] || row['VALUE']
      
      if (key) {
        // Always use database value, even if empty string
        settings[String(key)] = value !== null && value !== undefined ? String(value) : ''
      }
    })
    
    // Log for debugging
    console.log('=== Settings from Database ===')
    console.log('Rows found:', rowsArray.length)
    console.log('Settings object:', settings)
    
    // Return database values, only fallback to defaults if key doesn't exist in database
    return {
      mission: settings.mission !== undefined ? settings.mission : defaults.mission,
      vision: settings.vision !== undefined ? settings.vision : defaults.vision,
      history: settings.history !== undefined ? settings.history : defaults.history,
      attitude: settings.attitude !== undefined ? settings.attitude : defaults.attitude,
      coreValues: settings.coreValues !== undefined ? settings.coreValues : defaults.coreValues,
    }
  } catch (error) {
    console.error('Error fetching site settings:', error)
    // Only use defaults if there's an error
    return defaults
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

async function getSubsidiaries() {
  try {
    // First, check if table exists and is empty, then auto-seed
    try {
      const countResult = await query<{ count: number }[]>(
        'SELECT COUNT(*) as count FROM Subsidiary'
      )
      
      const countArray = Array.isArray(countResult) ? countResult : []
      const count = countArray[0]?.count || countArray[0]?.COUNT || 0

      // If no subsidiaries exist, auto-seed them
      if (count === 0) {
        const defaultSubsidiaries = [
          {
            id: 'sub-001',
            name: 'RET Advertising',
            path: '/ret-advertising',
            description: 'Branding, production, and CSR services',
            imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&q=80',
            displayOrder: 1,
          },
          {
            id: 'sub-002',
            name: 'Million Zone',
            path: '/million-zone',
            description: 'Construction, infrastructure, and rural electrification',
            imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=80',
            displayOrder: 2,
          },
          {
            id: 'sub-003',
            name: 'Inner True',
            path: '/inner-true',
            description: 'Distribution and logistics (Telecom, Online Money, FMCG)',
            imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop&q=80',
            displayOrder: 3,
          },
          {
            id: 'sub-004',
            name: 'Agricultural Friends',
            path: '/agricultural-friends',
            description: 'General agricultural services',
            imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop&q=80',
            displayOrder: 4,
          },
        ]

        for (const sub of defaultSubsidiaries) {
          try {
            await query(
              `INSERT INTO Subsidiary (id, name, path, description, imageUrl, displayOrder, createdAt, updatedAt)
               VALUES (:id, :name, :path, :description, :imageUrl, :displayOrder, NOW(3), NOW(3))`,
              {
                id: sub.id,
                name: sub.name,
                path: sub.path,
                description: sub.description,
                imageUrl: sub.imageUrl,
                displayOrder: sub.displayOrder,
              }
            )
          } catch (error: any) {
            // Ignore duplicate key errors
            if (error.code !== 'ER_DUP_ENTRY') {
              console.error(`Error auto-seeding ${sub.name}:`, error)
            }
          }
        }
      }
    } catch (error) {
      // Table might not exist yet, that's okay
      console.log('Auto-seed check skipped (table may not exist):', error)
    }

    // Now fetch all subsidiaries
    const rows = await query<{
      id: string
      name: string
      path: string
      description: string | null
      imageUrl: string | null
      displayOrder: number
    }[]>(
      'SELECT id, name, path, description, imageUrl, displayOrder FROM Subsidiary ORDER BY displayOrder ASC, name ASC'
    )

    const rowsArray = Array.isArray(rows) ? rows : []
    return rowsArray.map((row: any) => ({
      id: row.id || row.ID,
      name: row.name || row.NAME,
      path: row.path || row.PATH,
      description: row.description || row.DESCRIPTION || '',
      imageUrl: row.imageUrl || row.imageURL || row.IMAGEURL || null,
      displayOrder: row.displayOrder || row.DISPLAYORDER || 0,
    }))
  } catch (error) {
    console.error('Error fetching subsidiaries:', error)
    // Return default subsidiaries if database query fails
    return [
      {
        id: 'default-1',
        name: 'RET Advertising',
        path: '/ret-advertising',
        description: 'Branding, production, and CSR services',
        imageUrl: null,
        displayOrder: 1,
      },
      {
        id: 'default-2',
        name: 'Million Zone',
        path: '/million-zone',
        description: 'Construction, infrastructure, and rural electrification',
        imageUrl: null,
        displayOrder: 2,
      },
      {
        id: 'default-3',
        name: 'Inner True',
        path: '/inner-true',
        description: 'Distribution and logistics (Telecom, Online Money, FMCG)',
        imageUrl: null,
        displayOrder: 3,
      },
      {
        id: 'default-4',
        name: 'Agricultural Friends',
        path: '/agricultural-friends',
        description: 'General agricultural services',
        imageUrl: null,
        displayOrder: 4,
      },
    ]
  }
}

export default async function HomePage() {
  const settings = await getSiteSettings()
  const documents = await getLegalDocuments()
  const orgChartUrl = await getOrganizationChartUrl()
  const subsidiaries = await getSubsidiaries()

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

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }]} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 text-white py-24 md:py-32 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border-4 border-white rotate-45 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border-4 border-white rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 border-4 border-white/50 rounded-full animate-pulse"></div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollAnimation direction="fade" delay={100}>
            <div className="flex items-center gap-2 mb-4 animate-fade-in">
              <Sparkles className="w-6 h-6 text-primary-200 animate-pulse" />
              <span className="text-primary-200 text-sm font-semibold uppercase tracking-wider">Since 2007</span>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation direction="up" delay={200}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Royal Ever True
              <br />
              <span className="text-primary-200">Business Group</span>
            </h1>
          </ScrollAnimation>
          
          <ScrollAnimation direction="up" delay={300}>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed">
              Established since 2007, providing professional overall Advertising & Media Services across the whole Myanmar territory.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollAnimation direction="right" delay={100}>
              <div className="card-modern bg-gradient-to-br from-primary-50 to-primary-100 p-8 md:p-10 border-l-4 border-primary-500 hover-lift">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary-800">Our Mission</h2>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{settings.mission}</p>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation direction="left" delay={200}>
              <div className="card-modern bg-gradient-to-br from-secondary-50 to-secondary-100 p-8 md:p-10 border-l-4 border-secondary-500 hover-lift">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-secondary-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-secondary-800">Our Vision</h2>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{settings.vision}</p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Attitude & Core Values */}
      <section className="py-20 bg-gradient-to-br from-accent-500 via-accent-600 to-accent-700 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollAnimation direction="right" delay={100}>
              <div className="glass p-8 md:p-10 rounded-2xl border border-white/30 hover-lift">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Our Attitude</h2>
                </div>
                <p className="text-lg leading-relaxed text-white/95">{settings.attitude}</p>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation direction="left" delay={200}>
              <div className="glass p-8 md:p-10 rounded-2xl border border-white/30 hover-lift">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Core Values</h2>
                </div>
                <p className="text-lg leading-relaxed text-white/95">{settings.coreValues}</p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" delay={100}>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Our History</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation direction="up" delay={200}>
            <div className="card-modern p-8 md:p-10 bg-white">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center">{settings.history}</p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Our Strong Points */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollAnimation direction="up" delay={100}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">
                Our Strong Points
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Key strengths that drive our success and commitment to excellence
              </p>
            </div>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Card 1: Smooth Progress */}
            <ScrollAnimation direction="up" delay={100}>
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="bg-accent-500/10 rounded-lg p-3 group-hover:bg-accent-500/20 transition-colors">
                    <FastForward className="w-6 h-6 text-accent-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 text-gray-800">Smooth Progress</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Efficient workflow and seamless project execution
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Card 2: Organized Team Structure */}
            <ScrollAnimation direction="up" delay={150}>
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="bg-accent-500/10 rounded-lg p-3 group-hover:bg-accent-500/20 transition-colors">
                    <Users className="w-6 h-6 text-accent-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 text-gray-800">Organized Team Structure</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Well-structured teams with clear hierarchy and roles
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Card 3: Nationwide Coverage */}
            <ScrollAnimation direction="up" delay={200}>
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary-500/10 rounded-lg p-3 group-hover:bg-secondary-500/20 transition-colors">
                    <Map className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 text-gray-800">Nationwide Coverage</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Extensive reach across the whole Myanmar territory
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Card 4: Branch Offices */}
            <ScrollAnimation direction="up" delay={250}>
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary-500/10 rounded-lg p-3 group-hover:bg-secondary-500/20 transition-colors">
                    <MapPin className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 text-gray-800">Branch Offices</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Strategic locations for better service delivery
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Card 5: Frequently Update Reports */}
            <ScrollAnimation direction="up" delay={300}>
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary-500/10 rounded-lg p-3 group-hover:bg-secondary-500/20 transition-colors">
                    <Smartphone className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 text-gray-800">Frequently Update Reports</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Real-time updates and transparent communication
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Card 6: Customer Satisfaction */}
            <ScrollAnimation direction="up" delay={350}>
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary-500/10 rounded-lg p-3 group-hover:bg-secondary-500/20 transition-colors">
                    <Smile className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 text-gray-800">Customer Satisfaction</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Commitment to complete satisfaction and quality service
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Client Showcase - Filterable Gallery */}
      <ClientShowcase />

      {/* Subsidiaries */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" delay={100}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Our Subsidiaries</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Explore our diverse portfolio of specialized business units
              </p>
            </div>
          </ScrollAnimation>
          
          <div className="grid md:grid-cols-2 gap-6">
            {subsidiaries.map((sub, index) => (
              <ScrollAnimation key={sub.id || sub.path} direction="up" delay={100 + index * 50}>
                <Link
                  href={sub.path}
                  className="block bg-white rounded-lg p-8 hover:shadow-md transition-shadow duration-300 border-l-4 border-transparent hover:border-primary-500 overflow-hidden"
                >
                  <div className="flex gap-6">
                    {sub.imageUrl && (
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={sub.imageUrl}
                          alt={sub.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-gray-900">
                        {sub.name}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {sub.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" delay={100}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">Organizational Structure</h2>
                <p className="text-gray-600 text-sm mt-2 text-center">
                  Visual overview of leadership, functional managers, and teams.
                </p>
              </div>
              <div className="relative w-full h-[420px] bg-gray-50">
                <Image
                  src={orgChartUrl}
                  alt="Organization Chart"
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
          </ScrollAnimation>
        </div>
      </section>

      {/* Legal Documents */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up" delay={100}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Legal Documents</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
          </ScrollAnimation>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {(documents.length > 0 ? documents : featuredLegalDocs).map((doc, idx) => {
              // Use documentUrl as image source if available, otherwise fallback to imageUrl or placeholder
              const imageSrc = (doc as any).documentUrl || (doc as any).imageUrl || placeholderImage
              const hasDocument = (doc as any).documentUrl || (doc as any).imageUrl

              return (
                <ScrollAnimation key={(doc as any).id ?? idx} direction="up" delay={100 + idx * 100}>
                  <div className="card-modern bg-white flex flex-col group hover-lift image-overlay">
                    <div className="relative h-80 w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={doc.title}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-3">
                        {(doc as any).type && (
                          <span className="text-xs font-semibold text-primary-600 uppercase bg-primary-50 px-3 py-1 rounded-full">
                            {(doc as any).type}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-800 group-hover:text-primary-600 transition-colors">
                        {doc.title}
                      </h3>
                      {(doc as any).description && (
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-1">
                          {(doc as any).description}
                        </p>
                      )}
                      {hasDocument ? (
                        <a
                          href={(doc as any).documentUrl || (doc as any).imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-auto inline-flex items-center gap-2 group/link"
                        >
                          <span>View Full Document</span>
                          <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <p className="text-xs text-gray-500 mt-auto">
                          Upload documents in{' '}
                          <Link href="/admin/legal-documents" className="text-primary-600 hover:underline font-medium">
                            Admin → Legal Documents
                          </Link>
                        </p>
                      )}
                    </div>
                  </div>
                </ScrollAnimation>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
