// "UI terms" + "UX terms" (2 Shorts) and "UI & UX terms" (long). Fictional interfaces only, drawn in our style.
// Short coordinates: x 80..1000, y 280..1150. Facts checked online on 25 Nov 2026 (sources in docs/Textes-publication.txt):
// component names and synonyms (modal = dialog, toast = snackbar, drawer = slide-over; tooltip on hover vs popover on click),
// NN/g user flow vs user journey, wireframe / mockup / prototype, affordance vs signifier, Laws of UX (Fitts, Hick, Jakob).
export function makeTerms(M, K) {
  const { lerp, clamp, E, mix } = M;
  const { F, C, TAU, ez, spr, txt, rr, cursor } = K;
  const T = (ctx, s, x, y, size, w, color, align = 'left', family = F.title) => txt(ctx, s, x, y, size, { w, color, align, family });
  const INK = '#18181B', SUB = '#71717A', BOR = '#E4E4E7', SURF = '#F4F4F5', ACC = '#2563EB', RED = '#DC2626', GRN = '#15803D';
  const DBG = '#26272C', DLINE = '#3A3B42', DTXT = '#EEEEF0', DDIM = '#A3A3AC';

  // ---------------------------------------------------------------- tiny icons
  function icon(ctx, k, x, y, s = 1, col = SUB) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    if (k === 'search') { ctx.arc(-2, -2, 7, 0, TAU); ctx.moveTo(3, 3); ctx.lineTo(9, 9); }
    else if (k === 'bell') { ctx.moveTo(-8, 5); ctx.quadraticCurveTo(-6, 2, -6, -3); ctx.arc(0, -3, 6, Math.PI, 0); ctx.quadraticCurveTo(6, 2, 8, 5); ctx.closePath(); ctx.moveTo(-2, 8); ctx.lineTo(2, 8); }
    else if (k === 'home') { ctx.moveTo(-8, -1); ctx.lineTo(0, -8); ctx.lineTo(8, -1); ctx.moveTo(-6, -3); ctx.lineTo(-6, 8); ctx.lineTo(6, 8); ctx.lineTo(6, -3); }
    else if (k === 'folder') { ctx.moveTo(-8, -6); ctx.lineTo(-2, -6); ctx.lineTo(0, -3); ctx.lineTo(8, -3); ctx.lineTo(8, 7); ctx.lineTo(-8, 7); ctx.closePath(); }
    else if (k === 'cal') { ctx.rect(-8, -6, 16, 14); ctx.moveTo(-8, -1); ctx.lineTo(8, -1); ctx.moveTo(-4, -9); ctx.lineTo(-4, -4); ctx.moveTo(4, -9); ctx.lineTo(4, -4); }
    else if (k === 'chat') { ctx.moveTo(-8, -6); ctx.lineTo(8, -6); ctx.lineTo(8, 4); ctx.lineTo(-2, 4); ctx.lineTo(-6, 8); ctx.lineTo(-6, 4); ctx.lineTo(-8, 4); ctx.closePath(); }
    else if (k === 'gear') { ctx.arc(0, 0, 3.5, 0, TAU); for (let i = 0; i < 8; i++) { const a = i * TAU / 8; ctx.moveTo(Math.cos(a) * 6, Math.sin(a) * 6); ctx.lineTo(Math.cos(a) * 9, Math.sin(a) * 9); } }
    else if (k === 'menu') { [-6, 0, 6].forEach((yy) => { ctx.moveTo(-9, yy); ctx.lineTo(9, yy); }); }
    else if (k === 'plus') { ctx.moveTo(-8, 0); ctx.lineTo(8, 0); ctx.moveTo(0, -8); ctx.lineTo(0, 8); }
    else if (k === 'user') { ctx.arc(0, -4, 4.5, 0, TAU); ctx.moveTo(-8, 9); ctx.quadraticCurveTo(0, -2, 8, 9); }
    else if (k === 'check') { ctx.moveTo(-6, 0); ctx.lineTo(-2, 5); ctx.lineTo(7, -5); }
    else if (k === 'cart') { ctx.moveTo(-10, -7); ctx.lineTo(-6, -7); ctx.lineTo(-3, 5); ctx.lineTo(8, 5); ctx.lineTo(10, -3); ctx.lineTo(-5, -3); ctx.moveTo(-1, 9); ctx.arc(-2, 9, 1.5, 0, TAU); ctx.moveTo(7, 9); ctx.arc(6, 9, 1.5, 0, TAU); }
    ctx.stroke(); ctx.restore();
  }
  // highlight: dark veil outside the element + blue ring
  function focus(ctx, r, p, clip = [80, 300, 920, 850]) {
    if (!r || p <= 0) return;
    const [x, y, w, h] = r, pad = 8;
    ctx.save(); ctx.beginPath(); ctx.rect(...clip); ctx.roundRect(x - pad, y - pad, w + pad * 2, h + pad * 2, 12); ctx.fillStyle = `rgba(14,15,18,${0.62 * p})`; ctx.fill('evenodd');
    ctx.strokeStyle = C.sel; ctx.lineWidth = 4; ctx.globalAlpha = p; ctx.beginPath(); ctx.roundRect(x - pad, y - pad, w + pad * 2, h + pad * 2, 12); ctx.stroke(); ctx.restore();
  }
  const btn = (ctx, x, y, w, h, s, kind = 'primary', size = 18) => {
    if (kind === 'primary') { rr(ctx, x, y, w, h, 10, INK); T(ctx, s, x + w / 2, y + h / 2 + size * 0.36, size, 600, '#FFFFFF', 'center'); }
    else if (kind === 'secondary') { rr(ctx, x, y, w, h, 10, '#FFFFFF', '#D4D4D8', 1.5); T(ctx, s, x + w / 2, y + h / 2 + size * 0.36, size, 600, INK, 'center'); }
    else T(ctx, s, x + w / 2, y + h / 2 + size * 0.36, size, 600, '#3F3F46', 'center');
  };
  const toggleSw = (ctx, x, y, on) => { rr(ctx, x, y, 48, 28, 14, on ? ACC : '#D4D4D8'); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(x + (on ? 34 : 14), y + 14, 10, 0, TAU); ctx.fill(); };
  const chip = (ctx, x, y, s) => { ctx.font = `500 14px ${F.title}`; const w = ctx.measureText(s).width + 22; rr(ctx, x, y, w, 26, 13, SURF, BOR, 1); T(ctx, s, x + 11, y + 18, 14, 500, '#3F3F46'); return w; };

  // ---------------------------------------------------------------- screen A: a web app (fictional "Workspace")
  const RA = {
    navbar: [80, 320, 920, 70], search: [350, 334, 360, 42], badge: [832, 334, 44, 44], avatar: [906, 331, 48, 48], sidebar: [80, 390, 200, 730],
    breadcrumb: [300, 404, 330, 26], tabs: [300, 510, 660, 46], card: [300, 576, 320, 176], buttons: [700, 448, 262, 44], ghost: [604, 448, 84, 44],
    chip: [322, 610, 74, 26], progress: [316, 690, 288, 26], toggle: [888, 690, 52, 32], dropdown: [780, 776, 180, 186], table: [300, 828, 660, 210], pagination: [520, 1054, 220, 40],
    tooltip: [790, 386, 132, 40], popover: [744, 388, 220, 156], modal: [330, 560, 420, 230], toast: [370, 1056, 340, 54], skeleton: [300, 576, 660, 176], drawer: [700, 320, 300, 800],
  };
  function screenA(ctx, v, st = {}) {
    ctx.save(); ctx.beginPath(); ctx.roundRect(80, 320, 920, 800, 18); ctx.clip();
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(80, 320, 920, 800);
    // navbar
    ctx.fillStyle = BOR; ctx.fillRect(80, 389, 920, 1.5);
    rr(ctx, 104, 340, 30, 30, 8, INK); T(ctx, 'Workspace', 146, 363, 22, 600, INK);
    rr(ctx, 350, 334, 360, 42, 21, SURF); icon(ctx, 'search', 376, 356, 1); T(ctx, 'Search projects…', 398, 362, 17, 400, SUB);
    icon(ctx, 'bell', 852, 356, 1.2, '#3F3F46'); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(864, 344, 9, 0, TAU); ctx.fill(); T(ctx, '3', 864, 349, 12, 700, '#FFFFFF', 'center');
    ctx.fillStyle = '#DBEAFE'; ctx.beginPath(); ctx.arc(930, 355, 20, 0, TAU); ctx.fill(); T(ctx, 'SM', 930, 361, 15, 600, ACC, 'center');
    // sidebar
    ctx.fillStyle = '#FAFAFA'; ctx.fillRect(80, 390, 200, 730); ctx.fillStyle = BOR; ctx.fillRect(279, 390, 1.5, 730);
    [['home', 'Home'], ['folder', 'Projects'], ['cal', 'Calendar'], ['chat', 'Messages'], ['gear', 'Settings']].forEach(([k, l], i) => { const y = 430 + i * 54; if (i === 1) rr(ctx, 94, y - 22, 172, 42, 10, '#EDEDF0'); icon(ctx, k, 118, y - 2, 1, i === 1 ? INK : SUB); T(ctx, l, 140, y + 5, 17, i === 1 ? 600 : 500, i === 1 ? INK : '#52525B'); });
    // breadcrumb, title, buttons, tabs
    T(ctx, 'Home  /  Projects  /  ', 300, 422, 16, 500, SUB); ctx.font = `500 16px ${F.title}`; T(ctx, 'Website redesign', 300 + ctx.measureText('Home  /  Projects  /  ').width, 422, 16, 600, INK);
    T(ctx, 'Website redesign', 300, 480, 30, 600, INK);
    btn(ctx, 604, 448, 84, 44, 'Export', 'ghost'); btn(ctx, 700, 448, 110, 44, 'Share', 'secondary'); btn(ctx, 822, 448, 140, 44, 'New task', 'primary');
    ['Overview', 'Tasks', 'Files', 'Activity'].forEach((l, i) => { const x = 300 + i * 110; T(ctx, l, x, 540, 17, i === 1 ? 600 : 500, i === 1 ? INK : SUB); if (i === 1) rr(ctx, x, 552, 46, 3, 1.5, INK); });
    ctx.fillStyle = BOR; ctx.fillRect(300, 555, 660, 1.5);
    // cards (or skeleton)
    if (st.skeleton) { const sh = 0.5 + 0.5 * Math.sin(v * 4); [300, 640].forEach((x) => { rr(ctx, x, 576, 320, 176, 14, '#FFFFFF', BOR, 1.5); [[24, 30, 180, 16], [24, 64, 120, 26], [24, 116, 272, 10], [24, 140, 200, 10]].forEach(([dx, dy, w, h]) => rr(ctx, x + dx, 576 + dy, w, h, 6, mix('#EDEDF0', '#F6F6F8', sh))); }); }
    else {
      rr(ctx, 300, 576, 320, 176, 14, '#FFFFFF', BOR, 1.5); T(ctx, 'Homepage', 324, 600 + 0, 13, 600, SUB, 'left', F.mono); chip(ctx, 322, 610, 'Design'); T(ctx, '8 of 12 tasks done', 324, 676, 17, 500, INK);
      rr(ctx, 324, 698, 272, 8, 4, SURF); rr(ctx, 324, 698, 272 * 0.66, 8, 4, ACC); T(ctx, 'Due Friday', 324, 734, 15, 400, SUB);
      rr(ctx, 640, 576, 320, 176, 14, '#FFFFFF', BOR, 1.5); T(ctx, 'Checkout flow', 664, 600, 13, 600, SUB, 'left', F.mono); chip(ctx, 662, 610, 'Development'); T(ctx, '3 of 9 tasks done', 664, 676, 17, 500, INK); T(ctx, 'Notify me', 664, 712, 16, 500, '#3F3F46'); toggleSw(ctx, 890, 692, true);
    }
    // sort dropdown + table + pagination
    rr(ctx, 780, 776, 180, 40, 10, '#FFFFFF', '#D4D4D8', 1.5); T(ctx, 'Sort: Newest', 796, 802, 16, 500, INK); T(ctx, '⌄', 940, 798, 16, 600, SUB, 'center');
    T(ctx, 'Tasks', 300, 802, 20, 600, INK);
    rr(ctx, 300, 828, 660, 210, 12, '#FFFFFF', BOR, 1.5); ['Task', 'Owner', 'Status'].forEach((h, i) => T(ctx, h, [324, 640, 936][i], 860, 14, 600, SUB, i === 2 ? 'right' : 'left'));
    [['Hero section copy', 'Sara', 'Done'], ['Pricing table', 'Omar', 'In review'], ['Mobile menu', 'Lina', 'To do']].forEach((r, i) => { const y = 910 + i * 46; ctx.fillStyle = BOR; ctx.fillRect(300, y - 28, 660, 1); T(ctx, r[0], 324, y, 16, 500, INK); T(ctx, r[1], 640, y, 16, 400, '#3F3F46'); T(ctx, r[2], 936, y, 15, 600, r[2] === 'Done' ? GRN : r[2] === 'To do' ? SUB : ACC, 'right'); });
    ['‹', '1', '2', '3', '…', '8', '›'].forEach((l, i) => { const x = 538 + i * 30; if (l === '1') rr(ctx, x - 13, 1060, 26, 28, 6, INK); T(ctx, l, x, 1080, 15, 600, l === '1' ? '#FFFFFF' : '#3F3F46', 'center'); });
    // states
    if (st.dropdown) { const p = st.dropdown; ctx.save(); ctx.globalAlpha = p; rr(ctx, 780, 822, 180, 140, 10, '#FFFFFF', BOR, 1.5); ['Newest', 'Oldest', 'Name A–Z'].forEach((l, i) => { const y = 852 + i * 40; if (i === 1) rr(ctx, 788, y - 24, 164, 36, 8, SURF); T(ctx, l, 804, y, 16, 500, INK); }); ctx.restore(); }
    if (st.tooltip) { const p = st.tooltip; ctx.save(); ctx.globalAlpha = p; rr(ctx, 794, 392, 124, 34, 8, INK); ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(846, 392); ctx.lineTo(852, 384); ctx.lineTo(858, 392); ctx.fill(); T(ctx, 'Notifications', 856, 414, 14, 500, '#FFFFFF', 'center'); ctx.restore(); }
    if (st.popover) { const p = st.popover; ctx.save(); ctx.globalAlpha = p; ctx.shadowColor = 'rgba(0,0,0,0.12)'; ctx.shadowBlur = 24; rr(ctx, 744, 390, 220, 154, 12, '#FFFFFF'); ctx.shadowBlur = 0; rr(ctx, 744, 390, 220, 154, 12, null, BOR, 1); T(ctx, 'Sara Mansour', 764, 424, 16, 600, INK); T(ctx, 'sara@workspace.test', 764, 448, 13, 400, SUB); ctx.fillStyle = BOR; ctx.fillRect(744, 466, 220, 1); T(ctx, 'Profile', 764, 494, 15, 500, INK); T(ctx, 'Sign out', 764, 526, 15, 500, RED); ctx.restore(); }
    if (st.drawer) { const p = st.drawer; ctx.fillStyle = `rgba(0,0,0,${0.25 * p})`; ctx.fillRect(80, 320, 920, 800); const x = lerp(1000, 700, p); ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 30; ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x, 320, 300, 800); ctx.restore(); T(ctx, 'Task details', x + 24, 370, 20, 600, INK); T(ctx, '✕', x + 270, 370, 18, 600, SUB, 'center'); [['Title', 'Pricing table'], ['Owner', 'Omar'], ['Status', 'In review'], ['Due', 'Friday']].forEach(([a, b], i) => { T(ctx, a, x + 24, 430 + i * 70, 13, 600, SUB, 'left', F.mono); T(ctx, b, x + 24, 456 + i * 70, 17, 500, INK); }); }
    if (st.modal) { const p = st.modal; ctx.fillStyle = `rgba(9,9,11,${0.45 * p})`; ctx.fillRect(80, 320, 920, 800); ctx.save(); ctx.globalAlpha = p; ctx.translate(540, 675); ctx.scale(lerp(0.94, 1, p), lerp(0.94, 1, p)); ctx.translate(-540, -675); rr(ctx, 330, 560, 420, 230, 16, '#FFFFFF'); T(ctx, 'Delete this task?', 358, 612, 22, 600, INK); T(ctx, 'This action cannot be undone.', 358, 646, 16, 400, SUB); btn(ctx, 470, 716, 120, 44, 'Cancel', 'secondary', 16); rr(ctx, 602, 716, 120, 44, 10, RED); T(ctx, 'Delete', 662, 744, 16, 600, '#FFFFFF', 'center'); ctx.restore(); }
    if (st.toast) { const p = st.toast; ctx.save(); ctx.globalAlpha = Math.min(1, p); ctx.translate(0, (1 - p) * 40); rr(ctx, 370, 1056, 340, 54, 12, INK); icon(ctx, 'check', 400, 1083, 1, '#4ADE80'); T(ctx, 'Task saved', 424, 1089, 17, 500, '#FFFFFF'); T(ctx, 'Undo', 684, 1089, 16, 600, '#93C5FD', 'right'); ctx.restore(); }
    ctx.restore();
  }

  // ---------------------------------------------------------------- screen B: a marketing website (scrolls)
  const RB = { hero: [80, 70, 920, 430], cta: [130, 380, 190, 56], cards: [110, 540, 860, 230], carousel: [110, 820, 860, 250], accordion: [110, 1110, 860, 400], footer: [80, 1520, 920, 260] };
  const SCROLL = { hero: 0, cta: 0, cards: 300, carousel: 560, accordion: 840, footer: 980 };
  function pageB(ctx, v) {
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(80, 0, 920, 1780);
    // hero
    T(ctx, 'PROJECT PLANNING', 130, 180, 15, 600, ACC, 'left', F.mono); T(ctx, 'Plan projects', 130, 250, 50, 700, INK); T(ctx, 'without the chaos.', 130, 312, 50, 700, INK); T(ctx, 'Tasks, files and deadlines in one calm place.', 130, 360, 20, 400, SUB);
    btn(ctx, 130, 380, 190, 56, 'Start for free', 'primary', 19); btn(ctx, 336, 380, 160, 56, 'See a demo', 'secondary', 19);
    rr(ctx, 640, 140, 320, 300, 16, SURF, BOR, 1); [[670, 180, 180], [670, 220, 250], [670, 300, 130], [670, 340, 220]].forEach(([x, y, w]) => rr(ctx, x, y, w, 14, 7, '#E4E4E7'));
    // feature cards
    T(ctx, 'Why teams switch', 130, 560, 28, 700, INK);
    [['Boards', 'See every task at a glance.'], ['Files', 'Keep documents next to the work.'], ['Reminders', 'Never miss a deadline.']].forEach(([t, d], i) => { const x = 110 + i * 292; rr(ctx, x, 590, 276, 180, 14, '#FFFFFF', BOR, 1.5); rr(ctx, x + 22, 612, 40, 40, 10, SURF); T(ctx, t, x + 22, 690, 20, 600, INK); T(ctx, d, x + 22, 722, 15, 400, SUB); });
    // carousel
    T(ctx, 'What people say', 130, 850, 28, 700, INK);
    const sl = Math.floor(v / 1.6) % 3; rr(ctx, 200, 880, 680, 150, 16, SURF);
    T(ctx, ['“We finally stopped losing tasks in chat.”', '“Our weekly meeting got shorter.”', '“Clients see progress without asking.”'][sl], 540, 950, 22, 500, INK, 'center'); T(ctx, ['Studio lead', 'Product manager', 'Freelance designer'][sl], 540, 990, 16, 400, SUB, 'center');
    [150, 930].forEach((x, i) => { ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(x, 955, 22, 0, TAU); ctx.fill(); ctx.strokeStyle = BOR; ctx.lineWidth = 1.5; ctx.stroke(); T(ctx, i ? '›' : '‹', x, 962, 22, 600, INK, 'center'); });
    [0, 1, 2].forEach((i) => { ctx.fillStyle = i === sl ? INK : '#D4D4D8'; ctx.beginPath(); ctx.arc(520 + i * 20, 1058, 5, 0, TAU); ctx.fill(); });
    // accordion
    T(ctx, 'Questions', 130, 1140, 28, 700, INK);
    ['Is there a free plan?', 'Can I invite clients?', 'Does it work offline?', 'How do I cancel?'].forEach((q, i) => { const y = 1170 + i * 64 + (i > 0 ? 70 : 0); ctx.fillStyle = BOR; ctx.fillRect(110, y, 860, 1.5); T(ctx, q, 130, y + 40, 19, 600, INK); T(ctx, i === 0 ? '−' : '+', 950, y + 40, 22, 600, SUB, 'right'); if (i === 0) T(ctx, 'Yes. The free plan covers small teams.', 130, y + 86, 16, 400, SUB); });
    // footer
    ctx.fillStyle = '#FAFAFA'; ctx.fillRect(80, 1520, 920, 260); ctx.fillStyle = BOR; ctx.fillRect(80, 1520, 920, 1.5);
    rr(ctx, 130, 1560, 28, 28, 7, INK); T(ctx, 'Workspace', 168, 1581, 20, 600, INK);
    [['Product', 'Features', 'Pricing', 'Updates'], ['Company', 'About', 'Careers', 'Contact'], ['Legal', 'Privacy', 'Terms', 'Cookies']].forEach((col, i) => col.forEach((l, k) => T(ctx, l, 430 + i * 190, 1580 + k * 36, k ? 15 : 14, k ? 400 : 600, k ? SUB : INK, 'left', k ? F.title : F.mono)));
    T(ctx, '© Workspace. Fictional demo website.', 130, 1740, 14, 400, SUB);
  }
  function screenB(ctx, v, scroll, navCta = 0) {
    ctx.save(); ctx.beginPath(); ctx.roundRect(80, 320, 920, 800, 18); ctx.clip();
    ctx.save(); ctx.translate(0, 320 - scroll); pageB(ctx, v); ctx.restore();
    // sticky navbar
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(80, 320, 920, 70); ctx.fillStyle = BOR; ctx.fillRect(80, 389, 920, 1.5);
    rr(ctx, 104, 340, 30, 30, 8, INK); T(ctx, 'Workspace', 146, 363, 22, 600, INK); ['Features', 'Pricing', 'Blog'].forEach((l, i) => T(ctx, l, 520 + i * 100, 362, 17, 500, '#3F3F46')); btn(ctx, 836, 336, 136, 40, 'Sign up', 'primary', 16);
    ctx.restore();
  }
  const rectB = (id, scroll) => { const r = RB[id]; return [r[0], r[1] + 320 - scroll, r[2], r[3]]; };

  // ---------------------------------------------------------------- screen C: a form
  const RC = { field: [130, 420, 820, 104], error: [130, 540, 820, 120], select: [130, 676, 400, 230], checkbox: [560, 676, 390, 132], radio: [560, 836, 390, 96], toggle: [130, 940, 400, 60], slider: [560, 950, 390, 70], submit: [130, 1040, 820, 60] };
  function screenC(ctx, v, st = {}) {
    ctx.save(); ctx.beginPath(); ctx.roundRect(80, 320, 920, 800, 18); ctx.clip(); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(80, 320, 920, 800);
    T(ctx, 'Create your account', 130, 386, 30, 700, INK);
    const field = (x, y, w, label, val, err) => { T(ctx, label, x, y + 18, 15, 600, '#3F3F46'); rr(ctx, x, y + 30, w, 52, 10, '#FFFFFF', err ? RED : '#D4D4D8', err ? 2 : 1.5); T(ctx, val, x + 16, y + 63, 17, 400, val.includes('@') || val === 'Sara Mansour' ? INK : SUB); if (err) T(ctx, err, x, y + 106, 14, 500, RED); };
    field(130, 420, 820, 'Full name', 'Sara Mansour');
    field(130, 540, 820, 'Email', 'sara@workspace', st.noError ? null : 'Enter a valid email address.');
    T(ctx, 'Country', 130, 694, 15, 600, '#3F3F46'); rr(ctx, 130, 706, 400, 52, 10, '#FFFFFF', '#D4D4D8', 1.5); T(ctx, 'Choose a country', 146, 739, 17, 400, SUB); T(ctx, '⌄', 506, 736, 18, 600, SUB, 'center');
    if (st.select) { ctx.save(); ctx.globalAlpha = st.select; rr(ctx, 130, 764, 400, 142, 10, '#FFFFFF', BOR, 1.5); ['Algeria', 'Morocco', 'Tunisia'].forEach((c, i) => { const y = 796 + i * 40; if (i === 0) rr(ctx, 138, y - 24, 384, 36, 8, SURF); T(ctx, c, 154, y, 16, 500, INK); }); ctx.restore(); }
    T(ctx, 'Interests', 560, 694, 15, 600, '#3F3F46');
    [['Design', true], ['Code', true], ['Marketing', false]].forEach(([l, on], i) => { const y = 716 + i * 32; rr(ctx, 560, y, 22, 22, 6, on ? ACC : '#FFFFFF', on ? null : '#A1A1AA', 1.5); if (on) icon(ctx, 'check', 571, y + 11, 0.8, '#FFFFFF'); T(ctx, l, 594, y + 17, 16, 500, INK); });
    T(ctx, 'Plan', 560, 854, 15, 600, '#3F3F46');
    [['Free', false], ['Pro', true]].forEach(([l, on], i) => { const x = 560 + i * 130, y = 888; ctx.strokeStyle = on ? ACC : '#A1A1AA'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x + 11, y, 11, 0, TAU); ctx.stroke(); if (on) { ctx.fillStyle = ACC; ctx.beginPath(); ctx.arc(x + 11, y, 6, 0, TAU); ctx.fill(); } T(ctx, l, x + 30, y + 6, 16, 500, INK); });
    T(ctx, 'Weekly newsletter', 130, 978, 16, 500, INK); toggleSw(ctx, 470, 958, true);
    T(ctx, 'Team size', 560, 968, 15, 600, '#3F3F46'); rr(ctx, 560, 994, 300, 6, 3, '#E4E4E7'); rr(ctx, 560, 994, 300 * 0.4, 6, 3, ACC); ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = ACC; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(680, 997, 11, 0, TAU); ctx.fill(); ctx.stroke(); T(ctx, '4 people', 950, 1002, 15, 600, INK, 'right');
    btn(ctx, 130, 1040, 820, 60, 'Create account', 'primary', 19);
    ctx.restore();
  }

  // ---------------------------------------------------------------- screen D: a phone (1:2.1)
  const PX = 340, PY = 300, PW = 400, PH = 840;
  const RD = { hamburger: [PX + 14, PY + 66, 48, 48], segmented: [PX + 20, PY + 132, PW - 40, 44], list: [PX + 20, PY + 196, PW - 40, 300], fab: [PX + PW - 92, PY + PH - 196, 64, 64], tabbar: [PX, PY + PH - 96, PW, 96], sheet: [PX, PY + PH - 360, PW, 360] };
  function screenD(ctx, v, st = {}) {
    rr(ctx, PX - 12, PY - 12, PW + 24, PH + 24, 56, '#0B0B0D'); ctx.save(); ctx.beginPath(); ctx.roundRect(PX, PY, PW, PH, 44); ctx.clip(); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(PX, PY, PW, PH);
    T(ctx, '9:41', PX + 40, PY + 36, 15, 600, INK); rr(ctx, PX + PW / 2 - 56, PY + 14, 112, 30, 15, '#0B0B0D');
    icon(ctx, 'menu', PX + 38, PY + 90, 1.1, INK); T(ctx, 'Tasks', PX + PW / 2, PY + 98, 22, 700, INK, 'center'); ctx.fillStyle = '#DBEAFE'; ctx.beginPath(); ctx.arc(PX + PW - 40, PY + 90, 18, 0, TAU); ctx.fill(); T(ctx, 'SM', PX + PW - 40, PY + 95, 13, 600, ACC, 'center');
    rr(ctx, PX + 20, PY + 132, PW - 40, 44, 12, SURF); const sw = (PW - 48) / 3; rr(ctx, PX + 24, PY + 136, sw, 36, 10, '#FFFFFF'); ['Today', 'Week', 'Month'].forEach((l, i) => T(ctx, l, PX + 24 + sw * i + sw / 2, PY + 160, 15, i === 0 ? 600 : 500, i === 0 ? INK : SUB, 'center'));
    if (st.skeleton) { [0, 1, 2, 3].forEach((i) => { const y = PY + 210 + i * 76; rr(ctx, PX + 20, y, 44, 44, 22, '#EDEDF0'); rr(ctx, PX + 80, y + 6, 200, 12, 6, '#EDEDF0'); rr(ctx, PX + 80, y + 28, 130, 10, 5, '#F2F2F4'); }); }
    else [['Review homepage', '10:00 · Design'], ['Call with client', '12:30 · Sales'], ['Fix mobile menu', '15:00 · Dev'], ['Send invoice', '17:00 · Admin']].forEach(([t, s], i) => { const y = PY + 210 + i * 76; rr(ctx, PX + 20, y + 10, 24, 24, 7, '#FFFFFF', '#A1A1AA', 1.5); T(ctx, t, PX + 60, y + 22, 17, 600, INK); T(ctx, s, PX + 60, y + 44, 14, 400, SUB); ctx.fillStyle = BOR; ctx.fillRect(PX + 20, y + 62, PW - 40, 1); });
    // FAB
    ctx.save(); ctx.shadowColor = 'rgba(37,99,235,0.35)'; ctx.shadowBlur = 18; ctx.fillStyle = ACC; ctx.beginPath(); ctx.arc(PX + PW - 60, PY + PH - 164, 32, 0, TAU); ctx.fill(); ctx.restore(); icon(ctx, 'plus', PX + PW - 60, PY + PH - 164, 1.2, '#FFFFFF');
    // tab bar
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(PX, PY + PH - 96, PW, 96); ctx.fillStyle = BOR; ctx.fillRect(PX, PY + PH - 96, PW, 1.5);
    [['home', 'Home'], ['search', 'Search'], ['chat', 'Inbox'], ['user', 'Profile']].forEach(([k, l], i) => { const x = PX + 50 + i * 100; icon(ctx, k, x, PY + PH - 66, 1.1, i === 0 ? ACC : SUB); T(ctx, l, x, PY + PH - 38, 12, 600, i === 0 ? ACC : SUB, 'center'); });
    if (st.drawer) { const p = st.drawer; ctx.fillStyle = `rgba(0,0,0,${0.35 * p})`; ctx.fillRect(PX, PY, PW, PH); const x = lerp(PX - 300, PX, p); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x, PY, 300, PH); T(ctx, 'Workspace', x + 28, PY + 100, 22, 700, INK); ['Tasks', 'Projects', 'Calendar', 'Settings', 'Help'].forEach((l, i) => T(ctx, l, x + 28, PY + 170 + i * 56, 18, i ? 500 : 600, i ? '#3F3F46' : INK)); }
    if (st.sheet) { const p = st.sheet; ctx.fillStyle = `rgba(0,0,0,${0.35 * p})`; ctx.fillRect(PX, PY, PW, PH); const y = lerp(PY + PH, PY + PH - 360, p); rr(ctx, PX, y, PW, 400, 28, '#FFFFFF'); rr(ctx, PX + PW / 2 - 24, y + 12, 48, 5, 3, '#D4D4D8'); T(ctx, 'New item', PX + 28, y + 60, 20, 700, INK); ['Task', 'Event', 'Note', 'Reminder'].forEach((l, i) => { T(ctx, l, PX + 28, y + 116 + i * 56, 18, 500, INK); ctx.fillStyle = BOR; ctx.fillRect(PX + 28, y + 136 + i * 56, PW - 56, 1); }); }
    ctx.restore();
  }

  // ---------------------------------------------------------------- UI term vignettes
  const fp = (v) => ez(v, 0.5, 1.3, E.outCubic);
  const mkA = (id, st = () => ({}), extra) => ({
    draw(ctx, v) { const a = ez(v, 0, 0.5, E.outCubic); ctx.save(); ctx.globalAlpha = a; screenA(ctx, v, st(v)); focus(ctx, typeof id === 'function' ? id(v) : RA[id], fp(v), [80, 320, 920, 800]); if (extra) extra(ctx, v); ctx.restore(); },
    hits: [[0.5, 'focus', 'tick'], ...(extra && extra.hits ? extra.hits : [])],
  });
  const ui = {
    navbar: mkA('navbar'), sidebar: mkA('sidebar'), breadcrumb: mkA('breadcrumb'), search: mkA('search'), tabs: mkA('tabs'), card: mkA('card'), chip: mkA('chip'), progress: mkA('progress'), pagination: mkA('pagination'), table: mkA('table'),
    buttons: mkA((v) => (v < 3.2 ? RA.buttons : [604, 448, 358, 44])), ghost: mkA('ghost'),
    badge: mkA('badge'), avatar: mkA('avatar'), toggle: mkA('toggle'),
    dropdown: mkA('dropdown', (v) => ({ dropdown: ez(v, 0.8, 1.4) })),
    tooltip: mkA((v) => [794, 384, 124, 42], (v) => ({ tooltip: ez(v, 0.8, 1.3) }), (ctx, v) => cursor(ctx, 858, 362)),
    popover: mkA('popover', (v) => ({ popover: ez(v, 0.9, 1.4) }), (ctx, v) => cursor(ctx, 936, 364)),
    modal: { draw(ctx, v) { const a = ez(v, 0, 0.5, E.outCubic); ctx.save(); ctx.globalAlpha = a; screenA(ctx, v, { modal: ez(v, 0.6, 1.3, E.outCubic) }); ctx.restore(); }, hits: [[0.6, 'modal', 'pop', { pitch: 'A5' }]] },
    toast: mkA('toast', (v) => ({ toast: spr(v, 0.8, { stiffness: 260, damping: 16 }) })),
    drawer: { draw(ctx, v) { const a = ez(v, 0, 0.5, E.outCubic); ctx.save(); ctx.globalAlpha = a; screenA(ctx, v, { drawer: ez(v, 0.6, 1.5, E.outCubic) }); ctx.restore(); }, hits: [[0.6, 'drawer', 'whoosh', { len: 0.4 }]] },
    skeleton: mkA('skeleton', () => ({ skeleton: true })),
  };
  ui.dropdown.hits.push([0.8, 'open', 'click']); ui.tooltip.hits.push([0.8, 'hover', 'tick']); ui.popover.hits.push([0.9, 'click', 'click']); ui.toast.hits.push([0.8, 'toast', 'pop', { pitch: 'E5' }]);
  // website (screen B), scroll to the element
  const mkB = (id) => ({
    draw(ctx, v) { const a = ez(v, 0, 0.5, E.outCubic); const sc = SCROLL[id]; ctx.save(); ctx.globalAlpha = a; screenB(ctx, v, sc); focus(ctx, rectB(id, sc), fp(v), [80, 320, 920, 800]); ctx.restore(); },
    hits: [[0.5, 'focus', 'tick']],
  });
  Object.assign(ui, { hero: mkB('hero'), cta: mkB('cta'), cards: mkB('cards'), carousel: mkB('carousel'), accordion: mkB('accordion'), footer: mkB('footer') });
  // form (screen C)
  const mkC = (id, st = () => ({})) => ({ draw(ctx, v) { const a = ez(v, 0, 0.5, E.outCubic); ctx.save(); ctx.globalAlpha = a; screenC(ctx, v, st(v)); focus(ctx, RC[id], fp(v), [80, 320, 920, 800]); ctx.restore(); }, hits: [[0.5, 'focus', 'tick']] });
  Object.assign(ui, { field: mkC('field'), select: mkC('select', (v) => ({ select: ez(v, 0.8, 1.4) })), checkbox: mkC('checkbox'), radio: mkC('radio'), toggleF: mkC('toggle'), slider: mkC('slider'), error: mkC('error') });
  // phone (screen D)
  const mkD = (id, st = () => ({}), noFocus) => ({ draw(ctx, v) { const a = ez(v, 0, 0.5, E.outCubic); ctx.save(); ctx.globalAlpha = a; screenD(ctx, v, st(v)); if (!noFocus) focus(ctx, RD[id], fp(v), [PX, PY, PW, PH]); ctx.restore(); }, hits: [[0.5, 'focus', 'tick']] });
  Object.assign(ui, { tabbar: mkD('tabbar'), fab: mkD('fab'), segmented: mkD('segmented'), hamburger: mkD(null, (v) => ({ drawer: ez(v, 0.8, 1.6, E.outCubic) }), true), sheet: mkD(null, (v) => ({ sheet: ez(v, 0.8, 1.6, E.outCubic) }), true), list: mkD('list') });

  // ---------------------------------------------------------------- UX term vignettes (dark canvas, our own diagrams)
  const panel = (ctx, x = 80, y = 300, w = 920, h = 840) => rr(ctx, x, y, w, h, 18, DBG, DLINE, 1.5);
  const lbl = (ctx, s, x, y, col = DDIM, align = 'left', size = 18) => T(ctx, s, x, y, size, 600, col, align, F.mono);
  function miniScreen(ctx, x, y, w, h, mode) {
    // mode 0 wireframe, 1 mockup
    rr(ctx, x, y, w, h, 16, mode ? '#FFFFFF' : '#2E2F35', mode ? null : '#55565E', 2);
    const box = (bx, by, bw, bh, col, r = 8) => { if (mode) rr(ctx, x + bx, y + by, bw, bh, r, col); else { ctx.save(); ctx.setLineDash([6, 6]); rr(ctx, x + bx, y + by, bw, bh, r, null, '#6B6B73', 2); ctx.restore(); ctx.strokeStyle = '#4A4B53'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + bx, y + by); ctx.lineTo(x + bx + bw, y + by + bh); ctx.moveTo(x + bx + bw, y + by); ctx.lineTo(x + bx, y + by + bh); ctx.stroke(); } };
    box(24, 24, w - 48, h * 0.34, mode ? '#DBEAFE' : null, 12);
    if (mode) { T(ctx, 'Summer menu', x + 24, y + h * 0.34 + 70, 26, 700, INK); T(ctx, 'Fresh dishes, every day.', x + 24, y + h * 0.34 + 104, 16, 400, SUB); }
    else { rr(ctx, x + 24, y + h * 0.34 + 50, w * 0.55, 18, 9, '#55565E'); rr(ctx, x + 24, y + h * 0.34 + 84, w * 0.4, 12, 6, '#45464E'); }
    if (mode) { rr(ctx, x + 24, y + h - 84, w - 48, 56, 12, INK); T(ctx, 'Order now', x + w / 2, y + h - 49, 19, 600, '#FFFFFF', 'center'); }
    else { ctx.save(); ctx.setLineDash([6, 6]); rr(ctx, x + 24, y + h - 84, w - 48, 56, 12, null, '#6B6B73', 2); ctx.restore(); T(ctx, 'BUTTON', x + w / 2, y + h - 50, 16, 600, '#8B8B93', 'center', F.mono); }
  }
  const ux = {};
  // wireframe -> mockup -> prototype
  ux.wmp = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1, E.outCubic); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
      const stage = v < 3 ? 0 : v < 5.6 ? 1 : 2, x = 300, y = 330, w = 480, h = 700;
      miniScreen(ctx, x, y, w, h, stage ? 1 : 0);
      ['WIREFRAME · structure', 'MOCKUP · look', 'PROTOTYPE · behaviour'].forEach((l, i) => { const on = i === stage; ctx.save(); ctx.globalAlpha *= on ? 1 : 0.35; rr(ctx, 120 + i * 290, 1070, 270, 48, 24, on ? C.sel : '#2E2F35'); T(ctx, l, 255 + i * 290, 1101, 16, 600, '#FFFFFF', 'center', F.mono); ctx.restore(); });
      if (stage === 2) { const m = ez(v, 5.8, 6.6, E.inOutCubic); cursor(ctx, lerp(700, x + w / 2, m), lerp(700, y + h - 52, m)); const c = ez(v, 6.8, 7.3); if (c > 0) { ctx.save(); ctx.globalAlpha *= c; rr(ctx, x, y, w, h, 16, '#FFFFFF'); icon(ctx, 'check', x + w / 2, y + h / 2 - 40, 3, GRN); T(ctx, 'Order placed', x + w / 2, y + h / 2 + 40, 28, 700, INK, 'center'); ctx.restore(); } }
      ctx.restore();
    },
    hits: [[0.2, 'wire', 'whoosh', { len: 0.4 }], [3, 'mockup', 'pop', { pitch: 'D5' }], [5.6, 'proto', 'pop', { pitch: 'A5' }], [6.8, 'click', 'click']],
  };
  // affordance vs signifier
  ux.afford = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1, E.outCubic); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; panel(ctx);
      lbl(ctx, 'AFFORDANCE: WHAT YOU CAN DO', 120, 360, DDIM); lbl(ctx, 'SIGNIFIER: THE CUE THAT SHOWS IT', 120, 760, C.sel);
      // a plain text you can click, without cues
      T(ctx, 'Save changes', 300, 520, 34, 500, DTXT, 'center'); T(ctx, '(clickable… but who knows?)', 300, 570, 18, 500, DDIM, 'center');
      const p = ez(v, 3, 3.8, E.outCubic);
      if (p > 0) { ctx.save(); ctx.globalAlpha *= p; rr(ctx, 620, 470, 260, 72, 14, '#FFFFFF'); T(ctx, 'Save changes', 750, 516, 24, 600, INK, 'center'); T(ctx, 'Same action, now it looks clickable', 750, 590, 17, 500, DDIM, 'center'); ctx.restore(); }
      const q = ez(v, 4.6, 5.4, E.outCubic);
      if (q > 0) { ctx.save(); ctx.globalAlpha *= q; T(ctx, 'Read the guide', 160, 880, 28, 500, '#93C5FD'); ctx.fillStyle = '#93C5FD'; ctx.fillRect(160, 888, 196, 2); lbl(ctx, 'underline', 160, 930, DDIM, 'left', 15);
        [0, 1, 2].forEach((r) => [0, 1].forEach((c) => { ctx.fillStyle = DDIM; ctx.beginPath(); ctx.arc(520 + c * 14, 850 + r * 14, 3.5, 0, TAU); ctx.fill(); })); T(ctx, 'Drag to reorder', 560, 878, 26, 500, DTXT); lbl(ctx, 'grip handle', 520, 930, DDIM, 'left', 15);
        rr(ctx, 160, 990, 360, 52, 10, '#2E2F35', '#55565E', 1.5); T(ctx, 'Search…', 210, 1024, 20, 400, DDIM); icon(ctx, 'search', 186, 1016, 1, DDIM); lbl(ctx, 'placeholder + icon', 560, 1024, DDIM, 'left', 15); ctx.restore(); }
      ctx.restore();
    },
    hits: [[0.2, 'panel', 'whoosh', { len: 0.4 }], [3, 'button', 'pop', { pitch: 'D5' }], [4.6, 'cues', 'pop', { pitch: 'A5' }]],
  };
  // user flow vs user journey (NN/g)
  ux.flow = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1, E.outCubic); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; panel(ctx);
      lbl(ctx, 'USER FLOW · one task, inside one product', 120, 360);
      const F1 = ['Cart', 'Address', 'Payment', 'Done']; F1.forEach((l, i) => { const p = ez(v, 0.8 + i * 0.4, 1.3 + i * 0.4); if (p <= 0) return; const x = 120 + i * 220; ctx.save(); ctx.globalAlpha *= p; rr(ctx, x, 400, 180, 110, 14, '#FFFFFF'); T(ctx, l, x + 90, 466, 22, 600, INK, 'center'); if (i < 3) { ctx.strokeStyle = DDIM; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 186, 455); ctx.lineTo(x + 214, 455); ctx.stroke(); } ctx.restore(); });
      lbl(ctx, 'USER JOURNEY · the whole experience, across channels', 120, 640, C.sel);
      const J = [['Sees an ad', 'Social'], ['Compares', 'Website'], ['Buys', 'App'], ['Receipt', 'Email'], ['Asks for help', 'Support']];
      const mood = [0.6, 0.45, 0.8, 0.7, 0.3];
      J.forEach(([t, ch], i) => { const p = ez(v, 3.4 + i * 0.4, 3.9 + i * 0.4); if (p <= 0) return; const x = 160 + i * 190; ctx.save(); ctx.globalAlpha *= p; ctx.fillStyle = C.sel; ctx.beginPath(); ctx.arc(x, 1000 - mood[i] * 220, 10, 0, TAU); ctx.fill(); T(ctx, t, x, 1060, 18, 600, DTXT, 'center'); lbl(ctx, ch, x, 1092, DDIM, 'center', 14); ctx.restore(); });
      const L = ez(v, 3.6, 5.6); if (L > 0) { ctx.save(); ctx.strokeStyle = C.sel; ctx.lineWidth = 3; ctx.beginPath(); const n = 1 + Math.floor(L * 4); for (let i = 0; i <= Math.min(4, n); i++) { const x = 160 + i * 190, y = 1000 - mood[i] * 220; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); lbl(ctx, 'feeling', 120, 740, DDIM, 'left', 14); }
      ctx.restore();
    },
    hits: [[0.8, 'step', 'tick'], [1.2, 'step', 'tick'], [1.6, 'step', 'tick'], [2, 'step', 'tick'], [3.4, 'journey', 'whoosh', { len: 0.5 }], [5.6, 'done', 'bell', { pitch: 'F#6' }]],
  };
  // persona
  ux.persona = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1, E.outCubic); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; rr(ctx, 160, 320, 760, 800, 18, '#FFFFFF');
      ctx.fillStyle = '#DBEAFE'; ctx.beginPath(); ctx.arc(270, 440, 70, 0, TAU); ctx.fill(); T(ctx, 'L', 270, 462, 60, 700, ACC, 'center');
      T(ctx, 'Lina', 370, 430, 40, 700, INK); T(ctx, 'Small café owner · uses her phone all day', 370, 470, 18, 500, SUB); lbl(ctx, 'FICTIONAL PERSONA', 370, 504, '#A1A1AA', 'left', 14);
      [['GOALS', ['Take orders without paper', 'See today’s sales quickly'], 620], ['FRUSTRATIONS', ['Too many steps to add an item', 'Tiny buttons with flour on her hands'], 860]].forEach(([h, rows, y], k) => { const p = ez(v, 2.4 + k * 1.2, 3.2 + k * 1.2); if (p <= 0) return; ctx.save(); ctx.globalAlpha *= p; lbl(ctx, h, 210, y, k ? RED : GRN, 'left', 16); rows.forEach((r, i) => T(ctx, '• ' + r, 210, y + 48 + i * 44, 22, 500, INK)); ctx.restore(); });
      ctx.restore();
    },
    hits: [[0.2, 'card', 'whoosh', { len: 0.4 }], [2.4, 'goals', 'pop', { pitch: 'D5' }], [3.6, 'pains', 'pop', { pitch: 'F#5' }]],
  };
  // information architecture (sitemap)
  ux.ia = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1, E.outCubic); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; panel(ctx);
      const node = (x, y, s, p, main) => { if (p <= 0) return; ctx.save(); ctx.globalAlpha *= p; ctx.font = `600 20px ${F.title}`; const w = ctx.measureText(s).width + 40; rr(ctx, x - w / 2, y - 26, w, 52, 12, main ? '#FFFFFF' : '#2E2F35', main ? null : '#55565E', 1.5); T(ctx, s, x, y + 7, 20, 600, main ? INK : DTXT, 'center'); ctx.restore(); };
      const edge = (x1, y1, x2, y2, p) => { if (p <= 0) return; ctx.strokeStyle = '#55565E'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1, (y1 + y2) / 2); ctx.lineTo(x2, (y1 + y2) / 2); ctx.lineTo(lerp(x2, x2, 1), lerp((y1 + y2) / 2, y2, p)); ctx.stroke(); };
      node(540, 400, 'Home', ez(v, 0.6, 1.1), true);
      const L1 = [['Shop', 240], ['Guides', 540], ['Help', 840]]; L1.forEach(([s, x], i) => { const p = ez(v, 1.4 + i * 0.3, 1.9 + i * 0.3); edge(540, 426, x, 574, p); node(x, 600, s, p, false); });
      const L2 = [[['Women', 'Men', 'Kids'], 240], [['Care', 'Sizing'], 540], [['Orders', 'Returns', 'Contact'], 840]];
      L2.forEach(([kids, px], i) => kids.forEach((s, k) => { const x = px + (k - (kids.length - 1) / 2) * 96, p = ez(v, 3 + i * 0.4 + k * 0.15, 3.5 + i * 0.4 + k * 0.15); edge(px, 626, x, 774, p); if (p > 0) { ctx.save(); ctx.globalAlpha *= p; T(ctx, s, x, 806, 17, 500, DTXT, 'center'); ctx.restore(); } }));
      const t = ez(v, 5.4, 6); if (t > 0) { ctx.save(); ctx.globalAlpha *= t; T(ctx, 'How content is organised, grouped and labelled', 540, 960, 24, 600, DTXT, 'center'); T(ctx, 'so people find things where they expect them.', 540, 1000, 24, 500, DDIM, 'center'); ctx.restore(); }
      ctx.restore();
    },
    hits: [[0.6, 'root', 'pop', { pitch: 'D5' }], [1.4, 'level 1', 'tick'], [1.7, 'level 1', 'tick'], [2, 'level 1', 'tick'], [3, 'level 2', 'tok', { pitch: 'A5' }], [5.4, 'line', 'bell', { pitch: 'F#6' }]],
  };
  // Fitts's law
  ux.fitts = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1, E.outCubic); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; panel(ctx);
      lbl(ctx, 'SMALL AND FAR', 120, 360, '#FCA5A5'); lbl(ctx, 'BIG AND CLOSE', 120, 760, '#86EFAC');
      const c1 = ez(v, 1.2, 3.4, E.inOutCubic), c2 = ez(v, 4.2, 5.2, E.inOutCubic);
      rr(ctx, 870, 400, 70, 30, 8, '#FFFFFF'); T(ctx, 'OK', 905, 421, 14, 700, INK, 'center'); ctx.setLineDash([6, 8]); ctx.strokeStyle = '#55565E'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(160, 640); ctx.lineTo(900, 418); ctx.stroke(); ctx.setLineDash([]);
      cursor(ctx, lerp(160, 900, c1), lerp(640, 418, c1));
      rr(ctx, 300, 880, 620, 110, 16, '#FFFFFF'); T(ctx, 'OK', 610, 948, 30, 700, INK, 'center'); ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.moveTo(160, 1000); ctx.lineTo(320, 950); ctx.stroke(); ctx.setLineDash([]);
      cursor(ctx, lerp(160, 330, c2), lerp(1000, 945, c2));
      [[c1, 0.95, 580, '#FCA5A5'], [c2, 0.32, 1060, '#86EFAC']].forEach(([c, len, y, col]) => { rr(ctx, 160, y, 760 * len * c, 10, 5, col); });
      lbl(ctx, 'time to reach', 160, 1100, DDIM, 'left', 14);
      ctx.restore();
    },
    hits: [[1.2, 'move far', 'whoosh', { len: 0.8 }], [3.4, 'hit', 'tick'], [4.2, 'move close', 'whoosh', { len: 0.3 }], [5.2, 'hit', 'pop', { pitch: 'A5' }]],
  };
  // Hick's law
  ux.hick = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1, E.outCubic); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; panel(ctx);
      const many = ['Pizza', 'Pasta', 'Burgers', 'Salads', 'Sushi', 'Tacos', 'Curry', 'Soups', 'Wraps', 'Kebab', 'Bowls', 'Desserts'];
      lbl(ctx, '12 CHOICES', 120, 360, '#FCA5A5'); many.forEach((m, i) => { const x = 120 + (i % 4) * 210, y = 390 + Math.floor(i / 4) * 64; rr(ctx, x, y, 196, 50, 10, '#2E2F35', '#45464E', 1); T(ctx, m, x + 98, y + 32, 18, 500, DTXT, 'center'); });
      lbl(ctx, '4 CHOICES', 120, 650, '#86EFAC'); ['Pizza', 'Burgers', 'Salads', 'Desserts'].forEach((m, i) => { const x = 120 + i * 210; rr(ctx, x, 680, 196, 70, 12, '#FFFFFF'); T(ctx, m, x + 98, 724, 22, 600, INK, 'center'); });
      const t1 = ez(v, 2.2, 5.6, (t) => t), t2 = ez(v, 2.2, 3.6, (t) => t);
      lbl(ctx, 'time to decide', 120, 840, DDIM, 'left', 15);
      rr(ctx, 120, 860, 800 * t1, 22, 11, '#FCA5A5'); rr(ctx, 120, 900, 800 * 0.4 * t2, 22, 11, '#86EFAC');
      const s = ez(v, 6, 6.6); if (s > 0) { ctx.save(); ctx.globalAlpha *= s; T(ctx, 'More options, longer decisions.', 540, 1010, 28, 600, DTXT, 'center'); T(ctx, 'Group them, or show the popular ones first.', 540, 1052, 22, 500, DDIM, 'center'); ctx.restore(); }
      ctx.restore();
    },
    hits: [[0.2, 'menus', 'whoosh', { len: 0.4 }], [2.2, 'timers', 'tick'], [3.6, 'fast done', 'pop', { pitch: 'A5' }], [5.6, 'slow done', 'thud', { pitch: 'C3' }]],
  };
  // Jakob's law
  ux.jakob = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1, E.outCubic); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
      [[0, 'Where people expect it', true], [1, 'Somewhere "original"', false]].forEach(([i, l, ok]) => {
        const p = ez(v, 0.4 + i * 1.6, 1.2 + i * 1.6, E.outCubic); if (p <= 0) return; const y = 320 + i * 420; ctx.save(); ctx.globalAlpha *= p;
        rr(ctx, 80, y, 920, 380, 18, '#FFFFFF'); ctx.fillStyle = BOR; ctx.fillRect(80, y + 70, 920, 1.5); rr(ctx, 104, y + 20, 30, 30, 8, INK); T(ctx, 'Shop', 146, y + 43, 22, 600, INK);
        if (ok) { icon(ctx, 'search', 870, y + 36, 1.1, INK); icon(ctx, 'cart', 940, y + 36, 1.2, INK); } else { icon(ctx, 'cart', 540, y + 340, 1.2, INK); icon(ctx, 'search', 150, y + 340, 1.1, INK); }
        [0, 1, 2].forEach((k) => { rr(ctx, 104 + k * 296, y + 100, 276, 180, 12, SURF); rr(ctx, 124 + k * 296, y + 300, 160, 14, 7, '#E4E4E7'); });
        T(ctx, l, 960, y + 360, 18, 600, ok ? GRN : RED, 'right', F.mono); ctx.restore();
        const b = Math.min(1, spr(v, 1.4 + i * 1.6)); if (b > 0) { const [cx, cy] = ok ? [940, y + 36] : [540, y + 340]; ctx.save(); ctx.strokeStyle = ok ? '#22C55E' : '#EF4444'; ctx.lineWidth = 4; ctx.globalAlpha = b; ctx.beginPath(); ctx.arc(cx, cy, 30 * b, 0, TAU); ctx.stroke(); ctx.restore(); }
      });
      ctx.restore();
    },
    hits: [[0.4, 'familiar', 'whoosh', { len: 0.4 }], [1.4, 'found', 'pop', { pitch: 'A5' }], [2, 'odd', 'whoosh', { len: 0.4 }], [3, 'lost', 'thud', { pitch: 'C3' }]],
  };
  // usability test
  ux.utest = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1, E.outCubic); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
      rr(ctx, 80, 320, 600, 520, 18, '#FFFFFF'); T(ctx, 'Your cart', 120, 390, 28, 700, INK); [['Coffee beans', '$18'], ['Filter papers', '$6']].forEach(([n, p], i) => { T(ctx, n, 120, 460 + i * 56, 20, 500, INK); T(ctx, p, 640, 460 + i * 56, 20, 600, INK, 'right'); });
      T(ctx, 'continue', 600, 800, 14, 500, '#A1A1AA', 'right');
      const wander = [[300, 700], [560, 620], [200, 760], [600, 790]], k = clamp((v - 1) / 1.2, 0, 2.99), i0 = Math.floor(k), f = k - i0, [x1, y1] = wander[i0], [x2, y2] = wander[i0 + 1]; cursor(ctx, lerp(x1, x2, E.inOutCubic(f)), lerp(y1, y2, E.inOutCubic(f)));
      const b = ez(v, 2.2, 2.8); if (b > 0) { ctx.save(); ctx.globalAlpha *= b; rr(ctx, 380, 560, 300, 64, 32, C.sel); T(ctx, '“Where is checkout?”', 530, 600, 18, 600, '#FFFFFF', 'center'); ctx.restore(); }
      const n = ez(v, 4, 4.8); if (n > 0) { ctx.save(); ctx.globalAlpha *= n; rr(ctx, 700, 320, 300, 520, 18, DBG, DLINE, 1.5); lbl(ctx, 'OBSERVER NOTES', 724, 366, DDIM, 'left', 15); ['Looked for a button', 'Missed the tiny link', 'Fix: a clear', '"Checkout" button'].forEach((s, i) => T(ctx, s, 724, 420 + i * 40, 19, 500, i > 1 ? '#86EFAC' : DTXT)); ctx.restore(); }
      const s = ez(v, 5.6, 6.2); if (s > 0) { ctx.save(); ctx.globalAlpha *= s; T(ctx, 'Watch real people try a real task.', 540, 930, 28, 600, DTXT, 'center'); T(ctx, 'Don’t help them. Note where they struggle.', 540, 972, 22, 500, DDIM, 'center'); ctx.restore(); }
      ctx.restore();
    },
    hits: [[0.2, 'screen', 'whoosh', { len: 0.4 }], [1, 'wander', 'tick'], [2.2, 'thinking', 'pop', { pitch: 'E5' }], [4, 'notes', 'tick'], [5.6, 'lesson', 'bell', { pitch: 'F#6' }]],
  };
  // A/B test
  ux.ab = {
    draw(ctx, v) {
      const a = ez(v, 0.2, 1, E.outCubic); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; panel(ctx);
      const dots = ez(v, 1, 3, (t) => t);
      ctx.fillStyle = DDIM; for (let i = 0; i < 16; i++) { const f = clamp(dots * 1.4 - (i % 8) * 0.05), side = i % 2, x = lerp(540, side ? 790 : 290, f), y = lerp(380, 520, f) + (Math.floor(i / 2) % 4) * 10; ctx.beginPath(); ctx.arc(x + (i % 4) * 8, y, 5, 0, TAU); ctx.fill(); }
      lbl(ctx, 'SAME PAGE, ONE CHANGE, SPLIT TRAFFIC', 540, 360, DDIM, 'center', 16);
      [['A', 290, 'Sign up', '#3F3F46'], ['B', 790, 'Start for free', INK]].forEach(([n, x, s, col], i) => { rr(ctx, x - 200, 560, 400, 330, 16, '#FFFFFF'); T(ctx, n, x - 170, 610, 28, 700, '#A1A1AA'); rr(ctx, x - 150, 650, 300, 18, 9, SURF); rr(ctx, x - 150, 684, 220, 14, 7, SURF); rr(ctx, x - 140, 780, 280, 60, 12, col); T(ctx, s, x, 818, 20, 600, '#FFFFFF', 'center'); });
      const w = ez(v, 4.4, 5); if (w > 0) { tagLight(ctx, 'More sign-ups', 790, 940, w); ctx.save(); ctx.globalAlpha *= w; T(ctx, 'Keep the winner. Test the next idea.', 540, 1050, 24, 600, DTXT, 'center'); ctx.restore(); }
      ctx.restore();
    },
    hits: [[1, 'traffic', 'whoosh', { len: 0.8 }], [3, 'split', 'tick'], [4.4, 'winner', 'bell', { pitch: 'F#6' }]],
  };
  function tagLight(ctx, s, cx, cy, p) { ctx.save(); ctx.globalAlpha *= p; ctx.font = `600 20px ${F.title}`; const w = ctx.measureText(s).width + 32; rr(ctx, cx - w / 2, cy - 22, w, 44, 22, C.green); T(ctx, s, cx, cy + 7, 20, 600, '#FFFFFF', 'center'); ctx.restore(); }

  // recap vignettes
  const recapUI = { draw(ctx, v) { const a = ez(v, 0.2, 1, E.outCubic); ctx.save(); ctx.globalAlpha = a; screenA(ctx, v, { tooltip: ez(v, 1.6, 2), toast: ez(v, 2.2, 2.8) }); ctx.restore(); }, hits: [[0.2, 'screen', 'whoosh', { len: 0.4 }], [2.2, 'toast', 'pop', { pitch: 'A5' }]] };
  const recapUX = { draw(ctx, v) { ux.ia.draw(ctx, v + 6); }, hits: [[0.2, 'map', 'whoosh', { len: 0.4 }]] };
  return { ui, ux, recapUI, recapUX, screenA, screenD };
}

