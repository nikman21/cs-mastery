/*
 * Simple Memory Allocator Implementation
 * Week 1 Assignment - CS Fundamentals
 * 
 * TODO: Complete the implementation by filling in the TODO sections.
 * This starter code provides the basic structure - you need to implement:
 * 1. Free list algorithm in findFreeBlock()
 * 2. Block splitting in splitBlock() 
 * 3. Block coalescing in mergeWithNext() and coalesceBlocks()
 * 4. Performance optimizations
 */

#include "allocator.h"
#include <cstdlib>  // for malloc, free
#include <cstring>  // for memset
#include <iomanip>  // for formatting output
#include <sstream>
#include <chrono>
#include <vector>

// Constructor
SimpleAllocator::SimpleAllocator() 
    : head_(nullptr)
    , total_allocated_(0)
    , total_deallocated_(0)
    , allocation_count_(0)
    , deallocation_count_(0)
    , debug_mode_(false) {
    
    debugPrint("SimpleAllocator created");
}

// Destructor
SimpleAllocator::~SimpleAllocator() {
    debugPrint("SimpleAllocator destroying...");
    
    // Check for memory leaks
    if (detectLeaks()) {
        std::cerr << "WARNING: Memory leaks detected!" << std::endl;
    }
    
    // Clean up any remaining blocks
    Block* current = head_;
    while (current != nullptr) {
        Block* next = current->next;
        std::free(current);  // Free the entire block (header + data)
        current = next;
    }
    
    debugPrint("SimpleAllocator destroyed");
}

// Core allocation method
void* SimpleAllocator::allocate(size_t size) {
    if (size == 0) {
        debugPrint("Warning: Attempted to allocate 0 bytes");
        return nullptr;
    }
    
    // Align the requested size
    size_t aligned_size = alignSize(size);
    
    // TODO: Implement proper free list algorithm
    // For now, this is a simplified version that always creates new blocks
    // You should:
    // 1. Search for a suitable free block using findFreeBlock()
    // 2. If found, mark it as used and possibly split it
    // 3. If not found, create a new block
    
    Block* suitable_block = findFreeBlock(aligned_size);
    void* user_ptr = nullptr;
    
    if (suitable_block != nullptr) {
        // Found a free block - use it
        suitable_block->is_free = false;
        
        // TODO: Implement block splitting here
        // If the block is much larger than needed, split it
        
        user_ptr = reinterpret_cast<char*>(suitable_block) + HEADER_SIZE;
        logAllocation(user_ptr, suitable_block->size);
    } else {
        // No suitable block found - create a new one
        suitable_block = createNewBlock(aligned_size);
        if (suitable_block != nullptr) {
            user_ptr = reinterpret_cast<char*>(suitable_block) + HEADER_SIZE;
            logAllocation(user_ptr, aligned_size);
        }
    }
    
    if (user_ptr != nullptr) {
        // Update statistics
        total_allocated_ += aligned_size;
        allocation_count_++;
        active_allocations_.insert(user_ptr);
        
        // Zero out the memory for safety
        std::memset(user_ptr, 0, aligned_size);
    }
    
    return user_ptr;
}

// Core deallocation method
void SimpleAllocator::deallocate(void* ptr) {
    if (ptr == nullptr) {
        debugPrint("Warning: Attempted to deallocate null pointer");
        return;
    }
    
    // Validate the pointer
    if (!isValidPointer(ptr)) {
        std::cerr << "ERROR: Invalid pointer passed to deallocate: " << ptr << std::endl;
        return;
    }
    
    // Remove from active allocations
    auto it = active_allocations_.find(ptr);
    if (it == active_allocations_.end()) {
        std::cerr << "ERROR: Double-free detected for pointer: " << ptr << std::endl;
        return;
    }
    active_allocations_.erase(it);
    
    // Get the block header
    Block* block = reinterpret_cast<Block*>(reinterpret_cast<char*>(ptr) - HEADER_SIZE);
    
    if (block->is_free) {
        std::cerr << "ERROR: Block is already free!" << std::endl;
        return;
    }
    
    // Mark block as free
    block->is_free = true;
    
    // Update statistics
    total_deallocated_ += block->size;
    deallocation_count_++;
    
    logDeallocation(ptr, block->size);
    
    // TODO: Implement coalescing with adjacent free blocks
    // You should merge this block with adjacent free blocks to reduce fragmentation
    
    debugPrint("Block marked as free");
}

