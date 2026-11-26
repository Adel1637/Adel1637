// The UI/UX toolkit — Short 9:16, kinetic motion design, look A "dark software" (no orange).
// Hook (shared/accroche.md): "THE UI/UX TOOLKIT." on frame 0, a pen-tool path moving, circle wipe at 1.1 s.
// 6 tools, one vignette each (logo springs in, then a live mini demo of what the tool does), transitions
// between scenes (zoom through a frame, push up, push left), recap grid of logos, blue end page.
// Grays of real software UIs; the only colors come from the tools' own logos and interfaces.
import * as M from './lib/motion.js';

const { W, H, clamp, lerp, E, spring, TAU, hash01 } = M;
const B = 60 / 128;
const X0 = 80;
const F = { title: 'Plex', mono: 'PlexMono', ar: 'PlexAr' };
const INK = '#EDEDED', SUB = '#A8A8A8', SEL = '#0D99FF', END_BLUE = '#0C8CE9';

// ------------------------------------------------------------------ timeline (beats)
const SPAN = 14, T0 = 4;
const TOOLS = [
  { key: 'figma', name: 'FIGMA', cat: 'DESIGN', bg: '#2C2C2C', en: 'DESIGN · COMPONENTS · PROTOTYPES', ar: 'تصميم الواجهات والمكوّنات والنماذج الأولية', img: 'figma' },
  { key: 'figjam', name: 'FIGJAM', cat: 'DESIGN', bg: '#1C1C1C', en: 'USER FLOWS · IDEAS · WORKSHOPS', ar: 'مسارات المستخدم والأفكار وورشات العمل', img: 'figjam', wide: true },
  { key: 'contrast', name: 'CONTRAST', cat: 'DESIGN', bg: '#262626', en: 'WEBAIM CONTRAST CHECKER', ar: 'تحقّق من تباين ألوان النصوص', img: 'webaim', wide: true },
  { key: 'vscode', name: 'VS CODE', cat: 'DEV', bg: '#1F1F1F', en: 'WRITE AND EDIT YOUR CODE', ar: 'محرّر لكتابة الكود وتعديله', img: 'vscode' },
  { key: 'devtools', name: 'DEVTOOLS', cat: 'DEV', bg: '#202124', en: 'INSPECT · DEBUG · TEST ON MOBILE', ar: 'افحص الصفحة واختبرها على الجوال', img: 'chrome' },
  { key: 'github', name: 'GITHUB', cat: 'DEV', bg: '#0D1117', en: 'SAVE VERSIONS · WORK AS A TEAM', ar: 'احفظ النسخ واعمل مع فريقك', img: 'github' },
];
TOOLS.forEach((x, i) => { x.b0 = T0 + i * SPAN; x.i = i; });
const RECAP = T0 + 6 * SPAN, END = RECAP + 10, TOTAL = END + 8;
const PUSH = { 1: 'up', 2: 'left', 3: 'up', 4: 'left', 5: 'up' };     // exit transition of tool i (0 = zoom through)

// ------------------------------------------------------------------ sound (beats)
const HITS = [];
const hit = (b, l, s, o) => HITS.push(o ? [b, l, s, o] : [b, l, s]);
hit(0, 'hook slam', 'thud', { pitch: 'A1' }); hit(0, 'hook whoosh', 'whoosh', { len: 0.35 });
hit(1.5, 'pen anchor', 'tok', { pitch: 'E5' }); hit(2.5, 'pen anchor', 'tok', { pitch: 'B5' });
hit(T0, 'riser into wipe', 'riser', { len: 1.1 }); hit(T0, 'wipe lands', 'impact');
TOOLS.forEach((x) => {
  const b = x.b0;
  if (x.i > 0) { hit(b, `${x.key} transition`, 'whoosh', { len: 0.45 }); hit(b, `${x.key} sub`, 'sub'); }
  hit(b + 0.3, `${x.key} logo`, 'pop', { pitch: ['C6', 'D6', 'E6', 'G5', 'A5', 'B5'][x.i] });
  hit(b + 1.0, `${x.key} title`, 'whoosh', { len: 0.25 });
  hit(b + 2.2, `${x.key} logo to corner`, 'tok', { pitch: 'G5' });
});
const f0 = TOOLS[0].b0, j0 = TOOLS[1].b0, c0 = TOOLS[2].b0, v0 = TOOLS[3].b0, d0 = TOOLS[4].b0, g0 = TOOLS[5].b0;
hit(f0 + 2.6, 'circle stretches into a window', 'boing', { pitch: 'C4', to: 'G4' });
[0, 1, 2, 3, 4].forEach((i) => hit(f0 + 3.6 + i * 0.25, `layer ${i}`, 'blip', { pitch: ['E6', 'G6', 'A6', 'B6', 'D7'][i] }));
[0, 1, 2].forEach((i) => hit(f0 + 5 + i * 0.4, `frame ${i}`, 'pop', { pitch: ['C5', 'E5', 'G5'][i] }));
hit(f0 + 7, 'selection', 'click'); hit(f0 + 12.9, 'riser into zoom', 'riser', { len: 0.5 });
[0, 1, 2].forEach((i) => hit(j0 + 3 + i * 0.6, `sticky ${i}`, 'thud', { pitch: ['C3', 'E3', 'G3'][i] }));
[0, 1].forEach((i) => hit(j0 + 5.6 + i * 1.0, `connector ${i}`, 'whoosh', { len: 0.3 }));
hit(j0 + 8, 'cursor grabs', 'click'); hit(j0 + 10, 'sticky drops', 'tok', { pitch: 'C5' });
hit(c0 + 3, 'swatches', 'pop', { pitch: 'A5' }); for (let i = 0; i < 10; i++) hit(c0 + 4.5 + i * 0.3, `ratio tick ${i}`, 'tick');
hit(c0 + 6.2, 'AA pass', 'bell', { pitch: 'E6' }); hit(c0 + 7.4, 'AAA pass', 'bell', { pitch: 'A6' });
hit(v0 + 3, 'editor opens', 'thud', { pitch: 'E2' }); hit(v0 + 4, 'typing', 'type', { n: 22, len: 2.6 }); hit(v0 + 10, 'autocomplete', 'blip', { pitch: 'A6' }); hit(v0 + 11, 'accept', 'click');
hit(d0 + 3, 'page loads', 'thud', { pitch: 'E2' }); hit(d0 + 5, 'inspect', 'click'); hit(d0 + 7.5, 'device mode', 'riser', { len: 0.6 }); hit(d0 + 7.5, 'squeeze', 'boing', { pitch: 'G4', to: 'C4' });
[0, 1, 2, 3, 4].forEach((i) => hit(g0 + 3 + i * 0.7, `commit ${i}`, 'pop', { pitch: ['C5', 'D5', 'E5', 'G5', 'A5'][i] }));
hit(g0 + 7.2, 'branch', 'whoosh', { len: 0.3 }); hit(g0 + 9.4, 'merge', 'thud', { pitch: 'C3' }); hit(g0 + 10, 'merged', 'bell', { pitch: 'E6' });
hit(RECAP, 'recap push', 'whoosh', { len: 0.45 });
TOOLS.forEach((x, i) => hit(RECAP + 1.2 + i * 0.3, `tile ${i}`, 'pop', { pitch: ['C5', 'D5', 'E5', 'G5', 'A5', 'C6'][i] }));
hit(END, 'end wipe', 'impact'); hit(END + 2, 'follow line', 'tick');

