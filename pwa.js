(()=>{
  'use strict';
  const dialog=document.getElementById('pwa-dialog');
  const installButton=document.getElementById('pwa-install-now');
  const feedback=document.getElementById('pwa-install-feedback');
  const triggers=[...document.querySelectorAll('[data-install-app]')];
  const tabs=[...dialog.querySelectorAll('[data-install-platform]')];
  const standalone=matchMedia('(display-mode: standalone)');
  const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  let installPrompt=null;let opener=null;let registration=null;let updating=false;
  function syncInstalled(){const installed=standalone.matches||navigator.standalone===true;triggers.forEach(button=>button.hidden=installed);if(installed&&dialog.open)dialog.close();}
  function platform(value,focus=false){tabs.forEach(tab=>{const active=tab.dataset.installPlatform===value;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus({preventScroll:true});});dialog.querySelectorAll('[data-install-panel]').forEach(panel=>panel.hidden=panel.dataset.installPanel!==value);}
  platform(isIOS?'iphone':'android');syncInstalled();standalone.addEventListener('change',syncInstalled);
  triggers.forEach(button=>button.addEventListener('click',()=>{opener=button;closeNavigation();closePickers();feedback.textContent='';installButton.hidden=!installPrompt;dialog.showModal();}));
  dialog.querySelector('.pwa-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();});
  dialog.addEventListener('close',()=>{const visible=opener&&!opener.hidden&&opener.getClientRects().length;const menu=document.querySelector('.menu-toggle');(visible?opener:menu.getClientRects().length?menu:document.querySelector('.brand')).focus({preventScroll:true});});
  tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>platform(tab.dataset.installPlatform));tab.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+1)%tabs.length;platform(tabs[next].dataset.installPlatform,true);}});});
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;installButton.hidden=false;});
  window.addEventListener('appinstalled',()=>{installPrompt=null;installButton.hidden=true;triggers.forEach(button=>button.hidden=true);if(dialog.open)dialog.close();});
  installButton.addEventListener('click',async()=>{
    if(!installPrompt)return;const prompt=installPrompt;installPrompt=null;installButton.disabled=true;
    try{await prompt.prompt();const choice=await prompt.userChoice;if(choice.outcome==='accepted'){feedback.textContent='Instalación solicitada. Busque el icono de Análisis MBC en su dispositivo.';}else feedback.textContent='Puede instalar la app cuando quiera desde el menú del navegador.';}
    catch{feedback.textContent='Abra el menú de su navegador y siga los pasos de instalación indicados abajo.';}
    finally{installButton.disabled=false;installButton.hidden=true;}
  });
  const offline=document.getElementById('pwa-offline');
  function connection(){offline.hidden=navigator.onLine;}connection();window.addEventListener('online',connection);window.addEventListener('offline',connection);
  const update=document.getElementById('pwa-update');
  function showUpdate(){if(registration?.waiting&&navigator.serviceWorker.controller)update.hidden=false;}
  document.getElementById('pwa-update-button').addEventListener('click',()=>{if(!registration?.waiting)return;updating=true;registration.waiting.postMessage({type:'SKIP_WAITING'});});
  if('serviceWorker'in navigator&&location.protocol!=='file:'){
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(updating)location.reload();});
    window.addEventListener('load',async()=>{
      try{
        registration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});showUpdate();
        registration.addEventListener('updatefound',()=>{const worker=registration.installing;if(worker)worker.addEventListener('statechange',()=>{if(worker.state==='installed')showUpdate();});});
      }catch{if(dialog.open)feedback.textContent='La instalación requiere abrir la página en un navegador compatible con conexión a Internet.';}
    });
  }
})();
