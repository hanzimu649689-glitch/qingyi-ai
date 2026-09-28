import { useEffect, useRef, useState, type ComponentType, type ReactNode, type Ref } from "react";

/** 进入视口时揭示。基于 IntersectionObserver，只触发一次，移动端降级为直接显示。 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4;
  as?: "div" | "section" | "article" | "li";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setSeen(true); return; }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) { setSeen(true); io.disconnect(); }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    io.observe(el);
    /* 兜底：任何情况下 900ms 后强制显示，避免内容永久不可见 */
    const fallback = window.setTimeout(() => setSeen(true), 900);
    return () => { io.disconnect(); window.clearTimeout(fallback); };
  }, []);

  const cls = ["reveal", seen ? "in" : "", delay ? `reveal-d${delay}` : "", className].filter(Boolean).join(" ");
  const Comp = Tag as unknown as ComponentType<{ className?: string; children?: ReactNode; ref?: Ref<HTMLElement> }>;
  return <Comp ref={ref} className={cls}>{children}</Comp>;
}
