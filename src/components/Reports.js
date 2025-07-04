import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

function Reports() {
  const [reportData] = useState({
    'water-level': [
      { value: 85, timestamp: 'Jun 19, 2025, 07:21' },
      { value: 82, timestamp: 'Jun 19, 2025, 06:21' },
      { value: 88, timestamp: 'Jun 19, 2025, 05:21' },
    ],
    'ec-tds': [
      { value: 40, timestamp: 'Jun 19, 2025, 07:21' },
      { value: 45, timestamp: 'Jun 19, 2025, 06:21' },
      { value: 38, timestamp: 'Jun 19, 2025, 05:21' },
    ],
    'water-consumption': [
      { value: 500, timestamp: 'Jun 19, 2025, 07:21' },
      { value: 480, timestamp: 'Jun 19, 2025, 06:21' },
      { value: 510, timestamp: 'Jun 19, 2025, 05:21' },
    ],
    'ph-level': [
      { value: 7.1, timestamp: 'Jun 19, 2025, 07:21' },
      { value: 7.0, timestamp: 'Jun 19, 2025, 06:21' },
      { value: 7.2, timestamp: 'Jun 19, 2025, 05:21' },
    ],
    'notification': [
      { type: 'Critical', message: 'Pre-Filter Replacement Overdue', timestamp: 'Jun 19, 2025, 07:21' },
      { type: 'Warning', message: 'Membrane Maintenance Required', timestamp: 'Jul 10, 2025, 00:00' },
      { type: 'Info', message: 'System Update Available', timestamp: 'Jun 19, 2025, 00:00' },
    ],
  });

  const [formState, setFormState] = useState({
    'water-level': { startDate: '', endDate: '', showTable: false, isValid: false },
    'ec-tds': { startDate: '', endDate: '', showTable: false, isValid: false },
    'water-consumption': { startDate: '', endDate: '', showTable: false, isValid: false },
    'ph-level': { startDate: '', endDate: '', showTable: false, isValid: false },
    'notification': { startDate: '', endDate: '', showTable: false, isValid: false },
  });

  const [selectedParameter, setSelectedParameter] = useState('water-level');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDateChange = (parameter, field, value) => {
    setFormState(prev => ({
      ...prev,
      [parameter]: {
        ...prev[parameter],
        [field]: value
      }
    }));
    setErrorMessage('');
  };

  const handleParameterChange = (e) => {
    setSelectedParameter(e.target.value);
    setErrorMessage('');
  };

  const viewReport = (e) => {
    e.preventDefault();
    const { startDate, endDate } = formState[selectedParameter];
    
    if (!startDate || !endDate) {
      setErrorMessage('Please select both start and end dates.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      setErrorMessage('End date must be after start date.');
      return;
    }

    setFormState(prev => ({
      ...prev,
      [selectedParameter]: {
        ...prev[selectedParameter],
        showTable: true,
        isValid: true
      }
    }));
    setErrorMessage('');
  };

  const resetReport = () => {
    if (!formState[selectedParameter].isValid) {
      setErrorMessage('No report to reset. Please view a report first.');
      return;
    }
    setFormState(prev => ({
      ...prev,
      [selectedParameter]: {
        startDate: '',
        endDate: '',
        showTable: false,
        isValid: false
      }
    }));
    setErrorMessage('');
  };

  const downloadReportCSV = () => {
    if (!formState[selectedParameter].isValid) {
      setErrorMessage('Please view a report first by selecting valid dates.');
      return;
    }
    const data = reportData[selectedParameter];
    const unit = selectedParameter === 'water-level' ? '%' : 
                 selectedParameter === 'ec-tds' ? 'ppm' : 
                 selectedParameter === 'water-consumption' ? 'L' : 
                 selectedParameter === 'ph-level' ? '' : '';
    let csv = selectedParameter === 'notification' ? 'Type,Message,Timestamp\n' : `Value (${unit}),Timestamp\n`;
    data.forEach((row) => {
      if (selectedParameter === 'notification') {
        csv += `${row.type},"${row.message}",${row.timestamp}\n`;
      } else {
        csv += `${row.value},${row.timestamp}\n`;
      }
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedParameter}-report.csv`;
    link.click();
    setErrorMessage('');
  };

  const downloadReportPDF = () => {
    if (!formState[selectedParameter].isValid) {
      setErrorMessage('Please view a report first by selecting valid dates.');
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${selectedParameter.replace('-', ' ').toUpperCase()} REPORT`, 20, 20);
    doc.setFontSize(12);
    let y = 30;
    const data = reportData[selectedParameter];
    const unit = selectedParameter === 'water-level' ? '%' : 
                 selectedParameter === 'ec-tds' ? 'ppm' : 
                 selectedParameter === 'water-consumption' ? 'L' : 
                 selectedParameter === 'ph-level' ? '' : '';
    if (selectedParameter === 'notification') {
      doc.text('Type            Message                          Timestamp', 20, y);
      y += 10;
      data.forEach((row) => {
        doc.text(`${row.type.padEnd(15)}${row.message.padEnd(30)}${row.timestamp}`, 20, y);
        y += 10;
      });
    } else {
      doc.text(`Value (${unit})            Timestamp`, 20, y);
      y += 10;
      data.forEach((row) => {
        doc.text(`${row.value.toString().padEnd(20)}${row.timestamp}`, 20, y);
        y += 10;
      });
    }
    doc.save(`${selectedParameter}-report.pdf`);
    setErrorMessage('');
  };

  const reportForms = [
    { id: 'water-level', title: 'Water Level', unit: '%', icon: 'water' },
    { id: 'ec-tds', title: 'TDS', unit: 'ppm', icon: 'bolt' },
    { id: 'water-consumption', title: 'Water Consumption', unit: 'L', icon: 'faucet' },
    { id: 'ph-level', title: 'pH Level', unit: '', icon: 'flask' },
    { id: 'notification', title: 'Notifications', unit: '', icon: 'bell' },
  ];

  return React.createElement(
    'div',
    { className: 'content-card' },
    React.createElement(
      'h2',
      { className: 'reports-header' },
      React.createElement('i', { className: 'fas fa-chart-bar' }),
      'Reports & Analytics'
    ),
    React.createElement(
      'div',
      { className: 'report-section' },
      React.createElement(
        'div',
        { className: '' },
        React.createElement(
          'label',
          { className: 'form-label' },
          'Select Parameter:'
        ),
        React.createElement(
          'div',
          { className: 'relative' },
          React.createElement(
            'select',
            {
              value: selectedParameter,
              onChange: handleParameterChange,
              className: 'report-section select'
            },
            reportForms.map(form =>
              React.createElement(
                'option',
                { key: form.id, value: form.id },
                form.title
              )
            )
          )
        )
      ),
      React.createElement(
        'form',
        { className: 'report-form', onSubmit: viewReport },
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement(
            'label',
            { className: 'form-label' },
            'Start Date:'
          ),
          React.createElement('input', {
            type: 'datetime-local',
            id: `${selectedParameter}-start`,
            value: formState[selectedParameter].startDate,
            onChange: e => handleDateChange(selectedParameter, 'startDate', e.target.value),
            className: 'form-input'
          })
        ),
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement(
            'label',
            { className: 'form-label' },
            'End Date:'
          ),
          React.createElement('input', {
            type: 'datetime-local',
            id: `${selectedParameter}-end`,
            value: formState[selectedParameter].endDate,
            onChange: e => handleDateChange(selectedParameter, 'endDate', e.target.value),
            className: 'form-input'
          })
        ),
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement(
            'button',
            {
              type: 'submit',
              className: 'btn-view-report'
            },
            'View Report'
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: downloadReportCSV,
              className: 'btn-download-csv'
            },
            'Download CSV'
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: downloadReportPDF,
              className: 'btn-download-pdf'
            },
            'Download PDF'
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: resetReport,
              className: 'btn-reset'
            },
            'Reset'
          )
        )
      ),
      errorMessage &&
        React.createElement(
          'div',
          { className: 'error-message' },
          React.createElement('i', { className: 'fas fa-exclamation-circle' }),
          errorMessage
        ),
      formState[selectedParameter].showTable &&
        React.createElement(
          'table',
          { className: 'report-table' },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              selectedParameter === 'notification'
                ? [
                    React.createElement(
                      'th',
                      { className: '', key: 'type' },
                      'Type'
                    ),
                    React.createElement(
                      'th',
                      { className: '', key: 'message' },
                      'Message'
                    ),
                    React.createElement(
                      'th',
                      { className: '', key: 'timestamp' },
                      'Timestamp'
                    )
                  ]
                : [
                    React.createElement(
                      'th',
                      { className: '', key: 'value' },
                      `Value (${reportForms.find(form => form.id === selectedParameter).unit})`
                    ),
                    React.createElement(
                      'th',
                      { className: '', key: 'timestamp' },
                      'Timestamp'
                    )
                  ]
            )
          ),
          React.createElement(
            'tbody',
            null,
            reportData[selectedParameter].map((row, index) =>
              React.createElement(
                'tr',
                { key: index, className: '' },
                selectedParameter === 'notification'
                  ? [
                      React.createElement('td', { className: selectedParameter === 'notification' ? `status-${row.type.toLowerCase()}` : '', key: 'type' }, row.type),
                      React.createElement('td', { className: '', key: 'message' }, row.message),
                      React.createElement('td', { className: '', key: 'timestamp' }, row.timestamp)
                    ]
                  : [
                      React.createElement('td', { className: '', key: 'value' }, row.value),
                      React.createElement('td', { className: '', key: 'timestamp' }, row.timestamp)
                    ]
              )
            )
          )
        )
    )
  );
}

export default Reports;