"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-16">
          <div className="h-12 w-12 rounded-2xl bg-[#FFA970] flex items-center justify-center">
            <span className="text-black font-bold text-xl">RIR</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#FFA970] text-black">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6 text-[#FFA970]">
            Master the Art of Smart Investing
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Join our experts as they reveal insider tips to help you invest confidently,
            navigate market trends, and secure a brighter financial future.
          </p>
          <Link href="/signup">
            <Button className="bg-[#FFA970] text-black font-semibold px-8 py-6 text-lg">
              SAVE YOUR SPOT
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Smart Investing</h3>
            <p className="text-gray-400">Learn proven strategies to maximize your returns while minimizing risks.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
            <p className="text-gray-400">Get insights from industry professionals with years of experience.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
            <p className="text-gray-400">Your data is protected with enterprise-grade security measures.</p>
          </div>
        </div>

        <div className="text-center text-gray-400">
          © 2024 RIR Investments. All rights reserved.
        </div>
      </div>
    </div>
  )
}
