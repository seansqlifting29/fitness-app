(function(){
/* ===== Analytics: Overview / Advanced, computed from your logged sets ===== */
(function(){const st=document.createElement('style');st.textContent=`
.an-hd{display:flex;align-items:flex-start;justify-content:space-between;padding:18px 20px 10px}
.an-hd h1{font-size:24px;font-weight:800;letter-spacing:-.5px;line-height:38px;display:flex;align-items:center;gap:10px}
.an-sample{white-space:nowrap;font-size:10.5px;font-weight:900;letter-spacing:.8px;color:var(--t3);border:1px solid #3a3a37;border-radius:8px;padding:3px 6px;cursor:pointer}
.an-editb{background:var(--card2);border-radius:14px;padding:8px 14px;font-weight:800;font-size:14px;color:var(--t2)}
.an-editb.on{background:var(--t1);color:#111}
.an-seg{display:flex;gap:4px;margin:0 14px 12px;background:var(--card);border-radius:16px;padding:4px}
.an-seg button{flex:1;padding:9px 0;border-radius:12px;font-weight:800;font-size:14px;color:var(--t3)}
.an-seg button.on{background:var(--t1);color:#111}
.an-exsel{display:flex;gap:6px;overflow-x:auto;padding:0 14px 12px;scrollbar-width:none}
.an-exsel::-webkit-scrollbar{display:none}
.an-exsel button{flex:none;border-radius:16px;padding:8px 13px;font-size:13.5px;font-weight:700;background:var(--card2);color:var(--t2);display:flex;align-items:center;gap:7px}
.an-exsel button i{width:9px;height:9px;border-radius:50%;border:1.5px solid #f0efec}
.an-exsel button.on{background:var(--t1);color:#111}
.an-exsel button.on i{border-color:#111}
.an-card{margin:0 14px 12px;border-radius:24px;padding:16px 14px 12px;position:relative;background:#1a1a19;border:1px solid #242423;cursor:pointer}
.an-card .an-bar{position:absolute;left:18px;right:18px;top:0;height:3px;border-radius:0 0 3px 3px}
.an-card .an-k{font-size:11.5px;font-weight:900;letter-spacing:1px}
.an-card h3{font-size:22px;font-weight:900;letter-spacing:-.5px;line-height:1.12;margin:4px 0 10px;padding-right:30px}
.an-card h3 span{opacity:.5}
.an-card h3 small,.wk-h small{display:block;font-size:14px;font-weight:700;color:var(--t3);letter-spacing:-.1px;margin-top:4px;line-height:1.3}
.an-card .an-more{position:absolute;z-index:3;right:14px;top:14px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:900;background:#2a2a28;color:var(--t2)}
.an-card .an-ctl{position:absolute;right:12px;top:12px;display:flex;gap:6px;z-index:3}
.an-card .an-ctl button{width:32px;height:32px;border-radius:50%;background:#2e2e2b;color:#fff;font-size:15px;font-weight:900}
.an-card.ed{animation:anwig .35s}
@keyframes anwig{0%{transform:rotate(0)}30%{transform:rotate(-.6deg)}60%{transform:rotate(.5deg)}100%{transform:none}}
.an-empty{font-size:14px;color:var(--t3);padding:20px 4px;text-align:center}
svg.ch{display:block;width:100%;height:auto;overflow:visible}
.ch text{font-family:Inter,system-ui,sans-serif}
.an-keys{display:flex;gap:12px;flex-wrap:wrap;padding:6px 4px 0;font-size:11.5px;font-weight:800;color:var(--t2)}
.an-keys span{display:flex;align-items:center;gap:5px}
.an-keys svg{width:13px;height:13px}
.an-segbar{display:flex;gap:3px;height:44px;margin:4px 0 10px}
.an-segbar div{height:100%;border-radius:6px;box-shadow:inset 0 0 0 1.5px #f0efec}
.an-seglab{display:flex;justify-content:space-between;gap:8px}
.an-seglab div{font-size:12px;color:var(--t3);font-weight:700}
.an-seglab b{display:block;font-size:18px;color:var(--t1);font-weight:900;letter-spacing:-.3px}
.an-seglab i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;border:1.5px solid #f0efec;vertical-align:-1px}
.an-axes{display:flex;gap:8px;margin:0 0 10px;flex-wrap:wrap}
.an-axes button{display:flex;align-items:center;gap:6px;background:var(--card2);border-radius:12px;padding:8px 11px;font-size:13px;font-weight:800;color:var(--t1)}
.an-axes button small{color:var(--t3);font-weight:800}
.an-addc{margin:0 14px 12px;width:calc(100% - 28px);border:2px dashed #3a3a37;border-radius:24px;padding:22px;display:flex;align-items:center;justify-content:center;gap:10px;font-weight:800;font-size:16px;color:var(--t2)}
.an-scrim{position:absolute;inset:0;background:rgba(0,0,0,.5);z-index:59;animation:anfade .15s}
@keyframes anfade{from{opacity:0}}
.an-sheet .sclose{position:sticky;float:right;top:0;margin:-4px -4px 0 8px}
.an-sheet{position:absolute;left:0;right:0;bottom:0;z-index:60;background:#1b1b1a;border-radius:26px 26px 0 0;padding:10px 18px 28px;max-height:82%;overflow:auto;animation:anup .22s ease-out;box-shadow:0 -10px 40px rgba(0,0,0,.5)}
@keyframes anup{from{transform:translateY(40px);opacity:0}}
.an-grab{width:38px;height:5px;border-radius:3px;background:#3a3a37;margin:0 auto 14px}
.an-sheet .an-k{font-size:12px;font-weight:900;letter-spacing:1px}
.an-sheet h3{font-size:22px;font-weight:900;letter-spacing:-.5px;line-height:1.18;margin:6px 0 12px}
.an-facts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
.an-facts div{background:var(--card2);border-radius:16px;padding:12px}
.an-facts b{display:block;font-size:22px;font-weight:900;letter-spacing:-.5px}
.an-facts small{font-size:12.5px;color:var(--t3);font-weight:600;line-height:1.3;display:block}
.an-sheet p{font-size:14.5px;color:var(--t2);line-height:1.45}
.an-sheet p+p{margin-top:8px}
.an-sheet .an-src{font-size:12.5px;color:var(--t3);margin-top:12px}
.an-opt{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:var(--card2);border-radius:18px;padding:12px;margin-bottom:8px}
.an-opt .an-sw{width:44px;height:44px;border-radius:14px;flex:none;display:grid;place-items:center;background:#1a1a19}
.an-opt .an-sw svg{width:30px;height:30px}
.an-opt b{display:block;font-size:15.5px}
.an-opt small{font-size:12.5px;color:var(--t3)}
.an-opt .an-st{margin-left:auto;font-size:12.5px;font-weight:800;color:var(--t3);flex:none}
.an-opt .an-st.add{background:var(--t1);color:#111;border-radius:12px;padding:6px 10px}
.an-opt.on{background:var(--t1);color:#111}.an-opt.on small{color:#55554f}
.an-tip{position:fixed;z-index:60;pointer-events:none;background:#f0efec;color:#111;border-radius:10px;padding:7px 10px;font-size:12.5px;font-weight:600;line-height:1.35;box-shadow:0 8px 24px rgba(0,0,0,.45);transform:translate(-50%,calc(-100% - 12px));white-space:nowrap;display:none}
.an-tip b{font-weight:800}

.an-hd,.an-seg,.an-exsel,.an-card,.an-addc,.an-nolift{flex-shrink:0}
.an-exsel button{line-height:1.25}
.an-exdd{padding:0 14px 12px;flex-shrink:0}
.an-exdd button{width:100%;display:flex;align-items:center;gap:8px;background:var(--card2);border-radius:16px;padding:11px 14px;text-align:left;min-width:0}
.an-exdd span{font-size:12px;font-weight:900;letter-spacing:.8px;color:var(--t3);text-transform:uppercase}
.an-exdd i{width:10px;height:10px;border-radius:50%;border:1.5px solid #f0efec;flex:none}
.an-exdd b{flex:1;min-width:0;font-size:15px;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.an-exdd em{font-style:normal;color:var(--t2);font-weight:800}
.an-rings{margin:0 14px 10px;display:grid;grid-template-columns:1fr 1fr;gap:10px;flex-shrink:0}
.an-ring{background:#1a1a19;border:1px solid #242423;border-radius:24px;padding:14px 10px 14px;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}
.an-ring svg{width:118px;height:118px;display:block}
.an-ring .an-rl{font-size:12px;font-weight:900;letter-spacing:1px}
.an-ring .an-rs{font-size:13px;color:#a9a89f;font-weight:700}
.an-cheer{margin:2px 18px 16px;font-size:16px;font-weight:800;color:var(--t1);flex-shrink:0}
.an-sec{margin:4px 18px 10px;font-size:12px;font-weight:900;letter-spacing:1px;color:#a9a89f;flex-shrink:0}
.an-ach{display:flex;gap:8px;overflow-x:auto;padding:0 14px 16px;scrollbar-width:none;flex-shrink:0}
.an-ach::-webkit-scrollbar{display:none}
.an-medal{flex:none;width:118px;background:#1a1a19;border:1px solid #242423;border-radius:20px;padding:12px 11px;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left}
.an-medal svg{width:38px;height:38px;margin-bottom:4px}
.an-medal b{font-size:14px;font-weight:800}
.an-medal .an-mv{font-size:20px;font-weight:900;letter-spacing:-.4px;color:var(--t1)}
.an-medal .an-pb2{width:100%;height:5px;border-radius:3px;background:#2a2a28;overflow:hidden;margin-top:4px}.an-medal .an-pb2 i{display:block;height:100%;border-radius:3px}
.an-medal small{font-size:12px;color:#a9a89f;font-weight:700;margin-top:2px}
.an-krow{display:flex;align-items:center;gap:8px;padding-right:30px}
.an-lp{display:flex;align-items:center;gap:6px;background:#262624;border-radius:12px;padding:5px 10px;font-size:12.5px;font-weight:800;color:var(--t1)}
.an-lp i{width:8px;height:8px;border-radius:50%;border:1.5px solid #f0efec}
.an-tier{display:flex;align-items:center;gap:12px;background:var(--card2);border-radius:16px;padding:10px 12px;margin-bottom:7px}
.an-tier svg{width:30px;height:30px;flex:none}.an-tier b{font-size:15px}.an-tier span{margin-left:auto;font-size:13px;font-weight:700;color:#a9a89f}
.an-tier.got span{color:var(--t1)}
.an-lock{background:#151514;border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:8px}
.an-lock b{font-size:15px}.an-why{font-size:13px;color:var(--t3);font-weight:600;margin:10px 2px 0;line-height:1.35}.an-lock .an-lk{width:14px;height:14px;margin-right:7px;vertical-align:-1px;color:#8a8980}.an-lock span{font-size:13px;color:#8a8980}
.an-lock .an-pb{height:6px;border-radius:3px;background:#2a2a28;overflow:hidden}.an-lock .an-pb i{display:block;height:100%;background:#f0efec;border-radius:3px}
.an-nolift{margin:0 14px 12px;background:#1a1a19;border-radius:24px;padding:22px;color:#8a8980;font-size:14px;line-height:1.45}
.an-nolift b{display:block;color:#f0efec;font-size:17px;margin-bottom:4px}
.an-hd h1{min-width:0}
@media (max-width:360px){.an-hd{padding:18px 14px 10px}.an-hd h1{font-size:21px;gap:6px}.an-sample{font-size:9px;padding:2px 4px;letter-spacing:.5px}}
`;document.head.appendChild(st)})();
const DAY=864e5;const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:NaN;
const e1rm=s=>s.w*(1+s.r/30);// Epley
const MONA=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
let HIST=[],SETS=[],LIFTS=[],LCOL={},NOW=Date.now(),SPAN_M=0,anKey='';
const CCOL='#c98500',CPAL=['#c98500','#3987e5','#d55181','#9085e9','#199e70','#e66767','#008300','#d95926'];
const PAL=['#3987e5','#d95926','#199e70','#c98500','#d55181','#9085e9','#e66767','#008300'];
const GCOL={Chest:'#3987e5',Back:'#d95926',Legs:'#199e70',Shoulders:'#c98500',Arms:'#d55181',Core:'#9085e9',Glutes:'#e66767'};
const monthIdx=t=>{const d=new Date(t),s=new Date(HIST[0].start);return (d.getFullYear()-s.getFullYear())*12+d.getMonth()-s.getMonth()};
const monthName=i=>{const s=new Date(HIST[0].start);const d=new Date(s.getFullYear(),s.getMonth()+i,1);return MONA[d.getMonth()]+(SPAN_M>=12&&(i===0||i===SPAN_M)?" '"+String(d.getFullYear()).slice(2):'')};
// rebuild the per-set table whenever history changes
function anRefresh(){const key=hist.length+':'+(hist.length?(hist[hist.length-1].id||'')+(hist[hist.length-1].start||''):'');if(key===anKey)return;anKey=key;
  HIST=hist.filter(h=>h&&Array.isArray(h.ex)&&h.ex.length).map(h=>{const st=h.start||fromKey(h.date).getTime()+12*36e5;return{start:st,end:st+(h.total||0),split:h.split,ex:h.ex,total:+h.total||0,tut:+h.tut||0,rest:+h.rest||0,warm:+h.warm||0,makeup:h.makeup||null,cardio:h.cardio&&+h.cardio.ms>0?{eq:h.cardio.eq||'Cardio',ms:+h.cardio.ms,plan:+h.cardio.plan||0}:null}}).sort((a,b)=>a.start-b.start);
  NOW=Math.max(Date.now(),HIST.length?HIST[HIST.length-1].end:0);SPAN_M=HIST.length?monthIdx(HIST[HIST.length-1].start):0;
  const rows=[];HIST.forEach((S,si)=>{const gapD=si?Math.round((new Date(S.start).setHours(0,0,0,0)-new Date(HIST[si-1].start).setHours(0,0,0,0))/DAY):null;const hour=new Date(S.start).getHours()+new Date(S.start).getMinutes()/60;
    S.ex.forEach(E=>(E.sets||[]).forEach((s,i)=>{if(!(s.r>0))return;const prev=i?E.sets[i-1]:null;rows.push({si,start:S.start,hour,gapD,ex:E.name,group:groupOf(E.name),set:i+1,w:+s.w||0,r:s.r,tut:(s.tut||0)/1000,rest:s.rest?s.rest/1000:null,
      pace:s.tut?s.tut/1000/s.r:null,e1:e1rm(s),prevR:prev?prev.r:null,prevW:prev?prev.w:null})}))});
  const by={};rows.forEach(r=>{(by[r.ex]=by[r.ex]||[]).push(r)});
  Object.values(by).forEach(L=>{L.sort((a,b)=>a.start-b.start);let lo=0,hi=0;L.forEach((r,i)=>{while(L[lo].start<r.start-21*DAY)lo++;while(hi<L.length-1&&L[hi+1].start<=r.start+21*DAY)hi++;let top=0;for(let k=lo;k<=hi;k++)top=Math.max(top,L[k].e1);r.rel=top?r.e1/top*100:100;r.load=top?r.w/top*100:0})});
  SETS=rows;const c={},sess={},top={};rows.forEach(r=>{if(r.w>0){c[r.ex]=(c[r.ex]||0)+1;(sess[r.ex]=sess[r.ex]||new Set()).add(r.si);top[r.ex]=Math.max(top[r.ex]||0,r.e1)}});
  // your main lifts first: logged in enough sessions, heaviest first
  LIFTS=Object.keys(c).filter(n=>c[n]>=6&&sess[n].size>=3).sort((a,b)=>top[b]-top[a]).slice(0,8);LCOL=Object.fromEntries(LIFTS.map((n,i)=>[n,PAL[i%8]]));
  if(!LIFTS.includes(ex))ex=LIFTS[0]||null}
let tab='overview',ex=S.get('gym.anEx',null),edit=false;
// chart lists per tab; older Overview/Strength/Deep layouts carry over
const lists=(()=>{const n=S.get('gym.charts2',null);if(n&&Array.isArray(n.overview)&&Array.isArray(n.advanced))return n;
  const o=S.get('gym.charts',null)||{};const uniq=a=>[...new Set(a)];
  const ov=Array.isArray(o.general)||Array.isArray(o.strength)?uniq([...(o.general||[]),...(o.strength||[])]):['consist','lifts','prog','rate','gymtime','split','cardio','muscle'];
  return{overview:ov,advanced:Array.isArray(o.deep)?o.deep:['tens','len','rest','custom:week:e1']}})();
const saveLists=()=>S.set('gym.charts2',lists);
// the cardio chart joins Overview once for people who set up their charts before it existed
if(!lists.overview.includes('cardio')&&!S.get('gym.cardioCard',false)){const i=lists.overview.indexOf('split');lists.overview.splice(i>=0?i+1:lists.overview.length,0,'cardio');S.set('gym.cardioCard',true);saveLists()}
function spearman(xs,ys){const rk=a=>{const idx=a.map((v,i)=>[v,i]).sort((p,q)=>p[0]-q[0]);const r=new Array(a.length);for(let i=0;i<idx.length;){let j=i;while(j+1<idx.length&&idx[j+1][0]===idx[i][0])j++;for(let k=i;k<=j;k++)r[idx[k][1]]=(i+j)/2;i=j+1}return r};
  const a=rk(xs),b=rk(ys),ma=avg(a),mb=avg(b);let n=0,da=0,db=0;for(let i=0;i<a.length;i++){n+=(a[i]-ma)*(b[i]-mb);da+=(a[i]-ma)**2;db+=(b[i]-mb)**2}return da&&db?n/Math.sqrt(da*db):0}
const linkWord=r=>{const a=Math.abs(r);return a<.1?'no clear':a<.3?'a weak':a<.5?'a moderate':'a strong'};
function bins(pts,x0,w,nb,minN=4){const out=[];for(let b=0;b<nb;b++){const a=x0+b*w;const ys=pts.filter(p=>p.x>=a&&p.x<a+w).map(p=>p.y);if(ys.length>=minN)out.push({x:a+w/2,lo:a,hi:a+w,y:avg(ys),n:ys.length})}return out}
function qbins(pts,nb=8,minN=4){const s=[...pts].sort((a,b)=>a.x-b.x);if(s.length<minN*2)return[];const size=Math.max(minN,Math.ceil(s.length/nb));const out=[];
  for(let i=0;i<s.length;i+=size){const g=s.slice(i,i+size);if(g.length<minN)break;out.push({x:avg(g.map(p=>p.x)),lo:g[0].x,hi:g[g.length-1].x,y:avg(g.map(p=>p.y)),n:g.length})}return out}
const mmss=v=>Math.floor(v/60)+':'+String(Math.round(v%60)).padStart(2,'0');
const hh=v=>{const h=Math.floor(v)%24;return (h%12||12)+(h<12?'am':'pm')};
const W=330;
let DRILLS=[];const regDrill=fn=>{DRILLS.push(fn);return 'd'+(DRILLS.length-1)};
const fmtDate=t=>{const d=new Date(t);return MONA[d.getMonth()]+' '+d.getDate()};const fmtDay=t=>['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(t).getDay()]+' '+fmtDate(t);
function slope(pts){const n=pts.length;if(n<2)return 0;const mx=avg(pts.map(p=>p.x)),my=avg(pts.map(p=>p.y));let a=0,b=0;pts.forEach(p=>{a+=(p.x-mx)*(p.y-my);b+=(p.x-mx)**2});return b?a/b:0}
// raw scatter of every set behind a summary chart, with the tapped group lit up
function rawDrill(title,acc,raw,inGroup,xfmt,yfmt,label){const pts=raw.map(r=>({x:r.x,y:r.y,col:inGroup(r)?acc:'#3a3a37',z:inGroup(r)?1:0,r0:r})).sort((a,b)=>a.z-b.z);const hit=raw.filter(inGroup);
  const top=[...hit].sort((a,b)=>b.y-a.y).slice(0,4);
  return{k:title,h:`${hit.length} sets ${label}`,chart:{series:[{noLine:true,r:3.2,ring:'#1a1a19',pts,tip:p=>`<b>${fmtDate(p.r0.t)}</b> · ${p.r0.w} kg × ${p.r0.r}<br>${xfmt(p.x)} · ${yfmt(p.y)}`}],xfmt,yfmt,ht:190},
    facts:[[yfmt(avg(hit.map(r=>r.y))),'average of these sets'],[yfmt(avg(raw.map(r=>r.y))),'average of all sets']],rows:top.map(r=>[fmtDay(r.t),`${r.w} kg × ${r.r} · ${xfmt(r.x)}`,yfmt(r.y)])}}
function mark(x,y,shape,col,r,ring='#f0efec'){const st=`stroke="${ring}" stroke-width="1.7"`;
  if(shape==='s')return `<rect x="${(x-r*.88).toFixed(1)}" y="${(y-r*.88).toFixed(1)}" width="${(r*1.76).toFixed(1)}" height="${(r*1.76).toFixed(1)}" rx="1.8" fill="${col}" ${st}/>`;
  if(shape==='t')return `<path d="M${x.toFixed(1)} ${(y-r*1.15).toFixed(1)}L${(x+r*1.05).toFixed(1)} ${(y+r*.82).toFixed(1)}L${(x-r*1.05).toFixed(1)} ${(y+r*.82).toFixed(1)}Z" fill="${col}" ${st} stroke-linejoin="round"/>`;
  return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${col}" ${st}/>`}
const nice=(lo,hi,n=3)=>{const span=hi-lo||1;const st=Math.pow(10,Math.floor(Math.log10(span/n)));const m=[1,2,2.5,5,10].find(k=>span/(k*st)<=n+1)*st;const a=Math.floor(lo/m)*m,b=Math.ceil(hi/m)*m;const t=[];for(let v=a;v<=b+1e-9;v+=m)t.push(+v.toFixed(6));return t};
function chart(c,accent){const pad={l:32,r:10,t:16,b:22},h=c.ht||170;
  const allY=c.series.flatMap(S=>S.pts.map(p=>p.y)),allX=c.series.flatMap(S=>S.pts.map(p=>p.x));if(!allY.length)return `<div class="an-empty">Not enough sets yet for this one.</div>`;
  const yt=c.yt||nice(Math.min(...allY),Math.max(...allY));pad.l=Math.max(26,Math.max(...yt.map(v=>String(c.yfmt(v)).length))*6.3+10);const xr=c.xr||[Math.min(...allX),Math.max(...allX)];const yr=[yt[0],yt[yt.length-1]];
  const X=v=>pad.l+(v-xr[0])/((xr[1]-xr[0])||1)*(W-pad.l-pad.r),Y=v=>pad.t+(1-(v-yr[0])/((yr[1]-yr[0])||1))*(h-pad.t-pad.b);
  let o=`<svg class="ch" viewBox="0 0 ${W} ${h}"><defs><filter id="gl" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="3"/></filter></defs>`;
  if(c.band){const b0=Math.max(pad.l,X(c.band[0])),b1=Math.min(W-pad.r,X(c.band[1]));if(b1>b0)o+=`<rect x="${b0}" y="${pad.t}" width="${Math.max(6,b1-b0)}" height="${h-pad.t-pad.b}" rx="10" fill="rgba(240,239,236,.06)"/>`}
  yt.forEach(v=>o+=`<line x1="${pad.l}" x2="${W-pad.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="#262624"/><text x="${pad.l-6}" y="${Y(v)+3.5}" text-anchor="end" font-size="10" font-weight="600" fill="#8a8980">${c.yfmt(v)}</text>`);
  (c.xt||nice(xr[0],xr[1],4).filter(v=>v>=xr[0]&&v<=xr[1])).forEach(v=>o+=xLab(X(v),h,c.xfmt(v)));
  c.series.forEach(S=>{const col=S.col||accent;
    if(S.pts.length>1&&!S.noLine)o+=`<path d="${S.pts.map((p,k)=>(k?'L':'M')+X(p.x).toFixed(1)+' '+Y(p.y).toFixed(1)).join('')}" fill="none" stroke="rgba(240,239,236,.8)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" ${S.dash?'stroke-dasharray="3 4"':''}/>`;
    S.pts.forEach(p=>{const isC=(c.crit||[]).some(q=>q.p===p);if(isC)o+=`<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="9" fill="${col}" opacity=".3" filter="url(#gl)"/>`;o+=mark(X(p.x),Y(p.y),S.shape||'c',p.col||col,isC?6.8:(S.r||5),S.ring||'#f0efec')})});
  (c.crit||[]).forEach(q=>{const x=X(q.p.x),y=Y(q.p.y);const w=q.label.length*6.4+16;const lx=Math.min(W-pad.r-w/2,Math.max(pad.l+w/2,x));const ly=Math.max(10,y-15<pad.t+6?y+24:y-17);
    o+=`<rect x="${lx-w/2}" y="${ly-10}" width="${w}" height="18" rx="9" fill="#f0efec"/><text x="${lx}" y="${ly+3}" text-anchor="middle" font-size="10.5" font-weight="900" fill="#0e0e0e">${q.label}</text>`});
  c.series.forEach((S,si)=>S.pts.forEach((p,pi)=>{if(!S.tip)return;const dk=S.drill?regDrill(()=>S.drill(p,pi)):'';o+=`<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="${S.r&&S.r<4?7:13}" fill="transparent" data-tip="${S.tip(p)}${dk?'<br><small>Tap to see the sets</small>':''}" ${dk?`data-drill="${dk}"`:''}/>`}));
  o+='</svg>';
  if(c.series.length>1&&!c.nokeys)o+=`<div class="an-keys">${c.series.map(S=>`<span><svg viewBox="-7 -7 14 14">${mark(0,0,S.shape||'c',S.col||accent,4.4)}</svg>${S.name}</span>`).join('')}</div>`;
  return o}


function monthlyBest(n){const mo={};SETS.filter(r=>r.ex===n).forEach(r=>{const m=monthIdx(r.start);if(!mo[m]||r.e1>mo[m].y)mo[m]={x:m,y:r.e1,r}});return Object.values(mo).sort((a,b)=>a.x-b.x)}
function atWeight(w){const R=exT().filter(r=>r.w===w);const t0=HIST[0].start;const pts=R.map(r=>({x:(r.start-t0)/DAY/30.4,y:r.tut,r}));const b=pts.reduce((a,c)=>c.y>a.y?c:a,pts[0]);
  return{k:ex.toUpperCase()+' · '+w+' '+U().toUpperCase(),h:`${R.length} sets at ${w} ${U()}`,chart:{series:[{noLine:true,pts,col:LCOL[ex],tip:p=>`<b>${fmtDay(p.r.start)}</b> · set ${p.r.set}<br>${w} ${U()} × ${p.r.r} · ${Math.round(p.y)}s`}],xfmt:v=>monthName(Math.round(v)),yfmt:v=>v+'s',ht:160,crit:[{p:b,label:'Longest'}]},
    facts:[[Math.round(b.y)+'s','longest, '+fmtDate(b.r.start)],[Math.round(avg(R.map(r=>r.tut)))+'s','average set']],p:['Every set you\'ve done at this weight, by date and time under tension.']}}
function liftHistory(n){const pts=monthlyBest(n);const f=pts[0],l=pts[pts.length-1];const rate=slope(pts);
  return{k:n.toUpperCase(),h:`${f.y.toFixed(1)} → ${l.y.toFixed(1)} ${U()}`,acc:LCOL[n],chart:{series:[{col:LCOL[n],pts,tip:p=>`<b>${monthName(p.x)}</b><br>${p.r.w} ${U()} × ${p.r.r} ≈ ${p.y.toFixed(1)} ${U()}`}],xr:[f.x,l.x],xt:[f.x,Math.round((f.x+l.x)/2),l.x],xfmt:i=>monthName(i),yfmt:v=>v%1?v.toFixed(1):v,ht:160,crit:[{p:f,label:'Start'},{p:l,label:'Now'}]},
    facts:[[(rate>=0?'+':'')+rate.toFixed(1)+' '+U(),'a month on average'],[(l.y-f.y>=0?'+':'')+(l.y-f.y).toFixed(1)+' '+U(),'first month to last']],p:['Each point is the best set that month as an Epley one-rep max.']}}

const S1='#3987e5',S2='#d95926',S3='#199e70';
const exSets=()=>SETS.filter(r=>r.ex===ex);const exT=()=>exSets().filter(r=>r.tut>0);
const CARDS={
  consist:{tab:'overview',name:'Consistency',desc:'Sessions each week, last 12 weeks',hex:'#199e70',make(){
    const wk=[];for(let w=11;w>=0;w--){const a=NOW-7*DAY*(w+1),b=NOW-7*DAY*w;wk.push({x:11-w,y:HIST.filter(S=>S.start>a&&S.start<=b).length})}
    const av=avg(wk.map(p=>p.y));const best=wk.reduce((a,b)=>b.y>a.y?b:a,wk[0]);let run=0,longest=0;wk.forEach(p=>{run=p.y>=3?run+1:0;longest=Math.max(longest,run)});
    return{k:'CONSISTENCY',h:`${av.toFixed(1)} a week`,ht:140,series:[{pts:wk,tip:p=>`<b>${p.x===11?'This week':(11-p.x)+' weeks ago'}</b><br>${p.y} session${p.y===1?'':'s'}`,drill:p=>{const w=11-p.x,a=NOW-7*DAY*(w+1),b=NOW-7*DAY*w;const ss=HIST.filter(S=>S.start>a&&S.start<=b);
      return{k:'CONSISTENCY',h:`${p.x===11?'This week':(11-p.x)+' weeks ago'}: ${ss.length} session${ss.length===1?'':'s'}`,rows:ss.map(S=>[fmtDay(S.start),S.split,Math.round((S.end-S.start)/6e4)+' min'])}}}],
      xr:[0,11],yt:[0,Math.max(4,best.y)],xt:[0,3,6,9,11],xfmt:i=>i===11?'Now':'-'+(11-i)+'w',yfmt:v=>v,crit:[{p:best,label:best.y+' sessions'}],
      ins:{h:`You've averaged ${av.toFixed(1)} sessions a week over the last 12 weeks.`,facts:[[wk.filter(p=>p.y>=3).length+'/12','weeks with 3 or more sessions'],[longest+' wk','longest run of 3+ a week']],p:['Each point is one week, counted Monday to Sunday back from your latest session.'],n:wk.reduce((a,p)=>a+p.y,0)+' sessions'}}}},
  cardio:{tab:'overview',name:'Cardio',desc:'Minutes after your lifts each week, last 12 weeks',hex:CCOL,make(){
    const wk=[];for(let w=11;w>=0;w--){const a=NOW-7*DAY*(w+1),b=NOW-7*DAY*w;const ss=HIST.filter(S=>S.start>a&&S.start<=b&&S.cardio);wk.push({x:11-w,y:Math.round(ss.reduce((t,S)=>t+S.cardio.ms,0)/6e4),ss})}
    const all=wk.flatMap(p=>p.ss);const av=avg(wk.map(p=>p.y));const best=wk.reduce((a,b)=>b.y>a.y?b:a,wk[0]);
    const planned=all.filter(S=>S.cardio.plan>0);const kept=planned.filter(S=>S.cardio.ms>=S.cardio.plan*.95).length;
    const by={};all.forEach(S=>{by[S.cardio.eq]=(by[S.cardio.eq]||0)+S.cardio.ms});const top=Object.entries(by).sort((a,b)=>b[1]-a[1])[0];
    const wkName=x=>x===11?'This week':(11-x)+' weeks ago';
    return{k:'CARDIO',h:`${Math.round(av)} min a week`,ht:140,series:[{pts:wk,tip:p=>`<b>${wkName(p.x)}</b><br>${p.y} min · ${p.ss.length} session${p.ss.length===1?'':'s'}`,drill:p=>({k:'CARDIO',h:`${wkName(p.x)}: ${p.y} min`,rows:p.ss.map(S=>[fmtDay(S.start),S.cardio.eq,Math.round(S.cardio.ms/6e4)+(S.cardio.plan?' of '+Math.round(S.cardio.plan/6e4):'')+' min'])})}],
      xr:[0,11],yt:[0,Math.max(20,best.y)],xt:[0,3,6,9,11],xfmt:i=>i===11?'Now':'-'+(11-i)+'w',yfmt:v=>v,crit:best.y?[{p:best,label:best.y+' min'}]:[],
      ins:{h:`You've averaged ${Math.round(av)} minutes of cardio a week over the last 12 weeks.`,facts:[[wk.filter(p=>p.y>0).length+'/12','weeks with cardio'],[planned.length?pct(kept,planned.length)+'%':'–','of sessions you did the full time'],[top?Math.round(top[1]/6e4)+' min':'–',top?'on the '+top[0].toLowerCase()+', your most used':'']],p:['Cardio is timed from Start to Done on the cardio page after your lifts. Each point is one week, counted back from your latest session.'],n:all.length+' cardio sessions'}}}},
  gymtime:{tab:'overview',name:'Gym time',desc:'Average session length each month',hex:'#3987e5',make(){
    const mo={};HIST.forEach(S=>{const m=monthIdx(S.start);(mo[m]=mo[m]||[]).push((S.end-S.start)/6e4)});const pts=Object.entries(mo).map(([m,a])=>({x:+m,y:avg(a),n:a.length})).sort((a,b)=>a.x-b.x);
    const f=pts[0],l=pts[pts.length-1];const fast=pts.reduce((a,b)=>b.y<a.y?b:a,pts[0]);const d=Math.round(f.y-l.y);
    return{k:'GYM TIME',h:`${Math.round(l.y)} min ${d?`<span>${d>0?'↓':'↑'}${Math.abs(d)} since ${monthName(f.x)}</span>`:''}`,ht:130,series:[{pts,tip:p=>`<b>${monthName(p.x)}</b><br>${Math.round(p.y)} min average · ${p.n} sessions`,drill:p=>{const ss=HIST.filter(S=>monthIdx(S.start)===p.x);const q=ss.map(S=>({x:new Date(S.start).getDate(),y:(S.end-S.start)/6e4,S}));const sh=q.reduce((a,b)=>b.y<a.y?b:a,q[0]);
      return{k:'GYM TIME',h:`${monthName(p.x)}: ${ss.length} sessions`,chart:{series:[{noLine:true,pts:q,tip:t=>`<b>${fmtDay(t.S.start)}</b> · ${t.S.split}<br>${Math.round(t.y)} min`}],xr:[1,31],xt:[1,10,20,31],xfmt:v=>v,yfmt:v=>v+'m',ht:150,crit:[{p:sh,label:'Shortest'}]},facts:[[Math.round(p.y)+' min','average'],[Math.round(sh.y)+' min','shortest, '+fmtDate(sh.S.start)]]}}}],
      xr:[f.x,l.x],xt:[f.x,Math.round((f.x+l.x)/2),l.x],xfmt:i=>monthName(i),yfmt:v=>v,crit:[{p:fast,label:'Shortest'}],
      ins:{h:`Your sessions averaged ${Math.round(l.y)} minutes in ${monthName(l.x)}, ${d===0?'the same as':(Math.abs(d)+(Math.abs(d)===1?' minute ':' minutes ')+(d>0?'shorter':'longer')+' than')} in ${monthName(f.x)}.`,facts:[[Math.round(fast.y)+' min',monthName(fast.x)+', your shortest month'],[Math.round(avg(HIST.map(S=>(S.end-S.start)/6e4)))+' min','average over the year']],p:['Session length runs from when you start your first set timer to when you finish.'],n:HIST.length+' sessions'}}}},
  split:{tab:'overview',name:'Where time goes',desc:'Lifting, resting and everything else',hex:'#d95926',make(){
    const r=HIST.slice(-12);const per=r.map(S=>{const all=S.ex.flatMap(E=>E.sets);const lift=all.reduce((a,s)=>a+s.tut,0)/6e4,rest=all.reduce((a,s)=>a+(s.rest||0),0)/6e4,tot=(S.end-S.start)/6e4,cardio=S.cardio?S.cardio.ms/6e4:0;return{lift,rest,cardio,other:Math.max(0,tot-lift-rest-cardio),tot}});
    const L=avg(per.map(p=>p.lift)),R=avg(per.map(p=>p.rest)),CA=avg(per.map(p=>p.cardio)),O=avg(per.map(p=>p.other)),T=L+R+CA+O;const parts=[['Lifting','#199e70',L],['Resting','#d95926',R],['Other','#3987e5',O]];if(CA>0)parts.push(['Cardio',CCOL,CA]);
    return{k:'WHERE TIME GOES',h:`${Math.round(R/T*100)}% resting`,custom:`<div class="an-segbar">${parts.map(([n,c,v])=>`<div style="flex:${v};background:${c}" data-tip="<b>${n}</b><br>${v.toFixed(1)} min a session · ${Math.round(v/T*100)}%<br><small>Tap to see each session</small>" data-drill="${regDrill(()=>({k:'WHERE TIME GOES',h:'Your last 12 sessions',html:`<div style=\"display:flex;flex-direction:column;gap:7px;margin-bottom:12px\">${r.map((S,i)=>{const q=per[i];return `<div style=\"display:flex;align-items:center;gap:10px\"><span style=\"width:84px;font-size:12px;font-weight:700;color:#8a8980\">${fmtDate(S.start)}</span><div style=\"flex:1;display:flex;gap:2px;height:16px\">${[[q.lift,'#199e70'],[q.rest,'#d95926'],[q.other,'#3987e5'],[q.cardio,CCOL]].map(([v,c])=>`<div style=\"flex:${v};background:${c};border-radius:3px\"></div>`).join('')}</div><span style=\"width:44px;text-align:right;font-size:12px;font-weight:800\">${Math.round(q.tot)}m</span></div>`}).join('')}</div>`}))}"></div>`).join('')}</div>
      <div class="an-seglab">${parts.map(([n,c,v])=>`<div><i style="background:${c}"></i>${n}<b>${Math.round(v)} min</b></div>`).join('')}</div>`,
      ins:{h:`For every minute under tension you rested ${(R/L).toFixed(1)} minutes.`,facts:[[L.toFixed(1)+' min','lifting a session'],[R.toFixed(1)+' min','resting between sets']],p:['Lifting is time under tension from the set timer. Resting is the rest timer between sets. Other is warming up, moving between stations and setting up. Cardio is the cardio timer after your lifts.'],n:'last 12 sessions'}}}},
  prog:{tab:'overview',perLift:1,name:'Estimated max',desc:'Your best set each month, as a one-rep max',hex:null,make(){
    const rows=exSets();const mo={};rows.forEach(r=>{const m=monthIdx(r.start);mo[m]=Math.max(mo[m]||0,r.e1)});const pts=Object.entries(mo).map(([m,y])=>({x:+m,y})).sort((a,b)=>a.x-b.x);
    let run=0,prs=0;const bySess={};rows.forEach(r=>bySess[r.si]=Math.max(bySess[r.si]||0,r.e1));Object.keys(bySess).sort((a,b)=>a-b).forEach(k=>{if(bySess[k]>run){if(run)prs++;run=bySess[k]}});
    const best=pts.reduce((a,b)=>b.y>a.y?b:a,pts[0]);const f=pts[0],l=pts[pts.length-1];
    return{k:'ESTIMATED MAX',h:`${l.y.toFixed(1)} ${U()} <span>${l.y>=f.y?'↑':'↓'}${Math.abs((l.y/f.y-1)*100).toFixed(0)}%</span>`,ht:140,series:[{pts,tip:p=>`<b>${monthName(p.x)}</b><br>best set ≈ ${p.y.toFixed(1)} ${U()} one-rep max`,drill:p=>{const rr=rows.filter(r=>monthIdx(r.start)===p.x);const by={};rr.forEach(r=>{if(!by[r.si]||r.e1>by[r.si].e1)by[r.si]=r});const q=Object.values(by).map(r=>({x:new Date(r.start).getDate(),y:r.e1,r}));const b=q.reduce((a,c)=>c.y>a.y?c:a,q[0]);
      return{k:ex.toUpperCase(),h:`${monthName(p.x)}: ${q.length} sessions`,chart:{series:[{pts:q,tip:t=>`<b>${fmtDay(t.r.start)}</b><br>${t.r.w} ${U()} × ${t.r.r} ≈ ${t.y.toFixed(1)} ${U()}`}],xr:[1,31],xt:[1,10,20,31],xfmt:v=>v,yfmt:v=>Math.round(v),ht:150,crit:[{p:b,label:'Best'}]},rows:q.sort((a,c)=>a.r.start-c.r.start).map(t=>[fmtDay(t.r.start),`${t.r.w} ${U()} × ${t.r.r}`,t.y.toFixed(1)+' '+U()])}}}],
      xr:[f.x,l.x],xt:[f.x,Math.round((f.x+l.x)/2),l.x],xfmt:i=>monthName(i),yfmt:v=>Math.round(v),crit:[{p:best,label:'PR'}],
      ins:{h:`Your best ${ex} set this month works out to about ${l.y.toFixed(1)} ${U()} for one rep, ${l.y>=f.y?'up':'down'} ${Math.abs(l.y-f.y).toFixed(1)} ${U()} from ${monthName(f.x)}.`,facts:[[best.y.toFixed(1)+' '+U(),'highest, in '+monthName(best.x)],[prs,'times you beat your previous best']],p:['Each point is your strongest set that month, turned into a one-rep max with the Epley formula (weight × (1 + reps ÷ 30)).'],n:rows.length+' sets of '+ex}}}},
  rate:{tab:'overview',perLift:1,name:'Rate of gain',desc:'How many kg a month you\'re adding, and whether it\'s slowing',hex:'#199e70',make(){
    const mb=monthlyBest(ex);const pts=[];for(let i=2;i<mb.length;i++){const w=mb.slice(i-2,i+1);pts.push({x:mb[i].x,y:slope(w),w})}
    if(pts.length<2)return{k:'RATE OF GAIN',h:'Rate of gain',series:[]};const l=pts[pts.length-1],f=pts[0];const overall=slope(mb);const fast=pts.reduce((a,b)=>b.y>a.y?b:a,pts[0]);
    const trend=l.y<overall-.25?'slowing':l.y>overall+.25?'speeding up':'steady';
    return{k:'RATE OF GAIN',h:`${l.y>=0?'+':''}${l.y.toFixed(1)} ${U()} a month <span>${trend}</span>`,ht:150,series:[{col:'#199e70',pts,tip:p=>`<b>3 months to ${monthName(p.x)}</b><br>${p.y>=0?'+':''}${p.y.toFixed(1)} ${U()} a month`,drill:p=>({k:'RATE OF GAIN',h:`${monthName(p.w[0].x)} to ${monthName(p.x)}: ${p.y>=0?'+':''}${p.y.toFixed(1)} ${U()} a month`,chart:{series:[{col:LCOL[ex],pts:p.w,tip:q=>`<b>${monthName(q.x)}</b><br>${q.r.w} ${U()} × ${q.r.r} ≈ ${q.y.toFixed(1)} ${U()}`}],xr:[p.w[0].x-.3,p.w[2].x+.3],xt:p.w.map(q=>q.x),xfmt:i=>monthName(Math.round(i)),yfmt:v=>v%1?v.toFixed(1):v,ht:140},p:['The rate is the slope of a straight line through these three monthly bests.']})}],
      xr:[f.x,l.x],xt:[f.x,Math.round((f.x+l.x)/2),l.x],xfmt:i=>monthName(i),yfmt:v=>(v>0?'+':'')+v.toFixed(1),crit:[{p:fast,label:'Fastest'}],
      ins:{h:`Over the last 3 months your ${ex} gained ${l.y.toFixed(1)} ${U()} a month, ${trend==='steady'?'about the same as':trend==='slowing'?'slower than':'faster than'} your year average of ${overall.toFixed(1)}.`,facts:[[(fast.y>=0?'+':'')+fast.y.toFixed(1)+' '+U(),`a month, your fastest stretch (to ${monthName(fast.x)})`],[(overall>=0?'+':'')+overall.toFixed(1)+' '+U(),'a month across the year']],
        p:['Each point is the slope through that month\'s best set and the two months before it, in kg of estimated one-rep max per month. Tap a point to see the three months behind it.'],n:mb.length+' monthly bests of '+ex}}}},
  lifts:{tab:'overview',name:'Lift progress',desc:'Every lift, first month against last month',hex:'#c98500',make(){
    const rows=LIFTS.map(n=>{const R=SETS.filter(r=>r.ex===n);const t0=R[0].start,t1=R[R.length-1].start;const a=Math.max(...R.filter(r=>r.start<t0+30*DAY).map(r=>r.e1)),b=Math.max(...R.filter(r=>r.start>t1-30*DAY).map(r=>r.e1));return{n,a,b,g:(b/a-1)*100}});
    const top=rows.reduce((x,y)=>y.g>x.g?y:x,rows[0]);const up=rows.filter(r=>r.g>0).length;rows.sort((a,b)=>b.g-a.g);
    const short=n=>{let t=n.replace('Romanian Deadlift','Romanian DL');if(t.length>16)t=t.replace(/Barbell/g,'BB').replace(/Dumbbell/g,'DB').replace(/^(Standing|Seated|Lying) /,'');return t.length>18?t.slice(0,17)+'…':t};
    const gmin=Math.min(0,...rows.map(r=>r.g)),gmax=Math.max(...rows.map(r=>r.g));const ticks=nice(gmin,gmax,3);const lo=ticks[0],hi=ticks[ticks.length-1];
    const H=rows.length*30+24,pl=112,pr=40,X=v=>pl+(v-lo)/(hi-lo)*(W-pl-pr);let o=`<svg class="ch" viewBox="0 0 ${W} ${H}">`;
    ticks.forEach(v=>o+=`<line x1="${X(v)}" x2="${X(v)}" y1="4" y2="${H-18}" stroke="#262624"/><text x="${X(v)}" y="${H-4}" text-anchor="middle" font-size="10" font-weight="600" fill="#8a8980">${v}%</text>`);
    rows.forEach((r,k)=>{const y=14+k*30;o+=`<text x="0" y="${y+4}" font-size="12" font-weight="800" fill="#c3c2b7">${short(r.n)}</text><line x1="${X(0)}" x2="${X(r.g)}" y1="${y}" y2="${y}" stroke="rgba(240,239,236,.6)" stroke-width="1.4"/>`+mark(X(r.g),y,'c',LCOL[r.n],r===top?6.8:5.2);
      o+=`<text x="${X(r.g)+(r===top?12:10)}" y="${y+4}" font-size="11" font-weight="${r===top?900:700}" fill="${r===top?'#f0efec':'#8a8980'}">${(r.g>=0?'+':'')+r.g.toFixed(0)}%</text>`;
      const dk=regDrill(()=>liftHistory(r.n));o+=`<circle cx="${X(r.g)}" cy="${y}" r="14" fill="transparent" data-tip="<b>${r.n}</b><br>${r.a.toFixed(1)} → ${r.b.toFixed(1)} ${U()} one-rep max<br><small>Tap for its full history</small>" data-drill="${dk}"/><rect x="0" y="${y-12}" width="${pl-6}" height="24" fill="transparent" data-drill="${dk}" style="cursor:pointer"/>`});
    o+='</svg>';
    return{k:'LIFT PROGRESS',h:`${top.n} ${top.g>=0?'up':'down'} ${Math.abs(top.g).toFixed(0)}%`,custom:o,
      ins:{h:`${up} of ${rows.length} lifts are stronger than in your first month. ${top.n} gained the most.`,facts:[[(top.g>=0?'+':'')+top.g.toFixed(1)+'%',top.n],[(slope(monthlyBest(top.n))>=0?'+':'')+slope(monthlyBest(top.n)).toFixed(1)+' '+U(),`a month on ${top.n}`]],p:['Each line is the change in your best set from your first 30 days to your last 30, both as Epley one-rep maxes. Tap a point for the kilos.'],n:LIFTS.length+' main lifts'}}}},
  muscle:{tab:'overview',name:'Weekly sets',desc:'Sets per muscle each week, last 4 weeks',hex:'#d55181',make(){
    const R=SETS.filter(r=>r.start>NOW-28*DAY);const c={};R.forEach(r=>c[r.group]=(c[r.group]||0)+1);const seen=new Set(SETS.map(r=>r.group));const M=Object.keys(GCOL).filter(g=>seen.has(g)).map(g=>[g,(c[g]||0)/4]);const low=M.reduce((a,b)=>b[1]<a[1]?b:a,M[0]);
    const mx=Math.max(24,...M.map(m=>m[1]));const H=M.length*30+22,pl=78,pr=14,X=v=>pl+v/mx*(W-pl-pr);
    let o=`<svg class="ch" viewBox="0 0 ${W} ${H}"><rect x="${X(10)}" y="2" width="${X(20)-X(10)}" height="${H-20}" rx="8" fill="rgba(240,239,236,.06)"/>`;
    [0,10,20].forEach(v=>o+=`<text x="${X(v)}" y="${H-4}" text-anchor="middle" font-size="10" font-weight="600" fill="#8a8980">${v}</text>`);
    M.forEach(([n,v],k)=>{const y=14+k*30;o+=`<text x="0" y="${y+4}" font-size="12.5" font-weight="800" fill="#c3c2b7">${n}</text><line x1="${X(0)}" x2="${X(v)}" y1="${y}" y2="${y}" stroke="rgba(240,239,236,.35)" stroke-width="1.4"/>`+mark(X(v),y,'c',GCOL[n],n===low[0]?6.8:5.2);
      if(n===low[0])o+=`<rect x="${X(v)+12}" y="${y-9}" width="34" height="18" rx="9" fill="#f0efec"/><text x="${X(v)+29}" y="${y+4}" text-anchor="middle" font-size="10.5" font-weight="900" fill="#0e0e0e">Low</text>`;
      o+=`<circle cx="${X(v)}" cy="${y}" r="13" fill="transparent" data-tip="<b>${n}</b><br>${v.toFixed(1)} sets a week<br><small>Tap to see which exercises</small>" data-drill="${regDrill(()=>{const by={};R.filter(r=>r.group===n).forEach(r=>by[r.ex]=(by[r.ex]||0)+1);return{k:'WEEKLY SETS',h:`${n}: ${v.toFixed(1)} sets a week`,rows:Object.entries(by).sort((a,b)=>b[1]-a[1]).map(([e,c])=>[e,c+' sets in 4 weeks',(c/4).toFixed(1)+' a week'])}})}"/>`});
    const under=M.filter(m=>m[1]<10).map(m=>m[0]);
    return{k:'WEEKLY SETS',h:`${low[0]}: ${low[1].toFixed(1)} a week`,custom:o+'</svg>',
      ins:{h:under.length===M.length?'Every muscle is under 10 sets a week.':under.length?`${under.join(', ')} ${under.length>1?'are':'is'} under 10 sets a week.`:'Every muscle gets 10 or more sets a week.',facts:M.slice().sort((a,b)=>b[1]-a[1]).slice(0,2).map(m=>[m[1].toFixed(1),m[0]+' sets a week']),p:['Counted from every logged set in the last 4 weeks, grouped by the muscle each exercise mainly works. The shaded band marks 10 to 20 sets a week, a common target range.'],n:R.length+' sets'}}}},
  tens:{tab:'advanced',perLift:1,name:'Holding heavy',desc:'How long you can hold each weight, now vs early on',hex:'#c98500',make(){
    const R=exT();const t0=R[0].start,t1=R[R.length-1].start,span=t1-t0;
    const edge=xs=>{const by={};xs.forEach(r=>{if(!by[r.w]||r.tut>by[r.w])by[r.w]=r.tut});let mx=-1;return Object.entries(by).map(([w,t])=>({x:t,y:+w})).sort((a,b)=>b.y-a.y).filter(p=>{if(p.x>mx){mx=p.x;return true}return false}).sort((a,b)=>a.y-b.y)};
    const a=edge(R.filter(r=>r.start<t0+span*.33)),b=edge(R.filter(r=>r.start>t1-span*.33));
    const common=b.map(p=>{const q=R.filter(r=>r.start<t0+span*.33&&r.w===p.y);return q.length?{p,then:Math.max(...q.map(r=>r.tut))}:null}).filter(Boolean).sort((x,y)=>y.p.y-x.p.y);const g=common[0];
    return{k:'TIME UNDER TENSION',h:g?`${g.p.y} ${U()}: ${Math.round(g.then)}s → ${Math.round(g.p.x)}s`:'Holding heavy',ht:180,series:[{name:'Early on',col:S2,shape:'s',dash:true,pts:a,tip:p=>`<b>Early on</b> · ${p.y} ${U()}<br>held up to ${Math.round(p.x)}s`,drill:p=>atWeight(p.y)},{name:'Lately',col:S1,pts:b,tip:p=>`<b>Lately</b> · ${p.y} ${U()}<br>held up to ${Math.round(p.x)}s`,drill:p=>atWeight(p.y)}],
      xfmt:v=>v+'s',yfmt:v=>Math.round(v),crit:g?[{p:g.p,label:(g.p.x-g.then>=0?'+':'')+Math.round(g.p.x-g.then)+'s'}]:[],
      ins:{h:g?`At ${g.p.y} ${U()} you've lately held a set for up to ${Math.round(g.p.x)}s, against ${Math.round(g.then)}s early on.`:'Not enough repeated weights to compare yet.',facts:[[a.length?Math.max(...a.map(p=>p.y))+' '+U():'–','heaviest weight early on'],[b.length?Math.max(...b.map(p=>p.y))+' '+U():'–','heaviest weight lately']],p:['Each line is the longest time you\'ve held each weight, using only weights where nothing heavier was held longer. Early on is your first third of the year, lately is your last third.'],n:R.length+' sets of '+ex}}}},
  len:{tab:'advanced',perLift:1,name:'Set length',desc:'Shows which set length you\'re strongest at',hex:'#199e70',make(){
    const R=exT();const all=bins(R.map(r=>({x:r.tut,y:r.rel})),5,10,10,8);const l1=bins(R.filter(r=>r.set===1).map(r=>({x:r.tut,y:r.rel})),5,10,10,4),l2=bins(R.filter(r=>r.set>=2).map(r=>({x:r.tut,y:r.rel})),5,10,10,4);
    const solid=all.filter(p=>p.n>=10);if(!solid.length){let mx=0;for(let b=0;b<10;b++)mx=Math.max(mx,R.filter(r=>r.tut>=5+b*10&&r.tut<15+b*10).length);return{k:'SET LENGTH',h:'Set length',series:[],lock:[mx,10,'timed set']}}
    const best=solid.reduce((a,b)=>b.y>a.y?b:a,solid[0]);let i=all.indexOf(best),a=i,b=i;while(a>0&&all[a-1].n>=10&&all[a-1].y>=best.y-1)a--;while(b<all.length-1&&all[b+1].n>=10&&all[b+1].y>=best.y-1)b++;
    const lo=all[a].lo,hi=all[b].hi;const inB=R.filter(r=>r.tut>=lo&&r.tut<hi),past=R.filter(r=>r.tut>=hi);const after=R.filter(r=>r.tut>=lo);const rho=spearman(after.map(r=>r.tut),after.map(r=>r.rel));
    const crit1=l1.length?l1.reduce((x,y)=>Math.abs(y.x-best.x)<Math.abs(x.x-best.x)?y:x,l1[0]):null;
    return{k:'SET LENGTH',h:`Strongest at ${lo}–${hi}s`,series:[{name:'Set 1',col:S1,pts:l1,tip:p=>`<b>Set 1</b> · ${p.lo}–${p.hi}s<br>${p.y.toFixed(1)}% of your recent best · ${p.n} sets`,drill:p=>rawDrill('SET LENGTH · SET 1',S1,R.map(r=>({x:r.tut,y:r.rel,t:r.start,w:r.w,r:r.r,s:r.set})),q=>q.s===1&&q.x>=p.lo&&q.x<p.hi,v=>Math.round(v)+'s',v=>v.toFixed(0)+'%',`on set 1 lasting ${p.lo}–${p.hi}s`)},{name:'Set 2+',col:S3,shape:'t',pts:l2,tip:p=>`<b>Set 2+</b> · ${p.lo}–${p.hi}s<br>${p.y.toFixed(1)}% of your recent best · ${p.n} sets`,drill:p=>rawDrill('SET LENGTH · SET 2+',S3,R.map(r=>({x:r.tut,y:r.rel,t:r.start,w:r.w,r:r.r,s:r.set})),q=>q.s>=2&&q.x>=p.lo&&q.x<p.hi,v=>Math.round(v)+'s',v=>v.toFixed(0)+'%',`on set 2+ lasting ${p.lo}–${p.hi}s`)}],
      xfmt:v=>v+'s',yfmt:v=>v+'%',band:[lo,hi],crit:crit1?[{p:crit1,label:'Best range'}]:[],
      ins:{h:`Your sets lasting ${lo}–${hi}s averaged ${avg(inB.map(r=>r.rel)).toFixed(1)}% of your recent best.`+(past.length>=8?` Sets of ${hi}s or longer averaged ${avg(past.map(r=>r.rel)).toFixed(1)}%.`:` You rarely go longer than ${hi}s.`),
        facts:[[avg(inB.map(r=>r.rel)).toFixed(1)+'%',`in ${lo}–${hi}s (${inB.length} sets)`],[(avg(R.filter(r=>r.set===1).map(r=>r.rel))-avg(R.filter(r=>r.set>=2).map(r=>r.rel))).toFixed(1)+' pts','lower on set 2+ than set 1']],
        p:[`From ${lo}s on, longer sets show ${linkWord(rho)} ${rho<0?'downward':'upward'} link with strength (ρ = ${rho.toFixed(2)}).`,'Strength here is each set\'s one-rep max as a share of your best on this lift within 3 weeks either side, so it isn\'t thrown off by getting stronger over the year.'],n:R.length+' sets of '+ex}}}},
  rest:{tab:'advanced',perLift:1,name:'Rest',desc:'Shows how much rest you need to get your reps back',hex:'#e66767',make(){
    const R=exSets().filter(r=>r.rest!=null&&r.prevW===r.w&&r.prevR>=4).map(r=>({x:r.rest,y:r.r/r.prevR*100,set:r.set,t:r.start,w:r.w,r:r.r}));
    const rd=(lab,col,f)=>p=>rawDrill('REST · '+lab.toUpperCase(),col,R,q=>f(q)&&q.x>=p.lo&&q.x<p.hi,v=>mmss(v),v=>v.toFixed(0)+'%',`on ${lab.toLowerCase()} after ${mmss(p.lo)}–${mmss(p.hi)} rest`);
    const a=bins(R.filter(r=>r.set===2),30,30,8),b=bins(R.filter(r=>r.set>=3),30,30,8);if(!a.length){let mx=0;for(let q=30;q<270;q+=30)mx=Math.max(mx,R.filter(r=>r.set===2&&r.x>=q&&r.x<q+30).length);return{k:'REST',h:'Rest',series:[],lock:[mx,4,'timed set 2']}}
    const full=a.find(p=>p.y>=95)||a.reduce((x,y)=>y.y>x.y?y:x,a[0]);const rho=spearman(R.map(r=>r.x),R.map(r=>r.y));const short=a[0];
    return{k:'REST',h:`${Math.round(full.y)}% of reps back by ${mmss(full.hi)}`,series:[{name:'Set 2',col:S2,shape:'s',pts:a,tip:p=>`<b>Set 2</b> after ${mmss(p.lo)}–${mmss(p.hi)}<br>kept ${p.y.toFixed(0)}% of your reps · ${p.n} sets`,drill:rd('Set 2',S2,q=>q.set===2)},{name:'Set 3+',col:S3,shape:'t',pts:b,tip:p=>`<b>Set 3+</b> after ${mmss(p.lo)}–${mmss(p.hi)}<br>kept ${p.y.toFixed(0)}% of your reps · ${p.n} sets`,drill:rd('Set 3+',S3,q=>q.set>=3)}],
      xfmt:v=>mmss(v),yfmt:v=>v+'%',crit:[{p:full,label:mmss(full.hi)}],
      ins:{h:`After ${mmss(short.lo)}–${mmss(short.hi)} of rest you kept ${short.y.toFixed(0)}% of your reps. After ${mmss(full.lo)}–${mmss(full.hi)}, ${full.y.toFixed(0)}%.`,facts:[[short.y.toFixed(0)+'%',`reps kept after ${mmss(short.hi)} or less`],[full.y.toFixed(0)+'%',`reps kept after ${mmss(full.lo)}–${mmss(full.hi)}`]],
        p:[`Longer rest shows ${linkWord(rho)} link with keeping your reps (ρ = ${rho.toFixed(2)}).`,'Each set is compared with the set before it at the same weight, so a change in weight never counts as lost reps.'],n:R.length+' set pairs of '+ex}}}},
  tempo:{tab:'advanced',perLift:1,name:'Tempo',desc:'Shows which rep speed you\'re strongest at',hex:'#9085e9',make(){
    const R=exT().filter(r=>r.set===1);const pts=qbins(R.map(r=>({x:r.pace,y:r.rel})),7);if(!pts.length)return{k:'TEMPO',h:'Tempo',series:[],lock:[R.length,8,'timed first set']};const best=pts.reduce((a,b)=>b.y>a.y?b:a,pts[0]);const rho=spearman(R.map(r=>r.pace),R.map(r=>r.rel));
    return{k:'TEMPO',h:`Best around ${best.x.toFixed(1)}s a rep`,ht:150,series:[{pts,tip:p=>`<b>${p.lo.toFixed(1)}–${p.hi.toFixed(1)}s per rep</b><br>${p.y.toFixed(1)}% of your recent best · ${p.n} sets`,drill:p=>rawDrill('TEMPO',LCOL[ex],R.map(r=>({x:r.pace,y:r.rel,t:r.start,w:r.w,r:r.r})),q=>q.x>=p.lo&&q.x<=p.hi,v=>v.toFixed(1)+'s',v=>v.toFixed(0)+'%',`at ${p.lo.toFixed(1)}–${p.hi.toFixed(1)}s a rep`)}],xfmt:v=>v.toFixed(1)+'s',yfmt:v=>v+'%',crit:[{p:best,label:'Best'}],
      ins:{h:`First sets at ${best.lo.toFixed(1)}–${best.hi.toFixed(1)}s a rep averaged ${best.y.toFixed(1)}% of your recent best.`,facts:[[best.y.toFixed(1)+'%','at your best pace'],[pts[pts.length-1].y.toFixed(1)+'%','at your slowest pace']],p:[`Pace shows ${linkWord(rho)} link with strength overall (ρ = ${rho.toFixed(2)}).`,'Pace is time under tension divided by reps. First sets only.'],n:R.length+' first sets'}}}},
  gap:{tab:'advanced',perLift:1,name:'Days off',desc:'Shows how days off affect your strength',hex:'#d95926',make(){
    const R=exSets().filter(r=>r.set===1&&r.gapD!=null);const G=[[1,1,'1 day'],[2,3,'2–3 days'],[4,6,'4–6 days'],[7,99,'7+ days']].map(([a,b,l],i)=>{const xs=R.filter(r=>r.gapD>=a&&r.gapD<=b);return{x:i,y:avg(xs.map(r=>r.rel)),n:xs.length,l}}).filter(p=>p.n>=3);
    if(!G.length){const gg=[[1,1],[2,3],[4,6],[7,99]].map(([a,b])=>R.filter(r=>r.gapD>=a&&r.gapD<=b).length);return{k:'DAYS OFF',h:'Days off',series:[],lock:[Math.max(...gg),3,'session']}}const best=G.reduce((a,b)=>b.y>a.y?b:a,G[0]),worst=G.reduce((a,b)=>b.y<a.y?b:a,G[0]);
    return{k:'DAYS OFF',h:`Strongest after ${best.l} off`,ht:150,series:[{pts:G,tip:p=>`<b>${p.l} off</b><br>${p.y.toFixed(1)}% of your recent best · ${p.n} sessions`,drill:p=>{const rng={'1 day':[1,1],'2–3 days':[2,3],'4–6 days':[4,6],'7+ days':[7,99]}[p.l];const xs=R.filter(r=>r.gapD>=rng[0]&&r.gapD<=rng[1]);return{k:'DAYS OFF',h:`${xs.length} sessions after ${p.l} off`,rows:xs.map(r=>[fmtDay(r.start),`${r.w} ${U()} × ${r.r}`,r.rel.toFixed(0)+'%'])}}}],xr:[-.4,G.length-.6],xt:G.map(p=>p.x),xfmt:i=>(G.find(p=>p.x===i)||{}).l||'',yfmt:v=>v+'%',crit:[{p:best,label:'Best'}],
      ins:{h:`After ${best.l} off your first set averaged ${best.y.toFixed(1)}% of your recent best, against ${worst.y.toFixed(1)}% after ${worst.l} off.`,facts:[[best.y.toFixed(1)+'%',`after ${best.l} (${best.n} sessions)`],[worst.y.toFixed(1)+'%',`after ${worst.l} (${worst.n} sessions)`]],p:['Days off counts calendar days since your previous session of any kind. First sets only.'],n:R.length+' sessions with '+ex}}}},
  tod:{tab:'advanced',perLift:1,name:'Time of day',desc:'Shows which time of day you\'re strongest',hex:'#d55181',make(){
    const R=exSets().filter(r=>r.set===1);const pts=bins(R.map(r=>({x:r.hour,y:r.rel})),5,3,6,3);if(pts.length<2)return{k:'TIME OF DAY',h:'Time of day',series:[],lock:[pts.length,2,'tod']};const best=pts.reduce((a,b)=>b.y>a.y?b:a,pts[0]),worst=pts.reduce((a,b)=>b.y<a.y?b:a,pts[0]);
    return{k:'TIME OF DAY',h:`Strongest ${hh(best.lo)}–${hh(best.hi)}`,ht:150,series:[{pts,tip:p=>`<b>${hh(p.lo)} to ${hh(p.hi)}</b><br>${p.y.toFixed(1)}% of your recent best · ${p.n} sessions`,drill:p=>rawDrill('TIME OF DAY',LCOL[ex],R.map(r=>({x:r.hour,y:r.rel,t:r.start,w:r.w,r:r.r})),q=>q.x>=p.lo&&q.x<p.hi,v=>hh(v),v=>v.toFixed(0)+'%',`starting ${hh(p.lo)}–${hh(p.hi)}`)}],xr:[5,23],xt:[6,9,12,15,18,21],xfmt:v=>hh(v),yfmt:v=>v+'%',crit:[{p:best,label:'Peak'}],
      ins:{h:`Sessions starting ${hh(best.lo)}–${hh(best.hi)} averaged ${best.y.toFixed(1)}%, against ${worst.y.toFixed(1)}% for ${hh(worst.lo)}–${hh(worst.hi)}.`,facts:[[pts.reduce((a,p)=>p.n>a.n?p:a,pts[0]).n,`sessions at ${hh(pts.reduce((a,p)=>p.n>a.n?p:a,pts[0]).lo)}–${hh(pts.reduce((a,p)=>p.n>a.n?p:a,pts[0]).hi)}, your usual time`],[(best.y-worst.y).toFixed(1)+' pts','between best and worst windows']],p:['Windows with fewer than 3 sessions are left out. First sets only.'],n:R.length+' sessions with '+ex}}}},
};
/* ---- custom chart: pick any two measures ---- */
const MET={
  tut:{l:'Time under tension',u:'s',get:r=>r.tut>0?r.tut:null,fmt:v=>Math.round(v)+'s'},
  rest:{l:'Rest before set',u:'',get:r=>r.rest,fmt:v=>mmss(v)},
  pace:{l:'Seconds per rep',u:'s',get:r=>r.tut>0?r.pace:null,fmt:v=>v.toFixed(1)+'s'},
  w:{l:'Weight',u:'kg',get:r=>r.w,fmt:v=>Math.round(v)+' '+U()},
  load:{l:'Load (% of best)',u:'%',get:r=>r.load,fmt:v=>Math.round(v)+'%'},
  r:{l:'Reps',u:'',get:r=>r.r,fmt:v=>v.toFixed(v<20&&v%1?1:0)},
  kept:{l:'Reps kept',u:'%',get:r=>r.prevR&&r.prevW===r.w?r.r/r.prevR*100:null,fmt:v=>Math.round(v)+'%'},
  set:{l:'Set number',u:'',get:r=>r.set,fmt:v=>'Set '+Math.round(v)},
  rel:{l:'Strength (% of best)',u:'%',get:r=>r.rel,fmt:v=>v.toFixed(0)+'%'},
  e1:{l:'Estimated max',u:'kg',get:r=>r.e1,fmt:v=>Math.round(v)+' '+U()},
  gapD:{l:'Days since last session',u:'d',get:r=>r.set===1?r.gapD:null,fmt:v=>v.toFixed(v%1?1:0)+'d'},
  hour:{l:'Hour of day',u:'',get:r=>r.set===1?r.hour:null,fmt:v=>hh(v)},
  week:{l:'Weeks',u:'',get:r=>(r.start-HIST[0].start)/DAY/7+1,fmt:v=>'Wk '+Math.round(v)},
  restT:{l:'Rest taken',u:'',get:r=>r.rest,fmt:v=>mmss(v)},
};
// only pairings that tell you something you can act on
const ALLOWED={week:['e1','tut','restT','pace'],tut:['rel'],rest:['kept','rel'],pace:['rel','r'],load:['r','tut','rel'],set:['r','rel','tut'],gapD:['rel'],hour:['rel']};
const XM=Object.keys(ALLOWED);
function customMake(xk,yk){if(!ALLOWED[xk])xk='rest';if(!ALLOWED[xk].includes(yk))yk=ALLOWED[xk][0];const X=MET[xk],Y=MET[yk];
  const raw=exSets().map(r=>({x:X.get(r),y:Y.get(r),t:r.start,w:r.w,r:r.r})).filter(p=>p.x!=null&&p.y!=null&&isFinite(p.x)&&isFinite(p.y));
  let pts;const timeline=xk==='week';
  if(timeline&&yk==='e1'){const by={};raw.forEach(p=>{const k=Math.floor(p.x);if(!by[k]||p.y>by[k].y)by[k]={x:k+.5,lo:k,hi:k+1,y:p.y,n:0}});raw.forEach(p=>{const b=by[Math.floor(p.x)];if(b)b.n++});pts=Object.values(by).sort((a,b)=>a.x-b.x)}
  else if(timeline)pts=bins(raw,1,4,14,3);
  else{const distinct=new Set(raw.map(p=>p.x)).size;pts=distinct<=8?[...new Set(raw.map(p=>p.x))].sort((a,b)=>a-b).map(x=>{const ys=raw.filter(p=>p.x===x).map(p=>p.y);return{x,lo:x,hi:x,y:avg(ys),n:ys.length}}).filter(p=>p.n>=3):qbins(raw,8)}
  const src=timeline&&yk==='e1'?pts:raw;const rho=src.length>8?spearman(src.map(p=>p.x),src.map(p=>p.y)):0;const best=pts.length?pts.reduce((a,b)=>b.y>a.y?b:a,pts[0]):null;
  const perMonth=timeline?slope(pts)*4.345:null;
  const h=timeline?(yk==='e1'?`${perMonth>=0?'+':''}${perMonth.toFixed(1)} ${U()} a month`:`${Y.l} ${Math.abs(rho)<.1?'held steady':rho>0?'went up':'went down'} over the year`):Math.abs(rho)<.1?'No clear link':`${Y.l} ${rho>0?'rises':'falls'} with ${X.l.toLowerCase()}`;
  const rng=p=>timeline?(p.hi-p.lo>1?`Weeks ${p.lo}–${p.hi}`:`Week ${p.lo}`):p.lo===p.hi?X.fmt(p.lo):X.fmt(p.lo)+'–'+X.fmt(p.hi);
  return{k:'CUSTOM',h,series:[{pts,tip:p=>`<b>${rng(p)}</b><br>${Y.l}: ${Y.fmt(p.y)} · ${p.n} sets`,drill:p=>rawDrill('CUSTOM · '+rng(p).toUpperCase(),LCOL[ex],raw,q=>timeline?(q.x>=p.lo&&q.x<p.hi):p.lo===p.hi?q.x===p.x:(q.x>=p.lo&&q.x<=p.hi),X.fmt,Y.fmt,(timeline?'in ':'at ')+rng(p).toLowerCase())}],
    xfmt:v=>X.fmt(v),yfmt:v=>Y.fmt(v),crit:best?[{p:best,label:timeline&&yk==='e1'?'Best':'High'}]:[],xk,yk,
    ins:{h:timeline?(yk==='e1'?`Your ${ex} estimated max has moved ${perMonth>=0?'up':'down'} about ${Math.abs(perMonth).toFixed(1)} ${U()} a month this year.`:`Across the year, your ${Y.l.toLowerCase()} on ${ex} ${Math.abs(rho)<.1?'stayed about the same':rho>0?'went up':'went down'}.`)
      :Math.abs(rho)<.1?`In your ${ex} sets, ${X.l.toLowerCase()} and ${Y.l.toLowerCase()} don't move together.`:`In your ${ex} sets, ${Y.l.toLowerCase()} tends to ${rho>0?'rise':'fall'} as ${X.l.toLowerCase()} goes up. The link is ${linkWord(rho).replace('a ','')}.`,
      facts:[[timeline&&yk==='e1'?(perMonth>=0?'+':'')+perMonth.toFixed(1)+' '+U():rho.toFixed(2),timeline&&yk==='e1'?'a month, from a straight line through your weekly bests':'rank correlation (ρ), from −1 to 1'],[best?Y.fmt(best.y):'–',best?'highest, '+rng(best).toLowerCase():'']],
      p:[timeline?'Points are your weekly bests (or 4-week averages). Tap one to see the sets.':'Points are averages of groups of sets. Tap one to see the sets behind it. A link doesn\'t prove one causes the other.'],n:raw.length+' sets of '+ex}}}


const timedEx=()=>exSets().filter(r=>r.tut>0);
const NEEDS={
  consist:()=>[HIST.length,1,'workout'],
  cardio:()=>[HIST.filter(S=>S.cardio).length,1,'workout with cardio'],
  gymtime:()=>[new Set(HIST.map(S=>monthIdx(S.start))).size,2,'month of workouts'],
  split:()=>[HIST.slice(-12).filter(S=>S.ex.some(E=>(E.sets||[]).some(s=>s.tut>0))).length,1,'timed workout'],
  prog:()=>[monthlyBest(ex).length,2,'month of '+ex],
  rate:()=>[monthlyBest(ex).length,4,'month of '+ex],
  lifts:()=>[LIFTS.filter(n=>monthlyBest(n).length>=2).length,1,'lift logged across two months'],
  muscle:()=>[SETS.filter(r=>r.start>NOW-28*DAY).length,10,'set in the last 4 weeks'],
  tens:()=>[timedEx().length,20,'timed set of '+ex],
  len:()=>[timedEx().length,30,'timed set of '+ex],
  rest:()=>[exSets().filter(r=>r.rest!=null&&r.prevW===r.w&&r.prevR>=4).length,15,'timed rest on '+ex],
  tempo:()=>[timedEx().filter(r=>r.set===1).length,15,'timed first set of '+ex],
  gap:()=>[exSets().filter(r=>r.set===1&&r.gapD!=null).length,12,'session with '+ex],
  tod:()=>[exSets().filter(r=>r.set===1).length,12,'session with '+ex],
  custom:()=>[timedEx().length,20,'timed set of '+ex],
};
const plural=(n,w)=>n===1?w:w.replace(/^(\w+)/,m=>m.endsWith('h')||m.endsWith('s')?m+'es':m+'s');
/* ===== stats study cards (branch C) and the end-of-workout charts =====
   Every number is worked out from your logged sets. Cards that need more history stay locked until it's there. */
const EXC=['#199e70','#3987e5','#d95926','#c98500','#9085e9','#d55181'];
const rng=s=>()=>(s=(s*16807)%2147483647)/2147483647;
const gridY=(ys,Y,fmt,l=32,r=10)=>ys.map(v=>`<line x1="${l}" x2="${W-r}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="#262624"/><text x="${l-6}" y="${(Y(v)+3.5).toFixed(1)}" text-anchor="end" font-size="10" font-weight="600" fill="#8a8980">${fmt(v)}</text>`).join('');
// axis labels near an edge hug it instead of running past it
const xLab=(x,h,t,a='middle')=>{const w=String(t).replace(/&#?\w+;/g,'x').length*7;if(a==='middle'){if(x+w/2>W){x=W;a='end'}else if(x-w/2<0){x=0;a='start'}}else if(a==='end'&&x>W)x=W;else if(a==='start'&&x<0)x=0;
  return `<text x="${x.toFixed(1)}" y="${h-5}" text-anchor="${a}" font-size="10" font-weight="600" fill="#8a8980">${t}</text>`};
const pillT=(x,y,t,l=32,r=10)=>{y=Math.max(11,y);const w=t.length*6.4+16;const lx=Math.min(W-r-w/2,Math.max(l+w/2,x));return `<rect x="${(lx-w/2).toFixed(1)}" y="${(y-10).toFixed(1)}" width="${w.toFixed(1)}" height="18" rx="9" fill="#f0efec"/><text x="${lx.toFixed(1)}" y="${(y+3).toFixed(1)}" text-anchor="middle" font-size="10.5" font-weight="900" fill="#0e0e0e">${t}</text>`};
const tipC=(x,y,tip,r=10)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="transparent" data-tip="${tip}"/>`;
const pathOf=pts=>pts.map((p,k)=>(k?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join('');
// best set of the chosen lift in each session
function sessBest(n){const by={};SETS.filter(r=>r.ex===n&&r.w>0).forEach(r=>{if(!by[r.si]||r.e1>by[r.si].e1)by[r.si]=r});return Object.values(by).sort((a,b)=>a.start-b.start)}
// reps lost from set 1 to set 3 (or the last set if fewer), only when the weight didn't change
function dropPct(sets){const s=(sets||[]).filter(x=>x&&x.r>0);if(s.length<2)return null;const k=Math.min(3,s.length),a=s.slice(0,k);if(a.some(x=>(+x.w||0)!==(+a[0].w||0)))return null;return Math.max(0,(1-a[k-1].r/a[0].r)*100)}
function dropRows(n){const by={};SETS.filter(r=>r.ex===n).forEach(r=>{(by[r.si]=by[r.si]||[]).push(r)});return Object.values(by).map(L=>{L.sort((a,b)=>a.set-b.set);return{start:L[0].start,pct:dropPct(L)}}).filter(d=>d.pct!=null).sort((a,b)=>a.start-b.start)}
function logFit(xs,ys){const lx=xs.map(Math.log);const mx=avg(lx),my=avg(ys);let a=0,b=0;lx.forEach((v,i)=>{a+=(v-mx)*(ys[i]-my);b+=(v-mx)**2});const k=b?a/b:0;const c=my-k*mx;const f=x=>c+k*Math.log(x);const sd=Math.sqrt(avg(ys.map((y,i)=>(y-f(xs[i]))**2)));return{f,k,sd}}
function hitPairs(){const by={};exSets().forEach(r=>{(by[r.si]=by[r.si]||[]).push(r)});const out=[];
  Object.values(by).forEach(L=>{L.sort((a,b)=>a.set-b.set);const s1=L[0];if(!s1||s1.set!==1)return;L.slice(1).forEach(r=>{if(r.rest!=null&&r.w===s1.w)out.push({x:r.rest,y:r.r>=s1.r-1?1:0,r,s1})})});return out}
function logistic(P){const xs=P.map(p=>p.x),m=avg(xs),s=Math.sqrt(avg(xs.map(x=>(x-m)**2)))||1;let a=0,b=0;
  for(let it=0;it<2500;it++){let ga=0,gb=0;P.forEach(p=>{const z=(p.x-m)/s;const q=1/(1+Math.exp(-(a+b*z)));ga+=q-p.y;gb+=(q-p.y)*z});a-=.3*ga/P.length;b-=.3*gb/P.length}
  return x=>1/(1+Math.exp(-(a+b*(x-m)/s)))}
function sessionKinds(){const F=[];HIST.forEach(S=>{const all=S.ex.flatMap(E=>E.sets||[]);const reps=all.filter(s=>s.w>0&&s.r>0).map(s=>s.r);const rests=all.filter(s=>s.rest).map(s=>s.rest/1000);
    if(reps.length>=3&&rests.length>=2)F.push({S,x:avg(reps),y:avg(rests)/60})});if(F.length<15)return null;
  const mx=avg(F.map(f=>f.x)),my=avg(F.map(f=>f.y)),sx=Math.sqrt(avg(F.map(f=>(f.x-mx)**2)))||1,sy=Math.sqrt(avg(F.map(f=>(f.y-my)**2)))||1;const Z=F.map(f=>[(f.x-mx)/sx,(f.y-my)/sy]);
  const srt=[...Z].sort((a,b)=>a[0]-b[0]);let C=[srt[Math.floor(srt.length/6)],srt[Math.floor(srt.length/2)],srt[Math.floor(srt.length*5/6)]].map(c=>c.slice());let k=[];
  for(let it=0;it<40;it++){k=Z.map(z=>{let bi=0,bd=1e9;C.forEach((c,j)=>{const d=(z[0]-c[0])**2+(z[1]-c[1])**2;if(d<bd){bd=d;bi=j}});return bi});C=C.map((c,j)=>{const m=Z.filter((z,i)=>k[i]===j);return m.length?[avg(m.map(z=>z[0])),avg(m.map(z=>z[1]))]:c})}
  const G=[0,1,2].map(j=>{const m=F.filter((f,i)=>k[i]===j);return{j,n:m.length,x:avg(m.map(f=>f.x)),y:avg(m.map(f=>f.y))}}).filter(g=>g.n).sort((a,b)=>a.x-b.x);
  const NAMES=['Heavy','Middle','Pump'],COLS=['#d95926','#3987e5','#199e70'];G.forEach((g,i)=>{g.name=G.length===3?NAMES[i]:i===0?'Heavy':'Pump';g.col=G.length===3?COLS[i]:i===0?COLS[0]:COLS[2]});
  F.forEach((f,i)=>f.g=G.find(g=>g.j===k[i]));return{F,G}}
const tenWord=x=>x.toFixed(0);

Object.assign(CARDS,{
  restdist:{tab:'overview',name:'Your rests',desc:'Shows how long you really rest between sets',hex:'#d95926',make(){
    const R=SETS.filter(r=>r.rest!=null&&r.start>NOW-90*DAY).map(r=>r.rest);const med=[...R].sort((a,b)=>a-b)[Math.floor(R.length/2)];
    const B=[];for(let a=0;a<300;a+=30)B.push({lo:a,hi:a+30,n:R.filter(v=>v>=a&&v<a+30).length});B.push({lo:300,hi:1e9,n:R.filter(v=>v>=300).length});
    const h=150,pl=10,pr=10,pt=26,pb=22,bw=(W-pl-pr)/B.length,mx=Math.max(...B.map(b=>b.n))||1,Y=v=>h-pb-v/mx*(h-pt-pb);let o=`<svg class="ch" viewBox="0 0 ${W} ${h}">`;
    B.forEach((b,i)=>{const x=pl+i*bw;const on=med>=b.lo&&med<b.hi;o+=`<rect x="${(x+2).toFixed(1)}" y="${Y(b.n).toFixed(1)}" width="${(bw-4).toFixed(1)}" height="${(h-pb-Y(b.n)).toFixed(1)}" rx="5" fill="#d95926" fill-opacity="${on?1:.42}"/>`;
      o+=`<rect x="${x.toFixed(1)}" y="${pt}" width="${bw.toFixed(1)}" height="${h-pt-pb}" fill="transparent" data-tip="<b>${b.hi>1e8?'5:00 or more':mmss(b.lo)+' to '+mmss(b.hi)}</b><br>${b.n} rests · ${pct(b.n,R.length)}%"/>`});
    [60,120,180,240].forEach(v=>o+=xLab(pl+v/30*bw,h,mmss(v)));o+=xLab(pl+10.5*bw,h,'5:00+');
    const mxp=pl+Math.min(med,299)/30*bw;o+=`<line x1="${mxp.toFixed(1)}" x2="${mxp.toFixed(1)}" y1="${pt+6}" y2="${h-pb}" stroke="#f0efec" stroke-width="1.4" stroke-dasharray="3 3"/>`+pillT(mxp,pt-6,'Median '+mmss(med),pl,pr)+'</svg>';
    const under=pct(R.filter(v=>v<120).length,R.length),over=pct(R.filter(v=>v>=240).length,R.length);
    return{k:'YOUR RESTS',h:`Your typical rest is ${mmss(med)}<small>From ${R.length} rests in the last 90 days</small>`,custom:o,
      ins:{h:`Half your rests are shorter than ${mmss(med)}, half are longer.`,facts:[[under+'%','of rests under 2:00'],[over+'%','of rests 4:00 or longer']],p:['Each bar counts your rests of that length, in 30-second steps. The bright bar is where your typical rest falls.','A few very long rests don\'t pull this number up, so it reflects what you normally do.'],n:R.length+' rests'}}}},
  realgain:{tab:'overview',perLift:1,name:'Real or noise?',desc:'Shows whether your recent change is real or just a normal swing',hex:'#199e70',make(){
    const sb=sessBest(ex);const end=sb[sb.length-1].start;const A=sb.filter(r=>end-r.start<42*DAY),B=sb.filter(r=>end-r.start>=42*DAY&&end-r.start<84*DAY);
    const a=A.map(r=>r.e1),b=B.map(r=>r.e1);const obs=avg(a)-avg(b);const R=rng(11);const D=[];for(let i=0;i<2000;i++){let s1=0,s2=0;for(let j=0;j<a.length;j++)s1+=a[Math.floor(R()*a.length)];for(let j=0;j<b.length;j++)s2+=b[Math.floor(R()*b.length)];D.push(s1/a.length-s2/b.length)}
    D.sort((x,y)=>x-y);const lo=D[Math.floor(D.length*.05)],hi=D[Math.floor(D.length*.95)];const verdict=lo>0?'real gain':hi<0?'real drop':'could be noise';const vc=lo>0?'#199e70':hi<0?'#e66767':'#c98500';
    const h=180,pt=14,pb=24,all=a.concat(b);const yt=nice(Math.min(...all),Math.max(...all));const Y=v=>pt+(1-(v-yt[0])/((yt[yt.length-1]-yt[0])||1))*(h-pt-pb);
    let o=`<svg class="ch" viewBox="0 0 ${W} ${h}">`+gridY(yt,Y,v=>Math.round(v),32,96);
    [[B,'#77776f','6 to 12 wk ago',82],[A,'#199e70','Last 6 wk',170]].forEach(([L,c,lab,cx])=>{const m=avg(L.map(r=>r.e1));
      L.forEach((r,i)=>{const x=cx+((i*37)%29-14);o+=mark(x,Y(r.e1),'c',c,3.6,'#1a1a19')+tipC(x,Y(r.e1),`<b>${fmtDay(r.start)}</b><br>${r.w} ${U()} × ${r.r} ≈ ${r.e1.toFixed(1)} ${U()}`,6)});
      o+=`<line x1="${cx-26}" x2="${cx+26}" y1="${Y(m).toFixed(1)}" y2="${Y(m).toFixed(1)}" stroke="#f0efec" stroke-width="2.5" stroke-linecap="round"/>`+xLab(cx,h,lab)});
    const rx=W-44,span=Math.max(Math.abs(lo),Math.abs(hi),Math.abs(obs),1)*1.25,cy=(pt+h-pb)/2,s=(h-pt-pb)/2/span,Yc=v=>cy-v*s;
    o+=`<line x1="${rx-16}" x2="${rx+16}" y1="${cy}" y2="${cy}" stroke="#55554f" stroke-dasharray="2 3"/><text x="${rx-20}" y="${cy+3.5}" text-anchor="end" font-size="9.5" font-weight="700" fill="#8a8980">0</text>`;
    o+=`<line x1="${rx}" x2="${rx}" y1="${Yc(lo).toFixed(1)}" y2="${Yc(hi).toFixed(1)}" stroke="${vc}" stroke-width="7" stroke-linecap="round" stroke-opacity=".85"/>`+mark(rx,Yc(obs),'c','#f0efec',4.6,'#1a1a19');
    o+=`<text x="${rx}" y="${(Math.min(Yc(hi),Yc(lo))-9).toFixed(1)}" text-anchor="middle" font-size="10.5" font-weight="900" fill="#f0efec">${obs>=0?'+':''}${obs.toFixed(1)}</text>`+xLab(rx,h,'Change')+tipC(rx,Yc(obs),`<b>Likely range</b><br>${lo>=0?'+':''}${lo.toFixed(1)} to ${hi>=0?'+':''}${hi.toFixed(1)} ${U()}`,14)+'</svg>';
    return{k:'REAL OR NOISE?',h:`${obs>=0?'Up':'Down'} ${Math.abs(obs).toFixed(1)} ${U()} in 6 weeks<small style="color:${vc}">${lo>0?'This is a real gain':hi<0?'This is a real drop':'Too small to call yet'}</small>`,custom:o,
      ins:{h:lo>0?`Your ${ex} really is stronger than 6 weeks ago.`:hi<0?`Your ${ex} really has dipped over the last 6 weeks.`:`The change in your ${ex} is small enough that it could be day-to-day noise.`,
        facts:[[(obs>=0?'+':'')+obs.toFixed(1)+' '+U(),'average best set, last 6 weeks vs the 6 before'],[`${lo>=0?'+':''}${lo.toFixed(1)} to ${hi>=0?'+':''}${hi.toFixed(1)}`,'likely range of the real change']],
        p:['Each dot is your best set in one session, as an estimated one-rep max. The white lines are the average for each 6 weeks.','The bar on the right shows how big the change could really be, given how much your sessions vary. If the whole bar is above 0, you\'ve really gotten stronger. If it crosses 0, the change could just be normal ups and downs, so check again in a few weeks.'],n:(A.length+B.length)+' sessions of '+ex}}}},
  forecast:{tab:'overview',perLift:1,name:'Where it\'s heading',desc:'Shows where a lift is heading over the next 8 weeks',hex:'#3987e5',make(){
    const sb=sessBest(ex);const t0=sb[0].start;const wk={};sb.forEach(r=>{const w=Math.floor((r.start-t0)/(7*DAY));if(!wk[w]||r.e1>wk[w].e1)wk[w]=r});const P=Object.entries(wk).map(([w,r])=>({x:+w,y:r.e1,r})).sort((a,b)=>a.x-b.x);
    const last=P[P.length-1].x;const fit=P.filter(p=>p.x>=last-16);const k=slope(fit),c=avg(fit.map(p=>p.y))-k*avg(fit.map(p=>p.x));const sd=Math.sqrt(avg(fit.map(p=>(p.y-(c+k*p.x))**2)))||1;
    const F=x=>c+k*x,end=last+8;const show=P.filter(p=>p.x>=last-26);const band=x=>sd*(1+.12*(x-last));
    const ys=show.map(p=>p.y).concat([F(end)+band(end),F(end)-band(end)]);const yt=nice(Math.min(...ys),Math.max(...ys));const h=170,pl=36,pr=10,pt=16,pb=22;const x0=Math.max(show[0].x,last-26);
    const X=v=>pl+(v-x0)/(end-x0)*(W-pl-pr),Y=v=>pt+(1-(v-yt[0])/((yt[yt.length-1]-yt[0])||1))*(h-pt-pb);
    let o=`<svg class="ch" viewBox="0 0 ${W} ${h}">`+gridY(yt,Y,v=>Math.round(v),pl);
    const up=[],dn=[];for(let x=last;x<=end;x+=.5){up.push([X(x),Y(F(x)+band(x))]);dn.unshift([X(x),Y(F(x)-band(x))])}
    o+=`<path d="${pathOf(up.concat(dn))}Z" fill="#3987e5" fill-opacity=".16"/>`;
    o+=`<path d="${pathOf(show.map(p=>[X(p.x),Y(p.y)]))}" fill="none" stroke="rgba(240,239,236,.35)" stroke-width="1.2"/>`;
    show.forEach(p=>o+=mark(X(p.x),Y(p.y),'c','#8a8980',3,'#1a1a19')+tipC(X(p.x),Y(p.y),`<b>Week of ${fmtDate(p.r.start)}</b><br>${p.r.w} ${U()} × ${p.r.r} ≈ ${p.y.toFixed(1)} ${U()}`,6));
    o+=`<path d="M${X(last).toFixed(1)} ${Y(F(last)).toFixed(1)}L${X(end).toFixed(1)} ${Y(F(end)).toFixed(1)}" stroke="#3987e5" stroke-width="2.4" stroke-dasharray="5 4"/>`+mark(X(end),Y(F(end)),'c','#3987e5',5.6);
    o+=pillT(X(end)-30,Y(F(end))-16,'~'+Math.round(F(end))+' '+U(),pl,pr)+`<line x1="${X(last).toFixed(1)}" x2="${X(last).toFixed(1)}" y1="${pt}" y2="${h-pb}" stroke="#3a3a37" stroke-dasharray="2 3"/>`;
    o+=xLab(X(x0),h,x0===last-26?'6 mo ago':fmtDate(show[0].r.start),'start')+xLab(X(last),h,'Now')+xLab(X(end),h,'+8 wk','end')+'</svg>';const mo=k*4.35;
    return{k:'WHERE IT\'S HEADING',h:`About ${Math.round(F(end))} ${U()} in 8 weeks<small>${mo>=.2?`If you keep adding ${mo.toFixed(1)} ${U()} a month`:mo<=-.2?`If the current dip of ${Math.abs(mo).toFixed(1)} ${U()} a month continues`:'You\'re holding steady'}</small>`,custom:o,
      ins:{h:mo>=.2?`At your current pace your ${ex} reaches about ${Math.round(F(end))} ${U()} in 8 weeks.`:mo<=-.2?`Your ${ex} has been trending down. If nothing changes it lands near ${Math.round(F(end))} ${U()} in 8 weeks.`:`Your ${ex} is holding steady, around ${Math.round(F(end))} ${U()}.`,
        facts:[[(mo>=0?'+':'')+mo.toFixed(1)+' '+U(),'a month, over the last 4 months'],['±'+band(end).toFixed(1)+' '+U(),'likely spread by week 8']],p:['The dashed line carries your last 4 months forward 8 weeks. The shaded area shows how far off it could reasonably be, and it widens the further out it goes.','It assumes you keep training the same way. Time off or a new program will change it.'],n:fit.length+' weeks of '+ex}}}},
  droptrend:{tab:'advanced',perLift:1,name:'Drop-off',desc:'Shows how many reps you lose from set 1 to set 3, month by month',hex:'#199e70',make(){
    const D=dropRows(ex);const mo={};D.forEach(d=>{const m=monthIdx(d.start);(mo[m]=mo[m]||[]).push(d.pct)});const pts=Object.entries(mo).map(([m,a])=>({x:+m,y:avg(a),n:a.length})).filter(p=>p.n>=2).sort((a,b)=>a.x-b.x);
    if(pts.length<2)return{k:'DROP-OFF',h:'Drop-off',series:[],lock:[pts.length,2,'month']};const f=pts[0],l=pts[pts.length-1];const best=pts.reduce((a,b)=>b.y<a.y?b:a,pts[0]);
    return{k:'DROP-OFF',h:`You lose ${Math.round(l.y)}% of your reps by set 3<small>${monthName(f.x)} it was ${Math.round(f.y)}%</small>`,ht:150,series:[{pts,tip:p=>`<b>${monthName(p.x)}</b><br>${p.y.toFixed(0)}% of reps lost on average · ${p.n} sessions`,drill:p=>{const xs=D.filter(d=>monthIdx(d.start)===p.x);return{k:'DROP-OFF',h:`${monthName(p.x)}: ${xs.length} sessions`,rows:xs.map(d=>[fmtDay(d.start),'set 1 to 3',d.pct.toFixed(0)+'% lost'])}}}],
      xr:[f.x,l.x],xt:[f.x,Math.round((f.x+l.x)/2),l.x],yt:nice(0,Math.max(...pts.map(p=>p.y))),xfmt:i=>monthName(i),yfmt:v=>v+'%',crit:[{p:best,label:'Least'}],
      ins:{h:`Lately you lose about ${Math.round(l.y)}% of your reps from set 1 to set 3 on ${ex}${l.y<f.y?`, down from ${Math.round(f.y)}%`:l.y>f.y?`, up from ${Math.round(f.y)}%`:''}.`,facts:[[Math.round(best.y)+'%',`least drop-off, ${monthName(best.x)}`],[Math.round(avg(D.map(d=>d.pct)))+'%','average across the year']],
        p:['Lower is better. It means you\'re holding your reps from set to set, which can improve even when the weight on the bar doesn\'t.','Only sessions where the weight stayed the same are counted, so lowering the weight never looks like lost reps.'],n:D.length+' sessions of '+ex}}}},
  restpay:{tab:'advanced',perLift:1,name:'Rest pays off',desc:'Shows how many extra reps more rest gets you',hex:'#3987e5',make(){
    const R=exSets().filter(r=>r.set===2&&r.rest!=null&&r.prevW===r.w&&r.prevR>=4&&r.rest>=20&&r.rest<=600).map(r=>({x:r.rest,y:r.r/r.prevR*100,r}));
    const fit=logFit(R.map(p=>p.x),R.map(p=>p.y));const g=fit.f(150)-fit.f(90);const h=170,pl=38,pr=10,pt=14,pb=22,x0=30,x1=300;
    const yt=nice(Math.max(40,Math.min(...R.map(p=>p.y))),Math.min(120,Math.max(...R.map(p=>p.y))));const X=v=>pl+(Math.min(x1,Math.max(x0,v))-x0)/(x1-x0)*(W-pl-pr),Y=v=>pt+(1-(Math.min(yt[yt.length-1],Math.max(yt[0],v))-yt[0])/((yt[yt.length-1]-yt[0])||1))*(h-pt-pb);
    let o=`<svg class="ch" viewBox="0 0 ${W} ${h}">`+gridY(yt,Y,v=>v+'%',pl);R.forEach(p=>o+=`<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="2.6" fill="#3987e5" fill-opacity=".5"/>`);
    const C=[];for(let x=x0;x<=x1;x+=5)C.push([X(x),Y(fit.f(x))]);o+=`<path d="${pathOf(C)}" fill="none" stroke="#f0efec" stroke-width="2.2"/>`;
    [[90,'1:30'],[150,'2:30']].forEach(([x,l])=>o+=mark(X(x),Y(fit.f(x)),'c','#3987e5',5)+tipC(X(x),Y(fit.f(x)),`<b>After ${l} rest</b><br>about ${fit.f(x).toFixed(0)}% of set 1 reps`));
    [60,120,180,240,300].forEach(v=>o+=xLab(X(v),h,mmss(v)));o+=pillT(X(150),Y(fit.f(150))-16,(g>=0?'+':'')+g.toFixed(0)+'% reps',pl,pr)+'</svg>';
    return{k:'REST PAYS OFF',h:g>=1?`${g.toFixed(0)}% more reps with 2:30 rest<small>Compared with 1:30, on your second set</small>`:'Extra rest barely changes your reps<small>Going from 1:30 to 2:30, on your second set</small>',custom:o,
      ins:{h:`On ${ex}, resting 2:30 instead of 1:30 gets you about ${Math.abs(g).toFixed(0)}% ${g>=0?'more':'fewer'} reps on set 2.`,facts:[[fit.f(90).toFixed(0)+'%','of set 1 reps after 1:30'],[fit.f(150).toFixed(0)+'%','of set 1 reps after 2:30']],
        p:['Each dot is a second set: how long you rested before it, and its reps compared with set 1 at the same weight.','The white line is your typical result for each rest length. Each extra minute helps a little less than the one before.'],n:R.length+' set 2s of '+ex}}}},
  hitreps:{tab:'advanced',perLift:1,name:'Hit your reps',desc:'Shows how long to rest to match your first set',hex:'#9085e9',make(){
    const P=hitPairs();const f=logistic(P);const h=170,pl=38,pr=10,pt=14,pb=22,x0=30,x1=300;const X=v=>pl+(v-x0)/(x1-x0)*(W-pl-pr),Y=v=>pt+(1-v)*(h-pt-pb);
    let o=`<svg class="ch" viewBox="0 0 ${W} ${h}">`+gridY([0,.5,1],Y,v=>Math.round(v*100)+'%',pl);
    bins(P.filter(p=>p.x>=x0&&p.x<x1).map(p=>({x:p.x,y:p.y})),x0,30,9,5).forEach(b=>o+=mark(X(b.x),Y(b.y),'c','#9085e9',4.4)+tipC(X(b.x),Y(b.y),`<b>${mmss(b.lo)} to ${mmss(b.hi)}</b><br>hit it ${Math.round(b.y*100)}% of the time · ${b.n} sets`));
    const C=[];for(let x=x0;x<=x1;x+=5)C.push([X(x),Y(f(x))]);o+=`<path d="${pathOf(C)}" fill="none" stroke="#f0efec" stroke-width="2.2"/>`;
    o+=`<line x1="${X(120).toFixed(1)}" x2="${X(120).toFixed(1)}" y1="${Y(f(120)).toFixed(1)}" y2="${h-pb}" stroke="#55554f" stroke-dasharray="3 3"/>`+pillT(X(120),Y(f(120))-16,'2:00 → '+Math.round(f(120)*100)+'%',pl,pr);
    [60,120,180,240,300].forEach(v=>o+=xLab(X(v),h,mmss(v)));o+='</svg>';const p60=f(60),p150=f(150);
    let need=null;for(let x=30;x<=300;x+=5)if(f(x)>=.7){need=x;break}
    return{k:'HIT YOUR REPS',h:need?`Rest ${mmss(need)} to match set 1<small>That works 7 times out of 10. After 1:00 it\'s ${Math.round(p60*100)}%</small>`:`Longer rest doesn\'t help you match set 1<small>${Math.round(p150*100)}% after 2:30, ${Math.round(p60*100)}% after 1:00</small>`,custom:o,
      ins:{h:need?`On ${ex}, about ${mmss(need)} of rest gives you a 70% chance of getting within 1 rep of set 1.`:`On ${ex}, longer rest doesn't push your odds past 70%.`,facts:[[Math.round(p60*100)+'%','chance after 1:00'],[Math.round(p150*100)+'%','chance after 2:30']],
        p:['Matching means getting within 1 rep of set 1 at the same weight.','The purple dots show how often you actually did it after each length of rest. The white line is your chance for any rest length.'],n:P.length+' sets of '+ex}}}},
  normal:{tab:'advanced',perLift:1,name:'Normal range',desc:'Flags sessions that were far off your usual',hex:'#e66767',make(){
    const sb=sessBest(ex);const pts=[];sb.forEach((r,i)=>{if(i<4)return;const w=sb.slice(Math.max(0,i-8),i).map(q=>q.e1);const m=avg(w);const sd=Math.max(Math.sqrt(avg(w.map(v=>(v-m)**2))),m*.015);pts.push({r,y:r.e1,m,sd,odd:Math.abs(r.e1-m)>2*sd})});
    const L=pts.slice(-40);const n=L.length;const ys=L.flatMap(p=>[p.y,p.m+2*p.sd,p.m-2*p.sd]);const yt=nice(Math.min(...ys),Math.max(...ys));const h=170,pl=36,pr=10,pt=16,pb=22;
    const X=i=>pl+i/(Math.max(1,n-1))*(W-pl-pr),Y=v=>pt+(1-(v-yt[0])/((yt[yt.length-1]-yt[0])||1))*(h-pt-pb);let o=`<svg class="ch" viewBox="0 0 ${W} ${h}">`+gridY(yt,Y,v=>Math.round(v),pl);
    o+=`<path d="${pathOf(L.map((p,i)=>[X(i),Y(p.m+2*p.sd)]).concat(L.map((p,i)=>[X(i),Y(p.m-2*p.sd)]).reverse()))}Z" fill="#3987e5" fill-opacity=".13"/><path d="${pathOf(L.map((p,i)=>[X(i),Y(p.m)]))}" fill="none" stroke="#3987e5" stroke-width="1.4" stroke-dasharray="4 3"/>`;
    L.forEach((p,i)=>{o+=p.odd?mark(X(i),Y(p.y),'c','#e66767',5.4):mark(X(i),Y(p.y),'c','#c3c2b7',3.2,'#1a1a19');o+=tipC(X(i),Y(p.y),`<b>${fmtDay(p.r.start)}</b><br>${p.r.w} ${U()} × ${p.r.r} ≈ ${p.y.toFixed(1)} ${U()}<br>normal ${(p.m-2*p.sd).toFixed(0)}–${(p.m+2*p.sd).toFixed(0)}`,7)});
    const odd=L.filter(p=>p.odd);const lo=odd[odd.length-1];if(lo){const i=L.indexOf(lo);o+=pillT(X(i),lo.y<lo.m?Y(lo.y)+20:Y(lo.y)-15,lo.y<lo.m?'Off day':'Big day',pl,pr)}
    o+=xLab(X(0),h,fmtDate(L[0].r.start),'start')+xLab(X(n-1),h,'Now','end')+'</svg>';const offs=odd.filter(p=>p.y<p.m).length;
    return{k:'NORMAL RANGE',h:odd.length?`${odd.length} of your last ${n} sessions were unusual<small>${[offs?offs+' below':'',odd.length-offs?(odd.length-offs)+' above':''].filter(Boolean).join(' and ')} your normal</small>`:`Your last ${n} sessions were all normal<small>Nothing far off your usual</small>`,custom:o,
      ins:{h:odd.length?`${odd.length} of your last ${n} ${ex} sessions fell outside your normal range: ${offs} below, ${odd.length-offs} above.`:`Every one of your last ${n} ${ex} sessions was within your normal range.`,facts:[[odd.length+'',`unusual sessions out of ${n}`],[lo?fmtDate(lo.r.start):'–','most recent one']],
        p:['The shaded band is your normal: where your sessions usually land, based on the 8 before each one. Almost all sessions fall inside it.','A red dot is worth a thought: sleep, food, a rushed rest, or a real jump in strength.'],n:sb.length+' sessions of '+ex}}}},
  kinds:{tab:'advanced',name:'Session types',desc:'Shows the kinds of workouts you actually do',hex:'#c98500',make(){
    const K=sessionKinds();if(!K)return{k:'SESSION TYPES',h:'Session types',series:[],lock:[HIST.length,15,'workout']};const{F,G}=K;const h=180,pl=38,pr=10,pt=12,pb=22;
    const xt=nice(Math.min(...F.map(f=>f.x)),Math.max(...F.map(f=>f.x)),3),yt=nice(Math.min(...F.map(f=>f.y)),Math.max(...F.map(f=>f.y)),3);
    const X=v=>pl+(v-xt[0])/((xt[xt.length-1]-xt[0])||1)*(W-pl-pr),Y=v=>pt+(1-(v-yt[0])/((yt[yt.length-1]-yt[0])||1))*(h-pt-pb);
    let o=`<svg class="ch" viewBox="0 0 ${W} ${h}">`+gridY(yt,Y,v=>mmss(v*60),pl);F.forEach(f=>o+=`<circle cx="${X(f.x).toFixed(1)}" cy="${Y(f.y).toFixed(1)}" r="3.6" fill="${f.g.col}" fill-opacity=".8" data-tip="<b>${fmtDay(f.S.start)}</b> · ${esc(f.S.split||'')}<br>${f.x.toFixed(1)} reps a set · ${mmss(f.y*60)} rests<br>${f.g.name}"/>`);
    xt.forEach((v,i)=>o+=xLab(X(v),h,i===xt.length-1?v+' reps':String(v)));o+='</svg>';const top=G.reduce((a,b)=>b.n>a.n?b:a,G[0]);const R4=F.filter(f=>f.S.start>NOW-28*DAY);
    const keys=`<div class="an-keys">${G.map(g=>`<span><svg viewBox="-7 -7 14 14"><circle r="4.4" fill="${g.col}" stroke="#f0efec" stroke-width="1.6"/></svg>${g.name} ${pct(g.n,F.length)}%</span>`).join('')}</div>`;
    return{k:'SESSION TYPES',h:`${pct(top.n,F.length)}% of your sessions are ${top.name.toLowerCase()} days<small>${G.filter(g=>g!==top).map(g=>`${g.name} ${pct(g.n,F.length)}%`).join(', ')}</small>`,custom:o+keys,
      ins:{h:`Your workouts fall into ${G.length} kinds: ${G.map(g=>`${g.name.toLowerCase()} (about ${g.x.toFixed(0)} reps, ${mmss(g.y*60)} rests)`).join(', ')}.`,facts:G.slice(0,2).map(g=>[pct(g.n,F.length)+'%',g.name.toLowerCase()+' sessions']),
        p:['Each dot is one session, placed by its average reps per set and average rest. The app sorts them into 3 groups on its own, so you don\'t have to label anything.',R4.length?`In the last 4 weeks: ${G.map(g=>`${R4.filter(f=>f.g===g).length} ${g.name.toLowerCase()}`).join(', ')}.`:''].filter(Boolean),n:F.length+' sessions'}}}},
  lastwk:{tab:'overview',name:'Last workout',desc:'Reps set to set from your latest session',hex:'#199e70',make(){
    const rec=hist.filter(h=>h&&Array.isArray(h.ex)&&h.ex.length).reduce((a,b)=>(b.start||0)>=(a.start||0)?b:a);const V=wkViews(rec);
    return{k:'LAST WORKOUT',h:`${esc(rec.split||'Workout')}<small>${fmtDay(rec.start||Date.now())}</small>`,custom:`<div class="wk-mini">${V.drop.body}</div><div class="wk-hint">Tap for sets, volume and rest</div>`,open:()=>workoutSheet(rec,`${rec.split||'Workout'} · ${fmtDay(rec.start||Date.now())}`)}}},
});
Object.assign(NEEDS,{
  restdist:()=>[SETS.filter(r=>r.rest!=null&&r.start>NOW-90*DAY).length,20,'timed rest in the last 90 days'],
  realgain:()=>{const sb=sessBest(ex);if(!sb.length)return[0,6,'session of '+ex];const end=sb[sb.length-1].start;const a=sb.filter(r=>end-r.start<42*DAY).length,b=sb.filter(r=>end-r.start>=42*DAY&&end-r.start<84*DAY).length;return[Math.min(a,3)+Math.min(b,3),6,'session of '+ex+' across 12 weeks']},
  forecast:()=>{const sb=sessBest(ex);if(!sb.length)return[0,6,'week of '+ex];const t0=sb[0].start,last=Math.floor((sb[sb.length-1].start-t0)/(7*DAY));return[new Set(sb.filter(r=>Math.floor((r.start-t0)/(7*DAY))>=last-16).map(r=>Math.floor((r.start-t0)/(7*DAY)))).size,6,'week of '+ex]},
  droptrend:()=>[dropRows(ex).length,8,'session of '+ex+' with 2+ sets at one weight'],
  restpay:()=>[exSets().filter(r=>r.set===2&&r.rest!=null&&r.prevW===r.w&&r.prevR>=4).length,15,'rest before set 2 of '+ex],
  hitreps:()=>[hitPairs().length,25,'rest after set 1 of '+ex],
  normal:()=>[sessBest(ex).length,10,'session of '+ex],
  kinds:()=>[HIST.filter(S=>S.ex.some(E=>(E.sets||[]).some(s=>s.rest))).length,15,'timed workout'],
  lastwk:()=>[hist.filter(h=>h&&Array.isArray(h.ex)&&h.ex.length).length,1,'workout'],
});
// the new cards join the lists once, for people who set up their charts before they existed
if(!S.get('gym.statsCards1',false)){const ins=(L,ids,after)=>{let a=after;ids.forEach(id=>{if(L.includes(id)){a=id;return}const i=a?L.indexOf(a):-1;if(i>=0)L.splice(i+1,0,id);else L.push(id);a=id})};
  if(!lists.overview.includes('lastwk'))lists.overview.unshift('lastwk');
  ins(lists.overview,['realgain','forecast'],'rate');ins(lists.overview,['restdist'],'split');ins(lists.advanced,['droptrend','restpay','hitreps','normal','kinds'],'rest');S.set('gym.statsCards1',true);saveLists()}

