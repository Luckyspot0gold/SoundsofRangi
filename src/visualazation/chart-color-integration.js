// src/visualization/chart-color-integration.js
import { ColorSpectrumUtils } from './color-spectrum-utils.js';

export class ChartColorIntegration {
    constructor() {
        this.colorUtils = new ColorSpectrumUtils();
        this.chartThemes = {
            'harmonic-theme': this.createHarmonicTheme.bind(this),
            'market-theme': this.createMarketTheme.bind(this),
            'energy-theme': this.createEnergyTheme.bind(this),
            'custom-theme': this.createCustomTheme.bind(this)
        };
    }

    createHarmonicTheme(baseFrequency = 432, count = 8) {
        const harmonicColors = this.colorUtils.harmonicColorSpectrum(baseFrequency, count);
        
        return {
            colors: harmonicColors.map(c => c.color),
            gridLines: '#334466',
            text: '#e0e0ff',
            background: 'rgba(10, 20, 40, 0.7)',
            axis: '#00ffcc',
            tooltip: {
                background: 'rgba(20, 30, 60, 0.9)',
                border: '#00ffcc',
                text: '#ffffff'
            }
        };
    }

    createMarketTheme(marketData) {
        const sentimentColors = this.colorUtils.sentimentColorSpectrum(marketData);
        
        return {
            colors: sentimentColors.map(c => c.color),
            gridLines: '#334466',
            text: '#e0e0ff',
            background: 'rgba(10, 20, 40, 0.7)',
            axis: '#ffcc00',
            tooltip: {
                background: 'rgba(20, 30, 60, 0.9)',
                border: '#ffcc00',
                text: '#ffffff'
            },
            indicators: {
                positive: '#00ff00',
                negative: '#ff0000',
                neutral: '#ffff00'
            }
        };
    }

    createEnergyTheme(frequencies, amplitudes) {
        const energyColors = this.colorUtils.energyColorSpectrum(frequencies, amplitudes);
        
        return {
            colors: energyColors.map(c => c.color),
            gridLines: '#334466',
            text: '#e0e0ff',
            background: 'rgba(10, 20, 40, 0.7)',
            axis: '#00ffff',
            tooltip: {
                background: 'rgba(20, 30, 60, 0.9)',
                border: '#00ffff',
                text: '#ffffff'
            },
            gradients: this.createEnergyGradients(energyColors)
        };
    }

    createEnergyGradients(energyColors) {
        const gradients = [];
        
        energyColors.forEach((colorInfo, index) => {
            const baseColor = colorInfo.color;
            const lighter = this.colorUtils.adjustColorBrightness(baseColor, 30);
            const darker = this.colorUtils.adjustColorBrightness(baseColor, -30);
            
            gradients.push({
                base: baseColor,
                light: lighter,
                dark: darker,
                energy: colorInfo.energy
            });
        });
        
        return gradients;
    }

    createCustomTheme(colors, options = {}) {
        const defaultOptions = {
            gridLines: '#334466',
            text: '#e0e0ff',
            background: 'rgba(10, 20, 40, 0.7)',
            axis: colors[0] || '#00ffcc',
            tooltip: {
                background: 'rgba(20, 30, 60, 0.9)',
                border: colors[0] || '#00ffcc',
                text: '#ffffff'
            }
        };
        
        return {
            colors: colors,
            ...defaultOptions,
            ...options
        };
    }

    applyThemeToChart(chart, theme) {
        // Apply theme to Chart.js chart
        if (chart.options) {
            chart.options.scales = chart.options.scales || {};
            
            // Apply to all axes
            Object.keys(chart.options.scales).forEach(scaleId => {
                chart.options.scales[scaleId].grid = {
                    color: theme.gridLines
                };
                chart.options.scales[scaleId].ticks = {
                    color: theme.text
                };
            });
            
            // Apply background color
            chart.options.plugins = chart.options.plugins || {};
            chart.options.plugins.legend = {
                labels: {
                    color: theme.text
                }
            };
            
            // Update dataset colors
            if (chart.data && chart.data.datasets) {
                chart.data.datasets.forEach((dataset, index) => {
                    const colorIndex = index % theme.colors.length;
                    dataset.backgroundColor = theme.colors[colorIndex] + '80'; // Add alpha
                    dataset.borderColor = theme.colors[colorIndex];
                    dataset.pointBackgroundColor = theme.colors[colorIndex];
                });
            }
            
            chart.update();
        }
    }

    createHeatmapData(data, colorScale) {
        // Convert data to heatmap format with colors
        const heatmapData = [];
        
        data.forEach((row, y) => {
            row.forEach((value, x) => {
                heatmapData.push({
                    x,
                    y,
                    value,
                    color: colorScale(value)
                });
            });
        });
        
        return heatmapData;
    }

    createGradientLegend(theme, minValue, maxValue, elementId) {
        // Create a gradient legend for charts
        const legendElement = document.getElementById(elementId);
        if (!legendElement) return;
        
        const gradient = this.colorUtils.createHeatmapScale(minValue, maxValue, theme.colors);
        
        legendElement.innerHTML = `
            <div class="gradient-legend">
                <div class="gradient-bar"></div>
                <div class="legend-labels">
                    <span>${minValue}</span>
                    <span>${maxValue}</span>
                </div>
            </div>
        `;
        
        // Apply gradient to the bar
        const gradientBar = legendElement.querySelector('.gradient-bar');
        gradientBar.style.background = `linear-gradient(to right, ${theme.colors.join(', ')})`;
        
        // Add styles
        if (!document.querySelector('#gradient-legend-styles')) {
            const style = document.createElement('style');
            style.id = 'gradient-legend-styles';
            style.textContent = `
                .gradient-legend {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 10px 0;
                }
                
                .gradient-bar {
                    width: 100%;
                    height: 20px;
                    border-radius: 3px;
                    margin-bottom: 5px;
                }
                
                .legend-labels {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    color: #e0e0ff;
                    font-size: 12px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    createColorScaleForValues(values, theme) {
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        
        return (value) => {
            const position = (value - minValue) / (maxValue - minValue);
            return this.colorUtils.interpolateColors(theme.colors, position);
        };
    }
}
