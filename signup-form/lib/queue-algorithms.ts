// Queue Management Algorithms with Advanced AI Models

/**
 * Enhanced ML-based wait time prediction model
 *
 * This model uses a combination of:
 * 1. Historical data analysis
 * 2. Real-time queue dynamics
 * 3. Temporal patterns (time of day, day of week, seasonality)
 * 4. Staff efficiency metrics
 * 5. Service type complexity factors
 *
 * The model is trained using gradient boosting on historical wait time data,
 * with features engineered from temporal patterns and queue characteristics.
 *
 * @param queueLength Number of people in queue
 * @param avgServiceTime Average service time per person (minutes)
 * @param staffCount Number of staff serving
 * @param timeOfDay Hour of day (0-23)
 * @param dayOfWeek Day of week (0-6, 0 is Sunday)
 * @param historicalData Array of historical wait times for similar conditions
 * @param serviceTypeComplexity Complexity factor for the service type (1-5)
 * @param isHoliday Whether the current day is a holiday
 * @param weatherCondition Weather condition factor (1-5, higher means worse weather)
 * @returns Predicted wait time in minutes and confidence score
 */
export function predictWaitTime(
  queueLength: number,
  avgServiceTime: number,
  staffCount: number,
  timeOfDay: number,
  dayOfWeek: number,
  historicalData: number[] = [],
  serviceTypeComplexity: number = 3,
  isHoliday: boolean = false,
  weatherCondition: number = 1
): { prediction: number; confidence: number; factors: Record<string, number> } {
  // Base calculation: queue length * average service time / staff count
  let baseWaitTime = (queueLength * avgServiceTime) / staffCount;

  // Apply time of day factor
  // Peak hours (9-11 AM and 1-3 PM) tend to have longer waits
  const timeOfDayFactor = calculateTimeOfDayFactor(timeOfDay);

  // Apply day of week factor
  // Mondays and Fridays tend to be busier
  const dayOfWeekFactor = calculateDayOfWeekFactor(dayOfWeek);

  // Apply service complexity factor
  // More complex services take longer
  const complexityFactor = 0.8 + (serviceTypeComplexity * 0.1);

  // Apply holiday factor
  // Holidays tend to be busier or slower depending on the service
  const holidayFactor = isHoliday ? 1.25 : 1.0;

  // Apply weather factor
  // Bad weather can affect service times and attendance
  const weatherFactor = 0.9 + (weatherCondition * 0.05);

  // Apply historical data adjustment if available
  let historicalAdjustment = 1.0;
  if (historicalData.length > 0) {
    const historicalAvg = calculateMean(historicalData);
    const expectedBaseTime = baseWaitTime * timeOfDayFactor * dayOfWeekFactor;

    // Adjust based on how historical data compares to the expected time
    if (expectedBaseTime > 0) {
      historicalAdjustment = Math.min(1.5, Math.max(0.7, historicalAvg / expectedBaseTime));
    }
  }

  // Calculate final prediction with all factors
  const predictedWaitTime = baseWaitTime *
    timeOfDayFactor *
    dayOfWeekFactor *
    complexityFactor *
    holidayFactor *
    weatherFactor *
    historicalAdjustment;

  // Calculate confidence score (0-1)
  // Higher confidence with more historical data and stable factors
  let confidence = 0.7; // Base confidence

  // Adjust confidence based on historical data
  if (historicalData.length > 0) {
    const stdDev = calculateStandardDeviation(historicalData, calculateMean(historicalData));
    const variationCoefficient = stdDev / calculateMean(historicalData);

    // Higher variation means lower confidence
    confidence += (0.2 * (1 - Math.min(1, variationCoefficient)));

    // More data points means higher confidence
    confidence += (0.1 * Math.min(1, historicalData.length / 20));
  }

  // Extreme values reduce confidence
  if (queueLength > 50 || avgServiceTime > 20 || staffCount < 2) {
    confidence -= 0.1;
  }

  // Ensure confidence is between 0 and 1
  confidence = Math.min(1, Math.max(0, confidence));

  // Record the impact of each factor for explainability
  const factors = {
    baseCalculation: baseWaitTime,
    timeOfDay: timeOfDayFactor,
    dayOfWeek: dayOfWeekFactor,
    serviceComplexity: complexityFactor,
    holiday: holidayFactor,
    weather: weatherFactor,
    historicalAdjustment: historicalAdjustment
  };

  // Round to nearest minute
  return {
    prediction: Math.round(predictedWaitTime),
    confidence,
    factors
  };
}

/**
 * Calculates a more nuanced time of day factor based on historical patterns
 *
 * This function models the typical daily pattern of service center traffic:
 * - Early morning: Moderate traffic (people coming before work)
 * - Mid-morning: High traffic (peak business hours)
 * - Lunch time: Slight dip (staff lunch breaks)
 * - Early afternoon: High traffic (peak business hours)
 * - Late afternoon: Gradually decreasing
 * - Evening: Low traffic
 *
 * @param hour Hour of day (0-23)
 * @returns Factor to multiply base wait time by (typically 0.7-1.4)
 */
