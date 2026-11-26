// The UI/UX toolkit: 14 tools from design to code — YouTube long video 16:9, same kinetic look as the
// Short (tools-uiux): dark software grays, IBM Plex, springs, masks, zoom-through, motion blur, no orange.
// Layout: text column on the left (logo tile, name, what it does, a tip), live vignette on the right.
// Vignettes are drawn in the Short's coordinates (area x 80..1000, y 280..1180) and mapped to the right zone.
// Tools without a logo file get a text tile with their name (no redrawn logos).
import * as M from './lib/motion.js';

const { W, H, clamp, lerp, E, spring, TAU, hash01 } = M;
const B = 60 / 128;
const X0 = 110, XC = 860;                                  // text column
const F = { title: 'Plex', mono: 'PlexMono', ar: 'PlexAr', serif: 'Serif', naskh: 'Naskh' };
const INK = '#EDEDED', SUB = '#A8A8A8', SEL = '#0D99FF', END_BLUE = '#0C8CE9', GREEN = '#30A46C';
const VS = 0.9, VX = 1000, VY = 160;                      // vignette mapping (short coords -> screen)

// ------------------------------------------------------------------ tools
const T = (key, name, part, bg, en, ar, tip, tipAr, img, extra = {}) => ({ key, name, part, bg, en, ar, tip, tipAr, img, ...extra });
const TOOLS = [
  T('figma', 'FIGMA', 1, '#2C2C2C', 'DESIGN · COMPONENTS · PROTOTYPES', 'تصميم الواجهات والمكوّنات والنماذج الأولية', 'BUILD A COMPONENT ONCE, REUSE IT EVERYWHERE.', 'أنشئ المكوّن مرة واحدة وأعد استخدامه في كل مكان.', 'figma'),
  T('figjam', 'FIGJAM', 1, '#1C1C1C', 'USER FLOWS · IDEAS · WORKSHOPS', 'مسارات المستخدم والأفكار وورشات العمل', 'MAP THE FLOW BEFORE YOU DESIGN SCREENS.', 'ارسم مسار المستخدم قبل تصميم الشاشات.', 'figjam', { wide: true }),
  T('fonts', 'GOOGLE FONTS', 1, '#1E1E1E', 'FREE FONTS, LATIN AND ARABIC', 'خطوط مجانية بالعربية واللاتينية', 'TWO FAMILIES ARE ENOUGH: TITLES AND TEXT.', 'عائلتان تكفيان: واحدة للعناوين وأخرى للنصوص.', null, { label: 'Google Fonts' }),
  T('lucide', 'LUCIDE', 1, '#1A1A1A', 'OPEN-SOURCE ICON SET', 'مكتبة أيقونات مفتوحة المصدر', 'USE ONE ICON FAMILY FOR THE WHOLE PRODUCT.', 'استخدم عائلة أيقونات واحدة في المنتج كله.', null, { label: 'Lucide' }),
  T('contrast', 'CONTRAST', 1, '#262626', 'WEBAIM CONTRAST CHECKER', 'تحقّق من تباين ألوان النصوص', 'AIM FOR 4.5:1 OR MORE FOR BODY TEXT.', 'استهدف تباينًا لا يقل عن 4.5:1 للنصوص.', 'webaim', { wide: true }),
  T('maze', 'MAZE', 1, '#212121', 'TEST YOUR PROTOTYPE WITH REAL USERS', 'اختبر نموذجك الأولي مع مستخدمين حقيقيين', 'GIVE ONE TASK, WATCH WHERE PEOPLE CLICK.', 'أعطِ مهمة واحدة ولاحظ أين ينقر المستخدمون.', null, { label: 'Maze' }),
  T('devmode', 'DEV MODE', 2, '#2C2C2C', 'FIGMA DEV MODE: SPECS AND CODE', 'المقاسات والكود جاهزة للمطوّرين', 'MARK A SCREEN "READY FOR DEV" WHEN IT IS DONE.', 'علّم الشاشة بأنها جاهزة للتطوير عند اكتمالها.', 'figma'),
  T('framer', 'FRAMER · WEBFLOW', 2, '#141414', 'PUBLISH A WEBSITE WITHOUT CODE', 'انشر موقعًا دون كتابة كود', 'GREAT FOR PORTFOLIOS AND LANDING PAGES.', 'مثالية لمعرض الأعمال وصفحات الهبوط.', null, { label: 'Framer · Webflow', wide: true }),
  T('vscode', 'VS CODE', 3, '#1F1F1F', 'WRITE AND EDIT YOUR CODE', 'محرّر لكتابة الكود وتعديله', 'ADD PRETTIER TO FORMAT YOUR CODE ON SAVE.', 'أضف Prettier لتنسيق الكود عند الحفظ.', 'vscode'),
  T('devtools', 'DEVTOOLS', 3, '#202124', 'INSPECT · DEBUG · TEST ON MOBILE', 'افحص الصفحة واختبرها على الجوال', 'USE DEVICE MODE TO CHECK EVERY SCREEN SIZE.', 'استخدم وضع الأجهزة لفحص كل مقاس شاشة.', 'chrome'),
  T('github', 'GITHUB', 3, '#0D1117', 'SAVE VERSIONS · WORK AS A TEAM', 'احفظ النسخ واعمل مع فريقك', 'SMALL COMMITS WITH CLEAR MESSAGES.', 'تعديلات صغيرة برسائل واضحة.', 'github'),
  T('tailwind', 'TAILWIND CSS', 3, '#0F172A', 'STYLE WITH UTILITY CLASSES', 'نسّق الواجهة بأصناف جاهزة', 'YOUR SPACING AND COLORS BECOME A SYSTEM.', 'مسافاتك وألوانك تصبح نظامًا موحّدًا.', null, { label: 'Tailwind CSS', wide: true }),
  T('storybook', 'STORYBOOK', 3, '#181818', 'BUILD AND TEST COMPONENTS ONE BY ONE', 'ابنِ المكوّنات واختبرها كلًّا على حدة', 'ONE STORY FOR EACH STATE OF A COMPONENT.', 'قصة لكل حالة من حالات المكوّن.', null, { label: 'Storybook', wide: true }),
  T('claude', 'CLAUDE CODE', 3, '#1A1A1A', 'AN AI ASSISTANT IN YOUR TERMINAL', 'مساعد ذكاء اصطناعي في الطرفية', 'ASK IT TO REVIEW YOUR UI FOR ACCESSIBILITY.', 'اطلب منه مراجعة واجهتك من ناحية إمكانية الوصول.', null, { label: 'Claude Code', wide: true }),
];
const PARTS = [
  { n: 1, en: 'DESIGN', ar: 'التصميم', count: '6 TOOLS', countAr: 'ست أدوات' },
  { n: 2, en: 'DESIGN TO CODE', ar: 'من التصميم إلى الكود', count: '2 TOOLS', countAr: 'أداتان' },
  { n: 3, en: 'DEV', ar: 'التطوير', count: '6 TOOLS', countAr: 'ست أدوات' },
];
// timeline (beats): hook 8, then for each part: card 6 + tools x 22
const HOOK = 8, CARD = 6, SPAN = 22;
const SCENES = [{ kind: 'hook', b0: 0, len: HOOK }];
{
  let b = HOOK;
  PARTS.forEach((p) => {
    SCENES.push({ kind: 'part', part: p, b0: b, len: CARD }); b += CARD;
    TOOLS.filter((x) => x.part === p.n).forEach((x) => { x.b0 = b; SCENES.push({ kind: 'tool', tool: x, b0: b, len: SPAN }); b += SPAN; });
  });
  SCENES.push({ kind: 'recap', b0: b, len: 16 }); b += 16;
  SCENES.push({ kind: 'end', b0: b, len: 10 });
}
TOOLS.forEach((x, i) => { x.i = i; });
const RECAP = SCENES.find((s) => s.kind === 'recap').b0, END = SCENES.find((s) => s.kind === 'end').b0;
SCENES.forEach((s, i) => { s.next = SCENES[i + 1]; s.dir = i % 2 ? 'up' : 'left'; });

