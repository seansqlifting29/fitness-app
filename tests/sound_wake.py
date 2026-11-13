"""Beeps that survive a sleeping phone, and set targets that skip a short last session.

The audio is a stand-in that behaves like iOS: it can be suspended or stuck "interrupted" until a tap.
Checks: a tap wakes it (or replaces a stuck one), a beep due while asleep plays when it wakes (but stale
ones are dropped, no burst), a silent tone keeps it running during a workout, the screen stays on during a
workout, and each set's target comes from the last session that actually had that set.

    python3 tests/sound_wake.py
"""
import asyncio, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from playwright.async_api import async_playwright
from _common import build, serve, launch_args, Results
build(); BASE, srv = serve(); R = Results(); ok = R.check

FAKE = """
window.FA={made:0,starts:[],stops:0,resumeWorks:true,startState:'running',locks:0,released:0};
class FakeAC{constructor(){FA.made++;this.state=FA.startState;this.currentTime=0;this.destination={}}
  resume(){if(FA.resumeWorks&&this.state!=='closed')this.state='running';return Promise.resolve()}
  close(){this.state='closed';return Promise.resolve()}
  createOscillator(){const o={frequency:{value:0},connect(){},start(){FA.starts.push(o.frequency.value)},stop(){FA.stops++}};return o}
  createGain(){return{gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}}
  createBuffer(){return{}}createBufferSource(){return{connect(){},start(){}}}}
window.AudioContext=FakeAC;window.webkitAudioContext=FakeAC;
Object.defineProperty(navigator,'wakeLock',{value:{request(){FA.locks++;const l={released:false,_h:null,addEventListener(t,h){l._h=h},release(){FA.released++;l.released=true;l._h&&l._h();return Promise.resolve()}};return Promise.resolve(l)}}});
"""


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**launch_args()); errs = []
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, service_workers='block')
        await ctx.add_init_script(FAKE)
        pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(BASE); await pg.wait_for_timeout(400)
        await pg.fill('#nm', 'Sam'); await pg.click('#go'); await pg.wait_for_timeout(300)
        ev = pg.evaluate
        tones = lambda: ev("FA.starts.filter(f=>f!==40)")

        # ---- set targets: a short last session doesn't wipe out set 2 ----
        r = await ev("""(()=>{const n='Barbell Bench Press';hist=[
            {id:nid(),date:'2026-11-02',split:'Push',start:Date.now()-7*864e5,total:3e6,tut:0,rest:0,sets:3,volume:0,unit:'kg',ex:[{name:n,sets:[{w:60,r:8},{w:60,r:5},{w:60,r:4}]}]},
            {id:nid(),date:'2026-11-05',split:'Push',start:Date.now()-4*864e5,total:6e5,tut:0,rest:0,sets:1,volume:0,unit:'kg',ex:[{name:n,sets:[{w:62.5,r:8}]}]}];
          const e=exOf({name:n,sets:3,reps:8,w:50});return e.sets.map(s=>[s.w,s.r])})()""")
        ok(r[0] == [62.5, 8], 'set 1 comes from the latest session')
        ok(r[1] == [60, 5], 'set 2 comes from the last session that had a set 2 (5 reps, not the default 8)')
        ok(r[2] == [60, 4], 'set 3 likewise')
        r2 = await ev("""(()=>{hist=[{id:nid(),date:'2026-11-05',split:'Push',start:Date.now()-4*864e5,total:6e5,tut:0,rest:0,sets:1,volume:0,unit:'kg',ex:[{name:'Pec Deck',sets:[{w:40,r:12}]}]}];
          return exOf({name:'Pec Deck',sets:3,reps:10,w:30}).sets.map(s=>[s.w,s.r])})()""")
        ok(r2 == [[40, 12]] * 3, 'with no earlier set 2 at all, it follows your last set rather than the plan default')
        await ev("hist=[];save()")

        # ---- start a workout: a tap wakes the audio, a silent keep-alive runs ----
        await ev("""(()=>{week[wd(new Date())]=workouts.find(w=>w.name==='Push').id;ses=null;save();ensureSession();cfg.sound=true;
          ses.startedAt=Date.now()-6e5;ses.warmDone=true;focus=0;save();render()})()""")
        await pg.mouse.click(200, 400); await pg.wait_for_timeout(200)
        ok(await ev("FA.starts.includes(40)"), 'during a workout a silent tone keeps the audio running')
        ok(await ev("FA.locks") >= 1, 'during a workout the screen is kept on')

        # countdown beeps while running
        await ev("FA.starts=[];startSet(0)"); await pg.wait_for_timeout(200)
        await ev("ses.stateAt=Date.now()-(ses.setupMs-4200)"); await pg.wait_for_timeout(1300)
        t = await tones(); ok(len(t) >= 1 and all(520 <= f <= 1000 for f in t), f'get set countdown beeps play ({t})')

        # the phone sleeps: audio suspended. A beep due now is held, then plays when a tap wakes it
        await ev("FA.starts=[];ac.state='suspended';FA.resumeWorks=false;tone(700,.1)"); await pg.wait_for_timeout(200)
        ok(await tones() == [], 'while asleep nothing can play')
        await ev("FA.resumeWorks=true"); await pg.mouse.click(200, 400); await pg.wait_for_timeout(300)
        ok(await ev("ac.state") == 'running', 'a tap wakes the audio')

        # held beep plays if the wake comes quickly
        await ev("FA.starts=[];ac.state='suspended';FA.resumeWorks=true;tone(700,.1)"); await pg.wait_for_timeout(200)
        ok(700 in await tones(), 'a beep asked for while asleep plays as soon as it wakes')

        # stuck "interrupted" audio that won't resume: a tap replaces it
        made = await ev("FA.made")
        await ev("FA.starts=[];ac.state='interrupted';FA.resumeWorks=false"); await pg.mouse.click(200, 400); await pg.wait_for_timeout(300)
        await ev("FA.resumeWorks=true"); await pg.mouse.click(200, 400); await pg.wait_for_timeout(300)
        ok(await ev("FA.made") > made and await ev("ac.state") == 'running', 'audio stuck after the phone slept is replaced on the next tap')
        await ev("FA.starts=[];tone(900,.1)"); await pg.wait_for_timeout(100)
        ok(900 in await tones(), 'and beeps play again after that')

        # rest runs into position with the chime, with no tap in between
        await ev("FA.starts=[];closeState();ses.active=0;ses.state='lift';ses.stateAt=Date.now()-20000;save();finishSet(0)"); await pg.wait_for_timeout(200)
        await ev("ses.stateAt-=ses.restTarget-posMs(0)+200"); await pg.wait_for_timeout(800)
        t = await tones(); ok(await ev("ses.state") == 'setup' and t[:3] == [660, 880, 1100], f'with no tap, rest still runs into the position chime ({t[:3]})')

        # stale beeps don't pile up
        await ev("FA.starts=[];ac.state='suspended';FA.resumeWorks=false;tone(610,.1);tone(620,.1)"); await pg.wait_for_timeout(1700)
        await ev("FA.resumeWorks=true"); await pg.mouse.click(200, 400); await pg.wait_for_timeout(300)
        ok(610 not in await tones() and 620 not in await tones(), 'beeps that were due more than a moment ago are dropped, not played in a burst')

        # a notification can mute the audio while it still says "running": taps refresh an old connection
        made = await ev("FA.made")
        await pg.mouse.click(200, 400); await pg.wait_for_timeout(200)
        ok(await ev("FA.made") == made, 'quick taps reuse a fresh audio connection')
        await ev("acBorn=Date.now()-AC_FRESH-1000"); await pg.mouse.click(200, 400); await pg.wait_for_timeout(300)
        ok(await ev("FA.made") > made and await ev("ac.state") == 'running', 'a tap on an older connection swaps in a new one, clearing any silent mute')
        await ev("FA.starts=[];tone(950,.1)"); await pg.wait_for_timeout(100)
        ok(950 in await tones(), 'and beeps play on the new one')

        # iOS reports an interruption mid-rest: the app asks it to resume without waiting for a tap
        await ev("FA.resumeWorks=true;ac.state='interrupted';ac.onstatechange()"); await pg.wait_for_timeout(600)
        ok(await ev("ac.state") == 'running', 'an interruption during a workout is resumed on its own')

        # switching apps: iOS pauses the sound and only a touch brings it back, so the app says so
        await ev("Object.defineProperty(document,'hidden',{get:()=>true,configurable:true});document.dispatchEvent(new Event('visibilitychange'))")
        await ev("Object.defineProperty(document,'hidden',{get:()=>false,configurable:true});document.dispatchEvent(new Event('visibilitychange'))"); await pg.wait_for_timeout(200)
        ok(await ev("!!document.getElementById('sndbar')") and 'Tap for sound' in await ev("document.getElementById('sndbar').textContent"), 'coming back from another app mid-workout shows "Tap for sound"')
        await pg.mouse.click(200, 300); await pg.wait_for_timeout(400)
        ok(await ev("!document.getElementById('sndbar')"), 'one touch anywhere brings the sound back and the pill goes away')
        # a browser that only says the window lost focus (Firefox on iPhone may do this)
        await ev("window.dispatchEvent(new Event('blur'));window.dispatchEvent(new Event('focus'))"); await pg.wait_for_timeout(200)
        ok(await ev("!!document.getElementById('sndbar')"), 'losing and regaining focus also shows "Tap for sound"')
        await pg.mouse.click(200, 300); await pg.wait_for_timeout(400)
        # a browser that never says the page was hidden: the timer's own gap gives it away
        await ev("tick.last=Date.now()-6000;tick()"); await pg.wait_for_timeout(200)
        ok(await ev("!!document.getElementById('sndbar')"), 'a long pause in the timer (as in Firefox, which doesn\'t say the app was hidden) also shows "Tap for sound"')
        await pg.mouse.click(200, 300); await pg.wait_for_timeout(400)
        await ev("ses.state='setup';ses.posFromRest=true;ses.stateAt=Date.now()-2000;acDrop=Date.now();FA.starts=[];save()")
        await pg.mouse.click(200, 300); await pg.wait_for_timeout(700)
        ok(660 in await tones() and 1100 in await tones(), 'the missed get-set chime plays on the touch that brings the sound back')

        # the pill is red, so it stands out
        await ev("acAway=true;sndBar()"); await pg.wait_for_timeout(100)
        ok(await ev("getComputedStyle(document.getElementById('sndbar')).backgroundColor") == 'rgb(229, 72, 77)', '"Tap for sound" is red')
        await pg.mouse.click(200, 300); await pg.wait_for_timeout(300)

        # get into position: the screen edge pulses, softly each second and hard with each of the last five beeps
        await ev("closeState();ses.state='setup';ses.pausedAt=null;ses.stateAt=Date.now();ses.setupMs=9000;ses.cdBeep=null;edgeGlow.s=0;save();tick()"); await pg.wait_for_timeout(100)
        ok(await ev("!!document.getElementById('edgeglow')") and await ev("getComputedStyle(document.getElementById('edgeglow')).pointerEvents") == 'none', 'getting into position lights a pulsing edge that ignores touches')
        ok(await ev("edgeGlow.s") == 9, 'the edge pulses in step with the countdown seconds')
        await ev("ses.stateAt=Date.now()-5500;tick()"); await pg.wait_for_timeout(50)
        ok(await ev("edgeGlow.s") == 4 and await ev("ses.cdBeep") == 4, 'in the last five seconds the hard pulse lands on the same tick as the beep')
        await ev("ses.state='lift';ses.stateAt=Date.now();save();tick()"); await pg.wait_for_timeout(50)
        ok(await ev("!document.getElementById('edgeglow')"), 'the edge goes away once lifting starts')

        # ending warm-ups plays the same chime as getting into position
        await ev("closeState();ses.state='warm';ses.stateAt=Date.now()-60000;ses.active=0;FA.starts=[];save();endWarm()"); await pg.wait_for_timeout(600)
        _t = await tones(); ok(all(f in _t for f in (660, 880, 1100)), 'ending warm-ups plays the get-into-position chime')

        # finishing releases the screen and stops the keep-alive
        stops = await ev("FA.stops"); rel = await ev("FA.released")
        await ev("ses.finished=true;save();keepAlive();screenOn()"); await pg.wait_for_timeout(200)
        ok(await ev("FA.released") > rel and await ev("FA.stops") > stops, 'when the workout ends the screen can sleep again and the keep-alive stops')

        ok(not errs, f'no page errors {errs}')
        await b.close()
    srv.shutdown()
    R.finish()

asyncio.run(main())