// ------------------------------------------------------------------ helpers (v = local beats)
const ez = (v, a, b, f = E.outExpo) => f(clamp((v - a) / (b - a)));
const spr = (v, a, cfg = { stiffness: 230, damping: 15 }) => (v < a ? 0 : spring((v - a) * B, cfg));
function txt(ctx, s, x, y, size, { w = 700, color = INK, align = 'left', family = F.title, rtl = false, sx = 1, sy = 1, alpha = 1 } = {}) {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.scale(sx, sy);
  ctx.font = `${w} ${size}px ${family}`; ctx.fillStyle = color; ctx.textAlign = align; ctx.direction = rtl ? 'rtl' : 'ltr';
  ctx.fillText(s, 0, 0); ctx.restore();
}
function maskUp(ctx, s, x, y, size, p, o = {}) {
  if (p <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(0, y - size * 1.0, W, size * 1.3); ctx.clip();
  txt(ctx, s, x, y + (1 - p) * size * 1.15, size, o); ctx.restore();
}
function measure(ctx, s, size, w = 700, family = F.title) { ctx.font = `${w} ${size}px ${family}`; return ctx.measureText(s).width; }
const fit = (ctx, s, max, maxW = W - 2 * X0, w = 700, family = F.title) => Math.min(max, Math.floor(max * maxW / measure(ctx, s, max, w, family)));
const rr = (ctx, x, y, w, h, r, fill, stroke, lw = 2) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } };
function drawImg(ctx, im, cx, cy, maxW, maxH) { if (!im) return; const k = Math.min(maxW / im.width, maxH / im.height); ctx.drawImage(im, cx - im.width * k / 2, cy - im.height * k / 2, im.width * k, im.height * k); }
function cursor(ctx, x, y, color = '#FFFFFF', label = null, tagColor = SEL) {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = color; ctx.strokeStyle = '#111'; ctx.lineWidth = 2.5; ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(0, 46); ctx.lineTo(12, 35); ctx.lineTo(22, 56); ctx.lineTo(30, 52); ctx.lineTo(20, 31); ctx.lineTo(36, 31); ctx.closePath(); ctx.fill(); ctx.stroke();
  if (label) { ctx.font = `600 22px ${F.title}`; const w = ctx.measureText(label).width + 22; rr(ctx, 30, 50, w, 36, 8, tagColor); txt(ctx, label, 41, 75, 22, { w: 700, color: '#FFFFFF' }); }
  ctx.restore();
}
function topline(ctx, color, label, logoSlot) {
  txt(ctx, 'LEARN UI/UX', X0, 120, 26, { w: 600, color, family: F.mono });
  txt(ctx, 'AG STUDIO', W - X0, 120, 26, { w: 600, color, align: 'right', family: F.mono });
  if (label) txt(ctx, label, X0 + (logoSlot || 0), 202, 26, { w: 600, color, family: F.mono });
}
// logo tile: white rounded tile with the logo, from big (center) to small (row 2, left)
function logoTile(ctx, v, x, IMG) {
  const im = IMG[x.img], pop = spr(v, 0.25, { stiffness: 260, damping: 13 }), mv = ez(v, 2.1, 3.0, E.inOutCubic);
  const bw = x.wide ? 620 : 340, bh = x.wide ? 240 : 340, sw = x.wide ? 170 : 70, sh = 70;
  const w = lerp(bw, sw, mv), h = lerp(bh, sh, mv), cx = lerp(W / 2, X0 + sw / 2, mv), cy = lerp(640, 192, mv);
  if (pop <= 0) return;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(pop, pop);
  rr(ctx, -w / 2, -h / 2, w, h, lerp(48, 14, mv), '#FFFFFF');
  drawImg(ctx, im, 0, 0, w * 0.74, h * 0.7);
  ctx.restore();
}
function titles(ctx, v, x) {
  maskUp(ctx, x.name, X0 - 6, 1380, fit(ctx, x.name, 220), ez(v, 1.0, 2.2), { color: '#FFFFFF' });
  maskUp(ctx, x.en, X0, 1462, fit(ctx, x.en, 34, W - 2 * X0, 600, F.mono), ez(v, 1.6, 2.6), { w: 600, color: SUB, family: F.mono });
  maskUp(ctx, x.ar, W - X0, 1548, fit(ctx, x.ar, 50, W - 2 * X0, 700, F.ar), ez(v, 2.0, 3.0), { w: 700, color: INK, family: F.ar, align: 'right', rtl: true });
}

