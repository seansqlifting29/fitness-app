"""Sign in and create an account from the welcome screen on a new device, against a small
stand-in for Firebase (no network needed).

    python3 tests/accounts.py
"""
import asyncio,json,threading,os,sys
sys.path.insert(0, os.path.dirname(__file__))
from http.server import ThreadingHTTPServer,BaseHTTPRequestHandler
from playwright.async_api import async_playwright
from _common import build, serve, launch_args, Results
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
      ctx=await b.new_context(viewport={'width':390,'height':844},service_workers='block')
      await ctx.add_init_script("window.FB_CONFIG=window.FB_CONFIG||{apiKey:'test',projectId:'test'}")
      await ctx.route('**/firebase.js',lambda r:r.fulfill(body=MOCK,content_type='application/javascript'))
      pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(name+': '+str(e)));pg.errs=errs
      await pg.goto(BASE);await pg.wait_for_timeout(600);return pg
    # phone: create an account straight from the welcome screen
    A=await device('phone')
    ok(await A.locator('[data-wmode=up]').count()==1 and await A.locator('[data-wmode=in]').count()==1,'welcome offers sign in and create account')
    await A.click('[data-wmode=up]');await A.wait_for_timeout(200)
    await A.click('[data-wback]');await A.wait_for_timeout(200)
    ok(await A.locator('#nm').count()==1,'back returns to the start screen')
    await A.click('[data-wmode=up]');await A.fill('#wn','Sean');await A.fill('#we','sean@test.com');await A.fill('#wp','abc')
    await A.click('.wgo');await A.wait_for_timeout(600)
    ok('at least 6' in await A.inner_text('.welcome'),'short password explained')
    await A.fill('#wp','secret123');await A.click('.wgo');await A.wait_for_timeout(1500)
    ok(await A.evaluate("me&&me.name")=='Sean','account created and the app opens')
    ok(await A.evaluate("Cloud.status().email")=='sean@test.com','phone is signed in')
    await A.evaluate("hist.push({id:'w1',date:dkey(new Date()),start:Date.now()-3600e3,split:'Upper',total:3000e3,tut:60e3,rest:600e3,sets:1,volume:500,unit:'kg',ex:[{name:'Pull Up',sets:[{w:0,r:8,tut:20000,rest:null}]}]});save()")
    await A.wait_for_timeout(3300)
    ok('w1' in DB.get('u1',{}).get('hist',{}) and 'gym.me' in DB['u1']['kv'],'phone data reached the cloud')
    # new device: sign in
    B=await device('new phone')
    await B.click('[data-wmode=in]');await B.fill('#we','sean@test.com');await B.fill('#wp','nope')
    await B.click('.wgo');await B.wait_for_timeout(700)
    ok('Wrong email or password' in await B.inner_text('.welcome'),'wrong password explained')
    await B.click('[data-wforgot]');await B.wait_for_timeout(300)
    ok('Reset link sent' in await B.inner_text('.welcome'),'forgot password sends a reset link')
    await B.fill('#wp','secret123');await B.click('.wgo');await B.wait_for_timeout(1800)
    ok(await B.evaluate("me&&me.name")=='Sean','signing in on a new device brings the name across')
    ok(await B.evaluate("hist.some(h=>h.id==='w1')"),'and the workout history')
    ok(await B.evaluate("JSON.stringify(week)")==await A.evaluate("JSON.stringify(week)"),'and the week plan')
    ok(await B.locator('nav.tabs').count()==1,'the app opens normally')
    # an account with nothing in the cloud yet asks for a name
    USERS['empty@test.com']={'p':'secret123','uid':'u9'}
    C=await device('tablet')
    await C.click('[data-wmode=in]');await C.fill('#we','empty@test.com');await C.fill('#wp','secret123');await C.click('.wgo');await C.wait_for_timeout(1800)
    ok("You're signed in" in await C.inner_text('.welcome'),'empty account: asks your name after signing in')
    await C.fill('#nm','Tab');await C.click('#go');await C.wait_for_timeout(800)
    ok(await C.evaluate("me.name")=='Tab' and await C.locator('nav.tabs').count()==1,'then opens the app')
    # sign in with no connection
    D=await device('offline phone')
    OFFLINE['on']=True
    await D.click('[data-wmode=in]');await D.fill('#we','sean@test.com');await D.fill('#wp','secret123');await D.click('.wgo');await D.wait_for_timeout(1500)
    txt=await D.inner_text('.welcome')
    ok('Try again' in txt or 'went wrong' in txt or 'retry' in txt.lower(),'cloud unreachable after sign in: clear message and Try again')
    OFFLINE['on']=False
    if await D.locator('[data-wretry]').count():
      await D.click('[data-wretry]');await D.wait_for_timeout(1500)
      ok(await D.evaluate("me&&me.name")=='Sean','try again loads the account')
    # no account: still works exactly as before
    E=await device('local')
    await E.fill('#nm','Local');await E.click('#go');await E.wait_for_timeout(400)
    ok(await E.evaluate("me.name")=='Local' and await E.evaluate("Cloud.status().email")==None,'using it without an account still works')
    errs=A.errs+B.errs+C.errs+D.errs+E.errs
    ok(not errs,'no page errors '+str(errs))
    await b.close()
asyncio.run(main());web.shutdown();srv.shutdown()
R.finish()
