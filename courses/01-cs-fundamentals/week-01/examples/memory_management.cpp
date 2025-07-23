/*
 * Memory Management Examples
 * Week 1 - CS Fundamentals
 * 
 * This file demonstrates:
 * - Stack vs heap allocation
 * - Memory leaks and how to avoid them
 * - RAII pattern and smart pointers
 * - Common memory management mistakes
 */

#include <iostream>
#include <memory>
#include <vector>
#include <chrono>
#include <cstdlib>

// Function prototypes
void stackVsHeapDemo();
void memoryLeakExamples();
void raiiPatternDemo();
void smartPointerExamples();
void performanceComparison();
void memoryAllocationPatterns();

// Helper classes for demonstrations
class Resource {
public:
    Resource(int id) : id_(id) {
        std::cout << "Resource " << id_ << " created" << std::endl;
    }
    
    ~Resource() {
        std::cout << "Resource " << id_ << " destroyed" << std::endl;
    }
    
    void use() {
        std::cout << "Using resource " << id_ << std::endl;
    }
    
private:
    int id_;
};

// RAII wrapper class
class RAIIResource {
public:
    RAIIResource(int size) : data_(new int[size]), size_(size) {
        std::cout << "RAII: Allocated " << size << " integers" << std::endl;
        for (int i = 0; i < size_; ++i) {
            data_[i] = i;
        }
    }
    
    ~RAIIResource() {
        delete[] data_;
        std::cout << "RAII: Cleaned up " << size_ << " integers" << std::endl;
    }
    
    // Disable copy to avoid double-delete
    RAIIResource(const RAIIResource&) = delete;
    RAIIResource& operator=(const RAIIResource&) = delete;
    
    int& operator[](int index) {
        return data_[index];
    }
    
    int size() const { return size_; }
    
private:
    int* data_;
    int size_;
};

int main() {
    std::cout << "Memory Management Examples" << std::endl;
    std::cout << "==========================" << std::endl;
    
    stackVsHeapDemo();
    memoryLeakExamples();
    raiiPatternDemo();
    smartPointerExamples();
    performanceComparison();
    memoryAllocationPatterns();
    
    return 0;
}

void stackVsHeapDemo() {
    std::cout << "\n=== Stack vs Heap Allocation ===" << std::endl;
    
    // Stack allocation
    std::cout << "Stack allocation:" << std::endl;
    {
        int stack_var = 42;  // Allocated on stack
        int stack_array[1000];  // Array on stack
        
        std::cout << "stack_var address: " << &stack_var << std::endl;
        std::cout << "stack_array address: " << stack_array << std::endl;
        
        // Fill array
        for (int i = 0; i < 1000; ++i) {
            stack_array[i] = i;
        }
        
        std::cout << "Stack allocation: Fast, automatic cleanup" << std::endl;
        // Automatically freed when scope ends
    }
    
    // Heap allocation
    std::cout << "\nHeap allocation:" << std::endl;
    {
        int* heap_var = new int(42);  // Allocated on heap
        int* heap_array = new int[1000];  // Array on heap
        
        std::cout << "heap_var address: " << heap_var << std::endl;
        std::cout << "heap_array address: " << heap_array << std::endl;
        
        // Fill array
        for (int i = 0; i < 1000; ++i) {
            heap_array[i] = i;
        }
        
        std::cout << "Heap allocation: Slower, manual cleanup required" << std::endl;
        
        // Must manually free
        delete heap_var;
        delete[] heap_array;
        std::cout << "Heap memory freed manually" << std::endl;
    }
    
    // Memory addresses comparison
    std::cout << "\nMemory layout (approximate):" << std::endl;
    int stack_local = 1;
    int* heap_ptr = new int(2);
    
    std::cout << "Stack variable address: " << &stack_local << std::endl;
    std::cout << "Heap variable address:  " << heap_ptr << std::endl;
    std::cout << "Code address (function): " << (void*)&stackVsHeapDemo << std::endl;
    
    delete heap_ptr;
}

