import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef } from "react";

interface CameraRigProps {
  view: "front" | "back" | "left" | "right" | "zoom";
}

export default function CameraRig({ view }: CameraRigProps) {
  const { camera, size } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 8));
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    // Adjust camera target positions based on requested view
    switch (view) {
      case "front":
        targetPosition.current.set(0, 0, 8);
        lookAtTarget.current.set(0, 0, 0);
        break;
      case "back":
        targetPosition.current.set(0, 0, -8);
        lookAtTarget.current.set(0, 0, 0);
        break;
      case "left":
        targetPosition.current.set(-8, 0, 0);
        lookAtTarget.current.set(0, 0, 0);
        break;
      case "right":
        targetPosition.current.set(8, 0, 0);
        lookAtTarget.current.set(0, 0, 0);
        break;
      case "zoom":
        targetPosition.current.set(0, 3, 4); // Close up on chest
        lookAtTarget.current.set(0, 2, 0);
        break;
      default:
        targetPosition.current.set(0, 0, 8);
    }
    
    // Adjust for mobile aspect ratio
    if (size.width < 768) {
       targetPosition.current.multiplyScalar(1.5);
    }
  }, [view, size.width]);

  useFrame((state, delta) => {
    // Smoothly animate camera position
    state.camera.position.lerp(targetPosition.current, delta * 3);
    
    // Smoothly animate look-at target
    const currentLookAt = new THREE.Vector3(0,0,0);
    // Ideally we track the current lookAt, but for simplicity we force it to target or lerp it.
    // ThreeJS camera.lookAt doesn't lerp natively easily without quaternions.
    // We will use a dummy object to lerp lookAt.
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
