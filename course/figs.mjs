// node course/figs.mjs  ->  course/fig/1b.png, 1a.png, ... 5a.png
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const ROOT = process.cwd(), T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const p = path.join(ROOT, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': T[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(r); }).listen(0);
const b = await chromium.launch(), pg = await b.newPage();
for (let n = 1; n <= 5; n++) for (const s of ['b', 'a']) {
  await pg.goto(`http://127.0.0.1:${srv.address().port}/course/fig.html?n=${n}&s=${s}`); await pg.waitForFunction(() => window.figReady === true);
  const d = await pg.evaluate(() => document.getElementById('c').toDataURL('image/png'));
  fs.writeFileSync(`course/fig/${n}${s}.png`, Buffer.from(d.split(',')[1], 'base64'));
}
await b.close(); srv.close(); console.log('figures ok');
