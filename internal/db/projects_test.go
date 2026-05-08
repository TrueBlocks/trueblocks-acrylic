package db

import (
	"path/filepath"
	"testing"
)

func newTestDB(t *testing.T) *DB {
	t.Helper()
	path := filepath.Join(t.TempDir(), "test.db")
	d, err := New(path)
	if err != nil {
		t.Fatalf("new db: %v", err)
	}
	t.Cleanup(func() { _ = d.Close() })
	if err := d.InitSchema(); err != nil {
		t.Fatalf("init schema: %v", err)
	}
	return d
}

func TestProjectCRUD(t *testing.T) {
	d := newTestDB(t)

	id, err := d.CreateProject(Project{
		Name:           "Sunset",
		ImagePath:      "/tmp/sunset.png",
		ThumbnailPath:  "/tmp/sunset-thumb.png",
		NColors:        8,
		TileSize:       1,
		Posterize:      true,
		AspectRatio:    "1:1",
		MatchOwnedOnly: false,
		Notes:          "test",
	})
	if err != nil {
		t.Fatalf("create: %v", err)
	}
	if id == 0 {
		t.Fatalf("expected non-zero id")
	}

	got, err := d.GetProject(id)
	if err != nil {
		t.Fatalf("get: %v", err)
	}
	if got.Name != "Sunset" || got.NColors != 8 || !got.Posterize || got.MatchOwnedOnly {
		t.Fatalf("round-trip mismatch: %+v", got)
	}

	got.Name = "Sunset (revised)"
	got.MatchOwnedOnly = true
	if err := d.UpdateProject(got); err != nil {
		t.Fatalf("update: %v", err)
	}
	updated, _ := d.GetProject(id)
	if updated.Name != "Sunset (revised)" || !updated.MatchOwnedOnly {
		t.Fatalf("update did not persist: %+v", updated)
	}

	list, err := d.GetProjects()
	if err != nil {
		t.Fatalf("list: %v", err)
	}
	if len(list) != 1 {
		t.Fatalf("expected 1 project, got %d", len(list))
	}

	if err := d.DeleteProject(id); err != nil {
		t.Fatalf("delete: %v", err)
	}
	if _, err := d.GetProject(id); err == nil {
		t.Fatalf("expected error after delete")
	}
}

func TestProjectColorsAndMatches(t *testing.T) {
	d := newTestDB(t)

	projID, err := d.CreateProject(Project{Name: "p", NColors: 2, TileSize: 1})
	if err != nil {
		t.Fatalf("create project: %v", err)
	}

	colorID, err := d.InsertProjectColor(ProjectColor{
		ProjectID:  projID,
		SortOrder:  0,
		R:          255,
		G:          128,
		B:          0,
		Hex:        "#FF8000",
		PixelCount: 1234,
	})
	if err != nil {
		t.Fatalf("insert color: %v", err)
	}

	if _, err := d.InsertColorMatch(ColorMatch{
		ColorID:     colorID,
		MatchType:   "exact",
		Rank:        1,
		DeltaE:      0.5,
		MatchRating: "excellent",
	}); err != nil {
		t.Fatalf("insert match: %v", err)
	}

	colors, err := d.GetProjectColors(projID)
	if err != nil {
		t.Fatalf("get colors: %v", err)
	}
	if len(colors) != 1 || colors[0].Hex != "#FF8000" || colors[0].PixelCount != 1234 {
		t.Fatalf("unexpected colors: %+v", colors)
	}

	count, err := d.GetProjectColorCount(projID)
	if err != nil {
		t.Fatalf("count: %v", err)
	}
	if count != 1 {
		t.Fatalf("expected 1 color, got %d", count)
	}

	if err := d.ClearProjectColors(projID); err != nil {
		t.Fatalf("clear: %v", err)
	}
	count, _ = d.GetProjectColorCount(projID)
	if count != 0 {
		t.Fatalf("expected 0 colors after clear, got %d", count)
	}
}
