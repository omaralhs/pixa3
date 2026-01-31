# PIXA AWS Deployment Documentation

## 📋 Overview

**Project:** PIXA - AI-Powered Image Generation Game  
**Deployment Date:** January 31, 2026  
**Server Location:** AWS EC2 (us-east-1)  
**Public IP:** 54.90.149.64  
**Deployment Type:** Single Ubuntu Instance (All-in-One)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│              AWS EC2 Ubuntu Instance                    │
│              (t3.micro - 1GB RAM, 2 vCPU)              │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Nginx (Port 80)                          │  │
│  │  - Serves Frontend (React build)                 │  │
│  │  - Proxies /api/ to Backend                      │  │
│  │  - Handles Socket.IO connections                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Node.js Backend (Port 5000)                    │  │
│  │  - Express API                                    │  │
│  │  - Socket.IO for real-time features              │  │
│  │  - PM2 Process Manager                           │  │
│  │  - OpenAI & Runware API Integration              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │   PostgreSQL Database (Port 5432)                │  │
│  │  - Local database (not exposed externally)       │  │
│  │  - Tables: users, game, images, submission       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↓
            Internet (Port 80 - HTTP)
                         ↓
              Users Access via Browser
           http://54.90.149.64
```

---

## 💰 Cost Breakdown

**Monthly Costs (Estimated):**
- EC2 t3.micro: ~$7.50/month (FREE for first 12 months)
- Storage (8GB): FREE tier
- Data Transfer: 1GB free, then $0.09/GB
- **Total: ~$7.50-10/month** (or FREE with free tier)

---

## 🚀 Initial Setup

### 1. EC2 Instance Configuration

**Instance Details:**
- **AMI:** Ubuntu Server 22.04 LTS
- **Instance Type:** t3.micro (2 vCPU, 1GB RAM)
- **Storage:** 8GB gp3 SSD
- **Region:** us-east-1 (N. Virginia)
- **Key Pair:** pixa-key.pem (saved locally)

**Security Group Rules:**
| Type | Protocol | Port | Source | Description |
|------|----------|------|--------|-------------|
| SSH | TCP | 22 | 0.0.0.0/0 | SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0 | Web traffic |
| HTTPS | TCP | 443 | 0.0.0.0/0 | SSL (future) |

**Note:** Port 5000 is NOT exposed externally (using Nginx proxy instead)

### 2. SSH Access

```bash
# Connect to server
ssh -i /path/to/pixa-key.pem ubuntu@54.90.149.64

# Set correct permissions on key file (if needed)
chmod 400 /path/to/pixa-key.pem
```

---

## 📦 Software Installation

### 1. System Update
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Node.js 22.x
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # v22.x.x
npm --version   # 10.x.x
```

### 3. PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl status postgresql  # Verify running
```

### 4. Nginx
```bash
sudo apt install -y nginx
sudo systemctl status nginx  # Verify running
```

### 5. PM2 (Process Manager)
```bash
sudo npm install -g pm2
pm2 --version
```

### 6. Git
```bash
sudo apt install -y git
```

---

## 🗄️ Database Setup

### 1. Create Database and User
```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE pixa;
CREATE USER pixauser WITH PASSWORD 'YourSecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE pixa TO pixauser;
ALTER DATABASE pixa OWNER TO pixauser;
\q
```

### 2. Import Database Backup
```bash
# Upload db_backup.sql to server first
psql -U pixauser -d pixa -h localhost < ~/pixa_backup.sql
```

### 3. Verify Data
```bash
psql -U pixauser -d pixa -h localhost
```

```sql
\dt  -- List tables
SELECT COUNT(*) FROM images;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM game;
\q
```

---

## 🔧 Backend Deployment

### 1. Clone Repository
```bash
cd ~
git clone https://github.com/omaralhs/pixa3.git
cd pixa3/backend
```

### 2. Install Dependencies
```bash
npm install --production
```

### 3. Configure Environment Variables
```bash
nano .env
```

**Required Variables:**
```env
# Database Configuration
DB_USER=pixauser
DB_HOST=localhost
DB_NAME=pixa
DB_PASSWORD=YourSecurePassword123!
DB_PORT=5432

# Server Configuration
PORT=5000
FRONTEND_URL=http://54.90.149.64

# API Keys
RUNWARE_API_KEY=your_runware_api_key
OPENAI_API_KEY=your_openai_api_key

# GPT Prompt
GptPrompt="You are a helpful assistant that ONLY replies with a single JSON object with exactly two keys: 'tip' and 'score'. Do not add anything else, no explanations, no extra text. the score must be out of 100 Do not add anything else before or after the JSON. here are the prompts you need to compare
            prompt 1: {a cat dancing on a table }
            prompt 2 : "
