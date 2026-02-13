import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { randomBytes } from 'crypto'

export async function GET() {
  try {
    const documents = await query<any[]>(
      'SELECT id, title, description, "documentUrl", type, "createdAt", "updatedAt" FROM "LegalDocument" ORDER BY "createdAt" DESC'
    )
    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching legal documents:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to fetch legal documents'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, documentUrl, type } = body

    if (!title || !documentUrl) {
      return NextResponse.json({ error: 'Title and document URL are required' }, { status: 400 })
    }

    const id = randomBytes(16).toString('hex')

    await query(
      'INSERT INTO "LegalDocument" (id, title, description, "documentUrl", type, "createdAt", "updatedAt") VALUES (:id, :title, :description, :documentUrl, :type, NOW(), NOW())',
      {
        id,
        title,
        description: description || null,
        documentUrl,
        type: type || 'Certificate',
      }
    )

    const newDoc = await query<any[]>(
      'SELECT id, title, description, "documentUrl", type, "createdAt", "updatedAt" FROM "LegalDocument" WHERE id = :id',
      { id }
    )

    return NextResponse.json(newDoc[0], { status: 201 })
  } catch (error) {
    console.error('Error creating legal document:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to create legal document'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
