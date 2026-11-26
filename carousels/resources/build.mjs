// TikTok carousel "Free resources for designers" (12 images 1080x1920) from shared/resources-topic.js + real screenshots.
import { SITES } from '../../shared/resources-topic.js';
import fs from 'fs';
import path from 'path';
const here = path.dirname(new URL(import.meta.url).pathname);
const IDS = ['untitled', 'material', 'mobbin', 'lucide', 'phosphor', 'undraw', 'gfonts', 'fontshare', 'penpot', 'nngroup'];
const NM = '../../node_modules/@fontsource';
const css = `
@font-face{font-family:Plex;src:url(${NM}/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff2);font-weight:700}
@font-face{font-family:Plex;src:url(${NM}/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2);font-weight:600}
@font-face{font-family:Plex;src:url(${NM}/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2);font-weight:500}
@font-face{font-family:Mono;src:url(${NM}/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2);font-weight:600}
@font-face{font-family:Ar;src:url(${NM}/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-700-normal.woff2);font-weight:700;unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F}
@font-face{font-family:Ar;src:url(${NM}/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff2);font-weight:700;unicode-range:U+0000-024F}
*{box-sizing:border-box;margin:0;padding:0} body{background:#000}
.s{width:1080px;height:1920px;position:relative;overflow:hidden;background:#1B1B1B;color:#EDEDED;font-family:Plex}
.top{position:absolute;top:270px;left:80px;right:80px;display:flex;justify-content:space-between;font:600 26px Mono;color:#A8A8A8}
.h{font-weight:700;color:#fff;line-height:.98}
.ar{font-family:Ar;font-weight:700;direction:rtl;text-align:right}
.swipe{position:absolute;top:1490px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center}
.sp{background:#0D99FF;color:#fff;font:600 30px Mono;padding:16px 30px;border-radius:40px}
.cat{display:inline-block;background:#0D2A44;border:2px solid #0D99FF;color:#fff;font:600 24px Mono;padding:8px 18px;border-radius:30px}
.br{position:absolute;left:80px;right:80px;background:#EDEDED;border-radius:18px;overflow:hidden}
.br .bar{height:50px;display:flex;align-items:center;gap:10px;padding:0 18px}
.br .dot{width:12px;height:12px;border-radius:6px;background:#C9C9C9}
.br .url{margin-left:20px;background:#fff;border-radius:14px;padding:4px 18px;font:600 18px Mono;color:#555}
.br img{display:block;width:100%}
`;
const swipe = '<div class="swipe"><span class="sp">SWIPE →</span><span class="ar" style="font-size:40px">اسحب للمزيد</span></div>';
let html = `<div class="s" id="s1"><div class="top"><span>LEARN UI/UX</span><span>AG STUDIO</span></div>
<div class="h" style="position:absolute;top:380px;left:76px;font-size:108px">FREE<br>RESOURCES<br>FOR DESIGNERS.</div>
<div class="ar" style="position:absolute;top:735px;right:80px;font-size:56px">مصادر مجانية للمصممين.</div>
<div style="position:absolute;top:840px;left:80px;font:600 28px Mono;color:#A8A8A8">10 SITES TO SAVE. SWIPE TO SEE THEM.</div>
<div style="position:absolute;top:900px;left:80px;right:80px;display:grid;grid-template-columns:1fr 1fr;gap:16px">${IDS.map((id, i) => `<div style="background:#26272C;border:1.5px solid #3A3B42;border-radius:14px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center"><div><div style="font:600 17px Mono;color:#A8A8A8">${String(i + 1).padStart(2, '0')} · ${SITES[id].cat}</div><div style="margin-top:10px;width:220px;height:22px;border-radius:11px;background:#3A3B42"></div></div><div style="font:700 40px Plex;color:#0D99FF">?</div></div>`).join('')}</div>${swipe}</div>`;
IDS.forEach((id, i) => {
  const s = SITES[id];
  html += `<div class="s" id="s${i + 2}"><div class="top"><span>SITE ${String(i + 1).padStart(2, '0')} / 10</span><span>AG STUDIO</span></div>
<div style="position:absolute;top:330px;left:80px"><span class="cat">${s.cat}</span></div>
<div class="h" style="position:absolute;top:400px;left:76px;font-size:${s.name.join(' ').length > 14 ? 86 : 104}px">${s.name.join(' ')}</div>
<div class="br" style="top:${s.name.join(' ').length > 14 ? 520 : 540}px"><div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="url">${s.url}</span></div><img src="../../resources-sites/shots/${id}.jpg"></div>
<div style="position:absolute;top:1268px;left:80px;right:80px;font:600 25px Mono;color:#fff;line-height:1.3">${s.en}</div>
<div class="ar" style="position:absolute;top:1318px;left:80px;right:80px;font-size:32px;line-height:1.45">${s.ar}</div>
<div style="position:absolute;top:1424px;left:80px;right:80px;font:600 21px Mono;color:#0D99FF">TIP · ${s.tip}</div>${swipe}</div>`;
});
html += `<div class="s" id="s12" style="background:#0C8CE9"><div class="top" style="color:#D6ECFF"><span>LEARN UI/UX</span><span>AG STUDIO</span></div>
<div class="h" style="position:absolute;top:470px;left:76px;font-size:120px">SAVE THIS<br>LIST FOR<br>LATER.</div>
<div class="ar" style="position:absolute;top:880px;right:80px;font-size:56px;color:#fff">احفظ هذه القائمة لوقت لاحق.</div>
<div style="position:absolute;top:1040px;left:80px;right:80px;border:3px solid #fff;border-radius:30px;padding:40px">
 <div style="font:700 50px Plex;color:#fff">Visit my profile</div><div style="font:600 30px Plex;color:#D6ECFF;margin-top:8px">for more UI/UX tutorials</div>
 <div class="ar" style="font-size:44px;color:#fff;margin-top:26px">زُر حسابي لمزيد من دروس UI/UX</div></div>
<div style="position:absolute;top:1430px;left:80px;right:80px;font:500 22px Plex;color:#D6ECFF">Prices and licenses can change: check each site before you use it.</div></div>`;
fs.writeFileSync(path.join(here, 'carousel.html'), `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`);
console.log('ok');
