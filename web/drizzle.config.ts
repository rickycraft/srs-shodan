import * as dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit'
dotenv.config()

export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './src/server/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRESQLCONNSTR_MAIN!,
  },
})
