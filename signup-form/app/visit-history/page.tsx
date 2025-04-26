"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Clock, 
  Calendar, 
  Building, 
  ArrowLeft, 
  Star, 
  ChevronDown, 
  ChevronUp,
  BarChart3,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock visit history data
const visitHistory = [
  {
    id: 1,
    date: "2023-06-10",
    time: "10:30 AM",
    centerId: 1,
    centerName: "Downtown Branch",
    waitTime: 18,
    predictedWaitTime: 15,
    serviceDuration: 12,
    purpose: "License Renewal",
    status: "completed",
    feedback: {
      rating: 4,
      comment: "Service was good, but the wait time was a bit longer than expected."
    }
  },
  {
    id: 2,
    date: "2023-05-25",
    time: "2:15 PM",
    centerId: 3,
    centerName: "Eastside Branch",
    waitTime: 8,
    predictedWaitTime: 10,
    serviceDuration: 15,
    purpose: "Document Submission",
    status: "completed",
    feedback: {
      rating: 5,
      comment: "Excellent service, very efficient!"
    }
  },
  {
    id: 3,
    date: "2023-05-12",
    time: "11:00 AM",
    centerId: 1,
    centerName: "Downtown Branch",
    waitTime: 25,
    predictedWaitTime: 20,
    serviceDuration: 8,
    purpose: "General Inquiry",
    status: "completed",
    feedback: {
      rating: 3,
      comment: "The staff was helpful, but the wait time was too long."
    }
  },
  {
    id: 4,
    date: "2023-04-30",
    time: "9:45 AM",
    centerId: 2,
    centerName: "Westside Branch",
    waitTime: 30,
    predictedWaitTime: 25,
    serviceDuration: 20,
    purpose: "Application Processing",
    status: "completed",
    feedback: {
      rating: 4,
      comment: "Good service overall."
    }
  }
]

// Mock analytics data
const analyticsData = {
  averageWaitTime: 20.25,
  waitTimeTrend: -5, // negative means improving (decreasing wait time)
  favoriteCenter: "Downtown Branch",
  visitCount: 4,
  totalTimeSpent: 163, // minutes
  predictionAccuracy: 87, // percentage
}

