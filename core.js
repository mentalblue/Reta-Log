(function(root){
'use strict';
const DAY=86400000;
const num=(v)=>Number(String(v).trim().replace(',','.'));
function positive(v,label='Value'){const n=num(v);if(!Number.isFinite(n)||n<=0)throw Error(label+' must be a positive number.');return n;}
function doses(list){return list.filter(x=>x.status!=='planned'&&x.status!=='skipped').map(x=>({t:Date.parse(x.at),mg:Number(x.mg)})).filter(x=>Number.isFinite(x.t)&&Number.isFinite(x.mg)&&x.mg>0).sort((a,b)=>a.t-b.t);}
function amount(ds,t,half=6){const k=Math.log(2)/(half*DAY);return ds.reduce((s,d)=>s+(d.t<=t?d.mg*Math.exp(-k*(t-d.t)):0),0);}
function mean(ds,a,b,half=6){if(!(b>a))return amount(ds,a,half);const k=Math.log(2)/(half*DAY);return ds.reduce((s,d)=>{const start=Math.max(a,d.t);return start<b?s+d.mg*(Math.exp(-k*(start-d.t))-Math.exp(-k*(b-d.t)))/k:s;},0)/(b-a);}
function concentration(m,v,d){m=positive(m,'Vial amount');v=positive(v,'Final volume');d=positive(d,'Amount');if(d>m)throw Error('Amount exceeds the total in the vial.');const c=m/v,ml=d/c;if(!Number.isFinite(c)||!Number.isFinite(ml)||ml<=0)throw Error('Values are outside the supported range.');return {c,ml};}
function parseCSV(text){text=text.replace(/^\uFEFF/,'');const line=text.split(/\r?\n/)[0];let best=',',score=0;for(const delimiter of [',',';','\t']){let q=false,n=0;for(let i=0;i<line.length;i++){if(line[i]==='"')q=!q;else if(!q&&line[i]===delimiter)n++;}if(n>score){score=n;best=delimiter;}}
const rows=[];let row=[],field='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}else if(!quoted&&(c===best||c==='\n'||c==='\r')){row.push(field);field='';if(c!==best){if(c==='\r'&&text[i+1]==='\n')i++;if(row.some(x=>x.trim()))rows.push(row);row=[];}}else field+=c;}if(quoted)throw Error('Unclosed quote in CSV file.');row.push(field);if(row.some(x=>x.trim()))rows.push(row);if(rows.length<2)throw Error('The file needs a header and at least one data row.');return {headers:rows[0],rows:rows.slice(1)};}
function parseDate(s,order='DMY'){s=String(s).trim();if(/^\d{4}-\d\d-\d\d(?:T|[ ]).*?(?:Z|[+-]\d\d:?\d\d)$/.test(s)||/^\d{4}-\d\d-\d\dT/.test(s)){const parts=s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);if(parts){const [,y,m,day,h,min,sec='0']=parts,check=new Date(Date.UTC(+y,+m-1,+day));if(check.getUTCFullYear()!==+y||check.getUTCMonth()!==+m-1||check.getUTCDate()!==+day||+h>23||+min>59||+sec>59)throw Error('Invalid date: '+s);}const d=new Date(s.replace(' ','T'));if(!isNaN(d))return d.toISOString();}
let m=s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[ T]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);let y,mo,day,h=0,min=0,sec=0;
if(m){[,y,mo,day,h=0,min=0,sec=0]=m;}else {m=s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})\.?\s*(?:(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);if(!m)throw Error('Unrecognised date: '+s);y=m[3];const resolved=+m[1]>12?'DMY':+m[2]>12?'MDY':order;mo=m[resolved==='MDY'?1:2];day=m[resolved==='MDY'?2:1];h=m[4]||0;min=m[5]||0;sec=m[6]||0;}
const d=new Date(+y,+mo-1,+day,+h,+min,+sec);if(d.getFullYear()!=+y||d.getMonth()!=+mo-1||d.getDate()!=+day||d.getHours()!=+h||d.getMinutes()!=+min||+sec>59)throw Error('Invalid date: '+s);return d.toISOString();}
const metricNames={weight:'Weight · kg',fat:'Body fat · %',muscle:'Muscle mass · kg',musclePercent:'Muscle mass · %',skeletal:'Skeletal muscle mass · kg',lean:'Lean body mass · kg',bone:'Bone mass · kg',bonePercent:'Bone mass · %',water:'Body water · %',waterMass:'Body water · kg',fatMass:'Body fat mass · kg',visceral:'Visceral fat · index',protein:'Protein · %',subcutaneous:'Subcutaneous fat · %',bmr:'BMR · kcal/day',pulse:'Heart rate · bpm',bodyAge:'Body age',bodyType:'Body type',headSize:'Head size · cm',bmi:'BMI'};
function isTimestamp(v){return /^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}[ T]+\d{1,2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:\s*(?:Z|[+-]\d\d:?\d\d))?$/i.test(String(v||'').trim())||/^\d{4}-\d\d-\d\dT/.test(String(v||'').trim());}
function isDate(v){return /^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}$/.test(String(v||'').trim())||/^\d{1,2}[-/.]\d{1,2}[-/.]\d{4}$/.test(String(v||'').trim());}
function isAmbiguousDate(v){const m=String(v||'').trim().match(/^(\d{1,2})[-/.](\d{1,2})[-/.]\d{4}(?:\s|$)/);return !!m&&+m[1]>0&&+m[1]<=12&&+m[2]>0&&+m[2]<=12&&+m[1]!==+m[2];}
function guessHeader(h,samples=[]){const raw=String(h||''),n=raw.toLowerCase().replace(/[_-]/g,' '),example=samples.find(v=>String(v??'').trim())||'';if(isTimestamp(example))return 'timestamp';if(/skeletal/.test(n))return 'skeletal';if(/lean|fat free/.test(n))return 'lean';if(/subcut/.test(n))return 'subcutaneous';if(/visceral/.test(n))return 'visceral';if(/body.*type/.test(n))return 'bodyType';if(/body.*age|metabolic.*age/.test(n))return 'bodyAge';if(/head.*size/.test(n))return 'headSize';if(/heart|pulse/.test(n))return 'pulse';if(/bmr|basal/.test(n))return 'bmr';if(/bmi/.test(n))return 'bmi';if(/protein/.test(n))return 'protein';if(/bone/.test(n))return /%|percent/.test(n)?'bonePercent':'bone';if(/muscle/.test(n))return /%|percent/.test(n)?'musclePercent':'muscle';if(/water/.test(n))return /kg|mass/.test(n)?'waterMass':'water';if(/fat/.test(n))return /kg|mass/.test(n)?'fatMass':'fat';if(/weight/.test(n))return 'weight';if(/date|timestamp|measurement time/.test(n)||isDate(example))return 'date';if(/^time/.test(n))return 'time';return '';}
function isEufyCsv(headers,rows){const normalized=headers.map(h=>String(h).trim().toUpperCase());return normalized.includes('TIME')&&normalized.includes('FAMILY MEMBERS')&&normalized.includes('WEIGHT (KG)')&&rows.length>0&&isTimestamp(rows[0][normalized.indexOf('TIME')]);}
function csvIdentity(source,person,at,values){const raw=[source,person||'',at,...Object.keys(values).sort().map(k=>k+'='+values[k])].join('|');let h=2166136261;for(let i=0;i<raw.length;i++){h^=raw.charCodeAt(i);h=Math.imul(h,16777619);}return source+':'+(h>>>0).toString(36);}
function macros(p){const weight=positive(p.weight,'Weight'),height=positive(p.height,'Height'),age=positive(p.age,'Age');const bmr=10*weight+6.25*height-5*age+(p.sex==='female'?-161:5);const maintain=bmr*positive(p.activity,'Activity');const deficit=num(p.deficit||0);if(deficit<0||deficit>40)throw Error('Choose a deficit between 0 and 40%.');const calories=Math.round(maintain*(1-deficit/100));const protein=positive(p.protein,'Protein target'),carbs=positive(p.carbs,'Carbohydrate target'),fat=(calories-4*protein-4*carbs)/9;if(fat<0)throw Error('Protein and carbohydrate targets exceed your calorie budget.');return {bmr:Math.round(bmr),maintain:Math.round(maintain),calories,protein,carbs,fat:Math.round(fat),bmi:weight/Math.pow(height/100,2)};}
function validateStore(s){if(!s||!Array.isArray(s.entries))throw Error('Backup has no journal.');if(s.entries.length>20000)throw Error('Too many journal entries.');const ids=new Set();s.entries.forEach(e=>{if(!/^[A-Za-z0-9_-]{1,150}$/.test(e.id||'')||ids.has(e.id)||isNaN(Date.parse(e.at)))throw Error('Invalid or duplicate journal record.');positive(e.mg,'Recorded amount');if(!['planned','skipped'].includes(e.status)&&Date.parse(e.at)>Date.now()+60000)throw Error('A recorded entry is in the future.');ids.add(e.id);});for(const key of ['measurements','vials','reminders','feelings','batches'])if(s[key]!==undefined&&!Array.isArray(s[key]))throw Error('Invalid '+key+' list.');for(const key of ['measurements','vials','reminders','feelings','batches']){const seen=new Set();for(const row of s[key]||[]){if(!row||!/^[A-Za-z0-9_-]{1,150}$/.test(row.id||'')||seen.has(row.id))throw Error('Invalid or duplicate '+key+' identifier.');seen.add(row.id);}}(s.measurements||[]).forEach(m=>{if(isNaN(Date.parse(m.at))||!m.values||typeof m.values!=='object')throw Error('Invalid body measurement.');for(const [k,v] of Object.entries(m.values))if(k!=='bodyType'&&(!Number.isFinite(Number(v))||Number(v)<0))throw Error('Invalid measurement value.');});return s;}
const API={DAY,num,positive,doses,amount,mean,concentration,parseCSV,parseDate,metricNames,guessHeader,isTimestamp,isDate,isAmbiguousDate,isEufyCsv,csvIdentity,macros,validateStore};if(typeof module!=='undefined')module.exports=API;root.Core=API;
})(typeof window!=='undefined'?window:globalThis);
(function(){const C=typeof module!=='undefined'?module.exports:Core;C.progress=function(entries,measurements,now=Date.now()){const ds=C.doses(entries).filter(d=>d.t<=now),w=measurements.filter(m=>Number.isFinite(+m.values?.weight)&&+m.values.weight>0&&Date.parse(m.at)<=now).sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));const first=ds.length?Math.min(...ds.map(d=>d.t)):null;const stats={days:first===null?0:Math.floor((now-first)/C.DAY)+1,entries:ds.length,daysWithEntries:new Set(ds.map(d=>new Date(d.t).toLocaleDateString('en-CA'))).size,totalMg:ds.reduce((s,d)=>s+d.mg,0),firstWeight:w[0]?.values.weight,lastWeight:w.at(-1)?.values.weight,weightChange:w.length>1?w.at(-1).values.weight-w[0].values.weight:null,weekly:[],monthly:[]};for(const period of ['weekly','monthly']){const groups=new Map();for(const m of w){const d=new Date(m.at);d.setHours(0,0,0,0);if(period==='weekly')d.setDate(d.getDate()-(d.getDay()+6)%7);else d.setDate(1);const key=d.getTime();if(!groups.has(key))groups.set(key,[]);groups.get(key).push(m);}stats[period]=[...groups.entries()].map(([start,rows])=>({start,count:rows.length,from:rows[0].values.weight,to:rows.at(-1).values.weight,change:rows.length>1?rows.at(-1).values.weight-rows[0].values.weight:null}));}const recent=w.filter(m=>Date.parse(m.at)>=now-7*C.DAY),previous=w.filter(m=>Date.parse(m.at)>=now-14*C.DAY&&Date.parse(m.at)<now-7*C.DAY);stats.recentMean=recent.length?recent.reduce((s,m)=>s+ +m.values.weight,0)/recent.length:null;stats.previousMean=previous.length?previous.reduce((s,m)=>s+ +m.values.weight,0)/previous.length:null;return stats;};})();

