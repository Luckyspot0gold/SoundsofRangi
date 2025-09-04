// src/audio/dolby-7.1-engine.js
export class Dolby71Engine {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.channelCount = 8; // 7.1 channels
        this.speakerPositions = this.calculateSpeakerPositions();
        this.soundSources = new Map();
        this.isEnabled = false;
        
        this.setupDolbyEnvironment();
    }

    setupDolbyEnvironment() {
        // Create channel merger for 7.1 surround
        this.channelMerger = this.audioContext.createChannelMerger(this.channelCount);
        
        // Create gain nodes for each channel
        this.channelGains = [];
        for (let i = 0; i < this.channelCount; i++) {
            const gain = this.audioContext.createGain();
            gain.gain.value = 0.7; // Default gain
            gain.connect(this.channelMerger, 0, i);
            this.channelGains.push(gain);
        }
        
        // Connect to destination
        this.channelMerger.connect(this.audioContext.destination);
        
        // Create reverb for acoustic environment simulation
        this.reverb = this.audioContext.createConvolver();
        this.reverb.buffer = this.createConcertHallImpulseResponse();
        this.reverb.connect(this.channelGains[3]); // Connect to LFE channel primarily
        
        // Create compressor for dynamic range control
        this.compressor = this.audioContext.createDynamicsCompressor();
        this.compressor.threshold.value = -20;
        this.compressor.knee.value = 10;
        this.compressor.ratio.value = 12;
        this.compressor.attack.value = 0.003;
        this.compressor.release.value = 0.25;
        this.compressor.connect(this.channelMerger);
        
        console.log("Dolby 7.1 audio engine initialized");
    }

    calculateSpeakerPositions() {
        // Define standard 7.1 speaker positions
        return [
            { name: 'Front Left', x: -1, y: 0, z: -1 },     // Channel 0
            { name: 'Front Right', x: 1, y: 0, z: -1 },     // Channel 1
            { name: 'Center', x: 0, y: 0, z: -1 },          // Channel 2
            { name: 'LFE', x: 0, y: 0, z: 0 },              // Channel 3 (Subwoofer)
            { name: 'Rear Left', x: -1, y: 0, z: 1 },       // Channel 4
            { name: 'Rear Right', x: 1, y: 0, z: 1 },        // Channel 5
            { name: 'Side Left', x: -1, y: 0, z: 0 },       // Channel 6
            { name: 'Side Right', x: 1, y: 0, z: 0 }        // Channel 7
        ];
    }

    createConcertHallImpulseResponse() {
        // Create a realistic concert hall impulse response
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * 3; // 3 seconds
        const impulse = this.audioContext.createBuffer(2, length, sampleRate);
        
        const leftChannel = impulse.getChannelData(0);
        const rightChannel = impulse.getChannelData(1);
        
        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            
            // Early reflections
            const early = Math.exp(-t * 3) * Math.sin(2 * Math.PI * 800 * t);
            
            // Late reverberation
            const late = Math.exp(-t * 1.5) * (Math.random() * 2 - 1) * 0.1;
            
            leftChannel[i] = (early + late) * 0.5;
            rightChannel[i] = (early + late * 0.9) * 0.5;
        }
        
        return impulse;
    }

    createMarketSoundSource(symbol, marketData) {
        const frequency = this.calculateFrequencyFromMarketData(marketData);
        const position = this.calculateSoundPosition(marketData);
        
        // Create oscillator for this market instrument
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = this.getOscillatorType(symbol);
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        // Create filters for timbre control
        const lowPass = this.audioContext.createBiquadFilter();
        lowPass.type = 'lowpass';
        lowPass.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        
        const highPass = this.audioContext.createBiquadFilter();
        highPass.type = 'highpass';
        highPass.frequency.setValueAtTime(200, this.audioContext.currentTime);
        
        // Create panner for spatial positioning
        const panner = this.audioContext.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.refDistance = 1;
        panner.rolloffFactor = 1;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 0;
        panner.coneOuterGain = 0;
        panner.setPosition(position.x, position.y, position.z);
        
        // Create gain for volume control
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(this.calculateVolume(marketData), this.audioContext.currentTime);
        
        // Connect audio chain
        oscillator.connect(lowPass);
        lowPass.connect(highPass);
        highPass.connect(panner);
        panner.connect(gain);
        
        // Route to appropriate channels based on position
        this.routeToChannels(gain, position);
        
        oscillator.start();
        
        // Store sound source
        this.soundSources.set(symbol, {
            oscillator,
            filters: { lowPass, highPass },
            panner,
            gain,
            frequency,
            position,
            marketData
        });
        
        return { oscillator, gain, panner };
    }

    calculateFrequencyFromMarketData(marketData) {
        // Convert market data to audio frequency
        const baseFrequency = 110; // A2 note
        
        // Price influences pitch
        const priceFactor = (marketData.price % 1000) / 1000;
        
        // Volume influences brightness (filter frequency)
        const volumeFactor = Math.log10(marketData.volume) / 10;
        
        // Volatility influences modulation
        const volatilityFactor = marketData.volatility / 10;
        
        return baseFrequency * (1 + priceFactor * 0.5 + volatilityFactor * 0.2);
    }

    calculateSoundPosition(marketData) {
        // Calculate 3D position based on market metrics
        return {
            x: Math.max(-1, Math.min(1, marketData.change24h / 10)), // Left/Right
            y: Math.max(-1, Math.min(1, Math.log10(marketData.volume) / 10 - 0.5)), // Front/Back
            z: Math.max(-1, Math.min(1, marketData.volatility / 5 - 0.5)) // Up/Down
        };
    }

    routeToChannels(sourceNode, position) {
        // Calculate gains for each channel based on sound position
        const gains = this.calculateChannelGains(position);
        
        // Create splitter to route to multiple channels
        const splitter = this.audioContext.createChannelSplitter(this.channelCount);
        sourceNode.connect(splitter);
        
        // Connect each channel to the appropriate gain node
        for (let i = 0; i < this.channelCount; i++) {
            const channelGain = this.audioContext.createGain();
            channelGain.gain.setValueAtTime(gains[i], this.audioContext.currentTime);
            
            splitter.connect(channelGain, i);
            channelGain.connect(this.channelGains[i]);
        }
    }

    calculateChannelGains(position) {
        // Calculate gains for each channel based on 3D position
        const gains = new Array(this.channelCount).fill(0);
        
        // Front channels (0, 1, 2)
        gains[0] = Math.max(0, (1 - position.x) * (1 - position.y) * 0.5); // Front Left
        gains[1] = Math.max(0, (1 + position.x) * (1 - position.y) * 0.5); // Front Right
        gains[2] = Math.max(0, (1 - Math.abs(position.x)) * (1 - position.y) * 0.7); // Center
        
        // LFE channel (3) - low frequency effects
        gains[3] = 0.3 + (Math.abs(position.z) * 0.4); // More bass for volatile markets
        
        // Rear channels (4, 5)
        gains[4] = Math.max(0, (1 - position.x) * (1 + position.y) * 0.6); // Rear Left
        gains[5] = Math.max(0, (1 + position.x) * (1 + position.y) * 0.6); // Rear Right
        
        // Side channels (6, 7)
        gains[6] = Math.max(0, (1 - position.x) * (1 - Math.abs(position.y)) * 0.7); // Side Left
        gains[7] = Math.max(0, (1 + position.x) * (1 - Math.abs(position.y)) * 0.7); // Side Right
        
        // Normalize gains to prevent clipping
        const total = gains.reduce((sum, gain) => sum + gain, 0);
        if (total > 1) {
            return gains.map(gain => gain / total);
        }
        
        return gains;
    }

    calculateVolume(marketData) {
        // Calculate volume based on market activity
        const baseVolume = 0.5;
        const volumeFactor = Math.min(1, Math.log10(marketData.volume) / 10);
        const volatilityFactor = Math.min(0.5, marketData.volatility / 20);
        
        return baseVolume + volumeFactor * 0.3 + volatilityFactor * 0.2;
    }

    getOscillatorType(symbol) {
        // Map market symbols to different oscillator types
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

    updateMarketSound(symbol, newMarketData) {
        if (!this.soundSources.has(symbol)) {
            this.createMarketSoundSource(symbol, newMarketData);
            return;
        }
        
        const soundSource = this.soundSources.get(symbol);
        const newFrequency = this.calculateFrequencyFromMarketData(newMarketData);
        const newPosition = this.calculateSoundPosition(newMarketData);
        const newVolume = this.calculateVolume(newMarketData);
        
        // Update frequency
        soundSource.oscillator.frequency.linearRampToValueAtTime(
            newFrequency, this.audioContext.currentTime + 0.1
        );
        
        // Update position
        soundSource.panner.setPosition(newPosition.x, newPosition.y, newPosition.z);
        
        // Update filters based on volatility
        soundSource.filters.lowPass.frequency.linearRampToValueAtTime(
            500 + (newMarketData.volatility * 100), this.audioContext.currentTime + 0.1
        );
        
        // Update volume
        soundSource.gain.gain.linearRampToValueAtTime(
            newVolume, this.audioContext.currentTime + 0.1
        );
        
        // Update routing based on new position
        this.updateChannelRouting(soundSource.gain, newPosition);
        
        // Store updated data
        soundSource.frequency = newFrequency;
        soundSource.position = newPosition;
        soundSource.marketData = newMarketData;
    }

    updateChannelRouting(sourceNode, position) {
        // Recalculate channel gains based on new position
        const gains = this.calculateChannelGains(position);
        
        // Update each channel gain
        for (let i = 0; i < this.channelCount; i++) {
            this.channelGains[i].gain.linearRampToValueAtTime(
                gains[i], this.audioContext.currentTime + 0.1
            );
        }
    }

    applyDynamicEQ(marketConditions) {
        // Apply dynamic equalization based on market conditions
        const eqBands = this.calculateEQBands(marketConditions);
        
        // Create or update EQ filters for each channel
        for (let i = 0; i < this.channelCount; i++) {
            if (!this.channelEQs) this.channelEQs = [];
            if (!this.channelEQs[i]) this.channelEQs[i] = [];
            
            // Clear existing EQs
            this.channelEQs[i].forEach(eq => eq.disconnect());
            this.channelEQs[i] = [];
            
            // Apply new EQs
            eqBands.forEach(band => {
                const eq = this.audioContext.createBiquadFilter();
                eq.type = band.type;
                eq.frequency.setValueAtTime(band.frequency, this.audioContext.currentTime);
                eq.gain.setValueAtTime(band.gain, this.audioContext.currentTime);
                
                // Insert EQ into channel signal path
                this.channelGains[i].disconnect();
                this.channelGains[i].connect(eq);
                eq.connect(this.channelMerger, 0, i);
                
                this.channelEQs[i].push(eq);
            });
        }
    }

    calculateEQBands(marketConditions) {
        // Calculate EQ bands based on market conditions
        const bands = [];
        
        // Low frequencies (bass) - influenced by market volume
        bands.push({
            type: 'lowshelf',
            frequency: 250,
            gain: Math.min(12, Math.log10(marketConditions.totalVolume) / 2)
        });
        
        // Mid frequencies - influenced by market volatility
        bands.push({
            type: 'peaking',
            frequency: 1000,
            gain: marketConditions.avgVolatility * 2,
            Q: 1.0
        });
        
        // High frequencies - influenced by market activity
        bands.push({
            type: 'highshelf',
            frequency: 4000,
            gain: Math.min(6, marketConditions.activity * 3)
        });
        
        return bands;
    }

    enable() {
        if (this.isEnabled) return;
        
        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.isEnabled = true;
        console.log("Dolby 7.1 audio enabled");
    }

    disable() {
        if (!this.isEnabled) return;
        
        // Suspend audio context to save resources
        this.audioContext.suspend();
        this.isEnabled = false;
        console.log("Dolby 7.1 audio disabled");
    }

    getAudioStatus() {
        return {
            enabled: this.isEnabled,
            state: this.audioContext.state,
            sampleRate: this.audioContext.sampleRate,
            currentTime: this.audioContext.currentTime,
            activeSources: this.soundSources.size
        };
    }
}
