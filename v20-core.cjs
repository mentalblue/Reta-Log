const assert=require('node:assert/strict'),C=require('../app/src/main/assets/core20.js');
const base={schema:2,entries:[],measurements:[],vials:[],reminders:[],feelings:[],batches:[],profile:{},settings:{}};
let s=C.validateStore(structuredClone(base));assert.equal(s.uxV2,undefined);
s.uxV2={version:1,activity:[{id:'a',at:new Date().toISOString(),title:'Walk',minutes:30,steps:2000}],notes:[{id:'n',at:new Date().toISOString(),note:'Observation'}],equipment:[{id:'e',at:new Date().toISOString(),name:'Needles',type:'needle',quantity:10,low:3}]};
const raw=JSON.stringify(s);assert.deepEqual(C.validateStore(JSON.parse(raw)),s);
for(const mutate of [x=>x.uxV2.version=2,x=>x.uxV2.activity[0].steps=-1,x=>x.uxV2.activity[0].steps=1.5,x=>x.uxV2.activity.push({...x.uxV2.activity[0]}),x=>x.uxV2.notes[0].note='',x=>x.uxV2.equipment[0].quantity=-1,x=>x.profile.targetFat=101]){const x=structuredClone(s);mutate(x);assert.throws(()=>C.validateStore(x));}
assert.equal(JSON.stringify(s),raw);console.log('V2 extension: absent extension unchanged, backup roundtrip, ID/date/count validation, invalid extension rejection.');
