// Week 1 Examples: Worker Pool Patterns and Concurrency
// This file demonstrates various worker pool implementations and patterns

package main

import (
	"context"
	"fmt"
	"math/rand"
	"runtime"
	"sync"
	"sync/atomic"
	"time"
)

// =============================================================================
// 1. BASIC WORKER POOL IMPLEMENTATION
// =============================================================================

// WorkerJob represents a unit of work for worker pools
type WorkerJob struct {
	ID       string
	Data     interface{}
	Priority int
	Timeout  time.Duration
}

// WorkerResult represents the outcome of job processing
type WorkerResult struct {
	JobID     string
	Data      interface{}
	Error     error
	Worker    int
	Duration  time.Duration
	Timestamp time.Time
}

// SimpleWorkerPool implements a basic worker pool
type SimpleWorkerPool struct {
	workerCount int
	jobQueue    chan WorkerJob
	resultQueue chan WorkerResult
	quit        chan bool
	wg          sync.WaitGroup
}

// NewSimpleWorkerPool creates a new simple worker pool
func NewSimpleWorkerPool(workerCount, queueSize int) *SimpleWorkerPool {
	return &SimpleWorkerPool{
		workerCount: workerCount,
		jobQueue:    make(chan WorkerJob, queueSize),
		resultQueue: make(chan WorkerResult, queueSize),
		quit:        make(chan bool),
	}
}

// Start starts all workers
func (wp *SimpleWorkerPool) Start() {
	for i := 0; i < wp.workerCount; i++ {
		wp.wg.Add(1)
		go wp.worker(i)
	}
}

// worker processes jobs from the queue
func (wp *SimpleWorkerPool) worker(id int) {
	defer wp.wg.Done()

	for {
		select {
		case job := <-wp.jobQueue:
			start := time.Now()
			fmt.Printf("Worker %d processing job %s\n", id, job.ID)

			// Simulate work
			result := wp.processJob(job)
			result.Worker = id
			result.Duration = time.Since(start)
			result.Timestamp = time.Now()

			// Send result
			wp.resultQueue <- result

		case <-wp.quit:
			fmt.Printf("Worker %d stopping\n", id)
			return
		}
	}
}

// processJob simulates job processing
func (wp *SimpleWorkerPool) processJob(job WorkerJob) WorkerResult {
	// Simulate processing time
	processingTime := time.Duration(rand.Intn(1000)) * time.Millisecond
	time.Sleep(processingTime)

	// Simulate occasional failures
	if rand.Float32() < 0.1 { // 10% failure rate
		return WorkerResult{
			JobID: job.ID,
			Error: fmt.Errorf("job %s failed during processing", job.ID),
		}
	}

	return WorkerResult{
		JobID: job.ID,
		Data:  fmt.Sprintf("Processed: %v", job.Data),
	}
}

// Submit submits a job to the pool
func (wp *SimpleWorkerPool) Submit(job WorkerJob) {
	wp.jobQueue <- job
}

// GetResult gets a result from the pool
func (wp *SimpleWorkerPool) GetResult() WorkerResult {
	return <-wp.resultQueue
}

// Stop stops all workers
func (wp *SimpleWorkerPool) Stop() {
	close(wp.quit)
	wp.wg.Wait()
	close(wp.jobQueue)
	close(wp.resultQueue)
}

// =============================================================================
// 2. ADVANCED WORKER POOL WITH CONTEXT
// =============================================================================

// AdvancedWorkerPool with context support and metrics
type AdvancedWorkerPool struct {
	workers     int
	jobQueue    chan Job
	resultQueue chan Result
	ctx         context.Context
	cancel      context.CancelFunc
	wg          sync.WaitGroup
	metrics     *PoolMetrics
}

// PoolMetrics tracks pool performance
type PoolMetrics struct {
	jobsProcessed int64
	jobsSucceeded int64
	jobsFailed    int64
	totalLatency  int64 // in nanoseconds
	activeWorkers int32
}

// NewAdvancedWorkerPool creates an advanced worker pool
func NewAdvancedWorkerPool(ctx context.Context, workers, queueSize int) *AdvancedWorkerPool {
	childCtx, cancel := context.WithCancel(ctx)

	return &AdvancedWorkerPool{
		workers:     workers,
		jobQueue:    make(chan Job, queueSize),
		resultQueue: make(chan Result, queueSize),
		ctx:         childCtx,
		cancel:      cancel,
		metrics:     &PoolMetrics{},
	}
}

// Start starts the advanced worker pool
func (awp *AdvancedWorkerPool) Start() {
	for i := 0; i < awp.workers; i++ {
		awp.wg.Add(1)
		go awp.worker(i)
	}
}

