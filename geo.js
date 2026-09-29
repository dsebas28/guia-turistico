/* ============================================================
   RUTA VERDE — UBICACIÓN EXACTA DE RESTAURANTES Y HOSPEDAJES
   Buscada una sola vez en OpenStreetMap (Nominatim) y revisada a mano: solo quedan los que
   coinciden en nombre y pueblo. Los que no están aquí se muestran en el centro de su pueblo.
   Para agregar o corregir uno: id:[latitud, longitud] (en Google Maps, clic derecho sobre el sitio).
   ============================================================ */
const GEO = {
  "r-jesus":[4.63722, -75.57067],
  "r-andrea":[4.6384, -75.56873],
  "r-laurita":[4.63805, -75.56996],
  "r-cuesta":[4.63707, -75.5693],
  "r-martina":[4.6391, -75.56739],
  "r-helena":[4.67638, -75.65761],
  "r-jose":[4.67508, -75.657],
  "r-mocafe":[4.6767, -75.65869],
  "r-bakuru":[4.67469, -75.6588],
  "r-constitucion":[4.53234, -75.67144],
  "r-estacion":[4.47031, -75.76381],
  "r-fogata":[4.5537, -75.65765],
  "r-gualandu":[4.52605, -75.77654],
  "r-rioazul":[4.36015, -75.73918],
  "r-sanalberto":[4.35843, -75.73447],
  "r-floresta":[4.33463, -75.70457],
  "h-salentoreal":[4.63945, -75.56892],
  "h-viajero":[4.63476, -75.57023],
  "h-colina":[4.67331, -75.6585],
  "h-armeniahotel":[4.54903, -75.65993],
  "h-decameron":[4.60871, -75.82451],
  "h-karlaka":[4.50047, -75.66722],
  "h-combia":[4.49776, -75.67751],
  "h-casavictoria":[4.33674, -75.70418],
  "h-genovareal":[4.20786, -75.78908],
  "h-mocawa":[4.44639, -75.81343],
  "h-herencia":[4.47973, -75.76566],
  /* agregados después, buscados en OpenStreetMap (Overpass y Photon) y revisados a mano */
  "r-robles":[4.6747, -75.59858],
  "r-parquefood":[4.53848, -75.76773],
  "r-concorde":[4.36531, -75.71765],
  "h-coffeetree":[4.63431, -75.57124],
  "h-piedemonte":[4.64508, -75.58342],
  "h-bidea":[4.67314, -75.65679],
  "h-balsora":[4.71105, -75.61045],
  "h-bremen":[4.63004, -75.61689],
  "h-orquideas":[4.61744, -75.63375],
  "h-lacima":[4.35205, -75.73896],
  "h-tarapaka":[4.33531, -75.70306],
  "h-tukawa":[4.61545, -75.71718]
};
