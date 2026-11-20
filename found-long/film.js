// UI design foundations for beginners (YouTube, 16:9) — the 6 themes of the series, 30 basics.
// Hook: "Why does your UI look amateur?" (shared/accroche.md): frame 0 shows the 6 faulty interfaces.
// Content: ../shared/found-themes.js · interfaces: mockup-style.js + mockup-found.js. Text + SFX only.
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';
import { makeStyleMockup } from '../shared/mockup-style.js';
import { makeFoundMockups } from '../shared/mockup-found.js';
import { foundThemes } from '../shared/found-themes.js';

const { E, prog, clamp, springU, springKeys, SPRING, font, rrect } = M;
const A = makeAGS(M);
const { C, F } = A;
const MK = { style: makeStyleMockup(M, A), ...makeFoundMockups(M, A) };
const THEMES = foundThemes(M);
const ease = E.inOutCubic;

// ------------------------------------------------------------------ layout + timeline
const COL = { l: 120, r: 1000 };
const FRAME = { x: 1080, y: 170, w: 720, h: 840 };
const CARD = { x: 1100, y: 190, w: 680, h: 800, r: 30 };
const SERIES = 'Learn UI/UX';
const SPAN = 18, PART = 96, HOOK = 8, RECAP = HOOK + 6 * PART, END = RECAP + 16;
const partAt = (j) => HOOK + j * PART;
const stepAt = (j, i) => partAt(j) + 6 + i * SPAN;
const AR_NUM = (n) => String(n);
const s0 = (th) => (th.fit === 'height' ? CARD.h / MK[th.mock].h : CARD.w / MK[th.mock].w);
const overview = (th) => (th.fit === 'height' ? [195, 422, 1.0] : [480, 650, 0.82]);

// ------------------------------------------------------------------ hits
const HITS = [];
const hit = (b, label, sfx, o) => HITS.push(o ? [b, label, sfx, o] : [b, label, sfx]);
hit(0, 'hook on screen', 'click'); hit(0.5, 'hook motion', 'tick'); hit(2, 'pulse', 'tick'); hit(4, 'pulse', 'tick');
THEMES.forEach((th, j) => {
  const p = partAt(j);
  hit(p, `part ${j + 1}`, 'type', { n: 6, len: 0.6 }); hit(p + 0.6, `part ${j + 1} arabic`, 'pop', { pitch: 'C#6' });
  th.steps.forEach((s, i) => {
    const b = stepAt(j, i);
    hit(b - 0.1, `${s.title} badge`, 'pop', { pitch: 'E6' }); hit(b + 0.1, `${s.title} title`, 'type', { n: 5, len: 0.5 });
    hit(b + 2.4, `${s.title} mistake`, 'blip', { pitch: 'C5' }); hit(b + 5, `${s.title} fix`, 'click'); hit(b + 8.2, `${s.title} fixed`, 'bell', { pitch: 'E6' });
  });
});
hit(RECAP, 'recap', 'type', { n: 6, len: 0.6 }); for (let k = 0; k < 6; k++) hit(RECAP + 1.4 + k * 0.4, `recap ${k + 1}`, 'pop', { pitch: ['A5', 'B5', 'C#6', 'E6', 'F#6', 'A6'][k] });
hit(END - 0.9, 'circle to end', 'click'); hit(END + 0.1, 'keep it simple', 'pop', { pitch: 'A5' }); hit(END + 2.2, 'follow pill', 'pop', { pitch: 'A6' });

