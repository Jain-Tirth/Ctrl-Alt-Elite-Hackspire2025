import * as Ably from 'ably';
import { ServiceCenter, QueueStats, AnomalyDetection } from './queue-models';

// Ably API key from environment variables
// Using a temporary API key for demo purposes - in production, use environment variables
const ABLY_API_KEY = process.env.ABLY_API_KEY || 'DEMO_API_KEY_FOR_TESTING';

// Initialize Ably client
let ably: Ably.Realtime | null = null;

// Channel names
export const CHANNELS = {
  QUEUE_STATUS: 'queue-status',
  WAIT_TIMES: 'wait-times',
  ANOMALIES: 'anomalies',
  NOTIFICATIONS: 'notifications',
};

/**
 * Initialize Ably client with token authentication
 */
// Track connection state globally
let ablyConnectionFailed = true; // Start with failed state until proven otherwise
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 2;

// Mock Ably client for fallback
let mockAbly: any = null;

// Create a mock Ably client that simulates the real thing but doesn't make any network requests
function createMockAbly() {
  if (mockAbly) return mockAbly;

  // Create a mock channel class
  class MockChannel {
    name: string;
    eventHandlers: Record<string, Array<(message: any) => void>>;

    constructor(name: string) {
      this.name = name;
      this.eventHandlers = {};
    }

    subscribe(eventName: string, callback: (message: any) => void) {
      if (!this.eventHandlers[eventName]) {
        this.eventHandlers[eventName] = [];
      }
      this.eventHandlers[eventName].push(callback);
      return true;
    }

    unsubscribe(eventName: string, callback: (message: any) => void) {
      if (this.eventHandlers[eventName]) {
        this.eventHandlers[eventName] = this.eventHandlers[eventName].filter(cb => cb !== callback);
      }
    }

    publish(eventName: string, data: any) {
      console.log(`[Mock Ably] Publishing to ${this.name}:${eventName}`, data);
      return Promise.resolve();
    }

    on() { /* Mock implementation */ }
    off() { /* Mock implementation */ }
  }

  // Create a mock connection
  const mockConnection = {
    state: 'connected',
    on: (event: string, callback: () => void) => {
      if (event === 'connected') {
        // Immediately trigger the connected event
        setTimeout(callback, 100);
      }
    }
  };

  // Create a mock channels object
  const mockChannels = {
    channels: {} as Record<string, MockChannel>,
    get: function(channelName: string) {
      if (!this.channels[channelName]) {
        this.channels[channelName] = new MockChannel(channelName);
      }
      return this.channels[channelName];
    }
  };

  // Create the mock Ably client
  mockAbly = {
    connection: mockConnection,
    channels: mockChannels,
    close: () => { console.log('[Mock Ably] Connection closed'); }
  };

  return mockAbly;
}

export function initAbly() {
  if (typeof window === 'undefined') return null; // Don't initialize on server

  // If we've already determined the connection has failed after multiple attempts, use mock
  if (ablyConnectionFailed) {
    console.log('Using mock Ably client for real-time updates');
    return createMockAbly();
  }

  try {
    if (!ably) {
      const clientId = `user-${Math.random().toString(36).substring(2, 9)}`;

      // Add a random parameter to avoid caching issues with the token endpoint
      const authUrl = `/api/ably-token?clientId=${clientId}&rnd=${Math.random() * 10000000000000000}`;

      console.log('Initializing Ably with auth URL:', authUrl);

      // Create Ably client with more options for better error handling
      ably = new Ably.Realtime({
        authUrl: authUrl,
        clientId: clientId,
        autoConnect: true,
        recover: function(lastConnectionDetails, cb) {
          // Don't try to recover failed connections
          cb(false);
        },
        disconnectedRetryTimeout: 2000,  // 2 seconds
        suspendedRetryTimeout: 5000,     // 5 seconds
        httpRequestTimeout: 10000,       // 10 seconds
        realtimeRequestTimeout: 5000,    // 5 seconds
      });

      // Log connection state changes
      ably.connection.on('connected', () => {
        console.log('Ably connected successfully');
        // Reset connection attempts on successful connection
        connectionAttempts = 0;
        ablyConnectionFailed = false;
      });

      ably.connection.on('disconnected', () => {
        console.log('Ably disconnected, will automatically try to reconnect');
      });

      ably.connection.on('suspended', () => {
        console.warn('Ably connection suspended, will try to reconnect later');
        // After suspension, we'll switch to mock data
        if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
          ablyConnectionFailed = true;
          ably.close();
          ably = null;
          console.log('Switching to mock Ably client after suspension');
        }
      });

      ably.connection.on('failed', (err) => {
        console.error('Ably connection failed, switching to mock client');
        ablyConnectionFailed = true;

        // Close the real connection and switch to mock
        if (ably) {
          ably.close();
          ably = null;
        }
      });

      ably.connection.on('error', (err) => {
        console.error('Ably connection error, incrementing attempt counter');
        connectionAttempts++;

        if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
          console.log(`Failed to connect to Ably after ${MAX_CONNECTION_ATTEMPTS} attempts`);
          ablyConnectionFailed = true;

          // Close the real connection and switch to mock
          if (ably) {
            ably.close();
            ably = null;
          }
        }
      });
    }

    // If we have a real Ably instance, return it
    if (ably) {
      return ably;
    }

    // Otherwise return the mock
    return createMockAbly();
  } catch (error) {
    console.error('Error initializing Ably, using mock client:', error);
    ablyConnectionFailed = true;
    return createMockAbly();
  }
}

