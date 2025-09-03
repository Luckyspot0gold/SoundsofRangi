// === ORION'S RANGI SONIC ENGINE - GENESIS PROTOTYPE ===
// Proof-of-Resonance Consensus Implementation
// W.J. McCrea - Reality Protocol LLC

import * as Tone from "https://cdn.skypack.dev/tone";

class OrionRangiSonicEngine {
    constructor() {
        this.baseFrequency = 432; // Hz - Universal harmonic base
        this.consensusActive = false;
        this.currentCycle = 0;
        this.cycleDuration = 1000 / this.baseFrequency; // 2.315ms per cycle
        
        // Consensus state
        this.hriValue = 0;
        this.sssValue = 0;
        this.lastConsensusTime = 0;
        this.consensusHistory = [];
        
        // Audio components
        this.baseOscillator = null;
        this.harmonicSynths = [];
        this.rhythmSynth = null;
        
        // Market data
        this.marketData = {
            btc: { price: 0, volume: 0, change: 0 },
            eth: { price: 0, volume: 0, change: 0 },
            timestamp: 0
        };
        
        // Immutable ledger
        this.ledger = [];
        this.currentBlock = null;
        
        this.initializeAudioEngine();
        this.initializeLedger();
    }

    // === AUDIO ENGINE INITIALIZATION ===
    async initializeAudioEngine() {
        try {
            await Tone.start();
            console.log("🎵 Orion Rangi Sonic Engine - Audio Context Started");
            
            // Create base 432Hz oscillator (continuous hum)
            this.baseOscillator = new Tone.Oscillator(this.baseFrequency, "sine");
            this.baseOscillator.volume.value = -20; // Subtle background
            this.baseOscillator.connect(Tone.Destination);
            this.baseOscillator.start();
            
            // Create harmonic synthesizers for HRI mapping
            this.harmonicSynths = [
                new Tone.Synth({ oscillator: { type: "sine" } }),
                new Tone.Synth({ oscillator: { type: "triangle" } }),
                new Tone.Synth({ oscillator: { type: "sawtooth" } }),
                new Tone.Synth({ oscillator: { type: "square" } })
            ];
            
            this.harmonicSynths.forEach(synth => {
                synth.volume.value = -15;
                synth.connect(Tone.Destination);
            });
            
            // Create rhythm synthesizer for SSS mapping
            this.rhythmSynth = new Tone.MembraneSynth();
            this.rhythmSynth.volume.value = -10;
            this.rhythmSynth.connect(Tone.Destination);
            
            console.log("✅ Audio Engine Initialized - 432Hz Base Active");
            
        } catch (error) {
            console.error("❌ Audio Engine Initialization Failed:", error);
        }
    }

    // === IMMUTABLE LEDGER INITIALIZATION ===
    initializeLedger() {
        // Genesis block
        const genesisBlock = {
            blockNumber: 0,
            timestamp: Date.now(),
            previousHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
            hriValues: [],
            sssValues: [],
            harmonicProof: this.generateHarmonicProof(0, 0),
            sonicSignature: this.generateSonicSignature(0, 0),
            hash: null
        };
        
        genesisBlock.hash = this.calculateBlockHash(genesisBlock);
        this.ledger.push(genesisBlock);
        this.currentBlock = this.createNewBlock();
        
        console.log("🔗 Immutable Ledger Initialized - Genesis Block Created");
    }

    // === MARKET DATA INGESTION ===
    async ingestMarketData(symbol, price, volume, change) {
        const timestamp = Date.now();
        
        // Update market data
        this.marketData[symbol.toLowerCase()] = {
            price: parseFloat(price),
            volume: parseFloat(volume),
            change: parseFloat(change),
            timestamp: timestamp
        };
        
        // Calculate HRI and SSS
        const hri = this.calculateHRI();
        const sss = this.calculateSSS();
        
        // Update consensus values
        this.hriValue = hri;
        this.sssValue = sss;
        
        // Trigger sonic output
        this.generateSonicOutput(hri, sss, change);
        
        // Check if 432Hz cycle is complete
        if (this.isCycleComplete()) {
            await this.commitToLedger(hri, sss);
        }
        
        console.log(`📊 Market Data: ${symbol} $${price} (${change}%) | HRI: ${hri.toFixed(2)} | SSS: ${sss.toFixed(2)}`);
        
        return { hri, sss, timestamp };
    }

