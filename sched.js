/* ===== Schedule tab: the week as tiles on one screen, Plan editor (tap a day), exercise picker (muscles + live list) ===== */
let planMode='sched',schedDay=null;
const GC={Chest:'#3987e5',Back:'#d95926',Shoulders:'#c98500',Arms:'#d55181',Legs:'#199e70',Glutes:'#9085e9',Core:'#e66767',Cardio:'#008300',Other:'#8a8980'};
// your own exercises live next to the built-in library
(function(){const c=S.get('gym.customEx',[]);if(Array.isArray(c))c.forEach(x=>{if(x&&x.name&&!LIBMAP[x.name.toLowerCase()]){const it={name:x.name,group:GROUPS.includes(x.group)?x.group:'Other',equip:'Custom',sets:3,reps:10,w:0,rest:60,pop:false};LIB.push(it);LIBMAP[it.name.toLowerCase()]=it}})})();
const weekMonday=()=>{const t=wd(new Date());const m=new Date();m.setHours(0,0,0,0);m.setDate(m.getDate()-t);return m};
const dayDate=i=>{const d=weekMonday();d.setDate(d.getDate()+i);return d};
// rough time: each set plus its rest, plus a couple of minutes to set up each station
const estMin=w=>{const s=w.ex.reduce((a,e)=>a+e.sets*(60+Math.min(e.rest||60,180))+120,0);return Math.max(10,Math.round(s/60/5)*5)};
const doneOn=i=>{const k=dkey(dayDate(i));const h=hist.filter(x=>x.date===k);if(i===wd(new Date())&&ses&&ses.finished&&ses.date===k&&!h.length)return{total:(ses.endedAt||Date.now())-ses.startedAt};
  return h.length?{total:h.reduce((a,x)=>a+(x.total||0),0)}:null};
const durTxt=ms=>{const m=Math.round(ms/60000);return m>=60?Math.floor(m/60)+'h '+(m%60)+'m':m+' min'};

/* ---- left over: planned workouts this week that were missed, or ended early, become make-ups.
   A make-up can be done today, planned for another day this week, or several combined into one day. ---- */
const MAX_DAY=3; // more workouts than this on one day gets a warning
const dropped=()=>{const d=S.get('gym.dropped',[]);return Array.isArray(d)?d:[]};
const extras=()=>{const x=S.get('gym.extra',{});return x&&typeof x==='object'&&!Array.isArray(x)?x:{}};
const madeKeys=()=>new Set(hist.flatMap(h=>Array.isArray(h.makeup)?h.makeup:h.makeup?[h.makeup]:[]));
// make-ups planned for a date that haven't been done yet
function extraFor(date){const m=madeKeys();return (extras()[date]||[]).filter(o=>o&&!m.has(o.key)&&workouts.some(w=>w.id===o.wid))}
function leftovers(){
  const t=wd(new Date());const mon=dkey(weekMonday()),today=dkey(new Date());const wk=hist.filter(h=>h.date>=mon&&h.date<=today);
  const made=madeKeys();const drop=new Set(dropped());
  const X=extras();const planned=new Set(Object.keys(X).filter(d=>d>=today).flatMap(d=>X[d]||[]).map(o=>o.key));
  const out=[];
  for(let i=0;i<t;i++){const w=isW(week[i])&&workouts.find(x=>x.id===week[i]);if(w&&!doneOn(i))out.push({key:'m:'+dkey(dayDate(i)),wid:w.id,name:w.name,ex:null,label:'Missed '+DAYS[i]})}
  wk.forEach(h=>{if(!Array.isArray(h.skipped)||!h.skipped.length)return;const w=workouts.find(x=>x.id===h.wid||x.name===h.split);if(!w)return;
    const n=h.skipped.length;out.push({key:'p:'+h.id,wid:w.id,name:w.name,ex:h.skipped,label:`${n} exercise${n>1?'s':''} left on ${DAYS[wd(fromKey(h.date))]}`})});
  return out.filter(o=>!made.has(o.key)&&!drop.has(o.key)&&!planned.has(o.key))}
