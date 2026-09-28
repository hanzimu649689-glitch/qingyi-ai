# 清邑 AI · 公司官网

科技感 / 未来感的公司官网，含三大业务：产品数字孪生、定制智能体、少儿 AI 培训。

## 技术栈

- Vite + React + TypeScript + Tailwind CSS v4
- three.js / @react-three/fiber / drei（仅在产品页按需加载）
- Lenis 平滑滚动

## 本地开发与构建

```bash
npm install
npm run dev       # 开发
npm run build     # 构建到 dist/
npm run preview   # 本地预览
```

## 部署到 GitHub Pages

推送到 `main` 后，`.github/workflows/deploy.yml` 自动构建并部署。
首次需在仓库 Settings → Pages → Source 选择 **GitHub Actions**。

子路径（base）自动推导：仓库名为 `<user>.github.io` 用 `/`，否则用 `/<仓库名>/`。

## 三维资产管线

`tools/export_glb.py` 从原始 Blender 工程导出网页用 GLB。原始 `.blend` **只读**，脚本先复制工作副本再操作，原工程零改动。

```bash
blender --background --factory-startup --python tools/export_glb.py -- all
```

产出 `public/models/{camera,watch}.glb` 与 `*.parts.json`（部件清单，供拆解方向计算）。

| 模型 | 来源工程（最新版） | 部件 | 面数 | 体积 |
|---|---|---|---|---|
| 相机 | 相机模型_双轨.blend | 258 | 117,451 | 1.42 MB |
| 手表 | 手表模型_皇家橡树.blend | 98 | 48,288 | 0.39 MB |

## 调试参数

- `?debug=parts` 显示部件分组面板，悬停 3D 可读出部件名
- `?p=0.45` 把滚动进度钉在指定值，用于核对中间状态

## 目录

```
src/
├─ components/three/   三维舞台（滚动进度 → 模型状态，纯函数映射）
├─ components/ui/      导航、动效基元、布局
├─ config/timeline/    两个产品的关键帧与拆解配置（数据驱动）
├─ content/            全部文案与业务数据
├─ lib/                滚动进度、部件解析、材质映射
└─ pages/              各页面
```
