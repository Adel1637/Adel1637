// How to choose your color palette, step by step — YouTube long video 16:9, "printed poster" style
// (risograph): flat ink fields, huge condensed type, paper grain, misregistered second ink, hard cuts on
// the beat, elements stamped in. Same look as poster-palette (the Short), with 7 chapters.
// Hook (shared/accroche.md): "Stop picking colors at random." on frame 0 with the random chips.
import * as M from './lib/motion.js';

const { W, H, clamp, hash01, TAU, mix } = M;
const INK = { paper: '#F1ECE2', black: '#1C1A19', pink: '#FF4F9A', yellow: '#FFD84A', blue: '#2F5BFF', cream: '#F6F1E7' };
const BASE = '#3157D5';                                   // the fictional brand color
const X0 = 110, XC = 960, X1 = 1810;                      // text column X0..XC, visual zone VX0..X1
const VX0 = 1060, VW = X1 - VX0;
const SPAN = 28, C0 = 8, RECAP = C0 + 7 * SPAN, END = RECAP + 14;
const at = (i) => C0 + i * SPAN;

// ------------------------------------------------------------------ colour helpers
const toRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h) => { const c = toRgb(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const SHADES = [0.92, 0.8, 0.62, 0.42, 0.2, 0, -0.18, -0.36, -0.54].map((k) => (k >= 0 ? mix(BASE, '#FFFFFF', k) : mix(BASE, '#000000', -k)));
const SHADE_NAMES = ['50', '100', '200', '300', '400', '500', '600', '700', '800'];
const PURE = ['#F7F7F7', '#EAEAEA', '#D4D4D4', '#B3B3B3', '#8A8A8A', '#626262', '#444444', '#2C2C2C', '#181818'];
const GRAYS = ['#F7F7F8', '#E9EAEC', '#D3D5D9', '#B0B3B9', '#868A92', '#5E626A', '#41444B', '#2A2C31', '#17181B'].map((g) => mix(g, BASE, 0.08));
const STATUS = [['#1F9D55', 'SUCCESS', 'نجاح', 'Changes saved.', '✓'], ['#E8A317', 'WARNING', 'تنبيه', 'Check your card details.', '!'], ['#E5484D', 'ERROR', 'خطأ', 'Payment failed. Try again.', '✕']];
const MOODS = [[BASE, 'TRUST', 'ثقة'], ['#F2652A', 'ENERGY', 'طاقة'], ['#2E9E6E', 'CALM', 'هدوء']];
const WHITE_ON_BASE = ratio('#FFFFFF', BASE).toFixed(1);
const LIGHT_FAIL = ratio('#FFFFFF', GRAYS[3]).toFixed(1);

// ------------------------------------------------------------------ screens
const SCREENS = [
  { at: 0, field: INK.paper, ink: INK.black, title: ['STOP PICKING', 'COLORS AT', 'RANDOM.'], ar: 'توقّف عن اختيار الألوان عشوائيًا.', en2: 'A COMPLETE METHOD, STEP BY STEP.', ar2: 'طريقة كاملة، خطوة بخطوة.', kind: 'hook' },
  { at: at(0), field: INK.yellow, ink: INK.black, n: 1, title: ['PICK YOUR', 'FIRST COLOR.'], ar: 'اختر لونك الأول.', en2: 'CHOOSE IT FOR A FEELING, NOT BY CHANCE.', ar2: 'اختره حسب الإحساس الذي تريده، لا صدفةً.', more: [12, 'WHITE TEXT MUST BE READABLE ON IT.', 'يجب أن يُقرأ النص الأبيض فوقه بوضوح.'], kind: 'one' },
  { at: at(1), field: INK.paper, ink: INK.black, n: 2, title: ['BUILD', '9 SHADES.'], ar: 'ابنِ 9 درجات منه.', en2: 'FROM 50 (LIGHTEST) TO 800 (DARKEST).', ar2: 'من 50 (الأفتح) إلى 800 (الأغمق).', more: [8, 'GIVE EACH SHADE ONE JOB.', 'لكل درجة دور واحد محدد.'], kind: 'shades' },
  { at: at(2), field: INK.black, ink: INK.cream, n: 3, title: ['ADD TINTED', 'GRAYS.'], ar: 'أضف رماديًا مائلًا إلى لونك.', en2: 'A HINT OF YOUR COLOR KEEPS THEM CALM.', ar2: 'لمسة من لونك تجعل الرمادي منسجمًا.', more: [12, 'PURE GRAY LOOKS COLD NEXT TO IT.', 'الرمادي الخالص يبدو باردًا بجانبه.'], kind: 'grays' },
  { at: at(3), field: INK.paper, ink: INK.black, n: 4, title: ['ADD STATUS', 'COLORS.'], ar: 'أضف ألوان الحالات.', en2: 'GREEN, AMBER, RED. NOTHING ELSE.', ar2: 'أخضر وكهرماني وأحمر، ولا شيء غيرها.', more: [9, 'ALWAYS WITH A WORD OR AN ICON.', 'دائمًا مع كلمة أو أيقونة.'], kind: 'status' },
  { at: at(4), field: INK.yellow, ink: INK.black, n: 5, title: ['USE', '60–30–10.'], ar: 'طبّق قاعدة \u202A60–30–10\u202C', en2: '60% NEUTRAL · 30% SECONDARY · 10% BRAND.', ar2: 'محايد 60% · ثانوي 30% · لون العلامة 10%', more: [10, 'YOUR BRAND COLOR IS THE ACCENT.', 'لون علامتك هو اللمسة البارزة.'], kind: 'rule' },
  { at: at(5), field: INK.paper, ink: INK.black, n: 6, title: ['TEST IT.'], ar: 'اختبرها.', en2: 'TEXT CONTRAST OF AT LEAST 4.5:1.', ar2: 'تباين النصوص لا يقل عن 4.5:1.', more: [13, 'THEN CHECK DARK MODE.', 'ثم تحقّق من الوضع الداكن.'], kind: 'test' },
  { at: at(6), field: INK.black, ink: INK.cream, n: 7, title: ['4 MISTAKES', 'TO AVOID.'], ar: 'أربعة أخطاء يجب تجنّبها.', en2: 'SPOT THEM BEFORE YOUR USERS DO.', ar2: 'اكتشفها قبل أن يلاحظها مستخدموك.', kind: 'mistakes' },
  { at: RECAP, field: INK.black, ink: INK.cream, title: ['SAVE THIS', 'METHOD.'], ar: 'احفظ هذه الطريقة.', en2: 'COLOR · SHADES · GRAYS · STATUS · 60–30–10 · TEST', ar2: 'لون · درجات · رمادي · حالات · \u202A60–30–10\u202C · اختبار', kind: 'recap' },
  { at: END, field: INK.blue, ink: INK.cream, title: ['KEEP IT', 'SIMPLE.'], ar: 'اجعلها بسيطة.', kind: 'end' },
];
const MISTAKES = [
  ['TOO MANY BRAND COLORS', 'ألوان علامة كثيرة جدًا', 'many'],
  ['PURE, UNTINTED GRAYS', 'رمادي خالص بلا لمسة من لونك', 'pure'],
  ['COLOR ALONE FOR MEANING', 'الاعتماد على اللون وحده لنقل المعنى', 'alone'],
  ['BRAND COLOR EVERYWHERE', 'لون العلامة في كل مكان', 'everywhere'],
];

// ------------------------------------------------------------------ hits
const HITS = [];
const hit = (b, l, s, o) => HITS.push(o ? [b, l, s, o] : [b, l, s]);
hit(0, 'hook stamp', 'thud'); hit(0.5, 'chips jitter', 'tick'); hit(1.6, 'chips', 'tick'); hit(3.2, 'red cross stamp', 'thud');
SCREENS.slice(1).forEach((s) => {
  hit(s.at, `cut ${s.kind}`, 'click'); hit(s.at + 0.05, `${s.kind} title stamp`, 'thud'); hit(s.at + 0.6, `${s.kind} arabic`, 'tick');
  if (s.more) hit(s.at + s.more[0], `${s.kind} note`, 'tick');
});
MOODS.forEach((_, i) => hit(at(0) + 1.6 + i * 0.8, `mood ${i}`, 'thud')); hit(at(0) + 7, 'pick blue', 'pop', { pitch: 'E6' }); hit(at(0) + 13, 'white text badge', 'bell', { pitch: 'E6' });
SHADES.forEach((_, i) => hit(at(1) + 1.6 + i * 0.35, `shade ${i}`, 'pop', { pitch: ['C5', 'D5', 'E5', 'F#5', 'G#5', 'A#5', 'C6', 'D6', 'E6'][i] }));
[9, 11, 13, 15, 17].forEach((b, i) => hit(at(1) + b, `role ${i}`, 'tok'));
hit(at(2) + 1.6, 'brand row', 'thud'); hit(at(2) + 3.2, 'pure row', 'thud'); GRAYS.forEach((_, i) => hit(at(2) + 5 + i * 0.3, `gray ${i}`, 'blip', { pitch: 'E6' })); hit(at(2) + 14, 'cards compare', 'thud');
STATUS.forEach((_, i) => { hit(at(3) + 1.8 + i * 0.9, `status ${i}`, 'thud'); hit(at(3) + 10 + i * 2, `alert ${i}`, 'pop', { pitch: ['A5', 'E5', 'C5'][i] }); });
[0, 1, 2].forEach((i) => hit(at(4) + 1.6 + i * 0.6, `bar ${i}`, 'thud')); hit(at(4) + 12, 'page mock', 'thud');
hit(at(5) + 1.6, 'ui card', 'thud'); hit(at(5) + 4, 'contrast badge', 'bell', { pitch: 'E6' }); hit(at(5) + 7, 'fail line', 'thud');
hit(at(5) + 14, 'dark mode cut', 'click'); hit(at(5) + 15.5, 'dark badge', 'bell', { pitch: 'A6' });
MISTAKES.forEach((_, i) => { hit(at(6) + 2 + i * 5, `mistake ${i}`, 'thud'); hit(at(6) + 3 + i * 5, `cross ${i}`, 'tick'); });
[0, 1, 2, 3, 4].forEach((i) => hit(RECAP + 1.4 + i * 0.6, `recap row ${i}`, 'pop', { pitch: ['A5', 'C#6', 'E6', 'F#6', 'A6'][i] }));
hit(END + 0.05, 'end stamp', 'thud'); hit(END + 2, 'follow line', 'tick');

// ------------------------------------------------------------------ drawing helpers
let GRAIN = null;
const boil = (t, k, amp = 1.4) => (hash01(Math.floor(t * 12), k) - 0.5) * 2 * amp;     // stop-motion jitter, 12 fps
function stamp(u, t0, seed = 1) {
  if (u < t0) return null;
  const p = clamp((u - t0) / 0.35);
  return { s: 1 + 0.16 * (1 - p) ** 2, rot: (hash01(seed, 7) - 0.5) * 0.05 * (1 - p * 0.6) };
}
function withStamp(ctx, st, cx, cy, fn) { if (!st) return; ctx.save(); ctx.translate(cx, cy); ctx.rotate(st.rot); ctx.scale(st.s, st.s); ctx.translate(-cx, -cy); fn(); ctx.restore(); }
function inkText(ctx, str, x, y, font, color, align, t, seed, off = INK.pink) {
  ctx.font = font; ctx.textAlign = align;
  const jx = boil(t, seed), jy = boil(t, seed + 3);
  ctx.globalAlpha = 0.9; ctx.fillStyle = off; ctx.fillText(str, x + 6 + jx, y + 4 + jy);   // misregistered second ink
  ctx.globalAlpha = 1; ctx.fillStyle = color; ctx.fillText(str, x + jx * 0.4, y + jy * 0.4);
}
function plain(ctx, str, x, y, font, color, align = 'left', rtl = false) {
  ctx.save(); ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.direction = rtl ? 'rtl' : 'ltr'; ctx.fillText(str, x, y); ctx.restore();
}
function fitFont(ctx, str, max, maxW, family, weight = 400) { ctx.font = `${weight} ${max}px ${family}`; const w = ctx.measureText(str).width; return Math.min(max, Math.floor(max * maxW / w)); }
function swatch(ctx, x, y, w, h, color, border) { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); if (border) { ctx.strokeStyle = border; ctx.lineWidth = 3; ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3); } }
function halftone(ctx, x, y, w, h, color, max = 7) { ctx.fillStyle = color; for (let yy = 0; yy < h; yy += 18) for (let xx = 0; xx < w; xx += 18) { const r = max * (yy / h); if (r > 0.6) { ctx.beginPath(); ctx.arc(x + xx + 9, y + yy + 9, r, 0, TAU); ctx.fill(); } } }
function redCross(ctx, cx, cy, r, lw = 14) { ctx.save(); ctx.strokeStyle = '#D9262C'; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(cx - r, cy - r); ctx.lineTo(cx + r, cy + r); ctx.moveTo(cx + r, cy - r); ctx.lineTo(cx - r, cy + r); ctx.stroke(); ctx.restore(); }
function badge(ctx, cx, cy, l1, l2, color = '#1F9D55', w = 300) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.07);
  ctx.strokeStyle = color; ctx.lineWidth = 6; ctx.strokeRect(-w / 2, -54, w, 108);
  plain(ctx, l1, 0, -6, '700 30px SpaceMono', color, 'center'); plain(ctx, l2, 0, 34, '700 24px SpaceMono', color, 'center');
  ctx.restore();
}

