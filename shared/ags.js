// AG Studio house style for motion-reel films (rebuilt November 2026).
//
//   import * as M from './lib/motion.js';
//   import { makeAGS } from '../shared/ags.js';
//   const A = makeAGS(M);   // one motion.js instance, so springs share the film's beat grid
//
// Everything here is a pure function of the beat u: no state between frames, no Math.random.
// Brand: grid paper #EEF1F6, ink #0E1726, blue #2F5BFF, highlighter #B9C8FF, green #12805C,
// red #D92D20. Faces: Plus Jakarta Sans (Latin), IBM Plex Sans Arabic (Arabic), JetBrains Mono (code).

export const C = {
  paper: '#EEF1F6', ink: '#0E1726', blue: '#2F5BFF', hl: '#B9C8FF',
  green: '#12805C', red: '#D92D20', white: '#FFFFFF', line: 'rgba(14,23,38,0.07)', lineMajor: 'rgba(14,23,38,0.11)',
};
export const F = { latin: 'Jakarta', arabic: 'PlexArabic', mono: 'JetBrains Mono' };

export function makeAGS(M) {
  const { W, H, E, prog, lerp, clamp, springU, SPRING, font, rrect, TAU } = M;

  // ------------------------------------------------------------ paper
  function paper(ctx, color = C.paper) {
    ctx.fillStyle = color; ctx.fillRect(0, 0, W, H);
    const g = 40;
    ctx.lineWidth = 1.5;
    for (let x = 0, i = 0; x <= W; x += g, i++) {
      ctx.strokeStyle = i % 4 === 0 ? C.lineMajor : C.line;
      ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); ctx.stroke();
    }
    for (let y = 0, i = 0; y <= H; y += g, i++) {
      ctx.strokeStyle = i % 4 === 0 ? C.lineMajor : C.line;
      ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke();
    }
  }

  // ------------------------------------------------------------ brand mark (top left)
  function brand(ctx, logo, { x = 60, y = 78, size = 68, color = C.ink, alpha = 1 } = {}) {
    if (alpha <= 0) return;
    ctx.save(); ctx.globalAlpha = alpha;
    if (logo) ctx.drawImage(logo, x, y, size, size);
    ctx.font = font(size * 0.5, 800, F.latin); ctx.fillStyle = color; ctx.textAlign = 'left';
    ctx.letterSpacing = `${-0.01 * size}px`;
    ctx.fillText('AG Studio', x + size + 18, y + size * 0.66);
    ctx.letterSpacing = '0px';
    ctx.restore();
  }

  function shadow(ctx, blur = 40, y = 18, a = 0.14) {
    ctx.shadowColor = `rgba(14,23,38,${a})`; ctx.shadowBlur = blur; ctx.shadowOffsetY = y;
  }
  function noShadow(ctx) { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; }

  // ------------------------------------------------------------ words that rise (clip mask per line)
  // Lay words out on lines no wider than maxW. Returns [{words:[{w,x,width}], width}], x relative to line start.
  function wrap(ctx, str, f, maxW) {
    ctx.font = f;
    const space = ctx.measureText(' ').width;
    const lines = []; let cur = { words: [], width: 0 };
    for (const w of str.split(' ')) {
      const ww = ctx.measureText(w).width;
      const nx = cur.words.length ? cur.width + space : 0;
      if (cur.words.length && nx + ww > maxW) { lines.push(cur); cur = { words: [], width: 0 }; }
      const x = cur.words.length ? cur.width + space : 0;
      cur.words.push({ w, x, width: ww }); cur.width = x + ww;
    }
    lines.push(cur);
    return lines;
  }

  // Title words rise from under their own baseline, one after another, with an optional
  // highlighter swept behind the words listed in `hl` (indices into the flat word list).
  function riseWords(ctx, u, u0, str, { x, y, f, size, maxW = W, align = 'left', color = C.ink, lineH = 1.12, stagger = 0.18, hl = [], hlAt = null, exitAt = null } = {}) {
    const lines = wrap(ctx, str, f, maxW);
    let idx = 0;
    const out = [];
    lines.forEach((L, li) => {
      const lx = align === 'center' ? x - L.width / 2 : x;
      const by = y + li * size * lineH;
      L.words.forEach((wd) => out.push({ ...wd, i: idx++, gx: lx + wd.x, by }));
    });
    // highlighter first, so it sits behind the ink
    if (hl.length && hlAt != null) {
      const p = E.inOutCubic(prog(u, hlAt, hlAt + 0.9));
      const sel = out.filter((o) => hl.includes(o.i));
      const byLine = new Map();
      sel.forEach((o) => { const k = o.by; const r = byLine.get(k) || { a: Infinity, b: -Infinity, by: o.by }; r.a = Math.min(r.a, o.gx); r.b = Math.max(r.b, o.gx + o.width); byLine.set(k, r); });
      [...byLine.values()].forEach((r) => highlighter(ctx, r.a - size * 0.12, r.by - size * 0.78, r.b - r.a + size * 0.24, size * 0.98, p));
    }
    out.forEach((o) => {
      const k = springU(u, u0 + o.i * stagger, SPRING.snappy || SPRING.gentle);
      if (k <= 0.001) return;
      let dy = (1 - k) * size * 1.1;
      if (exitAt != null) dy -= E.inCubic(prog(u, exitAt + o.i * 0.03, exitAt + 0.35 + o.i * 0.03)) * size * 1.3;
      ctx.save();
      ctx.beginPath(); ctx.rect(o.gx - size, o.by - size * 1.05, o.width + size * 2, size * 1.35); ctx.clip();
      ctx.font = f; ctx.fillStyle = color; ctx.textAlign = 'left';
      ctx.fillText(o.w, o.gx, o.by + dy);
      ctx.restore();
    });
    return { lines: lines.length, bottom: y + (lines.length - 1) * size * lineH };
  }

  // Arabic line: shaped as one string (never per glyph), rises and fades in.
  function arabic(ctx, u, u0, str, { x, y, size, color = C.ink, weight = 600, align = 'center', alpha = 1, exitAt = null } = {}) {
    const k = springU(u, u0, SPRING.gentle);
    if (k <= 0.001) return;
    let dy = (1 - k) * size * 0.9, a = clamp(k * 1.4) * alpha;
    if (exitAt != null) { const e = E.inCubic(prog(u, exitAt, exitAt + 0.35)); dy -= e * size; a *= 1 - e; }
    ctx.save();
    ctx.globalAlpha = a; ctx.direction = 'rtl';
    ctx.font = font(size, weight, F.arabic); ctx.fillStyle = color; ctx.textAlign = align;
    ctx.fillText(str, x, y + dy);
    ctx.restore();
  }

  // ------------------------------------------------------------ highlighter (sweeps left to right)
  function highlighter(ctx, x, y, w, h, p, color = C.hl) {
    if (p <= 0) return;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    const ww = w * p, sk = h * 0.08;
    ctx.moveTo(x + sk, y); ctx.lineTo(x + ww + sk, y); ctx.lineTo(x + ww, y + h); ctx.lineTo(x, y + h); ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // ------------------------------------------------------------ pill (label chip / result)
  function pill(ctx, label, x, y, { bg = C.green, fg = C.white, size = 30, p = 1, check = false, align = 'left', mono = false } = {}) {
    if (p <= 0) return 0;
    const f = font(size, 800, mono ? F.mono : F.latin);
    ctx.font = f;
    const tw = ctx.measureText(label).width;
    const padX = size * 0.62, ic = check ? size * 0.95 : 0;
    const w = tw + padX * 2 + ic, h = size * 1.6;
    const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    ctx.save();
    ctx.translate(x0 + w / 2, y + h / 2); ctx.scale(p, p); ctx.translate(-(x0 + w / 2), -(y + h / 2));
    rrect(ctx, x0, y, w, h, h / 2); ctx.fillStyle = bg; ctx.fill();
    if (check) {
      ctx.strokeStyle = fg; ctx.lineWidth = size * 0.16; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const cx = x0 + padX + size * 0.32, cy = y + h / 2;
      ctx.beginPath(); ctx.moveTo(cx - size * 0.3, cy); ctx.lineTo(cx - size * 0.08, cy + size * 0.22); ctx.lineTo(cx + size * 0.32, cy - size * 0.24); ctx.stroke();
    }
    ctx.fillStyle = fg; ctx.textAlign = 'left';
    ctx.fillText(label, x0 + padX + ic, y + h / 2 + size * 0.36);
    ctx.restore();
    return w;
  }

  // ------------------------------------------------------------ cursor + click ripple
  function cursor(ctx, x, y, { press = 0, scale = 1.6, alpha = 1 } = {}) {
    if (alpha <= 0) return;
    const s = scale * (1 - 0.12 * press);
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(0, 34); ctx.lineTo(8.5, 26); ctx.lineTo(14.5, 39.5); ctx.lineTo(20, 37);
    ctx.lineTo(14.2, 23.8); ctx.lineTo(25.5, 23.8); ctx.closePath();
    shadow(ctx, 10, 4, 0.25);
    ctx.fillStyle = C.ink; ctx.fill(); noShadow(ctx);
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

  // ------------------------------------------------------------ focus ring drawn around a region
  function focusRing(ctx, x, y, w, h, p, { color = C.blue, r = 18, lw = 7 } = {}) {
    if (p <= 0) return;
    ctx.save();
    rrect(ctx, x, y, w, h, r);
    ctx.globalAlpha = 0.10 * clamp(p * 2); ctx.fillStyle = color; ctx.fill();
    ctx.globalAlpha = 1;
    const per = 2 * (w + h);
    ctx.setLineDash([per * E.outCubic(p), per]);
    ctx.lineWidth = lw; ctx.strokeStyle = color; ctx.lineCap = 'round';
    rrect(ctx, x, y, w, h, r); ctx.stroke();
    ctx.restore();
  }

  // ------------------------------------------------------------ blue circle transition
  // grow: a blue disc from (cx,cy) covers the frame; open: a hole grows from the centre and reveals.
  const maxR = (cx, cy) => Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) + 4;
  function circleCover(ctx, cx, cy, p, color = C.blue) {
    if (p <= 0) return;
    ctx.save(); ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(cx, cy, maxR(cx, cy) * E.inOutCubic(p), 0, TAU); ctx.fill();
    ctx.restore();
  }
  function circleOpen(ctx, p, color = C.blue, cx = W / 2, cy = H / 2) {
    if (p >= 1) return;
    ctx.save(); ctx.fillStyle = color;
    ctx.beginPath(); ctx.rect(0, 0, W, H);
    ctx.arc(cx, cy, maxR(cx, cy) * E.inOutCubic(clamp(p)), 0, TAU, true);
    ctx.fill('evenodd');
    ctx.restore();
  }

  // ------------------------------------------------------------ resource tile (logo or name)
  function tile(ctx, x, y, s, { img = null, full = false, label = null, p = 1 } = {}) {
    if (p <= 0) return;
    ctx.save();
    ctx.translate(x + s / 2, y + s / 2); ctx.scale(p, p); ctx.translate(-(x + s / 2), -(y + s / 2));
    const r = s * 0.24;
    shadow(ctx, 26, 10, 0.12);
    rrect(ctx, x, y, s, s, r); ctx.fillStyle = C.white; ctx.fill(); noShadow(ctx);
    if (img && full) {
      ctx.save(); rrect(ctx, x, y, s, s, r); ctx.clip(); ctx.drawImage(img, x, y, s, s); ctx.restore();
    } else if (img) {
      const pad = s * 0.16, bw = s - pad * 2, bh = s - pad * 2;
      const k = Math.min(bw / img.width, bh / img.height);
      const dw = img.width * k, dh = img.height * k;
      ctx.drawImage(img, x + (s - dw) / 2, y + (s - dh) / 2, dw, dh);
    } else if (label) {
      const lines = label.split('\n');
      const fs = s * (lines.length > 1 ? 0.2 : 0.24);
      ctx.font = font(fs, 800, F.latin); ctx.fillStyle = C.ink; ctx.textAlign = 'center';
      lines.forEach((l, i) => ctx.fillText(l, x + s / 2, y + s / 2 + fs * 0.36 + (i - (lines.length - 1) / 2) * fs * 1.12));
    }
    ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(14,23,38,0.08)'; rrect(ctx, x, y, s, s, r); ctx.stroke();
    ctx.restore();
  }

  // ------------------------------------------------------------ end screens (blue)
  function endKeep(ctx, u, u0, { exitAt = null } = {}) {
    const cx = W / 2;
    riseWords(ctx, u, u0, 'Keep it simple.', { x: cx, y: H * 0.47, f: font(118, 800, F.latin), size: 118, align: 'center', color: C.white, stagger: 0.22, exitAt });
    arabic(ctx, u, u0 + 1, 'اجعلها بسيطة.', { x: cx, y: H * 0.47 + 130, size: 70, color: 'rgba(255,255,255,0.86)', exitAt });
  }
  function endFollow(ctx, u, u0, logo) {
    const cx = W / 2;
    const k = springU(u, u0, SPRING.bouncy || SPRING.gentle);
    if (logo && k > 0) {
      const s = 190 * k;
      ctx.save(); shadow(ctx, 40, 16, 0.25); ctx.drawImage(logo, cx - s / 2, H * 0.31 - s / 2, s, s); ctx.restore();
    }
    riseWords(ctx, u, u0 + 0.5, 'Follow for more UI/UX tutorials', { x: cx, y: H * 0.47, f: font(84, 800, F.latin), size: 84, maxW: 860, align: 'center', color: C.white, stagger: 0.14 });
    arabic(ctx, u, u0 + 1.5, 'تابعني لمزيد من دروس UI/UX', { x: cx, y: H * 0.47 + 240, size: 58, color: 'rgba(255,255,255,0.86)' });
  }

  return { C, F, paper, brand, shadow, noShadow, wrap, riseWords, arabic, highlighter, pill, cursor, ripple, focusRing, circleCover, circleOpen, tile, endKeep, endFollow };
}
