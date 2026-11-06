"""The workout screen during a workout. Covers the warm up, the 10 seconds to get set, logging a set, pause freezing every clock and
leaving it out of gym time, and leaving a running workout asking to pause or end (button and
back gesture), staying paused after reopening the app.

    python3 tests/workout_screen.py
"""
import asyncio, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from playwright.async_api import async_playwright
from _common import build, serve, launch_args, Results
build(); BASE, srv = serve(); R = Results(); ok = R.check
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(**launch_args());errs=[]
    ctx=await b.new_context(viewport={'width':390,'height':844},service_workers='block');pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(BASE);await pg.wait_for_timeout(500);await pg.fill('#nm','Sam');await pg.click('#go');await pg.wait_for_timeout(300)
    await pg.evaluate("week[wd(new Date())]=workouts.find(w=>w.name==='Upper').id;ses=null;save();render()")
    await pg.click('[data-open="0"]');await pg.wait_for_timeout(300)
    ok(await pg.locator('.focus #inW').count()==1,'exercise screen opens with weight and reps')
    ok(await pg.locator('#tZ').is_hidden(),'no Pause before the workout starts')
    await pg.click('[data-tb]');await pg.wait_for_timeout(300)
    ok(await pg.evaluate("ses.state")=='warm' and await pg.locator('.wup').count()==1,'first Start opens the warm up')
    ok(await pg.locator('#tK').is_visible(),'warm up can be skipped')
    await pg.click('[data-tb]');await pg.wait_for_timeout(300)
    ok(await pg.evaluate("ses.state")=='setup' and await pg.locator('#tL').text_content()=='Get set','Warm up done gives 10 seconds to get set')
    await pg.evaluate("ses.stateAt-=10000");await pg.wait_for_timeout(500)
    ok(await pg.evaluate("ses.state")=='lift','lifting time starts on its own after 10 seconds')
    await pg.evaluate("ses.stateAt-=5000");await pg.click('[data-tb]');await pg.wait_for_timeout(300)
    t=await pg.evaluate('ses.ex[0].sets[0].tut');ok(1800<t<3600,f'a few seconds come off for reaching the phone ({t} ms)')
    ok(await pg.evaluate('ses.ex[0].sets[0].done'),'set is logged')
    r0=await pg.evaluate('ses.ex[0].sets[0].r');await pg.click('[data-adj="r:1"]');await pg.wait_for_timeout(100)
    ok(await pg.evaluate('ses.ex[0].sets[0].r')==r0+1,'reps are adjusted right after the set')
    await pg.click('[data-tz]');await pg.wait_for_timeout(200)
    ok('Pause the workout' in await pg.locator('.takeover h2').inner_text(),'Pause asks first and nudges you on')
    await pg.click('.takeover [data-close]');await pg.wait_for_timeout(100);ok(await pg.evaluate('!ses.pausedAt'),'Keep going does not pause')
    await pg.click('[data-tz]');await pg.click('[data-tk="1"]');await pg.wait_for_timeout(200)
    a=await pg.evaluate('[liveRest(),phase().k]');await pg.wait_for_timeout(900);c=await pg.evaluate('liveRest()')
    ok(a[1]=='paused' and a[0]==c,'pause freezes the clocks')
    ok(await pg.locator('#tB').inner_text()=='Resume' and await pg.locator('#tP').inner_text()=='End','paused shows Resume and End')
    st=await pg.evaluate('ses.startedAt');await pg.click('[data-tb]');await pg.wait_for_timeout(100)
    ok(await pg.evaluate('!ses.pausedAt&&ses.startedAt>'+str(st)),'resume leaves the pause out of gym time')
    await pg.click('[data-close-focus]');await pg.wait_for_timeout(200)
    ok('Leave' in await pg.locator('.takeover h2').inner_text(),'leaving a running workout asks first')
    await pg.click('.takeover [data-close]');await pg.wait_for_timeout(200);ok(await pg.evaluate('focus')==0,'Keep going stays put')
    await pg.go_back(wait_until='commit');await pg.wait_for_timeout(300)
    ok(await pg.locator('.takeover').count()==1,'phone back gesture asks too')
    await pg.click('[data-tk="1"]');await pg.wait_for_timeout(200)
    ok(await pg.evaluate('focus===null&&!!ses.pausedAt'),'Pause workout goes to Today, paused')
    await pg.reload();await pg.wait_for_timeout(500)
    ok(await pg.evaluate('focus===null&&!!ses.pausedAt'),'still paused after reopening the app')
    await pg.click('[data-resume]');await pg.wait_for_timeout(200);await pg.click('[data-tp]');await pg.wait_for_timeout(200)
    ok('End this workout' in await pg.locator('.takeover h2').inner_text(),'End asks to confirm')
    await pg.click('[data-tk="0"]');await pg.wait_for_timeout(300)
    ok(await pg.evaluate('ses.finished&&hist.length===1&&hist[0].sets===1'),'ending saves the logged set')
    # finish the exercise: the next one opens on Load up with the clock still running
    await pg.evaluate("ses=buildSession(plannedToday());ses.startedAt=Date.now()-60000;ses.warmDone=true;focus=0;save();render()")
    await pg.evaluate("ses.ex[0].sets.slice(1).forEach(s=>s.done=true);ses.state='lift';ses.active=0;ses.stateAt=Date.now()-6000;finishSet(0)")
    await pg.wait_for_timeout(1200);await pg.click('[data-tb]');await pg.wait_for_timeout(300)
    ok(await pg.evaluate('focus')==1 and await pg.locator('#tL').text_content()=='Load up','next exercise opens on Load up')
    ok(await pg.evaluate("phase().ms")>=1000,'transition clock carries over instead of resetting')
    ok((await pg.locator('#tB').inner_text()).startswith('Start set 1'),'one tap starts its first set')
    await pg.evaluate("hist.push({id:'x',date:ses.date,ex:[],start:Date.now()-9e6,total:1,sets:1});ses=buildSession(plannedToday());focus=0;save();render()")
    await pg.click('[data-tb]');await pg.wait_for_timeout(200);ok(await pg.evaluate("ses.state")=='setup','no warm up for a second workout the same day')
    await pg.evaluate("cfg.warmup=false;ses=buildSession(plannedToday());focus=0;save();render()");await pg.wait_for_timeout(200)
    await pg.click('[data-tb]');await pg.wait_for_timeout(200);ok(await pg.evaluate("ses.state")=='setup','with warm up off in settings, Start goes straight to get set')
    ok(not errs,f'no page errors {errs}')
    await b.close()
asyncio.run(main());R.finish()
