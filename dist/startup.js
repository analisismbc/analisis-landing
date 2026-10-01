(()=>{
  'use strict';
  const root=document.documentElement;
  root.dataset.appStarting='true';
  function finish(){root.removeAttribute('data-app-starting');document.getElementById('app-startup')?.remove();}
  // Deferred application scripts initialize before DOMContentLoaded; never wait for web fonts.
  document.addEventListener('DOMContentLoaded',finish,{once:true});
  window.addEventListener('pageshow',event=>{if(event.persisted)finish();});
  // Keep the page accessible if a script request fails or stalls.
  setTimeout(finish,5000);
})();