// ------------------------------------------------------------------ sound (beats)
const HITS = [];
const hit = (b, l, s, o) => HITS.push(o ? [b, l, s, o] : [b, l, s]);
hit(0, 'hook slam', 'thud', { pitch: 'A1' }); hit(0, 'hook whoosh', 'whoosh', { len: 0.35 });
hit(1.5, 'pen anchor', 'tok', { pitch: 'E5' }); hit(3, 'pen anchor', 'tok', { pitch: 'B5' }); hit(4.5, 'pen anchor', 'tok', { pitch: 'E5' });
hit(HOOK, 'riser into wipe', 'riser', { len: 1.2 }); hit(HOOK, 'wipe lands', 'impact');
SCENES.forEach((s) => {
  const b = s.b0;
  if (s.kind === 'part') { if (s.part.n > 1) hit(b, 'push', 'whoosh', { len: 0.45 }); hit(b + 0.1, `part ${s.part.n}`, 'sub'); hit(b + 0.6, 'part title', 'whoosh', { len: 0.3 }); }
  if (s.kind === 'tool') {
    const x = s.tool, i = x.i;
    if (x.key !== 'figjam') hit(b, `${x.key} push`, 'whoosh', { len: 0.45 }); else { hit(b, 'zoom through', 'whoosh', { len: 0.5 }); hit(b, 'zoom sub', 'sub'); }
    hit(b + 0.3, `${x.key} logo`, 'pop', { pitch: ['C6', 'D6', 'E6', 'G5', 'A5', 'B5'][i % 6] });
    hit(b + 0.9, `${x.key} title`, 'whoosh', { len: 0.25 });
    hit(b + 12, `${x.key} tip`, 'tok', { pitch: 'G5' });
  }
});
const tb = (k) => TOOLS.find((x) => x.key === k).b0;
{ const f = tb('figma'); hit(f + 2.6, 'circle to window', 'boing', { pitch: 'C4', to: 'G4' }); [0, 1, 2, 3, 4].forEach((i) => hit(f + 3.6 + i * 0.25, `layer ${i}`, 'blip', { pitch: ['E6', 'G6', 'A6', 'B6', 'D7'][i] })); [0, 1, 2].forEach((i) => hit(f + 5 + i * 0.4, `frame ${i}`, 'pop', { pitch: ['C5', 'E5', 'G5'][i] })); hit(f + 7, 'selection', 'click'); hit(f + SPAN - 1.1, 'riser into zoom', 'riser', { len: 0.5 }); }
{ const j = tb('figjam'); [0, 1, 2].forEach((i) => hit(j + 3 + i * 0.6, `sticky ${i}`, 'thud', { pitch: ['C3', 'E3', 'G3'][i] })); [0, 1].forEach((i) => hit(j + 5.6 + i, `connector ${i}`, 'whoosh', { len: 0.3 })); hit(j + 8, 'grab', 'click'); hit(j + 10, 'drop', 'tok', { pitch: 'C5' }); }
{ const g = tb('fonts'); [0, 1, 2, 3].forEach((i) => hit(g + 3 + i * 1.6, `font ${i}`, 'tok', { pitch: ['C5', 'E5', 'G5', 'C6'][i] })); hit(g + 10, 'pairing card', 'thud', { pitch: 'E2' }); }
{ const l = tb('lucide'); [0, 1, 2, 3, 4, 5].forEach((i) => hit(l + 3 + i * 0.5, `icon ${i}`, 'blip', { pitch: ['C6', 'D6', 'E6', 'G6', 'A6', 'C7'][i] })); hit(l + 9, 'stroke change', 'boing', { pitch: 'C4', to: 'E4' }); }
{ const c = tb('contrast'); hit(c + 3, 'swatches', 'pop', { pitch: 'A5' }); for (let i = 0; i < 10; i++) hit(c + 4.5 + i * 0.3, `ratio ${i}`, 'tick'); hit(c + 6.2, 'AA', 'bell', { pitch: 'E6' }); hit(c + 7.4, 'AAA', 'bell', { pitch: 'A6' }); }
{ const z = tb('maze'); hit(z + 3, 'phone', 'thud', { pitch: 'E2' }); hit(z + 4, 'task', 'click'); for (let i = 0; i < 9; i++) hit(z + 5.5 + i * 0.25, `click ${i}`, 'tick'); hit(z + 9.5, 'path', 'whoosh', { len: 0.3 }); hit(z + 10.5, 'task done', 'bell', { pitch: 'E6' }); }
{ const d = tb('devmode'); hit(d + 3, 'frame', 'thud', { pitch: 'E2' }); [0, 1].forEach((i) => hit(d + 4.5 + i * 0.6, `redline ${i}`, 'blip', { pitch: 'A6' })); hit(d + 6, 'code panel', 'whoosh', { len: 0.3 }); hit(d + 6.5, 'code', 'type', { n: 16, len: 2.4 }); hit(d + 10, 'ready for dev', 'bell', { pitch: 'E6' }); }
{ const r = tb('framer'); hit(r + 3, 'artboard', 'thud', { pitch: 'E2' }); hit(r + 6, 'publish click', 'click'); hit(r + 6.4, 'to browser', 'riser', { len: 0.6 }); hit(r + 7, 'browser', 'boing', { pitch: 'C4', to: 'G4' }); hit(r + 9.6, 'live', 'bell', { pitch: 'E6' }); }
{ const v = tb('vscode'); hit(v + 3, 'editor', 'thud', { pitch: 'E2' }); hit(v + 4, 'typing', 'type', { n: 22, len: 2.6 }); hit(v + 10, 'autocomplete', 'blip', { pitch: 'A6' }); hit(v + 11, 'accept', 'click'); }
{ const d = tb('devtools'); hit(d + 3, 'page', 'thud', { pitch: 'E2' }); hit(d + 5, 'inspect', 'click'); hit(d + 7.5, 'device', 'riser', { len: 0.6 }); hit(d + 7.5, 'squeeze', 'boing', { pitch: 'G4', to: 'C4' }); }
{ const g = tb('github'); [0, 1, 2, 3, 4].forEach((i) => hit(g + [3, 3.7, 4.4, 5.1, 9.4][i], `commit ${i}`, 'pop', { pitch: ['C5', 'D5', 'E5', 'G5', 'A5'][i] })); hit(g + 4.0, 'branch', 'whoosh', { len: 0.3 }); hit(g + 10, 'merged', 'bell', { pitch: 'E6' }); }
{ const t = tb('tailwind'); hit(t + 3, 'editor', 'thud', { pitch: 'E2' }); [0, 1, 2, 3, 4, 5].forEach((i) => { hit(t + 4 + i * 1.1, `class ${i}`, 'type', { n: 4, len: 0.4 }); hit(t + 4.5 + i * 1.1, `style ${i}`, 'pop', { pitch: ['C5', 'D5', 'E5', 'G5', 'A5', 'C6'][i] }); }); }
{ const s = tb('storybook'); hit(s + 3, 'ui', 'thud', { pitch: 'E2' }); [0, 1, 2, 3].forEach((i) => hit(s + 4.5 + i * 1.6, `story ${i}`, 'click')); }
{ const c = tb('claude'); hit(c + 3, 'terminal', 'thud', { pitch: 'E2' }); hit(c + 3.8, 'prompt', 'type', { n: 18, len: 2.2 }); [0, 1, 2].forEach((i) => hit(c + 7 + i * 0.6, `line ${i}`, 'blip', { pitch: ['E6', 'G6', 'B6'][i] })); hit(c + 9.4, 'diff', 'whoosh', { len: 0.3 }); hit(c + 11, 'done', 'bell', { pitch: 'E6' }); }
hit(RECAP, 'recap push', 'whoosh', { len: 0.45 }); TOOLS.forEach((x, i) => hit(RECAP + 1.2 + i * 0.2, `tile ${i}`, 'pop', { pitch: ['C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'D6'][i % 7] }));
hit(END, 'end wipe', 'impact'); hit(END + 2, 'follow', 'tick');

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
const fit = (ctx, s, max, maxW, w = 700, family = F.title) => Math.min(max, Math.floor(max * maxW / measure(ctx, s, max, w, family)));
const rr = (ctx, x, y, w, h, r, fill, stroke, lw = 2) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } };
function drawImg(ctx, im, cx, cy, maxW, maxH) { if (!im) return; const k = Math.min(maxW / im.width, maxH / im.height); ctx.drawImage(im, cx - im.width * k / 2, cy - im.height * k / 2, im.width * k, im.height * k); }
function cursor(ctx, x, y, color = '#FFFFFF', label = null, tagColor = SEL) {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = color; ctx.strokeStyle = '#111'; ctx.lineWidth = 2.5; ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(0, 46); ctx.lineTo(12, 35); ctx.lineTo(22, 56); ctx.lineTo(30, 52); ctx.lineTo(20, 31); ctx.lineTo(36, 31); ctx.closePath(); ctx.fill(); ctx.stroke();
  if (label) { ctx.font = `700 22px ${F.title}`; const w = ctx.measureText(label).width + 22; rr(ctx, 30, 50, w, 36, 8, tagColor); txt(ctx, label, 41, 75, 22, { color: '#FFFFFF' }); }
  ctx.restore();
}
// white tile with the logo, or with the tool's name when there is no logo file
function tile(ctx, x, IMG, cx, cy, w, h, r = 18) {
  rr(ctx, cx - w / 2, cy - h / 2, w, h, r, '#FFFFFF');
  if (x.img && IMG[x.img]) drawImg(ctx, IMG[x.img], cx, cy, w * 0.74, h * 0.7);
  else { const s = fit(ctx, x.label, h * 0.34, w * 0.8); txt(ctx, x.label, cx, cy + s * 0.36, s, { color: '#161616', align: 'center' }); }
}
function topline(ctx, color, label) {
  txt(ctx, 'LEARN UI/UX', X0, 84, 24, { w: 600, color, family: F.mono });
  txt(ctx, 'AG STUDIO', W - X0, 84, 24, { w: 600, color, align: 'right', family: F.mono });
  if (label) txt(ctx, label, X0, 140, 24, { w: 600, color, family: F.mono });
}
// the text column of a tool scene
function column(ctx, v, x, IMG) {
  const n = String(x.i + 1).padStart(2, '0'), part = PARTS[x.part - 1];
  topline(ctx, SUB, `PART ${part.n} · ${part.en} · ${n} / 14`);
  const pop = spr(v, 0.25, { stiffness: 260, damping: 13 }), tw = x.wide ? 300 : 150, th = 150;
  if (pop > 0) { ctx.save(); ctx.translate(X0 + tw / 2, 290); ctx.scale(pop, pop); tile(ctx, x, IMG, 0, 0, tw, th, 22); ctx.restore(); }
  const CW = XC - X0;
  maskUp(ctx, x.name, X0 - 4, 500, fit(ctx, x.name, 130, CW), ez(v, 0.9, 2.0), { color: '#FFFFFF' });
  maskUp(ctx, x.en, X0, 566, fit(ctx, x.en, 26, CW, 600, F.mono), ez(v, 1.5, 2.5), { w: 600, color: SUB, family: F.mono });
  maskUp(ctx, x.ar, XC, 646, fit(ctx, x.ar, 44, CW, 700, F.ar), ez(v, 1.9, 2.9), { family: F.ar, align: 'right', rtl: true });
  const tp = ez(v, 12, 12.8, E.outCubic);
  if (tp > 0) {
    ctx.fillStyle = SEL; ctx.fillRect(X0, 760, 70 * tp, 5);
    maskUp(ctx, 'TIP', X0, 820, 26, tp, { w: 600, color: SEL, family: F.mono });
    maskUp(ctx, x.tip, X0, 872, fit(ctx, x.tip, 26, CW, 600, F.mono), ez(v, 12.3, 13.2), { w: 600, color: INK, family: F.mono });
    maskUp(ctx, x.tipAr, XC, 940, fit(ctx, x.tipAr, 36, CW, 700, F.ar), ez(v, 12.7, 13.6), { family: F.ar, align: 'right', rtl: true });
  }
}

// ------------------------------------------------------------------ hook
function penPath(ctx, t, x, y, color, bg) {
  const a = [[x, y + 120], [x + 170, y - 10 + 40 * Math.sin(t * 2.4)], [x + 320, y + 110]];
  const h = 70 + 30 * Math.sin(t * 1.7), hy = 60 * Math.cos(t * 2.4);
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(...a[0]);
  ctx.bezierCurveTo(a[0][0] + 60, a[0][1] - 120, a[1][0] - h, a[1][1] - hy, ...a[1]);
  ctx.bezierCurveTo(a[1][0] + h, a[1][1] + hy, a[2][0] - 60, a[2][1] - 120, ...a[2]); ctx.stroke();
  ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a[1][0] - h, a[1][1] - hy); ctx.lineTo(a[1][0] + h, a[1][1] + hy); ctx.stroke();
  [[a[1][0] - h, a[1][1] - hy], [a[1][0] + h, a[1][1] + hy]].forEach(([px, py]) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(px, py, 8, 0, TAU); ctx.fill(); });
  a.forEach(([px, py], i) => { ctx.fillStyle = i === 1 ? color : bg; ctx.fillRect(px - 11, py - 11, 22, 22); ctx.lineWidth = 3; ctx.strokeRect(px - 11, py - 11, 22, 22); });
  ctx.restore();
  cursor(ctx, a[1][0] + 20, a[1][1] + 20);
}
function hook(ctx, u, t) {
  ctx.fillStyle = '#161616'; ctx.fillRect(0, 0, W, H);
  topline(ctx, SUB);
  [['THE UI/UX', 250, 420], ['TOOLKIT.', 250, 660]].forEach(([s, size, y], i) => {
    const drift = (i % 2 ? -1 : 1) * u * 6, breathe = 1 + 0.03 * Math.sin(t * 3.2 + i);
    txt(ctx, s, X0 + drift, y, size, { sx: breathe, color: '#FFFFFF' });
  });
  txt(ctx, 'أدوات مصمّم UI/UX الأساسية', W - X0, 830, 70, { family: F.ar, align: 'right', rtl: true });
  txt(ctx, '14 TOOLS · FROM DESIGN TO CODE', X0, 830, 36, { w: 600, family: F.mono, color: SUB });
  penPath(ctx, t, 1440, 470, SEL, '#161616');
  const ts = 250, oX = X0 + measure(ctx, 'T', ts) + measure(ctx, 'O', ts) / 2, oY = 660 - ts * 0.36;
  ['#0ACF83', '#1ABCFE', '#161616'].forEach((c, i) => { const q = ez(u, 5.6 + i * 0.4, 7.4 + i * 0.2, E.inExpo); if (q > 0) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(oX, oY, 40 + q * 2400, 0, TAU); ctx.fill(); } });
}
function partCard(ctx, v, p, IMG) {
  ctx.fillStyle = '#161616'; ctx.fillRect(0, 0, W, H);
  topline(ctx, SUB);
  maskUp(ctx, `PART ${p.n}`, X0, 330, 40, ez(v, 0.2, 1.0), { w: 600, family: F.mono, color: SEL });
  maskUp(ctx, p.en, X0 - 6, 540, fit(ctx, p.en, 220, W - 2 * X0), ez(v, 0.5, 1.6), { color: '#FFFFFF' });
  maskUp(ctx, p.ar, W - X0, 700, 90, ez(v, 1.0, 2.0), { family: F.ar, align: 'right', rtl: true });
  maskUp(ctx, p.count, X0, 700, 36, ez(v, 1.2, 2.2), { w: 600, family: F.mono, color: SUB });
  TOOLS.filter((x) => x.part === p.n).forEach((x, i) => {
    const s = spr(v, 1.8 + i * 0.25, { stiffness: 260, damping: 13 }); if (s <= 0) return;
    const w = x.wide ? 230 : 130; let cx = X0; TOOLS.filter((y) => y.part === p.n).slice(0, i).forEach((y) => { cx += (y.wide ? 230 : 130) + 24; });
    ctx.save(); ctx.translate(cx + w / 2, 860); ctx.scale(s, s); tile(ctx, x, IMG, 0, 0, w, 110, 18); ctx.restore();
  });
}

