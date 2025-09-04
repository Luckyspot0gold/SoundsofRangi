import { calculateWavelength, adjustFrequencyByMarketChange } from '../utils/wavelength-calculator.js';

export class PhysicsEngine {
    constructor() {
        this.baseFrequency = 432; // Earth's fundamental frequency
        this.returnFrequency = 111.11; // Return to sender frequency
        this.currentFrequencies = {
            fundamental: this.baseFrequency,
            harmonics: [],
            marketAdjusted: this.baseFrequency
        };
    }

    updateFromMarketData(marketData) {
        // Adjust frequency based on Bitcoin price changes
        const btcChange = marketData.bitcoin.change24h;
        this.currentFrequencies.marketAdjusted = adjustFrequencyByMarketChange(this.baseFrequency, btcChange);

        // Calculate harmonic complexity based on Ethereum volume
        const ethVolume = marketData.ethereum.volume;
        const harmonicCount = Math.floor(ethVolume / 100000000) + 3; // 3-8 harmonics based on volume
        this.currentFrequencies.harmonics = this.generateHarmonics(this.currentFrequencies.marketAdjusted, harmonicCount);

        // Adjust animation speed based on Solana transactions
        const solChange = Math.abs(marketData.solana.change24h);
        const animationSpeed = 0.5 + (solChange / 10); // 0.5x to 1.5x speed

        return {
            frequencies: this.currentFrequencies,
            animationSpeed: animationSpeed,
            wavelengths: this.calculateAllWavelengths()
        };
    }

    generateHarmonics(baseFrequency, count) {
        const harmonics = [];
        for (let i = 1; i <= count; i++) {
            harmonics.push({
                order: i,
                frequency: baseFrequency * i,
                amplitude: 1 / i // Higher harmonics have lower amplitude
            });
        }
        return harmonics;
    }

    calculateAllWavelengths() {
        const allFrequencies = [
            this.currentFrequencies.fundamental,
            this.currentFrequencies.marketAdjusted,
            ...this.currentFrequencies.harmonics.map(h => h.frequency)
        ];
        
        return allFrequencies.map(freq => ({
            frequency: freq,
            wavelength: calculateWavelength(freq)
        }));
    }

    getFrequencyColor(frequency) {
        // Map frequency to color spectrum (400-800THz visible light)
        const normalized = (frequency - 200) / 1000;
        const hue = normalized * 360;
        return `hsl(${hue}, 80%, 60%)`;
    }
}