// ------------------------------------------------------------------ hook (0 -> 4)
function penPath(ctx, t, x, y, color) {
  const a = [[x, y + 120], [x + 170, y - 10 + 40 * Math.sin(t * 2.4)], [x + 320, y + 110]];
  const h = 70 + 30 * Math.sin(t * 1.7), hy = 60 * Math.cos(t * 2.4);
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(...a[0]);
  ctx.bezierCurveTo(a[0][0] + 60, a[0][1] - 120, a[1][0] - h, a[1][1] - hy, ...a[1]);
  ctx.bezierCurveTo(a[1][0] + h, a[1][1] + hy, a[2][0] - 60, a[2][1] - 120, ...a[2]); ctx.stroke();
  ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a[1][0] - h, a[1][1] - hy); ctx.lineTo(a[1][0] + h, a[1][1] + hy); ctx.stroke();
  [[a[1][0] - h, a[1][1] - hy], [a[1][0] + h, a[1][1] + hy]].forEach(([px, py]) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(px, py, 8, 0, TAU); ctx.fill(); });
  a.forEach(([px, py], i) => { ctx.fillStyle = i === 1 ? color : '#161616'; ctx.fillRect(px - 11, py - 11, 22, 22); ctx.lineWidth = 3; ctx.strokeRect(px - 11, py - 11, 22, 22); });
  ctx.restore();
  cursor(ctx, a[1][0] + 20, a[1][1] + 20);
}
function hook(ctx, u, t) {
  ctx.fillStyle = '#161616'; ctx.fillRect(0, 0, W, H);
  topline(ctx, INK);
  const lines = [['THE', 210, 720], ['UI/UX', 330, 1030], ['TOOLKIT.', 236, 1280]];
  lines.forEach(([s, size, y], i) => {
    const drift = (i % 2 ? -1 : 1) * u * 7, breathe = 1 + 0.035 * Math.sin(t * 3.2 + i);
    txt(ctx, s, X0 + drift, y, fit(ctx, s, size, (W - 2 * X0) / 1.04), { sx: breathe, color: '#FFFFFF' });
  });
  txt(ctx, 'أدوات مصمّم UI/UX الأساسية', W - X0, 1420, 66, { family: F.ar, align: 'right', rtl: true });
  txt(ctx, '6 TOOLS · DESIGN + DEV', X0, 1520, 40, { w: 600, family: F.mono, color: SUB });
  penPath(ctx, t, 600, 330, SEL);
  const l3 = 'TOOLKIT.', ts = fit(ctx, l3, 236, (W - 2 * X0) / 1.04), oX = X0 + measure(ctx, 'T', ts) + measure(ctx, 'O', ts) / 2, oY = 1280 - ts * 0.36;
  ['#0ACF83', '#1ABCFE', TOOLS[0].bg].forEach((c, i) => { const q = ez(u, 2.4 + i * 0.3, 3.4 + i * 0.2, E.inExpo); if (q > 0) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(oX, oY, 40 + q * 2300, 0, TAU); ctx.fill(); } });
}

