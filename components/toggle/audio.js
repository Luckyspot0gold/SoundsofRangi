if (isAudioEnabled) {
    // Stop audio
    oscillators.forEach(osc => osc.stop());
    oscillators = []; // ✅ Move this line here
    isAudioEnabled = false;
} else {
    // Start audio...
}
