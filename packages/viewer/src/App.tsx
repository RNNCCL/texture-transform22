import React, { useRef, useState, Suspense, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import { Canvas, useLoader } from "@react-three/fiber";
import {
  useGLTF,
  Center,
  OrbitControls,
  Environment,
  Sphere,
} from "@react-three/drei";

import { TextureLoader } from "three/src/loaders/TextureLoader";

function App() {
  const [sceneBoundingRadius, setSceneBoundingRadius] = useState(1.0);

  const [materialName, setMaterialName] = useState("test");

  // If pressed key is our target key then set to true
  function downHandler({ key }: { key: string }) {
    switch (key) {
      case "1":
        setMaterialName("test");
        break;
      case "2":
        setMaterialName("alpha");
        break;
      case "3":
        setMaterialName("beta");
        break;
      case "4":
        setMaterialName("gamma");
        break;
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  const baseMap = useLoader(TextureLoader, `./${materialName}_base.jpg`);
  const metallicMap = useLoader(TextureLoader, `./${materialName}_metallic.jpg`);
  const roughnessMap = useLoader(TextureLoader, `./${materialName}_roughness.jpg`);

  const diffuseMap = useLoader(TextureLoader, `./${materialName}_diffuse.jpg`);
  const specularMap = useLoader(TextureLoader, `./${materialName}_specular.jpg`);
  const glossinessMap = useLoader(TextureLoader, `./${materialName}_glossiness.jpg`);

  return (
    <Canvas
      shadows
      eventSource={document.getElementById("root")!}
      eventPrefix="client"
    >
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.0}
        enableDamping={true}
        enableZoom={true}
        minDistance={sceneBoundingRadius}
        maxDistance={2 * sceneBoundingRadius}
      />

      <Center
        top
        onCentered={(props) => {
          console.log(
            "props.boundingSphere.radius",
            props.boundingSphere.radius
          );
          setSceneBoundingRadius( props.boundingSphere.radius );
        }}
      >
        <pointLight position={[0, 10, -10]} intensity={10} />
        <Sphere args={[1, 32, 32]} position={[-1, 0, 0]}>
          <meshStandardMaterial color="red"  map={baseMap} roughnessMap={roughnessMap} metalnessMap={metallicMap} />
        </Sphere>
        ;
        <Sphere args={[1, 32, 32]} position={[1, 0, 0]}>
          <meshPhongMaterial color="red"  map={diffuseMap} specularMap={specularMap} /*shininessMap={glossinessMap}*/ />
        </Sphere>
        ;
      </Center>
    </Canvas>
  );
}


export default App;
