// "How to choose a font" — 7 checks that take 6 real open-source fonts (OFL, real font files) down to one.
// Short coordinates: x 80..1000, y 280..1150. Facts checked online on 24 Nov 2026, and measured on the real files:
//  - Montserrat, Roboto, Inter: capital I and lowercase l are plain bars (almost identical); Atkinson Hyperlegible and
//    IBM Plex Sans separate I / l / 1 clearly. Playfair Display uses old-style figures (1 and 0 look like ı and o).
//  - x-height of every candidate is 73-76 % of the cap height (RGD AccessAbility recommends about 2/3 to 3/4).
//  - Atkinson Hyperlegible (original, on the board) ships 2 weights; Atkinson Hyperlegible Next (Feb 2025) has 7.
//  - Roboto and IBM Plex Sans have equal-width (tabular) digits by default; Inter's default digits are proportional.
//  - IBM Plex Sans has a matching IBM Plex Sans Arabic; Roboto has no Arabic glyphs (the device falls back).
//  - SIL Open Font License: use in apps, websites and products you sell; only the font files may not be sold alone.
export function makeTypo(M, K) {
  const { lerp, clamp, E, mix } = M;
  const { F, C, TAU, ez, spr, txt, rr, pill } = K;
  const T = (ctx, s, x, y, size, w, color, align = 'left', family = F.title) => txt(ctx, s, x, y, size, { w, color, align, family });
  const AR = (ctx, s, x, y, size, w, color, family = 'PlexAr4', align = 'right') => txt(ctx, s, x, y, size, { w, color, align, family, rtl: true });
  const BG = '#26272C', LINE = '#3A3B42', TXT = '#EEEEF0', DIM = '#A3A3AC', RED = '#E5484D', GREEN = '#30A46C', BLUE = '#0D99FF';
  const FONTS = [
    { id: 'lob', name: 'Lobster', fam: 'FLob', test: 1, why: 'Decorative' },
    { id: 'play', name: 'Playfair Display', fam: 'FPlay', test: 1, why: 'Display only' },
    { id: 'mont', name: 'Montserrat', fam: 'FMont', test: 2, why: 'I ≈ l' },
    { id: 'rob', name: 'Roboto', fam: 'FRob', test: 2, why: 'I ≈ l' },
    { id: 'atk', name: 'Atkinson Hyperlegible', fam: 'FAtk', test: 3, why: '2 weights' },
    { id: 'plex', name: 'IBM Plex Sans', fam: 'Plex', test: 0 },
  ];
  const byId = Object.fromEntries(FONTS.map((f) => [f.id, f]));
  function tag(ctx, s, x, y, col, p = 1, size = 22, align = 'left') {
    if (p <= 0) return;
    ctx.save(); ctx.globalAlpha *= Math.min(1, p); ctx.font = `600 ${size}px ${F.title}`; const w = ctx.measureText(s).width + size * 1.2, h = size * 1.75;
    const x0 = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x;
    ctx.translate(x0 + w / 2, y); ctx.scale(lerp(0.7, 1, Math.min(1, p)), lerp(0.7, 1, Math.min(1, p))); rr(ctx, -w / 2, -h / 2, w, h, h / 2, col); T(ctx, s, 0, size * 0.36, size, 600, '#FFFFFF', 'center'); ctx.restore();
  }
  function badge(ctx, x, y, ok, p, r = 22) {
    if (p <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.fillStyle = ok ? GREEN : RED; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = r * 0.2; ctx.lineCap = 'round'; ctx.beginPath();
    if (ok) { ctx.moveTo(-r * 0.42, 0); ctx.lineTo(-r * 0.1, r * 0.32); ctx.lineTo(r * 0.45, -r * 0.35); } else { ctx.moveTo(-r * 0.35, -r * 0.35); ctx.lineTo(r * 0.35, r * 0.35); ctx.moveTo(r * 0.35, -r * 0.35); ctx.lineTo(-r * 0.35, r * 0.35); }
    ctx.stroke(); ctx.restore();
  }
  const white = (ctx, x, y, w, h) => rr(ctx, x, y, w, h, 18, '#FFFFFF');

  // ---------------------------------------------------------------- the specimen board (6 real fonts)
  function card(ctx, f, x, y, w, h, { mode = 'spec', out = 0, ok = 0, win = 0 }) {
    rr(ctx, x, y, w, h, 16, BG, win > 0 ? mix(LINE, BLUE, win) : LINE, win > 0 ? 3.5 : 1.5);
    ctx.save(); ctx.globalAlpha *= 1 - 0.7 * out;
    T(ctx, f.name, x + 22, y + 40, 18, 600, DIM, 'left', F.mono);
    if (mode === 'spec') { T(ctx, 'Aa', x + 22, y + h - 40, 118, 400, TXT, 'left', f.fam); T(ctx, 'Il1 O0', x + w - 24, y + h - 104, 48, 400, TXT, 'right', f.fam); T(ctx, 'Pay now · 1,240', x + w - 24, y + h - 50, 24, 400, DIM, 'right', f.fam); }
    else T(ctx, 'Il1 O0', x + w / 2, y + h / 2 + 52, 112, 400, TXT, 'center', f.fam);
    ctx.restore();
    if (out > 0) {
      ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + 24, y + h - 24); ctx.lineTo(lerp(x + 24, x + w - 24, out), lerp(y + h - 24, y + 24, out)); ctx.stroke(); ctx.restore();
      tag(ctx, f.why, x + w - 20, y + 36, RED, ez(out, 0.5, 1), 20, 'right');
    }
    if (ok > 0) badge(ctx, x + w - 40, y + 40, true, ok, 20);
  }
  const CARD = (i) => ({ x: 80 + (i % 2) * 470, y: 300 + Math.floor(i / 2) * 282 });
  function board(ctx, v, { test = 0, t0 = 3, mode = 'spec', appear = 0.2, okAt = null, okIds = [], win = 0 }) {
    let k = 0;
    FONTS.forEach((f, i) => {
      const { x, y } = CARD(i), s = appear === null ? 1 : Math.min(1, spr(v, appear + i * 0.1, { stiffness: 260, damping: 16 }));
      if (s <= 0) return;
      let out = 0; if (f.test && f.test < test) out = 1; else if (f.test === test) { out = ez(v, t0 + k * 0.45, t0 + k * 0.45 + 0.6, E.outCubic); k++; }
      const ok = okAt !== null && okIds.includes(f.id) ? Math.min(1.1, spr(v, okAt + okIds.indexOf(f.id) * 0.3, { stiffness: 300, damping: 13 })) : 0;
      ctx.save(); ctx.globalAlpha *= s; ctx.translate(x + 225, y + 131); ctx.scale(lerp(0.9, 1, s), lerp(0.9, 1, s)); ctx.translate(-(x + 225), -(y + 131));
      card(ctx, f, x, y, 450, 262, { mode, out, ok, win: f.id === 'plex' ? win : 0 });
      ctx.restore();
    });
  }
  const boardHits = (n, t0 = 3) => [[0.2, 'cards', 'whoosh', { len: 0.5 }], ...Array.from({ length: n }, (_, k) => [t0 + k * 0.45, `strike ${k}`, 'thud', { pitch: 'C3' }])];

  // 1a. use: decorative and display fonts leave
  const vUse = { draw(ctx, v) { board(ctx, v, { test: 1 }); }, hits: [...boardHits(2), [4.4, 'four left', 'tok', { pitch: 'D5' }]] };
  // 1b. a display font in a form: old-style figures
  const vSmall = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1.1, E.outCubic); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a; white(ctx, 80, 300, 920, 370);
      T(ctx, 'WEEKEND EDITION', 124, 360, 18, 600, '#71717A', 'left', F.mono);
      T(ctx, 'The Art of', 120, 480, 96, 400, '#18181B', 'left', 'FPlay'); T(ctx, 'Slow Living', 120, 590, 96, 700, '#18181B', 'left', 'FPlay');
      tag(ctx, 'Big title: beautiful', 960, 360, GREEN, ez(v, 1.6, 2.2), 20, 'right');
      ctx.restore();
      const b = ez(v, 2.4, 3.2, E.outCubic); if (b <= 0) return;
      ctx.save(); ctx.globalAlpha = b; ctx.translate(0, (1 - b) * 30); white(ctx, 80, 700, 920, 440);
      T(ctx, 'Card number', 120, 766, 22, 400, '#52525B', 'left', 'FPlay'); rr(ctx, 120, 786, 840, 72, 12, '#FFFFFF', '#D4D4D8', 2); T(ctx, '4111 1010 0011 1001', 146, 836, 36, 400, '#18181B', 'left', 'FPlay');
      T(ctx, 'Total', 120, 930, 26, 400, '#52525B', 'left', 'FPlay'); T(ctx, '$1,101.10', 960, 930, 36, 700, '#18181B', 'right', 'FPlay');
      rr(ctx, 120, 976, 840, 80, 14, '#18181B'); T(ctx, 'Pay now', 540, 1028, 30, 700, '#FFFFFF', 'center', 'FPlay');
      const c = ez(v, 4, 4.6); if (c > 0) { ctx.save(); ctx.globalAlpha *= c; ctx.strokeStyle = RED; ctx.lineWidth = 4; rr(ctx, 136, 796, 470, 54, 10, null, RED, 4); ctx.restore(); tag(ctx, '1 or l? 0 or o?', 960, 766, RED, c, 22, 'right'); }
      ctx.restore();
    },
    hits: [[0.2, 'poster', 'whoosh', { len: 0.5 }], [1.6, 'beautiful', 'pop', { pitch: 'A5' }], [2.4, 'form', 'whoosh', { len: 0.4 }], [4, 'problem', 'thud', { pitch: 'C3' }]],
  };

  // 2a. the Il1 O0 test
  const vIl1 = { draw(ctx, v) { board(ctx, v, { test: 2, t0: 3.2, mode: 'il1', okAt: 4.6, okIds: ['atk', 'plex'] }); }, hits: [...boardHits(2, 3.2), [4.6, 'pass 1', 'pop', { pitch: 'E5' }], [4.9, 'pass 2', 'pop', { pitch: 'A5' }]] };
  // 2b. x-height, measured on the real font
  // IBM Plex Sans OS/2 metrics read from the font file: x-height 516, cap height 698 (units per em 1000) = 74 %
  const XH = 516 / 1000, CH = 698 / 1000;
  const vXh = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1.1, E.outCubic); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a; rr(ctx, 80, 300, 920, 840, 18, BG, LINE, 1.5);
      const size = 360, base = 930, xh = size * XH, ch = size * CH;
      const band = ez(v, 3.6, 4.4); if (band > 0) { ctx.fillStyle = `rgba(13,153,255,${0.18 * band})`; ctx.fillRect(110, base - ch * 0.75, 860, ch * (0.75 - 0.667)); T(ctx, 'target 2/3 – 3/4', 120, base - ch * 0.667 + 30, 20, 600, BLUE, 'left', F.mono); }
      T(ctx, 'Hxg', 330, base, size, 400, TXT, 'left', 'Plex');
      [[base, 'baseline', 1.8], [base - xh, 'x-height', 2.4], [base - ch, 'cap height', 3]].forEach(([y, l, t]) => { const p = ez(v, t, t + 0.7, E.inOutCubic); if (p <= 0) return; ctx.fillStyle = l === 'x-height' ? BLUE : '#6B6B73'; ctx.fillRect(110, y - 1.5, 860 * p, 3); T(ctx, l, 120, y - 12, 20, 600, l === 'x-height' ? BLUE : DIM, 'left', F.mono); });
      const r = ez(v, 4.6, 5.2); if (r > 0) { ctx.globalAlpha = a * r; T(ctx, `IBM Plex Sans: x-height = ${Math.round((XH / CH) * 100)} % of the capitals`, 540, 1086, 28, 600, TXT, 'center'); badge(ctx, 540, 1026, true, Math.min(1, spr(v, 4.8)), 22); }
      ctx.restore();
    },
    hits: [[0.2, 'specimen', 'whoosh', { len: 0.5 }], [1.8, 'baseline', 'tick'], [2.4, 'x-height', 'tick'], [3, 'cap', 'tick'], [3.6, 'band', 'tok', { pitch: 'D5' }], [4.8, 'measured', 'bell', { pitch: 'F#6' }]],
  };
  // 2c. test at small sizes, with a loupe
  function uiRows(ctx) {
    white(ctx, 80, 300, 920, 560);
    [[12, 'Last updated 2 min ago'], [14, 'Forgot your password?'], [16, 'Order #10110 · 3 items']].forEach(([s, l], i) => { const y = 420 + i * 150; T(ctx, `${s} px`, 120, y, 20, 600, '#A1A1AA', 'left', F.mono); T(ctx, l, 260, y, s * 1.5, 400, '#18181B', 'left', 'Plex'); ctx.fillStyle = '#F0F0F2'; if (i < 2) ctx.fillRect(120, y + 62, 840, 2); });
  }
  const vSizes = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1.1, E.outCubic); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a; uiRows(ctx); ctx.restore();
      const lp = ez(v, 2.6, 3.4); if (lp <= 0) return;
      const m = ez(v, 3.4, 6.4, E.inOutCubic), sx = lerp(330, 380, m), sy = lerp(404, 704, m), lx = lerp(300, 780, m), ly = 1010, R = 128, Z = 2.4;
      ctx.save(); ctx.globalAlpha = lp; ctx.strokeStyle = 'rgba(13,153,255,0.8)'; ctx.lineWidth = 3; ctx.strokeRect(sx - R / Z, sy - R / Z, 2 * R / Z, 2 * R / Z);
      ctx.beginPath(); ctx.arc(lx, ly, R, 0, TAU); ctx.clip(); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 1080, 1920);
      ctx.translate(lx, ly); ctx.scale(Z, Z); ctx.translate(-sx, -sy); uiRows(ctx); ctx.restore();
      ctx.save(); ctx.globalAlpha = lp; ctx.strokeStyle = BLUE; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(lx, ly, R, 0, TAU); ctx.stroke(); ctx.restore();
      tag(ctx, 'Zoom ×2.4', lx, ly - R - 6, BLUE, lp, 18, 'center');
    },
    hits: [[0.2, 'rows', 'whoosh', { len: 0.5 }], [2.6, 'loupe', 'pop', { pitch: 'A5' }], [4.6, 'scan', 'tick'], [6.2, 'scan', 'tick']],
  };

  // 3a. enough weights: the original Atkinson Hyperlegible has 2, IBM Plex Sans has 5 here (it has more)
  const WEIGHTS = [[300, 'Light'], [400, 'Regular'], [500, 'Medium'], [600, 'SemiBold'], [700, 'Bold']];
  const vWeights = {
    draw(ctx, v) {
      [['atk', 80, [400, 700]], ['plex', 550, WEIGHTS.map((w) => w[0])]].forEach(([id, x, have], c) => {
        const s = ez(v, 0.2 + c * 0.3, 1.1 + c * 0.3, E.outCubic); if (s <= 0) return;
        const f = byId[id]; ctx.save(); ctx.globalAlpha = s; rr(ctx, x, 300, 450, 840, 16, BG, LINE, 1.5);
        T(ctx, f.name, x + 24, 346, 18, 600, DIM, 'left', F.mono);
        const out = id === 'atk' ? ez(v, 3.6, 4.3, E.outCubic) : 0;
        WEIGHTS.forEach(([w, l], i) => {
          const y = 440 + i * 150, ok = have.includes(w), p = ez(v, 1 + i * 0.25 + c * 0.2, 1.6 + i * 0.25 + c * 0.2);
          ctx.save(); ctx.globalAlpha *= p * (1 - 0.6 * out);
          T(ctx, `${l} ${w}`, x + 24, y, 17, 600, ok ? DIM : '#5B5B63', 'left', F.mono);
          if (ok) T(ctx, 'Settings', x + 24, y + 70, 54, w, TXT, 'left', f.fam); else { ctx.setLineDash([8, 8]); ctx.strokeStyle = '#4A4B53'; ctx.lineWidth = 2; ctx.strokeRect(x + 24, y + 22, 400, 62); ctx.setLineDash([]); T(ctx, 'missing', x + 224, y + 62, 20, 600, '#5B5B63', 'center', F.mono); }
          ctx.restore();
        });
        ctx.restore();
        if (id === 'atk' && out > 0) { ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + 24, 1116); ctx.lineTo(lerp(x + 24, x + 426, out), lerp(1116, 324, out)); ctx.stroke(); ctx.restore(); tag(ctx, '2 weights', x + 430, 342, RED, ez(out, 0.5, 1), 20, 'right'); }
        if (id === 'plex') badge(ctx, x + 410, 340, true, Math.min(1, spr(v, 4.6)), 20);
      });
    },
    hits: [[0.2, 'columns', 'whoosh', { len: 0.5 }], [1, 'rows', 'tick'], [2, 'rows', 'tick'], [3.6, 'strike', 'thud', { pitch: 'C3' }], [4.6, 'pass', 'pop', { pitch: 'A5' }]],
  };
  // 3b. one variable font (Inter, weight axis 100-900)
  const vVar = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1.1, E.outCubic); if (a <= 0) return;
      const ph = v < 2.4 ? 0 : (v - 2.4) * 0.32, w = Math.round(100 + 800 * (0.5 - 0.5 * Math.cos(ph * TAU)));
      ctx.save(); ctx.globalAlpha = a; rr(ctx, 80, 300, 920, 840, 18, BG, LINE, 1.5);
      T(ctx, 'Inter · variable', 120, 352, 20, 600, DIM, 'left', F.mono); T(ctx, '1 file', 960, 352, 20, 600, BLUE, 'right', F.mono);
      T(ctx, 'Aa', 540, 760, 330, w, TXT, 'center', 'FInter');
      const tx = 140, tw = 800, ty = 900; rr(ctx, tx, ty, tw, 8, 4, '#3A3B42'); rr(ctx, tx, ty, tw * (w - 100) / 800, 8, 4, BLUE); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(tx + tw * (w - 100) / 800, ty + 4, 18, 0, TAU); ctx.fill();
      T(ctx, '100', tx, ty + 56, 20, 600, DIM, 'left', F.mono); T(ctx, '900', tx + tw, ty + 56, 20, 600, DIM, 'right', F.mono); T(ctx, `wght ${w}`, 540, ty + 56, 26, 600, TXT, 'center', F.mono);
      [[440, 'Title'], [600, 'Button'], [370, 'Body']].forEach(([ww, l], i) => { const p = ez(v, 4.4 + i * 0.3, 5 + i * 0.3); if (p <= 0) return; ctx.globalAlpha = a * p; T(ctx, `${l} ${ww}`, 160 + i * 280, 1060, 30, ww, TXT, 'left', 'FInter'); });
      ctx.restore();
    },
    hits: [[0.2, 'specimen', 'whoosh', { len: 0.5 }], [2.4, 'axis', 'riser', { len: 1 }], [4.4, 'styles', 'tick'], [5, 'styles', 'tick']],
  };

  // 4a. does it speak Arabic?
  function btnPair(ctx, x, y, latin, lFam, arFam, w) {
    rr(ctx, x, y, 380, 84, 14, '#18181B'); T(ctx, latin, x + 190, y + 54, 32, w, '#FFFFFF', 'center', lFam);
    rr(ctx, x + 420, y, 380, 84, 14, '#18181B'); txt(ctx, 'ادفع الآن', x + 610, y + 54, 32, { w, color: '#FFFFFF', align: 'center', family: arFam, rtl: true });
  }
  const vArabic = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1.1, E.outCubic);
      if (a > 0) { ctx.save(); ctx.globalAlpha = a; white(ctx, 80, 300, 920, 390); T(ctx, 'ROBOTO', 120, 356, 20, 600, '#71717A', 'left', F.mono); T(ctx, 'Latin only', 960, 356, 20, 600, '#A1A1AA', 'right', F.mono); btnPair(ctx, 120, 420, 'Pay now', 'FRob', 'FRob', 700); ctx.restore(); }
      const c = ez(v, 2.6, 3.2); if (c > 0) { ctx.save(); ctx.globalAlpha = c; ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.strokeRect(530, 410, 400, 104); ctx.restore(); tag(ctx, 'Arabic: a fallback font you did not choose', 540, 600, RED, c, 22, 'center'); }
      const b = ez(v, 3.8, 4.6, E.outCubic);
      if (b > 0) { ctx.save(); ctx.globalAlpha = b; ctx.translate(0, (1 - b) * 30); white(ctx, 80, 740, 920, 390); T(ctx, 'IBM PLEX SANS + IBM PLEX SANS ARABIC', 120, 796, 20, 600, '#71717A', 'left', F.mono); btnPair(ctx, 120, 860, 'Pay now', 'Plex', 'PlexAr4', 600); ctx.restore(); tag(ctx, 'Designed together', 540, 1040, GREEN, ez(v, 4.8, 5.3), 22, 'center'); }
    },
    hits: [[0.2, 'card', 'whoosh', { len: 0.5 }], [2.6, 'fallback', 'thud', { pitch: 'C3' }], [3.8, 'plex', 'whoosh', { len: 0.4 }], [4.8, 'match', 'bell', { pitch: 'F#6' }]],
  };
  // 4b. families designed for both scripts
  const vPairs = {
    draw(ctx, v) {
      [['IBM Plex Sans + IBM Plex Sans Arabic', 'Plex', 'PlexAr4'], ['Noto Sans + Noto Sans Arabic', 'FNotoL', 'FNotoAr'], ['Readex Pro (variable)', 'FReadex', 'FReadex']].forEach(([n, lf, af], i) => {
        const p = ez(v, 0.3 + i * 0.5, 1.2 + i * 0.5, E.outCubic); if (p <= 0) return;
        const y = 300 + i * 282; ctx.save(); ctx.globalAlpha = p; ctx.translate((1 - p) * 30, 0); rr(ctx, 80, y, 920, 262, 16, BG, LINE, 1.5);
        T(ctx, n, 112, y + 46, 20, 600, DIM, 'left', F.mono);
        T(ctx, 'Settings', 112, y + 170, 64, 500, TXT, 'left', lf); txt(ctx, 'الإعدادات', 968, y + 170, 64, { w: 500, color: TXT, align: 'right', family: af, rtl: true });
        ctx.restore(); badge(ctx, 960, y + 42, true, Math.min(1, spr(v, 1.4 + i * 0.5)), 18);
      });
    },
    hits: [[0.3, 'pair 1', 'whoosh', { len: 0.4 }], [0.8, 'pair 2', 'whoosh', { len: 0.4 }], [1.3, 'pair 3', 'whoosh', { len: 0.4 }], [1.4, 'ok', 'pop', { pitch: 'D5' }], [1.9, 'ok', 'pop', { pitch: 'F#5' }], [2.4, 'ok', 'pop', { pitch: 'A5' }]],
  };
  // 4c. more line height for Arabic
  const PARA = ['يجعل التصميمُ الجيدُ الواجهةَ سهلةَ الفهم،', 'فاخترْ خطًّا واضحًا واتركْ مسافةً كافيةً', 'حتى لا تتلامسَ النقاطُ والحركاتُ.'];
  const vLine = {
    draw(ctx, v) {
      [[1.15, 'line-height 1.15', false, 0.2], [1.8, 'line-height 1.8', true, 2.4]].forEach(([lh, l, ok, t], i) => {
        const p = ez(v, t, t + 0.9, E.outCubic); if (p <= 0) return;
        const y = i ? 720 : 300, h = i ? 420 : 380, fs = 38; ctx.save(); ctx.globalAlpha = p; white(ctx, 80, y, 920, h);
        T(ctx, l, 120, y + 52, 20, 600, ok ? GREEN : RED, 'left', F.mono);
        PARA.forEach((s, k) => AR(ctx, s, 960, y + 120 + k * fs * lh, fs, 400, '#18181B'));
        ctx.restore(); badge(ctx, 950, y + 46, ok, Math.min(1, spr(v, t + 1.2)), 20);
      });
    },
    hits: [[0.2, 'tight', 'whoosh', { len: 0.4 }], [1.4, 'bad', 'thud', { pitch: 'C3' }], [2.4, 'airy', 'whoosh', { len: 0.4 }], [3.6, 'good', 'bell', { pitch: 'F#6' }]],
  };

  // 5a. a real screen, the font cycles through the candidates
  const ROWS = [['#1042', 'Sara M.', '$128.00', 'Paid'], ['#1041', 'Omar K.', '$64.50', 'Pending'], ['#1040', 'Lina A.', '$212.00', 'Paid'], ['#1039', 'Yusuf B.', '$39.90', 'Refunded']];
  function screen(ctx, fam, wBold = 600) {
    white(ctx, 80, 300, 920, 840);
    T(ctx, 'Orders', 120, 384, 48, wBold, '#18181B', 'left', fam); rr(ctx, 760, 340, 200, 60, 12, '#18181B'); T(ctx, 'New order', 860, 380, 22, wBold, '#FFFFFF', 'center', fam);
    rr(ctx, 120, 430, 840, 64, 12, '#F4F4F5'); T(ctx, 'Search orders', 150, 472, 24, 400, '#71717A', 'left', fam);
    ['Order', 'Customer', 'Total', 'Status'].forEach((h, i) => T(ctx, h, [120, 300, 690, 960][i], 556, 20, 500, '#71717A', i === 2 || i === 3 ? 'right' : 'left', fam));
    ROWS.forEach((r, k) => {
      const y = 630 + k * 110; ctx.fillStyle = '#EDEDF0'; ctx.fillRect(120, y - 52, 840, 2);
      T(ctx, r[0], 120, y, 26, 500, '#18181B', 'left', fam); T(ctx, r[1], 300, y, 26, 400, '#18181B', 'left', fam); T(ctx, r[2], 690, y, 26, 500, '#18181B', 'right', fam);
      const col = r[3] === 'Paid' ? '#15803D' : r[3] === 'Pending' ? '#52525B' : '#B91C1C'; ctx.font = `500 22px ${fam}`; const tw = ctx.measureText(r[3]).width + 28; rr(ctx, 960 - tw, y - 30, tw, 40, 20, '#F4F4F5'); T(ctx, r[3], 960 - tw / 2, y - 3, 22, 500, col, 'center', fam);
    });
    T(ctx, 'Showing 4 orders', 120, 1090, 20, 400, '#71717A', 'left', fam);
  }
  const SEQ = ['lob', 'play', 'mont', 'rob', 'atk', 'plex'];
  const vScreen = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1.1, E.outCubic); if (a <= 0) return;
      const k = clamp(Math.floor((v - 2.2) / 0.55), 0, SEQ.length - 1), f = byId[v < 2.2 ? 'plex' : SEQ[k]];
      ctx.save(); ctx.globalAlpha = a; screen(ctx, f.fam, f.id === 'lob' ? 400 : 600); ctx.restore();
      if (v >= 2.2) tag(ctx, f.name, 540, 262, f.id === 'plex' && v > 2.2 + 0.55 * 5 ? GREEN : '#3A3B42', 1, 22, 'center');
    },
    hits: [[0.2, 'screen', 'whoosh', { len: 0.5 }], ...SEQ.map((_, i) => [2.2 + i * 0.55, `font ${i}`, i === 5 ? 'bell' : 'click', i === 5 ? { pitch: 'F#6' } : undefined]).map((h) => h.filter((x) => x !== undefined))],
  };
  // 5b. numbers must align (digit widths measured: Inter default = proportional, IBM Plex Sans = tabular)
  const NUMS = ['1,111.11', '808.00', '2,147.90', '11.10', '1,000.01'];
  const vTab = {
    draw(ctx, v) {
      [['Inter · default digits', 'FInter', false, 80, 0.2], ['IBM Plex Sans', 'Plex', true, 550, 0.6]].forEach(([n, fam, ok, x, t]) => {
        const p = ez(v, t, t + 0.9, E.outCubic); if (p <= 0) return;
        ctx.save(); ctx.globalAlpha = p; white(ctx, x, 300, 450, 840); T(ctx, n, x + 28, 358, 19, 600, '#71717A', 'left', F.mono); T(ctx, 'Total', x + 422, 440, 22, 500, '#71717A', 'right', fam);
        NUMS.forEach((s, i) => T(ctx, s, x + 422, 540 + i * 120, 46, 500, '#18181B', 'right', fam));
        const g = ez(v, 2.6, 3.6); if (g > 0) { ctx.font = `500 46px ${fam}`; const dot = ctx.measureText('.00').width; ctx.globalAlpha = p * g; NUMS.forEach((s, i) => { const xs = x + 422 - ctx.measureText(s).width; ctx.fillStyle = ok ? 'rgba(48,164,108,0.9)' : 'rgba(229,72,77,0.9)'; ctx.fillRect(xs, 548 + i * 120, 3, 18); }); ctx.fillStyle = ok ? GREEN : RED; ctx.fillRect(x + 422 - dot - 1, 470, 2, 600); }
        ctx.restore(); badge(ctx, x + 410, 352, ok, Math.min(1, spr(v, 4)), 20);
      });
    },
    hits: [[0.2, 'col 1', 'whoosh', { len: 0.4 }], [0.6, 'col 2', 'whoosh', { len: 0.4 }], [2.6, 'guides', 'tick'], [4, 'verdict', 'pop', { pitch: 'A5' }]],
  };

  // 6a. the license
  const vLicense = {
    draw(ctx, v) {
      const p1 = ez(v, 0.2, 1.1, E.outCubic), p2 = ez(v, 1.6, 2.5, E.outCubic);
      if (p1 > 0) {
        ctx.save(); ctx.globalAlpha = p1; rr(ctx, 80, 300, 450, 840, 16, BG, LINE, 1.5); T(ctx, 'A free-font website', 108, 358, 19, 600, DIM, 'left', F.mono);
        rr(ctx, 108, 400, 394, 300, 12, '#2E2F35'); T(ctx, 'Aa', 305, 600, 150, 700, '#6B6B73', 'center', 'serif'); rr(ctx, 108, 730, 394, 64, 12, '#3A3B42'); T(ctx, 'Free download', 305, 772, 24, 600, '#EEEEF0', 'center');
        ctx.restore(); tag(ctx, 'Personal use only', 305, 860, RED, ez(v, 3, 3.6), 24, 'center');
        [['Your app', 940], ['Client work', 1030]].forEach(([l, y], i) => { const q = ez(v, 3.6 + i * 0.3, 4.2 + i * 0.3); if (q <= 0) return; badge(ctx, 136, y - 8, false, q, 16); ctx.save(); ctx.globalAlpha = q; T(ctx, l, 166, y, 26, 500, TXT); ctx.restore(); });
      }
      if (p2 > 0) {
        ctx.save(); ctx.globalAlpha = p2; rr(ctx, 550, 300, 450, 840, 16, BG, LINE, 1.5); T(ctx, 'IBM Plex Sans', 578, 358, 19, 600, DIM, 'left', F.mono);
        rr(ctx, 578, 400, 394, 300, 12, '#2E2F35'); T(ctx, 'Aa', 775, 600, 150, 400, TXT, 'center', 'Plex');
        ctx.restore(); tag(ctx, 'SIL Open Font License', 775, 760, GREEN, ez(v, 3.2, 3.8), 22, 'center');
        [['Apps', 850], ['Websites', 940], ['Client work', 1030]].forEach(([l, y], i) => { const q = ez(v, 4 + i * 0.3, 4.6 + i * 0.3); if (q <= 0) return; badge(ctx, 606, y - 8, true, q, 16); ctx.save(); ctx.globalAlpha = q; T(ctx, l, 636, y, 26, 500, TXT); ctx.restore(); });
      }
    },
    hits: [[0.2, 'free site', 'whoosh', { len: 0.4 }], [1.6, 'ofl', 'whoosh', { len: 0.4 }], [3, 'personal', 'thud', { pitch: 'C3' }], [3.2, 'ofl tag', 'pop', { pitch: 'A5' }], [4, 'ok', 'tick'], [4.3, 'ok', 'tick'], [4.6, 'ok', 'tick']],
  };
  // 6b. what the OFL allows
  const OFL = [[true, 'Use it in apps and websites'], [true, 'Sell products made with it'], [true, 'Host the font files yourself'], [false, 'Sell the font file by itself'], [null, 'Modified it? Give it a new name']];
  const vOfl = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1, E.outCubic); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a; rr(ctx, 80, 300, 920, 840, 18, BG, LINE, 1.5); T(ctx, 'SIL OPEN FONT LICENSE', 120, 362, 22, 600, BLUE, 'left', F.mono); ctx.restore();
      OFL.forEach(([ok, l], i) => {
        const p = ez(v, 1.2 + i * 0.55, 1.8 + i * 0.55, E.outCubic); if (p <= 0) return; const y = 480 + i * 140;
        ctx.save(); ctx.globalAlpha = p; ctx.translate((1 - p) * 30, 0); ctx.fillStyle = '#3A3B42'; ctx.fillRect(120, y + 50, 840, 1.5);
        if (ok === null) { ctx.fillStyle = BLUE; ctx.beginPath(); ctx.arc(146, y - 10, 22, 0, TAU); ctx.fill(); T(ctx, 'i', 146, y - 1, 26, 700, '#FFFFFF', 'center'); } else badge(ctx, 146, y - 10, ok, 1, 22);
        T(ctx, l, 190, y, 34, 500, TXT); ctx.restore();
      });
    },
    hits: [[0.2, 'card', 'whoosh', { len: 0.4 }], ...OFL.map((o, i) => [1.2 + i * 0.55, `row ${i}`, o[0] === false ? 'thud' : 'tick', o[0] === false ? { pitch: 'C3' } : undefined]).map((h) => h.filter((x) => x !== undefined))],
  };

  // 7a. one family, hierarchy by size and weight
  const vFamily = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1.1, E.outCubic); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a; white(ctx, 80, 300, 600, 840);
      const L = [[120, 400, 'SETTINGS', 16, 600, '#71717A', '16 · SemiBold'], [120, 480, 'Notifications', 48, 600, '#18181B', '48 · SemiBold'], [120, 540, 'Choose what you hear about', 24, 500, '#3F3F46', '24 · Medium'], [120, 660, 'New orders', 26, 400, '#18181B', '26 · Regular'], [120, 780, 'Weekly report', 26, 400, '#18181B', null], [120, 900, 'Product updates', 26, 400, '#18181B', null], [120, 1060, 'You can change this at any time.', 18, 400, '#71717A', '18 · Regular']];
      L.forEach(([x, y, s, fs, w, c]) => T(ctx, s, x, y, fs, w, c, 'left', 'Plex'));
      [660, 780, 900].forEach((y, i) => { const on = i !== 1; rr(ctx, 560, y - 30, 72, 40, 20, on ? '#18181B' : '#D4D4D8'); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(on ? 612 : 580, y - 10, 15, 0, TAU); ctx.fill(); ctx.fillStyle = '#EDEDF0'; ctx.fillRect(120, y + 46, 520, 2); });
      ctx.restore();
      L.filter((r) => r[6]).forEach(([, y, , fs, , , note], i) => { const p = ez(v, 2.4 + i * 0.4, 3 + i * 0.4); if (p <= 0) return; ctx.save(); ctx.globalAlpha = p; ctx.fillStyle = '#5A5B63'; ctx.fillRect(690, y - fs * 0.35, 30 * p, 2); T(ctx, note, 730, y - fs * 0.35 + 8, 24, 600, TXT, 'left', F.mono); ctx.restore(); });
      tag(ctx, '1 family', 840, 1080, GREEN, ez(v, 5, 5.6), 24, 'center');
    },
    hits: [[0.2, 'card', 'whoosh', { len: 0.5 }], [2.4, 'note', 'tick'], [2.8, 'note', 'tick'], [3.2, 'note', 'tick'], [3.6, 'note', 'tick'], [4, 'note', 'tick'], [5, 'one family', 'bell', { pitch: 'F#6' }]],
  };
  // 7b. two fonts maximum
  const vTwo = {
    draw(ctx, v) {
      const p1 = ez(v, 0.2, 1.1, E.outCubic), p2 = ez(v, 2.6, 3.5, E.outCubic);
      if (p1 > 0) {
        ctx.save(); ctx.globalAlpha = p1 * (1 - 0.5 * ez(v, 2.2, 2.6)); white(ctx, 80, 300, 450, 840);
        T(ctx, 'Weekend', 112, 450, 70, 400, '#18181B', 'left', 'FLob'); T(ctx, 'NEW COLLECTION', 112, 520, 28, 600, '#18181B', 'left', 'FMont');
        ['Free delivery on', 'every order this', 'weekend only.'].forEach((s, i) => T(ctx, s, 112, 620 + i * 46, 32, 400, '#3F3F46', 'left', 'FPlay'));
        rr(ctx, 112, 820, 386, 80, 14, '#18181B'); T(ctx, 'Shop now', 305, 872, 30, 700, '#FFFFFF', 'center', 'FRob');
        ctx.restore(); tag(ctx, '4 fonts', 305, 1010, RED, ez(v, 1.8, 2.4), 26, 'center');
      }
      if (p2 > 0) {
        ctx.save(); ctx.globalAlpha = p2; white(ctx, 550, 300, 450, 840);
        T(ctx, 'Weekend', 582, 440, 70, 700, '#18181B', 'left', 'FPlay'); T(ctx, 'Edition', 582, 520, 70, 700, '#18181B', 'left', 'FPlay');
        ['Stories about design,', 'every Sunday morning.'].forEach((s, i) => T(ctx, s, 582, 620 + i * 46, 30, 400, '#3F3F46', 'left', 'Plex'));
        rr(ctx, 582, 820, 386, 80, 14, '#18181B'); T(ctx, 'Subscribe', 775, 872, 30, 600, '#FFFFFF', 'center', 'Plex');
        ctx.restore(); tag(ctx, '2 fonts: serif + sans', 775, 1010, GREEN, ez(v, 4, 4.6), 24, 'center');
      }
    },
    hits: [[0.2, 'messy', 'whoosh', { len: 0.4 }], [1.8, 'four', 'thud', { pitch: 'C3' }], [2.6, 'clean', 'whoosh', { len: 0.4 }], [4, 'two', 'bell', { pitch: 'F#6' }]],
  };

  // recap + cover: the board after all the tests, IBM Plex Sans stays
  const finalBoard = (ctx, v, appear) => board(ctx, v, { test: 9, appear, win: appear === null ? 1 : ez(v, 1.6, 2.4) });
  const recapVig = {
    draw(ctx, v) { finalBoard(ctx, v, 0.1); const p = ez(v, 2.2, 2.8); if (p > 0) tag(ctx, 'The font of this video', 775, 1170, BLUE, p, 22, 'center'); },
    hits: [[0.1, 'board', 'whoosh', { len: 0.5 }], [1.6, 'winner', 'bell', { pitch: 'F#6' }]],
  };
  return { vUse, vSmall, vIl1, vXh, vSizes, vWeights, vVar, vArabic, vPairs, vLine, vScreen, vTab, vLicense, vOfl, vFamily, vTwo, recapVig, finalBoard };
}

