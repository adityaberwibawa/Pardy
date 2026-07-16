"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const PIPELINE_STAGES = [
  { id: 'interview', name: 'AI Interview', path: 'interview' },
  { id: 'validation', name: 'Idea Validation', path: 'validation' },
  { id: 'prd', name: 'PRD', path: 'prd' },
  { id: 'brd', name: 'BRD', path: 'brd' },
  { id: 'stories', name: 'User Stories', path: 'stories' },
  { id: 'architecture', name: 'Architecture', path: 'architecture' },
  { id: 'database', name: 'Database', path: 'database' },
  { id: 'api', name: 'API', path: 'api-design' },
  { id: 'tasks', name: 'Tasks', path: 'tasks' },
  { id: 'prompts', name: 'Prompts', path: 'prompts' },
]

export default function ProjectOverviewPage() {
  const params = useParams()
  const router = useRouter()
  const workspaceId = params.workspaceId as string
  const projectId = params.projectId as string

  const navigateToStage = (stagePath: string) => {
    router.push(`/w/${workspaceId}/p/${projectId}/${stagePath}`)
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Project Overview</h1>
          <p className="text-muted-foreground mt-2">
            Pipeline: Idea → Exported Coding Prompts
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PIPELINE_STAGES.map((stage, index) => (
            <Card
              key={stage.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => navigateToStage(stage.path)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{stage.name}</CardTitle>
                  <Badge variant={index === 0 ? 'generating' : 'draft'}>
                    {index === 0 ? 'Start' : 'Pending'}
                  </Badge>
                </div>
                <CardDescription>
                  Stage {index + 1} of {PIPELINE_STAGES.length}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Start with the AI Interview to capture your idea
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigateToStage('interview')}>
              Start AI Interview
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
