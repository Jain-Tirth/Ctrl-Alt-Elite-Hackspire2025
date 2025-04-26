import { NextResponse } from 'next/server'

// Mock password for demo purposes
const mockPassword = 'password123'

export async function PUT(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    // Check if current password is correct
    // For demo purposes, we'll accept any password
    if (currentPassword !== mockPassword && currentPassword !== 'demo') {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    console.log('Password updated successfully')

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Password update error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred while updating password' },
      { status: 500 }
    )
  }
}
