// "Code for designers" films: a code panel types a real snippet, a fictional interface reacts below it.
// One builder for the Shorts (9:16) and the long video (16:9).
//   makeCodeFilm(M, A, { layout: 'portrait' | 'landscape', series, hook, parts: [{ title?, ar?, steps: [...] }], recap, cover })
// step: { title, ar, en2, ar2, label, file, code: [lines], preview: 'html' | 'css' | 'js' | 'swiftui' | 'python' |
//         'web' | 'react' | 'ios' | 'android' | 'flutter' }
// Hook rules (shared/accroche.md): hook text + full card on frame 0, motion + sound in the first half second.
export function makeCodeFilm(M, A, cfg) {
  const { E, prog, clamp, lerp, springU, SPRING, font, rrect, mix, TAU } = M;
  const { C, F, L } = A;
  const PORT = cfg.layout === 'portrait';
  const BRAND = '#6D4AFF', G1 = '#6B7280', G3 = '#E5E7EB';
  const LAY = PORT
    ? { l: L.left, r: L.right, titleY: 395, badgeY: 330, size: 74, arMax: 54, en: 34, ar2: 32, frame: { x: 142, y: 752, w: 796, h: 760 }, card: { x: 162, y: 772, w: 756, h: 720 }, labelY: 726, progY: 676 }
    : { l: 120, r: 1000, titleY: 404, badgeY: 338, size: 76, arMax: 58, en: 38, ar2: 35, frame: { x: 1080, y: 170, w: 720, h: 840 }, card: { x: 1100, y: 190, w: 680, h: 800 }, labelY: 146, progY: 990 };
  const CARD = LAY.card, FRAME = LAY.frame;
  const SPAN = PORT ? 13 : 20, HOOK = PORT ? 6 : 8, PARTD = 6, RECAPD = PORT ? 8 : 14, ENDD = PORT ? 10 : 14;

  // ---------------------------------------------------------------- timeline
  const seg = []; let t = HOOK; const steps = [];
  cfg.parts.forEach((p, j) => {
    if (p.title) { seg.push({ type: 'part', at: t, end: t + PARTD, p, j }); t += PARTD; }
    p.steps.forEach((s, i) => { const st = { ...s, n: i + 1, at: t, end: t + SPAN }; seg.push({ type: 'step', ...st, s: st }); steps.push(st); t += SPAN; });
  });
  const RECAP = t, END = RECAP + RECAPD, TOTAL = END + ENDD;

  // ---------------------------------------------------------------- hits
  const HITS = [];
  const hit = (b, l, s, o) => HITS.push(o ? [b, l, s, o] : [b, l, s]);
  hit(0, 'hook on screen', 'click'); hit(0.5, 'hook motion', 'tick'); hit(1.6, 'pulse', 'tick'); hit(3.2, 'pulse', 'tick');
  seg.forEach((g) => {
    if (g.type === 'part') { hit(g.at, 'part', 'type', { n: 6, len: 0.6 }); hit(g.at + 0.6, 'part arabic', 'pop', { pitch: 'C#6' }); return; }
    hit(g.at - 0.1, `${g.title} badge`, 'pop', { pitch: 'E6' }); hit(g.at + 0.1, `${g.title} title`, 'type', { n: 5, len: 0.5 });
    hit(g.at + 0.9, `${g.title} code`, 'type', { n: 14, len: PORT ? 1.6 : 2.4 });
    hit(g.at + (PORT ? 5 : 7), `${g.title} run`, 'click'); hit(g.at + (PORT ? 6.5 : 9), `${g.title} result`, 'bell', { pitch: 'E6' });
  });
  hit(RECAP, 'recap', 'type', { n: 6, len: 0.6 }); hit(RECAP + 1.2, 'answer', 'pop', { pitch: 'A6' });
  hit(END - 0.9, 'circle', 'click'); hit(END + 0.1, 'keep it', 'pop', { pitch: 'A5' }); hit(END + 2.2, 'follow', 'pop', { pitch: 'A6' });

  // ---------------------------------------------------------------- text
  const T = (ctx, s, x, y, size, weight, color, align = 'left', fam = F.latin, alpha = 1) => {
    if (alpha <= 0) return; ctx.save(); ctx.globalAlpha *= alpha; ctx.font = font(size, weight, fam); ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(s, x, y); ctx.restore();
  };
  const box = (ctx, x, y, w, h, r, fill, stroke = null, lw = 1) => { rrect(ctx, x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); } };
  function fit(ctx, s, max, w, fam, rtl, weight = 700) { ctx.font = font(max, weight, fam); ctx.direction = rtl ? 'rtl' : 'ltr'; const m = ctx.measureText(s).width; ctx.direction = 'ltr'; return Math.min(max, Math.floor(max * w / m)); }
  function block(ctx, u, b, exit, d) {
    const hb = d.n != null, tx = hb ? LAY.l + 100 : LAY.l, cw = LAY.r - LAY.l;
    ctx.font = font(LAY.size, 800, F.latin); ctx.letterSpacing = `${-0.035 * LAY.size}px`; const tw = ctx.measureText(d.title).width; ctx.letterSpacing = '0px';
    const size = hb ? Math.min(LAY.size, Math.floor(LAY.size * (LAY.r - tx) / tw)) : (d.size || LAY.size);
    if (hb) A.badge(ctx, d.n, LAY.l, LAY.badgeY, springU(u, b - 0.15, SPRING.bouncy) * (1 - E.inCubic(prog(u, exit, exit + 0.4))));
    const tt = A.riseWords(ctx, u, b, d.title, { x: tx, y: LAY.titleY, size, maxW: d.maxW || LAY.r - tx, stagger: 0.09, hl: d.hl || [], hlAt: d.hlAt, exit });
    const y1 = tt.bottom + (PORT ? 82 : 96), lag = d.lag == null ? 1 : d.lag;
    A.line(ctx, u, b + lag * 0.6, d.ar, { x: LAY.r, y: y1, size: fit(ctx, d.ar, LAY.arMax, cw, F.arabic, true), weight: 700, color: C.blue, align: 'right', rtl: true, exit: exit + 0.05 });
    if (d.en2) A.line(ctx, u, b + lag * 1.1, d.en2, { x: LAY.l, y: y1 + (PORT ? 70 : 78), size: fit(ctx, d.en2, LAY.en, cw, F.latin, false, 500), weight: 500, color: C.grey, align: 'left', exit: exit + 0.1 });
    if (d.ar2) A.line(ctx, u, b + lag * 1.5, d.ar2, { x: LAY.r, y: y1 + (PORT ? 124 : 136), size: fit(ctx, d.ar2, LAY.ar2, cw, F.arabic, true, 500), weight: 500, color: C.grey, align: 'right', rtl: true, exit: exit + 0.15 });
  }
  function label(ctx, u, u0, exit, text) {
    const k = u0 < 0 ? 1 : springU(u, u0, SPRING.snappy), ex = E.inCubic(prog(u, exit, exit + 0.3));
    if (k <= 0 || ex >= 1) return;
    ctx.save(); ctx.globalAlpha = clamp(k * 1.5) * (1 - ex); ctx.font = font(28, 600, F.latin); ctx.fillStyle = C.blue; ctx.textAlign = 'left'; ctx.fillText(text, FRAME.x, LAY.labelY + (1 - k) * 12); ctx.restore();
  }

  // ---------------------------------------------------------------- code panel
  const KW = /\b(const|function|return|await|async|import|as|class|Button|Text|VStack|Column|FilledButton|Modifier|def)\b/;
  function codeLine(ctx, line, x, y, size) {
    // strings green, numbers amber, keywords violet, the rest light
    const parts = line.split(/("[^"]*"?|'[^']*'?|\b\d+(?:\.\d+)?(?:px|dp)?\b)/);
    let cx = x; ctx.font = font(size, 600, F.mono); ctx.textAlign = 'left';
    parts.forEach((p) => {
      if (!p) return;
      let col = '#E5E7EB';
      if (/^["']/.test(p)) col = '#86EFAC'; else if (/^\d/.test(p)) col = '#FCD34D';
      else if (KW.test(p)) {
        p.split(KW).forEach((q) => { if (!q) return; ctx.fillStyle = KW.test(q) && /^[A-Za-z]+$/.test(q) ? '#C4B5FD' : '#E5E7EB'; ctx.fillText(q, cx, y); cx += ctx.measureText(q).width; });
        return;
      }
      ctx.fillStyle = col; ctx.fillText(p, cx, y); cx += ctx.measureText(p).width;
    });
    return cx;
  }
  function codePanel(ctx, x, y, w, h, s, typed, caret) {
    box(ctx, x, y, w, h, 20, '#0E1726');
    [C.red, '#F59E0B', C.green].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 26 + i * 22, y + 26, 7, 0, TAU); ctx.fill(); });
    T(ctx, s.file || '', x + w - 20, y + 32, 18, 700, '#9CA3AF', 'right', F.mono);
    const size = Math.min(PORT ? 24 : 22, Math.floor((w - 48) / (Math.max(...s.code.map((l) => l.length)) * 0.62)));
    let left = Math.floor(typed * s.code.join('').length), lastX = x + 24, lastY = y + 76;
    s.code.forEach((ln, i) => {
      if (left <= 0) return;
      const show = ln.slice(0, left); left -= ln.length;
      lastY = y + 76 + i * size * 1.55; lastX = codeLine(ctx, show, x + 24, lastY, size);
    });
    if (caret) { ctx.fillStyle = '#C4B5FD'; ctx.fillRect(lastX + 2, lastY - size * 0.85, 3, size * 1.05); }
  }

  // ---------------------------------------------------------------- previews (fictional UI)
  function devWeb(ctx, x, y, w, h) { box(ctx, x, y, w, h, 16, C.white, G3, 1.5); ctx.fillStyle = '#F3F4F6'; ctx.beginPath(); ctx.roundRect(x, y, w, 34, [16, 16, 0, 0]); ctx.fill(); [C.red, '#F59E0B', C.green].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 18 + i * 16, y + 17, 5, 0, TAU); ctx.fill(); }); box(ctx, x + 70, y + 9, w - 90, 16, 8, C.white); return { x: x + 16, y: y + 50, w: w - 32, h: h - 66 }; }
  function devPhone(ctx, x, y, w, h, android) { box(ctx, x, y, w, h, android ? 26 : 36, C.ink); box(ctx, x + 8, y + 8, w - 16, h - 16, android ? 20 : 30, '#F7F8FA'); if (android) { ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(x + w / 2, y + 22, 5, 0, TAU); ctx.fill(); } else box(ctx, x + w / 2 - 34, y + 14, 68, 18, 9, C.ink); return { x: x + 18, y: y + 46, w: w - 36, h: h - 64 }; }
  function joinCard(ctx, r, style, k, sc = 1) {
    const pad = 18 * sc, cw = Math.min(r.w, 360 * sc), x = r.x + (r.w - cw) / 2, y = r.y + 10 * sc, ch = 132 * sc;
    const rad = style === 'android' ? 14 * sc : style === 'ios' ? 18 * sc : 12 * sc;
    box(ctx, x, y, cw, ch, rad, style === 'android' ? '#F3EEFF' : C.white, G3, 1.2);
    T(ctx, 'Design review', x + pad, y + pad + 22 * sc, 22 * sc, 800, C.ink); T(ctx, 'Today · 10:00', x + pad, y + pad + 48 * sc, 15 * sc, 500, G1);
    const joined = k > 0.5, bw = 110 * sc, bh = 40 * sc, bx = x + pad, by = y + ch - pad - bh;
    box(ctx, bx, by, bw, bh, style === 'ios' ? 12 * sc : bh / 2, joined ? C.green : BRAND);
    T(ctx, joined ? 'Joined' : 'Join', bx + bw / 2, by + bh * 0.66, 16 * sc, 700, C.white, 'center');
    return { bx: bx + bw / 2, by: by + bh / 2 };
  }
  function preview(ctx, kind, x, y, w, h, k, v) {
    box(ctx, x, y, w, h, 20, '#F1F3F7');
    const cx = x + w / 2;
    if (kind === 'html') {
      const fx = x + 40, fy = y + 40;
      T(ctx, 'Email', fx, fy + 18, 18, 700, G1); box(ctx, fx, fy + 30, w - 80, 48, 10, C.white, G3, 1.5); T(ctx, 'sara@email.com', fx + 16, fy + 61, 17, 500, C.ink);
      box(ctx, fx, fy + 96, 150, 48, 12, BRAND); T(ctx, 'Save', fx + 75, fy + 127, 17, 700, C.white, 'center');
      [['<label>', fy + 4], ['<input>', fy + 46], ['<button>', fy + 112]].forEach(([tg, ty], i) => {
        const p = clamp(k * 3 - i); if (p <= 0) return;
        ctx.save(); ctx.globalAlpha = p; box(ctx, x + w - 170, ty, 130, 30, 15, C.green); T(ctx, tg, x + w - 105, ty + 21, 16, 700, C.white, 'center', F.mono); ctx.restore();
      });
      T(ctx, k > 0.5 ? 'Screen readers understand it' : 'Structure', fx, y + h - 24, 17, 700, k > 0.5 ? C.green : G1);
    } else if (kind === 'css') {
      const pad = lerp(6, 28, k), gap = lerp(2, 14, k), rad = lerp(0, 18, k), cw = w - 120;
      const bx = x + 60, by = y + 40;
      box(ctx, bx, by, cw, 64 + pad * 2 + gap * 2 + 60, rad, C.white, G3, 1.5);
      T(ctx, 'Design review', bx + pad, by + pad + 22, 22, 800, C.ink); T(ctx, 'Today · 10:00', bx + pad, by + pad + 46 + gap, 16, 500, G1);
      box(ctx, bx + pad, by + pad + 64 + gap * 2, 120, 44, lerp(0, 22, k), BRAND); T(ctx, 'Join', bx + pad + 60, by + pad + 92 + gap * 2, 16, 700, C.white, 'center');
      T(ctx, `padding ${Math.round(pad)} · gap ${Math.round(gap)} · radius ${Math.round(rad)}`, x + 40, y + h - 24, 17, 700, k > 0.5 ? C.green : C.red, 'left', F.mono);
    } else if (kind === 'js') {
      const ph = k <= 0 ? 0 : k < 0.5 ? 1 : 2, bw = 200, bx = cx - bw / 2, by = y + h / 2 - 30;
      box(ctx, bx, by, bw, 60, 30, ph === 2 ? C.green : BRAND);
      if (ph === 1) { ctx.strokeStyle = C.white; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(bx + 40, by + 30, 11, v * 6, v * 6 + 4.4); ctx.stroke(); }
      T(ctx, ['Save', 'Saving…', 'Saved'][ph], bx + bw / 2 + (ph === 1 ? 14 : 0), by + 39, 20, 700, C.white, 'center');
      T(ctx, ['idle', 'loading', 'success'][ph], cx, y + h - 26, 18, 700, ph === 2 ? C.green : G1, 'center', F.mono);
    } else if (kind === 'swiftui' || kind === 'ios') {
      const pw = Math.min(250, w * 0.5), phh = Math.min(h - 24, pw * 1.7), r = devPhone(ctx, cx - pw / 2, y + (h - phh) / 2, pw, phh, false);
      if (kind === 'ios') joinCard(ctx, r, 'ios', k, pw / 300);
      else {
        T(ctx, 'Profile', r.x + 6, r.y + 30, 22, 800, C.ink);
        const bw = r.w - 12, bx = r.x + 6, by = r.y + r.h - 70;
        if (k > 0.5) { box(ctx, bx, by, bw, 50, 14, '#0A84FF'); T(ctx, 'Save', bx + bw / 2, by + 32, 18, 700, C.white, 'center'); }
        else T(ctx, 'Save', bx + bw / 2, by + 32, 18, 600, '#0A84FF', 'center');
      }
    } else if (kind === 'python') {
      const data = [['Too slow', 0.9], ['Confusing', 0.65], ['Too many steps', 0.45], ['Other', 0.2]];
      data.forEach(([n, vv], i) => { const by = y + 40 + i * ((h - 100) / 4); T(ctx, n, x + 40, by + 26, 17, 700, C.ink); box(ctx, x + 230, by + 6, (w - 280) * vv * k, 28, 8, i === 0 ? BRAND : '#C4B5FD'); });
      T(ctx, 'Fictional survey data', x + 40, y + h - 20, 16, 600, G1);
    } else if (kind === 'web' || kind === 'react') {
      const r = devWeb(ctx, x + 30, y + 24, w - 60, h - 48), p = joinCard(ctx, r, 'web', kind === 'react' ? k : 0);
      if (kind === 'react' && k > 0 && k < 0.9) A.ripple(ctx, p.bx, p.by, clamp(k / 0.5));
    } else if (kind === 'android') {
      const pw = Math.min(250, w * 0.5), phh = Math.min(h - 24, pw * 1.7), r = devPhone(ctx, cx - pw / 2, y + (h - phh) / 2, pw, phh, true);
      joinCard(ctx, r, 'android', 0, pw / 300);
    } else if (kind === 'flutter') {
      const pw = Math.min(200, w * 0.4), phh = Math.min(h - 24, pw * 1.75);
      [[-1, false], [1, true]].forEach(([d, andr]) => { const r = devPhone(ctx, cx + d * (pw / 2 + 14) - pw / 2, y + (h - phh) / 2, pw, phh, andr); joinCard(ctx, r, andr ? 'android' : 'ios', 0, pw / 300); });
      T(ctx, 'One code, two apps', cx, y + h - 8, 17, 700, k > 0.5 ? C.green : G1, 'center');
    }
  }
  function stepCard(ctx, u, s) {
    const v = u - s.at, typeEnd = PORT ? 4.6 : 6.6, runAt = PORT ? 5 : 7;
    const typed = clamp((v - 0.8) / (typeEnd - 0.8)), k = E.inOutCubic(prog(v, runAt, runAt + 1.5));
    const ch = Math.round(CARD.h * 0.47);
    ctx.fillStyle = C.white; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
    codePanel(ctx, CARD.x + 16, CARD.y + 16, CARD.w - 32, ch, s, typed, v > 0.6 && v < typeEnd + 0.6 && Math.floor(u * 2) % 2 === 0);
    preview(ctx, s.preview, CARD.x + 16, CARD.y + ch + 32, CARD.w - 32, CARD.h - ch - 48, k, v);
    A.pill(ctx, 'Run', CARD.x + CARD.w - 30, CARD.y + ch - 40, { bg: BRAND, size: 22, align: 'right', p: springU(u, s.at + runAt - 0.3, SPRING.bouncy) * (1 - prog(v, runAt + 1.5, runAt + 2)) });
  }

  // ---------------------------------------------------------------- film
  const COVER = new URLSearchParams(location.search).get('cover');
  return {
    HITS, TOTAL, RECAP, END,
    run() {
      M.film({
        fonts: [font(74, 800, F.latin), font(34, 500, F.latin), font(54, 700, F.arabic), font(32, 500, F.arabic), font(24, 600, F.mono)],
        images: {}, hits: HITS,
        async init() { await Promise.all([F.arabic, ...(COVER ? ['CoverCairo'] : [])].flatMap((f) => [500, 600, 700, 800].map((w) => document.fonts.load(font(40, w, f), 'اللغة مصمم ٦').catch(() => {})))); },
        draw(ctx, u) {
          if (COVER) { cfg.cover(ctx, COVER, { A, M, F, C, L, stepCard, CARD, steps, preview, codePanel }); return; }
          if (u >= END) { if (PORT) A.endCard(ctx, u, END + 0.1); else A.endCardWide(ctx, u, END + 0.1); return; }
          A.paper(ctx);
          A.header(ctx, u, cfg.series, PORT ? { u0: -20 } : { u0: -20, y: 56, left: LAY.l, right: 1800 });
          if (u < HOOK) block(ctx, u, -20, HOOK - 0.55, { ...cfg.hook, hlAt: -20, lag: 0 });
          if (u < HOOK && cfg.hookExtra) cfg.hookExtra(ctx, u, { LAY, HOOK });
          seg.forEach((g) => {
            if (u < g.at - 0.3 || u >= g.end) return;
            if (g.type === 'part') block(ctx, u, g.at, g.end - 0.55, { title: g.p.title, ar: g.p.ar, en2: g.p.en2, ar2: g.p.ar2, hl: g.p.hl, hlAt: g.at + 1, size: 92 });
            else block(ctx, u, g.at, g.end - 0.55, g.s);
          });
          if (u >= RECAP - 0.3) block(ctx, u, RECAP, END + 1, { ...cfg.recap, hlAt: RECAP + 0.9 });
          let done = 0; steps.forEach((s) => { done += E.inOutCubic(prog(u, s.at, s.at + 0.8)); });
          A.progress(ctx, steps.length, done, { y: LAY.progY, x0: LAY.l, width: LAY.r - LAY.l, gap: steps.length > 6 ? 8 : 12, alpha: clamp(prog(u, HOOK - 0.5, HOOK)) * (1 - prog(u, RECAP + 0.3, RECAP + 1)) });
          if (u < HOOK) label(ctx, u, -1, HOOK - 0.4, cfg.hook.label);
          seg.forEach((g) => { if (u >= g.at - 0.2 && u < g.end) label(ctx, u, g.at + 0.3, g.end - 0.4, g.type === 'part' ? g.p.label : g.s.label); });
          if (u >= RECAP) label(ctx, u, RECAP + 0.3, END + 1, cfg.recap.label);
          A.shadow(ctx, 40, 14, 0.08); rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, 30); ctx.fillStyle = C.white; ctx.fill(); A.noShadow(ctx);
          ctx.save(); rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, 30); ctx.clip();
          const scenes = [{ a: 0, z: HOOK, draw: () => cfg.hookCard(ctx, u, { CARD, preview, codePanel, A, M, push: 1 + 0.08 * E.outCubic(prog(u, 0, 5)) }) }];
          seg.forEach((g) => scenes.push({ a: g.at, z: g.end, draw: () => (g.type === 'part' ? cfg.partCard(ctx, u, g, { CARD, preview }) : stepCard(ctx, u, g.s)) }));
          scenes.push({ a: RECAP, z: END + 1, draw: () => cfg.recapCard(ctx, u, { CARD, preview, RECAP, A, M }) });
          scenes.forEach((sc) => {
            if (u < sc.a - 0.3 || u >= sc.z + 1.2) return;
            const k = sc.a === 0 ? 1 : E.inOutCubic(prog(u, sc.a - 0.3, sc.a + 0.7));
            ctx.save(); ctx.translate(0, (1 - k) * CARD.h); A.shadow(ctx, 30, -10, 0.12); ctx.fillStyle = C.white; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h); A.noShadow(ctx); sc.draw(); ctx.restore();
          });
          ctx.restore();
          ctx.lineWidth = 2; ctx.strokeStyle = C.line; rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, 30); ctx.stroke();
          A.selection(ctx, FRAME.x, FRAME.y, FRAME.w, FRAME.h, { p: 1 });
          if (u >= END - 0.9) A.circleCover(ctx, CARD.x + CARD.w / 2, CARD.y + CARD.h / 2, prog(u, END - 0.9, END - 0.02));
        },
      });
    },
  };
}