/**
 * Get an Ably channel
 * @param channelName Name of the channel to get
 * @returns Ably channel
 */
export function getChannel(channelName: string): any {
  try {
    const realtime = initAbly();
    if (!realtime) return null;

    // Get the channel (works with both real and mock Ably)
    const channel = realtime.channels.get(channelName);

    // If this is a real Ably channel, add error handler
    if (typeof channel.on === 'function') {
      try {
        channel.on('error', (err: any) => {
          console.error(`Error in channel ${channelName}:`, err);
        });
      } catch (err) {
        // Ignore errors when adding error handlers
      }
    }

    return channel;
  } catch (error) {
    console.error(`Error getting channel ${channelName}:`, error);
    return null;
  }
}

/**
 * Subscribe to a channel
 * @param channelName Name of the channel to subscribe to
 * @param eventName Name of the event to subscribe to
 * @param callback Callback function to execute when event is received
 * @returns Unsubscribe function
 */
export function subscribeToChannel(
  channelName: string,
  eventName: string,
  callback: (message: any) => void
): (() => void) | null {
  try {
    const channel = getChannel(channelName);
    if (!channel) return null;

    // For mock Ably client
    if (ablyConnectionFailed) {
      console.log(`[Mock] Subscribing to ${channelName}:${eventName}`);

      // For mock channels, we just register the callback
      try {
        const result = channel.subscribe(eventName, (message: any) => {
          try {
            // For mock channels, the message might not have a data property
            const data = message.data || message;
            callback(data);
          } catch (callbackError) {
            console.error(`Error in callback for ${channelName}/${eventName}:`, callbackError);
          }
        });

        // Return unsubscribe function for mock
        return () => {
          try {
            channel.unsubscribe(eventName, callback);
          } catch (unsubscribeError) {
            console.error(`Error unsubscribing from ${channelName}/${eventName}:`, unsubscribeError);
          }
        };
      } catch (mockError) {
        console.error(`Error in mock subscription for ${channelName}/${eventName}:`, mockError);
        return null;
      }
    }

    // For real Ably client
    // Check if channel is in a failed state
    if (channel.state === 'failed') {
      console.warn(`Channel ${channelName} is in a failed state. Cannot subscribe.`);
      return null;
    }

    // Handle channel errors
    let errorHandler: ((err: any) => void) | null = null;

    try {
      errorHandler = (err: any) => {
        console.error(`Error in channel ${channelName}:`, err);
      };

      channel.on('error', errorHandler);
    } catch (errorHandlerError) {
      console.warn(`Could not add error handler to channel ${channelName}:`, errorHandlerError);
      errorHandler = null;
    }

    // Use a try-catch block for the subscription
    try {
      channel.subscribe(eventName, (message: any) => {
        try {
          callback(message.data);
        } catch (callbackError) {
          console.error(`Error in callback for ${channelName}/${eventName}:`, callbackError);
        }
      });
    } catch (subscribeError) {
      console.error(`Failed to subscribe to ${channelName}/${eventName}:`, subscribeError);
      if (errorHandler) {
        try {
          channel.off('error', errorHandler);
        } catch (offError) {
          // Ignore errors when removing error handlers
        }
      }
      return null;
    }

    // Return unsubscribe function
    return () => {
      try {
        channel.unsubscribe(eventName, callback);
        if (errorHandler) {
          channel.off('error', errorHandler);
        }
      } catch (unsubscribeError) {
        console.error(`Error unsubscribing from ${channelName}/${eventName}:`, unsubscribeError);
      }
    };
  } catch (error) {
    console.error(`Error in subscribeToChannel for ${channelName}/${eventName}:`, error);
    return null;
  }
}

/**
 * Publish to a channel
 * @param channelName Name of the channel to publish to
 * @param eventName Name of the event to publish
 * @param data Data to publish
 */
