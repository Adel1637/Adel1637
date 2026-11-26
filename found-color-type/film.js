// Color & type basics (Short 9:16). Builder: ../shared/basics.js · fictional page: ../shared/mockup-style.js
// Hook: "Your colors and fonts are fighting." (shared/accroche.md)
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';
import { makeStyleMockup } from '../shared/mockup-style.js';
import { basicsShort } from '../shared/basics.js';

const A = makeAGS(M);
const STYLE = makeStyleMockup(M, A);
const panel = (name) => (st) => { st.panel = name; };

basicsShort(M, A, STYLE, {
  series: 'Learn UI/UX',
  hook: {
    title: 'Your colors and fonts are fighting.', hl: [5], hlAt: -20, maxW: 900,
    ar: 'ألوانك وخطوطك تتصارع.', en2: '5 basics to fix it.', ar2: '٥ أساسيات لإصلاح ذلك.',
    label: 'Landing page', cam: [480, 560, 0.74], cam2: [470, 520, 0.84], marks: ['headline', 'buttons', 'cards'],
    drive: (st) => { st.panel = 'palette'; },
    hits: [[1.6, 'pulse', 'tick'], [3.2, 'pulse', 'tick']],
  },
  steps: [
    { title: 'One accent color', ar: 'لون تمييز واحد', en2: 'Use it only for actions: buttons, links.', ar2: 'استخدمه للإجراءات فقط: الأزرار والروابط.',
      label: 'Buttons · palette', cam: [490, 300, 1.05], mark: 'buttons', drive: panel('palette') },
    { title: 'Neutrals for the rest', ar: 'ألوان محايدة للباقي', en2: 'Backgrounds and text: white and grays.', ar2: 'الخلفيات والنصوص: الأبيض ودرجات الرمادي.',
      label: 'Feature cards', cam: [480, 650, 0.86], mark: 'cards', drive: panel('palette') },
    { title: 'Two fonts max', ar: 'خطّان كحدّ أقصى', en2: 'One family is often enough.', ar2: 'عائلة خطوط واحدة تكفي غالبًا.',
      label: 'Headline · fonts', cam: [490, 290, 1.05], mark: 'headline', drive: panel('fonts') },
    { title: 'A type scale', ar: 'مقياس أحجام للخطوط', en2: 'Few sizes, clear steps: 48, 24, 16.', ar2: 'أحجام قليلة بدرجات واضحة: 48، 24، 16.',
      label: 'Sizes', cam: [490, 470, 0.8], mark: 'cards', drive: panel('scale') },
    { title: 'Enough contrast', ar: 'تباين كافٍ', en2: 'Gray on white must stay readable.', ar2: 'الرمادي على الأبيض يجب أن يبقى مقروءًا.',
      label: 'Body text', cam: [480, 680, 0.68], mark: 'body', drive: panel('contrast') },
  ],
  recap: { title: 'Same page. Calm and clear.', hl: [2, 3, 4], ar: 'نفس الصفحة، هادئة وواضحة.', en2: 'Save this for your next design.', ar2: 'احفظ هذا لتصميمك القادم.' },
  recapScale: 0.34,
  cover: { lines: ['Color & type', 'basics.'], hlLine: 0, hl: [0, 1, 2], ar: 'أساسيات الألوان والخطوط' },
  coverScale: 0.42,
});
