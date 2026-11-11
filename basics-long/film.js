// UI/UX basics for websites and apps (YouTube, 16:9). Pure function of time.
// Hook: "Websites and apps follow different rules." (shared/accroche.md) — frame 0 shows both faulty
// interfaces side by side. Then Part 1 (5 website basics), Part 2 (5 app basics), recap, end page.
// Fictional interfaces from ../shared/mockups.js. Text + SFX only.
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';
import { makeMockups } from '../shared/mockups.js';

const { E, prog, lerp, clamp, springU, springKeys, SPRING, font, rrect, bump } = M;
const A = makeAGS(M);
const MK = makeMockups(M, A);
const { C, F } = A;
const ease = E.inOutCubic;

// ------------------------------------------------------------------ layout + timeline
const COL = { l: 120, r: 1000 };
const FRAME = { x: 1080, y: 170, w: 720, h: 840 };
const CARD = { x: 1100, y: 190, w: 680, h: 800, r: 30 };
const SERIES = 'Learn UI/UX';
const SPAN = 22;
const T = { hook: 0, part1: 8, web0: 14, part2: 124, app0: 130, recap: 240, end: 256 };
const WEB_S0 = CARD.w / MK.web.w, APP_S0 = CARD.h / MK.app.h;

// ------------------------------------------------------------------ content
const HOOK = {
  title: 'Websites and apps follow different rules.', hl: [4, 5],
  ar: 'المواقع والتطبيقات لا تتبع نفس القواعد.', en2: '10 basics: 5 for websites, 5 for apps.', ar2: '١٠ أساسيات: ٥ للمواقع و٥ للتطبيقات.',
};
const PARTS = [
  { at: T.part1, until: T.web0, title: 'Part 1 · Websites', hl: [3], ar: 'الجزء الأول: المواقع', en2: 'Visitors scan. Help their eyes.', ar2: 'الزوّار يتصفّحون بسرعة. ساعد أعينهم.' },
  { at: T.part2, until: T.app0, title: 'Part 2 · Apps', hl: [3], ar: 'الجزء الثاني: التطبيقات', en2: 'Users tap with one thumb. Help their hands.', ar2: 'المستخدمون يلمسون بإبهام واحد. ساعد أيديهم.' },
];
const WEB = [
  { title: 'One clear headline', ar: 'عنوان واحد واضح', en2: 'Say what you do, not how great you are.', ar2: 'قل ماذا تقدّم، لا كم أنت رائع.',
    tip: 'Test it: ask someone what your site does after one glance.', tipAr: 'اختبره: اسأل شخصًا عمّا يقدّمه موقعك بعد نظرة واحدة.',
    label: 'Hero · headline', cam: [330, 270, 1.25], mark: 'headline', fixSfx: 'type' },
  { title: 'One main button', ar: 'زر رئيسي واحد', en2: 'Three equal buttons = no clear choice.', ar2: 'ثلاثة أزرار متساوية = لا خيار واضح.',
    tip: 'Secondary actions become links or outline buttons.', tipAr: 'الإجراءات الثانوية تصبح روابط أو أزرارًا بإطار فقط.',
    label: 'Hero · buttons', cam: [330, 330, 1.25], mark: 'buttons' },
  { title: 'Visual hierarchy', ar: 'التسلسل البصري', en2: 'Size, weight and contrast guide the eye.', ar2: 'الحجم والسُّمك والتباين توجّه العين.',
    tip: 'Squint at your page: the key element should still stand out.', tipAr: 'انظر إلى صفحتك بعينين نصف مغمضتين: يجب أن يبقى الأهم بارزًا.',
    label: 'Feature cards', cam: [480, 750, 0.95], mark: 'cards' },
  { title: 'Consistent spacing', ar: 'مسافات متّسقة', en2: 'One spacing scale: 8, 16, 24, 32.', ar2: 'مقياس مسافات واحد: 8، 16، 24، 32.',
    tip: 'Pick one scale and use only those values.', tipAr: 'اختر مقياسًا واحدًا واستخدم قيمه فقط.',
    label: 'Feature cards · spacing', cam: [480, 760, 0.95], mark: 'gaps', drive: (st, v) => { st.gaps = prog(v, 1.2, 2.0); } },
  { title: 'Readable text', ar: 'نص سهل القراءة', en2: 'Shorter lines, stronger contrast.', ar2: 'أسطر أقصر وتباين أقوى.',
    tip: 'Aim for about 50 to 75 characters per line.', tipAr: 'استهدف ما بين 50 و75 حرفًا تقريبًا في السطر.',
    label: 'Body text', cam: [480, 1100, 1.0], mark: 'body' },
];
const APPS = [
  { title: 'Thumb zone', ar: 'منطقة الإبهام', en2: 'Put the main action where the thumb rests.', ar2: 'ضع الإجراء الرئيسي حيث يستقر الإبهام.',
    tip: 'On a large phone, the top corners need two hands.', tipAr: 'في الهاتف الكبير، الزوايا العليا تحتاج إلى يدين.',
    label: 'Main action', cam: [195, 422, 1.0], mark: 'addTop', good: 'addBottom', drive: (st, v) => { st.thumb = prog(v, 1.2, 2.2) * (1 - prog(v, SPAN - 3, SPAN - 2)); } },
  { title: 'Big enough to tap', ar: 'أهداف لمس كافية', en2: 'At least 44 pt (Apple) or 48 dp (Google).', ar2: 'على الأقل 44 نقطة في Apple و48 dp في Google.',
    tip: 'Small icons are fine if the tap area around them is big.', tipAr: 'الأيقونات الصغيرة مقبولة إذا كانت منطقة اللمس حولها كبيرة.',
    label: 'Tap targets', cam: [195, 270, 1.9], mark: 'rows', drive: (st, v) => { st.targets = prog(v, 1.2, 2.0); } },
  { title: '3 to 5 tabs', ar: 'من 3 إلى 5 تبويبات', en2: 'More than five? Move the rest elsewhere.', ar2: 'أكثر من خمسة؟ انقل الباقي إلى مكان آخر.',
    tip: 'Extra sections can live in a profile or settings screen.', tipAr: 'يمكن وضع الأقسام الإضافية في شاشة الملف الشخصي أو الإعدادات.',
    label: 'Tab bar', cam: [195, 740, 1.9], mark: 'tabs' },
  { title: 'Feedback on every tap', ar: 'استجابة لكل لمسة', en2: 'Show it worked: pressed, loading, done.', ar2: 'أظهر أن اللمسة نجحت: ضغط، تحميل، تم.',
    tip: 'If it takes time, show progress. If it worked, say so.', tipAr: 'إن استغرق وقتًا فأظهر التقدّم، وإن نجح فقل ذلك.',
    label: 'Feedback', cam: [195, 640, 1.6], mark: 'button', cursor: true,
    drive: (st, v) => {
      st.press = Math.max(bump(v, 3.2, 0.35), bump(v, 6, 0.35));
      st.noFb = prog(v, 3.4, 3.8) * (1 - prog(v, 4.8, 5.2));
      st.loading = v > 6.2 && v < 8 ? prog(v, 6.2, 8) : 0; st.spin = v * 7;
      st.toast = prog(v, 8, 8.5) * (1 - prog(v, SPAN - 1.5, SPAN - 0.7));
    }, hits: [[3.2, 'tap', 'click'], [6, 'tap', 'click']] },
  { title: 'One task per screen', ar: 'مهمة واحدة لكل شاشة', en2: 'Split long forms into short steps.', ar2: 'قسّم النماذج الطويلة إلى خطوات قصيرة.',
    tip: 'Show the step number so people know how much is left.', tipAr: 'أظهر رقم الخطوة ليعرف المستخدم كم تبقّى.',
    label: 'Form', cam: [195, 422, 1.0], mark: 'form', drive: (st, v) => { st.form = ease(prog(v, 0.2, 1.5)); } },
];
const RECAP = {
  title: 'Same goal: make it easy.', hl: [2, 3, 4], ar: 'هدف واحد: اجعلها سهلة.',
  en2: 'Websites are scanned. Apps are tapped.', ar2: 'المواقع تُتصفَّح بالعين، والتطبيقات تُستخدم بالإبهام.',
};
const STEPS = [...WEB.map((s, i) => ({ ...s, kind: 'web', i, b: T.web0 + i * SPAN })), ...APPS.map((s, i) => ({ ...s, kind: 'app', i, b: T.app0 + i * SPAN }))];
const nextB = (k) => (k === 4 ? T.part2 : k === 9 ? T.recap : STEPS[k + 1].b);

