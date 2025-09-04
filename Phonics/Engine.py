import pyttsx3

class PhonicsEngine:
    def __init__(self, voice='default'):
        self.engine = pyttsx3.init()
        self.voices = self.engine.getProperty('voices')
        self.set_voice(voice)
        self.words = {
            "release": "RELEASE",
            "root": "ROOT",
            "shift": "SHIFT",
            "connect": "CONNECT",
            "silence": "SILENCE",
            "ascend": "ASCEND",
            "i_am": "I AM"
        }
    
    def set_voice(self, voice_type):
        if voice_type == 'female' and len(self.voices) > 1:
            self.engine.setProperty('voice', self.voices[1].id)
        else:
            self.engine.setProperty('voice', self.voices[0].id)
    
    def speak(self, word_key):
        word = self.words.get(word_key.lower())
        if word:
            self.engine.say(word)
            self.engine.runAndWait()
        else:
            print(f"[Phonics] Word '{word_key}' not found.")
