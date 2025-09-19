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
// index.js - Node.js backend for Rangi’s Worldwide with XION integration
require('dotenv').config(); // Load .env vars

const { StargateClient } = require('@cosmjs/stargate'); // For querying XION

// Your XION config (from .env or hardcode for test)
const XION_RPC_URL = process.env.XION_RPC_URL || 'https://rpc.xion-testnet-1.burnt.com:443';
const ACCOUNT_ADDRESS = process.env.XION_ADDRESS || 'xion1yourtestaddresshere'; // Replace with your testnet address
const DENOM = 'uxion'; // XION token

// Function to query balance from XION blockchain
async function getXionBalance() {
  try {
    const client = await StargateClient.connect(XION_RPC_URL);
    const balance = await client.getBalance(ACCOUNT_ADDRESS, DENOM);
    return parseFloat(balance.amount); // Return as number
  } catch (error) {
    console.error('Error querying XION:', error.message);
    return 0; // Fallback
  }
}

// Sonification mapping (scrap from your AIs - map balance to frequency for haptics)
function sonifyBalance(balance) {
  // Example: Low balance = low freq (200Hz), high = high (800Hz)
  const baseFreq = 200;
  const maxBalance = 1000000; // Assume max for scaling
  const frequency = baseFreq + (balance / maxBalance) * 600; // Scale to 200-800Hz
  const pitch = frequency.toFixed(2); // For sound
  const hapticIntensity = Math.min(100, (balance / 10000) * 100); // 0-100% for vibration

  return { frequency: pitch, haptic: hapticIntensity };
}

// Main run function
async function runRangis() {
  console.log('Rangi’s Worldwide: Querying XION blockchain...');
  const balance = await getXionBalance();
  console.log(`XION Balance: ${balance} uxion`);

  const sonified = sonifyBalance(balance);
  console.log(`Sonified Output: Frequency ${sonified.frequency}Hz, Haptic Intensity ${sonified.haptic}%`);
  // Add your haptic/sound code here (e.g., from ChatGPT scraps)
}

// Run it
runRangis();

// If you want a web server (to make Gitpod URL show something)
const express = require('express'); // npm install express
const app = express();
app.get('/', async (req, res) => {
  const balance = await getXionBalance();
  const sonified = sonifyBalance(balance);
  res.send(`Rangi’s Heartbeat: XION Balance ${balance} uxion | Freq: ${sonified.frequency}Hz | Haptic: ${sonified.haptic}%`);
});
app.listen(3000, () => console.log('Server on port 3000 - Check Gitpod preview!'));
