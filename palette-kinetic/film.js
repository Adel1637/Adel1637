// How to choose your color palette — Short 9:16 in the kinetic dark-software style (same look as
// tools-uiux). Hook (shared/accroche.md): "STOP PICKING COLORS AT RANDOM." on frame 0, random color chips
// moving, then they collapse into one point that opens on step 1 (ring wipe in the brand color).
import * as M from './lib/motion.js';
import { makeKinetic } from '../shared/kinetic.js';
import { makePaletteKinetic } from '../shared/palette-kinetic.js';

const { W, H, lerp, E, TAU, hash01 } = M;
const K = makeKinetic(M), P = makePaletteKinetic(M, K);
const { F, C, ez, spr, txt, maskUp, fit } = K;
const X0 = 80, CW = W - 2 * X0;

const STEPS = [
  { title: ['START WITH', 'ONE COLOR.'], ar: 'ابدأ بلون واحد.', en: 'YOUR BRAND COLOR. EVERYTHING COMES FROM IT.', vig: (ctx, v) => P.vPicker(ctx, v, 2.6), bg: '#1B1B1B' },
  { title: ['BUILD', '9 SHADES.'], ar: 'ابنِ 9 درجات منه.', en: 'FROM 50 (LIGHTEST) TO 800 (DARKEST).', vig: (ctx, v) => P.vShades(ctx, v, false), bg: '#222222' },
  { title: ['ADD TINTED', 'GRAYS.'], ar: 'أضف رماديًا مائلًا إلى لونك.', en: 'A HINT OF YOUR COLOR KEEPS THEM CALM.', vig: (ctx, v) => P.vGrays(ctx, v), bg: '#1B1B1B' },
  { title: ['ADD STATUS', 'COLORS.'], ar: 'أضف ألوان الحالات.', en: 'GREEN, YELLOW, RED. ALWAYS WITH AN ICON.', vig: (ctx, v) => P.vStatus(ctx, v), bg: '#222222' },
  { title: ['TEST IT.'], ar: 'اختبرها.', en: 'CONTRAST OF AT LEAST 4.5:1, THEN DARK MODE.', vig: (ctx, v) => P.vTest(ctx, v), bg: '#1B1B1B' },
];
const HOOK = 4, SPAN = 14, RECAP = HOOK + 5 * SPAN, END = RECAP + 10;
const SCENES = [{ kind: 'hook', b0: 0, len: HOOK }, ...STEPS.map((s, i) => ({ kind: 'step', step: s, n: i + 1, b0: HOOK + i * SPAN, len: SPAN })), { kind: 'recap', b0: RECAP, len: 10 }, { kind: 'end', b0: END, len: 8 }];
SCENES.forEach((s, i) => { s.next = SCENES[i + 1]; s.dir = i % 2 ? 'left' : 'up'; });

