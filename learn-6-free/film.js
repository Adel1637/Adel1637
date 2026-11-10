// 6 free resources to learn UI/UX: pure function of time. window.seek(t) paints frame t.
// Timing in beats (u) on the 128 BPM grid in beats.json; docs/shotlist.md is the plan.
// AG Studio style comes from ../shared/ags.js. No music: SFX only (clicks, typing, small pops).
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';

const { W, H, E, prog, lerp, clamp, springU, springKeys, SPRING, font, rrect, fitSize } = M;
const A = makeAGS(M);
const { C, F } = A;

const COL = { x: 90, w: 840, cx: 510 };              // content column, clear of the right-hand buttons
const CARD = { x: 90, y: 384, w: 840, h: 820, r: 40 };
const B0 = 8, SPAN = 11;                            // resource i starts at B0 + i*SPAN
const RECAP = 74, END1 = 82, END2 = 90;

// ------------------------------------------------------------------ the six resources
// cam: [beat offset, [focus x, focus y (source px), zoom]]; regions are source-pixel rects.
const RES = [
  { key: 'laws', name: 'Laws of UX', logo: 'lawsLogo', full: true, img: 'laws',
    en: 'The psychology behind every good interface', hl: [1], ar: 'علم النفس وراء كل واجهة ناجحة',
    cam: [[0, [585, 585, 1]], [5.4, [585, 585, 1]], [6.4, [440, 585, 1.32]], [9.2, [585, 900, 1.0]]],
    ring: { at: 6.6, r: [140, 538, 600, 96] } },
  { key: 'nng', name: 'Nielsen Norman Group', logo: 'nngLogo', img: 'nng',
    en: 'UX rules backed by real research', hl: [4, 5], ar: 'قواعد UX مبنية على أبحاث حقيقية',
    cam: [[0, [430, 412, 1]], [5.4, [430, 412, 1]], [6.4, [430, 395, 1.08]], [10, [470, 420, 1.14]]],
    ring: { at: 6.6, r: [36, 336, 788, 112] } },
  { key: 'material', name: 'Material Design 3', label: 'Material\n3', img: 'material',
    en: "Google's design system for Android & web", hl: [1, 2], ar: 'نظام Google للتصميم على أندرويد والويب',
    cam: [[0, [585, 690, 1]], [8.4, [585, 690, 1]], [9.8, [585, 1250, 1]]],
    click: { at: 6.6, p: [459, 1083], from: [1040, 1600] } },
  { key: 'apple', name: 'Apple HIG', label: 'Apple\nHIG', img: 'apple',
    en: "Apple's official rules for iPhone apps", hl: [1, 2], ar: 'قواعد Apple الرسمية لتصميم تطبيقات iPhone',
    cam: [[0, [585, 585, 1]], [7.8, [585, 585, 1]], [9.4, [585, 1150, 1]]],
    ring: { at: 6.2, r: [58, 398, 830, 236] } },
  { key: 'webaim', name: 'WebAIM Contrast Checker', logo: 'webaimLogo', img: 'webaim',
    en: 'Check if your text is easy to read', hl: [5, 6, 7], ar: 'تأكّد أن نصوصك سهلة القراءة',
    cam: [[0, [570, 585, 1]], [5.2, [570, 585, 1]], [6.6, [555, 1980, 1.22]]],
    ring: { at: 7.0, r: [280, 1924, 550, 330] }, result: { at: 7.9, label: 'WCAG AAA', above: true } },
  { key: 'figma', name: 'Figma', logo: 'figmaLogo', img: 'figma',
    en: 'Even the design tool is free to start', hl: [5], ar: 'حتى أداة التصميم نفسها مجانية للبدء',
    cam: [[0, [585, 585, 1]]],
    click: { at: 6.6, p: [710, 108], from: [1040, 1300] }, result: { at: 7.4, label: 'Free plan', near: true } },
];
const TILE_NAMES = ['Laws of UX', 'NN/g', 'Material 3', 'Apple HIG', 'WebAIM', 'Figma'];

