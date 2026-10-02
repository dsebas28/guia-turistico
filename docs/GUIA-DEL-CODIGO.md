# Guía del código

Recorrido técnico por Ruta Verde para entender cómo está construida por dentro. El [README](../README.md) explica qué hace la página y qué archivo editar para cambiar su contenido; esta guía explica **cómo funciona el código**, con fragmentos copiados tal cual del repositorio.

Es un sitio estático: HTML, CSS y JavaScript sin framework ni paso de compilación, y sin base de datos. Los datos de la guía viven en archivos `.js` y el tour de cada persona se guarda en su propio navegador.

## Contenido

1. [Cómo se organiza el código](#1-cómo-se-organiza-el-código)
2. [El estado del tour](#2-el-estado-del-tour)
3. [Compartir un tour con un enlace](#3-compartir-un-tour-con-un-enlace)
4. [Repartir los lugares en días](#4-repartir-los-lugares-en-días)
5. [Horarios y traslados](#5-horarios-y-traslados)
6. [Pronóstico del clima](#6-pronóstico-del-clima)
7. [Mapas y PDF: librerías solo cuando hacen falta](#7-mapas-y-pdf-librerías-solo-cuando-hacen-falta)
8. [Uso sin internet: el service worker](#8-uso-sin-internet-el-service-worker)
9. [Dos idiomas](#9-dos-idiomas)
10. [Seguridad y accesibilidad](#10-seguridad-y-accesibilidad)

## 1. Cómo se organiza el código

Todos los módulos comparten un solo objeto global, `RV`, en lugar de llenar `window` de variables sueltas. Cada archivo agrega sus funciones a `RV`, por eso el orden de carga importa:

```
data.js, data2.js, photos2.js, geo.js, routes.js   datos: pueblos, lugares, fotos, coordenadas, rutas
i18n.js, en.js, en2.js                              textos y traducciones
core.js                                             estado, idioma, horarios, enlace para compartir, clima
maps.js                                             los dos mapas (Leaflet)
ui.js                                               todo lo que se dibuja en pantalla
pdf.js                                              copiar, imprimir y descargar en PDF
```

## 2. El estado del tour

El tour completo es un objeto pequeño: nombre, fecha, número de personas, hora de salida, pueblo base y, por cada día, sus paradas y dónde se duerme. Se guarda en `localStorage`, envuelto en `try/catch` porque en modo privado el navegador puede negar el acceso:

```js
const store = RV.store = { get(k){ try { return JSON.parse(localStorage.getItem(k)); } catch(e){ return null; } }, ...
```

Todo lo que entra al estado (lo guardado, un enlace compartido o una versión antigua de la página) pasa por `clean()`, que **valida y corrige** antes de usarlo:

```js
function clean(s){
  s.days = (s.days || []).slice(0, 7).map(d => ({stops:(d.stops||[]).filter((id,i,a) => ALL[id] && ALL[id].kind !== 'hospedaje' && a.indexOf(id) === i), stay: d.stay && ALL[d.stay] && ALL[d.stay].kind === 'hospedaje' ? d.stay : null}));
  if (!s.days.length) s.days = [{stops:[],stay:null}];
  if (!ZONE_NAME[s.base] || s.base === 'cocora') s.base = 'armenia';
  s.people = Math.min(30, Math.max(1, +s.people || 2)); s.start = [420,480,540,600].includes(+s.start) ? +s.start : 480;
  return s;
}
```

Máximo 7 días, solo lugares que existen, sin repetidos, el hospedaje solo en su campo y valores dentro de rango. Si un lugar se elimina de la guía, los tours guardados que lo incluían siguen funcionando.

## 3. Compartir un tour con un enlace

El tour se comprime en un JSON con claves de una letra y se codifica en Base64 apto para URL, dentro del fragmento `#tour=`:

```js
RV.shareUrl = () => {
  const pack = {n:state.name, d:state.date, p:state.people, s:state.start, b:state.base, x:state.days.map(d => [d.stops, d.stay || 0])};
  return location.href.split('#')[0].split('?')[0] + '#tour=' + b64e(JSON.stringify(pack));
};
```

- No hace falta servidor ni base de datos: el enlace **es** el tour.
- El fragmento (`#...`) nunca se envía al servidor, así que el tour de cada persona no queda registrado en ningún lado.
- `b64e` pasa el texto por `TextEncoder` antes de `btoa`, para que los nombres con tildes o eñes no rompan la codificación.
- Al abrir el enlace, `readShared()` decodifica y pasa el resultado por `clean()`: un enlace manipulado no puede meter datos inválidos.

## 4. Repartir los lugares en días

`RV.organize` arma los días automáticamente:

```js
const places = ids.filter(id => ALL[id].kind === 'lugar').sort((a,b) => zi(ALL[a].zone) - zi(ALL[b].zone));
...
const target = places.reduce((s,id) => s + ALL[id].dur, 0) / nDays;
let d = 0, acc = 0;
places.forEach(id => { if (d < nDays - 1 && acc > 0 && (acc + ALL[id].dur/2 > target)){ d++; acc = 0; } days[d].push(id); acc += ALL[id].dur; });
```

1. Ordena los lugares por zona geográfica, para que cada día recorra pueblos vecinos.
2. Calcula cuántos minutos le tocan a cada día y va llenando: pasa al día siguiente cuando el lugar actual se pasaría de la meta en más de la mitad de su duración.
3. Si queda algún día vacío, le pasa un lugar del día más cargado.
4. Los restaurantes van al día que visita su mismo pueblo (o uno vecino) y, si no hay, al día más libre.

## 5. Horarios y traslados

`RV.schedule` calcula la hora de cada parada de un día:

```js
state.days[i].stops.forEach(id => {
  const it = ALL[id], tr = RV.travel(prev, it.zone);
  tm += tr;
  if (it.slot === 'almuerzo' && tm < 720) tm = 720;
  if (it.slot === 'cena' && tm < 1110) tm = 1110;
  out.push({id, start:tm, end:tm + it.dur, travel:tr, from:prev, km: prev !== it.zone ? RV.roadKm(prev, it.zone) : 0});
  tm += it.dur; prev = it.zone;
});
```

Las horas se manejan en **minutos desde medianoche** (720 = 12:00 m., 1110 = 6:30 p. m.), que es fácil de sumar y comparar. Un almuerzo no empieza antes del mediodía ni una cena antes de las 6:30.

`RV.travel` usa las rutas reales por carretera guardadas en `routes.js` (calculadas una sola vez con OSRM) y les suma un 30 % porque el bus va más lento que un carro, más 10 minutos de espera. Si no hay ruta, estima con la distancia en línea recta (fórmula de *haversine* en `RV.km`) multiplicada por 1,4 por las curvas.

## 6. Pronóstico del clima

`RV.loadForecast` pide a Open-Meteo el pronóstico de los 12 pueblos **en una sola petición**, pasando todas las coordenadas separadas por comas:

```js
const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + zs.map(z => ZLL[z][0]).join(',') + '&longitude=' + zs.map(z => ZLL[z][1]).join(',') +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=16&timezone=America%2FBogota';
```

El resultado se organiza por pueblo y por fecha, y cada día del tour muestra el pronóstico del pueblo que visita. Si el viaje es en más de 16 días, la página lo indica en lugar de inventar un pronóstico.

## 7. Mapas y PDF: librerías solo cuando hacen falta

Leaflet (mapas) y jsPDF (PDF) no se cargan al abrir la página, sino cuando se usan. Por ejemplo, en `pdf.js`:

```js
function loadJsPDF(){ return new Promise((ok, no) => { if (window.jspdf) return ok(); const s = document.createElement('script'); s.src = PDF_SRC; s.onload = () => window.jspdf ? ok() : no(); s.onerror = no; document.head.appendChild(s); setTimeout(() => window.jspdf ? ok() : no(), 12000); }); }
```

La primera visita descarga menos y abre más rápido; si alguien nunca genera el PDF, nunca descarga jsPDF. El tiempo límite de 12 segundos evita que el botón se quede esperando para siempre sin señal.

## 8. Uso sin internet: el service worker

`sw.js` guarda la página en el teléfono la primera vez que se abre la versión publicada. Usa una estrategia distinta según lo que se pide:

| Qué | Estrategia | Por qué |
|---|---|---|
| La página (`index.html`) | Primero internet, si falla la copia guardada | Tener siempre la versión más nueva, pero que abra sin señal |
| Archivos, fotos, letras y librerías | Primero la copia guardada, si no está se descarga y se guarda | Abren al instante y sin señal |
| Pedazos del mapa satelital | Se guardan a medida que se ven, con un máximo de 400 | Los mapas ya vistos funcionan en el Cocora; el límite evita llenar el teléfono |
| Clima en vivo | Siempre de internet | Un clima guardado de otro día sería falso; sin señal, la página muestra el clima típico |

```js
/* la página: primero internet (para tener lo más nuevo); sin señal, la copia guardada */
if (req.mode === 'navigate'){
  e.respondWith(fetch(req).then(res => { const cp = res.clone(); caches.open(VERSION).then(c => c.put('index.html', cp)); return res; })
    .catch(() => caches.match('index.html')));
  return;
}
```

Al cambiar cualquier archivo se sube `VERSION` (y el `?v=` de los archivos): el evento `activate` borra las cachés anteriores, así nadie se queda con una versión vieja.

## 9. Dos idiomas

- `i18n.js` tiene los textos de la interfaz en español e inglés; `RV.t(clave)` devuelve el del idioma activo y, si falta, el español.
- `en.js` y `en2.js` traducen el contenido de cada lugar por su `id`; `RV.L(objeto, campo)` busca la traducción y, si no existe, muestra el texto original.
- El idioma se elige por `?lang=en`, por la preferencia guardada o por el idioma del navegador, en ese orden.

## 10. Seguridad y accesibilidad

- Todo texto que se inserta en el HTML pasa por `RV.esc`, que escapa `& < > "`. Un nombre de tour malicioso dentro de un enlace compartido no puede inyectar código.
- Si el sistema pide menos movimiento (`prefers-reduced-motion`), `RV.reduce` desactiva la animación de la portada y los desplazamientos suaves.
- Las fotos tienen dos tamaños (`-s` pequeña y `-l` grande) en WebP: las tarjetas usan la pequeña y la grande solo se pide al abrir el panel de detalle o la foto en pantalla completa.
