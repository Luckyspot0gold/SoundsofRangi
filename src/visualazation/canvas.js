window.addEventListener('resize', () => {
    initializeCanvases();
    // Redraw everything immediately after resizing
    drawWaveform();
    drawSpectrum();
    drawResonance();
    drawCorrelation();
});