// ------------------------------------------------------------------ hits (every accent has a sound)
const HITS = [];
const hit = (b, label, sfx, o) => HITS.push(o ? [b, label, sfx, o] : [b, label, sfx]);
// hook
hit(0, 'kicker', 'pop', { pitch: 'E6' });
[0, 0.5, 1].forEach((b, i) => hit(b, `title word ${i + 1}`, 'pop', { pitch: ['A5', 'C#6', 'E6'][i] }));
hit(1.6, 'highlighter on free', 'type', { n: 4, len: 0.35 });
[2, 2.5, 3].forEach((b, i) => hit(b, `line 2 word ${i + 1}`, 'pop', { pitch: ['A5', 'B5', 'E6'][i] }));
hit(3.6, 'arabic line', 'tick');
for (let i = 0; i < 6; i++) hit(4.5 + i * 0.25, `tile ${i + 1}`, 'pop', { pitch: ['A5', 'B5', 'C#6', 'E6', 'F#6', 'A6'][i] });
hit(6.9, 'tile 1 tapped', 'click');
// resources
RES.forEach((r, i) => {
  const b = B0 + i * SPAN;
  if (i > 0) hit(b - 0.25, `slide to ${r.key}`, 'click');
  hit(b + 0.2, `${r.key} tile`, 'pop', { pitch: 'C#6' });
  hit(b + 0.6, `${r.key} FREE pill`, 'blip', { pitch: 'A6' });
  hit(b + 1.0, `${r.key} capture lands`, 'tick');
  hit(b + 2.6, `${r.key} EN line`, 'type', { n: 6, len: 0.9 });
  hit(b + 3.8, `${r.key} AR line`, 'tick');
  if (r.ring) hit(b + r.ring.at, `${r.key} focus ring`, 'tick');
  if (r.click) hit(b + r.click.at, `${r.key} click`, 'click');
  if (r.result) hit(b + r.result.at, `${r.key} result pill`, 'bell', { pitch: 'E6' });
});
// recap + end
hit(RECAP - 0.6, 'circle to recap', 'click');
hit(RECAP + 0.6, 'recap title', 'pop', { pitch: 'A5' });
for (let i = 0; i < 6; i++) hit(RECAP + 1.5 + i * 0.5, `recap tile ${i + 1}`, 'pop', { pitch: ['A5', 'B5', 'C#6', 'E6', 'F#6', 'A6'][i] });
for (let i = 0; i < 6; i++) hit(RECAP + 2 + i * 0.5, `recap check ${i + 1}`, 'blip', { pitch: 'E7' });
hit(END1 - 0.8, 'circle to end', 'click');
hit(END1 + 0.1, 'keep it simple', 'pop', { pitch: 'A5' });
hit(END1 + 1.1, 'arabic end', 'tick');
hit(END2 + 0.1, 'logo', 'bell', { pitch: 'A6' });
hit(END2 + 0.6, 'follow', 'pop', { pitch: 'E6' });

// ------------------------------------------------------------------ helpers
const ease = E.inOutCubic;
// horizontal track: resource panels sit side by side and slide as one strip (both on screen mid-move)
function trackX(u) {
  let k = 0;
  for (let i = 1; i < RES.length; i++) k += ease(prog(u, B0 + i * SPAN - 0.5, B0 + i * SPAN + 0.3));
  return -W * k;
}
// camera view of a tall screenshot inside the card
function view(img, cam, u, b) {
  const [fx, fy, z] = springKeys(u, cam.map(([v, k]) => [b + v, k]), SPRING.gentle);
  const s0 = Math.max(CARD.w / img.width, CARD.h / img.height), s = s0 * z;
  const vw = CARD.w / s, vh = CARD.h / s;
  const ox = clamp(fx - vw / 2, 0, Math.max(0, img.width - vw));
  const oy = clamp(fy - vh / 2, 0, Math.max(0, img.height - vh));
  return { s, ox, oy, map: (px, py) => [CARD.x + (px - ox) * s, CARD.y + (py - oy) * s] };
}

