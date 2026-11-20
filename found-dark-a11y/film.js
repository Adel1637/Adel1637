// Dark mode & accessibility basics (Short 9:16). Hook: "Can everyone read this?" — plan-fondamentaux.md
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';
import { makeFoundMockups } from '../shared/mockup-found.js';
import { basicsShort } from '../shared/basics.js';
const A = makeAGS(M);
const MK = makeFoundMockups(M, A);
const { prog } = M;
basicsShort(M, A, MK.darkA11y, {
  series: 'Learn UI/UX',
  hook: { title: 'Can everyone read this?', hl: [3], hlAt: -20, ar: 'هل يستطيع الجميع قراءة هذا؟', en2: '5 basics for dark mode and accessibility.', ar2: '5 أساسيات للوضع الداكن وإمكانية الوصول.',
    label: 'Dark mode', cam: [480, 640, 0.74], cam2: [470, 580, 0.84], marks: ['list', 'search'], hits: [[1.6, 'pulse', 'tick'], [3.2, 'pulse', 'tick']] },
  steps: [
    { title: 'Enough contrast', ar: 'تباين كافٍ', en2: 'Dim text on black fails WCAG AA.', ar2: 'النص الباهت على الأسود لا يجتاز WCAG AA.', label: 'Invoice list', cam: [480, 420, 1.0], mark: 'list' },
    { title: 'Never color alone', ar: 'لا تعتمد على اللون وحده', en2: 'Add an icon or a word to every status.', ar2: 'أضف أيقونة أو كلمة لكل حالة.', label: 'Status', cam: [700, 430, 1.3], mark: 'status' },
    { title: 'Visible focus', ar: 'تركيز ظاهر', en2: 'Show which field is active.', ar2: 'أظهر الحقل النشط بوضوح.', label: 'Search field', cam: [350, 210, 1.4], mark: 'search' },
    { title: 'Dark gray, not black', ar: 'رمادي داكن لا أسود', en2: 'Surfaces show depth on dark gray.', ar2: 'الأسطح تُظهر العمق على خلفية رمادية داكنة.', label: 'Surfaces', cam: [480, 560, 0.8], mark: 'surface' },
    { title: 'Softer colors', ar: 'ألوان أهدأ', en2: 'Neon colors glare on dark backgrounds.', ar2: 'الألوان الفاقعة تُبهر العين على الخلفيات الداكنة.', label: 'Chart', cam: [480, 1000, 0.95], mark: 'chart' },
  ],
  recap: { title: 'Same app. Easy for everyone.', hl: [2, 3, 4], ar: 'نفس التطبيق، سهل للجميع.', en2: 'Save this for your next dark mode.', ar2: 'احفظ هذا لوضعك الداكن القادم.' },
  recapScale: 0.34, coverScale: 0.42,
  cover: { lines: ['Dark mode &', 'accessibility.'], hlLine: 1, hl: [0], ar: 'أساسيات الوضع الداكن وإمكانية الوصول' },
});
