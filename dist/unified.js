const primaryNav=document.getElementById('navigation');
const menuToggle=document.querySelector('.menu-toggle');
const categoryButtons=[...document.querySelectorAll('[data-category-button]')];
const categorySelect=document.getElementById('category-select');
const views=[...document.querySelectorAll('[data-view]')];
const panels=[...document.querySelectorAll('[data-category]')];
const remembered={category:'soluciones',choices:{}};
let currentView=null;
history.scrollRestoration='manual';
function closeNavigation(){primaryNav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.textContent='Menú';}
menuToggle.addEventListener('click',()=>{const open=primaryNav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.textContent=open?'Cerrar':'Menú'});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&primaryNav.classList.contains('open')){closeNavigation();menuToggle.focus({preventScroll:true})}});
document.addEventListener('click',e=>{if(!primaryNav.contains(e.target)&&!menuToggle.contains(e.target))closeNavigation()});
const choiceGroups={};
function addChoices(category,gridSelector,labels){
  const grid=document.querySelector(gridSelector);
  const items=[...grid.children];
  const controls=document.createElement('div');controls.className='item-choices';controls.setAttribute('aria-label',`Opciones de ${category}`);
  const selectLabel=document.createElement('label');selectLabel.className='item-select-label';selectLabel.textContent='Seleccione una opción';
  const select=document.createElement('select');select.setAttribute('aria-label',`Elegir ${category}`);selectLabel.append(select);
  const buttons=items.map((item,i)=>{const name=labels?.[i]||item.querySelector('h3').textContent;const button=document.createElement('button');button.type='button';button.textContent=name;button.dataset.choice=item.id;button.setAttribute('aria-controls',item.id);button.setAttribute('aria-pressed','false');controls.append(button);select.add(new Option(name,item.id));button.addEventListener('click',()=>navigate(`#catalogo/${category}/${item.id}`));return button});
  grid.before(controls,selectLabel);
  select.addEventListener('change',()=>navigate(`#catalogo/${category}/${select.value}`));
  choiceGroups[category]={items,buttons,select};
}
addChoices('clientes','.client-grid');
addChoices('versiones','.version-grid');
addChoices('complementos','.complement-grid');
addChoices('servicios','.service-grid');
function selectChoice(category,id){const group=choiceGroups[category];if(!group)return;const chosen=group.items.find(item=>item.id===id)||group.items.find(item=>item.id===remembered.choices[category])||group.items[0];remembered.choices[category]=chosen.id;group.items.forEach(item=>{item.hidden=item!==chosen});group.buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.choice===chosen.id)));group.select.value=chosen.id;}
function resolveRoute(hash){
  const parts=hash.replace(/^#/,'').split('/');const key=parts[0];
  if(['inicio','nosotros','contacto'].includes(key))return{view:key};
  if(key==='contenido')return{view:currentView||'inicio',category:remembered.category};
  if(key==='catalogo')return{view:'catalogo',category:panels.some(p=>p.dataset.category===parts[1])?parts[1]:remembered.category,choice:parts[2]};
  if(panels.some(p=>p.dataset.category===key))return{view:'catalogo',category:key};
  const prefixes={'version-':'versiones','complemento-':'complementos','cliente-':'clientes','servicio-':'servicios'};
  for(const [prefix,category]of Object.entries(prefixes))if(key.startsWith(prefix))return{view:'catalogo',category,choice:key};
  return{view:'inicio'};
}
function showRoute(hash,focus=false){
  const route=resolveRoute(hash);const changedView=route.view!==currentView;currentView=route.view;
  views.forEach(view=>{view.hidden=view.dataset.view!==route.view});
  if(route.view==='catalogo'){
    remembered.category=route.category;panels.forEach(panel=>{panel.hidden=panel.dataset.category!==route.category});
    categoryButtons.forEach(button=>{const selected=button.dataset.categoryButton===route.category;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1});categorySelect.value=route.category;
    selectChoice(route.category,route.choice);
    if(route.category==='soluciones'&&modules[route.choice])selectModule(document.querySelector(`[data-module="${route.choice}"]`));
  }
  primaryNav.querySelectorAll('a').forEach(a=>{const selected=a.hash===`#${route.view}`;a.classList.toggle('current',selected);if(selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  closeNavigation();
  document.title=`${{inicio:'Análisis MBC · Software empresarial',catalogo:'Soluciones y servicios · Análisis MBC',nosotros:'Nuestra empresa · Análisis MBC',contacto:'Contacto · Análisis MBC'}[route.view]}`;
  // Changing a category replaces its content in place. Only changing the screen resets reading position, without animation.
  if(changedView||focus)window.scrollTo({top:0,left:0,behavior:'instant'});
  if(focus)document.getElementById('contenido').focus({preventScroll:true});
}
function navigate(hash,focus=false){if(location.hash!==hash)history.pushState({},'',hash);showRoute(hash,focus);}
categoryButtons.forEach((button,index)=>{button.addEventListener('click',()=>navigate(`#catalogo/${button.dataset.categoryButton}`));button.addEventListener('keydown',e=>{let next;if(['ArrowRight','ArrowDown'].includes(e.key))next=(index+1)%categoryButtons.length;if(['ArrowLeft','ArrowUp'].includes(e.key))next=(index+categoryButtons.length-1)%categoryButtons.length;if(e.key==='Home')next=0;if(e.key==='End')next=categoryButtons.length-1;if(next!==undefined){e.preventDefault();categoryButtons[next].click();categoryButtons[next].focus({preventScroll:true})}})});
categorySelect.addEventListener('change',()=>navigate(`#catalogo/${categorySelect.value}`));
document.addEventListener('click',e=>{
  const link=e.target.closest('a');if(!link||!link.getAttribute('href')?.startsWith('#')||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;
  e.preventDefault();
  if(link.dataset.consult){const message=document.querySelector('textarea[name="mensaje"]');if(!message.value.trim()||message.dataset.suggested==='true'){message.value=`Me interesa recibir información sobre ${link.dataset.consult}.`;message.dataset.suggested='true'}}
  const hash=link.dataset.heroModule?`#catalogo/soluciones/${link.dataset.heroModule}`:link.hash;
  navigate(hash,true);
});
document.querySelector('textarea[name="mensaje"]').addEventListener('input',e=>{e.target.dataset.suggested='false'});
document.querySelectorAll('[data-sector]').forEach((button,i)=>button.addEventListener('click',()=>{document.querySelector('.sector-number').textContent=String(i+1).padStart(2,'0')}));
window.addEventListener('popstate',()=>showRoute(location.hash,true));window.addEventListener('hashchange',()=>showRoute(location.hash,true));
showRoute(location.hash||'#inicio');

