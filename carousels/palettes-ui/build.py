import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
def lum(h):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    f=lambda c: c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
def cr(a,b):
    la,lb=sorted([lum(a),lum(b)],reverse=True); return (la+0.05)/(lb+0.05)
def grade(r,large=False):
    return 'AAA' if r>=7 else ('AA' if r>=4.5 else ('AA large' if r>=3 else 'fail'))
P=[
 dict(n='NEUTRAL + ONE ACCENT', ar='محايدة مع لون مميّز واحد', use='SaaS, productivity, dashboards', useAr='تطبيقات العمل والإنتاجية ولوحات التحكم',
      c=dict(bg='#FFFFFF',surface='#F4F4F5',border='#E4E4E7',text='#18181B',accent='#2563EB'), onAccent='#FFFFFF', sub='#71717A'),
 dict(n='COOL TINTED NEUTRALS', ar='محايدة بلمسة لونية باردة', use='Health, finance, calm apps', useAr='الصحة والمالية والتطبيقات الهادئة',
      c=dict(bg='#F5F7FA',surface='#E9EEF4',border='#D5DEE8',text='#1E293B',accent='#0F766E'), onAccent='#FFFFFF', sub='#5B6B80'),
 dict(n='DARK GRAY MODE', ar='الوضع الداكن الرمادي', use='Night use, dev tools, media', useAr='الاستخدام الليلي وأدوات المطوّرين والوسائط',
      c=dict(bg='#1F2024',surface='#2A2B31',border='#3A3B42',text='#EDEDF0',accent='#7AA7FF'), onAccent='#14161A', sub='#A3A3AC'),
 dict(n='NATURAL SAGE', ar='طبيعية بدرجات المريمية', use='Wellness, food, eco brands', useAr='العافية والطعام والعلامات البيئية',
      c=dict(bg='#F6F8F4',surface='#E7EDE2',border='#CFD9C8',text='#1F2A1C',accent='#4A6B3A'), onAccent='#FFFFFF', sub='#5E6E57'),
 dict(n='HIGH CONTRAST', ar='تباين عالٍ', use='Banking, public services, health', useAr='البنوك والخدمات العامة والصحة',
      c=dict(bg='#FFFFFF',surface='#F2F2F2',border='#6B6B6B',text='#0B0B0C',accent='#0047AB'), onAccent='#FFFFFF', sub='#3D3D3D'),
]
for p in P:
    c=p['c']; p['r1']=cr(c['text'],c['bg']); p['r2']=cr(p['onAccent'],c['accent']); p['r3']=cr(p['sub'],c['bg'])
json.dump([{k:v for k,v in p.items()} for p in P],open('palettes.json','w'),indent=1)
ROLES=[('bg','Background','الخلفية'),('surface','Surface','السطح'),('border','Border','الحدود'),('text','Text','النص'),('accent','Accent','اللون المميّز')]
NM='../../node_modules/@fontsource'
css=f"""
@font-face{{font-family:Plex;src:url({NM}/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff2);font-weight:700}}
@font-face{{font-family:Plex;src:url({NM}/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2);font-weight:600}}
@font-face{{font-family:Plex;src:url({NM}/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2);font-weight:500}}
@font-face{{font-family:Plex;src:url({NM}/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2);font-weight:400}}
@font-face{{font-family:Mono;src:url({NM}/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2);font-weight:600}}
@font-face{{font-family:Ar;src:url({NM}/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-700-normal.woff2);font-weight:700;unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F}}
@font-face{{font-family:Ar;src:url({NM}/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff2);font-weight:700;unicode-range:U+0000-024F}}
*{{box-sizing:border-box;margin:0;padding:0}} body{{background:#000}}
.s{{width:1080px;height:1920px;position:relative;overflow:hidden;background:#1B1B1B;color:#EDEDED;font-family:Plex}}
.top{{position:absolute;top:270px;left:80px;right:80px;display:flex;justify-content:space-between;font:600 26px Mono;color:#A8A8A8}}
.h{{font-weight:700;color:#fff;line-height:.98}}
.ar{{font-family:Ar;font-weight:700;direction:rtl;text-align:right}}
.mono{{font:600 26px Mono;color:#A8A8A8}}
.swipe{{position:absolute;top:1490px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center}}
.sp{{background:#0D99FF;color:#fff;font:600 30px Mono;padding:16px 30px;border-radius:40px}}
.noswipe .swipe{{display:none}}
"""
def swipe(): return '<div class="swipe"><span class="sp">SWIPE →</span><span class="ar" style="font-size:40px;color:#EDEDED">اسحب للمزيد</span></div>'
def app(p,x,y,w=470,h=560):
    c=p['c']
    return f"""<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;background:{c['bg']};border-radius:34px;border:2px solid {c['border']};overflow:hidden;font-family:Plex">
 <div style="padding:30px 30px 0;display:flex;justify-content:space-between;align-items:center"><span style="font:700 32px Plex;color:{c['text']}">Today</span><span style="width:44px;height:44px;border-radius:22px;background:{c['surface']};border:2px solid {c['border']}"></span></div>
 <div style="margin:22px 30px 0;background:{c['surface']};border:2px solid {c['border']};border-radius:20px;padding:22px">
  <div style="font:600 18px Plex;color:{p['sub']}">Balance</div><div style="font:700 44px Plex;color:{c['text']};margin-top:4px">$2,480</div>
  <div style="margin-top:14px;height:10px;border-radius:5px;background:{c['border']}"><div style="width:62%;height:10px;border-radius:5px;background:{c['accent']}"></div></div></div>
 {''.join(f'<div style="margin:0 30px;padding:18px 0;border-bottom:2px solid {c["border"]};display:flex;justify-content:space-between;font:500 22px Plex;color:{c["text"]}"><span>{a}</span><span style="color:{p["sub"]}">{b}</span></div>' for a,b in [('Groceries','−$42'),('Transfer','+$300'),('Coffee','−$5')])}
 <div style="position:absolute;left:30px;right:30px;bottom:30px;height:74px;border-radius:18px;background:{c['accent']};color:{p['onAccent']};font:600 26px Plex;display:flex;align-items:center;justify-content:center">Send money</div>
</div>"""
def chk(label,r):
    g=grade(r); ok=g!='fail'
    return f'<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1.5px solid #3A3B42"><span style="font:500 22px Plex;color:#EDEDED">{label}</span><span style="font:600 22px Mono;color:{"#4ADE80" if ok else "#F87171"}">{r:.1f}:1 {g}</span></div>'