function header(ctx, s) {
  plain(ctx, 'LEARN UI/UX', X0, 84, '700 26px SpaceMono', s.ink);
  plain(ctx, 'AG STUDIO', X1, 84, '700 26px SpaceMono', s.ink, 'right');
  ctx.fillStyle = s.ink; ctx.fillRect(X0, 102, X1 - X0, 4);
  if (s.n) plain(ctx, `CHAPTER 0${s.n} / 07`, X0, 166, '700 24px SpaceMono', s.ink);
}
function titleBlock(ctx, u, t, s) {
  const size = s.title.length > 2 ? 132 : s.title.length === 1 ? 190 : 150, lh = size * 0.95;
  const y0 = s.kind === 'end' ? 420 : s.title.length > 2 ? 310 : s.title.length === 1 ? 400 : 340;
  const t0 = s.kind === 'hook' ? -2 : s.at, CW = XC - X0;
  s.title.forEach((line, i) => {
    const st = stamp(u, t0 + i * 0.18, s.at * 10 + i);
    const fs = fitFont(ctx, line, size, CW, 'Anton');
    withStamp(ctx, st, X0 + 250, y0 + i * lh - size / 3, () => inkText(ctx, line, X0, y0 + i * lh, `400 ${fs}px Anton`, s.ink, 'left', t, i + 1));
  });
  const yEnd = y0 + (s.title.length - 1) * lh;
  if (u >= t0 + 0.6) plain(ctx, s.ar, XC, yEnd + 108, `800 ${fitFont(ctx, s.ar, 60, CW, 'Kufi', 800)}px Kufi`, s.ink, 'right', true);
  if (s.en2 && u >= t0 + 1.0) plain(ctx, s.en2, X0, yEnd + 184, `700 ${fitFont(ctx, s.en2, 26, CW, 'SpaceMono', 700)}px SpaceMono`, s.ink);
  if (s.ar2 && u >= t0 + 1.3) plain(ctx, s.ar2, XC, yEnd + 236, `700 ${fitFont(ctx, s.ar2, 28, CW, 'Kufi', 700)}px Kufi`, s.ink, 'right', true);
  if (s.more && u >= s.at + s.more[0]) {
    const st = stamp(u, s.at + s.more[0], s.at + 5), y = yEnd + 300;
    withStamp(ctx, st, X0 + 200, y + 20, () => {
      ctx.fillStyle = s.ink; ctx.fillRect(X0, y - 30, 60, 6);
      plain(ctx, s.more[1], X0, y + 22, `700 ${fitFont(ctx, s.more[1], 26, CW, 'SpaceMono', 700)}px SpaceMono`, s.ink);
      plain(ctx, s.more[2], XC, y + 74, `700 ${fitFont(ctx, s.more[2], 28, CW, 'Kufi', 700)}px Kufi`, s.ink, 'right', true);
    });
  }
}

