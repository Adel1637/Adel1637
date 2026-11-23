// "6 UI/UX principles for dashboards" — one fictional store dashboard that cleans itself principle by
// principle (level L: 0 = cluttered ... 6/7 = clear). Short coordinates: x 80..1000, y 280..1150.
// Facts checked online on 23 Nov 2026: Stephen Few (one screen at a glance, remove non-data ink, pies are
// hard to read, bars to compare, lines for trends); NN/g (remove decorative icons, large plain numbers,
// tooltips for exact values); scanning starts top then left (summary on top, details below).
// All values are random demo data (seeded), labelled DEMO DATA on screen.
export function makeDashboard(M, K) {
  const { lerp, clamp, E, mix, mulberry32 } = M;
  const { F, C, TAU, ez, spr, txt, rr, pill, cursor, fit } = K;
  const rnd = mulberry32(2026);
  const r = (a, b) => a + (b - a) * rnd();
  const money = (x) => '$' + Math.round(x).toLocaleString('en-US');
  const KPI = [
    { l: 'Revenue', v: money(r(30000, 90000)), d: +r(2, 18).toFixed(1) },
    { l: 'Orders', v: Math.round(r(400, 2400)).toLocaleString('en-US'), d: +r(1, 12).toFixed(1) },
    { l: 'Conversion', v: r(1.5, 4.5).toFixed(1) + '%', d: -r(0.2, 3).toFixed(1) },
    { l: 'Avg. order', v: money(r(25, 120)), d: +r(0.5, 8).toFixed(1) },
  ];
  KPI.forEach((k) => { k.spark = Array.from({ length: 12 }, () => r(0.2, 1)); });
  const TREND = Array.from({ length: 14 }, (_, i) => 0.35 + 0.3 * Math.sin(i * 0.6) * 0.5 + i * 0.03 + r(-0.06, 0.06));
  const CATS = ['Shoes', 'Bags', 'Accessories', 'Watches', 'Hats'].map((n) => ({ n, v: r(0.3, 1) })).sort((a, b) => b.v - a.v);
  const NOISE = ['Visitors', 'Bounce', 'Sessions', 'Tickets', 'Stock', 'Returns', 'Reviews', 'Clicks', 'Signups', 'Refunds', 'Shares', 'Uptime'].map((l, i) => ({ l, v: Math.round(r(10, 999)), c: ['#FF4D6D', '#00C2FF', '#FFC300', '#7CFC00', '#FF7AE0', '#00E5A8'][i % 6], keep: [0, 2, 5, 8].includes(i) }));
  const ACC = '#2F7CF6';

  // e(k): progress of principle k (1-based) for a level L
  const e = (L, k) => clamp(L - (k - 1));
  function spark(ctx, x, y, w, h, pts, col, lw = 3) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach((p, i) => { const px = x + (i / (pts.length - 1)) * w, py = y + h - p * h; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.stroke(); }

  // ---------------------------------------------------------------- the dashboard at level L
  // clear state = EDITORIAL dashboard (newspaper data-desk style, Tufte/Few): no cards, no shadows, no pills, no
  // avatars; hairline rules and a grid, a headline sentence that answers the question, big serif numerals,
  // direct labels on the chart, one accent colour (deep teal). The cluttered "before" state is unchanged.
  const INKC = '#141414', MUTE = '#6B6B6B', RULE = '#D9D9D9', TEAL = '#0F6B66';
  const X0 = 112, X1 = 968;                                   // editorial content margins
  const plot = { x: X0 + 40, y: 690, w: 520, h: 210 };
  const trendPoint = (k) => [plot.x + (k / (TREND.length - 1)) * plot.w, plot.y + plot.h - TREND[k] * plot.h];
  const T = (ctx, s, x, y, size, w, color, align = 'left', family = F.title) => txt(ctx, s, x, y, size, { w, color, align, family });
  const hair = (ctx, x0, y, x1, col = RULE, lw = 1) => { ctx.fillStyle = col; ctx.fillRect(x0, y, x1 - x0, lw); };
  const top = CATS[0].n;
  function dash(ctx, L, v = 0, opts = {}) {
    const e1 = e(L, 1), e2 = e(L, 2), e3 = e(L, 3), e4 = e(L, 4), e5 = e(L, 5), e6 = e(L, 6), e7 = opts.color ? e(L, 7) : 1;
    const deco = 1 - e5, clean = e5;
    rr(ctx, 80, 300, 920, 850, 24, mix('#F4F4F6', '#FFFFFF', e5));
    // header: loud gradient banner -> editorial masthead + headline sentence
    if (deco > 0) { ctx.save(); ctx.globalAlpha = deco; const g = ctx.createLinearGradient(80, 0, 1000, 0); g.addColorStop(0, '#00C2FF'); g.addColorStop(1, '#FF4D6D'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(80, 300, 920, 80, [24, 24, 0, 0]); ctx.fill(); txt(ctx, 'DASHBOARD!!', 120, 354, 34, { color: '#FFFFFF' }); ctx.restore(); }
    if (clean > 0) {
      ctx.save(); ctx.globalAlpha = clean;
      T(ctx, 'STORE · WEEK 47', X0, 336, 13, 600, MUTE, 'left', F.mono); T(ctx, 'LAST 7 DAYS', X1, 336, 13, 600, MUTE, 'right', F.mono);
      hair(ctx, X0, 348, X1, INKC, 2);
      T(ctx, `Revenue is up ${Math.abs(KPI[0].d)}% this week, led by ${top}.`, X0, 392, fit(ctx, `Revenue is up ${Math.abs(KPI[0].d)}% this week, led by ${top}.`, 36, X1 - X0, 400, F.serif), 400, INKC, 'left', F.serif);
      ctx.restore();
    }
    txt(ctx, 'DEMO DATA', 980, 296, 16, { w: 600, family: F.mono, color: '#888', align: 'right' });
    // ---- cluttered tiles (unchanged "before" state)
    if (e3 < 1) {
      const tw = (920 - 48 - 36) / 4, th = 100;
      NOISE.forEach((t, i) => {
        let col = i % 4, row = Math.floor(i / 4);
        if (i === 5) { col = lerp(1, 0, E.inOutCubic(e2)); row = lerp(1, 0, E.inOutCubic(e2)); }
        if (i === 0) { col = lerp(0, 1, E.inOutCubic(e2)); row = lerp(0, 1, E.inOutCubic(e2)); }
        const x = 104 + col * (tw + 12), y = 400 + row * (th + 12);
        const dim = t.keep ? 1 : lerp(1, 0.22, e1), a = (1 - e3) * dim;
        ctx.save(); ctx.globalAlpha = a;
        if (deco > 0) { ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x + 6, y + 6, tw, th); }
        rr(ctx, x, y, tw, th, 8, '#FFFFFF', t.c, 4);
        ctx.fillStyle = t.c; ctx.beginPath(); ctx.arc(x + 34, y + 50, 20, 0, TAU); ctx.fill();
        txt(ctx, i === 5 ? 'Revenue' : t.l, x + 64, y + 40, 16, { color: '#555' }); txt(ctx, i === 5 ? KPI[0].v : String(t.v), x + 64, y + 72, 22, { color: '#111' });
        ctx.restore();
        if (!t.keep && e1 > 0.3 && e3 < 0.2) { ctx.save(); ctx.globalAlpha = Math.min(1, e1) * (1 - e3 * 5); ctx.strokeStyle = C.red; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + tw - 30, y + 14); ctx.lineTo(x + tw - 14, y + 30); ctx.moveTo(x + tw - 14, y + 14); ctx.lineTo(x + tw - 30, y + 30); ctx.stroke(); ctx.restore(); }
        if (i === 5 && e2 > 0 && e3 < 1) { ctx.save(); ctx.globalAlpha = Math.min(1, e2) * (1 - e3); rr(ctx, x - 6, y - 6, tw + 12, th + 12, 12, null, ACC, 5); ctx.restore(); }
      });
    }
    // ---- KPI strip: no cards, columns split by hairlines, big serif numerals, delta in words, tiny sparkline
    if (e3 > 0) {
      const cw = (X1 - X0) / 4, y = 420;
      KPI.forEach((k, i) => {
        const s = clamp(e3 * 1.6 - i * 0.15); if (s <= 0) return;
        const x = X0 + i * cw;
        ctx.save(); ctx.globalAlpha = s;
        if (deco > 0) { ctx.save(); ctx.globalAlpha = s * deco; ctx.fillStyle = `rgba(0,0,0,0.2)`; ctx.fillRect(x + 10, y + 6, cw - 14, 150); rr(ctx, x + 4, y, cw - 14, 150, 12, '#FFFFFF', '#9AA4B2', 4); ctx.fillStyle = ['#00C2FF', '#FFC300', '#FF4D6D', '#7CFC00'][i]; ctx.beginPath(); ctx.arc(x + cw - 40, y + 30, 16, 0, TAU); ctx.fill(); ctx.restore(); }
        if (i > 0) { ctx.globalAlpha = s * clean; ctx.fillStyle = RULE; ctx.fillRect(x, y, 1, 150); ctx.globalAlpha = s; }
        const px = x + (i ? 22 : 14);
        T(ctx, k.l.toUpperCase(), px, y + 26, 13, 600, MUTE, 'left', F.mono);
        T(ctx, k.v, px, y + 88, fit(ctx, k.v, 56, cw - 36, 400, F.serif), 400, INKC, 'left', F.serif);
        const up = k.d >= 0, good = e7 > 0.5, dc = good ? (up ? '#1B6B3A' : '#A61B1B') : ['#FF7AE0', '#00C2FF', '#FFC300', '#7CFC00'][i];
        T(ctx, `${up ? '▲' : '▼'} ${Math.abs(k.d)}%`, px, y + 120, 15, 600, dc); T(ctx, 'vs last week', px + 72, y + 120, 13, 400, MUTE);
        ctx.strokeStyle = good ? INKC : dc; ctx.lineWidth = 1.5; ctx.beginPath(); k.spark.forEach((p, j) => { const sx = px + (j / 11) * (cw - 50), sy = y + 146 - p * 14; j ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy); }); ctx.stroke();
        ctx.fillStyle = good ? TEAL : dc; ctx.beginPath(); ctx.arc(px + cw - 50, y + 146 - k.spark[11] * 14, 3.5, 0, TAU); ctx.fill();
        ctx.restore();
      });
      ctx.save(); ctx.globalAlpha = Math.min(1, e3) * clean; hair(ctx, X0, 600, X1); ctx.restore();
    }
    // ---- cluttered charts: pie + gauge (until principle 4)
    if (e4 < 1) {
      const a = 1 - e4;
      ctx.save(); ctx.globalAlpha = a;
      const cx = 300, cy = 950, R = 150; let ang = -Math.PI / 2; const tot = CATS.reduce((s2, c) => s2 + c.v, 0);
      if (deco > 0) { ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(cx + 10, cy + 20, R, R * 0.9, 0, 0, TAU); ctx.fill(); }
      CATS.forEach((c, i) => { const da = (c.v / tot) * TAU; ctx.fillStyle = ['#FF4D6D', '#00C2FF', '#FFC300', '#7CFC00', '#FF7AE0'][i]; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, ang, ang + da); ctx.closePath(); ctx.fill(); ang += da; });
      txt(ctx, 'Sales by category', cx, cy - R - 20, 20, { color: '#555', align: 'center' });
      const gx = 760, gy = 1010; ctx.lineWidth = 34; ctx.lineCap = 'butt'; ctx.strokeStyle = '#E3E3E3'; ctx.beginPath(); ctx.arc(gx, gy, 140, Math.PI, 0); ctx.stroke();
      ctx.strokeStyle = '#FF4D6D'; ctx.beginPath(); ctx.arc(gx, gy, 140, Math.PI, Math.PI * 1.62); ctx.stroke(); txt(ctx, 'Trend?', gx, gy - 20, 30, { color: '#111', align: 'center' });
      ctx.restore();
    }
    // ---- clear charts (editorial): line with direct labels + ranked dot plot + plain table
    if (e4 > 0) {
      const a = Math.min(1, e4 * 1.4);
      ctx.save(); ctx.globalAlpha = a;
      if (deco > 0) { ctx.save(); ctx.globalAlpha = a * deco; ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(X0 + 6, 626, 600, 300); rr(ctx, X0, 620, 600, 300, 12, '#FFFFFF', '#9AA4B2', 4); rr(ctx, 730, 620, 238, 300, 12, '#FFFFFF', '#9AA4B2', 4); ctx.restore(); }
      T(ctx, 'Daily revenue', X0, 650, 18, 600, INKC); T(ctx, 'USD, thousands', X0 + 140, 650, 14, 400, MUTE);
      [0, 1, 2, 3].forEach((g) => { const y = plot.y + (g / 3) * plot.h; hair(ctx, plot.x, y, plot.x + plot.w, '#EDEDED'); T(ctx, `${(3 - g) * 4}`, plot.x - 12, y + 5, 12, 500, MUTE, 'right', F.mono); });
      ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach((d, i) => T(ctx, d, plot.x + (i / 6) * plot.w, plot.y + plot.h + 26, 12, 600, MUTE, 'center', F.mono));
      const n = Math.max(2, Math.round(1 + clamp(e4 * 1.5) * (TREND.length - 1)));
      ctx.strokeStyle = e7 > 0.5 ? TEAL : ACC; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.beginPath(); TREND.slice(0, n).forEach((p, i) => { const [x, y] = trendPoint(i); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
      // direct label on the line end + annotated best day
      if (n >= TREND.length) {
        const [ex, ey] = trendPoint(TREND.length - 1); ctx.fillStyle = TEAL; ctx.beginPath(); ctx.arc(ex, ey, 5, 0, TAU); ctx.fill();
        T(ctx, 'This week', ex - 8, ey - 16, 14, 600, TEAL, 'right');
        let mi = 0; TREND.forEach((p, i) => { if (p < TREND[mi]) mi = i; });
        if (clean > 0) { const [bx, by] = trendPoint(mi); ctx.save(); ctx.globalAlpha = a * clean; ctx.strokeStyle = INKC; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx, by + 8); ctx.lineTo(bx, by + 46); ctx.stroke(); T(ctx, 'Slowest day', bx + 6, by + 44, 13, 600, INKC); ctx.restore(); }
      }
      // ranked categories: thin bars, values written at the end, no colours
      const rx = 740; T(ctx, 'Top categories', rx, 650, 18, 600, INKC);
      const tot = CATS.reduce((s2, c) => s2 + c.v, 0);
      CATS.forEach((c, i) => { const y = 700 + i * 44, pct = Math.round((c.v / tot) * 100), w = 150 * (c.v / CATS[0].v) * clamp(e4 * 1.3 - i * 0.08); T(ctx, c.n, rx, y, 14, 500, INKC); ctx.fillStyle = e7 > 0.5 ? (i === 0 ? TEAL : '#9A9A9A') : ['#FF4D6D', '#00C2FF', '#FFC300', '#7CFC00', '#FF7AE0'][i]; ctx.fillRect(rx, y + 10, w, 6); T(ctx, `${pct}%`, rx + w + 8, y + 17, 13, 600, MUTE, 'left', F.mono); });
      // orders: plain table, hairlines, right-aligned figures
      hair(ctx, X0, 950, X1, INKC, 2);
      T(ctx, 'Latest orders', X0, 982, 18, 600, INKC);
      ['ORDER', 'ITEM', 'STATUS', 'AMOUNT'].forEach((h, i) => T(ctx, h, [X0, X0 + 160, X0 + 480, X1][i], 1012, 12, 600, MUTE, i === 3 ? 'right' : 'left', F.mono));
      [['1042', 'Watches', 'Paid', money(r2(1))], ['1041', 'Bags', 'Paid', money(r2(2))], ['1040', 'Hats', 'Refunded', money(r2(3))]].forEach(([o, it, st, amt], i) => {
        const y = 1046 + i * 34; hair(ctx, X0, y - 24, X1, '#EDEDED');
        T(ctx, o, X0, y, 15, 500, INKC, 'left', F.mono); T(ctx, it, X0 + 160, y, 15, 400, INKC); T(ctx, st, X0 + 480, y, 15, 600, st === 'Paid' ? INKC : '#A61B1B'); T(ctx, amt, X1, y, 15, 500, INKC, 'right', F.mono);
      });
      ctx.restore();
    }
    // ---- principle 6: details on demand (annotation-style tooltip)
    if (e6 > 0 && opts.tooltip !== false) {
      const k = 9, [px, py] = trendPoint(k);
      ctx.save(); ctx.globalAlpha = Math.min(1, e6 * 1.5);
      ctx.strokeStyle = INKC; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, plot.y); ctx.lineTo(px, plot.y + plot.h); ctx.stroke();
      ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(px, py, 6, 0, TAU); ctx.fill(); ctx.strokeStyle = TEAL; ctx.lineWidth = 3; ctx.stroke();
      rr(ctx, px + 12, py - 70, 170, 58, 2, '#FFFFFF', INKC, 1.5); T(ctx, 'FRIDAY', px + 24, py - 48, 12, 600, MUTE, 'left', F.mono); T(ctx, money(TREND[k] * 12000), px + 24, py - 22, 22, 400, INKC, 'left', F.serif);
      ctx.restore();
    }
  }
  const r2 = (k) => 40 + ((k * 7919) % 200) + k * 13.5;

  // ---------------------------------------------------------------- per-principle vignettes (L goes k-1 -> k)
  function step(k, extra) {
    return {
      draw(ctx, v) {
        const L = k - 1 + ez(v, 2.8, 7.2, E.inOutCubic);
        dash(ctx, L, v, { color: k === 7 });
        if (extra) extra(ctx, v);
      },
      hits: [[2.8, `principle ${k}`, 'whoosh', { len: 0.6 }], [4.6, `clean ${k}`, 'pop', { pitch: ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6', 'E6'][k - 1] }], [7.2, `done ${k}`, 'bell', { pitch: 'F#6' }]],
    };
  }
  const q = (ctx, v) => { const p = spr(v, 3.2, { stiffness: 280, damping: 14 }); if (p > 0) pill(ctx, 'Q: How is the store doing this week?', 540, 330, p, C.sel, 24); };
  const fpath = (ctx, v) => { const p = ez(v, 3, 6, (t) => t); if (p <= 0 || v > 8.5) return; ctx.save(); ctx.strokeStyle = 'rgba(47,124,246,0.75)'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.setLineDash([1, 22]); const P = [[110, 420], [990, 420], [110, 540], [700, 540], [110, 660], [110, 1100]]; ctx.beginPath(); let left = p * 5; P.forEach(([x, y], i) => { if (i === 0) { ctx.moveTo(x, y); return; } const [x0, y0] = P[i - 1], f = clamp(left); if (f > 0) ctx.lineTo(lerp(x0, x, f), lerp(y0, y, f)); left -= 1; }); ctx.stroke(); ctx.restore(); };
  const hover = (ctx, v) => { if (v >= 3 && v < 9) { const [px, py] = trendPoint(9); const m = ez(v, 3, 4.2, E.inOutCubic); cursor(ctx, lerp(860, px + 6, m), lerp(1100, py + 6, m)); } };
  const steps = [step(1, q), step(2, fpath), step(3), step(4), step(5), step(6, hover), step(7)];
  const recapVig = {
    draw(ctx, v) {
      [[0, 'BEFORE', C.red], [7, 'AFTER', C.green]].forEach(([L, lab, col], i) => {
        const s = spr(v, 1.2 + i * 0.8, { stiffness: 220, damping: 15 }); if (s <= 0) return;
        ctx.save(); ctx.translate(i ? 770 : 310, 715); ctx.scale(0.47 * Math.min(1, s), 0.47 * Math.min(1, s)); ctx.translate(-540, -725); dash(ctx, L, 0, { color: true, tooltip: false }); ctx.restore();
        pill(ctx, lab, i ? 770 : 310, 450, s, col, 26);
      });
    },
    hits: [[1.2, 'before', 'thud', { pitch: 'C3' }], [2.0, 'after', 'bell', { pitch: 'F#6' }]],
  };
  return { steps, recapVig, dash };
}

export function dashboardTopic(K, D, long) {
  const items = [
    { title: ['START WITH', 'ONE QUESTION.'], ar: 'ابدأ بسؤال واحد.', en: 'WHO READS IT, AND WHAT DO THEY DECIDE?', vig: D.steps[0], tip: 'REMOVE EVERY WIDGET THAT DOES NOT ANSWER IT.', tipAr: 'احذف كل عنصر لا يجيب عن هذا السؤال.', tipAt: 11 },
    { title: ['MOST IMPORTANT', 'TOP-LEFT.'], ar: 'الأهم في الأعلى يسارًا.', en: 'PEOPLE SCAN THE TOP, THEN THE LEFT SIDE.', vig: D.steps[1], tip: 'IN AN ARABIC (RTL) DASHBOARD, MIRROR IT: TOP-RIGHT.', tipAr: 'في لوحة عربية من اليمين لليسار، اعكسها: الأهم في الأعلى يمينًا.', tipAt: 11 },
    { title: ['A FEW', 'KPI CARDS.'], ar: 'بطاقات مؤشرات قليلة.', en: 'VALUE, COMPARISON, TREND. NOT TWENTY CARDS.', vig: D.steps[2], tip: 'ALWAYS SHOW THE COMPARISON: LAST PERIOD OR TARGET.', tipAr: 'أظهر دائمًا المقارنة: بالفترة السابقة أو بالهدف.', tipAt: 11 },
    { title: ['THE RIGHT', 'CHART.'], ar: 'الرسم البياني المناسب.', en: 'LINES FOR TRENDS, BARS TO COMPARE. NO PIES.', vig: D.steps[3], tip: 'HORIZONTAL BARS MAKE LONG LABELS EASY TO READ.', tipAr: 'الأعمدة الأفقية تجعل التسميات الطويلة سهلة القراءة.', tipAt: 11 },
    { title: ['REMOVE THE', 'DECORATION.'], ar: 'احذف الزخرفة.', en: 'NO 3D, NO DECORATIVE ICONS, NO HEAVY BORDERS.', vig: D.steps[4], tip: 'EVERY PIXEL SHOULD SHOW DATA OR HELP READ IT.', tipAr: 'كل بكسل يجب أن يعرض بيانات أو يساعد على قراءتها.', tipAt: 11 },
    { title: ['DETAILS', 'ON DEMAND.'], ar: 'التفاصيل عند الطلب.', en: 'ONE SCREEN AT A GLANCE, HOVER FOR MORE.', vig: D.steps[5], tip: 'TOOLTIPS SHOW EXACT VALUES WITHOUT LEAVING THE SCREEN.', tipAr: 'التلميحات تعرض القيم الدقيقة دون مغادرة الشاشة.', tipAt: 11 },
    ...(long ? [{ title: ['COLOR WITH', 'MEANING.'], ar: 'ألوان لها معنى.', en: 'ONE ACCENT. GREEN AND RED ONLY FOR STATUS.', vig: D.steps[6], tip: 'ADD AN ARROW OR A WORD: NEVER COLOR ALONE.', tipAr: 'أضف سهمًا أو كلمة: لا تعتمد على اللون وحده.', tipAt: 11 }] : []),
  ];
  const n = items.length;
  return {
    fonts: ['400 20px Plex', '500 20px Plex', '600 20px Plex'],
    hook: { lines: [`${n} UI/UX PRINCIPLES`, 'FOR DASHBOARDS.'], ar: `${n === 7 ? 'سبعة' : 'ستة'} مبادئ UI/UX لتصميم لوحات التحكم.`, en: 'FROM CLUTTERED TO CLEAR, STEP BY STEP.', tags: ['KPI', 'Chart', 'Filter', 'Trend', 'Table', 'Alert'] },
    items,
    label: (i) => `PRINCIPLE 0${i + 1} / 0${n}`,
    recap: { title: ['CLUTTERED', 'TO CLEAR.'], ar: 'من الفوضى إلى الوضوح.', en: 'QUESTION · LAYOUT · KPIS · CHARTS · NO DECOR · DETAILS', vig: D.recapVig },
    cover: {
      lines: ['UI/UX', 'PRINCIPLES FOR', 'DASHBOARDS.'], ar: 'مبادئ UI/UX لتصميم لوحات التحكم',
      art: (ctx, x, y, w, h) => { const s = Math.min(w / 920, h / 850); ctx.save(); ctx.translate(x + (w - 920 * s) / 2, y + 10); ctx.scale(s, s); ctx.translate(-80, -300); D.dash(ctx, 7, 0, { color: true, tooltip: false }); ctx.restore(); },
    },
  };
}
