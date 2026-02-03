import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new pg.Pool({
  user: process.env.DB_USER || 'pixauser',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pixa',
  password: process.env.DB_PASSWORD || 'YourSecurePassword123!',
  port: parseInt(process.env.DB_PORT) || 5432,
});

async function runMigration() {
  console.log('🔄 Running database migration...');
  
  const sql = fs.readFileSync(
    path.join(__dirname, 'migrations', 'add_image_id_to_submission.sql'),
    'utf8'
  );
  
  try {
    await pool.query(sql);
    console.log('✅ Migration completed successfully!');
    console.log('   - Added image_id column to submission table');
    console.log('   - Set default image_id = 1 for existing submissions');
    console.log('   - Added foreign key constraint to images table');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.error('Full error:', err);
  } finally {
    await pool.end();
  }
}

runMigration();