/* ---- end of workout: reps set to set, drop-off vs usual, volume, rest ---- */
function wkViews(rec){const before=hist.filter(h=>h&&h!==rec&&Array.isArray(h.ex)&&(h.start||0)<(rec.start||Infinity)).sort((a,b)=>(a.start||0)-(b.start||0));
  const prevOf=n=>{for(let i=before.length-1;i>=0;i--){const e=before[i].ex.find(x=>x.name===n&&x.sets&&x.sets.length);if(e)return{e,h:before[i]}}return null};
  const E=rec.ex.filter(e=>e.sets&&e.sets.some(s=>s.r>0)).map((e,i)=>{const p=prevOf(e.name);const us=before.flatMap(h=>h.ex.filter(x=>x.name===e.name).map(x=>dropPct(x.sets))).filter(v=>v!=null);
    const m=us.length>=3?avg(us):null,sd=us.length>=3?Math.sqrt(avg(us.map(v=>(v-m)**2))):null;return{name:e.name,sets:e.sets.filter(s=>s.r>0),prev:p,col:EXC[i%EXC.length],drop:dropPct(e.sets),m,sd}});
  const nm=n=>esc(n);
  // A: reps set to set, one small chart per exercise
  const lost=E.map(e=>e.sets[0].r-e.sets[e.sets.length-1].r);const mostI=lost.indexOf(Math.max(...lost));
  const A=`<div class="wk-grid">${E.map((e,i)=>{const r=e.sets.map(s=>s.r),pr=e.prev?e.prev.e.sets.filter(s=>s.r>0).map(s=>s.r):[];const all=r.concat(pr);const lo=Math.min(...all),hi=Math.max(...all);const n=Math.max(r.length,pr.length);
      const X=j=>16+j*(118/Math.max(1,n-1)),Y=v=>20+(hi-v)/((hi-lo)||1)*30;const d=lost[i];
      let s=`<svg viewBox="0 0 150 66">`;if(pr.length)s+=`<path d="${pathOf(pr.map((v,j)=>[X(j),Y(v)]))}" fill="none" stroke="#55554f" stroke-width="1.4" stroke-dasharray="3 3"/>`+pr.map((v,j)=>`<circle cx="${X(j).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="2.4" fill="#55554f"/>`).join('');
      s+=`<path d="${pathOf(r.map((v,j)=>[X(j),Y(v)]))}" fill="none" stroke="${e.col}" stroke-width="2"/>`+r.map((v,j)=>mark(X(j),Y(v),'c',e.col,3.6,'#141413')+`<text x="${X(j).toFixed(1)}" y="${(Y(v)-7).toFixed(1)}" text-anchor="middle" font-size="9.5" font-weight="800" fill="#c3c2b7">${v}</text>`).join('');
      s+=Array.from({length:n},(_,j)=>`<text x="${X(j).toFixed(1)}" y="63" text-anchor="middle" font-size="8.5" font-weight="700" fill="#8a8980">S${j+1}</text>`).join('')+'</svg>';
      return `<div class="wk-mc"><div class="wk-mh"><b>${nm(e.name)}</b><span style="color:${d>=3?'#e66767':d<=0?'#199e70':'#c3c2b7'}">${d>0?'−'+d:d===0?'held':'+'+(-d)}</span></div>${s}</div>`}).join('')}</div>
    <div class="wk-leg"><i style="background:#c3c2b7"></i>Today${E.some(e=>e.prev)?'<i style="background:#55554f"></i>Last time':''}</div>`;
  const Ah=lost[mostI]>0?`${nm(E[mostI].name)} lost the most reps<small>${lost[mostI]} from set 1 to the last set</small>`:'You held every rep<small>From set 1 to the last set</small>';
  // B: drop-off against your usual range
  const sc=v=>Math.min(100,Math.max(0,v/50*100));let worst=null,wv=-1e9;E.forEach(e=>{if(e.drop==null)return;const z=e.m!=null?(e.drop-e.m)/Math.max(e.sd,3):e.drop/20;if(z>wv){wv=z;worst=e}});
  const B=`<div class="wk-rows">${E.map(e=>{const has=e.drop!=null;const c=!has?'#55554f':e.m==null?'#d95926':e.drop>e.m+e.sd?'#e66767':e.drop<e.m-e.sd||e.drop===0?'#199e70':'#d95926';
      return `<div class="wk-row"><b>${nm(e.name)}</b><div class="wk-track">${e.m!=null?`<i class="wk-band" style="left:${sc(e.m-e.sd)}%;width:${Math.max(2,sc(e.m+e.sd)-sc(e.m-e.sd))}%"></i><i class="wk-avg" style="left:${sc(e.m)}%"></i>`:''}${has?`<i class="wk-bar" style="width:${Math.max(3,sc(e.drop))}%;background:${c}"></i>`:''}</div><span>${has?Math.round(e.drop)+'%':'<small>weight changed</small>'}</span></div>`}).join('')}
    <div class="wk-axis"><span></span><div><small>0%</small><small>25%</small><small>50%</small></div><span></span></div></div><div class="wk-leg"><i style="background:#d95926"></i>Reps lost, set 1 to 3${E.some(e=>e.m!=null)?'<i class="sq" style="background:#3a3a36"></i>Your usual range':''}</div>`;
  const Bh=!worst?'Nothing to compare today<small>The weight changed between sets on every lift</small>':worst.m!=null&&worst.drop>worst.m+worst.sd?`${nm(worst.name)} dropped ${Math.round(worst.drop)}% of its reps<small>Usually ${Math.round(worst.m)}%</small>`:E.every(e=>e.m!=null)?'Every lift held up as usual<small>Reps lost from set 1 to set 3</small>':`${nm(worst.name)} dropped the most<small>${Math.round(worst.drop)}% of its reps by set 3</small>`;
  // D: volume against last time
  const vol=s=>s.reduce((a,x)=>a+(+x.w||0)*x.r,0);const V=E.map(e=>({e,t:vol(e.sets),p:e.prev?vol(e.prev.e.sets):null}));const vmax=Math.max(1,...V.flatMap(v=>[v.t,v.p||0]));
  const D=`<div class="wk-rows">${V.map(v=>{const ch=v.p?(v.t/v.p-1)*100:null;return `<div class="wk-row"><b>${nm(v.e.name)}</b><div class="wk-vol">${v.p!=null?`<i style="width:${v.p/vmax*100}%;background:#3a3a36"></i>`:''}<i style="width:${v.t/vmax*100}%;background:${ch==null||ch>=0?'#199e70':'#d95926'}"></i></div><span>${ch==null?'<small>first</small>':(ch>=0?'+':'')+Math.round(ch)+'%'}</span></div>`}).join('')}</div>
    <div class="wk-leg"><i class="sq" style="background:#3a3a36"></i>Last time<i class="sq" style="background:#199e70"></i>Today, weight × reps</div>`;
  const VT=V.filter(v=>v.p),tt=VT.reduce((a,v)=>a+v.t,0),tp=VT.reduce((a,v)=>a+v.p,0);const Dh=VT.length&&tp?`${Math.abs(Math.round((tt/tp-1)*100))}% ${tt>=tp?'more':'less'} work than last time<small>Weight × reps, on lifts you\'ve done before</small>`:'First time for these lifts<small>Next time you\'ll see the comparison</small>';
  // E: rest against reps kept, today on top of your usual
  const hp=[];before.filter(h=>(h.start||0)>(rec.start||Date.now())-120*DAY).forEach(h=>h.ex.forEach(x=>{const s=(x.sets||[]).filter(q=>q.r>0);if(!s.length)return;s.slice(1).forEach(q=>{if(q.rest&&(+q.w||0)===(+s[0].w||0))hp.push({x:q.rest/1000,y:q.r/s[0].r*100})})}));
  const tp2=[];E.forEach(e=>e.sets.slice(1).forEach((q,j)=>{if(q.rest&&(+q.w||0)===(+e.sets[0].w||0))tp2.push({x:q.rest/1000,y:q.r/e.sets[0].r*100,col:e.col,set:j+2,n:e.name})}));
  const fit=hp.length>=20?logFit(hp.map(p=>Math.max(15,p.x)),hp.map(p=>p.y)):null;const h=170,pl=34,pr=10,pt=12,pb=22,x0=30,x1=300,yt=[50,75,100];
  const X=v=>pl+(Math.min(x1,Math.max(x0,v))-x0)/(x1-x0)*(W-pl-pr),Y=v=>pt+(1-(Math.min(115,Math.max(45,v))-45)/70)*(h-pt-pb);
  let Es=`<svg class="ch" viewBox="0 0 ${W} ${h}">`+gridY(yt,Y,v=>v+'%',pl);hp.forEach(p=>Es+=`<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="2.2" fill="#3a3a37"/>`);
  if(fit){const C=[];for(let x=x0;x<=x1;x+=5)C.push([X(x),Y(fit.f(x))]);Es+=`<path d="${pathOf(C)}" fill="none" stroke="#8a8980" stroke-width="1.6" stroke-dasharray="4 3"/>`}
  tp2.forEach(p=>Es+=mark(X(p.x),Y(p.y),p.set===2?'c':'t',p.col,4.8)+tipC(X(p.x),Y(p.y),`<b>${esc(p.n)}</b> · set ${p.set}<br>${mmss(p.x)} rest · ${Math.round(p.y)}% of set 1`,9));
  [60,120,180,240,300].forEach(v=>Es+=xLab(X(v),h,mmss(v)));Es+='</svg>';
  const Ekeys=`<div class="wk-leg">${E.map(e=>`<i style="background:${e.col}"></i>${nm(e.name.split(' ').slice(0,2).join(' '))}`).join('')}${fit?'<i class="ln"></i>Your usual':''}</div>`;
  const kept=tp2.length?avg(tp2.map(p=>p.y)):null,exp=fit&&tp2.length?avg(tp2.map(p=>fit.f(Math.max(15,p.x)))):null;
  const Eh=kept==null?'No timed rests to show<small>Needs sets at the same weight as set 1</small>':exp!=null?`You kept ${Math.round(kept)}% of your set 1 reps<small>Usually ${Math.round(exp)}% after rests this long</small>`:`You kept ${Math.round(kept)}% of your set 1 reps<small>On average after each rest</small>`;
  return{drop:{h:Bh,body:B},sets:{h:Ah,body:A},vol:{h:Dh,body:D},rest:{h:Eh,body:Es+Ekeys}}}