// one session from one or more make-ups, exercises in order, no repeats
function makeupSession(list){const ex=[];const seen=new Set();
  list.forEach(o=>{const b=buildSession(o.wid,true);const want=o.ex?new Map(o.ex.map(x=>[x.name,x.sets])):null;
    b.ex.forEach(e=>{if(want&&!want.has(e.name))return;if(seen.has(e.name))return;seen.add(e.name);ex.push(want?{...e,sets:e.sets.slice(0,Math.max(1,want.get(e.name)))}:e)})});
  const s=buildSession(list[0].wid,true);s.ex=ex;s.split=list.length>1?list.map(o=>o.name).join(' + '):list[0].name;s.makeup=list.map(o=>o.key);return s}
// start make-ups now; today's own workout, if not done, is queued after
function startMakeupList(list){if(!list.length)return false;
  const p=plannedToday();const pDone=hist.some(h=>h.date===dkey(new Date())&&h.wid===p);
  if(ses&&ses.startedAt&&!ses.finished){planMakeups(list,dkey(new Date()),true);ses.then=list[0].wid;ses.thenMakeup='x:'+dkey(new Date());save();render();toast('Up after this one');return true}
  ses=makeupSession(list);if(p&&!list.some(o=>o.wid===p)&&!pDone)ses.then=p;
  focus=null;tab='today';save();render();return true}
function startMakeup(key){const o=leftovers().find(x=>x.key===key)||Object.values(extras()).flat().find(x=>x&&x.key===key);return o?startMakeupList([o]):false}
// how many workouts a day would hold
function dayLoad(i){return (isW(week[i])?1:0)+extraFor(dkey(dayDate(i))).length}
function planMakeups(list,date,quiet){const X=extras();Object.keys(X).forEach(d=>{if(d<dkey(new Date()))delete X[d]});
  X[date]=(X[date]||[]).filter(o=>!list.some(n=>n.key===o.key)).concat(list.map(o=>({key:o.key,wid:o.wid,name:o.name,ex:o.ex})));
  S.set('gym.extra',X);if(date===dkey(new Date())&&ses&&!ses.startedAt&&!ses.finished&&!ses.makeup&&!ses.manual)applyExtras();save();render();
  if(!quiet)toast(list.length>1?'Make-up planned':list[0].name+' planned')}
// planning more than MAX_DAY workouts on one day asks first
function planChecked(list,i){const n=dayLoad(i)+list.length;const go=()=>planMakeups(list,dkey(dayDate(i)));
  if(n<=MAX_DAY)return go();
  takeover(`${n} workouts on ${DAYS[i]}?`,'That much in one session wears you down, and form and recovery suffer. Spreading them out is safer.',[
    {label:'Spread them out',primary:true,fn:()=>leftSheet()},{label:'Plan it anyway',quiet:true,fn:go}])}
// the days left this week, rest and open days first
function freeDays(){const t=wd(new Date());const d=[];for(let i=t;i<7;i++)d.push(i);return d}
function bestDay(){const t=wd(new Date());const f=freeDays().filter(i=>i>t&&!isW(week[i])&&!extraFor(dkey(dayDate(i))).length);return f.length?f[0]:null}
function dayLabel(i){const t=wd(new Date());const n=week[i];const x=extraFor(dkey(dayDate(i))).length;
  const base=isW(n)?(workouts.find(w=>w.id===n)||{}).name:n===REST?'Rest':'Open';return base+(x?` + ${x} make-up${x>1?'s':''}`:'')+(i===t?' · today':'')}
function dayPick(list){const t=wd(new Date());
  const s=sheet(`<h3>Plan ${list.length>1?'make-up':esc(list[0].name)} for</h3>
    ${freeDays().map(i=>`<button class="ssrow" data-dp="${i}"><span><b>${i===t?'Today':DAYS[i]}</b><small>${esc(dayLabel(i))}</small></span>${dayLoad(i)+list.length>MAX_DAY?'<span class="sar" style="font-size:13px;color:#e08a5a">Heavy</span>':''}</button>`).join('')}`);
  s.querySelectorAll('[data-dp]').forEach(b=>b.onclick=()=>{s.remove();planChecked(list,+b.dataset.dp)});return s}
