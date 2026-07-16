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
    // In production, fetch BRD from database
    const brd = {
      sections: {
        businessJustification: 'Personal finance management is a $500B market with 78% smartphone penetration. Target users actively seeking solutions but frustrated with complexity of existing tools.',
        stakeholderImpact: [
          'Users: Reduced financial stress, 30% time savings on expense management',
          'Business: New revenue stream, 15-20% monthly user growth projected',
          'Support: Reduced complexity = fewer support tickets'
        ],
        roiFraming: 'Break-even at 5,000 paid users (est. month 6). LTV:CAC ratio of 3.5:1 based on comparable products. 12-month payback period.',
        risks: [
          'Data security breach could destroy trust',
          'Regulatory compliance (PCI-DSS, SOC 2) costs ~$50k annually',
          'Bank API stability depends on third-party providers'
        ]
      }
    }

    return NextResponse.json({ brd })
  } catch (error) {
    console.error('Error fetching BRD:', error)
    return NextResponse.json(
      { error: 'Failed to fetch BRD' },
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
    // In production, trigger BRD generation via agent router
    const brd = {
      sections: {
        businessJustification: 'Personal finance management is a $500B market with 78% smartphone penetration. Target users actively seeking solutions but frustrated with complexity of existing tools.',
        stakeholderImpact: [
          'Users: Reduced financial stress, 30% time savings on expense management',
          'Business: New revenue stream, 15-20% monthly user growth projected',
          'Support: Reduced complexity = fewer support tickets'
        ],
        roiFraming: 'Break-even at 5,000 paid users (est. month 6). LTV:CAC ratio of 3.5:1 based on comparable products. 12-month payback period.',
        risks: [
          'Data security breach could destroy trust',
          'Regulatory compliance (PCI-DSS, SOC 2) costs ~$50k annually',
          'Bank API stability depends on third-party providers'
        ]
      }
    }

    return NextResponse.json({ brd }, { status: 201 })
  } catch (error) {
    console.error('Error generating BRD:', error)
    return NextResponse.json(
      { error: 'Failed to generate BRD' },
      { status: 500 }
    )
  }
}