// YouTube Short slideshow made from the TikTok carousel images (carousels/palettes-ui, swipe pill removed).
// Contrast ratios on the slides are computed from the HEX codes (carousels/palettes-ui/build.py).
import * as M from './lib/motion.js';
import { makeKinetic } from '../shared/kinetic.js';
const K = makeKinetic(M);
const { E, hash01 } = M;
const { F, C, ez, maskUp, fit } = K;
const LEN = [5.5, 10, 10, 10, 10, 10, 9], END = 8;
const STARTS = LEN.reduce((a, l, i) => (a.push(i ? a[i - 1] + LEN[i - 1] : 0), a), []);
const E0 = STARTS[6] + LEN[6];
const images = Object.fromEntries([1, 2, 3, 4, 5, 6, 7].map((i) => [`s${i}`, `assets/s${i}.png`]));
const hits = [[0, 'hook slam', 'thud', { pitch: 'A1' }], [0, 'hook whoosh', 'whoosh', { len: 0.35 }], [1.4, 'swatches', 'tick']];
STARTS.forEach((s, i) => { if (i) { hits.push([s - 0.6, `push ${i}`, 'whoosh', { len: 0.45 }]); hits.push([s + 0.4, `slide ${i}`, i === 6 ? 'bell' : 'pop', { pitch: ['D5', 'E5', 'F#5', 'A5', 'B5', 'D6', 'F#6'][i] }]); } });
hits.push([E0, 'end wipe', 'impact'], [E0 + 2, 'follow', 'tick']);
let GRAIN = null;
function slide(ctx, IMG, i, v) { const im = IMG[`s${i + 1}`]; if (!im) return; const z = (i === 0 ? 1.06 - 0.06 * ez(v, 0, 1.2, E.outCubic) : 1) * (1 + 0.025 * Math.min(1, v / LEN[i])); ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-540, -960); ctx.drawImage(im, 0, 0, 1080, 1920); ctx.restore(); }
function endPage(ctx, v) {
  ctx.fillStyle = C.endBlue; ctx.fillRect(0, 0, 1080, 1920);
  maskUp(ctx, 'Keep it simple.', 80, 760, fit(ctx, 'Keep it simple.', 150, 920), ez(v, 0, 0.8), { color: '#FFFFFF' });
  maskUp(ctx, 'اجعلها بسيطة.', 1000, 900, 90, ez(v, 0.4, 1.2), { family: F.ar, align: 'right', rtl: true, color: '#FFFFFF' });
  const l = ez(v, 1.6, 2.4, E.inOutCubic); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(80, 1000, 920 * l, 3);
  maskUp(ctx, 'Follow for more', 80, 1130, 76, ez(v, 2, 2.8), { color: '#FFFFFF' });
  maskUp(ctx, 'UI/UX tutorials', 80, 1220, 76, ez(v, 2.2, 3.0), { color: '#FFFFFF' });
  maskUp(ctx, 'تابعني لمزيد من دروس UI/UX', 1000, 1330, 54, ez(v, 2.6, 3.4), { family: F.ar, align: 'right', rtl: true, color: '#FFFFFF' });
}
M.film({
  fonts: [`700 100px ${F.title}`, `700 60px ${F.ar}`], images, hits, shutter: 0.6, samples: 6,
  async init() { await document.fonts.load(`700 60px ${F.ar}`, 'اجعلها بسيطة').catch(() => {}); GRAIN = K.makeGrain(540, 960); },
  draw(ctx, u, t, IMG) {
    ctx.fillStyle = '#1B1B1B'; ctx.fillRect(0, 0, 1080, 1920);
    if (u >= E0) { endPage(ctx, u - E0); K.grain(ctx, GRAIN, t, hash01); return; }
    let i = 0; STARTS.forEach((s, k) => { if (u >= s) i = k; });
    const v = u - STARTS[i], nxt = i + 1, pe = ez(v, LEN[i] - 0.9, LEN[i], E.inOutCubic);
    if (pe > 0) {
      ctx.save(); ctx.translate(-1080 * pe, 0); slide(ctx, IMG, i, v); ctx.restore();
      ctx.save(); ctx.translate(1080 * (1 - pe), 0); if (nxt < 7) slide(ctx, IMG, nxt, 0); else endPage(ctx, 0); ctx.restore();
    } else slide(ctx, IMG, i, v);
    K.grain(ctx, GRAIN, t, hash01);
  },
});
