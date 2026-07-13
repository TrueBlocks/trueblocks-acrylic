# AI Agent Instructions

Canonical instructions live at the mono-repo root — read [CLAUDE.md](../../CLAUDE.md), [ai/Rules.md](../../ai/Rules.md), [ai/Architecture.md](../../ai/Architecture.md), and the skills in `.claude/skills/` before acting. Only acrylic-specific facts below.

## What acrylic is

A Wails app for painters: extracts palettes from a reference image, matches them to a paint catalog, tracks owned-paint inventory, and exports comparison/shopping PDFs. Color and matching logic lives in `packages/color`, not `internal/`. Uses the per-field `appkit.Store` state pattern (like works and siteman), not poetry's UIContext pattern.

## Data locations

User data lives under `~/.local/share/trueblocks/acrylic/`:

- `acrylic.db` — SQLite (paints, projects, matches, favorites)
- `state.json` — persisted UI state
- `projects/<id>/` — original images and thumbnails per project

Do not delete or rewrite anything under that directory without explicit user approval.
