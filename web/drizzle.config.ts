import * as dotenv from 'dotenv'
import { type Config } from 'drizzle-kit'
dotenv.config()

export default {
  schema: './src/server/db/schema.ts',
  out: './src/server/schema',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRESQLCONNSTR_MAIN!,
  },
} satisfies Config
