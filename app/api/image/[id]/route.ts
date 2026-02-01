import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 })
    }

    const rows = await query<any[]>(
      'SELECT data, mime_type FROM image_storage WHERE id = :id LIMIT 1',
      { id }
    )
    const row = rows?.[0]

    if (!row || !row.data) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const buffer = Buffer.isBuffer(row.data) ? row.data : Buffer.from(row.data)
    const mimeType = row.mime_type || 'application/octet-stream'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load image' },
      { status: 500 }
    )
  }
}
