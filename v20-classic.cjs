const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const assets=path.join(__dirname,'../app/src/main/assets');const baseline=process.env.RETA_BASELINE_ASSETS;
(async()=>{
const browser=await chromium.launch({executablePath:process.env.RETA_CHROME,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:412,height:915}}),errors=[];
page.on('pageerror',e=>{errors.push(e.message);console.error('PAGE ERROR',e.message)});
let baselineMode=false;await page.addInitScript(()=>{const RealDate=Date;window.Date=class extends RealDate{constructor(...a){super(...(a.length?a:[1790010000000]));}static now(){return 1790010000000;}};});
await page.route('http://reta.test/**',r=>{const n=new URL(r.request().url()).pathname,f=path.join(baselineMode?baseline:assets,n==='/'?'index.html':n);return r.fulfill({body:f.endsWith('.js')?fs.readFileSync(f,'utf8').replaceAll('1.9.0','2.0.0'):fs.readFileSync(f),contentType:f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':f.endsWith('.ttf')?'font/ttf':f.endsWith('.png')?'image/png':'text/html'});});
await page.goto('http://reta.test/');await page.waitForTimeout(450);await page.evaluate(()=>{closeModal();S.onboarded=true;S.settings.legalSeen=legalVersion;S.settings.design='new';S.settings.theme='dark';S.profile={name:'Test user',sex:'male',weight:89,target:80,height:173,age:50,activity:1.375,deficit:15,macroMode:'auto'};S.settings.waterTarget=2200;S.settings.waterLogging=true;S.settings.proteinLogging=true;S.vials=[{id:'v',name:'Retatrutide',type:'vial',mg:10,volume:2},{id:'bac',name:'BAC Water',type:'water',volume:10,usedMl:1,multidose:true,openedAt:new Date(Date.now()-26*Core.DAY).toISOString()}];S.entries=[{id:'d1',at:new Date(Date.now()-3*Core.DAY).toISOString(),mg:1,vial:'v'},{id:'d2',at:new Date(Date.now()-Core.DAY).toISOString(),mg:1.5,vial:'v'},{id:'plan',at:new Date(Date.now()+2*Core.DAY).toISOString(),mg:1.5,status:'planned',vial:'v'}];S.measurements=Array.from({length:31},(_,i)=>({id:'m'+i,at:new Date(Date.now()-(30-i)*Core.DAY).toISOString(),source:'Test scale',values:{weight:92-i*.1,fat:33-i*.05,muscle:58,water:49}}));S.hydration=[{id:'h',at:new Date().toISOString(),ml:300}];S.proteinLog=[{id:'p',at:new Date().toISOString(),grams:52,source:'food',meal:'Test meal'}];S.feelings=[{id:'f',at:new Date().toISOString(),values:{Mood:4,Energy:3},note:'Test check-in'}];S.circumferences=[{id:'c',at:new Date().toISOString(),values:{waist:95,bicepsLeft:34},note:''}];persist();navigate('overview');});

await page.evaluate(()=>{S.settings.design='classic';persist();});
for(const theme of ['light','dark'])for(const route of ['overview','journal','insights','inventory','profile','settings','calculator','learn','wellness','data','reminders']){
 const captures=[];
 for(const baselineFlag of [true,false]){baselineMode=baselineFlag;await page.reload();await page.evaluate(([t,r])=>{S.settings.design='classic';S.settings.theme=t;S.settings.legalSeen=legalVersion;navigate(r)},[theme,route]);await page.evaluate(()=>document.fonts.ready);captures.push(await page.screenshot({fullPage:true}));}
 assert.ok(captures[0].equals(captures[1]),'Classic pixel difference '+theme+'/'+route);
}
assert.deepEqual(errors,[]);await browser.close();console.log('Classic pixel identical to 1.9.0 baseline: 11 routes × light/dark (version label normalized).');
})().catch(e=>{console.error(e);process.exit(1)});
