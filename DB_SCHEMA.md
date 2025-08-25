# iNat Trees Database Schema (Worker-side)

This document summarizes the tables used by the Cloudflare Worker backend (`worker.js`), their fields, indexes, and how each endpoint uses them.

## Tables

### 1) `taxa`
- Purpose: Canonical taxonomy lookup and names used to reconstruct trees.
- Fields:
  - `taxon_id` INTEGER PRIMARY KEY
  - `name` TEXT
  - `rank` TEXT
  - `common_name` TEXT NULL
  - `parent_id` INTEGER NULL
  - `ancestor_ids` TEXT or JSON (array-like, used to walk up taxonomy)
  - `created_at` TEXT (timestamp)
  - `last_updated` TEXT (timestamp)
- Notes:
  - The worker may opportunistically fill in `common_name` for missing entries when available.
- Used by:
  - Tree building (`buildTreeFromDatabase`) to fetch nodes for species and ancestors.
  - Search (`GET /search-taxa`) for name/common_name lookups with rank filters.

### 2) `checkpoints`
- Purpose: Saved user checkpoints (snapshot of a tree selection at a time).
- Fields:
  - `id` TEXT PRIMARY KEY (UUID)
  - `user_login` TEXT NOT NULL
  - `taxon_id` INTEGER NOT NULL (base taxon)
  - `taxon_name` TEXT NULL
  - `species_ids_json` TEXT NOT NULL (JSON array of species taxon IDs)
  - `rank_counts_json` TEXT NOT NULL (JSON of rank counts)
  - `high_watermark_updated_at` TEXT NULL (ISO timestamp)
  - `created_at` TEXT NOT NULL (ISO timestamp)
- Indexes:
  - `idx_checkpoints_user_taxon` on (`user_login`, `taxon_id`, `created_at`)
- Used by:
  - `POST /checkpoints/save`, `GET /checkpoints/list`, `POST /checkpoints/delete`
  - UI renders a checkpoint by sending `species_ids_json` to `POST /tree-from-species`.

### 3) `first_seen`
- Purpose: Cache of first-seen dates per user/base-taxon/species. Maintained historically; new logic prefers `user_obs_summary`.
- Fields:
  - `user_login` TEXT NOT NULL
  - `taxon_id` INTEGER NOT NULL
  - `species_id` INTEGER NOT NULL
  - `first_seen` TEXT NULL (ISO timestamp or YYYY-MM-DD)
  - PRIMARY KEY (`user_login`, `taxon_id`, `species_id`)
- Indexes:
  - `idx_first_seen_user_taxon` on (`user_login`, `taxon_id`)
- Used by:
  - As a fallback source in `POST /timeline/first-seen` when `user_obs_summary` lacks rows.

### 4) `user_obs_events`
- Purpose: Event log of observation dates per user/base-taxon/species for time slicing.
- Fields:
  - `user_login` TEXT NOT NULL
  - `taxon_id` INTEGER NOT NULL (base taxon)
  - `species_id` INTEGER NOT NULL (leaf species taxon_id)
  - `observed_on` TEXT NOT NULL (YYYY-MM-DD)
  - PRIMARY KEY (`user_login`, `taxon_id`, `species_id`, `observed_on`)
- Indexes:
  - `idx_user_obs_events_range` on (`user_login`, `taxon_id`, `observed_on`)
- Used by:
  - `POST /timeline/tree-at-date` to get all species observed on/before the selected date, then rebuild tree from `taxa`.
  - Populated by `POST /timeline/index` (initial indexing fetch from iNaturalist per base taxon).

### 5) `user_obs_summary`
- Purpose: Summary rollup: per user/base-taxon/species first and last dates (min/max) to avoid scanning events.
- Fields:
  - `user_login` TEXT NOT NULL
  - `taxon_id` INTEGER NOT NULL
  - `species_id` INTEGER NOT NULL
  - `first_seen` TEXT NULL (YYYY-MM-DD)
  - `last_seen` TEXT NULL (YYYY-MM-DD)
  - PRIMARY KEY (`user_login`, `taxon_id`, `species_id`)
- Indexes:
  - `idx_user_obs_summary_range` on (`user_login`, `taxon_id`, `first_seen`, `last_seen`)
- Used by:
  - `GET /timeline/date-range` (min first_seen, max last_seen)
  - `POST /timeline/first-seen` (primary source for first-seen map; falls back to `first_seen`)
  - Populated/updated by `POST /timeline/index` while ingesting observations.

## Endpoint-to-Table Map (relevant)
- `POST /build-taxonomy`: Fetches fresh observations from iNaturalist for the selected base taxon; does NOT write to timeline tables. Builds a one-off tree and returns markdown.
- `POST /checkpoints/save`: Inserts into `checkpoints`.
- `GET /checkpoints/list`: Reads from `checkpoints` (optionally includes JSON fields).
- `POST /checkpoints/delete`: Deletes from `checkpoints` (ownership enforced).
- `POST /tree-from-species`: Reads `taxa` (no iNat calls) to reconstruct tree from provided species IDs.
- `POST /timeline/index`: Fetches observations from iNaturalist once, populates `user_obs_events` and upserts `user_obs_summary`.
- `GET /timeline/date-range`: Reads `user_obs_summary` to return min/max date.
- `POST /timeline/first-seen`: Reads `user_obs_summary` for first-seen map; falls back to `first_seen` if empty. No iNat calls.
- `POST /timeline/tree-at-date`: Reads `user_obs_events` up to date and rebuilds the tree via `taxa`.
- `GET /search-taxa`: Reads `taxa` by name/common_name with rank filters.

## Notes and Data Flow
- Checkpoint playback never calls iNaturalist. It uses: `checkpoints` → species IDs → `tree-from-species` → `taxa`.
- Timeline needs initial indexing per base taxon: `POST /timeline/index` (iNat fetch once) → fills `user_obs_events` and `user_obs_summary`.
- Subsequent timeline interactions use only DB tables: `user_obs_summary`, `user_obs_events`, `taxa`.
- `first_seen` exists for legacy caching and as a fallback. Preferred source is `user_obs_summary`.
