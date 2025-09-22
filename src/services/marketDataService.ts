// services/marketDataService.ts
import { CoinGeckoAPI, KrakenAPI } from './apiClients';

export class RealMarketDataService {
  static async fetchXIONPrice(): Promise<number> {
    try {
      // Try CoinGecko first
      const coingeckoData = await CoinGeckoAPI.getCoinData('xion');
      if (coingeckoData?.price) return coingeckoData.price;
      
      // Fallback to Kraken
      const krakenData = await KrakenAPI.getTicker('XIONUSD');
      return krakenData.price || 5.10; // Default fallback
    } catch (error) {
      console.error('XION price fetch failed, using fallback:', error);
      return 5.10;
    }
  }

  static async fetchAllMarketData() {
    const [btc, eth, xion] = await Promise.all([
      this.fetchBTCData(),
      this.fetchETHData(), 
      this.fetchXIONPrice()
    ]);
    
    return {
      bitcoin: { price: btc.price, change: btc.change },
      ethereum: { price: eth.price, change: eth.change },
      xion: { price: xion, change: await this.getXIONChange() }
    };
  }
}
