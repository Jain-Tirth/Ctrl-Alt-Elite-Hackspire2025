"use client"

import React from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Zap, Code, BarChart4, Shield } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-800/20 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.2)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.2)_0%,transparent_60%)]"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMTExMTEiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMzBjMCAxNi41NjktMTMuNDMxIDMwLTMwIDMwQzEzLjQzMSA2MCAwIDQ2LjU2OSAwIDMwIDAgMTMuNDMxIDEzLjQzMSAwIDMwIDBjMTYuNTY5IDAgMzAgMTMuNDMxIDMwIDMweiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9Ii41Ii8+PHBhdGggZD0iTTYwIDEyLjU2NWMwIDE2LjU2OS0xMy40MzEgMzAtMzAgMzBDMTMuNDMxIDQyLjU2NSAwIDI5LjEzNCAwIDEyLjU2NSAwLTQuMDA0IDEzLjQzMS0xNy40MzUgMzAtMTcuNDM1YzE2LjU2OSAwIDMwIDEzLjQzMSAzMCAzMHoiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIuNSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <div className="mb-4">
                <span className="bg-yellow-300 text-black px-3 py-1 text-sm font-semibold rounded-sm">
                  NEXT-GEN AI PLATFORM
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="text-yellow-300">QueueWise Pro</span> - AI-Powered Queue Management
              </h1>

              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                Eliminate long wait times with our advanced AI queue management system. Predict wait times with high accuracy, get personalized recommendations, and improve visitor experience.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/queue-status">
                  <Button className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold px-6 py-3 text-lg rounded-full w-full sm:w-auto">
                    Check Queue Status
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/book-slot">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-3 text-lg rounded-full w-full sm:w-auto">
                    Book a Time Slot
                  </Button>
                </Link>
                <Link href="/learn">
                  <Button variant="ghost" className="text-white hover:text-yellow-300 px-6 py-3 text-lg rounded-full w-full sm:w-auto">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 relative">
              {/* Queue Status Dashboard */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-2xl p-6 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Queue Status Dashboard</h3>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-xs text-gray-400">Live</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Current Wait Time */}
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Current Wait Time</span>
                      <span className="text-xs text-green-400">Updated 2 min ago</span>
                    </div>
                    <div className="flex items-end">
                      <span className="text-3xl font-bold text-white">24</span>
                      <span className="text-gray-400 ml-2 mb-1">minutes</span>
                    </div>
                  </div>

                  {/* People in Queue */}
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">People in Queue</span>
                      <span className="text-xs text-yellow-400">Moderate</span>
                    </div>
                    <div className="flex items-end">
                      <span className="text-3xl font-bold text-white">18</span>
                      <span className="text-gray-400 ml-2 mb-1">people</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                  </div>

                  {/* Next Available Slot */}
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Next Available Slot</span>
                    </div>
                    <div className="text-xl font-bold text-white">Today, 2:30 PM</div>
                    <div className="text-green-400 text-sm mt-1">Book now to secure this slot</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Advanced Queue Management</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our AI-powered system combines cutting-edge machine learning with practical queue management solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
              <div className="bg-blue-500/20 p-3 rounded-lg w-fit mb-4">
                <BarChart4 className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Wait Time Prediction</h3>
              <p className="text-gray-400">
                Advanced AI algorithms predict wait times with high accuracy based on historical data and real-time conditions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
              <div className="bg-yellow-500/20 p-3 rounded-lg w-fit mb-4">
                <Zap className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Time Slot Recommendation</h3>
              <p className="text-gray-400">
                Get personalized recommendations for the best time slots based on your preferences and current queue conditions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
              <div className="bg-purple-500/20 p-3 rounded-lg w-fit mb-4">
                <Bot className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-Time Adaptation</h3>
              <p className="text-gray-400">
                Our system adapts dynamically to changing conditions, ensuring predictions remain accurate throughout the day.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
              <div className="bg-green-500/20 p-3 rounded-lg w-fit mb-4">
                <Shield className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Anomaly Detection</h3>
              <p className="text-gray-400">
                Automatically detect unusual patterns in queue behavior and receive alerts about potential issues.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
              <div className="bg-red-500/20 p-3 rounded-lg w-fit mb-4">
                <Code className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Center Optimization</h3>
              <p className="text-gray-400">
                Compare wait times across multiple service centers and get recommendations for the most efficient location.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 flex items-center justify-center">
              <Link href="/learn" className="text-yellow-300 hover:text-yellow-400 font-semibold flex items-center">
                Explore All Features
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-800/20 to-black"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to eliminate long wait times?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join hundreds of service centers using QueueWise Pro to improve visitor experience, optimize resource allocation, and boost efficiency.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold px-8 py-4 text-lg rounded-full">
                  Start Your Free Trial
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full">
                  Request Demo
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-gray-400">No credit card required. 30-day free trial for service centers.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
