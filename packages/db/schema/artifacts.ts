import { pgTable, text, timestamp, uuid, integer, boolean, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { projects } from './projects'

// Artifact type enum
export const artifactTypeEnum = pgEnum('artifact_type', [
  'interview',
  'validation',
  'market_analysis',
  'prd',
  'brd',
  'user_story',
  'architecture',
  'db_schema',
  'api_contract',
  'task',
  'prompt',
])

// Artifact versions table (polymorphic spine)
export const artifactVersions = pgTable('artifact_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  artifactType: artifactTypeEnum('artifact_type').notNull(),
  versionNumber: integer('version_number').notNull(),
  supersededBy: uuid('superseded_by'), // Self-referencing FK
  isStale: boolean('is_stale').notNull().default(false),
  staleReason: text('stale_reason'),
  createdBy: uuid('created_by').notNull(), // References auth.users
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// Artifact dependencies table (join table for dependency graph)
export const artifactDependencies = pgTable('artifact_dependencies', {
  id: uuid('id').defaultRandom().primaryKey(),
  parentArtifactVersionId: uuid('parent_artifact_version_id')
    .notNull()
    .references(() => artifactVersions.id, { onDelete: 'cascade' }),
  childArtifactVersionId: uuid('child_artifact_version_id')
    .notNull()
    .references(() => artifactVersions.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// Relations
export const artifactVersionsRelations = relations(artifactVersions, ({ one, many }) => ({
  project: one(projects, {
    fields: [artifactVersions.projectId],
    references: [projects.id],
  }),
  supersededByVersion: one(artifactVersions, {
    fields: [artifactVersions.supersededBy],
    references: [artifactVersions.id],
  }),
  parentDependencies: many(artifactDependencies, {
    relationName: 'parentArtifact',
  }),
  childDependencies: many(artifactDependencies, {
    relationName: 'childArtifact',
  }),
}))

export const artifactDependenciesRelations = relations(artifactDependencies, ({ one }) => ({
  parentArtifact: one(artifactVersions, {
    fields: [artifactDependencies.parentArtifactVersionId],
    references: [artifactVersions.id],
    relationName: 'parentArtifact',
  }),
  childArtifact: one(artifactVersions, {
    fields: [artifactDependencies.childArtifactVersionId],
    references: [artifactVersions.id],
    relationName: 'childArtifact',
  }),
}))