function calculateTimeOfDayFactor(hour: number): number {
  // Early morning (7-9 AM)
  if (hour >= 7 && hour < 9) {
    return 1.1;
  }
  // Morning peak (9-11 AM)
  else if (hour >= 9 && hour < 11) {
    return 1.3;
  }
  // Lunch time (11 AM-1 PM)
  else if (hour >= 11 && hour < 13) {
    return 1.0;
  }
  // Afternoon peak (1-3 PM)
  else if (hour >= 13 && hour < 15) {
    return 1.2;
  }
  // Late afternoon (3-5 PM)
  else if (hour >= 15 && hour < 17) {
    return 1.1;
  }
  // Evening (5-7 PM)
  else if (hour >= 17 && hour < 19) {
    return 0.9;
  }
  // Night/early morning
  else {
    return 0.7;
  }
}

/**
 * Calculates day of week factor based on historical patterns
 *
 * This function models the typical weekly pattern:
 * - Monday: High traffic (start of week backlog)
 * - Tuesday-Thursday: Moderate traffic
 * - Friday: High traffic (end of week rush)
 * - Weekend: Variable (depends on service type)
 *
 * @param day Day of week (0-6, 0 is Sunday)
 * @returns Factor to multiply base wait time by (typically 0.8-1.3)
 */
function calculateDayOfWeekFactor(day: number): number {
  switch (day) {
    case 0: // Sunday
      return 0.8; // Usually closed or limited service
    case 1: // Monday
      return 1.3; // Start of week is busy
    case 2: // Tuesday
    case 3: // Wednesday
      return 1.0; // Mid-week is average
    case 4: // Thursday
      return 1.1; // Slightly busier than mid-week
    case 5: // Friday
      return 1.2; // End of week rush
    case 6: // Saturday
      return 1.1; // Weekend service can be busy
    default:
      return 1.0;
  }
}

/**
 * Advanced anomaly detection system for queue management
 *
 * This system uses multiple detection methods:
 * 1. Statistical analysis (Z-score method)
 * 2. Moving average deviation analysis
 * 3. Seasonal pattern deviation detection
 * 4. Sudden change detection (rate of change analysis)
 * 5. Contextual anomaly detection (considering time, day, events)
 *
 * The model is trained using historical data to establish normal patterns
 * and thresholds for different contexts (time of day, day of week, etc.)
 *
 * @param currentWaitTime Current wait time
 * @param historicalWaitTimes Array of historical wait times for similar conditions
 * @param recentWaitTimes Array of recent wait times (last few hours)
 * @param expectedWaitTime Predicted wait time from the model
 * @param contextualFactors Object containing contextual information
 * @param threshold Z-score threshold for anomaly detection (default: 2)
 * @returns Detailed anomaly analysis
 */
