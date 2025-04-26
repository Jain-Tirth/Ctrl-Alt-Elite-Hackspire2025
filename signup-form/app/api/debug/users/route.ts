import { NextResponse } from 'next/server'
import { getAllUsers } from '@/lib/user-store'

// This is a debug endpoint to check registered users
// In a production environment, this would be removed or protected
export async function GET() {
  try {
    const users = getAllUsers().map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      plan: user.plan,
      isVerified: user.isVerified,
      role: user.role,
      createdAt: user.createdAt
    }));
    
    return NextResponse.json({ users }, { status: 200 })
  } catch (error: any) {
    console.error('Debug users error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching users' },
      { status: 500 }
    )
  }
}
