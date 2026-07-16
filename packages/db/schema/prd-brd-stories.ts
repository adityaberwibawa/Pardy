import { pgTable, text, uuid, jsonb, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { artifactVersions } from './artifacts'

// Story status enum
export const storyStatusEnum = pgEnum('story_status', ['draft', 'ready', 'in_progress', 'completed'])

// PRDs table
export const prds = pgTable('prds', {
  artifactVersionId: uuid('artifact_version_id')
    .primaryKey()
    .references(() => artifactVersions.id, { onDelete: 'cascade' }),
  sections: jsonb('sections').$type<{
    problem?: string
    goals?: string[]
    scope?: {
      inScope?: string[]
      outOfScope?: string[]
    }
    features?: Array<{
      id: string
      name: string
      description: string
      priority: 'P0' | 'P1' | 'P2'
    }>
    successCriteria?: string[]
  }>().notNull(),
})

// BRDs table
export const brds = pgTable('brds', {
  artifactVersionId: uuid('artifact_version_id')
    .primaryKey()
    .references(() => artifactVersions.id, { onDelete: 'cascade' }),
  prdVersionId: uuid('prd_version_id')
    .notNull()
    .references(() => artifactVersions.id),
  sections: jsonb('sections').$type<{
    businessJustification?: string
    stakeholderImpact?: string[]
    roiFraming?: string
    risks?: string[]
  }>().notNull(),
})

// User Stories table
export const userStories = pgTable('user_stories', {
  artifactVersionId: uuid('artifact_version_id')
    .primaryKey()
    .references(() => artifactVersions.id, { onDelete: 'cascade' }),
  personaRef: text('persona_ref').notNull(),
  asA: text('as_a').notNull(),
  iWant: text('i_want').notNull(),
  soThat: text('so_that').notNull(),
  status: storyStatusEnum('status').notNull().default('draft'),
})

// Acceptance Criteria table
export const acceptanceCriteria = pgTable('acceptance_criteria', {
  id: uuid('id').defaultRandom().primaryKey(),
  storyArtifactVersionId: uuid('story_artifact_version_id')
    .notNull()
    .references(() => userStories.artifactVersionId, { onDelete: 'cascade' }),
  givenText: text('given_text'),
  whenText: text('when_text'),
  thenText: text('then_text'),
})

// Relations
export const prdsRelations = relations(prds, ({ one }) => ({
  artifactVersion: one(artifactVersions, {
    fields: [prds.artifactVersionId],
    references: [artifactVersions.id],
  }),
}))

export const brdsRelations = relations(brds, ({ one }) => ({
  artifactVersion: one(artifactVersions, {
    fields: [brds.artifactVersionId],
    references: [artifactVersions.id],
  }),
  prdVersion: one(artifactVersions, {
    fields: [brds.prdVersionId],
    references: [artifactVersions.id],
  }),
}))

export const userStoriesRelations = relations(userStories, ({ one, many }) => ({
  artifactVersion: one(artifactVersions, {
    fields: [userStories.artifactVersionId],
    references: [artifactVersions.id],
  }),
  acceptanceCriteria: many(acceptanceCriteria),
}))

export const acceptanceCriteriaRelations = relations(acceptanceCriteria, ({ one }) => ({
  story: one(userStories, {
    fields: [acceptanceCriteria.storyArtifactVersionId],
    references: [userStories.artifactVersionId],
  }),
}))
