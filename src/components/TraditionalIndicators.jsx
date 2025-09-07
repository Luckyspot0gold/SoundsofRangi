// src/components/TraditionalIndicators.jsx
import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const TraditionalIndicators = ({ marketData, selectedIndicators }) => {
    const [indicatorData, setIndicatorData] = useState([]);

    useEffect(() => {
        if (marketData && selectedIndicators.length > 0) {
            processIndicatorData();
        }
    }, [marketData, selectedIndicators]);

    const processIndicatorData = () => {
        // Process market data for indicator display
        const processedData = marketData.map((data, index) => {
            const dataPoint = {
                timestamp: data.timestamp,
                price: data.close,
                high: data.high,
                low: data.low,
                volume: data.volume
            };

            // Add selected indicators to data point
            selectedIndicators.forEach(indicator => {
                switch (indicator) {
                    case 'SMA':
                        dataPoint.SMA = calculateSMA(marketData, index, 20);
                        break;
                    case 'EMA':
                        dataPoint.EMA = calculateEMA(marketData, index, 20);
                        break;
                    case 'RSI':
                        dataPoint.RSI = calculateRSI(marketData, index, 14);
                        break;
                    case 'MACD':
                        const macd = calculateMACD(marketData, index);
                        if (macd) {
                            dataPoint.MACD = macd.macd;
                            dataPoint.MACD_Signal = macd.signal;
                            dataPoint.MACD_Histogram = macd.histogram;
                        }
                        break;
                    case 'BollingerBands':
                        const bb = calculateBollingerBands(marketData, index, 20, 2);
                        if (bb) {
                            dataPoint.BB_Upper = bb.upper;
                            dataPoint.BB_Middle = bb.middle;
                            dataPoint.BB_Lower = dataPoint.BB_Lower;
                        }
                        break;
                    // Additional indicator cases would be added here
                }
            });

            return dataPoint;
        });

        setIndicatorData(processedData);
    };

    const renderChart = () => {
        if (selectedIndicators.includes('BollingerBands')) {
            return renderBollingerBandsChart();
        } else if (selectedIndicators.includes('MACD')) {
            return renderMACDChart();
        } else {
            return renderBasicChart();
        }
    };

    const renderBasicChart = () => (
        <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={indicatorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="price" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                
                {selectedIndicators.includes('SMA') && (
                    <Line type="monotone" dataKey="SMA" stroke="#ff7300" dot={false} />
                )}
                
                {selectedIndicators.includes('EMA') && (
                    <Line type="monotone" dataKey="EMA" stroke="#00ff00" dot={false} />
                )}
            </AreaChart>
        </ResponsiveContainer>
    );

    const renderBollingerBandsChart = () => (
        <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={indicatorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="BB_Upper" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                <Line type="monotone" dataKey="BB_Middle" stroke="#8884d8" dot={false} />
                <Area type="monotone" dataKey="BB_Lower" stroke="#82ca9d" fill="#FFFFFF" fillOpacity={0.3} />
                <Line type="monotone" dataKey="price" stroke="#ff7300" dot={false} />
            </AreaChart>
        </ResponsiveContainer>
    );

    const renderMACDChart = () => (
        <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={indicatorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="MACD" stroke="#8884d8" dot={false} />
                <Line type="monotone" dataKey="MACD_Signal" stroke="#ff7300" dot={false} />
                <Bar dataKey="MACD_Histogram" fill="#413ea0" />
            </AreaChart>
        </ResponsiveContainer>
    );

    const renderRSIChart = () => (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={indicatorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="RSI" stroke="#8884d8" dot={false} />
                <Line type="monotone" dataKey="70" stroke="#ff7300" dot={false} />
                <Line type="monotone" dataKey="30" stroke="#ff7300" dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );

    return (
        <div className="traditional-indicators">
            <h3>Traditional Technical Indicators</h3>
            
            <div className="indicator-controls">
                <select multiple value={selectedIndicators} onChange={e => {
                    const options = e.target.options;
                    const value = [];
                    for (let i = 0; i < options.length; i++) {
                        if (options[i].selected) {
                            value.push(options[i].value);
                        }
                    }
                    onIndicatorsChange(value);
                }}>
                    <option value="SMA">Simple Moving Average</option>
                    <option value="EMA">Exponential Moving Average</option>
                    <option value="MACD">MACD</option>
                    <option value="RSI">Relative Strength Index</option>
                    <option value="BollingerBands">Bollinger Bands</option>
                    <option value="Stochastic">Stochastic Oscillator</option>
                    <option value="Fibonacci">Fibonacci Retracement</option>
                    <option value="Ichimoku">Ichimoku Cloud</option>
                    <option value="ADX">Average Directional Index</option>
                    <option value="OBV">On-Balance Volume</option>
                    <option value="ParabolicSAR">Parabolic SAR</option>
                    <option value="Aroon">Aroon Indicator</option>
                    <option value="CCI">Commodity Channel Index</option>
                    <option value="WilliamsR">Williams %R</option>
                    <option value="ATR">Average True Range</option>
                    <option value="StdDev">Standard Deviation</option>
                </select>
            </div>
            
            <div className="indicator-charts">
                {renderChart()}
                
                {selectedIndicators.includes('RSI') && renderRSIChart()}
            </div>
            
            <div className="indicator-values">
                <h4>Current Values</h4>
                {selectedIndicators.map(indicator => {
                    const value = indicatorData.length > 0 ? 
                        indicatorData[indicatorData.length - 1][indicator] : null;
                    
                    return (
                        <div key={indicator} className="indicator-value">
                            <span className="indicator-name">{indicator}:</span>
                            <span className="indicator-number">{value !== null ? value.toFixed(4) : 'Calculating...'}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TraditionalIndicators;