// ================================================================== vignettes (Short coordinates)
// ---- Figma
const WIN = { cx: 540, cy: 730, w: 900, h: 640 }, SELF = { x: 610, y: 150, w: 160, h: 284 };
function vFigma(ctx, v, x, IMG) {
  const pop = spr(v, 0.25, { stiffness: 260, damping: 13 }), m = ez(v, 2.6, 3.6, E.inOutCubic), mS = spr(v, 2.6, { stiffness: 220, damping: 15 });
  const w = lerp(380, WIN.w, mS), h = lerp(380, WIN.h, mS), r = lerp(190, 22, m);
  ctx.save(); ctx.translate(WIN.cx, WIN.cy); ctx.scale(pop, pop);
  rr(ctx, -w / 2, -h / 2, w, h, r, '#FFFFFF');
  ctx.save(); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, r); ctx.clip();
  if (m > 0.35) figmaWindow(ctx, v, -WIN.w / 2, -WIN.h / 2, clamp((m - 0.35) / 0.65));
  ctx.restore();
  if (m < 1) { ctx.globalAlpha = 1 - m; drawImg(ctx, IMG.figma, 0, 0, 130, 190); }
  ctx.restore();
}
function figmaWindow(ctx, v, x, y, p) {
  ctx.save(); ctx.globalAlpha = p;
  ctx.fillStyle = '#F5F5F5'; ctx.fillRect(x, y, WIN.w, 60); ctx.fillStyle = '#E6E6E6'; ctx.fillRect(x, y + 60, WIN.w, 2);
  txt(ctx, 'Drafts / Landing page', x + 30, y + 40, 22, { color: '#444' });
  ctx.fillStyle = '#FAFAFA'; ctx.fillRect(x, y + 62, 220, WIN.h - 62); ctx.fillStyle = '#E6E6E6'; ctx.fillRect(x + 220, y + 62, 2, WIN.h - 62);
  ['Home', 'Hero', 'Button', 'Mobile', 'Footer'].forEach((l, i) => {
    const q = ez(v, 3.6 + i * 0.25, 4.2 + i * 0.25, E.outCubic);
    if (i === 3 && v >= 7) { ctx.fillStyle = '#DCEFFF'; ctx.fillRect(x + 8, y + 84 + i * 50, 204, 40); }
    txt(ctx, l, x + 30 + (i % 2) * 18, y + 112 + i * 50, 22, { color: i === 3 && v >= 7 ? SEL : '#555', alpha: q });
  });
  ctx.fillStyle = '#E9E9E9'; ctx.fillRect(x + 222, y + 62, WIN.w - 222, WIN.h - 62);
  [[260, 140, 160, 284, '#FFFFFF'], [435, 120, 160, 284, '#FFFFFF'], [SELF.x, SELF.y, SELF.w, SELF.h, TOOLS[1].bg]].forEach(([fx, fy, fw, fh, col], i) => {
    const q = ez(v, 5 + i * 0.4, 5.6 + i * 0.4, E.outBack); if (q <= 0) return;
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
    rr(ctx, sx + SELF.w / 2 - 62, sy + SELF.h + 18, 124, 32, 6, SEL); txt(ctx, '390 × 844', sx + SELF.w / 2, sy + SELF.h + 41, 18, { color: '#FFFFFF', align: 'center' });
  }
  const cm = ez(v, 5.8, 7, E.inOutCubic);
  if (v >= 5.8 && v < SPAN - 1.1) cursor(ctx, lerp(x + 560, x + SELF.x + 110, cm), lerp(y + 560, y + SELF.y + 150, cm), '#FFFFFF', 'You', SEL);
  ctx.restore();
}
// ---- FigJam
function vFigjam(ctx, v) {
  const bp = ez(v, 2.6, 3.3, E.outCubic);
  ctx.save(); ctx.globalAlpha = bp; rr(ctx, 80, 300, 920, 860, 24, '#F4F4F4'); ctx.restore();
  if (bp <= 0) return;
  const drag = ez(v, 8, 10, E.inOutCubic);
  const ST = [['Sign up', '#FFE57F', 150, 360, -0.05], ['Verify email', '#B3EFBD', 560, 560, 0.04], ['Home', '#A8DAFF', lerp(170, 230, drag), lerp(820, 800, drag), -0.03]];
  const pts = ST.map(([, , sx, sy]) => [sx + 150, sy + 120]);
  [[0, 1], [1, 2]].forEach(([a, b], i) => {
    const p = ez(v, 5.6 + i, 6.4 + i, E.inOutCubic); if (p <= 0) return;
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
    txt(ctx, label, -120, -60, 40, { color: '#1E1E1E' }); ctx.restore();
  });
  const cv = ez(v, 7, 8, E.inOutCubic);
  if (v >= 7) cursor(ctx, lerp(820, pts[2][0] + 40, cv), lerp(1100, pts[2][1] + 20, cv), '#FFFFFF', 'Sara', '#0FA958');
}
// ---- Google Fonts: specimens cycle, then a pairing card
const SPEC = [['IBM Plex Sans', F.title, 700, 'IBM Plex Sans Arabic', F.ar], ['Instrument Serif', F.serif, 400, 'Noto Naskh Arabic', F.naskh], ['IBM Plex Mono', F.mono, 600, 'IBM Plex Sans Arabic', F.ar], ['IBM Plex Sans', F.title, 700, 'Noto Naskh Arabic', F.naskh]];
function vFonts(ctx, v) {
  const op = spr(v, 2.6, { stiffness: 200, damping: 16 }); if (op <= 0) return;
  const k = clamp(Math.floor((v - 3) / 1.6), 0, 3), sw = v >= 3 ? ez(v, 3 + k * 1.6, 3.5 + k * 1.6, E.outBack) : 1, [nm, fam, wt, nmAr, famAr] = SPEC[k];
  ctx.save(); ctx.globalAlpha = Math.min(1, op);
  rr(ctx, 80, 300, 440, 440, 24, '#2A2A2A'); rr(ctx, 560, 300, 440, 440, 24, '#2A2A2A');
  txt(ctx, 'Aa', 300, 580, 250 * lerp(0.85, 1, sw), { w: wt, family: fam, color: '#FFFFFF', align: 'center' });
  txt(ctx, 'أب', 780, 600, 240 * lerp(0.85, 1, sw), { w: 700, family: famAr, color: '#FFFFFF', align: 'center', rtl: true });
  txt(ctx, nm, 110, 712, 26, { w: 600, family: F.mono, color: SUB }); txt(ctx, nmAr, 590, 712, 26, { w: 600, family: F.mono, color: SUB });
  const pc = spr(v, 10, { stiffness: 220, damping: 15 });
  if (pc > 0) {
    ctx.save(); ctx.translate(540, 960); ctx.scale(pc, pc);
    rr(ctx, -460, -170, 920, 340, 24, '#FFFFFF');
    txt(ctx, 'A calm heading', -410, -50, 76, { w: 400, family: F.serif, color: '#161616' });
    txt(ctx, 'Body text in a clean sans-serif, easy to read.', -410, 20, 30, { w: 700, family: F.title, color: '#555' });
    txt(ctx, 'عنوان هادئ ونص واضح سهل القراءة.', 410, 100, 40, { w: 700, family: F.naskh, color: '#161616', align: 'right', rtl: true });
    ctx.restore();
  }
  ctx.restore();
}
// ---- Lucide: line icons draw in, then the stroke width changes for all of them at once
const ICONS = [
  (c) => { c.moveTo(-50, 0); c.lineTo(0, -45); c.lineTo(50, 0); c.moveTo(-36, -10); c.lineTo(-36, 45); c.lineTo(36, 45); c.lineTo(36, -10); c.moveTo(-12, 45); c.lineTo(-12, 12); c.lineTo(12, 12); c.lineTo(12, 45); },
  (c) => { c.moveTo(18, 0); c.arc(-6, -6, 30, 0, TAU); c.moveTo(16, 16); c.lineTo(46, 46); },
  (c) => { c.moveTo(-36, 24); c.bezierCurveTo(-30, 10, -32, -40, 0, -40); c.bezierCurveTo(32, -40, 30, 10, 36, 24); c.closePath(); c.moveTo(-12, 36); c.bezierCurveTo(-8, 50, 8, 50, 12, 36); },
  (c) => { c.moveTo(0, 40); c.bezierCurveTo(-60, 0, -40, -46, 0, -20); c.bezierCurveTo(40, -46, 60, 0, 0, 40); },
  (c) => { c.moveTo(22, -16); c.arc(0, -16, 22, 0, TAU); c.moveTo(-42, 46); c.bezierCurveTo(-36, 14, 36, 14, 42, 46); },
  (c) => { c.moveTo(16, 0); c.arc(0, 0, 16, 0, TAU); for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU; c.moveTo(Math.cos(a) * 28, Math.sin(a) * 28); c.lineTo(Math.cos(a) * 44, Math.sin(a) * 44); } },
];
const ICON_NAMES = ['house', 'search', 'bell', 'heart', 'user', 'settings'];
function vLucide(ctx, v) {
  const sw = lerp(3, 6, ez(v, 9, 10, E.inOutCubic));
  ICONS.forEach((path, i) => {
    const s = spr(v, 2.8 + i * 0.5, { stiffness: 240, damping: 15 }); if (s <= 0) return;
    const col = i % 3, row = Math.floor(i / 3), cx = 80 + 150 + col * 310, cy = 300 + 190 + row * 400;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(Math.min(1.1, s), Math.min(1.1, s));
    rr(ctx, -140, -150, 280, 300, 24, '#262626');
    const d = ez(v, 3 + i * 0.5, 4.4 + i * 0.5, E.inOutCubic);
    ctx.translate(0, -20); ctx.scale(1.4, 1.4); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = sw / 1.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.setLineDash([600 * d, 600]); ctx.beginPath(); path(ctx); ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
    txt(ctx, ICON_NAMES[i], cx, cy + 120, 24, { w: 600, family: F.mono, color: SUB, align: 'center' });
  });
  if (v >= 9) { rr(ctx, 380, 1100, 320, 56, 12, '#262626'); txt(ctx, `stroke-width: ${v < 9.5 ? 2 : 3}`, 540, 1137, 24, { w: 600, family: F.mono, color: INK, align: 'center' }); }
}
// ---- WebAIM contrast checker
const toRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h) => { const c = toRgb(h).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
function vContrast(ctx, v) {
  const k = ez(v, 4.5, 7.5, E.inOutCubic), fg = M.mix('#B4B4B4', '#1E1E1E', k), r = ratio(fg, '#FFFFFF');
  const sw = spr(v, 3, { stiffness: 220, damping: 14 }); if (sw <= 0) return;
  ctx.save(); ctx.translate(540, 470); ctx.scale(sw, sw);
  rr(ctx, -460, -170, 920, 340, 22, '#FFFFFF');
  txt(ctx, 'Read me easily.', -400, -30, 72, { color: fg }); txt(ctx, 'Body text needs enough contrast.', -400, 50, 34, { color: fg });
  ctx.restore();
  [[fg, 'FOREGROUND'], ['#FFFFFF', 'BACKGROUND']].forEach(([c, lab], i) => {
    const s2 = spr(v, 3.4 + i * 0.3); if (s2 <= 0) return;
    ctx.save(); ctx.translate(80 + 140 + i * 460, 760); ctx.scale(s2, s2);
    rr(ctx, -110, -60, 120, 120, 16, c, '#555', 3);
    txt(ctx, lab, 30, -14, 24, { w: 600, family: F.mono, color: SUB }); txt(ctx, i ? '#FFFFFF' : fg.toUpperCase(), 30, 26, 30, { w: 600, family: F.mono, color: INK });
    ctx.restore();
  });
  txt(ctx, `${r.toFixed(1)}:1`, 80, 1010, 150, { color: '#FFFFFF', alpha: ez(v, 4, 4.6) });
  [['AA', 4.5, 6.2], ['AAA', 7, 7.4]].forEach(([lab, th, b], i) => {
    const ok = r >= th, s3 = spr(v, ok ? b : 4.2, { stiffness: 300, damping: 12 }); if (s3 <= 0) return;
    ctx.save(); ctx.translate(760, 870 + i * 120); ctx.scale(s3, s3);
    rr(ctx, -10, -42, 250, 84, 14, ok ? GREEN : '#E5484D'); txt(ctx, `${lab} ${ok ? '✓' : '✕'}`, 115, 16, 44, { color: '#FFFFFF', align: 'center' });
    ctx.restore();
  });
}
// ---- Maze: a task, clicks land on a phone prototype, then the path and "task completed"
function vMaze(ctx, v) {
  const op = spr(v, 3, { stiffness: 200, damping: 16 }); if (op <= 0) return;
  ctx.save(); ctx.translate(540, 760); ctx.scale(Math.min(1, op), Math.min(1, op)); ctx.translate(-540, -760);
  rr(ctx, 80, 300, 920, 90, 16, '#2E2E2E'); txt(ctx, 'TASK', 110, 357, 24, { w: 600, family: F.mono, color: SEL });
  maskUp(ctx, 'Find the pricing page.', 200, 360, 34, ez(v, 4, 4.8), { color: INK });
  const px = 330, py = 430, pw = 420, ph = 760;
  rr(ctx, px, py, pw, ph, 46, '#FFFFFF', '#3A3A3A', 6);
  ctx.fillStyle = '#161616'; ctx.fillRect(px + 40, py + 70, 120, 18); rr(ctx, px + pw - 80, py + 64, 40, 30, 6, '#DDDDDD');
  const items = ['Features', 'Pricing', 'Blog', 'Help'];
  items.forEach((l, i) => { rr(ctx, px + 30, py + 150 + i * 120, pw - 60, 96, 14, '#F2F2F2'); txt(ctx, l, px + 60, py + 210 + i * 120, 32, { color: '#222' }); });
  // clicks: most on "Pricing", a few elsewhere (fictional)
  const CL = [[0.55, 1.1], [0.62, 1.0], [0.45, 1.2], [0.7, 1.15], [0.52, 0.95], [0.3, 0.1], [0.6, 2.2], [0.4, 1.05], [0.66, 1.25]];
  CL.forEach(([fx, row], i) => {
    const s = spr(v, 5.5 + i * 0.25, { stiffness: 320, damping: 12 }); if (s <= 0) return;
    const cx = px + 30 + fx * (pw - 60), cy = py + 150 + 48 + row * 120 + (hash01(i, 4) - 0.5) * 30;
    ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = SEL; ctx.beginPath(); ctx.arc(cx, cy, 22 * s, 0, TAU); ctx.fill(); ctx.restore();
  });
  const pp = ez(v, 9.5, 10.3, E.inOutCubic);
  if (pp > 0) { ctx.save(); ctx.strokeStyle = GREEN; ctx.lineWidth = 6; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(px + pw + 40, py + 120); ctx.lineTo(lerp(px + pw + 40, px + pw - 40, pp), lerp(py + 120, py + 150 + 48 + 120, pp)); ctx.stroke(); ctx.restore(); }
  const ok = spr(v, 10.5, { stiffness: 300, damping: 12 });
  if (ok > 0) { ctx.save(); ctx.translate(540, 1150); ctx.scale(ok, ok); rr(ctx, -190, -40, 380, 80, 40, GREEN); txt(ctx, 'Task completed ✓', 0, 14, 34, { color: '#FFFFFF', align: 'center' }); ctx.restore(); }
  ctx.restore();
}
// ---- Figma Dev Mode: redlines on a button, a code panel with the CSS, "Ready for dev"
const CSS = ['padding: 16px 24px;', 'border-radius: 8px;', 'background: #1A73E8;', 'color: #FFFFFF;', 'font-weight: 600;'];
function vDevmode(ctx, v) {
  const op = spr(v, 3, { stiffness: 200, damping: 16 }); if (op <= 0) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, op);
  rr(ctx, 80, 300, 920, 380, 20, '#E9E9E9');
  const bx = 360, by = 430, bw = 360, bh = 112;
  rr(ctx, bx, by, bw, bh, 16, '#1A73E8'); txt(ctx, 'Get started', bx + bw / 2, by + 70, 40, { color: '#FFFFFF', align: 'center' });
  const r1 = ez(v, 4.5, 5.0), r2 = ez(v, 5.1, 5.6);
  ctx.strokeStyle = SEL; ctx.fillStyle = SEL; ctx.lineWidth = 3;
  if (r1 > 0) { ctx.globalAlpha = r1; ctx.beginPath(); ctx.moveTo(bx, by + bh + 40); ctx.lineTo(bx + 48, by + bh + 40); ctx.stroke(); rr(ctx, bx - 10, by + bh + 52, 70, 34, 6, SEL); txt(ctx, '24', bx + 25, by + bh + 77, 22, { color: '#FFFFFF', align: 'center' }); }
  if (r2 > 0) { ctx.globalAlpha = r2; ctx.beginPath(); ctx.moveTo(bx + bw + 40, by); ctx.lineTo(bx + bw + 40, by + 32); ctx.stroke(); rr(ctx, bx + bw + 56, by - 2, 70, 34, 6, SEL); txt(ctx, '16', bx + bw + 91, by + 23, 22, { color: '#FFFFFF', align: 'center' }); }
  ctx.globalAlpha = Math.min(1, op);
  const cp = spr(v, 6, { stiffness: 220, damping: 18 });
  if (cp > 0) {
    ctx.save(); ctx.translate(lerp(600, 0, Math.min(1, cp)), 0);
    rr(ctx, 80, 720, 920, 420, 20, '#1E1E1E', '#3A3A3A', 2);
    txt(ctx, 'CSS', 120, 780, 24, { w: 600, family: F.mono, color: SUB });
    const total = CSS.join('').length, n = Math.floor(ez(v, 6.5, 8.9, (q) => q) * total); let left = n;
    CSS.forEach((l, i) => { const k = Math.max(0, Math.min(l.length, left)); left -= l.length; const [p1, p2] = l.split(':'); const s = l.slice(0, k); txt(ctx, s, 120, 850 + i * 56, 30, { w: 600, family: F.mono, color: s.length > p1.length ? '#B5CEA8' : '#9CDCFE' }); });
    ctx.restore();
  }
  const rd = spr(v, 10, { stiffness: 300, damping: 12 });
  if (rd > 0) { ctx.save(); ctx.translate(820, 340); ctx.scale(rd, rd); rr(ctx, -150, -30, 300, 60, 30, GREEN); txt(ctx, 'Ready for dev', 0, 11, 28, { color: '#FFFFFF', align: 'center' }); ctx.restore(); }
  ctx.restore();
}
// ---- Framer / Webflow: an artboard, click Publish, it becomes a live website
function vFramer(ctx, v) {
  const op = spr(v, 3, { stiffness: 200, damping: 16 }); if (op <= 0) return;
  const b = spr(v, 7, { stiffness: 170, damping: 15 }), bb = Math.min(1, b);
  ctx.save(); ctx.globalAlpha = Math.min(1, op);
  const x = lerp(170, 80, bb), y = lerp(400, 300, bb), w = lerp(740, 920, bb), h = lerp(700, 860, bb);
  if (bb < 1) { rr(ctx, 80, 300, 920, 70, 14, '#262626'); txt(ctx, 'Home', 110, 345, 24, { w: 600, family: F.mono, color: SUB }); rr(ctx, 820, 312, 160, 46, 10, v >= 6 && v < 6.4 ? '#0A6CD6' : SEL); txt(ctx, 'Publish', 900, 344, 24, { color: '#FFFFFF', align: 'center' }); }
  rr(ctx, x, y, w, h, lerp(6, 18, bb), '#FFFFFF');
  if (bb > 0) { ctx.save(); ctx.globalAlpha *= bb; ctx.fillStyle = '#ECECEC'; ctx.beginPath(); ctx.roundRect(x, y, w, 64, [18, 18, 0, 0]); ctx.fill(); rr(ctx, x + 90, y + 14, w - 120, 36, 18, '#FFFFFF'); txt(ctx, 'yourname.site', x + 116, y + 40, 22, { w: 600, family: F.mono, color: '#555' }); ctx.restore(); }
  const cy = y + lerp(30, 84, bb);
  txt(ctx, 'Hi, I design', x + 50, cy + 120, 64, { color: '#161616' }); txt(ctx, 'calm interfaces.', x + 50, cy + 196, 64, { color: '#161616' });
  ctx.fillStyle = '#9A9A9A'; ctx.fillRect(x + 50, cy + 240, w * 0.55, 14); ctx.fillRect(x + 50, cy + 266, w * 0.4, 14);
  [0, 1, 2].forEach((i) => rr(ctx, x + 50 + i * ((w - 100) / 3 + 0), cy + 320, (w - 100) / 3 - 20, h - 420 - lerp(30, 84, bb) + 40, 12, ['#DCE6F5', '#E5E5E5', '#DDEFE3'][i]));
  if (b > 0 && v < 9.6) { const pr = ez(v, 7.4, 9.4, E.inOutCubic); ctx.fillStyle = SEL; ctx.fillRect(x, y + 62, w * pr, 4); }
  ctx.restore();
  if (v >= 4.5 && v < 6.6) { const m = ez(v, 4.5, 5.8, E.inOutCubic); cursor(ctx, lerp(560, 905, m), lerp(1000, 340, m)); }
  const live = spr(v, 9.6, { stiffness: 300, damping: 12 });
  if (live > 0) { ctx.save(); ctx.translate(840, 1110); ctx.scale(live, live); rr(ctx, -110, -32, 220, 64, 32, GREEN); txt(ctx, 'Live ✓', 0, 12, 30, { color: '#FFFFFF', align: 'center' }); ctx.restore(); }
}
// ---- VS Code
const KW = '#569CD6', AT = '#9CDCFE', STR = '#B5CEA8', TX = '#D4D4D4', GR = '#6A6A6A';
const CODE = [[['<', GR], ['button', KW]], [['  className', AT], ['=', TX], ['"cta"', STR]], [['  onClick', AT], ['={', TX], ['save', AT], ['}', TX], ['>', GR]], [['  Get started', TX]], [['</', GR], ['button', KW], ['>', GR]]];
function editor(ctx, ex, ey, ew, eh, tab) {
  rr(ctx, ex, ey, ew, eh, 16, '#1E1E1E', '#3A3A3A', 2);
  ctx.fillStyle = '#181818'; ctx.fillRect(ex + 1, ey + 1, ew - 2, 56);
  [0, 1, 2].forEach((i) => { ctx.fillStyle = '#3A3A3A'; ctx.beginPath(); ctx.arc(ex + 30 + i * 26, ey + 29, 8, 0, TAU); ctx.fill(); });
  rr(ctx, ex + 120, ey + 10, 230, 46, 6, '#1E1E1E'); txt(ctx, tab, ex + 140, ey + 41, 22, { w: 600, family: F.mono, color: TX });
}
function vVscode(ctx, v) {
  const op = spr(v, 3, { stiffness: 200, damping: 16 }); if (op <= 0) return;
  ctx.save(); ctx.translate(540, 720); ctx.scale(lerp(0.6, 1, Math.min(1, op)), op);
  const ex = -460, ey = -380, ew = 920, eh = 760;
  editor(ctx, ex, ey, ew, eh, 'Button.jsx');
  ctx.fillStyle = '#181818'; ctx.fillRect(ex + 1, ey + 57, 70, eh - 58);
  [0, 1, 2, 3].forEach((i) => rr(ctx, ex + 22, ey + 90 + i * 70, 28, 28, 6, i === 0 ? '#C8C8C8' : '#5A5A5A'));
  const total = CODE.flat().reduce((a, [s]) => a + s.length, 0), chars = Math.floor(ez(v, 4, 9.6, (q) => q) * total);
  let left = chars;
  CODE.forEach((line, li) => {
    const ly = ey + 140 + li * 66; txt(ctx, String(li + 1), ex + 120, ly, 26, { w: 600, family: F.mono, color: '#5A5A5A', align: 'right' });
    let cx = ex + 150;
    line.forEach(([s, c]) => { const n = Math.max(0, Math.min(s.length, left)); left -= s.length; txt(ctx, s.slice(0, n), cx, ly, 30, { w: 600, family: F.mono, color: c }); cx += measure(ctx, s, 30, 600, F.mono); });
  });
  const ac = spr(v, 10, { stiffness: 280, damping: 16 });
  if (ac > 0 && v < 11) {
    ctx.save(); ctx.translate(ex + 330, ey + 200); ctx.scale(1, ac); rr(ctx, 0, 0, 380, 170, 8, '#252526', '#454545', 2);
    ['onClick', 'onChange', 'onFocus'].forEach((s, i) => { if (!i) { ctx.fillStyle = '#04395E'; ctx.fillRect(2, 8, 376, 48); } txt(ctx, s, 26, 42 + i * 52, 26, { w: 600, family: F.mono, color: i ? TX : '#FFFFFF' }); });
    ctx.restore();
  }
  ctx.restore();
}
// ---- DevTools
function vDevtools(ctx, v) {
  const op = spr(v, 3, { stiffness: 200, damping: 16 }); if (op <= 0) return;
  const dm = spr(v, 7.5, { stiffness: 160, damping: 14 }), bw = lerp(920, 430, dm), bx = 540 - bw / 2, by = 300, bh = 860;
  ctx.save(); ctx.globalAlpha = Math.min(1, op);
  rr(ctx, bx, by, bw, bh, 18, '#FFFFFF');
  ctx.fillStyle = '#35363A'; ctx.beginPath(); ctx.roundRect(bx, by, bw, 64, [18, 18, 0, 0]); ctx.fill();
  rr(ctx, bx + 90, by + 14, bw - 120, 36, 18, '#202124'); txt(ctx, 'studio.example', bx + 116, by + 40, 20, { w: 600, family: F.mono, color: '#BDC1C6' });
  [0, 1, 2].forEach((i) => { ctx.fillStyle = '#5F6368'; ctx.beginPath(); ctx.arc(bx + 24 + i * 20, by + 32, 6, 0, TAU); ctx.fill(); });
  ctx.save(); ctx.beginPath(); ctx.rect(bx, by + 64, bw, bh - 64); ctx.clip();
  const px = bx + 40, pw = bw - 80;
  ctx.fillStyle = '#1E1E1E'; ctx.fillRect(px, by + 100, 140, 18); [0, 1].forEach((i) => { ctx.fillStyle = '#C9C9C9'; ctx.fillRect(px + pw - 60 - i * 80, by + 102, 50, 14); });
  txt(ctx, 'Plan your week', px, by + 210, lerp(64, 48, dm), { color: '#1E1E1E' });
  ctx.fillStyle = '#9A9A9A'; ctx.fillRect(px, by + 240, pw * 0.8, 14); ctx.fillRect(px, by + 266, pw * 0.6, 14);
  const btn = { x: px, y: by + 300, w: 220, h: 64 };
  rr(ctx, btn.x, btn.y, btn.w, btn.h, 10, '#1A73E8'); txt(ctx, 'Get started', btn.x + 110, btn.y + 42, 24, { color: '#FFFFFF', align: 'center' });
  const cw = lerp((pw - 30) / 2, pw, dm), ch = 220;
  [0, 1].forEach((i) => { const cx = px + lerp(i * (cw + 30), 0, dm), cy = by + 420 + lerp(0, i * (ch + 26), dm); rr(ctx, cx, cy, cw, ch, 14, '#F1F3F4'); ctx.fillStyle = '#C9C9C9'; ctx.fillRect(cx + 24, cy + 30, cw * 0.5, 16); ctx.fillRect(cx + 24, cy + 62, cw * 0.7, 12); });
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
// ---- GitHub
function vGithub(ctx, v) {
  const MX = 220, BX = 380, y0 = 360, dy = 150, LINE = '#30363D';
  const commits = [[MX, y0, 'Create project', 3], [MX, y0 + dy, 'Add home page', 3.7], [BX, y0 + dy * 2, 'Try a new button', 4.4], [BX, y0 + dy * 3, 'Fix contrast', 5.1], [MX, y0 + dy * 4, 'Merge: new button', 9.4]];
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
    ctx.save(); ctx.translate(cx, cy); ctx.scale(p, p); ctx.fillStyle = '#0D1117'; ctx.strokeStyle = i === 4 ? '#3FB950' : cx === BX ? '#A371F7' : '#8B949E'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
    maskUp(ctx, msg, BX + 80, cy + 12, 34, ez(v, b + 0.1, b + 0.8), { w: 600, family: F.mono, color: INK });
    maskUp(ctx, ['a1f3c2e', '9be04d1', '4c7a2f8', 'e5d19b3', '7f2c8a4'][i], BX + 80, cy + 52, 22, ez(v, b + 0.3, b + 1), { w: 600, family: F.mono, color: '#8B949E' });
  });
  const ok = spr(v, 10, { stiffness: 300, damping: 12 });
  if (ok > 0) { ctx.save(); ctx.translate(BX + 330, y0 + dy * 4 + 110); ctx.scale(ok, ok); rr(ctx, -150, -36, 300, 72, 36, '#3FB950'); txt(ctx, 'Merged ✓', 0, 14, 36, { color: '#FFFFFF', align: 'center' }); ctx.restore(); }
}
// ---- Tailwind: classes type in one by one, the button restyles live
const TW = ['px-6', 'py-3', 'rounded-lg', 'bg-sky-600', 'text-white', 'font-semibold'];
function vTailwind(ctx, v) {
  const op = spr(v, 3, { stiffness: 200, damping: 16 }); if (op <= 0) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, op);
  editor(ctx, 80, 300, 920, 330, 'index.html');
  const done = TW.map((_, i) => ez(v, 4 + i * 1.1, 4.4 + i * 1.1, (q) => q));
  const part = (a, b) => TW.slice(a, b).map((c, j) => (done[a + j] > 0 ? c.slice(0, Math.ceil(c.length * done[a + j])) : '')).filter(Boolean).join(' ');
  txt(ctx, '<button class="' + part(0, 3), 110, 410, 30, { w: 600, family: F.mono, color: AT });
  txt(ctx, '  ' + part(3, 6) + (done[5] >= 1 ? '">' : ''), 110, 460, 30, { w: 600, family: F.mono, color: STR });
  txt(ctx, '  Save changes', 110, 530, 30, { w: 600, family: F.mono, color: TX }); txt(ctx, '</button>', 110, 590, 30, { w: 600, family: F.mono, color: AT });
  // live preview
  rr(ctx, 80, 680, 920, 480, 20, '#FFFFFF');
  const st = TW.map((_, i) => ez(v, 4.5 + i * 1.1, 5.0 + i * 1.1, E.outBack));
  const px = lerp(4, 48, st[0]), py = lerp(4, 24, st[1]), rad = lerp(0, 16, st[2]);
  ctx.font = `${st[5] > 0.5 ? 700 : 400} 40px ${F.title}`; const tw = ctx.measureText('Save changes').width;
  const w = tw + px * 2, h = 40 + py * 2, bx = 540 - w / 2, by = 920 - h / 2;
  rr(ctx, bx, by, w, h, rad, st[3] > 0 ? M.mix('#E5E5E5', '#0284C7', Math.min(1, st[3])) : '#E5E5E5', st[3] > 0 ? null : '#999', 2);
  txt(ctx, 'Save changes', 540, by + h / 2 + 14, 40, { w: st[5] > 0.5 ? 700 : 400, color: st[4] > 0 ? M.mix('#161616', '#FFFFFF', Math.min(1, st[4])) : '#161616', align: 'center' });
  ctx.restore();
}
// ---- Storybook: stories of one component, the selection moves, the canvas shows each state
const STORIES = ['Primary', 'Secondary', 'Disabled', 'Loading'];
function vStorybook(ctx, v) {
  const op = spr(v, 3, { stiffness: 200, damping: 16 }); if (op <= 0) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, op);
  rr(ctx, 80, 300, 920, 860, 18, '#FFFFFF');
  ctx.fillStyle = '#F6F9FC'; ctx.beginPath(); ctx.roundRect(80, 300, 300, 860, [18, 0, 0, 18]); ctx.fill(); ctx.fillStyle = '#E3E8EE'; ctx.fillRect(380, 300, 2, 860);
  txt(ctx, 'COMPONENTS', 110, 360, 20, { w: 600, family: F.mono, color: '#7A8794' }); txt(ctx, 'Button', 110, 410, 28, { color: '#2E3438' });
  const k = clamp(Math.floor((v - 4.5) / 1.6), 0, 3), act = v >= 4.5;
  STORIES.forEach((s, i) => {
    const y = 450 + i * 64;
    if (act && i === k) rr(ctx, 96, y, 268, 50, 8, '#1EA7FD');
    txt(ctx, s, 140, y + 34, 26, { color: act && i === k ? '#FFFFFF' : '#2E3438' });
  });
  const sw = act ? ez(v, 4.5 + k * 1.6, 5.0 + k * 1.6, E.outBack) : 1, cx = 690, cy = 730;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(lerp(0.85, 1, sw), lerp(0.85, 1, sw));
  const sty = [['#1A73E8', '#FFFFFF', null], ['#FFFFFF', '#1A73E8', '#1A73E8'], ['#E5E5E5', '#9A9A9A', null], ['#1A73E8', '#FFFFFF', null]][act ? k : 0];
  rr(ctx, -150, -42, 300, 84, 12, sty[0], sty[2], 3);
  if (act && k === 3) { ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(-90, 0, 14, v * 6, v * 6 + 4.5); ctx.stroke(); txt(ctx, 'Saving…', 20, 12, 32, { color: sty[1], align: 'center' }); }
  else txt(ctx, 'Save', 0, 12, 32, { color: sty[1], align: 'center' });
  ctx.restore();
  txt(ctx, act ? `Button / ${STORIES[k]}` : 'Button / Primary', 420, 1110, 24, { w: 600, family: F.mono, color: '#7A8794' });
  ctx.restore();
}
// ---- Claude Code: a request in the terminal, findings, then the diff
function vClaude(ctx, v) {
  const op = spr(v, 3, { stiffness: 200, damping: 16 }); if (op <= 0) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, op);
  rr(ctx, 80, 300, 920, 860, 16, '#111111', '#3A3A3A', 2);
  ctx.fillStyle = '#1C1C1C'; ctx.beginPath(); ctx.roundRect(81, 301, 918, 56, [16, 16, 0, 0]); ctx.fill();
  txt(ctx, 'Terminal', 540, 338, 22, { w: 600, family: F.mono, color: SUB, align: 'center' });
  const prompt = 'Review Button.jsx for accessibility', n = Math.floor(ez(v, 3.8, 6.0, (q) => q) * prompt.length);
  txt(ctx, '>', 120, 430, 30, { w: 600, family: F.mono, color: '#FFFFFF' }); txt(ctx, prompt.slice(0, n), 160, 430, 30, { w: 600, family: F.mono, color: '#FFFFFF' });
  const L = [['● Reading Button.jsx', SUB], ['● Text contrast is too low', '#E5E5E5'], ['● No visible focus style', '#E5E5E5']];
  L.forEach(([s, c], i) => maskUp(ctx, s, 120, 520 + i * 56, 28, ez(v, 7 + i * 0.6, 7.6 + i * 0.6), { w: 600, family: F.mono, color: c }));
  const D = [['- color: #9A9A9A;', '#F47067'], ['+ color: #1E1E1E;', '#57AB5A'], ['+ :focus-visible {', '#57AB5A'], ['+   outline: 2px solid;', '#57AB5A'], ['+ }', '#57AB5A']];
  const dp = ez(v, 9.4, 10.0, E.outCubic);
  if (dp > 0) { rr(ctx, 110, 720, 860, 360, 12, '#191919'); D.forEach(([s, c], i) => maskUp(ctx, s, 140, 790 + i * 60, 30, ez(v, 9.6 + i * 0.25, 10.2 + i * 0.25), { w: 600, family: F.mono, color: c })); }
  const ok = spr(v, 11, { stiffness: 300, damping: 12 });
  if (ok > 0) { ctx.save(); ctx.translate(820, 1120); ctx.scale(ok, ok); rr(ctx, -130, -30, 260, 60, 30, GREEN); txt(ctx, 'Done ✓', 0, 11, 28, { color: '#FFFFFF', align: 'center' }); ctx.restore(); }
  ctx.restore();
}
const VIG = { figma: vFigma, figjam: vFigjam, fonts: vFonts, lucide: vLucide, contrast: vContrast, maze: vMaze, devmode: vDevmode, framer: vFramer, vscode: vVscode, devtools: vDevtools, github: vGithub, tailwind: vTailwind, storybook: vStorybook, claude: vClaude };

