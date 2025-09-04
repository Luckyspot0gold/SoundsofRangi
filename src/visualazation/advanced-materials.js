// src/visualization/advanced-materials.js
import * as THREE from 'three';
import { ColorSpectrumUtils } from './color-spectrum-utils.js';

export class AdvancedMaterialSystem {
    constructor() {
        this.colorUtils = new ColorSpectrumUtils();
        this.materials = new Map();
    }

    createFrequencyMaterial(frequency, amplitude = 1.0) {
        const color = this.colorUtils.frequencyToColor(frequency, amplitude);
        
        // Create a material that responds to frequency
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(color),
            emissive: new THREE.Color(this.colorUtils.adjustColorBrightness(color, 20)),
            specular: new THREE.Color(0x111111),
            shininess: 30,
            transparent: true,
            opacity: 0.8 + (amplitude * 0.2)
        });
        
        // Add custom properties for animation
        material.userData = {
            baseFrequency: frequency,
            baseAmplitude: amplitude,
            update: (time) => {
                // Pulsate based on frequency and time
                const pulse = Math.sin(time * frequency * 0.001) * 0.1 + 1;
                material.emissiveIntensity = 0.2 * pulse;
                material.opacity = 0.7 + (0.3 * pulse);
            }
        };
        
        this.materials.set(`freq-${frequency}`, material);
        return material;
    }

    createHarmonicMaterial(baseFrequency, harmonicOrder, amplitude = 1.0) {
        const harmonicFrequency = baseFrequency * harmonicOrder;
        const color = this.colorUtils.frequencyToColor(harmonicFrequency);
        
        // Adjust material properties based on harmonic order
        const shininess = 10 + (harmonicOrder * 5);
        const opacity = 0.5 + (0.5 / harmonicOrder);
        
        const material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(color),
            metalness: 0.2 + (0.1 * harmonicOrder),
            roughness: 0.8 - (0.1 * harmonicOrder),
            clearcoat: 0.1 * harmonicOrder,
            clearcoatRoughness: 0.1,
            transparent: true,
            opacity: opacity
        });
        
        material.userData = {
            baseFrequency: baseFrequency,
            harmonicOrder: harmonicOrder,
            update: (time) => {
                // Animate based on harmonic relationship
                const pulse = Math.sin(time * baseFrequency * 0.001 * harmonicOrder) * 0.1 + 1;
                material.opacity = opacity * pulse;
            }
        };
        
        this.materials.set(`harmonic-${baseFrequency}-${harmonicOrder}`, material);
        return material;
    }

    createMarketSentimentMaterial(symbol, marketData) {
        const colors = this.colorUtils.sentimentColorSpectrum({ [symbol]: marketData });
        const colorInfo = colors[0];
        
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(colorInfo.color),
            metalness: 0.3,
            roughness: 0.4 + (marketData.volatility * 0.1),
            emissive: new THREE.Color(this.colorUtils.adjustColorBrightness(colorInfo.color, 10)),
            emissiveIntensity: 0.2 + (Math.abs(marketData.change24h) / 50),
            transparent: true,
            opacity: 0.8 - (marketData.volatility * 0.1)
        });
        
        material.userData = {
            symbol: symbol,
            update: (time, newData) => {
                if (newData) {
                    // Update material based on new market data
                    material.roughness = 0.4 + (newData.volatility * 0.1);
                    material.emissiveIntensity = 0.2 + (Math.abs(newData.change24h) / 50);
                    material.opacity = 0.8 - (newData.volatility * 0.1);
                    
                    // Update color if change is significant
                    if (Math.abs(newData.change24h - marketData.change24h) > 1) {
                        const newColors = this.colorUtils.sentimentColorSpectrum({ [symbol]: newData });
                        material.color = new THREE.Color(newColors[0].color);
                    }
                }
                
                // Add subtle animation
                const pulse = Math.sin(time * 0.002) * 0.05 + 1;
                material.emissiveIntensity *= pulse;
            }
        };
        
        this.materials.set(`market-${symbol}`, material);
        return material;
    }

    createEnergyFieldMaterial(frequencies, amplitudes) {
        const colors = this.colorUtils.energyColorSpectrum(frequencies, amplitudes);
        
        // Create a gradient texture based on energy levels
        const texture = this.createEnergyTexture(colors);
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                energyTexture: { value: texture },
                time: { value: 0 },
                amplitude: { value: 1.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D energyTexture;
                uniform float time;
                uniform float amplitude;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    // Create dynamic energy patterns
                    vec2 displacedUv = vUv + sin(vPosition.x * 10.0 + time * 0.001) * 0.05;
                    displacedUv += cos(vPosition.y * 8.0 + time * 0.001) * 0.05;
                    
                    vec4 energyColor = texture2D(energyTexture, displacedUv);
                    
                    // Add pulsing effect based on amplitude
                    float pulse = sin(time * 0.002) * 0.1 + 1.0;
                    energyColor.rgb *= pulse * amplitude;
                    
                    // Add edge glow
                    float edge = 1.0 - smoothstep(0.4, 0.5, length(vUv - 0.5));
                    energyColor.rgb += edge * 0.3;
                    
                    gl_FragColor = energyColor;
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        material.userData = {
            frequencies: frequencies,
            amplitudes: amplitudes,
            update: (time, newFrequencies, newAmplitudes) => {
                material.uniforms.time.value = time;
                
                if (newFrequencies && newAmplitudes) {
                    // Update texture if frequencies or amplitudes change
                    const newColors = this.colorUtils.energyColorSpectrum(newFrequencies, newAmplitudes);
                    this.updateEnergyTexture(texture, newColors);
                    material.uniforms.amplitude.value = Math.max(...newAmplitudes) / 10;
                }
            }
        };
        
        this.materials.set('energy-field', material);
        return material;
    }

    createEnergyTexture(colors) {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createRadialGradient(
            size/2, size/2, 0,
            size/2, size/2, size/2
        );
        
        // Create gradient based on energy colors
        colors.forEach((colorInfo, index) => {
            const position = index / Math.max(1, colors.length - 1);
            gradient.addColorStop(position, colorInfo.color);
        });
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        return texture;
    }

    updateEnergyTexture(texture, colors) {
        const canvas = texture.image;
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        
        const gradient = ctx.createRadialGradient(
            size/2, size/2, 0,
            size/2, size/2, size/2
        );
        
        colors.forEach((colorInfo, index) => {
            const position = index / Math.max(1, colors.length - 1);
            gradient.addColorStop(position, colorInfo.color);
        });
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        
        texture.needsUpdate = true;
    }

    updateMaterials(time, dataUpdates = {}) {
        this.materials.forEach((material, key) => {
            if (material.userData.update) {
                const updateData = dataUpdates[key] || null;
                material.userData.update(time, updateData);
            }
        });
    }
}
