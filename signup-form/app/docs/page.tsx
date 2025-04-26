"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Code,
  Terminal,
  BookOpen,
  Search,
  ChevronRight,
  Copy,
  ExternalLink
} from "lucide-react"

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-800/10 to-black"></div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-4 text-sm">
              <Link href="/" className="text-gray-400 hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-600" />
              <span className="text-white">Documentation</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              QueueWise Pro Documentation
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Comprehensive guides and resources for implementing and optimizing your queue management system
            </p>

            {/* Search Bar */}
            <div className="relative mb-12">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-300/50 focus:border-yellow-300/50 text-white placeholder-gray-400"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Documentation Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="sticky top-24 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-bold mb-4">Documentation</h3>

                <nav className="space-y-6">
                  <div>
                    <h4 className="text-yellow-300 font-medium mb-2">Getting Started</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="#introduction" className="text-gray-300 hover:text-white flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Introduction
                        </a>
                      </li>
                      <li>
                        <a href="#quickstart" className="text-gray-300 hover:text-white flex items-center">
                          <Terminal className="h-4 w-4 mr-2" />
                          Implementation Guide
                        </a>
                      </li>
                      <li>
                        <a href="#installation" className="text-gray-300 hover:text-white flex items-center">
                          <Code className="h-4 w-4 mr-2" />
                          System Requirements
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-yellow-300 font-medium mb-2">Core Features</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="#prediction" className="text-gray-300 hover:text-white flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Wait Time Prediction
                        </a>
                      </li>
                      <li>
                        <a href="#booking" className="text-gray-300 hover:text-white flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Time Slot Booking
                        </a>
                      </li>
                      <li>
                        <a href="#notifications" className="text-gray-300 hover:text-white flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Notification System
                        </a>
                      </li>
                      <li>
                        <a href="#analytics" className="text-gray-300 hover:text-white flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Analytics & Reporting
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-yellow-300 font-medium mb-2">Integration</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="#authentication" className="text-gray-300 hover:text-white flex items-center">
                          <Code className="h-4 w-4 mr-2" />
                          API Reference
                        </a>
                      </li>
                      <li>
                        <a href="#webhooks" className="text-gray-300 hover:text-white flex items-center">
                          <Code className="h-4 w-4 mr-2" />
                          Webhooks
                        </a>
                      </li>
                      <li>
                        <a href="#crm" className="text-gray-300 hover:text-white flex items-center">
                          <Code className="h-4 w-4 mr-2" />
                          CRM Integration
                        </a>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Introduction Section */}
              <div id="introduction" className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Introduction to QueueWise Pro</h2>
                <p className="text-gray-300 mb-6">
                  QueueWise Pro is an advanced AI-powered queue management system designed to transform how businesses handle customer wait times, optimize resource allocation, and enhance the overall customer experience.
                </p>
                <p className="text-gray-300 mb-6">
                  Our platform combines cutting-edge predictive analytics, real-time monitoring, and intelligent scheduling to create a seamless experience for both customers and service providers across multiple industries.
                </p>

                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-6">
                  <h4 className="text-lg font-bold mb-2">Key Capabilities</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-yellow-300 mr-2">•</span>
                      AI-powered wait time prediction with 97.8% accuracy
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-300 mr-2">•</span>
                      Intelligent time slot recommendation and booking
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-300 mr-2">•</span>
                      Real-time anomaly detection and proactive alerts
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-300 mr-2">•</span>
                      Multi-channel customer notifications (SMS, email, push)
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-300 mr-2">•</span>
                      Comprehensive analytics and business intelligence
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-300 mr-2">•</span>
                      Multi-center optimization and load balancing
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-blue-300 mb-2">Business Impact</h4>
                  <p className="text-gray-300 mb-4">
                    Organizations implementing QueueWise Pro typically experience:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-blue-300 mr-2">•</span>
                      37% reduction in average wait times
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-300 mr-2">•</span>
                      42% improvement in customer satisfaction scores
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-300 mr-2">•</span>
                      23% increase in staff efficiency
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-300 mr-2">•</span>
                      15% growth in customer throughput
                    </li>
                  </ul>
                </div>
              </div>

              {/* Quick Start Section */}
              <div id="quickstart" className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Implementation Guide</h2>
                <p className="text-gray-300 mb-6">
                  Get your QueueWise Pro system up and running quickly with our streamlined implementation process. Most organizations can be fully operational within 48 hours.
                </p>

                <div className="space-y-6">
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                    <h4 className="text-lg font-bold mb-2">1. Initial Setup & Configuration</h4>
                    <p className="text-gray-300 mb-4">
                      Our implementation team will work with you to configure QueueWise Pro for your specific environment.
                    </p>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-yellow-300 mr-2">•</span>
                        System configuration and branding
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-300 mr-2">•</span>
                        User account creation and permission setup
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-300 mr-2">•</span>
                        Location and service configuration
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-300 mr-2">•</span>
                        Initial data import (if applicable)
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                    <h4 className="text-lg font-bold mb-2">2. Integration with Existing Systems</h4>
                    <p className="text-gray-300 mb-4">
                      Connect QueueWise Pro with your current business systems for seamless operation.
                    </p>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-yellow-300 mr-2">•</span>
                        CRM and customer database integration
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-300 mr-2">•</span>
                        Appointment scheduling system connection
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-300 mr-2">•</span>
                        Digital signage and display integration
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-300 mr-2">•</span>
                        Staff notification system setup
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                    <h4 className="text-lg font-bold mb-2">3. Training & Deployment</h4>
                    <p className="text-gray-300 mb-4">
                      Comprehensive training and a phased deployment approach ensure smooth adoption.
                    </p>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start">
                        <span className="text-yellow-300 mr-2">•</span>
                        Staff training sessions (admin and front-line)
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-300 mr-2">•</span>
                        Phased rollout strategy implementation
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-300 mr-2">•</span>
                        Customer communication materials
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-300 mr-2">•</span>
                        Go-live support and monitoring
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-blue-300 mb-2">Implementation Timeline</h4>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center">
                        <div className="w-16 text-center font-bold">Day 1</div>
                        <div className="flex-1 ml-4 p-3 bg-blue-900/30 rounded-lg">
                          Initial setup, configuration, and system integration
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-16 text-center font-bold">Day 2</div>
                        <div className="flex-1 ml-4 p-3 bg-blue-900/30 rounded-lg">
                          Staff training, data validation, and test runs
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-16 text-center font-bold">Day 3</div>
                        <div className="flex-1 ml-4 p-3 bg-blue-900/30 rounded-lg">
                          Go-live with dedicated support and monitoring
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-16 text-center font-bold">Week 2</div>
                        <div className="flex-1 ml-4 p-3 bg-blue-900/30 rounded-lg">
                          Fine-tuning, optimization, and advanced feature activation
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link href="/docs/implementation" className="text-yellow-300 hover:text-yellow-400 flex items-center">
                    View detailed implementation guide
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>

              {/* API Reference Preview */}
              <div id="authentication" className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Integration Options</h2>
                <p className="text-gray-300 mb-6">
                  QueueWise Pro offers multiple integration options to connect with your existing business systems and extend functionality.
                </p>

                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-6">
                  <h4 className="text-lg font-bold mb-4">RESTful API</h4>
                  <p className="text-gray-300 mb-4">
                    Our comprehensive API allows you to integrate QueueWise Pro with your custom applications and systems.
                  </p>

                  <div className="bg-gray-900/50 p-4 rounded-lg font-mono text-sm mb-4">
                    <code className="text-blue-400">
                      # Example: Get current queue status<br />
                      GET /api/v1/centers/{'{center_id}'}/queue<br />
                      Authorization: Bearer your-api-key
                    </code>
                  </div>

                  <p className="text-gray-300">
                    The API provides access to all core features including queue management, wait time predictions, booking, and analytics.
                  </p>
                </div>

                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-6">
                  <h4 className="text-lg font-bold mb-4">Webhooks</h4>
                  <p className="text-gray-300 mb-4">
                    Receive real-time notifications about important events in your QueueWise Pro system.
                  </p>

                  <div className="bg-gray-900/50 p-4 rounded-lg font-mono text-sm mb-4">
                    <code className="text-blue-400">
                      # Example webhook payload for queue status change<br />
                      {'{'}<br />
                      &nbsp;&nbsp;"event": "queue.status_changed",<br />
                      &nbsp;&nbsp;"center_id": "center_123",<br />
                      &nbsp;&nbsp;"timestamp": "2023-06-15T14:32:10Z",<br />
                      &nbsp;&nbsp;"data": {'{'}<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;"current_wait_time": 15,<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;"people_in_queue": 8,<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;"status": "moderate"<br />
                      &nbsp;&nbsp;{'}'}<br />
                      {'}'}
                    </code>
                  </div>

                  <p className="text-gray-300">
                    Configure webhooks to trigger actions in your systems when wait times change, anomalies are detected, or customers join/leave the queue.
                  </p>
                </div>

                <div className="mt-6">
                  <Link href="/docs/api" className="text-yellow-300 hover:text-yellow-400 flex items-center">
                    View complete integration documentation
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>
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
            <h2 className="text-3xl font-bold mb-6">Ready to transform your queue management?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Schedule a personalized demo to see how QueueWise Pro can revolutionize your customer experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold px-8 py-4 text-lg rounded-full">
                  Request Demo
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full">
                  Start Free Trial
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-gray-400">
              "QueueWise Pro has completely transformed our customer experience. Wait times are down by 45% and customer satisfaction is at an all-time high."
              <br />
              <span className="font-semibold text-white mt-2 block">— Michael Chen, Customer Experience Director, Global Financial Services</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
