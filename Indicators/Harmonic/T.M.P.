class HarmonicOrchestrator {
  constructor() {
    // Define your core harmonic bells
    this.bells = {
      1: 86.0,    // Foundation bell (432/5)
      2: 111.11,  // Lambda, return-to-sender
      3: 432.0,   // Universal base harmonic
      4: 0,       // T.M.P. - To be calculated dynamically from Fear & Greed
      5: 753.0,   // Fibonacci progression
      6: 1074.0,  // Energy bell
      7: 1618.0   // Golden ratio culmination
    };
    this.fearAndGreedValue = 50; // Initialize to neutral (50)
  }

  // Method to update the Fear & Greed value and recalculate the 4th bell
  updateMarketSentiment(fearGreedValue) {
    // Clamp the value between 0 and 100
    this.fearAndGreedValue = Math.max(0, Math.min(100, fearGreedValue));
    
    // Map Fear & Greed (0-100) to a frequency range around 432Hz.
    // Let's say from -100Hz (Extreme Fear) to +100Hz (Extreme Greed)
    // This creates a very perceptible sonic change.
    const frequencyDelta = (this.fearAndGreedValue - 50) * 4; // 50 (neutral) * 4 = 0; 0 * 4 = -200; 100 * 4 = +200
    // Alternative: const frequencyDelta = (this.fearAndGreedValue - 50) * (432 / 50); // Scales directly to the base harmonic
    
    // Calculate the T.M.P. frequency
    this.bells[4] = this.bells[3] + frequencyDelta; // Base harmonic (432) + delta

    console.log(`📊 Fear & Greed: ${this.fearAndGreedValue}`);
    console.log(`🔔 T.M.P. (Bell 4) Frequency: ${this.bells[4].toFixed(2)} Hz`);
    
    // Trigger the haptic pulse based on intensity
    this.triggerHapticPulse(this.fearAndGreedValue);
  }

  // Method to trigger a haptic pulse based on sentiment intensity
  triggerHapticPulse(intensity) {
    // Map intensity (0-100) to haptic strength and pattern.
    // 0-25 (Extreme Fear): Strong, slow, warning pulse
    // 26-75 (Neutral): Gentle, steady, calm pulse
    // 76-100 (Extreme Greed): Rapid, intense, alert vibration
    const hapticPattern = this.calculateHapticPattern(intensity);
    
    // Send pattern to the haptic engine (Apple Watch, phone, vest)
    // Example: Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    console.log(`📳 Haptic Pattern Triggered: ${hapticPattern}`);
  }

  calculateHapticPattern(intensity) {
    if (intensity <= 25) return 'Warning: Strong, slow pulse.';
    else if (intensity <= 75) return 'Info: Gentle, steady pulse.';
    else return 'Success: Rapid, intense vibration.';
  }

  // Method to play the entire sequence
  playBellSequence() {
    for (const [bellNumber, frequency] of Object.entries(this.bells)) {
      console.log(`🔔 Playing Bell ${bellNumber}: ${frequency} Hz`);
      // Code to trigger the oscillator for each frequency
    }
  }
}

// ------- Usage Example ------- //
const orchestrator = new HarmonicOrchestrator();

// Simulate a market event causing Extreme Greed
orchestrator.updateMarketSentiment(90); // Output: T.M.P. Frequency: 432 + (90-50)*4 = 592 Hz & intense haptic
orchestrator.playBellSequence();

// Simulate a market crash causing Extreme Fear
orchestrator.updateMarketSentiment(15); // Output: T.M.P. Frequency: 432 + (15-50)*4 = 292 Hz & warning haptic
orchestrator.playBellSequence();