// a small fictive card (used by the grays comparison and the 60-30-10 page)
function miniCard(ctx, x, y, w, h, g, label, fg) {
  swatch(ctx, x, y, w, h, g[0], INK.black);
  swatch(ctx, x + 24, y + 26, w * 0.5, 16, g[8]);
  swatch(ctx, x + 24, y + 58, w * 0.75, 10, g[4]); swatch(ctx, x + 24, y + 78, w * 0.6, 10, g[4]);
  swatch(ctx, x + 24, y + 102, w - 48, 3, g[2]);
  swatch(ctx, x + 24, y + h - 56, 130, 36, BASE);
  plain(ctx, label, x, y - 16, '700 22px SpaceMono', fg);
}

// ------------------------------------------------------------------ visuals per screen
function visual(ctx, u, t, s) {
  const v = u - s.at;
  if (s.kind === 'hook') {
    const chips = ['#E5484D', '#22C55E', '#F97316', '#06B6D4', '#A855F7', '#FACC15', '#EC4899'];
    chips.forEach((c, i) => {
      const x = VX0 + 20 + (i % 4) * 180 + (i > 3 ? 90 : 0), y = 300 + (i > 3 ? 300 : 0) + (hash01(i, 2) - 0.5) * 70;
      const rot = (hash01(i, 3) - 0.5) * 0.5 + 0.04 * Math.sin(u * 3 + i);
      ctx.save(); ctx.translate(x + 70, y + 100); ctx.rotate(rot); swatch(ctx, -70, -100, 140, 200, c, INK.black); ctx.restore();
    });
    const st = stamp(u, 3.2, 99);
    withStamp(ctx, st, 1435, 560, () => {
      ctx.strokeStyle = '#D9262C'; ctx.lineWidth = 32;
      ctx.beginPath(); ctx.moveTo(1090, 230); ctx.lineTo(1780, 890); ctx.moveTo(1780, 230); ctx.lineTo(1090, 890); ctx.stroke();
    });
  } else if (s.kind === 'one') {
    const picked = v >= 7;
    MOODS.forEach(([c, en, ar], i) => {
      const st = stamp(u, s.at + 1.6 + i * 0.8, 11 + i); if (!st) return;
      const cx = VX0 + 125 + i * 250, cy = 420;
      withStamp(ctx, st, cx, cy, () => {
        if (i === 0 && picked) halftone(ctx, cx - 125, cy - 130, 250, 270, INK.black, 6);
        ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx, cy, 105, 0, TAU); ctx.fill();
        if (picked && i > 0) { ctx.fillStyle = 'rgba(255,216,74,0.72)'; ctx.beginPath(); ctx.arc(cx, cy, 108, 0, TAU); ctx.fill(); }
        if (i === 0 && picked) { ctx.strokeStyle = INK.black; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, 122, 0, TAU); ctx.stroke(); }
      });
      plain(ctx, en, cx, 590, '700 28px SpaceMono', INK.black, 'center');
      plain(ctx, ar, cx, 640, '800 34px Kufi', INK.black, 'center', true);
    });
    if (picked) plain(ctx, `${BASE}  ·  YOUR BRAND COLOR`, VX0 + 125 - 105, 720, '700 26px SpaceMono', INK.black);
    const bst = stamp(u, s.at + 13, 15);
    withStamp(ctx, bst, 1435, 840, () => {
      swatch(ctx, VX0 + 20, 790, 360, 100, BASE);
      plain(ctx, 'GET STARTED', VX0 + 200, 852, '700 30px SpaceMono', '#FFFFFF', 'center');
      badge(ctx, 1620, 840, `${WHITE_ON_BASE}:1`, 'PASSES AA ✓', '#14713D', 280);
    });
  } else if (s.kind === 'shades') {
    const w = VW / 9, y = 220, h = 380;
    SHADES.forEach((c, i) => {
      const st = stamp(u, s.at + 1.6 + i * 0.35, 20 + i); if (!st) return;
      withStamp(ctx, st, VX0 + i * w + w / 2, y + h / 2, () => swatch(ctx, VX0 + i * w, y, w + 1, h, c));
      plain(ctx, SHADE_NAMES[i], VX0 + i * w + w / 2, y + h + 36, '700 22px SpaceMono', INK.black, 'center');
    });
    const ROLES = [[0, 1, 'BACKGROUNDS', 'الخلفيات'], [2, 4, 'BORDERS', 'الحدود'], [5, 5, 'BUTTONS', 'الأزرار'], [6, 7, 'HOVER', 'عند التمرير'], [8, 8, 'TEXT', 'النصوص']];
    ROLES.forEach(([a, b, en, ar], i) => {
      const st = stamp(u, s.at + 9 + i * 2, 30 + i); if (!st) return;
      const xa = VX0 + a * w + 6, xb = VX0 + (b + 1) * w - 6, row = i % 2, yb = 690 + row * 130;
      withStamp(ctx, st, (xa + xb) / 2, yb + 40, () => {
        ctx.fillStyle = INK.black; ctx.fillRect(xa, yb - 36, xb - xa, 6); ctx.fillRect(xa, yb - 46, 6, 16); ctx.fillRect(xb - 6, yb - 46, 6, 16);
        if (row) ctx.fillRect((xa + xb) / 2 - 2, yb - 160, 4, 124);
        const cx = (xa + xb) / 2;
        plain(ctx, en, cx, yb + 2, '700 22px SpaceMono', INK.black, 'center');
        plain(ctx, ar, cx, yb + 44, '800 26px Kufi', INK.black, 'center', true);
      });
    });
  } else if (s.kind === 'grays') {
    const w = VW / 9, rows = [['YOUR BRAND', SHADES, 1.6, 220], ['PURE GRAYS', PURE, 3.2, 400], ['TINTED GRAYS', GRAYS, 5, 580]];
    rows.forEach(([lab, cols, b, y], r) => {
      if (u < s.at + b) return;
      plain(ctx, lab, VX0, y - 14, '700 22px SpaceMono', INK.cream);
      cols.forEach((c, i) => {
        if (r < 2) { swatch(ctx, VX0 + i * w, y, w + 1, 110, c); return; }
        const st = stamp(u, s.at + b + i * 0.3, 40 + i); withStamp(ctx, st, VX0 + i * w + w / 2, y + 55, () => swatch(ctx, VX0 + i * w, y, w + 1, 110, c));
      });
    });
    const st = stamp(u, s.at + 14, 48);
    withStamp(ctx, st, 1435, 850, () => {
      miniCard(ctx, VX0, 790, 360, 210, PURE, 'PURE: COLD', INK.cream);
      miniCard(ctx, VX0 + 390, 790, 360, 210, GRAYS, 'TINTED: CALM ✓', '#7EE2A8');
    });
  } else if (s.kind === 'status') {
    const w = 230, gap = (VW - 3 * w) / 2;
    STATUS.forEach(([c, en, ar], i) => {
      const st = stamp(u, s.at + 1.8 + i * 0.9, 60 + i); if (!st) return;
      const x = VX0 + i * (w + gap);
      withStamp(ctx, st, x + w / 2, 300, () => { swatch(ctx, x, 210, w, 180, c); halftone(ctx, x, 300, w, 90, 'rgba(0,0,0,0.18)', 6); });
      plain(ctx, en, x, 430, '700 24px SpaceMono', INK.black);
      plain(ctx, ar, x + w, 432, '800 30px Kufi', INK.black, 'right', true);
    });
    STATUS.forEach(([c, , , msg, icon], i) => {
      const st = stamp(u, s.at + 10 + i * 2, 64 + i); if (!st) return;
      const y = 500 + i * 140;
      withStamp(ctx, st, 1435, y + 50, () => {
        swatch(ctx, VX0, y, VW, 104, mix(c, '#FFFFFF', 0.86), INK.black);
        ctx.fillStyle = c; ctx.fillRect(VX0 + 3, y + 3, 16, 98);
        ctx.beginPath(); ctx.arc(VX0 + 76, y + 52, 26, 0, TAU); ctx.fill();
        plain(ctx, icon, VX0 + 76, y + 63, '700 30px SpaceMono', '#FFFFFF', 'center');
        plain(ctx, msg, VX0 + 130, y + 62, '700 28px SpaceMono', INK.black);
      });
    });
  } else if (s.kind === 'rule') {
    const parts = [[0.6, GRAYS[0], '60%', 'NEUTRAL'], [0.3, SHADES[8], '30%', 'SECONDARY'], [0.1, BASE, '10%', 'BRAND']];
    let x = VX0;
    parts.forEach(([f, c, pct, en], i) => {
      const pw = VW * f, st = stamp(u, s.at + 1.6 + i * 0.6, 80 + i);
      const xx = x; x += pw; if (!st) return;
      withStamp(ctx, st, xx + pw / 2, 290, () => swatch(ctx, xx, 220, pw, 150, c, INK.black));
      plain(ctx, pct, xx + 10, 420, '400 48px Anton', INK.black);
      if (i < 2) plain(ctx, en, xx + 10, 456, '700 20px SpaceMono', INK.black);
      else plain(ctx, en, xx + pw, 456, '700 20px SpaceMono', INK.black, 'right');
    });
    const st = stamp(u, s.at + 12, 85);
    withStamp(ctx, st, 1435, 730, () => {
      const px = VX0, py = 510, pw = VW, ph = 430;
      swatch(ctx, px, py, pw, ph, GRAYS[0], INK.black);
      swatch(ctx, px + 3, py + 3, pw - 6, 64, SHADES[8]);                      // top bar (secondary)
      swatch(ctx, px + 30, py + 26, 110, 16, '#FFFFFF');
      swatch(ctx, px + 3, py + 67, 170, ph - 70, SHADES[8]);                    // sidebar (secondary)
      [0, 1, 2, 3].forEach((k) => swatch(ctx, px + 30, py + 110 + k * 50, 110, 12, SHADES[3]));
      [[205, 100], [460, 100]].forEach(([cx, cy]) => {
        swatch(ctx, px + cx, py + cy, 230, 170, '#FFFFFF', GRAYS[2]);
        swatch(ctx, px + cx + 20, py + cy + 24, 140, 14, GRAYS[7]);
        swatch(ctx, px + cx + 20, py + cy + 56, 180, 10, GRAYS[4]); swatch(ctx, px + cx + 20, py + cy + 76, 150, 10, GRAYS[4]);
      });
      swatch(ctx, px + 205, py + 310, 200, 58, BASE);                           // the one accent (brand)
      plain(ctx, 'NEW PROJECT', px + 305, py + 347, '700 20px SpaceMono', '#FFFFFF', 'center');
      swatch(ctx, px + 460, py + 330, 120, 6, BASE);
    });
  } else if (s.kind === 'test') {
    const dark = v >= 14, st = stamp(u, s.at + 1.6, 70);
    withStamp(ctx, st, 1435, 450, () => {
      const bg = dark ? '#16181D' : '#FFFFFF', fg = dark ? '#EDEEF0' : '#1C1A19', sub = dark ? '#A3A7AF' : '#5E626A', btn = dark ? SHADES[3] : BASE, btnTxt = dark ? '#0E1424' : '#FFFFFF';
      swatch(ctx, VX0, 220, VW, 440, bg, INK.black);
      plain(ctx, 'MONTHLY PLAN', VX0 + 50, 310, '700 38px SpaceMono', fg);
      plain(ctx, 'Unlimited projects for your team.', VX0 + 50, 362, '400 26px SpaceMono', sub);
      swatch(ctx, VX0 + 50, 410, VW - 100, 3, dark ? '#2A2C31' : '#E3E4E7');
      swatch(ctx, VX0 + 50, 480, 300, 96, btn);
      plain(ctx, 'START', VX0 + 200, 542, '700 34px SpaceMono', btnTxt, 'center');
      const r2 = ratio(btn, btnTxt).toFixed(1);
      const bst = stamp(u, s.at + (dark ? 15.5 : 4), dark ? 72 : 71);
      withStamp(ctx, bst, VX0 + 560, 528, () => badge(ctx, VX0 + 560, 528, dark ? 'DARK MODE' : `${WHITE_ON_BASE}:1`, dark ? `${r2}:1 ✓` : 'PASSES AA ✓', '#1F9D55'));
    });
    if (!dark) {
      const fst = stamp(u, s.at + 7, 74);
      withStamp(ctx, fst, 1435, 820, () => {
        swatch(ctx, VX0, 740, VW, 180, '#FFFFFF', INK.black);
        plain(ctx, 'Light gray text on white.', VX0 + 40, 812, '400 30px SpaceMono', GRAYS[3]);
        plain(ctx, `${LIGHT_FAIL}:1  ·  TOO LOW`, VX0 + 40, 872, '700 28px SpaceMono', '#D9262C');
        redCross(ctx, X1 - 90, 830, 40, 12);
      });
    } else {
      plain(ctx, 'LIGHTER SHADE FOR THE BUTTON, DARK TEXT ON IT.', VX0, 740, `700 ${fitFont(ctx, 'LIGHTER SHADE FOR THE BUTTON, DARK TEXT ON IT.', 24, VW, 'SpaceMono', 700)}px SpaceMono`, INK.black);
      plain(ctx, 'درجة أفتح للزر، ونص داكن فوقه.', X1, 790, '700 28px Kufi', INK.black, 'right', true);
    }
  } else if (s.kind === 'mistakes') {
    MISTAKES.forEach(([en, ar, kind], i) => {
      const st = stamp(u, s.at + 2 + i * 5, 90 + i); if (!st) return;
      const y = 200 + i * 185, bx = VX0, bw = 200, bh = 140;
      withStamp(ctx, st, 1435, y + bh / 2, () => {
        swatch(ctx, bx, y, bw, bh, INK.cream);
        if (kind === 'many') ['#E5484D', '#22C55E', '#F97316', '#06B6D4', '#A855F7', '#FACC15'].forEach((c, k) => swatch(ctx, bx + 14 + (k % 3) * 60, y + 16 + Math.floor(k / 3) * 58, 52, 50, c));
        if (kind === 'pure') { swatch(ctx, bx + 16, y + 18, 168, 104, PURE[1]); swatch(ctx, bx + 30, y + 34, 90, 12, PURE[6]); swatch(ctx, bx + 30, y + 56, 120, 8, PURE[4]); swatch(ctx, bx + 30, y + 86, 70, 22, BASE); }
        if (kind === 'alone') { ['#1F9D55', '#E5484D', '#1F9D55'].forEach((c, k) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(bx + 40, y + 34 + k * 36, 12, 0, TAU); ctx.fill(); swatch(ctx, bx + 66, y + 30 + k * 36, 100, 8, PURE[4]); }); }
        if (kind === 'everywhere') { swatch(ctx, bx + 12, y + 12, bw - 24, 30, BASE); swatch(ctx, bx + 12, y + 50, 80, 78, BASE); swatch(ctx, bx + 100, y + 50, 88, 34, SHADES[3]); swatch(ctx, bx + 100, y + 94, 88, 34, BASE); }
        plain(ctx, `0${i + 1}`, bx + bw + 40, y + 52, '400 44px Anton', INK.yellow);
        plain(ctx, en, bx + bw + 110, y + 50, `700 ${fitFont(ctx, en, 28, X1 - bx - bw - 110, 'SpaceMono', 700)}px SpaceMono`, INK.cream);
        plain(ctx, ar, X1, y + 108, `800 ${fitFont(ctx, ar, 32, X1 - bx - bw - 110, 'Kufi', 800)}px Kufi`, INK.cream, 'right', true);
      });
      const cst = stamp(u, s.at + 3 + i * 5, 95 + i);
      withStamp(ctx, cst, bx + bw / 2, y + bh / 2, () => redCross(ctx, bx + bw / 2, y + bh / 2, 58, 16));
    });
  } else if (s.kind === 'recap') {
    const rows = [['BRAND', [BASE]], ['SHADES', SHADES], ['GRAYS', GRAYS], ['STATUS', STATUS.map((x) => x[0])], ['60–30–10', null]];
    rows.forEach(([lab, cols], r) => {
      if (u < s.at + 1.4 + r * 0.6) return;
      const y = 220 + r * 140; plain(ctx, lab, VX0, y + 56, '700 24px SpaceMono', INK.cream);
      const x0 = VX0 + 190, w = (X1 - x0) / 9;
      if (!cols) { [[0.6, GRAYS[0]], [0.3, SHADES[8]], [0.1, BASE]].reduce((x, [f, c]) => { swatch(ctx, x, y, (X1 - x0) * f, 96, c, INK.cream); return x + (X1 - x0) * f; }, x0); return; }
      const span = cols.length === 1 ? 2 : cols.length === 3 ? 3 : 1;
      cols.forEach((c, i) => swatch(ctx, x0 + i * w * span, y, w * span - (span > 1 ? 8 : -1), 96, c));
    });
  } else if (s.kind === 'end') {
    if (u >= s.at + 2) {
      ctx.fillStyle = INK.cream; ctx.fillRect(VX0, 300, VW, 6);
      plain(ctx, 'FOLLOW FOR MORE', VX0, 430, '400 104px Anton', INK.cream);
      plain(ctx, 'UI/UX TUTORIALS', VX0, 540, '400 104px Anton', INK.yellow);
      plain(ctx, 'تابعني لمزيد من دروس UI/UX', X1, 650, '800 48px Kufi', INK.cream, 'right', true);
    }
  }
}

