# 🎮 PIXA Project - Complete Documentation

## 📋 Project Overview

**PIXA** is an AI-powered image generation game where students compete to create images matching a teacher's prompt using AI.

- **Frontend:** React.js
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **AI Services:** OpenAI + Runware
- **Hosting:** AWS EC2
- **Web Server:** Nginx

---

## 🌐 Production Environment

### **Server Details**

- **Elastic IP:** `54.88.53.94`
- **Instance Type:** EC2 (Ubuntu)
- **Region:** US East (N. Virginia)
- **Access:** SSH with `pixa-key.pem`

### **URLs**

- **Application:** http://54.88.53.94
- **API Endpoint:** http://54.88.53.94/api
- **Backend Port:** 5000 (internal)
- **Frontend:** Served by Nginx on port 80

### **SSH Access**

```bash
ssh -i pixa-key.pem ubuntu@54.88.53.94
```

---

## 📁 Project Structure

```
PIXA/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── Pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom hooks
│   │   ├── config.js        # API configuration
│   │   └── App.js
│   ├── public/
│   ├── .env                 # Frontend environment variables
│   └── package.json
│
├── backend/                 # Node.js backend
│   ├── controllers/         # Route controllers
│   ├── routes/             # API routes
│   ├── services/           # External services (OpenAI, Runware)
│   ├── config/             # Database & Socket.IO config
│   ├── middleware/         # Authentication middleware
│   ├── migrations/         # Database migrations
│   ├── .env                # Backend environment variables
│   ├── index.js            # Main server file
│   └── package.json
│
├── DEPLOYMENT.md           # Deployment guide
├── MAINTENANCE.md          # Maintenance procedures
├── CLOUDWATCH_SETUP.md     # Monitoring setup
├── CHECK_SERVER.md         # Server diagnostics
└── UPDATE_SERVER_IP.md     # IP update guide
```

---

## 🔧 Configuration Files

### **Frontend `.env`** (`~/pixa3/frontend/.env`)

```env
REACT_APP_API_URL=http://54.88.53.94/api
```

### **Backend `.env`** (`~/pixa3/backend/.env`)

```env
# Database Configuration
DB_USER=pixauser
DB_HOST=localhost
DB_NAME=pixa
DB_PASSWORD=9988
DB_PORT=5432

# Server Configuration
PORT=5000
FRONTEND_URL=http://54.88.53.94

# API Keys
RUNWARE_API_KEY=your_runware_api_key
OPENAI_API_KEY=your_openai_api_key

# GPT Prompt
GptPrompt="You are a helpful assistant..."
```

### **Frontend `config.js`** (`frontend/src/config.js`)

```javascript
// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://54.88.53.94/api';
export default API_URL;
```

---

## 🚀 Deployment Process

### **1. Local Development**

```bash
# Frontend
cd frontend
npm install
npm start  # Runs on localhost:3000

# Backend
cd backend
npm install
npm start  # Runs on localhost:5000
```

### **2. Deploy to Production**

```bash
# Commit changes
git add .
git commit -m "Your message"
git push origin main

# SSH into server
ssh -i pixa-key.pem ubuntu@54.88.53.94

# Pull latest code
cd ~/pixa3
git pull origin main

# Update backend
cd backend
npm install --production
pm2 restart pixa-backend

# Update frontend
cd ../frontend
npm install
npm run build

# Nginx automatically serves the new build
```

### **3. Verify Deployment**

```bash
# Check backend status
pm2 list
pm2 logs pixa-backend

# Test API
curl http://localhost:5000/health
curl http://54.88.53.94/api/health

# Check Nginx
sudo systemctl status nginx
```

---

## 📊 Monitoring & Alerts

### **CloudWatch Monitoring**

- **Namespace:** CWAgent
- **Metrics Collected:**
  - DiskSpaceUtilization (/)
  - MemoryUtilization

### **Alarms Configured**

| Alarm Name | Metric | Threshold | Action |
|------------|--------|-----------|--------|
| EC2-Disk-Space-Above-70 | DiskSpaceUtilization | > 70% | Email via SNS |

### **SNS Topic**

- **Name:** EC2-Disk-Space-Alerts
- **Protocol:** Email
- **Endpoint:** your-email@example.com

### **Check Monitoring**

```bash
# View CloudWatch agent status
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a status

# View agent logs
sudo tail -f /opt/aws/amazon-cloudwatch-agent/logs/amazon-cloudwatch-agent.log

# Check disk usage
df -h /
```

---

## 🗄️ Database

### **PostgreSQL Configuration**

- **Database:** pixa
- **User:** pixauser
- **Password:** 9988
- **Host:** localhost
- **Port:** 5432

