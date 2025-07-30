# Week 1: Basic Pi Setup & Docker Environment

**Goal:** Get your Raspberry Pi 4 running as a headless server with Docker environment ready for self-hosted services.

## 🎯 Learning Objectives

- [ ] Master Linux CLI basics and SSH remote management
- [ ] Set up Raspberry Pi 4 as headless server
- [ ] Install and configure Docker environment
- [ ] Create your first self-hosted service
- [ ] Establish basic monitoring and logging

## 📚 Core Concepts

### Linux CLI Mastery
- File system navigation (`cd`, `ls`, `pwd`)
- File operations (`cp`, `mv`, `rm`, `mkdir`)
- Text editing (`nano`, `vim`)
- Process management (`ps`, `top`, `htop`)
- Package management (`apt`, `apt-get`)
- User and permission management (`sudo`, `chmod`, `chown`)

### SSH & Remote Management
- SSH key generation and authentication
- SSH config file management
- Remote file transfer with `scp` and `rsync`
- SSH tunneling and port forwarding
- Secure SSH configuration

### Docker Fundamentals
- Container vs VM concepts
- Docker images and containers
- Docker Compose for multi-service apps
- Volume management and data persistence
- Network configuration

## 🛠️ Hands-On Project: Pi Homelab Foundation

### Step 1: Pi Setup & OS Installation
```bash
# Download Raspberry Pi Imager
# Flash Ubuntu Server 22.04 LTS to SD card
# Enable SSH and set up WiFi during imaging

# First boot - connect via SSH
ssh ubuntu@your-pi-ip
```

### Step 2: System Hardening
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Change default password
passwd

# Create new user with sudo access
sudo adduser homelab
sudo usermod -aG sudo homelab

# Configure SSH for security
sudo nano /etc/ssh/sshd_config
# Disable root login, change port, enable key auth

# Generate SSH key on your main machine
ssh-keygen -t ed25519 -C "homelab@pi"
ssh-copy-id homelab@your-pi-ip
```

### Step 3: Docker Installation
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

### Step 4: Basic Monitoring Setup
```bash
# Create project directory
mkdir -p ~/homelab/{docker,scripts,logs}
cd ~/homelab

# Create basic monitoring script
cat > scripts/system-monitor.sh << 'EOF'
#!/bin/bash
echo "=== System Status $(date) ==="
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "Memory Usage: $(free | grep Mem | awk '{printf("%.2f%%", $3/$2 * 100.0)}')"
echo "Disk Usage: $(df -h / | awk 'NR==2 {print $5}')"
echo "Docker Containers: $(docker ps -q | wc -l) running"
EOF

chmod +x scripts/system-monitor.sh

# Set up log rotation
sudo nano /etc/logrotate.d/homelab
```

### Step 5: First Docker Service - Portainer
```yaml
# docker-compose.yml
version: '3.8'
services:
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./portainer-data:/data
    ports:
      - "9000:9000"
    networks:
      - homelab

networks:
  homelab:
    driver: bridge
```

```bash
# Start Portainer
docker compose up -d

# Access at http://your-pi-ip:9000
```

## 🔧 Tools & Technologies

### Essential Tools
- **Ubuntu Server 22.04 LTS** - Operating system
- **Docker & Docker Compose** - Containerization
- **Portainer** - Docker management UI
- **SSH** - Remote access
- **rsync** - File synchronization
- **cron** - Task scheduling

### Monitoring Tools
- **htop** - Process monitoring
- **iotop** - I/O monitoring
- **nethogs** - Network monitoring
- **logrotate** - Log management

## 📚 Resources

### Documentation
- [Ubuntu Server Guide](https://ubuntu.com/server/docs)
- [Docker Getting Started](https://docs.docker.com/get-started/)
- [SSH Configuration](https://www.ssh.com/academy/ssh/config)

### Tutorials
- [Raspberry Pi Headless Setup](https://www.raspberrypi.org/documentation/remote-access/ssh/)
- [Docker Compose Tutorial](https://docs.docker.com/compose/gettingstarted/)

### Commands Reference
```bash
# Essential Linux commands
ls -la                    # List files with details
cd /path/to/directory     # Change directory
pwd                       # Print working directory
sudo systemctl status     # Check service status
sudo journalctl -f        # Follow system logs

# Docker commands
docker ps                 # List running containers
docker images             # List images
docker logs container     # View container logs
docker exec -it container bash  # Enter container
```

## 🎯 Week 1 Deliverables

- [ ] Pi running Ubuntu Server with SSH access
- [ ] Docker and Docker Compose installed
- [ ] Portainer running and accessible
- [ ] Basic system monitoring script
- [ ] SSH key authentication configured
- [ ] Log rotation configured

## 🔄 Next Week Preview

**Week 2:** Nextcloud file server and Pi-hole DNS
- Set up personal cloud storage
- Configure local DNS with ad blocking
- Learn about reverse proxies and SSL certificates

---

*Complete these tasks to establish your digital homestead foundation!* 