// ------------------------------------------------------------------ sound (beats)
const HITS = [];
const hit = (b, l, s, o) => HITS.push(o ? [b, l, s, o] : [b, l, s]);
hit(0, 'hook slam', 'thud', { pitch: 'A1' }); hit(0, 'hook whoosh', 'whoosh', { len: 0.35 });
hit(1, 'chips', 'tick'); hit(1.8, 'chips', 'tick'); hit(2.6, 'chips gather', 'whoosh', { len: 0.4 });
hit(HOOK, 'riser into wipe', 'riser', { len: 1.1 }); hit(HOOK, 'ring wipe', 'impact');
SCENES.forEach((s) => {
  const b = s.b0;
  if (s.kind === 'step') { if (s.n > 1) { hit(b, 'push', 'whoosh', { len: 0.45 }); hit(b, 'sub', 'sub'); } hit(b + 0.9, 'title', 'whoosh', { len: 0.25 }); hit(b + 2.0, 'arabic', 'tick'); }
});
const sb = (n) => HOOK + (n - 1) * SPAN;
hit(sb(1) + 2.6, 'picker', 'thud', { pitch: 'E2' }); hit(sb(1) + 3.8, 'handle glides', 'boing', { pitch: 'C4', to: 'G4' }); hit(sb(1) + 5, 'hex', 'blip', { pitch: 'A6' }); hit(sb(1) + 9, 'button', 'pop', { pitch: 'C6' }); hit(sb(1) + 9.8, 'ratio pass', 'bell', { pitch: 'E6' });
P.SHADES.forEach((_, i) => hit(sb(2) + 2.6 + i * 0.3, `shade ${i}`, 'pop', { pitch: ['C5', 'D5', 'E5', 'F#5', 'G#5', 'A#5', 'C6', 'D6', 'E6'][i] })); hit(sb(2) + 6.2, 'base lifts', 'tok', { pitch: 'G5' });
hit(sb(3) + 2.6, 'brand row', 'thud', { pitch: 'E2' }); hit(sb(3) + 3.6, 'gray row', 'thud', { pitch: 'C2' }); hit(sb(3) + 5.2, 'tint slider', 'riser', { len: 1.0 }); hit(sb(3) + 9.5, 'cards', 'pop', { pitch: 'C6' });
[0, 1, 2].forEach((i) => { hit(sb(4) + 2.8 + i * 0.9, `toast ${i}`, 'whoosh', { len: 0.3 }); hit(sb(4) + 3.1 + i * 0.9, `toast icon ${i}`, 'blip', { pitch: ['E6', 'C6', 'A5'][i] }); hit(sb(4) + 8.5 + i * 0.4, `swatch ${i}`, 'pop', { pitch: ['C6', 'E6', 'G6'][i] }); });
hit(sb(5) + 2.6, 'card', 'thud', { pitch: 'E2' }); for (let i = 0; i < 6; i++) hit(sb(5) + 4 + i * 0.25, `count ${i}`, 'tick'); hit(sb(5) + 5.6, 'AA', 'bell', { pitch: 'E6' }); hit(sb(5) + 7, 'switch', 'pop', { pitch: 'C5' }); hit(sb(5) + 8, 'switch on', 'click'); hit(sb(5) + 8.3, 'dark', 'whoosh', { len: 0.5 });
hit(RECAP, 'recap push', 'whoosh', { len: 0.45 }); [0, 1, 2, 3].forEach((i) => hit(RECAP + 1.2 + i * 0.5, `row ${i}`, 'whoosh', { len: 0.25 }));
hit(END, 'end wipe', 'impact'); hit(END + 2, 'follow', 'tick');

// ------------------------------------------------------------------ scenes
function topline(ctx, label) {
  txt(ctx, 'LEARN UI/UX', X0, 120, 26, { w: 600, color: C.sub, family: F.mono });
  txt(ctx, 'AG STUDIO', W - X0, 120, 26, { w: 600, color: C.sub, align: 'right', family: F.mono });
  if (label) txt(ctx, label, X0, 202, 26, { w: 600, color: C.sub, family: F.mono });
}
function titleBlock(ctx, v, lines, en, ar) {
  const size = Math.min(...lines.map((l) => fit(ctx, l, 128, CW)));
  lines.forEach((l, i) => maskUp(ctx, l, X0 - 4, 1400 - (lines.length - 1 - i) * size * 1.0, size, ez(v, 0.9 + i * 0.25, 2.0 + i * 0.25), { color: '#FFFFFF' }));
  maskUp(ctx, en, X0, 1466, fit(ctx, en, 30, CW, 600, F.mono), ez(v, 1.5, 2.5), { w: 600, color: C.sub, family: F.mono });
  maskUp(ctx, ar, W - X0, 1546, fit(ctx, ar, 48, CW, 700, F.ar), ez(v, 1.9, 2.9), { family: F.ar, align: 'right', rtl: true });
}
function hook(ctx, v, t) {
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  topline(ctx);
  P.chips(ctx, v, t, [80, 280, 920, 440], [2.2, 3.0], [540, 500]);
  [['STOP PICKING', 940], ['COLORS AT', 1110], ['RANDOM.', 1280]].forEach(([s, y], i) => {
    const drift = (i % 2 ? -1 : 1) * v * 7, size = fit(ctx, 'STOP PICKING', 190, CW / 1.04);
    txt(ctx, s, X0 + drift, y, size, { color: '#FFFFFF', sx: 1 + 0.03 * Math.sin(t * 3.2 + i) });
  });
  txt(ctx, 'توقّف عن اختيار الألوان عشوائيًا.', W - X0, 1410, fit(ctx, 'توقّف عن اختيار الألوان عشوائيًا.', 60, CW, 700, F.ar), { family: F.ar, align: 'right', rtl: true });
  txt(ctx, '5 STEPS TO A PALETTE THAT WORKS.', X0, 1490, fit(ctx, '5 STEPS TO A PALETTE THAT WORKS.', 36, CW, 600, F.mono), { w: 600, family: F.mono, color: C.sub });
  const q = ez(v, 2.8, 4, E.inExpo);
  if (q > 0) { const r = 30 + q * 2300; ctx.fillStyle = P.BASE; ctx.beginPath(); ctx.arc(540, 500, r, 0, TAU); ctx.fill(); ctx.fillStyle = STEPS[0].bg; ctx.beginPath(); ctx.arc(540, 500, Math.max(0, r - 90), 0, TAU); ctx.fill(); }
}
function step(ctx, v, s, n) {
  ctx.fillStyle = s.bg; ctx.fillRect(0, 0, W, H);
  topline(ctx, `STEP 0${n} / 05`);
  s.vig(ctx, v);
  titleBlock(ctx, v, s.title, s.en, s.ar);
}
function recap(ctx, v) {
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  topline(ctx, 'RECAP');
  P.vRecap(ctx, v, false);
  titleBlock(ctx, v, ['SAVE THIS', 'METHOD.'], '1 COLOR · 9 SHADES · GRAYS · STATUS · TEST', 'احفظ هذه الطريقة.');
  const q = ez(v, 9.2, 10, E.inExpo);
  if (q > 0) { ctx.fillStyle = C.endBlue; ctx.beginPath(); ctx.arc(W / 2, H / 2, q * 1200, 0, TAU); ctx.fill(); }
}
function endPage(ctx, v) {
  ctx.fillStyle = C.endBlue; ctx.fillRect(0, 0, W, H);
  maskUp(ctx, 'Keep it simple.', X0, 760, fit(ctx, 'Keep it simple.', 150, CW), ez(v, 0, 0.8), { color: '#FFFFFF' });
  maskUp(ctx, 'اجعلها بسيطة.', W - X0, 900, 90, ez(v, 0.4, 1.2), { family: F.ar, align: 'right', rtl: true, color: '#FFFFFF' });
  const l = ez(v, 1.6, 2.4, E.inOutCubic); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(X0, 1000, CW * l, 3);
  maskUp(ctx, 'Follow for more', X0, 1130, 76, ez(v, 2, 2.8), { color: '#FFFFFF' });
  maskUp(ctx, 'UI/UX tutorials', X0, 1220, 76, ez(v, 2.2, 3.0), { color: '#FFFFFF' });
  maskUp(ctx, 'تابعني لمزيد من دروس UI/UX', W - X0, 1330, 54, ez(v, 2.6, 3.4), { family: F.ar, align: 'right', rtl: true, color: '#FFFFFF' });
}

