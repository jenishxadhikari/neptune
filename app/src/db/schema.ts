import { pgEnum, pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ['user', 'admin'])

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().unique().notNull(),
  password: text().notNull(),
  role: userRole().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
