// 6 free resources to learn UI/UX: pure function of time. window.seek(t) paints frame t.
// Timing in beats (u) on the 128 BPM grid in beats.json; docs/shotlist.md is the plan.
// Style matched to the published AG Studio Shorts via ../shared/ags.js. No music: SFX only.
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';

const { E, prog, lerp, clamp, springU, springKeys, SPRING, font, rrect } = M;
const A = makeAGS(M);
const { C, F, L } = A;

const FRAME = { x: 142, y: 752, w: 796, h: 760 };          // selection frame
const CARD = { x: 162, y: 772, w: 756, h: 720, r: 32 };    // the UI card inside it
const B0 = 8, SPAN = 11, RECAP = 74, END = 82;
const SERIES = 'Learn UI/UX';

// ------------------------------------------------------------------ content
const HOOK = {
  title: '6 free resources to learn UI/UX.', hl: [1],
  ar: '٦ مصادر مجانية لتعلّم UI/UX',
  en2: 'Beginner-friendly. Save it for later.', ar2: 'مناسبة للمبتدئين. احفظها لوقت لاحق.',
};
// cam: [beat offset, [focus x, focus y (source px), zoom]]; regions are source-pixel rects.
const RES = [
  { key: 'laws', name: 'Laws of UX', logo: 'lawsLogo', full: true, img: 'laws', site: 'lawsofux.com',
    ar: 'قوانين تجربة المستخدم', en2: 'The psychology behind every good interface.', ar2: 'علم النفس وراء كل واجهة ناجحة.',
    cam: [[0, [585, 560, 1]], [5.4, [585, 560, 1]], [6.4, [440, 585, 1.3]], [9.2, [585, 900, 1.0]]],
    ring: { at: 6.6, r: [140, 538, 600, 96] } },
  { key: 'nng', name: 'Nielsen Norman Group', logo: 'nngLogo', img: 'nng', site: 'nngroup.com',
    ar: 'أبحاث تجربة المستخدم', en2: 'UX rules backed by real research.', ar2: 'قواعد UX مبنية على أبحاث حقيقية.',
    cam: [[0, [420, 412, 1]], [5.4, [420, 412, 1]], [6.4, [430, 395, 1.06]], [10, [470, 420, 1.12]]],
    ring: { at: 6.6, r: [36, 336, 788, 112] } },
  { key: 'material', name: 'Material Design 3', label: 'Material\n3', img: 'material', site: 'm3.material.io',
    ar: 'نظام التصميم من Google', en2: "Google's design system for Android and web.", ar2: 'نظام Google للتصميم على أندرويد والويب.',
    cam: [[0, [585, 690, 1]], [8.4, [585, 690, 1]], [9.8, [585, 1250, 1]]],
    click: { at: 6.6, p: [459, 1083], from: [960, 1560] } },
  { key: 'apple', name: 'Apple HIG', label: 'Apple\nHIG', img: 'apple', site: 'developer.apple.com/design',
    ar: 'إرشادات Apple للواجهات', en2: "Apple's official rules for iPhone apps.", ar2: 'قواعد Apple الرسمية لتصميم تطبيقات iPhone.',
    cam: [[0, [585, 585, 1]], [7.8, [585, 585, 1]], [9.4, [585, 1150, 1]]],
    ring: { at: 6.2, r: [58, 398, 830, 236] } },
  { key: 'webaim', name: 'WebAIM Contrast Checker', logo: 'webaimLogo', img: 'webaim', site: 'webaim.org',
    ar: 'فاحص تباين الألوان', en2: 'Check if your text is easy to read.', ar2: 'تأكّد أن نصوصك سهلة القراءة.',
    cam: [[0, [570, 585, 1]], [5.2, [570, 585, 1]], [6.6, [555, 1990, 1.2]]],
    ring: { at: 7.0, r: [280, 1924, 550, 330] }, result: { at: 7.9, label: 'WCAG AAA' } },
  { key: 'figma', name: 'Figma', logo: 'figmaLogo', img: 'figma', site: 'figma.com',
    ar: 'أداة التصميم', en2: 'Even the design tool is free to start.', ar2: 'حتى أداة التصميم نفسها مجانية للبدء.',
    cam: [[0, [585, 560, 1]]],
    click: { at: 6.6, p: [710, 108], from: [960, 1400] }, result: { at: 7.4, label: 'Free plan' } },
];
const RECAP_TXT = {
  title: 'Save this list.', hl: [0], ar: 'احفظ هذه القائمة.',
  en2: 'All free. Not sponsored.', ar2: 'كلها مجانية. بدون رعاية.',
};
const TILE_NAMES = ['Laws of UX', 'NN/g', 'Material 3', 'Apple HIG', 'WebAIM', 'Figma'];

