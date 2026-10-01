# Análisis MBC · sitio estático

La versión de GitHub Pages usa los archivos de la raíz. La publicación de Sites usa `dist/`. Mantenga ambas copias sincronizadas después de editar y ejecute `node scripts/version-assets.cjs` antes de publicar para actualizar los enlaces de estilos y scripts según su contenido.

## Herramientas de elección

`tools.js` contiene el asesor de tres pasos, el comparador, la selección, la búsqueda, el recorrido ilustrativo y la guía de implementación. El catálogo se obtiene de los módulos y de los artículos de la página, y las características de comparación provienen de las páginas de versiones y licenciamiento de analisis.cr. Revise esas características al actualizar la oferta.

La selección admite varios módulos, complementos y servicios, una versión y una modalidad de licenciamiento. El asesor ofrece orientación y explica sus recomendaciones; el alcance y la combinación se validan con un asesor de la empresa.

La selección, las respuestas del asesor y los preparativos se guardan bajo `analisis-tools-v1` en el navegador. Los datos personales del formulario de contacto no se guardan. Los enlaces compartidos llevan solamente identificadores de opciones validados y abren el sitio público de GitHub Pages. Actualice la URL en `shareURL()` si cambia el dominio público. Una selección compartida se revisa antes de usarla como selección guardada.

El resumen PDF se genera en el navegador e incluye la selección y la lista de preparación. WhatsApp y correo abren las aplicaciones con un mensaje preparado y requieren que la persona confirme el envío. Ninguna de estas funciones requiere un servidor.

El recorrido visual muestra capacidades en una interfaz ilustrativa, claramente identificada; no utiliza capturas del software real. El desarrollo de aplicaciones móviles con React Native es un servicio de Análisis MBC y está disponible en la búsqueda, la selección comercial y las consultas de contacto.
