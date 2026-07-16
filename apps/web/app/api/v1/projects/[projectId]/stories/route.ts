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
    // In production, fetch stories from database
    const stories = [
      {
        id: '1',
        personaRef: 'end-user',
        asA: 'budget-conscious user',
        iWant: 'to see all my accounts in one place',
        soThat: 'I can understand my total financial picture',
        status: 'draft',
        acceptanceCriteria: [
          { id: '1', given: 'I have multiple bank accounts', when: 'I open the app', then: 'I see all account balances aggregated' },
          { id: '2', given: 'One account has new transactions', when: 'I refresh', then: 'The balance updates within 5 seconds' }
        ]
      },
      {
        id: '2',
        personaRef: 'end-user',
        asA: 'busy professional',
        iWant: 'automatic expense categorization',
        soThat: 'I don\'t waste time manually tagging transactions',
        status: 'ready',
        acceptanceCriteria: [
          { id: '3', given: 'A new transaction appears', when: 'The system processes it', then: 'It is auto-categorized with 95%+ accuracy' },
          { id: '4', given: 'A categorization is wrong', when: 'I correct it', then: 'Similar future transactions learn from my correction' }
        ]
      }
    ]

    return NextResponse.json({ stories })
  } catch (error) {
    console.error('Error fetching stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
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
    // In production, trigger stories generation via agent router
    const stories = [
      {
        id: '1',
        personaRef: 'end-user',
        asA: 'budget-conscious user',
        iWant: 'to see all my accounts in one place',
        soThat: 'I can understand my total financial picture',
        status: 'draft',
        acceptanceCriteria: [
          { id: '1', given: 'I have multiple bank accounts', when: 'I open the app', then: 'I see all account balances aggregated' }
        ]
      }
    ]

    return NextResponse.json({ stories }, { status: 201 })
  } catch (error) {
    console.error('Error generating stories:', error)
    return NextResponse.json(
      { error: 'Failed to generate stories' },
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
    const body = await request.json()
    const { storyId, status } = body

    // In production, update story status in database
    // Validate that story has acceptance criteria if marking as "ready"
    
    return NextResponse.json({ success: true, storyId, status })
  } catch (error) {
    console.error('Error updating story:', error)
    return NextResponse.json(
      { error: 'Failed to update story' },
      { status: 500 }
    )
  }
}