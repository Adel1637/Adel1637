// Covers for "Where should a beginner developer start?" — stacked, tilted code editors (fictional code), no logo.
import fs from 'fs';
import path from 'path';
const here = path.dirname(new URL(import.meta.url).pathname);
const NM = '../../node_modules/@fontsource';
const css = `
@font-face{font-family:Plex;src:url(${NM}/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff2);font-weight:700}
@font-face{font-family:Mono;src:url(${NM}/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2);font-weight:600}
@font-face{font-family:Ar;src:url(${NM}/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-700-normal.woff2);font-weight:700;unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F}
*{box-sizing:border-box;margin:0;padding:0} body{background:#000}
.s{position:relative;overflow:hidden;background:#1B1B1B;font-family:Plex;color:#fff}
.h{font-weight:700;line-height:.95;letter-spacing:-.01em}
.ar{font-family:Ar;font-weight:700;direction:rtl}
.mono{font:600 26px Mono;color:#A8A8A8}
.ed{position:absolute;background:#26272C;border:1.5px solid #3A3B42;border-radius:22px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.6)}
.ed .tab{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1.5px solid #3A3B42}
.ed .tab b{font:600 20px Mono;color:#EDEDF0;background:#1F2024;padding:6px 14px;border-radius:8px}
.ed .n{display:inline-flex;width:34px;height:34px;border-radius:17px;background:#0D99FF;color:#fff;font:700 18px Plex;align-items:center;justify-content:center}
.ed pre{font:600 24px/1.6 Mono;color:#EDEDF0;padding:18px 24px;white-space:pre}
.t{color:#7AA7FF}.a{color:#93C5FD}.str{color:#86EFAC}.k{color:#FCA5A5}.f{color:#FDE68A}
`;
const ED = {
  html: `<span class="t">&lt;h1&gt;</span>Fresh Coffee<span class="t">&lt;/h1&gt;</span>\n<span class="t">&lt;p&gt;</span>Roasted every morning.<span class="t">&lt;/p&gt;</span>\n<span class="t">&lt;button&gt;</span>Add to cart<span class="t">&lt;/button&gt;</span>`,
  css: `<span class="f">.menu</span> {\n  <span class="a">display</span>: <span class="str">grid</span>;\n  <span class="a">gap</span>: <span class="str">16px</span>;\n}`,
  js: `<span class="k">let</span> count = <span class="str">0</span>;\nbutton.<span class="f">addEventListener</span>(<span class="str">'click'</span>, () =&gt; {\n  count<span class="k">++</span>;\n});`,
};
const ed = (k, file, n, l, t, w, rot, z) => `<div class="ed" style="left:${l}px;top:${t}px;width:${w}px;transform:rotate(${rot}deg);z-index:${z}"><div class="tab"><span class="n">${n}</span><b>${file}</b></div><pre>${ED[k]}</pre></div>`;
const vertical = `<div class="s" id="c" style="width:1080px;height:1920px">
 <div class="mono" style="position:absolute;top:270px;left:80px">LEARN UI/UX</div><div class="mono" style="position:absolute;top:270px;right:80px">AG STUDIO</div>
 <div class="h" style="position:absolute;top:380px;left:76px;font-size:128px">WHERE SHOULD<br>A BEGINNER<br>DEV <span style="color:#0D99FF">START?</span></div>
 <div class="ar" style="position:absolute;top:780px;right:80px;font-size:60px">من أين يبدأ المطوّر المبتدئ؟</div>
 ${ed('html', 'index.html', 1, 90, 930, 740, -6, 1)}${ed('css', 'style.css', 2, 250, 1090, 700, 4, 2)}${ed('js', 'app.js', 3, 120, 1280, 820, -2, 3)}
</div>`;
const thumb = `<div class="s" id="c" style="width:1280px;height:720px">
 <div class="h" style="position:absolute;top:130px;left:70px;font-size:80px;z-index:5">WHERE SHOULD<br>A BEGINNER<br>DEV <span style="color:#0D99FF">START?</span></div>
 <div class="ar" style="position:absolute;top:420px;left:70px;width:620px;text-align:right;font-size:44px;z-index:5">من أين يبدأ المطوّر المبتدئ؟</div>
 <div class="mono" style="position:absolute;top:520px;left:70px;font-size:26px;color:#A8A8A8;z-index:5">9 STEPS · IN THE RIGHT ORDER</div>
 ${ed('html', 'index.html', 1, 790, 80, 470, -6, 1)}${ed('css', 'style.css', 2, 880, 250, 420, 5, 2)}${ed('js', 'app.js', 3, 810, 420, 500, -2, 3)}
</div>`;
for (const [n, body] of [['cover-short', vertical], ['cover-thumb', thumb]]) fs.writeFileSync(path.join(here, n + '.html'), `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`);
console.log('ok');
