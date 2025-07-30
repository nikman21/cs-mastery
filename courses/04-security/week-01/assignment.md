# Week 01: Secure SDLC & Threat Modeling

**Learning Objectives:**
- [ ] Apply STRIDE methodology to analyze application attack surfaces
- [ ] Identify and document assets, trust boundaries, and data flows
- [ ] Create comprehensive threat models for web applications
- [ ] Implement threat modeling in the software development lifecycle
- [ ] Evaluate security risks and prioritize mitigation strategies
- [ ] Document security requirements and design principles

## 🎯 Scenario: Secure Social Media Platform

You've been hired as a security architect at SocialCorp, a startup building a new social media platform. The platform allows users to create profiles, share posts, follow other users, and send private messages. The development team is eager to start coding but lacks security planning.

Your mission: Create a comprehensive threat model for the social media platform using STRIDE methodology, identify critical security risks, and establish security requirements that will guide the entire development process.

## 📋 Step-by-Step Tasks

### Task 1: Asset Identification and Trust Boundaries (1.5 hours)

#### 1.1 Define System Assets
Create a comprehensive list of assets including:
- **Data Assets**: User profiles, posts, messages, authentication tokens
- **System Assets**: Web servers, databases, APIs, CDN
- **Infrastructure Assets**: Cloud services, networks, SSL certificates
- **Business Assets**: User trust, brand reputation, compliance requirements

#### 1.2 Map Trust Boundaries
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Internet      │    │   Load Balancer │    │   Web Servers   │
│   (Untrusted)   │───▶│   (Semi-Trust)  │───▶│   (Trusted)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   API Gateway   │    │   Database      │
│   (Semi-Trust)  │◀───│   (Trusted)     │◀───│   (Trusted)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Task 2: Data Flow Analysis (1 hour)

#### 2.1 Create Data Flow Diagrams
Document key data flows:
- User registration and authentication
- Post creation and sharing
- Private messaging
- User profile management
- Content moderation

#### 2.2 Identify Data Entry Points
- Web forms and APIs
- File uploads
- Third-party integrations
- Mobile applications
- Admin interfaces

### Task 3: STRIDE Threat Analysis (2 hours)

#### 3.1 Spoofing Threats
- **Threat**: Attackers impersonate legitimate users
- **Assets at Risk**: User accounts, admin privileges
- **Mitigation**: Strong authentication, session management
- **Risk Level**: HIGH

#### 3.2 Tampering Threats
- **Threat**: Unauthorized modification of data
- **Assets at Risk**: User posts, profiles, messages
- **Mitigation**: Input validation, authorization checks
- **Risk Level**: HIGH

#### 3.3 Repudiation Threats
- **Threat**: Users deny actions they performed
- **Assets at Risk**: Audit trails, accountability
- **Mitigation**: Comprehensive logging, digital signatures
- **Risk Level**: MEDIUM

#### 3.4 Information Disclosure Threats
- **Threat**: Unauthorized access to sensitive data
- **Assets at Risk**: Private messages, user data
- **Mitigation**: Encryption, access controls
- **Risk Level**: HIGH

#### 3.5 Denial of Service Threats
- **Threat**: Service unavailability
- **Assets at Risk**: Platform availability, user experience
- **Mitigation**: Rate limiting, resource monitoring
- **Risk Level**: MEDIUM

#### 3.6 Elevation of Privilege Threats
- **Threat**: Unauthorized access to admin functions
- **Assets at Risk**: System administration, user data
- **Mitigation**: Role-based access control, privilege separation
- **Risk Level**: HIGH

### Task 4: Security Requirements Definition (1 hour)

#### 4.1 Authentication Requirements
- Multi-factor authentication for admin accounts
- Password complexity and rotation policies
- Session timeout and management
- Account lockout mechanisms

#### 4.2 Authorization Requirements
- Role-based access control (RBAC)
- Resource-level permissions
- Principle of least privilege
- Regular access reviews

#### 4.3 Data Protection Requirements
- Encryption at rest and in transit
- Data classification and handling
- Privacy compliance (GDPR, CCPA)
- Data retention and disposal

#### 4.4 Monitoring Requirements
- Security event logging
- Real-time threat detection
- Incident response procedures
- Regular security assessments

### Task 5: Threat Model Documentation (1 hour)

#### 5.1 Create Threat Model Report
Document the complete threat model including:
- Executive summary
- System overview and architecture
- Asset inventory
- Trust boundaries
- Data flow diagrams
- STRIDE analysis results
- Security requirements
- Risk prioritization matrix

