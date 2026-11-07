"""Build dist/artifact.html: the real app as one file for the Claude artifact preview.

It is dist/index.html with the Firebase SDK inlined and the "only in a top-level window" check
lifted, so sign up and cloud sync work inside the preview frame. Run build.py first.

    python3 tools/artifact.py
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
read = lambda *p: open(os.path.join(ROOT, *p), encoding='utf-8').read()

html = read('dist', 'index.html')
fb = read('public', 'firebase.js')
assert '</script' not in fb

# the SDK is already on the page, so load() uses it instead of fetching firebase.js
LOADER = "const s=document.createElement('script');s.src='firebase.js';s.onload=()=>{"
assert html.count(LOADER) == 1, 'cloud loader changed: update tools/artifact.py'
html = html.replace(LOADER, "const s={};const go=()=>{", 1)
APPEND = "s.onerror=()=>{loading=null;rej(new Error('load'))};document.head.appendChild(s)"
assert html.count(APPEND) == 1, 'cloud loader changed: update tools/artifact.py'
html = html.replace(APPEND, "go()", 1)

FRAME = "const ON=!!CFG&&/^https?:$/.test(location.protocol)&&window.top===window;"
assert html.count(FRAME) == 1, 'frame check changed: update tools/artifact.py'
html = html.replace(FRAME, "const ON=!!CFG;", 1)

i = html.index('<script>')
html = html[:i] + '<script>' + fb + '</script>\n' + html[i:]
html = html.replace('<title>Fitness Application</title>', '<title>Fitness App C (preview)</title>', 1)

open(os.path.join(ROOT, 'dist', 'artifact.html'), 'w', encoding='utf-8').write(html)
print('dist/artifact.html', len(html) // 1024, 'KB')