export async function publishToChannel(
  channelName: string,
  eventName: string,
  data: any
): Promise<void> {
  try {
    const channel = getChannel(channelName);
    if (!channel) return;

    // For mock Ably client
    if (ablyConnectionFailed) {
      console.log(`[Mock] Publishing to ${channelName}:${eventName}`, data);

      // For mock channels, we just log the publish
      try {
        await channel.publish(eventName, data);
        return;
      } catch (mockError) {
        console.error(`Error in mock publish for ${channelName}/${eventName}:`, mockError);
        return;
      }
    }

    // For real Ably client
    // Check if channel is in a failed state
    if (channel.state === 'failed') {
      console.warn(`Channel ${channelName} is in a failed state. Cannot publish.`);
      return;
    }

    await channel.publish(eventName, data);
  } catch (error) {
    console.error(`Error publishing to ${channelName}/${eventName}:`, error);
  }
}

/**
 * Subscribe to service center updates
 * @param callback Callback function to execute when service centers are updated
 * @returns Unsubscribe function
 */
export function subscribeToServiceCenters(
  callback: (centers: ServiceCenter[]) => void
): (() => void) | null {
  return subscribeToChannel(CHANNELS.QUEUE_STATUS, 'update', callback);
}

/**
 * Subscribe to wait time updates
 * @param centerId ID of the service center to subscribe to
 * @param callback Callback function to execute when wait time is updated
 * @returns Unsubscribe function
 */
export function subscribeToWaitTime(
  centerId: number,
  callback: (waitTime: number) => void
): (() => void) | null {
  return subscribeToChannel(CHANNELS.WAIT_TIMES, `center-${centerId}`, callback);
}

/**
 * Subscribe to queue stats updates
 * @param callback Callback function to execute when queue stats are updated
 * @returns Unsubscribe function
 */
export function subscribeToQueueStats(
  callback: (stats: QueueStats) => void
): (() => void) | null {
  return subscribeToChannel(CHANNELS.QUEUE_STATUS, 'stats', callback);
}

/**
 * Subscribe to anomaly alerts
 * @param callback Callback function to execute when an anomaly is detected
 * @returns Unsubscribe function
 */
export function subscribeToAnomalies(
  callback: (anomaly: AnomalyDetection) => void
): (() => void) | null {
  return subscribeToChannel(CHANNELS.ANOMALIES, 'detected', callback);
}

/**
 * Subscribe to user notifications
 * @param userId ID of the user to subscribe to notifications for
 * @param callback Callback function to execute when a notification is received
 * @returns Unsubscribe function
 */
export function subscribeToNotifications(
  userId: string,
  callback: (notification: { message: string; type: string }) => void
): (() => void) | null {
  return subscribeToChannel(CHANNELS.NOTIFICATIONS, `user-${userId}`, callback);
}

/**
 * Send a notification to a user
 * @param userId ID of the user to send the notification to
 * @param message Notification message
 * @param type Notification type (info, warning, error)
 */
export async function sendNotification(
  userId: string,
  message: string,
  type: 'info' | 'warning' | 'error' = 'info'
): Promise<void> {
  await publishToChannel(
    CHANNELS.NOTIFICATIONS,
    `user-${userId}`,
    { message, type }
  );
}

/**
 * Update service center data in real-time
 * @param center Updated service center data
 */
export async function updateServiceCenter(center: ServiceCenter): Promise<void> {
  // Publish to queue status channel
  await publishToChannel(CHANNELS.QUEUE_STATUS, 'update', [center]);

  // Also publish to wait times channel
  await publishToChannel(
    CHANNELS.WAIT_TIMES,
    `center-${center.id}`,
    center.waitTime
  );
}

/**
 * Update all service centers in real-time
 * @param centers Updated service center data
 */
export async function updateAllServiceCenters(centers: ServiceCenter[]): Promise<void> {
  // Publish to queue status channel
  await publishToChannel(CHANNELS.QUEUE_STATUS, 'update', centers);

  // Also publish individual wait times
  for (const center of centers) {
    await publishToChannel(
      CHANNELS.WAIT_TIMES,
      `center-${center.id}`,
      center.waitTime
    );
  }
}

/**
 * Update queue stats in real-time
 * @param stats Updated queue stats
 */
export async function updateQueueStats(stats: QueueStats): Promise<void> {
  await publishToChannel(CHANNELS.QUEUE_STATUS, 'stats', stats);
}

/**
 * Publish an anomaly alert
 * @param anomaly Anomaly detection data
 */
export async function publishAnomaly(anomaly: AnomalyDetection): Promise<void> {
  await publishToChannel(CHANNELS.ANOMALIES, 'detected', anomaly);
}