// ------------------------------------------------------------------ hits
const HITS = [];
const hit = (b, label, sfx, o) => HITS.push(o ? [b, label, sfx, o] : [b, label, sfx]);
hit(0, 'hook on screen', 'click');
hit(0.5, 'hook motion', 'tick');
hit(1.6, 'scan', 'tick'); hit(3.2, 'thumb', 'tick'); hit(4.8, 'scan', 'tick');
PARTS.forEach((p) => { hit(p.at, `${p.title} title`, 'type', { n: 6, len: 0.6 }); hit(p.at + 0.6, `${p.title} arabic`, 'pop', { pitch: 'C#6' }); });
STEPS.forEach((s) => {
  const b = s.b;
  hit(b - 0.1, `${s.title} badge`, 'pop', { pitch: 'E6' });
  hit(b + 0.1, `${s.title} title`, 'type', { n: 5, len: 0.5 });
  hit(b + 2.4, `${s.title} mistake`, 'blip', { pitch: 'C5' });
  hit(b + 5, `${s.title} fix`, s.fixSfx || 'click', s.fixSfx === 'type' ? { n: 10, len: 1.3 } : undefined);
  hit(b + 8.2, `${s.title} fixed`, 'bell', { pitch: 'E6' });
  hit(b + 10, `${s.title} tip`, 'pop', { pitch: 'A6' });
  (s.hits || []).forEach(([v, l, sfx, o]) => hit(b + v, `${s.title} ${l}`, sfx, o));
});
hit(T.recap, 'recap title', 'type', { n: 6, len: 0.6 });
hit(T.recap + 1.4, 'recap web', 'pop', { pitch: 'A5' });
hit(T.recap + 2.2, 'recap app', 'pop', { pitch: 'E6' });
hit(T.end - 0.9, 'circle to end', 'click');
hit(T.end + 0.1, 'keep it simple', 'pop', { pitch: 'A5' });
hit(T.end + 2.2, 'follow pill', 'pop', { pitch: 'A6' });

