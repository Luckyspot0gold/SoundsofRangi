class TextToSpeechEngine:
    def __init__(self):
        # Use a lightweight offline TTS library like Coqui TTS or pyttsx3
        import pyttsx3
        self.engine = pyttsx3.init()
        self.engine.setProperty('rate', 150)  # Speed of speech
        self.engine.setProperty('volume', 0.8) # Volume level

    def speak(self, message, speed=1.0, pitch=1.0):
        """Speak a message with specific prosody (speed and pitch)."""
        self.engine.setProperty('rate', 150 * speed)
        self.engine.setProperty('pitch', pitch)
        self.engine.say(message)
        self.engine.runAndWait()
