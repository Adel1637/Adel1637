// "What GTA 6's UI teaches designers" — a FICTIONAL open-world game screen drawn in our own style (no Rockstar
// asset, no logo, no Pricedown, no game footage), one vignette per lesson. Short coordinates: x 80..1000, y 280..1150.
// Facts checked online on 23 Nov 2026 (reports/Interface UI UX de GTA 6.md):
//  - minimap hidden by default, back when driving or with a waypoint; "Navigation Experience" presets + detailed toggles
//  - police no longer shown on the minimap: red reported-crime zone + screen-edge glow ("Awareness Effects Intensity")
//  - wanted level with icons for what the police know about you (appearance, clothes, vehicle)
//  - Pricedown, minimap, wanted stars and Wasted screen kept as signatures (Stuart Petri, VP Art 2D/UI Design)
//  - accessibility "considered from the outset" (Sam Grosset): UI text up to X Large, subtitles with background,
//    colour-blind modes, menu narration
//  - weapon-wheel critique ("visual form fighting the interaction") dates from the Aug 2026 Extended Look (pre-release)
export function makeGta(M, K) {
  const { lerp, clamp, E, mix, mulberry32 } = M;
  const { F, C, TAU, ez, spr, txt, rr, pill, cursor } = K;
  const T = (ctx, s, x, y, size, w, color, align = 'left', family = F.title) => txt(ctx, s, x, y, size, { w, color, align, family });
  const rnd = mulberry32(606);
  const GX = 80, GY = 300, GW = 920, GH = 518, HZ = GY + GH * 0.56, GB = GY + GH;
  const BLD = []; for (let x = GX - 20; x < GX + GW + 20;) { const w = 34 + rnd() * 46; BLD.push({ x, w, h: 40 + rnd() * 150, win: Array.from({ length: 60 }, () => rnd()) }); x += w + 4 + rnd() * 10; }
  const BLUE = '#5B8DEF', RED = '#E5484D';

  // ---------------------------------------------------------------- the game world (stylised dusk street, cool grays)
  function car(ctx, x, y, v) {
    const b = Math.sin(v * 1.7) * 1.5;
    ctx.save(); ctx.translate(x, y + b);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(0, 34, 150, 14, 0, 0, TAU); ctx.fill();
    rr(ctx, -122, 14, 46, 26, 7, '#15181D'); rr(ctx, 76, 14, 46, 26, 7, '#15181D');
    rr(ctx, -132, -46, 264, 72, 22, '#4A5263');
    rr(ctx, -92, -98, 184, 60, 20, '#3D4453'); rr(ctx, -80, -90, 160, 42, 13, '#1B2029');
    rr(ctx, -124, -30, 56, 14, 6, '#FF5A64'); rr(ctx, 68, -30, 56, 14, 6, '#FF5A64');
    ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = '#FF5A64'; ctx.beginPath(); ctx.ellipse(-96, -22, 60, 18, 0, 0, TAU); ctx.ellipse(96, -22, 60, 18, 0, 0, TAU); ctx.fill(); ctx.restore();
    rr(ctx, -36, -10, 72, 20, 4, '#D6D9DF');
    ctx.restore();
  }
  function scene(ctx, v, { speed = 1, dim = 0 } = {}) {
    ctx.save(); ctx.beginPath(); ctx.roundRect(GX, GY, GW, GH, 22); ctx.clip();
    let g = ctx.createLinearGradient(0, GY, 0, HZ); g.addColorStop(0, '#1F2531'); g.addColorStop(1, '#46506290'); ctx.fillStyle = '#1F2531'; ctx.fillRect(GX, GY, GW, GH); ctx.fillStyle = g; ctx.fillRect(GX, GY, GW, HZ - GY);
    BLD.forEach((b) => {
      ctx.fillStyle = '#2A303C'; ctx.fillRect(b.x, HZ - b.h, b.w, b.h);
      let k = 0; for (let yy = HZ - b.h + 10; yy < HZ - 10; yy += 14) for (let xx = b.x + 6; xx < b.x + b.w - 8; xx += 11) { if (b.win[k++ % 60] > 0.64) { ctx.fillStyle = 'rgba(236,228,200,0.5)'; ctx.fillRect(xx, yy, 5, 7); } }
    });
    g = ctx.createLinearGradient(0, HZ, 0, GB); g.addColorStop(0, '#2B3039'); g.addColorStop(1, '#1C2027'); ctx.fillStyle = g; ctx.fillRect(GX, HZ, GW, GB - HZ);
    ctx.fillStyle = '#343A44'; ctx.beginPath(); ctx.moveTo(540 - 24, HZ); ctx.lineTo(540 + 24, HZ); ctx.lineTo(540 + 460, GB); ctx.lineTo(540 - 460, GB); ctx.closePath(); ctx.fill();
    const D = GB - HZ;
    for (let k = 0; k < 9; k++) {
      const z0 = ((k + v * speed * 0.9) % 9) / 9, z1 = z0 + 0.045; if (z1 > 1) continue;
      const y0 = HZ + D * z0 * z0, y1 = HZ + D * z1 * z1, w0 = 1.5 + z0 * z0 * 10, w1 = 1.5 + z1 * z1 * 10;
      ctx.fillStyle = 'rgba(230,232,236,0.7)'; ctx.beginPath(); ctx.moveTo(540 - w0, y0); ctx.lineTo(540 + w0, y0); ctx.lineTo(540 + w1, y1); ctx.lineTo(540 - w1, y1); ctx.fill();
    }
    [-1, 1].forEach((sd) => { for (let k = 0; k < 5; k++) { const z = ((k + v * speed * 0.45) % 5) / 5, y = HZ + D * z * z, x = 540 + sd * (30 + z * z * 560), h = 20 + z * z * 220; ctx.fillStyle = '#4A5160'; ctx.fillRect(x - 1 - z * 2, y - h, 2 + z * 4, h); ctx.save(); ctx.globalAlpha = 0.22 + z * 0.2; ctx.fillStyle = '#F1EAD2'; ctx.beginPath(); ctx.arc(x, y - h, 6 + z * 20, 0, TAU); ctx.fill(); ctx.restore(); } });
    car(ctx, 540, GB - 78, v);
    if (dim > 0) { ctx.fillStyle = `rgba(14,16,21,${0.72 * dim})`; ctx.fillRect(GX, GY, GW, GH); }
    ctx.restore();
    T(ctx, 'FICTIONAL GAME UI', 980, 290, 16, 600, '#888', 'right', F.mono);
  }

  // ---------------------------------------------------------------- HUD parts (our own design)
  const MM = { x: GX + 26, y: GB - 26 - 176, s: 176 };
  function minimap(ctx, a, { route = 0, zone = 0, dots = 0, x = MM.x, y = MM.y, s = MM.s, heavy = 0 } = {}) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    if (heavy) { rr(ctx, x - 6, y - 6, s + 12, s + 12, 4, '#C9A227'); rr(ctx, x, y, s, s, 2, '#1A2A1E', '#000', 3); }
    else rr(ctx, x, y, s, s, 18, 'rgba(18,22,30,0.82)', 'rgba(255,255,255,0.16)', 1.5);
    ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, s, s, heavy ? 2 : 18); ctx.clip(); ctx.translate(x + s / 2, y + s / 2); ctx.rotate(-0.35);
    ctx.strokeStyle = heavy ? '#6E8F6A' : '#4C5567'; ctx.lineWidth = 7; for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(-200, k * 46); ctx.lineTo(200, k * 46); ctx.stroke(); }
    ctx.lineWidth = 4; ctx.strokeStyle = heavy ? '#55704F' : '#3B4352'; for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(k * 52, -200); ctx.lineTo(k * 52, 200); ctx.stroke(); }
    if (zone > 0) { const g = ctx.createRadialGradient(40, -30, 0, 40, -30, 90); g.addColorStop(0, `rgba(229,72,77,${0.5 * zone})`); g.addColorStop(1, 'rgba(229,72,77,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(40, -30, 90, 0, TAU); ctx.fill(); }
    if (route > 0) { ctx.strokeStyle = BLUE; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, lerp(0, -46, clamp(route * 2))); if (route > 0.5) ctx.lineTo(lerp(0, 104, clamp(route * 2 - 1)), -46); ctx.stroke(); }
    ctx.restore();
    if (dots > 0) { const r2 = mulberry32(9); for (let k = 0; k < 16; k++) { const dx = r2() * (s - 24) + 12, dy = r2() * (s - 24) + 12; ctx.globalAlpha = a * dots; ctx.fillStyle = k % 3 ? RED : BLUE; ctx.beginPath(); ctx.arc(x + dx, y + dy, 6, 0, TAU); ctx.fill(); } ctx.globalAlpha = a; [['!', 0.2, 0.25], ['$', 0.75, 0.7], ['?', 0.65, 0.2], ['★', 0.3, 0.8]].forEach(([c, fx, fy]) => { rr(ctx, x + fx * s - 12, y + fy * s - 12, 24, 24, 5, '#FFC83D'); T(ctx, c, x + fx * s, y + fy * s + 6, 15, 700, '#111', 'center'); }); }
    ctx.globalAlpha = a; ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(x + s / 2, y + s / 2 - 12); ctx.lineTo(x + s / 2 + 9, y + s / 2 + 10); ctx.lineTo(x + s / 2, y + s / 2 + 5); ctx.lineTo(x + s / 2 - 9, y + s / 2 + 10); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  function compass(ctx, a, cx = 540, y = GY + 34) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(cx - 150, y, 300, 1.5);
    ['W', 'NW', 'N', 'NE', 'E'].forEach((l, i) => { const x = cx - 140 + i * 70; ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x, y - 6, 1.5, 12); T(ctx, l, x, y + 26, 14, 600, i === 2 ? '#FFFFFF' : 'rgba(255,255,255,0.6)', 'center', F.mono); });
    ctx.restore();
  }
  function pips(ctx, x, y, filled, a = 1, sc = 1, heavy = 0) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(sc, sc);
    for (let k = 0; k < 6; k++) { const px = -k * 24; if (heavy) rr(ctx, px - 18, -12, 18, 24, 3, k < filled ? '#FFE066' : 'rgba(0,0,0,0.4)', '#000', 3); else rr(ctx, px - 14, -9, 12, 18, 4, k < filled ? '#FFFFFF' : 'rgba(255,255,255,0.08)', k < filled ? null : 'rgba(255,255,255,0.5)', 1.5); }
    ctx.restore();
  }
  function clutter(ctx, a) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    rr(ctx, GX + 24, GY + 24, 250, 132, 10, 'rgba(20,24,32,0.85)', '#FFC83D', 2); T(ctx, 'OBJECTIVES (4)', GX + 40, GY + 52, 16, 700, '#FFC83D', 'left', F.mono);
    ['Find the courier', 'Buy a new jacket', 'Call the mechanic', 'Visit the marina'].forEach((s, i) => T(ctx, '• ' + s, GX + 40, GY + 78 + i * 22, 15, 500, '#FFFFFF'));
    rr(ctx, 380, GY + 24, 320, 46, 23, '#E5484D'); T(ctx, 'NEW OBJECTIVE AVAILABLE!!', 540, GY + 54, 17, 700, '#FFFFFF', 'center');
    rr(ctx, GX + GW - 254, GY + 84, 230, 70, 12, 'rgba(255,255,255,0.92)'); T(ctx, '3 new messages', GX + GW - 238, GY + 112, 17, 600, '#111'); T(ctx, 'Tap to open the phone', GX + GW - 238, GY + 138, 14, 500, '#555');
    [['X', 'Enter'], ['Y', 'Call'], ['R1', 'Radio'], ['L1', 'Map']].forEach(([k, l], i) => { const x = GX + GW - 200, y = GB - 150 + i * 32; rr(ctx, x, y - 20, 34, 26, 6, '#FFFFFF'); T(ctx, k, x + 17, y - 1, 13, 700, '#111', 'center', F.mono); T(ctx, l, x + 44, y, 16, 600, '#FFFFFF'); });
    [['#3DD68C', 0.8], ['#5B8DEF', 0.55]].forEach(([c, f], i) => { const x = MM.x + MM.s + 16, y = GB - 70 + i * 22; rr(ctx, x, y, 170, 12, 6, 'rgba(0,0,0,0.5)'); rr(ctx, x, y, 170 * f, 12, 6, c); });
    T(ctx, '120 / 360', GX + GW - 30, GY + 210, 26, 700, '#FFFFFF', 'right', F.mono);
    ctx.restore();
  }
  function chip(ctx, s, x, y, on, a = 1) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.font = `600 28px ${F.title}`; const w = ctx.measureText(s).width + 48;
    rr(ctx, x, y, w, 58, 29, on ? 'rgba(13,153,255,0.16)' : '#232323', on ? C.sel : '#3A3A3A', 2); T(ctx, s, x + 24, y + 39, 28, 600, on ? '#FFFFFF' : '#8A8A8A');
    ctx.restore(); return w;
  }
  function toggle(ctx, x, y, on) { rr(ctx, x, y, 56, 32, 16, mix('#3A3D45', '#5B8DEF', on)); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(x + lerp(16, 40, on), y + 16, 12, 0, TAU); ctx.fill(); }
  function panel(ctx, x, y, w, h) { rr(ctx, x, y, w, h, 18, '#26272C', '#3A3B42', 1.5); }

  // ---------------------------------------------------------------- 1. show it when it matters
  const L1 = {
    draw(ctx, v) {
      scene(ctx, v, { speed: v > 4.8 ? 1 : 0.15 });
      const c = 1 - ez(v, 2.6, 3.8, E.inOutCubic);
      clutter(ctx, c);
      const mapIn = ez(v, 5.3, 6.2, E.outCubic), mapA = Math.max(c, mapIn);
      minimap(ctx, mapA, { dots: c, route: ez(v, 5.6, 7) });
      compass(ctx, mapIn);
      const pin = spr(v, 4.8, { stiffness: 300, damping: 12 });
      if (pin > 0) { ctx.save(); ctx.translate(700, HZ - 6); ctx.scale(pin, pin); ctx.fillStyle = BLUE; ctx.beginPath(); ctx.arc(0, -34, 16, Math.PI, 0); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(0, -34, 6, 0, TAU); ctx.fill(); ctx.restore(); }
      const a = ez(v, 3.4, 4.2);
      chip(ctx, 'Exploring → map hidden', 80, 856, v >= 3.8 && v < 4.8, a);
      chip(ctx, 'Waypoint set → map shown', 80, 934, v >= 4.8, ez(v, 4.6, 5.2));
    },
    hits: [[2.6, 'clutter out', 'whoosh', { len: 0.6 }], [3.8, 'hidden', 'tok', { pitch: 'D5' }], [4.8, 'waypoint', 'pop', { pitch: 'A5' }], [5.3, 'map in', 'tick'], [7, 'route', 'bell', { pitch: 'F#6' }]],
  };

  // ---------------------------------------------------------------- 2. smart default, full control
  const L2 = {
    draw(ctx, v) {
      scene(ctx, v, { speed: 0.2, dim: ez(v, 0.4, 1.4) });
      const p = ez(v, 0.8, 2.2, E.outCubic); if (p <= 0) return;
      ctx.save(); ctx.globalAlpha = p; ctx.translate(0, (1 - p) * 30);
      panel(ctx, 140, 330, 800, 790);
      T(ctx, 'Navigation', 180, 392, 34, 600, '#EEEEF0'); T(ctx, 'How should the map appear?', 180, 428, 20, 500, '#A3A3AC');
      const sel = 0, presets = [['Dynamic', 'Shows up when needed'], ['Map + compass', 'Both, when needed'], ['Always on', 'Never hides']];
      presets.forEach(([t, s], i) => {
        const x = 180 + i * 248, y = 462, on = i === sel;
        rr(ctx, x, y, 228, 190, 14, on ? 'rgba(91,141,239,0.14)' : '#2E2F35', on ? BLUE : '#44454D', on ? 2.5 : 1.5);
        rr(ctx, x + 18, y + 18, 70, 70, 10, '#1B2029', 'rgba(255,255,255,0.12)', 1);
        if (i !== 0 || true) { ctx.strokeStyle = '#4C5567'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 24, y + 44); ctx.lineTo(x + 82, y + 44); ctx.moveTo(x + 50, y + 24); ctx.lineTo(x + 50, y + 82); ctx.stroke(); }
        if (i === 1) { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x + 100, y + 30, 100, 1.5); [0, 1, 2].forEach((k) => ctx.fillRect(x + 110 + k * 40, y + 25, 1.5, 11)); }
        T(ctx, t, x + 18, y + 128, 22, 600, '#EEEEF0'); T(ctx, s, x + 18, y + 158, 16, 500, '#A3A3AC');
        if (on) { const b = spr(v, 2.6, { stiffness: 300, damping: 13 }); if (b > 0) { ctx.save(); ctx.translate(x + 168, y + 34); ctx.scale(b, b); rr(ctx, -52, -16, 104, 32, 16, BLUE); T(ctx, 'Default', 0, 7, 15, 600, '#FFFFFF', 'center'); ctx.restore(); } }
      });
      const adv = ez(v, 4.4, 5.4, E.inOutCubic);
      T(ctx, adv > 0.5 ? 'Advanced settings  ⌃' : 'Advanced settings  ⌄', 180, 704, 20, 600, BLUE);
      if (adv > 0) {
        ctx.save(); ctx.globalAlpha *= adv;
        const rows = [['Minimap', 'dyn'], ['Compass', 'tog'], ['Map size', 'sl', 0.6], ['Icon size', 'sl', 0.45], ['Street names', 'tog']];
        rows.forEach(([l, k, f], i) => {
          const y = 740 + i * 72 + (1 - adv) * 20; ctx.fillStyle = '#3A3B42'; ctx.fillRect(180, y, 720, 1);
          T(ctx, l, 180, y + 46, 21, 500, '#EEEEF0');
          if (k === 'dyn') { rr(ctx, 700, y + 16, 200, 40, 8, '#2E2F35', '#44454D', 1); T(ctx, 'Dynamic  ⌄', 720, y + 43, 18, 600, '#EEEEF0'); }
          if (k === 'tog') toggle(ctx, 844, y + 20, i === 1 ? ez(v, 6, 6.4) : 1);
          if (k === 'sl') { rr(ctx, 700, y + 34, 200, 6, 3, '#44454D'); rr(ctx, 700, y + 34, 200 * f, 6, 3, BLUE); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(700 + 200 * f, y + 37, 11, 0, TAU); ctx.fill(); }
        });
        ctx.restore();
      }
      ctx.restore();
      if (v >= 3.6 && v < 6.6) { const m = ez(v, 3.6, 4.4, E.inOutCubic), m2 = ez(v, 5.4, 6, E.inOutCubic); cursor(ctx, lerp(lerp(620, 300, m), 868, m2), lerp(lerp(1040, 708, m), 832, m2)); }
    },
    hits: [[0.8, 'menu', 'whoosh', { len: 0.5 }], [2.6, 'default', 'pop', { pitch: 'A5' }], [4.4, 'advanced', 'click'], [4.6, 'expand', 'tick'], [6, 'toggle', 'click'], [6.3, 'done', 'bell', { pitch: 'F#6' }]],
  };

  // ---------------------------------------------------------------- 3. signal at the edges
  function edgeGlow(ctx, a, v) {
    if (a <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.roundRect(GX, GY, GW, GH, 22); ctx.clip();
    const ph = (Math.sin(v * Math.PI * 1.2) + 1) / 2, col = ph > 0.5 ? '229,72,77' : '91,141,239';
    const g = ctx.createLinearGradient(GX + GW, 0, GX + GW - 170, 0); g.addColorStop(0, `rgba(${col},${0.7 * a})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(GX + GW - 170, GY, 170, GH);
    ctx.restore();
  }
  const L3 = {
    draw(ctx, v) {
      scene(ctx, v, { speed: 1.4 });
      const t = ez(v, 2.8, 4.2, E.inOutCubic);
      minimap(ctx, 1, { dots: 1 - t, zone: ez(v, 3.8, 4.8) });
      pips(ctx, GX + GW - 26, GY + 40, 2);
      edgeGlow(ctx, ez(v, 4.8, 5.6), v);
      chip(ctx, 'Before: icons all over the map', 80, 856, v < 2.8, ez(v, 0.6, 1.4));
      chip(ctx, 'After: a zone + a glow at the edge', 80, 934, v >= 4.8, ez(v, 4.2, 4.8));
      if (v >= 5.6) { const p = spr(v, 5.6, { stiffness: 300, damping: 13 }); ctx.save(); ctx.translate(GX + GW - 150, GY + GH / 2); ctx.scale(p, p); rr(ctx, -110, -24, 220, 48, 24, 'rgba(14,16,21,0.85)'); T(ctx, 'Danger: right →', 0, 8, 20, 600, '#FFFFFF', 'center'); ctx.restore(); }
    },
    hits: [[2.8, 'declutter', 'whoosh', { len: 0.6 }], [3.8, 'zone', 'tok', { pitch: 'D5' }], [4.8, 'edge glow', 'riser', { len: 0.8 }], [5.6, 'danger', 'pop', { pitch: 'A5' }]],
  };

  // ---------------------------------------------------------------- 4. show why, not just how much
  function icoFace(ctx, x, y, c) { ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 18, 0, TAU); ctx.stroke(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x - 6, y - 4, 2.5, 0, TAU); ctx.arc(x + 6, y - 4, 2.5, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x, y + 3, 7, 0.2, Math.PI - 0.2); ctx.stroke(); }
  function icoShirt(ctx, x, y, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x - 8, y - 18); ctx.lineTo(x - 22, y - 10); ctx.lineTo(x - 16, y); ctx.lineTo(x - 12, y - 4); ctx.lineTo(x - 12, y + 18); ctx.lineTo(x + 12, y + 18); ctx.lineTo(x + 12, y - 4); ctx.lineTo(x + 16, y); ctx.lineTo(x + 22, y - 10); ctx.lineTo(x + 8, y - 18); ctx.quadraticCurveTo(x, y - 10, x - 8, y - 18); ctx.fill(); }
  function icoCar(ctx, x, y, c) { ctx.fillStyle = c; rr(ctx, x - 24, y - 2, 48, 16, 6, c); ctx.beginPath(); ctx.moveTo(x - 14, y - 2); ctx.lineTo(x - 8, y - 14); ctx.lineTo(x + 10, y - 14); ctx.lineTo(x + 16, y - 2); ctx.fill(); ctx.fillStyle = '#26272C'; ctx.beginPath(); ctx.arc(x - 13, y + 14, 6, 0, TAU); ctx.arc(x + 13, y + 14, 6, 0, TAU); ctx.fill(); }
  const L4 = {
    draw(ctx, v) {
      scene(ctx, v, { speed: 1.2, dim: 0.35 });
      minimap(ctx, 1, { zone: 1 });
      const z = ez(v, 0.6, 1.8, E.inOutCubic);
      ctx.save(); ctx.translate(lerp(GX + GW - 26, 880, z), lerp(GY + 40, GY + 120, z)); pips(ctx, 0, 0, 3, 1, lerp(1, 2, z)); ctx.restore();
      if (z > 0.6) T(ctx, 'Level 3 of 6', 880, GY + 180, 24, 600, '#FFFFFF', 'right', F.mono);
      const k = ez(v, 2.8, 3.6);
      if (k > 0) {
        ctx.save(); ctx.globalAlpha = k; rr(ctx, 106, GY + 26, 460, 170, 16, 'rgba(20,23,30,0.92)', 'rgba(255,255,255,0.14)', 1.5);
        T(ctx, 'WHAT THEY KNOW', 130, GY + 60, 18, 600, '#A3A3AC', 'left', F.mono);
        [[icoFace, 'Face', false], [icoShirt, 'Clothes', true], [icoCar, 'Car', true]].forEach(([f, l, known], i) => {
          const x = 186 + i * 150, y = GY + 112, s = spr(v, 3 + i * 0.4, { stiffness: 300, damping: 13 }); if (s <= 0) return;
          ctx.save(); ctx.translate(x, y); ctx.scale(s, s); f(ctx, 0, 0, known ? '#FFFFFF' : '#6B6F78');
          T(ctx, known ? '✓' : '?', 26, -12, 18, 700, known ? '#3DD68C' : '#8B8F98', 'center'); ctx.restore();
          T(ctx, l, x, y + 52, 19, 500, known ? '#EEEEF0' : '#8B8F98', 'center');
        });
        ctx.restore();
      }
      // the same idea in an app: a password meter that says what is missing
      const a = ez(v, 4.6, 5.4); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a; ctx.translate(0, (1 - a) * 20);
      T(ctx, 'IN AN APP', 80, 868, 16, 600, '#8A8A8A', 'left', F.mono);
      rr(ctx, 80, 884, 920, 250, 18, '#FFFFFF');
      T(ctx, 'Password', 116, 930, 18, 600, '#18181B'); rr(ctx, 116, 946, 420, 52, 10, '#FFFFFF', '#D4D4D8', 1.5); T(ctx, '••••••••', 136, 982, 24, 600, '#18181B');
      [0, 1, 2, 3].forEach((i) => rr(ctx, 116 + i * 106, 1014, 98, 8, 4, i < 1 ? '#DC2626' : '#E4E4E7')); T(ctx, 'Weak', 116, 1052, 17, 600, '#DC2626');
      const w = ez(v, 5.8, 6.6);
      if (w > 0) { ctx.globalAlpha = a * w; [['8+ characters', true], ['A number', false], ['A symbol', false]].forEach(([l, ok], i) => { const y = 950 + i * 52; ctx.fillStyle = ok ? '#15803D' : '#DC2626'; ctx.beginPath(); ctx.arc(600, y + 14, 13, 0, TAU); ctx.fill(); T(ctx, ok ? '✓' : '✕', 600, y + 20, 16, 700, '#FFFFFF', 'center'); T(ctx, l, 626, y + 21, 20, 500, '#18181B'); }); }
      ctx.restore();
    },
    hits: [[0.6, 'zoom level', 'whoosh', { len: 0.5 }], [3, 'face', 'tick'], [3.4, 'clothes', 'pop', { pitch: 'E5' }], [3.8, 'car', 'pop', { pitch: 'F#5' }], [4.6, 'app', 'whoosh', { len: 0.4 }], [5.8, 'reasons', 'bell', { pitch: 'F#6' }]],
  };

  // ---------------------------------------------------------------- 5. the form follows the gesture (long only)
  const ITEMS = ['Melee', 'Pistol', 'Rifle', 'Throw', 'Heavy', 'Gadget', 'Phone', 'Unarmed'];
  const L5 = {
    draw(ctx, v) {
      scene(ctx, v, { speed: 0.1, dim: 0.8 });
      const cx = 540, cy = GY + GH / 2, m = ez(v, 2.8, 4.4, E.inOutCubic), dir = -Math.PI / 4 * 3 + ez(v, 4.6, 6.2, E.inOutCubic) * (Math.PI / 2);
      const n = 8, step = TAU / n;
      const selIdx = Math.round(((dir + Math.PI / 2) % TAU + TAU) % TAU / step) % n;
      for (let i = 0; i < n; i++) {
        const a0 = -Math.PI / 2 + i * step - step / 2, mid = a0 + step / 2;
        // before: square tiles placed on a ring (the selection is hard to read from the stick angle)
        if (m < 1) { ctx.save(); ctx.globalAlpha = 1 - m; const x = cx + Math.cos(mid) * 170, y = cy + Math.sin(mid) * 170; rr(ctx, x - 52, y - 32, 104, 64, 4, i === (selIdx + 1) % n ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', '#FFFFFF', 2); T(ctx, ITEMS[i], x, y + 7, 16, 600, '#FFFFFF', 'center'); ctx.restore(); }
        if (m > 0) { ctx.save(); ctx.globalAlpha = m; const on = i === selIdx; ctx.fillStyle = on ? 'rgba(91,141,239,0.85)' : 'rgba(255,255,255,0.1)'; ctx.beginPath(); ctx.arc(cx, cy, 225, a0 + 0.02, a0 + step - 0.02); ctx.arc(cx, cy, 110, a0 + step - 0.02, a0 + 0.02, true); ctx.closePath(); ctx.fill(); const x = cx + Math.cos(mid) * 168, y = cy + Math.sin(mid) * 168; T(ctx, ITEMS[i], x, y + 7, 16, 600, '#FFFFFF', 'center'); ctx.restore(); }
      }
      // the stick, and its direction
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 3; ctx.setLineDash([4, 8]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(dir) * 100, cy + Math.sin(dir) * 100); ctx.stroke(); ctx.restore();
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(cx, cy, 8, 0, TAU); ctx.fill();
      rr(ctx, 860, GB - 130, 100, 100, 50, 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0.4)', 2); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(910 + Math.cos(dir) * 26, GB - 80 + Math.sin(dir) * 26, 16, 0, TAU); ctx.fill();
      chip(ctx, 'Boxes on a ring', 80, 856, m < 0.5, ez(v, 0.6, 1.4));
      chip(ctx, 'Slices that match the stick', 80, 934, m >= 0.5, ez(v, 2.8, 3.4));
    },
    hits: [[2.8, 'morph', 'whoosh', { len: 0.6 }], [4.6, 'stick', 'tick'], [5.4, 'slice', 'tick'], [6.2, 'select', 'pop', { pitch: 'A5' }]],
  };

  // ---------------------------------------------------------------- 6. keep your signature, modernise the behaviour
  function hud(ctx, v, heavy) {
    scene(ctx, v, { speed: 0.8 });
    minimap(ctx, 1, { heavy, route: 1, s: heavy ? 190 : 176 });
    pips(ctx, GX + GW - 26, GY + 44, 2, 1, heavy ? 1.15 : 1, heavy);
    if (heavy) { rr(ctx, GX + GW - 236, GY + 72, 210, 46, 6, 'rgba(0,0,0,0.6)', '#C9A227', 3); T(ctx, '$ 12,480', GX + GW - 131, GY + 104, 26, 700, '#7CFC00', 'center', F.mono); }
    else T(ctx, '$12,480', GX + GW - 30, GY + 96, 24, 600, '#FFFFFF', 'right', F.mono);
  }
  const L6 = {
    draw(ctx, v) {
      const d = lerp(GX + GW, GX + GW * 0.5, ez(v, 2.4, 4, E.inOutCubic));
      ctx.save(); ctx.beginPath(); ctx.rect(GX, GY - 20, d - GX, GH + 40); ctx.clip(); hud(ctx, v, true); ctx.restore();
      if (d < GX + GW) { ctx.save(); ctx.beginPath(); ctx.rect(d, GY - 20, GX + GW - d, GH + 40); ctx.clip(); hud(ctx, v, false); ctx.restore(); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(d - 1.5, GY, 3, GH); rr(ctx, d - 18, GY + GH / 2 - 18, 36, 36, 18, '#FFFFFF'); T(ctx, '⇆', d, GY + GH / 2 + 7, 20, 700, '#111', 'center'); }
      const la = ez(v, 3.2, 3.8); if (la > 0) { ctx.save(); ctx.globalAlpha = la; [['BEFORE', GX + 20], ['AFTER', d + 20]].forEach(([l, x]) => { ctx.font = `600 18px ${F.mono}`; const w = ctx.measureText(l).width + 24; rr(ctx, x, GB - 46, w, 32, 6, 'rgba(14,16,21,0.85)'); T(ctx, l, x + 12, GB - 24, 18, 600, l === 'AFTER' ? '#7FB0FF' : '#C9CDD5', 'left', F.mono); }); ctx.restore(); }
      [['Map: same corner', true], ['Level: same pips', true], ['Money: same corner', true], ['New: lighter, shown when needed', false]].forEach(([l, same], i) => {
        const s2 = ez(v, 4.4 + i * 0.5, 5 + i * 0.5); if (s2 <= 0) return;
        const y = 870 + i * 66; ctx.save(); ctx.globalAlpha = s2; ctx.translate((1 - s2) * 20, 0);
        ctx.fillStyle = same ? C.green : C.sel; ctx.beginPath(); ctx.arc(100, y, 18, 0, TAU); ctx.fill(); T(ctx, same ? '✓' : '+', 100, y + 8, 22, 700, '#FFFFFF', 'center'); T(ctx, l, 132, y + 10, 28, 600, '#EDEDED');
        ctx.restore();
      });
    },
    hits: [[2.4, 'wipe', 'whoosh', { len: 0.7 }], [4.4, 'same 1', 'pop', { pitch: 'D5' }], [4.9, 'same 2', 'pop', { pitch: 'E5' }], [5.4, 'same 3', 'pop', { pitch: 'F#5' }], [5.9, 'new', 'bell', { pitch: 'F#6' }]],
  };

  // ---------------------------------------------------------------- 7. accessible from day one
  const L7 = {
    draw(ctx, v) {
      const ts = ez(v, 2.6, 3.4, E.inOutCubic), bg = ez(v, 3.8, 4.4), cb = ez(v, 5, 5.6), nar = ez(v, 6.2, 6.8);
      scene(ctx, v, { speed: 0.6 });
      minimap(ctx, 1, { route: 1 });
      // map markers: red/green -> shapes + colour-blind-safe blue/yellow
      [[GX + 26 + 50, MM.y + 60, 0], [GX + 26 + 130, MM.y + 110, 1]].forEach(([x, y, k]) => { ctx.fillStyle = mix(k ? '#3DD68C' : RED, k ? '#FFD23F' : BLUE, cb); if (cb > 0.5 && k) { ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.lineTo(x + 10, y + 8); ctx.lineTo(x - 10, y + 8); ctx.closePath(); ctx.fill(); } else { ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill(); } });
      const fs = lerp(17, 30, ts), line = 'Meet me at the pier at nine.';
      ctx.font = `600 ${fs}px ${F.title}`; const w = ctx.measureText(line).width;
      if (bg > 0) rr(ctx, 540 - w / 2 - 18, GB - 196 - fs, w + 36, fs * 1.6, 8, `rgba(10,12,16,${0.78 * bg})`);
      T(ctx, line, 540, GB - 196, fs, 600, '#FFFFFF', 'center');
      // the accessibility panel
      panel(ctx, 80, 840, 920, 300);
      const rows = [['Text size', 'size'], ['Subtitle background', bg], ['Colour-blind mode', 'cb'], ['Menu narration', nar]];
      rows.forEach(([l, k], i) => {
        const y = 862 + i * 68; if (i) { ctx.fillStyle = '#3A3B42'; ctx.fillRect(110, y - 4, 860, 1); }
        T(ctx, l, 110, y + 42, 26, 500, '#EEEEF0');
        if (k === 'size') { ['S', 'M', 'L', 'XL'].forEach((s, j) => { const on = j === (ts > 0.5 ? 3 : 1); rr(ctx, 730 + j * 62, y + 12, 54, 40, 8, on ? BLUE : '#2E2F35', on ? null : '#44454D', 1); T(ctx, s, 757 + j * 62, y + 39, 18, 600, '#FFFFFF', 'center'); }); }
        else if (k === 'cb') { rr(ctx, 770, y + 12, 200, 40, 8, '#2E2F35', '#44454D', 1); T(ctx, cb > 0.5 ? 'Deuteranopia ⌄' : 'Off  ⌄', 790, y + 39, 18, 600, '#EEEEF0'); }
        else toggle(ctx, 914, y + 16, k);
        if (i === 3 && nar > 0) { ctx.save(); ctx.globalAlpha = nar; ctx.strokeStyle = BLUE; ctx.lineWidth = 3; [10, 20].forEach((r) => { ctx.beginPath(); ctx.arc(860, y + 32, r, -0.7, 0.7); ctx.stroke(); }); ctx.fillStyle = BLUE; ctx.fillRect(838, y + 24, 10, 16); ctx.restore(); }
      });
    },
    hits: [[2.6, 'size', 'click'], [3.4, 'bigger', 'tick'], [3.8, 'background', 'click'], [5, 'colour-blind', 'click'], [6.2, 'narration', 'pop', { pitch: 'A5' }], [6.9, 'done', 'bell', { pitch: 'F#6' }]],
  };

  // ---------------------------------------------------------------- recap + cover art: the clean HUD
  function clean(ctx, v) { scene(ctx, v, { speed: 1 }); minimap(ctx, 1, { route: 1, zone: 0.6 }); compass(ctx, 1); pips(ctx, GX + GW - 26, GY + 40, 2); edgeGlow(ctx, 0.6, 0.2); }
  const recapVig = { draw(ctx, v) { const s = ez(v, 0.4, 1.6, E.outCubic); ctx.save(); ctx.globalAlpha = s; ctx.translate(540, 560); ctx.scale(lerp(0.94, 1, s), lerp(0.94, 1, s)); ctx.translate(-540, -560); clean(ctx, v); ctx.restore(); }, hits: [[0.4, 'clean', 'whoosh', { len: 0.5 }], [1.6, 'settle', 'bell', { pitch: 'F#6' }]] };
  return { L: [L1, L2, L3, L4, L5, L6, L7], recapVig, clean };
}

export function gtaTopic(K, G, long) {
  const L = G.L, all = [
    { title: ['SHOW IT WHEN', 'IT MATTERS.'], ar: 'أظهر المعلومة عندما تفيد.', en: 'THE MAP HIDES UNTIL YOU NEED IT.', vig: L[0], seen: 'GTA VI · DYNAMIC MINIMAP', tip: 'IN APPS: SHOW SECONDARY TOOLS IN CONTEXT.', tipAr: 'في التطبيقات: أظهر الأدوات الثانوية في سياقها فقط.' },
    { title: ['SMART DEFAULT,', 'FULL CONTROL.'], ar: 'إعداد افتراضي ذكي، وتحكم كامل.', en: 'THREE PRESETS FIRST, DETAILS AFTER.', vig: L[1], seen: 'GTA VI · NAVIGATION SETTINGS', tip: 'THE DEFAULT IS WHAT MOST PEOPLE WILL SEE.', tipAr: 'الإعداد الافتراضي هو ما سيراه أغلب المستخدمين.' },
    { title: ['SIGNAL AT', 'THE EDGES.'], ar: 'نبّه من أطراف الشاشة.', en: 'NO ICONS EVERYWHERE: A ZONE AND A GLOW.', vig: L[2], seen: 'GTA VI · POLICE ALERTS', tip: 'IN APPS: A BADGE OR A BORDER BEATS A POP-UP.', tipAr: 'في التطبيقات: شارة أو إطار خفيف أفضل من نافذة منبثقة.' },
    { title: ['SHOW WHY,', 'NOT JUST HOW MUCH.'], ar: 'أظهر السبب، لا المقدار فقط.', en: 'THE LEVEL, PLUS WHAT THEY KNOW.', vig: L[3], seen: 'GTA VI · WANTED SYSTEM', tip: 'TELL USERS WHAT IS MISSING, NOT JUST "WEAK".', tipAr: 'قل للمستخدم ما الذي ينقصه، لا «ضعيفة» فقط.' },
    ...(long ? [{ title: ['THE FORM FOLLOWS', 'THE GESTURE.'], ar: 'الشكل يتبع الحركة.', en: 'A STICK TURNS IN A CIRCLE: USE SLICES.', vig: L[4], seen: 'CRITIQUE OF THE AUG. 2026 PREVIEW', tip: 'IN APPS: SWIPE ACTIONS FOR SWIPES, BUTTONS FOR TAPS.', tipAr: 'في التطبيقات: إجراءات السحب للسحب، والأزرار للنقر.' }] : []),
    { title: ['KEEP YOUR', 'SIGNATURE.'], ar: 'حافظ على بصمتك.', en: 'SAME ICONIC ELEMENTS, MODERN BEHAVIOR.', vig: L[5], seen: 'GTA VI · ICONIC HUD ELEMENTS', tip: 'REDESIGN? KEEP WHAT USERS RECOGNIZE FIRST.', tipAr: 'عند إعادة التصميم، حافظ أولًا على ما يتعرّف إليه المستخدمون.' },
    { title: ['ACCESSIBLE', 'FROM DAY ONE.'], ar: 'سهولة الوصول من البداية.', en: 'TEXT SIZE, SUBTITLES, COLOR-BLIND MODES.', vig: L[6], seen: 'GTA VI · ACCESSIBILITY MENU', tip: 'AND MAKE THESE SETTINGS EASY TO FIND.', tipAr: 'واجعل هذه الإعدادات سهلة الوصول.' },
  ];
  const items = all.map((it) => ({ ...it, tipAt: 11 }));
  const n = items.length, nAr = n === 7 ? 'سبعة' : 'ستة';
  const GTA = '‪GTA 6‬';
  return {
    fonts: ['400 20px Plex', '500 20px Plex', '600 20px Plex'],
    hook: { lines: ["WHAT GTA 6'S UI", 'TEACHES DESIGNERS.'], ar: `ماذا تعلّمنا واجهة ${GTA} عن التصميم؟`, en: `${n} LESSONS FOR APPS AND WEBSITES.`, tags: ['Minimap', 'Alerts', 'Settings', 'HUD', 'Subtitles', 'Map'] },
    items,
    label: (i) => `LESSON 0${i + 1} / 0${n}`,
    recap: { title: ['GAME UI,', 'REAL LESSONS.'], ar: `${nAr} دروس من واجهة لعبة.`, en: long ? 'CONTEXT · DEFAULTS · EDGES · WHY · FORM · SIGNATURE · ACCESS' : 'CONTEXT · DEFAULTS · EDGES · WHY · SIGNATURE · ACCESS', vig: G.recapVig },
    cover: {
      lines: ["WHAT GTA 6'S UI", 'TEACHES', 'DESIGNERS.'], ar: `ماذا تعلّمنا واجهة ${GTA} عن التصميم؟`,
      art: (ctx, x, y, w, h) => { const s = Math.min(w / 920, h / 518); ctx.save(); ctx.translate(x + (w - 920 * s) / 2, y + 10); ctx.scale(s, s); ctx.translate(-80, -300); G.clean(ctx, 3); ctx.restore(); },
    },
  };
}
