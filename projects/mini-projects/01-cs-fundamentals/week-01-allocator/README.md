# Week 1 Assignment: Custom Memory Allocator

**Due:** End of Week 1  
**Difficulty:** Intermediate  
**Estimated Time:** 12-15 hours

---

## 🎯 Assignment Overview

Implement a custom memory allocator using a free list algorithm. This project will deepen your understanding of memory management, pointer manipulation, and low-level systems programming.

## 📁 Project Structure

```
week-01-allocator/
├── README.md           # This file
├── allocator.h         # Header file with interface (DO NOT MODIFY)
├── allocator.cpp       # Implementation file (YOUR WORK HERE)
├── main.cpp           # Test program (DO NOT MODIFY)
├── CMakeLists.txt     # Build configuration
└── build/             # Build directory (created when you build)
```

## 🚀 Quick Start

### 1. Build the Project
```bash
# Navigate to the assignment directory
cd projects/mini-projects/week-01-allocator

# Create build directory
mkdir build && cd build

# Configure with CMake (Debug mode recommended)
cmake .. -DCMAKE_BUILD_TYPE=Debug

# Build the project
make
# or: cmake --build .

# Run the tests
./bin/allocator_test
```

### 2. Your Task

**Look for TODO comments in `allocator.cpp`** - these mark the areas you need to implement:

1. **`findFreeBlock()`** - Implement first-fit algorithm
2. **`splitBlock()`** - Split large blocks when needed
3. **`mergeWithNext()`** - Merge adjacent free blocks
4. **`coalesceBlocks()`** - Full coalescing pass

## 📋 Core Requirements

### Must Implement ✅
- [ ] **Free list algorithm** - Search for suitable free blocks
- [ ] **Block splitting** - Split oversized blocks efficiently
- [ ] **Block coalescing** - Merge adjacent free blocks
- [ ] **Memory tracking** - Track allocations/deallocations
- [ ] **Error handling** - Detect double-frees and invalid pointers

### Pass All Tests ✅
- [ ] Basic allocation and deallocation
- [ ] Memory tracking and leak detection  
- [ ] Error handling (null pointers, double-free)
- [ ] Allocation patterns (small, large, mixed)
- [ ] Performance benchmarks

## 🧪 Testing Your Implementation

```bash
# Run all tests
./bin/allocator_test

# For debugging, enable debug mode in your code:
allocator.setDebugMode(true);
```

**Expected Output:**
```
Memory Allocator Test Program
=============================
Testing your Week 1 assignment implementation...

=== Test: Basic Allocation ===
✓ Single allocation successful
✓ Multiple allocations successful
✓ Memory is usable
✓ Deallocation successful

...

✅ All tests completed successfully!
Your allocator implementation is working correctly!
```

## 🔧 Development Tips

### Debugging
- **Use AddressSanitizer**: Built-in with Debug builds (`-DENABLE_ASAN=ON`)
- **Enable debug output**: `allocator.setDebugMode(true)`
- **Print allocator state**: `allocator.printStatus()` and `allocator.printFreeList()`

### Common Issues
1. **Segmentation faults**: Check pointer arithmetic and alignment
2. **Memory leaks**: Ensure all allocated memory is properly freed
3. **Double-free errors**: Validate pointers before deallocating
4. **Fragmentation**: Implement proper coalescing

### Implementation Strategy
1. **Start simple**: Get basic allocation working first
2. **Add features incrementally**: Free list → splitting → coalescing
3. **Test frequently**: Run tests after each feature
4. **Debug thoroughly**: Use print statements and debugger

## 📊 Performance Goals

Your implementation should:
- **Correctness first**: All tests must pass
- **Reasonable performance**: Within 2-3x of malloc/free speed
- **Low fragmentation**: Effective coalescing reduces waste
- **Memory safety**: No crashes or undefined behavior

## 📚 Key Concepts

### Free List Algorithm
```cpp
// Search for first block that fits
Block* findFreeBlock(size_t size) {
    for (Block* current = head_; current; current = current->next) {
        if (current->is_free && current->size >= size) {
            return current;  // Found suitable block
        }
    }
    return nullptr;  // No suitable block found
}
```

### Block Splitting
```cpp
// If block is much larger than needed, split it
if (block->size > size + MIN_BLOCK_SIZE + HEADER_SIZE) {
    // Create new block at: current_block + HEADER_SIZE + size
    // Update linked list pointers
    // Adjust block sizes
}
```

### Block Coalescing
```cpp
// Merge adjacent free blocks to reduce fragmentation
if (block->is_free && next_block->is_free && blocks_are_adjacent) {
    // Merge blocks: block->size += next_block->size + HEADER_SIZE
    // Update linked list pointers
}
```

## 🎓 Learning Objectives

After completing this assignment, you will understand:
- ✅ How memory allocators work internally
- ✅ Pointer arithmetic and memory layout
- ✅ Linked list manipulation in C++
- ✅ Memory alignment and fragmentation
- ✅ Debugging memory-related issues

## 💡 Getting Help

1. **Read the comments**: Detailed hints in `allocator.cpp`
2. **Check the interface**: `allocator.h` shows what each function should do
3. **Study the tests**: `main.cpp` shows expected behavior
4. **Review course materials**: `courses/01-cs-fundamentals/week-01/`

## 🚨 Assignment Rules

- **DO NOT modify** `allocator.h` or `main.cpp`
- **Implement only** the TODO sections in `allocator.cpp`
- **All tests must pass** for full credit
- **No external libraries** except standard C++ library
- **Focus on correctness** first, then optimization

---

**Good luck with your memory allocator implementation!** 🚀

*This assignment builds the foundation for understanding how modern memory management works in operating systems and language runtimes.* 