-- Add image_id column to submission table to track which image each submission is for
ALTER TABLE submission ADD COLUMN IF NOT EXISTS image_id INTEGER;

-- Set default image_id to 1 for existing submissions (assuming they're for the first image)
UPDATE submission SET image_id = 1 WHERE image_id IS NULL;

-- Add foreign key constraint to link to images table
ALTER TABLE submission 
ADD CONSTRAINT fk_submission_image 
FOREIGN KEY (image_id) 
REFERENCES images(id) 
ON DELETE SET NULL;
