import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function GET() {
  try {
    const settingsMap: Record<string, string> = {}

    const rows = await query<{ key: string; value: string }[]>(
      'SELECT `key`, `value` FROM site_settings'
    )
    
    // Handle mysql2 result format (can be array or RowDataPacket)
    const rowsArray = Array.isArray(rows) ? rows : (rows ? [rows] : [])
    
    rowsArray.forEach((setting: any) => {
      const key = setting.key || setting.KEY
      const value = setting.value || setting.VALUE
      if (key && value !== undefined) {
        settingsMap[key] = value
      }
    })

    return NextResponse.json(settingsMap)
  } catch (error) {
    console.error('Error fetching settings:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to fetch settings'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

async function upsertSetting(key: string, value: string) {
  // Use INSERT ... ON DUPLICATE KEY UPDATE since there's a UNIQUE key on `key` column
  // We need to handle the id - if it exists, use it, otherwise generate new one
  try {
    // Try to get existing id first
    const existing = await query<{ id: string }[]>(
      'SELECT id FROM site_settings WHERE `key` = :key LIMIT 1',
      { key }
    )
    
    let existingId = randomUUID()
    if (Array.isArray(existing) && existing.length > 0) {
      existingId = existing[0].id || existing[0].ID || randomUUID()
    } else if (existing && typeof existing === 'object' && 'id' in existing) {
      existingId = (existing as any).id || (existing as any).ID || randomUUID()
    }
    
    await query(
      `INSERT INTO site_settings (id, \`key\`, \`value\`, updatedAt)
       VALUES (:id, :key, :value, NOW(3))
       ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), updatedAt = NOW(3)`,
      { id: existingId, key, value }
    )
    
    console.log(`Upserted setting: ${key} = ${value.substring(0, 50)}...`)
  } catch (error) {
    console.error(`Error upserting setting ${key}:`, error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Support both single key-value update and bulk update
    if (body.key && body.value !== undefined) {
      // Single setting update
      await upsertSetting(body.key, body.value)
      return NextResponse.json({ message: 'Setting updated successfully', key: body.key })
    }
    
    // Bulk update (backward compatibility)
    const { mission, vision, history, attitude, coreValues, officeAddress } = body

    if (mission !== undefined) await upsertSetting('mission', mission)
    if (vision !== undefined) await upsertSetting('vision', vision)
    if (history !== undefined) await upsertSetting('history', history)
    if (attitude !== undefined) await upsertSetting('attitude', attitude)
    if (coreValues !== undefined) await upsertSetting('coreValues', coreValues)
    if (officeAddress !== undefined) await upsertSetting('officeAddress', officeAddress)

    return NextResponse.json({ message: 'Settings updated successfully' })
  } catch (error) {
    console.error('Error updating settings:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to update settings'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
    }

    await upsertSetting(key, value)
    return NextResponse.json({ message: 'Setting updated successfully', key })
  } catch (error) {
    console.error('Error updating setting:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to update setting'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
