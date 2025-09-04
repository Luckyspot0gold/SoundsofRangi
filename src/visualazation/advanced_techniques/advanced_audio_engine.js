// src/audio/advanced-audio-engine.js
import { SonificationEngine } from './sonification-engine.js';

export class AdvancedAudioEngine extends SonificationEngine {
    constructor() {
        super();
        this.outputMode = 'binaural'; // Default to binaural for headphones
        this.surroundConfig = {
            channels: 8, // 7.1 surround by default
            layout: 'surround-7.1',
            dolbyAtmos: false
        };
        this.audioNodes = new Map();
        this.setupAudioGraph();
    }

    setupAudioGraph() {
        // Create main audio graph with support for multiple output configurations
        this.mainGain = this.audioContext.createGain();
        this.mainGain.gain.value = 0.8;
        
        // Create channel splitters and mergers for surround sound
        if (this.outputMode === 'surround') {
            this.setupSurroundOutput();
        } else {
            // Default to stereo output
            this.mainGain.connect(this.audioContext.destination);
        }
        
        // Create reverb and effects
        this.setupEffects();
    }

    setupSurroundOutput() {
        // Create a channel merger for surround sound
        this.channelMerger = this.audioContext.createChannelMerger(this.surroundConfig.channels);
        
        // Route main gain to appropriate channels based on surround configuration
        this.mainGain.connect(this.channelMerger, 0, 0); // Front Left
        this.mainGain.connect(this.channelMerger, 0, 1); // Front Right
        
        if (this.surroundConfig.channels >= 4) {
            // Add center and LFE channels for 4.0, 5.1, 7.1
            this.centerGain = this.audioContext.createGain();
            this.lfeGain = this.audioContext.createGain();
            this.lfeGain.gain.value = 0.7; // Reduce LFE volume
            
            this.centerGain.connect(this.channelMerger, 0, 2); // Center
            this.lfeGain.connect(this.channelMerger, 0, 3); // LFE (Subwoofer)
        }
        
        if (this.surroundConfig.channels >= 6) {
            // Add surround channels for 5.1 and 7.1
            this.surroundLeftGain = this.audioContext.createGain();
            this.surroundRightGain = this.audioContext.createGain();
            
            this.surroundLeftGain.connect(this.channelMerger, 0, 4); // Surround Left
            this.surroundRightGain.connect(this.channelMerger, 0, 5); // Surround Right
        }
        
        if (this.surroundConfig.channels >= 8) {
            // Add rear channels for 7.1
            this.rearLeftGain = this.audioContext.createGain();
            this.rearRightGain = this.audioContext.createGain();
            
            this.rearLeftGain.connect(this.channelMerger, 0, 6); // Rear Left
            this.rearRightGain.connect(this.channelMerger, 0, 7); // Rear Right
        }
        
        // Connect merger to destination
        this.channelMerger.connect(this.audioContext.destination);
    }

    setupEffects() {
        // Create reverb effect
        this.reverb = this.audioContext.createConvolver();
        
        // Create impulse response for different environments
        this.impulseResponses = {
            'concert-hall': this.generateImpulseResponse(3.2, 0.8),
            'small-room': this.generateImpulseResponse(1.5, 0.6),
            'cathedral': this.generateImpulseResponse(8.0, 0.9),
            'market-floor': this.generateImpulseResponse(2.5, 0.7)
        };
        
        this.reverb.buffer = this.impulseResponses['market-floor'];
        
        // Create delay effect
        this.delay = this.audioContext.createDelay(2.0);
        this.delay.delayTime.value = 0.3;
        
        this.delayFeedback = this.audioContext.createGain();
        this.delayFeedback.gain.value = 0.4;
        
        this.delay.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delay);
        
        // Create compressor to prevent clipping
        this.compressor = this.audioContext.createDynamicsCompressor();
        this.compressor.threshold.value = -20;
        this.compressor.knee.value = 10;
        this.compressor.ratio.value = 12;
        this.compressor.attack.value = 0.003;
        this.compressor.release.value = 0.25;
        
