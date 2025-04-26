"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export function Notification({ message, type, duration = 5000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create portal element if it doesn't exist
    let element = document.getElementById('notification-portal');
    if (!element) {
      element = document.createElement('div');
      element.id = 'notification-portal';
      element.style.position = 'fixed';
      element.style.top = '20px';
      element.style.right = '20px';
      element.style.zIndex = '9999';
      document.body.appendChild(element);
    }
    setPortalElement(element);

    // Auto-close notification after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  // Get background color based on notification type
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.9)';
      case 'error':
        return 'rgba(239, 68, 68, 0.9)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.9)';
      case 'info':
        return 'rgba(59, 130, 246, 0.9)';
      default:
        return 'rgba(107, 114, 128, 0.9)';
    }
  };

  // Get icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible || !portalElement) return null;

  return createPortal(
    <div
      style={{
        backgroundColor: getBackgroundColor(),
        color: 'white',
        padding: '12px 16px',
        borderRadius: '6px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease-out forwards',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px', fontSize: '18px' }}>{getIcon()}</span>
        <span>{message}</span>
      </div>
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer',
          marginLeft: '10px',
        }}
      >
        ×
      </button>
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>,
    portalElement
  );
}

// Notification manager to handle multiple notifications
export class NotificationManager {
  private static instance: NotificationManager;
  private notifications: Array<{ id: string; props: NotificationProps }> = [];
  private listeners: Array<(notifications: Array<{ id: string; props: NotificationProps }>) => void> = [];

  private constructor() {}

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  public show(props: Omit<NotificationProps, 'onClose'>): string {
    const id = Math.random().toString(36).substring(2, 9);
    const notification = {
      id,
      props: {
        ...props,
        onClose: () => this.remove(id)
      }
    };
    
    this.notifications.push(notification);
    this.notifyListeners();
    
    return id;
  }

  public remove(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  public subscribe(listener: (notifications: Array<{ id: string; props: NotificationProps }>) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }
}

// Notification container component
export function NotificationContainer() {
  const [notifications, setNotifications] = useState<Array<{ id: string; props: NotificationProps }>>([]);
  
  useEffect(() => {
    const manager = NotificationManager.getInstance();
    const unsubscribe = manager.subscribe(setNotifications);
    
    return unsubscribe;
  }, []);
  
  if (notifications.length === 0) return null;
  
  return (
    <>
      {notifications.map(({ id, props }) => (
        <Notification key={id} {...props} />
      ))}
    </>
  );
}
