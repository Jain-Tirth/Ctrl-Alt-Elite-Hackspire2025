import { NextResponse } from 'next/server'
import { mockPredictions } from '@/lib/queue-models'

// GET wait time predictions
export async function GET(request: Request) {
  try {
    // Get center ID from query params if provided
    const { searchParams } = new URL(request.url)
    const centerIdParam = searchParams.get('centerId')
    
    if (centerIdParam) {
      const centerId = parseInt(centerIdParam)
      const prediction = mockPredictions.find(p => p.centerId === centerId)
      
      if (!prediction) {
        return NextResponse.json(
          { error: 'Prediction not found for this center' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ prediction }, { status: 200 })
    }
    
    // Return all predictions if no center ID specified
    return NextResponse.json({ predictions: mockPredictions }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching predictions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch wait time predictions' },
      { status: 500 }
    )
  }
}
