import { ResonanceChamber } from './core/resonance-chamber.js';
import { MarketDataConnector } from './markets/real-time-feeds/market-connector.js';
import { PhysicsEngine } from './core/physics-engine.js';

class SoundsofRangiApp {
    constructor() {
        this.resonanceChamber = new ResonanceChamber(document.getElementById('resonance-chamber'));
        this.marketConnector = new MarketDataConnector();
        this.physicsEngine = new PhysicsEngine();
        
        this.waves = [];
        this.init();
    }

    async init() {
        // Connect to market data
        this.marketConnector.subscribe((data) => this.onMarketData(data));
        await this.marketConnector.connectToSources();
        
        console.log("SoundsofRangi application initialized");
    }

    onMarketData(marketData) {
        console.log("Market data received:", marketData);
        
        // Update physics engine with market data
        const physicsUpdate = this.physicsEngine.updateFromMarketData(marketData);
        
        // Clear existing waves
        this.resonanceChamber.clearScene();
        this.waves = [];
        
        // Create wave for fundamental frequency
        const fundamentalWave = this.resonanceChamber.createStandingWave(
            physicsUpdate.frequencies.fundamental,
            0.5,
            this.physicsEngine.getFrequencyColor(physicsUpdate.frequencies.fundamental)
        );
        this.waves.push(fundamentalWave);
        
        // Create wave for market-adjusted frequency
        const marketWave = this.resonanceChamber.createStandingWave(
            physicsUpdate.frequencies.marketAdjusted,
            0.3,
            this.physicsEngine.getFrequencyColor(physicsUpdate.frequencies.marketAdjusted)
        );
        marketWave.position.y = -1.5;
        this.waves.push(marketWave);
        
        // Create waves for harmonics
        physicsUpdate.frequencies.harmonics.forEach((harmonic, index) => {
            const harmonicWave = this.resonanceChamber.createStandingWave(
                harmonic.frequency,
                0.2 * harmonic.amplitude,
                this.physicsEngine.getFrequencyColor(harmonic.frequency)
            );
            harmonicWave.position.y = -3 - (index * 0.5);
            this.waves.push(harmonicWave);
        });
        
        // Display wavelength information
        this.displayWavelengthInfo(physicsUpdate.wavelengths);
    }

    displayWavelengthInfo(wavelengths) {
        const infoDiv = document.getElementById('wavelength-info') || this.createInfoDiv();
        infoDiv.innerHTML = '<h3>Wavelength Information</h3>';
        
        wavelengths.forEach(w => {
            infoDiv.innerHTML += `
                <p>${w.frequency.toFixed(2)} Hz: ${w.wavelength.toFixed(3)} meters</p>
            `;
        });
    }

    createInfoDiv() {
        const div = document.createElement('div');
        div.id = 'wavelength-info';
        div.style.position = 'absolute';
        div.style.top = '10px';
        div.style.left = '10px';
        div.style.color = 'white';
        div.style.backgroundColor = 'rgba(0,0,0,0.7)';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        document.body.appendChild(div);
        return div;
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SoundsofRangiApp();
});