void memoryLeakExamples() {
    std::cout << "\n=== Memory Leak Examples ===" << std::endl;
    
    // Example 1: Simple memory leak
    std::cout << "1. Simple memory leak (DON'T DO THIS):" << std::endl;
    {
        int* leaked_memory = new int[100];
        // Forgot to call delete[] - this is a memory leak!
        std::cout << "Allocated 100 integers, but forgot to delete[]" << std::endl;
        // Memory is lost forever when pointer goes out of scope
    }
    
    // Example 2: Exception causing leak
    std::cout << "\n2. Exception causing leak:" << std::endl;
    {
        int* risky_memory = new int[100];
        try {
            // Some operation that might throw
            if (true) {  // Simulating an exception condition
                throw std::runtime_error("Something went wrong");
            }
            delete[] risky_memory;  // This line never executes
        } catch (const std::exception& e) {
            std::cout << "Caught exception: " << e.what() << std::endl;
            std::cout << "Memory leaked because delete[] was skipped" << std::endl;
            // Should delete here, but it's easy to forget
            delete[] risky_memory;
        }
    }
    
    // Example 3: Proper exception-safe code
    std::cout << "\n3. Exception-safe code with RAII:" << std::endl;
    {
        try {
            RAIIResource safe_resource(100);  // RAII wrapper
            // Some operation that might throw
            if (true) {
                throw std::runtime_error("Something went wrong");
            }
            // Destructor automatically called even if exception occurs
        } catch (const std::exception& e) {
            std::cout << "Caught exception: " << e.what() << std::endl;
            std::cout << "Memory automatically cleaned up by RAII" << std::endl;
        }
    }
}

void raiiPatternDemo() {
    std::cout << "\n=== RAII Pattern Demo ===" << std::endl;
    
    std::cout << "RAII stands for Resource Acquisition Is Initialization" << std::endl;
    std::cout << "Resources are acquired in constructor, released in destructor" << std::endl;
    
    {
        std::cout << "\nCreating RAII resources:" << std::endl;
        Resource res1(1);
        Resource res2(2);
        
        res1.use();
        res2.use();
        
        {
            Resource res3(3);
            res3.use();
            std::cout << "Inner scope ending..." << std::endl;
        }  // res3 automatically destroyed here
        
        std::cout << "Outer scope ending..." << std::endl;
    }  // res1 and res2 automatically destroyed here
    
    std::cout << "All resources cleaned up automatically!" << std::endl;
}

void smartPointerExamples() {
    std::cout << "\n=== Smart Pointer Examples ===" << std::endl;
    
    // unique_ptr - exclusive ownership
    std::cout << "1. unique_ptr (exclusive ownership):" << std::endl;
    {
        std::unique_ptr<int> unique_int = std::make_unique<int>(42);
        std::cout << "unique_ptr value: " << *unique_int << std::endl;
        
        // Transfer ownership
        std::unique_ptr<int> another_unique = std::move(unique_int);
        std::cout << "After move - another_unique: " << *another_unique << std::endl;
        std::cout << "original unique_ptr is now null: " << (unique_int == nullptr) << std::endl;
        
        // Array version
        std::unique_ptr<int[]> unique_array = std::make_unique<int[]>(10);
        for (int i = 0; i < 10; ++i) {
            unique_array[i] = i * i;
        }
        std::cout << "unique_array[5] = " << unique_array[5] << std::endl;
        
        // Automatically cleaned up when scope ends
    }
    
    // shared_ptr - shared ownership
    std::cout << "\n2. shared_ptr (shared ownership):" << std::endl;
    {
        std::shared_ptr<Resource> shared_res = std::make_shared<Resource>(100);
        std::cout << "Reference count: " << shared_res.use_count() << std::endl;
        
        {
            std::shared_ptr<Resource> another_shared = shared_res;
            std::cout << "Reference count after copy: " << shared_res.use_count() << std::endl;
            another_shared->use();
        }  // another_shared goes out of scope
        
        std::cout << "Reference count after scope: " << shared_res.use_count() << std::endl;
        shared_res->use();
        
        // Resource destroyed when last shared_ptr is destroyed
    }
    
    // weak_ptr - non-owning reference
    std::cout << "\n3. weak_ptr (non-owning reference):" << std::endl;
    {
        std::weak_ptr<Resource> weak_res;
        
        {
            std::shared_ptr<Resource> shared_res = std::make_shared<Resource>(200);
            weak_res = shared_res;
            
            std::cout << "weak_ptr expired: " << weak_res.expired() << std::endl;
            
            if (auto locked = weak_res.lock()) {
                locked->use();
                std::cout << "Successfully accessed through weak_ptr" << std::endl;
            }
        }  // shared_res goes out of scope, resource is destroyed
        
        std::cout << "weak_ptr expired: " << weak_res.expired() << std::endl;
        
        if (auto locked = weak_res.lock()) {
            locked->use();
        } else {
            std::cout << "Cannot access - resource has been destroyed" << std::endl;
        }
    }
}

