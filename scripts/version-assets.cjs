const fs=require('node:fs');
const path=require('node:path');
const{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..');
const source=path.join(root,'dist','index.html');
const original=fs.readFileSync(source,'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'dist','manifest.webmanifest'),'utf8'));
manifest.icons.forEach(icon=>{
  const file=icon.src.split('?')[0];
  const hash=createHash('sha256').update(fs.readFileSync(path.join(root,'dist',file))).digest('hex').slice(0,12);
  icon.src=`${file}?v=${hash}`;
});
for(const dir of [root,path.join(root,'dist')])fs.writeFileSync(path.join(dir,'manifest.webmanifest'),JSON.stringify(manifest,null,2)+'\n');
const versioned=original.replace(/((?:src|href)=")([^"?#]+\.(?:js|css|png|svg|webmanifest))(?:\?[^"#]*)?(")/g,(match,prefix,file,suffix)=>{
  if(/^(?:https?:)?\/\//.test(file))return match;
  const contents=fs.readFileSync(path.join(root,'dist',file));
  const version=createHash('sha256').update(contents).digest('hex').slice(0,12);
  return `${prefix}${file}?v=${version}${suffix}`;
});
fs.writeFileSync(source,versioned);
fs.writeFileSync(path.join(root,'index.html'),versioned);
console.log('Static asset versions updated from content hashes.');
const refs=[...versioned.matchAll(/(?:src|href)="([^"#]+)"/g)].map(match=>match[1]);
const local=refs.filter(file=>!file.startsWith('/')&&!/^(?:[a-z]+:|#)/i.test(file)&&fs.existsSync(path.join(root,'dist',file.split('?')[0])));
const cssAssets=[];
for(const file of local.filter(file=>/\.css(?:\?|$)/.test(file))){
  const css=fs.readFileSync(path.join(root,'dist',file.split('?')[0]),'utf8');
  for(const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)){
    if(/^(?:[a-z]+:|\/)/i.test(match[1]))continue;
    const asset=path.posix.join(path.posix.dirname(file.split('?')[0]),match[1]);
    if(fs.existsSync(path.join(root,'dist',asset.split('?')[0])))cssAssets.push(asset);
  }
}
const assets=[...new Set(['index.html',...local,...cssAssets,...manifest.icons.map(icon=>icon.src),'assets/apple-touch-symbol.png'])].sort();
const fingerprint=createHash('sha256');
const template=fs.readFileSync(path.join(__dirname,'sw-template.js'),'utf8');
fingerprint.update(template);
for(const file of assets){fingerprint.update(file);fingerprint.update(fs.readFileSync(path.join(root,'dist',file.split('?')[0])));}
const worker=template.replace('__BUILD__',fingerprint.digest('hex').slice(0,16)).replace('__PRECACHE__',JSON.stringify(assets,null,2));
for(const dir of [root,path.join(root,'dist')])fs.writeFileSync(path.join(dir,'sw.js'),worker);
console.log(`Offline app shell generated with ${assets.length} local resources.`);
