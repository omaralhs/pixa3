# 🔍 Server Diagnostics Guide

## Quick Server Health Check

Run these commands to diagnose the server issue:

### **1. SSH into Server**

```bash
ssh -i pixa-key.pem ubuntu@54.88.53.94
```

### **2. Check Backend Status**

```bash
# Check if backend is running
pm2 list

# Expected output: pixa-backend should show "online"
# If it shows "stopped" or "errored", there's a problem
```

### **3. Check Backend Logs**

```bash
# View recent logs
pm2 logs pixa-backend --lines 50

# Look for errors like:
# - Database connection failed
# - Port already in use
# - Missing environment variables
```

### **4. Test Backend Directly**

```bash
# Test if backend responds on localhost
curl http://localhost:5000/health

# Expected: {"status":"OK","message":"Server is running"}
# If this fails, backend is not running properly
```

### **5. Test Through Nginx**

```bash
# Test if Nginx proxy works
This site can’t be reached
"
# Expected: {"status":"OK","message":"Server is running"}
# If this fails, Nginx configuration issue
```

### **6. Check Database Connection**

```bash
# Test database
psql -U pixauser -d pixa -h localhost -c "SELECT COUNT(*) FROM images;"

# Should return a number
# If it fails, database issue
```

### **7. Check Nginx Status**

```bash
# Check Nginx
sudo systemctl status nginx

# Should show "active (running)"
```

### **8. Check Nginx Logs**

```bash
# Check for errors
sudo tail -50 /var/log/nginx/error.log

# Look for permission denied, connection refused, etc.
```

---

## Common Issues & Fixes

### **Issue 1: Backend Not Running**

```bash
# Restart backend
pm2 restart pixa-backend

# If it keeps crashing, check logs
pm2 logs pixa-backend
```

### **Issue 2: Database Connection Failed**

```bash
# Check PostgreSQL
sudo systemctl status postgresql

# If not running
sudo systemctl start postgresql

# Test connection
psql -U pixauser -d pixa -h localhost
```

### **Issue 3: Port 5000 Already in Use**

```bash
# Find what's using port 5000
sudo ss -tlnp | grep 5000

# Kill the process if needed
sudo kill -9 <PID>

# Restart backend
pm2 restart pixa-backend
```

### **Issue 4: Nginx Not Proxying**

```bash
# Test Nginx config
sudo nginx -t

# If errors, check config
sudo nano /etc/nginx/sites-available/pixa

# Restart Nginx
sudo systemctl restart nginx
```

### **Issue 5: Environment Variables Missing**

```bash
# Check .env file
cd ~/pixa3/backend
cat .env

# Make sure these are set:
# - DB_USER
# - DB_PASSWORD
# - DB_NAME
# - FRONTEND_URL
# - OPENAI_API_KEY
# - RUNWARE_API_KEY
```

---

## Full Restart Procedure

If nothing works, restart everything:

```bash
# 1. Restart backend
pm2 restart pixa-backend

# 2. Restart Nginx
sudo systemctl restart nginx

# 3. Restart PostgreSQL
sudo systemctl restart postgresql

# 4. Check all services
pm2 list
sudo systemctl status nginx
sudo systemctl status postgresql

# 5. Test endpoints
curl http://localhost:5000/health
curl http://54.88.53.94/api/health
```

---

## Test from Your Browser

Open browser DevTools (F12) → Network tab, then:

1. Visit: http://54.88.53.94/api/health
2. Check if it returns JSON: `{"status":"OK"}`
3. If timeout, backend is not responding
4. If 502 Bad Gateway, backend is down
5. If 404, Nginx routing issue

---

## Report Back

After running these checks, tell me:

1. **PM2 status:** Is pixa-backend "online" or "errored"?
2. **Backend test:** Does `curl http://localhost:5000/health` work?
3. **Nginx test:** Does `curl http://54.88.53.94/api/health` work?
4. **Any errors in logs?** Share the error messages

This will help me identify the exact issue!
