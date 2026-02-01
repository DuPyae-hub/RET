import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export default async function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const q = (searchParams?.q || '').toString().trim()

  if (!q) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />
        <h2 className="text-xl font-semibold mt-4">Search</h2>
        <p className="text-gray-600 mt-2">Please provide a search term.</p>
      </div>
    )
  }

  // Query the same API endpoints used elsewhere. These endpoints return full lists; filter server-side here.
  // `fetch` on the server requires an absolute URL. Use NEXT_PUBLIC_BASE_URL if set, otherwise fall back to localhost.
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const [projectsRes, clientsRes] = await Promise.all([
    fetch(`${base}/api/projects`),
    fetch(`${base}/api/clients`),
  ])

  const projects = projectsRes.ok ? (await projectsRes.json()) : []
  const clients = clientsRes.ok ? (await clientsRes.json()) : []

  const qLower = q.toLowerCase()
  const matchedProjects = (projects || []).filter((p: any) => (p.title || '').toLowerCase().includes(qLower) || (p.description || '').toLowerCase().includes(qLower))
  const matchedClients = (clients || []).filter((c: any) => (c.name || '').toLowerCase().includes(qLower))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />
      <h2 className="text-2xl font-semibold mt-4">Search results for “{q}”</h2>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold">Projects ({matchedProjects.length})</h3>
          <div className="mt-3 space-y-3">
            {matchedProjects.length === 0 && <div className="text-gray-600">No projects found.</div>}
            {matchedProjects.map((p: any) => (
              <Link key={p.id} href={`/projects/${p.id}`} className="block p-3 border rounded-md hover:bg-slate-50">
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-gray-600">{p.description}</div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Clients ({matchedClients.length})</h3>
          <div className="mt-3 space-y-3">
            {matchedClients.length === 0 && <div className="text-gray-600">No clients found.</div>}
            {matchedClients.map((c: any) => (
              <Link key={c.id} href={`/admin/clients`} className="block p-3 border rounded-md hover:bg-slate-50">
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-gray-600">{c.category || 'General'}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
