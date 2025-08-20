# 🌐 What Happens When You Type a URL

## Overview
When you type `https://google.com` and press Enter, your browser goes through a complex sequence of network operations to fetch and display the webpage. Here's the complete technical breakdown:

## 1. DNS Resolution (Domain Name → IP Address)

### What Happens
- **Browser Cache Check**: First checks if `google.com` is cached locally
- **OS Cache**: Checks system DNS cache (`/etc/hosts` on Unix, `C:\Windows\System32\drivers\etc\hosts` on Windows)
- **Router Cache**: Checks home/office router's DNS cache
- **ISP DNS**: Queries ISP's recursive DNS server (e.g., 8.8.8.8, 1.1.1.1)
- **Root DNS**: If not cached, starts from root DNS servers (`.`)
- **TLD DNS**: Queries `.com` top-level domain servers
- **Authoritative DNS**: Finally queries Google's DNS servers

### Technical Details
```bash
# Example DNS lookup
dig google.com +trace

# Response shows the full resolution chain:
# . → .com → google.com → 142.250.190.78
```

### DNS Record Types
- **A Record**: IPv4 address (142.250.190.78)
- **AAAA Record**: IPv6 address (2607:f8b0:4004:c0c::65)
- **CNAME**: Canonical name (alias)
- **MX**: Mail exchange server
- **TXT**: Text records (often for verification)

## 2. TCP Connection (Transport Layer)

### Port Selection
- **Port 80**: HTTP (unencrypted)
- **Port 443**: HTTPS (encrypted)
- **Port 8080**: Alternative HTTP port

### TCP 3-Way Handshake
```
Client → Server: SYN (seq=x)
Server → Client: SYN-ACK (seq=y, ack=x+1)  
Client → Server: ACK (seq=x+1, ack=y+1)
```

### TCP vs UDP Comparison
| Feature | TCP | UDP |
|---------|-----|-----|
| **Reliability** | Guaranteed delivery | Best effort |
| **Ordering** | In-order delivery | No ordering |
| **Speed** | Slower (overhead) | Faster |
| **Use Cases** | Web pages, APIs, file transfer | Gaming, streaming, DNS |

### Connection States
```
CLOSED → LISTEN → SYN_RCVD → ESTABLISHED
    ↑                                    ↓
    ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

## 3. TLS/SSL Handshake (Security Layer)

### TLS 1.3 Handshake Flow
```
Client → Server: ClientHello (supported ciphers, random)
Server → Client: ServerHello (chosen cipher, random, certificate)
Client → Server: ClientKeyExchange (pre-master secret)
Both: Derive session keys from shared secret
```

### Certificate Validation
- **Certificate Authority (CA)**: Verifies server identity
- **Chain of Trust**: Root CA → Intermediate CA → Server Certificate
- **Public Key Infrastructure (PKI)**: Ensures authenticity

### Cipher Suites
```
TLS_AES_256_GCM_SHA384
├── Key Exchange: ECDHE (Elliptic Curve Diffie-Hellman Ephemeral)
├── Authentication: RSA/ECDSA
├── Encryption: AES-256-GCM
└── Hash: SHA384
```

## 4. HTTP Request/Response (Application Layer)

### HTTP/1.1 Request Example
```http
GET / HTTP/1.1
Host: google.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)
Accept: text/html,application/xhtml+xml,application/xml;q=0.9
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Upgrade-Insecure-Requests: 1
```

### HTTP/2 vs HTTP/1.1
| Feature | HTTP/1.1 | HTTP/2 |
|---------|----------|--------|
| **Multiplexing** | No (head-of-line blocking) | Yes (multiple streams) |
| **Header Compression** | No | HPACK |
| **Server Push** | No | Yes |
| **Binary Protocol** | No | Yes |

### Response Example
```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 12345
Cache-Control: public, max-age=3600
Set-Cookie: session=abc123; Path=/; HttpOnly
```

## 5. Page Rendering (Browser Engine)

### Critical Rendering Path
```
HTML → DOM Tree
CSS → CSSOM Tree
DOM + CSSOM → Render Tree
Layout → Paint → Composite
```

### JavaScript Execution
- **Parse**: Convert JS to AST
- **Compile**: Generate bytecode
- **Execute**: Run in V8 engine (Chrome) or SpiderMonkey (Firefox)

### Resource Loading
```html
<!-- Blocking resources -->
<script src="app.js"></script>

