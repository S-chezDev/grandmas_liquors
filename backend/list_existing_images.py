from pathlib import Path
import re
BASE = Path(__file__).resolve().parent
DB = BASE / 'db.pgsql'
text = DB.read_text(encoding='utf-8')
paths = sorted(set(re.findall(r"'(/uploads/productos/[^']+)'", text)))
existing = []
for p in paths:
    fs = BASE / p.lstrip('/')
    if fs.exists():
        existing.append((p, str(fs)))
print('Existing image references and paths:')
for p, fs in existing:
    print(p, '->', fs)
print('\nTotal existing:', len(existing))