// worker with context support and metrics
func (awp *AdvancedWorkerPool) worker(id int) {
	defer awp.wg.Done()
	atomic.AddInt32(&awp.metrics.activeWorkers, 1)
	defer atomic.AddInt32(&awp.metrics.activeWorkers, -1)

	fmt.Printf("Advanced worker %d started\n", id)

	for {
		select {
		case job := <-awp.jobQueue:
			awp.processJobWithContext(job, id)

		case <-awp.ctx.Done():
			fmt.Printf("Advanced worker %d shutting down: %v\n", id, awp.ctx.Err())
			return
		}
	}
}

// processJobWithContext processes job with context and timeout
func (awp *AdvancedWorkerPool) processJobWithContext(job Job, workerID int) {
	start := time.Now()
	atomic.AddInt64(&awp.metrics.jobsProcessed, 1)

	// Create job context with timeout
	jobCtx := awp.ctx
	if job.Timeout > 0 {
		var cancel context.CancelFunc
		jobCtx, cancel = context.WithTimeout(awp.ctx, job.Timeout)
		defer cancel()
	}

	result := Result{
		JobID:     job.ID,
		Worker:    workerID,
		Timestamp: time.Now(),
	}

	// Process with context cancellation support
	done := make(chan struct{})
	go func() {
		defer close(done)
		// Simulate work that respects context
		for i := 0; i < 10; i++ {
			select {
			case <-jobCtx.Done():
				result.Error = jobCtx.Err()
				return
			default:
				time.Sleep(50 * time.Millisecond)
			}
		}

		// Simulate processing result
		if rand.Float32() < 0.05 { // 5% failure rate
			result.Error = fmt.Errorf("job %s processing failed", job.ID)
		} else {
			result.Data = fmt.Sprintf("Advanced processing: %v", job.Data)
		}
	}()

	// Wait for completion or cancellation
	select {
	case <-done:
		// Job completed
	case <-jobCtx.Done():
		result.Error = jobCtx.Err()
	}

	duration := time.Since(start)
	result.Duration = duration

	// Update metrics
	atomic.AddInt64(&awp.metrics.totalLatency, int64(duration))
	if result.Error != nil {
		atomic.AddInt64(&awp.metrics.jobsFailed, 1)
	} else {
		atomic.AddInt64(&awp.metrics.jobsSucceeded, 1)
	}

	// Send result
	select {
	case awp.resultQueue <- result:
	case <-awp.ctx.Done():
		// Pool is shutting down
	}
}

// Submit submits a job with context awareness
func (awp *AdvancedWorkerPool) Submit(job Job) error {
	select {
	case awp.jobQueue <- job:
		return nil
	case <-awp.ctx.Done():
		return awp.ctx.Err()
	case <-time.After(5 * time.Second):
		return fmt.Errorf("job submission timeout")
	}
}

// GetMetrics returns current pool metrics
func (awp *AdvancedWorkerPool) GetMetrics() PoolMetrics {
	return PoolMetrics{
		jobsProcessed: atomic.LoadInt64(&awp.metrics.jobsProcessed),
		jobsSucceeded: atomic.LoadInt64(&awp.metrics.jobsSucceeded),
		jobsFailed:    atomic.LoadInt64(&awp.metrics.jobsFailed),
		totalLatency:  atomic.LoadInt64(&awp.metrics.totalLatency),
		activeWorkers: atomic.LoadInt32(&awp.metrics.activeWorkers),
	}
}

// GetAverageLatency calculates average job latency
func (awp *AdvancedWorkerPool) GetAverageLatency() time.Duration {
	metrics := awp.GetMetrics()
	if metrics.jobsProcessed == 0 {
		return 0
	}
	return time.Duration(metrics.totalLatency / metrics.jobsProcessed)
}

// Stop gracefully stops the pool
func (awp *AdvancedWorkerPool) Stop() {
	awp.cancel()
	awp.wg.Wait()
	close(awp.jobQueue)
	close(awp.resultQueue)
}

// =============================================================================
// 3. PRIORITY QUEUE WORKER POOL
// =============================================================================

// PriorityJob extends Job with priority handling
type PriorityJob struct {
	Job
	Priority int // Higher number = higher priority
}

// PriorityWorkerPool implements priority-based job processing
type PriorityWorkerPool struct {
	workers      int
	highPriority chan PriorityJob
	medPriority  chan PriorityJob
	lowPriority  chan PriorityJob
	resultQueue  chan Result
	ctx          context.Context
	cancel       context.CancelFunc
	wg           sync.WaitGroup
}

