#!/usr/bin/env python3
"""
Orion Rangi Sonic Engine - Sensory Data Layer
Advanced HRI/SSS Integration with Real-Time Market Processing

W.J. McCrea - Reality Protocol LLC
Patent Pending: US2025/STYRD
"""

import asyncio
import json
import time
import math
import numpy as np
import websockets
import requests
from datetime import datetime, timezone
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass, asdict
from collections import deque
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class MarketDataPoint:
    """Structured market data with harmonic properties"""
    symbol: str
    price: float
    volume: float
    change_24h: float
    timestamp: float
    source: str
    harmonic_signature: str = ""
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

@dataclass
class HarmonicAnalysis:
    """Harmonic analysis results for market data"""
    fundamental_freq: float
    harmonic_series: List[float]
    amplitude: float
    phase: float
    quality_score: float
    timestamp: float
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

@dataclass
class ConsensusResult:
    """Proof-of-Resonance consensus result"""
    hri_value: float
    sss_value: float
    harmonic_quality: float
    consensus_timestamp: float
    participating_nodes: int
    validation_signatures: List[str]
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

class HarmonicResonanceCalculator:
    """Advanced HRI calculation with multiple market factors"""
    
    def __init__(self, base_frequency: float = 432.0):
        self.base_frequency = base_frequency
        self.harmonic_weights = {
            'price': 0.4,
            'volume': 0.25,
            'volatility': 0.2,
            'momentum': 0.15
        }
        self.price_history = deque(maxlen=100)
        self.volume_history = deque(maxlen=100)
        
    def calculate_hri(self, market_data: List[MarketDataPoint]) -> float:
        """
        Calculate Harmonic Resonance Index using advanced market analysis
        
        HRI Formula:
        HRI = Σ(Component_i × Weight_i × Harmonic_Factor_i) × Resonance_Amplification
        """
        if not market_data:
            return 0.0
            
        # Calculate individual harmonic components
        price_harmonic = self._calculate_price_harmonic(market_data)
        volume_harmonic = self._calculate_volume_harmonic(market_data)
        volatility_harmonic = self._calculate_volatility_harmonic(market_data)
        momentum_harmonic = self._calculate_momentum_harmonic(market_data)
        
        # Apply weighted combination
        weighted_hri = (
            price_harmonic * self.harmonic_weights['price'] +
            volume_harmonic * self.harmonic_weights['volume'] +
            volatility_harmonic * self.harmonic_weights['volatility'] +
            momentum_harmonic * self.harmonic_weights['momentum']
        )
        
        # Apply resonance amplification
        resonance_factor = self._calculate_resonance_amplification(market_data)
        final_hri = weighted_hri * resonance_factor
        
        # Normalize to 0-100 range
        return max(0.0, min(100.0, final_hri))
    
    def _calculate_price_harmonic(self, market_data: List[MarketDataPoint]) -> float:
        """Calculate harmonic component from price relationships"""
        if len(market_data) < 2:
            return 50.0  # Neutral value
            
        # Calculate price ratios and harmonic relationships
        total_harmonic = 0.0
        pair_count = 0
        
        for i in range(len(market_data)):
            for j in range(i + 1, len(market_data)):
                price_ratio = market_data[i].price / market_data[j].price
                
                # Convert ratio to harmonic frequency
                harmonic_freq = self.base_frequency * (price_ratio % 10)
                
                # Calculate harmonic quality (closer to perfect ratios = higher quality)
                perfect_ratios = [1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0]
                min_distance = min(abs(price_ratio - ratio) for ratio in perfect_ratios)
                harmonic_quality = 1.0 / (1.0 + min_distance)
                
                total_harmonic += harmonic_quality * 100
                pair_count += 1
        
        return total_harmonic / pair_count if pair_count > 0 else 50.0
    
    def _calculate_volume_harmonic(self, market_data: List[MarketDataPoint]) -> float:
        """Calculate harmonic component from volume patterns"""
        if not market_data:
            return 50.0
            
        # Calculate volume-based frequency modulation
        total_volume = sum(data.volume for data in market_data)
        avg_volume = total_volume / len(market_data)
        
        # Convert volume to harmonic frequency
        volume_freq = self.base_frequency * (1 + math.log10(avg_volume + 1) / 10)
        
        # Calculate volume stability (lower variation = higher harmonic quality)
        volume_values = [data.volume for data in market_data]
        volume_std = np.std(volume_values) if len(volume_values) > 1 else 0
        volume_mean = np.mean(volume_values)
        
        stability_factor = 1.0 / (1.0 + (volume_std / (volume_mean + 1)))
        
        return stability_factor * 100
    
    def _calculate_volatility_harmonic(self, market_data: List[MarketDataPoint]) -> float:
        """Calculate harmonic component from price volatility"""
        if len(market_data) < 2:
            return 50.0
            
        # Calculate price changes
        price_changes = []
        for i in range(1, len(market_data)):
            change = abs(market_data[i].price - market_data[i-1].price) / market_data[i-1].price
            price_changes.append(change)
        
        if not price_changes:
            return 50.0
            
        # Calculate volatility metrics
        avg_volatility = np.mean(price_changes)
        volatility_std = np.std(price_changes)
        
        # Convert volatility to harmonic quality (moderate volatility = optimal)
        optimal_volatility = 0.02  # 2% average change
        volatility_distance = abs(avg_volatility - optimal_volatility)
        
        # Harmonic quality decreases with distance from optimal volatility
        harmonic_quality = 1.0 / (1.0 + volatility_distance * 50)
        
        return harmonic_quality * 100
    
    def _calculate_momentum_harmonic(self, market_data: List[MarketDataPoint]) -> float:
        """Calculate harmonic component from market momentum"""
        if len(market_data) < 3:
            return 50.0
            
        # Calculate momentum using price acceleration
        momentum_values = []
        for i in range(2, len(market_data)):
            # Calculate velocity (price change rate)
            v1 = (market_data[i-1].price - market_data[i-2].price) / market_data[i-2].price
            v2 = (market_data[i].price - market_data[i-1].price) / market_data[i-1].price
            
            # Calculate acceleration (momentum)
            acceleration = v2 - v1
            momentum_values.append(acceleration)
        
        if not momentum_values:
            return 50.0
            
        # Convert momentum to harmonic frequency
        avg_momentum = np.mean(momentum_values)
        momentum_freq = self.base_frequency * (1 + avg_momentum * 100)
        
        # Calculate momentum consistency (smoother momentum = better harmony)
        momentum_std = np.std(momentum_values)
        consistency_factor = 1.0 / (1.0 + momentum_std * 1000)
        
        return consistency_factor * 100
    
    def _calculate_resonance_amplification(self, market_data: List[MarketDataPoint]) -> float:
        """Calculate resonance amplification factor based on market harmony"""
        if len(market_data) < 2:
            return 1.0
            
        # Calculate correlation between different assets
        correlations = []
        for i in range(len(market_data)):
            for j in range(i + 1, len(market_data)):
                # Calculate price change correlation
                change_i = market_data[i].change_24h
                change_j = market_data[j].change_24h
                
                # Correlation strength (similar movements = higher correlation)
                correlation = 1.0 - abs(change_i - change_j) / 100
                correlations.append(max(0.0, correlation))
        
        # Average correlation becomes resonance amplification
        avg_correlation = np.mean(correlations) if correlations else 0.5
        
        # Amplification factor ranges from 0.5 to 2.0
        return 0.5 + (avg_correlation * 1.5)

