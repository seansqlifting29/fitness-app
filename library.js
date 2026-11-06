/* ===== exercise library =====
 name | muscle group | equipment | sets | reps | starting kg | rest s | popular(1) */
const LIB_RAW=`Barbell Bench Press|Chest|Barbell|3|8|60|120|1
Incline Barbell Bench Press|Chest|Barbell|3|8|50|120|1
Decline Bench Press|Chest|Barbell|3|8|50|120|0
Dumbbell Bench Press|Chest|Dumbbell|3|10|24|90|1
Incline Dumbbell Press|Chest|Dumbbell|3|10|20|90|1
Chest Press Machine|Chest|Machine|3|10|45|75|1
Incline Chest Press Machine|Chest|Machine|3|10|40|75|0
Smith Machine Bench Press|Chest|Smith|3|8|50|90|0
Pec Deck|Chest|Machine|3|12|35|60|1
Cable Fly|Chest|Cable|3|12|15|60|1
Low to High Cable Fly|Chest|Cable|3|12|10|60|0
Dumbbell Fly|Chest|Dumbbell|3|12|12|60|0
Push Up|Chest|Bodyweight|3|15|0|60|1
Chest Dip|Chest|Bodyweight|3|10|0|90|0
Deadlift|Back|Barbell|3|5|100|180|1
Lat Pulldown|Back|Cable|3|10|50|90|1
Close Grip Lat Pulldown|Back|Cable|3|10|45|90|0
Pull Up|Back|Bodyweight|3|8|0|120|1
Chin Up|Back|Bodyweight|3|8|0|120|0
Assisted Pull Up Machine|Back|Machine|3|10|30|90|1
Seated Cable Row|Back|Cable|3|10|50|90|1
Barbell Row|Back|Barbell|3|8|60|120|1
Dumbbell Row|Back|Dumbbell|3|10|26|90|1
T-Bar Row|Back|Barbell|3|10|40|90|0
Chest Supported Row Machine|Back|Machine|3|10|45|90|1
Machine Row|Back|Machine|3|10|50|90|0
Straight Arm Pulldown|Back|Cable|3|12|25|60|0
Back Extension|Back|Bodyweight|3|12|0|60|0
Rack Pull|Back|Barbell|3|5|120|180|0
Overhead Press|Shoulders|Barbell|3|8|40|120|1
Dumbbell Shoulder Press|Shoulders|Dumbbell|3|10|18|90|1
Shoulder Press Machine|Shoulders|Machine|3|10|35|90|1
Arnold Press|Shoulders|Dumbbell|3|10|14|90|0
Lateral Raise|Shoulders|Dumbbell|3|15|8|45|1
Cable Lateral Raise|Shoulders|Cable|3|15|5|45|0
Machine Lateral Raise|Shoulders|Machine|3|15|20|45|0
Front Raise|Shoulders|Dumbbell|3|12|8|45|0
Rear Delt Fly|Shoulders|Dumbbell|3|15|6|45|0
Reverse Pec Deck|Shoulders|Machine|3|15|25|45|1
Face Pull|Shoulders|Cable|3|15|20|60|1
Upright Row|Shoulders|Barbell|3|12|25|60|0
Shrug|Shoulders|Dumbbell|3|12|30|60|0
Barbell Curl|Arms|Barbell|3|10|25|60|1
Dumbbell Curl|Arms|Dumbbell|3|10|12|60|1
Hammer Curl|Arms|Dumbbell|3|12|14|60|1
EZ Bar Curl|Arms|Barbell|3|10|25|60|0
Preacher Curl|Arms|Machine|3|10|25|60|1
Cable Curl|Arms|Cable|3|12|20|60|0
Incline Dumbbell Curl|Arms|Dumbbell|3|10|10|60|0
Concentration Curl|Arms|Dumbbell|3|12|10|45|0
Tricep Pushdown|Arms|Cable|3|12|25|60|1
Rope Pushdown|Arms|Cable|3|12|20|60|1
Overhead Tricep Extension|Arms|Cable|3|12|20|60|1
Skull Crusher|Arms|Barbell|3|10|25|60|0
Close Grip Bench Press|Arms|Barbell|3|8|50|90|0
Tricep Dip Machine|Arms|Machine|3|12|40|60|0
Wrist Curl|Arms|Dumbbell|3|15|8|45|0
Back Squat|Legs|Barbell|3|8|80|150|1
Front Squat|Legs|Barbell|3|8|60|150|0
Leg Press|Legs|Machine|3|12|120|90|1
Hack Squat|Legs|Machine|3|10|60|120|1
Smith Machine Squat|Legs|Smith|3|10|60|120|0
Pendulum Squat|Legs|Machine|3|10|40|120|0
Goblet Squat|Legs|Dumbbell|3|12|24|75|1
Bulgarian Split Squat|Legs|Dumbbell|3|10|14|90|1
Walking Lunge|Legs|Dumbbell|3|12|16|75|1
Step Up|Legs|Dumbbell|3|10|12|75|0
Leg Extension|Legs|Machine|3|12|40|60|1
Lying Leg Curl|Legs|Machine|3|12|35|60|1
Seated Leg Curl|Legs|Machine|3|12|40|60|1
Romanian Deadlift|Legs|Barbell|3|10|70|120|1
Standing Calf Raise|Legs|Machine|3|15|60|45|1
Seated Calf Raise|Legs|Machine|3|15|40|45|0
Hip Thrust|Glutes|Barbell|3|10|80|90|1
Glute Bridge|Glutes|Bodyweight|3|15|0|60|0
Hip Abduction Machine|Glutes|Machine|3|15|45|45|1
Hip Adduction Machine|Glutes|Machine|3|15|45|45|1
Cable Kickback|Glutes|Cable|3|12|10|45|0
Glute Kickback Machine|Glutes|Machine|3|12|30|45|0
Sumo Deadlift|Glutes|Barbell|3|5|90|150|0
Plank|Core|Bodyweight|3|1|0|45|1
Cable Crunch|Core|Cable|3|15|30|45|1
Hanging Leg Raise|Core|Bodyweight|3|12|0|60|1
Ab Crunch Machine|Core|Machine|3|15|35|45|1
Captain's Chair Knee Raise|Core|Machine|3|12|0|45|0
Russian Twist|Core|Bodyweight|3|20|0|45|0
Ab Wheel Rollout|Core|Bodyweight|3|10|0|60|0
Decline Sit Up|Core|Bodyweight|3|15|0|45|0
Pallof Press|Core|Cable|3|12|10|45|0
Treadmill|Cardio|Cardio|1|20|0|0|1
Stationary Bike|Cardio|Cardio|1|20|0|0|1
Rowing Machine|Cardio|Cardio|1|10|0|0|1
Elliptical|Cardio|Cardio|1|20|0|0|0
Stair Climber|Cardio|Cardio|1|15|0|0|1
Assault Bike|Cardio|Cardio|1|10|0|0|0
Sled Push|Cardio|Cardio|3|1|40|90|0
Jump Rope|Cardio|Bodyweight|3|1|0|60|0`;
const LIB=LIB_RAW.split('\n').map(l=>{const [name,group,equip,sets,reps,w,rest,pop]=l.split('|');return{name,group,equip,sets:+sets,reps:+reps,w:+w,rest:+rest,pop:pop==='1'}});
const LIBMAP=Object.fromEntries(LIB.map(x=>[x.name.toLowerCase(),x]));
const GROUPS=['Chest','Back','Shoulders','Arms','Legs','Glutes','Core','Cardio'];
const EQUIP=['Machine','Cable','Barbell','Dumbbell','Smith','Bodyweight'];
const groupOf=name=>(LIBMAP[name.toLowerCase()]||{}).group||'Other';

