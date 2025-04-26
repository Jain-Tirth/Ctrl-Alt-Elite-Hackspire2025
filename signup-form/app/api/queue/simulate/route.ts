import { NextResponse } from 'next/server'
import { mockServiceCenters, mockQueueStats, mockAnomalies } from '@/lib/queue-models'
import * as Ably from 'ably'

// Ably API key from environment variables
// Using a temporary API key for demo purposes - in production, use environment variables
const ABLY_API_KEY = process.env.ABLY_API_KEY || 'DEMO_API_KEY_FOR_TESTING'

// Simulate real-time updates to queue data
export async function POST() {
  try {
    // Generate random updates to service centers
    const updatedCenters = mockServiceCenters.map(center => ({
      ...center,
      waitTime: Math.max(1, center.waitTime + Math.floor(Math.random() * 7) - 3),
      peopleInQueue: Math.max(0, center.peopleInQueue + Math.floor(Math.random() * 5) - 2),
      lastUpdated: "Just now"
    }))

    // Update queue stats
    const updatedStats = {
      ...mockQueueStats,
      averageWaitTime: Math.max(1, mockQueueStats.averageWaitTime + Math.floor(Math.random() * 5) - 2),
      totalVisitors: mockQueueStats.totalVisitors + Math.floor(Math.random() * 3),
      waitTimeChange: mockQueueStats.waitTimeChange + Math.floor(Math.random() * 5) - 2,
      visitorChange: mockQueueStats.visitorChange + Math.floor(Math.random() * 3) - 1
    }

    // Randomly decide whether to generate an anomaly
    const shouldGenerateAnomaly = Math.random() < 0.3 // 30% chance
    let randomAnomaly = null

    if (shouldGenerateAnomaly) {
      randomAnomaly = {
        ...mockAnomalies[Math.floor(Math.random() * mockAnomalies.length)],
        detectedAt: new Date().toISOString()
      }
    }

    // For demo purposes or if we're using an invalid key, just return the data without publishing
    try {
      // Only try to publish to Ably if we have a valid API key
      if (ABLY_API_KEY !== 'DEMO_API_KEY_FOR_TESTING') {
        // Create Ably REST client
        const client = new Ably.Rest(ABLY_API_KEY)

        // Get channels
        const queueStatusChannel = client.channels.get('queue-status')
        const waitTimesChannel = client.channels.get('wait-times')
        const anomaliesChannel = client.channels.get('anomalies')

        // Publish updates to Ably channels
        await queueStatusChannel.publish('update', updatedCenters)
        await queueStatusChannel.publish('stats', updatedStats)

        // Publish individual wait time updates
        for (const center of updatedCenters) {
          await waitTimesChannel.publish(`center-${center.id}`, center.waitTime)
        }

        // Publish anomaly if generated
        if (shouldGenerateAnomaly && randomAnomaly) {
          await anomaliesChannel.publish('detected', randomAnomaly)
        }

        console.log('Successfully published updates to Ably')
      } else {
        console.log('Using mock data without Ably publishing (demo key)')
      }
    } catch (error) {
      console.error('Error publishing to Ably:', error)
      console.log('Falling back to direct data return')
    }

    return NextResponse.json({
      success: true,
      updated: {
        centers: updatedCenters,
        stats: updatedStats,
        anomalyGenerated: shouldGenerateAnomaly
      }
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error simulating queue updates:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to simulate queue updates' },
      { status: 500 }
    )
  }
}
