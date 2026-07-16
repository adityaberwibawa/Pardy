import { pgTable, text, uuid, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { artifactVersions } from './artifacts'

// Tasks table
export const tasks = pgTable('tasks', {
  artifactVersionId: uuid('artifact_version_id')
    .primaryKey()
    .references(() => artifactVersions.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  componentRef: text('component_ref').notNull(), // Architecture component ID
  endpointRefs: jsonb('endpoint_refs').$type<string[]>().notNull(), // API endpoint IDs
  schemaEntityRefs: jsonb('schema_entity_refs').$type<string[]>().notNull(), // DB entity IDs
  milestone: text('milestone').notNull(),
  status: text('status').notNull().default('pending'),
  estimatedComplexity: text('estimated_complexity'), // low, medium, high
})

// Prompts table
export const prompts = pgTable('prompts', {
  artifactVersionId: uuid('artifact_version_id')
    .primaryKey()
    .references(() => artifactVersions.id, { onDelete: 'cascade' }),
  taskArtifactVersionId: uuid('task_artifact_version_id')
    .notNull()
    .references(() => tasks.artifactVersionId, { onDelete: 'cascade' }),
  format: text('format').notNull(), // 'markdown' | 'json'
  content: text('content').notNull(),
})

// Relations
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  artifactVersion: one(artifactVersions, {
    fields: [tasks.artifactVersionId],
    references: [artifactVersions.id],
  }),
  prompts: many(prompts),
}))

export const promptsRelations = relations(prompts, ({ one }) => ({
  artifactVersion: one(artifactVersions, {
    fields: [prompts.artifactVersionId],
    references: [artifactVersions.id],
  }),
  task: one(tasks, {
    fields: [prompts.taskArtifactVersionId],
    references: [tasks.artifactVersionId],
  }),
}))
