// src/indicators/technical-indicators.js
export class TechnicalIndicators {
    constructor() {
        this.indicators = new Map();
        this.historicalData = [];
    }

    // Add new price data point
    addDataPoint(data) {
        this.historicalData.push(data);
        
        // Keep a reasonable history (e.g., 200 periods)
        if (this.historicalData.length > 200) {
            this.historicalData.shift();
        }
        
        // Recalculate all indicators
        this.calculateAllIndicators();
    }

    // Calculate all indicators
    calculateAllIndicators() {
        if (this.historicalData.length < 20) return; // Not enough data
        
        this.calculateMovingAverages();
        this.calculateBollingerBands();
        this.calculateRSI();
        this.calculateMACD();
        this.calculateStochasticOscillator();
        this.calculateFibonacciLevels();
        this.calculateIchimokuCloud();
        this.calculateADX();
        this.calculateOBV();
        this.calculateParabolicSAR();
        this.calculateAroon();
        this.calculateCCI();
        this.calculateWilliamsR();
        this.calculateATR();
        this.calculateStandardDeviation();
    }

    // Simple Moving Average
    calculateSMA(period = 20) {
        if (this.historicalData.length < period) return null;
        
        const closes = this.historicalData.slice(-period).map(d => d.close);
        const sum = closes.reduce((a, b) => a + b, 0);
        return sum / period;
    }

    // Exponential Moving Average
    calculateEMA(period = 20) {
        if (this.historicalData.length < period) return null;
        
        const multiplier = 2 / (period + 1);
        let ema = this.calculateSMA(period);
        
        for (let i = period; i < this.historicalData.length; i++) {
            ema = (this.historicalData[i].close - ema) * multiplier + ema;
        }
        
        return ema;
    }

    // Moving Average Convergence Divergence
    calculateMACD() {
        const ema12 = this.calculateEMA(12);
        const ema26 = this.calculateEMA(26);
        
        if (!ema12 || !ema26) return null;
        
        const macd = ema12 - ema26;
        const signal = this.calculateEMA(9, this.historicalData.map(d => macd));
        const histogram = macd - signal;
        
        this.indicators.set('MACD', { macd, signal, histogram });
        return { macd, signal, histogram };
    }

