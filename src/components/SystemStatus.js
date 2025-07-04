import React, { useState, useEffect } from 'react';

// Function to generate random status data
const generateStatusData = () => {
  const statuses = [
    { status: 'Operational', statusClass: 'status-excellent', details: 'Running smoothly' },
    { status: 'Good', statusClass: 'status-good', details: 'Functioning normally' },
    { status: 'Needs Maintenance', statusClass: 'status-warning', details: 'Reduced efficiency detected' },
    { status: 'Replace', statusClass: 'status-critical', details: 'Clogged, requires immediate replacement' },
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Function to get current timestamp
const getCurrentTimestamp = () => {
  const now = new Date();
  return now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

function SystemStatus() {
  const [components, setComponents] = useState([
    { name: 'RO Pump', ...generateStatusData(), lastChecked: getCurrentTimestamp() },
    { name: 'Membrane', ...generateStatusData(), lastChecked: getCurrentTimestamp() },
    { name: 'Feed Pump', ...generateStatusData(), lastChecked: getCurrentTimestamp() },
    { name: 'Filter PPC', ...generateStatusData(), lastChecked: getCurrentTimestamp() },
    { name: 'Flow Meter', ...generateStatusData(), lastChecked: getCurrentTimestamp() },
  ]);

  useEffect(() => {
    // Update data every 10 minutes
    const intervalId = setInterval(() => {
      setComponents([
        { name: 'RO Pump', ...generateStatusData(), lastChecked: getCurrentTimestamp() },
        { name: 'Membrane', ...generateStatusData(), lastChecked: getCurrentTimestamp() },
        { name: 'Feed Pump', ...generateStatusData(), lastChecked: getCurrentTimestamp() },
        { name: 'Filter PPC', ...generateStatusData(), lastChecked: getCurrentTimestamp() },
        { name: 'Flow Meter', ...generateStatusData(), lastChecked: getCurrentTimestamp() },
      ]);
    }, 600000); // 10 minutes in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="content-card">
      <h2>
        <i className="fas fa-cogs"></i> System Component Status
      </h2>
      <table className="status-table">
        <thead>
          <tr>
            <th>Component</th>
            <th>Status</th>
            <th>Last Checked</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {components.map((comp, index) => (
            <tr key={index}>
              <td>{comp.name}</td>
              <td><span className={`stat-status ${comp.statusClass}`}>{comp.status}</span></td>
              <td>{comp.lastChecked}</td>
              <td>{comp.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SystemStatus;