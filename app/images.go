package app

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	appkit "github.com/TrueBlocks/trueblocks-art/packages/appkit/v2"
)

func (a *App) SelectImageFile() (string, error) {
	return appkit.OpenFile(a.ctx, "Select Image", []appkit.FileFilter{
		{
			DisplayName: "Images",
			Pattern:     "*.png;*.jpg;*.jpeg;*.gif",
		},
	}, "")
}

func (a *App) SavePastedImage(dataURL string) (string, error) {
	parts := strings.SplitN(dataURL, ",", 2)
	if len(parts) != 2 {
		return "", fmt.Errorf("invalid data URL format")
	}

	decoded, err := base64.StdEncoding.DecodeString(parts[1])
	if err != nil {
		return "", fmt.Errorf("decode base64: %w", err)
	}

	ext := ".png"
	header := parts[0]
	if strings.Contains(header, "image/jpeg") {
		ext = ".jpg"
	} else if strings.Contains(header, "image/gif") {
		ext = ".gif"
	}

	dataDir := appkit.AppDirFor("acrylic")
	tmpDir := filepath.Join(dataDir, "tmp")
	if err := os.MkdirAll(tmpDir, 0755); err != nil {
		return "", fmt.Errorf("create tmp dir: %w", err)
	}

	tmpFile := filepath.Join(tmpDir, "pasted"+ext)
	if err := os.WriteFile(tmpFile, decoded, 0644); err != nil {
		return "", fmt.Errorf("write temp file: %w", err)
	}

	return tmpFile, nil
}

func (a *App) GetImageDataURL(relativePath string) (string, error) {
	fullPath := filepath.Join(appkit.AppDirFor("acrylic"), relativePath)
	data, err := os.ReadFile(fullPath)
	if err != nil {
		return "", fmt.Errorf("read image: %w", err)
	}
	mime := http.DetectContentType(data)
	return fmt.Sprintf("data:%s;base64,%s", mime, base64.StdEncoding.EncodeToString(data)), nil
}
