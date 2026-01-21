import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rows = await query(
      'SELECT id, title, description, category, imageUrl, subsidiary, createdAt, updatedAt FROM Project WHERE id = :id LIMIT 1',
      { id: params.id }
    )
    const project = (rows as any[])[0]

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to fetch project'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, category, imageUrl, subsidiary } = body

    await query(
      `UPDATE Project
       SET title = :title,
           description = :description,
           category = :category,
           imageUrl = :imageUrl,
           subsidiary = :subsidiary,
           updatedAt = NOW(3)
       WHERE id = :id`,
      {
        id: params.id,
        title,
        description: description || null,
        category,
        imageUrl,
        subsidiary: subsidiary || null,
      }
    )

    const rows = await query(
      'SELECT id, title, description, category, imageUrl, subsidiary, createdAt, updatedAt FROM Project WHERE id = :id LIMIT 1',
      { id: params.id }
    )
    const updated = (rows as any[])[0]
    return NextResponse.json(updated ?? { id: params.id })
  } catch (error) {
    console.error('Error updating project:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to update project'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await query('DELETE FROM Project WHERE id = :id', { id: params.id })

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to delete project'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
