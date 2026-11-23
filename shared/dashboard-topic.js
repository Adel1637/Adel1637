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
  function dash(ctx, L, v = 0, opts = {}) {
    const e1 = e(L, 1), e2 = e(L, 2), e3 = e(L, 3), e4 = e(L, 4), e5 = e(L, 5), e6 = e(L, 6), e7 = opts.color ? e(L, 7) : 1;
    const deco = 1 - e5;
    rr(ctx, 80, 300, 920, 850, 24, mix('#F4F4F6', '#FFFFFF', e5));
    // header
    if (deco > 0) { ctx.save(); ctx.globalAlpha = deco; const g = ctx.createLinearGradient(80, 0, 1000, 0); g.addColorStop(0, '#00C2FF'); g.addColorStop(1, '#FF4D6D'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(80, 300, 920, 80, [24, 24, 0, 0]); ctx.fill(); txt(ctx, 'DASHBOARD!!', 120, 354, 34, { color: '#FFFFFF' }); ctx.restore(); }
    ctx.save(); ctx.globalAlpha = e5; txt(ctx, 'Store overview', 120, 354, 34, { color: '#111' }); rr(ctx, 790, 322, 180, 44, 22, '#F1F3F5'); txt(ctx, 'Last 7 days', 880, 351, 20, { color: '#333', align: 'center' }); ctx.restore();
    txt(ctx, 'DEMO DATA', 980, 296, 16, { w: 600, family: F.mono, color: '#888', align: 'right' });
    // ---- cluttered tiles (fade as KPI cards arrive)
    if (e3 < 1) {
      const tw = (920 - 48 - 36) / 4, th = 100;
      NOISE.forEach((t, i) => {
        let col = i % 4, row = Math.floor(i / 4);
        // principle 2: the important tile moves to the top-left
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
    // ---- KPI cards
    if (e3 > 0) {
      const cw = (920 - 48 - 36) / 4;
      KPI.forEach((k, i) => {
        const s = clamp(e3 * 1.6 - i * 0.15); if (s <= 0) return;
        const x = 104 + i * (cw + 12), y = 400;
        ctx.save(); ctx.globalAlpha = s; ctx.translate(x + cw / 2, y + 80); ctx.scale(lerp(0.85, 1, s), lerp(0.85, 1, s)); ctx.translate(-(x + cw / 2), -(y + 80));
        if (deco > 0) { ctx.fillStyle = `rgba(0,0,0,${0.22 * deco})`; ctx.fillRect(x + 6, y + 6, cw, 160); }
        rr(ctx, x, y, cw, 160, 16, '#FFFFFF', deco > 0.5 ? '#9AA4B2' : '#E6E8EC', lerp(1.5, 4, deco));
        if (deco > 0) { ctx.save(); ctx.globalAlpha = s * deco; ctx.fillStyle = ['#00C2FF', '#FFC300', '#FF4D6D', '#7CFC00'][i]; ctx.beginPath(); ctx.arc(x + cw - 34, y + 34, 18, 0, TAU); ctx.fill(); ctx.restore(); }
        txt(ctx, k.l, x + 20, y + 40, 20, { color: '#666' });
        txt(ctx, k.v, x + 20, y + 92, fit(ctx, k.v, 40, cw - 40), { color: '#111' });
        const up = k.d >= 0, dc = e7 > 0.5 ? (up ? '#1A7F45' : '#C62828') : ['#FF7AE0', '#00C2FF', '#FFC300', '#7CFC00'][i];
        txt(ctx, `${up ? '▲' : '▼'} ${Math.abs(k.d)}% vs last week`, x + 20, y + 128, fit(ctx, '▲ 00.0% vs last week', 17, cw - 40), { color: dc });
        spark(ctx, x + 20, y + 136, cw - 40, 18, k.spark, e7 > 0.5 ? ACC : dc, 2.5);
        ctx.restore();
      });
    }
    // ---- cluttered charts: pie + gauge (until principle 4)
    if (e4 < 1) {
      const a = 1 - e4;
      ctx.save(); ctx.globalAlpha = a;
      const cx = 300, cy = 950, R = 150; let ang = -Math.PI / 2; const tot = CATS.reduce((s, c) => s + c.v, 0);
      if (deco > 0) { ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(cx + 10, cy + 20, R, R * 0.9, 0, 0, TAU); ctx.fill(); }
      CATS.forEach((c, i) => { const da = (c.v / tot) * TAU; ctx.fillStyle = ['#FF4D6D', '#00C2FF', '#FFC300', '#7CFC00', '#FF7AE0'][i]; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, ang, ang + da); ctx.closePath(); ctx.fill(); ang += da; });
      txt(ctx, 'Sales by category', cx, cy - R - 20, 20, { color: '#555', align: 'center' });
      const gx = 760, gy = 1010; ctx.lineWidth = 34; ctx.lineCap = 'butt'; ctx.strokeStyle = '#E3E3E3'; ctx.beginPath(); ctx.arc(gx, gy, 140, Math.PI, 0); ctx.stroke();
      ctx.strokeStyle = '#FF4D6D'; ctx.beginPath(); ctx.arc(gx, gy, 140, Math.PI, Math.PI * 1.62); ctx.stroke(); txt(ctx, 'Trend?', gx, gy - 20, 30, { color: '#111', align: 'center' });
      ctx.restore();
    }
    // ---- clear charts: line (trend) + horizontal bars (compare)
    if (e4 > 0) {
      const a = Math.min(1, e4 * 1.4), lx = 104, ly = 600, lw = 520, lh = 300;
      ctx.save(); ctx.globalAlpha = a;
      rr(ctx, lx, ly, lw, lh, 16, '#FFFFFF', deco > 0.5 ? '#9AA4B2' : '#E6E8EC', lerp(1.5, 4, deco));
      txt(ctx, 'Revenue trend', lx + 24, ly + 44, 22, { color: '#111' });
      ctx.strokeStyle = deco > 0.5 ? '#C8CCD2' : '#F0F1F3'; ctx.lineWidth = deco > 0.5 ? 2 : 1; for (let g = 0; g < 4; g++) { ctx.beginPath(); ctx.moveTo(lx + 24, ly + 90 + g * 55); ctx.lineTo(lx + lw - 24, ly + 90 + g * 55); ctx.stroke(); }
      const n = Math.floor(clamp(e4 * 1.5) * (TREND.length - 1)) + 1, pts = TREND.slice(0, n);
      spark(ctx, lx + 24, ly + 80, (lw - 48) * ((pts.length - 1) / (TREND.length - 1) || 0.001), lh - 110, pts.length > 1 ? pts : [pts[0], pts[0]], ACC, 4);
      const bx = 640, by = 600, bw = 336;
      rr(ctx, bx, by, bw, lh, 16, '#FFFFFF', deco > 0.5 ? '#9AA4B2' : '#E6E8EC', lerp(1.5, 4, deco));
      txt(ctx, 'Top categories', bx + 24, by + 44, 22, { color: '#111' });
      CATS.forEach((c, i) => { const y = by + 76 + i * 44, w = (bw - 150) * c.v * clamp(e4 * 1.3 - i * 0.08); txt(ctx, c.n, bx + 24, y + 22, 17, { color: '#444' }); if (deco > 0) { ctx.fillStyle = `rgba(0,0,0,${0.25 * deco})`; ctx.fillRect(bx + 126 + 5, y + 6 + 5, w, 22); } rr(ctx, bx + 126, y + 6, w, 22, 4, e7 > 0.5 ? (i === 0 ? ACC : '#B9CFF5') : ['#FF4D6D', '#00C2FF', '#FFC300', '#7CFC00', '#FF7AE0'][i]); });
      ctx.restore();
      // table (details)
      ctx.save(); ctx.globalAlpha = a; rr(ctx, 104, 920, 872, 200, 16, '#FFFFFF', deco > 0.5 ? '#9AA4B2' : '#E6E8EC', lerp(1.5, 4, deco)); txt(ctx, 'Recent orders', 128, 962, 22, { color: '#111' });
      ['#1042 · Shoes', '#1041 · Bags', '#1040 · Watches'].forEach((o, i) => { const y = 1000 + i * 38; ctx.fillStyle = '#F0F1F3'; ctx.fillRect(128, y - 26, 824, 1); txt(ctx, o, 128, y, 18, { color: '#333' }); txt(ctx, ['Paid', 'Paid', 'Refunded'][i], 950, y, 18, { color: i === 2 ? '#C62828' : '#1A7F45', align: 'right' }); });
      ctx.restore();
    }
    // ---- principle 6: details on demand (tooltip)
    if (e6 > 0 && opts.tooltip !== false) {
      const k = 9, px = 128 + (472 / 13) * k, py = 680 + (190 - TREND[k] * 190);
      ctx.save(); ctx.globalAlpha = Math.min(1, e6 * 1.5); ctx.fillStyle = ACC; ctx.beginPath(); ctx.arc(px, py, 9, 0, TAU); ctx.fill();
      rr(ctx, px - 120, py - 108, 240, 84, 12, '#111'); txt(ctx, 'Day 10', px - 100, py - 74, 18, { color: '#BBB' }); txt(ctx, money(TREND[k] * 12000), px - 100, py - 44, 26, { color: '#FFF' });
      ctx.restore();
    }
  }

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
  const hover = (ctx, v) => { if (v >= 3 && v < 9) { const k = 9, px = 128 + (472 / 13) * k, py = 680 + (190 - TREND[k] * 190); const m = ez(v, 3, 4.2, E.inOutCubic); cursor(ctx, lerp(860, px + 6, m), lerp(1100, py + 6, m)); } };
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
