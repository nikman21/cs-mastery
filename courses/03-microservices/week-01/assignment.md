# Week 1 Assignment: Go Worker Pool Service

**Due:** End of Week 1  
**Difficulty:** Intermediate  
**Estimated Time:** 12-15 hours

---

## 🎯 Project Overview

Build a high-performance worker pool service in Go using goroutines and channels. This project will establish your foundation for building scalable, concurrent microservices and distributed systems.

---

## 📋 Requirements

### Core Features (Must Have)
- [ ] **Worker Pool implementation** with configurable worker count
- [ ] **Job queue system** using Go channels
- [ ] **Graceful shutdown** with context cancellation
- [ ] **Task result handling** with success/error reporting
- [ ] **Performance monitoring** with metrics and statistics

### Advanced Features (Nice to Have)
- [ ] **Dynamic scaling** - adjust worker count based on load
- [ ] **Job priorities** - high/medium/low priority queues
- [ ] **Retry mechanism** for failed jobs with exponential backoff
- [ ] **Rate limiting** to prevent system overload
- [ ] **HTTP API** for job submission and monitoring

---

## 🏗️ Implementation Milestones

### Milestone 1: Basic Worker Pool (Days 1-2)
```go
type WorkerPool struct {
    workerCount int
    jobQueue    chan Job
    quit        chan bool
    wg          sync.WaitGroup
}

type Job struct {
    ID       string
    Task     func() (interface{}, error)
    Result   chan JobResult
    Priority int
}

type JobResult struct {
    ID     string
    Data   interface{}
    Error  error
    Worker int
}
```

**Deliverables:**
- Basic worker pool structure
- Job submission and processing
- Channel-based communication

### Milestone 2: Concurrency Control (Days 3-4)
```go
func (wp *WorkerPool) worker(id int, ctx context.Context) {
    defer wp.wg.Done()
    
    for {
        select {
        case job := <-wp.jobQueue:
            // Process job with timeout
            result := wp.processJob(job, id)
            job.Result <- result
            
        case <-ctx.Done():
            // Graceful shutdown
            return
        }
    }
}
```

**Deliverables:**
- Context-based cancellation
- Timeout handling
- Worker lifecycle management

### Milestone 3: Advanced Features (Days 5-6)
```go
type PoolMetrics struct {
    JobsProcessed   int64
    JobsSucceeded   int64
    JobsFailed      int64
    AverageLatency  time.Duration
    ActiveWorkers   int
    QueueLength     int
}

func (wp *WorkerPool) GetMetrics() PoolMetrics {
    // Return current pool statistics
}
```

**Deliverables:**
- Performance metrics collection
- Priority queue implementation
- Retry mechanism with backoff

### Milestone 4: HTTP API & Testing (Day 7)
**Deliverables:**
- RESTful API for job management
- Comprehensive test suite
- Load testing and benchmarks
- Documentation and examples

---

## 🧪 Test Cases

### Basic Functionality
```go
func TestWorkerPool_BasicJob(t *testing.T) {
    pool := NewWorkerPool(3)
    defer pool.Shutdown()
    
    // Submit a simple job
    job := Job{
        ID: "test-1",
        Task: func() (interface{}, error) {
            time.Sleep(100 * time.Millisecond)
            return "success", nil
        },
        Result: make(chan JobResult, 1),
    }
    
    pool.Submit(job)
    
    // Wait for result
    select {
    case result := <-job.Result:
        assert.NoError(t, result.Error)
        assert.Equal(t, "success", result.Data)
    case <-time.After(5 * time.Second):
        t.Fatal("Job timeout")
    }
}
```

### Concurrency Tests
```go
func TestWorkerPool_ConcurrentJobs(t *testing.T) {
    pool := NewWorkerPool(5)
    defer pool.Shutdown()
    
    jobCount := 100
    results := make([]chan JobResult, jobCount)
    
    // Submit multiple jobs concurrently
    for i := 0; i < jobCount; i++ {
        results[i] = make(chan JobResult, 1)
        job := Job{
            ID: fmt.Sprintf("job-%d", i),
            Task: func() (interface{}, error) {
                // Simulate work
                time.Sleep(time.Duration(rand.Intn(100)) * time.Millisecond)
                return i, nil
            },
            Result: results[i],
        }
        pool.Submit(job)
    }
    
    // Collect all results
    completed := 0
    timeout := time.After(30 * time.Second)
    
    for completed < jobCount {
        select {
        case <-results[completed]:
            completed++
        case <-timeout:
            t.Fatalf("Only %d/%d jobs completed", completed, jobCount)
        }
    }
}
```

### Performance Benchmarks
```go
func BenchmarkWorkerPool_Throughput(b *testing.B) {
    pool := NewWorkerPool(runtime.NumCPU())
    defer pool.Shutdown()
    
    b.ResetTimer()
    b.RunParallel(func(pb *testing.PB) {
        for pb.Next() {
            result := make(chan JobResult, 1)
            job := Job{
                ID: fmt.Sprintf("bench-%d", rand.Int()),
                Task: func() (interface{}, error) {
                    // Simulate CPU work
                    sum := 0
                    for i := 0; i < 1000; i++ {
                        sum += i
                    }
                    return sum, nil
                },
                Result: result,
            }
            
            pool.Submit(job)
            <-result // Wait for completion
        }
    })
}
```

