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
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    const prompts = [
      {
        id: '1',
        taskId: '1',
        format: 'markdown',
        content: `## Task: Setup Database Schema

### Context
Initialize the database schema for the personal finance application. This includes creating tables for users, accounts, transactions, and categories.

### Relevant Schema
\`\`\`sql
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Account" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    provider VARCHAR(100) NOT NULL,
    balance DECIMAL(12,2) NOT NULL DEFAULT 0
);

CREATE TABLE "Transaction" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES "Account"(id),
    amount DECIMAL(12,2) NOT NULL,
    category VARCHAR(100),
    date DATE NOT NULL
);

CREATE TABLE "Category" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES "Category"(id)
);
\`\`\`

### Acceptance Criteria
- Given: Database connection is available
- When: Migrations are run
- Then: All tables are created with correct foreign keys and constraints

### Constraints
- Use PostgreSQL 14+
- Use Drizzle ORM for schema definition
- Include proper indexes for frequently queried fields

### Out of Scope for This Task
- Data seeding
- User authentication
- API endpoints`
      }
    ]

    const filteredPrompts = taskId ? prompts.filter(p => p.taskId === taskId) : prompts

    return NextResponse.json({ prompts: filteredPrompts })
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
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
    const { taskId, format = 'markdown' } = body

    // In production, trigger prompt generation via agent router
    const prompt = {
      id: `prompt-${Date.now()}`,
      taskId,
      format,
      content: `## Task: [Task Title]

### Context
[Task context and what it accomplishes]

### Relevant Schema
[Embedded schema fragments]

### Relevant API Contract
[Embedded endpoint fragments]

### Acceptance Criteria
- Given: [precondition]
- When: [action]
- Then: [expected result]

### Constraints
[Tech stack and architecture constraints]

### Out of Scope for This Task
[Explicit boundaries]`
    }

    return NextResponse.json({ prompt }, { status: 201 })
  } catch (error) {
    console.error('Error generating prompt:', error)
    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    )
  }
}