## 📤 Deliverables & What to Submit

### Required Files
1. **Threat Model Report** (PDF or Markdown)
2. **Data Flow Diagrams** (ASCII or image format)
3. **STRIDE Analysis Spreadsheet** (CSV or Excel)
4. **Security Requirements Document**
5. **Progress tracking update** (see below)

### Repository Structure
```
threat-model/
├── docs/
│   ├── threat-model-report.md
│   ├── data-flow-diagrams.md
│   ├── security-requirements.md
│   └── stride-analysis.csv
├── diagrams/
│   ├── system-architecture.txt
│   ├── trust-boundaries.txt
│   └── data-flows.txt
├── templates/
│   └── threat-model-template.md
└── README.md
```

### Progress Tracking
Add the following entry to `/progress/tracking.md`:
```markdown
- [ ] Security W01 completed: [DATE], [THREAT_MODEL_LINK], STRIDE analysis completed for social media platform
```

## ✅ Acceptance Criteria

### **Asset Identification (20 points)**
- [ ] All critical assets identified and categorized
- [ ] Trust boundaries clearly defined and documented
- [ ] Data classification scheme established
- [ ] Asset inventory complete and accurate
- [ ] Business impact assessment included

### **STRIDE Analysis (30 points)**
- [ ] All STRIDE categories analyzed for each asset
- [ ] Threat scenarios realistic and comprehensive
- [ ] Risk levels properly assessed and justified
- [ ] Mitigation strategies identified for each threat
- [ ] Analysis covers both technical and business risks

### **Data Flow Documentation (20 points)**
- [ ] Data flow diagrams created for all major functions
- [ ] Entry and exit points clearly identified
- [ ] Data transformations documented
- [ ] Trust boundaries marked on diagrams
- [ ] Data sensitivity levels indicated

### **Security Requirements (20 points)**
- [ ] Requirements cover all major security areas
- [ ] Requirements are specific and measurable
- [ ] Compliance requirements identified
- [ ] Requirements prioritized by risk level
- [ ] Implementation guidance provided

### **Documentation Quality (10 points)**
- [ ] Threat model report is clear and comprehensive
- [ ] Diagrams are readable and accurate
- [ ] Documentation follows consistent format
- [ ] Executive summary included
- [ ] References and sources cited

## 📊 Grading Rubric

### **Exceeds Expectations (90-100 points)**
- Comprehensive threat model with detailed STRIDE analysis
- Advanced threat scenarios and sophisticated mitigation strategies
- Professional-quality documentation with clear diagrams
- Integration with industry standards (OWASP, NIST)
- Innovative security approaches and risk assessment methods

### **Meets Expectations (80-89 points)**
- Complete threat model covering all STRIDE categories
- Good coverage of assets and trust boundaries
- Clear documentation with adequate diagrams
- Standard security requirements and mitigation strategies
- Proper risk assessment and prioritization

### **Approaches Expectations (70-79 points)**
- Basic threat model with some STRIDE categories missing
- Limited asset identification and trust boundary analysis
- Documentation needs improvement
- Generic security requirements
- Incomplete risk assessment

### **Below Expectations (0-69 points)**
- Incomplete or missing threat model
- No STRIDE analysis or poor quality analysis
- Missing or poor documentation
- No security requirements defined
- No risk assessment performed

## 🤔 Reflection Prompts

### **Learning Objectives Connection**
1. How does STRIDE methodology help identify threats that might be overlooked?
2. What are the most critical assets in your threat model and why?
3. How do trust boundaries influence security design decisions?

### **Security Principles**
1. How does the principle of defense in depth apply to your threat model?
2. What trade-offs exist between security and usability in your design?
3. How would you prioritize threats based on likelihood and impact?

### **Real-World Application**
1. How would this threat model change for different types of applications?
2. What additional threats might emerge as the platform scales?
3. How would you validate the effectiveness of your mitigation strategies?

## 🔗 Cross-References

### **Code Repository**
Place your threat model documentation in:
- `/code/implementations/security/week-01-threat-modeling/`
- Include all diagrams, analysis, and requirements

### **Project Integration**
Your threat model will guide development in:
- Week 2: Authentication and authorization design
- Week 3: Input validation and XSS protection
- Week 4: Session management and CSRF protection
- Capstone project: End-to-end secure application

### **Progress Tracking**
Update `/progress/tracking.md` with your completion status and link to your threat model repository.

---

*Complete these tasks to establish a solid security foundation for your application!* 