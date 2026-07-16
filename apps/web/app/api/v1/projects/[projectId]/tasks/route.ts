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
    const tasks = [
      { id: '1', title: 'Setup database schema', componentRef: 'Database', milestone: 'M1: Foundation', status: 'pending', complexity: 'medium', endpointRefs: [], schemaEntityRefs: ['User', 'Account', 'Transaction', 'Category'] },
      { id: '2', title: 'Implement Account Service CRUD', componentRef: 'Account Service', milestone: 'M2: Core Services', status: 'pending', complexity: 'medium', endpointRefs: ['/api/accounts'], schemaEntityRefs: ['Account'] },
      { id: '3', title: 'Build categorization ML model', componentRef: 'Categorization Engine', milestone: 'M2: Core Services', status: 'pending', complexity: 'high', endpointRefs: ['/api/transactions/categorize'], schemaEntityRefs: ['Transaction', 'Category'] },
      { id: '4', title: 'Implement authentication flow', componentRef: 'Auth Service', milestone: 'M1: Foundation', status: 'pending', complexity: 'medium', endpointRefs: [], schemaEntityRefs: ['User'] },
      { id: '5', title: 'Build transaction list UI', componentRef: 'Frontend', milestone: 'M3: User Interface', status: 'pending', complexity: 'low', endpointRefs: ['/api/transactions'], schemaEntityRefs: [] }
    ]

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
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
    // In production, trigger task breakdown generation via agent router
    const tasks = [
      { id: '1', title: 'Setup database schema', componentRef: 'Database', milestone: 'M1: Foundation', status: 'pending', complexity: 'medium', endpointRefs: [], schemaEntityRefs: ['User', 'Account', 'Transaction', 'Category'] },
      { id: '2', title: 'Implement Account Service CRUD', componentRef: 'Account Service', milestone: 'M2: Core Services', status: 'pending', complexity: 'medium', endpointRefs: ['/api/accounts'], schemaEntityRefs: ['Account'] },
      { id: '3', title: 'Build categorization ML model', componentRef: 'Categorization Engine', milestone: 'M2: Core Services', status: 'pending', complexity: 'high', endpointRefs: ['/api/transactions/categorize'], schemaEntityRefs: ['Transaction', 'Category'] }
    ]

    return NextResponse.json({ tasks }, { status: 201 })
  } catch (error) {
    console.error('Error generating tasks:', error)
    return NextResponse.json(
      { error: 'Failed to generate tasks' },
      { status: 500 }
    )
  }
}