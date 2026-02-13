import { query } from '@/lib/db'

export interface PageBanner {
  id: string
  pageKey: string
  title: string | null
  subtitle: string | null
  imageUrl: string
  sortOrder: number
  isActive: number | boolean
}

/** Default hero images when no banners in DB – carousel always visible, not blue block */
const DEFAULT_BANNERS: Record<string, { title?: string; subtitle?: string; imageUrl: string }[]> = {
  home: [
    { imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1600&q=80', title: 'Royal Ever Truth Business Group', subtitle: 'Established since 2007, providing professional overall Advertising & Media Services across the whole Myanmar territory.' },
    { imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&q=80', title: 'Royal Ever Truth Business Group', subtitle: 'Building trusted brands across Myanmar.' },
    { imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80', title: 'Royal Ever Truth Business Group', subtitle: 'Excellence and innovation across multiple industries.' },
  ],
  'ret-advertising': [
    { imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&q=80', title: 'RET Advertising', subtitle: 'Delivering exceptional branding, production, and CSR solutions that make a lasting impact.' },
    { imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80', title: 'RET Advertising', subtitle: 'Creative design and production services for impactful brand campaigns.' },
  ],
  'million-zone': [
    { imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80', title: 'Million Zone', subtitle: 'Leading construction, infrastructure development, and rural electrification services across Myanmar.' },
    { imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80', title: 'Million Zone', subtitle: 'Reliable, sustainable solutions for communities across Myanmar.' },
  ],
  'nl-truth': [
    { imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=80', title: 'NL Truth', subtitle: 'Your trusted partner in distribution and logistics across Telecom, Online Money, and FMCG sectors.' },
    { imageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1600&q=80', title: 'NL Truth', subtitle: 'Efficient, reliable delivery across Myanmar.' },
  ],
  'agricultural-friends': [
    { imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80', title: 'Agricultural Friends', subtitle: "Supporting Myanmar's agricultural sector with comprehensive services and solutions." },
    { imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&q=80', title: 'Agricultural Friends', subtitle: 'Empowering farming communities with tools, knowledge, and market access.' },
  ],
}

function getDefaultBanners(pageKey: string): PageBanner[] {
  const slides = DEFAULT_BANNERS[pageKey] ?? DEFAULT_BANNERS.home
  return slides.map((s, i) => ({
    id: `default-${pageKey}-${i}`,
    pageKey,
    title: s.title ?? null,
    subtitle: s.subtitle ?? null,
    imageUrl: s.imageUrl,
    sortOrder: i,
    isActive: 1,
  }))
}

export async function getPageBanners(pageKey: string): Promise<PageBanner[]> {
  try {
    const rows = await query<any[]>(
      'SELECT id, "pageKey", title, subtitle, "imageUrl", "sortOrder", "isActive", "createdAt", "updatedAt" FROM "PageBanner" WHERE "pageKey" = :pageKey AND "isActive" = 1 ORDER BY "sortOrder" ASC, "createdAt" DESC',
      { pageKey }
    )

    const list = Array.isArray(rows) ? rows : []
    if (list.length > 0) {
      const mapped = list.map((row: any) => ({
        id: row.id || row.ID,
        pageKey: row.pageKey || row.PAGEKEY,
        title: row.title ?? row.TITLE ?? null,
        subtitle: row.subtitle ?? row.SUBTITLE ?? null,
        imageUrl: row.imageUrl || row.IMAGEURL,
        sortOrder: typeof row.sortOrder === 'number' ? row.sortOrder : row.SORTORDER ?? 0,
        isActive: row.isActive ?? row.ISACTIVE ?? 1,
      }))
      // Carousel needs at least 2 slides; duplicate single banner so it still rotates
      if (mapped.length === 1) {
        mapped.push({
          ...mapped[0],
          id: `${mapped[0].id}-copy`,
          sortOrder: mapped[0].sortOrder + 1,
        })
      }
      return mapped
    }
    return getDefaultBanners(pageKey)
  } catch (error) {
    console.error('[getPageBanners] Error fetching banners for', pageKey, error)
    return getDefaultBanners(pageKey)
  }
}