/* the picker: search, filter by muscle or gear, tap to select several, add all at once */
function libraryPicker(existing,onAdd){
  const st={q:'',g:'Popular',eq:'',sel:new Set()};
  const s=document.createElement('div');s.className='scrim';
  s.innerHTML=`<div class="sheet lib"><div class="grab"></div><div class="libtop"><h3>Add exercises</h3><button class="iconbtn" data-close aria-label="Close" style="width:32px;height:32px">✕</button></div>
    <input class="field libq" placeholder="Search 100 exercises" id="lq" autocomplete="off">
    <div class="libchips" id="lg"></div><div class="libchips gear" id="le"></div>
    <div class="liblist" id="ll"></div>
    <button class="btn w libgo" id="lgo" disabled>Select exercises</button></div>`;
  $('#app').appendChild(s);
  const born=Date.now();s.addEventListener('click',e=>{if(e.target===s&&Date.now()-born<350)return;if(e.target===s||e.target.closest('[data-close]'))s.remove()});
  const have=new Set(existing.map(n=>n.toLowerCase()));
  const draw=()=>{
    s.querySelector('#lg').innerHTML=['Popular','All',...GROUPS].map(g=>`<button class="lchip ${st.g===g?'on':''}" data-g="${g}">${g}</button>`).join('');
    s.querySelector('#le').innerHTML=['Any gear',...EQUIP].map(e=>`<button class="lchip ${(st.eq||'Any gear')===e?'on':''}" data-eq="${e}">${e}</button>`).join('');
    const q=st.q.trim().toLowerCase();
    let items=LIB.filter(x=>(!q||x.name.toLowerCase().includes(q)||x.group.toLowerCase().includes(q)||x.equip.toLowerCase().includes(q))
      &&(q||st.g==='All'||(st.g==='Popular'?x.pop:x.group===st.g))&&(q||!st.eq||x.equip===st.eq));
    let html='';
    if(q&&!LIBMAP[q])html+=`<button class="lrow custom" data-custom="1"><span class="lc">+</span><span class="ln">Add "${esc(st.q.trim())}"<small>Custom exercise</small></span></button>`;
    let lastG='';
    items.forEach(x=>{const isHave=have.has(x.name.toLowerCase());const on=st.sel.has(x.name);
      if(st.g==='All'&&!q&&x.group!==lastG)html+=`<div class="lsec">${x.group}</div>`;
      lastG=x.group;
      html+=`<button class="lrow ${on?'on':''} ${isHave?'have':''}" data-n="${esc(x.name)}" ${isHave?'disabled':''}><span class="lc">${on?'✓':''}</span><span class="ln">${esc(x.name)}<small>${x.equip} · ${x.group}</small></span>${isHave?'<span class="lh">Added</span>':''}</button>`});
    if(!items.length&&!q)html+='<div class="empty" style="padding:20px">Nothing here with that gear.</div>';
    s.querySelector('#ll').innerHTML=html;
    const go=s.querySelector('#lgo');const n=st.sel.size;go.disabled=!n;go.textContent=n?`Add ${n} exercise${n>1?'s':''}`:'Select exercises';
    s.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{st.g=b.dataset.g;st.q='';s.querySelector('#lq').value='';draw()});
    s.querySelectorAll('[data-eq]').forEach(b=>b.onclick=()=>{st.eq=b.dataset.eq==='Any gear'?'':b.dataset.eq;draw()});
    s.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{const k=b.dataset.n;st.sel.has(k)?st.sel.delete(k):st.sel.add(k);draw()});
    const c=s.querySelector('[data-custom]');if(c)c.onclick=()=>{const nm=st.q.trim();s.remove();onAdd([E(nm,3,10,20,60)]);render()};
  };
  s.querySelector('#lq').oninput=e=>{st.q=e.target.value;draw()};
  s.querySelector('#lgo').onclick=()=>{const list=[...st.sel].map(n=>{const x=LIBMAP[n.toLowerCase()];return E(x.name,x.sets,x.reps,U()==='lb'?Math.round(x.w*2.2/5)*5:x.w,x.rest)});s.remove();onAdd(list);render()};
  draw();
}
