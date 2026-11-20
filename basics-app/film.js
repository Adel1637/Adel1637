// UI/UX basics for apps (Short 9:16). Built with ../shared/basics.js on a fictional phone app
// drawn by ../shared/mockups.js. Hook: "Can you reach this button?" (shared/accroche.md)
import * as M from './lib/motion.js';
import { makeAGS } from '../shared/ags.js';
import { makeMockups } from '../shared/mockups.js';
import { basicsShort } from '../shared/basics.js';

const A = makeAGS(M);
const MK = makeMockups(M, A);
const { prog, bump, lerp, E } = M;
const STEP4 = 6 + 3 * 16;   // start beat of "Feedback on every tap"

basicsShort(M, A, MK.app, {
  series: 'Learn UI/UX', fit: 'height',
  hook: {
    title: 'Can you reach this button?', hl: [4],
    ar: 'هل تصل إلى هذا الزر؟', en2: '5 basics every app needs.', ar2: '٥ أساسيات يحتاجها كل تطبيق.',
    label: 'Mobile app', cam: [195, 422, 1.0], marks: ['addTop'],
    drive: (st, u) => {
      st.thumb = 0.75 + 0.25 * Math.sin(u * 2.2);
      const c = (u % 3) / 3; st.reach = E.outCubic(Math.min(1, c * 1.6)) * (1 - prog(c, 0.8, 1));
    },
    hits: [[1.0, 'thumb', 'tick'], [4.0, 'thumb', 'tick']],
  },
  steps: [
    { title: 'Thumb zone', ar: 'منطقة الإبهام', en2: 'Put the main action where the thumb rests.', ar2: 'ضع الإجراء الرئيسي حيث يستقر الإبهام.',
      label: 'Main action', cam: [195, 422, 1.0], mark: 'addTop', good: 'addBottom',
      drive: (st, v) => { st.thumb = prog(v, 1.2, 2.2) * (1 - prog(v, 13, 14)); } },
    { title: 'Big enough to tap', ar: 'أهداف لمس كافية', en2: 'At least 44 pt (Apple) or 48 dp (Google).', ar2: 'على الأقل 44 نقطة في Apple و48 dp في Google.',
      label: 'Tap targets', cam: [195, 270, 1.9], mark: 'rows', drive: (st, v) => { st.targets = prog(v, 1.2, 2.0); } },
    { title: '3 to 5 tabs', ar: 'من 3 إلى 5 تبويبات', en2: 'More than five? Move the rest elsewhere.', ar2: 'أكثر من خمسة؟ انقل الباقي إلى مكان آخر.',
      label: 'Tab bar', cam: [195, 740, 1.9], mark: 'tabs' },
    { title: 'Feedback on every tap', ar: 'استجابة لكل لمسة', en2: 'Show it worked: pressed, loading, done.', ar2: 'أظهر أن اللمسة نجحت: ضغط، تحميل، تم.',
      label: 'Feedback', cam: [195, 640, 1.6], mark: 'button',
      drive: (st, v) => {
        st.press = Math.max(bump(v, 3.2, 0.35), bump(v, 6, 0.35));
        st.noFb = prog(v, 3.4, 3.8) * (1 - prog(v, 4.8, 5.2));
        st.loading = v > 6.2 && v < 8 ? prog(v, 6.2, 8) : 0; st.spin = v * 7;
        st.toast = prog(v, 8, 8.5) * (1 - prog(v, 14.5, 15.3));
      },
      hits: [[3.2, 'tap', 'click'], [6, 'tap', 'click']] },
    { title: 'One task per screen', ar: 'مهمة واحدة لكل شاشة', en2: 'Split long forms into short steps.', ar2: 'قسّم النماذج الطويلة إلى خطوات قصيرة.',
      label: 'Form', cam: [195, 422, 1.0], mark: 'form', drive: (st, v) => { st.form = E.inOutCubic(prog(v, 0.2, 1.5)); } },
  ],
  recap: { title: 'Same app. Easy to use.', hl: [2, 3, 4], ar: 'نفس التطبيق، سهل الاستخدام.', en2: 'Save this for your next app.', ar2: 'احفظ هذا لتطبيقك القادم.' },
  recapScale: 0.7,
  cover: { lines: ['UI/UX basics', 'for apps.'], hlLine: 1, hl: [1], ar: 'أساسيات UI/UX لتصميم التطبيقات' },
  coverScale: 0.8,
  // cursor tapping the button in "Feedback on every tap"
  overlay: (ctx, u, env) => {
    const v = u - STEP4;
    if (v < 1.6 || v > 10) return;
    const [fx, fy, z] = env.springKeys(u, env.camKeys, env.SPRING.gentle), s = env.s0 * z;
    const bx = env.CARD.x + env.CARD.w / 2 + (195 - fx) * s, by = env.CARD.y + env.CARD.h / 2 + (708 - 14 - fy) * s;
    const m = E.inOutCubic(prog(v, 1.6, 3.0));
    const x = lerp(1000, bx, m), y = lerp(1560, by, m);
    A.cursor(ctx, x, y, { press: Math.max(bump(v, 3.2, 0.35), bump(v, 6, 0.35)), alpha: 1 - prog(v, 9.2, 10) });
    A.ripple(ctx, bx, by, prog(v, 3.2, 3.8)); A.ripple(ctx, bx, by, prog(v, 6, 6.6));
  },
});
