class APIService {
  constructor() {
    this.baseURL = '/api'; // Proxy to your backend
    this.cache = new Map();
    this.cacheDuration = 30000; // 30 seconds
  }

  async request(service, endpoint, params = {}) {
    const cacheKey = `${service}-${endpoint}-${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    
    // Return cached data if available and not expired
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    try {
      const response = await fetch(`${this.baseURL}/proxy/${service}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint, params })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.error(`API request failed for ${service}:`, error);
      
      // Return stale cache data if available (better than nothing)
      if (cached) {
        return cached.data;
      }
      
      throw error;
    }
  }

  // Service-specific methods
  async getAvalancheStats() {
    return this.request('avalanche', '/ext/bc/C/rpc', {
      jsonrpc: "2.0",
      id: 1,
      method: "avax.getAssetDescription",
      params: ["AVAX"]
    });
  }

  async getCoinbasePrices() {
    return this.request('coinbase', '/prices', {
      currencies: ['BTC', 'ETH', 'SOL', 'AVAX', 'LINK']
    });
  }

  async getSolanaAccountInfo(publicKey) {
    return this.request('solana', '/', {
      jsonrpc: "2.0",
      id: 1,
      method: "getAccountInfo",
      params: [
        publicKey,
        { encoding: "jsonParsed" }
      ]
    });
  }
}

// Singleton instance
export default new APIService();
