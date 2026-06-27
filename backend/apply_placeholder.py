from pathlib import Path
import re

DB = Path(__file__).resolve().parent / 'db.pgsql'
text = DB.read_text(encoding='utf-8')
lines = text.splitlines()
seed_re = re.compile(r"('/uploads/productos/seed_\d+\.webp')")
replaced = 0
new_lines = []
changed_rows = []
for line in lines:
    if 'seed_' in line and ("'preparacion'" in line or "'terminado'" in line):
        m = seed_re.search(line)
        if m:
            old = m.group(1)
            new = "'/uploads/productos/placeholder.webp'"
            line = line.replace(old, new)
            replaced += 1
            # extract product name for report
            name_m = re.search(r"\(\d+,\s*'([^']+)'", line)
            pname = name_m.group(1) if name_m else 'UNKNOWN'
            changed_rows.append((pname, old.strip("'"), new.strip("'")))
    new_lines.append(line)

if replaced:
    DB.write_text('\n'.join(new_lines), encoding='utf-8')

print(f'Replaced {replaced} seed_ references for preparacion/terminado rows.')
for name, old, new in changed_rows:
    print(f"{name}: {old} -> {new}")

print('Done.')
