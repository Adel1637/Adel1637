// Learn UI/UX: the best resources for beginners (YouTube, 16:9). Pure function of time.
// Timing in beats (u) on the 128 BPM grid in beats.json. Style: ../shared/ags.js (AG Studio Shorts,
// laid out for landscape: text column on the left, UI card in a selection frame on the right).
// No music, no voice: on-screen text + SFX only.
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';

const { E, prog, lerp, clamp, springU, springKeys, SPRING, font, rrect } = M;
const A = makeAGS(M);
const { C, F } = A;

// ------------------------------------------------------------------ layout (1920x1080)
const COL = { l: 120, r: 1000 };                              // text column
const FRAME = { x: 1180, y: 170, w: 620, h: 840 };
const CARD = { x: 1200, y: 190, w: 580, h: 800, r: 30 };
const SERIES = 'Learn UI/UX';

// ------------------------------------------------------------------ timeline (beats)
const SPAN = 30;
const T = { intro: 0, part1: 24, free0: 32, part2: 242, paid0: 250, path: 400, end: 432 };
const startOf = (i) => (i < 7 ? T.free0 + i * SPAN : T.paid0 + (i - 7) * SPAN);
const nextOf = (i) => (i === 6 ? T.part2 : i === 11 ? T.path : startOf(i + 1));