// ------------------------------------------------------------------ interface state
function stateFor(kind, u) {
  const st = { p: [0, 0, 0, 0, 0], bad: [], good: [] };
  const MOCK = MK[kind];
  STEPS.filter((s) => s.kind === kind).forEach((s) => {
    const v = u - s.b;
    st.p[s.i] = u >= s.b + 8 ? 1 : u >= s.b + 5 ? ease(prog(v, 5, 8)) : 0;
    if (u >= s.b - 0.3 && u < s.b + SPAN) {
      const pb = prog(v, 2.4, 2.9) * (1 - prog(v, 4.7, 5.1));
      if (pb > 0) st.bad.push({ r: MOCK.R[s.mark], p: pb });
      const pg = prog(v, 8.2, 8.7) * (1 - prog(v, SPAN - 0.9, SPAN - 0.4));
      if (pg > 0) st.good.push({ r: MOCK.R[s.good || s.mark], p: pg });
      if (s.drive) s.drive(st, v);
    }
  });
  return st;
}
const WEB_CAM = [[-10, [480, 650, 0.82]], ...WEB.map((s, i) => [T.web0 + i * SPAN - 0.4, s.cam])];
const APP_CAM = [[-10, [195, 422, 1.0]], ...APPS.map((s, i) => [T.app0 + i * SPAN - 0.4, s.cam])];
function drawMock(ctx, kind, st, cam, x0 = CARD.x, y0 = CARD.y, w = CARD.w, h = CARD.h, s0 = kind === 'web' ? WEB_S0 : APP_S0) {
  const [fx, fy, z] = cam, s = s0 * z;
  st.px = 1 / s;
  ctx.save(); ctx.translate(x0 + w / 2, y0 + h / 2); ctx.scale(s, s); ctx.translate(-fx, -fy);
  MK[kind].draw(ctx, st); ctx.restore();
  return { map: (px, py) => [x0 + w / 2 + (px - fx) * s, y0 + h / 2 + (py - fy) * s] };
}

