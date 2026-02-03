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
  console.log('🔄 Running database migrations...');
  
  try {
    // Migration 1: Add image_id to submission table
    const sql1 = fs.readFileSync(
      path.join(__dirname, 'migrations', 'add_image_id_to_submission.sql'),
      'utf8'
    );
    await pool.query(sql1);
    console.log('✅ Migration 1 completed: image_id column added to submission table');

    // Migration 2: Add prompt to images table
    const sql2 = fs.readFileSync(
      path.join(__dirname, 'migrations', 'add_prompt_to_images.sql'),
      'utf8'
    );
    await pool.query(sql2);
    console.log('✅ Migration 2 completed: prompt column added to images table');

    console.log('\n🎉 All migrations completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.error('Full error:', err);
  } finally {
    await pool.end();
  }
}

runMigration();