// ------------------------------------------------------------------ scenes
function toolScene(ctx, v, x, IMG) {
  ctx.fillStyle = x.bg; ctx.fillRect(0, 0, W, H);
  // Figma zooms THROUGH its selected frame into the next scene
  let zoom = 0;
  if (x.key === 'figma') zoom = ez(v, SPAN - 1.1, SPAN, E.inCubic);
  ctx.save();
  if (zoom > 0) {
    const fx = VX + (WIN.cx - WIN.w / 2 + SELF.x + SELF.w / 2 - 80) * VS, fy = VY + (WIN.cy - WIN.h / 2 + SELF.y + SELF.h / 2 - 280) * VS, S = lerp(1, 12, zoom), k = Math.min(1, zoom * 3);
    ctx.translate(W / 2, H / 2); ctx.scale(S, S); ctx.translate(-lerp(W / 2, fx, k), -lerp(H / 2, fy, k));
  }
  column(ctx, v, x, IMG);
  ctx.save(); ctx.translate(VX, VY); ctx.scale(VS, VS); ctx.translate(-80, -280); VIG[x.key](ctx, v, x, IMG); ctx.restore();
  ctx.restore();
}
function recap(ctx, v, IMG) {
  ctx.fillStyle = '#161616'; ctx.fillRect(0, 0, W, H);
  topline(ctx, SUB);
  maskUp(ctx, 'YOUR TOOLKIT.', X0 - 4, 250, 120, ez(v, 0.4, 1.4), { color: '#FFFFFF' });
  maskUp(ctx, 'أدواتك الأساسية لتصميم الواجهات وتطويرها.', W - X0, 325, 40, ez(v, 0.8, 1.8), { family: F.ar, align: 'right', rtl: true });
  TOOLS.forEach((x, i) => {
    const p = spr(v, 1.2 + i * 0.2, { stiffness: 240, damping: 14 }); if (p <= 0) return;
    const col = i % 7, row = Math.floor(i / 7), tw = 222, th = 250, gap = (W - 2 * X0 - 7 * tw) / 6, tx = X0 + col * (tw + gap), ty = 370 + row * (th + 30);
    const fx = W / 2 + (hash01(i, 3) - 0.5) * 1600, fy = 1300;
    ctx.save(); ctx.translate(lerp(fx, tx + tw / 2, p), lerp(fy, ty + th / 2, p)); ctx.rotate((1 - Math.min(1, p)) * (hash01(i, 5) - 0.5) * 1.2);
    rr(ctx, -tw / 2, -th / 2, tw, th, 20, '#232323');
    tile(ctx, x, IMG, 0, -30, tw - 40, 140, 14);
    txt(ctx, x.name, 0, 90, fit(ctx, x.name, 24, tw - 30), { color: '#FFFFFF', align: 'center' });
    ctx.restore();
  });
  maskUp(ctx, 'SAVE THIS FOR LATER.', X0, 1010, 34, ez(v, 4.6, 5.6), { w: 600, family: F.mono, color: SUB });
  maskUp(ctx, 'احفظ هذا للرجوع إليه.', W - X0, 1010, 44, ez(v, 5, 6), { family: F.ar, align: 'right', rtl: true });
  const q = ez(v, 15.2, 16, E.inExpo);
  if (q > 0) { ctx.fillStyle = END_BLUE; ctx.beginPath(); ctx.arc(W / 2, H / 2, q * 1200, 0, TAU); ctx.fill(); }
}
function endPage(ctx, v) {
  ctx.fillStyle = END_BLUE; ctx.fillRect(0, 0, W, H);
  maskUp(ctx, 'Keep it simple.', X0, 360, 170, ez(v, 0, 0.8), { color: '#FFFFFF' });
  maskUp(ctx, 'اجعلها بسيطة.', W - X0, 520, 96, ez(v, 0.4, 1.2), { family: F.ar, align: 'right', rtl: true, color: '#FFFFFF' });
  const l = ez(v, 1.6, 2.4, E.inOutCubic); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(X0, 620, (W - 2 * X0) * l, 3);
  maskUp(ctx, 'Follow for more UI/UX tutorials', X0, 760, 80, ez(v, 2, 2.8), { color: '#FFFFFF' });
  maskUp(ctx, 'تابعني لمزيد من دروس UI/UX', W - X0, 890, 60, ez(v, 2.6, 3.4), { family: F.ar, align: 'right', rtl: true, color: '#FFFFFF' });
}

