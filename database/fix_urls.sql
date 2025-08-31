-- Fix URLs in lineups table
-- Replace 'your-project' with your actual Supabase project reference

-- First, let's see what URLs we have
SELECT id, name, video_url, thumbnail_url, gif_url FROM lineups WHERE video_url LIKE '%your-project%' OR thumbnail_url LIKE '%your-project%' OR gif_url LIKE '%your-project%';

-- Update video URLs (replace 'your-project' with your actual project reference)
UPDATE lineups 
SET video_url = REPLACE(video_url, 'your-project', 'cjldpvluxdkqkhjzbtyr')
WHERE video_url LIKE '%your-project%';

-- Update thumbnail URLs (replace 'your-project' with your actual project reference)
UPDATE lineups 
SET thumbnail_url = REPLACE(thumbnail_url, 'your-project', 'cjldpvluxdkqkhjzbtyr')
WHERE thumbnail_url LIKE '%your-project%';

-- Update GIF URLs (replace 'your-project' with your actual project reference)
UPDATE lineups 
SET gif_url = REPLACE(gif_url, 'your-project', 'cjldpvluxdkqkhjzbtyr')
WHERE gif_url LIKE '%your-project%';

-- Verify the changes
SELECT id, name, video_url, thumbnail_url, gif_url FROM lineups;
