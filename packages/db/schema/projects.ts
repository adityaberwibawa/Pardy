import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { workspaces } from './workspaces'

// Project status enum
export const projectStatusEnum = {
  INTERVIEW_PENDING: 'interview_pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const

// Projects table
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').notNull().default(projectStatusEnum.INTERVIEW_PENDING),
  interviewData: jsonb('interview_data').$type<{
    problem?: string
    targetUser?: string
    valueProposition?: string
    constraints?: {
      budget?: string
      timeline?: string
      teamSize?: string
    }
  }>(),
  createdBy: uuid('created_by').notNull(), // References auth.users
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Relations
export const projectsRelations = relations(projects, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
}))
