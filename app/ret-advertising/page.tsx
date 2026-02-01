import { query } from '@/lib/db'
import SubsidiaryLayout from '@/components/SubsidiaryLayout'
import { Image as ImageIcon, Palette, Megaphone } from 'lucide-react'

const portfolioCategories = [
  'Nationwide Merchandising',
  'Event Management',
  'Building Paint Branding',
  'Vehicle Branding',
  'Signage',
]

async function getProjects(category?: string) {
  try {
    if (category && category !== 'All') {
      return await query(
        'SELECT id, title, description, category, imageUrl, subsidiary, status, createdAt, updatedAt FROM Project WHERE subsidiary = :subsidiary AND category = :category ORDER BY createdAt DESC',
        { subsidiary: 'RET Advertising', category }
      )
    }
    return await query(
      'SELECT id, title, description, category, imageUrl, subsidiary, status, createdAt, updatedAt FROM Project WHERE subsidiary = :subsidiary ORDER BY createdAt DESC',
      { subsidiary: 'RET Advertising' }
    )
  } catch {
    return []
  }
}

export default async function RETAdvertisingPage({ searchParams }: { searchParams: { category?: string } }) {
  const category = searchParams.category || 'All'
  const projects = await getProjects(category === 'All' ? undefined : category)

  return (
    <SubsidiaryLayout
      name="RET Advertising"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'RET Advertising', href: '/ret-advertising' }]}
      heroTitle="RET Advertising"
      heroDescription="Delivering exceptional branding, production, and CSR solutions that make a lasting impact."
      categoryFilter={{
        categories: portfolioCategories,
        currentCategory: category,
        basePath: '/ret-advertising',
      }}
      projects={projects as any[]}
      servicesTitle="Our Services"
      services={[
        { icon: <ImageIcon className="w-7 h-7" />, title: 'Branding & Production', description: 'Creative design and production services for impactful brand campaigns.' },
        { icon: <Palette className="w-7 h-7" />, title: 'Visual Identity', description: 'Comprehensive branding from concept to execution across all media.' },
        { icon: <Megaphone className="w-7 h-7" />, title: 'CSR Solutions', description: 'Corporate social responsibility programs that build lasting impact.' },
      ]}
    />
  )
}
