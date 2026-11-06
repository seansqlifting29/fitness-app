"""Overview: one pie with chips to choose what it shows (plan kept, gym time, muscles,
work to rest), every number checked against the sample history, the choice remembered.
Achievements only count showing up.

    python3 tests/overview_pie.py
"""
import asyncio, os, sys, json
sys.path.insert(0, os.path.dirname(__file__))
from playwright.async_api import async_playwright
from _common import build, serve, launch_args, Results
build(); BASE, srv = serve(); R = Results(); ok = R.check
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(**launch_args());errs=[]
    ctx=await b.new_context(viewport={'width':390,'height':844},service_workers='block');pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(BASE+'preview.html');await pg.wait_for_timeout(1200)
    ok(await pg.locator('.an-pie').count()==1 and await pg.locator('.an-ring').count()==0,'one pie replaces the two rings')
    ok(await pg.locator('.an-pchips button').count()==4,'four chips under the pie')
    # gym time: check the headline against the raw history
    await pg.click('[data-pie=time]');await pg.wait_for_timeout(200)
    exp=await pg.evaluate("""(()=>{const c=Date.now()-28*864e5;const R=hist.filter(h=>(h.start||0)>=c);const T=R.reduce((a,h)=>a+h.total,0),U=R.reduce((a,h)=>a+h.tut,0),Rs=R.reduce((a,h)=>a+h.rest,0);
      return [Math.round(T/R.length/60000),Math.round(U/T*100)]})()""")
    txt=await pg.locator('.an-pie').inner_text()
    ok(f"{exp[0]}m" in txt and f"Lifting {exp[1]}%" in txt,f'gym time matches the history ({exp[0]} min, lifting {exp[1]}%)')
    await pg.click('[data-pie=ratio]');await pg.wait_for_timeout(200);ok('1:' in await pg.locator('.an-pie').inner_text(),'work to rest shows a ratio')
    await pg.click('[data-pie=muscle]');await pg.wait_for_timeout(200);ok('sets' in await pg.locator('.an-pie').inner_text(),'muscles shows sets by group')
    await pg.reload();await pg.wait_for_timeout(1200)
    ok(await pg.locator('[data-pie].on').get_attribute('data-pie')=='muscle','the choice is remembered')
    await pg.click('[data-pie=plan]');await pg.wait_for_timeout(200)
    ok('of your plan' in await pg.locator('.an-ph').inner_text(),'showing up reports plan kept')
    ids=await pg.evaluate("[...document.querySelectorAll('[data-medal]')].map(b=>b.dataset.medal)")
    ok(ids==['kept','streak','sessions','makeups'],f'achievements are about showing up {ids}')
    ok(not errs,f'no page errors {errs}')
    await b.close()
asyncio.run(main());R.finish()