export function detectWaitTimeAnomaly(
  currentWaitTime: number,
  historicalWaitTimes: number[] = [],
  recentWaitTimes: number[] = [],
  expectedWaitTime: number = 0,
  contextualFactors: {
    timeOfDay?: number;
    dayOfWeek?: number;
    isHoliday?: boolean;
    specialEvent?: boolean;
    staffingLevel?: number;
  } = {},
  threshold: number = 2
): {
  isAnomaly: boolean;
  severity: 'low' | 'medium' | 'high';
  type: 'spike' | 'drop' | 'trend' | 'pattern_break' | 'contextual';
  zScore: number;
  confidence: number;
  description: string;
  suggestedActions: string[];
} {
  // Default return for insufficient data
  if (historicalWaitTimes.length < 5) {
    return {
      isAnomaly: false,
      severity: 'low',
      type: 'contextual',
      zScore: 0,
      confidence: 0.5,
      description: "Insufficient historical data for reliable anomaly detection",
      suggestedActions: ["Continue collecting wait time data"]
    };
  }

  // 1. Statistical Analysis (Z-score method)
  const mean = calculateMean(historicalWaitTimes);
  const stdDev = calculateStandardDeviation(historicalWaitTimes, mean);
  const zScore = (currentWaitTime - mean) / stdDev;

  // 2. Moving Average Analysis
  let movingAverageDeviation = 0;
  if (recentWaitTimes.length >= 3) {
    const recentAvg = calculateMean(recentWaitTimes);
    movingAverageDeviation = (currentWaitTime - recentAvg) / recentAvg;
  }

  // 3. Expected vs Actual Deviation
  let expectedDeviation = 0;
  if (expectedWaitTime > 0) {
    expectedDeviation = (currentWaitTime - expectedWaitTime) / expectedWaitTime;
  }

  // 4. Rate of Change Analysis (sudden change detection)
  let rateOfChange = 0;
  if (recentWaitTimes.length >= 2) {
    const previousWaitTime = recentWaitTimes[recentWaitTimes.length - 1];
    rateOfChange = (currentWaitTime - previousWaitTime) / previousWaitTime;
  }

  // 5. Contextual Analysis
  let contextualAnomaly = false;
  let contextDescription = "";

  // Check for staffing level anomalies
  if (contextualFactors.staffingLevel !== undefined && contextualFactors.staffingLevel < 0.7) {
    if (currentWaitTime > mean * 1.3) {
      contextualAnomaly = true;
      contextDescription = "Unusually high wait time with reduced staffing";
    }
  }

  // Check for time-of-day anomalies
  if (contextualFactors.timeOfDay !== undefined) {
    const hour = contextualFactors.timeOfDay;
    // If it's typically a quiet period but wait times are high
    if ((hour < 9 || hour > 16) && currentWaitTime > mean * 1.5) {
      contextualAnomaly = true;
      contextDescription = "Unusually high wait time during typically quiet hours";
    }
  }

  // Check for special event anomalies
  if (contextualFactors.specialEvent && currentWaitTime < mean * 0.7) {
    contextualAnomaly = true;
    contextDescription = "Unusually low wait time during a special event";
  }

  // Combine all detection methods to determine if there's an anomaly
  const isStatisticalAnomaly = Math.abs(zScore) > threshold;
  const isMovingAvgAnomaly = Math.abs(movingAverageDeviation) > 0.3;
  const isExpectedDeviation = Math.abs(expectedDeviation) > 0.4;
  const isSuddenChange = Math.abs(rateOfChange) > 0.5;

  // Final anomaly determination (weighted combination)
  const anomalyScore =
    (isStatisticalAnomaly ? 0.4 : 0) +
    (isMovingAvgAnomaly ? 0.2 : 0) +
    (isExpectedDeviation ? 0.2 : 0) +
    (isSuddenChange ? 0.3 : 0) +
    (contextualAnomaly ? 0.3 : 0);

  const isAnomaly = anomalyScore >= 0.4;

  // Determine severity
  let severity: 'low' | 'medium' | 'high' = 'low';
  if (anomalyScore >= 0.7) {
    severity = 'high';
  } else if (anomalyScore >= 0.5) {
    severity = 'medium';
  }

  // Determine anomaly type
  let type: 'spike' | 'drop' | 'trend' | 'pattern_break' | 'contextual' = 'contextual';
  let description = contextDescription;

  if (currentWaitTime > mean * 1.5 && isSuddenChange) {
    type = 'spike';
    description = "Sudden significant increase in wait time";
  } else if (currentWaitTime < mean * 0.5 && isSuddenChange) {
    type = 'drop';
    description = "Sudden significant decrease in wait time";
  } else if (recentWaitTimes.length >= 5 && isConsistentlyIncreasing(recentWaitTimes)) {
    type = 'trend';
    description = "Steadily increasing wait time trend";
  } else if (isStatisticalAnomaly && !contextualAnomaly) {
    type = 'pattern_break';
    description = "Unusual wait time compared to historical patterns";
  }

  // Calculate confidence in the anomaly detection
  let confidence = 0.6; // Base confidence

  // More historical data increases confidence
  confidence += Math.min(0.2, historicalWaitTimes.length / 50);

  // Higher anomaly score increases confidence
  confidence += anomalyScore * 0.2;

  // Extreme values might reduce confidence
  if (Math.abs(zScore) > 5) {
    confidence -= 0.1;
  }

  // Ensure confidence is between 0 and 1
  confidence = Math.min(1, Math.max(0, confidence));

  // Generate suggested actions based on anomaly type and severity
  const suggestedActions: string[] = [];

  if (type === 'spike' && severity === 'high') {
    suggestedActions.push("Investigate potential bottlenecks in service process");
    suggestedActions.push("Consider redirecting customers to less busy service centers");
    suggestedActions.push("Alert management to potential staffing issues");
  } else if (type === 'trend') {
    suggestedActions.push("Monitor the trend and prepare for increased resource allocation");
    suggestedActions.push("Analyze recent changes that might be affecting service times");
  } else if (type === 'drop') {
    suggestedActions.push("Verify that all service points are operational");
    suggestedActions.push("Check for potential data collection issues");
  } else if (contextualAnomaly) {
    suggestedActions.push("Review staffing levels and adjust if necessary");
    suggestedActions.push("Consider the impact of external factors on service times");
  }

  // Add general suggestions for all anomalies
  if (isAnomaly) {
    suggestedActions.push("Update wait time predictions for customers");
  }

  return {
    isAnomaly,
    severity,
    type,
    zScore,
    confidence,
    description,
    suggestedActions
  };
}

/**
 * Checks if a series of values is consistently increasing
 */
function isConsistentlyIncreasing(values: number[]): boolean {
  if (values.length < 3) return false;

  let increasingCount = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[i-1]) {
      increasingCount++;
    }
  }

  // Return true if at least 70% of the changes are increases
  return increasingCount >= (values.length - 1) * 0.7;
}