class SonicStabilityCalculator:
    """Advanced SSS calculation with spectral analysis"""
    
    def __init__(self, base_frequency: float = 432.0):
        self.base_frequency = base_frequency
        self.stability_window = 50  # Number of samples for stability analysis
        
    def calculate_sss(self, market_data: List[MarketDataPoint]) -> float:
        """
        Calculate Sonic Stability Score using spectral analysis
        
        SSS Formula:
        SSS = √(Σ((f_i - f_mean)² × A_i) / N) × Instability_Factor
        """
        if not market_data:
            return 0.0
            
        # Convert market data to frequency components
        frequency_components = self._extract_frequency_components(market_data)
        
        if not frequency_components:
            return 0.0
            
        # Calculate spectral stability
        spectral_stability = self._calculate_spectral_stability(frequency_components)
        
        # Calculate temporal stability
        temporal_stability = self._calculate_temporal_stability(market_data)
        
        # Calculate amplitude stability
        amplitude_stability = self._calculate_amplitude_stability(market_data)
        
        # Combine stability measures
        combined_stability = (
            spectral_stability * 0.5 +
            temporal_stability * 0.3 +
            amplitude_stability * 0.2
        )
        
        # Convert to instability score (0 = very stable, 100 = very unstable)
        sss_score = (1.0 - combined_stability) * 100
        
        return max(0.0, min(100.0, sss_score))
    
    def _extract_frequency_components(self, market_data: List[MarketDataPoint]) -> List[Tuple[float, float]]:
        """Extract frequency components from market data"""
        components = []
        
        for data in market_data:
            # Convert price change to frequency
            frequency = self.base_frequency * (1 + data.change_24h / 100)
            
            # Convert volume to amplitude
            amplitude = math.log10(data.volume + 1) / 10
            
            components.append((frequency, amplitude))
        
        return components
    
    def _calculate_spectral_stability(self, frequency_components: List[Tuple[float, float]]) -> float:
        """Calculate stability based on frequency spectrum analysis"""
        if len(frequency_components) < 2:
            return 1.0
            
        frequencies = [comp[0] for comp in frequency_components]
        amplitudes = [comp[1] for comp in frequency_components]
        
        # Calculate weighted mean frequency
        total_amplitude = sum(amplitudes)
        if total_amplitude == 0:
            return 1.0
            
        weighted_mean_freq = sum(f * a for f, a in frequency_components) / total_amplitude
        
        # Calculate spectral variance
        spectral_variance = sum(
            ((freq - weighted_mean_freq) ** 2) * amp 
            for freq, amp in frequency_components
        ) / total_amplitude
        
        # Convert variance to stability (lower variance = higher stability)
        stability = 1.0 / (1.0 + spectral_variance / 1000)
        
        return stability
    
    def _calculate_temporal_stability(self, market_data: List[MarketDataPoint]) -> float:
        """Calculate stability based on temporal consistency"""
        if len(market_data) < 3:
            return 1.0
            
        # Calculate time intervals between data points
        time_intervals = []
        for i in range(1, len(market_data)):
            interval = market_data[i].timestamp - market_data[i-1].timestamp
            time_intervals.append(interval)
        
        # Calculate interval consistency
        if not time_intervals:
            return 1.0
            
        mean_interval = np.mean(time_intervals)
        interval_std = np.std(time_intervals)
        
        # Stability decreases with interval inconsistency
        temporal_stability = 1.0 / (1.0 + (interval_std / (mean_interval + 1)))
        
        return temporal_stability
    
    def _calculate_amplitude_stability(self, market_data: List[MarketDataPoint]) -> float:
        """Calculate stability based on amplitude (volume) consistency"""
        if not market_data:
            return 1.0
            
        volumes = [data.volume for data in market_data]
        
        if len(volumes) < 2:
            return 1.0
            
        # Calculate volume stability
        volume_mean = np.mean(volumes)
        volume_std = np.std(volumes)
        
        # Stability decreases with volume inconsistency
        amplitude_stability = 1.0 / (1.0 + (volume_std / (volume_mean + 1)))
        
        return amplitude_stability

