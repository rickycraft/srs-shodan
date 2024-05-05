import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const queryClient = postgres(process.env.POSTGRESQLCONNSTR_MAIN!)
export const db = drizzle(queryClient)
