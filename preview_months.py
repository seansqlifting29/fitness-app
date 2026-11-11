"""Build dist/preview-3mo.html: the preview with a shorter sample, training Monday to Friday only.

    python3 build.py && python3 tools/preview_months.py [months]
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
months = int(sys.argv[1]) if len(sys.argv) > 1 else 3
days = round(months * 30.4)
html = open(os.path.join(ROOT, 'dist', 'preview.html'), encoding='utf-8').read()


def swap(old, new, count=1):
    global html
    assert html.count(old) == count, f'seed changed, update tools/preview_months.py: {old[:50]}'
    html = html.replace(old, new)


# the plan: Push, Pull, Legs, Upper, Lower on Monday to Friday, weekends off
swap("    null,\n    {name:'Upper'", "    {name:'Upper'")
swap("    null];", "    null,null];")
# a shorter history, with the same gains spread over it
swap("+(localStorage.getItem('gym.demoDays')||365)", f"+(localStorage.getItem('gym.demoDays')||{days})", 2)
# its own sample, so it never reuses a year already saved in the same browser
swap("'gym.demoSeeded5'", f"'gym.demoSeeded{months}mo'", 3)
swap('made-up training', f'made-up training, weekdays only')
out = os.path.join(ROOT, 'dist', f'preview-{months}mo.html')
open(out, 'w', encoding='utf-8').write(html)
print('built', os.path.relpath(out, ROOT))
