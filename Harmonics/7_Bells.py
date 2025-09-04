import simpleaudio as sa
import numpy as np

class HarmonicBells:
    def __init__(self, sample_rate=44100, duration=2.0):
        self.sample_rate = sample_rate
        self.duration = duration
        self.bells = {
            "clarity": 396,
            "strength": 417,
            "transformation": 528,
            "integrity": 639,
            "intuition": 741,
            "manifestation": 852,
            "sovereignty": 963
        }
    
    def play_frequency(self, freq, amplitude=0.7):
        t = np.linspace(0, self.duration, int(self.sample_rate * self.duration), False)
        audio = np.sin(2 * np.pi * freq * t) * amplitude
        audio = (audio * 32767).astype(np.int16)
        play_obj = sa.play_buffer(audio, 1, 2, self.sample_rate)
        return play_obj

    def ring_bell(self, bell_name, intensity=1.0):
        freq = self.bells.get(bell_name)
        if freq:
            scaled_freq = freq * intensity
            self.play_frequency(scaled_freq)
            return scaled_freq
        else:
            print(f"[Bells] Bell '{bell_name}' not found.")
            return None
