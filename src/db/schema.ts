import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  imageUrl: text("image_url"),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  lastSignIn: text("last_sign_in").notNull().default(new Date().toISOString()),
});

export const organizationsTable = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const organizationMembersTable = sqliteTable("organization_members", {
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizationsTable.id),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});