<!-- Non-blocking resources -->
<script src="analytics.js" async></script>
<link rel="stylesheet" href="styles.css">
<img src="logo.png" alt="Logo">
```

## 6. Performance Optimizations

### DNS Optimization
- **DNS Prefetching**: `<link rel="dns-prefetch" href="//cdn.example.com">`
- **DNS Preconnect**: `<link rel="preconnect" href="https://fonts.googleapis.com">`

### Connection Optimization
- **HTTP/2 Server Push**: Pre-emptively send critical resources
- **Connection Pooling**: Reuse TCP connections
- **Keep-Alive**: Maintain persistent connections

### Caching Strategies
- **Browser Cache**: Static assets (CSS, JS, images)
- **CDN Cache**: Distributed edge servers
- **Application Cache**: API responses, computed data

## 7. Security Considerations

### Common Attacks
- **DNS Spoofing**: Redirect to malicious servers
- **Man-in-the-Middle**: Intercept encrypted traffic
- **DDoS**: Overwhelm servers with traffic

### Defenses
- **DNSSEC**: Cryptographically signed DNS records
- **HSTS**: Force HTTPS connections
- **CSP**: Content Security Policy headers

## 8. Monitoring & Debugging

### Network Tab Analysis
```javascript
// Performance API
const navigation = performance.getEntriesByType('navigation')[0];
console.log(`DNS: ${navigation.domainLookupEnd - navigation.domainLookupStart}ms`);
console.log(`TCP: ${navigation.connectEnd - navigation.connectStart}ms`);
console.log(`TLS: ${navigation.requestStart - navigation.secureConnectionStart}ms`);
```

### Command Line Tools
```bash
# DNS resolution
nslookup google.com
dig google.com

# TCP connection
telnet google.com 80
nc -v google.com 443

# HTTP request
curl -v https://google.com
wget --debug https://google.com
```

## 9. Real-World Example: Loading `https://google.com`

### Timeline Breakdown
```
0ms    → DNS lookup starts
15ms   → DNS resolved (142.250.190.78)
16ms   → TCP connection starts
45ms   → TCP connected
46ms   → TLS handshake starts
120ms  → TLS established
121ms  → HTTP request sent
180ms  → First byte received
200ms  → HTML parsed, DOM built
250ms  → CSS loaded, styles applied
300ms  → JavaScript executed
350ms  → Page fully rendered
```

## 10. Advanced Topics

### HTTP/3 (QUIC)
- **UDP-based**: Faster connection establishment
- **Multiplexing**: No head-of-line blocking
- **0-RTT**: Resume previous connections instantly

### Edge Computing
- **CDN**: Distribute content globally
- **Edge Functions**: Run code closer to users
- **Geographic Routing**: Route to nearest server

### Microservices Impact
- **Service Discovery**: Dynamic IP resolution
- **Load Balancing**: Distribute requests across instances
- **Circuit Breakers**: Handle service failures gracefully

---

## ✅ Quick Reference

**Complete Flow**: `DNS → TCP → TLS → HTTP → Parse → Render`

**Key Ports**: 80 (HTTP), 443 (HTTPS), 53 (DNS)

**Performance Metrics**: DNS (15ms), TCP (30ms), TLS (75ms), HTTP (60ms)

**Security**: DNSSEC + HSTS + CSP + Certificate validation

**Optimization**: DNS prefetch, HTTP/2, CDN, caching, compression