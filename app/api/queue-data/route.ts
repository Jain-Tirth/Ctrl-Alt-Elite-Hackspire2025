import { NextResponse } from 'next/server';
import { getCurrentPrediction } from '../../lib/queue-prediction';

// Generate random queue data with predictions
function generateQueueData() {
  const currentWaitTime = Math.floor(Math.random() * 10) + 5; // Random wait time between 5-15 minutes
  const averageWaitTime = Math.floor(Math.random() * 5) + 10; // Random average wait time between 10-15 minutes
  const queueLength = Math.floor(Math.random() * 20) + 5; // Random queue length between 5-25 people

  // Get prediction based on current queue length
  const prediction = getCurrentPrediction(queueLength);

  return {
    timestamp: new Date().toISOString(),
    currentWaitTime,
    averageWaitTime,
    queueLength,
    servedCustomers: Math.floor(Math.random() * 50) + 100, // Random number of served customers between 100-150
    prediction: {
      estimatedWaitTime: prediction.estimatedWaitTime,
      confidenceScore: prediction.confidenceScore,
      nextHourPrediction: prediction.nextHourPrediction,
      factors: prediction.factors,
      recommendedTimeSlots: prediction.recommendedTimeSlots
    }
  };
}

// GET handler to fetch current queue data
export async function GET() {
  const queueData = generateQueueData();
  return NextResponse.json(queueData);
}

// POST handler to simulate a new customer joining the queue
export async function POST() {
  const queueData = generateQueueData();
  queueData.queueLength += 1; // Increment queue length

  // Update prediction with new queue length
  const newPrediction = getCurrentPrediction(queueData.queueLength);
  queueData.prediction = {
    estimatedWaitTime: newPrediction.estimatedWaitTime,
    confidenceScore: newPrediction.confidenceScore,
    nextHourPrediction: newPrediction.nextHourPrediction,
    factors: newPrediction.factors,
    recommendedTimeSlots: newPrediction.recommendedTimeSlots
  };

  return NextResponse.json({
    message: 'Customer added to queue',
    queueData
  });
}
