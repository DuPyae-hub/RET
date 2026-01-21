import { query } from '../lib/db'
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

async function seedLegalDocuments() {
  try {
    console.log('🌱 Seeding legal documents...')

    // Check if documents already exist
    const existing = await query<any[]>(
      'SELECT COUNT(*) as count FROM LegalDocument'
    )

    if (existing[0]?.count > 0) {
      console.log('⚠️  Legal documents already exist. Skipping seed.')
      return
    }

    // Insert default documents
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
      console.log(`✅ Added: ${doc.title}`)
    }

    console.log('✨ Legal documents seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding legal documents:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  seedLegalDocuments()
    .then(() => {
      console.log('Done!')
      process.exit(0)
    })
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export default seedLegalDocuments
