PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS paints (
    id          TEXT PRIMARY KEY,
    brand       TEXT NOT NULL,
    name        TEXT NOT NULL,
    series      INTEGER NOT NULL,
    opacity     TEXT NOT NULL,
    pigments    TEXT NOT NULL,
    r           INTEGER NOT NULL,
    g           INTEGER NOT NULL,
    b           INTEGER NOT NULL,
    hex         TEXT NOT NULL,
    lab_l       REAL NOT NULL,
    lab_a       REAL NOT NULL,
    lab_b       REAL NOT NULL,
    owned       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    name             TEXT NOT NULL,
    image_path       TEXT NOT NULL,
    thumbnail_path   TEXT NOT NULL,
    n_colors         INTEGER NOT NULL DEFAULT 10,
    tile_size        INTEGER NOT NULL DEFAULT 1,
    posterize        INTEGER NOT NULL DEFAULT 0,
    smoothing_passes INTEGER NOT NULL DEFAULT 0,
    aspect_ratio     TEXT NOT NULL DEFAULT 'original',
    match_owned_only INTEGER NOT NULL DEFAULT 0,
    notes            TEXT NOT NULL DEFAULT '',
    created_at       TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS project_colors (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sort_order  INTEGER NOT NULL,
    r           INTEGER NOT NULL,
    g           INTEGER NOT NULL,
    b           INTEGER NOT NULL,
    hex         TEXT NOT NULL,
    pixel_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS color_matches (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    color_id     INTEGER NOT NULL REFERENCES project_colors(id) ON DELETE CASCADE,
    match_type   TEXT NOT NULL,
    rank         INTEGER NOT NULL,
    delta_e      REAL NOT NULL,
    match_rating TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS match_parts (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id INTEGER NOT NULL REFERENCES color_matches(id) ON DELETE CASCADE,
    paint_id TEXT NOT NULL REFERENCES paints(id),
    parts    INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS favorites (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    notes      TEXT NOT NULL DEFAULT '',
    r          INTEGER NOT NULL,
    g          INTEGER NOT NULL,
    b          INTEGER NOT NULL,
    hex        TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS favorite_parts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    favorite_id INTEGER NOT NULL REFERENCES favorites(id) ON DELETE CASCADE,
    paint_id    TEXT NOT NULL REFERENCES paints(id),
    parts       INTEGER NOT NULL
);
