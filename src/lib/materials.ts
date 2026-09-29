/**
 * 材质名 → PBR 参数映射。
 * 两个模型的分件材质都是中文语义化命名（钢_抛光、黄铜_做旧、镜片_镀膜…），
 * 所以按名字规则还原质感，比依赖贴图更轻也更稳定。
 */
import * as THREE from "three";

type Pbr = {
  color?: number;
  metalness: number;
  roughness: number;
  envMapIntensity: number;
  emissive?: number;
  emissiveIntensity?: number;
  transparent?: boolean;
  opacity?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
};

const RULES: { test: RegExp; pbr: Pbr }[] = [
  // —— 玻璃 / 镜片 ——
  { test: /蓝宝石|表镜/, pbr: { metalness: 0, roughness: 0.02, envMapIntensity: 2.6, transparent: true, opacity: 0.28 } },
  { test: /镜片_镀膜|镀膜/, pbr: { metalness: 0.55, roughness: 0.04, envMapIntensity: 2.4, color: 0x2b3f6b } },
  { test: /镜片_内部|内部镜片/, pbr: { metalness: 0.2, roughness: 0.06, envMapIntensity: 1.8, color: 0x0d1526 } },
  { test: /取景窗玻璃|玻璃/, pbr: { metalness: 0, roughness: 0.04, envMapIntensity: 2.2, transparent: true, opacity: 0.32 } },
  // —— 抛光钢 / 铬 ——
  { test: /钢_抛光|铬件|抛光/, pbr: { metalness: 1, roughness: 0.07, envMapIntensity: 1.7 } },
  // —— 拉丝钢 ——
  { test: /钢_拉丝|拉丝/, pbr: { metalness: 1, roughness: 0.3, envMapIntensity: 1.35 } },
  { test: /钢_暗槽|钢_暗|机芯_主板|机芯_夹板|机芯_钢件/, pbr: { metalness: 1, roughness: 0.38, envMapIntensity: 1.1 } },
  // —— 黄铜 / 齿轮 ——
  { test: /黄铜_做旧/, pbr: { metalness: 1, roughness: 0.52, envMapIntensity: 1.0, color: 0xb08a45 } },
  { test: /黄铜|机芯_齿轮|齿轮/, pbr: { metalness: 1, roughness: 0.26, envMapIntensity: 1.4, color: 0xd4a04a } },
  // —— 蓝色 / 红宝石 ——
  { test: /蓝钢螺丝/, pbr: { metalness: 1, roughness: 0.18, envMapIntensity: 1.5, color: 0x2b3f7a } },
  { test: /表盘_蓝格/, pbr: { metalness: 0.55, roughness: 0.34, envMapIntensity: 1.15, color: 0x12253f } },
  { test: /表盘_蓝底/, pbr: { metalness: 0.4, roughness: 0.3, envMapIntensity: 1.1, color: 0x0a1730 } },
  { test: /红宝石/, pbr: { metalness: 0, roughness: 0.08, envMapIntensity: 2.0, color: 0x8d1220 } },
  // —— 黑件 / 漆面 ——
  { test: /哑黑|漆面_黑|快门帘/, pbr: { metalness: 0.18, roughness: 0.52, envMapIntensity: 0.9 } },
  { test: /漆面_老化/, pbr: { metalness: 0.22, roughness: 0.46, envMapIntensity: 1.0, color: 0x14161a } },
  // —— 皮革 ——
  { test: /皮革_鹅卵石/, pbr: { metalness: 0.05, roughness: 0.72, envMapIntensity: 0.75, color: 0x14100e } },
  { test: /皮革/, pbr: { metalness: 0.05, roughness: 0.66, envMapIntensity: 0.8, color: 0x3a2317 } },
  // —— 白 / 夜光 / 印字 ——
  { test: /夜光/, pbr: { metalness: 0, roughness: 0.45, envMapIntensity: 0.9, color: 0xeceadf, emissive: 0x2a2b1e, emissiveIntensity: 0.55 } },
  { test: /印字|日历_白|分钟轨道|内圈|时标/, pbr: { metalness: 0.1, roughness: 0.35, envMapIntensity: 1.0, color: 0xe9e7df } },
  { test: /日历_黑字/, pbr: { metalness: 0.1, roughness: 0.4, envMapIntensity: 0.9, color: 0x111214 } },
  // —— 内部结构 ——
  { test: /内部|胶片导轨/, pbr: { metalness: 0.75, roughness: 0.42, envMapIntensity: 0.95, color: 0x54595f } },
];

