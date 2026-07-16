"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: string
  workspaceId: string
  name: string
  status: string
  createdAt: string
}

export default function WorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const workspaceId = params.workspaceId as string
  
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/v1/projects?workspaceId=${workspaceId}`)
      if (res.ok) {
        const data = await res.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async () => {
    const name = prompt("Project name:")
    if (!name) return

    try {
      const res = await fetch("/api/v1/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, name }),
      })
      if (res.ok) {
        const data = await res.json()
        router.push(`/w/${workspaceId}/p/${data.project.id}`)
      }
    } catch (error) {
      console.error("Failed to create project:", error)
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <p>Loading projects...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-2">
              Manage your product specifications
            </p>
          </div>
          <Button onClick={createProject}>New Project</Button>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No projects yet</CardTitle>
              <CardDescription>
                Create your first project to start building
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={createProject}>Create Project</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => router.push(`/w/${workspaceId}/p/${project.id}`)}
              >
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>
                    <Badge variant={project.status === 'interview_pending' ? 'draft' : 'ready'}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