function leftSheet(){const L=leftovers();const bd=bestDay();const combo=L.slice(0,MAX_DAY);
  const comboCard=L.length>1&&bd!==null?`<div class="locombo"><b>Combine into one on ${DAYS[bd]}</b><small>${combo.map(o=>esc(o.name)).join(' + ')}${L.length>MAX_DAY?` · the other ${L.length-MAX_DAY} stay here`:''}</small><div class="row" style="margin-top:10px"><button class="btn" data-lcpick>Other day</button><button class="btn w" data-lcplan>Plan it</button></div></div>`:'';
  const s=sheet(`<h3>Left over</h3><p>Workouts you missed or didn't finish this week.</p>${comboCard}
    ${L.map(o=>`<div class="lorow"><span><b>${esc(o.name)}</b><small>${o.label}</small></span><button class="btn" data-lopick="${o.key}">Plan</button><button class="btn w" data-lodo="${o.key}">Today</button></div><button class="lodrop" data-lodrop="${o.key}">Drop ${esc(o.name)}</button>`).join('')||'<p>Nothing left over.</p>'}`);
  const find=k=>L.find(o=>o.key===k);
  s.querySelectorAll('[data-lodo]').forEach(b=>b.onclick=()=>{s.remove();startMakeupList([find(b.dataset.lodo)])});
  s.querySelectorAll('[data-lopick]').forEach(b=>b.onclick=()=>{s.remove();sheetBack(dayPick([find(b.dataset.lopick)]),leftSheet)});
  const cp=s.querySelector('[data-lcplan]');if(cp)cp.onclick=()=>{s.remove();planChecked(combo,bd)};
  const ck=s.querySelector('[data-lcpick]');if(ck)ck.onclick=()=>{s.remove();sheetBack(dayPick(combo),leftSheet)};
  s.querySelectorAll('[data-lodrop]').forEach(b=>b.onclick=()=>{S.set('gym.dropped',dropped().concat(b.dataset.lodrop).slice(-60));s.remove();render();if(leftovers().length)leftSheet()});
  return s}
// a day with planned make-ups: they become the day's workout, or follow its own
function applyExtras(){const today=dkey(new Date());const L=extraFor(today);if(!L.length||!ses||ses.startedAt||ses.finished||ses.makeup||ses.manual||ses.xDone)return;ses.xDone=true;
  const p=plannedToday();const pDone=hist.some(h=>h.date===today&&h.wid===p);
  if(p&&!pDone){ses.then=L[0].wid;ses.thenMakeup='x:'+today}else ses=makeupSession(L)}
function schedHTML(){
  const t=wd(new Date());const names=weekNames();const F=FOCUS[focusKey()]||FOCUS.fit;
  const m=weekMonday(),e=dayDate(6);
  const range=m.getMonth()===e.getMonth()?`${MON[m.getMonth()]} ${m.getDate()} to ${e.getDate()}`:`${MON[m.getMonth()]} ${m.getDate()} to ${MON[e.getMonth()]} ${e.getDate()}`;
  // the whole week as 8 equal tiles: Mon to Sun, then how the week is going
  let planned=0,done=0,mins=0;
  const tiles=DAYS.map((d,i)=>{const r=names[i]===REST;const n=r?null:names[i];const w=n&&workouts.find(x=>x.name===n);const dn=doneOn(i);const tod=i===t;
    if(n){planned++;if(dn){done++;mins+=dn.total/60000}}else if(dn){mins+=dn.total/60000}
    const xs=i>=t?extraFor(dkey(dayDate(i))):[];
    let meta='';
    if(!n)meta=dn?'✓ '+durTxt(dn.total):xs.length?xs.map(o=>o.name).join(' + '):r?'Recover':'Tap to plan';
    else if(dn)meta='✓ '+durTxt(dn.total);
    else if(i<t)meta='Not logged';
    else if(w)meta=!w.ex.length?'No exercises yet':tod?`~${estMin(w)} min`:`${w.ex.length} exercises · ~${estMin(w)} min`;
    return `<div class="stile${n?'':r?' rest':' open'}${tod?' tod':''}${i<t&&n&&!dn?' past':''}" data-k="${i}" ${n?`data-sopen="${esc(n)}" style="background:${fcol(n)}"`:'data-splan'}>
      <div class="sttop"><span>${d.slice(0,3)} ${dayDate(i).getDate()}</span>${tod?'<b>Today</b>':''}</div>
      <div class="stnm">${n?esc(n):xs.length?'Make-up':r?'Rest':'<span class="stplus">+</span>'}</div>${n&&xs.length?`<div class="stx">+ ${xs.map(o=>esc(o.name)).join(' + ')}</div>`:''}
      <div class="stft"><span class="stmeta">${meta}</span>${n&&tod&&!dn?'<button class="go" data-sgo>Start</button>':''}</div></div>`}).join('');
  const L=leftovers();
  const sum=planned||L.length?`<div class="stile ssum"${L.length?' data-left':''}><div class="sttop"><span>This week</span></div><div class="stnm">${planned?done+' of '+planned:L.length+' left'}</div>${L.length?`<div class="stleft"><b>Left over</b> ${L.map(o=>esc(o.name)).join(', ')}</div>`:''}<div class="stft"><span class="stmeta">${mins?durTxt(mins*60000)+' lifted':'workouts done'}</span></div></div>`
    :`<div class="stile ssum" data-toplanedit><div class="sttop"><span>Your week</span></div><div class="stnm">Plan it</div><div class="stft"><span class="stmeta">Tap any day</span></div></div>`;
  return `<div class="hdr"><div><h1>Schedule</h1><div class="sub">${F.name} · ${range}</div></div><div class="hbtns"><button class="hpill" data-toplanedit>Edit week</button><button class="iconbtn" data-settings aria-label="Settings">${IC.gear}</button></div></div>
  <div class="sgrid">${tiles}${sum}</div>`;
}
function bindSched(A){}
function focusSheet(after){
  const fk=focusKey();
  const s=sheet(`<h3>Focus</h3><p>Sets which workouts you see when planning.</p>${Object.entries(FOCUS).map(([k,f])=>`<button class="ssrow ${fk===k?'big':''}" data-fk="${k}"><span><b>${f.name}</b><small>${f.desc}</small></span>${fk===k?'<span class="sar">✓</span>':''}</button>`).join('')}`);
  s.querySelectorAll('[data-fk]').forEach(b=>b.onclick=()=>{S.set('gym.focus',b.dataset.fk);s.remove();render();after&&after()});
  return s;
}

