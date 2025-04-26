import { NextResponse } from 'next/server'
import { getUser, hasUser } from '@/lib/user-store'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user exists
    if (!hasUser(email)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const user = getUser(email)!

    // Check password
    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // For debugging
    console.log('Login attempt successful for:', email)

    // Create a session
    const sessionId = Math.random().toString(36).substring(2, 15)

    // Set session cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        plan: user.plan,
        isVerified: user.isVerified,
        role: user.role
      }
    }, { status: 200 })

    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })

    console.log('User logged in:', user.email)

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred during login' },
      { status: 500 }
    )
  }
}
