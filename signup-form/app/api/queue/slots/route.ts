import { NextResponse } from 'next/server'
import { TimeSlot } from '@/lib/queue-models'

// Generate time slots for a specific date and center
const generateTimeSlots = (date: string, centerId: number): TimeSlot[] => {
  const slots: TimeSlot[] = []
  let slotId = 1
  
  // Generate slots from 9 AM to 5 PM
  for (let hour = 9; hour <= 17; hour++) {
    // Skip lunch hour
    if (hour === 12) continue
    
    // Add two slots per hour (on the hour and half past)
    for (let minute of [0, 30]) {
      // Format time string
      const timeString = `${hour > 12 ? hour - 12 : hour}:${minute === 0 ? '00' : minute} ${hour >= 12 ? 'PM' : 'AM'}`
      
      // Randomly determine availability (more likely to be available for future dates)
      const today = new Date().toISOString().split('T')[0]
      const isToday = date === today
      const availabilityChance = isToday ? 0.6 : 0.9
      const isAvailable = Math.random() < availabilityChance
      
      // Recommend afternoon slots (3-4 PM) as they typically have shorter wait times
      const isRecommended = hour >= 15 && hour <= 16 && isAvailable
      
      slots.push({
        id: slotId++,
        centerId,
        date,
        time: timeString,
        available: isAvailable,
        recommended: isRecommended
      })
    }
  }
  
  return slots
}

// GET available time slots
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const centerIdParam = searchParams.get('centerId')
    
    if (!date || !centerIdParam) {
      return NextResponse.json(
        { error: 'Date and centerId are required' },
        { status: 400 }
      )
    }
    
    const centerId = parseInt(centerIdParam)
    const slots = generateTimeSlots(date, centerId)
    
    return NextResponse.json({ slots }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching time slots:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch time slots' },
      { status: 500 }
    )
  }
}
