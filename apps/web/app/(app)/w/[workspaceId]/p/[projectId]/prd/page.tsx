"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PrdData {
  sections: {
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
  }
}

export default function PrdPage() {
  const params = useParams()
  const projectId = params.projectId as string
  
  const [prd, setPrd] = useState<PrdData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchPrd()
  }, [])

  const fetchPrd = async () => {
    try {
      const res = await fetch(`/api/v1/projects/${projectId}/prd`)
      if (res.ok) {
        const data = await res.json()
        setPrd(data.prd)
      }
    } catch (error) {
      console.error('Failed to fetch PRD:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`/api/v1/projects/${projectId}/prd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'full' }),
      })
      if (res.ok) {
        const data = await res.json()
        setPrd(data.prd)
      }
    } catch (error) {
      console.error('Failed to generate PRD:', error)
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <p>Loading PRD...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Requirements Document</h1>
          <p className="text-muted-foreground mt-2">
            Complete product specification derived from your idea
          </p>
        </div>
        {prd && (
          <Button variant="outline" onClick={handleGenerate} disabled={generating}>
            {generating ? 'Regenerating...' : 'Regenerate'}
          </Button>
        )}
      </div>

      {!prd ? (
        <Card>
          <CardHeader>
            <CardTitle>No PRD Yet</CardTitle>
            <CardDescription>
              Generate a Product Requirements Document from your interview and validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? 'Generating...' : 'Generate PRD'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Problem Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{prd.sections.problem}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {prd.sections.goals?.map((goal, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-sm">{goal}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prd.sections.features?.map((feature) => (
                    <div key={feature.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{feature.name}</h4>
                        <Badge variant={
                          feature.priority === 'P0' ? 'ready' : 
                          feature.priority === 'P1' ? 'generating' : 'draft'
                        }>
                          {feature.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {prd.sections.successCriteria?.map((criterion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span className="text-sm">{criterion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scope</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-green-600">In Scope</h4>
                  <ul className="space-y-1">
                    {prd.sections.scope?.inScope?.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-red-600">Out of Scope</h4>
                  <ul className="space-y-1">
                    {prd.sections.scope?.outOfScope?.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground">• {item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => window.location.href = `/w/${params.workspaceId}/p/${projectId}/brd`}
                >
                  Continue to BRD
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {/* Export logic */}}
                >
                  Export PRD
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}