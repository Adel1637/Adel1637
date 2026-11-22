// "How to choose your icons" — vignettes (Short coordinates: x 80..1000, y 280..1150) and the film config
// for shared/kinetic-film.js. Facts checked online on 22 Nov 2026: SF Symbols are licensed only for apps on
// Apple platforms and match the San Francisco font weight; Material Symbols (Apache 2.0) have a variable
// weight axis; Lucide (ISC), Phosphor (MIT, 6 weights), Tabler (MIT); 24px grid with 2px padding; strokes of
// 1.5px (regular text) or 2px; NN/g: keep icon labels visible. Icons below are drawn generically (no logos).
export function makeIcons(M, K) {
  const { lerp, clamp, E, mix } = M;
  const { F, C, TAU, ez, spr, txt, rr, pill, fit } = K;

  // ---------------------------------------------------------------- a small generic icon set (24-unit box)
  const P = {
    home: (c) => { c.moveTo(3, 11); c.lineTo(12, 3); c.lineTo(21, 11); c.moveTo(5, 9.5); c.lineTo(5, 21); c.lineTo(19, 21); c.lineTo(19, 9.5); c.moveTo(10, 21); c.lineTo(10, 15); c.lineTo(14, 15); c.lineTo(14, 21); },
    search: (c) => { c.moveTo(17, 10.5); c.arc(10.5, 10.5, 6.5, 0, TAU); c.moveTo(15.2, 15.2); c.lineTo(21, 21); },
    bell: (c) => { c.moveTo(5, 17); c.bezierCurveTo(6.5, 15, 6, 13, 6, 10); c.bezierCurveTo(6, 6.5, 8.7, 4, 12, 4); c.bezierCurveTo(15.3, 4, 18, 6.5, 18, 10); c.bezierCurveTo(18, 13, 17.5, 15, 19, 17); c.closePath(); c.moveTo(10, 20); c.bezierCurveTo(10.5, 21.3, 13.5, 21.3, 14, 20); },
    heart: (c) => { c.moveTo(12, 20); c.bezierCurveTo(3, 14, 2.5, 8, 6, 5.5); c.bezierCurveTo(8.5, 3.8, 11, 5, 12, 7); c.bezierCurveTo(13, 5, 15.5, 3.8, 18, 5.5); c.bezierCurveTo(21.5, 8, 21, 14, 12, 20); c.closePath(); },
    user: (c) => { c.moveTo(16, 8); c.arc(12, 8, 4, 0, TAU); c.moveTo(4, 21); c.bezierCurveTo(4.5, 16, 8, 14, 12, 14); c.bezierCurveTo(16, 14, 19.5, 16, 20, 21); },
    bookmark: (c) => { c.moveTo(6, 3); c.lineTo(18, 3); c.lineTo(18, 21); c.lineTo(12, 16.5); c.lineTo(6, 21); c.closePath(); },
    star: (c) => { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 4 : 9; const x = 12 + Math.cos(a) * r, y = 12.5 + Math.sin(a) * r; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.closePath(); },
    gear: (c) => { c.moveTo(15, 12); c.arc(12, 12, 3, 0, TAU); for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU; c.moveTo(12 + Math.cos(a) * 6.5, 12 + Math.sin(a) * 6.5); c.lineTo(12 + Math.cos(a) * 9, 12 + Math.sin(a) * 9); } c.moveTo(18.5, 12); c.arc(12, 12, 6.5, 0, TAU); },
  };
  // draw icon `name` at (cx, cy) with size px, stroke in icon units, filled or outline
  function icon(ctx, name, cx, cy, size, { stroke = 2, filled = false, color = '#FFFFFF', alpha = 1 } = {}) {
    ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(cx - size / 2, cy - size / 2); ctx.scale(size / 24, size / 24);
    ctx.beginPath(); P[name](ctx); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (filled && name !== 'search' && name !== 'gear') { ctx.fillStyle = color; ctx.fill(); }
    ctx.strokeStyle = color; ctx.lineWidth = stroke; ctx.stroke(); ctx.restore();
  }

  // ---------------------------------------------------------------- 1. start from your platform
  const platform = {
    draw(ctx, v) {
      const cols = [['iPhone', ['SF Symbols'], 'ios'], ['Android', ['Material Symbols'], 'android'], ['Web', ['Lucide', 'Phosphor', 'Tabler', 'Heroicons'], 'web']];
      cols.forEach(([name, libs, kind], i) => {
        const s = spr(v, 2.6 + i * 0.4, { stiffness: 230, damping: 15 }); if (s <= 0) return;
        const cx = 80 + 153 + i * 307;
        ctx.save(); ctx.translate(cx, 470); ctx.scale(s, s);
        if (kind === 'web') { rr(ctx, -110, -90, 220, 170, 14, null, '#FFFFFF', 4); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-110, -60, 220, 4); }
        else { rr(ctx, -62, -120, 124, 240, 26, null, '#FFFFFF', 4); if (kind === 'ios') rr(ctx, -22, -108, 44, 12, 6, '#FFFFFF'); else { ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(0, -102, 5, 0, TAU); ctx.fill(); } }
        ctx.restore();
        txt(ctx, name, cx, 660, 36, { color: '#FFFFFF', align: 'center', alpha: Math.min(1, s) });
        libs.forEach((l, j) => { const p = spr(v, 4.2 + i * 0.6 + j * 0.3, { stiffness: 280, damping: 14 }); if (p <= 0) return; ctx.save(); ctx.translate(cx, 740 + j * 84); ctx.scale(p, p); ctx.font = `700 26px ${F.title}`; const w = Math.min(290, ctx.measureText(l).width + 44); rr(ctx, -w / 2, -32, w, 64, 32, j === 0 ? C.sel : '#2A2A2A', '#3A3A3A', 2); txt(ctx, l, 0, 9, fit(ctx, l, 26, w - 30), { color: '#FFFFFF', align: 'center' }); ctx.restore(); });
      });
    },
    hits: [[2.6, 'iphone', 'thud', { pitch: 'D3' }], [3.0, 'android', 'thud', { pitch: 'E3' }], [3.4, 'web', 'thud', { pitch: 'F#3' }], [4.2, 'sf', 'pop', { pitch: 'D5' }], [4.8, 'material', 'pop', { pitch: 'F#5' }], [5.4, 'lucide', 'pop', { pitch: 'A5' }], [5.7, 'phosphor', 'pop', { pitch: 'B5' }], [6.0, 'tabler', 'pop', { pitch: 'D6' }], [6.3, 'heroicons', 'pop', { pitch: 'E6' }]],
  };

  // ---------------------------------------------------------------- 2. one style: outline or filled (filled = active)
  const NAV = ['home', 'search', 'bell', 'heart', 'user'];
  const style = {
    draw(ctx, v) {
      const op = spr(v, 2.6, { stiffness: 220, damping: 15 }); if (op <= 0) return;
      const fix = ez(v, 5, 6, E.inOutCubic), act = ez(v, 8, 8.5);
      ctx.save(); ctx.globalAlpha = Math.min(1, op);
      rr(ctx, 80, 380, 920, 220, 28, '#262626', '#3A3A3A', 2);
      const mixed = [[true, 2.5], [false, 1.2], [true, 2], [false, 3], [false, 2]];
      NAV.forEach((n, i) => {
        const cx = 80 + 92 + i * 184, [f0, s0] = mixed[i], sz = lerp([60, 48, 66, 54, 58][i], 60, fix);
        const filled = fix < 0.5 ? f0 : i === 0 && act > 0.5, col = i === 0 && act > 0 ? mix('#FFFFFF', C.sel, act) : '#FFFFFF';
        icon(ctx, n, cx, 470 + lerp([0, 12, -10, 6, -4][i], 0, fix), sz, { stroke: lerp(s0, 2, fix), filled, color: col });
        if (act > 0) txt(ctx, ['Home', 'Search', 'Alerts', 'Saved', 'Profile'][i], cx, 560, 22, { color: i === 0 ? C.sel : '#A8A8A8', align: 'center', alpha: act });
      });
      ctx.restore();
      if (v >= 3.4 && v < 5) pill(ctx, 'Mixed styles ✕', 540, 690, spr(v, 3.4, { stiffness: 300, damping: 12 }), C.red, 30);
      if (v >= 6) pill(ctx, 'All outline ✓', 540, 690, spr(v, 6, { stiffness: 300, damping: 12 }), C.green, 30);
      if (v >= 8.6) { const p = spr(v, 8.6, { stiffness: 300, damping: 13 }); ctx.save(); ctx.globalAlpha = Math.min(1, p); icon(ctx, 'home', 400, 860, 90, { filled: false }); icon(ctx, 'home', 680, 860, 90, { filled: true, color: C.sel }); txt(ctx, 'DEFAULT', 400, 960, 22, { w: 600, family: F.mono, color: C.sub, align: 'center' }); txt(ctx, 'ACTIVE', 680, 960, 22, { w: 600, family: F.mono, color: C.sel, align: 'center' }); ctx.restore(); }
    },
    hits: [[2.6, 'tab bar', 'thud', { pitch: 'D3' }], [3.4, 'mixed', 'thud', { pitch: 'C2' }], [5, 'unify', 'whoosh', { len: 0.5 }], [6, 'outline', 'bell', { pitch: 'F#6' }], [8, 'active', 'click'], [8.6, 'default vs active', 'pop', { pitch: 'A5' }]],
  };

  // ---------------------------------------------------------------- 3. match the stroke to your font
  const stroke = {
    draw(ctx, v) {
      const op = spr(v, 2.6, { stiffness: 220, damping: 15 }); if (op <= 0) return;
      const k = v < 4.4 ? 0.6 : v < 6 ? lerp(0.6, 3.6, ez(v, 4.4, 5.6, E.inOutCubic)) : lerp(3.6, 2, ez(v, 6.4, 7.6, E.inOutCubic));
      ctx.save(); ctx.globalAlpha = Math.min(1, op);
      rr(ctx, 80, 360, 920, 380, 28, '#262626', '#3A3A3A', 2);
      ['gear', 'bell', 'user'].forEach((n, i) => { const y = 440 + i * 100; icon(ctx, n, 190, y, 64, { stroke: k }); txt(ctx, ['Settings', 'Notifications', 'Account'][i], 260, y + 18, 50, { color: '#FFFFFF' }); });
      const state = k < 1.4 ? ['TOO THIN', C.red] : k > 2.8 ? ['TOO HEAVY', C.red] : ['MATCHES THE TEXT ✓', C.green];
      ctx.restore();
      if (v >= 3.6) pill(ctx, state[0], 540, 820, 1, state[1], 30);
      rr(ctx, 180, 920, 720, 10, 5, '#3A3A3A'); const kx = 180 + 720 * clamp((k - 0.5) / 3.5); rr(ctx, 180, 920, kx - 180, 10, 5, C.sel);
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(kx, 925, 20, 0, TAU); ctx.fill();
      txt(ctx, `stroke ${(k * 0.75).toFixed(1)}px`, 540, 1000, 28, { w: 600, family: F.mono, color: C.ink, align: 'center' });
    },
    hits: [[2.6, 'list', 'thud', { pitch: 'D3' }], [3.6, 'too thin', 'tick'], [4.4, 'heavier', 'riser', { len: 1.2 }], [5.6, 'too heavy', 'thud', { pitch: 'C2' }], [6.4, 'back', 'whoosh', { len: 0.5 }], [7.6, 'match', 'bell', { pitch: 'F#6' }]],
  };

  // ---------------------------------------------------------------- 4. one grid, one size
  const grid = {
    draw(ctx, v) {
      const op = spr(v, 2.6, { stiffness: 220, damping: 15 }); if (op <= 0) return;
      ctx.save(); ctx.globalAlpha = Math.min(1, op);
      const gx = 300, gy = 320, cell = 20, n = 24;
      ctx.fillStyle = '#1E1E1E'; ctx.fillRect(gx, gy, cell * n, cell * n);
      ctx.fillStyle = 'rgba(229,72,77,0.14)'; ctx.fillRect(gx, gy, cell * n, cell * 2); ctx.fillRect(gx, gy + cell * 22, cell * n, cell * 2); ctx.fillRect(gx, gy, cell * 2, cell * n); ctx.fillRect(gx + cell * 22, gy, cell * 2, cell * n);
      ctx.strokeStyle = '#2E2E2E'; ctx.lineWidth = 1; for (let i = 0; i <= n; i++) { ctx.beginPath(); ctx.moveTo(gx + i * cell, gy); ctx.lineTo(gx + i * cell, gy + n * cell); ctx.moveTo(gx, gy + i * cell); ctx.lineTo(gx + n * cell, gy + i * cell); ctx.stroke(); }
      ctx.strokeStyle = 'rgba(13,153,255,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(gx + 12 * cell, gy + 12 * cell, 10 * cell, 0, TAU); ctx.stroke(); ctx.strokeRect(gx + 3 * cell, gy + 3 * cell, 18 * cell, 18 * cell);
      const sn = ez(v, 4.2, 5.4, E.outBack), ox = lerp(70, 0, sn), oy = lerp(-50, 0, sn), sc = lerp(1.25, 1, sn);
      icon(ctx, 'heart', gx + 12 * cell + ox, gy + 12 * cell + oy, 24 * cell * sc, { stroke: 2, color: '#FFFFFF' });
      txt(ctx, '24 × 24 · 2px PADDING', gx + 12 * cell, gy + n * cell + 44, 24, { w: 600, family: F.mono, color: C.sub, align: 'center' });
      ctx.restore();
      // a row of icons at mixed sizes -> one size
      const one = ez(v, 7.4, 8.4, E.inOutCubic);
      if (v >= 6.4) ['home', 'search', 'bell', 'heart', 'user'].forEach((nm, i) => { const p = spr(v, 6.4 + i * 0.15, { stiffness: 280, damping: 14 }); const sz = lerp([40, 56, 30, 64, 48][i], 52, one) * Math.min(1, p); icon(ctx, nm, 220 + i * 160, 1000, sz, { stroke: 2, color: one > 0.5 ? '#FFFFFF' : '#BDBDBD' }); });
      if (v >= 8.6) pill(ctx, 'One size per place ✓', 540, 1100, spr(v, 8.6, { stiffness: 300, damping: 12 }), C.green, 26);
    },
    hits: [[2.6, 'grid', 'thud', { pitch: 'D3' }], [4.2, 'snap', 'boing', { pitch: 'A4', to: 'D4' }], [6.4, 'row', 'pop', { pitch: 'D5' }], [7.4, 'same size', 'whoosh', { len: 0.5 }], [8.6, 'ok', 'bell', { pitch: 'F#6' }]],
  };

  // ---------------------------------------------------------------- 5. clear meaning, visible label
  const meaning = {
    draw(ctx, v) {
      const op = spr(v, 2.6, { stiffness: 220, damping: 15 }); if (op <= 0) return;
      txt(ctx, 'Which one saves the post?', 540, 400, 44, { color: '#FFFFFF', align: 'center', alpha: Math.min(1, op) });
      const lab = ez(v, 6, 6.8);
      [['bookmark', 'Save'], ['star', 'Favorite'], ['heart', 'Like']].forEach(([n, l], i) => {
        const s = spr(v, 3.2 + i * 0.35, { stiffness: 260, damping: 14 }); if (s <= 0) return;
        const cx = 80 + 153 + i * 307;
        ctx.save(); ctx.translate(cx, 640); ctx.scale(s, s); rr(ctx, -120, -130, 240, 300, 28, '#262626', i === 0 && v >= 7.4 ? C.green : '#3A3A3A', i === 0 && v >= 7.4 ? 4 : 2); ctx.restore();
        icon(ctx, n, cx, 600, 100 * Math.min(1, s), { stroke: 2 });
        if (lab <= 0 && v >= 4.4) txt(ctx, '?', cx, 750, 56, { color: C.red, align: 'center' });
        if (lab > 0) txt(ctx, l, cx, 750, 40, { color: '#FFFFFF', align: 'center', alpha: lab });
      });
      if (v >= 8.4) pill(ctx, 'NN/g: keep labels visible', 540, 920, spr(v, 8.4, { stiffness: 300, damping: 12 }), C.sel, 28);
    },
    hits: [[2.6, 'question', 'thud', { pitch: 'D3' }], [3.2, 'icon', 'pop', { pitch: 'D5' }], [3.55, 'icon', 'pop', { pitch: 'F#5' }], [3.9, 'icon', 'pop', { pitch: 'A5' }], [4.4, 'unclear', 'thud', { pitch: 'C2' }], [6, 'labels', 'whoosh', { len: 0.4 }], [7.4, 'clear', 'bell', { pitch: 'F#6' }], [8.4, 'nng', 'tick']],
  };

  // ---------------------------------------------------------------- 6. check the license
  const license = {
    draw(ctx, v) {
      const rows = [['Lucide', 'ISC · free', C.green], ['Phosphor', 'MIT · free', C.green], ['Tabler', 'MIT · free', C.green], ['Material Symbols', 'Apache 2.0 · free', C.green], ['SF Symbols', 'Apple platforms only', '#E2B203']];
      rows.forEach(([n, l, col], i) => {
        const s = spr(v, 2.6 + i * 0.5, { stiffness: 220, damping: 15 }); if (s <= 0) return;
        const y = 330 + i * 150, x = lerp(i % 2 ? 1100 : -1000, 80, Math.min(1.02, s));
        rr(ctx, x, y, 920, 124, 18, '#262626');
        txt(ctx, n, x + 36, y + 78, fit(ctx, n, 42, 420), { color: '#FFFFFF' });
        ctx.font = `600 26px ${F.mono}`; const w = ctx.measureText(l).width + 40; rr(ctx, x + 884 - w, y + 34, w, 56, 28, mix('#262626', col, 0.25), col, 2); txt(ctx, l, x + 884 - w / 2, y + 71, 26, { w: 600, family: F.mono, color: '#FFFFFF', align: 'center' });
      });
    },
    hits: [0, 1, 2, 3, 4].map((i) => [2.6 + i * 0.5, `license ${i}`, i === 4 ? 'thud' : 'whoosh', i === 4 ? { pitch: 'C3' } : { len: 0.3 }]),
  };

  // ---------------------------------------------------------------- recap checklist
  const CHECKS = ['Platform', 'One style', 'Stroke = font', '24px grid', 'Clear meaning', 'License'];
  const recapVig = {
    draw(ctx, v) {
      CHECKS.forEach((c, i) => {
        const s = spr(v, 1.2 + i * 0.3, { stiffness: 230, damping: 15 }); if (s <= 0) return;
        const y = 320 + i * 128; ctx.save(); ctx.translate(lerp(-700, 0, Math.min(1, s)), 0);
        rr(ctx, 80, y, 920, 104, 18, '#232323');
        ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(140, y + 52, 26, 0, TAU); ctx.fill(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(128, y + 52); ctx.lineTo(137, y + 61); ctx.lineTo(153, y + 43); ctx.stroke();
        txt(ctx, `0${i + 1}`, 200, y + 64, 30, { w: 600, family: F.mono, color: C.sub }); txt(ctx, c, 270, y + 66, 40, { color: '#FFFFFF' });
        ctx.restore();
      });
    },
    hits: CHECKS.map((_, i) => [1.2 + i * 0.3, `check ${i}`, 'pop', { pitch: ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'][i] }]),
  };
  return { platform, style, stroke, grid, meaning, license, recapVig, icon };
}

export function iconsTopic(K, I, long) {
  const { rr, F, C } = K;
  const items = [
    { title: ['START FROM', 'YOUR PLATFORM.'], ar: 'ابدأ من منصّتك.', en: 'IPHONE, ANDROID OR WEB: EACH HAS ITS SET.', vig: I.platform, seen: 'SF Symbols · Material Symbols · Lucide', tip: 'NATIVE ICONS MATCH THE SYSTEM FONT AUTOMATICALLY.', tipAr: 'الأيقونات الأصلية تتناسق تلقائيًا مع خط النظام.', tipAt: 11, real: { img: 'lucide', url: 'lucide.dev/icons', label: 'LUCIDE', at: 8, atLong: 13 }, shortLen: 16 },
    { title: ['ONE STYLE:', 'OUTLINE OR FILLED.'], ar: 'أسلوب واحد: محدّد أو ممتلئ.', en: 'NEVER MIX THEM IN THE SAME BAR.', vig: I.style, tip: 'USE FILLED ICONS FOR THE ACTIVE STATE ONLY.', tipAr: 'استخدم الأيقونات الممتلئة للحالة النشطة فقط.', tipAt: 11, real: { img: 'tabler', url: 'tabler.io/icons', label: 'TABLER', atLong: 13 } },
    { title: ['MATCH THE STROKE', 'TO YOUR FONT.'], ar: 'طابق سُمك الأيقونة مع خط النص.', en: 'THE ICON SHOULD WEIGH LIKE YOUR TEXT.', vig: I.stroke, tip: '1.5PX FOR REGULAR TEXT, 2PX FOR STRONGER ICONS.', tipAr: 'سُمك 1.5 بكسل مع النص العادي، و2 بكسل لأيقونات أوضح.', tipAt: 11, real: { img: 'material', url: 'fonts.google.com/icons', label: 'MATERIAL SYMBOLS', at: 8.6, atLong: 13 }, shortLen: 16 },
    { title: ['ONE GRID,', 'ONE SIZE.'], ar: 'شبكة واحدة وحجم واحد.', en: '24PX GRID, SAME SIZE IN THE SAME PLACE.', vig: I.grid, tip: '24PX GRID WITH 2PX PADDING IS THE COMMON BASE.', tipAr: 'شبكة 24 بكسل مع هامش 2 بكسل هي القاعدة الشائعة.', tipAt: 11 },
    { title: ['CLEAR MEANING,', 'VISIBLE LABEL.'], ar: 'معنى واضح وعنوان ظاهر.', en: 'IF IT CAN BE MISREAD, ADD A WORD.', vig: I.meaning, tip: 'KEEP LABELS VISIBLE, NOT ONLY ON HOVER.', tipAr: 'اجعل العناوين ظاهرة دائمًا، لا عند التمرير فقط.', tipAt: 11 },
    { title: ['CHECK', 'THE LICENSE.'], ar: 'تحقّق من الترخيص.', en: 'FREE TO USE? WHERE? WITH WHAT CREDIT?', vig: I.license, tip: 'SF SYMBOLS: ONLY FOR APPS ON APPLE PLATFORMS.', tipAr: 'أيقونات SF Symbols مخصّصة لتطبيقات منصات Apple فقط.', tipAt: 9.5 },
  ];
  if (!long) items.forEach((it) => { it.len = it.shortLen || 12; if (!it.shortLen) delete it.real; });
  return {
    images: { lucide: 'assets/real-lucide.jpg', tabler: 'assets/real-tabler.jpg', material: 'assets/real-material.jpg' },
    hook: { lines: ['HOW TO CHOOSE', 'THE RIGHT', 'ICONS.'], ar: 'كيف تختار الأيقونات المناسبة؟', en: '6 CHECKS BEFORE YOU PICK A SET.', tags: ['24px', 'Outline', 'Filled', '1.5px', 'MIT', 'SVG'] },
    items,
    label: (i) => `CHECK 0${i + 1} / 06`,
    recap: { title: ['6 CHECKS,', 'ONE ICON SET.'], ar: 'ست خطوات ومجموعة أيقونات واحدة.', en: 'PLATFORM · STYLE · STROKE · GRID · MEANING · LICENSE', vig: I.recapVig },
    cover: {
      lines: ['HOW TO CHOOSE', 'THE RIGHT', 'ICONS.'], ar: 'كيف تختار الأيقونات المناسبة؟',
      art: (ctx, x, y, w, h) => { const names = ['home', 'search', 'bell', 'heart', 'user', 'gear']; const cs = Math.min(140, (w - 5 * 20) / 6); names.forEach((n, i) => { const cx = x + i * (cs + 20); rr(ctx, cx, y + 20, cs, cs, 24, i === 0 ? C.sel : '#262626', '#3A3A3A', 2); I.icon(ctx, n, cx + cs / 2, y + 20 + cs / 2, cs * 0.5, { stroke: 2 }); }); },
    },
  };
}
