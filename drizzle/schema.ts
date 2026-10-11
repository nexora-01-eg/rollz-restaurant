import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { rewardKinds, rewardStatuses } from "../shared/rewards";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Coupon ledger for the public Rollz web campaign. The browser key is an
 * anonymous, local-device identifier—not a name, phone number, or login.
 * A staff member must mark a code as verified after confirming the WhatsApp
 * order; only five verified codes can create a burger-reward code.
 */
export const offerCodes = mysqlTable("offer_codes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  campaign: varchar("campaign", { length: 64 }).notNull(),
  browserKey: varchar("browserKey", { length: 72 }).notNull(),
  orderReference: varchar("orderReference", { length: 72 }).notNull(),
  kind: mysqlEnum("kind", rewardKinds).notNull(),
  status: mysqlEnum("status", rewardStatuses).notNull().default("issued"),
  monthKey: varchar("monthKey", { length: 7 }).notNull(),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
  verifiedAt: timestamp("verifiedAt"),
  redeemedAt: timestamp("redeemedAt"),
});

export type OfferCode = typeof offerCodes.$inferSelect;
