"""Build the app into dist/.

    python3 build.py

Output:
    dist/index.html     the app (one self-contained file)
    dist/preview.html   the same app seeded with a year of sample training, opening on Analytics
    dist/*              manifest, service worker and icons copied from public/

No dependencies beyond the Python standard library.
"""
import base64, os, re, shutil, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import theme  # noqa: E402

def read(*p):
    with open(os.path.join(ROOT, *p), encoding='utf-8') as f:
        return f.read()

DIST = os.path.join(ROOT, 'dist')
shutil.rmtree(DIST, ignore_errors=True)
shutil.copytree(os.path.join(ROOT, 'public'), DIST)

# 1. stitch the modules into the template
modules = ''.join(read('src', m) for m in ('plan.js', 'library.js', 'sched.js', 'analytics2.js', 'nav.js', 'cloud.js'))
app = read('src', 'src.html').replace('__PLANSTATS__', modules).replace('__SHEETS__', read('src', 'sheets.js'))
with open(os.path.join(ROOT, 'assets', 'fonts', 'DSEG7Classic-Bold.woff2'), 'rb') as f:
    app = app.replace('__FONT7__', base64.b64encode(f.read()).decode())

# 2. installable web app: manifest, icons, offline service worker
PWA_HEAD = '''<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="favicon.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Fitness">
<meta name="apple-mobile-web-app-status-bar-style" content="__SB__">'''
SW = ("<script>if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)&&window.top===window)"
      "{window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}</script>")

# cloud sync: firebase.config.json holds the web config from the Firebase console.
# It's safe to commit (it's not a secret); the Firestore rules decide who can read what.
FB = None
_fb = os.path.join(ROOT, 'firebase.config.json')
if os.path.exists(_fb):
    import json as _json
    _c = _json.load(open(_fb))
    if _c.get('apiKey') and _c.get('projectId') and 'PASTE' not in _c.get('apiKey', ''):
        FB = _json.dumps({k: _c[k] for k in ('apiKey', 'authDomain', 'projectId', 'appId', 'messagingSenderId', 'storageBucket') if k in _c})
print('cloud sync:', 'on' if FB else 'off (add firebase.config.json to turn it on)')

# 3. preview: same app, sample year, own storage space so it never touches a real user's data
STORAGE_SHIM = ("<script>(function(){const P='preview:',S=Storage.prototype,g=S.getItem,s=S.setItem,r=S.removeItem;"
                "S.getItem=function(k){return g.call(this,P+k)};S.setItem=function(k,v){return s.call(this,P+k,v)};"
                "S.removeItem=function(k){return r.call(this,P+k)}})();</script>\n")
preview = app.replace("let tab='today',", "let tab='stats',", 1)
i = preview.index('<script>')
preview = preview[:i] + STORAGE_SHIM + '<script>\n' + read('src', 'seed_year.js') + '\n</script>\n' + preview[i:]
preview = preview.replace('<title>Fitness Application</title>', '<title>Fitness App, 1 Year Preview</title>', 1)

# THEME=bright python3 build.py gives the cream variant; the default is the native off-black
THEME = os.environ.get('THEME', 'dark')
BG = '#121212' if THEME == 'dark' else theme.THEMES[THEME]['bg']

def finish(html, pwa):
    if THEME != 'dark':
        html = theme.apply(html, theme.THEMES[THEME])
    html = re.sub(r'<meta name="theme-color" content="[^"]*">\n?', '', html)
    head = '<meta name="theme-color" content="' + BG + '">'
    if pwa:
        head = PWA_HEAD.replace('__SB__', 'black' if THEME == 'dark' else 'default') + '\n' + head
    html = html.replace('</title>', '</title>\n' + head, 1)
    if pwa:
        html = html.replace('</body>', SW + '\n</body>', 1)
        if FB:
            html = html.replace('<script>', '<script>window.FB_CONFIG=' + FB + ';</script>\n<script>', 1)
    return html

import json
man = json.load(open(os.path.join(DIST, 'manifest.webmanifest')))
man['background_color'] = man['theme_color'] = BG
json.dump(man, open(os.path.join(DIST, 'manifest.webmanifest'), 'w'), indent=2)

for name, html, pwa in (('index.html', app, True), ('preview.html', preview, False)):
    with open(os.path.join(DIST, name), 'w', encoding='utf-8') as f:
        f.write(finish(html, pwa))
    print('built', 'dist/' + name)
