class PhonicsRouter:
    def __init__(self):
        self.speech_engine = TextToSpeechEngine()
        self.sound_library = {
            "bullish": "sounds/bullish_phrase.wav",
            "bearish": "sounds/bearish_phrase.wav",
            "warning": "sounds/warning_chime.wav",
            "buy_signal": "sounds/buy_signal.wav",
        }

    def analyze_market_state(self, market_data):
        """Determine what message needs to be communicated."""
        if market_data['rsi'] > 80:
            return {"message": "Warning: RSI is overheating", "urgency": "high", "type": "warning"}
        elif market_data['change_24h'] > 5.0:
            return {"message": "Strong bullish momentum detected", "urgency": "medium", "type": "bullish"}
        # ... more rules

    def communicate(self, market_state):
        """Route the message to the appropriate output method."""
        if market_state['urgency'] == "high":
            # Use a sharp, attention-grabbing sound AND speech
            self.play_sound(self.sound_library["warning"])
            self.speech_engine.speak(market_state['message'], speed=1.5, pitch=1.2)
        elif market_state['type'] == "bullish":
            # Use a more melodic, positive sound
            self.play_sound(self.sound_library["bullish"])
            self.speech_engine.speak(market_state['message'], speed=1.0, pitch=1.0)
