/* ===== sheets ===== */
function sheet(html,center){
  if(sheet.lastHtml===html&&Date.now()-sheet.lastAt<500&&document.querySelector('.scrim'))return document.querySelector('.scrim:last-of-type')||document.querySelector('.scrim');sheet.lastHtml=html;sheet.lastAt=Date.now();
  const s=document.createElement('div');s.className='scrim'+(center?' center':'');
  s.innerHTML=`<div class="sheet">${center?'':'<div class="grab"></div><button class="sclose" data-close aria-label="Close">✕</button>'}${html}</div>`;
  $('#app').appendChild(s);
  const born=Date.now();
  s.addEventListener('click',e=>{if(e.target===s&&Date.now()-born<350)return;if(e.target===s||e.target.closest('[data-close]'))s.remove()});
  return s;
}
// a ‹ in the sheet's corner that goes back to the sheet it came from
function sheetBack(s,to){if(!s||!s.querySelector)return s;const sh=s.querySelector('.sheet');if(!sh)return s;const b=document.createElement('button');b.className='sback';b.setAttribute('data-back','');b.setAttribute('aria-label','Back');b.textContent='‹';
  b.onclick=e=>{e.stopPropagation();s.remove();to()};sh.insertBefore(b,sh.children[1]||null);sh.classList.add('hasback');return s}
// full screen question for choices that change today's plan
function takeover(title,text,acts){
  const t=document.createElement('div');t.className='takeover';t.setAttribute('role','dialog');t.setAttribute('aria-modal','true');
  t.innerHTML=`<h2>${title}</h2><p>${text}</p><div class="tk">${acts.map((a,i)=>`<button data-tk="${i}" class="${a.primary?'p':a.quiet||!a.fn?'c':''}" ${a.fn?'':'data-close'}>${a.label}</button>`).join('')}</div>`;
  t.querySelectorAll('[data-tk]').forEach(b=>b.onclick=()=>{t.remove();const f=acts[+b.dataset.tk].fn;f&&f()});
  $('#app').appendChild(t);return t}
function confirmBox(title,text,okLabel,onOk,cancel='Cancel'){
  const s=sheet(`<h3>${title}</h3><p>${text}</p><div class="row"><button class="btn" data-close>${cancel}</button><button class="btn w" data-ok>${okLabel}</button></div>`,true);
  s.querySelector('[data-ok]').onclick=()=>{s.remove();onOk()};
}
function editSet(e,j){
  const ex=ses.ex[e],set=ex.sets[j];const stepW=U()==='kg'?2.5:5;
  const s=sheet(`<h3>${esc(ex.name)} · Set ${j+1}</h3>
    <div class="lbl">Weight (${U()})</div><div class="step"><button data-sw="-">−</button><input id="iw" inputmode="decimal" value="${num(set.w)}"><button data-sw="+">+</button></div>
    <div class="lbl">Reps</div><div class="step"><button data-sr="-">−</button><input id="ir" inputmode="numeric" value="${set.r}"><button data-sr="+">+</button></div>
    ${j<ex.sets.length-1?`<label class="check"><input type="checkbox" id="rest" checked> Apply to the sets after this one</label>`:''}
    <div class="row"><button class="btn" data-close>Cancel</button><button class="btn w" data-save>Save</button></div>`);
  const iw=s.querySelector('#iw'),ir=s.querySelector('#ir');
  s.querySelectorAll('[data-sw]').forEach(b=>b.onclick=()=>iw.value=num(Math.max(0,(parseFloat(iw.value)||0)+(b.dataset.sw==='+'?stepW:-stepW))));
  s.querySelectorAll('[data-sr]').forEach(b=>b.onclick=()=>ir.value=Math.max(0,(parseInt(ir.value)||0)+(b.dataset.sr==='+'?1:-1)));
  s.querySelector('[data-save]').onclick=()=>{const w=Math.max(0,parseFloat(iw.value)||0),r=Math.max(0,parseInt(ir.value)||0);
    const all=s.querySelector('#rest')?.checked;ex.sets.forEach((x,k)=>{if(k===j||(all&&k>j&&!x.done)){x.w=w;x.r=r}});save();s.remove();render()};
}
// Erase starts you over exactly like a first open: every app key goes (plan, history, settings,
// week changes, make-ups, setup times, sync state), you're signed out, and the page reloads.
// The sample year's own storage is left alone.
function eraseAll(){window.__wiping=true;
  const wipe=()=>{try{Object.keys(localStorage).filter(k=>/^(gym3?\.|fit\.)/.test(k)).forEach(k=>localStorage.removeItem(k))}catch(e){}
    // after the confirm box has closed: closing it steps the history back, which would cancel a reload started now
    setTimeout(()=>location.reload(),400)};
  Promise.race([Cloud.signOut().catch(()=>{}),new Promise(r=>setTimeout(r,1500))]).then(wipe,wipe)}
