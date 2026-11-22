// "UI and UX are not the same" — vignettes (Short coordinates: x 80..1000, y 280..1150) and the film config
// for shared/kinetic-film.js. Facts checked online on 22 Nov 2026 (NN/g "What is user experience": UX covers
// every aspect of the interaction with a company, its services and products; UI = the components and
// design elements; the term UX was coined by Don Norman in the 1990s; the movie-review example by Norman
// and Nielsen). One fictional cinema app runs through the video. No numbers invented.
export function makeUIUX(M, K) {
  const { lerp, clamp, E, mix } = M;
  const { F, C, TAU, ez, spr, txt, rr, pill, cursor, fit } = K;
  const phone = (ctx, cx, cy, w, h, screen = '#FFFFFF') => { const b = w * 0.045; rr(ctx, cx - w / 2 - b, cy - h / 2 - b, w + 2 * b, h + 2 * b, w * 0.17, '#0A0A0A', '#3A3A3A', 2); rr(ctx, cx - w / 2, cy - h / 2, w, h, w * 0.14, screen); rr(ctx, cx - w * 0.15, cy - h / 2 + w * 0.04, w * 0.3, w * 0.085, w * 0.0425, '#0A0A0A'); };
  const cross = (ctx, x, y, p) => { if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fill(); ctx.strokeStyle = '#FFF'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-11, -11); ctx.lineTo(11, 11); ctx.moveTo(11, -11); ctx.lineTo(-11, 11); ctx.stroke(); ctx.restore(); };
  const check = (ctx, x, y, p) => { if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(0, 0, 30, 0, TAU); ctx.fill(); ctx.strokeStyle = '#FFF'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-12, 1); ctx.lineTo(-3, 10); ctx.lineTo(13, -9); ctx.stroke(); ctx.restore(); };
  // a fictional film card inside a phone screen
  function filmScreen(ctx, x, y, w, s = 1, { pretty = true, oneStep = true, poster = '#1F3B57' } = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const W0 = 300;
    if (pretty) {
      txt(ctx, 'Tonight', 22, 70, 30, { color: '#111' });
      rr(ctx, 22, 92, W0 - 44, 150, 16, poster); rr(ctx, 40, 200, 120, 14, 7, 'rgba(255,255,255,0.8)');
      txt(ctx, 'The Long Road', 22, 280, 24, { color: '#111' }); txt(ctx, '20:30 · Hall 2', 22, 308, 18, { color: '#666' });
      if (oneStep) { rr(ctx, 22, 330, W0 - 44, 50, 12, '#1A73E8'); txt(ctx, 'Buy ticket', W0 / 2, 362, 20, { color: '#FFF', align: 'center' }); }
      else { txt(ctx, 'Step 1 of 6', 22, 350, 16, { w: 600, family: F.mono, color: '#999' }); rr(ctx, 22, 362, 90, 26, 13, '#EDEDED'); txt(ctx, 'More', 67, 380, 14, { color: '#BBB', align: 'center' }); }
    } else {
      txt(ctx, 'TONIGHT!!!', 30, 66, 30, { family: F.serif, w: 400, color: '#C2185B' });
      rr(ctx, 10, 86, W0 - 30, 140, 0, '#7CB342'); rr(ctx, 34, 104, W0 - 60, 30, 0, '#FFEB3B');
      txt(ctx, 'The Long Road', 50, 270, 26, { family: F.serif, w: 400, color: '#3949AB' }); txt(ctx, '20:30 hall 2', 14, 300, 18, { family: F.serif, w: 400, color: '#8D6E63' });
      if (oneStep) { rr(ctx, 14, 326, W0 - 28, 54, 0, '#FF1744'); txt(ctx, 'BUY TICKET', W0 / 2, 361, 22, { family: F.serif, w: 400, color: '#FFEB3B', align: 'center' }); }
      else { txt(ctx, 'step 1/6 ... continue below', 18, 352, 16, { family: F.serif, w: 400, color: '#9E9E9E' }); }
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- 1. UX: the whole journey
  const STEPS = ['Find a film', 'Pick a time', 'Choose seats', 'Pay', 'Get ticket'];
  const journey = {
    draw(ctx, v) {
      const P = [[220, 370], [780, 520], [220, 670], [780, 820], [500, 990]];
      const lp = ez(v, 2.8, 7.6, (q) => q);
      ctx.save(); ctx.strokeStyle = '#3A3A3A'; ctx.lineWidth = 6; ctx.setLineDash([2, 14]); ctx.lineCap = 'round'; ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore();
      STEPS.forEach((s, i) => {
        const p = spr(v, 2.6 + i * 0.5, { stiffness: 260, damping: 14 }); if (p <= 0) return;
        const [x, y] = P[i], done = lp * 4 >= i;
        ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.font = `700 30px ${F.title}`; const w = ctx.measureText(s).width + 60;
        rr(ctx, -w / 2, -40, w, 80, 40, done ? '#16324A' : '#262626', done ? C.sel : '#3A3A3A', 3); txt(ctx, s, 0, 11, 30, { color: '#FFFFFF', align: 'center' }); ctx.restore();
      });
      // a person travelling the path
      const seg = Math.min(3.999, lp * 4), k = Math.floor(seg), f = seg - k, [ax, ay] = P[k], [bx, by] = P[k + 1];
      if (v >= 2.8) { ctx.fillStyle = C.sel; ctx.beginPath(); ctx.arc(lerp(ax, bx, E.inOutCubic(f)), lerp(ay, by, E.inOutCubic(f)) - 56, 16, 0, TAU); ctx.fill(); }
      if (v >= 8) pill(ctx, 'Easy? Clear? Done? = UX', 540, 1110, spr(v, 8, { stiffness: 300, damping: 12 }), C.sel, 28);
    },
    hits: [...STEPS.map((_, i) => [2.6 + i * 0.5, `step ${i}`, 'pop', { pitch: ['D5', 'E5', 'F#5', 'A5', 'B5'][i] }]), [2.8, 'walk', 'whoosh', { len: 0.4 }], [8, 'ux', 'bell', { pitch: 'F#6' }]],
  };

  // ---------------------------------------------------------------- 2. UI: what you see and touch (callouts)
  const ui = {
    draw(ctx, v) {
      const op = spr(v, 2.6, { stiffness: 220, damping: 15 }); if (op <= 0) return;
      ctx.save(); ctx.globalAlpha = Math.min(1, op); phone(ctx, 400, 720, 340, 720); filmScreen(ctx, 250, 400, 300, 1); ctx.restore();
      const CALL = [['Type', 290, 470, 720, 400], ['Color', 330, 550, 760, 520], ['Spacing', 260, 690, 760, 640], ['Button', 400, 760, 760, 760], ['Icon', 520, 830, 760, 880]];
      CALL.forEach(([l, x1, y1, x2, y2], i) => {
        const p = spr(v, 4 + i * 0.7, { stiffness: 280, damping: 14 }); if (p <= 0) return;
        ctx.save(); ctx.globalAlpha = Math.min(1, p); ctx.strokeStyle = C.sel; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x1, y1, 8, 0, TAU); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, Math.min(1, p)), lerp(y1, y2, Math.min(1, p))); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.translate(x2 + 70, y2); ctx.scale(p, p); rr(ctx, -70, -28, 170, 56, 28, C.sel); txt(ctx, l, 15, 9, 26, { color: '#FFF', align: 'center' }); ctx.restore();
      });
    },
    hits: [[2.6, 'phone', 'thud', { pitch: 'D3' }], ...[0, 1, 2, 3, 4].map((i) => [4 + i * 0.7, `callout ${i}`, 'tick'])],
  };

  // ---------------------------------------------------------------- 3. same app, 4 versions (2 x 2)
  const grid4 = {
    draw(ctx, v) {
      const T = [[0, 0, 'GOOD UI · BAD UX', true, false], [1, 0, 'GOOD UI · GOOD UX', true, true], [0, 1, 'BAD UI · BAD UX', false, false], [1, 1, 'BAD UI · GOOD UX', false, true]];
      const order = [2, 3, 0, 1];
      txt(ctx, 'UX →', 1000, 1140, 26, { w: 600, family: F.mono, color: C.sub, align: 'right', alpha: ez(v, 2.6, 3) });
      txt(ctx, 'UI ↑', 80, 312, 26, { w: 600, family: F.mono, color: C.sub, alpha: ez(v, 2.6, 3) });
      order.forEach((idx, k) => {
        const [c, r, lab, goodUI, goodUX] = T[idx], s = spr(v, 2.8 + k * 0.9, { stiffness: 240, damping: 14 }); if (s <= 0) return;
        const x = 80 + c * 470, y = 330 + r * 400, best = goodUI && goodUX && v >= 7.6;
        ctx.save(); ctx.translate(x + 225, y + 190); ctx.scale(Math.min(1.03, s), Math.min(1.03, s)); ctx.translate(-(x + 225), -(y + 190));
        rr(ctx, x, y, 450, 380, 22, '#232323', best ? C.green : '#3A3A3A', best ? 4 : 2);
        txt(ctx, lab, x + 24, y + 44, fit(ctx, lab, 22, 400, 600, F.mono), { w: 600, family: F.mono, color: best ? '#7EE2A8' : C.sub });
        ctx.save(); ctx.beginPath(); ctx.roundRect(x + 24, y + 64, 402, 292, 14); ctx.clip(); rr(ctx, x + 24, y + 64, 402, 292, 14, goodUI ? '#FFFFFF' : '#FFF8E1'); filmScreen(ctx, x + 70, y + 30, 300, 0.8, { pretty: goodUI, oneStep: goodUX }); ctx.restore();
        ctx.restore();
        if (goodUX) check(ctx, x + 410, y + 40, spr(v, 3.4 + k * 0.9)); else cross(ctx, x + 410, y + 40, spr(v, 3.4 + k * 0.9));
      });
    },
    hits: [0, 1, 2, 3].map((k) => [2.8 + k * 0.9, `version ${k}`, k < 2 ? 'thud' : 'pop', k < 2 ? { pitch: 'C3' } : { pitch: ['A5', 'D6'][k - 2] }]).concat([[7.6, 'best', 'bell', { pitch: 'F#6' }]]),
  };

  // ---------------------------------------------------------------- 4. perfect UI, poor UX (Norman & Nielsen's movie example)
  const movie = {
    draw(ctx, v) {
      const op = spr(v, 2.6, { stiffness: 220, damping: 15 }); if (op <= 0) return;
      ctx.save(); ctx.globalAlpha = Math.min(1, op); phone(ctx, 540, 720, 360, 760, '#FFFFFF');
      const X = 380, Y = 360; txt(ctx, 'Search films', X, Y + 60, 34, { color: '#111' });
      rr(ctx, X, Y + 90, 320, 60, 30, '#F1F3F4'); const q = 'small indie film', n = Math.floor(ez(v, 3.4, 5.4, (t) => t) * q.length);
      txt(ctx, q.slice(0, n), X + 26, Y + 129, 22, { color: '#111' });
      if (v >= 5.8) {
        const e = ez(v, 5.8, 6.4);
        ctx.globalAlpha = Math.min(1, op) * e;
        ctx.strokeStyle = '#BDBDBD'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(540, Y + 300, 44, 0, TAU); ctx.moveTo(571, Y + 331); ctx.lineTo(600, Y + 360); ctx.stroke();
        txt(ctx, 'No results', 540, Y + 420, 30, { color: '#111', align: 'center' }); txt(ctx, 'Only major-studio films here.', 540, Y + 458, 20, { color: '#777', align: 'center' });
      }
      ctx.restore();
      if (v >= 7) { pill(ctx, 'UI: perfect ✓', 300, 1130, spr(v, 7, { stiffness: 300, damping: 12 }), C.green, 26); pill(ctx, 'UX: poor ✕', 780, 1130, spr(v, 7.6, { stiffness: 300, damping: 12 }), C.red, 26); }
      txt(ctx, 'Example: Don Norman & Jakob Nielsen (NN/g)', 540, 320, 22, { w: 600, family: F.mono, color: C.sub, align: 'center', alpha: ez(v, 8.4, 9) });
    },
    hits: [[2.6, 'phone', 'thud', { pitch: 'D3' }], [3.4, 'typing', 'type', { n: 12, len: 0.9 }], [5.8, 'no results', 'thud', { pitch: 'C2' }], [7, 'ui ok', 'pop', { pitch: 'A5' }], [7.6, 'ux poor', 'thud', { pitch: 'C3' }], [8.4, 'source', 'tick']],
  };

  // ---------------------------------------------------------------- 5. UI is part of UX
  const partOf = {
    draw(ctx, v) {
      const o = spr(v, 2.6, { stiffness: 200, damping: 14 }); if (o <= 0) return;
      ctx.save(); ctx.translate(540, 720); ctx.scale(Math.min(1.02, o), Math.min(1.02, o)); rr(ctx, -460, -400, 920, 800, 40, '#16324A', C.sel, 3); ctx.restore();
      txt(ctx, 'UX', 120, 400, 56, { color: '#FFFFFF', alpha: Math.min(1, o) });
      const parts = [['Research', 150, 470], ['User flows', 560, 470], ['Content', 150, 640], ['Speed', 560, 640], ['Support', 150, 810]];
      parts.forEach(([l, x, y], i) => { const p = spr(v, 3.6 + i * 0.35, { stiffness: 280, damping: 14 }); if (p <= 0) return; ctx.save(); ctx.translate(x + 160, y + 50); ctx.scale(p, p); rr(ctx, -160, -50, 320, 100, 20, '#1E2A36', '#2E4A66', 2); txt(ctx, l, 0, 12, 32, { color: '#DCEBFF', align: 'center' }); ctx.restore(); });
      const u = spr(v, 6, { stiffness: 260, damping: 12 });
      if (u > 0) { ctx.save(); ctx.translate(720, 860); ctx.scale(u, u); rr(ctx, -160, -50, 320, 100, 20, '#FFFFFF'); txt(ctx, 'UI', 0, 16, 46, { color: '#111', align: 'center' }); ctx.restore(); }
      if (v >= 7.4) pill(ctx, 'UI is one piece of UX', 540, 1080, spr(v, 7.4, { stiffness: 300, damping: 12 }), C.green, 30);
    },
    hits: [[2.6, 'ux box', 'thud', { pitch: 'D3' }], ...[0, 1, 2, 3, 4].map((i) => [3.6 + i * 0.35, `part ${i}`, 'pop', { pitch: ['D5', 'E5', 'F#5', 'A5', 'B5'][i] }]), [6, 'ui', 'boing', { pitch: 'A4', to: 'D5' }], [7.4, 'part of', 'bell', { pitch: 'F#6' }]],
  };

  // ---------------------------------------------------------------- 6 (long). who does what: two lanes
  const who = {
    draw(ctx, v) {
      const L = [['UX', ['Research', 'Flows', 'Wireframes', 'Testing'], 420, C.sel], ['UI', ['Visual style', 'Components', 'Design system'], 820, C.green]];
      L.forEach(([n, items, y, col], r) => {
        const s = spr(v, 2.6 + r * 1.6, { stiffness: 230, damping: 15 }); if (s <= 0) return;
        txt(ctx, n, 80, y - 80, 48, { color: col, alpha: Math.min(1, s) });
        items.forEach((it, i) => { const p = spr(v, 3 + r * 1.6 + i * 0.4, { stiffness: 280, damping: 14 }); if (p <= 0) return; const w = (920 - (items.length - 1) * 24) / items.length, x = 80 + i * (w + 24); ctx.save(); ctx.translate(x + w / 2, y); ctx.scale(p, p); rr(ctx, -w / 2, -60, w, 120, 18, '#262626', col, 2); txt(ctx, it, 0, 10, fit(ctx, it, 30, w - 30), { color: '#FFF', align: 'center' }); ctx.restore(); if (i < items.length - 1 && p >= 1) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x + w + 4, y - 10); ctx.lineTo(x + w + 20, y); ctx.lineTo(x + w + 4, y + 10); ctx.fill(); } });
      });
      if (v >= 8.6) pill(ctx, 'Small teams: one person does both', 540, 1060, spr(v, 8.6, { stiffness: 300, damping: 12 }), '#3A3A3A', 26);
    },
    hits: [[2.6, 'ux lane', 'thud', { pitch: 'D3' }], [4.2, 'ui lane', 'thud', { pitch: 'A2' }], [8.6, 'both', 'tick']],
  };
  // ---------------------------------------------------------------- 7 (long). 3 myths, crossed out
  const myths = {
    draw(ctx, v) {
      ['UI and UX are the same', 'UI is just making it pretty', 'UX is just wireframes'].forEach((m, i) => {
        const s = spr(v, 2.6 + i * 1.6, { stiffness: 220, damping: 15 }); if (s <= 0) return;
        const y = 360 + i * 240, x = lerp(1100, 80, Math.min(1.02, s));
        rr(ctx, x, y, 920, 190, 22, '#232323'); txt(ctx, `MYTH 0${i + 1}`, x + 40, y + 60, 24, { w: 600, family: F.mono, color: C.sub }); txt(ctx, m, x + 40, y + 130, fit(ctx, m, 46, 760), { color: '#FFFFFF' });
        const k = ez(v, 3.4 + i * 1.6, 3.9 + i * 1.6, E.inOutCubic); ctx.fillStyle = C.red; ctx.fillRect(x + 36, y + 114, 760 * k, 6); cross(ctx, x + 860, y + 95, spr(v, 3.6 + i * 1.6, { stiffness: 320, damping: 11 }));
      });
    },
    hits: [0, 1, 2].flatMap((i) => [[2.6 + i * 1.6, `myth ${i}`, 'whoosh', { len: 0.3 }], [3.6 + i * 1.6, `cross ${i}`, 'thud', { pitch: 'C3' }]]),
  };
  // ---------------------------------------------------------------- 8 (long). the jobs
  const roles = {
    draw(ctx, v) {
      const R = [['UX Designer', 'UX', C.sel], ['UX Researcher', 'UX', C.sel], ['UI Designer', 'UI', C.green], ['Design Systems Designer', 'UI', C.green], ['Product Designer', 'UX + UI', '#FFFFFF']];
      R.forEach(([n, t, col], i) => {
        const s = spr(v, 2.6 + i * 0.5, { stiffness: 230, damping: 15 }); if (s <= 0) return;
        const y = 330 + i * 160, best = i === 4 && v >= 6.4;
        ctx.save(); ctx.translate(lerp(i % 2 ? 1100 : -1000, 0, Math.min(1, s)), 0);
        rr(ctx, 80, y, 920, 130, 20, best ? '#16324A' : '#262626', best ? C.sel : null, 3);
        txt(ctx, n, 120, y + 80, fit(ctx, n, 40, 560), { color: '#FFFFFF' });
        ctx.font = `600 24px ${F.mono}`; const w = ctx.measureText(t).width + 40; rr(ctx, 960 - w, y + 37, w, 56, 28, null, col, 2); txt(ctx, t, 960 - w / 2, y + 74, 24, { w: 600, family: F.mono, color: col, align: 'center' });
        ctx.restore();
      });
    },
    hits: [0, 1, 2, 3, 4].map((i) => [2.6 + i * 0.5, `role ${i}`, 'whoosh', { len: 0.25 }]).concat([[6.4, 'product designer', 'bell', { pitch: 'F#6' }]]),
  };
  // ---------------------------------------------------------------- recap: two columns
  const recapVig = {
    draw(ctx, v) {
      [['UX', ['Research', 'Flows', 'Wireframes', 'Testing'], 80, C.sel], ['UI', ['Layout', 'Type', 'Color', 'Components'], 560, C.green]].forEach(([n, items, x, col], c) => {
        const s = spr(v, 1.2 + c * 0.6, { stiffness: 230, damping: 15 }); if (s <= 0) return;
        rr(ctx, x, 320, 440, 640, 26, '#232323', col, 3); txt(ctx, n, x + 40, 410, 64, { color: col });
        items.forEach((it, i) => txt(ctx, it, x + 40, 510 + i * 100, 40, { color: '#FFFFFF', alpha: ez(v, 1.6 + c * 0.6 + i * 0.2, 2 + c * 0.6 + i * 0.2) }));
      });
    },
    hits: [[1.2, 'ux col', 'pop', { pitch: 'D5' }], [1.8, 'ui col', 'pop', { pitch: 'A5' }]],
  };
  return { journey, ui, grid4, movie, partOf, who, myths, roles, recapVig, filmScreen };
}

