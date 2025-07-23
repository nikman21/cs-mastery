// Week 1 Examples: Go Fundamentals and Basic Patterns
// This file demonstrates essential Go programming concepts

package main

import (
	"fmt"
	"log"
	"runtime"
	"sync"
	"time"
)

// =============================================================================
// 1. BASIC GO SYNTAX AND TYPES
// =============================================================================

// User represents a system user
type User struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	IsActive bool   `json:"is_active"`
}

// String implements the Stringer interface
func (u User) String() string {
	return fmt.Sprintf("User{ID: %d, Name: %s, Email: %s}", u.ID, u.Name, u.Email)
}

// Validate validates user data
func (u *User) Validate() error {
	if u.Name == "" {
		return fmt.Errorf("name cannot be empty")
	}
	if u.Email == "" {
		return fmt.Errorf("email cannot be empty")
	}
	return nil
}

// UserService handles user operations
type UserService struct {
	users map[int]*User
	mu    sync.RWMutex
}

// NewUserService creates a new user service
func NewUserService() *UserService {
	return &UserService{
		users: make(map[int]*User),
	}
}

// AddUser adds a user to the service
func (s *UserService) AddUser(user *User) error {
	if err := user.Validate(); err != nil {
		return err
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	s.users[user.ID] = user
	return nil
}

// GetUser retrieves a user by ID
func (s *UserService) GetUser(id int) (*User, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	user, exists := s.users[id]
	if !exists {
		return nil, fmt.Errorf("user with ID %d not found", id)
	}

	return user, nil
}

// GetAllUsers returns all users
func (s *UserService) GetAllUsers() []*User {
	s.mu.RLock()
	defer s.mu.RUnlock()

	users := make([]*User, 0, len(s.users))
	for _, user := range s.users {
		users = append(users, user)
	}

	return users
}

// =============================================================================
// 2. GOROUTINES AND BASIC CONCURRENCY
// =============================================================================

// demonstrateBasicGoroutines shows simple goroutine usage
func demonstrateBasicGoroutines() {
	fmt.Println("\n=== Basic Goroutines Demo ===")

	// Sequential execution
	fmt.Println("Sequential execution:")
	start := time.Now()
	for i := 0; i < 3; i++ {
		doWork(i, 1*time.Second)
	}
	fmt.Printf("Sequential took: %v\n", time.Since(start))

	// Concurrent execution
	fmt.Println("\nConcurrent execution:")
	start = time.Now()
	var wg sync.WaitGroup

	for i := 0; i < 3; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			doWork(id, 1*time.Second)
		}(i)
	}

	wg.Wait()
	fmt.Printf("Concurrent took: %v\n", time.Since(start))
}

// doWork simulates some work
func doWork(id int, duration time.Duration) {
	fmt.Printf("Worker %d starting\n", id)
	time.Sleep(duration)
	fmt.Printf("Worker %d finished\n", id)
}

// =============================================================================
// 3. CHANNELS AND COMMUNICATION
// =============================================================================

// Job represents a unit of work
type Job struct {
	ID   string
	Data interface{}
}

// Result represents job processing result
type Result struct {
	JobID string
	Data  interface{}
	Error error
}

// demonstrateChannels shows channel communication patterns
func demonstrateChannels() {
	fmt.Println("\n=== Channel Communication Demo ===")

	// Unbuffered channel (synchronous)
	fmt.Println("Unbuffered channel:")
	ch := make(chan string)

	go func() {
		ch <- "Hello from goroutine"
	}()

	message := <-ch
	fmt.Printf("Received: %s\n", message)

	// Buffered channel (asynchronous)
	fmt.Println("\nBuffered channel:")
	bufferedCh := make(chan int, 3)

	// Send multiple values without blocking
	bufferedCh <- 1
	bufferedCh <- 2
	bufferedCh <- 3

	// Receive values
	for i := 0; i < 3; i++ {
		value := <-bufferedCh
		fmt.Printf("Received: %d\n", value)
	}

	// Producer-Consumer pattern
	fmt.Println("\nProducer-Consumer pattern:")
	demonstrateProducerConsumer()
}

// demonstrateProducerConsumer shows producer-consumer pattern
func demonstrateProducerConsumer() {
	jobs := make(chan Job, 10)
	results := make(chan Result, 10)

	// Start producer
	go producer(jobs)

	// Start consumers
	numWorkers := 3
	var wg sync.WaitGroup

	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go consumer(i, jobs, results, &wg)
	}

	// Start result collector
	go resultCollector(results, 10)

	// Wait for all workers to finish
	wg.Wait()
	close(results)

	// Give result collector time to finish
	time.Sleep(100 * time.Millisecond)
}