function settingsSheet(){
  const s=sheet(`<h3>Settings</h3>
    <div class="lbl" style="margin-top:10px">You</div>
    <div class="tgl">Name<input id="sn" value="${esc(me.name)}" style="background:var(--card2);border:0;border-radius:9px;padding:8px;width:160px;font-weight:600;outline:none"></div>
    <div class="tgl">Units<div class="seg" style="margin:0;width:120px"><button data-u="kg" class="${U()==='kg'?'on':''}">kg</button><button data-u="lb" class="${U()==='lb'?'on':''}">lb</button></div></div>
    ${Cloud.available?`<button class="tgl cl-row" data-cloud><div>Cloud sync<small id="clst"></small></div><span class="sar">›</span></button>`:''}
    <div class="lbl" style="margin-top:18px">Training</div>
    <div class="tgl" style="flex-wrap:wrap"><div>Rest timer<small id="rdesc"></small></div><div class="seg" style="margin:0;width:170px"><button data-rm="ratio" class="${cfg.restMode==='ratio'?'on':''}">Ratio</button><button data-rm="custom" class="${cfg.restMode==='custom'?'on':''}">Custom</button></div></div>
    <div class="tgl" id="rrow" style="${cfg.restMode==='ratio'?'':'display:none'}"><div>Work to rest<small>Rest = set length × this</small></div><div class="ratio"><button data-rr="-1" aria-label="Less rest">−</button><b id="rv">1:${cfg.ratio}</b><button data-rr="1" aria-label="More rest">+</button></div></div>
    <div class="tgl"><div>Warm up first<small>Before the day's first workout</small></div><input type="checkbox" id="swu" ${cfg.warmup?'checked':''}></div>
    <div class="tgl"><div>Warm up every exercise<small>Before the first set of each one</small></div><input type="checkbox" id="swe" ${cfg.warmEach?'checked':''}></div>
    <div class="tgl"><div>Cardio after every workout<small>10, 15 or 20 minutes once the lifts are done</small></div><input type="checkbox" id="scd" ${cfg.cardio?'checked':''}></div>
    <div class="tgl">Beep and vibrate when rest ends<input type="checkbox" id="ss" ${cfg.sound?'checked':''}></div>
    <div class="lbl" style="margin-top:18px">Your data</div>
    <div class="tgl" style="border:0"><div>Backup<small>Save your plan and history to a file, or restore one on a new phone</small></div></div>
    <div class="row"><button class="btn" data-bsave>Save backup</button><label class="btn" style="text-align:center;cursor:pointer">Restore<input type="file" accept=".json,application/json" data-bload hidden></label></div>
    <div class="row" style="margin-top:16px"><button class="btn red" data-wipe>Erase all data</button><button class="btn w" data-close>Done</button></div>`);
  s.querySelector('[data-bsave]').onclick=()=>backupSave();
  s.querySelector('[data-bload]').onchange=e=>{const f=e.target.files[0];if(f){s.remove();backupLoad(f)}};
  s.querySelector('#sn').onchange=e=>{me.name=e.target.value.trim()||me.name;save()};
  s.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{cfg.unit=b.dataset.u;save();s.querySelectorAll('[data-u]').forEach(x=>x.classList.toggle('on',x===b));render();$('#app').appendChild(s)});
  s.querySelector('#ss').onchange=e=>{cfg.sound=e.target.checked;save()};
  s.querySelector('#swu').onchange=e=>{cfg.warmup=e.target.checked;save()};
  s.querySelector('#swe').onchange=e=>{cfg.warmEach=e.target.checked;save()};
  s.querySelector('#scd').onchange=e=>{cfg.cardio=e.target.checked;save();render();$('#app').appendChild(s)};
  const rdesc=()=>{s.querySelector('#rdesc').textContent=cfg.restMode==='ratio'?`A 30s set gets ${clock(Math.min(360000,Math.max(30000,30000*cfg.ratio)))} rest. Kept between 0:30 and 6:00.`:'Each exercise uses the rest time set in Plan.';s.querySelector('#rv').textContent='1:'+cfg.ratio;s.querySelector('#rrow').style.display=cfg.restMode==='ratio'?'':'none'};
  rdesc();
  s.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{cfg.restMode=b.dataset.rm;save();s.querySelectorAll('[data-rm]').forEach(x=>x.classList.toggle('on',x===b));rdesc()});
  s.querySelectorAll('[data-rr]').forEach(b=>b.onclick=()=>{cfg.ratio=Math.min(10,Math.max(1,cfg.ratio+ +b.dataset.rr));save();rdesc()});
  s.querySelector('[data-wipe]').onclick=()=>{s.remove();confirmBox('Erase everything?','Your plan, history and current workout will be deleted from this device.','Erase',eraseAll)};
  const cb=s.querySelector('[data-cloud]');if(cb){const st=Cloud.status();s.querySelector('#clst').textContent=st.email?(st.state==='ok'?'On · '+st.email:st.state==='offline'?'Offline · syncs later':st.state==='error'?'Needs attention':'Syncing…'):'Off. Use your data on any device';
    cb.onclick=()=>{s.remove();sheetBack(cloudSheet(),settingsSheet)}}
  return s;
}