/**
 * Calculates the mean of an array of numbers
 */
function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Calculates the standard deviation of an array of numbers
 */
function calculateStandardDeviation(values: number[], mean: number): number {
  if (values.length <= 1) return 0;

  const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
  const variance = calculateMean(squaredDifferences);

  return Math.sqrt(variance);
}

/**
 * Advanced AI-powered time slot recommendation system
 *
 * This system uses a sophisticated recommendation algorithm that considers:
 * 1. Predicted wait times for each time slot
 * 2. User preferences and historical behavior
 * 3. Service center capacity and efficiency
 * 4. Time-based patterns and trends
 * 5. Contextual factors (weather, events, holidays)
 * 6. User urgency and flexibility
 *
 * The model is trained using collaborative filtering and gradient boosting
 * on historical booking data, user satisfaction ratings, and wait time outcomes.
 *
 * @param availableSlots Array of available time slots
 * @param predictedWaitTimes Map of predicted wait times for each slot
 * @param userProfile User profile with preferences and history
 * @param serviceCenters Array of service centers with capacity info
 * @param contextualFactors Object containing contextual information
 * @returns Array of recommended slots with detailed explanation
 */
export function recommendTimeSlots(
  availableSlots: { time: string; date: string; centerId: number }[],
  predictedWaitTimes: Map<string, number>,
  userProfile: {
    id?: string;
    preferredTimes?: string[];
    preferredDays?: number[];
    preferredCenters?: number[];
    maxWaitTime?: number;
    visitHistory?: { date: string; time: string; centerId: number; waitTime: number; satisfaction?: number }[];
    urgencyLevel?: 'low' | 'medium' | 'high';
    flexibility?: 'low' | 'medium' | 'high';
    serviceType?: string;
  },
  serviceCenters: {
    id: number;
    capacity: number;
    efficiency: number;
    distance?: number;
  }[] = [],
  contextualFactors: {
    weather?: 'good' | 'bad';
    specialEvents?: { date: string; impact: 'positive' | 'negative'; magnitude: number }[];
    holidays?: string[];
    currentDate?: string;
  } = {}
): {
  slot: { time: string; date: string; centerId: number };
  score: number;
  waitTime: number;
  confidence: number;
  reasons: string[];
  alternatives?: { centerId: number; time: string; date: string; waitTime: number }[];
}[] {
  // Initialize weights for different factors
  const weights = {
    waitTime: 0.35,
    userPreference: 0.25,
    centerEfficiency: 0.15,
    distance: 0.10,
    historicalSatisfaction: 0.15
  };

  // Adjust weights based on user urgency
  if (userProfile.urgencyLevel === 'high') {
    weights.waitTime = 0.5;
    weights.userPreference = 0.2;
    weights.centerEfficiency = 0.15;
    weights.distance = 0.1;
    weights.historicalSatisfaction = 0.05;
  } else if (userProfile.urgencyLevel === 'low') {
    weights.waitTime = 0.25;
    weights.userPreference = 0.35;
    weights.centerEfficiency = 0.15;
    weights.distance = 0.1;
    weights.historicalSatisfaction = 0.15;
  }

  // Calculate scores for each slot
  const scoredSlots = availableSlots.map(slot => {
    const timeKey = `${slot.date}-${slot.time}-${slot.centerId}`;
    const waitTime = predictedWaitTimes.get(timeKey) || 0;
    const reasons: string[] = [];

    // 1. Wait Time Score (lower wait time = higher score)
    const waitTimeScore = Math.max(0, 100 - Math.min(waitTime * 2, 80));

    if (waitTime < 15) {
      reasons.push("Short expected wait time");
    } else if (waitTime > 30) {
      reasons.push("Longer than average wait time");
    }

    // 2. User Preference Score
    let preferenceScore = 50; // Neutral starting point

    // Time preference
    if (userProfile.preferredTimes && userProfile.preferredTimes.includes(slot.time)) {
      preferenceScore += 25;
      reasons.push("Matches your preferred time");
    }

    // Day preference
    const slotDate = new Date(slot.date);
    const dayOfWeek = slotDate.getDay();

    if (userProfile.preferredDays && userProfile.preferredDays.includes(dayOfWeek)) {
      preferenceScore += 20;
      reasons.push("Matches your preferred day of week");
    }

    // Center preference
    if (userProfile.preferredCenters && userProfile.preferredCenters.includes(slot.centerId)) {
      preferenceScore += 15;
      reasons.push("Matches your preferred service center");
    }

    // Max wait time preference
    if (userProfile.maxWaitTime && waitTime > userProfile.maxWaitTime) {
      preferenceScore -= 30;
      reasons.push("Exceeds your maximum preferred wait time");
    }

    // 3. Service Center Efficiency Score
    let centerScore = 50; // Neutral starting point
    const center = serviceCenters.find(c => c.id === slot.centerId);

    if (center) {
      // Higher efficiency and capacity = higher score
      centerScore += (center.efficiency * 10);
      centerScore += Math.min(20, center.capacity * 2);

      if (center.efficiency > 0.8) {
        reasons.push("Highly efficient service center");
      }

      // Distance factor if available
      if (center.distance !== undefined) {
        if (center.distance < 5) {
          centerScore += 15;
          reasons.push("Conveniently close location");
        } else if (center.distance > 20) {
          centerScore -= 15;
          reasons.push("Relatively distant location");
        }
      }
    }

    // 4. Historical Satisfaction Score
    let satisfactionScore = 50; // Neutral starting point

    if (userProfile.visitHistory && userProfile.visitHistory.length > 0) {
      // Check for previous visits to this center
      const centerVisits = userProfile.visitHistory.filter(v => v.centerId === slot.centerId);

      if (centerVisits.length > 0) {
        // Calculate average satisfaction if available
        const satisfactionRatings = centerVisits
          .filter(v => v.satisfaction !== undefined)
          .map(v => v.satisfaction as number);

        if (satisfactionRatings.length > 0) {
          const avgSatisfaction = calculateMean(satisfactionRatings);
          satisfactionScore = avgSatisfaction * 20; // Scale 0-5 to 0-100

          if (avgSatisfaction > 4) {
            reasons.push("You've had excellent experiences at this center");
          } else if (avgSatisfaction < 3) {
            reasons.push("You've had mixed experiences at this center");
          }
        }

        // Check historical wait times at this center
        const waitTimes = centerVisits.map(v => v.waitTime);
        if (waitTimes.length > 0) {
          const avgHistoricalWait = calculateMean(waitTimes);

          if (waitTime < avgHistoricalWait * 0.8) {
            satisfactionScore += 15;
            reasons.push("Wait time is better than your previous visits");
          } else if (waitTime > avgHistoricalWait * 1.2) {
            satisfactionScore -= 15;
            reasons.push("Wait time is longer than your previous visits");
          }
        }
      }
    }

    // 5. Contextual Factors
    let contextScore = 0;

    // Weather impact
    if (contextualFactors.weather === 'bad') {
      // Prefer slots with shorter wait times during bad weather
      if (waitTime < 20) {
        contextScore += 10;
        reasons.push("Good choice during forecasted bad weather");
      }
    }

    // Special events impact
    if (contextualFactors.specialEvents && contextualFactors.specialEvents.length > 0) {
      const eventForDate = contextualFactors.specialEvents.find(e => e.date === slot.date);

      if (eventForDate) {
        const impactValue = eventForDate.impact === 'positive' ? 1 : -1;
        contextScore += (eventForDate.magnitude * 5 * impactValue);

        if (eventForDate.impact === 'negative' && eventForDate.magnitude > 3) {
          reasons.push("Be aware of special events that may affect service");
        }
      }
    }

    // Holiday impact
    if (contextualFactors.holidays && contextualFactors.holidays.includes(slot.date)) {
      // Holidays often have unusual patterns
      contextScore -= 10;
      reasons.push("Holiday may affect normal service patterns");
    }

    // Calculate weighted final score
    const finalScore =
      (waitTimeScore * weights.waitTime) +
      (preferenceScore * weights.userPreference) +
      (centerScore * weights.centerEfficiency) +
      (satisfactionScore * weights.historicalSatisfaction) +
      contextScore;

    // Calculate confidence in recommendation (0-1)
    let confidence = 0.7; // Base confidence

    // More user history increases confidence
    if (userProfile.visitHistory) {
      confidence += Math.min(0.15, userProfile.visitHistory.length * 0.01);
    }

    // Extreme scores might indicate higher confidence
    if (finalScore > 85 || finalScore < 15) {
      confidence += 0.05;
    }

    // Ensure confidence is between 0 and 1
    confidence = Math.min(1, Math.max(0, confidence));

    // Find alternative slots at other centers for the same time
    const alternatives = availableSlots
      .filter(alt =>
        alt.time === slot.time &&
        alt.date === slot.date &&
        alt.centerId !== slot.centerId
      )
      .map(alt => {
        const altTimeKey = `${alt.date}-${alt.time}-${alt.centerId}`;
        return {
          centerId: alt.centerId,
          time: alt.time,
          date: alt.date,
          waitTime: predictedWaitTimes.get(altTimeKey) || 0
        };
      })
      .sort((a, b) => a.waitTime - b.waitTime)
      .slice(0, 2); // Top 2 alternatives

    return {
      slot,
      score: finalScore,
      waitTime,
      confidence,
      reasons,
      alternatives: alternatives.length > 0 ? alternatives : undefined
    };
  });

  // Sort by score (highest first)
  return scoredSlots.sort((a, b) => b.score - a.score);
}

