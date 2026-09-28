import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import MagneticButton from "../components/ui/MagneticButton";
import { agents } from "../content/agents";
import NotFound from "./NotFound";

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/92 p-4" onClick={onClose} role="dialog" aria-modal>
      <div className="relative max-h-[92vh] max-w-6xl">
        <img src={src} alt="" className="max-h-[92vh] w-auto rounded-lg border border-line" />
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 text-xs text-muted transition-colors hover:text-fg"
        >
          关闭 ESC
        </button>
      </div>
    </div>
  );
}

export default function AgentDetail() {
  const { slug = "" } = useParams();
  const agent = agents.find((a) => a.slug === slug);
  const [zoom, setZoom] = useState<string | null>(null);
  if (!agent) return <NotFound />;

  const base = import.meta.env.BASE_URL;

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_30%_-10%,rgba(0,229,255,0.12),transparent_60%)]" />
        <div className="wrap relative">
          <Reveal>
            <Link to="/agents" className="text-xs text-muted transition-colors hover:text-fg">← 定制智能体</Link>
          </Reveal>
          <Reveal delay={1}>
            <div className="eyebrow mt-8">{agent.en}</div>
          </Reveal>
          <Reveal delay={2}>
            <h1 className="h1 mt-4 max-w-3xl">{agent.name}</h1>
          </Reveal>
          <Reveal delay={3}>
            <p className="lead mt-5 max-w-2xl">{agent.tagline}</p>
          </Reveal>
          <Reveal delay={4}>
            <p className="body mt-6 max-w-2xl">{agent.summary}</p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="wrap grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-10">
            <Reveal>
              <div>
                <div className="eyebrow mb-5">能力</div>
                <ul className="space-y-4">
                  {agent.points.map((p) => (
                    <li key={p} className="flex gap-3 border-b border-line pb-4 text-[14px] text-fg/90">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-cyan" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div>
                <div className="eyebrow mb-5">适用场景</div>
                <div className="flex flex-wrap gap-2">
                  {agent.scenarios.map((s) => (
                    <span key={s} className="rounded-full border border-line px-3 py-1.5 text-[12px] text-muted">{s}</span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={2}>
              <div>
                <div className="eyebrow mb-5">技术形态</div>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {agent.stack.map((s) => (
                    <li key={s} className="rounded-lg border border-line bg-panel px-4 py-3 text-[12.5px] text-muted">{s}</li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {agent.attribution && (
              <Reveal delay={2}>
                <div className="rounded-lg border border-line bg-panel/60 p-5 text-[12.5px] leading-relaxed text-muted">
                  <span className="text-fg">来源说明：</span>
                  {agent.attribution}
                </div>
              </Reveal>
            )}
          </div>

          <div className="space-y-6">
            <Reveal delay={1}>
              <div className="card overflow-hidden">
                <div className="border-b border-line px-5 py-3">
                  <span className="eyebrow">演示</span>
                </div>
                {agent.media.length === 0 && (
                  <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-[radial-gradient(70%_70%_at_50%_30%,#0d1524,#070a0f)] p-8 text-center">
                    <div className="num text-[11px] tracking-[0.2em] text-muted">DEMO PENDING</div>
                    <p className="max-w-[240px] text-[12.5px] text-muted">
                      该智能体的使用解说视频待补录。素材就绪后会替换到此处。
                    </p>
                  </div>
                )}
                {agent.media.map((m, i) =>
                  m.kind === "video" ? (
                    <video
                      key={i}
                      src={`${base}${m.src.replace(/^\//, "")}`}
                      className="aspect-video w-full bg-ink object-cover"
                      controls
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setZoom(`${base}${m.src.replace(/^\//, "")}`)}
                      className="group relative block w-full border-b border-line last:border-0"
                    >
                      <img
                        src={`${base}${m.src.replace(/^\//, "")}`}
                        alt={m.note ?? agent.name}
                        loading="lazy"
                        className="w-full transition-opacity duration-300 group-hover:opacity-85"
                      />
                      {m.note && (
                        <span className="absolute bottom-2 left-3 rounded bg-ink/70 px-2 py-1 text-[11px] text-muted">{m.note}</span>
                      )}
                    </button>
                  ),
                )}
              </div>
            </Reveal>

            <Reveal delay={2}>
              <div className="card p-6">
                <div className="eyebrow mb-4">想看它跑起来？</div>
                <p className="body mb-5 text-[13px]">
                  这些智能体多为本地运行，需要按你的业务场景做适配。可以先聊使用方式。
                </p>
                <MagneticButton href={`mailto:hanzimu649689@gmail.com?subject=${encodeURIComponent(agent.name + " 咨询")}`}>
                  联系我们
                </MagneticButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {zoom && <Lightbox src={zoom} onClose={() => setZoom(null)} />}
    </>
  );
}
