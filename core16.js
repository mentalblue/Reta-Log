(function(){const C=typeof module!=='undefined'?require('./core.js'):Core;
const originalDays=C.weightDays;
C.weightDays=function(rows,mode='average'){
 return originalDays(rows).map(r=>{if(mode!=='latest')return {...r,mode:'average'};const last=r.rows.at(-1);return {...r,t:last.t,weight:last.weight,mode:'latest'};});
};
C.selectedWeights=(rows,mode)=>C.weightDays(rows,mode).map(r=>({id:'day-'+r.key,at:new Date(r.t).toISOString(),values:{weight:r.weight}}));
C.weekBuckets=function(entries,now=Date.now()){
 const rows=entries.filter(e=>(!e.status||e.status==='taken')&&Date.parse(e.at)<=now).sort(C.entryOrder);if(!rows.length)return [];
 const first=new Date(rows[0].at);first.setHours(0,0,0,0);
 const daySerial=t=>{const d=new Date(t);return Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/C.DAY;},offset=daySerial(first),count=Math.floor((daySerial(now)-offset)/7)+1;
 return Array.from({length:count},(_,i)=>{const start=new Date(first);start.setDate(start.getDate()+7*i);const end=new Date(start);end.setDate(end.getDate()+7);const list=rows.filter(e=>Date.parse(e.at)>=+start&&Date.parse(e.at)<+end);return {number:i+1,start:+start,end:+end,entries:list,total:list.reduce((s,e)=>s+ +e.mg,0)};});
};
// Journey periods share the first confirmed dose's local calendar day.
const originalProgress=C.progress;
C.progress=function(entries,measurements,now=Date.now()){
 const weeks=C.weekBuckets(entries,now),start=weeks[0]?.start;
 const rows=start===undefined?[]:measurements.filter(m=>Date.parse(m.at)>=start&&Date.parse(m.at)<=now);
 const p=originalProgress(entries,rows,now);
 p.firstDose=start??null;p.baselineAt=rows.filter(m=>+m.values?.weight>0).sort((a,b)=>Date.parse(a.at)-Date.parse(b.at))[0]?.at||null;
 if(start===undefined){p.days=0;return p;}
 const serial=t=>{const d=new Date(t);return Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/C.DAY;};
 p.days=serial(now)-serial(start)+1;
 const weights=rows.filter(m=>Number.isFinite(+m.values?.weight)&&+m.values.weight>0).sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));
 const group=(a,b,number)=>{const rs=weights.filter(m=>Date.parse(m.at)>=a&&Date.parse(m.at)<b);return rs.length?{start:a,end:b,number,count:rs.length,from:rs[0].values.weight,to:rs.at(-1).values.weight,change:rs.length>1?rs.at(-1).values.weight-rs[0].values.weight:null}:null;};
 p.weekly=weeks.map(w=>group(w.start,w.end,w.number)).filter(Boolean);
 const first=new Date(start),boundary=i=>{const d=new Date(first);d.setDate(1);d.setMonth(d.getMonth()+i);const last=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();d.setDate(Math.min(first.getDate(),last));return +d;};
 p.monthly=[];for(let i=0;boundary(i)<=now;i++){const g=group(boundary(i),boundary(i+1));if(g)p.monthly.push(g);}
 return p;
};
C.macros=function(p){
 const weight=C.positive(p.weight,'Weight'),height=C.positive(p.height,'Height'),age=C.positive(p.age,'Age'),activity=C.positive(p.activity,'Activity'),deficit=C.num(p.deficit||0);
 if(deficit<0||deficit>40)throw Error('Choose a deficit between 0 and 40%.');
 const bmr=10*weight+6.25*height-5*age+(p.sex==='female'?-161:5),maintain=bmr*activity,calories=Math.round(maintain*(1-deficit/100));
 const basis=p.proteinBasis==='target'?'target':'current',reference=basis==='target'?C.positive(p.target,'Target weight for protein'):weight;
 const low=basis==='target'?1.5:p.resistance?1.4:1.2,high=basis==='target'?2.2:p.resistance?2:1.6;
 const min=Math.round(reference*low),max=Math.round(reference*high),automatic=p.macroMode==='auto';
 const protein=automatic?Math.round(reference*(basis==='target'?1.8:p.resistance?1.6:1.4)):C.positive(p.protein,'Protein');
 const carbs=automatic?(p.keto?Math.min(30,Math.round(calories*.05/4)):Math.round(calories*.45/4)):C.num(p.carbs);
 if(!Number.isFinite(carbs)||carbs<0)throw Error('Carbohydrates must be zero or positive.');
 const fat=(calories-4*protein-4*carbs)/9;
 if(calories<=0||fat<0||automatic&&fat*9/calories<.15)throw Error('These targets leave too little energy for fat. Reduce the deficit, adjust the weight basis or use Custom targets.');
 return {bmr:Math.round(bmr),maintain:Math.round(maintain),calories,protein,carbs,fat:Math.round(fat*10)/10,bmi:weight/(height/100)**2,min,max,basis,reference,low,high,proteinPct:protein*4/calories*100,carbPct:carbs*4/calories*100,fatPct:fat*9/calories*100};
};
C.luminance=function(hex){let v=hex.replace('#','');if(v.length===3)v=v.split('').map(c=>c+c).join('');const a=[0,2,4].map(i=>parseInt(v.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return a[0]*.2126+a[1]*.7152+a[2]*.0722;};
C.contrast=(a,b)=>{const x=C.luminance(a),y=C.luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
C.inkFor=bg=>C.contrast(bg,'#ffffff')>C.contrast(bg,'#102030')?'#ffffff':'#102030';
if(typeof module!=='undefined')module.exports=C;
})();
