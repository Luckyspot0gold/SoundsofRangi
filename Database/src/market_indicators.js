// Add to existing JavaScript
let dataSource = 'simulated';

// Modified updateMarketData function
async function updateMarketData() {
  if (dataSource === 'live') {
    const liveData = await fetchMarketData();
    if (liveData) {
      marketData = liveData;
    } else {
      // Fallback to simulated data if API fails
      console.log('Using simulated data due to API failure');
      updateSimulatedMarketData();
    }
  } else {
    updateSimulatedMarketData();
  }
  
  // Update UI as before
  // ...
}

function updateSimulatedMarketData() {
  // Existing simulation logic
  marketData.btc.change += (Math.random() - 0.5) * 0.5;
  // ... rest of simulation
}

// Modified init function
function init() {
  initializeCanvases();
  document.getElementById('dataSource').addEventListener('change', (e) => {
    dataSource = e.target.value;
  });
  animate();
}// src/components/MarketIndicators.js
import React from 'react';

const MarketIndicators = ({ data }) => {
  const indicators = [
    { id: 'HRS', name: 'Harmonic Resonance Signal', color: '#FF6B6B' },
    { id: 'HSI', name: 'Harmonic Strength Indicator', color: '#4ECDC4' },
    { id: 'ISS', name: 'Interdimensional Signal Strength', color: '#FFE66D' },
    { id: 'HIV', name: 'Harmonic Influence Vector', color: '#6A0572' },
    { id: 'SSS', name: 'Sovereign Signal Strength', color: '#1A535C' },
    { id: 'PSD', name: 'Phonic Signal Density', color: '#5B5F97' }
  ];

  return (
    <div className="market-indicators">
      <h3>Market Signal Indicators</h3>
      <div className="indicators-grid">
        {indicators.map(indicator => (
          <div key={indicator.id} className="indicator">
            <div className="indicator-header">
              <span className="indicator-name">{indicator.name}</span>
              <span className="indicator-value">{data[indicator.id].toFixed(2)}</span>
            </div>
            <div className="indicator-bar">
              <div 
                className="indicator-fill"
                style={{
                  width: `${data[indicator.id]}%`,
                  backgroundColor: indicator.color
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketIndicators;
