/* ============================================================
   RUTA VERDE — MAPAS
   Mapa de tu tour y mapa de la región (Leaflet + satélite de Esri).
   Se carga después de core.js y antes de ui.js.
   Usa, si existen, ROUTES (routes.js: rutas por carretera) y
   GEO (geo.js: ubicación exacta de restaurantes y hospedajes).
   ============================================================ */
(function(){
  const RV = window.RV, {$, $$, esc, t, L, ALL, state, pic} = RV;
  const zn = z => RV.zoneName(z);
  const ICON = () => RV.ICON;
  const townObj = id => ({...TOWNS[id], id:'town-' + id});

  /* colores de cada día (claros, con texto oscuro encima) */
  const DAYC = RV.DAYC = ['#F2A33A','#A8E063','#5CC8FF','#E8743B','#F6D365','#3CC9A0','#F3EFE4'];

  /* ---------- Leaflet: se carga solo cuando hace falta ---------- */
  let leaflet = null;
  function loadLeaflet(){
    if (leaflet) return leaflet;
    const get = (tag, attrs) => new Promise((ok, no) => { const el = document.createElement(tag); Object.assign(el, attrs); el.onload = ok; el.onerror = no; document.head.appendChild(el); });
    /* esperamos también la hoja de estilos: sin ella las teselas salen desordenadas */
    leaflet = Promise.all([
      get('link', {rel:'stylesheet', href:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'}),
      get('script', {src:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'})
    ]).then(() => { if (!window.L) throw new Error('leaflet'); });
    leaflet.catch(() => { leaflet = null; });
    return leaflet;
  }
  RV.loadLeaflet = loadLeaflet;

  /* Satélite de Esri con carreteras encima. No pide clave y funciona aunque abras la página con doble clic
     (los servidores de OpenStreetMap bloquean las páginas abiertas desde un archivo). */
  const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/';
  const tiles = Lf => Lf.layerGroup([
    Lf.tileLayer(ESRI + 'World_Imagery/MapServer/tile/{z}/{y}/{x}', {maxZoom:18, maxNativeZoom:17, className:'sat-tiles', attribution:'Imágenes: <a href="https://www.esri.com" target="_blank" rel="noopener">Esri</a>, Maxar, Earthstar Geographics'}),
    Lf.tileLayer(ESRI + 'Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {maxZoom:18, maxNativeZoom:17, className:'road-tiles', attribution:'Vías: Esri, HERE, © OpenStreetMap · Rutas: OSRM'})
  ]);

  /* ---------- rutas por carretera (routes.js) ---------- */
  function decode(str){ /* polilínea codificada de Google, precisión 5 */
    const pts = []; let i = 0, lat = 0, lon = 0;
    while (i < str.length){
      for (const k of [0,1]){ let b, shift = 0, res = 0; do { b = str.charCodeAt(i++) - 63; res |= (b & 31) << shift; shift += 5; } while (b >= 32); const d = res & 1 ? ~(res >> 1) : res >> 1; if (k) lon += d; else lat += d; }
      pts.push([lat / 1e5, lon / 1e5]);
    }
    return pts;
  }
  const cache = {};
  RV.route = (a, b) => {
    if (typeof ROUTES === 'undefined' || !a || !b || a === b) return null;
    const key = a < b ? a + '|' + b : b + '|' + a, r = ROUTES[key];
    if (!r) return null;
    if (!cache[key]) cache[key] = decode(r.g);
    return {km:r.km, min:r.min, pts: a < b ? cache[key] : cache[key].slice().reverse()};
  };
  /* curva suave entre dos puntos, solo si no hay ruta por carretera */
  function arc(a, b, bend){
    const [y1,x1] = a, [y2,x2] = b, mx = (x1+x2)/2, my = (y1+y2)/2, dx = x2-x1, dy = y2-y1;
    const cx = mx - dy * bend, cy = my + dx * bend, out = [];
    for (let k = 0; k <= 16; k++){ const u = k/16, v = 1-u; out.push([v*v*y1 + 2*v*u*cy + u*u*y2, v*v*x1 + 2*v*u*cx + u*u*x2]); }
    return out;
  }

  /* ============================================================
     MAPA DE TU TOUR
     ============================================================ */
  let tmap = null, tlayer = null, dayFocus = -1;
  function drawTourMap(){
    const box = $('#tourMap'); if (!box) return;
    loadLeaflet().then(() => {
      const Lf = window.L;
      if (!tmap){
        box.innerHTML = '';
        tmap = RV.map = Lf.map(box, {scrollWheelZoom:false, zoomControl:true, attributionControl:true, zoomSnap:.25});
        /* con el mapa muy alejado los nombres se montan: se ocultan */
        tmap.on('zoomend', () => box.classList.toggle('nolabels', tmap.getZoom() < (box.clientWidth > 600 ? 9.75 : 10.75)));
        tiles(Lf).addTo(tmap);
        tlayer = Lf.layerGroup().addTo(tmap);
        new ResizeObserver(() => tmap.invalidateSize()).observe(box);
      }
      if (dayFocus >= state.days.length) dayFocus = -1;
      tlayer.clearLayers();
      const allPts = [], dayPts = [];
      /* 1) qué días pasan por cada pueblo y quién duerme dónde, para repartir los marcadores sin que se tapen */
      const daysIn = {}, nightsIn = {};
      state.days.forEach((d,i) => {
        d.stops.forEach(id => { const z = ALL[id].zone; daysIn[z] = daysIn[z] || []; if (!daysIn[z].includes(i)) daysIn[z].push(i); });
        if (d.stay) (nightsIn[ALL[d.stay].zone] = nightsIn[ALL[d.stay].zone] || []).push(i);
      });
      const PIN = 30, GAP = 4;
      const fanX = (z, i) => { const list = daysIn[z] || [i], k = list.indexOf(i), n = list.length; return (k - (n - 1) / 2) * (PIN + GAP); };
      const fanHalf = z => ((daysIn[z] || [0]).length * (PIN + GAP)) / 2;
      state.days.forEach((d,i) => {
        const col = DAYC[i % DAYC.length], on = dayFocus < 0 || dayFocus === i, op = on ? 1 : .2;
        /* ruta del día en el orden real de las paradas, por carretera cuando la conocemos */
        const start = RV.startZone(i), path = [start, ...d.stops.map(id => ALL[id].zone)];
        if (d.stay) path.push(ALL[d.stay].zone);
        const mine = path.map(z => ZLL[z]);
        for (let k = 1; k < path.length; k++){
          if (path[k] === path[k-1]) continue;
          const r = RV.route(path[k-1], path[k]);
          const seg = r ? r.pts : arc(ZLL[path[k-1]], ZLL[path[k]], .12 + (i % 4) * .06);
          if (r) mine.push(...seg.filter((_, j) => j % 8 === 0));
          if (on) Lf.polyline(seg, {color:col, weight:10, opacity:.2, interactive:false}).addTo(tlayer);
          Lf.polyline(seg, {color:col, weight:3.5, opacity:op, dashArray: on ? null : '4 8', interactive:false}).addTo(tlayer);
        }
        /* punto de salida: solo si ese día no sale de donde durmió */
        if (i === 0 || !state.days[i-1].stay){
          Lf.marker(ZLL[start], {icon:Lf.divIcon({className:'', html:'<div class="spin"></div>', iconSize:[22,22], iconAnchor:[11,11]}), opacity:op, zIndexOffset:-100}).addTo(tlayer).bindPopup(`<b>${t('map.start')}</b><br>${t('day')} ${i+1} · ${zn(start)}`);
        }
        /* un marcador por pueblo y por día, con todos los números de parada de ese día en ese pueblo */
        const byZone = {};
        d.stops.forEach((id, j) => (byZone[ALL[id].zone] = byZone[ALL[id].zone] || []).push([j+1, id]));
        Object.keys(byZone).forEach(z => {
          const items = byZone[z], nums = items.map(x => x[0]);
          const seq = nums.every((n,k) => !k || n === nums[k-1] + 1);
          const label = nums.length > 2 ? (seq ? `${nums[0]}–${nums[nums.length-1]}` : `${nums[0]}·${nums[1]}+`) : nums.join('·');
          const html = `<div class="tpin${label.length > 3 ? ' wide' : ''}"><span style="background:${col}"></span><b>${label}</b></div>`;
          Lf.marker(ZLL[z], {icon:Lf.divIcon({className:'', html, iconSize:[PIN,PIN], iconAnchor:[PIN/2 - fanX(z, i), PIN + 6]}), opacity:op, zIndexOffset: on ? 600 + i : 100, riseOnHover:true, title:`${t('day')} ${i+1} · ${zn(z)}`}).addTo(tlayer)
            .bindPopup(`<b>${t('day')} ${i+1} · ${esc(zn(z))}</b><br>${items.map(([n,id]) => `${n}. ${esc(ALL[id].name)}`).join('<br>')}`);
        });
        dayPts[i] = mine; allPts.push(...mine);
      });
      /* 2) nombre de cada pueblo, una sola vez, debajo del punto */
      const named = new Set([...Object.keys(daysIn), ...Object.keys(nightsIn), ...state.days.map((_,i) => RV.startZone(i))]);
      named.forEach(z => {
        const vis = dayFocus < 0 || (daysIn[z] || []).includes(dayFocus) || (nightsIn[z] || []).includes(dayFocus) || RV.startZone(dayFocus) === z;
        Lf.marker(ZLL[z], {icon:Lf.divIcon({className:'', html:`<em class="tname">${esc(zn(z))}</em>`, iconSize:[0,0], iconAnchor:[0,-12]}), interactive:false, opacity: vis ? 1 : .3, zIndexOffset:50}).addTo(tlayer);
      });
      /* 3) una cama por pueblo donde duermes, a la derecha de los marcadores; el globo dice qué noches */
      Object.keys(nightsIn).forEach(z => {
        const ns = nightsIn[z], col = DAYC[ns[0] % DAYC.length], vis = dayFocus < 0 || ns.includes(dayFocus);
        const html = `<span style="background:${col}">${ICON().bed}${ns.length > 1 ? `<small>${ns.length}</small>` : ''}</span>`;
        Lf.marker(ZLL[z], {icon:Lf.divIcon({className:'bedpin', html, iconSize:[28,28], iconAnchor:[-(fanHalf(z) + 4), 34]}), opacity: vis ? 1 : .2, zIndexOffset:550}).addTo(tlayer)
          .bindPopup(ns.map(i => `<b>${t('night.of', {n:i+1})}</b><br>${esc(ALL[state.days[i].stay].name)}`).join('<br>') + ` · ${esc(zn(z))}`);
      });
      const focus = dayFocus >= 0 && dayPts[dayFocus] && dayPts[dayFocus].length > 1 ? dayPts[dayFocus] : allPts.length > 1 ? allPts : [ZLL[state.base], ...allPts];
      tmap.invalidateSize();
      tmap.fitBounds(Lf.latLngBounds(focus), {paddingTopLeft:[50,60], paddingBottomRight:[70,40], maxZoom:12, animate:false});
      box.classList.toggle('nolabels', tmap.getZoom() < (box.clientWidth > 600 ? 9.75 : 10.75));
      $('#mapLegend').innerHTML = (state.days.length > 1 ? `<button type="button" data-dayf="-1" class="${dayFocus < 0 ? 'on' : ''}">${t('map.all')}</button>` : '') +
        state.days.map((d,i) => `<button type="button" data-dayf="${i}" class="${dayFocus === i ? 'on' : ''}"><i style="background:${DAYC[i % DAYC.length]}"></i>${t('day')} ${i+1}</button>`).join('') +
        `<span class="lg-note">${ICON().bed} ${t('map.night')}</span>`;
      $$('[data-dayf]').forEach(b => b.onclick = () => { dayFocus = +b.dataset.dayf; drawTourMap(); });
    }).catch(() => {
      tmap = null;
      box.innerHTML = `<p class="map-off">${t('map.offline')}<br><button type="button" class="btn sm lite" id="mapRetry">${t('map.retry')}</button></p>`;
      $('#mapRetry').onclick = drawTourMap;
    });
  }
  RV.drawTourMap = drawTourMap;

  /* ============================================================
     MAPA DE LA REGIÓN
     ============================================================ */
  let rmap = null, rlayer = null, rtowns = {}, rplaces = {}, rextra = {};
  const REGION = [[4.19,-75.84],[4.70,-75.46]];
  const FITPAD = () => innerWidth < 640 ? {paddingTopLeft:[70,10], paddingBottomRight:[60,150]} : {paddingTopLeft:[40,20], paddingBottomRight:[40,90]};
  const LEFT = ['armenia','quimbaya','montenegro','tebaida','buenavista','genova']; /* nombre a la izquierda para que no se tapen */
  const layers = {food:false, stay:false};
  const townLL = id => id === 'montenegro' ? [4.566,-75.751] : ZLL[TOWNS[id].zones[0]];

  function drawRegion(){
    const box = $('#regionMap'); if (!box || rmap) return;
    loadLeaflet().then(() => {
      const Lf = window.L;
      rmap = Lf.map(box, {scrollWheelZoom:false, zoomControl:true, minZoom:9, zoomSnap:.25, maxBounds:Lf.latLngBounds(REGION).pad(.6)});
      tiles(Lf).addTo(rmap);
      rmap.fitBounds(REGION, FITPAD());
      new ResizeObserver(() => rmap.invalidateSize()).observe(box);
      rlayer = Lf.layerGroup().addTo(rmap);
      buildRegion(); refreshRegion();
    }).catch(() => { box.innerHTML = `<p class="map-off">${t('map.offline')}</p>`; });
  }
  function itemPop(it){
    const on = RV.inTour(it.id), k = RV.mainPh(it);
    const kicker = it.kind === 'lugar' ? zn(it.zone) : it.kind === 'comida' ? `${RV.slot(it.slot)} · ${zn(it.zone)}` : `${RV.type(it.type)} · ${zn(it.zone)}`;
    const sub = it.kind === 'lugar' ? L(it,'tag') : it.kind === 'comida' ? L(it,'dish') : L(it,'good').join(' · ');
    const add = it.kind === 'hospedaje' ? (on ? t('btn.chosen') : t('btn.sleepHere')) : (on ? t('btn.inTour') : t('btn.add'));
    return `<div class="rpop">${pic(k, false, PHOTOS[k].t)}<small>${esc(kicker)}</small><b>${esc(it.name)}</b><span>${esc(sub)}</span>
      <div class="row"><button type="button" class="btn ${on ? 'lime' : ''}" data-toggle="${it.id}">${on ? ICON().check : ICON().plus} ${add}</button><button type="button" class="btn ghost" data-open="${it.id}">${t('btn.view')}</button></div></div>`;
  }
  function buildRegion(){
    if (!rmap) return;
    const Lf = window.L, cur = RV.curTown ? RV.curTown() : null;
    rmap.closePopup(); rlayer.clearLayers(); rtowns = {}; rplaces = {}; rextra = {food:[], stay:[]};
    RV.townIds.forEach(id => {
      const tw = TOWNS[id], to = townObj(id);
      const m = Lf.marker(townLL(id), {icon:Lf.divIcon({className:'', html:`<div class="rtown ${LEFT.includes(id) ? 'l' : ''} ${id === cur ? 'on' : ''}"><i></i><b>${tw.name}</b></div>`, iconSize:[0,0], iconAnchor:[0,0]}), zIndexOffset:1000, riseOnHover:true, keyboard:true, title:tw.name}).addTo(rlayer);
      m.bindPopup(() => { const pl = ALL[id] && ALL[id].kind === 'lugar' ? ALL[id] : null, on = pl && RV.inTour(id);
        return `<div class="rpop">${pic(tw.ph, false, PHOTOS[tw.ph].t)}<small>${t('nav.towns')}</small><b>${tw.name}</b><span>${esc(L(to,'tag'))}</span><div class="row"><button type="button" class="btn" data-town="${id}" data-scroll="1">${t('rmap.seeTown')}</button>${pl ? `<button type="button" class="btn ${on ? 'lime' : 'ghost'}" data-toggle="${id}" aria-label="${esc(on ? t('btn.inTour') : t('btn.add'))}">${on ? ICON().check : ICON().plus}</button>` : ''}</div></div>`; }, {minWidth:250, maxWidth:280});
      rtowns[id] = m;
    });
    PLACES.forEach(p => {
      if (RV.townIds.includes(p.id)) return; /* el pueblo ya tiene su marcador */
      const m = Lf.marker([p.lat, p.lon], {icon:Lf.divIcon({className:'', html:'<div class="rplace"></div>', iconSize:[14,14], iconAnchor:[7,7]}), riseOnHover:true, title:p.name}).addTo(rlayer);
      m.bindPopup(() => itemPop(ALL[p.id]), {minWidth:250, maxWidth:280});
      rplaces[p.id] = m;
    });
    /* restaurantes y hospedajes: solo los que tienen ubicación exacta (geo.js) */
    [['food', FOOD], ['stay', STAYS]].forEach(([kind, list]) => list.forEach(it => {
      const ll = RV.exactLL(it.id); if (!ll) return;
      const m = Lf.marker(ll, {icon:Lf.divIcon({className:'', html:`<div class="rdot ${kind}"></div>`, iconSize:[12,12], iconAnchor:[6,6]}), riseOnHover:true, title:it.name});
      m.bindPopup(() => itemPop(ALL[it.id]), {minWidth:250, maxWidth:280});
      m._rvId = it.id; rextra[kind].push(m);
      if (layers[kind]) m.addTo(rlayer);
    }));
    renderLayerBtns();
  }
  function renderLayerBtns(){
    const box = $('#rmLayers'); if (!box) return;
    const n = k => rextra[k] ? rextra[k].length : 0;
    box.innerHTML = [['food', t('rmap.food'), 'var(--orange)'], ['stay', t('rmap.stays'), '#5CC8FF']].filter(([k]) => n(k))
      .map(([k, lbl, c]) => `<button type="button" data-layer="${k}" aria-pressed="${layers[k]}"><i style="background:${c}"></i>${lbl} (${n(k)})</button>`).join('');
    $$('[data-layer]', box).forEach(b => b.onclick = () => {
      const k = b.dataset.layer; layers[k] = !layers[k]; b.setAttribute('aria-pressed', layers[k]);
      rextra[k].forEach(m => layers[k] ? m.addTo(rlayer) : rlayer.removeLayer(m));
      refreshRegion();
    });
  }
  /* al agregar o quitar algo: solo cambia el color de los marcadores y el botón del globo abierto */
  function refreshRegion(){
    if (!rmap) return;
    const set = (m, id) => { const el = m.getElement && m.getElement(); if (el && el.firstElementChild) el.firstElementChild.classList.toggle('in', RV.inTour(id)); };
    Object.keys(rplaces).forEach(id => set(rplaces[id], id));
    Object.keys(rtowns).forEach(id => { if (ALL[id]) set(rtowns[id], id); });
    ['food','stay'].forEach(k => (rextra[k] || []).forEach(m => set(m, m._rvId)));
    const pop = rmap._popup; if (pop && rmap.hasLayer(pop)) pop.update();
  }
  RV.buildRegion = buildRegion;
  RV.refreshRegion = refreshRegion;
  RV.closeRegionPopup = () => { if (rmap) rmap.closePopup(); };
  RV.markTown = id => { $$('.rtown').forEach(el => el.classList.remove('on')); const m = rtowns[id]; if (m && m.getElement()) m.getElement().querySelector('.rtown').classList.add('on'); };
  $('#rmReset').onclick = () => { if (rmap){ rmap.closePopup(); rmap.flyToBounds(REGION, {...FITPAD(), duration: RV.reduce ? 0 : .8}); } };
  new IntersectionObserver((es, ob) => es.forEach(e => { if (e.isIntersecting){ drawRegion(); ob.disconnect(); } }), {rootMargin:'400px'}).observe($('#regionMap'));
})();