/* ---- Plan editor: big day rows, tap one to choose ---- */
const planNames=()=>{const fk=focusKey();const inSets=new Set(Object.values(FOCUS).flatMap(f=>f.w));
  return (FOCUS[fk]||FOCUS.fit).w.concat(workouts.map(w=>w.name).filter(n=>!inSets.has(n)&&!(FOCUS[fk]||FOCUS.fit).w.includes(n)))};
function planEditorHTML(){
  const d=draft();const t=wd(new Date());const F=FOCUS[focusKey()]||FOCUS.fit;
  const rows=DAYS.map((dn,i)=>{const r=d[i]===REST;const n=r?null:d[i];return `<button class="dayr${n?'':' rest'}${!n&&!r?' open':''}" data-pday="${i}" ${n?`style="background:${fcol(n)}"`:''}>
    <span class="dl"><b>${dn.slice(0,3).toUpperCase()}</b><span>${dayDate(i).getDate()}</span></span><span class="dwn">${n?esc(n):r?'Rest':'Open'}</span>${i===t?'<span class="dtt">TODAY</span>':''}</button>`}).join('');
  return `<div class="hdr"><button class="back" data-backsched>${IC.back}Schedule</button></div>
  <div class="pad"><h1 class="ptitle">Plan</h1>
    <div class="focusrow">Focus <button class="dd" data-pfocus>${F.name}<span class="car">▼</span></button></div>
    <div class="phint" style="margin:6px 2px 12px">Tap a day to choose its workout.</div>
    <div class="dayrows">${rows}</div></div>
  ${planDirty()?`<div class="savebar"><span>Unsaved changes</span><button class="btn" data-pdis>Discard</button><button class="btn w" data-psave>Save week</button></div>`:''}`;
}
function openWorkoutByName(n){let w=workouts.find(x=>x.name===n);
  if(!w){const ex=(TEMPLATE_EX[n]||[]).map(x=>LIBMAP[x.toLowerCase()]).filter(Boolean).map(x=>E(x.name,x.sets,x.reps,U()==='lb'?Math.round(x.w*2.2/5)*5:x.w,x.rest));w={id:nid(),name:n,ex};workouts.push(w);save()}
  planW=w.id;planOpen=undefined;render();const m=$('#main');if(m)m.scrollTop=0}
