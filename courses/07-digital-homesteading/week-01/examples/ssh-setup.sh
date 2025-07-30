#!/bin/bash

# SSH Setup Script for Raspberry Pi Homelab
# This script configures secure SSH access

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SSH_PORT=2222
SSH_CONFIG_FILE="/etc/ssh/sshd_config"
BACKUP_FILE="/etc/ssh/sshd_config.backup.$(date +%Y%m%d_%H%M%S)"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root"
        exit 1
    fi
}

# Backup current SSH configuration
backup_config() {
    print_status "Backing up current SSH configuration..."
    cp "$SSH_CONFIG_FILE" "$BACKUP_FILE"
    if [ $? -eq 0 ]; then
        print_success "Backup created: $BACKUP_FILE"
    else
        print_error "Failed to create backup"
        exit 1
    fi
}

# Generate SSH key pair
generate_ssh_key() {
    print_status "Generating SSH key pair..."
    
    # Check if key already exists
    if [ -f ~/.ssh/id_ed25519 ]; then
        print_warning "SSH key already exists. Skipping key generation."
        return 0
    fi
    
    # Create .ssh directory if it doesn't exist
    mkdir -p ~/.ssh
    chmod 700 ~/.ssh
    
    # Generate Ed25519 key (more secure than RSA)
    ssh-keygen -t ed25519 -C "homelab@$(hostname)" -f ~/.ssh/id_ed25519 -N ""
    
    if [ $? -eq 0 ]; then
        print_success "SSH key pair generated successfully"
        print_status "Public key: ~/.ssh/id_ed25519.pub"
    else
        print_error "Failed to generate SSH key pair"
        exit 1
    fi
}

# Configure SSH server
configure_ssh() {
    print_status "Configuring SSH server..."
    
    # Create temporary config file
    cat > /tmp/sshd_config << EOF
# SSH Server Configuration for Homelab
# Generated on $(date)

# Port configuration
Port $SSH_PORT

# Protocol configuration
Protocol 2

# Host key files
HostKey /etc/ssh/ssh_host_rsa_key
HostKey /etc/ssh/ssh_host_ecdsa_key
HostKey /etc/ssh/ssh_host_ed25519_key

# Authentication
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes

# Logging
SyslogFacility AUTH
LogLevel INFO

# Security settings
X11Forwarding no
AllowTcpForwarding yes
GatewayPorts no
PermitTunnel no
MaxAuthTries 3
MaxSessions 10
ClientAliveInterval 300
ClientAliveCountMax 2

# Allow specific users (modify as needed)
AllowUsers homelab

# Additional security
IgnoreRhosts yes
HostbasedAuthentication no
PermitUserEnvironment no
Compression delayed
TCPKeepAlive yes
UsePrivilegeSeparation yes
EOF

    # Replace current config
    cp /tmp/sshd_config "$SSH_CONFIG_FILE"
    chmod 600 "$SSH_CONFIG_FILE"
    
    print_success "SSH configuration updated"
}

# Configure firewall
configure_firewall() {
    print_status "Configuring firewall..."
    
    # Install ufw if not present
    if ! command -v ufw &> /dev/null; then
        print_status "Installing ufw..."
        apt update && apt install -y ufw
    fi
    
    # Reset ufw to default
    ufw --force reset
    
    # Set default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH on custom port
    ufw allow $SSH_PORT/tcp comment 'SSH'
    
    # Enable firewall
    ufw --force enable
    
    print_success "Firewall configured and enabled"
    print_status "SSH port $SSH_PORT is open"
}

# Install fail2ban
install_fail2ban() {
    print_status "Installing and configuring fail2ban..."
    
    # Install fail2ban
    apt update && apt install -y fail2ban
    
    # Create fail2ban configuration
    cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = $SSH_PORT
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
EOF

    # Restart fail2ban
    systemctl restart fail2ban
    systemctl enable fail2ban
    
    print_success "fail2ban installed and configured"
}

# Test SSH configuration
test_ssh_config() {
    print_status "Testing SSH configuration..."
    
    if sshd -t; then
        print_success "SSH configuration is valid"
    else
        print_error "SSH configuration has errors"
        exit 1
    fi
}

# Restart SSH service
restart_ssh() {
    print_status "Restarting SSH service..."
    
    systemctl restart ssh
    
    if systemctl is-active --quiet ssh; then
        print_success "SSH service restarted successfully"
    else
        print_error "Failed to restart SSH service"
        exit 1
    fi
}

# Display connection information
display_info() {
    print_status "SSH Setup Complete!"
    echo ""
    echo -e "${GREEN}Connection Information:${NC}"
    echo -e "Host: $(hostname -I | awk '{print $1}')"
    echo -e "Port: $SSH_PORT"
    echo -e "User: homelab"
    echo -e "Key: ~/.ssh/id_ed25519"
    echo ""
    echo -e "${YELLOW}To connect from another machine:${NC}"
    echo -e "ssh -p $SSH_PORT -i ~/.ssh/id_ed25519 homelab@$(hostname -I | awk '{print $1}')"
    echo ""
    echo -e "${BLUE}Security Features Enabled:${NC}"
    echo -e "✓ Root login disabled"
    echo -e "✓ Password authentication disabled"
    echo -e "✓ Key-based authentication only"
    echo -e "✓ Custom SSH port ($SSH_PORT)"
    echo -e "✓ fail2ban protection"
    echo -e "✓ UFW firewall"
    echo ""
    echo -e "${YELLOW}Important:${NC}"
    echo -e "1. Copy your public key to other machines:"
    echo -e "   cat ~/.ssh/id_ed25519.pub"
    echo -e "2. Test connection before logging out!"
    echo -e "3. Backup your SSH keys securely"
}

# Main function
main() {
    echo -e "${BLUE}=== SSH Setup for Raspberry Pi Homelab ===${NC}"
    echo ""
    
    check_root
    backup_config
    generate_ssh_key
    configure_ssh
    configure_firewall
    install_fail2ban
    test_ssh_config
    restart_ssh
    display_info
}

# Run main function
main "$@" 