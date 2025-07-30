package pool

import (
	"context"
	"sync"
	"time"

	"github.com/cs-mastery/worker-pool/pkg/types"
)

// Worker represents an individual worker in the pool
type Worker struct {
	// TODO: Add worker fields
	// Hints:
	// - id: unique worker identifier
	// - jobQueue: channel to receive jobs from
	// - resultQueue: channel to send results to
	// - ctx: context for cancellation
	// - status: current worker status
	// - jobsProcessed: counter for processed jobs
	// - lastJobTime: timestamp of last job processing
	// - startTime: when worker was started
	// - mu: mutex for thread safety

	// Example implementation:
	// id            int
	// jobQueue      <-chan types.Job
	// resultQueue   chan<- types.JobResult
	// ctx           context.Context
	// status        types.WorkerStatus
	// jobsProcessed int64
	// lastJobTime   time.Time
	// startTime     time.Time
	// mu            sync.RWMutex
}

// NewWorker creates a new worker with the given parameters
func NewWorker(id int, jobQueue <-chan types.Job, resultQueue chan<- types.JobResult, ctx context.Context) *Worker {
	// TODO: Implement worker creation
	// Hints:
	// - Initialize all worker fields
	// - Set status to idle initially
	// - Record start time
	// - Return pointer to new worker

	return &Worker{
		// TODO: Initialize fields
		// Example:
		// id:          id,
		// jobQueue:    jobQueue,
		// resultQueue: resultQueue,
		// ctx:         ctx,
		// status:      types.WorkerIdle,
		// startTime:   time.Now(),
	}
}

// Start begins the worker's job processing loop
func (w *Worker) Start(wg *sync.WaitGroup) {
	// TODO: Implement worker start logic
	// Hints:
	// - Defer wg.Done() to signal completion
	// - Run main processing loop
	// - Handle graceful shutdown on context cancellation
	// - Update worker status appropriately

	defer wg.Done()

	// TODO: Add implementation
	// Example structure:
	// for {
	//     select {
	//     case job, ok := <-w.jobQueue:
	//         if !ok {
	//             // Job queue closed, exit
	//             return
	//         }
	//         w.processJob(job)
	//     case <-w.ctx.Done():
	//         // Context cancelled, graceful shutdown
	//         return
	//     }
	// }
}

// processJob handles the processing of a single job
func (w *Worker) processJob(job types.Job) {
	// TODO: Implement job processing logic
	// Hints:
	// - Update worker status to busy
	// - Record job start time
	// - Set up job timeout if specified
	// - Call the actual job processing function
	// - Handle job cancellation via context
	// - Record processing time and update metrics
	// - Send result to result queue
	// - Update worker status back to idle

	// TODO: Add implementation
	// Example structure:
	// w.setStatus(types.WorkerBusy)
	// defer w.setStatus(types.WorkerIdle)
	//
	// startTime := time.Now()
	// w.lastJobTime = startTime
	//
	// result := types.JobResult{
	//     JobID:     job.ID,
	//     WorkerID:  w.id,
	//     StartTime: startTime,
	// }
	//
	// // Set up job context with timeout
	// jobCtx := w.ctx
	// if job.Timeout > 0 {
	//     var cancel context.CancelFunc
	//     jobCtx, cancel = context.WithTimeout(w.ctx, job.Timeout)
	//     defer cancel()
	// }
	//
	// // Process the job
	// data, err := w.executeJob(jobCtx, job)
	// endTime := time.Now()
	//
	// result.Data = data
	// result.Error = err
	// result.EndTime = endTime
	// result.Duration = endTime.Sub(startTime)
	//
	// // Send result
	// select {
	// case w.resultQueue <- result:
	//     w.jobsProcessed++
	// case <-w.ctx.Done():
	//     // Worker shutting down
	//     return
	// }
}

// executeJob performs the actual job work
func (w *Worker) executeJob(ctx context.Context, job types.Job) (interface{}, error) {
	// TODO: Implement job execution logic
	// Hints:
	// - This is where the actual work happens
	// - Respect context cancellation
	// - Handle different job types if needed
	// - Simulate work for now (can be replaced with real logic)
	// - Return processed data or error

	// TODO: Add implementation
	// Example structure (for simulation):
	// // Simulate work that respects context
	// select {
	// case <-time.After(100 * time.Millisecond): // Simulate work time
	//     // Job completed successfully
	//     return fmt.Sprintf("Processed: %v", job.Data), nil
	// case <-ctx.Done():
	//     // Job was cancelled
	//     return nil, ctx.Err()
	// }

	return nil, nil // TODO: Remove this line when implementing
}

// Stop gracefully stops the worker
func (w *Worker) Stop() {
	// TODO: Implement worker stop logic
	// Hints:
	// - Update worker status to stopped
	// - The actual stopping is handled by context cancellation
	// - This method is mainly for status tracking

	w.setStatus(types.WorkerStopped)
}

// GetStatus returns the current worker status
func (w *Worker) GetStatus() types.WorkerStatus {
	// TODO: Implement status getter
	// Hints:
	// - Use read lock for thread safety
	// - Return current status

	w.mu.RLock()
	defer w.mu.RUnlock()
	return w.status
}

// setStatus updates the worker status
func (w *Worker) setStatus(status types.WorkerStatus) {
	// TODO: Implement status setter
	// Hints:
	// - Use write lock for thread safety
	// - Update status field

	w.mu.Lock()
	defer w.mu.Unlock()
	w.status = status
}

// GetID returns the worker ID
func (w *Worker) GetID() int {
	return w.id
}

// GetJobsProcessed returns the number of jobs processed by this worker
func (w *Worker) GetJobsProcessed() int64 {
	// TODO: Implement jobs processed counter getter
	// Hints:
	// - Use read lock for thread safety
	// - Return jobs processed count

	w.mu.RLock()
	defer w.mu.RUnlock()
	return w.jobsProcessed
}

// GetLastJobTime returns when this worker last processed a job
func (w *Worker) GetLastJobTime() time.Time {
	// TODO: Implement last job time getter
	// Hints:
	// - Use read lock for thread safety
	// - Return last job time

	w.mu.RLock()
	defer w.mu.RUnlock()
	return w.lastJobTime
}

// GetStartTime returns when this worker was started
func (w *Worker) GetStartTime() time.Time {
	return w.startTime
}

// GetUptime returns how long this worker has been running
func (w *Worker) GetUptime() time.Duration {
	return time.Since(w.startTime)
}

// IsIdle returns whether the worker is currently idle
func (w *Worker) IsIdle() bool {
	return w.GetStatus() == types.WorkerIdle
}

// IsBusy returns whether the worker is currently processing a job
func (w *Worker) IsBusy() bool {
	return w.GetStatus() == types.WorkerBusy
}

// IsStopped returns whether the worker has been stopped
func (w *Worker) IsStopped() bool {
	return w.GetStatus() == types.WorkerStopped
}

// TODO: Add any additional methods you think would be useful
// Consider:
// - Health check methods
// - Performance metrics for individual workers
// - Job history tracking
// - Error rate tracking
// - Load balancing hints