export function typoTopic(K, Y, long) {
  const it = (o) => o;
  const L = [
    // part 0: use
    it({ part: 0, main: true, title: ['WHAT IS', 'IT FOR?'], ar: 'ما الغرض من الخط؟', en: 'AN APP NEEDS CALM, CLEAR SHAPES.', vig: Y.vUse, tip: 'DECORATIVE FONTS: LOGOS AND BIG TITLES ONLY.', tipAr: 'الخطوط الزخرفية للشعارات والعناوين الكبيرة فقط.' }),
    it({ part: 0, title: ['SMALL TEXT', 'TELLS THE TRUTH.'], ar: 'النص الصغير يكشف الحقيقة.', en: 'A DISPLAY FONT SHINES BIG, STRUGGLES SMALL.', vig: Y.vSmall, tip: 'TEST NUMBERS TOO: SOME FONTS USE OLD-STYLE FIGURES.', tipAr: 'اختبر الأرقام أيضًا: بعض الخطوط تستخدم أرقامًا بالأسلوب القديم.' }),
    // part 1: legibility
    it({ part: 1, main: true, title: ['THE Il1 O0', 'TEST.'], ar: 'اختبار الحروف المتشابهة Il1 O0.', en: 'CAPITAL I, LOWERCASE L, DIGIT 1: TELL THEM APART?', vig: Y.vIl1, tip: 'TYPE THIS STRING IN EVERY FONT YOU CONSIDER.', tipAr: 'اكتب هذه العبارة بكل خط تفكر في استخدامه.' }),
    it({ part: 1, title: ['CHECK THE', 'X-HEIGHT.'], ar: 'تحقّق من ارتفاع الحروف الصغيرة.', en: 'ABOUT 2/3 TO 3/4 OF THE CAPITALS.', vig: Y.vXh, tip: 'A GENEROUS X-HEIGHT STAYS READABLE AT SMALL SIZES.', tipAr: 'الارتفاع الكافي يبقى مقروءًا في الأحجام الصغيرة.' }),
    it({ part: 1, title: ['TEST AT', 'SMALL SIZES.'], ar: 'اختبره بالأحجام الصغيرة.', en: 'LABELS, CAPTIONS, HINTS: 12 TO 16 PX.', vig: Y.vSizes, tip: 'IF YOU HAVE TO SQUINT, YOUR USERS WILL TOO.', tipAr: 'إن احتجت إلى التدقيق لتقرأ، فسيحتاج إليه المستخدمون أيضًا.' }),
    // part 2: weights
    it({ part: 2, main: true, title: ['ENOUGH', 'WEIGHTS.'], ar: 'أوزان كافية.', en: 'REGULAR, MEDIUM, SEMIBOLD, BOLD.', vig: Y.vWeights, tip: 'ITS NEWER VERSION, ATKINSON HYPERLEGIBLE NEXT, HAS 7.', tipAr: 'نسختها الأحدث Atkinson Hyperlegible Next تضم 7 أوزان.' }),
    it({ part: 2, title: ['OR ONE', 'VARIABLE FONT.'], ar: 'أو خط متغيّر واحد.', en: 'ONE FILE, EVERY WEIGHT IN BETWEEN.', vig: Y.vVar, tip: 'ONE FILE CAN REPLACE A WHOLE SET OF WEIGHTS.', tipAr: 'ملف واحد يمكن أن يغني عن مجموعة كاملة من الأوزان.' }),
    // part 3: arabic
    it({ part: 3, main: true, title: ['DOES IT', 'SPEAK ARABIC?'], ar: 'هل يدعم العربية؟', en: 'A LATIN-ONLY FONT FALLS BACK TO ANOTHER ONE.', vig: Y.vArabic, tip: 'CHECK THE ARABIC VERSION BEFORE YOU FALL IN LOVE.', tipAr: 'تحقّق من وجود نسخة عربية قبل أن تتعلّق بالخط.' }),
    it({ part: 3, title: ['ONE FAMILY,', 'TWO SCRIPTS.'], ar: 'عائلة واحدة لنظامَي كتابة.', en: 'DESIGNED TOGETHER: SAME WEIGHT, SAME RHYTHM.', vig: Y.vPairs, tip: 'ARABIC OFTEN NEEDS A SLIGHTLY BIGGER SIZE.', tipAr: 'العربية تحتاج غالبًا إلى حجم أكبر قليلًا.' }),
    it({ part: 3, title: ['MORE LINE HEIGHT', 'FOR ARABIC.'], ar: 'تباعد أسطر أكبر للعربية.', en: 'TALL LETTERS, DOTS AND MARKS NEED ROOM.', vig: Y.vLine, tip: 'START BETWEEN 1.5 AND 1.8, THEN TEST REAL TEXT.', tipAr: 'ابدأ بين 1.5 و1.8 ثم اختبر بنص حقيقي.' }),
    // part 4: real screen
    it({ part: 4, main: true, title: ['TEST IT IN', 'A REAL SCREEN.'], ar: 'اختبره في شاشة حقيقية.', en: 'NOT A POSTER: BUTTONS, LABELS, LISTS.', vig: Y.vScreen, tip: 'USE YOUR LONGEST WORDS AND REAL DATA.', tipAr: 'استخدم أطول كلماتك وبياناتك الحقيقية.' }),
    it({ part: 4, title: ['NUMBERS', 'MUST ALIGN.'], ar: 'يجب أن تصطف الأرقام.', en: 'TABULAR DIGITS KEEP PRICE COLUMNS STRAIGHT.', vig: Y.vTab, tip: 'IN CSS: font-variant-numeric: tabular-nums', tipAr: 'في CSS استخدم الخاصية tabular-nums.' }),
    // part 5: license
    it({ part: 5, main: true, title: ['CHECK', 'THE LICENSE.'], ar: 'تحقّق من الترخيص.', en: 'FREE TO DOWNLOAD IS NOT FREE FOR BUSINESS.', vig: Y.vLicense, tip: 'AVOID "PERSONAL USE", "DEMO", "NON-COMMERCIAL".', tipAr: 'تجنّب الخطوط المكتوب عليها «للاستخدام الشخصي» أو «تجريبي».' }),
    it({ part: 5, title: ['OFL: WHAT', 'YOU CAN DO.'], ar: 'ما يسمح به ترخيص OFL.', en: 'APPS, WEBSITES, PRODUCTS YOU SELL.', vig: Y.vOfl, tip: 'NOT LEGAL ADVICE: READ EACH FONT\'S LICENSE FILE.', tipAr: 'هذه ليست استشارة قانونية: اقرأ ملف الترخيص لكل خط.' }),
    // part 6: one family
    it({ part: 6, main: true, title: ['ONE FAMILY IS', 'OFTEN ENOUGH.'], ar: 'عائلة واحدة تكفي غالبًا.', en: 'BUILD HIERARCHY WITH SIZE AND WEIGHT.', vig: Y.vFamily, tip: 'A SUPERFAMILY ADDS MONO AND ARABIC IN THE SAME STYLE.', tipAr: 'العائلات الكبيرة تضيف خطًّا أحادي المسافة وآخر عربيًا بالأسلوب نفسه.' }),
    it({ part: 6, title: ['TWO FONTS', 'MAXIMUM.'], ar: 'خطّان على الأكثر.', en: 'CONTRAST THE STYLES, KEEP THE PROPORTIONS.', vig: Y.vTwo, tip: 'A SERIF TITLE WITH A SANS BODY IS A CLASSIC PAIR.', tipAr: 'عنوان بخط ذي زوائد مع نص بخط بلا زوائد: ثنائي كلاسيكي.' }),
  ];
  const items = (long ? L : L.filter((x) => x.main)).map((x) => ({ ...x, tipAt: 13 }));
  const PARTS = [['USE', 'الاستخدام'], ['LEGIBILITY', 'سهولة القراءة'], ['WEIGHTS', 'الأوزان'], ['ARABIC', 'العربية'], ['REAL SCREEN', 'شاشة حقيقية'], ['LICENSE', 'الترخيص'], ['ONE FAMILY', 'عائلة واحدة']];
  const LIGHT = '‪Il1 O0‬';
  items.forEach((x) => { if (x.ar.includes('Il1 O0')) x.ar = x.ar.replace('Il1 O0', LIGHT); });
  return {
    span: long ? 28 : 15,
    fonts: ['400 20px FLob', '400 20px FPlay', '700 20px FPlay', '400 20px FMont', '600 20px FMont', '400 20px FRob', '700 20px FRob', '400 20px FAtk', '700 20px FAtk', '300 20px Plex', '400 20px Plex', '500 20px Plex', '600 20px Plex', '700 20px Plex', '400 20px FInter', '400 20px FNotoL', '500 20px FNotoL', '400 20px FReadex', '500 20px FReadex', '400 20px PlexAr4', '500 20px PlexAr4', '600 20px PlexAr4'],
    arFonts: ['400 20px PlexAr4', '500 20px PlexAr4', '600 20px PlexAr4', '400 20px FNotoAr', '500 20px FNotoAr', '500 20px FReadex', '700 20px FRob'],
    hook: { lines: ['7 CHECKS BEFORE', 'YOU PICK A FONT.'], ar: 'سبعة اختبارات قبل أن تختار خطًّا.', en: 'FROM 6 REAL FONTS TO THE RIGHT ONE.', tags: ['Aa', 'Il1 O0', 'Bold', 'Arabic', 'OFL', '16 px'] },
    items,
    parts: PARTS.map(([en, ar], i) => ({ en, ar, count: `TEST ${i + 1} / 7` })),
    label: (i) => `TEST 0${items[i].part + 1} / 07`,
    recap: { title: ['THE RIGHT FONT,', 'TESTED.'], ar: 'الخط المناسب، بعد الاختبار.', en: 'USE · Il1 O0 · WEIGHTS · ARABIC · REAL SCREEN · LICENSE · ONE FAMILY', vig: Y.recapVig, len: long ? 16 : 13 },
    cover: {
      lines: ['HOW TO', 'CHOOSE', 'A FONT.'], ar: 'كيف تختار الخط المناسب؟',
      art: (ctx, x, y, w, h) => { const s = Math.min(w / 920, h / 850); ctx.save(); ctx.translate(x + (w - 920 * s) / 2, y + 10); ctx.scale(s, s); ctx.translate(-80, -300); Y.finalBoard(ctx, 0, null); ctx.restore(); },
    },
  };
}
