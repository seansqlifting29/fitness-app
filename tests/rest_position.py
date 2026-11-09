"""Rest runs straight into getting in position, timed per exercise.

Between sets of the same exercise, the position time is that set's own get set estimate
(learned from your sets, or the equipment base plus belt, straps and heavy loads). When that
much rest is left a chime plays, the timer turns blue (Get into position) and the set starts by
itself when rest is up. Tapping Start set early gives that same get set time from your phone.

    python3 tests/rest_position.py
"""
import asyncio, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from playwright.async_api import async_playwright
from _common import build, serve, launch_args, Results
build(); BASE, srv = serve(); R = Results(); ok = R.check


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**launch_args()); errs = []
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, service_workers='block')
        pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(BASE); await pg.wait_for_timeout(400)
        await pg.fill('#nm', 'Sam'); await pg.click('#go'); await pg.wait_for_timeout(300)
        ev = pg.evaluate
        # Legs starts with a barbell squat; give it a cable exercise too, to compare
        await ev("""(()=>{const L=workouts.find(w=>w.name==='Legs');week[wd(new Date())]=L.id;ses=null;localStorage.removeItem('gym.setupT');save();ensureSession();
          ses.ex.push(exOf({name:'Cable Fly',sets:3,reps:12,w:15,rest:90}));
          window.__tones=[];tone=(f)=>window.__tones.push(f);cfg.restMode='custom';ses.ex[0].rest=180;
          ses.startedAt=Date.now()-6e5;ses.warmDone=true;focus=0;ses.active=0;ses.state='lift';ses.stateAt=Date.now()-30000;save();render()})()""")
        await pg.wait_for_timeout(200)
        sq = await ev("ses.ex[0].name"); cf_i = await ev("ses.ex.length-1")
        sq_pos = await ev(f"setupMs({sq!r},1,ses.ex[0].sets[1].w)")
        cf_pos = await ev(f"setupMs('Cable Fly',1,ses.ex[{cf_i}].sets[1].w)")
        ok(sq_pos > cf_pos, f'a {sq} gets more position time than a cable fly ({sq_pos//1000} s vs {cf_pos//1000} s)')
        ok(sq_pos != 30000 or cf_pos != 30000, 'position time is not a fixed 30 s')

        # finish set 1: rest for 180 s
        await ev("finishSet(0)"); await pg.wait_for_timeout(300)
        ok(await ev("ses.state") == 'rest' and await ev("ses.restTarget") == 180000, 'set 1 done: resting 180 s')
        early = 180000 - sq_pos - 5000
        await ev(f"ses.stateAt-={early};ses.ex[0].lastEnd-={early}"); await pg.wait_for_timeout(400)
        ok(await ev("ses.state") == 'rest', 'a few seconds before the position time, still resting')

        # position time left: chime, blue, then the set starts by itself
        await ev("window.__tones=[];ses.stateAt-=5000;ses.ex[0].lastEnd-=5000"); await pg.wait_for_timeout(700)
        ok(await ev("ses.state") == 'setup' and await ev("ses.posFromRest"), 'with the squat\'s position time left, rest turns into getting in position')
        sm = await ev("ses.setupMs"); ok(abs(sm - sq_pos) <= 1500, f'position time is the squat\'s get set time ({sm} ms vs {sq_pos} ms)')
        tones = await ev("window.__tones")
        ok(tones[:3] == [660, 880, 1100], f'a distinct three note chime plays ({tones[:3]})')
        ok('setup' in await ev("document.getElementById('ftimer').className"), 'the timer turns blue')
        ok(await pg.locator('#tL').inner_text() == 'Get into position', 'it says Get into position')
        await ev("ses.ex[0].lastEnd-=ses.setupMs;ses.stateAt-=ses.setupMs"); await pg.wait_for_timeout(500)
        ok(await ev("ses.state") == 'lift', 'when rest is up, the set starts by itself')
        ok(not await ev(f"(S.get('gym.setupT',{{}})[{sq!r}+'|1']||[]).length"), 'running out the position time teaches nothing')
        gap = await ev("ses.ex[0].sets[1].rest"); ok(gap and 175000 <= gap <= 190000, f'the set records the full gap since the last one ({gap} ms)')

        # end rest early: that exercise's get set time from the phone
        await ev("finishSet(0)"); await pg.wait_for_timeout(200)
        await ev("ses.stateAt-=10000"); await pg.wait_for_timeout(200)
        ok(await pg.locator('#tB').inner_text() == 'Start set 3', 'during rest the button still says Start set 3')
        await pg.click('#tB'); await pg.wait_for_timeout(300)
        want = await ev(f"setupMs({sq!r},2,ses.ex[0].sets[2].w)")
        ok(await ev("ses.state") == 'setup' and await ev("ses.setupMs") == want, f'ending rest early gives the squat\'s get set time ({want//1000} s)')
        ok(await pg.locator('#tB').inner_text() == 'Start now', 'and Start now skips the rest of it')
        await ev("ses.stateAt-=9000"); await pg.click('#tB'); await pg.wait_for_timeout(200)
        T = await ev(f"S.get('gym.setupT',{{}})[{sq!r}+'|1']")
        ok(await ev("ses.state") == 'lift' and T and any(8500 <= t <= 10500 for t in T), f'how long you actually took is learned for next time ({T})')

        # +10 s during position is learned too
        await ev("finishSet(0)"); await pg.wait_for_timeout(200)
        ok(await ev("ses.state") != 'rest', 'after the last set there is no rest to run into position')
        await ev(f"ses.active={cf_i};focus={cf_i};ses.ex[{cf_i}].sets[0].done=true;ses.ex[{cf_i}].lastEnd=Date.now();ses.state='rest';ses.restTarget=90000;ses.stateAt=Date.now();save();render()")
        await pg.wait_for_timeout(200)
        await ev(f"startSet({cf_i})"); await pg.wait_for_timeout(200)
        ok(await ev("ses.setupMs") == cf_pos, f'a cable fly gets its own shorter time ({cf_pos//1000} s)')
        taps = await ev("S.get('gym.setupTaps',{})['Cable Fly']||0")
        await ev("moreSetup()"); await pg.wait_for_timeout(100)
        ok(await ev("ses.setupMs") == cf_pos + 10000 and await ev("S.get('gym.setupTaps',{})['Cable Fly']") == taps + 1, '+10 s adds time now and counts toward next time')

        # short rest: straight into position with what's left
        await ev(f"closeState();ses.state='lift';ses.stateAt=Date.now()-20000;ses.ex[{cf_i}].rest=5;save()")
        await ev(f"finishSet({cf_i})"); await pg.wait_for_timeout(600)
        ok(await ev("ses.state") == "setup" and await ev("ses.setupMs") <= 5000, "a rest shorter than the position time goes straight to getting in position")

        # paused: no change
        await ev("ses.state='rest';ses.restTarget=60000;ses.stateAt=Date.now()-55000;ses.pausedAt=Date.now();save();render()"); await pg.wait_for_timeout(600)
        ok(await ev("ses.state") == 'rest', 'a paused workout stays in rest')

        # first set of an exercise still uses its first set get set time
        await ev("ses.pausedAt=null;closeState();ses.state='idle';ses.active=null;focus=1;save();render()"); await pg.wait_for_timeout(200)
        await ev("startSet(1)"); await pg.wait_for_timeout(200)
        nm = await ev("ses.ex[1].name")
        ok(await ev("ses.state") == 'setup' and not await ev("ses.posFromRest") and await ev(f"ses.setupMs===setupMs({nm!r},0,ses.ex[1].sets[0].w)"), 'the first set of an exercise uses its first set get set time')

        ok(not errs, f'no page errors {errs}')
        await b.close()
    srv.shutdown()
    R.finish()

asyncio.run(main())
