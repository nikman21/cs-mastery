# Threat Model Template

## Executive Summary
Brief overview of the system and key security risks.

## System Overview
- **System Name**: [Application Name]
- **Version**: [Version Number]
- **Scope**: [What's included/excluded]
- **Architecture**: [High-level architecture description]

## Asset Inventory

### Data Assets
- User profiles (PII, HIGH sensitivity)
- Authentication tokens (HIGH sensitivity)
- Application logs (MEDIUM sensitivity)
- Configuration files (MEDIUM sensitivity)

### System Assets
- Web servers (HIGH criticality)
- Database servers (HIGH criticality)
- Load balancers (MEDIUM criticality)
- CDN (LOW criticality)

### Business Assets
- User trust and reputation
- Compliance requirements
- Intellectual property
- Brand value

## Trust Boundaries

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Internet      │    │   Web Server    │    │   Database      │
│   (Untrusted)   │───▶│   (Trusted)     │───▶│   (Trusted)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## STRIDE Analysis

### Spoofing
- **Threat**: [Description]
- **Assets at Risk**: [List assets]
- **Mitigation**: [Security controls]
- **Risk Level**: [HIGH/MEDIUM/LOW]

### Tampering
- **Threat**: [Description]
- **Assets at Risk**: [List assets]
- **Mitigation**: [Security controls]
- **Risk Level**: [HIGH/MEDIUM/LOW]

### Repudiation
- **Threat**: [Description]
- **Assets at Risk**: [List assets]
- **Mitigation**: [Security controls]
- **Risk Level**: [HIGH/MEDIUM/LOW]

### Information Disclosure
- **Threat**: [Description]
- **Assets at Risk**: [List assets]
- **Mitigation**: [Security controls]
- **Risk Level**: [HIGH/MEDIUM/LOW]

### Denial of Service
- **Threat**: [Description]
- **Assets at Risk**: [List assets]
- **Mitigation**: [Security controls]
- **Risk Level**: [HIGH/MEDIUM/LOW]

### Elevation of Privilege
- **Threat**: [Description]
- **Assets at Risk**: [List assets]
- **Mitigation**: [Security controls]
- **Risk Level**: [HIGH/MEDIUM/LOW]

## Security Requirements

### Authentication
- [ ] Multi-factor authentication for admin accounts
- [ ] Password complexity requirements
- [ ] Session timeout policies
- [ ] Account lockout mechanisms

### Authorization
- [ ] Role-based access control (RBAC)
- [ ] Resource-level permissions
- [ ] Principle of least privilege
- [ ] Regular access reviews

### Data Protection
- [ ] Encryption at rest and in transit
- [ ] Data classification scheme
- [ ] Privacy compliance measures
- [ ] Data retention policies

### Monitoring
- [ ] Security event logging
- [ ] Real-time threat detection
- [ ] Incident response procedures
- [ ] Regular security assessments

## Risk Prioritization Matrix

| Threat | Likelihood | Impact | Risk Score | Priority |
|--------|------------|--------|------------|----------|
| [Threat 1] | [L/M/H] | [L/M/H] | [Score] | [1-5] |
| [Threat 2] | [L/M/H] | [L/M/H] | [Score] | [1-5] |

## Next Steps
- [ ] Implement high-priority mitigations
- [ ] Schedule regular threat model reviews
- [ ] Integrate with development process
- [ ] Train team on security practices 