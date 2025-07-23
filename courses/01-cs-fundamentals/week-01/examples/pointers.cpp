/*
 * Pointer Operations Examples
 * Week 1 - CS Fundamentals
 * 
 * This file demonstrates:
 * - Basic pointer operations
 * - Pointer arithmetic
 * - Pointers with arrays and functions
 * - Common pointer patterns and pitfalls
 */

#include <iostream>
#include <cstring>
#include <cassert>

// Function prototypes
void basicPointerOperations();
void pointerArithmetic();
void pointersWithArrays();
void pointersWithFunctions();
void pointersAndStrings();
void commonPointerMistakes();

// Helper functions for pointer examples
void swapValues(int* a, int* b);
int* findMaxElement(int* arr, size_t size);
void reverseArray(int* arr, size_t size);
int stringLength(const char* str);

int main() {
    std::cout << "Pointer Operations Examples" << std::endl;
    std::cout << "===========================" << std::endl;
    
    basicPointerOperations();
    pointerArithmetic();
    pointersWithArrays();
    pointersWithFunctions();
    pointersAndStrings();
    commonPointerMistakes();
    
    return 0;
}

void basicPointerOperations() {
    std::cout << "\n=== Basic Pointer Operations ===" << std::endl;
    
    // Basic pointer declaration and initialization
    int value = 42;
    int* ptr = &value;  // ptr points to the address of value
    
    std::cout << "value = " << value << std::endl;
    std::cout << "address of value (&value) = " << &value << std::endl;
    std::cout << "ptr = " << ptr << std::endl;
    std::cout << "value pointed to by ptr (*ptr) = " << *ptr << std::endl;
    
    // Modifying value through pointer
    *ptr = 100;
    std::cout << "\nAfter *ptr = 100:" << std::endl;
    std::cout << "value = " << value << std::endl;
    std::cout << "*ptr = " << *ptr << std::endl;
    
    // Null pointer
    int* null_ptr = nullptr;
    std::cout << "\nNull pointer: " << null_ptr << std::endl;
    
    // Check before dereferencing
    if (null_ptr != nullptr) {
        std::cout << "*null_ptr = " << *null_ptr << std::endl;
    } else {
        std::cout << "Cannot dereference null pointer!" << std::endl;
    }
    
    // Pointer to pointer
    int** double_ptr = &ptr;
    std::cout << "\nPointer to pointer:" << std::endl;
    std::cout << "double_ptr = " << double_ptr << std::endl;
    std::cout << "*double_ptr = " << *double_ptr << std::endl;
    std::cout << "**double_ptr = " << **double_ptr << std::endl;
    
    // Size of pointers (usually 8 bytes on 64-bit systems)
    std::cout << "\nPointer sizes:" << std::endl;
    std::cout << "sizeof(int*) = " << sizeof(int*) << " bytes" << std::endl;
    std::cout << "sizeof(char*) = " << sizeof(char*) << " bytes" << std::endl;
    std::cout << "sizeof(double*) = " << sizeof(double*) << " bytes" << std::endl;
}

void pointerArithmetic() {
    std::cout << "\n=== Pointer Arithmetic ===" << std::endl;
    
    int numbers[] = {10, 20, 30, 40, 50};
    int* ptr = numbers;  // Points to first element
    
    std::cout << "Array: ";
    for (int i = 0; i < 5; ++i) {
        std::cout << numbers[i] << " ";
    }
    std::cout << std::endl;
    
    // Pointer arithmetic - moving through array
    std::cout << "\nPointer arithmetic:" << std::endl;
    std::cout << "ptr points to: " << *ptr << " (at address " << ptr << ")" << std::endl;
    
    ptr++;  // Move to next element
    std::cout << "After ptr++: " << *ptr << " (at address " << ptr << ")" << std::endl;
    
    ptr += 2;  // Move forward 2 elements
    std::cout << "After ptr += 2: " << *ptr << " (at address " << ptr << ")" << std::endl;
    
    ptr--;  // Move back one element
    std::cout << "After ptr--: " << *ptr << " (at address " << ptr << ")" << std::endl;
    
    // Address difference
    int* start = numbers;
    int* end = numbers + 4;
    std::cout << "\nAddress difference: " << (end - start) << " elements" << std::endl;
    std::cout << "Byte difference: " << (char*)end - (char*)start << " bytes" << std::endl;
    
    // Different data types have different pointer arithmetic
    double doubles[] = {1.1, 2.2, 3.3};
    double* dptr = doubles;
    std::cout << "\nDouble array pointer arithmetic:" << std::endl;
    std::cout << "dptr = " << dptr << std::endl;
    dptr++;
    std::cout << "After dptr++: " << dptr << std::endl;
    std::cout << "Difference: " << (char*)dptr - (char*)doubles << " bytes" << std::endl;
}

