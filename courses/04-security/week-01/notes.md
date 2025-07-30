# Week 01 Notes: Secure SDLC & Threat Modeling

## 📝 Key Terms & Definitions

### **Threat Modeling Concepts**
- **Threat**: Any circumstance or event with the potential to harm an information system
- **Vulnerability**: Weakness in a system that could be exploited by a threat
- **Risk**: Potential for loss or harm when a threat exploits a vulnerability
- **Asset**: Any resource of value that needs protection
- **Trust Boundary**: Interface between components with different trust levels

### **STRIDE Methodology**
- **Spoofing**: Impersonating someone or something else
- **Tampering**: Modifying data or code in an unauthorized way
- **Repudiation**: Denying responsibility for an action
- **Information Disclosure**: Exposing information to unauthorized parties
- **Denial of Service**: Making a service unavailable to legitimate users
- **Elevation of Privilege**: Gaining unauthorized access to higher privileges

### **Security Development Lifecycle (SDLC)**
- **Requirements Phase**: Define security requirements and constraints
- **Design Phase**: Create threat models and security architecture
- **Implementation Phase**: Code with security best practices
- **Verification Phase**: Test for security vulnerabilities
- **Release Phase**: Deploy with security controls
- **Response Phase**: Monitor and respond to security incidents

## 🏗️ Diagrams

### **Basic System Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client        │    │   Web Server    │    │   Database      │
│   (Browser)     │───▶│   (Application) │───▶│   (Data Store)  │
│   Untrusted     │    │   Trusted       │    │   Trusted       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   Load Balancer │    │   Backup        │
│   Semi-Trusted  │    │   Semi-Trusted  │    │   Trusted       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Data Flow Diagram**
```
User Input ──▶ Validation ──▶ Processing ──▶ Storage
    │              │              │              │
    ▼              ▼              ▼              ▼
Logging ──▶ Audit Trail ──▶ Monitoring ──▶ Backup
```

### **Trust Boundary Analysis**
```
┌─────────────────────────────────────────────────────────────┐
│                    Internet (Untrusted)                     │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 Perimeter (Semi-Trusted)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Firewall  │  │   WAF       │  │   CDN       │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Internal (Trusted)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Web Server  │  │ App Server  │  │ Database    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### **Attack Tree Example**
```
                    Root Attack Goal
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    Spoofing          Tampering         Information
        │                  │              Disclosure
        │                  │                  │
    ┌───┴───┐        ┌───┴───┐        ┌───┴───┐
    │       │        │       │        │       │
Session   Credential Data   Code    Network   Database
Hijacking  Theft     Corruption  Injection  Dump
```

## 🔄 Patterns & Anti-Patterns

### **Effective Threat Modeling Patterns**

#### **Defense in Depth**
- Multiple layers of security controls
- No single point of failure
- Redundant protection mechanisms
- Fail-secure design principles

#### **Principle of Least Privilege**
- Users have minimum necessary access
- Systems run with minimal permissions
- Regular access reviews
- Just-in-time access provisioning

#### **Zero Trust Architecture**
- Never trust, always verify
- Continuous authentication
- Micro-segmentation
- Least privilege enforcement

#### **Secure by Design**
- Security built into architecture
- Threat modeling from the start
- Security requirements defined early
- Regular security reviews

### **Anti-Patterns to Avoid**

#### **Security Theater**
- ❌ Security measures that look good but don't work
- ❌ Complex security that doesn't address real threats
- ❌ Compliance-focused rather than risk-focused
- ❌ Security as an afterthought

#### **Trusting Too Much**
- ❌ Assuming internal networks are safe
- ❌ Trusting user input without validation
- ❌ Believing third-party components are secure
- ❌ Ignoring insider threats

#### **Over-Engineering**
- ❌ Complex security that's hard to maintain
- ❌ Security that impacts usability too much
- ❌ Multiple overlapping security controls
- ❌ Security without clear threat models

## 🚨 Common Pitfalls & Troubleshooting

### **Threat Modeling Issues**

#### **Incomplete Asset Identification**
```bash
# Checklist for asset identification
- [ ] Data assets (user data, business data, config)
- [ ] System assets (servers, networks, applications)
- [ ] Infrastructure assets (cloud services, certificates)
- [ ] Business assets (reputation, compliance, trust)
- [ ] Human assets (users, administrators, developers)
```

#### **Poor Risk Assessment**
```bash
# Risk assessment framework
Likelihood: Low (1) | Medium (2) | High (3)
Impact: Low (1) | Medium (2) | High (3)
Risk Score = Likelihood × Impact

