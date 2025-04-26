import { NextResponse } from 'next/server'
import { mockAnomalies } from '@/lib/queue-models'

// GET anomaly detections
export async function GET() {
  try {
    // In a real app, this would run anomaly detection algorithms
    return NextResponse.json({ anomalies: mockAnomalies }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching anomalies:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch anomaly detections' },
      { status: 500 }
    )
  }
}
