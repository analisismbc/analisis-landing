// A shared, keyboard-accessible picker. Focus stays on the trigger so opening
// and changing an option never scrolls the page to a different control.
const customPickers = new Set();
function closePickers(){customPickers.forEach(picker=>picker.close());}
function createPicker(container,{id,label,options,onChange}){
  customPickers.forEach(picker=>{if(picker.trigger.id===id){picker.close();picker.list.remove();customPickers.delete(picker);}});
  const caption=document.createElement('span');caption.id=`${id}-label`;caption.className='picker-caption';caption.textContent=label;
  const trigger=document.createElement('button');trigger.type='button';trigger.id=id;trigger.className='picker-trigger';trigger.setAttribute('role','combobox');trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls',`${id}-list`);trigger.setAttribute('aria-labelledby',`${caption.id} ${id}-value`);trigger.setAttribute('aria-autocomplete','none');
  const value=document.createElement('span');value.id=`${id}-value`;value.className='picker-value';
  const arrow=document.createElement('span');arrow.className='picker-arrow';arrow.setAttribute('aria-hidden','true');
  trigger.append(value,arrow);container.append(caption,trigger);
  const list=document.createElement('div');list.id=`${id}-list`;list.className='picker-list';list.setAttribute('role','listbox');list.setAttribute('aria-labelledby',caption.id);list.hidden=true;
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
  function setValue(key){const index=options.findIndex(option=>option.value===key);if(index<0)return;selected=index;value.textContent=options[index].label;rows.forEach((row,i)=>row.setAttribute('aria-selected',String(i===index)));}
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
