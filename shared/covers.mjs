// Render the two covers of a film that supports ?cover=tiktok|shorts (see learn-6-free/film.js).
//   node shared/covers.mjs <film> <outdir>
// -> <outdir>/Couverture-TikTok.png, <outdir>/Couverture-YouTube-Shorts.png (1080x1920)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [film, outDir] = process.argv.slice(2);
if (!film || !outDir) { console.error('usage: covers.mjs <film> <outdir>'); process.exit(1); }
const ROOT = process.cwd();
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.wav': 'audio/wav' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
for (const [kind, name] of [['tiktok', 'Couverture-TikTok.png'], ['shorts', 'Couverture-YouTube-Shorts.png']]) {
  await page.goto(`http://127.0.0.1:${port}/${film}/index.html?format=9x16&render=1&cover=${kind}`);
  await page.waitForFunction(() => window.filmReady === true);
  await page.evaluate(() => window.seek(0));
  const data = await page.evaluate(() => document.getElementById('film').toDataURL('image/png'));
  fs.writeFileSync(path.join(outDir, name), Buffer.from(data.split(',')[1], 'base64'));
  console.log('->', path.join(outDir, name));
}
await browser.close(); server.close();
