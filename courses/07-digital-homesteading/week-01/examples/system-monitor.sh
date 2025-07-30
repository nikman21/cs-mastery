#!/bin/bash

# System Monitoring Script for Raspberry Pi Homelab
# Usage: ./system-monitor.sh [--json] [--log]

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
LOG_FILE="/home/homelab/homelab/logs/system-monitor.log"
JSON_OUTPUT=false
LOG_TO_FILE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --json)
            JSON_OUTPUT=true
            shift
            ;;
        --log)
            LOG_TO_FILE=true
            shift
            ;;
        *)
            echo "Usage: $0 [--json] [--log]"
            exit 1
            ;;
    esac
done

# Get system information
get_system_info() {
    # CPU temperature (Pi specific)
    if command -v vcgencmd &> /dev/null; then
        CPU_TEMP=$(vcgencmd measure_temp | cut -d'=' -f2 | cut -d"'" -f1)
    else
        CPU_TEMP="N/A"
    fi
    
    # CPU usage
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    
    # Memory usage
    MEMORY_TOTAL=$(free | grep Mem | awk '{print $2}')
    MEMORY_USED=$(free | grep Mem | awk '{print $3}')
    MEMORY_PERCENT=$(awk "BEGIN {printf \"%.1f\", ($MEMORY_USED/$MEMORY_TOTAL)*100}")
    
    # Disk usage
    DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | cut -d'%' -f1)
    
    # Load average
    LOAD_AVG=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | cut -d',' -f1)
    
    # Docker containers
    DOCKER_RUNNING=$(docker ps -q | wc -l)
    DOCKER_TOTAL=$(docker ps -aq | wc -l)
    
    # Network interfaces
    NETWORK_INTERFACES=$(ip -brief addr show | grep -E "(eth0|wlan0)" | awk '{print $1}')
    
    # Uptime
    UPTIME=$(uptime -p | sed 's/up //')
    
    # Current time
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
}

# Display information
display_info() {
    if [ "$JSON_OUTPUT" = true ]; then
        # JSON output
        cat << EOF
{
    "timestamp": "$TIMESTAMP",
    "system": {
        "uptime": "$UPTIME",
        "cpu": {
            "usage": "$CPU_USAGE%",
            "temperature": "${CPU_TEMP}°C"
        },
        "memory": {
            "usage": "$MEMORY_PERCENT%",
            "used": "$(numfmt --to=iec $MEMORY_USED)",
            "total": "$(numfmt --to=iec $MEMORY_TOTAL)"
        },
        "disk": {
            "usage": "$DISK_USAGE%"
        },
        "load_average": "$LOAD_AVG",
        "docker": {
            "running": $DOCKER_RUNNING,
            "total": $DOCKER_TOTAL
        }
    }
}
EOF
    else
        # Human readable output
        echo -e "${BLUE}=== System Status Report ===${NC}"
        echo -e "Timestamp: ${GREEN}$TIMESTAMP${NC}"
        echo -e "Uptime: ${GREEN}$UPTIME${NC}"
        echo ""
        
        echo -e "${BLUE}CPU:${NC}"
        echo -e "  Usage: ${YELLOW}$CPU_USAGE%${NC}"
        echo -e "  Temperature: ${YELLOW}${CPU_TEMP}°C${NC}"
        echo ""
        
        echo -e "${BLUE}Memory:${NC}"
        echo -e "  Usage: ${YELLOW}$MEMORY_PERCENT%${NC}"
        echo -e "  Used: ${YELLOW}$(numfmt --to=iec $MEMORY_USED)${NC}"
        echo -e "  Total: ${YELLOW}$(numfmt --to=iec $MEMORY_TOTAL)${NC}"
        echo ""
        
        echo -e "${BLUE}Disk:${NC}"
        echo -e "  Usage: ${YELLOW}$DISK_USAGE%${NC}"
        echo ""
        
        echo -e "${BLUE}System Load:${NC}"
        echo -e "  Load Average: ${YELLOW}$LOAD_AVG${NC}"
        echo ""
        
        echo -e "${BLUE}Docker:${NC}"
        echo -e "  Running: ${GREEN}$DOCKER_RUNNING${NC}"
        echo -e "  Total: ${YELLOW}$DOCKER_TOTAL${NC}"
        echo ""
        
        # Warning thresholds
        if (( $(echo "$CPU_USAGE > 80" | bc -l) )); then
            echo -e "${RED}⚠️  High CPU usage detected!${NC}"
        fi
        
        if (( $(echo "$MEMORY_PERCENT > 80" | bc -l) )); then
            echo -e "${RED}⚠️  High memory usage detected!${NC}"
        fi
        
        if (( $(echo "$DISK_USAGE > 80" | bc -l) )); then
            echo -e "${RED}⚠️  High disk usage detected!${NC}"
        fi
        
        if (( $(echo "$CPU_TEMP > 70" | bc -l) )); then
            echo -e "${RED}⚠️  High CPU temperature detected!${NC}"
        fi
    fi
}

# Log to file
log_to_file() {
    if [ "$LOG_TO_FILE" = true ]; then
        mkdir -p "$(dirname "$LOG_FILE")"
        if [ "$JSON_OUTPUT" = true ]; then
            get_system_info
            display_info >> "$LOG_FILE"
        else
            get_system_info
            display_info | tee -a "$LOG_FILE"
        fi
    else
        get_system_info
        display_info
    fi
}

# Main execution
main() {
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running${NC}"
        exit 1
    fi
    
    # Check if required commands exist
    if ! command -v bc &> /dev/null; then
        echo -e "${YELLOW}Warning: bc not found, installing...${NC}"
        sudo apt update && sudo apt install -y bc
    fi
    
    log_to_file
}

# Run main function
main "$@" 