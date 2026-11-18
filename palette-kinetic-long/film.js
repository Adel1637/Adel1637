// How to choose your color palette, step by step — YouTube long video 16:9 in the kinetic dark-software
// style (same vignettes as the Short: shared/palette-kinetic.js, mapped to the right half).
// Hook (shared/accroche.md): "STOP PICKING COLORS AT RANDOM." on frame 0 with moving color chips.
import * as M from './lib/motion.js';
import { makeKinetic } from '../shared/kinetic.js';
import { makePaletteKinetic } from '../shared/palette-kinetic.js';

const { W, H, E, TAU, hash01 } = M;
const K = makeKinetic(M), P = makePaletteKinetic(M, K);
const { F, C, ez, txt, maskUp, fit } = K;
const X0 = 110, XC = 900, CW = XC - X0;
const VS = 0.9, VX = 1000, VY = 175;                         // short coords (80..1000, 280..1150) -> right half

const CH = [
  { title: ['PICK YOUR', 'FIRST COLOR.'], ar: 'اختر لونك الأول.', en: 'CHOOSE IT FOR A FEELING, NOT BY CHANCE.', tip: 'WHITE TEXT MUST BE READABLE ON IT.', tipAr: 'يجب أن يُقرأ النص الأبيض فوقه بوضوح.', vig: (c, v) => P.vMoods(c, v), tipAt: 15 },
  { title: ['BUILD', '9 SHADES.'], ar: 'ابنِ 9 درجات منه.', en: 'FROM 50 (LIGHTEST) TO 800 (DARKEST).', tip: 'GIVE EACH SHADE ONE JOB.', tipAr: 'لكل درجة دور واحد محدد.', vig: (c, v) => P.vShades(c, v, true), tipAt: 15.5 },
  { title: ['ADD TINTED', 'GRAYS.'], ar: 'أضف رماديًا مائلًا إلى لونك.', en: 'A HINT OF YOUR COLOR KEEPS THEM CALM.', tip: 'PURE GRAY LOOKS COLD NEXT TO YOUR COLOR.', tipAr: 'الرمادي الخالص يبدو باردًا بجانب لونك.', vig: (c, v) => P.vGrays(c, v), tipAt: 12 },
  { title: ['ADD STATUS', 'COLORS.'], ar: 'أضف ألوان الحالات.', en: 'GREEN, YELLOW, RED. NOTHING ELSE.', tip: 'ALWAYS ADD AN ICON OR A WORD.', tipAr: 'أضف دائمًا أيقونة أو كلمة.', vig: (c, v) => P.vStatus(c, v), tipAt: 12 },
  { title: ['USE', '60–30–10.'], ar: 'طبّق قاعدة ‪60–30–10‬', en: '60% NEUTRAL · 30% SECONDARY · 10% BRAND.', tip: 'YOUR BRAND COLOR IS THE ACCENT.', tipAr: 'لون علامتك هو اللمسة البارزة.', vig: (c, v) => P.vRule(c, v), tipAt: 12 },
  { title: ['TEST IT.'], ar: 'اختبرها.', en: 'TEXT CONTRAST OF AT LEAST 4.5:1.', tip: 'THEN CHECK DARK MODE.', tipAr: 'ثم تحقّق من الوضع الداكن.', vig: (c, v) => P.vTest(c, v), tipAt: 12 },
  { title: ['4 MISTAKES', 'TO AVOID.'], ar: 'أربعة أخطاء يجب تجنّبها.', en: 'SPOT THEM BEFORE YOUR USERS DO.', tip: 'LESS COLOR, MORE CLARITY.', tipAr: 'ألوان أقل، ووضوح أكثر.', vig: (c, v) => P.vMistakes(c, v), tipAt: 13 },
];
const HOOK = 8, SPAN = 22, RECAP = HOOK + CH.length * SPAN, END = RECAP + 16;
const SCENES = [{ kind: 'hook', b0: 0, len: HOOK }, ...CH.map((c, i) => ({ kind: 'ch', ch: c, n: i + 1, b0: HOOK + i * SPAN, len: SPAN, bg: i % 2 ? '#222222' : '#1B1B1B' })), { kind: 'recap', b0: RECAP, len: 16 }, { kind: 'end', b0: END, len: 10 }];
SCENES.forEach((s, i) => { s.next = SCENES[i + 1]; s.dir = i % 2 ? 'left' : 'up'; });

