"""End-to-end smoke test: builds the app, serves dist/, and checks the core flows.

    pip install playwright && playwright install chromium
    python3 tests/smoke.py
"""
import functools, http.server, os, subprocess, sys, threading
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
subprocess.run([sys.executable, os.path.join(ROOT, 'build.py')], check=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

handler = functools.partial(Quiet, directory=os.path.join(ROOT, 'dist'))
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{srv.server_port}/'

def check(ok, msg):
    print(('PASS ' if ok else 'FAIL ') + msg)
    if not ok:
        sys.exit(1)

with sync_playwright() as p:
    browser = p.chromium.launch(**({'executable_path': os.environ['CHROME']} if os.environ.get('CHROME') else {}))
    ctx = browser.new_context(viewport={'width': 390, 'height': 844})
    page = ctx.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))

    page.goto(URL)
    page.wait_for_timeout(800)
    check(page.locator('#nm').count() == 1, 'first visit shows the welcome screen')
    page.fill('#nm', 'Tester')
    page.click('#go')
    page.wait_for_timeout(500)
    check(page.locator('[data-tab=today]').count() == 1, 'app loads with tab bar')

    # start a workout from the empty-week quick start and run one set
    page.get_by_role('button', name='Upper', exact=True).click()
    page.wait_for_timeout(300)
    check(page.evaluate('ses.ex.length') > 0, 'quick start loads a workout')
    page.locator('.item .t').first.click()
    page.evaluate('startSet(focus)')
    page.wait_for_timeout(1100)
    page.evaluate('finishSet(focus)')
    check(page.evaluate('ses.state') == 'rest', 'finishing a set starts the rest timer')
    check(page.evaluate('ses.ex.some(e => e.sets.some(s => s.tut > 900))'), 'time under tension was recorded')

    # the preview must not touch real data on the same origin
    page.goto(URL + 'preview.html')
    page.wait_for_timeout(1200)
    check(page.locator('.an-sample').count() == 1, 'preview opens on Analytics with sample data')
    page.click('[data-atab=advanced]')
    page.locator('[data-card=len] [data-drill]').first.click(force=True)
    page.wait_for_timeout(300)
    check(page.get_by_text('average of all sets').count() >= 1, 'tapping a point opens the drill-down')
    page.go_back()
    page.wait_for_timeout(300)
    check(page.locator('#app > .scrim, #app > .an-scrim').count() == 0, 'back closes the drill-down')
    page.go_back()
    page.wait_for_timeout(300)
    check(page.locator('[data-atab=overview].on').count() == 1, 'back goes from Advanced to Overview')
    page.goto(URL)
    page.wait_for_timeout(500)
    me = page.evaluate("localStorage.getItem('gym.me')") or ''
    hist = page.evaluate("JSON.parse(localStorage.getItem('gym.hist') || '[]').length")
    check('Tester' in me and hist < 5, 'real data survives opening the preview')

    check(not errors, 'no page errors' + ('' if not errors else ': ' + '; '.join(errors)))
    browser.close()
srv.shutdown()
print('all good')
