import { Pool } from 'pg'

/**
 * Convert MySQL-style named placeholders (:name) to PostgreSQL positional ($1, $2)
 * and return [sql, values[]] for pool.query(sql, values).
 */
function toPostgresParams(sql: string, params?: Record<string, any> | any[]): [string, any[]] {
  if (params == null || (Array.isArray(params) && params.length === 0)) {
    return [sql, []]
  }
  if (Array.isArray(params)) {
    const values = params
    let i = 0
    const newSql = sql.replace(/\?/g, () => `$${++i}`)
    return [newSql, values]
  }
  const record = params as Record<string, any>
  const keysInOrder: string[] = []
  const newSql = sql.replace(/:(\w+)/g, (_, key) => {
    const idx = keysInOrder.indexOf(key)
    if (idx === -1) keysInOrder.push(key)
    return `$${keysInOrder.indexOf(key) + 1}`
  })
  const values = keysInOrder.map((k) => record[k])
  return [newSql, values]
}

let pool: Pool | null = null

export function getPool(): Pool {
  if (pool) return pool

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for Neon/PostgreSQL')
  }

  pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })

  return pool
}

export async function query<T = any>(sql: string, params?: Record<string, any> | any[]): Promise<T> {
  const [pgSql, values] = toPostgresParams(sql, params)
  const client = getPool()
  const result = await client.query(pgSql, values)
  return result.rows as T
}
