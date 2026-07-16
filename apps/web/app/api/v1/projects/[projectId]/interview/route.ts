import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { projectId } = params
    
    // In production, fetch project with interview_data from database
    // Check RLS policy ensures user has access
    const interviewData = {
      problem: '',
      targetUser: '',
      valueProposition: '',
      constraints: {},
    }

    return NextResponse.json({ interviewData })
  } catch (error) {
    console.error('Error fetching interview data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch interview data' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { projectId } = params
    const body = await request.json()
    const { interviewData } = body

    // In production, update project.interview_data in database using Drizzle
    // Verify user has access to project via RLS
    
    return NextResponse.json({ 
      success: true,
      interviewData 
    })
  } catch (error) {
    console.error('Error updating interview data:', error)
    return NextResponse.json(
      { error: 'Failed to update interview data' },
      { status: 500 }
    )
  }
}
