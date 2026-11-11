// UI/UX basics for websites (Short 9:16). Built with ../shared/basics.js on a fictional landing page
// drawn by ../shared/mockups.js. Hook: "Visitors don't read. They scan." (shared/accroche.md)
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';
import { makeMockups } from '../shared/mockups.js';
import { basicsShort } from '../shared/basics.js';

const A = makeAGS(M);
const MK = makeMockups(M, A);
const { prog } = M;

basicsShort(M, A, MK.web, {
  series: 'Learn UI/UX',
  hook: {
    title: "Visitors don't read. They scan.", hl: [4], hlAt: -20, maxW: 760,
    ar: 'الزوّار لا يقرؤون، بل يتصفّحون بسرعة.', en2: '5 basics to fix that.', ar2: '٥ أساسيات لإصلاح ذلك.',
    label: 'Landing page', cam: [480, 620, 0.74], cam2: [470, 560, 0.84], marks: ['headline', 'buttons', 'cards'],
    drive: (st, u) => { st.scan = prog(u, 0, 5); },
    hits: [[1.6, 'scan', 'tick'], [3.2, 'scan', 'tick'], [4.6, 'scan', 'tick']],
  },
  steps: [
    { title: 'One clear headline', ar: 'عنوان واحد واضح', en2: 'Say what you do, not how great you are.', ar2: 'قل ماذا تقدّم، لا كم أنت رائع.',
      label: 'Hero · headline', cam: [330, 270, 1.25], mark: 'headline', fixSfx: 'type' },
    { title: 'One main button', ar: 'زر رئيسي واحد', en2: 'Three equal buttons = no clear choice.', ar2: 'ثلاثة أزرار متساوية = لا خيار واضح.',
      label: 'Hero · buttons', cam: [330, 330, 1.25], mark: 'buttons' },
    { title: 'Visual hierarchy', ar: 'التسلسل البصري', en2: 'Size, weight and contrast guide the eye.', ar2: 'الحجم والسُّمك والتباين توجّه العين.',
      label: 'Feature cards', cam: [480, 750, 0.95], mark: 'cards' },
    { title: 'Consistent spacing', ar: 'مسافات متّسقة', en2: 'One spacing scale: 8, 16, 24, 32.', ar2: 'مقياس مسافات واحد: 8، 16، 24، 32.',
      label: 'Feature cards · spacing', cam: [480, 760, 0.95], mark: 'gaps', drive: (st, v) => { st.gaps = prog(v, 1.2, 2.0); } },
    { title: 'Readable text', ar: 'نص سهل القراءة', en2: 'Shorter lines, stronger contrast.', ar2: 'أسطر أقصر وتباين أقوى.',
      label: 'Body text', cam: [480, 1100, 1.0], mark: 'body' },
  ],
  recap: { title: 'Same page. Easy to scan.', hl: [2, 3, 4], ar: 'نفس الصفحة، سهلة التصفّح.', en2: 'Save this for your next website.', ar2: 'احفظ هذا لموقعك القادم.' },
  recapScale: 0.34,
  cover: { lines: ['UI/UX basics', 'for websites.'], hlLine: 1, hl: [1], ar: 'أساسيات UI/UX لتصميم المواقع' },
  coverScale: 0.42,
});
