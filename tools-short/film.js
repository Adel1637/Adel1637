// The UI/UX toolkit — "sketchbook" style frame (style test before production).
// Lined notebook paper, handwriting (Caveat / Kalam, Arabic in Ruqaa), pencil strokes that overshoot
// their corners, red felt-pen annotations, real logos taped in like cut-outs. Nothing rounded or glossy.
import * as M from './lib/motion.js';

const { W, H, clamp, hash01, mulberry32, TAU } = M;
const PAPER = '#F3EEE3', INK = '#1E2A44', PENCIL = '#5B5F66', RED = '#D23A2E', HL = '#FFE066', RULE = '#B9CBE4', MARGIN = '#E29A92';

// ------------------------------------------------------------------ hand-drawn primitives
let GRAIN = null;
function wob(seed, i, amp) { return (hash01(seed, i) - 0.5) * 2 * amp; }
// a pencil line: 2 passes, slight bow + jitter, overshoot at both ends; p = drawn fraction
function line(ctx, x1, y1, x2, y2, { seed = 1, color = PENCIL, w = 3, p = 1, over = 10, passes = 2, alpha = 0.9 } = {}) {
  if (p <= 0) return;
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const ax = x1 - ux * over * hash01(seed, 1), ay = y1 - uy * over * hash01(seed, 1);
  const bx = x2 + ux * over * hash01(seed, 2), by = y2 + uy * over * hash01(seed, 2);
  ctx.save(); ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let k = 0; k < passes; k++) {
    const bow = wob(seed, 10 + k, Math.min(8, L * 0.012)), n = Math.max(6, Math.round(L / 30));
    ctx.globalAlpha = alpha * (k ? 0.55 : 1); ctx.lineWidth = w * (k ? 0.7 : 1);
    ctx.beginPath();
    const steps = Math.max(1, Math.round(n * p));
    for (let i = 0; i <= steps; i++) {
      const s = (i / n), b = Math.sin(Math.PI * s) * bow, j = wob(seed + k * 7, 20 + i, 1.2);
      const x = ax + (bx - ax) * s + nx * (b + j), y = ay + (by - ay) * s + ny * (b + j);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}
function rect(ctx, x, y, w, h, o = {}) {
  const s = o.seed || 1, p = o.p ?? 1;
  [[x, y, x + w, y], [x + w, y, x + w, y + h], [x + w, y + h, x, y + h], [x, y + h, x, y]].forEach(([a, b, c, d], i) =>
    line(ctx, a, b, c, d, { ...o, seed: s * 4 + i, p: clamp(p * 4 - i) }));
}
// red felt-pen loop around something (not a perfect ellipse: starts and ends apart)
function loop(ctx, cx, cy, rx, ry, { seed = 3, p = 1, color = RED, w = 6 } = {}) {
  if (p <= 0) return;
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.globalAlpha = 0.92; ctx.beginPath();
  const a0 = -2.2 + wob(seed, 1, 0.2), span = TAU * 1.08 * p, n = 80;
  for (let i = 0; i <= n; i++) {
    const a = a0 + span * (i / n), r = 1 + 0.05 * Math.sin(a * 2 + seed) + 0.04 * (i / n);
    const x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke(); ctx.restore();
}
function arrow(ctx, x1, y1, x2, y2, o = {}) {
  const c = { color: RED, w: 5, over: 0, passes: 1, ...o };
  line(ctx, x1, y1, x2, y2, c);
  if ((o.p ?? 1) < 1) return;
  const a = Math.atan2(y2 - y1, x2 - x1);
  [0.5, -0.5].forEach((d, i) => line(ctx, x2, y2, x2 - 34 * Math.cos(a + d), y2 - 34 * Math.sin(a + d), { ...c, seed: (o.seed || 1) + 9 + i }));
}
// yellow highlighter swipe behind a word
function highlight(ctx, x, y, w, h, { seed = 5, p = 1 } = {}) {
  if (p <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = HL; ctx.globalAlpha = 0.85;
  ctx.beginPath(); const ww = w * p;
  ctx.moveTo(x - 6, y + wob(seed, 1, 5)); ctx.lineTo(x + ww, y + wob(seed, 2, 6)); ctx.lineTo(x + ww + 8, y + h + wob(seed, 3, 5)); ctx.lineTo(x + 4, y + h + wob(seed, 4, 6));
  ctx.closePath(); ctx.fill(); ctx.restore();
}
// masking tape strip
function tape(ctx, cx, cy, w, rot, seed) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  ctx.fillStyle = 'rgba(236,226,196,0.82)'; ctx.beginPath();
  ctx.moveTo(-w / 2, -18); for (let i = 0; i <= 6; i++) ctx.lineTo(-w / 2 + (w * i) / 6, -18 + wob(seed, i, 1.5));
  ctx.lineTo(w / 2 + wob(seed, 9, 3), 0); ctx.lineTo(w / 2, 18);
  for (let i = 6; i >= 0; i--) ctx.lineTo(-w / 2 + (w * i) / 6, 18 + wob(seed, 20 + i, 1.5));
  ctx.lineTo(-w / 2 + wob(seed, 30, 3), 0); ctx.closePath(); ctx.fill(); ctx.restore();
}
function text(ctx, s, x, y, font, color = INK, align = 'left', rtl = false, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.direction = rtl ? 'rtl' : 'ltr';
  ctx.fillText(s, 0, 0); ctx.restore();
}
function paper(ctx) {
  ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = RULE; for (let y = 300; y < H - 60; y += 66) ctx.fillRect(0, y, W, 2);
  ctx.fillStyle = MARGIN; ctx.fillRect(118, 0, 2, H); ctx.fillRect(124, 0, 1.5, H);
}

// ------------------------------------------------------------------ style frame
function frame(ctx, u, t, IMG) {
  paper(ctx);
  text(ctx, 'Learn UI/UX', 150, 150, '700 40px Kalam', PENCIL, 'left', false, -0.015);
  text(ctx, 'AG Studio', 1010, 150, '700 40px Kalam', PENCIL, 'right', false, 0.01);
  line(ctx, 150, 176, 1010, 172, { seed: 2, w: 2.5 });
  // title
  highlight(ctx, 150, 392, 470, 92, { seed: 7 });
  text(ctx, 'The UI/UX', 150, 340, '700 168px Hand', INK, 'left', false, -0.02);
  text(ctx, 'toolkit.', 150, 486, '700 168px Hand', INK, 'left', false, -0.02);
  text(ctx, 'أدوات مصمّم UI/UX الأساسية', 1010, 600, '700 72px Ruqaa', INK, 'right', true);
  text(ctx, 'Design side & dev side.', 150, 690, '400 46px Kalam', INK);
  text(ctx, 'جانب التصميم وجانب التطوير.', 1010, 760, '400 52px Ruqaa', INK, 'right', true);
  // two columns
  line(ctx, 545, 860, 540, 1720, { seed: 31, w: 3 });
  text(ctx, 'DESIGN', 170, 900, '700 54px Kalam', INK); line(ctx, 170, 916, 380, 912, { seed: 33, color: INK, w: 3.5 });
  text(ctx, 'DEV', 600, 900, '700 54px Kalam', INK); line(ctx, 600, 916, 720, 913, { seed: 34, color: INK, w: 3.5 });
  // design: taped logo cut-out + sketched frames
  ctx.save(); ctx.translate(300, 1080); ctx.rotate(-0.05);
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-120, -95, 240, 190);
  if (IMG.figma) { const im = IMG.figma, s = Math.min(180 / im.width, 130 / im.height); ctx.drawImage(im, -im.width * s / 2, -im.height * s / 2, im.width * s, im.height * s); }
  ctx.restore();
  tape(ctx, 230, 990, 120, -0.35, 4); tape(ctx, 380, 1170, 120, -0.3, 5);
  loop(ctx, 300, 1080, 175, 135, { seed: 6 });
  text(ctx, 'start here', 330, 1290, '700 44px Hand', RED, 'left', false, -0.06);
  arrow(ctx, 320, 1270, 250, 1200, { seed: 12 });
  rect(ctx, 180, 1360, 300, 120, { seed: 41 }); text(ctx, 'FigJam / flows', 200, 1432, '400 40px Kalam', INK);
  rect(ctx, 180, 1520, 300, 120, { seed: 43 }); text(ctx, 'Contrast check', 200, 1592, '400 40px Kalam', INK);
  // dev: a sketched code editor + devtools
  rect(ctx, 600, 960, 380, 260, { seed: 51 });
  line(ctx, 600, 1004, 980, 1004, { seed: 52, w: 2.5 });
  [0, 1, 2].forEach((i) => { ctx.strokeStyle = PENCIL; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(624 + i * 26, 982, 7, 0, TAU); ctx.stroke(); });
  text(ctx, '</>', 790, 1130, '700 96px Kalam', INK, 'center');
  text(ctx, 'VS Code', 610, 1280, '400 44px Kalam', INK);
  rect(ctx, 600, 1360, 380, 120, { seed: 53 }); text(ctx, 'DevTools', 620, 1432, '400 40px Kalam', INK);
  rect(ctx, 600, 1520, 380, 120, { seed: 55 }); text(ctx, 'GitHub', 620, 1592, '400 40px Kalam', INK);
  text(ctx, 'test on a phone!', 640, 1700, '700 42px Hand', RED, 'left', false, 0.03);
  // paper grain
  ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.35; ctx.drawImage(GRAIN, 0, 0, W, H); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}

M.film({
  fonts: ['700 100px Hand', '400 40px Kalam', '700 40px Kalam', '700 60px Ruqaa', '400 60px Ruqaa'],
  images: { figma: 'assets/figma.webp' }, hits: [[0, 'page', 'tick']], samples: 4,
  async init() {
    await Promise.all(['700 60px Ruqaa', '400 60px Ruqaa'].map((f) => document.fonts.load(f, 'أدوات التصميم').catch(() => {})));
    GRAIN = document.createElement('canvas'); GRAIN.width = 540; GRAIN.height = 960;
    const g = GRAIN.getContext('2d'), img = g.createImageData(540, 960), rnd = mulberry32(77);
    for (let i = 0; i < img.data.length; i += 4) { const v = 215 + rnd() * 40; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0);
  },
  draw(ctx, u, t, IMG) { frame(ctx, u, t, IMG); },
});
