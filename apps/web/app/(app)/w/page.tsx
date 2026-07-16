"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Workspace {
  id: string
  name: string
  planTier: string
  createdAt: string
}

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch("/api/v1/workspaces")
      if (res.ok) {
        const data = await res.json()
        setWorkspaces(data.workspaces || [])
      }
    } catch (error) {
      console.error("Failed to fetch workspaces:", error)
    } finally {
      setLoading(false)
    }
  }

  const createWorkspace = async () => {
    const name = prompt("Workspace name:")
    if (!name) return

    try {
      const res = await fetch("/api/v1/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        fetchWorkspaces()
      }
    } catch (error) {
      console.error("Failed to create workspace:", error)
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <p>Loading workspaces...</p>
      </div>
    )
  }

  // If user has workspaces, redirect to first one
  if (workspaces.length > 0) {
    router.push(`/w/${workspaces[0].id}`)
    return null
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome to PARDI</h1>
          <p className="text-muted-foreground mt-2">
            Create your first workspace to get started
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Create Workspace</CardTitle>
            <CardDescription>
              Workspaces help you organize your projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={createWorkspace}>Create Workspace</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
