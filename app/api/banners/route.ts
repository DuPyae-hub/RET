import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { randomUUID } from 'crypto'

function rowToBanner(row: any) {
  if (!row) return null
  return {
    id: String(row.id ?? row.ID ?? ''),
    pageKey: String(row.pageKey ?? row.PAGEKEY ?? ''),
    title: row.title ?? row.TITLE ?? null,
    subtitle: row.subtitle ?? row.SUBTITLE ?? null,
    imageUrl: String(row.imageUrl ?? row.IMAGEURL ?? ''),
    sortOrder: Number(row.sortOrder ?? row.SORTORDER ?? 0),
    isActive: Number(row.isActive ?? row.ISACTIVE ?? 1),
    createdAt: row.createdAt ?? row.CREATEDAT ?? null,
    updatedAt: row.updatedAt ?? row.UPDATEDAT ?? null,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageKey = searchParams.get('pageKey')

    let sql = 'SELECT id, pageKey, title, subtitle, imageUrl, sortOrder, isActive, createdAt, updatedAt FROM PageBanner'
    const params: Record<string, any> = {}
    if (pageKey) {
      sql += ' WHERE pageKey = :pageKey'
      params.pageKey = pageKey
    }
    sql += ' ORDER BY pageKey ASC, sortOrder ASC, createdAt ASC'

    const rows = await query<any[]>(sql, Object.keys(params).length ? params : undefined)
    const list = Array.isArray(rows) ? rows : []
    const banners = list.map((row: any) => rowToBanner(row)).filter(Boolean)
    return NextResponse.json(banners)
  } catch (error) {
    console.error('Error fetching banners:', error)
    const message = process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to fetch banners'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { pageKey, title, subtitle, imageUrl, sortOrder, isActive } = body

    if (!pageKey || typeof pageKey !== 'string' || !pageKey.trim()) {
      return NextResponse.json({ error: 'pageKey is required' }, { status: 400 })
    }
    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.trim()) {
      return NextResponse.json({ error: 'imageUrl is required (upload an image)' }, { status: 400 })
    }

    const id = randomUUID()
    await query(
      `INSERT INTO PageBanner (id, pageKey, title, subtitle, imageUrl, sortOrder, isActive, createdAt, updatedAt)
       VALUES (:id, :pageKey, :title, :subtitle, :imageUrl, :sortOrder, :isActive, NOW(), NOW())`,
      {
        id,
        pageKey: String(pageKey).trim(),
        title: title != null && title !== '' ? String(title) : null,
        subtitle: subtitle != null && subtitle !== '' ? String(subtitle) : null,
        imageUrl: String(imageUrl).trim(),
        sortOrder: typeof sortOrder === 'number' && !Number.isNaN(sortOrder) ? sortOrder : 0,
        isActive: isActive !== false && isActive !== 0 ? 1 : 0,
      }
    )

    const rows = await query<any[]>(
      'SELECT id, pageKey, title, subtitle, imageUrl, sortOrder, isActive, createdAt, updatedAt FROM PageBanner WHERE id = :id LIMIT 1',
      { id }
    )
    const created = rowToBanner((rows as any[])[0])
    return NextResponse.json(created ?? { id }, { status: 201 })
  } catch (error) {
    console.error('Error creating banner:', error)
    const message = process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to create banner'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
