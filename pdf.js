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
    try { await loadJsPDF(); await buildPDF(); RV.toast(t('toast.pdf')); }
    catch(e){ console.error(e); RV.toast(t('toast.pdfFail')); printTour(); }
    finally { b.innerHTML = old; b.disabled = false; }
  };
  const clean = s => String(s).replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/…/g,'...').replace(/[—–]/g,'-').replace(/→/g,'>');

  /* fotos para el PDF: se recortan como "object-fit: cover" y se pasan a JPEG.
     Si la página se abrió con doble clic (file://) el navegador no deja leerlas: el PDF sale sin fotos. */
  const imgCache = {};
  function photo(k, big, ratio, px){
    const key = k + big + ratio + px;
    if (imgCache[key] !== undefined) return imgCache[key];
    return imgCache[key] = new Promise(ok => {
      if (!k || !PHOTOS[k]) return ok(null);
      const im = new Image(); im.decoding = 'async';
      im.onload = () => {
        try {
          const w = px, h = Math.round(px / ratio), c = document.createElement('canvas'); c.width = w; c.height = h;
          const s = Math.max(w / im.naturalWidth, h / im.naturalHeight), dw = im.naturalWidth * s, dh = im.naturalHeight * s;
          c.getContext('2d').drawImage(im, (w - dw) / 2, (h - dh) / 2, dw, dh);
          ok(c.toDataURL('image/jpeg', .8));
        } catch(e){ ok(null); }
      };
      im.onerror = () => ok(null);
      im.src = RV.pSrc(k, big);
    });
  }
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));

  async function buildPDF(){
    const { jsPDF } = window.jspdf, doc = new jsPDF({unit:'mm', format:'a4', compress:true});
    const W = 210, H = 297, M = 16, CW = W - M*2;
    /* colores de la página */
    const C = {bg:[6,17,12], panel:[15,33,25], panel2:[23,45,34], gold:[246,211,101], orange:[242,163,58], lime:[168,224,99], teal:[60,201,160], terra:[232,116,59],
      paper:[251,249,244], soft:[241,238,228], ink:[18,28,22], muted:[96,108,100], line:[222,216,202], white:[255,255,255], cream:[243,239,228], dim:[170,184,175]};
    const DAYC = (RV.DAYC || ['#F2A33A']).map(hex);
    const dc = i => DAYC[i % DAYC.length];
    const fill = c => doc.setFillColor(...c), col = c => doc.setTextColor(...c), draw = c => doc.setDrawColor(...c);
    const alpha = a => { try { doc.setGState(new doc.GState({opacity:a})); } catch(e){} };
    let y = M;
    const T = (txt, x, yy, o={}) => { doc.setFont('helvetica', o.b ? (o.i ? 'bolditalic' : 'bold') : (o.i ? 'italic' : 'normal')); doc.setFontSize(o.s || 10.5); col(o.c || C.ink); if (o.cs != null) doc.setCharSpace(o.cs); doc.text(clean(txt), x, yy, o.a ? {align:o.a} : undefined); if (o.cs != null) doc.setCharSpace(0); };
    const wrap = (txt, w, s, b) => { doc.setFont('helvetica', b ? 'bold' : 'normal'); doc.setFontSize(s); return doc.splitTextToSize(clean(txt), w); };
    const newPage = () => { doc.addPage(); fill(C.paper); doc.rect(0, 0, W, H, 'F'); y = M + 4; };
    const ensure = h => { if (y + h > H - 20) newPage(); };
    const para = (txt, x, w, o={}) => { const lines = wrap(txt, w, o.s || 10.5, o.b); const lh = (o.s || 10.5) * .43; lines.forEach(l => { ensure(lh + 1); T(l, x, y, o); y += lh; }); };
    const upper = s => s.toLocaleUpperCase(RV.locale());
    const img = (data, x, yy, w, h) => { if (data) try { doc.addImage(data, 'JPEG', x, yy, w, h, undefined, 'FAST'); return true; } catch(e){} return false; };
    /* franja con los colores de la página (dorado → naranja → lima → verde agua) */
    /* degradado oscuro hacia abajo: capas finas apiladas que van hasta el borde inferior (sin rayas) */
    const shade = (x, yy, w, h, a0, a1, n = 16) => { fill(C.bg); const st = 1 - Math.pow(1 - a1, 1 / n); for (let k = 0; k < n; k++){ alpha(st); doc.rect(x, yy + h * k / n, w, h - h * k / n, 'F'); } alpha(1); };
    const stripe = (x, yy, w, h) => { const cs = [C.gold, C.orange, C.lime, C.teal]; cs.forEach((c, k) => { fill(c); doc.rect(x + k * w / 4, yy, w / 4 + .2, h, 'F'); }); };
    /* título grande tipo cartel */
    const bigTitle = (txt, x, yy, s, c) => T(upper(txt), x, yy, {s, b:true, c, cs:-.3});
    const pill = (txt, x, yy, bgc, fg, s = 8) => { doc.setFont('helvetica', 'bold'); doc.setFontSize(s); const w = doc.getTextWidth(clean(txt)) + 6; fill(bgc); doc.roundedRect(x, yy - s * .36 - 1.6, w, s * .36 + 3.4, 1.8, 1.8, 'F'); T(txt, x + 3, yy, {s, b:true, c:fg}); return w; };

    const nP = RV.allStops().filter(id => ALL[id].kind === 'lugar').length, nF = RV.allStops().length - nP, nN = RV.nights();
    const firstPlace = i => { const d = state.days[i], p = d.stops.find(id => ALL[id].kind === 'lugar'); return p ? ALL[p] : d.stops.length ? ALL[d.stops[0]] : null; };

    /* ---------- fotos que se van a usar (se cargan todas antes de dibujar) ---------- */
    const heroP = photo('heroCocora', true, 210 / 297, 1100);
    const dayBanner = state.days.map((d, i) => { const p = firstPlace(i); return photo(p ? RV.mainPh(p) : 'quindio', true, 3.2, 1200); });
    const thumbs = {}, stayPh = {};
    RV.allStops().forEach(id => thumbs[id] = photo(RV.mainPh(ALL[id]), false, 4 / 3, 420));
    state.days.forEach(d => { if (d.stay) stayPh[d.stay] = photo(RV.mainPh(ALL[d.stay]), false, 4 / 3, 420); });
    const towns = townsInTour();
    const townPh = towns.map(tw => photo(tw.ph, true, 4.2, 1200));
    const hero = await heroP, banners = await Promise.all(dayBanner), tph = await Promise.all(townPh);
    for (const k in thumbs) thumbs[k] = await thumbs[k];
    for (const k in stayPh) stayPh[k] = await stayPh[k];

    /* ================= PORTADA ================= */
    fill(C.bg); doc.rect(0, 0, W, H, 'F');
    if (img(hero, 0, 0, W, H)){
      alpha(.45); fill(C.bg); doc.rect(0, 0, W, H, 'F'); alpha(1);
      shade(0, 95, W, 110, 0, .7); fill(C.bg); alpha(.7); doc.rect(0, 205, W, H - 205, 'F'); alpha(1);
    }
    stripe(0, 0, W, 2.2);
    T(upper(t('pdf.brand')), M, 22, {s:8.5, b:true, c:C.gold, cs:.8});
    T(upper(RV.lang === 'en' ? 'Coffee Region · Colombia' : 'Eje Cafetero · Colombia'), W - M, 22, {s:8.5, b:true, c:C.cream, a:'right'});
    /* gran palabra QUINDÍO en capas de color, como el título de la página */
    const word = 'QUINDÍO';
    [[C.teal, 1.6], [C.lime, 1.1], [C.orange, .55], [C.gold, 0]].forEach(([c, d]) => bigTitle(word, M - .4 + d * .2, 132 + d, 70, c));
    const tl = wrap(title(), CW, 22, true); doc.setFont('helvetica', 'bold'); doc.setFontSize(22); col(C.white); doc.text(tl, M, 152); let cy = 152 + tl.length * 9;
    T(t('pdf.subtitle'), M, cy, {s:11.5, i:true, c:C.cream}); cy += 14;
    /* datos del viaje en un panel */
    fill(C.panel); alpha(.88); doc.roundedRect(M, cy, CW, 44, 4, 4, 'F'); alpha(1);
    stripe(M + 6, cy, 40, 1.4);
    const facts = [[t('pdf.date'), state.date ? new Date(state.date + 'T12:00').toLocaleDateString(RV.locale(),{day:'numeric',month:'long',year:'numeric'}) : t('pdf.tbd')], [t('pdf.length'), days(state.days.length)], [t('pdf.travelers'), people(state.people)], [t('stat.places'), `${nP}`], [t('stat.meals'), `${nF}`], [t('stat.nights'), `${nN}`]];
    facts.forEach((f, i) => { const x = M + 8 + (i % 3) * 58, yy = cy + 12 + Math.floor(i / 3) * 18; T(upper(f[0]), x, yy, {s:7.5, b:true, c:C.gold, cs:.4}); T(f[1], x, yy + 6.5, {s:12.5, b:true, c:C.white}); });
    /* los días, cada uno con su color */
    let px = M; const py = cy + 56;
    state.days.forEach((d, i) => { const w = pill(`${t('day')} ${i + 1} · ${zn(RV.dayZone(i))}`, px, py, dc(i), C.bg, 8.5); px += w + 3; if (px > W - M - 40){ px = M; } });
    T(t('pdf.generated', {d:new Date().toLocaleDateString(RV.locale(),{day:'numeric',month:'long',year:'numeric'})}), M, H - 12, {s:8, c:C.dim});
    if (hero) T(`${PHOTOS.heroCocora.t} · ${t('photo.by')}: ${PHOTOS.heroCocora.by} · ${PHOTOS.heroCocora.lic}`, W - M, H - 12, {s:7, c:C.dim, a:'right'});

    /* ================= MAPA DEL RECORRIDO (dibujado, sin internet) ================= */
    function tripMap(x0, y0, w, h, onlyDay){
      fill(C.bg); doc.roundedRect(x0, y0, w, h, 4, 4, 'F');
      const zs = new Set(); state.days.forEach((d, i) => { if (onlyDay != null && i !== onlyDay) return; zs.add(RV.startZone(i)); d.stops.forEach(id => zs.add(ALL[id].zone)); if (d.stay) zs.add(ALL[d.stay].zone); });
      if (!zs.size) zs.add(state.base);
      const pts = [...zs].map(z => ZLL[z]); let la0 = Math.min(...pts.map(p => p[0])), la1 = Math.max(...pts.map(p => p[0])), lo0 = Math.min(...pts.map(p => p[1])), lo1 = Math.max(...pts.map(p => p[1]));
      const padLa = Math.max(.03, (la1 - la0) * .18), padLo = Math.max(.03, (lo1 - lo0) * .18); la0 -= padLa; la1 += padLa; lo0 -= padLo; lo1 += padLo;
      const iw = w - 16, ih = h - 16, sx = iw / (lo1 - lo0), sy = ih / (la1 - la0), s = Math.min(sx, sy);
      const ox = x0 + 8 + (iw - (lo1 - lo0) * s) / 2, oy = y0 + 8 + (ih - (la1 - la0) * s) / 2;
      const P = ([la, lo]) => [ox + (lo - lo0) * s, oy + (la1 - la) * s];
      /* los demás pueblos del Quindío, tenues, como referencia */
      Object.keys(ZLL).forEach(z => { const [a, b] = P(ZLL[z]); if (a < x0 + 3 || a > x0 + w - 3 || b < y0 + 3 || b > y0 + h - 3 || zs.has(z)) return; fill(C.panel2); doc.circle(a, b, .9, 'F'); });
      state.days.forEach((d, i) => {
        if (onlyDay != null && i !== onlyDay) return;
        const path = [RV.startZone(i), ...d.stops.map(id => ALL[id].zone)]; if (d.stay) path.push(ALL[d.stay].zone);
        draw(dc(i)); doc.setLineWidth(1.1);
        for (let k = 1; k < path.length; k++){ if (path[k] === path[k - 1]) continue;
          const r = RV.route && RV.route(path[k - 1], path[k]); const seg = r ? r.pts.filter((_, j, a) => j % 3 === 0 || j === a.length - 1) : [ZLL[path[k - 1]], ZLL[path[k]]];
          const q = seg.map(P); for (let j = 1; j < q.length; j++) doc.line(q[j - 1][0], q[j - 1][1], q[j][0], q[j][1]); }
      });
      zs.forEach(z => { const [a, b] = P(ZLL[z]); fill(C.gold); doc.circle(a, b, 1.6, 'F'); draw(C.bg); doc.setLineWidth(.5); doc.circle(a, b, 1.6, 'S');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); const lw = doc.getTextWidth(clean(upper(zn(z)))) + 2.4; fill(C.bg); alpha(.85); doc.roundedRect(a + 2.1, b - 1.6, lw, 3.6, .8, .8, 'F'); alpha(1);
        T(upper(zn(z)), a + 3.3, b + 1, {s:6.5, b:true, c:C.white}); });
      if (onlyDay == null){ let lx = x0 + 6; state.days.forEach((_, i) => { fill(dc(i)); doc.roundedRect(lx, y0 + h - 7.5, 5, 2.2, .8, .8, 'F'); T(`${t('day')} ${i + 1}`, lx + 6.5, y0 + h - 5.6, {s:6.5, b:true, c:C.cream}); lx += 22; }); }
    }

    /* ================= RESUMEN ================= */
    newPage();
    fill(C.bg); doc.rect(0, 0, W, 38, 'F'); stripe(0, 38, W, 1.2);
    T(upper(t('pdf.brand')), M, 15, {s:8, b:true, c:C.gold, cs:.6}); bigTitle(t('pdf.summary'), M, 29, 24, C.white);
    y = 48;
    tripMap(M, y, CW, 84); y += 94;
    state.days.forEach((d, i) => {
      const sch = RV.schedule(i); ensure(16 + sch.length * 6.2 + (d.stay ? 6 : 0));
      fill(dc(i)); doc.circle(M + 4.5, y - 1.2, 4.5, 'F'); T(String(i + 1), M + 4.5, y + .4, {s:10, b:true, c:C.bg, a:'center'});
      T(upper(`${t('day')} ${i + 1}`) + (state.date ? '  ·  ' + RV.dayDate(i) : ''), M + 12, y + .2, {s:10.5, b:true, c:C.ink});
      const f = RV.dayForecast(i); if (f && f !== 'far') T(`${Math.round(f.min)}°–${Math.round(f.max)}°C · ${f.rain}% ${t('fc.rain')}`, W - M, y + .2, {s:8, c:C.muted, a:'right'});
      y += 7;
      draw(dc(i)); doc.setLineWidth(.8); const top = y - 3;
      if (!sch.length){ T(t('day.free'), M + 12, y, {s:9.5, i:true, c:C.muted}); y += 6; }
      sch.forEach(s => { const it = ALL[s.id]; T(RV.fmtT(s.start), M + 12, y, {s:9, b:true, c:C.ink}); T(it.name, M + 36, y, {s:10}); T(it.kind === 'lugar' ? t('pdf.place') : RV.slot(it.slot), W - M, y, {s:8, c:C.muted, a:'right'}); y += 6.2; });
      if (d.stay){ T(t('pdf.night'), M + 12, y, {s:9, b:true, c:C.terra}); T(`${ALL[d.stay].name} · ${zn(ALL[d.stay].zone)}`, M + 36, y, {s:10}); T(t('pdf.lodging'), W - M, y, {s:8, c:C.muted, a:'right'}); y += 6.2; }
      doc.line(M + 4.5, top + 1, M + 4.5, y - 4);
      y += 5;
    });
    ensure(38);
    fill(C.soft); doc.roundedRect(M, y, CW, 32, 3, 3, 'F'); fill(C.gold); doc.rect(M, y, 2, 32, 'F');
    T(upper(t('pdf.before')), M + 7, y + 8, {s:9.5, b:true, c:C.ink, cs:.3}); let by0 = y + 15;
    [t('pdf.b1'), t('pdf.b2'), t('pdf.b3')].forEach(x => { fill(C.orange); doc.circle(M + 8.5, by0 - 1.1, .9, 'F'); T(x, M + 12, by0, {s:9}); by0 += 5.5; });
    y += 40;

    /* ================= DÍAS ================= */
    state.days.forEach((d, i) => {
      /* si queda mucho espacio, el día sigue en la misma página con un encabezado más bajo */
      const inline = (H - 20 - y) > 120;
      if (!inline) newPage();
      const bh = inline ? 36 : 56, bx = inline ? M : 0, bw = inline ? CW : W, by = inline ? y : 0;
      fill(C.bg); inline ? doc.roundedRect(bx, by, bw, bh, 4, 4, 'F') : doc.rect(bx, by, bw, bh, 'F');
      if (img(banners[i], bx, by, bw, bh)){ alpha(.3); fill(C.bg); doc.rect(bx, by, bw, bh, 'F'); alpha(1); shade(bx, by + bh * .3, bw, bh * .7, 0, .75); }
      fill(dc(i)); doc.rect(bx, by + bh - 1.6, bw, 1.6, 'F');
      /* número del día en su color */
      fill(dc(i)); doc.roundedRect(M + (inline ? 5 : 0), by + bh - 25, 16, 16, 3, 3, 'F'); T(String(i + 1), M + (inline ? 13 : 8), by + bh - 13.4, {s:18, b:true, c:C.bg, a:'center'});
      const tx = M + (inline ? 26 : 21);
      T(upper(`${t('day')} ${i + 1} · ${t('day.from', {town:zn(RV.startZone(i))})}`), tx, by + bh - 19, {s:8, b:true, c:dc(i), cs:.4});
      T(state.date ? RV.dayDate(i).replace(/^\S/, c => c.toUpperCase()) : t('pdf.itinerary'), tx, by + bh - 10.5, {s:18, b:true, c:C.white});
      const f = RV.dayForecast(i);
      if (f && f !== 'far'){ const txt = `${t('wx.' + RV.wxType(f.code))} · ${Math.round(f.min)}°–${Math.round(f.max)}°C · ${f.rain}% ${t('fc.rain')}`; doc.setFont('helvetica', 'bold'); doc.setFontSize(8); const w = doc.getTextWidth(clean(txt)) + 6; pill(txt, (inline ? M + CW - 5 : W - M) - w, by + 9, C.panel2, C.cream, 8); }
      y = by + bh + 10;
      const sch = RV.schedule(i);
      if (!sch.length){ T(t('pdf.freeDay'), M, y, {s:11, i:true, c:C.muted}); y += 10; }
      sch.forEach((s, j) => {
        const it = ALL[s.id], isP = it.kind === 'lugar';
        const x = M + 40, w = CW - 40;
        /* altura aproximada para no partir una parada entre dos páginas */
        const est = 12 + wrap(L(it,'desc'), w, 9.5).length * 4.1 + (isP ? wrap(L(it,'how'), w, 9).length * 3.9 + wrap(L(it,'todo').join(' · '), w, 9).length * 3.9 + 12 : 0) + wrap(L(it,'tips'), w, 9).length * 3.9 + 6;
        ensure(Math.min(Math.max(est, 34), 120));
        if (s.from !== it.zone){ fill(C.soft); doc.roundedRect(x, y - 4, w, 6.5, 1.5, 1.5, 'F'); T(`${t('day.transfer', {town:zn(s.from), m:s.travel})}${s.km ? ` · ${s.km} km` : ''}`, x + 3, y, {s:8, i:true, c:C.muted}); y += 7; }
        const top = y;
        /* foto con la hora encima */
        fill(C.soft); doc.roundedRect(M, y - 3, 34, 25.5, 2, 2, 'F');
        img(thumbs[s.id], M, y - 3, 34, 25.5);
        fill(isP ? dc(i) : C.terra); doc.roundedRect(M, y + 16.5, 22, 6, 1.5, 1.5, 'F'); T(RV.fmtT(s.start), M + 11, y + 20.6, {s:8, b:true, c:isP ? C.bg : C.white, a:'center'});
        T(t('pdf.until', {h:RV.fmtT(s.end)}), M + 17, y + 27.5, {s:7, c:C.muted, a:'center'});
        /* texto */
        T(upper(isP ? t('pdf.place') : RV.slot(it.slot)), x, y, {s:7.5, b:true, c:isP ? C.teal : C.terra, cs:.4}); y += 5.5;
        para(it.name, x, w, {s:14, b:true, c:C.ink}); y += .5;
        para(isP ? `${L(it,'town')} · ${dur(it.dur)} · ${t('d.alt')} ${it.alt}` : `${zn(it.zone)} · ${L(it,'dish')} · ${dur(it.dur)}`, x, w, {s:8.5, c:C.muted}); y += 1.5;
        para(L(it,'desc'), x, w, {s:9.5}); y += 1.5;
        const block = (label, txt) => { ensure(10); fill(isP ? dc(i) : C.terra); doc.rect(x, y - 2.6, 1.3, 3, 'F'); T(upper(label), x + 3, y, {s:7.8, b:true, c:C.ink, cs:.3}); y += 4.4; para(txt, x, w, {s:9, c:[50,60,54]}); y += 1.8; };
        if (isP) block(t('d.how'), L(it,'how'));
        block(t('d.tips'), L(it,'tips'));
        if (isP) block(t('d.todo'), L(it,'todo').join(' · '));
        y = Math.max(y, top + 31) + 5;
        if (j < sch.length - 1){ draw(C.line); doc.setLineWidth(.3); doc.line(x, y - 4.5, W - M, y - 4.5); }
      });
      if (d.stay){
        const s = ALL[d.stay], w = CW - 58;
        const lines = wrap(L(s,'desc'), w, 9).length + wrap(L(s,'tips'), w, 8.8).length;
        const h = Math.max(38, 26 + lines * 4);
        ensure(h + 4);
        fill(C.bg); doc.roundedRect(M, y, CW, h, 4, 4, 'F');
        img(stayPh[d.stay], M + 5, y + 5, 38, 28.5) || (fill(C.panel2), doc.roundedRect(M + 5, y + 5, 38, 28.5, 2, 2, 'F'));
        const x = M + 50; let yy = y + 9;
        T(upper(t('pdf.sleepTonight')), x, yy, {s:7.8, b:true, c:C.gold, cs:.4}); yy += 6.5;
        T(s.name, x, yy, {s:13, b:true, c:C.white}); yy += 5.5;
        T(`${RV.type(s.type)} · ${zn(s.zone)} · ${L(s,'good').join(', ')}`, x, yy, {s:8, c:C.dim}); yy += 5.5;
        wrap(L(s,'desc'), w, 9).forEach(l => { T(l, x, yy, {s:9, c:C.cream}); yy += 3.9; });
        wrap(L(s,'tips'), w, 8.8).forEach(l => { T(l, x, yy, {s:8.8, i:true, c:C.gold}); yy += 3.9; });
        y += h + 8;
      }
      /* mapa del día, si cabe al final */
      if (d.stops.length && (H - 20 - y) > 62){ T(upper(t('map.title')), M, y + 2, {s:8, b:true, c:C.muted, cs:.4}); y += 5; tripMap(M, y, CW, 52, i); y += 60; }
    });

    /* ================= GUÍA DE PUEBLOS ================= */
    if (towns.length){
      newPage();
      fill(C.bg); doc.rect(0, 0, W, 38, 'F'); stripe(0, 38, W, 1.2);
      T(upper(t('pdf.brand')), M, 15, {s:8, b:true, c:C.gold, cs:.6}); bigTitle(t('pdf.townsTitle'), M, 29, 22, C.white);
      y = 48;
      towns.forEach((tw, k) => {
        ensure(80);
        fill(C.bg); doc.roundedRect(M, y, CW, 42, 3, 3, 'F');
        if (img(tph[k], M, y, CW, 42)) shade(M, y + 10, CW, 32, 0, .78);
        bigTitle(tw.name, M + 6, y + 34, 22, C.white); T(L(tw,'tag'), M + 6, y + 39.5, {s:9, b:true, c:C.gold});
        y += 50;
        para(L(tw,'intro'), M, CW, {s:9.5, c:C.muted}); y += 3;
        const head = (txt, c) => { ensure(10); fill(c); doc.rect(M, y - 2.6, 1.3, 3, 'F'); T(upper(txt), M + 3, y, {s:8, b:true, c:C.ink, cs:.3}); y += 5; };
        head(t('town.todo'), C.teal);
        L(tw,'acts').forEach(([n, dd]) => { ensure(8); fill(C.orange); doc.circle(M + 3.4, y - 1.1, .8, 'F'); const ls = wrap(`${n}: ${dd}`, CW - 8, 9); ls.forEach((l, li) => { ensure(5); T(l, M + 7, y, {s:9, b:li === 0 && false}); y += 3.9; }); y += 1; });
        const eat = FOOD.filter(x => tw.zones.includes(x.zone)).map(x => `${x.name} (${RV.slot(x.slot).toLowerCase()})`).join(' · ');
        const sleep = STAYS.filter(x => tw.zones.includes(x.zone)).map(x => `${x.name} (${RV.type(x.type).toLowerCase()})`).join(' · ');
        if (eat){ y += 1.5; head(t('town.eat'), C.terra); para(eat, M + 3, CW - 3, {s:9}); }
        if (sleep){ y += 1.5; head(t('town.sleep'), C.gold); para(sleep, M + 3, CW - 3, {s:9}); }
        y += 1.5; head(t('town.how'), C.lime); para(L(tw,'how'), M + 3, CW - 3, {s:9}); y += 9;
      });
    }

    /* ================= TRANSPORTE, QUÉ EMPACAR Y NOTAS ================= */
    newPage();
    fill(C.bg); doc.rect(0, 0, W, 38, 'F'); stripe(0, 38, W, 1.2);
    T(upper(t('pdf.brand')), M, 15, {s:8, b:true, c:C.gold, cs:.6}); bigTitle(t('sec.moveTitle'), M, 29, 22, C.white);
    y = 50;
    FARES.forEach((f, i) => { const fo = {...f, id:'fare' + i}; ensure(14);
      if (i % 2 === 0){ fill(C.soft); doc.rect(M, y - 5, CW, 12.5, 'F'); }
      T(L(fo,'route'), M + 3, y, {s:10.5, b:true}); T(L(fo,'price'), W - M - 3, y, {s:10, b:true, c:[150,95,20], a:'right'}); y += 5; T(`${L(fo,'how')} · ${L(fo,'time')}`, M + 3, y, {s:8.5, c:C.muted}); y += 7.5; });
    y += 2; para(t('fare.note'), M, CW, {s:8.5, i:true, c:C.muted});
    y += 10; ensure(40);
    bigTitle(t('pack.title'), M, y + 2, 16, C.ink); stripe(M, y + 5, 30, 1); y += 14;
    const pk = RV.packList(), half = Math.ceil(pk.length / 2);
    pk.forEach((x, k) => { const cx = M + (k < half ? 0 : CW / 2), cy2 = y + (k % half) * 9; draw(C.teal); doc.setLineWidth(.6); doc.roundedRect(cx, cy2 - 4, 5, 5, 1.2, 1.2, 'S'); T(x, cx + 8, cy2, {s:10}); });
    y += half * 9 + 8; ensure(60);
    bigTitle(t('pdf.notes'), M, y, 16, C.ink); stripe(M, y + 3, 30, 1); y += 12;
    draw(C.line); doc.setLineWidth(.3); for (let k = 0; k < 7; k++){ ensure(9); doc.line(M, y, W - M, y); y += 9; }

    /* pie de página: franja oscura con la marca y el número de página */
    const pages = doc.getNumberOfPages();
    for (let p = 2; p <= pages; p++){
      doc.setPage(p); fill(C.bg); doc.rect(0, H - 11, W, 11, 'F'); stripe(0, H - 11, W, .7);
      T(upper('Ruta Verde') + '  ·  ' + title(), M, H - 4.2, {s:7.5, b:true, c:C.cream}); T(t('pdf.page', {p, n:pages}), W - M, H - 4.2, {s:7.5, c:C.dim, a:'right'});
    }
    const fname = (RV.lang === 'en' ? 'my-quindio-tour' : 'mi-tour-quindio') + (state.name ? '-' + RV.norm(state.name).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') : '') + '.pdf';
    doc.save(fname);
  }
})();
