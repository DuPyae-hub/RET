import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

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

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rows = await query<any[]>(
      'SELECT id, pageKey, title, subtitle, imageUrl, sortOrder, isActive, createdAt, updatedAt FROM PageBanner WHERE id = :id LIMIT 1',
      { id: params.id }
    )
    const banner = rowToBanner((rows as any[])[0])
    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }
    return NextResponse.json(banner)
  } catch (error) {
    console.error('Error fetching banner:', error)
    const message = process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to fetch banner'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}))
    const { pageKey, title, subtitle, imageUrl, sortOrder, isActive } = body

    const existing = await query<any[]>(
      'SELECT id, pageKey, title, subtitle, imageUrl, sortOrder, isActive FROM PageBanner WHERE id = :id LIMIT 1',
      { id: params.id }
    )
    const current = (existing as any[])[0]
    if (!current) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    const currentImageUrl = current.imageUrl ?? current.IMAGEURL ?? ''
    const finalImageUrl = imageUrl != null && String(imageUrl).trim() !== '' ? String(imageUrl).trim() : currentImageUrl
    if (!finalImageUrl) {
      return NextResponse.json({ error: 'imageUrl is required (upload an image or keep existing)' }, { status: 400 })
    }

    const finalPageKey = pageKey != null && String(pageKey).trim() !== '' ? String(pageKey).trim() : (current.pageKey ?? current.PAGEKEY ?? '')

    await query(
      `UPDATE PageBanner
       SET pageKey = :pageKey,
           title = :title,
           subtitle = :subtitle,
           imageUrl = :imageUrl,
           sortOrder = :sortOrder,
           isActive = :isActive,
           updatedAt = NOW()
       WHERE id = :id`,
      {
        id: params.id,
        pageKey: finalPageKey,
        title: title !== undefined ? (title != null && title !== '' ? String(title) : null) : (current.title ?? current.TITLE ?? null),
        subtitle: subtitle !== undefined ? (subtitle != null && subtitle !== '' ? String(subtitle) : null) : (current.subtitle ?? current.SUBTITLE ?? null),
        imageUrl: finalImageUrl,
        sortOrder: typeof sortOrder === 'number' && !Number.isNaN(sortOrder) ? sortOrder : Number(current.sortOrder ?? current.SORTORDER ?? 0),
        isActive: isActive !== false && isActive !== 0 ? 1 : 0,
      }
    )

    const rows = await query<any[]>(
      'SELECT id, pageKey, title, subtitle, imageUrl, sortOrder, isActive, createdAt, updatedAt FROM PageBanner WHERE id = :id LIMIT 1',
      { id: params.id }
    )
    const updated = rowToBanner((rows as any[])[0])
    return NextResponse.json(updated ?? { id: params.id })
  } catch (error) {
    console.error('Error updating banner:', error)
    const message = process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to update banner'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await query('DELETE FROM PageBanner WHERE id = :id', { id: params.id })
    return NextResponse.json({ message: 'Banner deleted successfully' })
  } catch (error) {
    console.error('Error deleting banner:', error)
    const message = process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to delete banner'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
