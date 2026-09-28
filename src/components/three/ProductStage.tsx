import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, useProgress } from "@react-three/drei";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { applyPbr } from "../../lib/materials";
import { loadParts, resolveGroups, smoothstep, window01, type ExplodeGroupResolved, type PartsManifest } from "../../lib/parts";
import { getScroll } from "../../lib/scroll";
import type { ProductTimeline } from "../../config/timeline/types";

const BASE = import.meta.env.BASE_URL;
const DRACO_PATH = `${BASE}draco/gltf/`;
const HL_COLOR = 0x00e5ff;

type PartItem = {
  mesh: THREE.Mesh;
  base: THREE.Vector3;
  baseQuat: THREE.Quaternion;
  group: ExplodeGroupResolved | null;
  parentQuatInv: THREE.Quaternion;
  parentScale: number;
};

type Prepared = {
  scene: THREE.Object3D;
  items: PartItem[];
  groups: ExplodeGroupResolved[];
};

/* ================= 场景 ================= */
function Scene({
  url,
  timeline,
  manifest,
  interactive,
  debug,
  onHoverPart,
}: {
  url: string;
  timeline: ProductTimeline;
  manifest: PartsManifest;
  interactive: boolean;
  debug: boolean;
  onHoverPart?: (name: string | null) => void;
}) {
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    const draco = new DRACOLoader();
    draco.setDecoderPath(DRACO_PATH);
    (loader as GLTFLoader).setDRACOLoader(draco);
  }) as GLTF;

  const { camera, gl, raycaster, pointer } = useThree();
  const rootRef = useRef<THREE.Group>(null);
  const highlight = useRef<string | null>(null);

  /* 只 clone 一次：动画作用的对象与渲染的对象必须是同一份 */
  const prepared = useMemo<Prepared>(() => {
    const { resolved, groupOf } = resolveGroups(manifest.parts, timeline.groups);
    const scene = gltf.scene.clone(true);
    const items: PartItem[] = [];
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!(mesh as unknown as { isMesh?: boolean }).isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        const std = m as THREE.MeshStandardMaterial;
        if (!std || !(std as unknown as { isMeshStandardMaterial?: boolean }).isMeshStandardMaterial) continue;
        applyPbr(std.name ?? "", std, std.color ? std.color.clone() : null);
        std.userData.baseEmissiveHex = std.emissive ? std.emissive.getHex() : 0;
      }
      mesh.frustumCulled = true;
      const g = resolved.find((r) => r.key === groupOf.get(mesh.name)) ?? null;
      const parent = mesh.parent ?? scene;
      parent.updateWorldMatrix(true, false);
      const pq = new THREE.Quaternion();
      parent.getWorldQuaternion(pq);
      const ps = new THREE.Vector3();
      parent.getWorldScale(ps);
      items.push({
        mesh,
        base: mesh.position.clone(),
        baseQuat: mesh.quaternion.clone(),
        group: g,
        parentQuatInv: pq.invert(),
        parentScale: ps.x || 1,
      });
    });
    return { scene, items, groups: resolved };
  }, [gltf, manifest, timeline.groups]);

  /* 复用临时对象，避免每帧分配 */
  const tmp = useMemo(
    () => ({
      camA: new THREE.Vector3(), camB: new THREE.Vector3(),
      tgtA: new THREE.Vector3(), tgtB: new THREE.Vector3(),
      cam: new THREE.Vector3(), tgt: new THREE.Vector3(),
      off: new THREE.Vector3(), q: new THREE.Quaternion(), q2: new THREE.Quaternion(), e: new THREE.Euler(),
    }),
    [],
  );

  /* 全局调试高亮入口 */
  useEffect(() => {
    const g = globalThis as unknown as { __setHighlight?: (k: string | null) => void };
    g.__setHighlight = (k) => {
      highlight.current = k;
      for (const it of prepared.items) {
        const mats = Array.isArray(it.mesh.material) ? it.mesh.material : [it.mesh.material];
        for (const m of mats) {
          const std = m as THREE.MeshStandardMaterial;
          if (std && std.emissive) std.emissive.setHex(k ? HL_COLOR : std.userData.baseEmissiveHex ?? 0);
        }
      }
    };
    return () => { g.__setHighlight = undefined; };
  }, [prepared]);

  useFrame(() => {
    if (!rootRef.current) return;
    const p = getScroll().progress;
    const kfs = timeline.keyframes;
    const n = kfs.length;

    /* 关键帧位于各章节中点，因此在整页范围内连续插值，章节边界天然不跳变 */
    const kpos = p * n - 0.5;
    const i = Math.min(n - 2, Math.max(0, Math.floor(kpos)));
    const t = smoothstep(Math.min(1, Math.max(0, kpos - i)));
    const a = kfs[i];
    const b = kfs[i + 1];

    if (!interactive) {
      tmp.camA.set(a.cam[0], a.cam[1], a.cam[2]);
      tmp.camB.set(b.cam[0], b.cam[1], b.cam[2]);
      tmp.tgtA.set(a.target[0], a.target[1], a.target[2]);
      tmp.tgtB.set(b.target[0], b.target[1], b.target[2]);
      camera.position.lerpVectors(tmp.camA, tmp.camB, t);
      tmp.tgt.lerpVectors(tmp.tgtA, tmp.tgtB, t);
      camera.lookAt(tmp.tgt);
      const pc = camera as THREE.PerspectiveCamera;
      const fov = a.fov + (b.fov - a.fov) * t;
      if (Math.abs(pc.fov - fov) > 0.01) { pc.fov = fov; pc.updateProjectionMatrix(); }
    }

    const o = timeline.orientation;
    tmp.e.set(
      o[0] + a.rot[0] + (b.rot[0] - a.rot[0]) * t,
      o[1] + a.rot[1] + (b.rot[1] - a.rot[1]) * t,
      o[2] + a.rot[2] + (b.rot[2] - a.rot[2]) * t,
    );
    rootRef.current.rotation.copy(tmp.e);
    rootRef.current.scale.setScalar(a.scale + (b.scale - a.scale) * t);

    /* 分件展开：与整体姿态共用同一个 p；归位窗口内统一回零。
       方向先转到模型局部空间（rootQuatInv）再转到父级空间，
       这样模型整体旋转时展开方向会同步旋转，镜头始终沿镜轴推出，而不是飞向屏幕外的固定方向。 */
    const rootQuatInv = rootRef.current.getWorldQuaternion(tmp.q2).invert();
    const env = 1 - window01(p, timeline.returnWindow[0], timeline.returnWindow[1]);
    for (const it of prepared.items) {
      const g = it.group;
      if (!g || g.fixed || g.dist === 0) { it.mesh.position.copy(it.base); continue; }
      const amt = smoothstep(window01(p, g.t0, g.t1)) * env;
      tmp.off
        .set(g.direction[0], g.direction[1], g.direction[2])
        .applyQuaternion(rootQuatInv)
        .applyQuaternion(it.parentQuatInv)
        .multiplyScalar((g.dist * amt * timeline.explodeScale) / it.parentScale);
      it.mesh.position.copy(it.base).add(tmp.off);
      if (g.spin) {
        tmp.q.setFromEuler(tmp.e.set(g.spin[0] * amt, g.spin[1] * amt, g.spin[2] * amt));
        it.mesh.quaternion.copy(it.baseQuat).multiply(tmp.q);
      }
    }
  });

  /* 调试：悬停读出部件名 */
  useEffect(() => {
    if (!debug || !onHoverPart) return;
    const el = gl.domElement;
    let raf = 0;
    const onMove = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(prepared.items.map((x) => x.mesh), false)[0];
        onHoverPart(hit ? hit.object.name : null);
      });
    };
    el.addEventListener("pointermove", onMove);
    return () => { el.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, [debug, gl, prepared, pointer, raycaster, camera, onHoverPart]);

  return (
    <>
      <group ref={rootRef}>
        <primitive object={prepared.scene} />
      </group>

      {/* 用 Lightformer 现场生成环境贴图：不依赖任何外部 HDR 图，弱网也能出金属反射 */}
      <Environment resolution={256} frames={1} environmentIntensity={timeline.envIntensity}>
        <Lightformer intensity={3.2} position={[0, 3, 2]} scale={[8, 3, 1]} target={[0, 0, 0]} />
        <Lightformer intensity={1.8} position={[-3, 1, 1]} scale={[4, 4, 1]} target={[0, 0, 0]} />
        <Lightformer intensity={2.0} position={[3, 0.5, -1]} scale={[4, 4, 1]} target={[0, 0, 0]} />
        <Lightformer intensity={1.1} position={[0, -2, 1]} scale={[8, 3, 1]} target={[0, 0, 0]} />
      </Environment>
      <ambientLight intensity={0.38} />
      <directionalLight position={[2, 4, 3]} intensity={1.15} />
      <directionalLight position={[-3, 1, -2]} intensity={0.5} color="#7c5cff" />
      <directionalLight position={[0, -3, -2]} intensity={0.25} color="#00e5ff" />

      {interactive && (
        <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={0.1} maxDistance={1.8} />
      )}
    </>
  );
}

