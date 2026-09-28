import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductStage from "../components/three/ProductStage";
import Reveal from "../components/ui/Reveal";
import MagneticButton from "../components/ui/MagneticButton";
import { cameraTimeline } from "../config/timeline/camera";
import { watchTimeline } from "../config/timeline/watch";
import { productBySlug, products } from "../content/products";
import { scrollToProgress, setScrollLocked, useScrollProgress, useSmoothScroll } from "../lib/scroll";
import NotFound from "./NotFound";

/** 每个章节占用的滚动高度（视口倍数）。总进度 = 全部章节共享。 */
const CH = 150;

export default function ProductPage() {
  const { slug = "" } = useParams();
  const product = productBySlug(slug);
  const timeline = slug === "camera" ? cameraTimeline : slug === "watch" ? watchTimeline : null;

  useSmoothScroll();

  const [interactive, setInteractive] = useState(false);
  /** 视频降级模式：弱设备、reduced-motion 或用户手动切换 */
  const [videoMode, setVideoMode] = useState(false);
  const progress = useScrollProgress();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number };
    const lowEnd = (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) || (nav.hardwareConcurrency ?? 8) <= 4;
    if (reduce || lowEnd) setVideoMode(true);
  }, []);

  const debug = useMemo(
    () => (typeof window === "undefined" ? false : new URLSearchParams(window.location.search).get("debug") === "parts"),
    [],
  );

  useEffect(() => {
    setScrollLocked(interactive);
    return () => setScrollLocked(false);
  }, [interactive]);

  useEffect(() => {
    if (!interactive) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setInteractive(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [interactive]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (!product || !timeline) return <NotFound />;

  const chapters = product.chapters;
  const n = chapters.length;
  const active = Math.min(n - 1, Math.max(0, Math.floor(progress * n)));
  const other = products.find((p) => p.slug !== product.slug)!;

  return (
    <>
      {!videoMode && (
        <ProductStage
          url={`${import.meta.env.BASE_URL}${product.model.replace(/^\//, "")}`}
          partsUrl={`${import.meta.env.BASE_URL}${product.parts.replace(/^\//, "")}`}
          timeline={timeline}
          interactive={interactive}
          debug={debug}
        />
      )}

      {/* 降级通道：同一份内容的视频版本，弱网/低端设备与 reduced-motion 用户走这里 */}
      {videoMode && (
        <div className="fixed inset-0 z-[1]">
          <video
            className="h-full w-full object-cover opacity-70"
            src={`${import.meta.env.BASE_URL}media/products/${product.slug}-demo.mp4`}
            autoPlay={!window.matchMedia("(prefers-reduced-motion: reduce)").matches}
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,transparent,#05070a_88%)]" />
        </div>
      )}

      {/* 顶部信息条：始终在 3D 之上，保证任何时候都能操作 */}
      <div className="fixed inset-x-0 top-14 z-40 border-b border-line bg-ink/70 backdrop-blur-xl">
        <div className="wrap-wide flex h-11 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/digital-twin" className="shrink-0 text-xs text-muted transition-colors hover:text-fg">← 数字孪生</Link>
            <span className="hidden truncate text-xs text-muted sm:inline">
              {product.kind} · {product.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="num text-[11px] text-muted">
              {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => setVideoMode((v) => !v)}
              className="rounded-full border border-line px-3.5 py-1.5 text-[12px] text-muted transition-colors hover:border-cyan/50 hover:text-fg"
            >
              {videoMode ? "切到三维" : "视频版"}
            </button>
            {!videoMode && (
              <button
                type="button"
                onClick={() => setInteractive((v) => !v)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  interactive ? "bg-cyan text-ink" : "border border-line text-fg hover:border-cyan/60 hover:text-cyan"
                }`}
              >
                {interactive ? "退出交互" : "360° 查看"}
              </button>
            )}
          </div>
        </div>
        <div className="h-px w-full bg-line">
          <div className="h-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${(progress * 100).toFixed(2)}%` }} />
        </div>
      </div>

      {/* 章节导航 */}
      <nav
        aria-label="章节"
        className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2.5 lg:flex"
      >
        {chapters.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => scrollToProgress((i + 0.5) / n)}
            className="group flex items-center gap-2.5 text-left"
            aria-current={i === active}
          >
            <span
              className={`h-px transition-all duration-300 ${
                i === active ? "w-7 bg-cyan" : "w-3.5 bg-line group-hover:w-5 group-hover:bg-muted"
              }`}
            />
            <span className={`num text-[10px] transition-colors ${i === active ? "text-cyan" : "text-muted group-hover:text-fg"}`}>
              {c.no}
            </span>
          </button>
        ))}
      </nav>

      {/* 章节内容 */}
      <div className="overlay">
        {chapters.map((c, i) => {
          const left = i % 2 === 0;
          return (
            <section key={c.id} className="chapter" style={{ minHeight: `${CH}vh` }}>
              <div className="sticky top-0 flex h-[100svh] items-center">
                <div className="wrap-wide w-full">
                  <div className={`max-w-[430px] ${left ? "" : "ml-auto"} ${interactive ? "opacity-25" : ""} transition-opacity duration-300`}>
                    <Reveal>
                      <div className="eyebrow mb-4">
                        {c.no} — {c.title}
                      </div>
                    </Reveal>
                    <Reveal delay={1}>
                      <h2 className="h2">{c.lead}</h2>
                    </Reveal>
                    <Reveal delay={2}>
                      <ul className="mt-7 space-y-3 border-l border-line pl-5">
                        {c.bullets.map((b) => (
                          <li key={b} className="text-[13.5px] leading-relaxed text-muted">{b}</li>
                        ))}
                      </ul>
                    </Reveal>
                    {i === 0 && (
                      <Reveal delay={3}>
                        <div className="mt-9 flex flex-wrap gap-3">
                          <MagneticButton to={`/digital-twin/${other.slug}`} variant="ghost">
                            看{other.name}
                          </MagneticButton>
                        </div>
                      </Reveal>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* 参数与规格 */}
        <section className="section border-t border-line">
          <div className="wrap">
            <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
              <div>
                <Reveal>
                  <div className="eyebrow mb-4">SPEC</div>
                </Reveal>
                <Reveal delay={1}>
                  <h2 className="h2">{product.name} · 数字孪生</h2>
                </Reveal>
                <Reveal delay={2}>
                  <p className="body mt-5">{product.summary}</p>
                </Reveal>
                <Reveal delay={3}>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <MagneticButton href={`mailto:hanzimu649689@gmail.com?subject=${encodeURIComponent(product.name + " 数字孪生咨询")}`}>
                      咨询同类项目
                    </MagneticButton>
                  </div>
                </Reveal>
              </div>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
                {product.stats.map((s) => (
                  <div key={s.k} className="bg-panel p-6">
                    <div className="num text-xl text-fg">{s.v}</div>
                    <div className="mt-1 text-[11px] text-muted">{s.k}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 交互模式提示 */}
      {interactive && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center">
          <div className="glass rounded-full px-5 py-2.5 text-[12px] text-muted">
            拖动旋转 · 滚轮缩放 · 按 <span className="num text-cyan">ESC</span> 或点右上角退出
          </div>
        </div>
      )}

      {!interactive && !videoMode && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center">
          <span className="hint">
            <i />
            滚动驱动拆解 · 反向滚动会精确回退
          </span>
        </div>
      )}
      {videoMode && (
        <div className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
          <span className="num text-[10px] tracking-[0.18em] text-muted">视频降级模式</span>
        </div>
      )}
    </>
  );
}
