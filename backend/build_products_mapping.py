from pathlib import Path
import unicodedata, re

BASE = Path(__file__).resolve().parent
uploads_term = BASE / 'uploads' / 'productos' / 'terminados'
uploads_prep = BASE / 'uploads' / 'productos' / 'de preparacion'

def normalize(s):
    s = unicodedata.normalize('NFKD', s)
    s = s.encode('ascii', 'ignore').decode('ascii')
    s = re.sub('[^a-z0-9]+', '', s.lower())
    return s

term_files = {normalize(p.name): p.name for p in uploads_term.iterdir() if p.is_file()}
prep_files = {normalize(p.name): p.name for p in uploads_prep.iterdir() if p.is_file()}

# List of desired products (from user)
products = [
'Canelazo','Sangría Blanca','Mimosa','Irish Coffee','Dark and Stormy','Clover Club','Mint Julep','Daiquiri Clásico','Black Russian','White Russian','Pisco Sour','Tequila Sour','Bellini','Sex on the Beach','Tom Collins','Moscow Mule','Martini Seco','Manhattan','Cosmopolitan','Crema Irlandesa Casera','Limoncello Macerado','Agua Fresca de Jamaica','Carajillo','Michelada','Chilcano de Pisco','Gin Tonic','Sangría','Bloody Mary','Caipirinha','Cuba Libre','Paloma','Aperol Spritz','Negroni','Tequila Sunrise','Daiquiri de Fresa','Old Fashioned','Piña Colada','Mojito Cubano','Whisky en Rocas','Cocoloco','Margarita Clásica',
# terminar terminos
'Cerveza Pilsen','Black And White','Ginebra Botanica 750ml','Vodka Citrus 700ml','Vodka Cristal 700ml','Tequila Reposado Sierra 750ml','Tequila Agave Azul 750ml','Cerveza Negra Porter 330ml','Cerveza Roja Artesanal 330ml','Cerveza Rubia Artesanal 330ml','Espumoso Brisa Rosa 750ml','Vino Blanco Monteluna 750ml','Vino Tinto Casa Vieja 750ml','Ron Anejo Gran Barrica 750ml','Ron Caribe Dorado 750ml','Whisky Reserva Roble 750ml','Whisky Andino 750ml'
]

mapping = {}
for prod in products:
    key = normalize(prod)
    if key in prep_files:
        mapping[prod] = '/uploads/productos/de preparacion/' + prep_files[key]
    elif key in term_files:
        mapping[prod] = '/uploads/productos/terminados/' + term_files[key]
    else:
        # fuzzy fallback: find any file with normalized name substring
        found = None
        for nk,fn in {**prep_files, **term_files}.items():
            if key in nk or nk in key:
                found = fn
                break
        mapping[prod] = ('MISSING', found)

for p,v in mapping.items():
    print(p, '=>', v)

# write mapping
(Path(__file__).resolve().parent / 'product_image_mapping.txt').write_text('\n'.join(f"{p} => {v}" for p,v in mapping.items()), encoding='utf-8')
print('WROTE product_image_mapping.txt')