// ------------------------------------------------------------------ covers (?cover=tiktok|shorts)
const COVER = new URLSearchParams(location.search).get('cover');
function cover(ctx, kind) {
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  const top = kind === 'tiktok' ? 330 : 260;
  txt(ctx, 'LEARN UI/UX', X0, top, 28, { w: 600, family: F.mono, color: C.sub }); txt(ctx, 'AG STUDIO', W - X0, top, 28, { w: 600, family: F.mono, color: C.sub, align: 'right' });
  const size = fit(ctx, 'HOW TO CHOOSE', 170, CW);
  ['HOW TO CHOOSE', 'YOUR COLOR', 'PALETTE.'].forEach((s, i) => txt(ctx, s, X0, top + 210 + i * size * 1.02, size, { color: '#FFFFFF' }));
  txt(ctx, 'كيف تختار لوحة ألوانك', W - X0, top + 760, 76, { family: F.ar, align: 'right', rtl: true });
  const w = CW / 9; P.SHADES.forEach((c, i) => { const h = 200 + i * 22; K.rr(ctx, X0 + i * w + 4, top + 1060 - h, w - 8, h, 10, c); });
}

// ------------------------------------------------------------------ film
const FAST = SCENES.map((s) => s.b0);
let GRAIN = null;
function drawScene(ctx, s, v, t) { if (s.kind === 'hook') hook(ctx, v, t); else if (s.kind === 'step') step(ctx, v, s.step, s.n); else if (s.kind === 'recap') recap(ctx, v); else endPage(ctx, v); }
M.film({
  fonts: [`700 100px ${F.title}`, `600 40px ${F.mono}`, `700 60px ${F.ar}`],
  images: {}, hits: HITS, shutter: 0.6,
  samples: (t) => { const u = t / K.B; return FAST.some((b) => u > b - 1.2 && u < b + 3.2) ? 8 : 3; },
  async init() { await document.fonts.load(`700 60px ${F.ar}`, 'توقّف عن اختيار').catch(() => {}); GRAIN = K.makeGrain(540, 960); },
  draw(ctx, u, t) {
    ctx.save();
    if (COVER) { cover(ctx, COVER); ctx.restore(); return; }
    let s = SCENES[0]; SCENES.forEach((x) => { if (u >= x.b0) s = x; });
    const v = u - s.b0, push = s.next && (s.kind === 'step');
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