// ------------------------------------------------------------------ 1. Figma: circle -> window, layers, frames, selection, zoom through
const WIN = { cx: 540, cy: 760, w: 900, h: 640 }, SELF = { x: 610, y: 150, w: 160, h: 284 };
function sFigma(ctx, v, x, IMG) {
  const z = ez(v, 12.9, 14, E.inCubic), S = lerp(1, 7.4, z);
  const fx = WIN.cx - WIN.w / 2 + SELF.x + SELF.w / 2, fy = WIN.cy - WIN.h / 2 + SELF.y + SELF.h / 2;
  ctx.save();
  if (z > 0) { const k = Math.min(1, z * 3); ctx.translate(W / 2, H / 2); ctx.scale(S, S); ctx.translate(-lerp(W / 2, fx, k), -lerp(H / 2, fy, k)); }
  topline(ctx, SUB, '01 / 06 · DESIGN', 100);
  const pop = spr(v, 0.25, { stiffness: 260, damping: 13 }), m = ez(v, 2.6, 3.6, E.inOutCubic), mS = spr(v, 2.6, { stiffness: 220, damping: 15 });
  const w = lerp(380, WIN.w, mS), h = lerp(380, WIN.h, mS), r = lerp(190, 22, m);
  ctx.save(); ctx.translate(WIN.cx, WIN.cy); ctx.scale(pop, pop);
  rr(ctx, -w / 2, -h / 2, w, h, r, '#FFFFFF');
  ctx.save(); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, r); ctx.clip();
  if (m > 0.35) figmaWindow(ctx, v, -WIN.w / 2, -WIN.h / 2, clamp((m - 0.35) / 0.65), x);
  ctx.restore(); ctx.restore();
  // logo: from the circle to the row-2 slot
  if (pop > 0 && IMG.figma) {
    const mv = ez(v, 2.1, 3.0, E.inOutCubic), cx = lerp(WIN.cx, X0 + 35, mv), cy = lerp(WIN.cy, 192, mv), s = lerp(220, 70, mv);
    ctx.save(); ctx.translate(cx, cy); ctx.scale(pop, pop);
    if (mv > 0) { ctx.globalAlpha = mv; rr(ctx, -35, -35, 70, 70, 14, '#FFFFFF'); ctx.globalAlpha = 1; }
    drawImg(ctx, IMG.figma, 0, 0, s * 0.6, s * 0.7); ctx.restore();
  }
  titles(ctx, v, x);
  ctx.restore();
}
function figmaWindow(ctx, v, x, y, p, tool) {
  ctx.save(); ctx.globalAlpha = p;
  ctx.fillStyle = '#F5F5F5'; ctx.fillRect(x, y, WIN.w, 60); ctx.fillStyle = '#E6E6E6'; ctx.fillRect(x, y + 60, WIN.w, 2);
  txt(ctx, 'Drafts / Landing page', x + 30, y + 40, 22, { w: 700, color: '#444' });
  ctx.fillStyle = '#FAFAFA'; ctx.fillRect(x, y + 62, 220, WIN.h - 62); ctx.fillStyle = '#E6E6E6'; ctx.fillRect(x + 220, y + 62, 2, WIN.h - 62);
  ['Home', 'Hero', 'Button', 'Mobile', 'Footer'].forEach((l, i) => {
    const q = ez(v, 3.6 + i * 0.25, 4.2 + i * 0.25, E.outCubic);
    if (i === 3 && v >= 7) { ctx.fillStyle = '#DCEFFF'; ctx.fillRect(x + 8, y + 84 + i * 50, 204, 40); }
    txt(ctx, l, x + 30 + (i % 2) * 18, y + 112 + i * 50, 22, { w: 700, color: i === 3 && v >= 7 ? SEL : '#555', alpha: q });
  });
  ctx.fillStyle = '#E9E9E9'; ctx.fillRect(x + 222, y + 62, WIN.w - 222, WIN.h - 62);
  [[260, 140, 160, 284, '#FFFFFF'], [435, 120, 160, 284, '#FFFFFF'], [SELF.x, SELF.y, SELF.w, SELF.h, TOOLS[1].bg]].forEach(([fx, fy, fw, fh, col], i) => {
    const q = ez(v, 5 + i * 0.4, 5.6 + i * 0.4, E.outBack);
    if (q <= 0) return;
    ctx.save(); ctx.translate(x + fx + fw / 2, y + fy + fh / 2); ctx.scale(q, q);
    ctx.fillStyle = col; ctx.fillRect(-fw / 2, -fh / 2, fw, fh); ctx.strokeStyle = '#D0D0D0'; ctx.lineWidth = 2; ctx.strokeRect(-fw / 2, -fh / 2, fw, fh);
    if (i < 2) { ctx.fillStyle = '#E3E3E3'; ctx.fillRect(-fw / 2 + 16, -fh / 2 + 20, fw - 32, 76); ctx.fillStyle = '#CFCFCF'; ctx.fillRect(-fw / 2 + 16, -fh / 2 + 112, fw - 50, 10); ctx.fillRect(-fw / 2 + 16, -fh / 2 + 132, fw - 76, 10); ctx.fillStyle = SEL; ctx.fillRect(-fw / 2 + 16, fh / 2 - 56, 80, 30); }
    else { ctx.fillStyle = '#3A3A3A'; ctx.fillRect(-fw / 2 + 16, -fh / 2 + 24, 64, 12); ctx.fillRect(-fw / 2 + 16, -fh / 2 + 48, 100, 8); ctx.fillStyle = '#4A4A4A'; ctx.fillRect(-fw / 2 + 16, fh / 2 - 60, fw - 32, 36); }
    ctx.restore();
  });
  const s = ez(v, 7, 7.5, E.outCubic);
  if (s > 0) {
    const sx = x + SELF.x, sy = y + SELF.y; ctx.globalAlpha = p * s; ctx.strokeStyle = SEL; ctx.lineWidth = 3; ctx.strokeRect(sx - 4, sy - 4, SELF.w + 8, SELF.h + 8);
    ctx.fillStyle = '#FFFFFF'; [[sx - 4, sy - 4], [sx + SELF.w + 4, sy - 4], [sx - 4, sy + SELF.h + 4], [sx + SELF.w + 4, sy + SELF.h + 4]].forEach(([hx, hy]) => { ctx.fillRect(hx - 7, hy - 7, 14, 14); ctx.strokeRect(hx - 7, hy - 7, 14, 14); });
    rr(ctx, sx + SELF.w / 2 - 62, sy + SELF.h + 18, 124, 32, 6, SEL); txt(ctx, '390 × 844', sx + SELF.w / 2, sy + SELF.h + 41, 18, { w: 700, color: '#FFFFFF', align: 'center' });
  }
  // a cursor moves to the frame and clicks it
  const cm = ez(v, 5.8, 7, E.inOutCubic);
  if (v >= 5.8 && v < 12.9) cursor(ctx, lerp(x + 560, x + SELF.x + 110, cm), lerp(y + 560, y + SELF.y + 150, cm), '#FFFFFF', 'You', SEL);
  ctx.restore();
}

