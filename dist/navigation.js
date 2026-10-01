(()=>{
  'use strict';
  const bar=document.getElementById('breadcrumb-bar');
  const list=document.getElementById('breadcrumb-list');
  const moduleLabels={finanzas:'Finanzas',inventarios:'Inventarios',personas:'Recursos humanos',activos:'Activos fijos'};
  const categoryLabels={clientes:'Clientes',soluciones:'Módulos',versiones:'Versiones',licenciamiento:'Licenciamiento',sectores:'Sectores',complementos:'Complementos',servicios:'Servicios'};
  const toolLabels={asesor:'Asesor interactivo',comparar:'Comparar opciones','mi-solucion':'Mi solución',buscar:'Buscar por necesidad',recorrido:'Recorrido visual',plan:'Implementación'};
  const menuMedia=matchMedia('(max-width:1100px)');
  function render(){
    const route=resolveRoute(location.hash||'#inicio');const steps=[{label:'Inicio',href:'#inicio'}];
    if(route.view==='inicio'){bar.hidden=true;list.replaceChildren();updateActions();return;}
    if(route.view==='catalogo'){
      steps.push({label:'Catálogo',href:'#catalogo/soluciones',level:'collection'});
      steps.push({label:categoryLabels[route.category],href:`#catalogo/${route.category}`});
      const group=choiceGroups[route.category];
      if(group){const item=group.items.find(item=>!item.hidden);if(item)steps.push({label:item.querySelector('h2,h3').textContent});}
      else if(route.category==='soluciones'){const key=document.querySelector('[data-module][aria-selected=true]')?.dataset.module;if(key)steps.push({label:moduleLabels[key]});}
      else if(route.category==='sectores'){const selected=document.querySelector('[data-sector][aria-pressed=true]');if(selected)steps.push({label:selected.textContent});}
    }else if(route.view==='herramientas'){
      const key=document.querySelector('[data-tool][aria-selected=true]')?.dataset.tool||route.tool;
      steps.push({label:'Herramientas',href:'#herramientas/asesor'});steps.push({label:toolLabels[key]||toolLabels.asesor});
    }else steps.push({label:route.view==='contacto'?'Contacto':'Nuestra empresa'});
    list.replaceChildren();
    steps.forEach((step,index)=>{
      const item=document.createElement('li');if(step.level)item.dataset.level=step.level;
      const current=index===steps.length-1;const text=document.createElement(current?'span':'a');text.textContent=step.label;
      if(current)text.setAttribute('aria-current','page');else text.href=step.href;
      item.append(text);list.append(item);
    });bar.hidden=false;updateActions();
  }
  function updateActions(){
    const route=resolveRoute(location.hash||'#inicio');
    document.querySelectorAll('.floating-action[href^="#"]').forEach(link=>{
      const target=resolveRoute(link.getAttribute('href'));const on=route.view==='herramientas'&&target.tool===route.tool;
      if(on)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
    });
    const count=Number(document.querySelector('.floating-count').textContent)||0;
    document.querySelector('.floating-selection').setAttribute('aria-label',`Abrir mi solución, ${count} ${count===1?'opción seleccionada':'opciones seleccionadas'}`);
  }
  document.addEventListener('routechange',render);
  document.addEventListener('modulechange',()=>{if(currentView==='catalogo'&&remembered.category==='soluciones')render();});
  document.addEventListener('selectionchange',updateActions);
  document.addEventListener('click',event=>{if(event.target.closest('[data-sector]'))render();});
  menuMedia.addEventListener('change',()=>closeNavigation());
  render();
})();
