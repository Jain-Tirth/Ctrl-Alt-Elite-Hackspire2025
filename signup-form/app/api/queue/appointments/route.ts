import { NextResponse } from 'next/server'
import { Appointment } from '@/lib/queue-models'

// Mock appointments database
const mockAppointments: Appointment[] = [
  {
    id: 1,
    userId: "demo123",
    centerId: 1,
    date: new Date().toISOString().split('T')[0], // Today's date
    time: "14:30",
    status: "confirmed",
    purpose: "General inquiry",
    createdAt: new Date(Date.now() - 86400000).toISOString() // Yesterday
  }
];

// GET appointments for a user
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
    
    const userAppointments = mockAppointments.filter(
      appointment => appointment.userId === userId
    )
    
    return NextResponse.json({ appointments: userAppointments }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

// POST a new appointment
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.userId || !data.centerId || !data.date || !data.time || !data.purpose) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create a new appointment
    const newAppointment: Appointment = {
      id: mockAppointments.length + 1,
      userId: data.userId,
      centerId: data.centerId,
      date: data.date,
      time: data.time,
      status: "confirmed",
      purpose: data.purpose,
      createdAt: new Date().toISOString()
    }
    
    // Add to mock database
    mockAppointments.push(newAppointment)
    
    return NextResponse.json({ appointment: newAppointment }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create appointment' },
      { status: 500 }
    )
  }
}
