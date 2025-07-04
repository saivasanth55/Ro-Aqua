import React, { useState, useEffect } from 'react';

function Maintenance() {
  const technicians = [
    'Jane Smith',
    'Sarah Davis',
    'Laura Martinez',
    'Tom Clark',
    'Mark Anderson',
    'Lisa White',
    'John Doe',
    'Emily Brown'
  ];

  const statuses = [
    { status: 'Busy', statusClass: 'status-pending' },
    { status: 'On Leave', statusClass: 'status-overdue' },
    { status: 'Available', statusClass: 'status-completed' }
  ];

  const initialMaintenanceData = [
    { component: 'Membrane', technician: 'Jane Smith', status: 'Busy', mobile: '+91 98765-43211', email: 'jane.smith@example.com', statusClass: 'status-pending' },
    { component: 'Raw Water Tank', technician: 'Sarah Davis', status: 'On Leave', mobile: '+91-98765-43215', email: 'sarah.davis@example.com', statusClass: 'status-overdue' },
    { component: 'Membrane', technician: 'Laura Martinez', status: 'Busy', mobile: '+91-98765-43217', email: 'laura.martinez@example.com', statusClass: 'status-pending' },
    { component: 'Membrane', technician: 'Tom Clark', status: 'Available', mobile: '+91-98765-43218', email: 'tom.clark@example.com', statusClass: 'status-completed' },
    { component: 'RO Pump', technician: 'Mark Anderson', status: 'Available', mobile: '+91-98765-43220', email: 'mark.anderson@example.com', statusClass: 'status-completed' },
    { component: 'Treated-Water-Tank', technician: 'Lisa White', status: 'On Leave', mobile: '+91-98765-43221', email: 'lisa.white@example.com', statusClass: 'status-overdue' },
  ];

  const [maintenanceData, setMaintenanceData] = useState(initialMaintenanceData);

  // Function to update technician names
  const updateTechnicianNames = () => {
    setMaintenanceData(prevData =>
      prevData.map(item => ({
        ...item,
        technician: technicians[Math.floor(Math.random() * technicians.length)]
      }))
    );
  };

  // Function to update technician statuses
  const updateTechnicianStatuses = () => {
    setMaintenanceData(prevData =>
      prevData.map(item => {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        return {
          ...item,
          status: randomStatus.status,
          statusClass: randomStatus.statusClass
        };
      })
    );
  };

  // Effect for updating technician names every 1 hour
  useEffect(() => {
    updateTechnicianNames(); // Initial update
    const nameInterval = setInterval(updateTechnicianNames, 3600000); // 1 hour = 3600000 ms
    return () => clearInterval(nameInterval); // Cleanup
  }, []);

  // Effect for updating technician statuses every 10 minutes
  useEffect(() => {
    updateTechnicianStatuses(); // Initial update
    const statusInterval = setInterval(updateTechnicianStatuses, 600000); // 10 minutes = 600000 ms
    return () => clearInterval(statusInterval); // Cleanup
  }, []);

  return (
    <div className="content-card">
      <h2>
        <i className="fas fa-tools"></i> Maintenance Details
      </h2>
      <table className="maintenance-table">
        <thead>
          <tr>
            <th>Components</th>
            <th>Technician Name</th>
            <th>Technician Status</th>
            <th>Mobile No</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {maintenanceData.map((item, index) => (
            <tr key={index}>
              <td>{item.component}</td>
              <td>{item.technician}</td>
              <td><span className={`stat-status ${item.statusClass}`}>{item.status}</span></td>
              <td><a href={`tel:${item.mobile}`}>{item.mobile}</a></td>
              <td><a href={`mailto:${item.email}`}>{item.email}</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Maintenance;