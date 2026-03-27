import React, { Component, Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { create } from 'zustand';
import { useMascotStore } from "../stores/useMascotStore";

// Error boundary
class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// 2. Chú cún Voxel được thiết kế lại đẹp mắt theo tone màu PETCare
function StyledVoxelDog(props) {
  const group = useRef();
  const headRef = useRef();
  const tailRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const isWagging = useMascotStore((state) => state.isWagging);
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
    // Đầu cún nhìn theo chuột (Lerping mượt mà)
    if (headRef.current) {
      // Bù trừ góc quay của body (-Math.PI / 5) để đầu luôn hướng đúng về chuột
      const bodyRotationY = -Math.PI / 5;
      const targetX = Math.atan2(mouse.current.x, 600) - bodyRotationY;
      const targetY = Math.atan2(mouse.current.y, 600);
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetX, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetY, 0.08);
    }

    // Logic nhảy lên khi ấn Add to cart / Book
    const baseY = props.position ? props.position[1] : 0;
    if (isJumping) {
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, baseY + Math.abs(Math.sin(state.clock.elapsedTime * 15)) * 0.5, 0.2);
    } else {
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, baseY, 0.2);
    }

    // Logic vẫy đuôi
    if (tailRef.current) {
      if (isWagging) {
        // Quẩy đuôi nhanh khi có event
        tailRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 25) * 0.4;
      } else {
        // Vẫy đuôi nhẹ nhàng lơ đãng khi đứng yên
        tailRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.05;
      }
    }
  });

  return (
    <group ref={group} {...props}>
      {/* Thân cún (Ivory White - #F9F9F9) */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.9, 0.8, 1.4]} />
        <meshStandardMaterial color="#F9F9F9" roughness={0.6} />
      </mesh>

      {/* Bụng cún (Sand Beige - #EDF1D6) */}
      <mesh position={[0, -0.3, 0.05]}>
        <boxGeometry args={[0.92, 0.6, 1.3]} />
        <meshStandardMaterial color="#EDF1D6" roughness={0.8} />
      </mesh>

      {/* Vòng cổ (Light Earth Orange - #E49393) */}
      <mesh position={[0, 0.25, 0.6]}>
        <boxGeometry args={[0.7, 0.15, 0.7]} />
        <meshStandardMaterial color="#E49393" roughness={0.4} />
      </mesh>

      {/* Trục đầu cún (Di chuyển theo chuột) */}
      <group ref={headRef} position={[0, 0.6, 0.7]}>
        {/* Khối đầu */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.85, 0.8, 0.8]} />
          <meshStandardMaterial color="#F9F9F9" roughness={0.6} />
        </mesh>
        
        {/* Mõm (Sand Beige - #EDF1D6) */}
        <mesh position={[0, -0.1, 0.45]}>
          <boxGeometry args={[0.5, 0.35, 0.4]} />
          <meshStandardMaterial color="#EDF1D6" roughness={0.7} />
        </mesh>
        
        {/* Mũi (Đen) */}
        <mesh position={[0, 0.05, 0.66]}>
          <boxGeometry args={[0.15, 0.1, 0.1]} />
          <meshStandardMaterial color="#222222" roughness={0.5} />
        </mesh>
        
        {/* Mắt (Đen) */}
        <mesh position={[-0.25, 0.15, 0.41]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        <mesh position={[0.25, 0.15, 0.41]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#222222" />
        </mesh>

        {/* Tai cún (Sage Green - #9DC08B) */}
        <mesh position={[-0.4, 0.35, -0.1]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.2, 0.4, 0.3]} />
          <meshStandardMaterial color="#9DC08B" roughness={0.8} />
        </mesh>
        <mesh position={[0.4, 0.35, -0.1]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.2, 0.4, 0.3]} />
          <meshStandardMaterial color="#9DC08B" roughness={0.8} />
        </mesh>
      </group>

      {/* 4 Chân (Ivory White) */}
      <mesh position={[-0.25, -0.7, 0.5]}><boxGeometry args={[0.25, 0.5, 0.25]} /><meshStandardMaterial color="#F9F9F9" /></mesh>
      <mesh position={[0.25, -0.7, 0.5]}><boxGeometry args={[0.25, 0.5, 0.25]} /><meshStandardMaterial color="#F9F9F9" /></mesh>
      <mesh position={[-0.25, -0.7, -0.5]}><boxGeometry args={[0.25, 0.5, 0.25]} /><meshStandardMaterial color="#F9F9F9" /></mesh>
      <mesh position={[0.25, -0.7, -0.5]}><boxGeometry args={[0.25, 0.5, 0.25]} /><meshStandardMaterial color="#F9F9F9" /></mesh>

      {/* Trục Đuôi cún (Xoay khi được trigger) */}
      <group position={[0, 0.1, -0.7]} ref={tailRef}>
        <mesh position={[0, 0.25, -0.1]} rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[0.15, 0.6, 0.15]} />
          {/* Đuôi màu Xanh xô thơm */}
          <meshStandardMaterial color="#9DC08B" roughness={0.6} /> 
        </mesh>
      </group>
    </group>
  );
}

