import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMascotStore } from "../stores/useMascotStore.ts";

// 1. Redesigned Voxel Dog with PETCare color palette
function StyledVoxelDog(props) {
  const group = useRef();
  const headRef = useRef();
  const tailRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const isJumping = useMascotStore((state) => state.isJumping);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const center = props.getCenter();
      mouse.current.x = event.clientX - center.x;
      mouse.current.y = event.clientY - center.y;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [props]);

  useFrame((state) => {
    // Smooth head movement following mouse
    if (headRef.current) {
      const bodyRotationY = -Math.PI / 5;
      const targetX = Math.atan2(mouse.current.x, 600) - bodyRotationY;
      const targetY = Math.atan2(mouse.current.y, 600);
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetX, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetY, 0.08);
    }

    // Jumping animation logic
    const baseY = props.position ? props.position[1] : 0;
    if (isJumping) {
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, baseY + Math.abs(Math.sin(state.clock.elapsedTime * 15)) * 0.5, 0.2);
    } else {
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, baseY, 0.2);
    }

    // Tail wagging logic - Always wags unless jumping (which is faster)
    if (tailRef.current) {
      const speed = isJumping ? 25 : 15;
      const amplitude = isJumping ? 0.4 : 0.3;
      tailRef.current.rotation.z = Math.sin(state.clock.elapsedTime * speed) * amplitude;
    }
  });

  return (
    <group ref={group} {...props}>
      {/* Dog Body (Ivory White - #F9F9F9) */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.9, 0.8, 1.4]} />
        <meshStandardMaterial color="#F9F9F9" roughness={0.6} />
      </mesh>

      {/* Dog Belly (Sand Beige - #EDF1D6) */}
      <mesh position={[0, -0.3, 0.05]}>
        <boxGeometry args={[0.92, 0.6, 1.3]} />
        <meshStandardMaterial color="#EDF1D6" roughness={0.8} />
      </mesh>

      {/* Dog Collar (Light Earth Orange - #E49393) */}
      <mesh position={[0, 0.25, 0.6]}>
        <boxGeometry args={[0.7, 0.15, 0.7]} />
        <meshStandardMaterial color="#E49393" roughness={0.4} />
      </mesh>

      {/* Dog Head Axis */}
      <group ref={headRef} position={[0, 0.6, 0.7]}>
        {/* Head Block */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.85, 0.8, 0.8]} />
          <meshStandardMaterial color="#F9F9F9" roughness={0.6} />
        </mesh>
        
        {/* Muzzle (Sand Beige - #EDF1D6) */}
        <mesh position={[0, -0.1, 0.45]}>
          <boxGeometry args={[0.5, 0.35, 0.4]} />
          <meshStandardMaterial color="#EDF1D6" roughness={0.7} />
        </mesh>
        
        {/* Nose (Black) */}
        <mesh position={[0, 0.05, 0.66]}>
          <boxGeometry args={[0.15, 0.1, 0.1]} />
          <meshStandardMaterial color="#222222" roughness={0.5} />
        </mesh>
        
        {/* Eyes (Black) */}
        <mesh position={[-0.25, 0.15, 0.41]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        <mesh position={[0.25, 0.15, 0.41]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#222222" />
        </mesh>

        {/* Dog Ears (Sage Green - #9DC08B) */}
        <mesh position={[-0.4, 0.35, -0.1]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.2, 0.4, 0.3]} />
          <meshStandardMaterial color="#9DC08B" roughness={0.8} />
        </mesh>
        <mesh position={[0.4, 0.35, -0.1]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.2, 0.4, 0.3]} />
          <meshStandardMaterial color="#9DC08B" roughness={0.8} />
        </mesh>
      </group>

      {/* 4 Legs (Ivory White) */}
      <mesh position={[-0.25, -0.7, 0.5]}><boxGeometry args={[0.25, 0.5, 0.25]} /><meshStandardMaterial color="#F9F9F9" /></mesh>
      <mesh position={[0.25, -0.7, 0.5]}><boxGeometry args={[0.25, 0.5, 0.25]} /><meshStandardMaterial color="#F9F9F9" /></mesh>
      <mesh position={[-0.25, -0.7, -0.5]}><boxGeometry args={[0.25, 0.5, 0.25]} /><meshStandardMaterial color="#F9F9F9" /></mesh>
      <mesh position={[0.25, -0.7, -0.5]}><boxGeometry args={[0.25, 0.5, 0.25]} /><meshStandardMaterial color="#F9F9F9" /></mesh>

      {/* Dog Tail Axis */}
      <group position={[0, 0.1, -0.7]} ref={tailRef}>
        <mesh position={[0, 0.25, -0.1]} rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[0.15, 0.6, 0.15]} />
          <meshStandardMaterial color="#9DC08B" roughness={0.6} /> 
        </mesh>
      </group>
    </group>
  );
}

export default function InteractiveMascot() {
  const containerRef = useRef();

  const getMascotCenter = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
    return { x: 166, y: window.innerHeight - 191 };
  };

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-4 right-4 w-[220px] h-[260px] md:w-[260px] md:h-[300px] lg:w-[300px] lg:h-[350px] z-40 pointer-events-none hidden sm:block"
    >
      <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight position={[0, 2, 5]} intensity={2.0} color="#ffffff" />
        <spotLight position={[5, 10, 5]} intensity={3.5} angle={0.5} color="#9DC08B" castShadow />
        <spotLight position={[-5, 5, -5]} intensity={2.5} angle={0.5} color="#EDF1D6" />
        
        <StyledVoxelDog 
          getCenter={getMascotCenter} 
          position={[0, -0.8, 0]} 
          scale={1.2} 
          rotation={[0, -Math.PI / 5, 0]} 
        />
      </Canvas>
    </div>
  );
}