// ------------------------------------------------------------------ hook (u 0..8)
function hook(ctx, u, IMG) {
  const cx = COL.cx;
  A.pill(ctx, 'LEARN UI/UX', cx, 494, { bg: C.ink, size: 26, align: 'center', mono: true, p: springU(u, -0.3, SPRING.bouncy) });
  const f = font(104, 800, F.latin);
  A.riseWords(ctx, u, -0.3, '6 free resources', { x: cx, y: 700, f, size: 104, align: 'center', stagger: 0.5, hl: [1], hlAt: 1.5 });
  A.riseWords(ctx, u, 1.8, 'to learn UI/UX', { x: cx, y: 825, f, size: 104, align: 'center', stagger: 0.5 });
  A.arabic(ctx, u, 3.5, '٦ مصادر مجانية لتعلّم UI/UX', { x: cx, y: 955, size: 62, weight: 700 });
  const s = 120, gap = 24, x0 = cx - (6 * s + 5 * gap) / 2;
  RES.forEach((r, i) => {
    let p = springU(u, 4.4 + i * 0.25, SPRING.bouncy);
    if (i === 0) p *= 1 - 0.1 * M.bump(u, 7.0, 0.3);
    A.tile(ctx, x0 + i * (s + gap), 1090, s, { img: r.logo ? IMG[r.logo] : null, full: r.full, label: r.label, p });
  });
  const t1 = [x0 + s / 2, 1090 + s / 2];
  if (u > 6.9) A.cursor(ctx, t1[0] + 10, t1[1] + 10, { press: M.bump(u, 7.0, 0.25), alpha: 1 - prog(u, 7.4, 7.6) });
  A.ripple(ctx, t1[0], t1[1], prog(u, 7.0, 7.6));
}

