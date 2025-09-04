const express = require('express');
const axios = require('axios');
const router = express.Router();

// Environment-based configuration
const API_CONFIG = {
  avalanche: {
    url: 'https://api.avax.network/ext/bc/C/rpc',
    key: process.env.AVALANCHE_API_KEY
  },
  coinbase: {
    url: 'https://api.coinbase.com/v2',
    key: process.env.COINBASE_API_KEY,
    secret: process.env.COINBASE_API_SECRET
  },
  solana: {
    url: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
  }
};

// Generic proxy endpoint
router.post('/proxy/:service', async (req, res) => {
  try {
    const { service } = req.params;
    const { endpoint, params } = req.body;
    
    if (!API_CONFIG[service]) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    const config = {
      method: 'POST',
      url: `${API_CONFIG[service].url}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: params
    };
    
    // Add service-specific authentication
    if (API_CONFIG[service].key) {
      config.headers['X-API-KEY'] = API_CONFIG[service].key;
    }
    
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'API request failed' });
  }
});

// Specialized endpoints for specific services
router.get('/market-data', async (req, res) => {
  try {
    // Parallel API requests
    const [avalancheData, coinbaseData, solanaData] = await Promise.all([
      getAvalancheData(),
      getCoinbaseData(),
      getSolanaData()
    ]);
    
    res.json({
      timestamp: Date.now(),
      avalanche: processAvalancheData(avalancheData),
      coinbase: processCoinbaseData(coinbaseData),
      solana: processSolanaData(solanaData)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

module.exports = router;