function planDayPicker(i){
  const d=draft();const names=planNames();const cur=d[i];
  const s=sheet(`<h3>${DAYS[i]} ${dayDate(i).getDate()}</h3>
    <div class="wchips">${names.map(n=>`<button class="wchip ${cur===n?'on':''}" data-pickw="${esc(n)}" style="background:${fcol(n)}">${esc(n)}</button>`).join('')}
    <button class="wchip rest ${cur===REST?'on':''}" data-pickd="${REST}">Rest</button><button class="wchip rest ${cur?'':'on'}" data-pickd="">Open</button><button class="wchip rest" data-pnew>+ New</button></div>
    ${isW(cur)?`<button class="alink" data-pedit style="margin-top:14px">Edit ${esc(cur)} exercises</button>`:''}`);
  s.querySelectorAll('[data-pickw],[data-pickd]').forEach(b=>b.onclick=()=>{d[i]=b.dataset.pickw||b.dataset.pickd||null;s.remove();render();const r=$(`[data-pday="${i}"]`);r&&r.classList.add('flash')});
  s.querySelector('[data-pnew]').onclick=()=>{s.remove();let k=1,nm='New workout';while(workouts.some(w=>w.name===nm))nm='New workout '+(++k);
    const w={id:nid(),name:nm,ex:[]};workouts.push(w);d[i]=nm;save();planW=w.id;planOpen=undefined;render();const n=$('[data-wname]');if(n){n.focus();n.select()}};
  const ed=s.querySelector('[data-pedit]');if(ed)ed.onclick=()=>{s.remove();openWorkoutByName(cur)};
}
function bindPlanEditor(A){
  A.querySelectorAll('[data-pday]').forEach(b=>b.onclick=()=>planDayPicker(+b.dataset.pday));
  const f=A.querySelector('[data-pfocus]');if(f)f.onclick=()=>focusSheet();
  const sv=A.querySelector('[data-psave]');if(sv)sv.onclick=()=>{savePlan();render();toast('Week saved. Today is up to date.')};
  const ds=A.querySelector('[data-pdis]');if(ds)ds.onclick=()=>{pdraft=null;render()};
  const bk=A.querySelector('[data-backsched]');if(bk)bk.onclick=()=>guardLeave(()=>{planMode='sched';pdraft=null;render()});
}
function toast(t){const o=$('.toast');o&&o.remove();const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),1800)}

