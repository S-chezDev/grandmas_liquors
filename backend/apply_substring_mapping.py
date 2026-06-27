from pathlib import Path
import unicodedata, re

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

file_norms = [(rel, normalize(noext), orig) for rel,noext,orig in all_files]

# desired products from user's list
products = [
'Canelazo','Sangría Blanca','Mimosa','Irish Coffee','Dark and Stormy','Clover Club','Mint Julep','Daiquiri Clásico','Black Russian','White Russian','Pisco Sour','Tequila Sour','Bellini','Sex on the Beach','Tom Collins','Moscow Mule','Martini Seco','Manhattan','Cosmopolitan','Crema Irlandesa Casera','Limoncello Macerado','Agua Fresca de Jamaica','Carajillo','Michelada','Chilcano de Pisco','Gin Tonic','Sangría','Bloody Mary','Caipirinha','Cuba Libre','Paloma','Aperol Spritz','Negroni','Tequila Sunrise','Daiquiri de Fresa','Old Fashioned','Piña Colada','Mojito Cubano','Whisky en Rocas','Cocoloco','Margarita Clásica',
'Cerveza Pilsen','Black And White','Ginebra Botanica 750ml','Vodka Citrus 700ml','Vodka Cristal 700ml','Tequila Reposado Sierra 750ml','Tequila Agave Azul 750ml','Cerveza Negra Porter 330ml','Cerveza Roja Artesanal 330ml','Cerveza Rubia Artesanal 330ml','Espumoso Brisa Rosa 750ml','Vino Blanco Monteluna 750ml','Vino Tinto Casa Vieja 750ml','Ron Anejo Gran Barrica 750ml','Ron Caribe Dorado 750ml','Whisky Reserva Roble 750ml','Whisky Andino 750ml'
]

text = DB_FILE.read_text(encoding='utf-8')
start = text.find('INSERT INTO productos')
end = text.find('-- Actualizar secuencia')
block = text[start:end]
lines = block.splitlines()
header = lines[0]
rows = lines[1:]

# regex to find product name and current image
row_re = re.compile(r"^\((?P<id>\d+),\s*'(?P<name>[^']+)'(?P<mid>.*?),(?P<imgpart>\s*'(/uploads/productos/[^']+)'|\s*NULL)\)(?P<tail>,?)$", re.UNICODE)

updated = []
changes = []
for row in rows:
    m = row_re.match(row.strip())
    if not m:
        updated.append(row)
        continue
    name = m.group('name')
    imgpart = m.group('imgpart').strip()
    key = normalize(name)
    # try substring match
    found = None
    for rel,fn,orig in file_norms:
        if key in fn or fn in key:
            found = rel
            break
    if found:
        new_img = '/' + found
        new_img_literal = "'{}'".format(new_img)
        if imgpart != new_img_literal:
            new_row = row[:m.start('imgpart')] + ' ' + new_img_literal + ')' + (m.group('tail') or '')
            updated.append(new_row)
            changes.append((name, imgpart, new_img))
            continue
    updated.append(row)

new_block = '\n'.join([header] + updated)
new_text = text[:start] + new_block + text[end:]
DB_FILE.write_text(new_text, encoding='utf-8')
print(f'Applied {len(changes)} substring mappings.')
for name, old, new in changes:
    print(f"{name} -> {new}")

# show remaining seed_ occurrences
seed_lines = [line for line in new_text.splitlines() if 'seed_' in line]
print('\nRemaining seed_ references:', len(seed_lines))
for l in seed_lines:
    print(l.strip())
