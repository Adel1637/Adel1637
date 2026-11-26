// Web, iPhone or Android: which language? (Short 9:16). Builder: ../shared/code-film.js
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';
import { makeCodeFilm, UX_STEPS, UI_STEPS } from '../shared/code-film.js';
const A = makeAGS(M);
const { C, F, L } = A;
const { font, rrect, springU, SPRING, clamp } = M;
const qmark = (ctx, x, y, r) => { ctx.save(); A.shadow(ctx, 20, 6, 0.2); ctx.fillStyle = C.blue; ctx.beginPath(); ctx.arc(x, y, r, 0, M.TAU); ctx.fill(); A.noShadow(ctx); ctx.font = font(r * 1.2, 800, F.latin); ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.fillText('?', x, y + r * 0.42); ctx.restore(); };
const zoom = (ctx, CARD, k, fn) => { ctx.save(); ctx.translate(CARD.x + CARD.w / 2, CARD.y + CARD.h / 2); ctx.scale(k, k); ctx.translate(-(CARD.x + CARD.w / 2), -(CARD.y + CARD.h / 2)); fn(); ctx.restore(); };
const three = (ctx, e, x, y, w, h) => { const th = h * 0.42; e.preview(ctx, 'web', x, y, w, th, 0, 0); e.preview(ctx, 'ios', x, y + th + 12, w / 2 - 6, h - th - 12, 0, 0); e.preview(ctx, 'android', x + w / 2 + 6, y + th + 12, w / 2 - 6, h - th - 12, 0, 0); };
const film = makeCodeFilm(M, A, {
  layout: 'portrait', series: 'Learn UI/UX',
  hook: { title: 'Web, iPhone or Android: which language?', hl: [5], ar: 'ويب أم iPhone أم Android: أيّ لغة؟', en2: 'Same card, five ways to build it.', ar2: 'نفس البطاقة، خمس طرق لبنائها.', label: 'Same card' },
  parts: [{ steps: UI_STEPS }],
  recap: { title: 'Pick the platform first.', hl: [1, 2, 3], ar: 'اختر المنصّة أولًا، ثم اللغة.', en2: 'Web: HTML, CSS, JS. iPhone: Swift. Android: Kotlin.', ar2: 'الويب: HTML وCSS وJS. iPhone: Swift. Android: Kotlin.', label: 'Platform → language' },
  hookCard: (ctx, u, e) => zoom(ctx, e.CARD, e.push, () => {
    ctx.fillStyle = C.white; ctx.fillRect(e.CARD.x, e.CARD.y, e.CARD.w, e.CARD.h);
    three(ctx, e, e.CARD.x + 16, e.CARD.y + 16, e.CARD.w - 32, e.CARD.h - 32);
    [[e.CARD.x + e.CARD.w - 60, e.CARD.y + 60], [e.CARD.x + e.CARD.w / 2 - 50, e.CARD.y + 350], [e.CARD.x + e.CARD.w - 60, e.CARD.y + 350]].forEach(([x, y], i) => qmark(ctx, x, y, 34 * (1 + 0.08 * Math.sin(u * 3 + i))));
  }),
  partCard: () => {},
  recapCard: (ctx, u, e) => {
    ctx.fillStyle = C.white; ctx.fillRect(e.CARD.x, e.CARD.y, e.CARD.w, e.CARD.h);
    [['Web', 'HTML + CSS + JavaScript'], ['iPhone', 'Swift · SwiftUI'], ['Android', 'Kotlin · Compose'], ['Both mobiles', 'Dart · Flutter']].forEach(([p, l], i) => {
      const k = springU(u, e.RECAP + 1.2 + i * 0.5, SPRING.bouncy); if (k <= 0) return;
      const y = e.CARD.y + 60 + i * 160;
      ctx.save(); ctx.globalAlpha = clamp(k * 1.4); ctx.translate(0, (1 - k) * 30);
      rrect(ctx, e.CARD.x + 40, y, e.CARD.w - 80, 128, 22); ctx.fillStyle = '#F1F3F7'; ctx.fill();
      ctx.font = font(34, 800, F.latin); ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.fillText(p, e.CARD.x + 72, y + 56);
      ctx.font = font(26, 600, F.mono); ctx.fillStyle = C.blue; ctx.fillText(l, e.CARD.x + 72, y + 98); ctx.restore();
    });
  },
  cover: (ctx, kind, e) => {
    A.paper(ctx); const top = kind === 'tiktok' ? 300 : 230;
    A.header(ctx, 1000, 'Learn UI/UX', { y: top });
    ['Web, iPhone', 'or Android?'].forEach((l, i) => A.riseWords(ctx, 1000, 0, l, { x: L.left, y: top + 210 + i * 134, size: 128, maxW: 1000, hl: i === 1 ? [1] : [], hlAt: 0 }));
    A.line(ctx, 1000, 0, 'أيّ لغة لأيّ منصّة؟', { x: L.right, y: top + 460, size: 70, weight: 800, color: C.blue, align: 'right', rtl: true, family: 'CoverCairo, Jakarta' });
    three(ctx, e, 162, top + 520, 756, kind === 'tiktok' ? 820 : 880);
  },
});
film.run();
