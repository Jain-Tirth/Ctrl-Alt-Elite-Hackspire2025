import { NextResponse } from 'next/server'

export async function GET() {
  // In a real application, you would check if the user is authenticated here
  // For now, we'll just return a success response
  return NextResponse.json({ message: 'Dashboard data loaded successfully' })
}
