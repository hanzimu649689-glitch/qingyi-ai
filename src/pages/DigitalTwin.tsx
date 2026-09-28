import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import SectionHead from "../components/ui/SectionHead";
import MagneticButton from "../components/ui/MagneticButton";
import { products } from "../content/products";

export default function DigitalTwin() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_-20%,rgba(0,229,255,0.12),transparent_60%)]" />
        <div className="wrap relative">
          <Reveal>
            <div className="eyebrow mb-5">01 / DIGITAL TWIN</div>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="h1 max-w-3xl">把真实产品搬进浏览器，然后拆开给你看</h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="lead mt-6 max-w-2xl">
              直接从 Blender 工程导出，保留原始分件层级、材质与旋转中心。
              滚动页面时，装配顺序被逆向播放成一次爆炸拆解，再沿原路准确归位——
              正向与反向滚动看到的是同一份状态，不会累计漂移。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="wrap">
          <div className="grid gap-6 md:grid-cols-2">
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={(i + 1) as 1 | 2}>
                <Link to={`/digital-twin/${p.slug}`} className="card card-hover group block overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[radial-gradient(80%_80%_at_50%_15%,#0e1728,#070a0f)]">
                    <img
                      src={`${import.meta.env.BASE_URL}media/products/${p.slug}-cover.jpg`}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-75 transition-all duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04] group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                      <div>
                        <div className="eyebrow mb-2">{p.kind}</div>
                        <div className="h3">{p.name}</div>
                      </div>
                      <span className="num text-[11px] text-muted">{p.en}</span>
                    </div>
                  </div>
                  <div className="p-7">
                    <p className="body text-sm">{p.tagline}</p>
                    <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
                      {p.stats.map((s) => (
                        <div key={s.k}>
                          <div className="num text-base text-fg">{s.v}</div>
                          <div className="text-[11px] text-muted">{s.k}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-7 flex items-center gap-2 text-[13px] text-cyan">
                      进入三维拆解 <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line">
        <div className="wrap">
          <SectionHead
            eyebrow="HOW IT WORKS"
            title="这套东西是怎么做出来的"
            lead="不涉及任何玄学，全部是可复现的工程步骤。"
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
            {[
              { n: "01", t: "只读接入", d: "原始 .blend 一律只读打开，先复制工作副本，原工程零改动。" },
              { n: "02", t: "保留层级导出", d: "保留对象层级、父子关系、材质槽与初始变换；需要独立运动的零件绝不合并。" },
              { n: "03", t: "按设备优化", d: "高模减面、纹理限尺寸、几何 Draco 压缩，桌面与移动端分档。" },
              { n: "04", t: "滚动驱动", d: "所有状态是滚动进度的纯函数，反向滚动精确回退，不用第二套模型伪装归位。" },
            ].map((s, i) => (
              <Reveal key={s.n} delay={(i + 1) as 1 | 2 | 3 | 4}>
                <div className="h-full bg-panel p-7">
                  <div className="num text-xs text-cyan">{s.n}</div>
                  <h3 className="h3 mt-6">{s.t}</h3>
                  <p className="body mt-3 text-[13px]">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={2}>
            <div className="mt-10">
              <MagneticButton href="mailto:hanzimu649689@gmail.com?subject=数字孪生%20咨询">咨询你的产品</MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
