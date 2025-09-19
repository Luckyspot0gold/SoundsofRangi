``python "H.R.I.
import hashlib
import numpy as np
from scipy.io import wavfile

# Golden Ratio-based frequencies
base_freq = 432.0
golden_ratio = 1.61803398875
bell_frequencies = [base_freq * (golden_ratio ** (n/2)) for n in range(0, 7)]

def generate_harmonic_signature(data):
    # Create hash from data
    data_hash = hashlib.sha256(data.encode()).hexdigest()
    hash_int = int(data_hash[:8], 16)  # Use first 8 chars for a number
    
    # Generate a complex waveform from your 7 bells
    sample_rate = 44100
    duration = 5.0  seconds
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    
    audio_signal = np.zeros_like(t)
    for freq in bell_frequencies:
        # Amplitude of each bell modulated by the hash
        amplitude = np.sin(hash_int * freq) * 0.2  
        audio_signal += amplitude * np.sin(2 * np.pi * freq * t)
    
    # Normalize and save
    audio_signal *= 32767 / np.max(np.abs(audio_signal))
    audio_signal = audio_signal.astype(np.int16)
    
    wavfile.write('harmonic_signature.wav', sample_rate, audio_signal)
    return data_hash, bell_frequencies

# Generate the signature for your data
data = "Rangi's Heartbeat Proof of Concept"
hash_value, freqs_used = generate_harmonic_signature(data)
print(f"Data Hash: {hash_value}")
print(f"Frequencies Used: {[f'{f:.2f} Hz' for f in freqs_used]}")
```
