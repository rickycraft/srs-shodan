import { drizzle } from "drizzle-orm/mysql2"
import { createPool, type Pool } from "mysql2/promise"
import * as schema from "./schema"

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

const conn = globalForDb.conn ?? createPool({ uri: process.env.DATABASE_URL });
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema, mode: "default" });
