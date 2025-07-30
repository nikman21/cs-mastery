# Week 1 Resources: Pi Setup & Docker Environment

## 📚 Essential Documentation

### Raspberry Pi
- [Raspberry Pi Documentation](https://www.raspberrypi.org/documentation/) - Official Pi docs
- [Ubuntu Server for Raspberry Pi](https://ubuntu.com/download/raspberry-pi) - Ubuntu Pi images
- [Pi Imager](https://www.raspberrypi.org/software/) - Official imaging tool

### Linux & SSH
- [Ubuntu Server Guide](https://ubuntu.com/server/docs) - Ubuntu server documentation
- [SSH Academy](https://www.ssh.com/academy/) - Comprehensive SSH guide
- [Linux Journey](https://linuxjourney.com/) - Interactive Linux learning
- [OverTheWire Bandit](https://overthewire.org/wargames/bandit/) - SSH practice wargame

### Docker
- [Docker Documentation](https://docs.docker.com/) - Official Docker docs
- [Docker Compose](https://docs.docker.com/compose/) - Multi-container apps
- [Docker Tutorial](https://docker-curriculum.com/) - Beginner-friendly guide
- [Docker Playground](https://labs.play-with-docker.com/) - Online Docker practice

## 🎥 Video Tutorials

### Pi Setup
- [Raspberry Pi 4 Headless Setup](https://www.youtube.com/watch?v=ntaXWS8Lk34) - NetworkChuck
- [Ubuntu Server on Pi](https://www.youtube.com/watch?v=7TDzleF7WqY) - ExplainingComputers

### Docker Learning
- [Docker Tutorial for Beginners](https://www.youtube.com/watch?v=3c-iBn73DIk) - TechWorld with Nana
- [Docker Compose Tutorial](https://www.youtube.com/watch?v=HG6yIjZapSA) - NetworkChuck

### Linux CLI
- [Linux Command Line Tutorial](https://www.youtube.com/watch?v=YHFzr-akOas) - ProgrammingKnowledge
- [SSH Tutorial](https://www.youtube.com/watch?v=hQWRp-FdT1E) - NetworkChuck

## 📖 Books & Courses

### Free Resources
- [The Linux Command Line](http://linuxcommand.org/tlcl.php) - Free book by William Shotts
- [Docker Deep Dive](https://github.com/BretFisher/udemy-docker-mastery) - Bret Fisher's course materials
- [Linux Academy](https://linuxacademy.com/) - Free Linux courses (limited)

### Paid Courses
- [Docker Mastery](https://www.udemy.com/course/docker-mastery/) - Bret Fisher ($12-15)
- [Linux Administration Bootcamp](https://www.udemy.com/course/linux-administration-bootcamp/) - Jason Cannon ($12-15)

## 🔧 Tools & Software

### Essential Tools
- [Raspberry Pi Imager](https://www.raspberrypi.org/software/) - OS imaging
- [PuTTY](https://www.putty.org/) - SSH client (Windows)
- [Termius](https://termius.com/) - SSH client (Mac/Linux)
- [FileZilla](https://filezilla-project.org/) - SFTP client

### Monitoring Tools
- [htop](https://htop.dev/) - Process viewer
- [iotop](https://github.com/Tomas-M/iotop) - I/O monitoring
- [nethogs](https://github.com/raboof/nethogs) - Network monitoring
- [glances](https://nicolargo.github.io/glances/) - System monitoring

### Docker Tools
- [Portainer](https://www.portainer.io/) - Docker management UI
- [Docker Desktop](https://www.docker.com/products/docker-desktop) - Local development
- [Docker Hub](https://hub.docker.com/) - Container registry

## 🌐 Online Communities

### Forums & Reddit
- [r/homelab](https://www.reddit.com/r/homelab/) - Homelab community
- [r/raspberry_pi](https://www.reddit.com/r/raspberry_pi/) - Pi community
- [r/docker](https://www.reddit.com/r/docker/) - Docker community
- [Stack Overflow](https://stackoverflow.com/questions/tagged/raspberry-pi) - Q&A

### Discord & Slack
- [Homelab Discord](https://discord.gg/homelab) - Homelab community
- [Docker Community](https://www.docker.com/community/) - Official Docker community

## 📝 Cheat Sheets

### Linux Commands
```bash
# File operations
ls -la                    # List with details
cp -r source dest        # Copy recursively
mv old new               # Move/rename
rm -rf directory         # Remove recursively
chmod +x file            # Make executable
chown user:group file    # Change ownership

# System info
top                       # Process viewer
df -h                     # Disk usage
free -h                   # Memory usage
ps aux                    # All processes
systemctl status service  # Service status
```

### Docker Commands
```bash
# Container management
docker run -d --name app image    # Run detached
docker ps                         # List running
docker logs container             # View logs
docker exec -it container bash    # Enter container
docker stop container             # Stop container
docker rm container               # Remove container

# Image management
docker pull image                 # Download image
docker images                     # List images
docker rmi image                  # Remove image
docker build -t name .           # Build image
```

### SSH Commands
```bash
# Connection
ssh user@host                    # Basic connection
ssh -p 2222 user@host           # Custom port
ssh -i key.pem user@host        # Key file
ssh -L 8080:localhost:80 user@host  # Port forwarding

# Key management
ssh-keygen -t ed25519            # Generate key
ssh-copy-id user@host            # Copy key to server
ssh-add ~/.ssh/id_ed25519        # Add to agent
```

## 🚀 Advanced Resources

### Performance Tuning
- [Raspberry Pi Performance](https://www.raspberrypi.org/documentation/linux/kernel/performance.md)
- [Docker Performance](https://docs.docker.com/config/containers/runmetrics/)
- [Linux Performance](http://www.brendangregg.com/linuxperf.html)

### Security Hardening
- [SSH Hardening](https://www.ssh.com/academy/ssh/hardening)
- [Docker Security](https://docs.docker.com/engine/security/)
- [Linux Security](https://wiki.archlinux.org/title/Security)

### Automation
- [Ansible](https://www.ansible.com/) - Configuration management
- [Terraform](https://www.terraform.io/) - Infrastructure as code
- [GitLab CI/CD](https://docs.gitlab.com/ee/ci/) - Continuous integration

---

*Bookmark these resources for quick reference during your homelab journey!* 