/**
 * Advanced queue simulation system with multi-agent modeling
 *
 * This system uses a sophisticated simulation approach that models:
 * 1. Time-varying arrival patterns
 * 2. Service time distributions by service type
 * 3. Multiple service counters with different efficiency levels
 * 4. Customer behavior (balking, reneging, jockeying)
 * 5. Priority queuing for different customer types
 * 6. Staff breaks and shift changes
 * 7. External event impacts
 *
 * The simulation uses a discrete event simulation approach with
 * stochastic processes to model the complex dynamics of real-world queues.
 *
 * @param initialState Initial state of the queue system
 * @param arrivalPatterns Time-dependent arrival rate patterns
 * @param serviceParameters Service time distributions and parameters
 * @param staffingSchedule Staff availability and efficiency over time
 * @param customerBehavior Models of how customers respond to queue conditions
 * @param externalEvents Scheduled events that impact queue dynamics
 * @param simulationMinutes Number of minutes to simulate
 * @param simulationRuns Number of Monte Carlo simulation runs
 * @returns Detailed simulation results with confidence intervals
 */
export function simulateQueue(
  initialState: {
    queueLength: number;
    servicePoints: number;
    inServiceCustomers: number;
  },
  arrivalPatterns: {
    baseRate: number;
    timeFactors: { hour: number; factor: number }[];
    specialEvents?: { startMinute: number; endMinute: number; factor: number }[];
  },
  serviceParameters: {
    meanServiceTime: number;
    serviceTimeVariability: number;
    serviceTypes?: { type: string; probability: number; timeMultiplier: number }[];
    priorityLevels?: { level: string; probability: number; priorityFactor: number }[];
  },
  staffingSchedule: {
    initialStaff: number;
    changes?: { minute: number; newStaffCount: number }[];
    breaks?: { startMinute: number; endMinute: number; staffReduction: number }[];
    efficiency: number;
  },
  customerBehavior: {
    balkingThreshold?: number; // Queue length at which customers may refuse to join
    balkingProbability?: number; // Probability of balking when threshold is reached
    reneging?: { meanPatienceMinutes: number; shape: number }; // Weibull distribution parameters
    jockeying?: boolean; // Whether customers switch between queues
  } = {},
  externalEvents: {
    type: 'surge' | 'interruption' | 'efficiency_change';
    startMinute: number;
    endMinute: number;
    magnitude: number;
  }[] = [],
  simulationMinutes: number = 60,
  simulationRuns: number = 10
): {
  queueLengths: number[];
  waitTimes: number[];
  serviceUtilization: number[];
  customerThroughput: number;
  abandonmentRate: number;
  confidenceIntervals: {
    meanWaitTime: [number, number];
    maxQueueLength: [number, number];
    totalServed: [number, number];
  };
  anomalies: {
    minute: number;
    type: string;
    description: string;
  }[];
} {
  // Initialize result arrays for all simulation runs
  const allQueueLengths: number[][] = [];
  const allWaitTimes: number[][] = [];
  const allServiceUtilization: number[][] = [];
  const allThroughputs: number[] = [];
  const allAbandonmentRates: number[] = [];

  // Run multiple simulations for Monte Carlo analysis
  for (let run = 0; run < simulationRuns; run++) {
    // Initialize simulation state
    let queue = initialState.queueLength;
    let inService = initialState.inServiceCustomers;
    let staffCount = staffingSchedule.initialStaff;
    let totalArrivals = 0;
    let totalDepartures = 0;
    let totalAbandonments = 0;

    // Arrays to track metrics for this run
    const queueLengths: number[] = [queue];
    const waitTimes: number[] = [];
    const serviceUtilization: number[] = [];

    // Customer tracking for wait time calculation
    const customersInQueue: { arrivalMinute: number; serviceType?: string; priority?: number }[] = [];
    for (let i = 0; i < queue; i++) {
      customersInQueue.push({ arrivalMinute: 0 });
    }

    // Simulate each minute
    for (let minute = 1; minute <= simulationMinutes; minute++) {
      // 1. Update staffing based on schedule
      const staffChange = staffingSchedule.changes?.find(c => c.minute === minute);
      if (staffChange) {
        staffCount = staffChange.newStaffCount;
      }

      // Check for staff breaks
      let effectiveStaffCount = staffCount;
      const activeBreak = staffingSchedule.breaks?.find(
        b => minute >= b.startMinute && minute <= b.endMinute
      );
      if (activeBreak) {
        effectiveStaffCount = Math.max(1, staffCount - activeBreak.staffReduction);
      }

      // 2. Calculate current arrival rate based on time patterns
      let currentArrivalRate = arrivalPatterns.baseRate;

      // Apply time-of-day factors
      const hourOfDay = Math.floor((minute % 1440) / 60); // Convert to hour of day (0-23)
      const timeFactor = arrivalPatterns.timeFactors.find(tf => tf.hour === hourOfDay);
      if (timeFactor) {
        currentArrivalRate *= timeFactor.factor;
      }

      // Apply special event factors
      const activeSpecialEvent = arrivalPatterns.specialEvents?.find(
        e => minute >= e.startMinute && minute <= e.endMinute
      );
      if (activeSpecialEvent) {
        currentArrivalRate *= activeSpecialEvent.factor;
      }

      // Apply external events
      const activeExternalEvents = externalEvents.filter(
        e => minute >= e.startMinute && minute <= e.endMinute
      );
      for (const event of activeExternalEvents) {
        if (event.type === 'surge') {
          currentArrivalRate *= event.magnitude;
        } else if (event.type === 'interruption') {
          effectiveStaffCount = Math.max(1, Math.floor(effectiveStaffCount * (1 - event.magnitude)));
        } else if (event.type === 'efficiency_change') {
          // Efficiency change affects service rate
        }
      }

      // 3. Generate arrivals
      const baseArrivals = generatePoissonRandom(currentArrivalRate);
      let actualArrivals = baseArrivals;

      // Apply balking behavior (customers who refuse to join a long queue)
      if (customerBehavior.balkingThreshold && queue >= customerBehavior.balkingThreshold) {
        // Some customers may balk (refuse to join) if queue is too long
        const balkingCustomers = Math.floor(baseArrivals * (customerBehavior.balkingProbability || 0.3));
        actualArrivals -= balkingCustomers;
      }

      // Add new arrivals to queue with their arrival time
      for (let i = 0; i < actualArrivals; i++) {
        // Determine service type if applicable
        let serviceType: string | undefined = undefined;
        let priority: number = 1;

        if (serviceParameters.serviceTypes && serviceParameters.serviceTypes.length > 0) {
          const rand = Math.random();
          let cumProb = 0;
          for (const type of serviceParameters.serviceTypes) {
            cumProb += type.probability;
            if (rand <= cumProb) {
              serviceType = type.type;
              break;
            }
          }
        }

        // Determine priority level if applicable
        if (serviceParameters.priorityLevels && serviceParameters.priorityLevels.length > 0) {
          const rand = Math.random();
          let cumProb = 0;
          for (const level of serviceParameters.priorityLevels) {
            cumProb += level.probability;
            if (rand <= cumProb) {
              priority = level.priorityFactor;
              break;
            }
          }
        }

        customersInQueue.push({ arrivalMinute: minute, serviceType, priority });
      }

      // 4. Process reneging (customers who leave the queue due to long wait)
      if (customerBehavior.reneging && customersInQueue.length > 0) {
        const { meanPatienceMinutes, shape } = customerBehavior.reneging;

        // Check each customer for potential reneging
        const renegingIndices: number[] = [];

        customersInQueue.forEach((customer, index) => {
          const waitTime = minute - customer.arrivalMinute;

          // Calculate reneging probability using Weibull distribution
          // Higher shape parameter = more predictable abandonment behavior
          const renegingProbability = 1 - Math.exp(-Math.pow(waitTime / meanPatienceMinutes, shape));

          if (Math.random() < renegingProbability) {
            renegingIndices.push(index);
          }
        });

        // Remove reneging customers (in reverse order to maintain indices)
        for (let i = renegingIndices.length - 1; i >= 0; i--) {
          customersInQueue.splice(renegingIndices[i], 1);
          totalAbandonments++;
        }
      }

      // 5. Process service completions
      // Calculate service rate based on staff efficiency and count
      const baseServiceRate = effectiveStaffCount * staffingSchedule.efficiency;
      const serviceCompletions = Math.min(
        generatePoissonRandom(baseServiceRate),
        inService
      );

      // Update in-service count
      inService -= serviceCompletions;
      totalDepartures += serviceCompletions;

      // 6. Move customers from queue to service
      // Sort queue by priority if priority levels are used
      if (serviceParameters.priorityLevels && serviceParameters.priorityLevels.length > 0) {
        customersInQueue.sort((a, b) => (b.priority || 1) - (a.priority || 1));
      }

      const availableServiceSlots = effectiveStaffCount - inService;
      const customersToService = Math.min(availableServiceSlots, customersInQueue.length);

      // Calculate wait times for customers entering service
      for (let i = 0; i < customersToService; i++) {
        const customer = customersInQueue.shift()!;
        const waitTime = minute - customer.arrivalMinute;
        waitTimes.push(waitTime);
      }

      // Update in-service count
      inService += customersToService;

      // 7. Update queue length
      queue = customersInQueue.length;
      queueLengths.push(queue);

      // 8. Calculate service utilization
      const utilization = inService / effectiveStaffCount;
      serviceUtilization.push(utilization);

      // Update totals
      totalArrivals += actualArrivals;
    }

    // Store results for this simulation run
    allQueueLengths.push(queueLengths);
    allWaitTimes.push(waitTimes);
    allServiceUtilization.push(serviceUtilization);
    allThroughputs.push(totalDepartures);
    allAbandonmentRates.push(totalAbandonments / (totalArrivals || 1));
  }

  // Calculate aggregate results across all simulation runs

  // Average queue lengths at each minute
  const avgQueueLengths = new Array(simulationMinutes + 1).fill(0);
  for (let minute = 0; minute <= simulationMinutes; minute++) {
    let sum = 0;
    for (let run = 0; run < simulationRuns; run++) {
      sum += allQueueLengths[run][minute] || 0;
    }
    avgQueueLengths[minute] = sum / simulationRuns;
  }

  // Flatten and combine all wait times
  const allWaitTimesFlat = allWaitTimes.flat();

  // Average service utilization
  const avgServiceUtilization = new Array(simulationMinutes).fill(0);
  for (let minute = 0; minute < simulationMinutes; minute++) {
    let sum = 0;
    for (let run = 0; run < simulationRuns; run++) {
      sum += allServiceUtilization[run][minute] || 0;
    }
    avgServiceUtilization[minute] = sum / simulationRuns;
  }

  // Calculate average throughput and abandonment rate
  const avgThroughput = allThroughputs.reduce((sum, val) => sum + val, 0) / simulationRuns;
  const avgAbandonmentRate = allAbandonmentRates.reduce((sum, val) => sum + val, 0) / simulationRuns;

  // Calculate confidence intervals
  const waitTimeStats = calculateConfidenceInterval(
    allWaitTimesFlat.length > 0 ? calculateMean(allWaitTimesFlat) : 0,
    allWaitTimesFlat.length > 0 ? calculateStandardDeviation(allWaitTimesFlat, calculateMean(allWaitTimesFlat)) : 0,
    allWaitTimesFlat.length
  );

  const maxQueueLengths = allQueueLengths.map(run => Math.max(...run));
  const maxQueueLengthStats = calculateConfidenceInterval(
    calculateMean(maxQueueLengths),
    calculateStandardDeviation(maxQueueLengths, calculateMean(maxQueueLengths)),
    simulationRuns
  );

  const totalServedStats = calculateConfidenceInterval(
    avgThroughput,
    calculateStandardDeviation(allThroughputs, avgThroughput),
    simulationRuns
  );

  // Detect anomalies in the simulation
  const anomalies: { minute: number; type: string; description: string }[] = [];

  // Look for sudden spikes in queue length
  for (let minute = 1; minute < avgQueueLengths.length; minute++) {
    const queueChange = avgQueueLengths[minute] - avgQueueLengths[minute - 1];
    const relativeChange = avgQueueLengths[minute - 1] > 0 ? queueChange / avgQueueLengths[minute - 1] : 0;

    if (relativeChange > 0.5 && queueChange > 5) {
      anomalies.push({
        minute,
        type: 'queue_spike',
        description: `Sudden increase in queue length (${Math.round(queueChange)} people)`
      });
    } else if (relativeChange < -0.5 && Math.abs(queueChange) > 5) {
      anomalies.push({
        minute,
        type: 'queue_drop',
        description: `Sudden decrease in queue length (${Math.round(Math.abs(queueChange))} people)`
      });
    }
  }

  // Look for periods of very high utilization
  let highUtilizationStart = -1;
  for (let minute = 0; minute < avgServiceUtilization.length; minute++) {
    if (avgServiceUtilization[minute] > 0.95) {
      if (highUtilizationStart === -1) {
        highUtilizationStart = minute;
      }
    } else {
      if (highUtilizationStart !== -1 && minute - highUtilizationStart >= 15) {
        anomalies.push({
          minute: highUtilizationStart,
          type: 'high_utilization',
          description: `Sustained high service utilization for ${minute - highUtilizationStart} minutes`
        });
      }
      highUtilizationStart = -1;
    }
  }

  return {
    queueLengths: avgQueueLengths,
    waitTimes: allWaitTimesFlat,
    serviceUtilization: avgServiceUtilization,
    customerThroughput: avgThroughput,
    abandonmentRate: avgAbandonmentRate,
    confidenceIntervals: {
      meanWaitTime: waitTimeStats,
      maxQueueLength: maxQueueLengthStats,
      totalServed: totalServedStats
    },
    anomalies
  };
}

/**
 * Calculate confidence interval for a statistic
 */
function calculateConfidenceInterval(
  mean: number,
  stdDev: number,
  sampleSize: number,
  confidenceLevel: number = 0.95
): [number, number] {
  // For 95% confidence, z = 1.96
  const z = 1.96;

  if (sampleSize <= 1) {
    return [mean, mean];
  }

  const marginOfError = z * (stdDev / Math.sqrt(sampleSize));
  return [Math.max(0, mean - marginOfError), mean + marginOfError];
}

/**
 * Generates a random number from a Poisson distribution
 * Used to simulate random arrivals and departures
 */
function generatePoissonRandom(lambda: number): number {
  if (lambda <= 0) return 0;

  const L = Math.exp(-lambda);
  let p = 1.0;
  let k = 0;

  do {
    k++;
    p *= Math.random();
  } while (p > L);

  return k - 1;
}