// ------------------------------------------------------------------ text column
function fitSize(ctx, str, max, weight, family, maxW, rtl = false) {
  ctx.font = font(max, weight, family); ctx.direction = rtl ? 'rtl' : 'ltr';
  const w = ctx.measureText(str).width; ctx.direction = 'ltr';
  return Math.min(max, Math.floor(max * maxW / w));
}
function textBlock(ctx, u, b, exit, d) {
  const hasBadge = d.n != null, cw = COL.r - COL.l;
  const tx = hasBadge ? COL.l + 100 : COL.l;
  ctx.letterSpacing = '0px';
  const size = hasBadge ? Math.min(76, fitSize(ctx, d.title, 76, 800, F.latin, (COL.r - tx) * 1.03)) : (d.size || 84);
  if (hasBadge) A.badge(ctx, d.n, COL.l, 278, springU(u, b - 0.15, SPRING.bouncy) * (1 - E.inCubic(prog(u, exit, exit + 0.4))));
  const t = A.riseWords(ctx, u, b, d.title, { x: tx, y: hasBadge ? 344 : 330, size, maxW: COL.r - tx, stagger: 0.09, hl: d.hl || [], hlAt: d.hlAt, exit });
  const y1 = t.bottom + 92, lag = d.lag == null ? 1 : d.lag;
  A.line(ctx, u, b + 0.6 * lag, d.ar, { x: COL.r, y: y1, size: fitSize(ctx, d.ar, 58, 700, F.arabic, cw, true), weight: 700, color: C.blue, align: 'right', rtl: true, exit: exit + 0.05 });
  A.line(ctx, u, b + 1.1 * lag, d.en2, { x: COL.l, y: y1 + 76, size: fitSize(ctx, d.en2, 38, 500, F.latin, cw), weight: 500, color: C.grey, align: 'left', exit: exit + 0.1 });
  A.line(ctx, u, b + 1.5 * lag, d.ar2, { x: COL.r, y: y1 + 134, size: fitSize(ctx, d.ar2, 35, 500, F.arabic, cw, true), weight: 500, color: C.grey, align: 'right', rtl: true, exit: exit + 0.15 });
  if (d.tip) {
    const ex = E.inCubic(prog(u, exit, exit + 0.4));
    const w = A.pill(ctx, 'TIP', COL.l, y1 + 206, { bg: C.ink, size: 26, p: springU(u, b + 10, SPRING.bouncy) * (1 - ex) });
    A.riseWords(ctx, u, b + 10.2, d.tip, { x: COL.l + w + 18, y: y1 + 244, size: 32, weight: 700, maxW: cw - w - 18, stagger: 0.05, track: -0.01, lineH: 1.25, exit: exit + 0.2 });
    A.line(ctx, u, b + 11, d.tipAr, { x: COL.r, y: y1 + 360, size: fitSize(ctx, d.tipAr, 32, 600, F.arabic, cw, true), weight: 600, color: C.ink, align: 'right', rtl: true, exit: exit + 0.25 });
  }
}
function label(ctx, u, u0, exit, text) {
  const k = u0 < 0 ? 1 : springU(u, u0, SPRING.snappy), ex = E.inCubic(prog(u, exit, exit + 0.3));
  if (k <= 0 || ex >= 1) return;
  ctx.save(); ctx.globalAlpha = clamp(k * 1.5) * (1 - ex);
  ctx.font = font(28, 600, F.latin); ctx.fillStyle = C.blue; ctx.textAlign = 'left';
  ctx.fillText(text, FRAME.x, 146 + (1 - k) * 12); ctx.restore();
}

