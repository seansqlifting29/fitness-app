"""Left over: a planned workout missed earlier this week, or one ended early, shows in the
This week tile on Schedule. It can be made up today, planned for another day, or combined with
others into one day (at most 3, with a warning past that). Making it up or dropping it clears it,
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
    await pg.goto(BASE);await pg.wait_for_timeout(500);await pg.fill('#nm','Sam');await pg.click('#go');await pg.wait_for_timeout(300)
    t=await pg.evaluate('wd(new Date())')
    # today: Upper, ended early after one exercise
    await pg.evaluate("""const t=wd(new Date());week[t]=workouts.find(w=>w.name==='Upper').id;ses=null;save();ensureSession();
      ses.startedAt=Date.now()-600000;ses.warmDone=true;ses.ex[0].sets.forEach(s=>s.done=true);save();finishWorkout();document.querySelectorAll(".scrim").forEach(x=>x.remove())""")
    await pg.click('[data-tab=plan]');await pg.wait_for_timeout(300)
    ok(await pg.locator('.ssum .stleft').count()==1 and 'Upper' in await pg.locator('.ssum .stleft').inner_text(),'a workout ended early shows as left over')
    if t>0:
      await pg.evaluate("week[wd(new Date())-1]=workouts.find(w=>w.name==='Push').id;save();render()");await pg.wait_for_timeout(200)
      ok('Push' in await pg.locator('.ssum .stleft').inner_text(),'a missed workout earlier this week shows as left over')
    await pg.click('.ssum');await pg.wait_for_timeout(300)
    n=await pg.locator('.lorow').count();ok(n==(2 if t>0 else 1),'tapping the tile lists what is left over')
    # make up the Upper leftover: only the exercises that were skipped
    left=await pg.evaluate("leftovers().find(o=>o.key.startsWith('p:')).ex.length")
    await pg.locator('.lorow',has_text='Upper').locator('[data-lodo]').click();await pg.wait_for_timeout(300)
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
    # plan for another day, combine, and the warning past 3
    await pg.evaluate("localStorage.removeItem('gym.extra');localStorage.removeItem('gym.dropped');hist=[];for(let i=0;i<7;i++)week[i]=null;save()")
    await pg.evaluate("const t=wd(new Date());const W=['Push','Pull','Legs','Upper','Lower'];hist=[];W.forEach((n,k)=>{const w=workouts.find(x=>x.name===n);hist.push({id:'h'+k,date:dkey(new Date()),wid:w.id,split:n,ex:[],sets:1,total:1,start:Date.now(),skipped:w.ex.map(e=>({name:e.name,sets:3}))})});save();render()")
    L=await pg.evaluate('leftovers().length');ok(L==5,'five left overs to work with')
    await pg.click('[data-tab=plan]');await pg.wait_for_timeout(200);await pg.click('.ssum');await pg.wait_for_timeout(300)
    if await pg.evaluate('bestDay()')!=None:
      ok('+' in await pg.locator('.locombo small').inner_text() and await pg.evaluate("document.querySelector('.locombo small').textContent.split(' + ').length")==3,'combine suggests at most 3')
      await pg.click('[data-lcplan]');await pg.wait_for_timeout(300)
      ok(await pg.evaluate('Object.values(extras()).flat().length')==3,'the combo of 3 is planned on one day')
      ok(await pg.evaluate('leftovers().length')==2,'planned make-ups leave the left over list')
      ok(await pg.locator('.stile .stnm',has_text='Make-up').count()==1,'the day shows as Make-up on Schedule')
      await pg.click('.ssum');await pg.wait_for_timeout(300);await pg.locator('[data-lopick]').first.click();await pg.wait_for_timeout(300)
      day=await pg.evaluate("Object.keys(extras())[0]");idx=await pg.evaluate(f"[0,1,2,3,4,5,6].find(i=>dkey(dayDate(i))==='{day}')")
      await pg.click(f'[data-dp="{idx}"]');await pg.wait_for_timeout(300)
      ok('workouts on' in await pg.locator('.takeover h2').inner_text(),'a 4th workout on one day warns about the risk')
      await pg.click('[data-tk="0"]');await pg.wait_for_timeout(300);ok(await pg.locator('.scrim h3',has_text='Left over').count()==1,'Spread them out goes back to the list')
    ok(not errs,f'no page errors {errs}')
    await b.close()
asyncio.run(main());R.finish()
