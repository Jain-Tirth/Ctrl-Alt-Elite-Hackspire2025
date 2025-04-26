import { useState, useEffect } from 'react';
import * as AblyUtils from '@/lib/ably';
import { ServiceCenter, QueueStats, AnomalyDetection } from '@/lib/queue-models';

/**
 * Hook for subscribing to service center updates
 * @returns Array of service centers
 */
export function useServiceCenters(initialCenters: ServiceCenter[] = []): ServiceCenter[] {
  const [centers, setCenters] = useState<ServiceCenter[]>(initialCenters);
  const [connectionError, setConnectionError] = useState<boolean>(false);

  useEffect(() => {
    // Initialize Ably
    AblyUtils.initAbly();

    // Subscribe to service center updates
    const unsubscribe = AblyUtils.subscribeToServiceCenters((updatedCenters) => {
      setCenters((prevCenters) => {
        // Merge updated centers with existing centers
        const centerMap = new Map(prevCenters.map(center => [center.id, center]));

        for (const center of updatedCenters) {
          centerMap.set(center.id, center);
        }

        return Array.from(centerMap.values());
      });
    });

    // If subscription failed, set connection error flag
    if (!unsubscribe) {
      console.warn('Failed to subscribe to service centers, using initial data');
      setConnectionError(true);
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // If we have a connection error and no centers, use the initial centers
  useEffect(() => {
    if (connectionError && centers.length === 0 && initialCenters.length > 0) {
      setCenters(initialCenters);
    }
  }, [connectionError, centers.length, initialCenters]);

  return centers;
}

/**
 * Hook for subscribing to wait time updates for a specific service center
 * @param centerId ID of the service center
 * @param initialWaitTime Initial wait time
 * @returns Current wait time
 */
export function useWaitTime(centerId: number, initialWaitTime: number = 0): number {
  const [waitTime, setWaitTime] = useState<number>(initialWaitTime);

  useEffect(() => {
    // Subscribe to wait time updates
    const unsubscribe = AblyUtils.subscribeToWaitTime(centerId, (updatedWaitTime) => {
      setWaitTime(updatedWaitTime);
    });

    // If subscription failed, log warning
    if (!unsubscribe) {
      console.warn(`Failed to subscribe to wait time for center ${centerId}, using initial value`);
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [centerId]);

  return waitTime;
}

/**
 * Hook for subscribing to queue stats updates
 * @param initialStats Initial queue stats
 * @returns Current queue stats
 */
export function useQueueStats(initialStats: QueueStats | null = null): QueueStats | null {
  const [stats, setStats] = useState<QueueStats | null>(initialStats);
  const [connectionError, setConnectionError] = useState<boolean>(false);

  useEffect(() => {
    // Subscribe to queue stats updates
    const unsubscribe = AblyUtils.subscribeToQueueStats((updatedStats) => {
      setStats(updatedStats);
    });

    // If subscription failed, set connection error flag
    if (!unsubscribe) {
      console.warn('Failed to subscribe to queue stats, using initial data');
      setConnectionError(true);
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // If we have a connection error and no stats, use the initial stats
  useEffect(() => {
    if (connectionError && !stats && initialStats) {
      setStats(initialStats);
    }
  }, [connectionError, stats, initialStats]);

  return stats;
}

/**
 * Hook for subscribing to anomaly alerts
 * @returns Array of anomalies
 */
export function useAnomalies(): AnomalyDetection[] {
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);

  useEffect(() => {
    // Subscribe to anomaly alerts
    const unsubscribe = AblyUtils.subscribeToAnomalies((anomaly) => {
      setAnomalies((prevAnomalies) => [...prevAnomalies, anomaly]);
    });

    // If subscription failed, log warning
    if (!unsubscribe) {
      console.warn('Failed to subscribe to anomalies');
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return anomalies;
}

/**
 * Hook for subscribing to user notifications
 * @param userId ID of the user
 * @returns Array of notifications
 */
export function useNotifications(userId: string): { message: string; type: string }[] {
  const [notifications, setNotifications] = useState<{ message: string; type: string }[]>([]);

  useEffect(() => {
    // Subscribe to user notifications
    const unsubscribe = AblyUtils.subscribeToNotifications(userId, (notification) => {
      setNotifications((prevNotifications) => [...prevNotifications, notification]);
    });

    // If subscription failed, log warning
    if (!unsubscribe) {
      console.warn(`Failed to subscribe to notifications for user ${userId}`);
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId]);

  return notifications;
}