// producer generates jobs
func producer(jobs chan<- Job) {
	defer close(jobs)

	for i := 0; i < 10; i++ {
		job := Job{
			ID:   fmt.Sprintf("job-%d", i),
			Data: i * 2,
		}
		jobs <- job
		fmt.Printf("Produced: %s\n", job.ID)
	}
}

// consumer processes jobs
func consumer(id int, jobs <-chan Job, results chan<- Result, wg *sync.WaitGroup) {
	defer wg.Done()

	for job := range jobs {
		fmt.Printf("Worker %d processing %s\n", id, job.ID)

		// Simulate work
		time.Sleep(100 * time.Millisecond)

		// Process the job
		result := Result{
			JobID: job.ID,
			Data:  job.Data.(int) * 10,
			Error: nil,
		}

		results <- result
	}

	fmt.Printf("Worker %d finished\n", id)
}

// resultCollector collects and prints results
func resultCollector(results <-chan Result, expectedCount int) {
	received := 0
	for result := range results {
		fmt.Printf("Result: %s -> %v\n", result.JobID, result.Data)
		received++
		if received >= expectedCount {
			break
		}
	}
	fmt.Printf("Collected %d results\n", received)
}

// =============================================================================
// 4. SELECT STATEMENT AND TIMEOUTS
// =============================================================================

// demonstrateSelect shows select statement usage
func demonstrateSelect() {
	fmt.Println("\n=== Select Statement Demo ===")

	// Non-blocking channel operations
	ch1 := make(chan string)
	ch2 := make(chan string)

	go func() {
		time.Sleep(100 * time.Millisecond)
		ch1 <- "from ch1"
	}()

	go func() {
		time.Sleep(200 * time.Millisecond)
		ch2 <- "from ch2"
	}()

	// Select with timeout
	for i := 0; i < 2; i++ {
		select {
		case msg1 := <-ch1:
			fmt.Printf("Received %s\n", msg1)
		case msg2 := <-ch2:
			fmt.Printf("Received %s\n", msg2)
		case <-time.After(500 * time.Millisecond):
			fmt.Println("Timeout!")
		}
	}

	// Non-blocking operations
	fmt.Println("\nNon-blocking operations:")
	nonBlockingCh := make(chan string, 1)

	select {
	case nonBlockingCh <- "hello":
		fmt.Println("Sent message")
	default:
		fmt.Println("Channel full, cannot send")
	}

	select {
	case msg := <-nonBlockingCh:
		fmt.Printf("Received: %s\n", msg)
	default:
		fmt.Println("No message available")
	}
}

// =============================================================================
// 5. ERROR HANDLING AND PANIC RECOVERY
// =============================================================================

// CustomError represents a custom error type
type CustomError struct {
	Code    int
	Message string
	Cause   error
}

func (e CustomError) Error() string {
	if e.Cause != nil {
		return fmt.Sprintf("error %d: %s (caused by: %v)", e.Code, e.Message, e.Cause)
	}
	return fmt.Sprintf("error %d: %s", e.Code, e.Message)
}

// demonstrateErrorHandling shows Go error handling patterns
func demonstrateErrorHandling() {
	fmt.Println("\n=== Error Handling Demo ===")

	// Basic error handling
	result, err := divideNumbers(10, 2)
	if err != nil {
		log.Printf("Error: %v", err)
	} else {
		fmt.Printf("10 / 2 = %.2f\n", result)
	}

	// Error with zero division
	result, err = divideNumbers(10, 0)
	if err != nil {
		log.Printf("Error: %v", err)
	} else {
		fmt.Printf("Result: %.2f\n", result)
	}

	// Panic recovery
	fmt.Println("\nPanic recovery demo:")
	demonstratePanicRecovery()
}

// divideNumbers divides two numbers with error handling
func divideNumbers(a, b float64) (float64, error) {
	if b == 0 {
		return 0, CustomError{
			Code:    400,
			Message: "division by zero",
			Cause:   nil,
		}
	}
	return a / b, nil
}

// demonstratePanicRecovery shows panic recovery
func demonstratePanicRecovery() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("Recovered from panic: %v\n", r)
		}
	}()

	// This will panic
	riskyOperation()
}

