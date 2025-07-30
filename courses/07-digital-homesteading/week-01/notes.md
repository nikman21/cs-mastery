# Week 1 Notes: Pi Setup & Docker Environment

## 📝 Key Concepts

### Linux File System Hierarchy
```
/                   # Root directory
├── /home          # User home directories
├── /etc           # Configuration files
├── /var           # Variable data (logs, databases)
├── /opt           # Optional applications
├── /usr           # User programs and data
├── /tmp           # Temporary files
└── /boot          # Boot loader and kernel
```

### Docker Architecture
- **Images**: Read-only templates for containers
- **Containers**: Running instances of images
- **Volumes**: Persistent data storage
- **Networks**: Communication between containers
- **Compose**: Multi-container application definitions

### SSH Security Best Practices
- Use key-based authentication only
- Disable root login
- Change default SSH port
- Use fail2ban for brute force protection
- Regular security updates

## 🔧 Common Commands

### System Management
```bash
# System information
uname -a                    # Kernel info
cat /etc/os-release        # OS version
free -h                    # Memory usage
df -h                      # Disk usage
uptime                     # System uptime

# Process management
ps aux                     # All processes
top                        # Interactive process viewer
htop                       # Enhanced top
kill -9 PID               # Force kill process
```

### Docker Operations
```bash
# Container management
docker run -d --name app image    # Run container
docker stop container             # Stop container
docker start container            # Start container
docker restart container          # Restart container
docker rm container               # Remove container

# Image management
docker pull image                 # Download image
docker build -t name .           # Build image
docker rmi image                 # Remove image
docker images                    # List images

# Volume management
docker volume create name        # Create volume
docker volume ls                 # List volumes
docker volume rm name            # Remove volume
```

### Network Configuration
```bash
# Network interfaces
ip addr show                     # Show IP addresses
ip route show                    # Show routing table
ping hostname                    # Test connectivity
nslookup domain                  # DNS lookup
netstat -tulpn                   # Show listening ports
```

## 🚨 Troubleshooting

### SSH Connection Issues
```bash
# Check SSH service status
sudo systemctl status ssh

# View SSH logs
sudo journalctl -u ssh

# Test SSH connection with verbose output
ssh -v user@host

# Common fixes
sudo systemctl restart ssh
sudo ufw allow ssh
```

### Docker Issues
```bash
# Check Docker service
sudo systemctl status docker

# View Docker logs
sudo journalctl -u docker

# Reset Docker daemon
sudo systemctl restart docker

# Clean up Docker system
docker system prune -a
```

### Pi Performance Issues
```bash
# Check CPU temperature
vcgencmd measure_temp

# Monitor system resources
htop

# Check for high I/O
iotop

# Monitor network usage
nethogs
```

## 📊 Monitoring Scripts

### System Health Check
```bash
#!/bin/bash
# Save as ~/homelab/scripts/health-check.sh

echo "=== System Health Check ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo "CPU Temp: $(vcgencmd measure_temp)"
echo "Memory: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "Disk: $(df -h / | awk 'NR==2 {print $3"/"$2" ("$5")"}')"
echo "Docker: $(docker ps -q | wc -l) containers running"
echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')"
```

### Docker Status Check
```bash
#!/bin/bash
# Save as ~/homelab/scripts/docker-status.sh

echo "=== Docker Status ==="
echo "Running containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\nContainer resource usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

## 🔐 Security Checklist

- [ ] SSH key authentication configured
- [ ] Root login disabled
- [ ] SSH port changed (optional)
- [ ] Firewall configured (ufw)
- [ ] Regular updates enabled
- [ ] Docker security options set
- [ ] Non-root user created
- [ ] Log monitoring configured

## 📚 Additional Resources

### Linux CLI Practice
- [Linux Journey](https://linuxjourney.com/) - Interactive Linux learning
- [OverTheWire Bandit](https://overthewire.org/wargames/bandit/) - SSH practice

### Docker Learning
- [Docker Playground](https://labs.play-with-docker.com/) - Online Docker practice
- [Docker Tutorial](https://docker-curriculum.com/) - Comprehensive guide

### Pi Optimization
- [Raspberry Pi Performance](https://www.raspberrypi.org/documentation/linux/kernel/performance.md)
- [Pi Cooling Guide](https://www.raspberrypi.org/blog/thermal-testing-raspberry-pi-4/)

---

*Keep these notes handy for reference during your homelab journey!* 