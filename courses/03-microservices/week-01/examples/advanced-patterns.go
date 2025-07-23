// Week 1 Examples: Advanced Concurrency Patterns
// This file demonstrates advanced Go concurrency patterns for microservices

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
// 1. CONTEXT-AWARE WORKER POOL
// =============================================================================

// Task represents a unit of work with context
type Task struct {
	ID      string
	Data    interface{}
	Timeout time.Duration
}

// TaskResult represents task execution result
type TaskResult struct {
	TaskID    string
	Data      interface{}
	Error     error
	Worker    int
	Duration  time.Duration
	Timestamp time.Time
}

// ContextWorkerPool implements context-aware worker pool
type ContextWorkerPool struct {
	workers     int
	taskQueue   chan Task
	resultQueue chan TaskResult
	ctx         context.Context
	cancel      context.CancelFunc
	wg          sync.WaitGroup
	metrics     *TaskPoolMetrics
}

// TaskPoolMetrics tracks pool performance
type TaskPoolMetrics struct {
	tasksProcessed int64
	tasksSucceeded int64
	tasksFailed    int64
	totalLatency   int64 // in nanoseconds
	activeWorkers  int32
}

// NewContextWorkerPool creates a context-aware worker pool
func NewContextWorkerPool(ctx context.Context, workers, queueSize int) *ContextWorkerPool {
	childCtx, cancel := context.WithCancel(ctx)

	return &ContextWorkerPool{
		workers:     workers,
		taskQueue:   make(chan Task, queueSize),
		resultQueue: make(chan TaskResult, queueSize),
		ctx:         childCtx,
		cancel:      cancel,
		metrics:     &TaskPoolMetrics{},
	}
}

// Start starts the worker pool
func (cwp *ContextWorkerPool) Start() {
	for i := 0; i < cwp.workers; i++ {
		cwp.wg.Add(1)
		go cwp.worker(i)
	}
}

// worker processes tasks with context awareness
func (cwp *ContextWorkerPool) worker(id int) {
	defer cwp.wg.Done()
	atomic.AddInt32(&cwp.metrics.activeWorkers, 1)
	defer atomic.AddInt32(&cwp.metrics.activeWorkers, -1)

	fmt.Printf("Context worker %d started\n", id)

	for {
		select {
		case task := <-cwp.taskQueue:
			cwp.processTaskWithContext(task, id)

		case <-cwp.ctx.Done():
			fmt.Printf("Context worker %d shutting down: %v\n", id, cwp.ctx.Err())
			return
		}
	}
}

// processTaskWithContext processes task with context and timeout
func (cwp *ContextWorkerPool) processTaskWithContext(task Task, workerID int) {
	start := time.Now()
	atomic.AddInt64(&cwp.metrics.tasksProcessed, 1)

	// Create task context with timeout
	taskCtx := cwp.ctx
	if task.Timeout > 0 {
		var cancel context.CancelFunc
		taskCtx, cancel = context.WithTimeout(cwp.ctx, task.Timeout)
		defer cancel()
	}

	result := TaskResult{
		TaskID:    task.ID,
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
			case <-taskCtx.Done():
				result.Error = taskCtx.Err()
				return
			default:
				time.Sleep(50 * time.Millisecond)
			}
		}

		// Simulate processing result
		if rand.Float32() < 0.05 { // 5% failure rate
			result.Error = fmt.Errorf("task %s processing failed", task.ID)
		} else {
			result.Data = fmt.Sprintf("Context processing: %v", task.Data)
		}
	}()

	// Wait for completion or cancellation
	select {
	case <-done:
		// Task completed
	case <-taskCtx.Done():
		result.Error = taskCtx.Err()
	}

	duration := time.Since(start)
	result.Duration = duration

	// Update metrics
	atomic.AddInt64(&cwp.metrics.totalLatency, int64(duration))
	if result.Error != nil {
		atomic.AddInt64(&cwp.metrics.tasksFailed, 1)
	} else {
		atomic.AddInt64(&cwp.metrics.tasksSucceeded, 1)
	}

	// Send result
	select {
	case cwp.resultQueue <- result:
	case <-cwp.ctx.Done():
		// Pool is shutting down
	}
}

