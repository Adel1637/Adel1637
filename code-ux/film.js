// The one language every designer should know (Short 9:16) — answer: CSS. Builder: ../shared/code-film.js
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';
import { makeCodeFilm, UX_STEPS, UI_STEPS } from '../shared/code-film.js';
const A = makeAGS(M);
const { C, F, L } = A;
const { font, rrect, springU, SPRING, clamp } = M;
const qmark = (ctx, x, y, r) => { ctx.save(); A.shadow(ctx, 20, 6, 0.2); ctx.fillStyle = C.blue; ctx.beginPath(); ctx.arc(x, y, r, 0, M.TAU); ctx.fill(); A.noShadow(ctx); ctx.font = font(r * 1.2, 800, F.latin); ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.fillText('?', x, y + r * 0.42); ctx.restore(); };
const zoom = (ctx, CARD, k, fn) => { ctx.save(); ctx.translate(CARD.x + CARD.w / 2, CARD.y + CARD.h / 2); ctx.scale(k, k); ctx.translate(-(CARD.x + CARD.w / 2), -(CARD.y + CARD.h / 2)); fn(); ctx.restore(); };
const film = makeCodeFilm(M, A, {
  layout: 'portrait', series: 'Learn UI/UX',
  hook: { title: 'The one language every designer should know.', hl: [1, 2], ar: 'اللغة التي يجب أن يعرفها كل مصمم.', en2: '5 languages, one clear winner.', ar2: '5 لغات وفائز واحد.', label: 'Code for designers' },
  parts: [{ steps: UX_STEPS }],
  recap: { title: 'Start with CSS.', hl: [2], ar: 'ابدأ بـ CSS.', en2: 'Then HTML, then JavaScript basics.', ar2: 'ثم HTML، ثم أساسيات JavaScript.', label: 'The answer' },
  hookCard: (ctx, u, e) => zoom(ctx, e.CARD, e.push, () => {
    const ch = Math.round(e.CARD.h * 0.47);
    e.codePanel(ctx, e.CARD.x + 16, e.CARD.y + 16, e.CARD.w - 32, ch, { file: '?', code: ['/* which language? */', '/* ... */'] }, 1, Math.floor(u * 2) % 2 === 0);
    e.preview(ctx, 'css', e.CARD.x + 16, e.CARD.y + ch + 32, e.CARD.w - 32, e.CARD.h - ch - 48, 0, 0);
    qmark(ctx, e.CARD.x + e.CARD.w - 70, e.CARD.y + ch - 30, 44 * (1 + 0.06 * Math.sin(u * 3)));
  }),
  partCard: () => {},
  recapCard: (ctx, u, e) => {
    const k = springU(u, e.RECAP + 1.2, SPRING.bouncy), cx = e.CARD.x + e.CARD.w / 2;
    ctx.fillStyle = C.white; ctx.fillRect(e.CARD.x, e.CARD.y, e.CARD.w, e.CARD.h);
    ctx.save(); ctx.translate(cx, e.CARD.y + 220); ctx.scale(k, k); rrect(ctx, -170, -110, 340, 220, 40); ctx.fillStyle = C.blue; ctx.fill();
    ctx.font = font(130, 800, F.latin); ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.fillText('CSS', 0, 46); ctx.restore();
    e.preview(ctx, 'css', e.CARD.x + 16, e.CARD.y + 380, e.CARD.w - 32, e.CARD.h - 396, clamp((u - e.RECAP - 1.5) / 2), 0);
  },
  cover: (ctx, kind, e) => {
    A.paper(ctx); const top = kind === 'tiktok' ? 300 : 230;
    A.header(ctx, 1000, 'Learn UI/UX', { y: top });
    ['The one language', 'every designer', 'should know.'].forEach((l, i) => A.riseWords(ctx, 1000, 0, l, { x: L.left, y: top + 200 + i * 124, size: 118, maxW: 1000, hl: i === 0 ? [1, 2] : [], hlAt: 0 }));
    A.line(ctx, 1000, 0, 'اللغة التي يجب أن يعرفها كل مصمم', { x: L.right, y: top + 560, size: 58, weight: 800, color: C.blue, align: 'right', rtl: true, family: 'CoverCairo, Jakarta' });
    e.codePanel(ctx, 162, top + 620, 756, 300, { file: '?', code: ['/* which language? */', '/* ... */'] }, 1, true);
    qmark(ctx, 860, top + 660, 50);
  },
});
film.run();
