function drawWaveform() {
  try {
    // Existing drawing code
    
    // Add fallback if market data is unavailable
    if (!marketData || Object.keys(marketData).length === 0) {
      drawFallbackWaveform();
      return;
    }
    
    // Proceed with normal drawing
  } catch (error) {
    console.error('Error drawing waveform:', error);
    drawErrorState();
  }
}

function drawFallbackWaveform() {
  // Draw a placeholder or informative message
  const ctx = waveCtx;
  const width = waveformCanvas.offsetWidth;
  const height = waveformCanvas.offsetHeight;
  
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.font = '16px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText('Waiting for market data...', width / 2, height / 2);
}
