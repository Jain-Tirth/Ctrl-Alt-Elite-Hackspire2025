import { NextResponse } from 'next/server'

// Mock user for demo purposes
let mockUser = {
  id: 'demo123',
  name: 'Demo User',
  email: 'demo@example.com',
  company: 'Demo Company',
  plan: 'free',
  isVerified: true,
  role: 'user'
}

export async function PUT(request: Request) {
  try {
    const { name, company } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Update the mock user
    mockUser = {
      ...mockUser,
      name,
      company: company || mockUser.company
    }

    console.log('User profile updated:', mockUser)

    return NextResponse.json({ user: mockUser }, { status: 200 })
  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred while updating profile' },
      { status: 500 }
    )
  }
}
