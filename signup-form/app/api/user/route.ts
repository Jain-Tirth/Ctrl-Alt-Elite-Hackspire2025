import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Mock user for demo purposes
const mockUser = {
  id: 'demo123',
  name: 'Demo User',
  email: 'demo@example.com',
  company: 'Demo Company',
  plan: 'free',
  isVerified: true,
  role: 'user'
}

export async function GET() {
  try {
    // Check if user is logged in by checking for session cookie
    const cookieStore = cookies()
    const sessionId = cookieStore.get('session_id')

    if (!sessionId) {
      // For demo purposes, we'll return the mock user anyway
      // In a real app, we would return an error if not authenticated
      console.log('No session found, returning mock user for demo')
      return NextResponse.json({ user: mockUser }, { status: 200 })
    }

    // In a real app, we would validate the session and fetch the user data
    // For demo purposes, we'll just return the mock user
    return NextResponse.json({ user: mockUser }, { status: 200 })
  } catch (error: any) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching user data' },
      { status: 500 }
    )
  }
}