// ------------------------------------------------------------------ hits (every accent has a sound)
const HITS = [];
const hit = (b, label, sfx, o) => HITS.push(o ? [b, label, sfx, o] : [b, label, sfx]);
hit(0, 'title', 'type', { n: 8, len: 0.9 });
hit(1.4, 'highlighter on free', 'tick');
hit(1.8, 'arabic title', 'pop', { pitch: 'C#6' });
hit(2.6, 'grey lines', 'tick');
hit(3.2, 'frame drawn', 'click');
for (let i = 0; i < 6; i++) hit(4.2 + i * 0.4, `tile ${i + 1}`, 'pop', { pitch: ['A5', 'B5', 'C#6', 'E6', 'F#6', 'A6'][i] });
RES.forEach((r, i) => {
  const b = B0 + i * SPAN;
  hit(b - 0.1, `${r.key} badge`, 'pop', { pitch: 'E6' });
  hit(b + 0.1, `${r.key} title`, 'type', { n: 5, len: 0.5 });
  hit(b + 0.4, `${r.key} capture slides in`, 'click');
  hit(b + 0.6, `${r.key} arabic title`, 'tick');
  if (r.ring) hit(b + r.ring.at, `${r.key} selection`, 'click');
  if (r.click) hit(b + r.click.at, `${r.key} click`, 'click');
  if (r.result) hit(b + r.result.at, `${r.key} result pill`, 'bell', { pitch: 'E6' });
});
hit(RECAP, 'recap title', 'type', { n: 5, len: 0.5 });
hit(RECAP + 0.6, 'recap arabic', 'tick');
for (let i = 0; i < 6; i++) hit(RECAP + 1.6 + i * 0.4, `recap check ${i + 1}`, 'blip', { pitch: 'E7' });
hit(END - 0.9, 'circle to end', 'click');
hit(END + 0.1, 'keep it', 'pop', { pitch: 'A5' });
hit(END + 0.6, 'simple', 'pop', { pitch: 'E6' });
hit(END + 2.2, 'follow pill', 'pop', { pitch: 'A6' });

// ------------------------------------------------------------------ helpers
const ease = E.inOutCubic;
function view(img, cam, u, b) {
  const [fx, fy, z] = springKeys(u, cam.map(([v, k]) => [b + v, k]), SPRING.gentle);
  const s = Math.max(CARD.w / img.width, CARD.h / img.height) * z;
  const vw = CARD.w / s, vh = CARD.h / s;
  const ox = clamp(fx - vw / 2, 0, Math.max(0, img.width - vw));
  const oy = clamp(fy - vh / 2, 0, Math.max(0, img.height - vh));
  return { s, ox, oy, map: (px, py) => [CARD.x + (px - ox) * s, CARD.y + (py - oy) * s] };
}
function fitTitle(ctx, str, maxW, max = 74) {
  ctx.font = font(max, 800, F.latin); ctx.letterSpacing = `${-0.035 * max}px`;
  const w = ctx.measureText(str).width; ctx.letterSpacing = '0px';
  return Math.min(max, Math.floor(max * maxW / w));
}

// text block: title (+badge) · Arabic title (blue, right) · grey EN (left) · grey AR (right)
function textBlock(ctx, u, b, exit, d) {
  const hasBadge = d.n != null;
  const tx = hasBadge ? L.left + 100 : L.left;
  const size = hasBadge ? fitTitle(ctx, d.title, L.right - tx) : 74;
  if (hasBadge) {
    const bp = springU(u, b - 0.15, SPRING.bouncy) * (1 - E.inCubic(prog(u, exit, exit + 0.4)));
    A.badge(ctx, d.n, L.left, 330, bp);
  }
  const t = A.riseWords(ctx, u, b, d.title, { x: tx, y: 395, size, maxW: d.maxW || L.right - tx, stagger: 0.09, hl: d.hl || [], hlAt: d.hlAt, exit });
  const y1 = t.bottom + 82;
  A.line(ctx, u, b + 0.6, d.ar, { x: L.right, y: y1, size: 54, weight: 700, color: C.blue, align: 'right', rtl: true, exit: exit + 0.05 });
  A.line(ctx, u, b + 1.1, d.en2, { x: L.left, y: y1 + 70, size: 34, weight: 500, color: C.grey, align: 'left', exit: exit + 0.1 });
  A.line(ctx, u, b + 1.5, d.ar2, { x: L.right, y: y1 + 124, size: 32, weight: 500, color: C.grey, align: 'right', rtl: true, exit: exit + 0.15 });
}

