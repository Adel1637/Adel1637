// "Where should a beginner developer start?" — a roadmap in 9 steps for a beginner who wants to build web interfaces.
// Short coordinates: x 80..1000, y 280..1150. Facts checked online on 26 Nov 2026: roadmaps agree on HTML + CSS
// (Flexbox, Grid, responsive) -> JavaScript fundamentals -> Git/GitHub -> projects -> one framework later; MDN as the
// reference; Stack Overflow Developer Survey 2025: AI tools increasingly used to learn, low trust, time spent fixing
// "almost-right" AI code. Fictional pages and code only.
export function makeDev(M, K) {
  const { lerp, clamp, E } = M;
  const { F, C, TAU, ez, spr, txt, rr, cursor } = K;
  const T = (ctx, s, x, y, size, w, color, align = 'left', family = F.title) => txt(ctx, s, x, y, size, { w, color, align, family });
  const DBG = '#26272C', LINE = '#3A3B42', DIM = '#A3A3AC', INK = '#18181B', SUB = '#71717A', ACC = '#2563EB', GRN = '#30A46C', RED = '#E5484D';
  const COL = { tag: '#7AA7FF', attr: '#93C5FD', str: '#86EFAC', kw: '#FCA5A5', fn: '#FDE68A', txt: '#EDEDF0', com: '#6B6B73' };
  const ALL = ['Goal', 'HTML', 'CSS', 'JS', 'Git', 'Projects', 'Docs', 'AI', 'Framework'];
  let STEPS = ALL;
  const setSteps = (n) => { STEPS = ALL.slice(0, n); };

  // roadmap rail (top of every vignette)
  function rail(ctx, k, p = 1) {
    const n = STEPS.length, x0 = 110, x1 = 970, y = 318;
    ctx.fillStyle = LINE; ctx.fillRect(x0, y - 1.5, x1 - x0, 3);
    ctx.fillStyle = C.sel; ctx.fillRect(x0, y - 1.5, (x1 - x0) * (k / (n - 1)) * p + 0.0001, 3);
    STEPS.forEach((s, i) => { const x = lerp(x0, x1, i / (n - 1)), on = i <= k, cur = i === k;
      ctx.fillStyle = cur ? C.sel : on ? '#5B8DEF' : '#3A3B42'; ctx.beginPath(); ctx.arc(x, y, cur ? 11 : 7, 0, TAU); ctx.fill();
      if (cur) { ctx.strokeStyle = 'rgba(13,153,255,0.35)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, 18, 0, TAU); ctx.stroke(); }
      T(ctx, s, x, y + 38, 15, 600, cur ? '#FFFFFF' : on ? DIM : '#5B5B63', 'center', F.mono); });
  }
  // code editor with typing
  function editor(ctx, x, y, w, h, file, lines, p, size = 22) {
    rr(ctx, x, y, w, h, 16, DBG, LINE, 1.5); rr(ctx, x + 16, y + 12, 170, 34, 8, '#1F2024'); T(ctx, file, x + 30, y + 35, 15, 600, DIM, 'left', F.mono);
    const total = lines.reduce((s, l) => s + l.reduce((a, [t]) => a + t.length, 0), 0); let left = Math.floor(total * clamp(p));
    lines.forEach((l, i) => { let cx = x + 26; const cy = y + 86 + i * size * 1.55; T(ctx, String(i + 1), x + 16, cy, size * 0.7, 600, '#4A4B53', 'left', F.mono);
      ctx.font = `600 ${size}px ${F.mono}`; l.forEach(([t, c]) => { if (left <= 0) return; const s = t.slice(0, left); left -= t.length; T(ctx, s, cx + 22, cy, size, 600, COL[c] || COL.txt, 'left', F.mono); cx += ctx.measureText(t).width; }); });
  }
  // browser frame with a content callback
  function browser(ctx, x, y, w, h, url, fn) {
    rr(ctx, x, y, w, h, 16, '#EDEDED'); [0, 1, 2].forEach((i) => { ctx.fillStyle = '#C9C9C9'; ctx.beginPath(); ctx.arc(x + 22 + i * 18, y + 22, 5.5, 0, TAU); ctx.fill(); });
    rr(ctx, x + 80, y + 9, Math.min(300, w - 120), 26, 13, '#FFFFFF'); T(ctx, url, x + 96, y + 28, 15, 600, '#555', 'left', F.mono);
    ctx.save(); ctx.beginPath(); ctx.roundRect(x, y + 44, w, h - 44, [0, 0, 16, 16]); ctx.clip(); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x, y + 44, w, h - 44); fn(x, y + 44, w, h - 44); ctx.restore();
  }
  // the page we build: raw (HTML only) -> styled (CSS) ; width for responsive
  function page(ctx, x, y, w, h, s) {
    const styled = s.styled || 0, cnt = s.count || 0;
    if (styled < 0.5) {
      T(ctx, 'Fresh Coffee', x + 24, y + 54, 34, 700, '#000', 'left', 'serif'); T(ctx, 'Beans roasted every morning.', x + 24, y + 92, 19, 400, '#000', 'left', 'serif');
      T(ctx, 'See the menu', x + 24, y + 128, 19, 400, '#0000EE', 'left', 'serif'); ctx.fillStyle = '#0000EE'; ctx.fillRect(x + 24, y + 131, 118, 1.5);
      rr(ctx, x + 24, y + 150, 110, 30, 3, '#EFEFEF', '#767676', 1); T(ctx, 'Add to cart', x + 79, y + 170, 15, 400, '#000', 'center', 'serif');
      return;
    }
    const narrow = w < 460;
    T(ctx, 'Fresh Coffee', x + 28, y + 62, narrow ? 30 : 38, 700, INK); T(ctx, 'Beans roasted every morning.', x + 28, y + 98, narrow ? 16 : 19, 400, SUB);
    const cards = [['Espresso', '$3.00'], ['Latte', '$4.50'], ['Mocha', '$5.00']];
    cards.forEach(([n, pr], i) => { const cw = narrow ? w - 56 : (w - 56 - 32) / 3, cx = narrow ? x + 28 : x + 28 + i * (cw + 16), cy = narrow ? y + 126 + i * 84 : y + 126; const chh = narrow ? 72 : 150;
      rr(ctx, cx, cy, cw, chh, 14, '#F4F4F5'); T(ctx, n, cx + 18, cy + (narrow ? 32 : 40), 20, 600, INK); T(ctx, pr, cx + 18, cy + (narrow ? 56 : 70), 17, 500, SUB);
      if (!narrow) { rr(ctx, cx + 18, cy + 92, cw - 36, 40, 10, INK); T(ctx, 'Add to cart', cx + cw / 2, cy + 118, 15, 600, '#FFFFFF', 'center'); } });
    if (cnt > 0) { rr(ctx, x + w - 128, y + 24, 104, 40, 20, ACC); T(ctx, `Cart · ${cnt}`, x + w - 76, y + 50, 16, 600, '#FFFFFF', 'center'); }
  }
  const panel = (ctx) => rr(ctx, 80, 380, 920, 760, 20, DBG, LINE, 1.5);
  const tag = (ctx, s, x, y, col, p = 1, size = 22, align = 'left') => { if (p <= 0) return; ctx.save(); ctx.globalAlpha *= Math.min(1, p); ctx.font = `600 ${size}px ${F.title}`; const w = ctx.measureText(s).width + size * 1.2, h = size * 1.7; const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x; rr(ctx, x0, y - h / 2, w, h, h / 2, col); T(ctx, s, x0 + w / 2, y + size * 0.36, size, 600, '#FFFFFF', 'center'); ctx.restore(); };
  const ok = (ctx, x, y, good, p, r = 20) => { if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.fillStyle = good ? GRN : RED; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.strokeStyle = '#FFF'; ctx.lineWidth = r * 0.2; ctx.lineCap = 'round'; ctx.beginPath(); if (good) { ctx.moveTo(-r * 0.4, 0); ctx.lineTo(-r * 0.1, r * 0.3); ctx.lineTo(r * 0.45, -r * 0.35); } else { ctx.moveTo(-r * 0.35, -r * 0.35); ctx.lineTo(r * 0.35, r * 0.35); ctx.moveTo(r * 0.35, -r * 0.35); ctx.lineTo(-r * 0.35, r * 0.35); } ctx.stroke(); ctx.restore(); };
  const sp = (v, t) => Math.min(1, spr(v, t, { stiffness: 280, damping: 14 }));

  const V = {};
  // 1 goal
  V.goal = { draw(ctx, v) { rail(ctx, 0, ez(v, 0.3, 1.2)); [['Web interfaces', 'HTML · CSS · JS', true], ['Mobile apps', 'Swift · Kotlin', false], ['Data & AI', 'Python · SQL', false]].forEach(([t, s, on], i) => { const p = ez(v, 0.6 + i * 0.3, 1.4 + i * 0.3, E.outCubic); if (p <= 0) return; const y = 420 + i * 230, sel = on && v > 3; ctx.save(); ctx.globalAlpha = p * (v > 3 && !on ? 0.35 : 1); rr(ctx, 80, y, 920, 200, 20, sel ? 'rgba(13,153,255,0.12)' : DBG, sel ? C.sel : LINE, sel ? 3 : 1.5); T(ctx, t, 130, y + 92, 44, 700, '#FFFFFF'); T(ctx, s, 130, y + 146, 24, 600, DIM, 'left', F.mono); ctx.restore(); if (sel) ok(ctx, 940, y + 100, true, sp(v, 3.2), 26); }); },
    hits: [[0.6, 'path', 'tick'], [0.9, 'path', 'tick'], [1.2, 'path', 'tick'], [3.2, 'pick', 'pop', { pitch: 'A5' }]] };
  V.goalMistake = { draw(ctx, v) { rail(ctx, 0); const L = ['Python', 'Java', 'C++', 'Rust', 'Go', 'Swift', 'PHP', 'Kotlin']; L.forEach((l, i) => { const p = sp(v, 0.5 + i * 0.25); if (p <= 0) return; const x = 160 + (i % 4) * 210, y = 520 + Math.floor(i / 4) * 170; ctx.save(); ctx.translate(x, y); ctx.rotate(((i * 37) % 11 - 5) * 0.02); ctx.scale(p, p); rr(ctx, -90, -45, 180, 90, 16, DBG, LINE, 1.5); T(ctx, l, 0, 10, 28, 700, '#FFFFFF', 'center'); ctx.restore(); }); tag(ctx, '8 languages at once = 0 projects', 540, 900, RED, ez(v, 3, 3.6), 26, 'center'); T(ctx, 'One goal. One path. Then go deep.', 540, 1010, 30, 700, '#FFFFFF', 'center'); }, hits: [[0.5, 'langs', 'tick'], [1.5, 'langs', 'tick'], [3, 'bad', 'thud', { pitch: 'C3' }]] };
  // 2 html
  const HTML = [[['<', 'tag'], ['h1', 'tag'], ['>', 'tag'], ['Fresh Coffee', 'txt'], ['</h1>', 'tag']], [['<', 'tag'], ['p', 'tag'], ['>', 'tag'], ['Beans roasted every morning.', 'txt'], ['</p>', 'tag']], [['<a ', 'tag'], ['href', 'attr'], ['=', 'txt'], ['"/menu"', 'str'], ['>', 'tag'], ['See the menu', 'txt'], ['</a>', 'tag']], [['<button>', 'tag'], ['Add to cart', 'txt'], ['</button>', 'tag']]];
  V.html = { draw(ctx, v) { rail(ctx, 1, ez(v, 0.3, 1.2)); editor(ctx, 80, 380, 920, 330, 'index.html', HTML, ez(v, 0.8, 4, (t) => t), 21); const p = ez(v, 4.2, 5, E.outCubic); if (p > 0) { ctx.save(); ctx.globalAlpha = p; browser(ctx, 80, 740, 920, 400, 'my-first-page', (x, y, w, h) => page(ctx, x, y, w, h, { styled: 0 })); ctx.restore(); tag(ctx, 'Structure only: no style yet', 960, 800, '#3A3B42', ez(v, 5.4, 6), 20, 'right'); } }, hits: [[0.8, 'typing', 'type', { n: 14, len: 1.4 }], [4.2, 'page', 'whoosh', { len: 0.4 }], [5.4, 'note', 'tick']] };
  V.htmlMistake = { draw(ctx, v) { rail(ctx, 1); const bad = [[['<div ', 'tag'], ['class', 'attr'], ['=', 'txt'], ['"title"', 'str'], ['>…</div>', 'tag']], [['<div ', 'tag'], ['onclick', 'attr'], ['=', 'txt'], ['"buy()"', 'str'], ['>Buy</div>', 'tag']]], good = [[['<h1>', 'tag'], ['…', 'txt'], ['</h1>', 'tag']], [['<button>', 'tag'], ['Buy', 'txt'], ['</button>', 'tag']]]; editor(ctx, 80, 380, 920, 250, 'divs-everywhere.html', bad, 1, 21); ok(ctx, 950, 420, false, sp(v, 1.6)); const p = ez(v, 2.6, 3.4, E.outCubic); if (p > 0) { ctx.save(); ctx.globalAlpha = p; editor(ctx, 80, 670, 920, 250, 'semantic.html', good, ez(v, 2.8, 4, (t) => t), 21); ctx.restore(); ok(ctx, 950, 710, true, sp(v, 4.2)); } const t = ez(v, 4.6, 5.2); if (t > 0) { ctx.save(); ctx.globalAlpha = t; T(ctx, 'Real tags = keyboard, screen readers', 540, 1010, 28, 700, '#FFFFFF', 'center'); T(ctx, 'and search engines understand your page.', 540, 1050, 24, 500, DIM, 'center'); ctx.restore(); } }, hits: [[1.6, 'bad', 'thud', { pitch: 'C3' }], [2.8, 'typing', 'type', { n: 6, len: 0.8 }], [4.2, 'good', 'pop', { pitch: 'A5' }]] };
  // 3 css
  const CSS = [[['.menu', 'fn'], [' {', 'txt']], [['  display', 'attr'], [': ', 'txt'], ['grid', 'str'], [';', 'txt']], [['  grid-template-columns', 'attr'], [': ', 'txt'], ['repeat(3, 1fr)', 'str'], [';', 'txt']], [['  gap', 'attr'], [': ', 'txt'], ['16px', 'str'], [';', 'txt']], [['}', 'txt']]];
  V.css = { draw(ctx, v) { rail(ctx, 2, ez(v, 0.3, 1.2)); editor(ctx, 80, 380, 920, 300, 'style.css', CSS, ez(v, 0.8, 3.4, (t) => t), 21); const st = ez(v, 3.6, 4.4, E.inOutCubic); browser(ctx, 80, 710, 920, 430, 'my-first-page', (x, y, w, h) => page(ctx, x, y, w, h, { styled: st })); tag(ctx, 'Flexbox · Grid · Responsive', 960, 770, C.sel, ez(v, 4.8, 5.4), 20, 'right'); }, hits: [[0.8, 'typing', 'type', { n: 12, len: 1.2 }], [3.6, 'styled', 'whoosh', { len: 0.5 }], [4.4, 'done', 'pop', { pitch: 'A5' }]] };
  V.cssMistake = { draw(ctx, v) { rail(ctx, 2); const s = ez(v, 1.2, 3.4, E.inOutCubic), w = lerp(920, 380, s); browser(ctx, 540 - w / 2, 380, w, 600, w < 460 ? 'phone' : 'desktop', (x, y, ww, h) => page(ctx, x, y, ww, h, { styled: 1 })); tag(ctx, 'Responsive: the grid becomes a column', 540, 1040, GRN, ez(v, 3.6, 4.2), 22, 'center'); T(ctx, 'Test at phone width from day one.', 540, 1110, 26, 600, DIM, 'center'); }, hits: [[1.2, 'resize', 'whoosh', { len: 1 }], [3.6, 'ok', 'pop', { pitch: 'A5' }]] };
  // 4 js
  const JS = [[['const ', 'kw'], ['buttons', 'txt'], [' = ', 'txt'], ['document', 'txt'], ['.querySelectorAll', 'fn'], ['(', 'txt'], ["'button'", 'str'], [');', 'txt']], [['let ', 'kw'], ['count', 'txt'], [' = ', 'txt'], ['0', 'str'], [';', 'txt']], [['buttons', 'txt'], ['.forEach', 'fn'], ['((b) => b', 'txt'], ['.addEventListener', 'fn'], ['(', 'txt'], ["'click'", 'str'], [', () => {', 'txt']], [['  count', 'txt'], ['++', 'kw'], ['; ', 'txt'], ['cart', 'txt'], ['.textContent', 'fn'], [' = ', 'txt'], ['`Cart · ${count}`', 'str'], [';', 'txt']], [['}));', 'txt']]];
  V.js = { draw(ctx, v) { rail(ctx, 3, ez(v, 0.3, 1.2)); editor(ctx, 80, 380, 920, 300, 'app.js', JS, ez(v, 0.8, 3.4, (t) => t), 17); const clicks = v < 4 ? 0 : v < 4.8 ? 1 : v < 5.6 ? 2 : 3; browser(ctx, 80, 710, 920, 430, 'my-first-page', (x, y, w, h) => page(ctx, x, y, w, h, { styled: 1, count: clicks })); if (v >= 3.6 && v < 7) { const bx = [260, 556, 556, 852][clicks]; cursor(ctx, bx, 990); } }, hits: [[0.8, 'typing', 'type', { n: 12, len: 1.2 }], [4, 'click', 'click'], [4.8, 'click', 'click'], [5.6, 'click', 'click']] };
  V.jsMistake = { draw(ctx, v) { rail(ctx, 3); [['JavaScript basics', 'variables · functions · events · DOM', true, 0.4], ['React, Vue, Svelte…', 'later, once JS makes sense', false, 1.6]].forEach(([t, s, good, at], i) => { const p = ez(v, at, at + 0.8, E.outCubic); if (p <= 0) return; const y = 420 + i * 300; ctx.save(); ctx.globalAlpha = p; rr(ctx, 80, y, 920, 250, 20, good ? 'rgba(48,164,108,0.10)' : DBG, good ? GRN : LINE, 2); T(ctx, i ? 'THEN' : 'FIRST', 130, y + 60, 20, 600, good ? '#86EFAC' : DIM, 'left', F.mono); T(ctx, t, 130, y + 130, 46, 700, '#FFFFFF'); T(ctx, s, 130, y + 186, 24, 600, DIM, 'left', F.mono); ctx.restore(); }); tag(ctx, 'A framework hides what you don’t understand yet', 540, 1060, RED, ez(v, 3.4, 4), 22, 'center'); }, hits: [[0.4, 'first', 'whoosh', { len: 0.4 }], [1.6, 'then', 'whoosh', { len: 0.4 }], [3.4, 'warn', 'thud', { pitch: 'C3' }]] };
  // 5 git
  const TERM = ['$ git init', '$ git add .', '$ git commit -m "First page"', '$ git push origin main'];
  V.git = { draw(ctx, v) { rail(ctx, 4, ez(v, 0.3, 1.2)); rr(ctx, 80, 380, 920, 360, 16, '#121316', LINE, 1.5); TERM.forEach((l, i) => { const p = ez(v, 0.8 + i * 0.7, 1.4 + i * 0.7); if (p <= 0) return; T(ctx, l.slice(0, Math.floor(l.length * p)), 120, 450 + i * 64, 26, 600, i === 3 ? '#86EFAC' : '#EDEDF0', 'left', F.mono); }); const g = ez(v, 3.8, 4.6); if (g > 0) { ctx.save(); ctx.globalAlpha = g; panel(ctx); ctx.restore(); }
    const commits = ['First page', 'Add styles', 'Cart button', 'Mobile fix'];
    if (g > 0) { ctx.save(); ctx.globalAlpha = g; ctx.translate(0, 400); ctx.fillStyle = LINE; ctx.fillRect(180, 120, 4, 3 * 120); commits.forEach((c, i) => { const p = sp(v, 4.6 + i * 0.4); ctx.fillStyle = i === 3 ? C.sel : '#5B8DEF'; ctx.beginPath(); ctx.arc(182, 120 + i * 120, 16 * p, 0, TAU); ctx.fill(); T(ctx, c, 230, 130 + i * 120, 30, 600, '#FFFFFF'); T(ctx, ['Mon', 'Tue', 'Wed', 'Thu'][i], 940, 130 + i * 120, 22, 600, DIM, 'right', F.mono); }); ctx.restore(); } },
    hits: [[0.8, 'cmd', 'type', { n: 6, len: 0.5 }], [1.5, 'cmd', 'type', { n: 6, len: 0.5 }], [2.2, 'cmd', 'type', { n: 8, len: 0.5 }], [2.9, 'push', 'type', { n: 8, len: 0.5 }], [3.8, 'graph', 'whoosh', { len: 0.4 }], [4.6, 'c', 'tick'], [5, 'c', 'tick'], [5.4, 'c', 'tick'], [5.8, 'c', 'pop', { pitch: 'A5' }]] };
  V.gitMistake = { draw(ctx, v) { rail(ctx, 4); ['site_final.zip', 'site_final_v2.zip', 'site_FINAL_real.zip', 'site_final_v3_OK.zip'].forEach((f, i) => { const p = sp(v, 0.4 + i * 0.35); if (p <= 0) return; ctx.save(); ctx.translate(160, 430 + i * 100); ctx.scale(p, p); rr(ctx, 0, -36, 700, 72, 12, DBG, LINE, 1.5); rr(ctx, 18, -18, 30, 36, 4, '#FCD34D'); T(ctx, f, 70, 10, 26, 600, '#FFFFFF', 'left', F.mono); ctx.restore(); }); tag(ctx, 'No history, no undo, no portfolio', 540, 880, RED, ez(v, 2.4, 3), 24, 'center'); T(ctx, 'A GitHub profile is your first CV.', 540, 990, 32, 700, '#FFFFFF', 'center'); }, hits: [[0.4, 'zip', 'tick'], [0.75, 'zip', 'tick'], [1.1, 'zip', 'tick'], [1.45, 'zip', 'tick'], [2.4, 'bad', 'thud', { pitch: 'C3' }]] };
  // 6 projects
  const PROJ = [['Landing page', 'HTML · CSS'], ['Form with validation', 'HTML · CSS · JS'], ['To-do app', 'JS · local storage'], ['Your portfolio', 'everything + GitHub']];
  V.projects = { draw(ctx, v) { rail(ctx, 5, ez(v, 0.3, 1.2)); PROJ.forEach(([t, s], i) => { const p = ez(v, 0.6 + i * 0.6, 1.3 + i * 0.6, E.outCubic); if (p <= 0) return; const y = 400 + i * 180; ctx.save(); ctx.globalAlpha = p; ctx.translate((1 - p) * 40, 0); rr(ctx, 80, y, 920, 156, 18, i === 3 ? 'rgba(13,153,255,0.12)' : DBG, i === 3 ? C.sel : LINE, 2); T(ctx, `0${i + 1}`, 130, y + 92, 40, 700, i === 3 ? C.sel : '#5B5B63', 'left', F.mono); T(ctx, t, 230, y + 76, 36, 700, '#FFFFFF'); T(ctx, s, 230, y + 118, 22, 600, DIM, 'left', F.mono); ctx.restore(); ok(ctx, 940, y + 78, true, sp(v, 1.4 + i * 0.6)); }); }, hits: [[0.6, 'p1', 'whoosh', { len: 0.3 }], [1.4, 'ok', 'pop', { pitch: 'D5' }], [2, 'ok', 'pop', { pitch: 'E5' }], [2.6, 'ok', 'pop', { pitch: 'F#5' }], [3.2, 'ok', 'bell', { pitch: 'F#6' }]] };
  V.projectsMistake = { draw(ctx, v) { rail(ctx, 5); const loop = (v * 0.6) % 1; ctx.save(); ctx.translate(540, 700); ctx.rotate(loop * TAU * 0.25); ctx.strokeStyle = '#3A3B42'; ctx.lineWidth = 6; ctx.setLineDash([18, 14]); ctx.beginPath(); ctx.arc(0, 0, 230, 0, TAU); ctx.stroke(); ctx.restore(); ['Watch a tutorial', 'Copy the code', 'It works!', 'Next tutorial'].forEach((s, i) => { const a = -Math.PI / 2 + i * Math.PI / 2, x = 540 + Math.cos(a) * 230, y = 700 + Math.sin(a) * 230, p = sp(v, 0.4 + i * 0.4); if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(p, p); rr(ctx, -150, -36, 300, 72, 36, DBG, LINE, 1.5); T(ctx, s, 0, 9, 24, 600, '#FFFFFF', 'center'); ctx.restore(); }); T(ctx, 'TUTORIAL HELL', 540, 712, 36, 700, '#FCA5A5', 'center', F.mono); tag(ctx, 'Build one thing alone, even small', 540, 1050, GRN, ez(v, 2.6, 3.2), 24, 'center'); }, hits: [[0.4, 'loop', 'tick'], [0.8, 'loop', 'tick'], [1.2, 'loop', 'tick'], [1.6, 'loop', 'tick'], [2.6, 'way out', 'pop', { pitch: 'A5' }]] };
  // 7 docs + errors
  V.docs = { draw(ctx, v) { rail(ctx, 6, ez(v, 0.3, 1.2)); const p = ez(v, 0.5, 1.3, E.outCubic); ctx.save(); ctx.globalAlpha = p; browser(ctx, 80, 380, 920, 420, 'developer.mozilla.org', (x, y, w) => { T(ctx, 'Element: addEventListener() method', x + 30, y + 60, 28, 700, INK); T(ctx, 'Sets up a function that will be called whenever', x + 30, y + 104, 19, 400, '#3F3F46'); T(ctx, 'the specified event is delivered to the target.', x + 30, y + 132, 19, 400, '#3F3F46'); rr(ctx, x + 30, y + 160, w - 60, 140, 10, '#F4F4F5'); T(ctx, 'Syntax', x + 50, y + 196, 18, 700, INK); T(ctx, 'addEventListener(type, listener)', x + 50, y + 236, 19, 600, '#1D4ED8', 'left', F.mono); T(ctx, 'addEventListener(type, listener, options)', x + 50, y + 268, 19, 600, '#1D4ED8', 'left', F.mono); }); ctx.restore();
    const e = ez(v, 2.6, 3.4, E.outCubic); if (e > 0) { ctx.save(); ctx.globalAlpha = e; rr(ctx, 80, 830, 920, 230, 16, '#121316', LINE, 1.5); T(ctx, 'CONSOLE', 110, 870, 16, 600, DIM, 'left', F.mono); rr(ctx, 100, 890, 880, 70, 8, 'rgba(229,72,77,0.14)'); T(ctx, '✕ TypeError: Cannot read properties of null', 120, 934, 21, 600, '#FCA5A5', 'left', F.mono); T(ctx, 'app.js : line 4', 760, 1010, 22, 600, '#FDE68A', 'right', F.mono); ctx.restore(); tag(ctx, 'Read it: it tells you WHERE', 960, 1010, C.sel, ez(v, 4, 4.6), 20, 'right'); } },
    hits: [[0.5, 'doc', 'whoosh', { len: 0.4 }], [2.6, 'error', 'thud', { pitch: 'C3' }], [4, 'read', 'pop', { pitch: 'A5' }]] };
  V.docsMistake = { draw(ctx, v) { rail(ctx, 6); [['1. Read the message', 'What broke?'], ['2. Find the line', 'app.js : line 4'], ['3. Search the exact error', 'docs · forums · your notes'], ['4. Fix one thing, test again', 'small steps']].forEach(([t, s], i) => { const p = ez(v, 0.5 + i * 0.6, 1.2 + i * 0.6, E.outCubic); if (p <= 0) return; const y = 410 + i * 170; ctx.save(); ctx.globalAlpha = p; ctx.translate((1 - p) * 40, 0); rr(ctx, 80, y, 920, 146, 18, DBG, LINE, 1.5); T(ctx, t, 120, y + 66, 34, 700, '#FFFFFF'); T(ctx, s, 120, y + 110, 22, 600, DIM, 'left', F.mono); ctx.restore(); }); }, hits: [[0.5, 's', 'tick'], [1.1, 's', 'tick'], [1.7, 's', 'tick'], [2.3, 's', 'pop', { pitch: 'A5' }]] };
  // 8 AI as a tutor
  function bubble(ctx, s, x, y, w, me, p) { if (p <= 0) return; ctx.save(); ctx.globalAlpha = p; ctx.font = `500 24px ${F.title}`; const lines = s.split('\n'), h = 36 + lines.length * 34; rr(ctx, me ? x - w : x, y, w, h, 20, me ? C.sel : '#2E2F35'); lines.forEach((l, i) => T(ctx, l, (me ? x - w : x) + 24, y + 46 + i * 34, 24, 500, '#FFFFFF')); ctx.restore(); return h; }
  V.ai = { draw(ctx, v) { rail(ctx, 7, ez(v, 0.3, 1.2)); panel(ctx); bubble(ctx, 'Explain line 3 of my code,\nstep by step.', 960, 420, 560, true, ez(v, 0.6, 1.2)); bubble(ctx, 'Line 3 adds a "click" listener to\neach button. When a click happens,\nthe function inside runs…', 120, 560, 620, false, ez(v, 1.6, 2.4)); ok(ctx, 940, 440, true, sp(v, 2.6)); bubble(ctx, 'Write my whole app.', 960, 790, 400, true, ez(v, 3.4, 4)); bubble(ctx, '[ 400 lines you can’t explain ]', 120, 900, 560, false, ez(v, 4.2, 4.8)); ok(ctx, 940, 810, false, sp(v, 5)); }, hits: [[0.6, 'ask', 'pop', { pitch: 'D5' }], [1.6, 'answer', 'type', { n: 10, len: 0.8 }], [2.6, 'good', 'pop', { pitch: 'A5' }], [3.4, 'ask', 'pop', { pitch: 'D5' }], [5, 'bad', 'thud', { pitch: 'C3' }]] };
  V.aiMistake = { draw(ctx, v) { rail(ctx, 7); panel(ctx); T(ctx, 'STACK OVERFLOW DEVELOPER SURVEY 2025', 120, 450, 20, 600, C.sel, 'left', F.mono); [['More developers use AI tools to learn to code', 0.6], ['But trust in AI answers stays low', 1.4], ['Many spend time fixing “almost-right” AI code', 2.2]].forEach(([s, at], i) => { const p = ez(v, at, at + 0.7, E.outCubic); if (p <= 0) return; ctx.save(); ctx.globalAlpha = p; ctx.fillStyle = i ? '#FCA5A5' : '#86EFAC'; ctx.beginPath(); ctx.arc(136, 540 + i * 110, 10, 0, TAU); ctx.fill(); T(ctx, s, 166, 550 + i * 110, 30, 600, '#FFFFFF'); ctx.restore(); }); const r = ez(v, 3.4, 4); if (r > 0) { ctx.save(); ctx.globalAlpha = r; T(ctx, 'Rule: if you can’t explain it,', 540, 960, 34, 700, '#FFFFFF', 'center'); T(ctx, 'don’t commit it.', 540, 1010, 34, 700, C.sel, 'center'); ctx.restore(); } }, hits: [[0.6, 'a', 'tick'], [1.4, 'b', 'tick'], [2.2, 'c', 'tick'], [3.4, 'rule', 'bell', { pitch: 'F#6' }]] };
  // 9 framework later
  V.framework = { draw(ctx, v) { rail(ctx, 8, ez(v, 0.3, 1.2)); panel(ctx); const node = (s, x, y, p, main) => { if (p <= 0) return; ctx.save(); ctx.globalAlpha = p; ctx.font = `600 24px ${F.mono}`; const w = ctx.measureText(s).width + 40; rr(ctx, x - w / 2, y - 30, w, 60, 12, main ? '#FFFFFF' : '#2E2F35', main ? null : '#55565E', 1.5); T(ctx, s, x, y + 8, 24, 600, main ? INK : '#EDEDF0', 'center', F.mono); ctx.restore(); }; node('<Page>', 540, 470, ez(v, 0.6, 1.2), true); [['<Header>', 260], ['<MenuGrid>', 540], ['<Cart>', 820]].forEach(([s, x], i) => { const p = ez(v, 1.4 + i * 0.3, 2 + i * 0.3); if (p > 0) { ctx.strokeStyle = '#55565E'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(540, 500); ctx.lineTo(540, 540); ctx.lineTo(x, 540); ctx.lineTo(x, 580); ctx.stroke(); } node(s, x, 610, p, false); }); [['<Card>', 440], ['<Card>', 640]].forEach(([s, x], i) => { const p = ez(v, 2.6 + i * 0.3, 3.2 + i * 0.3); if (p > 0) { ctx.strokeStyle = '#55565E'; ctx.beginPath(); ctx.moveTo(540, 640); ctx.lineTo(540, 680); ctx.lineTo(x, 680); ctx.lineTo(x, 720); ctx.stroke(); } node(s, x, 750, p, false); }); const t = ez(v, 3.8, 4.4); if (t > 0) { ctx.save(); ctx.globalAlpha = t; T(ctx, 'Components are HTML + CSS + JS', 540, 920, 32, 700, '#FFFFFF', 'center'); T(ctx, 'that you already understand.', 540, 966, 28, 600, DIM, 'center'); ctx.restore(); } }, hits: [[0.6, 'root', 'pop', { pitch: 'D5' }], [1.4, 'kids', 'tick'], [2.6, 'cards', 'tick'], [3.8, 'line', 'bell', { pitch: 'F#6' }]] };
  V.frameworkMistake = { draw(ctx, v) { rail(ctx, 8); [['React', 0.4], ['Vue', 0.7], ['Svelte', 1.0], ['Angular', 1.3]].forEach(([s, at], i) => { const p = sp(v, at); if (p <= 0) return; const x = 200 + i * 225; ctx.save(); ctx.translate(x, 560); ctx.scale(p, p); rr(ctx, -95, -60, 190, 120, 18, i === 0 ? 'rgba(13,153,255,0.12)' : DBG, i === 0 ? C.sel : LINE, 2); T(ctx, s, 0, 10, 30, 700, '#FFFFFF', 'center'); ctx.restore(); }); const pick = ez(v, 2.2, 2.8); if (pick > 0) { [1, 2, 3].forEach((i) => { ctx.save(); ctx.globalAlpha = pick * 0.7; ctx.fillStyle = '#1B1B1B'; rr(ctx, 200 + i * 225 - 100, 495, 200, 130, 18, 'rgba(27,27,27,0.75)'); ctx.restore(); }); } tag(ctx, 'Pick ONE and build with it', 540, 780, GRN, ez(v, 2.8, 3.4), 26, 'center'); T(ctx, 'The concepts transfer to the others.', 540, 880, 28, 600, DIM, 'center'); }, hits: [[0.4, 'f', 'tick'], [0.7, 'f', 'tick'], [1, 'f', 'tick'], [1.3, 'f', 'tick'], [2.2, 'pick', 'whoosh', { len: 0.4 }], [2.8, 'one', 'pop', { pitch: 'A5' }]] };
  // recap: the full rail + the finished page
  const recapVig = { draw(ctx, v) { rail(ctx, STEPS.length - 1, ez(v, 0.2, 2.2, (t) => t)); const p = ez(v, 0.6, 1.4, E.outCubic); ctx.save(); ctx.globalAlpha = p; browser(ctx, 80, 420, 920, 600, 'my-first-page', (x, y, w, h) => page(ctx, x, y, w, h, { styled: 1, count: 3 })); ctx.restore(); }, hits: [[0.2, 'rail', 'riser', { len: 1 }], [2.2, 'done', 'bell', { pitch: 'F#6' }]] };
  // hook art (cover style): three tilted code editors, numbered 1-2-3, springing in
  const ART = {
    html: [[['<h1>', 'tag'], ['Fresh Coffee', 'txt'], ['</h1>', 'tag']], [['<p>', 'tag'], ['Roasted every morning.', 'txt'], ['</p>', 'tag']], [['<button>', 'tag'], ['Add to cart', 'txt'], ['</button>', 'tag']]],
    css: [[['.menu', 'fn'], [' {', 'txt']], [['  display', 'attr'], [': ', 'txt'], ['grid', 'str'], [';', 'txt']], [['  gap', 'attr'], [': ', 'txt'], ['16px', 'str'], [';', 'txt']], [['}', 'txt']]],
    js: [[['let ', 'kw'], ['count', 'txt'], [' = ', 'txt'], ['0', 'str'], [';', 'txt']], [['button', 'txt'], ['.addEventListener', 'fn'], ['(', 'txt'], ["'click'", 'str'], [', () => {', 'txt']], [['  count', 'txt'], ['++', 'kw'], [';', 'txt']], [['});', 'txt']]],
  };
  function hookArt(ctx, v, t, long) {
    const W3 = long ? [['html', 'index.html', 1010, 170, 700, -6, 0], ['css', 'style.css', 1110, 400, 640, 5, 1.2], ['js', 'app.js', 1030, 610, 760, -2, 3.4]]
      : [['html', 'index.html', 90, 930, 740, -6, 0], ['css', 'style.css', 250, 1100, 700, 4, 0.4], ['js', 'app.js', 120, 1290, 820, -2, 0.8]];
    W3.forEach(([k, file, x, y, w, rot, at], i) => {
      const p = at === 0 ? 1 : Math.min(1, spr(v, at, { stiffness: 240, damping: 15 })); if (p <= 0) return;
      const n = ART[k].length, h = 96 + n * 38, bob = Math.sin(t * 1.4 + i) * 4;
      ctx.save(); ctx.globalAlpha = Math.min(1, p); ctx.translate(x + w / 2, y + h / 2 + (1 - p) * 80 + bob); ctx.rotate((rot * Math.PI) / 180); ctx.translate(-(x + w / 2), -(y + h / 2));
      ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 24; rr(ctx, x, y, w, h, 20, DBG); ctx.shadowColor = 'transparent';
      editor(ctx, x, y, w, h, '      ' + file, ART[k], 1, 24);
      ctx.fillStyle = C.sel; ctx.beginPath(); ctx.arc(x + 36, y + 29, 15, 0, TAU); ctx.fill(); T(ctx, String(i + 1), x + 36, y + 35, 17, 700, '#FFFFFF', 'center');
      ctx.restore();
    });
  }
  return { V, recapVig, page, browser, rail, setSteps, hookArt };
}

