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
    const apiDesign = {
      specVersion: 'v1',
      endpoints: [
        { id: '1', method: 'GET', path: '/api/accounts', authRequired: true, description: 'List all accounts for user', responseSchema: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, provider: { type: 'string' }, balance: { type: 'number' } } } }, errorCases: [], justifiedByStories: ['1'] },
        { id: '2', method: 'POST', path: '/api/accounts', authRequired: true, description: 'Connect new account', responseSchema: { type: 'object' }, errorCases: [{ statusCode: 400, description: 'Invalid provider' }], justifiedByStories: ['1'] },
        { id: '3', method: 'GET', path: '/api/transactions', authRequired: true, description: 'List transactions with filters', responseSchema: { type: 'array' }, errorCases: [], justifiedByStories: ['1', '2'] },
        { id: '4', method: 'POST', path: '/api/transactions/categorize', authRequired: true, description: 'Auto-categorize transaction', responseSchema: { type: 'object' }, errorCases: [{ statusCode: 422, description: 'Low confidence' }], justifiedByStories: ['2'] },
        { id: '5', method: 'GET', path: '/api/reports/monthly', authRequired: true, description: 'Generate monthly spending report', responseSchema: { type: 'object' }, errorCases: [], justifiedByStories: ['3'] }
      ]
    }

    return NextResponse.json({ apiDesign })
  } catch (error) {
    console.error('Error fetching API design:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API design' },
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
    // In production, trigger API design generation via agent router
    const apiDesign = {
      specVersion: 'v1',
      endpoints: [
        { id: '1', method: 'GET', path: '/api/accounts', authRequired: true, description: 'List all accounts for user', responseSchema: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, provider: { type: 'string' }, balance: { type: 'number' } } } }, errorCases: [], justifiedByStories: ['1'] },
        { id: '2', method: 'POST', path: '/api/accounts', authRequired: true, description: 'Connect new account', responseSchema: { type: 'object' }, errorCases: [{ statusCode: 400, description: 'Invalid provider' }], justifiedByStories: ['1'] },
        { id: '3', method: 'GET', path: '/api/transactions', authRequired: true, description: 'List transactions with filters', responseSchema: { type: 'array' }, errorCases: [], justifiedByStories: ['1', '2'] },
        { id: '4', method: 'POST', path: '/api/transactions/categorize', authRequired: true, description: 'Auto-categorize transaction', responseSchema: { type: 'object' }, errorCases: [{ statusCode: 422, description: 'Low confidence' }], justifiedByStories: ['2'] },
        { id: '5', method: 'GET', path: '/api/reports/monthly', authRequired: true, description: 'Generate monthly spending report', responseSchema: { type: 'object' }, errorCases: [], justifiedByStories: ['3'] }
      ]
    }

    return NextResponse.json({ apiDesign }, { status: 201 })
  } catch (error) {
    console.error('Error generating API design:', error)
    return NextResponse.json(
      { error: 'Failed to generate API design' },
      { status: 500 }
    )
  }
}