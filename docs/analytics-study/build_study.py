"""Branch C study: chart concepts built from the sample year, drawn in the app's style, saved as a PDF.

    python3 docs/analytics-study/capture.py      (screens + sample data)
    python3 docs/analytics-study/build_study.py  (the PDF)
"""
import base64, json, math, os, random
from collections import defaultdict
from datetime import date, timedelta
import numpy as np
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
H = json.load(open(os.path.join(HERE, 'sample_hist.json')))
random.seed(3); np.random.seed(3)

# app palette
BG, CARD, CARD2, LINE = '#121212', '#1a1a19', '#242423', '#2a2a28'
T1, T2, T3 = '#f0efec', '#c3c2b7', '#8a8980'
GRN, ORG, BLU, RED, YEL, PNK, PUR = '#199e70', '#d95926', '#3987e5', '#e66767', '#d9a21b', '#e0508f', '#8b6fe0'
EXC = [GRN, BLU, ORG, YEL, PUR, PNK]

def esc(s): return str(s).replace('&', '&amp;').replace('<', '&lt;')
def short(n): return {'Incline Barbell Bench Press': 'Incline Bench', 'Chest Press Machine': 'Chest Press', 'Tricep Pushdown': 'Pushdown'}.get(n, n)
def e1(s): return s['w'] * (1 + s['r'] / 30) if s['w'] else None
def d(s): return date.fromisoformat(s)

# ---------------- svg helpers in the app's chart style ----------------
W, HH = 340, 190
def frame(body, h=HH): return f'<svg viewBox="0 0 {W} {h}" width="{W}" height="{h}" xmlns="http://www.w3.org/2000/svg" font-family="Inter,system-ui,sans-serif">{body}</svg>'
def txt(x, y, s, size=10, fill=T3, anchor='middle', weight=400): return f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" font-weight="{weight}">{esc(s)}</text>'
def pill(x, y, s, fill='#f0efec', col='#121212'):
    w = 7 * len(s) + 14
    return f'<rect x="{x-w/2:.1f}" y="{y-10:.1f}" width="{w}" height="18" rx="9" fill="{fill}"/>' + txt(x, y + 3.5, s, 10, col, weight=700)
def dot(x, y, c, r=4.2, ring=False): return f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{c}" stroke="{BG if not ring else T1}" stroke-width="{1.5 if not ring else 2}"/>'
def tri(x, y, c, r=5): return f'<path d="M{x:.1f} {y-r:.1f} L{x+r:.1f} {y+r*.8:.1f} L{x-r:.1f} {y+r*.8:.1f} Z" fill="{c}" stroke="{BG}" stroke-width="1.2"/>'
def poly(pts, c, w=2, dash=None, op=1): return f'<polyline points="{" ".join(f"{x:.1f},{y:.1f}" for x,y in pts)}" fill="none" stroke="{c}" stroke-width="{w}" stroke-opacity="{op}"' + (f' stroke-dasharray="{dash}"' if dash else '') + '/>'

class Ax:
    def __init__(s, x0, x1, y0, y1, L=38, R=10, T=12, B=24, h=HH):
        s.x0, s.x1, s.y0, s.y1, s.L, s.R, s.T, s.B, s.h = x0, x1, y0, y1, L, R, T, B, h
    def X(s, v): return s.L + (v - s.x0) / (s.x1 - s.x0 or 1) * (W - s.L - s.R)
    def Y(s, v): return s.h - s.B - (v - s.y0) / (s.y1 - s.y0 or 1) * (s.h - s.T - s.B)
    def yticks(s, vals, fmt=lambda v: f'{v:g}'):
        return ''.join(f'<line x1="{s.L}" x2="{W-s.R}" y1="{s.Y(v):.1f}" y2="{s.Y(v):.1f}" stroke="{LINE}" stroke-width="1"/>' + txt(s.L - 6, s.Y(v) + 3.5, fmt(v), 9.5, T3, 'end') for v in vals)
    def xlabels(s, items): return ''.join(txt(s.X(v), s.h - 7, l, 9.5) for v, l in items)

def card(color, label, head, chart, note='', where='', stat=''):
    tag = f'<span class="stat">{esc(stat)}</span>' if stat else ''
    wh = f'<span class="where">{esc(where)}</span>' if where else ''
    return f'''<div class="cardwrap"><div class="tags">{tag}{wh}</div><div class="acard" style="--c:{color}"><div class="lab">{esc(label)}</div><div class="hd">{head}</div>{chart}</div>{f'<p class="note">{note}</p>' if note else ''}</div>'''

# ---------------- data ----------------
push = [s for s in H if s['split'] == 'Push' and len(s['ex']) >= 4]
S = next(s for s in reversed(push) if s['date'] == '2026-11-02') if any(s['date'] == '2026-11-02' for s in push) else push[-1]
prev = [s for s in H if s['split'] == 'Push' and s['start'] < S['start']][-1]
prevmap = {e['name']: e for e in prev['ex']}

def drop_pct(sets):
    r = [x['r'] for x in sets[:3]]
    return (1 - r[-1] / r[0]) * 100 if len(r) >= 2 and r[0] else None
usual = defaultdict(list)
for s in H:
    if s['start'] >= S['start']: continue
    for e in s['ex']:
        v = drop_pct(e['sets'])
        if v is not None: usual[e['name']].append(v)
U = {k: (np.mean(v), np.std(v)) for k, v in usual.items()}

