// The UI/UX toolkit — kinetic motion design test (8 s, 9:16).
// Flat color fields per tool, giant type revealed through masks, a shape that morphs (circle -> app
// window), a zoom THROUGH the selected frame into the next scene, springs, squash & stretch, real
// motion blur (sub-frame samples). New sound palette: whoosh, riser, sub, impact, boing, type.
import * as M from './lib/motion.js';

const { W, H, clamp, lerp, E, spring, TAU, hash01 } = M;
const B = 60 / 128;                                         // one beat in seconds
const C = { cream: '#F2EFE8', ink: '#121212', figma: '#FF4D2E', blue: '#1B5CFF', yellow: '#FFD400', white: '#FFFFFF', sel: '#0D99FF' };
const X0 = 80;

// ------------------------------------------------------------------ sound (beats)
const HITS = [];
const hit = (b, l, s, o) => HITS.push(o ? [b, l, s, o] : [b, l, s]);
hit(0, 'hook slam', 'thud', { pitch: 'A1' }); hit(0, 'hook whoosh', 'whoosh', { len: 0.35 });
hit(1.5, 'star tick', 'tok', { pitch: 'E5' }); hit(2.5, 'star tick', 'tok', { pitch: 'B5' });
hit(4, 'riser into wipe', 'riser', { len: 1.1 }); hit(4, 'circle wipe lands', 'impact');
hit(4.4, 'logo spring', 'pop', { pitch: 'C6' }); hit(4.8, 'FIGMA slides up', 'whoosh', { len: 0.3 });
hit(6, 'circle stretches into a window', 'boing', { pitch: 'C4', to: 'G4' });
[0, 1, 2, 3, 4].forEach((i) => hit(6.6 + i * 0.22, `layer ${i}`, 'blip', { pitch: ['E6', 'G6', 'A6', 'B6', 'D7'][i] }));
hit(8, 'selection', 'click');
hit(10, 'riser into zoom', 'riser', { len: 0.9 }); hit(10, 'zoom through', 'whoosh', { len: 0.5 }); hit(10, 'sub', 'sub');
hit(10.3, 'VS CODE swish', 'whoosh', { len: 0.25 }); hit(11.1, '</> lands', 'thud', { pitch: 'E2' }); hit(11.1, '</> tok', 'tok', { pitch: 'G5' });
hit(12, 'code typing', 'type', { n: 14, len: 1.6 }); hit(16, 'end click', 'click');