/* ================= 真实加载进度 ================= */
function StageProgress() {
  const { progress, active } = useProgress();
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active && progress >= 100) {
      const t = setTimeout(() => setDone(true), 400);
      return () => clearTimeout(t);
    }
    setDone(false);
  }, [active, progress]);
  if (done) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div className="w-56 text-center">
        <div className="eyebrow mb-3">模型加载中</div>
        <div className="h-[2px] w-full bg-line">
          <div className="h-full bg-cyan transition-[width] duration-200 ease-out" style={{ width: `${Math.round(progress)}%` }} />
        </div>
        <div className="num mt-2 text-xs text-muted">{Math.round(progress)}%</div>
      </div>
    </div>
  );
}

/* ================= 对外组件 ================= */
export default function ProductStage({
  url,
  partsUrl,
  timeline,
  interactive,
  debug = false,
}: {
  url: string;
  partsUrl: string;
  timeline: ProductTimeline;
  interactive: boolean;
  debug?: boolean;
}) {
  const [manifest, setManifest] = useState<PartsManifest | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    loadParts(partsUrl).then(setManifest).catch((e: Error) => setErr(e.message));
  }, [partsUrl]);

  const groups = useMemo(
    () => (manifest ? resolveGroups(manifest.parts, timeline.groups).resolved : []),
    [manifest, timeline.groups],
  );

  return (
    <>
      <div className={`prod-canvas ${interactive ? "interactive" : ""}`}>
        {manifest && (
          <Canvas
            dpr={[1, 1.75]}
            camera={{ fov: timeline.keyframes[0].fov, near: 0.01, far: 60, position: timeline.keyframes[0].cam }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          >
            <Suspense fallback={null}>
              <Scene
                url={url}
                timeline={timeline}
                manifest={manifest}
                interactive={interactive}
                debug={debug}
                onHoverPart={setHover}
              />
            </Suspense>
          </Canvas>
        )}
        <StageProgress />
      </div>

      {err && (
        <div className="fixed bottom-4 left-4 z-30 max-w-sm rounded border border-line bg-panel/90 p-3 text-xs text-muted">
          模型加载失败：{err}
        </div>
      )}

      {debug && (
        <div className="fixed right-3 top-20 z-30 max-h-[70vh] w-[300px] overflow-auto rounded-lg border border-line bg-panel/95 p-3 backdrop-blur">
          <div className="eyebrow mb-2">部件调试 · ?debug=parts</div>
          <div className="mb-2 text-xs text-muted">
            悬停 3D 读取部件名：<span className="num text-cyan">{hover ?? "—"}</span>
          </div>
          {manifest && (
            <>
              <div className="num mb-2 text-xs text-muted">
                共 {manifest.count} 件 / {manifest.tris.toLocaleString()} 面
              </div>
              <div className="space-y-1">
                {groups.map((g) => (
                  <div
                    key={g.key}
                    className="flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-1 text-xs hover:bg-white/5"
                    onMouseEnter={() => (globalThis as unknown as { __setHighlight?: (k: string | null) => void }).__setHighlight?.(g.key)}
                    onMouseLeave={() => (globalThis as unknown as { __setHighlight?: (k: string | null) => void }).__setHighlight?.(null)}
                  >
                    <span className="text-fg">{g.key}</span>
                    <span className="num text-muted">{g.count}件 · {g.tris.toLocaleString()}面</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