// ---------------------------------------------------------------- shared content
export const UX_STEPS = [
  { title: 'HTML', ar: 'HTML: هيكل الصفحة', en2: 'Structure and accessibility.', ar2: 'الهيكل وإمكانية الوصول.', label: 'Form', file: 'form.html', preview: 'html',
    code: ['<label for="email">Email</label>', '<input id="email" type="email">', '<button>Save</button>'] },
  { title: 'CSS', ar: 'CSS: المسافات والتخطيط', en2: 'Spacing, layout, responsive.', ar2: 'المسافات والتخطيط والتجاوب.', label: 'Card', file: 'card.css', preview: 'css',
    code: ['.card {', '  padding: 24px;', '  gap: 16px;', '  border-radius: 16px;', '}'] },
  { title: 'JavaScript basics', ar: 'أساسيات JavaScript', en2: 'States: loading, error, success.', ar2: 'الحالات: تحميل، خطأ، نجاح.', label: 'Button', file: 'save.js', preview: 'js',
    code: ['button.onclick = async () => {', '  button.textContent = "Saving…";', '  await save();', '  button.textContent = "Saved";', '};'] },
  { title: 'SwiftUI or Compose', ar: 'SwiftUI أو Compose', en2: 'Native app components.', ar2: 'مكوّنات التطبيقات الأصلية.', label: 'iPhone', file: 'Profile.swift', preview: 'swiftui',
    code: ['Button("Save") { save() }', '  .buttonStyle(.borderedProminent)'] },
  { title: 'Python', ar: 'Python: أبحاث المستخدمين', en2: 'Read surveys and A/B tests.', ar2: 'حلّل الاستبيانات واختبارات A/B.', label: 'Survey', file: 'survey.py', preview: 'python',
    code: ['import pandas as pd', 'answers = pd.read_csv("survey.csv")', 'answers["issue"].value_counts().plot.bar()'] },
];
export const UI_STEPS = [
  { title: 'Web: HTML + CSS', ar: 'الويب: HTML وCSS', en2: 'The base of every web interface.', ar2: 'أساس كل واجهة ويب.', label: 'Browser', file: 'card.html', preview: 'web',
    code: ['<article class="card">', '  <h3>Design review</h3>', '  <button>Join</button>', '</article>'] },
  { title: 'Interactive web: React', ar: 'الويب التفاعلي: React', en2: 'JavaScript or TypeScript + a framework.', ar2: 'JavaScript أو TypeScript مع إطار عمل.', label: 'Browser', file: 'Card.tsx', preview: 'react',
    code: ['const [joined, setJoined] = useState(false);', 'return <button onClick={() => setJoined(true)}>', '  {joined ? "Joined" : "Join"}', '</button>;'] },
  { title: 'iPhone: Swift', ar: 'iPhone: لغة Swift', en2: 'SwiftUI for native iOS screens.', ar2: 'SwiftUI لشاشات iOS الأصلية.', label: 'iPhone', file: 'Card.swift', preview: 'ios',
    code: ['VStack(alignment: .leading) {', '  Text("Design review").font(.headline)', '  Button("Join") { join() }', '}'] },
  { title: 'Android: Kotlin', ar: 'Android: لغة Kotlin', en2: 'Jetpack Compose for native Android.', ar2: 'Jetpack Compose لتطبيقات Android الأصلية.', label: 'Android', file: 'Card.kt', preview: 'android',
    code: ['Column(Modifier.padding(24.dp)) {', '  Text("Design review")', '  Button(onClick = { join() }) { Text("Join") }', '}'] },
  { title: 'Both: Flutter', ar: 'الاثنان معًا: Flutter', en2: 'Dart, one code for iPhone and Android.', ar2: 'لغة Dart، كود واحد لـ iPhone وAndroid.', label: 'iPhone + Android', file: 'card.dart', preview: 'flutter',
    code: ['Column(children: [', "  Text('Design review'),", "  FilledButton(onPressed: join, child: Text('Join')),", '])'] },
];
