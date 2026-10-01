// A shared, keyboard-accessible picker. Focus stays on the trigger so opening
// and changing an option never scrolls the page to a different control.
const customPickers = new Set();
function closePickers(){customPickers.forEach(picker=>picker.close());}
function pickerIcon(key){
  if(['finanzas','inventarios','personas','activos'].includes(key))return `<img class="module-emblem" src="assets/module-${key}.svg" alt="" width="64" height="64">`;
  const paths={
    finanzas:'<path d="M4 20h16M6 20V9h12v11M4 9l8-5 8 5M9 12v5m6-5v5"/>',
    inventarios:'<path d="m3 7 9-4 9 4v10l-9 4-9-4V7Zm0 0 9 4 9-4M12 11v10"/>',
    personas:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2"/>',
    activos:'<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M8 6V4h8v2M3 12h18m-11 0v3h4v-3"/>',
    clientes:'<circle cx="12" cy="8" r="3"/><path d="M5 20v-2a7 7 0 0 1 14 0v2"/>',
    versiones:'<path d="m3 7 9-4 9 4-9 4-9-4Zm0 5 9 4 9-4M3 17l9 4 9-4"/>',
    licenciamiento:'<path d="m12 3 8 4v5c0 5-8 9-8 9s-8-4-8-9V7l8-4Z"/><path d="m8 12 3 3 5-6"/>',
    sectores:'<path d="M4 21V7l8-4v18M12 9h8v12M3 21h18M7 8v1m0 3v1m0 3v1m9-5v1m0 3v1"/>',
    complementos:'<path d="M8 3v5m8-5v5M6 8h12v3a6 6 0 0 1-6 6v4m-6-9h12"/>',
    servicios:'<path d="m14 7 3 3 4-4a6 6 0 0 1-8 8l-6 6a2 2 0 0 1-3-3l6-6a6 6 0 0 1 8-8l-4 4Z"/>',
    apps:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4m-3 14h2"/>',
    asesor:'<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5 5-3Z"/>',
    comparar:'<path d="M4 7h16M4 17h16"/><circle cx="8" cy="7" r="3"/><circle cx="16" cy="17" r="3"/>',
    'mi-solucion':'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2m-6 7 2 2 4-4M9 17h6"/>',
    buscar:'<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
    recorrido:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m10 8 6 4-6 4V8Z"/>',
    plan:'<path d="M8 6h13M8 12h13M8 18h13M3 6h1m-1 6h1m-1 6h1"/>'
  };
  const group=key==='servicio-apps'?'apps':key.startsWith('version-')?'versiones':key.startsWith('servicio-')?'servicios':key.startsWith('cliente-')?'clientes':key.startsWith('complemento-')?'complementos':key;
  const path=paths[group]||'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>';
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" focusable="false">${path}</svg>`;
}
function createPicker(container,{id,label,options,onChange}){
  customPickers.forEach(picker=>{if(picker.trigger.id===id){picker.close();picker.list.remove();customPickers.delete(picker);}});
  const caption=document.createElement('span');caption.id=`${id}-label`;caption.className='picker-caption';caption.textContent=label;
  const trigger=document.createElement('button');trigger.type='button';trigger.id=id;trigger.className='picker-trigger';trigger.setAttribute('role','combobox');trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls',`${id}-list`);trigger.setAttribute('aria-labelledby',`${caption.id} ${id}-value`);trigger.setAttribute('aria-autocomplete','none');
  const value=document.createElement('span');value.id=`${id}-value`;value.className='picker-value';
  const symbol=document.createElement('span');symbol.className='picker-symbol';symbol.setAttribute('aria-hidden','true');
  const copy=document.createElement('span');copy.className='picker-copy';
  const hint=document.createElement('span');hint.className='picker-hint';hint.setAttribute('aria-hidden','true');hint.textContent=`${options.length} opciones disponibles`;
  const arrow=document.createElement('span');arrow.className='picker-arrow';arrow.setAttribute('aria-hidden','true');
  copy.append(value,hint);trigger.append(symbol,copy,arrow);container.append(caption,trigger);
  const list=document.createElement('div');list.id=`${id}-list`;list.className='picker-list';list.setAttribute('role','listbox');list.setAttribute('aria-labelledby',caption.id);list.hidden=true;
  list.dataset.caption=`${label} · ${options.length} opciones`;
  let selected=0,active=0,search='',searchTime=0;
  const rows=options.map((option,index)=>{
    const row=document.createElement('div');row.id=`${id}-option-${index}`;row.className='picker-option';row.setAttribute('role','option');row.setAttribute('aria-selected','false');row.dataset.value=option.value;
    const number=document.createElement('span');number.className='picker-number';number.textContent=String(index+1).padStart(2,'0');number.setAttribute('aria-hidden','true');
    const text=document.createElement('span');text.textContent=option.label;
    const check=document.createElement('span');check.className='picker-check';check.textContent='✓';check.setAttribute('aria-hidden','true');row.append(number,text,check);
    row.addEventListener('click',()=>choose(index));list.append(row);return row;
  });
  document.body.append(list);
  function position(){
    const rect=trigger.getBoundingClientRect();const viewport=window.visualViewport;
    const top=viewport?.offsetTop||0;const bottom=top+(viewport?.height||innerHeight);
    const below=bottom-rect.bottom-16,above=rect.top-top-16;
    const height=Math.min(366,Math.max(below,above));const useBelow=below>=Math.min(366,list.scrollHeight)||below>=above;
    list.style.width=`${Math.min(rect.width,innerWidth-24)}px`;list.style.left=`${Math.max(12,Math.min(rect.left,innerWidth-rect.width-12))}px`;list.style.maxHeight=`${Math.max(44,height)}px`;
    list.style.top=useBelow?`${rect.bottom+8}px`:'auto';list.style.bottom=useBelow?'auto':`${innerHeight-rect.top+8}px`;
  }
  function highlight(index){active=index;rows.forEach((row,i)=>row.classList.toggle('is-active',i===active));trigger.setAttribute('aria-activedescendant',rows[active].id);const row=rows[active];if(row.offsetTop<list.scrollTop)list.scrollTop=row.offsetTop;else if(row.offsetTop+row.offsetHeight>list.scrollTop+list.clientHeight)list.scrollTop=row.offsetTop+row.offsetHeight-list.clientHeight;}
  function open(){closePickers();list.hidden=false;trigger.setAttribute('aria-expanded','true');position();highlight(selected);}
  function close(){list.hidden=true;trigger.setAttribute('aria-expanded','false');trigger.removeAttribute('aria-activedescendant');search='';}
  function reposition(){if(list.hidden)return;const rect=trigger.getBoundingClientRect();if(!trigger.isConnected||!rect.width||rect.bottom<=0||rect.top>=innerHeight){close();return;}position();}
  function setValue(key){const index=options.findIndex(option=>option.value===key);if(index<0)return;selected=index;value.textContent=options[index].label;symbol.innerHTML=pickerIcon(options[index].value);rows.forEach((row,i)=>row.setAttribute('aria-selected',String(i===index)));}
  function choose(index){setValue(options[index].value);close();trigger.focus({preventScroll:true});onChange(options[index].value);}
  trigger.addEventListener('click',()=>list.hidden?open():close());
  trigger.addEventListener('keydown',event=>{
    const key=event.key;
    if(key==='Tab'){close();return;}
    if(key==='Escape'){if(!list.hidden){event.preventDefault();event.stopPropagation();close();}return;}
    if(['ArrowDown','ArrowUp','Home','End'].includes(key)){
      event.preventDefault();if(list.hidden){open();if(key==='ArrowDown'||key==='ArrowUp')return;}
      highlight(key==='Home'?0:key==='End'?rows.length-1:key==='ArrowDown'?(active+1)%rows.length:(active+rows.length-1)%rows.length);return;
    }
    if(key==='Enter'||key===' '){event.preventDefault();list.hidden?open():choose(active);return;}
    if(key.length===1&&!event.ctrlKey&&!event.metaKey&&!event.altKey){
      event.preventDefault();if(list.hidden)open();const now=Date.now();search=now-searchTime>700?key:search+key;searchTime=now;
      const normalize=text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es');
      const match=options.findIndex(option=>normalize(option.label).startsWith(normalize(search)));if(match>=0)highlight(match);
    }
  });
  trigger.addEventListener('blur',()=>close());
  list.addEventListener('pointerdown',event=>event.preventDefault());
  const picker={close,setValue,trigger,list,reposition};customPickers.add(picker);setValue(options[0].value);return picker;
}
document.addEventListener('pointerdown',event=>{customPickers.forEach(picker=>{if(!picker.trigger.contains(event.target)&&!picker.list.contains(event.target))picker.close();});});
window.addEventListener('resize',()=>customPickers.forEach(picker=>picker.reposition()));
window.visualViewport?.addEventListener('resize',()=>customPickers.forEach(picker=>picker.reposition()));
document.addEventListener('scroll',event=>{if(!event.target.closest?.('.picker-list'))customPickers.forEach(picker=>picker.reposition());},true);
