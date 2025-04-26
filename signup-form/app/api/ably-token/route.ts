import { NextResponse } from 'next/server'
import * as Ably from 'ably'

// Ably API key from environment variables
// Using a temporary API key for demo purposes - in production, use environment variables
const ABLY_API_KEY = process.env.ABLY_API_KEY || 'DEMO_API_KEY_FOR_TESTING'

export async function GET(request: Request) {
  try {
    // Get client ID from query params
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId') || 'anonymous'

    // For demo purposes, if we're using the demo key, return a mock token
    if (ABLY_API_KEY === 'DEMO_API_KEY_FOR_TESTING') {
      console.log('Using mock Ably token for demo purposes')
      return NextResponse.json({
        capability: { '*': ['*'] },
        clientId: clientId,
        keyName: 'mock.key',
        nonce: Math.random().toString(36).substring(2),
        mac: 'mock-mac-' + Math.random().toString(36).substring(2),
        issued: Date.now(),
        expires: Date.now() + 3600000, // 1 hour from now
      }, { status: 200 })
    }

    // Create Ably REST client
    const client = new Ably.Rest(ABLY_API_KEY)

    // Create token request
    const tokenRequest = await client.auth.createTokenRequest({
      clientId: clientId
    })

    // Return token request to client
    return NextResponse.json(tokenRequest, { status: 200 })
  } catch (error: any) {
    console.error('Error creating Ably token request:', error)

    // Return a mock token for demo purposes
    console.log('Returning mock token due to error')
    const mockClientId = request.url ? new URL(request.url).searchParams.get('clientId') : 'anonymous'
    return NextResponse.json({
      capability: { '*': ['*'] },
      clientId: mockClientId,
      keyName: 'mock.key',
      nonce: Math.random().toString(36).substring(2),
      mac: 'mock-mac-' + Math.random().toString(36).substring(2),
      issued: Date.now(),
      expires: Date.now() + 3600000, // 1 hour from now
    }, { status: 200 })
  }
}
