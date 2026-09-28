import { useState } from "react";
import Reveal from "../components/ui/Reveal";
import MagneticButton from "../components/ui/MagneticButton";
import { site } from "../content/site";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="relative overflow-hidden pt-36 pb-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(0,229,255,0.13),transparent_62%)]" />
      <div className="wrap relative max-w-3xl">
        <Reveal>
          <div className="eyebrow mb-5">CONTACT</div>
        </Reveal>
        <Reveal delay={1}>
          <h1 className="h1">聊聊你的项目</h1>
        </Reveal>
        <Reveal delay={2}>
          <p className="lead mt-6">
            不管是想给产品做一套三维展示、把某个重复流程交给智能体，还是咨询少儿 AI 培训，
            都可以直接发邮件。我们通常在 1 个工作日内回复。
          </p>
        </Reveal>

        <Reveal delay={3}>
          <div className="card mt-12 p-8">
            <div className="eyebrow mb-4">邮箱</div>
            <div className="flex flex-wrap items-center gap-4">
              <a href={`mailto:${site.contact.email}`} className="num text-lg text-fg transition-colors hover:text-cyan">
                {site.contact.email}
              </a>
              <button
                type="button"
                onClick={copy}
                className="rounded-full border border-line px-3.5 py-1.5 text-[12px] text-muted transition-colors hover:border-cyan/50 hover:text-fg"
              >
                {copied ? "已复制" : "复制"}
              </button>
            </div>
            <div className="mt-7">
              <MagneticButton href={`mailto:${site.contact.email}`}>写邮件给我们</MagneticButton>
            </div>
          </div>
        </Reveal>

        <Reveal delay={4}>
          <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
            {[
              { k: "三维 / 数字孪生", v: "产品拆解展示、工业可视化" },
              { k: "定制智能体", v: "内容生产、表达训练、矩阵运营" },
              { k: "AI 培训", v: "少儿课程、师资合作" },
            ].map((x) => (
              <div key={x.k} className="bg-panel p-6">
                <div className="text-[13px] text-fg">{x.k}</div>
                <div className="mt-1.5 text-[12px] text-muted">{x.v}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
