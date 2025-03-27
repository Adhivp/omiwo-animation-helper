
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
      70, // Even wider FOV for more dramatic perspective
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2.0; // Closer camera position for more pronounced effect
    cameraRef.current = camera;
    
    // Create renderer with improved settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3; // Increased exposure
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Brighter ambient light
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Brighter directional light
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add point lights for more dramatic effect
    const pointLight1 = new THREE.PointLight(0xffffff, 1.8, 10); // Brighter point light
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1.5, 10); // Brighter point light
    pointLight2.position.set(-2, -1, 2);
    scene.add(pointLight2);

    // Add a subtle colored point light based on product color
    const colorLight = new THREE.PointLight(new THREE.Color(productColor), 1.2, 10); // Brighter color light
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
      transmission: 0.7, // More transparent like liquid
      reflectivity: 0.8, // Enhanced reflectivity
      ior: 1.6, // Higher index of refraction (more glass-like)
      envMapIntensity: 1.8, // Enhanced environment map intensity
      side: THREE.DoubleSide,
    });
    
    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Optimized animation function with enhanced mouse responsiveness
    const animate = () => {
      if (!meshRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      const time = performance.now() * 0.001;
      timeRef.current = time;
      
      // Update based on animations and mouse position
      updateAnimation(time, mousePosition);
      
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

  // Updated function to handle animation with mouse position
  function updateAnimation(time: number, mousePos: {x: number, y: number} = {x: 0, y: 0}) {
    if (!meshRef.current) return;

    // Apply rotation based on mouse position - more responsive
    // Direct cursor influence - more responsive rotation
    const targetRotationX = (mousePos.y * 0.3); // Increased from 0.2 to 0.3
    const targetRotationY = (-mousePos.x * 0.3); // Increased from 0.2 to 0.3
    
    // Smooth rotation towards mouse position - faster response
    meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.08; // Increased from 0.05 to 0.08
    meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.08; // Increased from 0.05 to 0.08
    
    // Apply cursor-influenced distortion
    applyMouseDistortion(mousePos);
    
    // Apply animation based on type
    applyTypedAnimation(time, mousePos);
  }

  // Enhanced function to apply mouse-based distortion to the mesh vertices
  function applyMouseDistortion(mousePos: {x: number, y: number}) {
    if (!meshRef.current || !initialGeometryRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position;
    const initialPositions = initialGeometryRef.current.attributes.position;
    
    if (!positions || !initialPositions || positions.count !== initialPositions.count) return;
    
    // Apply distortion based on mouse position - enhanced effect
    for (let i = 0; i < positions.count; i++) {
      const vertex = new THREE.Vector3();
      
      // Type safety: Only get vertex if we can ensure it's a THREE.BufferAttribute
      if (initialPositions instanceof THREE.BufferAttribute) {
        vertex.fromBufferAttribute(initialPositions, i);
      
        // Calculate influence based on normalized mouse position - increased effect
        const mouseInfluenceX = mousePos.x * 0.05; // Increased from 0.03 to 0.05
        const mouseInfluenceY = mousePos.y * 0.05; // Increased from 0.03 to 0.05
        
        // Apply distortion
        vertex.x += vertex.x * mouseInfluenceX;
        vertex.y += vertex.y * mouseInfluenceY;
        
        if (positions instanceof THREE.BufferAttribute) {
          positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
      }
    }
    
    positions.needsUpdate = true;
  }

  // Function to apply animation based on animation type, now with mouse influence
  function applyTypedAnimation(time: number, mousePos: {x: number, y: number} = {x: 0, y: 0}) {
    if (!meshRef.current || !initialGeometryRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position;
    const initialPositions = initialGeometryRef.current.attributes.position;
    
    if (!positions || !initialPositions || positions.count !== initialPositions.count) return;
    
    // Mouse influence factor - increased for more pronounced effect
    const mouseInfluence = Math.sqrt(mousePos.x * mousePos.x + mousePos.y * mousePos.y) * 0.7; // Increased from 0.5 to 0.7
    
    // Make sure both attributes are BufferAttribute instances
    if (positions instanceof THREE.BufferAttribute && initialPositions instanceof THREE.BufferAttribute) {
      switch (animationType) {
        case 'wave':
          applyWaveAnimation(time, positions, initialPositions, mouseInfluence);
          break;
        case 'ripple':
          applyRippleAnimation(time, positions, initialPositions, mouseInfluence);
          break;
        case 'pour':
          applyPourAnimation(time, positions, initialPositions, mouseInfluence);
          break;
        case 'flow':
          applyFlowAnimation(time, positions, initialPositions, mouseInfluence);
          break;
      }
    }
  }

  // Wave animation with mouse influence
  function applyWaveAnimation(time: number, positions: THREE.BufferAttribute, initialPositions: THREE.BufferAttribute, mouseInfluence: number = 0) {
    for (let i = 0; i < positions.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(initialPositions, i);
      
      // More complex wave pattern with mouse influence - increased amplitude and speed
      const amplitudeFactor = 0.12 + (mouseInfluence * 0.08); // Increased from 0.08+0.05 to 0.12+0.08
      const speedFactor = 2.5 + (mouseInfluence * 2.0); // Increased from 2+1.5 to 2.5+2.0
      
      const waveX = amplitudeFactor * Math.sin(vertex.x * 8 + time * speedFactor);
      const waveY = amplitudeFactor * Math.sin(vertex.y * 8 + time * (speedFactor + 0.5));
      const waveZ = amplitudeFactor * Math.sin(vertex.z * 8 + time * (speedFactor + 1));
      
      vertex.x += waveX;
      vertex.y += waveY;
      vertex.z += waveZ;
      
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    positions.needsUpdate = true;
    
    // Gentle bobbing motion influenced by mouse - increased amplitude
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.08 * (1 + mouseInfluence); // Increased from 0.05 to 0.08
    }
  }

  // Ripple animation
  function applyRippleAnimation(time: number, positions: THREE.BufferAttribute, initialPositions: THREE.BufferAttribute, mouseInfluence: number = 0) {
    for (let i = 0; i < positions.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(initialPositions, i);
      
      // Create outward rippling effect - increased ripple factor
      const angle = Math.atan2(vertex.y, vertex.x);
      const dist = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y);
      const rippleFactor = (0.10 + mouseInfluence * 0.05) * Math.sin(dist * 10 - time * 4); // Increased from 0.08 to 0.10+0.05
      
      // Apply ripple along the normal direction
      vertex.x += rippleFactor * Math.cos(angle);
      vertex.y += rippleFactor * Math.sin(angle);
      vertex.z += rippleFactor * 0.5;
      
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    positions.needsUpdate = true;
    
    // Add rotation - slightly faster
    if (meshRef.current) {
      meshRef.current.rotation.z = time * 0.25; // Increased from 0.2 to 0.25
    }
  }

  // Pour animation
  function applyPourAnimation(time: number, positions: THREE.BufferAttribute, initialPositions: THREE.BufferAttribute, mouseInfluence: number = 0) {
    for (let i = 0; i < positions.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(initialPositions, i);
      
      // Bottom vertices move more (dripping effect) - increased effect
      if (vertex.y < -0.2) {
        // More pronounced dripping at the bottom
        const distFromCenter = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);
        const dropFactor = (0.18 + mouseInfluence * 0.05) * Math.sin(distFromCenter * 10 + time * 5); // Increased from 0.15 to 0.18+0.05
        vertex.y -= Math.max(0, 0.18 * Math.sin(time * 3) * (vertex.y + 0.7)) + dropFactor * 0.18; // Increased from 0.15 to 0.18
        
        // Add horizontal movement to simulate liquid flow - increased effect
        vertex.x += 0.04 * Math.sin(time * 4 + vertex.y * 10); // Increased from 0.03 to 0.04
        vertex.z += 0.04 * Math.cos(time * 3 + vertex.y * 10); // Increased from 0.03 to 0.04
      }
      
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    positions.needsUpdate = true;
    
    // Tilting motion like pouring - increased effect
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * 0.4) * 0.25; // Increased from 0.2 to 0.25
      meshRef.current.rotation.z = time * 0.15; // Increased from 0.1 to 0.15
    }
  }

  // Flow animation
  function applyFlowAnimation(time: number, positions: THREE.BufferAttribute, initialPositions: THREE.BufferAttribute, mouseInfluence: number = 0) {
    for (let i = 0; i < positions.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(initialPositions, i);
      const distance = vertex.length();
      
      // Create a more turbulent flow effect - increased noise factors
      const noise1 = (0.18 + mouseInfluence * 0.05) * Math.sin(vertex.x * 5 + time * 2) * distance; // Increased from 0.15 to 0.18+0.05
      const noise2 = (0.18 + mouseInfluence * 0.05) * Math.sin(vertex.y * 5 + time * 1.5) * distance; // Increased from 0.15 to 0.18+0.05
      const noise3 = (0.18 + mouseInfluence * 0.05) * Math.sin(vertex.z * 5 + time * 2.5) * distance; // Increased from 0.15 to 0.18+0.05
      
      vertex.x += noise1 + 0.04 * Math.sin(time * 3); // Increased from 0.03 to 0.04
      vertex.y += noise2 + 0.04 * Math.cos(time * 2.5); // Increased from 0.03 to 0.04
      vertex.z += noise3 + 0.04 * Math.sin(time * 3.5); // Increased from 0.03 to 0.04
      
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    positions.needsUpdate = true;
    
    // Slow rotation - slightly faster
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.25; // Increased from 0.2 to 0.25
      meshRef.current.rotation.z = time * 0.15; // Increased from 0.1 to 0.15
    }
  }
  
  return <div ref={containerRef} className={`webgl-container ${className}`} />;
};

export default ThreeScene;