slides=[]
# cover
strips=''.join(f'<div style="display:flex;height:96px;border-radius:18px;overflow:hidden;margin-bottom:18px;border:1.5px solid #3A3B42">{"".join(f"<div style=\'flex:1;background:{p["c"][k]}\'></div>" for k,_,_ in ROLES)}</div>' for p in P)
slides.append(f"""<div class="s" id="s1"><div class="top"><span>LEARN UI/UX</span><span>AG STUDIO</span></div>
<div class="h" style="position:absolute;top:380px;left:76px;font-size:118px">5 COLOR<br>PALETTES THAT<br>WORK FOR UI.</div>
<div class="ar" style="position:absolute;top:770px;right:80px;font-size:56px">خمس لوحات ألوان تنجح في الواجهات.</div>
<div style="position:absolute;top:880px;left:80px;right:80px">{strips}</div>{swipe()}</div>""")
for i,p in enumerate(P):
    c=p['c']
    sw=''.join(f'<div style="flex:1"><div style="height:150px;border-radius:18px;background:{c[k]};border:2px solid #3A3B42"></div><div style="font:600 20px Mono;color:#fff;margin-top:12px">{c[k].upper()}</div><div style="font:500 18px Plex;color:#A8A8A8;margin-top:2px">{en}</div></div>' for k,en,ar in ROLES)
    slides.append(f"""<div class="s" id="s{i+2}"><div class="top"><span>PALETTE {i+1} / 5</span><span>AG STUDIO</span></div>
<div class="h" style="position:absolute;top:360px;left:76px;font-size:{86 if len(p['n'])<16 else 72}px">{p['n']}</div>
<div class="ar" style="position:absolute;top:470px;right:80px;font-size:46px">{p['ar']}</div>
<div style="position:absolute;top:560px;left:80px;right:80px;display:flex;gap:16px">{sw}</div>
{app(p,80,830)}
<div style="position:absolute;left:580px;right:80px;top:830px">
 <div class="mono" style="color:#0D99FF">USE IT FOR</div><div style="font:600 28px Plex;color:#fff;margin-top:12px;line-height:1.25">{p['use']}</div>
 <div class="ar" style="font-size:28px;margin-top:12px;color:#EDEDED">{p['useAr']}</div>
 <div class="mono" style="color:#0D99FF;margin-top:44px">CONTRAST (WCAG)</div>
 {chk('Text on background',p['r1'])}{chk('Button text',p['r2'])}{chk('Secondary text',p['r3'])}
 <div style="font:500 17px Plex;color:#8A8A8A;margin-top:12px">Computed from the HEX codes.</div>
</div>{swipe()}</div>""")
rows=''.join(f'<div style="margin-bottom:26px"><div style="display:flex;justify-content:space-between"><span style="font:700 30px Plex;color:#fff">{i+1}. {p["n"].title()}</span></div><div style="display:flex;height:84px;border-radius:16px;overflow:hidden;margin-top:12px;border:1.5px solid #3A3B42">{"".join(f"<div style=\'flex:1;background:{p["c"][k]}\'></div>" for k,_,_ in ROLES)}</div></div>' for i,p in enumerate(P))
slides.append(f"""<div class="s" id="s7"><div class="top"><span>RECAP</span><span>AG STUDIO</span></div>
<div class="h" style="position:absolute;top:360px;left:76px;font-size:92px">PICK BY USE,<br>CHECK CONTRAST.</div>
<div class="ar" style="position:absolute;top:570px;right:80px;font-size:44px">اختر حسب الاستخدام، وتحقّق من التباين.</div>
<div style="position:absolute;top:660px;left:80px;right:80px">{rows}</div>{swipe()}</div>""")
slides.append(f"""<div class="s" id="s8" style="background:#0C8CE9"><div class="top" style="color:#D6ECFF"><span>LEARN UI/UX</span><span>AG STUDIO</span></div>
<div class="h" style="position:absolute;top:470px;left:76px;font-size:120px">SAVE THIS FOR<br>YOUR NEXT<br>PROJECT.</div>
<div class="ar" style="position:absolute;top:880px;right:80px;font-size:56px;color:#fff">احفظها لمشروعك القادم.</div>
<div style="position:absolute;top:1040px;left:80px;right:80px;border:3px solid #fff;border-radius:30px;padding:40px">
 <div style="font:700 50px Plex;color:#fff">Visit my profile</div><div style="font:600 30px Plex;color:#D6ECFF;margin-top:8px">for more UI/UX tutorials</div>
 <div class="ar" style="font-size:44px;color:#fff;margin-top:26px">زُر حسابي لمزيد من دروس UI/UX</div></div></div>""")
for mode,fn in [('','carousel.html'),('noswipe','short.html')]:
    open(fn,'w').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head><body class="{mode}">'+''.join(slides)+'</body></html>')
for p in P: print(p['n'], round(p['r1'],2), round(p['r2'],2), round(p['r3'],2))