// ------------------------------------------------------------------ 2. FigJam: stickies drop, connectors draw, a teammate drags one
function sFigjam(ctx, v, x, IMG) {
  topline(ctx, SUB, '02 / 06 · DESIGN', 190);
  const bp = ez(v, 2.6, 3.3, E.outCubic);
  ctx.save(); ctx.globalAlpha = bp; rr(ctx, X0, 300, W - 2 * X0, 860, 24, '#F4F4F4'); ctx.restore();
  if (bp > 0) {
    const drag = ez(v, 8, 10, E.inOutCubic);
    const ST = [['Sign up', '#FFE57F', 150, 360, -0.05], ['Verify email', '#B3EFBD', 560, 560, 0.04], ['Home', '#A8DAFF', lerp(170, 230, drag), lerp(820, 800, drag), -0.03]];
    const pts = ST.map(([, , sx, sy]) => [sx + 150, sy + 120]);
    // connectors (drawn under the stickies)
    [[0, 1], [1, 2]].forEach(([a, b], i) => {
      const p = ez(v, 5.6 + i * 1.0, 6.4 + i * 1.0, E.inOutCubic); if (p <= 0) return;
      const [ax, ay] = pts[a], [bx, by] = pts[b], cx1 = i ? bx + 260 : ax + 300, cy1 = i ? ay + 120 : ay, n = 40;
      ctx.save(); ctx.strokeStyle = '#2F2F2F'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath();
      let ex = ax, ey = ay, px2 = ax, py2 = ay;
      for (let k = 0; k <= n * p; k++) { const s = k / n, q = 1 - s; ex = q * q * ax + 2 * q * s * cx1 + s * s * bx; ey = q * q * ay + 2 * q * s * cy1 + s * s * by; k ? ctx.lineTo(ex, ey) : ctx.moveTo(ex, ey); if (k === Math.floor(n * p) - 1) { px2 = ex; py2 = ey; } }
      ctx.stroke();
      if (p >= 1) { const an = Math.atan2(ey - py2, ex - px2); ctx.fillStyle = '#2F2F2F'; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - 26 * Math.cos(an - 0.45), ey - 26 * Math.sin(an - 0.45)); ctx.lineTo(ex - 26 * Math.cos(an + 0.45), ey - 26 * Math.sin(an + 0.45)); ctx.fill(); }
      ctx.restore();
    });
    ST.forEach(([label, col, sx, sy, rot], i) => {
      const d = spr(v, 3 + i * 0.6, { stiffness: 200, damping: 12 }); if (d <= 0) return;
      ctx.save(); ctx.translate(sx + 150, sy + 120); ctx.rotate(rot + (1 - Math.min(1, d)) * 0.3); const sc = lerp(1.5, 1, Math.min(1, d)); ctx.scale(sc, sc); ctx.globalAlpha = Math.min(1, d * 1.5);
      ctx.shadowColor = 'rgba(0,0,0,0.18)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8; ctx.fillStyle = col; ctx.fillRect(-150, -120, 300, 240); ctx.shadowColor = 'transparent';
      txt(ctx, label, -120, -60, 40, { w: 700, color: '#1E1E1E' });
      ctx.restore();
    });
    // teammate cursor grabs "Home"
    const cv = ez(v, 7, 8, E.inOutCubic);
    if (v >= 7) cursor(ctx, lerp(820, pts[2][0] + 40, cv), lerp(1100, pts[2][1] + 20, cv), '#FFFFFF', 'Sara', '#0FA958');
  }
  logoTile(ctx, v, x, IMG); titles(ctx, v, x);
}

// ------------------------------------------------------------------ 3. Contrast checker: the text color darkens, the ratio counts up, AA / AAA pass
const toRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h) => { const c = toRgb(h).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
function sContrast(ctx, v, x, IMG) {
  topline(ctx, SUB, '03 / 06 · DESIGN', 190);
  const k = ez(v, 4.5, 7.5, E.inOutCubic), fg = M.mix('#B4B4B4', '#1E1E1E', k), r = ratio(fg, '#FFFFFF');
  const sw = spr(v, 3, { stiffness: 220, damping: 14 });
  if (sw > 0) {
    // the sample card
    ctx.save(); ctx.translate(540, 470); ctx.scale(sw, sw);
    rr(ctx, -460, -170, 920, 340, 22, '#FFFFFF');
    txt(ctx, 'Read me easily.', -400, -30, 72, { color: fg });
    txt(ctx, 'Body text needs enough contrast.', -400, 50, 34, { w: 700, color: fg, family: F.title });
    ctx.restore();
    // swatches
    [[fg, 'FOREGROUND', 'hex'], ['#FFFFFF', 'BACKGROUND', '#FFFFFF']].forEach(([c, lab], i) => {
      const s2 = spr(v, 3.4 + i * 0.3); if (s2 <= 0) return;
      ctx.save(); ctx.translate(X0 + 140 + i * 460, 760); ctx.scale(s2, s2);
      rr(ctx, -110, -60, 120, 120, 16, c, '#555', 3);
      txt(ctx, lab, 30, -14, 24, { w: 600, family: F.mono, color: SUB }); txt(ctx, i ? '#FFFFFF' : fg.toUpperCase(), 30, 26, 30, { w: 600, family: F.mono, color: INK });
      ctx.restore();
    });
    // the ratio
    txt(ctx, `${r.toFixed(1)}:1`, X0, 1010, 150, { color: '#FFFFFF', alpha: ez(v, 4, 4.6) });
    [['AA', 4.5, 6.2], ['AAA', 7, 7.4]].forEach(([lab, th, b], i) => {
      const ok = r >= th, s3 = spr(v, ok ? b : 4.2, { stiffness: 300, damping: 12 }); if (s3 <= 0) return;
      const col = ok ? '#30A46C' : '#E5484D';
      ctx.save(); ctx.translate(X0 + 680 + i * 0 , 870 + i * 120); ctx.scale(s3, s3);
      rr(ctx, -10, -42, 250, 84, 14, col);
      txt(ctx, `${lab} ${ok ? '✓' : '✕'}`, 115, 16, 44, { color: '#FFFFFF', align: 'center' });
      ctx.restore();
    });
  }
  logoTile(ctx, v, x, IMG); titles(ctx, v, x);
}

// ------------------------------------------------------------------ 4. VS Code: editor opens, code types with syntax colors, autocomplete
const KW = '#569CD6', AT = '#9CDCFE', STR = '#B5CEA8', TX = '#D4D4D4', GR = '#6A6A6A';
const CODE = [[['<', GR], ['button', KW]], [['  className', AT], ['=', TX], ['"cta"', STR]], [['  onClick', AT], ['={', TX], ['save', AT], ['}', TX], ['>', GR]], [['  Get started', TX]], [['</', GR], ['button', KW], ['>', GR]]];
function sVscode(ctx, v, x, IMG) {
  topline(ctx, SUB, '04 / 06 · DEV', 100);
  const op = spr(v, 3, { stiffness: 200, damping: 16 });
  if (op > 0) {
    ctx.save(); ctx.translate(540, 720); ctx.scale(lerp(0.6, 1, Math.min(1, op)), op);
    const ex = -460, ey = -380, ew = 920, eh = 760;
    rr(ctx, ex, ey, ew, eh, 16, '#1E1E1E', '#3A3A3A', 2);
    ctx.fillStyle = '#181818'; ctx.fillRect(ex + 1, ey + 1, ew - 2, 56);
    ['#3A3A3A', '#3A3A3A', '#3A3A3A'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(ex + 30 + i * 26, ey + 29, 8, 0, TAU); ctx.fill(); });
    rr(ctx, ex + 120, ey + 10, 200, 46, 6, '#1E1E1E'); txt(ctx, 'Button.jsx', ex + 140, ey + 41, 22, { w: 600, family: F.mono, color: TX });
    ctx.fillStyle = '#181818'; ctx.fillRect(ex + 1, ey + 57, 70, eh - 58);
    [0, 1, 2, 3].forEach((i) => rr(ctx, ex + 22, ey + 90 + i * 70, 28, 28, 6, i === 0 ? '#C8C8C8' : '#5A5A5A'));
    const total = CODE.flat().reduce((a, [s]) => a + s.length, 0), chars = Math.floor(ez(v, 4, 9.6, (q) => q) * total);
    let left = chars;
    CODE.forEach((line, li) => {
      const ly = ey + 140 + li * 66;
      txt(ctx, String(li + 1), ex + 120, ly, 26, { w: 600, family: F.mono, color: '#5A5A5A', align: 'right' });
      let cx = ex + 150;
      line.forEach(([s, c]) => { const n = Math.max(0, Math.min(s.length, left)); left -= s.length; const part = s.slice(0, n); txt(ctx, part, cx, ly, 30, { w: 600, family: F.mono, color: c }); cx += measure(ctx, s, 30, 600, F.mono); });
    });
    if (Math.floor(v * 2) % 2 === 0) { ctx.fillStyle = '#AEAFAD'; ctx.fillRect(ex + 150, ey + 140 + 5 * 66 - 26, 3, 32); }
    // autocomplete popup
    const ac = spr(v, 10, { stiffness: 280, damping: 16 });
    if (ac > 0 && v < 11) {
      ctx.save(); ctx.translate(ex + 330, ey + 200); ctx.scale(1, ac);
      rr(ctx, 0, 0, 380, 170, 8, '#252526', '#454545', 2);
      ['onClick', 'onChange', 'onFocus'].forEach((s, i) => { if (!i) { ctx.fillStyle = '#04395E'; ctx.fillRect(2, 8, 376, 48); } txt(ctx, s, 26, 42 + i * 52, 26, { w: 600, family: F.mono, color: i ? TX : '#FFFFFF' }); });
      ctx.restore();
    }
    ctx.restore();
  }
  logoTile(ctx, v, x, IMG); titles(ctx, v, x);
}