// ------------------------------------------------------------------ content
// kind: 'shot' (iPhone capture in the card), 'book' (cover), 'logo' (logo card, until a capture exists)
const RES = [
  { key: 'laws', name: 'Laws of UX', tile: { logo: 'lawsLogo', full: true }, kind: 'shot', img: 'laws', site: 'lawsofux.com', paid: false,
    ar: 'قوانين تجربة المستخدم', en2: 'The psychology behind every good interface.', ar2: 'علم النفس وراء كل واجهة ناجحة.',
    best: 'Best for: understanding why a design works', bestAr: 'الأنسب لـ: فهم سبب نجاح التصميم',
    cam: [[0, [585, 560, 1]], [8, [585, 560, 1]], [9.5, [440, 585, 1.5]], [18, [440, 585, 1.5]], [20, [585, 1000, 1]]],
    ring: { at: 10, r: [140, 538, 600, 96] } },
  { key: 'nng', name: 'Nielsen Norman Group', tile: { logo: 'nngLogo' }, kind: 'shot', img: 'nng', contain: true, site: 'nngroup.com', paid: false,
    ar: 'أبحاث تجربة المستخدم', en2: 'UX rules backed by real research.', ar2: 'قواعد UX مبنية على أبحاث حقيقية.',
    best: 'Best for: decisions backed by evidence', bestAr: 'الأنسب لـ: قرارات مبنية على الأدلة',
    cam: [[0, [584, 412, 1]], [8, [584, 412, 1]], [9.5, [430, 392, 1.5]], [19, [430, 392, 1.5]], [21, [584, 412, 1]]],
    ring: { at: 10, r: [36, 336, 788, 112] } },
  { key: 'material', name: 'Material Design 3', tile: { label: 'Material\n3' }, kind: 'shot', img: 'material', site: 'm3.material.io', paid: false,
    ar: 'نظام التصميم من Google', en2: "Google's design system for Android and web.", ar2: 'نظام Google للتصميم على أندرويد والويب.',
    best: 'Best for: Android and web components', bestAr: 'الأنسب لـ: مكوّنات أندرويد والويب',
    cam: [[0, [585, 760, 1]], [16, [585, 760, 1]], [18, [585, 1400, 1]]],
    click: { at: 10, p: [459, 1083], from: [1700, 1000] } },
  { key: 'apple', name: 'Apple HIG', tile: { label: 'Apple\nHIG' }, kind: 'shot', img: 'apple', site: 'developer.apple.com/design', paid: false,
    ar: 'إرشادات Apple للواجهات', en2: "Apple's official rules for iPhone apps.", ar2: 'قواعد Apple الرسمية لتصميم تطبيقات iPhone.',
    best: 'Best for: designing iPhone apps', bestAr: 'الأنسب لـ: تصميم تطبيقات iPhone',
    cam: [[0, [585, 800, 1]], [8, [585, 800, 1]], [9.5, [470, 515, 1.4]], [18, [470, 515, 1.4]], [20, [585, 1300, 1]]],
    ring: { at: 10, r: [58, 398, 830, 236] } },
  { key: 'webaim', name: 'WebAIM Contrast Checker', tile: { logo: 'webaimLogo' }, kind: 'shot', img: 'webaim', site: 'webaim.org', paid: false,
    ar: 'فاحص تباين الألوان', en2: 'Check if your text is easy to read.', ar2: 'تأكّد أن نصوصك سهلة القراءة.',
    best: 'Best for: accessible, readable colors', bestAr: 'الأنسب لـ: ألوان سهلة القراءة للجميع',
    cam: [[0, [570, 800, 1]], [7, [570, 800, 1]], [9, [555, 1900, 1.15]]],
    ring: { at: 10, r: [280, 1924, 550, 330] }, result: { at: 11.5, label: 'WCAG AAA' } },
  { key: 'figma', name: 'Figma', tile: { logo: 'figmaLogo' }, kind: 'shot', img: 'figma', site: 'figma.com', paid: false,
    ar: 'أداة التصميم', en2: 'The design tool. The free plan is enough to start.', ar2: 'أداة التصميم. الخطة المجانية تكفي للبدء.',
    best: 'Best for: practicing every day', bestAr: 'الأنسب لـ: التدرّب كل يوم',
    cam: [[0, [585, 806, 1]]],
    click: { at: 10, p: [710, 108], from: [1700, 900] }, result: { at: 11.5, label: 'Free plan' } },
  { key: 'w3c', name: 'W3C Internationalization', tile: { logo: 'w3cLogo' }, kind: 'logo', logo: 'w3cLogo', site: 'w3.org/International', paid: false, bonus: true,
    ar: 'الواجهات من اليمين إلى اليسار', en2: 'How to build right-to-left interfaces properly.', ar2: 'كيف تبني واجهات من اليمين إلى اليسار بشكل صحيح.',
    best: 'Best for: Arabic and RTL interfaces', bestAr: 'الأنسب لـ: الواجهات العربية' },
  { key: 'refactoring', name: 'Refactoring UI', tile: { logo: 'refCover' }, kind: 'book', cover: 'refCover', site: 'Book · Adam Wathan & Steve Schoger', paid: true,
    ar: 'كتاب Refactoring UI', en2: 'Practical tips to make your screens look better.', ar2: 'نصائح عملية لتحسين مظهر واجهاتك.',
    best: 'Best for: spacing, color and hierarchy', bestAr: 'الأنسب لـ: المسافات والألوان والتسلسل البصري' },
  { key: 'practical', name: 'Practical UI', tile: { logo: 'pracCover' }, kind: 'book', cover: 'pracCover', site: 'Book · Adham Dannaway', paid: true,
    ar: 'كتاب Practical UI', en2: 'Clear UI rules you can apply right away.', ar2: 'قواعد واضحة للواجهات تطبّقها فورًا.',
    best: 'Best for: a checklist of design rules', bestAr: 'الأنسب لـ: قائمة قواعد تصميم جاهزة' },
  { key: 'dmmt', name: "Don't Make Me Think", tile: { logo: 'dmmtCover' }, kind: 'book', cover: 'dmmtCover', site: 'Book · Steve Krug', paid: true,
    ar: 'كتاب Don’t Make Me Think', en2: 'The classic book on usability. Short and easy to read.', ar2: 'الكتاب الكلاسيكي عن سهولة الاستخدام. قصير وسهل القراءة.',
    best: 'Best for: thinking like a user', bestAr: 'الأنسب لـ: التفكير كمستخدم' },
  { key: 'google', name: 'Google UX Design Certificate', tile: { logo: 'courseraLogo' }, kind: 'logo', logo: 'courseraLogo', site: 'coursera.org', paid: true,
    ar: 'شهادة Google في تصميم UX', en2: 'A full, structured course with a certificate.', ar2: 'دورة كاملة ومنظّمة مع شهادة.',
    best: 'Best for: a guided path from zero', bestAr: 'الأنسب لـ: مسار موجّه من الصفر' },
  { key: 'mobbin', name: 'Mobbin', tile: { logo: 'mobbinLogo' }, kind: 'logo', logo: 'mobbinLogo', site: 'mobbin.com', paid: true,
    ar: 'مكتبة شاشات التطبيقات', en2: 'A library of real app screens to learn from.', ar2: 'مكتبة لشاشات تطبيقات حقيقية تتعلّم منها.',
    best: 'Best for: learning common UI patterns', bestAr: 'الأنسب لـ: تعلّم الأنماط الشائعة في الواجهات' },
];
const TILE_NAMES = ['Laws of UX', 'NN/g', 'Material 3', 'Apple HIG', 'WebAIM', 'Figma', 'W3C', 'Refactoring UI', 'Practical UI', "Don't Make Me Think", 'Google UX', 'Mobbin'];
const INTRO = {
  title: 'Learn UI/UX: the best resources for beginners.', hl: [3],
  ar: 'أفضل المصادر لتعلّم UI/UX للمبتدئين', en2: "Start free. Pay only when you know what's missing.", ar2: 'ابدأ بالمجاني، وادفع فقط حين تعرف ما ينقصك.',
};
const PARTS = [
  { at: T.part1, title: 'Part 1 · Free', hl: [3], ar: 'الجزء الأول: المصادر المجانية', en2: '7 resources. All free to start.', ar2: '٧ مصادر، كلها مجانية للبدء.', ids: [0, 1, 2, 3, 4, 5, 6], until: T.free0 },
  { at: T.part2, title: 'Part 2 · Paid', hl: [3], ar: 'الجزء الثاني: المصادر المدفوعة', en2: "5 resources worth paying for, when you're ready.", ar2: '٥ مصادر تستحق الدفع، حين تكون مستعدًا.', ids: [7, 8, 9, 10, 11], until: T.paid0 },
];
const PATH = {
  title: 'Your learning path.', hl: [2], ar: 'مسار التعلّم.', en2: "Start free. Pay when you know what's missing.", ar2: 'ابدأ بالمجاني، وادفع حين تعرف ما ينقصك.',
  steps: [
    { en: 'Understand the basics', ar: 'افهم الأساسيات', ids: [0, 1, 9] },
    { en: 'Learn the standards', ar: 'تعلّم المعايير', ids: [2, 3, 4, 6] },
    { en: 'Practice in Figma', ar: 'تدرّب على Figma', ids: [5] },
    { en: 'Fix real screens', ar: 'صحّح واجهات حقيقية', ids: [], note: 'Like in the UI fix series' },
  ],
};

