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
    // In production, fetch validation from database
    const validation = {
      technicalFeasibility: { score: 8, reasoning: 'Standard web app, well-understood patterns' },
      marketSignal: { score: 6, reasoning: 'Competitive space, needs differentiation', directional: true },
      scopeRealism: { score: 7, reasoning: '4-week timeline ambitious for full feature set' },
      flags: [
        { type: 'warning', message: 'Consider deferring multi-currency to v2' }
      ]
    }

    return NextResponse.json({ validation })
  } catch (error) {
    console.error('Error fetching validation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch validation' },
      { status: 500 }
    )
  }
}

export async function POST(
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
    // In production, trigger validation generation via agent router
    // For now, return mock validation
    const validation = {
      technicalFeasibility: { score: 8, reasoning: 'Standard web app, well-understood patterns' },
      marketSignal: { score: 6, reasoning: 'Competitive space, needs differentiation', directional: true },
      scopeRealism: { score: 7, reasoning: '4-week timeline ambitious for full feature set' },
      flags: [
        { type: 'warning', message: 'Consider deferring multi-currency to v2' }
      ]
    }

    return NextResponse.json({ validation }, { status: 201 })
  } catch (error) {
    console.error('Error generating validation:', error)
    return NextResponse.json(
      { error: 'Failed to generate validation' },
      { status: 500 }
    )
  }
}