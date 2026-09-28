import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { site } from "../../content/site";

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="relative grid h-7 w-7 place-items-center">
        <span className="absolute inset-0 rounded-[7px] border border-cyan/50" />
        <span className="absolute inset-[3px] rounded-[4px] bg-gradient-to-br from-cyan to-violet opacity-80 transition-opacity group-hover:opacity-100" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight">{site.name}</span>
      <span className="num hidden text-[10px] tracking-[0.2em] text-muted sm:inline">{site.nameEn}</span>
    </Link>
  );
}

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [loc.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid || open ? "border-b border-line bg-ink/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="wrap-wide flex h-14 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {site.nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-1.5 text-[13px] transition-colors duration-200 ${
                  isActive ? "bg-white/[0.07] text-fg" : "text-muted hover:text-fg"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
          <a
            href={`mailto:${site.contact.email}`}
            className="ml-2 rounded-full bg-cyan px-4 py-1.5 text-[13px] font-medium text-ink transition-colors hover:bg-[#4df0ff]"
          >
            联系我们
          </a>
        </nav>
        <button
          type="button"
          aria-label="菜单"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-md border border-line md:hidden"
        >
          <span className="flex flex-col gap-1">
            <i className={`block h-px w-4 bg-fg transition-transform ${open ? "translate-y-[2.5px] rotate-45" : ""}`} />
            <i className={`block h-px w-4 bg-fg transition-transform ${open ? "-translate-y-[2.5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-ink/95 px-5 pb-5 pt-2 md:hidden">
          {site.nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) => `block border-b border-line/60 py-3 text-sm ${isActive ? "text-cyan" : "text-muted"}`}
            >
              {n.label}
            </NavLink>
          ))}
          <a href={`mailto:${site.contact.email}`} className="mt-4 inline-flex rounded-full bg-cyan px-4 py-2 text-sm font-medium text-ink">
            联系我们
          </a>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-ink">
      <div className="wrap py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="body mt-4 text-sm">{site.tagline}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-14 gap-y-2 text-sm sm:grid-cols-3">
            {site.nav.map((n) => (
              <Link key={n.to} to={n.to} className="text-muted transition-colors hover:text-fg">
                {n.label}
              </Link>
            ))}
            <Link to="/contact" className="text-muted transition-colors hover:text-fg">
              联系方式
            </Link>
          </div>
          <div className="text-sm">
            <div className="eyebrow mb-2">联系</div>
            <a href={`mailto:${site.contact.email}`} className="num text-muted transition-colors hover:text-cyan">
              {site.contact.email}
            </a>
          </div>
        </div>
        <div className="hair my-8" />
        <div className="flex flex-col gap-2 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span className="num">Designed &amp; built in-house</span>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink">
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