// Memory tracking methods
size_t SimpleAllocator::getTotalAllocated() const {
    return total_allocated_;
}

size_t SimpleAllocator::getTotalDeallocated() const {
    return total_deallocated_;
}

size_t SimpleAllocator::getCurrentlyAllocated() const {
    return total_allocated_ - total_deallocated_;
}

size_t SimpleAllocator::getAllocationCount() const {
    return allocation_count_;
}

size_t SimpleAllocator::getDeallocationCount() const {
    return deallocation_count_;
}

// Debug and inspection methods
void SimpleAllocator::printStatus() const {
    std::cout << "\n=== Allocator Status ===" << std::endl;
    std::cout << "Total allocated:     " << MemoryUtils::formatBytes(total_allocated_) << std::endl;
    std::cout << "Total deallocated:   " << MemoryUtils::formatBytes(total_deallocated_) << std::endl;
    std::cout << "Currently allocated: " << MemoryUtils::formatBytes(getCurrentlyAllocated()) << std::endl;
    std::cout << "Allocation count:    " << allocation_count_ << std::endl;
    std::cout << "Deallocation count:  " << deallocation_count_ << std::endl;
    std::cout << "Active allocations:  " << active_allocations_.size() << std::endl;
    
    if (active_allocations_.size() > 0) {
        std::cout << "Memory leaks detected: " << active_allocations_.size() << " unfreed pointers" << std::endl;
    } else {
        std::cout << "No memory leaks detected" << std::endl;
    }
    std::cout << "=========================" << std::endl;
}

void SimpleAllocator::printFreeList() const {
    std::cout << "\n=== Free List ===" << std::endl;
    
    Block* current = head_;
    int block_count = 0;
    
    while (current != nullptr) {
        std::cout << "Block " << block_count++ << ": ";
        std::cout << "Size=" << current->size << ", ";
        std::cout << "Free=" << (current->is_free ? "Yes" : "No") << ", ";
        std::cout << "Address=" << current << std::endl;
        
        current = current->next;
    }
    
    if (block_count == 0) {
        std::cout << "No blocks allocated" << std::endl;
    }
    
    std::cout << "=================" << std::endl;
}

bool SimpleAllocator::detectLeaks() const {
    return !active_allocations_.empty();
}

bool SimpleAllocator::isValidPointer(void* ptr) const {
    // Basic validation - check if pointer is in our active allocations
    return active_allocations_.find(ptr) != active_allocations_.end();
}

void SimpleAllocator::setDebugMode(bool enabled) {
    debug_mode_ = enabled;
}

// Private helper methods

size_t SimpleAllocator::alignSize(size_t size) const {
    // Align to ALIGNMENT boundary
    return (size + ALIGNMENT - 1) & ~(ALIGNMENT - 1);
}

SimpleAllocator::Block* SimpleAllocator::findFreeBlock(size_t size) {
    // TODO: Implement first-fit algorithm
    // This is where you implement the free list search
    // Current implementation is basic - you should improve it
    
    Block* current = head_;
    while (current != nullptr) {
        if (current->is_free && current->size >= size) {
            debugPrint("Found suitable free block");
            return current;
        }
        current = current->next;
    }
    
    debugPrint("No suitable free block found");
    return nullptr;
    
    // TODO: Consider implementing other allocation strategies:
    // - Best-fit: Find the smallest block that fits
    // - Worst-fit: Find the largest block
    // - Next-fit: Start search from last allocated position
}

SimpleAllocator::Block* SimpleAllocator::splitBlock(Block* block, size_t size) {
    // TODO: Implement block splitting
    // If the block is significantly larger than needed, split it into two blocks
    
    if (block->size <= size + MIN_BLOCK_SIZE + HEADER_SIZE) {
        // Block is too small to split efficiently
        return block;
    }
    
    // TODO: Your implementation here
    // 1. Calculate where the new block should start
    // 2. Create a new block header at that position
    // 3. Update the linked list pointers
    // 4. Update block sizes
    
    debugPrint("Block splitting not yet implemented");
    return block;
}

void SimpleAllocator::mergeWithNext(Block* block) {
    // TODO: Implement block merging
    // Merge this block with the next block if it's free and adjacent
    
    if (block->next == nullptr || !block->next->is_free) {
        return; // Cannot merge
    }
    
    // TODO: Your implementation here
    // 1. Check if blocks are adjacent in memory
    // 2. Merge the sizes
    // 3. Update the linked list pointers
    // 4. Handle the merged block properly
    
    debugPrint("Block merging not yet implemented");
}

