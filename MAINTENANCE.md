# PIXA Maintenance Guide

## 📋 Overview

This guide covers daily operations, updates, troubleshooting, and maintenance tasks for the PIXA application deployed on AWS EC2.

**Server:** 54.90.149.64  
**SSH Access:** `ssh -i pixa-key.pem ubuntu@54.90.149.64`

---

## 🔄 Daily Operations

### Check Server Status

```bash
# Quick health check
pm2 list                          # Backend status
sudo systemctl status nginx       # Nginx status
sudo systemctl status postgresql  # Database status

# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top
```

### View Logs

```bash
# Backend logs (real-time)
pm2 logs pixa-backend

# Backend logs (last 50 lines)
pm2 logs pixa-backend --lines 50

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

---

## 🔧 Updating Application

### Update Backend Code

```bash
# 1. Connect to server
ssh -i pixa-key.pem ubuntu@54.90.149.64

# 2. Navigate to backend directory
cd ~/pixa3/backend

# 3. Pull latest code
git pull origin main

# 4. Install new dependencies (if any)
npm install --production

# 5. Restart backend
pm2 restart pixa-backend

# 6. Verify it's running
pm2 list
pm2 logs pixa-backend --lines 20
```

### Update Frontend Code

```bash
# 1. Navigate to frontend directory
cd ~/pixa3/frontend

# 2. Pull latest code
git pull origin main

# 3. Install new dependencies (if any)
npm install

# 4. Rebuild production files
npm run build

# 5. Restart Nginx
sudo systemctl restart nginx

# 6. Clear browser cache and test
# Visit: http://54.90.149.64
```

### Update Environment Variables

```bash
# 1. Edit backend .env file
cd ~/pixa3/backend
nano .env

# 2. Make your changes, then save (Ctrl+X, Y, Enter)

# 3. Restart backend to apply changes
pm2 restart pixa-backend

# 4. Verify changes
pm2 logs pixa-backend
```

---

## 🗄️ Database Management

### Backup Database

```bash
# Create backup with timestamp
pg_dump -U pixauser -h localhost pixa > ~/backups/pixa_backup_$(date +%Y%m%d_%H%M%S).sql

# Create backups directory if it doesn't exist
mkdir -p ~/backups

# Verify backup was created
ls -lh ~/backups/
```

### Restore Database

```bash
# 1. Stop backend to prevent connections
pm2 stop pixa-backend

# 2. Drop and recreate database
sudo -u postgres psql
```

```sql
DROP DATABASE pixa;
CREATE DATABASE pixa;
GRANT ALL PRIVILEGES ON DATABASE pixa TO pixauser;
ALTER DATABASE pixa OWNER TO pixauser;
\q
```

```bash
# 3. Restore from backup
psql -U pixauser -d pixa -h localhost < ~/backups/pixa_backup_YYYYMMDD_HHMMSS.sql

# 4. Start backend
pm2 start pixa-backend

# 5. Verify data
psql -U pixauser -d pixa -h localhost -c "SELECT COUNT(*) FROM images;"
```

### Database Queries

```bash
# Connect to database
psql -U pixauser -d pixa -h localhost
```

```sql
-- View all tables
\dt

-- Count records in each table
SELECT 'images' as table_name, COUNT(*) as count FROM images
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'game', COUNT(*) FROM game
UNION ALL
SELECT 'submission', COUNT(*) FROM submission;

-- View recent games
SELECT * FROM game ORDER BY id DESC LIMIT 10;

-- View recent submissions
SELECT * FROM submission ORDER BY id DESC LIMIT 10;

-- Exit
\q
```

### Clean Up Old Data

```bash
psql -U pixauser -d pixa -h localhost
```

```sql
-- Delete old games (older than 30 days)
DELETE FROM game WHERE created_at < NOW() - INTERVAL '30 days';

-- Delete orphaned submissions
DELETE FROM submission WHERE game_id NOT IN (SELECT id FROM game);

-- Vacuum database to reclaim space
VACUUM ANALYZE;

\q
```

---

## 🔄 Service Management

### Restart Services

```bash
# Restart backend
pm2 restart pixa-backend

# Restart Nginx
sudo systemctl restart nginx

# Restart PostgreSQL
sudo systemctl restart postgresql

# Restart all services
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart postgresql
```

### Stop Services

```bash
# Stop backend
pm2 stop pixa-backend

# Stop Nginx
sudo systemctl stop nginx

# Stop PostgreSQL
sudo systemctl stop postgresql
```

### Start Services

```bash
# Start backend
pm2 start pixa-backend

# Start Nginx
sudo systemctl start nginx

# Start PostgreSQL
sudo systemctl start postgresql
```

---

## 📊 Monitoring

### PM2 Monitoring

```bash
# View process list
pm2 list