function workoutSheet(rec,title){if(!rec)return;const V=wkViews(rec);const T=[['drop','Drop-off'],['sets','Sets'],['vol','Volume'],['rest','Rest']];
  const sum=`${clock(rec.total||0)} in the gym · ${rec.sets||rec.ex.reduce((a,e)=>a+e.sets.length,0)} sets · ${clock(rec.tut||0)} under tension · ${clock(rec.rest||0)} resting`;
  const s=sheet(`<h3>${esc(title||'Workout saved')}</h3><p>${sum}</p><div class="wk-card"><div class="wk-seg">${T.map(([k,l],i)=>`<button data-wkv="${k}" class="${i?'':'on'}">${l}</button>`).join('')}</div>
    <div class="wk-stack">${T.map(([k],i)=>`<div class="wk-v${i?' off':''}" data-wkp="${k}"><div class="wk-h">${V[k].h}</div>${V[k].body}</div>`).join('')}</div></div><button class="btn w" style="width:100%" data-close>Done</button>`);
  s.querySelectorAll('[data-wkv]').forEach(b=>b.onclick=e=>{e.stopPropagation();s.querySelectorAll('[data-wkv]').forEach(x=>x.classList.toggle('on',x===b));s.querySelectorAll('[data-wkp]').forEach(p=>p.classList.toggle('off',p.dataset.wkp!==b.dataset.wkv))});return s}
