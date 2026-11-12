// Spot the mistake #sample (Short 9:16): 5-second hunt on a fictional page, reveal, fix, ask for the score.
// Hook (shared/accroche.md): "Find 3 mistakes in 5 seconds." on frame 0, countdown already running.
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';
import { makeMockups } from '../shared/mockups.js';

const { E, prog, clamp, springU, springKeys, SPRING, font, rrect, lerp, TAU } = M;
const A = makeAGS(M);
const { C, F, L } = A;
const WEB = makeMockups(M, A).web;
const FRAME = { x: 142, y: 752, w: 796, h: 760 }, CARD = { x: 162, y: 772, w: 756, h: 720, r: 32 };
const BEAT = 60 / 128, HUNT = 5 / BEAT, REVEAL = HUNT, FIX = 20, ASK = 26, END = 32;
const MISTAKES = [
  { r: 'headline', at: REVEAL + 0.8, en: 'Vague headline', ar: 'عنوان غامض' },
  { r: 'buttons', at: REVEAL + 3.3, en: 'Three equal buttons', ar: 'ثلاثة أزرار متساوية' },
  { r: 'cards', at: REVEAL + 5.8, en: 'Uneven cards', ar: 'بطاقات غير متناسقة' },
];

const HITS = [];
const hit = (b, l, s, o) => HITS.push(o ? [b, l, s, o] : [b, l, s]);
for (let i = 0; i < 5; i++) hit(i / BEAT, `count ${5 - i}`, 'tick');
hit(HUNT, "time's up", 'click');
MISTAKES.forEach((m, i) => hit(m.at, m.en, 'pop', { pitch: ['A5', 'C#6', 'E6'][i] }));
hit(FIX, 'fix', 'click'); hit(FIX + 4.2, 'fixed', 'bell', { pitch: 'E6' });
hit(ASK, 'question', 'type', { n: 6, len: 0.6 });
hit(END - 0.9, 'circle', 'click'); hit(END + 0.1, 'keep it', 'pop', { pitch: 'A5' }); hit(END + 2.2, 'follow', 'pop', { pitch: 'A6' });

function fit(ctx, s, max, w, fam, rtl) { ctx.font = font(max, 700, fam); ctx.direction = rtl ? 'rtl' : 'ltr'; const m = ctx.measureText(s).width; ctx.direction = 'ltr'; return Math.min(max, Math.floor(max * w / m)); }
function block(ctx, u, b, exit, d) {
  const t = A.riseWords(ctx, u, b, d.title, { x: L.left, y: 395, size: 74, maxW: d.maxW || L.width, stagger: 0.09, hl: d.hl || [], hlAt: d.hlAt, exit });
  const y1 = t.bottom + 82;
  A.line(ctx, u, b + d.lag * 0.6, d.ar, { x: L.right, y: y1, size: fit(ctx, d.ar, 54, L.width, F.arabic, true), weight: 700, color: C.blue, align: 'right', rtl: true, exit: exit + 0.05 });
  if (d.en2) A.line(ctx, u, b + d.lag * 1.1, d.en2, { x: L.left, y: y1 + 70, size: 34, weight: 500, color: C.grey, align: 'left', exit: exit + 0.1 });
  if (d.ar2) A.line(ctx, u, b + d.lag * 1.5, d.ar2, { x: L.right, y: y1 + 124, size: 32, weight: 500, color: C.grey, align: 'right', rtl: true, exit: exit + 0.15 });
}

const COVER = new URLSearchParams(location.search).get('cover');
function drawPage(ctx, st, cam) {
  const [fx, fy, z] = cam, s = (CARD.w / WEB.w) * z; st.px = 1 / s;
  ctx.save(); ctx.translate(CARD.x + CARD.w / 2, CARD.y + CARD.h / 2); ctx.scale(s, s); ctx.translate(-fx, -fy); WEB.draw(ctx, st); ctx.restore();
}
function cover(ctx, kind) {
  A.paper(ctx); const top = kind === 'tiktok' ? 300 : 230;
  A.header(ctx, 1000, 'UI fix', { y: top });
  A.riseWords(ctx, 1000, 0, 'Find 3', { x: L.left, y: top + 210, size: 150, hl: [1], hlAt: 0 });
  A.riseWords(ctx, 1000, 0, 'mistakes.', { x: L.left, y: top + 360, size: 150 });
  A.line(ctx, 1000, 0, 'اعثر على 3 أخطاء', { x: L.right, y: top + 480, size: 76, weight: 800, color: C.blue, align: 'right', rtl: true, family: 'CoverCairo, Jakarta' });
  ctx.save(); ctx.translate(0, top + 560 - CARD.y); A.shadow(ctx, 30, 10, 0.12); rrect(ctx, CARD.x, CARD.y, CARD.w, 640, 28); ctx.fillStyle = C.white; ctx.fill(); A.noShadow(ctx);
  rrect(ctx, CARD.x, CARD.y, CARD.w, 640, 28); ctx.clip(); drawPage(ctx, { p: [0, 0, 0, 0, 0], bad: [], good: [] }, [480, 470, 0.86]); ctx.restore();
}

