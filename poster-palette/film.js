// How to choose your color palette — Short 9:16 in a new "printed poster" style (risograph):
// flat ink fields, huge condensed type, paper grain, slight misregistration, hard cuts on the beat,
// elements stamped in. No cards, no shadows, no rising text. Pure function of time.
// Hook (shared/accroche.md): "Stop picking colors at random." on frame 0 with the random chips.
import * as M from './lib/motion.js';

const { W, H, prog, clamp, lerp, hash01, TAU, mix } = M;
const INK = { paper: '#F1ECE2', black: '#1C1A19', pink: '#FF4F9A', yellow: '#FFD84A', blue: '#2F5BFF', cream: '#F6F1E7' };
const BASE = '#3157D5';                                   // the fictional brand color
const BEAT = 60 / 128, X0 = 72, X1 = 1008;
const HOOK = 6, SPAN = 12, S0 = 6, RECAP = S0 + 5 * SPAN, END = RECAP + 8;
const at = (i) => S0 + i * SPAN;

// ------------------------------------------------------------------ colour helpers
const toRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h) => { const c = toRgb(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const SHADES = [0.92, 0.8, 0.62, 0.42, 0.2, 0, -0.18, -0.36, -0.54].map((k) => (k >= 0 ? mix(BASE, '#FFFFFF', k) : mix(BASE, '#000000', -k)));
const SHADE_NAMES = ['50', '100', '200', '300', '400', '500', '600', '700', '800'];
const GRAYS = ['#F7F7F8', '#E9EAEC', '#D3D5D9', '#B0B3B9', '#868A92', '#5E626A', '#41444B', '#2A2C31', '#17181B'].map((g) => mix(g, BASE, 0.08));
const STATUS = [['#1F9D55', 'SUCCESS', 'نجاح'], ['#E8A317', 'WARNING', 'تنبيه'], ['#E5484D', 'ERROR', 'خطأ']];
const BUTTON_RATIO = ratio('#FFFFFF', BASE).toFixed(1);

// ------------------------------------------------------------------ screens
const SCREENS = [
  { at: 0, field: INK.paper, ink: INK.black, title: ['STOP PICKING', 'COLORS AT', 'RANDOM.'], ar: 'توقّف عن اختيار الألوان عشوائيًا.', en2: '5 STEPS TO A PALETTE THAT WORKS.', ar2: '5 خطوات للوحة ألوان ناجحة.', kind: 'hook' },
  { at: at(0), field: INK.yellow, ink: INK.black, n: 1, title: ['START WITH', 'ONE COLOR.'], ar: 'ابدأ بلون واحد.', en2: 'YOUR BRAND COLOR. EVERYTHING COMES FROM IT.', ar2: 'لون علامتك. كل شيء ينطلق منه.', kind: 'one' },
  { at: at(1), field: INK.paper, ink: INK.black, n: 2, title: ['BUILD', '9 SHADES.'], ar: 'ابنِ 9 درجات منه.', en2: 'FROM 50 (LIGHTEST) TO 800 (DARKEST).', ar2: 'من 50 (الأفتح) إلى 800 (الأغمق).', kind: 'shades' },
  { at: at(2), field: INK.black, ink: INK.cream, n: 3, title: ['ADD TINTED', 'GRAYS.'], ar: 'أضف رماديًا مائلًا إلى لونك.', en2: 'A HINT OF YOUR COLOR KEEPS THEM CALM.', ar2: 'لمسة من لونك تجعل الرمادي منسجمًا.', kind: 'grays' },
  { at: at(3), field: INK.paper, ink: INK.black, n: 4, title: ['ADD STATUS', 'COLORS.'], ar: 'أضف ألوان الحالات.', en2: 'GREEN, AMBER, RED. NOTHING ELSE.', ar2: 'أخضر وكهرماني وأحمر، ولا شيء غيرها.', kind: 'status' },
  { at: at(4), field: INK.yellow, ink: INK.black, n: 5, title: ['TEST IT.'], ar: 'اختبرها.', en2: 'CONTRAST OF AT LEAST 4.5:1, THEN DARK MODE.', ar2: 'تباين لا يقل عن 4.5:1، ثم الوضع الداكن.', kind: 'test' },
  { at: RECAP, field: INK.black, ink: INK.cream, title: ['SAVE THIS', 'METHOD.'], ar: 'احفظ هذه الطريقة.', en2: '1 COLOR · 9 SHADES · GRAYS · STATUS · TEST', ar2: 'لون واحد · 9 درجات · رمادي · حالات · اختبار', kind: 'recap' },
  { at: END, field: INK.blue, ink: INK.cream, title: ['KEEP IT', 'SIMPLE.'], ar: 'اجعلها بسيطة.', kind: 'end' },
];

// ------------------------------------------------------------------ hits
const HITS = [];
const hit = (b, l, s, o) => HITS.push(o ? [b, l, s, o] : [b, l, s]);
hit(0, 'hook stamp', 'thud'); hit(0.5, 'chips jitter', 'tick'); hit(1.6, 'chips', 'tick'); hit(3.2, 'red cross stamp', 'thud');
SCREENS.slice(1).forEach((s) => { hit(s.at, `cut ${s.kind}`, 'click'); hit(s.at + 0.05, `${s.kind} title stamp`, 'thud'); hit(s.at + 0.6, `${s.kind} arabic`, 'tick'); });
hit(at(0) + 1.6, 'brand circle', 'thud'); hit(at(0) + 6, 'hex label', 'tick');
SHADES.forEach((_, i) => hit(at(1) + 1.6 + i * 0.35, `shade ${i}`, 'pop', { pitch: ['C5', 'D5', 'E5', 'F#5', 'G#5', 'A#5', 'C6', 'D6', 'E6'][i] }));
hit(at(2) + 1.6, 'brand row', 'thud'); GRAYS.forEach((_, i) => hit(at(2) + 3 + i * 0.3, `gray ${i}`, 'blip', { pitch: 'E6' }));
STATUS.forEach((_, i) => hit(at(3) + 1.8 + i * 0.9, `status ${i}`, 'thud'));
hit(at(4) + 1.6, 'ui card', 'thud'); hit(at(4) + 4, 'contrast badge', 'bell', { pitch: 'E6' }); hit(at(4) + 7, 'dark mode cut', 'click'); hit(at(4) + 8, 'dark badge', 'bell', { pitch: 'A6' });
[0, 1, 2, 3].forEach((i) => hit(RECAP + 1.4 + i * 0.6, `recap row ${i}`, 'pop', { pitch: ['A5', 'C#6', 'E6', 'A6'][i] }));
hit(END + 0.05, 'end stamp', 'thud'); hit(END + 2, 'follow line', 'tick');

// ------------------------------------------------------------------ drawing helpers
let GRAIN = null;
const boil = (t, k, amp = 1.6) => (hash01(Math.floor(t * 12), k) - 0.5) * 2 * amp;     // stop-motion jitter, 12 fps
function stamp(u, t0, seed = 1) {                         // printed stamp: big, slightly rotated, then settles
  if (u < t0) return null;
  const p = clamp((u - t0) / 0.35);
  return { s: 1 + 0.16 * (1 - p) ** 2, rot: (hash01(seed, 7) - 0.5) * 0.05 * (1 - p * 0.6), a: 1 };
}
function withStamp(ctx, st, cx, cy, fn) { if (!st) return; ctx.save(); ctx.translate(cx, cy); ctx.rotate(st.rot); ctx.scale(st.s, st.s); ctx.translate(-cx, -cy); fn(); ctx.restore(); }
function inkText(ctx, str, x, y, font, color, align, t, seed, off = INK.pink) {
  ctx.font = font; ctx.textAlign = align;
  const jx = boil(t, seed), jy = boil(t, seed + 3);
  ctx.globalAlpha = 0.9; ctx.fillStyle = off; ctx.fillText(str, x + 7 + jx, y + 5 + jy);   // misregistered second ink
  ctx.globalAlpha = 1; ctx.fillStyle = color; ctx.fillText(str, x + jx * 0.4, y + jy * 0.4);
}
function plain(ctx, str, x, y, font, color, align = 'left', rtl = false) {
  ctx.save(); ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.direction = rtl ? 'rtl' : 'ltr'; ctx.fillText(str, x, y); ctx.restore();
}
function fitFont(ctx, str, max, maxW, family, weight = 400) { ctx.font = `${weight} ${max}px ${family}`; const w = ctx.measureText(str).width; return Math.min(max, Math.floor(max * maxW / w)); }

function header(ctx, s) {
  plain(ctx, 'LEARN UI/UX', X0, 112, '700 34px SpaceMono', s.ink);
  plain(ctx, 'AG STUDIO', X1, 112, '700 34px SpaceMono', s.ink, 'right');
  ctx.fillStyle = s.ink; ctx.fillRect(X0, 132, X1 - X0, 4);
  if (s.n) plain(ctx, `STEP 0${s.n} / 05`, X0, 206, '700 30px SpaceMono', s.ink);
}
function titleBlock(ctx, u, t, s) {
  const size = s.title.length > 2 ? 168 : 196, lh = size * 0.94, y0 = s.n ? 420 : 380;
  const t0 = s.kind === 'hook' ? -2 : s.at;
  s.title.forEach((line, i) => {
    const st = stamp(u, t0 + i * 0.18, s.at * 10 + i);
    const fs = fitFont(ctx, line, size, X1 - X0, 'Anton');
    withStamp(ctx, st, X0 + 300, y0 + i * lh - size / 3, () => inkText(ctx, line, X0, y0 + i * lh, `400 ${fs}px Anton`, s.ink, 'left', t, i + 1));
  });
  const yEnd = y0 + (s.title.length - 1) * lh;
  if (u >= t0 + 0.6) plain(ctx, s.ar, X1, yEnd + 128, `800 ${fitFont(ctx, s.ar, 70, X1 - X0, 'Kufi', 800)}px Kufi`, s.ink, 'right', true);
  if (s.en2 && u >= t0 + 1.0) plain(ctx, s.en2, X0, yEnd + 210, `700 ${fitFont(ctx, s.en2, 34, X1 - X0, 'SpaceMono', 700)}px SpaceMono`, s.ink);
  if (s.ar2 && u >= t0 + 1.3) plain(ctx, s.ar2, X1, yEnd + 270, `700 ${fitFont(ctx, s.ar2, 34, X1 - X0, 'Kufi', 700)}px Kufi`, s.ink, 'right', true);
}
function swatch(ctx, x, y, w, h, color, border) { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); if (border) { ctx.strokeStyle = border; ctx.lineWidth = 3; ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3); } }
function halftone(ctx, x, y, w, h, color, max = 7) { ctx.fillStyle = color; for (let yy = 0; yy < h; yy += 18) for (let xx = 0; xx < w; xx += 18) { const r = max * (yy / h); if (r > 0.6) { ctx.beginPath(); ctx.arc(x + xx + 9, y + yy + 9, r, 0, TAU); ctx.fill(); } } }