void pointersWithArrays() {
    std::cout << "\n=== Pointers with Arrays ===" << std::endl;
    
    int arr[] = {1, 4, 2, 8, 5, 7, 3, 6};
    size_t size = sizeof(arr) / sizeof(arr[0]);
    
    std::cout << "Original array: ";
    for (size_t i = 0; i < size; ++i) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
    
    // Find maximum element using pointers
    int* max_ptr = findMaxElement(arr, size);
    std::cout << "Maximum element: " << *max_ptr 
              << " at index " << (max_ptr - arr) << std::endl;
    
    // Reverse array using pointers
    reverseArray(arr, size);
    std::cout << "Reversed array: ";
    for (size_t i = 0; i < size; ++i) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
    
    // Array vs pointer equivalence
    std::cout << "\nArray vs pointer equivalence:" << std::endl;
    int* ptr = arr;
    for (size_t i = 0; i < 3; ++i) {
        std::cout << "arr[" << i << "] = " << arr[i] 
                  << ", *(arr + " << i << ") = " << *(arr + i)
                  << ", ptr[" << i << "] = " << ptr[i]
                  << ", *(ptr + " << i << ") = " << *(ptr + i) << std::endl;
    }
}

void pointersWithFunctions() {
    std::cout << "\n=== Pointers with Functions ===" << std::endl;
    
    int a = 10, b = 20;
    std::cout << "Before swap: a = " << a << ", b = " << b << std::endl;
    
    swapValues(&a, &b);
    std::cout << "After swap: a = " << a << ", b = " << b << std::endl;
    
    // Function pointers
    std::cout << "\nFunction pointers:" << std::endl;
    
    // Define function pointer type
    int (*operation)(int, int);
    
    // Functions to point to
    auto add = [](int x, int y) -> int { return x + y; };
    auto multiply = [](int x, int y) -> int { return x * y; };
    
    operation = add;
    std::cout << "5 + 3 = " << operation(5, 3) << std::endl;
    
    operation = multiply;
    std::cout << "5 * 3 = " << operation(5, 3) << std::endl;
}

void pointersAndStrings() {
    std::cout << "\n=== Pointers and Strings ===" << std::endl;
    
    // C-style strings are character arrays
    char str1[] = "Hello";  // Array of characters
    char* str2 = "World";   // Pointer to string literal
    
    std::cout << "str1 = " << str1 << " (length: " << stringLength(str1) << ")" << std::endl;
    std::cout << "str2 = " << str2 << " (length: " << stringLength(str2) << ")" << std::endl;
    
    // String manipulation with pointers
    char buffer[50];
    char* dest = buffer;
    const char* src = "Copy this string";
    
    // Manual string copy
    while (*src != '\0') {
        *dest = *src;
        dest++;
        src++;
    }
    *dest = '\0';  // Null terminator
    
    std::cout << "Copied string: " << buffer << std::endl;
    
    // Pointer traversal of string
    std::cout << "Character by character: ";
    for (const char* p = buffer; *p != '\0'; ++p) {
        std::cout << "'" << *p << "' ";
    }
    std::cout << std::endl;
}

void commonPointerMistakes() {
    std::cout << "\n=== Common Pointer Mistakes ===" << std::endl;
    
    // 1. Uninitialized pointers
    std::cout << "1. Always initialize pointers:" << std::endl;
    int* good_ptr = nullptr;  // Good: initialized to null
    // int* bad_ptr;           // Bad: uninitialized (contains garbage)
    
    // 2. Dangling pointers
    std::cout << "2. Avoid dangling pointers:" << std::endl;
    int* dangling_ptr;
    {
        int local_var = 42;
        dangling_ptr = &local_var;  // Bad: points to local variable
    }
    // local_var is now out of scope, dangling_ptr is invalid
    std::cout << "Don't use dangling_ptr here!" << std::endl;
    
    // 3. Null pointer dereference
    std::cout << "3. Check for null before dereferencing:" << std::endl;
    int* null_ptr = nullptr;
    if (null_ptr != nullptr) {
        std::cout << "*null_ptr = " << *null_ptr << std::endl;
    } else {
        std::cout << "null_ptr is null, cannot dereference" << std::endl;
    }
    
    // 4. Array bounds
    std::cout << "4. Respect array bounds:" << std::endl;
    int small_array[3] = {1, 2, 3};
    int* ptr = small_array;
    
    std::cout << "Valid access: ";
    for (int i = 0; i < 3; ++i) {
        std::cout << ptr[i] << " ";
    }
    std::cout << std::endl;
    
    // ptr[3] would be out of bounds!
    std::cout << "ptr[3] would be out of bounds - don't do this!" << std::endl;
    
    // 5. Memory leaks (will be covered more in memory_management.cpp)
    std::cout << "5. Don't forget to free dynamically allocated memory" << std::endl;
    int* heap_ptr = new int(42);
    std::cout << "*heap_ptr = " << *heap_ptr << std::endl;
    delete heap_ptr;  // Don't forget this!
    heap_ptr = nullptr;  // Good practice: nullify after delete
}

// Helper function implementations
void swapValues(int* a, int* b) {
    if (a == nullptr || b == nullptr) return;
    
    int temp = *a;
    *a = *b;
    *b = temp;
}

int* findMaxElement(int* arr, size_t size) {
    if (arr == nullptr || size == 0) return nullptr;
    
    int* max_ptr = arr;
    for (size_t i = 1; i < size; ++i) {
        if (arr[i] > *max_ptr) {
            max_ptr = &arr[i];
        }
    }
    return max_ptr;
}

void reverseArray(int* arr, size_t size) {
    if (arr == nullptr || size <= 1) return;
    
    int* left = arr;
    int* right = arr + size - 1;
    
    while (left < right) {
        swapValues(left, right);
        left++;
        right--;
    }
}

int stringLength(const char* str) {
    if (str == nullptr) return 0;
    
    int length = 0;
    while (*str != '\0') {
        length++;
        str++;
    }
    return length;
} 