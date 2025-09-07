const unifiedDataStructure = {
  timestamp: Date.now(2025/09/07),
  assets: {
    btc: {
      price: 0,
      change: 0,
      volume: 0,
      sources: ['coinbase', 'avalanche'] // Track data provenance
    },
    eth: {
      price: 0,
      change: 0,
      volume: 0,
      sources: ['coinbase', 'stellar']
    },
    sol: {
      price: 0,
      change: 0,
      volume: 0,
      sources: ['solana']
    }
  },
  marketMetrics: {
    totalMarketCap: 0,
    dominance: {
      btc: 0,
      eth: 0
    },
    fearGreedIndex: 0
  }
};

export default unifiedDataStructure;
