import { query } from '@/lib/db'
import SubsidiaryLayout from '@/components/SubsidiaryLayout'
import { Building2, Route, Zap } from 'lucide-react'

async function getProjects() {
  try {
    return await query(
      'SELECT id, title, description, category, imageUrl, subsidiary, status, createdAt, updatedAt FROM Project WHERE subsidiary = :subsidiary ORDER BY createdAt DESC',
      { subsidiary: 'Million Zone' }
    )
  } catch {
    return []
  }
}

export default async function MillionZonePage() {
  const projects = await getProjects()

  return (
    <SubsidiaryLayout
      name="Million Zone"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Million Zone', href: '/million-zone' }]}
      heroTitle="Million Zone"
      heroDescription="Leading construction, infrastructure development, and rural electrification services across Myanmar."
      aboutTitle="About Million Zone"
      aboutContent={
        <>
          <p className="mb-4">
            Million Zone specializes in construction and infrastructure development, with a particular focus on rural electrification projects.
            We bring reliable, sustainable solutions to communities across Myanmar, ensuring access to essential infrastructure and power.
          </p>
          <p>
            Our expertise spans residential and commercial construction, road infrastructure, electrical systems, and large-scale rural development projects.
          </p>
        </>
      }
      projects={projects as any[]}
      servicesTitle="Our Services"
      services={[
        { icon: <Building2 className="w-7 h-7" />, title: 'Construction', description: 'Residential and commercial building construction.' },
        { icon: <Route className="w-7 h-7" />, title: 'Infrastructure', description: 'Roads, bridges, and public infrastructure development.' },
        { icon: <Zap className="w-7 h-7" />, title: 'Rural Electrification', description: 'Bringing power to rural communities across Myanmar.' },
      ]}
    />
  )
}