```

### 4. Start Backend with PM2
```bash
cd ~/pixa3/backend
pm2 start index.js --name pixa-backend
pm2 save
pm2 startup  # Copy and run the command it outputs
```

### 5. Verify Backend is Running
```bash
pm2 list  # Should show pixa-backend as 'online'
curl http://localhost:5000/health  # Should return JSON
```

---

## 🎨 Frontend Deployment

### 1. Configure Frontend
```bash
cd ~/pixa3/frontend

# Create environment file
echo "REACT_APP_API_URL=http://54.90.149.64" > .env
```

### 2. Install Dependencies and Build
```bash
npm install
npm run build
```

**Note:** Build creates optimized production files in `build/` directory

### 3. Fix File Permissions
```bash
# Allow Nginx to access frontend files
chmod 755 /home/ubuntu
chmod 755 /home/ubuntu/pixa3
chmod 755 /home/ubuntu/pixa3/frontend
chmod -R 755 /home/ubuntu/pixa3/frontend/build
```

---

## 🌐 Nginx Configuration

### 1. Create Nginx Site Configuration
```bash
sudo nano /etc/nginx/sites-available/pixa
```

**Configuration:**
```nginx
server {
    listen 80;
    server_name 54.90.149.64;

    # Frontend - Serve React build files
    location / {
        root /home/ubuntu/pixa3/frontend/build;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # Backend API - Proxy to Node.js
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO - WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 2. Enable Site
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/pixa /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 🔒 Firewall Configuration

```bash
# Enable firewall
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS (future)
sudo ufw enable        # Type 'y' to confirm

# Check status
sudo ufw status
```

---

## 🌍 Access URLs

**Frontend (Main Application):**
```
http://54.90.149.64
```

**Backend API (through Nginx proxy):**
```
http://54.90.149.64/api/health
http://54.90.149.64/api/getimages
```

**Socket.IO (through Nginx proxy):**
```
ws://54.90.149.64/socket.io/
```

**Direct Backend Access (localhost only):**
```
http://localhost:5000/health
```

---

## 📂 Directory Structure

```
/home/ubuntu/
├── pixa3/
│   ├── backend/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── socket.js
│   │   ├── controllers/
│   │   │   ├── ai.controller.js
│   │   │   ├── game.controller.js
│   │   │   ├── submission.controller.js
│   │   │   └── user.controller.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── ai.routes.js
│   │   │   ├── game.routes.js
│   │   │   ├── submission.routes.js
│   │   │   └── user.routes.js
│   │   ├── services/
│   │   │   ├── openai.service.js
│   │   │   └── runware.service.js
│   │   ├── .env
│   │   ├── index.js
│   │   └── package.json
│   └── frontend/
│       ├── build/          # Production build
│       ├── src/
│       ├── public/
│       └── package.json
└── pixa_backup.sql
```

---

## 🔍 Troubleshooting

### Backend Not Starting
```bash
# Check PM2 logs
pm2 logs pixa-backend

# Check if port 5000 is in use
sudo ss -tlnp | grep 5000

# Restart backend
pm2 restart pixa-backend
```

### Frontend Not Loading
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
psql -U pixauser -d pixa -h localhost

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Permission Denied Errors
```bash
# Fix frontend permissions
chmod 755 /home/ubuntu
chmod 755 /home/ubuntu/pixa3
chmod 755 /home/ubuntu/pixa3/frontend
chmod -R 755 /home/ubuntu/pixa3/frontend/build
```

---

## 📊 Monitoring

### Check All Services
```bash
# PM2 processes
pm2 list

# Nginx status
sudo systemctl status nginx

# PostgreSQL status
sudo systemctl status postgresql

# Disk space
df -h

# Memory usage
free -h
```

### View Logs
```bash
# Backend logs
pm2 logs pixa-backend

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

---

## 🎯 Next Steps

### Recommended Improvements:

1. **Add SSL Certificate (HTTPS)**
   - Use Let's Encrypt (free)
   - Improves security and SEO

2. **Set Up Domain Name**
   - Register domain
   - Point to EC2 IP
   - Update Nginx config

3. **Implement Backups**
   - Automated database backups
   - Code backups to S3
   - Snapshot EC2 instance

4. **Add Monitoring**
   - CloudWatch for AWS metrics
   - PM2 monitoring dashboard
   - Error tracking (Sentry)

5. **Optimize Performance**
   - Enable Nginx caching
   - Compress static assets
   - CDN for images

6. **Improve Security**
   - Restrict SSH to specific IP
   - Regular security updates
   - Rotate API keys
   - Add rate limiting

---

## 📝 Notes

- Backend runs on port 5000 (localhost only)
- Frontend served through Nginx on port 80
- Database accessible only from localhost
- PM2 ensures backend auto-restarts on crash
- All services start automatically on server reboot

---

## 🆘 Support

For issues or questions:
1. Check logs first (PM2, Nginx, PostgreSQL)
2. Review this documentation
3. Check MAINTENANCE.md for common tasks
4. Verify all services are running

---

**Last Updated:** January 31, 2026  
**Deployed By:** Omar  
**Version:** 1.0.0
