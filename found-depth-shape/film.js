// Depth & shape basics (Short 9:16). Hook: "Too many borders and shadows." — plan-fondamentaux.md
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';
import { makeFoundMockups } from '../shared/mockup-found.js';
import { basicsShort } from '../shared/basics.js';
const A = makeAGS(M);
const MK = makeFoundMockups(M, A);
const { prog } = M;
basicsShort(M, A, MK.depthShape, {
  series: 'Learn UI/UX',
  hook: { title: 'Too many borders and shadows.', hl: [2, 3, 4], hlAt: -20, ar: 'حدود وظلال كثيرة جدًا.', en2: '5 basics for depth and shape.', ar2: '5 أساسيات للعمق والأشكال.',
    label: 'Landing page', cam: [480, 640, 0.74], cam2: [470, 600, 0.84], marks: ['list', 'cards'], hits: [[1.6, 'pulse', 'tick'], [3.2, 'pulse', 'tick']] },
  steps: [
    { title: 'Space, not lines', ar: 'مسافات بدل الخطوط', en2: 'Group with spacing and a soft background.', ar2: 'جمّع بالمسافات وخلفية خفيفة.', label: 'Settings list', cam: [480, 320, 1.0], mark: 'list' },
    { title: 'Soft shadows', ar: 'ظلال ناعمة', en2: 'Blurred, light and slightly below.', ar2: 'ضبابية وخفيفة ومنخفضة قليلًا.', label: 'Product cards', cam: [480, 700, 1.0], mark: 'cards' },
    { title: 'Two or three levels', ar: 'مستويان أو ثلاثة', en2: 'Higher elements cast bigger shadows.', ar2: 'العناصر الأعلى تُلقي ظلالًا أكبر.', label: 'Elevation', cam: [480, 1060, 1.0], mark: 'elev', drive: (st, v) => { st.levels = prog(v, 1.2, 2.0); } },
    { title: 'One corner radius', ar: 'تدوير زوايا موحّد', en2: 'Pick one radius and reuse it.', ar2: 'اختر قيمة تدوير واحدة وأعد استخدامها.', label: 'Product cards', cam: [480, 700, 1.0], mark: 'cards' },
    { title: 'Nested radius', ar: 'تدوير متداخل', en2: 'Inner radius = outer radius − padding.', ar2: 'التدوير الداخلي = الخارجي − الحشو.', label: 'Card image', cam: [190, 690, 1.9], mark: 'nested', drive: (st, v) => { st.radii = prog(v, 1.2, 2.0); } },
  ],
  recap: { title: 'Same page. Clean and calm.', hl: [2, 3, 4], ar: 'نفس الصفحة، نظيفة وهادئة.', en2: 'Save this for your next UI.', ar2: 'احفظ هذا لواجهتك القادمة.' },
  recapScale: 0.34, coverScale: 0.42,
  cover: { lines: ['Depth & shape', 'basics.'], hlLine: 0, hl: [0, 1, 2], ar: 'أساسيات العمق والأشكال' },
});
