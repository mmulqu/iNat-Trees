import csv
import sys
from pathlib import Path

LIKELY_INT_SUFFIXES = ("_id", "_ids", "_count", "_total", "_index", "_position")
LIKELY_INT_EXACT = {"id", "taxon_id", "parent_id"}

INDEX_CANDIDATES = ["name", "common_name", "rank", "parent_id"]

if __name__ == "__main__":
	if len(sys.argv) < 3:
		print("Usage: python csv_headers_to_schema.py <input_csv> <output_sql>")
		sys.exit(1)
	csv_path = Path(sys.argv[1])
	out_path = Path(sys.argv[2])

	with csv_path.open('r', encoding='utf-8-sig', newline='') as f:
		reader = csv.reader(f)
		header = next(reader, None)
		if not header:
			raise SystemExit("CSV appears empty")
		cols = [h.strip() for h in header]

	# Build simple type map: INTEGER for id-like fields, TEXT otherwise
	types = {}
	for col in cols:
		lc = col.lower()
		if lc in LIKELY_INT_EXACT or any(lc.endswith(suf) for suf in LIKELY_INT_SUFFIXES):
			types[col] = "INTEGER"
		else:
			types[col] = "TEXT"

	# Ensure primary key on taxon_id if present
	pk = "taxon_id" if "taxon_id" in cols else None

	lines = []
	lines.append("DROP TABLE IF EXISTS taxa;")
	lines.append("CREATE TABLE taxa (")
	for i, col in enumerate(cols):
		col_sql = f"  {col} {types[col]}"
		if pk and col == pk:
			col_sql += " PRIMARY KEY"
		lines.append(col_sql + ("," if i < len(cols) - 1 else ""))
	lines.append(");")

	# Helpful indexes
	for cand in INDEX_CANDIDATES:
		if cand in cols:
			lines.append(f"CREATE INDEX IF NOT EXISTS idx_taxa_{cand} ON taxa({cand});")

	out_path.write_text("\n".join(lines) + "\n", encoding='utf-8')
	print("Wrote schema to:", out_path)
