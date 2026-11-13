// AG Studio channel trailer (YouTube 16:9, ~47 s). Hook: "Learn UI/UX, one fix at a time." (shared/accroche.md)
// A fast montage of before -> after on the fictional interfaces of the series, then a subscribe call.
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';
import { makeMockups } from '../shared/mockups.js';
import { makeStyleMockup } from '../shared/mockup-style.js';
import { makeFoundMockups } from '../shared/mockup-found.js';

const { E, prog, clamp, lerp, springU, SPRING, font, rrect, bump, TAU } = M;
const A = makeAGS(M);
const { C, F } = A;
const MK = { ...makeMockups(M, A), style: makeStyleMockup(M, A), ...makeFoundMockups(M, A) };
const ease = E.inOutCubic;
const COL = { l: 120, r: 1000 }, FRAME = { x: 1080, y: 170, w: 720, h: 840 }, CARD = { x: 1100, y: 190, w: 680, h: 800 };
const HOOK = 8, SPAN = 14, CTA = HOOK + 5 * SPAN, END = CTA + 10;
const TOPICS = [
  { title: 'Color & type', ar: 'الألوان والخطوط', mock: 'style', bad: ['headline', 'buttons', 'cards'], good: ['cards'] },
  { title: 'Spacing & layout', ar: 'المسافات والتخطيط', mock: 'spacing', bad: ['form', 'cards'], good: ['cards'] },
  { title: 'Websites', ar: 'تصميم المواقع', mock: 'web', bad: ['headline', 'buttons'], good: ['headline'] },
  { title: 'Apps', ar: 'تصميم التطبيقات', mock: 'app', fit: 'height', bad: ['addTop'], good: ['addBottom'] },
  { title: 'Dark mode & accessibility', ar: 'الوضع الداكن وإمكانية الوصول', mock: 'darkA11y', bad: ['list'], good: ['list'] },
];
const at = (i) => HOOK + i * SPAN;

const HITS = [];
const hit = (b, l, s, o) => HITS.push(o ? [b, l, s, o] : [b, l, s]);
hit(0, 'hook on screen', 'click'); hit(0.5, 'hook motion', 'tick'); hit(2, 'fix starts', 'type', { n: 8, len: 1.2 }); hit(6, 'fixed', 'bell', { pitch: 'E6' });
TOPICS.forEach((t, i) => { const b = at(i); hit(b - 0.1, `${t.title} badge`, 'pop', { pitch: 'E6' }); hit(b + 0.1, `${t.title} title`, 'type', { n: 5, len: 0.5 }); hit(b + 1.2, `${t.title} mistakes`, 'blip', { pitch: 'C5' }); hit(b + 3, `${t.title} fix`, 'click'); hit(b + 8.4, `${t.title} fixed`, 'bell', { pitch: 'E6' }); });
hit(CTA, 'cta', 'type', { n: 6, len: 0.6 }); hit(CTA + 4.2, 'subscribe click', 'click'); hit(CTA + 4.8, 'subscribed', 'bell', { pitch: 'A6' });
hit(END - 0.9, 'circle', 'click'); hit(END + 0.1, 'keep it simple', 'pop', { pitch: 'A5' }); hit(END + 2.2, 'follow pill', 'pop', { pitch: 'A6' });