    // === HARMONIC RESONANCE INDEX CALCULATION ===
    calculateHRI() {
        const btc = this.marketData.btc;
        const eth = this.marketData.eth;
        
        if (!btc.price || !eth.price) return 0;
        
        // Calculate harmonic components
        const priceHarmonic = this.calculatePriceHarmonic(btc.price, eth.price);
        const volumeHarmonic = this.calculateVolumeHarmonic(btc.volume, eth.volume);
        const changeHarmonic = this.calculateChangeHarmonic(btc.change, eth.change);
        
        // Weight factors for different components
        const priceWeight = 0.5;
        const volumeWeight = 0.3;
        const changeWeight = 0.2;
        
        // Calculate weighted HRI
        const hri = (priceHarmonic * priceWeight + 
                    volumeHarmonic * volumeWeight + 
                    changeHarmonic * changeWeight);
        
        // Apply resonance amplification factor
        const resonanceFactor = this.calculateResonanceFactor();
        
        return Math.max(0, Math.min(100, hri * resonanceFactor));
    }

    calculatePriceHarmonic(btcPrice, ethPrice) {
        if (!btcPrice || !ethPrice) return 0;
        
        // Calculate price ratio and its harmonic properties
        const ratio = btcPrice / ethPrice;
        const harmonicRatio = this.baseFrequency / (ratio % this.baseFrequency);
        
        // Convert to 0-100 scale
        return Math.abs(Math.sin(harmonicRatio * Math.PI / 180)) * 100;
    }

    calculateVolumeHarmonic(btcVolume, ethVolume) {
        if (!btcVolume || !ethVolume) return 0;
        
        // Calculate volume resonance
        const totalVolume = btcVolume + ethVolume;
        const volumeFreq = (totalVolume % 1000000) / 1000000 * this.baseFrequency;
        
        return Math.abs(Math.cos(volumeFreq * Math.PI / 180)) * 100;
    }

    calculateChangeHarmonic(btcChange, ethChange) {
        // Calculate change correlation and harmonic alignment
        const avgChange = (btcChange + ethChange) / 2;
        const changeFreq = this.baseFrequency + (avgChange * 10);
        
        return Math.abs(Math.sin(changeFreq * Math.PI / 432)) * 100;
    }

    calculateResonanceFactor() {
        // Calculate resonance amplification based on market harmony
        const btc = this.marketData.btc;
        const eth = this.marketData.eth;
        
        if (!btc.change || !eth.change) return 1.0;
        
        // Higher resonance when markets move in harmony
        const correlation = Math.abs(btc.change - eth.change);
        const resonance = 1.0 + (1.0 / (1.0 + correlation));
        
        return Math.max(0.5, Math.min(2.0, resonance));
    }

    // === SONIC STABILITY SCORE CALCULATION ===
    calculateSSS() {
        const btc = this.marketData.btc;
        const eth = this.marketData.eth;
        
        if (!btc.price || !eth.price) return 0;
        
        // Calculate frequency components
        const frequencies = [
            this.baseFrequency,
            this.baseFrequency * (1 + btc.change / 100),
            this.baseFrequency * (1 + eth.change / 100),
            this.baseFrequency * 2, // Octave
            this.baseFrequency * 1.5 // Perfect fifth
        ];
        
        // Calculate mean frequency
        const meanFreq = frequencies.reduce((sum, freq) => sum + freq, 0) / frequencies.length;
        
        // Calculate stability score (lower = more stable)
        let stabilitySum = 0;
        frequencies.forEach(freq => {
            const deviation = Math.pow(freq - meanFreq, 2);
            stabilitySum += deviation;
        });
        
        const sss = Math.sqrt(stabilitySum / frequencies.length);
        
        // Normalize to 0-100 scale (0 = very stable, 100 = very unstable)
        return Math.max(0, Math.min(100, sss / 10));
    }

    // === SONIC OUTPUT GENERATION ===
    generateSonicOutput(hri, sss, priceChange) {
        try {
            // Play HRI harmony
            this.playHRIHarmony(hri);
            
            // Play SSS rhythm
            this.playSSS(sss);
            
            // Play price change effects
            this.playPriceChangeEffect(priceChange);
            
        } catch (error) {
            console.error("❌ Sonic Output Error:", error);
        }
    }

    playHRIHarmony(hriValue) {
        // Map HRI to harmonic overtones
        const notes = ["C4", "E4", "G4", "B4", "C5"]; // Harmonic series
        const index = Math.floor((hriValue / 100) * (notes.length - 1));
        
        if (this.harmonicSynths[0]) {
            this.harmonicSynths[0].triggerAttackRelease(notes[index], "4n");
        }
        
        // Add harmonic color based on HRI value
        const harmonicFreq = this.baseFrequency * (1 + hriValue / 200);
        if (this.harmonicSynths[1]) {
            this.harmonicSynths[1].frequency.setValueAtTime(harmonicFreq, Tone.now());
            this.harmonicSynths[1].triggerAttackRelease(harmonicFreq, "8n");
        }
    }

