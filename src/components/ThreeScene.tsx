
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  className?: string;
  color?: string;
  animationType?: 'wave' | 'ripple' | 'flow' | 'pour';
  productType?: 'toiletCleaner' | 'detergent' | 'handWash';
  isHovered?: boolean;
  mousePosition?: { x: number, y: number };
}

const ThreeScene = ({ 
  className = '', 
  color = '#33C3F0', 
  animationType = 'wave',
  productType,
  isHovered = false,
  mousePosition = { x: 0, y: 0 }
}: ThreeSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const timeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);
  const initialGeometryRef = useRef<THREE.BufferGeometry | null>(null);

  // Get product-specific color
  const getProductColor = (): string => {
    if (productType === 'toiletCleaner') return '#1e3a8a'; // Dark blue for toilet cleaner
    if (productType === 'detergent') return '#3b82f6'; // Blue for detergent
    if (productType === 'handWash') return '#06b6d4'; // Turquoise for hand wash
    return color; // Default color
  };

  const productColor = getProductColor();

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera with adjusted field of view for better perspective
    const camera = new THREE.PerspectiveCamera(
      65, // Wider FOV for more dramatic perspective
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2.2; // Adjusted camera position
    cameraRef.current = camera;
    
    // Create renderer with improved settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Fix: Replace outputEncoding and sRGBEncoding with modern equivalents
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add point lights for more dramatic effect
    const pointLight1 = new THREE.PointLight(0xffffff, 1.5, 10);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1.2, 10);
    pointLight2.position.set(-2, -1, 2);
    scene.add(pointLight2);

    // Add a subtle colored point light based on product color
    const colorLight = new THREE.PointLight(new THREE.Color(productColor), 1, 10);
    colorLight.position.set(0, 0, 2);
    scene.add(colorLight);
    
    // Create geometry based on animation type and product type
    let geometry;
    
    if (animationType === 'wave') {
      // Higher resolution for smoother waves
      geometry = new THREE.SphereGeometry(1, 128, 128);
    } else if (animationType === 'ripple') {
      // Torus for ripple effect
      geometry = new THREE.TorusGeometry(0.7, 0.3, 128, 128);
    } else if (animationType === 'pour') {
      // Pour animation - elongated shape like pouring liquid
      geometry = new THREE.CylinderGeometry(0.5, 0.7, 1.5, 64, 64, false);
    } else { // flow
      // More complex geometry for flow effect
      geometry = new THREE.IcosahedronGeometry(1, 12);
    }
    
    // Store initial geometry for animation
    initialGeometryRef.current = geometry.clone();
    
    // Create more realistic liquid material with improved properties
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(productColor),
      transparent: true,
      opacity: 0.85,
      metalness: 0.1,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transmission: 0.6, // More transparent like liquid
      reflectivity: 0.7,
      ior: 1.5, // Index of refraction (water-like)
      envMapIntensity: 1.5,
      side: THREE.DoubleSide,
    });
    
    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Optimized animation function
    const animate = () => {
      if (!meshRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      const time = performance.now() * 0.001;
      timeRef.current = time;
      
      // Update based on animations
      updateAnimation(time);
      
      // Render the scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Request next frame
      requestRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    requestRef.current = requestAnimationFrame(animate);
    
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
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose geometries and materials
      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        (meshRef.current.material as THREE.Material).dispose();
      }
    };
  }, [animationType, color, productColor, productType]);

  // Function to update animation based on mouse position and hover state
  function updateAnimation(time: number) {
    if (!meshRef.current) return;

    // Apply rotation and mouse influence to the mesh
    if (isHovered && mousePosition) {
      // Direct cursor influence - more responsive rotation
      const targetRotationX = (mousePosition.y * 0.01);
      const targetRotationY = (-mousePosition.x * 0.01);
      
      // Smooth rotation towards mouse position
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.1;
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.1;
      
      // Apply cursor-influenced distortion
      applyMouseDistortion(mousePosition);
    } else {
      // Gentle default rotation when not hovered
      meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
      meshRef.current.rotation.x = Math.cos(time * 0.4) * 0.1;
    }
    
    // Apply animation based on type
    applyTypedAnimation(time);
  }

  // Function to apply mouse-based distortion to the mesh vertices
  function applyMouseDistortion(mousePos: {x: number, y: number}) {
    if (!meshRef.current || !initialGeometryRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position;
    const initialPositions = initialGeometryRef.current.attributes.position;
    
    if (!positions || !initialPositions || positions.count !== initialPositions.count) return;
    
    // Apply distortion based on mouse position
    for (let i = 0; i < positions.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(initialPositions, i);
      
      // Calculate influence based on distance from normalized mouse position
      const mouseInfluenceX = mousePos.x * 0.01;
      const mouseInfluenceY = mousePos.y * 0.01;
      
      // Apply distortion
      vertex.x += vertex.x * mouseInfluenceX;
      vertex.y += vertex.y * mouseInfluenceY;
      
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    positions.needsUpdate = true;
  }

  // Function to apply animation based on animation type
  function applyTypedAnimation(time: number) {
    if (!meshRef.current || !initialGeometryRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position;
    const initialPositions = initialGeometryRef.current.attributes.position;
    
    if (!positions || !initialPositions || positions.count !== initialPositions.count) return;
    
    switch (animationType) {
      case 'wave':
        applyWaveAnimation(time, positions, initialPositions);
        break;
      case 'ripple':
        applyRippleAnimation(time, positions, initialPositions);
        break;
      case 'pour':
        applyPourAnimation(time, positions, initialPositions);
        break;
      case 'flow':
        applyFlowAnimation(time, positions, initialPositions);
        break;
    }
  }

  // Wave animation
  function applyWaveAnimation(time: number, positions: THREE.BufferAttribute, initialPositions: THREE.BufferAttribute) {
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
    
    // Gentle bobbing motion
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.05;
    }
  }

  // Ripple animation
  function applyRippleAnimation(time: number, positions: THREE.BufferAttribute, initialPositions: THREE.BufferAttribute) {
    for (let i = 0; i < positions.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(initialPositions, i);
      
      // Create outward rippling effect
      const angle = Math.atan2(vertex.y, vertex.x);
      const dist = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y);
      const rippleFactor = 0.08 * Math.sin(dist * 10 - time * 4);
      
      // Apply ripple along the normal direction
      vertex.x += rippleFactor * Math.cos(angle);
      vertex.y += rippleFactor * Math.sin(angle);
      vertex.z += rippleFactor * 0.5;
      
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    positions.needsUpdate = true;
    
    // Add rotation
    if (meshRef.current) {
      meshRef.current.rotation.z = time * 0.2;
    }
  }

  // Pour animation
  function applyPourAnimation(time: number, positions: THREE.BufferAttribute, initialPositions: THREE.BufferAttribute) {
    for (let i = 0; i < positions.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(initialPositions, i);
      
      // Bottom vertices move more (dripping effect)
      if (vertex.y < -0.2) {
        // More pronounced dripping at the bottom
        const distFromCenter = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);
        const dropFactor = 0.15 * Math.sin(distFromCenter * 10 + time * 5);
        vertex.y -= Math.max(0, 0.15 * Math.sin(time * 3) * (vertex.y + 0.7)) + dropFactor * 0.15;
        
        // Add horizontal movement to simulate liquid flow
        vertex.x += 0.03 * Math.sin(time * 4 + vertex.y * 10);
        vertex.z += 0.03 * Math.cos(time * 3 + vertex.y * 10);
      }
      
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    positions.needsUpdate = true;
    
    // Tilting motion like pouring
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * 0.4) * 0.2;
      meshRef.current.rotation.z = time * 0.1;
    }
  }

  // Flow animation
  function applyFlowAnimation(time: number, positions: THREE.BufferAttribute, initialPositions: THREE.BufferAttribute) {
    for (let i = 0; i < positions.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(initialPositions, i);
      const distance = vertex.length();
      
      // Create a more turbulent flow effect
      const noise1 = 0.15 * Math.sin(vertex.x * 5 + time * 2) * distance;
      const noise2 = 0.15 * Math.sin(vertex.y * 5 + time * 1.5) * distance;
      const noise3 = 0.15 * Math.sin(vertex.z * 5 + time * 2.5) * distance;
      
      vertex.x += noise1 + 0.03 * Math.sin(time * 3);
      vertex.y += noise2 + 0.03 * Math.cos(time * 2.5);
      vertex.z += noise3 + 0.03 * Math.sin(time * 3.5);
      
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    positions.needsUpdate = true;
    
    // Slow rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.2;
      meshRef.current.rotation.z = time * 0.1;
    }
  }
  
  return <div ref={containerRef} className={`webgl-container ${className}`} />;
};

export default ThreeScene;
