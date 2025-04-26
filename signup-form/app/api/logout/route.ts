import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Clear the session cookie
    const response = NextResponse.json({ success: true }, { status: 200 })
    response.cookies.set('session_id', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    })

    console.log('User logged out')

    return response
  } catch (error: any) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred during logout' },
      { status: 500 }
    )
  }
}
