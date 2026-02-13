import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documents = await query<any[]>(
      'SELECT id, title, description, "documentUrl", type, "createdAt", "updatedAt" FROM "LegalDocument" WHERE id = :id',
      { id: params.id }
    )

    if (documents.length === 0) {
      return NextResponse.json({ error: 'Legal document not found' }, { status: 404 })
    }

    return NextResponse.json(documents[0])
  } catch (error) {
    console.error('Error fetching legal document:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to fetch legal document'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, documentUrl, type } = body

    await query(
      'UPDATE "LegalDocument" SET title = :title, description = :description, "documentUrl" = :documentUrl, type = :type, "updatedAt" = NOW() WHERE id = :id',
      {
        id: params.id,
        title,
        description: description || null,
        documentUrl,
        type: type || 'Certificate',
      }
    )

    const updated = await query<any[]>(
      'SELECT id, title, description, "documentUrl", type, "createdAt", "updatedAt" FROM "LegalDocument" WHERE id = :id',
      { id: params.id }
    )

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('Error updating legal document:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to update legal document'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await query('DELETE FROM "LegalDocument" WHERE id = :id', { id: params.id })

    return NextResponse.json({ message: 'Legal document deleted successfully' })
  } catch (error) {
    console.error('Error deleting legal document:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to delete legal document'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