class MarketDataIngestionEngine:
    """Real-time market data ingestion with multiple sources"""
    
    def __init__(self):
        self.data_sources = {
            'coinbase': 'wss://ws-feed.pro.coinbase.com',
            'binance': 'wss://stream.binance.com:9443/ws',
            'kraken': 'wss://ws.kraken.com'
        }
        self.active_connections = {}
        self.data_buffer = deque(maxlen=1000)
        self.callbacks = []
        
    async def start_ingestion(self, symbols: List[str]):
        """Start real-time data ingestion for specified symbols"""
        logger.info(f"Starting market data ingestion for symbols: {symbols}")
        
        # Start connections to all data sources
        tasks = []
        for source, url in self.data_sources.items():
            task = asyncio.create_task(self._connect_to_source(source, url, symbols))
            tasks.append(task)
        
        # Wait for all connections to establish
        await asyncio.gather(*tasks, return_exceptions=True)
        
    async def _connect_to_source(self, source: str, url: str, symbols: List[str]):
        """Connect to a specific data source"""
        try:
            if source == 'coinbase':
                await self._connect_coinbase(url, symbols)
            elif source == 'binance':
                await self._connect_binance(url, symbols)
            elif source == 'kraken':
                await self._connect_kraken(url, symbols)
                
        except Exception as e:
            logger.error(f"Failed to connect to {source}: {e}")
    
    async def _connect_coinbase(self, url: str, symbols: List[str]):
        """Connect to Coinbase Pro WebSocket"""
        subscribe_message = {
            "type": "subscribe",
            "product_ids": [f"{symbol}-USD" for symbol in symbols],
            "channels": ["ticker"]
        }
        
        async with websockets.connect(url) as websocket:
            await websocket.send(json.dumps(subscribe_message))
            logger.info("Connected to Coinbase Pro WebSocket")
            
            async for message in websocket:
                try:
                    data = json.loads(message)
                    if data.get('type') == 'ticker':
                        market_data = self._parse_coinbase_data(data)
                        if market_data:
                            await self._process_market_data(market_data)
                except Exception as e:
                    logger.error(f"Error processing Coinbase data: {e}")
    
    async def _connect_binance(self, url: str, symbols: List[str]):
        """Connect to Binance WebSocket"""
        # Simplified Binance connection (would need full implementation)
        logger.info("Binance connection placeholder - would implement full WebSocket here")
        
    async def _connect_kraken(self, url: str, symbols: List[str]):
        """Connect to Kraken WebSocket"""
        # Simplified Kraken connection (would need full implementation)
        logger.info("Kraken connection placeholder - would implement full WebSocket here")
    
    def _parse_coinbase_data(self, data: Dict[str, Any]) -> Optional[MarketDataPoint]:
        """Parse Coinbase ticker data into MarketDataPoint"""
        try:
            symbol = data.get('product_id', '').replace('-USD', '')
            price = float(data.get('price', 0))
            volume = float(data.get('volume_24h', 0))
            
            # Calculate 24h change (simplified - would need historical data)
            change_24h = 0.0  # Would calculate from historical data
            
            return MarketDataPoint(
                symbol=symbol,
                price=price,
                volume=volume,
                change_24h=change_24h,
                timestamp=time.time(),
                source='coinbase'
            )
        except Exception as e:
            logger.error(f"Error parsing Coinbase data: {e}")
            return None
    
    async def _process_market_data(self, market_data: MarketDataPoint):
        """Process incoming market data"""
        # Add to buffer
        self.data_buffer.append(market_data)
        
        # Notify all callbacks
        for callback in self.callbacks:
            try:
                await callback(market_data)
            except Exception as e:
                logger.error(f"Error in market data callback: {e}")
    
    def add_callback(self, callback):
        """Add callback for market data updates"""
        self.callbacks.append(callback)
    
    def get_recent_data(self, symbol: str = None, limit: int = 100) -> List[MarketDataPoint]:
        """Get recent market data from buffer"""
        if symbol:
            return [data for data in list(self.data_buffer)[-limit:] if data.symbol == symbol]
        return list(self.data_buffer)[-limit:]

