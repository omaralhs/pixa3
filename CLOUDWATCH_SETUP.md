# 📊 AWS CloudWatch Disk Space Monitoring Setup

## 🎯 Goal
Set up email alerts when EC2 disk space exceeds 70%

---

## 📋 Step-by-Step Guide

### **Step 1: Install CloudWatch Agent on EC2**

```bash
# SSH into your EC2 instance
ssh -i pixa-key.pem ubuntu@54.88.53.94

# Download CloudWatch Agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb

# Install the agent
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Verify installation
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a status
```

---

### **Step 2: Create IAM Role for CloudWatch**

#### **Option A: Using AWS Console**

1. Go to **IAM Console** → **Roles** → **Create Role**
2. Select **AWS Service** → **EC2**
3. Attach policy: **CloudWatchAgentServerPolicy**
4. Name: `EC2-CloudWatch-Role`
5. Click **Create Role**

#### **Option B: Using AWS CLI**

```bash
# Create trust policy file
cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create IAM role
aws iam create-role \
  --role-name EC2-CloudWatch-Role \
  --assume-role-policy-document file://trust-policy.json

# Attach CloudWatch policy
aws iam attach-role-policy \
  --role-name EC2-CloudWatch-Role \
  --policy-arn arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy

# Create instance profile
aws iam create-instance-profile \
  --instance-profile-name EC2-CloudWatch-Profile

# Add role to instance profile
aws iam add-role-to-instance-profile \
  --instance-profile-name EC2-CloudWatch-Profile \
  --role-name EC2-CloudWatch-Role
```

---

### **Step 3: Attach IAM Role to EC2 Instance**

#### **Using AWS Console:**

1. Go to **EC2 Console**
2. Select your instance
3. **Actions** → **Security** → **Modify IAM Role**
4. Select `EC2-CloudWatch-Role`
5. Click **Update IAM Role**

#### **Using AWS CLI:**

```bash
# Get your instance ID
INSTANCE_ID="i-xxxxxxxxxxxxxxxxx"  # Replace with your instance ID

# Attach instance profile
aws ec2 associate-iam-instance-profile \
  --instance-id $INSTANCE_ID \
  --iam-instance-profile Name=EC2-CloudWatch-Profile
```

---

### **Step 4: Configure CloudWatch Agent**

```bash
# SSH into EC2
ssh -i pixa-key.pem ubuntu@54.88.53.94

# Create CloudWatch config file
sudo nano /opt/aws/amazon-cloudwatch-agent/etc/config.json
```

**Paste this configuration:**

```json
{
  "metrics": {
    "namespace": "CWAgent",
    "metrics_collected": {
      "disk": {
        "measurement": [
          {
            "name": "used_percent",
            "rename": "DiskSpaceUtilization",
            "unit": "Percent"
          }
        ],
        "metrics_collection_interval": 60,
        "resources": [
          "/"
        ]
      },
      "mem": {
        "measurement": [
          {
            "name": "mem_used_percent",
            "rename": "MemoryUtilization",
            "unit": "Percent"
          }
        ],
        "metrics_collection_interval": 60
      }
    }
  }
}
```

**Save:** `Ctrl+X`, `Y`, `Enter`

---

### **Step 5: Start CloudWatch Agent**

```bash
# Start the agent with the config
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -s \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/config.json

# Verify it's running
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a status

# Check status
sudo systemctl status amazon-cloudwatch-agent
```

---

### **Step 6: Create SNS Topic for Email Notifications**

#### **Using AWS Console:**

1. Go to **SNS Console** → **Topics** → **Create Topic**
2. Type: **Standard**
3. Name: `EC2-Disk-Space-Alerts`
4. Click **Create Topic**
5. Click **Create Subscription**
   - Protocol: **Email**
   - Endpoint: **your-email@example.com**
6. Click **Create Subscription**
7. **Check your email** and confirm subscription

#### **Using AWS CLI:**

```bash
# Create SNS topic
TOPIC_ARN=$(aws sns create-topic --name EC2-Disk-Space-Alerts --query 'TopicArn' --output text)

echo "Topic ARN: $TOPIC_ARN"

# Subscribe your email
aws sns subscribe \
  --topic-arn $TOPIC_ARN \
  --protocol email \
  --notification-endpoint your-email@example.com

# Check your email and confirm subscription!
```

