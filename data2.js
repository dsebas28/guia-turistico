/* ============================================================
   RUTA VERDE — DATOS AMPLIADOS
   Pueblos nuevos (Calarcá, Pijao, Génova, Córdoba, La Tebaida),
   más lugares, calendario, tarifas de transporte y coordenadas.
   Los hospedajes de estos pueblos salen del registro oficial de
   alojamientos del Gobierno del Quindío (quindio.gov.co).
   ============================================================ */

Object.assign(PHOTOS, {
  calarca2:{f:'Calarca Quindio, Colombia.jpg', t:'Parque de Calarcá', by:'Darthvader2', lic:'CC BY-SA 4.0'},
  calarcaVista:{f:'Vista del norte de Armenia desde Calarcá.jpg', t:'Vista desde Calarcá', by:'CamiloB4', lic:'CC BY-SA 4.0'},
  jardin:{f:'CO Calarcá (JB) (17) (17222546386).jpg', t:'Jardín Botánico del Quindío', by:'Diego Tirira', lic:'CC BY-SA 2.0'},
  mariposario:{f:'Mariposario del Jardín Botánico del Quindio.JPG', t:'Mariposario del Jardín Botánico', by:'Karolynaroca', lic:'CC BY-SA 3.0'},
  pijao:{f:'Parque de Pijao, Quindío.jpg', t:'Parque de Pijao', by:'CamiloB4', lic:'CC BY-SA 4.0'},
  pijao2:{f:'Calle Pijao.jpg', t:'Calle de Pijao', by:'DazaPalacio', lic:'CC BY-SA 4.0'},
  pijao3:{f:'Pijao Ene 2016 (56).JPG', t:'Plaza de Pijao', by:'Darthvader2', lic:'CC BY-SA 4.0'},
  tebaida:{f:'Parque de La Tebaida.jpg', t:'Parque de La Tebaida', by:'AreaMetro', lic:'CC BY 4.0'},
  tebaida2:{f:'Puesta de sol en la Tebaida - Flickr - Alejandro Bayer T..jpg', t:'Atardecer en La Tebaida', by:'Alejandro Bayer T.', lic:'Dominio público'},
  cordoba:{f:'Iglesia San José de Córdoba.jpg', t:'Iglesia de Córdoba, Quindío', by:'CamiloB4', lic:'CC BY-SA 4.0'}
});

/* Zonas nuevas y coordenadas reales (para mapa y tiempos de viaje) */
ZONES.push('calarca','cordoba','pijao','genova','tebaida');
Object.assign(ZONE_NAME, {calarca:'Calarcá', cordoba:'Córdoba', pijao:'Pijao', genova:'Génova', tebaida:'La Tebaida'});
Object.assign(ZONE_TOWN, {calarca:'calarca', cordoba:'cordoba', pijao:'pijao', genova:'genova', tebaida:'tebaida'});
const ZLL = {
  armenia:[4.534,-75.681], circasia:[4.618,-75.636], filandia:[4.674,-75.658], salento:[4.637,-75.570], cocora:[4.638,-75.487],
  quimbaya:[4.623,-75.763], parque:[4.541,-75.772], buenavista:[4.360,-75.740], calarca:[4.519,-75.643], cordoba:[4.392,-75.688],
  pijao:[4.335,-75.705], genova:[4.206,-75.790], tebaida:[4.453,-75.787]
};

