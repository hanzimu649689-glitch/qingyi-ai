/**
 * 全站唯一的滚动进度来源。
 * 所有 3D 动画都是 scrollProgress 的纯函数（state = f(p)），不做任何增量累加，
 * 因此反向滚动会精确回到对应状态。
 */
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

export type ScrollStore = {
  /** 全局进度 0–1 */
  progress: number;
  /** 视口滚动位置（px） */
  y: number;
  /** 是否处于「模型交互模式」（此时锁定页面滚动） */
  locked: boolean;
};

const store: ScrollStore = { progress: 0, y: 0, locked: false };
let lenis: Lenis | null = null;
const listeners = new Set<() => void>();

/* 调试：?p=0.42 可把进度钉在指定值，用于截图核对某个中间状态 */
const forced = (() => {
  if (typeof window === "undefined") return null;
  const v = new URLSearchParams(window.location.search).get("p");
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : null;
})();

function computeProgress() {
  if (forced !== null) {
    store.progress = forced;
    store.y = 0;
    listeners.forEach((l) => l());
    return;
  }
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - window.innerHeight);
  store.y = window.scrollY;
  store.progress = Math.min(1, Math.max(0, store.y / max));
  listeners.forEach((l) => l());
}

export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) {
      computeProgress();
      window.addEventListener("scroll", computeProgress, { passive: true });
      window.addEventListener("resize", computeProgress);
      return () => {
        window.removeEventListener("scroll", computeProgress);
        window.removeEventListener("resize", computeProgress);
      };
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      computeProgress();
      window.addEventListener("scroll", computeProgress, { passive: true });
      window.addEventListener("resize", computeProgress);
      return () => {
        window.removeEventListener("scroll", computeProgress);
        window.removeEventListener("resize", computeProgress);
      };
    }
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis?.raf(time);
      computeProgress();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    computeProgress();
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, [enabled]);
}

/** 交互模式：锁定 / 解锁页面滚动 */
export function setScrollLocked(locked: boolean) {
  store.locked = locked;
  if (locked) {
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "contain";
  } else {
    lenis?.start();
    document.documentElement.style.overflow = "";
    document.documentElement.style.overscrollBehavior = "";
  }
  listeners.forEach((l) => l());
}

/** 按进度跳转（章节导航用）。Lenis 在用时交给它做平滑，保证只有一套滚动逻辑。 */
export function scrollToProgress(p: number, immediate = false) {
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - window.innerHeight);
  const y = Math.min(max, Math.max(0, p * max));
  if (lenis && !immediate) lenis.scrollTo(y, { duration: 0.9 });
  else window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
}

export function getScroll(): ScrollStore {
  return store;
}

/** 订阅进度变化（低频 UI 用，例如章节指示器；3D 每帧请直接读 getScroll） */
export function useScrollProgress(): number {
  const [p, setP] = useState(store.progress);
  useEffect(() => {
    let last = -1;
    const fn = () => {
      const v = store.progress;
      if (Math.abs(v - last) > 0.0015) {
        last = v;
        setP(v);
      }
    };
    listeners.add(fn);
    fn();
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return p;
}

/** 返回一个每帧可读的 ref，避免每帧触发 React 更新 */
export function useProgressRef() {
  const ref = useRef(0);
  useEffect(() => {
    const fn = () => {
      ref.current = store.progress;
    };
    listeners.add(fn);
    fn();
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return ref;
}
