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
    // In production, fetch architecture from database
    const architecture = {
      components: [
        { id: '1', name: 'Account Service', type: 'core', justifiedBy: ['1'] },
        { id: '2', name: 'Transaction Service', type: 'core', justifiedBy: ['1', '2'] },
        { id: '3', name: 'Categorization Engine', type: 'core', justifiedBy: ['2'] },
        { id: '4', name: 'Auth Service', type: 'supporting', justifiedBy: [] },
        { id: '5', name: 'Notification Service', type: 'supporting', justifiedBy: ['3'] }
      ],
      diagram: `graph TD
    subgraph Core
        AS[Account Service]
        TS[Transaction Service]
        CE[Categorization Engine]
    end
    subgraph Supporting
        Auth[Auth Service]
        Notif[Notification Service]
    end
    AS --> TS
    TS --> CE
    Auth --> AS
    Auth --> TS
    Auth --> CE
    Notif -.-> TS`
    }

    return NextResponse.json({ architecture })
  } catch (error) {
    console.error('Error fetching architecture:', error)
    return NextResponse.json(
      { error: 'Failed to fetch architecture' },
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
    // In production, trigger architecture generation via agent router
    const architecture = {
      components: [
        { id: '1', name: 'Account Service', type: 'core', justifiedBy: ['1'] },
        { id: '2', name: 'Transaction Service', type: 'core', justifiedBy: ['1', '2'] },
        { id: '3', name: 'Categorization Engine', type: 'core', justifiedBy: ['2'] },
        { id: '4', name: 'Auth Service', type: 'supporting', justifiedBy: [] },
        { id: '5', name: 'Notification Service', type: 'supporting', justifiedBy: ['3'] }
      ],
      diagram: `graph TD
    subgraph Core
        AS[Account Service]
        TS[Transaction Service]
        CE[Categorization Engine]
    end
    subgraph Supporting
        Auth[Auth Service]
        Notif[Notification Service]
    end
    AS --> TS
    TS --> CE
    Auth --> AS
    Auth --> TS
    Auth --> CE
    Notif -.-> TS`
    }

    return NextResponse.json({ architecture }, { status: 201 })
  } catch (error) {
    console.error('Error generating architecture:', error)
    return NextResponse.json(
      { error: 'Failed to generate architecture' },
      { status: 500 }
    )
  }
}