// ------------------------------------------------------------------ hits (every accent has a sound)
const HITS = [];
const hit = (b, label, sfx, o) => HITS.push(o ? [b, label, sfx, o] : [b, label, sfx]);
const PITCH = ['A5', 'B5', 'C#6', 'E6', 'F#6', 'A6'];
hit(0, 'intro title', 'type', { n: 10, len: 1.2 });
hit(1.6, 'highlighter on best', 'tick');
hit(2.4, 'intro arabic', 'pop', { pitch: 'C#6' });
hit(3.4, 'intro grey lines', 'tick');
hit(4.2, 'frame drawn', 'click');
for (let i = 0; i < 12; i++) hit(5 + i * 0.5, `intro tile ${i + 1}`, 'pop', { pitch: PITCH[i % 6] });
hit(13, '7 free pill', 'blip', { pitch: 'A6' });
hit(13.6, '5 paid pill', 'blip', { pitch: 'E6' });
PARTS.forEach((p) => {
  hit(p.at, `${p.title} title`, 'type', { n: 5, len: 0.6 });
  hit(p.at + 0.6, `${p.title} arabic`, 'tick');
  p.ids.forEach((id, k) => hit(p.at + 1.4 + k * 0.4, `${p.title} tile ${k + 1}`, 'pop', { pitch: PITCH[k % 6] }));
});
RES.forEach((r, i) => {
  const b = startOf(i);
  hit(b - 0.1, `${r.key} badge`, 'pop', { pitch: 'E6' });
  hit(b + 0.1, `${r.key} title`, 'type', { n: 6, len: 0.6 });
  hit(b + 0.4, `${r.key} card in`, 'click');
  hit(b + 0.6, `${r.key} arabic`, 'tick');
  hit(b + 2.5, `${r.key} best-for pill`, 'pop', { pitch: r.paid ? 'C#6' : 'A6' });
  if (r.cam && r.cam.length > 1) r.cam.slice(1).forEach(([v], k) => { if (k > 0 || v > 1) hit(b + v, `${r.key} camera ${k + 1}`, 'tick'); });
  if (r.ring) hit(b + r.ring.at, `${r.key} selection`, 'click');
  if (r.click) hit(b + r.click.at, `${r.key} click`, 'click');
  if (r.result) hit(b + r.result.at, `${r.key} result`, 'bell', { pitch: 'E6' });
  if (r.kind !== 'shot') hit(b + 10, `${r.key} selection`, 'click');
});
hit(T.path, 'path title', 'type', { n: 6, len: 0.6 });
hit(T.path + 0.6, 'path arabic', 'tick');
PATH.steps.forEach((s, k) => hit(T.path + 3 + k * 3, `path step ${k + 1}`, 'pop', { pitch: PITCH[k] }));
hit(T.end - 0.9, 'circle to end', 'click');
hit(T.end + 0.1, 'keep it simple', 'pop', { pitch: 'A5' });
hit(T.end + 2.2, 'follow pill', 'pop', { pitch: 'A6' });

