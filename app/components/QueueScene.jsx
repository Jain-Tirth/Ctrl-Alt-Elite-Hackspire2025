"use client";

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import './QueueScene.css';

// Queue Person component
const QueuePerson = ({ position, color = '#3E8EED', isMoving = false, speed = 0.01 }) => {
  const ref = useRef();

  useFrame((state, delta) => {
    if (isMoving && ref.current) {
      ref.current.position.z -= speed;

      // Reset position when person reaches the counter
      if (ref.current.position.z < -5) {
        ref.current.position.z = 5;
      }
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <capsuleGeometry args={[0.2, 0.8, 4, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

// Queue Display Screen
const QueueDisplay = ({ position, rotation }) => {
  const [queueLength, setQueueLength] = useState(5);
  const [waitTime, setWaitTime] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(0.92);

  // Calculate wait time based on queue length
  useEffect(() => {
    // Only predict wait time if there's more than one person in queue
    if (queueLength <= 1) {
      setWaitTime("< 1");
      setConfidenceScore(0.99);
    } else {
      // Base time per customer (3-5 minutes)
      const baseTimePerCustomer = 3 + Math.random() * 2;

      // Add some variability based on queue length
      // Longer queues tend to be more efficient per person
      const efficiencyFactor = queueLength > 10 ? 0.8 : 1;

      // Calculate total wait time
      const calculatedWaitTime = Math.round(queueLength * baseTimePerCustomer * efficiencyFactor);

      // Set confidence score - longer predictions are less confident
      const newConfidenceScore = Math.max(0.65, 0.95 - (queueLength * 0.02));

      setWaitTime(calculatedWaitTime);
      setConfidenceScore(newConfidenceScore.toFixed(2));
    }
  }, [queueLength]);

  // Simulate queue changes
  useEffect(() => {
    const interval = setInterval(() => {
      setQueueLength(prev => {
        // Random queue length changes
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.max(0, prev + change);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <Html transform position={[0, 0, 0.06]} scale={0.15} rotation={[0, 0, 0]}>
        <div style={{
          width: '500px',
          height: '300px',
          backgroundColor: '#000',
          color: '#00FFB3',
          padding: '20px',
          fontFamily: 'monospace',
          border: '4px solid #3E8EED',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>CURRENT WAIT TIME</div>
          <div style={{ fontSize: '72px', fontWeight: 'bold' }}>{waitTime} min</div>

          <div style={{
            fontSize: '14px',
            color: '#DDE3EC',
            marginTop: '5px',
            marginBottom: '15px'
          }}>
            Queue Length: {queueLength} | Prediction Confidence: {confidenceScore}
          </div>

          {queueLength > 0 && (
            <div style={{
              marginTop: '10px',
              fontSize: '18px',
              backgroundColor: '#3E8EED',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px'
            }}>
              Next available: Counter {1 + Math.floor(Math.random() * 3)}
            </div>
          )}

          {queueLength === 0 && (
            <div style={{
              marginTop: '10px',
              fontSize: '18px',
              backgroundColor: '#00FFB3',
              color: '#111',
              padding: '10px 20px',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}>
              No Wait - All Counters Available
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

// Counter/Service Desk
const ServiceCounter = ({ position }) => {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 1, 1.5]} />
        <meshStandardMaterial color="#DDE3EC" />
      </mesh>
      <Text
        position={[0, 1.1, 0.8]}
        fontSize={0.3}
        color="#3E8EED"
        anchorX="center"
        anchorY="middle"
      >
        COUNTER
      </Text>
    </group>
  );
};

// Admin Dashboard
const AdminDashboard = ({ position, rotation }) => {
  // Generate random data for the chart
  const generateChartData = () => {
    const actualData = [];
    const predictedData = [];
    const labels = [];

    // Generate 12 data points (hours)
    for (let i = 0; i < 12; i++) {
      // Base value with some randomness
      const baseValue = 30 - i * 2 + Math.random() * 10;

      // Actual wait time (with more variation)
      actualData.push(Math.max(5, Math.round(baseValue + Math.random() * 15 - 5)));

      // Predicted wait time (smoother curve)
      predictedData.push(Math.max(5, Math.round(baseValue + Math.random() * 6 - 3)));

      // Time labels (9 AM to 8 PM)
      labels.push(`${9 + i}${i + 9 >= 12 ? 'PM' : 'AM'}`);
    }

    return { actualData, predictedData, labels };
  };

  const { actualData, predictedData, labels } = generateChartData();

  // Convert data to SVG points
  const getPoints = (data) => {
    // Scale data to fit in the 100x50 viewBox
    const maxValue = Math.max(...data) * 1.2; // Add 20% headroom
    return data.map((value, index) => {
      const x = index * (100 / (data.length - 1));
      const y = 50 - (value / maxValue) * 45; // Leave some margin at top and bottom
      return `${x},${y}`;
    }).join(' ');
  };

  const actualPoints = getPoints(actualData);
  const predictedPoints = getPoints(predictedData);

  // Current queue metrics
  const currentQueue = 8 + Math.floor(Math.random() * 10);
  const avgWait = 5 + Math.floor(Math.random() * 15);
  const served = 75 + Math.floor(Math.random() * 50);

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[2, 1.2, 0.1]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <Html transform position={[0, 0, 0.06]} scale={0.1} rotation={[0, 0, 0]}>
        <div style={{
          width: '500px',
          height: '300px',
          backgroundColor: '#111',
          color: 'white',
          padding: '15px',
          fontFamily: 'system-ui',
          borderRadius: '5px',
          overflow: 'hidden',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.5) inset'
        }}>
          <div style={{
            fontSize: '20px',
            marginBottom: '15px',
            color: '#3E8EED',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Queue Management Dashboard</span>
            <span style={{ fontSize: '14px', color: '#DDE3EC' }}>LIVE</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '10px',
              borderRadius: '5px',
              width: '30%',
              border: '1px solid #333'
            }}>
              <div style={{ fontSize: '14px', color: '#DDE3EC' }}>Current Queue</div>
              <div style={{ fontSize: '24px', color: '#00FFB3' }}>{currentQueue}</div>
            </div>
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '10px',
              borderRadius: '5px',
              width: '30%',
              border: '1px solid #333'
            }}>
              <div style={{ fontSize: '14px', color: '#DDE3EC' }}>Avg. Wait</div>
              <div style={{ fontSize: '24px', color: '#00FFB3' }}>{avgWait}m</div>
            </div>
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '10px',
              borderRadius: '5px',
              width: '30%',
              border: '1px solid #333'
            }}>
              <div style={{ fontSize: '14px', color: '#DDE3EC' }}>Served Today</div>
              <div style={{ fontSize: '24px', color: '#00FFB3' }}>{served}</div>
            </div>
          </div>

          <div style={{
            height: '170px',
            backgroundColor: '#1a1a1a',
            borderRadius: '5px',
            padding: '10px',
            position: 'relative',
            border: '1px solid #333'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <div style={{ fontSize: '14px', color: '#DDE3EC' }}>Wait Time Trend</div>
              <div style={{
                fontSize: '12px',
                color: '#999',
                display: 'flex',
                gap: '10px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#00FFB3',
                    borderRadius: '50%'
                  }}></span>
                  Actual
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#3E8EED',
                    borderRadius: '50%'
                  }}></span>
                  Predicted
                </span>
              </div>
            </div>

            <div style={{
              position: 'relative',
              height: '120px',
              marginTop: '5px'
            }}>
              {/* Grid lines */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                pointerEvents: 'none',
                borderTop: '1px dashed #333',
                borderBottom: '1px dashed #333'
              }}>
                <div style={{ borderBottom: '1px dashed #333', height: '33%' }}></div>
                <div style={{ borderBottom: '1px dashed #333', height: '33%' }}></div>
              </div>

              {/* Chart */}
              <svg width="100%" height="100%" viewBox="0 0 100 50" style={{ overflow: 'visible' }}>
                {/* Area under actual line */}
                <defs>
                  <linearGradient id="actualGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00FFB3" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#00FFB3" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d={`M0,50 L${actualPoints} L100,50 Z`}
                  fill="url(#actualGradient)"
                />

                {/* Predicted line */}
                <polyline
                  points={predictedPoints}
                  fill="none"
                  stroke="#3E8EED"
                  strokeWidth="2"
                  strokeDasharray="3,2"
                />

                {/* Actual line */}
                <polyline
                  points={actualPoints}
                  fill="none"
                  stroke="#00FFB3"
                  strokeWidth="2"
                />

                {/* Data points on actual line */}
                {actualData.map((value, index) => {
                  const x = index * (100 / (actualData.length - 1));
                  const y = 50 - (value / Math.max(...actualData) * 1.2) * 45;
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="1"
                      fill="#00FFB3"
                    />
                  );
                })}
              </svg>

              {/* X-axis labels */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '5px',
                fontSize: '10px',
                color: '#666'
              }}>
                {labels.filter((_, i) => i % 2 === 0).map((label, i) => (
                  <div key={i}>{label}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};

// Mobile Device with Notification
const MobileDevice = ({ position, rotation }) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[0.8, 1.5, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <Html transform position={[0, 0, 0.06]} scale={0.05} rotation={[0, 0, 0]}>
        <div style={{
          width: '400px',
          height: '800px',
          backgroundColor: '#000',
          color: 'white',
          padding: '20px',
          fontFamily: 'system-ui',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '2px solid #444'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>QueueWise Pro</div>

          <div style={{
            backgroundColor: '#3E8EED',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px',
            animation: 'pulse 2s infinite'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Your turn is coming up!</div>
            <div style={{ fontSize: '14px', marginTop: '5px' }}>Estimated wait: 3 minutes</div>
            <div style={{ fontSize: '14px', marginTop: '5px' }}>Please proceed to Counter 3</div>
          </div>

          <div style={{
            backgroundColor: '#222',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '15px'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Queue Status</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <div>Your position:</div>
              <div style={{ color: '#00FFB3', fontWeight: 'bold' }}>2 of 24</div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#222',
            padding: '15px',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Recommended Times</div>
            <div style={{
              backgroundColor: '#333',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <div>2:30 PM</div>
              <div style={{ color: '#00FFB3' }}>5 min wait</div>
            </div>
            <div style={{
              backgroundColor: '#333',
              padding: '10px',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <div>4:15 PM</div>
              <div style={{ color: '#00FFB3' }}>3 min wait</div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};

// Floor component
const Floor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#DDE3EC" />
    </mesh>
  );
};

// Main scene component
const Scene = ({ cameraPosition, cameraTarget, activeSection }) => {
  const cameraRef = useRef();

  // Camera animation - faster movement with higher multiplier
  useFrame((state, delta) => {
    if (cameraRef.current) {
      // Smoothly move camera with faster transition (0.15 instead of 0.05)
      cameraRef.current.position.x += (cameraPosition[0] - cameraRef.current.position.x) * 0.15;
      cameraRef.current.position.y += (cameraPosition[1] - cameraRef.current.position.y) * 0.15;
      cameraRef.current.position.z += (cameraPosition[2] - cameraRef.current.position.z) * 0.15;

      // Look at target
      cameraRef.current.lookAt(cameraTarget[0], cameraTarget[1], cameraTarget[2]);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[8, 5, 8]} fov={50} />

      {/* Environment lighting - simplified */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Floor */}
      <Floor />

      {/* Only show elements relevant to current view for better performance */}
      {(activeSection === 'overview' || activeSection === 'counter') && (
        <>
          <ServiceCounter position={[0, 0, -5]} />
          <ServiceCounter position={[-3, 0, -5]} />
          <ServiceCounter position={[3, 0, -5]} />
        </>
      )}

      {(activeSection === 'overview' || activeSection === 'display') && (
        <QueueDisplay position={[3, 2, 0]} rotation={[0, -Math.PI / 2, 0]} />
      )}

      {(activeSection === 'overview' || activeSection === 'admin') && (
        <AdminDashboard position={[-3, 1.5, -3]} rotation={[0, Math.PI / 4, 0]} />
      )}

      {(activeSection === 'overview' || activeSection === 'mobile') && (
        <MobileDevice position={[2, 0, 2]} rotation={[0, -Math.PI / 4, 0]} />
      )}

      {/* Queue people - only show when relevant */}
      {(activeSection === 'overview' || activeSection === 'queue') && (
        <>
          <QueuePerson position={[0, 0, 5]} isMoving={true} speed={0.03} />
          <QueuePerson position={[0, 0, 3]} isMoving={true} speed={0.03} />
          <QueuePerson position={[0, 0, 1]} isMoving={true} speed={0.03} />
          <QueuePerson position={[0, 0, -1]} isMoving={true} speed={0.03} />
          <QueuePerson position={[0, 0, -3]} isMoving={true} speed={0.03} />

          {/* Reduced number of static people */}
          <QueuePerson position={[-2, 0, 2]} color="#DDE3EC" />
          <QueuePerson position={[2, 0, 4]} color="#DDE3EC" />
        </>
      )}

      {/* Enable orbit controls for manual camera movement */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        target={[0, 0, 0]}
        enabled={activeSection === 'overview'}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={15}
      />
    </>
  );
};

// Main component that wraps the Canvas
export default function QueueScene() {
  const [cameraPosition, setCameraPosition] = useState([8, 5, 8]);
  const [cameraTarget, setCameraTarget] = useState([0, 0, 0]);
  const [activeSection, setActiveSection] = useState('overview');

  // Change camera view based on section
  const changeView = (section) => {
    setActiveSection(section);

    switch(section) {
      case 'overview':
        setCameraPosition([8, 5, 8]);
        setCameraTarget([0, 0, 0]);
        break;
      case 'queue':
        setCameraPosition([0, 2, 8]);
        setCameraTarget([0, 1, 0]);
        break;
      case 'counter':
        setCameraPosition([0, 2, -3]);
        setCameraTarget([0, 1, -5]);
        break;
      case 'display':
        setCameraPosition([5, 2, 0]);
        setCameraTarget([3, 1, 0]);
        break;
      case 'admin':
        setCameraPosition([-5, 2, -3]);
        setCameraTarget([-3, 1, -3]);
        break;
      case 'mobile':
        setCameraPosition([3, 1, 3]);
        setCameraTarget([2, 0, 2]);
        break;
      default:
        setCameraPosition([8, 5, 8]);
        setCameraTarget([0, 0, 0]);
    }
  };

  return (
    <div className="queue-scene-container">
      <div className="scene-controls">
        <button
          className={`scene-button ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => changeView('overview')}
        >
          Overview
        </button>
        <button
          className={`scene-button ${activeSection === 'queue' ? 'active' : ''}`}
          onClick={() => changeView('queue')}
        >
          Queue
        </button>
        <button
          className={`scene-button ${activeSection === 'counter' ? 'active' : ''}`}
          onClick={() => changeView('counter')}
        >
          Service Counter
        </button>
        <button
          className={`scene-button ${activeSection === 'display' ? 'active' : ''}`}
          onClick={() => changeView('display')}
        >
          Queue Display
        </button>
        <button
          className={`scene-button ${activeSection === 'admin' ? 'active' : ''}`}
          onClick={() => changeView('admin')}
        >
          Admin Dashboard
        </button>
        <button
          className={`scene-button ${activeSection === 'mobile' ? 'active' : ''}`}
          onClick={() => changeView('mobile')}
        >
          Mobile App
        </button>
      </div>

      <Canvas
        dpr={[1, 2]} // Lower resolution for better performance
        performance={{ min: 0.5 }} // Allow performance optimizations
        gl={{
          antialias: false, // Disable antialiasing for better performance
          powerPreference: "high-performance",
          alpha: false,
          depth: true
        }}
        style={{ background: '#000' }}
      >
        <Scene
          cameraPosition={cameraPosition}
          cameraTarget={cameraTarget}
          activeSection={activeSection}
        />
      </Canvas>
    </div>
  );
}
