import { MarketAudioManager } from './audio/market-audio-manager.js';

// In your main application
const audioManager = new MarketAudioManager();

// Initialize with market data
audioManager.initialize(marketData);

// Update with new market data
audioManager.update(newMarketData);
