"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import '../theme.css';
import './landing.css';

// Dynamically import the 3D scene component to avoid SSR issues
const QueueScene = dynamic(() => import('../components/QueueScene'), {
  ssr: false,
  loading: () => (
    <div className="scene-loading">
      <div className="loading-spinner"></div>
      <p>Loading 3D Experience...</p>
      <div className="loading-tips">
        <p>Explore a virtual service center with queue management</p>
        <p>Use the controls below to navigate different parts of the scene</p>
      </div>
    </div>
  )
});

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState({
    features: false,
    howItWorks: false,
    admin: false,
    cta: false
  });

  // Handle scroll to reveal animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Get positions of sections
      const featuresSection = document.getElementById('features');
      const howItWorksSection = document.getElementById('how-it-works');
      const adminSection = document.getElementById('admin-insights');
      const ctaSection = document.getElementById('cta');

      // Check if sections are visible
      if (featuresSection) {
        setIsVisible(prev => ({
          ...prev,
          features: featuresSection.offsetTop < scrollPosition + windowHeight * 0.8
        }));
      }

      if (howItWorksSection) {
        setIsVisible(prev => ({
          ...prev,
          howItWorks: howItWorksSection.offsetTop < scrollPosition + windowHeight * 0.8
        }));
      }

      if (adminSection) {
        setIsVisible(prev => ({
          ...prev,
          admin: adminSection.offsetTop < scrollPosition + windowHeight * 0.8
        }));
      }

      if (ctaSection) {
        setIsVisible(prev => ({
          ...prev,
          cta: ctaSection.offsetTop < scrollPosition + windowHeight * 0.8
        }));
      }

      // Update active section for navigation
      if (ctaSection && scrollPosition + windowHeight * 0.5 > ctaSection.offsetTop) {
        setActiveSection('cta');
      } else if (adminSection && scrollPosition + windowHeight * 0.5 > adminSection.offsetTop) {
        setActiveSection('admin');
      } else if (howItWorksSection && scrollPosition + windowHeight * 0.5 > howItWorksSection.offsetTop) {
        setActiveSection('how-it-works');
      } else if (featuresSection && scrollPosition + windowHeight * 0.5 > featuresSection.offsetTop) {
        setActiveSection('features');
      } else {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">QueueWise Pro</div>
        <div className="nav-links">
          <button
            className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`}
            onClick={() => scrollToSection('hero')}
          >
            Home
          </button>
          <button
            className={`nav-link ${activeSection === 'features' ? 'active' : ''}`}
            onClick={() => scrollToSection('features')}
          >
            Features
          </button>
          <button
            className={`nav-link ${activeSection === 'how-it-works' ? 'active' : ''}`}
            onClick={() => scrollToSection('how-it-works')}
          >
            How It Works
          </button>
          <button
            className={`nav-link ${activeSection === 'admin' ? 'active' : ''}`}
            onClick={() => scrollToSection('admin-insights')}
          >
            Admin Insights
          </button>
        </div>
        <div className="nav-actions">
          <Link href="/login" className="nav-login">
            Login
          </Link>
          <Link href="/signup" className="nav-signup">
            Sign Up Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            No More Waiting.
            <span className="hero-title-highlight">Experience Seamless Service</span>
            with QueueWise Pro.
          </h1>
          <p className="hero-subtitle">
            AI-Powered Queue Management System with real-time wait time prediction,
            intelligent time slot recommendation, and adaptive queue optimization.
          </p>
          <div className="hero-buttons">
            <Link href="/signup" className="hero-button primary">
              Get Started Today
            </Link>
            <Link href="/demo" className="hero-button secondary">
              Request Demo
            </Link>
          </div>
        </div>

        {/* 3D Scene */}
        <div className="hero-scene">
          <QueueScene />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`features-section ${isVisible.features ? 'visible' : ''}`}>
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className="feature-title">Smart Queue Management</h3>
            <p className="feature-description">
              Our AI algorithms optimize queue flow and reduce wait times by up to 40%, ensuring efficient service delivery.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20v-6M6 20V10M18 20V4"></path>
              </svg>
            </div>
            <h3 className="feature-title">Real-time Updates</h3>
            <p className="feature-description">
              Customers receive real-time notifications about queue status, estimated wait times, and their position in line.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3 className="feature-title">Predictive Analytics</h3>
            <p className="feature-description">
              Advanced machine learning models predict busy periods and optimize staff allocation for maximum efficiency.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="feature-title">Personalized Alerts</h3>
            <p className="feature-description">
              Customers receive personalized notifications via SMS, email, or app when their turn is approaching.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={`how-it-works-section ${isVisible.howItWorks ? 'visible' : ''}`}>
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3 className="step-title">Join the Queue</h3>
              <p className="step-description">
                Customers join the queue through a kiosk, mobile app, or website. They receive a digital ticket with estimated wait time.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3 className="step-title">Real-Time Tracking</h3>
              <p className="step-description">
                Our AI continuously updates wait time predictions based on current conditions and historical patterns.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3 className="step-title">Smart Notifications</h3>
              <p className="step-description">
                Customers receive timely alerts as their turn approaches, allowing them to return just in time for service.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3 className="step-title">Get Service Without Hassle</h3>
              <p className="step-description">
                When it's their turn, customers are directed to the appropriate service counter, minimizing wait times and confusion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Insights Section */}
      <section id="admin-insights" className={`admin-insights-section ${isVisible.admin ? 'visible' : ''}`}>
        <h2 className="section-title">Admin Insights</h2>
        <div className="admin-content">
          <div className="admin-text">
            <h3 className="admin-subtitle">Powerful Analytics Dashboard</h3>
            <p className="admin-description">
              Gain valuable insights into your queue performance with our comprehensive analytics dashboard. Monitor real-time metrics, identify patterns, and optimize your operations.
            </p>
            <ul className="admin-features">
              <li>
                <span className="admin-feature-icon">📊</span>
                <span>Real-time queue metrics and KPIs</span>
              </li>
              <li>
                <span className="admin-feature-icon">📈</span>
                <span>Historical data analysis and trend identification</span>
              </li>
              <li>
                <span className="admin-feature-icon">🔍</span>
                <span>Staff performance monitoring and optimization</span>
              </li>
              <li>
                <span className="admin-feature-icon">⚙️</span>
                <span>Customizable alerts and notifications</span>
              </li>
              <li>
                <span className="admin-feature-icon">📱</span>
                <span>Mobile-friendly interface for on-the-go management</span>
              </li>
            </ul>
          </div>
          <div className="admin-visual">
            <div className="admin-dashboard">
              <div className="dashboard-header">
                <h4>Queue Management Dashboard</h4>
                <div className="dashboard-date">Today, April 26, 2025</div>
              </div>
              <div className="dashboard-metrics">
                <div className="metric">
                  <div className="metric-value">24</div>
                  <div className="metric-label">In Queue</div>
                </div>
                <div className="metric">
                  <div className="metric-value">12m</div>
                  <div className="metric-label">Avg. Wait</div>
                </div>
                <div className="metric">
                  <div className="metric-value">87</div>
                  <div className="metric-label">Served Today</div>
                </div>
                <div className="metric">
                  <div className="metric-value">95%</div>
                  <div className="metric-label">Satisfaction</div>
                </div>
              </div>
              <div className="dashboard-chart">
                <div className="chart-header">
                  <h5>Wait Time Trend (Today)</h5>
                </div>
                <div className="chart-visual">
                  <svg width="100%" height="100%" viewBox="0 0 300 150">
                    <polyline
                      points="0,120 25,100 50,110 75,90 100,95 125,75 150,60 175,45 200,55 225,30 250,40 275,20 300,15"
                      fill="none"
                      stroke="#00FFB3"
                      strokeWidth="3"
                    />
                    <polyline
                      points="0,130 25,125 50,135 75,120 100,130 125,110 150,100 175,90 200,95 225,80 250,85 275,70 300,65"
                      fill="none"
                      stroke="#3E8EED"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                    />
                  </svg>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#00FFB3' }}></div>
                    <div className="legend-label">Actual Wait Time</div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#3E8EED' }}></div>
                    <div className="legend-label">Predicted Wait Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className={`cta-section ${isVisible.cta ? 'visible' : ''}`}>
        <div className="cta-content">
          <h2 className="cta-title">Try Our Hackathon Project!</h2>
          <p className="cta-description">
            This project was developed for the Hackspire Hackathon 2023. We've built a real-time queue management system with AI-powered wait time predictions to improve service efficiency.
          </p>
          <div className="hackathon-features">
            <div className="hackathon-feature">
              <div className="hackathon-feature-icon">🏆</div>
              <div className="hackathon-feature-text">AI-powered queue prediction</div>
            </div>
            <div className="hackathon-feature">
              <div className="hackathon-feature-icon">⚡</div>
              <div className="hackathon-feature-text">Real-time updates</div>
            </div>
            <div className="hackathon-feature">
              <div className="hackathon-feature-icon">📊</div>
              <div className="hackathon-feature-text">Interactive 3D visualization</div>
            </div>
            <div className="hackathon-feature">
              <div className="hackathon-feature-icon">🔍</div>
              <div className="hackathon-feature-text">Admin & user interfaces</div>
            </div>
          </div>
          <div className="cta-buttons">
            <Link href="/analytics" className="cta-button primary">
              Try Demo
            </Link>
            <a href="https://github.com/your-username/queuewise-pro" target="_blank" rel="noopener noreferrer" className="cta-button secondary">
              View Source Code
            </a>
          </div>
        </div>
        <div className="cta-background">
          <div className="cta-shape shape-1"></div>
          <div className="cta-shape shape-2"></div>
          <div className="cta-shape shape-3"></div>
        </div>
      </section>

      {/* Hackathon Footer */}
      <div className="hackathon-footer">
        <div className="hackathon-info">
          <div className="hackathon-logo">QueueWise Pro</div>
          <div className="hackathon-tagline">Developed for Hackspire Hackathon 2023</div>
        </div>
        <div className="team-info">
          <div className="team-name">Team: Queue Innovators</div>
          <div className="tech-stack">
            <span className="tech-item">Next.js</span>
            <span className="tech-item">React</span>
            <span className="tech-item">Three.js</span>
            <span className="tech-item">AI Prediction</span>
          </div>
        </div>
      </div>
    </div>
  );
}
