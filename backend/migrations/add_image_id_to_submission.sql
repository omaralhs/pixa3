-- Add image_id column to submission table to track which image each submission is for
ALTER TABLE submission ADD COLUMN IF NOT EXISTS image_id INTEGER;

-- Leave image_id as NULL for existing submissions (they don't have proper image tracking)
-- New submissions will get proper image_id from the application code

-- Add foreign key constraint to link to images table (only if not already exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_submission_image'
    ) THEN
        ALTER TABLE submission 
        ADD CONSTRAINT fk_submission_image 
        FOREIGN KEY (image_id) 
        REFERENCES images(id) 
        ON DELETE SET NULL;
    END IF;
END $$;
