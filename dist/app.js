const modules={finanzas:{title:'Finanzas',text:'Información contable y financiera integrada.',items:['Contabilidad general','Cuentas por cobrar','Cuentas por pagar','Tesorería y bancos','Presupuesto']},inventarios:{title:'Inventarios',text:'Gestión de productos, compras, ventas y facturación.',items:['Facturación electrónica','Punto de venta (POS)','Gestión de compras y ventas','Artículos compuestos','Reportería configurable']},personas:{title:'Recursos humanos',text:'Administración de personal y procesos de planilla.',items:['Administración de personal','Horarios y reloj marcador','Gestión de vacaciones','Comprobantes de pago por correo']},activos:{title:'Activos fijos',text:'Control de activos vinculado a la contabilidad.',items:['Información de los activos','Depreciación integrada','Compras de activos','Liquidaciones de activos']}};
const tabs=[...document.querySelectorAll('[data-module]')];function selectModule(tab){tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===tab));t.tabIndex=t===tab?0:-1;const status=t.querySelector('.tab-status');if(status)status.textContent=t===tab?'Activo':'Ver'});const m=modules[tab.dataset.module];const panel=document.getElementById('module-panel');panel.setAttribute('aria-labelledby',tab.id);panel.innerHTML=`<h2>${m.title}</h2><p>${m.text}</p><ul>${m.items.map(item=>`<li>${item}</li>`).join('')}</ul><a class="text-link" href="#contacto" data-consult="Módulo ${({finanzas:'Finanzas',inventarios:'Inventarios',personas:'Recursos humanos',activos:'Activos fijos'})[tab.dataset.module]}">Consultar por este módulo</a>`;document.dispatchEvent(new CustomEvent('modulechange',{detail:tab.dataset.module}));}tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectModule(tab));tab.addEventListener('keydown',e=>{let n;if(['ArrowDown','ArrowRight'].includes(e.key))n=(i+1)%tabs.length;if(['ArrowUp','ArrowLeft'].includes(e.key))n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();selectModule(tabs[n]);tabs[n].focus({preventScroll:true})}})});selectModule(tabs[0]);
const sectors={"Otros":["Otros sectores","Evaluamos enlace soft® y desarrollos a medida según sus procesos."],"Comercio":["Comercio y distribución","Inventarios, compras, facturación electrónica y punto de venta conectados con la gestión financiera."],"Construcción":["Construcción","Gestión por proyectos con herramientas financieras, de inventarios y de personal."],"Contabilidad":["Financiero-contable","Contabilidad, cobros, pagos, tesorería y presupuesto para empresas y prácticas contables."],"Agro":["Sector agro","Soluciones agrícolas de Análisis MBC, como pineapple+, complementadas con enlace soft®."],"Producción":["Producción","Producción, artículos compuestos, inventarios y gestión financiera."]};document.querySelectorAll('[data-sector]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-sector]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button))});const [title,text]=sectors[button.dataset.sector];document.getElementById('sector-title').textContent=title;document.getElementById('sector-text').textContent=text}));
document.getElementById('contact-form').addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(e.target);
  const channel=e.submitter?.value==='whatsapp'?'whatsapp':'email';
  const name=String(d.get('nombre')||'').trim();
  const company=String(d.get('empresa')||'').trim();
  const email=String(d.get('correo')||'').trim();
  const message=String(d.get('mensaje')||'').trim();
  if(!name||!message){document.getElementById('form-status').textContent='Complete su nombre y el mensaje de consulta.';return;}
  const body=['Hola, quisiera información sobre las soluciones y servicios de Análisis MBC.','',
    'Nombre: '+name,company?'Empresa: '+company:'',email?'Correo: '+email:'','',message
  ].filter((line,i)=>line||i===1).join('\n');
  const destination=channel==='whatsapp'
    ?'https://wa.me/50686950367?text='+encodeURIComponent(body)
    :'mailto:contacto@analisis.cr?subject='+encodeURIComponent('Consulta Análisis MBC'+(company?' — '+company:''))+'&body='+encodeURIComponent(body);
  const link=document.createElement('a');link.href=destination;
  if(channel==='whatsapp'){link.target='_blank';link.rel='noopener noreferrer';}
  document.body.append(link);link.click();link.remove();
  document.getElementById('form-status').textContent=channel==='whatsapp'
    ?'Consulta preparada para WhatsApp. Revise el mensaje y confirme el envío en la aplicación que se abra.'
    :'Consulta preparada para correo. Revísela y envíela desde su aplicación. Si no se abre, escriba a contacto@analisis.cr o use WhatsApp.';
});document.getElementById('year').textContent=new Date().getFullYear();
