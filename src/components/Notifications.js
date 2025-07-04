import React, { useState, useEffect, useCallback } from 'react';

// Mock function to simulate fetching new notifications with 10-second time difference
let lastTimestamp = Date.now();
const fetchNewNotifications = () => {
  lastTimestamp -= 10000; // Subtract 10 seconds (in milliseconds) for each new notification
  const newNotification = {
    id: Date.now(),
    type: ['critical', 'warning', 'info'][Math.floor(Math.random() * 3)],
    message: [
      'Pre-Filter Replacement Overdue',
      'Membrane Maintenance Required',
      'System Update Available',
      'Low Water Pressure Detected',
      'Filter Cartridge Stock Low'
    ][Math.floor(Math.random() * 5)],
    timestamp: new Date(lastTimestamp).toISOString(),
    unread: true
  };
  return newNotification;
};

// Utility function to format timestamp as relative time
const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const diffMs = now - new Date(timestamp);
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
};

const Notifications = React.memo(() => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'critical', message: 'Pre-Filter Replacement Overdue', timestamp: new Date(Date.now() - 30000).toISOString(), unread: true },
    { id: 2, type: 'warning', message: 'Membrane Maintenance Required', timestamp: new Date(Date.now() - 20000).toISOString(), unread: true },
    { id: 3, type: 'info', message: 'System Update Available', timestamp: new Date(Date.now() - 10000).toISOString(), unread: true },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch new notifications every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(true);
      const newNotification = fetchNewNotifications();
      setNotifications((prev) => {
        const updated = [newNotification, ...prev].slice(0, 10);
        setIsLoading(false);
        return updated;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }, []);

  const clearSingleNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <div className="content-card">
      <div className="notification-header">
        <h2>
          <i className="fas fa-bell"></i> Notifications
        </h2>
        <button
          onClick={clearNotifications}
          className="action-button btn-primary"
          aria-label="Clear all notifications"
        >
          Clear All
        </button>
      </div>
      {isLoading && (
        <div className="notification-loading">Loading new notification...</div>
      )}
      {notifications.length === 0 && !isLoading ? (
        <div className="notification-empty">No notifications available.</div>
      ) : (
        <table className="notification-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Message</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {notifications.slice(0, 10).map((n) => (
              <tr
                key={n.id}
                className={`notification-row ${n.unread ? 'unread' : ''}`}
                onClick={() => markNotificationRead(n.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && markNotificationRead(n.id)}
              >
                <td>
                  <div className={`notification-icon ${n.type}`}>
                    <i
                      className={`fas fa-${
                        n.type === 'critical' ? 'exclamation-triangle' : n.type === 'warning' ? 'exclamation-circle' : 'info-circle'
                      }`}
                    ></i>
                  </div>
                </td>
                <td>{n.message}</td>
                <td>{formatRelativeTime(n.timestamp)}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSingleNotification(n.id);
                    }}
                    className="action-button btn-secondary clear-notification-btn"
                    aria-label={`Clear notification: ${n.message}`}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
});

export default Notifications;