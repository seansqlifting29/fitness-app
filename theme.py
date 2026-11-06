"""Bright cream theme.

The app is written against a dark palette. Every dark colour sits on one rung of LADDER,
and a theme supplies a colour for each rung. Colours that do two jobs (dark text on a
white button, the always-dark timer) are mapped explicitly in apply(), so nothing ends
up dark-on-dark or light-on-light.
"""
import re

LADDER={
 'html':['#0a0a0a'],
 'bg':['#121212'],
 'inset':['#151514','#171716'],
 'card':['#1a1a19','#1b1b1a','#1e1e1d','#1f1f1e'],
 'card2':['#222220','#242423','#262624'],
 'line':['#2a2a28','#2a2a2a','#2b2b29','#2e2e2b','#2e2e2c'],
 'line2':['#33332f','#333','#3a3a37','#3d3d3a'],
 'mid':['#444','#46463f','#4a4a46'],
 'mid2':['#555','#55554f','#5a5a55'],
 'mute':['#6f6f6a','#77766e'],
 't3':['#8a8980'],'t2':['#c3c2b7'],'t1':['#f0efec'],
}
def mix(a,b,t):
    a=[int(a[i:i+2],16) for i in (1,3,5)];b=[int(b[i:i+2],16) for i in (1,3,5)]
    return '#'+''.join('%02x'%round(a[k]*t+b[k]*(1-t)) for k in range(3))
THEMES={
 'bright':dict(html='#f3ecdd',bg='#fdf9f0',card='#ffffff',inset='#f7f2e8',card2='#f3ede1',line='#e9e1d2',line2='#dbd1bf',mid='#c6bba8',mid2='#b2a793',mute='#9b907d',t3='#776d5e',t2='#4a443a',t1='#1c1a16',name='Bright cream'),
 'butter':dict(html='#f0e6cf',bg='#fcf4e1',card='#fffbf2',inset='#f8f0de',card2='#f4ebd6',line='#e8dcc2',line2='#d9cbad',mid='#c4b493',mid2='#ae9e7e',mute='#988869',t3='#74674f',t2='#463d2e',t1='#1d1912',name='Buttercream'),
 'oat':dict(html='#ece5d8',bg='#f7f3ea',card='#fffefb',inset='#f3eee4',card2='#efe9dd',line='#e3dccf',line2='#d4cbbb',mid='#bdb3a2',mid2='#a99f8e',mute='#958b7a',t3='#73695a',t2='#463f35',t1='#1b1915',name='Oat'),
}
ACCENT_TEXT={'#5fd3a6':'#127a52','#f08d63':'#b4461b','#8fb3ec':'#2c64b8','#6d9eea':'#2c64b8','#3f9c78':'#147450'}
def apply(s,T):
    C=T['card'];I=T['t1']
    rep=[ # (exact text, replacement) for colours that do two jobs
     ('.tbtn{width:100%;height:60px;border-radius:18px;background:#fff;color:#111;','.tbtn{width:100%;height:60px;border-radius:18px;background:#fff;color:'+I+';'),
     ('background:#111;border:0;text-','background:'+T['card2']+';border:0;text-'),               # stepper number box
     ('.ssrow.big small{color:#55554f}','.ssrow.big small{color:'+mix(C,I,.72)+'}'),
     ('.ssrow.big .sic{background:#111;color:#fff}','.ssrow.big .sic{background:'+C+';color:'+I+'}'),
     ('.an-opt.on small{color:#55554f}','.an-opt.on small{color:'+mix(C,I,.72)+'}'),
     ('background:#2e2e2b;color:#fff;font-size:15px','background:'+I+';color:'+C+';font-size:15px'),  # edit-mode buttons
     ('.wchip.on{box-shadow:0 0 0 3px #1b1b1a,0 0 0 6px #fff}','.wchip.on{box-shadow:0 0 0 3px '+C+',0 0 0 6px '+I+'}'),
     ('border-radius:6px;box-shadow:inset 0 0 0 1.5px #f0efec}','border-radius:6px;box-shadow:none}'),
     ('.xbi.fresh{background:#2a2a25}','.xbi.fresh{background:'+mix('#c98500',C,.14)+'}'),
     ('flex:none;background:#262624;display:flex;','flex:none;background:'+I+';display:flex;'),     # timer stays dark
     ('font-weight="900" fill="#0e0e0e"','font-weight="900" fill="'+C+'"'),                         # chart pill text
    ]
    for a,b in rep:
        if a not in s:print('  missing pattern:',a[:50])
        s=s.replace(a,b)
    # "selected" pills: dark background (ink) with cream text
    s=re.sub(r'color:#111(?![0-9a-fA-F])','color:'+C,s)
    s=s.replace('border-color:#111}','border-color:'+C+'}').replace('style="color:#111"','style="color:'+C+'"')
    lookup={h:T[r] for r,hs in LADDER.items() for h in hs}
    lookup.update({'#171716':T['inset'],'#1c2536':mix('#3987e5',C,.13),'#5a3a3a':mix('#e66767',C,.35),'#4f7fc4':'#3a74cf'})
    lookup.update(ACCENT_TEXT)
    pat=re.compile('|'.join(re.escape(k) for k in sorted(lookup,key=len,reverse=True))+r'(?![0-9a-fA-F])',re.I)
    s=pat.sub(lambda m:lookup[m.group(0).lower()],s)
    r=','.join(str(int(I[i:i+2],16)) for i in (1,3,5));s=s.replace('rgba(240,239,236,','rgba('+r+',')
    extra=(".scard.past{opacity:1;filter:saturate(.45) brightness(1.06)}\n"
           ".an-card,.card{box-shadow:0 1px 2px rgba(60,45,20,.06)}\n"
           "#app{box-shadow:none}\n")
    s=s.replace('</style>',extra+'</style>',1)
    s=s.replace('<meta name="theme-color" content="#121212">','<meta name="theme-color" content="'+T['bg']+'">')
    return s
def leftovers(s):
    s=re.sub(r'url\(data:[^)]{200,}\)','',s)
    darks={}
    for m in re.finditer(r'#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-fA-F])',s):
        h=m.group(1);h=''.join(c*2 for c in h) if len(h)==3 else h
        r,g,b=int(h[0:2],16),int(h[2:4],16),int(h[4:6],16)
        if max(r,g,b)<0x60:darks[m.group(0).lower()]=darks.get(m.group(0).lower(),0)+1
    return darks
