import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const q = (url.searchParams.get('q') || '').trim()

    if (!q) return NextResponse.json({ projects: [], clients: [] })

    const like = `%${q}%`

    const projects = await query(
      `SELECT id, title, description, subsidiary FROM Project WHERE title LIKE :like OR description LIKE :like ORDER BY createdAt DESC LIMIT 10`,
      { like }
    )

    const clients = await query(
      `SELECT id, name, category FROM Client WHERE name LIKE :like ORDER BY createdAt DESC LIMIT 10`,
      { like }
    )

    return NextResponse.json({ projects, clients })
  } catch (err) {
    console.error('search error', err)
    return NextResponse.json({ projects: [], clients: [] }, { status: 500 })
  }
}
