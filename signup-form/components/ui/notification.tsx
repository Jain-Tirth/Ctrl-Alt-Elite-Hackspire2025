"use client"

import { useState, useEffect } from "react"
import { X, AlertTriangle, Info, CheckCircle } from "lucide-react"

interface NotificationProps {
  message: string
  type?: "info" | "warning" | "error" | "success"
  duration?: number
  onClose?: () => void
}

export function Notification({
  message,
  type = "info",
  duration = 5000,
  onClose
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, duration)
    
    return () => clearTimeout(timer)
  }, [duration, onClose])
  
  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }
  
  if (!isVisible) return null
  
  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-400" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      default:
        return <Info className="h-5 w-5 text-blue-400" />
    }
  }
  
  const getBackgroundColor = () => {
    switch (type) {
      case "warning":
        return "bg-yellow-900/20 border-yellow-700/30"
      case "error":
        return "bg-red-900/20 border-red-700/30"
      case "success":
        return "bg-green-900/20 border-green-700/30"
      default:
        return "bg-blue-900/20 border-blue-700/30"
    }
  }
  
  const getTextColor = () => {
    switch (type) {
      case "warning":
        return "text-yellow-400"
      case "error":
        return "text-red-400"
      case "success":
        return "text-green-400"
      default:
        return "text-blue-400"
    }
  }
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-md p-4 rounded-lg border ${getBackgroundColor()} shadow-lg animate-fade-in`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${getTextColor()}`}>
            {message}
          </p>
        </div>
        <button
          type="button"
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-300"
          onClick={handleClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

interface NotificationContainerProps {
  notifications: { id: string; message: string; type: "info" | "warning" | "error" | "success" }[]
  onClose: (id: string) => void
}

export function NotificationContainer({
  notifications,
  onClose
}: NotificationContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-4">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => onClose(notification.id)}
        />
      ))}
    </div>
  )
}
