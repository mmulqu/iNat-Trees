import csv
import os
import sys
from pathlib import Path

LIKELY_INT_SUFFIXES = ("_id", "_count", "_total", "_index", "_position")
LIKELY_INT_EXACT = {"id", "taxon_id", "parent_id"}


def sql_escape(value: str) -> str:
	return value.replace("'", "''")

def normalize_array_text(raw: str) -> str:
	if raw is None:
		return ""
	s = str(raw).strip()
	# Preserve Postgres array braces; only strip inner quotes
	if s.startswith('{') and s.endswith('}'):
		return s.replace('"', '')
	return s

def is_int_column(col: str) -> bool:
	lc = col.lower()
	return lc in LIKELY_INT_EXACT or any(lc.endswith(suf) for suf in LIKELY_INT_SUFFIXES)

if __name__ == "__main__":
	if len(sys.argv) < 3:
		print("Usage: python csv_to_sql.py <input_csv> <out_dir> [batch_size=50000]")
		sys.exit(1)

	input_csv = Path(sys.argv[1])
	out_dir = Path(sys.argv[2])
	batch_size = int(sys.argv[3]) if len(sys.argv) > 3 else 50000

	out_dir.mkdir(parents=True, exist_ok=True)
	base = input_csv.stem

	with input_csv.open('r', encoding='utf-8-sig', newline='') as f:
		reader = csv.DictReader(f)
		cols = [c.strip() for c in (reader.fieldnames or [])]
		if not cols:
			raise SystemExit("CSV has no header")

		buffer = []
		part = 1
		for row in reader:
			values_sql = []
			for col in cols:
				val = row.get(col)
				if val is None or val == '':
					values_sql.append('NULL')
					continue
				if is_int_column(col):
					try:
						intval = int(str(val).split('.')[0])
						values_sql.append(str(intval))
					except Exception:
						values_sql.append('NULL')
				else:
					text = normalize_array_text(val)
					values_sql.append("'" + sql_escape(text) + "'")

			insert_sql = f"INSERT OR REPLACE INTO taxa (" + ",".join(cols) + ") VALUES (" + ",".join(values_sql) + ");\n"
			buffer.append(insert_sql)

			if len(buffer) >= batch_size:
				out_path = out_dir / f"{base}_part_{part:03d}.sql"
				with out_path.open('w', encoding='utf-8') as out:
					out.writelines(buffer)
				buffer.clear()
				part += 1

		if buffer:
			out_path = out_dir / f"{base}_part_{part:03d}.sql"
			with out_path.open('w', encoding='utf-8') as out:
				out.writelines(buffer)
			buffer.clear()

	print("SQL files written to:", out_dir)