// ------------------------------------------------------------------ helpers
const ease = E.inOutCubic;
function view(img, r, u, b) {
  const [fx, fy, z] = springKeys(u, r.cam.map(([v, k]) => [b + v, k]), SPRING.gentle);
  const fit = r.contain ? Math.min : Math.max;
  const s = fit(CARD.w / img.width, CARD.h / img.height) * z;
  const vw = CARD.w / s, vh = CARD.h / s;
  const ox = vw >= img.width ? (img.width - vw) / 2 : clamp(fx - vw / 2, 0, img.width - vw);
  const oy = vh >= img.height ? (img.height - vh) / 2 : clamp(fy - vh / 2, 0, img.height - vh);
  return { s, ox, oy, map: (px, py) => [CARD.x + (px - ox) * s, CARD.y + (py - oy) * s] };
}
function fitTitle(ctx, str, maxW, max) {
  ctx.font = font(max, 800, F.latin); ctx.letterSpacing = `${-0.035 * max}px`;
  const w = ctx.measureText(str).width; ctx.letterSpacing = '0px';
  return Math.min(max, Math.floor(max * maxW / w));
}

// text column: [badge] title · Arabic title (blue) · grey EN · grey AR · [pill + best-for]
function textBlock(ctx, u, b, exit, d) {
  const hasBadge = d.n != null;
  const tx = hasBadge ? COL.l + 100 : COL.l;
  const size = hasBadge ? fitTitle(ctx, d.title, COL.r - tx, 76) : (d.size || 80);
  if (hasBadge) A.badge(ctx, d.n, COL.l, 338, springU(u, b - 0.15, SPRING.bouncy) * (1 - E.inCubic(prog(u, exit, exit + 0.4))));
  const t = A.riseWords(ctx, u, b, d.title, { x: tx, y: hasBadge ? 404 : 410, size, maxW: COL.r - tx, stagger: 0.09, hl: d.hl || [], hlAt: d.hlAt, exit });
  const y1 = t.bottom + 96;
  ctx.font = font(60, 700, F.arabic); ctx.direction = 'rtl';
  const arSize = Math.min(60, Math.floor(60 * (COL.r - COL.l) / ctx.measureText(d.ar).width)); ctx.direction = 'ltr';
  A.line(ctx, u, b + 0.6, d.ar, { x: COL.r, y: y1, size: arSize, weight: 700, color: C.blue, align: 'right', rtl: true, exit: exit + 0.05 });
  A.line(ctx, u, b + 1.1, d.en2, { x: COL.l, y: y1 + 80, size: 38, weight: 500, color: C.grey, align: 'left', exit: exit + 0.1 });
  A.line(ctx, u, b + 1.5, d.ar2, { x: COL.r, y: y1 + 140, size: 35, weight: 500, color: C.grey, align: 'right', rtl: true, exit: exit + 0.15 });
  if (d.pills) {
    const ex = E.inCubic(prog(u, exit, exit + 0.4));
    let x = COL.l;
    d.pills.forEach((p, k) => {
      const pp = springU(u, b + p.at, SPRING.bouncy) * (1 - ex);
      x += A.pill(ctx, p.label, x, y1 + 206, { bg: p.bg, size: 30, p: pp }) + 18;
    });
    if (d.best) {
      A.line(ctx, u, b + 2.7, d.best, { x, y: y1 + 250, size: 35, weight: 700, color: C.ink, align: 'left', exit: exit + 0.2 });
      A.line(ctx, u, b + 3.1, d.bestAr, { x: COL.r, y: y1 + 324, size: 33, weight: 600, color: C.ink, align: 'right', rtl: true, exit: exit + 0.25 });
    }
  }
}

