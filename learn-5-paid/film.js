// 5 paid UI/UX resources worth it (Short 9:16). Hook: "Don't pay for a course before this." (shared/accroche.md)
// Same style as learn-6-free; assets from ../learn-long/assets. Not sponsored, no prices shown.
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';

const { E, prog, clamp, springU, SPRING, font, rrect } = M;
const A = makeAGS(M);
const { C, F, L } = A;
const FRAME = { x: 142, y: 752, w: 796, h: 760 }, CARD = { x: 162, y: 772, w: 756, h: 720, r: 32 };
const B0 = 6, SPAN = 11, RECAP = 61, END = 69;
const AS = '../learn-long/assets/';
const RES = [
  { name: 'Refactoring UI', kind: 'book', img: 'ref', ar: 'كتاب Refactoring UI', en2: 'Make your screens look better, fast.', ar2: 'اجعل واجهاتك أجمل بسرعة.', site: 'Book · Adam Wathan & Steve Schoger' },
  { name: 'Practical UI', kind: 'book', img: 'prac', ar: 'كتاب Practical UI', en2: 'Clear UI rules you can apply right away.', ar2: 'قواعد واضحة للواجهات تطبّقها فورًا.', site: 'Book · Adham Dannaway' },
  { name: "Don't Make Me Think", kind: 'book', img: 'dmmt', ar: 'كتاب Don’t Make Me Think', en2: 'The classic on usability. Short and easy.', ar2: 'الكتاب الكلاسيكي عن سهولة الاستخدام. قصير وسهل.', site: 'Book · Steve Krug' },
  { name: 'Google UX Design Certificate', kind: 'logo', img: 'coursera', ar: 'شهادة Google في تصميم UX', en2: 'A full course with a certificate.', ar2: 'دورة كاملة مع شهادة.', site: 'coursera.org' },
  { name: 'Mobbin', kind: 'logo', img: 'mobbin', ar: 'مكتبة شاشات التطبيقات', en2: 'Real app screens to learn patterns.', ar2: 'شاشات تطبيقات حقيقية لتعلّم الأنماط.', site: 'mobbin.com' },
];
const NAMES = ['Refactoring UI', 'Practical UI', "Don't Make Me Think", 'Google UX', 'Mobbin'];

const HITS = [];
const hit = (b, l, s, o) => HITS.push(o ? [b, l, s, o] : [b, l, s]);
hit(0, 'hook on screen', 'click'); hit(0.5, 'hook motion', 'tick'); hit(1.6, 'pulse', 'tick'); hit(3.2, 'pulse', 'tick');
RES.forEach((r, i) => { const b = B0 + i * SPAN; hit(b - 0.1, `${r.name} badge`, 'pop', { pitch: 'E6' }); hit(b + 0.1, `${r.name} title`, 'type', { n: 5, len: 0.5 }); hit(b + 0.4, `${r.name} card`, 'click'); hit(b + 2.6, `${r.name} paid pill`, 'blip', { pitch: 'A6' }); hit(b + 5, `${r.name} selection`, 'click'); });
hit(RECAP, 'recap', 'type', { n: 5, len: 0.5 }); for (let i = 0; i < 5; i++) hit(RECAP + 1.4 + i * 0.4, `check ${i + 1}`, 'blip', { pitch: 'E7' });
hit(END - 0.9, 'circle', 'click'); hit(END + 0.1, 'keep it', 'pop', { pitch: 'A5' }); hit(END + 2.2, 'follow', 'pop', { pitch: 'A6' });