function sampleData(){
  const names=[0,1,2,4,5];let d=new Date();d.setHours(0,0,0,0);const out=[];
  for(let k=60;k>=1;k--){const day=new Date(d);day.setDate(d.getDate()-k);const w=wd(day);const p=dayW(w);if(!p||!p.ex.length||Math.random()<.2)continue;
   let tut=0,rest=0,sets=0,vol=0;const ex=p.ex.map(e=>{const ss=Array.from({length:e.sets},(_,i)=>{const t=(25+Math.random()*25)*1000;tut+=t;sets++;const ww=Math.max(0,Math.round(e.w*(.8+.2*(60-k)/60)/2.5)*2.5);const rr=Math.max(1,e.reps-(Math.random()<.3?1:0)-(i===e.sets-1&&Math.random()<.4?1:0));vol+=ww*rr;return{w:ww,r:rr,tut:t}});rest+=(e.sets-1)*e.rest*1000*(0.9+Math.random()*.6);return{name:e.name,sets:ss}});
    rest+=(p.ex.length-1)*60000*(.5+Math.random());const total=tut+rest+(6+Math.random()*10)*60000;
    out.push({id:nid(),date:dkey(day),start:day.getTime()+(6+Math.floor(Math.random()*13))*36e5+Math.floor(Math.random()*60)*6e4,split:p.name,total,tut,rest,sets,volume:Math.round(vol),unit:U(),ex})}
  hist=out.concat(hist);save();render();
}


/* ===== backup: one file with everything, works on any device ===== */
const BKEYS=['gym.me','gym.workouts','gym.week','gym.hist','gym.blocks','gym.cfg','gym.split','gym.range','gym3.session'];
function backupSave(){
  const data={};BKEYS.forEach(k=>{try{const v=localStorage.getItem(k);if(v!==null)data[k]=JSON.parse(v)}catch(e){}});
  const txt=JSON.stringify({app:'fitness',version:1,saved:new Date().toISOString(),data});
  const name='fitness-backup-'+dkey(new Date())+'.json';
  try{const url=URL.createObjectURL(new Blob([txt],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}catch(e){}
  if(window.top!==window){try{navigator.clipboard.writeText(txt).then(()=>sheet('<h3>Backup copied</h3><p>Saving files is blocked inside Claude, so the backup was copied instead. Paste it into a note to keep it.</p><button class="btn w" style="width:100%" data-close>OK</button>',true))}catch(e){}}
}
function backupLoad(file){
  const r=new FileReader();r.onload=()=>{let j;try{j=JSON.parse(r.result)}catch(e){j=null}
    if(!j||j.app!=='fitness'||!j.data)return sheet('<h3>That file isn\'t a backup</h3><p>Pick a file saved with Save backup.</p><button class="btn w" style="width:100%" data-close>OK</button>',true);
    const n=(j.data['gym.hist']||[]).length;
    confirmBox('Restore this backup?',`It has ${n} workout${n===1?'':'s'} from ${j.saved?new Date(j.saved).toLocaleDateString():'an earlier date'}. Everything on this device will be replaced.`,'Restore',()=>{
      BKEYS.forEach(k=>{try{localStorage.removeItem(k)}catch(e){}});Object.entries(j.data).forEach(([k,v])=>{if(BKEYS.includes(k))try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}});
      try{localStorage.setItem('gym.weekReset1','true')}catch(e){}location.reload()})};
  r.readAsText(file);
}
