# Week 1: Go Concurrency & Worker Pools

**Duration:** August 15-21  
**Goal:** Master Go concurrency patterns and build scalable worker pool services

---

## 🎯 Learning Objectives

By end of this week, you should be able to:
- [ ] Write concurrent Go programs using goroutines and channels
- [ ] Implement worker pool patterns for job processing
- [ ] Apply context-based cancellation and timeouts
- [ ] Build scalable, fault-tolerant services
- [ ] Test and benchmark concurrent Go applications
- [ ] Understand microservices architecture fundamentals

---

## 📚 Core Concepts

### 1. Go Fundamentals

#### Basic Syntax and Types
```go
// Variable declarations
var name string = "microservice"
age := 25                    // Type inference
const maxWorkers = 100       // Constant

// Structs and methods
type Service struct {
    Name    string
    Workers int
}

func (s *Service) Start() error {
    return nil
}

// Interfaces
type Worker interface {
    Process(job Job) error
    Stop() error
}
```

#### Error Handling
```go
// Go's explicit error handling
func processJob(job Job) (Result, error) {
    if job.Data == nil {
        return Result{}, errors.New("job data cannot be nil")
    }
    
    result, err := doWork(job.Data)
    if err != nil {
        return Result{}, fmt.Errorf("failed to process job %s: %w", job.ID, err)
    }
    
    return result, nil
}

// Custom error types
type JobError struct {
    JobID   string
    Message string
    Cause   error
}

func (e JobError) Error() string {
    return fmt.Sprintf("job %s failed: %s", e.JobID, e.Message)
}
```

### 2. Goroutines and Concurrency

#### Goroutines Basics
```go
// Starting a goroutine
go func() {
    fmt.Println("Running in goroutine")
}()

// Goroutines with parameters
func processItem(item string) {
    fmt.Printf("Processing: %s\n", item)
}

items := []string{"item1", "item2", "item3"}
for _, item := range items {
    go processItem(item) // Each item processed concurrently
}
```

#### Channel Communication
```go
// Unbuffered channel (synchronous)
ch := make(chan string)

// Buffered channel (asynchronous)
jobs := make(chan Job, 100)

// Sending and receiving
go func() {
    jobs <- Job{ID: "1", Data: "work"}
}()

job := <-jobs // Receive from channel

// Channel directions
func sender(ch chan<- string) {
    ch <- "message"
}

func receiver(ch <-chan string) {
    msg := <-ch
    fmt.Println(msg)
}
```

#### Select Statement
```go
func worker(jobs <-chan Job, results chan<- Result, quit <-chan bool) {
    for {
        select {
        case job := <-jobs:
            // Process job
            result := processJob(job)
            results <- result
            
        case <-quit:
            // Graceful shutdown
            fmt.Println("Worker stopping")
            return
            
        case <-time.After(30 * time.Second):
            // Timeout handling
            fmt.Println("No jobs received, worker idle")
        }
    }
}
```

### 3. Worker Pool Pattern

#### Basic Worker Pool Implementation
```go
type WorkerPool struct {
    workerCount int
    jobQueue    chan Job
    resultQueue chan Result
    quit        chan bool
    wg          sync.WaitGroup
}

func NewWorkerPool(workerCount int, queueSize int) *WorkerPool {
    return &WorkerPool{
        workerCount: workerCount,
        jobQueue:    make(chan Job, queueSize),
        resultQueue: make(chan Result, queueSize),
        quit:        make(chan bool),
    }
}

func (wp *WorkerPool) Start() {
    for i := 0; i < wp.workerCount; i++ {
        wp.wg.Add(1)
        go wp.worker(i)
    }
}

func (wp *WorkerPool) worker(id int) {
    defer wp.wg.Done()
    
    for {
        select {
        case job := <-wp.jobQueue:
            fmt.Printf("Worker %d processing job %s\n", id, job.ID)
            
            // Process the job
            result := Result{
                JobID: job.ID,
                Data:  processJobData(job.Data),
            }
            
            // Send result
            wp.resultQueue <- result
            
        case <-wp.quit:
            fmt.Printf("Worker %d stopping\n", id)
            return
        }
    }
}
```