// ------------------------------------------------------------------ sound (beats)
const HITS = [];
const hit = (b, l, s, o) => HITS.push(o ? [b, l, s, o] : [b, l, s]);
hit(0, 'hook slam', 'thud', { pitch: 'A1' }); hit(0, 'hook whoosh', 'whoosh', { len: 0.35 });
[1.5, 3, 4.5].forEach((b) => hit(b, 'chips', 'tick')); hit(6, 'chips gather', 'whoosh', { len: 0.4 });
hit(HOOK, 'riser into wipe', 'riser', { len: 1.2 }); hit(HOOK, 'ring wipe', 'impact');
SCENES.forEach((s) => { if (s.kind !== 'ch') return; const b = s.b0; if (s.n > 1) { hit(b, 'push', 'whoosh', { len: 0.45 }); hit(b, 'sub', 'sub'); } hit(b + 0.9, 'title', 'whoosh', { len: 0.25 }); hit(b + 2.0, 'arabic', 'tick'); hit(b + s.ch.tipAt, 'tip', 'tok', { pitch: 'G5' }); });
const cb = (n) => HOOK + (n - 1) * SPAN;
[0, 1, 2].forEach((i) => hit(cb(1) + 2.6 + i * 0.6, `mood ${i}`, 'pop', { pitch: ['C5', 'E5', 'G5'][i] })); hit(cb(1) + 5.6, 'choose blue', 'click'); hit(cb(1) + 6.4, 'others out', 'whoosh', { len: 0.4 });
hit(cb(1) + 8, 'picker', 'thud', { pitch: 'E2' }); hit(cb(1) + 9.2, 'handle', 'boing', { pitch: 'C4', to: 'G4' }); hit(cb(1) + 14.4, 'button', 'pop', { pitch: 'C6' }); hit(cb(1) + 15.2, 'pass', 'bell', { pitch: 'E6' });
P.SHADES.forEach((_, i) => hit(cb(2) + 2.6 + i * 0.3, `shade ${i}`, 'pop', { pitch: ['C5', 'D5', 'E5', 'F#5', 'G#5', 'A#5', 'C6', 'D6', 'E6'][i] })); hit(cb(2) + 6.2, 'base', 'tok', { pitch: 'G5' }); [0, 1, 2, 3, 4].forEach((i) => hit(cb(2) + 9 + i * 1.2, `role ${i}`, 'blip', { pitch: 'A6' }));
hit(cb(3) + 2.6, 'brand row', 'thud', { pitch: 'E2' }); hit(cb(3) + 3.6, 'gray row', 'thud', { pitch: 'C2' }); hit(cb(3) + 5.2, 'tint', 'riser', { len: 1.0 }); hit(cb(3) + 9.5, 'cards', 'pop', { pitch: 'C6' });
[0, 1, 2].forEach((i) => { hit(cb(4) + 2.8 + i * 0.9, `toast ${i}`, 'whoosh', { len: 0.3 }); hit(cb(4) + 3.1 + i * 0.9, `icon ${i}`, 'blip', { pitch: ['E6', 'C6', 'A5'][i] }); hit(cb(4) + 8.5 + i * 0.4, `swatch ${i}`, 'pop', { pitch: ['C6', 'E6', 'G6'][i] }); });
[0, 1, 2].forEach((i) => hit(cb(5) + 2.6 + i * 0.6, `bar ${i}`, 'thud', { pitch: ['C3', 'E3', 'G3'][i] })); hit(cb(5) + 8, 'page', 'whoosh', { len: 0.4 });
hit(cb(6) + 2.6, 'card', 'thud', { pitch: 'E2' }); for (let i = 0; i < 6; i++) hit(cb(6) + 4 + i * 0.25, `count ${i}`, 'tick'); hit(cb(6) + 5.6, 'AA', 'bell', { pitch: 'E6' }); hit(cb(6) + 7, 'switch', 'pop', { pitch: 'C5' }); hit(cb(6) + 8, 'on', 'click'); hit(cb(6) + 8.3, 'dark', 'whoosh', { len: 0.5 });
[0, 1, 2, 3].forEach((i) => { hit(cb(7) + 2.6 + i * 2.2, `mistake ${i}`, 'whoosh', { len: 0.3 }); hit(cb(7) + 3.4 + i * 2.2, `cross ${i}`, 'thud', { pitch: 'C3' }); });
hit(RECAP, 'recap push', 'whoosh', { len: 0.45 }); [0, 1, 2, 3, 4].forEach((i) => hit(RECAP + 1.2 + i * 0.5, `row ${i}`, 'whoosh', { len: 0.25 }));
hit(END, 'end wipe', 'impact'); hit(END + 2, 'follow', 'tick');