/* ---------- PUEBLOS NUEVOS ---------- */
Object.assign(TOWNS, {
  calarca:{name:'Calarcá', tag:'la Villa del Cacique', zones:['calarca'], ph:'calarca2',
    intro:'Vecina de Armenia, al otro lado del río Quindío. Aquí están el Jardín Botánico del Quindío con su mariposario y Recuca, el recorrido por la cultura del café. En junio celebra la Fiesta Nacional del Café.',
    acts:[['Jardín Botánico del Quindío','Reserva natural con senderos, mirador, zoológico de insectos y un mariposario de los más grandes de la región.'],
      ['Recuca','Recorrido de la Cultura Cafetera: te vistes de recolector, recoges café y ves todo el proceso del grano.'],
      ['Parque principal y catedral','Plaza con mucho movimiento y la iglesia de torres puntiagudas.'],
      ['Fiesta Nacional del Café','En junio: reinado, desfiles y conciertos. El pueblo se llena, reserva con tiempo.']],
    how:'Está pegada a Armenia: 15 a 20 minutos en bus urbano o taxi desde el centro.'},
  pijao:{name:'Pijao', tag:'el pueblo sin prisa', zones:['pijao'], ph:'pijao',
    intro:'En 2014 fue el primer pueblo de Latinoamérica en entrar a la red Cittaslow, los pueblos "sin prisa". Plaza de fachadas pastel, balcones con flores y montañas de niebla alrededor.',
    acts:[['Plaza principal','Siéntate a ver el pueblo pasar, con café de las montañas cercanas.'],
      ['Senderos ecológicos','Caminatas guiadas hacia el cerro Tarapacá, el mirador La Mariela y el valle de las Mariposas.'],
      ['Páramo de Chilí','Expedición de alta montaña para caminantes con experiencia. Solo con guía local.'],
      ['Cocina de kilómetro cero','Muchos lugares cocinan con productos de campesinos del municipio.']],
    how:'Unos 40 km al sur de Armenia. Buses desde el Terminal de Armenia; el camino pasa entre cafetales y montañas. Para guías y recorridos, pregunta en la alcaldía.'},
  genova:{name:'Génova', tag:'el pueblito paisa del Quindío', zones:['genova'], ph:'genova',
    intro:'El municipio más al sur y uno de los menos visitados. Fachadas coloniales restauradas, gente muy amable y montañas para turismo de naturaleza y aventura.',
    acts:[['Plaza principal','Casas de la colonización antioqueña con fachadas recién restauradas.'],
      ['Mercado campesino','Los domingos en la plaza principal: frutas, quesos y productos de las veredas.'],
      ['Naturaleza y aventura','Caminatas y turismo rural en las montañas que rodean el pueblo.'],
      ['Miradores campestres','Restaurantes de campo con vista panorámica al cañón.']],
    how:'Buses desde el Terminal de Armenia hacia el sur del departamento. Es el viaje más largo de la ruta: calcula alrededor de hora y media.'},
  cordoba:{name:'Córdoba', tag:'susurro de guaduales', zones:['cordoba'], ph:'cordoba',
    intro:'Pueblo joven y tranquilo, rodeado de guaduales. Es la capital de la guadua en el Quindío: aquí se estudia, se trabaja y se vende en forma de artesanías.',
    acts:[['Centro Nacional para el Estudio del Bambú-Guadua','Recorrido guiado por todo lo relacionado con la guadua, con casa de guadua y muestra de artesanías.'],
      ['Artesanías en guadua','Alrededor de la plaza venden lámparas, jarrones, instrumentos y muebles.'],
      ['Cascadas de La Persia','Tres caídas de agua en Río Verde Alto, a unos 22 km del pueblo: Las Brisas, Las Mellizas y La Linda.'],
      ['Kumis','La bebida típica del pueblo. Pruébalo en la plaza.']],
    how:'Buses desde el Terminal de Armenia, cerca de una hora. Para las cascadas necesitas transporte rural o guía.'},
  tebaida:{name:'La Tebaida', tag:'la puerta del aeropuerto', zones:['tebaida'], ph:'tebaida',
    intro:'A cinco minutos del aeropuerto El Edén. Tierra más cálida, de guaduales y praderas, con el valle de Maravélez para cabalgar hasta el río La Vieja.',
    acts:[['Cabalgata por el valle de Maravélez','Recorridos a caballo de mínimo tres horas entre guaduales, praderas y el río La Vieja.'],
      ['Plaza Nueva','El parque Luis Arango Cardona, con corredor gastronómico y los Willys que van a las veredas.'],
      ['Caminatas y bicicleta','Caminos rurales planos, más fáciles que los del norte del departamento.'],
      ['Fincas y resorts','Buena zona para dormir en finca con piscina, cerca del aeropuerto y de los parques.']],
    how:'Buses frecuentes desde Armenia, unos 20 minutos. Desde el aeropuerto El Edén, cinco minutos en taxi.'}
});

