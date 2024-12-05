import { int, numeric, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  status: text("status", { enum: ["active", "completed", "cancelled", "planned"] }).notNull().default("planned"),
  createdBy: text("created_by").notNull().references(() => usersTable.id),
  availableHours: int("available_hours").notNull().default(0),
  spentHours: int("spent_hours").notNull().default(0),
});

export const sprintMembersTable = sqliteTable("sprint_members", {
  sprintId: int("sprint_id").notNull().references(() => sprintsTable.id),
  userId: text("user_id").notNull().references(() => usersTable.id),
});

export const applicationsTable = sqliteTable("applications", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organizationsTable.id),
  name: text("name").notNull(),
  description: text("description"),
});

export const applicationMembersTable = sqliteTable("application_members", {
  applicationId: text("application_id").notNull().references(() => applicationsTable.id),
  userId: text("user_id").notNull().references(() => usersTable.id),
  workDays: real("work_days").notNull().default(0),
});

export const sprintApplicationsTable = sqliteTable("sprint_applications", {
  sprintId: text("sprint_id").notNull().references(() => sprintsTable.id),
  applicationId: text("application_id").notNull().references(() => applicationsTable.id),
});
