import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';

interface ThreeSceneProps {
  className?: string;
  color?: string;
  animationType?: 'wave' | 'ripple' | 'flow' | 'pour' | 'bubble';
  productType?: 'toiletCleaner' | 'detergent' | 'handWash';
  isHovered?: boolean;
  mousePosition?: { x: number, y: number };
}

const ThreeScene = ({ 
  className = '', 
  color = '#33C3F0', 
  animationType = 'bubble', // Changed default to bubble
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
  const bubblesRef = useRef<THREE.Group | null>(null);
  const noiseRef = useRef<SimplexNoise | null>(null);

  // Get product-specific color
  const getProductColor = (): string => {
    if (productType === 'toiletCleaner') return '#1e3a8a'; // Dark blue for toilet cleaner
    if (productType === 'detergent') return '#3b82f6'; // Blue for detergent
    if (productType === 'handWash') return '#eab308'; // Changed to yellow
    return color; // Default color
  };

  const productColor = getProductColor();

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create a SimplexNoise instance for more organic movement
    noiseRef.current = new SimplexNoise();
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera with adjusted field of view for better perspective
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2.2;
    cameraRef.current = camera;
    
    // Check for dark mode
    const isDarkMode = document.documentElement.classList.contains('dark');
    
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
    renderer.toneMappingExposure = isDarkMode ? 1.5 : 1.3; // Increase exposure in dark mode
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Enhanced lighting setup - adjust for dark mode
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkMode ? 0.9 : 0.7);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, isDarkMode ? 1.4 : 1.2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add point lights for more dramatic effect
    const pointLight1 = new THREE.PointLight(0xffffff, isDarkMode ? 2.0 : 1.8, 10);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, isDarkMode ? 1.7 : 1.5, 10);
    pointLight2.position.set(-2, -1, 2);
    scene.add(pointLight2);

    // Add a subtle colored point light based on product color
    const colorLight = new THREE.PointLight(new THREE.Color(productColor), isDarkMode ? 1.5 : 1.2, 10);
    colorLight.position.set(0, 0, 2);
    scene.add(colorLight);
    
    // Create geometry based on animation type
    let geometry;
    
    if (animationType === 'bubble') {
      // High-res sphere for main liquid body
      geometry = new THREE.SphereGeometry(1, 128, 128);
    } else if (animationType === 'wave') {
      geometry = new THREE.SphereGeometry(1, 128, 128);
    } else if (animationType === 'ripple') {
      geometry = new THREE.TorusGeometry(0.7, 0.3, 128, 128);
    } else if (animationType === 'pour') {
      geometry = new THREE.CylinderGeometry(0.5, 0.7, 1.5, 64, 64, false);
    } else { // flow
      geometry = new THREE.IcosahedronGeometry(1, 12);
    }
    
    // Store initial geometry for animation
    initialGeometryRef.current = geometry.clone();
    
    // Create more realistic liquid material with dark mode adjustments
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(productColor),
      transparent: true,
      opacity: isDarkMode ? 0.9 : 0.85,
      metalness: isDarkMode ? 0.15 : 0.1,
      roughness: 0.2,
      clearcoat: isDarkMode ? 0.9 : 0.8,
      clearcoatRoughness: 0.1,
      transmission: isDarkMode ? 0.75 : 0.7,
      reflectivity: isDarkMode ? 0.85 : 0.8,
      ior: 1.4,
      envMapIntensity: isDarkMode ? 2.0 : 1.8,
      side: THREE.DoubleSide,
    });
    
    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Add bubble particles for more realism
    if (animationType === 'bubble') {
      const bubbles = createBubbles(productColor);
      scene.add(bubbles);
      bubblesRef.current = bubbles;
    }
    
    // Force initial render to ensure correct sizing
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
    
    // Optimized animation function with enhanced mouse responsiveness
    const animate = () => {
      if (!meshRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      const time = performance.now() * 0.001;
      timeRef.current = time;
      
      // Update based on animations and mouse position
      updateAnimation(time, mousePosition);
      
      // Update bubbles if they exist
      if (bubblesRef.current && animationType === 'bubble') {
        updateBubbles(time);
      }
      
      // Render the scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Request next frame
      requestRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    requestRef.current = requestAnimationFrame(animate);
    
    // Handle resize with debounce for better performance
    let resizeTimeoutId: number | null = null;
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      // Clear previous timeout
      if (resizeTimeoutId) {
        window.clearTimeout(resizeTimeoutId);
      }
      
      // Set a timeout to prevent too frequent updates
      resizeTimeoutId = window.setTimeout(() => {
        const width = containerRef.current?.clientWidth || 300;
        const height = containerRef.current?.clientHeight || 300;
        
        if (cameraRef.current) {
          cameraRef.current.aspect = width / height;
          cameraRef.current.updateProjectionMatrix();
        }
        
        if (rendererRef.current) {
          rendererRef.current.setSize(width, height);
        }
      }, 100);
    };
    
    // Add the resize event listener
    window.addEventListener('resize', handleResize);
    
    // Initial resize to make sure everything fits correctly
    handleResize();
    
    // Create a ResizeObserver to detect changes in the container's dimensions
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) {
          handleResize();
        }
      }
    });
    
    // Observe the container
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    // Clean up
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (resizeObserver && containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
        resizeObserver.disconnect();
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose geometries and materials
      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        if (meshRef.current.material instanceof THREE.Material) {
          meshRef.current.material.dispose();
        }
      }

      // Clean up bubbles with proper checks
      if (bubblesRef.current) {
        bubblesRef.current.children.forEach(bubble => {
          if (bubble instanceof THREE.Mesh) {
            bubble.geometry.dispose();
            if (bubble.material instanceof THREE.Material) {
              bubble.material.dispose();
            }
          }
        });
      }
      
      // Clear timeout if it exists
      if (resizeTimeoutId) {
        window.clearTimeout(resizeTimeoutId);
      }
    };
  }, [animationType, color, productColor, productType]);

  // Create bubble particles
  function createBubbles(color: string) {
    const group = new THREE.Group();
    const bubbleCount = 20; // Reduced from 100 to 20 for better performance
    
    // Create bubble material with adjusted transparency and refraction
    const bubbleMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color).offsetHSL(0, 0, 0.2), // Lighter version of main color
      transparent: true,
      opacity: 0.6,
      metalness: 0.1,
      roughness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transmission: 0.95, // Very transparent
      ior: 1.3, // Realistic refraction index for soap bubbles
      side: THREE.DoubleSide,
    });
    
    // Create multiple bubbles with varying sizes
    for (let i = 0; i < bubbleCount; i++) {
      const size = THREE.MathUtils.randFloat(0.05, 0.25); // Slightly larger bubbles since we have fewer
      const detail = Math.floor(size * 50) + 8; // Higher detail for larger bubbles
      const geometry = new THREE.SphereGeometry(size, detail, detail);
      
      const bubble = new THREE.Mesh(geometry, bubbleMaterial);
      
      // Random starting positions within and around the main liquid
      // Use smaller radius to start bubbles closer to center
      const radius = THREE.MathUtils.randFloat(0.5, 1.0);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      bubble.position.x = radius * Math.sin(phi) * Math.cos(theta);
      bubble.position.y = radius * Math.sin(phi) * Math.sin(theta);
      bubble.position.z = radius * Math.cos(phi);
      
      // Store original position and random speed
      bubble.userData.originalPos = bubble.position.clone();
      bubble.userData.speed = THREE.MathUtils.randFloat(0.3, 1.0); // Slightly faster speed range
      bubble.userData.offset = Math.random() * Math.PI * 2; // Phase offset
      bubble.userData.outwardDirection = new THREE.Vector3(
        bubble.position.x,
        bubble.position.y,
        bubble.position.z
      ).normalize();
      bubble.userData.maxDistance = THREE.MathUtils.randFloat(2.0, 4.0); // Increased max distance for better visibility
      bubble.userData.initialDistance = bubble.position.length();
      bubble.userData.timeActive = 0; // Track how long the bubble has been active
      
      group.add(bubble);
    }
    
    return group;
  }
  
  // Update bubble positions
  function updateBubbles(time: number) {
    if (!bubblesRef.current || !meshRef.current) return;

    bubblesRef.current.children.forEach((bubble, i) => {
      if (!(bubble instanceof THREE.Mesh)) return;

      const originalPos = bubble.userData.originalPos as THREE.Vector3;
      const speed = bubble.userData.speed as number;
      const offset = bubble.userData.offset as number;
      const outwardDirection = bubble.userData.outwardDirection as THREE.Vector3;
      const maxDistance = bubble.userData.maxDistance as number;
      const initialDistance = bubble.userData.initialDistance as number;

      // Increment time active
      bubble.userData.timeActive = (bubble.userData.timeActive || 0) + 0.016; // Roughly 60fps

      // Time-based movement outward
      const outwardFactor = bubble.userData.timeActive * speed * 0.1;

      // Bobbing motion - each bubble moves on its own path
      const factor = time * speed + offset;

      // Unique bubble movement based on noise
      const nx = originalPos.x * 0.1;
      const ny = originalPos.y * 0.1;
      const nz = originalPos.z * 0.1 + time * 0.05;

      const noise = noiseRef.current ? noiseRef.current.noise3d(nx, ny, nz) : 0;

      // Combined movement: original position + outward direction + bobbing + noise
      const outwardMovement = outwardDirection.clone().multiplyScalar(outwardFactor);

      // Reset bubble position if it goes too far
      if (outwardFactor >= maxDistance - initialDistance) {
        // Reset to the original position
        bubble.position.copy(originalPos);

        // Recalculate outward direction with slight variation for visual diversity
        const newDirection = originalPos.clone().normalize();
        // Add slight randomization to direction for variety
        newDirection.x += (Math.random() - 0.5) * 0.2;
        newDirection.y += (Math.random() - 0.5) * 0.2;
        newDirection.z += (Math.random() - 0.5) * 0.2;
        bubble.userData.outwardDirection = newDirection.normalize();

        // Reset tracking time
        bubble.userData.timeActive = 0;

        // Randomize phase offset and speed for variety
        bubble.userData.offset = Math.random() * Math.PI * 2;
        bubble.userData.speed = THREE.MathUtils.randFloat(0.3, 1.0);
        
        // Reset opacity to full for continuous cycle
        if (bubble.material instanceof THREE.MeshPhysicalMaterial) {
          bubble.material.opacity = 0.6;
          bubble.material.needsUpdate = true;
        }
      } else {
        // Normal movement
        bubble.position.x = originalPos.x + outwardMovement.x + Math.sin(factor) * 0.1 + noise * 0.1;
        bubble.position.y = originalPos.y + outwardMovement.y + Math.sin(factor * 1.3) * 0.1 + noise * 0.1;
        bubble.position.z = originalPos.z + outwardMovement.z + Math.sin(factor * 0.7) * 0.1 + noise * 0.1;

        // Fade out opacity as bubbles reach their destination
        const normalizedDistance = outwardFactor / (maxDistance - initialDistance);
        if (normalizedDistance > 0.7 && bubble.material instanceof THREE.MathPhysicalMaterial) {
          // Gradually reduce opacity in the last 30% of journey
          bubble.material.opacity = 0.6 * (1 - ((normalizedDistance - 0.7) / 0.3));
          bubble.material.needsUpdate = true;
        }
      }

      // Scale pulse effect
      const scale = 1 + Math.sin(time * 2 + i) * 0.05;
      bubble.scale.set(scale, scale, scale);
    });
    
    // Create new bubbles continuously to maintain a constant stream
    if (time % 2 < 0.016 && bubblesRef.current.children.length < 20) {  // Add new bubbles roughly every 2 seconds if below count
      addNewBubble();
    }
  }

  // Helper function to add new bubbles to the scene
  function addNewBubble() {
    if (!bubblesRef.current || !meshRef.current) return;
    
    const color = meshRef.current.material instanceof THREE.MeshPhysicalMaterial 
      ? meshRef.current.material.color.getHex() 
      : 0x33C3F0;
      
    // Create bubble material with adjusted transparency and refraction
    const bubbleMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color).offsetHSL(0, 0, 0.2), // Lighter version of main color
      transparent: true,
      opacity: 0.6,
      metalness: 0.1,
      roughness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transmission: 0.95,
      ior: 1.3,
      side: THREE.DoubleSide,
    });
    
    // Create a new bubble
    const size = THREE.MathUtils.randFloat(0.05, 0.25);
    const detail = Math.floor(size * 50) + 8;
    const geometry = new THREE.SphereGeometry(size, detail, detail);
    
    const bubble = new THREE.Mesh(geometry, bubbleMaterial);
    
    // Random starting position within the main liquid
    const radius = THREE.MathUtils.randFloat(0.5, 0.8); // Start closer to center
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    bubble.position.x = radius * Math.sin(phi) * Math.cos(theta);
    bubble.position.y = radius * Math.sin(phi) * Math.sin(theta);
    bubble.position.z = radius * Math.cos(phi);
    
    // Store original position and random properties
    bubble.userData.originalPos = bubble.position.clone();
    bubble.userData.speed = THREE.MathUtils.randFloat(0.3, 1.0);
    bubble.userData.offset = Math.random() * Math.PI * 2;
    bubble.userData.outwardDirection = new THREE.Vector3(
      bubble.position.x,
      bubble.position.y,
      bubble.position.z
    ).normalize();
    bubble.userData.maxDistance = THREE.MathUtils.randFloat(2.0, 4.0);
    bubble.userData.initialDistance = bubble.position.length();
    bubble.userData.timeActive = 0;
    
    bubblesRef.current.add(bubble);
  }

  // Updated function to handle animation with mouse position
  function updateAnimation(time: number, mousePos: {x: number, y: number} = {x: 0, y: 0}) {
    if (!meshRef.current) return;

    // Apply rotation based on mouse position
    const targetRotationX = (mousePos.y * 0.4); // Increased responsiveness
    const targetRotationY = (-mousePos.x * 0.4);
    
    // Smooth rotation towards mouse position - faster response
    meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.1;
    meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.1;
    
    // Apply cursor-influenced distortion
    applyMouseDistortion(mousePos);
    
    // Apply animation based on type
    if (animationType === 'bubble') {
      applyBubbleAnimation(time, mousePos);
    } else {
      applyTypedAnimation(time, mousePos);
    }
  }

  // New bubble animation function
  function applyBubbleAnimation(time: number, mousePos: {x: number, y: number}) {
    if (!meshRef.current || !initialGeometryRef.current) return;
    
    const positions = meshRef.current.geometry.attributes.position;
    const initialPositions = initialGeometryRef.current.attributes.position;
    
    if (!positions || !initialPositions || positions.count !== initialPositions.count) return;
    
    // Mouse influence factor
    const mouseInfluence = Math.sqrt(mousePos.x * mousePos.x + mousePos.y * mousePos.y) * 0.8;
    
    // Make sure both attributes are BufferAttribute instances
    if (positions instanceof THREE.BufferAttribute && initialPositions instanceof THREE.BufferAttribute) {
      for (let i = 0; i < positions.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(initialPositions, i);
        
        // Get vertex direction for spherical deformation
        const vertexDir = vertex.clone().normalize();
        
        // Use noise for organic, flowing wave patterns
        const nx = vertexDir.x * 3;
        const ny = vertexDir.y * 3;
        const nz = vertexDir.z * 3 + time * 0.5;
        
        // Add dynamic, flowing noise-based displacement
        const noise = noiseRef.current ? noiseRef.current.noise3d(nx, ny, nz) : 0;
        
        // Combine multiple wave patterns at different frequencies
        const waveX1 = 0.08 * Math.sin(vertexDir.x * 8 + time * 1.5);
        const waveY1 = 0.08 * Math.sin(vertexDir.y * 8 + time * 1.2);
        
        // Get mouse influence direction
        const mouseDir = new THREE.Vector3(mousePos.x, mousePos.y, 0).normalize();
        const mouseEffect = Math.pow(Math.max(0, vertexDir.dot(mouseDir) + 0.5), 2) * 0.15 * mouseInfluence;
        
        // Combine all effects with noise
        const totalDisplacement = 0.12 + noise * 0.1 + waveX1 + waveY1 + mouseEffect;
        
        // Apply displacement along normal
        vertex.x += vertexDir.x * totalDisplacement;
        vertex.y += vertexDir.y * totalDisplacement;
        vertex.z += vertexDir.z * totalDisplacement;
        
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      
      positions.needsUpdate = true;
      
      // Gentle overall movement
      meshRef.current.position.y = Math.sin(time * 0.6) * 0.06;
    }
  }

  // Enhanced function to apply mouse-based distortion to the mesh vertices
  function applyMouseDistortion(mousePos: {x: number, y: number}) {
    if (!meshRef.current || !initialGeometryRef.current || animationType === 'bubble') return;
    
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
        const mouseInfluenceX = mousePos.x * 0.05;
        const mouseInfluenceY = mousePos.y * 0.05;
        
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
      const amplitudeFactor = 0.12 + (mouseInfluence * 0.08); 
      const speedFactor = 2.5 + (mouseInfluence * 2.0); 
      
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
