// "How to choose your color palette" in the kinetic dark-software style: data + live vignettes.
// Every vignette is drawn in the Short's coordinates: area x 80..1000, y 280..1150 (center 540, 715).
// The long 16:9 film maps that area to its right half. v = local beats from the start of the scene.
export function makePaletteKinetic(M, K) {
  const { lerp, clamp, E, mix, hash01 } = M;
  const { F, C, TAU, ez, spr, txt, maskUp, rr, pill, cursor } = K;

  // ---------------------------------------------------------------- colour data (one fictional brand)
  const BASE = '#3157D5';
  const toRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const hex = (r, g, b) => '#' + [r, g, b].map((x) => Math.round(clamp(x, 0, 255)).toString(16).padStart(2, '0')).join('').toUpperCase();
  const lum = (h) => { const c = toRgb(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const SHADES = [0.92, 0.8, 0.62, 0.42, 0.2, 0, -0.18, -0.36, -0.54].map((k) => (k >= 0 ? mix(BASE, '#FFFFFF', k) : mix(BASE, '#000000', -k)));
  const NAMES = ['50', '100', '200', '300', '400', '500', '600', '700', '800'];
  const PURE = ['#F7F7F7', '#EAEAEA', '#D4D4D4', '#B3B3B3', '#8A8A8A', '#626262', '#444444', '#2C2C2C', '#181818'];
  const GRAYS = PURE.map((g) => mix(g, BASE, 0.08));
  const STATUS = [['#2E9E5B', 'SUCCESS', 'نجاح', 'Changes saved.', 'check'], ['#E2B203', 'WARNING', 'تنبيه', 'Check your card details.', 'bang'], ['#E5484D', 'ERROR', 'خطأ', 'Payment failed. Try again.', 'cross']];
  const WHITE_ON_BASE = ratio('#FFFFFF', BASE);
  // hsv
  function toHsv(h) { const [r, g, b] = toRgb(h).map((x) => x / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let hh = 0; if (d) { if (mx === r) hh = ((g - b) / d) % 6; else if (mx === g) hh = (b - r) / d + 2; else hh = (r - g) / d + 4; } return [(hh * 60 + 360) % 360, mx ? d / mx : 0, mx]; }
  function fromHsv(h, s, v) { const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c; const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]; return hex((r + m) * 255, (g + m) * 255, (b + m) * 255); }
  const [BH, BS, BV] = toHsv(BASE);

  const icon = (ctx, kind, x, y, r, col) => {
    ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = r * 0.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    if (kind === 'check') { ctx.moveTo(x - r * 0.42, y + r * 0.02); ctx.lineTo(x - r * 0.1, y + r * 0.34); ctx.lineTo(x + r * 0.45, y - r * 0.3); }
    else if (kind === 'bang') { ctx.moveTo(x, y - r * 0.45); ctx.lineTo(x, y + r * 0.1); ctx.moveTo(x, y + r * 0.42); ctx.lineTo(x, y + r * 0.44); }
    else { ctx.moveTo(x - r * 0.35, y - r * 0.35); ctx.lineTo(x + r * 0.35, y + r * 0.35); ctx.moveTo(x + r * 0.35, y - r * 0.35); ctx.lineTo(x - r * 0.35, y + r * 0.35); }
    ctx.stroke(); ctx.restore();
  };
  const redX = (ctx, x, y, p) => { if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(p, p); icon(ctx, 'cross', 0, 0, 34, C.red); ctx.restore(); };

  // ---------------------------------------------------------------- hook chips (random colors)
  const CHIPS = ['#E5484D', '#22C55E', '#06B6D4', '#A855F7', '#FACC15', '#EC4899', '#14B8A6'];
  function chips(ctx, v, t, area, gather = [99, 100], target = [540, 715]) {
    const [x0, y0, w, h] = area, g = ez(v, gather[0], gather[1], E.inCubic);
    CHIPS.forEach((c, i) => {
      const bx = x0 + (i % 4) * (w / 4) + w / 8 + (Math.floor(i / 4) ? w / 8 : 0), by = y0 + (Math.floor(i / 4) + 0.5) * (h / 2) + (hash01(i, 2) - 0.5) * 60;
      const bob = Math.sin(t * 2.6 + i * 1.3) * 14, rot = (hash01(i, 3) - 0.5) * 0.6 + 0.08 * Math.sin(t * 2 + i);
      const x = lerp(bx, target[0], g), y = lerp(by + bob, target[1], g), s = lerp(1, 0.2, g);
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot * (1 - g)); ctx.scale(s, s); rr(ctx, -70, -90, 140, 180, 18, c); ctx.restore();
    });
  }

  // ---------------------------------------------------------------- 1. a color picker settles on the brand color
  function vPicker(ctx, v, s0 = 2.6) {
    const op = spr(v, s0, { stiffness: 210, damping: 16 }); if (op <= 0) return;
    ctx.save(); ctx.globalAlpha = Math.min(1, op); ctx.translate(540, 560); ctx.scale(lerp(0.9, 1, Math.min(1, op)), lerp(0.9, 1, Math.min(1, op))); ctx.translate(-540, -560);
    rr(ctx, 80, 300, 920, 540, 24, '#232323', '#333', 2);
    const sx = 120, sy = 340, sz = 460;
    const g1 = ctx.createLinearGradient(sx, 0, sx + sz, 0); g1.addColorStop(0, '#FFFFFF'); g1.addColorStop(1, fromHsv(BH, 1, 1));
    ctx.fillStyle = g1; ctx.fillRect(sx, sy, sz, sz);
    const g2 = ctx.createLinearGradient(0, sy, 0, sy + sz); g2.addColorStop(0, 'rgba(0,0,0,0)'); g2.addColorStop(1, '#000000');
    ctx.fillStyle = g2; ctx.fillRect(sx, sy, sz, sz);
    const k = spr(v, s0 + 1.2, { stiffness: 120, damping: 11 }), s = lerp(0.18, BS, k), val = lerp(0.42, BV, k), col = fromHsv(BH, clamp(s, 0, 1), clamp(val, 0, 1));
    const hx = sx + clamp(s, 0, 1) * sz, hy = sy + (1 - clamp(val, 0, 1)) * sz;
    ctx.lineWidth = 5; ctx.strokeStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(hx, hy, 18, 0, TAU); ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = '#000'; ctx.beginPath(); ctx.arc(hx, hy, 21, 0, TAU); ctx.stroke();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(790, 470, 110, 0, TAU); ctx.fill();
    rr(ctx, 640, 640, 300, 70, 12, '#161616', '#3A3A3A', 2); txt(ctx, k > 0.98 ? BASE : col, 790, 687, 32, { w: 600, family: F.mono, align: 'center' });
    txt(ctx, 'BRAND COLOR', 790, 770, 24, { w: 600, family: F.mono, color: C.sub, align: 'center' });
    ctx.restore();
    if (v >= s0 + 0.8 && v < s0 + 4) cursor(ctx, (sx + BS * sz) + 26, (sy + (1 - BV) * sz) + 26);
    // white text on it
    const bt = spr(v, s0 + 6.4, { stiffness: 240, damping: 15 });
    if (bt > 0) {
      ctx.save(); ctx.translate(330, 960); ctx.scale(bt, bt); rr(ctx, -250, -60, 500, 120, 16, BASE); txt(ctx, 'Get started', 0, 16, 44, { color: '#FFFFFF', align: 'center' }); ctx.restore();
      pill(ctx, `${WHITE_ON_BASE.toFixed(1)}:1 ✓`, 800, 960, spr(v, s0 + 7.2, { stiffness: 300, damping: 12 }), C.green, 34);
    }
  }
  // 1 (long). three moods, then the picker
  const MOODS = [[BASE, 'TRUST', 'ثقة'], ['#E5484D', 'ENERGY', 'طاقة'], ['#2E9E6E', 'CALM', 'هدوء']];
  function vMoods(ctx, v) {
    if (v >= 8) { vPicker(ctx, v, 8); return; }
    const out = ez(v, 6.4, 7.6, E.inCubic);
    MOODS.forEach(([c, en, ar], i) => {
      const s = spr(v, 2.6 + i * 0.6, { stiffness: 260, damping: 13 }); if (s <= 0) return;
      const cx = 230 + i * 310, cy = 640, chosen = i === 0 && v >= 5.6;
      const k = i === 0 ? 1 : 1 - out;
      ctx.save(); ctx.translate(lerp(cx, 540, i === 0 ? out : 0), cy); ctx.scale(s * k * (chosen ? 1 + 0.08 * ez(v, 5.6, 6) : 1), s * k);
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(0, 0, 130, 0, TAU); ctx.fill();
      if (chosen) { ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 150, 0, TAU); ctx.stroke(); }
      ctx.restore();
      txt(ctx, en, cx, 860, 30, { w: 600, family: F.mono, align: 'center', alpha: k });
      txt(ctx, ar, cx, 915, 38, { family: F.ar, align: 'center', rtl: true, alpha: k });
    });
  }

  // ---------------------------------------------------------------- 2. nine shades rise like bars; the base lifts; roles
  const ROLES = [[0, 1, 'BACKGROUNDS', 'الخلفيات'], [2, 4, 'BORDERS', 'الحدود'], [5, 5, 'BUTTONS', 'الأزرار'], [6, 7, 'HOVER', 'التمرير'], [8, 8, 'TEXT', 'النصوص']];
  function vShades(ctx, v, roles = false) {
    const w = 920 / 9, top = 340, bot = roles ? 820 : 980;
    SHADES.forEach((c, i) => {
      const s = spr(v, 2.6 + i * 0.3, { stiffness: 200, damping: 13 }); if (s <= 0) return;
      const lift = i === 5 ? 30 * spr(v, 6.2, { stiffness: 300, damping: 10 }) : 0, h = (bot - top) * s;
      rr(ctx, 80 + i * w + 4, bot - h - lift, w - 8, h, 10, c);
      txt(ctx, NAMES[i], 80 + i * w + w / 2, bot + 44, 26, { w: 600, family: F.mono, align: 'center', color: i === 5 && v >= 6.2 ? '#FFFFFF' : C.sub });
    });
    if (v >= 6.2) pill(ctx, 'BASE', 80 + 5.5 * w, top - 40 - 30 * spr(v, 6.2, { stiffness: 300, damping: 10 }), spr(v, 6.2, { stiffness: 300, damping: 12 }), C.sel, 22);
    if (!roles) return;
    ROLES.forEach(([a, b, en, ar], i) => {
      const p = spr(v, 9 + i * 1.2, { stiffness: 260, damping: 14 }); if (p <= 0) return;
      const xa = 80 + a * w + 6, xb = 80 + (b + 1) * w - 6, row = i % 2, y = 940 + row * 120, cx = (xa + xb) / 2;
      ctx.save(); ctx.globalAlpha = Math.min(1, p); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(xa, y - 40, (xb - xa) * Math.min(1, p), 4); ctx.fillRect(xa, y - 52, 4, 16); ctx.fillRect(xb - 4, y - 52, 4, 16);
      if (row) ctx.fillRect(cx - 2, y - 150, 3, 110);
      txt(ctx, en, cx, y, 22, { w: 600, family: F.mono, align: 'center' }); txt(ctx, ar, cx, y + 40, 28, { family: F.ar, align: 'center', rtl: true });
      ctx.restore();
    });
  }

  // ---------------------------------------------------------------- 3. a tint slider turns pure grays into tinted grays
  function miniCard(ctx, x, y, w, h, g, label, ok) {
    rr(ctx, x, y, w, h, 16, g[0]);
    rr(ctx, x + 24, y + 28, w * 0.5, 18, 6, g[8]); rr(ctx, x + 24, y + 62, w * 0.75, 12, 6, g[4]); rr(ctx, x + 24, y + 84, w * 0.6, 12, 6, g[4]);
    ctx.fillStyle = g[2]; ctx.fillRect(x + 24, y + 112, w - 48, 3);
    rr(ctx, x + 24, y + h - 64, 150, 44, 10, BASE);
    txt(ctx, label, x, y - 16, 24, { w: 600, family: F.mono, color: ok ? '#7EE2A8' : C.sub });
  }
  function vGrays(ctx, v) {
    const w = 920 / 9, tint = 0.08 * ez(v, 5.2, 7.4, E.inOutCubic);
    if (v >= 2.6) { txt(ctx, 'YOUR BRAND', 80, 320, 24, { w: 600, family: F.mono, color: C.sub }); SHADES.forEach((c, i) => { const s = spr(v, 2.6 + i * 0.12); rr(ctx, 80 + i * w + 3, 340, (w - 6) * Math.min(1, s), 110, 8, c); }); }
    if (v >= 3.6) {
      txt(ctx, 'GRAYS', 80, 510, 24, { w: 600, family: F.mono, color: C.sub }); txt(ctx, `TINT ${Math.round(tint * 100)}%`, 1000, 510, 24, { w: 600, family: F.mono, align: 'right', color: '#FFFFFF' });
      PURE.forEach((c, i) => { const s = spr(v, 3.6 + i * 0.12); rr(ctx, 80 + i * w + 3, 530, (w - 6) * Math.min(1, s), 110, 8, mix(c, BASE, tint)); });
      // slider 0..20 %
      const sl = ez(v, 4.2, 4.8); ctx.save(); ctx.globalAlpha = sl;
      rr(ctx, 80, 704, 920, 10, 5, '#333'); rr(ctx, 80, 704, 920 * (tint / 0.2), 10, 5, BASE);
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(80 + 920 * (tint / 0.2), 709, 20, 0, TAU); ctx.fill();
      txt(ctx, '0%', 80, 760, 22, { w: 600, family: F.mono, color: C.sub }); txt(ctx, '20%', 1000, 760, 22, { w: 600, family: F.mono, color: C.sub, align: 'right' });
      ctx.restore();
    }
    const cp = spr(v, 9.5, { stiffness: 220, damping: 15 });
    if (cp > 0) { ctx.save(); ctx.globalAlpha = Math.min(1, cp); ctx.translate(0, (1 - Math.min(1, cp)) * 80); miniCard(ctx, 80, 860, 440, 260, PURE, 'PURE: COLD', false); miniCard(ctx, 560, 860, 440, 260, GRAYS, 'TINTED: CALM ✓', true); ctx.restore(); }
  }

  // ---------------------------------------------------------------- 4. three toasts slide in, each with a colored icon
  function vStatus(ctx, v) {
    STATUS.forEach(([c, en, ar, msg, ic], i) => {
      const s = spr(v, 2.8 + i * 0.9, { stiffness: 190, damping: 15 }); if (s <= 0) return;
      const y = 320 + i * 190, x = lerp(1100, 80, s);
      rr(ctx, x, y, 920, 160, 18, '#262626', '#363636', 2);
      ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(x, y, 12, 160, [18, 0, 0, 18]); ctx.fill();
      icon(ctx, ic, x + 90, y + 80, 38, c);
      txt(ctx, en, x + 160, y + 62, 24, { w: 600, family: F.mono, color: c });
      txt(ctx, msg, x + 160, y + 112, 38, { color: '#FFFFFF' });
    });
    STATUS.forEach(([c, en, ar], i) => {
      const s = spr(v, 8.5 + i * 0.4, { stiffness: 280, damping: 13 }); if (s <= 0) return;
      const cx = 80 + 153 + i * 307;
      ctx.save(); ctx.translate(cx, 950); ctx.scale(s, s); rr(ctx, -140, -60, 280, 120, 16, c); ctx.restore();
      txt(ctx, ar, cx, 1070, 40, { family: F.ar, align: 'center', rtl: true });
    });
  }

  // ---------------------------------------------------------------- 5 (long). the 60-30-10 bar and a page that follows it
  function vRule(ctx, v) {
    const parts = [[0.6, GRAYS[1], '60%', 'NEUTRAL'], [0.3, SHADES[8], '30%', 'SECONDARY'], [0.1, BASE, '10%', 'BRAND']];
    let x = 80;
    parts.forEach(([f, c, pct, en], i) => {
      const s = spr(v, 2.6 + i * 0.6, { stiffness: 200, damping: 14 }), w = 920 * f, xx = x; x += w; if (s <= 0) return;
      rr(ctx, xx + 3, 330, (w - 6) * Math.min(1, s), 150, 12, c);
      txt(ctx, pct, xx + 6, 560, 56, { color: '#FFFFFF', alpha: Math.min(1, s) });
      txt(ctx, en, i < 2 ? xx + 6 : xx + w, 600, 20, { w: 600, family: F.mono, color: C.sub, align: i < 2 ? 'left' : 'right', alpha: Math.min(1, s) });
    });
    const pg = spr(v, 8, { stiffness: 200, damping: 16 }); if (pg <= 0) return;
    ctx.save(); ctx.globalAlpha = Math.min(1, pg); ctx.translate(0, (1 - Math.min(1, pg)) * 100);
    const px = 80, py = 660, pw = 920, ph = 480;
    rr(ctx, px, py, pw, ph, 16, GRAYS[0]);
    ctx.fillStyle = SHADES[8]; ctx.beginPath(); ctx.roundRect(px, py, pw, 70, [16, 16, 0, 0]); ctx.fill();
    rr(ctx, px + 30, py + 26, 120, 18, 6, '#FFFFFF');
    ctx.fillStyle = SHADES[8]; ctx.beginPath(); ctx.roundRect(px, py + 70, 190, ph - 70, [0, 0, 0, 16]); ctx.fill();
    [0, 1, 2, 3].forEach((k) => rr(ctx, px + 30, py + 110 + k * 54, 120, 14, 6, SHADES[3]));
    [[230, 110], [590, 110]].forEach(([cx, cy]) => { rr(ctx, px + cx, py + cy, 330, 190, 12, '#FFFFFF', GRAYS[2], 2); rr(ctx, px + cx + 24, py + cy + 30, 180, 16, 6, GRAYS[7]); rr(ctx, px + cx + 24, py + cy + 66, 240, 12, 6, GRAYS[4]); rr(ctx, px + cx + 24, py + cy + 90, 200, 12, 6, GRAYS[4]); });
    rr(ctx, px + 230, py + 350, 240, 66, 12, BASE); txt(ctx, 'New project', px + 350, py + 393, 26, { color: '#FFFFFF', align: 'center' });
    ctx.restore();
  }

  // ---------------------------------------------------------------- 6. test: contrast counts up, then a dark mode switch flips the card
  function vTest(ctx, v) {
    const op = spr(v, 2.6, { stiffness: 210, damping: 16 }); if (op <= 0) return;
    const dk = ez(v, 8.3, 9.3, E.inOutCubic);
    const bg = mix('#FFFFFF', '#16181D', dk), fg = mix('#1C1A19', '#EDEEF0', dk), sub = mix('#5E626A', '#A3A7AF', dk), btn = mix(BASE, SHADES[3], dk), btnTxt = mix('#FFFFFF', '#0E1424', dk), line = mix('#E3E4E7', '#2A2C31', dk);
    ctx.save(); ctx.globalAlpha = Math.min(1, op); ctx.translate(540, 560); ctx.scale(lerp(0.9, 1, Math.min(1, op)), lerp(0.9, 1, Math.min(1, op))); ctx.translate(-540, -560);
    rr(ctx, 80, 320, 920, 480, 24, bg, '#3A3A3A', 2);
    txt(ctx, 'Monthly plan', 140, 420, 52, { color: fg }); txt(ctx, 'Unlimited projects for your team.', 140, 480, 30, { color: sub });
    ctx.fillStyle = line; ctx.fillRect(140, 530, 800, 3);
    rr(ctx, 140, 600, 330, 110, 16, btn); txt(ctx, 'Start', 305, 668, 40, { color: btnTxt, align: 'center' });
    const r = ratio(btn, btnTxt), shown = v < 8.3 ? lerp(1, WHITE_ON_BASE, ez(v, 4, 5.6, E.outCubic)) : r;
    txt(ctx, `${shown.toFixed(1)}:1`, 560, 680, 80, { color: fg, alpha: ez(v, 4, 4.4) });
    ctx.restore();
    pill(ctx, 'AA ✓', 860, 655, spr(v, 5.6, { stiffness: 300, damping: 12 }), C.green, 30);
    // the dark mode switch
    const sw = spr(v, 7, { stiffness: 260, damping: 15 });
    if (sw > 0) {
      ctx.save(); ctx.translate(540, 950); ctx.scale(sw, sw);
      rr(ctx, -110, -48, 220, 96, 48, mix('#3A3A3A', C.sel, ez(v, 8, 8.4)));
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(lerp(-62, 62, spr(v, 8, { stiffness: 300, damping: 14 })), 0, 38, 0, TAU); ctx.fill();
      ctx.restore();
      txt(ctx, 'DARK MODE', 540, 1060, 26, { w: 600, family: F.mono, align: 'center', color: C.sub });
    }
  }

  // ---------------------------------------------------------------- 7 (long). four mistakes, each crossed out
  const MISTAKES = [['Too many brand colors', 'ألوان علامة كثيرة جدًا', 'many'], ['Pure, untinted grays', 'رمادي خالص بلا لمسة من لونك', 'pure'], ['Color alone for meaning', 'الاعتماد على اللون وحده لنقل المعنى', 'alone'], ['Brand color everywhere', 'لون العلامة في كل مكان', 'everywhere']];
  function vMistakes(ctx, v) {
    MISTAKES.forEach(([en, ar, kind], i) => {
      const s = spr(v, 2.6 + i * 2.2, { stiffness: 210, damping: 15 }); if (s <= 0) return;
      const y = 300 + i * 212, x = lerp(1100, 80, s);
      rr(ctx, x, y, 920, 190, 18, '#232323');
      const bx = x + 24, by = y + 22, bw = 200, bh = 146;
      rr(ctx, bx, by, bw, bh, 12, '#F2F2F2');
      if (kind === 'many') CHIPS.slice(0, 6).forEach((c, k) => rr(ctx, bx + 14 + (k % 3) * 60, by + 16 + Math.floor(k / 3) * 60, 52, 52, 8, c));
      if (kind === 'pure') { rr(ctx, bx + 16, by + 16, 168, 114, 8, PURE[1]); rr(ctx, bx + 30, by + 32, 90, 12, 4, PURE[6]); rr(ctx, bx + 30, by + 54, 120, 8, 4, PURE[4]); rr(ctx, bx + 30, by + 92, 70, 24, 6, BASE); }
      if (kind === 'alone') ['#2E9E5B', '#E5484D', '#2E9E5B'].forEach((c, k) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(bx + 40, by + 32 + k * 40, 12, 0, TAU); ctx.fill(); rr(ctx, bx + 66, by + 28 + k * 40, 100, 8, 4, PURE[4]); });
      if (kind === 'everywhere') { rr(ctx, bx + 12, by + 12, bw - 24, 32, 6, BASE); rr(ctx, bx + 12, by + 52, 80, 82, 6, BASE); rr(ctx, bx + 100, by + 52, 88, 36, 6, SHADES[3]); rr(ctx, bx + 100, by + 98, 88, 36, 6, BASE); }
      txt(ctx, `0${i + 1}`, x + 270, y + 80, 40, { family: F.mono, w: 600, color: C.sub });
      txt(ctx, en, x + 340, y + 80, 36, { color: '#FFFFFF' });
      txt(ctx, ar, x + 900, y + 145, 36, { family: F.ar, align: 'right', rtl: true });
      redX(ctx, bx + bw - 6, by + 6, spr(v, 3.4 + i * 2.2, { stiffness: 320, damping: 11 }));
    });
  }

  // ---------------------------------------------------------------- recap rows (slide in from alternating sides)
  function vRecap(ctx, v, withRule = false) {
    const rows = [['BRAND', [BASE]], ['SHADES', SHADES], ['GRAYS', GRAYS], ['STATUS', STATUS.map((s) => s[0])]];
    if (withRule) rows.push(['60–30–10', null]);
    const dy = withRule ? 170 : 205;
    rows.forEach(([lab, cols], r) => {
      const s = spr(v, 1.2 + r * 0.5, { stiffness: 200, damping: 15 }); if (s <= 0) return;
      const off = (1 - Math.min(1, s)) * (r % 2 ? 1100 : -1100), y = 320 + r * dy;
      ctx.save(); ctx.translate(off, 0);
      txt(ctx, lab, 80, y, 24, { w: 600, family: F.mono, color: C.sub });
      if (!cols) { [[0.6, GRAYS[1]], [0.3, SHADES[8]], [0.1, BASE]].reduce((x, [f, c]) => { rr(ctx, x + 2, y + 20, 920 * f - 4, 100, 10, c); return x + 920 * f; }, 80); }
      else { const n = cols.length, w = 920 / n; cols.forEach((c, i) => rr(ctx, 80 + i * w + 3, y + 20, w - 6, 100, 10, c)); }
      ctx.restore();
    });
  }

  return { BASE, SHADES, GRAYS, PURE, STATUS, ratio, WHITE_ON_BASE, chips, vPicker, vMoods, vShades, vGrays, vStatus, vRule, vTest, vMistakes, vRecap };
}
