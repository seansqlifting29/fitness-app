/* ---- plan: week at a glance + workout bubbles ---- */
/* ---- plan: Custom (drag and drop week) | Templates (common splits) ---- */
const PAL=['#3987e5','#d95926','#199e70','#c98500','#d55181','#008300','#9085e9','#e66767'];
const PCOL={Push:0,Pull:1,Legs:2,Upper:3,Lower:4,'Full Body':5,'Chest & Back':6,'Shoulders & Arms':7,Chest:6,Back:0,Shoulders:3,Arms:1};
const pcol=n=>PAL[PCOL[n]!==undefined?PCOL[n]:(n.length%8)];
const TEMPLATES=[
 {id:'ppl6',name:'Push Pull Legs',sub:'6 days',w:['Push','Pull','Legs','Push','Pull','Legs',null]},
 {id:'ppl3',name:'Push Pull Legs',sub:'3 days',w:['Push',null,'Pull',null,'Legs',null,null]},
 {id:'ul4',name:'Upper / Lower',sub:'4 days',w:['Upper','Lower',null,'Upper','Lower',null,null]},
 {id:'pplul',name:'PPL + Upper Lower',sub:'5 days',w:['Push','Pull','Legs',null,'Upper','Lower',null]},
 {id:'fb3',name:'Full Body',sub:'3 days',w:['Full Body',null,'Full Body',null,'Full Body',null,null]},
 {id:'bro5',name:'Bro Split',sub:'5 days',w:['Chest','Back','Shoulders','Arms','Legs',null,null]},
 {id:'arn6',name:'Arnold Split',sub:'6 days',w:['Chest & Back','Shoulders & Arms','Legs','Chest & Back','Shoulders & Arms','Legs',null]}
];
// starter exercises for workouts a template needs but you don't have yet
const TEMPLATE_EX={
 'Push':['Incline Barbell Bench Press','Chest Press Machine','Pec Deck','Tricep Pushdown'],
 'Pull':['Lat Pulldown','Seated Cable Row','Face Pull','Hammer Curl'],
 'Legs':['Back Squat','Romanian Deadlift','Leg Extension','Standing Calf Raise'],
 'Upper':['Dumbbell Bench Press','Pull Up','Dumbbell Shoulder Press','Lateral Raise'],
 'Lower':['Deadlift','Leg Press','Walking Lunge','Seated Leg Curl'],
 'Full Body':['Back Squat','Barbell Bench Press','Barbell Row','Overhead Press','Romanian Deadlift'],
 'Chest':['Barbell Bench Press','Incline Dumbbell Press','Chest Press Machine','Cable Fly'],
 'Back':['Lat Pulldown','Barbell Row','Seated Cable Row','Straight Arm Pulldown'],
 'Shoulders':['Overhead Press','Lateral Raise','Reverse Pec Deck','Face Pull'],
 'Arms':['Barbell Curl','Tricep Pushdown','Hammer Curl','Overhead Tricep Extension'],
 'Chest & Back':['Barbell Bench Press','Barbell Row','Incline Dumbbell Press','Lat Pulldown'],
 'Shoulders & Arms':['Overhead Press','Lateral Raise','Barbell Curl','Skull Crusher']
};
const miniWeek=w=>`<div class="mw">${w.map(x=>`<i style="${x?'background:'+pcol(x):''}"></i>`).join('')}</div><div class="mwl">${DAYS.map(d=>`<em>${d[0]}</em>`).join('')}</div>`;
/* focus sets: what bubbles you drag onto your week */
const FOCUS={
  max:{name:'1 Rep Max',desc:'Build your big lifts',w:['Squat','Bench','Deadlift','Overhead Press','Accessories']},
  fit:{name:'Overall Fitness',desc:'Balanced strength and shape',w:['Push','Pull','Legs','Upper','Lower','Full Body','Cardio']},
  ath:{name:'Athlete',desc:'Power, speed and conditioning',w:['Power','Speed','Lower Strength','Upper Strength','Conditioning','Mobility']}
};
Object.assign(TEMPLATE_EX,{
  'Squat':['Back Squat','Front Squat','Leg Press','Walking Lunge'],
  'Bench':['Barbell Bench Press','Incline Dumbbell Press','Close Grip Bench Press','Tricep Pushdown'],
  'Deadlift':['Deadlift','Romanian Deadlift','Barbell Row','Back Extension'],
  'Overhead Press':['Overhead Press','Dumbbell Shoulder Press','Lateral Raise','Face Pull'],
  'Accessories':['Pull Up','Hammer Curl','Rope Pushdown','Cable Crunch'],
  'Cardio':['Treadmill','Rowing Machine','Stair Climber'],
  'Power':['Sled Push','Front Squat','Push Up','Jump Rope'],
  'Speed':['Jump Rope','Assault Bike','Treadmill'],
  'Lower Strength':['Back Squat','Romanian Deadlift','Bulgarian Split Squat','Standing Calf Raise'],
  'Upper Strength':['Barbell Bench Press','Pull Up','Overhead Press','Barbell Row'],
  'Conditioning':['Assault Bike','Rowing Machine','Sled Push','Stair Climber'],
  'Mobility':['Plank','Back Extension','Pallof Press','Glute Bridge']
});
const fcol=n=>{for(const k in FOCUS){const i=FOCUS[k].w.indexOf(n);if(i>=0)return PAL[i%8]}return pcol(n)};
const focusKey=()=>S.get('gym.focus','fit');
// the week as names while you edit; nothing is saved until you tap Save
let pdraft=null,focusMenu=false;
const weekNames=()=>week.map(id=>{if(id===REST)return REST;const w=workouts.find(x=>x.id===id);return w?w.name:null});
const draft=()=>pdraft||(pdraft=weekNames());
const planDirty=()=>!!pdraft&&pdraft.some((n,i)=>n!==weekNames()[i]);
function savePlan(){
  const d=draft();
  d.forEach(n=>{if(isW(n)&&!workouts.some(w=>w.name===n)){const ex=(TEMPLATE_EX[n]||[]).map(x=>LIBMAP[x.toLowerCase()]).filter(Boolean).map(x=>E(x.name,x.sets,x.reps,U()==='lb'?Math.round(x.w*2.2/5)*5:x.w,x.rest));workouts.push({id:nid(),name:n,ex})}});
  week=d.map(n=>n===REST?REST:n?workouts.find(w=>w.name===n).id:null);pdraft=null;save();syncToday(true);
}
const miniNames=w=>`<div class="mw">${w.map(x=>`<i style="${isW(x)?'background:'+fcol(x):x===REST?'background:#3a3a38':''}"></i>`).join('')}</div>`;
// ask before leaving with unsaved changes
function guardLeave(go){
  if(!planDirty())return go();
  const d=draft(),before=weekNames();const n=d.filter((x,i)=>x!==before[i]).length;
  const s=sheet(`<h3>Save changes to your week?</h3><p>You changed ${n} day${n>1?'s':''}.</p>
    <div class="ba"><span>Before</span>${miniNames(before)}</div><div class="ba"><span>After</span>${miniNames(d)}</div>
    <div class="row" style="margin-top:14px"><button class="btn" data-dis>Discard</button><button class="btn w" data-sv>Save</button></div><button class="alink" data-close style="margin-top:12px">Keep editing</button>`,true);
  s.querySelector('[data-dis]').onclick=()=>{pdraft=null;s.remove();go()};
  s.querySelector('[data-sv]').onclick=()=>{savePlan();s.remove();go()};
}
const tileName=n=>({'Shoulders':'Shldrs','Chest & Back':'Ch+Back','Shoulders & Arms':'Sh+Arms','Full Body':'Full','Overhead Press':'OHP','Accessories':'Access.','Lower Strength':'Lower S','Upper Strength':'Upper S','Conditioning':'Condit.'})[n]||(n.length>8?n.slice(0,7)+'…':n);
function planHTML(){
  if(planW!==null&&workouts.some(w=>w.id===planW))return planEditHTML();
  planW=null;
  return planMode==='edit'?planEditorHTML():schedHTML();
}
function oldPlanHTML(){
  const d=draft();const fk=focusKey();const F=FOCUS[fk]||FOCUS.fit;
  const t=wd(new Date());const mon=new Date();mon.setHours(0,0,0,0);mon.setDate(mon.getDate()-t);
  const days=DAYS.map((dn,i)=>{const n=d[i];const dt=new Date(mon);dt.setDate(mon.getDate()+i);
    return `<button class="wday ${i===t?'today':''} ${n?'':'off'}" data-wday="${i}" data-drop="day" data-di="${i}" ${n?`data-dragday="${i}"`:''}><span class="wl">${dn.slice(0,1)}</span><span class="wn">${dt.getDate()}</span><span class="ws">${n?`<i class="wdot" style="background:${fcol(n)}"></i>`+esc(tileName(n)):'Rest'}</span></button>`}).join('');
  // the focus set, plus any of your own workouts that aren't in a set
  const inSets=new Set(Object.values(FOCUS).flatMap(f=>f.w));
  const names=F.w.concat(workouts.map(w=>w.name).filter(n=>!inSets.has(n)&&!F.w.includes(n)));
  const bub=names.map(n=>`<button class="pill" data-wopen="${esc(n)}" data-dragw="${esc(n)}"><i class="pdot" style="background:${fcol(n)}"></i>${esc(n)}</button>`).join('')+`<button class="pill rest" data-dragw="">Rest</button>`;
  return `<div class="hdr"><div><h1>Plan</h1><div class="focusrow">Focus <button class="dd" data-fmenu>${F.name}<span class="car">▼</span></button>${focusMenu?`<div class="fmenu">${Object.entries(FOCUS).map(([k,f])=>`<button class="${fk===k?'on':''}" data-focus="${k}">${f.name}<small>${f.desc}</small></button>`).join('')}</div>`:''}</div></div><button class="iconbtn" data-settings aria-label="Settings">${IC.gear}</button></div>
  <div class="pad"><div class="week7">${days}</div>
  <div class="ptrash" data-drop="trash">Drop here to make it a rest day</div>
  <div class="sec" style="margin-top:22px">Drag onto a day</div><div class="pills2">${bub}<button class="pill new" data-wnew>+ New</button></div>
  <div class="phint">Drag one day onto another to swap. Drag a day to the red area to clear it. Tap a workout to edit it.</div></div>
  ${planDirty()?`<div class="savebar"><span>Unsaved changes</span><button class="btn" data-pdis>Discard</button><button class="btn w" data-psave>Save</button></div>`:''}`;
}
function useTemplate(id){
  const t=TEMPLATES.find(x=>x.id===id);const names=[...new Set(t.w.filter(Boolean))];
  const missing=names.filter(n=>!workouts.some(w=>w.name===n));
  const s=sheet(`<h3>Use ${esc(t.name)}?</h3><p>${t.sub} a week. This replaces your current week.${missing.length?` Adds ${missing.join(', ')} with starter exercises.`:''}</p>
    <div style="margin:4px 0 16px">${miniWeek(t.w)}</div><div class="row"><button class="btn" data-close>Cancel</button><button class="btn w" data-ok>Use this split</button></div>`);
  s.querySelector('[data-ok]').onclick=()=>{
    missing.forEach(n=>{const ex=(TEMPLATE_EX[n]||[]).map(x=>LIBMAP[x.toLowerCase()]).filter(Boolean).map(x=>E(x.name,x.sets,x.reps,U()==='lb'?Math.round(x.w*2.2/5)*5:x.w,x.rest));workouts.push({id:nid(),name:n,ex})});
    week=t.w.map(n=>n?workouts.find(w=>w.name===n).id:REST);
    S.set('gym.split',{id:t.id,name:t.name+' · '+t.sub,custom:false});
    save();s.remove();syncToday();planTab='custom';render();
  };
}
/* drag and drop on the Custom tab: finger or mouse */
function planDrag(el,onDrop,onStart,onEnd){
  el.addEventListener('pointerdown',ev=>{
    if(ev.button>0)return;const sx=ev.clientX,sy=ev.clientY;let ghost=null,over=null,started=false;const r=el.getBoundingClientRect();
    const move=e=>{const x=e.clientX,y=e.clientY;
      if(!started){if(Math.hypot(x-sx,y-sy)<7)return;started=true;ghost=el.cloneNode(true);ghost.className+=' dghost';ghost.style.width=r.width+'px';ghost.style.height=r.height+'px';document.body.appendChild(ghost);onStart&&onStart();try{navigator.vibrate&&navigator.vibrate(10)}catch(_){}}
      e.preventDefault();ghost.style.transform=`translate(${x-r.width/2}px,${y-r.height/2}px) scale(1.06)`;
      const t=document.elementFromPoint(x,y);const d=t&&t.closest('[data-drop]');if(d!==over){over&&over.classList.remove('dover');over=d;over&&over.classList.add('dover')}};
    const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
      if(ghost)ghost.remove();over&&over.classList.remove('dover');
      if(started){el.addEventListener('click',kill,{capture:true,once:true});setTimeout(()=>el.removeEventListener('click',kill,{capture:true}),300);onDrop(over)}onEnd&&onEnd()};
    const kill=e=>{e.stopPropagation();e.preventDefault()};
    window.addEventListener('pointermove',move,{passive:false});window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
  });
}
function bindPlanDrag(A){
  const d=draft();
  A.querySelectorAll('[data-dragw]').forEach(el=>planDrag(el,t=>{if(t&&t.dataset.drop==='day'){d[+t.dataset.di]=el.dataset.dragw||null;render()}}));
  A.querySelectorAll('[data-dragday]').forEach(el=>{const from=+el.dataset.dragday;
    planDrag(el,t=>{if(!t)return;if(t.dataset.drop==='trash'){d[from]=null}else if(t.dataset.drop==='day'){const to=+t.dataset.di;if(to===from)return;[d[from],d[to]]=[d[to],d[from]]}else return;render()},
      ()=>A.querySelector('.pad').classList.add('dday'),()=>{const p=A.querySelector('.pad');p&&p.classList.remove('dday')})});
  A.querySelectorAll('[data-fmenu]').forEach(b=>b.onclick=e=>{e.stopPropagation();focusMenu=!focusMenu;render()});
  A.querySelectorAll('[data-focus]').forEach(b=>b.onclick=()=>{S.set('gym.focus',b.dataset.focus);focusMenu=false;render()});
  const sv=A.querySelector('[data-psave]');if(sv)sv.onclick=()=>{savePlan();render()};
  const ds=A.querySelector('[data-pdis]');if(ds)ds.onclick=()=>{pdraft=null;render()};
}
const restTxt=s=>s>=60?Math.floor(s/60)+':'+String(s%60).padStart(2,'0'):s+'s';
function planEditHTML(){
  const w=workouts.find(x=>x.id===planW);
  if(planOpen===undefined||(planOpen&&!w.ex.some(e=>e.id===planOpen)))planOpen=w.ex[0]?w.ex[0].id:null;
  const onDays=week.map((x,i)=>x===w.id?DAYS[i].slice(0,3):'').filter(Boolean);
  const rows=w.ex.map((e,i)=>{const open=planOpen===e.id;
    const cust=cfg.restMode==='custom';
    const sum=`${e.sets} sets · ${e.w?num(e.w)+' '+U():'no weight'}${cust?` · ${restTxt(e.rest)} rest`:''}`;
    const g=groupOf(e.name);const badge=`<span class="pnum" style="background:${(typeof GC!=='undefined'&&GC[g])||'#8a8980'}">${i+1}</span>`;
    if(!open)return `<button class="prow" data-popen="${e.id}">${badge}<span class="prn">${esc(e.name)}<small>${g!=='Other'?g+' · ':''}${sum}</small></span>${IC.chev}</button>`;
    return `<div class="prow open"><div class="proh">${badge}<span class="prn" data-popen="">${esc(e.name)}<small>${g!=='Other'?g:'Your exercise'}</small></span>${i?`<button class="pmini" data-up="${i}" aria-label="Move up">↑</button>`:''}<button class="pmini" data-del="${i}" aria-label="Remove">✕</button></div>
      <div class="ptiles${cust?'':' two'}"><button class="ptile" data-pe="sets:${i}"><small>Sets</small><b>${e.sets}</b></button><button class="ptile" data-pe="w:${i}"><small>Weight</small><b>${e.w?num(e.w):'–'}<i>${e.w?U():''}</i></b></button>${cust?`<button class="ptile" data-pe="rest:${i}"><small>Rest</small><b>${restTxt(e.rest)}</b></button>`:''}</div></div>`}).join('');
  return `<div class="hdr"><button class="back" data-backplan>${IC.back}${planMode==='edit'?'Plan':'Schedule'}</button></div>
  <div class="pad"><input class="wname" value="${esc(w.name)}" data-wname aria-label="Workout name" placeholder="Workout name">
    <div class="sub" style="margin:2px 2px 14px;color:var(--t3);font-size:14px">${onDays.length?'Every '+onDays.join(', '):'Not on your week yet. Add it to a day in Plan.'}</div>
    <div class="prows">${rows||'<div class="empty" style="padding:24px 10px">No exercises yet. Add the ones you do for this workout.</div>'}</div>
    <button class="addex" data-padd style="margin-top:12px">+ Add exercise</button>
    <button class="alink" data-wdel style="margin-top:22px;color:var(--over)">Delete this workout</button></div>`;
}
/* one popup for sets, weight and rest: big number with − and + */
function editField(w,i,k){
  const e=w.ex[i];const wstep=U()==='kg'?2.5:5;
  const F={sets:{t:'Sets',d:'How many sets you plan to do. You can always add one on the day.',v:e.sets,step:1,min:1,max:10,show:v=>v,parse:v=>parseInt(v)},
    w:{t:'Starting weight ('+U()+')',d:'After your first session the app uses whatever you actually lifted.',v:e.w,step:wstep,min:0,max:999,show:v=>num(v),parse:v=>parseFloat(v)},
    rest:{t:'Rest between sets',d:cfg.restMode==='ratio'?`Your rest timer is on the 1:${cfg.ratio} ratio, so this time is only used for sets you check off without timing. Switch to Custom in settings to always use it.`:'How long the rest timer counts down after each set.',v:e.rest,step:15,min:0,max:600,show:restTxt,parse:v=>{v=String(v).trim();if(v.includes(':')){const [m,s]=v.split(':');return (+m||0)*60+(+s||0)}return parseInt(v)}}}[k];
  const s=sheet(`<h3>${esc(e.name)}</h3><div class="lbl" style="margin-top:6px">${F.t}</div><p>${F.d}</p>
    <div class="step"><button data-st="-" aria-label="Less">−</button><input id="fv" inputmode="${k==='rest'?'text':'decimal'}" value="${F.show(F.v)}"><button data-st="+" aria-label="More">+</button></div>
    <div class="row"><button class="btn" data-close>Cancel</button><button class="btn w" data-ok>Save</button></div>`);
  const inp=s.querySelector('#fv');let v=F.v;
  const clamp=x=>Math.min(F.max,Math.max(F.min,isNaN(x)?F.v:x));
  inp.onfocus=()=>inp.select();inp.onchange=()=>{v=clamp(F.parse(inp.value));inp.value=F.show(v)};
  s.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>{v=clamp(F.parse(inp.value));v=clamp(v+(b.dataset.st==='+'?F.step:-F.step));if(k==='w')v=num(v);inp.value=F.show(v)});
  s.querySelector('[data-ok]').onclick=()=>{v=clamp(F.parse(inp.value));e[k==='w'?'w':k]=v;save();s.remove();syncToday();render()};
}
function dayPicker(i){
  const d=draft();const fk=focusKey();const inSets=new Set(Object.values(FOCUS).flatMap(f=>f.w));
  const names=FOCUS[fk].w.concat(workouts.map(w=>w.name).filter(n=>!inSets.has(n)&&!FOCUS[fk].w.includes(n)));
  const s=sheet(`<h3>${DAYS[i]}</h3><p>Pick the workout for this day.</p><div class="chips" style="justify-content:flex-start">${names.map(n=>`<button class="chip ${d[i]===n?'on':''}" data-pickw="${esc(n)}">${esc(n)}</button>`).join('')}<button class="chip ${d[i]?'':'on'}" data-pickw="">Rest</button></div>`);
  s.querySelectorAll('[data-pickw]').forEach(b=>b.onclick=()=>{d[i]=b.dataset.pickw||null;s.remove();render()});
}
