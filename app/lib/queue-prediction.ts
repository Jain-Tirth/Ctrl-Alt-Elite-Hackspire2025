/**
 * Queue Wait Time Prediction Module
 * 
 * This module provides a TypeScript implementation of the queue wait time prediction
 * functionality, simulating the behavior of the Python ML model.
 */

interface PredictionInput {
  date: string;
  time: string;
  currentQueueLength: number;
  averageServiceTime: number;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isHoliday: boolean;
  customerTypeMix: 'Regular' | 'New' | 'Mixed' | 'VIP';
  weatherCondition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy' | 'Stormy';
  recentIncident: boolean;
  specialOfferRunning: boolean;
}

interface PredictionResult {
  estimatedWaitTime: number;
  confidenceScore: number;
  factors: {
    queueLengthImpact: number;
    timeOfDayImpact: number;
    dayOfWeekImpact: number;
    weatherImpact: number;
    specialOfferImpact: number;
  };
  nextHourPrediction: number;
  recommendedTimeSlots: {
    time: string;
    estimatedWaitTime: number;
  }[];
}

/**
 * Simulates the ML model prediction for queue wait time
 */
export function predictWaitingTime(input: PredictionInput): PredictionResult {
  // Base calculation using queue length and service time
  const baseWaitTime = input.currentQueueLength * input.averageServiceTime;
  
  // Time of day factor
  let timeOfDayFactor = 1.0;
  switch (input.timeOfDay) {
    case 'Morning': timeOfDayFactor = 1.2; break;
    case 'Afternoon': timeOfDayFactor = 1.0; break;
    case 'Evening': timeOfDayFactor = 1.5; break;
    case 'Night': timeOfDayFactor = 0.8; break;
  }
  
  // Day of week factor
  let dayOfWeekFactor = 1.0;
  switch (input.dayOfWeek) {
    case 'Monday': dayOfWeekFactor = 1.1; break;
    case 'Tuesday': dayOfWeekFactor = 0.9; break;
    case 'Wednesday': dayOfWeekFactor = 0.95; break;
    case 'Thursday': dayOfWeekFactor = 1.0; break;
    case 'Friday': dayOfWeekFactor = 1.3; break;
    case 'Saturday': dayOfWeekFactor = 1.5; break;
    case 'Sunday': dayOfWeekFactor = 0.8; break;
  }
  
  // Weather factor
  let weatherFactor = 1.0;
  switch (input.weatherCondition) {
    case 'Sunny': weatherFactor = 1.1; break;
    case 'Cloudy': weatherFactor = 1.0; break;
    case 'Rainy': weatherFactor = 0.9; break;
    case 'Snowy': weatherFactor = 0.7; break;
    case 'Stormy': weatherFactor = 0.6; break;
  }
  
  // Holiday factor
  const holidayFactor = input.isHoliday ? 1.4 : 1.0;
  
  // Customer type factor
  let customerTypeFactor = 1.0;
  switch (input.customerTypeMix) {
    case 'Regular': customerTypeFactor = 0.9; break;
    case 'New': customerTypeFactor = 1.3; break;
    case 'Mixed': customerTypeFactor = 1.1; break;
    case 'VIP': customerTypeFactor = 0.8; break;
  }
  
  // Special offer factor
  const specialOfferFactor = input.specialOfferRunning ? 1.25 : 1.0;
  
  // Recent incident factor
  const incidentFactor = input.recentIncident ? 1.2 : 1.0;
  
  // Calculate final prediction
  const estimatedWaitTime = Math.round(
    baseWaitTime * 
    timeOfDayFactor * 
    dayOfWeekFactor * 
    weatherFactor * 
    holidayFactor * 
    customerTypeFactor * 
    specialOfferFactor * 
    incidentFactor
  );
  
  // Calculate confidence score (simulated)
  const confidenceScore = 0.85 - (Math.random() * 0.15);
  
  // Calculate next hour prediction (simulated)
  const nextHourChange = Math.random() > 0.5 ? 
    Math.random() * 0.2 : // increase
    -Math.random() * 0.2; // decrease
  const nextHourPrediction = Math.round(estimatedWaitTime * (1 + nextHourChange));
  
  // Generate recommended time slots
  const recommendedTimeSlots = generateRecommendedTimeSlots(input, estimatedWaitTime);
  
  return {
    estimatedWaitTime,
    confidenceScore,
    factors: {
      queueLengthImpact: input.currentQueueLength / 20, // normalized impact
      timeOfDayImpact: (timeOfDayFactor - 0.8) / 0.7, // normalized to 0-1
      dayOfWeekImpact: (dayOfWeekFactor - 0.8) / 0.7, // normalized to 0-1
      weatherImpact: (weatherFactor - 0.6) / 0.5, // normalized to 0-1
      specialOfferImpact: specialOfferFactor - 1 // 0 or 0.25
    },
    nextHourPrediction,
    recommendedTimeSlots
  };
}

/**
 * Generate recommended time slots with lower wait times
 */
function generateRecommendedTimeSlots(input: PredictionInput, currentEstimate: number): { time: string; estimatedWaitTime: number }[] {
  const slots = [];
  const currentTime = new Date(`2023-01-01T${input.time}`);
  
  // Generate 3 recommended slots
  for (let i = 1; i <= 3; i++) {
    // Add 30-60 minutes to current time
    const recommendedTime = new Date(currentTime.getTime() + (i * 30 + Math.floor(Math.random() * 30)) * 60000);
    const timeString = recommendedTime.toTimeString().substring(0, 5);
    
    // Estimate a lower wait time for recommended slots
    const reduction = 0.3 + (Math.random() * 0.4); // 30-70% reduction
    const estimatedWaitTime = Math.max(5, Math.round(currentEstimate * (1 - reduction)));
    
    slots.push({
      time: timeString,
      estimatedWaitTime
    });
  }
  
  return slots;
}

/**
 * Get the current prediction based on real-time data
 */
export function getCurrentPrediction(queueLength: number): PredictionResult {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().substring(0, 5);
  
  // Determine time of day
  const hour = now.getHours();
  let timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  if (hour >= 5 && hour < 12) timeOfDay = 'Morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'Evening';
  else timeOfDay = 'Night';
  
  // Determine day of week
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = days[now.getDay()] as any;
  
  // Random weather condition
  const weatherConditions = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Stormy'];
  const weatherCondition = weatherConditions[Math.floor(Math.random() * 3)] as any; // Bias toward first 3
  
  // Random customer mix
  const customerMixes = ['Regular', 'New', 'Mixed', 'VIP'];
  const customerTypeMix = customerMixes[Math.floor(Math.random() * customerMixes.length)] as any;
  
  return predictWaitingTime({
    date,
    time,
    currentQueueLength: queueLength,
    averageServiceTime: 2.5,
    timeOfDay,
    dayOfWeek,
    isHoliday: false,
    customerTypeMix,
    weatherCondition,
    recentIncident: Math.random() > 0.9, // 10% chance of recent incident
    specialOfferRunning: Math.random() > 0.7 // 30% chance of special offer
  });
}
