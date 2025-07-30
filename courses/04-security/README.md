# SEC 302 — Secure Software Engineering & Application Security

**Duration:** 7 weeks (accelerated)  
**Credits:** 3  
**Prerequisites:** Data structures, basic web development, HTTP fundamentals, Git version control

## 📋 Course Description

This course focuses on designing, building, and verifying secure web services through practical application of security principles. Students will learn to analyze attack surfaces, implement secure authentication and authorization, validate inputs, protect against common web vulnerabilities, and integrate security testing into development pipelines. The course emphasizes standards-based approaches using OWASP guidelines and real-world security scenarios.

## 🎯 Learning Outcomes

### **Analyze** (Application)
- [ ] Analyze application attack surfaces using STRIDE methodology
- [ ] Evaluate authentication and authorization mechanisms for multi-tenant systems
- [ ] Assess input validation strategies across different contexts
- [ ] Analyze cross-origin resource sharing (CORS) policies and risks

### **Design** (Synthesis)
- [ ] Design tenant-aware role-based access control (RBAC) systems
- [ ] Architect secure session management and state handling
- [ ] Design comprehensive logging and auditing systems
- [ ] Plan secure webhook implementations with verification

### **Implement** (Application)
- [ ] Implement contextual input validation and output encoding
- [ ] Create content security policies (CSP) with nonce/hash directives
- [ ] Build idempotent webhook handlers with signature verification
- [ ] Integrate SAST/DAST tools into CI/CD pipelines

### **Evaluate** (Evaluation)
- [ ] Evaluate CSP trade-offs between security and functionality
- [ ] Assess rate limiting strategies for abuse prevention
- [ ] Review security scan results and prioritize remediation
- [ ] Critique incident response procedures and postmortems

### **Create** (Creation)
- [ ] Create comprehensive threat models for web applications
- [ ] Develop abuse-case tests for security validation
- [ ] Build secure multi-tenant applications with proper isolation
- [ ] Generate security incident response playbooks

## 📊 Assessment Breakdown

- **Weekly Assignments (45%)**: Hands-on security implementations and testing
- **Capstone Project (35%)**: End-to-end secure application with security testing
- **Midterm (10%)**: Security concepts and threat modeling (Week 4)
- **Final (10%)**: Security testing and incident response (Week 7)

## 📚 Prerequisites

### **Required Skills**
- Data structures and algorithms fundamentals
- Basic web development (HTML, CSS, JavaScript)
- HTTP protocol understanding (methods, headers, status codes)
- Git version control proficiency
- Familiarity with at least one programming language

### **Recommended Experience**
- Web application development
- Database concepts and SQL
- Network security basics
- Software testing fundamentals

## 📅 Course Schedule

| Week | Topic | Deliverable | Due |
|------|-------|-------------|-----|
| 01 | Secure SDLC & Threat Modeling | Threat model for multi-user app | End of Week 1 |
| 02 | AuthN/AuthZ & Tenant Isolation | RBAC implementation with tests | End of Week 2 |
| 03 | Input Validation, XSS, and CSP | XSS protection with CSP | End of Week 3 |
| 04 | CSRF, CORS, Sessions & State | CSRF protection implementation | End of Week 4 |
| 05 | IDOR, Logging/Auditing, and Abuse Cases | IDOR protection with audit trails | End of Week 5 |
| 06 | Webhooks, Crypto Hygiene, Secrets, and Rate Limiting | Secure webhook implementation | End of Week 6 |
| 07 | SAST/DAST, Supply Chain, and Incident Response | Security testing demo and incident drill | End of Week 7 |

## 🎓 Capstone Project

### **Overview**
Build a secure multi-tenant web application with comprehensive security testing, monitoring, and incident response capabilities.

### **Milestones**
- **M1 (Week 2)**: Threat model and security requirements specification
- **M2 (Week 5)**: Protected prototype with security tests and initial scan results
- **Final (Week 7)**: Complete demo with incident response simulation and final report

### **Deliverables**
- Secure multi-tenant web application
- Comprehensive threat model and security documentation
- Security testing pipeline with SAST/DAST integration
- Incident response playbook and postmortem
- Security audit report and remediation plan

## 🔧 Tools & Technologies

### **Security Testing**
- **SAST**: SonarQube, CodeQL, Semgrep
- **DAST**: OWASP ZAP, Burp Suite Community
- **Container Security**: Trivy, Snyk
- **Dependency Scanning**: npm audit, pip-audit, Snyk

### **Security Standards**
- **OWASP Top 10**: Web application security risks
- **OWASP ASVS**: Application security verification standard
- **CWE**: Common Weakness Enumeration
- **CVE**: Common Vulnerabilities and Exposures

### **Development Tools**
- **Languages**: Python, Node.js, Go, or similar
- **Frameworks**: Express.js, Flask, Gin, or similar
- **Databases**: PostgreSQL, MongoDB, or similar
- **Authentication**: JWT, OAuth 2.0, OpenID Connect

### **Security Libraries**
- **Input Validation**: Joi, Pydantic, validator.js
- **Cryptography**: bcrypt, crypto-js, cryptography
- **Rate Limiting**: express-rate-limit, slowapi
- **CORS**: cors, flask-cors

## 📝 Definition of Done

### **Course Completion Checklist**
- [ ] All 7 weeks present with complete materials
- [ ] Each assignment includes acceptance criteria and grading rubric
- [ ] All references are standards-based (OWASP, NIST, etc.)
- [ ] No secrets or sensitive information in materials
- [ ] Examples are minimal, generic, and vendor-neutral
- [ ] Cross-references to `/projects/` and `/code/` implemented
- [ ] Progress tracking integration completed

### **Student Completion Checklist**
- [ ] All weekly assignments submitted and graded
- [ ] Capstone project completed and demonstrated
- [ ] Midterm and final assessments completed
- [ ] Progress tracking updated in `/progress/tracking.md`
- [ ] All code committed to appropriate repositories
- [ ] Security documentation and threat models submitted

## 🤔 Assumptions

1. **Environment**: Students have access to modern development machines with internet connectivity
2. **Tools**: Free access to security testing tools and cloud platforms
3. **Time**: 15-20 hours per week for accelerated course format
4. **Standards**: Focus on OWASP, NIST, and other open security standards
5. **Prerequisites**: Basic web development and programming skills
6. **Vendor Neutrality**: Emphasis on security principles over specific tools
7. **Ethics**: All security testing conducted in controlled, authorized environments
8. **Scalability**: Examples work for both small applications and enterprise systems

---

*Ready to build secure applications from the ground up? Start with Week 1!* 