// ------------------------------------------------------------------ visuals per screen
const VY = 1060, XV = 950;
function visual(ctx, u, t, s) {
  const v = u - s.at;
  if (s.kind === 'hook') {
    const chips = ['#E5484D', '#22C55E', '#F97316', '#06B6D4', '#A855F7', '#FACC15', '#EC4899'];
    chips.forEach((c, i) => {
      const x = 110 + (i % 4) * 230 + (i > 3 ? 115 : 0), y = VY + (i > 3 ? 230 : 0) + (hash01(i, 2) - 0.5) * 60;
      const rot = (hash01(i, 3) - 0.5) * 0.5 + 0.04 * Math.sin(u * 3 + i);
      ctx.save(); ctx.translate(x + 70, y + 95); ctx.rotate(rot); swatch(ctx, -70, -95, 140, 190, c, INK.black); ctx.restore();
    });
    const st = stamp(u, 3.2, 99);
    withStamp(ctx, st, 540, VY + 200, () => {
      ctx.strokeStyle = '#D9262C'; ctx.lineWidth = 34; ctx.lineCap = 'butt';
      ctx.beginPath(); ctx.moveTo(150, VY - 20); ctx.lineTo(930, VY + 430); ctx.moveTo(930, VY - 20); ctx.lineTo(150, VY + 430); ctx.stroke();
    });
  } else if (s.kind === 'one') {
    const st = stamp(u, s.at + 1.6, 11);
    withStamp(ctx, st, 540, VY + 220, () => {
      halftone(ctx, 330, VY + 30, 440, 420, INK.black, 6);
      ctx.fillStyle = BASE; ctx.beginPath(); ctx.arc(540, VY + 220, 210, 0, TAU); ctx.fill();
    });
    if (v >= 6) plain(ctx, `${BASE}  ·  BRAND`, 540, VY + 520, '700 34px SpaceMono', INK.black, 'center');
  } else if (s.kind === 'shades') {
    const w = (XV - X0) / 9;
    SHADES.forEach((c, i) => {
      const st = stamp(u, s.at + 1.6 + i * 0.35, 20 + i); if (!st) return;
      withStamp(ctx, st, X0 + i * w + w / 2, VY + 210, () => swatch(ctx, X0 + i * w, VY, w + 1, 420, c));
      plain(ctx, SHADE_NAMES[i], X0 + i * w + w / 2, VY + 470, '700 24px SpaceMono', INK.black, 'center');
      if (i === 5) plain(ctx, 'BASE', X0 + i * w + w / 2, VY - 18, '700 24px SpaceMono', INK.black, 'center');
    });
  } else if (s.kind === 'grays') {
    const w = (XV - X0) / 9;
    if (u >= s.at + 1.6) { plain(ctx, 'BRAND', X0, VY - 16, '700 26px SpaceMono', INK.cream); SHADES.forEach((c, i) => swatch(ctx, X0 + i * w, VY, w + 1, 150, c)); }
    if (u >= s.at + 3) plain(ctx, 'TINTED GRAYS', X0, VY + 214, '700 26px SpaceMono', INK.cream);
    GRAYS.forEach((c, i) => { const st = stamp(u, s.at + 3 + i * 0.3, 40 + i); withStamp(ctx, st, X0 + i * w + w / 2, VY + 305, () => swatch(ctx, X0 + i * w, VY + 230, w + 1, 150, c)); });
  } else if (s.kind === 'status') {
    const w = 280, gap = (XV - X0 - 3 * w) / 2;
    STATUS.forEach(([c, en, ar], i) => {
      const st = stamp(u, s.at + 1.8 + i * 0.9, 60 + i); if (!st) return;
      const x = X0 + i * (w + gap);
      withStamp(ctx, st, x + w / 2, VY + 150, () => { swatch(ctx, x, VY, w, 300, c); halftone(ctx, x, VY + 150, w, 150, 'rgba(0,0,0,0.18)', 6); });
      plain(ctx, en, x, VY + 352, '700 30px SpaceMono', INK.black);
      plain(ctx, ar, x + w, VY + 410, '800 40px Kufi', INK.black, 'right', true);
    });
  } else if (s.kind === 'test') {
    const dark = v >= 7, st = stamp(u, s.at + 1.6, 70);
    withStamp(ctx, st, 540, VY + 230, () => {
      const bg = dark ? '#16181D' : '#FFFFFF', fg = dark ? '#EDEEF0' : '#1C1A19', sub = dark ? '#A3A7AF' : '#5E626A', btn = dark ? SHADES[3] : BASE, btnTxt = dark ? '#0E1424' : '#FFFFFF';
      swatch(ctx, 132, VY, 816, 470, bg, INK.black);
      plain(ctx, 'MONTHLY PLAN', 182, VY + 92, '700 40px SpaceMono', fg);
      plain(ctx, 'Unlimited projects for your team.', 182, VY + 150, '400 28px SpaceMono', sub);
      swatch(ctx, 182, VY + 220, 716, 3, dark ? '#2A2C31' : '#E3E4E7');
      swatch(ctx, 182, VY + 300, 320, 100, btn);
      plain(ctx, 'START', 342, VY + 364, '700 38px SpaceMono', btnTxt, 'center');
      const r2 = ratio(btn, btnTxt).toFixed(1);
      const bst = stamp(u, s.at + (dark ? 8 : 4), dark ? 72 : 71);
      withStamp(ctx, bst, 760, VY + 350, () => {
        ctx.save(); ctx.translate(760, VY + 350); ctx.rotate(-0.08);
        ctx.strokeStyle = '#1F9D55'; ctx.lineWidth = 7; ctx.strokeRect(-150, -62, 300, 124);
        plain(ctx, dark ? 'DARK MODE' : `${dark ? r2 : BUTTON_RATIO}:1`, 0, -6, '700 34px SpaceMono', '#1F9D55', 'center');
        plain(ctx, dark ? `${r2}:1 ✓` : 'PASSES AA ✓', 0, 40, '700 28px SpaceMono', '#1F9D55', 'center');
        ctx.restore();
      });
    });
  } else if (s.kind === 'recap') {
    const rows = [['BRAND', [BASE]], ['SHADES', SHADES], ['GRAYS', GRAYS], ['STATUS', STATUS.map((x) => x[0])]];
    rows.forEach(([lab, cols], r) => {
      if (u < s.at + 1.4 + r * 0.6) return;
      const y = VY - 30 + r * 130; plain(ctx, lab, X0, y + 30, '700 24px SpaceMono', INK.cream);
      const x0 = X0 + 190, w = (XV - x0) / 9;
      const span = cols.length === 1 ? 2 : cols.length === 3 ? 3 : 1;
      cols.forEach((c, i) => swatch(ctx, x0 + i * w * span, y, w * span - (span > 1 ? 8 : -1), 96, c));
    });
  } else if (s.kind === 'end') {
    if (u >= s.at + 2) {
      ctx.fillStyle = INK.cream; ctx.fillRect(X0, 1010, X1 - X0, 6);
      plain(ctx, 'FOLLOW FOR MORE', X0, 1100, '400 92px Anton', INK.cream);
      plain(ctx, 'UI/UX TUTORIALS', X0, 1196, '400 92px Anton', INK.yellow);
      plain(ctx, 'تابعني لمزيد من دروس UI/UX', X1, 1300, '800 46px Kufi', INK.cream, 'right', true);
    }
  }
}

