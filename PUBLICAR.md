# Cómo publicar Ruta Verde gratis

La página no necesita servidor ni base de datos: son archivos sueltos. Cualquier hosting gratuito de sitios estáticos sirve.

## Opción 1: Netlify Drop (la más fácil, 5 minutos)

1. Entra a https://app.netlify.com/drop
2. Crea una cuenta gratis (con Google o con tu correo).
3. Arrastra la carpeta completa "pagina de guia" a la página.
4. Netlify te da un enlace como `https://nombre-raro.netlify.app`.
5. En "Site configuration" > "Change site name" ponle un nombre fácil, por ejemplo `rutaverde-quindio`.

Para actualizar la página después, vuelve a arrastrar la carpeta en la pestaña "Deploys".

## Opción 2: GitHub Pages

1. Crea una cuenta en https://github.com y un repositorio público, por ejemplo `rutaverde`.
2. Sube todos los archivos de la carpeta (botón "Add file" > "Upload files").
3. En "Settings" > "Pages", elige la rama `main` y la carpeta `/ (root)`.
4. Tu página queda en `https://TU-USUARIO.github.io/rutaverde/`.

## Qué subir

Sube la carpeta completa, incluida la carpeta `img`. No borres ningún archivo `.js`.
El archivo `PUBLICAR.md` no hace falta, pero no estorba.

## Después de publicar: aparecer en Google

1. Entra a https://search.google.com/search-console y agrega tu enlace.
2. Crea un archivo `sitemap.xml` con este contenido, cambiando la dirección por la tuya, y súbelo:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://TU-DIRECCION/</loc></url>
  <url><loc>https://TU-DIRECCION/?lang=en</loc></url>
</urlset>
```

3. En Search Console, en "Sitemaps", envía `sitemap.xml`.

## Enlaces útiles para compartir

- Versión en español: `https://TU-DIRECCION/?lang=es`
- Versión en inglés: `https://TU-DIRECCION/?lang=en`

## Mantener la guía al día

- Restaurantes y hospedajes de los primeros 7 pueblos: `data.js`
- Pueblos nuevos, calendario y tarifas de transporte: `data2.js`
- Traducciones al inglés del contenido: `en.js` y `en2.js`
- Textos de botones y títulos en los dos idiomas: `i18n.js`

Si agregas un restaurante o un hotel en español, agrega también su traducción en `en2.js` con el mismo `id`.
Si falta la traducción, la página muestra el texto en español.

Las fotos vienen de Wikimedia Commons. Su licencia exige nombrar al autor: los créditos están al pie de la página. No los quites.
