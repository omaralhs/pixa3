# Server Deployment Guide - Database Migration

## Overview
This guide explains how the database migration will work when you push your code to the server.

## Automatic Deployment Process

When you push to the `main` branch, the GitHub Actions workflow will automatically:

1. **Pull the latest code** from GitHub to your EC2 server
2. **Install dependencies** (`npm install`)
3. **Run the database migration** (`node run-migration.js`)
4. **Restart the backend** with PM2

## How the Migration Works

### The deployment workflow (`.github/workflows/deploy.yml`) includes:
```yaml
# Run database migrations
echo "🔄 Running database migrations..."
node run-migration.js || echo "⚠️ Migration may have already been applied"
```

This means:
- ✅ The migration will run automatically on your server
- ✅ If it's already been applied, it will skip gracefully (thanks to `IF NOT EXISTS` in the SQL)
- ✅ Your server database will be updated automatically

## What Gets Updated on the Server

### Database Changes:
1. **New column added**: `image_id` in the `submission` table
2. **Existing data preserved**: All current submissions will get `image_id = 1`
3. **Foreign key added**: Links submissions to the images table

### Code Changes:
1. **Backend**: New scoring logic that calculates final score correctly
2. **Frontend**: Clean scoreboard showing top 3 players

## Deployment Steps

### Option 1: Automatic (Recommended)
```bash
# Just push your code
git add .
git commit -m "Add scoreboard with proper final score calculation"
git push origin main
```

The GitHub Actions workflow will handle everything automatically!

### Option 2: Manual (If needed)
If you need to run the migration manually on the server:

```bash
# SSH into your server
ssh ubuntu@54.88.53.94

# Navigate to the project
cd ~/pixa3/backend

# Run the migration
node run-migration.js

# Restart the backend
pm2 restart pixa-backend
```

## Verification

After deployment, verify the migration worked:

```bash
# SSH into your server
ssh ubuntu@54.88.53.94

# Connect to PostgreSQL
psql -U pixauser -d pixa

# Check if the column exists
\d submission

# You should see 'image_id' in the column list
```

## Important Notes

### ✅ Safe to Run Multiple Times
The migration uses `IF NOT EXISTS`, so it's safe to run multiple times. If the column already exists, it will skip.

### ✅ Existing Data Preserved
All existing submissions will automatically get `image_id = 1`, so no data is lost.

### ✅ Backward Compatible
The migration includes a foreign key constraint with `ON DELETE SET NULL`, so if an image is deleted, submissions won't break.

## Rollback (Emergency Only)

If you need to rollback the migration:

```bash
# SSH into server
ssh ubuntu@54.88.53.94

# Connect to database
psql -U pixauser -d pixa

# Run rollback SQL
ALTER TABLE submission DROP CONSTRAINT IF EXISTS fk_submission_image;
ALTER TABLE submission DROP COLUMN IF EXISTS image_id;
```

## Testing After Deployment

1. Create a new game with 2 images
2. Have users submit prompts for both images (2 tries each)
3. Navigate to the scoreboard
4. Verify that:
   - Top 3 players are shown
   - Final scores = MAX(image1 scores) + MAX(image2 scores)
   - Not the sum of all tries

## Summary

**YES**, the migration will work automatically when you push! 

The GitHub Actions workflow will:
1. ✅ Pull your code to the server
2. ✅ Run the migration script
3. ✅ Update the database schema
4. ✅ Restart the backend with the new code

Your server database will be updated automatically without any manual intervention needed!
