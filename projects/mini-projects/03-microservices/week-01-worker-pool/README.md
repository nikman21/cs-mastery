# Week 1 Mini-Project: Go Worker Pool Service

Build a high-performance worker pool service in Go using goroutines and channels. This project will establish your foundation for building scalable, concurrent microservices.

## 🎯 Project Overview

You'll implement a production-ready worker pool with the following features:
- Configurable worker count and queue size
- Context-based cancellation and timeouts
- Performance metrics and monitoring
- HTTP API for job submission
- Comprehensive test suite

## 📁 Project Structure

```
projects/mini-projects/03-microservices/week-01-worker-pool/
├── README.md              # This file
├── go.mod                 # Go module definition
├── go.sum                 # Dependency checksums
├── cmd/
│   ├── server/           # HTTP server implementation
│   │   └── main.go
│   └── client/           # Example client
│       └── main.go
├── internal/
│   ├── pool/             # Worker pool implementation (YOUR WORK)
│   │   ├── worker.go     # Worker logic
│   │   ├── pool.go       # Pool management
│   │   └── metrics.go    # Performance metrics
│   ├── api/              # HTTP API handlers
│   │   └── handlers.go   # REST endpoints
│   └── config/           # Configuration management
│       └── config.go     # Config structs
├── pkg/
│   └── types/            # Shared types and interfaces
│       └── job.go        # Job and result types
├── tests/                # Test files
│   ├── integration/      # Integration tests
│   │   └── pool_test.go
│   └── benchmarks/       # Performance benchmarks
│       └── bench_test.go
├── examples/             # Usage examples
│   └── basic_usage.go
└── docs/                 # Documentation
    └── api.md            # API documentation
```

## 🚀 Getting Started

### Prerequisites
- Go 1.21 or later
- Basic understanding of goroutines and channels

### Setup
```bash
# Navigate to project directory
cd projects/mini-projects/03-microservices/week-01-worker-pool

# Initialize Go module
go mod init github.com/cs-mastery/worker-pool

# Install dependencies
go mod tidy

# Run tests
go test ./...

# Run server
go run cmd/server/main.go
```

## 📋 Implementation Tasks

### Phase 1: Basic Worker Pool (Days 1-2)
- [ ] Implement `Job` and `JobResult` types in `pkg/types/job.go`
- [ ] Create basic `WorkerPool` struct in `internal/pool/pool.go`
- [ ] Implement worker goroutines in `internal/pool/worker.go`
- [ ] Add job submission and result retrieval methods
- [ ] Write basic unit tests

### Phase 2: Context and Timeouts (Days 3-4)
- [ ] Add context-based cancellation support
- [ ] Implement job timeouts
- [ ] Add graceful shutdown mechanism
- [ ] Implement proper error handling
- [ ] Write context-related tests

### Phase 3: Metrics and Monitoring (Days 5-6)
- [ ] Implement metrics collection in `internal/pool/metrics.go`
- [ ] Add performance counters (jobs processed, latency, etc.)
- [ ] Create metrics export functionality
- [ ] Write metrics tests and benchmarks

### Phase 4: HTTP API (Day 7)
- [ ] Implement REST endpoints in `internal/api/handlers.go`
- [ ] Add job submission endpoint
- [ ] Add metrics endpoint
- [ ] Add health check endpoint
- [ ] Write integration tests

## 🧪 Testing Strategy

### Unit Tests
```bash
# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run race condition detection
go test -race ./...
```

### Benchmarks
```bash
# Run benchmarks
go test -bench=. ./tests/benchmarks/

# Generate CPU profile
go test -bench=. -cpuprofile=cpu.prof ./tests/benchmarks/

# Generate memory profile
go test -bench=. -memprofile=mem.prof ./tests/benchmarks/
```

### Integration Tests
```bash
# Run integration tests
go test ./tests/integration/
```

## 📊 Performance Goals

- **Throughput**: Handle 1000+ jobs/second
- **Latency**: Sub-100ms average job processing
- **Memory**: Efficient goroutine and channel usage
- **CPU**: Scale with available cores
- **Graceful Degradation**: Handle overload scenarios

## 🔧 Configuration

The service supports configuration via environment variables:

```bash
# Worker pool settings
export WORKER_COUNT=10
export QUEUE_SIZE=1000
export JOB_TIMEOUT=30s

# HTTP server settings
export HTTP_PORT=8080
export HTTP_TIMEOUT=10s

# Metrics settings
export METRICS_ENABLED=true
export METRICS_INTERVAL=10s
```

## 📚 Learning Outcomes

After completing this project, you will:
- ✅ Master Go concurrency patterns
- ✅ Understand worker pool design principles
- ✅ Know how to build scalable services
- ✅ Apply context cancellation and timeouts
- ✅ Implement performance monitoring
- ✅ Write effective tests and benchmarks

## 🎯 Evaluation Criteria

### Functionality (40 points)
- [ ] Worker pool correctly processes jobs
- [ ] Context cancellation works properly
- [ ] HTTP API responds correctly
- [ ] Graceful shutdown implemented

### Performance (30 points)
- [ ] Meets throughput requirements
- [ ] Efficient resource usage
- [ ] Proper error handling under load
- [ ] No goroutine or memory leaks

### Code Quality (20 points)
- [ ] Clean, idiomatic Go code
- [ ] Proper package organization
- [ ] Comprehensive error handling
- [ ] Good documentation

### Testing (10 points)
- [ ] Unit test coverage >80%
- [ ] Integration tests pass
- [ ] Benchmarks demonstrate performance
- [ ] Race condition tests pass

## 💡 Implementation Tips

### Worker Pool Best Practices
```go
// Use buffered channels for job queues
jobQueue := make(chan Job, queueSize)

// Always handle context cancellation
select {
case job := <-jobQueue:
    // Process job
case <-ctx.Done():
    return ctx.Err()
}

// Use atomic operations for metrics
atomic.AddInt64(&metrics.jobsProcessed, 1)
```

### Error Handling
```go
// Wrap errors with context
return fmt.Errorf("failed to process job %s: %w", job.ID, err)

// Use typed errors for different scenarios
type PoolError struct {
    Type string
    Msg  string
}

func (e PoolError) Error() string {
    return fmt.Sprintf("%s: %s", e.Type, e.Msg)
}
```

### Testing Patterns
```go
func TestWorkerPool_ConcurrentJobs(t *testing.T) {
    pool := NewWorkerPool(5, 100)
    defer pool.Shutdown()
    
    // Submit multiple jobs concurrently
    var wg sync.WaitGroup
    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            job := Job{ID: fmt.Sprintf("job-%d", id)}
            pool.Submit(job)
        }(i)
    }
    wg.Wait()
    
    // Verify all jobs processed
    assert.Equal(t, 100, pool.GetProcessedCount())
}
```

## 📖 Resources

- [Go Concurrency Patterns](https://blog.golang.org/pipelines)
- [Effective Go](https://golang.org/doc/effective_go)
- [Go Testing](https://golang.org/pkg/testing/)
- [Context Package](https://golang.org/pkg/context/)

## 🚀 Next Steps

After completing this assignment:
1. Experiment with different worker pool patterns
2. Add priority queue functionality
3. Implement distributed job processing
4. Explore message queue integration

---

**Good luck building your high-performance worker pool service!** 