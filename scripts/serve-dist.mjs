/**
 * 本地静态服务器（仅用于本地预览与截图验证）。
 * 未知路径统一回退到 index.html，与 GitHub Pages 的 404.html 行为一致。
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";

const root = join(process.cwd(), "dist");
const port = Number(process.argv[2] ?? 4173);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".glb": "model/gltf-binary",
  ".wasm": "application/wasm",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".txt": "text/plain; charset=utf-8",
};

async function tryFile(p) {
  try {
    const s = await stat(p);
    if (s.isFile()) return p;
  } catch {}
  return null;
}

createServer(async (req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const safe = normalize(url).replace(/^([.][.][/\\])+/, "");
  let file = await tryFile(join(root, safe));
  if (!file && !extname(safe)) file = await tryFile(join(root, "index.html"));
  if (!file) file = await tryFile(join(root, "404.html"));
  if (!file) { res.writeHead(404); res.end("not found"); return; }
  const buf = await readFile(file);
  res.writeHead(200, {
    "Content-Type": MIME[extname(file).toLowerCase()] ?? "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  res.end(buf);
}).listen(port, () => console.log("serving dist on http://localhost:" + port));
