// Seamless Asset Integration Engine for Rangi's Worldwide
// Includes the revolutionary T.M.P. (Temporal Market Pulse) Indicator

import React, { useState, useEffect, useCallback } from 'react';

// Enhanced McCrea Market Indicators with T.M.P.
const MCCREA_INDICATORS = {
  HRI: 'Harmonic Resonance Index',
  SSS: 'Sonic Stability Score', 
  HIV: 'Harmonic Investment Velocity',
  HRS: 'Harmonic Risk Score',
  ISS: 'Investment Sonic Signature',
  TMP: 'Temporal Market Pulse' // NEW: Fear & Greed driven frequency modulation
};

// T.M.P. Frequency Mapping based on Fear & Greed Index
const TMP_FREQUENCY_MAP = {
  'Extreme Fear': { range: [0, 25], baseFreq: 256.0, haptic: 'warning', color: '#DC2626' },
  'Fear': { range: [26, 45], baseFreq: 341.3, haptic: 'caution', color: '#EA580C' },
  'Neutral': { range: [46, 54], baseFreq: 432.0, haptic: 'calm', color: '#059669' },
  'Greed': { range: [55, 75], baseFreq: 528.0, haptic: 'excited', color: '#7C3AED' },
  'Extreme Greed': { range: [76, 100], baseFreq: 741.0, haptic: 'alert', color: '#BE185D' }
};

