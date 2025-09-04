import * as THREE from 'three';

export class ResonanceChamber {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x0a0a1a);
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.z = 5;

        // Add basic lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation loop
        this.animate();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    createStandingWave(frequency, amplitude, color = 0x00ffcc) {
        const wavelength = 343 / frequency;
        const geometry = new THREE.PlaneGeometry(wavelength * 2, wavelength * 2, 50, 50);
        
        // Modify vertices to create wave pattern
        const positions = geometry.getAttribute('position');
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = amplitude * Math.sin(2 * Math.PI * x / wavelength);
            positions.setZ(i, z);
        }
        positions.needsUpdate = true;
        
        const material = new THREE.MeshPhongMaterial({
            color: color,
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            opacity: 0.8
        });
        
        const wave = new THREE.Mesh(geometry, material);
        this.scene.add(wave);
        
        return wave;
    }

    clearScene() {
        while(this.scene.children.length > 0) { 
            this.scene.remove(this.scene.children[0]); 
        }
    }
}
