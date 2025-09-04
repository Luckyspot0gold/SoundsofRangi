// src/visualization/advanced-cymatics.js
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

export class AdvancedCymaticVisualizer {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.setupPostProcessing();
        this.particleSystem = null;
    }

    setupPostProcessing() {
        // Create post-processing pipeline for enhanced visual effects
        this.composer = new EffectComposer(this.renderer);
        
        // Bloom pass for glowing effects
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // strength
            0.4, // radius
            0.85 // threshold
        );
        
        this.composer.addPass(this.bloomPass);
        
        // Custom shader for harmonic resonance effects
        this.resonanceShader = {
            uniforms: {
                "tDiffuse": { value: null },
                "frequency": { value: 0 },
                "time": { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float frequency;
                uniform float time;
                varying vec2 vUv;
                
                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    // Add frequency-based interference patterns
                    float wave = sin(vUv.x * frequency * 10.0 + time) * 
                                cos(vUv.y * frequency * 8.0 + time);
                    color.rgb += wave * 0.1 * vec3(0.3, 0.6, 1.0);
                    gl_FragColor = color;
                }
            `
        };
        
        this.shaderPass = new ShaderPass(this.resonanceShader);
        this.composer.addPass(this.shaderPass);
    }

    createParticleMorphingSystem(frequencies) {
        // Create instanced particles for efficient rendering of thousands of points
        const particleCount = 10000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            // Initialize particles in random positions
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
            
            // Assign colors based on frequency harmonics
            colors[i * 3] = Math.sin(frequencies[0] * 0.01) * 0.5 + 0.5;
            colors[i * 3 + 1] = Math.cos(frequencies[1] * 0.01) * 0.5 + 0.5;
            colors[i * 3 + 2] = Math.sin(frequencies[2] * 0.01) * 0.5 + 0.5;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            sizeAttenuation: true
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    updateParticles(frequencies, time) {
        if (!this.particleSystem) return;
        
        const positions = this.particleSystem.geometry.attributes.position.array;
        const colors = this.particleSystem.geometry.attributes.color.array;
        
        for (let i = 0; i < positions.length / 3; i++) {
            // Create harmonic motion based on multiple frequencies
            const x = positions[i * 3];
            const y = positions[i * 3 + 1];
            const z = positions[i * 3 + 2];
            
            // Calculate distance from center
            const distance = Math.sqrt(x * x + y * y + z * z);
            
            // Apply multiple frequency influences
            positions[i * 3] += Math.sin(distance * frequencies[0] * 0.01 + time) * 0.01;
            positions[i * 3 + 1] += Math.cos(distance * frequencies[1] * 0.01 + time) * 0.01;
            positions[i * 3 + 2] += Math.sin(distance * frequencies[2] * 0.01 + time) * 0.01;
            
            // Update colors based on frequency relationships
            colors[i * 3] = Math.sin(frequencies[0] * 0.01 + time) * 0.5 + 0.5;
            colors[i * 3 + 1] = Math.cos(frequencies[1] * 0.01 + time) * 0.5 + 0.5;
            colors[i * 3 + 2] = Math.sin(frequencies[2] * 0.01 + time) * 0.5 + 0.5;
        }
        
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.color.needsUpdate = true;
        this.shaderPass.uniforms.time.value = time;
        this.shaderPass.uniforms.frequency.value = frequencies[0];
    }

    render() {
        this.composer.render();
    }
}
