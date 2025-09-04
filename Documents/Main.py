from phonics_engine import PhonicsEngine
from harmonic_bells import HarmonicBells
from cymatic_visualizer import CymaticVisualizer

def main():
    phonics = PhonicsEngine(voice='female')
    bells = HarmonicBells()
    cymatic = CymaticVisualizer()
    
    # Example: Ring the "clarity" bell with high intensity
    bell_name = "clarity"
    intensity = 1.2
    
    # Ring the bell
    freq = bells.ring_bell(bell_name, intensity)
    
    # Speak the word
    phonics.speak(bell_name)
    
    # Render the cymatic pattern
    img_data = cymatic.render(freq / 100, intensity, cmap='viridis')
    
    print(f"🎯 {bell_name.upper()} Bell activated at {freq} Hz")
    print("🔊 Phonics spoken")
    print("🖼️ Cymatic visualization generated")
    
    # You can now use `img_data` in a web frontend or save it

if __name__ == "__main__":
    main()
