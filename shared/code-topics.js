// Content of the "code for designers" films (kinetic style). Numbers in Arabic texts are standard 1, 2, 3.
// topic(name, K, CK, long) -> cfg for shared/kinetic-film.js
export function topic(name, K, CK, long) {
  const { txt, rr, F, C } = K;
  const step = (prefix, n) => (i) => `${prefix} ${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
  const codeArt = (file, lines) => (ctx, x, y, w, h) => CK.codePanel(ctx, x, y, w, Math.min(h, 380), file, lines, 1, 30);
  const tagArt = (list) => (ctx, x, y, w, h) => {
    let cx = x, cy = y + 20;
    list.forEach((s, i) => { ctx.font = `600 44px ${F.mono}`; const tw = ctx.measureText(s).width + 60; if (cx + tw > x + w) { cx = x; cy += 110; } rr(ctx, cx, cy, tw, 90, 18, i === 0 ? C.sel : '#2A2A2A', '#3A3A3A', 2); txt(ctx, s, cx + tw / 2, cy + 60, 44, { w: 600, family: F.mono, color: '#FFFFFF', align: 'center' }); cx += tw + 20; });
  };

  const UX = [
    { title: ['HTML'], ar: 'هيكل الصفحة: HTML', en: 'STRUCTURE AND ACCESSIBILITY.', vig: CK.html, tip: 'A LABEL FOR EVERY INPUT.', tipAr: 'عنوان لكل حقل إدخال.', tipAt: 11 },
    { title: ['CSS'], ar: 'المسافات والتخطيط: CSS', en: 'SPACING, LAYOUT, RESPONSIVE.', vig: CK.css, tip: 'LEARN FLEXBOX AND GAP FIRST.', tipAr: 'تعلّم Flexbox أولًا.', tipAt: 10 },
    { title: ['JAVASCRIPT', 'BASICS'], ar: 'أساسيات JavaScript', en: 'STATES: LOADING, ERROR, SUCCESS.', vig: CK.js, tip: 'DESIGN THE LOADING AND ERROR STATES TOO.', tipAr: 'صمّم حالتي التحميل والخطأ أيضًا.', tipAt: 12 },
    { title: ['SWIFTUI', 'OR COMPOSE'], ar: 'مكوّنات التطبيقات الأصلية: SwiftUI أو Compose', en: 'NATIVE APP COMPONENTS.', vig: CK.nativeBoth, tip: 'NATIVE COMPONENTS FEEL RIGHT ON EACH PHONE.', tipAr: 'المكوّنات الأصلية تبدو طبيعية على كل هاتف.', tipAt: 12.5 },
    { title: ['PYTHON'], ar: 'أبحاث المستخدمين: Python', en: 'READ SURVEYS AND A/B TESTS.', vig: CK.python, tip: 'A FEW LINES TURN A SURVEY INTO A CHART.', tipAr: 'بضعة أسطر تحوّل الاستبيان إلى رسم بياني.', tipAt: 11.5 },
  ];
  const UI = [
    { title: ['WEB:', 'HTML + CSS'], ar: 'الويب: HTML وCSS', en: 'THE BASE OF EVERY WEB INTERFACE.', vig: CK.css, tip: 'EVERY WEBSITE STARTS HERE.', tipAr: 'كل موقع يبدأ من هنا.', tipAt: 10 },
    { title: ['INTERACTIVE', 'WEB: REACT'], ar: 'الويب التفاعلي: React', en: 'JAVASCRIPT OR TYPESCRIPT + A FRAMEWORK.', vig: CK.react, tip: 'THINK IN COMPONENTS, LIKE IN FIGMA.', tipAr: 'فكّر بالمكوّنات، كما في Figma.', tipAt: 11.5 },
    { title: ['IPHONE:', 'SWIFT'], ar: 'لغة Swift لتطبيقات iPhone', en: 'SWIFTUI FOR NATIVE IOS SCREENS.', vig: CK.swift, tip: "FOLLOW APPLE'S HUMAN INTERFACE GUIDELINES.", tipAr: 'اتبع إرشادات Apple لتصميم الواجهات.', tipAt: 12 },
    { title: ['ANDROID:', 'KOTLIN'], ar: 'لغة Kotlin لتطبيقات Android', en: 'JETPACK COMPOSE FOR NATIVE ANDROID.', vig: CK.kotlin, tip: 'FOLLOW MATERIAL DESIGN ON ANDROID.', tipAr: 'اتبع Material Design على Android.', tipAt: 12 },
    { title: ['BOTH:', 'FLUTTER'], ar: 'الاثنان معًا: Flutter', en: 'DART, ONE CODE FOR IPHONE AND ANDROID.', vig: CK.flutter, tip: 'ONE CODE, BUT RESPECT EACH PLATFORM.', tipAr: 'كود واحد، مع احترام كل منصة.', tipAt: 11 },
  ];

  if (name === 'ux') return {
    hook: { lines: ['THE ONE LANGUAGE', 'EVERY DESIGNER', 'SHOULD KNOW.'], ar: 'اللغة التي يجب أن يعرفها كل مصمم.', en: '5 LANGUAGES, ONE CLEAR WINNER.', tags: ['HTML', 'CSS', 'JS', 'Swift', 'Kotlin', 'Python'] },
    items: UX, label: step('LANGUAGE', 5),
    recap: { title: ['START', 'WITH CSS.'], ar: 'ابدأ بـ CSS.', en: 'THEN HTML, THEN JAVASCRIPT BASICS.', vig: CK.rank([['CSS', 'START HERE'], ['HTML', 'STRUCTURE'], ['JavaScript', 'STATES'], ['SwiftUI · Compose', 'APPS'], ['Python', 'RESEARCH']], 0) },
    cover: { lines: ['THE ONE', 'LANGUAGE EVERY', 'DESIGNER NEEDS.'], ar: 'اللغة التي يجب أن يعرفها كل مصمم', art: codeArt('?.css', ['/* which language? */', '.card { padding: 24px; }']) },
  };
  if (name === 'ui') return {
    hook: { lines: ['WEB, IPHONE', 'OR ANDROID:', 'WHICH LANGUAGE?'], ar: 'ويب أم iPhone أم Android: أيّ لغة؟', en: 'SAME CARD, FIVE WAYS TO BUILD IT.', tags: ['HTML', 'CSS', 'React', 'Swift', 'Kotlin', 'Dart'] },
    items: UI, label: step('PLATFORM', 5),
    recap: { title: ['PICK THE', 'PLATFORM FIRST.'], ar: 'اختر المنصّة أولًا، ثم اللغة.', en: 'THEN LEARN ITS LANGUAGE.', vig: CK.rank([['Web', 'HTML · CSS · JS'], ['Interactive web', 'REACT'], ['iPhone', 'SWIFT'], ['Android', 'KOTLIN'], ['Both', 'FLUTTER']], -1) },
    cover: { lines: ['WEB, IPHONE', 'OR ANDROID:', 'WHICH LANGUAGE?'], ar: 'ويب أم iPhone أم Android: أيّ لغة؟', art: tagArt(['HTML', 'CSS', 'React', 'Swift', 'Kotlin', 'Flutter']) },
  };
  if (name === 'both') return {
    hook: { lines: ['SHOULD', 'DESIGNERS LEARN', 'TO CODE?'], ar: 'هل يجب على المصمم تعلّم البرمجة؟', en: '10 LANGUAGES: 5 FOR UX, 5 FOR UI.', tags: ['HTML', 'CSS', 'JS', 'React', 'Swift', 'Kotlin', 'Dart', 'Python'] },
    parts: [{ en: 'FOR UX', ar: 'لتصميم تجربة المستخدم', count: '5 LANGUAGES' }, { en: 'FOR UI', ar: 'لبناء الواجهات', count: '5 LANGUAGES' }],
    items: [...UX.map((x) => ({ ...x, part: 0 })), ...UI.map((x) => ({ ...x, part: 1 }))], label: step('LANGUAGE', 10),
    recap: { title: ['START WITH CSS.', 'THEN PICK', 'A PLATFORM.'], ar: 'ابدأ بـ CSS، ثم اختر منصّتك.', en: "YOU DON'T NEED THEM ALL. PICK ONE PATH.", vig: CK.rank([['CSS', 'START HERE'], ['HTML', 'STRUCTURE'], ['Web', 'REACT'], ['iPhone', 'SWIFT'], ['Android', 'KOTLIN']], 0) },
    cover: { lines: ['SHOULD', 'DESIGNERS LEARN', 'TO CODE?'], ar: 'هل يجب على المصمم تعلّم البرمجة؟', art: tagArt(['CSS', 'HTML', 'JS', 'React', 'Swift', 'Kotlin', 'Flutter', 'Python']) },
  };
  if (name === 'first') {
    const P = [
      { title: ['BUILDING', 'A WEBSITE?'], ar: 'تبني موقعًا؟ ابدأ بـ HTML وCSS ثم JavaScript.', en: 'HTML + CSS FIRST, THEN JAVASCRIPT.', vig: CK.path(0, CK.css), tip: 'ADD JAVASCRIPT ONCE YOUR PAGES LOOK RIGHT.', tipAr: 'أضف JavaScript بعد أن تبدو صفحاتك صحيحة.' },
      { title: ['AN IPHONE', 'APP?'], ar: 'تطبيق iPhone؟ تعلّم Swift.', en: 'LEARN SWIFT WITH SWIFTUI.', vig: CK.path(1, CK.swift), tip: 'YOU NEED A MAC AND XCODE TO BUILD FOR IPHONE.', tipAr: 'تحتاج إلى جهاز Mac وبرنامج Xcode لتطوير تطبيقات iPhone.' },
      { title: ['AN ANDROID', 'APP?'], ar: 'تطبيق Android؟ تعلّم Kotlin.', en: 'LEARN KOTLIN WITH JETPACK COMPOSE.', vig: CK.path(2, CK.kotlin), tip: 'ANDROID STUDIO IS FREE ON WINDOWS, MAC AND LINUX.', tipAr: 'برنامج Android Studio مجاني على Windows وMac وLinux.' },
      { title: ['BOTH', 'PLATFORMS?'], ar: 'المنصتان معًا؟ تعلّم Dart مع Flutter.', en: 'LEARN DART WITH FLUTTER.', vig: CK.path(3, CK.flutter), tip: 'ONE CODEBASE, BUT TEST ON BOTH PLATFORMS.', tipAr: 'كود واحد، لكن اختبر على المنصتين.' },
      { title: ['USER', 'RESEARCH?'], ar: 'أبحاث المستخدمين؟ تعلّم أساسيات Python.', en: 'LEARN THE BASICS OF PYTHON.', vig: CK.path(4, CK.python), tip: 'THE BASICS ARE ENOUGH TO READ SURVEY RESULTS.', tipAr: 'تكفيك الأساسيات لقراءة نتائج الاستبيانات.' },
    ];
    const len = long ? 22 : 12;
    return {
      hook: { lines: ['WHICH LANGUAGE', 'SHOULD YOU', 'LEARN FIRST?'], ar: 'أيّ لغة برمجة تتعلّمها أولًا؟', en: 'IT DEPENDS ON WHAT YOU BUILD.', tags: ['HTML', 'CSS', 'JS', 'Swift', 'Kotlin', 'Dart', 'Python'] },
      items: [
        { title: ['IT DEPENDS', 'ON YOUR GOAL.'], ar: 'الأمر يعتمد على هدفك.', en: 'START FROM WHAT YOU WANT TO BUILD.', vig: CK.tree(-1), len, tip: 'ONE GOAL, ONE LANGUAGE. NOT FIVE AT ONCE.', tipAr: 'هدف واحد ولغة واحدة، لا خمس لغات معًا.', tipAt: 12 },
        ...P.map((x) => ({ ...x, len, tipAt: 12.5 })),
      ],
      label: (i) => (i === 0 ? 'THE QUESTION' : `PATH 0${i} / 05`),
      recap: { title: ['PICK YOUR', 'PATH.'], ar: 'اختر مسارك وابدأ اليوم.', en: 'ONE GOAL · ONE LANGUAGE · START TODAY.', vig: CK.tree(9) },
      cover: { lines: ['WHICH', 'LANGUAGE', 'FIRST?'], ar: 'أيّ لغة برمجة تتعلّمها أولًا؟', art: tagArt(['HTML', 'CSS', 'Swift', 'Kotlin', 'Dart', 'Python']) },
    };
  }
  if (name === 'layers') {
    const len = long ? 22 : 16;
    return {
      hook: { lines: ['HTML, CSS, JS:', 'WHO DOES', 'WHAT?'], ar: 'من يفعل ماذا: HTML أم CSS أم JavaScript؟', en: 'ONE CARD, BUILT LAYER BY LAYER.', tags: ['<h2>', '<input>', 'padding', 'color', 'onclick', 'if ()'] },
      items: [
        { title: ['HTML:', 'THE STRUCTURE.'], ar: 'الهيكل: HTML.', en: 'WHAT IS ON THE PAGE.', vig: CK.layer('html'), len, tip: 'USE REAL TAGS: BUTTON, LABEL, H1.', tipAr: 'استخدم الوسم الصحيح لكل عنصر في الصفحة.', tipAt: 11 },
        { title: ['CSS:', 'THE STYLE.'], ar: 'الشكل: CSS.', en: 'HOW IT LOOKS.', vig: CK.layer('css'), len, tip: 'KEEP SPACING AND COLORS IN VARIABLES.', tipAr: 'احفظ المسافات والألوان في متغيّرات.', tipAt: 11 },
        { title: ['JAVASCRIPT:', 'THE BEHAVIOR.'], ar: 'السلوك: JavaScript.', en: 'WHAT IT DOES.', vig: CK.layer('js'), len, tip: 'DESIGN EVERY STATE: LOADING, ERROR, SUCCESS.', tipAr: 'صمّم كل الحالات: تحميل، خطأ، نجاح.', tipAt: 13 },
        ...(long ? [{ title: ['TOGETHER:', '3 LAYERS.'], ar: 'ثلاث طبقات تعمل معًا.', en: 'STRUCTURE · STYLE · BEHAVIOR', vig: CK.layers3, len, tip: 'AS A DESIGNER, START WITH HTML AND CSS.', tipAr: 'كمصمم، ابدأ بـ HTML وCSS.', tipAt: 9 }] : []),
      ],
      label: step('LAYER', long ? 4 : 3),
      recap: long ? { title: ['3 LAYERS,', 'ONE PAGE.'], ar: 'ثلاث طبقات، صفحة واحدة.', en: 'STRUCTURE · STYLE · BEHAVIOR', vig: CK.rank([['HTML', 'STRUCTURE'], ['CSS', 'STYLE'], ['JavaScript', 'BEHAVIOR']], -1) }
        : { title: ['3 LAYERS,', 'ONE PAGE.'], ar: 'ثلاث طبقات، صفحة واحدة.', en: 'STRUCTURE · STYLE · BEHAVIOR', vig: CK.layers3, len: 12 },
      cover: { lines: ['HTML, CSS, JS:', 'WHO DOES', 'WHAT?'], ar: 'من يفعل ماذا: HTML أم CSS أم JavaScript؟', art: codeArt('signup.html', ['<h2>Join the beta</h2>', '<input type="email">', '<button>Sign up</button>']) },
    };
  }
  throw new Error('unknown topic ' + name);
}
