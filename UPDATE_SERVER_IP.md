# 🔄 Server IP Update Guide

## New Elastic IP: 54.88.53.94

Your Elastic IP has been configured! This IP will **never change** even if you stop/start your EC2 instance.

---

## ✅ What I've Updated (Local Files)

1. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`)
   - Updated host to `54.88.53.94`

2. **Documentation**
   - `DEPLOYMENT.md` - All references updated
   - `MAINTENANCE.md` - All references updated

---

## 🔧 What You Need to Update (On Server)

### **Step 1: SSH into Server with New IP**

```bash
ssh -i pixa-key.pem ubuntu@54.88.53.94
```

### **Step 2: Update Backend Environment**

```bash
cd ~/pixa3/backend
nano .env
```

**Change this line:**
```env
FRONTEND_URL=http://54.88.53.94
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

### **Step 3: Update Nginx Configuration**

```bash
sudo nano /etc/nginx/sites-available/pixa
```

**Change this line:**
```nginx
server_name 54.88.53.94;
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

### **Step 4: Test and Restart Services**

```bash
# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Restart backend
pm2 restart pixa-backend

# Verify services are running
pm2 list
sudo systemctl status nginx
```

---

## 📝 Next Steps (On Your Local Machine)

### **Step 5: Commit and Push Changes**

```bash
# Add all updated files
git add .

# Commit changes
git commit -m "Update to Elastic IP 54.88.53.94"

# Push to GitHub
git push origin main
```

### **Step 6: Watch Automatic Deployment**

1. Go to: https://github.com/omaralhs/pixa3/actions
2. Watch the deployment run
3. It will deploy to the new IP automatically!

---

## 🧪 Testing

### **Test Your Application:**

1. **Frontend:** http://54.88.53.94
2. **Backend API:** http://54.88.53.94/api/health
3. **Socket.IO:** Should work automatically through Nginx proxy

### **Verify Everything Works:**

```bash
# Test backend health
curl http://54.88.53.94/api/health

# Should return: {"status":"OK","message":"Server is running"}
```

---

## 🎉 Benefits of Elastic IP

✅ **IP Never Changes** - Even if you stop/start EC2  
✅ **No More Updates** - This is the last time you update IPs  
✅ **Professional Setup** - Static IP for production  
✅ **FREE** - No cost when attached to running instance  

---

## 📋 Quick Command Summary

```bash
# On Server (SSH: ssh -i pixa-key.pem ubuntu@54.88.53.94)
cd ~/pixa3/backend
nano .env  # Change FRONTEND_URL=http://54.88.53.94
sudo nano /etc/nginx/sites-available/pixa  # Change server_name 54.88.53.94;
sudo nginx -t
sudo systemctl restart nginx
pm2 restart pixa-backend

# On Local Machine
git add .
git commit -m "Update to Elastic IP 54.88.53.94"
git push origin main
```

---

## ⚠️ Important Notes

1. **Elastic IP is FREE** when attached to a running EC2 instance
2. **Costs $0.005/hour** (~$3.60/month) if not attached
3. **Keep instance running** or release Elastic IP when not in use
4. **This IP is permanent** - no more IP changes needed!

---

## 🆘 Troubleshooting

### If deployment fails:

1. **Check GitHub Actions logs**
2. **Verify SSH key in GitHub Secrets** is correct
3. **Ensure AWS Security Group** allows SSH from GitHub Actions IPs

### If site doesn't load:

1. **Check services on server:**
   ```bash
   pm2 list
   sudo systemctl status nginx
   ```

2. **Check Nginx logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Restart all services:**
   ```bash
   pm2 restart pixa-backend
   sudo systemctl restart nginx
   ```

---

**Your new permanent URL:** http://54.88.53.94

Enjoy your stable, never-changing IP address! 🚀
