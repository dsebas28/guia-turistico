/* ============================================================
   RUTA VERDE — INTERFAZ
   ============================================================ */
(function(){
  const RV = window.RV, {$, $$, esc, t, L, ALL, state, pic} = RV;
  const ICON = RV.ICON = {
    pin:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    nav:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-8-8 18-2-8z"/></svg>',
    web:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>',
    bus:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M8 18v3M16 18v3"/><circle cx="8" cy="14.5" r="1"/><circle cx="16" cy="14.5" r="1"/></svg>',
    clock:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    star:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.3l6-.8z"/></svg>',
    bed:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="2"/></svg>',
    fork:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v8a2 2 0 0 0 2 2v8M11 3v8M3 3v8a2 2 0 0 0 2 2M17 3c-2 0-3 3-3 6s1 4 3 4v8"/></svg>',
    heart:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    plus:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    check:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>',
    up:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>',
    down:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    x:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    arr:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };
  const PRESET_ICONS = [
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 3v3M12 3v3"/></svg>',
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20l6-10 4 6 3-4 5 8z"/></svg>',
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 21v-2a5 5 0 0 1 10 0v2M14 21v-1.5a3.5 3.5 0 0 1 7 0V21"/></svg>'
  ];
  const PRESET_PH = ['salento3', 'buenavista2', 'parque'].map(k => PHOTOS[k] ? k : 'cocora');
  const zn = RV.zoneName, dur = RV.durTxt;
  const townObj = id => ({...TOWNS[id], id:'town-' + id});

  /* ================= TEXTOS FIJOS ================= */
  function applyStatic(){
    document.documentElement.lang = RV.lang;
    $$('[data-i18n]').forEach(el => el.innerHTML = t(el.dataset.i18n));
    $$('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));
    $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    $('#langBtn').textContent = RV.lang === 'en' ? 'ES' : 'EN';
    $('#langBtn').setAttribute('aria-label', t('lang.switch'));
    document.title = t('meta.title');
    const base = $('#tBase'), cur = state.base;
    base.innerHTML = RV.townIds.map(id => TOWNS[id].zones[0]).map(z => `<option value="${z}">${zn(z)}</option>`).join('');
    base.value = cur;
    $('#tStart').innerHTML = [420,480,540,600].map(m => `<option value="${m}">${RV.fmtT(m)}</option>`).join('');
    $('#tStart').value = state.start;
  }

  /* ================= TARJETAS ================= */
  const F = {place:'todos', q:'', foodTown:'todos', foodSlot:'todos', stayTown:'todos', stayFam:'todos'};
  const short = s => s.length > 115 ? s.slice(0, 112).replace(/\s\S*$/,'') + '…' : s;
  function card(it){
    const on = RV.inTour(it.id), k = RV.mainPh(it);
    let typ, chip, where, meta, note = '';
    if (it.kind === 'lugar'){ typ = L(it,'town'); chip = `<span class="tchip">${RV.wxIcon(it.wx.code)}${Math.round(it.wx.t)}°</span>`; where = L(it,'tag'); meta = `<span>${dur(it.dur)}</span><span>${it.alt}</span>`; if (it.phNote) note = `<span class="fnote">${t('note.photoIllus')}</span>`; }
    else if (it.kind === 'comida'){ typ = RV.slot(it.slot); chip = `<span class="tchip txt">${zn(it.zone)}</span>`; where = L(it,'dish'); meta = `<span>${dur(it.dur)}</span><span>${RV.slot(it.slot)}</span>`; note = `<span class="fnote">${t('note.photoDish')}</span>`; }
    else { typ = RV.type(it.type); chip = `<span class="tchip txt">${zn(it.zone)}</span>`; where = t('stay.in', {town:zn(it.zone)}); meta = L(it,'good').map(g => `<span>${esc(g)}</span>`).join(''); note = `<span class="fnote">${t('note.photoTown')}</span>`; }
    const addTxt = it.kind === 'hospedaje' ? (on ? ICON.check + ' ' + t('btn.chosen') : ICON.plus + ' ' + t('btn.sleepHere')) : (on ? ICON.check + ' ' + t('btn.inTour') : ICON.plus + ' ' + t('btn.add'));
    return `<article class="card ${on?'added':''}" data-id="${it.id}">
      <div class="art" data-open="${it.id}" role="button" tabindex="0" aria-label="${esc(t('aria.details', {name:it.name}))}">${pic(k, false, PHOTOS[k].t)}
        <span class="typ">${esc(typ)}</span>${chip}<span class="check">${ICON.check}</span></div>
      <div class="body"><h3>${esc(it.name)}</h3><span class="where">${esc(where)}</span>
        <p>${esc(short(L(it,'desc')))}</p>
        <div class="meta">${meta}</div>${note}
        <div class="acts"><button type="button" class="btn ${on?'lime':''}" data-toggle="${it.id}">${addTxt}</button><button type="button" class="btn ghost" data-open="${it.id}" style="flex:0 0 auto;padding:0 14px">${t('btn.view')}</button><a class="btn ghost icon" href="${RV.mapsUrl(it)}" target="_blank" rel="noopener" aria-label="${esc(t('btn.directions'))}: ${esc(it.name)}" title="${esc(t('btn.directions'))}">${ICON.nav}</a></div>
      </div></article>`;
  }
  const inTown = (zone, tw) => tw === 'todos' || ZONE_TOWN[zone] === tw;
  function renderCards(){
    const ps = PLACES.map(p => ALL[p.id]).filter(p => (F.place === 'todos' || p.cat.includes(F.place)) && (!F.q || RV.norm([p.name, p.town, L(p,'tag'), L(p,'todo').join(' '), zn(p.zone)].join(' ')).includes(RV.norm(F.q))));
    $('#gPlaces').innerHTML = ps.length ? ps.map(card).join('') : `<div class="empty-res">${t('empty.places', {q:esc(F.q)})}</div>`;
    const fs = FOOD.map(f => ALL[f.id]).filter(f => inTown(f.zone, F.foodTown) && (F.foodSlot === 'todos' || f.slot === F.foodSlot));
    $('#gFood').innerHTML = fs.length ? fs.map(card).join('') : `<div class="empty-res">${t('empty.food')}</div>`;
    const ss = STAYS.map(s => ALL[s.id]).filter(s => inTown(s.zone, F.stayTown) && (F.stayFam === 'todos' || s.fam === F.stayFam));
    $('#gStays').innerHTML = ss.length ? ss.map(card).join('') : `<div class="empty-res">${t('empty.stays')}</div>`;
  }
  function renderFilters(){
    const btns = (arr, cur) => arr.map(([v,l]) => `<button type="button" data-f="${v}" class="${v===cur?'on':''}">${l}</button>`).join('');
    $('#fPlaces').innerHTML = btns([['todos',t('f.all')],['naturaleza',t('f.nature')],['pueblo',t('f.towns')],['familia',t('f.family')],['cultura',t('f.culture')]], F.place);
    const towns = [['todos',t('f.all')], ...RV.townIds.map(id => [id, TOWNS[id].name])];
    $('#fFoodTown').innerHTML = btns(towns, F.foodTown); $('#fStayTown').innerHTML = btns(towns, F.stayTown);
    $('#fFoodSlot').innerHTML = btns([['todos',t('f.allMeals')],['desayuno',RV.slot('desayuno')],['almuerzo',RV.slot('almuerzo')],['cafe',RV.slot('cafe')],['cena',RV.slot('cena')]], F.foodSlot);
    $('#fStayFam').innerHTML = btns([['todos',t('f.all')],['hotel',t('f.hotels')],['hostal',t('f.hostels')],['finca',t('f.farms')],['especial',t('f.special')]], F.stayFam);
    [['#fPlaces','place'],['#fFoodTown','foodTown'],['#fFoodSlot','foodSlot'],['#fStayTown','stayTown'],['#fStayFam','stayFam']].forEach(([sel,key]) => $$(sel + ' button').forEach(b => b.onclick = () => { F[key] = b.dataset.f; $$(sel + ' button').forEach(x => x.classList.toggle('on', x === b)); renderCards(); }));
  }

  /* ================= GUÍA POR PUEBLO (pestañas + escenario) ================= */
  let curTown = RV.townIds[0];
  function renderTowns(){
    $('#townTabs').innerHTML = RV.townIds.map(id => `<button type="button" class="t-tab" role="tab" id="tab-${id}" aria-controls="towns" aria-selected="${id === curTown}" tabindex="${id === curTown ? 0 : -1}" data-town="${id}">${pic(TOWNS[id].ph, false, '')}<span>${TOWNS[id].name}</span></button>`).join('');
    const id = curTown, tw = TOWNS[id], to = townObj(id);
    const pl = PLACES.filter(p => tw.zones.includes(p.zone)), rs = FOOD.filter(r => tw.zones.includes(r.zone)), ss = STAYS.filter(s => tw.zones.includes(s.zone));
    $('#towns').setAttribute('role', 'tabpanel'); $('#towns').setAttribute('aria-labelledby', 'tab-' + id);
    $('#towns').innerHTML = `<article class="town" id="pueblo-${id}">
        <div class="t-art">${pic(tw.ph, true, PHOTOS[tw.ph].t, true)}<span class="t-name"><b>${tw.name}</b><span>${esc(L(to,'tag'))}</span></span></div>
        <div class="t-body"><p>${esc(L(to,'intro'))}</p>
          <div class="t-col"><div class="t-block"><h5>${t('town.todo')}</h5><ul class="acts-l">${L(to,'acts').map(([n,d]) => `<li><i></i><span><b>${esc(n)}.</b> ${esc(d)}</span></li>`).join('')}</ul></div>
            <div class="t-block"><h5>${t('town.how')}</h5><p class="t-how">${esc(L(to,'how'))}</p></div></div>
          <div class="t-col">
          ${pl.length ? `<div class="t-block"><h5>${t('town.add')}</h5><div class="chips">${pl.map(p => `<button type="button" class="chip" data-open="${p.id}">${ICON.pin}${esc(p.name)}</button>`).join('')}</div></div>` : ''}
          ${rs.length ? `<div class="t-block"><h5>${t('town.eat')}</h5><div class="chips">${rs.map(r => `<button type="button" class="chip" data-open="${r.id}">${esc(r.name)} <small>${RV.slot(r.slot)}</small></button>`).join('')}</div></div>` : ''}
          ${ss.length ? `<div class="t-block"><h5>${t('town.sleep')}</h5><div class="chips">${ss.map(s => `<button type="button" class="chip" data-open="${s.id}">${esc(s.name)} <small>${RV.type(s.type)}</small></button>`).join('')}</div></div>` : ''}
          </div>
        </div></article>`;
  }
  function showTown(id, scroll){
    if (!TOWNS[id]) return;
    curTown = id; renderTowns(); RV.markTown && RV.markTown(id);
    const tab = $('#tab-' + id); if (tab) tab.scrollIntoView({block:'nearest', inline:'center', behavior: RV.reduce ? 'auto' : 'smooth'});
    if (scroll) goTo('#pueblos');
  }
  RV.showTown = showTown;
  $('#townTabs').addEventListener('keydown', e => {
    if (!['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) return;
    e.preventDefault();
    const ids = RV.townIds, i = ids.indexOf(curTown);
    const j = e.key === 'Home' ? 0 : e.key === 'End' ? ids.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + ids.length) % ids.length;
    showTown(ids[j]); $('#tab-' + ids[j]).focus();
  });

  /* ================= CUÁNDO IR Y CÓMO MOVERSE ================= */
  function renderSeasons(){
    const months = t('months').split(',');
    $('#months').innerHTML = SEASON.map((m,i) => `<div class="mo ${m.w}"><b>${months[i]}</b><span>${t('w.' + m.w)}</span>${m.a ? `<i>${t('w.busy')}</i>` : ''}</div>`).join('');
    $('#events').innerHTML = EVENTS.map((e,i) => { const eo = {...e, id:'ev' + i}; return `<div class="ev"><span class="ev-when">${esc(L(eo,'when'))}</span><b>${esc(L(eo,'name'))}</b><p>${esc(L(eo,'desc'))}</p><button type="button" class="chip" data-town="${e.town}" data-scroll="1">${ICON.pin}${TOWNS[e.town].name}</button></div>`; }).join('');
    $('#fares').innerHTML = `<table class="fares"><thead><tr><th>${t('fare.route')}</th><th>${t('fare.how')}</th><th>${t('fare.time')}</th><th>${t('fare.price')}</th></tr></thead><tbody>${FARES.map((f,i) => { const fo = {...f, id:'fare' + i}; return `<tr><td><b>${esc(L(fo,'route'))}</b></td><td>${esc(L(fo,'how'))}</td><td>${esc(L(fo,'time'))}</td><td>${esc(L(fo,'price'))}</td></tr>`; }).join('')}</tbody></table>`;
  }

  /* ================= PRESETS ================= */
  function renderPresets(){
    $('#presets').innerHTML = PRESETS.map((p,i) => { const po = {...p, id:'preset' + i}; return `<button type="button" class="preset rv in" data-preset="${i}"><span class="bgc">${pic(PRESET_PH[i] || 'cocora', true, '')}</span><span class="ic">${PRESET_ICONS[i] || PRESET_ICONS[0]}</span><span class="days-n">${p.days} ${t(p.days === 1 ? 'day' : 'stat.days').toLowerCase()}</span><h3>${esc(L(po,'name'))}</h3><p>${esc(L(po,'desc'))}</p><span class="go">${t('preset.load', {n:p.days})} ${ICON.arr}</span></button>`; }).join('');
    $$('[data-preset]').forEach(b => b.onclick = () => {
      const p = PRESETS[+b.dataset.preset];
      if (!RV.isEmpty() && !confirm(t('confirm.replace'))) return;
      state.days = p.plan.map((s,i) => ({stops:[...s], stay:p.stays[i] || null}));
      $('#tDays').value = p.days;
      commit(); bump(); RV.toast(t('toast.presetLoaded', {name:L({...p, id:'preset' + b.dataset.preset},'name')})); goTo('#mi-tour');
    });
  }

  /* ================= ACCIONES ================= */
  function addItem(id){
    if (RV.inTour(id)) return;
    const it = ALL[id];
    if (it.kind === 'hospedaje'){
      let k = state.days.findIndex(d => !d.stay && d.stops.some(x => ZONE_TOWN[ALL[x].zone] === ZONE_TOWN[it.zone]));
      if (k < 0) k = state.days.findIndex(d => !d.stay);
      if (k < 0) k = RV.bestDayFor(it.zone);
      state.days[k].stay = id;
      RV.toast(t('toast.night', {name:it.name, n:k+1})); commit(); bump(); return;
    }
    const k = RV.bestDayFor(it.zone), d = state.days[k].stops;
    if (it.kind === 'comida') RV.insertFood(d, id);
    else { const c = d.findIndex(x => ALL[x].slot === 'cena'); d.splice(c >= 0 ? c : d.length, 0, id); }
    RV.toast(t('toast.added', {name:it.name, n:k+1})); commit(); bump();
  }
  function removeItem(id){
    if (ALL[id].kind === 'hospedaje') state.days.forEach(d => { if (d.stay === id) d.stay = null; });
    else state.days.forEach(d => d.stops = d.stops.filter(x => x !== id));
    RV.toast(t('toast.removed', {name:ALL[id].name})); commit();
  }
  const toggle = id => RV.inTour(id) ? removeItem(id) : addItem(id);
  function stayAll(id){ state.days.forEach(d => d.stay = id); RV.toast(t('toast.allNights', {name:ALL[id].name})); commit(); bump(); }
  function move(id, dir){ const d = state.days.find(x => x.stops.includes(id)).stops, i = d.indexOf(id), j = i + dir; if (j < 0 || j >= d.length) return; [d[i], d[j]] = [d[j], d[i]]; commit(); }
  function moveDay(id, to){ state.days.forEach(d => d.stops = d.stops.filter(x => x !== id)); const d = state.days[to].stops; if (ALL[id].kind === 'comida') RV.insertFood(d, id); else { const c = d.findIndex(x => ALL[x].slot === 'cena'); d.splice(c >= 0 ? c : d.length, 0, id); } RV.toast(t('toast.moved', {n:to+1})); commit(); }
  function setDays(n){
    const stays = state.days.map(d => d.stay), stops = RV.organize(RV.allStops(), n);
    state.days = stops.map((s,i) => ({stops:s, stay: i < stays.length ? stays[i] : (stays[stays.length-1] || null)}));
    commit();
  }
  function commit(){ RV.save(); renderCards(); renderTour(); }
  RV.commit = commit;
  function bump(){ const b = $('#navCount'); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }

  /* ================= TOUR ================= */
  function stayOptions(sel){
    return `<option value="">${sel ? t('night.remove') : t('night.choose')}</option>` + RV.townIds.map(id => { const list = STAYS.filter(s => TOWNS[id].zones.includes(s.zone)); return list.length ? `<optgroup label="${TOWNS[id].name}">${list.map(s => `<option value="${s.id}" ${s.id===sel?'selected':''}>${esc(s.name)}</option>`).join('')}</optgroup>` : ''; }).join('');
  }
  function nightHTML(d, i){
    if (!d.stay) return `<div class="night empty"><div class="nn"><small>${t('night.of', {n:i+1})}</small><b>${t('night.none')}</b></div><select data-stay="${i}" aria-label="${esc(t('night.choose'))}">${stayOptions(null)}</select></div>`;
    const s = ALL[d.stay];
    return `<div class="night"><div class="th">${pic(s.ph, false, PHOTOS[s.ph].t)}</div><div class="nn"><small>${t('night.of', {n:i+1})}</small><b>${esc(s.name)}</b><div class="sub">${RV.type(s.type)} · ${zn(s.zone)}</div></div>
      <select data-stay="${i}" aria-label="${esc(t('night.change'))}">${stayOptions(s.id)}</select><button type="button" class="ic-btn" style="color:var(--paper)" data-open="${s.id}" aria-label="${esc(t('btn.view'))}">${ICON.bed}</button></div>`;
  }
  function renderTour(){
    const n = RV.allStops().length, np = RV.allStops().filter(id => ALL[id].kind === 'lugar').length, nn = RV.nights();
    $('#navCount').textContent = n + nn; $('#mCount').textContent = n + nn;
    $('#sPlaces').textContent = np; $('#sFood').textContent = n - np; $('#sStay').textContent = nn; $('#sDays').textContent = state.days.length;
    $('#mbar').classList.toggle('show', n + nn > 0);
    ['btnPdf','btnCopy','btnPrint','btnAuto','btnClear','btnShare'].forEach(id => $('#'+id).disabled = !(n + nn));
    if (!n && !nn){
      $('#days').innerHTML = `<div class="no-tour"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#86B86B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg><b style="font-size:20px">${t('tour.empty')}</b><span>${t('tour.emptyHint')}</span><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><a class="btn lime sm" href="#lugares">${t('tour.pickPlaces')}</a><a class="btn lite sm" href="#sugeridos">${t('nav.presets')}</a></div></div>`;
      $('#tourMapCard').hidden = true;
      return;
    }
    $('#tourMapCard').hidden = false;
    const opts = i => state.days.map((_,k) => `<option value="${k}" ${k===i?'selected':''}>${t('day')} ${k+1}</option>`).join('');
    $('#days').innerHTML = state.days.map((d,i) => {
      const sch = RV.schedule(i), end = sch.length ? sch[sch.length-1].end : 0, full = end > 1260;
      return `<div class="day" style="animation-delay:${i*.06}s"><div class="day-h"><span class="n" style="background:${DAYC[i % DAYC.length]}">${i+1}</span><div><h4>${t('day')} ${i+1}</h4><small>${RV.dayDate(i) || t('day.noDate')}</small></div><span class="load ${full?'full':''}">${sch.length ? (full ? t('day.full') : t('day.ends', {h:RV.fmtT(end)})) : t('day.free')}</span></div>
        <div class="from">${t('day.from', {town:zn(RV.startZone(i))})}${i > 0 && state.days[i-1].stay ? ' · ' + t('day.slept', {name:esc(ALL[state.days[i-1].stay].name)}) : ''}</div>
        <div class="stops">${sch.length ? sch.map((s,j) => { const it = ALL[s.id], k = RV.mainPh(it); return `${s.from !== it.zone ? `<div class="travel"><i></i>${t('day.transfer', {town:zn(s.from), m:s.travel})}</div>` : (j ? '<div class="travel"><i></i></div>' : '')}
          <div class="stop"><div class="time">${RV.fmtT(s.start)}<small>${dur(it.dur)}</small></div><div class="th">${pic(k, false, PHOTOS[k].t)}</div>
            <div style="min-width:0"><b>${esc(it.name)}</b><div class="sub"><span class="tg ${it.kind==='lugar'?'l':'c'}">${it.kind==='lugar' ? t('tag.place') : RV.slot(it.slot).toUpperCase()}</span>${zn(it.zone)}</div></div>
            <div class="ctr"><button type="button" class="ic-btn" data-up="${s.id}" aria-label="${t('aria.up')}" ${j===0?'disabled':''}>${ICON.up}</button><button type="button" class="ic-btn" data-down="${s.id}" aria-label="${t('aria.down')}" ${j===sch.length-1?'disabled':''}>${ICON.down}</button>
              ${state.days.length > 1 ? `<select class="mv" data-mv="${s.id}" aria-label="${t('aria.moveDay')}">${opts(i)}</select>` : ''}
              <a class="ic-btn" href="${RV.mapsUrl(it)}" target="_blank" rel="noopener" aria-label="${esc(t('btn.directions'))}">${ICON.nav}</a><button type="button" class="ic-btn" data-open="${s.id}" aria-label="${t('aria.info')}">${ICON.pin}</button><button type="button" class="ic-btn del" data-del="${s.id}" aria-label="${t('aria.remove')}">${ICON.x}</button></div></div>`; }).join('') : `<div class="day-empty">${t('day.emptyHint')}</div>`}</div>
        ${nightHTML(d, i)}</div>`;
    }).join('') + `<div class="pack"><h4>${t('pack.title')}</h4><div class="l">${RV.packList().map(x => `<span>${esc(x)}</span>`).join('')}</div></div>`;
    $$('[data-up]').forEach(b => b.onclick = () => move(b.dataset.up, -1));
    $$('[data-down]').forEach(b => b.onclick = () => move(b.dataset.down, 1));
    $$('[data-del]').forEach(b => b.onclick = () => removeItem(b.dataset.del));
    $$('[data-mv]').forEach(s => s.onchange = () => moveDay(s.dataset.mv, +s.value));
    $$('[data-stay]').forEach(s => s.onchange = () => { state.days[+s.dataset.stay].stay = s.value || null; RV.toast(s.value ? t('toast.night', {name:ALL[s.value].name, n:+s.dataset.stay+1}) : t('toast.stayRemoved')); commit(); });
    drawMap();
    RV.refreshRegion && RV.refreshRegion();
  }

  /* ================= MAPAS (Leaflet + OpenStreetMap en modo oscuro) ================= */
  const DAYC = ['#FF4D8D','#FFB020','#35E0B0','#A45CFF','#4DA3FF','#FF7A45','#E5E058'];
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
  /* OpenStreetMap, oscurecido con un filtro de CSS (clase .dark-tiles en styles.css) */
  RV.tiles = Lf => Lf.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:18, className:'dark-tiles', attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'});
  /* curva suave entre dos puntos, para que las rutas no se monten una sobre otra */
  function arc(a, b, bend){
    const [y1,x1] = a, [y2,x2] = b, mx = (x1+x2)/2, my = (y1+y2)/2, dx = x2-x1, dy = y2-y1;
    const cx = mx - dy * bend, cy = my + dx * bend, out = [];
    for (let k = 0; k <= 16; k++){ const u = k/16, v = 1-u; out.push([v*v*y1 + 2*v*u*cy + u*u*y2, v*v*x1 + 2*v*u*cx + u*u*x2]); }
    return out;
  }
  let tmap = null, tlayer = null, dayFocus = -1;
  function drawMap(){
    const box = $('#tourMap'); if (!box) return;
    loadLeaflet().then(() => {
      const Lf = window.L;
      if (!tmap){
        box.innerHTML = '';
        tmap = RV.map = Lf.map(box, {scrollWheelZoom:false, zoomControl:true, attributionControl:true, zoomSnap:.25});
        /* con el mapa muy alejado los nombres se montan: se ocultan */
        tmap.on('zoomend', () => box.classList.toggle('nolabels', tmap.getZoom() < (box.clientWidth > 600 ? 9.75 : 10.75)));
        RV.tiles(Lf).addTo(tmap);
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
        /* ruta del día en el orden real de las paradas */
        const start = RV.startZone(i), path = [start, ...d.stops.map(id => ALL[id].zone)];
        if (d.stay) path.push(ALL[d.stay].zone);
        const mine = path.map(z => ZLL[z]);
        for (let k = 1; k < path.length; k++){
          if (path[k] === path[k-1]) continue;
          const seg = arc(ZLL[path[k-1]], ZLL[path[k]], .12 + (i % 4) * .06);
          if (on) Lf.polyline(seg, {color:col, weight:10, opacity:.18, interactive:false}).addTo(tlayer);
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
        const ns = nightsIn[z], i0 = ns[0], col = DAYC[i0 % DAYC.length], vis = dayFocus < 0 || ns.includes(dayFocus);
        const html = `<span style="background:${col}">${ICON.bed}${ns.length > 1 ? `<small>${ns.length}</small>` : ''}</span>`;
        Lf.marker(ZLL[z], {icon:Lf.divIcon({className:'bedpin', html, iconSize:[28,28], iconAnchor:[-(fanHalf(z) + 4), 34]}), opacity: vis ? 1 : .2, zIndexOffset:550}).addTo(tlayer)
          .bindPopup(ns.map(i => `<b>${t('night.of', {n:i+1})}</b><br>${esc(ALL[state.days[i].stay].name)}`).join('<br>') + ` · ${esc(zn(z))}`);
      });
      const pts = allPts;
      const focus = dayFocus >= 0 && dayPts[dayFocus] && dayPts[dayFocus].length > 1 ? dayPts[dayFocus] : pts.length > 1 ? pts : [ZLL[state.base], ...pts];
      tmap.invalidateSize();
      tmap.fitBounds(Lf.latLngBounds(focus), {paddingTopLeft:[50,60], paddingBottomRight:[70,40], maxZoom:12, animate:false});
      box.classList.toggle('nolabels', tmap.getZoom() < (box.clientWidth > 600 ? 9.75 : 10.75));
      $('#mapLegend').innerHTML = (state.days.length > 1 ? `<button type="button" data-dayf="-1" class="${dayFocus < 0 ? 'on' : ''}">${t('map.all')}</button>` : '') +
        state.days.map((d,i) => `<button type="button" data-dayf="${i}" class="${dayFocus === i ? 'on' : ''}"><i style="background:${DAYC[i % DAYC.length]}"></i>${t('day')} ${i+1}</button>`).join('') +
        `<span class="lg-note">${ICON.bed} ${t('map.night')}</span>`;
      $$('[data-dayf]').forEach(b => b.onclick = () => { dayFocus = +b.dataset.dayf; drawMap(); });
    }).catch(() => { tmap = null; box.innerHTML = `<p class="map-off">${t('map.offline')}<br><button type="button" class="btn sm lite" id="mapRetry">${t('map.retry')}</button></p>`; $('#mapRetry').onclick = drawMap; });
  }

  /* ================= MAPA DE LA REGIÓN ================= */
  let rmap = null, rlayer = null, rtowns = {};
  const REGION = [[4.19,-75.84],[4.70,-75.46]];
  const FITPAD = () => innerWidth < 640 ? {paddingTopLeft:[70,10], paddingBottomRight:[60,110]} : {paddingTopLeft:[40,20], paddingBottomRight:[40,70]};
  const LEFT = ['armenia','quimbaya','montenegro','tebaida','buenavista','genova']; /* nombre a la izquierda para que no se tapen */
  function townLL(id){ const z = TOWNS[id].zones[0]; return id === 'montenegro' ? [4.566,-75.751] : ZLL[z]; }
  function drawRegion(){
    const box = $('#regionMap'); if (!box || rmap) return;
    loadLeaflet().then(() => {
      const Lf = window.L;
      rmap = Lf.map(box, {scrollWheelZoom:false, zoomControl:true, minZoom:9, zoomSnap:.25, maxBounds:Lf.latLngBounds(REGION).pad(.6)});
      RV.tiles(Lf).addTo(rmap);
      rmap.fitBounds(REGION, FITPAD());
      new ResizeObserver(() => rmap.invalidateSize()).observe(box);
      rlayer = Lf.layerGroup().addTo(rmap);
      refreshRegion(); RV.refreshRegion();
    }).catch(() => { box.innerHTML = `<p class="map-off">${t('map.offline')}</p>`; });
  }
  function placePop(p){
    const on = RV.inTour(p.id), k = RV.mainPh(p);
    return `<div class="rpop">${pic(k, false, PHOTOS[k].t)}<small>${esc(zn(p.zone))}</small><b>${esc(p.name)}</b><span>${esc(L(p,'tag'))}</span>
      <div class="row"><button type="button" class="btn ${on ? 'lime' : ''}" data-toggle="${p.id}">${on ? ICON.check + ' ' + t('btn.inTour') : ICON.plus + ' ' + t('btn.add')}</button><button type="button" class="btn ghost" data-open="${p.id}">${t('btn.view')}</button></div></div>`;
  }
  let rplaces = {};
  function refreshRegion(){
    if (!rmap) return;
    const Lf = window.L; rmap.closePopup(); rlayer.clearLayers(); rtowns = {}; rplaces = {};
    RV.townIds.forEach(id => {
      const tw = TOWNS[id], to = townObj(id);
      const m = Lf.marker(townLL(id), {icon:Lf.divIcon({className:'', html:`<div class="rtown ${LEFT.includes(id) ? 'l' : ''} ${id === curTown ? 'on' : ''}"><i></i><b>${tw.name}</b></div>`, iconSize:[0,0], iconAnchor:[0,0]}), zIndexOffset:1000, riseOnHover:true, keyboard:true, title:tw.name}).addTo(rlayer);
      m.bindPopup(() => { const pl = ALL[id] && ALL[id].kind === 'lugar' ? ALL[id] : null, on = pl && RV.inTour(id);
        return `<div class="rpop">${pic(tw.ph, false, PHOTOS[tw.ph].t)}<small>${t('nav.towns')}</small><b>${tw.name}</b><span>${esc(L(to,'tag'))}</span><div class="row"><button type="button" class="btn" data-town="${id}" data-scroll="1">${t('rmap.seeTown')}</button>${pl ? `<button type="button" class="btn ${on ? 'lime' : 'ghost'}" data-toggle="${id}">${on ? ICON.check : ICON.plus}</button>` : ''}</div></div>`; }, {minWidth:250, maxWidth:280});
      rtowns[id] = m;
    });
    PLACES.forEach(p => {
      if (RV.townIds.includes(p.id)) return; /* el pueblo ya tiene su marcador */
      const m = Lf.marker([p.lat, p.lon], {icon:Lf.divIcon({className:'', html:`<div class="rplace ${RV.inTour(p.id) ? 'in' : ''}"></div>`, iconSize:[14,14], iconAnchor:[7,7]}), riseOnHover:true, title:p.name}).addTo(rlayer);
      m.bindPopup(() => placePop(p), {minWidth:250, maxWidth:280});
      rplaces[p.id] = m;
    });
  }
  /* al agregar o quitar algo: solo cambia el color de los marcadores y el botón del globo abierto */
  RV.refreshRegion = () => {
    if (!rmap) return;
    Object.keys(rplaces).forEach(id => { const el = rplaces[id].getElement(); if (el) el.firstElementChild.classList.toggle('in', RV.inTour(id)); });
    Object.keys(rtowns).forEach(id => { const el = rtowns[id].getElement(); if (el && ALL[id]) el.firstElementChild.classList.toggle('in', RV.inTour(id)); });
    const pop = rmap._popup; if (pop && rmap.hasLayer(pop)) pop.update();
  };
  RV.markTown = id => { $$('.rtown').forEach(el => el.classList.remove('on')); const m = rtowns[id]; if (m && m.getElement()) m.getElement().querySelector('.rtown').classList.add('on'); };
  $('#rmReset').onclick = () => { if (rmap){ rmap.closePopup(); rmap.flyToBounds(REGION, {...FITPAD(), duration: RV.reduce ? 0 : .8}); } };
  new IntersectionObserver((es, ob) => es.forEach(e => { if (e.isIntersecting){ drawRegion(); ob.disconnect(); } }), {rootMargin:'400px'}).observe($('#regionMap'));

  /* ================= POSTALES ================= */
  const GAL = [['cocora2','w h'],['salento3',''],['filandia7',''],['cafetal2','h'],['pijao3',''],['buenavista2','w'],['cocora7',''],['filandia9',''],['palmsSign','h'],['salento5',''],['cafeGranos',''],['calarcaVista','w'],['tebaida2',''],['filandia5','']].filter(([k]) => PHOTOS[k]);
  let gi = 0;
  function renderGallery(){
    $('#gallery').innerHTML = GAL.map(([k,c], i) => `<button type="button" class="${c}" data-gal="${i}" data-cap="${esc(PHOTOS[k].t)}" aria-label="${esc(PHOTOS[k].t)}">${pic(k, c.includes('w') || c.includes('h'), PHOTOS[k].t)}</button>`).join('');
  }
  function showPhoto(i){
    gi = (i + GAL.length) % GAL.length; const k = GAL[gi][0];
    $('#lbImg').src = RV.pSrc(k, true); $('#lbImg').dataset.k = k; $('#lbImg').dataset.w = 1600; delete $('#lbImg').dataset.fb; $('#lbImg').alt = PHOTOS[k].t;
    $('#lbCap').innerHTML = `<b>${esc(PHOTOS[k].t)}</b>${RV.credit(k)}`;
  }
  let lbFocus = null;
  function openLb(i){ lbFocus = document.activeElement; showPhoto(i); $('#lightbox').hidden = false; document.body.style.overflow = 'hidden'; $('#lbClose').focus(); }
  function closeLb(){ $('#lightbox').hidden = true; document.body.style.overflow = ''; if (lbFocus) lbFocus.focus({preventScroll:true}); }
  $('#gallery').addEventListener('click', e => { const b = e.target.closest('[data-gal]'); if (b) openLb(+b.dataset.gal); });
  $('#lbClose').onclick = closeLb; $('#lbPrev').onclick = () => showPhoto(gi - 1); $('#lbNext').onclick = () => showPhoto(gi + 1);
  $('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') closeLb(); });
  addEventListener('keydown', e => { if ($('#lightbox').hidden) return; if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowRight') showPhoto(gi + 1); if (e.key === 'ArrowLeft') showPhoto(gi - 1); });

  /* ================= DRAWER ================= */
  let lastFocus = null;
  function openDrawer(id){
    const it = ALL[id], on = RV.inTour(id), k = RV.mainPh(it); lastFocus = document.activeElement;
    let head = '', info = '', extra = '';
    if (it.kind === 'lugar'){
      const tw = RV.townOf(it.zone);
      head = `<span class="kick"><i></i>${esc(L(it,'town'))}</span><h3>${esc(it.name)}</h3><span class="serif">${esc(L(it,'tag'))}</span>`;
      extra = `<div class="wbox">${RV.wxIcon(it.wx.code)}<div><b>${Math.round(it.wx.t)}°C</b><small>${t('wx.' + RV.wxType(it.wx.code))} · ${it.wx.live ? t('wx.live') : t('wx.typical')}</small></div></div>`;
      const near = (arr) => arr.filter(x => tw.zones.includes(x.zone)).map(x => x.name).join(' · ');
      info = `<div>${ICON.bus}<p><b>${t('d.how')}</b><span>${esc(L(it,'how'))}</span></p></div>
        <div>${ICON.clock}<p><b>${t('d.time')}</b><span>${dur(it.dur)} · ${t('d.alt')} ${it.alt}</span></p></div>
        <div>${ICON.star}<p><b>${t('d.tips')}</b><span>${esc(L(it,'tips'))}</span></p></div>
        <div>${ICON.pin}<p><b>${t('d.todo')}</b><span>${esc(L(it,'todo').join(' · '))}</span></p></div>
        ${near(FOOD) ? `<div>${ICON.fork}<p><b>${t('d.eatNear')}</b><span>${esc(near(FOOD))}</span></p></div>` : ''}
        ${near(STAYS) ? `<div>${ICON.bed}<p><b>${t('d.sleepNear')}</b><span>${esc(near(STAYS))}</span></p></div>` : ''}`;
    } else if (it.kind === 'comida'){
      head = `<span class="kick"><i></i>${RV.slot(it.slot)} · ${zn(it.zone)}</span><h3>${esc(it.name)}</h3><span class="serif">${esc(L(it,'dish'))}</span>`;
      info = `<div>${ICON.pin}<p><b>${t('d.where')}</b><span>${t('d.whereTxt', {town:zn(it.zone)})}</span></p></div>
        <div>${ICON.clock}<p><b>${t('d.time')}</b><span>${dur(it.dur)}</span></p></div>
        <div>${ICON.star}<p><b>${t('d.tips')}</b><span>${esc(L(it,'tips'))}</span></p></div>`;
    } else {
      head = `<span class="kick"><i></i>${RV.type(it.type)} · ${zn(it.zone)}</span><h3>${esc(it.name)}</h3>`;
      info = `<div>${ICON.heart}<p><b>${t('d.goodFor')}</b><span>${esc(L(it,'good').join(' · '))}</span></p></div>
        <div>${ICON.pin}<p><b>${t('d.location')}</b><span>${zn(it.zone)}. ${esc(L(townObj(ZONE_TOWN[it.zone]),'how'))}</span></p></div>
        <div>${ICON.star}<p><b>${t('d.tip')}</b><span>${esc(L(it,'tips'))} ${t('d.confirm')}</span></p></div>`;
    }
    const lbl = o => it.kind === 'hospedaje' ? (o ? t('btn.removeNight') : t('btn.sleepHere')) : (o ? t('btn.removeTour') : t('btn.addTour'));
    const photoNote = it.kind === 'hospedaje' ? ' · ' + t('note.photoTown') : it.kind === 'comida' ? ' · ' + t('note.photoDish') : it.phNote ? ' · ' + t('note.photoIllus') : '';
    const links = `<div class="d-links"><a class="btn ghost sm" href="${RV.mapsUrl(it)}" target="_blank" rel="noopener">${ICON.nav} ${t('btn.directions')}</a>${it.kind !== 'lugar' ? `<a class="btn ghost sm" href="${RV.webUrl(it)}" target="_blank" rel="noopener">${ICON.web} ${t('btn.contact')}</a>` : ''}</div>${it.kind !== 'lugar' ? `<p class="fnote">${t('d.contactNote')}</p>` : ''}`;
    $('#drawer').innerHTML = `<div class="d-art">${pic(k, true, PHOTOS[k].t, true)}<span class="d-cred">${esc(PHOTOS[k].t)} · ${RV.credit(k)}${photoNote}</span><button type="button" class="d-close" id="dClose" aria-label="${t('aria.close')}">${ICON.x}</button></div>
      <div class="d-in">${head}<p>${esc(L(it,'desc'))}</p>${extra}${links}<div class="info">${info}</div></div>
      <div class="d-foot"><button type="button" class="btn ${on?'ghost':'clay'}" id="dToggle">${lbl(on)}</button>${it.kind === 'hospedaje' && state.days.length > 1 ? `<button type="button" class="btn lite" id="dAll" style="border:1.5px solid var(--line)">${t('btn.allNights')}</button>` : ''}<a class="btn lime" href="#mi-tour" id="dGo">${t('btn.seeTour')}</a></div>`;
    $('#drawer').classList.add('open'); $('#scrim').classList.add('open'); $('#drawer').scrollTop = 0;
    setTimeout(() => $('#dClose').focus(), 60);
    $('#dClose').onclick = closeDrawer;
    $('#dToggle').onclick = () => { toggle(id); const now = RV.inTour(id); $('#dToggle').className = 'btn ' + (now ? 'ghost' : 'clay'); $('#dToggle').textContent = lbl(now); };
    if ($('#dAll')) $('#dAll').onclick = () => { stayAll(id); $('#dToggle').className = 'btn ghost'; $('#dToggle').textContent = lbl(true); };
    $('#dGo').onclick = e => { e.preventDefault(); closeDrawer(); goTo('#mi-tour'); };
  }
  function closeDrawer(){ $('#drawer').classList.remove('open'); $('#scrim').classList.remove('open'); if (lastFocus && document.contains(lastFocus)) lastFocus.focus({preventScroll:true}); }
  $('#scrim').onclick = closeDrawer;
  addEventListener('keydown', e => { if (e.key === 'Escape'){ if ($('#drawer').classList.contains('open')) closeDrawer(); closeMenu(); } });

  /* ================= NAVEGACIÓN Y MENÚ ================= */
  function goTo(sel){ const el = typeof sel === 'string' ? $(sel) : sel; if (!el) return; const top = el.id === 'inicio' ? 0 : el.getBoundingClientRect().top + scrollY - 70; scrollTo({top, behavior: RV.reduce ? 'auto' : 'smooth'}); }
  RV.goTo = goTo;
  const closeMenu = () => { $('.nav').classList.remove('open'); $('#menuBtn').setAttribute('aria-expanded', 'false'); };
  $('#menuBtn').onclick = () => { const o = $('.nav').classList.toggle('open'); $('#menuBtn').setAttribute('aria-expanded', o); };
  document.addEventListener('click', e => {
    const tg = e.target.closest('[data-toggle]'); if (tg){ toggle(tg.dataset.toggle); return; }
    const o = e.target.closest('[data-open]'); if (o){ openDrawer(o.dataset.open); return; }
    const g = e.target.closest('[data-goto]'); if (g){ goTo('#' + g.dataset.goto); return; }
    const tw = e.target.closest('[data-town]'); if (tw){ if (rmap) rmap.closePopup(); showTown(tw.dataset.town, !!tw.dataset.scroll); return; }
    const a = e.target.closest('a[href^="#"]'); if (a && a.id !== 'dGo'){ const tgt = $(a.getAttribute('href')); if (tgt){ e.preventDefault(); if ($('#drawer').classList.contains('open')) closeDrawer(); closeMenu(); goTo(tgt); } return; }
    if (!e.target.closest('.nav')) closeMenu();
  });
  document.addEventListener('keydown', e => { const o = e.target.closest && e.target.closest('.art[data-open]'); if (o && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); openDrawer(o.dataset.open); } });
  $('#qPlaces').addEventListener('input', e => { F.q = e.target.value.trim(); renderCards(); });

  /* ================= AJUSTES ================= */
  $('#tName').value = state.name || ''; $('#tDate').value = state.date || RV.tomorrow(); $('#tDate').min = RV.isoDay(new Date());
  $('#tPeople').textContent = state.people; $('#tDays').value = state.days.length;
  $('#tName').oninput = e => { state.name = e.target.value; RV.save(); };
  $('#tDate').onchange = e => { state.date = e.target.value; commit(); };
  $('#pMinus').onclick = () => { state.people = Math.max(1, state.people - 1); $('#tPeople').textContent = state.people; RV.save(); };
  $('#pPlus').onclick = () => { state.people = Math.min(30, state.people + 1); $('#tPeople').textContent = state.people; RV.save(); };
  $('#tDays').onchange = e => { setDays(+e.target.value); RV.toast(t('toast.days', {n:e.target.value})); };
  $('#tStart').onchange = e => { state.start = +e.target.value; commit(); };
  $('#tBase').onchange = e => { state.base = e.target.value; commit(); RV.toast(t('toast.base')); };
  $('#btnAuto').onclick = () => { setDays(state.days.length); RV.toast(t('toast.sorted')); };
  $('#btnClear').onclick = () => { if (!confirm(t('confirm.clear'))) return; state.days = state.days.map(() => ({stops:[], stay:null})); commit(); RV.toast(t('toast.cleared')); };
  $('#btnShare').onclick = async () => {
    const url = RV.shareUrl();
    if (navigator.share){ try { await navigator.share({title:t('meta.title'), text:t('share.text'), url}); return; } catch(e){ if (e.name === 'AbortError') return; } }
    try { await navigator.clipboard.writeText(url); RV.toast(t('toast.linkCopied')); } catch(e){ prompt(t('share.copyManual'), url); }
  };

  /* ================= IDIOMA ================= */
  $('#langBtn').onclick = () => { RV.lang = RV.lang === 'en' ? 'es' : 'en'; RV.store.set('rv-lang', RV.lang); renderAll(); RV.toast(t('toast.lang')); };
  function renderAll(){ applyStatic(); renderFilters(); renderPresets(); renderTowns(); renderSeasons(); renderCards(); renderTour(); renderCredits(); heroCredit(); renderGallery(); refreshRegion(); RV.refreshRegion(); }
  RV.renderAll = renderAll;

  function renderCredits(){
    $('#credList').innerHTML = Object.keys(PHOTOS).map(k => `<div>${esc(PHOTOS[k].t)}: <a href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(PHOTOS[k].f.replace(/ /g,'_'))}" target="_blank" rel="noopener">${esc(PHOTOS[k].by)}</a>, ${esc(PHOTOS[k].lic)}</div>`).join('');
  }
  $('#credBtn').onclick = () => { const o = $('#credList').classList.toggle('open'); $('#credBtn').setAttribute('aria-expanded', o); };
  function heroCredit(){ $('#heroCred').textContent = `Valle del Cocora · ${t('photo.by')}: ${PHOTOS.heroCocora.by} · ${PHOTOS.heroCocora.lic}`; }

  /* ================= INICIO ================= */
  const hero = $('#heroPh'); hero.dataset.k = 'heroCocora'; hero.dataset.w = 1920; hero.src = RV.pSrc('heroCocora', true);
  /* al bajar: la palabra QUINDÍO crece y se desvanece, la foto se abre y aparece el texto */
  const stage = $('.hero-stage'), heroSec = $('.hero'), nav = $('.nav');
  const clamp01 = v => Math.max(0, Math.min(1, v));
  let ticking = false;
  function onScroll(){
    ticking = false;
    const run = heroSec.offsetHeight - innerHeight, p = run > 0 ? clamp01(scrollY / run) : 1;
    if (!RV.reduce){
      stage.style.setProperty('--p1', clamp01(p / .7).toFixed(3));
      stage.style.setProperty('--p2', clamp01(p / .45).toFixed(3));
      const p3 = clamp01((p - .38) / .32);
      stage.style.setProperty('--p3', p3.toFixed(3));
      stage.classList.toggle('copy-on', p3 > .6);
    }
    nav.classList.toggle('solid', scrollY > innerHeight * .5);
  }
  addEventListener('scroll', () => { if (!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, {passive:true});
  addEventListener('resize', onScroll);
  if (RV.reduce) stage.classList.add('copy-on');
  onScroll();
  const shared = RV.readShared();
  if (shared){
    if (RV.isEmpty() || confirm(t('share.replace'))){ Object.assign(state, shared); RV.save(); $('#tName').value = state.name; $('#tDate').value = state.date; $('#tPeople').textContent = state.people; $('#tDays').value = state.days.length; setTimeout(() => { RV.toast(t('toast.sharedLoaded')); goTo('#mi-tour'); }, 400); }
    history.replaceState(null, '', location.pathname + location.search);
  }
  renderAll();
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.08});
  $$('.rv:not(.in)').forEach(el => io.observe(el));

  /* clima en vivo */
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + PLACES.map(p=>p.lat).join(',') + '&longitude=' + PLACES.map(p=>p.lon).join(',') + '&current=temperature_2m,weather_code&timezone=America%2FBogota';
  fetch(url).then(r => { if (!r.ok) throw 0; return r.json(); }).then(data => {
    (Array.isArray(data) ? data : [data]).forEach((d,i) => { const c = d.current; if (c && PLACES[i]) ALL[PLACES[i].id].wx = {t:c.temperature_2m, code:c.weather_code, live:true}; });
    renderCards(); if (!RV.isEmpty()) renderTour();
  }).catch(() => {});
})();