window.workoutSheet=workoutSheet;
(function(){const st=document.createElement('style');st.textContent=`
.wk-card{background:#141413;border-radius:20px;padding:12px 12px 10px;margin:12px 0 14px;border-top:3px solid #199e70;min-width:0}
.wk-stack{display:grid}.wk-stack>.wk-v{grid-area:1/1;min-width:0}.wk-stack>.wk-v.off{visibility:hidden;pointer-events:none}
.wk-seg{display:flex;gap:3px;background:#222221;border-radius:12px;padding:3px;margin-bottom:10px}
.wk-seg button{flex:1;min-width:0;padding:7px 0;border-radius:9px;font-weight:800;font-size:12.5px;color:var(--t3);white-space:nowrap}
.wk-seg button.on{background:var(--t1);color:#111}
.wk-h{font-size:17px;font-weight:900;letter-spacing:-.3px;line-height:1.2;margin:0 2px 10px}.wk-h small{font-size:13px}
.wk-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.wk-mc{background:#1f1f1e;border-radius:12px;padding:8px 8px 4px;min-width:0}
.wk-mc svg{display:block;width:100%;height:auto}
.wk-mh{display:flex;justify-content:space-between;gap:6px;font-size:12px;font-weight:800}
.wk-mh b{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wk-mh span{flex:none}
.wk-rows{display:flex;flex-direction:column;gap:9px}
.wk-row{display:grid;grid-template-columns:minmax(0,96px) minmax(0,1fr) 44px;align-items:center;gap:8px;font-size:12.5px}
.wk-row b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:800}
.wk-row>span{text-align:right;font-weight:900;font-size:13px}.wk-row small{font-size:10.5px;color:var(--t3);font-weight:700}
.wk-track{position:relative;height:18px;border-radius:5px;background:#1f1f1e;overflow:hidden}
.wk-track .wk-band{position:absolute;top:0;bottom:0;background:#3a3a36;border-radius:4px}
.wk-track .wk-avg{position:absolute;top:0;bottom:0;width:2px;margin-left:-1px;background:#8a8980}
.wk-track .wk-bar{position:absolute;left:0;top:5px;height:8px;border-radius:4px}
.wk-axis{display:grid;grid-template-columns:minmax(0,96px) minmax(0,1fr) 44px;gap:8px}.wk-axis div{display:flex;justify-content:space-between}.wk-axis small{font-size:9.5px;color:var(--t3);font-weight:700}
.wk-vol{display:flex;flex-direction:column;gap:3px}.wk-vol i{display:block;height:7px;border-radius:4px;min-width:3px}
.wk-leg{display:flex;flex-wrap:wrap;align-items:center;gap:4px 12px;font-size:11px;font-weight:800;color:var(--t2);margin-top:10px}
.wk-leg i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:-7px;border:1.5px solid #f0efec}.wk-leg i.sq{border-radius:3px;border:0}.wk-leg i.ln{width:14px;height:0;border:0;border-top:2px dashed #8a8980;border-radius:0}
.wk-mini .wk-leg{display:none}.wk-hint{font-size:12px;color:var(--t3);font-weight:700;margin-top:10px}
`;document.head.appendChild(st)})();


