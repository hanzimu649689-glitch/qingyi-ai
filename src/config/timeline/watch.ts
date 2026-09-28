import type { ProductTimeline } from "./types";

/**
 * 机械腕表（98 件 / 48,288 面），表径 39.9mm，与真表一致。
 * 导出后 three.y 为表盘法线方向（表盘朝上），链带沿 three.z 向两端延伸，
 * 因此需要绕 X 轴前倾，把表盘转向观察者。
 */
export const watchTimeline: ProductTimeline = {
  orientation: [1.15, 0, 0],
  returnWindow: [0.86, 0.975],
  envIntensity: 1.65,
  explodeScale: 1.5,
  keyframes: [
    // 01 表盘
    { cam: [0, 0.072, 0.185], target: [0, -0.018, 0], rot: [0, -0.2, 0], scale: 1, fov: 30 },
    // 02 链带展开
    { cam: [0.046, 0.118, 0.218], target: [0, -0.004, 0], rot: [0, -0.5, 0], scale: 1, fov: 30 },
    // 03 层叠拆解
    { cam: [0.262, 0.150, 0.262], target: [0, 0.014, 0], rot: [0, -0.95, 0], scale: 1, fov: 33 },
    // 04 机芯
    { cam: [0.196, 0.132, 0.200], target: [0, 0.010, 0.008], rot: [0, -1.05, 0], scale: 1, fov: 31 },
    // 05 工艺细节
    { cam: [-0.072, 0.094, 0.158], target: [0, -0.010, 0], rot: [0, 0.55, 0], scale: 1, fov: 28 },
    // 06 归位
    { cam: [0, 0.072, 0.185], target: [0, -0.018, 0], rot: [0, -0.2, 0], scale: 1, fov: 30 },
  ],
  groups: [
    // —— 基准件：中壳不动 ——
    { key: "case", match: (n) => n === "表壳中壳", dist: 0, t0: 0, t1: 1, fixed: true },
    // —— 链带 / 表扣 / 表耳：沿两端拉开 ——
    { key: "strap", match: (n) => n.startsWith("链带") || n.startsWith("表扣") || n.startsWith("表耳"), dist: 0.042, t0: 0.24, t1: 0.40 },
    // —— 表圈与 16 颗表圈螺丝：向上 ——
    { key: "bezel", match: (n) => n.startsWith("表圈"), axis: [0, 1, 0], dist: 0.030, t0: 0.34, t1: 0.46 },
    { key: "screws", match: (n) => n.startsWith("螺丝沉孔"), axis: [0, 1, 0], dist: 0.038, t0: 0.36, t1: 0.48 },
    // —— 表镜 / 内圈 / 分钟轨道 ——
    { key: "glass", match: (n) => n === "表镜", axis: [0, 1, 0], dist: 0.055, t0: 0.32, t1: 0.44 },
    { key: "ring", match: (n) => n.startsWith("内圈") || n.startsWith("分钟轨道"), axis: [0, 1, 0], dist: 0.024, t0: 0.40, t1: 0.50 },
    // —— 表盘 / 格纹 / 时标 / 字 / 日历 ——
    { key: "dial", match: (n) => n.startsWith("表盘") || n === "时标", axis: [0, 1, 0], dist: 0.016, t0: 0.44, t1: 0.54 },
    { key: "print", match: (n) => n.startsWith("字_") || n.startsWith("日历"), axis: [0, 1, 0], dist: 0.010, t0: 0.46, t1: 0.56 },
    // —— 指针：以表盘轴心为原点，先旋转再上浮 ——
    { key: "hands", match: (n) => n.startsWith("指针") || n === "秒针配重", axis: [0, 1, 0], dist: 0.042, t0: 0.42, t1: 0.54, spin: [0, 1.9, 0] },
    // —— 表冠 ——
    { key: "crown", match: (n) => n.startsWith("表冠"), dist: 0.028, t0: 0.38, t1: 0.48 },
    // —— 机芯：向下沉 ——
    { key: "movement", match: (n) => n.startsWith("机芯"), axis: [0, -1, 0], dist: 0.030, t0: 0.30, t1: 0.46 },
    // —— 底盖 ——
    { key: "caseback", match: (n) => n.startsWith("底盖"), axis: [0, -1, 0], dist: 0.048, t0: 0.34, t1: 0.46 },
  ],
};
