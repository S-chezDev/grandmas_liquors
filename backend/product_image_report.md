# Reporte de mapeo de imágenes (auto)

Fecha: 2026-06-26

Resumen:

- Coincidencias fuzzy aplicadas: 17
- Coincidencias por substring aplicadas: 28
- Total rutas actualizadas en `db.pgsql`: 45
- Referencias restantes con `seed_*.webp`: 60

---

## Coincidencias fuzzy aplicadas (ejemplos)

- Whisky Andino 750ml -> /productos/terminados/WhiskyAndino750ml 2026-06-26 at 8.05.15 PM.jpeg (score 0.667)
- Whisky Reserva Roble 750ml -> /productos/terminados/WhiskyReservaRoble750ml2026-06-26 at 8.04.31 PM.jpeg (score 0.730)
- Ron Caribe Dorado 750ml -> /productos/terminados/Roncaribedorado750ml2026-06-26 at 8.03.51 PM.jpeg (score 0.702)
- Vino Tinto Casa Vieja 750ml -> /productos/terminados/Vinotintocasavieja750ml2026-06-26 at 8.00.12 PM.jpeg (score 0.730)
- Espumoso Brisa Rosa 750ml -> /productos/terminados/Espumosobrisarosa750ml2026-06-26 at 7.57.05 PM.jpeg (score 0.721)
- ... (ver script para lista completa)

## Coincidencias por substring aplicadas (ejemplos)

- Cerveza Pilsen -> /productos/terminados/CervezaPilsen330ml2026-06-26 at 7.33.46 PM.jpeg
- Black And White -> /productos/terminados/Blackandwhite1000ml2026-06-26 at 7.34.55 PM.jpeg
- Cocoloco -> /productos/de preparacion/Cocoloco2026-06-26 at 7.39.49 PM.jpeg
- Piña Colada -> /productos/de preparacion/piñacolada Image 2026-06-26 at 7.45.32 PM.jpeg
- Old Fashioned -> /productos/de preparacion/Oldfashioned 2026-06-26 at 7.52.15 PM.jpeg
- ... (ver script para lista completa)

## Productos sin imagen o con baja confianza

A continuación, la lista de productos que todavía referencian `seed_*.webp` o que tuvieron coincidencias de baja confianza (mejor candidata y score si aplica):

