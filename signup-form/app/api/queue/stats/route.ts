import { NextResponse } from 'next/server'
import { mockQueueStats } from '@/lib/queue-models'

// GET queue statistics
export async function GET() {
  try {
    // In a real app, this would calculate stats from a database
    // Simulate real-time updates by slightly adjusting stats
    const updatedStats = {
      ...mockQueueStats,
      averageWaitTime: Math.max(1, mockQueueStats.averageWaitTime + Math.floor(Math.random() * 5) - 2),
      totalVisitors: mockQueueStats.totalVisitors + Math.floor(Math.random() * 3)
    }
    
    return NextResponse.json({ stats: updatedStats }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching queue stats:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch queue statistics' },
      { status: 500 }
    )
  }
}