// ------------------------------------------------------------------ 5. DevTools: inspect the button, then device mode squeezes the page to a phone
function sDevtools(ctx, v, x, IMG) {
  topline(ctx, SUB, '05 / 06 · DEV', 100);
  const op = spr(v, 3, { stiffness: 200, damping: 16 }); if (op > 0) {
    const dm = spr(v, 7.5, { stiffness: 160, damping: 14 }), bw = lerp(920, 430, dm), bx = 540 - bw / 2, by = 300, bh = 860;
    ctx.save(); ctx.globalAlpha = Math.min(1, op); ctx.translate(540, 730); ctx.scale(lerp(0.85, 1, Math.min(1, op)), lerp(0.85, 1, Math.min(1, op))); ctx.translate(-540, -730);
    rr(ctx, bx, by, bw, bh, 18, '#FFFFFF');
    ctx.fillStyle = '#35363A'; ctx.beginPath(); ctx.roundRect(bx, by, bw, 64, [18, 18, 0, 0]); ctx.fill();
    rr(ctx, bx + 90, by + 14, bw - 120, 36, 18, '#202124'); txt(ctx, 'studio.example', bx + 116, by + 40, 20, { w: 600, family: F.mono, color: '#BDC1C6' });
    ['#5F6368', '#5F6368', '#5F6368'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(bx + 24 + i * 20, by + 32, 6, 0, TAU); ctx.fill(); });
    ctx.save(); ctx.beginPath(); ctx.rect(bx, by + 64, bw, bh - 64); ctx.clip();
    const px = bx + 40, pw = bw - 80;
    ctx.fillStyle = '#1E1E1E'; ctx.fillRect(px, by + 100, 140, 18); ['#C9C9C9', '#C9C9C9'].forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(px + pw - 60 - i * 80, by + 102, 50, 14); });
    txt(ctx, 'Plan your week', px, by + 210, lerp(64, 48, dm), { color: '#1E1E1E' });
    ctx.fillStyle = '#9A9A9A'; ctx.fillRect(px, by + 240, pw * 0.8, 14); ctx.fillRect(px, by + 266, pw * 0.6, 14);
    const btn = { x: px, y: by + 300, w: 220, h: 64 };
    rr(ctx, btn.x, btn.y, btn.w, btn.h, 10, '#1A73E8'); txt(ctx, 'Get started', btn.x + 110, btn.y + 42, 24, { w: 700, color: '#FFFFFF', align: 'center' });
    // cards: side by side -> stacked
    const cw = lerp((pw - 30) / 2, pw, dm), ch = 220;
    [0, 1].forEach((i) => { const cx = px + lerp(i * (cw + 30), 0, dm), cy = by + 420 + lerp(0, i * (ch + 26), dm); rr(ctx, cx, cy, cw, ch, 14, '#F1F3F4'); ctx.fillStyle = '#C9C9C9'; ctx.fillRect(cx + 24, cy + 30, cw * 0.5, 16); ctx.fillRect(cx + 24, cy + 62, cw * 0.7, 12); });
    // inspect overlay on the button
    const ins = ez(v, 5, 5.4, E.outCubic) * (1 - ez(v, 7.3, 7.6));
    if (ins > 0) {
      ctx.globalAlpha = ins; ctx.fillStyle = 'rgba(111,168,220,0.6)'; ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
      ctx.fillStyle = 'rgba(147,196,125,0.45)'; ctx.fillRect(btn.x, btn.y - 16, btn.w, 16); ctx.fillRect(btn.x, btn.y + btn.h, btn.w, 16);
      rr(ctx, btn.x, btn.y + btn.h + 26, 300, 50, 8, '#202124'); txt(ctx, 'button.cta  220 × 64', btn.x + 16, btn.y + btn.h + 59, 22, { w: 600, family: F.mono, color: '#E8EAED' });
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    if (dm > 0.05) { rr(ctx, 540 - 120, by - 70, 240, 48, 10, '#35363A'); txt(ctx, `iPhone · ${Math.round(lerp(920, 390, Math.min(1, dm)))}`, 540, by - 38, 22, { w: 600, family: F.mono, color: '#E8EAED', align: 'center' }); }
    ctx.restore();
    if (v >= 4.2 && v < 7.4) cursor(ctx, lerp(820, btn.x + 150, ez(v, 4.2, 5, E.inOutCubic)), lerp(1060, btn.y + 40, ez(v, 4.2, 5, E.inOutCubic)));
  }
  logoTile(ctx, v, x, IMG); titles(ctx, v, x);
}

