# Análisis MBC · sitio estático

La revisión de fuentes y decisiones editoriales está en [CONTENT-AUDIT.md](CONTENT-AUDIT.md). Los detalles ampliados de módulos y sectores están en `app.js`; las condiciones de compra, la historia y el contacto, en `index.html`. `theme.css` define una escala compartida de radios para marcas, controles, tarjetas, paneles y diálogos.

`atmosphere.css` y `assets/ambient-lines.svg` aportan la geometría, iluminación y profundidad de los fondos. Son decoraciones estáticas sin eventos ni animaciones; su intensidad se adapta al tema y al ancho de pantalla. El worker incluye ambos recursos para conservar estos fondos sin conexión.

La versión de GitHub Pages usa los archivos de la raíz. La publicación de Sites usa `dist/`. Mantenga ambas copias sincronizadas después de editar y ejecute `node scripts/version-assets.cjs` antes de publicar para actualizar los enlaces de estilos y scripts según su contenido.

## Herramientas de elección

`tools.js` contiene el asesor de tres pasos, el comparador, la selección, la búsqueda, el recorrido ilustrativo y la guía de implementación. El catálogo se obtiene de los módulos y de los artículos de la página, y las características de comparación provienen de las páginas de versiones y licenciamiento de analisis.cr. Revise esas características al actualizar la oferta.

La selección admite varios módulos, complementos y servicios, una versión y una modalidad de licenciamiento. El asesor ofrece orientación y explica sus recomendaciones; el alcance y la combinación se validan con un asesor de la empresa.

La selección, las respuestas del asesor y los preparativos se guardan bajo `analisis-tools-v1` en el navegador. Los datos personales del formulario de contacto no se guardan. Los enlaces compartidos llevan solamente identificadores de opciones validados y abren el sitio público de GitHub Pages. Actualice la URL en `shareURL()` si cambia el dominio público. Una selección compartida se revisa antes de usarla como selección guardada.

El resumen PDF se genera en el navegador e incluye la selección y la lista de preparación. WhatsApp y correo abren las aplicaciones con un mensaje preparado y requieren que la persona confirme el envío. Ninguna de estas funciones requiere un servidor.

El recorrido visual muestra capacidades en una interfaz ilustrativa, claramente identificada; no utiliza capturas del software real. El desarrollo de aplicaciones móviles con React Native es un servicio de Análisis MBC y está disponible en la búsqueda, la selección comercial y las consultas de contacto.

## Organización del contenido

El catálogo agrupa las aplicaciones móviles dentro de Servicios. Los enlaces anteriores `#catalogo/apps`, `#apps` y `#apps-moviles` siguen abriendo ese servicio. Cada categoría y herramienta tiene un título principal y una introducción breve; sus textos están en `catalogHeadings` (`unified.js`) y `toolHeadings` (`tools.js`). `editorial.css` define la jerarquía visual y la presentación compacta. El pie de página despliega sus enlaces secundarios a petición en móvil.

Los complementos de archivos bancarios para proveedores y colaboradores tienen identificadores distintos. Las selecciones y los enlaces compartidos anteriores conservan compatibilidad.

`navigation.js` y `navigation.css` definen el header, los breadcrumbs y los accesos flotantes al asesor, la selección y WhatsApp. La ruta de navegación refleja la categoría y la opción activas; en móvil omite el nivel genérico «Catálogo». El contador usa la misma selección del catálogo. Los accesos flotantes se ocultan al editar campos, abrir un selector o desplegar el menú, y respetan el espacio seguro inferior del dispositivo.

## App web instalable

`manifest.webmanifest`, los iconos de `assets/` y `pwa.js` permiten instalar el sitio en un navegador compatible desde «Instalar app» en el menú o el pie. Android utiliza el diálogo del navegador cuando está disponible; iPhone muestra los pasos de Safari. En modo independiente se ocultan los accesos de instalación. La instalación real se confirma en el dispositivo; no necesita backend.

`node scripts/version-assets.cjs` genera también `sw.js` en raíz y `dist/` desde `scripts/sw-template.js`. El contenido de cada recurso determina la versión de caché. El worker guarda únicamente el shell y los recursos estáticos locales; conserva el catálogo y las herramientas sin conexión después de la primera carga completada. No guarda datos del formulario, peticiones externas ni respuestas de autenticación. WhatsApp y correo requieren conectividad para enviar mensajes. Una versión nueva muestra «Actualizar app», para que la persona decida cuándo recargar.

Las rutas del manifiesto, el registro y la caché son relativas y funcionan tanto en `/analisis-landing/` de GitHub Pages como en la raíz de Sites. El service worker requiere HTTPS o localhost. Al cambiar recursos, mantenga las dos copias sincronizadas y regenere `sw.js` antes de publicar.

## Catálogo y temas

`catalog-layout.js` organiza el contenido existente en navegación de categorías, opciones y detalles. No duplica ofertas ni cambia sus identificadores. `catalog-layout.css` presenta la navegación lateral en escritorio y selectores personalizados en móvil, con módulos compactos y acciones agrupadas al final de cada detalle.

`theme.js` se ejecuta al principio de la página para aplicar el tema antes de mostrar el contenido. Usa la preferencia del sistema hasta que la persona elige modo claro u oscuro con el botón del header; guarda esa elección bajo `analisis-theme` y la sincroniza entre pestañas. `theme.css` cubre catálogo, herramientas, formularios, navegación e instalación. El generador de `sw.js` incluye también los recursos locales referidos por CSS, para conservar el tema y la marca sin conexión.

`menu.css` presenta el menú móvil con iconos, descripciones breves, la sección activa y acciones diferenciadas de contacto e instalación. Los enlaces conservan sus destinos y nombres accesibles; la navegación de escritorio mantiene sus etiquetas compactas. El panel se puede desplazar en pantallas de poca altura y conserva el cierre con Escape o al seleccionar una opción.

Los iconos de instalación usan los archivos `app-symbol-*.png` y `apple-touch-symbol.png`, compuestos con el símbolo oficial sin letras. Android puede conservar el icono y la pantalla de arranque de una instalación anterior hasta que actualice sus metadatos; quitar esa instalación y reinstalar desde la web renueva esos recursos. La pantalla nativa de arranque la dibuja el sistema, antes del loader de la web.

`icon-controls.css` centra los controles de quitar, limpiar búsqueda y cerrar instalación con SVG de 20 px y áreas táctiles mínimas de 44 px. Los desplegables usan indicadores vectoriales de más/menos en el flujo de la fila, sin depender de la tipografía ni del posicionamiento heredado. Los enlaces del pie conservan sus indicadores propios.
