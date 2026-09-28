import Reveal from "../components/ui/Reveal";
import MagneticButton from "../components/ui/MagneticButton";
import { site } from "../content/site";

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_40%_-15%,rgba(0,229,255,0.12),transparent_60%)]" />
        <div className="wrap relative">
          <Reveal>
            <div className="eyebrow mb-5">ABOUT</div>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="h1 max-w-3xl">{site.tagline}</h1>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_0.8fr]">
          <div className="max-w-2xl space-y-6">
            {site.about.map((para, i) => (
              <Reveal key={i} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <p className={i === 0 ? "text-[16px] leading-[1.9] text-fg/90" : "body"}>{para}</p>
              </Reveal>
            ))}
          </div>

          <div className="space-y-6">
            <Reveal delay={1}>
              <div className="card p-7">
                <div className="eyebrow mb-5">联系方式</div>
                <a href={`mailto:${site.contact.email}`} className="num block text-[14px] text-fg transition-colors hover:text-cyan">
                  {site.contact.email}
                </a>
                <div className="mt-6">
                  <MagneticButton href={`mailto:${site.contact.email}`}>发送邮件</MagneticButton>
                </div>
              </div>
            </Reveal>

            <Reveal delay={2}>
              <div className="card p-7">
                <div className="eyebrow mb-5">关于本站</div>
                <ul className="space-y-3 text-[12.5px] leading-relaxed text-muted">
                  <li>· 三维部分由 Blender 工程直接导出，保留原始分件层级与命名。</li>
                  <li>· 所有滚动动画都是滚动进度的纯函数，反向滚动会精确回到对应状态。</li>
                  <li>· 移动端与低端设备自动降低精度，并提供静态降级版本。</li>
                  <li>· 本站不收集访客行为数据，没有第三方统计脚本。</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
