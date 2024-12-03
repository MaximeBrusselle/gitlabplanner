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
  imageUrl: text("image_url"),
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

export const sprintsTable = sqliteTable("sprints", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  status: text("status", { enum: ["active", "completed", "cancelled", "planned"] }).notNull().default("planned"),
  createdBy: text("created_by").notNull().references(() => usersTable.id),
});

export const sprintMembersTable = sqliteTable("sprint_members", {
  sprintId: text("sprint_id").notNull().references(() => sprintsTable.id),
  userId: text("user_id").notNull().references(() => usersTable.id),
});
