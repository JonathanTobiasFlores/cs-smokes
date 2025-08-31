# Database Setup Guide

## 🚀 How to Upload Your Data to Supabase

### Step 1: Access Your Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** in the left sidebar

### Step 2: Insert Maps Data
1. Copy the contents of `seed_maps.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute

### Step 3: Insert Lineups Data
1. Copy the contents of `seed_lineups.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute

### Step 4: Verify Your Data
1. Go to **Table Editor** in the left sidebar
2. Check the `maps` and `lineups` tables
3. You should see your data populated

## 📝 Adding More Lineups

To add more lineups, follow this pattern:

```sql
INSERT INTO lineups (map_id, name, description, type, side, throw_type, difficulty, start_position, end_position, video_url, thumbnail_url, tags, is_pro, views) VALUES
(
  (SELECT id FROM maps WHERE slug = 'mirage'), -- Change map slug as needed
  'Your Lineup Name',
  'Description of the lineup',
  'smoke', -- smoke, flash, molotov, grenade
  'T', -- T or CT
  'normal', -- normal, jump, run, walk
  'easy', -- easy, medium, hard
  '{"x": 0.5, "y": 0.5, "callout": "Start Position"}',
  '{"x": 0.5, "y": 0.5, "callout": "End Position"}',
  'https://your-video-url.com/video.mp4',
  'https://your-thumbnail-url.com/thumb.jpg',
  ARRAY['tag1', 'tag2'],
  false,
  0
);
```

## 🎥 Video Content

For video content, you have several options:

1. **Supabase Storage** - Upload videos directly to Supabase
2. **YouTube/Vimeo** - Use embed URLs
3. **CDN** - Use services like Cloudflare or AWS S3

## 🔄 Next Steps

After uploading your data:
1. Test your app with real data
2. Add more lineups as needed
3. Set up video hosting
4. Implement user features (favorites, etc.)
