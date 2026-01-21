import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { randomBytes } from 'crypto'

const defaultLegalDocuments = [
  {
    title: 'Certificate of Incorporation',
    description: 'Royal Ever Truth Business Group Co., Ltd registration (No. 102364597)',
    documentUrl: '/legal/certificate-of-incorporation.jpg',
    type: 'Certificate',
  },
  {
    title: 'Supplier / Contractor Registration',
    description: 'Royal Ever Truth Co., Ltd supplier / contractor registration (M180821004A)',
    documentUrl: '/legal/supplier-contractor-registration.jpg',
    type: 'Registration',
  },
  {
    title: 'Business Operating License (Advertising)',
    description: 'Royal Ever Truth Business Group Co., Ltd – Advertising license (Registration No. 102364597CT2025-2026-02568)',
    documentUrl: '/legal/operating-license.jpg',
    type: 'License',
  },
]

export async function POST() {
  try {
    // Check if documents already exist
    const existing = await query<any[]>(
      'SELECT COUNT(*) as count FROM LegalDocument'
    )

    if (existing[0]?.count > 0) {
      return NextResponse.json(
        { message: 'Legal documents already exist. Skipping seed.', count: existing[0].count },
        { status: 200 }
      )
    }

    // Insert default documents
    const inserted = []
    for (const doc of defaultLegalDocuments) {
      const id = randomBytes(16).toString('hex')
      await query(
        'INSERT INTO LegalDocument (id, title, description, documentUrl, type, createdAt, updatedAt) VALUES (:id, :title, :description, :documentUrl, :type, NOW(), NOW())',
        {
          id,
          title: doc.title,
          description: doc.description,
          documentUrl: doc.documentUrl,
          type: doc.type,
        }
      )
      inserted.push(doc.title)
    }

    return NextResponse.json({
      message: 'Legal documents seeded successfully!',
      inserted: inserted.length,
      documents: inserted,
    })
  } catch (error) {
    console.error('Error seeding legal documents:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error
        ? error.message
        : 'Failed to seed legal documents'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
