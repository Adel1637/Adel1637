// AG Studio sound palette: physically modelled, all tuned to one key (D major pentatonic), with a
// 3-note signature at the start and on the end page. Replaces the generic motion-reel SFX.
//   node shared/sfx-ag.mjs <film>      -> <film>/audio/sfx.wav   (same hit list as before)
//   node shared/sfx-ag.mjs --demo out.wav   a short sampler of the palette
// The film's HITS keep their names (click, thud, whoosh, ...); they are mapped here to the new sounds.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const SR = 48000, TAU = Math.PI * 2, STEM = 0.4;
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
let rnd = mulberry32(1);
const gauss = () => { const u = Math.max(rnd(), 1e-12), v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); };
const NOTES = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
const midiOf = (p) => { if (typeof p === 'number') return 69 + 12 * Math.log2(p / 440); const m = /^([A-G][#b]?)(-?\d)$/.exec(p); return NOTES[m[1]] + 12 * (Number(m[2]) + 1); };
const fromMidi = (m) => 440 * 2 ** ((m - 69) / 12);
const SCALE = [2, 4, 6, 9, 11];                                    // D E F# A B
function snap(p) { const m = Math.round(midiOf(p)); for (let d = 0; d < 7; d++) for (const s of [m + d, m - d]) if (SCALE.includes(((s % 12) + 12) % 12)) return fromMidi(s); return fromMidi(m); }
const buf = (s) => new Float32Array(Math.max(1, Math.round(s * SR)));
class Biquad {
  constructor(kind, f, q = 0.707) { this.kind = kind; this.x1 = this.x2 = this.y1 = this.y2 = 0; this.set(f, q); }
  set(f, q = this.q) {
    this.q = q; const w = TAU * Math.min(Math.max(f, 20), SR * 0.45) / SR, c = Math.cos(w), al = Math.sin(w) / (2 * q); let b0, b1, b2;
    if (this.kind === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; } else if (this.kind === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; } else { b0 = al; b1 = 0; b2 = -al; }
    const a0 = 1 + al; [this.b0, this.b1, this.b2, this.a1, this.a2] = [b0 / a0, b1 / a0, b2 / a0, (-2 * c) / a0, (1 - al) / a0];
  }
  tick(x) { const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2; this.x2 = this.x1; this.x1 = x; this.y2 = this.y1; this.y1 = y; return y; }
}
const filt = (x, k, f, q) => { const b = new Biquad(k, f, q); for (let i = 0; i < x.length; i++) x[i] = b.tick(x[i]); return x; };
const add = (d, s, g = 1, at = 0) => { for (let i = 0; i < s.length && at + i < d.length; i++) if (at + i >= 0) d[at + i] += g * s[i]; return d; };
const norm = (x, peak = 1) => { let m = 0; for (const v of x) m = Math.max(m, Math.abs(v)); if (m > 0) for (let i = 0; i < x.length; i++) x[i] *= peak / m; return x; };
const fadeOut = (x, sec = 0.01) => { const n = Math.round(sec * SR); for (let i = 0; i < n && i < x.length; i++) x[x.length - 1 - i] *= i / n; return x; };

// ---------------------------------------------------------------- the palette
// wooden bar (modal): a short tuned tap
function tap(o = {}) {
  const f = snap(o.pitch || 'A6'), x = buf(0.14);
  [[1, 1, 0.03], [2.76, 0.45, 0.018], [5.4, 0.22, 0.01]].forEach(([r, a, tau]) => { for (let i = 0; i < x.length; i++) { const t = i / SR; x[i] += a * Math.sin(TAU * f * r * t) * Math.exp(-t / tau); } });
  const c = filt(Float32Array.from({ length: Math.round(0.002 * SR) }, () => gauss()), 'hp', 3000); add(x, c, 0.35);
  return norm(x, 1);
}
// mechanical keyboard: switch click, then the key bottoming out
function key(o = {}) {
  const n = o.n || 12, len = o.len || 1, x = buf(len + 0.08);
  for (let k = 0; k < n; k++) {
    const at = Math.round(((k + 0.15 + rnd() * 0.5) / n) * len * SR), g = 0.6 + rnd() * 0.4;
    const click = filt(Float32Array.from({ length: Math.round(0.0025 * SR) }, () => gauss()), 'bp', 3500 + rnd() * 1500, 1.2);
    add(x, click, 0.7 * g, at);
    const th = buf(0.04), f0 = 170 + rnd() * 70;
    for (let i = 0; i < th.length; i++) { const t = i / SR; th[i] = Math.sin(TAU * f0 * t) * Math.exp(-t / 0.012) + 0.3 * gauss() * Math.exp(-t / 0.004); }
    add(x, filt(th, 'lp', 1800), 0.8 * g, at + Math.round(0.008 * SR));
  }
  return norm(x, 0.9);
}
// glass: tuned, slightly detuned partials, soft attack, long tail
function glass(o = {}) {
  const f = snap(o.pitch || 'A5'), len = o.len || 1.6, x = buf(len);
  [[1, 1, 0.9], [1.003, 0.6, 0.85], [2.0, 0.35, 0.5], [3.01, 0.18, 0.3], [4.2, 0.08, 0.18]].forEach(([r, a, tau]) => {
    for (let i = 0; i < x.length; i++) { const t = i / SR; x[i] += a * Math.sin(TAU * f * r * t) * Math.exp(-t / (tau * len / 1.6)) * (1 - Math.exp(-t / 0.004)); }
  });
  return fadeOut(norm(x, 1), 0.05);
}
// plucked string (Karplus-Strong), kalimba-like
function pluck(o = {}) {
  const f = snap(o.pitch || 'D5'), len = o.len || 0.7, x = buf(len), N = Math.max(2, Math.round(SR / f)), d = new Float32Array(N);
  const bright = o.bright ?? 0.5; let lp = 0;
  for (let i = 0; i < N; i++) { lp = lp * (1 - bright) + gauss() * bright; d[i] = lp; }
  let idx = 0;
  for (let i = 0; i < x.length; i++) { const a = d[idx], b = d[(idx + 1) % N]; x[i] = a; d[idx] = 0.4985 * (a + b) * (o.damp ?? 0.998); idx = (idx + 1) % N; }
  for (let i = 0; i < Math.min(x.length, 0.003 * SR); i++) x[i] *= i / (0.003 * SR);
  return fadeOut(norm(x, 1), 0.08);
}
// felt mallet on a low drum: soft, round body
function felt(o = {}) {
  const f = Math.min(160, Math.max(55, o.pitch ? snap(o.pitch) : 90)), x = buf(0.5);
  let ph = 0; for (let i = 0; i < x.length; i++) { const t = i / SR, ff = f * (1 + 0.6 * Math.exp(-t / 0.03)); ph += TAU * ff / SR; x[i] = Math.tanh(1.6 * Math.sin(ph) * Math.exp(-t / 0.14)); }
  const nz = filt(Float32Array.from({ length: Math.round(0.03 * SR) }, () => gauss()), 'lp', 500); add(x, nz, 0.25);
  return norm(x, 1);
}
// air: breath through a moving comb (jet-like), peaks on the hit
function air(o = {}) {
  const len = o.len || 0.45, x = buf(len), n = x.length, D = Math.round(0.004 * SR), line = new Float32Array(D + 2); let w = 0;
  const bp = new Biquad('bp', 800, 0.9);
  for (let i = 0; i < n; i++) {
    const p = i / n, env = Math.sin(Math.PI * Math.min(1, p / 0.55 * 0.5 + (p > 0.55 ? (p - 0.55) / 0.45 * 0.5 : 0))) ** 2;
    const s = gauss(), dl = Math.round((0.0006 + 0.0032 * p) * SR); line[w % (D + 2)] = s; const delayed = line[(w - dl + 10 * (D + 2)) % (D + 2)]; w++;
    if (i % 32 === 0) bp.set(600 + 2600 * Math.sin(Math.PI * p), 0.9);
    x[i] = bp.tick(s + 0.8 * delayed) * env;
  }
  return norm(x, 0.8);
}
// tape rise: the signature chord sped up from half speed, ends on the hit
function tape(o = {}) {
  const len = o.len || 1, x = buf(len), notes = ['D4', 'A4', 'F#5'].map((p) => fromMidi(midiOf(p))), ph = [0, 0, 0], lp = new Biquad('lp', 300, 0.7);
  for (let i = 0; i < x.length; i++) {
    const p = i / x.length, sp = 0.5 * 2 ** p * (1 + 0.004 * Math.sin(TAU * 5 * i / SR)); let s = 0;
    notes.forEach((f, k) => { ph[k] += TAU * f * sp / SR; s += Math.sin(ph[k]) + 0.3 * Math.sin(2 * ph[k]) + 0.12 * Math.sin(3 * ph[k]); });
    if (i % 32 === 0) lp.set(300 + 5000 * p * p, 0.8);
    x[i] = lp.tick(s / 3 + 0.15 * gauss() * p) * p ** 1.6;
  }
  return fadeOut(norm(x, 0.9), 0.006);
}
// drop: deep pitched boom with a felt knock
function drop() {
  const x = buf(1.2); let ph = 0;
  for (let i = 0; i < x.length; i++) { const t = i / SR, f = 38 + 72 * Math.exp(-t / 0.12); ph += TAU * f / SR; x[i] = Math.tanh(2 * Math.sin(ph)) * Math.exp(-t / 0.45); }
  add(x, felt({ pitch: 'D3' }), 0.5);
  return norm(x, 1);
}
function sub() { const x = buf(0.8); let ph = 0; for (let i = 0; i < x.length; i++) { const t = i / SR; ph += TAU * (34 + 26 * Math.exp(-t / 0.15)) / SR; x[i] = Math.sin(ph) * Math.exp(-t / 0.3); } return norm(x, 1); }
// bend: a plucked note that glides (stretch, squeeze)
function bend(o = {}) {
  const f0 = snap(o.pitch || 'C4'), f1 = snap(o.to || 'G4'), x = buf(0.45); let ph = 0;
  for (let i = 0; i < x.length; i++) { const t = i / SR, f = f0 * (f1 / f0) ** Math.min(1, t / 0.22); ph += TAU * f / SR; x[i] = (Math.sin(ph) + 0.35 * Math.sin(2 * ph)) * Math.exp(-t / 0.18) * (1 - Math.exp(-t / 0.003)); }
  return norm(x, 1);
}
// the AG Studio signature: three glass notes D5 - A5 - F#6
function motif() { const x = buf(1.8); [['D5', 0], ['A5', 0.11], ['F#6', 0.22]].forEach(([p, s]) => add(x, glass({ pitch: p, len: 1.4 }), 0.6, Math.round(s * SR))); return norm(x, 1); }

const P = {
  click: { fn: (o) => tap({ pitch: 'E7', ...o }), gain: 0.28 },
  tick: { fn: (o) => tap({ pitch: 'B6', ...o }), gain: 0.16 },
  tok: { fn: (o) => pluck({ bright: 0.8, damp: 0.99, len: 0.35, ...o }), gain: 0.3 },
  pop: { fn: (o) => pluck({ len: 0.6, ...o }), gain: 0.3 },
  blip: { fn: (o) => glass({ len: 0.5, ...o }), gain: 0.16 },
  bell: { fn: (o) => glass({ len: 1.6, ...o }), gain: 0.3 },
  coins: { fn: (o) => { const x = buf(1.2); ['A6', 'D7', 'F#7'].forEach((p, k) => add(x, glass({ pitch: p, len: 0.9 }), 0.5, Math.round(k * 0.06 * SR))); return norm(x, 1); }, gain: 0.25 },
  thud: { fn: (o) => felt(o), gain: 0.5 },
  whoosh: { fn: (o) => air(o), gain: 0.32, anchor: 'peak', peak: (o) => (o.len || 0.45) * 0.55 },
  crash: { fn: (o) => air({ len: 1.4, ...o }), gain: 0.25 },
  riser: { fn: (o) => tape(o), gain: 0.3, anchor: 'end' },
  swell: { fn: (o) => tape(o), gain: 0.25, anchor: 'end' },
  sub: { fn: () => sub(), gain: 0.55 },
  impact: { fn: () => drop(), gain: 0.65 },
  boing: { fn: (o) => bend(o), gain: 0.28 },
  type: { fn: (o) => key(o), gain: 0.22 },
  motif: { fn: () => motif(), gain: 0.32 },
};

function reverb(send, room = 0.82, damp = 0.35) {
  const s = SR / 44100, combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617], alls = [556, 441, 341, 225], out = [];
  for (const spread of [0, 23]) {
    const y = new Float32Array(send.length);
    for (const d of combs) { const L = Math.round((d + spread) * s), b = new Float32Array(L); let idx = 0, store = 0; for (let i = 0; i < send.length; i++) { const o = b[idx]; store = o * (1 - damp) + store * damp; b[idx] = send[i] * 0.015 + store * room; y[i] += o; idx = (idx + 1) % L; } }
    for (const d of alls) { const L = Math.round((d + spread) * s), b = new Float32Array(L); let idx = 0; for (let i = 0; i < y.length; i++) { const bo = b[idx], o = -y[i] + bo; b[idx] = y[i] + bo * 0.5; y[i] = o; idx = (idx + 1) % L; } }
    out.push(y);
  }
  return out;
}
function writeWav(file, L, R) {
  const n = L.length, data = Buffer.alloc(n * 8);
  for (let i = 0; i < n; i++) { data.writeFloatLE(L[i], i * 8); data.writeFloatLE(R[i], i * 8 + 4); }
  const h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(3, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 8, 28); h.writeUInt16LE(8, 32); h.writeUInt16LE(32, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, Buffer.concat([h, data]));
}
function place(hits, duration) {
  const n = Math.round(duration * SR), L = new Float32Array(n), R = new Float32Array(n), send = new Float32Array(n);
  let placed = 0;
  hits.forEach((h, k) => {
    if (!h.sfx) return;
    const names = h.sfx.split('+').map((s) => s.trim());
    if (/hook slam|end wipe/.test(h.label || '')) names.push('motif');        // signature at the start and on the end page
    names.forEach((name, j) => {
      const def = P[name]; if (!def) { console.error(`unknown sfx "${name}" (${h.label})`); process.exit(1); }
      const o = h.opts || {}; rnd = mulberry32(k * 7919 + j * 104729 + 1);
      const x = def.fn(o), anchor = o.anchor || def.anchor || 'start';
      const lead = anchor === 'end' ? x.length / SR : anchor === 'peak' ? (def.peak ? def.peak(o) : x.length / SR / 2) : 0;
      const at = Math.round((h.t - lead) * SR), g = (o.gain ?? def.gain) * STEM, pan = Math.max(-1, Math.min(1, o.pan ?? (rnd() - 0.5) * 0.3));
      const gl = g * Math.sqrt((1 - pan) / 2) * Math.SQRT2, gr = g * Math.sqrt((1 + pan) / 2) * Math.SQRT2, verb = name === 'motif' || name === 'bell' ? 0.35 : o.verb ?? 0.12;
      for (let i = 0; i < x.length; i++) { const d = at + i; if (d < 0 || d >= n) continue; L[d] += gl * x[i]; R[d] += gr * x[i]; send[d] += g * verb * x[i]; }
      placed++;
    });
  });
  const [wl, wr] = reverb(send); for (let i = 0; i < n; i++) { L[i] += wl[i]; R[i] += wr[i]; }
  return { L, R, placed };
}

const args = process.argv.slice(2);
if (args[0] === '--demo') {
  const seq = ['motif', 'tap', 'click', 'key', 'pluck', 'glass', 'felt', 'whoosh', 'riser', 'impact', 'boing', 'bell'];
  const hits = []; let t = 0.3;
  seq.forEach((s) => { const name = s === 'tap' ? 'tick' : s === 'pluck' ? 'pop' : s === 'glass' ? 'blip' : s === 'felt' ? 'thud' : s === 'key' ? 'type' : s; hits.push({ t: s === 'riser' ? t + 1 : t, sfx: name, label: s, opts: name === 'type' ? { n: 10, len: 0.9 } : {} }); t += s === 'riser' ? 1.6 : s === 'motif' ? 1.6 : 0.9; });
  const { L, R } = place(hits, t + 1.5); writeWav(args[1] || 'sfx-demo.wav', L, R); console.log('demo ->', args[1]); process.exit(0);
}
const film = args[0];
if (!film) { console.error('usage: sfx-ag.mjs <film> | --demo out.wav'); process.exit(1); }
const ROOT = process.cwd(), SYNC = '/root/.claude/plugins/synced';
const SKILL = process.env.MOTION_REEL_SKILL || fs.readdirSync(SYNC).filter((a) => fs.statSync(`${SYNC}/${a}`).isDirectory()).flatMap((a) => fs.readdirSync(`${SYNC}/${a}`).map((b) => `${SYNC}/${a}/${b}/skills/motion-reel`)).find((p) => fs.existsSync(p));
const r = spawnSync('node', [path.join(SKILL, 'scripts', 'render.mjs'), '--film', film, '--hits'], { cwd: ROOT, encoding: 'utf8' });
if (r.status !== 0) { console.error(r.stderr || r.stdout); process.exit(1); }
const hits = JSON.parse(fs.readFileSync(path.join(ROOT, 'out', film, 'hits.json'), 'utf8'));
const duration = Number(JSON.parse(fs.readFileSync(path.join(ROOT, film, 'film.json'), 'utf8')).duration || 15);
const { L, R, placed } = place(hits, duration + 1);
writeWav(path.join(ROOT, film, 'audio', 'sfx.wav'), L, R);
console.log(`AG sound palette: ${placed} sounds -> ${film}/audio/sfx.wav`);
