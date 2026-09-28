# Ruta Verde — Arma tu tour por el Quindío

Guía turística **gratuita** del Eje Cafetero (Quindío, Colombia). Eliges los lugares que quieres ver, dónde comer y dónde dormir, y la página arma tu recorrido por días, con horarios, mapa y cómo llegar. Al final te llevas la guía en PDF o la compartes con un enlace.

Funciona en español e inglés. El diseño es oscuro y cinematográfico: fotos a pantalla completa, degradado de atardecer y títulos grandes.

## Qué tiene la página

- **Portada animada**: al bajar, la palabra QUINDÍO crece y se desvanece y se abre la foto del Valle del Cocora.
- **El mapa**: los 12 pueblos y todos los lugares en un mapa oscuro. Tocas un pueblo para ver su guía o un lugar para agregarlo a tu tour.
- **Tours sugeridos**: un clic carga un tour completo (lugares, restaurantes y hospedaje por noche) que luego puedes cambiar.
- **Lugares**: tarjetas con cómo llegar, cuánto tiempo necesitas, consejos y el **clima en vivo**.
- **Dónde comer** y **dónde dormir**: restaurantes y hospedajes reales del Quindío. No hay precios, solo recomendaciones.
- **Pueblo por pueblo**: pestañas con una foto grande por pueblo. Son 12: Armenia, Circasia, Filandia, Salento, Montenegro, Quimbaya, Buenavista, Calarcá, Pijao, Génova, Córdoba y La Tebaida.
- **Postales**: galería de fotos que se abren en grande.
- **Cuándo ir**: calendario de temporadas y fiestas.
- **Cómo moverse**: rutas y tarifas de transporte entre pueblos.
- **Tu tour**: el recorrido organizado por días, con un mapa que numera las paradas en orden, marca dónde duermes cada noche y deja ver un día a la vez.
- **Llevarte la guía**: copiar el texto, imprimir, descargar en PDF o compartir un enlace que abre el mismo tour en otro celular.

Tu tour se guarda en el navegador: si cierras la página y vuelves, sigue ahí.

## Cómo verla en tu computador

No necesita instalar nada. Abre `index.html` con doble clic en el navegador.

Si el clima o el mapa no cargan al abrir el archivo directamente, sírvela con un servidor local desde la carpeta del proyecto:

```bash
python -m http.server 8000
```

Y entra a http://localhost:8000

Para verla en inglés: http://localhost:8000/?lang=en

## Archivos del proyecto

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La página. Carga todos los demás archivos. |
| `styles.css` | Colores, letras y diseño. |
| `data.js` | Fotos, los primeros 7 pueblos, lugares, restaurantes, hospedajes y tours sugeridos. |
| `data2.js` | Los 5 pueblos nuevos, más lugares, calendario, tarifas de transporte y coordenadas. |
| `i18n.js` | Textos de botones y títulos en español e inglés. |
| `en.js`, `en2.js` | Traducción al inglés del contenido de `data.js` y `data2.js`. |
| `core.js` | El núcleo: idioma, fotos, guardado del tour, enlace para compartir, rutas y horarios. |
| `ui.js` | Lo que se ve en pantalla: portada animada, tarjetas, filtros, pueblos, postales, armado del tour, los dos mapas y el clima. |
| `pdf.js` | Copiar, imprimir y descargar el tour en PDF. |
| `img/` | Fotos. Cada una viene en dos tamaños: `-s` (pequeña) y `-l` (grande). |
| `robots.txt` | Permite que Google indexe la página. |
| `PUBLICAR.md` | Paso a paso para publicar la página gratis. |

Los archivos `.js` se cargan en este orden y el orden importa: `data.js`, `data2.js`, `i18n.js`, `en.js`, `en2.js`, `core.js`, `ui.js`, `pdf.js`.

## Cómo actualizar la guía

- Para agregar o cambiar un restaurante u hospedaje de los primeros 7 pueblos, edita `data.js`.
- Para los pueblos nuevos, el calendario o las tarifas de transporte, edita `data2.js`.
- Si agregas algo en español, agrega su traducción en `en2.js` con el mismo `id`. Si falta la traducción, la página muestra el texto en español.
- Para cambiar un botón o un título, edita `i18n.js` en los dos idiomas.

## Publicarla

La página son archivos sueltos: no necesita servidor ni base de datos. Se puede publicar gratis en Netlify o GitHub Pages. El paso a paso, incluido cómo aparecer en Google, está en [PUBLICAR.md](PUBLICAR.md).

## Servicios externos

La página usa estos servicios gratuitos. Todos cargan solo cuando se necesitan:

- [Open-Meteo](https://open-meteo.com/): clima en vivo de cada lugar.
- [Leaflet](https://leafletjs.com/) con mapas de OpenStreetMap, oscurecidos con CSS: el mapa de la región y el de tu tour.
- [Google Fonts](https://fonts.google.com/): letras Anton y Figtree.
- [jsPDF](https://github.com/parallax/jsPDF): crear el PDF.

Si no hay internet, la guía sigue funcionando, pero sin clima, mapa ni PDF.

## Créditos de las fotos

Las fotos vienen de [Wikimedia Commons](https://commons.wikimedia.org/). Su licencia (CC BY-SA y similares) exige nombrar al autor: los créditos están al pie de la página y en `data.js` y `data2.js`. **No los quites.**

## Aviso

Los datos de restaurantes, hospedajes, horarios y transporte pueden cambiar. Verifica antes de viajar.
