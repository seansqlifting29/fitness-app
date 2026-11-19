"""Erase all data, then start again: it must look exactly like opening the app for the first time.

    python3 tests/fresh_start.py
"""
import asyncio, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from _common import build, serve, launch_args, Results
from playwright.async_api import async_playwright

R = Results(); ok = R.check

STATE = "JSON.stringify({week,hist:hist.length,ws:workouts.map(w=>w.name).sort(),cfg})"


async def main():
    build(); BASE, srv = serve()
    async with async_playwright() as p:
        b = await p.chromium.launch(**launch_args()); errs = []
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, service_workers='block')
        pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
        import datetime; await pg.clock.set_system_time(datetime.datetime(2026, 11, 7, 10))  # fixed Saturday so the result doesn't depend on today
        await pg.goto(BASE); await pg.wait_for_timeout(400)
        pristine = sorted(await pg.evaluate("Object.keys(localStorage).filter(k=>/^(gym3?\\.|fit\\.)/.test(k))"))
        await pg.fill('#nm', 'Sean'); await pg.click('#go'); await pg.wait_for_timeout(300)
        first = await pg.evaluate(STATE)
        ok(await pg.evaluate("week.every(x=>x==null)"), 'a first open starts with an open week')

        # use the app: a planned week, history, this-week changes, settings, the tour, a workout underway
        await pg.goto(BASE + 'preview.html'); await pg.wait_for_timeout(1200)
        await pg.goto(BASE); await pg.wait_for_timeout(400)
        await pg.evaluate("""(()=>{const id=n=>workouts.find(w=>w.name===n).id;week=[id('Push'),id('Pull'),id('Legs'),REST,id('Upper'),null,null];
          hist.push({id:nid(),date:'2026-11-02',split:'Push',start:Date.now()-5*864e5,total:3e6,tut:0,rest:0,sets:1,volume:0,unit:'kg',ex:[{name:'Pec Deck',sets:[{w:40,r:10}]}]});
          cfg.unit='lb';cfg.cardio=false;workouts.push({id:nid(),name:'Arms day',ex:[]});
          ['gym.dayOver','gym.extra','gym.dropped','gym.swaps','gym.setupT','gym.setupAdj','gym.tourSeen','gym.focus','gym.charts2','gym.split'].forEach(k=>S.set(k,{x:1}));
          save();ensureSession();ses.startedAt=Date.now();ses.warmDone=true;focus=0;save();render()})()""")
        await pg.wait_for_timeout(300)
        keys_before = await pg.evaluate("Object.keys(localStorage).filter(k=>k.startsWith('gym')).length")
        ok(keys_before > 10, f'lots of app data saved ({keys_before} keys)')

        # erase through Settings
        await pg.evaluate("focus=null;render()"); await pg.wait_for_timeout(200)
        await pg.click('[data-settings]'); await pg.wait_for_timeout(300)
        await pg.evaluate("document.querySelector('[data-wipe]').click()"); await pg.wait_for_timeout(300)
        await pg.evaluate("[...document.querySelectorAll('.scrim button')].find(b=>b.textContent.trim()==='Erase').click()")
        await pg.wait_for_selector('#nm', timeout=8000); await pg.wait_for_timeout(400)
        left = sorted(await pg.evaluate("Object.keys(localStorage).filter(k=>/^(gym3?\\.|fit\\.)/.test(k))"))
        ok(left == pristine, f'storage is exactly what a first open has {left}')
        ok(await pg.evaluate("Object.keys(localStorage).some(k=>k.startsWith('preview:'))"), "the sample year's own storage is untouched")
        ok(await pg.locator('#nm').count() == 1, 'back to the welcome screen')

        # start again
        await pg.fill('#nm', 'Sean'); await pg.click('#go'); await pg.wait_for_timeout(300)
        again = await pg.evaluate(STATE)
        ok(again == first, 'starting again matches a first open exactly (open week, no history, default settings, starter workouts)')
        ok(await pg.evaluate("Object.keys(dayOvers()).length==0&&!S.get('gym.extra',null)&&!S.get('gym.dropped',null)"), 'no week changes or make-ups carried over')
        ok(await pg.locator('.tourc').count() == 1, 'the tour is offered again')
        await pg.click('[data-tab=plan]'); await pg.wait_for_timeout(300)
        tiles = await pg.evaluate("[...document.querySelectorAll('.stile[data-k]')].map(t=>t.className.includes('open')||t.className.includes('gone'))")
        ok(all(tiles), 'Schedule shows every day open, nothing marked not logged')
        await pg.reload(); await pg.wait_for_timeout(400)
        ok(await pg.evaluate(STATE) == first, 'and it stays that way after a reload')

        ok(not errs, f'no page errors {errs}')
        await b.close()
    srv.shutdown()
    R.finish()

asyncio.run(main())
