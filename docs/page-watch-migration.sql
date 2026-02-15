-- Page watch feature schema (Phase 1)
-- Apply on the same SQLite database used by scan tables.

CREATE TABLE IF NOT EXISTS page_watches (
  id INTEGER PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  sitemap_url TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  check_frequency_minutes INTEGER NOT NULL DEFAULT 60,
  notification_preferences_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_checked_at TEXT,
  baseline_snapshot_id INTEGER,
  latest_snapshot_id INTEGER
);

CREATE TABLE IF NOT EXISTS page_watch_snapshots (
  id INTEGER PRIMARY KEY,
  watch_id INTEGER NOT NULL,
  fetched_at TEXT NOT NULL,
  status_code INTEGER,
  etag TEXT,
  last_modified TEXT,
  raw_hash TEXT,
  normalized_hash TEXT,
  metadata_json TEXT,
  normalized_content TEXT,
  raw_html_gzip BLOB,
  fetch_mode TEXT,
  FOREIGN KEY (watch_id) REFERENCES page_watches(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS page_watch_diffs (
  id INTEGER PRIMARY KEY,
  watch_id INTEGER NOT NULL,
  prev_snapshot_id INTEGER,
  curr_snapshot_id INTEGER NOT NULL,
  detected_at TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'minor',
  summary_json TEXT,
  patch_json TEXT,
  is_notified INTEGER NOT NULL DEFAULT 0,
  notified_at TEXT,
  FOREIGN KEY (watch_id) REFERENCES page_watches(id) ON DELETE CASCADE,
  FOREIGN KEY (prev_snapshot_id) REFERENCES page_watch_snapshots(id) ON DELETE SET NULL,
  FOREIGN KEY (curr_snapshot_id) REFERENCES page_watch_snapshots(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_page_watches_active ON page_watches (is_active, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_watches_sitemap ON page_watches (sitemap_url);
CREATE INDEX IF NOT EXISTS idx_page_watch_snapshots_watch_time ON page_watch_snapshots (watch_id, fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_watch_diffs_watch_time ON page_watch_diffs (watch_id, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_watch_diffs_notified_time ON page_watch_diffs (is_notified, detected_at DESC);
