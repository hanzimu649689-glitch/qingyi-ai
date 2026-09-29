/** 读取导出时生成的部件清单，并把部件划分成可独立运动的拆解组。 */

export type PartRecord = {
  name: string;
  group: string | null;
  tris: number;
  materials: (string | null)[];
  center: [number, number, number];
  size: [number, number, number];
  origin: [number, number, number];
  /** 工程里写好的爆炸位移（three 坐标、米）。0 表示该件是基准件不动。 */
  ex?: [number, number, number];
  /** 工程里写好的错峰延迟 0–1 */
  delay?: number;
};

export type PartsManifest = { parts: PartRecord[]; count: number; tris: number };

export type ExplodeGroup = {
  key: string;
  /** 用于判定部件归属：名称前缀或完整名称 */
  match: (name: string) => boolean;
  /** 显式指定展开轴（缺省时按部件真实位置自动计算径向方向） */
  axis?: [number, number, number];
  /** 展开距离系数（米，按模型尺寸自动缩放） */
  dist: number;
  /** 展开时机（全局滚动进度 0–1） */
  t0: number;
  t1: number;
  /** 展开时额外旋转（弧度） */
  spin?: [number, number, number];
  /** 整体不参与拆解 */
  fixed?: boolean;
};

export type ExplodeGroupResolved = ExplodeGroup & {
  count: number;
  tris: number;
  direction: [number, number, number];
};

const EPS = 1e-6;

function normalize(v: [number, number, number]): [number, number, number] {
  const l = Math.hypot(v[0], v[1], v[2]);
  return l < EPS ? [0, 0, 0] : [v[0] / l, v[1] / l, v[2] / l];
}

export async function loadParts(url: string): Promise<PartsManifest> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`部件清单加载失败：${url}`);
  const m = (await res.json()) as PartsManifest;
  /* 清单由 Blender 生成（Z-up）。glTF 导出已转为 Y-up：three = (x, z, -y)。
     这里同步换算，保证后续算出的展开方向与网页中的模型一致。 */
  for (const p of m.parts) {
    const [x, y, z] = p.center;
    p.center = [x, z, -y];
  }
  return m;
}

/** 模型整体中心（按面数加权，避免被大量微小零件带偏） */
export function modelCenter(parts: PartRecord[]): [number, number, number] {
  let w = 0;
  const acc: [number, number, number] = [0, 0, 0];
  for (const p of parts) {
    const k = Math.max(p.tris, 1);
    w += k;
    acc[0] += p.center[0] * k;
    acc[1] += p.center[1] * k;
    acc[2] += p.center[2] * k;
  }
  return w > 0 ? [acc[0] / w, acc[1] / w, acc[2] / w] : [0, 0, 0];
}

export function modelRadius(parts: PartRecord[]): number {
  let r = 0;
  for (const p of parts) {
    const d = Math.hypot(p.center[0], p.center[1], p.center[2]) + Math.hypot(...p.size) / 2;
    r = Math.max(r, d);
  }
  return r || 1;
}

/**
 * 把部件清单解析成拆解组。
 * 方向优先用显式轴；没有显式轴时，按「该组真实重心相对模型中心的方向」自动计算 ——
 * 这样展开方向来自模型本身，而不是人工猜的。
 */
export function resolveGroups(
  parts: PartRecord[],
  groups: ExplodeGroup[],
): { resolved: ExplodeGroupResolved[]; groupOf: Map<string, string> } {
  const center = modelCenter(parts);
  const resolved: ExplodeGroupResolved[] = [];
  const groupOf = new Map<string, string>();

  for (const g of groups) {
    const members = parts.filter((p) => g.match(p.name));
    let w = 0;
    const acc: [number, number, number] = [0, 0, 0];
    for (const p of members) {
      const k = Math.max(p.tris, 1);
      w += k;
      acc[0] += p.center[0] * k;
      acc[1] += p.center[1] * k;
      acc[2] += p.center[2] * k;
    }
    const centroid: [number, number, number] = w > 0 ? [acc[0] / w, acc[1] / w, acc[2] / w] : [0, 0, 0];
    const radial = normalize([centroid[0] - center[0], centroid[1] - center[1], centroid[2] - center[2]]);
    const direction = g.axis ? normalize(g.axis) : radial;

    resolved.push({
      ...g,
      count: members.length,
      tris: members.reduce((s, p) => s + p.tris, 0),
      direction,
    });
    for (const p of members) groupOf.set(p.name, g.key);
  }
  return { resolved, groupOf };
}

/** smoothstep：用于把线性进度变成有加减速的运动 */
export const smoothstep = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

/** 进度区间映射：p 在 [t0,t1] 内返回 0→1，之外钳制 */
export const window01 = (p: number, t0: number, t1: number) =>
  t1 <= t0 ? (p >= t1 ? 1 : 0) : Math.min(1, Math.max(0, (p - t0) / (t1 - t0)));
