"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { User, ArrowLeft, Save } from "lucide-react"

interface UserData {
  id: string
  name: string
  email: string
  plan: string
  isVerified: boolean
  role: string
  company?: string
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch user data')
        }

        setUser(data.user)
        setFormData({
          ...formData,
          name: data.user.name,
          email: data.user.email,
          company: data.user.company || ""
        })
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
    setSuccess(null)
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setUser(data.user)
      setSuccess('Profile updated successfully')
    } catch (error: any) {
      console.error('Profile update error:', error)
      setError(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password')
      }

      setSuccess('Password updated successfully')
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error: any) {
      console.error('Password update error:', error)
      setError(error.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !user) {
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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/dashboard" className="mr-4">
              <Button variant="ghost" className="text-white hover:text-yellow-300">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Account Settings</h1>
          </div>

          {success && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
              <p className="text-green-300 font-medium">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-300 font-medium">{error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                {user && (
                  <div className="flex flex-col items-center">
                    <div className="bg-yellow-300/10 p-4 rounded-full mb-4">
                      <User className="h-12 w-12 text-yellow-300" />
                    </div>
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-gray-400 mb-4">{user.email}</p>
                    <div className="flex flex-col items-center gap-2 w-full">
                      <span className="bg-yellow-300/20 text-yellow-300 text-xs px-2 py-1 rounded w-full text-center">
                        {user.plan.toUpperCase()} PLAN
                      </span>
                      {user.isVerified ? (
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded w-full text-center">
                          Verified
                        </span>
                      ) : (
                        <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded w-full text-center">
                          Not Verified
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Profile Settings */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-xl font-bold mb-4">Profile Information</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300/50 text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email (Read Only)
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      readOnly
                      disabled
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-400"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                      Company (Optional)
                    </label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300/50 text-white"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold"
                    disabled={loading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </div>
              
              {/* Password Settings */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-xl font-bold mb-4">Change Password</h3>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                      Current Password
                    </label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300/50 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                      New Password
                    </label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300/50 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300/50 text-white"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
