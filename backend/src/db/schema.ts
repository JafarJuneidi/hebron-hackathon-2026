import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  imageUrl: text("image_url"),
  isAdmin: integer("is_admin").notNull().default(0),
  createdAt: text("created_at").notNull(),
})

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // ProjectCategory
  status: text("status").notNull().default("pending"), // ProjectStatus
  fundingTarget: integer("funding_target"), // cents
  fundingCurrent: integer("funding_current").notNull().default(0), // cents
  volunteersRequired: integer("volunteers_required"),
  volunteersCurrent: integer("volunteers_current").notNull().default(0),
  submittedBy: text("submitted_by")
    .notNull()
    .references(() => users.id),
  reviewedBy: text("reviewed_by").references(() => users.id),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
})

export const likes = sqliteTable("likes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at").notNull(),
})

export const contributions = sqliteTable("contributions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  amount: integer("amount").notNull(), // cents
  createdAt: text("created_at").notNull(),
})

export const volunteerSignups = sqliteTable("volunteer_signups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at").notNull(),
})
