// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Remove BrowserRouter import
import { auth } from './firebase'; // Make sure firebase.js exists in src/
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Login from './components/Login';

function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const showContent = (page) => {
    setActivePage(page);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <Routes>
        <Route
          path="/dashboard"
          element={
            user ? (
              <div className="container">
                <Sidebar
                  isCollapsed={isSidebarCollapsed}
                  toggleSidebar={toggleSidebar}
                  showContent={showContent}
                  activePage={activePage}
                />
                <div className={`content-area ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                  <Header activePage={activePage} />
                  <MainContent activePage={activePage} />
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </div>
  );
}

export default App;