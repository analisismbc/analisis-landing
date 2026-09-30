const servicesTrigger=document.querySelector('.services-trigger');
const servicesMenu=document.getElementById('services-menu');
const megaClose=document.querySelector('.mega-close');
const servicesSymbol=servicesTrigger.querySelector('span');
function closeServices(restore=false){
  servicesMenu.hidden=true;
  servicesTrigger.setAttribute('aria-expanded','false');
  servicesSymbol.textContent='+';
  document.body.classList.remove('services-open');
  if(restore)(servicesTrigger.getClientRects().length?servicesTrigger:toggle).focus();
}
servicesTrigger.addEventListener('click',()=>{
  if(!servicesMenu.hidden){closeServices(true);return;}
  servicesMenu.hidden=false;
  servicesMenu.scrollTop=0;
  servicesTrigger.setAttribute('aria-expanded','true');
  servicesSymbol.textContent='−';
  document.body.classList.add('services-open');
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded','false');
  toggle.textContent='Menú';
  servicesMenu.querySelector('a').focus({preventScroll:true});
});
megaClose.addEventListener('click',()=>closeServices(true));
servicesMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeServices()));
document.addEventListener('click',e=>{if(!servicesMenu.hidden&&!servicesMenu.contains(e.target)&&!servicesTrigger.contains(e.target))closeServices()});
document.addEventListener('keydown',e=>{
  if(servicesMenu.hidden)return;
  if(e.key==='Escape'){e.preventDefault();closeServices(true);return;}
  if(e.key==='Tab'){
    const controls=[...servicesMenu.querySelectorAll('a,button')];
    const first=controls[0],last=controls[controls.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
});
toggle.addEventListener('click',()=>closeServices());
document.querySelectorAll('[data-catalog-module]').forEach(link=>link.addEventListener('click',()=>document.querySelector(`[data-module="${link.dataset.catalogModule}"]`).click()));
document.querySelectorAll('[data-catalog-sector]').forEach(link=>link.addEventListener('click',()=>document.querySelector(`[data-sector="${link.dataset.catalogSector}"]`).click()));
document.addEventListener('click',e=>{
  const link=e.target.closest('[data-consult]');
  if(!link)return;
  const message=document.querySelector('textarea[name="mensaje"]');
  if(!message.value.trim()||message.dataset.suggested==='true'){
    message.value=`Me interesa recibir información sobre ${link.dataset.consult}.`;
    message.dataset.suggested='true';
  }
});
document.querySelector('textarea[name="mensaje"]').addEventListener('input',e=>{e.target.dataset.suggested='false'});
