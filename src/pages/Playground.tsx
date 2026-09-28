import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import { gameCategories, games } from "../content/games";

export default function Playground() {
  const [cat, setCat] = useState("全部");
  const list = useMemo(() => (cat === "全部" ? games : games.filter((g) => g.category === cat)), [cat]);
  const base = import.meta.env.BASE_URL;

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_-20%,rgba(124,92,255,0.13),transparent_60%)]" />
        <div className="wrap relative">
          <Reveal>
            <Link to="/training" className="text-xs text-muted transition-colors hover:text-fg">← AI 培训</Link>
          </Reveal>
          <Reveal delay={1}>
            <div className="eyebrow mt-8">PLAYGROUND</div>
          </Reveal>
          <Reveal delay={2}>
            <h1 className="h1 mt-4">试玩学生作品</h1>
          </Reveal>
          <Reveal delay={3}>
            <p className="lead mt-5 max-w-2xl">
              {games.length} 个可直接运行的小游戏。每个都是学生自己完成的作品——点开就能玩，不需要安装任何东西。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="wrap">
          <div className="mb-8 flex flex-wrap gap-2">
            {gameCategories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] transition-colors ${
                  cat === c ? "bg-cyan text-ink" : "border border-line text-muted hover:border-cyan/50 hover:text-fg"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((g, i) => (
              <Reveal key={g.slug} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <Link to={`/training/play/${g.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden">
                  <div
                    className="relative aspect-[16/10] overflow-hidden"
                    style={{ background: `radial-gradient(110% 110% at 50% 0%, ${g.accent}22, #080c12 72%)` }}
                  >
                    <img
                      src={`${base}games/${g.slug}/cover.png`}
                      alt={g.name}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                    />
                    <span className="absolute right-3 top-3 rounded-full bg-ink/75 px-2.5 py-1 text-[10px] text-muted">{g.category}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="h3">{g.name}</div>
                    <p className="mt-2 flex-1 text-[13px] text-muted">{g.desc}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                      <span className="text-[11px] text-muted">{g.controls}</span>
                      <span className="text-[12.5px] text-cyan">开始试玩 →</span>
                    </div>
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