        // Connect effects in parallel
        this.mainGain.connect(this.reverb);
        this.mainGain.connect(this.delay);
        this.reverb.connect(this.compressor);
        this.delay.connect(this.compressor);
        this.compressor.connect(this.audioContext.destination);
    }

    generateImpulseResponse(duration, decay) {
        // Generate an impulse response for the reverb effect
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * duration;
        const impulse = this.audioContext.createBuffer(2, length, sampleRate);
        const leftChannel = impulse.getChannelData(0);
        const rightChannel = impulse.getChannelData(1);
        
        for (let i = 0; i < length; i++) {
            // Random noise with exponential decay
            const n = i / length;
            leftChannel[i] = (Math.random() * 2 - 1) * Math.pow(1 - n, decay);
            rightChannel[i] = (Math.random() * 2 - 1) * Math.pow(1 - n, decay);
        }
        
        return impulse;
    }

    setOutputMode(mode, config = {}) {
        this.outputMode = mode;
        
        if (config.channels) {
            this.surroundConfig.channels = config.channels;
        }
        
        if (config.layout) {
            this.surroundConfig.layout = config.layout;
        }
        
        if (config.dolbyAtmos !== undefined) {
            this.surroundConfig.dolbyAtmos = config.dolbyAtmos;
        }
        
        // Rebuild audio graph with new configuration
        this.disconnectAll();
        this.setupAudioGraph();
        
        console.log(`Audio output mode set to: ${mode}`);
    }

    createSpatialSound(source, position = { x: 0, y: 0, z: 0 }) {
        // Create a panner node for spatial audio
        const panner = this.audioContext.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.refDistance = 1;
        panner.rolloffFactor = 1;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 0;
        panner.coneOuterGain = 0;
        
        // Set position
        panner.setPosition(position.x, position.y, position.z);
        
        // Connect source to panner and panner to main graph
        source.connect(panner);
        panner.connect(this.mainGain);
        
        return {
            panner: panner,
            source: source,
            updatePosition: (x, y, z) => {
                panner.setPosition(x, y, z);
            }
        };
    }

    createMarketInstrument(symbol, baseFrequency) {
        // Create a unique audio source for a market instrument
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = this.getOscillatorTypeForSymbol(symbol);
        oscillator.frequency.setValueAtTime(baseFrequency, this.audioContext.currentTime);
        
        // Create amplitude envelope
        const envelope = this.audioContext.createGain();
        envelope.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        oscillator.connect(envelope);
        
        // Create filter for timbre
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        
        envelope.connect(filter);
        
        return {
            oscillator: oscillator,
            envelope: envelope,
            filter: filter,
            start: (time = this.audioContext.currentTime) => {
                oscillator.start(time);
            },
            stop: (time = this.audioContext.currentTime + 0.1) => {
                envelope.gain.linearRampToValueAtTime(0, time);
                oscillator.stop(time + 0.1);
            },
            trigger: (velocity = 0.7, duration = 0.5) => {
                const now = this.audioContext.currentTime;
                envelope.gain.cancelScheduledValues(now);
                envelope.gain.setValueAtTime(0, now);
                envelope.gain.linearRampToValueAtTime(velocity, now + 0.01);
                envelope.gain.exponentialRampToValueAtTime(0.001, now + duration);
            }
        };
    }

    getOscillatorTypeForSymbol(symbol) {
        // Map market symbols to different oscillator types for variety
        const typeMap = {
            'BTC': 'sawtooth',
            'ETH': 'square',
            'SPY': 'sine',
            'QQQ': 'triangle',
            'GLD': 'sawtooth',
            'default': 'sine'
        };
        
        return typeMap[symbol] || typeMap.default;
    }

    createMarketSoundscape(marketData) {
        // Create a complete audio environment based on market data
        const soundscape = {};
        
        Object.entries(marketData).forEach(([symbol, data]) => {
            // Calculate base frequency from price
            const baseFrequency = 110 + (data.price % 1000) / 10;
            
            // Create instrument for this symbol
            const instrument = this.createMarketInstrument(symbol, baseFrequency);
            
            // Calculate position based on market metrics
            const position = this.calculateSpatialPosition(data);
            
            // Create spatial sound
            const spatialSound = this.createSpatialSound(instrument.filter, position);
            
            // Store reference
            soundscape[symbol] = {
                instrument: instrument,
                spatialSound: spatialSound,
                data: data
            };
            
            // Start the oscillator
            instrument.start();
        });
        
        return soundscape;
    }

    calculateSpatialPosition(marketData) {
        // Calculate 3D position based on market metrics
        // Use price change for left/right, volume for front/back, volatility for up/down
        return {
            x: Math.max(-1, Math.min(1, marketData.change24h / 10)), // Left/Right
            y: Math.max(-1, Math.min(1, Math.log10(marketData.volume) / 10 - 0.5)), // Front/Back
            z: Math.max(-1, Math.min(1, marketData.volatility / 5 - 0.5)) // Up/Down
        };
    }

    updateMarketSoundscape(soundscape, newMarketData) {
        // Update the soundscape with new market data
        Object.entries(newMarketData).forEach(([symbol, data]) => {
            if (soundscape[symbol]) {
                // Update frequency based on price change
                const baseFrequency = 110 + (data.price % 1000) / 10;
                soundscape[symbol].instrument.oscillator.frequency.linearRampToValueAtTime(
                    baseFrequency, this.audioContext.currentTime + 0.1
                );
                
                // Update position based on market metrics
                const position = this.calculateSpatialPosition(data);
                soundscape[symbol].spatialSound.updatePosition(
                    position.x, position.y, position.z
                );
                
                // Trigger envelope if significant change
                if (Math.abs(data.change24h) > 1) {
                    const velocity = Math.min(1, Math.abs(data.change24h) / 10);
                    soundscape[symbol].instrument.trigger(velocity, 0.5);
                }
                
                // Update filter based on volatility
                const filterFreq = 500 + (data.volatility * 100);
                soundscape[symbol].instrument.filter.frequency.linearRampToValueAtTime(
                    filterFreq, this.audioContext.currentTime + 0.1
                );
                
                // Update stored data
                soundscape[symbol].data = data;
            }
        });
    }

    disconnectAll() {
        // Disconnect all audio nodes for cleanup
        this.mainGain.disconnect();
        
        if (this.channelMerger) {
            this.channelMerger.disconnect();
        }
        
        if (this.compressor) {
            this.compressor.disconnect();
        }
        
        if (this.reverb) {
            this.reverb.disconnect();
        }
        
        if (this.delay) {
            this.delay.disconnect();
            this.delayFeedback.disconnect();
        }
    }
}