// Seamless Asset Integration Engine Component
export const SeamlessAssetIntegrationEngine = ({ 
  connectedWallets, 
  discoveredAssets, 
  onIntegrationComplete 
}) => {
  const [integrationStatus, setIntegrationStatus] = useState('initializing');
  const [realTimeData, setRealTimeData] = useState({});
  const [tmpIndicator, setTmpIndicator] = useState(null);
  const [enhancedAssets, setEnhancedAssets] = useState([]);
  const [marketSentiment, setMarketSentiment] = useState('neutral');
  const [globalHarmonicState, setGlobalHarmonicState] = useState({});

  // Initialize real-time data streams
  const initializeDataStreams = useCallback(async () => {
    setIntegrationStatus('connecting');
    
    try {
      // Initialize market data streams
      await initializeMarketDataStream();
      
      // Initialize T.M.P. indicator
      await initializeTMPIndicator();
      
      // Initialize asset-specific data streams
      await initializeAssetStreams();
      
      setIntegrationStatus('active');
    } catch (error) {
      console.error('Failed to initialize data streams:', error);
      setIntegrationStatus('error');
    }
  }, [discoveredAssets]);

  // Initialize T.M.P. (Temporal Market Pulse) Indicator
  const initializeTMPIndicator = async () => {
    try {
      const tmpData = await fetchTMPData();
      setTmpIndicator(tmpData);
      
      // Update global harmonic state based on T.M.P.
      updateGlobalHarmonicState(tmpData);
      
      // Set up real-time T.M.P. updates
      const tmpInterval = setInterval(async () => {
        const updatedTMP = await fetchTMPData();
        setTmpIndicator(updatedTMP);
        updateGlobalHarmonicState(updatedTMP);
      }, 300000); // Update every 5 minutes
      
      return () => clearInterval(tmpInterval);
    } catch (error) {
      console.error('T.M.P. initialization failed:', error);
    }
  };

  // Fetch T.M.P. data from Fear & Greed Index
  const fetchTMPData = async () => {
    try {
      // In production, this would call your AWS Lambda function
      const response = await fetch('https://api.alternative.me/fng/');
      const data = await response.json();
      
      const currentValue = parseInt(data.data[0].value);
      const classification = data.data[0].value_classification;
      
      // Calculate T.M.P. frequency based on Fear & Greed Index
      const baseFrequency = 432.0;
      const frequencyDelta = (currentValue - 50) * 4; // Centers on 50 (neutral)
      const tmpFrequency = baseFrequency + frequencyDelta;
      
      // Determine haptic pattern
      let hapticPattern = 'calm';
      if (currentValue <= 25) hapticPattern = 'warning';
      else if (currentValue >= 75) hapticPattern = 'alert';
      else if (currentValue <= 45) hapticPattern = 'caution';
      else if (currentValue >= 55) hapticPattern = 'excited';
      
      // Get frequency mapping details
      const frequencyMap = Object.values(TMP_FREQUENCY_MAP).find(
        map => currentValue >= map.range[0] && currentValue <= map.range[1]
      ) || TMP_FREQUENCY_MAP['Neutral'];
      
      return {
        fearGreedValue: currentValue,
        classification: classification,
        tmpFrequency: tmpFrequency,
        baseFrequency: frequencyMap.baseFreq,
        hapticPattern: hapticPattern,
        color: frequencyMap.color,
        timestamp: new Date().toISOString(),
        marketSentiment: classification.toLowerCase().replace(' ', '_')
      };
    } catch (error) {
      console.error('Failed to fetch T.M.P. data:', error);
      return null;
    }
  };

  // Update global harmonic state based on T.M.P.
  const updateGlobalHarmonicState = (tmpData) => {
    if (!tmpData) return;
    
    setMarketSentiment(tmpData.marketSentiment);
    setGlobalHarmonicState(prevState => ({
      ...prevState,
      tmpFrequency: tmpData.tmpFrequency,
      baseFrequency: tmpData.baseFrequency,
      marketSentiment: tmpData.marketSentiment,
      hapticPattern: tmpData.hapticPattern,
      sentimentColor: tmpData.color,
      lastUpdate: tmpData.timestamp
    }));
  };

  // Initialize market data stream for all assets
  const initializeMarketDataStream = async () => {
    const marketData = {};
    
    for (const asset of discoveredAssets) {
      try {
        const data = await fetchAssetMarketData(asset);
        marketData[asset.symbol] = data;
      } catch (error) {
        console.warn(`Failed to fetch market data for ${asset.symbol}:`, error);
      }
    }
    
    setRealTimeData(marketData);
    
    // Set up real-time updates
    const marketInterval = setInterval(async () => {
      const updatedData = {};
      for (const asset of discoveredAssets) {
        try {
          const data = await fetchAssetMarketData(asset);
          updatedData[asset.symbol] = data;
        } catch (error) {
          console.warn(`Failed to update market data for ${asset.symbol}:`, error);
        }
      }
      setRealTimeData(updatedData);
    }, 15000); // Update every 15 seconds
    
    return () => clearInterval(marketInterval);
  };

  // Fetch market data for individual asset
  const fetchAssetMarketData = async (asset) => {
    try {
      // Map asset symbols to CoinGecko IDs
      const coinGeckoIds = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'XION': 'xion-staked-xion', // Placeholder
        'SOL': 'solana',
        'ATOM': 'cosmos',
        'USDC': 'usd-coin',
        'USDT': 'tether',
        'WBTC': 'wrapped-bitcoin',
        'UNI': 'uniswap',
        'LINK': 'chainlink'
      };
      
      const coinId = coinGeckoIds[asset.symbol] || asset.symbol.toLowerCase();
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
      );
      
      const data = await response.json();
      const coinData = data[coinId];
      
      if (!coinData) {
        throw new Error(`No data found for ${asset.symbol}`);
      }
      
      return {
        price: coinData.usd,
        change24h: coinData.usd_24h_change || 0,
        volume24h: coinData.usd_24h_vol || 0,
        marketCap: coinData.usd_market_cap || 0,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Market data fetch failed for ${asset.symbol}:`, error);
      return {
        price: 0,
        change24h: 0,
        volume24h: 0,
        marketCap: 0,
        lastUpdate: new Date().toISOString()
      };
    }
  };

  // Initialize asset-specific data streams
  const initializeAssetStreams = async () => {
    const enhanced = discoveredAssets.map(asset => {
      const marketData = realTimeData[asset.symbol] || {};
      const enhancedAsset = {
        ...asset,
        marketData,
        mcCreaIndicators: calculateEnhancedMcCreaIndicators(asset, marketData),
        harmonicProfile: generateEnhancedHarmonicProfile(asset, marketData),
        integrationStatus: 'active'
      };
      
      return enhancedAsset;
    });
    
    setEnhancedAssets(enhanced);
  };

  // Calculate Enhanced McCrea Market Indicators including T.M.P.
  const calculateEnhancedMcCreaIndicators = (asset, marketData) => {
    const price = marketData.price || 0;
    const volume = marketData.volume24h || 0;
    const change = marketData.change24h || 0;
    const marketCap = marketData.marketCap || 0;
    
    // Base calculations
    const hri = calculateHRI(price, volume, asset.harmonicFrequency);
    const sss = calculateSSS(Math.abs(change) / 100, asset.harmonicFrequency);
    const hiv = calculateHIV(volume, price);
    const hrs = calculateHRS(Math.abs(change) / 100, volume);
    const iss = calculateISS(asset.harmonicFrequency, price);
    
    // NEW: T.M.P. calculation incorporating Fear & Greed Index
    const tmp = calculateTMP(tmpIndicator, price, change);
    
    return { hri, sss, hiv, hrs, iss, tmp };
  };

  // Calculate T.M.P. (Temporal Market Pulse) Indicator
  const calculateTMP = (tmpData, price, change) => {
    if (!tmpData) return 50; // Default neutral value
    
    const fearGreedValue = tmpData.fearGreedValue;
    const priceWeight = Math.log(price + 1) / 10;
    const changeWeight = Math.abs(change) / 2;
    
    // Combine Fear & Greed with asset-specific metrics
    const tmp = (fearGreedValue + priceWeight + changeWeight) / 3;
    
    return Math.min(100, Math.max(0, tmp));
  };

  // Enhanced McCrea Indicators calculations
  const calculateHRI = (price, volume, frequency) => {
    const harmonic = Math.sin((price / 100) * (frequency / 432)) * 50 + 50;
    const volumeWeight = Math.log(volume + 1) / Math.log(1000000) * 20;
    const tmpWeight = tmpIndicator ? (tmpIndicator.fearGreedValue / 100) * 10 : 5;
    return Math.min(100, Math.max(0, harmonic + volumeWeight + tmpWeight));
  };

  const calculateSSS = (volatility, frequency) => {
    const stability = (1 - volatility) * 100;
    const harmonicStability = Math.cos(frequency / 432) * 10 + 90;
    const tmpStability = tmpIndicator ? (100 - Math.abs(tmpIndicator.fearGreedValue - 50)) : 50;
    return Math.min(100, Math.max(0, (stability + harmonicStability + tmpStability) / 3));
  };

  const calculateHIV = (volume, price) => {
    const velocity = Math.log((volume + 1) / (price + 1)) / Math.log(10);
    const tmpVelocity = tmpIndicator ? Math.abs(tmpIndicator.fearGreedValue - 50) / 25 : 1;
    return Math.min(10, Math.max(0, velocity + tmpVelocity));
  };

  const calculateHRS = (volatility, volume) => {
    const risk = volatility * 100;
    const volumeRisk = Math.log(volume + 1) / Math.log(1000000) * 2;
    const tmpRisk = tmpIndicator ? Math.abs(tmpIndicator.fearGreedValue - 50) / 10 : 2.5;
    return Math.min(10, Math.max(0, risk + tmpRisk - volumeRisk));
  };

  const calculateISS = (frequency, price) => {
    const signature = Math.sin(frequency / 100) * Math.cos(price / 1000) * 50 + 50;
    const tmpSignature = tmpIndicator ? tmpIndicator.fearGreedValue : 50;
    return Math.min(100, Math.max(0, (signature + tmpSignature) / 2));
  };

  // Generate enhanced harmonic profile with T.M.P. modulation
  const generateEnhancedHarmonicProfile = (asset, marketData) => {
    const baseFreq = asset.harmonicFrequency;
    const tmpModulation = tmpIndicator ? (tmpIndicator.fearGreedValue - 50) * 2 : 0;
    const modulatedFreq = baseFreq + tmpModulation;
    
    return {
      baseFrequency: baseFreq,
      modulatedFrequency: modulatedFreq,
      tmpModulation: tmpModulation,
      harmonicSeries: generateHarmonicSeries(modulatedFreq),
      hapticPattern: generateTMPHapticPattern(asset.symbol, tmpIndicator),
      visualSignature: generateTMPVisualSignature(asset, tmpIndicator),
      audioProfile: generateTMPAudioProfile(modulatedFreq, tmpIndicator)
    };
  };

  // Generate harmonic series with T.M.P. modulation
  const generateHarmonicSeries = (baseFreq) => {
    return [
      baseFreq,           // Fundamental
      baseFreq * 2,       // Octave
      baseFreq * 3,       // Perfect fifth
      baseFreq * 4,       // Double octave
      baseFreq * 5,       // Major third
      baseFreq * 6,       // Perfect fifth + octave
      baseFreq * 7,       // Minor seventh
      baseFreq * 8        // Triple octave
    ];
  };

  // Generate T.M.P.-influenced haptic patterns
  const generateTMPHapticPattern = (symbol, tmpData) => {
    const basePatterns = {
      'XION': [720, 450, 720, 450, 1080],
      'ETH': [300, 150, 300, 150, 600],
      'BTC': [500, 250, 500, 250, 1000],
      'SOL': [400, 200, 400, 200, 800],
      'default': [400, 200, 400, 200, 600]
    };
    
    const basePattern = basePatterns[symbol] || basePatterns.default;
    
    if (!tmpData) return basePattern;
    
    // Modulate pattern based on T.M.P.
    const intensity = tmpData.fearGreedValue / 100;
    const modulated = basePattern.map(duration => {
      if (tmpData.hapticPattern === 'warning' || tmpData.hapticPattern === 'alert') {
        return Math.floor(duration * 0.7); // Faster, more urgent
      } else if (tmpData.hapticPattern === 'excited') {
        return Math.floor(duration * 1.3); // Longer, more celebratory
      }
      return duration;
    });
    
    return modulated;
  };

  // Generate T.M.P.-influenced visual signatures
  const generateTMPVisualSignature = (asset, tmpData) => {
    const baseSignatures = {
      'XION': { color: '#8B5CF6', pattern: 'flame', intensity: 0.9 },
      'ETH': { color: '#627EEA', pattern: 'diamond', intensity: 0.8 },
      'BTC': { color: '#F7931A', pattern: 'rings', intensity: 1.0 },
      'SOL': { color: '#9945FF', pattern: 'rays', intensity: 0.7 },
      'default': { color: '#6B7280', pattern: 'pulse', intensity: 0.5 }
    };
    
    const baseSignature = baseSignatures[asset.symbol] || baseSignatures.default;
    
    if (!tmpData) return baseSignature;
    
    // Blend base color with T.M.P. sentiment color
    const blendedColor = blendColors(baseSignature.color, tmpData.color, 0.3);
    const modulatedIntensity = baseSignature.intensity * (tmpData.fearGreedValue / 100);
    
    return {
      ...baseSignature,
      color: blendedColor,
      intensity: modulatedIntensity,
      tmpOverlay: tmpData.color,
      sentimentPattern: tmpData.hapticPattern
    };
  };

  // Generate T.M.P.-influenced audio profiles
  const generateTMPAudioProfile = (frequency, tmpData) => {
    if (!tmpData) {
      return {
        frequency: frequency,
        waveform: 'sine',
        envelope: 'standard',
        effects: []
      };
    }
    
    const profile = {
      frequency: frequency,
      waveform: 'sine',
      envelope: 'standard',
      effects: []
    };
    
    // Add effects based on T.M.P. sentiment
    switch (tmpData.hapticPattern) {
      case 'warning':
        profile.waveform = 'sawtooth';
        profile.effects.push('tremolo', 'lowpass');
        break;
      case 'alert':
        profile.waveform = 'square';
        profile.effects.push('distortion', 'highpass');
        break;
      case 'excited':
        profile.waveform = 'triangle';
        profile.effects.push('chorus', 'reverb');
        break;
      case 'caution':
        profile.effects.push('phaser');
        break;
      default:
        profile.effects.push('reverb');
    }
    
    return profile;
  };

  // Utility function to blend colors
  const blendColors = (color1, color2, ratio) => {
    // Simple color blending - in production, use a proper color library
    return color1; // Placeholder
  };

  // Initialize integration on mount
  useEffect(() => {
    if (discoveredAssets.length > 0) {
      initializeDataStreams();
    }
  }, [discoveredAssets, initializeDataStreams]);

  // Update enhanced assets when real-time data changes
  useEffect(() => {
    if (Object.keys(realTimeData).length > 0) {
      initializeAssetStreams();
    }
  }, [realTimeData, tmpIndicator]);

  // Complete integration when all systems are active
  useEffect(() => {
    if (integrationStatus === 'active' && enhancedAssets.length > 0) {
      onIntegrationComplete({
        enhancedAssets,
        tmpIndicator,
        globalHarmonicState,
        realTimeData,
        integrationStatus: 'complete'
      });
    }
  }, [integrationStatus, enhancedAssets, tmpIndicator, globalHarmonicState]);

  return (
    <div className="seamless-asset-integration">
      <div className="integration-header text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Seamless Asset Integration Engine
        </h2>
        <p className="text-lg text-gray-300">
          Real-time harmonization with T.M.P. (Temporal Market Pulse) integration
        </p>
      </div>

      {/* T.M.P. Indicator Display */}
      {tmpIndicator && (
        <div className="tmp-indicator mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                T.M.P. - Temporal Market Pulse
              </h3>
              <div 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: tmpIndicator.color + '20', color: tmpIndicator.color }}
              >
                {tmpIndicator.classification}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: tmpIndicator.color }}>
                  {tmpIndicator.fearGreedValue}
                </div>
                <div className="text-sm text-gray-400">Fear & Greed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {tmpIndicator.tmpFrequency.toFixed(1)} Hz
                </div>
                <div className="text-sm text-gray-400">T.M.P. Frequency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {tmpIndicator.baseFrequency.toFixed(1)} Hz
                </div>
                <div className="text-sm text-gray-400">Base Frequency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {tmpIndicator.hapticPattern}
                </div>
                <div className="text-sm text-gray-400">Haptic Pattern</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Status */}
      <div className="integration-status mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className={`w-4 h-4 rounded-full ${
            integrationStatus === 'active' ? 'bg-green-500' : 
            integrationStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
          }`}></div>
          <span className="text-white font-medium">
            Status: {integrationStatus.charAt(0).toUpperCase() + integrationStatus.slice(1)}
          </span>
        </div>
      </div>

      {/* Enhanced Assets Display */}
      {enhancedAssets.length > 0 && (
        <div className="enhanced-assets">
          <h3 className="text-xl font-semibold text-white mb-4">
            Enhanced Assets ({enhancedAssets.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enhancedAssets.map((asset, index) => (
              <div key={index} className="asset-card bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-bold text-white text-lg">{asset.symbol}</div>
                    <div className="text-sm text-gray-400">{asset.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">
                      ${asset.marketData.price?.toFixed(2) || '0.00'}
                    </div>
                    <div className={`text-sm ${
                      (asset.marketData.change24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {(asset.marketData.change24h || 0) >= 0 ? '+' : ''}
                      {(asset.marketData.change24h || 0).toFixed(2)}%
                    </div>
                  </div>
                </div>

                {/* McCrea Indicators */}
                <div className="mccrea-indicators mb-4">
                  <div className="text-sm font-medium text-gray-300 mb-2">McCrea Indicators™</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-purple-400">HRI:</span> {asset.mcCreaIndicators.hri.toFixed(1)}
                    </div>
                    <div>
                      <span className="text-blue-400">SSS:</span> {asset.mcCreaIndicators.sss.toFixed(1)}
                    </div>
                    <div>
                      <span className="text-orange-400">TMP:</span> {asset.mcCreaIndicators.tmp.toFixed(1)}
                    </div>
                    <div>
                      <span className="text-green-400">HIV:</span> {asset.mcCreaIndicators.hiv.toFixed(1)}
                    </div>
                    <div>
                      <span className="text-red-400">HRS:</span> {asset.mcCreaIndicators.hrs.toFixed(1)}
                    </div>
                    <div>
                      <span className="text-yellow-400">ISS:</span> {asset.mcCreaIndicators.iss.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Harmonic Profile */}
                <div className="harmonic-profile">
                  <div className="text-sm font-medium text-gray-300 mb-2">Harmonic Profile</div>
                  <div className="flex justify-between text-xs">
                    <div>
                      <span className="text-purple-400">♪</span> {asset.harmonicProfile.modulatedFrequency.toFixed(1)} Hz
                    </div>
                    <div>
                      <span className="text-blue-400">📳</span> {asset.harmonicProfile.hapticPattern[0]}ms
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Harmonic State */}
      {Object.keys(globalHarmonicState).length > 0 && (
        <div className="global-harmonic-state mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Global Harmonic State</h3>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {globalHarmonicState.tmpFrequency?.toFixed(1)} Hz
                </div>
                <div className="text-sm text-gray-400">Global T.M.P.</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {globalHarmonicState.baseFrequency?.toFixed(1)} Hz
                </div>
                <div className="text-sm text-gray-400">Base Frequency</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: globalHarmonicState.sentimentColor }}>
                  {marketSentiment.replace('_', ' ').toUpperCase()}
                </div>
                <div className="text-sm text-gray-400">Market Sentiment</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {enhancedAssets.length}
                </div>
                <div className="text-sm text-gray-400">Active Assets</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeamlessAssetIntegrationEngine;

