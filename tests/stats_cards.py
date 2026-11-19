"""Branch C analytics: the stats-study cards and the end-of-workout charts.

Checks the new cards render on the 1-year sample with no errors, the Workout saved sheet has its four
views (drop-off, sets, volume, rest) and nothing in it runs off a narrow phone, the drop-off math is right,
and a brand new user sees the new cards locked instead of broken.

    python3 tests/stats_cards.py
"""
import asyncio, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from playwright.async_api import async_playwright
from _common import build, serve, launch_args, Results
build(); BASE, srv = serve(); R = Results(); ok = R.check

NEW_OV = ['lastwk', 'restdist', 'realgain', 'forecast']
NEW_ADV = ['droptrend', 'restpay', 'hitreps', 'normal', 'kinds']
INSIDE = """(()=>{const out=[];document.querySelectorAll('svg.ch').forEach(sv=>{const vb=sv.viewBox.baseVal;const c=sv.closest('[data-card]');sv.querySelectorAll('rect,circle,path,text,line').forEach(el=>{if(el.getAttribute('fill')==='transparent')return;let b;try{b=el.getBBox()}catch(e){return}if(!b.width&&!b.height)return;
  if(b.x<-1||b.y<-1||b.x+b.width>vb.width+1||b.y+b.height>vb.height+1)out.push((c?c.dataset.card:'?')+' '+(el.textContent||el.tagName).slice(0,10))})});return out.slice(0,6)})()"""
