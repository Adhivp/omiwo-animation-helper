
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
  const requestRef = useRef<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const initialGeometryRef = useRef<THREE.BufferGeometry | null>(null);

  // Get product-specific color
  const getProductColor = (): string => {
    if (productType === 'toiletCleaner') return '#1e3a8a'; // Dark blue for toilet cleaner
    if (productType === 'detergent') return '#3b82f6'; // Blue for detergent
    if (productType === 'handWash') return '#06b6d4'; // Turquoise for hand wash (matches image)
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
      
      // Enhanced cursor interaction effect - more responsive
      if (isHovered && meshRef.current) {
        // More direct and responsive cursor control
        meshRef.current.rotation.x += (mousePosition.y * 0.05 - meshRef.current.rotation.x) * 0.1;
        meshRef.current.rotation.y += (mousePosition.x * 0.05 - meshRef.current.rotation.y) * 0.1;
        
        // Add some displacement based on cursor position
        if (meshRef.current.geometry.attributes.position) {
          const positions = meshRef.current.geometry.attributes.position;
          const initialPositions = initialGeometryRef.current?.attributes.position;
          
          if (positions && initialPositions && positions.count === initialPositions.count) {
            for (let i = 0; i < positions.count; i++) {
              const vertex = new THREE.Vector3();
              vertex.fromBufferAttribute(initialPositions, i);
              
              // Add cursor-based distortion
              const distanceX = Math.abs(vertex.x - mousePosition.x * 0.5);
              const distanceY = Math.abs(vertex.y - mousePosition.y * 0.5);
              const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
              
              // Create a ripple effect centered around cursor position
              const displacement = Math.max(0, 0.2 - distance) * 0.3;
              
              vertex.x += vertex.x * displacement;
              vertex.y += vertex.y * displacement;
              vertex.z += vertex.z * displacement;
              
              positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
            }
            
            positions.needsUpdate = true;
          }
        }
      } else {
        // Gentle rotation when not hovered
        meshRef.current.rotation.y += 0.002;
        meshRef.current.rotation.x += 0.001;
      }
      
      // Apply animation based on type
      if (animationType === 'wave') {
        // Enhanced wave animation
        const positions = (meshRef.current.geometry as THREE.BufferGeometry).attributes.position;
        const initialPositions = initialGeometryRef.current?.attributes.position;
        
        if (positions && initialPositions && positions.count === initialPositions.count) {
          for (let i = 0; i < positions.count; i++) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(initialPositions, i);
            
            // More complex wave pattern with product-specific variations
            const waveX = 0.06 * Math.sin(vertex.x * 8 + time * 2);
            const waveY = 0.06 * Math.sin(vertex.y * 8 + time * 2.5);
            const waveZ = 0.06 * Math.sin(vertex.z * 8 + time * 3);
            
            vertex.x += waveX;
            vertex.y += waveY;
            vertex.z += waveZ;
            
            positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
          }
          
          positions.needsUpdate = true;
        }

        // Gentle bobbing motion
        mesh.position.y = Math.sin(time * 0.5) * 0.05;
        
      } else if (animationType === 'ripple') {
        // Improved ripple animation
        const positions = (meshRef.current.geometry as THREE.BufferGeometry).attributes.position;
        const initialPositions = initialGeometryRef.current?.attributes.position;
        
        if (positions && initialPositions && positions.count === initialPositions.count) {
          for (let i = 0; i < positions.count; i++) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(initialPositions, i);
            
            // Create outward rippling effect
            const angle = Math.atan2(vertex.y, vertex.x);
            const dist = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y);
            const rippleFactor = 0.05 * Math.sin(dist * 10 - time * 4);
            
            // Apply ripple along the normal direction
            vertex.x += rippleFactor * Math.cos(angle);
            vertex.y += rippleFactor * Math.sin(angle);
            vertex.z += rippleFactor * 0.5;
            
            positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
          }
          
          positions.needsUpdate = true;
        }
        
        // Add rotation
        mesh.rotation.z = time * 0.2;
        
      } else if (animationType === 'pour') {
        // Improved pouring liquid animation
        const positions = (meshRef.current.geometry as THREE.BufferGeometry).attributes.position;
        const initialPositions = initialGeometryRef.current?.attributes.position;
        
        if (positions && initialPositions && positions.count === initialPositions.count) {
          // Create a more realistic pouring effect
          for (let i = 0; i < positions.count; i++) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(initialPositions, i);
            
            // Bottom vertices move more (dripping effect)
            if (vertex.y < -0.2) {
              // More pronounced dripping at the bottom
              const distFromCenter = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);
              const dropFactor = 0.1 * Math.sin(distFromCenter * 10 + time * 5);
              vertex.y -= Math.max(0, 0.1 * Math.sin(time * 3) * (vertex.y + 0.7)) + dropFactor * 0.1;
              
              // Add horizontal movement to simulate liquid flow
              vertex.x += 0.02 * Math.sin(time * 4 + vertex.y * 10);
              vertex.z += 0.02 * Math.cos(time * 3 + vertex.y * 10);
            }
            
            positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
          }
          
          positions.needsUpdate = true;
        }
        
        // Tilting motion like pouring
        mesh.rotation.x = Math.sin(time * 0.4) * 0.2;
        mesh.rotation.z = time * 0.1;
        
      } else { // flow animation
        // More dynamic flow animation
        const positions = (meshRef.current.geometry as THREE.BufferGeometry).attributes.position;
        const initialPositions = initialGeometryRef.current?.attributes.position;
        
        if (positions && initialPositions && positions.count === initialPositions.count) {
          for (let i = 0; i < positions.count; i++) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(initialPositions, i);
            const distance = vertex.length();
            
            // Create a more turbulent flow effect
            const noise1 = 0.12 * Math.sin(vertex.x * 5 + time * 2) * distance;
            const noise2 = 0.12 * Math.sin(vertex.y * 5 + time * 1.5) * distance;
            const noise3 = 0.12 * Math.sin(vertex.z * 5 + time * 2.5) * distance;
            
            vertex.x += noise1 + 0.02 * Math.sin(time * 3);
            vertex.y += noise2 + 0.02 * Math.cos(time * 2.5);
            vertex.z += noise3 + 0.02 * Math.sin(time * 3.5);
            
            positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
          }
          
          positions.needsUpdate = true;
        }
        
        // Slow rotation
        mesh.rotation.y = time * 0.2;
        mesh.rotation.z = time * 0.1;
      }
      
      // Render the scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Request next frame
      requestRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    requestRef.current = requestAnimationFrame(animate);
    
    // Enhanced mouse interactions - more responsive
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      // Normalize coordinates for more intuitive control
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      setMousePosition({ x, y });
    };
    
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePosition({ x: 0, y: 0 }); // Reset position when mouse leaves
    };
    
    // Add document-level mouse tracking for a more fluid experience
    document.addEventListener('mousemove', handleMouseMove);
    
    if (containerRef.current) {
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
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseenter', handleMouseEnter);
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      
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
  
  return <div ref={containerRef} className={`webgl-container ${className}`} />;
};

export default ThreeScene;