// 3. Xử lý logic nếu bạn có file GLB thật
function DogModel(props) {
  const group = useRef();
  const { scene, animations } = useGLTF('/dog_model.glb');
  const { actions, names } = useAnimations(animations, group);
  const mouse = useRef({ x: 0, y: 0 });
  const isWagging = useMascotStore((state) => state.isWagging);
  const isJumping = useMascotStore((state) => state.isJumping);

  useEffect(() => {
    // Logic mix animation nếu bạn có file GLB
    const wagName = names.find(n => n.toLowerCase().includes('wag'));
    const idleName = names.find(n => n.toLowerCase().includes('idle')) || names[0];
    
    if (isWagging && wagName && actions[wagName]) {
      if (idleName && actions[idleName]) actions[idleName].stop();
      actions[wagName].reset().fadeIn(0.2).play();
    } else if (idleName && actions[idleName]) {
      if (wagName && actions[wagName]) actions[wagName].stop();
      actions[idleName].reset().fadeIn(0.2).play();
    }
  }, [isWagging, actions, names]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const center = props.getCenter();
      mouse.current.x = event.clientX - center.x;
      mouse.current.y = event.clientY - center.y;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [props]);

  useFrame(() => {
    if (!group.current) return;
    const bodyRotationY = -Math.PI / 5;
    const targetX = Math.atan2(mouse.current.x, 600) - bodyRotationY;
    const targetY = Math.atan2(mouse.current.y, 600);

    const head = scene.getObjectByName('Head') || scene.getObjectByName('Neck');
    if (head) {
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, targetX, 0.08);
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, targetY, 0.08);
    } else {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, 0.05);
    }
    
    // Logic nhảy lên
    const baseY = props.position ? props.position[1] : 0;
    if (isJumping) {
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, baseY + Math.abs(Math.sin(state.clock.elapsedTime * 15)) * 0.5, 0.2);
    } else {
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, baseY, 0.2);
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

export default function InteractiveMascot() {
  const containerRef = useRef();

  // Helper to get dynamic center for tracking
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
      className="fixed bottom-4 right-4 w-[220px] h-[260px] md:w-[260px] md:h-[300px] lg:w-[300px] lg:h-[350px] z-9999 pointer-events-none hidden sm:block"
    >
      <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight position={[0, 2, 5]} intensity={2.0} color="#ffffff" />
        <spotLight position={[5, 10, 5]} intensity={3.5} angle={0.5} color="#9DC08B" castShadow />
        <spotLight position={[-5, 5, -5]} intensity={2.5} angle={0.5} color="#EDF1D6" />
        
        {/* Xoay ngang sang trái (rotation=[0, -Math.PI / 5, 0]) */}
        <ErrorBoundary fallback={<StyledVoxelDog getCenter={getMascotCenter} position={[0, -0.8, 0]} scale={1.2} rotation={[0, -Math.PI / 5, 0]} />}>
          <Suspense fallback={<StyledVoxelDog getCenter={getMascotCenter} position={[0, -0.8, 0]} scale={1.2} rotation={[0, -Math.PI / 5, 0]} />}>
            <DogModel getCenter={getMascotCenter} position={[0, -0.8, 0]} scale={1.2} rotation={[0, -Math.PI / 5, 0]} />
          </Suspense>
        </ErrorBoundary>
      </Canvas>
    </div>
  );
}

try {
  useGLTF.preload('/dog_model.glb');
} catch (e) {}