// ------------------------------------------------------------------ thumbnail (?cover=youtube)
const COVER = new URLSearchParams(location.search).get('cover');
function cover(ctx, IMG) {
  ctx.fillStyle = '#161616'; ctx.fillRect(0, 0, W, H);
  txt(ctx, 'LEARN UI/UX', X0, 110, 30, { w: 600, family: F.mono, color: SUB }); txt(ctx, 'AG STUDIO', W - X0, 110, 30, { w: 600, family: F.mono, color: SUB, align: 'right' });
  txt(ctx, 'THE UI/UX', X0, 370, 190, { color: '#FFFFFF' }); txt(ctx, 'TOOLKIT.', X0, 570, 190, { color: '#FFFFFF' });
  txt(ctx, '14 TOOLS', X0, 700, 60, { w: 600, family: F.mono, color: SEL });
  txt(ctx, 'أدوات مصمّم UI/UX الأساسية', X0 + 940, 870, 72, { family: F.ar, align: 'right', rtl: true });
  ['figma', 'vscode', 'github', 'chrome'].forEach((k, i) => { const col = i % 2, row = Math.floor(i / 2), s = 300, tx = 1160 + col * (s + 40), ty = 200 + row * (s + 40); rr(ctx, tx, ty, s, s, 36, '#FFFFFF'); drawImg(ctx, IMG[k], tx + s / 2, ty + s / 2, s * 0.6, s * 0.6); });
}

