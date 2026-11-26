// "Free resources for designers" — real screenshots of public home pages (resources-sites/shots, captured 26 Nov 2026),
// names as text only (no logos redrawn). Facts checked online on 26 Nov 2026 (licenses: Lucide ISC, Phosphor MIT, Heroicons MIT,
// Tabler MIT, unDraw free for commercial use without attribution, Unsplash license (commercial, no attribution), Pexels license
// (not in logos / trademarks), Google Fonts and Fontshare free for commercial use). Prices and plans change: check each site.
export const SITES = {
  untitled: { name: ['UNTITLED UI.'], url: 'untitledui.com', cat: 'UI KIT', en: 'FIGMA UI KIT: FREE VERSION, PRO IS PAID.', ar: 'مجموعة واجهات لـ Figma: نسخة مجانية وأخرى احترافية مدفوعة.', tip: 'START FROM A KIT, THEN MAKE IT YOURS.', tipAr: 'ابدأ من مجموعة جاهزة، ثم اجعلها خاصة بك.' },
  material: { name: ['MATERIAL', 'DESIGN 3.'], url: 'm3.material.io', cat: 'DESIGN SYSTEM', en: 'GOOGLE’S OPEN-SOURCE DESIGN SYSTEM.', ar: 'نظام التصميم المفتوح المصدر من Google.', tip: 'READ THE GUIDELINES, NOT ONLY THE COMPONENTS.', tipAr: 'اقرأ الإرشادات، لا المكوّنات فقط.' },
  figma: { name: ['FIGMA', 'COMMUNITY.'], url: 'figma.com/community', cat: 'UI KITS', en: 'FREE KITS, ICONS, TEMPLATES AND PLUGINS.', ar: 'مجتمع Figma: مجموعات وأيقونات وقوالب وإضافات مجانية.', tip: 'CHECK EACH FILE’S LICENSE BEFORE CLIENT WORK.', tipAr: 'تحقّق من ترخيص كل ملف قبل استخدامه لعميل.' },
  mobbin: { name: ['MOBBIN.'], url: 'mobbin.com', cat: 'INSPIRATION', en: 'REAL APP SCREENS AND FLOWS. FREE PLAN + PAID.', ar: 'شاشات ومسارات من تطبيقات حقيقية، مع خطة مجانية.', tip: 'STUDY THE FLOW, NOT ONLY THE PRETTY SCREEN.', tipAr: 'ادرس المسار كاملًا، لا الشاشة الجميلة فقط.' },
  collectui: { name: ['COLLECT UI.'], url: 'collectui.com', cat: 'INSPIRATION', en: 'DAILY UI INSPIRATION, SORTED BY COMPONENT.', ar: 'إلهام يومي للواجهات، مرتّب حسب المكوّن.', tip: 'LOOK UP ONE COMPONENT, COMPARE TEN VERSIONS.', tipAr: 'ابحث عن مكوّن واحد، وقارن عشر نسخ منه.' },
  lucide: { name: ['LUCIDE.'], url: 'lucide.dev', cat: 'ICONS', en: 'CLEAN ICONS. FREE, ISC LICENSE.', ar: 'أيقونات أنيقة ومجانية، بترخيص ISC.', tip: 'KEEP ONE ICON SET PER PRODUCT.', tipAr: 'استخدم مجموعة أيقونات واحدة لكل منتج.' },
  phosphor: { name: ['PHOSPHOR.'], url: 'phosphoricons.com', cat: 'ICONS', en: 'ICONS IN 6 WEIGHTS. FREE, MIT LICENSE.', ar: 'أيقونات بستة أوزان، مجانية بترخيص MIT.', tip: 'MATCH THE ICON WEIGHT TO YOUR TEXT WEIGHT.', tipAr: 'طابق وزن الأيقونة مع وزن النص.' },
  heroicons: { name: ['HEROICONS.'], url: 'heroicons.com', cat: 'ICONS', en: 'BY THE MAKERS OF TAILWIND CSS. MIT LICENSE.', ar: 'من صانعي Tailwind CSS، مجانية بترخيص MIT.', tip: 'OUTLINE FOR NAVIGATION, SOLID FOR THE ACTIVE STATE.', tipAr: 'المحدّدة للتنقل، والممتلئة للحالة النشطة.' },
  tabler: { name: ['TABLER ICONS.'], url: 'tabler.io/icons', cat: 'ICONS', en: 'A HUGE OUTLINE SET. FREE, MIT LICENSE.', ar: 'مجموعة كبيرة من الأيقونات المحدّدة، مجانية بترخيص MIT.', tip: 'ADJUST STROKE AND SIZE BEFORE EXPORTING.', tipAr: 'اضبط السُمك والحجم قبل التصدير.' },
  undraw: { name: ['UNDRAW.'], url: 'undraw.co', cat: 'ILLUSTRATIONS', en: 'FREE, NO ATTRIBUTION, IN YOUR BRAND COLOR.', ar: 'رسومات مجانية دون ذكر المصدر، وبلون علامتك.', tip: 'GREAT FOR EMPTY STATES AND ONBOARDING.', tipAr: 'مثالية للحالات الفارغة وشاشات الترحيب.' },
  unsplash: { name: ['UNSPLASH.'], url: 'unsplash.com', cat: 'PHOTOS', en: 'FREE PHOTOS, NO ATTRIBUTION REQUIRED.', ar: 'صور مجانية دون اشتراط ذكر المصدر.', tip: 'PEOPLE IN PHOTOS MAY NEED A RELEASE FOR ADS.', tipAr: 'الأشخاص في الصور قد يحتاجون إلى موافقة للإعلانات.', card: ['+Commercial use: free', '+Attribution: not required', '-Can’t build a rival photo site', 'iFaces: check model releases'] },
  pexels: { name: ['PEXELS.'], url: 'pexels.com', cat: 'PHOTOS & VIDEOS', en: 'FREE PHOTOS AND VIDEOS. NOT FOR LOGOS.', ar: 'صور وفيديوهات مجانية، لكن ليس داخل الشعارات.', tip: 'NEVER USE A STOCK PHOTO IN YOUR LOGO.', tipAr: 'لا تستخدم صورة مجانية داخل شعارك أبدًا.', card: ['+Commercial use: free', '+Videos too', '-Not in a logo or trademark', 'iFaces: check model releases'] },
  gfonts: { name: ['GOOGLE FONTS.'], url: 'fonts.google.com', cat: 'FONTS', en: 'FREE FOR COMMERCIAL USE, ARABIC INCLUDED.', ar: 'خطوط مجانية للاستخدام التجاري، ومنها خطوط عربية.', tip: 'FILTER BY LANGUAGE TO FIND ARABIC FONTS.', tipAr: 'صفِّ حسب اللغة لتجد الخطوط العربية.' },
  fontshare: { name: ['FONTSHARE.'], url: 'fontshare.com', cat: 'FONTS', en: 'FREE FONTS BY THE INDIAN TYPE FOUNDRY.', ar: 'خطوط مجانية من Indian Type Foundry.', tip: 'READ THE LICENSE PAGE BEFORE EMBEDDING.', tipAr: 'اقرأ صفحة الترخيص قبل تضمين الخط.' },
  penpot: { name: ['PENPOT.'], url: 'penpot.app', cat: 'DESIGN TOOL', en: 'OPEN-SOURCE DESIGN TOOL. FREE.', ar: 'أداة تصميم مفتوحة المصدر ومجانية.', tip: 'IT RUNS IN THE BROWSER, AND YOU CAN SELF-HOST IT.', tipAr: 'تعمل في المتصفح، ويمكنك استضافتها بنفسك.' },
  lunacy: { name: ['LUNACY.'], url: 'icons8.com/lunacy', cat: 'DESIGN TOOL', en: 'FREE DESIGN APP. OPENS SKETCH FILES.', ar: 'تطبيق تصميم مجاني يفتح ملفات Sketch.', tip: 'USEFUL WHEN A CLIENT SENDS A SKETCH FILE.', tipAr: 'مفيد عندما يرسل لك عميل ملف Sketch.' },
  nngroup: { name: ['NN/G ARTICLES.'], url: 'nngroup.com/articles', cat: 'LEARN', en: 'UX ARTICLES BASED ON RESEARCH. FREE TO READ.', ar: 'مقالات تجربة المستخدم مبنية على الأبحاث، ومجانية.', tip: 'START WITH THE 10 USABILITY HEURISTICS.', tipAr: 'ابدأ بمبادئ سهولة الاستخدام العشرة.' },
  figmalearn: { name: ['FIGMA', 'FOR BEGINNERS.'], url: 'help.figma.com', cat: 'LEARN', en: 'FIGMA’S OWN FREE COURSE.', ar: 'دورة Figma المجانية الرسمية للمبتدئين.', tip: 'FOLLOW IT WITH A REAL PROJECT ON THE SIDE.', tipAr: 'تابعها مع مشروع حقيقي بالتوازي.' },
};
const SHORT = ['untitled', 'material', 'mobbin', 'lucide', 'phosphor', 'undraw', 'gfonts', 'fontshare', 'penpot', 'nngroup'];
const PARTS = [
  ['UI KITS & SYSTEMS', 'مجموعات وأنظمة تصميم', ['untitled', 'material', 'figma']],
  ['INSPIRATION', 'الإلهام', ['mobbin', 'collectui']],
  ['ICONS', 'الأيقونات', ['lucide', 'phosphor', 'heroicons', 'tabler']],
  ['ILLUSTRATIONS & PHOTOS', 'الرسومات والصور', ['undraw', 'unsplash', 'pexels']],
  ['FONTS', 'الخطوط', ['gfonts', 'fontshare']],
  ['FREE TOOLS', 'أدوات مجانية', ['penpot', 'lunacy']],
  ['LEARN', 'التعلّم', ['nngroup', 'figmalearn']],
];
const HAS_SHOT = (id) => !SITES[id].card;

