// Fictional, generic interfaces drawn in code for the "UI/UX basics" videos (never a real product).
//
//   const MK = makeMockups(M, A);
//   MK.web.draw(ctx, st)   // landing page, logical 960 x 1300
//   MK.app.draw(ctx, st)   // phone app, logical 390 x 844 (+ bezel)
//
// st (all 0..1 unless noted) — 0 = "before" (the mistake), 1 = "after" (the fix):
//   p: [p1..p5]   one value per basic, in the order of the video
//   bad: [{r:[x,y,w,h], p}]  red outline + cross, good: [{r, p}] green check   (logical coords)
//   px: 1 / current camera scale, so strokes stay the same thickness on screen
//   web: caret (bool), gaps (0..1 show spacing labels), scan (0..1 scan path)
//   app: thumb (0..1 thumb-zone overlay), targets (0..1 tap-target boxes), press, loading, toast,
//        noFb (0..1 "nothing happened" label), form (0..1 form screen slides in), spin (radians)
// Pure functions of st: no state, no randomness.

export function makeMockups(M, A) {
  const { lerp, clamp, E, font, rrect, mix, TAU } = M;
  const { C, F } = A;
  const BRAND = '#6D4AFF', BRAND_D = '#5536E0', TINT = '#EFEBFF';
  const G1 = '#6B7280', G2 = '#9CA3AF', G3 = '#E5E7EB', G4 = '#F3F4F6';

  const txt = (ctx, s, x, y, size, weight, color, align = 'left', alpha = 1) => {
    if (alpha <= 0) return;
    ctx.save(); ctx.globalAlpha *= alpha;
    ctx.font = font(size, weight, F.latin); ctx.fillStyle = color; ctx.textAlign = align;
    ctx.fillText(s, x, y); ctx.restore();
  };
  const box = (ctx, x, y, w, h, r, fill, stroke = null, lw = 1) => {
    rrect(ctx, x, y, w, h, r);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); }
  };
  function wrapText(ctx, str, size, weight, maxW) {
    ctx.font = font(size, weight, F.latin);
    const out = []; let cur = '';
    for (const w of str.split(' ')) {
      const t = cur ? cur + ' ' + w : w;
      if (cur && ctx.measureText(t).width > maxW) { out.push(cur); cur = w; } else cur = t;
    }
    if (cur) out.push(cur);
    return out;
  }
  function para(ctx, str, x, y, maxW, size, weight, color, lh, alpha = 1) {
    const lines = wrapText(ctx, str, size, weight, maxW);
    lines.forEach((l, i) => txt(ctx, l, x, y + i * size * lh, size, weight, color, 'left', alpha));
    return y + (lines.length - 1) * size * lh;
  }

  // ---------------------------------------------------------------- annotations
  function marks(ctx, st) {
    const px = st.px || 1;
    (st.bad || []).forEach(({ r: [x, y, w, h], p }) => {
      if (p <= 0) return;
      ctx.save();
      ctx.globalAlpha = clamp(p * 1.5);
      ctx.fillStyle = 'rgba(217,45,32,0.06)'; rrect(ctx, x, y, w, h, 12 * px); ctx.fill();
      ctx.setLineDash([10 * px, 7 * px]); ctx.lineWidth = 3.5 * px; ctx.strokeStyle = C.red;
      rrect(ctx, x, y, w, h, 12 * px); ctx.stroke(); ctx.setLineDash([]);
      const s = 34 * px * E.outBack(clamp(p)), cx = x + w, cy = y;
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(cx, cy, s / 2, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.white; ctx.lineWidth = 4 * px; ctx.lineCap = 'round';
      const k = s * 0.2;
      ctx.beginPath(); ctx.moveTo(cx - k, cy - k); ctx.lineTo(cx + k, cy + k); ctx.moveTo(cx + k, cy - k); ctx.lineTo(cx - k, cy + k); ctx.stroke();
      ctx.restore();
    });
    (st.good || []).forEach(({ r: [x, y, w, h], p }) => {
      if (p <= 0) return;
      ctx.save();
      ctx.globalAlpha = clamp(p * 1.5);
      ctx.lineWidth = 3.5 * px; ctx.strokeStyle = C.green;
      rrect(ctx, x, y, w, h, 12 * px); ctx.stroke();
      const s = 38 * px * E.outBack(clamp(p)), cx = x + w, cy = y;
      ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(cx, cy, s / 2, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.white; ctx.lineWidth = 4.5 * px; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const k = s * 0.22;
      ctx.beginPath(); ctx.moveTo(cx - k, cy); ctx.lineTo(cx - k * 0.25, cy + k * 0.75); ctx.lineTo(cx + k, cy - k * 0.7); ctx.stroke();
      ctx.restore();
    });
  }

  // ================================================================ WEBSITE (960 x 1300)
  const WEB = {
    w: 960, h: 1300,
    oldHead: 'Welcome to the future of innovation.', newHead: 'Plan projects and track tasks in one place.',
    oldSub: 'We help you do more with less, faster than ever before.', newSub: 'Tasks, deadlines and your team, on one simple board.',
    cards: [['Boards', 'Organize every project on its own board.'], ['Deadlines', 'See what is due today and this week.'], ['Team', 'Assign tasks and follow progress together.']],
    before: [[40, 630, 270, 250], [326, 652, 250, 236], [600, 618, 310, 262]],
    after: [[48, 620, 272, 260], [344, 620, 272, 260], [640, 620, 272, 260]],
    body: 'Product brings your projects, tasks and deadlines together. Create a board for each project, add tasks, assign them to your team and see what is due this week. Everything updates in real time, so everyone knows what to do next.',
  };
  // regions (logical) used by the films for marks and camera
  WEB.R = {
    headline: [48, 132, 560, 200], buttons: [48, 372, 560, 74], cards: [30, 600, 900, 300],
    gaps: [30, 600, 900, 300], body: [48, 980, 880, 220], hero: [0, 90, 960, 420], page: [0, 0, 960, 1300],
  };

  function webDraw(ctx, st) {
    const p = st.p || [0, 0, 0, 0, 0], px = st.px || 1;
    const [k1, k2, k3, k4, k5] = p.map((v) => clamp(v));
    ctx.fillStyle = C.white; ctx.fillRect(0, 0, WEB.w, WEB.h);
    // nav
    ctx.fillStyle = BRAND; ctx.beginPath(); ctx.arc(52, 44, 14, 0, TAU); ctx.fill();
    txt(ctx, 'Product', 76, 52, 22, 800, C.ink);
    ['Features', 'Pricing', 'About', 'Blog'].forEach((l, i) => txt(ctx, l, 420 + i * 100, 50, 16, 500, G1));
    txt(ctx, 'Sign in', 912, 50, 16, 700, C.ink, 'right');
    ctx.fillStyle = G3; ctx.fillRect(0, 86, WEB.w, 1);
    // hero illustration (abstract shapes, no product)
    box(ctx, 650, 140, 270, 300, 24, TINT);
    box(ctx, 680, 172, 210, 40, 10, C.white); box(ctx, 680, 226, 150, 40, 10, C.white); box(ctx, 680, 280, 180, 40, 10, C.white);
    ctx.fillStyle = BRAND; [192, 246, 300].forEach((y) => { ctx.beginPath(); ctx.arc(702, y, 8, 0, TAU); ctx.fill(); });
    box(ctx, 680, 350, 120, 56, 14, BRAND);
    // headline (typed: the old one is deleted, the new one typed)
    let head, caretOn = false;
    if (k1 <= 0) head = WEB.oldHead;
    else if (k1 >= 1) head = WEB.newHead;
    else if (k1 < 0.35) { head = WEB.oldHead.slice(0, Math.round(WEB.oldHead.length * (1 - k1 / 0.35))); caretOn = true; }
    else { head = WEB.newHead.slice(0, Math.round(WEB.newHead.length * ((k1 - 0.35) / 0.65))); caretOn = true; }
    const hl = wrapText(ctx, head || ' ', 46, 800, 560);
    hl.forEach((l, i) => txt(ctx, l, 60, 186 + i * 54, 46, 800, C.ink));
    if (caretOn && st.caret !== false) {
      ctx.font = font(46, 800, F.latin);
      const last = hl[hl.length - 1] || '', cx = 60 + ctx.measureText(last).width + 4, cy = 186 + (hl.length - 1) * 54;
      ctx.fillStyle = BRAND; ctx.fillRect(cx, cy - 38, 4, 46);
    }
    const subA = clamp((k1 - 0.85) / 0.15);
    para(ctx, WEB.oldSub, 60, 336, 540, 19, 500, G1, 1.45, 1 - subA);
    para(ctx, WEB.newSub, 60, 336, 540, 19, 500, G1, 1.45, subA);
    // buttons: three equal -> one primary + one link
    const by = 390;
    const b1w = lerp(170, 196, k2), b1h = lerp(54, 58, k2);
    box(ctx, 60, by - (b1h - 54) / 2, b1w, b1h, 12, BRAND);
    txt(ctx, 'Get started', 60 + b1w / 2, by + 34, lerp(17, 18, k2), 700, C.white, 'center');
    const b2x = 60 + b1w + lerp(16, 26, k2);
    ctx.save(); ctx.globalAlpha = 1 - k2; box(ctx, b2x, by, 170, 54, 12, BRAND); ctx.restore();
    txt(ctx, k2 > 0.5 ? 'Learn more →' : 'Learn more', b2x + lerp(85, 0, k2), by + 34, 17, 700, mix(C.white, BRAND, k2), k2 > 0.5 ? 'left' : 'center');
    ctx.save(); ctx.globalAlpha = 1 - k2;
    box(ctx, 60 + 170 * 2 + 32, by, 170, 54, 12, BRAND); txt(ctx, 'Contact us', 60 + 170 * 2 + 32 + 85, by + 34, 17, 700, C.white, 'center');
    ctx.restore();
    // feature cards: hierarchy (k3) + spacing (k4)
    txt(ctx, 'FEATURES', 60, 590, 14, 800, BRAND);
    const rects = WEB.before.map((b, i) => b.map((v, j) => lerp(v, WEB.after[i][j], E.inOutCubic(k4))));
    rects.forEach(([x, y, w, h], i) => {
      box(ctx, x, y, w, h, 18, G4, G3, 1.5);
      box(ctx, x + 24, y + 24, 48, 48, 12, mix(G3, TINT, k3));
      ctx.fillStyle = mix(G2, BRAND, k3); ctx.beginPath(); ctx.arc(x + 48, y + 48, 10, 0, TAU); ctx.fill();
      txt(ctx, WEB.cards[i][0], x + 24, y + 116, lerp(17, 23, k3), lerp(400, 800, k3), mix(G2, C.ink, k3));
      para(ctx, WEB.cards[i][1], x + 24, y + 152, w - 48, lerp(17, 15.5, k3), 500, mix(G2, G1, k3), 1.45);
    });
    if (st.gaps > 0) {
      ctx.save(); ctx.globalAlpha = clamp(st.gaps);
      for (let i = 0; i < 2; i++) {
        const a = rects[i][0] + rects[i][2], b = rects[i + 1][0], g = Math.round(b - a);
        const col = Math.abs(g - 24) < 1 ? C.blue : C.red, my = Math.max(rects[i][1], rects[i + 1][1]) + 130;
        ctx.fillStyle = col; ctx.fillRect(a, my - 2 * px, b - a, 4 * px);
        txt(ctx, String(g), (a + b) / 2, my - 14 * px, 18 * px, 800, col, 'center');
      }
      ctx.restore();
    }
    // body text: long pale lines -> shorter, darker, more line height
    txt(ctx, 'How it works', 60, 1020, 30, 800, C.ink);
    para(ctx, WEB.body, 60, 1066, lerp(860, 520, E.inOutCubic(k5)), lerp(15, 18, k5), 500, mix('#BAC0CA', '#374151', k5), lerp(1.3, 1.65, k5));
    // scan path (hook): eyes jump across the page in a zig-zag, they don't read
    if (st.scan > 0) {
      const pts = [[70, 190], [560, 190], [70, 250], [380, 250], [70, 410], [240, 410], [80, 700], [880, 700], [80, 1040], [420, 1040]];
      const n = (pts.length - 1) * clamp(st.scan);
      ctx.save(); ctx.strokeStyle = C.blue; ctx.lineWidth = 5 * px; ctx.setLineDash([2 * px, 12 * px]); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(...pts[0]);
      for (let i = 1; i <= Math.ceil(n); i++) {
        const f = Math.min(1, n - (i - 1)), [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        ctx.lineTo(lerp(x0, x1, f), lerp(y0, y1, f));
      }
      ctx.stroke(); ctx.setLineDash([]);
      const i = Math.min(pts.length - 1, Math.floor(n)), f = n - Math.floor(n), j = Math.min(pts.length - 1, i + 1);
      const ex = lerp(pts[i][0], pts[j][0], f), ey = lerp(pts[i][1], pts[j][1], f);
      ctx.fillStyle = C.blue; ctx.beginPath(); ctx.arc(ex, ey, 12 * px, 0, TAU); ctx.fill();
      ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(ex, ey, 5 * px, 0, TAU); ctx.fill();
      ctx.restore();
    }
    marks(ctx, st);
  }

  // ================================================================ APP (390 x 844, bezel around)
  const APP = { w: 390, h: 844, bezel: 14 };
  APP.R = {
    addTop: [292, 66, 82, 40], addBottom: [18, 678, 354, 64], rows: [12, 126, 366, 220], checkbox: [22, 136, 48, 48],
    tabs: [0, 762, 390, 82], button: [18, 678, 354, 64], form: [0, 60, 390, 784], phone: [-14, -14, 418, 872], top: [0, 0, 390, 300],
  };
  const TASKS = [['Design review', '10:00'], ['Write release notes', 'Today'], ['Team sync', '14:30'], ['Update roadmap', 'Tomorrow'], ['Reply to feedback', 'Friday']];
  const TABS7 = ['Home', 'Tasks', 'Inbox', 'Calendar', 'Stats', 'Team', 'Settings'];
  const TABS4 = ['Today', 'Projects', 'Inbox', 'Profile'];
  const FIELDS = ['Title', 'Description', 'Project', 'Due date', 'Priority', 'Assignee', 'Tags'];

  function tabIcon(ctx, kind, x, y, s, color) {
    ctx.fillStyle = color; ctx.strokeStyle = color; ctx.lineWidth = s * 0.14;
    const k = kind % 4;
    if (k === 0) { rrect(ctx, x - s / 2, y - s / 2, s, s, s * 0.25); ctx.fill(); }
    else if (k === 1) { ctx.beginPath(); ctx.arc(x, y, s / 2, 0, TAU); ctx.stroke(); }
    else if (k === 2) { ctx.beginPath(); ctx.moveTo(x, y - s / 2); ctx.lineTo(x + s / 2, y + s / 2); ctx.lineTo(x - s / 2, y + s / 2); ctx.closePath(); ctx.stroke(); }
    else { rrect(ctx, x - s / 2, y - s / 3, s, s * 0.66, s * 0.12); ctx.stroke(); }
  }

  function listScreen(ctx, st) {
    const p = st.p || [0, 0, 0, 0, 0], px = st.px || 1;
    const [k1, k2, k3] = p.map((v) => clamp(v));
    txt(ctx, 'Today', 20, 104, 32, 800, C.ink);
    txt(ctx, 'Tuesday · 5 tasks', 20, 126, 14, 500, G1);
    // rows
    TASKS.forEach(([t, m], i) => {
      const y = 146 + i * 74;
      box(ctx, 12, y, 366, 64, 16, C.white, G3, 1);
      const r = lerp(8, 12, k2);
      ctx.lineWidth = 2.2; ctx.strokeStyle = i === 0 ? BRAND : G2; ctx.beginPath(); ctx.arc(42, y + 32, r, 0, TAU); ctx.stroke();
      txt(ctx, t, 66, y + 30, 16, 700, C.ink); txt(ctx, m, 66, y + 49, 13, 500, G1);
      ctx.fillStyle = G2; [0, 1, 2].forEach((j) => { ctx.beginPath(); ctx.arc(350 + j * 7 - 7, y + 32, 2.2, 0, TAU); ctx.fill(); });
      if (st.targets > 0) {
        const s = lerp(22, 44, E.inOutCubic(k2)), col = k2 > 0.5 ? C.green : C.red;
        ctx.save(); ctx.globalAlpha = clamp(st.targets); ctx.setLineDash([5 * px, 4 * px]); ctx.lineWidth = 2.5 * px; ctx.strokeStyle = col;
        ctx.strokeRect(42 - s / 2, y + 32 - s / 2, s, s); ctx.strokeRect(343 - s / 2, y + 32 - s / 2, s, s); ctx.restore();
        if (i === 0) txt(ctx, k2 > 0.5 ? '44 pt' : '22 pt', 42, y - 6, 13 * Math.max(1, px * 0.9), 800, col, 'center', clamp(st.targets));
      }
    });
    // add button: small at the top -> large at the bottom (thumb zone)
    const e = E.inOutCubic(k1);
    const bx = lerp(298, 18, e), byy = lerp(72, 680, e), bw = lerp(76, 354, e), bh = lerp(32, 56, e);
    const press = clamp(st.press || 0), sc = 1 - 0.04 * press;
    ctx.save(); ctx.translate(bx + bw / 2, byy + bh / 2); ctx.scale(sc, sc); ctx.translate(-(bx + bw / 2), -(byy + bh / 2));
    box(ctx, bx, byy, bw, bh, bh / 2, mix(BRAND, BRAND_D, press));
    const ld = clamp(st.loading || 0);
    if (ld > 0 && ld < 1) {
      ctx.strokeStyle = C.white; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(bx + bw / 2, byy + bh / 2, 11, st.spin || 0, (st.spin || 0) + 4.4); ctx.stroke();
    } else txt(ctx, e > 0.5 ? 'Add task' : '+ Add', bx + bw / 2, byy + bh / 2 + lerp(5, 6.5, e), lerp(13, 18, e), 700, C.white, 'center');
    ctx.restore();
    if (st.noFb > 0) txt(ctx, 'Did it work?', 195, 664, 15, 800, C.red, 'center', clamp(st.noFb));
    if (st.toast > 0) {
      const t = clamp(st.toast), ty = lerp(630, 610, E.outBack(t));
      ctx.save(); ctx.globalAlpha = t;
      box(ctx, 95, ty - 22, 200, 44, 22, C.ink);
      ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(120, ty, 10, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.white; ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(115, ty); ctx.lineTo(119, ty + 4); ctx.lineTo(126, ty - 4); ctx.stroke();
      txt(ctx, 'Task added', 140, ty + 5, 15, 700, C.white);
      ctx.restore();
    }
    // tab bar: 7 cramped tabs -> 4 clear tabs
    ctx.fillStyle = C.white; ctx.fillRect(0, 762, APP.w, 82); ctx.fillStyle = G3; ctx.fillRect(0, 762, APP.w, 1);
    const a7 = 1 - clamp(k3 * 1.6), a4 = clamp(k3 * 1.6 - 0.6);
    ctx.save(); ctx.globalAlpha = a7;
    TABS7.forEach((l, i) => { const x = 28 + i * 55.5; tabIcon(ctx, i, x, 786, 15, i === 1 ? BRAND : G2); txt(ctx, l, x, 812, 9, 600, i === 1 ? BRAND : G2, 'center'); });
    ctx.restore();
    ctx.save(); ctx.globalAlpha = a4;
    TABS4.forEach((l, i) => { const x = 49 + i * 97; tabIcon(ctx, i, x, 788, 22, i === 0 ? BRAND : G2); txt(ctx, l, x, 820, 12, 700, i === 0 ? BRAND : G2, 'center'); });
    ctx.restore();
  }

  function formScreen(ctx, st) {
    const k5 = clamp((st.p || [])[4] || 0);
    ctx.fillStyle = '#F7F8FA'; ctx.fillRect(0, 44, APP.w, APP.h - 44);
    txt(ctx, '‹', 20, 104, 34, 600, C.ink); txt(ctx, 'New task', 48, 102, 24, 800, C.ink);
    // long form
    ctx.save(); ctx.globalAlpha = 1 - clamp(k5 * 1.8); ctx.translate(-lerp(0, 120, E.inCubic(clamp(k5 * 1.5))), 0);
    FIELDS.forEach((f, i) => { const y = 132 + i * 80; txt(ctx, f, 20, y, 13, 700, G1); box(ctx, 20, y + 10, 350, 46, 10, C.white, G3, 1.2); });
    box(ctx, 20, 700, 350, 52, 26, BRAND); txt(ctx, 'Save', 195, 732, 17, 700, C.white, 'center');
    ctx.restore();
    // step 1 of 3
    const a = clamp(k5 * 1.8 - 0.8);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(lerp(120, 0, E.outCubic(a)), 0);
    txt(ctx, 'Step 1 of 3', 20, 150, 14, 700, G1);
    [0, 1, 2].forEach((i) => box(ctx, 20 + i * 120, 164, 110, 6, 3, i === 0 ? BRAND : G3));
    txt(ctx, 'What’s the task?', 20, 236, 28, 800, C.ink);
    box(ctx, 20, 262, 350, 60, 14, C.white, BRAND, 2); txt(ctx, 'e.g. Design review', 40, 299, 17, 500, G2);
    box(ctx, 18, 680, 354, 56, 28, BRAND); txt(ctx, 'Next', 195, 714, 18, 700, C.white, 'center');
    ctx.restore();
  }

  function appDraw(ctx, st) {
    const b = APP.bezel;
    ctx.save();
    box(ctx, -b, -b, APP.w + 2 * b, APP.h + 2 * b, 62, C.ink);
    rrect(ctx, 0, 0, APP.w, APP.h, 50); ctx.clip();
    ctx.fillStyle = '#F7F8FA'; ctx.fillRect(0, 0, APP.w, APP.h);
    // status bar + island
    txt(ctx, '9:41', 44, 32, 15, 700, C.ink, 'center');
    box(ctx, 140, 12, 110, 30, 15, C.ink);
    box(ctx, 334, 20, 26, 12, 3, null, C.ink, 1.5); ctx.fillStyle = C.ink; ctx.fillRect(337, 23, 18, 6);
    const f = clamp(st.form || 0);
    if (f < 1) { ctx.save(); ctx.translate(-APP.w * 0.3 * E.inOutCubic(f), 0); listScreen(ctx, st); ctx.restore(); }
    if (f > 0) { ctx.save(); ctx.translate(APP.w * (1 - E.inOutCubic(f)), 0); formScreen(ctx, st); ctx.restore(); }
    // thumb zone overlay
    if (st.thumb > 0) {
      ctx.save(); ctx.globalAlpha = clamp(st.thumb);
      ctx.fillStyle = 'rgba(217,45,32,0.10)'; ctx.fillRect(0, 0, APP.w, APP.h);
      ctx.fillStyle = 'rgba(18,128,92,0.22)'; ctx.beginPath(); ctx.arc(330, 930, 470, 0, TAU); ctx.fill();
      txt(ctx, 'Hard to reach', 195, 220, 18, 800, C.red, 'center');
      txt(ctx, 'Easy to reach', 195, 600, 18, 800, C.green, 'center');
      ctx.restore();
    }
    // a thumb reaching up from the bottom of the screen, falling short of the top
    if (st.reach > 0) {
      const r = clamp(st.reach), y = lerp(860, 330, E.outCubic(r));
      ctx.save(); ctx.globalAlpha = 0.9;
      ctx.fillStyle = 'rgba(14,23,38,0.18)'; ctx.beginPath(); ctx.ellipse(318, y + 90, 52, 120, -0.25, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(14,23,38,0.28)'; ctx.beginPath(); ctx.ellipse(304, y, 34, 44, -0.25, 0, TAU); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
    marks(ctx, st);
  }

  return {
    web: { w: WEB.w, h: WEB.h, R: WEB.R, draw: webDraw, bg: C.white },
    app: { w: APP.w + 2 * APP.bezel, h: APP.h + 2 * APP.bezel, ox: -APP.bezel, oy: -APP.bezel, R: APP.R, draw: appDraw, bg: '#E9ECF2' },
  };
}