function label(ctx, u, u0, exit, r, IMG) {
  const k = springU(u, u0, SPRING.snappy), ex = E.inCubic(prog(u, exit, exit + 0.3));
  if (k <= 0 || ex >= 1) return;
  ctx.save(); ctx.globalAlpha = clamp(k * 1.5) * (1 - ex);
  let x = FRAME.x; const y = 726 + (1 - k) * 12;
  const lg = r && r.logo ? IMG[r.logo] : null;
  if (lg) {
    const h = r.full ? 34 : 30, w = r.full ? h : lg.width * h / lg.height;
    if (r.full) { ctx.save(); rrect(ctx, x, y - 28, h, h, 8); ctx.clip(); ctx.drawImage(lg, x, y - 28, h, h); ctx.restore(); }
    else ctx.drawImage(lg, x, y - 26, w, h);
    x += w + 14;
  }
  ctx.font = font(28, 600, F.latin); ctx.fillStyle = C.blue; ctx.textAlign = 'left';
  ctx.fillText(r ? r.site : 'Resources', x, y);
  ctx.restore();
}

// ------------------------------------------------------------------ card contents
function tilesGrid(ctx, u, u0, IMG, { checks = null, names = false } = {}) {
  const s = 168, gx = 236, gy = names ? 300 : 250;
  const cx = CARD.x + CARD.w / 2, cy = CARD.y + CARD.h / 2 - (names ? 20 : 0);
  RES.forEach((r, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = cx + (col - 1) * gx - s / 2, y = cy + (row - 0.5) * gy - s / 2;
    const p = springU(u, u0 + i * 0.4, SPRING.bouncy);
    A.tile(ctx, x, y, s, { img: r.logo ? IMG[r.logo] : null, full: r.full, label: r.label, p });
    if (names && p > 0.05) {
      ctx.save(); ctx.globalAlpha = clamp(p);
      ctx.font = font(28, 700, F.latin); ctx.fillStyle = C.ink; ctx.textAlign = 'center';
      ctx.fillText(TILE_NAMES[i], x + s / 2, y + s + 44); ctx.restore();
    }
    if (checks != null) {
      const c = springU(u, checks + i * 0.4, SPRING.bouncy);
      if (c > 0) {
        const ccx = x + s - 6, ccy = y + 6;
        ctx.save(); ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(ccx, ccy, 25 * c, 0, M.TAU); ctx.fill();
        ctx.strokeStyle = C.white; ctx.lineWidth = 6 * c; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(ccx - 10 * c, ccy); ctx.lineTo(ccx - 3 * c, ccy + 8 * c); ctx.lineTo(ccx + 11 * c, ccy - 8 * c); ctx.stroke();
        ctx.restore();
      }
    }
  });
}
function capture(ctx, u, i, IMG) {
  const r = RES[i], b = B0 + i * SPAN, img = IMG[r.img];
  if (!img) return null;
  const V = view(img, r.cam, u, b);
  ctx.drawImage(img, CARD.x - V.ox * V.s, CARD.y - V.oy * V.s, img.width * V.s, img.height * V.s);
  if (r.ring) {
    const [x1, y1] = V.map(r.ring.r[0], r.ring.r[1]), [x2, y2] = V.map(r.ring.r[0] + r.ring.r[2], r.ring.r[1] + r.ring.r[3]);
    const p = prog(u, b + r.ring.at, b + r.ring.at + 0.8);
    if (p > 0) { ctx.save(); ctx.globalAlpha = 0.10 * clamp(p * 2); ctx.fillStyle = C.blue; ctx.fillRect(x1, y1, x2 - x1, y2 - y1); ctx.restore(); }
    A.selection(ctx, x1, y1, x2 - x1, y2 - y1, { p });
  }
  if (r.click) A.ripple(ctx, ...V.map(...r.click.p), prog(u, b + r.click.at, b + r.click.at + 0.7));
  return V;
}
function overlays(ctx, u, i, V) {
  const r = RES[i], b = B0 + i * SPAN;
  if (!V) return;
  if (r.click) {
    const [bx, by] = V.map(...r.click.p), ca = b + r.click.at;
    const m = ease(prog(u, ca - 1.6, ca - 0.15));
    const x = lerp(r.click.from[0], bx, m), y = lerp(r.click.from[1], by, m) - Math.sin(Math.PI * m) * 60;
    if (u > ca - 1.7) A.cursor(ctx, x, y, { press: M.bump(u, ca, 0.3), alpha: 1 - prog(u, ca + 2.4, ca + 2.8) });
    if (r.result) A.pill(ctx, r.result.label, bx, by + 66, { size: 32, check: true, align: 'center', p: springU(u, b + r.result.at, SPRING.bouncy) });
  } else if (r.result) {
    const [, ry] = V.map(0, r.ring.r[1]);
    A.pill(ctx, r.result.label, CARD.x + CARD.w / 2, ry - 30, { size: 36, check: true, align: 'center', p: springU(u, b + r.result.at, SPRING.bouncy) });
  }
}