### **Connect to Database**

```bash
# Connect as pixauser
psql -U pixauser -d pixa -h localhost

# Connect as postgres (superuser)
sudo -u postgres psql
```

### **Common Database Commands**

```sql
-- List tables
\dt

-- View images
SELECT * FROM images LIMIT 10;

-- View users
SELECT * FROM users LIMIT 10;

-- View submissions
SELECT * FROM submissions LIMIT 10;

-- Exit
\q
```

### **Backup Database**

```bash
# Create backup
pg_dump -U pixauser -d pixa > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U pixauser -d pixa < backup_20260202.sql
```

---

## 🔄 Process Management (PM2)

### **PM2 Commands**

```bash
# List all processes
pm2 list

# View logs
pm2 logs pixa-backend
pm2 logs pixa-backend --lines 100

# Restart
pm2 restart pixa-backend

# Stop
pm2 stop pixa-backend

# Start
pm2 start pixa-backend

# Monitor
pm2 monit

# Save configuration
pm2 save

# Startup script
pm2 startup
```

---

## 🌐 Nginx Configuration

### **Configuration File**

Location: `/etc/nginx/sites-available/pixa`

```nginx
server {
    listen 80;
    server_name 54.88.53.94;

    # Frontend
    location / {
        root /home/ubuntu/pixa3/frontend/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO
    location /socket.io/ {
        proxy_pass http://localhost:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### **Nginx Commands**

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🔐 Security

### **Firewall (UFW)**

```bash
# Check status
sudo ufw status

# Allow SSH
sudo ufw allow 22

# Allow HTTP
sudo ufw allow 80

# Allow HTTPS
sudo ufw allow 443

# Enable firewall
sudo ufw enable
```

### **Security Groups (AWS)**

- **SSH (22):** Your IP only
- **HTTP (80):** 0.0.0.0/0
- **HTTPS (443):** 0.0.0.0/0

---

## 🐛 Troubleshooting

### **Backend Issues**

```bash
# Check if backend is running
pm2 list

# View logs
pm2 logs pixa-backend --lines 50

# Test backend directly
curl http://localhost:5000/health

# Restart backend
pm2 restart pixa-backend

# Check database connection
psql -U pixauser -d pixa -h localhost
```

### **Frontend Issues**

```bash
# Rebuild frontend
cd ~/pixa3/frontend
npm run build

# Check Nginx is serving files
ls -la /home/ubuntu/pixa3/frontend/build

# Test in browser
curl http://54.88.53.94
```

### **Database Issues**

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
```

### **Nginx Issues**

```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -50 /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📚 Related Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[MAINTENANCE.md](./MAINTENANCE.md)** - Maintenance procedures
- **[CLOUDWATCH_SETUP.md](./CLOUDWATCH_SETUP.md)** - Monitoring setup
- **[CHECK_SERVER.md](./CHECK_SERVER.md)** - Server diagnostics
- **[UPDATE_SERVER_IP.md](./UPDATE_SERVER_IP.md)** - IP update guide

---

## 🎯 Quick Reference

### **Important URLs**

- Application: http://54.88.53.94
- API Health: http://54.88.53.94/api/health
- GitHub: https://github.com/omaralhs/pixa3

### **Important Paths**

- Project: `~/pixa3`
- Frontend Build: `~/pixa3/frontend/build`
- Backend: `~/pixa3/backend`
- Nginx Config: `/etc/nginx/sites-available/pixa`
- PM2 Logs: `~/.pm2/logs/`

### **Important Commands**

```bash
# Quick health check
pm2 list && sudo systemctl status nginx && df -h /

# Full restart
pm2 restart pixa-backend && sudo systemctl restart nginx

# View all logs
pm2 logs pixa-backend & sudo tail -f /var/log/nginx/error.log
```

---

## ✅ Deployment Checklist

- [x] EC2 instance configured
- [x] Elastic IP attached (54.88.53.94)
- [x] PostgreSQL installed and configured
- [x] Node.js and npm installed
- [x] PM2 installed for process management
- [x] Nginx installed and configured
- [x] Frontend built and deployed
- [x] Backend running with PM2
- [x] Database populated with initial data
- [x] CloudWatch monitoring configured
- [x] Email alerts set up
- [x] All hardcoded URLs updated
- [x] CORS configured correctly
- [x] Socket.IO working
- [x] Application accessible at http://54.88.53.94

---

## 🎉 Project Status

**Status:** ✅ **LIVE IN PRODUCTION**

**Last Updated:** February 2, 2026  
**Version:** 1.0.0  
**Deployed By:** Omar  
**Server IP:** 54.88.53.94  

---

**For support or questions, refer to the documentation files or check the GitHub repository.**
