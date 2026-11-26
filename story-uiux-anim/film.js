// TikTok story (animated): "UI and UX are not the same", one screen that says it all. Content from the published video.
import * as M from './lib/motion.js';
import { makeKinetic } from '../shared/kinetic.js';
const K = makeKinetic(M);
const { E, TAU, lerp, hash01 } = M;
const { F, C, ez, spr, txt, maskUp, rr } = K;
const BG = '#1B1B1B', CARD = '#26272C', LINE = '#3A3B42', BLUE = '#0D99FF', GREEN = '#30A46C', RED = '#E5484D';
const T = (ctx, s, x, y, size, o = {}) => txt(ctx, s, x, y, size, o);
const AR = (ctx, s, x, y, size, p, o = {}) => maskUp(ctx, s, x, y, size, p, { family: F.ar, align: 'right', rtl: true, ...o });
function pop(ctx, x, y, w, h, p, fn) { if (p <= 0) return; ctx.save(); const s = Math.min(1.04, p); ctx.globalAlpha *= Math.min(1, p); ctx.translate(x + w / 2, y + h / 2); ctx.scale(lerp(0.85, 1, s), lerp(0.85, 1, s)); ctx.translate(-(x + w / 2), -(y + h / 2)); fn(); ctx.restore(); }
function pill(ctx, s, x, y, col, p, size = 26) { pop(ctx, x, y - size, 400, size * 1.7, p, () => { ctx.font = `600 ${size}px ${F.mono}`; const w = ctx.measureText(s).width + size * 1.2; rr(ctx, x, y - size * 1.05, w, size * 1.7, size * 0.85, col); T(ctx, s, x + size * 0.6, y + size * 0.15, size, { w: 600, family: F.mono, color: '#FFFFFF' }); }); }
let GRAIN = null;
M.film({
  fonts: [`700 100px ${F.title}`, `600 40px ${F.title}`, `600 40px ${F.mono}`, `700 60px ${F.ar}`],
  shutter: 0.6, samples: 6,
  hits: [[0, 'hook slam', 'thud', { pitch: 'A1' }], [0, 'hook whoosh', 'whoosh', { len: 0.35 }], [0.6, 'arabic', 'tick'], [2, 'ui card', 'whoosh', { len: 0.4 }], [3.4, 'ux card', 'whoosh', { len: 0.4 }],
    [4, 'button', 'pop', { pitch: 'D5' }], [4.4, 'type', 'pop', { pitch: 'F#5' }], [5.2, 'find', 'tick'], [5.7, 'pay', 'tick'], [6.2, 'done', 'pop', { pitch: 'A5' }],
    [7.2, 'example', 'whoosh', { len: 0.4 }], [8, 'ui perfect', 'bell', { pitch: 'F#6' }], [8.7, 'ux poor', 'thud', { pitch: 'C3' }], [9.4, 'line', 'tick'],
    [11.6, 'end wipe', 'impact'], [12.4, 'cta', 'tick']],
  async init() { await document.fonts.load(`700 60px ${F.ar}`, 'ليسا الشيء نفسه').catch(() => {}); GRAIN = K.makeGrain(540, 960); },
  draw(ctx, u, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    T(ctx, 'LEARN UI/UX', 80, 290, 26, { w: 600, family: F.mono, color: C.sub }); T(ctx, 'AG STUDIO', 1000, 290, 26, { w: 600, family: F.mono, color: C.sub, align: 'right' });
    // title: full at frame 0, settles
    const s0 = lerp(1.04, 1, ez(u, 0, 1.2, E.outCubic));
    ctx.save(); ctx.translate(80, 470); ctx.scale(s0, s0); T(ctx, 'UI AND UX ARE', -4, 0, 104, { color: '#FFFFFF' }); T(ctx, 'NOT THE SAME.', -4, 104, 104, { color: '#FFFFFF' }); ctx.restore();
    AR(ctx, 'ليسا الشيء نفسه: UI وUX.', 1000, 680, 54, ez(u, 0.5, 1.4));
    // two cards
    [[0, 80, 'UI', BLUE, 'What you', 'see & touch', 'ما تراه وتلمسه', 2], [1, 552, 'UX', GREEN, 'The whole', 'journey', 'الرحلة كاملة', 3.4]].forEach(([i, x, big, col, l1, l2, ar, t0]) => {
      const p = spr(u, t0, { stiffness: 220, damping: 16 });
      pop(ctx, x, 760, 448, 430, p, () => {
        rr(ctx, x, 760, 448, 430, 28, CARD, LINE, 1.5);
        T(ctx, big, x + 34, 870, 96, { color: col }); T(ctx, l1, x + 34, 934, 38, { w: 700, color: '#FFFFFF' }); T(ctx, l2, x + 34, 978, 38, { w: 700, color: '#FFFFFF' });
        txt(ctx, ar, x + 414, 1040, 34, { family: F.ar, align: 'right', rtl: true });
        if (i === 0) {
          pop(ctx, x + 34, 1080, 150, 56, spr(u, 4), () => { rr(ctx, x + 34, 1080, 150, 56, 12, '#FFFFFF'); T(ctx, 'Pay now', x + 109, 1117, 24, { w: 700, color: '#18181B', align: 'center' }); });
          pop(ctx, x + 196, 1080, 70, 56, spr(u, 4.4), () => { rr(ctx, x + 196, 1080, 70, 56, 12, '#2F7CF6'); T(ctx, 'Aa', x + 231, 1117, 24, { w: 700, color: '#FFFFFF', align: 'center' }); });
        } else {
          ['Find', 'Pay', 'Done'].forEach((s, k) => { const q = ez(u, 5.2 + k * 0.5, 5.6 + k * 0.5); const bx = x + 34 + k * 128; ctx.save(); ctx.globalAlpha *= 0.35 + 0.65 * q; rr(ctx, bx, 1082, 104, 52, 10, k === 2 && q > 0.5 ? GREEN : '#3A3B42'); T(ctx, s, bx + 52, 1116, 22, { w: 600, color: '#FFFFFF', align: 'center' }); if (k < 2) T(ctx, '→', bx + 116, 1116, 20, { w: 600, color: C.sub, align: 'center' }); ctx.restore(); });
        }
      });
    });
    // example
    const e = ez(u, 7.2, 8, E.outCubic);
    if (e > 0) {
      ctx.save(); ctx.globalAlpha = e; ctx.translate(0, (1 - e) * 60); rr(ctx, 80, 1230, 920, 240, 28, CARD, LINE, 1.5); ctx.restore();
      pill(ctx, 'UI: PERFECT', 114, 1290, GREEN, spr(u, 8), 22); pill(ctx, 'UX: POOR', 320, 1290, RED, spr(u, 8.7), 22);
      maskUp(ctx, 'A beautiful search… and the film isn’t there.', 114, 1366, 32, ez(u, 9.4, 10.2), { w: 600, color: '#FFFFFF' });
      AR(ctx, 'واجهة ممتازة وتجربة ضعيفة: بحث جميل… والفيلم غير موجود.', 966, 1430, 32, ez(u, 9.9, 10.8));
    }
    // CTA (TikTok stories: point to the profile)
    const c = ez(u, 11.6, 12.4, E.outCubic);
    if (c > 0) {
      const pulse = 0.5 + 0.5 * Math.sin((u - 12.4) * Math.PI);
      ctx.save(); ctx.globalAlpha = c; rr(ctx, 80, 1500, 920, 72 + 60, 28, `rgba(13,153,255,${0.12 + 0.1 * pulse})`, BLUE, 3);
      T(ctx, 'FULL VIDEO ON MY PROFILE', 540, 1556, 30, { w: 600, family: F.mono, color: '#FFFFFF', align: 'center' });
      txt(ctx, 'الفيديو كاملًا في حسابي', 540, 1606, 30, { family: F.ar, align: 'center', rtl: true });
      ctx.restore();
    }
    K.grain(ctx, GRAIN, t, hash01);
  },
});
