"""Branch C study: capture the current screens and the sample-year data used by the chart concepts.

    python3 docs/analytics-study/capture.py
"""
import asyncio, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', 'tests'))
from playwright.async_api import async_playwright
from _common import build, serve, launch_args

OUT = os.path.join(HERE, 'shots'); os.makedirs(OUT, exist_ok=True)


async def main():
    build(); base, srv = serve()
    async with async_playwright() as p:
        b = await p.chromium.launch(**launch_args())
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, service_workers='block')
        pg = await ctx.new_page()
        await pg.goto(base + 'preview.html'); await pg.wait_for_timeout(1500)
        ev = pg.evaluate
        await ev("document.querySelectorAll('[data-tskip]').forEach(b=>b.click())"); await pg.wait_for_timeout(300)

        # data for the concepts
        data = await ev("JSON.stringify(hist)")
        open(os.path.join(HERE, 'sample_hist.json'), 'w').write(data)

        async def shot(name, full=False):
            await pg.wait_for_timeout(500)
            if full:
                h = await ev("(()=>{const m=document.querySelector('#main')||document.scrollingElement;return m.scrollHeight})()")
                await pg.set_viewport_size({'width': 390, 'height': min(max(844, h + 120), 4000)}); await pg.wait_for_timeout(500)
            await pg.screenshot(path=os.path.join(OUT, name + '.png'))
            await pg.set_viewport_size({'width': 390, 'height': 844})

        # analytics
        await ev("document.querySelector('[data-tab=analytics]')&&document.querySelector('[data-tab=analytics]').click()")
        await shot('analytics_overview', full=True)
        await ev("document.querySelector('[data-atab=advanced]').click()")
        await shot('analytics_advanced', full=True)

        # today
        await ev("document.querySelector('[data-tab=today]').click()")
        await ev("""(()=>{const d=wd(new Date());if(!week[d])week[d]=workouts[0].id;ses=null;save();ensureSession();render()})()""")
        await shot('today')

        # the workout screen, resting after set 1
        await ev("""(()=>{ses.startedAt=Date.now()-9e5;ses.warmDone=true;focus=0;save();render();
          closeState();ses.active=0;ses.state='lift';ses.stateAt=Date.now()-25000;save();finishSet(0);
          ses.stateAt=Date.now()-48000;save();render()})()""")
        await shot('workout_rest')

        # finish: the end-of-workout summary
        await ev("""(()=>{ses.ex.forEach(e=>e.sets.forEach((s,k)=>{if(!s.done){s.done=true;s.r=Math.max(1,(s.r||8)-k);s.tut=30000;s.rest=90000}}));save();focus=null;finishWorkout()})()""")
        await shot('workout_saved')
        await b.close()
    srv.shutdown()

asyncio.run(main())
