// src/components/aura/AuraOrb.tsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

const noiseChunk = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0);
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(
        permute(
          permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0)
        )
        + i.x + vec4(0.0, i1.x, i2.x, 1.0)
      );
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(
        dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)
      ));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(
        dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)
      ), 0.0);
      m = m * m;
      return 42.0 * dot(
        m*m,
        vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3))
      );
  }
`;

export type AIState = "listening" | "thinking" | "talking";

interface AuraOrbProps {
  aiState: AIState;
}

export function AuraOrb({ aiState }: AuraOrbProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const materialsRef = useRef<{
    disk?: THREE.ShaderMaterial;
    aura?: THREE.ShaderMaterial;
  }>({});
  const cameraDataRef = useRef({
    camY: 25,
    distance: 85,
    autoRotateSpeed: 0.4,
  });
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // One‑time Three.js scene setup
  useEffect(() => {
    if (!mountRef.current) return;

    const getWidth = () => mountRef.current?.clientWidth || window.innerWidth;
    const getHeight = () => mountRef.current?.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      getWidth() / getHeight(),
      0.1,
      1000
    );
    camera.position.set(60, 25, 60);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(getWidth(), getHeight());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;

    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;
    controls.autoRotate = true;
    controls.autoRotateSpeed = cameraDataRef.current.autoRotateSpeed;
    controls.enableZoom = false;
    controlsRef.current = controls;

    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Core black sphere
    const bhGeo = new THREE.SphereGeometry(4, 64, 64);
    const bhMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    coreGroup.add(new THREE.Mesh(bhGeo, bhMat));

    // Brand aura glow – IdealApp indigo/violet
    const auraMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 1.0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vView = normalize(-(modelViewMatrix * vec4(position, 1.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uIntensity;
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 4.0);
          // Deep indigo → electric violet
          vec3 base = vec3(0.31, 0.27, 0.89);
          vec3 accent = vec3(0.42, 0.28, 0.99);
          vec3 color = mix(base, accent, 0.5);
          gl_FragColor = vec4(color * rim * uIntensity * 4.0, 1.0);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    materialsRef.current.aura = auraMat;

    const auraGeo = new THREE.SphereGeometry(4.25, 64, 64);
    coreGroup.add(new THREE.Mesh(auraGeo, auraMat));

    // Accretion disk
    const instanceCount = 5000;
    const streakGeo = new THREE.CylinderGeometry(0.01, 0.12, 2.2, 3);
    streakGeo.rotateX(Math.PI / 2);

    const diskMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0.1 },
        uCompression: { value: 1.0 },
        uIntensity: { value: 1.0 },
        uOrbitScale: { value: 1.0 },
      },
      vertexShader: `
        ${noiseChunk}
        uniform float uTime;
        uniform float uMorph;
        uniform float uCompression;
        uniform float uIntensity;
        uniform float uOrbitScale;
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          vec4 instPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          float rOriginal = length(instPos.xz);
          float r = rOriginal * uCompression;

          float initialAngle = atan(instPos.z, instPos.x);
          float orbitalVelocity = (1.5 / sqrt(rOriginal)) * uOrbitScale;
          float currentAngle = initialAngle + (uTime * orbitalVelocity);

          vec3 morphedWorldPos = vec3(
            cos(currentAngle) * r,
            instPos.y,
            sin(currentAngle) * r
          );

          float noise = snoise(vec3(
            morphedWorldPos.x * 0.08,
            morphedWorldPos.z * 0.08,
            uTime * 0.3
          ));
          morphedWorldPos.y += noise * uMorph * 4.0;

          vec3 viewDir = normalize(cameraPosition - morphedWorldPos);
          vec3 orbitDir = normalize(vec3(-sin(currentAngle), 0.0, cos(currentAngle)));
          float doppler = dot(orbitDir, viewDir);

          // Brand gradient: hot white -> violet -> indigo
          vec3 hot = vec3(0.95, 0.92, 1.0);
          vec3 warm = vec3(0.58, 0.20, 0.92);
          vec3 cool = vec3(0.31, 0.27, 0.89);

          vec3 color = mix(cool, warm, smoothstep(45.0, 12.0, r));
          color = mix(color, hot, smoothstep(10.0, 4.0, r));

          vColor = color * (1.3 + doppler * 0.7) * uIntensity;
          vOpacity = (smoothstep(3.8, 5.5, r) *
            (1.0 - smoothstep(38.0, 48.0, r))) * 0.8;

          float deltaAngle = currentAngle - initialAngle;
          float c = cos(deltaAngle);
          float s = sin(deltaAngle);
          mat3 rotY = mat3(
            c, 0.0, s,
            0.0, 1.0, 0.0,
            -s, 0.0, c
          );

          vec3 localPos = (instanceMatrix * vec4(position, 0.0)).xyz;
          vec3 rotatedLocalPos = rotY * localPos;

          gl_Position = projectionMatrix * viewMatrix *
            vec4(morphedWorldPos + rotatedLocalPos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          gl_FragColor = vec4(vColor, vOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materialsRef.current.disk = diskMaterial;

    const instancedDisk = new THREE.InstancedMesh(
      streakGeo,
      diskMaterial,
      instanceCount
    );
    const dummy = new THREE.Object3D();

    for (let i = 0; i < instanceCount; i++) {
      const r = 5 + Math.pow(Math.random(), 1.3) * 40;
      const angle = Math.random() * Math.PI * 2;
      dummy.position.set(
        Math.cos(angle) * r,
        (Math.random() - 0.5) * (8 / r),
        Math.sin(angle) * r
      );
      dummy.lookAt(
        dummy.position.x + Math.sin(angle),
        dummy.position.y,
        dummy.position.z - Math.cos(angle)
      );
      dummy.updateMatrix();
      instancedDisk.setMatrixAt(i, dummy.matrix);
    }

    scene.add(instancedDisk);

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      const time = clock.getElapsedTime();

      diskMaterial.uniforms.uTime.value = time;
      auraMat.uniforms.uTime.value = time;

      instancedDisk.rotation.y += 0.0005;

      if (cameraRef.current && controlsRef.current) {
        const currentDir = new THREE.Vector3()
          .subVectors(cameraRef.current.position, controlsRef.current.target)
          .normalize();

        cameraRef.current.position.x =
          controlsRef.current.target.x +
          currentDir.x * cameraDataRef.current.distance;
        cameraRef.current.position.z =
          controlsRef.current.target.z +
          currentDir.z * cameraDataRef.current.distance;
        cameraRef.current.position.y = cameraDataRef.current.camY;

        controlsRef.current.autoRotateSpeed =
          cameraDataRef.current.autoRotateSpeed;
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      camera.aspect = getWidth() / getHeight();
      camera.updateProjectionMatrix();
      renderer.setSize(getWidth(), getHeight());
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bhGeo.dispose();
      bhMat.dispose();
      streakGeo.dispose();
      diskMaterial.dispose();
      auraMat.dispose();
      instancedDisk.geometry.dispose();
    };
  }, []);

  // GSAP transitions for AI states
  useEffect(() => {
    const { disk, aura } = materialsRef.current;
    if (!disk || !aura) return;

    const stateConfigs = {
      listening: {
        morph: 0.1,
        compress: 1.0,
        intensity: 1.0,
        rotate: 0.4,
        camY: 25,
        camDist: 85,
        orbit: 1.0,
      },
      thinking: {
        morph: 4.5,
        compress: 1.15,
        intensity: 1.4,
        rotate: 1.5,
        camY: 45,
        camDist: 95,
        orbit: 1.8,
      },
      talking: {
        morph: 0.8,
        compress: 0.38,
        intensity: 3.5,
        rotate: 5.0,
        camY: 12,
        camDist: 55,
        orbit: 4.5,
      },
    } as const;

    const target = stateConfigs[aiState];

    const tl = gsap.timeline({
      defaults: { duration: 3.0, ease: "power2.inOut" },
    });

    tl.to(disk.uniforms.uMorph, { value: target.morph }, 0)
      .to(disk.uniforms.uCompression, { value: target.compress }, 0)
      .to(disk.uniforms.uIntensity, { value: target.intensity }, 0)
      .to(disk.uniforms.uOrbitScale, { value: target.orbit }, 0)
      .to(aura.uniforms.uIntensity, { value: target.intensity }, 0)
      .to(
        cameraDataRef.current,
        {
          camY: target.camY,
          distance: target.camDist,
          autoRotateSpeed: target.rotate,
        },
        0
      );

    return () => {
      tl.kill();
    };
  }, [aiState]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      {/* On‑brand vignette / glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(108,71,255,0.22)_0%,_rgba(2,6,23,0.95)_55%,_#020617_100%)] pointer-events-none" />
    </div>
  );
}