// Goal projection: one mean per local calendar day, recent 28-day linear trend.
(function(){
const C=typeof module!=='undefined'?module.exports:Core;
C.forecast=function(measurements,target,now=Date.now()){
 target=Number(target);if(!Number.isFinite(target)||target<=0)return {status:'no-target'};
 const days=new Map();
 for(const m of measurements){const t=Date.parse(m.at),weight=Number(m.values?.weight);if(!Number.isFinite(t)||t>now||t<now-28*C.DAY||!Number.isFinite(weight)||weight<=0)continue;const d=new Date(t);const key=Date.UTC(d.getFullYear(),d.getMonth(),d.getDate());if(!days.has(key))days.set(key,[]);days.get(key).push({weight,t});}
 const rows=[...days].sort((a,b)=>a[0]-b[0]).map(([day,values])=>({day,weight:values.reduce((s,v)=>s+v.weight,0)/values.length,t:Math.max(...values.map(v=>v.t))}));
 if(!rows.length)return {status:'insufficient'};
 const last=rows.at(-1);if(now-last.t>7*C.DAY)return {status:'stale'};
 if(rows.length<5||(last.day-rows[0].day)/C.DAY<14)return {status:'insufficient'};
 const recent=rows.filter(r=>r.day>=last.day-6*C.DAY),current=recent.reduce((s,r)=>s+r.weight,0)/recent.length;
 if(current<=target)return {status:'reached',current};
 const x=rows.map(r=>(r.day-rows[0].day)/C.DAY),xm=x.reduce((s,v)=>s+v,0)/x.length,ym=rows.reduce((s,r)=>s+r.weight,0)/rows.length;
 const slope=rows.reduce((s,r,i)=>s+(x[i]-xm)*(r.weight-ym),0)/x.reduce((s,v)=>s+(v-xm)**2,0);
 if(slope>=-.01)return {status:'no-decline',current,weekly:-slope*7};
 const remaining=Math.ceil((current-target)/-slope);
 if(remaining>730)return {status:'distant',weekly:-slope*7,current};
 return {status:'ready',days:remaining,at:now+remaining*C.DAY,weekly:-slope*7,current,daysObserved:rows.length,span:Math.round((last.day-rows[0].day)/C.DAY),target};
};
})();
(function(){const C=typeof module!=='undefined'?module.exports:Core;
C.parseICS=function(text){
 const blocks=text.replace(/\r?\n[ \t]/g,'').split('BEGIN:VEVENT').slice(1),rows=[];
 const unescape=s=>s.replace(/\\[nN]/g,'\n').replace(/\\([,;\\])/g,'$1');
 for(const block of blocks){const fields={};for(const line of block.split(/\r?\n/)){const i=line.indexOf(':');if(i>0){const key=line.slice(0,i),base=key.split(';')[0];fields[base]={key,value:line.slice(i+1)};}}
 const title=unescape(fields.SUMMARY?.value||''),description=unescape(fields.DESCRIPTION?.value||'');if(!/\b(reta|retatrutid|retatrutide)\b/i.test(title+' '+description))continue;
 if(fields.RRULE)throw Error('This file includes recurring Reta events. Use device calendar import to expand recurring dates accurately.');
 if(!fields.DTSTART)continue;
 const {key,value}=fields.DTSTART,m=value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);if(!m)throw Error('Unsupported calendar date. Use device calendar import.');
 const zone=key.match(/TZID=([^;]+)/)?.[1];if(zone&&zone!==Intl.DateTimeFormat().resolvedOptions().timeZone)throw Error('Calendar uses '+zone+'. Use device calendar import to preserve its timezone.');
 const at=m[7]?new Date(Date.UTC(+m[1],+m[2]-1,+m[3],+m[4],+m[5],+m[6])):new Date(+m[1],+m[2]-1,+m[3],+(m[4]||12),+(m[5]||0),+(m[6]||0));
 if(!Number.isFinite(+at))throw Error('Invalid calendar date.');
 if(+at>Date.now())continue;
 rows.push({title,description,at:at.toISOString(),allDay:!m[4],externalId:'ics:'+(fields.UID?.value||title)+':'+at.toISOString()});
 }
 return rows;
};})();