function fit(ctx, s, max, w, fam, rtl) { ctx.font = font(max, 700, fam); ctx.direction = rtl ? 'rtl' : 'ltr'; const m = ctx.measureText(s).width; ctx.direction = 'ltr'; return Math.min(max, Math.floor(max * w / m)); }
function block(ctx, u, b, exit, d) {
  const hb = d.n != null, tx = hb ? L.left + 100 : L.left;
  ctx.font = font(74, 800, F.latin); ctx.letterSpacing = `${-0.035 * 74}px`; const tw = ctx.measureText(d.title).width; ctx.letterSpacing = '0px';
  const size = hb ? Math.min(74, Math.floor(74 * (L.right - tx) / tw)) : 74;
  if (hb) A.badge(ctx, d.n, L.left, 330, springU(u, b - 0.15, SPRING.bouncy) * (1 - E.inCubic(prog(u, exit, exit + 0.4))));
  const t = A.riseWords(ctx, u, b, d.title, { x: tx, y: 395, size, maxW: d.maxW || L.right - tx, stagger: 0.09, hl: d.hl || [], hlAt: d.hlAt, exit });
  const y1 = t.bottom + 82;
  A.line(ctx, u, b + d.lag * 0.6, d.ar, { x: L.right, y: y1, size: fit(ctx, d.ar, 54, L.width, F.arabic, true), weight: 700, color: C.blue, align: 'right', rtl: true, exit: exit + 0.05 });
  A.line(ctx, u, b + d.lag * 1.1, d.en2, { x: L.left, y: y1 + 70, size: fit(ctx, d.en2, 34, L.width, F.latin), weight: 500, color: C.grey, align: 'left', exit: exit + 0.1 });
  A.line(ctx, u, b + d.lag * 1.5, d.ar2, { x: L.right, y: y1 + 124, size: fit(ctx, d.ar2, 32, L.width, F.arabic, true), weight: 500, color: C.grey, align: 'right', rtl: true, exit: exit + 0.15 });
}
function label(ctx, u, u0, exit, text) {
  const k = u0 < 0 ? 1 : springU(u, u0, SPRING.snappy), ex = E.inCubic(prog(u, exit, exit + 0.3));
  if (k <= 0 || ex >= 1) return;
  ctx.save(); ctx.globalAlpha = clamp(k * 1.5) * (1 - ex); ctx.font = font(28, 600, F.latin); ctx.fillStyle = C.blue; ctx.textAlign = 'left';
  ctx.fillText(text, FRAME.x, 726 + (1 - k) * 12); ctx.restore();
}
function tiles(ctx, u, u0, IMG, checks, push = 1) {
  const s = 176, gx = 236, gy = 270, cx = CARD.x + CARD.w / 2, cy = CARD.y + CARD.h / 2 - 20;
  RES.forEach((r, i) => {
    const row = i < 3 ? 0 : 1, inRow = row ? 2 : 3, col = row ? i - 3 : i;
    const x = cx + (col - (inRow - 1) / 2) * gx * push - s / 2, y = cy + (row - 0.5) * gy * push - s / 2;
    const p = u0 == null ? 1 : springU(u, u0 + i * 0.35, SPRING.bouncy);
    A.tile(ctx, x, y, s, { img: IMG[r.img], p });
    if (p > 0.05) { ctx.save(); ctx.globalAlpha = clamp(p); ctx.font = font(24, 700, F.latin); ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.fillText(NAMES[i], x + s / 2, y + s + 38); ctx.restore(); }
    if (checks != null) { const c = springU(u, checks + i * 0.4, SPRING.bouncy); if (c > 0) { const ccx = x + s - 6, ccy = y + 6; ctx.save(); ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(ccx, ccy, 25 * c, 0, M.TAU); ctx.fill(); ctx.strokeStyle = C.white; ctx.lineWidth = 6 * c; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(ccx - 10 * c, ccy); ctx.lineTo(ccx - 3 * c, ccy + 8 * c); ctx.lineTo(ccx + 11 * c, ccy - 8 * c); ctx.stroke(); ctx.restore(); } }
  });
}
function resCard(ctx, u, i, IMG) {
  const r = RES[i], b = B0 + i * SPAN, img = IMG[r.img];
  ctx.fillStyle = '#F6F7FA'; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
  if (!img) return;
  const k = springU(u, b + 0.5, SPRING.gentle), drift = 1 + 0.06 * prog(u, b + 1, b + SPAN);
  const cx = CARD.x + CARD.w / 2, cy = CARD.y + CARD.h / 2 - 30 + (1 - k) * 80;
  let w, h;
  if (r.kind === 'book') {
    w = 380 * drift; h = w * img.height / img.width;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.035 * k); A.shadow(ctx, 50, 24, 0.28); ctx.fillStyle = C.white; ctx.fillRect(-w / 2, -h / 2, w, h); A.noShadow(ctx);
    ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
  } else {
    const bx = 330 * drift, sc = Math.min(bx / img.width, bx / img.height) * k; w = img.width * sc; h = img.height * sc;
    if (w > 1) ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h); w = bx; h = bx;
  }
  A.selection(ctx, cx - w / 2 - 18, cy - h / 2 - 18, w + 36, h + 36, { p: prog(u, b + 5, b + 5.8) });
  A.pill(ctx, 'PAID', cx, CARD.y + CARD.h - 82, { bg: C.blue, size: 34, align: 'center', p: springU(u, b + 2.6, SPRING.bouncy) });
}

const COVER = new URLSearchParams(location.search).get('cover');
function cover(ctx, kind, IMG) {
  A.paper(ctx); const top = kind === 'tiktok' ? 300 : 230;
  A.header(ctx, 1000, 'Learn UI/UX', { y: top });
  A.riseWords(ctx, 1000, 0, '5 paid UI/UX', { x: L.left, y: top + 210, size: 132, maxW: 1000, hl: [1], hlAt: 0 });
  A.riseWords(ctx, 1000, 0, 'resources.', { x: L.left, y: top + 345, size: 132 });
  const ar = '5 مصادر مدفوعة لتعلّم UI/UX';
  A.line(ctx, 1000, 0, ar, { x: L.right, y: top + 460, size: fit(ctx, ar, 68, L.width, 'CoverCairo, Jakarta', true), weight: 800, color: C.blue, align: 'right', rtl: true, family: 'CoverCairo, Jakarta' });
  ctx.save(); ctx.translate(0, top + 540 - CARD.y); tiles(ctx, 1000, null, IMG, null); ctx.restore();
}

