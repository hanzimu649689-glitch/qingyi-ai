import { useRef, type ReactNode, type MouseEvent } from "react";
import { Link } from "react-router-dom";

/** 磁吸按钮：指针靠近时轻微吸附，离开回位。触摸设备不启用。 */
function useMagnet(strength = 0.28) {
  const ref = useRef<HTMLElement | null>(null);
  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * strength;
    const dy = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };
  return { ref, onMove, onLeave };
}

type Props = { children: ReactNode; to?: string; href?: string; onClick?: () => void; variant?: "solid" | "ghost" };

export default function MagneticButton({ children, to, href, onClick, variant = "solid" }: Props) {
  const m = useMagnet();
  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200 will-change-transform";
  const skin =
    variant === "solid"
      ? "bg-cyan text-ink hover:bg-[#4df0ff]"
      : "border border-line text-fg hover:border-cyan/60 hover:text-cyan";
  const cls = `${base} ${skin}`;
  const style = { transition: "transform 220ms cubic-bezier(.22,1,.36,1), background-color 200ms, border-color 200ms, color 200ms" };

  if (to) {
    return (
      <Link to={to} className={cls} style={style} onMouseMove={m.onMove} onMouseLeave={m.onLeave} ref={m.ref as never}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls} style={style} onMouseMove={m.onMove} onMouseLeave={m.onLeave} ref={m.ref as never}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} style={style} onMouseMove={m.onMove} onMouseLeave={m.onLeave} ref={m.ref as never}>
      {children}
    </button>
  );
}
