import type { ExplodeGroup } from "../../lib/parts";

export type Keyframe = {
  /** 三维相机位置（米） */
  cam: [number, number, number];
  /** 观察目标（米） */
  target: [number, number, number];
  /** 模型整体旋转（弧度） */
  rot: [number, number, number];
  /** 模型整体缩放 */
  scale: number;
  fov: number;
};

export type ProductTimeline = {
  /** 模型出厂朝向修正 */
  orientation: [number, number, number];
  /** 归位阶段：在此区间内所有位移平滑回零 */
  returnWindow: [number, number];
  /** 每个章节一个关键帧，帧位于章节中点 */
  keyframes: Keyframe[];
  groups: ExplodeGroup[];
  /** 环境反射强度总控 */
  envIntensity: number;
  /** 全局展开幅度系数：一处收敛所有分件位移，避免逐个改魔法数字 */
  explodeScale: number;
};
