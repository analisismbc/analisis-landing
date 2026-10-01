// Short, compositor-friendly feedback. Content stays visible if animation is unavailable.
(()=>{
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const running=new Set(),byElement=new WeakMap(),pending=new Map();let frame=0,previousRoute='';
 const enabled=()=>!reduced.matches&&!navigator.connection?.saveData&&!document.hidden;
 function stop(){running.forEach(animation=>animation.cancel());pending.clear();if(frame)cancelAnimationFrame(frame);frame=0;}
 function preference(){const disabled=reduced.matches||navigator.connection?.saveData;document.documentElement.dataset.motion=disabled?'static':'full';if(disabled)stop();}
 preference();
 function enter(element,subtle=false){
  if(!element?.isConnected||!enabled()||!element.animate)return;
  const box=element.getBoundingClientRect();if(!box.width||box.bottom<0||box.top>innerHeight)return;
  byElement.get(element)?.cancel();
  const animation=element.animate([
   {opacity:subtle?0.72:0.55,transform:`translateY(${subtle?2:5}px)`},
   {opacity:1,transform:'translateY(0)'}
  ],{duration:subtle?160:260,easing:'cubic-bezier(.2,.7,.2,1)'});
  byElement.set(element,animation);running.add(animation);
  const clear=()=>{running.delete(animation);if(byElement.get(element)===animation)byElement.delete(element);};
  animation.onfinish=clear;animation.oncancel=clear;
 }
 function queue(element,subtle=false){
  if(!element)return;pending.set(element,subtle);
  if(frame)return;
  frame=requestAnimationFrame(()=>{frame=0;pending.forEach((value,target)=>enter(target,value));pending.clear();});
 }
 function screen(event){
  const view=document.querySelector('.route-view:not([hidden])');
  const route=event?.detail;const key=route?`${route.view}/${route.category||route.tool||''}`:view?.id;
  if(key!==previousRoute)queue(view?.querySelector('.hero-copy,.explorer-top,.tools-heading,.about>div,.contact-layout>div,.blog-heading'));
  if(route?.view==='blog')queue(view.querySelector('.blog-article:not([hidden])'),true);
  if(route?.view==='catalogo')queue(view.querySelector('.category-panel:not([hidden]) .catalog-detail'),true);
  previousRoute=key;
 }
 document.addEventListener('routechange',screen);
 document.addEventListener('modulechange',()=>queue(document.getElementById('module-panel'),true));
 document.addEventListener('click',event=>{
  const target=event.target instanceof Element?event.target:null;
  const tab=target?.closest('.client-selector [role=tab]');
  if(tab){queue(document.getElementById(tab.getAttribute('aria-controls')),true);return;}
  const control=target?.closest('[data-choice],[data-sector],[data-plan-stage],[data-tour-point],[data-action="advisor-back"],[data-action="tour-next"],[data-action="tour-prev"]');
  if(!control)return;
  if(control.hasAttribute('data-plan-stage'))queue(document.querySelector('.plan-detail'),true);
  else if(control.hasAttribute('data-tour-point')||control.dataset.action?.startsWith('tour-'))queue(document.querySelector('.tour-explanation'),true);
  else if(control.dataset.action==='advisor-back')queue(document.getElementById('advisor-content'),true);
  else queue(control.closest('.catalog-detail')||document.querySelector('.sector-detail'),true);
 });
 document.addEventListener('submit',event=>{if(event.target.id==='advisor-form')queue(document.getElementById('advisor-content'),true);},true);
 reduced.addEventListener('change',preference);
 navigator.connection?.addEventListener('change',preference);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 function start(){
  screen();
  if(!enabled()||!('IntersectionObserver' in window))return;
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){queue(entry.target);observer.unobserve(entry.target);}
  },{threshold:.12});
  document.querySelectorAll('.proof,.experience-heading,.resources-heading,.resources-grid,.founder-profile').forEach(element=>observer.observe(element));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
