"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../context/SessionContext';
import { NotificationManager } from '../components/Notification';
import '../theme.css';
import './customer-dashboard.css';

export default function CustomerDashboard() {
  const router = useRouter();
  const { session } = useSession();
  const notificationManager = NotificationManager.getInstance();

  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(null);
  const [queueLength, setQueueLength] = useState(0);
  const [isInQueue, setIsInQueue] = useState(false);
  const [services, setServices] = useState([
    { id: 1, name: 'General Inquiry', waitTime: 10, queueLength: 5 },
    { id: 2, name: 'Technical Support', waitTime: 15, queueLength: 8 },
    { id: 3, name: 'Account Services', waitTime: 5, queueLength: 3 },
    { id: 4, name: 'Returns & Exchanges', waitTime: 12, queueLength: 6 }
  ]);
  const [selectedService, setSelectedService] = useState<number | null>(null);

  // Check if user is logged in and is a customer
  useEffect(() => {
    if (!session.isLoggedIn) {
      router.push('/login');
      return;
    }

    if (session.userType !== 'customer') {
      router.push('/');
      notificationManager.show({
        message: 'You do not have access to the customer dashboard',
        type: 'error'
      });
      return;
    }
  }, [session, router, notificationManager]);

  // Join queue function
  const joinQueue = () => {
    if (!selectedService) {
      notificationManager.show({
        message: 'Please select a service first',
        type: 'warning'
      });
      return;
    }

    // Get the selected service
    const service = services.find(s => s.id === selectedService);
    if (!service) return;

    // Simulate joining queue
    setIsInQueue(true);
    setQueuePosition(service.queueLength + 1);
    setEstimatedWaitTime(service.waitTime);
    setQueueLength(service.queueLength + 1);

    // Update the service queue length
    setServices(services.map(s =>
      s.id === selectedService
        ? { ...s, queueLength: s.queueLength + 1 }
        : s
    ));

    // Show notification
    notificationManager.show({
      message: `You have joined the queue for ${service.name}`,
      type: 'success'
    });

    // Set up notifications for waiting time updates
    if (service.waitTime > 1) {
      // Notify when half the waiting time has passed
      if (service.waitTime > 2) {
        setTimeout(() => {
          notificationManager.show({
            message: `You're halfway through your wait time. Estimated time remaining: ${Math.ceil(service.waitTime / 2)} minutes.`,
            type: 'info',
            duration: 8000
          });
        }, Math.floor(service.waitTime / 2) * 60 * 1000);
      }

      // Notify when there are 5 minutes left (if wait time is more than 5 minutes)
      if (service.waitTime > 5) {
        setTimeout(() => {
          notificationManager.show({
            message: `Only 5 minutes left until your turn! Please stay nearby.`,
            type: 'info',
            duration: 8000
          });
        }, (service.waitTime - 5) * 60 * 1000);
      }

      // Notify when there's 1 minute left
      setTimeout(() => {
        notificationManager.show({
          message: `Your turn is coming up in about a minute! Please prepare to be served.`,
          type: 'warning',
          duration: 15000
        });
      }, (service.waitTime - 1) * 60 * 1000);
    }

    // Simulate queue progress
    const interval = setInterval(() => {
      setQueuePosition(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);

          // When it's their turn
          if (prev === 1) {
            setIsInQueue(false);
            setQueuePosition(null);
            setEstimatedWaitTime(null);

            notificationManager.show({
              message: `It's your turn now! Please proceed to the service counter.`,
              type: 'success',
              duration: 0 // Won't auto-dismiss
            });
          }

          return prev === null ? null : prev - 1;
        }
        return prev - 1;
      });

      setEstimatedWaitTime(prev => {
        if (prev === null || prev <= 2) return prev === null ? null : 0;
        return prev - 2;
      });

      setQueueLength(prev => Math.max(0, prev - 1));
    }, 120000); // Update every 2 minutes

    return () => clearInterval(interval);
  };

  // Leave queue function
  const leaveQueue = () => {
    setIsInQueue(false);
    setQueuePosition(null);
    setEstimatedWaitTime(null);

    // Update the service queue length
    if (selectedService) {
      setServices(services.map(s =>
        s.id === selectedService
          ? { ...s, queueLength: Math.max(0, s.queueLength - 1) }
          : s
      ));
    }

    notificationManager.show({
      message: 'You have left the queue',
      type: 'info'
    });
  };

  // Handle service selection
  const handleServiceSelect = (serviceId: number) => {
    if (isInQueue) {
      notificationManager.show({
        message: 'You are already in a queue. Please leave the current queue first.',
        type: 'warning'
      });
      return;
    }

    setSelectedService(serviceId);
  };

  if (!session.isLoggedIn || session.userType !== 'customer') {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <h1>Customer Queue Dashboard</h1>
        <p>Welcome, {session.userName}!</p>
      </div>

      <div className="dashboard-content">
        <div className="queue-status-card">
          <h2>Your Queue Status</h2>

          {isInQueue ? (
            <div className="in-queue">
              <div className="queue-info">
                <div className="queue-position">
                  <span className="label">Your Position</span>
                  <span className="value">{queuePosition}</span>
                </div>

                <div className="wait-time">
                  <span className="label">Estimated Wait</span>
                  <span className="value">{estimatedWaitTime} min</span>
                </div>

                <div className="queue-length">
                  <span className="label">People in Queue</span>
                  <span className="value">{queueLength}</span>
                </div>
              </div>

              <div className="queue-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${queuePosition && queueLength
                        ? 100 - (queuePosition / (queueLength + 1)) * 100
                        : 0}%`
                    }}
                    role="progressbar"
                    aria-label="Queue progress"
                  ></div>
                </div>
                <div className="progress-labels">
                  <span>Joined</span>
                  <span>Your Turn</span>
                </div>
              </div>

              <button
                type="button"
                className="leave-queue-btn"
                onClick={leaveQueue}
              >
                Leave Queue
              </button>
            </div>
          ) : (
            <div className="not-in-queue">
              <p>You are not currently in any queue.</p>

              <div className="service-selection">
                <h3>Select a Service</h3>
                <div className="service-list">
                  {services.map(service => (
                    <div
                      key={service.id}
                      className={`service-card ${selectedService === service.id ? 'selected' : ''}`}
                      onClick={() => handleServiceSelect(service.id)}
                    >
                      <h4>{service.name}</h4>
                      <div className="service-info">
                        <span>Wait: ~{service.waitTime} min</span>
                        <span>Queue: {service.queueLength}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="join-queue-btn"
                  disabled={selectedService === null}
                  onClick={joinQueue}
                >
                  Join Queue
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="queue-tips-card">
          <h2>Queue Tips</h2>
          <ul>
            <li>You'll receive a notification when your turn is approaching</li>
            <li>Make sure to be ready when it's your turn</li>
            <li>If you miss your turn, you'll need to rejoin the queue</li>
            <li>You can leave the queue at any time</li>
            <li>Wait times are estimates and may vary</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
