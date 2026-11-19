"""Unit tests: the app's pure logic, called directly in the page with the clock pinned to a Wednesday.

    python3 tests/unit.py
"""
import asyncio, datetime, json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from _common import build, serve, launch_args, Results
from playwright.async_api import async_playwright

R = Results(); ok = R.check
WED = datetime.datetime(2026, 11, 4, 10, 0, 0)  # wd() == 2


async def main():
    build(); BASE, srv = serve()
    async with async_playwright() as p:
        b = await p.chromium.launch(**launch_args()); errs = []
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, service_workers='block')
        pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.clock.set_system_time(WED)
        await pg.goto(BASE); await pg.wait_for_timeout(400)
        await pg.fill('#nm', 'Sam'); await pg.click('#go'); await pg.wait_for_timeout(300)
        ev = pg.evaluate
        ok(await ev('wd(new Date())') == 2, 'clock pinned to a Wednesday')

        # ---- helpers ----
        ok(await ev('clock(65000)') == '1:05' and await ev('clock(3725000)') == '1:02:05' and await ev('clock(-5)') == '0:00', 'clock() formats m:ss and h:mm:ss, never negative')

        # ---- week model ----
        ok(await ev("JSON.stringify(normWeek(['a',null,'rest',null,'b',null,null]))") == json.dumps(['a', 'rest', 'rest', 'rest', 'b', 'rest', 'rest']).replace(' ', ''), 'normWeek: an old week with workouts reads empty days as rest')
        ok(await ev("JSON.stringify(normWeek(['a','open','rest','open','b','open','open']))") == json.dumps(['a', None, 'rest', None, 'b', None, None]).replace(' ', ''), "normWeek: 'open' reads back as open")
        ok(await ev("JSON.stringify(normWeek([null,null,null,null,null,null,null]))") == json.dumps([None] * 7).replace(' ', ''), 'normWeek: an empty new week stays open')
        ok(await ev("normWeek('x')") == 'x', 'normWeek leaves non-arrays alone')

        # a known week: Mon Push, Tue Pull, Wed (today) Legs, Thu rest, Fri Push, Sat Pull, Sun open
        await ev("""(()=>{const id=n=>workouts.find(w=>w.name===n).id;
          week=[id('Push'),id('Pull'),id('Legs'),REST,id('Push'),id('Pull'),null];hist=[];ses=null;
          ['gym.dayOver','gym.extra','gym.dropped','gym.swaps','gym.setupT','gym.setupAdj','gym.setupAdd'].forEach(k=>localStorage.removeItem(k));save();ensureSession();render()})()""")

        # ---- swaps ----
        ok(await ev('JSON.stringify(swapTargets())') == '[4,5]', 'swapTargets: only later days with a different workout (Fri, Sat), not rest or open')
        await ev("week[4]=week[2];save()")
        ok(await ev('JSON.stringify(swapTargets())') == '[5]', 'swapTargets: a later day with the same workout is not a swap')
        await ev("week[4]=workouts.find(w=>w.name==='Push').id;save()")
        sw = await ev("""(()=>{const w=workouts.find(w=>w.name==='Legs');const a=w.ex[0].name;
          localStorage.setItem('gym.swaps',JSON.stringify({[dkey(new Date())]:[{a,b:'Goblet Squat',def:{name:'Goblet Squat',sets:3,reps:10,w:20,rest:60}}]}));
          const today=planEx(w.id,dkey(new Date())).map(e=>e.name),tomorrow=planEx(w.id,'2026-11-05').map(e=>e.name);
          localStorage.removeItem('gym.swaps');return{a,today,tomorrow,len:w.ex.length}})()""")
        ok(sw['today'][0] == 'Goblet Squat' and sw['a'] not in sw['today'] and len(sw['today']) == sw['len'], 'planEx applies a swap in place for that date')
        ok(sw['tomorrow'][0] == sw['a'], 'planEx: the swap is for that date only')

        # ---- locks ----
        ok(await ev('lockedDay(4)') is None and await ev('lockedDay(2)') is None, 'lockedDay: future days and an untrained today are open')
        await ev("ses.startedAt=Date.now();save()")
        ok(await ev('lockedDay(2)') == 'progress', "lockedDay: today is 'progress' while a workout runs")
        await ev("ses.startedAt=null;hist.push({id:nid(),date:dkey(new Date()),split:'Legs',wid:week[2],start:Date.now()-3600000,total:3600000,tut:0,rest:0,sets:1,volume:0,unit:'kg',ex:[]});save()")
        ok(await ev('lockedDay(2)') == 'done', "lockedDay: today is 'done' once trained")

        # ---- left overs ----
        lo = await ev('leftovers().map(o=>o.label)')
        ok(lo == ['Missed Monday', 'Missed Tuesday'], f'leftovers: missed Mon and Tue, trained today is not left over ({lo})')
        ok(await ev('JSON.stringify(freeSlots())') == '[3,6]', 'freeSlots: rest and open days left this week, not a trained today')
        await ev("planMakeups([leftovers()[0]],dkey(dayDate(3)),true)")
        ok(await ev('JSON.stringify(freeSlots())') == '[6]' and len(await ev('leftovers()')) == 1, 'a planned make-up fills its day and leaves the left over list')
        ok(await ev('dayLoad(3)') == 1 and await ev('dayLoad(4)') == 1, 'dayLoad counts the workout or make-ups on a day')
        await ev("S.set('gym.dropped',[leftovers()[0].key])")
        ok(await ev('leftovers().length') == 0, 'dropping a left over removes it')

        # ---- get set ----
        ok(await ev("equipOf('Barbell Back Squat')") == 'Barbell' and await ev("equipOf('Leg Press')") == 'Machine' and await ev("equipOf('Cable Fly')") == 'Cable', 'equipOf reads equipment from the name')
        ok(await ev("baseSetup('Barbell Bench Press',false)") == 18000 and await ev("baseSetup('Barbell Bench Press',true)") == 12000, 'baseSetup: bench is 18 s, later sets 12 s')
        ok(await ev("setupMs('Cable Fly',1,0)") == 8000, 'setupMs never goes under the 8 s minimum')
        ok(await ev("setupMs('Barbell Bench Press',0,0)") == 18000, 'setupMs: first set of bench uses the base estimate')
        heavy = await ev("""(()=>{hist.push({id:nid(),date:'2026-10-01',split:'x',start:0,total:1,tut:0,rest:0,sets:1,volume:0,unit:'kg',ex:[{name:'Deadlift',sets:[{w:200,r:1}]}]});
          const r=[heavyExtra('Deadlift',190),heavyExtra('Deadlift',160),heavyExtra('Deadlift',100),heavyExtra('Deadlift',0)];hist.pop();return r})()""")
        ok(heavy == [8000, 5000, 0, 0], f'heavyExtra: 95% of your best deadlift adds 8 s, 80% adds 5 s, light adds nothing ({heavy})')
        med = await ev("""(()=>{[20000,30000,12000].forEach(m=>recordSetup('Barbell Bench Press',0,m));const a=setupMs('Barbell Bench Press',0,0);
          [40000,41000,42000,43000].forEach(m=>recordSetup('Barbell Bench Press',0,m));const b=setupMs('Barbell Bench Press',0,0);
          const n=JSON.parse(localStorage.getItem('gym.setupT'))['Barbell Bench Press|0'].length;localStorage.removeItem('gym.setupT');return[a,b,n]})()""")
        ok(med[0] == 21000, f'after 3 timed sets get set is your median + 1 s ({med[0]})')
        ok(med[1] == 42000 and med[2] <= 8, f'only the last 5 count ({med[1]}, stored {med[2]})')
        ok(await ev("recordSetup('Rare Lift',0,500000);const v=setupMs('Rare Lift',0,0)<=90000;localStorage.removeItem('gym.setupT');v"), 'setupMs is capped at 90 s')
        adds = await ev("[addsFor('Barbell Bench Press').map(a=>a[0]),addsFor('Deadlift').map(a=>a[0]),addsFor('Dumbbell Curl').map(a=>a[0])]")
        ok('belt' not in adds[0], 'no belt bubble on bench')
        ok('belt' in adds[1] and 'straps' in adds[1], 'deadlift offers belt and straps')
        ok('plates' not in adds[2] and 'belt' not in adds[2], 'a dumbbell curl offers no plates or belt')


        # ---- ready screen: last time as a point, target once ----
        tr = await ev("""(()=>{const keep=hist;hist=[];const mk=(d,sets)=>hist.push({id:nid(),date:d,split:'x',start:0,total:1,tut:0,rest:0,sets:sets.length,volume:0,unit:'kg',ex:[{name:'Deadlift',sets:sets.map(([w,r])=>({w,r}))}]});
          for(let k=0;k<8;k++)mk('2026-09-'+String(k+1).padStart(2,'0'),[[100+k*2.5,10],[100,9]]);mk('2026-09-20',[[140,3]]);
          const P=trendPts('Deadlift',0),P2=trendPts('Deadlift',1),none=trendHTML('Squat',0,{w:60,r:8});
          const svg=trendHTML('Deadlift',0,{w:140,r:3});hist=keep;return{P,P2,none,dots:(svg.match(/<circle/g)||[]).length}})()""")
        ok(len(tr['P']) == 6 and tr['P'][-1] == {'w': 140, 'r': 3, 'date': '2026-09-20'}, 'trend uses your last 6 real sessions, newest last')
        ok([p['w'] for p in tr['P'][:5]] == [107.5, 110, 112.5, 115, 117.5], 'trend points are the logged set weights')
        ok(tr['P2'][-1]['w'] == 140, 'a session with fewer sets falls back to its last set')
        ok('No sessions' in tr['none'] and tr['none'].count('<circle') == 1, 'no history: just the target ring, no made-up points')
        ok(tr['dots'] == 7, 'six session dots plus the target ring')
        vs = await ev("[vsLast(null,{w:60,r:8}),vsLast({w:117.5,r:12},{w:117.5,r:12}),vsLast({w:117.5,r:12},{w:117.5,r:13}),vsLast({w:117.5,r:12},{w:122.5,r:10}),vsLast({w:100,r:8},{w:97.5,r:8})]")
        ok(vs == ['First time', 'Same as last time', '1 more rep than last time', '+5 kg on last time, 2 fewer reps', '−2.5 kg on last time'], f'target vs last time in words ({vs})')


        # ---- getting into position between sets: mostly the calculation ----
        pos = await ev("""(()=>{['gym.setupT','gym.setupAdj','gym.setupAdd'].forEach(k=>localStorage.removeItem(k));const n='Barbell Back Squat';
          const base=posFit(n).base,r={base,plain:setupMs(n,1,0)};
          [2000,1500,2500,2000,1800].forEach(t=>recordSetup(n,1,t));r.quick=setupMs(n,1,0);
          localStorage.removeItem('gym.setupT');[20000,21000,19000].forEach(t=>recordSetup(n,1,t));r.slow=setupMs(n,1,0);
          recordSetup(n,1,300000);r.outlier=setupMs(n,1,0);
          localStorage.removeItem('gym.setupT');[9000,9500,10000].forEach(t=>recordSetup(n,1,t));r.fast=setupMs(n,1,0);
          localStorage.removeItem('gym.setupT');const A={};A[n]=10000;localStorage.setItem('gym.setupAdj',JSON.stringify(A));r.adj=setupMs(n,1,0);
          ['gym.setupT','gym.setupAdj'].forEach(k=>localStorage.removeItem(k));return r})()""")
        ok(pos['plain'] == round(pos['base']/1000)*1000, f"with no history it's the calculation ({pos['plain']//1000} s)")
        ok(pos['quick'] == pos['plain'], 'quick test taps far under the calculation are ignored as outliers')
        ok(pos['slow'] == round((0.7*pos['base'] + 0.3*20000)/1000)*1000, f"3 real timings count for 30%, the calculation for 70% ({pos['slow']//1000} s)")
        ok(pos['outlier'] == pos['slow'], 'a huge timing (phone left on a bench) is ignored')
        ok(pos['plain'] > pos['fast'] >= 8000, f"repeatedly starting early pulls it down a little ({pos['fast']//1000} s)")
        ok(pos['adj'] == pos['plain'] + 10000, '+10 s taps (5 s each) add to the position time')

        # ---- settings ----
        ok(await ev('cfg.cardio') is True, 'cardio after workouts is on by default')
        await ev("""(()=>{const c=JSON.parse(localStorage.getItem('gym.cfg'));c.cardio=false;delete c.cardioV;localStorage.setItem('gym.cfg',JSON.stringify(c));
          const W=JSON.parse(localStorage.getItem('gym.workouts'));W[0].cardio=false;localStorage.setItem('gym.workouts',JSON.stringify(W))})()""")
        await pg.reload(); await pg.wait_for_timeout(400)
        ok(await ev('cfg.cardio') is True and not await ev("workouts.some(w=>'cardio' in w)"), 'updating turns cardio on once and clears the old per-workout switch')
        await ev("cfg.cardio=false;save()"); await pg.reload(); await pg.wait_for_timeout(400)
        ok(await ev('cfg.cardio') is False, 'after that, off stays off')

        ok(not errs, f'no page errors {errs}')
        await b.close()
    srv.shutdown()
    R.finish()

asyncio.run(main())
