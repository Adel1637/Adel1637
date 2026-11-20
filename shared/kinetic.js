// Kinetic "dark software" style helpers (used by tools-uiux / tools-long style films).
// IBM Plex (Sans, Mono, Sans Arabic), grays of real software UIs, springs, masks. v = local beats.
export function makeKinetic(M) {
  const { W, clamp, E, spring, TAU } = M;
  const B = 60 / 128;
  const F = { title: 'Plex', mono: 'PlexMono', ar: 'PlexAr', serif: 'Serif', naskh: 'Naskh' };
  const C = { ink: '#EDEDED', sub: '#A8A8A8', sel: '#0D99FF', endBlue: '#0C8CE9', green: '#30A46C', red: '#E5484D', bg: '#161616' };
  const ez = (v, a, b, f = E.outExpo) => f(clamp((v - a) / (b - a)));
  const spr = (v, a, cfg = { stiffness: 230, damping: 15 }) => (v < a ? 0 : spring((v - a) * B, cfg));
  function txt(ctx, s, x, y, size, { w = 700, color = C.ink, align = 'left', family = F.title, rtl = false, sx = 1, sy = 1, alpha = 1 } = {}) {
    if (alpha <= 0) return;
    ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.scale(sx, sy);
    ctx.font = `${w} ${size}px ${family}`; ctx.fillStyle = color; ctx.textAlign = align; ctx.direction = rtl ? 'rtl' : 'ltr';
    ctx.fillText(s, 0, 0); ctx.restore();
  }
  function maskUp(ctx, s, x, y, size, p, o = {}) {
    if (p <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(-W, y - size * 1.0, W * 3, size * 1.3); ctx.clip();
    txt(ctx, s, x, y + (1 - p) * size * 1.15, size, o); ctx.restore();
  }
  function measure(ctx, s, size, w = 700, family = F.title) { ctx.font = `${w} ${size}px ${family}`; return ctx.measureText(s).width; }
  const fit = (ctx, s, max, maxW, w = 700, family = F.title) => Math.min(max, Math.floor(max * maxW / measure(ctx, s, max, w, family)));
  const rr = (ctx, x, y, w, h, r, fill, stroke, lw = 2) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } };
  function cursor(ctx, x, y, color = '#FFFFFF', label = null, tagColor = C.sel) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = color; ctx.strokeStyle = '#111'; ctx.lineWidth = 2.5; ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(0, 46); ctx.lineTo(12, 35); ctx.lineTo(22, 56); ctx.lineTo(30, 52); ctx.lineTo(20, 31); ctx.lineTo(36, 31); ctx.closePath(); ctx.fill(); ctx.stroke();
    if (label) { ctx.font = `700 22px ${F.title}`; const w = ctx.measureText(label).width + 22; rr(ctx, 30, 50, w, 36, 8, tagColor); txt(ctx, label, 41, 75, 22, { color: '#FFFFFF' }); }
    ctx.restore();
  }
  // a badge that springs in (pill)
  function pill(ctx, s, cx, cy, p, color = C.green, size = 30) {
    if (p <= 0) return;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(p, p); ctx.font = `700 ${size}px ${F.title}`;
    const w = ctx.measureText(s).width + size * 1.6; rr(ctx, -w / 2, -size, w, size * 2, size, color); txt(ctx, s, 0, size * 0.36, size, { color: '#FFFFFF', align: 'center' });
    ctx.restore();
  }
  function grain(ctx, G, t, hash01, alpha = 0.05) {
    ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = alpha; ctx.drawImage(G, -Math.floor(hash01(Math.floor(t * 24), 1) * 30), 0, ctx.canvas.width + 30, ctx.canvas.height); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }
  function makeGrain(w, h) {
    const G = document.createElement('canvas'); G.width = w; G.height = h;
    const g = G.getContext('2d'), img = g.createImageData(w, h), rnd = M.mulberry32(9);
    for (let i = 0; i < img.data.length; i += 4) { const c = 225 + rnd() * 30; img.data[i] = img.data[i + 1] = img.data[i + 2] = c; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0); return G;
  }
  return { B, F, C, TAU, ez, spr, txt, maskUp, measure, fit, rr, cursor, pill, grain, makeGrain };
}