// ------------------------------------------------------------------ cover (?cover=tiktok|shorts)
const COVER = new URLSearchParams(location.search).get('cover');
function cover(ctx, kind) {
  ctx.fillStyle = INK.paper; ctx.fillRect(0, 0, W, H);
  const top = kind === 'tiktok' ? 290 : 220, t = 0;
  plain(ctx, 'LEARN UI/UX', X0, top, '700 26px SpaceMono', INK.black); plain(ctx, 'AG STUDIO', X1, top, '700 26px SpaceMono', INK.black, 'right');
  ctx.fillStyle = INK.black; ctx.fillRect(X0, top + 20, X1 - X0, 4);
  ['HOW TO CHOOSE', 'YOUR COLOR', 'PALETTE.'].forEach((l, i) => { const fs = fitFont(ctx, l, 176, X1 - X0, 'Anton'); inkText(ctx, l, X0, top + 230 + i * 168, `400 ${fs}px Anton`, INK.black, 'left', t, i + 1); });
  plain(ctx, 'كيف تختار لوحة ألوانك', X1, top + 690, '800 74px Kufi', INK.black, 'right', true);
  const w = (X1 - X0) / 9, y = top + 760, h = kind === 'tiktok' ? 1680 - y - 60 : 360;
  SHADES.forEach((c, i) => swatch(ctx, X0 + i * w, y, w + 1, Math.min(h, 420), c));
  ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.22; ctx.drawImage(GRAIN, 0, 0, W, H); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}

