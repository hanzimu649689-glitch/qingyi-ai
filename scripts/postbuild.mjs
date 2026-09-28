/**
 * GitHub Pages 收尾：
 *  - 复制 index.html 为 404.html，使深链接刷新（如 /digital-twin/camera）不会 404
 *  - 写入 .nojekyll，避免 Jekyll 忽略下划线开头的文件
 */
import { copyFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");
if (!existsSync(dist)) {
  console.error("dist 不存在，先执行 vite build");
  process.exit(1);
}
copyFileSync(join(dist, "index.html"), join(dist, "404.html"));
writeFileSync(join(dist, ".nojekyll"), "");
console.log("postbuild: 404.html + .nojekyll 已写入");
