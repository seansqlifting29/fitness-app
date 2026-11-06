/* ===== cloud sync (Firebase), offline first =====
   This phone keeps the working copy in localStorage, so the app never waits on signal.
   Changes are queued and pushed when there's a connection; changes from other devices
   are pulled when the app opens or comes back into view.
   Plan, settings etc: newest write wins per item. Workouts: merged, one record each. */
const SYNC_KEYS=['gym.me','gym.workouts','gym.week','gym.cfg','gym.focus','gym.charts2','gym.anEx','gym.customEx'];
const Cloud=(function(){
  const CFG=window.FB_CONFIG||null;const ON=!!CFG&&/^https?:$/.test(location.protocol)&&window.top===window;
  let api=null,user=null,state='off',err='',busy=false,again=false,kickT=null,listeners=[];
  const rd=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
  const wr=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  const meta=Object.assign({t:{},h:{},ht:{},hh:{}},rd('gym.syncMeta',{}));
  const dirty=new Set(rd('gym.syncDirty',[]));
  const saveMeta=()=>{wr('gym.syncMeta',meta);wr('gym.syncDirty',[...dirty])};
  const hash=s=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return (h>>>0).toString(36)+'.'+s.length};
  const hid=e=>String(e.id||('d'+(e.start||(e.date+'_'+e.split)))).replace(/[\/.]/g,'_');
  const linked=()=>!!user&&rd('gym.syncUid',null)===user.uid;
  const ui=()=>listeners.forEach(f=>{try{f()}catch(e){}});

  // note what changed locally (called from S.set, and once at start for anything written another way)
  function note(k,raw){const now=Date.now();
    if(SYNC_KEYS.includes(k)){if(raw==null)return;const x=hash(raw);if(meta.h[k]===x)return false;meta.h[k]=x;meta.t[k]=now;dirty.add('kv:'+k);return true}
    if(k==='gym.hist'){let arr;try{arr=JSON.parse(raw)}catch(e){return false}if(!Array.isArray(arr))return false;let ch=false;
      arr.forEach(e=>{if(!e)return;const id=hid(e),x=hash(JSON.stringify(e));if(meta.hh[id]!==x){meta.hh[id]=x;meta.ht[id]=now;dirty.add('h:'+id);ch=true}});return ch}
    return false}
  window.__onSet=(k,v)=>{if(k!=='gym.hist'&&!SYNC_KEYS.includes(k))return;if(note(k,JSON.stringify(v))){saveMeta();kick()}};
  function scan(){let ch=false;SYNC_KEYS.forEach(k=>{if(note(k,localStorage.getItem(k)))ch=true});if(note('gym.hist',localStorage.getItem('gym.hist')))ch=true;if(ch)saveMeta()}

  function kick(ms=2500){if(!user)return;clearTimeout(kickT);kickT=setTimeout(()=>sync(),ms)}

  // put what came from the cloud into the running app
  function applyKV(k,raw){try{localStorage.setItem(k,raw)}catch(e){}meta.h[k]=hash(raw);dirty.delete('kv:'+k);
    let v;try{v=JSON.parse(raw)}catch(e){return}
    if(k==='gym.me'&&v&&v.name)me=v;else if(k==='gym.workouts'&&Array.isArray(v))workouts=v;else if(k==='gym.week'&&Array.isArray(v)&&v.length===7)week=v;
    else if(k==='gym.cfg'&&v&&typeof v==='object')Object.assign(cfg,v)}

  async function sync(){
    if(!api||!user)return;if(busy){again=true;return}
    if(typeof ses!=='undefined'&&ses&&ses.state==='lift'){kick(20000);return}// never mid-set
    if(!navigator.onLine){state='offline';ui();return}
    busy=true;state='syncing';ui();
    try{
      const first=!linked();const uid=user.uid;const since=first?0:Math.max(0,rd('gym.syncSince',0)-300000);
      const kv=await api.pull(uid,'kv',since),hs=await api.pull(uid,'hist',since);
      let maxT=rd('gym.syncSince',0),changed=false;
      if(first&&!kv.length&&!hs.length){// empty cloud: this phone seeds it
        SYNC_KEYS.forEach(k=>{if(localStorage.getItem(k)!=null){dirty.add('kv:'+k);meta.t[k]=meta.t[k]||Date.now()}});
        hist.forEach(e=>{const id=hid(e);dirty.add('h:'+id);meta.ht[id]=meta.ht[id]||Date.now()})}
      kv.forEach(d=>{maxT=Math.max(maxT,d.t||0);if(typeof d.v!=='string')return;const lt=meta.t[d.id]||0;
        if(first||d.t>=lt){if(localStorage.getItem(d.id)!==d.v){applyKV(d.id,d.v);changed=true}meta.t[d.id]=d.t;dirty.delete('kv:'+d.id)}});
      if(hs.length){const byId=new Map(hist.map(e=>[hid(e),e]));
        hs.forEach(d=>{maxT=Math.max(maxT,d.t||0);let e;try{e=JSON.parse(d.v)}catch(x){return}if(!e||!Array.isArray(e.ex))return;
          const lt=meta.ht[d.id]||0;if(!byId.has(d.id)||d.t>=lt){byId.set(d.id,e);meta.hh[d.id]=hash(JSON.stringify(e));meta.ht[d.id]=d.t;dirty.delete('h:'+d.id);changed=true}});
        if(changed){hist=[...byId.values()].sort((a,b)=>(a.start||0)-(b.start||0));try{localStorage.setItem('gym.hist',JSON.stringify(hist))}catch(x){}}}
      if(first){// anything on this phone that the cloud didn't have goes up
        hist.forEach(e=>{const id=hid(e);if(!hs.some(d=>d.id===id)){dirty.add('h:'+id);meta.ht[id]=meta.ht[id]||Date.now()}})}
      wr('gym.syncUid',uid);wr('gym.syncSince',maxT);saveMeta();
      if(changed){try{window.anReset&&anReset()}catch(x){}if(!document.querySelector('#app > .scrim'))render()}
      // push the queue
      const items=[];const hmap=new Map(hist.map(e=>[hid(e),e]));
      [...dirty].forEach(x=>{if(x.startsWith('kv:')){const k=x.slice(3),v=localStorage.getItem(k);if(v!=null)items.push({key:x,col:'kv',id:k,v,t:meta.t[k]||Date.now()});else dirty.delete(x)}
        else{const id=x.slice(2),e=hmap.get(id);if(e)items.push({key:x,col:'hist',id,v:JSON.stringify(e),t:meta.ht[id]||Date.now()});else dirty.delete(x)}});
      if(items.length){await api.push(uid,items.map(({col,id,v,t})=>({col,id,v,t})));items.forEach(i=>dirty.delete(i.key))}
      saveMeta();wr('gym.syncAt',Date.now());state='ok';err=''}
    catch(e){console.warn('sync',e);state=navigator.onLine?'error':'offline';err=friendly(e)}
    busy=false;ui();if(again){again=false;kick(500)}}

  function friendly(e){const c=(e&&e.code)||'';const m={'auth/invalid-credential':'Wrong email or password.','auth/wrong-password':'Wrong email or password.','auth/user-not-found':'No account with that email.',
    'auth/email-already-in-use':'That email already has an account. Sign in instead.','auth/weak-password':'Use at least 6 characters.','auth/invalid-email':'That email doesn\'t look right.',
    'auth/network-request-failed':'No connection. Try again with signal.','auth/too-many-requests':'Too many tries. Wait a minute.','permission-denied':'The cloud refused this. Check the Firestore rules.',
    'auth/operation-not-allowed':'Email sign-in isn\'t turned on in Firebase yet.','auth/unauthorized-domain':'This site isn\'t on the Firebase authorized domains list.'};
    return m[c]||(e&&e.message==='timeout'?'The connection timed out. It will retry.':'Something went wrong. It will retry.')}

  let loading=null;
  function load(){if(!ON)return Promise.reject(new Error('off'));if(api)return Promise.resolve(api);
    return loading||(loading=new Promise((res,rej)=>{const s=document.createElement('script');s.src='firebase.js';s.onload=()=>{try{api=window.FitFirebase.init(CFG);
      api.onUser(u=>{const was=user&&user.uid;user=u;if(!u){state='off';ui();return}if(u.uid!==was){state='syncing';ui();sync()}});res(api)}catch(e){rej(e)}};s.onerror=()=>{loading=null;rej(new Error('load'))};document.head.appendChild(s)}))}

  function start(){scan();
    // ask the browser to keep this app's data even when the phone is low on space
    try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persisted().then(p=>p||navigator.storage.persist()).catch(()=>{})}catch(e){}
    if(!ON)return;
    // only load the SDK if this phone has signed in before; otherwise wait until someone opens Cloud sync
    if(rd('gym.syncUid',null))load().catch(()=>{state='offline';ui()});
    addEventListener('online',()=>kick(500));
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)kick(800)})}
  setTimeout(start,0);

  return{
    available:ON,
    status:()=>({state,err,email:user&&user.email,at:rd('gym.syncAt',0),pending:dirty.size}),
    onChange:f=>{listeners.push(f);return()=>{listeners=listeners.filter(x=>x!==f)}},
    async signIn(e,p){await load();await api.signIn(e,p)},
    async signUp(e,p){await load();await api.signUp(e,p)},
    async reset(e){await load();await api.reset(e)},
    async signOut(){if(api)await api.signOut();['gym.syncUid','gym.syncSince','gym.syncAt','gym.syncDirty'].forEach(k=>{try{localStorage.removeItem(k)}catch(x){}});dirty.clear();user=null;state='off';ui()},
    syncNow:()=>sync(),
    friendly,load,
  };
})();