#### Advanced Worker Pool with Context
```go
type AdvancedWorkerPool struct {
    workers     int
    jobQueue    chan Job
    ctx         context.Context
    cancel      context.CancelFunc
    wg          sync.WaitGroup
    metrics     *PoolMetrics
}

func (wp *AdvancedWorkerPool) worker(id int) {
    defer wp.wg.Done()
    
    for {
        select {
        case job := <-wp.jobQueue:
            // Process with timeout
            jobCtx, jobCancel := context.WithTimeout(wp.ctx, job.Timeout)
            
            result, err := wp.processJobWithContext(jobCtx, job)
            jobCancel()
            
            if err != nil {
                wp.metrics.IncrementFailed()
                log.Printf("Job %s failed: %v", job.ID, err)
            } else {
                wp.metrics.IncrementSucceeded()
            }
            
        case <-wp.ctx.Done():
            log.Printf("Worker %d shutting down: %v", id, wp.ctx.Err())
            return
        }
    }
}
```

### 4. Context and Cancellation

#### Context Usage Patterns
```go
// Creating contexts
ctx := context.Background()
ctx, cancel := context.WithCancel(ctx)
defer cancel()

// Timeout context
ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
defer cancel()

// Deadline context
deadline := time.Now().Add(1 * time.Minute)
ctx, cancel := context.WithDeadline(context.Background(), deadline)
defer cancel()

// Context with values (use sparingly)
type contextKey string
const userIDKey contextKey = "userID"

ctx = context.WithValue(ctx, userIDKey, "user123")
userID := ctx.Value(userIDKey).(string)
```

#### Cancellation Propagation
```go
func handleRequest(ctx context.Context, req Request) error {
    // Create child context with timeout
    childCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
    defer cancel()
    
    // Pass context down the call chain
    result, err := processRequest(childCtx, req)
    if err != nil {
        if errors.Is(err, context.Canceled) {
            return fmt.Errorf("request was canceled: %w", err)
        }
        if errors.Is(err, context.DeadlineExceeded) {
            return fmt.Errorf("request timed out: %w", err)
        }
        return err
    }
    
    return nil
}

func processRequest(ctx context.Context, req Request) (Result, error) {
    select {
    case <-ctx.Done():
        return Result{}, ctx.Err()
    default:
        // Continue processing
    }
    
    // Check cancellation periodically during long operations
    for i := 0; i < 1000000; i++ {
        if i%10000 == 0 {
            select {
            case <-ctx.Done():
                return Result{}, ctx.Err()
            default:
            }
        }
        // Do work
    }
    
    return Result{}, nil
}
```

### 5. Synchronization Primitives

#### Mutex and RWMutex
```go
type SafeCounter struct {
    mu    sync.Mutex
    count int
}

func (c *SafeCounter) Increment() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.count++
}

func (c *SafeCounter) Value() int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.count
}

// Read-write mutex for read-heavy workloads
type CachedData struct {
    mu   sync.RWMutex
    data map[string]interface{}
}

func (cd *CachedData) Get(key string) (interface{}, bool) {
    cd.mu.RLock()
    defer cd.mu.RUnlock()
    
    value, exists := cd.data[key]
    return value, exists
}

func (cd *CachedData) Set(key string, value interface{}) {
    cd.mu.Lock()
    defer cd.mu.Unlock()
    
    cd.data[key] = value
}
```

#### WaitGroup for Coordination
```go
func processItemsConcurrently(items []Item) []Result {
    var wg sync.WaitGroup
    results := make([]Result, len(items))
    
    for i, item := range items {
        wg.Add(1)
        go func(index int, item Item) {
            defer wg.Done()
            results[index] = processItem(item)
        }(i, item)
    }
    
    wg.Wait() // Wait for all goroutines to complete
    return results
}
```

#### Atomic Operations
```go
import "sync/atomic"

type AtomicCounter struct {
    count int64
}

func (c *AtomicCounter) Increment() {
    atomic.AddInt64(&c.count, 1)
}

func (c *AtomicCounter) Value() int64 {
    return atomic.LoadInt64(&c.count)
}

func (c *AtomicCounter) CompareAndSwap(old, new int64) bool {
    return atomic.CompareAndSwapInt64(&c.count, old, new)
}
```

### 6. Microservices Fundamentals

#### Service Design Principles
```go
// Single Responsibility Principle
type UserService struct {
    repo UserRepository
}

func (s *UserService) GetUser(id string) (*User, error) {
    return s.repo.FindByID(id)
}

func (s *UserService) CreateUser(user *User) error {
    return s.repo.Save(user)
}

// Dependency Injection
type OrderService struct {
    userService    UserService
    paymentService PaymentService
    logger         Logger
}

func NewOrderService(us UserService, ps PaymentService, log Logger) *OrderService {
    return &OrderService{
        userService:    us,
        paymentService: ps,
        logger:         log,
    }
}
```

