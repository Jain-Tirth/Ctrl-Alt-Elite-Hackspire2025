import { NextResponse } from 'next/server'
import { mockServiceCenters } from '@/lib/queue-models'

// GET a specific service center by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    // Find the service center with the matching ID
    const center = mockServiceCenters.find(center => center.id === id)
    
    if (!center) {
      return NextResponse.json(
        { error: 'Service center not found' },
        { status: 404 }
      )
    }
    
    // Simulate real-time updates by slightly adjusting wait times
    const updatedCenter = {
      ...center,
      waitTime: Math.max(1, center.waitTime + Math.floor(Math.random() * 7) - 3),
      peopleInQueue: Math.max(0, center.peopleInQueue + Math.floor(Math.random() * 5) - 2),
      lastUpdated: "Just now"
    }
    
    return NextResponse.json({ center: updatedCenter }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching service center:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch service center' },
      { status: 500 }
    )
  }
}
