// src/audio/audio-control-interface.js
export class AudioControlInterface {
    constructor(audioEngine) {
        this.audioEngine = audioEngine;
        this.uiElements = new Map();
        this.currentSoundscape = null;
        this.setupUI();
    }

    setupUI() {
        // Create audio control panel
        this.controlPanel = document.createElement('div');
        this.controlPanel.className = 'audio-control-panel';
        this.controlPanel.innerHTML = `
            <h3>Audio Controls</h3>
            <div class="control-group">
                <label>Output Mode:</label>
                <select id="output-mode">
                    <option value="binaural">Binaural (Headphones)</option>
                    <option value="stereo">Stereo</option>
                    <option value="surround">Surround Sound</option>
                    <option value="dolby-atmos">Dolby Atmos</option>
                </select>
            </div>
            <div class="control-group" id="surround-config">
                <label>Surround Configuration:</label>
                <select id="surround-type">
                    <option value="5.1">5.1 Surround</option>
                    <option value="7.1">7.1 Surround</option>
                    <option value="7.1.4">7.1.4 Dolby Atmos</option>
                </select>
            </div>
            <div class="control-group">
                <label>Reverb Environment:</label>
                <select id="reverb-preset">
                    <option value="market-floor">Market Floor</option>
                    <option value="concert-hall">Concert Hall</option>
                    <option value="small-room">Small Room</option>
                    <option value="cathedral">Cathedral</option>
                </select>
            </div>
            <div class="control-group">
                <label>Master Volume:</label>
                <input type="range" id="master-volume" min="0" max="1" step="0.01" value="0.8">
            </div>
            <div class="control-group">
                <label>Reverb Amount:</label>
                <input type="range" id="reverb-mix" min="0" max="1" step="0.01" value="0.4">
            </div>
            <div class="control-group">
                <label>Delay Amount:</label>
                <input type="range" id="delay-mix" min="0" max="1" step="0.01" value="0.3">
            </div>
            <div class="control-group">
                <button id="reset-audio">Reset Audio</button>
                <button id="mute-audio">Mute</button>
            </div>
        `;
        
        document.body.appendChild(this.controlPanel);
        
        // Set up event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Output mode change
        document.getElementById('output-mode').addEventListener('change', (e) => {
            const mode = e.target.value;
            let config = {};
            
            if (mode === 'surround' || mode === 'dolby-atmos') {
                const surroundType = document.getElementById('surround-type').value;
                config = this.parseSurroundConfig(surroundType);
            }
            
            this.audioEngine.setOutputMode(mode, config);
        });
        
        // Surround configuration change
        document.getElementById('surround-type').addEventListener('change', (e) => {
            const config = this.parseSurroundConfig(e.target.value);
            this.audioEngine.setOutputMode('surround', config);
        });
        
        // Reverb preset change
        document.getElementById('reverb-preset').addEventListener('change', (e) => {
            this.audioEngine.reverb.buffer = this.audioEngine.impulseResponses[e.target.value];
        });
        
        // Master volume control
        document.getElementById('master-volume').addEventListener('input', (e) => {
            this.audioEngine.mainGain.gain.value = parseFloat(e.target.value);
        });
        
        // Reverb mix control
        document.getElementById('reverb-mix').addEventListener('input', (e) => {
            // Adjust reverb send level
            const value = parseFloat(e.target.value);
            this.audioEngine.reverb.gain.value = value;
        });
        
        // Delay mix control
        document.getElementById('delay-mix').addEventListener('input', (e) => {
            // Adjust delay send level
            const value = parseFloat(e.target.value);
            this.audioEngine.delayFeedback.gain.value = value;
        });
        
        // Reset audio
        document.getElementById('reset-audio').addEventListener('click', () => {
            this.audioEngine.disconnectAll();
            this.audioEngine.setupAudioGraph();
        });
        
        // Mute audio
        document.getElementById('mute-audio').addEventListener('click', () => {
            const isMuted = this.audioEngine.mainGain.gain.value === 0;
            this.audioEngine.mainGain.gain.value = isMuted ? 0.8 : 0;
            document.getElementById('mute-audio').textContent = isMuted ? 'Mute' : 'Unmute';
        });
    }

    parseSurroundConfig(type) {
        // Parse surround configuration string
        const configs = {
            '5.1': { channels: 6, layout: 'surround-5.1', dolbyAtmos: false },
            '7.1': { channels: 8, layout: 'surround-7.1', dolbyAtmos: false },
            '7.1.4': { channels: 12, layout: 'surround-7.1.4', dolbyAtmos: true }
        };
        
        return configs[type] || configs['5.1'];
    }

    createMarketSoundscapeUI(marketData) {
        // Create UI elements for each market instrument
        const soundscapeUI = document.createElement('div');
        soundscapeUI.className = 'market-soundscape-ui';
        soundscapeUI.innerHTML = '<h4>Market Instruments</h4>';
        
        // Create controls for each symbol
        Object.entries(marketData).forEach(([symbol, data]) => {
            const instrumentUI = document.createElement('div');
            instrumentUI.className = 'instrument-control';
            instrumentUI.innerHTML = `
                <label>${symbol}:</label>
                <input type="range" class="instrument-volume" data-symbol="${symbol}" 
                       min="0" max="1" step="0.01" value="0.7">
                <span class="instrument-frequency">${data.frequency || 0} Hz</span>
            `;
            
            soundscapeUI.appendChild(instrumentUI);
            
            // Store reference
            this.uiElements.set(symbol, instrumentUI);
        });
        
        document.body.appendChild(soundscapeUI);
        
        // Set up event listeners for instrument controls
        soundscapeUI.querySelectorAll('.instrument-volume').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const symbol = e.target.dataset.symbol;
                const volume = parseFloat(e.target.value);
                
                if (this.currentSoundscape && this.currentSoundscape[symbol]) {
                    this.currentSoundscape[symbol].instrument.envelope.gain.value = volume;
                }
            });
        });
    }

    updateMarketSoundscapeUI(newMarketData) {
        // Update UI with new market data
        Object.entries(newMarketData).forEach(([symbol, data]) => {
            const instrumentUI = this.uiElements.get(symbol);
            if (instrumentUI) {
                const frequencyDisplay = instrumentUI.querySelector('.instrument-frequency');
                if (frequencyDisplay) {
                    frequencyDisplay.textContent = `${data.frequency || 0} Hz`;
                }
            }
        });
    }
}