function label(ctx, u, u0, exit, text, logo, full) {
  const k = springU(u, u0, SPRING.snappy), ex = E.inCubic(prog(u, exit, exit + 0.3));
  if (k <= 0 || ex >= 1) return;
  ctx.save(); ctx.globalAlpha = clamp(k * 1.5) * (1 - ex);
  let x = FRAME.x; const y = 146 + (1 - k) * 12;
  if (logo) {
    const h = full ? 32 : 28, w = full ? h : logo.width * h / logo.height;
    if (full) { ctx.save(); rrect(ctx, x, y - 26, h, h, 8); ctx.clip(); ctx.drawImage(logo, x, y - 26, h, h); ctx.restore(); }
    else ctx.drawImage(logo, x, y - 24, w, h);
    x += w + 12;
  }
  ctx.font = font(28, 600, F.latin); ctx.fillStyle = C.blue; ctx.textAlign = 'left';
  ctx.fillText(text, x, y);
  ctx.restore();
}

// ------------------------------------------------------------------ card contents
function tileOf(ctx, IMG, id, x, y, s, p) {
  const t = RES[id].tile;
  A.tile(ctx, x, y, s, { img: t.logo ? IMG[t.logo] : null, full: t.full, label: t.label, p });
}
function tilesGrid(ctx, u, u0, IMG, ids, { cols = 3, s = 140, gx = 176, gy = 186, names = false, step = 0.5 } = {}) {
  const rows = Math.ceil(ids.length / cols);
  const cx = CARD.x + CARD.w / 2, cy = CARD.y + CARD.h / 2 - (names ? 14 : 0);
  ids.forEach((id, k) => {
    const col = k % cols, row = Math.floor(k / cols);
    const inRow = Math.min(cols, ids.length - row * cols);
    const x = cx + (col - (inRow - 1) / 2) * gx - s / 2, y = cy + (row - (rows - 1) / 2) * gy - s / 2;
    const p = springU(u, u0 + k * step, SPRING.bouncy);
    tileOf(ctx, IMG, id, x, y, s, p);
    if (names && p > 0.05) {
      ctx.save(); ctx.globalAlpha = clamp(p);
      ctx.font = font(22, 700, F.latin); ctx.fillStyle = C.ink; ctx.textAlign = 'center';
      ctx.fillText(TILE_NAMES[id], x + s / 2, y + s + 34); ctx.restore();
    }
  });
}
function shotCard(ctx, u, i, IMG) {
  const r = RES[i], b = startOf(i), img = IMG[r.img];
  if (!img) return null;
  const V = view(img, r, u, b);
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
function bookCard(ctx, u, i, IMG) {
  const r = RES[i], b = startOf(i), img = IMG[r.cover];
  ctx.fillStyle = '#F6F7FA'; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
  if (!img) return;
  const k = springU(u, b + 0.6, SPRING.gentle);
  const drift = 1 + 0.05 * prog(u, b + 2, b + SPAN);                       // slow push-in
  const bw = 400 * drift, bh = bw * img.height / img.width;
  const cx = CARD.x + CARD.w / 2, cy = CARD.y + CARD.h / 2 + (1 - k) * 80;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.035 * k);
  A.shadow(ctx, 50, 24, 0.28);
  ctx.fillStyle = C.white; ctx.fillRect(-bw / 2, -bh / 2, bw, bh); A.noShadow(ctx);
  ctx.drawImage(img, -bw / 2, -bh / 2, bw, bh);
  ctx.restore();
  const sp = prog(u, b + 10, b + 10.8);
  A.selection(ctx, cx - bw / 2 - 14, cy - bh / 2 - 14, bw + 28, bh + 28, { p: sp });
}
function logoCard(ctx, u, i, IMG) {
  const r = RES[i], b = startOf(i), img = IMG[r.logo];
  ctx.fillStyle = C.white; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
  if (!img) return;
  const k = springU(u, b + 0.6, SPRING.bouncy);
  const box = 330 * (1 + 0.04 * prog(u, b + 2, b + SPAN));
  const sc = Math.min(box / img.width, box / img.height) * k;
  const w = img.width * sc, h = img.height * sc, cx = CARD.x + CARD.w / 2, cy = CARD.y + CARD.h / 2 - 40;
  if (w > 1) ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
  A.selection(ctx, cx - box / 2 - 24, cy - box / 2 - 24, box + 48, box + 48, { p: prog(u, b + 10, b + 10.8) });
  A.line(ctx, u, b + 1.2, r.site, { x: cx, y: CARD.y + CARD.h - 110, size: 30, weight: 700, color: C.ink, align: 'center' });
}
function overlays(ctx, u, i, V) {
  const r = RES[i], b = startOf(i);
  if (!V) return;
  if (r.click) {
    const [bx, by] = V.map(...r.click.p), ca = b + r.click.at;
    const m = ease(prog(u, ca - 1.8, ca - 0.15));
    const x = lerp(r.click.from[0], bx, m), y = lerp(r.click.from[1], by, m) - Math.sin(Math.PI * m) * 60;
    if (u > ca - 1.9) A.cursor(ctx, x, y, { press: M.bump(u, ca, 0.3), alpha: 1 - prog(u, ca + 4, ca + 4.5) });
    if (r.result) A.pill(ctx, r.result.label, bx, by + 56, { size: 28, check: true, align: 'center', p: springU(u, b + r.result.at, SPRING.bouncy) });
  } else if (r.result) {
    const [, ry] = V.map(0, r.ring.r[1]);
    A.pill(ctx, r.result.label, CARD.x + CARD.w / 2, ry - 26, { size: 30, check: true, align: 'center', p: springU(u, b + r.result.at, SPRING.bouncy) });
  }
}
function pathCard(ctx, u, IMG) {
  ctx.fillStyle = C.white; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
  PATH.steps.forEach((s, k) => {
    const u0 = T.path + 3 + k * 3, p = springU(u, u0, SPRING.snappy);
    if (p <= 0) return;
    const y = CARD.y + 50 + k * 186 + (1 - p) * 30;
    ctx.save(); ctx.globalAlpha = clamp(p * 1.4);
    A.badge(ctx, k + 1, CARD.x + 36, y, 1, 56);
    ctx.font = font(32, 800, F.latin); ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.letterSpacing = '-0.8px';
    ctx.fillText(s.en, CARD.x + 112, y + 26); ctx.letterSpacing = '0px';
    ctx.direction = 'rtl'; ctx.font = font(26, 600, F.arabic); ctx.fillStyle = C.blue; ctx.textAlign = 'left';
    ctx.fillText(s.ar, CARD.x + 112, y + 66); ctx.direction = 'ltr';
    ctx.restore();
    s.ids.forEach((id, j) => tileOf(ctx, IMG, id, CARD.x + 112 + j * 76, y + 86, 64, springU(u, u0 + 0.4 + j * 0.2, SPRING.bouncy)));
    if (s.note) A.line(ctx, u, u0 + 0.6, s.note, { x: CARD.x + 112, y: y + 124, size: 26, weight: 600, color: C.grey, align: 'left' });
    if (k < PATH.steps.length - 1) { ctx.save(); ctx.globalAlpha = clamp(p); ctx.fillStyle = C.bar; ctx.fillRect(CARD.x + 63, y + 66, 3, 110); ctx.restore(); }
  });
}

