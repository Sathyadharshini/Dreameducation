import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

function Model({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  const transform = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3(); const size = new THREE.Vector3();
    box.getCenter(center); box.getSize(size);
    const max = Math.max(size.x, size.y, size.z);
    const scale = max > 0 ? 3 / max : 1;
    return { scale, position: [-center.x * scale, -center.y * scale, -center.z * scale] as [number, number, number] };
  }, [scene]);
  return <primitive object={scene} scale={transform.scale} position={transform.position} />;
}

export default function ModelViewer({ modelPath }: { modelPath: string }) {
  return <div className="w-full h-[500px] overflow-hidden rounded-2xl bg-slate-900">
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={1.5} /><directionalLight position={[5, 5, 5]} intensity={2} />
      <Environment preset="studio" /><Model modelPath={modelPath} /><OrbitControls enablePan enableZoom enableRotate />
    </Canvas>
  </div>;
}
