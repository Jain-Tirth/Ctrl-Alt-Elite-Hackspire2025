"use client"

import { useState } from "react"
import { 
  Bell, 
  BellOff, 
  Clock, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone, 
  Mail, 
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

export default function NotificationsPage() {
  // Notification settings state
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    pushEnabled: true,
    emailEnabled: false,
    smsEnabled: true,
    
    // Notification types
    queueUpdates: true,
    waitTimeChanges: true,
    counterChanges: true,
    almostYourTurn: true,
    
    // Timing settings
    notifyMinutesBefore: 10,
  })

  // Toggle a boolean setting
  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }

  // Update notification minutes
  const updateNotifyMinutes = (value: number[]) => {
    setSettings(prev => ({
      ...prev,
      notifyMinutesBefore: value[0]
    }))
  }

  // Example notifications
  const exampleNotifications = [
    {
      id: 1,
      title: "Your turn is coming up",
      message: "You're 3rd in line. Estimated wait: 5 minutes.",
      time: "2 minutes ago",
      type: "info"
    },
    {
      id: 2,
      title: "Counter 3 is now closed",
      message: "Your estimated wait time has been updated.",
      time: "15 minutes ago",
      type: "warning"
    },
    {
      id: 3,
      title: "You're next in line",
      message: "Please proceed to Counter 2 when called.",
      time: "Yesterday, 3:45 PM",
      type: "success"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <Link href="/queue-status">
              <Button variant="ghost" className="mr-4 p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Notification Settings</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main settings panel */}
            <div className="md:col-span-2 space-y-6">
              {/* Master toggle */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {settings.notificationsEnabled ? (
                      <Bell className="h-6 w-6 text-yellow-300 mr-3" />
                    ) : (
                      <BellOff className="h-6 w-6 text-gray-500 mr-3" />
                    )}
                    <div>
                      <h2 className="text-xl font-semibold">Notifications</h2>
                      <p className="text-gray-400 text-sm mt-1">
                        {settings.notificationsEnabled 
                          ? "You will receive alerts about your queue status" 
                          : "All notifications are currently disabled"}
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.notificationsEnabled} 
                    onCheckedChange={() => toggleSetting('notificationsEnabled')}
                  />
                </div>
              </div>

              {/* Notification channels */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold mb-4">Notification Channels</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <Smartphone className="h-5 w-5 text-blue-400 mr-3" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-gray-400 text-sm">Receive alerts on your device</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.pushEnabled} 
                      onCheckedChange={() => toggleSetting('pushEnabled')}
                      disabled={!settings.notificationsEnabled}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-green-400 mr-3" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-gray-400 text-sm">Receive text messages</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.smsEnabled} 
                      onCheckedChange={() => toggleSetting('smsEnabled')}
                      disabled={!settings.notificationsEnabled}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-purple-400 mr-3" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-gray-400 text-sm">Receive email updates</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.emailEnabled} 
                      onCheckedChange={() => toggleSetting('emailEnabled')}
                      disabled={!settings.notificationsEnabled}
                    />
                  </div>
                </div>
              </div>

              {/* Notification types */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold mb-4">What to Notify Me About</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-yellow-300 mr-3" />
                      <p className="font-medium">Almost Your Turn</p>
                    </div>
                    <Switch 
                      checked={settings.almostYourTurn} 
                      onCheckedChange={() => toggleSetting('almostYourTurn')}
                      disabled={!settings.notificationsEnabled}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-orange-400 mr-3" />
                      <p className="font-medium">Wait Time Changes</p>
                    </div>
                    <Switch 
                      checked={settings.waitTimeChanges} 
                      onCheckedChange={() => toggleSetting('waitTimeChanges')}
                      disabled={!settings.notificationsEnabled}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-3" />
                      <p className="font-medium">Counter Status Changes</p>
                    </div>
                    <Switch 
                      checked={settings.counterChanges} 
                      onCheckedChange={() => toggleSetting('counterChanges')}
                      disabled={!settings.notificationsEnabled}
                    />
                  </div>
                </div>
              </div>

              {/* Timing settings */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold mb-4">Timing Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="font-medium">Notify me before my turn</p>
                      <p className="text-yellow-300 font-medium">{settings.notifyMinutesBefore} minutes</p>
                    </div>
                    <Slider 
                      defaultValue={[settings.notifyMinutesBefore]} 
                      max={30}
                      min={1}
                      step={1}
                      onValueChange={updateNotifyMinutes}
                      disabled={!settings.notificationsEnabled || !settings.almostYourTurn}
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      You'll receive a notification when you're approximately {settings.notifyMinutesBefore} minutes away from being called.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Example notifications panel */}
            <div className="space-y-6">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold mb-4">Example Notifications</h3>
                
                <div className="space-y-4">
                  {exampleNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-4 rounded-lg border ${
                        notification.type === 'info' ? 'bg-blue-900/20 border-blue-700/30' :
                        notification.type === 'warning' ? 'bg-orange-900/20 border-orange-700/30' :
                        'bg-green-900/20 border-green-700/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-gray-400">{notification.time}</span>
                      </div>
                      <p className="text-sm text-gray-300">{notification.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold mb-4">About Notifications</h3>
                <p className="text-gray-300 text-sm">
                  QueueWise Pro uses AI to predict wait times and determine the optimal time to send you notifications.
                  Our system adapts to changing conditions to ensure you're always informed at the right time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