Risk Levels:
1-2: Low Risk
3-4: Medium Risk
6-9: High Risk
```

#### **Missing Trust Boundaries**
```bash
# Trust boundary identification
- [ ] Network boundaries (Internet, DMZ, internal)
- [ ] Application boundaries (frontend, backend, database)
- [ ] User boundaries (anonymous, authenticated, admin)
- [ ] Data boundaries (public, internal, confidential)
- [ ] Process boundaries (user space, kernel space)
```

### **STRIDE Analysis Issues**

#### **Incomplete Threat Coverage**
- Missing threats in one or more STRIDE categories
- Not considering all attack vectors
- Ignoring business logic threats
- Overlooking insider threats

#### **Poor Mitigation Strategies**
- Generic mitigation without specifics
- No implementation guidance
- Missing validation of effectiveness
- No cost-benefit analysis

#### **Risk Prioritization Problems**
- Subjective risk assessment
- No clear criteria for prioritization
- Ignoring business context
- Not considering threat likelihood

### **Documentation Issues**

#### **Poor Documentation Quality**
- Unclear threat descriptions
- Missing diagrams or poor diagrams
- Inconsistent terminology
- No executive summary

#### **Outdated Threat Models**
- Not updated with system changes
- Missing new threats
- Outdated risk assessments
- No regular review process

## 📚 "Oral Exam" Study Questions

### **Threat Modeling Fundamentals**
1. What is the difference between a threat, vulnerability, and risk?
2. How does STRIDE methodology help identify threats?
3. What are the key components of a threat model?
4. How do you determine the scope of a threat model?

### **STRIDE Analysis**
1. Explain each STRIDE category with examples
2. How do you assess the likelihood and impact of threats?
3. What mitigation strategies work best for each STRIDE category?
4. How do you validate the effectiveness of mitigations?

### **Trust Boundaries**
1. What are trust boundaries and why are they important?
2. How do you identify trust boundaries in a system?
3. What security controls are needed at trust boundaries?
4. How do trust boundaries change in cloud environments?

### **Risk Assessment**
1. How do you prioritize security risks?
2. What factors influence risk assessment?
3. How do you communicate risks to stakeholders?
4. How do you balance security with usability?

### **Security SDLC**
1. How does threat modeling fit into the SDLC?
2. What security activities happen in each SDLC phase?
3. How do you integrate security into agile development?
4. What metrics indicate good security practices?

## 🔧 Troubleshooting Checklist

### **Threat Model Quality**
- [ ] All critical assets identified
- [ ] Trust boundaries clearly defined
- [ ] All STRIDE categories covered
- [ ] Risk levels properly assessed
- [ ] Mitigation strategies identified
- [ ] Documentation is complete and clear

### **STRIDE Analysis**
- [ ] Spoofing threats identified
- [ ] Tampering threats identified
- [ ] Repudiation threats identified
- [ ] Information disclosure threats identified
- [ ] Denial of service threats identified
- [ ] Elevation of privilege threats identified

### **Risk Assessment**
- [ ] Likelihood criteria defined
- [ ] Impact criteria defined
- [ ] Risk scoring method established
- [ ] Risk levels properly categorized
- [ ] Business context considered
- [ ] Stakeholder input included

### **Documentation**
- [ ] Executive summary included
- [ ] Diagrams are clear and accurate
- [ ] Terminology is consistent
- [ ] References are cited
- [ ] Format is professional
- [ ] Content is actionable

---

*Use these notes as a reference during your threat modeling journey!* 