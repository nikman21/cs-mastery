package types

import (
	"context"
)

// Job represents a unit of work to be processed by the worker pool
type Job struct {
	// TODO: Add job fields
	// Hints:
	// - ID: unique identifier for the job
	// - Data: the actual work payload
	// - Priority: job priority (optional for advanced features)
	// - Timeout: maximum time allowed for job processing
	// - CreatedAt: timestamp when job was created
	// - Context: context for cancellation (optional)

	// Example implementation:
	// ID        string
	// Data      interface{}
	// Priority  int
	// Timeout   time.Duration
	// CreatedAt time.Time
	// Context   context.Context
}

// JobResult represents the outcome of job processing
type JobResult struct {
	// TODO: Add result fields
	// Hints:
	// - JobID: reference to the original job
	// - Data: processed result data
	// - Error: any error that occurred during processing
	// - WorkerID: which worker processed this job
	// - StartTime: when processing started
	// - EndTime: when processing completed
	// - Duration: how long processing took

	// Example implementation:
	// JobID     string
	// Data      interface{}
	// Error     error
	// WorkerID  int
	// StartTime time.Time
	// EndTime   time.Time
	// Duration  time.Duration
}

// WorkerPool defines the interface for a worker pool
type WorkerPool interface {
	// TODO: Define worker pool interface
	// Hints:
	// - Start() error: start the worker pool
	// - Stop() error: gracefully stop the worker pool
	// - Submit(job Job) error: submit a job for processing
	// - SubmitWithContext(ctx context.Context, job Job) error: submit with context
	// - GetMetrics() PoolMetrics: get current pool metrics
	// - SetWorkerCount(count int) error: dynamically adjust worker count

	// Example interface:
	// Start() error
	// Stop() error
	// Submit(job Job) error
	// SubmitWithContext(ctx context.Context, job Job) error
	// GetResult() (JobResult, error)
	// GetMetrics() PoolMetrics
}

// PoolMetrics contains performance metrics for the worker pool
type PoolMetrics struct {
	// TODO: Add metrics fields
	// Hints:
	// - JobsSubmitted: total jobs submitted
	// - JobsProcessed: total jobs completed
	// - JobsSucceeded: jobs completed successfully
	// - JobsFailed: jobs that failed
	// - AverageLatency: average time to process a job
	// - ActiveWorkers: current number of active workers
	// - QueueLength: current number of jobs in queue
	// - TotalWorkers: total number of workers

	// Example implementation:
	// JobsSubmitted   int64
	// JobsProcessed   int64
	// JobsSucceeded   int64
	// JobsFailed      int64
	// AverageLatency  time.Duration
	// ActiveWorkers   int32
	// QueueLength     int32
	// TotalWorkers    int32
}

// JobStatus represents the current status of a job
type JobStatus int

const (
	// TODO: Define job status constants
	// Hints:
	// - JobPending: job is waiting to be processed
	// - JobProcessing: job is currently being processed
	// - JobCompleted: job completed successfully
	// - JobFailed: job failed during processing
	// - JobCancelled: job was cancelled
	// - JobTimedOut: job exceeded timeout duration

	// Example implementation:
	// JobPending JobStatus = iota
	// JobProcessing
	// JobCompleted
	// JobFailed
	// JobCancelled
	// JobTimedOut
	_ JobStatus = iota // TODO: Replace with actual constants
)

// Worker represents an individual worker in the pool
type Worker struct {
	// TODO: Add worker fields
	// Hints:
	// - ID: unique worker identifier
	// - Status: current worker status (idle, busy, stopped)
	// - JobsProcessed: number of jobs this worker has processed
	// - LastJobTime: when this worker last processed a job
	// - StartTime: when this worker was started

	// Example implementation:
	// ID            int
	// Status        WorkerStatus
	// JobsProcessed int64
	// LastJobTime   time.Time
	// StartTime     time.Time
}

// WorkerStatus represents the current status of a worker
type WorkerStatus int

const (
	// TODO: Define worker status constants
	// Hints:
	// - WorkerIdle: worker is waiting for jobs
	// - WorkerBusy: worker is processing a job
	// - WorkerStopped: worker has been stopped

	// Example implementation:
	// WorkerIdle WorkerStatus = iota
	// WorkerBusy
	// WorkerStopped
	_ WorkerStatus = iota // TODO: Replace with actual constants
)

// PoolConfig contains configuration for the worker pool
type PoolConfig struct {
	// TODO: Add configuration fields
	// Hints:
	// - WorkerCount: number of workers to create
	// - QueueSize: size of the job queue buffer
	// - JobTimeout: default timeout for jobs
	// - ShutdownTimeout: how long to wait for graceful shutdown
	// - EnableMetrics: whether to collect metrics
	// - MetricsInterval: how often to update metrics

	// Example implementation:
	// WorkerCount      int
	// QueueSize        int
	// JobTimeout       time.Duration
	// ShutdownTimeout  time.Duration
	// EnableMetrics    bool
	// MetricsInterval  time.Duration
}

// DefaultPoolConfig returns a default configuration for the worker pool
func DefaultPoolConfig() PoolConfig {
	// TODO: Implement default configuration
	// Hints:
	// - Use reasonable defaults for all fields
	// - Consider the target machine's CPU count for worker count
	// - Set appropriate timeouts for different scenarios

	return PoolConfig{
		// TODO: Add default values
		// Example:
		// WorkerCount:     runtime.NumCPU(),
		// QueueSize:       1000,
		// JobTimeout:      30 * time.Second,
		// ShutdownTimeout: 10 * time.Second,
		// EnableMetrics:   true,
		// MetricsInterval: 1 * time.Second,
	}
}

// JobHandler defines a function type for processing jobs
type JobHandler func(ctx context.Context, job Job) (interface{}, error)

// ResultHandler defines a function type for handling job results
type ResultHandler func(result JobResult)

// ErrorHandler defines a function type for handling errors
type ErrorHandler func(err error)

// TODO: Add any additional types or interfaces you think would be useful
// Consider:
// - Priority queue interfaces
// - Job retry mechanisms
// - Circuit breaker types
// - Rate limiting types
// - Monitoring and alerting types