function lockHTML(id,acc,force){const isC=id.startsWith('custom');const [have,need,unit]=force||(NEEDS[isC?'custom':id]||(()=>[1,1,'']))();if(!force&&have>=need)return null;
  const name=isC?'Custom chart':CARDS[id].name;const left=need-have;const lift=isC||(CARDS[id]&&CARDS[id].perLift);
  // say it in workouts: how many more sessions it should take, from how fast this kind of data has come in so far
  let msg;if(unit==='tod')msg='Shows once you\'ve trained at a few different times of day';else if(/^(month|week)/.test(unit))msg=`Unlocks after ${left} more ${plural(left,unit.replace(/ of .*/,''))}`;
  else{const sess=lift?new Set(exSets().map(r=>r.si)).size:HIST.length;const rate=sess&&have?have/sess:1;const n=Math.max(1,Math.ceil(left/Math.max(rate,.25)));
    msg=`Unlocks after ${n} more ${lift&&ex?esc(ex)+' ':''}${n===1?'workout':'workouts'}`}
  return `<div class="an-card" data-lock="1" data-lockid="${id}"><span class="an-bar" style="background:${acc}"></span>${edit?`<div class="an-ctl"><button data-up="${id}" aria-label="Move up">↑</button><button data-rm="${id}" aria-label="Remove">×</button></div>`:''}<div class="an-k" style="color:${acc}">${name.toUpperCase()}</div>
    <div class="an-lock" style="margin-top:10px"><b><svg viewBox="0 0 16 16" class="an-lk"><rect x="3" y="7" width="10" height="7.5" rx="2" fill="currentColor"/><path d="M5.3 7V5.2a2.7 2.7 0 0 1 5.4 0V7" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>${msg}</b><span>${Math.min(99,Math.round(have/need*100))}% of the way there</span><div class="an-pb"><i style="width:${Math.min(100,have/need*100)}%"></i></div></div>${!isC&&CARDS[id].desc?`<div class="an-why">${esc(CARDS[id].desc)}.</div>`:''}</div>`}
