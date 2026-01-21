import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rows = await query(
      'SELECT id, name, logoUrl, category, subsidiary, createdAt, updatedAt FROM Client WHERE id = :id LIMIT 1',
      { id: params.id }
    )
    const client = (rows as any[])[0]

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error fetching client:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to fetch client'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, logoUrl, category } = body

    await query(
      `UPDATE Client
       SET name = :name,
           logoUrl = :logoUrl,
           category = :category,
           subsidiary = NULL,
           updatedAt = NOW(3)
       WHERE id = :id`,
      {
        id: params.id,
        name,
        logoUrl,
        category,
      }
    )

    const rows = await query(
      'SELECT id, name, logoUrl, category, subsidiary, createdAt, updatedAt FROM Client WHERE id = :id LIMIT 1',
      { id: params.id }
    )
    const updated = (rows as any[])[0]
    return NextResponse.json(updated ?? { id: params.id })
  } catch (error) {
    console.error('Error updating client:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to update client'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await query('DELETE FROM Client WHERE id = :id', { id: params.id })

    return NextResponse.json({ message: 'Client deleted successfully' })
  } catch (error) {
    console.error('Error deleting client:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to delete client'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
