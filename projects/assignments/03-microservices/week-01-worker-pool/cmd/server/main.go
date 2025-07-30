package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"

	"github.com/cs-mastery/worker-pool/internal/config"
	"github.com/cs-mastery/worker-pool/pkg/types"
)

func main() {
	// TODO: Implement main server startup
	// Hints:
	// - Load configuration from environment or config file
	// - Create worker pool with configuration
	// - Start worker pool
	// - Set up HTTP routes and handlers
	// - Start HTTP server
	// - Handle graceful shutdown on signals

	// Load configuration
	cfg := config.Load()

	// TODO: Create and start worker pool
	// Example:
	// poolConfig := types.PoolConfig{
	//     WorkerCount:     cfg.WorkerCount,
	//     QueueSize:       cfg.QueueSize,
	//     JobTimeout:      cfg.JobTimeout,
	//     ShutdownTimeout: cfg.ShutdownTimeout,
	//     EnableMetrics:   cfg.EnableMetrics,
	//     MetricsInterval: cfg.MetricsInterval,
	// }
	//
	// workerPool := pool.NewPool(poolConfig)
	// if err := workerPool.Start(); err != nil {
	//     log.Fatalf("Failed to start worker pool: %v", err)
	// }
	// defer workerPool.Stop()

	// TODO: Set up HTTP server
	// Example:
	// router := setupRoutes(workerPool)
	// server := &http.Server{
	//     Addr:         fmt.Sprintf(":%d", cfg.HTTPPort),
	//     Handler:      router,
	//     ReadTimeout:  cfg.HTTPTimeout,
	//     WriteTimeout: cfg.HTTPTimeout,
	// }

	// TODO: Start server in goroutine
	// Example:
	// go func() {
	//     log.Printf("Starting HTTP server on port %d", cfg.HTTPPort)
	//     if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
	//         log.Fatalf("HTTP server error: %v", err)
	//     }
	// }()

	// TODO: Handle graceful shutdown
	// Example:
	// waitForShutdown(server, workerPool)

	log.Println("Worker pool service started successfully")

	// TODO: Remove this placeholder when implementing
	select {}
}

// setupRoutes configures HTTP routes and handlers
func setupRoutes(workerPool types.WorkerPool) *mux.Router {
	// TODO: Implement route setup
	// Hints:
	// - Create new Gorilla mux router
	// - Set up API handlers with worker pool
	// - Add middleware for logging, CORS, etc.
	// - Return configured router

	router := mux.NewRouter()

	// TODO: Add implementation
	// Example:
	// // Create API handler with worker pool
	// apiHandler := api.NewHandler(workerPool)
	//
	// // API routes
	// api := router.PathPrefix("/api/v1").Subrouter()
	// api.HandleFunc("/jobs", apiHandler.SubmitJob).Methods("POST")
	// api.HandleFunc("/jobs/{id}", apiHandler.GetJobStatus).Methods("GET")
	// api.HandleFunc("/metrics", apiHandler.GetMetrics).Methods("GET")
	// api.HandleFunc("/health", apiHandler.HealthCheck).Methods("GET")
	// api.HandleFunc("/workers", apiHandler.GetWorkers).Methods("GET")
	// api.HandleFunc("/workers", apiHandler.SetWorkerCount).Methods("PUT")
	//
	// // Add middleware
	// router.Use(loggingMiddleware)
	// router.Use(corsMiddleware)

	return router
}

// waitForShutdown waits for shutdown signal and gracefully stops services
func waitForShutdown(server *http.Server, workerPool types.WorkerPool) {
	// TODO: Implement graceful shutdown
	// Hints:
	// - Set up signal channel for SIGINT, SIGTERM
	// - Wait for shutdown signal
	// - Stop HTTP server with timeout
	// - Stop worker pool
	// - Log shutdown completion

	// TODO: Add implementation
	// Example:
	// sigChan := make(chan os.Signal, 1)
	// signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	//
	// // Wait for signal
	// sig := <-sigChan
	// log.Printf("Received signal: %v, starting graceful shutdown", sig)
	//
	// // Create shutdown context with timeout
	// ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	// defer cancel()
	//
	// // Shutdown HTTP server
	// if err := server.Shutdown(ctx); err != nil {
	//     log.Printf("HTTP server shutdown error: %v", err)
	// }
	//
	// // Stop worker pool
	// if err := workerPool.Stop(); err != nil {
	//     log.Printf("Worker pool stop error: %v", err)
	// }
	//
	// log.Println("Graceful shutdown completed")
}

// loggingMiddleware logs HTTP requests
func loggingMiddleware(next http.Handler) http.Handler {
	// TODO: Implement request logging middleware
	// Hints:
	// - Log request method, path, and duration
	// - Include status code and response size
	// - Use structured logging format

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// TODO: Add implementation
		// Example:
		// // Wrap response writer to capture status code
		// wrapped := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}
		//
		// // Call next handler
		// next.ServeHTTP(wrapped, r)
		//
		// // Log request
		// duration := time.Since(start)
		// log.Printf("[%s] %s %s - %d (%v)",
		//     r.Method, r.URL.Path, r.RemoteAddr,
		//     wrapped.statusCode, duration)

		next.ServeHTTP(w, r)
	})
}

// corsMiddleware adds CORS headers
func corsMiddleware(next http.Handler) http.Handler {
	// TODO: Implement CORS middleware
	// Hints:
	// - Add appropriate CORS headers
	// - Handle preflight OPTIONS requests
	// - Configure allowed origins, methods, headers

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// TODO: Add implementation
		// Example:
		// w.Header().Set("Access-Control-Allow-Origin", "*")
		// w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		// w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		//
		// if r.Method == "OPTIONS" {
		//     w.WriteHeader(http.StatusOK)
		//     return
		// }

		next.ServeHTTP(w, r)
	})
}

// responseWriter wraps http.ResponseWriter to capture status code
type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

// TODO: Add any additional helper functions you think would be useful
// Consider:
// - Health check helpers
// - Metrics collection middleware
// - Authentication middleware
// - Rate limiting middleware
// - Request validation helpers
