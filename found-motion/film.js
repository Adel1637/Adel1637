// Motion basics (Short 9:16). Hook: "This animation is too slow." — plan-fondamentaux.md
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';
import { makeFoundMockups } from '../shared/mockup-found.js';
import { basicsShort } from '../shared/basics.js';
const A = makeAGS(M);
const MK = makeFoundMockups(M, A);
const { prog } = M;
const SEC = 60 / 128;
const demo = (name) => (st, v) => { st.panel = name; st.sec = Math.max(0, v) * SEC; st.chip = prog(v, 1.0, 1.6); };
basicsShort(M, A, MK.motion, {
  series: 'Learn UI/UX', fit: 'height',
  hook: { title: 'This animation is too slow.', hl: [4], hlAt: -20, ar: 'هذه الحركة بطيئة جدًا.', en2: '5 basics for motion in UI.', ar2: '5 أساسيات للحركة في الواجهات.',
    label: 'Mobile app', cam: [195, 422, 1.0], marks: ['sheet'], drive: (st, u) => { st.panel = 'duration'; st.sec = u * SEC + 0.3; st.chip = 1; }, hits: [[1.6, 'pulse', 'tick'], [3.2, 'pulse', 'tick']] },
  steps: [
    { title: 'Keep it short', ar: 'اجعلها قصيرة', en2: 'Most UI motion: about 150 to 300 ms.', ar2: 'معظم حركات الواجهة: من 150 إلى 300 ملّي ثانية تقريبًا.', label: 'Bottom sheet', cam: [195, 422, 1.0], mark: 'sheet', drive: demo('duration') },
    { title: 'Ease out', ar: 'تباطؤ في النهاية', en2: 'Fast start, gentle stop. Never linear.', ar2: 'بداية سريعة وتوقّف هادئ، لا حركة خطية.', label: 'Toggle', cam: [250, 260, 1.6], mark: 'toggle', drive: demo('easing') },
    { title: 'Motion with a purpose', ar: 'حركة لها هدف', en2: 'Move only what changed.', ar2: 'حرّك فقط ما تغيّر.', label: 'List', cam: [195, 400, 1.0], mark: 'list', drive: demo('purpose') },
    { title: 'Show the press', ar: 'أظهر الضغط', en2: 'A tap needs a visible pressed state.', ar2: 'كل لمسة تحتاج حالة ضغط ظاهرة.', label: 'Button', cam: [195, 700, 1.6], mark: 'button', drive: demo('press') },
    { title: 'Loading and success', ar: 'التحميل والنجاح', en2: 'Skeletons while loading, a check when done.', ar2: 'هياكل أثناء التحميل، وعلامة صح عند الانتهاء.', label: 'Content', cam: [195, 422, 1.0], mark: 'content', drive: demo('feedback') },
  ],
  recap: { title: 'Same app. Feels smooth.', hl: [2, 3], ar: 'نفس التطبيق، سلس ومريح.', en2: 'Save this for your next app.', ar2: 'احفظ هذا لتطبيقك القادم.' },
  recapScale: 0.7, coverScale: 0.8,
  cover: { lines: ['Motion', 'basics.'], hlLine: 0, hl: [0], ar: 'أساسيات الحركة في الواجهات' },
});
