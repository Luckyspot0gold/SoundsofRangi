// src/indicators/indicator-correlation.js
export class IndicatorCorrelation {
    constructor() {
        this.harmonicData = [];
        this.indicatorData = [];
        this.correlations = new Map();
    }

    addDataPoint(harmonicValue, indicatorValue, indicatorName) {
        this.harmonicData.push(harmonicValue);
        
        if (!this.indicatorData[indicatorName]) {
            this.indicatorData[indicatorName] = [];
        }
        this.indicatorData[indicatorName].push(indicatorValue);
        
        this.calculateCorrelation(indicatorName);
    }

    calculateCorrelation(indicatorName) {
        if (this.harmonicData.length < 2 || !this.indicatorData[indicatorName] || 
            this.indicatorData[indicatorName].length < 2) {
            return null;
        }
        
        const harmonicValues = this.harmonicData;
        const indicatorValues = this.indicatorData[indicatorName];
        
        // Ensure arrays are of equal length
        const minLength = Math.min(harmonicValues.length, indicatorValues.length);
        const harmonicSlice = harmonicValues.slice(-minLength);
        const indicatorSlice = indicatorValues.slice(-minLength);
        
        // Calculate correlation coefficient
        const harmonicMean = harmonicSlice.reduce((a, b) => a + b, 0) / minLength;
        const indicatorMean = indicatorSlice.reduce((a, b) => a + b, 0) / minLength;
        
        let numerator = 0;
        let harmonicVariance = 0;
        let indicatorVariance = 0;
        
        for (let i = 0; i < minLength; i++) {
            const harmonicDiff = harmonicSlice[i] - harmonicMean;
            const indicatorDiff = indicatorSlice[i] - indicatorMean;
            
            numerator += harmonicDiff * indicatorDiff;
            harmonicVariance += harmonicDiff * harmonicDiff;
            indicatorVariance += indicatorDiff * indicatorDiff;
        }
        
        const denominator = Math.sqrt(harmonicVariance * indicatorVariance);
        const correlation = denominator !== 0 ? numerator / denominator : 0;
        
        this.correlations.set(indicatorName, correlation);
        return correlation;
    }

    getCorrelation(indicatorName) {
        return this.correlations.get(indicatorName) || 0;
    }

    getAllCorrelations() {
        return Object.fromEntries(this.correlations);
    }

    getStrongCorrelations(threshold = 0.7) {
        const strongCorrelations = {};
        
        this.correlations.forEach((value, key) => {
            if (Math.abs(value) >= threshold) {
                strongCorrelations[key] = value;
            }
        });
        
        return strongCorrelations;
    }

    suggestIndicators(harmonicPattern) {
        // Suggest traditional indicators based on harmonic pattern
        const suggestions = {
            'harmonic_breakout': ['BollingerBands', 'MACD', 'RSI'],
            'harmonic_reversal': ['RSI', 'Stochastic', 'WilliamsR'],
            'harmonic_consolidation': ['ADX', 'ATR', 'StdDev'],
            'harmonic_trend': ['EMA', 'ParabolicSAR', 'Aroon']
        };
        
        return suggestions[harmonicPattern] || ['SMA', 'RSI', 'MACD'];
    }
}
