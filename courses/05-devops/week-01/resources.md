# Week 01 Resources: DevOps, SDLC, and Version Control for Teams

## 📚 Required Readings

### **DevOps Fundamentals**
- [The Phoenix Project](https://itrevolution.com/the-phoenix-project/) - Gene Kim, Kevin Behr, George Spafford
- [DevOps Handbook](https://itrevolution.com/the-devops-handbook/) - Gene Kim, Jez Humble, Patrick Debois, John Willis
- [Site Reliability Engineering](https://sre.google/sre-book/) - Google SRE Team (Free)
- [Accelerate](https://itrevolution.com/accelerate/) - Nicole Forsgren, Jez Humble, Gene Kim

### **Version Control & Git**
- [Pro Git](https://git-scm.com/book/en/v2) - Scott Chacon, Ben Straub (Free)
- [GitHub Flow](https://guides.github.com/introduction/flow/) - GitHub Guides
- [GitFlow Workflow](https://nvie.com/posts/a-successful-git-branching-model/) - Vincent Driessen
- [Conventional Commits](https://www.conventionalcommits.org/) - Specification

### **CI/CD & Automation**
- [Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html) - Martin Fowler
- [Continuous Delivery](https://martinfowler.com/books/continuousDelivery.html) - Jez Humble, David Farley
- [The Twelve-Factor App](https://12factor.net/) - Heroku (Free)
- [Infrastructure as Code](https://www.oreilly.com/library/view/infrastructure-as-code/9781491924334/) - Kief Morris

## 🎥 Video Tutorials

### **DevOps Culture**
- [What is DevOps?](https://www.youtube.com/watch?v=_I94-tJlovg) - AWS
- [The Three Ways of DevOps](https://www.youtube.com/watch?v=0yWAtQ6wYNM) - Gene Kim
- [DevOps Transformation](https://www.youtube.com/watch?v=uTEL8Ff1Zvk) - Google Cloud

### **Git & Version Control**
- [Git for Beginners](https://www.youtube.com/watch?v=8oRjP8yj2Wo) - Tech With Tim
- [Advanced Git Workflows](https://www.youtube.com/watch?v=Jt4ZQJ8zL8Y) - GitKraken
- [Git Branching Strategies](https://www.youtube.com/watch?v=1SXpE08hvGs) - Atlassian

### **CI/CD Pipelines**
- [GitHub Actions Tutorial](https://www.youtube.com/watch?v=R8_veQiYBjI) - TechWorld with Nana
- [Jenkins Pipeline Tutorial](https://www.youtube.com/watch?v=7KCS70sivK8) - Edureka
- [GitLab CI/CD](https://www.youtube.com/watch?v=1iXFbchozdY) - GitLab

## 📖 Books & Courses

### **Free Resources**
- [DevOps Roadmap](https://roadmap.sh/devops) - Community-driven roadmap
- [GitHub Learning Lab](https://lab.github.com/) - Interactive Git tutorials
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials) - Comprehensive guides
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/) - Official docs

### **Paid Courses**
- [DevOps Bootcamp](https://www.udemy.com/course/learn-devops-infrastructure-automation-with-terraform/) - Udemy ($12-15)
- [Git Complete](https://www.udemy.com/course/git-complete/) - Udemy ($12-15)
- [Jenkins Pipeline](https://www.udemy.com/course/jenkins-pipeline/) - Udemy ($12-15)

## 🔧 Tools & Software

### **Version Control**
- [Git](https://git-scm.com/) - Distributed version control
- [GitHub](https://github.com/) - Git hosting and collaboration
- [GitLab](https://gitlab.com/) - Complete DevOps platform
- [Bitbucket](https://bitbucket.org/) - Git hosting by Atlassian

### **CI/CD Platforms**
- [GitHub Actions](https://github.com/features/actions) - GitHub's CI/CD
- [GitLab CI/CD](https://docs.gitlab.com/ee/ci/) - GitLab's CI/CD
- [Jenkins](https://jenkins.io/) - Open-source automation server
- [CircleCI](https://circleci.com/) - Cloud CI/CD platform

### **Code Quality Tools**
- [SonarQube](https://www.sonarqube.org/) - Code quality and security
- [CodeQL](https://securitylab.github.com/tools/codeql/) - Security analysis
- [ESLint](https://eslint.org/) - JavaScript linting
- [Black](https://black.readthedocs.io/) - Python code formatting

## 🌐 Online Communities

### **Forums & Reddit**
- [r/devops](https://www.reddit.com/r/devops/) - DevOps community
- [r/git](https://www.reddit.com/r/git/) - Git discussions
- [Stack Overflow](https://stackoverflow.com/questions/tagged/devops) - Q&A
- [DevOps Stack Exchange](https://devops.stackexchange.com/) - Technical Q&A

### **Discord & Slack**
- [DevOps Chat](https://discord.gg/devops) - DevOps community
- [GitHub Community](https://github.com/orgs/community/discussions) - GitHub discussions
- [GitLab Community](https://gitlab.com/gitlab-org/gitlab/-/issues) - GitLab community

## 📝 Command Reference Cheatsheet

### **Git Basics**
```bash
# Initialize repository
git init
git clone <repository-url>

# Check status
git status
git log --oneline

# Stage and commit
git add .
git commit -m "feat: add new feature"

# Branch operations
git branch feature/new-feature
git checkout feature/new-feature
git checkout -b feature/new-feature

# Merge and rebase
git merge feature/new-feature
git rebase main

# Remote operations
git push origin feature/new-feature
git pull origin main
```

### **GitFlow Commands**
```bash
# Initialize GitFlow
git flow init -d

# Feature branches
git flow feature start feature-name
git flow feature finish feature-name

# Release branches
git flow release start 1.0.0
git flow release finish 1.0.0

# Hotfix branches
git flow hotfix start hotfix-name
git flow hotfix finish hotfix-name
```

### **GitHub CLI**
```bash
# Authentication
gh auth login

# Repository operations
gh repo create my-project --public
gh repo clone owner/repo

# Pull requests
gh pr create --title "Add new feature"
gh pr review --approve
gh pr merge

# Issues
gh issue create --title "Bug report"
gh issue list --assignee @me
```

### **CI/CD Commands**
```bash
# GitHub Actions
gh workflow list
gh workflow run ci.yml
gh run list

# Jenkins
jenkins-cli.jar build job-name
jenkins-cli.jar console job-name

# GitLab CI
gitlab-runner exec docker test
gitlab-runner status
```

## 🚀 Advanced Resources

### **DevOps Patterns**
- [DevOps Patterns](https://www.devops-patterns.com/) - Collection of patterns
- [SRE Patterns](https://sre.google/sre-book/table-of-contents/) - Google SRE book
- [Microservices Patterns](https://microservices.io/patterns/) - Chris Richardson

### **Security & Compliance**
- [OWASP DevSecOps](https://owasp.org/www-project-devsecops-maturity-model/) - Security practices
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) - Security standards
- [SOC 2 Compliance](https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/sorhomepage.html) - Compliance framework

### **Performance & Monitoring**
- [USE Method](http://www.brendangregg.com/usemethod.html) - Brendan Gregg
- [RED Method](https://grafana.com/blog/2018/08/02/the-red-method-how-to-instrument-your-services/) - Tom Wilkie
- [Golden Signals](https://sre.google/sre-book/monitoring-distributed-systems/) - Google SRE

### **Automation & Infrastructure**
- [Terraform Best Practices](https://www.terraform.io/docs/cloud/guides/recommended-practices/index.html) - HashiCorp
- [Ansible Best Practices](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html) - Red Hat
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/) - CNCF

---

*Bookmark these resources for your DevOps learning journey!* 