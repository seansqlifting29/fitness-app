/* ===== preview walk through: a few steps over the sample year (preview only) ===== */
(function(){
  const A=document.getElementById('app');if(!A||!window.DEMO_DATA)return;
  let seen=false;try{seen=!!localStorage.getItem('gym.tourDone')}catch(e){}
  if(seen&&!window.TOUR_FORCE)return;
  const firstEx=()=>{try{ensureSession();const k=ses.ex.findIndex(e=>e.sets.length&&e.sets.every(s=>!s.done));return k<0?0:k}catch(e){return 0}};
  const go=(t,f)=>{try{document.querySelectorAll('.scrim,.takeover').forEach(x=>x.remove());planMode='sched';tab=t;focus=f===undefined?null:f;render();(document.getElementById('main')||window).scrollTo(0,0)}catch(e){}};
  const STEPS=[
    {t:'A year of training',p:'This is sample data: a Push, Pull, Legs, Upper, Lower plan logged for a year. Every number on these pages comes from the sets.',at:()=>go('stats')},
    {t:'One pie, five views',p:'Tap the chips under the pie: plan kept, where gym time goes, sets by muscle, work to rest and cardio by machine.',at:()=>go('stats')},
    {t:'Charts you can open',p:'Scroll down. Tap any point to see the sets behind it, or the i for what the chart means.',at:()=>go('stats')},
    {t:'Your week on one screen',p:'Done days show the time. Missed ones turn up as left over, to make up on a free day.',at:()=>go('plan')},
    {t:'Today is a checklist',p:'Tap an exercise and one button runs each set. The chart shows that set over your last six sessions, with today\'s target as the ring.',at:()=>go('today',firstEx())},
    {t:'That\'s the tour',p:'Your own app starts empty and fills in as you lift.',at:()=>go('today'),end:true}];
  let i=0;const c=document.createElement('div');c.className='tourbox';c.setAttribute('role','dialog');c.setAttribute('aria-label','Tour');
  const st=document.createElement('style');st.textContent=`.tourbox{position:absolute;left:12px;right:12px;bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:70;background:#f0efec;color:#111;border-radius:18px;padding:14px 16px 12px;box-shadow:0 10px 30px rgba(0,0,0,.5)}
.tourbox .tk{font-size:11px;font-weight:800;letter-spacing:.8px;color:#6f6f6a}.tourbox h3{font-size:18px;margin:3px 0 4px}.tourbox p{font-size:14px;line-height:1.45;color:#333}
.tourbox .tr{display:flex;gap:8px;margin-top:12px;align-items:center}.tourbox .tr button,.tourbox .tr a{height:40px;border-radius:12px;padding:0 16px;font-weight:700;font-size:14px;display:flex;align-items:center;text-decoration:none}
.tourbox .tn{margin-left:auto;background:#111;color:#f0efec}.tourbox .ts{background:none;color:#6f6f6a;padding:0 4px!important}`;
  document.head.appendChild(st);
  let over=false;const done=()=>{over=true;try{localStorage.setItem('gym.tourDone','1')}catch(e){}c.remove()};
  // the app redraws #app on every change; put the card back each time
  new MutationObserver(()=>{if(!over&&c.innerHTML&&!c.isConnected)A.appendChild(c)}).observe(A,{childList:true});
  const show=()=>{const s=STEPS[i];s.at();
    c.innerHTML=`<div class="tk">${i+1} OF ${STEPS.length}</div><h3>${s.t}</h3><p>${s.p}</p><div class="tr">${s.end?`<button class="ts" data-tskip>Keep exploring</button><a class="tn" href="./" data-tdone>Start my own</a>`:`<button class="ts" data-tskip>Skip</button><button class="tn" data-tnext>Next</button>`}</div>`;
    if(!c.isConnected)A.appendChild(c);
    c.querySelector('[data-tskip]').onclick=done;
    const n=c.querySelector('[data-tnext]');if(n)n.onclick=()=>{i++;show()};
    const d=c.querySelector('[data-tdone]');if(d)d.onclick=()=>{over=true;try{localStorage.setItem('gym.tourDone','1')}catch(e){}}};
  setTimeout(show,300);
})();
