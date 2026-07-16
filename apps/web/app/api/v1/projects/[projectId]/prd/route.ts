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
    // In production, fetch PRD from database
    const prd = {
      sections: {
        problem: 'Users struggle to manage personal finances across multiple accounts.',
        goals: ['Simplify expense tracking', 'Provide actionable insights', 'Reduce financial stress'],
        scope: {
          inScope: ['Multi-account aggregation', 'Categorization', 'Budget alerts', 'Monthly reports'],
          outOfScope: ['Investment tracking', 'Tax preparation', 'Bill pay']
        },
        features: [
          { id: '1', name: 'Account Connection', description: 'Securely link bank accounts', priority: 'P0' },
          { id: '2', name: 'Auto-categorization', description: 'ML-based expense categorization', priority: 'P0' },
          { id: '3', name: 'Budget Alerts', description: 'Real-time overspend notifications', priority: 'P1' },
          { id: '4', name: 'Monthly Reports', description: 'Visual spending summaries', priority: 'P1' }
        ],
        successCriteria: ['1000 active users in 3 months', '<5% categorization error rate', '4.5+ app store rating']
      }
    }

    return NextResponse.json({ prd })
  } catch (error) {
    console.error('Error fetching PRD:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PRD' },
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
    const body = await request.json()
    const { scope = 'full', sectionId } = body

    // In production, trigger PRD generation via agent router
    const prd = {
      sections: {
        problem: 'Users struggle to manage personal finances across multiple accounts.',
        goals: ['Simplify expense tracking', 'Provide actionable insights', 'Reduce financial stress'],
        scope: {
          inScope: ['Multi-account aggregation', 'Categorization', 'Budget alerts', 'Monthly reports'],
          outOfScope: ['Investment tracking', 'Tax preparation', 'Bill pay']
        },
        features: [
          { id: '1', name: 'Account Connection', description: 'Securely link bank accounts', priority: 'P0' },
          { id: '2', name: 'Auto-categorization', description: 'ML-based expense categorization', priority: 'P0' },
          { id: '3', name: 'Budget Alerts', description: 'Real-time overspend notifications', priority: 'P1' },
          { id: '4', name: 'Monthly Reports', description: 'Visual spending summaries', priority: 'P1' }
        ],
        successCriteria: ['1000 active users in 3 months', '<5% categorization error rate', '4.5+ app store rating']
      }
    }

    return NextResponse.json({ prd }, { status: 201 })
  } catch (error) {
    console.error('Error generating PRD:', error)
    return NextResponse.json(
      { error: 'Failed to generate PRD' },
      { status: 500 }
    )
  }
}