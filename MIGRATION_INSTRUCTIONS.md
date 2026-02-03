# Database Migration Instructions

## Overview
This migration adds the `image_id` column to the `submission` table to properly track which image each submission belongs to. This enables correct final score calculation (sum of highest scores from each image).

## Migration File
`backend/migrations/add_image_id_to_submission.sql`

## How to Run the Migration

### Option 1: Using psql Command Line
```bash
# Navigate to the backend directory
cd backend

# Run the migration
psql -U pixauser -d pixa -f migrations/add_image_id_to_submission.sql
```

### Option 2: Using pgAdmin or Database GUI
1. Open your PostgreSQL client (pgAdmin, DBeaver, etc.)
2. Connect to the `pixa` database
3. Open and execute the SQL file: `backend/migrations/add_image_id_to_submission.sql`

### Option 3: Using Node.js Script
Create a migration script if needed:
```javascript
// backend/run-migration.js
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new pg.Pool({
  user: 'pixauser',
  host: 'localhost',
  database: 'pixa',
  password: 'YourSecurePassword123!',
  port: 5432,
});

async function runMigration() {
  const sql = fs.readFileSync(
    path.join(__dirname, 'migrations', 'add_image_id_to_submission.sql'),
    'utf8'
  );
  
  try {
    await pool.query(sql);
    console.log('✅ Migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await pool.end();
  }
}

runMigration();
```

Then run: `node backend/run-migration.js`

## What This Migration Does

1. **Adds `image_id` column** to the `submission` table
2. **Sets default value** of `1` for existing submissions (assumes they're for the first image)
3. **Adds foreign key constraint** linking to the `images` table

## Changes Made to the Application

### Backend Changes:
1. **`saveSubmission`** - Now tracks which image the submission is for based on `game.current_image`
2. **`getTopPlayers`** - Calculates final score as: SUM(MAX(score) per image)
3. **`getTrys`** - Now counts tries per image (resets when moving to next image)

### Frontend Changes:
1. **`ScoreBoard.jsx`** - Cleaned up duplicate code, displays top 3 players with correct final scores

## Testing After Migration

1. Start the backend server: `cd backend && npm start`
2. Start the frontend: `cd frontend && npm start`
3. Create a new game with 2 images
4. Have users submit prompts for both images
5. Check the scoreboard - final scores should be the sum of the highest score from each image

## Rollback (if needed)

If you need to rollback this migration:
```sql
-- Remove the foreign key constraint
ALTER TABLE submission DROP CONSTRAINT IF EXISTS fk_submission_image;

-- Remove the image_id column
ALTER TABLE submission DROP COLUMN IF EXISTS image_id;
```