/* ---------- LUGARES NUEVOS ---------- */
PLACES.push(
  {id:'museo', name:'Museo del Oro Quimbaya', zone:'armenia', town:'Armenia', cat:['cultura','familia'], dur:120, lat:4.556, lon:-75.660, typ:22, code:2, alt:'1.480 m aprox.', ph:['museo'],
    tag:'el oro de los quimbayas', desc:'Museo del Banco de la República con piezas de orfebrería y cerámica de la cultura quimbaya, en un edificio premiado de ladrillo y agua.',
    how:'Queda en el norte de Armenia, sobre la avenida Bolívar. Taxi o bus urbano desde el centro.',
    tips:'Revisa horarios y días de cierre antes de ir. Es un buen plan para una tarde de lluvia.',
    todo:['Sala de orfebrería','Arquitectura del edificio','Jardines']},
  {id:'jardin', name:'Jardín Botánico del Quindío', zone:'calarca', town:'Calarcá', cat:['naturaleza','familia'], dur:180, lat:4.520, lon:-75.630, typ:21, code:2, alt:'1.500 m aprox.', ph:['jardin','mariposario'],
    tag:'mariposas en la ciudad', desc:'Reserva natural dentro de Calarcá con senderos, mirador, un zoológico de insectos y uno de los mariposarios más grandes de la región.',
    how:'Desde Armenia, bus urbano o taxi hacia Calarcá, unos 20 minutos.',
    tips:'Ve en la mañana con sol: las mariposas están más activas. Los recorridos suelen ser guiados.',
    todo:['Mariposario','Mirador','Zoológico de insectos','Senderos']},
  {id:'recuca', name:'Recuca', zone:'calarca', town:'Calarcá', cat:['cultura','familia'], dur:240, lat:4.506, lon:-75.620, typ:21, code:2, alt:'1.500 m aprox.', ph:['cafetal2'], phNote:true,
    tag:'vive la cosecha del café', desc:'Recorrido de la Cultura Cafetera: tour interactivo por todo el proceso del café, donde te vistes de recolector y participas en la cosecha.',
    how:'Queda en zona rural de Calarcá. Lo más práctico es ir en taxi o reservar el tour con transporte.',
    tips:'Reserva con anticipación y confirma horarios de los recorridos. Lleva zapatos cerrados.',
    todo:['Cosecha de café','Traje de recolector','Proceso del grano']},
  {id:'calarca', name:'Calarcá', zone:'calarca', town:'Quindío', cat:['pueblo'], dur:120, lat:4.519, lon:-75.643, typ:21, code:2, alt:'1.540 m aprox.', ph:['calarca2','calarca','calarcaVista'],
    tag:'la Villa del Cacique', desc:'Ciudad vecina de Armenia, con plaza animada, catedral de torres puntiagudas y la Fiesta Nacional del Café cada junio.',
    how:'Bus urbano o taxi desde Armenia, 15 a 20 minutos.',
    tips:'Combínala con el Jardín Botánico el mismo día.',
    todo:['Parque principal','Catedral','Vista hacia Armenia']},
  {id:'pijao', name:'Pijao', zone:'pijao', town:'Quindío', cat:['pueblo','naturaleza'], dur:240, lat:4.335, lon:-75.705, typ:20, code:3, alt:'1.600 m aprox.', ph:['pijao','pijao2','pijao3'],
    tag:'el primer pueblo sin prisa de Latinoamérica', desc:'Pueblo Cittaslow desde 2014: plaza de fachadas pastel, balcones con flores y senderos de montaña hacia miradores y bosques de niebla.',
    how:'Buses desde el Terminal de Armenia, unos 40 km al sur.',
    tips:'Ven sin afán: es la idea del pueblo. Para caminatas largas contrata guía local; pregunta en la alcaldía.',
    todo:['Plaza principal','Mirador La Mariela','Cerro Tarapacá','Valle de las Mariposas']},
  {id:'genova', name:'Génova', zone:'genova', town:'Quindío', cat:['pueblo','naturaleza'], dur:180, lat:4.206, lon:-75.790, typ:18, code:3, alt:'1.500 m aprox.', ph:['genova'],
    tag:'el pueblito paisa del Quindío', desc:'El pueblo más al sur del Quindío: fachadas coloniales restauradas, mercado campesino los domingos y montañas para caminar.',
    how:'Buses desde el Terminal de Armenia, alrededor de hora y media.',
    tips:'Ve un domingo para el mercado campesino en la plaza.',
    todo:['Plaza principal','Mercado campesino','Caminatas rurales']},
  {id:'cordoba', name:'Córdoba', zone:'cordoba', town:'Quindío', cat:['pueblo','cultura'], dur:150, lat:4.392, lon:-75.688, typ:20, code:2, alt:'1.350 m aprox.', ph:['cordoba'],
    tag:'susurro de guaduales', desc:'Capital de la guadua en el Quindío: centro de estudio del bambú-guadua, artesanías alrededor de la plaza y cascadas en la parte alta.',
    how:'Buses desde el Terminal de Armenia, cerca de una hora.',
    tips:'Pregunta por el Centro Nacional para el Estudio del Bambú-Guadua y prueba el kumis.',
    todo:['Centro del Bambú-Guadua','Artesanías','Cascadas de La Persia','Kumis']},
  {id:'tebaida', name:'La Tebaida y Maravélez', zone:'tebaida', town:'La Tebaida', cat:['naturaleza','familia'], dur:180, lat:4.453, lon:-75.787, typ:25, code:1, alt:'1.200 m aprox.', ph:['tebaida2','tebaida'],
    tag:'cabalgatas hasta el río La Vieja', desc:'Pueblo cálido junto al aeropuerto, con cabalgatas por el valle de Maravélez entre guaduales y praderas hasta el río La Vieja.',
    how:'Buses frecuentes desde Armenia, unos 20 minutos. Del aeropuerto, cinco minutos en taxi.',
    tips:'Las cabalgatas duran mínimo tres horas: lleva gorra, protector y agua.',
    todo:['Cabalgata en Maravélez','Río La Vieja','Plaza Nueva']}
);

