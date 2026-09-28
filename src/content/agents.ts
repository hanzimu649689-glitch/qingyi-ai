export type Agent = {
  slug: string;
  name: string;
  en: string;
  tagline: string;
  summary: string;
  points: string[];
  scenarios: string[];
  stack: string[];
  media: { kind: "video" | "image"; src: string; poster?: string; note?: string }[];
  /** 素材缺口：需要补录解说视频 */
  needsVideo: boolean;
  attribution?: string;
};

export const agents: Agent[] = [
  {
    slug: "qingyi-expression",
    name: "清邑表达",
    en: "QINGYI EXPRESSION",
    tagline: "把「说不清楚」变成可量化、可追踪的训练",
    summary:
      "一款表达训练智能体：抽题、录音、转写、分析、追问，最后给出一份能看懂的表达报告。它不评价你「讲得好不好」，而是指出你在哪一句丢了画面、在哪个位置断了气。",
    points: [
      "抽题跟练：5 类题库随机抽题 + 倒计时 + 同步录音，模拟真实临场压力",
      "录音分析：录音 → 转写 → 气口检测 → 五维表达能力报告",
      "深度对话：6 种人设（金牌主持 / 严师 / 知心朋友 / 毒舌损友 / 面试官 / 老记者）追问细节，逼你把抽象词换成画面",
      "报告中心：历史报告、雷达图与五维成长曲线，可导出 TXT",
    ],
    scenarios: ["面试准备", "项目路演", "工作汇报", "课堂试讲", "口播内容创作"],
    stack: ["单文件 HTML 应用", "零安装、零外链", "API Key 只存本机浏览器", "支持 Edge 实时识别或兼容转写接口"],
    media: [{ kind: "video", src: "/media/agents/qingyi-expression.mp4", note: "功能演示" }],
    needsVideo: false,
  },
  {
    slug: "qywrite-x",
    name: "QYWrite X",
    en: "QYWRITE X",
    tagline: "公众号与多平台图文的内容生产流水线",
    summary:
      "面向公众号、小红书、百家号等平台的内容生产工作台：从热点选题、多智能体协作撰写，到排版模板、AI 配图与草稿发布，串成一条可重复使用的流水线。",
    points: [
      "热点选题与全网检索借鉴，选题不必靠灵感",
      "多智能体协作生成正文，并可针对目标形态做结构改写",
      "排版模板与 AI 配图成体系，成稿直接可用",
      "支持草稿箱与发布流程，覆盖图文与长图模式",
    ],
    scenarios: ["公众号内容运营", "多平台矩阵分发", "品牌内容生产"],
    stack: ["Python + FastAPI 本地服务", "多智能体协作框架", "桌面端界面 + 浏览器工作台"],
    media: [
      { kind: "image", src: "/media/agents/qywrite-x-1.jpg", note: "主界面" },
      { kind: "image", src: "/media/agents/qywrite-x-2.jpg", note: "排版与配图" },
    ],
    needsVideo: true,
    attribution: "基于开源项目 AIWriteX 本地化定制；当前仅内部使用，不对外提供服务。原项目采用 Apache-2.0 许可并附附加条款。",
  },
  {
    slug: "matrix-video",
    name: "清邑矩阵视频",
    en: "MATRIX VIDEO",
    tagline: "把实拍素材批量做成可发布的混剪",
    summary:
      "一个混剪矩阵智能体：先建立账号档案与口吻，再把门店实拍素材按分类导入，由系统调度镜头与文案，批量产出风格统一的短视频。网页端负责配置与调度，本机引擎负责真正出片。",
    points: [
      "账号档案：人设口吻直接决定后续文案的语气，不同门店各自独立",
      "素材中心：按人物 / 产品 / 门头 / 店内环境 / 操作过程 / 服务过程分类管理",
      "镜头剪辑与任务中心：批量生成任务包并调度出片",
      "发布排期与账号管理：把「做完」直接接到「发出去」",
    ],
    scenarios: ["门店短视频矩阵", "本地生活商家获客", "多账号内容分发"],
    stack: ["网页端工作台 + 本地引擎", "ffmpeg 出片", "数据存本机 localStorage，不上传云端"],
    media: [],
    needsVideo: true,
  },
  {
    slug: "gesture-fx",
    name: "gesture-fx",
    en: "GESTURE FX STUDIO",
    tagline: "摄像头实时手势识别 + 裸眼 3D 特效",
    summary:
      "正中央一个约占整屏 1/8 的圆形取景窗，其余空间全部留给特效。浏览器调用摄像头，提取 21 个手部关键点，判定手势并实时合成粒子、光环、激光与法阵。",
    points: [
      "21 个手部关键点实时识别，支持双手同框",
      "十余种手势逐一映射特效：张开、握拳、剪刀手、点赞、OK、手枪手势等",
      "四套大招：剑印·万剑归宗、雷印·雷霆法阵、合掌印·森罗结界、火印·爆炎阵",
      "识别模型可切换本地文件，弱网环境照样可用",
    ],
    scenarios: ["互动展陈与展台", "短视频特效素材", "舞台与活动互动", "教学演示"],
    stack: ["单文件 HTML", "MediaPipe HandLandmarker", "浏览器原生摄像头，无需安装"],
    media: [
      { kind: "image", src: "/media/agents/gesture-fx-1.jpg", note: "火印 · 爆炎阵" },
      { kind: "image", src: "/media/agents/gesture-fx-2.jpg", note: "雷印 · 雷霆法阵" },
    ],
    needsVideo: true,
  },
];
