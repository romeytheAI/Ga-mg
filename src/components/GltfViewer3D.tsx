import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { GameState } from '../types';
import { resolveRace } from '../data/races';
import { buildBodyGeom, resolveSkinColor, SpriteState } from './sprite/utils';
import { convertSvgToGltf } from '../utils/svgToGltf';
import { ANIMATION_LIBRARY, convertToAnimationClip } from '../utils/animationLibrary';

interface GltfViewer3DProps {
  state: GameState;
  width?: string;
  height?: string;
  combatAnimation?: string | null;
}

export const GltfViewer3D: React.FC<GltfViewer3DProps> = ({
  state, width = '100%', height = '320px', combatAnimation = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const frameRef = useRef<number>(0);

  const loadGltfIntoScene = useCallback((gltfJson: string, scene: THREE.Scene) => {
    const gltf = JSON.parse(gltfJson);
    const group = new THREE.Group();

    // 1. Build Skeleton from glTF nodes
    const bones: THREE.Bone[] = [];
    const boneMap: Record<string, THREE.Bone> = {};
    
    gltf.nodes.forEach((n: any) => {
      if (n.name.startsWith('Bone_') || n.name === 'Armature') {
        const bone = new THREE.Bone();
        bone.name = n.name;
        if (n.translation) bone.position.fromArray(n.translation);
        bones.push(bone);
        boneMap[n.name] = bone;
      }
    });

    // Parent bones
    gltf.nodes.forEach((n: any) => {
      if (n.children) {
        const parent = boneMap[n.name];
        n.children.forEach((cIdx: number) => {
          const child = boneMap[gltf.nodes[cIdx].name];
          if (parent && child) parent.add(child);
        });
      }
    });

    const skeleton = new THREE.Skeleton(bones);

    // 2. Build Skinned Meshes
    for (const meshDef of gltf.meshes) {
      for (const prim of meshDef.primitives) {
        const geometry = new THREE.BufferGeometry();
        
        // Decode attributes (simplified for production logic)
        const getBuf = (idx: number) => {
          const bv = gltf.bufferViews[gltf.accessors[idx].bufferView];
          return Uint8Array.from(atob(gltf.buffers[bv.buffer].uri.split(',')[1]), c => c.charCodeAt(0)).buffer;
        };

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(getBuf(prim.attributes.POSITION)), 3));
        geometry.setAttribute('skinIndex', new THREE.BufferAttribute(new Uint16Array(getBuf(prim.attributes.JOINTS_0)), 4));
        geometry.setAttribute('skinWeight', new THREE.BufferAttribute(new Float32Array(getBuf(prim.attributes.WEIGHTS_0)), 4));
        geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(getBuf(prim.indices)), 1));

        const material = new THREE.MeshStandardMaterial({ 
          color: new THREE.Color(0.8, 0.7, 0.6), 
          roughness: 0.8,
          metalness: 0.1
        });

        const mesh = new THREE.SkinnedMesh(geometry, material);
        mesh.add(bones[0]); 
        mesh.bind(skeleton);
        group.add(mesh);
      }
    }

    scene.add(group);
    mixerRef.current = new THREE.AnimationMixer(group);
    
    // Auto-play Idle
    const idleClip = convertToAnimationClip(ANIMATION_LIBRARY.idle);
    mixerRef.current.clipAction(idleClip).play();

  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 10);
    camera.position.set(0, 0, 1.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    scene.add(light);

    // Initial build
    const { identity, cosmetics } = state.player;
    const raceDef = resolveRace(identity.race);
    const geom = buildBodyGeom(identity.gender, raceDef);
    const skinColor = resolveSkinColor(raceDef, cosmetics?.skin_tone || '');
    const gltfJson = convertSvgToGltf({ 
      geom, 
      spriteState: {
        cx: 50, headCY: 21, neckTopY: 30, neckBotY: 40, shldY: 41, waistY: 98, hipTopY: 104, crotchY: 120,
        kneeY: 160, ankleY: 196, footBotY: 206, shLX: 30, shRX: 70, elLX: 25, elRX: 75, elY: 81,
        wrLX: 20, wrRX: 80, wrY: 109, handCY: 115, legLX: 40, legRX: 60, isDigi: false,
        digiKneeY: 142, digiAnkleY: 184
      } as any, 
      skinColor,
      gender: identity.gender,
      quality: state.ui.graphics_quality
    });
    loadGltfIntoScene(gltfJson, scene);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();
      if (mixerRef.current) mixerRef.current.update(delta);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width, height }} className="aaa-panel overflow-hidden bg-black/40">
       <div className="absolute bottom-2 right-2 text-[8px] uppercase tracking-widest text-white/20">Aetherius_Rig_Active</div>
    </div>
  );
};