class SensoryDataLayer:
    """Main sensory data layer orchestrating all components"""
    
    def __init__(self, base_frequency: float = 432.0):
        self.base_frequency = base_frequency
        self.hri_calculator = HarmonicResonanceCalculator(base_frequency)
        self.sss_calculator = SonicStabilityCalculator(base_frequency)
        self.ingestion_engine = MarketDataIngestionEngine()
        
        # Consensus state
        self.current_hri = 0.0
        self.current_sss = 0.0
        self.consensus_history = deque(maxlen=1000)
        
        # Callbacks for external systems
        self.consensus_callbacks = []
        
        # Setup market data callback
        self.ingestion_engine.add_callback(self._on_market_data_update)
        
    async def initialize(self, symbols: List[str] = None):
        """Initialize the sensory data layer"""
        if symbols is None:
            symbols = ['BTC', 'ETH', 'SOL', 'ADA']
            
        logger.info("Initializing Orion Rangi Sensory Data Layer")
        
        # Start market data ingestion
        await self.ingestion_engine.start_ingestion(symbols)
        
        logger.info("Sensory Data Layer initialized successfully")
    
    async def _on_market_data_update(self, market_data: MarketDataPoint):
        """Handle market data updates and trigger consensus calculations"""
        try:
            # Get recent market data for analysis
            recent_data = self.ingestion_engine.get_recent_data(limit=50)
            
            if len(recent_data) >= 2:
                # Calculate HRI and SSS
                hri = self.hri_calculator.calculate_hri(recent_data)
                sss = self.sss_calculator.calculate_sss(recent_data)
                
                # Update current values
                self.current_hri = hri
                self.current_sss = sss
                
                # Create consensus result
                consensus_result = ConsensusResult(
                    hri_value=hri,
                    sss_value=sss,
                    harmonic_quality=self._calculate_harmonic_quality(hri, sss),
                    consensus_timestamp=time.time(),
                    participating_nodes=1,  # Single node for Genesis Prototype
                    validation_signatures=[self._generate_validation_signature(hri, sss)]
                )
                
                # Add to history
                self.consensus_history.append(consensus_result)
                
                # Notify callbacks
                await self._notify_consensus_callbacks(consensus_result)
                
                logger.info(f"Consensus Update: HRI={hri:.2f}, SSS={sss:.2f}, Quality={consensus_result.harmonic_quality:.2f}")
                
        except Exception as e:
            logger.error(f"Error processing market data update: {e}")
    
    def _calculate_harmonic_quality(self, hri: float, sss: float) -> float:
        """Calculate overall harmonic quality score"""
        # Higher HRI and lower SSS indicate better harmonic quality
        hri_quality = hri / 100.0
        sss_quality = (100.0 - sss) / 100.0
        
        return (hri_quality + sss_quality) / 2.0 * 100.0
    
    def _generate_validation_signature(self, hri: float, sss: float) -> str:
        """Generate validation signature for consensus result"""
        # Simplified signature generation (would use proper cryptography in production)
        signature_data = f"{hri:.6f}_{sss:.6f}_{self.base_frequency}_{time.time()}"
        return str(hash(signature_data))
    
    async def _notify_consensus_callbacks(self, consensus_result: ConsensusResult):
        """Notify all consensus callbacks"""
        for callback in self.consensus_callbacks:
            try:
                await callback(consensus_result)
            except Exception as e:
                logger.error(f"Error in consensus callback: {e}")
    
    def add_consensus_callback(self, callback):
        """Add callback for consensus updates"""
        self.consensus_callbacks.append(callback)
    
    def get_current_consensus(self) -> Dict[str, Any]:
        """Get current consensus state"""
        return {
            'hri_value': self.current_hri,
            'sss_value': self.current_sss,
            'harmonic_quality': self._calculate_harmonic_quality(self.current_hri, self.current_sss),
            'timestamp': time.time(),
            'base_frequency': self.base_frequency
        }
    
    def get_consensus_history(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get consensus history"""
        return [result.to_dict() for result in list(self.consensus_history)[-limit:]]
    
    def get_market_data_summary(self) -> Dict[str, Any]:
        """Get summary of current market data"""
        recent_data = self.ingestion_engine.get_recent_data(limit=10)
        
        if not recent_data:
            return {'status': 'no_data'}
        
        # Calculate summary statistics
        symbols = list(set(data.symbol for data in recent_data))
        summary = {
            'symbols': symbols,
            'data_points': len(recent_data),
            'latest_timestamp': max(data.timestamp for data in recent_data),
            'assets': {}
        }
        
        for symbol in symbols:
            symbol_data = [data for data in recent_data if data.symbol == symbol]
            if symbol_data:
                latest = symbol_data[-1]
                summary['assets'][symbol] = {
                    'price': latest.price,
                    'volume': latest.volume,
                    'change_24h': latest.change_24h,
                    'source': latest.source
                }
        
        return summary

# Example usage and testing
async def main():
    """Example usage of the Sensory Data Layer"""
    # Create sensory data layer
    sensory_layer = SensoryDataLayer(base_frequency=432.0)
    
    # Add consensus callback for monitoring
    async def consensus_monitor(consensus_result: ConsensusResult):
        print(f"🎵 Consensus: HRI={consensus_result.hri_value:.2f}, SSS={consensus_result.sss_value:.2f}")
    
    sensory_layer.add_consensus_callback(consensus_monitor)
    
    # Initialize with default symbols
    await sensory_layer.initialize(['BTC', 'ETH'])
    
    # Run for demonstration
    print("🚀 Orion Rangi Sensory Data Layer Running...")
    print("📊 Monitoring market data and calculating consensus...")
    
    try:
        # Keep running for demonstration
        await asyncio.sleep(60)  # Run for 1 minute
    except KeyboardInterrupt:
        print("⏹️ Shutting down sensory data layer...")

if __name__ == "__main__":
    asyncio.run(main())

