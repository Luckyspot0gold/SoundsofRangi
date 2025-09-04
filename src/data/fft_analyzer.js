class FFTAnalyzer {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
  }

  getFrequencyData() {
    this.analyser.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  }

  findPeakFrequencies() {
    const data = this.getFrequencyData();
    const peaks = [];
    const minPeakHeight = 200; // Adjust based on your audio levels

    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > minPeakHeight && data[i] > data[i-1] && data[i] > data[i+1]) {
        const frequency = i * this.audioContext.sampleRate / this.analyser.fftSize;
        peaks.push({
          frequency: frequency,
          magnitude: data[i]
        });
      }
    }

    return peaks.sort((a, b) => b.magnitude - a.magnitude);
  }

  calculateSpectralCentroid() {
    const data = this.getFrequencyData();
    let total = 0;
    let weightedTotal = 0;

    for (let i = 0; i < data.length; i++) {
      const frequency = i * this.audioContext.sampleRate / this.analyser.fftSize;
      weightedTotal += frequency * data[i];
      total += data[i];
    }

    return total > 0 ? weightedTotal / total : 0;
  }
}
