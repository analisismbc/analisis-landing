(()=>{
  'use strict';
  const $=selector=>document.querySelector(selector);
  const $$=selector=>[...document.querySelectorAll(selector)];
  const esc=text=>String(text).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const normal=text=>String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  const names={finanzas:'Finanzas',inventarios:'Inventarios',personas:'Recursos humanos',activos:'Activos fijos'};
  const catalog=new Map();
  function record(item){catalog.set(item.id,item);return item;}
  Object.entries(modules).forEach(([key,m])=>record({id:`module-${key}`,label:names[key],type:'Módulo',desc:m.text,features:m.items,href:`#catalogo/soluciones/${key}`,keywords:m.items.join(' ')+' '+({finanzas:'financiero contable cuentas cobros pagos ERP',inventarios:'facturas facturar stock bodega compras ventas',personas:'planilla salarios nomina vacaciones empleados personal',activos:'equipo patrimonio depreciacion'}[key])}));
  const versionFacts={
    'version-estandar':['Administración integral','Los cuatro módulos principales','Gestión administrativa general'],
    'version-proyectos':['Gestión por proyectos','Presupuesto y estados financieros por proyecto','Seguimiento de proyectos'],
    'version-unidades':['Centros de costo','Ingresos y gastos por unidad operativa','Análisis por áreas o unidades'],
    'version-corporativa':['Multicompañía','Estados financieros consolidados','Gestión de un grupo de empresas'],
    'version-pos':['Gestión de cajas','Apertura, movimientos y cierre de cajas','Operaciones de punto de venta'],
    'version-produccion':['Gestión productiva','Formulación, órdenes y control de calidad','Seguimiento de la producción'],
    'version-credito':['Gestión de préstamos','Planes de pago, abonos y reportes de saldos','Seguimiento de operaciones de crédito']
  };
  $$('.version-card').forEach(el=>record({id:el.id,label:el.querySelector('h2,h3').textContent,type:'Versión',desc:el.querySelector('p').textContent,features:versionFacts[el.id],href:`#catalogo/versiones/${el.id}`,keywords:el.id==='version-corporativa'?'varias empresas grupo consolidacion multicompañia':el.id==='version-unidades'?'centros de costo departamentos unidades':el.id==='version-pos'?'facturacion cajas ventas tienda':el.id==='version-credito'?'prestamos cuotas abonos':'',host:el}));
  const licenseFacts={
    'license-cloud':['Mensual por usuario','Acceso por aplicación remota','Actualizaciones incluidas','Respaldo diario publicado','Ambiente en nube'],
    'license-perpetua':['Compra única de licencia','Instalación en servidor o PC','Actualizaciones posteriores opcionales','Respaldo e infraestructura a evaluar','Instalación local']
  };
  $$('.license-card').forEach(el=>record({id:el.id,label:el.querySelector('h2,h3').textContent,type:'Licenciamiento',desc:el.querySelector('p').textContent,features:licenseFacts[el.id],href:'#catalogo/licenciamiento',keywords:el.id==='license-cloud'?'nube remoto suscripcion mensual':'local servidor compra licencia perpetua',host:el}));
  $$('.service-grid article').forEach(el=>record({id:el.id,label:el.querySelector('h2,h3').textContent,type:'Servicio',desc:el.querySelector('p').textContent,features:[...el.querySelectorAll('li')].map(li=>li.textContent),href:`#catalogo/servicios/${el.id}`,keywords:el.id==='servicio-apps'?'apps app movil moviles aplicaciones react native procesos':el.id==='servicio-capacitacion'?'formacion aprender entrenar usuarios':el.id==='servicio-soporte'?'ayuda asistencia mantenimiento':'',host:el}));
  $$('.complement-grid article').forEach(group=>{
    group.querySelectorAll('details').forEach(el=>{
      const label=el.querySelector('summary').textContent;
      const baseID='extra-'+normal(label).replace(/ /g,'-');
      const id=label==='Archivos bancarios para pago'?`${baseID}-${group.id.replace('complemento-','')}`:baseID;el.id=id;
      record({id,label,type:'Complemento',desc:el.querySelector('p').textContent,features:[group.querySelector('h2,h3').textContent],href:`#catalogo/complementos/${group.id}/${id}`,keywords:label.includes('vacaciones')?'vacaciones personal empleados comprobantes salarios':label.includes('bancarios')?'bancos pagos transferencias':'',host:el});
    });
  });
  const byType=type=>[...catalog.values()].filter(item=>item.type===type);
  const allowedIDs=values=>{
    if(!Array.isArray(values))return[];
    const exclusive=new Set();
    const compatible=values.map(id=>id==='extra-archivos-bancarios-para-pago'?'extra-archivos-bancarios-para-pago-personas':id);
    return [...new Set(compatible.filter(id=>typeof id==='string'&&catalog.has(id)))].filter(id=>{const type=catalog.get(id).type;if(!['Versión','Licenciamiento'].includes(type))return true;if(exclusive.has(type))return false;exclusive.add(type);return true;}).slice(0,60);
  };
  const needOptions=[
    ['finanzas','Ordenar mis finanzas','Contabilidad, cobros y pagos'],['inventarios','Controlar inventarios','Compras, ventas y facturación'],['personas','Gestionar mi personal','Horarios, vacaciones y comprobantes'],['activos','Controlar mis activos','Información y depreciación'],
    ['proyectos','Administrar proyectos','Presupuestos y estados por proyecto'],['unidades','Separar centros de costo','Ingresos y gastos por unidad'],['corporativa','Gestionar varias empresas','Información consolidada'],['pos','Operar puntos de venta','Movimientos y cierre de cajas'],['produccion','Gestionar la producción','Formulación, órdenes y calidad'],['credito','Administrar préstamos','Planes de pago y abonos']
  ];
  const sectorOptions=['Comercio y distribución','Construcción','Financiero-contable','Sector agro','Producción','Otros sectores'];
  const defaults={cart:[],advisor:{profile:'empresa',sector:sectorOptions[0],needs:[],license:'evaluar'},checklist:[]};
  let stored={};let canSave=true;
  try{stored=JSON.parse(localStorage.getItem('analisis-tools-v1')||'{}')||{};}catch{canSave=false;}
  const validNeeds=values=>Array.isArray(values)?[...new Set(values.filter(key=>needOptions.some(option=>option[0]===key)))]:[];
  const state={cart:allowedIDs(stored.cart),advisor:{...defaults.advisor,profile:stored.advisor?.profile==='contador'?'contador':'empresa',sector:sectorOptions.includes(stored.advisor?.sector)?stored.advisor.sector:defaults.advisor.sector,needs:validNeeds(stored.advisor?.needs),license:['cloud','perpetua','evaluar'].includes(stored.advisor?.license)?stored.advisor.license:'evaluar'},checklist:Array.isArray(stored.checklist)?stored.checklist.filter(key=>/^stage-[0-4]-[0-2]$/.test(key)):[]};
  let preview=null;let advisorStep=0;let compareKind='versiones';let compareIDs=['version-estandar','version-proyectos','version-corporativa'];let searchFilter='Todos';let searchLimit=6;let tourModule='finanzas';let tourPoint=0;let planStage=0;
  const status=$('#tools-status');
  function notify(message){status.textContent=message;}
  function save(){try{localStorage.setItem('analisis-tools-v1',JSON.stringify(state));canSave=true;}catch{canSave=false;}return canSave;}
  const chosen=()=>allowedIDs(preview||state.cart).map(id=>catalog.get(id));
  const addButton=item=>`<button type="button" class="tool-button selection-action" data-add="${item.id}" aria-pressed="${state.cart.includes(item.id)}">${state.cart.includes(item.id)?'En mi solución':'Agregar a mi solución'}</button>`;
  function refreshActions(){
    $$('[data-add]').forEach(button=>{const on=state.cart.includes(button.dataset.add);button.setAttribute('aria-pressed',String(on));button.textContent=on?'En mi solución':'Agregar a mi solución';});
    $$('[data-cart-count]').forEach(el=>{el.textContent=state.cart.length;el.setAttribute('aria-label',`${state.cart.length} opciones seleccionadas`);});
    document.dispatchEvent(new CustomEvent('selectionchange',{detail:{count:state.cart.length}}));
  }
  function addItems(ids){
    preview=null;
    for(const id of allowedIDs(ids)){
      const item=catalog.get(id);
      if(['Versión','Licenciamiento'].includes(item.type))state.cart=state.cart.filter(existing=>catalog.get(existing)?.type!==item.type);
      if(!state.cart.includes(id))state.cart.push(id);
    }
    save();refreshActions();renderSolution();renderPlan();
    notify(canSave?'Selección actualizada y guardada en este navegador.':'Selección actualizada para esta visita. Puede descargarla o compartirla para conservarla.');
  }
  function attachModuleAction(){
    const panel=$('#module-panel');const key=$('[data-module][aria-selected="true"]')?.dataset.module||'finanzas';
    panel.querySelector('.selection-action')?.remove();panel.insertAdjacentHTML('beforeend',addButton(catalog.get(`module-${key}`)));
  }
  [...catalog.values()].filter(item=>item.host).forEach(item=>item.host.insertAdjacentHTML('beforeend',addButton(item)));
  attachModuleAction();document.addEventListener('modulechange',attachModuleAction);
  const toolOptions=[['asesor','Asesor interactivo'],['comparar','Comparar'],['mi-solucion','Mi solución'],['buscar','Buscar por necesidad'],['recorrido','Recorrido visual'],['plan','Plan de implementación']].map(([value,label])=>({value,label}));
  const toolPicker=createPicker($('#tools-picker'),{id:'tools-select',label:'¿Qué desea hacer?',options:toolOptions,onChange:key=>navigate(`#herramientas/${key}`)});
  $$('[data-tool]').forEach((button,index)=>{
    button.addEventListener('click',()=>navigate(`#herramientas/${button.dataset.tool}`));
    button.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%toolOptions.length;if(e.key==='ArrowLeft')next=(index+toolOptions.length-1)%toolOptions.length;if(e.key==='Home')next=0;if(e.key==='End')next=toolOptions.length-1;if(next!==undefined){e.preventDefault();const target=$$('[data-tool]')[next];target.click();target.focus({preventScroll:true});}});
  });
  const toolHeadings={"asesor":["Asesor interactivo","Tres pasos para recibir una recomendación."],"comparar":["Comparar opciones","Revise las diferencias entre versiones y modalidades de licencia."],"mi-solucion":["Mi solución","Revise, comparta o descargue las opciones elegidas."],"buscar":["Buscar por necesidad","Encuentre opciones para los procesos que quiere mejorar."],"recorrido":["Recorrido de enlace soft®","Vista ilustrativa de sus capacidades. Solicite una demostración del software real."],"plan":["Prepare la implementación","Organice sus preparativos; el alcance y los tiempos se acuerdan con el equipo."]};
  function show(key){
    const selected=toolOptions.some(option=>option.value===key)?key:'asesor';
    $$('[data-tool-panel]').forEach(panel=>{panel.hidden=panel.dataset.toolPanel!==selected;});
    $$('[data-tool]').forEach(button=>{const active=button.dataset.tool===selected;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
    toolPicker.setValue(selected);$('#tools-title').textContent=toolHeadings[selected][0];$('#tools-intro').textContent=toolHeadings[selected][1];status.textContent='';
    const query=location.hash.split('?')[1]||'';const shared=new URLSearchParams(query).get('sel');
    preview=selected==='mi-solucion'&&shared!==null?allowedIDs(shared.slice(0,5000).split(',')):null;
    if(selected==='mi-solucion')renderSolution();if(selected==='plan')renderPlan();
  }
  function optionCard(name,value,title,description,checked,type='radio'){
    return `<label class="choice-card"><input type="${type}" name="${name}" value="${value}" ${checked?'checked':''}><span class="choice-mark" aria-hidden="true"></span><span><strong>${esc(title)}</strong><small>${esc(description)}</small></span></label>`;
  }
  function focusAdvisor(){const target=$('#advisor-content legend,#advisor-content h2');if(target){target.tabIndex=-1;target.focus({preventScroll:true});}}
  function renderAdvisor(){
    const host=$('#advisor-content');
    const steps=['Su negocio','Sus necesidades','Cómo trabajar'];
    let body='';
    if(advisorStep===0)body=`<fieldset><legend>¿Para quién busca una solución?</legend><div class="choice-grid">${optionCard('profile','empresa','Para mi empresa','Herramientas para mi operación',state.advisor.profile==='empresa')}${optionCard('profile','contador','Para mi práctica contable','Gestión contable de mis clientes',state.advisor.profile==='contador')}</div></fieldset><div id="advisor-sector"></div>`;
    if(advisorStep===1)body=`<fieldset><legend>¿Qué necesita mejorar? Puede elegir varias opciones.</legend><div class="choice-grid">${needOptions.map(([key,label,desc])=>optionCard('needs',key,label,desc,state.advisor.needs.includes(key),'checkbox')).join('')}</div></fieldset><p id="advisor-error" class="tool-error" role="alert"></p>`;
    if(advisorStep===2)body=`<fieldset><legend>¿Cómo prefiere trabajar?</legend><div class="choice-grid">${optionCard('license','cloud','En nube','Suscripción y acceso por aplicación remota',state.advisor.license==='cloud')}${optionCard('license','perpetua','Con instalación local','Licencia para servidor o computadora',state.advisor.license==='perpetua')}${optionCard('license','evaluar','Quiero evaluar ambas','Compare las modalidades con un asesor',state.advisor.license==='evaluar')}</div></fieldset>`;
    if(advisorStep===3){renderRecommendations();return;}
    host.innerHTML=`<div class="advisor-progress" aria-label="Paso ${advisorStep+1} de 3">${steps.map((step,i)=>`<span class="${i===advisorStep?'active':i<advisorStep?'complete':''}"><b>${i+1}</b>${step}</span>`).join('')}</div><form id="advisor-form">${body}<div class="tool-actions">${advisorStep>0?'<button type="button" class="tool-button" data-action="advisor-back">Anterior</button>':''}<button type="submit" class="tool-button primary">${advisorStep===2?'Ver mi recomendación':'Continuar'}</button></div></form>`;
    if(advisorStep===0)createPicker($('#advisor-sector'),{id:'advisor-sector-select',label:'¿En qué sector trabaja?',options:sectorOptions.map(label=>({value:label,label})),onChange:sector=>{state.advisor.sector=sector;save();}}).setValue(state.advisor.sector);
    $('#advisor-form').addEventListener('change',e=>{
      if(e.target.name==='profile')state.advisor.profile=e.target.value;
      if(e.target.name==='needs')state.advisor.needs=[...host.querySelectorAll('[name=needs]:checked')].map(input=>input.value);
      if(e.target.name==='license')state.advisor.license=e.target.value;save();
    });
    $('#advisor-form').addEventListener('submit',e=>{e.preventDefault();if(advisorStep===1&&!state.advisor.needs.length){$('#advisor-error').textContent='Elija al menos una necesidad para preparar la recomendación.';return;}advisorStep++;save();renderAdvisor();focusAdvisor();});
  }
  function recommendations(){
    const result=[];const add=(id,reason)=>{if(!result.some(item=>item.id===id))result.push({id,reason});};
    state.advisor.needs.forEach(key=>{
      if(names[key])add(`module-${key}`,`Lo indicó como una necesidad: ${names[key].toLowerCase()}.`);
      else{add(`version-${key}`,`Su necesidad coincide con el enfoque publicado de esta versión.`);add(['pos','produccion'].includes(key)?'module-inventarios':'module-finanzas','Área relacionada con la necesidad que seleccionó.');}
    });
    if(state.advisor.profile==='contador')add('module-finanzas','Para orientar la gestión contable de sus clientes. Consulte también la opción para contadores.');
    if(!result.some(item=>catalog.get(item.id).type==='Versión')&&state.advisor.profile==='empresa')add('version-estandar','Punto de partida para una gestión administrativa con los cuatro módulos principales.');
    if(state.advisor.license!=='evaluar')add(`license-${state.advisor.license}`,`Coincide con su preferencia de ${state.advisor.license==='cloud'?'trabajo en nube':'instalación local'}.`);
    add('servicio-implementacion','Para analizar sus necesidades y configurar la puesta en marcha.');
    return result;
  }
  function renderRecommendations(){
    const results=recommendations();
    compareIDs=[...new Set([...results.filter(item=>catalog.get(item.id).type==='Versión').map(item=>item.id),...compareIDs,...byType('Versión').map(item=>item.id)])].slice(0,3);
    renderComparison();
    $('#advisor-content').innerHTML=`<div class="advisor-result"><span class="result-check" aria-hidden="true">✓</span><div><h2>Su recomendación</h2><p>${esc(state.advisor.sector)} · ${state.advisor.needs.length} necesidades seleccionadas</p></div></div>${state.advisor.profile==='contador'?'<p class="tool-note">Explore la <a href="#catalogo/clientes/cliente-contadores">opción para contadores</a> antes de definir el alcance.</p>':''}<div class="tools-card-grid">${results.map(({id,reason})=>{const item=catalog.get(id);return `<article class="tool-card"><span class="tool-kicker">${item.type}</span><h3>${esc(item.label)}</h3><p>${esc(item.desc)}</p><p class="recommendation-reason">${esc(reason)}</p><a class="tool-link" href="${item.href}">Ver detalle ↗</a>${addButton(item)}</article>`;}).join('')}</div><p class="tool-note">${results.filter(item=>catalog.get(item.id).type==='Versión').length>1?'Encontramos versiones alternativas para sus necesidades. Compare sus enfoques; la combinación se revisa con el equipo. ':''}Orientación basada en sus respuestas y en la oferta publicada, sujeta a validación por un asesor.</p><div class="tool-actions"><button type="button" class="tool-button primary" data-action="add-recommendations">Agregar a mi solución</button><a class="tool-button" href="#herramientas/comparar">Comparar versiones</a><button type="button" class="tool-button" data-action="edit-advisor">Editar respuestas</button></div>`;
  }
  function renderComparison(){
    const host=$('#comparison-content');
    const isVersion=compareKind==='versiones';const items=isVersion?compareIDs.map(id=>catalog.get(id)):byType('Licenciamiento');
    const rowLabels=isVersion?['Enfoque','Capacidad principal']:['Modalidad de compra','Acceso','Actualizaciones','Respaldo','Infraestructura'];
    const rows=rowLabels.map((label,i)=>`<tr><th scope="row">${label}</th>${items.map(item=>`<td>${esc(item.features[i])}</td>`).join('')}</tr>`).join('');
    host.innerHTML=`${isVersion?'<div class="comparison-pickers">'+items.map((item,i)=>`<div id="compare-picker-${i}"></div>`).join('')+'</div>':''}<div class="comparison-scroll" tabindex="0" role="region" aria-label="Tabla de comparación"><table class="comparison-table"><caption>${isVersion?'Enfoques de versiones de enlace soft®':'Cloud y licencia perpetua'}</caption><thead><tr><th scope="col">Característica</th>${items.map(item=>`<th scope="col">${esc(item.label)}</th>`).join('')}</tr></thead><tbody>${rows}<tr><th scope="row">Mi selección</th>${items.map(item=>`<td>${addButton(item)}</td>`).join('')}</tr><tr><th scope="row">Más información</th>${items.map(item=>`<td><a class="tool-link" href="${item.href}">Ver detalle ↗</a></td>`).join('')}</tr></tbody></table></div><p class="tool-note">${isVersion?'Las versiones representan enfoques distintos. No se presupone que una incluya las funciones de otra.':'La instalación local requiere evaluar el respaldo y la infraestructura del cliente.'} Puede cambiar la versión y la modalidad de su selección.</p><p class="tool-source">Información de <a href="https://analisis.cr/${isVersion?'versiones':'licenciamiento'}/" target="_blank" rel="noopener noreferrer">Análisis MBC ↗</a></p>`;
    if(isVersion)items.forEach((item,i)=>createPicker($(`#compare-picker-${i}`),{id:`compare-select-${i}`,label:`Opción ${i+1}`,options:byType('Versión').map(v=>({value:v.id,label:v.label})),onChange:id=>{const duplicate=compareIDs.indexOf(id);if(duplicate>=0&&duplicate!==i)compareIDs[duplicate]=compareIDs[i];compareIDs[i]=id;renderComparison();document.getElementById(`compare-select-${i}`).focus({preventScroll:true});}}).setValue(item.id));
  }
  $$('[data-compare-kind]').forEach(button=>button.addEventListener('click',()=>{compareKind=button.dataset.compareKind;$$('[data-compare-kind]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderComparison();}));
  function renderSolution(){
    const items=chosen();
    $('#solution-content').innerHTML=`${preview!==null?`<div class="shared-selection"><strong>Selección compartida</strong><p>Puede revisarla o descargarla. Para guardarla en este navegador, úsela como su selección.</p><div class="tool-actions"><button type="button" class="tool-button primary" data-action="import-selection">Usar esta selección</button><button type="button" class="tool-button" data-action="dismiss-shared">Volver a mi selección</button></div></div>`:''}${items.length?`<div class="solution-list">${items.map(item=>`<article class="solution-row"><div><span class="tool-kicker">${item.type}</span><h2>${esc(item.label)}</h2><a class="tool-link" href="${item.href}">Ver detalle ↗</a></div>${preview===null?`<button type="button" class="remove-option" data-remove="${item.id}" aria-label="Quitar ${esc(item.label)}">×</button>`:''}</article>`).join('')}</div><div class="solution-summary"><span>${items.length} opciones para su consulta</span><p>El equipo confirma alcance, compatibilidad y precios.</p></div><div class="tool-actions"><button type="button" class="tool-button primary" data-action="prepare-consultation">Preparar consulta</button><button type="button" class="tool-button" data-action="download-summary">Descargar PDF</button><button type="button" class="tool-button" data-action="share-selection">Compartir selección</button>${preview===null?'<button type="button" class="tool-button" data-action="clear-selection">Vaciar selección</button>':''}</div><div id="share-content"></div>`:'<div class="tool-empty"><span aria-hidden="true">＋</span><h2>Agregue su primera opción</h2><p>Agregue opciones desde el catálogo, la búsqueda, el comparador o el asesor.</p><div class="tool-actions"><a class="tool-button primary" href="#herramientas/asesor">Usar el asesor</a><a class="tool-button" href="#catalogo">Explorar catálogo</a></div></div>'}<p class="tool-note">${canSave?'Su selección se conserva en este navegador.':'El almacenamiento no está disponible. Conserve la selección con un enlace o un PDF.'} El enlace compartido contiene las opciones elegidas; no incluye los datos del formulario de contacto.</p>`;
  }
  const searchTypes=['Todos','Módulo','Versión','Complemento','Servicio','Licenciamiento'];
  $('#search-filters').innerHTML=searchTypes.map(type=>`<button type="button" data-filter="${type}" aria-pressed="${type===searchFilter}">${type==='Todos'?'Todo':type==='Versión'?'Versiones':type==='Licenciamiento'?type:type+'s'}</button>`).join('');
  function renderSearch(){
    const query=normal($('#needs-query').value);const terms=query.split(' ').filter(Boolean);
    $('#search-filters').hidden=!query;
    if(!query){$('#search-count').textContent='';$('#search-results').innerHTML='';$('#search-more').hidden=true;return;}
    const results=[...catalog.values()].filter(item=>searchFilter==='Todos'||item.type===searchFilter).map(item=>({item,text:normal([item.label,item.desc,item.features.join(' '),item.keywords].join(' '))})).filter(({text})=>terms.every(term=>text.includes(term))).sort((a,b)=>Number(normal(b.item.label).includes(query))-Number(normal(a.item.label).includes(query)));
    $('#search-count').textContent=`${results.length} ${results.length===1?'opción encontrada':'opciones encontradas'}${query?' para su búsqueda':''}.`;
    $('#search-results').innerHTML=results.length?results.slice(0,searchLimit).map(({item})=>`<article class="tool-card"><span class="tool-kicker">${item.type}</span><h2>${esc(item.label)}</h2><p>${esc(item.desc)}</p><a class="tool-link" href="${item.href}">Ver detalle ↗</a>${addButton(item)}</article>`).join(''):`<div class="tool-empty"><h2>Sin coincidencias</h2><p>Pruebe con una necesidad más breve o consulte al equipo para evaluar su caso.</p><a class="tool-button" href="#contacto" data-consult="mi necesidad: ${esc($('#needs-query').value.trim())}">Consultar mi necesidad</a></div>`;
    $('#search-more').hidden=results.length<=searchLimit;
  }
  $('#needs-search').addEventListener('submit',e=>{e.preventDefault();searchLimit=6;renderSearch();});
  $('#needs-query').addEventListener('input',()=>{searchLimit=6;renderSearch();});
  $$('[data-search-term]').forEach(button=>button.addEventListener('click',()=>{$('#needs-query').value=button.dataset.searchTerm;searchLimit=6;searchFilter='Todos';updateFilters();renderSearch();}));
  function updateFilters(){$$('[data-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===searchFilter)));}
  $$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{searchFilter=button.dataset.filter;searchLimit=6;updateFilters();renderSearch();}));
  createPicker($('#tour-module-picker'),{id:'tour-module-select',label:'Explore un área',options:Object.entries(names).map(([value,label])=>({value,label})),onChange:key=>{tourModule=key;tourPoint=0;renderTour();}});
  const tourExplanations={
    finanzas:['Organice sus registros contables para consultar la situación financiera.','Dé seguimiento a los saldos pendientes de cobro.','Consulte las obligaciones pendientes con sus proveedores.','Reúna los movimientos de tesorería y bancos.','Prepare el seguimiento de los presupuestos de su empresa.'],
    inventarios:['Explore la capacidad de gestionar documentos electrónicos.','Conozca el enfoque de gestión de cajas para su punto de venta.','Reúna información de las compras y ventas de su operación.','Explore la formulación de artículos compuestos.','Consulte cómo configurar reportes para su operación.'],
    personas:['Organice la información de las personas de su equipo.','Explore la gestión de horarios y la funcionalidad con reloj marcador.','Conozca las opciones para gestionar las vacaciones.','Explore los comprobantes electrónicos de pago.'],
    activos:['Reúna la información de sus activos para su consulta.','Conozca la relación de la depreciación con la contabilidad.','Explore el registro de las compras de activos.','Conozca el manejo de las liquidaciones de activos.']
  };
  function renderTour(){
    const item=catalog.get(`module-${tourModule}`);
    $('#tour-content').innerHTML=`<div class="tour-layout"><div class="tour-preview"><div class="tour-top"><strong>enlace soft<sup>®</sup></strong><span>RECORRIDO ILUSTRATIVO</span></div><div class="tour-screen"><h2>${names[tourModule]}</h2><div class="tour-points">${item.features.map((feature,i)=>`<button type="button" data-tour-point="${i}" aria-pressed="${tourPoint===i}"><span>${String(i+1).padStart(2,'0')}</span>${esc(feature)}<b aria-hidden="true">↗</b></button>`).join('')}</div></div></div><div class="tour-explanation" aria-live="polite"><span class="tool-index">${String(tourPoint+1).padStart(2,'0')} / ${item.features.length}</span><h2>${esc(item.features[tourPoint])}</h2><p>${esc(tourExplanations[tourModule][tourPoint])}</p><p class="tool-note">La disponibilidad y configuración se revisan según el alcance contratado.</p><div class="tool-actions">${addButton(item)}<a class="tool-button" href="#contacto" data-consult="Una demostración del módulo ${names[tourModule]}">Solicitar demostración</a></div><div class="tour-controls"><button type="button" class="tool-button" data-action="tour-prev" ${tourPoint===0?'disabled':''}>Anterior</button><button type="button" class="tool-button" data-action="tour-next" ${tourPoint===item.features.length-1?'disabled':''}>Siguiente</button></div></div></div>`;
  }
  const stages=[
    {label:'Diagnóstico',title:'Entender su operación.',text:'Prepare sus prioridades y los procesos que necesita mejorar para que el equipo evalúe el alcance.',checks:['Identificar procesos prioritarios','Definir responsables de la evaluación','Reunir preguntas sobre el alcance'],service:'servicio-implementacion'},
    {label:'Configuración',title:'Definir cómo va a trabajar.',text:'Revise con el equipo la configuración, los usuarios y la modalidad de trabajo según sus necesidades.',checks:['Identificar usuarios y roles','Revisar la infraestructura disponible','Validar módulos y configuración'],service:'servicio-implementacion'},
    {label:'Datos',title:'Preparar la información.',text:'Identifique los datos a trasladar. La viabilidad, el alcance y el tratamiento de esa información se acuerdan en el proyecto.',checks:['Identificar las fuentes de información','Revisar la calidad de los datos','Consultar el alcance del traslado'],service:'servicio-implementacion'},
    {label:'Capacitación',title:'Preparar a las personas.',text:'Organice la formación según los usuarios y sus tareas, y revise los procesos de puesta en marcha.',checks:['Definir las personas a capacitar','Priorizar tareas para practicar','Acordar la puesta en marcha'],service:'servicio-capacitacion'},
    {label:'Acompañamiento',title:'Dar seguimiento al uso.',text:'Revise las opciones de soporte y mantenimiento disponibles, y los canales para recibir asistencia.',checks:['Consultar los planes de soporte','Identificar canales de atención','Definir cómo registrar consultas'],service:'servicio-soporte'}
  ];
  function renderPlan(){
    const stage=stages[planStage];const items=chosen();
    $('#implementation-content').innerHTML=`<div class="plan-overview"><div><strong>${state.checklist.length} / 15</strong><span>Preparativos marcados</span></div><p>${items.length?`Su selección incluye ${items.length} opciones. Use esta guía para preparar su consulta.`:'Puede usar esta guía ahora y agregar una selección cuando lo necesite.'}</p></div><div class="plan-stages" aria-label="Etapas de preparación">${stages.map((s,i)=>`<button type="button" data-plan-stage="${i}" aria-pressed="${i===planStage}"><span>${String(i+1).padStart(2,'0')}</span>${s.label}</button>`).join('')}</div><div class="plan-detail"><p class="tool-index">ETAPA ${planStage+1} / 5</p><h2>${stage.title}</h2><p>${stage.text}</p><fieldset><legend>Mi lista de preparación</legend>${stage.checks.map((text,i)=>`<label class="plan-check"><input type="checkbox" data-plan-check="stage-${planStage}-${i}" ${state.checklist.includes(`stage-${planStage}-${i}`)?'checked':''}><span class="choice-mark" aria-hidden="true"></span><span>${text}</span></label>`).join('')}</fieldset><div class="tool-actions">${addButton(catalog.get(stage.service))}<a class="tool-button" href="${catalog.get(stage.service).href}">Conocer el servicio</a><button type="button" class="tool-button" data-action="download-summary">Descargar mi resumen</button></div><p class="tool-note">La lista marca su preparación personal. No representa servicios contratados ni etapas completadas por Análisis MBC.</p></div>`;
  }
  function consultationText(){return ['Me interesa evaluar esta selección de soluciones y servicios de Análisis MBC:','',...chosen().map(item=>`• ${item.type}: ${item.label}`),'','Quisiera confirmar el alcance, la compatibilidad y las condiciones.'].join('\n');}
  function shareURL(){const url=new URL('https://analisismbc.github.io/analisis-landing/');url.hash='herramientas/mi-solucion?sel='+chosen().map(item=>item.id).join(',');return url.href;}
  async function share(){
    const url=shareURL();const host=$('#share-content');host.innerHTML='<label for="selection-link">Enlace de su selección</label><div class="share-link"><input id="selection-link" type="text" readonly><button type="button" class="tool-button" data-action="copy-link">Copiar enlace</button></div><p class="tool-note">Cualquier persona con este enlace puede ver las opciones seleccionadas.</p>';
    $('#selection-link').value=url;await copyLink();
  }
  async function copyLink(){
    try{await navigator.clipboard.writeText($('#selection-link').value);notify('Enlace copiado. Ya puede compartir su selección.');}
    catch{$('#selection-link').focus({preventScroll:true});$('#selection-link').select();notify('Seleccione y copie el enlace mostrado para compartirlo.');}
  }
  function summaryLines(){return [
    ['Selección para evaluar',true],['Opciones orientativas; alcance y condiciones sujetos a confirmación.',false],['',false],
    ...chosen().flatMap(item=>[[`${item.type} / ${item.label}`,true],[item.desc,false],['',false]]),
    ['Preparación de la implementación',true],...stages.flatMap((stage,i)=>[[`${i+1}. ${stage.label}`,true],...stage.checks.map((text,j)=>[`${state.checklist.includes(`stage-${i}-${j}`)?'[x]':'[ ]'} ${text}`,false])]),
    ['',false],['Contacto / Análisis MBC',true],['contacto@analisis.cr / (+506) 2439-4545 / WhatsApp 8695-0367',false],['Este resumen no es una cotización ni un contrato.',false]
  ];}
  // A self-contained PDF export with WinAnsi fonts; no external service or
  // dependency receives the visitor's selection.
  function makePDF(lines){
    const date=new Intl.DateTimeFormat('es-CR',{dateStyle:'long'}).format(new Date());
    const literal=text=>'('+String(text).replace(/[^\x20-\xff]/g,' ').replace(/[\\()]/g,'\\$&')+')';
    const wrap=text=>{const words=String(text).split(/\s+/);const rows=[];let row='';for(const word of words){if((row+' '+word).length>83){rows.push(row);row=word;}else row+=(row?' ':'')+word;}rows.push(row);return rows;};
    const pages=[];let commands='',y=0;
    function newPage(){if(commands)pages.push(commands);commands='0.03 0.09 0.17 rg 0 746 595 96 re f\n';commands+=`BT /F2 24 Tf 1 1 1 rg 44 793 Td ${literal('Análisis MBC')} Tj ET\nBT /F1 10 Tf 0.7 0.8 0.94 rg 44 773 Td ${literal('MI SOLUCIÓN / '+date)} Tj ET\n`;y=718;}
    newPage();
    lines.forEach(([text,bold],index)=>{
      if(bold){let height=wrap(text).length*23;for(let next=index+1;next<lines.length&&!lines[next][1];next++)height+=wrap(lines[next][0]).length*17;if(y-height<72)newPage();}
      for(const row of wrap(text)){if(y<72)newPage();commands+=`BT /${bold?'F2':'F1'} ${bold?12:10} Tf ${bold?'0.07 0.17 0.28':'0.3 0.37 0.46'} rg 44 ${y} Td ${literal(row)} Tj ET\n`;y-=bold?23:17;}
    });
    pages.push(commands);
    const objects=['<< /Type /Catalog /Pages 2 0 R >>','', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'];
    const pageIDs=[];
    pages.forEach((stream,index)=>{
      const pageID=objects.length+1;const streamID=pageID+1;pageIDs.push(pageID);
      const footer=`BT /F1 9 Tf 0.45 0.5 0.6 rg 44 38 Td ${literal('Análisis MBC / Resumen de selección / '+(index+1)+' de '+pages.length)} Tj ET\n`;
      const content=stream+footer;objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${streamID} 0 R >>`);objects.push(`<< /Length ${content.length} >>\nstream\n${content}endstream`);
    });
    objects[1]=`<< /Type /Pages /Count ${pageIDs.length} /Kids [${pageIDs.map(id=>`${id} 0 R`).join(' ')}] >>`;
    let pdf='%PDF-1.4\n%\xe2\xe3\xcf\xd3\n';const offsets=[0];objects.forEach((object,i)=>{offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${object}\nendobj\n`;});const xref=pdf.length;
    pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`+offsets.slice(1).map(offset=>String(offset).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    return new Uint8Array([...pdf].map(char=>char.charCodeAt(0)&255));
  }
  function download(){const blob=new Blob([makePDF(summaryLines())],{type:'application/pdf'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='mi-solucion-analisis-mbc.pdf';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);notify('Resumen PDF descargado con su selección y lista de preparación.');}
  document.addEventListener('click',async e=>{
    const button=e.target.closest?.('button');if(!button)return;
    if(button.dataset.add){const item=catalog.get(button.dataset.add);if(!item)return;if(state.cart.includes(item.id)){state.cart=state.cart.filter(id=>id!==item.id);save();refreshActions();renderSolution();renderPlan();notify(`${item.label} se quitó de su selección.`);return;}addItems([item.id]);return;}
    if(button.dataset.remove){state.cart=state.cart.filter(id=>id!==button.dataset.remove);save();refreshActions();renderSolution();renderPlan();notify('Opción quitada de su selección.');return;}
    if(button.dataset.tourPoint!==undefined){tourPoint=Number(button.dataset.tourPoint);renderTour();$(`[data-tour-point="${tourPoint}"]`).focus({preventScroll:true});return;}
    if(button.dataset.planStage!==undefined){planStage=Number(button.dataset.planStage);renderPlan();$(`[data-plan-stage="${planStage}"]`).focus({preventScroll:true});return;}
    switch(button.dataset.action){
      case'advisor-back':advisorStep=Math.max(0,advisorStep-1);renderAdvisor();focusAdvisor();break;
      case'edit-advisor':advisorStep=0;renderAdvisor();focusAdvisor();break;
      case'add-recommendations':{const results=recommendations();const version=results.find(item=>catalog.get(item.id).type==='Versión');addItems(results.filter(item=>catalog.get(item.id).type!=='Versión'||item===version).map(item=>item.id));navigate('#herramientas/mi-solucion');break;}
      case'import-selection':state.cart=allowedIDs(preview);preview=null;save();refreshActions();navigate('#herramientas/mi-solucion');notify(canSave?'Selección compartida guardada en este navegador.':'Selección compartida disponible durante esta visita. Puede descargarla para conservarla.');break;
      case'dismiss-shared':preview=null;navigate('#herramientas/mi-solucion');break;
      case'clear-selection':state.cart=[];save();refreshActions();renderSolution();renderPlan();notify('Selección vaciada. Puede empezar de nuevo.');break;
      case'prepare-consultation':{const field=$('textarea[name=mensaje]');const text=consultationText();if(field.value.trim()&&field.dataset.suggested!=='true')field.value+='\n\n'+text;else field.value=text;field.dataset.suggested='true';navigate('#contacto',true);break;}
      case'share-selection':await share();break;
      case'copy-link':await copyLink();break;
      case'download-summary':download();break;
      case'clear-search':$('#needs-query').value='';searchLimit=6;renderSearch();$('#needs-query').focus({preventScroll:true});break;
      case'more-search':searchLimit+=6;renderSearch();break;
      case'tour-prev':tourPoint=Math.max(0,tourPoint-1);renderTour();$(`[data-tour-point="${tourPoint}"]`).focus({preventScroll:true});break;
      case'tour-next':tourPoint=Math.min(catalog.get(`module-${tourModule}`).features.length-1,tourPoint+1);renderTour();$(`[data-tour-point="${tourPoint}"]`).focus({preventScroll:true});break;
    }
  });
  document.addEventListener('change',e=>{const key=e.target.dataset.planCheck;if(!key)return;state.checklist=e.target.checked?[...new Set([...state.checklist,key])]:state.checklist.filter(id=>id!==key);save();renderPlan();$(`[data-plan-check="${key}"]`).focus({preventScroll:true});notify('Lista de preparación actualizada.');});
  window.SiteTools={show};
  renderAdvisor();renderComparison();renderSolution();renderSearch();renderTour();renderPlan();refreshActions();
  show(location.hash.startsWith('#herramientas')?location.hash.split('/')[1]?.split('?')[0]:'asesor');
})();
