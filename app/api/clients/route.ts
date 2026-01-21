import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function GET() {
  try {
    const clients = await query(
      'SELECT id, name, logoUrl, category, subsidiary, createdAt, updatedAt FROM Client ORDER BY createdAt DESC'
    )
    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to fetch clients'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, logoUrl, category } = body

    const id = randomUUID()
    await query(
      `INSERT INTO Client (id, name, logoUrl, category, subsidiary, createdAt, updatedAt)
       VALUES (:id, :name, :logoUrl, :category, NULL, NOW(3), NOW(3))`,
      {
        id,
        name,
        logoUrl,
        category,
      }
    )

    const created = await query(
      'SELECT id, name, logoUrl, category, subsidiary, createdAt, updatedAt FROM Client WHERE id = :id LIMIT 1',
      { id }
    )
    return NextResponse.json((created as any[])[0] ?? { id }, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to create client'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