function cardHTML(id){const isC=id.startsWith('custom');const D=isC?{hex:'#f0efec'}:CARDS[id];if(!D)return'';const acc=isC?'#f0efec':(D.hex||LCOL[ex]);
  if(!isC&&D.perLift&&!ex)return'';const lk=lockHTML(id,acc);if(lk)return lk;
  let c;try{c=isC?customMake(...id.split(':').slice(1)):D.make()}catch(err){console.error(err);return ''}
  if(c&&c.lock&&!c.custom&&!(c.series||[]).some(S=>S.pts&&S.pts.length))return lockHTML(id,acc,c.lock);
  const ctl=edit?`<div class="an-ctl"><button data-up="${id}" aria-label="Move up">↑</button><button data-rm="${id}" aria-label="Remove">×</button></div>`:`<span class="an-more">i</span>`;
  const axes=isC?`<div class="an-axes"><button data-ax="x" data-id="${id}"><small>X</small>${MET[c.xk].l} ▾</button><button data-ax="y" data-id="${id}"><small>Y</small>${MET[c.yk].l} ▾</button></div>`:'';
  const pill=!isC&&D.perLift&&tab==='overview'&&LIFTS.length>1?`<button class="an-lp" data-lp><i style="background:${LCOL[ex]}"></i>${esc(ex)} ▾</button>`:'';
  return `<div class="an-card${edit?' ed':''}" data-card="${id}"><span class="an-bar" style="background:${acc}"></span>${ctl}<div class="an-krow"><div class="an-k" style="color:${acc}">${c.k}</div>${pill}</div><h3>${c.h}</h3>${axes}${c.custom||chart(c,isC?LCOL[ex]:acc)}</div>`}

