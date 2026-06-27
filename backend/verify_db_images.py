from pathlib import Path
import re

BASE = Path(__file__).resolve().parent
DB = BASE / 'db.pgsql'
uploads = BASE / 'uploads'

text = DB.read_text(encoding='utf-8')
# find all '/uploads/productos/...' occurrences inside single quotes
paths = re.findall(r"'(/uploads/productos/[^']+)'", text)
paths = [p for p in paths]

exists = []
missing = []
for p in sorted(set(paths)):
    fs = BASE / p.lstrip('/')
    if fs.exists():
        exists.append((p, str(fs)))
    else:
        # try case-insensitive search for filename
        candidate = None
        fname = Path(p).name
        for f in (uploads / 'productos').rglob('*'):
            if f.is_file() and f.name.lower() == fname.lower():
                candidate = str(f)
                break
        missing.append((p, candidate))

report = []
report.append(f'Total distinct /uploads/productos references in db.pgsql: {len(set(paths))}')
report.append(f'Files found on disk: {len(exists)}')
report.append(f'Files missing on disk: {len(missing)}')
report.append('')
if missing:
    report.append('Missing files (db path -> candidate on disk or NONE):')
    for p, cand in missing:
        report.append(f'{p} -> {cand if cand else "NONE"}')

# write report
out = BASE / 'verify_db_images_report.txt'
out.write_text('\n'.join(report), encoding='utf-8')
print('\n'.join(report))
print('\nReport written to', out)
