import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { artifactVersions } from './artifacts'

// Comments table (for review flags and user comments)
export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  artifactVersionId: uuid('artifact_version_id')
    .notNull()
    .references(() => artifactVersions.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id').notNull(), // References auth.users
  body: text('body').notNull(),
  commentType: text('comment_type').notNull().default('user'), // 'user' | 'reviewer_flag' | 'system'
  severity: text('severity'), // For reviewer flags: 'info' | 'warning' | 'error'
  resolved: text('resolved').notNull().default('false'), // 'true' | 'false' | 'dismissed'
  resolvedBy: uuid('resolved_by'), // References auth.users
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// Relations
export const commentsRelations = relations(comments, ({ one }) => ({
  artifactVersion: one(artifactVersions, {
    fields: [comments.artifactVersionId],
    references: [artifactVersions.id],
  }),
}))
