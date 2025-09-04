// src/visualization/cymatic-color-visualizer.js
import * as THREE from 'three';
import { ColorSpectrumUtils } from './color-spectrum-utils.js';
import { AdvancedMaterialSystem } from './advanced-materials.js';

export class CymaticColorVisualizer {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.colorUtils = new ColorSpectrumUtils();
        this.materialSystem = new AdvancedMaterialSystem();
        this.cymaticObjects = new Map();
        this.currentFrequencies = [];
        this.currentAmplitudes = [];
    }

    createCymaticSurface(frequency, amplitude, size = 10, segments = 50) {
        // Create a geometry for cymatic visualization
        const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
        
        // Modify vertices based on frequency and amplitude
        const positions = geometry.getAttribute('position');
        const colors = new Float32Array(positions.count * 3);
        
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            
            // Create wave pattern based on frequency
            const z = amplitude * Math.sin(x * frequency) * Math.sin(y * frequency);
            positions.setZ(i, z);
            
            // Create color pattern based on position and frequency
            const color = this.colorUtils.frequencyToColor(frequency + (x + y) * 10, amplitude);
            const rgb = this.colorUtils.hexToRgb(color);
            
            colors[i * 3] = rgb.r / 255;
            colors[i * 3 + 1] = rgb.g / 255;
            colors[i * 3 + 2] = rgb.b / 255;
        }
        
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        positions.needsUpdate = true;
        
        // Create material
        const material = this.materialSystem.createFrequencyMaterial(frequency, amplitude);
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2; // Lay flat
        
        this.scene.add(mesh);
        this.cymaticObjects.set(`freq-${frequency}`, {
            mesh,
            frequency,
            amplitude
        });
        
        return mesh;
    }

    createHarmonicCymatics(baseFrequency, amplitudes = [1, 0.8, 0.6, 0.4, 0.2]) {
        const harmonicGroup = new THREE.Group();
        
        amplitudes.forEach((amplitude, index) => {
            const harmonicFrequency = baseFrequency * (index + 1);
            const surface = this.createCymaticSurface(harmonicFrequency, amplitude);
            
            // Position each harmonic surface slightly above the previous one
            surface.position.y = index * 0.5;
            
            harmonicGroup.add(surface);
        });
        
        this.scene.add(harmonicGroup);
        return harmonicGroup;
    }

    createMarketCymatics(marketData) {
        const marketGroup = new THREE.Group();
        let index = 0;
        
        Object.entries(marketData).forEach(([symbol, data]) => {
            // Convert market data to frequency and amplitude
            const frequency = 100 + (data.price % 900); // Map price to frequency range
            const amplitude = Math.min(2, 0.5 + (data.volume / 100000000)); // Map volume to amplitude
            
            const surface = this.createCymaticSurface(frequency, amplitude);
            
            // Position in a grid
            const row = Math.floor(index / 3);
            const col = index % 3;
            surface.position.set((col - 1) * 12, 0, (row - 1) * 12);
            
            // Apply market sentiment color
            const sentimentColors = this.colorUtils.sentimentColorSpectrum({ [symbol]: data });
            surface.material.color = new THREE.Color(sentimentColors[0].color);
            
            marketGroup.add(surface);
            index++;
        });
        
        this.scene.add(marketGroup);
        return marketGroup;
    }

    updateCymatics(frequencies, amplitudes) {
        this.currentFrequencies = frequencies;
        this.currentAmplitudes = amplitudes;
        
        // Remove old cymatic objects
        this.cymaticObjects.forEach((obj, key) => {
            this.scene.remove(obj.mesh);
            obj.mesh.geometry.dispose();
            obj.mesh.material.dispose();
        });
        this.cymaticObjects.clear();
        
        // Create new cymatic surfaces
        frequencies.forEach((frequency, index) => {
            const amplitude = amplitudes[index] || 1;
            this.createCymaticSurface(frequency, amplitude);
        });
    }

    updateMarketCymatics(marketData) {
        // Update existing market cymatics or create new ones
        Object.entries(marketData).forEach(([symbol, data]) => {
            const frequency = 100 + (data.price % 900);
            const amplitude = Math.min(2, 0.5 + (data.volume / 100000000));
            
            if (this.cymaticObjects.has(`market-${symbol}`)) {
                // Update existing surface
                const obj = this.cymaticObjects.get(`market-${symbol}`);
                
                // Update geometry
                const positions = obj.mesh.geometry.getAttribute('position');
                for (let i = 0; i < positions.count; i++) {
                    const x = positions.getX(i);
                    const y = positions.getY(i);
                    const z = amplitude * Math.sin(x * frequency) * Math.sin(y * frequency);
                    positions.setZ(i, z);
                }
                positions.needsUpdate = true;
                
                // Update material
                const sentimentColors = this.colorUtils.sentimentColorSpectrum({ [symbol]: data });
                obj.mesh.material.color = new THREE.Color(sentimentColors[0].color);
                obj.mesh.material.opacity = 0.8 - (data.volatility * 0.1);
                
            } else {
                // Create new surface
                const surface = this.createCymaticSurface(frequency, amplitude);
                surface.name = `market-${symbol}`;
                this.cymaticObjects.set(`market-${symbol}`, {
                    mesh: surface,
                    frequency,
                    amplitude
                });
            }
        });
    }

    animate(time) {
        // Update materials with current time
        this.materialSystem.updateMaterials(time);
        
        // Animate cymatic surfaces
        this.cymaticObjects.forEach((obj) => {
            // Add subtle animation to surfaces
            const positions = obj.mesh.geometry.getAttribute('position');
            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);
                const z = positions.getZ(i);
                
                // Add time-based animation
                const timeFactor = time * 0.001;
                const animation = Math.sin(x * 2 + timeFactor) * Math.cos(y * 2 + timeFactor) * 0.1;
                positions.setZ(i, z + animation);
            }
            positions.needsUpdate = true;
        });
    }
}
