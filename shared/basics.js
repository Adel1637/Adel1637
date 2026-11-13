// Builder for the "UI/UX basics" Shorts (9:16): hook -> 5 basics (before -> after on one fictional
// interface that improves step by step) -> before/after recap -> blue end page.
// Hook rules (shared/accroche.md): frame 0 already shows the hook text + the faulty interface,
// motion and a sound in the first half second, first basic before 3 s.
//
//   basicsShort(M, A, MK.web | MK.app, cfg)   — see basics-web/film.js for cfg.

export function basicsShort(M, A, MOCK, cfg) {
  const { E, prog, lerp, clamp, springU, springKeys, SPRING, font, rrect } = M;
  const { C, F, L } = A;
  const FRAME = { x: 142, y: 752, w: 796, h: 760 };
  const CARD = { x: 162, y: 772, w: 756, h: 720, r: 32 };
  const HOOK_END = 6, SPAN = 16, B0 = 6, RECAP = B0 + 5 * SPAN, END = RECAP + 10;
  const startOf = (i) => B0 + i * SPAN;
  const s0 = cfg.fit === 'height' ? CARD.h / MOCK.h : CARD.w / MOCK.w;
  const ease = E.inOutCubic;

  // ---------------------------------------------------------------- hits
  const HITS = [];
  const hit = (b, label, sfx, o) => HITS.push(o ? [b, label, sfx, o] : [b, label, sfx]);
  hit(0, 'hook on screen', 'click');
  hit(0.5, 'hook motion', 'tick');
  hit(1.2, 'hook arabic', 'pop', { pitch: 'C#6' });
  hit(2.2, 'hook grey lines', 'tick');
  (cfg.hook.hits || []).forEach((h) => hit(...h));
  cfg.steps.forEach((s, i) => {
    const b = startOf(i);
    hit(b - 0.1, `${s.title} badge`, 'pop', { pitch: 'E6' });
    hit(b + 0.1, `${s.title} title`, 'type', { n: 5, len: 0.5 });
    hit(b + 2.4, `${s.title} mistake`, 'blip', { pitch: 'C5' });
    hit(b + 5, `${s.title} fix`, s.fixSfx || 'click', s.fixSfx === 'type' ? { n: 10, len: 1.3 } : undefined);
    hit(b + 8.2, `${s.title} fixed`, 'bell', { pitch: 'E6' });
    (s.hits || []).forEach(([v, l, sfx, o]) => hit(b + v, `${s.title} ${l}`, sfx, o));
  });
  hit(RECAP, 'recap title', 'type', { n: 5, len: 0.5 });
  hit(RECAP + 1.2, 'before', 'pop', { pitch: 'A5' });
  hit(RECAP + 2.0, 'after', 'pop', { pitch: 'E6' });
  hit(END - 0.9, 'circle to end', 'click');
  hit(END + 0.1, 'keep it', 'pop', { pitch: 'A5' });
  hit(END + 0.6, 'simple', 'pop', { pitch: 'E6' });
  hit(END + 2.2, 'follow pill', 'pop', { pitch: 'A6' });

  // ---------------------------------------------------------------- state of the interface at u
  function stateAt(u) {
    const st = { p: [0, 0, 0, 0, 0], bad: [], good: [] };
    cfg.steps.forEach((s, i) => {
      const b = startOf(i), v = u - b;
      st.p[i] = u >= b + 8 ? 1 : u >= b + 5 ? ease(prog(v, 5, 8)) : 0;
      if (u >= b - 0.3 && u < b + SPAN) {
        const pb = prog(v, 2.4, 2.9) * (1 - prog(v, 4.7, 5.1));
        if (pb > 0) st.bad.push({ r: MOCK.R[s.mark], p: pb });
        const pg = prog(v, 8.2, 8.7) * (1 - prog(v, SPAN - 0.9, SPAN - 0.4));
        if (pg > 0) st.good.push({ r: MOCK.R[s.good || s.mark], p: pg });
        if (s.drive) s.drive(st, v);
      }
    });
    if (u < HOOK_END) {
      const out = 1 - prog(u, HOOK_END - 0.6, HOOK_END - 0.1);
      cfg.hook.marks.forEach((k, j) => st.bad.push({ r: MOCK.R[k], p: out * (1 + 0.08 * Math.sin((u + j) * 3)) }));
      if (cfg.hook.drive) cfg.hook.drive(st, u);
    }
    return st;
  }

  // ---------------------------------------------------------------- camera
  const camKeys = [[-10, cfg.hook.cam], ...(cfg.hook.cam2 ? [[0, cfg.hook.cam2]] : []), ...cfg.steps.map((s, i) => [startOf(i) - 0.4, s.cam])];
  function drawMock(ctx, u, st, cam = null) {
    const [fx, fy, z] = cam || springKeys(u, camKeys, SPRING.gentle);
    const s = s0 * z;
    st.px = 1 / s;
    ctx.save();
    ctx.translate(CARD.x + CARD.w / 2, CARD.y + CARD.h / 2); ctx.scale(s, s); ctx.translate(-fx, -fy);
    MOCK.draw(ctx, st);
    ctx.restore();
  }

  // ---------------------------------------------------------------- text column
  function fitTitle(ctx, str, maxW, max = 74) {
    ctx.font = font(max, 800, F.latin); ctx.letterSpacing = `${-0.035 * max}px`;
    const w = ctx.measureText(str).width; ctx.letterSpacing = '0px';
    return Math.min(max, Math.floor(max * maxW / w));
  }
  function textBlock(ctx, u, b, exit, d) {
    const hasBadge = d.n != null;
    const tx = hasBadge ? L.left + 100 : L.left;
    const size = hasBadge ? fitTitle(ctx, d.title, L.right - tx) : 74;
    if (hasBadge) A.badge(ctx, d.n, L.left, 330, springU(u, b - 0.15, SPRING.bouncy) * (1 - E.inCubic(prog(u, exit, exit + 0.4))));
    const t = A.riseWords(ctx, u, b, d.title, { x: tx, y: 395, size, maxW: d.maxW || L.right - tx, stagger: 0.09, hl: d.hl || [], hlAt: d.hlAt, exit });
    const y1 = t.bottom + 82;
    ctx.font = font(54, 700, F.arabic); ctx.direction = 'rtl';
    const arSize = Math.min(54, Math.floor(54 * L.width / ctx.measureText(d.ar).width)); ctx.direction = 'ltr';
    A.line(ctx, u, b + d.lag * 0.6, d.ar, { x: L.right, y: y1, size: arSize, weight: 700, color: C.blue, align: 'right', rtl: true, exit: exit + 0.05 });
    A.line(ctx, u, b + d.lag * 1.1, d.en2, { x: L.left, y: y1 + 70, size: 34, weight: 500, color: C.grey, align: 'left', exit: exit + 0.1 });
    A.line(ctx, u, b + d.lag * 1.5, d.ar2, { x: L.right, y: y1 + 124, size: 32, weight: 500, color: C.grey, align: 'right', rtl: true, exit: exit + 0.15 });
  }
  function label(ctx, u, u0, exit, text) {
    const k = u0 < 0 ? 1 : springU(u, u0, SPRING.snappy), ex = E.inCubic(prog(u, exit, exit + 0.3));
    if (k <= 0 || ex >= 1) return;
    ctx.save(); ctx.globalAlpha = clamp(k * 1.5) * (1 - ex);
    ctx.font = font(28, 600, F.latin); ctx.fillStyle = C.blue; ctx.textAlign = 'left';
    ctx.fillText(text, FRAME.x, 726 + (1 - k) * 12);
    ctx.restore();
  }

  // ---------------------------------------------------------------- recap: before | after
  function recap(ctx, u) {
    const full = { p: [1, 1, 1, 1, 1], bad: [], good: [] }, none = { p: [0, 0, 0, 0, 0], bad: [], good: [] };
    const sc = cfg.recapScale, w = MOCK.w * sc, h = MOCK.h * sc;
    const gap = (CARD.w - 2 * w) / 3, y = CARD.y + 70;
    [[none, 'Before · قبل', C.red, RECAP + 1.2], [full, 'After · بعد', C.green, RECAP + 2.0]].forEach(([st, lab, col, at], i) => {
      const k = springU(u, at, SPRING.gentle);
      if (k <= 0) return;
      const x = CARD.x + gap + i * (w + gap);
      ctx.save(); ctx.globalAlpha = clamp(k * 1.5); ctx.translate(0, (1 - k) * 60);
      ctx.font = font(24, 700, F.latin); ctx.fillStyle = col; ctx.textAlign = 'left'; ctx.direction = 'ltr';
      ctx.fillText(lab, x, y - 18);
      ctx.save(); rrect(ctx, x, y, w, Math.min(h, CARD.h - 100), 14); ctx.clip();
      ctx.fillStyle = MOCK.bg; ctx.fillRect(x, y, w, h);
      ctx.translate(x - (MOCK.ox || 0) * sc, y - (MOCK.oy || 0) * sc); ctx.scale(sc, sc);
      st.px = 1 / sc; MOCK.draw(ctx, st);
      ctx.restore();
      ctx.lineWidth = 2; ctx.strokeStyle = C.line; rrect(ctx, x, y, w, Math.min(h, CARD.h - 100), 14); ctx.stroke();
      ctx.restore();
    });
  }

  // ---------------------------------------------------------------- cover (?cover=tiktok|shorts)
  const COVER = new URLSearchParams(location.search).get('cover');
  function cover(ctx, kind) {
    const U = 1000;
    A.paper(ctx);
    const top = kind === 'tiktok' ? 300 : 230;
    A.header(ctx, U, cfg.series, { y: top });
    const sz = kind === 'tiktok' ? 128 : 140;
    let y = top + 66 + sz * 1.1;
    cfg.cover.lines.forEach((l, i) => A.riseWords(ctx, U, 0, l, { x: L.left, y: y + i * sz * 1.02, size: sz, maxW: 1000, hl: i === cfg.cover.hlLine ? cfg.cover.hl : [], hlAt: 0 }));
    y += sz * 1.02 * (cfg.cover.lines.length - 1) + 110;
    ctx.font = font(64, 800, 'CoverCairo, Jakarta'); ctx.direction = 'rtl';
    const arSize = Math.min(64, Math.floor(64 * L.width / ctx.measureText(cfg.cover.ar).width)); ctx.direction = 'ltr';
    A.line(ctx, U, 0, cfg.cover.ar, { x: L.right, y, size: arSize, weight: 800, color: C.blue, align: 'right', rtl: true, family: 'CoverCairo, Jakarta' });
    // before | after minis
    const sc = cfg.coverScale, w = MOCK.w * sc, h = Math.min(MOCK.h * sc, kind === 'tiktok' ? 1640 - y - 90 : 1800 - y - 90);
    const gap = 40, x0 = (1080 - 2 * w - gap) / 2, yy = y + 70;
    [[{ p: [0, 0, 0, 0, 0], bad: [], good: [] }, C.red], [{ p: [1, 1, 1, 1, 1], bad: [], good: [] }, C.green]].forEach(([st, col], i) => {
      const x = x0 + i * (w + gap);
      ctx.save(); A.shadow(ctx, 30, 10, 0.12); rrect(ctx, x, yy, w, h, 18); ctx.fillStyle = MOCK.bg; ctx.fill(); A.noShadow(ctx);
      rrect(ctx, x, yy, w, h, 18); ctx.clip();
      ctx.translate(x - (MOCK.ox || 0) * sc, yy - (MOCK.oy || 0) * sc); ctx.scale(sc, sc); st.px = 1 / sc; MOCK.draw(ctx, st);
      ctx.restore();
      ctx.lineWidth = 6; ctx.strokeStyle = col; rrect(ctx, x, yy, w, h, 18); ctx.stroke();
    });
  }

  // ---------------------------------------------------------------- film
  M.film({
    fonts: [font(74, 800, F.latin), font(34, 500, F.latin), font(54, 700, F.arabic), font(32, 500, F.arabic)],
    images: {},
    hits: HITS,
    async init() {
      const ar = 'مصادر مجانية لتعلّم ٦';
      const fams = [F.arabic, ...(COVER ? ['CoverCairo'] : [])];
      await Promise.all(fams.flatMap((fam) => [500, 600, 700, 800].map((w) => document.fonts.load(font(40, w, fam), ar).catch(() => {}))));
    },
    draw(ctx, u) {
      if (COVER) { cover(ctx, COVER); return; }
      if (u >= END) { A.endCard(ctx, u, END + 0.1); return; }
      A.paper(ctx);
      A.header(ctx, u, cfg.series, { u0: -20 });

      // text column
      if (u < HOOK_END) textBlock(ctx, u, -20, HOOK_END - 0.55, { ...cfg.hook, lag: 0 });
      cfg.steps.forEach((s, i) => {
        const b = startOf(i), nb = i < 4 ? b + SPAN : RECAP;
        if (u >= b - 0.3 && u < nb) textBlock(ctx, u, b, nb - 0.55, { ...s, n: i + 1, lag: 1 });
      });
      if (u >= RECAP - 0.3) textBlock(ctx, u, RECAP, END + 1, { ...cfg.recap, lag: 1, hlAt: RECAP + 0.9 });

      // progress bar
      const pa = clamp(prog(u, B0 - 0.5, B0)) * (1 - prog(u, RECAP + 0.3, RECAP + 1));
      let done = 0;
      for (let i = 0; i < 5; i++) done += ease(prog(u, startOf(i), startOf(i) + 0.8));
      A.progress(ctx, 5, done, { alpha: pa });

      // label
      if (u < HOOK_END) label(ctx, u, -1, HOOK_END - 0.4, cfg.hook.label);
      cfg.steps.forEach((s, i) => { const b = startOf(i), nb = i < 4 ? b + SPAN : RECAP; if (u >= b - 0.2 && u < nb) label(ctx, u, b + 0.3, nb - 0.4, s.label); });
      if (u >= RECAP) label(ctx, u, RECAP + 0.3, END + 1, 'Before / After');

      // card
      A.shadow(ctx, 40, 14, 0.08);
      rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.fillStyle = MOCK.bg; ctx.fill(); A.noShadow(ctx);
      ctx.save(); rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.clip();
      if (u < RECAP + 1.2) drawMock(ctx, u, stateAt(u));
      if (u >= RECAP - 0.3) {
        const k = ease(prog(u, RECAP - 0.3, RECAP + 0.7));
        ctx.save(); ctx.translate(0, (1 - k) * CARD.h);
        A.shadow(ctx, 30, -10, 0.12); ctx.fillStyle = C.white; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h); A.noShadow(ctx);
        recap(ctx, u);
        ctx.restore();
      }
      ctx.restore();
      ctx.lineWidth = 2; ctx.strokeStyle = C.line; rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.stroke();
      if (cfg.overlay) cfg.overlay(ctx, u, { CARD, startOf, s0, camKeys, springKeys, SPRING });
      A.selection(ctx, FRAME.x, FRAME.y, FRAME.w, FRAME.h, { p: 1 });

      if (u >= END - 0.9) A.circleCover(ctx, CARD.x + CARD.w / 2, CARD.y + CARD.h / 2, prog(u, END - 0.9, END - 0.02));
    },
  });
  return { HITS, END, duration: (END + 10) };
}
