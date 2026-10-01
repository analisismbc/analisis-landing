(()=>{
 const titles={
  'erp-contadores':'Cómo un ERP facilita el trabajo de los contadores',
  'erp-pymes':'El valor de un ERP para pequeñas y medianas empresas'
 };
 function render(route){
  if(route.view!=='blog')return;
  const key=titles[route.article]?route.article:null;
  document.getElementById('blog-title').textContent=key?titles[key]:'Blog';
  document.getElementById('blog-intro').hidden=Boolean(key);
  document.getElementById('blog-list').hidden=Boolean(key);
  document.querySelectorAll('[data-blog-article]').forEach(article=>article.hidden=article.dataset.blogArticle!==key);
  document.title=`${key?titles[key]:'Blog'} · Análisis MBC`;
 }
 document.addEventListener('routechange',event=>render(event.detail));
 render(resolveRoute(location.hash));
})();
