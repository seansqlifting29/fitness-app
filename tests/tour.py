"""New users: the offer on Today, and the walk through of the 1 year preview.

    python3 tests/tour.py
"""
import asyncio, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from _common import build, serve, launch_args, Results
from playwright.async_api import async_playwright

R = Results(); ok = R.check


async def main():
    build(); BASE, srv = serve()
    async with async_playwright() as p:
        b = await p.chromium.launch(**launch_args()); errs = []
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, service_workers='block')
        pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(BASE); await pg.wait_for_timeout(400)
        await pg.fill('#nm', 'Sean'); await pg.click('#go'); await pg.wait_for_timeout(300)
        ok(await pg.locator('.tourc').count() == 1, 'a new user sees the tour offer on Today')
        await pg.click('[data-tourx]'); await pg.wait_for_timeout(200)
        ok(await pg.locator('.tourc').count() == 0, 'No thanks hides it')
        await pg.reload(); await pg.wait_for_timeout(400)
        ok(await pg.locator('.tourc').count() == 0, 'and it stays hidden')
        await pg.evaluate("localStorage.removeItem('gym.tourSeen');hist.push({id:nid(),date:dkey(new Date()),split:'Push',start:Date.now()-36e5,total:3e6,tut:0,rest:0,sets:1,volume:0,unit:'kg',ex:[{name:'Pec Deck',sets:[{w:40,r:10}]}]});save();render()")
        ok(await pg.locator('.tourc').count() == 0, 'not shown once you have logged a workout')
        await pg.evaluate("hist=[];save();render()")
        ok(await pg.locator('.tourc').count() == 1, 'shown again for an empty account that never answered')

        # the walk through
        await pg.click('[data-tourgo]'); await pg.wait_for_timeout(1500)
        ok('preview.html' in pg.url and await pg.locator('.tourbox').count() == 1, 'Show me opens the preview with the walk through')
        tabs = []
        for k in range(5):
            tabs.append(await pg.evaluate('tab'))
            await pg.click('[data-tnext]'); await pg.wait_for_timeout(300)
        tabs.append(await pg.evaluate('tab'))
        ok(tabs == ['stats', 'stats', 'stats', 'plan', 'today', 'today'], f'the steps move through Analytics, Schedule and Today {tabs}')
        ok('6 OF 6' in await pg.locator('.tourbox').inner_text(), 'six steps')
        await pg.click('[data-tskip]'); await pg.wait_for_timeout(200)
        ok(await pg.locator('.tourbox').count() == 0, 'Keep exploring closes it')
        await pg.reload(); await pg.wait_for_timeout(1200)
        ok(await pg.locator('.tourbox').count() == 0, 'it does not come back by itself')
        await pg.goto(BASE + 'preview.html?tour=1'); await pg.wait_for_timeout(1200)
        ok(await pg.locator('.tourbox').count() == 1, 'the tour link always starts it')
        await pg.evaluate("tab='plan';render()"); await pg.wait_for_timeout(200)
        ok(await pg.locator('.tourbox').count() == 1, 'the card survives the app redrawing')
        await pg.goto(BASE); await pg.wait_for_timeout(400)
        ok(await pg.evaluate('hist.length') == 0 and await pg.locator('.tourc').count() == 0, 'back in your own app: still empty, offer gone')

        ok(not errs, f'no page errors {errs}')
        await b.close()
    srv.shutdown()
    R.finish()

asyncio.run(main())
