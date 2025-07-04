import React, { useState, useEffect, useRef } from 'react';

// Simulate fetching new notifications every 10 seconds
const fetchNewNotifications = () => {
  const newNotification = {
    id: Date.now(),
    type: ['critical', 'warning', 'info'][Math.floor(Math.random() * 3)],
    message: [
      'Pre-Filter Replacement Overdue',
      'Membrane Maintenance Required',
      'System Update Available',
      'Low Water Pressure Detected',
      'Filter Cartridge Stock Low',
    ][Math.floor(Math.random() * 5)],
    timestamp: new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    unread: true,
  };
  return newNotification;
};

function Header({ activePage }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'critical',
      message: 'Pre-Filter Replacement Overdue',
      timestamp: 'Jun 19, 2025, 07:21',
      unread: true,
    },
    {
      id: 2,
      type: 'warning',
      message: 'Membrane Maintenance Required',
      timestamp: 'Jul 10, 2025, 00:00',
      unread: true,
    },
    {
      id: 3,
      type: 'info',
      message: 'System Update Available',
      timestamp: 'Jun 19, 2025, 00:00',
      unread: true,
    },
  ]);

  const dropdownRef = useRef(null);
  const bellRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = fetchNewNotifications();
      setNotifications((prev) => [newNotification, ...prev]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const clearNotifications = () => setNotifications([]);

  const pageTitles = {
    Dashboard: 'Monitoring',
    SystemStatus: 'System Status',
    Maintenance: 'Maintenance',
    Reports: 'Reports',
    Notifications: 'Notifications',
    KnowledgeTips: 'Knowledge & Tips',
  };

  const pageIcons = {
    Dashboard: 'tachometer-alt',
    SystemStatus: 'cogs',
    Maintenance: 'tools',
    Reports: 'chart-bar',
    Notifications: 'bell',
    KnowledgeTips: 'book',
  };

  return (
    <div className="header">
      {/* Left Section: Title */}
      <div className="header-left">
        <h2>
          <i className={`fas fa-${pageIcons[activePage]}`}></i> Aqua-{pageTitles[activePage]}
        </h2>
      </div>

      {/* Center Section: Search */}
      <div className="header-center">
        <div className="search-container">
          <input type="text" className="search-box" placeholder="Search parameters..." />
          <i className="fas fa-search search-icon"></i>
        </div>
      </div>

      {/* Right Section: Notifications + Status */}
      <div className="header-right">
        <div className="notification-bell" onClick={toggleDropdown} title="Notifications" ref={bellRef}>
          <i className="fas fa-bell"></i>
          {notifications.filter((n) => n.unread).length > 0 && (
            <span className="notification-badge">
              {notifications.filter((n) => n.unread).length}
            </span>
          )}
        </div>

        {/* Dropdown */}
        <div className={`notification-dropdown ${isDropdownOpen ? 'show' : ''}`} ref={dropdownRef}>
          <div className="notification-dropdown-header">
            Notifications
            <span className="clear-notifications" onClick={clearNotifications}>
              Clear All
            </span>
          </div>
          <ul className="notification-dropdown-list">
            {notifications.length === 0 ? (
              <li className="notification-dropdown-item">No notifications available.</li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className={`notification-dropdown-item ${n.unread ? 'unread' : ''}`}
                  onClick={() => markNotificationRead(n.id)}
                >
                  <div className={`notification-dropdown-icon ${n.type}`}>
                    <i
                      className={`fas fa-${
                        n.type === 'critical'
                          ? 'exclamation-triangle'
                          : n.type === 'warning'
                          ? 'exclamation-circle'
                          : 'info-circle'
                      }`}
                    ></i>
                  </div>
                  <div className="notification-dropdown-content">
                    <h4>{n.message}</h4>
                    <p>{n.timestamp}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* System Status Indicator */}
        <div className="status-indicator">
          <div className="status-dot status-online"></div>
          <span>System Online</span>
        </div>
      </div>
    </div>
  );
}

export default Header;