export function uiuxTopic(K, U, long) {
  const { rr, txt, C } = K;
  const items = [
    { title: ['UX:', 'THE WHOLE JOURNEY.'], ar: 'تجربة المستخدم: الرحلة كاملة.', en: 'FROM FINDING TO SUCCEEDING.', vig: U.journey, tip: 'UX STARTS BEFORE THE SCREEN: WHAT DOES THE USER NEED?', tipAr: 'تبدأ التجربة قبل الشاشة: ماذا يحتاج المستخدم؟', tipAt: 11 },
    { title: ['UI: WHAT YOU', 'SEE & TOUCH.'], ar: 'واجهة المستخدم: ما تراه وتلمسه.', en: 'BUTTONS, ICONS, TYPE, COLOR, SPACING.', vig: U.ui, tip: 'CONSISTENCY MAKES AN INTERFACE FEEL EASY.', tipAr: 'الاتساق يجعل الواجهة تبدو سهلة.', tipAt: 11 },
    { title: ['SAME APP,', '4 VERSIONS.'], ar: 'نفس التطبيق بأربع نسخ.', en: 'GOOD UI DOES NOT MEAN GOOD UX.', vig: U.grid4, tip: 'TEST WITH REAL USERS, NOT ONLY WITH YOUR EYES.', tipAr: 'اختبر مع مستخدمين حقيقيين، لا بعينيك فقط.', tipAt: 11 },
    { title: ['PERFECT UI,', 'POOR UX.'], ar: 'واجهة ممتازة وتجربة ضعيفة.', en: 'THE FILM YOU WANT IS NOT IN THE DATABASE.', vig: U.movie, tip: 'THIS EXAMPLE COMES FROM DON NORMAN AND JAKOB NIELSEN.', tipAr: 'هذا المثال من دون نورمان وياكوب نيلسن.', tipAt: 11 },
    { title: ['UI IS', 'PART OF UX.'], ar: 'الواجهة جزء من التجربة.', en: 'UX IS THE WHOLE, UI IS ONE PIECE.', vig: U.partOf, tip: 'DON NORMAN COINED THE TERM UX IN THE 1990S.', tipAr: 'صاغ دون نورمان مصطلح UX في التسعينيات.', tipAt: 10 },
    ...(long ? [
      { title: ['WHO DOES', 'WHAT?'], ar: 'من يفعل ماذا؟', en: 'UX: RESEARCH TO TESTING. UI: VISUALS TO SYSTEM.', vig: U.who, tip: 'IN SMALL TEAMS, ONE PERSON OFTEN DOES BOTH.', tipAr: 'في الفرق الصغيرة غالبًا ما يقوم شخص واحد بالدورين.', tipAt: 12 },
      { title: ['3 MYTHS', 'TO FORGET.'], ar: 'ثلاث أفكار خاطئة يجب نسيانها.', en: 'SAME THING? JUST PRETTY? JUST WIREFRAMES?', vig: U.myths, tip: 'UI DESIGNERS CARE ABOUT USABILITY TOO.', tipAr: 'مصمم الواجهات يهتم بسهولة الاستخدام أيضًا.', tipAt: 12 },
      { title: ['THE', 'JOBS.'], ar: 'الوظائف في المجال.', en: 'UX, UI, OR BOTH: PRODUCT DESIGNER.', vig: U.roles, tip: 'MANY COMPANIES HIRE PRODUCT DESIGNERS WHO DO BOTH.', tipAr: 'كثير من الشركات توظّف مصممي منتجات يقومون بالدورين.', tipAt: 11 },
    ] : []),
  ];
  const n = items.length;
  return {
    hook: { lines: ['UI AND UX', 'ARE NOT', 'THE SAME.'], ar: 'ليسا الشيء نفسه: UI وUX.', en: 'HERE IS THE DIFFERENCE, IN ONE APP.', tags: ['UI', 'UX', 'Flow', 'Button', 'Research', 'Color'] },
    items,
    label: (i) => `STEP 0${i + 1} / 0${n}`,
    recap: { title: ['UX: HOW IT WORKS.', 'UI: HOW IT LOOKS.'], ar: 'التجربة: كيف يعمل. والواجهة: كيف يبدو.', en: 'GREAT PRODUCTS NEED BOTH.', vig: U.recapVig },
    cover: {
      lines: ['UI AND UX', 'ARE NOT', 'THE SAME.'], ar: 'ليسا الشيء نفسه: UI وUX.',
      art: (ctx, x, y, w, h) => { const cw = (w - 24) / 2, ch = w > 800 ? Math.min(h - 20, cw * 1.1) : Math.min(h - 40, cw * 2.2); [['UI', C.green], ['UX', C.sel]].forEach(([l, col], i) => { const cx = x + i * (cw + 24); rr(ctx, cx, y + 10, cw, ch, 28, '#232323', col, 4); txt(ctx, l, cx + cw / 2, y + 10 + ch / 2 + 50, Math.min(150, cw * 0.55), { color: col, align: 'center' }); }); },
    },
  };
}
