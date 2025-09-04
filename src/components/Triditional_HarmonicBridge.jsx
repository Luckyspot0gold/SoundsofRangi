// src/components/TraditionalHarmonicBridge.jsx
import React, { useState, useEffect } from 'react';

const TraditionalHarmonicBridge = ({ 
    harmonicData, 
    marketData, 
    onIndicatorSelect 
}) => {
    const [selectedIndicators, setSelectedIndicators] = useState(['SMA', 'RSI', 'MACD']);
    const [correlations, setCorrelations] = useState({});
    const [suggestedIndicators, setSuggestedIndicators] = useState([]);

    useEffect(() => {
        if (harmonicData && marketData) {
            calculateCorrelations();
            suggestIndicators();
        }
    }, [harmonicData, marketData]);

    const calculateCorrelations = () => {
        // Calculate correlations between harmonic data and traditional indicators
        const newCorrelations = {};
        
        selectedIndicators.forEach(indicator => {
            // This would use the IndicatorCorrelation class from above
            const correlation = calculateCorrelationForIndicator(harmonicData, marketData, indicator);
            newCorrelations[indicator] = correlation;
        });
        
        setCorrelations(newCorrelations);
    };

    const suggestIndicators = () => {
        // Suggest indicators based on current harmonic pattern
        const pattern = detectHarmonicPattern(harmonicData);
        const suggestions = suggestIndicatorsForPattern(pattern);
        setSuggestedIndicators(suggestions);
    };

    const handleIndicatorToggle = (indicator) => {
        const newSelected = selectedIndicators.includes(indicator) ?
            selectedIndicators.filter(i => i !== indicator) :
            [...selectedIndicators, indicator];
        
        setSelectedIndicators(newSelected);
        onIndicatorSelect(newSelected);
    };

    return (
        <div className="harmonic-bridge">
            <h3>Traditional-Harmonic Correlation Bridge</h3>
            
            <div className="correlation-display">
                <h4>Indicator Correlations</h4>
                {Object.entries(correlations).map(([indicator, correlation]) => (
                    <div key={indicator} className="correlation-item">
                        <span className="indicator-name">{indicator}</span>
                        <div className="correlation-bar">
                            <div 
                                className="correlation-fill"
                                style={{
                                    width: `${Math.abs(correlation) * 100}%`,
                                    left: correlation < 0 ? '50%' : '0%',
                                    backgroundColor: correlation > 0 ? '#4caf50' : '#f44336'
                                }}
                            ></div>
                        </div>
                        <span className="correlation-value">
                            {correlation > 0 ? '+' : ''}{correlation.toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
            
            <div className="indicator-suggestions">
                <h4>Suggested Indicators</h4>
                <div className="suggestion-list">
                    {suggestedIndicators.map(indicator => (
                        <button
                            key={indicator}
                            className={`suggestion ${selectedIndicators.includes(indicator) ? 'selected' : ''}`}
                            onClick={() => handleIndicatorToggle(indicator)}
                        >
                            {indicator}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="indicator-selection">
                <h4>Selected Indicators</h4>
                <div className="selection-list">
                    {selectedIndicators.map(indicator => (
                        <div key={indicator} className="selected-indicator">
                            {indicator}
                            <button onClick={() => handleIndicatorToggle(indicator)}>×</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TraditionalHarmonicBridge;