/* ---------- RESTAURANTES NUEVOS ---------- */
FOOD.push(
  {id:'r-casabuho', name:'Casa Búho', zone:'calarca', slot:'cena', dur:80, ph:'hamburguesa', dish:'Hamburguesas y picadas con vista al atardecer',
    desc:'Restaurante bar de Calarcá muy bien valorado: hamburguesas, picadas, coctelería y cerveza, con vista panorámica al atardecer. Admite mascotas.', tips:'Llega antes de que se oculte el sol. Queda en la carrera 23 con calle 39.'},
  {id:'r-calarcaplaza', name:'Cafés del parque de Calarcá', zone:'calarca', slot:'desayuno', dur:40, ph:'arepa', dish:'Arepa, pan y café en la plaza',
    desc:'Alrededor del parque principal de Calarcá hay panaderías y cafeterías tradicionales, buenas para desayunar antes del Jardín Botánico o Recuca.', tips:'Pide arepa con quesito y un tinto: el desayuno de pueblo.'},
  {id:'r-floresta', name:'Café La Floresta', zone:'pijao', slot:'cafe', dur:45, ph:'cafeLeche', dish:'Café de las montañas de Pijao',
    desc:'Café de Pijao que los viajeros describen como una joya escondida del pueblo. Buen lugar para la pausa sin prisa que propone el municipio.', tips:'Pregunta por el origen del café: muchas tazas vienen de fincas del mismo municipio.'},
  {id:'r-pijaomercado', name:'Plaza de mercado de Pijao', zone:'pijao', slot:'almuerzo', dur:60, ph:'trucha', dish:'Trucha al ajillo, arepas y jugos naturales',
    desc:'Para comida tradicional, el mercado cubierto y el asadero de pollo cerca de la plaza, bajando por la calle 11. Cocina sencilla con productos del municipio.', tips:'Almuerza temprano: en pueblos pequeños la cocina cierra pronto.'},
  {id:'r-brisa', name:'El Mirador de la Brisa', zone:'genova', slot:'almuerzo', dur:80, ph:'comida2', dish:'Almuerzo campestre con vista panorámica',
    desc:'Restaurante campestre de Génova con vista panorámica a las montañas del sur del Quindío.', tips:'Confirma cómo llegar: queda en zona campestre.'},
  {id:'r-genovamercado', name:'Mercado campesino de Génova', zone:'genova', slot:'desayuno', dur:45, ph:'arepa', dish:'Productos de las veredas, los domingos',
    desc:'Los domingos la plaza principal se llena de campesinos con frutas, quesos, arepas y productos de las veredas.', tips:'Solo los domingos. Ve temprano para encontrar más variedad.'},
  {id:'r-cordobakumis', name:'Kumis de la plaza de Córdoba', zone:'cordoba', slot:'cafe', dur:30, ph:'cafeLeche', dish:'Kumis, la bebida típica del pueblo',
    desc:'El kumis es lo típico de Córdoba. Lo venden en cafeterías y tiendas alrededor de la plaza principal.', tips:'Acompáñalo con pandebono o arepa.'},
  {id:'r-corredor', name:'Corredor gastronómico de La Tebaida', zone:'tebaida', slot:'cena', dur:70, ph:'chorizo', dish:'Arepas, chorizos, tamales y patacones',
    desc:'En la Plaza Nueva hay un corredor de comida típica: arepas, chorizos, tamales, patacones y chicharrón. Alrededor hay restaurantes como Del Corredor y Rustic.', tips:'Buena cena si duermes cerca del aeropuerto.'}
);

