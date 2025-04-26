"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    plan: "free"
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred during signup')
      }

      console.log('Signup successful:', data.user)
      // Use window.location for a full page navigation to avoid hydration issues
      window.location.href = '/login'
    } catch (error: any) {
      console.error('Signup error:', error)
      setError(error.message || 'An error occurred during signup')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left side with image */}
        <div className="md:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-800/50 to-transparent z-10"></div>
          <div className="absolute top-10 left-10 z-20">
            <h2 className="text-yellow-300 font-bold text-3xl leading-tight">
              VELO<span className="text-white">AI</span>
            </h2>
          </div>
          <div className="h-full w-full">
            {/* Create abstract background with CSS gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-800 to-black"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.3)_0%,transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.3)_0%,transparent_60%)]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.8)_0%,transparent_40%)]"></div>
          </div>
        </div>

        {/* Right side with form */}
        <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            {/* Form */}
            <div className="w-full space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-yellow-300">Create new Account</h1>
                <p className="mt-2 text-gray-400">
                  Already Registered?{" "}
                  <Link href="/login" className="text-white hover:underline">
                    Log in here.
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 uppercase mb-1">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Jiara Martins"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-black/50 border-2 border-gray-700 text-white placeholder:text-gray-400 rounded-lg py-6"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 uppercase mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="hello@reallygreatsite.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black/50 border-2 border-gray-700 text-white placeholder:text-gray-400 rounded-lg py-6"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 uppercase mb-1">
                      Password
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="******"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-black/50 border-2 border-gray-700 text-white placeholder:text-gray-400 rounded-lg py-6"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 uppercase mb-1">
                      Company (Optional)
                    </label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Your Company Name"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-black/50 border-2 border-gray-700 text-white placeholder:text-gray-400 rounded-lg py-6"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm mt-2">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-semibold py-6 text-lg rounded-full border-2 border-yellow-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing up..." : "Sign up"}
                </Button>
              </form>

              <div className="text-center mt-4">
                <p className="text-gray-400">
                  Already Have Account?{" "}
                  <Link href="/login" className="text-white hover:underline">
                    Login!
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
