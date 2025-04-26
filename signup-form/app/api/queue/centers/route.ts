import { NextResponse } from 'next/server'
import { mockServiceCenters } from '@/lib/queue-models'

// GET all service centers
export async function GET() {
  try {
    // In a real app, this would fetch from a database
    return NextResponse.json({ centers: mockServiceCenters }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching service centers:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch service centers' },
      { status: 500 }
    )
  }
}