# View detailed info
pm2 show pixa-backend

# Monitor in real-time
pm2 monit

# View logs
pm2 logs pixa-backend

# Clear logs
pm2 flush
```

### System Resources

```bash
# Disk usage
df -h

# Memory usage
free -h

# CPU usage
top

# Process list
ps aux | grep node
ps aux | grep nginx
ps aux | grep postgres

# Network connections
sudo ss -tlnp | grep 5000
sudo ss -tlnp | grep 80
```

### Application Metrics

```bash
# Check backend response time
time curl http://localhost:5000/health

# Check Nginx response time
time curl http://54.90.149.64/api/health

# Test database connection
time psql -U pixauser -d pixa -h localhost -c "SELECT 1;"
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: Backend not responding**
```bash
# Check if backend is running
pm2 list

# If stopped, start it
pm2 start pixa-backend

# If errored, check logs
pm2 logs pixa-backend --lines 100

# Common fixes:
# 1. Database connection issue - check PostgreSQL
# 2. Port already in use - kill process on port 5000
# 3. Missing dependencies - run npm install
```

**Problem: Backend keeps restarting**
```bash
# View logs to see error
pm2 logs pixa-backend

# Common causes:
# - Database connection failed
# - Missing environment variables
# - Syntax error in code
# - Port conflict

# Fix and restart
pm2 restart pixa-backend
```

### Frontend Issues

**Problem: Frontend not loading**
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -50 /var/log/nginx/error.log

# Common fixes:
# 1. Permission denied - fix file permissions
chmod 755 /home/ubuntu
chmod 755 /home/ubuntu/pixa3
chmod 755 /home/ubuntu/pixa3/frontend
chmod -R 755 /home/ubuntu/pixa3/frontend/build

# 2. Nginx config error - test config
sudo nginx -t

# 3. Restart Nginx
sudo systemctl restart nginx
```

**Problem: API calls failing**
```bash
# Test backend directly
curl http://localhost:5000/health

# Test through Nginx proxy
curl http://54.159.73.195/api/health

# Check Nginx proxy config
cat /etc/nginx/sites-available/pixa | grep -A 10 "location /api/"

# Restart Nginx
sudo systemctl restart nginx
```

### Database Issues

**Problem: Database connection failed**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# If not running, start it
sudo systemctl start postgresql

# Test connection
psql -U pixauser -d pixa -h localhost

# Check PostgreSQL logs
sudo tail -50 /var/log/postgresql/postgresql-14-main.log
```

**Problem: Database is slow**
```bash
# Connect to database
psql -U pixauser -d pixa -h localhost

# Analyze and vacuum
VACUUM ANALYZE;

# Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

\q
```

### Performance Issues

**Problem: Server is slow**
```bash
# Check CPU usage
top

# Check memory usage
free -h

# Check disk space
df -h

# Check running processes
ps aux --sort=-%cpu | head -10
ps aux --sort=-%mem | head -10

# If out of memory, restart services
pm2 restart pixa-backend
sudo systemctl restart nginx
```

---

## 🔒 Security

### Update System Packages

```bash
# Update package list
sudo apt update

# Upgrade packages
sudo apt upgrade -y

# Reboot if kernel was updated
sudo reboot
```

### Update Node.js Packages

```bash
# Check for outdated packages
cd ~/pixa3/backend
npm outdated

# Update packages
npm update

# Restart backend
pm2 restart pixa-backend
```

### Rotate API Keys

```bash
# 1. Get new API keys from providers
# - OpenAI: https://platform.openai.com/api-keys
# - Runware: https://runware.ai/dashboard

# 2. Update .env file
cd ~/pixa3/backend
nano .env

# 3. Update keys
OPENAI_API_KEY=new_key_here
RUNWARE_API_KEY=new_key_here

# 4. Restart backend
pm2 restart pixa-backend
```

### Check Security

```bash
# Check firewall status
sudo ufw status

# Check open ports
sudo ss -tlnp

# Check failed login attempts
sudo grep "Failed password" /var/log/auth.log | tail -20

# Check Nginx access logs for suspicious activity
sudo tail -100 /var/log/nginx/access.log | grep -E "404|500|403"
```

---

## 📦 Backup Strategy

### Automated Daily Backups

Create a backup script:

```bash
# Create backup script
nano ~/backup_pixa.sh
```

Add this content:
```bash
#!/bin/bash

# Set backup directory
BACKUP_DIR=~/backups
mkdir -p $BACKUP_DIR

# Create timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup database
pg_dump -U pixauser -h localhost pixa > $BACKUP_DIR/pixa_db_$TIMESTAMP.sql

# Backup code
tar -czf $BACKUP_DIR/pixa_code_$TIMESTAMP.tar.gz ~/pixa3

# Keep only last 7 days of backups
find $BACKUP_DIR -name "pixa_*" -mtime +7 -delete

echo "Backup completed: $TIMESTAMP"
```

