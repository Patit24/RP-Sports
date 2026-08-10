import { Environment, Lightformer, ContactShadows } from "@react-three/drei";

export default function StadiumEnvironment({ preset = "stadium" }: { preset?: string }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={2.5} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-10, 10, -10]} intensity={1.5} color="#00e5ff" />
      <directionalLight position={[0, -10, 0]} intensity={0.5} color="#0e0e12" />
      
      {/* Stadium/Studio HDRI lighting */}
      <Environment preset="city" resolution={256} background={false}>
        <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
        <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} />
        <Lightformer rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 0.5, 1]} />
        <Lightformer rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 1, 1]} />
      </Environment>

      {/* Ground Contact Shadow */}
      <ContactShadows
        resolution={1024}
        scale={20}
        blur={2}
        opacity={0.5}
        far={10}
        color="#000000"
        position={[0, -2.5, 0]}
      />
    </>
  );
}