// ------------------------------------------------------------------ card scenes
function hookScene(ctx, u) {
  const push = 1 + 0.05 * ease(prog(u, 0, 7));
  const web = { p: [0, 0, 0, 0, 0], bad: ['headline', 'buttons', 'cards'].map((k, j) => ({ r: MK.web.R[k], p: 1 + 0.08 * Math.sin((u + j) * 3) })), good: [], scan: prog(u, 0, 6) };
  const c = (u % 3) / 3;
  const app = { p: [0, 0, 0, 0, 0], bad: [{ r: MK.app.R.addTop, p: 1 + 0.08 * Math.sin(u * 3) }], good: [], thumb: 0.75 + 0.25 * Math.sin(u * 2.2), reach: E.outCubic(Math.min(1, c * 1.6)) * (1 - prog(c, 0.8, 1)) };
  ctx.fillStyle = '#F1F3F7'; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
  ctx.save(); rrect(ctx, CARD.x + 14, CARD.y + 120, 380, 540, 14); ctx.clip(); ctx.fillStyle = C.white; ctx.fillRect(CARD.x + 14, CARD.y + 120, 380, 540);
  drawMock(ctx, 'web', web, [480, 650, 1], CARD.x + 14, CARD.y + 120, 380, 540, (380 / 960) * push); ctx.restore();
  drawMock(ctx, 'app', app, [195, 422, 1], CARD.x + 404, CARD.y + 100, 262, 580, (580 / 872) * push);
  ctx.font = font(24, 700, F.latin); ctx.fillStyle = C.grey; ctx.textAlign = 'center';
  ctx.fillText('Website', CARD.x + 204, CARD.y + 98); ctx.fillText('App', CARD.x + 535, CARD.y + 78);
}
function recapScene(ctx, u) {
  ctx.fillStyle = '#F1F3F7'; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
  const full = () => ({ p: [1, 1, 1, 1, 1], bad: [], good: [] });
  const k1 = springU(u, T.recap + 1.4, SPRING.gentle), k2 = springU(u, T.recap + 2.2, SPRING.gentle);
  if (k1 > 0) {
    ctx.save(); ctx.globalAlpha = clamp(k1 * 1.5); ctx.translate(0, (1 - k1) * 60);
    ctx.save(); rrect(ctx, CARD.x + 14, CARD.y + 120, 380, 540, 14); ctx.clip(); ctx.fillStyle = C.white; ctx.fillRect(CARD.x + 14, CARD.y + 120, 380, 540);
    drawMock(ctx, 'web', full(), [480, 650, 1], CARD.x + 14, CARD.y + 120, 380, 540, 380 / 960); ctx.restore();
    ctx.font = font(24, 700, F.latin); ctx.fillStyle = C.green; ctx.textAlign = 'center'; ctx.fillText('Website · scanned', CARD.x + 204, CARD.y + 98);
    ctx.restore();
  }
  if (k2 > 0) {
    ctx.save(); ctx.globalAlpha = clamp(k2 * 1.5); ctx.translate(0, (1 - k2) * 60);
    drawMock(ctx, 'app', full(), [195, 422, 1], CARD.x + 404, CARD.y + 100, 262, 580, 580 / 872);
    ctx.font = font(24, 700, F.latin); ctx.fillStyle = C.green; ctx.textAlign = 'center'; ctx.fillText('App · tapped', CARD.x + 535, CARD.y + 78);
    ctx.restore();
  }
}

// ------------------------------------------------------------------ thumbnail (?cover=youtube)
const COVER = new URLSearchParams(location.search).get('cover');
function thumbnail(ctx) {
  const U = 1000;
  A.paper(ctx);
  A.header(ctx, U, SERIES, { y: 70, left: 110, right: 1810 });
  A.riseWords(ctx, U, 0, 'UI/UX basics:', { x: 110, y: 330, size: 140, maxW: 1100 });
  A.riseWords(ctx, U, 0, 'websites & apps', { x: 110, y: 480, size: 140, maxW: 1100, hl: [0, 1, 2], hlAt: 0 });
  A.line(ctx, U, 0, 'أساسيات UI/UX للمواقع والتطبيقات', { x: 110, y: 640, size: 72, weight: 800, color: C.blue, align: 'left', rtl: true, family: 'CoverCairo, Jakarta' });
  A.pill(ctx, '10 BASICS', 110, 720, { bg: C.ink, size: 52 });
  const full = { p: [1, 1, 1, 1, 1], bad: [], good: [] };
  ctx.save(); A.shadow(ctx, 40, 16, 0.14); rrect(ctx, 1150, 210, 420, 580, 18); ctx.fillStyle = C.white; ctx.fill(); A.noShadow(ctx);
  rrect(ctx, 1150, 210, 420, 580, 18); ctx.clip(); drawMock(ctx, 'web', { ...full }, [480, 640, 1], 1150, 210, 420, 580, 420 / 960); ctx.restore();
  drawMock(ctx, 'app', { ...full }, [195, 422, 1], 1520, 300, 300, 640, 640 / 872);
}