// NewPriorityWorkerPool creates a priority-based worker pool
func NewPriorityWorkerPool(ctx context.Context, workers int) *PriorityWorkerPool {
	childCtx, cancel := context.WithCancel(ctx)

	return &PriorityWorkerPool{
		workers:      workers,
		highPriority: make(chan PriorityJob, 100),
		medPriority:  make(chan PriorityJob, 200),
		lowPriority:  make(chan PriorityJob, 500),
		resultQueue:  make(chan Result, 100),
		ctx:          childCtx,
		cancel:       cancel,
	}
}

// Start starts the priority worker pool
func (pwp *PriorityWorkerPool) Start() {
	for i := 0; i < pwp.workers; i++ {
		pwp.wg.Add(1)
		go pwp.priorityWorker(i)
	}
}

// priorityWorker processes jobs based on priority
func (pwp *PriorityWorkerPool) priorityWorker(id int) {
	defer pwp.wg.Done()
	fmt.Printf("Priority worker %d started\n", id)

	for {
		select {
		// Check high priority first
		case job := <-pwp.highPriority:
			pwp.processJob(job, id, "HIGH")

		// Then medium priority
		case job := <-pwp.medPriority:
			pwp.processJob(job, id, "MEDIUM")

		// Finally low priority
		case job := <-pwp.lowPriority:
			pwp.processJob(job, id, "LOW")

		case <-pwp.ctx.Done():
			fmt.Printf("Priority worker %d stopping\n", id)
			return
		}
	}
}

// processJob processes a priority job
func (pwp *PriorityWorkerPool) processJob(priorityJob PriorityJob, workerID int, priority string) {
	start := time.Now()
	fmt.Printf("Worker %d processing %s priority job %s\n", workerID, priority, priorityJob.ID)

	// Simulate priority-based processing time
	var processingTime time.Duration
	switch priority {
	case "HIGH":
		processingTime = time.Duration(rand.Intn(200)) * time.Millisecond
	case "MEDIUM":
		processingTime = time.Duration(rand.Intn(500)) * time.Millisecond
	case "LOW":
		processingTime = time.Duration(rand.Intn(1000)) * time.Millisecond
	}

	time.Sleep(processingTime)

	result := Result{
		JobID:     priorityJob.ID,
		Data:      fmt.Sprintf("%s priority result: %v", priority, priorityJob.Data),
		Worker:    workerID,
		Duration:  time.Since(start),
		Timestamp: time.Now(),
	}

	select {
	case pwp.resultQueue <- result:
	case <-pwp.ctx.Done():
	}
}

// Submit submits a job with priority
func (pwp *PriorityWorkerPool) Submit(job PriorityJob) error {
	var targetQueue chan PriorityJob

	switch {
	case job.Priority >= 8:
		targetQueue = pwp.highPriority
	case job.Priority >= 5:
		targetQueue = pwp.medPriority
	default:
		targetQueue = pwp.lowPriority
	}

	select {
	case targetQueue <- job:
		return nil
	case <-pwp.ctx.Done():
		return pwp.ctx.Err()
	case <-time.After(2 * time.Second):
		return fmt.Errorf("priority job submission timeout")
	}
}

// GetResult gets a result from the priority pool
func (pwp *PriorityWorkerPool) GetResult() Result {
	return <-pwp.resultQueue
}

// Stop stops the priority worker pool
func (pwp *PriorityWorkerPool) Stop() {
	pwp.cancel()
	pwp.wg.Wait()
	close(pwp.highPriority)
	close(pwp.medPriority)
	close(pwp.lowPriority)
	close(pwp.resultQueue)
}

// =============================================================================
// 4. DYNAMIC SCALING WORKER POOL
// =============================================================================

// DynamicWorkerPool can scale workers up/down based on load
type DynamicWorkerPool struct {
	minWorkers     int
	maxWorkers     int
	currentWorkers int32
	jobQueue       chan Job
	resultQueue    chan Result
	scaleSignal    chan int
	ctx            context.Context
	cancel         context.CancelFunc
	wg             sync.WaitGroup
	mu             sync.Mutex
}

// NewDynamicWorkerPool creates a dynamic scaling worker pool
func NewDynamicWorkerPool(ctx context.Context, minWorkers, maxWorkers int) *DynamicWorkerPool {
	childCtx, cancel := context.WithCancel(ctx)

	return &DynamicWorkerPool{
		minWorkers:     minWorkers,
		maxWorkers:     maxWorkers,
		currentWorkers: int32(minWorkers),
		jobQueue:       make(chan Job, 1000),
		resultQueue:    make(chan Result, 1000),
		scaleSignal:    make(chan int, 10),
		ctx:            childCtx,
		cancel:         cancel,
	}
}

