# Week 1 Assignment: Custom Memory Allocator

**Due:** End of Week 1  
**Difficulty:** Intermediate  
**Estimated Time:** 12-15 hours

---

## 🎯 Project Overview

Build a custom memory allocator that tracks allocations and deallocations, implementing a simple free list algorithm. This project will deepen your understanding of memory management and pointer manipulation.

---

## 📋 Requirements

### Core Features (Must Have)
- [ ] **Allocator class** with allocate() and deallocate() methods
- [ ] **Free list implementation** using linked list of free blocks
- [ ] **Memory tracking** to detect leaks and double-frees
- [ ] **Alignment handling** (8-byte alignment minimum)
- [ ] **Coalescing** adjacent free blocks to reduce fragmentation

### Advanced Features (Nice to Have)
- [ ] **Multiple allocation strategies** (first-fit, best-fit, worst-fit)
- [ ] **Memory pool management** with fixed-size pools
- [ ] **Debug mode** with allocation logging
- [ ] **Performance benchmarking** against malloc/free
- [ ] **Thread safety** using mutexes

---

## 🏗️ Implementation Milestones

### Milestone 1: Basic Structure (Days 1-2)
```cpp
class SimpleAllocator {
private:
    struct Block {
        size_t size;
        bool is_free;
        Block* next;
    };
    
    Block* head;
    size_t total_allocated;
    
public:
    void* allocate(size_t size);
    void deallocate(void* ptr);
    void print_status() const;
};
```

**Deliverables:**
- Basic class definition
- Simple allocate/deallocate implementation
- Memory tracking counters

### Milestone 2: Free List Algorithm (Days 3-4)
```cpp
// Free list management
void split_block(Block* block, size_t size);
void merge_free_blocks(Block* block);
Block* find_free_block(size_t size);
```

**Deliverables:**
- Linked list of free blocks
- Block splitting for partial allocations
- First-fit allocation strategy

### Milestone 3: Memory Safety (Days 5-6)
```cpp
// Safety features
bool is_valid_pointer(void* ptr);
void detect_memory_leaks();
void mark_allocation_pattern();
```

**Deliverables:**
- Double-free detection
- Memory leak reporting
- Pointer validation

### Milestone 4: Testing & Optimization (Day 7)
**Deliverables:**
- Comprehensive test suite
- Performance comparison with malloc
- Memory fragmentation analysis

---

## 🧪 Test Cases

### Basic Functionality
```cpp
void test_basic_allocation() {
    SimpleAllocator alloc;
    
    // Test single allocation
    void* ptr1 = alloc.allocate(100);
    assert(ptr1 != nullptr);
    
    // Test deallocation
    alloc.deallocate(ptr1);
    
    // Test multiple allocations
    void* ptr2 = alloc.allocate(50);
    void* ptr3 = alloc.allocate(75);
    assert(ptr2 != ptr3);
    
    alloc.deallocate(ptr2);
    alloc.deallocate(ptr3);
}
```

### Edge Cases
```cpp
void test_edge_cases() {
    SimpleAllocator alloc;
    
    // Zero-size allocation
    void* ptr = alloc.allocate(0);
    
    // Large allocation
    void* big_ptr = alloc.allocate(1024 * 1024);
    
    // Double free (should be detected)
    void* test_ptr = alloc.allocate(100);
    alloc.deallocate(test_ptr);
    // alloc.deallocate(test_ptr);  // Should trigger warning
    
    // Invalid pointer
    int stack_var = 42;
    // alloc.deallocate(&stack_var);  // Should be rejected
}
```

### Performance Tests
```cpp
void benchmark_performance() {
    const int NUM_ALLOCS = 10000;
    const size_t ALLOC_SIZE = 64;
    
    // Benchmark custom allocator
    auto start = std::chrono::high_resolution_clock::now();
    
    SimpleAllocator alloc;
    std::vector<void*> ptrs;
    
    for (int i = 0; i < NUM_ALLOCS; ++i) {
        ptrs.push_back(alloc.allocate(ALLOC_SIZE));
    }
    
    for (void* ptr : ptrs) {
        alloc.deallocate(ptr);
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start);
    
    std::cout << "Custom allocator: " << duration.count() << " microseconds\n";
}
```

