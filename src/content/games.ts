export type Game = {
  slug: string;
  name: string;
  tagline: string;
  desc: string;
  category: string;
  controls: string;
  accent: string;
};

/** 9 个可试玩学生作品（原为 10 个，配对计时赛因源文件缺失已移除） */
export const games: Game[] = [
  {
    slug: "3d-player",
    name: "3D Player",
    tagline: "第一人称视角的立体空间漫游",
    desc: "用键盘与触摸在三维场景里自由移动，是学生第一次把「空间坐标」变成能感知的东西。",
    category: "3D / 探索",
    controls: "键盘 + 触摸",
    accent: "#00e5ff",
  },
  {
    slug: "idiom-battle",
    name: "成语作战",
    tagline: "成语接龙战斗化",
    desc: "把成语积累做成对战玩法，答得越快、连击越高，语文知识变成了要抢的资源。",
    category: "益智 / 语文",
    controls: "触摸点击",
    accent: "#7c5cff",
  },
  {
    slug: "blindbox-shooter",
    name: "打敌人抽盲盒",
    tagline: "射击 + 随机奖励循环",
    desc: "击倒敌人获得盲盒开箱，学生第一次自己调「掉落概率」这个参数，理解随机与期望。",
    category: "动作 / 数值",
    controls: "触摸点击",
    accent: "#ff8a3d",
  },
  {
    slug: "campfire",
    name: "篝火大作战",
    tagline: "限时防守与资源取舍",
    desc: "篝火生命力有限，敌人一波波来。什么时候升级、什么时候硬扛，是一道连续决策题。",
    category: "策略 / 塔防",
    controls: "触摸点击",
    accent: "#ffb020",
  },
  {
    slug: "poop-game",
    name: "今天你拉屎了吗",
    tagline: "幽默外壳下的时间管理",
    desc: "用轻松的题材包装节奏管理玩法，证明好点子不一定需要严肃的外壳。",
    category: "休闲 / 节奏",
    controls: "触摸点击",
    accent: "#8bd450",
  },
  {
    slug: "cat-mouse",
    name: "猫捉老鼠",
    tagline: "追逐与躲避的 AI 行为",
    desc: "学生第一次给「敌人」写决策规则，老鼠的反应速度就是他们自己设的参数。",
    category: "动作 / AI 行为",
    controls: "触摸 / 指针",
    accent: "#00e5ff",
  },
  {
    slug: "era-fighter",
    name: "时代战机",
    tagline: "纵向弹幕射击",
    desc: "从敌机生成、弹道到爆炸反馈，一整套射击游戏的核心循环在这里跑通。",
    category: "动作 / 射击",
    controls: "触摸拖动",
    accent: "#ff5470",
  },
  {
    slug: "drink-matching",
    name: "饮料配对计时赛",
    tagline: "限时记忆配对",
    desc: "把记忆训练做成计时挑战，难度曲线由学生自己设计并反复调试。",
    category: "益智 / 记忆",
    controls: "触摸点击",
    accent: "#3ddc97",
  },
  {
    slug: "zhaoyun",
    name: "赵云与阿斗",
    tagline: "三国题材闯关",
    desc: "用历史故事做关卡背景，把角色控制、碰撞判定与关卡节奏整合成一个完整关卡。",
    category: "动作 / 闯关",
    controls: "键盘 + 触摸",
    accent: "#e0c060",
  },
];

export const gameCategories = ["全部", ...Array.from(new Set(games.map((g) => g.category)))];
