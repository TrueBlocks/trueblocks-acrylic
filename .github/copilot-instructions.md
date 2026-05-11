# AI Agent Instructions — acrylic

> Read [../../.github/copilot-instructions.md](../../.github/copilot-instructions.md) first.
> This file only documents what is **specific to acrylic**. Shared rules (shell, yarn,
> directory discipline, mode protocols, code quality, Go file-creation bug, etc.) live
> in the root file and are not repeated here.

---

## 1. Project Overview

**acrylic** is a Wails desktop app for painters working from reference images. It
extracts color palettes from a source image, matches them to a local paint catalog,
tracks owned-paint inventory, saves favorite mixes, and exports comparison/shopping PDFs.

| Layer    | Technology                                            |
| -------- | ----------------------------------------------------- |
| Backend  | Go 1.21+ via Wails v2                                 |
| Database | SQLite (`modernc.org/sqlite` — pure Go, no CGO)       |
| Frontend | React 18 + TypeScript 5 + Mantine 8 + Tabler icons    |
| Shared   | `packages/appkit`, `packages/color`, `@trueblocks/ui`, `@trueblocks/scaffold` |

See [../README.md](../README.md) for user-facing feature list and
[../../design/codebase-review.md](../../design/codebase-review.md) for repo-wide context.

---

## 2. App Layout

- `app/` — Wails binding layer. Thin delegation to `internal/`; no business logic.
- `internal/` — domain code (DB, state, paint matching, image processing, PDF).
- `frontend/` — React/Mantine UI.
- `build/bin/acrylic.app` — Wails build output (run `make` from this submodule root).

`acrylic` follows the **per-field state via `appkit.Store`** pattern (same as `works`
and `siteman`), not the UIContext pattern used in `poetry`.

---

## 3. Data Storage

User data lives under `~/.local/share/trueblocks/acrylic/`:

- `acrylic.db` — SQLite (paints, projects, matches, favorites)
- `state.json` — persisted UI state
- `projects/<id>/` — original images and thumbnails per project

Do not delete or rewrite anything under that directory without explicit user approval.

---

## 4. After Backend Changes

Any change to exported Go functions or types under `app/` requires regenerating
TypeScript bindings:

```fish
wails generate module
```

Never edit `frontend/wailsjs/` by hand — it is auto-generated.

---

## 5. Reference Skills

When implementing typical Wails work in this app, consult the skills under
[../../.github/skills/](../../.github/skills/):

- `wails-backend-architecture` — DB and Wails binding patterns
- `wails-entity-list-detail-pattern` — Page / List / Detail triad and `useNavigation`
- `wails-frontend-routing-patterns` — App.tsx, route persistence, hotkeys
- `wails-testing` — Go test patterns and Vitest setup
