import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import drawing from '../assets/drawingss (4).png';

function Dashboard() {
  const [chartData, setChartData] = useState({
    'chart-water-level': generateSampleData('2025-06-19T00:00:00', '2025-06-19T07:21:00', 'water-level', 50, 100),
    'chart-tds': generateSampleData('2025-06-19T00:00:00', '2025-06-19T07:21:00', 'tds', 10, 100),
    'chart-water-consumption': generateSampleData('2025-06-19T00:00:00', '2025-06-19T07:21:00', 'water-consumption', 100, 1000, 120),
    'chart-ph-level': generateSampleData('2025-06-19T00:00:00', '2025-06-19T07:21:00', 'ph-level', 6.5, 8.0),
  });

  // State for stat card values
  const [waterLevel, setWaterLevel] = useState(85);
  const [tds, setTds] = useState(40);
  const [waterConsumption, setWaterConsumption] = useState(500);
  const [cumulativeConsumption, setCumulativeConsumption] = useState(0);
  const [phLevel, setPhLevel] = useState(7.1);

  const [tank1Level, setTank1Level] = useState(65);
  const [tank2Level, setTank2Level] = useState(75);
  const [motorColor, setMotorColor] = useState('green');
  const [pumpOverrideColor, setPumpOverrideColor] = useState(null);
  const [membraneHealth, setMembraneHealth] = useState(90);
  const [flowMeter1, setFlowMeter1] = useState(7);
  const [flowMeter2, setFlowMeter2] = useState(5);
  const [pressureSwitchColor, setPressureSwitchColor] = useState('red');
  const [pressureGauge1, setPressureGauge1] = useState(25);
  const [pressureGauge2, setPressureGauge2] = useState(35);
  const [pressureGauge3, setPressureGauge3] = useState(45);
  const [pressureGauge4, setPressureGauge4] = useState(15);
  const [gaugesActive, setGaugesActive] = useState(true);

  function generateSampleData(startDate, endDate, parameter, rangeMin, rangeMax, intervalMinutes = 60) {
    const data = [];
    let currentTime = new Date(startDate);
    const endTime = new Date(endDate);

    while (currentTime <= endTime) {
      const value = Math.random() * (rangeMax - rangeMin) + rangeMin;
      data.push({
        x: new Date(currentTime),
        y: parseFloat(value.toFixed(2)),
        timestamp: currentTime.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
      currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    }
    return data;
  }

  const chartConfigs = [
    {
      id: 'chart-water-level',
      title: 'Water Level',
      color: '#06b6d4',
      type: 'area',
      yAxis: { title: { text: '%' }, min: 0, max: 100 },
      unit: '%',
      statId: 'water-level-value',
    },
    {
      id: 'chart-tds',
      title: 'TDS',
      color: '#6366f1',
      type: 'line',
      yAxis: { title: { text: 'ppm' }, min: 0, max: 1000 },
      unit: 'ppm',
      statId: 'tds-value',
    },
    {
      id: 'chart-water-consumption',
      title: 'Water Consumption',
      color: '#3b82f6',
      type: 'bar',
      yAxis: { title: { text: 'Litres' }, min: 0, max: 1000 },
      unit: 'L',
      statId: 'water-consumption-value',
    },
    {
      id: 'chart-ph-level',
      title: 'pH Level',
      color: '#8b5cf6',
      type: 'line',
      yAxis: { title: { text: 'pH' }, min: 0, max: 14 },
      unit: '',
      statId: 'ph-level-value',
    },
  ];

  const thresholdData = {
    series: [
      { name: 'Current Value', data: [{ x: 'Water Level', y: waterLevel }, { x: 'TDS', y: tds }, { x: 'pH Level', y: phLevel }] },
      { name: 'Low Threshold data', data: [{ x: 'Water Level', y: 50 }, { x: 'TDS', y: 10 }, { x: 'pH Level', y: 6.5 }] },
      { name: 'High Threshold', data: [{ x: 'Water Level', y: 90 }, { x: 'TDS', y: 100 }, { x: 'pH Level', y: 8.0 }] },
    ],
    options: {
      chart: { type: 'bar', height: 350, stacked: false, toolbar: { show: true } },
      plotOptions: { bar: { horizontal: false, dataLabels: { position: 'top', enabled: true } } },
      colors: ['#10b981', '#ef4444', '#f59e0b'],
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          const units = { 'Water Level': '%', 'TDS': 'ppm', 'pH Level': '' };
          return `${val.toFixed(1)} ${units[opts.w.globals.labels[opts.dataPointIndex]] || ''}`;
        },
        style: { fontSize: '12px', fontWeight: 500, colors: ['#1f2937'] },
      },
      xaxis: {
        categories: ['Water Level', 'TDS', 'pH Level'],
        title: { text: 'Parameters', style: { color: '#6b7280', fontSize: '14px' } },
        labels: { style: { colors: '#6b7280', fontSize: '12px' } },
      },
      yaxis: {
        title: { text: 'Excess Value', style: { color: '#6b7280', fontSize: '14px' } },
        min: 0,
        max: 150,
        labels: { formatter: (val) => val.toFixed(1), style: { colors: '#6b7280', fontSize: '12px' } },
      },
      legend: { position: 'top', horizontalAlign: 'center', fontSize: '14px', fontWeight: 500, labels: { colors: '#1f2937' } },
      tooltip: { y: { formatter: (val) => `${val.toFixed(1)}` }, style: { fontSize: '12px', fontFamily: 'Segoe UI, sans-serif' } },
      grid: { borderColor: '#e5e7eb', strokeDashArray: 4 },
    },
  };

  // Update stat cards every 5 minutes
  useEffect(() => {
    const updateStats = () => {
      const newChartData = {
        'chart-water-level': generateSampleData('2025-06-19T00:00:00', '2025-06-19T07:21:00', 'water-level', 50, 100),
        'chart-tds': generateSampleData('2025-06-19T00:00:00', '2025-06-19T07:21:00', 'tds', 10, 100),
        'chart-water-consumption': generateSampleData('2025-06-19T00:00:00', '2025-06-19T07:21:00', 'water-consumption', 100, 1000, 120),
        'chart-ph-level': generateSampleData('2025-06-19T00:00:00', '2025-06-19T07:21:00', 'ph-level', 6.5, 8.0),
      };
      setChartData(newChartData);

      // Update stat card values with the latest data point
      setWaterLevel(newChartData['chart-water-level'][newChartData['chart-water-level'].length - 1].y);
      setTds(newChartData['chart-tds'][newChartData['chart-tds'].length - 1].y);
      setWaterConsumption(newChartData['chart-water-consumption'][newChartData['chart-water-consumption'].length - 1].y);
      setPhLevel(newChartData['chart-ph-level'][newChartData['chart-ph-level'].length - 1].y);
      setCumulativeConsumption(newChartData['chart-water-consumption'].reduce((sum, data) => sum + data.y, 0));
    };

    // Initial update
    updateStats();

    // Update every 5 minutes
    const interval = setInterval(updateStats, 300000);

    return () => clearInterval(interval);
  }, []);

  const updateCharts = () => {
    const fromInput = document.getElementById('date-from')?.value;
    const toInput = document.getElementById('date-to')?.value;
    if (!fromInput || !toInput) {
      alert('Please select both start and end dates.');
      return;
    }
    const fromDate = new Date(fromInput);
    const toDate = new Date(toInput);
    if (fromDate >= toDate) {
      alert('End date must be after start date.');
      return;
    }

    const newData = {
      'chart-water-level': generateSampleData(fromDate.toISOString(), toDate.toISOString(), 'water-level', 50, 100),
      'chart-tds': generateSampleData(fromDate.toISOString(), toDate.toISOString(), 'tds', 10, 100),
      'chart-water-consumption': generateSampleData(fromDate.toISOString(), toDate.toISOString(), 'water-consumption', 100, 1000, 120),
      'chart-ph-level': generateSampleData(fromDate.toISOString(), toDate.toISOString(), 'ph-level', 6.5, 8.0),
    };
    setChartData(newData);

    // Update stat card values
    setWaterLevel(newData['chart-water-level'][newData['chart-water-level'].length - 1].y);
    setTds(newData['chart-tds'][newData['chart-tds'].length - 1].y);
    setWaterConsumption(newData['chart-water-consumption'][newData['chart-water-consumption'].length - 1].y);
    setPhLevel(newData['chart-ph-level'][newData['chart-ph-level'].length - 1].y);
    setCumulativeConsumption(newData['chart-water-consumption'].reduce((sum, data) => sum + data.y, 0));
  };

  const reset2Charts = () => {
    const newData = {
      'chart-water-level': generateSampleData('2025-06-19T00:00:00', '2025-06-19T07:21:00', 'water-level', 50, 100),
      'chart-tds': generateSampleData('2025-06-19T00:00:00', '2025-06-19T07:21:00', 'tds', 10, 100),
      'chart-water-consumption': generateSampleData('2025-06-19T00:00:00', '2025-06-19T07:21:00', 'water-consumption', 100, 1000, 120),
      'chart-ph-level': generateSampleData('2025-06-19T00:00:00', '2025-06-19T07:21:00', 'ph-level', 6.5, 8.0),
    };
    setChartData(newData);

    // Update stat card values
    setWaterLevel(newData['chart-water-level'][newData['chart-water-level'].length - 1].y);
    setTds(newData['chart-tds'][newData['chart-tds'].length - 1].y);
    setWaterConsumption(newData['chart-water-consumption'][newData['chart-water-consumption'].length - 1].y);
    setPhLevel(newData['chart-ph-level'][newData['chart-ph-level'].length - 1].y);
    setCumulativeConsumption(newData['chart-water-consumption'].reduce((sum, data) => sum + data.y, 0));

    document.getElementById('date-from').value = '2025-06-19T00:00';
    document.getElementById('date-to').value = '2025-06-19T07:21';
  };

  // Update pressure gauges every 3 seconds only when gauges are active
  useEffect(() => {
    let interval;
    if (gaugesActive) {
      interval = setInterval(() => {
        setPressureGauge1(prev => parseFloat((Math.random() * (30 - 20) + 20).toFixed(1)));
        setPressureGauge2(prev => parseFloat((Math.random() * (40 - 30) + 30).toFixed(1)));
        setPressureGauge3(prev => parseFloat((Math.random() * (50 - 40) + 40).toFixed(1)));
        setPressureGauge4(prev => parseFloat((Math.random() * (20 - 10) + 10).toFixed(1)));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [gaugesActive]);

  // Update tank levels every minute
  useEffect(() => {
    const interval = setInterval(() => {
      // Tank 1 - random fluctuations
      setTank1Level(prev => {
        const change = Math.random() * 2 - 1;
        const newLevel = Math.max(0, Math.min(100, prev + change));
        return parseFloat(newLevel.toFixed(1));
      });

      // Tank 2 - gradual increase
      setTank2Level(prev => {
        if (prev >= 100) return 100;
        const newLevel = prev + (100 - 75) / 3; // Increase from 75 to 100 over 3 minutes
        return parseFloat(Math.min(100, newLevel).toFixed(1));
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // When tank 2 reaches 100%, stop gauge updates and set motor to red
  useEffect(() => {
    if (tank2Level >= 100) {
      setGaugesActive(false);
      setMotorColor('red');
      setPumpOverrideColor(null);
    }
  }, [tank2Level]);

  // After 3 minutes at 100%, reset everything
  useEffect(() => {
    let timeout;
    if (tank2Level >= 100) {
      timeout = setTimeout(() => {
        setGaugesActive(true);
        setMotorColor('green');
        setTank2Level(75); // Reset tank level to start the cycle again
      }, 180000); // 3 minutes in milliseconds
    }
    return () => clearTimeout(timeout);
  }, [tank2Level]);

  // Update membrane health when motors are red
  useEffect(() => {
    if (motorColor === 'red') {
      const possibleValues = [91, 92, 93, 94, 95];
      const randomValue = possibleValues[Math.floor(Math.random() * possibleValues.length)];
      setMembraneHealth(randomValue);
    }
  }, [motorColor]);

  // Update flow meters when motors are green
  useEffect(() => {
    let interval;
    if (motorColor === 'green') {
      interval = setInterval(() => {
        setFlowMeter1(parseFloat((Math.random() * 4 + 1).toFixed(1)));
        setFlowMeter2(parseFloat((Math.random() * 4 + 1).toFixed(1)));
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [motorColor]);

  // Update pressure switch color based on motor color
  useEffect(() => {
    setPressureSwitchColor(motorColor);
  }, [motorColor]);

  // Determine the color for pumps (override takes precedence)
  const pumpColor = pumpOverrideColor || motorColor;

  return (
    <div>
      <div className="diagram-container">
        <h2 className="diagram-header">
          <i className="fas fa-diagram-project" ></i> Reverse Osmosis System
        </h2>
        <div className="svg-container">
          <img src={drawing} alt="Reverse Osmosis Diagram" id="diagram-image" />

          
<svg id="ro-diagram" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid meet">
  {/* Other SVG elements before the tanks */}
  <text id="label-Raw-Water-tank" x="-25" y="540" fontSize="14" textAnchor="middle" className="label">Raw Water tank</text>
  {/* Place tank-1-water rect first */}
  <rect
    id="tank-1-water"
    x="-85"
    y={477 - (tank1Level / 100) * 150}
    width="114"
    height={(tank1Level / 100) * 150}
    fill={`rgba(93, 217, 255, ${tank1Level / 100})`}
    className="tank-water"
  />
  {/* Place tank-1-level text after the rect to ensure it appears above */}
  <text id="tank-1-level" x="-25" y="390" fontSize="20" textAnchor="middle" className="value" fill="#676767">{tank1Level}%</text>

  {/* Other SVG elements */}
  <text id="label-feed-pump" x="155" y="490" fontSize="14" textAnchor="middle" className="label">Feed Pump</text>
  <text id="label-sand-filter" x="310" y="430" fontSize="14" textAnchor="middle" className="label">
    <tspan x="310" dy="0">Sand</tspan>
    <tspan x="310" dy="20">Filter</tspan>
  </text>
  <text id="label-carbon-filter" x="395" y="430" fontSize="14" textAnchor="middle" className="label">
    <tspan x="395" dy="0">Carbon</tspan>
    <tspan x="395" dy="20">Filter</tspan>
  </text>
  <text id="label-water-softener" x="480" y="410" fontSize="14" textAnchor="middle" className="label">
    <tspan x="480" dy="20">Softener</tspan>
    <tspan x="480" dy="20">Filter</tspan>
  </text>
  <text id="label-filter-ppc" x="540" y="110" fontSize="14" textAnchor="middle" className="label">Filter (PPC)</text>
  <text id="label-pressure-switch" x="595" y="230" fontSize="12" textAnchor="middle" className="label">
    <tspan x="594" dy="0" fontSize="12">Pressure</tspan>
    <tspan x="594" dy="20" fontSize="12">Switch</tspan>
  </text>
  <text id="label-membrane" x="720" y="195" fontSize="14" textAnchor="middle" className="label">Membrane</text>
  <text id="membranehealth" x="790" y="195" fontSize="14" textAnchor="middle" className="value">{membraneHealth}%</text>
  <text id="label-ro-pump" x="670" y="485" fontSize="14" textAnchor="middle" className="label">RO Pump</text>
  <text id="label-mineral-water-outlet" x="810" y="420" fontSize="14" textAnchor="middle" className="label">
    <tspan x="800" dy="0">Mineral Water</tspan>
    <tspan x="800" dy="20">Outlet</tspan>
  </text>
  <text id="label-storage-tank" x="840" y="540" fontSize="13" textAnchor="middle" className="label">
    <tspan x="980" dy="0">Treated-Water</tspan>
    <tspan x="980" dy="20">Tank</tspan>
  </text>
  {/* Place tank-2-water rect first */}
  <rect
    id="tank-2-water"
    x="922"
    y={477.5 - (tank2Level / 100) * 150}
    width="114"
    height={(tank2Level / 100) * 150}
    fill={`rgba(93, 217, 255, ${tank2Level / 100})`}
    className="tank-water"
  />
  {/* Place tank-2-level text after the rect to ensure it appears above */}
  <text id="tank-2-level" x="980" y="390" fontSize="20" textAnchor="middle" className="value">{tank2Level}%</text>

  <text id="label-flow-meter1" x="1000" y="150" fontSize="13" textAnchor="middle" className="label">
    <tspan x="1000" dy="0">Flow</tspan>
    <tspan x="1000" dy="20">Meter</tspan>
  </text>
  <text id="flow-meter1" x="1000" y="200" fontSize="14" textAnchor="middle" className="value">{flowMeter1} LPM</text>
  <text id="label-flow-meter2" x="730" y="563" fontSize="13" textAnchor="middle" className="label">
    <tspan x="640" dy="0">Flow Meter</tspan>
  </text>
  <text id="flow-meter2" x="640" y="580" fontSize="5" textAnchor="middle" className="value">{flowMeter2} LPM</text>
  <text id="label-waste-water-outlet" x="870" y="20" fontSize="14" textAnchor="middle" className="label">Waste Water Outlet</text>
  <text id="label-pressure-Gauge-one" x="310" y="20" fontSize="12" textAnchor="middle" className="label">
    <tspan x="310" dy="0"> Pressure</tspan>
    <tspan x="310" dy="20">Gauge</tspan>
  </text>
  <text id="label-pressure-Gauge-two" x="395" y="20" fontSize="12" textAnchor="middle" className="label">
    <tspan x="395" dy="0">Pressure</tspan>
    <tspan x="395" dy="20">Gauge</tspan>
  </text>
  <text id="label-pressure-Gauge-three" x="477" y="20" fontSize="12" textAnchor="middle" className="label">
    <tspan x="477" dy="0">Pressure</tspan>
    <tspan x="477" dy="20">Gauge</tspan>
  </text>
  <text id="label-pressure-Gauge-four" x="195" y="40" fontSize="12" textAnchor="middle" className="label">
    <tspan x="195" dy="0">Inlet-Pressure</tspan>
    <tspan x="195" dy="20">Gauge</tspan>
  </text>
  <text id="pressure-Gauge-1" x="310" y="65" fontSize="18" textAnchor="middle" className="value">{pressureGauge1} PSI</text>
  <text id="pressure-Gauge-2" x="395" y="65" fontSize="18" textAnchor="middle" className="value">{pressureGauge2} PSI</text>
  <text id="pressure-Gauge-3" x="477" y="65" fontSize="18" textAnchor="middle" className="value">{pressureGauge3} PSI</text>
  <text id="pressure-Gauge-4-Inlet-Pressure" x="195" y="85" fontSize="18" textAnchor="middle" className="value">{pressureGauge4} PSI</text>
  <rect id="feed-tank-motor" x="93" y="418" width="42" height="32" fill={pumpColor}></rect>
  <rect id="Ro-pump-motor" x="606" y="418" width="42" height="32" fill={pumpColor}></rect>
  <circle id="pressure-switch" cx="555" cy="265" r="5" fill={pressureSwitchColor}></circle>
  <rect id="flow-meters-1" x="933" y="140" width="35" height="11" fill={motorColor === 'green' ? 'green' : 'red'}></rect>
  <rect id="flow-meters-2" x="616" y="511" width="35" height="11" fill={motorColor === 'green' ? 'green' : 'red'}></rect>
</svg>
        </div>
      </div>

      <div className="water-stats">
        <div className="stat-card water-level">
          <div className="stat-icon water-level">
            <i className="fas fa-water"></i>
          </div>
          <div className="stat-info">
            <h4 id="water-level-value">{waterLevel.toFixed(1)}%</h4>
            <p>Water Level</p>
            <div className="stat-status status-good" title="Water level is within optimal range;">Good</div>
          </div>
        </div>

        <div className="stat-card tds">
          <div className="stat-icon tds">
            <i className="fas fa-bolt"></i>
          </div>

          <div className="stat-info">
            <h4 id="tds-value">{tds.toFixed(1)} ppm</h4>
            <p>TDS</p>
            <div className="stat-status status-warning" title="TDS value is slightly elevated; check filters;">Monitor</div>
          </div>
        </div>
        <div className="stat-card water-consumption">
          <div className="stat-icon water-consumption">
            <i className="fas fa-faucet"></i>
          </div>
          <div className="stat-info">
            <h4 id="water-consumption-value">{waterConsumption.toFixed(1)} L</h4>
            <p>Water Consumption</p>
            <div className="stat-status status-good" title="Consumption is within normal limits;">Normal</div>
          </div>
        </div>
        <div className="stat-card cumulative-consumption">
          <div className="stat-icon cumulative-consumption">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-info">
            <h4 id="cumulative-consumption-value">{cumulativeConsumption.toFixed(1)} L</h4>
            <p>Cumulative Consumption</p>
            <div className="stat-status status-good" title="Total water consumption over the selected period;">Normal</div>
          </div>
        </div>
        <div className="stat-card ph-level">
          <div className="stat-icon ph-level">
            <i className="fas fa-flask"></i>
          </div>
          <div className="stat-info">
            <h4 id="ph-level-value">{phLevel.toFixed(1)}</h4>
            <p>pH Level</p>
            <div className="stat-status status-excellent" title="pH is ideal for drinking water;">Excellent</div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>
          <i className="fas fa-chart-line"></i> Parameter Trends
        </h2>
        <div className="chart-controls">
          <label>From:</label>
          <input type="datetime-local" id="date-from" defaultValue="2025-06-19T00:00" />
          <label>To:</label>
          <input type="datetime-local" id="date-to" defaultValue="2025-06-19T07:21" />
          <button onClick={updateCharts}>Update</button>
          <button className="reset-button" onClick={reset2Charts}>Reset</button>
        </div>
        <div className="chart-grid">
          {chartConfigs.map((config) => (
            <div key={config.id} className={`chart-container ${config.id.replace('chart-', '')}`}>
              <div className="chart-title">
                <i
                  className={`fas fa-${
                    config.id === 'chart-water-level'
                      ? 'water'
                      : config.id === 'chart-tds'
                      ? 'bolt'
                      : config.id === 'chart-water-consumption'
                      ? 'faucet'
                      : 'flask'
                  }`}
                ></i>
                {config.title} ({config.yAxis.title.text})
              </div>
              <Chart
                options={{
                  chart: { type: config.type, height: 250, toolbar: { show: true }, animations: { enabled: true, easing: 'easeinout', speed: 800 } },
                  colors: [config.color],
                  fill: {
                    type: config.type === 'area' ? 'gradient' : 'solid',
                    gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3, stops: [0, 90, 100] },
                  },
                  dataLabels: { enabled: false },
                  stroke: { curve: 'smooth', width: 2 },
                  xaxis: {
                    type: 'datetime',
                    labels: { datetimeUTC: false, format: 'dd MMM HH:mm', style: { colors: '#6b7280', fontSize: '12px' } },
                  },
                  yaxis: {
                    ...config.yAxis,
                    labels: {
                      style: { colors: '#6b7280', fontSize: '12px' },
                      formatter: (val) => `${val.toFixed(1)} ${config.yAxis.title.text}`,
                    },
                  },
                  tooltip: {
                    x: { format: 'dd MMM yyyy HH:mm' },
                    y: { formatter: (val) => `${val.toFixed(2)} ${config.yAxis.title.text}` },
                    theme: 'light',
                    style: { fontSize: '12px' },
                  },
                  grid: { borderColor: '#e5e7eb', strokeDashArray: 4 },
                  markers: { size: config.type === 'line' ? 4 : 0, hover: { size: 6 } },
                  legend: { show: true, position: 'top', horizontalAlign: 'right', fontSize: '14px' },
                }}
                series={[{ name: config.title, data: chartData[config.id].map((d) => ({ x: d.x, y: d.y })) }]}
                type={config.type}
                height={250}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="threshold-analysis-section">
        <div className="threshold-container">
          <div className="chart-card">
            <h2 style={{ color: '#1f2937', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-chart-bar"></i> Threshold Analysis
            </h2>
            <Chart options={thresholdData.options} series={thresholdData.series} type="bar" height={350} />
          </div>
          <div className="threshold-cards-container">
            <div className="stat-cards threshold-high">
              <div className="stat-icons threshold-high">
                <i className="fas fa-arrow-up"></i>
              </div>
              <div className="stat-infos">
                <h2 id="high-threshold-value">90%</h2>
                <p>High Threshold Limit</p>
                <div className="stat-status status-warning" style={{ textAlign: 'center' }} title="Action required if values exceed this limit;">
                  Alert
                </div>
                <p className="threshold-note">Maximum levels: Water Level (90%), TDS (100 ppm), pH (8.0). Monitor to avoid system strain.</p>
              </div>
            </div>
            <div className="stat-cards threshold-low">
              <div className="stat-icons threshold-low">
                <i className="fas fa-arrow-down"></i>
              </div>
              <div className="stat-infos">
                <h2 id="low-threshold-value">50%</h2>
                <p>Low Threshold Limit</p>
                <div className="stat-status status-warning" style={{ textAlign: 'center' }} title="Action required if values fall below this limit;">
                  Alert
                </div>
                <p className="threshold-note">Minimum levels: Water Level (50%), TDS (10 ppm), pH (6.5). Regular monitoring recommended.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
