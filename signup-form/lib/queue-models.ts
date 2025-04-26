// Queue Management Models

// Service Center
export interface ServiceCenter {
  id: number;
  name: string;
  address: string;
  waitTime: number;
  peopleInQueue: number;
  status: 'quiet' | 'moderate' | 'busy';
  lastUpdated: string;
  nextAvailable: string;
}

// Time Slot
export interface TimeSlot {
  id: number;
  centerId: number;
  date: string;
  time: string;
  available: boolean;
  recommended: boolean;
}

// Appointment
export interface Appointment {
  id: number;
  userId: string;
  centerId: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  purpose: string;
  createdAt: string;
}

// Queue Stats
export interface QueueStats {
  averageWaitTime: number;
  totalVisitors: number;
  waitTimeChange: number; // percentage change from previous period
  visitorChange: number; // percentage change from previous period
}

// Wait Time Prediction
export interface WaitTimePrediction {
  centerId: number;
  currentWaitTime: number;
  predictedWaitTime: number;
  confidence: number; // 0-1 value representing prediction confidence
  factors: {
    timeOfDay: number;
    dayOfWeek: number;
    staffingLevel: number;
    queueLength: number;
    averageServiceTime: number;
  };
}

// Anomaly Detection
export interface AnomalyDetection {
  centerId: number;
  type: 'wait_time_spike' | 'unusual_traffic' | 'staffing_issue';
  severity: 'low' | 'medium' | 'high';
  description: string;
  detectedAt: string;
  recommendation: string;
}

// User Preference
export interface UserPreference {
  userId: string;
  preferredCenterId: number;
  preferredDays: string[]; // e.g., ["Monday", "Wednesday"]
  preferredTimeRanges: {
    start: string; // e.g., "09:00"
    end: string; // e.g., "12:00"
  }[];
  visitHistory: {
    centerId: number;
    date: string;
    waitTime: number;
  }[];
}

// Mock data for service centers
export const mockServiceCenters: ServiceCenter[] = [
  {
    id: 1,
    name: "Downtown Service Center",
    address: "123 Main St, Downtown",
    waitTime: 24,
    peopleInQueue: 18,
    status: "moderate",
    lastUpdated: "2 min ago",
    nextAvailable: "Today, 2:30 PM"
  },
  {
    id: 2,
    name: "Westside Branch",
    address: "456 West Ave, Westside",
    waitTime: 45,
    peopleInQueue: 32,
    status: "busy",
    lastUpdated: "1 min ago",
    nextAvailable: "Today, 4:15 PM"
  },
  {
    id: 3,
    name: "Eastside Branch",
    address: "789 East Blvd, Eastside",
    waitTime: 10,
    peopleInQueue: 5,
    status: "quiet",
    lastUpdated: "3 min ago",
    nextAvailable: "Today, 1:00 PM"
  }
];

// Mock queue stats
export const mockQueueStats: QueueStats = {
  averageWaitTime: 26,
  totalVisitors: 142,
  waitTimeChange: 12, // 12% increase
  visitorChange: 5 // 5% increase
};

// Mock anomaly detections
export const mockAnomalies: AnomalyDetection[] = [
  {
    centerId: 1,
    type: "wait_time_spike",
    severity: "medium",
    description: "Unusual increase in wait times at Downtown Service Center",
    detectedAt: new Date().toISOString(),
    recommendation: "Consider visiting Eastside Branch which currently has shorter wait times"
  },
  {
    centerId: 2,
    type: "unusual_traffic",
    severity: "high",
    description: "Unexpectedly high visitor traffic at Westside Branch",
    detectedAt: new Date().toISOString(),
    recommendation: "Delay your visit or choose an alternative service center"
  }
];

// Mock wait time predictions
export const mockPredictions: WaitTimePrediction[] = [
  {
    centerId: 1,
    currentWaitTime: 24,
    predictedWaitTime: 18, // predicted to decrease
    confidence: 0.85,
    factors: {
      timeOfDay: 0.3, // afternoon tends to be less busy
      dayOfWeek: 0.2, // middle of week
      staffingLevel: 0.8, // well-staffed
      queueLength: 0.6, // moderate queue
      averageServiceTime: 0.5 // average service time
    }
  },
  {
    centerId: 2,
    currentWaitTime: 45,
    predictedWaitTime: 52, // predicted to increase
    confidence: 0.75,
    factors: {
      timeOfDay: 0.7, // peak hours
      dayOfWeek: 0.6, // busy day
      staffingLevel: 0.4, // understaffed
      queueLength: 0.9, // long queue
      averageServiceTime: 0.6 // slightly longer service time
    }
  },
  {
    centerId: 3,
    currentWaitTime: 10,
    predictedWaitTime: 8, // predicted to decrease slightly
    confidence: 0.9,
    factors: {
      timeOfDay: 0.2, // off-peak hours
      dayOfWeek: 0.3, // less busy day
      staffingLevel: 0.9, // well-staffed
      queueLength: 0.2, // short queue
      averageServiceTime: 0.4 // faster service time
    }
  }
];

// Mock user preferences
export const mockUserPreference: UserPreference = {
  userId: "demo123",
  preferredCenterId: 1,
  preferredDays: ["Monday", "Wednesday", "Friday"],
  preferredTimeRanges: [
    { start: "09:00", end: "11:00" },
    { start: "14:00", end: "16:00" }
  ],
  visitHistory: [
    { centerId: 1, date: "2023-10-15", waitTime: 20 },
    { centerId: 3, date: "2023-09-28", waitTime: 15 },
    { centerId: 1, date: "2023-09-10", waitTime: 30 }
  ]
};
