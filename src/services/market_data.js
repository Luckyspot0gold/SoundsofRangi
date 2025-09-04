import apiService from './api.js';

class MarketDataService {
  constructor() {
    this.data = {
      btc: { price: 0, change: 0 },
      eth: { price: 0, change: 0 },
      sol: { price: 0, change: 0 },
      avax: { price: 0, change: 0 },
      link: { price: 0, change: 0 }
    };
    this.subscribers = [];
  }

  async initialize() {
    await this.updateAllData();
    // Update every 30 seconds
    setInterval(() => this.updateAllData(), 30000);
  }

  async updateAllData() {
    try {
      const [coinbaseData, avalancheData] = await Promise.all([
        apiService.getCoinbasePrices(),
        apiService.getAvalancheStats()
      ]);

      this.processCoinbaseData(coinbaseData);
      this.processAvalancheData(avalancheData);
      
      this.notifySubscribers();
    } catch (error) {
      console.error('Failed to update market data:', error);
      // Implement fallback to secondary APIs or cached data
    }
  }

  processCoinbaseData(data) {
    // Example structure based on Coinbase API response
    this.data.btc.price = parseFloat(data.data.BTC.amount);
    this.data.eth.price = parseFloat(data.data.ETH.amount);
    this.data.sol.price = parseFloat(data.data.SOL.amount);
    
    // Calculate changes (you might need to store previous values)
    this.calculateChanges();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.data));
  }
}

export default new MarketDataService();
