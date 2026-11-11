// Fictional interfaces for the "UI foundations" Shorts 2-6 (never a real product). Pure functions of st.
// Each mockup: { w, h, R (regions), draw(ctx, st), bg, ox?, oy? }.
// st.p = 5 values, 0 = the mistake -> 1 = the fix, in the order of the Short. st.px = 1 / camera scale.
// st.bad / st.good: [{ r: [x, y, w, h], p }] red cross / green check. st.sec: local seconds (motion demos).
export function makeFoundMockups(M, A) {
  const { lerp, clamp, E, rrect, mix, TAU } = M;
  const { C, F } = A;
  const BRAND = '#6D4AFF', TINT = '#EFEBFF', G1 = '#6B7280', G2 = '#9CA3AF', G3 = '#E5E7EB', G4 = '#F3F4F6';

  // ---------------------------------------------------------------- helpers
  const T = (ctx, s, x, y, size, weight, color, align = 'left', alpha = 1, family = F.latin) => {
    if (alpha <= 0.001) return;
    ctx.save(); ctx.globalAlpha *= alpha; ctx.font = `${Math.round(weight)} ${size}px ${family}`;
    ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(s, x, y); ctx.restore();
  };
  const box = (ctx, x, y, w, h, r, fill, stroke = null, lw = 1) => {
    rrect(ctx, x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); }
  };
  function para(ctx, str, x, y, maxW, size, weight, color, lh) {
    ctx.font = `${weight} ${size}px ${F.latin}`;
    const lines = []; let cur = '';
    for (const w of str.split(' ')) { const t = cur ? cur + ' ' + w : w; if (cur && ctx.measureText(t).width > maxW) { lines.push(cur); cur = w; } else cur = t; }
    if (cur) lines.push(cur);
    lines.forEach((l, i) => T(ctx, l, x, y + i * size * lh, size, weight, color));
    return y + (lines.length - 1) * size * lh;
  }
  const tag = (ctx, s, x, y, ok, px) => { // small measurement label
    const col = ok ? C.blue : C.red;
    ctx.save(); ctx.font = `800 ${15 * px}px ${F.latin}`; const w = ctx.measureText(s).width + 12 * px;
    box(ctx, x - w / 2, y - 14 * px, w, 22 * px, 6 * px, col); T(ctx, s, x, y + 2 * px, 15 * px, 800, C.white, 'center'); ctx.restore();
  };
  function marks(ctx, st) {
    const px = st.px || 1;
    (st.bad || []).forEach(({ r: [x, y, w, h], p }) => {
      if (p <= 0) return;
      ctx.save(); ctx.globalAlpha = clamp(p * 1.5);
      ctx.fillStyle = 'rgba(217,45,32,0.06)'; rrect(ctx, x, y, w, h, 12 * px); ctx.fill();
      ctx.setLineDash([10 * px, 7 * px]); ctx.lineWidth = 3.5 * px; ctx.strokeStyle = C.red; rrect(ctx, x, y, w, h, 12 * px); ctx.stroke(); ctx.setLineDash([]);
      const s = 34 * px * E.outBack(clamp(p)), cx = x + w, cy = y, k = s * 0.2;
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(cx, cy, s / 2, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.white; ctx.lineWidth = 4 * px; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(cx - k, cy - k); ctx.lineTo(cx + k, cy + k); ctx.moveTo(cx + k, cy - k); ctx.lineTo(cx - k, cy + k); ctx.stroke();
      ctx.restore();
    });
    (st.good || []).forEach(({ r: [x, y, w, h], p }) => {
      if (p <= 0) return;
      ctx.save(); ctx.globalAlpha = clamp(p * 1.5);
      ctx.lineWidth = 3.5 * px; ctx.strokeStyle = C.green; rrect(ctx, x, y, w, h, 12 * px); ctx.stroke();
      const s = 38 * px * E.outBack(clamp(p)), cx = x + w, cy = y, k = s * 0.22;
      ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(cx, cy, s / 2, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.white; ctx.lineWidth = 4.5 * px; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(cx - k, cy); ctx.lineTo(cx - k * 0.25, cy + k * 0.75); ctx.lineTo(cx + k, cy - k * 0.7); ctx.stroke();
      ctx.restore();
    });
  }
  const K = (st) => (st.p || [0, 0, 0, 0, 0]).map((v) => clamp(v));
  const nav = (ctx, dark = false) => {
    ctx.fillStyle = BRAND; ctx.beginPath(); ctx.arc(52, 44, 14, 0, TAU); ctx.fill();
    T(ctx, 'Product', 76, 52, 22, 800, dark ? '#F3F4F6' : C.ink);
    ['Overview', 'Projects', 'Team', 'Settings'].forEach((l, i) => T(ctx, l, 420 + i * 110, 50, 16, 600, dark ? '#9CA3AF' : G1));
    ctx.fillStyle = dark ? '#262A33' : G3; ctx.fillRect(0, 86, 960, 1);
  };

  // ================================================================ 2. SPACING & LAYOUT (960 x 1300)
  const spacing = {
    w: 960, h: 1300, bg: C.white,
    R: { form: [44, 110, 540, 420], cards: [28, 556, 904, 270], text: [28, 860, 904, 360] },
    draw(ctx, st) {
      const [k1, k2, k3, k4, k5] = K(st), px = st.px || 1;
      ctx.fillStyle = C.white; ctx.fillRect(0, 0, 960, 1300); nav(ctx);
      // form: labels far from their input, every gap equal -> label close, groups apart
      const e2 = E.inOutCubic(k2), gL = lerp(14, 8, e2), gG = lerp(14, 36, e2);
      T(ctx, 'Profile', 60, 156, 30, 800, C.ink);
      let y = 196;
      ['Full name', 'Email', 'Company'].forEach((l, i) => {
        T(ctx, l, 60, y + 14, 15, 700, G1);
        const iy = y + 14 + gL;
        box(ctx, 60, iy, 440, 48, 10, C.white, G3, 1.5); T(ctx, ['Sara Ben Ali', 'sara@email.com', 'Northfield'][i], 76, iy + 30, 16, 500, C.ink);
        if (st.gapsForm > 0 && i === 0) { ctx.save(); ctx.globalAlpha = clamp(st.gapsForm); tag(ctx, String(Math.round(gL)), 530, y + 20, k2 > 0.5, px); tag(ctx, String(Math.round(gG)), 530, iy + 48 + gG / 2 + 6, k2 > 0.5, px); ctx.restore(); }
        y = iy + 48 + gG;
      });
      box(ctx, 60, y, 160, 50, 12, BRAND); T(ctx, 'Save', 140, y + 32, 17, 700, C.white, 'center');
      box(ctx, 640, 130, 272, 330, 20, G4); ctx.fillStyle = TINT; ctx.beginPath(); ctx.arc(776, 250, 64, 0, TAU); ctx.fill();
      box(ctx, 690, 350, 172, 16, 8, G3); box(ctx, 716, 380, 120, 12, 6, G3);
      // cards: random widths and paddings -> 12-column grid, 24 px padding
      const e3 = E.inOutCubic(k3), before = [[40, 580, 250, 214], [300, 596, 336, 200], [646, 574, 260, 226]], after = [[48, 580, 272, 220], [344, 580, 272, 220], [640, 580, 272, 220]];
      if (st.grid > 0) {
        ctx.save(); ctx.globalAlpha = clamp(st.grid);
        for (let c = 0; c < 12; c++) { ctx.fillStyle = k3 > 0.5 ? 'rgba(47,91,255,0.10)' : 'rgba(217,45,32,0.08)'; ctx.fillRect(48 + c * 74, 560, 50, 260); }
        ctx.restore();
      }
      const pads = [8, 18, 6].map((p) => lerp(p, 24, E.inOutCubic(k1)));
      before.forEach((b, i) => {
        const [x, yy, w, h] = b.map((v, j) => lerp(v, after[i][j], e3)), pd = pads[i];
        box(ctx, x, yy, w, h, 16, G4, G3, 1.5);
        box(ctx, x + pd, yy + pd, 44, 44, 12, TINT); ctx.fillStyle = BRAND; ctx.beginPath(); ctx.arc(x + pd + 22, yy + pd + 22, 9, 0, TAU); ctx.fill();
        T(ctx, ['Plan', 'Track', 'Share'][i], x + pd, yy + pd + 82, 20, 800, C.ink);
        para(ctx, ['Set goals for every project.', 'See progress at a glance.', 'Invite your team in one click.'][i], x + pd, yy + pd + 112, w - pd * 2, 15, 500, G1, 1.45);
        if (st.pad > 0) { ctx.save(); ctx.globalAlpha = clamp(st.pad); tag(ctx, String(Math.round(pd)), x + pd / 2 + 2, yy + pd / 2 + 4, k1 > 0.5, px); ctx.restore(); }
      });
      // text block: three different left edges + a very wide paragraph -> one edge, max width
      const e4 = E.inOutCubic(k4), xs = [76, 52, 68].map((v) => lerp(v, 60, e4));
      T(ctx, 'Built for small teams', xs[0], 920, 32, 800, C.ink);
      const pb = para(ctx, 'Product keeps projects, tasks and people in one calm place, so your team can stop chasing updates and start shipping the work that matters this week.', xs[1], 966, lerp(870, 560, E.inOutCubic(k5)), 17, 500, G1, 1.6);
      box(ctx, xs[2], pb + 30, 180, 50, 12, null, BRAND, 2); T(ctx, 'Learn more', xs[2] + 90, pb + 62, 16, 700, BRAND, 'center');
      if (st.guide > 0) {
        ctx.save(); ctx.globalAlpha = clamp(st.guide);
        ctx.strokeStyle = k4 > 0.5 ? C.blue : C.red; ctx.lineWidth = 2.5 * px; ctx.setLineDash([8 * px, 6 * px]);
        (k4 > 0.5 ? [60] : xs).forEach((x) => { ctx.beginPath(); ctx.moveTo(x, 880); ctx.lineTo(x, 1200); ctx.stroke(); });
        ctx.restore();
      }
      if (st.maxw > 0) { ctx.save(); ctx.globalAlpha = clamp(st.maxw); const w = lerp(870, 560, E.inOutCubic(k5)); ctx.fillStyle = k5 > 0.5 ? C.blue : C.red; ctx.fillRect(xs[1], 940, w, 3 * px); tag(ctx, k5 > 0.5 ? 'max 560' : '870', xs[1] + w / 2, 934, k5 > 0.5, px); ctx.restore(); }
      marks(ctx, st);
    },
  };

  // ================================================================ 3. DARK MODE & ACCESSIBILITY (960 x 1300)
  const ROWS = [['Northfield Studio', '$1,240', true], ['Blue Harbor', '$860', false], ['Cedar & Co', '$2,100', true], ['Lumen Labs', '$430', false], ['Atlas Goods', '$1,780', true]];
  const darkA11y = {
    w: 960, h: 1300, bg: '#000000',
    R: { list: [30, 206, 900, 520], status: [690, 206, 240, 520], search: [44, 112, 620, 74], surface: [30, 206, 900, 520], chart: [44, 830, 872, 380] },
    draw(ctx, st) {
      const [k1, k2, k3, k4, k5] = K(st), px = st.px || 1;
      const bg = mix('#000000', '#121318', k4), surf = mix('#000000', '#1C1E24', k4), line = mix('#1F2937', '#2A2E37', k4);
      const t1 = mix('#4B5563', '#F3F4F6', k1), t2 = mix('#374151', '#A1A1AA', k1);
      const acc = mix('#8B2CFF', '#A78BFA', k5), green = mix('#00FF6A', '#4ADE80', k5), red = mix('#FF0033', '#F87171', k5);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, 960, 1300);
      ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(52, 44, 14, 0, TAU); ctx.fill();
      T(ctx, 'Invoices', 76, 52, 22, 800, t1); ctx.fillStyle = line; ctx.fillRect(0, 86, 960, 1);
      // search field, focused: no ring -> visible ring
      box(ctx, 60, 122, 580, 54, 12, surf, line, 1.5);
      T(ctx, 'Search clients', 100, 156, 17, 500, t2);
      ctx.fillStyle = t1; ctx.fillRect(236, 136, 2, 26);
      if (k3 > 0) { ctx.save(); ctx.globalAlpha = k3; ctx.lineWidth = 3.5; ctx.strokeStyle = acc; rrect(ctx, 54, 116, 592, 66, 15); ctx.stroke(); ctx.restore(); }
      box(ctx, 680, 122, 220, 54, 12, acc); T(ctx, 'New invoice', 790, 156, 17, 700, mix('#000000', '#14111F', k5), 'center');
      // rows: status by color only -> color + icon + word
      ROWS.forEach(([n, a, ok], i) => {
        const y = 216 + i * 100;
        box(ctx, 44, y, 872, 86, 14, surf, k4 < 0.5 ? line : null, 1.5);
        T(ctx, n, 72, y + 38, 19, 700, t1); T(ctx, 'Due Nov 28', 72, y + 64, 15, 500, t2);
        T(ctx, a, 640, y + 50, 19, 700, t1, 'right');
        const col = ok ? green : red;
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(lerp(860, 722, k2), y + 43, 9, 0, TAU); ctx.fill();
        if (k2 > 0) {
          ctx.save(); ctx.globalAlpha = k2;
          box(ctx, 704, y + 24, 190, 38, 19, mix(surf, col, 0.16));
          ctx.strokeStyle = bg; ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.beginPath();
          if (ok) { ctx.moveTo(717, y + 43); ctx.lineTo(721, y + 47); ctx.lineTo(728, y + 39); } else { ctx.moveTo(722, y + 37); ctx.lineTo(722, y + 45); ctx.moveTo(722, y + 50); ctx.lineTo(722, y + 50.5); }
          ctx.stroke();
          T(ctx, ok ? 'Paid' : 'Overdue', 744, y + 50, 16, 700, col);
          ctx.restore();
        }
      });
      // chart card: neon bars -> softer bars
      box(ctx, 44, 840, 872, 360, 18, surf, k4 < 0.5 ? line : null, 1.5);
      T(ctx, 'Monthly revenue', 76, 890, 20, 800, t1);
      [0.45, 0.62, 0.38, 0.8, 0.55, 0.92, 0.7].forEach((v, i) => box(ctx, 90 + i * 112, 1160 - 220 * v, 58, 220 * v, 10, i === 5 ? acc : mix(acc, surf, 0.45)));
      marks(ctx, st);
    },
  };

  // ================================================================ 4. DEPTH & SHAPE (960 x 1300)
  const depthShape = {
    w: 960, h: 1300, bg: C.white,
    R: { list: [44, 104, 872, 420], cards: [28, 548, 904, 290], elev: [100, 868, 760, 380], nested: [36, 552, 300, 284] },
    draw(ctx, st) {
      const [k1, k2, k3, k4, k5] = K(st), px = st.px || 1;
      ctx.fillStyle = C.white; ctx.fillRect(0, 0, 960, 1300); nav(ctx);
      const rad = (r0) => lerp(r0, 16, k4);
      // settings list: boxes + lines everywhere -> one soft group, spacing only
      T(ctx, 'Settings', 60, 150, 30, 800, C.ink);
      if (k1 > 0) { ctx.save(); ctx.globalAlpha = k1; box(ctx, 60, 176, 840, 330, rad(2), G4); ctx.restore(); }
      ['Notifications', 'Privacy', 'Language', 'Storage', 'Help'].forEach((l, i) => {
        const y = 176 + i * 66;
        if (k1 < 1) { ctx.save(); ctx.globalAlpha = 1 - k1; box(ctx, 60, y, 840, 60, [0, 4, 0, 10, 2][i], null, '#9CA3AF', 1.5); ctx.fillStyle = '#9CA3AF'; ctx.fillRect(110, y + 8, 1.5, 44); ctx.restore(); }
        ctx.fillStyle = BRAND; ctx.beginPath(); ctx.arc(86, y + 33, 8, 0, TAU); ctx.fill();
        T(ctx, l, 124, y + 39, 18, 600, C.ink); T(ctx, '›', 876, y + 40, 24, 600, G2, 'right');
      });
      // product cards: hard dark shadows, random radii -> soft shadows, one radius, nested radius
      [[48, 'Desk lamp', '$49', 0], [344, 'Notebook', '$12', 24], [640, 'Backpack', '$89', 6]].forEach(([x, n, pr, r0], i) => {
        const y = 560, w = 272, h = 268, R = rad(r0 === 24 ? 24 : r0);
        ctx.save();
        const hard = 1 - k2;
        ctx.shadowColor = `rgba(0,0,0,${0.55 * hard + 0.10 * k2})`; ctx.shadowBlur = lerp(0, 32, k2); ctx.shadowOffsetX = lerp(8, 0, k2); ctx.shadowOffsetY = lerp(8, 12, k2);
        box(ctx, x, y, w, h, R, C.white); ctx.restore();
        if (k2 < 0.5) box(ctx, x, y, w, h, R, null, '#6B7280', 1.5);
        const pad = 12, ir = i === 0 ? lerp(R, Math.max(0, R - pad), k5) : Math.max(0, R - pad);
        ctx.save(); rrect(ctx, x + pad, y + pad, w - pad * 2, 150, ir); ctx.clip();
        const g = ctx.createLinearGradient(x, y, x + w, y + 160); g.addColorStop(0, ['#C7D2FE', '#FDE68A', '#BBF7D0'][i]); g.addColorStop(1, ['#A5B4FC', '#FCA5A5', '#99F6E4'][i]);
        ctx.fillStyle = g; ctx.fillRect(x + pad, y + pad, w - pad * 2, 150); ctx.restore();
        T(ctx, n, x + 20, y + 196, 19, 800, C.ink); T(ctx, pr, x + 20, y + 228, 17, 600, G1);
        box(ctx, x + w - 100, y + 204, 80, 38, rad([0, 20, 4][i]), BRAND); T(ctx, 'Add', x + w - 60, y + 229, 15, 700, C.white, 'center');
        if (i === 0 && st.radii > 0) { ctx.save(); ctx.globalAlpha = clamp(st.radii); tag(ctx, `${Math.round(R)} / ${Math.round(ir)}`, x + w / 2, y + 90, k5 > 0.5, px); ctx.restore(); }
      });
      // elevation: random shadows (card deeper than the dialog) -> base < card < dialog
      const sh = (lvl) => { ctx.shadowColor = 'rgba(14,23,38,0.16)'; ctx.shadowBlur = lvl; ctx.shadowOffsetY = lvl / 3; };
      box(ctx, 100, 880, 760, 360, 20, G4);
      ctx.save(); sh(lerp(40, 6, k3)); box(ctx, 140, 920, 360, 260, 16, C.white); ctx.restore();
      T(ctx, 'Card', 170, 970, 20, 800, C.ink); box(ctx, 170, 996, 260, 14, 7, G3); box(ctx, 170, 1024, 200, 14, 7, G3);
      ctx.save(); sh(lerp(4, 48, k3)); box(ctx, 440, 990, 380, 220, 18, C.white); ctx.restore();
      T(ctx, 'Dialog', 470, 1040, 20, 800, C.ink); box(ctx, 470, 1066, 300, 14, 7, G3);
      box(ctx, 640, 1140, 150, 44, 12, BRAND); T(ctx, 'OK', 715, 1168, 16, 700, C.white, 'center');
      if (st.levels > 0) { ctx.save(); ctx.globalAlpha = clamp(st.levels); tag(ctx, k3 > 0.5 ? 'level 1' : 'level 3', 320, 912, k3 > 0.5, px); tag(ctx, k3 > 0.5 ? 'level 3' : 'level 1', 630, 982, k3 > 0.5, px); ctx.restore(); }
      marks(ctx, st);
    },
  };

  // ================================================================ 5. ICONS & IMAGES (960 x 1300)
  function icon(ctx, kind, x, y, s, lw, filled, color) {
    ctx.save(); ctx.translate(x, y); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath();
    const h = s / 2;
    if (kind === 0) { ctx.moveTo(-h, 0); ctx.lineTo(0, -h); ctx.lineTo(h, 0); ctx.lineTo(h * 0.7, 0); ctx.lineTo(h * 0.7, h); ctx.lineTo(-h * 0.7, h); ctx.lineTo(-h * 0.7, 0); ctx.closePath(); }
    else if (kind === 1) { ctx.arc(-h * 0.15, -h * 0.15, h * 0.62, 0, TAU); ctx.moveTo(h * 0.32, h * 0.32); ctx.lineTo(h, h); }
    else if (kind === 2) { ctx.moveTo(-h * 0.7, 0); ctx.lineTo(-h * 0.7, h); ctx.lineTo(h * 0.7, h); ctx.lineTo(h * 0.7, 0); ctx.moveTo(0, h * 0.4); ctx.lineTo(0, -h); ctx.moveTo(-h * 0.45, -h * 0.55); ctx.lineTo(0, -h); ctx.lineTo(h * 0.45, -h * 0.55); }
    else if (kind === 3) { ctx.moveTo(-h * 0.6, -h); ctx.lineTo(h * 0.6, -h); ctx.lineTo(h * 0.6, h); ctx.lineTo(0, h * 0.45); ctx.lineTo(-h * 0.6, h); ctx.closePath(); }
    else if (kind === 4) { ctx.moveTo(-h, h); ctx.lineTo(-h * 0.8, h * 0.4); ctx.lineTo(h * 0.5, -h * 0.9); ctx.lineTo(h, -h * 0.4); ctx.lineTo(-h * 0.3, h * 0.9); ctx.closePath(); }
    else { [-0.6, 0, 0.6].forEach((d) => { ctx.moveTo(d * h + h * 0.14, 0); ctx.arc(d * h, 0, h * 0.14, 0, TAU); }); }
    if (filled && kind !== 1 && kind !== 5) ctx.fill(); else ctx.stroke();
    if (kind === 5) ctx.fill();
    ctx.restore();
  }
  function scene(ctx, x, y, w, h, seed) { // abstract "photo": sky, sun, hills (no real image)
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, ['#FDE68A', '#BFDBFE', '#FBCFE8', '#BBF7D0', '#FED7AA', '#DDD6FE'][seed % 6]); g.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.arc(x + w * (0.25 + 0.1 * (seed % 3)), y + h * 0.32, Math.min(w, h) * 0.13, 0, TAU); ctx.fill();
    ctx.fillStyle = ['#86EFAC', '#93C5FD', '#F9A8D4', '#6EE7B7', '#FDBA74', '#C4B5FD'][seed % 6];
    ctx.beginPath(); ctx.moveTo(x, y + h); ctx.quadraticCurveTo(x + w * 0.3, y + h * 0.45, x + w * 0.6, y + h * 0.8); ctx.quadraticCurveTo(x + w * 0.8, y + h * 0.55, x + w, y + h * 0.7); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
  }
  const iconsImages = {
    w: 960, h: 1300, bg: C.white,
    R: { toolbar: [36, 98, 888, 136], hero: [36, 250, 888, 330], gallery: [36, 610, 888, 620] },
    draw(ctx, st) {
      const [k1, k2, k3, k4, k5] = K(st), px = st.px || 1;
      ctx.fillStyle = C.white; ctx.fillRect(0, 0, 960, 1300);
      // toolbar: mixed filled/outline, random strokes, no labels -> one outline family, 2.5 px, labels
      const strokes = [1.2, 4.5, 2, 6, 1, 3.5];
      ['Home', 'Search', 'Share', 'Save', 'Edit', 'More'].forEach((l, i) => {
        const x = 110 + i * 148, y = 150 - k3 * 12;
        const filled = i % 2 === 0 && k1 < 0.5, lw = lerp(strokes[i] * 1.4, 3.5, k2), s = lerp([44, 32, 50, 38, 56, 34][i], 44, k1);
        icon(ctx, i, x, y - 6, s, lw, filled, C.ink);
        T(ctx, l, x, 212, 18, 700, G1, 'center', k3);
      });
      ctx.fillStyle = G3; ctx.fillRect(0, 234, 960, 1);
      // hero: white text on a bright picture -> dark gradient under the text
      ctx.save(); rrect(ctx, 60, 260, 840, 300, 20); ctx.clip(); scene(ctx, 60, 260, 840, 300, 0);
      if (k4 > 0) { const g = ctx.createLinearGradient(0, 360, 0, 560); g.addColorStop(0, 'rgba(14,23,38,0)'); g.addColorStop(1, `rgba(14,23,38,${0.75 * k4})`); ctx.fillStyle = g; ctx.fillRect(60, 260, 840, 300); }
      T(ctx, 'Discover new places', 96, 500, 40, 800, C.white); T(ctx, 'Weekend trips near you', 96, 534, 18, 600, 'rgba(255,255,255,0.95)');
      ctx.restore();
      // gallery: random ratios and sizes -> one 4:3 grid
      const e5 = E.inOutCubic(k5);
      const before = [[60, 620, 300, 160], [372, 640, 200, 260], [584, 630, 316, 120], [70, 800, 240, 300], [330, 920, 260, 170], [604, 770, 290, 330]];
      before.forEach((b, i) => {
        const col = i % 3, row = Math.floor(i / 3), a = [60 + col * 288, 630 + row * 228, 264, 198];
        const [x, y, w, h] = b.map((v, j) => lerp(v, a[j], e5));
        ctx.save(); rrect(ctx, x, y, w, h, 14); ctx.clip(); scene(ctx, x, y, w, h, i + 1); ctx.restore();
        if (st.ratios > 0) { ctx.save(); ctx.globalAlpha = clamp(st.ratios); tag(ctx, k5 > 0.5 ? '4:3' : ['15:8', '10:13', '8:3', '4:5', '3:2', '9:10'][i], x + w / 2, y + h / 2, k5 > 0.5, px); ctx.restore(); }
      });
      marks(ctx, st);
    },
  };

  // ================================================================ 6. MOTION (phone 390 x 844, bezel around)
  const motion = {
    w: 418, h: 872, ox: -14, oy: -14, bg: '#E9ECF2',
    R: { sheet: [0, 470, 390, 374], toggle: [10, 150, 370, 76], list: [10, 140, 370, 400], button: [18, 712, 354, 66], content: [10, 120, 370, 470] },
    draw(ctx, st) {
      const [k1, k2, k3, k4, k5] = K(st), sec = st.sec || 0, px = st.px || 1, demo = st.panel || 'duration';
      box(ctx, -14, -14, 418, 872, 62, C.ink);
      ctx.save(); rrect(ctx, 0, 0, 390, 844, 50); ctx.clip(); ctx.fillStyle = '#F7F8FA'; ctx.fillRect(0, 0, 390, 844);
      T(ctx, '9:41', 44, 32, 15, 700, C.ink, 'center'); box(ctx, 140, 12, 110, 30, 15, C.ink);
      T(ctx, 'Settings', 20, 100, 30, 800, C.ink);
      // loading (demo 5): blank wait -> skeleton then content + toast
      const loop5 = sec % 3.2, loaded = demo !== 'feedback' || loop5 > 1.4;
      const rows = ['Notifications', 'Dark mode', 'Sync', 'Backup', 'Language'];
      rows.forEach((l, i) => {
        let y = 140 + i * 74, dx = 0, rot = 0;
        if (demo === 'purpose') { const a = 1 - k3; dx = a * 10 * Math.sin(sec * 7 + i * 1.7); rot = a * 0.05 * Math.sin(sec * 5 + i); }
        ctx.save(); ctx.translate(195 + dx, y + 32); ctx.rotate(rot); ctx.translate(-195, -(y + 32));
        if (!loaded) {
          if (k5 > 0.5) { const sh = 0.5 + 0.5 * Math.sin(sec * 6 - i); box(ctx, 12, y, 366, 64, 16, C.white); box(ctx, 30, y + 18, 140, 12, 6, mix(G3, G4, sh)); box(ctx, 30, y + 38, 90, 10, 5, mix(G3, G4, sh)); }
        } else {
          box(ctx, 12, y, 366, 64, 16, C.white, G3, 1);
          T(ctx, l, 30, y + 39, 17, 600, C.ink);
          // toggle (demo 2): linear -> ease-out
          let on = i % 2 === 0 ? 1 : 0;
          if (demo === 'easing' && i === 0) { const c = (sec % 1.6) / 1.6, t = clamp(c / 0.45), lin = t, eo = 1 - (1 - t) ** 3; on = c < 0.5 ? lerp(lin, eo, k2) : 1 - clamp((c - 0.5) / 0.45); if (c >= 0.5) { const t2 = clamp((c - 0.5) / 0.45); on = 1 - lerp(t2, 1 - (1 - t2) ** 3, k2); } }
          box(ctx, 304, y + 18, 56, 30, 15, mix(G3, BRAND, on));
          ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(lerp(319, 345, on), y + 33, 12, 0, TAU); ctx.fill();
        }
        ctx.restore();
      });
      if (demo === 'feedback' && !loaded && k5 < 0.5) T(ctx, '…', 195, 320, 40, 800, G2, 'center');
      if (demo === 'purpose' && k3 > 0.5) { const c = (sec % 2.4) / 2.4, a = E.outCubic(clamp(c / 0.25)); ctx.save(); ctx.globalAlpha = a * (1 - clamp((c - 0.85) / 0.15)); box(ctx, 12, 518 - (1 - a) * 30, 366, 56, 14, TINT, BRAND, 1.5); T(ctx, 'New: Weekly report', 30, 552 - (1 - a) * 30, 16, 700, BRAND); ctx.restore(); }
      // save button (demo 4): no press state -> pressed
      const tapC = (sec % 1.6) / 1.6, tap = demo === 'press' ? Math.max(0, 1 - Math.abs(tapC - 0.3) / 0.12) : 0, pr = tap * k4;
      ctx.save(); ctx.translate(195, 745); ctx.scale(1 - 0.05 * pr, 1 - 0.05 * pr); ctx.translate(-195, -745);
      box(ctx, 18, 716, 354, 58, 29, mix(BRAND, '#4A2FC2', pr)); T(ctx, 'Save', 195, 752, 18, 700, C.white, 'center'); ctx.restore();
      if (tap > 0) { ctx.save(); ctx.globalAlpha = 0.35 * tap; ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(250, 745, 22, 0, TAU); ctx.fill(); ctx.restore(); }
      if (demo === 'feedback' && loaded && k5 > 0.5) { const a = clamp((loop5 - 1.5) / 0.2) * (1 - clamp((loop5 - 2.9) / 0.2)); ctx.save(); ctx.globalAlpha = a; box(ctx, 95, 640, 200, 44, 22, C.ink); ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(120, 662, 10, 0, TAU); ctx.fill(); T(ctx, 'Saved', 140, 668, 15, 700, C.white); ctx.restore(); }
      // bottom sheet (demo 1): 1200 ms -> 250 ms
      if (demo === 'duration') {
        const dur = lerp(1.2, 0.25, k1), c = sec % 2.6, t = clamp(c / dur), out = c > 2.2 ? clamp((c - 2.2) / 0.3) : 0;
        const y = lerp(844, 480, k1 > 0.5 ? 1 - (1 - t) ** 3 : t) + out * 364;
        ctx.fillStyle = 'rgba(14,23,38,0.25)'; ctx.fillRect(0, 0, 390, 844 * clamp(1 - out) * (t > 0 ? 1 : 0));
        box(ctx, 0, y, 390, 420, 28, C.white); box(ctx, 165, y + 12, 60, 6, 3, G3);
        T(ctx, 'Share project', 24, y + 60, 22, 800, C.ink);
        ['Copy link', 'Invite by email', 'Export PDF'].forEach((l, i) => T(ctx, l, 24, y + 112 + i * 50, 17, 600, G1));
      }
      ctx.restore();
      // timing chip / curve inset (outside the screen clip so it stays readable)
      if (demo === 'duration' && st.chip > 0) { ctx.save(); ctx.globalAlpha = clamp(st.chip); tag(ctx, k1 > 0.5 ? '250 ms' : '1200 ms', 195, 60, k1 > 0.5, Math.max(px, 1.6)); ctx.restore(); }
      if (demo === 'easing' && st.chip > 0) {
        ctx.save(); ctx.globalAlpha = clamp(st.chip); box(ctx, 230, 250, 140, 120, 14, C.white, G3, 1.5);
        ctx.strokeStyle = k2 > 0.5 ? C.blue : C.red; ctx.lineWidth = 3; ctx.beginPath();
        for (let i = 0; i <= 20; i++) { const t = i / 20, v = lerp(t, 1 - (1 - t) ** 3, k2); const x = 245 + t * 110, y = 355 - v * 90; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
        ctx.stroke(); T(ctx, k2 > 0.5 ? 'ease-out' : 'linear', 300, 272, 14, 800, k2 > 0.5 ? C.blue : C.red, 'center'); ctx.restore();
      }
      marks(ctx, st);
    },
  };

  return { spacing, darkA11y, depthShape, iconsImages, motion };
}
