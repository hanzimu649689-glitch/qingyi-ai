import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages 部署在子路径时由环境变量注入，例如 VITE_BASE=/qingyi-ai/
export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        /* rolldown 要求 manualChunks 是函数 */
        manualChunks(id: string) {
          if (id.includes("node_modules/three")) return "three";
          if (id.includes("@react-three")) return "r3f";
          if (id.includes("node_modules/react-router") || id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) return "react";
          return undefined;
        },
      },
    },
  },
});