// Submit submits a task with context awareness
func (cwp *ContextWorkerPool) Submit(task Task) error {
	select {
	case cwp.taskQueue <- task:
		return nil
	case <-cwp.ctx.Done():
		return cwp.ctx.Err()
	case <-time.After(5 * time.Second):
		return fmt.Errorf("task submission timeout")
	}
}

// GetMetrics returns current pool metrics
func (cwp *ContextWorkerPool) GetMetrics() TaskPoolMetrics {
	return TaskPoolMetrics{
		tasksProcessed: atomic.LoadInt64(&cwp.metrics.tasksProcessed),
		tasksSucceeded: atomic.LoadInt64(&cwp.metrics.tasksSucceeded),
		tasksFailed:    atomic.LoadInt64(&cwp.metrics.tasksFailed),
		totalLatency:   atomic.LoadInt64(&cwp.metrics.totalLatency),
		activeWorkers:  atomic.LoadInt32(&cwp.metrics.activeWorkers),
	}
}

// GetAverageLatency calculates average task latency
func (cwp *ContextWorkerPool) GetAverageLatency() time.Duration {
	metrics := cwp.GetMetrics()
	if metrics.tasksProcessed == 0 {
		return 0
	}
	return time.Duration(metrics.totalLatency / metrics.tasksProcessed)
}

// Stop gracefully stops the pool
func (cwp *ContextWorkerPool) Stop() {
	cwp.cancel()
	cwp.wg.Wait()
	close(cwp.taskQueue)
	close(cwp.resultQueue)
}

// =============================================================================
// 2. PIPELINE PATTERN (FAN-OUT, FAN-IN)
// =============================================================================

// PipelineStage represents a processing stage
type PipelineStage func(context.Context, <-chan interface{}) <-chan interface{}

// Pipeline implements a processing pipeline
type Pipeline struct {
	stages []PipelineStage
	ctx    context.Context
}

// NewPipeline creates a new pipeline
func NewPipeline(ctx context.Context) *Pipeline {
	return &Pipeline{
		stages: make([]PipelineStage, 0),
		ctx:    ctx,
	}
}

// AddStage adds a processing stage
func (p *Pipeline) AddStage(stage PipelineStage) *Pipeline {
	p.stages = append(p.stages, stage)
	return p
}

// Process runs data through the pipeline
func (p *Pipeline) Process(input <-chan interface{}) <-chan interface{} {
	current := input
	for _, stage := range p.stages {
		current = stage(p.ctx, current)
	}
	return current
}

// Example pipeline stages
func doubleStage(ctx context.Context, input <-chan interface{}) <-chan interface{} {
	output := make(chan interface{})
	go func() {
		defer close(output)
		for {
			select {
			case value, ok := <-input:
				if !ok {
					return
				}
				if num, ok := value.(int); ok {
					select {
					case output <- num * 2:
					case <-ctx.Done():
						return
					}
				}
			case <-ctx.Done():
				return
			}
		}
	}()
	return output
}

func squareStage(ctx context.Context, input <-chan interface{}) <-chan interface{} {
	output := make(chan interface{})
	go func() {
		defer close(output)
		for {
			select {
			case value, ok := <-input:
				if !ok {
					return
				}
				if num, ok := value.(int); ok {
					select {
					case output <- num * num:
					case <-ctx.Done():
						return
					}
				}
			case <-ctx.Done():
				return
			}
		}
	}()
	return output
}

// =============================================================================
// 3. CIRCUIT BREAKER PATTERN
// =============================================================================

// CircuitState represents circuit breaker state
type CircuitState int

const (
	StateClosed CircuitState = iota
	StateOpen
	StateHalfOpen
)

// CircuitBreaker implements circuit breaker pattern
type CircuitBreaker struct {
	name            string
	maxFailures     int
	resetTimeout    time.Duration
	state           CircuitState
	failures        int
	lastFailureTime time.Time
	mu              sync.RWMutex
}

