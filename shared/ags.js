// AG Studio house style for motion-reel films, matched to the published Shorts (November 2026).
//
//   import * as M from './lib/motion.js';
//   import { makeAGS } from '../shared/ags.js';
//   const A = makeAGS(M);   // one motion.js instance, so springs share the film's beat grid
//
// Layout of a Short (1080x1920), from the reference video:
//   dotted paper #EEF1F6 · series pill (black) top left + "AG Studio" top right (y 225-290)
//   step title: blue number badge + Plus Jakarta Sans 800, tight tracking, left aligned (x 64)
//   Arabic title in blue, right aligned (x 1016) · grey explanation EN (left) + AR (right)
//   segmented progress bar · blue label + Figma-style selection frame around the UI card
//   end: plain blue page, "Keep it simple." huge, white pill "Follow for more UI/UX tutorials".
// Everything is a pure function of the beat u: no state between frames, no Math.random.

export const C = {
  paper: '#EEF1F6', ink: '#0E1726', blue: '#2F5BFF', hl: '#B9C8FF', green: '#12805C', red: '#D92D20',
  white: '#FFFFFF', grey: '#5A6473', dot: '#C7CBD3', bar: '#D2D7DF', line: 'rgba(14,23,38,0.10)',
};
export const F = { latin: 'Jakarta', arabic: 'PlexArabic', mono: 'JetBrains Mono' };
export const L = { left: 64, right: 1016, width: 952 };

