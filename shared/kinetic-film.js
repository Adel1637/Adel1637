// Generic Short (9:16) and long (16:9) films in the kinetic dark-software style.
// cfg = {
//   hook: { lines: [..], ar, en, tags: ['HTML', 'CSS', ...] },      // frame 0 full, tags move, then gather + ring wipe
//   items: [{ title: [..], ar, en, vig: { draw(ctx, v), hits }, len?, tip?, tipAr?, tipAt?, part? }],
//   parts?: [{ en, ar, count }],                                      // long only: part cards before the items of each part
//   label: (i, n) => 'STEP 01 / 05',
//   recap: { title: [..], ar, en, vig, len? },
//   cover: { lines: [..], ar, art(ctx, x, y, w, h) },
//   span, hookLen,
// }
// Vignettes are drawn in the Short's coordinates (area x 80..1000, y 280..1150); the long film maps them to its right half.
export function kineticFilm(M, K, cfg) {
  const { W, H, E, TAU, hash01 } = M;
  const { F, C, ez, spr, txt, maskUp, fit, rr } = K;
  const LONG = W > H;
  const X0 = LONG ? 110 : 80, XC = LONG ? 900 : W - 80, CW = XC - X0;
  const VS = 0.9, VX = 1000, VY = 175;
  const SPAN = cfg.span || (LONG ? 22 : 14), HOOK = cfg.hookLen || (LONG ? 8 : 4);
  const BGS = ['#1B1B1B', '#222222'];

  // ---------------------------------------------------------------- scenes
  const SCENES = [{ kind: 'hook', b0: 0, len: HOOK }];
  let b = HOOK;
  cfg.items.forEach((it, i) => {
    if (LONG && cfg.parts && it.part !== undefined && (i === 0 || cfg.items[i - 1].part !== it.part)) { SCENES.push({ kind: 'part', part: cfg.parts[it.part], pi: it.part, b0: b, len: 6 }); b += 6; }
    const len = it.len || SPAN; SCENES.push({ kind: 'item', it, i, b0: b, len, bg: BGS[i % 2] }); b += len;
  });
  const RLEN = cfg.recap.len || (LONG ? 16 : 10);
  SCENES.push({ kind: 'recap', b0: b, len: RLEN }); b += RLEN;
  SCENES.push({ kind: 'end', b0: b, len: LONG ? 10 : 8 }); b += LONG ? 10 : 8;
  const TOTAL = b;
  SCENES.forEach((s, i) => { s.next = SCENES[i + 1]; s.dir = i % 2 ? 'left' : 'up'; });
  const firstBg = SCENES[1].kind === 'item' ? SCENES[1].bg : C.bg;

  // ---------------------------------------------------------------- sound
  const HITS = [];
  const hit = (bb, l, s, o) => HITS.push(o ? [bb, l, s, o] : [bb, l, s]);
  hit(0, 'hook slam', 'thud', { pitch: 'A1' }); hit(0, 'hook whoosh', 'whoosh', { len: 0.35 });
  const G0 = HOOK - 1.8;
  [1, 1.8].forEach((x) => hit(x * HOOK / 4, 'tags', 'tick')); hit(G0, 'tags gather', 'whoosh', { len: 0.4 });
  hit(HOOK, 'riser into wipe', 'riser', { len: 1.1 }); hit(HOOK, 'ring wipe', 'impact');
  SCENES.forEach((s) => {
    if (s.kind === 'part') { if (s.b0 > HOOK) hit(s.b0, 'push', 'whoosh', { len: 0.45 }); hit(s.b0 + 0.1, 'part', 'sub'); hit(s.b0 + 0.6, 'part title', 'whoosh', { len: 0.3 }); }
    if (s.kind === 'item') {
      if (s.b0 > HOOK && SCENES[SCENES.indexOf(s) - 1].kind !== 'part') { hit(s.b0, 'push', 'whoosh', { len: 0.45 }); hit(s.b0, 'sub', 'sub'); }
      hit(s.b0 + 0.9, 'title', 'whoosh', { len: 0.25 }); hit(s.b0 + 2.0, 'arabic', 'tick');
      if (LONG && s.it.tip) hit(s.b0 + (s.it.tipAt || 12), 'tip', 'tok', { pitch: 'G5' });
      (s.it.vig.hits || []).forEach(([o, l, sfx, opt]) => { if (o < s.len - 0.5) hit(s.b0 + o, l, sfx, opt); });
    }
    if (s.kind === 'recap') { hit(s.b0, 'recap push', 'whoosh', { len: 0.45 }); (cfg.recap.vig.hits || []).forEach(([o, l, sfx, opt]) => hit(s.b0 + o, l, sfx, opt)); }
    if (s.kind === 'end') { hit(s.b0, 'end wipe', 'impact'); hit(s.b0 + 2, 'follow', 'tick'); }
  });

  // ---------------------------------------------------------------- drawing
  function topline(ctx, label) {
    const y = LONG ? 84 : 120, s = LONG ? 24 : 26;
    txt(ctx, 'LEARN UI/UX', X0, y, s, { w: 600, color: C.sub, family: F.mono });
    txt(ctx, 'AG STUDIO', W - X0, y, s, { w: 600, color: C.sub, align: 'right', family: F.mono });
    if (label) txt(ctx, label, X0, LONG ? 140 : 202, s, { w: 600, color: C.sub, family: F.mono });
  }
  const vig = (ctx, fn) => { if (!LONG) { fn(); return; } ctx.save(); ctx.translate(VX, VY); ctx.scale(VS, VS); ctx.translate(-80, -280); fn(); ctx.restore(); };
  function textBlock(ctx, v, it) {
    if (!LONG) {
      const size = Math.min(...it.title.map((l) => fit(ctx, l, 128, CW)));
      it.title.forEach((l, i) => maskUp(ctx, l, X0 - 4, 1400 - (it.title.length - 1 - i) * size, size, ez(v, 0.9 + i * 0.25, 2.0 + i * 0.25), { color: '#FFFFFF' }));
      maskUp(ctx, it.en, X0, 1466, fit(ctx, it.en, 30, CW, 600, F.mono), ez(v, 1.5, 2.5), { w: 600, color: C.sub, family: F.mono });
      maskUp(ctx, it.ar, XC, 1546, fit(ctx, it.ar, 48, CW, 700, F.ar), ez(v, 1.9, 2.9), { family: F.ar, align: 'right', rtl: true });
      return;
    }
    const size = Math.min(...it.title.map((l) => fit(ctx, l, 120, CW)));
    it.title.forEach((l, i) => maskUp(ctx, l, X0 - 4, 450 - (it.title.length - 1 - i) * size, size, ez(v, 0.9 + i * 0.25, 2.0 + i * 0.25), { color: '#FFFFFF' }));
    maskUp(ctx, it.en, X0, 520, fit(ctx, it.en, 26, CW, 600, F.mono), ez(v, 1.5, 2.5), { w: 600, color: C.sub, family: F.mono });
    maskUp(ctx, it.ar, XC, 600, fit(ctx, it.ar, 46, CW, 700, F.ar), ez(v, 1.9, 2.9), { family: F.ar, align: 'right', rtl: true });
    if (!it.tip) return;
    const ta = it.tipAt || 12, tp = ez(v, ta, ta + 0.8, E.outCubic);
    if (tp > 0) {
      ctx.fillStyle = C.sel; ctx.fillRect(X0, 720, 70 * tp, 5);
      maskUp(ctx, 'TIP', X0, 780, 26, tp, { w: 600, color: C.sel, family: F.mono });
      maskUp(ctx, it.tip, X0, 834, fit(ctx, it.tip, 28, CW, 600, F.mono), ez(v, ta + 0.3, ta + 1.2), { w: 600, color: C.ink, family: F.mono });
      maskUp(ctx, it.tipAr, XC, 904, fit(ctx, it.tipAr, 38, CW, 700, F.ar), ez(v, ta + 0.7, ta + 1.6), { family: F.ar, align: 'right', rtl: true });
    }
  }
  // hook: tags (language names) bob, then gather and open a ring wipe
  function tags(ctx, v, t, area, target) {
    const [x0, y0, w, h] = area, g = ez(v, G0, G0 + 0.9, E.inCubic), n = cfg.hook.tags.length, per = Math.ceil(n / 2);
    cfg.hook.tags.forEach((s, i) => {
      const row = Math.floor(i / per), col = i % per, bx = x0 + (col + 0.5 + (row ? 0.3 : 0)) * (w / (per + 0.3)), by = y0 + (row + 0.5) * (h / 2) + (hash01(i, 2) - 0.5) * 50;
      const bob = Math.sin(t * 2.6 + i * 1.3) * 14, rot = (hash01(i, 3) - 0.5) * 0.3 + 0.06 * Math.sin(t * 2 + i);
      const x = bx + (target[0] - bx) * g, y = by + bob + (target[1] - by - bob) * g, sc = 1 - 0.8 * g;
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot * (1 - g)); ctx.scale(sc, sc);
      ctx.font = `600 40px ${F.mono}`; const tw = ctx.measureText(s).width + 56;
      rr(ctx, -tw / 2, -40, tw, 80, 16, i % 3 === 0 ? C.sel : '#2A2A2A', '#3A3A3A', 2); txt(ctx, s, 0, 13, 40, { w: 600, family: F.mono, color: '#FFFFFF', align: 'center' });
      ctx.restore();
    });
  }
  function ring(ctx, v, cx, cy) {
    const q = ez(v, G0 + 0.5, HOOK, E.inExpo);
    if (q > 0) { const r = 30 + q * 2600; ctx.fillStyle = C.sel; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); ctx.fillStyle = firstBg; ctx.beginPath(); ctx.arc(cx, cy, Math.max(0, r - 100), 0, TAU); ctx.fill(); }
  }
  function hook(ctx, v, t) {
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    topline(ctx);
    const L = cfg.hook.lines;
    if (!LONG) {
      tags(ctx, v, t, [80, 290, 920, 420], [540, 500]);
      const size = Math.min(...L.map((l) => fit(ctx, l, 170, CW / 1.04)));
      L.forEach((s, i) => txt(ctx, s, X0 + (i % 2 ? -1 : 1) * v * 7, 1280 - (L.length - 1 - i) * size * 0.98, size, { color: '#FFFFFF', sx: 1 + 0.03 * Math.sin(t * 3.2 + i) }));
      txt(ctx, cfg.hook.ar, XC, 1410, fit(ctx, cfg.hook.ar, 60, CW, 700, F.ar), { family: F.ar, align: 'right', rtl: true });
      txt(ctx, cfg.hook.en, X0, 1490, fit(ctx, cfg.hook.en, 36, CW, 600, F.mono), { w: 600, family: F.mono, color: C.sub });
      ring(ctx, v, 540, 500);
    } else {
      tags(ctx, v, t, [1000, 200, 820, 680], [1410, 540]);
      const size = Math.min(...L.map((l) => fit(ctx, l, 160, CW / 1.04)));
      L.forEach((s, i) => txt(ctx, s, X0 + (i % 2 ? -1 : 1) * v * 6, 680 - (L.length - 1 - i) * size * 0.98, size, { color: '#FFFFFF', sx: 1 + 0.03 * Math.sin(t * 3.2 + i) }));
      txt(ctx, cfg.hook.ar, XC, 820, fit(ctx, cfg.hook.ar, 56, CW, 700, F.ar), { family: F.ar, align: 'right', rtl: true });
      txt(ctx, cfg.hook.en, X0, 900, fit(ctx, cfg.hook.en, 32, CW, 600, F.mono), { w: 600, family: F.mono, color: C.sub });
      ring(ctx, v, 1410, 540);
    }
  }
  function partCard(ctx, v, p, pi) {
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    topline(ctx);
    maskUp(ctx, `PART ${pi + 1}`, X0, 330, 40, ez(v, 0.2, 1.0), { w: 600, family: F.mono, color: C.sel });
    maskUp(ctx, p.en, X0 - 6, 540, fit(ctx, p.en, 220, W - 2 * X0), ez(v, 0.5, 1.6), { color: '#FFFFFF' });
    maskUp(ctx, p.ar, W - X0, 720, fit(ctx, p.ar, 80, 900, 700, F.ar), ez(v, 1.0, 2.0), { family: F.ar, align: 'right', rtl: true });
    maskUp(ctx, p.count, X0, 720, 36, ez(v, 1.2, 2.2), { w: 600, family: F.mono, color: C.sub });
  }
  let IMGS = {};
  // a real product screenshot (public website) shown in a browser frame over the vignette
  function realShot(ctx, v, r) {
    const at = LONG ? r.atLong || 14 : r.at || 9, p = spr(v, at, { stiffness: 200, damping: 16 }); if (p <= 0) return;
    const im = IMGS[r.img]; if (!im) return;
    ctx.save(); ctx.globalAlpha = Math.min(1, p) * 0.85; ctx.fillStyle = '#121212'; if (LONG) ctx.fillRect(60, 280, 960, 880); else ctx.fillRect(-100, 225, 1280, 940); ctx.restore();
    const w = 920, ih = w * im.height / im.width, h = 54 + ih, x = 80, y = 715 - h / 2;
    ctx.save(); ctx.globalAlpha = Math.min(1, p); ctx.translate(540, 715); ctx.scale(lerpN(0.9, 1, Math.min(1, p)), lerpN(0.9, 1, Math.min(1, p))); ctx.translate(-540, -715);
    rr(ctx, x, y, w, h, 16, '#EDEDED'); rr(ctx, x + 90, y + 12, 400, 30, 15, '#FFFFFF'); txt(ctx, r.url, x + 110, y + 34, 18, { w: 600, family: F.mono, color: '#555' });
    [0, 1, 2].forEach((i) => { ctx.fillStyle = '#C9C9C9'; ctx.beginPath(); ctx.arc(x + 24 + i * 20, y + 27, 6, 0, TAU); ctx.fill(); });
    ctx.save(); ctx.beginPath(); ctx.roundRect(x, y + 54, w, ih, [0, 0, 16, 16]); ctx.clip(); ctx.drawImage(im, x, y + 54, w, ih); ctx.restore();
    ctx.restore();
    K.pill(ctx, `REAL EXAMPLE · ${r.label}`, 540, y - 50, spr(v, at + 0.4, { stiffness: 300, damping: 13 }), C.sel, 24);
  }
  const lerpN = (a, b, k) => a + (b - a) * k;
  function seenIn(ctx, v, it) {
    if (!it.seen) return;
    if (!LONG) {
      const p = spr(v, 5.5, { stiffness: 260, damping: 15 }); if (p <= 0) return;
      const s = `SEEN IN · ${it.seen}`; ctx.font = `600 22px ${F.mono}`; const w = Math.min(CW, ctx.measureText(s).width + 40);
      ctx.save(); ctx.translate(X0 + w / 2, 252); ctx.scale(p, p); rr(ctx, -w / 2, -24, w, 48, 24, '#262626', '#3A3A3A', 2); txt(ctx, s, 0, 8, fit(ctx, s, 22, w - 40, 600, F.mono), { w: 600, family: F.mono, color: C.ink, align: 'center' }); ctx.restore();
      return;
    }
    maskUp(ctx, `SEEN IN: ${it.seen}`, X0, 662, fit(ctx, `SEEN IN: ${it.seen}`, 22, CW, 600, F.mono), ez(v, 2.4, 3.2), { w: 600, family: F.mono, color: C.sel });
  }
  function item(ctx, v, s) {
    ctx.fillStyle = s.bg; ctx.fillRect(0, 0, W, H);
    topline(ctx, cfg.label(s.i, cfg.items.length));
    vig(ctx, () => { s.it.vig.draw(ctx, v); if (s.it.real) realShot(ctx, v, s.it.real); });
    textBlock(ctx, v, s.it);
    seenIn(ctx, v, s.it);
  }
  function recap(ctx, v) {
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    topline(ctx, 'RECAP');
    vig(ctx, () => cfg.recap.vig.draw(ctx, v));
    textBlock(ctx, v, cfg.recap);
    const q = ez(v, RLEN - 0.8, RLEN, E.inExpo);
    if (q > 0) { ctx.fillStyle = C.endBlue; ctx.beginPath(); ctx.arc(W / 2, H / 2, q * 1200, 0, TAU); ctx.fill(); }
  }
  function endPage(ctx, v) {
    ctx.fillStyle = C.endBlue; ctx.fillRect(0, 0, W, H);
    if (!LONG) {
      maskUp(ctx, 'Keep it simple.', X0, 760, fit(ctx, 'Keep it simple.', 150, CW), ez(v, 0, 0.8), { color: '#FFFFFF' });
      maskUp(ctx, 'اجعلها بسيطة.', XC, 900, 90, ez(v, 0.4, 1.2), { family: F.ar, align: 'right', rtl: true, color: '#FFFFFF' });
      const l = ez(v, 1.6, 2.4, E.inOutCubic); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(X0, 1000, CW * l, 3);
      maskUp(ctx, 'Follow for more', X0, 1130, 76, ez(v, 2, 2.8), { color: '#FFFFFF' });
      maskUp(ctx, 'UI/UX tutorials', X0, 1220, 76, ez(v, 2.2, 3.0), { color: '#FFFFFF' });
      maskUp(ctx, 'تابعني لمزيد من دروس UI/UX', XC, 1330, 54, ez(v, 2.6, 3.4), { family: F.ar, align: 'right', rtl: true, color: '#FFFFFF' });
    } else {
      maskUp(ctx, 'Keep it simple.', X0, 360, 170, ez(v, 0, 0.8), { color: '#FFFFFF' });
      maskUp(ctx, 'اجعلها بسيطة.', W - X0, 520, 96, ez(v, 0.4, 1.2), { family: F.ar, align: 'right', rtl: true, color: '#FFFFFF' });
      const l = ez(v, 1.6, 2.4, E.inOutCubic); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(X0, 620, (W - 2 * X0) * l, 3);
      maskUp(ctx, 'Follow for more UI/UX tutorials', X0, 760, 80, ez(v, 2, 2.8), { color: '#FFFFFF' });
      maskUp(ctx, 'تابعني لمزيد من دروس UI/UX', W - X0, 890, 60, ez(v, 2.6, 3.4), { family: F.ar, align: 'right', rtl: true, color: '#FFFFFF' });
    }
  }
  const COVER = new URLSearchParams(location.search).get('cover');
  function cover(ctx, kind) {
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    const cv = cfg.cover;
    if (!LONG) {
      const top = kind === 'tiktok' ? 330 : 260;
      txt(ctx, 'LEARN UI/UX', X0, top, 28, { w: 600, family: F.mono, color: C.sub }); txt(ctx, 'AG STUDIO', W - X0, top, 28, { w: 600, family: F.mono, color: C.sub, align: 'right' });
      const size = Math.min(...cv.lines.map((l) => fit(ctx, l, 170, CW)));
      cv.lines.forEach((s, i) => txt(ctx, s, X0, top + 200 + i * size * 1.02, size, { color: '#FFFFFF' }));
      const ya = top + 200 + (cv.lines.length - 1) * size * 1.02 + 120;
      txt(ctx, cv.ar, XC, ya, fit(ctx, cv.ar, 72, CW, 700, F.ar), { family: F.ar, align: 'right', rtl: true });
      cv.art(ctx, X0, ya + 60, CW, top + 1100 - ya - 60);
    } else {
      txt(ctx, 'LEARN UI/UX', X0, 110, 30, { w: 600, family: F.mono, color: C.sub }); txt(ctx, 'AG STUDIO', W - X0, 110, 30, { w: 600, family: F.mono, color: C.sub, align: 'right' });
      const size = Math.min(...cv.lines.map((l) => fit(ctx, l, 160, 1000)));
      cv.lines.forEach((s, i) => txt(ctx, s, X0, 330 + i * size * 1.02, size, { color: '#FFFFFF' }));
      txt(ctx, cv.ar, X0 + 1000, 920, fit(ctx, cv.ar, 72, 1000, 700, F.ar), { family: F.ar, align: 'right', rtl: true });
      cv.art(ctx, 1200, 200, 610, 720);
    }
  }

  // ---------------------------------------------------------------- run
  const FAST = SCENES.map((s) => s.b0);
  let GRAIN = null;
  function drawScene(ctx, s, v, t) {
    if (s.kind === 'hook') hook(ctx, v, t); else if (s.kind === 'part') partCard(ctx, v, s.part, s.pi); else if (s.kind === 'item') item(ctx, v, s); else if (s.kind === 'recap') recap(ctx, v); else endPage(ctx, v);
  }
  M.film({
    fonts: [`700 100px ${F.title}`, `600 40px ${F.mono}`, `700 60px ${F.ar}`, `400 60px ${F.serif}`],
    images: cfg.images || {}, hits: HITS, shutter: 0.6,
    samples: (t) => { const u = t / K.B; return FAST.some((bb) => u > bb - 1.2 && u < bb + 3.2) ? 8 : 3; },
    async init() { await document.fonts.load(`700 60px ${F.ar}`, 'أيّ لغة برمجة').catch(() => {}); GRAIN = K.makeGrain(LONG ? 960 : 540, LONG ? 540 : 960); },
    draw(ctx, u, t, IMG) {
      IMGS = IMG || {};
      ctx.save();
      if (COVER) { cover(ctx, COVER); ctx.restore(); return; }
      let s = SCENES[0]; SCENES.forEach((x) => { if (u >= x.b0) s = x; });
      const v = u - s.b0, push = s.next && (s.kind === 'item' || s.kind === 'part');
      const pe = push ? ez(v, s.len - 0.9, s.len, E.inOutCubic) : 0;
      if (pe > 0) {
        const dx = s.dir === 'left' ? -W : 0, dy = s.dir === 'up' ? -H : 0;
        ctx.save(); ctx.translate(dx * pe, dy * pe); drawScene(ctx, s, v, t); ctx.restore();
        ctx.save(); ctx.translate(dx * (pe - 1), dy * (pe - 1)); drawScene(ctx, s.next, 0, t); ctx.restore();
      } else drawScene(ctx, s, v, t);
      ctx.restore();
      K.grain(ctx, GRAIN, t, hash01);
    },
  });
  return { SCENES, TOTAL, HOOK };
}
