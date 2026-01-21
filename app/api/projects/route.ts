import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function GET() {
  try {
    const projects = await query(
      'SELECT id, title, description, category, imageUrl, subsidiary, createdAt, updatedAt FROM Project ORDER BY createdAt DESC'
    )
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to fetch projects'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category, imageUrl, subsidiary } = body

    const id = randomUUID()
    await query(
      `INSERT INTO Project (id, title, description, category, imageUrl, subsidiary, createdAt, updatedAt)
       VALUES (:id, :title, :description, :category, :imageUrl, :subsidiary, NOW(3), NOW(3))`,
      {
        id,
        title,
        description: description || null,
        category,
        imageUrl,
        subsidiary: subsidiary || null,
      }
    )

    const created = await query(
      'SELECT id, title, description, category, imageUrl, subsidiary, createdAt, updatedAt FROM Project WHERE id = :id LIMIT 1',
      { id }
    )
    return NextResponse.json((created as any[])[0] ?? { id }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to create project'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
