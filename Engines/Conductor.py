class ConductorEngine:
    def __init__(self):
        self.harmonic = HarmonicEngine()
        self.phonics = PhonicsRouter()
        self.logic = MarketLogicEngine()

    def process_market_stream(self, data):
        # Step 1: The Logic Section analyzes the data
        logical_analysis = self.logic.analyze(data)
        
        # Step 2: The Conductor chooses a "composition" based on the analysis
        composition = self.choose_composition(logical_analysis)
        
        # Step 3: Orchestrate the sections based on the chosen composition
        # This defines the mix of sound and speech
        output = {
            'harmonic_mix': composition['harmonic_intensity'],
            'phonic_message': self.phonics.create_message(composition),
            'phonic_urgency': composition['urgency'],
            'visual_pattern': self.harmonic.generate_pattern(composition['frequency'])
        }
        
        return output

    def choose_composition(self, analysis):
        # This is the AI brain: rules to map market states to experiences
        compositions = {
            "calm_accumulation": {
                "harmonic_intensity": 0.4,
                "urgency": "low",
                "message_type": "analyst",
                "frequency": 432  # Base frequency
            },
            "panic_selling": {
                "harmonic_intensity": 0.9,
                "urgency": "critical",
                "message_type": "mentor",
                "frequency": 111.11  # Return to sender frequency
            },
            "bull_breakout": {
                "harmonic_intensity": 0.7,
                "urgency": "high",
                "message_type": "strategist",
                "frequency": 450  # Elevated, excited frequency
            }
        }
        
        # Logic to choose the right composition
        if analysis['volatility'] > 50 and analysis['price_change'] < -3:
            return compositions["panic_selling"]
        elif analysis['volume_spike'] and analysis['rsi'] > 70:
            return compositions["bull_breakout"]
        else:
            return compositions["calm_accumulation"]
