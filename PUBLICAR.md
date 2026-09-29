# Cómo publicar y actualizar Ruta Verde

La página no necesita servidor ni base de datos: son archivos sueltos.

## Dónde está publicada

La página vive en GitHub Pages, gratis:

**https://dsebas28.github.io/guia-turistico/**

GitHub la vuelve a publicar sola cada vez que subes cambios a la rama `main` (tarda uno o dos minutos).
Si alguna vez deja de estar activa, se enciende en el repositorio: "Settings" > "Pages" > rama `main`, carpeta `/ (root)`.

## Actualizar la página

1. Cambia los archivos en tu computador.
2. Sube el número de versión en tres sitios, para que los navegadores y la copia sin internet tomen lo nuevo:
   - en `index.html`, el `?v=5` de cada archivo `.css` y `.js` (por ejemplo a `?v=6`);
   - en `sw.js`, la misma versión en la lista `CORE` y el nombre `VERSION` (por ejemplo `rv-7`).
3. Sube los cambios a GitHub (`git add`, `git commit`, `git push`).

## Aparecer en Google

1. Entra a https://search.google.com/search-console y agrega la dirección de la página.
2. En "Sitemaps", envía `https://dsebas28.github.io/guia-turistico/sitemap.xml` (ya está en el proyecto).

Si publicas en otra dirección, cámbiala en `index.html` (etiquetas `canonical`, `hreflang` y `og:`), en `sitemap.xml` y en `robots.txt`.

## Otra opción: Netlify Drop

1. Entra a https://app.netlify.com/drop y crea una cuenta gratis.
2. Arrastra la carpeta completa "pagina de guia" a la página.
3. Netlify te da un enlace; en "Site configuration" > "Change site name" ponle un nombre fácil.

Sube siempre la carpeta completa, incluida `img`. No borres ningún archivo `.js`.

## Enlaces útiles para compartir

- Versión en español: `https://dsebas28.github.io/guia-turistico/?lang=es`
- Versión en inglés: `https://dsebas28.github.io/guia-turistico/?lang=en`

## Mantener la guía al día

- Restaurantes y hospedajes de los primeros 7 pueblos: `data.js`
- Pueblos nuevos, calendario y tarifas de transporte: `data2.js`
- Ubicación exacta de un restaurante u hospedaje: `geo.js` (`id:[latitud, longitud]`)
- Traducciones al inglés del contenido: `en.js` y `en2.js`
- Textos de botones y títulos en los dos idiomas: `i18n.js`

Si agregas un restaurante o un hotel en español, agrega también su traducción en `en2.js` con el mismo `id`.
Si falta la traducción, la página muestra el texto en español.

Para una foto nueva: guárdala en `img/` en dos tamaños WebP, `nombre-s.webp` (600 px de ancho) y `nombre-l.webp` (1440 px), y agrega su autor en `PHOTOS` de `data.js`.

Las fotos vienen de Wikimedia Commons. Su licencia exige nombrar al autor: los créditos están al pie de la página. No los quites.
