"""Open, rest and planned days. A new week starts open, not as rest. Starting a workout on an open
day just starts it; swapping out a planned workout or a rest day asks first, full screen; adding a
second workout never asks. Older saves where an empty day meant rest still read as rest.

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
    ok(await pg.locator('.stile.open').count()==7 and await pg.locator('.stile.rest').count()==0,'schedule shows 7 open tiles')
    await pg.click('[data-tab=today]');await pg.click('.chip >> nth=0');await pg.wait_for_timeout(200)
    ok(await pg.locator('.takeover').count()==0 and await h1(pg)!='Today','open day: workout starts with no question')
    ok(await pg.locator('.plannote').count()==0,'no "Plan says" banner')
    # plan today and a rest day, then reload
    await pg.evaluate("const t=wd(new Date());week[t]=workouts.find(w=>w.name==='Upper').id;week[(t+1)%7]=REST;ses=null;save()")
    ok(json.loads(await pg.evaluate("localStorage.getItem('gym.week')")).count('open')==5,'open days are saved as open')
    await pg.reload();await pg.wait_for_timeout(400)
    ok(await h1(pg)=='Upper','planned workout shows on Today')
    await pg.click('[data-altw=then]');await pg.click('[data-cw] >> nth=0');await pg.wait_for_timeout(200)
    ok(await pg.locator('.takeover').count()==0 and await pg.locator('.thenrow').count()==1,'second workout is added without asking')
    await pg.click('[data-thenx]');await pg.wait_for_timeout(100)
    await pg.click('[data-altw=swap]');await pg.click('[data-cw] >> nth=0');await pg.wait_for_timeout(200)
    ok('planned today' in (await pg.locator('.takeover h2').inner_text()),'swapping a planned workout asks full screen')
    await pg.go_back(wait_until='commit');await pg.wait_for_timeout(250)
    ok(await pg.locator('.takeover').count()==0 and await h1(pg)=='Upper','back gesture cancels the question')
    await pg.click('[data-altw=swap]');await pg.click('[data-cw] >> nth=0');await pg.click('[data-tk="1"]');await pg.wait_for_timeout(200)
    ok(await h1(pg)=='Upper' and 'Then' in await pg.locator('.thenrow').inner_text(),'"Do both" keeps the plan first')
    nm=(await pg.locator('.thenrow b').inner_text())
    await pg.evaluate("ses.finished=true;ses.startedAt=Date.now()-60000;ses.endedAt=Date.now();save();render()")
    await pg.click('[data-startthen]');await pg.wait_for_timeout(200)
    ok(await h1(pg)==nm,'after finishing, the second workout starts from one button')
    await pg.evaluate("ses=buildSession(plannedToday());save();render()")
    await pg.click('[data-altw=swap]');await pg.click('[data-cw] >> nth=0');await pg.click('[data-tk="0"]');await pg.wait_for_timeout(200)
    ok(await h1(pg)!='Upper','"instead" swaps today only');ok(await pg.evaluate('isW(week[wd(new Date())])'),'the plan itself is unchanged')
    # rest day
    await pg.evaluate("week[wd(new Date())]=REST;ses=null;save();ensureSession();render()")
    ok(await h1(pg)=='Rest day','rest day is called Rest day')
    await pg.click('.chip >> nth=0');await pg.wait_for_timeout(200)
    ok('rest day' in (await pg.locator('.takeover h2').inner_text()),'training on a rest day asks first')
    await pg.click('[data-tk="1"]');await pg.wait_for_timeout(100);ok(await h1(pg)=='Rest day','Keep resting cancels')
    await pg.click('.chip >> nth=0');await pg.click('[data-tk="0"]');await pg.wait_for_timeout(200);ok(await h1(pg)!='Rest day','Train anyway starts it')
    # older save: empty days in a planned week mean rest
    old="localStorage.setItem('gym.me',JSON.stringify({name:'Old'}));localStorage.setItem('gym.weekReset1','true');localStorage.setItem('gym.workouts',JSON.stringify([{id:'a',name:'Push',ex:[{name:'Bench Press',sets:3,reps:8,w:60,rest:90}]}]));localStorage.setItem('gym.week',JSON.stringify(['a',null,null,'a',null,null,null]))"
    pg=await page("if(!sessionStorage.getItem('x')){"+old+";sessionStorage.setItem('x','1')}")
    ok(await pg.evaluate("JSON.stringify(week)")==json.dumps(['a','rest','rest','a','rest','rest','rest']).replace(' ',''),'older saves: empty days in a planned week read as rest')
    ok(not errs,f'no page errors {errs}')
    await b.close()
asyncio.run(main());R.finish()
