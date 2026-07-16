"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Entity {
  id: string
  name: string
  fields: Array<{
    name: string
    type: string
    nullable: boolean
    primaryKey?: boolean
    foreignKey?: { table: string; field: string }
  }>
  justifiedByStories: string[]
}

interface Relationship {
  id: string
  type: string
  fromEntity: string
  toEntity: string
  fromField: string
  toField: string
}

interface DbSchemaData {
  entities: Entity[]
  relationships: Relationship[]
  rawDdl: string
}

export default function DatabasePage() {
  const params = useParams()
  const projectId = params.projectId as string
  
  const [dbSchema, setDbSchema] = useState<DbSchemaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [viewMode, setViewMode] = useState<'erd' | 'schema'>('erd')

  useEffect(() => {
    fetchDbSchema()
  }, [])

  const fetchDbSchema = async () => {
    try {
      const res = await fetch(`/api/v1/projects/${projectId}/database`)
      if (res.ok) {
        const data = await res.json()
        setDbSchema(data.dbSchema)
      }
    } catch (error) {
      console.error('Failed to fetch database schema:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`/api/v1/projects/${projectId}/database`, {
        method: 'POST',
      })
      if (res.ok) {
        const data = await res.json()
        setDbSchema(data.dbSchema)
      }
    } catch (error) {
      console.error('Failed to generate database schema:', error)
    } finally {
      setGenerating(false)
    }
  }

  const mermaidERD = dbSchema ? `
erDiagram
${dbSchema.entities.map(e => `    ${e.name} {${e.fields.map(f => 
  `${f.type} ${f.name} ${f.primaryKey ? 'PK' : ''} ${!f.nullable ? 'NOT NULL' : ''} ${f.foreignKey ? `FK to ${f.foreignKey.table}.${f.foreignKey.field}` : ''}`
).join('\n    ')}}`).join('\n\n')}
${dbSchema.relationships.map(r => 
  `    ${r.fromEntity} ||--o{ ${r.toEntity} : "${r.type}"`
).join('\n')}
  `.trim() : ''

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <p>Loading database schema...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Database Design</h1>
          <p className="text-muted-foreground mt-2">
            Normalized schema derived from your user stories
          </p>
        </div>
        {dbSchema && (
          <Button variant="outline" onClick={handleGenerate} disabled={generating}>
            {generating ? 'Regenerating...' : 'Regenerate'}
          </Button>
        )}
      </div>

      {!dbSchema ? (
        <Card>
          <CardHeader>
            <CardTitle>No Database Schema Yet</CardTitle>
            <CardDescription>
              Generate a normalized database schema from your architecture and stories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? 'Generating...' : 'Generate Database Schema'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList>
              <TabsTrigger value="erd">ER Diagram</TabsTrigger>
              <TabsTrigger value="schema">Schema Definition</TabsTrigger>
            </TabsList>
            
            <TabsContent value="erd">
              <Card>
                <CardHeader>
                  <CardTitle>Entity Relationship Diagram</CardTitle>
                  <CardDescription>
                    Visual representation of entities and relationships
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono">
                    {mermaidERD}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schema">
              <Card>
                <CardHeader>
                  <CardTitle>Schema Definition (DDL)</CardTitle>
                  <CardDescription>
                    Raw SQL DDL generated from the entity model
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono">
                    {dbSchema.rawDdl}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Entities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dbSchema.entities.map((entity) => (
                  <div key={entity.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{entity.name}</h4>
                      <Badge variant="draft">
                        {entity.justifiedByStories.length} story refs
                      </Badge>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-muted-foreground">
                          <th className="pb-2">Field</th>
                          <th className="pb-2">Type</th>
                          <th className="pb-2">Constraints</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entity.fields.map((field) => (
                          <tr key={field.name} className="border-b last:border-0">
                            <td className="py-2 font-mono">{field.name}</td>
                            <td className="py-2">{field.type}</td>
                            <td className="py-2">
                              <span className="inline-flex gap-1">
                                {field.primaryKey && <Badge variant="ready" className="text-xs">PK</Badge>}
                                {!field.nullable && <Badge variant="draft" className="text-xs">NOT NULL</Badge>}
                                {field.foreignKey && (
                                  <Badge variant="generating" className="text-xs">
                                    FK → {field.foreignKey.table}.{field.foreignKey.field}
                                  </Badge>
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Relationships</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dbSchema.relationships.map((rel) => (
                  <div key={rel.id} className="flex items-center gap-4 p-3 rounded-md bg-muted/50">
                    <Badge variant="generating">{rel.type}</Badge>
                    <span className="font-mono text-sm">{rel.fromEntity}.{rel.fromField}</span>
                    <span>→</span>
                    <span className="font-mono text-sm">{rel.toEntity}.{rel.toField}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button onClick={() => window.location.href = `/w/${params.workspaceId}/p/${projectId}/api-design`}>
                Continue to API Design
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}