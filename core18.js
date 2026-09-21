(function(){'use strict';const C=typeof module!=='undefined'?require('./core17.js'):Core;
// Additive schema-2 extension: never coalesce or remove original records.
C.migrate18=function(s){s.settings=s.settings||{};if(s.circumferences===undefined)s.circumferences=[];if(!s.settings.weightMode)s.settings.weightMode=(s.onboarded||(s.measurements||[]).length||(s.entries||[]).length)?'average':'latest';if(!s.settings.design)s.settings.design='classic';return s;};
C.proteinRange=function(p){
 const custom=p.proteinRangeMode==='manual';
 const w=Number(p.target),low=p.proteinKMin==null?1.6:Number(p.proteinKMin),high=p.proteinKMax==null?2.2:Number(p.proteinKMax);
 if(!custom&&!(w>0&&Number.isFinite(w)))return null;
 const min=custom?Number(p.proteinMin):w*low,max=custom?Number(p.proteinMax):w*high;
 if(!Number.isFinite(min)||!Number.isFinite(max)||min<=0||max<min)throw Error('Protein range must be positive, with minimum ≤ maximum.');
 return {min,max,mid:(min+max)/2,low,high,weight:custom?null:w,manual:custom,legacyTarget:p.protein||null};
};
C.targetProgress=function(value,min,max=min){if(!(min>0))return null;const percent=value/min*100;return {value,min,max,percent,fill:Math.min(100,Math.max(0,percent)),remaining:Math.max(0,min-value),remainingPercent:Math.max(0,100-percent),color:value<min*.75?'low':value<min?'almost':'met',label:value<min*.75?'Low':value<min?'Almost there':value<=max?'In target range':'Above target range'};};
const days17=C.weightDays;
C.weightDays=function(rows,mode='latest'){return days17(rows,'average').map(d=>{if(mode==='average')return {...d,mode};const chosen=[...d.rows].sort((a,b)=>mode==='lowest'?(a.weight-b.weight||b.t-a.t):b.t-a.t)[0];return {...d,t:chosen.t,weight:chosen.weight,mode};});};
C.selectedWeights=function(rows,mode){return C.weightDays(rows,mode).map(d=>{const original=mode==='average'?null:rows.find(r=>Date.parse(r.at)===d.t&&Number(r.values?.weight)===d.weight);return original?{...original,values:{...original.values}}:{id:'day-'+d.key,at:new Date(d.t).toISOString(),values:{weight:d.weight},derived:true};});};
C.currentWeight=rows=>[...rows].filter(r=>Number.isFinite(Number(r.values?.weight))&&Number(r.values.weight)>0).sort((a,b)=>Date.parse(b.at)-Date.parse(a.at))[0]||null;
C.localRange=function(from,to){const parse=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s))throw Error('Select both dates.');const [y,m,d]=s.split('-').map(Number),v=new Date(y,m-1,d);if(v.getFullYear()!==y||v.getMonth()!==m-1||v.getDate()!==d)throw Error('Invalid date.');return v;};const a=parse(from),b=parse(to);if(b<a)throw Error('End date must not precede start date.');b.setDate(b.getDate()+1);return {start:+a,end:+b};};
C.unitValue=(value,kind,imperial=false,inverse=false)=>{const f=imperial?({weight:2.2046226218487757,length:1/2.54,water:1/29.5735295625}[kind]||1):1;return inverse?Number(value)/f:Number(value)*f;};
C.bacExpiry=function(v,now=Date.now()){
 if(v.type!=='water')return null;
 const parse=s=>!s?null:/^\d{4}-\d{2}-\d{2}$/.test(s)?C.localRange(s,s).start:Date.parse(s);
 const opened=parse(v.openedAt),factory=parse(v.expiresAt),days=v.afterOpeningDays!=null?Number(v.afterOpeningDays):v.multidose===true?28:null;
 const after=opened!=null&&days>0?opened+days*C.DAY:null,deadline=[factory,after].filter(Number.isFinite).reduce((a,b)=>Math.min(a,b),Infinity);
 const expired=Number.isFinite(deadline)&&now>=deadline,remaining=deadline-now;
 const unknown=!v.openedAt&&(Number(v.usedMl)>0||v.openingUnknown===true);
 return {deadline:Number.isFinite(deadline)?deadline:null,expired,remaining,days:Number.isFinite(deadline)?Math.ceil(remaining/C.DAY):null,state:v.discardedAt?'discarded':expired?'expired':unknown?'unknown':!v.openedAt?'unopened':remaining<=3*C.DAY?'soon':after==null?'unknown':'active',usable:!v.discardedAt&&!expired&&!unknown&&(!v.openedAt||after!=null)};
};
C.calendarDose=function(text){const matches=[...String(text).matchAll(/\b(\d+(?:[.,]\d+)?)\s*mg\b/gi)].map(m=>Number(m[1].replace(',','.')));return matches.length===1&&matches[0]>0?matches[0]:null;};
C.keywordMatch=function(text,keywords,all=false){const terms=String(keywords).split(',').map(x=>x.trim()).filter(Boolean);if(!terms.length)return all;return terms.some(t=>new RegExp('(?:^|[^\\p{L}\\p{N}])'+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=$|[^\\p{L}\\p{N}])','iu').test(text));};
const validate18=C.validateStore;C.validateStore=function(s){validate18(s);const p=s.profile||{};if(p.proteinRangeMode||p.proteinKMin!=null||p.proteinKMax!=null)C.proteinRange(p);for(const v of s.vials||[]){if(v.expiresAt&&!Number.isFinite(Date.parse(v.expiresAt)))throw Error('Invalid factory expiry.');if(v.afterOpeningDays!=null&&(!Number.isFinite(+v.afterOpeningDays)||+v.afterOpeningDays<=0))throw Error('Invalid manufacturer period.');if(v.discardedAmount!=null&&(!Number.isFinite(+v.discardedAmount)||+v.discardedAmount<0))throw Error('Invalid discarded quantity.');}return C.migrate18(s);};
if(typeof module!=='undefined')module.exports=C;
})();
