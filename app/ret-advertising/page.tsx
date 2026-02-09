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

const MOCK_PROJECTS = [
  {
    id: 'mock-ret-1',
    title: 'Nationwide Brand Refresh',
    description:
      'Full rebrand and visual identity rollout across Myanmar for a leading FMCG client. Included signage, vehicle livery, and point-of-sale materials delivered to 50+ locations.',
    category: 'Nationwide Merchandising',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    subsidiary: 'RET Advertising',
    status: 'finished',
  },
  {
    id: 'mock-ret-2',
    title: 'Annual CSR Roadshow',
    description:
      'Event management and branding for a multi-city corporate social responsibility campaign. Stage design, collateral, and on-ground activation across 12 townships.',
    category: 'Event Management',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    subsidiary: 'RET Advertising',
    status: 'finished',
  },
]

async function getProjects(category?: string) {
  try {
    let dbProjects: any[] = []
    if (category && category !== 'All') {
      dbProjects = await query(
        'SELECT id, title, description, category, imageUrl, subsidiary, status, createdAt, updatedAt FROM Project WHERE subsidiary = :subsidiary AND category = :category ORDER BY createdAt DESC',
        { subsidiary: 'RET Advertising', category }
      )
    } else {
      dbProjects = await query(
        'SELECT id, title, description, category, imageUrl, subsidiary, status, createdAt, updatedAt FROM Project WHERE subsidiary = :subsidiary ORDER BY createdAt DESC',
        { subsidiary: 'RET Advertising' }
      )
    }
    const list = Array.isArray(dbProjects) ? dbProjects : []
    if (category === 'All' || !category) {
      return [...MOCK_PROJECTS, ...list]
    }
    return list
  } catch {
    return category === 'All' || !category ? MOCK_PROJECTS : []
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
