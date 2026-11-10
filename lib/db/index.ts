import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/*
 * Server-only database client. postgres-js connects lazily (on first query),
 * so importing this during `next build` does not need a running database.
 * In dev, the client is cached on globalThis so hot reloads don't open new pools.
 */
const globalForDb = globalThis as unknown as { db2Sql?: ReturnType<typeof postgres> };

const sql =
  globalForDb.db2Sql ??
  postgres(process.env.DATABASE_URL ?? "postgres://localhost:5432/db2", { max: 10 });

if (process.env.NODE_ENV !== "production") globalForDb.db2Sql = sql;

export const db = drizzle(sql, { schema });
export { schema };
