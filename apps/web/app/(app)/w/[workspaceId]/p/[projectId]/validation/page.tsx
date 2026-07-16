"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ValidationData {
  technicalFeasibility: { score: number; reasoning: string }
  marketSignal: { score: number; reasoning: string; directional: boolean }
  scopeRealism: { score: number; reasoning: string }
  flags: Array<{ type: string; message: string }>
}

export default function ValidationPage() {
  const params = useParams()
  const projectId = params.projectId as string
  
  const [validation, setValidation] = useState<ValidationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchValidation()
  }, [])

  const fetchValidation = async () => {
    try {
      const res = await fetch(`/api/v1/projects/${projectId}/validation`)
      if (res.ok) {
        const data = await res.json()
        setValidation(data.validation)
      }
    } catch (error) {
      console.error('Failed to fetch validation:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`/api/v1/projects/${projectId}/validation`, {
        method: 'POST',
      })
      if (res.ok) {
        const data = await res.json()
        setValidation(data.validation)
      }
    } catch (error) {
      console.error('Failed to generate validation:', error)
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <p>Loading validation...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Idea Validation</h1>
        <p className="text-muted-foreground mt-2">
          Feasibility assessment for your project idea
        </p>
      </div>

      {!validation ? (
        <Card>
          <CardHeader>
            <CardTitle>No Validation Yet</CardTitle>
            <CardDescription>
              Generate a feasibility assessment for your project idea
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? 'Generating...' : 'Generate Validation'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <ScoreCard
              title="Technical Feasibility"
              score={validation.technicalFeasibility.score}
              reasoning={validation.technicalFeasibility.reasoning}
            />
            <ScoreCard
              title="Market Signal"
              score={validation.marketSignal.score}
              reasoning={validation.marketSignal.reasoning}
              directional={validation.marketSignal.directional}
            />
            <ScoreCard
              title="Scope Realism"
              score={validation.scopeRealism.score}
              reasoning={validation.scopeRealism.reasoning}
            />
          </div>

          {validation.flags && validation.flags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Flags & Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {validation.flags.map((flag, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
                    <Badge variant={flag.type === 'warning' ? 'stale' : 'draft'}>
                      {flag.type}
                    </Badge>
                    <span className="text-sm">{flag.message}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button onClick={() => window.location.href = `/w/${params.workspaceId}/p/${projectId}/prd`}>
                Continue to PRD
              </Button>
              <Button variant="outline" onClick={handleGenerate} disabled={generating}>
                Regenerate
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function ScoreCard({ title, score, reasoning, directional }: { 
  title: string; 
  score: number; 
  reasoning: string; 
  directional?: boolean 
}) {
  const getScoreColor = (score: number) => {
    if (score >= 7) return 'ready'
    if (score >= 5) return 'generating'
    return 'flagged'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          {directional && <Badge variant="draft">Directional</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold" style={{ color: `hsl(var(--status-${getScoreColor(score)}))` }}>
            {score}/10
          </div>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all"
              style={{ 
                width: `${score * 10}%`,
                backgroundColor: `hsl(var(--status-${getScoreColor(score)}))`
              }} 
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{reasoning}</p>
      </CardContent>
    </Card>
  )
}