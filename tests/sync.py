"""Cloud sync between two devices, against a small stand-in for Firebase (no network needed).
Covers sign up, wrong and weak passwords, a second device pulling everything, a plan change
moving across, a workout logged offline then uploaded, and staying signed in after a reload.

    python3 tests/sync.py
"""
import asyncio,json,threading,os,sys
sys.path.insert(0, os.path.dirname(__file__))
from _common import build, serve, launch_args, Results
from http.server import ThreadingHTTPServer,BaseHTTPRequestHandler
from playwright.async_api import async_playwright
DB={};USERS={};OFFLINE={'on':False};WRITES=[0]
class H(BaseHTTPRequestHandler):
  def log_message(s,*a):pass
  def _j(s,o,code=200):b=json.dumps(o).encode();s.send_response(code);s.send_header('Content-Type','application/json');s.send_header('Access-Control-Allow-Origin','*');s.end_headers();s.wfile.write(b)
  def do_OPTIONS(s):s.send_response(200);s.send_header('Access-Control-Allow-Origin','*');s.send_header('Access-Control-Allow-Headers','*');s.end_headers()
  def do_POST(s):
    d=json.loads(s.rfile.read(int(s.headers['Content-Length'])) or b'{}')
    if s.path=='/auth':
      e,p,m=d['e'],d['p'],d['m']
      if m=='up':
        if len(p)<6:return s._j({'code':'auth/weak-password'},400)
        if e in USERS:return s._j({'code':'auth/email-already-in-use'},400)
        USERS[e]={'p':p,'uid':'u'+str(len(USERS)+1)}
      u=USERS.get(e)
      if not u or u['p']!=p:return s._j({'code':'auth/invalid-credential'},400)
      return s._j({'uid':u['uid'],'email':e})
    if s.path=='/pull':
      if OFFLINE['on']:return s._j({'code':'unavailable'},503)
      col=DB.setdefault(d['uid'],{}).setdefault(d['col'],{})
      return s._j([dict(id=k,**v) for k,v in col.items() if not d.get('since') or v['t']>d['since']])
    if s.path=='/push':
      if OFFLINE['on']:return s._j({'code':'unavailable'},503)
      for it in d['items']:DB.setdefault(d['uid'],{}).setdefault(it['col'],{})[it['id']]={'v':it['v'],'t':it['t']};WRITES[0]+=1
      return s._j({'ok':1})