/* ---------- HOSPEDAJES NUEVOS (registro oficial del Quindío) ---------- */
const REG = ' Aparece en el registro oficial de alojamientos del Gobierno del Quindío.';
STAYS.push(
  {id:'h-karlaka', name:'Hotel Karlaká', zone:'calarca', type:'hotel', fam:'hotel', ph:'calarcaVista', good:['Naturaleza','Tranquilidad','Familias'],
    desc:'Hotel en el kilómetro 3 de la vía al Valle, rodeado de naturaleza y tranquilidad, a pocos minutos de Calarcá y Armenia.' + REG, tips:'Buena base para el Jardín Botánico y Recuca.'},
  {id:'h-plazacalarca', name:'Hotel Plaza Calarcá', zone:'calarca', type:'hotel', fam:'hotel', ph:'calarca2', good:['En el centro','Práctico','De paso'],
    desc:'Hotel del centro de Calarcá, práctico para recorrer la ciudad a pie.' + REG, tips:'Cómodo si llegas en bus y sigues al día siguiente.'},
  {id:'h-mahavan', name:'Mahavan Ecoyoga Aldea Hostal', zone:'calarca', type:'hostal', fam:'hostal', ph:'cafetal', good:['Yoga','Naturaleza','Desconectarse'],
    desc:'Hostal de ambiente ecológico y yoga en la zona de Calarcá.' + REG, tips:'Pregunta por las actividades y cómo llegar.'},
  {id:'h-combia', name:'Finca Combia', zone:'calarca', type:'finca', fam:'finca', ph:'cafetal2', good:['Finca cafetera','Paisaje','Parejas'],
    desc:'Finca turística en zona rural de Calarcá, entre cafetales.' + REG, tips:'Confirma si incluye tour de café.'},
  {id:'h-casavictoria', name:'Hostal Casa Victoria', zone:'pijao', type:'hostal', fam:'hostal', ph:'pijao2', good:['Pueblo','Sin prisa','Económico'],
    desc:'Hostal de Pijao recomendado por viajeros para quedarse en el pueblo.' + REG, tips:'Pijao se disfruta mejor durmiendo allí al menos una noche.'},
  {id:'h-tarapaka', name:'Tarapaka Hostel', zone:'pijao', type:'hostal', fam:'hostal', ph:'pijao3', good:['Mochileros','Caminatas','Ambiente viajero'],
    desc:'Hostal de Pijao con nombre del cerro Tarapacá, buena base para caminantes.' + REG, tips:'Pregunta por guías para los senderos.'},
  {id:'h-panorama', name:'Panorama Café B&B', zone:'pijao', type:'hostal', fam:'hostal', ph:'pijao', good:['Desayuno','Vista','Parejas'],
    desc:'Bed & breakfast en Pijao.' + REG, tips:'Confirma si el desayuno está incluido al reservar.'},
  {id:'h-laplaya', name:'Hacienda La Playa Pijao', zone:'pijao', type:'finca', fam:'finca', ph:'cafetal', good:['Finca','Naturaleza','Familias'],
    desc:'Alojamiento rural en una hacienda de Pijao.' + REG, tips:'Queda fuera del pueblo: confirma el transporte.'},
  {id:'h-genovareal', name:'Hotel Génova Real', zone:'genova', type:'hotel', fam:'hotel', ph:'genova', good:['En el centro','Práctico','Familias'],
    desc:'Hotel del centro de Génova, sobre la carrera 12.' + REG, tips:'A pasos de la plaza y del mercado del domingo.'},
  {id:'h-klaret', name:'Hotel Klaret', zone:'genova', type:'hotel', fam:'hotel', ph:'genova', good:['Pueblo','Económico','De paso'],
    desc:'Hotel en el centro de Génova, sobre la carrera 11.' + REG, tips:'Opción sencilla para una o dos noches.'},
  {id:'h-riversidegenova', name:'Alojamiento Riverside', zone:'genova', type:'hostal', fam:'hostal', ph:'quindio', good:['Pueblo','Tranquilidad','Económico'],
    desc:'Alojamiento turístico en Génova.' + REG, tips:'Confirma condiciones directamente con el alojamiento.'},
  {id:'h-losjuanes', name:'Hostal Familiar Los Juanes', zone:'cordoba', type:'hostal', fam:'hostal', ph:'cordoba', good:['Familiar','Pueblo','Económico'],
    desc:'Hostal familiar en Córdoba.' + REG, tips:'Buena opción para conocer el pueblo con calma.'},
  {id:'h-casonaabuela', name:'La Casona de la Abuela', zone:'cordoba', type:'hostal', fam:'hostal', ph:'bahareque', good:['Casa tradicional','Familias','Tranquilidad'],
    desc:'Vivienda turística tipo casona en Córdoba.' + REG, tips:'Confirma capacidad si viajas en grupo.'},
  {id:'h-sonarte', name:'Soñarte Terraza Café', zone:'cordoba', type:'finca', fam:'finca', ph:'cafetal2', good:['Rural','Terraza','Parejas'],
    desc:'Alojamiento rural en Córdoba con terraza.' + REG, tips:'Queda en zona rural: pregunta cómo llegar.'},
  {id:'h-mocawa', name:'Hotel Mocawa Resort', zone:'tebaida', type:'hotel', fam:'hotel', ph:'tebaida2', good:['Resort','Familias','Cerca del aeropuerto'],
    desc:'Resort de La Tebaida, uno de los hoteles más conocidos del municipio, cerca del aeropuerto El Edén.' + REG, tips:'Práctico para la primera o la última noche del viaje.'},
  {id:'h-miradorpalmas', name:'Hotel Mirador Las Palmas', zone:'tebaida', type:'hotel', fam:'hotel', ph:'tebaida', good:['Familias','Piscina','Cerca del aeropuerto'],
    desc:'Hotel popular de La Tebaida.' + REG, tips:'Confirma servicios y cómo llegar al reservar.'},
  {id:'h-herencia', name:'Hotel La Herencia', zone:'tebaida', type:'hotel', fam:'hotel', ph:'tebaida', good:['Casas de huéspedes','Grupos','Familias'],
    desc:'Hotel con casas de huéspedes en La Tebaida.' + REG, tips:'Buena opción para grupos grandes.'},
  {id:'h-maravelez', name:'Hacienda Alojamiento Maravélez', zone:'tebaida', type:'finca', fam:'finca', ph:'tebaida2', good:['Hacienda','Cabalgatas','Naturaleza'],
    desc:'Alojamiento rural en el valle de Maravélez, la zona de cabalgatas hacia el río La Vieja.' + REG, tips:'Pregunta si organizan cabalgatas.'}
);

