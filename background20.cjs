const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const assets=path.join(__dirname,'../app/src/main/assets');
const css=fs.readFileSync(path.join(assets,'design20.css'),'utf8');
const image=path.join(assets,'peptide-background.png');
assert.ok(fs.statSync(image).size>1_000_000,'peptide background asset is missing or incomplete');
assert.match(css,/body\.new-design\[data-theme\]\{[\s\S]*url\('peptide-background\.png'\)/,'background must be scoped to New design');
assert.match(css,/body\.new-design\[data-theme\]\.dark[\s\S]*url\('peptide-background\.png'\)/,'dark New design needs the wallpaper');
for(const cssFile of ['style.css','style18.css','design19.css'])assert.ok(!fs.readFileSync(path.join(assets,cssFile),'utf8').includes('peptide-background.png'),`${cssFile} must keep Classic independent`);
console.log('Peptide background asset and New-design-only CSS scope verified.');
