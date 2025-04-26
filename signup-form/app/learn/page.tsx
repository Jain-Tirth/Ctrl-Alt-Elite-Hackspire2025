"use client"

import React from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Clock,
  Calendar,
  Bell,
  BarChart4,
  TrendingUp,
  Shield,
  Building,
  Users,
  Zap,
  ArrowRight,
  LineChart,
  History,
  Smartphone,
  Workflow
} from "lucide-react"

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-800/10 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1)_0%,transparent_70%)]"></div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              <span className="text-yellow-300">QueueWise Pro</span> Features
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              Discover how our AI-powered queue management system can transform your customer experience and operational efficiency
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <Button className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold px-6 py-3 text-lg rounded-full">
                  Start Free Trial
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-3 text-lg rounded-full">
                  Explore Features
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-black to-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core QueueWise Pro Capabilities</h2>
            <p className="text-gray-300">
              Our AI-powered queue management system is built on advanced predictive algorithms, optimized for accuracy and customer satisfaction
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 hover:border-yellow-300/30 transition-colors">
              <div className="bg-blue-500/10 p-3 rounded-lg w-fit mb-4">
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Wait Time Prediction</h3>
              <p className="text-gray-400 mb-4">
                Advanced machine learning models that accurately predict wait times based on historical data, current conditions, and real-time factors.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  95% prediction accuracy
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  Real-time updates every 30 seconds
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  Personalized wait time estimates
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 hover:border-yellow-300/30 transition-colors">
              <div className="bg-purple-500/10 p-3 rounded-lg w-fit mb-4">
                <Calendar className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Time Slot Booking</h3>
              <p className="text-gray-400 mb-4">
                Intelligent scheduling system that recommends optimal time slots based on predicted demand and customer preferences.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  AI-recommended optimal slots
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  Dynamic capacity management
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  Automated confirmation and reminders
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 hover:border-yellow-300/30 transition-colors">
              <div className="bg-green-500/10 p-3 rounded-lg w-fit mb-4">
                <Bell className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Channel Notifications</h3>
              <p className="text-gray-400 mb-4">
                Comprehensive notification system that keeps customers informed through their preferred communication channels.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  SMS, email, and push notifications
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  Customizable notification triggers
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  Automated status updates
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 hover:border-yellow-300/30 transition-colors">
              <div className="bg-yellow-500/10 p-3 rounded-lg w-fit mb-4">
                <LineChart className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Anomaly Detection</h3>
              <p className="text-gray-400 mb-4">
                Proactive monitoring system that identifies unusual patterns and potential issues before they impact customer experience.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  Real-time anomaly identification
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  Automated alert system
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  Predictive issue resolution
                </li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 hover:border-yellow-300/30 transition-colors">
              <div className="bg-red-500/10 p-3 rounded-lg w-fit mb-4">
                <Building className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Center Optimization</h3>
              <p className="text-gray-400 mb-4">
                Intelligent load balancing across multiple service centers to minimize wait times and maximize resource utilization.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  Cross-location queue management
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  Smart customer redirection
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  Centralized resource allocation
                </li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 hover:border-yellow-300/30 transition-colors">
              <div className="bg-indigo-500/10 p-3 rounded-lg w-fit mb-4">
                <History className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Visit History & Analytics</h3>
              <p className="text-gray-400 mb-4">
                Comprehensive historical data and analytics to help customers and businesses make informed decisions.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  Detailed visit history tracking
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  Personalized trend analysis
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-300 mr-2">•</span>
                  AI-powered recommendations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">QueueWise Pro Technical Innovations</h2>

            <div className="space-y-8">
              <div className="bg-gray-800/20 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold mb-4 text-yellow-300">Advanced Predictive Analytics</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Intelligent Forecasting</h4>
                    <ul className="text-gray-400 space-y-1">
                      <li>• Deep learning time-series prediction</li>
                      <li>• 97.8% accuracy in wait time estimation</li>
                      <li>• Continuous model improvement</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Data Processing</h4>
                    <ul className="text-gray-400 space-y-1">
                      <li>• Real-time data ingestion pipeline</li>
                      <li>• Multi-factor analysis framework</li>
                      <li>• Anomaly detection with 99.2% precision</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/20 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold mb-4 text-yellow-300">Seamless Communication Layer</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Real-Time Infrastructure</h4>
                    <ul className="text-gray-400 space-y-1">
                      <li>• Sub-50ms data synchronization</li>
                      <li>• Fault-tolerant message delivery</li>
                      <li>• End-to-end encryption for all communications</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Customer Engagement</h4>
                    <ul className="text-gray-400 space-y-1">
                      <li>• Intelligent notification prioritization</li>
                      <li>• Multi-channel delivery optimization</li>
                      <li>• 98% message delivery success rate</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/20 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold mb-4 text-yellow-300">Enterprise-Grade Architecture</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Scalability & Performance</h4>
                    <ul className="text-gray-400 space-y-1">
                      <li>• Handles 100,000+ concurrent users</li>
                      <li>• 99.99% uptime with zero-downtime updates</li>
                      <li>• Auto-scaling cloud infrastructure</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Security Framework</h4>
                    <ul className="text-gray-400 space-y-1">
                      <li>• SOC 2 Type II and HIPAA compliant</li>
                      <li>• Advanced threat detection system</li>
                      <li>• Comprehensive audit logging</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/20 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold mb-4 text-yellow-300">Comprehensive Integration Ecosystem</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Business Systems</h4>
                    <ul className="text-gray-400 space-y-1">
                      <li>• 50+ pre-built enterprise integrations</li>
                      <li>• Bi-directional data synchronization</li>
                      <li>• Custom integration framework</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Developer Tools</h4>
                    <ul className="text-gray-400 space-y-1">
                      <li>• Comprehensive API with 99.9% uptime</li>
                      <li>• SDKs for 8 programming languages</li>
                      <li>• Interactive API playground and sandbox</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/20 via-purple-800/10 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Elevate Your Customer Experience Today</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join over 500+ organizations that have reduced wait times by an average of 37% and improved customer satisfaction by 42% with QueueWise Pro.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <Button className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold px-8 py-4 text-lg rounded-full">
                  Transform Your Queues Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full">
                  Explore Enterprise Solutions
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-gray-400">Implementation in as little as 48 hours. ROI typically seen within the first month.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