// ------------------------------------------------------------------ covers (?cover=youtube)
const COVER = new URLSearchParams(location.search).get('cover');
function thumbnail(ctx, IMG) {
  const U = 1000;
  A.paper(ctx);
  A.header(ctx, U, SERIES, { y: 70, left: 110, right: 1810 });
  A.riseWords(ctx, U, 0, 'Learn UI/UX:', { x: 110, y: 320, size: 140, maxW: 1100 });
  A.riseWords(ctx, U, 0, 'best resources', { x: 110, y: 470, size: 140, maxW: 1100, hl: [0], hlAt: 0 });
  A.line(ctx, U, 0, 'أفضل المصادر لتعلّم UI/UX', { x: 110, y: 630, size: 80, weight: 800, color: C.blue, align: 'left', rtl: true, family: 'CoverCairo, Jakarta' });
  let x = 110;
  x += A.pill(ctx, '7 FREE', x, 710, { bg: C.green, size: 52 }) + 24;
  A.pill(ctx, '5 PAID', x, 710, { bg: C.blue, size: 52 });
  const ids = [0, 5, 2, 7, 9, 11], s = 210, g = 36;
  ids.forEach((id, k) => tileOf(ctx, IMG, id, 1180 + (k % 2) * (s + g) + (k % 2 ? 0 : 0), 180 + Math.floor(k / 2) * (s + g), s, 1));
}

