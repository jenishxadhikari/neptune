import { pgEnum, pgTable, text, uuid, timestamp, primaryKey, bigint, integer, index } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ['user', 'admin'])

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().unique().notNull(),
  password: text().notNull(),
  role: userRole().default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const songs = pgTable("songs", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  album: text("album").notNull(),
  genre: text("genre").notNull(),
  year: text("year").notNull(),
  duration: text("duration").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
})

export const savedSongs = pgTable("saved_songs", {
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  songId: uuid("song_id")
    .notNull()
    .references(() => songs.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow()
}, (table) => [
  primaryKey({ columns: [table.userId, table.songId] })
]);

export const hashes = pgTable("hashes", {
  hash: bigint({ mode: 'bigint' }).notNull(),
  time: integer().notNull(),
  songId: uuid("song_id")
    .notNull()
    .references(() => songs.id, { onDelete: "cascade" }),
}, (table) => [
  index("hash_idx").on(table.songId)
])