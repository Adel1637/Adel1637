// "UI in 2026: what's in, what's out" — vignettes (Short coordinates: x 80..1000, y 280..1150) and the
// film config for shared/kinetic-film.js. Facts checked online on 22 Nov 2026 (see the publication texts):
// Liquid Glass + iOS 27 transparency control, Material 3 Expressive on Pixel since Android 16, generative /
// agentic UI, bento grids, sharp minimal (1px borders), calm and accessible design; neo-brutalism as a full
// page and glass without contrast are fading. No numbers invented; every interface is fictional.
export function makeUI2026(M, K) {
  const { lerp, clamp, E, mix, hash01 } = M;
  const { F, C, TAU, ez, spr, txt, rr, pill, cursor, fit } = K;
  const cross = (ctx, x, y, p, col = C.red) => { if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.fill(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-16, -16); ctx.lineTo(16, 16); ctx.moveTo(16, -16); ctx.lineTo(-16, 16); ctx.stroke(); ctx.restore(); };
  const check = (ctx, x, y, p) => { if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(p, p); ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.fill(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-18, 2); ctx.lineTo(-5, 15); ctx.lineTo(19, -12); ctx.stroke(); ctx.restore(); };
  const toggle = (ctx, x, y, on, col = '#34C759') => { rr(ctx, x, y, 92, 54, 27, mix('#3A3A3C', col, on)); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(x + lerp(27, 65, on), y + 27, 22, 0, TAU); ctx.fill(); };

  // ---------------------------------------------------------------- glass (in: with contrast / out: without)
  function wallpaper(ctx, x, y, w, h, v, busy) {
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#9CCBE4'); g.addColorStop(0.55, '#3F86A8'); g.addColorStop(1, '#1D4E63');
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#F4F1D9'; ctx.beginPath(); ctx.arc(x + w * 0.75 - v * 4, y + h * 0.22, 70, 0, TAU); ctx.fill();
    [['#2F7A5E', 0.62, 0.0], ['#22624A', 0.72, 0.4], ['#174835', 0.84, 0.8]].forEach(([c, hh, k]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x, y + h); for (let i = 0; i <= 20; i++) { const px = x + (i / 20) * w; ctx.lineTo(px, y + h * hh + Math.sin(i * 0.9 + k * 3 + v * 0.15) * 40); } ctx.lineTo(x + w, y + h); ctx.fill(); });
    if (busy) for (let i = 0; i < 26; i++) { ctx.fillStyle = ['#FFFFFF', '#F7D84A', '#E5484D', '#0D99FF', '#111111'][i % 5]; ctx.globalAlpha = 0.85; ctx.fillRect(x + hash01(i, 1) * w, y + hash01(i, 2) * h, 40 + hash01(i, 3) * 160, 10 + hash01(i, 4) * 40); ctx.globalAlpha = 1; }
  }
  function glass(mode) {
    return {
      draw(ctx, v) {
        const op = spr(v, 2.4, { stiffness: 200, damping: 16 }); if (op <= 0) return;
        const X = 80, Y = 300, Wd = 920, Hd = 840, busy = mode === 'out';
        ctx.save(); ctx.globalAlpha = Math.min(1, op); ctx.beginPath(); ctx.roundRect(X, Y, Wd, Hd, 30); ctx.clip();
        wallpaper(ctx, X, Y, Wd, Hd, v, busy);
        const tint = mode === 'in' ? lerp(0.1, 0.62, ez(v, 5, 7, E.inOutCubic)) : lerp(0.04, 0.6, ez(v, 7.6, 9, E.inOutCubic));
        const fixed = mode === 'in' ? v >= 7 : v >= 9;
        const gx = 160, gy = 520, gw = 760, gh = 340, pop = spr(v, 3, { stiffness: 230, damping: 15 });
        ctx.save(); ctx.translate(540, gy + gh / 2); ctx.scale(lerp(0.92, 1, Math.min(1, pop)), lerp(0.92, 1, Math.min(1, pop))); ctx.translate(-540, -(gy + gh / 2));
        ctx.save(); ctx.beginPath(); ctx.roundRect(gx, gy, gw, gh, 44); ctx.clip(); ctx.filter = 'blur(22px)'; wallpaper(ctx, X, Y, Wd, Hd, v, busy); ctx.filter = 'none';
        ctx.fillStyle = `rgba(255,255,255,${tint})`; ctx.fillRect(gx, gy, gw, gh);
        const sh = ctx.createLinearGradient(0, gy, 0, gy + 60); sh.addColorStop(0, 'rgba(255,255,255,0.55)'); sh.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = sh; ctx.fillRect(gx, gy, gw, 60);
        ctx.restore();
        rr(ctx, gx, gy, gw, gh, 44, null, `rgba(255,255,255,${fixed ? 0.9 : 0.6})`, fixed ? 3 : 2);
        const ink = fixed ? '#111111' : mode === 'out' ? '#FFFFFF' : mix('#FFFFFF', '#111111', ez(v, 5, 7));
        txt(ctx, 'Morning walk', gx + 56, gy + 130, 64, { color: ink }); txt(ctx, 'Starts in 10 minutes · Riverside path', gx + 56, gy + 196, 30, { color: ink });
        rr(ctx, gx + 56, gy + 236, 200, 64, 32, fixed ? '#111111' : 'rgba(255,255,255,0.35)'); txt(ctx, 'Start', gx + 156, gy + 279, 28, { color: fixed ? '#FFFFFF' : ink, align: 'center' });
        ctx.restore();
        ctx.restore();
        // the iOS 27-style transparency control
        const sl = ez(v, 4.4, 5, E.outCubic);
        if (sl > 0) {
          ctx.save(); ctx.globalAlpha = sl; rr(ctx, 160, 940, 760, 120, 30, 'rgba(22,22,22,0.85)');
          txt(ctx, 'Clear', 200, 1010, 26, { color: '#FFFFFF' }); txt(ctx, 'Tinted', 880, 1010, 26, { color: '#FFFFFF', align: 'right' });
          const kx = lerp(330, 720, clamp((tint - 0.04) / 0.58)); rr(ctx, 330, 996, 390, 8, 4, '#555'); rr(ctx, 330, 996, kx - 330, 8, 4, C.sel);
          ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(kx, 1000, 18, 0, TAU); ctx.fill(); ctx.restore();
        }
        if (mode === 'out') cross(ctx, 900, 520, spr(v, 4.6, { stiffness: 320, damping: 11 }) * (v < 9 ? 1 : 0));
        if (fixed) pill(ctx, 'Readable ✓', 540, 430, spr(v, mode === 'in' ? 7.2 : 9.2, { stiffness: 300, damping: 12 }), C.green, 30);
      },
      hits: mode === 'in' ? [[2.4, 'wallpaper', 'thud', { pitch: 'D3' }], [3, 'glass', 'blip', { pitch: 'A6' }], [5, 'tint slider', 'riser', { len: 1.8 }], [7.2, 'readable', 'bell', { pitch: 'F#6' }]]
        : [[2.4, 'busy wallpaper', 'thud', { pitch: 'D3' }], [3, 'glass', 'blip', { pitch: 'A6' }], [4.6, 'unreadable', 'thud', { pitch: 'C2' }], [7.6, 'add tint', 'riser', { len: 1.4 }], [9.2, 'readable', 'bell', { pitch: 'F#6' }]],
    };
  }

  // ---------------------------------------------------------------- Material 3 Expressive: shapes morph, springy buttons
  function shape(ctx, cx, cy, R, kind, m) {
    ctx.beginPath();
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * TAU, cookie = 1 + 0.1 * Math.cos(9 * a), sq = 1 / ((Math.abs(Math.cos(a)) ** 4 + Math.abs(Math.sin(a)) ** 4) ** 0.25);
      const r = R * lerp(kind === 0 ? 1 : kind === 1 ? sq * 0.92 : cookie, kind === 0 ? sq * 0.92 : kind === 1 ? cookie : 1, m);
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
  }
  const expressive = {
    draw(ctx, v) {
      const op = spr(v, 2.4, { stiffness: 200, damping: 16 }); if (op <= 0) return;
      const cx = 540, cy = 720, w = 400, h = 840 * 0.98, x = cx - w / 2, y = cy - h / 2 + 4;
      ctx.save(); ctx.globalAlpha = Math.min(1, op);
      rr(ctx, x - 16, y - 16, w + 32, h + 32, 64, '#0A0A0A', '#3A3A3A', 2); rr(ctx, x, y, w, h, 52, '#F4FBF6');
      ctx.fillStyle = '#0A0A0A'; ctx.beginPath(); ctx.arc(cx, y + 30, 9, 0, TAU); ctx.fill();
      txt(ctx, 'Today', x + 32, y + 130, 64, { color: '#10291D' });
      const hero = spr(v, 3, { stiffness: 220, damping: 12 });
      ctx.save(); ctx.translate(cx, y + 300); ctx.scale(hero, hero); rr(ctx, -168, -120, 336, 240, 56, '#C4EED3'); txt(ctx, 'Focus time', -130, -30, 38, { color: '#10291D' }); txt(ctx, '2 sessions left', -130, 16, 26, { color: '#2F5A44' }); ctx.restore();
      // button group: the pressed one grows
      const pr = spr(v, 5.2, { stiffness: 380, damping: 16 }), labels = ['Day', 'Week', 'Month'];
      let bx = x + 32; const total = w - 64, base = (total - 16) / 3;
      labels.forEach((l, i) => { const ww = i === 1 ? base + 40 * pr : base - 20 * pr; rr(ctx, bx, y + 460, ww, 76, i === 1 ? lerp(38, 22, pr) : 38, i === 1 ? mix('#DDE8E0', '#1E6B48', Math.min(1, pr)) : '#DDE8E0'); txt(ctx, l, bx + ww / 2, y + 508, 26, { color: i === 1 && pr > 0.5 ? '#FFFFFF' : '#10291D', align: 'center' }); bx += ww + 8; });
      // the FAB morphs: circle -> squircle -> cookie -> circle, with springs
      const s1 = spr(v, 4, { stiffness: 260, damping: 11 }), s2 = spr(v, 7, { stiffness: 260, damping: 11 }), s3 = spr(v, 10, { stiffness: 260, damping: 11 });
      const kind = v < 7 ? 0 : v < 10 ? 1 : 2, m = v < 7 ? s1 : v < 10 ? s2 : s3;
      ctx.fillStyle = '#1E6B48'; shape(ctx, x + w - 100, y + h - 130, 62, kind, Math.min(1.08, m)); ctx.fill();
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + w - 122, y + h - 130); ctx.lineTo(x + w - 78, y + h - 130); ctx.moveTo(x + w - 100, y + h - 152); ctx.lineTo(x + w - 100, y + h - 108); ctx.stroke();
      ctx.restore();
      if (v >= 4.4 && v < 5.6) cursor(ctx, lerp(900, cx + 10, ez(v, 4.4, 5.1, E.inOutCubic)), lerp(1100, y + 500, ez(v, 4.4, 5.1, E.inOutCubic)));
    },
    hits: [[2.4, 'phone', 'thud', { pitch: 'D3' }], [3, 'hero', 'pop', { pitch: 'A5' }], [4, 'fab squircle', 'boing', { pitch: 'D4', to: 'A4' }], [5.2, 'press', 'click'], [7, 'fab cookie', 'boing', { pitch: 'A4', to: 'D5' }], [10, 'fab circle', 'boing', { pitch: 'D5', to: 'A4' }]],
  };

  // ---------------------------------------------------------------- generative UI: the screen assembles around the request, with a stop control
  const generative = {
    draw(ctx, v) {
      const op = spr(v, 2.4, { stiffness: 200, damping: 16 }); if (op <= 0) return;
      ctx.save(); ctx.globalAlpha = Math.min(1, op); rr(ctx, 80, 300, 920, 850, 28, '#1E1E1E', '#333', 2);
      const req = 'Plan a team offsite next month', n = Math.floor(ez(v, 2.8, 4.4, (q) => q) * req.length);
      rr(ctx, 380, 330, 590, 78, 39, C.sel); txt(ctx, req.slice(0, n), 410, 380, fit(ctx, req, 28, 540), { color: '#FFFFFF' });
      if (v >= 4.6 && v < 5.6) { const a = 0.4 + 0.4 * Math.sin(v * 9); txt(ctx, 'Building your plan…', 120, 470, 28, { w: 600, family: F.mono, color: `rgba(200,200,200,${a})` }); }
      const c1 = spr(v, 5.4, { stiffness: 220, damping: 14 });
      if (c1 > 0) { ctx.save(); ctx.translate(0, (1 - Math.min(1, c1)) * 80); ctx.globalAlpha *= Math.min(1, c1); rr(ctx, 120, 440, 400, 330, 22, '#2A2A2A'); txt(ctx, 'Pick dates', 150, 495, 30, { color: '#FFFFFF' }); for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) { const sel = r === 2 && c >= 2 && c <= 3; rr(ctx, 150 + c * 50, 530 + r * 56, 40, 40, 20, sel ? C.sel : '#3A3A3A'); } ctx.restore(); }
      const c2 = spr(v, 6.4, { stiffness: 220, damping: 14 });
      if (c2 > 0) { ctx.save(); ctx.translate(0, (1 - Math.min(1, c2)) * 80); ctx.globalAlpha *= Math.min(1, c2); rr(ctx, 550, 440, 410, 330, 22, '#2A2A2A'); txt(ctx, 'Venues', 580, 495, 30, { color: '#FFFFFF' }); ['Lakeside', 'City loft', 'Garden house'].forEach((s, i) => { rr(ctx, 580, 525 + i * 78, 350, 64, 14, i === 0 ? '#16324A' : '#333'); txt(ctx, s, 604, 567 + i * 78, 26, { color: '#FFFFFF' }); }); ctx.restore(); }
      const c3 = spr(v, 8.2, { stiffness: 220, damping: 15 });
      if (c3 > 0) {
        ctx.save(); ctx.translate(0, (1 - Math.min(1, c3)) * 60); ctx.globalAlpha *= Math.min(1, c3);
        rr(ctx, 120, 810, 840, 130, 22, '#262626', '#3A3A3A', 2);
        ctx.strokeStyle = C.sel; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(180, 875, 22, v * 6, v * 6 + 4.4); ctx.stroke();
        txt(ctx, 'Agent: booking rooms', 230, 865, 30, { color: '#FFFFFF' }); txt(ctx, 'Step 2 of 3 · you can stop anytime', 230, 905, 22, { w: 600, family: F.mono, color: C.sub });
        rr(ctx, 790, 840, 140, 70, 35, '#FFFFFF'); txt(ctx, 'Stop', 860, 885, 28, { color: '#111', align: 'center' });
        ctx.restore();
      }
      ctx.restore();
      if (v >= 9.4) cursor(ctx, lerp(700, 870, ez(v, 9.4, 10.2, E.inOutCubic)), lerp(1080, 890, ez(v, 9.4, 10.2, E.inOutCubic)));
    },
    hits: [[2.4, 'panel', 'thud', { pitch: 'D3' }], [2.8, 'prompt', 'type', { n: 14, len: 0.75 }], [5.4, 'dates', 'pop', { pitch: 'D5' }], [6.4, 'venues', 'pop', { pitch: 'F#5' }], [8.2, 'agent', 'blip', { pitch: 'A6' }], [10.2, 'stop hover', 'tick']],
  };

  // ---------------------------------------------------------------- bento grid
  const bento = {
    draw(ctx, v) {
      const cw = (920 - 48) / 4, ch = (820 - 32) / 3, X = 80, Y = 320;
      const T = [[0, 0, 2, 2, 'hero'], [2, 0, 2, 1, 'chart'], [2, 1, 1, 1, 'lock'], [3, 1, 1, 1, 'toggle'], [0, 2, 1, 1, 'team'], [1, 2, 3, 1, 'road']];
      T.forEach(([c, r, w, h, k], i) => {
        const s = spr(v, 2.6 + i * 0.35, { stiffness: 240, damping: 14 }); if (s <= 0) return;
        const x = X + c * (cw + 16), y = Y + r * (ch + 16), ww = w * cw + (w - 1) * 16, hh = h * ch + (h - 1) * 16;
        ctx.save(); ctx.translate(x + ww / 2, y + hh / 2); ctx.scale(lerp(0.85, 1, Math.min(1.03, s)), lerp(0.85, 1, Math.min(1.03, s))); ctx.globalAlpha = Math.min(1, s); ctx.translate(-(x + ww / 2), -(y + hh / 2));
        rr(ctx, x, y, ww, hh, 26, k === 'hero' ? C.sel : '#232323', k === 'hero' ? null : '#333', 2);
        if (k === 'hero') { txt(ctx, 'Plan less.', x + 36, y + 110, 58, { color: '#FFFFFF' }); txt(ctx, 'Ship more.', x + 36, y + 176, 58, { color: '#FFFFFF' }); txt(ctx, 'One calm place for your team.', x + 36, y + hh - 40, 24, { color: '#DCEBFF' }); }
        if (k === 'chart') { txt(ctx, 'Progress', x + 28, y + 50, 26, { color: '#FFFFFF' }); ctx.strokeStyle = C.green; ctx.lineWidth = 5; ctx.beginPath(); for (let j = 0; j <= 12; j++) { const px = x + 28 + j * (ww - 56) / 12, py = y + hh - 40 - (j / 12) * (hh - 120) - Math.sin(j * 1.3) * 18; j ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
        if (k === 'lock') { ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x + ww / 2, y + 90, 26, Math.PI, 0); ctx.stroke(); rr(ctx, x + ww / 2 - 38, y + 90, 76, 58, 10, '#FFFFFF'); txt(ctx, 'Secure', x + ww / 2, y + hh - 34, 24, { color: '#FFFFFF', align: 'center' }); }
        if (k === 'toggle') { toggle(ctx, x + ww / 2 - 46, y + 70, ez(v, 6.4, 6.9)); txt(ctx, 'Dark mode', x + ww / 2, y + hh - 34, 24, { color: '#FFFFFF', align: 'center' }); }
        if (k === 'team') { ['#0D99FF', '#30A46C', '#E2B203'].forEach((c2, j) => { ctx.fillStyle = c2; ctx.beginPath(); ctx.arc(x + 60 + j * 44, y + 100, 30, 0, TAU); ctx.fill(); ctx.strokeStyle = '#232323'; ctx.lineWidth = 5; ctx.stroke(); }); txt(ctx, 'Team', x + 28, y + hh - 34, 24, { color: '#FFFFFF' }); }
        if (k === 'road') { txt(ctx, 'Roadmap', x + 28, y + 50, 26, { color: '#FFFFFF' }); [0.8, 0.55, 0.3].forEach((f, j) => { rr(ctx, x + 28, y + 80 + j * 40, ww - 56, 18, 9, '#333'); rr(ctx, x + 28, y + 80 + j * 40, (ww - 56) * f * ez(v, 6.8 + j * 0.2, 7.6 + j * 0.2), 18, 9, j ? '#5A5A5A' : C.sel); }); }
        ctx.restore();
      });
    },
    hits: [0, 1, 2, 3, 4, 5].map((i) => [2.6 + i * 0.35, `tile ${i}`, 'pop', { pitch: ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'][i] }]).concat([[6.4, 'toggle', 'click']]),
  };

  // ---------------------------------------------------------------- sharp minimal: a soft card becomes sharp (1px borders, strong type)
  const sharp = {
    draw(ctx, v) {
      const op = spr(v, 2.4, { stiffness: 200, damping: 16 }); if (op <= 0) return;
      const k = ez(v, 5, 6.6, E.inOutCubic);
      ctx.save(); ctx.globalAlpha = Math.min(1, op);
      if (k < 1) { ctx.save(); ctx.globalAlpha *= 1 - k; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24; rr(ctx, 120, 330, 840, 780, 40, '#F0EEF6'); ctx.restore(); }
      rr(ctx, 120, 330, 840, 780, lerp(40, 4, k), mix('#F0EEF6', '#FFFFFF', k), k > 0.5 ? '#111111' : null, 2);
      txt(ctx, 'Projects', 170, 440, lerp(52, 84, k), { w: 700, color: '#111' });
      const rows = [['Website redesign', 'In review'], ['Mobile app', 'Building'], ['Help center', 'Done'], ['Onboarding', 'Planned']];
      rows.forEach(([a, b], i) => {
        const y = 520 + i * 130;
        if (k > 0.5) { ctx.fillStyle = '#111'; ctx.fillRect(170, y, 740, 1.5); }
        else rr(ctx, 170, y + 10, 740, 108, 24, '#E4E1EE');
        const hov = v >= 8 && Math.floor((v - 8) / 0.8) % 4 === i && v < 11.2;
        if (hov && k > 0.5) { ctx.fillStyle = '#F2F2F2'; ctx.fillRect(170, y + 2, 740, 126); }
        txt(ctx, a, 200, y + 76, 32, { color: '#111' }); txt(ctx, b.toUpperCase(), 880, y + 76, 22, { w: 600, family: F.mono, color: b === 'Done' ? C.green : '#555', align: 'right' });
      });
      ctx.restore();
      if (v >= 8 && v < 11.2) { const i = Math.floor((v - 8) / 0.8) % 4; cursor(ctx, 760, 590 + i * 130); }
    },
    hits: [[2.4, 'soft card', 'thud', { pitch: 'D3' }], [5, 'to sharp', 'air', { len: 0.4 }], [6.6, 'sharp', 'click'], [8, 'hover', 'tick'], [8.8, 'hover', 'tick'], [9.6, 'hover', 'tick'], [10.4, 'hover', 'tick']].map((h) => (h[2] === 'air' ? [h[0], h[1], 'whoosh', h[3]] : h)),
  };

  // ---------------------------------------------------------------- calm & accessible: reduce motion, larger text, more contrast
  const calm = {
    draw(ctx, v) {
      const op = spr(v, 2.4, { stiffness: 200, damping: 16 }); if (op <= 0) return;
      const rm = ez(v, 4, 4.5), big = ez(v, 6, 7.6, E.inOutCubic), hc = ez(v, 9, 9.5);
      ctx.save(); ctx.globalAlpha = Math.min(1, op);
      rr(ctx, 80, 300, 920, 420, 28, '#1E1E1E', '#333', 2);
      txt(ctx, 'Display & text', 120, 370, 34, { color: '#FFFFFF' });
      [['Reduce motion', rm], ['Increase contrast', hc]].forEach(([l, on], i) => { const y = 410 + i * 110; ctx.fillStyle = '#333'; ctx.fillRect(120, y, 840, 1.5); txt(ctx, l, 120, y + 70, 30, { color: '#FFFFFF' }); toggle(ctx, 860, y + 30, on); });
      txt(ctx, 'Text size', 120, 680, 30, { color: '#FFFFFF' }); rr(ctx, 420, 668, 460, 8, 4, '#555'); rr(ctx, 420, 668, 460 * lerp(0.3, 0.8, big), 8, 4, C.sel);
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(420 + 460 * lerp(0.3, 0.8, big), 672, 18, 0, TAU); ctx.fill();
      if (v >= 6 && v < 7.8) rr(ctx, 400, 640, 500, 64, 32, null, C.sel, 4);
      // the sample screen reacts
      rr(ctx, 80, 760, 920, 380, 28, mix('#F4F4F5', '#FFFFFF', hc), hc > 0.5 ? '#111' : null, 3);
      const fs = lerp(28, 40, big), ink = mix('#71717A', '#111111', hc);
      txt(ctx, 'Your order is on its way.', 130, 850, fs + 8, { color: '#111' });
      txt(ctx, 'Arrives tomorrow before noon.', 130, 850 + fs * 1.7, fs, { color: ink });
      rr(ctx, 130, 850 + fs * 2.6, 300, lerp(64, 84, big), 16, '#1A73E8'); txt(ctx, 'Track order', 280, 850 + fs * 2.6 + lerp(64, 84, big) / 2 + 10, lerp(26, 32, big), { color: '#FFFFFF', align: 'center' });
      ctx.restore();
    },
    hits: [[2.4, 'settings', 'thud', { pitch: 'D3' }], [4, 'reduce motion', 'click'], [6, 'text size', 'riser', { len: 1.6 }], [9, 'contrast', 'click'], [9.6, 'clearer', 'bell', { pitch: 'A5' }]],
  };

  // ---------------------------------------------------------------- out: full-page neo-brutalism -> keep it on one button
  const brutal = {
    draw(ctx, v) {
      const op = spr(v, 2.4, { stiffness: 200, damping: 16 }); if (op <= 0) return;
      const k = ez(v, 7, 8.4, E.inOutCubic);
      const box = (x, y, w, h, fill, keep = false) => { const kk = keep ? 0 : k; ctx.fillStyle = '#111'; if (kk < 1) { ctx.globalAlpha = 1 - kk; ctx.fillRect(x + 12, y + 12, w, h); ctx.globalAlpha = 1; } rr(ctx, x, y, w, h, lerp(0, 16, kk), mix(fill, '#FFFFFF', kk), kk < 0.7 ? '#111' : '#E4E4E7', lerp(6, 2, kk)); };
      ctx.save(); ctx.globalAlpha = Math.min(1, op);
      rr(ctx, 80, 300, 920, 850, 0, mix('#FFE14D', '#F7F7F8', k));
      box(130, 340, 820, 220, '#FF6FB5'); txt(ctx, 'BIG SALE', 170, 440, lerp(96, 60, k), { color: '#111' }); txt(ctx, 'Everything must go.', 170, 505, 30, { color: '#111' });
      box(130, 600, 390, 260, '#7FD1FF'); box(560, 600, 390, 260, '#9BE28C');
      txt(ctx, 'Shoes', 160, 680, 40, { color: '#111' }); txt(ctx, 'Bags', 590, 680, 40, { color: '#111' });
      ctx.save(); ctx.globalAlpha = 1; box(130, 920, 360, 120, '#FFE14D', true); txt(ctx, 'SHOP NOW', 310, 995, 40, { color: '#111', align: 'center' }); ctx.restore();
      ctx.restore();
      cross(ctx, 900, 360, spr(v, 4.4, { stiffness: 320, damping: 11 }) * (v < 7 ? 1 : 0));
      if (v >= 4.6 && v < 7) pill(ctx, 'Everything shouts', 640, 1040, spr(v, 4.6, { stiffness: 300, damping: 12 }), C.red, 26);
      if (v >= 8.6) { check(ctx, 560, 980, spr(v, 8.6, { stiffness: 320, damping: 11 })); pill(ctx, 'Accent only', 760, 980, spr(v, 8.9, { stiffness: 300, damping: 12 }), C.green, 26); }
    },
    hits: [[2.4, 'loud page', 'thud', { pitch: 'D3' }], [4.4, 'too much', 'thud', { pitch: 'C2' }], [7, 'calm down', 'whoosh', { len: 0.5 }], [8.6, 'accent only', 'bell', { pitch: 'F#6' }]],
  };

  // ---------------------------------------------------------------- recap: in / out
  const IN = ['Liquid Glass + contrast', 'Material 3 Expressive', 'Generative UI', 'Bento grids', 'Sharp minimal', 'Calm & accessible'], OUT = ['Full-page brutalism', 'Glass without contrast'];
  const recapVig = {
    draw(ctx, v) {
      txt(ctx, 'IN', 80, 330, 30, { w: 600, family: F.mono, color: C.green, alpha: ez(v, 1, 1.4) });
      IN.forEach((s, i) => { const p = spr(v, 1.2 + i * 0.3, { stiffness: 230, damping: 15 }); if (p <= 0) return; ctx.save(); ctx.translate(lerp(-600, 0, Math.min(1, p)), 0); rr(ctx, 80, 350 + i * 96, 560, 80, 16, '#232323'); ctx.fillStyle = C.green; ctx.fillRect(80, 350 + i * 96, 8, 80); txt(ctx, s, 110, 402 + i * 96, fit(ctx, s, 30, 500), { color: '#FFFFFF' }); ctx.restore(); });
      txt(ctx, 'OUT', 680, 330, 30, { w: 600, family: F.mono, color: C.red, alpha: ez(v, 3, 3.4) });
      OUT.forEach((s, i) => { const p = spr(v, 3.2 + i * 0.4, { stiffness: 230, damping: 15 }); if (p <= 0) return; ctx.save(); ctx.translate(lerp(600, 0, Math.min(1, p)), 0); rr(ctx, 680, 350 + i * 96, 320, 80, 16, '#232323'); txt(ctx, s, 700, 402 + i * 96, fit(ctx, s, 26, 280), { color: C.sub }); ctx.fillStyle = C.red; ctx.fillRect(700, 392 + i * 96, Math.min(1, ez(v, 3.8 + i * 0.4, 4.3 + i * 0.4)) * 280, 4); ctx.restore(); });
    },
    hits: [...IN.map((_, i) => [1.2 + i * 0.3, `in ${i}`, 'pop', { pitch: ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6'][i] }]), [3.2, 'out 0', 'thud', { pitch: 'C3' }], [3.6, 'out 1', 'thud', { pitch: 'A2' }], [3.8, 'strike', 'whoosh', { len: 0.3 }]],
  };

  return { glassIn: glass('in'), glassOut: glass('out'), expressive, generative, bento, sharp, calm, brutal, recapVig, IN, OUT };
}

export function ui2026Topic(K, U, long) {
  const { rr, txt, F, C } = K;
  const items = [
    { part: 0, title: ['LIQUID GLASS,', 'DONE RIGHT.'], ar: 'زجاج Liquid Glass مع تباين كافٍ.', en: "APPLE'S GLASS, WITH ENOUGH CONTRAST.", vig: U.glassIn, seen: 'Safari · Apple Music (iOS 26+)', tip: 'SINCE IOS 27, USERS CAN SET HOW CLEAR THE GLASS IS.', tipAr: 'منذ iOS 27 يستطيع المستخدم ضبط شفافية الزجاج.', tipAt: 12 },
    { part: 0, title: ['MATERIAL 3', 'EXPRESSIVE.'], ar: 'أسلوب Material 3 Expressive من Google.', en: 'BOLDER SHAPES AND SPRINGY MOTION ON ANDROID.', vig: U.expressive, seen: 'Gmail · Google Photos · Clock', tip: 'ON PIXEL PHONES SINCE ANDROID 16.', tipAr: 'متوفر على هواتف Pixel منذ Android 16.', tipAt: 12 },
    { part: 0, title: ['GENERATIVE', 'UI.'], ar: 'واجهات تتكوّن حسب حاجة المستخدم.', en: 'SCREENS THAT ASSEMBLE AROUND THE TASK.', vig: U.generative, seen: 'Gemini · Google AI Mode · Claude · ChatGPT', tip: 'SHOW WHAT THE AI IS DOING, AND A WAY TO STOP IT.', tipAr: 'أظهر ما يفعله الذكاء الاصطناعي، مع زر لإيقافه.', tipAt: 12 },
    { part: 0, title: ['BENTO', 'GRIDS.'], ar: 'شبكات Bento: مربعات بأحجام مختلفة.', en: 'ONE MESSAGE PER TILE.', vig: U.bento, seen: 'Linear · Vercel · Framer', real: { img: 'vercel', url: 'vercel.com', label: 'VERCEL', at: 9, atLong: 14 }, tip: 'LET WHITE SPACE CARRY THE HIERARCHY.', tipAr: 'اترك المساحات الفارغة ترتّب الأولويات.', tipAt: 10 },
    { part: 0, title: ['SHARP', 'MINIMAL.'], ar: 'بساطة حادّة: خطوط رفيعة وخط عريض.', en: '1PX BORDERS, STRONG TYPE, FEW COLORS.', vig: U.sharp, seen: 'Linear · Vercel', real: { img: 'linear', url: 'linear.app', label: 'LINEAR', at: 9, atLong: 14 }, tip: 'GREAT FOR SAAS AND PRO TOOLS.', tipAr: 'مثالية لبرامج SaaS والأدوات الاحترافية.', tipAt: 12 },
    { part: 0, title: ['CALM &', 'ACCESSIBLE.'], ar: 'تصميم هادئ وسهل الوصول للجميع.', en: 'ACCESSIBILITY IS THE BASELINE.', vig: U.calm, seen: 'iOS: Reduce Motion · Increase Contrast', tip: 'RESPECT REDUCE MOTION AND LARGER TEXT.', tipAr: 'احترم إعدادات تقليل الحركة وتكبير النص.', tipAt: 12 },
    { part: 1, title: ['OUT: FULL-PAGE', 'BRUTALISM.'], ar: 'المتراجع: أسلوب Neo-brutalism في الصفحة كلها.', en: 'KEEP IT AS AN ACCENT ON ONE BUTTON.', vig: U.brutal, tip: 'AVOID IT WHERE READING MATTERS MOST.', tipAr: 'تجنّبه حيث تهمّ القراءة أكثر.', tipAt: 12 },
    { part: 1, title: ['OUT: GLASS', 'WITHOUT CONTRAST.'], ar: 'المتراجع: زجاج بلا تباين كافٍ.', en: 'IF TEXT IS HARD TO READ, ADD A TINT.', vig: U.glassOut, seen: 'early iOS 26 betas, fixed later', tip: 'TEST TEXT OVER YOUR BUSIEST BACKGROUND.', tipAr: 'اختبر النص فوق أكثر الخلفيات ازدحامًا.', tipAt: 12.5 },
  ];
  if (!long) items.forEach((it) => { it.len = 12; });
  return {
    images: { vercel: 'assets/real-vercel.jpg', linear: 'assets/real-linear.jpg' },
    hook: { lines: ['UI IN 2026:', "WHAT'S IN,", "WHAT'S OUT."], ar: 'الواجهات في 2026: ما الرائج وما المتراجع؟', en: '6 STYLES IN, 2 OUT.', tags: ['Glass', 'Bento', 'M3', 'AI UI', '1px', 'Calm'] },
    parts: [{ en: "WHAT'S IN", ar: 'الرائج في 2026', count: '6 STYLES' }, { en: "WHAT'S OUT", ar: 'المتراجع', count: '2 STYLES' }],
    items,
    label: (i) => (i < 6 ? `IN · 0${i + 1} / 06` : `OUT · 0${i - 5} / 02`),
    recap: { title: ['DESIGN FOR', 'CLARITY.'], ar: 'صمّم من أجل الوضوح.', en: 'TRENDS CHANGE. READABLE STAYS.', vig: U.recapVig },
    cover: {
      lines: ['UI IN 2026:', "WHAT'S IN,", "WHAT'S OUT."], ar: 'الواجهات في 2026: ما الرائج وما المتراجع؟',
      art: (ctx, x, y, w, h) => { const tiles = ['Liquid Glass', 'Bento', 'Material 3', 'Generative UI', 'Sharp minimal', 'Calm']; const cw = (w - 20) / 2, chh = Math.min(110, (h - 40) / 3); tiles.forEach((s, i) => { const tx = x + (i % 2) * (cw + 20), ty = y + Math.floor(i / 2) * (chh + 20); rr(ctx, tx, ty, cw, chh, 18, i === 0 ? C.sel : '#262626', '#3A3A3A', 2); txt(ctx, s, tx + 24, ty + chh / 2 + 12, 34, { color: '#FFFFFF' }); }); },
    },
  };
}
