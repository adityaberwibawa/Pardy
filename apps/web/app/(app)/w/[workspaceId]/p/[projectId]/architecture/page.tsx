"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Component {
  id: string
  name: string
  type: 'core' | 'supporting'
  justifiedBy: string[]
}

interface ArchitectureData {
  components: Component[]
  diagram: string
}

export default function ArchitecturePage() {
  const params = useParams()
  const projectId = params.projectId as string
  
  const [architecture, setArchitecture] = useState<ArchitectureData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchArchitecture()
  }, [])

  const fetchArchitecture = async () => {
    try {
      const res = await fetch(`/api/v1/projects/${projectId}/architecture`)
      if (res.ok) {
        const data = await res.json()
        setArchitecture(data.architecture)
      }
    } catch (error) {
      console.error('Failed to fetch architecture:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`/api/v1/projects/${projectId}/architecture`, {
        method: 'POST',
      })
      if (res.ok) {
        const data = await res.json()
        setArchitecture(data.architecture)
      }
    } catch (error) {
      console.error('Failed to generate architecture:', error)
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <p>Loading architecture...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Architecture</h1>
          <p className="text-muted-foreground mt-2">
            Component diagram derived from your user stories
          </p>
        </div>
        {architecture && (
          <Button variant="outline" onClick={handleGenerate} disabled={generating}>
            {generating ? 'Regenerating...' : 'Regenerate'}
          </Button>
        )}
      </div>

      {!architecture ? (
        <Card>
          <CardHeader>
            <CardTitle>No Architecture Yet</CardTitle>
            <CardDescription>
              Generate a system architecture from your ready user stories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? 'Generating...' : 'Generate Architecture'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Component Diagram</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                {architecture.diagram}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Components</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {architecture.components.map((comp) => (
                  <div key={comp.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Badge variant={comp.type === 'core' ? 'ready' : 'draft'}>
                        {comp.type.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{comp.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Justified by: {comp.justifiedBy.length ? comp.justifiedBy.join(', ') : 'Supporting infrastructure'}
                    </div>
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
              <Button onClick={() => window.location.href = `/w/${params.workspaceId}/p/${projectId}/database`}>
                Continue to Database Design
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}