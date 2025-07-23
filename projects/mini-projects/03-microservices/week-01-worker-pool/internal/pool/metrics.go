package pool

import (
	"sync/atomic"
	"time"

	"github.com/cs-mastery/worker-pool/pkg/types"
)

// Metrics collects and tracks performance metrics for the worker pool
type Metrics struct {
	// TODO: Add metrics fields
	// Hints:
	// - Use atomic operations for counters to avoid locks
	// - Track various performance metrics
	// - Include timing information
	// - Add fields for rates and averages

	// Example implementation:
	// jobsSubmitted   int64
	// jobsProcessed   int64
	// jobsSucceeded   int64
	// jobsFailed      int64
	// totalLatency    int64 // in nanoseconds
	// activeWorkers   int32
	// queueLength     int32
	// totalWorkers    int32
	// startTime       time.Time
	// mu              sync.RWMutex
	// enabled         bool
	// updateInterval  time.Duration
}

// NewMetrics creates a new metrics collector
func NewMetrics(enabled bool, updateInterval time.Duration) *Metrics {
	// TODO: Implement metrics creation
	// Hints:
	// - Initialize all fields
	// - Set start time
	// - Configure update interval
	// - Return new metrics instance

	return &Metrics{
		// TODO: Initialize fields
		// Example:
		// startTime:      time.Now(),
		// enabled:        enabled,
		// updateInterval: updateInterval,
	}
}

// Start begins metrics collection
func (m *Metrics) Start() {
	// TODO: Implement metrics collection startup
	// Hints:
	// - Check if metrics are enabled
	// - Start background goroutine for periodic updates
	// - Handle graceful shutdown

	if !m.enabled {
		return
	}

	// TODO: Add implementation
	// Example structure:
	// go m.updateLoop()
}

// Stop stops metrics collection
func (m *Metrics) Stop() {
	// TODO: Implement metrics collection shutdown
	// Hints:
	// - Set enabled flag to false
	// - Signal background goroutine to stop
	// - Wait for cleanup if needed

	m.mu.Lock()
	defer m.mu.Unlock()
	m.enabled = false
}

// updateLoop runs periodic metrics updates
func (m *Metrics) updateLoop() {
	// TODO: Implement periodic metrics updates
	// Hints:
	// - Use ticker for regular intervals
	// - Update calculated metrics (rates, averages)
	// - Continue until metrics are disabled

	ticker := time.NewTicker(m.updateInterval)
	defer ticker.Stop()

	// TODO: Add implementation
	// Example structure:
	// for {
	//     select {
	//     case <-ticker.C:
	//         if !m.enabled {
	//             return
	//         }
	//         m.updateCalculatedMetrics()
	//     }
	// }
}

// updateCalculatedMetrics updates derived metrics
func (m *Metrics) updateCalculatedMetrics() {
	// TODO: Implement calculated metrics updates
	// Hints:
	// - Calculate rates (jobs per second)
	// - Update average latency
	// - Calculate success/failure rates
	// - Update other derived metrics
}

// IncrementJobsSubmitted increments the jobs submitted counter
func (m *Metrics) IncrementJobsSubmitted() {
	// TODO: Implement jobs submitted increment
	// Hints:
	// - Use atomic operation for thread safety
	// - Only increment if metrics are enabled

	if !m.enabled {
		return
	}

	// TODO: Add implementation
	// Example: atomic.AddInt64(&m.jobsSubmitted, 1)
}

// IncrementJobsProcessed increments the jobs processed counter
func (m *Metrics) IncrementJobsProcessed() {
	// TODO: Implement jobs processed increment
	// Hints:
	// - Use atomic operation for thread safety
	// - Only increment if metrics are enabled

	if !m.enabled {
		return
	}

	// TODO: Add implementation
	// Example: atomic.AddInt64(&m.jobsProcessed, 1)
}

// IncrementJobsSucceeded increments the jobs succeeded counter
func (m *Metrics) IncrementJobsSucceeded() {
	// TODO: Implement jobs succeeded increment
	// Hints:
	// - Use atomic operation for thread safety
	// - Also increment jobs processed
	// - Only increment if metrics are enabled

	if !m.enabled {
		return
	}

	// TODO: Add implementation
	// Example:
	// atomic.AddInt64(&m.jobsSucceeded, 1)
	// m.IncrementJobsProcessed()
}

// IncrementJobsFailed increments the jobs failed counter
func (m *Metrics) IncrementJobsFailed() {
	// TODO: Implement jobs failed increment
	// Hints:
	// - Use atomic operation for thread safety
	// - Also increment jobs processed
	// - Only increment if metrics are enabled

	if !m.enabled {
		return
	}

	// TODO: Add implementation
	// Example:
	// atomic.AddInt64(&m.jobsFailed, 1)
	// m.IncrementJobsProcessed()
}

// AddLatency adds a job latency measurement
func (m *Metrics) AddLatency(duration time.Duration) {
	// TODO: Implement latency tracking
	// Hints:
	// - Use atomic operation for thread safety
	// - Convert duration to nanoseconds
	// - Add to total latency for average calculation
	// - Only track if metrics are enabled

	if !m.enabled {
		return
	}

	// TODO: Add implementation
	// Example: atomic.AddInt64(&m.totalLatency, int64(duration))
}

