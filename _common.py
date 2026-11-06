"""Shared test helpers: build the app, serve dist/ on a free port, launch Chromium.

Set CHROME=/path/to/chrome to use a specific browser; otherwise Playwright's own Chromium is used.
"""
import functools, http.server, os, subprocess, sys, threading

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def build():
    subprocess.run([sys.executable, os.path.join(ROOT, 'build.py')], check=True, stdout=subprocess.DEVNULL)


class _Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def serve():
    """Serve dist/ and return (base_url, server)."""
    handler = functools.partial(_Quiet, directory=os.path.join(ROOT, 'dist'))
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return f'http://127.0.0.1:{srv.server_port}/', srv


def launch_args():
    exe = os.environ.get('CHROME')
    return {'executable_path': exe} if exe else {}


class Results:
    def __init__(self):
        self.rows = []

    def check(self, ok, msg):
        self.rows.append((bool(ok), msg))
        print(('PASS ' if ok else 'FAIL ') + msg, flush=True)

    def finish(self):
        bad = [m for ok, m in self.rows if not ok]
        print(f'\n{len(self.rows) - len(bad)}/{len(self.rows)} passed')
        sys.exit(1 if bad else 0)
