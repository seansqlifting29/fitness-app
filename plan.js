/* ---- plan: week at a glance + workout bubbles ---- */
/* ---- plan: Custom (drag and drop week) | Templates (common splits) ---- */
const PAL=['#3987e5','#d95926','#199e70','#c98500','#d55181','#008300','#9085e9','#e66767'];
const PCOL={Push:0,Pull:1,Legs:2,Upper:3,Lower:4,'Full Body':5,'Chest & Back':6,'Shoulders & Arms':7,Chest:6,Back:0,Shoulders:3,Arms:1};
const pcol=n=>PAL[PCOL[n]!==undefined?PCOL[n]:(n.length%8)];
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
/* focus sets: what bubbles you drag onto your week */
const FOCUS={
  max:{name:'1 Rep Max',desc:'Build your big lifts',w:['Squat','Bench','Deadlift','Overhead Press','Accessories']},
  fit:{name:'Overall Fitness',desc:'Balanced strength and shape',w:['Push','Pull','Legs','Upper','Lower','Full Body']},
  ath:{name:'Athlete',desc:'Power, speed and conditioning',w:['Power','Speed','Lower Strength','Upper Strength','Conditioning','Mobility']}
};
Object.assign(TEMPLATE_EX,{
  'Squat':['Back Squat','Front Squat','Leg Press','Walking Lunge'],
  'Bench':['Barbell Bench Press','Incline Dumbbell Press','Close Grip Bench Press','Tricep Pushdown'],
  'Deadlift':['Deadlift','Romanian Deadlift','Barbell Row','Back Extension'],
  'Overhead Press':['Overhead Press','Dumbbell Shoulder Press','Lateral Raise','Face Pull'],
  'Accessories':['Pull Up','Hammer Curl','Rope Pushdown','Cable Crunch'],
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
  const old=week.slice();week=d.map(n=>n===REST?REST:n?workouts.find(w=>w.name===n).id:null);pdraft=null;commitWeek(old);
}
// planning a day from today on is what you want this week too: it replaces any swap or make-up planned there
function commitWeek(old){
  const t=wd(new Date());const O=dayOvers();let oc=false;const X=extras();let xc=false;
  // a day already trained this week keeps what it was
  // a day already trained this week keeps what it was; a change there applies from next week
  const pinned=new Set();
  // days already gone this week stay as they were too: planning Monday on a Saturday means next Monday
  for(let i=0;i<=t;i++){if(old[i]===week[i]||(i===t&&!lockedDay(i)))continue;
    if(i<t||lockedDay(i)==='done'){const k=dkey(dayDate(i));if(!(k in O)){O[k]=old[i]==null?'open':old[i];oc=true}pinned.add(i)}else week[i]=old[i]}
  for(let i=t;i<7;i++){if(old[i]===week[i]||pinned.has(i))continue;const k=dkey(dayDate(i));if(k in O){delete O[k];oc=true}if(X[k]&&isW(week[i])){delete X[k];xc=true}}
  if(oc)S.set('gym.dayOver',O);if(xc)S.set('gym.extra',X);
  save();const msg=syncToday(true);if(msg)toast(msg);
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
function planHTML(){
  if(planW!==null&&workouts.some(w=>w.id===planW))return planEditHTML();
  planW=null;
  return planMode==='edit'?planEditorHTML():schedHTML();
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
