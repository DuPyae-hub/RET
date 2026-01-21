import Breadcrumbs from '@/components/Breadcrumbs'

export default function InnerTruePage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Inner True', href: '/inner-true' },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Inner True</h1>
          <p className="text-xl text-purple-100 max-w-3xl">
            Your trusted partner in distribution and logistics across Telecom, Online Money, and FMCG sectors.
          </p>
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

      {/* Services */}
      <section className="py-16 bg-gray-50">
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
      <section className="py-16 bg-white">
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
