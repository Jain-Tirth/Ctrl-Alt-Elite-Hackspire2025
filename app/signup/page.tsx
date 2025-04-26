"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '../context/SessionContext';
import { NotificationManager } from '../components/Notification';

export default function SignupPage() {
  const router = useRouter();
  const { login, session } = useSession();
  const notificationManager = NotificationManager.getInstance();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    plan: 'free',
    userType: 'customer' // Default to customer signup
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (session.isLoggedIn) {
      // Redirect based on user type
      redirectBasedOnUserType(session.userType);
    }
  }, [session, router]);

  // Function to redirect based on user type
  const redirectBasedOnUserType = (userType: string) => {
    switch (userType) {
      case 'admin':
        router.push('/analytics');
        break;
      case 'staff':
        router.push('/staff-dashboard');
        break;
      case 'customer':
        router.push('/customer-dashboard');
        break;
      default:
        router.push('/');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create user data for session
      const userData = {
        userType: formData.userType as 'admin' | 'customer' | 'staff',
        userId: `user_${Math.random().toString(36).substring(2, 9)}`,
        userName: formData.name,
        email: formData.email
      };

      // Set the session
      login(userData);

      // Show success notification
      notificationManager.show({
        message: `Successfully signed up as ${userData.userType}`,
        type: 'success',
        duration: 3000
      });

      // Redirect based on user type
      redirectBasedOnUserType(userData.userType);

      // Set success state (this will not be shown as we're redirecting)
      setSuccess(true);
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: '28rem', margin: '4rem auto', padding: '1.5rem', backgroundColor: '#1f2937', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', color: '#10b981', marginBottom: '1.5rem' }}>Signup Successful!</h2>
        <p style={{ color: '#d1d5db', marginBottom: '1.5rem', textAlign: 'center' }}>
          Thank you for signing up for QueueWise Pro. Please check your email to verify your account.
        </p>
        <div style={{ textAlign: 'center' }}>
          <Link
            href="/"
            style={{ display: 'inline-block', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.375rem', textDecoration: 'none' }}
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '28rem', margin: '4rem auto', padding: '1.5rem', backgroundColor: '#1f2937', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', color: 'white', marginBottom: '1.5rem' }}>Create Your Account</h2>

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
          <label htmlFor="name" style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem' }}>Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
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
          <label htmlFor="email" style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem' }}>Email Address</label>
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
          <label htmlFor="password" style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem' }}>Password</label>
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
          <label htmlFor="confirmPassword" style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem' }}>Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
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
          <label htmlFor="company" style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem' }}>Company (Optional)</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
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
          <label htmlFor="userType" style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem' }}>Account Type</label>
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

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="plan" style={{ display: 'block', color: '#d1d5db', marginBottom: '0.5rem' }}>Select Plan</label>
          <select
            id="plan"
            name="plan"
            value={formData.plan}
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
            <option value="free">Free Plan</option>
            <option value="pro">Pro Plan ($29/month)</option>
            <option value="enterprise">Enterprise Plan ($99/month)</option>
          </select>
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
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center', color: '#9ca3af' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: '#60a5fa' }}>
          Log in
        </Link>
      </p>
    </div>
  );
}
