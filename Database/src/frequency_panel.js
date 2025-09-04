// src/components/FrequencyPanel.js
import React from 'react';

const FrequencyPanel = ({ frequencies, activeFrequency, onFrequencyChange, onFrequencyUpdate }) => {
  const frequencyPresets = [
    { id: 'earthTone', name: 'Earth Tone', value: 432, color: '#4CAF50' },
    { id: 'returnToSender', name: 'Return to Sender', value: 111.11, color: '#9C27B0' },
    { id: 'clarity', name: 'Clarity', value: 396, color: '#2196F3' },
    { id: 'strength', name: 'Strength', value: 417, color: '#FF9800' },
    { id: 'transformation', name: 'Transformation', value: 528, color: '#E91E63' },
    { id: 'integrity', name: 'Integrity', value: 639, color: '#00BCD4' },
    { id: 'intuition', name: 'Intuition', value: 741, color: '#673AB7' },
    { id: 'manifestation', name: 'Manifestation', value: 852, color: '#FFEB3B' },
    { id: 'sovereignty', name: 'Sovereignty', value: 963, color: '#F44336' }
  ];

  return (
    <div className="frequency-panel">
      <h3>Harmonic Frequencies</h3>
      <div className="frequency-buttons">
        {frequencyPresets.map(preset => (
          <button
            key={preset.id}
            className={`frequency-btn ${activeFrequency === preset.id ? 'active' : ''}`}
            style={{ borderColor: preset.color }}
            onClick={() => onFrequencyChange(preset.id)}
          >
            <span className="frequency-name">{preset.name}</span>
            <span className="frequency-value">{preset.value} Hz</span>
          </button>
        ))}
      </div>
      
      <div className="custom-frequency">
        <h4>Custom Frequency</h4>
        <input
          type="number"
          step="0.01"
          value={frequencies.customFrequency}
          onChange={(e) => onFrequencyUpdate({
            ...frequencies,
            customFrequency: parseFloat(e.target.value) || 0
          })}
        />
        <button
          onClick={() => onFrequencyChange('customFrequency')}
          className={activeFrequency === 'customFrequency' ? 'active' : ''}
        >
          Apply Custom
        </button>
      </div>
    </div>
  );
};

export default FrequencyPanel;
