
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  className?: string;
  color?: string;
  animationType?: 'wave' | 'ripple' | 'flow' | 'pour';
  productType?: 'toiletCleaner' | 'detergent' | 'handWash';
}

const ThreeScene = ({ 
  className = '', 
  color = '#33C3F0', 
  animationType = 'wave',
  productType
}: ThreeSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const timeRef = useRef<number>(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Get product-specific color
  const getProductColor = (): string => {
    if (productType === 'toiletCleaner') return '#E63946'; // Red for toilet cleaner
    if (productType === 'detergent') return '#2A9D8F'; // Teal for detergent
    if (productType === 'handWash') return '#00B4D8'; // Light blue for hand wash
    return color; // Default color
  };

  const productColor = getProductColor();

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add point lights for more dramatic effect
    const pointLight1 = new THREE.PointLight(0xffffff, 2, 10);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1.5, 10);
    pointLight2.position.set(-2, -1, 2);
    scene.add(pointLight2);
    
    // Create geometry based on animation type and product type
    let geometry;
    
    if (animationType === 'wave') {
      geometry = new THREE.SphereGeometry(1, 128, 128); // Higher resolution for smoother waves
    } else if (animationType === 'ripple') {
      geometry = new THREE.TorusGeometry(0.7, 0.3, 128, 128); // Higher resolution
    } else if (animationType === 'pour') {
      // Pour animation - elongated shape like pouring liquid
      geometry = new THREE.CylinderGeometry(0.5, 0.7, 1.5, 64, 64, false);
    } else { // flow
      geometry = new THREE.IcosahedronGeometry(1, 12); // Higher resolution
    }
    
    // Create material with enhanced properties for more realistic liquid look
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(productColor),
      transparent: true,
      opacity: 0.9,
      metalness: 0.1,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.2,
      transmission: 0.5, // Makes it more transparent like liquid
      reflectivity: 0.5,
      ior: 1.5, // Index of refraction (water-like)
      side: THREE.DoubleSide,
    });
    
    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;
    
    // Animation
    const animate = () => {
      if (!meshRef.current) return;
      
      const time = Date.now() * 0.001;
      timeRef.current = time;
      
      // Mouse interaction effect
      if (isHovered && meshRef.current) {
        meshRef.current.rotation.x += (mousePosition.y * 0.01 - meshRef.current.rotation.x) * 0.1;
        meshRef.current.rotation.y += (mousePosition.x * 0.01 - meshRef.current.rotation.y) * 0.1;
      }
      
      if (animationType === 'wave') {
        // Enhanced wave animation
        mesh.rotation.x = Math.sin(time * 0.5) * 0.2;
        mesh.rotation.y = Math.sin(time * 0.3) * 0.2;
        mesh.position.y = Math.sin(time * 0.7) * 0.05;
        
        // Advanced distortion for wave effect
        const positions = (geometry as THREE.SphereGeometry).attributes.position;
        const initialPositions = (geometry as THREE.SphereGeometry).clone().attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
          const vertex = new THREE.Vector3();
          vertex.fromBufferAttribute(initialPositions, i);
          
          // More complex wave pattern
          const waveX = 0.08 * Math.sin(vertex.x * 8 + time * 2);
          const waveY = 0.08 * Math.sin(vertex.y * 8 + time * 2.5);
          const waveZ = 0.08 * Math.sin(vertex.z * 8 + time * 3);
          
          vertex.x += waveX;
          vertex.y += waveY;
          vertex.z += waveZ;
          
          positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        positions.needsUpdate = true;
      } else if (animationType === 'ripple') {
        // Enhanced ripple animation
        mesh.rotation.x = time * 0.5;
        mesh.rotation.y = time * 0.3;
        
        // Pulsating effect
        const pulseFactor = 1 + Math.sin(time * 2) * 0.1;
        mesh.scale.set(pulseFactor, pulseFactor, pulseFactor);
        
        // Ripple distortion
        const positions = (geometry as THREE.TorusGeometry).attributes.position;
        const initialPositions = (geometry as THREE.TorusGeometry).clone().attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
          const vertex = new THREE.Vector3();
          vertex.fromBufferAttribute(initialPositions, i);
          
          const rippleFactor = 0.06 * Math.sin(vertex.x * 10 + time * 5);
          
          // Apply ripple effect
          vertex.x += rippleFactor;
          vertex.y += rippleFactor;
          vertex.z += rippleFactor;
          
          positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        positions.needsUpdate = true;
      } else if (animationType === 'pour') {
        // Pouring liquid animation
        mesh.rotation.x = Math.sin(time * 0.2) * 0.1;
        mesh.rotation.z = time * 0.3; // Constant rotation
        
        // Stretch and contract the cylinder to simulate pouring
        const stretchFactor = 1 + Math.sin(time * 1.5) * 0.2;
        mesh.scale.y = stretchFactor;
        mesh.scale.x = 1 / Math.sqrt(stretchFactor); // Conserve volume
        mesh.scale.z = 1 / Math.sqrt(stretchFactor);
        
        // Create dripping effect
        const positions = (geometry as THREE.CylinderGeometry).attributes.position;
        const initialPositions = (geometry as THREE.CylinderGeometry).clone().attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
          const vertex = new THREE.Vector3();
          vertex.fromBufferAttribute(initialPositions, i);
          
          // Add drip effect at the bottom
          if (vertex.y < -0.5) {
            const dripFactor = 0.1 * Math.sin(vertex.x * 5 + vertex.z * 5 + time * 3);
            vertex.y -= dripFactor;
          }
          
          positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        positions.needsUpdate = true;
      } else { // flow
        // Enhanced flow animation
        mesh.rotation.x = time * 0.2;
        mesh.rotation.y = time * 0.3;
        
        // Create enhanced flowing liquid effect
        const positions = (geometry as THREE.IcosahedronGeometry).attributes.position;
        const initialPositions = (geometry as THREE.IcosahedronGeometry).clone().attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
          const vertex = new THREE.Vector3();
          vertex.fromBufferAttribute(initialPositions, i);
          const distance = vertex.length();
          
          // More complex flow pattern
          const flowX = 0.15 * Math.sin(vertex.x * 3 + time * 2) * distance;
          const flowY = 0.15 * Math.sin(vertex.y * 3 + time * 1.5) * distance;
          const flowZ = 0.15 * Math.sin(vertex.z * 3 + time * 2.5) * distance;
          
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
    
    // Handle mouse interactions
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      setMousePosition({ x, y });
    };
    
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    
    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      containerRef.current.addEventListener('mouseenter', handleMouseEnter);
      containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    }
    
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
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('mouseenter', handleMouseEnter);
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [animationType, color, isHovered, mousePosition, productColor, productType]);
  
  return <div ref={containerRef} className={`webgl-container ${className}`} />;
};

export default ThreeScene;
