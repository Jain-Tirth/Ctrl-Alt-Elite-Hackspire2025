import { NextResponse } from 'next/server'
import { mockServiceCenters, mockUserPreference } from '@/lib/queue-models'

// GET personalized recommendations
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // In a real app, this would use ML algorithms to generate personalized recommendations
    // For demo purposes, we'll use mock data and simple logic
    
    // Find centers with shortest wait times
    const sortedCenters = [...mockServiceCenters].sort((a, b) => a.waitTime - b.waitTime)
    const shortestWaitCenter = sortedCenters[0]
    
    // Get user's preferred center
    const userPrefs = mockUserPreference // In a real app, this would be fetched based on userId
    const preferredCenter = mockServiceCenters.find(c => c.id === userPrefs.preferredCenterId)
    
    // Get current day of week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const today = new Date()
    const currentDay = daysOfWeek[today.getDay()]
    
    // Check if today is a preferred day
    const isTodayPreferred = userPrefs.preferredDays.includes(currentDay)
    
    // Generate recommendations
    const recommendations = [
      {
        type: "shortest_wait",
        centerId: shortestWaitCenter.id,
        centerName: shortestWaitCenter.name,
        waitTime: shortestWaitCenter.waitTime,
        reason: `This center currently has the shortest wait time (${shortestWaitCenter.waitTime} minutes).`
      }
    ]
    
    // Add preferred center recommendation if different from shortest wait
    if (preferredCenter && preferredCenter.id !== shortestWaitCenter.id) {
      recommendations.push({
        type: "preferred_center",
        centerId: preferredCenter.id,
        centerName: preferredCenter.name,
        waitTime: preferredCenter.waitTime,
        reason: `This is your preferred service center.`
      })
    }
    
    // Add preferred time recommendation
    if (isTodayPreferred) {
      // Find next available preferred time slot
      const currentHour = today.getHours()
      const currentMinutes = today.getMinutes()
      
      // Find the next preferred time range that hasn't passed yet
      const upcomingTimeRanges = userPrefs.preferredTimeRanges.filter(range => {
        const [startHour, startMinute] = range.start.split(':').map(Number)
        return (startHour > currentHour) || (startHour === currentHour && startMinute > currentMinutes)
      })
      
      if (upcomingTimeRanges.length > 0) {
        const nextRange = upcomingTimeRanges[0]
        recommendations.push({
          type: "preferred_time",
          timeRange: nextRange,
          reason: `Based on your preferences, visiting between ${nextRange.start} and ${nextRange.end} today is recommended.`
        })
      }
    }
    
    // Add historical insight
    if (userPrefs.visitHistory.length > 0) {
      // Find the visit with the shortest wait time
      const shortestHistoricalWait = userPrefs.visitHistory.reduce(
        (min, visit) => visit.waitTime < min.waitTime ? visit : min,
        userPrefs.visitHistory[0]
      )
      
      const historicalCenter = mockServiceCenters.find(c => c.id === shortestHistoricalWait.centerId)
      
      if (historicalCenter) {
        recommendations.push({
          type: "historical_insight",
          centerId: historicalCenter.id,
          centerName: historicalCenter.name,
          waitTime: historicalCenter.waitTime,
          historicalWaitTime: shortestHistoricalWait.waitTime,
          reason: `You experienced a short wait time (${shortestHistoricalWait.waitTime} minutes) at this center in the past.`
        })
      }
    }
    
    return NextResponse.json({ recommendations }, { status: 200 })
  } catch (error: any) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
