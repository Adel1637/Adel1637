// Spacing & layout basics (Short 9:16). Hook: "Your design feels cramped." — plan-fondamentaux.md
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';
import { makeFoundMockups } from '../shared/mockup-found.js';
import { basicsShort } from '../shared/basics.js';
const A = makeAGS(M);
const MK = makeFoundMockups(M, A);
const { prog } = M;
basicsShort(M, A, MK.spacing, {
  series: 'Learn UI/UX',
  hook: { title: 'Your design feels cramped.', hl: [3], hlAt: -20, ar: 'تصميمك مزدحم.', en2: '5 basics to give it room.', ar2: '5 أساسيات لتمنحه مساحة.',
    label: 'Landing page', cam: [480, 640, 0.74], cam2: [470, 600, 0.84], marks: ['form', 'cards', 'text'], hits: [[1.6, 'pulse', 'tick'], [3.2, 'pulse', 'tick']] },
  steps: [
    { title: 'A spacing scale', ar: 'مقياس مسافات', en2: 'Use only 8, 16, 24, 32…', ar2: 'استخدم فقط 8 و16 و24 و32…', label: 'Card padding', cam: [480, 700, 1.0], mark: 'cards', drive: (st, v) => { st.pad = prog(v, 1.2, 2.0); } },
    { title: 'Group related things', ar: 'جمّع العناصر المترابطة', en2: 'Label close to its field, groups apart.', ar2: 'العنوان قريب من حقله، والمجموعات متباعدة.', label: 'Form', cam: [300, 330, 1.25], mark: 'form', drive: (st, v) => { st.gapsForm = prog(v, 1.2, 2.0); } },
    { title: 'A column grid', ar: 'شبكة أعمدة', en2: '12 columns keep blocks in line.', ar2: '12 عمودًا تُبقي العناصر منتظمة.', label: 'Grid', cam: [480, 700, 1.0], mark: 'cards', drive: (st, v) => { st.grid = prog(v, 1.2, 2.0); } },
    { title: 'Align your edges', ar: 'وحّد الحواف', en2: 'One left edge for title, text and button.', ar2: 'حافة يسرى واحدة للعنوان والنص والزر.', label: 'Text block', cam: [480, 1030, 1.0], mark: 'text', drive: (st, v) => { st.guide = prog(v, 1.2, 2.0); } },
    { title: 'A max width', ar: 'عرض أقصى', en2: 'Very wide lines are hard to read.', ar2: 'الأسطر العريضة جدًا صعبة القراءة.', label: 'Text block', cam: [480, 1030, 1.0], mark: 'text', drive: (st, v) => { st.maxw = prog(v, 1.2, 2.0); } },
  ],
  recap: { title: 'Same page. Room to breathe.', hl: [2, 3, 4], ar: 'نفس الصفحة، مساحة للتنفّس.', en2: 'Save this for your next layout.', ar2: 'احفظ هذا لتصميمك القادم.' },
  recapScale: 0.34, coverScale: 0.42,
  cover: { lines: ['Spacing & layout', 'basics.'], hlLine: 0, hl: [0, 1, 2], ar: 'أساسيات المسافات والتخطيط' },
});
