/* ============================================================
   RUTA VERDE — NÚCLEO
   Idioma, fotos, estado, enlace para compartir, rutas y horarios.
   ============================================================ */
(function(){
  const RV = window.RV = {};
  const $ = RV.$ = (s,r=document)=>r.querySelector(s);
  RV.$$ = (s,r=document)=>[...r.querySelectorAll(s)];
  const esc = RV.esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  RV.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let tt; RV.toast = m => { const t = $('#toast'); t.querySelector('span').textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2800); };

  /* ================= IDIOMA ================= */
  const store = RV.store = { get(k){ try { return JSON.parse(localStorage.getItem(k)); } catch(e){ return null; } }, set(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} } };
  const qLang = new URLSearchParams(location.search).get('lang');
  RV.lang = (qLang === 'en' || qLang === 'es') ? qLang : (store.get('rv-lang') || ((navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es'));
  const t = RV.t = (k, v) => { let s = (I18N[RV.lang] && I18N[RV.lang][k]) || I18N.es[k] || k; if (v) Object.keys(v).forEach(x => s = s.split('{' + x + '}').join(v[x])); return s; };
  /* campo traducido de un lugar, comida, hospedaje o pueblo */
  RV.L = (obj, field) => { if (RV.lang === 'en' && obj && EN[obj.id] && EN[obj.id][field] != null) return EN[obj.id][field]; return obj ? obj[field] : ''; };
  RV.locale = () => RV.lang === 'en' ? 'en-US' : 'es-CO';

  /* ================= FOTOS (locales, con respaldo en Wikimedia) ================= */
  RV.pSrc = (k, big) => `img/${k}-${big ? 'l' : 's'}.jpg`;
  RV.pRemote = (k, w) => 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(PHOTOS[k].f) + '?width=' + w;
  RV.pic = (k, big, alt, eager) => `<img src="${RV.pSrc(k, big)}" data-k="${k}" data-w="${big ? 1280 : 640}" alt="${esc(alt || PHOTOS[k].t)}" ${eager ? '' : 'loading="lazy"'} decoding="async">`;
  document.addEventListener('error', e => { const im = e.target; if (im.tagName === 'IMG' && im.dataset.k && !im.dataset.fb){ im.dataset.fb = 1; im.src = RV.pRemote(im.dataset.k, im.dataset.w); } }, true);
  RV.credit = k => `${t('photo.by')}: ${esc(PHOTOS[k].by)} · ${esc(PHOTOS[k].lic)} · Wikimedia Commons`;
  RV.mainPh = it => Array.isArray(it.ph) ? it.ph[0] : it.ph;

  /* ================= ÍNDICE ================= */
  const ALL = RV.ALL = {};
  PLACES.forEach(p => ALL[p.id] = {...p, kind:'lugar', wx:{t:p.typ, code:p.code, live:false}});
  FOOD.forEach(f => ALL[f.id] = {...f, kind:'comida'});
  STAYS.forEach(s => ALL[s.id] = {...s, kind:'hospedaje'});
  const TOWNS_ORDER = ['armenia','calarca','circasia','filandia','salento','montenegro','quimbaya','tebaida','cordoba','buenavista','pijao','genova'];
  RV.townIds = TOWNS_ORDER.filter(id => TOWNS[id]);
  RV.zoneName = z => ZONE_NAME[z] || z;
  RV.townOf = z => TOWNS[ZONE_TOWN[z]];
  RV.slot = s => t('slot.' + s);
  RV.type = s => t('type.' + s);
  RV.mapsUrl = it => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${it.name}, ${RV.zoneName(it.zone)}, Quindío, Colombia`);
  RV.webUrl = it => 'https://www.google.com/search?q=' + encodeURIComponent(`${it.name} ${RV.zoneName(it.zone)} Quindío`);

  /* ================= CLIMA ================= */
  RV.wxType = c => { if (c<=1) return 'sun'; if (c===2) return 'partly'; if (c===3||c===45||c===48) return 'cloud'; if (c>=95) return 'storm'; if ((c>=51&&c<=67)||(c>=80&&c<=82)) return 'rain'; return 'cloud'; };
  RV.wxIcon = c => {
    const ty = RV.wxType(c);
    const sun = '<g class="sunc"><circle cx="32" cy="32" r="11" fill="#F2B134"/><g stroke="#F2B134" stroke-width="3.5" stroke-linecap="round"><path d="M32 12v-5M32 57v-5M12 32H7M57 32h-5M18 18l-3.5-3.5M49.5 49.5L46 46M18 46l-3.5 3.5M49.5 14.5L46 18"/></g></g>';
    const cloud = (x,y,col) => `<g class="cl"><path transform="translate(${x} ${y})" d="M14 38h28a10 10 0 0 0 0-20 14 14 0 0 0-27-2A11 11 0 0 0 14 38z" fill="${col}"/></g>`;
    let s = '';
    if (ty==='sun') s = sun;
    if (ty==='partly') s = `<g transform="translate(-8 -8) scale(.85)">${sun}</g>${cloud(6,10,'#fff')}`;
    if (ty==='cloud') s = cloud(-4,0,'#C9D6CE') + cloud(6,10,'#fff');
    if (ty==='rain') s = cloud(4,2,'#DCE6EE') + '<g stroke="#5B8DB8" stroke-width="3" stroke-linecap="round"><path class="dr" d="M24 50l-2 6"/><path class="dr" d="M33 50l-2 6"/><path class="dr" d="M42 50l-2 6"/></g>';
    if (ty==='storm') s = cloud(4,2,'#B8C4CC') + '<path d="M34 40l-8 12h7l-4 10 12-15h-7l4-7z" fill="#F2B134"/>';
    return `<svg class="wx" viewBox="0 0 64 64" fill="none" aria-hidden="true">${s}</svg>`;
  };

  /* ================= ESTADO ================= */
  const KEY = 'rutaverde-tour-v2';
  const isoDay = RV.isoDay = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  RV.tomorrow = () => { const d = new Date(); d.setDate(d.getDate()+1); return isoDay(d); };
  const blank = () => ({ name:'', date:RV.tomorrow(), people:2, start:480, base:'armenia', days:[{stops:[],stay:null},{stops:[],stay:null}] });
  function clean(s){
    s.days = (s.days || []).slice(0, 7).map(d => ({stops:(d.stops||[]).filter((id,i,a) => ALL[id] && ALL[id].kind !== 'hospedaje' && a.indexOf(id) === i), stay: d.stay && ALL[d.stay] && ALL[d.stay].kind === 'hospedaje' ? d.stay : null}));
    if (!s.days.length) s.days = [{stops:[],stay:null}];
    if (!ZONE_NAME[s.base] || s.base === 'cocora') s.base = 'armenia';
    s.people = Math.min(30, Math.max(1, +s.people || 2)); s.start = [420,480,540,600].includes(+s.start) ? +s.start : 480;
    return s;
  }
  let st = store.get(KEY);
  if (!st || !Array.isArray(st.days)){
    const old = store.get('rutaverde-tour'); st = blank();
    if (old && Array.isArray(old.days)) Object.assign(st, {name:old.name||'', people:old.people||2, start:old.start||480, base:old.base||'armenia', days:old.days.map(d => ({stops:Array.isArray(d)?d:[], stay:null}))});
  }
  const state = RV.state = clean(st);
  RV.save = () => store.set(KEY, state);
  RV.allStops = () => state.days.flatMap(d => d.stops);
  RV.inTour = id => ALL[id].kind === 'hospedaje' ? state.days.some(d => d.stay === id) : state.days.some(d => d.stops.includes(id));
  RV.nights = () => state.days.filter(d => d.stay).length;
  RV.isEmpty = () => !RV.allStops().length && !RV.nights();

  /* ================= COMPARTIR POR ENLACE ================= */
  const b64e = s => btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const b64d = s => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')), c => c.charCodeAt(0)));
  RV.shareUrl = () => {
    const pack = {n:state.name, d:state.date, p:state.people, s:state.start, b:state.base, x:state.days.map(d => [d.stops, d.stay || 0])};
    return location.href.split('#')[0].split('?')[0] + '#tour=' + b64e(JSON.stringify(pack));
  };
  RV.readShared = () => {
    const m = location.hash.match(/^#tour=([\w-]+)/); if (!m) return null;
    try { const p = JSON.parse(b64d(m[1])); return clean({name:p.n||'', date:p.d||RV.tomorrow(), people:p.p, start:p.s, base:p.b, days:(p.x||[]).map(d => ({stops:d[0]||[], stay:d[1]||null}))}); }
    catch(e){ return null; }
  };

  /* ================= RUTAS Y HORARIOS ================= */
  const zi = z => ZONES.indexOf(z);
  const near = z => z === 'cocora' ? ['cocora','salento'] : z === 'salento' ? ['salento','cocora'] : z === 'calarca' ? ['calarca','armenia'] : [z];
  RV.dayMinutes = list => list.reduce((s,id) => s + ALL[id].dur, 0);
  function insertFood(list, id){
    const f = ALL[id], places = list.filter(x => ALL[x].kind === 'lugar');
    if (f.slot === 'desayuno'){ list.unshift(id); return; }
    if (f.slot === 'cena'){ list.push(id); return; }
    const zp = list.findIndex(x => ALL[x].kind === 'lugar' && ALL[x].zone === f.zone);
    if (f.slot === 'almuerzo'){ const at = zp >= 0 ? zp + 1 : (places.length ? list.indexOf(places[0]) + 1 : list.length); list.splice(at, 0, id); return; }
    if (zp >= 0){ list.splice(zp + 1, 0, id); return; }
    const c = list.findIndex(x => ALL[x].slot === 'cena'); list.splice(c >= 0 ? c : list.length, 0, id);
  }
  RV.insertFood = insertFood;
  function sortFoods(list){
    const des = list.filter(x => ALL[x].slot === 'desayuno'), cen = list.filter(x => ALL[x].slot === 'cena'), mid = list.filter(x => ALL[x].slot !== 'desayuno' && ALL[x].slot !== 'cena');
    list.splice(0, list.length, ...des, ...mid, ...cen);
  }
  RV.organize = (ids, nDays) => {
    const places = ids.filter(id => ALL[id].kind === 'lugar').sort((a,b) => zi(ALL[a].zone) - zi(ALL[b].zone));
    const foods = ids.filter(id => ALL[id].kind === 'comida');
    const days = Array.from({length:nDays}, () => []);
    const target = places.reduce((s,id) => s + ALL[id].dur, 0) / nDays;
    let d = 0, acc = 0;
    places.forEach(id => { if (d < nDays - 1 && acc > 0 && (acc + ALL[id].dur/2 > target)){ d++; acc = 0; } days[d].push(id); acc += ALL[id].dur; });
    for (let k = 0; k < nDays; k++){ if (!days[k].length){ const donor = days.reduce((m,x,j) => x.length > days[m].length ? j : m, 0); if (days[donor].length > 1) days[k].push(k > donor ? days[donor].pop() : days[donor].shift()); } }
    foods.forEach(id => {
      const z = ALL[id].zone;
      let k = days.findIndex(x => x.some(p => ALL[p].kind === 'lugar' && ALL[p].zone === z));
      if (k < 0) k = days.findIndex(x => x.some(p => near(z).includes(ALL[p].zone)));
      if (k < 0) k = days.map((x,j) => [RV.dayMinutes(x), j]).sort((a,b) => a[0]-b[0])[0][1];
      insertFood(days[k], id);
    });
    days.forEach(sortFoods);
    return days;
  };
  RV.bestDayFor = zone => {
    let k = state.days.findIndex(d => d.stops.some(x => ALL[x].kind === 'lugar' && ALL[x].zone === zone));
    if (k < 0) k = state.days.findIndex(d => d.stops.some(x => near(zone).includes(ALL[x].zone)));
    if (k < 0) k = state.days.map((d,j) => [RV.dayMinutes(d.stops), j]).sort((a,b) => a[0]-b[0])[0][1];
    return k;
  };
  /* distancia real entre pueblos: línea recta × 1,4 por curvas, a 35 km/h de promedio */
  RV.km = (a, b) => { const [la1,lo1] = ZLL[a], [la2,lo2] = ZLL[b], r = Math.PI/180; const x = Math.sin((la2-la1)*r/2)**2 + Math.cos(la1*r)*Math.cos(la2*r)*Math.sin((lo2-lo1)*r/2)**2; return 12742 * Math.asin(Math.sqrt(x)); };
  RV.travel = (a, b) => (!a || !b || a === b) ? 10 : Math.round((RV.km(a,b) * 1.4 / 35 * 60 + 10) / 5) * 5;
  RV.fmtT = m => { let h = Math.floor(m/60) % 24; const mm = m % 60, pm = h >= 12; h = h % 12 || 12; return RV.lang === 'en' ? `${h}:${String(mm).padStart(2,'0')} ${pm ? 'PM' : 'AM'}` : `${h}:${String(mm).padStart(2,'0')} ${pm ? 'p. m.' : 'a. m.'}`; };
  RV.startZone = i => { if (i === 0) return state.base; const prev = state.days[i-1].stay; return prev ? ALL[prev].zone : (state.days[i].stay ? ALL[state.days[i].stay].zone : state.base); };
  RV.schedule = i => {
    let tm = +state.start, prev = RV.startZone(i); const out = [];
    state.days[i].stops.forEach(id => {
      const it = ALL[id], tr = RV.travel(prev, it.zone);
      tm += tr;
      if (it.slot === 'almuerzo' && tm < 720) tm = 720;
      if (it.slot === 'cena' && tm < 1110) tm = 1110;
      out.push({id, start:tm, end:tm + it.dur, travel:tr, from:prev});
      tm += it.dur; prev = it.zone;
    });
    return out;
  };
  RV.dayDate = i => { if (!state.date) return ''; const d = new Date(state.date + 'T12:00'); d.setDate(d.getDate() + i); return d.toLocaleDateString(RV.locale(), {weekday:'long', day:'numeric', month:'long'}); };
  RV.durTxt = m => m >= 60 ? `${Math.floor(m/60)} h${m%60 ? ' ' + (m%60) + ' min' : ''}` : `${m} min`;
  RV.norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();

  RV.packList = () => {
    const ids = RV.allStops(), places = ids.filter(id => ALL[id].kind === 'lugar').map(id => ALL[id]);
    const items = ['pack.id','pack.cash','pack.shoes','pack.sun','pack.water','pack.charger'];
    if (places.some(p => p.wx.t < 18) || ids.includes('cocora') || ids.includes('pijao') || ids.includes('genova')) items.push('pack.jacket');
    if (places.some(p => ['rain','storm','cloud'].includes(RV.wxType(p.wx.code))) || ids.includes('cocora')) items.push('pack.rain');
    if (ids.includes('cocora') || ids.includes('pijao')) items.push('pack.boots');
    if (ids.some(id => ['parque','quimbaya','tebaida','recuca'].includes(id))) items.push('pack.cool');
    if (RV.nights()) items.push('pack.booking');
    return items.map(k => t(k));
  };
})();
