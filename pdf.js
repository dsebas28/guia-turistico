/* ============================================================
   RUTA VERDE — COPIAR, IMPRIMIR Y PDF
   ============================================================ */
(function(){
  const RV = window.RV, {$, esc, t, L, ALL, state} = RV;
  const zn = RV.zoneName, dur = RV.durTxt;
  const title = () => state.name ? t('pdf.titleOf', {name:state.name}) : t('pdf.title');
  const townsInTour = () => { const s = new Set(); RV.allStops().forEach(id => s.add(ZONE_TOWN[ALL[id].zone])); state.days.forEach(d => d.stay && s.add(ZONE_TOWN[ALL[d.stay].zone])); return [...s].map(id => ({...TOWNS[id], id:'town-' + id})); };
  const people = n => n + ' ' + (n === 1 ? t('person') : t('people'));
  const days = n => n + ' ' + (n === 1 ? t('dayWord') : t('daysWord'));

  /* ---------- COPIAR ---------- */
  function textTour(){
    let s = `${t('pdf.title').toUpperCase()}${state.name ? ' — ' + state.name : ''}\n${people(state.people)}\n`;
    state.days.forEach((d,i) => {
      s += `\n${t('day').toUpperCase()} ${i+1}${state.date ? ' (' + RV.dayDate(i) + ')' : ''}\n`;
      RV.schedule(i).forEach(x => { const it = ALL[x.id]; s += `• ${RV.fmtT(x.start)} — ${it.name} (${dur(it.dur)})\n`; });
      if (!d.stops.length) s += `• ${t('day.free')}\n`;
      if (d.stay) s += `🛏 ${t('night.of', {n:i+1})}: ${ALL[d.stay].name} (${zn(ALL[d.stay].zone)})\n`;
    });
    return s + `\n${t('share.link')}: ${RV.shareUrl()}\n${t('pdf.madeWith')}`;
  }
  function fallbackCopy(txt, done){ const ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = 0; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch(e){ RV.toast(t('toast.copyFail')); } ta.remove(); }
  $('#btnCopy').onclick = () => {
    const txt = textTour(), done = () => RV.toast(t('toast.copied'));
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(done, () => fallbackCopy(txt, done)); else fallbackCopy(txt, done);
  };

  /* ---------- IMPRIMIR ---------- */
  function printTour(){
    let h = `<h1>${esc(title())}</h1><p>${days(state.days.length)} · ${people(state.people)}</p>`;
    state.days.forEach((d,i) => {
      h += `<h2>${t('day')} ${i+1}${state.date ? ' — ' + RV.dayDate(i) : ''}</h2><p>${t('day.from', {town:zn(RV.startZone(i))})}.</p>`;
      const sch = RV.schedule(i); if (!sch.length) h += `<p>${t('day.free')}.</p>`;
      sch.forEach(s => { const it = ALL[s.id], isP = it.kind === 'lugar'; h += `<div class="ps"><b>${RV.fmtT(s.start)} — ${esc(it.name)}</b> (${dur(it.dur)})${isP ? '' : ' · ' + esc(L(it,'dish'))}<p>${esc(L(it,'desc'))}</p>${isP ? `<p><b>${t('d.how')}:</b> ${esc(L(it,'how'))}</p>` : ''}<p><b>${t('d.tips')}:</b> ${esc(L(it,'tips'))}</p></div>`; });
      if (d.stay){ const s = ALL[d.stay]; h += `<div class="ps"><b>${t('night.of', {n:i+1})}: ${esc(s.name)}</b> · ${RV.type(s.type)} · ${zn(s.zone)}<p>${esc(L(s,'desc'))}</p><p><b>${t('d.tip')}:</b> ${esc(L(s,'tips'))}</p></div>`; }
    });
    townsInTour().forEach(tw => { h += `<h2>${t('pdf.guideOf', {town:tw.name})}</h2><p>${esc(L(tw,'intro'))}</p>${L(tw,'acts').map(([n,d]) => `<p><b>${esc(n)}:</b> ${esc(d)}</p>`).join('')}<p><b>${t('town.how')}:</b> ${esc(L(tw,'how'))}</p>`; });
    h += `<h2>${t('pack.title')}</h2><p>${RV.packList().map(esc).join(' · ')}</p><p style="margin-top:12pt;font-size:9pt">${t('pdf.disclaimer')}</p>`;
    $('#printArea').innerHTML = h; setTimeout(() => window.print(), 50);
  }
  $('#btnPrint').onclick = printTour;

  /* ---------- PDF ---------- */
  const PDF_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  function loadJsPDF(){ return new Promise((ok, no) => { if (window.jspdf) return ok(); const s = document.createElement('script'); s.src = PDF_SRC; s.onload = () => window.jspdf ? ok() : no(); s.onerror = no; document.head.appendChild(s); setTimeout(() => window.jspdf ? ok() : no(), 12000); }); }
  $('#btnPdf').onclick = async () => {
    const b = $('#btnPdf'), old = b.innerHTML; b.innerHTML = t('pdf.preparing'); b.disabled = true;
    try { await loadJsPDF(); buildPDF(); RV.toast(t('toast.pdf')); }
    catch(e){ console.error(e); RV.toast(t('toast.pdfFail')); printTour(); }
    finally { b.innerHTML = old; b.disabled = false; }
  };
  const clean = s => String(s).replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/…/g,'...').replace(/[—–]/g,'-').replace(/→/g,'>');

  function buildPDF(){
    const { jsPDF } = window.jspdf, doc = new jsPDF({unit:'mm', format:'a4'});
    const W = 210, H = 297, M = 16, CW = W - M*2;
    const C = {forest:[14,42,30], moss:[45,90,62], palm:[134,184,107], mint:[211,230,198], clay:[217,116,74], paper:[245,241,230], muted:[86,105,94], ink:[15,34,25], sun:[242,177,52], night:[43,62,107]};
    const fill = c => doc.setFillColor(...c), col = c => doc.setTextColor(...c), draw = c => doc.setDrawColor(...c);
    let y = M;
    const T = (txt, x, yy, o={}) => { doc.setFont('helvetica', o.b ? 'bold' : (o.i ? 'italic' : 'normal')); doc.setFontSize(o.s || 10.5); col(o.c || C.ink); doc.text(clean(txt), x, yy, o.a ? {align:o.a} : undefined); };
    const wrap = (txt, w, s, b) => { doc.setFont('helvetica', b ? 'bold' : 'normal'); doc.setFontSize(s); return doc.splitTextToSize(clean(txt), w); };
    const ensure = h => { if (y + h > H - 20){ doc.addPage(); y = M + 4; } };
    const para = (txt, x, w, o={}) => { const lines = wrap(txt, w, o.s || 10.5, o.b); const lh = (o.s || 10.5) * .43; lines.forEach(l => { ensure(lh + 1); T(l, x, y, o); y += lh; }); };
    const nP = RV.allStops().filter(id => ALL[id].kind === 'lugar').length, nF = RV.allStops().length - nP, nN = RV.nights();
    const upper = s => s.toLocaleUpperCase(RV.locale());

    /* portada */
    fill(C.forest); doc.rect(0, 0, W, H, 'F');
    fill([23,58,41]); doc.circle(W - 20, 60, 70, 'F'); fill(C.moss); doc.circle(W - 10, 40, 36, 'F');
    fill([62,122,82]); doc.triangle(0, 230, 60, 180, 120, 230, 'F'); doc.triangle(80, 230, 150, 170, 210, 230, 'F');
    fill([36,74,51]); doc.rect(0, 228, W, 70, 'F');
    for (let k = 0; k < 6; k++){ const x = 20 + k * 34, ty = 236 - (k%2)*6; draw([239,233,218]); doc.setLineWidth(1); doc.line(x, 262, x, ty); draw(C.palm); doc.setLineWidth(.9); doc.line(x, ty, x-7, ty-3); doc.line(x, ty, x+7, ty-3); doc.line(x, ty, x-5, ty+3); doc.line(x, ty, x+5, ty+3); doc.line(x, ty, x, ty-6); }
    fill(C.sun); doc.circle(40, 60, 14, 'F');
    T(upper(t('pdf.brand')), M, 104, {s:9, b:true, c:C.palm});
    const tl = wrap(title(), CW, 34, true); doc.setFont('helvetica','bold'); doc.setFontSize(34); col(C.paper); doc.text(tl, M, 118); let cy = 118 + tl.length * 13;
    T(t('pdf.subtitle'), M, cy, {s:12.5, i:true, c:C.mint}); cy += 16;
    const facts = [[t('pdf.date'), state.date ? new Date(state.date + 'T12:00').toLocaleDateString(RV.locale(),{day:'numeric',month:'long',year:'numeric'}) : t('pdf.tbd')], [t('pdf.length'), days(state.days.length)], [t('pdf.travelers'), people(state.people)], [t('stat.places'), `${nP}`], [t('stat.meals'), `${nF}`], [t('stat.nights'), `${nN}`]];
    facts.forEach((f,i) => { const x = M + (i%3) * 60, yy = cy + Math.floor(i/3) * 20; T(upper(f[0]), x, yy, {s:8, b:true, c:C.palm}); T(f[1], x, yy + 6, {s:12, b:true, c:C.paper}); });
    T(t('pdf.generated', {d:new Date().toLocaleDateString(RV.locale(),{day:'numeric',month:'long',year:'numeric'})}), M, 285, {s:8.5, c:C.mint});

    /* resumen */
    doc.addPage(); y = M + 4;
    T(t('pdf.summary'), M, y + 6, {s:22, b:true, c:C.forest}); y += 16;
    state.days.forEach((d,i) => {
      const sch = RV.schedule(i); ensure(22 + sch.length * 6);
      fill(C.mint); doc.roundedRect(M, y - 5, CW, 9, 2, 2, 'F');
      T(`${t('day')} ${i+1}${state.date ? ' · ' + RV.dayDate(i) : ''}`, M + 4, y + 1, {s:11, b:true, c:C.forest}); y += 10;
      if (!sch.length){ T(t('day.free'), M + 4, y, {s:10, i:true, c:C.muted}); y += 7; }
      sch.forEach(s => { const it = ALL[s.id]; T(RV.fmtT(s.start), M + 4, y, {s:10, b:true, c:C.moss}); T(it.name, M + 30, y, {s:10.5}); T(it.kind === 'lugar' ? t('pdf.place') : RV.slot(it.slot), W - M, y, {s:9, c:C.muted, a:'right'}); y += 6; });
      if (d.stay){ T(t('pdf.night'), M + 4, y, {s:10, b:true, c:C.night}); T(`${ALL[d.stay].name} · ${zn(ALL[d.stay].zone)}`, M + 30, y, {s:10.5}); T(t('pdf.lodging'), W - M, y, {s:9, c:C.muted, a:'right'}); y += 6; }
      y += 5;
    });
    ensure(40); y += 2;
    fill(C.paper); doc.roundedRect(M, y, CW, 34, 3, 3, 'F');
    T(t('pdf.before'), M + 5, y + 8, {s:12, b:true, c:C.forest}); y += 14;
    [t('pdf.b1'), t('pdf.b2'), t('pdf.b3')].forEach(x => { T('•  ' + x, M + 5, y, {s:9.5}); y += 5.5; });

    /* días */
    state.days.forEach((d,i) => {
      doc.addPage(); y = M;
      fill(C.forest); doc.rect(0, 0, W, 34, 'F');
      T(upper(`${t('day')} ${i+1} · ${t('day.from', {town:zn(RV.startZone(i))})}`), M, 15, {s:10, b:true, c:C.palm}); T(state.date ? RV.dayDate(i).replace(/^\S/, c => c.toUpperCase()) : t('pdf.itinerary'), M, 26, {s:20, b:true, c:C.paper});
      /* pronóstico del día, si la fecha ya está dentro de los 16 días que da Open-Meteo */
      const f = RV.dayForecast(i);
      if (f && f !== 'far') T(`${t('wx.' + RV.wxType(f.code))} · ${Math.round(f.min)}°–${Math.round(f.max)}°C${f.rain != null ? ` · ${f.rain}% ${t('fc.rain')}` : ''} · ${zn(f.zone)}`, W - M, 26, {s:9.5, c:C.mint, a:'right'});
      y = 46;
      const sch = RV.schedule(i);
      if (!sch.length){ T(t('pdf.freeDay'), M, y, {s:11, i:true, c:C.muted}); y += 10; }
      sch.forEach(s => {
        const it = ALL[s.id], isP = it.kind === 'lugar';
        ensure(40);
        if (s.from !== it.zone){ T(t('day.transfer', {town:zn(s.from), m:s.travel}) + (s.km ? ` · ${s.km} km` : ''), M + 28, y, {s:8.5, i:true, c:C.muted}); y += 6; }
        const top = y;
        fill(isP ? C.moss : C.clay); doc.roundedRect(M, y - 4, 22, 9, 2, 2, 'F');
        T(RV.fmtT(s.start), M + 11, y + 1.8, {s:8.5, b:true, c:[255,255,255], a:'center'});
        T(t('pdf.until', {h:RV.fmtT(s.end)}), M + 11, y + 10, {s:7.5, c:C.muted, a:'center'});
        const x = M + 28, w = CW - 28;
        para(it.name, x, w, {s:14, b:true, c:C.forest}); y += 1;
        para(isP ? `${L(it,'town')} · ${dur(it.dur)} · ${t('d.alt')} ${it.alt} · ${Math.round(it.wx.t)}°C, ${t('wx.' + RV.wxType(it.wx.code)).toLowerCase()}` : `${RV.slot(it.slot)} · ${zn(it.zone)} · ${L(it,'dish')} · ${dur(it.dur)}`, x, w, {s:8.5, c:C.muted}); y += 1.5;
        para(L(it,'desc'), x, w, {s:10}); y += 1.5;
        const block = (label, txt) => { ensure(10); T(upper(label), x, y, {s:9, b:true, c:isP ? C.moss : C.clay}); y += 4.6; para(txt, x, w, {s:9.5}); y += 1.5; };
        if (isP) block(t('d.how'), L(it,'how'));
        block(t('d.tips'), L(it,'tips'));
        if (isP) block(t('d.todo'), L(it,'todo').join(' · '));
        draw([220,215,200]); doc.setLineWidth(.6); doc.line(M + 11, top + 12, M + 11, y - 2);
        y += 5;
      });
      if (d.stay){
        const s = ALL[d.stay]; ensure(40);
        const lines = wrap(L(s,'desc'), CW - 12, 9.5).length + wrap(L(s,'tips'), CW - 12, 9).length;
        fill([232,237,248]); doc.roundedRect(M, y - 2, CW, 24 + lines * 4.2, 3, 3, 'F');
        y += 5; T(upper(t('pdf.sleepTonight')), M + 6, y, {s:8.5, b:true, c:C.night}); y += 6;
        T(s.name, M + 6, y, {s:13, b:true, c:C.forest}); y += 5;
        para(`${RV.type(s.type)} · ${zn(s.zone)} · ${t('d.goodFor')}: ${L(s,'good').join(', ')}`, M + 6, CW - 12, {s:8.5, c:C.muted}); y += 1;
        para(L(s,'desc'), M + 6, CW - 12, {s:9.5}); para(L(s,'tips'), M + 6, CW - 12, {s:9, i:true, c:C.muted}); y += 6;
      }
    });

    /* guía de pueblos */
    const towns = townsInTour();
    if (towns.length){
      doc.addPage(); y = M + 4;
      T(t('pdf.townsTitle'), M, y + 6, {s:22, b:true, c:C.forest}); y += 18;
      towns.forEach(tw => {
        ensure(30);
        fill(C.mint); doc.roundedRect(M, y - 5, CW, 9, 2, 2, 'F'); T(`${tw.name} · ${L(tw,'tag')}`, M + 4, y + 1, {s:11.5, b:true, c:C.forest}); y += 10;
        para(L(tw,'intro'), M, CW, {s:9.5, c:C.muted}); y += 2;
        T(upper(t('town.todo')), M, y, {s:9, b:true, c:C.moss}); y += 5;
        L(tw,'acts').forEach(([n,dd]) => { para(`•  ${n}: ${dd}`, M + 2, CW - 2, {s:9.5}); y += .8; });
        const eat = FOOD.filter(x => tw.zones.includes(x.zone)).map(x => `${x.name} (${RV.slot(x.slot).toLowerCase()})`).join(' · ');
        const sleep = STAYS.filter(x => tw.zones.includes(x.zone)).map(x => `${x.name} (${RV.type(x.type).toLowerCase()})`).join(' · ');
        if (eat){ y += 1.5; T(upper(t('town.eat')), M, y, {s:9, b:true, c:C.clay}); y += 5; para(eat, M + 2, CW - 2, {s:9.5}); }
        if (sleep){ y += 1.5; T(upper(t('town.sleep')), M, y, {s:9, b:true, c:C.night}); y += 5; para(sleep, M + 2, CW - 2, {s:9.5}); }
        y += 1.5; T(upper(t('town.how')), M, y, {s:9, b:true, c:C.moss}); y += 5; para(L(tw,'how'), M + 2, CW - 2, {s:9.5}); y += 8;
      });
    }

    /* transporte */
    doc.addPage(); y = M + 4;
    T(t('sec.moveTitle'), M, y + 6, {s:22, b:true, c:C.forest}); y += 18;
    FARES.forEach((f,i) => { const fo = {...f, id:'fare' + i}; ensure(14); T(L(fo,'route'), M, y, {s:10.5, b:true}); T(L(fo,'price'), W - M, y, {s:10, b:true, c:C.moss, a:'right'}); y += 5; T(`${L(fo,'how')} · ${L(fo,'time')}`, M, y, {s:9, c:C.muted}); y += 7; });
    y += 2; para(t('fare.note'), M, CW, {s:9, i:true, c:C.muted});

    /* empaque y notas */
    y += 10; ensure(30);
    T(t('pack.title'), M, y + 2, {s:18, b:true, c:C.forest}); y += 12;
    RV.packList().forEach(x => { ensure(9); draw(C.moss); doc.setLineWidth(.5); doc.roundedRect(M, y - 4, 5, 5, 1, 1, 'S'); T(x, M + 9, y, {s:11}); y += 9; });
    y += 6; ensure(60);
    T(t('pdf.notes'), M, y, {s:16, b:true, c:C.forest}); y += 8;
    draw([210,205,190]); doc.setLineWidth(.3); for (let k = 0; k < 7; k++){ ensure(9); doc.line(M, y, W - M, y); y += 9; }

    const pages = doc.getNumberOfPages();
    for (let p = 2; p <= pages; p++){ doc.setPage(p); draw([220,215,200]); doc.setLineWidth(.3); doc.line(M, H - 12, W - M, H - 12); T(title(), M, H - 7, {s:8, c:C.muted}); T(t('pdf.page', {p, n:pages}), W - M, H - 7, {s:8, c:C.muted, a:'right'}); }
    const fname = (RV.lang === 'en' ? 'my-quindio-tour' : 'mi-tour-quindio') + (state.name ? '-' + RV.norm(state.name).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') : '') + '.pdf';
    doc.save(fname);
  }
})();
