import Link from 'next/link';
import Image from 'next/image';
import './home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="container">
        <div className="home-content">
          {/* Hero Section */}
          <div className="hero-section">
            <h1 className="home-heading">
              Welcome to QueueWise Pro
            </h1>

            <p className="home-subheading">
              AI-Powered Queue Management System with real-time wait time prediction,
              intelligent time slot recommendation, and adaptive queue optimization.
            </p>

            <div className="hero-image">
              <div className="hero-overlay"></div>
              <div className="hero-content">
                <h2 className="hero-title">
                  Reduce Wait Times by up to 40%
                </h2>
                <p className="hero-description">
                  Our AI-powered prediction engine analyzes real-time data to optimize your queue management
                </p>
                <Link href="/analytics" className="button button-primary">
                  See Live Demo
                </Link>
              </div>
            </div>

            <div className="button-container">
              <Link href="/signup" className="button button-primary">
                Sign Up Free
              </Link>
              <Link href="/landing" className="button button-secondary">
                View 3D Demo
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="features-section">
            <h2 className="features-heading">
              Key Features
            </h2>

            <div className="card-container">
              <div className="card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h2 className="card-title">Real-time Wait Prediction</h2>
                <p className="card-text">Our AI algorithms predict wait times with up to 95% accuracy based on historical and real-time data.</p>
                <Link href="/features" className="card-link">
                  Learn more →
                </Link>
              </div>

              <div className="card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20v-6M6 20V10M18 20V4"></path>
                  </svg>
                </div>
                <h2 className="card-title">Advanced Analytics</h2>
                <p className="card-text">Get instant insights into queue performance, customer flow patterns, and optimization opportunities.</p>
                <Link href="/analytics" className="card-link">
                  View demo →
                </Link>
              </div>

              <div className="card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                </div>
                <h2 className="card-title">Smart Recommendations</h2>
                <p className="card-text">Receive intelligent time slot recommendations to minimize wait times and optimize resource allocation.</p>
                <Link href="/features" className="card-link">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="how-it-works-section">
            <h2 className="how-it-works-heading">
              How It Works
            </h2>

            <div className="step-container">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Data Collection</h3>
                  <p>Our system collects real-time data from your queue management system, including customer arrival rates, service times, and historical patterns.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>AI Analysis</h3>
                  <p>Our advanced machine learning algorithms analyze the data to identify patterns, predict wait times, and generate optimization recommendations.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Real-time Insights</h3>
                  <p>The system provides real-time insights and recommendations to both customers and queue managers through intuitive dashboards and notifications.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Continuous Improvement</h3>
                  <p>The system continuously learns and improves its predictions and recommendations based on new data and outcomes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div style={{
            backgroundColor: '#1f2937',
            padding: '3rem',
            borderRadius: '0.5rem',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Ready to Optimize Your Queue Management?</h2>
            <p style={{ color: '#d1d5db', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
              Join thousands of businesses that have reduced wait times, improved customer satisfaction, and optimized resource allocation with QueueWise Pro.
            </p>
            <div className="button-container" style={{ justifyContent: 'center' }}>
              <Link href="/signup" className="button button-primary">
                Get Started Today
              </Link>
              <Link href="/docs" className="button button-secondary">
                Read Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
