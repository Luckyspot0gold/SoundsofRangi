// src/audio/dolby-atmos-integration.js
export class DolbyAtmosIntegration {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.isSupported = this.checkDolbyAtmosSupport();
        this.objects = new Map();
        this.beds = new Map();
        
        if (this.isSupported) {
            this.setupDolbyAtmos();
        }
    }

    checkDolbyAtmosSupport() {
        // Check if the browser supports the necessary APIs for spatial audio
        return (
            'AudioContext' in window &&
            'createPanner' in window.AudioContext.prototype &&
            'setPosition' in window.AudioContext.prototype.PannerNode
        );
    }

    setupDolbyAtmos() {
        // Setup for Dolby Atmos rendering
        this.metadata = {
            format: 'Dolby Atmos',
            version: '1.0',
            channels: 24, // 7.1.4 + objects
            objects: 10,
            beds: 4
        };
        
        console.log("Dolby Atmos integration initialized");
    }

    createAudioObject(source, initialPosition) {
        if (!this.isSupported) return null;
        
        // Create a spatial audio object for Dolby Atmos
        const panner = this.audioContext.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'exponential';
        panner.refDistance = 1;
        panner.maxDistance = 10000;
        panner.rolloffFactor = 1;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 0;
        panner.coneOuterGain = 0;
        
        panner.setPosition(initialPosition.x, initialPosition.y, initialPosition.z);
        
        source.connect(panner);
        panner.connect(this.audioContext.destination);
        
        const audioObject = {
            panner: panner,
            source: source,
            updatePosition: (x, y, z) => {
                panner.setPosition(x, y, z);
            },
            updateVelocity: (x, y, z) => {
                panner.setVelocity(x, y, z);
            },
            updateOrientation: (x, y, z) => {
                panner.setOrientation(x, y, z);
            }
        };
        
        return audioObject;
    }

    createBedChannel(type, index) {
        if (!this.isSupported) return null;
        
        // Create a bed channel (static speaker position)
        const gain = this.audioContext.createGain();
        gain.gain.value = 0.7;
        
        const panner = this.audioContext.createPanner();
        panner.panningModel = 'equalpower';
        
        // Set position based on bed type and index
        const position = this.getBedPosition(type, index);
        panner.setPosition(position.x, position.y, position.z);
        
        gain.connect(panner);
        panner.connect(this.audioContext.destination);
        
        const bedChannel = {
            gain: gain,
            panner: panner,
            type: type,
            index: index
        };
        
        this.beds.set(`${type}-${index}`, bedChannel);
        return bedChannel;
    }

    getBedPosition(type, index) {
        // Define standard bed positions for Dolby Atmos
        const positions = {
            'floor': [
                { x: -1, y: 0, z: -1 },  // Front Left
                { x: 1, y: 0, z: -1 },   // Front Right
                { x: 0, y: 0, z: -1 },   // Center
                { x: -1, y: 0, z: 1 },   // Rear Left
                { x: 1, y: 0, z: 1 },    // Rear Right
                { x: -0.5, y: 0, z: 0 }, // Side Left
                { x: 0.5, y: 0, z: 0 },  // Side Right
            ],
            'height': [
                { x: -1, y: 1, z: -1 },  // Top Front Left
                { x: 1, y: 1, z: -1 },   // Top Front Right
                { x: -1, y: 1, z: 1 },   // Top Rear Left
                { x: 1, y: 1, z: 1 }     // Top Rear Right
            ]
        };
        
        return positions[type][index] || { x: 0, y: 0, z: 0 };
    }

    createMarketObject(symbol, marketData) {
        if (!this.isSupported) return null;
        
        // Create an audio source for a market symbol
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = this.getOscillatorType(symbol);
        
        // Set frequency based on price
        const baseFrequency = 110 + (marketData.price % 1000) / 10;
        oscillator.frequency.setValueAtTime(baseFrequency, this.audioContext.currentTime);
        
        // Create envelope
        const envelope = this.audioContext.createGain();
        envelope.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        oscillator.connect(envelope);
        
        // Calculate initial position
        const position = this.calculateObjectPosition(marketData);
        
        // Create audio object
        const audioObject = this.createAudioObject(envelope, position);
        
        if (audioObject) {
            // Start oscillator
            oscillator.start();
            
            // Store reference
            this.objects.set(symbol, {
                oscillator: oscillator,
                envelope: envelope,
                audioObject: audioObject,
                data: marketData
            });
        }
        
        return audioObject;
    }

    calculateObjectPosition(marketData) {
        // Calculate 3D position for Dolby Atmos
        return {
            x: Math.max(-1, Math.min(1, marketData.change24h / 10)),
            y: Math.max(0, Math.min(1, Math.log10(marketData.volume) / 15)),
            z: Math.max(-1, Math.min(1, marketData.volatility / 5 - 0.5))
        };
    }

    updateMarketObjects(newMarketData) {
        if (!this.isSupported) return;
        
        Object.entries(newMarketData).forEach(([symbol, data]) => {
            if (this.objects.has(symbol)) {
                const object = this.objects.get(symbol);
                
                // Update frequency
                const baseFrequency = 110 + (data.price % 1000) / 10;
                object.oscillator.frequency.linearRampToValueAtTime(
                    baseFrequency, this.audioContext.currentTime + 0.1
                );
                
                // Update position
                const position = this.calculateObjectPosition(data);
                object.audioObject.updatePosition(position.x, position.y, position.z);
                
                // Update volume based on market activity
                const volume = Math.min(1, Math.log10(data.volume) / 10);
                object.envelope.gain.linearRampToValueAtTime(
                    volume, this.audioContext.currentTime + 0.1
                );
                
                // Trigger if significant change
                if (Math.abs(data.change24h) > 2) {
                    this.triggerObject(symbol, Math.min(1, Math.abs(data.change24h) / 10));
                }
                
                // Update stored data
                object.data = data;
            }
        });
    }

    triggerObject(symbol, intensity = 0.7) {
        if (!this.isSupported || !this.objects.has(symbol)) return;
        
        const object = this.objects.get(symbol);
        const now = this.audioContext.currentTime;
        
        // Create an amplitude envelope
        object.envelope.gain.cancelScheduledValues(now);
        object.envelope.gain.setValueAtTime(0, now);
        object.envelope.gain.linearRampToValueAtTime(intensity, now + 0.05);
        object.envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    }

    getOscillatorType(symbol) {
        // Map symbols to oscillator types
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
}
