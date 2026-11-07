"""Edit week with a day already trained: the scheduling cases that broke in testing.

Clock pinned to Saturday Nov 7 2026. Legs is done today. In Edit week you plan Mon to Fri,
then change Saturday to Lower, which can only apply from next week.

    python3 tests/plan_week_edit.py
"""
import asyncio, datetime, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from _common import build, serve, launch_args, Results
from playwright.async_api import async_playwright

R = Results(); ok = R.check
SAT = datetime.datetime(2026, 11, 7, 10, 0, 0)


async def main():
    build(); BASE, srv = serve()
    async with async_playwright() as p:
        b = await p.chromium.launch(**launch_args()); errs = []
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, service_workers='block')
        pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.clock.set_system_time(SAT)
        await pg.goto(BASE); await pg.wait_for_timeout(400)
        await pg.fill('#nm', 'Sean'); await pg.click('#go'); await pg.wait_for_timeout(300)
        ev = pg.evaluate
        ok(await ev('wd(new Date())') == 5, 'clock pinned to a Saturday')

        async def setup():
            # an empty week with Legs on Saturday, already done today
            await ev("""(()=>{['gym.dayOver','gym.extra','gym.dropped','gym.swaps'].forEach(k=>localStorage.removeItem(k));
              const L=workouts.find(w=>w.name==='Legs');week=[null,null,null,null,null,L.id,null];hist=[];ses=null;pdraft=null;save();
              hist.push({id:nid(),date:dkey(new Date()),wid:L.id,split:'Legs',start:Date.now()-3600000,total:3000000,tut:0,rest:0,sets:3,volume:0,unit:'kg',ex:[{name:'Back Squat',sets:[{w:100,r:8}]}]});
              save();ensureSession();tab='plan';planMode='edit';render()})()""")
            await pg.wait_for_timeout(200)

        async def pick_day(i, name):
            await ev(f"document.querySelector('[data-pday=\"{i}\"]').click()"); await pg.wait_for_timeout(150)
            await ev(f"document.querySelector('[data-pickw=\"{name}\"]').click()"); await pg.wait_for_timeout(150)

        names = lambda: ev('weekNames()')
        drafted = lambda: ev('draft().slice()')

        # ---- the reported case ----
        await setup()
        for i, n in enumerate(['Push', 'Legs', 'Upper', 'Lower', 'Pull']):
            await pick_day(i, n)
        ok(await drafted() == ['Push', 'Legs', 'Upper', 'Lower', 'Pull', 'Legs', None], 'Mon to Fri drafted')
        await ev("document.querySelector('[data-pday=\"5\"]').click()"); await pg.wait_for_timeout(200)
        ok('from next week' in await pg.locator('.scrim h3').inner_text(), 'tapping trained Saturday offers next week')
        await ev("document.querySelector('[data-nw=\"Lower\"]').click()"); await pg.wait_for_timeout(200)
        ok(await ev('planMode') == 'edit', 'still in Edit week after choosing next week')
        ok(await drafted() == ['Push', 'Legs', 'Upper', 'Lower', 'Pull', 'Lower', None], 'Mon to Fri edits kept, Saturday drafted as Lower')
        ok(await names() == [None, None, None, None, None, 'Legs', None], 'nothing saved yet')
        ok('From next week' in await pg.locator('[data-pday="0"]').inner_text(), 'a day already gone this week says it starts next week')
        ok(await pg.locator('.savebar').count() == 1, 'Save week still showing')
        row = await pg.locator('[data-pday="5"]').inner_text()
        ok('Legs' in row and 'Lower from next week' in row and 'Done this week' in row, f'Saturday row shows what you did and what comes next ({row!r})')
        await ev("document.querySelector('[data-psave]').click()"); await pg.wait_for_timeout(300)
        ok(await names() == ['Push', 'Legs', 'Upper', 'Lower', 'Pull', 'Lower', None], 'saved: the weekly plan has Lower on Saturdays')
        ok(await ev("workouts.find(w=>w.id===dayPlan(5)).name") == 'Legs', 'this Saturday stays Legs')
        ok(await ev("ses&&ses.split") == 'Legs' and await ev("lockedDay(5)") == 'done', 'Today is still the Legs you did')
        ok(await ev("leftovers().length") == 0, 'past days planned now are not left overs')
        ok(await ev("[0,1,2,3,4].map(i=>dayPlan(i))") == [None]*5, 'Mon to Fri this week stay as they were')
        await ev("tab='plan';planMode='sched';render()"); await pg.wait_for_timeout(200)
        tile = await pg.locator('.stile[data-k="5"]').inner_text()
        ok('Legs' in tile and 'Lower' not in tile, f'Schedule tile shows Legs for this Saturday ({tile!r})')

        # ---- discard after choosing next week changes nothing ----
        await setup()
        await pick_day(0, 'Push')
        await ev("document.querySelector('[data-pday=\"5\"]').click()"); await pg.wait_for_timeout(200)
        await ev("document.querySelector('[data-nw=\"Lower\"]').click()"); await pg.wait_for_timeout(200)
        await ev("document.querySelector('[data-pdis]').click()"); await pg.wait_for_timeout(200)
        ok(await names() == [None, None, None, None, None, 'Legs', None] and await ev("Object.keys(dayOvers()).length") == 0, 'Discard leaves the week and this week untouched')

        # ---- choosing the same workout for next week is not a change ----
        await setup()
        await ev("document.querySelector('[data-pday=\"5\"]').click()"); await pg.wait_for_timeout(200)
        await ev("document.querySelector('[data-nw=\"Legs\"]').click()"); await pg.wait_for_timeout(200)
        ok(await pg.locator('.savebar').count() == 0, 'picking the same workout leaves nothing to save')

        # ---- open from next week ----
        await setup()
        await ev("document.querySelector('[data-pday=\"5\"]').click()"); await pg.wait_for_timeout(200)
        await ev("document.querySelector('[data-nw=\"\"]').click()"); await pg.wait_for_timeout(200)
        ok('Open from next week' in await pg.locator('[data-pday="5"]').inner_text(), 'Open from next week shows on the row')
        await ev("document.querySelector('[data-psave]').click()"); await pg.wait_for_timeout(300)
        ok((await names())[5] is None and await ev("workouts.find(w=>w.id===dayPlan(5)).name") == 'Legs', 'saved open from next week, Legs this week')

        # ---- Schedule tile path still saves straight away ----
        await setup()
        await ev("tab='plan';planMode='sched';pdraft=null;render()"); await pg.wait_for_timeout(200)
        await ev("quickDay(5)"); await pg.wait_for_timeout(200)
        await ev("document.querySelector('[data-nw=\"Lower\"]').click()"); await pg.wait_for_timeout(300)
        ok((await names())[5] == 'Lower' and await ev("workouts.find(w=>w.id===dayPlan(5)).name") == 'Legs', 'from Schedule: Lower from next week, Legs this week')

        # ---- a workout underway: the day can't be changed from Edit week ----
        await setup()
        await ev("hist=[];ses=null;save();ensureSession();ses.startedAt=Date.now();ses.warmDone=true;save();tab='plan';planMode='edit';render()"); await pg.wait_for_timeout(200)
        await ev("document.querySelector('[data-pday=\"5\"]').click()"); await pg.wait_for_timeout(200)
        ok('underway' in await pg.locator('.toast').inner_text() and await pg.locator('.scrim').count() == 0, 'a workout underway locks the day with a message')
        await ev("ses=null;save()")

        # ---- next week the new plan is live ----
        await setup()
        await ev("document.querySelector('[data-pday=\"5\"]').click()"); await pg.wait_for_timeout(200)
        await ev("document.querySelector('[data-nw=\"Lower\"]').click()"); await pg.wait_for_timeout(200)
        await pick_day(6, 'Upper')
        await ev("document.querySelector('[data-psave]').click()"); await pg.wait_for_timeout(300)
        ok(await ev("workouts.find(w=>w.id===dayPlan(6)).name") == 'Upper', 'a future day planned in the same save applies this week')
        await pg.clock.set_system_time(SAT + datetime.timedelta(days=7))
        await pg.reload(); await pg.wait_for_timeout(500)
        ok(await ev("workouts.find(w=>w.id===dayPlan(5)).name") == 'Lower', 'next Saturday is Lower')
        ok(await ev("ses&&ses.split") == 'Lower', "next Saturday's Today is Lower")

        ok(not errs, f'no page errors {errs}')
        await b.close()
    srv.shutdown()
    R.finish()

asyncio.run(main())
