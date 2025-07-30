# Week 01: DevOps, SDLC, and Version Control for Teams

**Learning Objectives:**
- [ ] Implement Git branching strategies (GitFlow, GitHub Flow)
- [ ] Establish code review workflows and quality gates
- [ ] Set up basic CI/CD pipeline with automated testing
- [ ] Configure team collaboration tools and processes
- [ ] Apply DevOps culture principles to development workflow
- [ ] Create comprehensive documentation and runbooks

## 🎯 Scenario: Modernizing Legacy Development Practices

You've been hired as a DevOps engineer at TechCorp, a mid-size company struggling with deployment delays, code conflicts, and inconsistent releases. The development team currently uses a single main branch with manual deployments, leading to frequent production issues and long release cycles.

Your mission: Transform their development workflow to implement modern DevOps practices, establish proper version control strategies, and set up automated CI/CD pipelines that enable rapid, reliable deployments.

## 📋 Step-by-Step Tasks

### Task 1: Git Branching Strategy Implementation (2 hours)

#### 1.1 Set up GitFlow Workflow
```bash
# Initialize repository with GitFlow
git flow init -d

# Create feature branch
git flow feature start user-authentication

# Make changes and commit
echo "# User authentication module" > auth.md
git add auth.md
git commit -m "feat: add user authentication module"

# Finish feature branch
git flow feature finish user-authentication
```

#### 1.2 Implement GitHub Flow Alternative
```bash
# Create feature branch from main
git checkout -b feature/payment-integration

# Make changes and commit
echo "# Payment processing" > payment.md
git add payment.md
git commit -m "feat: add payment processing"

# Push and create pull request
git push origin feature/payment-integration
```

### Task 2: Code Review Workflow Setup (1.5 hours)

#### 2.1 Configure Pull Request Templates
Create `.github/pull_request_template.md`:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

#### 2.2 Set up Branch Protection Rules
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict direct pushes to main branch

### Task 3: CI/CD Pipeline Implementation (2.5 hours)

#### 3.1 Create GitHub Actions Workflow
Create `.github/workflows/ci.yml`:
```yaml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Run tests
      run: |
        echo "Running unit tests..."
        # Add your test commands here
    - name: Run linting
      run: |
        echo "Running code linting..."
        # Add your linting commands here
```

#### 3.2 Implement Quality Gates
- Code coverage thresholds (minimum 80%)
- Security scanning with CodeQL
- Dependency vulnerability checks
- Performance regression testing

### Task 4: Team Collaboration Tools (1 hour)

#### 4.1 Set up Project Management
- Create GitHub Projects board
- Define issue templates
- Set up automated issue labeling
- Configure milestone tracking

#### 4.2 Documentation Standards
- Create CONTRIBUTING.md
- Set up API documentation with OpenAPI
- Implement changelog generation
- Create deployment runbooks

## 📤 Deliverables & What to Submit

### Required Files
1. **Git repository** with implemented branching strategy
2. **CI/CD pipeline configuration** (GitHub Actions or equivalent)
3. **Code review workflow documentation**
4. **Team collaboration setup** (project board, templates)
5. **Progress tracking update** (see below)

### Repository Structure
```
project-root/
├── .github/
│   ├── workflows/
│   │   └── ci.yml
│   ├── pull_request_template.md
│   └── ISSUE_TEMPLATE/
│       └── bug_report.md
├── docs/
│   ├── CONTRIBUTING.md
│   ├── DEPLOYMENT.md
│   └── API.md
├── src/
│   └── (your application code)
├── tests/
│   └── (test files)
├── README.md
└── CHANGELOG.md
```

### Progress Tracking
Add the following entry to `/progress/tracking.md`:
```markdown
- [ ] DevOps W01 completed: [DATE], [REPO_LINK], branching strategy implemented with CI/CD pipeline
```

## ✅ Acceptance Criteria

### **Git Workflow (25 points)**
- [ ] GitFlow or GitHub Flow implemented correctly
- [ ] Feature branches created and merged properly
- [ ] Commit messages follow conventional commits format
- [ ] Branch protection rules configured
- [ ] Repository history is clean and logical

### **Code Review Process (20 points)**
- [ ] Pull request template created and functional
- [ ] Review requirements enforced
- [ ] Code review checklist implemented
- [ ] Review process documented
- [ ] Automated quality checks configured

### **CI/CD Pipeline (30 points)**
- [ ] Automated testing on every commit
- [ ] Code quality checks (linting, formatting)
- [ ] Security scanning implemented
- [ ] Pipeline runs successfully
- [ ] Quality gates prevent bad code from merging

### **Documentation (15 points)**
- [ ] CONTRIBUTING.md created
- [ ] Deployment runbook documented
- [ ] API documentation started
- [ ] Changelog generation configured
- [ ] README.md updated with setup instructions

### **Team Collaboration (10 points)**
- [ ] Project board configured
- [ ] Issue templates created
- [ ] Milestone tracking set up
- [ ] Team workflow documented
- [ ] Communication channels established

## 📊 Grading Rubric

### **Exceeds Expectations (90-100 points)**
- Implements both GitFlow and GitHub Flow with clear documentation
- Advanced CI/CD features (performance testing, security scanning)
- Comprehensive documentation with examples
- Automated quality gates with custom rules
- Team collaboration tools fully integrated

### **Meets Expectations (80-89 points)**
- Implements one branching strategy correctly
- Basic CI/CD pipeline with testing and linting
- Good documentation coverage
- Standard quality gates implemented
- Basic team collaboration setup

### **Approaches Expectations (70-79 points)**
- Branching strategy partially implemented
- CI/CD pipeline has some issues
- Documentation is incomplete
- Quality gates missing or not working
- Team collaboration tools not fully configured

### **Below Expectations (0-69 points)**
- Branching strategy not implemented
- No CI/CD pipeline
- Missing or poor documentation
- No quality gates
- No team collaboration setup

## 🤔 Reflection Prompts

### **Learning Objectives Connection**
1. How does your branching strategy support rapid development while maintaining code quality?
2. What quality gates are most important for your team's success?
3. How does your CI/CD pipeline reduce deployment risks?

### **Error Budget Considerations**
1. What types of failures would your pipeline catch before production?
2. How does your review process prevent bugs from reaching users?
3. What metrics would you track to measure pipeline effectiveness?

### **SLOs and Reliability**
1. How does your workflow contribute to service reliability?
2. What deployment frequency does your pipeline enable?
3. How do you measure and improve deployment success rate?

## 🔗 Cross-References

### **Code Repository**
Place your implementation code in:
- `/code/implementations/devops/week-01-branching-strategy/`
- Include all configuration files and documentation

### **Project Integration**
Your branching strategy will be used in:
- Week 2: Containerization (Docker images)
- Week 3: Kubernetes deployments
- Week 8: Continuous delivery strategies
- Capstone project: End-to-end pipeline

### **Progress Tracking**
Update `/progress/tracking.md` with your completion status and link to your repository.

---

*Complete these tasks to establish a solid foundation for modern DevOps practices!* 