function fit(ctx, s, max, w, fam, rtl, weight = 700) { ctx.font = font(max, weight, fam); ctx.direction = rtl ? 'rtl' : 'ltr'; const m = ctx.measureText(s).width; ctx.direction = 'ltr'; return Math.min(max, Math.floor(max * w / m)); }
function block(ctx, u, b, exit, d) {
  const hb = d.n != null, tx = hb ? COL.l + 100 : COL.l, cw = COL.r - COL.l;
  ctx.font = font(84, 800, F.latin); ctx.letterSpacing = `${-0.035 * 84}px`; const tw = ctx.measureText(d.title).width; ctx.letterSpacing = '0px';
  const size = hb ? Math.min(84, Math.floor(84 * (COL.r - tx) / tw)) : (d.size || 84);
  if (hb) A.badge(ctx, d.n, COL.l, 338, springU(u, b - 0.15, SPRING.bouncy) * (1 - E.inCubic(prog(u, exit, exit + 0.4))));
  const t = A.riseWords(ctx, u, b, d.title, { x: tx, y: 406, size, maxW: COL.r - tx, stagger: 0.09, hl: d.hl || [], hlAt: d.hlAt, exit });
  const y1 = t.bottom + 98, lag = d.lag == null ? 1 : d.lag;
  A.line(ctx, u, b + lag * 0.6, d.ar, { x: COL.r, y: y1, size: fit(ctx, d.ar, 60, cw, F.arabic, true), weight: 700, color: C.blue, align: 'right', rtl: true, exit: exit + 0.05 });
  if (d.en2) A.line(ctx, u, b + lag * 1.1, d.en2, { x: COL.l, y: y1 + 80, size: fit(ctx, d.en2, 38, cw, F.latin, false, 500), weight: 500, color: C.grey, align: 'left', exit: exit + 0.1 });
  if (d.ar2) A.line(ctx, u, b + lag * 1.5, d.ar2, { x: COL.r, y: y1 + 138, size: fit(ctx, d.ar2, 35, cw, F.arabic, true, 500), weight: 500, color: C.grey, align: 'right', rtl: true, exit: exit + 0.15 });
}
function label(ctx, u, u0, exit, text) {
  const k = u0 < 0 ? 1 : springU(u, u0, SPRING.snappy), ex = E.inCubic(prog(u, exit, exit + 0.3));
  if (k <= 0 || ex >= 1) return;
  ctx.save(); ctx.globalAlpha = clamp(k * 1.5) * (1 - ex); ctx.font = font(28, 600, F.latin); ctx.fillStyle = C.blue; ctx.textAlign = 'left'; ctx.fillText(text, FRAME.x, 146 + (1 - k) * 12); ctx.restore();
}
function drawMock(ctx, t, st, zoomK = 1) {
  const MOCK = MK[t.mock], hgt = t.fit === 'height';
  const s = (hgt ? CARD.h / MOCK.h : CARD.w / MOCK.w) * (hgt ? 1 : 0.86) * zoomK, [fx, fy] = hgt ? [195, 422] : [480, 620];
  st.px = 1 / s;
  ctx.fillStyle = MOCK.bg; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
  ctx.save(); ctx.translate(CARD.x + CARD.w / 2, CARD.y + CARD.h / 2); ctx.scale(s, s); ctx.translate(-fx, -fy); MOCK.draw(ctx, st); ctx.restore();
}
function topicState(t, v) {
  const k = ease(prog(v, 3, 8)), st = { p: [k, k, k, k, k], bad: [], good: [], panel: 'palette' };
  const pb = prog(v, 1.2, 1.7) * (1 - prog(v, 2.8, 3.2)), pg = prog(v, 8.4, 8.9) * (1 - prog(v, SPAN - 0.9, SPAN - 0.4));
  const R = MK[t.mock].R;
  if (pb > 0) t.bad.forEach((key) => st.bad.push({ r: R[key], p: pb }));
  if (pg > 0) t.good.forEach((key) => st.good.push({ r: R[key], p: pg }));
  return st;
}

