"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  User,
  LogOut,
  Settings,
  Clock,
  Users,
  BarChart4,
  Calendar,
  Building,
  AlertTriangle,
  CheckCircle2,
  Bell
} from "lucide-react"
import { Notification, NotificationContainer } from "@/components/ui/notification"
import { mockQueueStats, mockServiceCenters } from "@/lib/queue-models"
import { useQueueStats, useServiceCenters, useAnomalies, useNotifications } from "@/hooks/useAbly"
import * as AblyUtils from "@/lib/ably"

interface UserData {
  id: string
  name: string
  email: string
  plan: string
  isVerified: boolean
  role: string
  company?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [systemNotifications, setSystemNotifications] = useState<{ id: string; message: string; type: any }[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  // Use Ably hooks for real-time data
  const realtimeStats = useQueueStats(mockQueueStats)
  const realtimeCenters = useServiceCenters(mockServiceCenters)
  const anomalies = useAnomalies()
  const userNotifications = useNotifications(userId || '')

  // State for queue stats
  const [queueStats, setQueueStats] = useState(mockQueueStats)
  const [serviceCenters, setServiceCenters] = useState(mockServiceCenters)

  // Update stats when real-time data changes
  useEffect(() => {
    if (realtimeStats) {
      setQueueStats(realtimeStats)
    }
  }, [realtimeStats])

  // Update centers when real-time data changes
  useEffect(() => {
    if (realtimeCenters.length > 0) {
      setServiceCenters(realtimeCenters)
    }
  }, [realtimeCenters])

  // Show notifications for anomalies
  useEffect(() => {
    if (anomalies.length > 0) {
      const latestAnomaly = anomalies[anomalies.length - 1]

      setSystemNotifications(prev => [
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

  // Handle user notifications
  useEffect(() => {
    if (userNotifications.length > 0) {
      const latestNotification = userNotifications[userNotifications.length - 1]

      setSystemNotifications(prev => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          message: latestNotification.message,
          type: latestNotification.type
        }
      ])
    }
  }, [userNotifications])

  // Initialize Ably when component mounts
  useEffect(() => {
    AblyUtils.initAbly()
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch user data')
        }

        setUser(data.user)

        // Set the user ID for notifications
        if (data.user && data.user.id) {
          setUserId(data.user.id)
        }
      } catch (error: any) {
        console.error('Error fetching user:', error)
        setError(error.message || 'Failed to fetch user data')

        // Redirect to login if not authenticated
        if (error.message === 'Not authenticated') {
          window.location.href = '/login'
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to logout')
      }

      // Redirect to login page
      window.location.href = '/login'
    } catch (error: any) {
      console.error('Logout error:', error)
      setError(error.message || 'Failed to logout')
    }
  }

  // Remove notification
  const removeNotification = (id: string) => {
    setSystemNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  // Simulate sending a test notification via Ably
  const sendTestNotification = async () => {
    if (user && user.id) {
      await AblyUtils.sendNotification(
        user.id,
        'This is a test notification sent via Ably Realtime!',
        'info'
      )

      // Add local notification for demo purposes
      setSystemNotifications(prev => [
        ...prev,
        {
          id: `test-${Date.now()}`,
          message: 'This is a test notification sent via Ably Realtime!',
          type: 'info'
        }
      ])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-300"></div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 max-w-md w-full">
          <p className="text-red-300 font-medium">{error}</p>
        </div>
        <Link href="/login">
          <Button className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold">
            Back to Login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Notification container for real-time alerts */}
      <NotificationContainer
        notifications={systemNotifications}
        onClose={removeNotification}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">QueueWise Pro Dashboard</h1>
              <p className="text-gray-400">Manage your queue and appointments</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={sendTestNotification}
              >
                <Bell className="h-4 w-4 mr-2" />
                Test Notification
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {user && (
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-300/10 p-3 rounded-full">
                  <User className="h-8 w-8 text-yellow-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-gray-400">{user.email}</p>
                  {user.company && <p className="text-gray-400">Company: {user.company}</p>}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="bg-yellow-300/20 text-yellow-300 text-xs px-2 py-1 rounded">
                      {user.plan.toUpperCase()} PLAN
                    </span>
                    {user.isVerified ? (
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                        Verified
                      </span>
                    ) : (
                      <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded">
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Queue Management Dashboard */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Queue Management Dashboard</h3>
              <div className="flex items-center">
                <span className="text-xs text-gray-400 mr-2">Last updated: 5 min ago</span>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {/* Service Centers Overview */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Building className="h-5 w-5 text-yellow-300 mr-2" />
                  <h4 className="font-semibold">Service Centers</h4>
                </div>
                <div className="text-3xl font-bold">3</div>
                <div className="text-sm text-gray-400 mt-1">Active centers</div>
                <Link href="/queue-status" className="text-yellow-300 hover:text-yellow-400 text-sm mt-3 inline-block">
                  View all centers
                </Link>
              </div>

              {/* Average Wait Time */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Clock className="h-5 w-5 text-yellow-300 mr-2" />
                  <h4 className="font-semibold">Average Wait Time</h4>
                </div>
                <div className="text-3xl font-bold">{queueStats.averageWaitTime}</div>
                <div className="text-sm text-gray-400 mt-1">minutes</div>
                <div className={`flex items-center ${queueStats.waitTimeChange > 0 ? 'text-red-400' : 'text-green-400'} text-sm mt-3`}>
                  {queueStats.waitTimeChange > 0 ? (
                    <AlertTriangle className="h-4 w-4 mr-1" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                  )}
                  <span>{Math.abs(queueStats.waitTimeChange)}% {queueStats.waitTimeChange > 0 ? 'higher' : 'lower'} than usual</span>
                </div>
              </div>

              {/* Total Visitors */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Users className="h-5 w-5 text-yellow-300 mr-2" />
                  <h4 className="font-semibold">Total Visitors</h4>
                </div>
                <div className="text-3xl font-bold">{queueStats.totalVisitors}</div>
                <div className="text-sm text-gray-400 mt-1">today</div>
                <div className={`flex items-center ${queueStats.visitorChange > 0 ? 'text-green-400' : 'text-red-400'} text-sm mt-3`}>
                  {queueStats.visitorChange > 0 ? (
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-1" />
                  )}
                  <span>{Math.abs(queueStats.visitorChange)}% {queueStats.visitorChange > 0 ? 'increase' : 'decrease'} from yesterday</span>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-yellow-300 mr-2" />
                  <h4 className="font-semibold">Your Upcoming Appointment</h4>
                </div>
                <Link href="/book-slot">
                  <Button variant="outline" size="sm" className="text-xs h-8 border-gray-600 hover:bg-gray-700">
                    Book New
                  </Button>
                </Link>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold mb-1">Downtown Service Center</div>
                    <div className="text-sm text-gray-400 mb-3">123 Main St, Downtown</div>
                    <div className="flex space-x-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span>Today</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span>2:30 PM</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded">
                    Confirmed
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="font-semibold mb-4">Quick Actions</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/queue-status">
                  <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                    <Clock className="h-4 w-4 mr-2" />
                    Check Queue Status
                  </Button>
                </Link>
                <Link href="/book-slot">
                  <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book a Time Slot
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                    <Building className="h-4 w-4 mr-2" />
                    View Service Centers
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-bold mb-4">Subscription Details</h3>
              {user && (
                <div>
                  <p className="text-gray-300 mb-2">
                    Current Plan: <span className="text-yellow-300 font-semibold">{user.plan.toUpperCase()}</span>
                  </p>
                  <p className="text-gray-300 mb-4">
                    Status: <span className="text-green-400">Active</span>
                  </p>
                  <Link href="/pricing">
                    <Button className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold">
                      Upgrade Plan
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-bold mb-4">AI Insights</h3>
              <div className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Wait Time Prediction</h4>
                  <p className="text-gray-300 text-sm">
                    Based on historical data, wait times are typically 40% lower on Wednesday mornings.
                  </p>
                </div>
                <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-400 mb-2">Anomaly Detected</h4>
                  <p className="text-gray-300 text-sm">
                    Unusual increase in wait times at Downtown Service Center. Consider visiting Eastside Branch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