// ---------------------------------------------------------------- content
const UI_TERMS = {
  navbar: ['NAVBAR.', 'THE BAR OF LINKS AT THE TOP.', 'شريط التنقل: الروابط أعلى الصفحة.'],
  sidebar: ['SIDEBAR.', 'VERTICAL NAVIGATION ON THE SIDE.', 'الشريط الجانبي: تنقّل عمودي على الجانب.'],
  breadcrumb: ['BREADCRUMB.', 'WHERE YOU ARE IN THE HIERARCHY.', 'مسار التنقل: موقعك داخل الأقسام.'],
  search: ['SEARCH BAR.', 'TYPE TO FIND CONTENT.', 'شريط البحث: اكتب لتجد ما تريد.'],
  tabs: ['TABS.', 'SWITCH VIEWS ON THE SAME PAGE.', 'علامات التبويب: تبديل العرض في الصفحة نفسها.'],
  card: ['CARD.', 'A BOX THAT GROUPS ONE TOPIC.', 'البطاقة: إطار يجمع موضوعًا واحدًا.'],
  buttons: ['PRIMARY & SECONDARY', 'BUTTONS.', 'ONE MAIN ACTION, THE OTHERS QUIETER.', 'الزر الأساسي والثانوي: إجراء رئيسي واحد، والبقية أهدأ.'],
  ghost: ['GHOST BUTTON.', 'TEXT ONLY, NO FILL, NO BORDER.', 'الزر الشفاف: نص فقط بلا خلفية ولا إطار.'],
  badge: ['BADGE.', 'A SMALL COUNT OR STATUS ON AN ICON.', 'الشارة: رقم أو حالة صغيرة على أيقونة.'],
  avatar: ['AVATAR.', 'A PICTURE OR INITIALS FOR A PERSON.', 'الصورة الرمزية: صورة أو أحرف تمثّل الشخص.'],
  chip: ['CHIP / TAG.', 'A SMALL LABEL FOR A CATEGORY.', 'الوسم: تسمية صغيرة لفئة.'],
  progress: ['PROGRESS BAR.', 'HOW MUCH IS DONE.', 'شريط التقدّم: مقدار ما أُنجز.'],
  toggle: ['TOGGLE / SWITCH.', 'ON OR OFF, APPLIED AT ONCE.', 'مفتاح التبديل: تشغيل أو إيقاف فوري.'],
  dropdown: ['DROPDOWN.', 'A LIST THAT OPENS ON CLICK.', 'القائمة المنسدلة: قائمة تُفتح عند النقر.'],
  table: ['TABLE.', 'ROWS AND COLUMNS TO COMPARE DATA.', 'الجدول: صفوف وأعمدة لمقارنة البيانات.'],
  pagination: ['PAGINATION.', 'CONTENT SPLIT INTO PAGES.', 'ترقيم الصفحات: محتوى مقسّم إلى صفحات.'],
  tooltip: ['TOOLTIP.', 'A SHORT HINT ON HOVER.', 'تلميح الأداة: شرح قصير عند التمرير.'],
  popover: ['POPOVER.', 'OPENS ON CLICK, CAN HOLD ACTIONS.', 'النافذة العائمة: تُفتح بالنقر وقد تضم إجراءات.'],
  modal: ['MODAL / DIALOG.', 'A WINDOW THAT BLOCKS THE PAGE.', 'النافذة المنبثقة: نافذة تحجب الصفحة حتى ترد.'],
  toast: ['TOAST / SNACKBAR.', 'A SHORT MESSAGE THAT DISAPPEARS.', 'الإشعار المؤقت: رسالة قصيرة تختفي وحدها.'],
  drawer: ['DRAWER / SLIDE-OVER.', 'A PANEL THAT SLIDES FROM THE EDGE.', 'الدرج الجانبي: لوحة تنزلق من طرف الشاشة.'],
  skeleton: ['SKELETON SCREEN.', 'GREY SHAPES WHILE CONTENT LOADS.', 'الهيكل المؤقت: أشكال رمادية أثناء التحميل.'],
  hero: ['HERO SECTION.', 'THE BIG FIRST BLOCK OF A PAGE.', 'القسم الرئيسي: أول جزء كبير في الصفحة.'],
  cta: ['CTA.', 'CALL TO ACTION: THE BUTTON YOU WANT CLICKED.', 'زر الدعوة إلى الإجراء: الزر الذي تريد النقر عليه.'],
  cards: ['CARD GRID.', 'REPEATED CARDS, SAME LAYOUT.', 'شبكة البطاقات: بطاقات متكررة بالتخطيط نفسه.'],
  carousel: ['CAROUSEL.', 'SLIDES YOU BROWSE ONE BY ONE.', 'العرض الدوّار: شرائح تتصفحها واحدة تلو الأخرى.'],
  accordion: ['ACCORDION.', 'SECTIONS THAT EXPAND AND COLLAPSE.', 'القائمة القابلة للطي: أقسام تُفتح وتُغلق.'],
  footer: ['FOOTER.', 'THE BOTTOM: LINKS, LEGAL, CONTACT.', 'التذييل: أسفل الصفحة للروابط والمعلومات القانونية.'],
  field: ['TEXT FIELD / INPUT.', 'WHERE THE USER TYPES.', 'حقل الإدخال: حيث يكتب المستخدم.'],
  error: ['ERROR MESSAGE.', 'SAYS WHAT IS WRONG, NEXT TO THE FIELD.', 'رسالة الخطأ: توضّح المشكلة بجانب الحقل.'],
  select: ['SELECT / DROPDOWN.', 'PICK ONE OPTION FROM A LIST.', 'القائمة المنسدلة: اختر خيارًا واحدًا من قائمة.'],
  checkbox: ['CHECKBOX.', 'SELECT SEVERAL OPTIONS.', 'مربع الاختيار: اختر عدة خيارات.'],
  radio: ['RADIO BUTTON.', 'SELECT ONLY ONE OPTION.', 'زر الاختيار الواحد: خيار واحد فقط.'],
  toggleF: ['TOGGLE / SWITCH.', 'ON OR OFF, APPLIED AT ONCE.', 'مفتاح التبديل: تشغيل أو إيقاف فوري.'],
  slider: ['SLIDER.', 'DRAG TO CHOOSE A VALUE.', 'شريط التمرير: اسحب لاختيار قيمة.'],
  tabbar: ['TAB BAR.', 'MAIN SECTIONS AT THE BOTTOM OF AN APP.', 'شريط التبويب السفلي: الأقسام الرئيسية أسفل التطبيق.'],
  hamburger: ['HAMBURGER MENU.', 'THREE LINES THAT OPEN A MENU.', 'قائمة الهامبرغر: ثلاثة خطوط تفتح القائمة.'],
  fab: ['FAB.', 'FLOATING ACTION BUTTON: THE MAIN ACTION.', 'زر الإجراء العائم: الإجراء الرئيسي في الشاشة.'],
  sheet: ['BOTTOM SHEET.', 'A PANEL THAT SLIDES UP FROM THE BOTTOM.', 'اللوحة السفلية: لوحة تنزلق من الأسفل.'],
  segmented: ['SEGMENTED CONTROL.', 'A FEW OPTIONS SIDE BY SIDE.', 'أداة التحديد المقسّمة: خيارات قليلة جنبًا إلى جنب.'],
  list: ['LIST.', 'ITEMS STACKED, ONE PER ROW.', 'القائمة: عناصر متتالية، عنصر في كل سطر.'],
};
const UX_TERMS = {
  wmp: [['WIREFRAME, MOCKUP,', 'PROTOTYPE.'], 'STRUCTURE, THEN LOOK, THEN BEHAVIOR.', 'الإطار الشبكي ثم النموذج المرئي ثم النموذج الأولي.', 'TEST THE WIREFRAME BEFORE YOU POLISH COLORS.', 'اختبر الإطار الشبكي قبل أن تهتم بالألوان.'],
  afford: [['AFFORDANCE VS', 'SIGNIFIER.'], 'WHAT YOU CAN DO VS THE CUE THAT SHOWS IT.', 'دلالة الاستخدام والمؤشر: ما يمكنك فعله وما يدلّك عليه.', 'IF IT LOOKS PLAIN, PEOPLE WON’T TRY IT.', 'إن بدا العنصر عاديًا، فلن يجرّبه الناس.'],
  flow: [['USER FLOW VS', 'USER JOURNEY.'], 'ONE TASK IN ONE PRODUCT VS THE WHOLE STORY.', 'مسار المستخدم ورحلة المستخدم: مهمة واحدة مقابل التجربة كاملة.', 'USE FLOWS TO BUILD, JOURNEYS TO UNDERSTAND.', 'المسارات للبناء، والرحلات للفهم.'],
  persona: [['PERSONA.'], 'A FICTIONAL PROFILE BASED ON REAL RESEARCH.', 'الشخصية الافتراضية: ملف خيالي مبني على بحث حقيقي.', 'NO RESEARCH BEHIND IT? IT IS JUST A GUESS.', 'من دون بحث حقيقي، تبقى مجرد تخمين.'],
  ia: [['INFORMATION', 'ARCHITECTURE.'], 'HOW CONTENT IS ORGANIZED AND LABELED.', 'هندسة المعلومات: تنظيم المحتوى وتسميته.', 'USE YOUR USERS’ WORDS, NOT YOUR TEAM’S.', 'استخدم كلمات المستخدمين، لا مصطلحات فريقك.'],
  fitts: [['FITTS’S LAW.'], 'BIGGER AND CLOSER TARGETS ARE FASTER TO HIT.', 'قانون فيتس: الهدف الأكبر والأقرب أسرع وصولًا.', 'MAKE MAIN BUTTONS BIG, ESPECIALLY ON MOBILE.', 'كبّر الأزرار الرئيسية، خصوصًا على الهاتف.'],
  hick: [['HICK’S LAW.'], 'MORE CHOICES, LONGER DECISIONS.', 'قانون هيك: كلما زادت الخيارات طال القرار.', 'GROUP OPTIONS, OR SHOW THE POPULAR ONES FIRST.', 'جمّع الخيارات، أو اعرض الأكثر طلبًا أولًا.'],
  jakob: [['JAKOB’S LAW.'], 'PEOPLE EXPECT YOUR APP TO WORK LIKE OTHERS.', 'قانون ياكوب: يتوقع الناس أن يعمل تطبيقك كغيره.', 'BE ORIGINAL IN STYLE, FAMILIAR IN PATTERNS.', 'كن مبتكرًا في الشكل، ومألوفًا في طريقة الاستخدام.'],
  utest: [['USABILITY TEST.'], 'WATCH REAL PEOPLE TRY REAL TASKS.', 'اختبار قابلية الاستخدام: راقب أشخاصًا حقيقيين يؤدون مهام حقيقية.', 'DON’T HELP THEM. NOTE WHERE THEY STRUGGLE.', 'لا تساعدهم، ودوّن أين يتعثرون.'],
  ab: [['A/B TEST.'], 'TWO VERSIONS, SPLIT TRAFFIC, KEEP THE WINNER.', 'اختبار A/B: نسختان وجمهور مقسّم، ثم تحتفظ بالأفضل.', 'CHANGE ONE THING AT A TIME.', 'غيّر عنصرًا واحدًا في كل مرة.'],
};