// ------------------------------------------------------------------ covers (?cover=tiktok|shorts)
// TikTok shows the cover cropped to 3:4 in the profile grid: every word sits in the central band
// (y 240..1680). The Shorts cover uses the full frame.
const COVER = new URLSearchParams(location.search).get('cover');
function cover(ctx, IMG, kind) {
  const U = 100;                                   // every spring settled
  A.paper(ctx);
  const top = kind === 'tiktok' ? 300 : 230;
  A.header(ctx, U, SERIES, { y: top });
  const sz = kind === 'tiktok' ? 132 : 144;
  let y = top + 66 + sz * 1.12;
  A.riseWords(ctx, U, 0, '6 free', { x: L.left, y, size: sz, hl: [1], hlAt: 0 });
  A.riseWords(ctx, U, 0, 'resources to', { x: L.left, y: y + sz * 1.02, size: sz });
  A.riseWords(ctx, U, 0, 'learn UI/UX.', { x: L.left, y: y + sz * 2.04, size: sz });
  y += sz * 2.04 + 118;
  A.line(ctx, U, 0, '٦ مصادر مجانية لتعلّم UI/UX', { x: L.right, y, size: 70, weight: 700, color: C.blue, align: 'right', rtl: true });
  const s = kind === 'tiktok' ? 190 : 210, gap = kind === 'tiktok' ? 40 : 46;
  const gy = y + 90, x0 = L.left + (L.width - (3 * s + 2 * gap)) / 2;
  RES.forEach((r, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    A.tile(ctx, x0 + col * (s + gap), gy + row * (s + gap), s, { img: r.logo ? IMG[r.logo] : null, full: r.full, label: r.label, p: 1 });
  });
}

