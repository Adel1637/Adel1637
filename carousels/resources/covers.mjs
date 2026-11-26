// Teaser covers: real screenshots, sharp, cropped below the site header so no name or logo shows; stacked. Outputs cover-*.html rendered by Playwright.
import fs from 'fs';
import path from 'path';
const here = path.dirname(new URL(import.meta.url).pathname);
const NM = '../../node_modules/@fontsource';
const SH = '../../resources-sites/shots';
const css = `
@font-face{font-family:Plex;src:url(${NM}/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff2);font-weight:700}
@font-face{font-family:Mono;src:url(${NM}/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2);font-weight:600}
@font-face{font-family:Ar;src:url(${NM}/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-700-normal.woff2);font-weight:700;unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F}
*{box-sizing:border-box;margin:0;padding:0} body{background:#000}
.s{position:relative;overflow:hidden;background:#1B1B1B;font-family:Plex;color:#fff}
.h{font-weight:700;line-height:.96;letter-spacing:-.01em}
.ar{font-family:Ar;font-weight:700;direction:rtl}
.mono{font:600 26px Mono;color:#A8A8A8}
.win{position:absolute;background:#EDEDED;border-radius:22px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.55)}
.win .bar{height:44px;display:flex;align-items:center;gap:9px;padding:0 16px}
.win .dot{width:11px;height:11px;border-radius:6px;background:#C9C9C9}
.win .url{margin-left:14px;width:220px;height:22px;border-radius:11px;background:#fff}
.win img{display:block;width:100%}
.pill{display:inline-block;background:#0D99FF;color:#fff;font:600 28px Mono;padding:14px 28px;border-radius:40px}
`;
const win = (img, l, t, w, rot, z) => `<div class="win" style="left:${l}px;top:${t}px;width:${w}px;transform:rotate(${rot}deg);z-index:${z}"><div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="url"></span></div><img src="${SH}/${img}.jpg"></div>`;
const vertical = (swipe) => `<div class="s" id="c" style="width:1080px;height:1920px">
 <div class="mono" style="position:absolute;top:270px;left:80px">LEARN UI/UX</div><div class="mono" style="position:absolute;top:270px;right:80px">AG STUDIO</div>
 <div class="h" style="position:absolute;top:380px;left:76px;font-size:150px"><span style="color:#0D99FF">10</span> FREE<br>SITES FOR<br>DESIGNERS.</div>
 <div class="ar" style="position:absolute;top:880px;right:80px;font-size:58px">عشرة مواقع مجانية للمصممين.</div>
 <div style="position:absolute;top:960px;left:0;width:1080px;height:500px;overflow:hidden">${win('crop-lucide', 170, 60, 660, -7, 1)}${win('crop-mobbin', 300, 100, 660, 5, 2)}${win('crop-undraw', 220, 150, 660, -1.5, 3)}<div style="position:absolute;left:0;right:0;bottom:0;height:200px;background:linear-gradient(rgba(27,27,27,0),#1B1B1B);z-index:4"></div></div>
 ${swipe ? `<div style="position:absolute;top:1500px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;z-index:5"><span class="pill">SWIPE TO REVEAL →</span><span class="ar" style="font-size:40px">اسحب لتكتشفها</span></div>` : ''}
</div>`;
const thumb = `<div class="s" id="c" style="width:1280px;height:720px">
 <div class="h" style="position:absolute;top:150px;left:70px;font-size:100px;z-index:5"><span style="color:#0D99FF">18</span> FREE<br>SITES FOR<br>DESIGNERS.</div>
 <div class="ar" style="position:absolute;top:500px;left:70px;width:620px;text-align:right;font-size:44px">مواقع مجانية للمصممين</div>
 ${win('crop-lucide', 760, 110, 470, -7, 1)}${win('crop-mobbin', 840, 160, 470, 5, 2)}${win('crop-undraw', 790, 220, 470, -1.5, 3)}
</div>`;
for (const [n, body] of [['cover-carousel', vertical(true)], ['cover-short', vertical(false)], ['cover-thumb', thumb]]) fs.writeFileSync(path.join(here, n + '.html'), `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`);
console.log('ok');
