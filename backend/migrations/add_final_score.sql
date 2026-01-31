-- Add final_score column to submission table
ALTER TABLE submission ADD COLUMN IF NOT EXISTS final_score DOUBLE PRECISION DEFAULT 0;

-- Update existing records to set final_score equal to score
UPDATE submission SET final_score = score WHERE final_score = 0;
