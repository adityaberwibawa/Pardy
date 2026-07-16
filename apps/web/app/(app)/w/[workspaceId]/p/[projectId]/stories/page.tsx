"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AcceptanceCriterion {
  id: string
  given: string
  when: string
  then: string
}

interface Story {
  id: string
  personaRef: string
  asA: string
  iWant: string
  soThat: string
  status: 'draft' | 'ready'
  acceptanceCriteria: AcceptanceCriterion[]
}

export default function StoriesPage() {
  const params = useParams()
  const projectId = params.projectId as string
  
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const res = await fetch(`/api/v1/projects/${projectId}/stories`)
      if (res.ok) {
        const data = await res.json()
        setStories(data.stories || [])
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`/api/v1/projects/${projectId}/stories`, {
        method: 'POST',
      })
      if (res.ok) {
        const data = await res.json()
        setStories(data.stories)
      }
    } catch (error) {
      console.error('Failed to generate stories:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleStatusChange = async (storyId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/v1/projects/${projectId}/stories`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId, status: newStatus }),
      })
      if (res.ok) {
        setStories(stories.map(s => s.id === storyId ? { ...s, status: newStatus as 'draft' | 'ready' } : s))
      }
    } catch (error) {
      console.error('Failed to update story:', error)
    }
  }

  const draftStories = stories.filter(s => s.status === 'draft')
  const readyStories = stories.filter(s => s.status === 'ready')

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <p>Loading user stories...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Stories & Acceptance Criteria</h1>
          <p className="text-muted-foreground mt-2">
            Stories derived from your PRD, grouped by persona
          </p>
        </div>
        {stories.length > 0 && (
          <Button variant="outline" onClick={handleGenerate} disabled={generating}>
            {generating ? 'Regenerating...' : 'Regenerate'}
          </Button>
        )}
      </div>

      {stories.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No User Stories Yet</CardTitle>
            <CardDescription>
              Generate user stories from your PRD and BRD
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? 'Generating...' : 'Generate User Stories'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Draft</h2>
                <Badge variant="draft">{draftStories.length}</Badge>
              </div>
              {draftStories.map((story) => (
                <StoryCard 
                  key={story.id} 
                  story={story} 
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Ready</h2>
                <Badge variant="ready">{readyStories.length}</Badge>
              </div>
              {readyStories.map((story) => (
                <StoryCard 
                  key={story.id} 
                  story={story} 
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>
                Mark all stories as ready to proceed to architecture
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button 
                onClick={() => window.location.href = `/w/${params.workspaceId}/p/${projectId}/architecture`}
                disabled={readyStories.length === 0}
              >
                Continue to Architecture
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function StoryCard({ story, onStatusChange }: { 
  story: Story
  onStatusChange: (id: string, status: string) => void 
}) {
  const [expanded, setExpanded] = useState(false)
  const canMarkReady = story.acceptanceCriteria.length > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <div className="text-xs text-muted-foreground">{story.personaRef}</div>
            <div className="text-sm">
              <span className="font-semibold">As a</span> {story.asA},<br/>
              <span className="font-semibold">I want</span> {story.iWant},<br/>
              <span className="font-semibold">so that</span> {story.soThat}
            </div>
          </div>
          <Badge variant={story.status === 'ready' ? 'ready' : 'draft'}>
            {story.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-medium hover:underline"
          >
            {story.acceptanceCriteria.length} Acceptance Criteria {expanded ? '▼' : '▶'}
          </button>
          {expanded && (
            <div className="mt-3 space-y-2">
              {story.acceptanceCriteria.map((criteria) => (
                <div key={criteria.id} className="text-xs bg-muted/50 p-2 rounded">
                  <div><span className="font-semibold">Given:</span> {criteria.given}</div>
                  <div><span className="font-semibold">When:</span> {criteria.when}</div>
                  <div><span className="font-semibold">Then:</span> {criteria.then}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        {story.status === 'draft' && (
          <Button
            size="sm"
            onClick={() => onStatusChange(story.id, 'ready')}
            disabled={!canMarkReady}
            title={!canMarkReady ? 'Add acceptance criteria first' : ''}
          >
            Mark as Ready
          </Button>
        )}
      </CardContent>
    </Card>
  )
}