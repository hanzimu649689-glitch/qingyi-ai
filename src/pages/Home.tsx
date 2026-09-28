import { Link } from "react-router-dom";
import HeroCanvas from "../components/ui/HeroCanvas";
import MagneticButton from "../components/ui/MagneticButton";
import Reveal from "../components/ui/Reveal";
import SectionHead from "../components/ui/SectionHead";
import { site } from "../content/site";
import { products } from "../content/products";
import { agents } from "../content/agents";
import { games } from "../content/games";

export default function Home() {
  return (
    <>
      {/* ============ Hero ============ */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <HeroCanvas />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(0,229,255,0.14),transparent_58%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink to-transparent" />

        <div className="wrap relative flex min-h-[100svh] flex-col justify-center pt-24 pb-20">
          <Reveal>
            <div className="eyebrow mb-6">QINGYI AI · 数字孪生 · 定制智能体 · AI 培训</div>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="h-display max-w-4xl">
              把 AI 做成
              <br />
              <span className="text-grad">能交付的东西</span>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="lead mt-7 max-w-xl">{site.introShort}</p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <MagneticButton to="/digital-twin">
                看产品数字孪生
                <span aria-hidden>→</span>
              </MagneticButton>
              <MagneticButton to="/agents" variant="ghost">
                定制智能体
              </MagneticButton>
            </div>
          </Reveal>

          <div className="mt-16 flex items-center gap-3 md:absolute md:bottom-10 md:left-[clamp(1.1rem,4vw,2.6rem)] md:mt-0">
            <span className="hint">
              <i />
              向下滚动
            </span>
          </div>
        </div>
      </section>

      {/* ============ 三大业务 ============ */}
      <section className="section border-t border-line">
        <div className="wrap">
          <SectionHead
            eyebrow="WHAT WE DO"
            title={<>三条业务线，一条判断标准</>}
            lead="能不能被真正用起来、能不能持续产生价值——这是我们判断所有工作的同一把尺子。"
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {site.services.map((s, i) => (
              <Reveal key={s.id} delay={(i + 1) as 1 | 2 | 3}>
                <Link
                  to={s.id === "digital-twin" ? "/digital-twin" : s.id === "agents" ? "/agents" : "/training"}
                  className="card card-hover group block h-full p-7"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="num text-xs text-muted">{s.no}</span>
                    <span className="num text-[10px] tracking-[0.18em] text-muted">{s.en.toUpperCase()}</span>
                  </div>
                  <h3 className="h3 mt-8">{s.title}</h3>
                  <p className="body mt-3 text-sm">{s.summary}</p>
                  <ul className="mt-6 space-y-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-[13px] text-muted">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-cyan" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex items-center gap-2 text-[13px] text-cyan opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    了解详情 <span aria-hidden>→</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 数字孪生预览 ============ */}
      <section className="section border-t border-line">
        <div className="wrap">
          <SectionHead
            eyebrow="01 / DIGITAL TWIN"
            title={<>把产品拆开讲，比说一百句话有用</>}
            lead="两台真实产品，全部零件保留独立层级。滚动页面，装配顺序会被逆向播放成一次爆炸拆解，再准确归位。"
            right={<MagneticButton to="/digital-twin" variant="ghost">进入数字孪生</MagneticButton>}
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={(i + 1) as 1 | 2}>
                <Link to={`/digital-twin/${p.slug}`} className="card card-hover group relative block overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[radial-gradient(80%_80%_at_50%_20%,#0d1524,#070a0f)]">
                    <img
                      src={`${import.meta.env.BASE_URL}media/products/${p.slug}-cover.jpg`}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-80 transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04] group-hover:opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                  </div>
                  <div className="p-7">
                    <div className="flex items-center justify-between">
                      <span className="eyebrow">{p.kind}</span>
                      <span className="num text-[10px] tracking-[0.18em] text-muted">{p.en}</span>
                    </div>
                    <h3 className="h3 mt-4">{p.name}</h3>
                    <p className="body mt-2 text-sm">{p.tagline}</p>
                    <div className="mt-6 flex gap-6">
                      {p.stats.slice(0, 2).map((s) => (
                        <div key={s.k}>
                          <div className="num text-lg text-fg">{s.v}</div>
                          <div className="text-[11px] text-muted">{s.k}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 智能体 ============ */}
      <section className="section border-t border-line">
        <div className="wrap">
          <SectionHead
            eyebrow="02 / CUSTOM AGENTS"
            title={<>四个已经在跑的智能体</>}
            lead="它们不是演示品，而是在真实业务里每天使用的工具。"
            right={<MagneticButton to="/agents" variant="ghost">全部智能体</MagneticButton>}
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 4 + 1) as 1 | 2 | 3 | 4}>
                <Link to={`/agents/${a.slug}`} className="card card-hover group flex h-full flex-col p-6">
                  <span className="num text-[10px] tracking-[0.18em] text-muted">{a.en}</span>
                  <h3 className="h3 mt-6">{a.name}</h3>
                  <p className="body mt-3 flex-1 text-[13px]">{a.tagline}</p>
                  <div className="mt-6 flex items-center gap-2 text-[13px] text-cyan opacity-0 transition-opacity group-hover:opacity-100">
                    查看 <span aria-hidden>→</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 培训 ============ */}
      <section className="section border-t border-line">
        <div className="wrap">
          <div className="grid gap-14 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <Reveal>
                <div className="eyebrow mb-4">03 / AI EDUCATION</div>
              </Reveal>
              <Reveal delay={1}>
                <h2 className="h2">
                  让孩子先做出一个
                  <br />
                  能玩的东西
                </h2>
              </Reveal>
              <Reveal delay={2}>
                <p className="lead mt-5 max-w-lg">
                  我们不在黑板上讲人工智能。每个孩子的终点，是一个能运行、能分享、能被别人玩的作品——
                  这 9 个游戏都是学生自己做的。
                </p>
              </Reveal>
              <Reveal delay={3}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <MagneticButton to="/training">了解课程</MagneticButton>
                  <MagneticButton to="/training/playground" variant="ghost">直接试玩</MagneticButton>
                </div>
              </Reveal>
            </div>
            <Reveal delay={2}>
              <div className="grid grid-cols-3 gap-3">
                {games.slice(0, 9).map((g) => (
                  <Link
                    key={g.slug}
                    to={`/training/play/${g.slug}`}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-line"
                    style={{ background: `radial-gradient(120% 120% at 50% 0%, ${g.accent}22, #080c12 70%)` }}
                    title={g.name}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}games/${g.slug}/cover.png`}
                      alt={g.name}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="section border-t border-line">
        <div className="wrap">
          <div className="card grain relative overflow-hidden p-10 md:p-16">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.16),transparent_65%)]" />
            <div className="relative">
              <Reveal>
                <h2 className="h2 max-w-2xl">有想拆开讲清楚的产品，或者想交给 AI 的重复工作？</h2>
              </Reveal>
              <Reveal delay={1}>
                <p className="lead mt-5 max-w-xl">说说你的场景，我们判断能不能做、怎么做最省事。</p>
              </Reveal>
              <Reveal delay={2}>
                <div className="mt-9">
                  <MagneticButton href={`mailto:${site.contact.email}`}>
                    {site.contact.email}
                  </MagneticButton>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
