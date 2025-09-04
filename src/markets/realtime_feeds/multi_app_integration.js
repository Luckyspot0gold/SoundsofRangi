// src/markets/real-time-feeds/multi-api-integration.js
export class MultiAPIMarketData {
    constructor() {
        this.apis = {
            alphaVantage: {
                key: process.env.ALPHA_VANTAGE_KEY,
                baseURL: 'https://www.alphavantage.co/query',
                endpoints: {
                    realtime: 'GLOBAL_QUOTE',
                    historical: 'TIME_SERIES_DAILY',
                    indicators: 'RSI'
                }
            },
            polygon: {
                key: process.env.POLYGON_KEY,
                baseURL: 'https://api.polygon.io/v2',
                endpoints: {
                    realtime: 'aggs/ticker',
                    websocket: 'wss://socket.polygon.io/stocks'
                }
            },
            twelveData: {
                key: process.env.TWELVE_DATA_KEY,
                baseURL: 'https://api.twelvedata.com',
                endpoints: {
                    realtime: 'price',
                    historical: 'time_series'
                }
            }
        };
        
        this.websocketConnections = new Map();
        this.marketData = new Map();
    }

    async initialize() {
        // Initialize all API connections
        await this.setupAlphaVantage();
        await this.setupPolygonWebSocket();
        await this.setupTwelveData();
        
        console.log("All market data APIs initialized");
    }

    async setupAlphaVantage() {
        // Set up Alpha Vantage for technical indicators and historical data
        const { key, baseURL, endpoints } = this.apis.alphaVantage;
        
        // Fetch initial data for selected symbols
        const symbols = ['BTC', 'ETH', 'SPY', 'QQQ', 'GLD'];
        
        for (const symbol of symbols) {
            try {
                // Get RSI indicator
                const rsiURL = `${baseURL}?function=${endpoints.indicators}&symbol=${symbol}&interval=60min&time_period=14&series_type=close&apikey=${key}`;
                const rsiResponse = await fetch(rsiURL);
                const rsiData = await rsiResponse.json();
                
                // Store processed data
                this.marketData.set(`${symbol}_RSI`, this.processRSIData(rsiData));
            } catch (error) {
                console.error(`Alpha Vantage error for ${symbol}:`, error);
            }
        }
    }

    async setupPolygonWebSocket() {
        // Set up Polygon.io WebSocket for real-time data
        const { key } = this.apis.polygon;
        const ws = new WebSocket(`wss://socket.polygon.io/stocks`);
        
        ws.onopen = () => {
            ws.send(JSON.stringify({
                action: "auth",
                params: key
            }));
            
            // Subscribe to major symbols
            const symbols = ['C:BTCUSD', 'C:ETHUSD', 'SPY', 'QQQ', 'GLD'];
            ws.send(JSON.stringify({
                action: "subscribe",
                params: symbols.map(s => `T.${s}`)
            }));
        };
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.processRealTimeData(data);
        };
        
        this.websocketConnections.set('polygon', ws);
    }

    async setupTwelveData() {
        // Set up Twelve Data for additional market coverage
        const { key, baseURL, endpoints } = this.apis.twelveData;
        
        // Fetch cryptocurrency data
        const cryptoPairs = ['BTC/USD', 'ETH/USD', 'SOL/USD'];
        
        for (const pair of cryptoPairs) {
            try {
                const url = `${baseURL}/${endpoints.realtime}?symbol=${pair}&apikey=${key}`;
                const response = await fetch(url);
                const data = await response.json();
                
                this.marketData.set(pair.replace('/', '_'), {
                    price: parseFloat(data.price),
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error(`Twelve Data error for ${pair}:`, error);
            }
        }
    }

    processRealTimeData(data) {
        // Process real-time WebSocket data
        data.forEach(tick => {
            const symbol = tick.s;
            const price = tick.p;
            const volume = tick.v;
            const timestamp = new Date(tick.t).toISOString();
            
            // Calculate harmonic frequencies based on price movements
            const frequencies = this.calculateHarmonicFrequencies(price, volume);
            
            // Store data with harmonic analysis
            this.marketData.set(symbol, {
                price,
                volume,
                timestamp,
                frequencies,
                harmonics: this.generateHarmonics(frequencies)
            });
            
            // Emit event for visualization updates
            this.emitMarketUpdate(symbol, this.marketData.get(symbol));
        });
    }

    calculateHarmonicFrequencies(price, volume) {
        // Convert market data to harmonic frequencies
        const baseFrequency = 432; // Earth's fundamental frequency
        
        // Price influences base frequency
        const priceFactor = price / 1000; // Normalize for typical price ranges
        const volumeFactor = Math.log10(volume) / 10; // Logarithmic scale for volume
        
        return {
            fundamental: baseFrequency * (1 + priceFactor * 0.1),
            volumeHarmonic: baseFrequency * (1 + volumeFactor * 0.05),
            marketHarmonic: baseFrequency * (1 + (priceFactor + volumeFactor) * 0.08),
            timestamp: new Date().toISOString()
        };
    }

    generateHarmonics(baseFrequencies) {
        // Generate harmonic series from base frequencies
        const harmonics = {};
        const harmonicCount = 8; // Generate 8 harmonics
        
        for (const [name, baseFreq] of Object.entries(baseFrequencies)) {
            if (typeof baseFreq === 'number') {
                harmonics[name] = [];
                for (let i = 1; i <= harmonicCount; i++) {
                    harmonics[name].push(baseFreq * i);
                }
            }
        }
        
        return harmonics;
    }

    emitMarketUpdate(symbol, data) {
        // Create custom event for market updates
        const event = new CustomEvent('marketUpdate', {
            detail: { symbol, data }
        });
        
        window.dispatchEvent(event);
    }

    getMarketData(symbol) {
        return this.marketData.get(symbol);
    }

    getAllMarketData() {
        return Object.fromEntries(this.marketData);
    }
}
