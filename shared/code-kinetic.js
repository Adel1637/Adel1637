// "Code for designers" in the kinetic dark-software style: one live vignette per language, a decision
// tree (which language first?) and the HTML / CSS / JS layers. Drawn in the Short's coordinates
// (area x 80..1000, y 280..1150). Each vignette: { draw(ctx, v), hits: [[beat offset, label, sfx, opts]] }.
// All interfaces are fictional; no numbers are invented (charts have no values).
export function makeCodeKinetic(M, K) {
  const { lerp, clamp, E, mix } = M;
  const { F, C, TAU, ez, spr, txt, rr, pill, cursor, fit } = K;
  const SYN = { str: '#B5CEA8', tag: '#569CD6', kw: '#4FC1FF', attr: '#9CDCFE', type: '#4EC9B0', punc: '#8A8A8A', text: '#D4D4D4', com: '#6A9955' };
  const KW = new Set(['function', 'return', 'const', 'await', 'async', 'import', 'as', 'if', 'else', 'true', 'false', 'let']);
  function tokens(line) {
    const re = /("[^"]*"|'[^']*'|<\/?[\w.]+|\/\*.*\*\/|[A-Za-z_][\w]*(?=\s*=[^=>])|[A-Za-z_$][\w$]*|\d+(?:px|dp)?|\s+|[^\sA-Za-z_$\d"']+)/g;
    return (line.match(re) || []).map((t) => {
      let c = SYN.text;
      if (/^["']/.test(t)) c = SYN.str; else if (/^<\/?[\w.]/.test(t)) c = SYN.tag; else if (/^\/\*/.test(t)) c = SYN.com;
      else if (KW.has(t)) c = SYN.kw; else if (/^[A-Z]/.test(t)) c = SYN.type; else if (/^\d/.test(t)) c = SYN.str;
      else if (/^[^\w\s]+$/.test(t)) c = SYN.punc; else if (/^[a-z][\w-]*$/.test(t) && /=/.test(line.slice(line.indexOf(t) + t.length, line.indexOf(t) + t.length + 2))) c = SYN.attr;
      return [t, c];
    });
  }
  // a code editor that types its lines; p 0..1 = share of characters typed
  function codePanel(ctx, x, y, w, h, file, lines, p, size = 26) {
    rr(ctx, x, y, w, h, 16, '#1E1E1E', '#3A3A3A', 2);
    ctx.fillStyle = '#181818'; ctx.beginPath(); ctx.roundRect(x + 1, y + 1, w - 2, 50, [16, 16, 0, 0]); ctx.fill();
    [0, 1, 2].forEach((i) => { ctx.fillStyle = '#3A3A3A'; ctx.beginPath(); ctx.arc(x + 28 + i * 24, y + 26, 7, 0, TAU); ctx.fill(); });
    rr(ctx, x + 110, y + 8, Math.max(160, file.length * 14 + 40), 42, 6, '#1E1E1E'); txt(ctx, file, x + 130, y + 36, 20, { w: 600, family: F.mono, color: SYN.text });
    const total = lines.reduce((a, l) => a + l.length, 0); let left = Math.floor(clamp(p) * total), lastY = y + 100, lastX = x + 70;
    const fs = Math.min(size, ...lines.map((l) => fit(ctx, l, size, w - 110, 600, F.mono)));
    lines.forEach((l, i) => {
      const ly = y + 96 + i * fs * 1.6; txt(ctx, String(i + 1), x + 50, ly, fs * 0.85, { w: 600, family: F.mono, color: '#5A5A5A', align: 'right' });
      let cx = x + 70, n = Math.max(0, Math.min(l.length, left)); left -= l.length;
      tokens(l).forEach(([t, c]) => { if (n <= 0) return; const s = t.slice(0, n); n -= t.length; txt(ctx, s, cx, ly, fs, { w: 600, family: F.mono, color: c }); ctx.font = `600 ${fs}px ${F.mono}`; cx += ctx.measureText(s).width; });
      if (Math.max(0, Math.min(l.length, left + l.length)) > 0) { lastY = ly; lastX = cx; }
    });
    if (p > 0 && p < 1) { ctx.fillStyle = '#AEAFAD'; ctx.fillRect(lastX + 2, lastY - fs * 0.8, 3, fs); }
  }
  const lineDone = (lines, p, i) => { const total = lines.reduce((a, l) => a + l.length, 0), upto = lines.slice(0, i + 1).reduce((a, l) => a + l.length, 0); return clamp(p) * total >= upto; };
  const lineP = (lines, p, i) => { const total = lines.reduce((a, l) => a + l.length, 0), a0 = lines.slice(0, i).reduce((a, l) => a + l.length, 0); return clamp((clamp(p) * total - a0) / lines[i].length); };
  const typeHit = (b, len, n = 18) => [b, 'typing', 'type', { n, len }];
  const CODE_Y = 300, CODE_H = 330, PV_Y = 670, PV_H = 470;
  const B = 60 / 128;

  // ---------------------------------------------------------------- frames
  function browser(ctx, x, y, w, h, url = 'studio.example') {
    rr(ctx, x, y, w, h, 16, '#FFFFFF');
    ctx.fillStyle = '#ECECEC'; ctx.beginPath(); ctx.roundRect(x, y, w, 54, [16, 16, 0, 0]); ctx.fill();
    rr(ctx, x + 90, y + 12, w - 120, 32, 16, '#FFFFFF'); txt(ctx, url, x + 112, y + 35, 18, { w: 600, family: F.mono, color: '#666' });
    [0, 1, 2].forEach((i) => { ctx.fillStyle = '#C9C9C9'; ctx.beginPath(); ctx.arc(x + 24 + i * 20, y + 27, 6, 0, TAU); ctx.fill(); });
  }
  function phone(ctx, cx, cy, w, h, kind) {
    rr(ctx, cx - w / 2 - 12, cy - h / 2 - 12, w + 24, h + 24, 54, '#0A0A0A', '#3A3A3A', 2);
    rr(ctx, cx - w / 2, cy - h / 2, w, h, 44, kind === 'ios' ? '#F2F2F7' : '#F7F9FC');
    if (kind === 'ios') rr(ctx, cx - 50, cy - h / 2 + 12, 100, 28, 14, '#0A0A0A'); else { ctx.fillStyle = '#0A0A0A'; ctx.beginPath(); ctx.arc(cx, cy - h / 2 + 24, 9, 0, TAU); ctx.fill(); }
  }
  function toggle(ctx, x, y, on, kind) {
    if (kind === 'ios') { rr(ctx, x, y, 76, 46, 23, mix('#E5E5EA', '#34C759', on)); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(x + lerp(23, 53, on), y + 23, 19, 0, TAU); ctx.fill(); }
    else { rr(ctx, x, y + 4, 80, 40, 20, mix('#E1E2EC', '#0B57D0', on), mix('#757780', '#0B57D0', on), 2); ctx.fillStyle = mix('#757780', '#FFFFFF', on); ctx.beginPath(); ctx.arc(x + lerp(22, 58, on), y + 24, lerp(10, 15, on), 0, TAU); ctx.fill(); }
  }
  function appUI(ctx, cx, top, w, kind, on, joined, s = 1) {
    ctx.save(); ctx.translate(cx, top); ctx.scale(s, s);
    const x = -w / 2 + 28;
    txt(ctx, 'Design review', x, 90, 34, { color: '#111' }); txt(ctx, 'Thursday · Studio', x, 128, 22, { w: 700, color: '#6B6B6B' });
    rr(ctx, x - 8, 160, w - 40, 76, kind === 'ios' ? 14 : 18, '#FFFFFF'); txt(ctx, 'Remind me', x + 12, 207, 24, { color: '#111' }); toggle(ctx, w / 2 - 120, 175, on, kind);
    const bw = w - 56, bh = kind === 'ios' ? 64 : 60;
    rr(ctx, x, 270, bw, bh, kind === 'ios' ? 14 : 30, joined ? (kind === 'ios' ? '#34C759' : '#146C2E') : (kind === 'ios' ? '#0A84FF' : '#0B57D0'));
    txt(ctx, joined ? 'Joined ✓' : 'Join', 0, 270 + bh / 2 + 9, 26, { color: '#FFFFFF', align: 'center' });
    ctx.restore();
  }

  // ---------------------------------------------------------------- languages
  const L_HTML = ['<form>', '  <label for="email">Email</label>', '  <input id="email" type="email">', '  <button>Sign up</button>', '</form>'];
  const html = {
    draw(ctx, v) {
      const p = ez(v, 2.8, 7.4, (q) => q);
      if (v >= 2.6) codePanel(ctx, 80, CODE_Y, 920, CODE_H, 'form.html', L_HTML, p);
      const bp = spr(v, 2.6, { stiffness: 200, damping: 16 }); if (bp <= 0) return;
      ctx.save(); ctx.globalAlpha = Math.min(1, bp); browser(ctx, 80, PV_Y, 920, PV_H);
      [1, 2, 3].forEach((i) => {
        const s = lineDone(L_HTML, p, i) ? spr(v, 2.8 + 4.6 * ([12, 46, 76][i - 1] / 100), { stiffness: 300, damping: 14 }) : 0; if (s <= 0) return;
        ctx.save(); ctx.globalAlpha *= Math.min(1, s);
        if (i === 1) txt(ctx, 'Email', 140, PV_Y + 130, 30, { color: '#222' });
        if (i === 2) rr(ctx, 140, PV_Y + 160, 600, 70, 10, '#FFFFFF', '#9A9A9A', 2);
        if (i === 3) { rr(ctx, 140, PV_Y + 270, 220, 70, 10, '#1A73E8'); txt(ctx, 'Sign up', 250, PV_Y + 314, 28, { color: '#FFFFFF', align: 'center' }); }
        ctx.restore();
      });
      ctx.restore();
      const sr = spr(v, 9, { stiffness: 260, damping: 15 });
      if (sr > 0) { ctx.save(); ctx.translate(700, PV_Y + 390); ctx.scale(sr, sr); rr(ctx, -270, -36, 540, 72, 36, '#161616'); txt(ctx, 'Screen reader: "Email, edit text"', 0, 9, 24, { w: 600, family: F.mono, color: '#FFFFFF', align: 'center' }); ctx.restore(); ctx.strokeStyle = C.sel; ctx.lineWidth = 4; ctx.globalAlpha = Math.min(1, sr); rr(ctx, 134, PV_Y + 154, 612, 82, 12, null, C.sel, 4); ctx.globalAlpha = 1; }
    },
    hits: [[2.6, 'editor', 'thud', { pitch: 'E2' }], typeHit(2.8, 4.4, 20), [4.0, 'label', 'pop', { pitch: 'C6' }], [5.6, 'input', 'pop', { pitch: 'E6' }], [6.9, 'button', 'pop', { pitch: 'G6' }], [9, 'screen reader', 'bell', { pitch: 'E6' }]],
  };
  const L_CSS = ['.card {', '  padding: 32px;', '  gap: 20px;', '  border-radius: 20px;', '  max-width: 480px;', '}'];
  const css = {
    draw(ctx, v) {
      const p = ez(v, 2.8, 8, (q) => q);
      if (v >= 2.6) codePanel(ctx, 80, CODE_Y, 920, CODE_H, 'card.css', L_CSS, p);
      const bp = spr(v, 2.6, { stiffness: 200, damping: 16 }); if (bp <= 0) return;
      const at = (i) => (lineDone(L_CSS, p, i) ? Math.min(1.08, spr(v, 2.8 + 5.2 * (L_CSS.slice(0, i + 1).join('').length / L_CSS.join('').length), { stiffness: 220, damping: 12 })) : 0);
      const pad = lerp(6, 32, at(1)), gap = lerp(2, 20, at(2)), rad = lerp(0, 20, at(3)), w = lerp(880, 480, at(4));
      ctx.save(); ctx.globalAlpha = Math.min(1, bp);
      const x = 540 - w / 2, y = PV_Y + 30, h = 80 + pad * 2 + gap * 3 + 120;
      rr(ctx, x, y, w, h, rad, '#FFFFFF');
      let yy = y + pad; rr(ctx, x + pad, yy, 64, 64, 32, '#DCE6F5'); yy += 64 + gap;
      txt(ctx, 'Design review', x + pad, yy + 26, 30, { color: '#111' }); yy += 30 + gap;
      rr(ctx, x + pad, yy, (w - pad * 2) * 0.8, 12, 6, '#C9C9C9'); yy += 12 + gap;
      rr(ctx, x + pad, yy, 160, 52, Math.min(12, rad), '#1A73E8'); txt(ctx, 'Join', x + pad + 80, yy + 34, 24, { color: '#FFFFFF', align: 'center' });
      ctx.restore();
    },
    hits: [[2.6, 'editor', 'thud', { pitch: 'E2' }], typeHit(2.8, 5.2, 24), [4.4, 'padding', 'boing', { pitch: 'C4', to: 'E4' }], [5.4, 'gap', 'pop', { pitch: 'E5' }], [6.6, 'radius', 'pop', { pitch: 'G5' }], [7.8, 'max-width', 'boing', { pitch: 'G4', to: 'C4' }]],
  };
  const L_JS = ['button.onclick = async () => {', '  button.state = "loading";', '  await save();', '  button.state = "success";', '};'];
  const js = {
    draw(ctx, v) {
      const p = ez(v, 2.8, 7.2, (q) => q);
      if (v >= 2.6) codePanel(ctx, 80, CODE_Y, 920, CODE_H, 'save.js', L_JS, p);
      const bp = spr(v, 2.6, { stiffness: 200, damping: 16 }); if (bp <= 0) return;
      ctx.save(); ctx.globalAlpha = Math.min(1, bp); rr(ctx, 80, PV_Y, 920, PV_H, 20, '#FFFFFF');
      const st = v < 8.2 ? 0 : v < 10 ? 1 : 2, pop = st === 2 ? spr(v, 10, { stiffness: 320, damping: 11 }) : 1;
      ctx.save(); ctx.translate(540, PV_Y + 220); ctx.scale(st === 2 ? pop : 1, st === 2 ? pop : 1);
      rr(ctx, -200, -50, 400, 100, 16, st === 2 ? C.green : '#1A73E8');
      if (st === 1) { ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(-110, 0, 18, v * 6, v * 6 + 4.4); ctx.stroke(); }
      txt(ctx, ['Save', 'Saving…', 'Saved ✓'][st], st === 1 ? 20 : 0, 13, 36, { color: '#FFFFFF', align: 'center' });
      ctx.restore();
      ['IDLE', 'LOADING', 'SUCCESS'].forEach((s, i) => { const on = i === st; rr(ctx, 210 + i * 230, PV_Y + 360, 200, 50, 25, on ? '#161616' : '#EFEFEF'); txt(ctx, s, 310 + i * 230, PV_Y + 393, 20, { w: 600, family: F.mono, color: on ? '#FFFFFF' : '#888', align: 'center' }); });
      ctx.restore();
      if (v >= 7.4 && v < 8.6) cursor(ctx, lerp(820, 600, ez(v, 7.4, 8.1, E.inOutCubic)), lerp(PV_Y + 420, PV_Y + 240, ez(v, 7.4, 8.1, E.inOutCubic)));
    },
    hits: [[2.6, 'editor', 'thud', { pitch: 'E2' }], typeHit(2.8, 4.2, 20), [8.2, 'click', 'click'], [8.3, 'loading', 'riser', { len: 0.8 }], [10, 'success', 'bell', { pitch: 'E6' }]],
  };
  const L_REACT = ['const [joined, setJoined] = useState(false);', 'return (', '  <button onClick={() => setJoined(true)}>', '    {joined ? "Joined" : "Join"}', '  </button>', ');'];
  const react = {
    draw(ctx, v) {
      const p = ez(v, 2.8, 8, (q) => q);
      if (v >= 2.6) codePanel(ctx, 80, CODE_Y, 920, CODE_H, 'Card.tsx', L_REACT, p, 24);
      const bp = spr(v, 2.6, { stiffness: 200, damping: 16 }); if (bp <= 0) return;
      ctx.save(); ctx.globalAlpha = Math.min(1, bp); browser(ctx, 80, PV_Y, 920, PV_H);
      rr(ctx, 260, PV_Y + 100, 560, 300, 20, '#F4F6F8');
      txt(ctx, 'Design review', 300, PV_Y + 170, 36, { color: '#111' }); txt(ctx, 'Thursday · Studio', 300, PV_Y + 212, 24, { w: 700, color: '#6B6B6B' });
      const j = v >= 9.2, s = j ? spr(v, 9.2, { stiffness: 320, damping: 11 }) : 1;
      ctx.save(); ctx.translate(410, PV_Y + 310); ctx.scale(s, s); rr(ctx, -110, -38, 220, 76, 38, j ? C.green : '#1A73E8'); txt(ctx, j ? 'Joined ✓' : 'Join', 0, 10, 28, { color: '#FFFFFF', align: 'center' }); ctx.restore();
      txt(ctx, `joined = ${j}`, 790, PV_Y + 430, 22, { w: 600, family: F.mono, color: j ? C.green : '#888', align: 'right' });
      ctx.restore();
      if (v >= 8.2 && v < 9.6) cursor(ctx, lerp(760, 440, ez(v, 8.2, 9, E.inOutCubic)), lerp(PV_Y + 440, PV_Y + 320, ez(v, 8.2, 9, E.inOutCubic)));
    },
    hits: [[2.6, 'editor', 'thud', { pitch: 'E2' }], typeHit(2.8, 5.2, 24), [9.2, 'state', 'click'], [9.3, 'joined', 'bell', { pitch: 'E6' }]],
  };
  const native = (file, lines, kind) => ({
    draw(ctx, v) {
      const p = ez(v, 2.8, 7.6, (q) => q);
      if (v >= 2.6) codePanel(ctx, 80, CODE_Y, 920, CODE_H, file, lines, p, 24);
      const bp = spr(v, 2.6, { stiffness: 200, damping: 16 }); if (bp <= 0) return;
      ctx.save(); ctx.globalAlpha = Math.min(1, bp);
      phone(ctx, 540, PV_Y + 250, 400, 470, kind);
      ctx.save(); ctx.beginPath(); ctx.roundRect(340, PV_Y + 15, 400, 470, 44); ctx.clip();
      appUI(ctx, 540, PV_Y + 30, 400, kind, ez(v, 8.6, 9.2, E.inOutCubic), v >= 10.2, 1);
      ctx.restore(); ctx.restore();
      if (v >= 8 && v < 10.6) { const m = ez(v, 8, 8.6, E.inOutCubic), m2 = ez(v, 9.4, 10.1, E.inOutCubic); cursor(ctx, lerp(lerp(860, 650, m), 560, m2), lerp(lerp(PV_Y + 470, PV_Y + 235, m), PV_Y + 340, m2)); }
    },
    hits: [[2.6, 'editor', 'thud', { pitch: 'E2' }], typeHit(2.8, 4.8, 22), [8.6, 'toggle', 'click'], [10.2, 'join', 'pop', { pitch: 'C6' }], [10.3, 'joined', 'bell', { pitch: 'E6' }]],
  });
  const swift = native('Card.swift', ['VStack(alignment: .leading) {', '  Text("Design review").font(.headline)', '  Toggle("Remind me", isOn: $remind)', '  Button("Join") { join() }', '}'], 'ios');
  const kotlin = native('Card.kt', ['Column(Modifier.padding(24.dp)) {', '  Text("Design review")', '  Switch(checked = remind, onCheckedChange = { remind = it })', '  Button(onClick = { join() }) { Text("Join") }', '}'], 'android');
  const L_FLUTTER = ['Column(children: [', "  Text('Design review'),", '  Switch(value: remind, onChanged: toggle),', "  FilledButton(onPressed: join, child: Text('Join')),", '])'];
  const twoPhones = (file, lines, alt) => ({
    draw(ctx, v) {
      const swap = alt && v >= 8.6, p = swap ? ez(v, 8.8, 10.6, (q) => q) : ez(v, 2.8, 7.6, (q) => q);
      if (v >= 2.6) codePanel(ctx, 80, CODE_Y, 920, CODE_H, swap ? alt.file : file, swap ? alt.lines : lines, p, 24);
      const bp = spr(v, 2.6, { stiffness: 200, damping: 16 }); if (bp <= 0) return;
      ctx.save(); ctx.globalAlpha = Math.min(1, bp);
      [['ios', 300, 'iPhone'], ['android', 780, 'Android']].forEach(([k, cx, lab], i) => {
        const on = alt ? (i === 0 ? ez(v, 7.8, 8.3) : ez(v, 10.8, 11.3)) : ez(v, 8.6, 9.2, E.inOutCubic);
        phone(ctx, cx, PV_Y + 215, 330, 400, k);
        ctx.save(); ctx.beginPath(); ctx.roundRect(cx - 165, PV_Y + 15, 330, 400, 44); ctx.clip(); appUI(ctx, cx, PV_Y + 20, 400, k, on, false, 0.82); ctx.restore();
        txt(ctx, lab, cx, PV_Y + 462, 24, { w: 600, family: F.mono, color: C.sub, align: 'center' });
      });
      ctx.restore();
    },
    hits: alt ? [[2.6, 'editor', 'thud', { pitch: 'E2' }], typeHit(2.8, 4.8, 18), [7.8, 'ios toggle', 'click'], [8.6, 'tab', 'whoosh', { len: 0.3 }], typeHit(8.8, 1.8, 12), [10.8, 'android toggle', 'click']]
      : [[2.6, 'editor', 'thud', { pitch: 'E2' }], typeHit(2.8, 4.8, 22), [8.6, 'both toggles', 'click'], [8.7, 'same code', 'bell', { pitch: 'E6' }]],
  });
  const flutter = twoPhones('card.dart', L_FLUTTER);
  const nativeBoth = twoPhones('Profile.swift', ['Toggle("Remind me", isOn: $remind)', 'Button("Join") { join() }'], { file: 'Profile.kt', lines: ['Switch(checked = remind, onCheckedChange = { remind = it })', 'Button(onClick = { join() }) { Text("Join") }'] });
  const L_PY = ['import pandas as pd', 'answers = pd.read_csv("survey.csv")', 'answers["ease"].value_counts().plot.bar()'];
  const python = {
    draw(ctx, v) {
      const p = ez(v, 2.8, 6.6, (q) => q);
      if (v >= 2.6) codePanel(ctx, 80, CODE_Y, 920, CODE_H, 'survey.py', L_PY, p);
      const bp = spr(v, 2.6, { stiffness: 200, damping: 16 }); if (bp <= 0) return;
      ctx.save(); ctx.globalAlpha = Math.min(1, bp); rr(ctx, 80, PV_Y, 920, PV_H, 20, '#FFFFFF');
      txt(ctx, 'How easy was sign-up?', 130, PV_Y + 70, 32, { color: '#111' });
      [['Easy', 0.45], ['OK', 0.7], ['Hard', 0.95]].forEach(([lab, hgt], i) => {
        const s = spr(v, 7 + i * 0.4, { stiffness: 200, damping: 13 }), bh = 280 * hgt * s, bx = 200 + i * 240;
        rr(ctx, bx, PV_Y + 400 - bh, 160, bh, 10, i === 2 && v >= 9.6 ? C.red : '#1A73E8');
        txt(ctx, lab, bx + 80, PV_Y + 440, 26, { w: 700, color: '#333', align: 'center' });
      });
      ctx.restore();
      pill(ctx, 'Fix this first', 760, PV_Y + 90, spr(v, 9.6, { stiffness: 300, damping: 12 }), C.red, 26);
    },
    hits: [[2.6, 'editor', 'thud', { pitch: 'E2' }], typeHit(2.8, 3.8, 18), [7, 'bar', 'pop', { pitch: 'C5' }], [7.4, 'bar', 'pop', { pitch: 'E5' }], [7.8, 'bar', 'pop', { pitch: 'G5' }], [9.6, 'insight', 'bell', { pitch: 'E6' }]],
  };

  // ---------------------------------------------------------------- ranking rows (recaps)
  function rank(rows, hi = 0) {
    return {
      draw(ctx, v) {
        rows.forEach(([a, b], i) => {
          const s = spr(v, 1.2 + i * 0.4, { stiffness: 210, damping: 15 }); if (s <= 0) return;
          const y = 320 + i * 150, x = lerp(i % 2 ? 1100 : -1000, 80, Math.min(1.02, s));
          rr(ctx, x, y, 920, 124, 18, i === hi ? C.sel : '#262626');
          txt(ctx, `0${i + 1}`, x + 36, y + 76, 30, { w: 600, family: F.mono, color: i === hi ? '#FFFFFF' : C.sub });
          txt(ctx, a, x + 120, y + 78, fit(ctx, a, 44, 400), { color: '#FFFFFF' });
          if (b) txt(ctx, b, x + 890, y + 76, fit(ctx, b, 30, 340, 600, F.mono), { w: 600, family: F.mono, color: i === hi ? '#FFFFFF' : C.sub, align: 'right' });
        });
      },
      hits: rows.map((_, i) => [1.2 + i * 0.4, `row ${i}`, 'whoosh', { len: 0.25 }]),
    };
  }

  // ---------------------------------------------------------------- decision tree (which language first?)
  const PATHS = [['Website', 'HTML · CSS · JS'], ['iPhone app', 'Swift'], ['Android app', 'Kotlin'], ['Both', 'Flutter'], ['Research', 'Python']];
  function tree(hi = -1) {
    return {
      draw(ctx, v) {
        const rootP = spr(v, hi < 0 ? 2.6 : 0.2, { stiffness: 240, damping: 15 }); if (rootP <= 0) return;
        const cw = 920 / 5, rx = 540, ry = 360;
        ctx.save(); ctx.translate(rx, ry); ctx.scale(rootP, rootP); rr(ctx, -330, -50, 660, 100, 20, '#FFFFFF'); txt(ctx, 'What do you want to build?', 0, 12, 34, { color: '#111', align: 'center' }); ctx.restore();
        PATHS.forEach(([goal, lang], i) => {
          const cx = 80 + cw * i + cw / 2, t0 = hi < 0 ? 3.6 + i * 0.5 : 0.4, lit = hi < 0 || hi === i || hi === 9;
          const lp = ez(v, t0, t0 + 0.6, E.inOutCubic); if (lp <= 0) return;
          ctx.save(); ctx.globalAlpha = lit ? 1 : 0.28;
          ctx.strokeStyle = lit && hi >= 0 && hi !== 9 ? C.sel : '#5A5A5A'; ctx.lineWidth = 5; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(rx, ry + 50); ctx.bezierCurveTo(rx, ry + 130, cx, ry + 110, lerp(rx, cx, lp), lerp(ry + 50, 600, lp)); ctx.stroke();
          const g = spr(v, t0 + 0.5, { stiffness: 260, damping: 14 });
          if (g > 0) {
            ctx.save(); ctx.translate(cx, 650); ctx.scale(g, g); rr(ctx, -cw / 2 + 8, -50, cw - 16, 100, 16, '#262626', lit && hi >= 0 && hi !== 9 ? C.sel : '#3A3A3A', 3);
            txt(ctx, goal, 0, 10, fit(ctx, goal, 28, cw - 40), { color: '#FFFFFF', align: 'center' }); ctx.restore();
            const lp2 = ez(v, t0 + 0.8, t0 + 1.3, E.inOutCubic); ctx.beginPath(); ctx.moveTo(cx, 700); ctx.lineTo(cx, lerp(700, 830, lp2)); ctx.stroke();
            const l = spr(v, t0 + 1.2, { stiffness: 260, damping: 14 });
            if (l > 0) { ctx.save(); ctx.translate(cx, 900); ctx.scale(l, l); rr(ctx, -cw / 2 + 8, -70, cw - 16, 140, 16, lit && hi >= 0 ? C.sel : '#FFFFFF'); const parts = lang.split(' · '); parts.forEach((pt, k) => txt(ctx, pt, 0, 12 + (k - (parts.length - 1) / 2) * 40, fit(ctx, pt, 32, cw - 40), { color: lit && hi >= 0 ? '#FFFFFF' : '#111', align: 'center' })); ctx.restore(); }
          }
          ctx.restore();
        });
      },
      hits: hi < 0 ? [[2.6, 'root', 'thud', { pitch: 'E2' }], ...PATHS.map((_, i) => [4.1 + i * 0.5, `goal ${i}`, 'pop', { pitch: ['C5', 'D5', 'E5', 'G5', 'A5'][i] }]), ...PATHS.map((_, i) => [4.8 + i * 0.5, `lang ${i}`, 'blip', { pitch: 'A6' }])] : [[0.4, 'path', 'whoosh', { len: 0.3 }]],
    };
  }
  // a path scene: breadcrumb (goal -> language) on top, the language demo below (scaled)
  function path(i, demo) {
    const [goal, lang] = PATHS[i];
    return {
      draw(ctx, v) {
        const g = spr(v, 0.3, { stiffness: 260, damping: 14 }), l = spr(v, 1.0, { stiffness: 260, damping: 14 });
        if (g > 0) { ctx.save(); ctx.translate(250, 330); ctx.scale(g, g); rr(ctx, -170, -40, 340, 80, 40, '#262626', '#3A3A3A', 2); txt(ctx, goal, 0, 11, fit(ctx, goal, 32, 300), { color: '#FFFFFF', align: 'center' }); ctx.restore(); }
        if (l > 0) { ctx.strokeStyle = C.sel; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(440, 330); ctx.lineTo(lerp(440, 560, Math.min(1, l)), 330); ctx.stroke(); ctx.save(); ctx.translate(780, 330); ctx.scale(l, l); rr(ctx, -210, -40, 420, 80, 40, C.sel); txt(ctx, lang, 0, 11, fit(ctx, lang, 32, 380), { color: '#FFFFFF', align: 'center' }); ctx.restore(); }
        ctx.save(); ctx.translate(540, 800); ctx.scale(0.86, 0.86); ctx.translate(-540, -760); demo.draw(ctx, v); ctx.restore();
      },
      hits: [[0.3, 'goal', 'pop', { pitch: 'C5' }], [1.0, 'language', 'pop', { pitch: 'G5' }], ...demo.hits],
    };
  }

  // ---------------------------------------------------------------- HTML / CSS / JS layers on one signup card
  const LAY = {
    html: ['<h2>Join the beta</h2>', '<label for="email">Email</label>', '<input id="email" type="email">', '<button>Sign up</button>'],
    css: ['.card { padding: 32px; border-radius: 16px; }', 'h2 { font: 700 32px "Plex", sans-serif; }', 'input { border: 1px solid #D0D5DD; }', 'button { background: #1A73E8; color: white; }'],
    js: ['form.onsubmit = (e) => {', '  e.preventDefault();', '  if (!email.validity.valid) showError();', '  else showSuccess();', '};'],
  };
  function signup(ctx, x, y, w, h, st) {
    // st: { shown 0..4 (html elements), style 0..1 per css line [4], typed '', state 'idle'|'error'|'ok' }
    const s = st.style, card = s[0];
    rr(ctx, x, y, w, h, lerp(0, 16, card), '#FFFFFF');
    const pad = lerp(12, 40, card), font = s[1] > 0.5;
    let yy = y + pad + 36;
    if (st.shown > 0) txt(ctx, 'Join the beta', x + pad, yy, font ? 36 : 34, { w: font ? 700 : 700, family: font ? F.title : F.serif, color: '#111' });
    yy += lerp(30, 50, card);
    if (st.shown > 1) txt(ctx, 'Email', x + pad, yy, font ? 22 : 24, { w: font ? 700 : 400, family: font ? F.title : F.serif, color: font ? '#444' : '#111' });
    yy += lerp(12, 18, card);
    if (st.shown > 2) {
      const iw = lerp(300, w - pad * 2, card), err = st.state === 'error';
      rr(ctx, x + pad, yy, iw, lerp(36, 60, s[2]), lerp(0, 10, s[2]), '#FFFFFF', err ? C.red : mix('#767676', '#D0D5DD', s[2]), lerp(2, 2, s[2]));
      if (st.typed) txt(ctx, st.typed, x + pad + 16, yy + lerp(26, 39, s[2]), lerp(20, 24, s[2]), { w: 700, family: font ? F.title : F.serif, color: '#111' });
      yy += lerp(36, 60, s[2]) + lerp(10, 22, card);
      if (err) { txt(ctx, '✕  Enter a valid email.', x + pad, yy + 8, 22, { color: C.red }); yy += 34; }
    }
    if (st.shown > 3) {
      const bw = lerp(90, w - pad * 2, s[3]), bh = lerp(34, 60, s[3]), ok = st.state === 'ok';
      rr(ctx, x + pad, yy, bw, bh, lerp(3, 10, s[3]), ok ? C.green : mix('#EFEFEF', '#1A73E8', s[3]), s[3] < 0.5 ? '#767676' : null, 1.5);
      txt(ctx, ok ? "You're in ✓" : 'Sign up', x + pad + bw / 2, yy + bh / 2 + 8, lerp(18, 24, s[3]), { w: 700, family: s[3] > 0.5 ? F.title : F.serif, color: ok || s[3] > 0.5 ? '#FFFFFF' : '#111', align: 'center' });
    }
  }
  function layer(stage) {
    const lines = LAY[stage], file = { html: 'signup.html', css: 'style.css', js: 'app.js' }[stage];
    return {
      draw(ctx, v) {
        const p = ez(v, 2.8, stage === 'js' ? 6.6 : 7.6, (q) => q);
        if (v >= 2.6) codePanel(ctx, 80, CODE_Y, 920, CODE_H, file, lines, p, 24);
        const bp = spr(v, 2.6, { stiffness: 200, damping: 16 }); if (bp <= 0) return;
        const st = { shown: 4, style: [1, 1, 1, 1], typed: '', state: 'idle' };
        if (stage === 'html') { st.shown = [0, 1, 2, 3].filter((i) => lineDone(lines, p, i)).length; st.style = [0, 0, 0, 0]; }
        if (stage === 'css') st.style = [0, 1, 2, 3].map((i) => (lineDone(lines, p, i) ? Math.min(1, spr(v, 2.8 + 4.8 * ((i + 1) / 4), { stiffness: 220, damping: 14 })) : 0));
        if (stage === 'js') {
          const t1 = 'sara@', t2 = 'sara@mail.com';
          if (v >= 7) st.typed = t1.slice(0, Math.ceil(ez(v, 7, 7.8, (q) => q) * t1.length));
          if (v >= 8.4) st.state = 'error';
          if (v >= 9.4) { st.typed = t2.slice(0, Math.max(t1.length, Math.ceil(ez(v, 9.4, 10.4, (q) => q) * t2.length))); st.state = 'idle'; }
          if (v >= 11) st.state = 'ok';
        }
        ctx.save(); ctx.globalAlpha = Math.min(1, bp); browser(ctx, 80, PV_Y, 920, PV_H, 'beta.example');
        signup(ctx, 250, PV_Y + 80, 580, 370, st); ctx.restore();
        if (stage === 'js' && v >= 7.8 && v < 11.4) { const m = v < 8.4 ? ez(v, 7.8, 8.3) : ez(v, 10.4, 11); cursor(ctx, lerp(760, 560, m), lerp(PV_Y + 470, PV_Y + 360, m)); }
      },
      hits: stage === 'html' ? [[2.6, 'editor', 'thud', { pitch: 'E2' }], typeHit(2.8, 4.8, 22), [3.8, 'h2', 'pop', { pitch: 'C5' }], [4.9, 'label', 'pop', { pitch: 'E5' }], [6.3, 'input', 'pop', { pitch: 'G5' }], [7.5, 'button', 'pop', { pitch: 'C6' }]]
        : stage === 'css' ? [[2.6, 'editor', 'thud', { pitch: 'E2' }], typeHit(2.8, 4.8, 24), [4.0, 'card', 'boing', { pitch: 'C4', to: 'E4' }], [5.2, 'font', 'whoosh', { len: 0.3 }], [6.4, 'input', 'pop', { pitch: 'E5' }], [7.6, 'button', 'pop', { pitch: 'G5' }]]
          : [[2.6, 'editor', 'thud', { pitch: 'E2' }], typeHit(2.8, 3.8, 18), typeHit(7, 0.8, 5), [8.4, 'error', 'thud', { pitch: 'C2' }], typeHit(9.4, 1, 8), [11, 'success', 'bell', { pitch: 'E6' }]],
    };
  }
  // the three layers pulled apart (structure, style, behavior)
  const layers3 = {
    draw(ctx, v) {
      const L3 = [['HTML', 'STRUCTURE', 'الهيكل', '#3A3A3A'], ['CSS', 'STYLE', 'الشكل', '#1A73E8'], ['JS', 'BEHAVIOR', 'السلوك', C.green]];
      L3.forEach(([n, en, ar, col], i) => {
        const s = spr(v, 1.4 + i * 0.6, { stiffness: 200, damping: 13 }); if (s <= 0) return;
        const y = lerp(700, 420 + i * 230, Math.min(1.04, s));
        ctx.save(); ctx.translate(430, y); ctx.transform(1, 0, -0.5, 0.5, 0, 0);
        rr(ctx, -260, -200, 520, 400, 30, i === 0 ? '#F2F2F2' : i === 1 ? 'rgba(26,115,232,0.85)' : 'rgba(48,164,108,0.85)', '#FFFFFF', 4);
        ctx.restore();
        txt(ctx, n, 760, y - 10, 46, { color: '#FFFFFF', alpha: Math.min(1, s) });
        txt(ctx, en, 760, y + 30, 24, { w: 600, family: F.mono, color: C.sub, alpha: Math.min(1, s) });
        txt(ctx, ar, 1000, y + 30, 32, { family: F.ar, align: 'right', rtl: true, alpha: Math.min(1, s) });
      });
      const a = ez(v, 4.4, 5.2);
      if (a > 0) { txt(ctx, 'WALLS · PAINT · ELECTRICITY', 540, 1100, 30, { w: 600, family: F.mono, align: 'center', alpha: a }); txt(ctx, 'الجدران · الطلاء · الكهرباء', 540, 1150, 36, { family: F.ar, align: 'center', rtl: true, alpha: a }); }
    },
    hits: [[1.4, 'html layer', 'thud', { pitch: 'C3' }], [2.0, 'css layer', 'thud', { pitch: 'E3' }], [2.6, 'js layer', 'thud', { pitch: 'G3' }], [4.4, 'analogy', 'bell', { pitch: 'E6' }]],
  };

  return { html, css, js, react, swift, kotlin, flutter, nativeBoth, python, rank, tree, path, layer, layers3, codePanel, PATHS };
}
