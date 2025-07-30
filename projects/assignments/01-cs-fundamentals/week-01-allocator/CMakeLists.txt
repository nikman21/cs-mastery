cmake_minimum_required(VERSION 3.10)
project(Week01_MemoryAllocator)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Compiler-specific options
if(MSVC)
    # Visual Studio
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /W4")
    set(CMAKE_CXX_FLAGS_DEBUG "/Od /Zi /MDd /DDEBUG")
    set(CMAKE_CXX_FLAGS_RELEASE "/O2 /DNDEBUG /MD")
else()
    # GCC/Clang
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -Wpedantic")
    set(CMAKE_CXX_FLAGS_DEBUG "-g -O0 -DDEBUG")
    set(CMAKE_CXX_FLAGS_RELEASE "-O3 -DNDEBUG")
    
    # Enable AddressSanitizer in debug mode (highly recommended for this assignment)
    option(ENABLE_ASAN "Enable AddressSanitizer" ON)
    if(ENABLE_ASAN AND CMAKE_BUILD_TYPE STREQUAL "Debug")
        set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} -fsanitize=address -fno-omit-frame-pointer")
        set(CMAKE_EXE_LINKER_FLAGS_DEBUG "${CMAKE_EXE_LINKER_FLAGS_DEBUG} -fsanitize=address")
        message(STATUS "AddressSanitizer enabled (helps catch memory errors)")
    endif()
endif()

# Default to Debug build if not specified
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Debug)
    message(STATUS "No build type specified, defaulting to Debug")
endif()

# Source files
set(ALLOCATOR_SOURCES
    allocator.cpp
    allocator.h
)

# Create allocator library
add_library(allocator_lib ${ALLOCATOR_SOURCES})

# Main test executable
add_executable(allocator_test main.cpp)

# Link the library to the test program
target_link_libraries(allocator_test allocator_lib)

# Set output directory
set_target_properties(allocator_test PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
)

# Print build information
message(STATUS "")
message(STATUS "=== Week 1 Memory Allocator Assignment ===")
message(STATUS "Build type: ${CMAKE_BUILD_TYPE}")
message(STATUS "C++ Compiler: ${CMAKE_CXX_COMPILER_ID}")
message(STATUS "C++ Standard: ${CMAKE_CXX_STANDARD}")

if(ENABLE_ASAN AND CMAKE_BUILD_TYPE STREQUAL "Debug")
    message(STATUS "AddressSanitizer: Enabled (recommended for debugging)")
else()
    message(STATUS "AddressSanitizer: Disabled")
endif()

message(STATUS "")
message(STATUS "Build Instructions:")
message(STATUS "  mkdir build && cd build")
message(STATUS "  cmake .. -DCMAKE_BUILD_TYPE=Debug")
message(STATUS "  make (or cmake --build .)")
message(STATUS "  ./bin/allocator_test")
message(STATUS "")
message(STATUS "Assignment Goals:")
message(STATUS "  1. Implement free list algorithm in findFreeBlock()")
message(STATUS "  2. Add block splitting in splitBlock()")
message(STATUS "  3. Implement coalescing in mergeWithNext()")
message(STATUS "  4. Pass all tests in allocator_test")
message(STATUS "")

# Add custom target for running tests
add_custom_target(run_tests
    COMMAND allocator_test
    DEPENDS allocator_test
    WORKING_DIRECTORY ${CMAKE_BINARY_DIR}/bin
    COMMENT "Running memory allocator tests"
)

# Add custom target for quick build and test
add_custom_target(test
    COMMAND ${CMAKE_COMMAND} --build . --target allocator_test
    COMMAND ${CMAKE_BINARY_DIR}/bin/allocator_test
    WORKING_DIRECTORY ${CMAKE_BINARY_DIR}
    COMMENT "Building and running tests"
)

message(STATUS "Available targets:")
message(STATUS "  allocator_test  - Build the test program")
message(STATUS "  run_tests       - Run the test program") 
message(STATUS "  test           - Build and run tests in one command")
message(STATUS "==========================================")
message(STATUS "") 