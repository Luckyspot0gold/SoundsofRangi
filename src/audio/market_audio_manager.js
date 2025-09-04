// src/audio/market-audio-manager.js
import { AdvancedAudioEngine } from './advanced-audio-engine.js';
import { DolbyAtmosIntegration } from './dolby-atmos-integration.js';
import { AudioControlInterface } from './audio-control-interface.js';

export class MarketAudioManager {
    constructor() {
        this.audioEngine = new AdvancedAudioEngine();
        this.dolbyAtmos = new DolbyAtmosIntegration(this.audioEngine.audioContext);
        this.controlInterface = new AudioControlInterface(this.audioEngine);
        this.soundscape = null;
    }

    initialize(marketData) {
        // Create initial soundscape from market data
        this.soundscape = this.audioEngine.createMarketSoundscape(marketData);
        this.controlInterface.createMarketSoundscapeUI(marketData);
        this.controlInterface.currentSoundscape = this.soundscape;
        
        console.log("Market audio system initialized");
    }

    update(marketData) {
        // Update soundscape with new market data
        if (this.soundscape) {
            this.audioEngine.updateMarketSoundscape(this.soundscape, marketData);
            this.controlInterface.updateMarketSoundscapeUI(marketData);
            
            // Update Dolby Atmos objects if enabled
            if (this.audioEngine.outputMode === 'dolby-atmos') {
                this.dolbyAtmos.updateMarketObjects(marketData);
            }
        }
    }

    setOutputMode(mode, config) {
        this.audioEngine.setOutputMode(mode, config);
    }

    getAudioEngine() {
        return this.audioEngine;
    }

    getDolbyAtmos() {
        return this.dolbyAtmos;
    }

    getControlInterface() {
        return this.controlInterface;
    }
}
