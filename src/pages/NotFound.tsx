import MagneticButton from "../components/ui/MagneticButton";

export default function NotFound() {
  return (
    <section className="grid min-h-[80svh] place-items-center pt-24">
      <div className="wrap text-center">
        <div className="num text-[11px] tracking-[0.28em] text-muted">404</div>
        <h1 className="h1 mt-5">这个页面不存在</h1>
        <p className="lead mt-4">链接可能已经变了，或者内容还没上线。</p>
        <div className="mt-9 flex justify-center">
          <MagneticButton to="/">回到首页</MagneticButton>
        </div>
      </div>
    </section>
  );
}