export function makeAGS(M) {
  const { W, H, E, prog, clamp, springU, SPRING, font, rrect, TAU } = M;
  const TRACK = -0.035;                       // title tracking, em

  // ------------------------------------------------------------ paper (dot grid)
  function paper(ctx, color = C.paper, dots = true) {
    ctx.fillStyle = color; ctx.fillRect(0, 0, W, H);
    if (!dots) return;
    ctx.fillStyle = C.dot;
    for (let y = 20; y < H; y += 44) for (let x = 20; x < W; x += 44) { ctx.fillRect(x, y, 4, 4); }
  }

  function shadow(ctx, blur = 40, y = 18, a = 0.12) { ctx.shadowColor = `rgba(14,23,38,${a})`; ctx.shadowBlur = blur; ctx.shadowOffsetY = y; }
  function noShadow(ctx) { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; }

  // ------------------------------------------------------------ header: series pill + wordmark
  function header(ctx, u, series, { u0 = -0.3, y = 225 } = {}) {
    const p = springU(u, u0, SPRING.snappy);
    if (p <= 0) return;
    ctx.save(); ctx.globalAlpha = clamp(p * 1.5);
    const f = font(31, 700, F.latin);
    ctx.font = f; ctx.letterSpacing = '-0.5px';
    const tw = ctx.measureText(series).width, h = 66, w = tw + 56;
    rrect(ctx, L.left, y + (1 - p) * 16, w, h, h / 2); ctx.fillStyle = C.ink; ctx.fill();
    ctx.fillStyle = C.white; ctx.textAlign = 'left'; ctx.fillText(series, L.left + 28, y + 44 + (1 - p) * 16);
    ctx.font = font(31, 700, F.latin); ctx.fillStyle = C.ink; ctx.textAlign = 'right';
    ctx.fillText('AG Studio', L.right, y + 45 + (1 - p) * 16);
    ctx.letterSpacing = '0px';
    ctx.restore();
  }

  // ------------------------------------------------------------ text helpers
  function wrap(ctx, str, f, maxW, track = 0) {
    ctx.font = f; ctx.letterSpacing = `${track}px`;
    const space = ctx.measureText(' ').width;
    const lines = []; let cur = { words: [], width: 0 };
    for (const w of str.split(' ')) {
      const ww = ctx.measureText(w).width;
      if (cur.words.length && cur.width + space + ww > maxW) { lines.push(cur); cur = { words: [], width: 0 }; }
      const x = cur.words.length ? cur.width + space : 0;
      cur.words.push({ w, x, width: ww }); cur.width = x + ww;
    }
    lines.push(cur);
    ctx.letterSpacing = '0px';
    return lines;
  }

  // Words rise from under their own line (clip mask), one after another. `exit` sends them up and out.
  // Optional highlighter swept behind word indices `hl` at beat `hlAt`.
  function riseWords(ctx, u, u0, str, { x, y, size, weight = 800, maxW = L.width, align = 'left', color = C.ink, lineH = 1.08, stagger = 0.1, track = TRACK, hl = [], hlAt = null, exit = null, family = F.latin } = {}) {
    if (u < u0 - 0.01) return { bottom: y };
    const f = font(size, weight, family), tr = track * size;
    const lines = wrap(ctx, str, f, maxW, tr);
    const out = []; let idx = 0;
    lines.forEach((Ln, li) => {
      const lx = align === 'center' ? x - Ln.width / 2 : align === 'right' ? x - Ln.width : x;
      Ln.words.forEach((wd) => out.push({ ...wd, i: idx++, gx: lx + wd.x, by: y + li * size * lineH }));
    });
    const ex = exit == null ? 0 : E.inCubic(prog(u, exit, exit + 0.45));
    if (ex >= 1) return { bottom: y + (lines.length - 1) * size * lineH };
    if (hl.length && hlAt != null) {
      const p = E.inOutCubic(prog(u, hlAt, hlAt + 0.8)) * (1 - ex);
      const sel = out.filter((o) => hl.includes(o.i));
      if (sel.length) {
        const a = Math.min(...sel.map((o) => o.gx)), b = Math.max(...sel.map((o) => o.gx + o.width));
        highlighter(ctx, a - size * 0.08, sel[0].by - size * 0.74, b - a + size * 0.16, size * 0.92, p);
      }
    }
    out.forEach((o) => {
      const k = springU(u, u0 + o.i * stagger, SPRING.snappy);
      if (k <= 0.001) return;
      const dy = (1 - k) * size * 1.05 - ex * size * 1.2;
      ctx.save();
      ctx.beginPath(); ctx.rect(o.gx - size * 0.3, o.by - size * 1.0, o.width + size * 0.6, size * 1.3); ctx.clip();
      ctx.font = f; ctx.letterSpacing = `${tr}px`; ctx.fillStyle = color; ctx.textAlign = 'left';
      ctx.fillText(o.w, o.gx, o.by + dy);
      ctx.restore();
    });
    return { bottom: y + (lines.length - 1) * size * lineH };
  }

  // A whole line that rises and fades (Arabic is always shaped as one string, never per glyph).
  function line(ctx, u, u0, str, { x, y, size, weight = 600, color = C.ink, align = 'left', rtl = false, family = null, exit = null } = {}) {
    const k = springU(u, u0, SPRING.gentle);
    if (k <= 0.001) return;
    const ex = exit == null ? 0 : E.inCubic(prog(u, exit, exit + 0.4));
    if (ex >= 1) return;
    ctx.save();
    ctx.globalAlpha = clamp(k * 1.5) * (1 - ex);
    ctx.direction = rtl ? 'rtl' : 'ltr';
    ctx.font = font(size, weight, family || (rtl ? F.arabic : F.latin)); ctx.fillStyle = color; ctx.textAlign = align;
    ctx.fillText(str, x, y + (1 - k) * size * 0.8 - ex * size);
    ctx.restore();
  }

  function highlighter(ctx, x, y, w, h, p, color = C.hl) {
    if (p <= 0) return;
    ctx.save(); ctx.fillStyle = color;
    rrect(ctx, x, y, w * p, h, 8); ctx.fill();
    ctx.restore();
  }

  // ------------------------------------------------------------ step number badge (blue square)
  function badge(ctx, n, x, y, p, s = 76) {
    if (p <= 0) return;
    ctx.save();
    ctx.translate(x + s / 2, y + s / 2); ctx.scale(p, p); ctx.translate(-(x + s / 2), -(y + s / 2));
    rrect(ctx, x, y, s, s, s * 0.21); ctx.fillStyle = C.blue; ctx.fill();
    ctx.font = font(s * 0.5, 700, F.latin); ctx.fillStyle = C.white; ctx.textAlign = 'center';
    ctx.fillText(String(n), x + s / 2, y + s * 0.68);
    ctx.restore();
  }

  // ------------------------------------------------------------ segmented progress bar
  function progress(ctx, n, done, { y = 676, alpha = 1 } = {}) {
    if (alpha <= 0) return;
    const gap = 12, w = (L.width - gap * (n - 1)) / n, h = 10;
    ctx.save(); ctx.globalAlpha = alpha;
    for (let i = 0; i < n; i++) {
      const x = L.left + i * (w + gap);
      rrect(ctx, x, y, w, h, h / 2); ctx.fillStyle = C.bar; ctx.fill();
      const f = clamp(done - i);
      if (f > 0) { rrect(ctx, x, y, w * f, h, h / 2); ctx.fillStyle = C.blue; ctx.fill(); }
    }
    ctx.restore();
  }

  // ------------------------------------------------------------ Figma-style selection frame + label
  function selection(ctx, x, y, w, h, { p = 1, label = null, labelU = null, u = 0, color = C.blue, handles = true } = {}) {
    if (p <= 0) return;
    ctx.save();
    const per = 2 * (w + h);
    ctx.setLineDash([per * E.outCubic(p), per]);
    ctx.lineWidth = 2.5; ctx.strokeStyle = color;
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);
    if (handles) {
      const hp = clamp((p - 0.6) / 0.4), s = 16 * hp;
      if (hp > 0) for (const [hx, hy] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) {
        ctx.fillStyle = C.white; ctx.fillRect(hx - s / 2, hy - s / 2, s, s);
        ctx.lineWidth = 2.5; ctx.strokeRect(hx - s / 2, hy - s / 2, s, s);
      }
    }
    ctx.restore();
  }

  // ------------------------------------------------------------ pill (result chip)
  function pill(ctx, label, x, y, { bg = C.green, fg = C.white, size = 30, p = 1, check = false, align = 'left', mono = false } = {}) {
    if (p <= 0) return 0;
    const f = font(size, 700, mono ? F.mono : F.latin);
    ctx.font = f;
    const tw = ctx.measureText(label).width;
    const padX = size * 0.62, ic = check ? size * 0.95 : 0;
    const w = tw + padX * 2 + ic, h = size * 1.6;
    const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    ctx.save();
    ctx.translate(x0 + w / 2, y + h / 2); ctx.scale(p, p); ctx.translate(-(x0 + w / 2), -(y + h / 2));
    shadow(ctx, 18, 6, 0.18);
    rrect(ctx, x0, y, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); noShadow(ctx);
    if (check) {
      ctx.strokeStyle = fg; ctx.lineWidth = size * 0.15; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const cx = x0 + padX + size * 0.32, cy = y + h / 2;
      ctx.beginPath(); ctx.moveTo(cx - size * 0.3, cy); ctx.lineTo(cx - size * 0.08, cy + size * 0.22); ctx.lineTo(cx + size * 0.32, cy - size * 0.24); ctx.stroke();
    }
    ctx.fillStyle = fg; ctx.textAlign = 'left';
    ctx.fillText(label, x0 + padX + ic, y + h / 2 + size * 0.36);
    ctx.restore();
    return w;
  }

  // ------------------------------------------------------------ cursor + click ripple
  function cursor(ctx, x, y, { press = 0, scale = 1.5, alpha = 1 } = {}) {
    if (alpha <= 0) return;
    const s = scale * (1 - 0.12 * press);
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(0, 34); ctx.lineTo(8.5, 26); ctx.lineTo(14.5, 39.5); ctx.lineTo(20, 37);
    ctx.lineTo(14.2, 23.8); ctx.lineTo(25.5, 23.8); ctx.closePath();
    shadow(ctx, 10, 4, 0.25); ctx.fillStyle = C.ink; ctx.fill(); noShadow(ctx);
    ctx.lineWidth = 2.6; ctx.strokeStyle = C.white; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.restore();
  }
  function ripple(ctx, x, y, p, color = C.blue) {
    if (p <= 0 || p >= 1) return;
    ctx.save();
    ctx.globalAlpha = (1 - p) * 0.55; ctx.strokeStyle = color; ctx.lineWidth = 6 * (1 - p) + 1;
    ctx.beginPath(); ctx.arc(x, y, 12 + 70 * E.outCubic(p), 0, TAU); ctx.stroke();
    ctx.restore();
  }

  // ------------------------------------------------------------ blue circle transition
  const maxR = (cx, cy) => Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) + 4;
  function circleCover(ctx, cx, cy, p, color = C.blue) {
    if (p <= 0) return;
    ctx.save(); ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(cx, cy, maxR(cx, cy) * E.inOutCubic(clamp(p)), 0, TAU); ctx.fill();
    ctx.restore();
  }

  // ------------------------------------------------------------ resource tile (logo or name)
  function tile(ctx, x, y, s, { img = null, full = false, label = null, p = 1 } = {}) {
    if (p <= 0) return;
    ctx.save();
    ctx.translate(x + s / 2, y + s / 2); ctx.scale(p, p); ctx.translate(-(x + s / 2), -(y + s / 2));
    const r = s * 0.22;
    shadow(ctx, 24, 8, 0.10);
    rrect(ctx, x, y, s, s, r); ctx.fillStyle = C.white; ctx.fill(); noShadow(ctx);
    if (img && full) {
      ctx.save(); rrect(ctx, x, y, s, s, r); ctx.clip(); ctx.drawImage(img, x, y, s, s); ctx.restore();
    } else if (img) {
      const pad = s * 0.16, k = Math.min((s - pad * 2) / img.width, (s - pad * 2) / img.height);
      ctx.drawImage(img, x + (s - img.width * k) / 2, y + (s - img.height * k) / 2, img.width * k, img.height * k);
    } else if (label) {
      const ls = label.split('\n'), fs = s * (ls.length > 1 ? 0.2 : 0.24);
      ctx.font = font(fs, 800, F.latin); ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.letterSpacing = `${-0.02 * fs}px`;
      ls.forEach((l, i) => ctx.fillText(l, x + s / 2, y + s / 2 + fs * 0.36 + (i - (ls.length - 1) / 2) * fs * 1.12));
      ctx.letterSpacing = '0px';
    }
    ctx.lineWidth = 2; ctx.strokeStyle = C.line; rrect(ctx, x, y, s, s, r); ctx.stroke();
    ctx.restore();
  }

  // ------------------------------------------------------------ end page (as in the published Shorts)
  // Plain blue, "Keep it / simple." huge and left aligned, Arabic under it, white pill CTA, AR line.
  function endCard(ctx, u, u0, { wordmark = true } = {}) {
    ctx.fillStyle = C.blue; ctx.fillRect(0, 0, W, H);
    const x = 80;
    riseWords(ctx, u, u0, 'Keep it', { x, y: 665, size: 160, color: C.white, stagger: 0.25, track: -0.045, maxW: 960 });
    riseWords(ctx, u, u0 + 0.5, 'simple.', { x, y: 812, size: 160, color: C.white, stagger: 0.25, track: -0.045, maxW: 960 });
    line(ctx, u, u0 + 1.2, 'اجعلها بسيطة.', { x, y: 940, size: 96, weight: 700, color: C.white, align: 'left', rtl: true });
    // CTA pill: white, blue text
    const p = springU(u, u0 + 2.2, SPRING.snappy);
    if (p > 0) {
      ctx.save(); ctx.globalAlpha = clamp(p * 1.5);
      const f = font(42, 700, F.latin); ctx.font = f; ctx.letterSpacing = '-0.6px';
      const label = 'Follow for more UI/UX tutorials', tw = ctx.measureText(label).width, h = 104, w = tw + 88;
      const yy = 1038 + (1 - p) * 30;
      rrect(ctx, x, yy, w, h, h / 2); ctx.fillStyle = C.white; ctx.fill();
      ctx.fillStyle = C.blue; ctx.textAlign = 'left'; ctx.fillText(label, x + 44, yy + 68);
      ctx.letterSpacing = '0px';
      ctx.restore();
    }
    line(ctx, u, u0 + 2.9, 'تابعني لمزيد من دروس UI/UX', { x, y: 1213, size: 38, weight: 500, color: C.white, align: 'left', rtl: true });
    if (wordmark) line(ctx, u, u0 + 3.4, 'AG Studio', { x, y: 1383, size: 38, weight: 700, color: C.white, align: 'left' });
  }

  return { C, F, L, paper, shadow, noShadow, header, wrap, riseWords, line, highlighter, badge, progress, selection, pill, cursor, ripple, circleCover, tile, endCard };
}