Make it executable:
```bash
chmod +x ~/backup_pixa.sh
```

Add to crontab (daily at 2 AM):
```bash
crontab -e

# Add this line:
0 2 * * * /home/ubuntu/backup_pixa.sh >> /home/ubuntu/backup.log 2>&1
```

### Manual Backup

```bash
# Run backup script manually
~/backup_pixa.sh

# Or backup manually
mkdir -p ~/backups
pg_dump -U pixauser -h localhost pixa > ~/backups/manual_backup_$(date +%Y%m%d).sql
tar -czf ~/backups/code_backup_$(date +%Y%m%d).tar.gz ~/pixa3
```

---

## 🚀 Common Tasks

### Add New User to Database

```bash
psql -U pixauser -d pixa -h localhost
```

```sql
INSERT INTO users (username, email, created_at) 
VALUES ('newuser', 'user@example.com', NOW());

\q
```

### Clear All Game Data

```bash
psql -U pixauser -d pixa -h localhost
```

```sql
-- Be careful! This deletes all game data
TRUNCATE TABLE game CASCADE;
TRUNCATE TABLE submission CASCADE;
TRUNCATE TABLE game_users CASCADE;

\q
```

### View Active Games

```bash
psql -U pixauser -d pixa -h localhost -c "SELECT * FROM game WHERE started = true;"
```

### Check API Usage

```bash
# Count API calls in last hour
sudo grep "$(date +%d/%b/%Y:%H)" /var/log/nginx/access.log | wc -l

# Most accessed endpoints
sudo awk '{print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10
```

---

## 📈 Performance Optimization

### Enable Nginx Caching

```bash
sudo nano /etc/nginx/sites-available/pixa
```

Add caching for static files:
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    root /home/ubuntu/pixa3/frontend/build;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

Restart Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Enable Gzip Compression

```bash
sudo nano /etc/nginx/nginx.conf
```

Uncomment or add:
```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

---

## 🆘 Emergency Procedures

### Server is Down

```bash
# 1. Check if you can SSH
ssh -i pixa-key.pem ubuntu@54.90.149.64

# 2. If SSH works, check services
pm2 list
sudo systemctl status nginx
sudo systemctl status postgresql

# 3. Restart all services
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart postgresql

# 4. If SSH doesn't work, reboot from AWS Console
# AWS Console → EC2 → Instances → Select instance → Instance state → Reboot
```

### Database Corruption

```bash
# 1. Stop backend
pm2 stop pixa-backend

# 2. Backup current database
pg_dump -U pixauser -h localhost pixa > ~/emergency_backup.sql

# 3. Try to repair
sudo -u postgres psql pixa
```

```sql
REINDEX DATABASE pixa;
VACUUM FULL;
\q
```

```bash
# 4. If repair fails, restore from backup
# See "Restore Database" section above

# 5. Start backend
pm2 start pixa-backend
```

### Out of Disk Space

```bash
# Check disk usage
df -h

# Find large files
sudo du -h /home/ubuntu | sort -rh | head -20

# Clean up:
# 1. Remove old logs
pm2 flush
sudo rm /var/log/nginx/*.log.*.gz
sudo journalctl --vacuum-time=7d

# 2. Remove old backups
rm ~/backups/pixa_*_old.sql

# 3. Clean npm cache
npm cache clean --force

# 4. Remove old packages
sudo apt autoremove
sudo apt clean
```

### High CPU/Memory Usage

```bash
# Check what's using resources
top

# If Node.js is using too much:
pm2 restart pixa-backend

# If PostgreSQL is using too much:
sudo systemctl restart postgresql

# If Nginx is using too much:
sudo systemctl restart nginx

# Check for memory leaks in logs
pm2 logs pixa-backend | grep -i "memory\|heap"
```

---

## 📞 Support Contacts

**AWS Support:** https://console.aws.amazon.com/support/  
**OpenAI Support:** https://help.openai.com/  
**Runware Support:** https://runware.ai/support  

---

## 📝 Maintenance Checklist

### Daily
- [ ] Check PM2 status
- [ ] Review error logs
- [ ] Monitor disk space

### Weekly
- [ ] Review application logs
- [ ] Check database size
- [ ] Verify backups are working
- [ ] Review security logs

### Monthly
- [ ] Update system packages
- [ ] Update Node.js packages
- [ ] Review and clean old data
- [ ] Test backup restoration
- [ ] Review AWS costs

### Quarterly
- [ ] Rotate API keys
- [ ] Review security settings
- [ ] Optimize database
- [ ] Review and update documentation

---

**Last Updated:** January 31, 2026  
**Maintained By:** Omar  
**Version:** 1.0.0
