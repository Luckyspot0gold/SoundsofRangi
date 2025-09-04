// src/core/harmonic-processor.js
export class HarmonicProcessor {
  decomposeSignal(frequencyData) {
    // Extract individual harmonic components using FFT
    const harmonics = [];
    const fundamental = this.findFundamentalFrequency(frequencyData);
    
    for (let i = 1; i <= 16; i++) {
      const harmonicFreq = fundamental * i;
      const amplitude = this.getAmplitudeAtFrequency(frequencyData, harmonicFreq);
      
      if (amplitude > 0.1) { // Threshold for significant harmonics
        harmonics.push({
          order: i,
          frequency: harmonicFreq,
          amplitude: amplitude,
          wavelength: 343 / harmonicFreq,
          color: this.frequencyToColor(harmonicFreq)
        });
      }
    }
    
    return harmonics;
  }
}