# ---------------- end-of-workout options ----------------
def eow_lines():
    exs = S['ex']; cols = 2; cw, ch = 158, 92; out = ''
    for i, e in enumerate(exs):
        ox, oy = (i % cols) * (cw + 12) + 6, (i // cols) * (ch + 10) + 4
        r = [x['r'] for x in e['sets']]; pr = [x['r'] for x in prevmap.get(e['name'], {'sets': []})['sets']]
        allr = r + pr; lo, hi = min(allr) - 1, max(allr) + 1
        X = lambda j, n=max(len(r), len(pr)): ox + 14 + j * (cw - 28) / max(1, n - 1)
        Y = lambda v: oy + 30 + (hi - v) / (hi - lo or 1) * (ch - 44)
        c = EXC[i % len(EXC)]
        out += f'<rect x="{ox}" y="{oy}" width="{cw}" height="{ch}" rx="10" fill="{CARD2}"/>'
        out += txt(ox + 10, oy + 16, short(e['name']), 10.5, T1, 'start', 700)
        lost = r[0] - r[-1]
        out += txt(ox + cw - 10, oy + 16, f'−{lost}' if lost > 0 else ('held' if lost == 0 else f'+{-lost}'), 10.5, RED if lost >= 3 else (GRN if lost <= 0 else T2), 'end', 700)
        if pr: out += poly([(X(j), Y(v)) for j, v in enumerate(pr)], T3, 1.5, '3 3') + ''.join(dot(X(j), Y(v), '#55554f', 3) for j, v in enumerate(pr))
        out += poly([(X(j), Y(v)) for j, v in enumerate(r)], c, 2.2) + ''.join(dot(X(j), Y(v), c, 4) + txt(X(j), Y(v) - 8, v, 9, T2) for j, v in enumerate(r))
        out += ''.join(txt(X(j), oy + ch - 5, f'S{j+1}', 8.5) for j in range(len(r)))
    h = math.ceil(len(exs) / cols) * (ch + 10) + 8
    leg = f'<div class="leg"><i style="background:{T2}"></i>Today <i style="background:#55554f"></i>Last Push ({d(prev["date"]).strftime("%b %-d")})</div>'
    return frame(out, h) + leg

def eow_bars():
    exs = S['ex']; n = len(exs); rowh = 34; h = n * rowh + 30
    ax = Ax(0, 50, 0, 1, L=96, R=24, h=h)
    out = ''.join(f'<line x1="{ax.X(v):.1f}" x2="{ax.X(v):.1f}" y1="6" y2="{h-22}" stroke="{LINE}"/>' + txt(ax.X(v), h - 7, f'{v}%', 9.5) for v in (0, 10, 20, 30, 40, 50))
    worst = max(exs, key=lambda e: (drop_pct(e['sets']) or 0) - U.get(e['name'], (0, 0))[0])
    for i, e in enumerate(exs):
        y = 14 + i * rowh; v = max(0, drop_pct(e['sets']) or 0); m, sd = U.get(e['name'], (10, 5))
        out += txt(8, y + 12, short(e['name']), 10.5, T1, 'start', 600)
        out += f'<rect x="{ax.X(max(0,m-sd)):.1f}" y="{y}" width="{ax.X(min(50,m+sd))-ax.X(max(0,m-sd)):.1f}" height="18" rx="4" fill="#34342f"/>'
        out += f'<line x1="{ax.X(m):.1f}" x2="{ax.X(m):.1f}" y1="{y-2}" y2="{y+20}" stroke="{T3}" stroke-width="1.5"/>'
        c = RED if v > m + sd else (GRN if v < m - sd or v == 0 else ORG)
        out += f'<rect x="{ax.L}" y="{y+5}" width="{max(3,ax.X(min(v,50))-ax.L):.1f}" height="8" rx="4" fill="{c}"/>'
        out += txt(ax.X(min(v, 50)) + 6, y + 13, f'{v:.0f}%', 9.5, T2, 'start', 700)
    leg = f'<div class="leg"><i style="background:{ORG}"></i>Reps lost set 1 to 3 <i style="background:#34342f"></i>Your usual range</div>'
    return frame(out, h) + leg, worst

def eow_grid():
    exs = S['ex']; ns = max(len(e['sets']) for e in exs); rowh = 30; h = len(exs) * rowh + 26
    out = ''.join(txt(126 + j * 52 + 22, 12, f'Set {j+1}', 9.5) for j in range(ns))
    for i, e in enumerate(exs):
        y = 20 + i * rowh; r0 = e['sets'][0]['r']
        out += txt(8, y + 17, short(e['name']), 10.5, T1, 'start', 600)
        for j, s in enumerate(e['sets']):
            f = s['r'] / r0; c = GRN if f >= .95 else (YEL if f >= .8 else (ORG if f >= .65 else RED))
            out += f'<rect x="{126+j*52}" y="{y}" width="46" height="24" rx="6" fill="{c}" fill-opacity="{.35+.5*min(1,f)}"/>' + txt(126 + j * 52 + 23, y + 16, s['r'], 11.5, T1, weight=700)
    return frame(out, h) + f'<div class="leg"><i style="background:{GRN}"></i>Kept 95%+ <i style="background:{YEL}"></i>80%+ <i style="background:{ORG}"></i>65%+ <i style="background:{RED}"></i>Below</div>'

def eow_vol():
    exs = S['ex']; ax = Ax(0, len(exs) - .2, 0, 1, L=10, R=10, T=26, B=30, h=180)
    v_today = [sum(x['w'] * x['r'] for x in e['sets']) for e in exs]
    v_last = [sum(x['w'] * x['r'] for x in prevmap.get(e['name'], {'sets': []})['sets']) for e in exs]
    mx = max(v_today + v_last) * 1.15; ax.y1 = mx
    out = ''
    bw = 26
    for i, e in enumerate(exs):
        x = ax.X(i) + 30
        out += f'<rect x="{x-bw-2:.1f}" y="{ax.Y(v_last[i]):.1f}" width="{bw}" height="{ax.Y(0)-ax.Y(v_last[i]):.1f}" rx="4" fill="#3a3a36"/>'
        c = GRN if v_today[i] >= v_last[i] else ORG
        out += f'<rect x="{x+2:.1f}" y="{ax.Y(v_today[i]):.1f}" width="{bw}" height="{ax.Y(0)-ax.Y(v_today[i]):.1f}" rx="4" fill="{c}"/>'
        dlt = (v_today[i] / v_last[i] - 1) * 100 if v_last[i] else 0
        out += txt(x + 2 + bw / 2, ax.Y(v_today[i]) - 6, f'{dlt:+.0f}%', 9.5, c, weight=700)
        out += txt(x, 172, short(e['name']).split()[0], 9.5)
    return frame(out, 180) + f'<div class="leg"><i style="background:#3a3a36"></i>Last Push <i style="background:{GRN}"></i>Today (kg × reps)</div>', sum(v_today), sum(v_last)

def eow_rest():
    pts = []
    for i, e in enumerate(S['ex']):
        r0 = e['sets'][0]['r']
        for j, s in enumerate(e['sets'][1:], 1):
            if s.get('rest'): pts.append((s['rest'] / 1000, s['r'] / r0 * 100, EXC[i % len(EXC)], j))
    ax = Ax(30, 240, 50, 115)
    out = ax.yticks([60, 80, 100], lambda v: f'{v:.0f}%') + ax.xlabels([(60, '1:00'), (120, '2:00'), (180, '3:00'), (240, '4:00')])
    out += f'<rect x="{ax.X(150):.1f}" y="{ax.T}" width="{ax.X(240)-ax.X(150):.1f}" height="{ax.h-ax.T-ax.B}" fill="#ffffff" fill-opacity=".04"/>' + txt(ax.X(195), ax.T + 12, 'your sweet spot', 9, T3)
    for x, y, c, j in pts:
        out += (dot if j == 1 else tri)(ax.X(min(x, 240)), ax.Y(max(52, min(113, y))), c)
    return frame(out)

# ---------------- analytics concepts ----------------
def ex_sessions(name):
    out = []
    for s in H:
        for e in s['ex']:
            if e['name'] == name and e['sets']: out.append((s, e))
    return out

def c_drop_trend(name='Back Squat'):
    wk = defaultdict(list)
    for s, e in ex_sessions(name):
        v = drop_pct(e['sets'])
        if v is not None: wk[(d(s['date']) - d(H[0]['date'])).days // 28].append(v)
    ks = sorted(wk); vals = [np.mean(wk[k]) for k in ks]
    ax = Ax(ks[0], ks[-1], 0, max(vals) * 1.25)
    out = ax.yticks([0, 10, 20, 30] if max(vals) > 25 else [0, 10, 20], lambda v: f'{v:.0f}%')
    out += poly([(ax.X(k), ax.Y(v)) for k, v in zip(ks, vals)], GRN) + ''.join(dot(ax.X(k), ax.Y(v), GRN) for k, v in zip(ks, vals))
    b = int(np.argmin(vals)); out += pill(ax.X(ks[b]), ax.Y(vals[b]) - 14, 'Best')
    first = d(H[0]['date'])
    out += ax.xlabels([(ks[0], (first + timedelta(days=28 * ks[0])).strftime('%b')), (ks[len(ks)//2], (first + timedelta(days=28 * ks[len(ks)//2])).strftime('%b')), (ks[-1], 'Now')])
    return frame(out), vals[-1], vals[0]

def c_rest_hist():
    rests = [x['rest'] / 1000 for s in H for e in s['ex'] for x in e['sets'] if x.get('rest')]
    bins = list(range(30, 271, 30)); cnt = [sum(1 for r in rests if b <= r < b + 30) for b in bins[:-1]]
    med = float(np.median(rests))
    ax = Ax(30, 270, 0, max(cnt) * 1.2, L=14)
    out = ''
    for b, c in zip(bins[:-1], cnt):
        out += f'<rect x="{ax.X(b)+2:.1f}" y="{ax.Y(c):.1f}" width="{ax.X(b+30)-ax.X(b)-4:.1f}" height="{ax.Y(0)-ax.Y(c):.1f}" rx="4" fill="{ORG}" fill-opacity="{.45 if not (b<=med<b+30) else 1}"/>'
    out += f'<line x1="{ax.X(med):.1f}" x2="{ax.X(med):.1f}" y1="{ax.T}" y2="{ax.Y(0)}" stroke="{T1}" stroke-dasharray="3 3"/>' + pill(ax.X(med), ax.T + 6, f'Median {int(med//60)}:{int(med%60):02d}')
    out += ax.xlabels([(60, '1:00'), (120, '2:00'), (180, '3:00'), (240, '4:00')])
    return frame(out), med, len(rests)

def c_rest_reg():
    xs, ys = [], []
    for s in H:
        for e in s['ex']:
            ss = e['sets']
            if len(ss) >= 2 and ss[0]['r'] >= 5 and ss[1].get('rest'):
                xs.append(ss[1]['rest'] / 1000); ys.append(ss[1]['r'] / ss[0]['r'] * 100)
    xs, ys = np.array(xs), np.array(ys)
    A = np.vstack([np.ones_like(xs), np.log(xs)]).T; coef, *_ = np.linalg.lstsq(A, ys, rcond=None)
    res = ys - A @ coef; sd = res.std()
    ax = Ax(40, 240, 55, 115)
    out = ax.yticks([60, 80, 100], lambda v: f'{v:.0f}%') + ax.xlabels([(60, '1:00'), (120, '2:00'), (180, '3:00'), (240, '4:00')])
    idx = np.random.choice(len(xs), min(160, len(xs)), replace=False)
    out += ''.join(f'<circle cx="{ax.X(min(240,max(40,xs[i]))):.1f}" cy="{ax.Y(max(56,min(114,ys[i]))):.1f}" r="2.6" fill="{BLU}" fill-opacity=".45"/>' for i in idx)
    g = np.linspace(45, 240, 40); f = coef[0] + coef[1] * np.log(g)
    band = [(ax.X(x), ax.Y(min(114, y + sd * .6))) for x, y in zip(g, f)] + [(ax.X(x), ax.Y(max(56, y - sd * .6))) for x, y in zip(g[::-1], f[::-1])]
    out += f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x,y in band)}" fill="{BLU}" fill-opacity=".15"/>'
    out += poly([(ax.X(x), ax.Y(y)) for x, y in zip(g, f)], T1, 2.2)
    gain = (coef[0] + coef[1] * math.log(150)) - (coef[0] + coef[1] * math.log(90))
    return frame(out), gain, len(xs)

def c_logistic():
    xs, ys = [], []
    for s in H:
        for e in s['ex']:
            ss = e['sets']
            if len(ss) >= 3 and ss[2].get('rest'):
                xs.append(ss[2]['rest'] / 1000); ys.append(1.0 if ss[2]['r'] >= ss[0]['r'] - 1 else 0.0)
    xs, ys = np.array(xs), np.array(ys); m, s0 = xs.mean(), xs.std()
    z = (xs - m) / s0; a = b = 0.0
    for _ in range(3000):
        p = 1 / (1 + np.exp(-(a + b * z))); a -= .1 * np.mean(p - ys); b -= .1 * np.mean((p - ys) * z)
    P = lambda x: 1 / (1 + math.exp(-(a + b * (x - m) / s0)))
    ax = Ax(40, 240, 0, 1)
    out = ax.yticks([0, .5, 1], lambda v: f'{v*100:.0f}%') + ax.xlabels([(60, '1:00'), (120, '2:00'), (180, '3:00'), (240, '4:00')])
    # binned actual
    for b0 in range(45, 240, 30):
        sel = ys[(xs >= b0) & (xs < b0 + 30)]
        if len(sel) > 8: out += dot(ax.X(b0 + 15), ax.Y(sel.mean()), PUR, 4.2)
    g = np.linspace(40, 240, 50); out += poly([(ax.X(x), ax.Y(P(x))) for x in g], GRN, 2.4)
    x90 = 120; out += f'<line x1="{ax.X(x90):.1f}" x2="{ax.X(x90):.1f}" y1="{ax.Y(P(x90)):.1f}" y2="{ax.Y(0)}" stroke="{T3}" stroke-dasharray="3 3"/>' + pill(ax.X(x90), ax.Y(P(x90)) - 14, f'2:00 → {P(x90)*100:.0f}%')
    return frame(out), P(60), P(150)

def e1_series(name='Back Squat'):
    ser = []
    for s, e in ex_sessions(name):
        v = max((e1(x) for x in e['sets'] if e1(x)), default=None)
        if v: ser.append((d(s['date']), v))
    return ser

def c_control(name='Back Squat'):
    ser = e1_series(name); v = np.array([y for _, y in ser]); n = len(v)
    roll = np.array([v[max(0, i - 7):i + 1].mean() for i in range(n)]); sd = np.array([v[max(0, i - 7):i + 1].std() if i > 2 else v[:4].std() for i in range(n)])
    ax = Ax(0, n - 1, (v.min() // 10) * 10 - 5, (v.max() // 10 + 1) * 10 + 5)
    band = [(ax.X(i), ax.Y(roll[i] + 2 * sd[i])) for i in range(n)] + [(ax.X(i), ax.Y(roll[i] - 2 * sd[i])) for i in range(n - 1, -1, -1)]
    out = ax.yticks(list(range(int(ax.y0 // 20 * 20 + 20), int(ax.y1), 20)), lambda v: f'{v:.0f}')
    out += f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x,y in band)}" fill="{BLU}" fill-opacity=".13"/>' + poly([(ax.X(i), ax.Y(roll[i])) for i in range(n)], BLU, 1.6, '4 3')
    odd = [i for i in range(4, n) if abs(v[i] - roll[i - 1]) > 2 * max(sd[i - 1], 1)]
    out += ''.join(f'<circle cx="{ax.X(i):.1f}" cy="{ax.Y(v[i]):.1f}" r="2.8" fill="{T2}"/>' for i in range(n) if i not in odd)
    for i in odd: out += dot(ax.X(i), ax.Y(v[i]), RED, 5)
    if odd: out += pill(ax.X(odd[-1]), ax.Y(v[odd[-1]]) + (18 if v[odd[-1]] < roll[odd[-1]] else -14), 'Off day' if v[odd[-1]] < roll[odd[-1]] else 'Big day')
    out += ax.xlabels([(0, ser[0][0].strftime("%b '%y")), (n // 2, ser[n // 2][0].strftime('%b')), (n - 1, 'Now')])
    return frame(out), len(odd)

def c_boot(name='Back Squat'):
    ser = e1_series(name); end = ser[-1][0]
    a = np.array([v for t, v in ser if (end - t).days < 42]); b = np.array([v for t, v in ser if 42 <= (end - t).days < 84])
    diffs = np.array([np.random.choice(a, len(a)).mean() - np.random.choice(b, len(b)).mean() for _ in range(3000)])
    lo, hi = np.percentile(diffs, [5, 95]); obs = a.mean() - b.mean()
    allv = np.concatenate([a, b]); ax = Ax(0, 1, allv.min() - 6, allv.max() + 6, L=40, R=118)
    out = ax.yticks([round(x, -1) for x in np.linspace(ax.y0 + 4, ax.y1 - 4, 3)], lambda v: f'{v:.0f}')
    for k, (arr, c, lab) in enumerate([(b, '#77776f', '6 to 12 wk ago'), (a, GRN, 'Last 6 wk')]):
        cx = 80 + k * 90
        out += ''.join(f'<circle cx="{cx + random.uniform(-16,16):.1f}" cy="{ax.Y(v):.1f}" r="3.4" fill="{c}" fill-opacity=".8"/>' for v in arr)
        out += f'<line x1="{cx-24}" x2="{cx+24}" y1="{ax.Y(arr.mean()):.1f}" y2="{ax.Y(arr.mean()):.1f}" stroke="{T1}" stroke-width="2.5"/>' + txt(cx, HH - 7, lab, 9.5)
    # CI ruler on the right
    rx = W - 60; s = 3.0
    out += txt(rx, 18, 'Change', 9.5, T3) + f'<line x1="{rx}" x2="{rx}" y1="{HH/2 - lo*s:.1f}" y2="{HH/2 - hi*s:.1f}" stroke="{GRN if lo>0 else YEL}" stroke-width="6" stroke-linecap="round"/>'
    out += f'<line x1="{rx-14}" x2="{rx+14}" y1="{HH/2}" y2="{HH/2}" stroke="{T3}" stroke-dasharray="2 2"/>' + txt(rx + 18, HH / 2 + 3, '0', 9, T3, 'start')
    out += dot(rx, HH / 2 - obs * s, T1, 4.5) + txt(rx + 10, HH / 2 - obs * s + 3.5, f'{obs:+.1f} kg', 10, T1, 'start', 700)
    return frame(out), obs, lo, hi

def c_forecast(name='Back Squat'):
    ser = e1_series(name); t0 = ser[0][0]; x = np.array([(t - t0).days / 7 for t, _ in ser]); y = np.array([v for _, v in ser])
    sel = x >= x.max() - 16; b, a = np.polyfit(x[sel], y[sel], 1); sd = (y[sel] - (a + b * x[sel])).std()
    fx = np.linspace(x.max(), x.max() + 8, 9)
    ax = Ax(x.max() - 26, x.max() + 8, min(y[x >= x.max() - 26]) - 8, max(max(y), a + b * fx[-1] + 1.6 * sd) + 4)
    out = ax.yticks([round(v, -1) for v in np.linspace(ax.y0 + 5, ax.y1 - 5, 3)], lambda v: f'{v:.0f}')
    band = [(ax.X(v), ax.Y(a + b * v + sd * (1 + .12 * (v - x.max())))) for v in fx] + [(ax.X(v), ax.Y(a + b * v - sd * (1 + .12 * (v - x.max())))) for v in fx[::-1]]
    out += f'<polygon points="{" ".join(f"{p:.1f},{q:.1f}" for p,q in band)}" fill="{GRN}" fill-opacity=".14"/>'
    vis = x >= ax.x0
    out += poly([(ax.X(p), ax.Y(q)) for p, q in zip(x[vis], y[vis])], '#55554f', 1.4) + ''.join(dot(ax.X(p), ax.Y(q), T2, 3) for p, q in zip(x[vis], y[vis]))
    out += poly([(ax.X(v), ax.Y(a + b * v)) for v in fx], GRN, 2.2, '5 4') + dot(ax.X(fx[-1]), ax.Y(a + b * fx[-1]), GRN, 5, True)
    out += pill(ax.X(fx[-1]) - 22, ax.Y(a + b * fx[-1]) - 16, f'~{a+b*fx[-1]:.0f} kg')
    out += f'<line x1="{ax.X(x.max()):.1f}" x2="{ax.X(x.max()):.1f}" y1="{ax.T}" y2="{ax.Y(ax.y0)}" stroke="{T3}" stroke-dasharray="2 3"/>' + ax.xlabels([(x.max() - 24, '6 mo ago'), (x.max(), 'Now'), (x.max() + 8, '+8 wk')])
    return frame(out), b * 4.3, a + b * fx[-1]

def c_kmeans():
    F, lab = [], []
    for s in H:
        reps = [x['r'] for e in s['ex'] for x in e['sets'] if x['w']]
        rests = [x['rest'] / 1000 for e in s['ex'] for x in e['sets'] if x.get('rest')]
        if reps and rests: F.append([np.mean(reps), np.mean(rests) / 60]); lab.append(s['date'])
    F = np.array(F); Z = (F - F.mean(0)) / F.std(0)
    C = Z[np.random.choice(len(Z), 3, replace=False)]
    for _ in range(50):
        k = np.argmin(((Z[:, None] - C) ** 2).sum(2), 1); C = np.array([Z[k == j].mean(0) for j in range(3)])
    cent = np.array([F[k == j].mean(0) for j in range(3)]); order = np.argsort(cent[:, 0])
    names = {order[0]: ('Heavy, long rests', ORG), order[1]: ('Middle ground', BLU), order[2]: ('Pump, short rests', GRN)}
    ax = Ax(F[:, 0].min() - 1, F[:, 0].max() + 1, F[:, 1].min() - .2, F[:, 1].max() + .2)
    out = ax.yticks([1.5, 2, 2.5], lambda v: f'{int(v)}:{int(v%1*60):02d}') + ax.xlabels([(v, f'{v} reps') for v in range(int(ax.x0) + 1, int(ax.x1), 3)])
    out += ''.join(f'<circle cx="{ax.X(p[0]):.1f}" cy="{ax.Y(p[1]):.1f}" r="3.2" fill="{names[k[i]][1]}" fill-opacity=".75"/>' for i, p in enumerate(F))
    legend = ''.join(f'<i style="background:{c}"></i>{n} ' for j, (n, c) in sorted(names.items(), key=lambda kv: list(order).index(kv[0])))
    share = {names[j][0]: int((k == j).mean() * 100) for j in range(3)}
    return frame(out) + f'<div class="leg">{legend}</div>', share

# ---------------- page ----------------
from PIL import Image
def crop(src, dst, top, bottom):
    im = Image.open(os.path.join(HERE, 'shots', src)); im.crop((0, top if top >= 0 else im.height + top, im.width, bottom if bottom > 0 else im.height)).save(os.path.join(HERE, 'shots', dst))
crop('analytics_overview.png', 'ov_top.png', 0, 2100); crop('analytics_overview.png', 'ov_bottom.png', -1900, 0)
def img(p):
    return 'data:image/png;base64,' + base64.b64encode(open(os.path.join(HERE, 'shots', p), 'rb').read()).decode()

lines_svg = eow_lines(); (bars_svg, worst) = eow_bars(); grid_svg = eow_grid(); vol_svg, vt, vl = eow_vol(); rest_svg = eow_rest()
dt_svg, dt_now, dt_first = c_drop_trend(); rh_svg, med, nrest = c_rest_hist(); rr_svg, gain, nreg = c_rest_reg(); lg_svg, p60, p150 = c_logistic()
ctl_svg, nodd = c_control(); bt_svg, obs, lo, hi = c_boot(); fc_svg, perm, f8 = c_forecast(); km_svg, share = c_kmeans()

worst_v = drop_pct(worst['sets']); worst_u = U.get(worst['name'], (0, 0))[0]
sesdate = d(S['date']).strftime('%a %b %-d')

def sheet(title, sub, chart, h=None):
    return f'''<div class="phone"><div class="dim"></div><div class="sheet"><div class="grab"></div><h3>Workout saved</h3><p class="ss">51:20 in the gym · 12 sets · 6:10 under tension · 24:05 resting</p>
    <div class="acard" style="--c:{GRN};margin:12px 0 10px"><div class="lab">{esc(title)}</div><div class="hd">{sub}</div>{chart}</div><button class="done">Done</button></div></div>'''

css = f'''
@page{{size:Letter;margin:.5in}}
*{{box-sizing:border-box}}
body{{margin:0;font-family:Inter,system-ui,sans-serif;color:#1f2937;font-variant-numeric:tabular-nums}}
section{{page-break-before:always}} section.first{{page-break-before:auto}}
h1{{font-size:34px;margin:0 0 6px}} h2{{font-size:22px;margin:0 0 4px}} .lead{{color:#4b5563;font-size:14px;margin:0 0 18px;line-height:1.5}}
.kick{{text-transform:uppercase;letter-spacing:.08em;font-size:11px;font-weight:700;color:{GRN};margin:0 0 6px}}
.box{{background:#f3f4f6;border-radius:12px;padding:14px 18px;font-size:13.5px;line-height:1.55;margin:0 0 14px}}
.box b{{color:#111}}
.row{{display:flex;gap:18px;align-items:flex-start;justify-content:center}}
.shot{{position:relative;width:225px}} .shot img{{width:225px;border-radius:22px;display:block;border:6px solid #0a0a0a}}
.shot .cap{{font-size:12px;color:#374151;text-align:center;margin-top:6px;line-height:1.35}}
.mark{{position:absolute;border:2.5px dashed {YEL};border-radius:10px;background:rgba(217,162,27,.12)}}
.mark span{{position:absolute;left:50%;transform:translateX(-50%);top:-24px;white-space:nowrap;background:{YEL};color:#111;font-size:10.5px;font-weight:700;padding:3px 8px;border-radius:999px}}
.grid2{{display:grid;grid-template-columns:1fr 1fr;gap:16px 18px}}
.cardwrap{{break-inside:avoid}}
.tags{{display:flex;gap:6px;margin-bottom:6px;flex-wrap:wrap}}
.stat{{background:#ede9fe;color:#5b21b6;font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:.05em}}
.where{{background:#ecfdf5;color:#065f46;font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:.05em}}
.acard{{background:{CARD};border-radius:16px;padding:12px 0 10px;border-top:3px solid var(--c);width:340px;color:{T1}}}
.acard .lab{{color:var(--c);font-size:10.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:0 14px}}
.acard .hd{{font-size:17px;font-weight:800;padding:2px 14px 8px;line-height:1.25}}
.acard .hd small{{color:{T3};font-weight:600;font-size:13px}}
.leg{{font-size:10.5px;color:{T2};padding:4px 14px 0;display:flex;flex-wrap:wrap;gap:4px 10px;align-items:center}}
.leg i{{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:-6px}}
.note{{font-size:12px;color:#374151;line-height:1.45;margin:8px 2px 0;width:340px}}
.optrow{{display:flex;gap:22px;align-items:center;break-inside:avoid;page-break-inside:avoid;margin-bottom:18px}} .optrow .opt{{flex:1}}
.phone{{position:relative;width:340px;flex:0 0 340px;height:auto;background:#0a0a0a;border-radius:28px;padding:34px 0 0;overflow:hidden;border:6px solid #0a0a0a}}
.phone .dim{{position:absolute;inset:0;background:linear-gradient(#141414,#0d0d0d)}}
.sheet{{position:relative;background:#1f1f1e;border-radius:20px 20px 0 0;padding:10px 0 14px;color:{T1}}}
.sheet .grab{{width:38px;height:4px;border-radius:2px;background:#4a4a46;margin:0 auto 10px}}
.sheet h3{{margin:0 14px 2px;font-size:17px}} .sheet .ss{{margin:0 14px;color:{T2};font-size:12px;line-height:1.4}}
.sheet .acard{{width:auto;margin:12px 6px 10px!important;background:{BG}}}
.done{{display:block;margin:0 14px;width:calc(100% - 28px);height:40px;border:0;border-radius:12px;background:#eceae5;font-weight:700;font-size:14px}}
.opt{{font-size:12.5px;line-height:1.45;color:#374151}} .opt h4{{margin:0 0 4px;font-size:15px;color:#111}}
.pros{{margin:6px 0 0;padding-left:16px}} .pros li{{margin-bottom:2px}}
.tbl{{width:100%;border-collapse:collapse;font-size:12.5px}} .tbl td,.tbl th{{border-bottom:1px solid #e5e7eb;padding:7px 6px;text-align:left;vertical-align:top}} .tbl th{{font-size:11px;text-transform:uppercase;color:#6b7280;letter-spacing:.05em}}
'''

dt_head = f'Squat drop-off {dt_now:.0f}% <small>from {dt_first:.0f}% a year ago</small>'

body = f'''
<section class="first">
<p class="kick">Branch C · analytics study</p>
<h1>Better analytics: options</h1>
<p class="lead">Chart ideas for the app, built from the statistics study and drawn in the app's own style. Every chart here is real math run on the 1-year sample data, not made-up numbers. Nothing is built yet. Branch B (feedback) and main are untouched.</p>
<div class="box"><b>What's inside</b><br>1. Where things live today (current screens)<br>2. End-of-workout charts: 5 options for set-to-set rep drop-off<br>3. New Analytics cards, each tied to a stats idea<br>4. A short pick list so you can circle what you want</div>
<div class="box"><b>How to read each card</b><br><span class="stat">Stats idea</span> which concept from the study it uses &nbsp; <span class="where">Where</span> where it would live in the app.<br>The dark card is what it would look like on your phone. The note under it says what it tells you, in plain words.</div>
</section><section><h2>Where things live today</h2>
<p class="lead">Yellow boxes mark where the new charts would go.</p>
<div class="row">
 <div class="shot"><img src="{img('today.png')}"><div class="cap"><b>Today</b><br>The checklist. No charts here, on purpose.</div></div>
 <div class="shot"><img src="{img('workout_rest.png')}"><div class="mark" style="left:14px;right:14px;top:92px;height:46px"><span>Live drop-off chip (option)</span></div><div class="cap"><b>During the workout</b><br>Half list, half timer. Keep it clean.</div></div>
 <div class="shot"><img src="{img('workout_saved.png')}"><div class="mark" style="left:10px;right:10px;top:300px;height:70px"><span>End-of-workout chart</span></div><div class="cap"><b>Workout saved</b><br>Today it's one line of text. This is the spot for the daily chart.</div></div>
</div>
</section>

<section>
<h2>Analytics today</h2>
<p class="lead">Overview (top and bottom of the scroll) and Advanced, as they are on branch B. New cards would slot into these lists, in the same card style.</p>
<div class="row">
 <div class="shot" style="width:170px"><img src="{img('ov_top.png')}" style="width:170px"><div class="cap"><b>Overview, top</b></div></div>
 <div class="shot" style="width:170px"><img src="{img('ov_bottom.png')}" style="width:170px"><div class="mark" style="left:10px;right:10px;bottom:94px;height:38px"><span>New Overview cards</span></div><div class="cap"><b>Overview, bottom</b></div></div>
 <div class="shot" style="width:170px"><img src="{img('analytics_advanced.png')}" style="width:170px"><div class="mark" style="left:10px;right:10px;top:398px;height:32px"><span>New Advanced cards</span></div><div class="cap"><b>Advanced</b></div></div>
</div>
<div class="box" style="margin-top:16px">The Advanced tab already uses some of the stats: <b>Rest</b> (98% of reps back by 3:00) is close to a regression, and <b>Set length</b> is a grouped average. The new cards build on these rather than replace them.</div>
</section>

<section>
<p class="kick">End of workout</p>
<h2>Set-to-set rep drop-off: 5 options</h2>
<p class="lead">Each shown inside the Workout saved sheet, using a real Push day from the sample ({sesdate}). Compared with the Push before it.</p>
<div class="rows">
 <div class="optrow"><div>{sheet('Reps set to set', f'Chest Press lost the most <small>today</small>', lines_svg)}</div>
 <div class="opt"><h4>A. Small lines per exercise</h4>One mini chart per exercise: today's reps across sets in color, last time as a faint dashed line. The number top right is reps lost from set 1 to the last set.
 <ul class="pros"><li>Most direct answer to "how did my reps fall off?"</li><li>Easy to compare with last time at a glance</li><li>Grows tall with 5 to 6 exercises</li></ul>
 <p style="margin-top:10px"><span class="stat">Descriptive</span> <span class="stat">Time series (tiny)</span></p></div>
 </div><div class="optrow"><div>{sheet('Drop-off vs usual', f'{short(worst["name"])} dropped {worst_v:.0f}% <small>usual {worst_u:.0f}%</small>', bars_svg)}</div>
 <div class="opt"><h4>B. Drop-off bars against your usual range</h4>One bar per exercise: % of reps lost from set 1 to set 3. The gray band is your normal range (average, plus or minus one standard deviation from your history), with a line at your average.
 <ul class="pros"><li>Tells you if today was normal, not just what happened</li><li>Red = more fatigue than usual, green = held up better</li><li>Stays short no matter how many sets</li></ul>
 <p style="margin-top:10px"><span class="stat">Mean</span> <span class="stat">Standard deviation</span></p></div>
</div></div>
</section>

<section>
<div class="rows">
 <div class="optrow"><div>{sheet('Every set', 'Pec Deck held every rep', grid_svg)}</div>
 <div class="opt"><h4>C. Set grid</h4>A tiny table: exercises down, sets across. Each square shows the reps, colored by how much of set 1 you kept.
 <ul class="pros"><li>The most compact, reads like a scoreboard</li><li>Shows the exact rep counts</li><li>Less visual than a line</li></ul>
 <p style="margin-top:10px"><span class="stat">Descriptive</span> <span class="stat">Heat map</span></p></div>
 </div><div class="optrow"><div>{sheet('Work done', f'{(vt/vl-1)*100:+.0f}% total volume <small>vs last Push</small>', vol_svg)}</div>
 <div class="opt"><h4>D. Volume today vs last time</h4>Weight × reps per exercise, today next to last time. Percent change on top.
 <ul class="pros"><li>One number that blends weight and reps</li><li>Doesn't show the set-to-set fall itself</li><li>Good as a second chart under A or B</li></ul>
 <p style="margin-top:10px"><span class="stat">Bar plot</span></p></div>
 </div><div class="optrow"><div>{sheet('Rest vs reps kept', 'How rest affected each set', rest_svg)}</div>
 <div class="opt"><h4>E. Rest vs reps kept</h4>Every set after the first is a dot: how long you rested, and what % of set 1 reps you got. Circles are set 2, triangles set 3, colored by exercise.
 <ul class="pros"><li>Explains why a drop happened</li><li>Links straight to the rest timer, the heart of the app</li><li>Few dots on a single day, so better as a weekly view</li></ul>
 <p style="margin-top:10px"><span class="stat">Linear regression (visual)</span></p></div>
</div></div>
<div class="box" style="margin-top:12px"><b>My pick:</b> B in the sheet (it answers "was today normal?"), with a tap to open A for the detail. That keeps the sheet short, so it never feels like homework after a workout.</div>
</section>

<section>
<p class="kick">Analytics tab</p>
<h2>New cards, one per stats idea</h2>
<p class="lead">All on the sample year. Squat is used where one exercise is needed; each card would have the same exercise picker the app already has.</p>
<div class="grid2">
 {card(GRN, 'Drop-off trend', dt_head, dt_svg, 'Average % of reps lost from set 1 to set 3, month by month. Going down means your conditioning between sets is improving, even if the weight on the bar isn\'t moving.', 'Advanced', 'Time series')}
 {card(ORG, 'Your rests', f'Median rest {int(med//60)}:{int(med%60):02d} <small>{nrest} rests</small>', rh_svg, 'How long you actually rest, as a histogram. The median ignores the odd 6-minute chat. Pairs with the rest timer: is your target realistic?', 'Overview', 'Histogram · Median')}
 {card(BLU, 'Rest pays off', f'+{gain:.0f}% reps from 1:30 to 2:30', rr_svg, f'Every set 2 from the year ({nreg} sets): rest on the bottom, % of set 1 reps on the side, with the best-fit curve and its spread. Tells you how much extra rest is actually worth.', 'Advanced', 'Regression')}
 {card(GRN, 'Hit your reps', f'{p150*100:.0f}% chance after 2:30 <small>{p60*100:.0f}% after 1:00</small>', lg_svg, 'The chance set 3 lands within 1 rep of set 1, by how long you rested. Could later set the rest timer for you: "rest 2:15 for a 70% chance".', 'Advanced', 'Logistic regression')}
</div>
</section>

<section>
<div class="grid2">
 {card(BLU, 'Normal range', f'Squat estimated max <small>{nodd} unusual days</small>', ctl_svg, 'Each dot is a session\'s estimated max. The band is your recent normal (average ± 2 standard deviations). Red dots fall outside it: an off day worth a note (sleep? short rest?) or a real jump.', 'Advanced', 'Std deviation · Anomaly')}
 {card(GRN if lo > 0 else YEL, 'Real or noise?', (f'Squat up {obs:.1f} kg <small>real gain</small>' if lo > 0 else f'Squat {obs:+.1f} kg <small>could be noise</small>'), bt_svg, f'Last 6 weeks vs the 6 before. The bar on the right is the likely range of the true change, from reshuffling your sessions 3,000 times. If it sits above 0, the gain is real. Here the range is {lo:+.1f} to {hi:+.1f} kg.', 'Overview', 'Hypothesis test · Resampling')}
 {card(GRN, 'Where it\'s heading', f'~{f8:.0f} kg in 8 weeks <small>{perm:+.1f} kg a month</small>', fc_svg, 'A straight-line trend from the last 4 months, carried forward 8 weeks. The band widens because the future is less certain. Good for setting a realistic target.', 'Overview', 'Time series · Linear regression')}
 {card(ORG, 'Session types', 'Your 3 kinds of workout', km_svg, 'Every session placed by average reps and average rest, then grouped automatically. ' + ', '.join(f'{k} {v}%' for k, v in share.items()) + '. Shows how your training actually splits, without you labeling anything.', 'Advanced', 'K-means clustering')}
</div>
</section>

<section>
<h2>Pick list</h2>
<p class="lead">Circle what you want and I'll build those on branch C. Everything is based on data the app already records, so there's no extra logging in the gym.</p>
<table class="tbl">
<tr><th>Chart</th><th>Where</th><th>Stats idea</th><th>What it answers</th><th>Effort</th></tr>
<tr><td><b>B. Drop-off vs usual</b></td><td>End of workout</td><td>Mean · SD</td><td>Was today's fatigue normal?</td><td>Small</td></tr>
<tr><td><b>A. Lines per exercise</b></td><td>End of workout</td><td>Descriptive</td><td>How did reps fall set to set?</td><td>Small</td></tr>
<tr><td>C. Set grid</td><td>End of workout</td><td>Descriptive</td><td>Exact reps, at a glance</td><td>Small</td></tr>
<tr><td>D. Volume vs last time</td><td>End of workout</td><td>Bar plot</td><td>Did I do more work?</td><td>Small</td></tr>
<tr><td>E. Rest vs reps kept</td><td>End of workout</td><td>Regression</td><td>Did short rests cost me?</td><td>Small</td></tr>
<tr><td>Drop-off trend</td><td>Advanced</td><td>Time series</td><td>Is my set-to-set endurance improving?</td><td>Small</td></tr>
<tr><td>Your rests</td><td>Overview</td><td>Histogram · Median</td><td>How long do I really rest?</td><td>Small</td></tr>
<tr><td>Rest pays off</td><td>Advanced</td><td>Regression</td><td>How much is extra rest worth?</td><td>Medium</td></tr>
<tr><td>Hit your reps</td><td>Advanced</td><td>Logistic regression</td><td>How long to rest to hit my reps?</td><td>Medium</td></tr>
<tr><td>Normal range</td><td>Advanced</td><td>SD · Anomaly</td><td>Was that an off day or a real change?</td><td>Medium</td></tr>
<tr><td>Real or noise?</td><td>Overview</td><td>Hypothesis test · Resampling</td><td>Am I actually getting stronger?</td><td>Medium</td></tr>
<tr><td>Where it's heading</td><td>Overview</td><td>Time series · Regression</td><td>Where will I be in 2 months?</td><td>Medium</td></tr>
<tr><td>Session types</td><td>Advanced</td><td>K-means</td><td>What kinds of workouts do I really do?</td><td>Larger</td></tr>
</table>
<div class="box" style="margin-top:16px"><b>Notes</b><br>Charts need enough history to mean anything. Like the existing cards, each would stay hidden or show "a few more sessions" until there's enough of your real data.<br>The live drop-off chip during the workout is an option, but it adds something to the clean timer screen, so I'd leave it out unless you want it.</div>
</section>
'''
html = f'<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head><body>{body}</body></html>'
open(os.path.join(HERE, 'study.html'), 'w').write(html)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None)
    pg = b.new_page(); pg.set_content(html); pg.wait_for_timeout(500)
    pg.pdf(path=os.path.join(HERE, 'Branch_C_Analytics_Options.pdf'), format='Letter', print_background=True, prefer_css_page_size=True)
    b.close()
print('ok')
