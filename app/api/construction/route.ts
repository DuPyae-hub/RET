import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status')
    const projects = status
      ? await query(
          'SELECT id, title, description, "imageUrl", status, location, "createdAt", "updatedAt" FROM "ConstructionProject" WHERE status = :status ORDER BY "createdAt" DESC',
          { status }
        )
      : await query(
          'SELECT id, title, description, "imageUrl", status, location, "createdAt", "updatedAt" FROM "ConstructionProject" ORDER BY "createdAt" DESC'
        )
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching construction projects:', error)
    return NextResponse.json({ error: 'Failed to fetch construction projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, imageUrl, status, location } = body

    const id = randomUUID()
    await query(
      `INSERT INTO "ConstructionProject" (id, title, description, "imageUrl", status, location, "createdAt", "updatedAt")
       VALUES (:id, :title, :description, :imageUrl, :status, :location, NOW(), NOW())`,
      {
        id,
        title,
        description: description || null,
        imageUrl,
        status: status || 'Ongoing',
        location: location || null,
      }
    )

    const created = await query(
      'SELECT id, title, description, "imageUrl", status, location, "createdAt", "updatedAt" FROM "ConstructionProject" WHERE id = :id LIMIT 1',
      { id }
    )
    return NextResponse.json((created as any[])[0] ?? { id }, { status: 201 })
  } catch (error) {
    console.error('Error creating construction project:', error)
    return NextResponse.json({ error: 'Failed to create construction project' }, { status: 500 })
  }
}