// ------------------------------------------------------------------ thumbnail (?cover=youtube)
const COVER = new URLSearchParams(location.search).get('cover');
function cover(ctx) {
  ctx.fillStyle = INK.paper; ctx.fillRect(0, 0, W, H);
  plain(ctx, 'LEARN UI/UX', X0, 100, '700 30px SpaceMono', INK.black); plain(ctx, 'AG STUDIO', X1, 100, '700 30px SpaceMono', INK.black, 'right');
  ctx.fillStyle = INK.black; ctx.fillRect(X0, 122, X1 - X0, 5);
  ['HOW TO CHOOSE', 'YOUR COLOR', 'PALETTE.'].forEach((l, i) => { const fs = fitFont(ctx, l, 178, 1060, 'Anton'); inkText(ctx, l, X0, 330 + i * 176, `400 ${fs}px Anton`, INK.black, 'left', 0, i + 1); });
  plain(ctx, 'كيف تختار لوحة ألوانك', X0 + 1060, 900, '800 76px Kufi', INK.black, 'right', true);
  const x0 = 1260, w = (X1 - x0) / 9;
  SHADES.forEach((c, i) => swatch(ctx, x0 + i * w, 190, w + 1, 760, c));
  ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.22; ctx.drawImage(GRAIN, 0, 0, W, H); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}

