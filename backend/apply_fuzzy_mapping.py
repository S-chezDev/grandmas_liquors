from pathlib import Path
import unicodedata, re
from difflib import SequenceMatcher

BASE = Path(__file__).resolve().parent
DB_FILE = BASE / 'db.pgsql'
uploads_root = BASE / 'uploads' / 'productos'

def normalize(s: str) -> str:
    s = unicodedata.normalize('NFKD', s)
    s = s.encode('ascii', 'ignore').decode('ascii')
    s = re.sub('[^a-z0-9]+', '', s.lower())
    return s

# collect all upload files (prep and term)
all_files = []
for p in uploads_root.rglob('*'):
    if p.is_file():
        rel = p.relative_to(BASE / 'uploads').as_posix()  # e.g. productos/de preparacion/Name.jpg
        name_no_ext = re.sub(r"\.[^.]+$", '', p.name)
        all_files.append((rel, name_no_ext, p.name))

print(f'Found {len(all_files)} uploaded product files to match against')

# desired product list (same as before)
products = [
'Canelazo','Sangría Blanca','Mimosa','Irish Coffee','Dark and Stormy','Clover Club','Mint Julep','Daiquiri Clásico','Black Russian','White Russian','Pisco Sour','Tequila Sour','Bellini','Sex on the Beach','Tom Collins','Moscow Mule','Martini Seco','Manhattan','Cosmopolitan','Crema Irlandesa Casera','Limoncello Macerado','Agua Fresca de Jamaica','Carajillo','Michelada','Chilcano de Pisco','Gin Tonic','Sangría','Bloody Mary','Caipirinha','Cuba Libre','Paloma','Aperol Spritz','Negroni','Tequila Sunrise','Daiquiri de Fresa','Old Fashioned','Piña Colada','Mojito Cubano','Whisky en Rocas','Cocoloco','Margarita Clásica',
'Cerveza Pilsen','Black And White','Ginebra Botanica 750ml','Vodka Citrus 700ml','Vodka Cristal 700ml','Tequila Reposado Sierra 750ml','Tequila Agave Azul 750ml','Cerveza Negra Porter 330ml','Cerveza Roja Artesanal 330ml','Cerveza Rubia Artesanal 330ml','Espumoso Brisa Rosa 750ml','Vino Blanco Monteluna 750ml','Vino Tinto Casa Vieja 750ml','Ron Anejo Gran Barrica 750ml','Ron Caribe Dorado 750ml','Whisky Reserva Roble 750ml','Whisky Andino 750ml'
]

# prepare normalized names for files
file_norms = [(rel, normalize(noext), orig) for rel,noext,orig in all_files]

# read db and find product rows
text = DB_FILE.read_text(encoding='utf-8')
start = text.find('INSERT INTO productos')
end = text.find('-- Actualizar secuencia')
block = text[start:end]
lines = block.splitlines()
header = lines[0]
rows = lines[1:]

# regex to find product name and current image (last quoted /uploads/... or NULL)
row_re = re.compile(r"^\((?P<id>\d+),\s*'(?P<name>[^']+)'(?P<mid>.*?),(?P<imgpart>\s*'(/uploads/productos/[^']+)'|\s*NULL)\)(?P<tail>,?)$", re.UNICODE)

updated = []
changes = []
unmatched = []
for row in rows:
    m = row_re.match(row.strip())
    if not m:
        updated.append(row)
        continue
    pid = m.group('id')
    name = m.group('name')
    imgpart = m.group('imgpart').strip()
    # decide whether to try mapping: if img is seed_ or NULL or points to seed_
    try_map = False
    if 'seed_' in imgpart or imgpart == 'NULL':
        try_map = True
    # also map if product in desired list
    in_desired = name in products
    if not try_map and not in_desired:
        updated.append(row)
        continue
    # find best file match
    key = normalize(name)
    best = (0.0, None)
    for rel,fn,orig in file_norms:
        score = SequenceMatcher(None, key, fn).ratio()
        if score > best[0]:
            best = (score, rel)
    if best[0] >= 0.65:
        new_img = '/' + best[1]
        new_img_literal = "'{}'".format(new_img)
        new_row = row[:m.start('imgpart')] + ' ' + new_img_literal + ')' + (m.group('tail') or '')
        updated.append(new_row)
        changes.append((name, imgpart, new_img, best[0]))
    else:
        updated.append(row)
        unmatched.append((name, best))

new_block = '\n'.join([header] + updated)
new_text = text[:start] + new_block + text[end:]
DB_FILE.write_text(new_text, encoding='utf-8')
print(f'Applied {len(changes)} fuzzy mappings (threshold 0.65).')
for name, old, new, score in changes:
    print(f"{name} -> {new} (score {score:.3f})")

print('\nUnmatched or low-confidence products:')
for name, (score, rel) in unmatched:
    print(f"{name}: best_score={score:.3f}, candidate={'None' if rel is None else rel}")
