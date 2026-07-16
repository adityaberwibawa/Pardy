"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Task {
  id: string
  title: string
  componentRef: string
  milestone: string
  status: string
  complexity: string
  endpointRefs: string[]
  schemaEntityRefs: string[]
}

export default function TasksPage() {
  const params = useParams()
  const projectId = params.projectId as string
  
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/v1/projects/${projectId}/tasks`)
      if (res.ok) {
        const data = await res.json()
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`/api/v1/projects/${projectId}/tasks`, {
        method: 'POST',
      })
      if (res.ok) {
        const data = await res.json()
        setTasks(data.tasks)
      }
    } catch (error) {
      console.error('Failed to generate tasks:', error)
    } finally {
      setGenerating(false)
    }
  }

  const tasksByMilestone = tasks.reduce((acc, task) => {
    if (!acc[task.milestone]) {
      acc[task.milestone] = []
    }
    acc[task.milestone].push(task)
    return acc
  }, {} as Record<string, Task[]>)

  const complexityColors: Record<string, any> = {
    low: 'ready',
    medium: 'generating',
    high: 'flagged'
  }

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <p>Loading tasks...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Task Breakdown</h1>
          <p className="text-muted-foreground mt-2">
            Implementation tasks mapped to architecture, API, and database
          </p>
        </div>
        {tasks.length > 0 && (
          <Button variant="outline" onClick={handleGenerate} disabled={generating}>
            {generating ? 'Regenerating...' : 'Regenerate'}
          </Button>
        )}
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Tasks Yet</CardTitle>
            <CardDescription>
              Generate implementation tasks from your architecture, API design, and database schema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? 'Generating...' : 'Generate Task Breakdown'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(tasksByMilestone).map(([milestone, milestoneTasks]) => (
            <Card key={milestone}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{milestone}</CardTitle>
                  <Badge variant="draft">{milestoneTasks.length} tasks</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {milestoneTasks.map((task) => (
                    <Card key={task.id} className="hover:border-primary transition-colors">
                      <CardContent className="py-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold">{task.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                Component: <code className="bg-muted px-1 rounded">{task.componentRef}</code>
                              </p>
                            </div>
                            <Badge variant={complexityColors[task.complexity] || 'draft'}>
                              {task.complexity}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {task.schemaEntityRefs.length > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">Schema:</span>
                                {task.schemaEntityRefs.map(entity => (
                                  <Badge key={entity} variant="draft" className="text-xs">
                                    {entity}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {task.endpointRefs.length > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">Endpoints:</span>
                                {task.endpointRefs.map(endpoint => (
                                  <Badge key={endpoint} variant="generating" className="text-xs font-mono">
                                    {endpoint}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => window.location.href = `/w/${params.workspaceId}/p/${projectId}/prompts?taskId=${task.id}`}
                            >
                              Generate Prompt
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button onClick={() => window.location.href = `/w/${params.workspaceId}/p/${projectId}/prompts`}>
                Continue to Prompt Generator
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}