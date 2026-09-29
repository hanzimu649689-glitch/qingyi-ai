export type Chapter = {
  id: string;
  no: string;
  title: string;
  lead: string;
  bullets: string[];
};

export type Product = {
  slug: string;
  name: string;
  en: string;
  kind: string;
  tagline: string;
  summary: string;
  stats: { k: string; v: string }[];
  chapters: Chapter[];
  model: string;
  parts: string;
};

export const products: Product[] = [
  {
    slug: "camera",
    name: "旁轴相机",
    en: "RANGEFINDER",
    kind: "数字孪生 · 01",
    tagline: "一台相机，300 个零件，都能在网页上单独拆开看",
    summary:
      "这是一台复古旁轴相机。我们把它从 Blender 工程完整搬进浏览器：保留原有的分件层级与命名，让每一个零件都能被单独指出、单独移动。滚动页面时，装配顺序会被逆向播放成一次爆炸拆解。",
    stats: [
      { k: "零件数", v: "300" },
      { k: "三角面", v: "49,200" },
      { k: "模型体积", v: "0.59 MB" },
      { k: "文件格式", v: "GLB + Draco" },
    ],
    model: "/models/camera.glb",
    parts: "/models/camera.parts.json",
    chapters: [
      {
        id: "hero",
        no: "01",
        title: "整机",
        lead: "先看整体，再看内部。",
        bullets: ["悬浮展示，随滚动缓慢自转", "环境光缓慢流动，材质高光扫过外壳"],
      },
      {
        id: "overview",
        no: "02",
        title: "结构总览",
        lead: "从正面转到侧面，看清它的体量。",
        bullets: ["相机绕轴旋转到四分之三侧面", "标注第一批可识别的部件名称"],
      },
      {
        id: "explode",
        no: "03",
        title: "爆炸拆解",
        lead: "300 个零件按各自的位移与时机依次脱离本体。",
        bullets: [
          "前窗组 → 镜头组 → 顶盖 → 背板 → 内部机构 → 五金件",
          "每个分件有独立的展开时机，不是同时弹开",
          "展开方向由零件真实位置计算，不是统一方向",
        ],
      },
      {
        id: "detail",
        no: "04",
        title: "结构注解",
        lead: "镜头与内部机构的引线标注。",
        bullets: ["对焦刻度、光圈环、快门帘、取景棱镜逐一说明", "关键参数随滚动计数呈现"],
      },
      {
        id: "material",
        no: "05",
        title: "材质与工艺",
        lead: "外壳、皮革、镜片镀膜与黄铜件的质感差异。",
        bullets: ["切换细节视角，高光扫过表面", "同屏对比抛光铬件与做旧黄铜"],
      },
      {
        id: "return",
        no: "06",
        title: "归位",
        lead: "所有零件沿原路准确回到装配位置。",
        bullets: ["由同一个滚动进度反向映射，不是另播一段动画", "回到整机英雄构图"],
      },
    ],
  },
  {
    slug: "watch",
    name: "机械腕表",
    en: "MECHANICAL WATCH",
    kind: "数字孪生 · 02",
    tagline: "98 个零件，从链带到机芯逐层展开",
    summary:
      "一只机械腕表，表径 39.9mm，与真表一致——它在 Blender 里就是按真实尺寸建模的。链带、表圈、表盘、指针与 37 件机芯零件都保留了独立的节点，因此可以逐层拆开。",
    stats: [
      { k: "零件数", v: "98" },
      { k: "三角面", v: "48,288" },
      { k: "模型体积", v: "0.39 MB" },
      { k: "表径", v: "39.9 mm" },
    ],
    model: "/models/watch.glb",
    parts: "/models/watch.parts.json",
    chapters: [
      {
        id: "hero",
        no: "01",
        title: "表盘",
        lead: "从指针与格纹表盘开始。",
        bullets: ["正面展示，缓慢倾斜", "蓝宝石镜面反光随视角变化"],
      },
      {
        id: "strap",
        no: "02",
        title: "链带展开",
        lead: "一体式链带向两端逐节拉开。",
        bullets: ["宽块 / 窄块 / 销三类链节各自独立", "两端对称展开，露出表耳与表扣结构"],
      },
      {
        id: "explode",
        no: "03",
        title: "层叠拆解",
        lead: "表圈、表盘、指针沿轴心垂直分离。",
        bullets: ["表圈与 16 颗表圈螺丝一同升起", "指针以表盘轴心为原点旋转后再分离"],
      },
      {
        id: "movement",
        no: "04",
        title: "机芯",
        lead: "37 个机芯零件分层呈现。",
        bullets: ["主夹板、夹板、齿轮、自动陀与蓝钢螺丝逐层展开", "红宝石轴承与齿轮咬合关系清晰可见"],
      },
      {
        id: "detail",
        no: "05",
        title: "工艺细节",
        lead: "抛光与拉丝的区别，是最难拍清楚的部分。",
        bullets: ["表壳抛光面与链带拉丝面同屏对比", "格纹表盘的起伏在掠射光下显现"],
      },
      {
        id: "return",
        no: "06",
        title: "归位",
        lead: "逐层回装，回到完整的一只表。",
        bullets: ["同一份模型的真实状态回退", "指针回到初始时刻"],
      },
    ],
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
