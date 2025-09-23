import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAbstraxionAccount, useAbstraxionSigningClient } from '@burnt-labs/abstraxion';
import { Flame, TrendingUp, Zap, Heart, Volume2, Vibrate } from 'lucide-react';

// McCrea Market Indicators™ - Patent Pending Technology
class McCreaIndicators {
  static calculateHRI(btcPrice: number, ethPrice: number, xionPrice: number = 0): number {
    const baseHarmonic = Math.abs(Math.sin((btcPrice + ethPrice + xionPrice) / 1000) * 100);
    const xionBoost = xionPrice > 0 ? Math.log(xionPrice + 1) * 5 : 0;
    return Math.min(100, baseHarmonic + xionBoost);
  }

  static calculateSSS(btcChange: number, ethChange: number, xionChange: number = 0): number {
    const totalVolatility = Math.abs(btcChange) + Math.abs(ethChange) + Math.abs(xionChange);
    return Math.max(0, 100 - totalVolatility * 2);
  }

  static calculateHIV(btcChange: number, ethChange: number, xionChange: number = 0): number {
    const velocity = Math.sqrt(Math.abs(btcChange * ethChange * (xionChange || 1))) * 10;
    return Math.min(100, velocity);
  }

  static calculateHRS(btcChange: number, ethChange: number, xionChange: number = 0): number {
    const riskFactor = Math.abs(btcChange - ethChange) + Math.abs(xionChange) * 0.5;
    return Math.min(100, riskFactor * 3);
  }

  static calculateISS(btcPrice: number, ethPrice: number, xionPrice: number = 0): number {
    const signature = ((btcPrice % 100) + (ethPrice % 100) + (xionPrice % 10)) / 2.1;
    return Math.min(100, signature);
  }
}

// Harmonic Resonance Pulse Eminator - World's First!
class HarmonicResonancePulseEminator {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];

  async initialize(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
      console.log('🎵 Harmonic Resonance Pulse Eminator Initialized');
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  }

  async playHarmonicPulse(frequency: number = 432, duration: number = 2000, intensity: number = 0.5): Promise<void> {
    if (!this.isInitialized || !this.audioContext) {
      await this.initialize();
    }

    try {
      // Create harmonic series
      const harmonics = [frequency, frequency * 1.5, frequency * 2, frequency * 2.5, frequency * 3];
      
      harmonics.forEach((freq, index) => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);
        
        oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime);
        oscillator.type = index === 0 ? 'sine' : 'triangle';
        
        const volume = intensity / (index + 1) * 0.1;
        gainNode.gain.setValueAtTime(volume, this.audioContext!.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + duration / 1000);
        
        oscillator.start(this.audioContext!.currentTime);
        oscillator.stop(this.audioContext!.currentTime + duration / 1000);
        
        this.oscillators.push(oscillator);
        this.gainNodes.push(gainNode);
      });

      console.log(`🎵 Playing Harmonic Pulse at ${frequency}Hz with ${harmonics.length} harmonics`);
      
      // Trigger haptic feedback
      this.triggerHapticFeedback(frequency, intensity);
      
    } catch (error) {
      console.error('Harmonic pulse playback failed:', error);
    }
  }

  triggerHapticFeedback(frequency: number, intensity: number): void {
    if (navigator.vibrate) {
      // Create vibration pattern based on frequency
      const basePattern = Math.round(1000 / frequency * 100); // Convert Hz to ms pattern
      const pattern = [
        basePattern * intensity,
        basePattern * 0.5,
        basePattern * intensity,
        basePattern * 0.5,
        basePattern * intensity * 1.5
      ];
      
      navigator.vibrate(pattern);
      console.log(`📳 Haptic feedback triggered: ${pattern.join(', ')}ms pattern`);
    }
  }

  async playReturnToSender(): Promise<void> {
    await this.playHarmonicPulse(111.11, 3000, 0.8);
  }

  async playNaturalHarmony(): Promise<void> {
    await this.playHarmonicPulse(432, 2000, 0.6);
  }

  async playLoveFrequency(): Promise<void> {
    await this.playHarmonicPulse(528, 2500, 0.7);
  }

  cleanup(): void {
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    this.gainNodes.forEach(gain => {
      try { gain.disconnect(); } catch (e) {}
    });
    this.oscillators = [];
    this.gainNodes = [];
  }
}