// ------------------------------------------------------------------ one resource panel
function panel(ctx, u, i, IMG, dx) {
  const r = RES[i], b = B0 + i * SPAN, img = IMG[r.img];
  ctx.save(); ctx.translate(dx, 0);
  // header: tile, counter + FREE pill, name
  A.tile(ctx, COL.x, 206, 130, { img: r.logo ? IMG[r.logo] : null, full: r.full, label: r.label, p: springU(u, b + 0.1, SPRING.bouncy) });
  const kp = springU(u, b + 0.5, SPRING.snappy);
  if (kp > 0) {
    ctx.save(); ctx.globalAlpha = clamp(kp);
    ctx.font = font(28, 700, F.mono); ctx.fillStyle = 'rgba(14,23,38,0.55)'; ctx.textAlign = 'left';
    ctx.fillText(`0${i + 1} / 06`, 254, 246 + (1 - kp) * 20);
    ctx.restore();
  }
  A.pill(ctx, 'FREE', 420, 214, { bg: C.green, size: 24, p: springU(u, b + 0.6, SPRING.bouncy) });
  ctx.font = font(58, 800, F.latin);
  const ns = Math.min(58, Math.floor(58 * 660 / ctx.measureText(r.name).width));
  A.riseWords(ctx, u, b + 0.35, r.name, { x: 252, y: 318, f: font(ns, 800, F.latin), size: ns, stagger: 0.08 });

  // capture card
  const cp = springU(u, b + 0.9, SPRING.gentle);
  if (cp > 0 && img) {
    const lift = (1 - cp) * 300;
    ctx.save(); ctx.translate(0, lift); ctx.globalAlpha = clamp(cp * 1.6);
    A.shadow(ctx, 60, 26, 0.16);
    rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.fillStyle = C.white; ctx.fill(); A.noShadow(ctx);
    const V = view(img, r.cam, u, b);
    ctx.save(); rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.clip();
    ctx.drawImage(img, -V.ox * V.s + CARD.x, -V.oy * V.s + CARD.y, img.width * V.s, img.height * V.s);
    if (r.ring) {
      const [x1, y1] = V.map(r.ring.r[0], r.ring.r[1]), [x2, y2] = V.map(r.ring.r[0] + r.ring.r[2], r.ring.r[1] + r.ring.r[3]);
      A.focusRing(ctx, x1, y1, x2 - x1, y2 - y1, prog(u, b + r.ring.at, b + r.ring.at + 0.9), { r: 22 });
    }
    if (r.click) {
      const [bx, by] = V.map(...r.click.p);
      A.ripple(ctx, bx, by, prog(u, b + r.click.at, b + r.click.at + 0.7));
    }
    ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(14,23,38,0.10)'; rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.stroke();
    if (r.click) {
      const [bx, by] = V.map(...r.click.p);
      const ca = b + r.click.at;
      const m = ease(prog(u, ca - 1.6, ca - 0.15));
      const x = lerp(r.click.from[0], bx, m), y = lerp(r.click.from[1], by, m) - Math.sin(Math.PI * m) * 60;
      if (u > ca - 1.7) A.cursor(ctx, x, y, { press: M.bump(u, ca, 0.3), alpha: 1 - prog(u, ca + 2.2, ca + 2.6) });
      if (r.result) A.pill(ctx, r.result.label, bx, by + 70, { bg: C.green, size: 34, check: true, align: 'center', p: springU(u, b + r.result.at, SPRING.bouncy) });
    } else if (r.result) {
      const [, ry] = V.map(0, r.ring.r[1]);
      A.pill(ctx, r.result.label, COL.cx, ry - 34, { bg: C.green, size: 40, check: true, align: 'center', p: springU(u, b + r.result.at, SPRING.bouncy) });
    }
    ctx.restore();
  }

  // English line (highlighter) + Arabic line
  const ef = font(52, 800, F.latin);
  const res = A.riseWords(ctx, u, b + 2.6, r.en, { x: COL.cx, y: 1296, f: ef, size: 52, maxW: COL.w, align: 'center', stagger: 0.12, hl: r.hl, hlAt: b + 4.2, lineH: 1.18 });
  A.arabic(ctx, u, b + 3.8, r.ar, { x: COL.cx, y: res.bottom + 84, size: 44, weight: 600, color: 'rgba(14,23,38,0.82)' });
  ctx.restore();
}

// ------------------------------------------------------------------ recap (u 74..82)
function recap(ctx, u, IMG) {
  const cx = COL.cx;
  A.riseWords(ctx, u, RECAP + 0.5, 'Save this list', { x: cx, y: 470, f: font(96, 800, F.latin), size: 96, align: 'center', stagger: 0.3, hl: [0], hlAt: RECAP + 1.2 });
  A.arabic(ctx, u, RECAP + 1.0, 'احفظ هذه القائمة', { x: cx, y: 585, size: 56, weight: 700 });
  const s = 180, gx = 268, gy = 330;
  RES.forEach((r, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = cx + (col - 1) * gx - s / 2, y = 700 + row * gy;
    const p = springU(u, RECAP + 1.4 + i * 0.5, SPRING.bouncy);
    A.tile(ctx, x, y, s, { img: r.logo ? IMG[r.logo] : null, full: r.full, label: r.label, p });
    if (p > 0.05) {
      ctx.save(); ctx.globalAlpha = clamp(p);
      ctx.font = font(30, 700, F.latin); ctx.fillStyle = C.ink; ctx.textAlign = 'center';
      ctx.fillText(TILE_NAMES[i], x + s / 2, y + s + 48);
      ctx.restore();
    }
    const c = springU(u, RECAP + 2 + i * 0.5, SPRING.bouncy);
    if (c > 0) {
      const ccx = x + s - 8, ccy = y + 8, rr = 26 * c;
      ctx.save(); ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(ccx, ccy, rr, 0, M.TAU); ctx.fill();
      ctx.strokeStyle = C.white; ctx.lineWidth = 6 * c; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(ccx - 10 * c, ccy); ctx.lineTo(ccx - 3 * c, ccy + 8 * c); ctx.lineTo(ccx + 11 * c, ccy - 8 * c); ctx.stroke();
      ctx.restore();
    }
  });
  const np = springU(u, RECAP + 5.2, SPRING.gentle);
  if (np > 0) {
    ctx.save(); ctx.globalAlpha = clamp(np) * 0.6;
    ctx.font = font(26, 600, F.mono); ctx.fillStyle = C.ink; ctx.textAlign = 'center';
    ctx.fillText('Not sponsored · ليس إعلانًا', cx, 1440 + (1 - np) * 20);
    ctx.restore();
  }
}

