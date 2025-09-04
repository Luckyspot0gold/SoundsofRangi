// SoundofRangi Core System - Shared across all components
class SoundofRangiCore {
    constructor() {
        this.baseFrequency = 432;
        this.lambdaFrequency = 111.11;
        this.noteColors = {
            'C': '#FF00FF', 'D': '#FFA500', 'E': '#FFFF00', 
            'F': '#0000FF', 'G': '#800080', 'A': '#FFFFFF', 'B': '#FF0000'
        };
        this.isInitialized = false;
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Initialize audio context with user gesture requirement
        this.setupAudioContext();
        this.loadUserPreferences();
        this.isInitialized = true;
        
        console.log("SoundofRangi Core initialized");
    }
    
    setupAudioContext() {
        // Improved audio context handling
        this.audioContext = null;
        this.audioEnabled = false;
        
        // Create on user interaction
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });
    }
    
    calculateMarketFrequency(priceChange) {
        return this.baseFrequency * (1 + priceChange / 100);
    }
    
    // Add error handling for frequency calculations
    safeFrequencyCalculation(priceChange) {
        try {
            if (typeof priceChange !== 'number') {
                throw new Error('Price change must be a number');
            }
            return this.calculateMarketFrequency(priceChange);
        } catch (error) {
            console.error('Frequency calculation error:', error);
            return this.baseFrequency; // Fallback to base frequency
        }
    }
    
    // Shared utility for API calls
    async apiCall(endpoint, options = {}) {
        const baseURL = 'https://api.soundofrangi.com';
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        try {
            const response = await fetch(`${baseURL}${endpoint}`, {
                ...defaultOptions,
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            // Implement retry logic or fallback data
            return this.getFallbackData(endpoint);
        }
    }
    
    getFallbackData(endpoint) {
        // Provide sensible fallback data for each endpoint
        const fallbacks = {
            '/market-data': {
                btc: { price: 45000, change: 2.5 },
                eth: { price: 2800, change: 1.8 },
                sol: { price: 100, change: -0.5 }
            }
        };
        
        return fallbacks[endpoint] || null;
    }
}

// Create and export a singleton instance
const SoundofRangi = new SoundofRangiCore();
export default SoundofRangi;