M.film({
  fonts: [font(84, 800, F.latin), font(38, 500, F.latin), font(60, 700, F.arabic), font(35, 500, F.arabic)],
  images: {}, hits: HITS,
  async init() { await Promise.all([500, 600, 700, 800].map((w) => document.fonts.load(font(40, w, F.arabic), 'تعلّم تصحيحًا بعد').catch(() => {}))); },
  draw(ctx, u) {
    if (u >= END) { A.endCardWide(ctx, u, END + 0.1); return; }
    A.paper(ctx); A.header(ctx, u, 'Learn UI/UX', { u0: -20, y: 56, left: COL.l, right: 1800 });
    if (u < HOOK) block(ctx, u, -20, HOOK - 0.55, { title: 'Learn UI/UX, one fix at a time.', hl: [2, 3], hlAt: -20, lag: 0, maxW: 760, ar: 'تعلّم UI/UX، تصحيحًا بعد تصحيح.', en2: 'Short tutorials. Real fixes. English + Arabic.', ar2: 'دروس قصيرة وتصحيحات حقيقية، بالإنجليزية والعربية.' });
    TOPICS.forEach((t, i) => { const b = at(i), nb = i < 4 ? at(i + 1) : CTA; if (u >= b - 0.3 && u < nb) block(ctx, u, b, nb - 0.55, { n: i + 1, title: t.title, ar: t.ar, en2: 'Before → after, step by step.', ar2: 'قبل وبعد، خطوة بخطوة.' }); });
    if (u >= CTA - 0.3) block(ctx, u, CTA, END + 1, { title: 'New tutorials every week.', hl: [3], hlAt: CTA + 1, size: 80, ar: 'دروس جديدة كل أسبوع.', en2: "Subscribe so you don't miss the next fix.", ar2: 'اشترك حتى لا يفوتك التصحيح القادم.' });
    let done = 0; TOPICS.forEach((t, i) => { done += ease(prog(u, at(i), at(i) + 0.8)); });
    A.progress(ctx, 5, done, { y: 990, x0: COL.l, width: COL.r - COL.l, alpha: clamp(prog(u, HOOK - 0.5, HOOK)) * (1 - prog(u, CTA + 0.3, CTA + 1)) });
    if (u < HOOK) label(ctx, u, -1, HOOK - 0.4, 'Before → after');
    TOPICS.forEach((t, i) => { const b = at(i), nb = i < 4 ? at(i + 1) : CTA; if (u >= b - 0.2 && u < nb) label(ctx, u, b + 0.3, nb - 0.4, 'Fictional interface'); });
    if (u >= CTA) label(ctx, u, CTA + 0.3, END + 1, 'Subscribe');
    A.shadow(ctx, 40, 14, 0.08); rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, 30); ctx.fillStyle = C.white; ctx.fill(); A.noShadow(ctx);
    ctx.save(); rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, 30); ctx.clip();
    const scenes = [{ a: 0, z: HOOK, draw: () => {
      const k = ease(prog(u, 2, 6)), st = { p: [k, k, k, k, k], bad: [], good: [], panel: 'palette' };
      const out = 1 - prog(u, 1.6, 2.2); if (out > 0) ['headline', 'buttons', 'cards'].forEach((key, j) => st.bad.push({ r: MK.style.R[key], p: out * (1 + 0.08 * Math.sin((u + j) * 3)) }));
      const g = prog(u, 6, 6.5) * (1 - prog(u, HOOK - 0.8, HOOK - 0.3)); if (g > 0) st.good.push({ r: MK.style.R.cards, p: g });
      drawMock(ctx, TOPICS[0], st, 1 + 0.1 * prog(u, 0, 8));
    } },
    ...TOPICS.map((t, i) => ({ a: at(i), z: i < 4 ? at(i + 1) : CTA, draw: () => drawMock(ctx, t, topicState(t, u - at(i)), 1 + 0.05 * prog(u, at(i), at(i) + SPAN)) })),
    { a: CTA, z: END + 1, draw: () => {
      ctx.fillStyle = '#F1F3F7'; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
      const v = u - CTA, cx = CARD.x + CARD.w / 2, cy = CARD.y + CARD.h / 2, on = v > 4.3, press = bump(v, 4.2, 0.35), w = 420, h = 120, sc = (1 - 0.05 * press) * springU(u, CTA + 0.6, SPRING.bouncy);
      ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
      A.shadow(ctx, 30, 12, 0.18); rrect(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = on ? C.green : C.ink; ctx.fill(); A.noShadow(ctx);
      ctx.font = font(48, 800, F.latin); ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.fillText(on ? 'Subscribed' : 'Subscribe', 0, 17); ctx.restore();
      A.ripple(ctx, cx + 60, cy + 10, prog(v, 4.2, 4.9));
      const m = ease(prog(v, 2.4, 4.0)); A.cursor(ctx, lerp(CARD.x + CARD.w - 60, cx + 60, m), lerp(CARD.y + CARD.h - 60, cy + 10, m) - Math.sin(Math.PI * m) * 50, { press, alpha: clamp(prog(v, 2.2, 2.6)) * (1 - prog(v, 7, 7.6)) });
      A.line(ctx, u, CTA + 5, 'youtube.com/@AGStudioDev', { x: cx, y: cy + 150, size: 30, weight: 700, color: C.blue, align: 'center' });
    } }];
    scenes.forEach((sc) => {
      if (u < sc.a - 0.3 || u >= sc.z + 1.2) return;
      const k = sc.a === 0 ? 1 : ease(prog(u, sc.a - 0.3, sc.a + 0.7));
      ctx.save(); ctx.translate(0, (1 - k) * CARD.h); A.shadow(ctx, 30, -10, 0.12); ctx.fillStyle = C.white; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h); A.noShadow(ctx); sc.draw(); ctx.restore();
    });
    ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = C.line; rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, 30); ctx.stroke();
    A.selection(ctx, FRAME.x, FRAME.y, FRAME.w, FRAME.h, { p: 1 });
    if (u >= END - 0.9) A.circleCover(ctx, CARD.x + CARD.w / 2, CARD.y + CARD.h / 2, prog(u, END - 0.9, END - 0.02));
  },
});