// ------------------------------------------------------------------ film
const FAST = SCENES.map((s) => s.b0);
let GRAIN = null;
function sceneAt(u) { let s = SCENES[0]; SCENES.forEach((x) => { if (u >= x.b0) s = x; }); return s; }
function drawScene(ctx, s, v, t, IMG) {
  if (s.kind === 'hook') hook(ctx, v, t);
  else if (s.kind === 'part') partCard(ctx, v, s.part, IMG);
  else if (s.kind === 'tool') toolScene(ctx, v, s.tool, IMG);
  else if (s.kind === 'recap') recap(ctx, v, IMG);
  else endPage(ctx, v);
}
M.film({
  fonts: [`700 100px ${F.title}`, `600 40px ${F.mono}`, `700 60px ${F.ar}`, `400 60px ${F.serif}`, `700 60px ${F.naskh}`],
  images: { figma: 'assets/figma.webp', figjam: 'assets/figjam.png', webaim: 'assets/webaim.png', vscode: 'assets/vscode.webp', chrome: 'assets/chrome.png', github: 'assets/github.png' },
  hits: HITS, shutter: 0.6,
  samples: (t) => { const u = t / B; return FAST.some((b) => u > b - 1.2 && u < b + 3.2) ? 8 : 3; },
  async init() {
    await Promise.all([`700 60px ${F.ar}`, `700 60px ${F.naskh}`].map((f) => document.fonts.load(f, 'أدوات التصميم').catch(() => {})));
    GRAIN = document.createElement('canvas'); GRAIN.width = 960; GRAIN.height = 540;
    const g = GRAIN.getContext('2d'), img = g.createImageData(960, 540), rnd = M.mulberry32(9);
    for (let i = 0; i < img.data.length; i += 4) { const c = 225 + rnd() * 30; img.data[i] = img.data[i + 1] = img.data[i + 2] = c; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0);
  },
  draw(ctx, u, t, IMG) {
    ctx.save();
    if (COVER) { cover(ctx, IMG); ctx.restore(); return; }
    const s = sceneAt(u), v = u - s.b0;
    // push transition at the end of every scene except: the hook (rings wipe), Figma (zoom through), the recap (blue wipe)
    const push = s.next && !(s.kind === 'hook' || (s.kind === 'tool' && s.tool.key === 'figma') || s.kind === 'recap');
    const pe = push ? ez(v, s.len - 0.9, s.len, E.inOutCubic) : 0;
    if (pe > 0) {
      const dx = s.dir === 'left' ? -W : 0, dy = s.dir === 'up' ? -H : 0;
      ctx.save(); ctx.translate(dx * pe, dy * pe); drawScene(ctx, s, v, t, IMG); ctx.restore();
      ctx.save(); ctx.translate(dx * (pe - 1), dy * (pe - 1)); drawScene(ctx, s.next, 0, t, IMG); ctx.restore();
    } else drawScene(ctx, s, v, t, IMG);
    ctx.restore();
    ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.05; ctx.drawImage(GRAIN, -Math.floor(hash01(Math.floor(t * 24), 1) * 30), 0, W + 30, H); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  },
});
