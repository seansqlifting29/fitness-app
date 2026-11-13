"""Beep reliability: a thousand simulated workouts against the real app code.

A fake clock drives the app's own timer, and a fake audio context follows iPhone rules:
  - new sound only starts from a real tap (touchend or click). A scroll is not a tap.
  - a notification can pause the sound for a few seconds (iOS "interrupted"), after which it can be resumed
  - a notification can also leave the sound silently muted while it says it's running, until it's replaced
Each workout is random: 4 to 6 lifts, 3 sets, rests from 1 to 6 minutes, early Start set taps, scrolling
during rests (about once every 10 minutes), notifications (about once every 10 minutes). Every "get into position" chime, every 5-4-3-2-1 countdown beep and every go
tone is checked: was it requested, and would it have been heard?

    python3 tests/beep_sim.py            (1000 workouts)
    python3 tests/beep_sim.py 200        (quicker)
"""
import asyncio, json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from playwright.async_api import async_playwright
from _common import build, serve, launch_args

N = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 1000
PAGES = 6

FAKE = r"""
(()=>{
  let now=Date.parse('2026-11-12T01:00:00Z');const RD=Date;
  class FD extends RD{constructor(...a){a.length?super(...a):super(now)}static now(){return now}}
  window.Date=FD;
  const Q=[],IV=[];let id=1;
  window.setTimeout=(f,ms=0,...a)=>{const t={id:id++,at:now+(+ms||0),f,a};Q.push(t);return t.id};
  window.clearTimeout=i=>{const k=Q.findIndex(t=>t.id===i);if(k>=0)Q.splice(k,1)};
  window.setInterval=(f,ms)=>{const t={id:id++,f,ms,next:now+ms};IV.push(t);return t.id};
  window.clearInterval=i=>{const k=IV.findIndex(t=>t.id===i);if(k>=0)IV.splice(k,1)};
  window.requestAnimationFrame=f=>setTimeout(()=>f(now),16);
  const S=window.__sim={gesture:false,log:[],ctxs:0,hooks:[]};
  window.__now=()=>now;let hid=false;Object.defineProperty(document,'hidden',{get:()=>hid,configurable:true});
  window.__away=async ms=>{hid=true;document.dispatchEvent(new Event('visibilitychange'));const c=(typeof ac!=='undefined')?ac:null;if(c&&c.state!=='closed'){c.needTouch=true;c._set('interrupted')}
    now+=ms;for(const t of IV)t.next=now+t.ms;hid=false;document.dispatchEvent(new Event('visibilitychange'));await null;await null};
  window.__adv=async ms=>{const end=now+ms;for(;;){let nx=Infinity;for(const t of Q)nx=Math.min(nx,t.at);for(const t of IV)nx=Math.min(nx,t.next);if(nx>end)break;now=Math.max(now,nx);
      for(const t of Q.filter(t=>t.at<=now)){const k=Q.indexOf(t);if(k>=0)Q.splice(k,1);try{t.f(...t.a)}catch(e){}}
      for(const t of IV)if(t.next<=now){t.next+=t.ms;try{t.f()}catch(e){}}
      for(const h of S.hooks)h();await null;await null}now=end};
  class FAC{constructor(){S.ctxs++;this.state='suspended';this.activated=false;this.blocked=false;this.muted=false;this.currentTime=0;this.destination={};this.onstatechange=null}
    _set(s){if(this.state===s)return;this.state=s;try{this.onstatechange&&this.onstatechange()}catch(e){}}
    resume(){if(this.state==='closed')return Promise.reject(new Error('closed'));if(S.gesture){this.activated=true;this.needTouch=false}if(this.needTouch)return Promise.resolve();
      if(this.state!=='running'&&this.activated&&!this.blocked)this._set('running');return Promise.resolve()}
    suspend(){if(this.state!=='closed')this._set('suspended');return Promise.resolve()}
    close(){this._set('closed');return Promise.resolve()}
    createOscillator(){const c=this;const o={frequency:{value:0},connect(){},stop(){},start(){if(o.frequency.value===40)return;
      S.log.push({t:now,f:Math.round(o.frequency.value),ok:c.state==='running'&&!c.muted&&!c.needTouch,why:c.needTouch?'paused after an app switch':c.state==='closed'?'closed':c.muted?'muted':c.state!=='running'?(c.activated?c.state:'never unlocked'):''})}};return o}
    createGain(){return{gain:{value:1,setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}}
    createBuffer(){return{}}createBufferSource(){return{connect(){},start(){}}}}
  window.AudioContext=FAC;window.webkitAudioContext=FAC;
  try{Object.defineProperty(navigator,'wakeLock',{value:{request:()=>Promise.resolve({release:()=>Promise.resolve(),addEventListener(){}})}})}catch(e){}
})();
"""

