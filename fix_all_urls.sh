#!/bin/bash

echo "🔧 Fixing all hardcoded URLs in PIXA project..."
echo ""

# Colors for output
GREEN='\033[0[32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
NEW_IP="54.88.53.94"
OLD_IPS=("54.90.149.64" "54.159.73.195" "54.167.21.144")

echo "📋 Step 1: Checking current configuration..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check frontend .env
echo "Checking frontend/.env..."
if [ -f "frontend/.env" ]; then
    cat frontend/.env
else
    echo "${YELLOW}⚠️  frontend/.env not found - will create it${NC}"
fi

# Check backend .env
echo ""
echo "Checking backend/.env..."
if [ -f "backend/.env" ]; then
    grep "FRONTEND_URL\|DB_USER\|DB_PASSWORD" backend/.env
else
    echo "${RED}❌ backend/.env not found!${NC}"
    exit 1
fi

echo ""
echo "📋 Step 2: Searching for hardcoded localhost:5000..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
grep -r "localhost:5000" frontend/src --include="*.js" --include="*.jsx" | wc -l
echo "files found with localhost:5000"

echo ""
echo "📋 Step 3: Searching for old IPs..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
for ip in "${OLD_IPS[@]}"; do
    count=$(grep -r "$ip" . --include="*.js" --include="*.jsx" --include="*.md" --include="*.yml" 2>/dev/null | wc -l)
    if [ $count -gt 0 ]; then
        echo "${YELLOW}Found $count references to $ip${NC}"
    fi
done

echo ""
echo "📋 Step 4: Fixing frontend .env..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "REACT_APP_API_URL=http://$NEW_IP/api" > frontend/.env
echo "${GREEN}✅ Created frontend/.env with correct API URL${NC}"

echo ""
echo "📋 Step 5: Fixing backend .env..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
# Update FRONTEND_URL in backend .env
if grep -q "FRONTEND_URL" backend/.env; then
    sed -i.bak "s|FRONTEND_URL=.*|FRONTEND_URL=http://$NEW_IP|g" backend/.env
    echo "${GREEN}✅ Updated FRONTEND_URL in backend/.env${NC}"
else
    echo "FRONTEND_URL=http://$NEW_IP" >> backend/.env
    echo "${GREEN}✅ Added FRONTEND_URL to backend/.env${NC}"
fi

echo ""
echo "📋 Step 6: Updating config.js..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat > frontend/src/config.js << 'EOF'
// API Configuration
// This file centralizes the API URL configuration

// Use environment variable if available, otherwise use production URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://54.88.53.94/api';

// Export for easy import
export default API_URL;
EOF
echo "${GREEN}✅ Updated config.js with /api prefix${NC}"

echo ""
echo "📋 Step 7: Summary of what needs to be done on server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "${YELLOW}Run these commands on your server:${NC}"
echo ""
echo "# 1. Update backend .env"
echo "cd ~/pixa3/backend"
echo "nano .env"
echo "# Make sure these are set:"
echo "#   FRONTEND_URL=http://$NEW_IP"
echo "#   DB_USER=pixauser"
echo "#   DB_PASSWORD=<your_password>"
echo ""
echo "# 2. Update frontend .env"
echo "cd ~/pixa3/frontend"
echo "echo \"REACT_APP_API_URL=http://$NEW_IP/api\" > .env"
echo ""
echo "# 3. Pull latest code"
echo "cd ~/pixa3"
echo "git pull origin main"
echo ""
echo "# 4. Rebuild frontend"
echo "cd frontend"
echo "npm run build"
echo ""
echo "# 5. Restart backend"
echo "pm2 restart pixa-backend"
echo ""
echo "${GREEN}✅ Script complete! Now commit and push these changes.${NC}"
echo ""
echo "git add ."
echo "git commit -m \"Fix all hardcoded URLs and add /api prefix\""
echo "git push origin main"
