import { useEffect, useRef } from "react";

/**
 * 首页背景：二维 canvas 的网格光场 + 漂浮粒子 + 指针视差。
 * 不用 WebGL，成本极低；弱设备自动降粒子数，尊重 prefers-reduced-motion。
 */
export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, dpr = 1;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    type P = { x: number; y: number; z: number; s: number; v: number };
    let parts: P[] = [];

    const resize = () => {
      const rect = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      w = rect.width; h = rect.height;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = reduce ? 0 : w < 720 ? 40 : w < 1200 ? 70 : 110;
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.25 + Math.random() * 0.75,
        s: 0.6 + Math.random() * 1.6,
        v: 0.08 + Math.random() * 0.35,
      }));
    };

    const onMove = (e: PointerEvent) => {
      pointer.tx = e.clientX / window.innerWidth;
      pointer.ty = e.clientY / window.innerHeight;
    };

    let raf = 0;
    let t = 0;
    const draw = () => {
      t += 0.006;
      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;

      ctx.clearRect(0, 0, w, h);

      /* 网格光场 */
      const step = 64;
      const ox = (pointer.x - 0.5) * 26;
      const oy = (pointer.y - 0.5) * 26 - t * 8;
      ctx.lineWidth = 1;
      for (let x = ((ox % step) + step) % step; x < w; x += step) {
        const d = 1 - Math.abs(x / w - pointer.x);
        ctx.strokeStyle = `rgba(0,229,255,${0.020 + 0.055 * d})`;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = ((oy % step) + step) % step; y < h; y += step) {
        const d = 1 - Math.abs(y / h - pointer.y);
        ctx.strokeStyle = `rgba(124,92,255,${0.016 + 0.05 * d})`;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      /* 漂浮粒子，带指针视差 */
      for (const p of parts) {
        p.y -= p.v;
        if (p.y < -8) { p.y = h + 8; p.x = Math.random() * w; }
        const px = p.x + (pointer.x - 0.5) * 42 * p.z;
        const py = p.y + (pointer.y - 0.5) * 42 * p.z;
        const a = 0.1 + 0.55 * p.z;
        ctx.fillStyle = p.z > 0.72 ? `rgba(0,229,255,${a})` : `rgba(232,237,245,${a * 0.6})`;
        ctx.beginPath(); ctx.arc(px, py, p.s * p.z, 0, Math.PI * 2); ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />;
}
