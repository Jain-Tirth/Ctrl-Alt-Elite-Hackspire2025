"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', color: '#60a5fa' }}>
        QueueWise Pro Documentation
      </h1>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Sidebar Navigation */}
        <div style={{
          width: '250px',
          flexShrink: 0,
          position: 'sticky',
          top: '2rem',
          alignSelf: 'flex-start',
          backgroundColor: '#1f2937',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Contents</h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>
              <button
                onClick={() => scrollToSection('introduction')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeSection === 'introduction' ? '#60a5fa' : '#d1d5db',
                  fontWeight: activeSection === 'introduction' ? 'bold' : 'normal',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '0.25rem 0',
                  width: '100%'
                }}
              >
                Introduction
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('getting-started')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeSection === 'getting-started' ? '#60a5fa' : '#d1d5db',
                  fontWeight: activeSection === 'getting-started' ? 'bold' : 'normal',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '0.25rem 0',
                  width: '100%'
                }}
              >
                Getting Started
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('queue-prediction')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeSection === 'queue-prediction' ? '#60a5fa' : '#d1d5db',
                  fontWeight: activeSection === 'queue-prediction' ? 'bold' : 'normal',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '0.25rem 0',
                  width: '100%'
                }}
              >
                Queue Prediction
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('analytics')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeSection === 'analytics' ? '#60a5fa' : '#d1d5db',
                  fontWeight: activeSection === 'analytics' ? 'bold' : 'normal',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '0.25rem 0',
                  width: '100%'
                }}
              >
                Analytics Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('api')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeSection === 'api' ? '#60a5fa' : '#d1d5db',
                  fontWeight: activeSection === 'api' ? 'bold' : 'normal',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '0.25rem 0',
                  width: '100%'
                }}
              >
                API Reference
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('faq')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeSection === 'faq' ? '#60a5fa' : '#d1d5db',
                  fontWeight: activeSection === 'faq' ? 'bold' : 'normal',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '0.25rem 0',
                  width: '100%'
                }}
              >
                FAQ
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div style={{ flex: '1' }}>
          {/* Introduction Section */}
          <section id="introduction" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#60a5fa' }}>Introduction</h2>
            <div style={{
              backgroundColor: '#1f2937',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                QueueWise Pro is an AI-powered queue management system designed to optimize wait times, improve customer satisfaction, and enhance operational efficiency. Our platform uses advanced machine learning algorithms to predict wait times, recommend optimal time slots, and provide real-time analytics.
              </p>
              <p style={{ lineHeight: '1.6' }}>
                This documentation provides comprehensive information about how to use QueueWise Pro, from getting started to advanced features and API integration.
              </p>
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Key Features</h3>
            <ul style={{
              backgroundColor: '#1f2937',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              listStyleType: 'disc',
              paddingLeft: '2.5rem'
            }}>
              <li style={{ marginBottom: '0.5rem' }}>Real-time wait time prediction with up to 95% accuracy</li>
              <li style={{ marginBottom: '0.5rem' }}>Intelligent time slot recommendations to minimize wait times</li>
              <li style={{ marginBottom: '0.5rem' }}>Comprehensive analytics dashboard with actionable insights</li>
              <li style={{ marginBottom: '0.5rem' }}>Automated customer notifications and updates</li>
              <li style={{ marginBottom: '0.5rem' }}>Staff allocation optimization based on predicted demand</li>
              <li>RESTful API for seamless integration with existing systems</li>
            </ul>
          </section>

          {/* Getting Started Section */}
          <section id="getting-started" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#60a5fa' }}>Getting Started</h2>
            <div style={{
              backgroundColor: '#1f2937',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>System Requirements</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                <li style={{ marginBottom: '0.5rem' }}>Internet connection</li>
                <li>For API integration: ability to make HTTP requests</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Installation</h3>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                QueueWise Pro is a cloud-based solution that requires no installation. Simply sign up for an account and you can access the platform from any device with an internet connection.
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Account Setup</h3>
              <ol style={{ listStyleType: 'decimal', paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Visit <Link href="/signup" style={{ color: '#60a5fa' }}>signup page</Link> and create an account</li>
                <li style={{ marginBottom: '0.5rem' }}>Verify your email address</li>
                <li style={{ marginBottom: '0.5rem' }}>Complete your organization profile</li>
                <li style={{ marginBottom: '0.5rem' }}>Configure your service locations and queue types</li>
                <li>Integrate with your existing systems (optional)</li>
              </ol>
            </div>
          </section>

          {/* Queue Prediction Section */}
          <section id="queue-prediction" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#60a5fa' }}>Queue Prediction</h2>
            <div style={{
              backgroundColor: '#1f2937',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>How It Works</h3>
              <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
                QueueWise Pro uses a sophisticated machine learning model to predict wait times based on various factors:
              </p>

              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Current queue length and service rate</li>
                <li style={{ marginBottom: '0.5rem' }}>Historical patterns for the day of week and time of day</li>
                <li style={{ marginBottom: '0.5rem' }}>Seasonal factors and special events</li>
                <li style={{ marginBottom: '0.5rem' }}>Weather conditions (if enabled)</li>
                <li style={{ marginBottom: '0.5rem' }}>Staff availability and efficiency</li>
                <li>Customer type mix (new vs. returning customers)</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Prediction Accuracy</h3>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                Our prediction model achieves up to 95% accuracy for short-term predictions (next 30 minutes) and 85% accuracy for longer-term predictions (1-2 hours ahead). The system continuously learns from new data to improve its accuracy over time.
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Confidence Score</h3>
              <p style={{ lineHeight: '1.6' }}>
                Each prediction includes a confidence score that indicates the reliability of the prediction. Factors that can affect confidence include:
              </p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Amount of historical data available</li>
                <li style={{ marginBottom: '0.5rem' }}>Stability of current queue conditions</li>
                <li style={{ marginBottom: '0.5rem' }}>Presence of unusual factors (special events, weather anomalies)</li>
                <li>Recent changes in service patterns</li>
              </ul>
            </div>

            <div style={{
              backgroundColor: '#1f2937',
              padding: '1.5rem',
              borderRadius: '0.5rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Using Wait Time Predictions</h3>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                QueueWise Pro provides easy-to-understand wait time predictions through our user-friendly interface. You can:
              </p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>View current estimated wait times for each service location</li>
                <li style={{ marginBottom: '0.5rem' }}>See recommended time slots with shorter wait times</li>
                <li style={{ marginBottom: '0.5rem' }}>Receive notifications when your turn is approaching</li>
                <li style={{ marginBottom: '0.5rem' }}>Book a specific time slot to minimize waiting</li>
                <li>Check prediction confidence to understand reliability</li>
              </ul>
            </div>
          </section>

          {/* Analytics Dashboard Section */}
          <section id="analytics" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#60a5fa' }}>Analytics Dashboard</h2>
            <div style={{
              backgroundColor: '#1f2937',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Dashboard Overview</h3>
              <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
                The QueueWise Pro analytics dashboard provides comprehensive insights into your queue performance, customer behavior, and operational efficiency. Key components include:
              </p>

              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}><strong>Real-time Queue Metrics:</strong> Current wait times, queue length, and service rate</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Historical Trends:</strong> Wait time patterns by day, week, and month</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Prediction Accuracy:</strong> Comparison of predicted vs. actual wait times</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Customer Satisfaction:</strong> Feedback scores and trends</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Staff Efficiency:</strong> Service time analysis by staff member or team</li>
                <li><strong>Optimization Recommendations:</strong> AI-generated suggestions for improving queue performance</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Using the Dashboard</h3>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                The dashboard is designed to be intuitive and user-friendly. You can:
              </p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Filter data by date range, location, queue type, or staff member</li>
                <li style={{ marginBottom: '0.5rem' }}>Export reports in CSV, PDF, or Excel format</li>
                <li style={{ marginBottom: '0.5rem' }}>Set up automated alerts for unusual queue conditions</li>
                <li style={{ marginBottom: '0.5rem' }}>Schedule regular report delivery via email</li>
                <li>Customize dashboard views for different user roles</li>
              </ul>
            </div>

            <div style={{
              backgroundColor: '#1f2937',
              padding: '1.5rem',
              borderRadius: '0.5rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Simulate New Customer Button</h3>
              <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                The "Simulate New Customer" button on the analytics dashboard allows you to test how adding a new customer affects the queue predictions and metrics in real-time. This feature is useful for:
              </p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Training staff on the system behavior</li>
                <li style={{ marginBottom: '0.5rem' }}>Testing queue management strategies</li>
                <li style={{ marginBottom: '0.5rem' }}>Demonstrating the system to stakeholders</li>
                <li>Validating prediction accuracy under different scenarios</li>
              </ul>
              <p style={{ lineHeight: '1.6' }}>
                When you click the button, the system adds a virtual customer to the queue and recalculates all predictions and metrics. This allows you to see how the system adapts to changing conditions without affecting your actual queue data.
              </p>
            </div>
          </section>

          {/* Integration Section */}
          <section id="api" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#60a5fa' }}>System Integration</h2>
            <div style={{
              backgroundColor: '#1f2937',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Connecting with Other Systems</h3>
              <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
                QueueWise Pro can easily connect with your existing systems through our integration options:
              </p>

              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}><strong>Pre-built Connectors:</strong> Ready-to-use integrations with popular CRM, appointment scheduling, and customer management systems</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>REST API:</strong> Secure API for custom integrations with your existing software</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Webhook Support:</strong> Real-time notifications when queue events occur</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Data Export:</strong> Export queue data in CSV, JSON, or Excel formats</li>
                <li>Contact our support team for assistance with custom integration needs</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Available Data</h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Queue Information</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}>
                  Access real-time and historical queue data including:
                </p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '0.5rem' }}>
                  <li>Current wait times by location and service type</li>
                  <li>Queue length and customer position information</li>
                  <li>Service rate and staff performance metrics</li>
                  <li>Predicted wait times and confidence scores</li>
                  <li>Recommended time slots for reduced waiting</li>
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Customer Notifications</h4>
                <p style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}>
                  Send automated notifications to customers through:
                </p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '0.5rem' }}>
                  <li>SMS text messages</li>
                  <li>Email notifications</li>
                  <li>Mobile app push notifications</li>
                  <li>Display screens in your facility</li>
                </ul>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                  Notifications can include wait time updates, position changes, and alerts when it's almost a customer's turn.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#60a5fa' }}>Frequently Asked Questions</h2>
            <div style={{
              backgroundColor: '#1f2937',
              padding: '1.5rem',
              borderRadius: '0.5rem'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>How accurate are the wait time predictions?</h3>
                <p style={{ lineHeight: '1.6' }}>
                  Our prediction model achieves up to 95% accuracy for short-term predictions (next 30 minutes) and 85% accuracy for longer-term predictions (1-2 hours ahead). The system continuously learns from new data to improve its accuracy over time.
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Can I integrate QueueWise Pro with my existing systems?</h3>
                <p style={{ lineHeight: '1.6' }}>
                  Yes, QueueWise Pro offers a comprehensive API that allows integration with most existing queue management, CRM, and appointment scheduling systems. Our team can also provide custom integration solutions for specific requirements.
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>What does the "Book" button do in the recommended time slots?</h3>
                <p style={{ lineHeight: '1.6' }}>
                  The "Book" button allows customers to reserve a specific time slot, effectively creating a virtual appointment. When a customer books a time slot, they receive a confirmation and can arrive at the specified time with minimal waiting. This helps distribute customer arrivals more evenly and reduces peak-time congestion.
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>How does the system handle unexpected surges in demand?</h3>
                <p style={{ lineHeight: '1.6' }}>
                  QueueWise Pro continuously monitors queue conditions and can detect unusual patterns. When a surge is detected, the system adjusts its predictions accordingly and can send alerts to staff. The AI also learns from these events to better predict similar situations in the future.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Is customer data secure?</h3>
                <p style={{ lineHeight: '1.6' }}>
                  Yes, QueueWise Pro takes data security seriously. All data is encrypted both in transit and at rest. We comply with GDPR, CCPA, and other relevant data protection regulations. Our system also includes role-based access controls to ensure that users can only access the data they need for their specific role.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