M.film({
  fonts: [font(74, 800, F.latin), font(34, 500, F.latin), font(54, 700, F.arabic), font(32, 500, F.arabic)],
  images: {}, hits: HITS,
  async init() { await Promise.all([F.arabic, ...(COVER ? ['CoverCairo'] : [])].flatMap((f) => [500, 600, 700, 800].map((w) => document.fonts.load(font(40, w, f), 'اعثر على أخطاء ٦').catch(() => {})))); },
  draw(ctx, u) {
    if (COVER) { cover(ctx, COVER); return; }
    if (u >= END) { A.endCard(ctx, u, END + 0.1); return; }
    A.paper(ctx); A.header(ctx, u, 'UI fix', { u0: -20 });
    // text column
    if (u < REVEAL) block(ctx, u, -20, REVEAL - 0.5, { title: 'Find 3 mistakes in 5 seconds.', hl: [2], hlAt: -20, maxW: 640, lag: 0, ar: 'اعثر على 3 أخطاء في 5 ثوانٍ.', en2: 'Landing page, before review.', ar2: 'صفحة رئيسية قبل المراجعة.' });
    if (u >= REVEAL - 0.3 && u < FIX) {
      block(ctx, u, REVEAL, FIX - 0.5, { title: 'Here they are.', hl: [2], hlAt: REVEAL + 0.6, lag: 1, ar: 'ها هي الأخطاء.' });
      MISTAKES.forEach((m, i) => {
        A.line(ctx, u, m.at, `${i + 1}. ${m.en}`, { x: L.left, y: 600 + i * 46, size: 34, weight: 700, color: C.ink, align: 'left', exit: FIX - 0.4 });
        A.line(ctx, u, m.at + 0.2, `${i + 1}. ${m.ar}`, { x: L.right, y: 600 + i * 46, size: 32, weight: 600, color: C.red, align: 'right', rtl: true, exit: FIX - 0.4 });
      });
    }
    if (u >= FIX - 0.3 && u < ASK) block(ctx, u, FIX, ASK - 0.5, { title: 'Fixed.', hl: [0], hlAt: FIX + 4.2, lag: 1, ar: 'بعد التصحيح.', en2: 'Clear headline, one main button, even cards.', ar2: 'عنوان واضح، زر رئيسي واحد، بطاقات متناسقة.' });
    if (u >= ASK - 0.3) block(ctx, u, ASK, END + 1, { title: 'How many did you find?', hl: [3, 4], hlAt: ASK + 1, lag: 1, ar: 'كم خطأً وجدت؟', en2: 'Comment your score.', ar2: 'اكتب نتيجتك في التعليقات.' });
    // card
    A.shadow(ctx, 40, 14, 0.08); rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.fillStyle = C.white; ctx.fill(); A.noShadow(ctx);
    ctx.save(); rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.clip();
    const k = E.inOutCubic(prog(u, FIX, FIX + 4));
    const st = { p: [k, k, 0, k, 0], bad: [], good: [] };
    MISTAKES.forEach((m) => { const p = prog(u, m.at, m.at + 0.5) * (1 - prog(u, FIX, FIX + 0.6)); if (p > 0) st.bad.push({ r: WEB.R[m.r], p }); });
    const g = prog(u, FIX + 4.2, FIX + 4.7) * (1 - prog(u, ASK + 2, ASK + 2.6)); if (g > 0) MISTAKES.forEach((m) => st.good.push({ r: WEB.R[m.r], p: g }));
    drawPage(ctx, st, springKeys(u, [[-10, [480, 520, 0.8]], [0, [470, 470, 0.95]], [3.2, [540, 560, 1.05]], [6.4, [440, 520, 1.0]], [REVEAL, [480, 500, 0.86]]], SPRING.gentle));
    ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = C.line; rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.stroke();
    A.selection(ctx, FRAME.x, FRAME.y, FRAME.w, FRAME.h, { p: 1 });
    // magnifying glass sweeping the page while the viewer searches
    if (u < REVEAL + 0.6) {
      const tt = u * BEAT, a = 1 - prog(u, REVEAL, REVEAL + 0.6);
      const lx = CARD.x + CARD.w * (0.5 + 0.34 * Math.sin(tt * 1.7)), ly = CARD.y + CARD.h * (0.45 + 0.3 * Math.sin(tt * 1.1 + 1));
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.ink; ctx.lineWidth = 9; ctx.lineCap = 'round';
      ctx.fillStyle = 'rgba(47,91,255,0.08)'; ctx.beginPath(); ctx.arc(lx, ly, 58, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(lx + 42, ly + 42); ctx.lineTo(lx + 86, ly + 86); ctx.lineWidth = 14; ctx.stroke(); ctx.restore();
    }
    // countdown: ring + number, then "Time's up"
    const t = u * BEAT;
    if (u < REVEAL + 1.5) {
      const out = prog(u, REVEAL + 0.6, REVEAL + 1.4), cx = 836, cy = 866, r = 74 * (1 - out);
      if (r > 1) {
        ctx.save(); A.shadow(ctx, 20, 6, 0.15); ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); A.noShadow(ctx);
        ctx.strokeStyle = t < 5 ? C.blue : C.red; ctx.lineWidth = 10 * (1 - out); ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(cx, cy, Math.max(0, r - 12), -Math.PI / 2, -Math.PI / 2 + TAU * (1 - clamp(t / 5))); ctx.stroke();
        const n = Math.max(1, 5 - Math.floor(t)), pop = 1 + 0.18 * (1 - clamp((t % 1) / 0.25));
        ctx.font = font((t < 5 ? 64 : 30) * pop * (1 - out), 800, F.latin); ctx.fillStyle = t < 5 ? C.ink : C.red; ctx.textAlign = 'center';
        ctx.fillText(t < 5 ? String(n) : "Time's up", cx, cy + (t < 5 ? 22 : 10)); ctx.restore();
      }
    }
    if (u >= END - 0.9) A.circleCover(ctx, CARD.x + CARD.w / 2, CARD.y + CARD.h / 2, prog(u, END - 0.9, END - 0.02));
  },
});
