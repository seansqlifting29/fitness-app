"""Back navigation: walks every screen and sheet and checks the phone's back gesture,
Escape, close buttons and swipe-down all step back one level, ending on Today.

    python3 tests/navigation.py
"""
import asyncio, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from playwright.async_api import async_playwright
from _common import build, serve, launch_args, Results
build(); BASE, srv = serve(); R = Results(); ok = R.check
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(**launch_args())
    ctx=await b.new_context(viewport={'width':390,'height':844},timezone_id='Asia/Makassar');pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    ov="document.querySelectorAll('#app > .scrim, #app > .an-scrim').length"
    async def back():
      await pg.go_back(wait_until='commit');await pg.wait_for_timeout(250)
    await pg.goto(BASE+'preview.html');await pg.wait_for_timeout(1200)
    url0=pg.url
    # analytics: advanced -> overview -> today
    await pg.click('[data-atab=advanced]');await pg.wait_for_timeout(200)
    await back();ok(await pg.evaluate("document.querySelector('[data-atab=overview]').classList.contains('on')"),'back: Advanced -> Overview')
    await pg.click('[data-aedit]');await pg.wait_for_timeout(200);await back()
    ok(await pg.evaluate("!document.querySelector('.an-editb.on')"),'back: leaves Edit mode')
    await pg.click('[data-medal=kept]');await pg.wait_for_timeout(300);ok(await pg.evaluate("!!document.querySelector('.an-sheet .sclose')"),'medal sheet has close button')
    await pg.keyboard.press('Escape');await pg.wait_for_timeout(200);ok(await pg.evaluate(ov)==0,'Escape closes medal sheet')
    await pg.click('[data-medal=sessions]');await pg.wait_for_timeout(300);await back();ok(await pg.evaluate(ov)==0,'back closes a medal sheet')
    await pg.click('[data-card=consist] h3');await pg.wait_for_timeout(300);await pg.click('.an-sheet .sclose');await pg.wait_for_timeout(200);ok(await pg.evaluate(ov)==0,'X closes insight sheet')
    await back();ok(await pg.evaluate("tab")=='today','back: Analytics -> Today')
    # settings sheet: X present, swipe down closes
    await pg.click('[data-settings]');await pg.wait_for_timeout(400);ok(await pg.evaluate("!!document.querySelector('.scrim .sheet .sclose')"),'settings sheet has X')
    g=await pg.locator('.scrim .grab').bounding_box();await pg.mouse.move(g['x']+20,g['y']+2);await pg.mouse.down();await pg.mouse.move(g['x']+20,g['y']+60,steps=5);await pg.mouse.move(g['x']+20,g['y']+160,steps=5);await pg.mouse.up();await pg.wait_for_timeout(400)
    ok(await pg.evaluate(ov)==0,'swipe down closes settings sheet')
    # confirm box: back cancels, data kept
    await pg.click('[data-settings]');await pg.wait_for_timeout(400);await pg.click('[data-wipe]');await pg.wait_for_timeout(400)
    n=await pg.evaluate("hist.length");await back();await pg.wait_for_timeout(200)
    ok(await pg.evaluate(ov)==0 and await pg.evaluate("hist.length")==n,'back on Erase confirm cancels it')
    # today: focus exercise -> back
    await pg.locator('.item .t').first.click();await pg.wait_for_timeout(300);ok(await pg.evaluate("focus")!=None,'opened exercise')
    await back();ok(await pg.evaluate("focus")==None,'back: exercise -> list')
    # schedule
    await pg.click('[data-tab=plan]');await pg.wait_for_timeout(500)
    await pg.click('.hdr [data-settings]');await pg.wait_for_timeout(400)
    ok(await pg.evaluate("document.querySelector('.scrim h3').textContent")=='Settings','Schedule gear opens the same Settings')
    await back();ok(await pg.evaluate(ov)==0,'back closes Settings')
    await pg.click('[data-toplanedit]');await pg.wait_for_timeout(400)
    ok(await pg.evaluate("planMode")=='edit','Edit week opens the Plan editor')
    await pg.click('[data-pday="3"]');await pg.wait_for_timeout(400);ok(await pg.evaluate("!!document.querySelector('.scrim .sclose')"),'day picker has X')
    await back();ok(await pg.evaluate(ov)==0,'back closes day picker')
    await back();ok(await pg.evaluate("planMode")=='sched','back: Plan editor -> Schedule')
    # workout editor + stepper + picker
    await pg.evaluate("openWorkoutByName(weekNames().find(Boolean));planOpen=undefined;render()");await pg.wait_for_timeout(300)
    await pg.click('[data-pe^="w:"]');await pg.wait_for_timeout(300);await back();ok(await pg.evaluate(ov)==0,'back closes weight stepper')
    await pg.click('[data-padd]');await pg.wait_for_timeout(400)
    await pg.click('.xtile[data-xg=Back]');await pg.wait_for_timeout(200)
    await pg.fill('#xq','row');await pg.wait_for_timeout(200)
    await back();ok(await pg.evaluate("document.querySelector('#xq').value")=='','back clears picker search')
    await back();ok(await pg.evaluate("!document.querySelector('.xdrill')"),'back: muscle -> muscle tiles')
    await back();ok(await pg.evaluate(ov)==0,'back closes picker')
    await back();ok(await pg.evaluate("planW")==None,'back: workout editor -> Schedule')
    await back();ok(await pg.evaluate("tab")=='today','back: Schedule -> Today')
    ok(pg.url==url0,'still in the app, history intact')
    ok(await pg.evaluate("canGoBack()")==False,'Today with nothing open: nothing left to go back to')
    ok(not errs,'no page errors '+str(errs))
    await b.close()
asyncio.run(main())
srv.shutdown()
R.finish()
