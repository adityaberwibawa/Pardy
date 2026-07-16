"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Endpoint {
  id: string
  method: string
  path: string
  authRequired: boolean
  description: string
  responseSchema: object
  errorCases: Array<{ statusCode: number; description: string }>
  justifiedByStories: string[]
}

interface ApiDesignData {
  specVersion: string
  endpoints: Endpoint[]
}

export default function ApiDesignPage() {
  const params = useParams()
  const projectId = params.projectId as string
  
  const [apiDesign, setApiDesign] = useState<ApiDesignData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null)

  useEffect(() => {
    fetchApiDesign()
  }, [])

  const fetchApiDesign = async () => {
    try {
      const res = await fetch(`/api/v1/projects/${projectId}/api-design`)
      if (res.ok) {
        const data = await res.json()
        setApiDesign(data.apiDesign)
      }
    } catch (error) {
      console.error('Failed to fetch API design:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`/api/v1/projects/${projectId}/api-design`, {
        method: 'POST',
      })
      if (res.ok) {
        const data = await res.json()
        setApiDesign(data.apiDesign)
      }
    } catch (error) {
      console.error('Failed to generate API design:', error)
    } finally {
      setGenerating(false)
    }
  }

  const methodColors: Record<string, string> = {
    GET: 'ready',
    POST: 'generating',
    PUT: 'stale',
    PATCH: 'stale',
    DELETE: 'flagged'
  }

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <p>Loading API design...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Design</h1>
          <p className="text-muted-foreground mt-2">
            Contract-first API endpoints derived from your database schema and stories
          </p>
        </div>
        {apiDesign && (
          <Button variant="outline" onClick={handleGenerate} disabled={generating}>
            {generating ? 'Regenerating...' : 'Regenerate'}
          </Button>
        )}
      </div>

      {!apiDesign ? (
        <Card>
          <CardHeader>
            <CardTitle>No API Design Yet</CardTitle>
            <CardDescription>
              Generate API contracts from your database schema and user stories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? 'Generating...' : 'Generate API Design'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Endpoints</CardTitle>
              <CardDescription>
                Spec Version: <code className="text-sm bg-muted px-1 rounded">{apiDesign.specVersion}</code>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiDesign.endpoints.map((endpoint) => (
                  <Card
                    key={endpoint.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setSelectedEndpoint(selectedEndpoint?.id === endpoint.id ? null : endpoint)}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center gap-3">
                        <Badge variant={methodColors[endpoint.method] || 'draft'}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono text-primary">{endpoint.path}</code>
                        <span className="text-sm text-muted-foreground flex-1">{endpoint.description}</span>
                        <Badge variant={endpoint.authRequired ? 'ready' : 'draft'}>
                          {endpoint.authRequired ? 'Auth Required' : 'Public'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedEndpoint && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedEndpoint.method} {selectedEndpoint.path}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedEndpoint(null)}>Close</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">Response Schema</h4>
                    <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                      {JSON.stringify(selectedEndpoint.responseSchema, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Error Cases</h4>
                    <div className="space-y-2">
                      {selectedEndpoint.errorCases.map((err, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded bg-destructive/10">
                          <Badge variant="flagged">{err.statusCode}</Badge>
                          <span className="text-sm">{err.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Justified By Stories</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEndpoint.justifiedByStories.map((storyId) => (
                      <Badge key={storyId} variant="draft">Story {storyId}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button onClick={() => window.location.href = `/w/${params.workspaceId}/p/${projectId}/tasks`}>
                Continue to Task Breakdown
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}