/* ===== Overview: rings, encouragement, medals ===== */
const TIER=[['Bronze','#c27c48'],['Silver','#b9bcc2'],['Gold','#e2b23c'],['Platinum','#7fd6e6']];
function weekStart(t){const d=new Date(t);d.setHours(0,0,0,0);d.setDate(d.getDate()-wd(d));return d.getTime()}
const target=()=>{const n=Array.isArray(week)?week.filter(isW).length:0;return n||3};
function weekRuns(){// weeks Monday to Sunday from your first session, sessions counted per week
  if(!HIST.length)return[];const out=[];const first=weekStart(HIST[0].start),last=weekStart(Date.now());let i=0;
  for(let w=first;w<=last;w=weekStart(w+8*DAY)){const e=weekStart(w+8*DAY);const ss=HIST.filter(S=>S.start>=w&&S.start<e);out.push({w,n:ss.length,end:ss.length?ss[ss.length-1].start:w})}return out}
function liftTrend(){// best set in the last 30 days against the best set 60 to 90 days ago
  return LIFTS.map(n=>{const R=SETS.filter(r=>r.ex===n&&r.w>0);const a=R.filter(r=>r.start>NOW-90*DAY&&r.start<=NOW-60*DAY),b=R.filter(r=>r.start>NOW-30*DAY);
    if(!a.length||!b.length)return null;const x=Math.max(...a.map(r=>r.e1)),y=Math.max(...b.map(r=>r.e1));const g=(y/x-1)*100;return{n,x,y,g,s:g>=1?'up':g<=-1?'down':'flat'}}).filter(Boolean)}
function ring(parts,total,center,sub){// parts: [[value,colour]], drawn as a donut
  const R=48,C=2*Math.PI*R;let o=`<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="${R}" fill="none" stroke="#262624" stroke-width="13"/>`;let at=0;const gap=parts.filter(p=>p[0]>0).length>1?4:0;
  parts.forEach(([v,c])=>{if(!(v>0)||!total)return;const len=Math.max(0,v/total*C-gap);o+=`<circle cx="60" cy="60" r="${R}" fill="none" stroke="${c}" stroke-width="13" stroke-linecap="${gap?'butt':'round'}" stroke-dasharray="${len.toFixed(2)} ${C}" stroke-dashoffset="${(-at).toFixed(2)}" transform="rotate(-90 60 60)"/>`;at+=v/total*C});
  return o+`<text x="60" y="62" text-anchor="middle" font-size="${String(center).length>4?(String(center).length>5?18:21):28}" font-weight="900" fill="#f0efec" font-family="Inter,system-ui">${center}</text><text x="60" y="82" text-anchor="middle" font-size="11.5" font-weight="700" fill="#a9a89f" font-family="Inter,system-ui">${sub}</text></svg>`}
function achievements(){// every tier is dated from your own history
  const sess=HIST.map(S=>S.start);const runs=weekRuns();const T=Math.min(3,target());
  const list=[];const mk=(id,name,unit,tiers,series,fmt)=>{const val=series.length?series[series.length-1].v:0;list.push({id,name,unit,tiers,val,fmt,dates:tiers.map(t=>{const hit=series.find(p=>p.v>=t);return hit?hit.t:null})})};
  // nothing here climbs on its own: every badge is about showing up
  const P=target();let kept=0;const keptS=[];const cur=weekStart(Date.now());
  runs.forEach(r=>{if(r.n>=P&&(r.w<cur||r.n>=P)){kept++;keptS.push({t:r.end,v:kept})}});
  mk('kept','Kept weeks','wk',[4,12,26,52],keptS,v=>v+' wk');
  let run=0,best=0;const streak=[];runs.forEach(r=>{run=r.n>=T?run+1:r.w>=cur?run:0;if(run>best){best=run;streak.push({t:r.end,v:best})}});
  mk('streak','Week streak','wk',[4,8,16,26],streak,v=>v+' wk');
  mk('sessions','Showed up','',[10,50,100,250],sess.map((t,i)=>({t,v:i+1})),v=>Math.round(v));
  let mu=0;const mks=[];HIST.forEach(S=>{if(S.makeup){mu++;mks.push({t:S.start,v:mu})}});
  mk('makeups','Made it up','',[1,5,15,30],mks,v=>Math.round(v));
  return list}
function medalSVG(tierIdx){const c=tierIdx>=0?TIER[tierIdx][1]:'#2e2e2c';const ring=tierIdx>=0?'#f0efec':'#46463f';
  return `<svg viewBox="0 0 40 40"><path d="M20 3l14.7 8.5v17L20 37 5.3 28.5v-17z" fill="${c}" stroke="${ring}" stroke-width="1.8" stroke-linejoin="round"/>${tierIdx>=0?`<path d="M20 12.5l2.3 4.8 5.2.7-3.8 3.6.9 5.2-4.6-2.5-4.6 2.5.9-5.2-3.8-3.6 5.2-.7z" fill="#121212" opacity=".55"/>`:''}</svg>`}
const tierOf=a=>a.tiers.reduce((k,t,i)=>a.val>=t?i:k,-1);
/* ---- one pie, you choose what it shows ---- */
const PIES=[['plan','Showing up'],['time','Gym time'],['muscle','Muscles'],['ratio','Work : rest'],['cardio','Cardio']];
let pieK=S.get('gym.pie','plan');if(!PIES.some(p=>p[0]===pieK))pieK='plan';
const pct=(a,b)=>b?Math.round(a/b*100):0;
function pieData(k){const D28=NOW-28*DAY;
  if(k==='plan'){// last 12 weeks against the plan you have now; this week only counts days already gone
    const P=target();const runs=weekRuns().slice(-12);const cur=weekStart(Date.now());const t=wd(new Date());
    const due=r=>r.w<cur?P:Math.max(0,Array.isArray(week)?week.slice(0,t+1).filter(isW).length:0);
    let plan=0,done=0;runs.forEach(r=>{const d=due(r);plan+=d;done+=Math.min(r.n,d)});if(!plan)return null;
    return{parts:[[done,'#199e70','Done'],[plan-done,'#c46a35','Missed']],c:done+'/'+plan,cs:'planned',h:`You kept ${pct(done,plan)}% of your plan over ${runs.length} week${runs.length>1?'s':''}.`,note:'Make-ups count as done.'}}
  const R=HIST.filter(S=>S.start>=D28);
  if(k==='time'){const T=R.reduce((a,S)=>a+S.total,0);if(!T||!R.length)return null;const U=R.reduce((a,S)=>a+S.tut,0),Rs=R.reduce((a,S)=>a+S.rest,0),W=R.reduce((a,S)=>a+S.warm,0),C=R.reduce((a,S)=>a+(S.cardio?S.cardio.ms:0),0);const O=Math.max(0,T-U-Rs-W-C);
    const parts=[[U,'#199e70','Lifting'],[Rs,'#c46a35','Resting'],[O,'#6b6b66','Between exercises']];if(W)parts.push([W,'#7a5fb0','Warm up']);if(C)parts.push([C,CCOL,'Cardio']);
    const big=parts.slice(1).reduce((a,b)=>b[0]>a[0]?b:a);
    return{parts,c:Math.round(T/R.length/60000)+'m',cs:'per session',h:`${pct(big[0],T)}% of your gym time is ${big[2].toLowerCase()}.`,note:'Last 4 weeks.'}}
  if(k==='muscle'){const by={};SETS.filter(r=>r.start>=D28).forEach(r=>{by[r.group]=(by[r.group]||0)+1});const L=Object.entries(by).sort((a,b)=>b[1]-a[1]);const n=L.reduce((a,b)=>a+b[1],0);if(!n)return null;
    const top=L.slice(0,5),rest=L.slice(5).reduce((a,b)=>a+b[1],0);const parts=top.map(([g,v])=>[v,(typeof GC!=='undefined'&&GC[g])||'#8a8980',g]);if(rest)parts.push([rest,'#6b6b66','Other']);
    const lo=top[top.length-1];return{parts,c:n,cs:'sets',h:top.length>1?`${top[0][0]} get${top[0][0].endsWith('s')?'':'s'} ${pct(top[0][1],n)}% of your sets. ${lo[0]} ${lo[0].endsWith('s')?'get':'gets'} ${pct(lo[1],n)}%.`:`All your sets are ${top[0][0]}.`,note:'Last 4 weeks.'}}
  if(k==='cardio'){const L=R.filter(S=>S.cardio);if(!L.length)return null;const by={};L.forEach(S=>{by[S.cardio.eq]=(by[S.cardio.eq]||0)+S.cardio.ms});
    const E=Object.entries(by).sort((a,b)=>b[1]-a[1]);const T=E.reduce((a,b)=>a+b[1],0);const parts=E.map(([q,v],i)=>[v,CPAL[i%CPAL.length],q]);
    return{parts,c:Math.round(T/6e4),cs:'cardio min',h:E.length>1?`${E[0][0]} is ${pct(E[0][1],T)}% of your cardio, across ${L.length} session${L.length>1?'s':''}.`:`All ${Math.round(T/6e4)} minutes on the ${E[0][0].toLowerCase()}, across ${L.length} session${L.length>1?'s':''}.`,note:'Last 4 weeks.'}}
  if(k==='ratio'){const S2=SETS.filter(r=>r.start>=D28&&r.tut>0&&r.rest>0);if(S2.length<3)return null;const w=avg(S2.map(r=>r.tut)),rs=avg(S2.map(r=>r.rest));
    return{parts:[[w,'#199e70','Work'],[rs,'#c46a35','Rest']],c:'1:'+(rs/w).toFixed(1),cs:'work : rest',h:`About ${Math.round(w)} s of work for ${mmss(rs)} of rest each set.`,note:'Last 4 weeks, timed sets only.'}}
  return null}
