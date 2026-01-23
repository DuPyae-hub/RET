import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { randomUUID } from 'crypto'

const subsidiaries = [
  {
    id: 'sub-001',
    name: 'RET Advertising',
    path: '/ret-advertising',
    description: 'Branding, production, and CSR services',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&q=80',
    displayOrder: 1,
  },
  {
    id: 'sub-002',
    name: 'Million Zone',
    path: '/million-zone',
    description: 'Construction, infrastructure, and rural electrification',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=80',
    displayOrder: 2,
  },
  {
    id: 'sub-003',
    name: 'Inner True',
    path: '/inner-true',
    description: 'Distribution and logistics (Telecom, Online Money, FMCG)',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop&q=80',
    displayOrder: 3,
  },
  {
    id: 'sub-004',
    name: 'Agricultural Friends',
    path: '/agricultural-friends',
    description: 'General agricultural services',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop&q=80',
    displayOrder: 4,
  },
]

export async function POST(request: NextRequest) {
  try {
    const results = []

    for (const sub of subsidiaries) {
      try {
        // Check if subsidiary already exists
        const existing = await query(
          'SELECT id FROM Subsidiary WHERE id = :id OR name = :name OR path = :path LIMIT 1',
          { id: sub.id, name: sub.name, path: sub.path }
        )

        const existingArray = Array.isArray(existing) ? existing : []

        if (existingArray.length > 0) {
          // Update existing
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
              id: sub.id,
              name: sub.name,
              path: sub.path,
              description: sub.description,
              imageUrl: sub.imageUrl,
              displayOrder: sub.displayOrder,
            }
          )
          results.push({ name: sub.name, action: 'updated' })
        } else {
          // Insert new
          await query(
            `INSERT INTO Subsidiary (id, name, path, description, imageUrl, displayOrder, createdAt, updatedAt)
             VALUES (:id, :name, :path, :description, :imageUrl, :displayOrder, NOW(3), NOW(3))`,
            {
              id: sub.id,
              name: sub.name,
              path: sub.path,
              description: sub.description,
              imageUrl: sub.imageUrl,
              displayOrder: sub.displayOrder,
            }
          )
          results.push({ name: sub.name, action: 'created' })
        }
      } catch (error: any) {
        console.error(`Error with ${sub.name}:`, error)
        results.push({ name: sub.name, action: 'error', error: error.message })
      }
    }

    return NextResponse.json({
      message: 'Subsidiaries seeded successfully',
      results,
    })
  } catch (error) {
    console.error('Error seeding subsidiaries:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to seed subsidiaries'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
