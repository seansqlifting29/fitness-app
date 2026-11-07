"""Cardio is a toggle on a workout, not a workout: after the lifts you pick a machine from bubbles
and 10, 15 or 20 minutes, and it counts down. Days you've already trained (or today while a
workout is going) can't be planned over, from Schedule, the planner, or left over.

    python3 tests/cardio_lock.py
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
    await pg.goto(BASE);await pg.wait_for_timeout(400);await pg.fill('#nm','Sam');await pg.click('#go');await pg.wait_for_timeout(300)
    ok(not await pg.evaluate("planNames().some(n=>/cardio/i.test(n))"),'Cardio is not a workout you can plan')
    t=await pg.evaluate('wd(new Date())')
    await pg.evaluate("week[wd(new Date())]=workouts.find(w=>w.name==='Push').id;ses=null;save();render()")
    ok(await pg.evaluate("cfg.cardio")==True,'Cardio after workouts starts on')
    ok(await pg.evaluate("tab='plan';openWorkoutByName('Push');document.querySelectorAll('[data-wcardio]').length")==0,'no cardio toggle inside a workout')
    await pg.evaluate("tab='today';planW=null;render()");await pg.wait_for_timeout(200)
    # the switch lives in Settings
    await pg.click('[data-settings]');await pg.wait_for_timeout(300)
    ok(await pg.locator('#scd').count()==1 and await pg.locator('#scd').is_checked(),'Settings has a Cardio after every workout switch, on')
    await pg.evaluate("document.querySelector('#scd').click()");await pg.wait_for_timeout(200)
    ok(await pg.evaluate("!cfg.cardio&&JSON.parse(localStorage.getItem('gym.cfg')).cardio===false"),'switching it off is saved')
    await pg.reload();await pg.wait_for_timeout(400)
    ok(await pg.evaluate("cfg.cardio")==False,'off stays off after a reload')
    await pg.evaluate("ses.startedAt=Date.now()-1800000;ses.warmDone=true;ses.ex.forEach(e=>e.sets.forEach(s=>s.done=true));const L=ses.ex.length-1;ses.active=L;ses.state='next';ses.stateAt=Date.now();focus=L;save();render()");await pg.wait_for_timeout(300)
    ok(await pg.locator('#tB').inner_text()=='Finish workout','with it off the last exercise ends with Finish')
    await pg.evaluate("cfg.cardio=true;focus=null;ses.state='idle';ses.active=null;save();render()");await pg.wait_for_timeout(300)
    # finishing from the list goes to cardio too
    ok(await pg.locator('[data-finish]').count()==1,'the list has Finish workout');await pg.evaluate("document.querySelector('[data-finish]').click()");await pg.wait_for_timeout(300)
    ok(await pg.evaluate("ses.state")=='cpick' and not await pg.evaluate("!!ses.finished"),'Finish workout on the list goes to cardio first')
    await pg.evaluate("ses.state='idle';focus=null;save();render()");await pg.wait_for_timeout(200)
    # lift everything, then cardio
    await pg.evaluate("ses.startedAt=Date.now()-1800000;ses.warmDone=true;ses.ex.forEach(e=>e.sets.forEach(s=>s.done=true));const L=ses.ex.length-1;ses.active=L;ses.state='next';ses.stateAt=Date.now();focus=L;save();render()");await pg.wait_for_timeout(300)
    ok(await pg.locator('#tB').inner_text()=='Cardio','after the last exercise the button is Cardio, not Finish')
    await pg.click('[data-tb]');await pg.wait_for_timeout(300)
    ok(await pg.locator('[data-ceq]').count()>=6 and await pg.locator('#tL').text_content()=='Pick your cardio','a page of machine bubbles')
    await pg.click('[data-ceq="Rower"]');await pg.click('[data-cmin="10"]');await pg.wait_for_timeout(200)
    ok(await pg.locator('#tB').inner_text()=='Start 10 min','pick a machine and 10, 15 or 20 minutes')
    await pg.click('[data-tb]');await pg.wait_for_timeout(1200)
    ms=await pg.evaluate("phase().ms");ok(590000<ms<=600000,f'it counts down from 10:00 ({ms//1000} s left)')
    await pg.evaluate("ses.stateAt-=600500");await pg.wait_for_timeout(400)
    ok(await pg.evaluate("phase().over")==True and await pg.locator('#tB').inner_text()=='Finish workout','at zero it says so and offers Finish')
    await pg.click('[data-tb]');await pg.wait_for_timeout(300);await pg.evaluate("document.querySelectorAll('.scrim').forEach(x=>x.remove())")
    ok(await pg.evaluate("hist[hist.length-1].cardio.eq")=='Rower','the cardio is saved with the workout')
    # today is now locked
    await pg.click('[data-tab=plan]');await pg.wait_for_timeout(200);await pg.click(f'.stile[data-k="{t}"]');await pg.wait_for_timeout(300)
    ok('from next week' in await pg.locator('.scrim h3').inner_text(),"a trained day isn't planned over: it offers that day from next week instead")
    old=await pg.evaluate(f"dayPlan({t})")
    await pg.click('[data-nw="Legs"]');await pg.wait_for_timeout(300)
    ok(await pg.evaluate(f"workouts.find(w=>w.id===week[{t}]).name")=='Legs' and await pg.evaluate(f"dayPlan({t})")==old,'the weekly plan changes, this week stays as it was')
    ok('instead of' not in await pg.locator('.stile.tod').inner_text(),"so today's tile doesn't turn into 'instead of'")
    await pg.evaluate("planMode='edit';render()");await pg.wait_for_timeout(200)
    ok('Done this week' in await pg.locator(f'[data-pday="{t}"]').inner_text(),'the planner marks it done this week')
    await pg.click(f'[data-pday="{t}"]');await pg.wait_for_timeout(200)
    ok('from next week' in await pg.locator('.scrim h3').inner_text(),'tapping it there offers next week too')
    await pg.keyboard.press('Escape');await pg.wait_for_timeout(200)
    ok(not await pg.evaluate(f"freeDays().filter(i=>!lockedDay(i)).includes({t})"),'make-ups can\'t be planned onto it')
    # in progress locks too
    await pg.evaluate("hist=[];ses=null;save();ensureSession();ses.startedAt=Date.now();ses.pausedAt=Date.now();ses.warmDone=true;planMode=null;save();render()")
    await pg.evaluate(f"quickDay({t})");await pg.wait_for_timeout(200)
    ok('underway' in await pg.locator('.toast').inner_text(),'today is locked while a workout is going')
    # skip path
    await pg.evaluate("ses.pausedAt=null;ses.ex.forEach(e=>e.sets.forEach(s=>s.done=true));ses.state='cpick';tab='today';focus=0;save();render()");await pg.wait_for_timeout(200)
    await pg.click('[data-cskip]');await pg.wait_for_timeout(300)
    ok(await pg.evaluate("ses.finished")==True,'Skip cardio today finishes the workout')
    ok(not errs,f'no page errors {errs}')
    await b.close()
asyncio.run(main());R.finish()