// ------------------------------------------------------------------ film
M.film({
  fonts: [font(76, 800, F.latin), font(34, 500, F.latin), font(54, 700, F.arabic), font(32, 500, F.arabic)],
  images: {},
  hits: HITS,
  async init() {
    const ar = 'مصادر مجانية لتعلّم ٦';
    const fams = [F.arabic, ...(COVER ? ['CoverCairo'] : [])];
    await Promise.all(fams.flatMap((fam) => [500, 600, 700, 800].map((w) => document.fonts.load(font(40, w, fam), ar).catch(() => {}))));
  },
  draw(ctx, u) {
    if (COVER) { thumbnail(ctx); return; }
    if (u >= T.end) { A.endCardWide(ctx, u, T.end + 0.1); return; }
    A.paper(ctx);
    A.header(ctx, u, SERIES, { u0: -20, y: 56, left: COL.l, right: 1800 });

    // text column
    if (u < T.part1) textBlock(ctx, u, -20, T.part1 - 0.55, { ...HOOK, hlAt: -20, size: 84, lag: 0 });
    PARTS.forEach((p) => { if (u >= p.at - 0.3 && u < p.until) textBlock(ctx, u, p.at, p.until - 0.55, { ...p, hlAt: p.at + 1.0, size: 96 }); });
    STEPS.forEach((s, k) => { if (u >= s.b - 0.3 && u < nextB(k)) textBlock(ctx, u, s.b, nextB(k) - 0.55, { ...s, n: s.i + 1 }); });
    if (u >= T.recap - 0.3) textBlock(ctx, u, T.recap, T.end + 1, { ...RECAP, hlAt: T.recap + 1.0, size: 72 });

    // progress bar: 5 per part
    [[T.web0, T.part2], [T.app0, T.recap]].forEach(([a, z]) => {
      if (u < a - 0.5 || u >= z + 0.3) return;
      let done = 0;
      for (let i = 0; i < 5; i++) done += ease(prog(u, a + i * SPAN, a + i * SPAN + 0.8));
      A.progress(ctx, 5, done, { y: 990, x0: COL.l, width: COL.r - COL.l, alpha: clamp(prog(u, a - 0.5, a)) * (1 - prog(u, z - 0.3, z + 0.3)) });
    });

    // labels
    if (u < T.part1) label(ctx, u, -1, T.part1 - 0.4, 'Website vs app');
    PARTS.forEach((p, j) => { if (u >= p.at && u < p.until) label(ctx, u, p.at + 0.3, p.until - 0.4, j ? 'Mobile app' : 'Landing page'); });
    STEPS.forEach((s, k) => { if (u >= s.b - 0.2 && u < nextB(k)) label(ctx, u, s.b + 0.3, nextB(k) - 0.4, s.label); });
    if (u >= T.recap) label(ctx, u, T.recap + 0.3, T.end + 1, 'After');

    // card: scenes slide up over each other
    A.shadow(ctx, 40, 14, 0.08); rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.fillStyle = C.white; ctx.fill(); A.noShadow(ctx);
    ctx.save(); rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.clip();
    let appView = null;
    const scenes = [
      { a: 0, z: T.part1, draw: () => hookScene(ctx, u) },
      { a: T.part1, z: T.part2, draw: () => { ctx.fillStyle = C.white; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h); drawMock(ctx, 'web', stateFor('web', u), springKeys(u, WEB_CAM, SPRING.gentle)); } },
      { a: T.part2, z: T.recap, draw: () => { ctx.fillStyle = MK.app.bg; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h); appView = drawMock(ctx, 'app', stateFor('app', u), springKeys(u, APP_CAM, SPRING.gentle)); } },
      { a: T.recap, z: T.end + 1, draw: () => recapScene(ctx, u) },
    ];
    scenes.forEach((sc) => {
      if (u < sc.a - 0.3 || u >= sc.z + 1.2) return;
      const k = sc.a === 0 ? 1 : ease(prog(u, sc.a - 0.3, sc.a + 0.7));
      ctx.save(); ctx.translate(0, (1 - k) * CARD.h);
      A.shadow(ctx, 30, -10, 0.12); ctx.fillStyle = C.white; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h); A.noShadow(ctx);
      sc.draw(); ctx.restore();
    });
    ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = C.line; rrect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.stroke();
    // cursor for "Feedback on every tap"
    const fb = STEPS.find((s) => s.cursor), v = u - fb.b;
    if (appView && v > 1.6 && v < 10) {
      const [bx, by] = appView.map(195, 694);
      const m = ease(prog(v, 1.6, 3.0));
      A.cursor(ctx, lerp(1760, bx, m), lerp(1060, by, m), { press: Math.max(bump(v, 3.2, 0.35), bump(v, 6, 0.35)), alpha: 1 - prog(v, 9.2, 10) });
      A.ripple(ctx, bx, by, prog(v, 3.2, 3.8)); A.ripple(ctx, bx, by, prog(v, 6, 6.6));
    }
    A.selection(ctx, FRAME.x, FRAME.y, FRAME.w, FRAME.h, { p: 1 });
    if (u >= T.end - 0.9) A.circleCover(ctx, CARD.x + CARD.w / 2, CARD.y + CARD.h / 2, prog(u, T.end - 0.9, T.end - 0.02));
  },
});