SIM = r"""
async (seed)=>{const NOTIFY=__NOTIFY__,APPSW=__APPSW__,PAUSES=__PAUSES__;let switches=0,barSeen=0,pauses=0;
  let s=seed*9301+49297;const R=()=>((s=(s*16807)%2147483647)/2147483647);
  const S=__sim;S.log=[];S.req=[];
  if(!window.__wrapped){window.__wrapped=1;const t0=tone;tone=(f,l)=>{S.req.push({t:__now(),f:Math.round(f),st:ac?(ac.muted?'muted':ac.state==='running'?'':(ac.activated?ac.state:'never unlocked')):'none'});return t0(f,l)}}
  const phases=[];let last=null;const ev=[];
  const G={glowWrong:0,glowChecks:0,pillOutside:0,slowTicks:0,maxTickMs:0,errors:0};
  if(!window.__tw){window.__tw=1;const t0=tick;tick=function(){const a=performance.now();t0();const d=performance.now()-a;__sim.lastTick=d}}
  window.onerror=()=>{G.errors++};
  S.hooks=[()=>{if(!ses)return;
    if(document.hidden)return;
    const since=Date.now()-ses.stateAt,left=ses.state==='setup'?(ses.setupMs||10000)-since:1e9;
    const want=ses.state==='setup'&&!ses.pausedAt&&left>0;const has=!!document.getElementById('edgeglow');
    if(since>300&&Math.abs(left)>300){G.glowChecks++;if(want!==has){G.glowWrong++;if(!G.ex)G.ex={state:ses.state,since,left,has,paused:!!ses.pausedAt}}}
    if(document.getElementById('sndbar')&&!(ses.startedAt&&!ses.finished))G.pillOutside++;
    const d=S.lastTick||0;if(d>G.maxTickMs)G.maxTickMs=d;if(d>50)G.slowTicks++;if(ses.state==='setup'&&last!=='setup')phases.push({t:__now(),rest:!!ses.posFromRest,ms:ses.setupMs||10000,ev:ev.slice(-3)});if(last==='setup'&&ses.state!=='setup'&&phases.length)phases[phases.length-1].end=__now();last=ses.state}];
  const fire=(t,act)=>{S.gesture=act;try{document.dispatchEvent(new Event(t))}finally{S.gesture=false}};
  const tap=()=>{fire('pointerdown',false);fire('touchend',true);fire('click',true);ev.push('tap')};
  const scroll=()=>{fire('pointerdown',false);fire('touchend',false);ev.push('scroll')};
  const notify=()=>{if(!ac||ac.state==='closed')return;const c=ac;if(R()<.75){c.blocked=true;c._set('interrupted');ev.push('notification');setTimeout(()=>{c.blocked=false;if(c.state==='interrupted')c._set('suspended')},1500+R()*2500)}else{c.muted=true;ev.push('silent mute')}};
  const wait=async ms=>{const end=__now()+ms;while(__now()<end){const st=Math.min(1000,end-__now());
      if(R()<1/600)scroll();if(R()<NOTIFY)notify();
      if(PAUSES&&R()<1/900&&ses&&ses.startedAt&&!ses.finished&&!ses.pausedAt){tap();pauseWorkout();pauses++;ev.push('pause');await __adv(5000+R()*120000);
        if(R()<.3){const away=10000+R()*60000;ev.push('app switch');await __away(away);switches++}
        tap();resumeWorkout();ev.push('resume')}
      await __adv(st)}};
  const until=async (f,max)=>{const end=__now()+max;while(!f()&&__now()<end)await wait(250)};
  // a fresh Push day
  try{if(ac)ac.close()}catch(e){}ac=null;acKeep=null;
  week[wd(new Date())]=workouts.find(w=>w.name==='Push').id;ses=null;save();ensureSession();cfg.sound=true;cfg.warmup=false;cfg.warmEach=false;
  ses.ex=ses.ex.slice(0,4+Math.floor(R()*3));ses.startedAt=Date.now();ses.warmDone=true;focus=null;tab='today';save();render();
  tap();
  for(let i=0;i<ses.ex.length;i++){const e=ses.ex[i];const n=e.sets.length;
    for(let j=0;j<n;j++){
      if(j===0){await wait(5000+R()*40000);tap();startSet(i)}
      await until(()=>ses.state==='lift',15*60000);
      await wait(15000+R()*45000);tap();finishSet(i);
      if(j<n-1){
        const r=R();
        if(r<.25){await until(()=>ses.state!=='rest',R()*ses.restTarget*.8);if(ses.state==='rest'){tap();startSet(i)}}   // starts early
        else if(r<.45)await wait(60000+R()*300000);                                                                      // long rest: phone left alone
        else if(r<.65&&APPSW){await wait(R()*30000);const away=10000+R()*80000;ev.push('app switch');await __away(away);switches++;
          await __adv(250);barSeen+=document.getElementById('sndbar')?1:0;
          if(R()<.8){await wait(500+R()*4000);tap()}}                                                                   // switches apps, comes back
      }
    }}
  await wait(3000);
  // grade every get-set phase
  const out=[];
  for(const p of phases){const E=(p.end||p.t+p.ms)+1500;const L=S.log.filter(x=>x.t>=p.t-50&&x.t<=E);const want=(p.rest?[660,880,1100]:[]).concat([520,630,740,850,960,1180]);
    const Q=S.req.filter(x=>x.t>=p.t-50&&x.t<=E);
    const miss=want.filter(f=>!L.some(x=>x.f===f&&x.ok));const notReq=want.filter(f=>!Q.some(x=>x.f===f));
    const why=new Set();miss.forEach(f=>{if(notReq.includes(f))why.add('app never asked for it');else{const q=Q.find(x=>x.f===f);const l=L.find(x=>x.f===f);why.add(l?(l.why||'?'):'dropped, sound was '+(q&&q.st||'?'))}});
    const sw=p.ev.includes('app switch');const cue=!p.rest||[660,880,1100].some(f=>L.some(x=>x.f===f&&x.ok));const go=L.some(x=>x.f===1180&&x.ok);
    out.push({rest:p.rest,miss:miss.length,notReq:notReq.length,why:[...why],ev:p.ev,sw,cue,go})}
  return {phases:out,ctxs:S.ctxs,switches,barSeen,G,pauses}
}
"""


