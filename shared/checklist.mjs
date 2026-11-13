// Free lead-magnet PDF: "30 UI rules checklist" (EN + AR), built from shared/found-themes.js.
//   node shared/checklist.mjs  ->  livraisons/Checklist-30-UI-rules/30-UI-rules-checklist.pdf
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { foundThemes } from './found-themes.js';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = process.cwd(), NM = `file://${ROOT}/node_modules`;
const themes = foundThemes({ prog: () => 0 });
const img = (k) => `file://${ROOT}/checklist/img/${k}.png`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const block = (t, j) => `
<section class="theme">
  <div class="thead"><span class="badge">${j + 1}</span><h2>${esc(t.title)}</h2><h2 class="ar" dir="rtl">${t.ar}</h2></div>
  <div class="tbody">
    <figure><img src="${img(t.key)}"><figcaption><span class="b">Before</span><span class="a">After</span></figcaption></figure>
    <ul>${t.steps.map((s) => `<li><span class="box"></span><div class="en"><b>${esc(s.title)}</b><span>${esc(s.en2)}</span></div><div class="arc" dir="rtl"><b>${s.ar}</b><span>${s.ar2}</span></div></li>`).join('')}</ul>
  </div>
</section>`;
const head = (n) => `<header><span class="pill">Learn UI/UX</span><span class="wm">AG Studio</span></header>`;
const foot = (n) => `<footer><span>30 UI rules checklist · قائمة 30 قاعدة لتصميم الواجهات</span><span>youtube.com/@AGStudioDev · ${n} / 5</span></footer>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Jakarta;src:url(${NM}/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2);font-weight:200 800}
${[500, 600, 700].map((w) => `@font-face{font-family:Plex;src:url(${NM}/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-${w}-normal.woff2);font-weight:${w};unicode-range:U+0600-06FF,U+FB50-FDFF,U+FE70-FEFF}`).join('')}
@font-face{font-family:Cairo;src:url(${NM}/@fontsource/cairo/files/cairo-arabic-800-normal.woff2);font-weight:800;unicode-range:U+0600-06FF,U+FB50-FDFF,U+FE70-FEFF}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Jakarta,Plex,sans-serif;color:#0E1726}
.page{width:210mm;height:297mm;padding:11mm 14mm 9mm;overflow:hidden;position:relative;page-break-after:always;background-color:#EEF1F6;background-image:radial-gradient(#C7CBD3 0.45mm,transparent 0.5mm);background-size:5mm 5mm;display:flex;flex-direction:column}
header{display:flex;justify-content:space-between;align-items:center;margin-bottom:5mm}
.pill{background:#0E1726;color:#fff;font-weight:700;font-size:10pt;padding:2mm 4.5mm;border-radius:10mm}
.wm{font-weight:700;font-size:10.5pt}
footer{margin-top:auto;display:flex;justify-content:space-between;font-size:7.5pt;color:#5A6473;font-weight:600;padding-top:2mm}
.theme{background:#fff;border-radius:5mm;padding:7mm 8mm 4mm;margin-bottom:5mm;border:0.3mm solid rgba(14,23,38,.08)}
.thead{display:flex;align-items:center;gap:3mm;margin-bottom:4mm}
.badge{background:#2F5BFF;color:#fff;font-weight:700;font-size:13pt;width:9mm;height:9mm;border-radius:2mm;display:flex;align-items:center;justify-content:center;flex:none}
h2{font-size:19pt;font-weight:800;letter-spacing:-.4pt}
h2.ar{margin-left:auto;color:#2F5BFF;font-family:Plex,Jakarta;font-weight:700;font-size:17pt;letter-spacing:0}
.tbody{display:flex;gap:6mm}
figure{flex:none;width:58mm}
figure img{width:100%;border-radius:2mm;display:block}
figcaption{display:flex;justify-content:space-around;font-size:7.5pt;font-weight:700;margin-top:1.5mm}
.b{color:#D92D20}.a{color:#12805C}
ul{list-style:none;flex:1}
li{display:grid;grid-template-columns:5.5mm 1fr 1fr;gap:2.5mm;align-items:start;padding:1.9mm 0;border-bottom:0.25mm solid #EEF1F6}
li:last-child{border-bottom:0}
.box{width:4.4mm;height:4.4mm;border:0.45mm solid #0E1726;border-radius:1mm;margin-top:.6mm}
.en b,.arc b{display:block;font-size:11.5pt;font-weight:800;margin-bottom:.6mm}
.en span{display:block;font-size:9.2pt;color:#5A6473;font-weight:500;line-height:1.35}
.arc{font-family:Plex,Jakarta;text-align:right}
.arc b{color:#2F5BFF;font-weight:700}
.arc span{display:block;font-size:9.2pt;color:#5A6473;font-weight:500;line-height:1.5}
.cover{justify-content:flex-start}
.cover h1{font-size:66pt;font-weight:800;letter-spacing:-2.5pt;line-height:1.02;margin-top:30mm}
.cover h1 mark{background:#B9C8FF;color:inherit;border-radius:2mm;padding:0 2mm}
.cover .ar1{font-family:Cairo,Plex;font-weight:800;font-size:32pt;color:#2F5BFF;text-align:right;margin-top:8mm}
.cover p{font-size:15pt;color:#5A6473;font-weight:500;margin-top:8mm}
.cover p.r{font-family:Plex;text-align:right;margin-top:2mm}
.how{background:#fff;border-radius:5mm;padding:9mm;margin-top:18mm;border:0.3mm solid rgba(14,23,38,.08)}
.how h3{font-size:16pt;font-weight:800;margin-bottom:3mm}
.how li{grid-template-columns:8mm 1fr 1fr;border:0;padding:1.6mm 0}
.num{background:#2F5BFF;color:#fff;font-weight:700;width:6mm;height:6mm;border-radius:1.5mm;display:flex;align-items:center;justify-content:center;font-size:9pt}
.free{display:inline-block;background:#12805C;color:#fff;font-weight:800;font-size:11pt;padding:2mm 5mm;border-radius:10mm;margin-top:10mm}
.end{background:#2F5BFF;background-image:none;color:#fff;justify-content:center}
.end h1{font-size:50pt;font-weight:800;letter-spacing:-2pt}
.end .ar1{font-family:Plex;font-weight:700;font-size:30pt;margin-top:4mm}
.end .cta{display:inline-block;background:#fff;color:#2F5BFF;font-weight:700;font-size:14pt;padding:4mm 8mm;border-radius:20mm;margin-top:12mm;align-self:flex-start}
.end p{font-size:12pt;margin-top:6mm;font-weight:500}
.end p.r{font-family:Plex}
.score{background:#fff;border-radius:5mm;padding:7mm;border:0.3mm solid rgba(14,23,38,.08);margin-bottom:6mm}
.score h2{margin-bottom:3mm}
.score .line{display:flex;justify-content:space-between;font-size:13pt;font-weight:600;padding:2mm 0;border-bottom:0.25mm solid #EEF1F6}
.score .line span:last-child{font-family:Plex;color:#2F5BFF}
</style></head><body>
<div class="page cover">${head()}
  <h1>30 UI rules<br><mark>checklist.</mark></h1>
  <div class="ar1" dir="rtl">قائمة 30 قاعدة لتصميم الواجهات</div>
  <p>Check your design before you ship it. 6 foundations, 5 rules each.</p>
  <p class="r" dir="rtl">راجع تصميمك قبل نشره. 6 أسس، و5 قواعد لكل أساس.</p>
  <div class="how"><h3>How to use it · طريقة الاستخدام</h3><ul>
    <li><span class="num">1</span><div class="en"><b>Open your screen</b><span>One screen at a time.</span></div><div class="arc" dir="rtl"><b>افتح شاشتك</b><span>شاشة واحدة في كل مرة.</span></div></li>
    <li><span class="num">2</span><div class="en"><b>Tick what is true</b><span>Be honest: if you hesitate, it is a no.</span></div><div class="arc" dir="rtl"><b>ضع علامة على ما تحقّق</b><span>كن صادقًا: إن تردّدت فالجواب لا.</span></div></li>
    <li><span class="num">3</span><div class="en"><b>Fix the empty boxes first</b><span>Start with contrast and spacing.</span></div><div class="arc" dir="rtl"><b>ابدأ بالمربعات الفارغة</b><span>ابدأ بالتباين والمسافات.</span></div></li>
  </ul></div>
  <span class="free" style="align-self:flex-start">Free · مجاني</span>
  ${foot(1)}</div>
${[0, 2, 4].map((j, n) => `<div class="page">${head()}${block(themes[j], j)}${block(themes[j + 1], j + 1)}${foot(n + 2)}</div>`).join('')}
<div class="page">${head()}
  <div class="score"><h2>Your score · نتيجتك</h2>
    <div class="line"><span>___ / 30</span><span dir="rtl">___ من 30</span></div>
    <div class="line"><span>25 to 30: ready to ship.</span><span dir="rtl">من 25 إلى 30: جاهز للنشر.</span></div>
    <div class="line"><span>15 to 24: fix the empty boxes.</span><span dir="rtl">من 15 إلى 24: أصلح المربعات الفارغة.</span></div>
    <div class="line"><span>Under 15: go back to the 6 foundations.</span><span dir="rtl">أقل من 15: عُد إلى الأسس الستة.</span></div>
  </div>
  <div class="theme end" style="flex:1;display:flex;flex-direction:column;border-radius:5mm;padding:12mm">
    <h1>Keep it simple.</h1><div class="ar1" dir="rtl" style="text-align:left">اجعلها بسيطة.</div>
    <span class="cta">Follow for more UI/UX tutorials</span>
    <p>Every rule here is shown before and after in the video “UI design foundations for beginners”.</p>
    <p class="r" dir="rtl" style="text-align:left">كل قاعدة هنا معروضة قبل وبعد في فيديو «أساسيات تصميم الواجهات للمبتدئين».</p>
    <p style="font-weight:700;margin-top:10mm">youtube.com/@AGStudioDev</p>
    <p style="font-size:9pt;opacity:.85">The interfaces shown are fictional. © AG Studio.</p>
  </div>
  ${foot(5)}</div>
</body></html>`;
const out = path.join(ROOT, 'livraisons/Checklist-30-UI-rules'); fs.mkdirSync(out, { recursive: true });
const tmp = path.join(ROOT, 'checklist/checklist.html'); fs.writeFileSync(tmp, html);
const b = await chromium.launch(); const p = await b.newPage();
await p.goto(`file://${tmp}`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
await p.pdf({ path: path.join(out, '30-UI-rules-checklist.pdf'), format: 'A4', printBackground: true });
for (let i = 0; i < 5; i++) { await p.setViewportSize({ width: 794, height: 1123 }); }
await b.close(); console.log('->', path.join(out, '30-UI-rules-checklist.pdf'));
