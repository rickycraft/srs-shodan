import { type Config } from 'drizzle-kit'

export default {
  schema: './src/server/db/schema.ts',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRESQLCONNSTR_MAIN!,
  },
} satisfies Config
