"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from '../context/SessionContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session, logout } = useSession();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="logo">
          QueueWise Pro
        </Link>

        {/* Desktop navigation */}
        <nav className="nav">
          {!session.isLoggedIn && (
            <>
              <Link href="/features" className="nav-link">
                Features
              </Link>
              <Link href="/pricing" className="nav-link">
                Pricing
              </Link>
              <Link href="/docs" className="nav-link">
                Documentation
              </Link>
            </>
          )}
          
          {session.isLoggedIn && session.userType === 'admin' && (
            <>
              <Link href="/analytics" className="nav-link">
                Analytics
              </Link>
              <Link href="/admin-dashboard" className="nav-link">
                Dashboard
              </Link>
            </>
          )}
          
          {session.isLoggedIn && session.userType === 'staff' && (
            <>
              <Link href="/staff-dashboard" className="nav-link">
                Queue Management
              </Link>
            </>
          )}
          
          {session.isLoggedIn && session.userType === 'customer' && (
            <>
              <Link href="/customer-dashboard" className="nav-link">
                My Queue
              </Link>
            </>
          )}
        </nav>

        {/* Auth buttons - desktop */}
        <div className="auth-buttons">
          {session.isLoggedIn ? (
            <>
              <span className="user-greeting">
                Hello, {session.userName || 'User'}
                {session.userType && <span className="user-type">({session.userType})</span>}
              </span>
              <button onClick={handleLogout} className="button button-secondary" type="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link">
                Login
              </Link>
              <Link href="/signup" className="button button-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            {!session.isLoggedIn && (
              <>
                <Link
                  href="/features"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="/pricing"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/docs"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Documentation
                </Link>
              </>
            )}
            
            {session.isLoggedIn && session.userType === 'admin' && (
              <>
                <Link
                  href="/analytics"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Analytics
                </Link>
                <Link
                  href="/admin-dashboard"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            )}
            
            {session.isLoggedIn && session.userType === 'staff' && (
              <>
                <Link
                  href="/staff-dashboard"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Queue Management
                </Link>
              </>
            )}
            
            {session.isLoggedIn && session.userType === 'customer' && (
              <>
                <Link
                  href="/customer-dashboard"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Queue
                </Link>
              </>
            )}
            
            <div className="mobile-divider"></div>

            {session.isLoggedIn ? (
              <>
                <span className="user-greeting mobile-greeting">
                  Hello, {session.userName || 'User'}
                  {session.userType && <span className="user-type">({session.userType})</span>}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="button button-secondary"
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="button button-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