// ------------------------------------------------------------------ film
M.film({
  fonts: ['400 100px Anton', '700 30px SpaceMono', '400 30px SpaceMono', '800 60px Kufi', '700 40px Kufi'],
  images: {}, hits: HITS, samples: 4,
  async init() {
    await Promise.all(['800 60px Kufi', '700 40px Kufi'].map((f) => document.fonts.load(f, 'توقّف عن اختيار ٦').catch(() => {})));
    GRAIN = document.createElement('canvas'); GRAIN.width = 540; GRAIN.height = 960;
    const g = GRAIN.getContext('2d'), img = g.createImageData(540, 960), rnd = M.mulberry32(1234);
    for (let i = 0; i < img.data.length; i += 4) { const v = 200 + rnd() * 55; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0);
  },
  draw(ctx, u, t) {
    if (COVER) { cover(ctx, COVER); return; }
    let s = SCREENS[0]; SCREENS.forEach((x) => { if (u >= x.at) s = x; });
    ctx.fillStyle = s.field; ctx.fillRect(0, 0, W, H);
    if (s.kind !== 'end') header(ctx, s);
    titleBlock(ctx, u, t, s);
    visual(ctx, u, t, s);
    // paper grain over everything, shifted at 12 fps like a reprinted frame
    const gx = Math.floor(hash01(Math.floor(t * 12), 5) * 40), gy = Math.floor(hash01(Math.floor(t * 12), 6) * 40);
    ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.2; ctx.drawImage(GRAIN, -gx, -gy, W + 80, H + 80); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  },
});