// Start starts the dynamic worker pool
func (dwp *DynamicWorkerPool) Start() {
	// Start initial workers
	for i := 0; i < dwp.minWorkers; i++ {
		dwp.wg.Add(1)
		go dwp.dynamicWorker(i)
	}

	// Start scaling manager
	go dwp.scalingManager()
}

// dynamicWorker is a worker that can be dynamically managed
func (dwp *DynamicWorkerPool) dynamicWorker(id int) {
	defer dwp.wg.Done()
	fmt.Printf("Dynamic worker %d started\n", id)

	for {
		select {
		case job := <-dwp.jobQueue:
			start := time.Now()
			// Process job
			time.Sleep(time.Duration(rand.Intn(500)) * time.Millisecond)

			result := Result{
				JobID:     job.ID,
				Data:      fmt.Sprintf("Dynamic result: %v", job.Data),
				Worker:    id,
				Duration:  time.Since(start),
				Timestamp: time.Now(),
			}

			select {
			case dwp.resultQueue <- result:
			case <-dwp.ctx.Done():
				return
			}

		case <-dwp.ctx.Done():
			fmt.Printf("Dynamic worker %d stopping\n", id)
			return
		}
	}
}

// scalingManager manages dynamic scaling
func (dwp *DynamicWorkerPool) scalingManager() {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			dwp.checkAndScale()

		case adjustment := <-dwp.scaleSignal:
			dwp.adjustWorkers(adjustment)

		case <-dwp.ctx.Done():
			return
		}
	}
}

// checkAndScale automatically checks and scales based on queue length
func (dwp *DynamicWorkerPool) checkAndScale() {
	queueLen := len(dwp.jobQueue)
	currentWorkers := atomic.LoadInt32(&dwp.currentWorkers)

	fmt.Printf("Queue length: %d, Current workers: %d\n", queueLen, currentWorkers)

	// Scale up if queue is building up
	if queueLen > int(currentWorkers)*2 && int(currentWorkers) < dwp.maxWorkers {
		dwp.scaleUp(1)
	}

	// Scale down if queue is consistently low
	if queueLen == 0 && int(currentWorkers) > dwp.minWorkers {
		dwp.scaleDown(1)
	}
}

// scaleUp adds more workers
func (dwp *DynamicWorkerPool) scaleUp(count int) {
	dwp.mu.Lock()
	defer dwp.mu.Unlock()

	current := int(atomic.LoadInt32(&dwp.currentWorkers))
	newCount := min(current+count, dwp.maxWorkers)

	for i := current; i < newCount; i++ {
		dwp.wg.Add(1)
		go dwp.dynamicWorker(i)
		atomic.AddInt32(&dwp.currentWorkers, 1)
		fmt.Printf("Scaled up: added worker %d\n", i)
	}
}

// scaleDown removes workers (simplified - would need more sophisticated approach)
func (dwp *DynamicWorkerPool) scaleDown(count int) {
	current := int(atomic.LoadInt32(&dwp.currentWorkers))
	newCount := max(current-count, dwp.minWorkers)

	if newCount < current {
		atomic.StoreInt32(&dwp.currentWorkers, int32(newCount))
		fmt.Printf("Scaled down: target workers %d\n", newCount)
	}
}

// adjustWorkers manually adjusts worker count
func (dwp *DynamicWorkerPool) adjustWorkers(adjustment int) {
	if adjustment > 0 {
		dwp.scaleUp(adjustment)
	} else if adjustment < 0 {
		dwp.scaleDown(-adjustment)
	}
}

// Submit submits a job to the dynamic pool
func (dwp *DynamicWorkerPool) Submit(job Job) error {
	select {
	case dwp.jobQueue <- job:
		return nil
	case <-dwp.ctx.Done():
		return dwp.ctx.Err()
	}
}

// GetCurrentWorkerCount returns current worker count
func (dwp *DynamicWorkerPool) GetCurrentWorkerCount() int {
	return int(atomic.LoadInt32(&dwp.currentWorkers))
}

// Stop stops the dynamic worker pool
func (dwp *DynamicWorkerPool) Stop() {
	dwp.cancel()
	dwp.wg.Wait()
	close(dwp.jobQueue)
	close(dwp.resultQueue)
	close(dwp.scaleSignal)
}

// =============================================================================
// 5. DEMONSTRATION AND TESTING
// =============================================================================