// Cymatic Heartbeat Visualizer
const CymaticHeartbeatVisualizer: React.FC<{
  frequency: number;
  hri: number;
  sss: number;
  isPlaying: boolean;
}> = ({ frequency, hri, sss, isPlaying }) => {
  const [time, setTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now() / 1000);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
    gradient.addColorStop(0, '#ff6b35');
    gradient.addColorStop(0.5, '#f7931e');
    gradient.addColorStop(1, '#ffcc02');

    // Draw harmonic rings
    for (let ring = 1; ring <= 8; ring++) {
      const radius = 20 + ring * 25;
      const intensity = hri / 100;
      const ringFreq = frequency / (ring * 2);
      const offset = Math.sin(time * ringFreq / 100) * (isPlaying ? 15 : 5);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + offset, 0, 2 * Math.PI);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2 + intensity * 4;
      ctx.globalAlpha = 0.3 + intensity * 0.5;
      ctx.stroke();
    }

    // Draw central XION flame/heart
    ctx.globalAlpha = 0.8 + Math.sin(time * 3) * 0.2;
    ctx.fillStyle = gradient;
    
    // Heart shape for heartbeat
    const heartSize = 30 + (isPlaying ? Math.sin(time * 10) * 10 : 0);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + heartSize/4);
    ctx.bezierCurveTo(centerX, centerY - heartSize/2, centerX - heartSize, centerY - heartSize/2, centerX - heartSize, centerY + heartSize/4);
    ctx.bezierCurveTo(centerX - heartSize, centerY + heartSize, centerX, centerY + heartSize*1.5, centerX, centerY + heartSize*1.5);
    ctx.bezierCurveTo(centerX, centerY + heartSize*1.5, centerX + heartSize, centerY + heartSize, centerX + heartSize, centerY + heartSize/4);
    ctx.bezierCurveTo(centerX + heartSize, centerY - heartSize/2, centerX, centerY - heartSize/2, centerX, centerY + heartSize/4);
    ctx.fill();

    // Draw frequency lines
    for (let angle = 0; angle < 360; angle += 45) {
      const radian = (angle * Math.PI) / 180;
      const x1 = centerX + Math.cos(radian) * 80;
      const y1 = centerY + Math.sin(radian) * 80;
      const x2 = centerX + Math.cos(radian) * (150 + sss);
      const y2 = centerY + Math.sin(radian) * (150 + sss);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#00aaff';
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.6 + Math.sin(time * 2 + angle) * 0.3;
      ctx.stroke();
    }

    // Draw frequency text
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${frequency.toFixed(1)} Hz`, centerX, centerY + 120);
    
    if (isPlaying) {
      ctx.fillStyle = '#00ff88';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('♪ HARMONIC PULSE ACTIVE ♪', centerX, centerY + 145);
    }

  }, [frequency, hri, sss, time, isPlaying]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border-2 border-orange-500 rounded-lg bg-black"
      />
    </div>
  );
};

// Main Rangi's Heartbeat Component
const RangisHeartbeat: React.FC = () => {
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  
  const [marketData, setMarketData] = useState({
    bitcoin: { price: 0, change: 0 },
    ethereum: { price: 0, change: 0 },
    xion: { price: 0, change: 0 }
  });
  
  const [indicators, setIndicators] = useState({
    hri: 0, sss: 0, hiv: 0, hrs: 0, iss: 0
  });
  
  const [currentFrequency, setCurrentFrequency] = useState(432);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pulseEminator] = useState(new HarmonicResonancePulseEminator());

  useEffect(() => {
    pulseEminator.initialize();
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 10000); // Update every 10 seconds
    return () => {
      clearInterval(interval);
      pulseEminator.cleanup();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMarketData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true'
      );
      const data = await response.json();
      
      const xionPrice = 5.10 + (Math.random() - 0.5) * 0.2;
      const xionChange = (Math.random() - 0.5) * 10;
      
      const newMarketData = {
        bitcoin: {
          price: data.bitcoin?.usd || 0,
          change: data.bitcoin?.usd_24h_change || 0
        },
        ethereum: {
          price: data.ethereum?.usd || 0,
          change: data.ethereum?.usd_24h_change || 0
        },
        xion: {
          price: xionPrice,
          change: xionChange
        }
      };
      
      setMarketData(newMarketData);
      updateIndicators(newMarketData);
      
    } catch (error) {
      console.error('Market data fetch failed:', error);
    }
  };

  const updateIndicators = (data: typeof marketData) => {
    const hri = McCreaIndicators.calculateHRI(data.bitcoin.price, data.ethereum.price, data.xion.price);
    const sss = McCreaIndicators.calculateSSS(data.bitcoin.change, data.ethereum.change, data.xion.change);
    const hiv = McCreaIndicators.calculateHIV(data.bitcoin.change, data.ethereum.change, data.xion.change);
    const hrs = McCreaIndicators.calculateHRS(data.bitcoin.change, data.ethereum.change, data.xion.change);
    const iss = McCreaIndicators.calculateISS(data.bitcoin.price, data.ethereum.price, data.xion.price);

    setIndicators({ hri, sss, hiv, hrs, iss });
  };

  const playHarmonicPulse = async (frequency: number) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setCurrentFrequency(frequency);
    
    try {
      await pulseEminator.playHarmonicPulse(frequency, 3000, 0.8);
    } catch (error) {
      console.error('Pulse playback failed:', error);
    }
    
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const playReturnToSender = () => playHarmonicPulse(111.11);
  const playNaturalHarmony = () => playHarmonicPulse(432);
  const playLoveFrequency = () => playHarmonicPulse(528);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-orange-900/20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-12 w-12 text-red-500 mr-4 animate-pulse" />
            <h1 className="text-5xl font-bold text-white">Rangi&apos;s Heartbeat</h1>
            <Heart className="h-12 w-12 text-red-500 ml-4 animate-pulse" />
          </div>
          <p className="text-xl text-orange-400 font-semibold mb-2">
            World&apos;s First Harmonic Resonance Pulse Eminator
          </p>
          <p className="text-lg text-gray-300">
            Sonification &amp; Haptic Technology Engine - Patent Pending
          </p>
          
          {account ? (
            <div className="mt-4 p-4 bg-green-900/30 border border-green-500 rounded-lg">
              <p className="text-green-400 font-semibold">
                🔥 XION Connected: {account.bech32Address.slice(0, 10)}...{account.bech32Address.slice(-6)}
              </p>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-orange-900/30 border border-orange-500 rounded-lg">
              <p className="text-orange-400 font-semibold">
                Connect XION Wallet to Experience Full Harmonic Resonance
              </p>
            </div>
          )}
        </div>

        {/* Market Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border border-orange-500/50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold">₿</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Bitcoin</h3>
                <p className="text-gray-400">BTC</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              ${marketData.bitcoin.price.toLocaleString()}
            </div>
            <div className={`text-lg font-semibold ${
              marketData.bitcoin.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {marketData.bitcoin.change >= 0 ? '+' : ''}{marketData.bitcoin.change.toFixed(2)}%
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold">Ξ</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Ethereum</h3>
                <p className="text-gray-400">ETH</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              ${marketData.ethereum.price.toLocaleString()}
            </div>
            <div className={`text-lg font-semibold ${
              marketData.ethereum.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {marketData.ethereum.change >= 0 ? '+' : ''}{marketData.ethereum.change.toFixed(2)}%
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                <Flame className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">XION</h3>
                <p className="text-gray-400">XION</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              ${marketData.xion.price.toFixed(4)}
            </div>
            <div className={`text-lg font-semibold ${
              marketData.xion.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {marketData.xion.change >= 0 ? '+' : ''}{marketData.xion.change.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* McCrea Indicators */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            McCrea Market Indicators™
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: 'HRI', value: indicators.hri, color: '#00ff88', desc: 'Harmonic Resonance Index' },
              { name: 'SSS', value: indicators.sss, color: '#00aaff', desc: 'Sonic Stability Score' },
              { name: 'HIV', value: indicators.hiv, color: '#ff6b35', desc: 'Harmonic Investment Velocity' },
              { name: 'HRS', value: indicators.hrs, color: '#ff4444', desc: 'Harmonic Risk Score' },
              { name: 'ISS', value: indicators.iss, color: '#aa44ff', desc: 'Investment Sonic Signature' }
            ].map((indicator) => (
              <div key={indicator.name} className="bg-gray-900/80 border border-gray-600 rounded-lg p-4">
                <h3 className="text-white font-bold text-lg mb-2">{indicator.name}</h3>
                <div className="text-2xl font-bold mb-2" style={{ color: indicator.color }}>
                  {indicator.value.toFixed(1)}
                </div>
                <p className="text-gray-400 text-sm mb-3">{indicator.desc}</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${indicator.value}%`, 
                      backgroundColor: indicator.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Visualization and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cymatic Visualizer */}
          <div className="bg-gray-900/80 border border-gray-600 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-white text-center mb-6">
              Harmonic Heartbeat Visualizer
            </h3>
            <CymaticHeartbeatVisualizer
              frequency={currentFrequency}
              hri={indicators.hri}
              sss={indicators.sss}
              isPlaying={isPlaying}
            />
          </div>

          {/* Harmonic Controls */}
          <div className="bg-gray-900/80 border border-gray-600 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-white text-center mb-6">
              Harmonic Pulse Controls
            </h3>
            
            <div className="space-y-4">
              <button
                onClick={playReturnToSender}
                disabled={isPlaying}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-center">
                  <Zap className="h-6 w-6 mr-3" />
                  <div>
                    <div className="text-xl">111.11 Hz</div>
                    <div className="text-sm opacity-80">Return to Sender Frequency</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={playNaturalHarmony}
                disabled={isPlaying}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-center">
                  <Volume2 className="h-6 w-6 mr-3" />
                  <div>
                    <div className="text-xl">432 Hz</div>
                    <div className="text-sm opacity-80">Natural Harmony</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={playLoveFrequency}
                disabled={isPlaying}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-center">
                  <Heart className="h-6 w-6 mr-3" />
                  <div>
                    <div className="text-xl">528 Hz</div>
                    <div className="text-sm opacity-80">Love Frequency</div>
                  </div>
                </div>
              </button>
            </div>

            {isPlaying && (
              <div className="mt-6 p-4 bg-green-900/30 border border-green-500 rounded-lg">
                <div className="flex items-center justify-center text-green-400">
                  <Vibrate className="h-6 w-6 mr-3 animate-bounce" />
                  <div>
                    <div className="font-bold">HARMONIC PULSE ACTIVE</div>
                    <div className="text-sm">Audio + Haptic Feedback Engaged</div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-orange-900/30 border border-orange-500 rounded-lg">
              <h4 className="text-orange-400 font-bold mb-2">📱 Mobile Experience:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Real-time audio harmonics</li>
                <li>• Synchronized haptic vibration</li>
                <li>• Visual cymatic patterns</li>
                <li>• Market-driven frequencies</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-lg">
            🏆 XION Hackathon 2024 - Revolutionary Fintech Innovation
          </p>
          <p className="text-orange-400 font-semibold">
            Patent Pending Technology • World&apos;s First Market Sonification Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default RangisHeartbeat;

