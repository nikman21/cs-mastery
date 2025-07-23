/*
 * Simple Memory Allocator
 * Week 1 Assignment - CS Fundamentals
 * 
 * This header defines a custom memory allocator using a free list algorithm.
 * The allocator tracks all allocations and deallocations to detect memory leaks
 * and provides debugging information.
 */

#ifndef SIMPLE_ALLOCATOR_H
#define SIMPLE_ALLOCATOR_H

#include <cstddef>  // for size_t
#include <iostream>
#include <unordered_set>

class SimpleAllocator {
public:
    // Constructor and destructor
    SimpleAllocator();
    ~SimpleAllocator();
    
    // Core allocation interface
    void* allocate(size_t size);
    void deallocate(void* ptr);
    
    // Memory tracking and debugging
    size_t getTotalAllocated() const;
    size_t getTotalDeallocated() const;
    size_t getCurrentlyAllocated() const;
    size_t getAllocationCount() const;
    size_t getDeallocationCount() const;
    
    // Debugging and inspection
    void printStatus() const;
    void printFreeList() const;
    bool detectLeaks() const;
    bool isValidPointer(void* ptr) const;
    
    // Configuration
    void setDebugMode(bool enabled);
    
private:
    // Block header structure for free list
    struct Block {
        size_t size;        // Size of the block (excluding header)
        bool is_free;       // Whether this block is free
        Block* next;        // Next block in the list
        Block* prev;        // Previous block in the list (for easier coalescing)
        
        // Constructor
        Block(size_t block_size, bool free = true) 
            : size(block_size), is_free(free), next(nullptr), prev(nullptr) {}
    };
    
    // Allocation tracking entry
    struct AllocationInfo {
        void* ptr;
        size_t size;
        bool is_allocated;
        
        AllocationInfo(void* p, size_t s) : ptr(p), size(s), is_allocated(true) {}
    };
    
    // Private member variables
    Block* head_;                               // Head of the block list
    size_t total_allocated_;                    // Total bytes allocated
    size_t total_deallocated_;                  // Total bytes deallocated  
    size_t allocation_count_;                   // Number of allocations
    size_t deallocation_count_;                 // Number of deallocations
    bool debug_mode_;                           // Enable debug output
    
    // Allocation tracking (for leak detection)
    std::unordered_set<void*> active_allocations_;
    
    // Constants
    static const size_t MIN_BLOCK_SIZE = 16;    // Minimum block size
    static const size_t ALIGNMENT = 8;          // Memory alignment (8-byte)
    static const size_t HEADER_SIZE = sizeof(Block);
    
    // Private helper methods
    size_t alignSize(size_t size) const;
    Block* findFreeBlock(size_t size);
    Block* splitBlock(Block* block, size_t size);
    void mergeWithNext(Block* block);
    void coalesceBlocks();
    Block* createNewBlock(size_t size);
    
    // Debug helpers
    void debugPrint(const char* message) const;
    void logAllocation(void* ptr, size_t size) const;
    void logDeallocation(void* ptr, size_t size) const;
    
    // Validation helpers
    bool isBlockValid(Block* block) const;
    bool isPointerInRange(void* ptr) const;
    
    // Disable copy constructor and assignment operator
    SimpleAllocator(const SimpleAllocator&) = delete;
    SimpleAllocator& operator=(const SimpleAllocator&) = delete;
};

// Utility functions for memory debugging
namespace MemoryUtils {
    // Convert bytes to human-readable format
    std::string formatBytes(size_t bytes);
    
    // Calculate memory fragmentation percentage
    double calculateFragmentation(const SimpleAllocator& allocator);
    
    // Benchmark allocation performance
    void benchmarkAllocator(SimpleAllocator& allocator, size_t num_allocs, size_t alloc_size);
}

#endif // SIMPLE_ALLOCATOR_H 