OVERFLOW = """(sel=>{const out=[];document.querySelectorAll(sel+' *').forEach(el=>{if(el.closest('.an-ach,.an-exsel'))return;const r=el.getBoundingClientRect();if(r.width&&(r.right>innerWidth+1||r.left<-1))out.push(el.className&&el.className.baseVal!==undefined?el.tagName:(el.className||el.tagName))});return out.slice(0,6)})"""


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**launch_args())
        for width in (390, 320):
            errs = []
            ctx = await b.new_context(viewport={'width': width, 'height': 844}, service_workers='block')
            pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
            await pg.goto(BASE + 'preview.html'); await pg.wait_for_timeout(1500)
            ev = pg.evaluate
            await ev("document.querySelectorAll('[data-tskip]').forEach(b=>b.click())")
            await ev("(()=>{const t=document.querySelector('[data-tab=analytics]');t&&t.click()})()"); await pg.wait_for_timeout(400)
            for c in NEW_OV:
                ok(await ev(f"!!document.querySelector('[data-card={c}] h3')"), f'{width}px: Overview shows {c} on the sample year')
            ok(await ev(OVERFLOW + "('#main')") == [], f'{width}px: nothing on Overview runs off the screen')
            ok(await ev(INSIDE) == [], f'{width}px: every Overview chart stays inside its own box')
            await ev("document.querySelector('[data-atab=advanced]').click()"); await pg.wait_for_timeout(400)
            for c in NEW_ADV:
                ok(await ev(f"!!document.querySelector('[data-card={c}] h3')"), f'{width}px: Advanced shows {c}')
            ok(await ev(OVERFLOW + "('#main')") == [], f'{width}px: nothing on Advanced runs off the screen')
            ok(await ev(INSIDE) == [], f'{width}px: every Advanced chart stays inside its own box')
            ok(await ev("!document.querySelector('.an-exsel')&&!!document.querySelector('.an-exdd [data-lp]')"), f'{width}px: Advanced picks the lift from a drop-down, not a sideways scroll')
            first = await ev("document.querySelector('.an-exdd b').textContent"); await ev("document.querySelector('.an-exdd [data-lp]').click()"); await pg.wait_for_timeout(200)
            await ev("document.querySelectorAll('.an-sheet [data-pl]')[1].click()"); await pg.wait_for_timeout(300)
            ok(await ev("document.querySelector('.an-exdd b').textContent") != first and await ev("document.querySelector('.an-exsel')") is None, f'{width}px: picking a lift from the drop-down switches the charts')
            # the Last workout card opens the end-of-workout sheet
            await ev("document.querySelector('[data-atab=overview]').click()"); await pg.wait_for_timeout(300)
            await ev("document.querySelector('[data-card=lastwk]').click()"); await pg.wait_for_timeout(400)
            ok(await ev("document.querySelectorAll('.sheet [data-wkv]').length") == 4, f'{width}px: the sheet has drop-off, sets, volume and rest')
            heights = []
            for v in ['drop', 'sets', 'vol', 'rest']:
                await ev(f"document.querySelector('[data-wkv={v}]').click()"); await pg.wait_for_timeout(120)
                heights.append(await ev("document.querySelector('.sheet').getBoundingClientRect().height"))
                ok(await ev(OVERFLOW + "('.sheet')") == [], f'{width}px: {v} view fits on screen')
                ok(await ev(f"getComputedStyle(document.querySelector('[data-wkp={v}]')).visibility") == 'visible', f'{width}px: {v} view shows when picked')
            ok(max(heights) - min(heights) < 2, f'{width}px: the sheet keeps its height when switching views')
            ok(not errs, f'{width}px: no page errors {errs[:2]}')
            await ctx.close()

        # the math, and a finished workout opening the sheet
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, service_workers='block'); errs = []
        pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(BASE); await pg.wait_for_timeout(400)
        await pg.fill('#nm', 'Sam'); await pg.click('#go'); await pg.wait_for_timeout(300)
        ev = pg.evaluate
        await ev("tab='analytics';render()"); await pg.wait_for_timeout(300)
        ok(await ev("!document.querySelector('[data-card=realgain]')"), 'with no workouts the analytics page shows its empty state, not broken cards')
        await ev("tab='today';render()"); await pg.wait_for_timeout(200)
        await ev("""(()=>{week[wd(new Date())]=workouts.find(w=>w.name==='Push').id;ses=null;save();ensureSession();ses.startedAt=Date.now()-3e6;ses.warmDone=true;
          ses.ex.slice(0,2).forEach((e,k)=>{e.sets.forEach((s,j)=>{s.done=true;s.w=60;s.r=[10,9,7][j]||7;s.tut=30000;s.rest=j?120000:null})});save();finishWorkout()})()"""); await pg.wait_for_timeout(500)
        ok(await ev("document.querySelectorAll('.sheet [data-wkv]').length") == 4, 'finishing a workout opens Workout saved with the four views')
        ok('lost the most' in await ev("document.querySelector('[data-wkp=sets] .wk-h').textContent") or 'held' in await ev("document.querySelector('[data-wkp=sets] .wk-h').textContent"), 'the sets view names the lift that lost the most')
        ok('30%' in await ev("document.querySelector('[data-wkp=drop]').textContent"), 'drop-off is worked out right: 10 → 7 reps is 30% lost')
        ok('First time' in await ev("document.querySelector('[data-wkp=vol] .wk-h').textContent"), 'with no earlier session, volume says it\'s the first time')
        await ev("document.querySelectorAll('.scrim').forEach(s=>s.remove());render()"); await pg.wait_for_timeout(200)
        await ev("document.querySelector('[data-saved]').click()"); await pg.wait_for_timeout(300)
        ok(await ev("document.querySelectorAll('.sheet [data-wkv]').length") == 4, 'tapping Workout saved on Today brings the charts back')
        await ev("document.querySelectorAll('.scrim').forEach(s=>s.remove());tab='analytics';render()"); await pg.wait_for_timeout(300)
        locks = await ev("[...document.querySelectorAll('[data-lock] .an-lock b')].map(x=>x.textContent)")
        import re
        ok(locks and all(re.match(r'Unlocks after \d+ more .*(workouts?|months?|weeks?)$', t) for t in locks), f'locked charts say how many more workouts until they unlock ({locks[:2]})')
        ok(not errs, f'no page errors {errs[:2]}')
        await b.close()
    srv.shutdown()
    R.finish()

asyncio.run(main())