async def run_range(b, base, seeds, res):
    ctx = await b.new_context(viewport={'width': 390, 'height': 844}, service_workers='block')
    await ctx.add_init_script(FAKE)
    pg = await ctx.new_page()
    await pg.goto(base); await pg.wait_for_timeout(300)
    await pg.fill('#nm', 'Sim'); await pg.click('#go')
    for sd in seeds:
        r = await pg.evaluate(SIM.replace('__NOTIFY__', os.environ.get('SIM_NOTIFY', '1/600')).replace('__APPSW__', os.environ.get('SIM_APPSWITCH', '0')).replace('__PAUSES__', os.environ.get('SIM_PAUSES', '0')), sd)
        res.append(r)
    await ctx.close()


async def main():
    build(); base, srv = serve()
    res = []
    async with async_playwright() as p:
        b = await p.chromium.launch(**launch_args())
        chunks = [list(range(k, N, PAGES)) for k in range(PAGES)]
        await asyncio.gather(*[run_range(b, base, c, res) for c in chunks])
        await b.close()
    srv.shutdown()
    ph = [x for r in res for x in r['phases']]
    bad = [x for x in ph if x['miss']]
    from collections import Counter
    why = Counter(w for x in bad for w in x['why'])
    trig = Counter((x['ev'][-1] if x['ev'] else 'none') for x in bad)
    summary = {'workouts': len(res), 'get_set_phases': len(ph), 'phases_with_a_missed_sound': len(bad),
               'missed_rate_%': round(100 * len(bad) / max(1, len(ph)), 2),
               'sounds_never_requested': sum(x['notReq'] for x in ph),
               'cause_of_misses': dict(why), 'last_thing_before_miss': dict(trig)}
    swp = [x for x in ph if x.get('sw')]
    if swp:
        summary['after_app_switch'] = {'phases': len(swp), 'switches': sum(r['switches'] for r in res), 'tap_for_sound_bar_shown': sum(r['barSeen'] for r in res),
            'get_set_cue_heard_%': round(100 * sum(x['cue'] for x in swp) / len(swp), 1), 'go_tone_heard_%': round(100 * sum(x['go'] for x in swp) / len(swp), 1)}
        for lab, sel in (('touched_screen_after_coming_back', True), ('never_touched_screen', False)):
            g = [x for x in swp if (x['ev'].index('app switch') < len(x['ev']) - 1 and 'tap' in x['ev'][x['ev'].index('app switch') + 1:]) == sel]
            if g: summary['after_app_switch'][lab] = {'phases': len(g), 'all_sounds_heard_%': round(100 * sum(1 for x in g if not x['miss']) / len(g), 1)}
    gl = {k: sum(r['G'][k] for r in res) for k in ('glowWrong', 'glowChecks', 'pillOutside', 'slowTicks', 'errors')}
    gl['maxTickMs'] = round(max(r['G']['maxTickMs'] for r in res), 1)
    ex = [r['G'].get('ex') for r in res if r['G'].get('ex')]
    if ex: gl['example'] = ex[0]
    gl['pauses'] = sum(r['pauses'] for r in res)
    summary['glitches'] = gl
    nr = [x for x in ph if x['notReq']]
    summary['never_asked_breakdown'] = {'with_pause_in_phase': sum(1 for x in nr if 'pause' in x['ev'] or 'resume' in x['ev']), 'total': len(nr), 'examples': [x['ev'] for x in nr[:4]]}
    print(json.dumps(summary, indent=1))
    out = os.environ.get('SIM_OUT')
    if out: json.dump(summary, open(out, 'w'), indent=1)
    sys.exit(1 if bad else 0)

asyncio.run(main())