// ------------------------------------------------------------------ helpers
const at = (t, b) => (t - b * B);                           // seconds since beat b
const sp = (t, b, cfg) => (t < b * B ? 0 : spring(t - b * B, cfg));
const ease = (t, b0, b1, f = E.outExpo) => f(clamp((t - b0 * B) / ((b1 - b0) * B)));
function txt(ctx, s, x, y, size, { w = 900, color = C.ink, align = 'left', family = 'Arch', rtl = false, sx = 1, sy = 1 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(sx, sy);
  ctx.font = `${w} ${size}px ${family}`; ctx.fillStyle = color; ctx.textAlign = align; ctx.direction = rtl ? 'rtl' : 'ltr';
  ctx.fillText(s, 0, 0); ctx.restore();
}
// text that rises out of a mask (line reveal): p 0 -> 1
function maskUp(ctx, s, x, y, size, p, o = {}) {
  if (p <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(0, y - size * 0.95, W, size * 1.2); ctx.clip();
  txt(ctx, s, x, y + (1 - p) * size * 1.1, size, o); ctx.restore();
}
function measure(ctx, s, size, w = 900, family = 'Arch') { ctx.font = `${w} ${size}px ${family}`; return ctx.measureText(s).width; }
const fit = (ctx, s, max, maxW = W - 2 * X0) => Math.min(max, Math.floor(max * maxW / measure(ctx, s, max)));
function star(ctx, cx, cy, r, rot, color, n = 8) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.fillStyle = color; ctx.beginPath();
  for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * TAU, rr = i % 2 ? r * 0.42 : r; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  ctx.closePath(); ctx.fill(); ctx.restore();
}
function topline(ctx, color, label) {
  txt(ctx, 'LEARN UI/UX', X0, 120, 28, { w: 700, color });
  txt(ctx, 'AG STUDIO', W - X0, 120, 28, { w: 700, color, align: 'right' });
  if (label) txt(ctx, label, X0, 176, 28, { w: 700, color, family: 'Mono' });
}

// ------------------------------------------------------------------ scene 1: hook (0 -> 4 beats)
function hook(ctx, t, u) {
  ctx.fillStyle = C.cream; ctx.fillRect(0, 0, W, H);
  topline(ctx, C.ink);
  const lines = [['THE', 210, 720], ['UI/UX', 330, 1030], ['TOOLKIT.', 236, 1280]];
  lines.forEach(([s, size, y], i) => {
    const drift = (i % 2 ? -1 : 1) * u * 7, breathe = 1 + 0.035 * Math.sin(t * 3.2 + i);
    txt(ctx, s, X0 + drift, y, fit(ctx, s, size, (W - 2 * X0) / 1.04), { sx: breathe });
  });
  txt(ctx, 'أدوات مصمّم UI/UX الأساسية', W - X0, 1420, 66, { w: 700, family: 'Readex', align: 'right', rtl: true });
  txt(ctx, '6 TOOLS · DESIGN + DEV', X0, 1520, 40, { w: 700, family: 'Mono' });
  star(ctx, 860, 670, 120, t * 1.4, C.yellow);
  // the O of TOOLKIT becomes the circle that wipes into the Figma scene
  const ts = fit(ctx, 'TOOLKIT.', 236, (W - 2 * X0) / 1.04), oX = X0 + measure(ctx, 'T', ts) + measure(ctx, 'O', ts) / 2, oY = 1280 - ts * 0.36;
  const p = ease(t, 2.6, 4, E.inExpo);
  if (p > 0) { ctx.fillStyle = C.figma; ctx.beginPath(); ctx.arc(oX, oY, 70 + p * 2300, 0, TAU); ctx.fill(); }
}

// ------------------------------------------------------------------ scene 2: Figma (4 -> 10 beats)
const WIN = { cx: 540, cy: 760, w: 900, h: 600 };
const SELF = { x: 610, y: 140, w: 150, h: 266 };            // selected frame inside the window (window coords, centered)
function figma(ctx, t, u, IMG) {
  ctx.fillStyle = C.figma; ctx.fillRect(0, 0, W, H);
  // zoom THROUGH the selected (blue) frame at the end of the scene
  const z = ease(t, 8.9, 10, E.inCubic), S = lerp(1, 8.2, z);
  const fx = WIN.cx - WIN.w / 2 + SELF.x + SELF.w / 2, fy = WIN.cy - WIN.h / 2 + SELF.y + SELF.h / 2;
  ctx.save();
  if (z > 0) { const k = Math.min(1, z * 3); ctx.translate(W / 2, H / 2); ctx.scale(S, S); ctx.translate(-lerp(W / 2, fx, k), -lerp(H / 2, fy, k)); }
  topline(ctx, C.ink, '01 / 06');
  // circle (logo) -> app window morph
  const pop = sp(t, 4.2, { stiffness: 260, damping: 14 }), m = ease(t, 6, 7, E.inOutCubic), mS = sp(t, 6, { stiffness: 220, damping: 15 });
  const w = lerp(380, WIN.w, mS), h = lerp(380, WIN.h, mS), r = lerp(190, 26, m);
  ctx.save(); ctx.translate(WIN.cx, WIN.cy); ctx.scale(pop, pop);
  ctx.fillStyle = C.white; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, r); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, r); ctx.clip();
  if (m > 0.35) windowContent(ctx, t, -WIN.w / 2, -WIN.h / 2, clamp((m - 0.35) / 0.65), IMG);
  ctx.restore();
  // the logo: big in the circle, then flies to the window's title bar
  if (IMG.figma) {
    const im = IMG.figma, ls = lerp(200, 34, m), lx = lerp(0, -WIN.w / 2 + 40, m), ly = lerp(0, -WIN.h / 2 + 30, m), k = ls / Math.max(im.width, im.height);
    ctx.drawImage(im, lx - im.width * k / 2, ly - im.height * k / 2, im.width * k, im.height * k);
  }
  ctx.restore();
  maskUp(ctx, 'FIGMA', X0 - 8, 1360, fit(ctx, 'FIGMA', 270), ease(t, 4.6, 5.8), { color: C.white });
  maskUp(ctx, 'DESIGN · COMPONENTS · PROTOTYPES', X0, 1450, 38, ease(t, 5.2, 6.2), { w: 700, color: C.ink, family: 'Mono' });
  maskUp(ctx, 'تصميم الواجهات والمكوّنات والنماذج الأولية', W - X0, 1540, 50, ease(t, 5.6, 6.6), { w: 600, color: C.ink, family: 'Readex', align: 'right', rtl: true });
  ctx.restore();
}
function windowContent(ctx, t, x, y, p, IMG) {
  ctx.globalAlpha = p;
  ctx.fillStyle = '#F5F5F5'; ctx.fillRect(x, y, WIN.w, 60); ctx.fillStyle = '#E6E6E6'; ctx.fillRect(x, y + 60, WIN.w, 2);
  txt(ctx, 'Untitled · Home', x + 74, y + 40, 22, { w: 600, color: '#555' });
  ctx.fillStyle = '#FAFAFA'; ctx.fillRect(x, y + 62, 220, WIN.h - 62); ctx.fillStyle = '#E6E6E6'; ctx.fillRect(x + 220, y + 62, 2, WIN.h - 62);
  [0, 1, 2, 3, 4].forEach((i) => {
    const q = ease(t, 6.6 + i * 0.22, 7.2 + i * 0.22, E.outCubic);
    ctx.fillStyle = i === 3 ? C.sel : '#CFCFCF'; ctx.fillRect(x + 28 + (i % 2) * 18, y + 100 + i * 46, (120 - (i % 3) * 22) * q, 14);
  });
  ctx.fillStyle = '#ECECEC'; ctx.fillRect(x + 222, y + 62, WIN.w - 222, WIN.h - 62);
  // frames on the canvas
  [[270, 140, 150, 266, '#FFFFFF'], [440, 120, 150, 266, '#FFFFFF'], [SELF.x, SELF.y, SELF.w, SELF.h, C.blue]].forEach(([fx, fy, fw, fh, col], i) => {
    const yy = fy, q = ease(t, 7 + i * 0.3, 7.6 + i * 0.3, E.outBack);
    ctx.save(); ctx.translate(x + fx + fw / 2, y + yy + fh / 2); ctx.scale(q, q);
    ctx.fillStyle = col; ctx.fillRect(-fw / 2, -fh / 2, fw, fh); ctx.strokeStyle = '#D4D4D4'; ctx.lineWidth = 2; ctx.strokeRect(-fw / 2, -fh / 2, fw, fh);
    if (i < 2) { ctx.fillStyle = '#E3E3E3'; ctx.fillRect(-fw / 2 + 16, -fh / 2 + 20, fw - 32, 70); ctx.fillRect(-fw / 2 + 16, -fh / 2 + 104, fw - 60, 10); ctx.fillRect(-fw / 2 + 16, -fh / 2 + 124, fw - 80, 10); }
    else { ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fillRect(-fw / 2 + 16, -fh / 2 + 24, 60, 12); ctx.fillRect(-fw / 2 + 16, fh / 2 - 60, fw - 32, 36); }
    ctx.restore();
  });
  // selection box + handles on the blue frame
  const s = ease(t, 8, 8.4, E.outCubic);
  if (s > 0) {
    const sx = x + SELF.x, sy = y + SELF.y; ctx.globalAlpha = p * s; ctx.strokeStyle = C.sel; ctx.lineWidth = 3; ctx.strokeRect(sx - 4, sy - 4, SELF.w + 8, SELF.h + 8);
    ctx.fillStyle = C.white; [[sx - 4, sy - 4], [sx + SELF.w + 4, sy - 4], [sx - 4, sy + SELF.h + 4], [sx + SELF.w + 4, sy + SELF.h + 4]].forEach(([hx, hy]) => { ctx.fillRect(hx - 7, hy - 7, 14, 14); ctx.strokeRect(hx - 7, hy - 7, 14, 14); });
    txt(ctx, '390 × 844', sx + SELF.w / 2, sy + SELF.h + 40, 18, { w: 700, color: C.white, align: 'center' });
  }
  ctx.globalAlpha = 1;
}

