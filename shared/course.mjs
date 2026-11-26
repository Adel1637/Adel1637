// Builds the course PDFs (editorial book style, A5), one per language, from course/content.mjs.
//   node course/figs.mjs && node shared/course.mjs
//   -> livraisons/Formation-UI-Design-Foundations/UI-Design-Foundations_sample_{EN,AR}.pdf
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { BOOK } from '../course/content.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = process.cwd(), NM = `file://${ROOT}/node_modules`, FIG = `file://${ROOT}/course/fig`;
const TALL = new Set([4, 5]);

function html(lang) {
  const ar = lang === 'ar';
  // ratios and number ranges must stay left-to-right inside Arabic text
  const fix = (o) => (typeof o === 'string' ? (ar ? o.replace(/(\d+(?:\.\d+)?:\d+|\d+–\d+–\d+)/g, '<span class="ltr">$1</span>') : o) : Array.isArray(o) ? o.map(fix) : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, fix(v)])) : o);
  const B = fix(BOOK[lang]), L = B.labels, c = B.ch1;
  const li = (a) => a.map((x) => `<li>${x}</li>`).join('');
  const lesson = (s, i) => `
<section class="lesson">
  <p class="kicker">${B.lesson} 1.${i + 1}</p>
  <h2>${s.title}</h2>
  <p class="idea">${s.idea}</p>
  <h3>${L.why}</h3>${s.why.map((p) => `<p>${p}</p>`).join('')}
  <figure class="${TALL.has(i + 1) ? 'side' : 'stack'}">
    <div><img src="${FIG}/${i + 1}b.png"><span class="cap b">${L.before}</span></div>
    <div><img src="${FIG}/${i + 1}a.png"><span class="cap a">${L.after}</span></div>
    <figcaption>${L.figure} 1.${i + 1} — ${s.title}</figcaption>
  </figure>
  <h3>${L.how}</h3><ol>${li(s.how)}</ol>
  <h3>${L.mistakes}</h3><ul class="x">${li(s.mistakes)}</ul>
  <aside><b>${L.try}</b><p>${s.try}</p></aside>
</section>`;
  return `<!doctype html><html lang="${lang}" dir="${B.dir}"><head><meta charset="utf-8"><style>
@font-face{font-family:Fraunces;src:url(${NM}/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2);font-weight:100 900}
@font-face{font-family:Serif4;src:url(${NM}/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2);font-weight:200 900}
@font-face{font-family:Serif4;src:url(${NM}/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-italic.woff2);font-weight:200 900;font-style:italic}
${[400, 600, 700].map((w) => `@font-face{font-family:Naskh;src:url(${NM}/@fontsource/noto-naskh-arabic/files/noto-naskh-arabic-arabic-${w}-normal.woff2);font-weight:${w};unicode-range:U+0600-06FF,U+FB50-FDFF,U+FE70-FEFF}`).join('')}
${[700, 800].map((w) => `@font-face{font-family:Kufi;src:url(${NM}/@fontsource/noto-kufi-arabic/files/noto-kufi-arabic-arabic-${w}-normal.woff2);font-weight:${w};unicode-range:U+0600-06FF,U+FB50-FDFF,U+FE70-FEFF}`).join('')}
@page{size:148mm 210mm;margin:18mm 16mm 20mm;@bottom-center{content:counter(page);font:9pt Serif4,serif;color:#8A857E}}
@page :first{margin:0;@bottom-center{content:none}}
*{box-sizing:border-box;margin:0;padding:0}
:root{--ink:#1F1D1A;--mute:#6B6660;--rule:#E4DFD8;--tint:#F6F1EA;--acc:#B4532A}
body{font-family:${ar ? 'Naskh,Serif4' : 'Serif4'},serif;font-size:${ar ? '11.2pt' : '10.6pt'};line-height:${ar ? '1.78' : '1.58'};color:var(--ink)}
h1,h2,h3,.kicker,.num{font-family:${ar ? 'Kufi,Fraunces' : 'Fraunces'},serif}
p{margin-bottom:3mm}
.cover{width:148mm;height:210mm;background:#1C1B19;color:#F4EFE7;padding:22mm 16mm;display:flex;flex-direction:column;break-after:page}
.cover .tag{font-family:Serif4,serif;font-size:9pt;letter-spacing:.14em;text-transform:uppercase;color:#C9A98F}
.cover h1{font-size:${ar ? '34pt' : '40pt'};font-weight:${ar ? 800 : 600};line-height:${ar ? '1.5' : '1.08'};margin-top:38mm;letter-spacing:${ar ? '0' : '-.8pt'}}
.cover .bar{width:22mm;height:1.2mm;background:var(--acc);margin:9mm 0}
.cover .sub{font-size:${ar ? '16pt' : '15pt'};color:#D9D2C7}
.cover .by{margin-top:auto;font-family:Serif4,serif;font-size:10pt;color:#C9C2B7;direction:ltr;text-align:${ar ? 'right' : 'left'}}
.cover .sample{font-size:${ar ? '11pt' : '9.5pt'};color:#C9A98F;margin-top:3mm}
.page{break-after:page}
h1.sec{font-size:${ar ? '22pt' : '24pt'};font-weight:${ar ? 800 : 600};margin-bottom:8mm;letter-spacing:${ar ? '0' : '-.4pt'}}
.toc li{list-style:none;display:flex;gap:4mm;align-items:baseline;padding:2.6mm 0;border-bottom:.25mm solid var(--rule)}
.toc .n{font-family:Fraunces,serif;color:var(--acc);font-weight:600;min-width:7mm}
.toc .soon{margin-inline-start:auto;font-size:.8em;color:var(--mute)}
.toc .sub{display:block;font-size:.86em;color:var(--mute)}
.steps{margin:4mm 0 5mm;padding-inline-start:6mm}.steps li{margin-bottom:1.6mm}
.note{font-size:.9em;color:var(--mute);border-top:.25mm solid var(--rule);padding-top:4mm;margin-top:8mm}
.opener{display:flex;flex-direction:column;justify-content:center;min-height:165mm;break-after:page}
.opener .num{font-size:92pt;line-height:1;color:var(--acc);font-weight:${ar ? 800 : 500};font-family:Fraunces,serif}
.opener .ch{font-size:${ar ? '11pt' : '9.5pt'};letter-spacing:${ar ? '0' : '.16em'};text-transform:uppercase;color:var(--mute);margin-top:6mm}
.opener h1{font-size:${ar ? '28pt' : '32pt'};font-weight:${ar ? 800 : 600};margin:2mm 0 8mm;letter-spacing:${ar ? '0' : '-.6pt'}}
.opener p{font-size:1.12em;max-width:108mm}
.lesson{break-before:page}
.kicker{font-size:${ar ? '10pt' : '8.6pt'};letter-spacing:${ar ? '0' : '.16em'};text-transform:uppercase;color:var(--acc);font-weight:${ar ? 700 : 600};margin-bottom:1mm}
h2{font-size:${ar ? '19pt' : '21pt'};font-weight:${ar ? 800 : 600};line-height:1.25;margin-bottom:4mm;letter-spacing:${ar ? '0' : '-.3pt'}}
.idea{font-size:1.14em;${ar ? '' : 'font-style:italic;'}border-inline-start:1mm solid var(--acc);padding-inline-start:4mm;margin:0 0 6mm;color:#3A3631}
h3{font-size:${ar ? '11.5pt' : '10.4pt'};font-weight:${ar ? 700 : 600};margin:5mm 0 2mm;break-after:avoid;${ar ? '' : 'letter-spacing:.02em;'}}
ol,ul.x{padding-inline-start:5.5mm;margin-bottom:2mm;break-before:avoid}li{break-inside:avoid}ol li,ul.x li{margin-bottom:1.3mm}
ul.x{list-style:none;padding-inline-start:0}ul.x li{padding-inline-start:5.5mm;position:relative}
ul.x li::before{content:'×';position:absolute;inset-inline-start:0;color:var(--acc);font-family:Fraunces,serif;font-weight:600}
figure{break-inside:avoid;margin:5mm 0 6mm}
figure img{width:100%;display:block;border:.3mm solid var(--rule);border-radius:1.2mm}
figure.stack div{margin:0 auto 2mm;position:relative;width:${ar ? '60%' : '68%'}}
figure.side{display:grid;grid-template-columns:1fr 1fr;gap:3mm;width:${ar ? '84%' : '100%'};margin-inline:auto}figure.side div{position:relative}figure.side figcaption{grid-column:1/-1}
.cap{position:absolute;top:1.6mm;inset-inline-start:1.6mm;font-family:${ar ? 'Kufi' : 'Fraunces'},serif;font-size:7.4pt;font-weight:700;color:#fff;padding:.5mm 2.2mm;border-radius:1mm;line-height:1.5}
.cap.b{background:#A8321F}.cap.a{background:#1F6F52}
figcaption{font-size:.82em;color:var(--mute);margin-top:1mm}
aside{break-inside:avoid;background:var(--tint);border-radius:2mm;padding:4.5mm 5mm;margin-top:5mm}
aside b{font-family:${ar ? 'Kufi' : 'Fraunces'},serif;color:var(--acc);font-weight:${ar ? 700 : 600};display:block;margin-bottom:1mm}
aside p{margin:0}
.sum li{margin-bottom:2mm}
.next{margin-top:10mm;border-top:.25mm solid var(--rule);padding-top:5mm;color:var(--mute);font-size:.92em}
.ltr{direction:ltr;unicode-bidi:isolate}
</style></head><body>
<div class="cover"><span class="tag">AG Studio</span><h1>${B.title}</h1><div class="bar"></div><div class="sub">${B.subtitle}</div><div class="sample">${B.sample}</div><div class="by">${B.author}</div></div>
<div class="page"><h1 class="sec">${B.toc}</h1><ul class="toc">
${B.chapters.map((t, i) => `<li><span class="n">${i + 1}</span><span>${t}${i === 0 ? `<span class="sub">${c.lessons.map((s) => s.title).join(' · ')}</span>` : ''}</span>${i ? `<span class="soon">${B.soon}</span>` : ''}</li>`).join('')}
</ul></div>
<div class="page"><h1 class="sec">${B.introTitle}</h1>${B.intro.map((p) => `<p>${p}</p>`).join('')}<ol class="steps">${li(B.introList)}</ol><p class="note">${B.introNote}</p></div>
<div class="opener"><div class="num">1</div><div class="ch">${B.chapter} 1</div><h1>${B.chapters[0]}</h1><p>${c.opener}</p></div>
${c.lessons.map(lesson).join('')}
<section class="lesson"><p class="kicker">${B.chapter} 1</p><h2>${L.summary}</h2><ol class="sum">${li(c.summary)}</ol>
<aside><b>${L.exercise}: ${c.exerciseTitle}</b><ol>${li(c.exercise)}</ol></aside>
<p class="next">${B.chapter} 2 — ${B.chapters[1]} · <span class="ltr">youtube.com/@AGStudioDev</span></p></section>
</body></html>`;
}

const out = path.join(ROOT, 'livraisons/Formation-UI-Design-Foundations'); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch();
for (const lang of ['en', 'ar']) {
  const tmp = path.join(ROOT, `course/book-${lang}.html`); fs.writeFileSync(tmp, html(lang));
  const p = await b.newPage(); await p.goto(`file://${tmp}`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
  const file = path.join(out, `UI-Design-Foundations_sample_${lang.toUpperCase()}.pdf`);
  await p.pdf({ path: file, preferCSSPageSize: true, printBackground: true }); await p.close(); console.log('->', file);
}
await b.close();
