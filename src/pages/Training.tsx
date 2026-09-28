import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import SectionHead from "../components/ui/SectionHead";
import MagneticButton from "../components/ui/MagneticButton";
import { training } from "../content/training";
import { games } from "../content/games";

export default function Training() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_30%_-15%,rgba(0,229,255,0.13),transparent_60%)]" />
        <div className="wrap relative">
          <Reveal>
            <div className="eyebrow mb-5">{training.eyebrow}</div>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="h1 max-w-3xl">{training.title}</h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="lead mt-6 max-w-2xl">{training.lead}</p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-9 flex flex-wrap gap-3">
              <MagneticButton to="/training/playground">试玩学生作品</MagneticButton>
              <MagneticButton href="mailto:hanzimu649689@gmail.com?subject=少儿%20AI%20培训咨询" variant="ghost">
                咨询报名
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section border-t border-line">
        <div className="wrap">
          <SectionHead eyebrow="APPROACH" title="我们的四条原则" />
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {training.philosophy.map((p, i) => (
              <Reveal key={p.k} delay={(i + 1) as 1 | 2 | 3 | 4}>
                <div className="h-full bg-panel p-7">
                  <div className="num text-xs text-cyan">{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="h3 mt-6">{p.k}</h3>
                  <p className="body mt-3 text-[13px]">{p.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line">
        <div className="wrap">
          <SectionHead eyebrow="LEARNING PATH" title="一个孩子会经历的四个阶段" />
          <div className="mt-12 space-y-px overflow-hidden rounded-xl border border-line bg-line">
            {training.path.map((s, i) => (
              <Reveal key={s.step} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <div className="flex flex-col gap-3 bg-panel p-7 sm:flex-row sm:items-center sm:gap-10">
                  <span className="num text-xs text-cyan sm:w-14">{s.step}</span>
                  <h3 className="h3 sm:w-64">{s.title}</h3>
                  <p className="body flex-1 text-[13.5px]">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {training.audience.map((a, i) => (
              <Reveal key={a.k} delay={(i + 1) as 1 | 2 | 3 | 4}>
                <div className="h-full bg-panel p-7">
                  <div className="text-[11px] text-muted">{a.k}</div>
                  <div className="mt-2 text-[14px] text-fg">{a.v}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line">
        <div className="wrap">
          <SectionHead
            eyebrow="STUDENT WORK"
            title="这些游戏都是学生做的"
            lead="点开就能玩。它们不是教学示例，是孩子们真正完成并愿意拿给别人玩的作品。"
            right={<MagneticButton to="/training/playground" variant="ghost">进入试玩大厅</MagneticButton>}
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {games.map((g, i) => (
              <Reveal key={g.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <Link to={`/training/play/${g.slug}`} className="card card-hover group block overflow-hidden">
                  <div className="relative aspect-square overflow-hidden" style={{ background: `radial-gradient(110% 110% at 50% 0%, ${g.accent}1f, #080c12 72%)` }}>
                    <img
                      src={`${import.meta.env.BASE_URL}games/${g.slug}/cover.png`}
                      alt={g.name}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-75 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                  </div>
                  <div className="p-4">
                    <div className="truncate text-[13.5px] text-fg">{g.name}</div>
                    <div className="mt-1 truncate text-[11px] text-muted">{g.tagline}</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