// ------------------------------------------------------------------ the film
M.film({
  fonts: [font(76, 800, F.latin), font(34, 500, F.latin), font(54, 700, F.arabic), font(32, 500, F.arabic), font(28, 700, F.mono)],
  images: {
    lawsLogo: 'assets/logos/laws-of-ux.png', nngLogo: 'assets/logos/nngroup.png', webaimLogo: 'assets/logos/webaim.png',
    figmaLogo: 'assets/logos/figma.webp', w3cLogo: 'assets/logos/w3c.webp', courseraLogo: 'assets/logos/coursera.png', mobbinLogo: 'assets/logos/mobbin.png',
    refCover: 'assets/covers/refactoring-ui.png', pracCover: 'assets/covers/practical-ui.jpg', dmmtCover: 'assets/covers/dont-make-me-think.jpg',
    laws: 'assets/shots/01-laws-of-ux.jpg', nng: 'assets/shots/02-nngroup.jpg', material: 'assets/shots/03-material.jpg',
    apple: 'assets/shots/04-apple-hig.png', webaim: 'assets/shots/05-webaim-contrast.jpg', figma: 'assets/shots/06-figma.jpg',
  },
  hits: HITS,
  // Arabic faces are unicode-range subsets: load them with Arabic text before the first frame.
  async init() {
    const ar = 'مصادر مجانية لتعلّم ٦';
    const fams = [F.arabic, ...(COVER ? ['CoverCairo'] : [])];
    await Promise.all(fams.flatMap((fam) => [500, 600, 700, 800].map((w) => document.fonts.load(font(40, w, fam), ar).catch(() => {}))));
  },
  draw(ctx, u, t, IMG) {
    if (COVER) { thumbnail(ctx, IMG); return; }
    if (u >= T.end) { A.endCardWide(ctx, u, T.end + 0.1); return; }
    A.paper(ctx);
    A.header(ctx, u, SERIES, { y: 56, left: COL.l, right: 1800 });

    // ---- text column
    if (u < T.part1) textBlock(ctx, u, T.intro, T.part1 - 0.55, { ...INTRO, hlAt: 1.6, size: 80,
      pills: [{ label: '7 FREE', bg: C.green, at: 13 }, { label: '5 PAID', bg: C.blue, at: 13.6 }] });
    PARTS.forEach((p) => { if (u >= p.at - 0.3 && u < p.until) textBlock(ctx, u, p.at, p.until - 0.55, { ...p, hlAt: p.at + 1.0, size: 96 }); });
    RES.forEach((r, i) => {
      const b = startOf(i), nb = nextOf(i);
      if (u < b - 0.3 || u >= nb) return;
      const pills = [{ label: r.paid ? 'PAID' : 'FREE', bg: r.paid ? C.blue : C.green, at: 2.5 }];
      if (r.bonus) pills.push({ label: 'BONUS · RTL', bg: C.ink, at: 2.8 });
      textBlock(ctx, u, b, nb - 0.55, { n: i + 1, title: r.name, ar: r.ar, en2: r.en2, ar2: r.ar2, pills, best: r.best, bestAr: r.bestAr });
    });
    if (u >= T.path - 0.3) textBlock(ctx, u, T.path, T.end + 1, { ...PATH, hlAt: T.path + 1.0, size: 88 });

    // ---- progress bar (12 resources)
    const inRes = (u >= T.free0 - 0.5 && u < T.part2 + 0.5) || (u >= T.paid0 - 0.5 && u < T.path + 0.5);
    if (inRes) {
      const pa = Math.min(clamp(prog(u, T.free0 - 0.5, T.free0)), 1 - prog(u, T.path, T.path + 0.5));
      let done = 0;
      for (let i = 0; i < 12; i++) done += ease(prog(u, startOf(i), startOf(i) + 0.8));
      A.progress(ctx, 12, done, { y: 990, x0: COL.l, width: COL.r - COL.l, gap: 8, alpha: pa });
    }

    // ---- label above the frame
    if (u < T.part1) label(ctx, u, 4.0, T.part1 - 0.4, '12 resources');
    PARTS.forEach((p) => { if (u >= p.at && u < p.until) label(ctx, u, p.at + 0.3, p.until - 0.4, p.ids.length === 7 ? 'Free' : 'Paid'); });
    RES.forEach((r, i) => {
      const b = startOf(i), nb = nextOf(i);
      if (u >= b - 0.2 && u < nb) label(ctx, u, b + 0.3, nb - 0.4, r.site, r.kind === 'shot' && r.tile.logo ? IMG[r.tile.logo] : null, r.tile.full);
    });
    if (u >= T.path) label(ctx, u, T.path + 0.3, T.end + 1, 'Step by step');

    // ---- frame + card: every scene slides up over the previous one
    const fp = prog(u, 4.0, 4.9);
    if (fp > 0) {
      const cp = springU(u, 3.9, SPRING.gentle);
      ctx.save(); ctx.globalAlpha = clamp(cp * 1.5); ctx.translate(0, (1 - cp) * 120);
      A.shadow(ctx, 40, 14, 0.08);
      rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.fillStyle = C.white; ctx.fill(); A.noShadow(ctx);
      ctx.save(); rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.clip();
      const scenes = [
        { a: T.intro, z: T.part1, draw: () => tilesGrid(ctx, u, 5, IMG, [...Array(12).keys()], { cols: 3, s: 128, gx: 168, gy: 168 }) },
        ...PARTS.map((p) => ({ a: p.at, z: p.until, draw: () => tilesGrid(ctx, u, p.at + 1.4, IMG, p.ids, { cols: 2, s: 132, gx: 236, gy: 186, names: true, step: 0.4 }) })),
        ...RES.map((r, i) => ({ a: startOf(i), z: nextOf(i), i, draw: () => (r.kind === 'shot' ? shotCard(ctx, u, i, IMG) : r.kind === 'book' ? bookCard(ctx, u, i, IMG) : logoCard(ctx, u, i, IMG)) })),
        { a: T.path, z: T.end + 1, draw: () => pathCard(ctx, u, IMG) },
      ];
      let V = null, Vi = -1;
      scenes.forEach((sc) => {
        if (u < sc.a - 0.3 || u >= sc.z + 1.2) return;
        const k = sc.a === 0 ? 1 : ease(prog(u, sc.a - 0.3, sc.a + 0.7));
        ctx.save(); ctx.translate(0, (1 - k) * CARD.h);
        A.shadow(ctx, 30, -10, 0.12); ctx.fillStyle = C.white; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h); A.noShadow(ctx);
        const v = sc.draw();
        ctx.restore();
        if (sc.i != null && k >= 1 && u < sc.z - 0.3) { V = v; Vi = sc.i; }
      });
      ctx.restore();
      ctx.lineWidth = 2; ctx.strokeStyle = C.line; rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.stroke();
      if (Vi >= 0 && RES[Vi].kind === 'shot') overlays(ctx, u, Vi, V);
      ctx.restore();
      A.selection(ctx, FRAME.x, FRAME.y, FRAME.w, FRAME.h, { p: fp });
    }

    if (u >= T.end - 0.9) A.circleCover(ctx, CARD.x + CARD.w / 2, CARD.y + CARD.h / 2, prog(u, T.end - 0.9, T.end - 0.02));
  },
});
