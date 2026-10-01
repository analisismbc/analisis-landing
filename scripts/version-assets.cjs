const fs=require('node:fs');
const path=require('node:path');
const{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..');
const source=path.join(root,'dist','index.html');
const original=fs.readFileSync(source,'utf8');
const versioned=original.replace(/((?:src|href)=")([^"?#]+\.(?:js|css))(?:\?[^"#]*)?(")/g,(match,prefix,file,suffix)=>{
  if(/^(?:https?:)?\/\//.test(file))return match;
  const contents=fs.readFileSync(path.join(root,'dist',file));
  const version=createHash('sha256').update(contents).digest('hex').slice(0,12);
  return `${prefix}${file}?v=${version}${suffix}`;
});
fs.writeFileSync(source,versioned);
fs.writeFileSync(path.join(root,'index.html'),versioned);
console.log('Static asset versions updated from content hashes.');
