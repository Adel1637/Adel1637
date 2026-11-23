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
  // clear state = LIGHT (main example) with a DARK GRAY bonus (not black, as our dark-mode video recommends); DENSE, MONOCHROME (inspired by how Linear, Vercel and Stripe build their analytics):
  // near-black surfaces, hairline borders, colour only for meaning, one hero chart with the previous period
  // dashed for comparison, a dense metric strip with bar sparklines, compact lists. The "before" state is unchanged.
  // light theme (main example) and dark-gray theme (bonus): the same layout, only the surfaces change
  const PL = { bg: '#FFFFFF', line: '#E4E4E7', txt: '#18181B', dim: '#6B6B73', faint: '#A1A1AA', up: '#15803D', down: '#DC2626', surf: '#F4F4F5', grid: '#F0F0F2', mid: '#D4D4D8', seg: '#FFFFFF', xh: '#C4C4CA', fill: [24, 24, 27, 0.07] };
  const PD = { bg: '#26272C', line: '#3A3B42', txt: '#EEEEF0', dim: '#A3A3AC', faint: '#7A7A84', up: '#3DD68C', down: '#FF6166', surf: '#2E2F35', grid: '#33343B', mid: '#4A4B53', seg: '#44454D', xh: '#5A5B63', fill: [238, 238, 240, 0.14] };
  let BG, LINE, TXT, DIM, FAINT, UP, DOWN, SURF, GRID, MID, SEG, XH, FILL;
  function setTheme(th) {
    const m = (k) => mix(PL[k], PD[k], th);
    [BG, LINE, TXT, DIM, FAINT, UP, DOWN, SURF, GRID, MID, SEG, XH] = ['bg', 'line', 'txt', 'dim', 'faint', 'up', 'down', 'surf', 'grid', 'mid', 'seg', 'xh'].map(m);
    FILL = PL.fill.map((v, i) => v + (PD.fill[i] - v) * th);
  }
  const X0 = 110, X1 = 970;
  const plot = { x: X0 + 4, y: 520, w: X1 - X0 - 8, h: 180 };
  const PREV = TREND.map((p, i) => Math.max(0.08, p * 0.86 - 0.03 + 0.04 * Math.sin(i * 1.7)));
  const trendPoint = (k) => [plot.x + (k / (TREND.length - 1)) * plot.w, plot.y + plot.h - TREND[k] * plot.h];
  const T = (ctx, s, x, y, size, w, color, align = 'left', family = F.title) => txt(ctx, s, x, y, size, { w, color, align, family });
  function dash(ctx, L, v = 0, opts = {}) {
    const e1 = e(L, 1), e2 = e(L, 2), e3 = e(L, 3), e4 = e(L, 4), e5 = e(L, 5), e6 = e(L, 6), e7 = opts.color ? e(L, 7) : 1;
    const th = opts.theme || 0; setTheme(th);
    const deco = 1 - e5, dk = th;
    rr(ctx, 80, 300, 920, 850, 24, mix('#F4F4F6', BG, Math.max(e5, th)), e5 > 0.5 ? LINE : null, 1.5);
    // header: loud banner -> thin breadcrumb bar with period switch
    if (deco > 0) { ctx.save(); ctx.globalAlpha = deco; const g = ctx.createLinearGradient(80, 0, 1000, 0); g.addColorStop(0, '#00C2FF'); g.addColorStop(1, '#FF4D6D'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(80, 300, 920, 80, [24, 24, 0, 0]); ctx.fill(); txt(ctx, 'DASHBOARD!!', 120, 354, 34, { color: '#FFFFFF' }); ctx.restore(); }
    if (e5 > 0) {
      ctx.save(); ctx.globalAlpha = e5;
      T(ctx, 'Store', X0, 350, 17, 500, DIM); T(ctx, '/', X0 + 52, 350, 17, 400, FAINT); T(ctx, 'Analytics', X0 + 68, 350, 17, 600, TXT);
      const sx = X1 - 214; rr(ctx, sx, 326, 214, 36, 8, SURF, LINE, 1); rr(ctx, sx + 74, 329, 66, 30, 6, SEG, th < 0.5 ? LINE : null, 1);
      ['24h', '7d', '30d'].forEach((l, i) => T(ctx, l, sx + 37 + i * 70, 349, 14, i === 1 ? 600 : 500, i === 1 ? TXT : DIM, 'center', F.mono));
      ctx.fillStyle = LINE; ctx.fillRect(80, 380, 920, 1);
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
    // ---- hero metric (Stripe-like): big revenue, delta, and below it the chart (principle 4)
    if (e3 > 0) {
      const s = clamp(e3 * 1.5);
      ctx.save(); ctx.globalAlpha = s;
      const up = KPI[0].d >= 0; ctx.font = `600 54px ${F.title}`; const vw = ctx.measureText(KPI[0].v).width;
      ctx.font = `500 14px ${F.title}`; const sw = Math.max(ctx.measureText('vs previous 7d').width, 64);
      if (deco > 0) { // the boxed "before" card is sized to its content, so nothing crosses its border
        const bw = vw + 18 + sw + 56;
        ctx.save(); ctx.globalAlpha = s * deco; rr(ctx, X0 - 14, 396, bw, 116, 14, '#FFFFFF', '#9AA4B2', 4); ctx.fillStyle = '#00C2FF'; ctx.beginPath(); ctx.arc(X0 - 14 + bw - 30, 424, 14, 0, TAU); ctx.fill(); ctx.restore();
      }
      T(ctx, 'Gross revenue', X0, 426, 17, 500, DIM);
      T(ctx, KPI[0].v, X0, 486, 54, 600, TXT);
      T(ctx, `${up ? '+' : '−'}${Math.abs(KPI[0].d)}%`, X0 + vw + 18, 470, 18, 600, e7 > 0.5 ? (up ? UP : DOWN) : '#FF7AE0', 'left', F.mono); T(ctx, 'vs previous 7d', X0 + vw + 18, 492, 14, 500, FAINT);
      ctx.restore();
    }
    // ---- cluttered charts: pie + gauge (until principle 4)
    if (e4 < 0.35) {
      const a = 1 - clamp(e4 / 0.35);   // the messy charts leave before the clean ones settle in
      ctx.save(); ctx.globalAlpha = a;
      const cx = 300, cy = 950, R = 150; let ang = -Math.PI / 2; const tot = CATS.reduce((s2, c) => s2 + c.v, 0);
      if (deco > 0) { ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(cx + 10, cy + 20, R, R * 0.9, 0, 0, TAU); ctx.fill(); }
      CATS.forEach((c, i) => { const da = (c.v / tot) * TAU; ctx.fillStyle = ['#FF4D6D', '#00C2FF', '#FFC300', '#7CFC00', '#FF7AE0'][i]; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, ang, ang + da); ctx.closePath(); ctx.fill(); ang += da; });
      txt(ctx, 'Sales by category', cx, cy - R - 20, 20, { color: dk > 0.5 ? '#BBB' : '#555', align: 'center' });
      const gx = 760, gy = 1010; ctx.lineWidth = 34; ctx.lineCap = 'butt'; ctx.strokeStyle = '#E3E3E3'; ctx.beginPath(); ctx.arc(gx, gy, 140, Math.PI, 0); ctx.stroke();
      ctx.strokeStyle = '#FF4D6D'; ctx.beginPath(); ctx.arc(gx, gy, 140, Math.PI, Math.PI * 1.62); ctx.stroke(); txt(ctx, 'Trend?', gx, gy - 20, 30, { color: dk > 0.5 ? '#EEE' : '#111', align: 'center' });
      ctx.restore();
    }
    // ---- clear content: hero chart with previous period, dense metric strip, compact lists
    if (e4 > 0) {
      const a = clamp((e4 - 0.3) * 2), n = Math.max(2, Math.round(1 + clamp((e4 - 0.3) * 1.8) * (TREND.length - 1)));  // clean charts arrive once the pie is gone
      ctx.save(); ctx.globalAlpha = a;
      [0.25, 0.5, 0.75].forEach((g) => { ctx.fillStyle = GRID; ctx.fillRect(plot.x, plot.y + plot.h * g, plot.w, 1); });
      const P = (arr, i) => [plot.x + (i / (arr.length - 1)) * plot.w, plot.y + plot.h - arr[i] * plot.h];
      // previous period, dashed and faint
      ctx.setLineDash([5, 7]); ctx.strokeStyle = FAINT; ctx.lineWidth = 2; ctx.beginPath(); PREV.forEach((p, i) => { const [x, y] = P(PREV, i); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); ctx.setLineDash([]);
      // current period, with a soft fill
      const g = ctx.createLinearGradient(0, plot.y, 0, plot.y + plot.h); g.addColorStop(0, `rgba(${FILL[0]},${FILL[1]},${FILL[2]},${FILL[3]})`); g.addColorStop(1, `rgba(${FILL[0]},${FILL[1]},${FILL[2]},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(plot.x, plot.y + plot.h); for (let i = 0; i < n; i++) { const [x, y] = P(TREND, i); ctx.lineTo(x, y); } ctx.lineTo(P(TREND, n - 1)[0], plot.y + plot.h); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = e7 > 0.5 ? TXT : '#00C2FF'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.beginPath(); for (let i = 0; i < n; i++) { const [x, y] = P(TREND, i); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((d, i) => T(ctx, d, plot.x + (i / 6) * plot.w, plot.y + plot.h + 24, 13, 500, FAINT, i === 0 ? 'left' : i === 6 ? 'right' : 'center', F.mono));
      ctx.fillStyle = TXT; ctx.fillRect(X1 - 250, 424, 18, 2.5); T(ctx, 'This period', X1 - 226, 430, 13, 500, DIM); ctx.setLineDash([4, 4]); ctx.strokeStyle = FAINT; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X1 - 120, 425); ctx.lineTo(X1 - 102, 425); ctx.stroke(); ctx.setLineDash([]); T(ctx, 'Previous', X1 - 96, 430, 13, 500, DIM);
      // dense metric strip: one bordered row, hairline separators, bar sparklines
      const sy = 754, sh = 116, cw = (X1 - X0) / 3;
      rr(ctx, X0, sy, X1 - X0, sh, 10, SURF, deco > 0.5 ? '#6B7280' : LINE, deco > 0.5 ? 3 : 1);
      KPI.slice(1).forEach((k, i) => {
        const x = X0 + i * cw; if (i) { ctx.fillStyle = LINE; ctx.fillRect(x, sy + 14, 1, sh - 28); }
        if (deco > 0) { ctx.save(); ctx.globalAlpha = a * deco; ctx.fillStyle = ['#FFC300', '#FF4D6D', '#7CFC00'][i]; ctx.beginPath(); ctx.arc(x + cw - 30, sy + 28, 13, 0, TAU); ctx.fill(); ctx.restore(); }
        T(ctx, k.l, x + 20, sy + 32, 14, 500, DIM);
        T(ctx, k.v, x + 20, sy + 72, 30, 600, TXT);
        const up = k.d >= 0; T(ctx, `${up ? '+' : '−'}${Math.abs(k.d)}%`, x + 20, sy + 98, 13, 600, e7 > 0.5 ? (up ? UP : DOWN) : ['#FFC300', '#FF4D6D', '#7CFC00'][i], 'left', F.mono);
        k.spark.forEach((p, j) => { const bw = 6, bx = x + cw - 110 + j * 8, bh = 8 + p * 34; ctx.fillStyle = j === 11 ? TXT : MID; ctx.fillRect(bx, sy + 98 - bh, bw, bh); });
      });
      // compact lists: categories (inline bars) and recent orders (status dots, relative time)
      const ly = 892;
      T(ctx, 'Top categories', X0, ly + 18, 15, 600, TXT); T(ctx, 'Recent orders', 560, ly + 18, 15, 600, TXT);
      ctx.fillStyle = LINE; ctx.fillRect(X0, ly + 32, 410, 1); ctx.fillRect(560, ly + 32, X1 - 560, 1);
      const tot = CATS.reduce((s2, c) => s2 + c.v, 0);
      CATS.slice(0, 4).forEach((c, i) => { const y = ly + 50 + i * 50, pct = Math.round((c.v / tot) * 100), w = 410 * (c.v / CATS[0].v) * clamp(e4 * 1.3 - i * 0.08); ctx.fillStyle = e7 > 0.5 ? (i === 0 ? MID : SURF) : ['#FF4D6D', '#00C2FF', '#FFC300', '#7CFC00'][i]; ctx.beginPath(); ctx.roundRect(X0, y, w, 38, 6); ctx.fill(); T(ctx, c.n, X0 + 14, y + 25, 15, 500, TXT); T(ctx, `${pct}%`, X0 + 400, y + 25, 14, 600, DIM, 'right', F.mono); });
      [['#1042', money(r2(1)), 'Paid', '2m'], ['#1041', money(r2(2)), 'Paid', '9m'], ['#1040', money(r2(3)), 'Refunded', '14m'], ['#1039', money(r2(4)), 'Paid', '21m']].forEach(([o, amt, st, t], i) => {
        const y = ly + 72 + i * 50, ok = st === 'Paid';
        ctx.fillStyle = e7 > 0.5 ? (ok ? UP : DOWN) : '#FF7AE0'; ctx.beginPath(); ctx.arc(566, y - 5, 4.5, 0, TAU); ctx.fill();
        T(ctx, o, 582, y, 15, 500, TXT, 'left', F.mono); T(ctx, st, 680, y, 14, 500, DIM); T(ctx, amt, X1 - 56, y, 15, 600, TXT, 'right', F.mono); T(ctx, t, X1, y, 13, 500, FAINT, 'right', F.mono);
      });
      ctx.restore();
    }
    // ---- principle 6: details on demand (crosshair + compact tooltip comparing both periods)
    if (e6 > 0 && opts.tooltip !== false) {
      const k = 9, [px, py] = trendPoint(k), prevY = plot.y + plot.h - PREV[k] * plot.h;
      ctx.save(); ctx.globalAlpha = Math.min(1, e6 * 1.5);
      ctx.fillStyle = XH; ctx.fillRect(px, plot.y, 1, plot.h);
      ctx.fillStyle = TXT; ctx.beginPath(); ctx.arc(px, py, 5, 0, TAU); ctx.fill(); ctx.fillStyle = FAINT; ctx.beginPath(); ctx.arc(px, prevY, 4, 0, TAU); ctx.fill();
      rr(ctx, px + 14, plot.y + 8, 210, 92, 10, mix('#FFFFFF', '#33343B', th), MID, 1);
      T(ctx, 'Fri, this week', px + 28, plot.y + 34, 13, 500, DIM); T(ctx, money(TREND[k] * 12000), px + 210, plot.y + 34, 14, 600, TXT, 'right', F.mono);
      T(ctx, 'Fri, previous', px + 28, plot.y + 62, 13, 500, FAINT); T(ctx, money(PREV[k] * 12000), px + 210, plot.y + 62, 14, 600, DIM, 'right', F.mono);
      const ch = Math.round((TREND[k] / PREV[k] - 1) * 100); T(ctx, `${ch >= 0 ? '+' : '−'}${Math.abs(ch)}%`, px + 210, plot.y + 88, 13, 600, ch >= 0 ? UP : DOWN, 'right', F.mono);
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
  function bonus(Lmax, color) {
    return {
      draw(ctx, v) {
        const th = ez(v, 3.6, 5.4, E.inOutCubic);
        dash(ctx, Lmax, v, { color, theme: th });
        const p = spr(v, 2.6, { stiffness: 280, damping: 14 }); if (p <= 0) return;
        ctx.save(); ctx.translate(540, 250); ctx.scale(p, p);
        rr(ctx, -150, -34, 300, 68, 34, '#2E2F35', '#4A4B53', 2);
        txt(ctx, 'Light', -96, 9, 22, { w: 600, color: th < 0.5 ? '#FFFFFF' : '#8B8B93', align: 'center' }); txt(ctx, 'Dark', 96, 9, 22, { w: 600, color: th >= 0.5 ? '#FFFFFF' : '#8B8B93', align: 'center' });
        rr(ctx, -40, -20, 80, 40, 20, mix('#D4D4D8', '#5B8DEF', th)); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(lerp(-20, 20, th), 0, 15, 0, TAU); ctx.fill();
        ctx.restore();
      },
      hits: [[2.6, 'toggle', 'pop', { pitch: 'A5' }], [3.6, 'switch', 'click'], [3.7, 'to dark', 'whoosh', { len: 0.6 }]],
    };
  }
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
  return { steps, recapVig, dash, bonus };
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
  items.push({ title: ['BONUS:', 'DARK MODE.'], ar: 'إضافة: الوضع الداكن.', en: 'SAME LAYOUT. DARK GRAY, NOT BLACK.', vig: D.bonus(long ? 7 : 6, long), tip: 'KEEP THE HIERARCHY, ONLY THE SURFACES CHANGE.', tipAr: 'حافظ على التسلسل نفسه، وغيّر الأسطح فقط.', tipAt: 9.5 });
  return {
    fonts: ['400 20px Plex', '500 20px Plex', '600 20px Plex'],
    hook: { lines: [`${n} UI/UX PRINCIPLES`, 'FOR DASHBOARDS.'], ar: `${n === 7 ? 'سبعة' : 'ستة'} مبادئ UI/UX لتصميم لوحات التحكم.`, en: 'FROM CLUTTERED TO CLEAR, STEP BY STEP.', tags: ['KPI', 'Chart', 'Filter', 'Trend', 'Table', 'Alert'] },
    items,
    label: (i) => (i < n ? `PRINCIPLE 0${i + 1} / 0${n}` : 'BONUS'),
    recap: { title: ['CLUTTERED', 'TO CLEAR.'], ar: 'من الفوضى إلى الوضوح.', en: 'QUESTION · LAYOUT · KPIS · CHARTS · NO DECOR · DETAILS', vig: D.recapVig },
    cover: {
      lines: ['UI/UX', 'PRINCIPLES FOR', 'DASHBOARDS.'], ar: 'مبادئ UI/UX لتصميم لوحات التحكم',
      art: (ctx, x, y, w, h) => { const s = Math.min(w / 920, h / 850); ctx.save(); ctx.translate(x + (w - 920 * s) / 2, y + 10); ctx.scale(s, s); ctx.translate(-80, -300); D.dash(ctx, 7, 0, { color: true, tooltip: false }); ctx.restore(); },
    },
  };
}
