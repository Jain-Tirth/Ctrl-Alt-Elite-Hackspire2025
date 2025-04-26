import { NextResponse } from 'next/server'
import { addUser, hasUser } from '@/lib/user-store'

export async function POST(request: Request) {
  try {
    const { name, email, password, company } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    if (hasUser(email)) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      )
    }

    // Create a new user
    const userId = Math.random().toString(36).substring(2, 15)
    const newUser = {
      id: userId,
      name,
      email,
      password, // In a real app, this would be hashed
      company: company || '',
      plan: 'free',
      isVerified: false,
      role: 'user',
      createdAt: new Date().toISOString()
    }

    // Store the user in the shared store
    addUser(newUser)

    // Create a user object without the password for the response
    const userResponse = {
      id: userId,
      name,
      email,
      company: company || '',
      plan: 'free',
      isVerified: false,
      role: 'user',
      createdAt: new Date().toISOString()
    }

    console.log('User created:', userResponse)

    // Return the user without the password
    return NextResponse.json({ user: userResponse }, { status: 201 })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred during signup' },
      { status: 500 }
    )
  }
}
