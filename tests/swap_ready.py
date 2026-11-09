"""Swap from the Ready screen: a Swap chip by the exercise name before its first set.

Shown only while nothing of that exercise is logged and you're not lifting or counting down.
It opens the same swap sheet as the list's ⋯ (later this week, or similar today only).

    python3 tests/swap_ready.py
"""
import asyncio, datetime, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from playwright.async_api import async_playwright
from _common import build, serve, launch_args, Results
build(); BASE, srv = serve(); R = Results(); ok = R.check
MON = datetime.datetime(2026, 11, 9, 10, 0, 0)  # a Monday, so later days this week exist


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**launch_args()); errs = []
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, service_workers='block')
        pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.clock.set_system_time(MON)
        await pg.goto(BASE); await pg.wait_for_timeout(400)
        await pg.fill('#nm', 'Sam'); await pg.click('#go'); await pg.wait_for_timeout(300)
        await pg.evaluate("""(()=>{const id=n=>workouts.find(w=>w.name===n).id;week=[id('Push'),null,id('Upper'),null,id('Push'),null,null];
          localStorage.removeItem('gym.swaps');ses=null;save();ensureSession();focus=0;render()})()""")
        await pg.wait_for_timeout(300)
        chip = pg.locator('.swchip')
        first = await pg.evaluate('ses.ex[0].name')

        # before the workout starts
        ok(await chip.count() == 1, 'Ready for set 1 shows a Swap chip, even before the workout starts')
        ok(first in await pg.locator('.nmrow').inner_text(), 'the chip sits on the exercise name row')
        await chip.click(); await pg.wait_for_timeout(250)
        ok(await pg.locator('.scrim h3').inner_text() == f'Swap {first}', 'it opens the swap sheet for that exercise')
        later = await pg.locator('[data-swl]').count(); sim = await pg.locator('[data-sws]').count()
        ok(later > 0 and sim > 0, f'with options from later this week ({later}) and similar today only ({sim})')
        pick = (await pg.locator('[data-sws] b').first.inner_text()).strip()
        await pg.locator('[data-sws]').first.click(); await pg.wait_for_timeout(300)
        ok(await pg.evaluate('ses.ex[0].name') == pick, f'picking one replaces it ({first} for {pick})')
        ok(await pg.evaluate('focus') == 0 and pick in await pg.locator('.nmrow').inner_text(), 'you stay on Ready, now for the new exercise')
        ok(await chip.count() == 1, 'and can still swap again before starting')
        ok(not await pg.evaluate('!!ses.startedAt'), 'swapping does not start the workout')

        # during the countdown and the set: no chip
        await pg.evaluate("ses.startedAt=Date.now();ses.warmDone=true;ses.active=0;ses.state='setup';ses.stateAt=Date.now();save();render()"); await pg.wait_for_timeout(200)
        ok(await chip.count() == 0, 'no chip during get set')
        await pg.evaluate("ses.state='lift';ses.stateAt=Date.now();save();render()"); await pg.wait_for_timeout(200)
        ok(await chip.count() == 0, 'no chip while lifting')

        # after set 1 is logged: no chip on that exercise
        await pg.evaluate("ses.ex[0].sets[0].done=true;ses.state='idle';ses.active=null;ses.lastSet=null;save();render()"); await pg.wait_for_timeout(200)
        ok(await pg.evaluate('curIdx(ses.ex[0])') == 1 and await chip.count() == 0, 'once a set is logged the chip is gone')

        # another untouched exercise mid-workout: chip shows
        await pg.evaluate("focus=1;render()"); await pg.wait_for_timeout(200)
        ok(await chip.count() == 1, 'an exercise not started yet still offers Swap mid-workout')
        # the list's ⋯ still there for untouched exercises
        await pg.evaluate("focus=null;render()"); await pg.wait_for_timeout(200)
        ok(await pg.locator('[data-xsub="1"]').count() == 1 and await pg.locator('[data-xsub="0"]').count() == 0, 'the list keeps its ⋯ for exercises not started')

        # finished workout: no chip
        await pg.evaluate("ses.finished=true;focus=1;save();render()"); await pg.wait_for_timeout(200)
        ok(await chip.count() == 0, 'no chip once the workout is finished')

        ok(not errs, f'no page errors {errs}')
        await b.close()
    srv.shutdown()
    R.finish()

asyncio.run(main())