// NewCircuitBreaker creates a new circuit breaker
func NewCircuitBreaker(name string, maxFailures int, resetTimeout time.Duration) *CircuitBreaker {
	return &CircuitBreaker{
		name:         name,
		maxFailures:  maxFailures,
		resetTimeout: resetTimeout,
		state:        StateClosed,
	}
}

// Execute executes function with circuit breaker protection
func (cb *CircuitBreaker) Execute(fn func() (interface{}, error)) (interface{}, error) {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	// Check if circuit should be reset
	if cb.state == StateOpen && time.Since(cb.lastFailureTime) > cb.resetTimeout {
		cb.state = StateHalfOpen
		cb.failures = 0
	}

	// Reject if circuit is open
	if cb.state == StateOpen {
		return nil, fmt.Errorf("circuit breaker %s is open", cb.name)
	}

	// Execute function
	result, err := fn()

	if err != nil {
		cb.failures++
		cb.lastFailureTime = time.Now()

		if cb.failures >= cb.maxFailures {
			cb.state = StateOpen
		}
		return nil, err
	}

	// Reset on success
	if cb.state == StateHalfOpen {
		cb.state = StateClosed
	}
	cb.failures = 0

	return result, nil
}

// GetState returns current circuit state
func (cb *CircuitBreaker) GetState() CircuitState {
	cb.mu.RLock()
	defer cb.mu.RUnlock()
	return cb.state
}

// =============================================================================
// 4. RATE LIMITER PATTERN
// =============================================================================

// RateLimiter implements token bucket rate limiter
type RateLimiter struct {
	tokens     chan struct{}
	ticker     *time.Ticker
	stopCh     chan struct{}
	rate       time.Duration
	bucketSize int
}

// NewRateLimiter creates a new rate limiter
func NewRateLimiter(rate time.Duration, bucketSize int) *RateLimiter {
	rl := &RateLimiter{
		tokens:     make(chan struct{}, bucketSize),
		ticker:     time.NewTicker(rate),
		stopCh:     make(chan struct{}),
		rate:       rate,
		bucketSize: bucketSize,
	}

	// Fill initial tokens
	for i := 0; i < bucketSize; i++ {
		rl.tokens <- struct{}{}
	}

	// Start token refill
	go rl.refillTokens()

	return rl
}

// refillTokens refills tokens at specified rate
func (rl *RateLimiter) refillTokens() {
	for {
		select {
		case <-rl.ticker.C:
			select {
			case rl.tokens <- struct{}{}:
				// Token added
			default:
				// Bucket full
			}
		case <-rl.stopCh:
			rl.ticker.Stop()
			return
		}
	}
}

// Allow checks if request is allowed
func (rl *RateLimiter) Allow() bool {
	select {
	case <-rl.tokens:
		return true
	default:
		return false
	}
}

