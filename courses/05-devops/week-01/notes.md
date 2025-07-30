# Week 01 Notes: DevOps, SDLC, and Version Control for Teams

## 📝 Key Terms & Definitions

### **DevOps Culture**
- **DevOps**: Cultural movement emphasizing collaboration between development and operations
- **SRE (Site Reliability Engineering)**: Engineering discipline focused on reliability and automation
- **Shift Left**: Moving testing and quality checks earlier in the development process
- **Continuous Everything**: Continuous integration, delivery, deployment, and monitoring

### **Version Control Concepts**
- **Branch**: Independent line of development
- **Merge**: Combining changes from different branches
- **Rebase**: Replaying commits on top of another branch
- **Cherry-pick**: Selecting specific commits to apply
- **Stash**: Temporarily saving uncommitted changes

### **CI/CD Pipeline**
- **Continuous Integration**: Automatically building and testing code changes
- **Continuous Delivery**: Automatically preparing code for deployment
- **Continuous Deployment**: Automatically deploying to production
- **Pipeline**: Automated sequence of steps for code delivery
- **Quality Gate**: Automated check that must pass before proceeding

## 🏗️ Diagrams

### **GitFlow Workflow**
```
main     ●────────●────────●────────●
         │        │        │        │
develop  ●────────●────────●────────●
         │        │        │        │
feature  ●────────●────────●
         │        │        │
release  ●────────●────────●
         │        │        │
hotfix   ●────────●────────●
```

### **GitHub Flow**
```
main     ●────────●────────●────────●
         │        │        │        │
feature  ●────────●────────●
         │        │        │
         └────────┴────────┘
              PR Merge
```

### **CI/CD Pipeline Stages**
```
Code → Build → Test → Security → Deploy → Monitor
  │      │      │       │         │        │
  └──────┴──────┴───────┴─────────┴────────┘
           Automated Pipeline
```

### **Code Review Process**
```
Developer → PR → Automated Checks → Review → Merge → Deploy
     │         │         │           │        │        │
     └─────────┴─────────┴───────────┴────────┴────────┘
                    Quality Gates
```

## 🔄 Patterns & Anti-Patterns

### **Effective Patterns**

#### **Branching Strategy**
- **GitFlow**: Good for release-based workflows
- **GitHub Flow**: Good for continuous deployment
- **Trunk-Based Development**: Good for high-frequency deployments

#### **Commit Messages**
```
feat: add user authentication module
fix: resolve login timeout issue
docs: update API documentation
test: add unit tests for auth service
refactor: simplify password validation
```

#### **Pull Request Structure**
- Clear description of changes
- Link to related issues
- Screenshots for UI changes
- Test coverage information
- Breaking change documentation

### **Anti-Patterns to Avoid**

#### **Version Control**
- ❌ Committing directly to main branch
- ❌ Large, monolithic commits
- ❌ Commit messages like "fix stuff" or "update"
- ❌ Force pushing to shared branches
- ❌ Ignoring merge conflicts

#### **CI/CD**
- ❌ Skipping tests in pipeline
- ❌ Manual deployment steps
- ❌ No rollback strategy
- ❌ Ignoring security scans
- ❌ No monitoring of pipeline health

#### **Code Review**
- ❌ Rubber-stamp approvals
- ❌ No automated checks
- ❌ Reviewing too many changes at once
- ❌ No feedback on code quality
- ❌ Ignoring documentation updates

## 🚨 Common Pitfalls & Troubleshooting

### **Git Issues**

#### **Merge Conflicts**
```bash
# Check status
git status

# See conflicts
git diff

# Resolve conflicts manually
# Edit conflicted files

# Add resolved files
git add .

# Complete merge
git commit
```

#### **Lost Commits**
```bash
# Find lost commits
git reflog

# Recover specific commit
git checkout <commit-hash>

# Create new branch from recovered commit
git checkout -b recovery-branch
```

#### **Wrong Branch**
```bash
# Stash current changes
git stash

# Switch to correct branch
git checkout correct-branch

# Apply stashed changes
git stash pop
```

### **CI/CD Issues**

#### **Pipeline Failures**
```bash
# Check pipeline logs
# Look for specific error messages
# Verify environment variables
# Check dependencies and versions
# Test locally if possible
```

#### **Build Failures**
- Missing dependencies
- Version conflicts
- Environment differences
- Resource constraints
- Network issues

#### **Test Failures**
- Flaky tests
- Environment setup issues
- Data dependencies
- Timing issues
- Configuration problems

### **Code Review Issues**

#### **Review Bottlenecks**
- Too many reviewers required
- No automated checks
- Large change sets
- Unclear requirements
- No review guidelines

#### **Quality Issues**
- Inconsistent coding standards
- Missing tests
- Poor documentation
- Security vulnerabilities
- Performance problems

## 📚 "Oral Exam" Study Questions

### **DevOps Culture**
1. What are the three ways of DevOps?
2. How does DevOps differ from traditional development?
3. What is the role of automation in DevOps?
4. How do you measure DevOps success?

### **Version Control**
1. Explain the difference between merge and rebase
2. When would you use GitFlow vs GitHub Flow?
3. How do you handle hotfixes in different branching strategies?
4. What are the benefits of conventional commits?

### **CI/CD Pipeline**
1. What are the essential stages of a CI/CD pipeline?
2. How do you implement quality gates?
3. What is the difference between CI and CD?
4. How do you handle pipeline failures?

### **Code Review**
1. What makes an effective code review?
2. How do you balance thoroughness with speed?
3. What automated checks should be part of review?
4. How do you handle disagreements in reviews?

### **Team Collaboration**
1. How do you scale code review processes?
2. What tools support effective collaboration?
3. How do you maintain code quality at scale?
4. What metrics indicate healthy team practices?

## 🔧 Troubleshooting Checklist

### **Git Workflow Issues**
- [ ] Check current branch with `git branch`
- [ ] Verify remote configuration with `git remote -v`
- [ ] Check for uncommitted changes with `git status`
- [ ] Review commit history with `git log --oneline`
- [ ] Verify merge conflicts with `git diff`

### **CI/CD Pipeline Issues**
- [ ] Check pipeline logs for specific errors
- [ ] Verify environment variables and secrets
- [ ] Test build steps locally
- [ ] Check resource limits and quotas
- [ ] Verify network connectivity and dependencies

### **Code Review Issues**
- [ ] Ensure all automated checks pass
- [ ] Verify code coverage requirements
- [ ] Check for security vulnerabilities
- [ ] Review documentation updates
- [ ] Confirm breaking change documentation

### **Team Collaboration Issues**
- [ ] Verify access permissions and roles
- [ ] Check notification settings
- [ ] Review project board configuration
- [ ] Ensure issue templates are working
- [ ] Verify milestone tracking

---

*Use these notes as a reference during your DevOps journey!* 