// The 6 themes of the "UI foundations" series, extracted from the Short configs (found-*/film.js).
// Used by found-long/film.js. drive(st, v): v = beats since the basic started.
export function foundThemes(M) {
  const { prog } = M; const SEC = 60 / 128;
  const panel = (name) => (st) => { st.panel = name; };
  const demo = (name) => (st, v) => { st.panel = name; st.sec = Math.max(0, v) * SEC; st.chip = prog(v, 1.0, 1.6); };
  return [
    { key: 'color', mock: 'style', fit: 'width', title: 'Color & type', ar: 'الألوان والخطوط', steps: [
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
    ] },
    { key: 'spacing', mock: 'spacing', fit: 'width', title: 'Spacing & layout', ar: 'المسافات والتخطيط', steps: [
    { title: 'A spacing scale', ar: 'مقياس مسافات', en2: 'Use only 8, 16, 24, 32…', ar2: 'استخدم فقط 8 و16 و24 و32…', label: 'Card padding', cam: [480, 700, 1.0], mark: 'cards', drive: (st, v) => { st.pad = prog(v, 1.2, 2.0); } },
    { title: 'Group related things', ar: 'جمّع العناصر المترابطة', en2: 'Label close to its field, groups apart.', ar2: 'العنوان قريب من حقله، والمجموعات متباعدة.', label: 'Form', cam: [300, 330, 1.25], mark: 'form', drive: (st, v) => { st.gapsForm = prog(v, 1.2, 2.0); } },
    { title: 'A column grid', ar: 'شبكة أعمدة', en2: '12 columns keep blocks in line.', ar2: '12 عمودًا تُبقي العناصر منتظمة.', label: 'Grid', cam: [480, 700, 1.0], mark: 'cards', drive: (st, v) => { st.grid = prog(v, 1.2, 2.0); } },
    { title: 'Align your edges', ar: 'وحّد الحواف', en2: 'One left edge for title, text and button.', ar2: 'حافة يسرى واحدة للعنوان والنص والزر.', label: 'Text block', cam: [480, 1030, 1.0], mark: 'text', drive: (st, v) => { st.guide = prog(v, 1.2, 2.0); } },
    { title: 'A max width', ar: 'عرض أقصى', en2: 'Very wide lines are hard to read.', ar2: 'الأسطر العريضة جدًا صعبة القراءة.', label: 'Text block', cam: [480, 1030, 1.0], mark: 'text', drive: (st, v) => { st.maxw = prog(v, 1.2, 2.0); } },
    ] },
    { key: 'dark', mock: 'darkA11y', fit: 'width', title: 'Dark mode & accessibility', ar: 'الوضع الداكن وإمكانية الوصول', steps: [
    { title: 'Enough contrast', ar: 'تباين كافٍ', en2: 'Dim text on black fails WCAG AA.', ar2: 'النص الباهت على الأسود لا يجتاز WCAG AA.', label: 'Invoice list', cam: [480, 420, 1.0], mark: 'list' },
    { title: 'Never color alone', ar: 'لا تعتمد على اللون وحده', en2: 'Add an icon or a word to every status.', ar2: 'أضف أيقونة أو كلمة لكل حالة.', label: 'Status', cam: [700, 430, 1.3], mark: 'status' },
    { title: 'Visible focus', ar: 'تركيز ظاهر', en2: 'Show which field is active.', ar2: 'أظهر الحقل النشط بوضوح.', label: 'Search field', cam: [350, 210, 1.4], mark: 'search' },
    { title: 'Dark gray, not black', ar: 'رمادي داكن لا أسود', en2: 'Surfaces show depth on dark gray.', ar2: 'الأسطح تُظهر العمق على خلفية رمادية داكنة.', label: 'Surfaces', cam: [480, 560, 0.8], mark: 'surface' },
    { title: 'Softer colors', ar: 'ألوان أهدأ', en2: 'Neon colors glare on dark backgrounds.', ar2: 'الألوان الفاقعة تُبهر العين على الخلفيات الداكنة.', label: 'Chart', cam: [480, 1000, 0.95], mark: 'chart' },
    ] },
    { key: 'depth', mock: 'depthShape', fit: 'width', title: 'Depth & shape', ar: 'العمق والأشكال', steps: [
    { title: 'Space, not lines', ar: 'مسافات بدل الخطوط', en2: 'Group with spacing and a soft background.', ar2: 'جمّع بالمسافات وخلفية خفيفة.', label: 'Settings list', cam: [480, 320, 1.0], mark: 'list' },
    { title: 'Soft shadows', ar: 'ظلال ناعمة', en2: 'Blurred, light and slightly below.', ar2: 'ضبابية وخفيفة ومنخفضة قليلًا.', label: 'Product cards', cam: [480, 700, 1.0], mark: 'cards' },
    { title: 'Two or three levels', ar: 'مستويان أو ثلاثة', en2: 'Higher elements cast bigger shadows.', ar2: 'العناصر الأعلى تُلقي ظلالًا أكبر.', label: 'Elevation', cam: [480, 1060, 1.0], mark: 'elev', drive: (st, v) => { st.levels = prog(v, 1.2, 2.0); } },
    { title: 'One corner radius', ar: 'تدوير زوايا موحّد', en2: 'Pick one radius and reuse it.', ar2: 'اختر قيمة تدوير واحدة وأعد استخدامها.', label: 'Product cards', cam: [480, 700, 1.0], mark: 'cards' },
    { title: 'Nested radius', ar: 'تدوير متداخل', en2: 'Inner radius = outer radius − padding.', ar2: 'التدوير الداخلي = الخارجي − الحشو.', label: 'Card image', cam: [190, 690, 1.9], mark: 'nested', drive: (st, v) => { st.radii = prog(v, 1.2, 2.0); } },
    ] },
    { key: 'icons', mock: 'iconsImages', fit: 'width', title: 'Icons & images', ar: 'الأيقونات والصور', steps: [
    { title: 'One icon family', ar: 'عائلة أيقونات واحدة', en2: 'All outline or all filled, never mixed.', ar2: 'كلها محدّدة أو كلها ممتلئة، دون خلط.', label: 'Toolbar', cam: [480, 170, 1.25], mark: 'toolbar' },
    { title: 'Same stroke weight', ar: 'سُمك خط موحّد', en2: 'One stroke width for every icon.', ar2: 'سُمك خط واحد لكل الأيقونات.', label: 'Toolbar', cam: [480, 170, 1.25], mark: 'toolbar' },
    { title: 'Label unclear icons', ar: 'أضف نصًا للأيقونات الغامضة', en2: 'An icon alone can be misread.', ar2: 'الأيقونة وحدها قد تُفهم خطأ.', label: 'Toolbar', cam: [480, 170, 1.25], mark: 'toolbar' },
    { title: 'Overlay behind text', ar: 'طبقة داكنة خلف النص', en2: 'Text on photos needs a dark gradient.', ar2: 'النص فوق الصور يحتاج تدرّجًا داكنًا.', label: 'Hero image', cam: [480, 410, 1.05], mark: 'hero' },
    { title: 'Consistent image ratios', ar: 'نِسب صور موحّدة', en2: 'One ratio, cropped to fit.', ar2: 'نسبة واحدة مع قصّ مناسب.', label: 'Gallery', cam: [480, 910, 0.95], mark: 'gallery', drive: (st, v) => { st.ratios = prog(v, 1.2, 2.0); } },
    ] },
    { key: 'motion', mock: 'motion', fit: 'height', title: 'Motion', ar: 'الحركة', steps: [
    { title: 'Keep it short', ar: 'اجعلها قصيرة', en2: 'Most UI motion: about 150 to 300 ms.', ar2: 'معظم حركات الواجهة: من 150 إلى 300 ملّي ثانية تقريبًا.', label: 'Bottom sheet', cam: [195, 422, 1.0], mark: 'sheet', drive: demo('duration') },
    { title: 'Ease out', ar: 'تباطؤ في النهاية', en2: 'Fast start, gentle stop. Never linear.', ar2: 'بداية سريعة وتوقّف هادئ، لا حركة خطية.', label: 'Toggle', cam: [250, 260, 1.6], mark: 'toggle', drive: demo('easing') },
    { title: 'Motion with a purpose', ar: 'حركة لها هدف', en2: 'Move only what changed.', ar2: 'حرّك فقط ما تغيّر.', label: 'List', cam: [195, 400, 1.0], mark: 'list', drive: demo('purpose') },
    { title: 'Show the press', ar: 'أظهر الضغط', en2: 'A tap needs a visible pressed state.', ar2: 'كل لمسة تحتاج حالة ضغط ظاهرة.', label: 'Button', cam: [195, 700, 1.6], mark: 'button', drive: demo('press') },
    { title: 'Loading and success', ar: 'التحميل والنجاح', en2: 'Skeletons while loading, a check when done.', ar2: 'هياكل أثناء التحميل، وعلامة صح عند الانتهاء.', label: 'Content', cam: [195, 422, 1.0], mark: 'content', drive: demo('feedback') },
    ] },
  ];
}
