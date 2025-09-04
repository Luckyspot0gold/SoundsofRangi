// src/visualization/color-spectrum-utils.js
export class ColorSpectrumUtils {
    constructor() {
        this.colorModes = {
            'visible-light': this.visibleLightSpectrum.bind(this),
            'harmonic-relationship': this.harmonicColorSpectrum.bind(this),
            'market-sentiment': this.sentimentColorSpectrum.bind(this),
            'frequency-energy': this.energyColorSpectrum.bind(this),
            'custom-gradient': this.customGradientSpectrum.bind(this)
        };
        
        this.presets = {
            'aurora-borealis': ['#00ffcc', '#ff00ff', '#00ffff', '#ffcc00'],
            'deep-ocean': ['#00008b', '#00bfff', '#1e90ff', '#87cefa'],
            'forest-fire': ['#8b0000', '#ff4500', '#ff8c00', '#ffd700'],
            'quantum-energy': ['#4b0082', '#9400d3', '#00bfff', '#00ff00'],
            'market-pulse': ['#ff0000', '#ffa500', '#ffff00', '#00ff00']
        };
    }

    // Convert frequency to visible light color (physics-accurate)
    frequencyToColor(frequency, intensity = 1.0) {
        // Map frequency to visible light spectrum (430-790 THz)
        const visibleLightMin = 430; // THz (violet)
        const visibleLightMax = 790; // THz (red)
        
        // Normalize frequency to visible light range
        const normalized = (frequency - 200) / (1000 - 200);
        const lightFrequency = visibleLightMin + normalized * (visibleLightMax - visibleLightMin);
        
        // Convert light frequency to RGB
        return this.lightFrequencyToRGB(lightFrequency, intensity);
    }

    lightFrequencyToRGB(frequency, intensity = 1.0) {
        // Convert light frequency to RGB (simplified model)
        let r, g, b;
        
        if (frequency >= 380 && frequency < 440) {
            r = (-(frequency - 440) / 60);
            g = 0;
            b = 1;
        } else if (frequency >= 440 && frequency < 490) {
            r = 0;
            g = ((frequency - 440) / 50);
            b = 1;
        } else if (frequency >= 490 && frequency < 510) {
            r = 0;
            g = 1;
            b = (-(frequency - 510) / 20);
        } else if (frequency >= 510 && frequency < 580) {
            r = ((frequency - 510) / 70);
            g = 1;
            b = 0;
        } else if (frequency >= 580 && frequency < 645) {
            r = 1;
            g = (-(frequency - 645) / 65);
            b = 0;
        } else if (frequency >= 645 && frequency < 781) {
            r = 1;
            g = 0;
            b = 0;
        } else {
            r = 0;
            g = 0;
            b = 0;
        }
        
        // Adjust intensity
        const factor = intensity;
        r = Math.min(255, Math.max(0, Math.floor(r * 255 * factor)));
        g = Math.min(255, Math.max(0, Math.floor(g * 255 * factor)));
        b = Math.min(255, Math.max(0, Math.floor(b * 255 * factor)));
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Create harmonic color relationships based on frequency ratios
    harmonicColorSpectrum(baseFrequency, harmonics = 8) {
        const colors = [];
        
        for (let i = 1; i <= harmonics; i++) {
            const harmonicFrequency = baseFrequency * i;
            const color = this.frequencyToColor(harmonicFrequency);
            
            // Adjust saturation and brightness based on harmonic order
            const saturation = 80 + (20 / i);
            const lightness = 50 + (30 / i);
            
            const adjustedColor = this.adjustColor(color, saturation, lightness);
            colors.push({
                frequency: harmonicFrequency,
                color: adjustedColor,
                order: i,
                ratio: i
            });
        }
        
        return colors;
    }

    // Create colors based on market sentiment
    sentimentColorSpectrum(marketData) {
        const colors = [];
        
        Object.entries(marketData).forEach(([symbol, data]) => {
            let baseHue;
            
            if (data.change24h > 5) {
                baseHue = 120; // Green for strong positive
            } else if (data.change24h > 0) {
                baseHue = 60; // Yellow for slightly positive
            } else if (data.change24h > -5) {
                baseHue = 30; // Orange for slightly negative
            } else {
                baseHue = 0; // Red for strong negative
            }
            
            // Adjust saturation based on volume
            const saturation = Math.min(100, 50 + (data.volume / 1000000));
            
            // Adjust lightness based on volatility
            const lightness = Math.max(20, Math.min(80, 50 - (data.volatility * 5)));
            
            const color = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
            
            colors.push({
                symbol,
                color,
                change: data.change24h,
                volume: data.volume,
                volatility: data.volatility
            });
        });
        
        return colors;
    }

    // Create colors based on energy levels
    energyColorSpectrum(frequencies, amplitudes) {
        const colors = [];
        
        frequencies.forEach((freq, index) => {
            const amplitude = amplitudes[index] || 1;
            const baseColor = this.frequencyToColor(freq);
            
            // Adjust color based on amplitude (energy)
            const energyFactor = Math.min(1, amplitude / 10);
            const brightColor = this.adjustColorBrightness(baseColor, energyFactor * 100);
            
            colors.push({
                frequency: freq,
                amplitude: amplitude,
                color: brightColor,
                energy: energyFactor
            });
        });
        
        return colors;
    }

    // Create custom gradient spectrum
    customGradientSpectrum(colors, steps = 100) {
        const gradient = [];
        
        for (let i = 0; i < steps; i++) {
            const position = i / (steps - 1);
            const color = this.interpolateColors(colors, position);
            gradient.push({
                position,
                color
            });
        }
        
        return gradient;
    }

    // Color interpolation utilities
    interpolateColors(colors, position) {
        if (colors.length === 1) return colors[0];
        
        const segment = 1 / (colors.length - 1);
        const index = Math.min(colors.length - 2, Math.floor(position / segment));
        const localPosition = (position - (index * segment)) / segment;
        
        return this.interpolateTwoColors(colors[index], colors[index + 1], localPosition);
    }

    interpolateTwoColors(color1, color2, position) {
        // Convert colors to RGB
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        // Interpolate each channel
        const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * position);
        const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * position);
        const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * position);
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    adjustColor(color, saturationChange = 0, lightnessChange = 0) {
        // Convert to HSL, adjust, then back to RGB
        const hsl = this.rgbToHsl(color);
        
        hsl.s = Math.min(100, Math.max(0, hsl.s + saturationChange));
        hsl.l = Math.min(100, Math.max(0, hsl.l + lightnessChange));
        
        return this.hslToRgb(hsl.h, hsl.s, hsl.l);
    }

    adjustColorBrightness(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, Math.max(0, (num >> 16) + amt));
        const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
        const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
        
        return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
    }

    rgbToHsl(color) {
        // Implementation of RGB to HSL conversion
        const rgb = this.hexToRgb(color);
        let r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
        
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    hslToRgb(h, s, l) {
        // Implementation of HSL to RGB conversion
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
    }

    // Generate color palette for charts
    generateChartPalette(count, preset = 'market-pulse') {
        const baseColors = this.presets[preset] || this.presets['market-pulse'];
        const palette = [];
        
        for (let i = 0; i < count; i++) {
            const position = i / Math.max(1, count - 1);
            const color = this.interpolateColors(baseColors, position);
            palette.push(color);
        }
        
        return palette;
    }

    // Create color scale for heatmaps
    createHeatmapScale(minValue, maxValue, colors = ['#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000']) {
        return (value) => {
            const position = (value - minValue) / (maxValue - minValue);
            return this.interpolateColors(colors, position);
        };
    }
}
