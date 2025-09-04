from bells.bell_controller import SevenBells
from utils.market_listener import MarketListener
from utils.audio_engine import AudioEngine
from utils.haptic_engine import HapticEngine

def main():
    # Initialize the instrument
    bells = SevenBells()
    audio = AudioEngine()
    haptic = HapticEngine()
    market_listener = MarketListener(bells)

    print("🎯 Seven Bells of Harmony — Activated")
    print("🔊 Audio Engine — Ready")
    print("📳 Haptic Interface — Online")
    print("📈 Market Listener — Running")

    # Main loop (would be replaced with real market stream)
    while True:
        # This would be replaced with real market data stream
        mock_market_data = {
            'volatility': 2.3,
            'rsi': 28
        }
        market_listener.on_market_event(mock_market_data)

if __name__ == "__main__":
    main()
