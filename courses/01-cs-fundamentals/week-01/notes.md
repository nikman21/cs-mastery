# Week 1: C++ & Memory Management

**Duration:** August 15-21  
**Goal:** Master C++ fundamentals and implement custom memory allocator

---

## 🎯 Learning Objectives

By end of this week, you should be able to:
- [ ] Write and compile C++ programs with proper syntax
- [ ] Master pointer operations and pointer arithmetic
- [ ] Understand stack vs heap memory allocation
- [ ] Implement a basic memory allocator
- [ ] Debug memory issues using tools like Valgrind
- [ ] Apply RAII principles in C++ design

---

## 📚 Core Concepts

### 1. C++ Fundamentals

#### Basic Syntax & Types
```cpp
// Built-in types
int age = 25;              // 4 bytes, signed integer
char letter = 'A';         // 1 byte, single character  
double price = 99.99;      // 8 bytes, floating point
bool isValid = true;       // 1 byte, true/false

// Arrays and strings
int numbers[5] = {1, 2, 3, 4, 5};
std::string name = "John";
```

#### Functions and Parameters
```cpp
// Pass by value (copies the data)
void byValue(int x) { x = 10; }  // Original unchanged

// Pass by reference (operates on original)
void byReference(int& x) { x = 10; }  // Original modified

// Pass by pointer (address of original)
void byPointer(int* x) { *x = 10; }  // Original modified
```

### 2. Pointers & References

#### Pointer Fundamentals
```cpp
int value = 42;
int* ptr = &value;    // ptr stores address of value
int result = *ptr;    // result = 42 (dereference pointer)

// Pointer arithmetic
int arr[5] = {1, 2, 3, 4, 5};
int* p = arr;         // Points to arr[0]
p++;                  // Now points to arr[1]
p += 2;               // Now points to arr[3]
```

#### References vs Pointers
| References | Pointers |
|------------|----------|
| Must be initialized | Can be uninitialized |
| Cannot be reassigned | Can point to different objects |
| No null references | Can be null |
| No pointer arithmetic | Supports arithmetic |
| Cleaner syntax | More explicit syntax |

### 3. Memory Management

#### Stack Memory
- **Automatic allocation/deallocation**
- **Fast access** (CPU cache friendly)
- **Limited size** (~1-8MB typical)
- **LIFO ordering** (Last In, First Out)

```cpp
void stackExample() {
    int x = 10;        // Allocated on stack
    char buffer[1024]; // Array on stack
    // Automatically freed when function ends
}
```

#### Heap Memory
- **Manual allocation/deallocation**
- **Large size** (limited by available RAM)
- **Slower access** (can cause cache misses)
- **Flexible lifetime** (survives function calls)

```cpp
void heapExample() {
    int* ptr = new int(42);        // Allocate on heap
    int* arr = new int[1000];      // Array on heap
    
    // Must manually free
    delete ptr;
    delete[] arr;
}
```

### 4. Memory Allocator Design

#### Basic Allocator Interface
```cpp
class MemoryAllocator {
public:
    virtual void* allocate(size_t size) = 0;
    virtual void deallocate(void* ptr) = 0;
    virtual size_t getAllocatedSize() const = 0;
};
```

#### Free List Implementation
- **Free blocks** linked together
- **First-fit** allocation strategy
- **Coalescing** adjacent free blocks
- **Alignment** requirements (typically 8-byte)

### 5. Common Memory Issues

#### Memory Leaks
```cpp
// BAD: Memory leak
void leakyFunction() {
    int* data = new int[1000];
    // Forgot to call delete[]
    return;  // Memory is lost forever
}

// GOOD: RAII pattern
void safeFunction() {
    std::unique_ptr<int[]> data(new int[1000]);
    // Automatically cleaned up
}
```

#### Dangling Pointers
```cpp
// BAD: Dangling pointer
int* createDanglingPointer() {
    int x = 42;
    return &x;  // Returns address of local variable
}

// BAD: Use after free
int* ptr = new int(42);
delete ptr;
*ptr = 10;  // Undefined behavior!
```

#### Buffer Overflows
```cpp
// BAD: Buffer overflow
char buffer[10];
strcpy(buffer, "This string is too long!");  // Overflows buffer

// GOOD: Safe string handling
char buffer[50];
strncpy(buffer, source, sizeof(buffer) - 1);
buffer[sizeof(buffer) - 1] = '\0';
```

---

## 🛠️ Development Tools

### Compiler Flags
```bash
# Debug build with all warnings
g++ -Wall -Wextra -g -O0 -std=c++17 main.cpp -o main

# Release build with optimizations
g++ -O3 -DNDEBUG -std=c++17 main.cpp -o main
```

### Memory Debugging
```bash
# Valgrind for memory error detection
valgrind --leak-check=full --show-leak-kinds=all ./main

# AddressSanitizer (compile-time flag)
g++ -fsanitize=address -g main.cpp -o main
```

### GDB Debugging
```bash
# Start debugger
gdb ./main

# Common GDB commands
(gdb) break main          # Set breakpoint
(gdb) run                 # Start program
(gdb) print variable_name # Print variable value
(gdb) step                # Step into function
(gdb) next                # Step over line
(gdb) backtrace           # Show call stack
```

---

## 📝 Study Plan

### Day 1-2: C++ Fundamentals
- Review basic syntax and types
- Practice pointer operations
- Understand pass-by-value vs pass-by-reference
- Complete exercises in `examples/basics.cpp`

### Day 3-4: Memory Management
- Learn stack vs heap differences
- Practice dynamic allocation
- Study common memory errors
- Implement examples in `examples/memory_management.cpp`

### Day 5-7: Memory Allocator Project
- Design allocator interface
- Implement free list algorithm
- Add memory tracking and debugging
- Test with various allocation patterns

---

## 🔍 Key Questions to Master

1. **When would you use a pointer vs a reference?**
2. **What's the difference between `delete` and `delete[]`?**
3. **How do you avoid memory leaks in C++?**
4. **What is RAII and why is it important?**
5. **How does pointer arithmetic work with different data types?**
6. **What are the advantages and disadvantages of stack vs heap allocation?**

---

## 🎯 Week Assessment

### Knowledge Check
- [ ] Can explain pointer vs reference differences
- [ ] Understands stack vs heap memory models
- [ ] Can identify common memory errors
- [ ] Knows how to use debugging tools

### Practical Skills
- [ ] Implemented working memory allocator
- [ ] Used Valgrind to find memory leaks
- [ ] Applied RAII pattern in code design
- [ ] Debugged segmentation faults

---

## 📊 Next Week Preview

**Week 2: Data Structures & Algorithms**
- Implement linked lists, stacks, queues
- Red-black tree balancing algorithms
- Time complexity analysis
- Algorithm design patterns

*Focus: Build foundation for more complex data structures*

---

*Last updated: [Date]*
