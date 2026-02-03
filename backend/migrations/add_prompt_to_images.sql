-- Add prompt column to images table to store the target prompt for each image
ALTER TABLE images ADD COLUMN IF NOT EXISTS prompt TEXT;

-- Set a default prompt for existing images that don't have one
UPDATE images 
SET prompt = 'A creative AI-generated image with interesting visual elements and composition'
WHERE prompt IS NULL OR prompt = '';