/* ---- exercise picker: muscle tiles + search, your list pinned on top ---- */
function exPicker(o){ // o:{title,color,list:()=>[names],add:(libItem)=>void,remove:(name)=>bool,done:()=>void}
  const st={q:'',g:null,eq:'Any gear',open:false,undo:null,fresh:null};let undoT=null;
  const s=document.createElement('div');s.className='scrim xp';$('#app').appendChild(s);
  const EQ=['Any gear','Machine','Cable','Barbell','Dumbbell','Bodyweight'];
  const libOf=n=>LIBMAP[n.toLowerCase()]||{name:n,group:'Other',equip:'Custom',sets:3,reps:10};
  const close=()=>{clearTimeout(undoT);s.remove();o.done()};
  const search=()=>{const t=st.q.trim().toLowerCase();let L=LIB.filter(x=>(!st.g||x.group===st.g)&&(st.eq==='Any gear'||x.equip===st.eq));
    if(t){const ws=t.split(/\s+/);L=L.filter(x=>{const h=(x.name+' '+x.group+' '+x.equip).toLowerCase();return ws.every(w=>h.includes(w))});
      L.sort((a,b)=>(b.name.toLowerCase().startsWith(t)-a.name.toLowerCase().startsWith(t))||(b.pop-a.pop)||a.name.localeCompare(b.name))}
    else L.sort((a,b)=>(b.pop-a.pop)||a.name.localeCompare(b.name));return L};
  const hl=n=>{const q=st.q.trim();if(!q)return esc(n);const i=n.toLowerCase().indexOf(q.toLowerCase());return i<0?esc(n):esc(n.slice(0,i))+'<mark>'+esc(n.slice(i,i+q.length))+'</mark>'+esc(n.slice(i+q.length))};
  const flash=(type,n,i)=>{st.undo={type,n,i};clearTimeout(undoT);undoT=setTimeout(()=>{st.undo=null;const u=s.querySelector('.xundo');u&&u.remove()},2600)};
  function draw(keepFocus){
    const list=o.list();const lst=s.querySelector('.xlst');const y=lst?lst.scrollTop:0;const t=st.q.trim();
    const live=`<div class="xlive"><div class="xlt"><span>YOUR WORKOUT · ${list.length}</span>${list.length?`<button data-xo>${st.open?'Hide':'See all'}</button>`:''}</div>
      ${!list.length?'<div class="xnone">Nothing yet. Pick a muscle or search below.</div>':st.open?`<div class="xfull">${list.map((n,i)=>{const x=libOf(n);return `<div class="xbi${n===st.fresh?' fresh':''}"><span class="xn" style="background:${GC[x.group]||GC.Other}">${i+1}</span><span class="xbn">${esc(n)}</span><small>${x.sets}×${x.reps}</small><button class="xrm" data-xrm="${esc(n)}" aria-label="Remove">×</button></div>`}).join('')}</div>`:
      `<div class="xchips" id="xchips">${list.map((n,i)=>{const x=libOf(n);return `<span class="xc${n===st.fresh?' pop':''}"><span class="xn" style="background:${GC[x.group]||GC.Other}">${i+1}</span>${esc(n)}<button class="xrm" data-xrm="${esc(n)}" aria-label="Remove">×</button></span>`}).join('')}</div>`}</div>`;
    const sbar=`<div class="xsbar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input id="xq" placeholder="${st.g?'Search all exercises':'Search, or pick a muscle'}" value="${esc(st.q)}" autocomplete="off" enterkeyhint="search">${st.q?'<button class="xclr" data-xclr aria-label="Clear">✕</button>':''}</div>`;
    let body;
    if(t||st.g){const L=search();const have=new Set(list.map(n=>n.toLowerCase()));
      body=(st.g&&!t?`<div class="xdrill" style="background:${GC[st.g]}"><button data-xg="" aria-label="Back to muscles">‹</button><b>${st.g}</b><span>${L.length}</span></div>
        <div class="xeq">${EQ.map(e=>`<button data-xeq="${e}" class="${st.eq===e?'on':''}">${e}</button>`).join('')}</div>`:'')+
        `<div class="xlst">${L.map(x=>{const on=have.has(x.name.toLowerCase());return `<button class="xrow${on?' on':''}" data-xt="${esc(x.name)}"><span class="xgd" style="background:${GC[x.group]||GC.Other}"></span><span class="xrt"><b>${hl(x.name)}</b><small>${x.group} · ${x.equip} · ${x.sets}×${x.reps}</small></span><span class="xpl">${on?'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg>':'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>'}</span></button>`}).join('')}
        ${!L.length&&!t?'<div class="empty" style="padding:20px">Nothing here with that gear.</div>':''}
        ${t&&!LIBMAP[t.toLowerCase()]?`<button class="xcustom" data-xcustom><span>＋</span><span><b>Add "${esc(t)}"</b><small>Save it as your own exercise</small></span></button>`:''}</div>`}
    else body=`<div class="xlst"><div class="xtiles">${GROUPS.map(g=>{const n=list.filter(x=>libOf(x).group===g).length;const ex=[...new Set(LIB.filter(x=>x.group===g&&x.pop).map(x=>x.name.replace(/\b(Barbell|Dumbbell|Machine|Cable|Incline|Seated|Standing|Lying)\b\s*/g,'').trim()).filter(Boolean))].slice(0,2).join(', ');
      return `<button class="xtile" data-xg="${g}" style="background:${GC[g]}"><span class="xcnt">${n?n+' added':LIB.filter(x=>x.group===g).length}</span><b>${g}</b><small>${esc(ex)}</small></button>`}).join('')}</div></div>`;
    s.innerHTML=`<div class="xp-in"><div class="xh"><h2 style="color:${o.color||'var(--t1)'}">${esc(o.title)}</h2><button class="xdone" data-xdone>Done</button></div>${live}${sbar}${body}
      ${st.undo?`<div class="xundo">${st.undo.type==='add'?'Added':'Removed'} ${esc(st.undo.n.length>22?st.undo.n.slice(0,21)+'…':st.undo.n)}<button data-xundo>Undo</button></div>`:''}</div>`;
    const nl=s.querySelector('.xlst');if(nl&&keepFocus!=='top')nl.scrollTop=y;
    const q=s.querySelector('#xq');q.oninput=()=>{st.q=q.value;draw('top');const nq=s.querySelector('#xq');nq.focus();nq.setSelectionRange(st.q.length,st.q.length)};
    if(keepFocus===true){q.focus();q.setSelectionRange(st.q.length,st.q.length)}
    const xc=s.querySelector('#xchips');if(xc&&st.fresh)xc.scrollLeft=xc.scrollWidth;
    const on=(sel,fn)=>s.querySelectorAll(sel).forEach(el=>el.onclick=e=>{e.stopPropagation();fn(el)});
    on('[data-xdone]',close);
    on('[data-xo]',()=>{st.open=!st.open;st.fresh=null;draw()});
    on('[data-xclr]',()=>{st.q='';draw(true)});
    on('[data-xg]',b=>{st.g=b.dataset.xg||null;st.eq='Any gear';draw('top')});
    on('[data-xeq]',b=>{st.eq=b.dataset.xeq;draw('top')});
    on('[data-xt]',b=>{const n=b.dataset.xt;const have=o.list().some(x=>x.toLowerCase()===n.toLowerCase());
      if(have){const i=o.list().findIndex(x=>x.toLowerCase()===n.toLowerCase());if(o.remove(n)){st.fresh=null;flash('rm',n,i)}else toast('That one has sets logged. Finish or undo them first.')}
      else{o.add(LIBMAP[n.toLowerCase()]);st.fresh=n;flash('add',n)}draw(document.activeElement===q)});
    on('[data-xrm]',b=>{const n=b.dataset.xrm;const i=o.list().indexOf(n);if(o.remove(n)){st.fresh=null;flash('rm',n,i)}else toast('That one has sets logged. Finish or undo them first.');draw()});
    on('[data-xundo]',()=>{const u=st.undo;if(!u)return;st.undo=null;if(u.type==='add')o.remove(u.n);else o.add(libOf(u.n),u.i);st.fresh=null;draw()});
    on('[data-xcustom]',()=>{const nm=st.q.trim().replace(/\s+/g,' ').replace(/\b\w/g,c=>c.toUpperCase()).slice(0,60);if(!nm)return;
      let it=LIBMAP[nm.toLowerCase()];if(!it){it={name:nm,group:st.g||'Other',equip:'Custom',sets:3,reps:10,w:0,rest:60,pop:false};LIB.push(it);LIBMAP[nm.toLowerCase()]=it;
        const c=S.get('gym.customEx',[]);(Array.isArray(c)?c:[]).push({name:nm,group:it.group});S.set('gym.customEx',c)}
      if(!o.list().some(x=>x.toLowerCase()===nm.toLowerCase())){o.add(it);st.fresh=nm;flash('add',nm)}st.q='';draw()});
  }
  draw();
}
const exFromLib=x=>E(x.name,x.sets,x.reps,U()==='lb'?Math.round((x.w||0)*2.2/5)*5:(x.w||0),x.rest||60);
function pickForWorkout(w){
  exPicker({title:w.name,color:fcol(w.name),list:()=>w.ex.map(e=>e.name),
    add:(x,at)=>{const e=exFromLib(x);if(at!=null)w.ex.splice(at,0,e);else w.ex.push(e);planOpen=e.id;save()},
    remove:n=>{const i=w.ex.findIndex(e=>e.name===n);if(i>=0){w.ex.splice(i,1);save()}return true},
    done:()=>{syncToday();render()}});
}
function pickForToday(){
  exPicker({title:ses.split||'Today',color:fcol(ses.split||''),list:()=>ses.ex.map(e=>e.name),
    add:(x,at)=>{const prev=lastFor(x.name);const w0=U()==='lb'?Math.round((x.w||0)*2.2/5)*5:(x.w||0);
      const e={name:x.name,rest:x.rest||60,prev:prev?prev.sets.map(s=>num(s.w)+' × '+s.r).join(', '):'',sets:Array.from({length:x.sets||3},(_,i)=>{const p=prev&&prev.sets[i];return{w:p?p.w:w0,r:p?p.r:(x.reps||10),done:false,tut:0}})};
      if(at!=null)ses.ex.splice(at,0,e);else ses.ex.push(e);save()},
    remove:n=>{const i=ses.ex.findIndex(e=>e.name===n);if(i<0)return true;if(ses.ex[i].sets.some(s=>s.done))return false;
      if(ses.active===i){closeState();ses.state='idle';ses.active=null}else if(ses.active!==null&&ses.active>i)ses.active--;
      if(ses.lastSet){if(ses.lastSet.e===i)ses.lastSet=null;else if(ses.lastSet.e>i)ses.lastSet.e--}
      ses.ex.splice(i,1);save();return true},
    done:()=>render()});
}
