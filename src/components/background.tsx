import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, RootState } from '@react-three/fiber'; // Import RootState
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {createNoise2D} from 'simplex-noise'
// --- Type Definitions ---
type ShapeType = 'box' | 'sphere' | 'cone'; // Use a union type for specific shapes

interface ShapeProps {
  position: [number, number, number]; // Or THREE.Vector3Tuple if preferred
  type: ShapeType;
  color: THREE.ColorRepresentation; // Use Three.js's type for colors
  sizeArgs: number[]; // Array of numbers for geometry arguments
}

interface ShapeData extends ShapeProps {
  id: number; // Add the unique ID
}

// --- Configuration ---
const SHAPE_COUNT: number = 100;
const SCATTER_RANGE: number = 18;

// --- Reusable Shape Component ---
function Shape({ position, type, color, sizeArgs }: ShapeProps){
  // Type the ref to hold a THREE.Mesh or null initially
  const meshRef = useRef<THREE.Mesh>(null);

  // Add types to useFrame callback parameters
  useFrame((state: RootState, delta: number) => {
    // Ensure meshRef.current exists before accessing properties
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      {/* Conditionally render geometry based on type */}
      {type === 'box' && <boxGeometry/>}
      {type === 'sphere' && <sphereGeometry/>}
      {type === 'cone' && <coneGeometry/>}
      {/* Add more shapes here if needed */}

      {/* Provide color prop type consistency */}
      <meshMatcapMaterial color={color} />
    </mesh>
  );
}

function Terrain() {
    const meshRef = useRef(null);
  
    // --- Terrain Parameters ---
    const terrainWidth = 100;
    const terrainDepth = 200; // Make it longer than wide for "into the distance" feel
    const widthSegments = 40; // Fewer segments = lower poly
    const depthSegments = 80; // More segments along the depth
    const terrainMaxHeight = 5; // Maximum height variation
    const noiseScale = 0.05; // How "zoomed in" the noise pattern is (smaller = larger features)
    const noiseSeed = 'your-seed-here'; // Use a seed for reproducible terrain
  
    // --- Generate Terrain Geometry ---
    const geometry = useMemo(() => {
      const simplex = createNoise2D(); // Initialize noise with the generator
      const geom = new THREE.PlaneGeometry(
        terrainWidth,
        terrainDepth,
        widthSegments,
        depthSegments
      );
  
      // Rotate plane to be horizontal
      geom.rotateX(-Math.PI / 2);
  
      const positions = geom.attributes.position;
  
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i); // Original Y becomes Z after rotation
  
        // Calculate height using simplex noise
        // Use x and z coordinates, scaled by noiseScale
        const height = simplex(x * noiseScale, z * noiseScale);
  
        // Apply height (map noise from [-1, 1] to [0, terrainMaxHeight])
        const normalizedHeight = (height + 1) / 2; // Map to [0, 1]
        positions.setY(i, normalizedHeight * terrainMaxHeight); // Set the Y (height) coordinate
      }
  
      // Important: Notify Three.js that vertex positions have changed
      positions.needsUpdate = true;
      // Optional: Recalculate normals if you ever switch to a lit material
      // geom.computeVertexNormals();
  
      return geom;
    }, [terrainWidth, terrainDepth, widthSegments, depthSegments, terrainMaxHeight, noiseScale, noiseSeed]); // Recalculate if params change
  
    return (
      <mesh ref={meshRef} geometry={geometry}>
        {/* Unlit wireframe material */}
        <meshBasicMaterial color="lime" wireframe={true} />
      </mesh>
    );
}

// --- Main Scene Component ---
function Scene(){
  // Explicitly type the return value of useMemo
  const shapes = useMemo<ShapeData[]>(() => {
    const data: ShapeData[] = []; // Type the array being built
    const types: ShapeType[] = ['box', 'sphere', 'cone']; // Type the possible shape types
    const colors: THREE.ColorRepresentation[] = [ // Use ColorRepresentation type
        "#37542C",
        "#C59F2B",
        "#D34E25",
        "#D0CFB7",
    ];

    for (let i = 0; i < SHAPE_COUNT; i++) {
      const type: ShapeType = types[Math.floor(Math.random() * types.length)];
      let sizeArgs: number[];

      switch (type) {
        case 'box':
          sizeArgs = [
            Math.random() * 0.2 + 0.2,
            Math.random() * 0.8 + 0.2,
            Math.random() * 0.5 + 0.2,
          ];
          break;
        case 'sphere':
          sizeArgs = [Math.random() * 0.6 + 0.1, 32, 16];
          break;
        case 'cone':
          sizeArgs = [Math.random() * 0.4 + 0.1, Math.random() * 1 + 0.3, 32];
          break;
        default:
           sizeArgs = [1]; // Fallback
           break;
      }

      data.push({
        id: i,
        position: [
          (Math.random() - 0.5) * SCATTER_RANGE,
          (Math.random() - 0.5) * SCATTER_RANGE,
          (Math.random() - 0.5) * SCATTER_RANGE,
        ],
        type: type,
        color: colors[Math.floor(Math.random() * colors.length)],
        sizeArgs: sizeArgs,
      });
    }
    return data;
  }, []); // Empty dependency array ensures this runs only on mount

  return (
    <>
      {/* --- Lighting --- */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 5]} intensity={1.5} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="lightblue" />

      {/* --- Shapes --- */}
      {shapes.map((shape) => (
        <Shape
          key={shape.id} // React key is still required
          position={shape.position}
          type={shape.type}
          color={shape.color}
          sizeArgs={shape.sizeArgs}
        />
      ))}
      {/* <Terrain></Terrain> */}
    </>
  );
}
export default Scene;