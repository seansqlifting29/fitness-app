/* ===== going back: one rule for every screen =====
   Order: top sheet or popup, then menus, then the screen's own back button,
   then Analytics edit mode / Advanced, then other tabs go to Today.
   Triggers: on-screen buttons, the phone's back gesture or button, Escape,
   and swiping a sheet down. Only Today with nothing open lets you leave. */
(function(){
const overlays=()=>[...document.querySelectorAll('#app > .scrim, #app > .an-scrim, #app > .takeover')];
function closeOverlay(o){const b=o.querySelector('.sclose,[data-close]');if(b)b.click();else o.remove()}
function backAction(){
  const L=overlays();const o=L[L.length-1];
  if(o){
    if(o.classList.contains('xp')){// exercise picker: search, then muscle, then done
      const q=o.querySelector('#xq'),c=o.querySelector('[data-xclr]'),d=o.querySelector('.xdrill [data-xg]'),done=o.querySelector('[data-xdone]');
      if(q&&q.value&&c)return()=>c.click();if(d)return()=>d.click();if(done)return()=>done.click()}
    const bk=o.querySelector('[data-back]');if(bk)return()=>bk.click();
    return()=>closeOverlay(o)}
  if(document.querySelector('.fmenu')){const t=document.querySelector('[data-fmenu]');if(t)return()=>t.click()}
  const bk=document.querySelector('#app .back');if(bk)return()=>bk.click();
  if(typeof tab!=='undefined'&&tab==='stats'&&window.anCanBack&&window.anCanBack())return()=>window.anBack();
  const home=document.querySelector('[data-tab="today"]');
  if(typeof tab!=='undefined'&&tab!=='today'&&home)return()=>home.click();
  return null}
window.goBack=()=>{const a=backAction();if(!a)return false;a();return true};
window.canGoBack=()=>!!backAction();

// phone back gesture / browser back: keep one extra history entry while there is somewhere to go back to
const TOP=window.top===window&&!!(window.history&&history.pushState);let armed=false,skip=0,queued=false;
function sync(){queued=false;if(!TOP)return;const can=!!backAction();
  if(can&&!armed){history.pushState({fitBack:1},'');armed=true}
  else if(!can&&armed){armed=false;skip++;history.back()}}
const later=()=>{if(!queued){queued=true;requestAnimationFrame(sync)}};
window.addEventListener('popstate',()=>{if(skip){skip--;return}armed=false;goBack();later()});

// Escape closes or goes back
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&goBack())e.preventDefault()});

// swipe a sheet down from its handle to close it
let drag=null,eatClick=false;
document.addEventListener('pointerdown',e=>{const sh=e.target.closest&&e.target.closest('.scrim:not(.center):not(.xp) > .sheet, .an-sheet');if(!sh)return;
  const top=e.clientY-sh.getBoundingClientRect().top;const onGrab=e.target.closest('.grab,.an-grab');
  if(!onGrab&&(e.pointerType!=='mouse'||top>48||sh.scrollTop>0))return;
  drag={sh,y0:e.clientY,dy:0,id:e.pointerId}},{passive:true});
document.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;drag.dy=Math.max(0,e.clientY-drag.y0);
  if(drag.dy>6){drag.sh.style.transition='none';drag.sh.style.transform=`translateY(${drag.dy}px)`}},{passive:true});
const end=()=>{if(!drag)return;const{sh,dy}=drag;drag=null;sh.style.transition='transform .18s ease-out';
  if(dy>6){eatClick=true;setTimeout(()=>eatClick=false,350)}
  if(dy>90){sh.style.transform='translateY(110%)';const o=sh.closest('.scrim,.an-scrim');setTimeout(()=>{if(o&&o.isConnected)closeOverlay(o)},160)}
  else sh.style.transform=''};
document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end);
document.addEventListener('click',e=>{if(eatClick){eatClick=false;e.stopPropagation();e.preventDefault()}},true);

const start=()=>{const a=document.getElementById('app');if(!a)return setTimeout(start,60);
  new MutationObserver(later).observe(a,{childList:true,subtree:true});later()};
start();
})();