export default function VisitHistoryPage() {
  const [expandedVisit, setExpandedVisit] = useState<number | null>(null)
  
  // Toggle expanded visit details
  const toggleExpand = (id: number) => {
    if (expandedVisit === id) {
      setExpandedVisit(null)
    } else {
      setExpandedVisit(id)
    }
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { 
      weekday: 'short', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })
  }
  
  // Render star rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-300 fill-yellow-300' : 'text-gray-500'}`} 
      />
    ))
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <Link href="/queue-status">
              <Button variant="ghost" className="mr-4 p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Visit History</h1>
          </div>
          
          <Tabs defaultValue="history">
            <TabsList className="bg-gray-800/50 border border-gray-700/50 mb-6">
              <TabsTrigger value="history" className="data-[state=active]:bg-yellow-300 data-[state=active]:text-black">
                Past Visits
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-yellow-300 data-[state=active]:text-black">
                Analytics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="history">
              <div className="space-y-6">
                {visitHistory.length > 0 ? (
                  visitHistory.map(visit => (
                    <div 
                      key={visit.id} 
                      className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
                    >
                      {/* Visit summary (always visible) */}
                      <div 
                        className="p-6 cursor-pointer"
                        onClick={() => toggleExpand(visit.id)}
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex items-start mb-4 md:mb-0">
                            <div className="bg-gray-700/50 p-3 rounded-lg mr-4">
                              <Calendar className="h-6 w-6 text-yellow-300" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{formatDate(visit.date)}</h3>
                              <div className="flex items-center text-gray-400 mt-1">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{visit.time}</span>
                                <span className="mx-2">•</span>
                                <Building className="h-4 w-4 mr-1" />
                                <span>{visit.centerName}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="flex mr-4">
                              {renderStars(visit.feedback.rating)}
                            </div>
                            {expandedVisit === visit.id ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Expanded details */}
                      {expandedVisit === visit.id && (
                        <div className="px-6 pb-6 pt-0">
                          <div className="h-px bg-gray-700 mb-6"></div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                              <div className="text-gray-400 mb-1">Wait Time</div>
                              <div className="text-2xl font-semibold">{visit.waitTime} min</div>
                              <div className="flex items-center text-sm mt-1">
                                <span className="text-gray-400 mr-1">Predicted:</span>
                                <span>{visit.predictedWaitTime} min</span>
                                {visit.waitTime > visit.predictedWaitTime ? (
                                  <span className="text-red-400 ml-2">
                                    +{visit.waitTime - visit.predictedWaitTime} min
                                  </span>
                                ) : (
                                  <span className="text-green-400 ml-2">
                                    -{visit.predictedWaitTime - visit.waitTime} min
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                              <div className="text-gray-400 mb-1">Service Duration</div>
                              <div className="text-2xl font-semibold">{visit.serviceDuration} min</div>
                              <div className="text-sm text-gray-400 mt-1">
                                {visit.purpose}
                              </div>
                            </div>
                            
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                              <div className="text-gray-400 mb-1">Total Time</div>
                              <div className="text-2xl font-semibold">{visit.waitTime + visit.serviceDuration} min</div>
                              <div className="text-sm text-gray-400 mt-1">
                                Wait + Service
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-800/50 p-4 rounded-lg">
                            <div className="text-gray-400 mb-2">Feedback</div>
                            <div className="flex items-center mb-2">
                              {renderStars(visit.feedback.rating)}
                              <span className="ml-2 text-gray-300">{visit.feedback.rating}/5</span>
                            </div>
                            <p className="text-gray-300">
                              "{visit.feedback.comment}"
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 text-center">
                    <p className="text-gray-400">You don't have any visit history yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Clock className="h-5 w-5 text-yellow-300 mr-2" />
                    Wait Time Analysis
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-gray-400 text-sm">Average Wait Time</div>
                        <div className="text-2xl font-semibold">{analyticsData.averageWaitTime} min</div>
                      </div>
                      
                      <div className={`flex items-center ${
                        analyticsData.waitTimeTrend < 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {analyticsData.waitTimeTrend < 0 ? (
                          <>
                            <TrendingDown className="h-5 w-5 mr-1" />
                            <span>{Math.abs(analyticsData.waitTimeTrend)}% better</span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="h-5 w-5 mr-1" />
                            <span>{analyticsData.waitTimeTrend}% worse</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="h-px bg-gray-700 my-4"></div>
                    
                    <div>
                      <div className="text-gray-400 text-sm mb-2">Prediction Accuracy</div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-700 rounded-full h-2 mr-3">
                          <div 
                            className="h-2 rounded-full bg-yellow-300" 
                            style={{width: `${analyticsData.predictionAccuracy}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analyticsData.predictionAccuracy}%</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Our AI predictions were {analyticsData.predictionAccuracy}% accurate for your visits.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 text-yellow-300 mr-2" />
                    Visit Statistics
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <div className="text-gray-400 text-sm">Total Visits</div>
                        <div className="text-2xl font-semibold">{analyticsData.visitCount}</div>
                      </div>
                      
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <div className="text-gray-400 text-sm">Time Spent</div>
                        <div className="text-2xl font-semibold">{analyticsData.totalTimeSpent} min</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="text-gray-400 text-sm">Most Visited</div>
                      <div className="text-xl font-semibold mt-1">{analyticsData.favoriteCenter}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        You've visited this center most frequently
                      </div>
                    </div>
                    
                    <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                      <h4 className="font-medium text-blue-300 mb-2">AI Insight</h4>
                      <p className="text-gray-300 text-sm">
                        Based on your visit history, the best time for you to visit is between 2:00 PM and 4:00 PM on Wednesdays, when wait times are typically 30% shorter.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                  <h3 className="text-lg font-semibold mb-4">Personalized Recommendations</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <div className="bg-yellow-300/20 p-2 rounded-lg mr-3">
                          <Clock className="h-5 w-5 text-yellow-300" />
                        </div>
                        <div>
                          <h4 className="font-medium">Best Time to Visit</h4>
                          <p className="text-gray-400 text-sm mt-1">
                            Based on your history and current trends, we recommend visiting on Wednesday afternoons between 2:00 PM and 4:00 PM for the shortest wait times.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <div className="bg-green-300/20 p-2 rounded-lg mr-3">
                          <Building className="h-5 w-5 text-green-300" />
                        </div>
                        <div>
                          <h4 className="font-medium">Recommended Location</h4>
                          <p className="text-gray-400 text-sm mt-1">
                            Eastside Branch typically has 40% shorter wait times than Downtown Branch for the services you use most frequently.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
