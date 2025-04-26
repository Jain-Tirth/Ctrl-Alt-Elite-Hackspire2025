"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">QueueWise Pro API Documentation</h1>
          <p className="text-gray-400 mb-8">
            Integrate with our AI-powered queue management system using these API endpoints.
          </p>
          
          <div className="space-y-8">
            {/* Service Centers */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h2 className="text-xl font-bold mb-4">Service Centers</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded mr-2">GET</span>
                    <code className="text-yellow-300">/api/queue/centers</code>
                  </div>
                  <p className="text-gray-400 mb-2">Get all service centers</p>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {`// Response
{
  "centers": [
    {
      "id": 1,
      "name": "Downtown Service Center",
      "address": "123 Main St, Downtown",
      "waitTime": 24,
      "peopleInQueue": 18,
      "status": "moderate",
      "lastUpdated": "2 min ago",
      "nextAvailable": "Today, 2:30 PM"
    },
    ...
  ]
}`}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <span className="bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded mr-2">GET</span>
                    <code className="text-yellow-300">/api/queue/centers/{'{id}'}</code>
                  </div>
                  <p className="text-gray-400 mb-2">Get a specific service center by ID</p>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {`// Response
{
  "center": {
    "id": 1,
    "name": "Downtown Service Center",
    "address": "123 Main St, Downtown",
    "waitTime": 24,
    "peopleInQueue": 18,
    "status": "moderate",
    "lastUpdated": "Just now",
    "nextAvailable": "Today, 2:30 PM"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Queue Statistics */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h2 className="text-xl font-bold mb-4">Queue Statistics</h2>
              
              <div>
                <div className="flex items-center mb-2">
                  <span className="bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded mr-2">GET</span>
                  <code className="text-yellow-300">/api/queue/stats</code>
                </div>
                <p className="text-gray-400 mb-2">Get queue statistics</p>
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    {`// Response
{
  "stats": {
    "averageWaitTime": 26,
    "totalVisitors": 142,
    "waitTimeChange": 12,
    "visitorChange": 5
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
            
            {/* Wait Time Prediction */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h2 className="text-xl font-bold mb-4">Wait Time Prediction</h2>
              
              <div>
                <div className="flex items-center mb-2">
                  <span className="bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded mr-2">GET</span>
                  <code className="text-yellow-300">/api/queue/predict?centerId={'{centerId}'}</code>
                </div>
                <p className="text-gray-400 mb-2">Get wait time prediction for a specific center</p>
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    {`// Response
{
  "prediction": {
    "centerId": 1,
    "currentWaitTime": 24,
    "predictedWaitTime": 18,
    "confidence": 0.85,
    "factors": {
      "timeOfDay": 0.3,
      "dayOfWeek": 0.2,
      "staffingLevel": 0.8,
      "queueLength": 0.6,
      "averageServiceTime": 0.5
    }
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
            
            {/* Anomaly Detection */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h2 className="text-xl font-bold mb-4">Anomaly Detection</h2>
              
              <div>
                <div className="flex items-center mb-2">
                  <span className="bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded mr-2">GET</span>
                  <code className="text-yellow-300">/api/queue/anomalies</code>
                </div>
                <p className="text-gray-400 mb-2">Get detected anomalies</p>
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    {`// Response
{
  "anomalies": [
    {
      "centerId": 1,
      "type": "wait_time_spike",
      "severity": "medium",
      "description": "Unusual increase in wait times at Downtown Service Center",
      "detectedAt": "2023-10-20T15:30:45.123Z",
      "recommendation": "Consider visiting Eastside Branch which currently has shorter wait times"
    },
    ...
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
            
            {/* Time Slots */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h2 className="text-xl font-bold mb-4">Time Slots</h2>
              
              <div>
                <div className="flex items-center mb-2">
                  <span className="bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded mr-2">GET</span>
                  <code className="text-yellow-300">/api/queue/slots?date={'{date}'}&centerId={'{centerId}'}</code>
                </div>
                <p className="text-gray-400 mb-2">Get available time slots for a specific date and center</p>
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    {`// Response
{
  "slots": [
    {
      "id": 1,
      "centerId": 1,
      "date": "2023-10-20",
      "time": "9:00 AM",
      "available": true,
      "recommended": false
    },
    {
      "id": 2,
      "centerId": 1,
      "date": "2023-10-20",
      "time": "9:30 AM",
      "available": true,
      "recommended": false
    },
    ...
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
            
            {/* Appointments */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h2 className="text-xl font-bold mb-4">Appointments</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded mr-2">GET</span>
                    <code className="text-yellow-300">/api/queue/appointments?userId={'{userId}'}</code>
                  </div>
                  <p className="text-gray-400 mb-2">Get appointments for a specific user</p>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {`// Response
{
  "appointments": [
    {
      "id": 1,
      "userId": "demo123",
      "centerId": 1,
      "date": "2023-10-20",
      "time": "14:30",
      "status": "confirmed",
      "purpose": "General inquiry",
      "createdAt": "2023-10-19T15:30:45.123Z"
    },
    ...
  ]
}`}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <span className="bg-blue-900/50 text-blue-400 text-xs px-2 py-1 rounded mr-2">POST</span>
                    <code className="text-yellow-300">/api/queue/appointments</code>
                  </div>
                  <p className="text-gray-400 mb-2">Create a new appointment</p>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {`// Request
{
  "userId": "demo123",
  "centerId": 1,
  "date": "2023-10-20",
  "time": "14:30",
  "purpose": "General inquiry"
}

// Response
{
  "appointment": {
    "id": 2,
    "userId": "demo123",
    "centerId": 1,
    "date": "2023-10-20",
    "time": "14:30",
    "status": "confirmed",
    "purpose": "General inquiry",
    "createdAt": "2023-10-20T10:15:30.456Z"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Personalized Recommendations */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h2 className="text-xl font-bold mb-4">Personalized Recommendations</h2>
              
              <div>
                <div className="flex items-center mb-2">
                  <span className="bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded mr-2">GET</span>
                  <code className="text-yellow-300">/api/queue/recommend?userId={'{userId}'}</code>
                </div>
                <p className="text-gray-400 mb-2">Get personalized recommendations for a user</p>
                <div className="bg-gray-900/50 p-3 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    {`// Response
{
  "recommendations": [
    {
      "type": "shortest_wait",
      "centerId": 3,
      "centerName": "Eastside Branch",
      "waitTime": 10,
      "reason": "This center currently has the shortest wait time (10 minutes)."
    },
    {
      "type": "preferred_time",
      "timeRange": {
        "start": "14:00",
        "end": "16:00"
      },
      "reason": "Based on your preferences, visiting between 14:00 and 16:00 today is recommended."
    },
    ...
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
