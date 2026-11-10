import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/*
 * Better Auth core tables (user, session, account, verification) plus the
 * DB² custom user fields. Property names must match Better Auth's field names;
 * column names are snake_case.
 */

export const USER_STATUSES = ["pending", "approved", "rejected"] as const;
export const USER_ROLES = ["user", "admin"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];
export type UserRole = (typeof USER_ROLES)[number];

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    // DB² fields
    institution: text("institution"),
    purpose: text("purpose"),
    status: text("status").$type<UserStatus>().notNull().default("pending"),
    role: text("role").$type<UserRole>().notNull().default("user"),
  },
  (t) => [
    check("user_status_check", sql`${t.status} in ('pending', 'approved', 'rejected')`),
    check("user_role_check", sql`${t.role} in ('user', 'admin')`),
  ],
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

/*
 * Saved BLAST jobs. NCBI deletes results after about a day, so the full
 * result JSON is stored here. One row per (user, RID): saving again updates it.
 */
export const savedBlastJobs = pgTable(
  "saved_blast_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    // 'ncbi' today; leaves room for a self-hosted BLAST engine later.
    engine: text("engine").notNull().default("ncbi"),
    rid: text("rid").notNull(),
    program: text("program").notNull(),
    database: text("database").notNull(),
    entrezQuery: text("entrez_query").notNull().default(""),
    evalue: text("evalue").notNull(),
    hitlistSize: integer("hitlist_size").notNull(),
    querySequence: text("query_sequence").notNull(),
    resultJson: jsonb("result_json").notNull(),
    numHits: integer("num_hits").notNull().default(0),
    bestHitTitle: text("best_hit_title"),
    bestEvalue: text("best_evalue"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("saved_blast_jobs_user_rid_uq").on(t.userId, t.rid),
    index("saved_blast_jobs_user_created_idx").on(t.userId, t.createdAt),
    check("saved_blast_jobs_label_len", sql`char_length(${t.label}) between 1 and 120`),
  ],
);

export type SavedBlastJob = typeof savedBlastJobs.$inferSelect;