// ------------------------------------------------------------------ film
M.film({
  fonts: [font(100, 800, F.latin), font(40, 600, F.arabic), font(40, 700, F.arabic), font(28, 700, F.mono)],
  images: {
    agLogo: '../shared/brand/ag-studio-logo.png',
    lawsLogo: 'assets/logos/laws-of-ux.png', nngLogo: 'assets/logos/nngroup.png',
    webaimLogo: 'assets/logos/webaim.png', figmaLogo: 'assets/logos/figma.webp',
    laws: 'assets/shots/01-laws-of-ux.jpg', nng: 'assets/shots/02-nngroup.jpg', material: 'assets/shots/03-material.jpg',
    apple: 'assets/shots/04-apple-hig.png', webaim: 'assets/shots/05-webaim-contrast.jpg', figma: 'assets/shots/06-figma.jpg',
  },
  hits: HITS,
  draw(ctx, u, t, IMG) {
    if (u < END1) {
      A.paper(ctx);
      if (u < 8.7) hook(ctx, u, IMG);
      if (u >= 7.8 && u < RECAP + 0.8) {
        const tx = trackX(u);
        for (let i = 0; i < RES.length; i++) {
          const dx = i * W + tx;
          if (dx > -W && dx < W) panel(ctx, u, i, IMG, dx);
        }
      }
      if (u >= RECAP - 0.2) recap(ctx, u, IMG);
      A.brand(ctx, IMG.agLogo);
      // blue circle: hook -> resource 1
      const t1 = [COL.cx - (6 * 120 + 5 * 24) / 2 + 60, 1150];
      if (u >= 7.0 && u < 7.9) A.circleCover(ctx, t1[0], t1[1], prog(u, 7.05, 7.9));
      if (u >= 7.9 && u < 8.7) A.circleOpen(ctx, prog(u, 7.9, 8.7));
      // blue circle: Figma click -> recap
      const fb = IMG.figma ? view(IMG.figma, RES[5].cam, u, B0 + 5 * SPAN).map(710, 108) : [W / 2, H / 2];
      if (u >= RECAP - 0.8 && u < RECAP) A.circleCover(ctx, fb[0], fb[1], prog(u, RECAP - 0.8, RECAP - 0.05));
      if (u >= RECAP && u < RECAP + 0.8) A.circleOpen(ctx, prog(u, RECAP, RECAP + 0.8));
      // blue circle: recap -> end (stays blue)
      if (u >= END1 - 0.9) A.circleCover(ctx, COL.cx, 1000, prog(u, END1 - 0.9, END1 - 0.02));
    } else {
      A.paper(ctx, C.blue);
      A.brand(ctx, IMG.agLogo, { color: C.white });
      if (u < END2) A.endKeep(ctx, u, END1 + 0.1, { exitAt: END2 - 0.45 });
      else A.endFollow(ctx, u, END2 + 0.1, IMG.agLogo);
    }
  },
});
