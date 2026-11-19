"""Left over: a planned workout missed earlier this week, or one ended early, shows in the
This week tile on Schedule. It can be made up today or planned for another day, one a day. With more
left over than days, it says so kindly and keeps what fits. A second workout on one day asks first. Making it up or dropping it clears it,
and today's own workout is queued after a make-up.

    python3 tests/leftover.py
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
    import datetime;await pg.clock.set_system_time(datetime.datetime(2026,11,7,10))  # a Saturday: these cases need days already gone this week
    await pg.goto(BASE);await pg.wait_for_timeout(500);await pg.fill('#nm','Sam');await pg.click('#go');await pg.wait_for_timeout(300)
    t=await pg.evaluate('wd(new Date())')
    # today: Upper, ended early after one exercise
    await pg.evaluate("""const t=wd(new Date());week[t]=workouts.find(w=>w.name==='Upper').id;ses=null;save();ensureSession();
      ses.startedAt=Date.now()-600000;ses.warmDone=true;ses.ex[0].sets.forEach(s=>s.done=true);save();finishWorkout();document.querySelectorAll(".scrim").forEach(x=>x.remove())""")
    await pg.evaluate("render()");await pg.wait_for_timeout(200)
    ok(await pg.locator('text=Start another workout').count()==0 and await pg.locator('[data-nx=left]').count()==1,'after a workout, the next step is the make-up, not another workout')
    await pg.click('[data-tab=plan]');await pg.wait_for_timeout(300)
    ok(await pg.locator('.ssum .stleft').count()==1 and 'Upper' in await pg.locator('.ssum .stleft').inner_text(),'a workout ended early shows as left over')
    if t>0:
      await pg.evaluate("week[wd(new Date())-1]=workouts.find(w=>w.name==='Push').id;save();render()");await pg.wait_for_timeout(200)
      ok('Push' in await pg.locator('.ssum .stleft').inner_text(),'a missed workout earlier this week shows as left over')
    await pg.click('.ssum');await pg.wait_for_timeout(300)
    n=await pg.locator('.lorow').count();ok(n==(2 if t>0 else 1),'tapping the tile lists what is left over')
    # make up the Upper leftover: only the exercises that were skipped
    left=await pg.evaluate("leftovers().find(o=>o.key.startsWith('p:')).ex.length")
    ok(await pg.locator('.lorow',has_text='Upper').locator('[data-lodo]').count()==0,'no Today button once you\'ve trained today: one workout a day')
    await pg.evaluate("document.querySelectorAll('.scrim').forEach(x=>x.remove());startMakeup(leftovers().find(o=>o.name==='Upper').key)");await pg.wait_for_timeout(300)
    ok(await pg.evaluate('tab')=='today' and await pg.evaluate('ses.ex.length')==left,'make-up has only the exercises left behind')
    await pg.evaluate("ses.startedAt=Date.now()-60000;ses.warmDone=true;ses.ex.forEach(e=>e.sets.forEach(s=>s.done=true));save();finishWorkout();document.querySelectorAll('.scrim').forEach(x=>x.remove())")
    ok(await pg.evaluate("!leftovers().some(o=>o.key.startsWith('p:'))"),'finishing the make-up clears it')
    if t>0:
      await pg.click('[data-tab=plan]');await pg.wait_for_timeout(200);await pg.click('.ssum');await pg.wait_for_timeout(300)
      await pg.locator('[data-lodrop]').first.click();await pg.wait_for_timeout(200)
      ok(await pg.evaluate('leftovers().length')==0 and await pg.locator('.ssum .stleft').count()==0,'Drop clears it from the tile')
    # a make-up on a day with its own plan queues the plan after it
    await pg.evaluate("localStorage.removeItem('gym.dropped');hist=[];const t=wd(new Date());week[t]=workouts.find(w=>w.name==='Lower').id;if(t>0)week[t-1]=workouts.find(w=>w.name==='Pull').id;ses=null;save();ensureSession();render()")
    if t>0:
      await pg.evaluate("startMakeup(leftovers()[0].key)");await pg.wait_for_timeout(200)
      ok(await pg.evaluate("ses.split")=='Pull' and await pg.evaluate("workouts.find(w=>w.id===ses.then).name")=='Lower','today\'s own workout is queued after the make-up')
    # more left over than days left: a kind message, keep what fits (one a day) and let the rest go
    await pg.evaluate("localStorage.removeItem('gym.extra');localStorage.removeItem('gym.dropped');hist=[];for(let i=0;i<7;i++)week[i]=null;save()")
    await pg.evaluate("const W=['Push','Pull','Legs','Upper','Lower'];hist=[];W.forEach((n,k)=>{const w=workouts.find(x=>x.name===n);hist.push({id:'h'+k,date:dkey(new Date()),wid:w.id,split:n,ex:[],sets:1,total:1,start:Date.now(),skipped:w.ex.map(e=>({name:e.name,sets:3}))})});save();render()")
    L=await pg.evaluate('leftovers().length');ok(L==5,'five left overs to work with')
    F=await pg.evaluate('freeSlots().length')
    await pg.click('[data-tab=plan]');await pg.wait_for_timeout(200);await pg.click('.ssum');await pg.wait_for_timeout(300)
    card=await pg.locator('.locombo').inner_text()
    ok("That's okay" in card and 'one solid workout a day' in card,'too many to fit gets a kind message, not a pile-up')
    ok(await pg.locator('[data-lplan]').count()==1,'and a nudge to plan the week, since days are still empty')
    await pg.click('[data-lfit]');await pg.wait_for_timeout(300)
    per=await pg.evaluate("Object.values(extras()).map(v=>v.length)")
    ok(sum(per)==F and all(n==1 for n in per),f'keeps {F}, one per free day')
    ok(await pg.evaluate('leftovers().length')==0 and await pg.evaluate('dropped().length')==5-F,'the rest are let go')
    # a second workout on one day asks first
    await pg.evaluate("localStorage.removeItem('gym.extra');localStorage.removeItem('gym.dropped');save();render()")
    if F:
      i=await pg.evaluate('freeSlots()[0]')
      await pg.evaluate(f"planMakeups([leftovers()[0]],dkey(dayDate({i})),true)")
      await pg.evaluate(f"planChecked([leftovers()[0]],{i})");await pg.wait_for_timeout(300)
      ok('2 workouts on' in await pg.locator('.takeover h2').inner_text(),'two workouts on one day asks first')
      await pg.click('[data-tk="1"]');await pg.wait_for_timeout(200)
      ok(await pg.evaluate('dropped().length')==1,'and you can drop it right there')
    ok(not errs,f'no page errors {errs}')
    await b.close()
asyncio.run(main());R.finish()
