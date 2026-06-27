from pathlib import Path
import unicodedata, re

BASE = Path(__file__).resolve().parent
DB_FILE = BASE / 'db.pgsql'
uploads_term = BASE / 'uploads' / 'productos' / 'terminados'
uploads_prep = BASE / 'uploads' / 'productos' / 'de preparacion'

def normalize(s):
    s = unicodedata.normalize('NFKD', s)
    s = s.encode('ascii', 'ignore').decode('ascii')
    s = re.sub('[^a-z0-9]+', '', s.lower())
    return s

term_files = {normalize(p.name): p.name for p in uploads_term.iterdir() if p.is_file()} if uploads_term.exists() else {}
prep_files = {normalize(p.name): p.name for p in uploads_prep.iterdir() if p.is_file()} if uploads_prep.exists() else {}

products = [
'Canelazo','Sangría Blanca','Mimosa','Irish Coffee','Dark and Stormy','Clover Club','Mint Julep','Daiquiri Clásico','Black Russian','White Russian','Pisco Sour','Tequila Sour','Bellini','Sex on the Beach','Tom Collins','Moscow Mule','Martini Seco','Manhattan','Cosmopolitan','Crema Irlandesa Casera','Limoncello Macerado','Agua Fresca de Jamaica','Carajillo','Michelada','Chilcano de Pisco','Gin Tonic','Sangría','Bloody Mary','Caipirinha','Cuba Libre','Paloma','Aperol Spritz','Negroni','Tequila Sunrise','Daiquiri de Fresa','Old Fashioned','Piña Colada','Mojito Cubano','Whisky en Rocas','Cocoloco','Margarita Clásica',
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
        mapping[prod] = (None if not found else ('/uploads/productos/de preparacion/' if nk in prep_files else '/uploads/productos/terminados/') + found)

text = DB_FILE.read_text(encoding='utf-8')
start_idx = text.find('INSERT INTO productos')
end_idx = text.find('-- Actualizar secuencia')
if start_idx == -1 or end_idx == -1:
    print('Could not find product insert block boundaries in db.pgsql')
    raise SystemExit(1)
block = text[start_idx:end_idx]
lines = block.splitlines()
header = lines[0]
rows = lines[1:]

# Regex to capture imagen_url which is the last quoted /uploads/... or NULL before closing parenthesis
row_re = re.compile(r"^\((?P<id>\d+),\s*'(?P<name>[^']+)'(?P<mid>.*?),\s*(?P<img>'/uploads/productos/[^']*'|NULL)\)\s*(?P<tail>,?)$", re.UNICODE)

updated = []
changes = []
missing_images = []
found_products = set()
for row in rows:
    line = row.rstrip()
    m = row_re.match(line.strip())
    if not m:
        updated.append(row)
        continue
    name = m.group('name')
    img = m.group('img')
    tail = m.group('tail')
    found_products.add(name)
    if name in mapping:
        new = mapping[name]
        if new:
            new_img_literal = "'{}'".format(new)
            if img != new_img_literal:
                new_row = line[:m.start('img')] + new_img_literal + line[m.end('img'):]
                updated.append(new_row)
                changes.append((name, img, new_img_literal))
                continue
        else:
            missing_images.append(name)
    updated.append(row)

new_block = '\n'.join([header] + updated)
new_text = text[:start_idx] + new_block + text[end_idx:]
DB_FILE.write_text(new_text, encoding='utf-8')
print(f'Updated {len(changes)} image paths.')
for name, old, new in changes:
    print(name, '->', new)

# identify products from requested list missing entirely in DB
missing_rows = [p for p in products if p not in found_products]
if missing_rows:
    print('\nProducts missing from db.pgsql (will append placeholder rows with NULL imagen_url):')
    print('\n'.join(missing_rows))
    # find current max id
    max_id = 0
    id_re = re.compile(r"^\(\s*(\d+),")
    for r in rows:
        m = id_re.match(r.strip())
        if m:
            max_id = max(max_id, int(m.group(1)))
    # prepare simple insert rows with minimal plausible values: category_id=11 for preparacion, 1 for terminados guess
    append_lines = []
    for i, pname in enumerate(missing_rows, start=1):
        pid = max_id + i
        tipo = 'preparacion' if any(k in pname.lower() for k in ['mimosa','sangría','martini','pisco','tequila','daiquiri','cuba','paloma','mojito','michelada','bellini','caipirinha','chilcano','carajillo','sangría','sex','paloma']) else 'terminado'
        cat = 11 if tipo == 'preparacion' else 1
        imagen = 'NULL'
        line = f"({pid}, '{pname}', {cat}, 'Descripción de {pname}', 10000.00, 0, 0, 'Activo', '{tipo}', NULL, NULL, NULL, {imagen}),"
        append_lines.append(line)
    # insert before '-- Actualizar secuencia'
    insert_point = end_idx
    new_text = new_text[:insert_point] + '\n' + '\n'.join(append_lines) + '\n' + new_text[insert_point:]
    DB_FILE.write_text(new_text, encoding='utf-8')
    print(f'Appended {len(append_lines)} placeholder rows.')
else:
    print('No missing product rows to append.')

print('\nProducts that had no mapped image file:')
for p in missing_images:
    print('-', p)

print('\nDone.')
