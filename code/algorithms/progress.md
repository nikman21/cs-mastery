# 🧮 Algorithm Practice Progress

**Goal:** 3-5 problems per week  
**Started:** [Start date]  
**Total solved:** 0

---

## 📊 Weekly Summary

| Week | Problems Solved | Easy | Medium | Hard | Notes |
|------|----------------|------|--------|------|-------|
| 1 | 0 | 0 | 0 | 0 | Getting started |
| 2 | 0 | 0 | 0 | 0 | |
| 3 | 0 | 0 | 0 | 0 | |

---

## 🎯 Current Focus Areas

### Data Structures
- [ ] Arrays & Strings
- [ ] Linked Lists  
- [ ] Stacks & Queues
- [ ] Trees & Graphs
- [ ] Hash Tables
- [ ] Heaps & Priority Queues

### Algorithms
- [ ] Two Pointers
- [ ] Sliding Window
- [ ] Binary Search
- [ ] DFS & BFS
- [ ] Dynamic Programming
- [ ] Backtracking
- [ ] Greedy Algorithms

---

## 📝 Problem Log

### Week 1: [Date Range]
**Focus:** Arrays & Two Pointers

| Date | Problem | Difficulty | Time | Status | Approach | Review Date |
|------|---------|------------|------|--------|----------|-------------|
| [Date] | [Problem name + link] | Easy | 25min | ✅ | Two pointers | [+1 week] |
| [Date] | [Problem name + link] | Medium | 45min | ❌ | - | [Tomorrow] |

**Patterns learned:**
- [Pattern 1 - when to use]
- [Pattern 2 - when to use]

**Areas to improve:**
- [Skill/concept to work on]

---

## 🔄 Review Schedule

### This Week
- [ ] [Problem to review from 1 week ago]
- [ ] [Problem to review from 2 weeks ago]

### Next Week  
- [ ] [Problem to review from this week]

---

## 📚 Algorithm Cheat Sheet

### Time Complexities
```
Arrays:
- Access: O(1)
- Search: O(n)
- Insert: O(n)
- Delete: O(n)

Linked Lists:
- Access: O(n)
- Search: O(n)
- Insert: O(1)
- Delete: O(1)

Binary Trees:
- Access: O(log n)
- Search: O(log n)
- Insert: O(log n)
- Delete: O(log n)
```

### Common Patterns
```cpp
// Two Pointers
int left = 0, right = nums.size() - 1;
while (left < right) {
    // Process
    if (condition) left++;
    else right--;
}

// Sliding Window
int left = 0;
for (int right = 0; right < nums.size(); right++) {
    // Expand window
    while (window_condition_broken) {
        // Shrink window
        left++;
    }
    // Update result
}

// Binary Search
int left = 0, right = nums.size() - 1;
while (left <= right) {
    int mid = left + (right - left) / 2;
    if (nums[mid] == target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
}
```

---

## 🎯 Monthly Goals

### Month 1: Foundation
- [ ] Master basic data structures
- [ ] Learn fundamental algorithms
- [ ] Solve 50+ easy problems
- [ ] Start medium problems

### Month 2: Intermediate  
- [ ] Dynamic programming basics
- [ ] Graph algorithms
- [ ] Solve 30+ medium problems
- [ ] Attempt hard problems

### Month 3: Advanced
- [ ] Advanced DP patterns
- [ ] Complex data structures
- [ ] Solve 20+ hard problems
- [ ] Mock interview practice

---

*Last updated: [Date]* 