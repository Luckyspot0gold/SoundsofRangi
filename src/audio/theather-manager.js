// src/audio/theater-manager.js
import { Dolby71Engine } from './dolby-7.1-engine.js';
import { SoundQualityEnhancer } from './sound-quality-enhancer.js';
import { TheaterControlInterface } from './theater-control-interface.js';

export class TheaterManager {
    constructor() {
        this.dolbyEngine = new Dolby71Engine();
        this.qualityEnhancer = new SoundQualityEnhancer(this.dolbyEngine);
        this.controlInterface = new TheaterControlInterface(this.dolbyEngine, this.qualityEnhancer);
        
        this.marketSounds = new Map();
    }

    initialize(marketData) {
        // Create initial market sounds
        Object.entries(marketData).forEach(([symbol, data]) => {
            this.dolbyEngine.createMarketSoundSource(symbol, data);
        });
        
        // Apply initial enhancements
        this.qualityEnhancer.applyEnhancements(marketData);
        
        console.log("Dolby 7.1 theater system initialized");
    }

    update(marketData) {
        // Update market sounds with new data
        this.controlInterface.updateMarketSounds(marketData);
    }

    enable() {
        this.dolbyEngine.enable();
    }

    disable() {
        this.dolbyEngine.disable();
    }

    getStatus() {
        return {
            audio: this.dolbyEngine.getAudioStatus(),
            enhancement: this.qualityEnhancer.getEnhancementStatus()
        };
    }

    setPreset(presetName) {
        if (this.qualityEnhancer.qualityPresets[presetName]) {
            this.qualityEnhancer.qualityPresets[presetName]();
            this.qualityEnhancer.currentPreset = presetName;
            return true;
        }
        return false;
    }
}
