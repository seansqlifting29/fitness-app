/* ===== Schedule tab: swipe the week, Plan editor (tap a day), exercise picker (muscles + live list) ===== */
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

function schedHTML(){
  const t=wd(new Date());const names=weekNames();const F=FOCUS[focusKey()]||FOCUS.fit;
  const m=weekMonday(),e=dayDate(6);
  const range=m.getMonth()===e.getMonth()?`${MON[m.getMonth()]} ${m.getDate()} to ${e.getDate()}`:`${MON[m.getMonth()]} ${m.getDate()} to ${MON[e.getMonth()]} ${e.getDate()}`;
  if(schedDay===null)schedDay=t;
  const empty=names.every(n=>!n);
  const strip=DAYS.map((d,i)=>{const n=names[i];return `<button data-j="${i}" class="${i===schedDay?'on':''} ${i===t?'tod':''}"><i>${d[0]}</i>${dayDate(i).getDate()}<u style="${n?'background:'+fcol(n):''}"></u></button>`}).join('');
  const cards=DAYS.map((d,i)=>{const n=names[i];const w=n&&workouts.find(x=>x.name===n);const done=n&&doneOn(i);
    const tag=i===t?'TODAY':i===t+1?'TOMORROW':i===t-1?'YESTERDAY':'';
    const list=w?w.ex.slice(0,6).map(x=>`<li>${esc(x.name)}</li>`).join('')+(w.ex.length>6?`<li>+${w.ex.length-6} more</li>`:''):'';
    let foot='';
    if(n&&done)foot=`<span class="meta">✓ Done · ${durTxt(done.total)}</span>`;
    else if(n&&i===t)foot=`<span class="meta">${w?w.ex.length+' exercises · ~'+estMin(w)+' min':''}</span><button class="go" data-sgo>Start</button>`;
    else if(n&&i<t)foot=`<span class="meta">Not logged</span>`;
    else if(n&&w)foot=`<span class="meta">${w.ex.length} exercises · ~${estMin(w)} min</span>`;
    return `<div class="scard${n?'':' rest'}${i<t&&!done?' past':''}" data-k="${i}" ${n?`style="background:${fcol(n)}" data-sopen="${esc(n)}"`:'data-splan'}>
      <div class="sctop">${tag?`<span class="stag">${tag}</span>`:'<span></span>'}<span class="sd">${DAYS[i].slice(0,3).toUpperCase()} ${dayDate(i).getDate()}</span></div>
      <div class="snm">${esc(n||'Rest')}</div><ul>${n?list||'<li>No exercises yet</li>':'<li>Recover, walk, stretch</li>'}</ul><div class="sfoot">${foot}</div></div>`}).join('');
  return `<div class="hdr"><div><h1>Schedule</h1><div class="sub">${F.name} · ${range}</div></div><button class="iconbtn" data-schedset aria-label="Schedule settings">${IC.gear}</button></div>
  ${empty?`<button class="sempty" data-toplanedit><b>Your week is empty</b><span>Tap to plan it</span></button>`:''}
  <div class="strip">${strip}</div><div class="scar" id="car">${cards}</div>`;
}
function bindSched(A){
  const car=A.querySelector('#car');if(!car)return;
  const cards=[...car.querySelectorAll('.scard')];const days=[...A.querySelectorAll('[data-j]')];
  // where the scroller has to be for card i to sit in the middle
  const target=i=>{const c=cards[i];if(!c)return car.scrollLeft;const cr=car.getBoundingClientRect(),r=c.getBoundingClientRect();return car.scrollLeft+(r.left-cr.left)-(car.clientWidth-r.width)/2};
  const nearest=()=>{const cr=car.getBoundingClientRect();const mid=cr.left+cr.width/2;let best=0,bd=1e9;cards.forEach((c,i)=>{const r=c.getBoundingClientRect();const d=Math.abs(r.left+r.width/2-mid);if(d<bd){bd=d;best=i}});return best};
  const mark=i=>{if(mark.cur===i)return;mark.cur=i;days.forEach((b,k)=>b.classList.toggle('on',k===i))};
  let aim=null,aimT=null;
  const go=(i,smooth)=>{schedDay=i;mark(i);aim=i;clearTimeout(aimT);aimT=setTimeout(()=>{aim=null},smooth?900:50);
    car.scrollTo({left:target(i),behavior:smooth?'smooth':'auto'})};
  mark.cur=null;go(schedDay,false);
  days.forEach((b,k)=>b.onclick=()=>go(k,true));
  // follow the swipe live, one update per frame
  let raf=0;car.addEventListener('scroll',()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const n=nearest();
    if(aim!==null){if(n===aim){clearTimeout(aimT);aimT=setTimeout(()=>{aim=null},120)}return}
    schedDay=n;mark(n)})},{passive:true});
  car.addEventListener('scrollend',()=>{aim=null;const n=nearest();schedDay=n;mark(n)});
}
function schedSettings(){
  const F=FOCUS[focusKey()]||FOCUS.fit;
  const s=sheet(`<h3>Schedule settings</h3>
    <button class="ssrow big" data-ss="plan"><span class="sic">▦</span><span><b>Plan</b><small>Choose a workout for each day</small></span><span class="sar">›</span></button>
    <button class="ssrow" data-ss="focus"><span class="sic">◎</span><span><b>Focus</b><small>${F.name}</small></span><span class="sar">›</span></button>
    <button class="ssrow" data-ss="app"><span class="sic">⚙</span><span><b>App settings</b><small>Units, rest timer, backup</small></span><span class="sar">›</span></button>`);
  s.querySelector('[data-ss="plan"]').onclick=()=>{s.remove();planMode='edit';planW=null;render();$('#main').scrollTop=0};
  s.querySelector('[data-ss="focus"]').onclick=()=>{s.remove();sheetBack(focusSheet(),schedSettings)};
  s.querySelector('[data-ss="app"]').onclick=()=>{s.remove();sheetBack(settingsSheet(),schedSettings)};
}
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
  const rows=DAYS.map((dn,i)=>{const n=d[i];return `<button class="dayr${n?'':' rest'}" data-pday="${i}" ${n?`style="background:${fcol(n)}"`:''}>
    <span class="dl"><b>${dn.slice(0,3).toUpperCase()}</b><span>${dayDate(i).getDate()}</span></span><span class="dwn">${esc(n||'Rest')}</span>${i===t?'<span class="dtt">TODAY</span>':''}</button>`}).join('');
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
    <button class="wchip rest ${cur?'':'on'}" data-pickw="">Rest</button><button class="wchip rest" data-pnew>+ New</button></div>
    ${cur?`<button class="alink" data-pedit style="margin-top:14px">Edit ${esc(cur)} exercises</button>`:''}`);
  s.querySelectorAll('[data-pickw]').forEach(b=>b.onclick=()=>{d[i]=b.dataset.pickw||null;s.remove();render();const r=$(`[data-pday="${i}"]`);r&&r.classList.add('flash')});
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
        `<div class="xlst">${L.map(x=>{const on=have.has(x.name.toLowerCase());return `<button class="xrow${on?' on':''}" data-xt="${esc(x.name)}"><span class="xgd" style="background:${GC[x.group]||GC.Other}"></span><span class="xrt"><b>${hl(x.name)}</b><small>${x.group} · ${x.equip} · ${x.sets}×${x.reps}</small></span><span class="xpl">${on?'✓':'+'}</span></button>`}).join('')}
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
