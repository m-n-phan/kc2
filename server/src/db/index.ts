import { drizzle } from 'drizzle-orm/neon-http'
import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import * as schema from './schema'

// Database connection with proper typing and fallback for development
const databaseUrl = process.env.DATABASE_URL || 'postgresql://dev:dev@localhost:5432/kitchencoach_dev'

let sql: NeonQueryFunction<boolean, boolean>
let db: ReturnType<typeof drizzle>

try {
  sql = neon(databaseUrl)
  db = drizzle(sql, { schema })
} catch (error) {
  // eslint-disable-next-line no-console
  console.warn('Database connection failed, using mock for development:', error)
  
  // Create a mock database for development/testing when no real DB is available
  const mockSql: NeonQueryFunction<boolean, boolean> = (() => {
    throw new Error('Database not configured - using mock for development')
  }) as any
  
  db = drizzle(mockSql, { schema })
}

export { db }

// Export schema for use in other modules
export * from './schema' 