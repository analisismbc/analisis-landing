(()=>{
  'use strict';
  const root=document.documentElement;const system=matchMedia('(prefers-color-scheme: dark)');const key='analisis-theme';let preference=null;
  try{const saved=localStorage.getItem(key);if(saved==='dark'||saved==='light')preference=saved;}catch{}
  const moon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 13a8.5 8.5 0 0 1-9.5-9.5A8.5 8.5 0 1 0 20.5 13Z"/></svg>';
  const sun='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>';
  function apply(){const dark=(preference|| (system.matches?'dark':'light'))==='dark';root.dataset.theme=dark?'dark':'light';root.style.colorScheme=dark?'dark':'light';const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=dark?'#0b1422':'#ffffff';document.querySelectorAll('[data-theme-toggle]').forEach(button=>{button.innerHTML=dark?sun:moon;button.setAttribute('aria-label',dark?'Activar modo claro':'Activar modo oscuro');button.setAttribute('aria-pressed',String(dark));button.title=dark?'Modo claro':'Modo oscuro';});}
  apply();
  system.addEventListener('change',()=>{if(!preference)apply();});
  window.addEventListener('storage',event=>{if(event.key===key){preference=['light','dark'].includes(event.newValue)?event.newValue:null;apply();}});
  document.addEventListener('DOMContentLoaded',()=>{apply();document.querySelectorAll('[data-theme-toggle]').forEach(button=>button.addEventListener('click',()=>{preference=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem(key,preference);}catch{}apply();}));});
})();