function pieHTML(){const d=pieData(pieK);const tot=d?d.parts.reduce((a,p)=>a+p[0],0):1;
  const chips=`<div class="an-pchips">${PIES.map(([k,l])=>`<button data-pie="${k}" class="${k===pieK?'on':''}">${l}</button>`).join('')}</div>`;
  if(!d)return `<div class="an-pie"><div class="an-pring">${ring([],1,'–','not enough yet')}</div><div class="an-ph">Log a few more workouts and this fills in.</div>${chips}</div>`;
  return `<div class="an-pie"><div class="an-pring">${ring(d.parts.map(p=>[p[0],p[1]]),tot,d.c,d.cs)}</div><div class="an-ph">${d.h}</div>
    <div class="an-pl">${d.parts.filter(p=>p[0]>0).map(p=>`<span><i style="background:${p[1]}"></i>${p[2]} ${pct(p[0],tot)}%</span>`).join('')}</div><div class="an-pn">${d.note}</div>${chips}</div>`}
function overviewTop(){const T=target();const ws=weekStart(Date.now());const done=HIST.filter(S=>S.start>=ws).length;const left=Math.max(0,T-done);
  const lt=liftTrend();const pie=pieHTML();
  const A=achievements();const next=A.map(a=>{const k=tierOf(a);if(k>=a.tiers.length-1)return null;const need=a.tiers[k+1];return{a,k:k+1,need,frac:a.val/need}}).filter(Boolean).sort((x,y)=>y.frac-x.frac)[0];
  const best=lt.length?lt.reduce((x,y)=>y.g>x.g?y:x,lt[0]):null;
  const cheer=left===0?'Week done. Nice work.':done===0?`${T} on the plan this week.`:`${left} more to finish the week.`;
  const noun={sessions:n=>n+' workout'+(n===1?'':'s'),streak:n=>n+' week'+(n===1?'':'s'),kept:n=>n+' kept week'+(n===1?'':'s'),makeups:n=>n+' make-up'+(n===1?'':'s')};
  const sub=next&&next.frac>=.75?`${noun[next.a.id](Math.ceil(next.need-next.a.val))} from ${TIER[next.k][0]}`:best&&best.g>=1?`${best.n} up ${best.g.toFixed(0)}% lately`:'';
  const medals=A.map(a=>{const k=tierOf(a);const nx=a.tiers[k+1];const prev=k>=0?a.tiers[k]:0;const pct=nx?Math.min(100,(a.val-prev)/(nx-prev)*100):100;const col=k>=0?TIER[k][1]:'#46463f';
    return `<button class="an-medal" data-medal="${a.id}">${medalSVG(k)}<b>${a.name}</b><span class="an-mv">${a.fmt(a.val)}</span><span class="an-pb2"><i style="width:${pct}%;background:${nx?TIER[k+1][1]:col}"></i></span><small>${nx?a.fmt(nx-a.val)+' to '+TIER[k+1][0]:'Maxed'}</small></button>`}).join('');
  return `${pie}<div class="an-cheer">${cheer}${sub?`<div style="font-size:14px;font-weight:700;color:#a9a89f;margin-top:3px">${sub}</div>`:''}</div><div class="an-sec">ACHIEVEMENTS</div><div class="an-ach">${medals}</div><div class="an-sec">CHARTS</div>`}
function ringDrill(kind){if(kind==='week'){const runs=weekRuns().slice(-12);const T=target();const pts=runs.map((r,i)=>({x:i,y:r.n,r}));const hit=runs.filter(r=>r.n>=T).length;
    return{k:'CONSISTENCY',acc:'#199e70',h:`${hit} of last ${runs.length} weeks on plan`,chart:{series:[{col:'#199e70',pts,tip:p=>`<b>Week of ${fmtDate(p.r.w)}</b><br>${p.y} session${p.y===1?'':'s'}`}],xr:[0,Math.max(1,pts.length-1)],yt:[0,Math.max(T,...pts.map(p=>p.y))],xt:[0,pts.length-1],xfmt:i=>i===pts.length-1?'This wk':fmtDate(runs[i].w),yfmt:v=>v,ht:150},
      facts:[[T,'a week on your plan'],[avg(runs.map(r=>r.n)).toFixed(1),'average, last 12 weeks']]}}
  const lt=liftTrend().sort((a,b)=>b.g-a.g);
  return{k:'STRENGTH',acc:'#3987e5',h:`${lt.filter(l=>l.s==='up').length} of ${lt.length} lifts up`,rows:lt.map(l=>[l.n,`${l.x.toFixed(0)} → ${l.y.toFixed(0)} ${U()}`,`<span style="color:${l.s==='up'?'#6d9eea':l.s==='down'?'#e66767':'#c98500'}">${l.g>=0?'+':''}${l.g.toFixed(0)}%</span>`]),
    p:['Best estimated max in the last 30 days against 60 to 90 days ago. Within 1% counts as steady.']}}
function medalSheet(id){const a=achievements().find(x=>x.id===id);const k=tierOf(a);
  ansheet(`<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">${medalSVG(k).replace('<svg','<svg style="width:52px;height:52px"')}<div><div class="an-k" style="color:${k>=0?TIER[k][1]:'#8a8980'}">${k>=0?TIER[k][0].toUpperCase():'NOT YET'}</div><h3 style="margin:2px 0 0">${a.name}: ${a.fmt(a.val)}</h3></div></div>
    ${a.tiers.map((t,i)=>`<div class="an-tier${a.dates[i]?' got':''}">${medalSVG(a.dates[i]?i:-1)}<b>${TIER[i][0]}</b><span style="color:#a9a89f;font-weight:700;margin-left:6px">${a.fmt(t)}</span><span>${a.dates[i]?fmtDate(a.dates[i])+" '"+String(new Date(a.dates[i]).getFullYear()).slice(2):a.fmt(t-a.val)+' to go'}</span></div>`).join('')}
    <p style="margin-top:10px;font-size:13px;color:#8a8980">${{sessions:'Every workout you logged.',streak:`Weeks in a row with ${Math.min(3,target())} or more workouts. The week you're in doesn't break it.`,kept:`Weeks where you did all ${target()} planned workouts. Make-ups count.`,makeups:'Missed workouts you came back and did.'}[id]}</p>`)}
function liftPick(){const{sh,close}=ansheet(`<h3>Lift</h3>${LIFTS.map(n=>`<button class="an-opt${n===ex?' on':''}" data-pl="${esc(n)}"><span class="an-sw"><i style="width:14px;height:14px;border-radius:50%;background:${LCOL[n]};border:2px solid #f0efec"></i></span><span><b>${esc(n)}</b></span>${n===ex?'<span class="an-st" style="color:#111">✓</span>':''}</button>`).join('')}`);
  sh.querySelectorAll('[data-pl]').forEach(b=>b.onclick=()=>{ex=b.dataset.pl;S.set('gym.anEx',ex);close();render()})}
function statsHTML(){anRefresh();DRILLS=[];
  const seg=`<div class="an-seg">${[['overview','Overview'],['advanced','Advanced']].map(([k,l])=>`<button data-atab="${k}" class="${tab===k?'on':''}">${l}</button>`).join('')}</div>`;
  const head=`<div class="an-hd"><h1>Analytics ${window.DEMO_DATA?'<span class="an-sample" data-sample>SAMPLE DATA</span>':''}</h1><div style="display:flex;gap:8px"><button class="an-editb${edit?' on':''}" data-aedit>${edit?'Done':'Edit'}</button><button class="iconbtn" data-settings aria-label="Settings">${IC.gear}</button></div></div>`;
  if(!HIST.length)return head+seg+`<div class="an-nolift"><b>Nothing to show yet</b>Finish your first workout and your charts start filling in. Time the sets you can, since a lot of these charts use time under tension and rest.</div>`;
  const noEx=tab==='advanced'&&!ex;
  return head+seg+(tab==='overview'?overviewTop():LIFTS.length?`<div class="an-exdd"><button data-lp><span>Lift</span><i style="background:${LCOL[ex]}"></i><b>${esc(ex)}</b><em>▾</em></button></div>`:'')
    +(noEx?`<div class="an-nolift"><b>Log a few more sets</b>Once an exercise with weight has 6 or more sets, it shows up here.</div>`:lists[tab].map(cardHTML).join(''))+`<button class="an-addc" data-aadd>＋ Add a chart</button>`}
function drawChart(){}
function bindAnalytics(A){const $$=s=>A.querySelectorAll(s);const M=$('#main');
  $$('[data-atab]').forEach(b=>b.onclick=()=>{tab=b.dataset.atab;edit=false;render();if(M)M.scrollTop=0;const m=$('#main');if(m)m.scrollTop=0});
  $$('[data-aex]').forEach(b=>b.onclick=()=>{ex=b.dataset.aex;S.set('gym.anEx',ex);render()});
  $$('[data-aedit]').forEach(b=>b.onclick=()=>{edit=!edit;render()});
  $$('[data-pie]').forEach(b=>b.onclick=()=>{pieK=b.dataset.pie;S.set('gym.pie',pieK);render()});
  $$('[data-aadd]').forEach(b=>b.onclick=catalog);
  $$('[data-sample]').forEach(b=>b.onclick=e=>{e.stopPropagation();ansheet(`<div class="an-k" style="color:#8a8980">SAMPLE DATA</div><h3>This preview runs on a made-up year of training.</h3><p>It's ${HIST.length} workouts and ${SETS.length} sets, stored exactly the way the app stores yours. Every number and sentence here is calculated from those sets.</p><p>The sample was built with some patterns in it, like strength fading on very long sets and reps coming back with rest, so the charts have something to find. With your own sets, the charts show whatever your data shows.</p>`)});
  $$('[data-rm]').forEach(b=>b.onclick=e=>{e.stopPropagation();const L=lists[tab];L.splice(L.indexOf(b.dataset.rm),1);saveLists();render()});
  $$('[data-up]').forEach(b=>b.onclick=e=>{e.stopPropagation();const L=lists[tab];const i=L.indexOf(b.dataset.up);if(i>0){[L[i-1],L[i]]=[L[i],L[i-1]];saveLists();render()}});
  $$('[data-ring]').forEach(b=>b.onclick=()=>openDrill(ringDrill(b.dataset.ring)));
  $$('[data-medal]').forEach(b=>b.onclick=()=>medalSheet(b.dataset.medal));
  $$('[data-lp]').forEach(b=>b.onclick=e=>{e.stopPropagation();liftPick()});
  $$('[data-ax]').forEach(b=>b.onclick=e=>{e.stopPropagation();axisPick(b.dataset.id,b.dataset.ax)});
  $$('[data-card]').forEach(c=>c.onclick=e=>{if(e.target.closest('.an-ctl,.an-axes,.an-lp,[data-tip],[data-drill]'))return;const id=c.dataset.card;try{const d=id.startsWith('custom')?customMake(...id.split(':').slice(1)):CARDS[id].make();if(d.open)return d.open();showInsight(d,id.startsWith('custom')?LCOL[ex]:(CARDS[id].hex||LCOL[ex]))}catch(err){console.error(err)}});
}
function ansheet(html){const app=$('#app');const sc=document.createElement('div');sc.className='scrim an-scrim';const sh=document.createElement('div');sh.className='an-sheet';sh.innerHTML='<div class="an-grab"></div><button class="sclose" aria-label="Close">✕</button>'+html;
  sc.appendChild(sh);app.appendChild(sc);const close=()=>sc.remove();sc.addEventListener('click',e=>{if(e.target===sc)close()});sh.querySelector('.sclose').addEventListener('click',e=>{e.stopPropagation();close()});return{sh,close}}
function showInsight(d,acc){const I=d.ins;if(!I)return;const{sh,close}=ansheet(`<div class="an-k" style="color:${acc}">${d.k}</div><h3>${I.h}</h3>${I.facts?`<div class="an-facts">${I.facts.map(([b,s])=>`<div><b>${b}</b><small>${s}</small></div>`).join('')}</div>`:''}${(I.p||[]).map(t=>`<p>${t}</p>`).join('')}<div class="an-src">Based on ${I.n}.</div>`);sh.onclick=close}
function openDrill(d){const acc=d.acc||LCOL[ex];const{sh,close}=ansheet(`<div class="an-k" style="color:${acc}">${d.k}</div><h3>${d.h}</h3>${d.facts?`<div class="an-facts">${d.facts.map(([b,s])=>`<div><b>${b}</b><small>${s}</small></div>`).join('')}</div>`:''}
  ${d.chart?`<div style="background:#151514;border-radius:18px;padding:10px 8px 6px;margin-bottom:12px">${chart(d.chart,acc)}</div>`:''}${d.html||''}
  ${d.rows&&d.rows.length?`<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px">${d.rows.slice(0,40).map(r=>`<div style="display:flex;gap:10px;align-items:center;background:#242423;border-radius:12px;padding:10px 12px;font-size:13.5px"><b style="flex:none;min-width:92px">${r[0]}</b><span style="flex:1;color:#c3c2b7">${r[1]}</span><b>${r[2]||''}</b></div>`).join('')}${d.rows.length>40?`<div class="an-src">and ${d.rows.length-40} more</div>`:''}</div>`:''}
  ${(d.p||[]).map(t=>`<p>${t}</p>`).join('')}`);
  sh.addEventListener('click',e=>{if(e.target.closest('[data-tip]'))return;close()})}
function catalog(){const list=lists[tab];const opts=Object.entries(CARDS).filter(([,c])=>c.tab===tab);
  const icon=`<svg viewBox="0 0 30 30"><path d="M4 22 L11 15 L17 18 L26 7" fill="none" stroke="#f0efec" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="11" cy="15" r="3" fill="currentColor" stroke="#f0efec" stroke-width="1.4"/><circle cx="26" cy="7" r="3.4" fill="currentColor" stroke="#f0efec" stroke-width="1.4"/></svg>`;
  const sub={overview:'Habits and strength over time.',advanced:'What moves your strength. Or build your own.'}[tab];
  const{sh,close}=ansheet(`<h3>Add to ${tab[0].toUpperCase()+tab.slice(1)}</h3><p style="margin:-4px 0 14px;font-size:13.5px;color:#8a8980">${sub}</p>
    ${tab==='advanced'?`<button class="an-opt" data-pick="custom"><span class="an-sw"><svg viewBox="0 0 30 30"><path d="M6 24V6M6 24H24" stroke="#f0efec" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="13" cy="17" r="2.6" fill="#3987e5" stroke="#f0efec" stroke-width="1.3"/><circle cx="19" cy="11" r="2.6" fill="#d95926" stroke="#f0efec" stroke-width="1.3"/></svg></span><span><b>Build your own</b><small>Pick two measures for the X and Y axes</small></span><span class="an-st add">Add</span></button>`:''}
    ${opts.map(([id,c])=>`<button class="an-opt" data-pick="${id}"><span class="an-sw" style="color:${c.hex||LCOL[ex]||'#3987e5'}">${icon}</span><span><b>${c.name}</b><small>${c.desc}</small></span><span class="an-st${list.includes(id)?'':' add'}">${list.includes(id)?'Added':'Add'}</span></button>`).join('')}`);
  sh.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{let id=b.dataset.pick;if(id==='custom'){let n=0;const combos=[['week','e1'],['load','r'],['set','r'],['pace','rel'],['rest','rel'],['tut','rel']];do{id='custom:'+combos[n%combos.length].join(':');n++}while(list.includes(id)&&n<10)}
    if(!list.includes(id)){list.push(id);saveLists();close();render();setTimeout(()=>{const M=$('#main');if(M)M.scrollTo({top:M.scrollHeight,behavior:'smooth'})},50)}})}
function axisPick(id,ax){let[,xk,yk]=id.split(':');if(!ALLOWED[xk])xk='rest';const keys=ax==='x'?XM:ALLOWED[xk];const cur=ax==='x'?xk:yk;
  const{sh,close}=ansheet(`<h3>${ax==='x'?'X axis':'Y axis'}</h3>${ax==='y'?`<p style="margin:-4px 0 12px;font-size:13.5px;color:#8a8980">Only measures that pair usefully with ${MET[xk].l.toLowerCase()}.</p>`:''}${keys.map(k=>`<button class="an-opt${k===cur?' on':''}" data-m="${k}"><span><b>${MET[k].l}</b>${ax==='x'?`<small>${ALLOWED[k].map(y=>MET[y].l).join(', ')}</small>`:''}</span>${k===cur?'<span class="an-st" style="color:#111">✓</span>':''}</button>`).join('')}`);
  sh.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{const L=lists[tab];let nx=xk,ny=yk;if(ax==='x'){nx=b.dataset.m;if(!ALLOWED[nx].includes(ny))ny=ALLOWED[nx][0]}else ny=b.dataset.m;const nid='custom:'+nx+':'+ny;if(L.includes(nid)&&nid!==id){close();return}L[L.indexOf(id)]=nid;saveLists();close();render()})}
// tooltips and tap-to-drill, set up once
const antip=document.createElement('div');antip.className='an-tip';document.body.appendChild(antip);
document.addEventListener('pointerover',e=>{const t=e.target.closest&&e.target.closest('[data-tip]');if(!t){antip.style.display='none';return}
  antip.innerHTML=t.getAttribute('data-tip');const r=t.getBoundingClientRect();antip.style.left=Math.min(innerWidth-120,Math.max(120,r.left+r.width/2))+'px';antip.style.top=r.top+r.height/2+'px';antip.style.display='block'});
document.addEventListener('pointerdown',e=>{if(!(e.target.closest&&e.target.closest('[data-tip]')))antip.style.display='none'});
document.addEventListener('scroll',()=>antip.style.display='none',{capture:true,passive:true});
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-drill]');if(!t)return;e.stopPropagation();e.preventDefault();antip.style.display='none';const fn=DRILLS[+t.dataset.drill.slice(1)];if(!fn)return;
  document.querySelectorAll('.an-scrim').forEach(x=>x.remove());try{openDrill(fn())}catch(err){console.error(err)}},true);

window.anCanBack=()=>edit||tab==='advanced';window.anBack=()=>{if(edit)edit=false;else tab='overview';render();const m=$('#main');if(m)m.scrollTop=0};
window.statsHTML=statsHTML;window.drawChart=drawChart;window.bindAnalytics=bindAnalytics;window.anReset=()=>{anKey=''};
})();
