"""Today always matches the plan, and the machine-taken swap.
A workout that hasn't started is rebuilt when its plan changes (an edit, or a sync from another
phone), while exercises you added just for today are kept if the plan didn't change. The ⋯ on an
exercise swaps it with one from later this week (both days change, this week only) or a similar
one for today. Also checks the gear sits in the same spot on every tab and double-tap zoom is off.

    python3 tests/swap_sync.py
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
    t=await pg.evaluate('wd(new Date())')
    await pg.evaluate("week[wd(new Date())]=workouts.find(w=>w.name==='Lower').id;ses=null;save();render()")
    names=lambda:pg.evaluate("ses.ex.map(e=>e.name)")
    a=await names()
    # another phone changes Lower: the not-started session follows
    await pg.evaluate("const w=workouts.find(w=>w.name==='Lower');w.ex=w.ex.slice().reverse();save();render()");await pg.wait_for_timeout(200)
    ok(await names()==list(reversed(a)),'a plan change reaches today before you start')
    # an older saved session that doesn't match the plan is fixed too
    await pg.evaluate("delete ses.sig;ses.ex=ses.ex.slice(1);save();render()");await pg.wait_for_timeout(200)
    ok(await names()==list(reversed(a)),'an old mismatched session is rebuilt from the plan')
    # something added just for today stays
    await pg.evaluate("ses.ex.push(exOf({name:'Plank',sets:3,reps:30,w:0,rest:60}));save();render()");await pg.wait_for_timeout(200)
    ok('Plank' in await names(),'an exercise added just for today is kept')
    # started sessions are never touched
    await pg.evaluate("ses.startedAt=Date.now();const w=workouts.find(w=>w.name==='Lower');w.ex=w.ex.slice(0,2);save();render()");await pg.wait_for_timeout(200)
    ok(len(await names())>2,'a workout in progress is never rebuilt')
    await pg.evaluate("workouts=workouts.filter(x=>x);const w=workouts.find(w=>w.name==='Lower');w.ex=["+
      "E('Back Squat',3,8,60,120),E('Leg Extension',3,12,40,60),E('Standing Calf Raise',3,12,40,60),E('Romanian Deadlift',3,8,60,90)];ses=null;focus=null;save();render()")
    # swap with later this week
    if t<6:
      await pg.evaluate("week[wd(new Date())+1]=workouts.find(w=>w.name==='Upper').id;save();render()");await pg.wait_for_timeout(200)
      ok(await pg.locator('[data-xsub]').count()==0,'no swap dots while you are still planning')
      await pg.evaluate("ses.startedAt=Date.now();ses.pausedAt=Date.now();ses.warmDone=true;focus=null;save();render()");await pg.wait_for_timeout(200)
      x0=(await names())[0]
      await pg.locator('[data-xsub="0"]').click();await pg.wait_for_timeout(300)
      ok('Swap' in await pg.locator('.scrim h3').inner_text(),'⋯ opens the swap sheet')
      later=await pg.locator('[data-swl]').count();ok(later>0,'offers exercises from later this week')
      y=(await pg.locator('[data-swl="0"] b').inner_text())
      await pg.click('[data-swl="0"]');await pg.wait_for_timeout(300)
      ok((await names())[0]==y,f'{x0} swapped for {y} today')
      tom=await pg.evaluate("planEx(week[wd(new Date())+1],dkey(dayDate(wd(new Date())+1))).map(e=>e.name)")
      ok(x0 in tom and y not in tom,f'{x0} moves to the later day instead')
      await pg.reload();await pg.wait_for_timeout(400)
      ok((await names())[0]==y,'the swap holds after reopening the app')
    await pg.locator('[data-xsub="1"]').click();await pg.wait_for_timeout(300)
    z=await pg.locator('[data-sws="0"] b').inner_text();await pg.click('[data-sws="0"]');await pg.wait_for_timeout(300)
    ok((await names())[1]==z,'similar exercise swaps in for today')
    # gear in the same place everywhere
    pos=[]
    for tb in ['today','plan','stats']:
      await pg.click(f'[data-tab={tb}]');await pg.wait_for_timeout(300)
      pos.append(await pg.evaluate("(()=>{const r=document.querySelector('#main [data-settings]').getBoundingClientRect();return Math.round(r.x)+','+Math.round(r.y)})()"))
    ok(len(set(pos))==1,f'settings gear sits in the same spot on all three tabs {pos}')
    ok(await pg.evaluate("getComputedStyle(document.querySelector('[data-tab=today]')).touchAction")=='manipulation','double-tap zoom is off')
    ok(not errs,f'no page errors {errs}')
    await b.close()
asyncio.run(main());R.finish()
