import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import MagneticButton from "../components/ui/MagneticButton";
import { agents } from "../content/agents";

export default function Agents() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_70%_-20%,rgba(124,92,255,0.14),transparent_60%)]" />
        <div className="wrap relative">
          <Reveal>
            <div className="eyebrow mb-5">02 / CUSTOM AGENTS</div>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="h1 max-w-3xl">按业务流程定制的智能体，不是套模板</h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="lead mt-6 max-w-2xl">
              下面四个都已在真实场景中每天使用。它们多数跑在本机：数据不出本地，Key 存在你自己的浏览器里。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="wrap">
          <div className="grid gap-5 md:grid-cols-2">
            {agents.map((a, i) => (
              <Reveal key={a.slug} delay={((i % 2) + 1) as 1 | 2}>
                <Link to={`/agents/${a.slug}`} className="card card-hover group flex h-full flex-col p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="num text-[10px] tracking-[0.2em] text-muted">{a.en}</span>
                      <h2 className="h3 mt-3">{a.name}</h2>
                    </div>
                    {a.needsVideo && (
                      <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[10px] text-muted">
                        解说待补录
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-[14px] text-fg/90">{a.tagline}</p>
                  <p className="body mt-3 flex-1 text-[13px]">{a.summary}</p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {a.stack.slice(0, 3).map((s) => (
                      <span key={s} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted">{s}</span>
                    ))}
                  </div>
                  <div className="mt-7 flex items-center gap-2 text-[13px] text-cyan">
                    查看详情 <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={2}>
            <div className="card mt-8 flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
              <div>
                <h3 className="h3">你的流程里也有那种「重复又靠经验」的活？</h3>
                <p className="body mt-2 text-sm">聊一次，我们判断它适不适合做成智能体。</p>
              </div>
              <MagneticButton href="mailto:hanzimu649689@gmail.com?subject=定制智能体%20咨询">
                说说你的场景
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