// ------------------------------------------------------------------ film
M.film({
  fonts: ['400 100px Anton', '700 30px SpaceMono', '400 30px SpaceMono', '800 60px Kufi', '700 40px Kufi'],
  images: {}, hits: HITS, samples: 4,
  async init() {
    await Promise.all(['800 60px Kufi', '700 40px Kufi'].map((f) => document.fonts.load(f, 'توقّف عن اختيار').catch(() => {})));
    GRAIN = document.createElement('canvas'); GRAIN.width = 960; GRAIN.height = 540;
    const g = GRAIN.getContext('2d'), img = g.createImageData(960, 540), rnd = M.mulberry32(1234);
    for (let i = 0; i < img.data.length; i += 4) { const v = 200 + rnd() * 55; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0);
  },
  draw(ctx, u, t) {
    if (COVER) { cover(ctx); return; }
    let s = SCREENS[0]; SCREENS.forEach((x) => { if (u >= x.at) s = x; });
    ctx.fillStyle = s.field; ctx.fillRect(0, 0, W, H);
    if (s.kind !== 'end') header(ctx, s);
    titleBlock(ctx, u, t, s);
    visual(ctx, u, t, s);
    const gx = Math.floor(hash01(Math.floor(t * 12), 5) * 40), gy = Math.floor(hash01(Math.floor(t * 12), 6) * 40);
    ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.2; ctx.drawImage(GRAIN, -gx, -gy, W + 80, H + 80); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  },
});
