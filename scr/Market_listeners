# Listens to live market data and triggers bells based on your rules
class MarketListener:
    def __init__(self, bell_controller):
        self.bell_controller = bell_controller
        # This will connect to your preferred market data API
        # (CoinGecko, Alpha Vantage, Alpaca, etc.)

    def on_market_event(self, data):
        # Your proprietary logic here:
        # Example: If volatility spikes > 2%, trigger Bell of Clarity (396 Hz)
        if data['volatility'] > 2.0:
            self.bell_controller.trigger_bell("clarity", intensity=1.0)

        # Example: If RSI < 30, trigger Bell of Manifestation (852 Hz) - BUY
        if data['rsi'] < 30:
            self.bell_controller.trigger_bell("manifestation", intensity=0.8)
