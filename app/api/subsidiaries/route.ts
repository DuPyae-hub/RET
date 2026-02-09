import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { randomUUID } from 'crypto'

const defaultSubsidiaries = [
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
    name: 'NL Truth',
    path: '/nl-truth',
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

async function autoSeedSubsidiaries() {
  try {
    // Check if any subsidiaries exist
    const countResult = await query<{ count: number }[]>(
      'SELECT COUNT(*) as count FROM Subsidiary'
    )
    
    const countArray = Array.isArray(countResult) ? countResult : []
    const firstRow = countArray[0] as { count?: number; COUNT?: number } | undefined
    const count = firstRow?.count ?? firstRow?.COUNT ?? 0

    // If no subsidiaries exist, seed them
    if (count === 0) {
      console.log('No subsidiaries found. Auto-seeding default subsidiaries...')
      
      for (const sub of defaultSubsidiaries) {
        try {
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
        } catch (error: any) {
          // Ignore duplicate key errors (in case of race condition)
          if (error.code !== 'ER_DUP_ENTRY') {
            console.error(`Error seeding ${sub.name}:`, error)
          }
        }
      }
      
      console.log('Auto-seeding completed!')
    }
  } catch (error) {
    // If table doesn't exist, that's okay - it will be created by migration
    console.log('Auto-seed check failed (table may not exist yet):', error)
  }
}

export async function GET() {
  try {
    // Auto-seed if table is empty
    await autoSeedSubsidiaries()

    const rows = await query<{
      id: string
      name: string
      path: string
      description: string | null
      imageUrl: string | null
      displayOrder: number
    }[]>(
      'SELECT id, name, path, description, imageUrl, displayOrder FROM Subsidiary ORDER BY displayOrder ASC, name ASC'
    )

    const rowsArray = Array.isArray(rows) ? rows : []
    const subsidiaries = rowsArray.map((row: any) => ({
      id: row.id || row.ID,
      name: row.name || row.NAME,
      path: row.path || row.PATH,
      description: row.description || row.DESCRIPTION || '',
      imageUrl: row.imageUrl || row.imageURL || row.IMAGEURL || null,
      displayOrder: row.displayOrder || row.DISPLAYORDER || 0,
    }))

    // Always return an array, even if empty
    return NextResponse.json(subsidiaries || [])
  } catch (error) {
    console.error('Error fetching subsidiaries:', error)
    // Return empty array instead of error object to prevent frontend issues
    // The error is logged but we return an empty array so the UI doesn't break
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, path, description, imageUrl, displayOrder } = body

    if (!name || !path) {
      return NextResponse.json({ error: 'Name and path are required' }, { status: 400 })
    }

    const id = randomUUID()
    await query(
      `INSERT INTO Subsidiary (id, name, path, description, imageUrl, displayOrder, createdAt, updatedAt)
       VALUES (:id, :name, :path, :description, :imageUrl, :displayOrder, NOW(3), NOW(3))`,
      {
        id,
        name,
        path,
        description: description || null,
        imageUrl: imageUrl || null,
        displayOrder: displayOrder || 0,
      }
    )

    return NextResponse.json({ id, message: 'Subsidiary created successfully' }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating subsidiary:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Subsidiary with this name or path already exists' }, { status: 400 })
    }
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error ? error.message : 'Failed to create subsidiary'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
