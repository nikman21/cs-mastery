# Week 01 Resources: Secure SDLC & Threat Modeling

## 📚 Required Readings

### **Threat Modeling Fundamentals**
- [OWASP Threat Modeling](https://owasp.org/www-project-threat-modeling/) - OWASP Threat Modeling Project
- [Microsoft Threat Modeling Tool](https://docs.microsoft.com/en-us/azure/security/develop/threat-modeling-tool) - Official documentation
- [Threat Modeling: Designing for Security](https://www.oreilly.com/library/view/threat-modeling/9781118809990/) - Adam Shostack
- [The Security Development Lifecycle](https://www.microsoft.com/en-us/securityengineering/sdl) - Microsoft SDL

### **STRIDE Methodology**
- [STRIDE Threat Model](https://docs.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats) - Microsoft documentation
- [STRIDE: A Threat Model for Web Applications](https://www.owasp.org/index.php/Application_Threat_Modeling) - OWASP guide
- [Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org/) - Community-driven principles
- [PASTA Threat Modeling](https://versprite.com/tag/pasta-threat-modeling/) - Process for Attack Simulation and Threat Analysis

### **Security Standards**
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) - Application Security Verification Standard
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) - Risk management framework
- [ISO 27001](https://www.iso.org/isoiec-27001-information-security.html) - Information security management
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/) - Most dangerous software weaknesses

## 🎥 Video Tutorials

### **Threat Modeling Basics**
- [Introduction to Threat Modeling](https://www.youtube.com/watch?v=GjKQ6V_ViQE) - OWASP
- [STRIDE Threat Modeling](https://www.youtube.com/watch?v=8aJj7f5qJfI) - Microsoft Security
- [Threat Modeling for Developers](https://www.youtube.com/watch?v=4eDxJOwKkqY) - InfoSec Institute

### **Security SDLC**
- [Secure Development Lifecycle](https://www.youtube.com/watch?v=8aJj7f5qJfI) - Microsoft
- [DevSecOps and Threat Modeling](https://www.youtube.com/watch?v=GjKQ6V_ViQE) - OWASP
- [Security by Design](https://www.youtube.com/watch?v=4eDxJOwKkqY) - InfoSec Institute

### **Tools and Techniques**
- [Microsoft Threat Modeling Tool](https://www.youtube.com/watch?v=8aJj7f5qJfI) - Microsoft
- [OWASP Threat Dragon](https://www.youtube.com/watch?v=GjKQ6V_ViQE) - OWASP
- [Threat Modeling with Draw.io](https://www.youtube.com/watch?v=4eDxJOwKkqY) - Draw.io

## 📖 Books & Courses

### **Free Resources**
- [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) - OWASP
- [Microsoft Security Development Lifecycle](https://www.microsoft.com/en-us/securityengineering/sdl) - Free documentation
- [Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org/) - Community resource
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) - Government standard

### **Paid Resources**
- [Threat Modeling: Designing for Security](https://www.oreilly.com/library/view/threat-modeling/9781118809990/) - Adam Shostack ($40-50)
- [Security Engineering](https://www.cl.cam.ac.uk/~rja14/book.html) - Ross Anderson (Free online)
- [Building Secure and Reliable Systems](https://sre.google/sre-book/security/) - Google SRE (Free)

## 🔧 Tools & Software

### **Threat Modeling Tools**
- [Microsoft Threat Modeling Tool](https://docs.microsoft.com/en-us/azure/security/develop/threat-modeling-tool) - Free, Windows
- [OWASP Threat Dragon](https://owasp.org/www-project-threat-dragon/) - Free, web-based
- [IriusRisk](https://iriusrisk.com/) - Commercial, comprehensive
- [ThreatModeler](https://threatmodeler.com/) - Commercial, enterprise

### **Diagramming Tools**
- [Draw.io](https://draw.io/) - Free, web-based
- [Lucidchart](https://www.lucidchart.com/) - Freemium, web-based
- [Visio](https://www.microsoft.com/en-us/microsoft-365/visio/flowchart-software) - Commercial, Microsoft
- [PlantUML](https://plantuml.com/) - Free, text-based

### **Security Analysis Tools**
- [OWASP ZAP](https://owasp.org/www-project-zap/) - Free, web application security
- [Burp Suite](https://portswigger.net/burp) - Commercial, web security testing
- [Nmap](https://nmap.org/) - Free, network discovery
- [Wireshark](https://www.wireshark.org/) - Free, network analysis

## 🌐 Online Communities

### **Forums & Reddit**
- [r/cybersecurity](https://www.reddit.com/r/cybersecurity/) - Cybersecurity community
- [r/threatmodeling](https://www.reddit.com/r/threatmodeling/) - Threat modeling discussions
- [OWASP Forums](https://owasp.org/www-community/) - OWASP community
- [Stack Overflow Security](https://stackoverflow.com/questions/tagged/security) - Q&A

### **Discord & Slack**
- [OWASP Discord](https://discord.gg/owasp) - OWASP community
- [Security Discord](https://discord.gg/security) - Security professionals
- [Microsoft Security Community](https://techcommunity.microsoft.com/t5/security-privacy-and-compliance/ct-p/Security) - Microsoft community

## 📝 Command Reference Cheatsheet

### **Threat Modeling Process**
```bash
# 1. Define scope
- Identify system boundaries
- List all components
- Define trust boundaries

# 2. Identify assets
- Data assets (user data, config, logs)
- System assets (servers, networks)
- Business assets (reputation, compliance)

# 3. Create data flow diagrams
- Map data entry points
- Document data transformations
- Identify data exit points

# 4. Apply STRIDE
- Spoofing: Authentication, session management
- Tampering: Input validation, authorization
- Repudiation: Logging, digital signatures
- Information Disclosure: Encryption, access controls
- Denial of Service: Rate limiting, resource monitoring
- Elevation of Privilege: RBAC, privilege separation
```

### **Risk Assessment Framework**
```bash
# Risk scoring matrix
Likelihood: Low (1) | Medium (2) | High (3)
Impact: Low (1) | Medium (2) | High (3)

Risk Score = Likelihood × Impact

# Risk levels
1-2: Low Risk (Accept)
3-4: Medium Risk (Mitigate)
6-9: High Risk (Mitigate or Transfer)

# Mitigation strategies
- Accept: Low risk, no action needed
- Mitigate: Implement security controls
- Transfer: Use insurance or third-party
- Avoid: Don't implement the feature
```

### **Documentation Templates**
```markdown
# Threat Model Report Template

## Executive Summary
Brief overview of threats and risks

## System Overview
- Architecture description
- Components and boundaries
- Trust relationships

## Asset Inventory
- Data assets
- System assets
- Business assets

## Threat Analysis
- STRIDE analysis results
- Risk assessment
- Mitigation strategies

## Security Requirements
- Authentication requirements
- Authorization requirements
- Data protection requirements
- Monitoring requirements
```

## 🚀 Advanced Resources

### **Threat Modeling Methodologies**
- [PASTA](https://versprite.com/tag/pasta-threat-modeling/) - Process for Attack Simulation
- [TRIKE](https://www.octotrike.org/) - Risk-based threat modeling
- [VAST](https://www.threatmodeler.com/vast-threat-modeling/) - Visual, Agile, and Simple Threat modeling
- [Attack Trees](https://www.schneier.com/academic/archives/1999/12/attack_trees.html) - Bruce Schneier

### **Security Architecture**
- [Zero Trust Architecture](https://www.nist.gov/publications/zero-trust-architecture) - NIST SP 800-207
- [Defense in Depth](https://www.sans.org/reading-room/whitepapers/analyst/defense-depth-33912) - SANS whitepaper
- [Security by Design](https://www.ncsc.gov.uk/collection/cyber-security-design-principles) - NCSC principles
- [Microservices Security](https://www.owasp.org/index.php/Microservices_Security_Cheat_Sheet) - OWASP guide

### **Industry Standards**
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Web application security risks
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/) - Software weaknesses
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) - Risk management
- [ISO 27001](https://www.iso.org/isoiec-27001-information-security.html) - Information security

### **Cloud Security**
- [Cloud Security Alliance](https://cloudsecurityalliance.org/) - Cloud security guidance
- [AWS Security Best Practices](https://aws.amazon.com/security/security-learning/) - AWS security
- [Azure Security Documentation](https://docs.microsoft.com/en-us/azure/security/) - Microsoft Azure
- [Google Cloud Security](https://cloud.google.com/security) - Google Cloud Platform

---

*Bookmark these resources for your threat modeling journey!* 