- Tequila Reposado Sierra 750ml: best_score=0.635, candidate=productos/terminados/tequilaReposado750ml2026-06-26 at 7.43.59 PM.jpeg
- Tequila Base: best_score=0.429, candidate=productos/de preparacion/TequilaSunrise2026-06-26 at 7.58.14 PM.jpeg
- Triple Sec Base: best_score=0.360, candidate=productos/de preparacion/Cremairlandesacasera 2026-06-26 at 8.26.58 PM.jpeg
- Jugo de Limon: best_score=0.250, candidate=productos/de preparacion/Oldfashioned 2026-06-26 at 7.52.15 PM.jpeg
- Sal x kg: best_score=0.200, candidate=productos/de preparacion/Sangría2026-06-26 at 8.12.54 PM.jpeg
- Ron Blanco Base: best_score=0.320, candidate=productos/de preparacion/Cremairlandesacasera 2026-06-26 at 8.26.58 PM.jpeg
- Crema de Coco: best_score=0.333, candidate=productos/de preparacion/Cremairlandesacasera 2026-06-26 at 8.26.58 PM.jpeg
- Jugo de Pina: best_score=0.278, candidate=productos/de preparacion/Mintjulep2026-06-26 at 7.54.43 PM.jpeg
- Leche Condensada: best_score=0.293, candidate=productos/de preparacion/Michelada2026-06-26 at 8.21.32 PM.jpeg
- Whisky Base: best_score=0.400, candidate=productos/de preparacion/whiskyenrocas2026-06-26 at 7.49.44 PM.jpeg
- Hielo Bolsas: best_score=0.293, candidate=productos/de preparacion/whiskyenrocas2026-06-26 at 7.49.44 PM.jpeg
- Hierbabuena Fresca: best_score=0.340, candidate=productos/de preparacion/AguafrescadeJamaica 2026-06-26 at 8.24.26 PM.jpeg
- Lima Unidad: best_score=0.293, candidate=productos/de preparacion/TequilaSunrise2026-06-26 at 7.58.14 PM.jpeg
- Azucar x kg: best_score=0.195, candidate=productos/de preparacion/Daiquiriclásico2026-06-26 at 7.57.12 PM.jpeg
- Soda Lata 300ml: best_score=0.400, candidate=productos/de preparacion/BloodyMary2026-06-26 at 9.09.02 PM.jpeg
- Amargo de Angostura: best_score=0.333, candidate=productos/de preparacion/Cremairlandesacasera 2026-06-26 at 8.26.58 PM.jpeg
- Naranja Unidad: best_score=0.296, candidate=productos/terminados/Ronañejogranbarrica750ml2026-06-26 at 8.01.33 PM.jpeg
- Fresas Frescas: best_score=0.286, candidate=productos/de preparacion/AguafrescadeJamaica 2026-06-26 at 8.24.26 PM.jpeg
- Jugo de Naranja: best_score=0.286, candidate=productos/terminados/VodkaCristal2026-06-26 at 9.26.26 PM.jpeg
- Granadina Jarabe: best_score=0.275, candidate=productos/de preparacion/AguafrescadeJamaica 2026-06-26 at 8.24.26 PM.jpeg
- Ginebra Base: best_score=0.375, candidate=productos/terminados/Ginebrabotánica750ml2026-06-26 at 7.37.19 PM.jpeg
- Campari Base: best_score=0.316, candidate=productos/de preparacion/Caipirinha2026-06-26 at 8.06.29 PM.jpeg
- Vermut Rojo Base: best_score=0.270, candidate=productos/de preparacion/mojito2026-06-26 at 7.41.34 PM.jpeg
- Prosecco Botella: best_score=0.321, candidate=productos/terminados/Vinoblancomonteluna750ml 2026-06-26 at 7.57.59 PM.jpeg
- Cola Lata 300ml: best_score=0.429, candidate=productos/de preparacion/Cosmopolitan 2026-06-26 at 8.23.10 PM.jpeg
- Cachaca Base: best_score=0.292, candidate=productos/de preparacion/Cremairlandesacasera 2026-06-26 at 8.26.58 PM.jpeg
- Vodka Base: best_score=0.316, candidate=productos/terminados/VodkaCristal2026-06-26 at 9.26.26 PM.jpeg
- Jugo de Tomate: best_score=0.286, candidate=productos/de preparacion/mojito2026-06-26 at 7.41.34 PM.jpeg
- Especias Varias: best_score=0.318, candidate=productos/de preparacion/AperolSpiritz2026-06-26 at 8.00.24 PM.jpeg
- Apio Unidad: best_score=0.308, candidate=productos/de preparacion/Oldfashioned 2026-06-26 at 7.52.15 PM.jpeg
- Vino Tinto Base: best_score=0.453, candidate=productos/terminados/Vinotintocasavieja750ml2026-06-26 at 8.00.12 PM.jpeg
- Frutas Varias: best_score=0.279, candidate=productos/de preparacion/TequilaSunrise2026-06-26 at 7.58.14 PM.jpeg
- Brandy Base: best_score=0.300, candidate=productos/de preparacion/darkandsrormy2026-06-26 at 7.51.26 PM.jpeg
- Agua Tonica Lata: best_score=0.410, candidate=productos/de preparacion/Gintonic2026-06-26 at 8.17.38 PM.jpeg
- Enebro Bayas: best_score=0.293, candidate=productos/de preparacion/Sexonthebeach2026-06-26 at 8.13.04 PM.jpeg
- Pisco Base: best_score=0.293, candidate=productos/de preparacion/piñacolada Image 2026-06-26 at 7.45.32 PM.jpeg
- Ginger Ale Lata: best_score=0.360, candidate=productos/terminados/Ginebrabotánica750ml2026-06-26 at 7.37.19 PM.jpeg
- Cerveza Base: best_score=0.391, candidate=productos/terminados/CervezaPilsen330ml2026-06-26 at 7.33.46 PM.jpeg
- Salsa Picante: best_score=0.333, candidate=productos/de preparacion/AperolSpiritz2026-06-26 at 8.00.24 PM.jpeg
- Licor 43 Base: best_score=0.270, candidate=productos/de preparacion/Cubalibre2026-06-26 at 8.04.30 PM.jpeg
- Cafe Expreso: best_score=0.238, candidate=productos/de preparacion/Daquiridefresa2026-06-26 at 7.54.41 PM.jpeg
- Flor de Jamaica: best_score=0.449, candidate=productos/de preparacion/AguafrescadeJamaica 2026-06-26 at 8.24.26 PM.jpeg
- Agua Purificada: best_score=0.360, candidate=productos/de preparacion/AguafrescadeJamaica 2026-06-26 at 8.24.26 PM.jpeg
- Clara de Huevo: best_score=0.298, candidate=productos/de preparacion/Limoncellomacerado2026-06-26 at 8.27.52 PM.jpeg
- Crema de Leche: best_score=0.327, candidate=productos/de preparacion/Cremairlandesacasera 2026-06-26 at 8.26.58 PM.jpeg
- Almibar Simple: best_score=0.308, candidate=productos/de preparacion/Cubalibre2026-06-26 at 8.04.30 PM.jpeg
- Jugo de Arandano: best_score=0.318, candidate=productos/de preparacion/darkandsrormy2026-06-26 at 7.51.26 PM.jpeg
- Licor de Durazno: best_score=0.327, candidate=productos/de preparacion/Limoncellomacerado2026-06-26 at 8.27.52 PM.jpeg
- Pure de Durazno: best_score=0.245, candidate=productos/de preparacion/AguafrescadeJamaica 2026-06-26 at 8.24.26 PM.jpeg
- Menta Fresca: best_score=0.298, candidate=productos/de preparacion/AguafrescadeJamaica 2026-06-26 at 8.24.26 PM.jpeg
- Jarabe de Frambuesa: best_score=0.375, candidate=productos/de preparacion/Daquiridefresa2026-06-26 at 7.54.41 PM.jpeg
- Ron Oscuro Base: best_score=0.292, candidate=productos/de preparacion/Limoncellomacerado2026-06-26 at 8.27.52 PM.jpeg
- Cerveza de Jengibre: best_score=0.351, candidate=productos/terminados/CervezaNegraPorter330ml2026-06-26 at 7.49.06 PM.jpeg
- Canela Astillas: best_score=0.350, candidate=productos/de preparacion/Carajillo2026-06-26 at 8.23.28 PM.jpeg
- Panela Bloque: best_score=0.255, candidate=productos/de preparacion/Limoncellomacerado2026-06-26 at 8.27.52 PM.jpeg
- Limon Unidad: best_score=0.304, candidate=productos/de preparacion/Limoncellomacerado2026-06-26 at 8.27.52 PM.jpeg
- Esencia de Vainilla: best_score=0.340, candidate=productos/de preparacion/AguafrescadeJamaica 2026-06-26 at 8.24.26 PM.jpeg
- Margarita Clásica: best_score=0.417, candidate=productos/de preparacion/Daiquiriclásico2026-06-26 at 7.57.12 PM.jpeg
- Cocoloco: best_score=0.485, candidate=productos/de preparacion/Cocoloco2026-06-26 at 7.39.49 PM.jpeg
- Whisky en Rocas: best_score=0.605, candidate=productos/de preparacion/whiskyenrocas2026-06-26 at 7.49.44 PM.jpeg
- Mojito Cubano: best_score=0.400, candidate=productos/de preparacion/mojito2026-06-26 at 7.41.34 PM.jpeg
- Daiquiri de Fresa: best_score=0.609, candidate=productos/de preparacion/Daquiridefresa2026-06-26 at 7.54.41 PM.jpeg
- Tequila Sunrise: best_score=0.622, candidate=productos/de preparacion/TequilaSunrise2026-06-26 at 7.58.14 PM.jpeg
- Negroni: best_score=0.452, candidate=productos/de preparacion/negroni2026-06-26 at 7.47.47 PM.jpeg
- Aperol Spritz: best_score=0.571, candidate=productos/de preparacion/AperolSpiritz2026-06-26 at 8.00.24 PM.jpeg
- Paloma: best_score=0.414, candidate=productos/de preparacion/Paloma2026-06-26 at 8.02.20 PM.jpeg
- Cuba Libre: best_score=0.514, candidate=productos/de preparacion/Cubalibre2026-06-26 at 8.04.30 PM.jpeg
- Caipirinha: best_score=0.541, candidate=productos/de preparacion/Caipirinha2026-06-26 at 8.06.29 PM.jpeg
- Bloody Mary: best_score=0.541, candidate=productos/de preparacion/BloodyMary2026-06-26 at 9.09.02 PM.jpeg
- Sangría: best_score=0.452, candidate=productos/de preparacion/Sangría2026-06-26 at 8.12.54 PM.jpeg
- Gin Tonic: best_score=0.485, candidate=productos/de preparacion/Gintonic2026-06-26 at 8.17.38 PM.jpeg
- Chilcano de Pisco: best_score=0.293, candidate=productos/de preparacion/Michelada2026-06-26 at 8.21.32 PM.jpeg
- Michelada: best_score=0.514, candidate=productos/de preparacion/Michelada2026-06-26 at 8.21.32 PM.jpeg
- Carajillo: best_score=0.514, candidate=productos/de preparacion/Carajillo2026-06-26 at 8.23.28 PM.jpeg
- Cosmopolitan: best_score=0.585, candidate=productos/de preparacion/Cosmopolitan 2026-06-26 at 8.23.10 PM.jpeg
- Manhattan: best_score=0.514, candidate=productos/de preparacion/Manhattan2026-06-26 at 8.20.23 PM.jpeg
- Martini Seco: best_score=0.564, candidate=productos/de preparacion/Martiniseco2026-06-26 at 8.19.17 PM.jpeg
- Moscow Mule: best_score=0.435, candidate=productos/de preparacion/Moscowmulevaso250ml2026-06-26 at 8.17.24 PM.jpeg
- Tom Collins: best_score=0.541, candidate=productos/de preparacion/Tom collins2026-06-26 at 8.13.58 PM.jpeg
- Sex on the Beach: best_score=0.605, candidate=productos/de preparacion/Sexonthebeach2026-06-26 at 8.13.04 PM.jpeg
- Bellini: best_score=0.235, candidate=productos/de preparacion/Tom collins2026-06-26 at 8.13.58 PM.jpeg
- Tequila Sour: best_score=0.564, candidate=productos/de preparacion/Tequilasour2026-06-26 at 8.05.49 PM.jpeg
- Pisco Sour: best_score=0.270, candidate=productos/de preparacion/Tequilasour2026-06-26 at 8.05.49 PM.jpeg
- White Russian: best_score=0.585, candidate=productos/de preparacion/Whiterussian2026-06-26 at 8.01.30 PM.jpeg
- Black Russian: best_score=0.585, candidate=productos/de preparacion/Blackrussian 2026-06-26 at 7.59.26 PM.jpeg
- Daiquiri Clásico: best_score=0.638, candidate=productos/de preparacion/Daiquiriclásico2026-06-26 at 7.57.12 PM.jpeg
- Mint Julep: best_score=0.514, candidate=productos/de preparacion/Mintjulep2026-06-26 at 7.54.43 PM.jpeg
- Clover Club: best_score=0.541, candidate=productos/de preparacion/Cloverclub2026-06-26 at 7.51.57 PM.jpeg
- Dark and Stormy: best_score=0.558, candidate=productos/de preparacion/darkandsrormy2026-06-26 at 7.51.26 PM.jpeg
- Irish Coffee: best_score=0.526, candidate=productos/de preparacion/irishcoffe 2026-06-26 at 7.48.08 PM.jpeg
- Mimosa: best_score=0.400, candidate=productos/de preparacion/moimosa2026-06-26 at 7.45.20 PM.jpeg
- Sangría Blanca: best_score=0.432, candidate=productos/de preparacion/Sangría2026-06-26 at 8.12.54 PM.jpeg

---

## Recomendaciones

- Para los `insumo` (seed_) es normal mantener placeholders si no tienes imágenes para insumos; no es crítico para el catálogo visual.
- Para las `preparacion` y `terminado` con baja confianza:
  - Sube imágenes con nombres que normalicen bien (sin tildes, con el nombre exacto o sufijos como "330ml") para que el script pueda emparejarlas.
  - Alternativa rápida: asigno una imagen placeholder genérica (`/uploads/productos/placeholder.webp`) a todos los que queden con `seed_*.webp`.

---

Archivo generado: `backend/product_image_report.md`