// ------------------------------------------------------------------ the film
M.film({
  fonts: [font(74, 800, F.latin), font(34, 500, F.latin), font(54, 700, F.arabic), font(32, 500, F.arabic), font(28, 700, F.mono)],
  images: {
    lawsLogo: 'assets/logos/laws-of-ux.png', nngLogo: 'assets/logos/nngroup.png',
    webaimLogo: 'assets/logos/webaim.png', figmaLogo: 'assets/logos/figma.webp',
    laws: 'assets/shots/01-laws-of-ux.jpg', nng: 'assets/shots/02-nngroup.jpg', material: 'assets/shots/03-material.jpg',
    apple: 'assets/shots/04-apple-hig.png', webaim: 'assets/shots/05-webaim-contrast.jpg', figma: 'assets/shots/06-figma.jpg',
  },
  hits: HITS,
  draw(ctx, u, t, IMG) {
    if (COVER) { cover(ctx, IMG, COVER); return; }
    if (u >= END) { A.endCard(ctx, u, END + 0.1); return; }
    A.paper(ctx);
    A.header(ctx, u, SERIES);

    // ---- text block
    if (u < B0) textBlock(ctx, u, 0, B0 - 0.55, { maxW: 660, title: HOOK.title, hl: HOOK.hl, hlAt: 1.4, ar: HOOK.ar, en2: HOOK.en2, ar2: HOOK.ar2 });
    RES.forEach((r, i) => {
      const b = B0 + i * SPAN, nb = i < RES.length - 1 ? b + SPAN : RECAP;
      if (u >= b - 0.3 && u < nb) textBlock(ctx, u, b, nb - 0.55, { n: i + 1, title: r.name, ar: r.ar, en2: r.en2, ar2: r.ar2 });
    });
    if (u >= RECAP - 0.3) textBlock(ctx, u, RECAP, END + 1, { title: RECAP_TXT.title, hl: RECAP_TXT.hl, hlAt: RECAP + 1.0, ar: RECAP_TXT.ar, en2: RECAP_TXT.en2, ar2: RECAP_TXT.ar2 });

    // ---- progress bar (steps only)
    const pa = clamp(prog(u, B0 - 0.5, B0)) * (1 - prog(u, RECAP + 0.5, RECAP + 1.2));
    let done = 0;
    for (let i = 0; i < RES.length; i++) done += ease(prog(u, B0 + i * SPAN, B0 + i * SPAN + 0.8));
    A.progress(ctx, 6, done, { alpha: pa });

    // ---- label above the frame
    if (u < B0) label(ctx, u, 3.0, B0 - 0.4, null, IMG);
    RES.forEach((r, i) => {
      const b = B0 + i * SPAN, nb = i < RES.length - 1 ? b + SPAN : RECAP;
      if (u >= b - 0.2 && u < nb) label(ctx, u, b + 0.3, nb - 0.4, r, IMG);
    });
    if (u >= RECAP) label(ctx, u, RECAP + 0.3, END + 1, null, IMG);

    // ---- frame + card
    const fp = prog(u, 3.0, 3.9);
    if (fp > 0) {
      const cp = springU(u, 2.9, SPRING.gentle);
      ctx.save(); ctx.globalAlpha = clamp(cp * 1.5); ctx.translate(0, (1 - cp) * 120);
      A.shadow(ctx, 40, 14, 0.08);
      rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.fillStyle = C.white; ctx.fill(); A.noShadow(ctx);
      ctx.save(); rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.clip();
      if (u < B0 + 1.2) {
        const push = ease(prog(u, B0 - 0.3, B0 + 0.7)) * CARD.h;
        ctx.save(); ctx.translate(0, -push); tilesGrid(ctx, u, 4.2, IMG); ctx.restore();
      }
      let V = null, Vi = -1;
      RES.forEach((r, i) => {
        const b = B0 + i * SPAN, nb = i < RES.length - 1 ? b + SPAN : RECAP;
        if (u < b - 0.3 || u >= nb + 1.2) return;
        const k = ease(prog(u, b - 0.3, b + 0.7));
        ctx.save(); ctx.translate(0, (1 - k) * CARD.h);
        A.shadow(ctx, 30, -10, 0.12);
        ctx.fillStyle = C.white; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h); A.noShadow(ctx);
        const v = capture(ctx, u, i, IMG);
        ctx.restore();
        if (k >= 1) { V = v; Vi = i; }
      });
      if (u >= RECAP - 0.3) {
        const k = ease(prog(u, RECAP - 0.3, RECAP + 0.7));
        ctx.save(); ctx.translate(0, (1 - k) * CARD.h);
        ctx.fillStyle = C.white; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
        tilesGrid(ctx, u, RECAP + 0.4, IMG, { checks: RECAP + 1.6, names: true });
        ctx.restore();
      }
      ctx.restore();
      ctx.lineWidth = 2; ctx.strokeStyle = C.line; rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.stroke();
      if (Vi >= 0) {
        const nb = Vi < RES.length - 1 ? B0 + (Vi + 1) * SPAN : RECAP;
        if (u < nb - 0.3) overlays(ctx, u, Vi, V);       // gone before the next capture slides in
      }
      ctx.restore();
      A.selection(ctx, FRAME.x, FRAME.y, FRAME.w, FRAME.h, { p: fp });
    }

    // ---- blue circle to the end page
    if (u >= END - 0.9) A.circleCover(ctx, CARD.x + CARD.w / 2, CARD.y + CARD.h / 2, prog(u, END - 0.9, END - 0.02));
  },
});