// ------------------------------------------------------------------ scenes
function topline(ctx, label) {
  txt(ctx, 'LEARN UI/UX', X0, 84, 24, { w: 600, color: C.sub, family: F.mono });
  txt(ctx, 'AG STUDIO', W - X0, 84, 24, { w: 600, color: C.sub, align: 'right', family: F.mono });
  if (label) txt(ctx, label, X0, 140, 24, { w: 600, color: C.sub, family: F.mono });
}
function column(ctx, v, c) {
  const size = Math.min(...c.title.map((l) => fit(ctx, l, 120, CW)));
  c.title.forEach((l, i) => maskUp(ctx, l, X0 - 4, 450 - (c.title.length - 1 - i) * size * 1.0, size, ez(v, 0.9 + i * 0.25, 2.0 + i * 0.25), { color: '#FFFFFF' }));
  maskUp(ctx, c.en, X0, 520, fit(ctx, c.en, 26, CW, 600, F.mono), ez(v, 1.5, 2.5), { w: 600, color: C.sub, family: F.mono });
  maskUp(ctx, c.ar, XC, 600, fit(ctx, c.ar, 46, CW, 700, F.ar), ez(v, 1.9, 2.9), { family: F.ar, align: 'right', rtl: true });
  if (!c.tip) return;
  const tp = ez(v, c.tipAt, c.tipAt + 0.8, E.outCubic);
  if (tp > 0) {
    ctx.fillStyle = C.sel; ctx.fillRect(X0, 720, 70 * tp, 5);
    maskUp(ctx, 'TIP', X0, 780, 26, tp, { w: 600, color: C.sel, family: F.mono });
    maskUp(ctx, c.tip, X0, 834, fit(ctx, c.tip, 28, CW, 600, F.mono), ez(v, c.tipAt + 0.3, c.tipAt + 1.2), { w: 600, color: C.ink, family: F.mono });
    maskUp(ctx, c.tipAr, XC, 904, fit(ctx, c.tipAr, 38, CW, 700, F.ar), ez(v, c.tipAt + 0.7, c.tipAt + 1.6), { family: F.ar, align: 'right', rtl: true });
  }
}
const vig = (ctx, fn) => { ctx.save(); ctx.translate(VX, VY); ctx.scale(VS, VS); ctx.translate(-80, -280); fn(); ctx.restore(); };
function hook(ctx, v, t) {
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  topline(ctx);
  P.chips(ctx, v, t, [1000, 200, 820, 680], [6, 7], [1410, 540]);
  const size = fit(ctx, 'STOP PICKING', 170, CW / 1.04);
  [['STOP PICKING', 360], ['COLORS AT', 520], ['RANDOM.', 680]].forEach(([s, y], i) => txt(ctx, s, X0 + (i % 2 ? -1 : 1) * v * 6, y, size, { color: '#FFFFFF', sx: 1 + 0.03 * Math.sin(t * 3.2 + i) }));
  txt(ctx, 'توقّف عن اختيار الألوان عشوائيًا.', XC, 820, fit(ctx, 'توقّف عن اختيار الألوان عشوائيًا.', 56, CW, 700, F.ar), { family: F.ar, align: 'right', rtl: true });
  txt(ctx, '7 STEPS TO A PALETTE THAT WORKS.', X0, 900, fit(ctx, '7 STEPS TO A PALETTE THAT WORKS.', 32, CW, 600, F.mono), { w: 600, family: F.mono, color: C.sub });
  const q = ez(v, 6.6, 8, E.inExpo);
  if (q > 0) { const r = 30 + q * 2600; ctx.fillStyle = P.BASE; ctx.beginPath(); ctx.arc(1410, 540, r, 0, TAU); ctx.fill(); ctx.fillStyle = SCENES[1].bg; ctx.beginPath(); ctx.arc(1410, 540, Math.max(0, r - 100), 0, TAU); ctx.fill(); }
}
function chapter(ctx, v, s) {
  ctx.fillStyle = s.bg; ctx.fillRect(0, 0, W, H);
  topline(ctx, `CHAPTER 0${s.n} / 07`);
  column(ctx, v, s.ch);
  vig(ctx, () => s.ch.vig(ctx, v));
}
function recap(ctx, v) {
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  topline(ctx, 'RECAP');
  column(ctx, v, { title: ['SAVE THIS', 'METHOD.'], en: 'COLOR · SHADES · GRAYS · STATUS · 60–30–10 · TEST', ar: 'احفظ هذه الطريقة.' });
  vig(ctx, () => P.vRecap(ctx, v, true));
  const q = ez(v, 15.2, 16, E.inExpo);
  if (q > 0) { ctx.fillStyle = C.endBlue; ctx.beginPath(); ctx.arc(W / 2, H / 2, q * 1200, 0, TAU); ctx.fill(); }
}
function endPage(ctx, v) {
  ctx.fillStyle = C.endBlue; ctx.fillRect(0, 0, W, H);
  maskUp(ctx, 'Keep it simple.', X0, 360, 170, ez(v, 0, 0.8), { color: '#FFFFFF' });
  maskUp(ctx, 'اجعلها بسيطة.', W - X0, 520, 96, ez(v, 0.4, 1.2), { family: F.ar, align: 'right', rtl: true, color: '#FFFFFF' });
  const l = ez(v, 1.6, 2.4, E.inOutCubic); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(X0, 620, (W - 2 * X0) * l, 3);
  maskUp(ctx, 'Follow for more UI/UX tutorials', X0, 760, 80, ez(v, 2, 2.8), { color: '#FFFFFF' });
  maskUp(ctx, 'تابعني لمزيد من دروس UI/UX', W - X0, 890, 60, ez(v, 2.6, 3.4), { family: F.ar, align: 'right', rtl: true, color: '#FFFFFF' });
}

