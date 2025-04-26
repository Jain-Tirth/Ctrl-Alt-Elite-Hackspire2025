"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Clock,
  Users,
  Building,
  Calendar,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle2
} from "lucide-react"
import { Notification, NotificationContainer } from "@/components/ui/notification"
import { SimulationPanel } from "@/components/simulation-panel"
import { mockServiceCenters } from "@/lib/queue-models"
import { useServiceCenters, useAnomalies } from "@/hooks/useAbly"
import * as AblyUtils from "@/lib/ably"

// Initialize with mock data, will be updated with real-time data
const initialServiceCenters = mockServiceCenters

export default function QueueStatusPage() {
  // Use the Ably hook to get real-time service center updates
  const realtimeCenters = useServiceCenters(initialServiceCenters)
  const [centers, setCenters] = useState(initialServiceCenters)
  const [loading, setLoading] = useState(false)
  const [selectedCenter, setSelectedCenter] = useState(1)
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: any }[]>([])
  const [ablyConnected, setAblyConnected] = useState(false)

  // Get real-time anomalies
  const anomalies = useAnomalies()

  // Update centers when real-time data changes
  useEffect(() => {
    if (realtimeCenters.length > 0) {
      setCenters(realtimeCenters)
      setAblyConnected(true)
    }
  }, [realtimeCenters])

  // Fallback to client-side simulation if Ably isn't connected after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!ablyConnected) {
        console.log('Ably not connected, using client-side simulation')
        // Start auto-simulation
        toggleAutoSimulation(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ablyConnected])

  // Show notifications for anomalies
  useEffect(() => {
    if (anomalies.length > 0) {
      const latestAnomaly = anomalies[anomalies.length - 1]

      setNotifications(prev => [
        ...prev,
        {
          id: `anomaly-${Date.now()}`,
          message: latestAnomaly.description,
          type: latestAnomaly.severity === 'high' ? 'error' :
                latestAnomaly.severity === 'medium' ? 'warning' : 'info'
        }
      ])
    }
  }, [anomalies])

  // Initialize Ably when component mounts
  useEffect(() => {
    AblyUtils.initAbly()
  }, [])

  // Auto-simulation interval reference
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null)

  // Function to simulate real-time updates
  const simulateUpdates = async () => {
    setLoading(true)

    try {
      // Call the simulation API endpoint
      const response = await fetch('/api/queue/simulate', {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to simulate updates')
      }

      // Check if we got data directly from the API (when using demo key)
      const data = await response.json()

      if (data.updated && data.updated.centers) {
        console.log('Using data directly from API response')
        setCenters(data.updated.centers)

        // Handle anomaly if present
        if (data.updated.anomalyGenerated && data.updated.anomaly) {
          setNotifications(prev => [
            ...prev,
            {
              id: `anomaly-${Date.now()}`,
              message: data.updated.anomaly.description,
              type: data.updated.anomaly.severity === 'high' ? 'error' :
                    data.updated.anomaly.severity === 'medium' ? 'warning' : 'info'
            }
          ])
        }
      }
      // Otherwise, Ably will handle the updates
    } catch (error) {
      console.error('Error simulating updates:', error)

      // Fallback to client-side simulation if API fails
      const updatedCenters = centers.map(center => ({
        ...center,
        waitTime: Math.max(1, center.waitTime + Math.floor(Math.random() * 7) - 3),
        peopleInQueue: Math.max(0, center.peopleInQueue + Math.floor(Math.random() * 5) - 2),
        lastUpdated: "Just now"
      }))

      setCenters(updatedCenters)

      try {
        // Try to publish updates to Ably
        await AblyUtils.updateAllServiceCenters(updatedCenters)
      } catch (ablyError) {
        console.error('Error publishing to Ably:', ablyError)
      }
    } finally {
      setLoading(false)
    }
  }

  // Function to refresh data (manual refresh button)
  const refreshData = () => {
    simulateUpdates()
  }

  // Toggle auto-simulation
  const toggleAutoSimulation = (isActive: boolean) => {
    if (isActive) {
      // Start auto-simulation
      const interval = setInterval(simulateUpdates, 10000) // Simulate every 10 seconds
      setSimulationInterval(interval)
    } else {
      // Stop auto-simulation
      if (simulationInterval) {
        clearInterval(simulationInterval)
        setSimulationInterval(null)
      }
    }
  }

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval)
      }
    }
  }, [simulationInterval])

  // Remove notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
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

  // Get status icon based on wait time
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "quiet": return <CheckCircle2 className="h-5 w-5 text-green-400" />
      case "moderate": return <Clock className="h-5 w-5 text-yellow-400" />
      case "busy": return <AlertTriangle className="h-5 w-5 text-red-400" />
      default: return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  // Get the selected center
  const center = centers.find(c => c.id === selectedCenter) || centers[0]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Notification container for real-time alerts */}
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />

      {/* Simulation panel for demo purposes */}
      <SimulationPanel
        onSimulate={simulateUpdates}
        onToggleAutoSimulation={toggleAutoSimulation}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Sidebar with service centers */}
            <div className="w-full md:w-1/3 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Service Centers</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={refreshData}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              <div className="space-y-4">
                {centers.map(center => (
                  <div
                    key={center.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedCenter === center.id
                        ? 'bg-gray-700/50 border border-gray-600'
                        : 'bg-gray-800/50 hover:bg-gray-700/30 border border-transparent'
                    }`}
                    onClick={() => setSelectedCenter(center.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{center.name}</h3>
                      <div className={`flex items-center ${getStatusColor(center.status)}`}>
                        {getStatusIcon(center.status)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{center.address}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Wait: <span className="text-white font-medium">{center.waitTime} min</span></span>
                      <span className="text-gray-400">Queue: <span className="text-white font-medium">{center.peopleInQueue}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main content with detailed queue status */}
            <div className="w-full md:w-2/3 space-y-6">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">{center.name}</h1>
                    <p className="text-gray-400">{center.address}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">Updated {center.lastUpdated}</span>
                    {getStatusIcon(center.status)}
                  </div>
                </div>

                {/* Your Position in Queue - New Section */}
                <div className="bg-blue-900/30 border border-blue-700/30 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-blue-400 mr-2" />
                      <h3 className="font-semibold text-blue-300">Your Position in Queue</h3>
                    </div>
                    <div className="bg-blue-500/20 px-3 py-1 rounded-full">
                      <span className="text-blue-300 text-sm font-medium">Active</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                      <div className="text-5xl font-bold text-white">7</div>
                      <div className="text-gray-400 mt-1">in line</div>
                    </div>

                    <div className="h-12 border-l border-blue-700/50 mx-6 hidden md:block"></div>

                    <div className="text-center md:text-left mb-4 md:mb-0">
                      <div className="text-3xl font-bold text-white">{center.waitTime}</div>
                      <div className="text-gray-400 mt-1">minutes wait</div>
                    </div>

                    <div className="h-12 border-l border-blue-700/50 mx-6 hidden md:block"></div>

                    <div className="text-center md:text-left">
                      <div className="text-3xl font-bold text-white">4</div>
                      <div className="text-gray-400 mt-1">active counters</div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center md:justify-end">
                    <Button className="bg-red-500 hover:bg-red-600 text-white font-medium">
                      Leave Queue
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Current Wait Time */}
                  <div className="bg-gray-800/50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <Clock className="h-5 w-5 text-yellow-300 mr-2" />
                      <h3 className="font-semibold">Current Wait Time</h3>
                    </div>
                    <div className="flex items-end">
                      <span className="text-4xl font-bold text-white">{center.waitTime}</span>
                      <span className="text-gray-400 ml-2 mb-1">minutes</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      Estimated time before your turn
                    </p>
                  </div>

                  {/* People in Queue */}
                  <div className="bg-gray-800/50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <Users className="h-5 w-5 text-yellow-300 mr-2" />
                      <h3 className="font-semibold">People in Queue</h3>
                    </div>
                    <div className="flex items-end">
                      <span className="text-4xl font-bold text-white">{center.peopleInQueue}</span>
                      <span className="text-gray-400 ml-2 mb-1">people</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                      <div
                        className={`h-2 rounded-full ${
                          center.status === 'quiet' ? 'bg-green-400' :
                          center.status === 'moderate' ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{width: `${Math.min(100, (center.peopleInQueue / 40) * 100)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Join Queue Button - New Section */}
                <div className="bg-gray-800/50 p-6 rounded-lg mb-6">
                  <div className="flex flex-col items-center">
                    <h3 className="font-semibold text-xl mb-3">Not in queue yet?</h3>
                    <p className="text-gray-400 text-center mb-4">
                      Join the virtual queue and we'll notify you when it's almost your turn.
                    </p>
                    <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 text-lg">
                      Join Queue Now
                    </Button>
                  </div>
                </div>

                {/* Next Available Slots */}
                <div className="bg-gray-800/50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-yellow-300 mr-2" />
                    <h3 className="font-semibold">Next Available Slots</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                      <div className="text-lg font-semibold">{center.nextAvailable}</div>
                      <div className="text-sm text-green-400 mt-1">Available</div>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                      <div className="text-lg font-semibold">Today, 3:45 PM</div>
                      <div className="text-sm text-green-400 mt-1">Available</div>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                      <div className="text-lg font-semibold">Today, 4:30 PM</div>
                      <div className="text-sm text-green-400 mt-1">Available</div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Link href="/book-slot">
                      <Button className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold">
                        Book a Time Slot
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Prediction and Recommendations */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-xl font-bold mb-4">AI Recommendations</h3>

                <div className="space-y-4">
                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-400 mb-2">Wait Time Prediction</h4>
                    <p className="text-gray-300">
                      Based on historical data, wait times at {center.name} are typically lower after 3:00 PM on weekdays.
                    </p>
                  </div>

                  <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                    <h4 className="font-semibold text-green-400 mb-2">Alternative Location</h4>
                    <p className="text-gray-300">
                      Eastside Branch currently has a shorter wait time (10 minutes). Consider visiting this location instead.
                    </p>
                    <Button
                      variant="link"
                      className="text-green-400 hover:text-green-300 p-0 mt-2"
                      onClick={() => setSelectedCenter(3)}
                    >
                      View Eastside Branch
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
