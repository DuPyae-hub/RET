import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-accent-500 text-white border-t-4 border-primary-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">RET Business Group</h3>
            <p className="text-gray-400 text-sm">
              A leading business conglomerate dedicated to excellence and innovation across multiple industries.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Subsidiaries</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ret-advertising" className="text-gray-300 hover:text-primary-400 transition-colors">RET Advertising</Link></li>
              <li><Link href="/million-zone" className="text-gray-300 hover:text-primary-400 transition-colors">Million Zone</Link></li>
              <li><Link href="/inner-true" className="text-gray-300 hover:text-primary-400 transition-colors">Inner True</Link></li>
              <li><Link href="/agricultural-friends" className="text-gray-300 hover:text-primary-400 transition-colors">Agricultural Friends</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Head Office</h3>
            <address className="text-gray-400 text-sm not-italic mb-4">
              No. 1168, Min Ye' Kyaw Swar Road<br />
              6th Quarter, East Dagon Township<br />
              Yangon, Myanmar
            </address>
            <div className="text-gray-400 text-sm space-y-2">
              <div>
                <strong className="text-gray-300">Email:</strong>
                <div>
                  <a href="mailto:aungkowin3871@gmail.com" className="hover:text-white">
                    aungkowin3871@gmail.com
                  </a>
                </div>
                <div>
                  <a href="mailto:royalevertruth@gmail.com" className="hover:text-white">
                    royalevertruth@gmail.com
                  </a>
                </div>
              </div>
              <div className="mt-3">
                <strong className="text-gray-300">Phone:</strong>
                <div>
                  <a href="tel:+959425746667" className="hover:text-white">09 42574 6667</a>
                </div>
                <div>
                  <a href="tel:+95942576665" className="hover:text-white">09 4257 6665</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Royal Ever True (RET) Business Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
