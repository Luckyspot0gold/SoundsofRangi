// src/visualization/color-manager.js
import { ColorSpectrumUtils } from './color-spectrum-utils.js';
import { ChartColorIntegration } from './chart-color-integration.js';
import { CymaticColorVisualizer } from './cymatic-color-visualizer.js';
import { AdvancedMaterialSystem } from './advanced-materials.js';

export class ColorManager {
    constructor(scene, camera, renderer) {
        this.colorUtils = new ColorSpectrumUtils();
        this.chartIntegration = new ChartColorIntegration();
        this.materialSystem = new AdvancedMaterialSystem();
        this.cymaticVisualizer = new CymaticColorVisualizer(scene, camera, renderer);
        
        this.currentTheme = 'harmonic-theme';
        this.currentColors = [];
    }

    setTheme(themeName, themeData = null) {
        this.currentTheme = themeName;
        
        switch (themeName) {
            case 'harmonic-theme':
                const baseFrequency = themeData?.baseFrequency || 432;
                this.currentColors = this.colorUtils.harmonicColorSpectrum(baseFrequency);
                break;
                
            case 'market-theme':
                this.currentColors = this.colorUtils.sentimentColorSpectrum(themeData);
                break;
                
            case 'energy-theme':
                this.currentColors = this.colorUtils.energyColorSpectrum(
                    themeData.frequencies, 
                    themeData.amplitudes
                );
                break;
                
            case 'custom-theme':
                this.currentColors = this.colorUtils.customGradientSpectrum(
                    themeData.colors, 
                    themeData.steps
                );
                break;
        }
        
        return this.currentColors;
    }

    applyThemeToCharts(charts) {
        let theme;
        
        switch (this.currentTheme) {
            case 'harmonic-theme':
                theme = this.chartIntegration.createHarmonicTheme();
                break;
                
            case 'market-theme':
                theme = this.chartIntegration.createMarketTheme({});
                break;
                
            case 'energy-theme':
                theme = this.chartIntegration.createEnergyTheme([], []);
                break;
                
            case 'custom-theme':
                theme = this.chartIntegration.createCustomTheme(
                    this.currentColors.map(c => c.color || c)
                );
                break;
        }
        
        // Apply theme to all charts
        charts.forEach(chart => {
            this.chartIntegration.applyThemeToChart(chart, theme);
        });
        
        return theme;
    }

    updateCymatics(frequencies, amplitudes) {
        this.cymaticVisualizer.updateCymatics(frequencies, amplitudes);
    }

    updateMarketCymatics(marketData) {
        this.cymaticVisualizer.updateMarketCymatics(marketData);
    }

    createColorLegend(containerId, title = 'Color Spectrum') {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="color-legend">
                <h4>${title}</h4>
                <div class="legend-items"></div>
            </div>
        `;
        
        const itemsContainer = container.querySelector('.legend-items');
        
        this.currentColors.forEach((colorInfo, index) => {
            const item = document.createElement('div');
            item.className = 'legend-item';
            
            let label;
            if (colorInfo.frequency) {
                label = `${colorInfo.frequency} Hz`;
            } else if (colorInfo.symbol) {
                label = colorInfo.symbol;
            } else if (colorInfo.energy) {
                label = `Energy: ${colorInfo.energy.toFixed(2)}`;
            } else {
                label = `Color ${index + 1}`;
            }
            
            item.innerHTML = `
                <div class="color-box" style="background: ${colorInfo.color || colorInfo}"></div>
                <span class="color-label">${label}</span>
            `;
            
            itemsContainer.appendChild(item);
        });
        
        // Add styles if not already added
        if (!document.querySelector('#color-legend-styles')) {
            const style = document.createElement('style');
            style.id = 'color-legend-styles';
            style.textContent = `
                .color-legend {
                    background: rgba(10, 20, 40, 0.7);
                    border: 1px solid #3344aa;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 10px 0;
                }
                
                .color-legend h4 {
                    margin-top: 0;
                    color: #00ffcc;
                    border-bottom: 1px solid #3344aa;
                    padding-bottom: 10px;
                }
                
                .legend-items {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                
                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .color-box {
                    width: 20px;
                    height: 20px;
                    border: 1px solid #334466;
                    border-radius: 3px;
                }
                
                .color-label {
                    color: #e0e0ff;
                    font-size: 14px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    animate(time) {
        this.cymaticVisualizer.animate(time);
        this.materialSystem.updateMaterials(time);
    }
}