void performanceComparison() {
    std::cout << "\n=== Performance Comparison ===" << std::endl;
    
    const int NUM_ALLOCATIONS = 100000;
    const int ALLOCATION_SIZE = 1024;
    
    // Stack allocation (using alloca - not recommended for large sizes)
    std::cout << "Comparing allocation performance..." << std::endl;
    
    // Heap allocation timing
    auto start = std::chrono::high_resolution_clock::now();
    
    std::vector<int*> heap_ptrs;
    for (int i = 0; i < NUM_ALLOCATIONS; ++i) {
        int* ptr = new int[ALLOCATION_SIZE];
        heap_ptrs.push_back(ptr);
    }
    
    for (int* ptr : heap_ptrs) {
        delete[] ptr;
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    auto heap_duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start);
    
    std::cout << "Heap allocation time: " << heap_duration.count() << " microseconds" << std::endl;
    
    // Smart pointer timing
    start = std::chrono::high_resolution_clock::now();
    
    std::vector<std::unique_ptr<int[]>> smart_ptrs;
    for (int i = 0; i < NUM_ALLOCATIONS; ++i) {
        auto ptr = std::make_unique<int[]>(ALLOCATION_SIZE);
        smart_ptrs.push_back(std::move(ptr));
    }
    
    smart_ptrs.clear();  // Automatic cleanup
    
    end = std::chrono::high_resolution_clock::now();
    auto smart_duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start);
    
    std::cout << "Smart pointer time: " << smart_duration.count() << " microseconds" << std::endl;
    std::cout << "Smart pointer overhead: " << (smart_duration.count() - heap_duration.count()) << " microseconds" << std::endl;
}

void memoryAllocationPatterns() {
    std::cout << "\n=== Memory Allocation Patterns ===" << std::endl;
    
    // Pattern 1: Object pools
    std::cout << "1. Object pool pattern:" << std::endl;
    {
        std::vector<std::unique_ptr<Resource>> pool;
        
        // Pre-allocate objects
        for (int i = 0; i < 5; ++i) {
            pool.push_back(std::make_unique<Resource>(i));
        }
        
        std::cout << "Pool created with " << pool.size() << " resources" << std::endl;
        
        // Use objects from pool
        for (auto& resource : pool) {
            resource->use();
        }
        
        // Pool automatically cleaned up
    }
    
    // Pattern 2: Memory arenas/Linear allocators
    std::cout << "\n2. Simple arena allocator concept:" << std::endl;
    {
        const size_t ARENA_SIZE = 1024;
        char* arena = new char[ARENA_SIZE];
        char* current = arena;
        
        std::cout << "Arena allocated: " << ARENA_SIZE << " bytes" << std::endl;
        
        // Allocate from arena (simplified)
        auto arena_alloc = [&](size_t size) -> void* {
            if (current + size <= arena + ARENA_SIZE) {
                void* result = current;
                current += size;
                return result;
            }
            return nullptr;
        };
        
        // Allocate some objects
        int* int_ptr = static_cast<int*>(arena_alloc(sizeof(int)));
        double* double_ptr = static_cast<double*>(arena_alloc(sizeof(double)));
        
        if (int_ptr && double_ptr) {
            *int_ptr = 42;
            *double_ptr = 3.14;
            std::cout << "Arena allocation successful: " << *int_ptr << ", " << *double_ptr << std::endl;
        }
        
        // Free entire arena at once
        delete[] arena;
        std::cout << "Entire arena freed at once" << std::endl;
    }
    
    // Pattern 3: RAII for non-memory resources
    std::cout << "\n3. RAII for file resources:" << std::endl;
    {
        class FileRAII {
        public:
            FileRAII(const char* filename) : file_(fopen(filename, "w")) {
                if (file_) {
                    std::cout << "File opened: " << filename << std::endl;
                } else {
                    std::cout << "Failed to open file: " << filename << std::endl;
                }
            }
            
            ~FileRAII() {
                if (file_) {
                    fclose(file_);
                    std::cout << "File automatically closed" << std::endl;
                }
            }
            
            bool isOpen() const { return file_ != nullptr; }
            
            void write(const char* data) {
                if (file_) {
                    fputs(data, file_);
                }
            }
            
        private:
            FILE* file_;
        };
        
        {
            FileRAII file("test.txt");
            if (file.isOpen()) {
                file.write("Hello, RAII!");
            }
            // File automatically closed when FileRAII destructor is called
        }
    }
} 