// Client experiences change in place, without autoplay or page movement.
(()=>{
 const tabs=[...document.querySelectorAll('.client-selector [role=tab]')];
 function select(tab){
  tabs.forEach(item=>{const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!active;});
 }
 tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>select(tab));
  tab.addEventListener('keydown',event=>{
   let next;
   if(['ArrowRight','ArrowDown'].includes(event.key))next=(index+1)%tabs.length;
   if(['ArrowLeft','ArrowUp'].includes(event.key))next=(index+tabs.length-1)%tabs.length;
   if(event.key==='Home')next=0;
   if(event.key==='End')next=tabs.length-1;
   if(next===undefined)return;
   event.preventDefault();select(tabs[next]);tabs[next].focus({preventScroll:true});
  });
 });
})();