/* ---- the Cloud sync sheet (from General settings) ---- */
function cloudSheet(){
  const ago=t=>{if(!t)return'never';const m=Math.round((Date.now()-t)/60000);return m<1?'just now':m<60?m+' min ago':Math.round(m/60)+' h ago'};
  const s=sheet('<div id="cl"></div>');const box=s.querySelector('#cl');let mode='in',msg='',working=false;
  function draw(){const st=Cloud.status();
    if(st.email){draw.p='';const line={ok:'Synced '+ago(st.at),syncing:'Syncing…',offline:'Offline. Saved on this phone, syncs when you have signal.',error:st.err||'Couldn\'t sync. It will retry.'}[st.state]||'';
      box.innerHTML=`<h3>Cloud sync</h3><p>Your plan and workouts follow you to any device you sign in on.</p>
        <div class="cl-card"><span class="cl-dot ${st.state}"></span><div><b>${esc(st.email)}</b><small>${esc(line)}${st.pending&&st.state!=='syncing'?' · '+st.pending+' waiting':''}</small></div></div>
        <div class="row"><button class="btn" data-clout>Sign out</button><button class="btn w" data-clnow ${st.state==='syncing'?'disabled':''}>Sync now</button></div>`;
      box.querySelector('[data-clnow]').onclick=()=>Cloud.syncNow();
      box.querySelector('[data-clout]').onclick=()=>confirmBox('Sign out?','Your data stays on this phone and in the cloud.','Sign out',()=>Cloud.signOut());return}
    box.innerHTML=`<h3>Cloud sync</h3><p>${mode==='up'?'Make an account to keep your plan and workouts safe and use them on any device.':'Sign in to sync your plan and workouts across devices.'}</p>
      <input class="field" id="cle" type="email" placeholder="Email" autocomplete="email" inputmode="email">
      <input class="field" id="clp" type="password" placeholder="Password${mode==='up'?' (6+ characters)':''}" autocomplete="${mode==='up'?'new-password':'current-password'}" style="margin-top:8px">
      ${msg?`<div class="cl-msg">${esc(msg)}</div>`:''}
      <button class="btn w" data-clgo style="width:100%;margin-top:12px" ${working?'disabled':''}>${working?'One sec…':mode==='up'?'Create account':'Sign in'}</button>
      <div class="cl-alt"><button data-clmode>${mode==='up'?'Have an account? Sign in':'New here? Create an account'}</button>${mode==='in'?'<button data-clreset>Forgot password</button>':''}</div>`;
    const e=box.querySelector('#cle'),p=box.querySelector('#clp');e.value=draw.e||'';p.value=draw.p||'';
    e.oninput=()=>draw.e=e.value;p.oninput=()=>draw.p=p.value;
    box.querySelector('[data-clmode]').onclick=()=>{mode=mode==='up'?'in':'up';msg='';draw()};
    const rs=box.querySelector('[data-clreset]');if(rs)rs.onclick=async()=>{if(!e.value.trim()){msg='Type your email first.';return draw()}try{await Cloud.reset(e.value.trim());msg='Reset link sent. Check your email.'}catch(x){msg=Cloud.friendly(x)}draw()};
    const go=async()=>{const em=e.value.trim(),pw=p.value;if(!em||!pw){msg='Enter your email and password.';return draw()}working=true;msg='';draw();
      try{await (mode==='up'?Cloud.signUp(em,pw):Cloud.signIn(em,pw))}catch(x){msg=Cloud.friendly(x)}working=false;draw()};
    box.querySelector('[data-clgo]').onclick=go;p.onkeydown=ev=>{if(ev.key==='Enter')go()}}
  const off=Cloud.onChange(()=>{if(!s.isConnected)return off();if(!box.querySelector('#cle:focus,#clp:focus'))draw()});
  draw();return s}
