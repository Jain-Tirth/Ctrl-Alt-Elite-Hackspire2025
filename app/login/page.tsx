"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '../context/SessionContext';
import { NotificationManager } from '../components/Notification';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useSession();
  const notificationManager = NotificationManager.getInstance();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    userType: 'customer' // Default to customer login
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Check if user is already logged in
  useEffect(() => {
    // If already logged in, redirect to appropriate page
    const checkSession = async () => {
      const savedSession = localStorage.getItem('userSession');
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession);
          if (session.isLoggedIn) {
            // Redirect based on user type
            if (session.userType === 'admin') {
              router.push('/analytics');
            } else if (session.userType === 'customer') {
              router.push('/customer-dashboard');
            } else {
              router.push('/staff-dashboard');
            }
          }
        } catch (e) {
          console.error('Failed to parse session data:', e);
        }
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo purposes, create a session based on user type
      // In a real app, this would validate credentials with a backend

      // Create user data for session
      const userData = {
        userType: formData.userType as 'admin' | 'customer' | 'staff',
        userId: `user_${Math.random().toString(36).substring(2, 9)}`,
        userName: formData.email.split('@')[0],
        email: formData.email
      };

      // Set the session
      login(userData);

      // Show success notification
      notificationManager.show({
        message: `Successfully logged in as ${userData.userType}`,
        type: 'success',
        duration: 3000
      });

      // Redirect based on user type
      if (userData.userType === 'admin') {
        router.push('/analytics');
      } else if (userData.userType === 'customer') {
        router.push('/customer-dashboard');
      } else {
        router.push('/staff-dashboard');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '28rem', margin: '4rem auto', padding: '0 1rem' }}>
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1.5rem' }}>
          Log In to Your Account
        </h2>

        {error && (
          <div style={{
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            borderColor: '#ef4444',
            color: '#fca5a5',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
            border: '1px solid'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '0.375rem',
                color: 'white'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '0.375rem',
                color: 'white'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="userType" style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem' }}>
              Login As
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '0.375rem',
                color: 'white'
              }}
            >
              <option value="customer">Customer</option>
              <option value="admin">Administrator</option>
              <option value="staff">Staff Member</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                style={{
                  height: '1rem',
                  width: '1rem',
                  borderRadius: '0.25rem',
                  marginRight: '0.5rem'
                }}
              />
              <label htmlFor="rememberMe" style={{ color: '#d1d5db' }}>
                Remember me
              </label>
            </div>

            <Link href="/forgot-password" style={{ color: '#60a5fa', fontSize: '0.875rem' }}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: 'bold',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center', color: '#9ca3af' }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color: '#60a5fa' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
