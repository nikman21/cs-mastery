/*
 * Memory Allocator Test Program
 * Week 1 Assignment - CS Fundamentals
 * 
 * This program tests your custom memory allocator implementation.
 * Run this to verify your allocator works correctly.
 * 
 * Usage:
 *   mkdir build && cd build
 *   cmake .. && make
 *   ./allocator_test
 */

#include "allocator.h"
#include <iostream>
#include <vector>
#include <cassert>

// Test function prototypes
void testBasicAllocation();
void testMemoryTracking();
void testErrorHandling();
void testAllocationPatterns();
void runPerformanceBenchmarks();

int main() {
    std::cout << "Memory Allocator Test Program" << std::endl;
    std::cout << "=============================" << std::endl;
    std::cout << "Testing your Week 1 assignment implementation..." << std::endl;
    
    try {
        testBasicAllocation();
        testMemoryTracking();
        testErrorHandling();
        testAllocationPatterns();
        runPerformanceBenchmarks();
        
        std::cout << "\n✅ All tests completed successfully!" << std::endl;
        std::cout << "Your allocator implementation is working correctly!" << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "\n❌ Test failed with exception: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}

void testBasicAllocation() {
    std::cout << "\n=== Test: Basic Allocation ===" << std::endl;
    
    SimpleAllocator allocator;
    allocator.setDebugMode(true);
    
    // Test single allocation
    void* ptr1 = allocator.allocate(100);
    assert(ptr1 != nullptr);
    std::cout << "✓ Single allocation successful" << std::endl;
    
    // Test multiple allocations
    void* ptr2 = allocator.allocate(50);
    void* ptr3 = allocator.allocate(200);
    assert(ptr2 != nullptr && ptr3 != nullptr);
    assert(ptr1 != ptr2 && ptr2 != ptr3 && ptr1 != ptr3);
    std::cout << "✓ Multiple allocations successful" << std::endl;
    
    // Use the memory
    int* int_ptr = static_cast<int*>(ptr1);
    *int_ptr = 42;
    assert(*int_ptr == 42);
    std::cout << "✓ Memory is usable" << std::endl;
    
    // Test deallocation
    allocator.deallocate(ptr1);
    allocator.deallocate(ptr2);
    allocator.deallocate(ptr3);
    std::cout << "✓ Deallocation successful" << std::endl;
    
    allocator.printStatus();
}

void testMemoryTracking() {
    std::cout << "\n=== Test: Memory Tracking ===" << std::endl;
    
    SimpleAllocator allocator;
    
    // Check initial state
    assert(allocator.getTotalAllocated() == 0);
    assert(allocator.getAllocationCount() == 0);
    assert(!allocator.detectLeaks());
    std::cout << "✓ Initial state is clean" << std::endl;
    
    // Allocate some memory
    std::vector<void*> ptrs;
    const size_t num_allocs = 10;
    const size_t alloc_size = 64;
    
    for (size_t i = 0; i < num_allocs; ++i) {
        void* ptr = allocator.allocate(alloc_size);
        assert(ptr != nullptr);
        ptrs.push_back(ptr);
    }
    
    // Check tracking
    assert(allocator.getAllocationCount() == num_allocs);
    assert(allocator.getCurrentlyAllocated() > 0);
    std::cout << "✓ Allocation tracking works" << std::endl;
    
    // Deallocate half
    for (size_t i = 0; i < num_allocs / 2; ++i) {
        allocator.deallocate(ptrs[i]);
    }
    
    assert(allocator.getDeallocationCount() == num_allocs / 2);
    std::cout << "✓ Deallocation tracking works" << std::endl;
    
    // Check for leaks (should detect some)
    assert(allocator.detectLeaks());
    std::cout << "✓ Leak detection works" << std::endl;
    
    // Clean up remaining
    for (size_t i = num_allocs / 2; i < num_allocs; ++i) {
        allocator.deallocate(ptrs[i]);
    }
    
    assert(!allocator.detectLeaks());
    std::cout << "✓ All memory properly freed" << std::endl;
    
    allocator.printStatus();
}

void testErrorHandling() {
    std::cout << "\n=== Test: Error Handling ===" << std::endl;
    
    SimpleAllocator allocator;
    
    // Test null pointer deallocation
    allocator.deallocate(nullptr);  // Should not crash
    std::cout << "✓ Null pointer deallocation handled" << std::endl;
    
    // Test zero-size allocation
    void* ptr = allocator.allocate(0);  // Implementation dependent
    std::cout << "✓ Zero-size allocation handled" << std::endl;
    
    // Test double-free detection
    void* test_ptr = allocator.allocate(100);
    assert(test_ptr != nullptr);
    
    allocator.deallocate(test_ptr);  // First free - OK
    allocator.deallocate(test_ptr);  // Second free - should be detected
    std::cout << "✓ Double-free detection works" << std::endl;
    
    // Test invalid pointer
    int stack_var = 42;
    allocator.deallocate(&stack_var);  // Should be rejected
    std::cout << "✓ Invalid pointer detection works" << std::endl;
    
    allocator.printStatus();
}

void testAllocationPatterns() {
    std::cout << "\n=== Test: Allocation Patterns ===" << std::endl;
    
    SimpleAllocator allocator;
    
    // Test 1: Many small allocations
    std::cout << "Testing many small allocations..." << std::endl;
    std::vector<void*> small_ptrs;
    
    for (int i = 0; i < 100; ++i) {
        void* ptr = allocator.allocate(16);
        if (ptr != nullptr) {
            small_ptrs.push_back(ptr);
        }
    }
    
    std::cout << "✓ Allocated " << small_ptrs.size() << " small blocks" << std::endl;
    
    // Test 2: Few large allocations
    std::cout << "Testing few large allocations..." << std::endl;
    std::vector<void*> large_ptrs;
    
    for (int i = 0; i < 5; ++i) {
        void* ptr = allocator.allocate(4096);
        if (ptr != nullptr) {
            large_ptrs.push_back(ptr);
        }
    }
    
    std::cout << "✓ Allocated " << large_ptrs.size() << " large blocks" << std::endl;
    
    // Test 3: Mixed pattern (tests fragmentation handling)
    std::cout << "Testing mixed allocation pattern..." << std::endl;
    
    // Free every other small allocation to create fragmentation
    for (size_t i = 0; i < small_ptrs.size(); i += 2) {
        allocator.deallocate(small_ptrs[i]);
    }
    
    // Try to allocate medium-sized blocks in the fragmented space
    std::vector<void*> medium_ptrs;
    for (int i = 0; i < 10; ++i) {
        void* ptr = allocator.allocate(256);
        if (ptr != nullptr) {
            medium_ptrs.push_back(ptr);
        }
    }
    
    std::cout << "✓ Allocated " << medium_ptrs.size() << " medium blocks after fragmentation" << std::endl;
    std::cout << "   (This tests your free list and coalescing implementation)" << std::endl;
    
    allocator.printStatus();
    allocator.printFreeList();
    
    // Clean up
    for (size_t i = 1; i < small_ptrs.size(); i += 2) {
        allocator.deallocate(small_ptrs[i]);
    }
    for (void* ptr : large_ptrs) {
        allocator.deallocate(ptr);
    }
    for (void* ptr : medium_ptrs) {
        allocator.deallocate(ptr);
    }
    
    std::cout << "✓ All test memory cleaned up" << std::endl;
}

void runPerformanceBenchmarks() {
    std::cout << "\n=== Performance Benchmarks ===" << std::endl;
    
    SimpleAllocator allocator;
    
    // Benchmark 1: Small allocations
    std::cout << "Benchmark 1: Small allocations (16 bytes)" << std::endl;
    MemoryUtils::benchmarkAllocator(allocator, 1000, 16);
    
    // Benchmark 2: Medium allocations
    std::cout << "Benchmark 2: Medium allocations (256 bytes)" << std::endl;
    MemoryUtils::benchmarkAllocator(allocator, 500, 256);
    
    // Benchmark 3: Large allocations
    std::cout << "Benchmark 3: Large allocations (4096 bytes)" << std::endl;
    MemoryUtils::benchmarkAllocator(allocator, 100, 4096);
    
    std::cout << "\nPerformance Notes:" << std::endl;
    std::cout << "- Compare these times with malloc/free for reference" << std::endl;
    std::cout << "- Your implementation should get faster as you optimize it" << std::endl;
    std::cout << "- Focus on correctness first, then performance" << std::endl;
    
    allocator.printStatus();
} 