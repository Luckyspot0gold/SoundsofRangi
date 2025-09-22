// components/RealCymaticVisualizer.tsx
import * as THREE from 'three';

export class RealCymaticVisualizer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particles: THREE.Points;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    
    this.createParticleSystem();
    this.animate();
  }

  private createParticleSystem(): void {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 10000;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2;
      positions[i + 1] = (Math.random() - 0.5) * 2;
      positions[i + 2] = (Math.random() - 0.5) * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0x00aaff,
      size: 0.02,
      transparent: true
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  updateFromMarketData(frequency: number, amplitude: number): void {
    // Real cymatics: particles respond to sound frequency
    const positions = this.particles.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i], y = positions[i + 1], z = positions[i + 2];
      const distance = Math.sqrt(x * x + y * y + z * z);
      
      // Chladni plate pattern formula
      const displacement = amplitude * Math.sin(frequency * distance);
      positions[i + 2] = displacement;
    }

    this.particles.geometry.attributes.position.needsUpdate = true;
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);
    this.particles.rotation.y += 0.002;
    this.renderer.render(this.scene, this.camera);
  };
}
