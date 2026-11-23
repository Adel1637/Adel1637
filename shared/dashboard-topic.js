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
  // modern clear state: slim sidebar, top bar, KPI cards with delta pills and area sparklines, area chart with a
  // segmented control, category bars with values, orders table with avatars and status badges. Flat, 1px borders.
  const CX = 164, CW = 816;                                   // content area of the clear dashboard (right of the sidebar)
  const RC = { x: CX, y: 566, w: 488, h: 310 };               // revenue chart card
  const plot = { x: RC.x + 56, y: RC.y + 110, w: RC.w - 80, h: 150 };
  const trendPoint = (k) => [plot.x + (k / (TREND.length - 1)) * plot.w, plot.y + plot.h - TREND[k] * plot.h];
  const T = (ctx, s, x, y, size, w, color, align = 'left', alpha = 1) => txt(ctx, s, x, y, size, { w, color, align, alpha });
  const card = (ctx, x, y, w, h, deco) => { if (deco > 0) { ctx.fillStyle = `rgba(0,0,0,${0.22 * deco})`; ctx.fillRect(x + 6, y + 6, w, h); } rr(ctx, x, y, w, h, 14, '#FFFFFF', deco > 0.5 ? '#9AA4B2' : '#E6E8EC', lerp(1, 4, deco)); };
  function areaLine(ctx, pts, x, y, w, h, col, frac = 1, fill = true) {
    const n = Math.max(2, Math.round(1 + frac * (pts.length - 1))), P = pts.slice(0, n).map((p, i) => [x + (i / (pts.length - 1)) * w, y + h - p * h]);
    if (fill) { const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, 'rgba(47,124,246,0.22)'); g.addColorStop(1, 'rgba(47,124,246,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(P[0][0], y + h); P.forEach(([px, py]) => ctx.lineTo(px, py)); ctx.lineTo(P[P.length - 1][0], y + h); ctx.closePath(); ctx.fill(); }
    ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath(); P.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.stroke();
  }
  function dash(ctx, L, v = 0, opts = {}) {
    const e1 = e(L, 1), e2 = e(L, 2), e3 = e(L, 3), e4 = e(L, 4), e5 = e(L, 5), e6 = e(L, 6), e7 = opts.color ? e(L, 7) : 1;
    const deco = 1 - e5;
    rr(ctx, 80, 300, 920, 850, 24, mix('#F4F4F6', '#F7F8FA', e5));
    // sidebar (arrives with the KPI cards)
    if (e3 > 0) {
      ctx.save(); ctx.globalAlpha = Math.min(1, e3 * 1.5); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.roundRect(80, 300, 72, 850, [24, 0, 0, 24]); ctx.fill(); ctx.fillStyle = '#EAECF0'; ctx.fillRect(152, 300, 1, 850);
      rr(ctx, 98, 318, 36, 36, 10, '#111'); ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.moveTo(108, 344); ctx.lineTo(116, 328); ctx.lineTo(124, 344); ctx.fill();
      [0, 1, 2, 3, 4].forEach((i) => { const y = 400 + i * 64; if (i === 0) rr(ctx, 96, y - 4, 40, 40, 10, '#EAF1FE'); ctx.strokeStyle = i === 0 ? ACC : '#98A2B3'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.beginPath(); if (i === 0) { ctx.rect(106, y + 6, 8, 8); ctx.rect(118, y + 6, 8, 8); ctx.rect(106, y + 18, 8, 8); ctx.rect(118, y + 18, 8, 8); } else if (i === 1) { ctx.moveTo(105, y + 10); ctx.lineTo(127, y + 10); ctx.lineTo(124, y + 24); ctx.lineTo(108, y + 24); ctx.closePath(); } else if (i === 2) { ctx.rect(106, y + 6, 20, 20); ctx.moveTo(106, y + 13); ctx.lineTo(126, y + 13); } else if (i === 3) { ctx.arc(116, y + 12, 6, 0, TAU); ctx.moveTo(105, y + 30); ctx.arc(116, y + 30, 11, Math.PI, 0); } else { ctx.arc(116, y + 16, 9, 0, TAU); } ctx.stroke(); });
      ctx.restore();
    }
    // header: loud gradient banner -> modern top bar
    if (deco > 0) { ctx.save(); ctx.globalAlpha = deco; const g = ctx.createLinearGradient(80, 0, 1000, 0); g.addColorStop(0, '#00C2FF'); g.addColorStop(1, '#FF4D6D'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(80, 300, 920, 80, [24, 24, 0, 0]); ctx.fill(); txt(ctx, 'DASHBOARD!!', 120, 354, 34, { color: '#FFFFFF' }); ctx.restore(); }
    if (e5 > 0) {
      ctx.save(); ctx.globalAlpha = e5;
      T(ctx, 'Overview', CX + 8, 346, 30, 700, '#101828'); T(ctx, 'Last 7 days · updated just now', CX + 8, 374, 15, 400, '#667085');
      rr(ctx, 640, 322, 230, 44, 22, '#FFFFFF', '#E4E7EC', 1); ctx.strokeStyle = '#98A2B3'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(664, 343, 7, 0, TAU); ctx.moveTo(669, 348); ctx.lineTo(675, 354); ctx.stroke(); T(ctx, 'Search', 684, 350, 16, 400, '#98A2B3');
      ctx.fillStyle = '#D6E4FD'; ctx.beginPath(); ctx.arc(950, 344, 22, 0, TAU); ctx.fill(); T(ctx, 'AG', 950, 350, 15, 600, '#1D4ED8', 'center');
      ctx.restore();
    }
    txt(ctx, 'DEMO DATA', 980, 296, 16, { w: 600, family: F.mono, color: '#888', align: 'right' });
    // ---- cluttered tiles (unchanged "before" state; fade as the KPI cards arrive)
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
    // ---- KPI cards (modern): label, big value, delta pill, area sparkline
    if (e3 > 0) {
      const cw = (CW - 36) / 4;
      KPI.forEach((k, i) => {
        const s = clamp(e3 * 1.6 - i * 0.15); if (s <= 0) return;
        const x = CX + i * (cw + 12), y = 394, h = 158;
        ctx.save(); ctx.globalAlpha = s; ctx.translate(x + cw / 2, y + h / 2); ctx.scale(lerp(0.85, 1, s), lerp(0.85, 1, s)); ctx.translate(-(x + cw / 2), -(y + h / 2));
        card(ctx, x, y, cw, h, deco);
        if (deco > 0) { ctx.save(); ctx.globalAlpha = s * deco; ctx.fillStyle = ['#00C2FF', '#FFC300', '#FF4D6D', '#7CFC00'][i]; ctx.beginPath(); ctx.arc(x + cw - 30, y + 30, 16, 0, TAU); ctx.fill(); ctx.restore(); }
        T(ctx, k.l, x + 18, y + 34, 15, 500, '#667085');
        T(ctx, k.v, x + 18, y + 78, fit(ctx, k.v, 32, cw - 36), 700, '#101828');
        const up = k.d >= 0, good = e7 > 0.5, fg = good ? (up ? '#067647' : '#B42318') : ['#FF7AE0', '#00C2FF', '#FFC300', '#7CFC00'][i], bg = good ? (up ? '#ECFDF3' : '#FEF3F2') : '#F2F4F7';
        const pt = `${up ? '↑' : '↓'} ${Math.abs(k.d)}%`; ctx.font = `600 13px ${F.title}`; const pw = ctx.measureText(pt).width + 16;
        rr(ctx, x + 18, y + 90, pw, 24, 12, bg); T(ctx, pt, x + 26, y + 107, 13, 600, fg); T(ctx, 'vs last week', x + 26 + pw, y + 107, 12, 400, '#98A2B3');
        ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, cw, h, 14); ctx.clip(); areaLine(ctx, k.spark, x, y + 122, cw, 34, good ? ACC : fg, 1, true); ctx.restore();
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
    // ---- clear charts (modern)
    if (e4 > 0) {
      const a = Math.min(1, e4 * 1.4);
      ctx.save(); ctx.globalAlpha = a;
      // revenue area chart with segmented control
      card(ctx, RC.x, RC.y, RC.w, RC.h, deco);
      T(ctx, 'Revenue', RC.x + 20, RC.y + 36, 16, 600, '#101828'); T(ctx, KPI[0].v, RC.x + 20, RC.y + 76, 30, 700, '#101828');
      const sx = RC.x + RC.w - 196; rr(ctx, sx, RC.y + 18, 176, 36, 10, '#F2F4F7'); rr(ctx, sx + 3, RC.y + 21, 56, 30, 8, '#FFFFFF', '#E4E7EC', 1);
      ['7D', '30D', '90D'].forEach((l, i) => T(ctx, l, sx + 31 + i * 58, RC.y + 42, 14, i ? 500 : 600, i ? '#667085' : '#101828', 'center'));
      ctx.strokeStyle = '#EEF0F3'; ctx.lineWidth = 1; ctx.setLineDash([4, 6]);
      [0, 1, 2, 3].forEach((g) => { const y = plot.y + (g / 3) * plot.h; ctx.beginPath(); ctx.moveTo(plot.x, y); ctx.lineTo(plot.x + plot.w, y); ctx.stroke(); T(ctx, `${(3 - g) * 4}k`, plot.x - 12, y + 4, 11, 500, '#98A2B3', 'right'); });
      ctx.setLineDash([]);
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((d, i) => T(ctx, d, plot.x + (i / 6) * plot.w, plot.y + plot.h + 24, 11, 500, '#98A2B3', 'center'));
      areaLine(ctx, TREND, plot.x, plot.y, plot.w, plot.h, ACC, clamp(e4 * 1.5), true);
      // top categories with tracks and values
      const bx = RC.x + RC.w + 12, bw = CX + CW - bx, tot = CATS.reduce((s2, c) => s2 + c.v, 0);
      card(ctx, bx, RC.y, bw, RC.h, deco); T(ctx, 'Top categories', bx + 20, RC.y + 36, 16, 600, '#101828');
      CATS.forEach((c, i) => {
        const y = RC.y + 70 + i * 46, pct = Math.round((c.v / tot) * 100), w = (bw - 40) * c.v * clamp(e4 * 1.3 - i * 0.08);
        T(ctx, c.n, bx + 20, y + 14, 13, 500, '#344054'); T(ctx, `${pct}%`, bx + bw - 20, y + 14, 13, 600, '#101828', 'right');
        rr(ctx, bx + 20, y + 22, bw - 40, 8, 4, '#EEF2F7');
        if (deco > 0) { ctx.fillStyle = `rgba(0,0,0,${0.25 * deco})`; ctx.fillRect(bx + 24, y + 26, w, 8); }
        rr(ctx, bx + 20, y + 22, w, 8, 4, e7 > 0.5 ? (i === 0 ? ACC : '#9DBDF8') : ['#FF4D6D', '#00C2FF', '#FFC300', '#7CFC00', '#FF7AE0'][i]);
      });
      // orders table: avatars, status badges, right-aligned amounts
      const ty = RC.y + RC.h + 14, th = 1140 - ty;
      card(ctx, CX, ty, CW, th, deco); T(ctx, 'Recent orders', CX + 20, ty + 34, 16, 600, '#101828'); T(ctx, 'View all', CX + CW - 20, ty + 34, 14, 600, ACC, 'right');
      ['ORDER', 'CUSTOMER', 'STATUS', 'AMOUNT'].forEach((h, i) => T(ctx, h, [CX + 20, CX + 170, CX + 520, CX + CW - 20][i], ty + 66, 11, 600, '#98A2B3', i === 3 ? 'right' : 'left'));
      const ORD = [['#1042', 'Sara M.', 'Paid', money(r2(1)), '#D6E4FD'], ['#1041', 'Omar K.', 'Paid', money(r2(2)), '#DCFAE6'], ['#1040', 'Lina B.', 'Refunded', money(r2(3)), '#FEE4E2']];
      ORD.forEach(([o, n, st, amt, av], i) => {
        const y = ty + 80 + i * 50; ctx.fillStyle = '#F2F4F7'; ctx.fillRect(CX + 20, y, CW - 40, 1);
        T(ctx, o, CX + 20, y + 32, 14, 500, '#344054'); ctx.fillStyle = av; ctx.beginPath(); ctx.arc(CX + 184, y + 26, 14, 0, TAU); ctx.fill(); T(ctx, n[0], CX + 184, y + 31, 12, 600, '#344054', 'center'); T(ctx, n, CX + 206, y + 32, 14, 500, '#101828');
        const ok = st === 'Paid'; ctx.font = `600 12px ${F.title}`; const bw2 = ctx.measureText(st).width + 26; rr(ctx, CX + 520, y + 13, bw2, 24, 12, ok ? '#ECFDF3' : '#FEF3F2'); ctx.fillStyle = ok ? '#17B26A' : '#F04438'; ctx.beginPath(); ctx.arc(CX + 530, y + 25, 3.5, 0, TAU); ctx.fill(); T(ctx, st, CX + 538, y + 30, 12, 600, ok ? '#067647' : '#B42318');
        T(ctx, amt, CX + CW - 20, y + 32, 14, 600, '#101828', 'right');
      });
      ctx.restore();
    }
    // ---- principle 6: details on demand (modern tooltip)
    if (e6 > 0 && opts.tooltip !== false) {
      const k = 9, [px, py] = trendPoint(k);
      ctx.save(); ctx.globalAlpha = Math.min(1, e6 * 1.5);
      ctx.strokeStyle = '#D0D5DD'; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(px, plot.y); ctx.lineTo(px, plot.y + plot.h); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(47,124,246,0.18)'; ctx.beginPath(); ctx.arc(px, py, 14, 0, TAU); ctx.fill(); ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(px, py, 7, 0, TAU); ctx.fill(); ctx.strokeStyle = ACC; ctx.lineWidth = 3; ctx.stroke();
      ctx.shadowColor = 'rgba(16,24,40,0.18)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; rr(ctx, px - 96, py - 98, 192, 76, 12, '#FFFFFF'); ctx.shadowColor = 'transparent';
      T(ctx, 'Friday', px - 80, py - 70, 13, 500, '#667085'); T(ctx, money(TREND[k] * 12000), px - 80, py - 40, 22, 700, '#101828');
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
