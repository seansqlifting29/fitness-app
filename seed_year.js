/* ===== 1-year preview data (runs once, before the app loads) ===== */
window.DEMO_DATA=true;
(function(){
  try{if(localStorage.getItem('gym.demoSeeded4'))return}catch(e){return}
  const W=[ // Mon..Sun, mirrors the starter plan
    {name:'Push',ex:[['Incline Barbell Bench Press',3,10,62.5,90],['Chest Press Machine',3,10,55,75],['Pec Deck',3,12,40,60],['Tricep Pushdown',3,12,30,60]]},
    {name:'Pull',ex:[['Lat Pulldown',3,10,72.5,90],['Seated Cable Row',3,10,57.5,75],['Face Pull',3,15,22.5,60],['Hammer Curl',3,12,16,60]]},
    {name:'Legs',ex:[['Back Squat',3,8,100,120],['Romanian Deadlift',3,10,85,90],['Leg Extension',3,12,50,60],['Standing Calf Raise',3,15,70,45]]},
    null,
    {name:'Upper',ex:[['Dumbbell Bench Press',3,10,30,90],['Pull Up',3,8,0,90],['Dumbbell Shoulder Press',3,10,22,75],['Lateral Raise',3,15,10,45]]},
    {name:'Lower',ex:[['Deadlift',3,5,140,150],['Leg Press',3,12,160,90],['Walking Lunge',3,12,20,60],['Seated Leg Curl',3,12,45,60]]},
    null];
  // a year of training that follows the plan above; every set gets weight, reps,
  // time under tension and the rest taken before it, like the app records
  let seed=20251106;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const step=x=>x>=40?2.5:x>=10?1:.5;
  const fat=d=>d<18?.97+.03*d/18:d<=35?1:1-Math.pow((d-35)/60,1.4)*.15;
  const rec=rest=>1-.13*Math.exp(-(rest-30)/58);
  const dk=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  const today=new Date();today.setHours(0,0,0,0);
  const hist=[];let id=1,lastDay=null;const gain={};
  for(let ago=365;ago>=1;ago--){const d=new Date(today);d.setDate(d.getDate()-ago);const wdx=(d.getDay()+6)%7;const plan=W[wdx];if(!plan)continue;
    if(ago<=170&&ago>=156)continue; // two weeks away
    const m=d.getMonth(),dd=d.getDate();if(((m===11&&dd>=22)||(m===0&&dd<=2))&&rnd()<.7)continue;
    if(rnd()<.3)continue;
    const dayN=Math.round(d.getTime()/864e5);const gap=lastDay==null?3:dayN-lastDay;lastDay=dayN;
    const frac=(365-ago)/365;
    const pk=rnd();const hour=pk<.66?17.4+rnd()*3:pk<.86?6+rnd()*2.5:11+rnd()*4;const tod=hour<11?-.035:hour<17?.02:0;
    const gEff=gap===1?-.03:gap<=3?.012:gap<=6?0:-.045;
    const start=d.getTime()+Math.round(hour*60)*6e4;let t=start+Math.round((4+rnd()*5)*6e4);let TUT=0,REST=0,N=0,VOL=0;
    const ex=[];plan.ex.forEach(([name,ns,reps,w0,rt],ei)=>{if(ei===plan.ex.length-1&&rnd()<.08)return;
      if(ei>0)t+=Math.round((80+rnd()*160)*1e3);
      const g=gain[name]||(gain[name]=.08+rnd()*.08);const sets=[];
      if(!w0){ // bodyweight: reps climb over the year
        for(let i=0;i<ns;i++){const rest=i?Math.round(45+Math.pow(rnd(),.8)*150):null;if(rest){t+=rest*1e3;REST+=rest*1e3}const r=Math.max(2,Math.round(reps*(.75+.35*frac)-i*.7+(rnd()-.5)*1.6));const tut=Math.round(r*(2.2+rnd()*1.2)*1000);t+=tut;TUT+=tut;N++;sets.push({w:0,r,tut,rest:rest?rest*1000:null})}
        ex.push({name,sets});return}
      const oneRM0=w0*(1+reps/30);const oneRM=oneRM0*(1-g*.6)*(1+g*(1-Math.exp(-3*frac))/(1-Math.exp(-3)));
      const p=.6+rnd()*.28;const w=Math.max(step(w0),Math.round(oneRM*p/step(w0))*step(w0));const pw=w/oneRM;const T=2+rnd()*2.8;
      let carry=(1+tod)*(1+gEff)*(1+(rnd()-.5)*.025)*(1-.012*ei);
      for(let i=0;i<ns+(rnd()<.25?1:0);i++){let rest=null;if(i){rest=Math.round(45+Math.pow(rnd(),.8)*190);carry*=rec(rest)*(1+(rnd()-.5)*.02);t+=rest*1e3;REST+=rest*1e3}
        let tut=30*(1/pw-1)*T,r=1;for(let q=0;q<4;q++){r=Math.max(1,Math.round(30*(fat(tut)*carry/pw-1)));tut=r*T}
        tut=Math.round(tut*(.96+rnd()*.08)*1000);t+=tut;TUT+=tut;N++;VOL+=w*r;sets.push({w,r,tut,rest:rest==null?null:rest*1000})}
      ex.push({name,sets})});
    const end=t+Math.round(rnd()*3*6e4);
    hist.push({id:'s'+(id++),date:dk(d),start,split:plan.name,total:end-start,tut:TUT,rest:REST,sets:N,volume:Math.round(VOL),unit:'kg',ex})}
  const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  set('gym.me',{name:'Sean Tyndale'});set('gym.hist',hist);localStorage.removeItem('gym.blocks');
  // a full week for the preview, in the old day-by-day format the app migrates on load
  let n=1;const ex=(x)=>({id:'p'+(n++),name:x[0],sets:x[1],reps:x[2],w:x[3],rest:x[4]});
  set('gym.plan',W.map(d=>d?{name:d.name,ex:d.ex.map(ex)}:{name:'Rest',ex:[]}));set('gym.weekReset1',true);
  set('gym.cfg',{unit:'kg',sound:true});localStorage.setItem('gym.demoSeeded4','1');
})();
