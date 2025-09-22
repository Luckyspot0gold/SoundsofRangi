// XION Dave Mobile Onboarding Integration for Rangi's Worldwide
// This component provides seamless wallet onboarding using the XION Dave kit

import React, { useState, useEffect } from 'react';
import { AbstraxionProvider, useAbstraxionAccount, useAbstraxionSigningClient } from '@burnt-labs/abstraxion';

// XION Dave Mobile Onboarding Component
export const XionDaveMobileOnboarding = ({ onOnboardingComplete }) => {
  const [onboardingStep, setOnboardingStep] = useState('welcome');
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();

  // Seamless onboarding flow
  const handleSeamlessOnboarding = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Initialize XION connection
      if (!account) {
        setOnboardingStep('connecting');
        // The Abstraxion provider will handle the connection
        return;
      }

      // Step 2: Create user profile
      setOnboardingStep('profile-creation');
      const profile = await createUserProfile(account);
      setUserProfile(profile);

      // Step 3: Discover existing assets
      setOnboardingStep('asset-discovery');
      const assets = await discoverUserAssets(account.bech32Address);
      
      // Step 4: Initialize harmonization
      setOnboardingStep('harmonization');
      await initializeAssetHarmonization(assets);

      // Step 5: Complete onboarding
      setOnboardingStep('complete');
      onOnboardingComplete({
        account,
        profile,
        assets,
        harmonicSignatures: await generateHarmonicSignatures(assets)
      });

    } catch (err) {
      setError(err.message);
      setOnboardingStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Create user profile with XION integration
  const createUserProfile = async (account) => {
    const profile = {
      id: account.bech32Address,
      address: account.bech32Address,
      network: 'xion',
      onboardedAt: new Date().toISOString(),
      preferences: {
        audioEnabled: true,
        hapticEnabled: true,
        visualEnabled: true,
        baseFrequency: 432, // Hz
        harmonicMode: 'auto'
      }
    };

    // Store profile in local storage for now
    localStorage.setItem('rangi-user-profile', JSON.stringify(profile));
    return profile;
  };

  // Discover user's existing assets across networks
  const discoverUserAssets = async (address) => {
    const assets = [];

    try {
      // XION native assets
      if (client) {
        const balance = await client.getBalance(address, 'uxion');
        if (balance.amount > 0) {
          assets.push({
            symbol: 'XION',
            balance: balance.amount,
            network: 'xion',
            type: 'native'
          });
        }
      }

      // Add placeholder for other discovered assets
      // In production, this would integrate with multiple blockchain APIs
      assets.push(
        { symbol: 'BTC', balance: 0, network: 'bitcoin', type: 'external' },
        { symbol: 'ETH', balance: 0, network: 'ethereum', type: 'external' }
      );

    } catch (err) {
      console.warn('Asset discovery error:', err);
    }

    return assets;
  };

  // Initialize asset harmonization with McCrea Market Indicators
  const initializeAssetHarmonization = async (assets) => {
    const harmonicProfiles = {};

    for (const asset of assets) {
      harmonicProfiles[asset.symbol] = {
        baseFrequency: calculateBaseFrequency(asset.symbol),
        harmonicSeries: generateHarmonicSeries(asset.symbol),
        hapticPattern: generateHapticPattern(asset.symbol),
        visualSignature: generateVisualSignature(asset.symbol)
      };
    }

    localStorage.setItem('rangi-harmonic-profiles', JSON.stringify(harmonicProfiles));
    return harmonicProfiles;
  };

  // Calculate base frequency for each asset
  const calculateBaseFrequency = (symbol) => {
    const frequencies = {
      'XION': 111.11, // Return to Sender frequency
      'BTC': 432.0,   // Natural harmony
      'ETH': 528.0,   // Love frequency
      'default': 432.0
    };
    return frequencies[symbol] || frequencies.default;
  };

  // Generate harmonic series for asset
  const generateHarmonicSeries = (symbol) => {
    const baseFreq = calculateBaseFrequency(symbol);
    return [
      baseFreq,
      baseFreq * 2,
      baseFreq * 3,
      baseFreq * 4,
      baseFreq * 5
    ];
  };

  // Generate haptic pattern for asset
  const generateHapticPattern = (symbol) => {
    const patterns = {
      'XION': [720, 450, 720, 450, 1080],
      'BTC': [500, 200, 500, 200, 800],
      'ETH': [300, 150, 300, 150, 600],
      'default': [400, 200, 400, 200, 600]
    };
    return patterns[symbol] || patterns.default;
  };

  // Generate visual signature for asset
  const generateVisualSignature = (symbol) => {
    const signatures = {
      'XION': { color: '#8B5CF6', pattern: 'flame', intensity: 0.8 },
      'BTC': { color: '#F59E0B', pattern: 'rings', intensity: 0.9 },
      'ETH': { color: '#3B82F6', pattern: 'waves', intensity: 0.7 },
      'default': { color: '#6B7280', pattern: 'pulse', intensity: 0.5 }
    };
    return signatures[symbol] || signatures.default;
  };

  // Generate harmonic signatures for all assets
  const generateHarmonicSignatures = async (assets) => {
    const signatures = {};
    
    for (const asset of assets) {
      signatures[asset.symbol] = {
        hri: calculateHRI(asset),
        sss: calculateSSS(asset),
        hiv: calculateHIV(asset),
        hrs: calculateHRS(asset),
        iss: calculateISS(asset)
      };
    }

    return signatures;
  };

  // McCrea Market Indicators calculations
  const calculateHRI = (asset) => Math.random() * 100; // Placeholder
  const calculateSSS = (asset) => Math.random() * 100; // Placeholder
  const calculateHIV = (asset) => Math.random() * 10;  // Placeholder
  const calculateHRS = (asset) => Math.random() * 10;  // Placeholder
  const calculateISS = (asset) => Math.random() * 100; // Placeholder

  // Render onboarding UI based on current step
  const renderOnboardingStep = () => {
    switch (onboardingStep) {
      case 'welcome':
        return (
          <div className="onboarding-welcome">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome to Rangi's Worldwide 🎵
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                Experience your investments through sound, vibration, and visual harmony
              </p>
              <button
                onClick={handleSeamlessOnboarding}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Connecting...' : 'Begin Your Journey'}
              </button>
            </div>
          </div>
        );

      case 'connecting':
        return (
          <div className="onboarding-connecting text-center">
            <div className="animate-pulse mb-6">
              <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Connecting to XION</h2>
            <p className="text-gray-300">
              Establishing secure connection to your XION wallet...
            </p>
          </div>
        );

      case 'profile-creation':
        return (
          <div className="onboarding-profile text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Creating Your Profile</h2>
            <p className="text-gray-300 mb-6">
              Setting up your personalized harmonic experience...
            </p>
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        );

      case 'asset-discovery':
        return (
          <div className="onboarding-discovery text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Discovering Your Assets</h2>
            <p className="text-gray-300 mb-6">
              Scanning your wallets for harmonizable assets...
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {['XION', 'BTC', 'ETH'].map((symbol, index) => (
                <div key={symbol} className="bg-gray-800 rounded-lg p-4">
                  <div className="text-lg font-bold text-white">{symbol}</div>
                  <div className="text-sm text-gray-400">Scanning...</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'harmonization':
        return (
          <div className="onboarding-harmonization text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Initializing Harmonization</h2>
            <p className="text-gray-300 mb-6">
              Creating your unique sonic signatures...
            </p>
            <div className="space-y-3 max-w-md mx-auto">
              {['Audio Frequencies', 'Haptic Patterns', 'Visual Signatures'].map((item, index) => (
                <div key={item} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                  <span className="text-white">{item}</span>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="onboarding-complete text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to the Future of Finance!</h2>
            <p className="text-xl text-gray-300 mb-6">
              Your harmonic financial experience is ready. Feel the heartbeat of your investments.
            </p>
            <button
              onClick={() => onOnboardingComplete(userProfile)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              Enter Rangi's Worldwide
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="onboarding-error text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Connection Error</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setOnboardingStep('welcome');
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {renderOnboardingStep()}
      </div>
    </div>
  );
};

// Main integration wrapper with Abstraxion provider
export const RangisWorldwideOnboarding = ({ onComplete }) => {
  return (
    <AbstraxionProvider
      config={{
        contracts: [
          {
            address: "xion1zffrm2netuh3u8hzc664kv32a8huen36zmqa0kvtp3nczcvk9yxsgtu9fd",
            amounts: [{ denom: "uxion", amount: "1000000" }]
          }
        ]
      }}
    >
      <XionDaveMobileOnboarding onOnboardingComplete={onComplete} />
    </AbstraxionProvider>
  );
};

export default RangisWorldwideOnboarding;