// ------------------------------------------------------------------ scene 3: VS Code (10 -> 17 beats)
const CODE = ['<button class="cta">', '  Get started', '</button>'];
function vscode(ctx, t, u) {
  ctx.fillStyle = C.blue; ctx.fillRect(0, 0, W, H);
  topline(ctx, C.white, '04 / 06');
  // </> drops in with a spring, squashes on landing
  const d = sp(t, 10.4, { stiffness: 190, damping: 11 }), land = Math.max(0, d - 1);
  const y = lerp(-300, 720, d), squash = 1 + Math.min(0.25, land * 1.4);
  txt(ctx, '</>', W / 2, y, 330, { color: C.yellow, align: 'center', sx: squash, sy: 1 / squash });
  // VS CODE slides in from the right with overshoot
  const s = sp(t, 10.2, { stiffness: 210, damping: 16 });
  txt(ctx, 'VS CODE', lerp(W + 40, X0, s), 1080, fit(ctx, 'VS CODE', 230), { color: C.white, sx: 1 + Math.max(0, 1 - s) * 0.4 });
  maskUp(ctx, 'WRITE AND EDIT YOUR CODE.', X0, 1170, 40, ease(t, 11, 12), { w: 700, color: C.white, family: 'Mono' });
  maskUp(ctx, 'محرّر لكتابة الكود وتعديله.', W - X0, 1260, 54, ease(t, 11.4, 12.4), { w: 600, color: C.white, family: 'Readex', align: 'right', rtl: true });
  // code types in on a dark strip
  const ty = ease(t, 11.6, 12.2, E.outCubic);
  if (ty > 0) {
    ctx.fillStyle = '#0E1530'; ctx.fillRect(X0, 1340, (W - 2 * X0) * ty, 300);
    const chars = Math.floor(clamp(at(t, 12) / 1.6) * CODE.join('').length);
    let left = chars;
    CODE.forEach((l, i) => { const n = Math.max(0, Math.min(l.length, left)); left -= l.length; txt(ctx, l.slice(0, n), X0 + 40, 1420 + i * 76, 40, { w: 700, family: 'Mono', color: i === 1 ? '#E6EAF5' : C.yellow }); });
    if (Math.floor(t * 2.4) % 2 === 0) { ctx.fillStyle = C.white; ctx.fillRect(X0 + 40, 1600, 22, 4); }
  }
}

// ------------------------------------------------------------------ film
let GRAIN = null;
M.film({
  fonts: ['900 100px Arch', '700 40px Arch', '700 40px Mono', '700 60px Readex', '600 50px Readex'],
  images: { figma: 'assets/figma.webp' }, hits: HITS, samples: 8, shutter: 0.6,
  async init() {
    await Promise.all(['700 60px Readex', '600 50px Readex'].map((f) => document.fonts.load(f, 'أدوات التصميم').catch(() => {})));
    GRAIN = document.createElement('canvas'); GRAIN.width = 540; GRAIN.height = 960;
    const g = GRAIN.getContext('2d'), img = g.createImageData(540, 960), rnd = M.mulberry32(9);
    for (let i = 0; i < img.data.length; i += 4) { const v = 225 + rnd() * 30; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0);
  },
  draw(ctx, u, t, IMG) {
    ctx.save();
    if (u < 4) hook(ctx, t, u); else if (u < 10) figma(ctx, t, u, IMG); else vscode(ctx, t, u);
    ctx.restore();
    ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.12; ctx.drawImage(GRAIN, -Math.floor(hash01(Math.floor(t * 24), 1) * 30), 0, W + 30, H); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  },
});