// riskyOperation simulates an operation that panics
func riskyOperation() {
	panic("something went wrong!")
}

// =============================================================================
// 6. INTERFACES AND POLYMORPHISM
// =============================================================================

// Processor defines processing interface
type Processor interface {
	Process(data interface{}) (interface{}, error)
	GetName() string
}

// StringProcessor processes strings
type StringProcessor struct {
	Name string
}

func (sp StringProcessor) Process(data interface{}) (interface{}, error) {
	str, ok := data.(string)
	if !ok {
		return nil, fmt.Errorf("expected string, got %T", data)
	}
	return fmt.Sprintf("Processed: %s", str), nil
}

func (sp StringProcessor) GetName() string {
	return sp.Name
}

// NumberProcessor processes numbers
type NumberProcessor struct {
	Name       string
	Multiplier int
}

func (np NumberProcessor) Process(data interface{}) (interface{}, error) {
	num, ok := data.(int)
	if !ok {
		return nil, fmt.Errorf("expected int, got %T", data)
	}
	return num * np.Multiplier, nil
}

func (np NumberProcessor) GetName() string {
	return np.Name
}

// ProcessorManager manages multiple processors
type ProcessorManager struct {
	processors []Processor
}

func NewProcessorManager() *ProcessorManager {
	return &ProcessorManager{
		processors: make([]Processor, 0),
	}
}

func (pm *ProcessorManager) AddProcessor(p Processor) {
	pm.processors = append(pm.processors, p)
}

func (pm *ProcessorManager) ProcessAll(data interface{}) {
	for _, processor := range pm.processors {
		result, err := processor.Process(data)
		if err != nil {
			fmt.Printf("Processor %s failed: %v\n", processor.GetName(), err)
		} else {
			fmt.Printf("Processor %s result: %v\n", processor.GetName(), result)
		}
	}
}

// demonstrateInterfaces shows interface usage
func demonstrateInterfaces() {
	fmt.Println("\n=== Interfaces Demo ===")

	manager := NewProcessorManager()

	// Add different processor implementations
	manager.AddProcessor(StringProcessor{Name: "String Processor"})
	manager.AddProcessor(NumberProcessor{Name: "Number Processor", Multiplier: 2})

	// Process string data
	fmt.Println("Processing string:")
	manager.ProcessAll("hello world")

	// Process number data
	fmt.Println("\nProcessing number:")
	manager.ProcessAll(42)

	// Process invalid data
	fmt.Println("\nProcessing invalid data:")
	manager.ProcessAll([]int{1, 2, 3})
}

// =============================================================================
// 7. MAIN FUNCTION AND DEMONSTRATIONS
// =============================================================================

func main() {
	fmt.Printf("Go Fundamentals Demo\n")
	fmt.Printf("Go version: %s\n", runtime.Version())
	fmt.Printf("GOMAXPROCS: %d\n", runtime.GOMAXPROCS(0))

	// User service demo
	fmt.Println("\n=== User Service Demo ===")
	userService := NewUserService()

	users := []*User{
		{ID: 1, Name: "Alice", Email: "alice@example.com", IsActive: true},
		{ID: 2, Name: "Bob", Email: "bob@example.com", IsActive: true},
		{ID: 3, Name: "Charlie", Email: "charlie@example.com", IsActive: false},
	}

	for _, user := range users {
		if err := userService.AddUser(user); err != nil {
			log.Printf("Failed to add user: %v", err)
		} else {
			fmt.Printf("Added user: %s\n", user)
		}
	}

	// Retrieve users
	if user, err := userService.GetUser(1); err != nil {
		log.Printf("Error: %v", err)
	} else {
		fmt.Printf("Retrieved user: %s\n", user)
	}

	// Run demonstrations
	demonstrateBasicGoroutines()
	demonstrateChannels()
	demonstrateSelect()
	demonstrateErrorHandling()
	demonstrateInterfaces()

	fmt.Println("\n=== All demos completed ===")
}

// =============================================================================
// USAGE NOTES:
//
// 1. This file demonstrates fundamental Go concepts essential for microservices
// 2. Focus on concurrency patterns - goroutines, channels, select statements
// 3. Error handling is explicit and should be handled at every level
// 4. Interfaces provide polymorphism and testability
// 5. Struct methods and pointer receivers for efficiency
// 6. Proper resource cleanup with defer statements
// 7. Thread-safe operations using sync primitives
//
// To run this file: go run go-basics.go
// =============================================================================
