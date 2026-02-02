import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1A4A94] text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-white">
              RET Business Group
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              A leading business conglomerate dedicated to excellence and
              innovation across multiple industries.
            </p>
          </div>

          {/* Subsidiaries */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-white">
              Subsidiaries
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/ret-advertising"
                  className="text-white/80 hover:text-[#FFC107] transition-colors"
                >
                  RET Advertising
                </Link>
              </li>
              <li>
                <Link
                  href="/million-zone"
                  className="text-white/80 hover:text-[#FFC107] transition-colors"
                >
                  Million Zone
                </Link>
              </li>
              <li>
                <Link
                  href="/inner-true"
                  className="text-white/80 hover:text-[#FFC107] transition-colors"
                >
                  Inner True
                </Link>
              </li>
              <li>
                <Link
                  href="/agricultural-friends"
                  className="text-white/80 hover:text-[#FFC107] transition-colors"
                >
                  Agricultural Friends
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-white/80 hover:text-[#FFC107] transition-colors"
                >
                  Group Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-white/80 hover:text-[#FFC107] transition-colors"
                >
                  Admin
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/legal-documents"
                  className="text-white/80 hover:text-[#FFC107] transition-colors"
                >
                  Legal Documents
                </Link>
              </li>
            </ul>
          </div>

          {/* Head Office */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-white">
              Head Office
            </h3>
            <address className="text-white/80 text-sm not-italic mb-4 leading-relaxed">
              No. 1168, Min Ye&apos; Kyaw Swar Road
              <br />
              6th Quarter, East Dagon Township
              <br />
              Yangon, Myanmar
            </address>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-white">Email:</span>
                <div className="mt-1 space-y-0.5">
                  <a
                    href="mailto:aungkowin3871@gmail.com"
                    className="text-white/80 hover:text-[#FFC107] block transition-colors"
                  >
                    aungkowin3871@gmail.com
                  </a>
                  <a
                    href="mailto:royalevertruth@gmail.com"
                    className="text-white/80 hover:text-[#FFC107] block transition-colors"
                  >
                    royalevertruth@gmail.com
                  </a>
                </div>
              </div>
              <div>
                <span className="font-medium text-white">Phone:</span>
                <div className="mt-1 space-y-0.5">
                  <a
                    href="tel:+959425746667"
                    className="text-white/80 hover:text-[#FFC107] block transition-colors"
                  >
                    09 42574 6667
                  </a>
                  <a
                    href="tel:+95942576665"
                    className="text-white/80 hover:text-[#FFC107] block transition-colors"
                  >
                    09 4257 6665
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center text-sm text-white/70">
          <p>
            &copy; {new Date().getFullYear()} Royal Ever Truth (RET) Business
            Group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
