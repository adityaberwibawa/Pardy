import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get workspaces where user is a member
    // In production, this would use Drizzle with proper joins
    // For now, return mock data structure
    const workspaces = [
      {
        id: 'workspace-1',
        name: 'My Workspace',
        planTier: 'free',
        createdAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({ workspaces })
  } catch (error) {
    console.error('Error fetching workspaces:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workspaces' },
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
    const { name } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Workspace name is required' },
        { status: 400 }
      )
    }

    // In production, create workspace in database using Drizzle
    // For now, return mock created workspace
    const workspace = {
      id: `workspace-${Date.now()}`,
      name,
      planTier: 'free',
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ workspace }, { status: 201 })
  } catch (error) {
    console.error('Error creating workspace:', error)
    return NextResponse.json(
      { error: 'Failed to create workspace' },
      { status: 500 }
    )
  }
}
