// src/audio/sonification-engine.js
export class SonificationEngine {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.oscillators = new Map();
        this.filters = new Map();
        this.isPlaying = false;
    }

    createFrequencyFromMarketData(marketData) {
        // Convert market data to auditory frequencies
        const baseFrequency = 110; // A2 note as base
        
        return {
            fundamental: baseFrequency * (1 + (marketData.price % 100) / 100),
            volume: baseFrequency * (Math.log10(marketData.volume) / 10),
            trend: baseFrequency * (marketData.trend > 0 ? 1.0594 : 0.9438), // Half step
            volatility: baseFrequency * (1 + marketData.volatility * 0.1)
        };
    }

    playMarketSonification(marketData) {
        if (this.isPlaying) this.stop();
        
        const frequencies = this.createFrequencyFromMarketData(marketData);
        
        // Create oscillators for each frequency component
        Object.entries(frequencies).forEach(([name, frequency]) => {
            const oscillator = this.audioContext.createOscillator();
            const filter = this.audioContext.createBiquadFilter();
            const gain = this.audioContext.createGain();
            
            oscillator.type = this.getOscillatorType(name);
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            
            // Set gain based on market importance
            gain.gain.setValueAtTime(this.calculateGain(name, marketData), 
                                   this.audioContext.currentTime);
            
            // Connect nodes
            oscillator.connect(filter);
            filter.connect(gain);
            gain.connect(this.audioContext.destination);
            
            oscillator.start();
            
            this.oscillators.set(name, oscillator);
            this.filters.set(name, filter);
        });
        
        this.isPlaying = true;
    }

    getOscillatorType(parameterName) {
        const types = {
            fundamental: 'sine',
            volume: 'square',
            trend: 'sawtooth',
            volatility: 'triangle'
        };
        
        return types[parameterName] || 'sine';
    }

    calculateGain(parameterName, marketData) {
        // Calculate volume based on market significance
        const gains = {
            fundamental: 0.7,
            volume: Math.min(0.5, marketData.volume / 1000000),
            trend: 0.3 + (Math.abs(marketData.trend) * 0.2),
            volatility: Math.min(0.6, marketData.volatility * 0.1)
        };
        
        return gains[parameterName] || 0.1;
    }

    stop() {
        this.oscillators.forEach(oscillator => {
            oscillator.stop();
            oscillator.disconnect();
        });
        
        this.oscillators.clear();
        this.filters.clear();
        this.isPlaying = false;
    }

    updateSonification(updatedMarketData) {
        if (!this.isPlaying) return;
        
        const frequencies = this.createFrequencyFromMarketData(updatedMarketData);
        
        Object.entries(frequencies).forEach(([name, frequency]) => {
            const oscillator = this.oscillators.get(name);
            const filter = this.filters.get(name);
            
            if (oscillator && filter) {
                oscillator.frequency.linearRampToValueAtTime(
                    frequency, this.audioContext.currentTime + 0.1
                );
                filter.frequency.linearRampToValueAtTime(
                    frequency, this.audioContext.currentTime + 0.1
                );
            }
        });
    }
}
