#!/bin/bash

echo "🔧 Setting up Disk Space Monitoring for EC2..."
echo ""

# Configuration
THRESHOLD=70
EMAIL="your-email@example.com"  # ⚠️ CHANGE THIS TO YOUR EMAIL

echo "📋 This script will:"
echo "1. Install mailutils for sending emails"
echo "2. Create a disk monitoring script"
echo "3. Set up a cron job to check disk space every hour"
echo "4. Send email alert when disk usage exceeds ${THRESHOLD}%"
echo ""
echo "⚠️  IMPORTANT: Update EMAIL variable in this script before running!"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Install mailutils
echo "📦 Installing mailutils..."
apt-get update
apt-get install -y mailutils

# Create monitoring script
echo "📝 Creating disk monitoring script..."
cat > /usr/local/bin/check_disk_space.sh << 'EOF'
#!/bin/bash

# Configuration
THRESHOLD=70
EMAIL="your-email@example.com"  # ⚠️ CHANGE THIS
HOSTNAME=$(hostname)

# Get disk usage percentage (excluding % sign)
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

# Check if usage exceeds threshold
if [ "$DISK_USAGE" -ge "$THRESHOLD" ]; then
    # Get detailed disk info
    DISK_INFO=$(df -h)
    
    # Send email alert
    echo "⚠️ DISK SPACE ALERT ⚠️

Server: $HOSTNAME
Disk Usage: ${DISK_USAGE}%
Threshold: ${THRESHOLD}%

Current Disk Status:
$DISK_INFO

Please take action to free up disk space.

Common commands to check disk usage:
- du -sh /* | sort -h
- docker system prune -a (if using Docker)
- journalctl --vacuum-time=7d (clean old logs)
- apt-get clean (clean package cache)
" | mail -s "⚠️ Disk Space Alert: ${DISK_USAGE}% on $HOSTNAME" "$EMAIL"

    echo "$(date): Disk usage at ${DISK_USAGE}% - Alert sent to $EMAIL" >> /var/log/disk_monitor.log
else
    echo "$(date): Disk usage at ${DISK_USAGE}% - OK" >> /var/log/disk_monitor.log
fi
EOF

# Make script executable
chmod +x /usr/local/bin/check_disk_space.sh

# Update EMAIL in the script
read -p "Enter your email address: " USER_EMAIL
sed -i "s/your-email@example.com/$USER_EMAIL/g" /usr/local/bin/check_disk_space.sh

# Create cron job (runs every hour)
echo "⏰ Setting up cron job..."
CRON_JOB="0 * * * * /usr/local/bin/check_disk_space.sh"

# Add to crontab if not already present
(crontab -l 2>/dev/null | grep -v check_disk_space.sh; echo "$CRON_JOB") | crontab -

# Create log file
touch /var/log/disk_monitor.log
chmod 644 /var/log/disk_monitor.log

echo ""
echo "✅ Disk monitoring setup complete!"
echo ""
echo "📊 Configuration:"
echo "   - Threshold: ${THRESHOLD}%"
echo "   - Email: $USER_EMAIL"
echo "   - Check frequency: Every hour"
echo "   - Log file: /var/log/disk_monitor.log"
echo ""
echo "🧪 Test the script:"
echo "   sudo /usr/local/bin/check_disk_space.sh"
echo ""
echo "📝 View logs:"
echo "   tail -f /var/log/disk_monitor.log"
echo ""
echo "⚙️  Edit configuration:"
echo "   sudo nano /usr/local/bin/check_disk_space.sh"
echo ""
echo "📧 Note: Make sure your EC2 instance can send emails."
echo "   You may need to configure AWS SES or use an SMTP relay."
echo ""