// ------------------------------------------------------------------ thumbnail (?cover=youtube)
const COVER = new URLSearchParams(location.search).get('cover');
function cover(ctx) {
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  txt(ctx, 'LEARN UI/UX', X0, 110, 30, { w: 600, family: F.mono, color: C.sub }); txt(ctx, 'AG STUDIO', W - X0, 110, 30, { w: 600, family: F.mono, color: C.sub, align: 'right' });
  const size = fit(ctx, 'HOW TO CHOOSE', 160, 1000);
  ['HOW TO CHOOSE', 'YOUR COLOR', 'PALETTE.'].forEach((s, i) => txt(ctx, s, X0, 330 + i * size * 1.02, size, { color: '#FFFFFF' }));
  txt(ctx, 'كيف تختار لوحة ألوانك', X0 + 1000, 900, 76, { family: F.ar, align: 'right', rtl: true });
  const w = 560 / 9; P.SHADES.forEach((c, i) => { const h = 420 + i * 40; K.rr(ctx, 1250 + i * w + 4, 960 - h, w - 8, h, 10, c); });
}

// ------------------------------------------------------------------ film
const FAST = SCENES.map((s) => s.b0);
let GRAIN = null;
function drawScene(ctx, s, v, t) { if (s.kind === 'hook') hook(ctx, v, t); else if (s.kind === 'ch') chapter(ctx, v, s); else if (s.kind === 'recap') recap(ctx, v); else endPage(ctx, v); }
M.film({
  fonts: [`700 100px ${F.title}`, `600 40px ${F.mono}`, `700 60px ${F.ar}`],
  images: {}, hits: HITS, shutter: 0.6,
  samples: (t) => { const u = t / K.B; return FAST.some((b) => u > b - 1.2 && u < b + 3.2) ? 8 : 3; },
  async init() { await document.fonts.load(`700 60px ${F.ar}`, 'توقّف عن اختيار').catch(() => {}); GRAIN = K.makeGrain(960, 540); },
  draw(ctx, u, t) {
    ctx.save();
    if (COVER) { cover(ctx); ctx.restore(); return; }
    let s = SCENES[0]; SCENES.forEach((x) => { if (u >= x.b0) s = x; });
    const v = u - s.b0, push = s.next && s.kind === 'ch';
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
