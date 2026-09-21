const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.RETA_CHROME,args:['--no-sandbox']});
 const p=await browser.newPage({viewport:{width:412,height:860}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('http://reta.test/**',async r=>{const n=new URL(r.request().url()).pathname,f=path.join(__dirname,'../app/src/main/assets',n==='/'?'index.html':n);await r.fulfill({body:fs.readFileSync(f),contentType:f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':'text/html'});});
 await p.goto('http://reta.test/');await p.waitForTimeout(400);await p.getByRole('button',{name:'Explore first',exact:true}).click();
 await p.evaluate(()=>{
 S.settings.theme='dark';S.measurements=[{id:'m1',at:'2026-09-12T10:00:00Z',values:{weight:89.25}},{id:'m2',at:'2026-09-14T10:00:00Z',values:{weight:88.7}},{id:'m3',at:'2026-09-16T10:00:00Z',values:{weight:88.35}}];navigate('insights');
 window.labels=[];const original=CanvasRenderingContext2D.prototype.fillText;CanvasRenderingContext2D.prototype.fillText=function(text,...args){if(/kg$/.test(text))window.labels.push(text);return original.call(this,text,...args)};
 chart.start=Date.parse('2026-09-11');chart.end=Date.parse('2026-09-18');chart.draw();
 });
 assert.deepEqual((await p.evaluate(()=>window.labels)).filter(x=>x!=='kg').sort(),['88.35 kg','88.70 kg','89.25 kg']);
 await p.screenshot({path:'/tmp/reta151-labels.png'});
 await p.evaluate(()=>{chart.picked=Date.parse('2026-09-14T10:00:00Z');window.labels=[];chart.draw()});assert.ok((await p.evaluate(()=>window.labels)).includes('88.70 kg'));
 await p.setViewportSize({width:860,height:412});await p.waitForTimeout(200);assert.ok(await p.evaluate(()=>document.body.classList.contains('full-chart')));
 assert.deepEqual(errors,[]);await browser.close();console.log('Exact weight labels passed: zoom, selected point, two decimals, portrait and landscape.');
})().catch(e=>{console.error(e);process.exit(1)});
