// Renders one course figure: the fictional page of chapter 1 in a given state, cropped to a region.
// ?n=1..5 (lesson) & s=b|a (before / after). Cumulative: lesson n "before" has lessons 1..n-1 already fixed.
import * as M from '../learn-6-free/lib/motion.js';
import { makeAGS } from '../shared/ags.js';
import { makeStyleMockup } from '../shared/mockup-style.js';
const q = new URLSearchParams(location.search), n = Number(q.get('n') || 1), after = q.get('s') === 'a';
const A = makeAGS(M), MOCK = makeStyleMockup(M, A);
const CROPS = { 1: [0, 96, 960, 430], 2: [0, 560, 960, 360], 3: [0, 96, 960, 430], 4: [0, 96, 960, 800], 5: [0, 560, 960, 700] };
const PANEL = { 1: 'palette', 2: 'palette', 3: 'fonts', 4: 'scale', 5: 'contrast' };
const [cx, cy, cw, ch] = CROPS[n], S = 1.5;
await document.fonts.load('800 40px Jakarta', 'Aa'); await document.fonts.load('500 40px Jakarta', 'Aa');
const c = document.getElementById('c'); c.width = cw * S; c.height = ch * S;
const ctx = c.getContext('2d'); ctx.scale(S, S); ctx.translate(-cx, -cy);
const p = [0, 1, 2, 3, 4].map((i) => (i < n - 1 || (after && i === n - 1) ? 1 : 0));
MOCK.draw(ctx, { p, bad: [], good: [], px: 1, panel: PANEL[n] });
window.figReady = true;
