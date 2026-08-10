import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface JerseyModelProps {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  playerName: string;
  playerNumber: string;
  teamName: string;
  style: string;
  fabric: string;
}

export default function JerseyModel({ 
  primaryColor, 
  secondaryColor, 
  tertiaryColor,
  playerName, 
  playerNumber, 
  teamName,
  style,
  fabric 
}: JerseyModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // A basketball jersey has a more flat, elongated torso.
  // We'll construct it using a slightly squashed cylinder for the body
  // and cutouts for the neck and arms using simple shapes if possible,
  // or just multiple merged simple shapes.

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.05 - 0.5;
    }
  });

  return (
    <group ref={groupRef} dispose={null} position={[0, -0.5, 0]}>
      
      {/* 
        BASKETBALL TANK TOP 
        We use three adjacent flat cylinders to mimic the "Triple" design in the screenshot.
        Left: White, Center: Blue, Right: Dark Blue
      */}

      {/* Left Panel (White) */}
      <mesh position={[-0.85, 1.5, 0]} scale={[0.8, 1.1, 0.4]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 5, 32, 1, false, Math.PI, Math.PI]} />
        <meshStandardMaterial color={secondaryColor} roughness={0.8} />
      </mesh>
      <mesh position={[-0.85, 1.5, 0]} scale={[0.8, 1.1, 0.4]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 5, 32, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color={secondaryColor} roughness={0.8} />
      </mesh>

      {/* Center Panel (Blue) */}
      <mesh position={[0, 1.5, 0.42]} scale={[0.85, 1.1, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[2, 5, 1]} />
        <meshStandardMaterial color={primaryColor} roughness={0.8} />
      </mesh>
      {/* Center Back Panel */}
      <mesh position={[0, 1.5, -0.42]} scale={[0.85, 1.1, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[2, 5, 1]} />
        <meshStandardMaterial color={primaryColor} roughness={0.8} />
      </mesh>

      {/* Right Panel (Dark Blue) */}
      <mesh position={[0.85, 1.5, 0]} scale={[0.8, 1.1, 0.4]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 5, 32, 1, false, Math.PI, Math.PI]} />
        <meshStandardMaterial color={tertiaryColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.85, 1.5, 0]} scale={[0.8, 1.1, 0.4]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 5, 32, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color={tertiaryColor} roughness={0.8} />
      </mesh>

      {/* Collar/Shoulder Straps (Tank top) */}
      <mesh position={[-1.1, 4.25, 0]} scale={[0.4, 0.1, 0.4]} castShadow>
        <cylinderGeometry args={[1, 1, 1, 16]} />
        <meshStandardMaterial color={secondaryColor} roughness={0.8} />
      </mesh>
      <mesh position={[1.1, 4.25, 0]} scale={[0.4, 0.1, 0.4]} castShadow>
        <cylinderGeometry args={[1, 1, 1, 16]} />
        <meshStandardMaterial color={tertiaryColor} roughness={0.8} />
      </mesh>
      
      {/* Top Hem / Neckline trimming */}
      <mesh position={[0, 4.15, 0.4]} scale={[1, 0.05, 0.1]}>
        <boxGeometry args={[2, 1, 1]} />
        <meshStandardMaterial color={tertiaryColor} roughness={0.8} />
      </mesh>

      {/* TEXT DECALS */}
      
      {/* Front: Logo Placeholder (owayo equivalent) */}
      <Text
        position={[0, 3.4, 0.5]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight={800}
      >
        owayo
      </Text>

      {/* Front: Team Name */}
      <Text
        position={[0, 2.5, 0.5]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf"
        fontWeight={900}
      >
        {teamName || "OWAYO"}
      </Text>
      
      {/* Back: Player Name */}
      <Text
        position={[0, 2.8, -0.5]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight={800}
        letterSpacing={0.1}
      >
        {playerName || "PLAYER"}
      </Text>

      {/* Back: Player Number */}
      <Text
        position={[0, 1.5, -0.5]}
        rotation={[0, Math.PI, 0]}
        fontSize={1.6}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
      >
        {playerNumber || "00"}
      </Text>

    </group>
  );
}
