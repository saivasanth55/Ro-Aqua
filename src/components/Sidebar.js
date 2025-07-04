import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Import from your firebase.js
import { signOut } from 'firebase/auth';

function Sidebar({ isCollapsed, toggleSidebar, showContent, activePage }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleKeyPress = (event, page) => {
    if (event.key === 'Enter') {
      showContent(page);
    }
  };

  const navItems = [
    { page: 'Dashboard', icon: 'tachometer-alt', label: 'Dashboard' },
    { page: 'Reports', icon: 'chart-bar', label: 'Reports & Analytics' },
    { page: 'SystemStatus', icon: 'cogs', label: 'System Status' },
    { page: 'Maintenance', icon: 'tools', label: 'Maintenance' },
    { page: 'Notifications', icon: 'bell', label: 'Notifications' },
    { page: 'KnowledgeTips', icon: 'book', label: 'Knowledge & Tips' },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
      <div className="logo-toggle-container">
        {!isCollapsed && (
          <img
            src={require('../assets/Task_7682639_35712196.png')}
            alt="Olive IoT Logo"
            className="sidebar-logo"
          />
        )}
        <button className="toggle-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
          <i className="fas fa-bars"></i>
        </button>
      </div>
      
      <ul className="nav-links">
        {navItems.map((item) => (
          <li
            key={item.page}
            className={activePage === item.page ? 'active' : ''}
            onClick={() => showContent(item.page)}
            onKeyPress={(e) => handleKeyPress(e, item.page)}
            tabIndex="0"
            role="button"
          >
            <i className={`fas fa-${item.icon}`}></i>
            {!isCollapsed && <span className="nav-text">{item.label}</span>}
          </li>
        ))}
      </ul>
      <div className="user-section">
        <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-tint" id="drop"></i>
          {!isCollapsed && <h2>Aqua-Monitor</h2>}
        </div>
      </div>

        <div className="user-profile">
          <div className="user-avatar">
            <i className="fas fa-user"></i>
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <span className="user-name">Home User</span>
              <span className="user-role">System Manager</span>
            </div>
          )}
        </div>
        <div className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          {!isCollapsed && <span className="nav-text">Logout</span>}
        </div>
      </div>
    </div>
  );
}

export default Sidebar; 