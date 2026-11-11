// Icons & images basics (Short 9:16). Hook: "Your icons don't match." — plan-fondamentaux.md
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';
import { makeFoundMockups } from '../shared/mockup-found.js';
import { basicsShort } from '../shared/basics.js';
const A = makeAGS(M);
const MK = makeFoundMockups(M, A);
const { prog } = M;
basicsShort(M, A, MK.iconsImages, {
  series: 'Learn UI/UX',
  hook: { title: "Your icons don't match.", hl: [2, 3], hlAt: -20, ar: 'أيقوناتك غير متناسقة.', en2: '5 basics for icons and images.', ar2: '5 أساسيات للأيقونات والصور.',
    label: 'Travel app', cam: [480, 640, 0.74], cam2: [470, 600, 0.84], marks: ['toolbar', 'hero', 'gallery'], hits: [[1.6, 'pulse', 'tick'], [3.2, 'pulse', 'tick']] },
  steps: [
    { title: 'One icon family', ar: 'عائلة أيقونات واحدة', en2: 'All outline or all filled, never mixed.', ar2: 'كلها محدّدة أو كلها ممتلئة، دون خلط.', label: 'Toolbar', cam: [480, 170, 1.25], mark: 'toolbar' },
    { title: 'Same stroke weight', ar: 'سُمك خط موحّد', en2: 'One stroke width for every icon.', ar2: 'سُمك خط واحد لكل الأيقونات.', label: 'Toolbar', cam: [480, 170, 1.25], mark: 'toolbar' },
    { title: 'Label unclear icons', ar: 'أضف نصًا للأيقونات الغامضة', en2: 'An icon alone can be misread.', ar2: 'الأيقونة وحدها قد تُفهم خطأ.', label: 'Toolbar', cam: [480, 170, 1.25], mark: 'toolbar' },
    { title: 'Overlay behind text', ar: 'طبقة داكنة خلف النص', en2: 'Text on photos needs a dark gradient.', ar2: 'النص فوق الصور يحتاج تدرّجًا داكنًا.', label: 'Hero image', cam: [480, 410, 1.05], mark: 'hero' },
    { title: 'Consistent image ratios', ar: 'نِسب صور موحّدة', en2: 'One ratio, cropped to fit.', ar2: 'نسبة واحدة مع قصّ مناسب.', label: 'Gallery', cam: [480, 910, 0.95], mark: 'gallery', drive: (st, v) => { st.ratios = prog(v, 1.2, 2.0); } },
  ],
  recap: { title: 'Same page. Looks designed.', hl: [2, 3], ar: 'نفس الصفحة، تبدو مصمَّمة.', en2: 'Save this for your next UI.', ar2: 'احفظ هذا لواجهتك القادمة.' },
  recapScale: 0.34, coverScale: 0.42,
  cover: { lines: ['Icons & images', 'basics.'], hlLine: 0, hl: [0, 1, 2], ar: 'أساسيات الأيقونات والصور' },
});
