const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const assets=path.join(__dirname,'../app/src/main/assets');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.RETA_CHROME,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:412,height:915}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('http://reta.test/**',r=>{const n=new URL(r.request().url()).pathname,f=path.join(assets,n==='/'?'index.html':n);return r.fulfill({body:fs.readFileSync(f),contentType:f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':f.endsWith('.ttf')?'font/ttf':f.endsWith('.png')?'image/png':'text/html'});});
 await page.goto('http://reta.test/');await page.waitForTimeout(400);await page.getByRole('button',{name:'Explore first',exact:true}).click();
 await page.evaluate(()=>{S.profile={name:'Roland',weight:88.6,target:80,height:173,age:52,activity:1.375,deficit:15,macroMode:'auto'};S.settings.legalSeen=legalVersion;S.settings.waterLogging=true;S.settings.proteinLogging=true;S.settings.waterTarget=2200;S.vials=[{id:'v',name:'Retatrutide 10 mg',type:'vial',mg:10,ml:2},{id:'b',name:'Bacteriostatic water',type:'water',mg:0,volume:10},{id:'p',name:'Disposable pen',type:'pen',mg:20,ml:3}];S.entries=[{id:'e1',at:new Date(Date.now()-2*Core.DAY).toISOString(),mg:1.5,vial:'v'},{id:'e2',at:new Date(Date.now()-5*Core.DAY).toISOString(),mg:1,vial:'v'}];S.measurements=Array.from({length:8},(_,i)=>({id:'m'+i,at:new Date(Date.now()-(7-i)*Core.DAY).toISOString(),source:'Manual',values:{weight:90-i*.2}}));S.settings.design='new';S.settings.depth=true;persist();navigate('overview');});
 await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.evaluate(()=>document.fonts.check('16px Manrope')),true);
 const records=await page.evaluate(()=>JSON.stringify([S.entries,S.vials,S.measurements,S.hydration,S.proteinLog]));
 for(const theme of ['light','dark']) {
  await page.evaluate(t=>{S.settings.theme=t;render();},theme);
  for(const route of ['overview','journal','insights','inventory','profile','settings','calculator','learn','wellness','data','reminders']) {
   await page.evaluate(r=>navigate(r),route);
   for(const width of [320,412,915]){
    await page.setViewportSize({width,height:width===915?412:915});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${theme}/${route}/${width}: overflow`);
    const positions=await page.locator('#app>nav>button').evaluateAll(es=>es.map(e=>Math.round(e.getBoundingClientRect().top)));
    assert.equal(new Set(positions).size,1,`${route}: navigation rows`);
   }
   await page.setViewportSize({width:412,height:915});
   if(['overview','inventory','insights','journal','settings'].includes(route))await page.screenshot({path:`/tmp/reta19-${theme}-${route}.png`,fullPage:true});
  }
  await page.evaluate(()=>navigate('overview'));
  const deep=await page.locator('.card').nth(1).evaluate(e=>getComputedStyle(e).boxShadow);
  await page.evaluate(()=>setSetting('depth',false));
  const flat=await page.locator('.card').nth(1).evaluate(e=>getComputedStyle(e).boxShadow);
  assert.notEqual(flat,'none');assert.notEqual(flat,deep);
  await page.evaluate(()=>setSetting('depth',true));
  await page.evaluate(()=>navigate('settings'));
  await page.getByRole('button',{name:'Violet',exact:true}).first().click();
  assert.equal(await page.evaluate(()=>S.settings.newAccent),'#7141d8');
  await page.getByRole('button',{name:'Blue · Indigo',exact:true}).click();
  await page.evaluate(()=>{editEntry();});
  assert.ok(await page.locator('#modal .sheet input').count()>0);
  await page.evaluate(()=>closeModal());
 }
 // Switch through the real control, reload and ensure records and preference survive.
 await page.evaluate(()=>navigate('settings'));
 await page.locator('#new-design').uncheck();assert.equal(await page.locator('body.new-design').count(),0);
 await page.locator('#new-design').check();await page.reload();
 assert.equal(await page.evaluate(()=>S.settings.design),'new');
 assert.equal(await page.evaluate(()=>JSON.stringify([S.entries,S.vials,S.measurements,S.hydration,S.proteinLog])),records);
 // Compare Classic screenshots with and without the new stylesheet: pixel identical.
 for(const theme of ['light','dark']) {
  await page.evaluate(t=>{S.settings.design='classic';S.settings.theme=t;navigate('overview');},theme);
  const withCSS=await page.screenshot();
  await page.evaluate(()=>document.querySelector('link[href="design19.css"]').disabled=true);
  const withoutCSS=await page.screenshot();assert.ok(withCSS.equals(withoutCSS),`Classic ${theme} changed by new CSS`);
  await page.evaluate(()=>document.querySelector('link[href="design19.css"]').disabled=false);
 }
 assert.deepEqual(errors,[]);await browser.close();console.log('New design checks passed: 11 routes × 2 themes × 3 widths, font, glow/3D, accent, forms, persistent comparison, unchanged records and pixel-identical Classic CSS.');
})().catch(e=>{console.error(e);process.exit(1)});