// SetActiveWorkers sets the current number of active workers
func (m *Metrics) SetActiveWorkers(count int32) {
	// TODO: Implement active workers setter
	// Hints:
	// - Use atomic operation for thread safety
	// - Only set if metrics are enabled

	if !m.enabled {
		return
	}

	// TODO: Add implementation
	// Example: atomic.StoreInt32(&m.activeWorkers, count)
}

// SetQueueLength sets the current queue length
func (m *Metrics) SetQueueLength(length int32) {
	// TODO: Implement queue length setter
	// Hints:
	// - Use atomic operation for thread safety
	// - Only set if metrics are enabled

	if !m.enabled {
		return
	}

	// TODO: Add implementation
	// Example: atomic.StoreInt32(&m.queueLength, length)
}

// SetTotalWorkers sets the total number of workers
func (m *Metrics) SetTotalWorkers(count int32) {
	// TODO: Implement total workers setter
	// Hints:
	// - Use atomic operation for thread safety
	// - Only set if metrics are enabled

	if !m.enabled {
		return
	}

	// TODO: Add implementation
	// Example: atomic.StoreInt32(&m.totalWorkers, count)
}

// GetSnapshot returns a snapshot of current metrics
func (m *Metrics) GetSnapshot() types.PoolMetrics {
	// TODO: Implement metrics snapshot
	// Hints:
	// - Read all metrics atomically
	// - Calculate derived values (averages, rates)
	// - Return structured metrics
	// - Handle case where metrics are disabled

	if !m.enabled {
		return types.PoolMetrics{}
	}

	// TODO: Add implementation
	// Example structure:
	// return types.PoolMetrics{
	//     JobsSubmitted:  atomic.LoadInt64(&m.jobsSubmitted),
	//     JobsProcessed:  atomic.LoadInt64(&m.jobsProcessed),
	//     JobsSucceeded:  atomic.LoadInt64(&m.jobsSucceeded),
	//     JobsFailed:     atomic.LoadInt64(&m.jobsFailed),
	//     AverageLatency: m.calculateAverageLatency(),
	//     ActiveWorkers:  atomic.LoadInt32(&m.activeWorkers),
	//     QueueLength:    atomic.LoadInt32(&m.queueLength),
	//     TotalWorkers:   atomic.LoadInt32(&m.totalWorkers),
	// }

	return types.PoolMetrics{} // TODO: Remove this line when implementing
}

// calculateAverageLatency calculates the average job latency
func (m *Metrics) calculateAverageLatency() time.Duration {
	// TODO: Implement average latency calculation
	// Hints:
	// - Read total latency and jobs processed atomically
	// - Handle division by zero
	// - Return average as time.Duration

	processed := atomic.LoadInt64(&m.jobsProcessed)
	if processed == 0 {
		return 0
	}

	totalLatency := atomic.LoadInt64(&m.totalLatency)
	return time.Duration(totalLatency / processed)
}

// GetJobsPerSecond calculates the current jobs per second rate
func (m *Metrics) GetJobsPerSecond() float64 {
	// TODO: Implement jobs per second calculation
	// Hints:
	// - Calculate based on jobs processed and elapsed time
	// - Handle edge cases (zero time, zero jobs)
	// - Return rate as float64

	elapsed := time.Since(m.startTime).Seconds()
	if elapsed == 0 {
		return 0
	}

	processed := atomic.LoadInt64(&m.jobsProcessed)
	return float64(processed) / elapsed
}

// GetSuccessRate calculates the job success rate as a percentage
func (m *Metrics) GetSuccessRate() float64 {
	// TODO: Implement success rate calculation
	// Hints:
	// - Calculate based on succeeded vs processed jobs
	// - Handle division by zero
	// - Return percentage (0.0 to 100.0)

	processed := atomic.LoadInt64(&m.jobsProcessed)
	if processed == 0 {
		return 0
	}

	succeeded := atomic.LoadInt64(&m.jobsSucceeded)
	return (float64(succeeded) / float64(processed)) * 100.0
}

// GetFailureRate calculates the job failure rate as a percentage
func (m *Metrics) GetFailureRate() float64 {
	// TODO: Implement failure rate calculation
	// Hints:
	// - Calculate based on failed vs processed jobs
	// - Handle division by zero
	// - Return percentage (0.0 to 100.0)

	processed := atomic.LoadInt64(&m.jobsProcessed)
	if processed == 0 {
		return 0
	}

	failed := atomic.LoadInt64(&m.jobsFailed)
	return (float64(failed) / float64(processed)) * 100.0
}

// Reset resets all metrics to zero
func (m *Metrics) Reset() {
	// TODO: Implement metrics reset
	// Hints:
	// - Reset all atomic counters to zero
	// - Reset start time to current time
	// - Only reset if metrics are enabled

	if !m.enabled {
		return
	}

	// TODO: Add implementation
	// Example:
	// atomic.StoreInt64(&m.jobsSubmitted, 0)
	// atomic.StoreInt64(&m.jobsProcessed, 0)
	// atomic.StoreInt64(&m.jobsSucceeded, 0)
	// atomic.StoreInt64(&m.jobsFailed, 0)
	// atomic.StoreInt64(&m.totalLatency, 0)
	// m.startTime = time.Now()
}

// IsEnabled returns whether metrics collection is enabled
func (m *Metrics) IsEnabled() bool {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.enabled
}

// TODO: Add any additional metrics methods you think would be useful
// Consider:
// - Histogram tracking for latency distribution
// - Percentile calculations (P50, P95, P99)
// - Error rate by error type
// - Worker utilization metrics
// - Queue depth over time
// - Memory usage tracking
