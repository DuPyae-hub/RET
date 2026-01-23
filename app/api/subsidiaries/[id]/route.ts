import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rows = await query<{
      id: string
      name: string
      path: string
      description: string | null
      imageUrl: string | null
      displayOrder: number
    }[]>(
      'SELECT id, name, path, description, imageUrl, displayOrder FROM Subsidiary WHERE id = :id LIMIT 1',
      { id: params.id }
    )

    const rowsArray = Array.isArray(rows) ? rows : []
    if (rowsArray.length === 0) {
      return NextResponse.json({ error: 'Subsidiary not found' }, { status: 404 })
    }

    const row = rowsArray[0]
    const subsidiary = {
      id: row.id || row.ID,
      name: row.name || row.NAME,
      path: row.path || row.PATH,
      description: row.description || row.DESCRIPTION || '',
      imageUrl: row.imageUrl || row.imageURL || row.IMAGEURL || null,
      displayOrder: row.displayOrder || row.DISPLAYORDER || 0,
    }

    return NextResponse.json(subsidiary)
  } catch (error) {
    console.error('Error fetching subsidiary:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to fetch subsidiary'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, path, description, imageUrl, displayOrder } = body

    if (!name || !path) {
      return NextResponse.json({ error: 'Name and path are required' }, { status: 400 })
    }

    await query(
      `UPDATE Subsidiary
       SET name = :name,
           path = :path,
           description = :description,
           imageUrl = :imageUrl,
           displayOrder = :displayOrder,
           updatedAt = NOW(3)
       WHERE id = :id`,
      {
        id: params.id,
        name,
        path,
        description: description || null,
        imageUrl: imageUrl || null,
        displayOrder: displayOrder || 0,
      }
    )

    return NextResponse.json({ message: 'Subsidiary updated successfully' })
  } catch (error: any) {
    console.error('Error updating subsidiary:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Subsidiary with this name or path already exists' }, { status: 400 })
    }
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to update subsidiary'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await query('DELETE FROM Subsidiary WHERE id = :id', { id: params.id })

    return NextResponse.json({ message: 'Subsidiary deleted successfully' })
  } catch (error) {
    console.error('Error deleting subsidiary:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to delete subsidiary'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
