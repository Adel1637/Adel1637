// Code for designers: what to learn, and why (YouTube 16:9). Part 1 UX, Part 2 UI. Builder: ../shared/code-film.js
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';
import { makeCodeFilm, UX_STEPS, UI_STEPS } from '../shared/code-film.js';
const A = makeAGS(M);
const { C, F, L } = A;
const { font, rrect, springU, SPRING, clamp } = M;
const qmark = (ctx, x, y, r) => { ctx.save(); A.shadow(ctx, 20, 6, 0.2); ctx.fillStyle = C.blue; ctx.beginPath(); ctx.arc(x, y, r, 0, M.TAU); ctx.fill(); A.noShadow(ctx); ctx.font = font(r * 1.2, 800, F.latin); ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.fillText('?', x, y + r * 0.42); ctx.restore(); };
const zoom = (ctx, CARD, k, fn) => { ctx.save(); ctx.translate(CARD.x + CARD.w / 2, CARD.y + CARD.h / 2); ctx.scale(k, k); ctx.translate(-(CARD.x + CARD.w / 2), -(CARD.y + CARD.h / 2)); fn(); ctx.restore(); };
const film = makeCodeFilm(M, A, {
  layout: 'landscape', series: 'Learn UI/UX',
  hook: { title: 'Should designers learn to code?', hl: [4], size: 84, ar: 'هل يجب على المصمم تعلّم البرمجة؟', en2: '10 languages: 5 for UX, 5 for UI.', ar2: '10 لغات: 5 لتجربة المستخدم و5 للواجهات.', label: 'Code for designers' },
  parts: [
    { title: 'Part 1 · For UX', hl: [3, 4], ar: 'الجزء 1: لتصميم تجربة المستخدم', en2: 'Languages that make you a better designer.', ar2: 'لغات تجعلك مصممًا أفضل.', label: 'UX', steps: UX_STEPS },
    { title: 'Part 2 · For UI', hl: [3, 4], ar: 'الجزء 2: لبناء الواجهات', en2: 'Languages that build the interface.', ar2: 'لغات تبني الواجهة.', label: 'UI', steps: UI_STEPS },
  ],
  recap: { title: 'Start with CSS. Then pick a platform.', hl: [2], size: 72, ar: 'ابدأ بـ CSS، ثم اختر منصّتك.', en2: "You don't need them all. Pick one path.", ar2: 'لا تحتاج إليها كلها. اختر مسارًا واحدًا.', label: 'Your path' },
  hookCard: (ctx, u, e) => zoom(ctx, e.CARD, 1 + 0.2 * M.prog(u, 0, 8), () => {
    const ch = Math.round(e.CARD.h * 0.47);
    e.codePanel(ctx, e.CARD.x + 16, e.CARD.y + 16, e.CARD.w - 32, ch, { file: 'question.css', code: ['/* Should designers', '   learn to code? */', '.designer { learns: css; }'] }, M.clamp(0.25 + u / 7), true);
    e.preview(ctx, 'css', e.CARD.x + 16, e.CARD.y + ch + 32, e.CARD.w - 32, e.CARD.h - ch - 48, M.E.inOutCubic(M.prog(u, 3, 6.5)), 0);
    qmark(ctx, e.CARD.x + e.CARD.w - 70, e.CARD.y + ch - 30, 44 * (1 + 0.06 * Math.sin(u * 3)));
  }),
  hookExtra: (ctx, u, e) => {
    const out = 1 - M.prog(u, e.HOOK - 0.6, e.HOOK - 0.1);
    let x = e.LAY.l;
    x += A.pill(ctx, '5 for UX', x, 800, { bg: C.green, size: 40, p: springU(u, 3.2, SPRING.bouncy) * out }) + 24;
    A.pill(ctx, '5 for UI', x, 800, { bg: C.blue, size: 40, p: springU(u, 4.4, SPRING.bouncy) * out });
  },
  partCard: (ctx, u, g, e) => { ctx.fillStyle = C.white; ctx.fillRect(e.CARD.x, e.CARD.y, e.CARD.w, e.CARD.h); e.preview(ctx, g.j === 0 ? 'css' : 'flutter', e.CARD.x + 16, e.CARD.y + 16, e.CARD.w - 32, e.CARD.h - 32, 1, 0); },
  recapCard: (ctx, u, e) => {
    ctx.fillStyle = C.white; ctx.fillRect(e.CARD.x, e.CARD.y, e.CARD.w, e.CARD.h);
    [['UX path', ['CSS', 'HTML', 'JavaScript basics', 'Python (research)']], ['UI path', ['Web: HTML + CSS + JS', 'iPhone: Swift', 'Android: Kotlin', 'Both: Flutter']]].forEach(([t, items], c) => {
      const x = e.CARD.x + 30, y = e.CARD.y + 40 + c * 380;
      ctx.font = font(32, 800, F.latin); ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.fillText(t, x, y + 30);
      items.forEach((it, i) => { const k = springU(u, e.RECAP + 1.2 + c * 1.5 + i * 0.35, SPRING.bouncy); if (k > 0) A.pill(ctx, it, x, y + 56 + i * 76, { bg: i === 0 ? C.blue : C.ink, size: 24, p: k }); });
    });
  },
  cover: (ctx, kind, e) => {
    A.paper(ctx); A.header(ctx, 1000, 'Learn UI/UX', { y: 70, left: 110, right: 1810 });
    A.riseWords(ctx, 1000, 0, 'Code for', { x: 110, y: 330, size: 150, maxW: 1060 });
    A.riseWords(ctx, 1000, 0, 'designers', { x: 110, y: 486, size: 150, maxW: 1060, hl: [0], hlAt: 0 });
    A.line(ctx, 1000, 0, 'البرمجة للمصممين', { x: 1040, y: 630, size: 84, weight: 800, color: C.blue, align: 'right', rtl: true, family: 'CoverCairo, Jakarta' });
    A.pill(ctx, '10 LANGUAGES', 110, 700, { bg: C.ink, size: 52 });
    e.codePanel(ctx, 1150, 170, 640, 330, { file: 'card.css', code: ['.card {', '  padding: 24px;', '  border-radius: 16px;', '}'] }, 1, false);
    e.preview(ctx, 'css', 1150, 530, 640, 380, 1, 0);
  },
});
film.run();