void SimpleAllocator::coalesceBlocks() {
    // TODO: Implement full coalescing
    // Go through the entire list and merge all adjacent free blocks
    
    Block* current = head_;
    while (current != nullptr) {
        if (current->is_free) {
            mergeWithNext(current);
        }
        current = current->next;
    }
    
    // TODO: Also consider merging with previous blocks
    // You might want to implement a merge_with_previous method too
}

SimpleAllocator::Block* SimpleAllocator::createNewBlock(size_t size) {
    // Allocate memory for block header + user data
    size_t total_size = HEADER_SIZE + size;
    void* raw_memory = std::malloc(total_size);
    
    if (raw_memory == nullptr) {
        debugPrint("ERROR: Failed to allocate memory");
        return nullptr;
    }
    
    // Initialize block header using placement new
    Block* new_block = new (raw_memory) Block(size, false);
    
    // Add to the linked list (simple approach - add to front)
    if (head_ == nullptr) {
        head_ = new_block;
    } else {
        new_block->next = head_;
        head_->prev = new_block;
        head_ = new_block;
    }
    
    debugPrint("New block created");
    return new_block;
}

// Debug helpers
void SimpleAllocator::debugPrint(const char* message) const {
    if (debug_mode_) {
        std::cout << "[DEBUG] " << message << std::endl;
    }
}

void SimpleAllocator::logAllocation(void* ptr, size_t size) const {
    if (debug_mode_) {
        std::cout << "[ALLOC] " << ptr << " (" << size << " bytes)" << std::endl;
    }
}

void SimpleAllocator::logDeallocation(void* ptr, size_t size) const {
    if (debug_mode_) {
        std::cout << "[FREE]  " << ptr << " (" << size << " bytes)" << std::endl;
    }
}

bool SimpleAllocator::isBlockValid(Block* block) const {
    // Basic validation
    return block != nullptr && block->size > 0;
}

bool SimpleAllocator::isPointerInRange(void* ptr) const {
    // TODO: Implement proper range checking
    // You might want to keep track of the memory ranges you've allocated
    return ptr != nullptr;
}

// Utility namespace implementation
namespace MemoryUtils {
    std::string formatBytes(size_t bytes) {
        std::ostringstream oss;
        
        if (bytes < 1024) {
            oss << bytes << " B";
        } else if (bytes < 1024 * 1024) {
            oss << std::fixed << std::setprecision(1) << (bytes / 1024.0) << " KB";
        } else {
            oss << std::fixed << std::setprecision(1) << (bytes / (1024.0 * 1024.0)) << " MB";
        }
        
        return oss.str();
    }
    
    double calculateFragmentation(const SimpleAllocator& allocator) {
        // TODO: Implement fragmentation calculation
        // This would require access to the internal free list
        // Fragmentation = (largest_free_block / total_free_memory) * 100
        return 0.0;
    }
    
    void benchmarkAllocator(SimpleAllocator& allocator, size_t num_allocs, size_t alloc_size) {
        std::cout << "\n=== Benchmark: " << num_allocs << " allocations of " << alloc_size << " bytes ===" << std::endl;
        
        std::vector<void*> ptrs;
        ptrs.reserve(num_allocs);
        
        // Allocation phase
        auto start = std::chrono::high_resolution_clock::now();
        
        for (size_t i = 0; i < num_allocs; ++i) {
            void* ptr = allocator.allocate(alloc_size);
            if (ptr != nullptr) {
                ptrs.push_back(ptr);
            }
        }
        
        auto mid = std::chrono::high_resolution_clock::now();
        
        // Deallocation phase
        for (void* ptr : ptrs) {
            allocator.deallocate(ptr);
        }
        
        auto end = std::chrono::high_resolution_clock::now();
        
        auto alloc_time = std::chrono::duration_cast<std::chrono::microseconds>(mid - start);
        auto dealloc_time = std::chrono::duration_cast<std::chrono::microseconds>(end - mid);
        auto total_time = std::chrono::duration_cast<std::chrono::microseconds>(end - start);
        
        std::cout << "Allocation time:   " << alloc_time.count() << " μs" << std::endl;
        std::cout << "Deallocation time: " << dealloc_time.count() << " μs" << std::endl;
        std::cout << "Total time:        " << total_time.count() << " μs" << std::endl;
        std::cout << "Avg per allocation: " << (total_time.count() / (double)num_allocs) << " μs" << std::endl;
        std::cout << "=====================================================================" << std::endl;
    }
} 