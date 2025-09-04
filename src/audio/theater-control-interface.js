// src/audio/theater-control-interface.js
export class TheaterControlInterface {
    constructor(dolbyEngine, qualityEnhancer) {
        this.dolbyEngine = dolbyEngine;
        this.qualityEnhancer = qualityEnhancer;
        this.uiElements = new Map();
        this.setupUI();
    }

    setupUI() {
        // Create theater control panel
        this.controlPanel = document.createElement('div');
        this.controlPanel.className = 'theater-control-panel';
        this.controlPanel.innerHTML = `
            <h3>Dolby 7.1 Theater Controls</h3>
            
            <div class="control-group">
                <label>Audio System:</label>
                <button id="toggle-audio">Enable Dolby 7.1</button>
                <span id="audio-status">Disabled</span>
            </div>
            
            <div class="control-group">
                <label>Quality Preset:</label>
                <select id="quality-preset">
                    <option value="auto">Auto (Market-Based)</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="theater">Theater</option>
                    <option value="immersive">Immersive</option>
                </select>
            </div>
            
            <div class="control-group">
                <label>Enhancement Level: <span id="enhancement-value">0</span>%</label>
                <input type="range" id="enhancement-level" min="0" max="100" value="0">
            </div>
            
            <div class="control-group">
                <label>Master Volume: <span id="volume-value">70</span>%</label>
                <input type="range" id="master-volume" min="0" max="100" value="70">
            </div>
            
            <div class="control-group">
                <label>Reverb Amount: <span id="reverb-value">50</span>%</label>
                <input type="range" id="reverb-amount" min="0" max="100" value="50">
            </div>
            
            <div class="control-group">
                <label>Bass Boost: <span id="bass-value">0</span>dB</label>
                <input type="range" id="bass-boost" min="0" max="12" value="0">
            </div>
            
            <div class="channel-controls">
                <h4>Channel Levels</h4>
                <div class="channel-sliders">
                    ${this.dolbyEngine.speakerPositions.map((speaker, index) => `
                        <div class="channel-control">
                            <label>${speaker.name}: <span class="channel-value" data-channel="${index}">70</span>%</label>
                            <input type="range" class="channel-level" data-channel="${index}" min="0" max="100" value="70">
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="control-group">
                <button id="reset-audio">Reset Audio Settings</button>
                <button id="calibrate-audio">Calibrate System</button>
            </div>
            
            <div class="status-display">
                <h4>System Status</h4>
                <div id="audio-status-display">Loading...</div>
            </div>
        `;
        
        document.body.appendChild(this.controlPanel);
        this.setupEventListeners();
        this.updateStatusDisplay();
    }

    setupEventListeners() {
        // Toggle audio system
        document.getElementById('toggle-audio').addEventListener('click', () => {
            if (this.dolbyEngine.isEnabled) {
                this.dolbyEngine.disable();
                document.getElementById('audio-status').textContent = 'Disabled';
                document.getElementById('toggle-audio').textContent = 'Enable Dolby 7.1';
            } else {
                this.dolbyEngine.enable();
                document.getElementById('audio-status').textContent = 'Enabled';
                document.getElementById('toggle-audio').textContent = 'Disable Dolby 7.1';
            }
        });
        
        // Quality preset change
        document.getElementById('quality-preset').addEventListener('change', (e) => {
            if (e.target.value !== 'auto') {
                this.qualityEnhancer.qualityPresets[e.target.value]();
                this.qualityEnhancer.currentPreset = e.target.value;
            }
        });
        
        // Enhancement level
        document.getElementById('enhancement-level').addEventListener('input', (e) => {
            const level = parseInt(e.target.value) / 100;
            document.getElementById('enhancement-value').textContent = e.target.value;
            this.qualityEnhancer.applyDynamicEnhancements(level);
        });
        
        // Master volume
        document.getElementById('master-volume').addEventListener('input', (e) => {
            const volume = parseInt(e.target.value) / 100;
            document.getElementById('volume-value').textContent = e.target.value;
            
            // Adjust all channel gains proportionally
            this.dolbyEngine.channelGains.forEach(gain => {
                const currentGain = gain.gain.value;
                gain.gain.linearRampToValueAtTime(
                    currentGain * volume, this.dolbyEngine.audioContext.currentTime + 0.1
                );
            });
        });
        
        // Reverb amount
        document.getElementById('reverb-amount').addEventListener('input', (e) => {
            document.getElementById('reverb-value').textContent = e.target.value;
            // Implementation would adjust reverb send levels
        });
        
        // Bass boost
        document.getElementById('bass-boost').addEventListener('input', (e) => {
            document.getElementById('bass-value').textContent = e.target.value;
            // Implementation would adjust EQ for low frequencies
        });
        
        // Channel levels
        document.querySelectorAll('.channel-level').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const channel = parseInt(e.target.dataset.channel);
                const value = parseInt(e.target.value) / 100;
                
                document.querySelector(`.channel-value[data-channel="${channel}"]`).textContent = e.target.value;
                this.dolbyEngine.channelGains[channel].gain.linearRampToValueAtTime(
                    value, this.dolbyEngine.audioContext.currentTime + 0.1
                );
            });
        });
        
        // Reset audio
        document.getElementById('reset-audio').addEventListener('click', () => {
            this.resetAudioSettings();
        });
        
        // Calibrate audio
        document.getElementById('calibrate-audio').addEventListener('click', () => {
            this.calibrateAudioSystem();
        });
    }

    updateStatusDisplay() {
        const status = this.dolbyEngine.getAudioStatus();
        const enhancement = this.qualityEnhancer.getEnhancementStatus();
        
        const statusHTML = `
            <p>Audio Context: ${status.state}</p>
            <p>Sample Rate: ${status.sampleRate}Hz</p>
            <p>Active Sources: ${status.activeSources}</p>
            <p>Current Preset: ${enhancement.preset}</p>
            <p>Enhancement Level: ${Math.round(enhancement.level * 100)}%</p>
        `;
        
        document.getElementById('audio-status-display').innerHTML = statusHTML;
        
        // Update every second
        setTimeout(() => this.updateStatusDisplay(), 1000);
    }

    resetAudioSettings() {
        // Reset all audio settings to defaults
        this.dolbyEngine.channelGains.forEach((gain, index) => {
            gain.gain.setValueAtTime(0.7, this.dolbyEngine.audioContext.currentTime);
            document.querySelector(`.channel-value[data-channel="${index}"]`).textContent = '70';
            document.querySelector(`.channel-level[data-channel="${index}"]`).value = 70;
        });
        
        document.getElementById('enhancement-level').value = 0;
        document.getElementById('enhancement-value').textContent = '0';
        
        document.getElementById('master-volume').value = 70;
        document.getElementById('volume-value').textContent = '70';
        
        document.getElementById('reverb-amount').value = 50;
        document.getElementById('reverb-value').textContent = '50';
        
        document.getElementById('bass-boost').value = 0;
        document.getElementById('bass-value').textContent = '0';
        
        document.getElementById('quality-preset').value = 'auto';
        
        this.qualityEnhancer.applyStandardPreset();
        this.qualityEnhancer.enhancementLevel = 0;
        
        console.log("Audio settings reset to defaults");
    }

    calibrateAudioSystem() {
        // Run audio calibration routine
        console.log("Starting audio calibration...");
        
        // Create calibration tone
        const oscillator = this.dolbyEngine.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, this.dolbyEngine.audioContext.currentTime);
        
        const gain = this.dolbyEngine.audioContext.createGain();
        gain.gain.setValueAtTime(0.1, this.dolbyEngine.audioContext.currentTime);
        
        oscillator.connect(gain);
        
        // Play calibration tone through each channel sequentially
        const calibrationInterval = setInterval(() => {
            if (this.currentCalibrationChannel === undefined) {
                this.currentCalibrationChannel = 0;
            } else {
                this.currentCalibrationChannel++;
            }
            
            if (this.currentCalibrationChannel >= this.dolbyEngine.channelCount) {
                // Calibration complete
                clearInterval(calibrationInterval);
                gain.disconnect();
                oscillator.stop();
                console.log("Audio calibration complete");
                return;
            }
            
            // Connect to current channel
            gain.disconnect();
            gain.connect(this.dolbyEngine.channelGains[this.currentCalibrationChannel]);
            
            console.log(`Calibrating channel: ${this.dolbyEngine.speakerPositions[this.currentCalibrationChannel].name}`);
        }, 2000);
        
        oscillator.start();
    }

    updateMarketSounds(marketData) {
        // Update all market sounds with new data
        Object.entries(marketData).forEach(([symbol, data]) => {
            this.dolbyEngine.updateMarketSound(symbol, data);
        });
        
        // Apply quality enhancements based on market conditions
        const enhancementInfo = this.qualityEnhancer.applyEnhancements(marketData);
        
        // Update UI if in auto mode
        if (document.getElementById('quality-preset').value === 'auto') {
            document.getElementById('enhancement-level').value = Math.round(enhancementInfo.level * 100);
            document.getElementById('enhancement-value').textContent = Math.round(enhancementInfo.level * 100);
        }
    }
}
