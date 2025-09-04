import { TheaterManager } from './audio/theater-manager.js';

// In your main application
const theaterManager = new TheaterManager();

// Initialize with market data
theaterManager.initialize(marketData);

// Update with new market data
theaterManager.update(newMarketData);

// Enable/disable as needed
theaterManager.enable();