const DEFAULT: Pbr = { metalness: 0.6, roughness: 0.42, envMapIntensity: 1.0 };

/* ---------------- 程序化表面颗粒 ----------------
 * Blender 里的做旧质感（黄铜氧化、皮革荔枝纹、漆面老化）是靠 ColorRamp + 噪声节点做的，
 * glTF 无法携带这类节点，导出后只剩基础色。这里用一张代码生成的噪声贴图作为粗糙度贴图，
 * 把「表面颗粒」补回来——高光会被打散，黑件上就能看出皮革与金属的区别。
 */
let grainCache: THREE.Texture | null = null;

function grainTexture(): THREE.Texture | null {
  if (grainCache) return grainCache;
  if (typeof document === "undefined") return null;
  const SZ = 256;
  const cv = document.createElement("canvas");
  cv.width = cv.height = SZ;
  const ctx = cv.getContext("2d");
  if (!ctx) return null;

  const hash = (x: number, y: number) => {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const noise = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = smooth(x - xi), yf = smooth(y - yi);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a * (1 - xf) * (1 - yf) + b * xf * (1 - yf) + c * (1 - xf) * yf + d * xf * yf;
  };

  const img = ctx.createImageData(SZ, SZ);
  for (let y = 0; y < SZ; y++) {
    for (let x = 0; x < SZ; x++) {
      let v = 0, amp = 0.5, f = 10 / SZ;
      for (let o = 0; o < 4; o++) { v += noise(x * f, y * f) * amp; amp *= 0.5; f *= 2; }
      const g = Math.max(0, Math.min(255, Math.round(138 + 115 * (v - 0.5) * 2)));
      const i = (y * SZ + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = g;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.5, 2.5);
  tex.anisotropy = 4;
  grainCache = tex;
  return tex;
}

/** 哪些材质需要表面颗粒（按中文语义名判定） */
const GRAIN = /皮革|黄铜|哑黑|漆面|机芯_主板|机芯_夹板|内部|快门帘/;
/* 颗粒需要乘在粗糙度上，所以基值要相应提高，否则会越磨越亮 */
const GRAIN_ROUGHNESS_BOOST = 1.45;

export function pbrFor(materialName: string, baseColor: THREE.Color | null): Pbr {
  const hit = RULES.find((r) => r.test.test(materialName));
  const pbr = hit ? hit.pbr : DEFAULT;
  const out: Pbr = { ...pbr };
  if (out.color === undefined && baseColor) out.color = baseColor.getHex();
  return out;
}

/** 把映射结果应用到 GLB 自带的材质上 */
export function applyPbr(
  name: string,
  mat: THREE.MeshStandardMaterial,
  baseColor: THREE.Color | null,
): void {
  const p = pbrFor(name, baseColor);
  mat.metalness = p.metalness;
  mat.roughness = p.roughness;
  mat.envMapIntensity = p.envMapIntensity;
  if (p.color !== undefined) mat.color.setHex(p.color);
  if (p.emissive !== undefined) {
    mat.emissive.setHex(p.emissive);
    mat.emissiveIntensity = p.emissiveIntensity ?? 1;
  }
  mat.transparent = !!p.transparent;
  mat.opacity = p.opacity ?? 1;
  mat.depthWrite = !p.transparent;
  /* 玻璃类为了性能关掉真实透射，改用高环境反射 + 低不透明度近似 */
  mat.side = 0;

  /* 表面颗粒：让黑色件与黄铜件在环境下有真实的质感差异 */
  if (GRAIN.test(name)) {
    const g = grainTexture();
    if (g) {
      mat.roughnessMap = g;
      mat.roughness = Math.min(1, mat.roughness * GRAIN_ROUGHNESS_BOOST);
    }
  } else {
    mat.roughnessMap = null;
  }
  mat.needsUpdate = true;
}
