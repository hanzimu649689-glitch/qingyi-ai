/**
 * 截图工具：用 CDP 真实等待页面渲染完成后再截图。
 * 用法: node scripts/shot.mjs <url> <out.png> [等待毫秒] [宽] [高]
 * 注意：Chrome 的 --virtual-time-budget 会把定时器瞬间快进，导致截图早于加载完成，
 *      所以这里改用 DevTools 协议做真实等待。
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const [, , url, out, waitMs = "15000", W = "1440", H = "900"] = process.argv;
if (!url || !out) { console.error("用法: node scripts/shot.mjs <url> <out.png> [waitMs] [w] [h]"); process.exit(1); }

const profile = mkdtempSync(join(tmpdir(), "shot-"));
const port = 9333 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "--enable-unsafe-swiftshader",
  "--use-angle=swiftshader",
  "--no-sandbox",
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  `--window-size=${W},${H}`,
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function wsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/list`);
      const list = await r.json();
      const page = list.find((t) => t.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch { /* 还没起来 */ }
    await sleep(250);
  }
  throw new Error("无法连接 Chrome 调试端口");
}

const ws = new WebSocket(await wsUrl());
let seq = 0;
const pending = new Map();
ws.addEventListener("message", (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
const send = (method, params = {}) =>
  new Promise((res) => { const i = ++seq; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });

/* 收集控制台错误，截图时一并报告 */
const consoleErrors = [];
ws.addEventListener("message", (ev) => {
  const m = JSON.parse(ev.data);
  if (m.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(m.params?.type)) {
    const txt = (m.params.args ?? []).map((a) => a.value ?? a.description ?? "").join(" ");
    if (txt) consoleErrors.push(`[${m.params.type}] ${txt}`);
  }
  if (m.method === "Runtime.exceptionThrown") {
    consoleErrors.push(`[exception] ${m.params?.exceptionDetails?.exception?.description ?? ""}`);
  }
});

await send("Page.enable");
await send("Runtime.enable");
await send("Page.navigate", { url });
await sleep(Number(waitMs));
const shot = await send("Page.captureScreenshot", { format: "png" });
writeFileSync(out, Buffer.from(shot.result.data, "base64"));
console.log("saved " + out);
if (consoleErrors.length) {
  console.log("--- 控制台 ---");
  for (const e of consoleErrors.slice(0, 12)) console.log(e.slice(0, 300));
} else {
  console.log("控制台无 error/warning");
}
ws.close();
chrome.kill();
process.exit(0);