    // Relative Strength Index
    calculateRSI(period = 14) {
        if (this.historicalData.length < period + 1) return null;
        
        let gains = 0;
        let losses = 0;
        
        for (let i = 1; i <= period; i++) {
            const change = this.historicalData[i].close - this.historicalData[i - 1].close;
            if (change >= 0) {
                gains += change;
            } else {
                losses -= change;
            }
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        
        if (avgLoss === 0) return 100;
        
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        
        this.indicators.set('RSI', rsi);
        return rsi;
    }

    // Bollinger Bands
    calculateBollingerBands(period = 20, multiplier = 2) {
        if (this.historicalData.length < period) return null;
        
        const closes = this.historicalData.slice(-period).map(d => d.close);
        const sma = this.calculateSMA(period);
        const stdDev = this.calculateStandardDeviation(period);
        
        const upper = sma + (multiplier * stdDev);
        const lower = sma - (multiplier * stdDev);
        const bandwidth = (upper - lower) / sma * 100;
        
        this.indicators.set('BollingerBands', { upper, middle: sma, lower, bandwidth });
        return { upper, middle: sma, lower, bandwidth };
    }

    // Stochastic Oscillator
    calculateStochasticOscillator(period = 14) {
        if (this.historicalData.length < period) return null;
        
        const recentData = this.historicalData.slice(-period);
        const highestHigh = Math.max(...recentData.map(d => d.high));
        const lowestLow = Math.min(...recentData.map(d => d.low));
        const currentClose = recentData[recentData.length - 1].close;
        
        const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
        const d = this.calculateSMA(3, recentData.map(d => k)); // 3-period SMA of %K
        
        this.indicators.set('Stochastic', { k, d });
        return { k, d };
    }

    // Fibonacci Retracement Levels
    calculateFibonacciLevels() {
        if (this.historicalData.length < 2) return null;
        
        const recentData = this.historicalData.slice(-20);
        const highest = Math.max(...recentData.map(d => d.high));
        const lowest = Math.min(...recentData.map(d => d.low));
        const diff = highest - lowest;
        
        const levels = {
            '0.0': highest,
            '0.236': highest - (diff * 0.236),
            '0.382': highest - (diff * 0.382),
            '0.5': highest - (diff * 0.5),
            '0.618': highest - (diff * 0.618),
            '0.786': highest - (diff * 0.786),
            '1.0': lowest
        };
        
        this.indicators.set('Fibonacci', levels);
        return levels;
    }

    // Ichimoku Cloud
    calculateIchimokuCloud() {
        if (this.historicalData.length < 52) return null;
        
        // Tenkan-sen (Conversion Line)
        const high9 = Math.max(...this.historicalData.slice(-9).map(d => d.high));
        const low9 = Math.min(...this.historicalData.slice(-9).map(d => d.low));
        const tenkan = (high9 + low9) / 2;
        
        // Kijun-sen (Base Line)
        const high26 = Math.max(...this.historicalData.slice(-26).map(d => d.high));
        const low26 = Math.min(...this.historicalData.slice(-26).map(d => d.low));
        const kijun = (high26 + low26) / 2;
        
        // Senkou Span A (Leading Span A)
        const senkouA = (tenkan + kijun) / 2;
        
        // Senkou Span B (Leading Span B)
        const high52 = Math.max(...this.historicalData.slice(-52).map(d => d.high));
        const low52 = Math.min(...this.historicalData.slice(-52).map(d => d.low));
        const senkouB = (high52 + low52) / 2;
        
        // Chikou Span (Lagging Span)
        const chikou = this.historicalData[this.historicalData.length - 26].close;
        
        this.indicators.set('Ichimoku', { tenkan, kijun, senkouA, senkouB, chikou });
        return { tenkan, kijun, senkouA, senkouB, chikou };
    }

    // Average Directional Index
    calculateADX(period = 14) {
        if (this.historicalData.length < period * 2) return null;
        
        // This is a simplified implementation
        let sumDX = 0;
        
        for (let i = 1; i <= period; i++) {
            const current = this.historicalData[this.historicalData.length - i];
            const previous = this.historicalData[this.historicalData.length - i - 1];
            
            const upMove = current.high - previous.high;
            const downMove = previous.low - current.low;
            
            let plusDM = 0;
            let minusDM = 0;
            
            if (upMove > downMove && upMove > 0) {
                plusDM = upMove;
            }
            
            if (downMove > upMove && downMove > 0) {
                minusDM = downMove;
            }
            
            const trueRange = Math.max(
                current.high - current.low,
                Math.abs(current.high - previous.close),
                Math.abs(current.low - previous.close)
            );
            
            if (trueRange !== 0) {
                const plusDI = 100 * (plusDM / trueRange);
                const minusDI = 100 * (minusDM / trueRange);
                const dx = 100 * (Math.abs(plusDI - minusDI) / (plusDI + minusDI));
                sumDX += dx;
            }
        }
        
        const adx = sumDX / period;
        this.indicators.set('ADX', adx);
        return adx;
    }

    // On-Balance Volume
    calculateOBV() {
        if (this.historicalData.length < 2) return null;
        
        let obv = 0;
        
        for (let i = 1; i < this.historicalData.length; i++) {
            const current = this.historicalData[i];
            const previous = this.historicalData[i - 1];
            
            if (current.close > previous.close) {
                obv += current.volume;
            } else if (current.close < previous.close) {
                obv -= current.volume;
            }
        }
        
        this.indicators.set('OBV', obv);
        return obv;
    }

    // Parabolic SAR
    calculateParabolicSAR(acceleration = 0.02, maximum = 0.2) {
        if (this.historicalData.length < 3) return null;
        
        // Simplified implementation
        const recentData = this.historicalData.slice(-3);
        const isUptrend = recentData[2].close > recentData[1].close;
        
        let sar;
        if (isUptrend) {
            const lowestLow = Math.min(recentData[0].low, recentData[1].low);
            sar = lowestLow;
        } else {
            const highestHigh = Math.max(recentData[0].high, recentData[1].high);
            sar = highestHigh;
        }
        
        this.indicators.set('ParabolicSAR', sar);
        return sar;
    }

    // Aroon Indicator
    calculateAroon(period = 25) {
        if (this.historicalData.length < period) return null;
        
        const recentData = this.historicalData.slice(-period);
        const highestHigh = Math.max(...recentData.map(d => d.high));
        const lowestLow = Math.min(...recentData.map(d => d.low));
        
        const daysSinceHigh = recentData.length - recentData.findIndex(d => d.high === highestHigh) - 1;
        const daysSinceLow = recentData.length - recentData.findIndex(d => d.low === lowestLow) - 1;
        
        const aroonUp = ((period - daysSinceHigh) / period) * 100;
        const aroonDown = ((period - daysSinceLow) / period) * 100;
        
        this.indicators.set('Aroon', { aroonUp, aroonDown });
        return { aroonUp, aroonDown };
    }

    // Commodity Channel Index
    calculateCCI(period = 20) {
        if (this.historicalData.length < period) return null;
        
        const recentData = this.historicalData.slice(-period);
        const typicalPrices = recentData.map(d => (d.high + d.low + d.close) / 3);
        const sma = typicalPrices.reduce((a, b) => a + b, 0) / period;
        
        const meanDeviation = typicalPrices
            .map(tp => Math.abs(tp - sma))
            .reduce((a, b) => a + b, 0) / period;
        
        const cci = (typicalPrices[typicalPrices.length - 1] - sma) / (0.015 * meanDeviation);
        
        this.indicators.set('CCI', cci);
        return cci;
    }

    // Williams %R
    calculateWilliamsR(period = 14) {
        if (this.historicalData.length < period) return null;
        
        const recentData = this.historicalData.slice(-period);
        const highestHigh = Math.max(...recentData.map(d => d.high));
        const lowestLow = Math.min(...recentData.map(d => d.low));
        const currentClose = recentData[recentData.length - 1].close;
        
        const williamsR = ((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100;
        
        this.indicators.set('WilliamsR', williamsR);
        return williamsR;
    }

    // Average True Range
    calculateATR(period = 14) {
        if (this.historicalData.length < period + 1) return null;
        
        let trueRanges = [];
        
        for (let i = 1; i <= period; i++) {
            const current = this.historicalData[this.historicalData.length - i];
            const previous = this.historicalData[this.historicalData.length - i - 1];
            
            const tr = Math.max(
                current.high - current.low,
                Math.abs(current.high - previous.close),
                Math.abs(current.low - previous.close)
            );
            
            trueRanges.push(tr);
        }
        
        const atr = trueRanges.reduce((a, b) => a + b, 0) / period;
        this.indicators.set('ATR', atr);
        return atr;
    }

    // Standard Deviation
    calculateStandardDeviation(period = 20) {
        if (this.historicalData.length < period) return null;
        
        const closes = this.historicalData.slice(-period).map(d => d.close);
        const mean = closes.reduce((a, b) => a + b, 0) / period;
        const squareDiffs = closes.map(value => Math.pow(value - mean, 2));
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / period;
        const stdDev = Math.sqrt(avgSquareDiff);
        
        this.indicators.set('StdDev', stdDev);
        return stdDev;
    }

    // Get all calculated indicators
    getAllIndicators() {
        return Object.fromEntries(this.indicators);
    }

    // Get specific indicator
    getIndicator(name) {
        return this.indicators.get(name);
    }
}