---

## 📁 Project Location

**⚠️ IMPORTANT:** Your assignment code goes in the `projects/mini-projects/` folder, NOT here!

**Assignment Location:** `projects/mini-projects/03-microservices/week-01-worker-pool/`

```
projects/mini-projects/week-01-worker-pool/
├── README.md              # Assignment instructions
├── go.mod                 # Go module definition
├── go.sum                 # Dependency checksums
├── cmd/
│   ├── server/           # HTTP server implementation
│   │   └── main.go
│   └── client/           # Example client
│       └── main.go
├── internal/
│   ├── pool/             # Worker pool implementation (YOUR WORK)
│   │   ├── worker.go
│   │   ├── pool.go
│   │   └── metrics.go
│   ├── api/              # HTTP API handlers
│   │   └── handlers.go
│   └── config/           # Configuration management
│       └── config.go
├── pkg/
│   └── types/            # Shared types and interfaces
│       └── job.go
├── tests/                # Test files
│   ├── integration/
│   └── benchmarks/
├── examples/             # Usage examples
└── docs/                 # Documentation
```

This folder (`courses/03-microservices/week-01/`) contains **study materials only**.

---

## 🔧 Setup Instructions

### Prerequisites
```bash
# Install Go 1.21 or later
go version

# Verify installation
go env GOPATH
```

### Project Setup
```bash
# Navigate to assignment directory
cd projects/mini-projects/week-01-worker-pool

# Initialize Go module
go mod init github.com/cs-mastery/worker-pool

# Install dependencies
go mod tidy

# Run tests
go test ./...

# Run benchmarks
go test -bench=. ./...

# Build and run server
go build -o bin/server cmd/server/main.go
./bin/server
```

### Development Commands
```bash
# Format code
go fmt ./...

# Lint code
golangci-lint run

# Generate test coverage
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out

# Run race condition detection
go test -race ./...
```

---

## 📊 Evaluation Criteria

### Concurrency & Performance (40 points)
- [ ] Efficient goroutine management
- [ ] Proper channel usage and patterns
- [ ] Race condition prevention
- [ ] Performance under high load

### Code Quality (30 points)
- [ ] Clean, idiomatic Go code
- [ ] Proper error handling
- [ ] Good package structure
- [ ] Comprehensive logging

### Advanced Features (20 points)
- [ ] Graceful shutdown implementation
- [ ] Metrics and monitoring
- [ ] Priority queue system
- [ ] HTTP API integration

### Testing & Documentation (10 points)
- [ ] Unit test coverage >80%
- [ ] Integration tests
- [ ] Benchmark tests
- [ ] Clear documentation and examples

---

## 🎓 Learning Outcomes

After completing this assignment, you will:
- ✅ Master Go concurrency patterns with goroutines and channels
- ✅ Understand worker pool design patterns
- ✅ Know how to build scalable, concurrent services
- ✅ Apply context-based cancellation and timeouts
- ✅ Have experience with Go testing and benchmarking

---

## 💡 Hints & Tips

### Go Concurrency Best Practices
```go
// Use buffered channels for job queues
jobQueue := make(chan Job, 1000)

// Always handle context cancellation
select {
case job := <-jobQueue:
    // Process job
case <-ctx.Done():
    return ctx.Err()
}

// Use sync.WaitGroup for worker coordination
var wg sync.WaitGroup
wg.Add(workerCount)
// ... start workers
wg.Wait() // Wait for all workers to finish
```

### Performance Optimization
```go
// Pre-allocate slices when size is known
results := make([]JobResult, 0, expectedCount)

// Use object pooling for frequently allocated objects
var jobPool = sync.Pool{
    New: func() interface{} {
        return &Job{}
    },
}

// Batch operations when possible
func (wp *WorkerPool) SubmitBatch(jobs []Job) error {
    for _, job := range jobs {
        select {
        case wp.jobQueue <- job:
            // Job queued successfully
        case <-time.After(submitTimeout):
            return ErrQueueFull
        }
    }
    return nil
}
```

### Common Pitfalls
- **Channel deadlocks**: Always have a way to drain channels
- **Goroutine leaks**: Ensure all goroutines can exit gracefully
- **Race conditions**: Use proper synchronization primitives
- **Resource exhaustion**: Implement proper backpressure

### Testing Strategies
```go
// Test with different worker counts
func TestWorkerPool_ScalingBehavior(t *testing.T) {
    workerCounts := []int{1, 2, 5, 10, 20}
    
    for _, count := range workerCounts {
        t.Run(fmt.Sprintf("workers-%d", count), func(t *testing.T) {
            pool := NewWorkerPool(count)
            defer pool.Shutdown()
            
            // Test scaling behavior
        })
    }
}
```

---

*Good luck building your high-performance worker pool service!* 