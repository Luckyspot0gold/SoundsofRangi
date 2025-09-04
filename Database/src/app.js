// src/App.js
import React, { useState, useEffect } from 'react';
import CymaticVisualizer from './components/CymaticVisualizer';
import FrequencyPanel from './components/FrequencyPanel';
import MarketIndicators from './components/MarketIndicators';
import ControlPanel from './components/ControlPanel';
import './styles/App.css';

function App() {
  const [frequencies, setFrequencies] = useState({
    earthTone: 432,
    returnToSender: 111.11,
    customFrequency: 396
  });
  const [marketData, setMarketData] = useState({
    HRS: 0,
    HSI: 0,
    ISS: 0,
    HIV: 0,
    SSS: 0,
    PSD: 0
  });
  const [activeFrequency, setActiveFrequency] = useState('earthTone');

  // Simulate market data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => ({
        HRS: Math.random() * 100,
        HSI: Math.random() * 100,
        ISS: Math.random() * 100,
        HIV: Math.random() * 100,
        SSS: Math.random() * 100,
        PSD: Math.random() * 100
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <h1>Reality Protocol</h1>
        <p>McCrea Crazy Games - Harmonic Market Visualization</p>
      </header>
      
      <div className="main-container">
        <div className="visualization-section">
          <CymaticVisualizer frequency={frequencies[activeFrequency]} />
          <FrequencyPanel 
            frequencies={frequencies} 
            activeFrequency={activeFrequency}
            onFrequencyChange={setActiveFrequency}
            onFrequencyUpdate={setFrequencies}
          />
        </div>
        
        <div className="data-section">
          <MarketIndicators data={marketData} />
          <ControlPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