export function devTopic(K, D, long) {
  const V = D.V;
  const S = [
    ['goal', ['PICK ONE', 'GOAL.'], 'WEB INTERFACES: HTML, CSS, JAVASCRIPT.', 'اختر هدفًا واحدًا.', 'ONE GOAL BEATS TEN HALF-STARTED LANGUAGES.', 'هدف واحد أفضل من عشر لغات بدأتها ولم تكملها.'],
    ['html', ['START WITH', 'HTML.'], 'THE STRUCTURE: TITLES, TEXT, LINKS, BUTTONS.', 'ابدأ بلغة HTML.', 'USE REAL TAGS: H1, P, A, BUTTON, NOT DIVS.', 'استخدم الوسوم الحقيقية، لا div في كل مكان.'],
    ['css', ['THEN', 'CSS.'], 'LAYOUT WITH FLEXBOX AND GRID. RESPONSIVE.', 'ثم CSS للتنسيق.', 'TEST AT PHONE WIDTH FROM DAY ONE.', 'اختبر بعرض الهاتف منذ اليوم الأول.'],
    ['js', ['JAVASCRIPT', 'BASICS.'], 'VARIABLES, FUNCTIONS, EVENTS, THE DOM.', 'أساسيات JavaScript.', 'NO FRAMEWORK BEFORE THE BASICS.', 'لا إطار عمل قبل الأساسيات.'],
    ['git', ['GIT & GITHUB', 'FROM WEEK ONE.'], 'SAVE EVERY STEP. SHOW YOUR WORK.', 'استخدم Git وGitHub منذ الأسبوع الأول.', 'COMMIT SMALL, COMMIT OFTEN.', 'احفظ تغييرات صغيرة، وبشكل متكرر.'],
    ['projects', ['BUILD SMALL', 'PROJECTS.'], 'A PAGE, A FORM, A TO-DO APP, A PORTFOLIO.', 'ابنِ مشاريع صغيرة.', 'FINISHED AND SMALL BEATS BIG AND ABANDONED.', 'مشروع صغير مكتمل أفضل من مشروع كبير متروك.'],
    ['docs', ['READ DOCS', 'AND ERRORS.'], 'MDN IS THE REFERENCE. ERRORS TELL YOU WHERE.', 'اقرأ التوثيق ورسائل الخطأ.', 'COPY THE EXACT ERROR WHEN YOU SEARCH.', 'انسخ نص الخطأ كما هو عند البحث.'],
    ['ai', ['AI AS A TUTOR,', 'NOT A CRUTCH.'], 'ASK FOR EXPLANATIONS, NOT FOR WHOLE APPS.', 'الذكاء الاصطناعي معلّم، لا عكّاز.', 'IF YOU CAN’T EXPLAIN IT, DON’T COMMIT IT.', 'إن لم تستطع شرحه، فلا تحفظه في مشروعك.'],
    ['framework', ['A FRAMEWORK,', 'LATER.'], 'COMPONENTS ARE HTML, CSS AND JS YOU KNOW.', 'إطار العمل لاحقًا.', 'PICK ONE. THE CONCEPTS TRANSFER.', 'اختر إطارًا واحدًا، فالمفاهيم تنتقل إلى غيره.'],
  ];
  const MISTAKE = {
    goal: [['MISTAKE:', '8 LANGUAGES.'], 'LEARNING EVERYTHING = FINISHING NOTHING.', 'خطأ شائع: ثماني لغات في وقت واحد.'],
    html: [['MISTAKE:', 'DIVS EVERYWHERE.'], 'REAL TAGS HELP KEYBOARDS AND SCREEN READERS.', 'خطأ شائع: استخدام div في كل مكان.'],
    css: [['MISTAKE:', 'DESKTOP ONLY.'], 'MOST PEOPLE WILL OPEN IT ON A PHONE.', 'خطأ شائع: التصميم لشاشة الحاسوب فقط.'],
    js: [['MISTAKE:', 'REACT ON DAY ONE.'], 'A FRAMEWORK HIDES WHAT YOU DON’T KNOW YET.', 'خطأ شائع: البدء بـ React من اليوم الأول.'],
    git: [['MISTAKE:', 'FINAL_V3.ZIP'], 'NO HISTORY, NO UNDO, NO PORTFOLIO.', 'خطأ شائع: حفظ النسخ في ملفات مضغوطة.'],
    projects: [['MISTAKE:', 'TUTORIAL HELL.'], 'WATCH, COPY, REPEAT… AND NEVER BUILD ALONE.', 'خطأ شائع: الدوران في حلقة الدروس دون بناء شيء.'],
    docs: [['FIXING AN', 'ERROR, STEP BY STEP.'], 'READ, LOCATE, SEARCH, FIX ONE THING.', 'إصلاح الخطأ خطوة بخطوة.'],
    ai: [['WHAT THE', 'SURVEY SAYS.'], 'STACK OVERFLOW DEVELOPER SURVEY 2025.', 'ماذا يقول استطلاع Stack Overflow لعام 2025؟'],
    framework: [['MISTAKE:', 'FOUR FRAMEWORKS.'], 'PICK ONE AND BUILD WITH IT.', 'خطأ شائع: تعلّم أربعة أطر عمل معًا.'],
  };
  const mk = (s, i) => ({ part: i, title: s[1], en: s[2], ar: s[3], tip: s[4], tipAr: s[5], tipAt: 13, vig: V[s[0]] });
  let items;
  if (long) { items = []; S.forEach((s, i) => { items.push(mk(s, i)); const m = MISTAKE[s[0]]; items.push({ part: i, title: m[0], en: m[1], ar: m[2], vig: V[s[0] + 'Mistake'] }); }); }
  else items = S.slice(0, 8).map((s, i) => ({ ...mk(s, i), part: undefined }));
  const parts = S.map((s, i) => ({ en: ['GOAL', 'HTML', 'CSS', 'JAVASCRIPT', 'GIT', 'PROJECTS', 'DOCS & ERRORS', 'AI', 'FRAMEWORK'][i], ar: ['الهدف', 'HTML لغة', 'التنسيق بـ CSS', 'JavaScript لغة', 'Git و GitHub', 'المشاريع', 'التوثيق والأخطاء', 'الذكاء الاصطناعي', 'إطار العمل'][i], count: `STEP ${i + 1} / 9` }));
  parts[1].ar = 'البنية بلغة HTML'; parts[3].ar = 'البرمجة بلغة JavaScript'; parts[4].ar = 'حفظ العمل بـ Git';
  const n = long ? 9 : 8;
  D.setSteps(n);
  return {
    fonts: ['400 20px Plex', '500 20px Plex', '600 20px Plex'],
    span: long ? 26 : 13, hookLen: long ? 8 : 6,
    hook: { style: 'cover', lines: ['WHERE SHOULD', 'A BEGINNER', 'DEV START?'], accent: 'START?', ar: 'من أين يبدأ المطوّر المبتدئ؟', en: `THE ${n} STEPS, IN THE RIGHT ORDER.`, art: D.hookArt, hits: long ? [[1.2, 'css window', 'pop', { pitch: 'E5' }], [3.4, 'js window', 'pop', { pitch: 'A5' }]] : [[0.4, 'css window', 'pop', { pitch: 'E5' }], [0.8, 'js window', 'pop', { pitch: 'A5' }]], tags: ['HTML', 'CSS', 'JS', 'Git', 'Docs', 'AI'] },
    items, parts: long ? parts : undefined,
    label: (i) => `STEP 0${items[i].part + 1 || i + 1} / 0${n}`,
    recap: { title: ['ONE STEP', 'AT A TIME.'], ar: 'خطوة بعد خطوة.', en: 'GOAL · HTML · CSS · JS · GIT · PROJECTS · DOCS · AI' + (long ? ' · FRAMEWORK' : ''), vig: D.recapVig, len: long ? 16 : 14 },
    cover: { lines: ['WHERE SHOULD', 'A BEGINNER DEV', 'START?'], ar: 'من أين يبدأ المطوّر المبتدئ؟', art: (ctx, x, y, w, h) => { const s = Math.min(w / 920, h / 760); ctx.save(); ctx.translate(x + (w - 920 * s) / 2, y + 10); ctx.scale(s, s); ctx.translate(-80, -300); D.rail(ctx, 3); D.browser(ctx, 80, 380, 920, 560, 'my-first-page', (bx, by, bw, bh) => D.page(ctx, bx, by, bw, bh, { styled: 1, count: 2 })); ctx.restore(); } },
  };
}
