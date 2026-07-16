"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Prompt {
  id: string
  taskId: string
  format: 'markdown' | 'json'
  content: string
}

export default function PromptsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const projectId = params.projectId as string
  const taskId = searchParams.get('taskId')
  
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchPrompts()
  }, [taskId])

  const fetchPrompts = async () => {
    try {
      const url = taskId 
        ? `/api/v1/projects/${projectId}/prompts?taskId=${taskId}`
        : `/api/v1/projects/${projectId}/prompts`
      
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setPrompts(data.prompts || [])
        if (data.prompts && data.prompts.length > 0) {
          setSelectedPrompt(data.prompts[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch prompts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (selectedPrompt) {
      await navigator.clipboard.writeText(selectedPrompt.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleExport = () => {
    if (selectedPrompt) {
      const blob = new Blob([selectedPrompt.content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `prompt-${selectedPrompt.taskId}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <p>Loading prompts...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Prompt Generator</h1>
        <p className="text-muted-foreground mt-2">
          Self-contained coding prompts ready for AI agents
        </p>
      </div>

      {prompts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Prompts Generated Yet</CardTitle>
            <CardDescription>
              Go back to Task Breakdown and generate prompts for your tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = `/w/${params.workspaceId}/p/${projectId}/tasks`}>
              Go to Tasks
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {selectedPrompt && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Generated Prompt</CardTitle>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleCopy}>
                          {copied ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleExport}>
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm whitespace-pre-wrap">
                      {selectedPrompt.content}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Success!</CardTitle>
                    <CardDescription>
                      Your complete pipeline from idea to coding prompts is ready
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">What You've Built:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✅ Validated your idea</li>
                        <li>✅ Created PRD and BRD</li>
                        <li>✅ Defined user stories with acceptance criteria</li>
                        <li>✅ Designed system architecture</li>
                        <li>✅ Generated normalized database schema</li>
                        <li>✅ Created API contracts</li>
                        <li>✅ Broke down implementation tasks</li>
                        <li>✅ Generated coding-agent-ready prompts</li>
                      </ul>
                    </div>
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2">Next Steps:</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Copy this prompt and paste it into your AI coding agent (Claude Code, Cursor, Windsurf, etc.)
                      </p>
                      <Button onClick={() => window.location.href = `/w/${params.workspaceId}/p/${projectId}`}>
                        Back to Project Overview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Prompts</CardTitle>
                <CardDescription>{prompts.length} prompt(s) generated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {prompts.map((prompt) => (
                    <Card
                      key={prompt.id}
                      className={`cursor-pointer transition-colors ${
                        selectedPrompt?.id === prompt.id ? 'border-primary' : ''
                      }`}
                      onClick={() => setSelectedPrompt(prompt)}
                    >
                      <CardContent className="py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Task {prompt.taskId}</span>
                          <Badge variant="draft">{prompt.format}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}