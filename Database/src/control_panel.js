// src/components/ControlPanel.js
import React, { useState } from 'react';

const ControlPanel = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);

  return (
    <div className="control-panel">
      <h3>Control Panel</h3>
      
      <div className="control-group">
        <button 
          className={`play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? 'Pause' : 'Play'} Resonance
        </button>
      </div>
      
      <div className="control-group">
        <label>Volume: {volume}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
        />
      </div>
      
      <div className="control-group">
        <h4>Preset Modes</h4>
        <div className="preset-buttons">
          <button>Market Analysis</button>
          <button>Meditative</button>
          <button>Strategic</button>
          <button>Reactive</button>
        </div>
      </div>
      
      <div className="status-indicators">
        <div className="status-item">
          <span className="status-label">System Status</span>
          <span className="status-value active">Operational</span>
        </div>
        <div className="status-item">
          <span className="status-label">Resonance Level</span>
          <span className="status-value">Optimal</span>
        </div>
        <div className="status-item">
          <span className="status-label">Connection</span>
          <span className="status-value">Stable</span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
