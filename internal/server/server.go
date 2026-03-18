package server

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
)

type FileServer struct {
	dataDir string
	port    int
	server  *http.Server
	logger  *log.Logger
}

func New(dataDir string) *FileServer {
	logPath := filepath.Join(dataDir, "server.log")
	f, err := os.OpenFile(logPath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	var logger *log.Logger
	if err != nil {
		logger = log.Default()
	} else {
		logger = log.New(f, "", log.LstdFlags)
	}
	return &FileServer{
		dataDir: dataDir,
		logger:  logger,
	}
}

func (s *FileServer) Start() (int, error) {
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		return 0, fmt.Errorf("failed to find available port: %w", err)
	}

	s.port = listener.Addr().(*net.TCPAddr).Port
	s.logger.Printf("Listening on 127.0.0.1:%d, serving from %s", s.port, s.dataDir)

	mux := http.NewServeMux()
	mux.HandleFunc("/images/", func(w http.ResponseWriter, r *http.Request) {
		relPath := r.URL.Path[len("/images/"):]
		fullPath := filepath.Join(s.dataDir, relPath)
		s.logger.Printf("REQUEST %s %s -> %s", r.Method, r.URL.Path, fullPath)
		if _, err := os.Stat(fullPath); os.IsNotExist(err) {
			s.logger.Printf("NOT FOUND: %s", fullPath)
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Access-Control-Allow-Origin", "*")
		http.ServeFile(w, r, fullPath)
		s.logger.Printf("SERVED: %s", fullPath)
	})

	s.server = &http.Server{Handler: mux}

	go func() {
		if err := s.server.Serve(listener); err != nil && err != http.ErrServerClosed {
			s.logger.Printf("ERROR: %v", err)
		}
	}()

	return s.port, nil
}

func (s *FileServer) Port() int {
	return s.port
}

func (s *FileServer) Log(format string, args ...interface{}) {
	s.logger.Printf(format, args...)
}
