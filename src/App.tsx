import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/ui/Layout";
import Home from "./pages/Home";
import DigitalTwin from "./pages/DigitalTwin";
import Agents from "./pages/Agents";
import AgentDetail from "./pages/AgentDetail";
import Training from "./pages/Training";
import Playground from "./pages/Playground";
import Play from "./pages/Play";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

/* 三维页面含 three.js，单独分包：首屏不加载，进入产品页才拉取 */
const ProductPage = lazy(() => import("./pages/ProductPage"));

function RouteFallback() {
  return (
    <div className="grid min-h-[70svh] place-items-center">
      <div className="flex flex-col items-center gap-3">
        <div className="eyebrow">载入中</div>
        <div className="h-[2px] w-32 overflow-hidden bg-line">
          <div className="anim-scan h-full w-1/3 bg-cyan" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/digital-twin" element={<DigitalTwin />} />
        <Route
          path="/digital-twin/:slug"
          element={
            <Suspense fallback={<RouteFallback />}>
              <ProductPage />
            </Suspense>
          }
        />
        <Route path="/agents" element={<Agents />} />
        <Route path="/agents/:slug" element={<AgentDetail />} />
        <Route path="/training" element={<Training />} />
        <Route path="/training/playground" element={<Playground />} />
        <Route path="/training/play/:slug" element={<Play />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
