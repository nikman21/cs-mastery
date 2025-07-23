/*
 * C++ Fundamentals Examples
 * Week 1 - CS Fundamentals
 * 
 * This file demonstrates basic C++ concepts including:
 * - Built-in types and arrays
 * - Function parameter passing (value, reference, pointer)
 * - Basic I/O and string operations
 */

#include <iostream>
#include <string>
#include <vector>
#include <cassert>

// Function declarations for different parameter passing methods
void passByValue(int x);
void passByReference(int& x);
void passByPointer(int* x);

// Function to demonstrate different data types
void demonstrateTypes() {
    std::cout << "\n=== Data Types Demo ===" << std::endl;
    
    // Basic types with their sizes
    int age = 25;
    char grade = 'A';
    double price = 99.99;
    bool isStudent = true;
    
    std::cout << "int age = " << age << " (size: " << sizeof(age) << " bytes)" << std::endl;
    std::cout << "char grade = " << grade << " (size: " << sizeof(grade) << " bytes)" << std::endl;
    std::cout << "double price = " << price << " (size: " << sizeof(price) << " bytes)" << std::endl;
    std::cout << "bool isStudent = " << std::boolalpha << isStudent << " (size: " << sizeof(isStudent) << " bytes)" << std::endl;
    
    // Arrays
    int numbers[5] = {1, 2, 3, 4, 5};
    std::cout << "\nArray elements: ";
    for (int i = 0; i < 5; ++i) {
        std::cout << numbers[i] << " ";
    }
    std::cout << std::endl;
    
    // String handling
    std::string name = "John Doe";
    char cstr[] = "Hello World";
    std::cout << "std::string: " << name << " (length: " << name.length() << ")" << std::endl;
    std::cout << "C-style string: " << cstr << " (length: " << strlen(cstr) << ")" << std::endl;
}

// Demonstrate different parameter passing methods
void demonstrateParameterPassing() {
    std::cout << "\n=== Parameter Passing Demo ===" << std::endl;
    
    int original = 42;
    
    std::cout << "Original value: " << original << std::endl;
    
    // Pass by value - makes a copy
    passByValue(original);
    std::cout << "After pass by value: " << original << std::endl;
    
    // Pass by reference - operates on original
    passByReference(original);
    std::cout << "After pass by reference: " << original << std::endl;
    
    // Pass by pointer - operates on original via address
    passByPointer(&original);
    std::cout << "After pass by pointer: " << original << std::endl;
}

// Array processing examples
void demonstrateArrays() {
    std::cout << "\n=== Array Processing Demo ===" << std::endl;
    
    // Static array
    int static_array[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    // Calculate sum using pointer arithmetic
    int sum = 0;
    for (int* ptr = static_array; ptr < static_array + 10; ++ptr) {
        sum += *ptr;
    }
    std::cout << "Sum of array elements: " << sum << std::endl;
    
    // Find maximum element
    int max_val = static_array[0];
    for (int i = 1; i < 10; ++i) {
        if (static_array[i] > max_val) {
            max_val = static_array[i];
        }
    }
    std::cout << "Maximum element: " << max_val << std::endl;
    
    // Modern C++ with vectors
    std::vector<int> dynamic_array = {10, 20, 30, 40, 50};
    std::cout << "Vector size: " << dynamic_array.size() << std::endl;
    std::cout << "Vector capacity: " << dynamic_array.capacity() << std::endl;
    
    // Add elements
    dynamic_array.push_back(60);
    dynamic_array.push_back(70);
    
    std::cout << "After adding elements - size: " << dynamic_array.size() 
              << ", capacity: " << dynamic_array.capacity() << std::endl;
    
    // Range-based for loop (C++11)
    std::cout << "Vector elements: ";
    for (const auto& element : dynamic_array) {
        std::cout << element << " ";
    }
    std::cout << std::endl;
}

// Control flow examples
void demonstrateControlFlow() {
    std::cout << "\n=== Control Flow Demo ===" << std::endl;
    
    // For loop with different patterns
    std::cout << "Counting up: ";
    for (int i = 0; i < 5; ++i) {
        std::cout << i << " ";
    }
    std::cout << std::endl;
    
    std::cout << "Counting down: ";
    for (int i = 5; i > 0; --i) {
        std::cout << i << " ";
    }
    std::cout << std::endl;
    
    // While loop example
    int countdown = 3;
    std::cout << "Countdown: ";
    while (countdown > 0) {
        std::cout << countdown << " ";
        --countdown;
    }
    std::cout << "Go!" << std::endl;
    
    // Switch statement
    for (int day = 1; day <= 7; ++day) {
        std::cout << "Day " << day << ": ";
        switch (day) {
            case 1: std::cout << "Monday"; break;
            case 2: std::cout << "Tuesday"; break;
            case 3: std::cout << "Wednesday"; break;
            case 4: std::cout << "Thursday"; break;
            case 5: std::cout << "Friday"; break;
            case 6: std::cout << "Saturday"; break;
            case 7: std::cout << "Sunday"; break;
            default: std::cout << "Invalid day"; break;
        }
        std::cout << std::endl;
    }
}

// Function implementations
void passByValue(int x) {
    x = 100;  // This only changes the local copy
    std::cout << "Inside passByValue: x = " << x << std::endl;
}

void passByReference(int& x) {
    x = 200;  // This changes the original variable
    std::cout << "Inside passByReference: x = " << x << std::endl;
}

void passByPointer(int* x) {
    if (x != nullptr) {  // Always check for null pointers
        *x = 300;  // Dereference pointer to change original
        std::cout << "Inside passByPointer: *x = " << *x << std::endl;
    }
}

// Simple calculator function to practice
int calculator(int a, int b, char operation) {
    switch (operation) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': 
            if (b != 0) return a / b;
            else {
                std::cerr << "Error: Division by zero!" << std::endl;
                return 0;
            }
        default:
            std::cerr << "Error: Unknown operation '" << operation << "'" << std::endl;
            return 0;
    }
}

void demonstrateCalculator() {
    std::cout << "\n=== Calculator Demo ===" << std::endl;
    
    int a = 10, b = 5;
    
    std::cout << a << " + " << b << " = " << calculator(a, b, '+') << std::endl;
    std::cout << a << " - " << b << " = " << calculator(a, b, '-') << std::endl;
    std::cout << a << " * " << b << " = " << calculator(a, b, '*') << std::endl;
    std::cout << a << " / " << b << " = " << calculator(a, b, '/') << std::endl;
    
    // Test error cases
    std::cout << a << " / 0 = " << calculator(a, 0, '/') << std::endl;
    std::cout << a << " % " << b << " = " << calculator(a, b, '%') << std::endl;
}

int main() {
    std::cout << "C++ Fundamentals Examples" << std::endl;
    std::cout << "=========================" << std::endl;
    
    demonstrateTypes();
    demonstrateParameterPassing();
    demonstrateArrays();
    demonstrateControlFlow();
    demonstrateCalculator();
    
    std::cout << "\n=== Exercises for You ===" << std::endl;
    std::cout << "1. Modify the calculator to handle more operations (%, ^)" << std::endl;
    std::cout << "2. Write a function to reverse an array in-place" << std::endl;
    std::cout << "3. Implement a simple string length function without strlen()" << std::endl;
    std::cout << "4. Create a function that finds the second largest element in an array" << std::endl;
    std::cout << "5. Write a program that converts between different number bases" << std::endl;
    
    return 0;
} 