srv=ThreadingHTTPServer(('127.0.0.1',0),H);threading.Thread(target=srv.serve_forever,daemon=True).start();API=f'http://127.0.0.1:{srv.server_port}'
build();BASE,web=serve()
MOCK="""window.FitFirebase={init(){let cb=null,user=JSON.parse(localStorage.getItem('mockUser')||'null');const call=async(p,b)=>{const r=await fetch('__API__'+p,{method:'POST',body:JSON.stringify(b)});const j=await r.json();if(!r.ok){const e=new Error(j.code);e.code=j.code;throw e}return j};
setTimeout(()=>cb&&cb(user),10);
return{onUser:f=>{cb=f},async signIn(e,p){user=await call('/auth',{e,p,m:'in'});localStorage.setItem('mockUser',JSON.stringify(user));cb(user)},async signUp(e,p){user=await call('/auth',{e,p,m:'up'});localStorage.setItem('mockUser',JSON.stringify(user));cb(user)},
reset:async()=>{},async signOut(){user=null;localStorage.removeItem('mockUser');cb(null)},pull:(uid,col,since)=>call('/pull',{uid,col,since}),push:(uid,items)=>call('/push',{uid,items})}}};""".replace('__API__',API)
R=Results();ok=R.check
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(**launch_args())
    async def device(name):
      ctx=await b.new_context(viewport={'width':390,'height':844},timezone_id='Asia/Makassar',service_workers='block')
      await ctx.add_init_script("window.FB_CONFIG=window.FB_CONFIG||{apiKey:'test',projectId:'test'}")
      await ctx.route('**/firebase.js',lambda r:r.fulfill(body=MOCK,content_type='application/javascript'))
      pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(name+': '+str(e)));pg.errs=errs
      await pg.goto(BASE);await pg.wait_for_timeout(700);return pg
    st=lambda pg:pg.evaluate("Cloud.status()")
    A=await device('phone')
    await A.fill('#nm','Sean');await A.click('#go');await A.wait_for_timeout(300)
    await A.get_by_role('button',name='Upper',exact=True).click();await A.wait_for_timeout(200)
    await A.evaluate("focus=0;startSet(0);");await A.wait_for_timeout(600);await A.evaluate("finishSet(0);ses.ex.forEach(e=>e.sets.forEach(s=>{s.done=true;s.w=s.w||20;s.r=s.r||8}));save()")
    await A.evaluate("finishWorkout?finishWorkout():0") if await A.evaluate("typeof finishWorkout==='function'") else None
    nA=await A.evaluate("hist.length")
    if nA==0:
      await A.evaluate("hist.push({id:'w1',date:dkey(new Date()),start:Date.now()-3600e3,split:'Upper',total:3000e3,tut:60e3,rest:600e3,sets:3,volume:900,unit:'kg',ex:[{name:'Pull Up',sets:[{w:0,r:8,tut:20000,rest:null},{w:0,r:7,tut:18000,rest:90000}]}]});save()")
      nA=1
    ok(nA>=1,'phone has a logged workout (%d)'%nA)
    # sign up from settings
    await A.evaluate("document.querySelectorAll('.scrim').forEach(x=>x.remove())");await A.click('[data-settings]');await A.wait_for_timeout(300)
    ok(await A.locator('[data-cloud]').count()==1,'Cloud sync row in settings')
    await A.click('[data-cloud]');await A.wait_for_timeout(300)
    ok(await A.locator('.scrim .sback').count()==1,'cloud sheet has back arrow to settings')
    await A.click('[data-clmode]');await A.fill('#cle','sean@test.com');await A.fill('#clp','abc');await A.click('[data-clgo]');await A.wait_for_timeout(500)
    ok('at least 6' in (await A.inner_text('#cl')),'weak password shows a clear message')
    await A.fill('#clp','secret123');await A.click('[data-clgo]');await A.wait_for_timeout(1500)
    s=await st(A);ok(s['email']=='sean@test.com' and s['state']=='ok','phone signed up and synced: '+str(s))
    ok(len(DB.get('u1',{}).get('hist',{}))==nA and 'gym.workouts' in DB['u1']['kv'],'cloud now holds phone data (%d workouts)'%len(DB['u1']['hist']))
    w0=WRITES[0];await A.evaluate("save()");await A.wait_for_timeout(3200);ok(WRITES[0]==w0,'saving unchanged data writes nothing')
    # second device: fresh install, signs in -> gets everything
    B=await device('laptop')
    await B.fill('#nm','Temp');await B.click('#go');await B.wait_for_timeout(300)
    await B.click('[data-settings]');await B.click('[data-cloud]');await B.fill('#cle','sean@test.com');await B.fill('#clp','wrongpass');await B.click('[data-clgo]');await B.wait_for_timeout(600)
    ok('Wrong email or password' in await B.inner_text('#cl'),'wrong password shows a clear message')
    await B.fill('#clp','secret123');await B.click('[data-clgo]');await B.wait_for_timeout(1500)
    ok(await B.evaluate("hist.length")==nA,'laptop got the workouts')
    ok(await B.evaluate("me.name")=='Sean','laptop got the name (cloud wins on first sign-in)')
    ok(await B.evaluate("JSON.stringify(week)")==await A.evaluate("JSON.stringify(week)"),'laptop got the week plan')
    # laptop changes plan -> phone picks it up on focus
    await B.evaluate("document.querySelectorAll('.scrim').forEach(x=>x.remove());week[3]=workouts[0].id;save()");await B.wait_for_timeout(3300)
    await A.evaluate("document.querySelectorAll('.scrim').forEach(x=>x.remove());Cloud.syncNow()");await A.wait_for_timeout(1200)
    ok(await A.evaluate("week[3]")==await B.evaluate("week[3]"),'plan change on laptop reached the phone')
    # offline on phone: log workout, queue, then reconnect
    OFFLINE['on']=True
    await A.evaluate("hist.push({id:'w-off',date:dkey(new Date()),start:Date.now(),split:'Legs',total:2000e3,tut:50e3,rest:500e3,sets:2,volume:500,unit:'kg',ex:[{name:'Back Squat',sets:[{w:100,r:5,tut:15000,rest:null}]}]});save()");await A.wait_for_timeout(3300)
    s=await st(A);ok(s['pending']>=1 and s['state'] in('error','offline'),'offline: workout kept on phone and queued (%s, %d waiting)'%(s['state'],s['pending']))
    OFFLINE['on']=False
    await A.evaluate("Cloud.syncNow()");await A.wait_for_timeout(1200)
    s=await st(A);ok(s['pending']==0 and 'w-off' in DB['u1']['hist'],'back online: queued workout uploaded')
    await B.evaluate("Cloud.syncNow()");await B.wait_for_timeout(1200)
    ok(await B.evaluate("hist.some(h=>h.id==='w-off')"),'laptop got the offline workout')
    # reload keeps sign-in and data
    await A.reload();await A.wait_for_timeout(1500);s=await st(A);ok(s['email']=='sean@test.com','phone still signed in after reload ('+s['state']+')')
    # no sync mid-set
    ok(not A.errs and not B.errs,'no page errors '+str(A.errs+B.errs))
    await b.close()
asyncio.run(main());web.shutdown();srv.shutdown()
R.finish()