---

### **Step 7: Create CloudWatch Alarm**

#### **Using AWS Console:**

1. Go to **CloudWatch Console** → **Alarms** → **Create Alarm**
2. Click **Select Metric**
3. Choose **CWAgent** → **host, path** → Select your instance
4. Select **DiskSpaceUtilization** metric for path `/`
5. Click **Select Metric**
6. Configure:
   - **Statistic:** Average
   - **Period:** 5 minutes
   - **Threshold:** Greater than **70**
7. Click **Next**
8. **Notification:**
   - Select existing SNS topic: `EC2-Disk-Space-Alerts`
9. Click **Next**
10. **Alarm name:** `EC2-Disk-Space-Above-70`
11. Click **Create Alarm**

#### **Using AWS CLI:**

```bash
# Get your instance ID
INSTANCE_ID=$(ec2-metadata --instance-id | cut -d " " -f 2)

# Create alarm
aws cloudwatch put-metric-alarm \
  --alarm-name EC2-Disk-Space-Above-70 \
  --alarm-description "Alert when disk space exceeds 70%" \
  --metric-name DiskSpaceUtilization \
  --namespace CWAgent \
  --statistic Average \
  --period 300 \
  --threshold 70 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --dimensions Name=InstanceId,Value=$INSTANCE_ID Name=path,Value=/ \
  --alarm-actions $TOPIC_ARN
```

---

## ✅ Verification

### **1. Check CloudWatch Metrics**

```bash
# Wait 5-10 minutes for metrics to appear
# Then go to CloudWatch Console → Metrics → CWAgent
# You should see DiskSpaceUtilization metric
```

### **2. Test the Alarm**

```bash
# SSH into EC2
ssh -i pixa-key.pem ubuntu@54.88.53.94

# Create a large file to test (if disk is below 70%)
sudo dd if=/dev/zero of=/tmp/testfile bs=1G count=5

# Wait 5-10 minutes
# You should receive an email alert

# Clean up test file
sudo rm /tmp/testfile
```

### **3. View Alarm Status**

```bash
# Using AWS CLI
aws cloudwatch describe-alarms --alarm-names EC2-Disk-Space-Above-70

# Or check in AWS Console → CloudWatch → Alarms
```

---

## 📊 Additional Monitoring (Optional)

### **Monitor Memory Usage:**

```bash
# Create alarm for memory
aws cloudwatch put-metric-alarm \
  --alarm-name EC2-Memory-Above-80 \
  --alarm-description "Alert when memory exceeds 80%" \
  --metric-name MemoryUtilization \
  --namespace CWAgent \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --dimensions Name=InstanceId,Value=$INSTANCE_ID \
  --alarm-actions $TOPIC_ARN
```

### **Monitor CPU Usage:**

```bash
# CPU is available by default (no agent needed)
aws cloudwatch put-metric-alarm \
  --alarm-name EC2-CPU-Above-80 \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --dimensions Name=InstanceId,Value=$INSTANCE_ID \
  --alarm-actions $TOPIC_ARN
```

---

## 🔧 Troubleshooting

### **Metrics Not Appearing:**

```bash
# Check agent status
sudo systemctl status amazon-cloudwatch-agent

# Check agent logs
sudo tail -f /opt/aws/amazon-cloudwatch-agent/logs/amazon-cloudwatch-agent.log

# Restart agent
sudo systemctl restart amazon-cloudwatch-agent
```

### **No Email Received:**

1. Check SNS subscription is confirmed
2. Check spam folder
3. Verify alarm is in ALARM state in CloudWatch Console

### **Permission Issues:**

```bash
# Verify IAM role is attached
aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].IamInstanceProfile'
```

---

## 💰 Cost Estimate

- **CloudWatch Metrics:** First 10 metrics free, then $0.30/metric/month
- **CloudWatch Alarms:** First 10 alarms free, then $0.10/alarm/month
- **SNS:** First 1,000 emails free, then $2.00/100,000 emails

**Estimated cost for this setup:** ~$0-1/month

---

## 📚 Summary

✅ CloudWatch Agent installed  
✅ IAM role configured  
✅ Disk metrics collected every minute  
✅ SNS topic created for email alerts  
✅ Alarm triggers at 70% disk usage  
✅ Email notification sent when threshold exceeded  

**Your EC2 instance is now monitored! 🎉**
