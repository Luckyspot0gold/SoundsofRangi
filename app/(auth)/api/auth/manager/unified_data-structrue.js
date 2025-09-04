{
  timestamp: Date.now(),
  assets: {
    btc: {
      price: number,
      change: number,
      volume: number,
      sources: ['coinbase', 'avalanche'] // Track data provenance
    },
    eth: {
      price: number,
      change: number,
      volume: number,
      sources: ['coinbase', 'stellar']
    },
    sol: {
      price: number,
      change: number,
      volume: number,
      sources: ['solana']
    }
  },
  marketMetrics: {
    totalMarketCap: number,
    dominance: {
      btc: number,
      eth: number
    },
    fearGreedIndex: number
  }
}
