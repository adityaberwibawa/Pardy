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
    const dbSchema = {
      entities: [
        { id: '1', name: 'User', fields: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'email', type: 'string', nullable: false },
          { name: 'createdAt', type: 'timestamp', nullable: false }
        ], justifiedByStories: ['1'] },
        { id: '2', name: 'Account', fields: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'userId', type: 'uuid', nullable: false, foreignKey: { table: 'User', field: 'id' } },
          { name: 'provider', type: 'string', nullable: false },
          { name: 'balance', type: 'decimal', nullable: false }
        ], justifiedByStories: ['1'] },
        { id: '3', name: 'Transaction', fields: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'accountId', type: 'uuid', nullable: false, foreignKey: { table: 'Account', field: 'id' } },
          { name: 'amount', type: 'decimal', nullable: false },
          { name: 'category', type: 'string', nullable: true },
          { name: 'date', type: 'date', nullable: false }
        ], justifiedByStories: ['1', '2'] },
        { id: '4', name: 'Category', fields: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'name', type: 'string', nullable: false },
          { name: 'parentId', type: 'uuid', nullable: true, foreignKey: { table: 'Category', field: 'id' } }
        ], justifiedByStories: ['2'] }
      ],
      relationships: [
        { id: '1', type: 'one-to-many', fromEntity: 'User', toEntity: 'Account', fromField: 'id', toField: 'userId' },
        { id: '2', type: 'one-to-many', fromEntity: 'Account', toEntity: 'Transaction', fromField: 'id', toField: 'accountId' },
        { id: '3', type: 'self-referencing', fromEntity: 'Category', toEntity: 'Category', fromField: 'id', toField: 'parentId' }
      ],
      rawDdl: `CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Account" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    provider VARCHAR(100) NOT NULL,
    balance DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Transaction" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES "Account"(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    category VARCHAR(100),
    date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Category" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES "Category"(id)
);`
    }

    return NextResponse.json({ dbSchema })
  } catch (error) {
    console.error('Error fetching database schema:', error)
    return NextResponse.json(
      { error: 'Failed to fetch database schema' },
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
    // In production, trigger database generation via agent router
    const dbSchema = {
      entities: [
        { id: '1', name: 'User', fields: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'email', type: 'string', nullable: false },
          { name: 'createdAt', type: 'timestamp', nullable: false }
        ], justifiedByStories: ['1'] },
        { id: '2', name: 'Account', fields: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'userId', type: 'uuid', nullable: false, foreignKey: { table: 'User', field: 'id' } },
          { name: 'provider', type: 'string', nullable: false },
          { name: 'balance', type: 'decimal', nullable: false }
        ], justifiedByStories: ['1'] },
        { id: '3', name: 'Transaction', fields: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'accountId', type: 'uuid', nullable: false, foreignKey: { table: 'Account', field: 'id' } },
          { name: 'amount', type: 'decimal', nullable: false },
          { name: 'category', type: 'string', nullable: true },
          { name: 'date', type: 'date', nullable: false }
        ], justifiedByStories: ['1', '2'] },
        { id: '4', name: 'Category', fields: [
          { name: 'id', type: 'uuid', nullable: false, primaryKey: true },
          { name: 'name', type: 'string', nullable: false },
          { name: 'parentId', type: 'uuid', nullable: true, foreignKey: { table: 'Category', field: 'id' } }
        ], justifiedByStories: ['2'] }
      ],
      relationships: [
        { id: '1', type: 'one-to-many', fromEntity: 'User', toEntity: 'Account', fromField: 'id', toField: 'userId' },
        { id: '2', type: 'one-to-many', fromEntity: 'Account', toEntity: 'Transaction', fromField: 'id', toField: 'accountId' },
        { id: '3', type: 'self-referencing', fromEntity: 'Category', toEntity: 'Category', fromField: 'id', toField: 'parentId' }
      ],
      rawDdl: `CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Account" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    provider VARCHAR(100) NOT NULL,
    balance DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Transaction" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES "Account"(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    category VARCHAR(100),
    date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Category" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES "Category"(id)
);`
    }

    return NextResponse.json({ dbSchema }, { status: 201 })
  } catch (error) {
    console.error('Error generating database schema:', error)
    return NextResponse.json(
      { error: 'Failed to generate database schema' },
      { status: 500 }
    )
  }
}