export function termsTopic(K, Q, mode) {
  // mode: 'ui' (Short), 'ux' (Short), 'long'
  const UIS = ['navbar', 'sidebar', 'breadcrumb', 'search', 'tabs', 'card', 'buttons', 'badge', 'avatar', 'dropdown', 'toggle', 'tooltip', 'modal', 'toast'];
  const UXS = ['wmp', 'afford', 'flow', 'persona', 'ia', 'fitts', 'hick', 'jakob', 'utest', 'ab'];
  const uiItem = (k, part, len) => { const t = UI_TERMS[k], two = t.length === 4; return { part, len, title: two ? [t[0], t[1]] : [t[0]], en: two ? t[2] : t[1], ar: two ? t[3] : t[2], vig: Q.ui[k] }; };
  const uxItem = (k, part, len) => { const t = UX_TERMS[k]; return { part, len, title: t[0], en: t[1], ar: t[2], tip: t[3], tipAr: t[4], tipAt: 11, vig: Q.ux[k] }; };
  const common = { fonts: ['400 20px Plex', '500 20px Plex', '600 20px Plex'] };
  const AB = '‪A/B‬';
  Object.values(UX_TERMS).forEach((t) => { t[2] = t[2].replace('A/B', AB); });
  if (mode === 'ui') {
    const items = UIS.map((k) => uiItem(k, undefined, 8));
    return { ...common, span: 8, hook: { lines: ['UI ELEMENTS', 'AND THEIR NAMES.'], ar: 'عناصر الواجهة وأسماؤها.', en: `${items.length} TERMS EVERY DESIGNER USES.`, tags: ['Navbar', 'Modal', 'Toast', 'Tabs', 'Badge', 'Card'] }, items, label: (i) => `UI TERM ${String(i + 1).padStart(2, '0')} / ${items.length}`, recap: { title: ['NOW YOU CAN', 'NAME THEM.'], ar: 'الآن تعرف أسماءها.', en: 'NAVBAR · SIDEBAR · TABS · CARD · MODAL · TOAST…', vig: Q.recapUI, len: 8 }, cover: { lines: ['UI ELEMENTS', 'AND THEIR', 'NAMES.'], ar: 'عناصر الواجهة وأسماؤها', art: (ctx, x, y, w, h) => { const s = Math.min(w / 920, h / 800); ctx.save(); ctx.translate(x + (w - 920 * s) / 2, y + 10); ctx.scale(s, s); ctx.translate(-80, -320); Q.screenA(ctx, 0, { tooltip: 1 }); ctx.restore(); } } };
  }
  if (mode === 'ux') {
    const items = UXS.map((k) => uxItem(k, undefined, 11));
    return { ...common, span: 11, hook: { lines: ['UX TERMS', 'IN 60 SECONDS.'], ar: 'مصطلحات تجربة المستخدم في دقيقة واحدة.', en: `${items.length} WORDS YOU WILL HEAR IN EVERY TEAM.`, tags: ['Wireframe', 'Persona', 'Flow', 'Fitts', 'Hick', 'A/B'] }, items, label: (i) => `UX TERM ${String(i + 1).padStart(2, '0')} / ${items.length}`, recap: { title: ['UX TERMS,', 'DECODED.'], ar: 'مصطلحات تجربة المستخدم، بوضوح.', en: 'WIREFRAME · PERSONA · FLOW · FITTS · HICK · JAKOB · A/B', vig: Q.recapUX, len: 8 }, cover: { lines: ['UX TERMS', 'IN 60', 'SECONDS.'], ar: 'مصطلحات تجربة المستخدم', art: (ctx, x, y, w, h) => { const s = Math.min(w / 920, h / 840); ctx.save(); ctx.translate(x + (w - 920 * s) / 2, y + 10); ctx.scale(s, s); ctx.translate(-80, -300); Q.ux.ia.draw(ctx, 8); ctx.restore(); } } };
  }
  // long: 6 UI parts + 2 UX parts
  const P = [
    ['NAVIGATION', 'التنقل', ['navbar', 'sidebar', 'breadcrumb', 'search', 'tabs', 'pagination']],
    ['CONTENT', 'المحتوى', ['hero', 'cta', 'cards', 'carousel', 'accordion', 'footer']],
    ['FORMS', 'النماذج', ['field', 'error', 'select', 'checkbox', 'radio', 'toggleF', 'slider']],
    ['ACTIONS & STATUS', 'الإجراءات والحالات', ['buttons', 'ghost', 'badge', 'chip', 'avatar', 'progress', 'table']],
    ['OVERLAYS & FEEDBACK', 'الطبقات والتنبيهات', ['tooltip', 'popover', 'modal', 'drawer', 'toast', 'skeleton']],
    ['MOBILE', 'الهاتف', ['tabbar', 'hamburger', 'fab', 'sheet', 'segmented']],
  ];
  const items = [];
  P.forEach(([, , ks], pi) => ks.forEach((k) => items.push(uiItem(k, pi, 9))));
  UXS.slice(0, 5).forEach((k) => items.push(uxItem(k, 6, 20)));
  UXS.slice(5).forEach((k) => items.push(uxItem(k, 7, 20)));
  const parts = [...P.map(([en, ar, ks]) => ({ en: `UI · ${en}`, ar: `الواجهة: ${ar}`, count: `${ks.length} TERMS` })), { en: 'UX · PROCESS', ar: 'تجربة المستخدم: العملية', count: '5 TERMS' }, { en: 'UX · LAWS & TESTS', ar: 'تجربة المستخدم: القوانين والاختبارات', count: '5 TERMS' }];
  const nUI = items.filter((x) => x.part < 6).length;
  return { ...common, span: 10, hook: { lines: ['UI & UX TERMS,', 'EXPLAINED VISUALLY.'], ar: 'مصطلحات الواجهة وتجربة المستخدم، بالصور.', en: `${nUI} UI ELEMENTS + 10 UX CONCEPTS.`, tags: ['Navbar', 'Modal', 'Toast', 'Persona', 'Fitts', 'A/B'] }, items, parts, label: (i) => (items[i].part < 6 ? 'UI TERM' : 'UX TERM') + ` · ${parts[items[i].part].en.split('· ')[1]}`, recap: { title: ['UI & UX TERMS,', 'DECODED.'], ar: 'مصطلحات الواجهة وتجربة المستخدم، بوضوح.', en: 'NAVIGATION · CONTENT · FORMS · OVERLAYS · MOBILE · PROCESS · LAWS', vig: Q.recapUI, len: 16 }, cover: { lines: ['UI & UX', 'TERMS,', 'EXPLAINED.'], ar: 'مصطلحات الواجهة وتجربة المستخدم', art: (ctx, x, y, w, h) => { const s = Math.min(w / 920, h / 800); ctx.save(); ctx.translate(x + (w - 920 * s) / 2, y + 10); ctx.scale(s, s); ctx.translate(-80, -320); Q.screenA(ctx, 0, { tooltip: 1 }); ctx.restore(); } } };
}