// ------------------------------------------------------------------ 6. GitHub: commits pop on a graph, a branch splits and merges back
function sGithub(ctx, v, x, IMG) {
  topline(ctx, SUB, '06 / 06 · DEV', 100);
  const MX = 220, BX = 380, y0 = 360, dy = 150, G = '#3FB950', LINE = '#30363D';
  const commits = [[MX, y0, 'Create project', 3], [MX, y0 + dy, 'Add home page', 3.7], [BX, y0 + dy * 2, 'Try a new button', 4.4], [BX, y0 + dy * 3, 'Fix contrast', 5.1], [MX, y0 + dy * 4, 'Merge: new button', 9.4]];
  // main line + branch
  const ml = ez(v, 2.8, 9.6, (q) => q);
  ctx.save(); ctx.strokeStyle = LINE; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(MX, y0); ctx.lineTo(MX, lerp(y0, y0 + dy * 4, ml)); ctx.stroke();
  const br = ez(v, 4.0, 5.4, E.inOutCubic);
  if (br > 0) { ctx.strokeStyle = '#A371F7'; ctx.beginPath(); ctx.moveTo(MX, y0 + dy); ctx.bezierCurveTo(MX, y0 + dy * 1.6, BX, y0 + dy * 1.4, BX, y0 + dy * 2); ctx.lineTo(BX, lerp(y0 + dy * 2, y0 + dy * 3, br)); ctx.stroke(); }
  const mg = ez(v, 8.6, 9.4, E.inOutCubic);
  if (mg > 0) { ctx.beginPath(); ctx.moveTo(BX, y0 + dy * 3); const n = 30; for (let k = 0; k <= n * mg; k++) { const s = k / n, q = 1 - s; ctx.lineTo(q * q * q * BX + 3 * q * q * s * BX + 3 * q * s * s * MX + s * s * s * MX, q * q * q * (y0 + dy * 3) + 3 * q * q * s * (y0 + dy * 3.6) + 3 * q * s * s * (y0 + dy * 3.4) + s * s * s * (y0 + dy * 4)); } ctx.stroke(); }
  ctx.restore();
  commits.forEach(([cx, cy, msg, b], i) => {
    const p = spr(v, b, { stiffness: 320, damping: 12 }); if (p <= 0) return;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(p, p); ctx.fillStyle = '#0D1117'; ctx.strokeStyle = i === 4 ? G : cx === BX ? '#A371F7' : '#8B949E'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
    maskUp(ctx, msg, BX + 80, cy + 12, 34, ez(v, b + 0.1, b + 0.8), { w: 600, family: F.mono, color: INK });
    maskUp(ctx, ['a1f3c2e', '9be04d1', '4c7a2f8', 'e5d19b3', '7f2c8a4'][i], BX + 80, cy + 52, 22, ez(v, b + 0.3, b + 1), { w: 600, family: F.mono, color: '#8B949E' });
  });
  const ok = spr(v, 10, { stiffness: 300, damping: 12 });
  if (ok > 0) { ctx.save(); ctx.translate(BX + 330, y0 + dy * 4 + 110); ctx.scale(ok, ok); rr(ctx, -150, -36, 300, 72, 36, G); txt(ctx, 'Merged ✓', 0, 14, 36, { color: '#FFFFFF', align: 'center' }); ctx.restore(); }
  logoTile(ctx, v, x, IMG); titles(ctx, v, x);
}

// ------------------------------------------------------------------ recap + end
function recap(ctx, v, IMG) {
  ctx.fillStyle = '#161616'; ctx.fillRect(0, 0, W, H);
  topline(ctx, SUB);
  maskUp(ctx, 'YOUR TOOLKIT.', X0 - 4, 300, fit(ctx, 'YOUR TOOLKIT.', 130), ez(v, 0.4, 1.4), { color: '#FFFFFF' });
  TOOLS.forEach((x, i) => {
    const p = spr(v, 1.2 + i * 0.3, { stiffness: 240, damping: 14 }); if (p <= 0) return;
    const col = i % 2, row = Math.floor(i / 2), tx = X0 + col * 470, ty = 380 + row * 290, fx = W / 2 + (hash01(i, 3) - 0.5) * 900, fy = 1800;
    ctx.save(); ctx.translate(lerp(fx, tx + 225, p), lerp(fy, ty + 120, p)); ctx.rotate((1 - Math.min(1, p)) * (hash01(i, 5) - 0.5) * 1.2);
    rr(ctx, -225, -120, 450, 240, 22, '#232323');
    rr(ctx, -200, -95, x.wide ? 250 : 120, 120, 16, '#FFFFFF'); drawImg(ctx, IMG[x.img], -200 + (x.wide ? 125 : 60), -35, (x.wide ? 250 : 120) * 0.78, 120 * 0.7);
    txt(ctx, x.name, -200, 80, 38, { color: '#FFFFFF' }); txt(ctx, x.cat, 200, 80, 22, { w: 600, family: F.mono, color: SUB, align: 'right' });
    ctx.restore();
  });
  maskUp(ctx, 'أدواتك الأساسية لتصميم الواجهات وتطويرها.', W - X0, 1340, fit(ctx, 'أدواتك الأساسية لتصميم الواجهات وتطويرها.', 50, W - 2 * X0, 700, F.ar), ez(v, 3.2, 4.2), { family: F.ar, align: 'right', rtl: true });
  maskUp(ctx, 'SAVE THIS FOR LATER.', X0, 1430, 40, ez(v, 3.6, 4.6), { w: 600, family: F.mono, color: SUB });
  const q = ez(v, 9.2, 10, E.inExpo);
  if (q > 0) { ctx.fillStyle = END_BLUE; ctx.beginPath(); ctx.arc(W / 2, H / 2, q * 1200, 0, TAU); ctx.fill(); }
}
function endPage(ctx, v) {
  ctx.fillStyle = END_BLUE; ctx.fillRect(0, 0, W, H);
  maskUp(ctx, 'Keep it simple.', X0, 760, fit(ctx, 'Keep it simple.', 150), ez(v, 0, 0.8), { color: '#FFFFFF' });
  maskUp(ctx, 'اجعلها بسيطة.', W - X0, 900, 90, ez(v, 0.4, 1.2), { family: F.ar, align: 'right', rtl: true, color: '#FFFFFF' });
  const l = ez(v, 1.6, 2.4, E.inOutCubic); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(X0, 1000, (W - 2 * X0) * l, 3);
  maskUp(ctx, 'Follow for more', X0, 1130, 76, ez(v, 2, 2.8), { color: '#FFFFFF' });
  maskUp(ctx, 'UI/UX tutorials', X0, 1220, 76, ez(v, 2.2, 3.0), { color: '#FFFFFF' });
  maskUp(ctx, 'تابعني لمزيد من دروس UI/UX', W - X0, 1330, 54, ez(v, 2.6, 3.4), { family: F.ar, align: 'right', rtl: true, color: '#FFFFFF' });
}

