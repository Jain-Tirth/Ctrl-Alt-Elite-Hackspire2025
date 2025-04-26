"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../context/SessionContext';
import { NotificationManager } from '../components/Notification';
import '../theme.css';
import './staff-dashboard.css';

export default function StaffDashboard() {
  const router = useRouter();
  const { session } = useSession();
  const notificationManager = NotificationManager.getInstance();

  const [queueData, setQueueData] = useState({
    currentCustomers: [] as {
      id: string;
      name: string;
      service: string;
      waitTime: number;
      position: number;
      joinedAt: string;
    }[],
    nextCustomer: null as {
      id: string;
      name: string;
      service: string;
      waitTime: number;
      position: number;
      joinedAt: string;
    } | null,
    totalWaiting: 0,
    averageWaitTime: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in and is a staff member
  useEffect(() => {
    if (!session.isLoggedIn) {
      router.push('/login');
      return;
    }

    if (session.userType !== 'staff') {
      router.push('/');
      notificationManager.show({
        message: 'You do not have access to the staff dashboard',
        type: 'error'
      });
      return;
    }

    // Load queue data
    loadQueueData();

    // Set up polling for real-time updates
    const intervalId = setInterval(loadQueueData, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId);
  }, [session, router, notificationManager]);

  // Load queue data
  const loadQueueData = async () => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate mock data
      const mockCustomers = [
        {
          id: 'cust_1',
          name: 'John Smith',
          service: 'Technical Support',
          waitTime: 12,
          position: 1,
          joinedAt: '10:30 AM'
        },
        {
          id: 'cust_2',
          name: 'Sarah Johnson',
          service: 'Account Services',
          waitTime: 8,
          position: 2,
          joinedAt: '10:45 AM'
        },
        {
          id: 'cust_3',
          name: 'Michael Brown',
          service: 'Returns & Exchanges',
          waitTime: 15,
          position: 3,
          joinedAt: '11:00 AM'
        },
        {
          id: 'cust_4',
          name: 'Emily Davis',
          service: 'General Inquiry',
          waitTime: 5,
          position: 4,
          joinedAt: '11:15 AM'
        }
      ];

      setQueueData({
        currentCustomers: mockCustomers,
        nextCustomer: mockCustomers[0],
        totalWaiting: mockCustomers.length,
        averageWaitTime: Math.round(mockCustomers.reduce((sum, customer) => sum + customer.waitTime, 0) / mockCustomers.length)
      });
    } catch (error) {
      console.error('Error loading queue data:', error);
      notificationManager.show({
        message: 'Failed to load queue data',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle serving next customer
  const handleServeNext = () => {
    if (!queueData.nextCustomer) return;

    // Remove the next customer from the queue
    const updatedCustomers = queueData.currentCustomers.filter(
      customer => customer.id !== queueData.nextCustomer?.id
    );

    // Update positions
    const updatedCustomersWithPositions = updatedCustomers.map((customer, index) => ({
      ...customer,
      position: index + 1
    }));

    // Update queue data
    setQueueData({
      currentCustomers: updatedCustomersWithPositions,
      nextCustomer: updatedCustomersWithPositions[0] || null,
      totalWaiting: updatedCustomersWithPositions.length,
      averageWaitTime: updatedCustomersWithPositions.length
        ? Math.round(updatedCustomersWithPositions.reduce((sum, customer) => sum + customer.waitTime, 0) / updatedCustomersWithPositions.length)
        : 0
    });

    // Show notification to staff
    notificationManager.show({
      message: `Now serving ${queueData.nextCustomer.name}`,
      type: 'success',
      duration: 5000
    });

    // Simulate notification to customer
    setTimeout(() => {
      notificationManager.show({
        message: `Customer notification sent: "It's your turn now! Please proceed to the service counter."`,
        type: 'info',
        duration: 5000
      });
    }, 1000);
  };

  // Handle adding a customer
  const handleAddCustomer = () => {
    // Generate a random customer
    const services = ['Technical Support', 'Account Services', 'Returns & Exchanges', 'General Inquiry'];
    const randomService = services[Math.floor(Math.random() * services.length)];
    const randomWaitTime = Math.floor(Math.random() * 15) + 5;

    const newCustomer = {
      id: `cust_${Date.now()}`,
      name: `Customer ${Math.floor(Math.random() * 1000)}`,
      service: randomService,
      waitTime: randomWaitTime,
      position: queueData.currentCustomers.length + 1,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add to queue
    const updatedCustomers = [...queueData.currentCustomers, newCustomer];

    // Update queue data
    setQueueData({
      currentCustomers: updatedCustomers,
      nextCustomer: updatedCustomers[0] || null,
      totalWaiting: updatedCustomers.length,
      averageWaitTime: Math.round(updatedCustomers.reduce((sum, customer) => sum + customer.waitTime, 0) / updatedCustomers.length)
    });

    // Show notification to staff
    notificationManager.show({
      message: `Added ${newCustomer.name} to the queue`,
      type: 'success',
      duration: 5000
    });

    // Simulate notification to customer
    setTimeout(() => {
      notificationManager.show({
        message: `Customer notification sent: "You have been added to the queue. Your estimated wait time is ${randomWaitTime} minutes."`,
        type: 'info',
        duration: 5000
      });
    }, 1000);
  };

  if (!session.isLoggedIn || session.userType !== 'staff') {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="staff-dashboard">
      <div className="dashboard-header">
        <h1>Staff Queue Management</h1>
        <p>Welcome, {session.userName}!</p>
      </div>

      <div className="dashboard-content">
        <div className="queue-stats">
          <div className="stat-card">
            <h3>Customers Waiting</h3>
            <div className="stat-value">{queueData.totalWaiting}</div>
          </div>

          <div className="stat-card">
            <h3>Average Wait Time</h3>
            <div className="stat-value">{queueData.averageWaitTime} min</div>
          </div>

          <div className="stat-card actions">
            <button
              type="button"
              className="action-btn add"
              onClick={handleAddCustomer}
            >
              Add Customer
            </button>
            <button
              type="button"
              className="action-btn serve"
              onClick={handleServeNext}
              disabled={!queueData.nextCustomer}
            >
              Serve Next
            </button>
          </div>
        </div>

        <div className="queue-section">
          <div className="next-customer-card">
            <h2>Next Customer</h2>
            {queueData.nextCustomer ? (
              <div className="next-customer">
                <div className="customer-name">{queueData.nextCustomer.name}</div>
                <div className="customer-details">
                  <span className="service">{queueData.nextCustomer.service}</span>
                  <span className="wait-time">Waiting: {queueData.nextCustomer.waitTime} min</span>
                  <span className="joined-at">Joined: {queueData.nextCustomer.joinedAt}</span>
                </div>
                <button
                  type="button"
                  className="serve-btn"
                  onClick={handleServeNext}
                >
                  Serve Now
                </button>
              </div>
            ) : (
              <div className="no-customers">
                <p>No customers in queue</p>
              </div>
            )}
          </div>

          <div className="queue-list-card">
            <h2>Current Queue</h2>
            {isLoading ? (
              <div className="loading">Loading queue data...</div>
            ) : queueData.currentCustomers.length > 0 ? (
              <div className="queue-list">
                <div className="queue-header">
                  <div className="col position">Pos</div>
                  <div className="col name">Name</div>
                  <div className="col service">Service</div>
                  <div className="col wait-time">Wait</div>
                  <div className="col joined">Joined</div>
                </div>

                {queueData.currentCustomers.map(customer => (
                  <div key={customer.id} className="queue-item">
                    <div className="col position">{customer.position}</div>
                    <div className="col name">{customer.name}</div>
                    <div className="col service">{customer.service}</div>
                    <div className="col wait-time">{customer.waitTime} min</div>
                    <div className="col joined">{customer.joinedAt}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-customers">
                <p>Queue is empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
