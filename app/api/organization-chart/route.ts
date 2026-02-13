import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { randomBytes } from 'crypto'

export async function GET() {
  try {
    const settings = await query<any[]>(
      'SELECT "value" FROM site_settings WHERE "key" = \'organizationChartUrl\' LIMIT 1'
    )

    const url = settings.length > 0 ? settings[0].value : null
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Error fetching organization chart:', error)
    return NextResponse.json({ url: null })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Check if setting exists
    const existing = await query<any[]>(
      'SELECT id FROM site_settings WHERE "key" = \'organizationChartUrl\' LIMIT 1'
    )

    if (existing.length > 0) {
      // Update existing
      await query(
        'UPDATE site_settings SET "value" = :url, "updatedAt" = NOW() WHERE "key" = \'organizationChartUrl\'',
        { url }
      )
    } else {
      // Insert new
      const id = randomBytes(16).toString('hex')
      await query(
        'INSERT INTO site_settings (id, "key", "value", "updatedAt") VALUES (:id, \'organizationChartUrl\', :url, NOW())',
        { id, url }
      )
    }

    return NextResponse.json({ message: 'Organization chart updated successfully', url })
  } catch (error) {
    console.error('Error updating organization chart:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error
        ? error.message
        : 'Failed to update organization chart'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
