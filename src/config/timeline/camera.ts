import type { ProductTimeline } from "./types";

/**
 * 旁轴相机（258 件 / 117,451 面）。
 * 导出时 Blender 的 Z-up 已转为 glTF 的 Y-up：
 *   three.x = 机身宽度（138mm）  three.y = 机身高度  three.z = 前后深度（镜头在 +z）
 * 因此模型在 three.js 中天然正立、镜头朝向观察者，无需额外朝向修正。
 *
 * 拆解方向：除机身/外壳这类"基准件"外，一律由该组真实重心相对模型中心自动计算，
 * 所以展开方向来自模型本身，不是人工指定的假方向。
 */
export const cameraTimeline: ProductTimeline = {
  orientation: [0, 0, 0],
  returnWindow: [0.86, 0.975],
  envIntensity: 1.6,
  /* 位移量直接取自工程里作者写好的 ex_v（单位已换算为米），因此系数保持 1 */
  explodeScale: 0.52,
  /* 展开窗口：与章节对齐，随后在 returnWindow 内统一归位 */
  exWindow: [0.29, 0.63],
  keyframes: [
    // 01 整机
    { cam: [0.0, 0.055, 0.40], target: [0, 0.042, 0.0], rot: [0, -0.18, 0], scale: 1, fov: 30 },
    // 02 结构总览：转到四分之三侧
    { cam: [0.29, 0.10, 0.30], target: [0, 0.040, 0.0], rot: [0, -0.62, 0], scale: 1, fov: 30 },
    // 03 爆炸拆解：拉远以容纳展开后的体积
    { cam: [0.34, 0.22, 0.60], target: [0, 0.045, 0.012], rot: [0, -0.85, 0], scale: 1, fov: 34 },
    // 04 结构注解：贴近镜头组
    { cam: [0.11, 0.08, 0.24], target: [0, 0.042, 0.03], rot: [0, -0.35, 0], scale: 1, fov: 28 },
    // 05 材质工艺：掠射角度看外壳与皮革
    { cam: [-0.16, 0.11, 0.26], target: [0, 0.040, 0.0], rot: [0, 0.42, 0], scale: 1, fov: 28 },
    // 06 归位：回到与 01 相同的构图
    { cam: [0.0, 0.055, 0.40], target: [0, 0.042, 0.0], rot: [0, -0.18, 0], scale: 1, fov: 30 },
  ],
  groups: [
    // —— 基准件：不参与位移，作为装配参照 ——
    { key: "shell", match: (n) => n === "机身", dist: 0, t0: 0, t1: 1, fixed: true },
    // —— 内部衬里：向上抬起，露出内腔 ——
    { key: "liner", match: (n) => n === "机身内衬", axis: [0, 1, 0], dist: 0.052, t0: 0.47, t1: 0.56 },
    // —— 顶盖 / 顶部控件：向上 ——
    { key: "top", match: (n) => n === "顶盖" || n.startsWith("顶部按键组") || n.startsWith("镶边"), axis: [0, 1, 0], dist: 0.062, t0: 0.39, t1: 0.49 },
    // —— 底部：向下 ——
    { key: "bottom", match: (n) => n.startsWith("底部细节组") || n.startsWith("底_"), axis: [0, -1, 0], dist: 0.05, t0: 0.45, t1: 0.55 },
    // —— 前窗组：沿自身方向脱离 ——
    { key: "front", match: (n) => n.startsWith("前窗"), dist: 0.062, t0: 0.30, t1: 0.41 },
    // —— 镜头组：整组沿镜轴推出（含光圈环/刻度/叶片/镜片）——
    { key: "lens", match: (n) => n.startsWith("镜头"), dist: 0.088, t0: 0.32, t1: 0.45 },
    // —— 后背组：向后分离 ——
    { key: "back", match: (n) => n.startsWith("背_"), dist: 0.066, t0: 0.44, t1: 0.55 },
    // —— 背板 ——
    { key: "backplate", match: (n) => n === "背板", dist: 0.05, t0: 0.42, t1: 0.51 },
    // —— 内部机构：向斜上方，位于爆炸图中心 ——
    { key: "inner", match: (n) => n.startsWith("内部_"), axis: [0.35, 1, 0.2], dist: 0.05, t0: 0.46, t1: 0.55 },
    // —— 五金件 ——
    { key: "hw", match: (n) => n.startsWith("五金"), dist: 0.058, t0: 0.36, t1: 0.46 },
    // —— 铭文 ——
    { key: "mark", match: (n) => n.startsWith("铭文"), dist: 0.052, t0: 0.40, t1: 0.48 },
    // —— 背带 ——
    { key: "strap", match: (n) => n.startsWith("背带"), dist: 0.085, t0: 0.33, t1: 0.43 },
  ],
};
