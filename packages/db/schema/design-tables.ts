import { pgTable, text, uuid, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { artifactVersions } from './artifacts'

// Database Schemas table
export const dbSchemas = pgTable('db_schemas', {
  artifactVersionId: uuid('artifact_version_id')
    .primaryKey()
    .references(() => artifactVersions.id, { onDelete: 'cascade' }),
  entities: jsonb('entities').$type<
    Array<{
      id: string
      name: string
      fields: Array<{
        name: string
        type: string
        nullable: boolean
        primaryKey?: boolean
        foreignKey?: {
          table: string
          field: string
        }
      }>
      justifiedByStories: string[] // story artifact version IDs
    }>
  >().notNull(),
  relationships: jsonb('relationships').$type<
    Array<{
      id: string
      type: 'one-to-one' | 'one-to-many' | 'many-to-many'
      fromEntity: string
      toEntity: string
      fromField: string
      toField: string
    }>
  >().notNull(),
  rawDdl: text('raw_ddl'), // Generated from entities/relationships JSONB
})

// API Contracts table
export const apiContracts = pgTable('api_contracts', {
  artifactVersionId: uuid('artifact_version_id')
    .primaryKey()
    .references(() => artifactVersions.id, { onDelete: 'cascade' }),
  specVersion: text('spec_version').notNull().default('v1'),
  endpoints: jsonb('endpoints').$type<
    Array<{
      id: string
      method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
      path: string
      description: string
      authRequired: boolean
      requestSchema?: object
      responseSchema: object
      errorCases: Array<{
        statusCode: number
        description: string
      }>
      justifiedByStories: string[] // story artifact version IDs
      schemaEntityRefs: string[] // db_schema entity IDs
    }>
  >().notNull(),
})

// Relations
export const dbSchemasRelations = relations(dbSchemas, ({ one }) => ({
  artifactVersion: one(artifactVersions, {
    fields: [dbSchemas.artifactVersionId],
    references: [artifactVersions.id],
  }),
}))

export const apiContractsRelations = relations(apiContracts, ({ one }) => ({
  artifactVersion: one(artifactVersions, {
    fields: [apiContracts.artifactVersionId],
    references: [artifactVersions.id],
  }),
}))