// demonstrateSimplePool shows basic worker pool usage
func demonstrateSimplePool() {
	fmt.Println("\n=== Simple Worker Pool Demo ===")

	pool := NewSimpleWorkerPool(3, 10)
	pool.Start()

	// Submit jobs
	for i := 0; i < 10; i++ {
		job := Job{
			ID:   fmt.Sprintf("simple-job-%d", i),
			Data: fmt.Sprintf("data-%d", i),
		}
		pool.Submit(job)
	}

	// Collect results
	for i := 0; i < 10; i++ {
		result := pool.GetResult()
		if result.Error != nil {
			fmt.Printf("Job %s failed: %v\n", result.JobID, result.Error)
		} else {
			fmt.Printf("Job %s completed by worker %d in %v\n",
				result.JobID, result.Worker, result.Duration)
		}
	}

	pool.Stop()
}

// demonstrateAdvancedPool shows advanced pool with context
func demonstrateAdvancedPool() {
	fmt.Println("\n=== Advanced Worker Pool Demo ===")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	pool := NewAdvancedWorkerPool(ctx, 4, 20)
	pool.Start()

	// Submit jobs with different timeouts
	for i := 0; i < 15; i++ {
		timeout := time.Duration(rand.Intn(2000)) * time.Millisecond
		job := Job{
			ID:      fmt.Sprintf("advanced-job-%d", i),
			Data:    fmt.Sprintf("data-%d", i),
			Timeout: timeout,
		}

		if err := pool.Submit(job); err != nil {
			fmt.Printf("Failed to submit job %s: %v\n", job.ID, err)
		}
	}

	// Collect results
	go func() {
		for i := 0; i < 15; i++ {
			select {
			case result := <-pool.resultQueue:
				if result.Error != nil {
					fmt.Printf("Advanced job %s failed: %v\n", result.JobID, result.Error)
				} else {
					fmt.Printf("Advanced job %s completed in %v\n", result.JobID, result.Duration)
				}
			case <-ctx.Done():
				return
			}
		}
	}()

	// Show metrics periodically
	time.Sleep(2 * time.Second)
	metrics := pool.GetMetrics()
	fmt.Printf("Metrics: Processed=%d, Succeeded=%d, Failed=%d, AvgLatency=%v\n",
		metrics.jobsProcessed, metrics.jobsSucceeded, metrics.jobsFailed,
		pool.GetAverageLatency())

	time.Sleep(5 * time.Second)
	pool.Stop()
}

// demonstratePriorityPool shows priority-based job processing
func demonstratePriorityPool() {
	fmt.Println("\n=== Priority Worker Pool Demo ===")

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	pool := NewPriorityWorkerPool(ctx, 3)
	pool.Start()

	// Submit jobs with different priorities
	priorities := []int{1, 5, 9, 3, 8, 2, 7, 4, 10, 6}
	for i, priority := range priorities {
		job := PriorityJob{
			Job: Job{
				ID:   fmt.Sprintf("priority-job-%d", i),
				Data: fmt.Sprintf("data-%d", i),
			},
			Priority: priority,
		}

		if err := pool.Submit(job); err != nil {
			fmt.Printf("Failed to submit priority job: %v\n", err)
		}
	}

	// Collect results
	for i := 0; i < len(priorities); i++ {
		result := pool.GetResult()
		fmt.Printf("Priority job completed: %s - %v\n", result.JobID, result.Data)
	}

	pool.Stop()
}

// Helper functions
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

// main function demonstrates all patterns
func main() {
	fmt.Printf("Worker Pool Patterns Demo\n")
	fmt.Printf("Go version: %s\n", runtime.Version())
	fmt.Printf("GOMAXPROCS: %d\n", runtime.GOMAXPROCS(0))

	// Seed random number generator
	rand.Seed(time.Now().UnixNano())

	// Demonstrate different worker pool patterns
	demonstrateSimplePool()
	demonstrateAdvancedPool()
	demonstratePriorityPool()

	fmt.Println("\n=== All worker pool demos completed ===")
}

// =============================================================================
// KEY PATTERNS DEMONSTRATED:
//
// 1. Basic Worker Pool - Simple job processing with goroutines and channels
// 2. Advanced Pool - Context cancellation, timeouts, and metrics
// 3. Priority Pool - Job prioritization and queue management
// 4. Dynamic Pool - Automatic scaling based on load
// 5. Error Handling - Proper error propagation and handling
// 6. Graceful Shutdown - Clean resource cleanup and worker termination
// 7. Performance Metrics - Monitoring and observability
//
// To run: go run worker-patterns.go
// =============================================================================