// ------------------------------------------------------------------ interface state
function stateFor(j, u) {
  const th = THEMES[j], MOCK = MK[th.mock], st = { p: [0, 0, 0, 0, 0], bad: [], good: [] };
  th.steps.forEach((s, i) => {
    const b = stepAt(j, i), v = u - b;
    st.p[i] = u >= b + 8 ? 1 : u >= b + 5 ? ease(prog(v, 5, 8)) : 0;
    if (u >= b - 0.3 && u < b + SPAN) {
      const pb = prog(v, 2.4, 2.9) * (1 - prog(v, 4.7, 5.1)); if (pb > 0) st.bad.push({ r: MOCK.R[s.mark], p: pb });
      const pg = prog(v, 8.2, 8.7) * (1 - prog(v, SPAN - 0.9, SPAN - 0.4)); if (pg > 0) st.good.push({ r: MOCK.R[s.good || s.mark], p: pg });
      if (s.drive) s.drive(st, v);
    }
  });
  return st;
}
function drawMock(ctx, mockName, st, [fx, fy, z], s0v, x0 = CARD.x, y0 = CARD.y, w = CARD.w, h = CARD.h) {
  const s = s0v * z; st.px = 1 / s;
  ctx.save(); ctx.translate(x0 + w / 2, y0 + h / 2); ctx.scale(s, s); ctx.translate(-fx, -fy); MK[mockName].draw(ctx, st); ctx.restore();
}
function grid6(ctx, after, u, at) {
  ctx.fillStyle = '#F1F3F7'; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
  const cw = 316, ch = 236, gx = 16, gy = 22, x0 = CARD.x + (CARD.w - 2 * cw - gx) / 2, y0 = CARD.y + 22;
  THEMES.forEach((th, k) => {
    const x = x0 + (k % 2) * (cw + gx), y = y0 + Math.floor(k / 2) * (ch + gy);
    const kk = at == null ? 1 : springU(u, at + k * 0.4, SPRING.bouncy);
    if (kk <= 0) return;
    ctx.save(); ctx.globalAlpha = clamp(kk * 1.4);
    ctx.save(); rrect(ctx, x, y, cw, ch, 14); ctx.clip(); ctx.fillStyle = MK[th.mock].bg; ctx.fillRect(x, y, cw, ch);
    const st = { p: after ? [1, 1, 1, 1, 1] : [0, 0, 0, 0, 0], bad: [], good: [], sec: after ? 0 : 0.6, panel: th.key === 'color' ? 'palette' : undefined };
    if (th.fit === 'height') drawMock(ctx, th.mock, st, [195, 300, 1], ch / 600, x, y, cw, ch);
    else drawMock(ctx, th.mock, st, [480, 380, 1], cw / 960 * 1.02, x, y, cw, ch);
    ctx.restore();
    ctx.lineWidth = 3; ctx.strokeStyle = after ? C.green : C.red; rrect(ctx, x, y, cw, ch, 14); ctx.stroke();
    A.pill(ctx, th.title, x + 10, y + ch - 44, { bg: C.ink, size: 18 });
    ctx.restore();
  });
}

// ------------------------------------------------------------------ text column
function fitSize(ctx, str, max, weight, family, maxW, rtl = false) {
  ctx.font = font(max, weight, family); ctx.direction = rtl ? 'rtl' : 'ltr';
  const w = ctx.measureText(str).width; ctx.direction = 'ltr';
  return Math.min(max, Math.floor(max * maxW / w));
}
function textBlock(ctx, u, b, exit, d) {
  const hasBadge = d.n != null, cw = COL.r - COL.l, tx = hasBadge ? COL.l + 100 : COL.l;
  const size = hasBadge ? Math.min(76, fitSize(ctx, d.title, 76, 800, F.latin, (COL.r - tx) * 1.03)) : (d.size || 84);
  if (hasBadge) A.badge(ctx, d.n, COL.l, 338, springU(u, b - 0.15, SPRING.bouncy) * (1 - E.inCubic(prog(u, exit, exit + 0.4))));
  const t = A.riseWords(ctx, u, b, d.title, { x: tx, y: hasBadge ? 404 : 410, size, maxW: COL.r - tx, stagger: 0.09, hl: d.hl || [], hlAt: d.hlAt, exit });
  const y1 = t.bottom + 96, lag = d.lag == null ? 1 : d.lag;
  A.line(ctx, u, b + 0.6 * lag, d.ar, { x: COL.r, y: y1, size: fitSize(ctx, d.ar, 58, 700, F.arabic, cw, true), weight: 700, color: C.blue, align: 'right', rtl: true, exit: exit + 0.05 });
  A.line(ctx, u, b + 1.1 * lag, d.en2, { x: COL.l, y: y1 + 78, size: fitSize(ctx, d.en2, 38, 500, F.latin, cw), weight: 500, color: C.grey, align: 'left', exit: exit + 0.1 });
  A.line(ctx, u, b + 1.5 * lag, d.ar2, { x: COL.r, y: y1 + 136, size: fitSize(ctx, d.ar2, 35, 500, F.arabic, cw, true), weight: 500, color: C.grey, align: 'right', rtl: true, exit: exit + 0.15 });
}
function label(ctx, u, u0, exit, text) {
  const k = u0 < 0 ? 1 : springU(u, u0, SPRING.snappy), ex = E.inCubic(prog(u, exit, exit + 0.3));
  if (k <= 0 || ex >= 1) return;
  ctx.save(); ctx.globalAlpha = clamp(k * 1.5) * (1 - ex); ctx.font = font(28, 600, F.latin); ctx.fillStyle = C.blue; ctx.textAlign = 'left';
  ctx.fillText(text, FRAME.x, 146 + (1 - k) * 12); ctx.restore();
}