// Wait waits for a token
func (rl *RateLimiter) Wait(ctx context.Context) error {
	select {
	case <-rl.tokens:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

// Stop stops the rate limiter
func (rl *RateLimiter) Stop() {
	close(rl.stopCh)
}

// =============================================================================
// 5. DEMONSTRATION FUNCTIONS
// =============================================================================

// demonstrateContextPool shows context-aware worker pool
func demonstrateContextPool() {
	fmt.Println("\n=== Context Worker Pool Demo ===")

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	pool := NewContextWorkerPool(ctx, 3, 10)
	pool.Start()

	// Submit tasks with different timeouts
	for i := 0; i < 10; i++ {
		timeout := time.Duration(rand.Intn(1000)) * time.Millisecond
		task := Task{
			ID:      fmt.Sprintf("ctx-task-%d", i),
			Data:    fmt.Sprintf("data-%d", i),
			Timeout: timeout,
		}

		if err := pool.Submit(task); err != nil {
			fmt.Printf("Failed to submit task %s: %v\n", task.ID, err)
		}
	}

	// Collect results
	go func() {
		for i := 0; i < 10; i++ {
			select {
			case result := <-pool.resultQueue:
				if result.Error != nil {
					fmt.Printf("Task %s failed: %v\n", result.TaskID, result.Error)
				} else {
					fmt.Printf("Task %s completed in %v\n", result.TaskID, result.Duration)
				}
			case <-ctx.Done():
				return
			}
		}
	}()

	// Show metrics
	time.Sleep(2 * time.Second)
	metrics := pool.GetMetrics()
	fmt.Printf("Pool Metrics: Processed=%d, Succeeded=%d, Failed=%d, AvgLatency=%v\n",
		metrics.tasksProcessed, metrics.tasksSucceeded, metrics.tasksFailed,
		pool.GetAverageLatency())

	time.Sleep(3 * time.Second)
	pool.Stop()
}

// demonstratePipeline shows pipeline processing
func demonstratePipeline() {
	fmt.Println("\n=== Pipeline Demo ===")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Create input channel
	input := make(chan interface{}, 10)
	for i := 1; i <= 5; i++ {
		input <- i
	}
	close(input)

	// Create pipeline
	pipeline := NewPipeline(ctx).
		AddStage(doubleStage).
		AddStage(squareStage)

	// Process data
	output := pipeline.Process(input)

	// Collect results
	fmt.Println("Pipeline results:")
	for result := range output {
		fmt.Printf("Result: %v\n", result)
	}
}

// demonstrateCircuitBreaker shows circuit breaker pattern
func demonstrateCircuitBreaker() {
	fmt.Println("\n=== Circuit Breaker Demo ===")

	cb := NewCircuitBreaker("test-service", 3, 5*time.Second)

	// Simulate function that fails sometimes
	unreliableFunction := func() (interface{}, error) {
		if rand.Float32() < 0.7 { // 70% failure rate
			return nil, fmt.Errorf("service unavailable")
		}
		return "success", nil
	}

	// Test circuit breaker
	for i := 0; i < 10; i++ {
		result, err := cb.Execute(unreliableFunction)
		if err != nil {
			fmt.Printf("Call %d failed: %v (State: %v)\n", i+1, err, cb.GetState())
		} else {
			fmt.Printf("Call %d succeeded: %v (State: %v)\n", i+1, result, cb.GetState())
		}
		time.Sleep(500 * time.Millisecond)
	}
}

// demonstrateRateLimiter shows rate limiting
func demonstrateRateLimiter() {
	fmt.Println("\n=== Rate Limiter Demo ===")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Create rate limiter: 1 token per second, bucket size 3
	rl := NewRateLimiter(1*time.Second, 3)
	defer rl.Stop()

	// Simulate requests
	for i := 0; i < 8; i++ {
		start := time.Now()
		if rl.Allow() {
			fmt.Printf("Request %d: Allowed immediately (took %v)\n", i+1, time.Since(start))
		} else {
			fmt.Printf("Request %d: Rate limited, waiting...\n", i+1)
			if err := rl.Wait(ctx); err != nil {
				fmt.Printf("Request %d: Wait failed: %v\n", i+1, err)
				break
			}
			fmt.Printf("Request %d: Allowed after wait (took %v)\n", i+1, time.Since(start))
		}
		time.Sleep(300 * time.Millisecond)
	}
}

// =============================================================================
// 6. MAIN FUNCTION
// =============================================================================

func advancedMain() {
	fmt.Printf("Advanced Concurrency Patterns Demo\n")
	fmt.Printf("Go version: %s\n", runtime.Version())
	fmt.Printf("GOMAXPROCS: %d\n", runtime.GOMAXPROCS(0))

	// Seed random number generator
	rand.Seed(time.Now().UnixNano())

	// Demonstrate different patterns
	demonstrateContextPool()
	demonstratePipeline()
	demonstrateCircuitBreaker()
	demonstrateRateLimiter()

	fmt.Println("\n=== All advanced pattern demos completed ===")
}

// =============================================================================
// KEY PATTERNS DEMONSTRATED:
//
// 1. Context-Aware Worker Pool - Proper context cancellation and timeouts
// 2. Pipeline Pattern - Fan-out/fan-in data processing
// 3. Circuit Breaker - Fault tolerance and service protection
// 4. Rate Limiter - Request throttling and backpressure
// 5. Metrics Collection - Performance monitoring
// 6. Graceful Shutdown - Clean resource cleanup
//
// To run: go run advanced-patterns.go
// =============================================================================