/* ---------- CUÁNDO IR ---------- */
const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
/* s = seca, t = transición, l = lluvias · a = temporada alta de turistas */
const SEASON = [
  {w:'s', a:true}, {w:'s'}, {w:'t'}, {w:'l'}, {w:'l'}, {w:'s', a:true},
  {w:'s', a:true}, {w:'s'}, {w:'t'}, {w:'l'}, {w:'l'}, {w:'s', a:true}
];
const EVENTS = [
  {when:'Junio', month:5, town:'calarca', name:'Fiesta Nacional del Café', desc:'Reinado Nacional del Café, desfiles y conciertos en Calarcá durante la segunda mitad de junio.'},
  {when:'Octubre', month:9, town:'armenia', name:'Fiestas de Armenia y Desfile del Yipao', desc:'Fiestas aniversarias en la primera quincena de octubre. El Desfile del Yipao muestra Willys cargados hasta el techo.'},
  {when:'7 y 8 de diciembre', month:11, town:'quimbaya', name:'Festival de Velas y Faroles', desc:'Las calles de Quimbaya compiten por la mejor iluminación hecha a mano. Llega temprano.'},
  {when:'Todos los domingos', month:-1, town:'genova', name:'Mercado campesino de Génova', desc:'Productos de las veredas en la plaza principal.'},
  {when:'Semana Santa y festivos', month:-1, town:'salento', name:'Temporada alta', desc:'Salento, el Cocora y los parques se llenan. Reserva hospedaje antes y madruga.'}
];

/* ---------- CÓMO MOVERSE (tarifas aprox. 2026, pesos colombianos) ---------- */
const FARES = [
  {route:'Armenia → Salento', how:'Bus desde el Terminal', time:'1 h', price:'desde $5.300'},
  {route:'Armenia → Filandia', how:'Bus desde el Terminal', time:'45 min a 1 h', price:'$7.200 a $8.000'},
  {route:'Filandia → Circasia', how:'Bus', time:'20 min', price:'$5.700 aprox.'},
  {route:'Armenia → Quimbaya', how:'Bus desde el Terminal', time:'45 min', price:'$6.900 aprox.'},
  {route:'Salento → Valle del Cocora', how:'Willys desde la plaza', time:'30 min', price:'$5.000 a $10.000 por trayecto'},
  {route:'Senderos del Cocora', how:'Paso por fincas privadas', time:'—', price:'$5.000 a $6.000 por punto, en efectivo'},
  {route:'Cabalgata en el Cocora', how:'Operadores en el valle', time:'según el circuito', price:'desde $60.000'}
];
