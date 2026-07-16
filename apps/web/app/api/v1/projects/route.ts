import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const workspaceId = searchParams.get('workspaceId')

  if (!workspaceId) {
    return NextResponse.json(
      { error: 'Workspace ID is required' },
      { status: 400 }
    )
  }

  try {
    // In production, fetch projects from database using Drizzle
    // Check RLS policy ensures user has access to workspace
    const projects = [
      {
        id: 'project-1',
        workspaceId,
        name: 'Sample Project',
        status: 'interview_pending',
        createdAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { workspaceId, name, description } = body

    if (!workspaceId || !name) {
      return NextResponse.json(
        { error: 'Workspace ID and project name are required' },
        { status: 400 }
      )
    }

    // In production, create project in database using Drizzle
    // Verify user has access to workspace via RLS
    const project = {
      id: `project-${Date.now()}`,
      workspaceId,
      name,
      description: description || null,
      status: 'interview_pending',
      interviewData: {},
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