// ------------------------------------------------------------------ covers (?cover=tiktok|shorts)
const COVER = new URLSearchParams(location.search).get('cover');
function cover(ctx, IMG, kind) {
  ctx.fillStyle = '#161616'; ctx.fillRect(0, 0, W, H);
  const top = kind === 'tiktok' ? 330 : 260;
  txt(ctx, 'LEARN UI/UX', X0, top, 28, { w: 600, family: F.mono, color: SUB }); txt(ctx, 'AG STUDIO', W - X0, top, 28, { w: 600, family: F.mono, color: SUB, align: 'right' });
  [['THE UI/UX', 200], ['TOOLKIT.', 230]].forEach(([s, size], i) => txt(ctx, s, X0, top + 230 + i * 220, fit(ctx, s, size), { color: '#FFFFFF' }));
  txt(ctx, 'أدوات مصمّم UI/UX الأساسية', W - X0, top + 600, 70, { family: F.ar, align: 'right', rtl: true });
  TOOLS.forEach((x, i) => { const col = i % 3, row = Math.floor(i / 3), tw = 286, th = 170, tx = X0 + col * (tw + 31), ty = top + 690 + row * (th + 30); rr(ctx, tx, ty, tw, th, 20, '#FFFFFF'); drawImg(ctx, IMG[x.img], tx + tw / 2, ty + th / 2, tw * 0.7, th * 0.62); });
}

// ------------------------------------------------------------------ film
const FAST = [0, ...TOOLS.map((x) => x.b0), RECAP, END];
let GRAIN = null;
M.film({
  fonts: [`700 100px ${F.title}`, `600 40px ${F.mono}`, `700 60px ${F.ar}`],
  images: { figma: 'assets/figma.webp', figjam: 'assets/figjam.png', webaim: 'assets/webaim.png', vscode: 'assets/vscode.webp', chrome: 'assets/chrome.png', github: 'assets/github.png' },
  hits: HITS, shutter: 0.6,
  samples: (t) => { const u = t / B; return FAST.some((b) => u > b - 1.2 && u < b + 3.2) ? 8 : 3; },
  async init() {
    await document.fonts.load(`700 60px ${F.ar}`, 'أدوات التصميم').catch(() => {});
    GRAIN = document.createElement('canvas'); GRAIN.width = 540; GRAIN.height = 960;
    const g = GRAIN.getContext('2d'), img = g.createImageData(540, 960), rnd = M.mulberry32(9);
    for (let i = 0; i < img.data.length; i += 4) { const c = 225 + rnd() * 30; img.data[i] = img.data[i + 1] = img.data[i + 2] = c; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0);
  },
  draw(ctx, u, t, IMG) {
    ctx.save();
    if (COVER) { cover(ctx, IMG, COVER); ctx.restore(); return; }
    if (u < T0) hook(ctx, u, t);
    else if (u < RECAP) {
      const i = Math.min(5, Math.floor((u - T0) / SPAN)), x = TOOLS[i], v = u - x.b0;
      const scene = (j, vv) => { const y = TOOLS[j]; ctx.fillStyle = y.bg; ctx.fillRect(0, 0, W, H); [sFigma, sFigjam, sContrast, sVscode, sDevtools, sGithub][j](ctx, vv, y, IMG); };
      const dir = PUSH[i] || (i === 5 ? 'up' : null), pe = dir ? ez(v, SPAN - 0.9, SPAN, E.inOutCubic) : 0;
      if (pe > 0) {
        const dx = dir === 'left' ? -W : 0, dy = dir === 'up' ? -H : 0;
        ctx.save(); ctx.translate(dx * pe, dy * pe); scene(i, v); ctx.restore();
        ctx.save(); ctx.translate(dx * (pe - 1), dy * (pe - 1));
        if (i < 5) scene(i + 1, 0); else recap(ctx, 0, IMG);
        ctx.restore();
      } else scene(i, v);
    } else if (u < END) recap(ctx, u - RECAP, IMG);
    else endPage(ctx, u - END);
    ctx.restore();
    ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.05; ctx.drawImage(GRAIN, -Math.floor(hash01(Math.floor(t * 24), 1) * 30), 0, W + 30, H); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  },
});
