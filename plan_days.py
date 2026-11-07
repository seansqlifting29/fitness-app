"""Open, rest and planned days. A new week starts open, not as rest. Starting a workout on an open
day just starts it. Rest and open days offer Plan today or Swap workout day, which trades today with
another day this week only. Older saves where an empty day meant rest still read as rest.

    python3 tests/plan_days.py
"""
import asyncio, os, sys, json
sys.path.insert(0, os.path.dirname(__file__))
from playwright.async_api import async_playwright
from _common import build, serve, launch_args, Results
build(); BASE, srv = serve(); R = Results(); ok = R.check
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(**launch_args());errs=[]
    async def page(init=None):
      ctx=await b.new_context(viewport={'width':390,'height':844},service_workers='block')
      if init:await ctx.add_init_script(init)
      pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)));await pg.goto(BASE);await pg.wait_for_timeout(500);return pg
    h1=lambda pg:pg.locator('h1').first.inner_text()
    pg=await page();await pg.fill('#nm','Sam');await pg.click('#go');await pg.wait_for_timeout(300)
    ok(await pg.evaluate('week.every(x=>x===null)'),'new week starts open')
    ok(await h1(pg)=='Today','open day is called Today, not Rest')
    await pg.click('[data-tab=plan]');await pg.wait_for_timeout(200)
    ok(await pg.locator('.stile.open').count()+await pg.locator('.stile.gone').count()==7 and await pg.locator('.stile.rest').count()==0,'schedule starts with every day open (past days just show as past)')
    await pg.click('[data-tab=today]');await pg.click('.chip >> nth=0');await pg.wait_for_timeout(200)
    ok(await pg.locator('.takeover').count()==0 and await h1(pg)!='Today','open day: workout starts with no question')
    qn=await h1(pg)
    await pg.evaluate("ses.startedAt=Date.now()-600000;ses.warmDone=true;ses.ex.forEach(e=>e.sets.forEach(s=>s.done=true));save();finishWorkout();document.querySelectorAll('.scrim').forEach(x=>x.remove())")
    await pg.click('[data-tab=plan]');await pg.wait_for_timeout(200)
    ok(await pg.locator('.stile.tod .stnm').inner_text()==qn,'a quick workout on an open day shows on Schedule')
    await pg.click('[data-tab=today]');await pg.wait_for_timeout(200)
    ok(await pg.locator('[data-nx=plan]').count()==1 or await pg.evaluate('wd(new Date())')==6,'after it, the next step is planning the rest of the week')
    await pg.evaluate("hist=[];ses=null;save();render()")
    ok(await pg.locator('.plannote').count()==0,'no "Plan says" banner')
    # plan today and a rest day, then reload
    await pg.evaluate("const t=wd(new Date());week[t]=workouts.find(w=>w.name==='Upper').id;week[(t+1)%7]=REST;ses=null;save()")
    ok(json.loads(await pg.evaluate("localStorage.getItem('gym.week')")).count('open')==5,'open days are saved as open')
    await pg.reload();await pg.wait_for_timeout(400)
    ok(await h1(pg)=='Upper','planned workout shows on Today')
    ok(await pg.locator('text=Add a second workout').count()==0 and await pg.locator('text=Do a different workout').count()==0,'no second-workout or different-workout options')
    if await pg.evaluate('wd(new Date())')<6:
      await pg.evaluate("week[wd(new Date())+1]=workouts.find(w=>w.name==='Lower').id;save();render()")
      await pg.click('[data-dswap]');await pg.wait_for_timeout(300)
      ok(await pg.locator('.scrim h3').inner_text()=='Swap workout day','Swap workout day opens the day list')
      await pg.click('[data-dsw="'+str(await pg.evaluate('wd(new Date())+1'))+'"]');await pg.wait_for_timeout(300)
      ok(await h1(pg)=='Lower','today takes the other day\'s workout')
      ok(await pg.evaluate("workouts.find(w=>w.id===dayPlan(wd(new Date())+1)).name")=='Upper','and that day takes today\'s')
      ok(await pg.evaluate("workouts.find(w=>w.id===week[wd(new Date())]).name")=='Upper','the weekly plan itself is unchanged')
      await pg.click('[data-tab=plan]');await pg.wait_for_timeout(200)
      ok(await pg.locator('.stile.tod .stnm').inner_text()=='Lower','Schedule shows the swap')
      await pg.click('[data-tab=today]');await pg.wait_for_timeout(200)
    await pg.evaluate("localStorage.removeItem('gym.dayOver');ses=null;save();render()")
    # rest day
    await pg.evaluate("week[wd(new Date())]=REST;ses=null;save();ensureSession();render()")
    ok(await h1(pg)=='Rest day','rest day is called Rest day')
    ok(await pg.locator('.chip').count()==0,'a rest day offers no random workout picker')
    if await pg.evaluate('wd(new Date())')<6:
      await pg.evaluate("week[wd(new Date())+1]=workouts.find(w=>w.name==='Push').id;save();render()")
      await pg.click('[data-dswap]');await pg.click('[data-dsw="'+str(await pg.evaluate('wd(new Date())+1'))+'"]');await pg.wait_for_timeout(300)
      ok(await h1(pg)=='Push' and await pg.evaluate("dayPlan(wd(new Date())+1)")=='rest','swap workout day pulls a later workout into a rest day')
    await pg.evaluate("for(let i=wd(new Date())+1;i<7;i++)week[i]=i%2?REST:null;localStorage.removeItem('gym.dayOver');week[wd(new Date())]=workouts.find(w=>w.name==='Upper').id;ses=null;save();render()")
    ok(await pg.locator('[data-dswap]').count()==0,'no Swap workout day when later days are only rest or open')
    # planning on the day: tap today on Schedule, pick, and Today follows straight away
    pg=await page();await pg.fill('#nm','Day');await pg.click('#go');await pg.wait_for_timeout(300)
    t=await pg.evaluate('wd(new Date())')
    await pg.click('[data-tab=plan]');await pg.wait_for_timeout(200);await pg.click(f'.stile[data-k="{t}"]');await pg.wait_for_timeout(300)
    ok((await pg.locator('.scrim h3').inner_text()).endswith('· today'),'tapping today on Schedule opens a quick day picker')
    await pg.click('[data-qd="Upper"]');await pg.wait_for_timeout(300);await pg.click('[data-tab=today]');await pg.wait_for_timeout(200)
    ok(await h1(pg)=='Upper','picking a workout for today shows on Today at once, no Save step')
    # a swap this week doesn't block planning today
    await pg.evaluate("const O={};O[dkey(new Date())]=workouts.find(w=>w.name==='Pull').id;S.set('gym.dayOver',O);ses=null;render()");await pg.wait_for_timeout(200)
    ok(await h1(pg)=='Pull','(this week was swapped to Pull)')
    await pg.click('[data-tab=plan]');await pg.wait_for_timeout(200);await pg.click(f'.stile[data-k="{t}"]');await pg.wait_for_timeout(300)
    await pg.click('[data-qd="Legs"]');await pg.wait_for_timeout(300);await pg.click('[data-tab=today]');await pg.wait_for_timeout(200)
    ok(await h1(pg)=='Legs','planning today replaces this week\'s swap')
    # once a workout is going, today is locked
    await pg.evaluate("ses.startedAt=Date.now();ses.pausedAt=Date.now();ses.warmDone=true;save()")
    await pg.click('[data-tab=plan]');await pg.wait_for_timeout(200);await pg.click(f'.stile[data-k="{t}"]');await pg.wait_for_timeout(300)
    ok(await pg.locator('.scrim').count()==0 and 'underway' in await pg.locator('.toast').last.inner_text(),'a workout underway locks today: no planning over it')
    # older save: empty days in a planned week mean rest
    old="localStorage.setItem('gym.me',JSON.stringify({name:'Old'}));localStorage.setItem('gym.weekReset1','true');localStorage.setItem('gym.workouts',JSON.stringify([{id:'a',name:'Push',ex:[{name:'Bench Press',sets:3,reps:8,w:60,rest:90}]}]));localStorage.setItem('gym.week',JSON.stringify(['a',null,null,'a',null,null,null]))"
    pg=await page("if(!sessionStorage.getItem('x')){"+old+";sessionStorage.setItem('x','1')}")
    ok(await pg.evaluate("JSON.stringify(week)")==json.dumps(['a','rest','rest','a','rest','rest','rest']).replace(' ',''),'older saves: empty days in a planned week read as rest')
    ok(not errs,f'no page errors {errs}')
    await b.close()
asyncio.run(main());R.finish()