// ------------------------------------------------------------------ thumbnail (?cover=youtube)
const COVER = new URLSearchParams(location.search).get('cover');
function thumbnail(ctx) {
  const U = 1000;
  A.paper(ctx); A.header(ctx, U, SERIES, { y: 70, left: 110, right: 1810 });
  A.riseWords(ctx, U, 0, 'UI design', { x: 110, y: 330, size: 140, maxW: 1060 });
  A.riseWords(ctx, U, 0, 'foundations', { x: 110, y: 480, size: 140, maxW: 1060, hl: [0], hlAt: 0 });
  const ar = 'أساسيات تصميم الواجهات للمبتدئين';
  A.line(ctx, U, 0, ar, { x: 1050, y: 620, size: fitSize(ctx, ar, 70, 800, 'CoverCairo, Jakarta', 940, true), weight: 800, color: C.blue, align: 'right', rtl: true, family: 'CoverCairo, Jakarta' });
  A.pill(ctx, '30 BASICS', 110, 700, { bg: C.ink, size: 52 });
  ctx.save(); ctx.translate(1120 - CARD.x, 150 - CARD.y + 20); ctx.scale(1, 1); grid6(ctx, true, U, null); ctx.restore();
}

// ------------------------------------------------------------------ film
M.film({
  fonts: [font(76, 800, F.latin), font(34, 500, F.latin), font(54, 700, F.arabic), font(32, 500, F.arabic)],
  images: {},
  hits: HITS,
  async init() {
    const ar = 'مصادر مجانية لتعلّم ٦';
    const fams = [F.arabic, ...(COVER ? ['CoverCairo'] : [])];
    await Promise.all(fams.flatMap((fam) => [500, 600, 700, 800].map((w) => document.fonts.load(font(40, w, fam), ar).catch(() => {}))));
  },
  draw(ctx, u) {
    if (COVER) { thumbnail(ctx); return; }
    if (u >= END) { A.endCardWide(ctx, u, END + 0.1); return; }
    A.paper(ctx);
    A.header(ctx, u, SERIES, { u0: -20, y: 56, left: COL.l, right: 1800 });

    // text column
    if (u < HOOK) textBlock(ctx, u, -20, HOOK - 0.55, { title: 'Why does your UI look amateur?', hl: [5], hlAt: -20, size: 84, lag: 0,
      ar: 'لماذا تبدو واجهتك غير احترافية؟', en2: '6 foundations, 30 basics, before and after.', ar2: '6 أسس و30 قاعدة، قبل وبعد.' });
    THEMES.forEach((th, j) => {
      const p = partAt(j);
      if (u >= p - 0.3 && u < p + 6) textBlock(ctx, u, p, p + 5.45, { title: `Part ${j + 1} · ${th.title}`, hl: th.title.split(' ').map((_, k) => 3 + k), hlAt: p + 1.0, size: 84,
        ar: `الجزء ${AR_NUM(j + 1)}: ${th.ar}`, en2: '5 basics, before and after.', ar2: '5 قواعد، قبل وبعد.' });
      th.steps.forEach((s, i) => {
        const b = stepAt(j, i), nb = i < 4 ? stepAt(j, i + 1) : (j < 5 ? partAt(j + 1) : RECAP);
        if (u >= b - 0.3 && u < nb) textBlock(ctx, u, b, nb - 0.55, { ...s, n: i + 1 });
      });
    });
    if (u >= RECAP - 0.3) textBlock(ctx, u, RECAP, END + 1, { title: 'Six foundations. One clean UI.', hl: [3, 4, 5], hlAt: RECAP + 1, size: 76,
      ar: 'ستة أسس، واجهة واحدة نظيفة.', en2: 'Save this and check your next design.', ar2: 'احفظ هذا وراجع تصميمك القادم.' });

    // progress: one segment per theme
    if (u >= HOOK - 0.5 && u < RECAP + 0.5) {
      let done = 0; THEMES.forEach((th, j) => { done += clamp((u - partAt(j) - 6) / (5 * SPAN)); });
      A.progress(ctx, 6, done, { y: 990, x0: COL.l, width: COL.r - COL.l, alpha: clamp(prog(u, HOOK - 0.5, HOOK)) * (1 - prog(u, RECAP, RECAP + 0.5)) });
    }

    // labels
    if (u < HOOK) label(ctx, u, -1, HOOK - 0.4, '6 interfaces');
    THEMES.forEach((th, j) => {
      const p = partAt(j); if (u >= p && u < p + 6) label(ctx, u, p + 0.3, p + 5.6, th.title);
      th.steps.forEach((s, i) => { const b = stepAt(j, i), nb = i < 4 ? stepAt(j, i + 1) : (j < 5 ? partAt(j + 1) : RECAP); if (u >= b - 0.2 && u < nb) label(ctx, u, b + 0.3, nb - 0.4, s.label); });
    });
    if (u >= RECAP) label(ctx, u, RECAP + 0.3, END + 1, 'After');

    // card scenes
    A.shadow(ctx, 40, 14, 0.08); rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.fillStyle = C.white; ctx.fill(); A.noShadow(ctx);
    ctx.save(); rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.clip();
    const scenes = [{ a: 0, z: HOOK, draw: () => {
      const push = 1 + 0.04 * ease(prog(u, 0, 7));
      ctx.save(); ctx.translate(CARD.x + CARD.w / 2, CARD.y + CARD.h / 2); ctx.scale(push, push); ctx.translate(-(CARD.x + CARD.w / 2), -(CARD.y + CARD.h / 2));
      grid6(ctx, false, u, null); ctx.restore();
    } }];
    THEMES.forEach((th, j) => scenes.push({ a: partAt(j), z: j < 5 ? partAt(j + 1) : RECAP, draw: () => {
      ctx.fillStyle = MK[th.mock].bg; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
      const keys = [[-10, overview(th)], ...th.steps.map((s, i) => [stepAt(j, i) - 0.4, s.cam])];
      const st = stateFor(j, u);
      if (th.key === 'color' && !st.panel) st.panel = 'palette';
      drawMock(ctx, th.mock, st, springKeys(u, keys, SPRING.gentle), s0(th));
    } }));
    scenes.push({ a: RECAP, z: END + 1, draw: () => grid6(ctx, true, u, RECAP + 1.4) });
    scenes.forEach((sc) => {
      if (u < sc.a - 0.3 || u >= sc.z + 1.2) return;
      const k = sc.a === 0 ? 1 : ease(prog(u, sc.a - 0.3, sc.a + 0.7));
      ctx.save(); ctx.translate(0, (1 - k) * CARD.h);
      A.shadow(ctx, 30, -10, 0.12); ctx.fillStyle = C.white; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h); A.noShadow(ctx);
      sc.draw(); ctx.restore();
    });
    ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = C.line; rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.stroke();
    A.selection(ctx, FRAME.x, FRAME.y, FRAME.w, FRAME.h, { p: 1 });
    if (u >= END - 0.9) A.circleCover(ctx, CARD.x + CARD.w / 2, CARD.y + CARD.h / 2, prog(u, END - 0.9, END - 0.02));
  },
});