(function(){const C=typeof module!=='undefined'?module.exports:Core;
C.supplyBalance=function(vial,entries,now=Date.now()){
 const declared=Number(vial.mg),used=entries.filter(e=>e.vial===vial.id&&(!e.status||e.status==='taken')&&Date.parse(e.at)<=now).reduce((s,e)=>s+(Number(e.mg)||0),0);
 return {declared,used,remaining:Math.max(0,declared-used),overdrawn:Math.max(0,used-declared)};
};
// Stable chronology for simultaneous entries; edits do not reorder a timestamp tie.
C.entryOrder=(a,b)=>Date.parse(a.at)-Date.parse(b.at)||String(a.id).localeCompare(String(b.id));
C.supplyBalanceAfter=function(vial,entries,entry){
 return C.supplyBalance(vial,entries.filter(e=>C.entryOrder(e,entry)<=0),Date.parse(entry.at));
};
C.dayKey=function(t){const d=new Date(t);return [d.getFullYear(),d.getMonth()+1,d.getDate()].join('-');};
C.weightDays=function(measurements){
 const groups=new Map();for(const m of measurements){const t=Date.parse(m.at),weight=Number(m.values?.weight);if(!Number.isFinite(t)||!Number.isFinite(weight)||weight<=0)continue;const key=C.dayKey(t);if(!groups.has(key))groups.set(key,[]);groups.get(key).push({t,weight});}
 return [...groups].map(([key,rows])=>({key,t:rows.reduce((s,r)=>s+r.t,0)/rows.length,weight:rows.reduce((s,r)=>s+r.weight,0)/rows.length,count:rows.length,min:Math.min(...rows.map(r=>r.weight)),max:Math.max(...rows.map(r=>r.weight)),rows:rows.sort((a,b)=>a.t-b.t)})).sort((a,b)=>a.t-b.t);
};
})();
