"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useSession } from '../context/SessionContext';
import { NotificationManager } from '../components/Notification';
import './analytics.css';

// Dynamically import the chart component to avoid SSR issues
const RealTimeQueueChart = dynamic(
  () => import('../components/RealTimeQueueChart'),
  { ssr: false }
);

// Peak Hours Chart component
const PeakHoursChart = ({ data }: { data: { hour: string; visitors: number }[] }) => {
  const maxVisitors = Math.max(...data.map(item => item.visitors));

  return (
    <div className="peak-hours-chart">
      <div className="chart-bars">
        {data.map((item, index) => (
          <div key={index} className="chart-bar-container">
            <div
              className="chart-bar"
              style={{ height: `${(item.visitors / maxVisitors) * 100}%` }}
              data-value={item.visitors}
            ></div>
            <div className="chart-label">{item.hour}</div>
          </div>
        ))}
      </div>
      <div className="chart-y-axis">
        <div className="chart-y-label">Visitors</div>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const router = useRouter();
  const { session } = useSession();
  const notificationManager = NotificationManager.getInstance();

  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [isLoading, setIsLoading] = useState(true);
  const [peakHoursData, setPeakHoursData] = useState<{ hour: string; visitors: number }[]>([]);
  const [queueData, setQueueData] = useState({
    currentWaitTime: 0,
    averageWaitTime: 0,
    queueLength: 0,
    servedCustomers: 0,
    prediction: {
      estimatedWaitTime: 0,
      confidenceScore: 0,
      nextHourPrediction: 0,
      factors: {
        queueLengthImpact: 0,
        timeOfDayImpact: 0,
        dayOfWeekImpact: 0,
        weatherImpact: 0,
        specialOfferImpact: 0
      },
      recommendedTimeSlots: []
    }
  });

  // Mock data for demonstration
  const analyticsData = {
    day: {
      averageWaitTime: '12 min',
      totalCustomers: 142,
      peakHour: '12:00 PM - 1:00 PM',
      satisfactionScore: '4.2/5',
      serviceEfficiency: '87%'
    },
    week: {
      averageWaitTime: '15 min',
      totalCustomers: 978,
      peakHour: 'Friday, 12:00 PM - 1:00 PM',
      satisfactionScore: '4.1/5',
      serviceEfficiency: '85%'
    },
    month: {
      averageWaitTime: '17 min',
      totalCustomers: 4235,
      peakHour: 'Fridays, 12:00 PM - 1:00 PM',
      satisfactionScore: '4.0/5',
      serviceEfficiency: '83%'
    }
  };

  const currentData = analyticsData[timeRange];

  // Check if user is logged in and is an admin
  useEffect(() => {
    if (!session.isLoggedIn) {
      router.push('/login');
      return;
    }

    if (session.userType !== 'admin') {
      router.push('/');
      notificationManager.show({
        message: 'You do not have access to the analytics dashboard',
        type: 'error'
      });
      return;
    }
  }, [session, router, notificationManager]);

  // Generate and fetch data
  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        setIsLoading(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate random data for demo
        const currentWaitTime = Math.floor(Math.random() * 20) + 5;
        const averageWaitTime = Math.floor(Math.random() * 15) + 5;
        const queueLength = Math.floor(Math.random() * 20);
        const servedCustomers = Math.floor(Math.random() * 100) + 50;

        // Generate peak hours data
        const hours = [
          '9 AM', '10 AM', '11 AM', '12 PM',
          '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'
        ];

        const peakData = hours.map(hour => {
          // Create a bell curve with peak around lunch time
          let baseVisitors = 0;
          if (hour === '12 PM') {
            baseVisitors = 40;
          } else if (hour === '11 AM' || hour === '1 PM') {
            baseVisitors = 30;
          } else if (hour === '10 AM' || hour === '2 PM') {
            baseVisitors = 20;
          } else {
            baseVisitors = 10;
          }

          // Add some randomness
          const visitors = baseVisitors + Math.floor(Math.random() * 10);

          return { hour, visitors };
        });

        // Set peak hours data
        setPeakHoursData(peakData);

        // Update queue data
        setQueueData({
          currentWaitTime,
          averageWaitTime,
          queueLength,
          servedCustomers,
          prediction: {
            estimatedWaitTime: currentWaitTime + Math.floor(Math.random() * 5) - 2,
            confidenceScore: 0.7 + Math.random() * 0.25,
            nextHourPrediction: currentWaitTime + Math.floor(Math.random() * 10) - 2,
            factors: {
              queueLengthImpact: 0.4 + Math.random() * 0.4,
              timeOfDayImpact: 0.3 + Math.random() * 0.4,
              dayOfWeekImpact: 0.2 + Math.random() * 0.4,
              weatherImpact: 0.1 + Math.random() * 0.3,
              specialOfferImpact: 0
            },
            recommendedTimeSlots: [
              {
                time: '2:30 PM',
                estimatedWaitTime: Math.floor(Math.random() * 5) + 2
              },
              {
                time: '3:15 PM',
                estimatedWaitTime: Math.floor(Math.random() * 4) + 1
              },
              {
                time: '4:00 PM',
                estimatedWaitTime: Math.floor(Math.random() * 3) + 1
              }
            ]
          }
        });
      } catch (error) {
        console.error('Error fetching queue data:', error);
        notificationManager.show({
          message: 'Failed to load analytics data',
          type: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQueueData();

    // Set up polling for real-time updates
    const intervalId = setInterval(fetchQueueData, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId);
  }, [timeRange, notificationManager]);

  // Function to simulate adding a customer to the queue
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');

  const handleAddCustomer = async () => {
    try {
      setShowNotification(false);
      const response = await fetch('/api/queue-data', {
        method: 'POST'
      });
      const data = await response.json();
      setQueueData(data.queueData);

      // Show success notification
      setNotificationMessage('New customer added to queue successfully!');
      setNotificationType('success');
      setShowNotification(true);

      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding customer:', error);

      // Show error notification
      setNotificationMessage('Error adding customer to queue. Please try again.');
      setNotificationType('error');
      setShowNotification(true);

      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  const handleBookTimeSlot = (time: string, estimatedWaitTime: number) => {
    // Show success notification
    setNotificationMessage(`Time slot booked successfully for ${time} (${estimatedWaitTime} min wait)`);
    setNotificationType('success');
    setShowNotification(true);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1rem', position: 'relative' }}>
      {/* Notification */}
      {showNotification && (
        <div
          style={{
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            backgroundColor: notificationType === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: 50,
            maxWidth: '300px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          {notificationType === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          )}
          <div>
            {notificationMessage}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Queue Analytics Dashboard</h1>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setTimeRange('day')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: timeRange === 'day' ? 'var(--accent-yellow)' : '#374151',
              color: timeRange === 'day' ? 'black' : '#d1d5db',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Day
          </button>
          <button
            onClick={() => setTimeRange('week')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: timeRange === 'week' ? 'var(--accent-yellow)' : '#374151',
              color: timeRange === 'week' ? 'black' : '#d1d5db',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: timeRange === 'month' ? 'var(--accent-yellow)' : '#374151',
              color: timeRange === 'month' ? 'black' : '#d1d5db',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Month
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: '#1f2937',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#9ca3af', marginBottom: '0.5rem' }}>Current Wait Time</h3>
          <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#60a5fa' }}>
            {isLoading ? '...' : `${queueData.currentWaitTime} min`}
          </p>
        </div>

        <div style={{
          backgroundColor: '#1f2937',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#9ca3af', marginBottom: '0.5rem' }}>Average Wait Time</h3>
          <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#60a5fa' }}>
            {isLoading ? '...' : `${queueData.averageWaitTime} min`}
          </p>
        </div>

        <div style={{
          backgroundColor: '#1f2937',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#9ca3af', marginBottom: '0.5rem' }}>Queue Length</h3>
          <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#60a5fa' }}>
            {isLoading ? '...' : queueData.queueLength}
          </p>
        </div>

        <div style={{
          backgroundColor: '#1f2937',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#9ca3af', marginBottom: '0.5rem' }}>Peak Hours Chart</h3>
          {isLoading ? (
            <p style={{ fontSize: '1rem', color: '#60a5fa' }}>Loading chart data...</p>
          ) : (
            <div style={{ height: '200px', marginTop: '1rem' }}>
              <PeakHoursChart data={peakHoursData} />
            </div>
          )}
        </div>

        <div style={{
          backgroundColor: '#1f2937',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#9ca3af', marginBottom: '0.5rem' }}>Customers Served</h3>
          <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#60a5fa' }}>
            {isLoading ? '...' : queueData.servedCustomers}
          </p>
        </div>
      </div>

      <div style={{
        backgroundColor: '#1f2937',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Queue Performance Chart (Real-time)</h2>
          <button
            onClick={handleAddCustomer}
            style={{
              backgroundColor: 'var(--accent-yellow)',
              color: 'black',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="16" y1="11" x2="22" y2="11"></line>
            </svg>
            Simulate New Customer
          </button>
        </div>

        {/* Real-time chart component */}
        <RealTimeQueueChart timeRange={timeRange} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        {/* Prediction Details */}
        <div style={{
          backgroundColor: '#1f2937',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>AI Prediction Details</h2>

          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#9ca3af', marginBottom: '0.5rem' }}>Predicted Wait Time</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
              {isLoading ? '...' : `${queueData.prediction.estimatedWaitTime} minutes`}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
              <span style={{ color: '#9ca3af', fontSize: '0.875rem', marginRight: '0.5rem' }}>Confidence:</span>
              <div style={{
                width: '100%',
                height: '0.5rem',
                backgroundColor: '#374151',
                borderRadius: '9999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(queueData.prediction.confidenceScore || 0) * 100}%`,
                  height: '100%',
                  backgroundColor: '#10b981'
                }}></div>
              </div>
              <span style={{ color: '#9ca3af', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                {isLoading ? '...' : `${Math.round((queueData.prediction.confidenceScore || 0) * 100)}%`}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#9ca3af', marginBottom: '0.5rem' }}>Next Hour Forecast</h3>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: queueData.prediction.nextHourPrediction > queueData.prediction.estimatedWaitTime ? '#ef4444' : '#10b981' }}>
                {isLoading ? '...' : `${queueData.prediction.nextHourPrediction} minutes`}
              </p>
              <span style={{
                marginLeft: '0.5rem',
                color: queueData.prediction.nextHourPrediction > queueData.prediction.estimatedWaitTime ? '#ef4444' : '#10b981',
                fontSize: '0.875rem'
              }}>
                {isLoading ? '' : queueData.prediction.nextHourPrediction > queueData.prediction.estimatedWaitTime
                  ? `(+${queueData.prediction.nextHourPrediction - queueData.prediction.estimatedWaitTime} min)`
                  : `(-${queueData.prediction.estimatedWaitTime - queueData.prediction.nextHourPrediction} min)`
                }
              </span>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#9ca3af', marginBottom: '0.5rem' }}>Prediction Factors</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Queue Length</div>
                <div style={{
                  width: '100%',
                  height: '0.5rem',
                  backgroundColor: '#374151',
                  borderRadius: '9999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(queueData.prediction.factors.queueLengthImpact || 0) * 100}%`,
                    height: '100%',
                    backgroundColor: '#3b82f6'
                  }}></div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Time of Day</div>
                <div style={{
                  width: '100%',
                  height: '0.5rem',
                  backgroundColor: '#374151',
                  borderRadius: '9999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(queueData.prediction.factors.timeOfDayImpact || 0) * 100}%`,
                    height: '100%',
                    backgroundColor: '#3b82f6'
                  }}></div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Day of Week</div>
                <div style={{
                  width: '100%',
                  height: '0.5rem',
                  backgroundColor: '#374151',
                  borderRadius: '9999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(queueData.prediction.factors.dayOfWeekImpact || 0) * 100}%`,
                    height: '100%',
                    backgroundColor: '#3b82f6'
                  }}></div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Weather</div>
                <div style={{
                  width: '100%',
                  height: '0.5rem',
                  backgroundColor: '#374151',
                  borderRadius: '9999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(queueData.prediction.factors.weatherImpact || 0) * 100}%`,
                    height: '100%',
                    backgroundColor: '#3b82f6'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Time Slots */}
        <div style={{
          backgroundColor: '#1f2937',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Recommended Time Slots</h2>

          {isLoading ? (
            <p style={{ color: '#9ca3af' }}>Loading recommendations...</p>
          ) : queueData.prediction.recommendedTimeSlots && queueData.prediction.recommendedTimeSlots.length > 0 ? (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {queueData.prediction.recommendedTimeSlots.map((slot: any, index: number) => (
                <li key={index} style={{
                  backgroundColor: '#374151',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.375rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', color: 'white' }}>{slot.time}</div>
                    <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Estimated wait: {slot.estimatedWaitTime} min</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBookTimeSlot(slot.time, slot.estimatedWaitTime)}
                    style={{
                      backgroundColor: 'var(--accent-yellow)',
                      color: 'black',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Book
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#9ca3af' }}>No recommended time slots available</p>
          )}

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              type="button"
              style={{
                backgroundColor: 'transparent',
                color: '#60a5fa',
                padding: '0.375rem 0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #4b5563',
                fontSize: '0.875rem',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              View All Available Slots
            </button>
          </div>
        </div>

        {/* Recommendations */}
        <div style={{
          backgroundColor: '#1f2937',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Recommendations</h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#d1d5db' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#10b981', marginRight: '0.5rem' }}>•</span>
              Consider adding 1-2 more staff members during the peak hour ({currentData.peakHour}) to reduce wait times.
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#10b981', marginRight: '0.5rem' }}>•</span>
              Customer satisfaction has decreased slightly compared to last {timeRange}. Review recent customer feedback.
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#10b981', marginRight: '0.5rem' }}>•</span>
              Service efficiency could be improved by optimizing the check-in process, which currently takes an average of 3 minutes.
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#10b981', marginRight: '0.5rem' }}>•</span>
              Current wait time is {isLoading ? '...' : `${queueData.currentWaitTime} minutes`}, which is {isLoading ? '...' : queueData.currentWaitTime > 10 ? 'above' : 'within'} the target range.
            </li>
            {!isLoading && queueData.prediction.nextHourPrediction > queueData.prediction.estimatedWaitTime && (
              <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#ef4444', marginRight: '0.5rem' }}>•</span>
                Wait times are predicted to increase in the next hour. Consider adding additional staff.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