export function resourcesTopic(M, K, long) {
  const { E, TAU } = M;
  const { F, C, ez, spr, txt, rr } = K;
  // vignette: the category, then either the real screenshot (overlay by the builder) or a license card
  const vig = (id) => ({
    draw(ctx, v) {
      const s = SITES[id];
      if (!s.card) return;
      const a = ez(v, 0.3, 1.1, E.outCubic); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a; rr(ctx, 80, 330, 920, 780, 22, '#26272C', '#3A3B42', 1.5);
      txt(ctx, s.url, 130, 420, 44, { w: 700, color: '#FFFFFF' }); txt(ctx, 'LICENSE IN SHORT', 130, 480, 22, { w: 600, family: F.mono, color: C.sel });
      s.card.forEach((l0, i) => { let l = l0; const p = ez(v, 1.2 + i * 0.4, 1.8 + i * 0.4); if (p <= 0) return; const y = 580 + i * 120, k = l0[0], ok = k === '+'; l = l0.slice(1);
        ctx.save(); ctx.globalAlpha *= p; ctx.fillStyle = ok ? C.green : k === 'i' ? '#3A6EA5' : C.red; ctx.beginPath(); ctx.arc(150, y - 12, 20, 0, TAU); ctx.fill(); txt(ctx, ok ? '✓' : k === 'i' ? 'i' : '✕', 150, y - 3, 22, { w: 700, color: '#FFFFFF', align: 'center' }); txt(ctx, l, 192, y, 34, { w: 600, color: '#EDEDED' }); ctx.restore(); });
      txt(ctx, 'The site blocks automated screenshots: summary from its license page.', 130, 1070, 20, { w: 500, color: '#8A8A8A' });
      ctx.restore();
    },
    hits: SITES[id].card ? [[0.3, 'card', 'whoosh', { len: 0.4 }], [1.2, 'row', 'tick'], [1.6, 'row', 'tick'], [2, 'row', 'tick'], [2.4, 'row', 'tick']] : [[0.4, 'shot', 'whoosh', { len: 0.45 }], [0.8, 'shot in', 'pop', { pitch: 'A5' }]],
  });
  const mk = (id, part) => { const s = SITES[id]; return { part, title: s.name, en: `${s.cat} · ${s.en}`, ar: s.ar, tip: s.tip, tipAr: s.tipAr, tipAt: 12, vig: vig(id), real: HAS_SHOT(id) ? { img: id, url: s.url, label: s.cat, at: 0.4, atLong: 0.4 } : undefined }; };
  let items, parts;
  if (long) { items = []; PARTS.forEach(([, , ids], pi) => ids.forEach((id) => items.push(mk(id, pi)))); parts = PARTS.map(([en, ar, ids]) => ({ en, ar, count: `${ids.length} SITES` })); }
  else items = SHORT.map((id) => mk(id));
  const images = Object.fromEntries(Object.keys(SITES).filter(HAS_SHOT).map((id) => [id, `assets/${id}.jpg`]));
  const n = items.length;
  const recapVig = { draw(ctx, v) { const ids = long ? Object.keys(SITES) : SHORT; ids.forEach((id, i) => { const p = ez(v, 0.3 + i * 0.12, 0.8 + i * 0.12); if (p <= 0) return; const c = i % 2, r = Math.floor(i / 2), x = 80 + c * 470, y = 330 + r * (long ? 84 : 150); ctx.save(); ctx.globalAlpha = p; rr(ctx, x, y, 450, long ? 70 : 120, 14, '#26272C', '#3A3B42', 1.5); txt(ctx, SITES[id].url, x + 24, y + (long ? 45 : 58), long ? 24 : 30, { w: 600, color: '#FFFFFF' }); if (!long) txt(ctx, SITES[id].cat, x + 24, y + 94, 18, { w: 600, family: F.mono, color: C.sub }); ctx.restore(); }); }, hits: [[0.3, 'list', 'whoosh', { len: 0.5 }]] };
  return {
    fonts: ['400 20px Plex', '500 20px Plex', '600 20px Plex'], images,
    span: long ? 25 : 11,
    hook: { lines: ['FREE RESOURCES', 'FOR DESIGNERS.'], ar: 'مصادر مجانية للمصممين.', en: `${n} SITES TO SAVE. LICENSES CHECKED.`, tags: ['Icons', 'Fonts', 'UI kits', 'Photos', 'Tools', 'Learn'] },
    items, parts,
    label: (i) => (long ? `${PARTS[items[i].part][0]} · ${String(i + 1).padStart(2, '0')} / ${n}` : `SITE ${String(i + 1).padStart(2, '0')} / ${n}`),
    recap: { title: ['SAVE THEM.', 'CHECK THE LICENSE.'], ar: 'احفظها، وتحقّق من الترخيص.', en: 'KITS · INSPIRATION · ICONS · ILLUSTRATIONS · FONTS · TOOLS · LEARN', vig: recapVig, len: long ? 16 : 8 },
    cover: { lines: ['FREE', 'RESOURCES FOR', 'DESIGNERS.'], ar: 'مصادر مجانية للمصممين', art: (ctx, x, y, w, h) => { const ids = SHORT.slice(0, 8); const cw = (w - 20) / 2, ch = Math.min(110, (h - 60) / 4); ids.forEach((id, i) => { const cx = x + (i % 2) * (cw + 20), cy = y + Math.floor(i / 2) * (ch + 16); rr(ctx, cx, cy, cw, ch, 14, '#26272C', '#3A3B42', 1.5); txt(ctx, SITES[id].url, cx + 20, cy + ch / 2 + 10, Math.min(30, ch * 0.3), { w: 600, color: '#FFFFFF' }); }); } },
  };
}
