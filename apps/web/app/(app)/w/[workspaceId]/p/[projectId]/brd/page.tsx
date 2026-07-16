"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BrdData {
  sections: {
    businessJustification?: string
    stakeholderImpact?: string[]
    roiFraming?: string
    risks?: string[]
  }
}

export default function BrdPage() {
  const params = useParams()
  const projectId = params.projectId as string
  
  const [brd, setBrd] = useState<BrdData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchBrd()
  }, [])

  const fetchBrd = async () => {
    try {
      const res = await fetch(`/api/v1/projects/${projectId}/brd`)
      if (res.ok) {
        const data = await res.json()
        setBrd(data.brd)
      }
    } catch (error) {
      console.error('Failed to fetch BRD:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`/api/v1/projects/${projectId}/brd`, {
        method: 'POST',
      })
      if (res.ok) {
        const data = await res.json()
        setBrd(data.brd)
      }
    } catch (error) {
      console.error('Failed to generate BRD:', error)
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <p>Loading BRD...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Requirements Document</h1>
          <p className="text-muted-foreground mt-2">
            Business justification and ROI framing for your product
          </p>
        </div>
        {brd && (
          <Button variant="outline" onClick={handleGenerate} disabled={generating}>
            {generating ? 'Regenerating...' : 'Regenerate'}
          </Button>
        )}
      </div>

      {!brd ? (
        <Card>
          <CardHeader>
            <CardTitle>No BRD Yet</CardTitle>
            <CardDescription>
              Generate a Business Requirements Document from your PRD
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? 'Generating...' : 'Generate BRD'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Justification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{brd.sections.businessJustification}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stakeholder Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {brd.sections.stakeholderImpact?.map((impact, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{impact}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ROI Framing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{brd.sections.roiFraming}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risks & Mitigations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {brd.sections.risks?.map((risk, index) => (
                  <li key={index} className="flex items-start gap-2 p-3 rounded-md bg-destructive/10">
                    <span className="text-destructive mt-1">⚠</span>
                    <span className="text-sm">{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button onClick={() => window.location.href = `/w/${params.workspaceId}/p/${projectId}/stories`}>
                Continue to User Stories
              </Button>
              <Button variant="outline" onClick={() => {/* Export logic */}}>
                Export BRD
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}