#### HTTP Service Implementation
```go
type HTTPServer struct {
    pool   *WorkerPool
    server *http.Server
    logger Logger
}

func (s *HTTPServer) submitJobHandler(w http.ResponseWriter, r *http.Request) {
    var jobReq JobRequest
    if err := json.NewDecoder(r.Body).Decode(&jobReq); err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }
    
    job := Job{
        ID:      generateJobID(),
        Type:    jobReq.Type,
        Data:    jobReq.Data,
        Timeout: jobReq.Timeout,
    }
    
    // Submit to worker pool
    select {
    case s.pool.jobQueue <- job:
        w.WriteHeader(http.StatusAccepted)
        json.NewEncoder(w).Encode(map[string]string{
            "job_id": job.ID,
            "status": "accepted",
        })
    case <-time.After(5 * time.Second):
        http.Error(w, "Queue full, try again later", http.StatusServiceUnavailable)
    }
}
```

### 7. Performance and Monitoring

#### Metrics Collection
```go
type PoolMetrics struct {
    jobsProcessed   int64
    jobsSucceeded   int64
    jobsFailed      int64
    totalLatency    int64
    activeWorkers   int32
    queueLength     int32
}

func (m *PoolMetrics) IncrementProcessed() {
    atomic.AddInt64(&m.jobsProcessed, 1)
}

func (m *PoolMetrics) IncrementSucceeded() {
    atomic.AddInt64(&m.jobsSucceeded, 1)
}

func (m *PoolMetrics) AddLatency(duration time.Duration) {
    atomic.AddInt64(&m.totalLatency, int64(duration))
}

func (m *PoolMetrics) GetAverageLatency() time.Duration {
    processed := atomic.LoadInt64(&m.jobsProcessed)
    if processed == 0 {
        return 0
    }
    
    total := atomic.LoadInt64(&m.totalLatency)
    return time.Duration(total / processed)
}
```

#### Profiling and Debugging
```go
import (
    _ "net/http/pprof"
    "net/http"
)

func startProfilingServer() {
    go func() {
        log.Println("Starting profiling server on :6060")
        log.Println(http.ListenAndServe(":6060", nil))
    }()
}

// Usage: go tool pprof http://localhost:6060/debug/pprof/profile
```

---

## 🛠️ Development Tools

### Go Toolchain
```bash
# Format code
go fmt ./...

# Vet for potential issues
go vet ./...

# Run tests with coverage
go test -cover ./...

# Race condition detection
go test -race ./...

# Benchmarking
go test -bench=. -benchmem ./...

# Cross-compilation
GOOS=linux GOARCH=amd64 go build -o service-linux ./cmd/server
```

### Useful Go Tools
```bash
# Install additional tools
go install golang.org/x/tools/cmd/goimports@latest
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
go install github.com/segmentio/golines@latest

# Linting
golangci-lint run

# Import formatting
goimports -w .

# Line length formatting
golines -w -m 120 .
```

---

## 📝 Study Plan

### Day 1-2: Go Fundamentals
- Master Go syntax and idioms
- Understand goroutines and channels
- Practice basic concurrency patterns
- Study examples in `examples/go-basics.go`

### Day 3-4: Worker Pool Implementation
- Design worker pool architecture
- Implement job queuing system
- Add context-based cancellation
- Study examples in `examples/worker-patterns.go`

### Day 5-6: Advanced Features
- Add metrics and monitoring
- Implement priority queues
- Build retry mechanisms
- Study examples in `examples/advanced-patterns.go`

### Day 7: Testing and Optimization
- Write comprehensive tests
- Performance benchmarking
- Load testing and optimization
- HTTP API integration

---

## 🔍 Key Questions to Master

1. **When should you use buffered vs unbuffered channels?**
2. **How do you prevent goroutine leaks?**
3. **What's the difference between context.WithCancel and context.WithTimeout?**
4. **How do you handle backpressure in a worker pool?**
5. **What are the trade-offs between different synchronization primitives?**
6. **How do you test concurrent code effectively?**

---

## 🎯 Week Assessment

### Knowledge Check
- [ ] Can implement worker pools with proper concurrency control
- [ ] Understands channel patterns and select statements
- [ ] Can apply context for cancellation and timeouts
- [ ] Knows how to test and benchmark concurrent code

### Practical Skills
- [ ] Built working high-performance worker pool
- [ ] Implemented graceful shutdown patterns
- [ ] Applied proper error handling and logging
- [ ] Created comprehensive test suite

---

## 📊 Next Week Preview

**Week 2: gRPC Service Architecture**
- Protocol Buffers and gRPC fundamentals
- Service-to-service communication
- Streaming and bidirectional communication
- Load balancing and service discovery

*Focus: Build microservices that communicate efficiently*

---

*Last updated: [Date]* 