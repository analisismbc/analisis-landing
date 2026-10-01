(()=>{
  'use strict';
  const view=document.getElementById('view-catalogo');
  const heading=view.querySelector('.explorer-top');const tools=view.querySelector('.catalog-tools');
  const header=document.createElement('div');header.className='catalog-header wrap';heading.before(header);heading.classList.remove('wrap');tools.classList.remove('wrap');header.append(heading,tools);
  const layout=document.createElement('div');layout.className='catalog-layout wrap';header.after(layout);
  const controls=view.querySelector('.explorer-controls');const panels=view.querySelector('.category-panels');
  const sidebar=document.createElement('aside');sidebar.className='catalog-sidebar';sidebar.setAttribute('aria-label','Categorías del catálogo');
  const caption=document.createElement('p');caption.className='catalog-nav-label';caption.textContent='Explorar catálogo';sidebar.append(caption,controls);controls.firstElementChild.classList.remove('wrap');layout.append(sidebar,panels);
  const labels={clientes:'Clientes',soluciones:'Módulos',versiones:'Versiones',licenciamiento:'Licenciamiento',sectores:'Sectores',complementos:'Complementos',servicios:'Servicios'};
  document.querySelectorAll('[data-category-button]').forEach(button=>{const key=button.dataset.categoryButton;const icon=document.createElement('span');icon.className='catalog-category-icon';icon.setAttribute('aria-hidden','true');icon.innerHTML=pickerIcon(key);const label=document.createElement('span');label.textContent=labels[key];button.replaceChildren(icon,label);});
  panels.querySelectorAll('.wrap').forEach(element=>element.classList.remove('wrap'));
  panels.querySelectorAll('.item-choices').forEach(choices=>{
    const picker=choices.nextElementSibling;const body=picker.nextElementSibling;const container=choices.parentElement;
    const options=document.createElement('div');options.className='catalog-options';const title=document.createElement('p');title.className='catalog-options-label';title.textContent=picker.querySelector('.picker-caption').textContent;options.append(title,choices,picker);
    const detail=document.createElement('div');detail.className='catalog-detail';detail.append(body);container.classList.add('catalog-choice-layout');container.append(options,detail);
  });
  // Decorate fixed controls once; rendering and route handlers remain unchanged.
  document.querySelectorAll('.catalog-tools>a,[data-sector],[data-compare-kind]').forEach(control=>{
    const key=control.dataset.sector||control.dataset.compareKind||control.hash.split('/')[1];
    const icon=document.createElement('span');icon.className='control-symbol';icon.setAttribute('aria-hidden','true');icon.innerHTML=pickerIcon(key==='licencias'?'licenciamiento':key);
    const count=control.querySelector('[data-cart-count]');if(count)count.remove();
    control.querySelectorAll('[aria-hidden=true]').forEach(node=>node.remove());
    const label=document.createElement('span');label.className='control-label';label.textContent=control.textContent.trim();
    control.replaceChildren(icon,label);if(count)control.append(count);
  });
  // Every offer keeps its original content and ID. Group its actions consistently.
  function groupActions(container){
    const actions=[...container.children].filter(element=>element.matches('a.text-link,button.selection-action'));
    if(!actions.length)return;const row=document.createElement('div');row.className='catalog-item-actions';actions[0].before(row);row.append(...actions);
  }
  panels.querySelectorAll('.client-grid article,.version-card,.license-card,.service-grid article,.complement-grid details').forEach(groupActions);
  groupActions(document.getElementById('module-panel'));
  document.addEventListener('modulechange',()=>groupActions(document.getElementById('module-panel')));
})();
