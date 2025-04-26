"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Building,
  AlertTriangle
} from "lucide-react"

// Mock data for service centers
const serviceCenters = [
  {
    id: 1,
    name: "Downtown Service Center",
    address: "123 Main St, Downtown",
    waitTime: 24,
    peopleInQueue: 18,
    status: "moderate"
  },
  {
    id: 2,
    name: "Westside Branch",
    address: "456 West Ave, Westside",
    waitTime: 45,
    peopleInQueue: 32,
    status: "busy"
  },
  {
    id: 3,
    name: "Eastside Branch",
    address: "789 East Blvd, Eastside",
    waitTime: 10,
    peopleInQueue: 5,
    status: "quiet"
  }
]

// Mock data for available time slots
const generateTimeSlots = (date: Date) => {
  const day = date.getDate()
  const slots = []
  
  // Generate slots from 9 AM to 5 PM
  for (let hour = 9; hour <= 17; hour++) {
    // Skip lunch hour
    if (hour === 12) continue
    
    // Add two slots per hour (on the hour and half past)
    for (let minute of [0, 30]) {
      // Randomly determine availability (more likely to be available for future dates)
      const dayDiff = Math.floor((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      const availabilityChance = Math.min(0.9, 0.5 + (dayDiff * 0.1))
      const isAvailable = Math.random() < availabilityChance
      
      slots.push({
        time: `${hour > 12 ? hour - 12 : hour}:${minute === 0 ? '00' : minute} ${hour >= 12 ? 'PM' : 'AM'}`,
        available: isAvailable,
        recommended: hour >= 15 && hour <= 16 && isAvailable // Recommend afternoon slots
      })
    }
  }
  
  return slots
}

export default function BookSlotPage() {
  const [selectedCenter, setSelectedCenter] = useState(serviceCenters[0])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [bookingStep, setBookingStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: ""
  })
  const [bookingComplete, setBookingComplete] = useState(false)
  
  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date
  })
  
  // Get time slots for selected date
  const timeSlots = generateTimeSlots(selectedDate)
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setBookingComplete(true)
  }
  
  // Get status color based on wait time
  const getStatusColor = (status: string) => {
    switch(status) {
      case "quiet": return "text-green-400"
      case "moderate": return "text-yellow-400"
      case "busy": return "text-red-400"
      default: return "text-gray-400"
    }
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {bookingComplete ? (
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
              <p className="text-xl text-gray-300 mb-6">
                Your appointment has been scheduled for:
              </p>
              <div className="bg-gray-700/50 p-6 rounded-lg max-w-md mx-auto mb-8">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-5 w-5 text-yellow-300 mr-2" />
                  <span className="text-lg">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-yellow-300 mr-2" />
                  <span className="text-lg">{selectedSlot}</span>
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-yellow-300 mr-2" />
                  <span className="text-lg">{selectedCenter.name}</span>
                </div>
              </div>
              <p className="text-gray-400 mb-8">
                A confirmation email has been sent to {formData.email}. Please arrive 5 minutes before your scheduled time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/queue-status">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    View Queue Status
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Booking Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      bookingStep >= 1 ? 'bg-yellow-300 text-black' : 'bg-gray-700 text-gray-400'
                    } font-semibold`}>
                      1
                    </div>
                    <div className={`h-1 w-12 ${
                      bookingStep >= 2 ? 'bg-yellow-300' : 'bg-gray-700'
                    }`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      bookingStep >= 2 ? 'bg-yellow-300 text-black' : 'bg-gray-700 text-gray-400'
                    } font-semibold`}>
                      2
                    </div>
                    <div className={`h-1 w-12 ${
                      bookingStep >= 3 ? 'bg-yellow-300' : 'bg-gray-700'
                    }`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      bookingStep >= 3 ? 'bg-yellow-300 text-black' : 'bg-gray-700 text-gray-400'
                    } font-semibold`}>
                      3
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Step {bookingStep} of 3
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className={bookingStep >= 1 ? 'text-white' : 'text-gray-500'}>Select Location</span>
                  <span className={bookingStep >= 2 ? 'text-white' : 'text-gray-500'}>Choose Time</span>
                  <span className={bookingStep >= 3 ? 'text-white' : 'text-gray-500'}>Your Details</span>
                </div>
              </div>
              
              {bookingStep === 1 && (
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                  <h1 className="text-2xl font-bold mb-6">Select Service Center</h1>
                  
                  <div className="space-y-4 mb-8">
                    {serviceCenters.map(center => (
                      <div 
                        key={center.id}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedCenter.id === center.id 
                            ? 'bg-gray-700/50 border border-yellow-300/50' 
                            : 'bg-gray-800/50 hover:bg-gray-700/30 border border-transparent'
                        }`}
                        onClick={() => setSelectedCenter(center)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-1">
                              <Building className="h-4 w-4 text-yellow-300 mr-2" />
                              <h3 className="font-semibold">{center.name}</h3>
                            </div>
                            <p className="text-sm text-gray-400 mb-3">{center.address}</p>
                            
                            <div className="flex space-x-4 text-sm">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                <span>Wait: <span className="font-medium">{center.waitTime} min</span></span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 text-gray-400 mr-1" />
                                <span>Queue: <span className="font-medium">{center.peopleInQueue}</span></span>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`flex items-center ${getStatusColor(center.status)}`}>
                            {center.status === 'quiet' ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : center.status === 'busy' ? (
                              <AlertTriangle className="h-5 w-5" />
                            ) : (
                              <Clock className="h-5 w-5" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold"
                      onClick={() => setBookingStep(2)}
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {bookingStep === 2 && (
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Select Date & Time</h1>
                    <div className="text-sm text-gray-400">
                      <span className="font-medium text-white">{selectedCenter.name}</span>
                    </div>
                  </div>
                  
                  {/* Date Selection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Select Date</h3>
                    <div className="flex overflow-x-auto pb-2 space-x-2">
                      {dates.map((date, index) => (
                        <div 
                          key={index}
                          className={`flex-shrink-0 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedDate.toDateString() === date.toDateString() 
                              ? 'bg-yellow-300 text-black' 
                              : 'bg-gray-800 hover:bg-gray-700 text-white'
                          }`}
                          onClick={() => setSelectedDate(date)}
                        >
                          <div className="text-center">
                            <div className="font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div className="text-2xl font-bold">{date.getDate()}</div>
                            <div className="text-xs">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Time Slot Selection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Select Time</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {timeSlots.map((slot, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg text-center cursor-pointer transition-colors ${
                            !slot.available 
                              ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed' 
                              : selectedSlot === slot.time
                                ? 'bg-yellow-300 text-black'
                                : slot.recommended
                                  ? 'bg-green-900/30 border border-green-700/50 hover:bg-green-900/50 text-white'
                                  : 'bg-gray-800 hover:bg-gray-700 text-white'
                          }`}
                          onClick={() => slot.available && setSelectedSlot(slot.time)}
                        >
                          <div className="font-medium">{slot.time}</div>
                          {slot.recommended && slot.available && (
                            <div className="text-xs text-green-400 mt-1">Recommended</div>
                          )}
                          {!slot.available && (
                            <div className="text-xs text-gray-500 mt-1">Unavailable</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      className="border-white/30 text-white hover:bg-white/10"
                      onClick={() => setBookingStep(1)}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold"
                      onClick={() => setBookingStep(3)}
                      disabled={!selectedSlot}
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {bookingStep === 3 && (
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                  <h1 className="text-2xl font-bold mb-6">Your Details</h1>
                  
                  <div className="bg-gray-700/30 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2">Booking Summary</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-400">Service Center:</div>
                      <div>{selectedCenter.name}</div>
                      <div className="text-gray-400">Date:</div>
                      <div>{formatDate(selectedDate)}</div>
                      <div className="text-gray-400">Time:</div>
                      <div>{selectedSlot}</div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300/50 text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300/50 text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300/50 text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="purpose" className="block text-sm font-medium text-gray-300 mb-1">
                        Purpose of Visit
                      </label>
                      <Input
                        id="purpose"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300/50 text-white"
                      />
                    </div>
                    
                    <div className="pt-4 flex justify-between">
                      <Button 
                        type="button"
                        variant="outline" 
                        className="border-white/30 text-white hover:bg-white/10"
                        onClick={() => setBookingStep(2)}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold"
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