---

## 📁 Project Location

**⚠️ IMPORTANT:** Your assignment code goes in the `projects/mini-projects/` folder, NOT here!

**Assignment Location:** `projects/mini-projects/week-01-allocator/`

```
projects/mini-projects/week-01-allocator/
├── README.md             # Assignment instructions
├── allocator.h           # Header file (DO NOT MODIFY)
├── allocator.cpp         # Implementation (YOUR WORK HERE)
├── main.cpp             # Test program (DO NOT MODIFY) 
├── CMakeLists.txt       # Build configuration
└── build/               # Build directory (create this)
```

This folder (`courses/01-cs-fundamentals/week-01/`) contains **study materials only**.

---

## 🔧 Build Instructions

### CMake Setup
```cmake
cmake_minimum_required(VERSION 3.10)
project(MemoryAllocator)

set(CMAKE_CXX_STANDARD 17)

# Debug build with sanitizers
set(CMAKE_CXX_FLAGS_DEBUG "-g -O0 -Wall -Wextra -fsanitize=address")

# Release build with optimizations
set(CMAKE_CXX_FLAGS_RELEASE "-O3 -DNDEBUG")

add_executable(allocator_test
    allocator.cpp
    main.cpp
)

add_executable(benchmark
    allocator.cpp
    benchmark.cpp
)
```

### Build Commands
```bash
# Create build directory
mkdir build && cd build

# Configure with debug mode
cmake -DCMAKE_BUILD_TYPE=Debug ..

# Build the project
make

# Run tests
./allocator_test

# Run benchmarks
./benchmark
```

---

## 📊 Evaluation Criteria

### Correctness (40 points)
- [ ] All basic functionality works correctly
- [ ] No memory leaks or corruption
- [ ] Proper error handling
- [ ] Edge cases handled gracefully

### Code Quality (30 points)
- [ ] Clean, readable code with comments
- [ ] Proper C++ style and conventions
- [ ] Appropriate use of const and references
- [ ] Good class design and encapsulation

### Advanced Features (20 points)
- [ ] Free list implementation
- [ ] Block coalescing
- [ ] Memory tracking and debugging
- [ ] Performance optimizations

### Testing & Documentation (10 points)
- [ ] Comprehensive test coverage
- [ ] Clear documentation and comments
- [ ] Performance analysis
- [ ] Build system setup

---

## 🎓 Learning Outcomes

After completing this assignment, you will:
- ✅ Understand how memory allocators work internally
- ✅ Master pointer arithmetic and linked list manipulation  
- ✅ Know how to debug memory-related issues
- ✅ Appreciate the complexity of memory management
- ✅ Have experience with performance testing and optimization

---

## 💡 Hints & Tips

### Getting Started
1. **Start simple**: Begin with a basic allocate/deallocate that just wraps malloc/free
2. **Add tracking**: Implement counters for allocated memory before the free list
3. **Test frequently**: Write tests for each feature as you implement it
4. **Use tools**: Valgrind and AddressSanitizer are your friends

### Common Pitfalls
- **Alignment issues**: Make sure allocated memory is properly aligned
- **Double-free bugs**: Always check if a pointer is valid before freeing
- **Fragmentation**: Implement coalescing to merge adjacent free blocks
- **Pointer arithmetic**: Be careful with void* casting and size calculations

### Debugging Tips
```cpp
// Add debug output for tracking allocations
#ifdef DEBUG
    std::cout << "Allocating " << size << " bytes at " << ptr << std::endl;
#endif

// Use assert statements to catch errors early
assert(ptr != nullptr && "Allocation failed");
assert(is_valid_pointer(ptr) && "Invalid pointer in deallocate");
```

---

*Good luck with your memory allocator implementation!*
