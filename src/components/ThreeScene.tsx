
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  className?: string;
  color?: string;
  animationType?: 'wave' | 'ripple' | 'flow';
}

const ThreeScene = ({ className = '', color = '#33C3F0', animationType = 'wave' }: ThreeSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create geometry based on animation type
    let geometry;
    
    if (animationType === 'wave') {
      geometry = new THREE.SphereGeometry(1, 64, 64);
    } else if (animationType === 'ripple') {
      geometry = new THREE.TorusGeometry(0.7, 0.3, 64, 100);
    } else { // flow
      geometry = new THREE.IcosahedronGeometry(1, 10);
    }
    
    // Create material
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.8,
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.4,
    });
    
    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;
    
    // Animation
    const animate = () => {
      if (!meshRef.current) return;
      
      const time = Date.now() * 0.001;
      
      if (animationType === 'wave') {
        // Wave animation
        mesh.rotation.x = Math.sin(time * 0.5) * 0.2;
        mesh.rotation.y = Math.sin(time * 0.3) * 0.2;
        mesh.position.y = Math.sin(time * 0.7) * 0.05;
        
        // Distort sphere for wave effect
        const positions = (geometry as THREE.SphereGeometry).attributes.position;
        const initialPositions = (geometry as THREE.SphereGeometry).clone().attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
          const vertex = new THREE.Vector3();
          vertex.fromBufferAttribute(initialPositions, i);
          
          const waveX = 0.05 * Math.sin(vertex.x * 5 + time * 2);
          const waveY = 0.05 * Math.sin(vertex.y * 5 + time * 2);
          const waveZ = 0.05 * Math.sin(vertex.z * 5 + time * 2);
          
          vertex.x += waveX;
          vertex.y += waveY;
          vertex.z += waveZ;
          
          positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        positions.needsUpdate = true;
      } else if (animationType === 'ripple') {
        // Ripple animation
        mesh.rotation.x = time * 0.5;
        mesh.rotation.y = time * 0.3;
        mesh.scale.x = 1 + Math.sin(time * 0.7) * 0.1;
        mesh.scale.y = 1 + Math.sin(time * 0.7) * 0.1;
        mesh.scale.z = 1 + Math.sin(time * 0.7) * 0.1;
      } else { // flow
        // Flow animation
        mesh.rotation.x = time * 0.2;
        mesh.rotation.y = time * 0.3;
        
        // Create flowing liquid effect
        const positions = (geometry as THREE.IcosahedronGeometry).attributes.position;
        const initialPositions = (geometry as THREE.IcosahedronGeometry).clone().attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
          const vertex = new THREE.Vector3();
          vertex.fromBufferAttribute(initialPositions, i);
          const distance = vertex.length();
          
          const flowX = 0.1 * Math.sin(vertex.x * 2 + time * 2) * distance;
          const flowY = 0.1 * Math.sin(vertex.y * 2 + time * 2) * distance;
          const flowZ = 0.1 * Math.sin(vertex.z * 2 + time * 2) * distance;
          
          vertex.x += flowX;
          vertex.y += flowY;
          vertex.z += flowZ;
          
          positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        positions.needsUpdate = true;
      }
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [animationType, color]);
  
  return <div ref={containerRef} className={`webgl-container ${className}`} />;
};

export default ThreeScene;