    playSSS(sssValue) {
        // Map SSS to rhythm (lower SSS = slower, more stable rhythm)
        const baseTempo = 60; // BPM
        const maxTempo = 180; // BPM
        const tempo = baseTempo + ((100 - sssValue) / 100) * (maxTempo - baseTempo);
        
        // Update transport tempo
        Tone.Transport.bpm.value = tempo;
        
        // Trigger rhythmic element
        if (this.rhythmSynth) {
            this.rhythmSynth.triggerAttackRelease("C2", "16n");
        }
    }

    playPriceChangeEffect(priceChange) {
        if (priceChange > 0) {
            // Positive change - bright, ascending tone
            const brightSynth = new Tone.Synth({ 
                oscillator: { type: "triangle" },
                envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.5 }
            }).toDestination();
            
            const freq = this.baseFrequency * (1 + priceChange / 100);
            brightSynth.triggerAttackRelease(freq, "8n");
            
        } else if (priceChange < 0) {
            // Negative change - dark, descending tone
            const darkSynth = new Tone.Synth({ 
                oscillator: { type: "sawtooth" },
                envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.8 }
            }).toDestination();
            
            const freq = this.baseFrequency * (1 + priceChange / 100);
            darkSynth.triggerAttackRelease(freq, "4n");
        }
    }

    // === CONSENSUS CYCLE MANAGEMENT ===
    isCycleComplete() {
        const now = Date.now();
        const timeSinceLastConsensus = now - this.lastConsensusTime;
        
        // Check if 432Hz cycle is complete (2.315ms)
        return timeSinceLastConsensus >= this.cycleDuration;
    }

    async commitToLedger(hri, sss) {
        const timestamp = Date.now();
        
        // Add values to current block
        this.currentBlock.hriValues.push({
            value: hri,
            timestamp: timestamp,
            signature: this.generateValueSignature(hri, timestamp)
        });
        
        this.currentBlock.sssValues.push({
            value: sss,
            timestamp: timestamp,
            signature: this.generateValueSignature(sss, timestamp)
        });
        
        // Generate harmonic proof and sonic signature
        this.currentBlock.harmonicProof = this.generateHarmonicProof(hri, sss);
        this.currentBlock.sonicSignature = this.generateSonicSignature(hri, sss);
        
        // Commit block to ledger
        this.currentBlock.hash = this.calculateBlockHash(this.currentBlock);
        this.ledger.push({ ...this.currentBlock });
        
        // Update consensus history
        this.consensusHistory.push({
            blockNumber: this.currentBlock.blockNumber,
            hri: hri,
            sss: sss,
            timestamp: timestamp,
            harmonicQuality: this.calculateHarmonicQuality(hri, sss)
        });
        
        // Create new block for next cycle
        this.currentBlock = this.createNewBlock();
        this.lastConsensusTime = timestamp;
        this.currentCycle++;
        
        console.log(`🔗 Block ${this.ledger.length - 1} Committed | HRI: ${hri.toFixed(2)} | SSS: ${sss.toFixed(2)}`);
        
        return this.ledger[this.ledger.length - 1];
    }

    createNewBlock() {
        const previousBlock = this.ledger[this.ledger.length - 1];
        
        return {
            blockNumber: this.ledger.length,
            timestamp: Date.now(),
            previousHash: previousBlock ? previousBlock.hash : "0x0",
            hriValues: [],
            sssValues: [],
            harmonicProof: null,
            sonicSignature: null,
            hash: null
        };
    }

    // === CRYPTOGRAPHIC FUNCTIONS ===
    generateHarmonicProof(hri, sss) {
        // Generate cryptographic proof based on harmonic properties
        const harmonicData = `${hri.toFixed(6)}_${sss.toFixed(6)}_${this.baseFrequency}`;
        return this.simpleHash(harmonicData);
    }

    generateSonicSignature(hri, sss) {
        // Generate sonic fingerprint of the consensus values
        const sonicData = `${Math.sin(hri * Math.PI / 180)}_${Math.cos(sss * Math.PI / 180)}`;
        return this.simpleHash(sonicData);
    }

    generateValueSignature(value, timestamp) {
        const signatureData = `${value}_${timestamp}_${this.baseFrequency}`;
        return this.simpleHash(signatureData);
    }

    calculateBlockHash(block) {
        const blockData = `${block.blockNumber}_${block.timestamp}_${block.previousHash}_${block.harmonicProof}_${block.sonicSignature}`;
        return this.simpleHash(blockData);
    }

    simpleHash(data) {
        // Simple hash function for demonstration (use proper crypto in production)
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }

    calculateHarmonicQuality(hri, sss) {
        // Calculate overall harmonic quality (0-100)
        const hriQuality = hri;
        const sssQuality = 100 - sss; // Invert SSS (lower is better)
        
        return (hriQuality + sssQuality) / 2;
    }

    // === FREQUENCY TO COLOR MAPPING ===
    getFrequencyColor(frequency) {
        // Map frequencies to colors based on harmonic relationships
        const baseColors = {
            432: "#FFD700",  // Golden Yellow (Base)
            216: "#FF8C00",  // Orange (Octave Down)
            864: "#FFFF00",  // Bright Yellow (Octave Up)
            1296: "#90EE90", // Light Green (Perfect Fifth)
            1728: "#00FFFF"  // Cyan (Second Octave)
        };
        
        // Find closest harmonic frequency
        const harmonics = Object.keys(baseColors).map(Number);
        const closest = harmonics.reduce((prev, curr) => 
            Math.abs(curr - frequency) < Math.abs(prev - frequency) ? curr : prev
        );
        
        return baseColors[closest] || "#FFD700";
    }

    getHRIColor(hri) {
        // Map HRI values to colors
        if (hri <= 20) return "#8B0000";      // Deep Red
        if (hri <= 40) return "#FF4500";      // Orange Red
        if (hri <= 60) return "#FFD700";      // Golden Yellow
        if (hri <= 80) return "#90EE90";      // Light Green
        return "#006400";                     // Deep Green
    }

    getSSSColor(sss) {
        // Map SSS values to colors (inverted - lower is better)
        if (sss <= 20) return "#00FF00";      // Bright Green (Very Stable)
        if (sss <= 40) return "#9ACD32";      // Yellow Green (Stable)
        if (sss <= 60) return "#FFD700";      // Golden Yellow (Moderate)
        if (sss <= 80) return "#FFA500";      // Orange (Unstable)
        return "#FF0000";                     // Red (Very Unstable)
    }

    // === MUSICAL NOTE MAPPING ===
    getHRINote(hri) {
        // Map HRI to musical notes (C Major scale)
        const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];
        const index = Math.floor((hri / 100) * (notes.length - 1));
        return notes[index];
    }

    getSSSRhythm(sss) {
        // Map SSS to rhythmic patterns
        const baseBPM = 60;
        const maxBPM = 180;
        return baseBPM + ((100 - sss) / 100) * (maxBPM - baseBPM);
    }

    // === PUBLIC API METHODS ===
    async startConsensus() {
        this.consensusActive = true;
        console.log("🚀 Proof-of-Resonance Consensus Started");
        
        // Start consensus monitoring loop
        this.consensusLoop();
    }

    stopConsensus() {
        this.consensusActive = false;
        console.log("⏹️ Proof-of-Resonance Consensus Stopped");
    }

    consensusLoop() {
        if (!this.consensusActive) return;
        
        // Monitor consensus health
        const harmonicQuality = this.calculateHarmonicQuality(this.hriValue, this.sssValue);
        
        if (harmonicQuality < 50) {
            console.warn("⚠️ Low Harmonic Quality Detected:", harmonicQuality);
        }
        
        // Schedule next check
        setTimeout(() => this.consensusLoop(), this.cycleDuration);
    }

    getConsensusStatus() {
        return {
            active: this.consensusActive,
            currentCycle: this.currentCycle,
            hriValue: this.hriValue,
            sssValue: this.sssValue,
            harmonicQuality: this.calculateHarmonicQuality(this.hriValue, this.sssValue),
            ledgerBlocks: this.ledger.length,
            lastConsensusTime: this.lastConsensusTime
        };
    }

    getLedgerHistory() {
        return this.ledger.map(block => ({
            blockNumber: block.blockNumber,
            timestamp: block.timestamp,
            hriCount: block.hriValues.length,
            sssCount: block.sssValues.length,
            hash: block.hash
        }));
    }

    // === CLEANUP ===
    dispose() {
        if (this.baseOscillator) {
            this.baseOscillator.stop();
            this.baseOscillator.dispose();
        }
        
        this.harmonicSynths.forEach(synth => {
            synth.dispose();
        });
        
        if (this.rhythmSynth) {
            this.rhythmSynth.dispose();
        }
        
        this.stopConsensus();
        console.log("🔄 Orion Rangi Sonic Engine Disposed");
    }
}

// === EXPORT FOR MODULE USE ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrionRangiSonicEngine;
}

// === GLOBAL WINDOW EXPORT FOR BROWSER ===
if (typeof window !== 'undefined') {
    window.OrionRangiSonicEngine = OrionRangiSonicEngine;
}

console.log("🎵 Orion Rangi Sonic Engine - Genesis Prototype Loaded");
console.log("🔗 Proof-of-Resonance Consensus Ready");
console.log("⚡ 432Hz Harmonic Processing Active");

