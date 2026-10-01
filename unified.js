const primaryNav=document.getElementById('navigation');
const menuToggle=document.querySelector('.menu-toggle');
const categoryButtons=[...document.querySelectorAll('[data-category-button]')];
const categoryPicker=createPicker(document.getElementById('category-picker'),{
  id:'category-select',label:'Categoría',
  options:categoryButtons.map(button=>({value:button.dataset.categoryButton,label:button.textContent})),
  onChange:category=>navigate(`#catalogo/${category}`)
});
const views=[...document.querySelectorAll('[data-view]')];
const panels=[...document.querySelectorAll('[data-category]')];
const catalogHeadings={"clientes":["Empresas y contadores","Opciones para administrar su empresa o las contabilidades de sus clientes."],"soluciones":["Módulos enlace soft®","Cuatro áreas para administrar su empresa."],"versiones":["Versiones de enlace soft®","Elija el enfoque según su operación."],"licenciamiento":["Licenciamiento","Suscripción en nube o instalación local."],"sectores":["Sectores","Soluciones según los procesos de su industria."],"complementos":["Complementos","Funciones especializadas para ampliar enlace soft®."],"servicios":["Servicios","Implementación, capacitación, soporte y desarrollo a medida."]};
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
  const pickerContainer=document.createElement('div');pickerContainer.className='item-select-label';
  const options=items.map((item,i)=>({value:item.id,label:labels?.[i]||item.querySelector('h2,h3').textContent}));
  const buttons=items.map((item,i)=>{const button=document.createElement('button');button.type='button';const icon=document.createElement('span');icon.className='control-symbol';icon.setAttribute('aria-hidden','true');icon.innerHTML=pickerIcon(item.id);const text=document.createElement('span');text.className='control-label';text.textContent=options[i].label;button.append(icon,text);button.dataset.choice=item.id;button.setAttribute('aria-controls',item.id);button.setAttribute('aria-pressed','false');controls.append(button);button.addEventListener('click',()=>navigate(`#catalogo/${category}/${item.id}`));return button});
  grid.before(controls,pickerContainer);
  const picker=createPicker(pickerContainer,{id:`choice-${category}`,label:({clientes:'Tipo de cliente',versiones:'Versión',complementos:'Área',servicios:'Servicio'})[category],options,onChange:id=>navigate(`#catalogo/${category}/${id}`)});
  choiceGroups[category]={items,buttons,picker};
}
addChoices('clientes','.client-grid');
addChoices('versiones','.version-grid');
addChoices('complementos','.complement-grid');
addChoices('servicios','.service-grid');
function selectChoice(category,id){const group=choiceGroups[category];if(!group)return;const chosen=group.items.find(item=>item.id===id)||group.items.find(item=>item.id===remembered.choices[category])||group.items[0];remembered.choices[category]=chosen.id;group.items.forEach(item=>{item.hidden=item!==chosen});group.buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.choice===chosen.id)));group.picker.setValue(chosen.id);}
function resolveRoute(hash){
  const parts=hash.replace(/^#/,'').split('/');const key=parts[0];
  if(key==='herramientas')return{view:'herramientas',tool:parts[1]?.split('?')[0]||'asesor'};
  if(key==='blog')return{view:'blog',article:parts[1]||null};
  if(['inicio','nosotros','contacto'].includes(key))return{view:key};
  if(key==='contenido')return{view:currentView||'inicio',category:remembered.category,choice:remembered.choices[remembered.category],tool:document.querySelector('[data-tool][aria-selected=true]')?.dataset.tool||'asesor'};
  if((key==='catalogo'&&parts[1]==='apps')||key==='apps'||key==='apps-moviles')return{view:'catalogo',category:'servicios',choice:'servicio-apps'};
  if(key==='catalogo')return{view:'catalogo',category:panels.some(p=>p.dataset.category===parts[1])?parts[1]:remembered.category,choice:parts[2]};
  if(panels.some(p=>p.dataset.category===key))return{view:'catalogo',category:key};
  const prefixes={'version-':'versiones','complemento-':'complementos','cliente-':'clientes','servicio-':'servicios'};
  for(const [prefix,category]of Object.entries(prefixes))if(key.startsWith(prefix))return{view:'catalogo',category,choice:key};
  return{view:'inicio'};
}
function showRoute(hash,focus=false){
  closePickers();
  const route=resolveRoute(hash);const changedView=route.view!==currentView;currentView=route.view;document.documentElement.dataset.view=route.view;
  views.forEach(view=>{view.hidden=view.dataset.view!==route.view});
  if(route.view==='catalogo'){
    remembered.category=route.category;document.getElementById('catalog-title').textContent=catalogHeadings[route.category][0];document.getElementById('catalog-intro').textContent=catalogHeadings[route.category][1];panels.forEach(panel=>{panel.hidden=panel.dataset.category!==route.category});
    categoryButtons.forEach(button=>{const selected=button.dataset.categoryButton===route.category;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1});categoryPicker.setValue(route.category);
    selectChoice(route.category,route.choice);
    if(route.category==='soluciones'&&modules[route.choice])selectModule(document.querySelector(`[data-module="${route.choice}"]`));
  }
  primaryNav.querySelectorAll('a').forEach(a=>{const selected=a.getAttribute('href')===`#${route.view}`;a.classList.toggle('current',selected);if(selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  closeNavigation();
  document.title=`${{inicio:'Análisis MBC · Software empresarial',catalogo:'Soluciones y servicios · Análisis MBC',herramientas:'Encuentre su solución · Análisis MBC',nosotros:'Nuestra empresa · Análisis MBC',contacto:'Contacto · Análisis MBC',blog:'Blog · Análisis MBC'}[route.view]}`;
  if(route.view==='herramientas')window.SiteTools?.show(route.tool);
  if(route.view==='catalogo'&&route.category==='complementos'){
    const detail=hash.split('/')[3];if(detail){const compatible=detail==='extra-archivos-bancarios-para-pago'?`${detail}-${route.choice?.replace('complemento-','')||'personas'}`:detail;const item=document.getElementById(compatible);if(item?.tagName==='DETAILS'&&item.closest('[data-category="complementos"]'))item.open=true;}
  }
  // Changing a category replaces its content in place. Only changing the screen resets reading position, without animation.
  if(changedView||focus)window.scrollTo({top:0,left:0,behavior:'instant'});
  if(focus)document.getElementById('contenido').focus({preventScroll:true});
  document.dispatchEvent(new CustomEvent('routechange',{detail:route}));
}
function navigate(hash,focus=false){if(location.hash!==hash)history.pushState({},'',hash);showRoute(hash,focus);}
categoryButtons.forEach((button,index)=>{button.addEventListener('click',()=>navigate(`#catalogo/${button.dataset.categoryButton}`));button.addEventListener('keydown',e=>{let next;if(['ArrowRight','ArrowDown'].includes(e.key))next=(index+1)%categoryButtons.length;if(['ArrowLeft','ArrowUp'].includes(e.key))next=(index+categoryButtons.length-1)%categoryButtons.length;if(e.key==='Home')next=0;if(e.key==='End')next=categoryButtons.length-1;if(next!==undefined){e.preventDefault();categoryButtons[next].click();categoryButtons[next].focus({preventScroll:true})}})});

function followInternalLink(e){
  if(e.defaultPrevented)return;
  const target=e.target instanceof Element?e.target:e.target.parentElement;
  const link=target?.closest('a');const href=link?.getAttribute('href');
  if(!href?.startsWith('#')||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||(typeof e.button==='number'&&e.button!==0))return;
  e.preventDefault();
  if(link.dataset.consult){const message=document.querySelector('textarea[name="mensaje"]');if(!message.value.trim()||message.dataset.suggested==='true'){message.value=`Me interesa recibir información sobre ${link.dataset.consult}.`;message.dataset.suggested='true'}}
  if(href==='#contacto'&&currentView==='contacto'){
    document.getElementById('contact-form').scrollIntoView({behavior:'instant',block:'start'});
    document.querySelector('#contact-form [name="nombre"]').focus({preventScroll:true});return;
  }
  const hash=link.dataset.heroModule?`#catalogo/soluciones/${link.dataset.heroModule}`:href;
  const primaryAction=link.closest('#navigation,.brand,.footer-top,.floating-actions');
  navigate(hash,resolveRoute(hash).view!==currentView||Boolean(primaryAction));
}
// Handle the menu at its own container, including nested translated labels.
// The document handler covers the other internal links without processing twice.
primaryNav.addEventListener('click',followInternalLink);
document.addEventListener('click',followInternalLink);
document.querySelector('textarea[name="mensaje"]').addEventListener('input',e=>{e.target.dataset.suggested='false'});
document.querySelectorAll('[data-sector]').forEach((button,i)=>button.addEventListener('click',()=>{document.querySelector('.sector-number').textContent=String(i+1).padStart(2,'0')}));
window.addEventListener('popstate',()=>showRoute(location.hash,true));window.addEventListener('hashchange',()=>showRoute(location.hash,true));
showRoute(location.hash||'#inicio');


const footerCompact=matchMedia('(max-width:720px)');
function setFooterDisclosure(){document.querySelectorAll('.footer-group').forEach(group=>group.open=!footerCompact.matches);}
setFooterDisclosure();footerCompact.addEventListener('change',setFooterDisclosure);