M.film({
  fonts: [font(74, 800, F.latin), font(34, 500, F.latin), font(54, 700, F.arabic), font(32, 500, F.arabic)],
  images: { ref: AS + 'covers/refactoring-ui.png', prac: AS + 'covers/practical-ui.jpg', dmmt: AS + 'covers/dont-make-me-think.jpg', coursera: AS + 'logos/coursera.png', mobbin: AS + 'logos/mobbin.png' },
  hits: HITS,
  async init() { await Promise.all([F.arabic, ...(COVER ? ['CoverCairo'] : [])].flatMap((f) => [500, 600, 700, 800].map((w) => document.fonts.load(font(40, w, f), 'مصادر مدفوعة ٦').catch(() => {})))); },
  draw(ctx, u, t, IMG) {
    if (COVER) { cover(ctx, COVER, IMG); return; }
    if (u >= END) { A.endCard(ctx, u, END + 0.1); return; }
    A.paper(ctx); A.header(ctx, u, 'Learn UI/UX', { u0: -20 });
    if (u < B0) block(ctx, u, -20, B0 - 0.55, { title: "Don't pay for a course before this.", hl: [1], hlAt: -20, lag: 0, ar: 'لا تدفع ثمن دورة قبل هذا.', en2: '5 paid resources worth it.', ar2: '5 مصادر مدفوعة تستحق.' });
    RES.forEach((r, i) => { const b = B0 + i * SPAN, nb = i < 4 ? b + SPAN : RECAP; if (u >= b - 0.3 && u < nb) block(ctx, u, b, nb - 0.55, { n: i + 1, title: r.name, ar: r.ar, en2: r.en2, ar2: r.ar2, lag: 1 }); });
    if (u >= RECAP - 0.3) block(ctx, u, RECAP, END + 1, { title: 'Start free. Pay when ready.', hl: [2, 3, 4], hlAt: RECAP + 0.9, lag: 1, ar: 'ابدأ بالمجاني، وادفع حين تكون مستعدًا.', en2: 'Not sponsored. Save this list.', ar2: 'ليس إعلانًا. احفظ هذه القائمة.' });
    let done = 0; for (let i = 0; i < 5; i++) done += E.inOutCubic(prog(u, B0 + i * SPAN, B0 + i * SPAN + 0.8));
    A.progress(ctx, 5, done, { alpha: clamp(prog(u, B0 - 0.5, B0)) * (1 - prog(u, RECAP + 0.3, RECAP + 1)) });
    if (u < B0) label(ctx, u, -1, B0 - 0.4, 'Paid resources');
    RES.forEach((r, i) => { const b = B0 + i * SPAN, nb = i < 4 ? b + SPAN : RECAP; if (u >= b - 0.2 && u < nb) label(ctx, u, b + 0.3, nb - 0.4, r.site); });
    if (u >= RECAP) label(ctx, u, RECAP + 0.3, END + 1, 'Save this list');
    A.shadow(ctx, 40, 14, 0.08); rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.fillStyle = C.white; ctx.fill(); A.noShadow(ctx);
    ctx.save(); rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.clip();
    const scenes = [{ a: 0, z: B0, draw: () => { ctx.fillStyle = C.white; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h); tiles(ctx, u, null, IMG, null, 1 + 0.1 * E.outCubic(prog(u, 0, 5))); } },
      ...RES.map((r, i) => ({ a: B0 + i * SPAN, z: i < 4 ? B0 + (i + 1) * SPAN : RECAP, draw: () => resCard(ctx, u, i, IMG) })),
      { a: RECAP, z: END + 1, draw: () => { ctx.fillStyle = C.white; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h); tiles(ctx, u, RECAP + 0.4, IMG, RECAP + 1.4); } }];
    scenes.forEach((sc) => {
      if (u < sc.a - 0.3 || u >= sc.z + 1.2) return;
      const k = sc.a === 0 ? 1 : E.inOutCubic(prog(u, sc.a - 0.3, sc.a + 0.7));
      ctx.save(); ctx.translate(0, (1 - k) * CARD.h); A.shadow(ctx, 30, -10, 0.12); ctx.fillStyle = C.white; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h); A.noShadow(ctx); sc.draw(); ctx.restore();
    });
    ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = C.line; rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.stroke();
    A.selection(ctx, FRAME.x, FRAME.y, FRAME.w, FRAME.h, { p: 1 });
    if (u >= END - 0.9) A.circleCover(ctx, CARD.x + CARD.w / 2, CARD.y + CARD.h / 2, prog(u, END - 0.9, END - 0.02));
  },
});
