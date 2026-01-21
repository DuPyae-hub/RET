import mysql, { Pool } from 'mysql2/promise'

function parseDatabaseUrl(databaseUrl: string) {
  // Supports: mysql://user:pass@host:port/dbname
  const url = new URL(databaseUrl)
  const user = decodeURIComponent(url.username)
  const password = decodeURIComponent(url.password)
  const host = url.hostname
  const port = url.port ? Number(url.port) : 3306
  const database = url.pathname.replace(/^\//, '')
  return { host, port, user, password, database }
}

let pool: Pool | null = null

export function getPool() {
  if (pool) return pool

  const databaseUrl = process.env.DATABASE_URL

  const config = databaseUrl
    ? parseDatabaseUrl(databaseUrl)
    : {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'RET_Database',
      }

  pool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    namedPlaceholders: true,
  })

  return pool
}

export async function query<T = any>(sql: string, params?: Record<string, any> | any[]) {
  const [rows] = await getPool().query(sql, params as any)
  return rows as T
}

