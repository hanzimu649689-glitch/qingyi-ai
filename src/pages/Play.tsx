import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { games } from "../content/games";
import NotFound from "./NotFound";

/**
 * 单游戏沙箱页。
 * 同一时刻只挂载一个 iframe；离开页面时 React 会卸载 iframe，从而释放其 WebGL/音频上下文。
 */
export default function Play() {
  const { slug = "" } = useParams();
  const game = games.find((g) => g.slug === slug);
  const [nonce, setNonce] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoaded(false);
    setStarted(false);
  }, [slug, nonce]);

  useEffect(() => {
    const onFs = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggleFull = useCallback(async () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await el.requestFullscreen?.();
  }, []);

  if (!game) return <NotFound />;

  const src = `${import.meta.env.BASE_URL}games/${game.slug}/index.html`;
  const idx = games.findIndex((g) => g.slug === game.slug);
  const prev = games[(idx - 1 + games.length) % games.length];
  const next = games[(idx + 1) % games.length];

  return (
    <div className="pt-14">
      {/* 工具条 */}
      <div className="sticky top-14 z-40 border-b border-line bg-ink/85 backdrop-blur-xl">
        <div className="wrap-wide flex h-12 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/training/playground" className="shrink-0 text-xs text-muted transition-colors hover:text-fg">
              ← 试玩大厅
            </Link>
            <span className="truncate text-[13px] text-fg">{game.name}</span>
            <span className="hidden shrink-0 rounded-full border border-line px-2 py-0.5 text-[10px] text-muted sm:inline">
              {game.controls}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setNonce((v) => v + 1)}
              className="rounded-full border border-line px-3 py-1.5 text-[12px] text-muted transition-colors hover:border-cyan/50 hover:text-fg"
            >
              重新开始
            </button>
            <button
              type="button"
              onClick={toggleFull}
              className="rounded-full border border-line px-3 py-1.5 text-[12px] text-muted transition-colors hover:border-cyan/50 hover:text-fg"
            >
              {isFull ? "退出全屏" : "全屏"}
            </button>
          </div>
        </div>
      </div>

      {/* 游戏区域 */}
      <div className="wrap-wide py-6">
        <div
          ref={wrapRef}
          className="relative overflow-hidden rounded-xl border border-line bg-black"
          style={{ aspectRatio: "16 / 9" }}
        >
          {!loaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-panel">
              <div className="eyebrow">游戏加载中</div>
              <div className="h-[2px] w-40 overflow-hidden bg-line">
                <div className="anim-scan h-full w-1/3 bg-cyan" />
              </div>
            </div>
          )}

          <iframe
            key={`${game.slug}-${nonce}`}
            src={src}
            title={game.name}
            onLoad={() => setLoaded(true)}
            className="h-full w-full border-0"
            allow="autoplay; fullscreen; gamepad"
            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups allow-forms allow-modals"
          />

          {/* 首次点击提示：避免游戏抢走键盘与滚动 */}
          {loaded && !started && (
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-ink/55 backdrop-blur-[2px] transition-opacity"
            >
              <span className="rounded-full bg-cyan px-5 py-2.5 text-sm font-medium text-ink">点击画面开始操控</span>
              <span className="text-[12px] text-muted">
                操作方式：{game.controls} · 按 ESC 可退出全屏
              </span>
            </button>
          )}
        </div>

        {/* 玩法说明 */}
        <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <span className="eyebrow">{game.category}</span>
              <span className="num text-[11px] text-muted">{String(idx + 1).padStart(2, "0")} / {String(games.length).padStart(2, "0")}</span>
            </div>
            <h1 className="h3 mt-4">{game.name}</h1>
            <p className="mt-2 text-[13px] text-cyan">{game.tagline}</p>
            <p className="body mt-4 text-[13.5px]">{game.desc}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link to={`/training/play/${prev.slug}`} className="rounded-full border border-line px-3.5 py-1.5 text-[12px] text-muted transition-colors hover:text-fg">
                ← {prev.name}
              </Link>
              <Link to={`/training/play/${next.slug}`} className="rounded-full border border-line px-3.5 py-1.5 text-[12px] text-muted transition-colors hover:text-fg">
                {next.name} →
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <div className="eyebrow mb-4">运行提示</div>
            <ul className="space-y-3 text-[12.5px] text-muted">
              <li>· 游戏在本页沙箱中独立运行，关闭页面即释放资源。</li>
              <li>· 声音由游戏自身在首次交互后开启，符合浏览器自动播放策略。</li>
              <li>· 需要键盘操作的游戏，建议在电脑上体验；移动端可用触摸操作。</li>
              <li>· 若画面显示不全，请点上方「全屏」。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
