// Fictional landing page for "Color & type basics" (logical 960 x 1300). Pure function of st.
// st.p = [accent, neutrals, fonts, scale, contrast], each 0 (the mistake) -> 1 (the fix).
// st.panel = 'palette' | 'fonts' | 'scale' | 'contrast'  (what the side card explains)
// st.bad / st.good / st.px: same annotations as shared/mockups.js.
export function makeStyleMockup(M, A) {
  const { lerp, clamp, E, font, rrect, mix, TAU } = M;
  const { C, F } = A;
  const BRAND = '#6D4AFF', TINT = '#EFEBFF', G1 = '#6B7280', G3 = '#E5E7EB', G4 = '#F3F4F6';
  const SERIF = '"DejaVu Serif", serif', MONO = '"JetBrains Mono", monospace';
  const BRIGHTS = ['#EF4444', '#22C55E', '#F97316', '#06B6D4', '#EC4899', '#7C3AED', '#FACC15'];
  const R = {
    headline: [44, 126, 580, 150], buttons: [44, 360, 470, 80], cards: [30, 596, 900, 300], body: [44, 980, 880, 230],
    panel: [636, 126, 300, 330], hero: [0, 90, 960, 420],
  };

  const T = (ctx, s, x, y, size, weight, family, color, align = 'left', alpha = 1) => {
    if (alpha <= 0.001) return;
    ctx.save(); ctx.globalAlpha *= alpha; ctx.font = `${Math.round(weight)} ${size}px ${family}`;
    ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(s, x, y); ctx.restore();
  };
  const box = (ctx, x, y, w, h, r, fill, stroke = null, lw = 1) => {
    rrect(ctx, x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); }
  };
  function wrap(ctx, str, size, weight, family, maxW) {
    ctx.font = `${Math.round(weight)} ${size}px ${family}`;
    const out = []; let cur = '';
    for (const w of str.split(' ')) { const t = cur ? cur + ' ' + w : w; if (cur && ctx.measureText(t).width > maxW) { out.push(cur); cur = w; } else cur = t; }
    if (cur) out.push(cur); return out;
  }
  // text drawn twice during a font change: old family fades out, new one fades in
  function dual(ctx, k, draw) { if (k < 1) draw(false, 1 - k); if (k > 0) draw(true, k); }
  function para(ctx, str, x, y, maxW, size, weight, family, color, lh, alpha = 1) {
    wrap(ctx, str, size, weight, family, maxW).forEach((l, i) => T(ctx, l, x, y + i * size * lh, size, weight, family, color, 'left', alpha));
  }

  function marks(ctx, st) {
    const px = st.px || 1;
    (st.bad || []).forEach(({ r: [x, y, w, h], p }) => {
      if (p <= 0) return;
      ctx.save(); ctx.globalAlpha = clamp(p * 1.5);
      ctx.fillStyle = 'rgba(217,45,32,0.06)'; rrect(ctx, x, y, w, h, 12 * px); ctx.fill();
      ctx.setLineDash([10 * px, 7 * px]); ctx.lineWidth = 3.5 * px; ctx.strokeStyle = C.red; rrect(ctx, x, y, w, h, 12 * px); ctx.stroke(); ctx.setLineDash([]);
      const s = 34 * px * E.outBack(clamp(p)), cx = x + w, cy = y, k = s * 0.2;
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(cx, cy, s / 2, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.white; ctx.lineWidth = 4 * px; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(cx - k, cy - k); ctx.lineTo(cx + k, cy + k); ctx.moveTo(cx + k, cy - k); ctx.lineTo(cx - k, cy + k); ctx.stroke();
      ctx.restore();
    });
    (st.good || []).forEach(({ r: [x, y, w, h], p }) => {
      if (p <= 0) return;
      ctx.save(); ctx.globalAlpha = clamp(p * 1.5);
      ctx.lineWidth = 3.5 * px; ctx.strokeStyle = C.green; rrect(ctx, x, y, w, h, 12 * px); ctx.stroke();
      const s = 38 * px * E.outBack(clamp(p)), cx = x + w, cy = y, k = s * 0.22;
      ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(cx, cy, s / 2, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.white; ctx.lineWidth = 4.5 * px; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(cx - k, cy); ctx.lineTo(cx - k * 0.25, cy + k * 0.75); ctx.lineTo(cx + k, cy - k * 0.7); ctx.stroke();
      ctx.restore();
    });
  }

  // side card that explains the current basic
  function panel(ctx, st) {
    const [k1, k2, k3, k4, k5] = st.p.map((v) => clamp(v));
    const [x, y, w, h] = R.panel;
    box(ctx, x, y, w, h, 22, C.white, G3, 1.5);
    const kind = st.panel || 'palette';
    if (kind === 'palette') {
      T(ctx, 'Palette', x + 24, y + 44, 18, 800, F.latin, C.ink);
      const before = BRIGHTS, after = [BRAND, C.ink, G1, G3, '#F9FAFB'];
      const kb = Math.max(k1, k2);
      dual(ctx, kb, (isNew, a) => (isNew ? after : before).forEach((c, i) => {
        ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = c; ctx.strokeStyle = G3; ctx.lineWidth = 1.5;
        const cx = x + 44 + (i % 4) * 66, cy = y + 104 + Math.floor(i / 4) * 70;
        ctx.beginPath(); ctx.arc(cx, cy, 24, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
      }));
      T(ctx, kb > 0.5 ? '1 accent + neutrals' : '7 bright colors', x + 24, y + h - 34, 17, 700, F.latin, kb > 0.5 ? C.green : C.red);
    } else if (kind === 'fonts') {
      T(ctx, 'Fonts', x + 24, y + 44, 18, 800, F.latin, C.ink);
      dual(ctx, k3, (isNew, a) => {
        if (!isNew) [['Aa Serif', SERIF], ['Aa Mono', MONO], ['Aa Sans', F.latin]].forEach(([t, f], i) => T(ctx, t, x + 24, y + 110 + i * 62, 36, 700, f, C.ink, 'left', a));
        else { T(ctx, 'Aa', x + 24, y + 150, 92, 800, F.latin, C.ink, 'left', a); T(ctx, 'One family', x + 24, y + 200, 22, 600, F.latin, G1, 'left', a); }
      });
      T(ctx, k3 > 0.5 ? '1 font, 2 weights' : '3 fonts', x + 24, y + h - 34, 17, 700, F.latin, k3 > 0.5 ? C.green : C.red);
    } else if (kind === 'scale') {
      T(ctx, 'Type scale', x + 24, y + 44, 18, 800, F.latin, C.ink);
      const before = [34, 24, 18, 15, 26], after = [48, 24, 16];
      dual(ctx, k4, (isNew, a) => (isNew ? after : before).forEach((s, i) => {
        T(ctx, String(s), x + 24, y + 96 + i * 44, 22, 800, F.latin, C.ink, 'left', a);
        ctx.save(); ctx.globalAlpha *= a; box(ctx, x + 70, y + 80 + i * 44, s * 4.2, 18, 9, isNew ? BRAND : '#F59E0B'); ctx.restore();
      }));
      T(ctx, k4 > 0.5 ? '3 sizes, clear steps' : '5 random sizes', x + 24, y + h - 34, 17, 700, F.latin, k4 > 0.5 ? C.green : C.red);
    } else {
      T(ctx, 'Contrast', x + 24, y + 44, 18, 800, F.latin, C.ink);
      dual(ctx, k5, (isNew, a) => {
        box(ctx, x + 24, y + 70, w - 48, 120, 14, C.white, G3, 1.5);
        T(ctx, 'Text', x + 48, y + 146, 48, 800, F.latin, isNew ? '#374151' : '#C3C8D0', 'left', a);
        T(ctx, isNew ? '10.3:1' : '1.7:1', x + 24, y + 250, 44, 800, F.latin, isNew ? C.green : C.red, 'left', a);
      });
      T(ctx, k5 > 0.5 ? 'Passes WCAG AA' : 'Fails WCAG AA', x + 24, y + h - 34, 17, 700, F.latin, k5 > 0.5 ? C.green : C.red);
    }
  }

  function draw(ctx, st) {
    const p = st.p || [0, 0, 0, 0, 0];
    const [k1, k2, k3, k4, k5] = p.map((v) => clamp(v));
    const e4 = E.inOutCubic(k4);
    // backgrounds: colored sections -> white and light gray
    ctx.fillStyle = C.white; ctx.fillRect(0, 0, 960, 1300);
    ctx.fillStyle = mix('#FFF4D6', C.white, k2); ctx.fillRect(0, 87, 960, 470);
    ctx.fillStyle = mix('#E0F7FA', '#F9FAFB', k2); ctx.fillRect(0, 557, 960, 380);
    // nav
    ctx.fillStyle = mix('#EF4444', BRAND, k1); ctx.beginPath(); ctx.arc(52, 44, 14, 0, TAU); ctx.fill();
    T(ctx, 'Product', 76, 52, 22, 800, F.latin, C.ink);
    ['Features', 'Pricing', 'About', 'Blog'].forEach((l, i) => T(ctx, l, 420 + i * 100, 50, 16, 600, F.latin, mix(['#14B8A6', '#F97316', '#EC4899', '#7C3AED'][i], G1, k1)));
    ctx.fillStyle = G3; ctx.fillRect(0, 86, 960, 1);
    // headline: serif, small, purple -> sans, large, ink
    const hs = lerp(34, 50, e4), hc = mix('#7C3AED', C.ink, k1);
    dual(ctx, k3, (isNew, a) => wrap(ctx, 'Plan projects and track tasks in one place.', hs, isNew ? 800 : 700, isNew ? F.latin : SERIF, 560)
      .forEach((l, i) => T(ctx, l, 60, 186 + i * hs * 1.15, hs, isNew ? 800 : 700, isNew ? F.latin : SERIF, hc, 'left', a)));
    // subtext: too big, too pale -> smaller, readable
    para(ctx, 'Tasks, deadlines and your team, on one simple board.', 60, 318, 540, lerp(24, 19, e4), 500, F.latin, mix('#C3C8D0', G1, k5), 1.4);
    // buttons: red + green -> accent primary + outline secondary
    const by = 380;
    box(ctx, 60, by, 190, 56, 12, mix('#EF4444', BRAND, k1));
    dual(ctx, k3, (isNew, a) => T(ctx, 'Get started', 155, by + 35, 17, 700, isNew ? F.latin : MONO, C.white, 'center', a));
    box(ctx, 266, by, 190, 56, 12, mix('#22C55E', C.white, k1), mix('#22C55E', BRAND, k1), 2);
    dual(ctx, k3, (isNew, a) => T(ctx, 'Learn more', 361, by + 35, 17, 700, isNew ? F.latin : MONO, mix(C.white, BRAND, k1), 'center', a));
    panel(ctx, st);
    // feature cards: pastel + rainbow icons + mono titles smaller than body -> neutral, one accent, clear hierarchy
    T(ctx, 'FEATURES', 60, 600, 14, 800, F.latin, mix('#F97316', BRAND, k1));
    [['Boards', 'Organize every project on its own board.'], ['Deadlines', 'See what is due today and this week.'], ['Team', 'Assign tasks and follow progress together.']].forEach(([t, b], i) => {
      const x = 48 + i * 296, y = 620;
      box(ctx, x, y, 272, 260, 18, mix(['#FDE2E4', '#FFF1C1', '#D7F5E9'][i], C.white, k2), G3, 1.5);
      box(ctx, x + 24, y + 24, 48, 48, 12, mix(['#F97316', '#06B6D4', '#EC4899'][i], TINT, k1));
      ctx.fillStyle = mix(C.white, BRAND, k1); ctx.beginPath(); ctx.arc(x + 48, y + 48, 10, 0, TAU); ctx.fill();
      const ts = lerp(15, 22, e4);
      dual(ctx, k3, (isNew, a) => T(ctx, t, x + 24, y + 116, ts, 800, isNew ? F.latin : MONO, C.ink, 'left', a));
      para(ctx, b, x + 24, y + 150, 224, lerp(18, 15.5, e4), 500, F.latin, mix('#C9CED6', G1, k5), 1.45);
    });
    // body text: pale -> readable
    dual(ctx, k3, (isNew, a) => T(ctx, 'How it works', 60, 1020, lerp(26, 30, e4), 800, isNew ? F.latin : SERIF, C.ink, 'left', a));
    para(ctx, 'Product brings your projects, tasks and deadlines together. Create a board for each project, add tasks, assign them to your team and see what is due this week.',
      60, 1066, 600, 17, 500, F.latin, mix('#CBD0D8', '#374151', k5), 1.6);
    marks(ctx, st);
  }

  return { w: 960, h: 1300, R, draw, bg: C.white };
}
