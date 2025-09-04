import marketDataService from './services/marketData.js';

// Initialize when your app starts
marketDataService.initialize();

// Subscribe to data updates
marketDataService.subscribe((newData) => {
  marketData = newData;
  updateMarketDisplays();
});

// Update your existing functions
function updateMarketDisplays() {
  document.getElementById('btc-price').textContent = `$${marketData.btc.price.toFixed(2)}`;
  document.getElementById('eth-price').textContent = `$${marketData.eth.price.toFixed(2)}`;
  document.getElementById('sol-price').textContent = `$${marketData.sol.price.toFixed(2)}`;
  // Add more assets as needed
}

// Modified animation loop
function animate() {
  currentTime += 16;
  
  // Visualization will automatically update when new data arrives
  // via the subscriber pattern
  
  drawWaveform();
  drawSpectrum();
  drawResonance();
  drawCorrelation();
  
  animationId = requestAnimationFrame(animate);
}
