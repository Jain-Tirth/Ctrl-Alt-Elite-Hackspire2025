"use client";

import { useEffect, useState } from 'react';

interface RealTimeQueueChartProps {
  timeRange: 'day' | 'week' | 'month';
}

interface DataPoint {
  time: string;
  currentWaitTime: number;
  averageWaitTime: number;
  predictedWaitTime?: number;
}

export default function RealTimeQueueChart({ timeRange }: RealTimeQueueChartProps) {
  const [data, setData] = useState<DataPoint[]>([]);
  const [maxValue, setMaxValue] = useState(20);
  const [showPrediction, setShowPrediction] = useState(true);

  // Initialize with some historical data based on timeRange
  useEffect(() => {
    // Generate historical data based on timeRange
    const newData: DataPoint[] = [];
    const now = new Date();
    const dataPoints = timeRange === 'day' ? 24 : timeRange === 'week' ? 7 : 30;

    for (let i = dataPoints; i > 0; i--) {
      const date = new Date(now);
      let timeLabel: string;

      if (timeRange === 'day') {
        date.setHours(now.getHours() - i);
        timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (timeRange === 'week') {
        date.setDate(now.getDate() - i);
        timeLabel = date.toLocaleDateString([], { weekday: 'short' });
      } else {
        date.setDate(now.getDate() - i);
        timeLabel = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }

      // Generate random historical data
      const currentWaitTime = Math.floor(Math.random() * 10) + 5;
      const averageWaitTime = Math.floor(Math.random() * 5) + 10;
      const predictedWaitTime = Math.floor(Math.random() * 15) + 5;

      newData.push({
        time: timeLabel,
        currentWaitTime,
        averageWaitTime,
        predictedWaitTime
      });
    }

    setData(newData);

    // Calculate max value for chart scaling
    const allValues = newData.flatMap(d => [d.currentWaitTime, d.averageWaitTime, d.predictedWaitTime || 0]);
    const max = Math.max(...allValues);
    setMaxValue(Math.ceil(max * 1.2)); // Add 20% padding
  }, [timeRange]);

  // Fetch real-time data from API
  useEffect(() => {
    // Initial fetch
    fetchQueueData();

    // Set up polling interval
    const intervalId = setInterval(fetchQueueData, 5000);

    return () => clearInterval(intervalId);

    async function fetchQueueData() {
      try {
        const response = await fetch('/api/queue-data');
        const queueData = await response.json();

        const now = new Date();
        let timeLabel: string;

        if (timeRange === 'day') {
          timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (timeRange === 'week') {
          timeLabel = now.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
        } else {
          timeLabel = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }

        setData(prevData => {
          const newData = [...prevData, {
            time: timeLabel,
            currentWaitTime: queueData.currentWaitTime,
            averageWaitTime: queueData.averageWaitTime,
            predictedWaitTime: queueData.prediction?.estimatedWaitTime
          }];

          // Limit the number of data points
          const maxDataPoints = timeRange === 'day' ? 24 : timeRange === 'week' ? 7 : 30;
          if (newData.length > maxDataPoints) {
            return newData.slice(-maxDataPoints);
          }
          return newData;
        });

        // Update max value if needed
        const maxNewValue = Math.max(
          queueData.currentWaitTime,
          queueData.averageWaitTime,
          queueData.prediction?.estimatedWaitTime || 0
        );
        setMaxValue(prev => Math.max(prev, Math.ceil(maxNewValue * 1.2)));
      } catch (error) {
        console.error('Error fetching queue data:', error);

        // Fallback to simulated data if API fails
        const now = new Date();
        let timeLabel: string;

        if (timeRange === 'day') {
          timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (timeRange === 'week') {
          timeLabel = now.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
        } else {
          timeLabel = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }

        const currentWaitTime = Math.floor(Math.random() * 10) + 5;
        const averageWaitTime = Math.floor(Math.random() * 5) + 10;
        const predictedWaitTime = Math.floor(Math.random() * 15) + 5;

        setData(prevData => {
          const newData = [...prevData, {
            time: timeLabel,
            currentWaitTime,
            averageWaitTime,
            predictedWaitTime
          }];

          // Limit the number of data points
          const maxDataPoints = timeRange === 'day' ? 24 : timeRange === 'week' ? 7 : 30;
          if (newData.length > maxDataPoints) {
            return newData.slice(-maxDataPoints);
          }
          return newData;
        });

        // Update max value if needed
        setMaxValue(prev => Math.max(prev, Math.ceil(Math.max(currentWaitTime, averageWaitTime, predictedWaitTime) * 1.2)));
      }
    }
  }, [timeRange]);

  // Calculate chart dimensions
  const chartWidth = 100;
  const chartHeight = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Calculate scales
  const xScale = innerWidth / (data.length - 1 || 1);
  const yScale = innerHeight / maxValue;

  // Generate path data for the lines
  const generatePath = (values: number[]) => {
    return values.map((value, i) => {
      const x = i * xScale;
      const y = innerHeight - (value * yScale);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const currentWaitTimePath = generatePath(data.map(d => d.currentWaitTime));
  const averageWaitTimePath = generatePath(data.map(d => d.averageWaitTime));
  const predictedWaitTimePath = generatePath(data.map(d => d.predictedWaitTime || 0));

  // Generate future prediction path (dashed line extending from current)
  const generateFuturePath = () => {
    if (data.length < 2) return '';

    const lastPoint = data[data.length - 1];
    const lastX = (data.length - 1) * xScale;
    const lastY = innerHeight - ((lastPoint.predictedWaitTime || 0) * yScale);

    // Create a path that extends 20% into the future
    const futureX = lastX + (xScale * 3);
    const futureY = innerHeight - ((lastPoint.predictedWaitTime || 0) * 1.1 * yScale); // Slight increase

    return `M ${lastX} ${lastY} L ${futureX} ${futureY}`;
  };

  return (
    <div style={{
      backgroundColor: '#1f2937',
      padding: '1rem',
      borderRadius: '0.5rem',
      color: 'white'
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', marginRight: '0.5rem', borderRadius: '50%' }}></div>
            <span>Current Wait Time</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', marginRight: '0.5rem', borderRadius: '50%' }}></div>
            <span>Average Wait Time</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', marginRight: '0.5rem', borderRadius: '50%' }}></div>
            <span>Predicted Wait Time</span>
            <input
              type="checkbox"
              checked={showPrediction}
              onChange={() => setShowPrediction(!showPrediction)}
              style={{ marginLeft: '0.5rem' }}
            />
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', height: '300px', width: '100%', overflow: 'hidden' }}>
        {/* Y-axis labels */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: '20px', paddingBottom: '40px' }}>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{maxValue}</div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{Math.floor(maxValue * 0.75)}</div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{Math.floor(maxValue * 0.5)}</div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{Math.floor(maxValue * 0.25)}</div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>0</div>
        </div>

        {/* Chart area */}
        <div style={{ position: 'absolute', left: '40px', right: '20px', top: '20px', bottom: '40px', borderLeft: '1px solid #4b5563', borderBottom: '1px solid #4b5563' }}>
          {/* Grid lines */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: '0%', height: '1px', backgroundColor: '#4b5563', opacity: 0.3 }}></div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '25%', height: '1px', backgroundColor: '#4b5563', opacity: 0.3 }}></div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '1px', backgroundColor: '#4b5563', opacity: 0.3 }}></div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '75%', height: '1px', backgroundColor: '#4b5563', opacity: 0.3 }}></div>

          {/* Chart lines */}
          <svg width="100%" height="100%" viewBox={`0 0 ${innerWidth} ${innerHeight}`} preserveAspectRatio="none">
            <path d={currentWaitTimePath} fill="none" stroke="#3b82f6" strokeWidth="2" />
            <path d={averageWaitTimePath} fill="none" stroke="#ef4444" strokeWidth="2" />
            {showPrediction && (
              <>
                <path d={predictedWaitTimePath} fill="none" stroke="#10b981" strokeWidth="2" />
                <path d={generateFuturePath()} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4,4" />
              </>
            )}
          </svg>

          {/* Data points */}
          {data.map((point, i) => (
            <div key={i}>
              <div
                style={{
                  position: 'absolute',
                  left: `${(i / (data.length - 1 || 1)) * 100}%`,
                  bottom: `${(point.currentWaitTime / maxValue) * 100}%`,
                  transform: 'translate(-50%, 50%)',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6'
                }}
              ></div>
              <div
                style={{
                  position: 'absolute',
                  left: `${(i / (data.length - 1 || 1)) * 100}%`,
                  bottom: `${(point.averageWaitTime / maxValue) * 100}%`,
                  transform: 'translate(-50%, 50%)',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444'
                }}
              ></div>
              {showPrediction && point.predictedWaitTime && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${(i / (data.length - 1 || 1)) * 100}%`,
                    bottom: `${(point.predictedWaitTime / maxValue) * 100}%`,
                    transform: 'translate(-50%, 50%)',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981'
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* X-axis labels */}
        <div style={{ position: 'absolute', left: '40px', right: '20px', bottom: 0, height: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: '0.5rem' }}>
          {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0 || i === data.length - 1).map((point, i) => (
            <div key={i} style={{ fontSize: '0.75rem', color: '#9ca3af', transform: 'rotate(-45deg)', transformOrigin: 'top left', whiteSpace: 'nowrap' }}>
              {point.time}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center' }}>
        Real-time queue data with AI-powered predictions
      </div>
    </div>
  );
}
