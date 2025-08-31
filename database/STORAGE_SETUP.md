# Supabase Storage Setup Guide

## 🎥 Complete Video Upload System

### Step 1: Set Up Storage Buckets

1. **Go to your Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Run the Storage Setup Script**
   - Go to **SQL Editor**
   - Copy and paste the contents of `setup_storage.sql`
   - Click **Run**

3. **Verify Storage Buckets**
   - Go to **Storage** in the left sidebar
   - You should see 3 buckets:
     - `lineup-videos`
     - `lineup-thumbnails`
     - `lineup-gifs`

### Step 2: Upload Your Data

1. **Insert Maps**
   - Run `seed_maps.sql` in SQL Editor

2. **Insert Lineups**
   - Run `seed_lineups.sql` in SQL Editor

### Step 3: Upload Media Files

#### Option A: Manual Upload via Supabase Dashboard
1. Go to **Storage** → `lineup-videos`
2. Click **Upload files**
3. Upload your video files
4. Copy the public URL
5. Update your lineup records with the URLs

#### Option B: Use the FileUploader Component
1. Add the `FileUploader` component to your admin interface
2. Use it to upload videos and thumbnails
3. The component will automatically update your database

### Step 4: Update Lineup URLs

After uploading files, update your lineup records:

```sql
-- Example: Update a lineup with actual video URL
UPDATE lineups 
SET 
  video_url = 'https://your-project.supabase.co/storage/v1/object/public/lineup-videos/dust2_xbox_smoke.mp4',
  thumbnail_url = 'https://your-project.supabase.co/storage/v1/object/public/lineup-thumbnails/dust2_xbox_smoke_thumb.jpg'
WHERE name = 'Xbox Smoke from T Spawn';
```

## 📱 Using the FileUploader Component

```tsx
import { FileUploader } from '../components/FileUploader';

// In your component
<FileUploader
  type="video"
  lineupId="your-lineup-id"
  onUploadComplete={(url, type) => {
    // Update your lineup with the new URL
    console.log(`${type} uploaded:`, url);
  }}
/>
```

## 🔧 Storage Service Usage

```tsx
import { SupabaseStorageService } from '../services/storage/SupabaseStorageService';

const storageService = new SupabaseStorageService();

// Upload a video
const videoUrl = await storageService.uploadVideo(file, 'my-video.mp4');

// Get public URL
const publicUrl = storageService.getPublicUrl('lineup-videos', 'my-video.mp4');
```

## 📊 Storage Limits

- **Free Tier**: 1GB storage, 2GB bandwidth
- **Pro Tier**: 100GB storage, 250GB bandwidth
- **Team Tier**: 1TB storage, 2TB bandwidth

## 🎯 Next Steps

1. **Test the upload system** with a few sample videos
2. **Create an admin interface** for managing lineups
3. **Implement video compression** for better performance
4. **Add video processing** (thumbnails, previews)
5. **Set up CDN** for global delivery

## 🚨 Important Notes

- **File size limits**: Keep videos under 50MB for better performance
- **Format support**: MP4, WebM, MOV for videos; JPG, PNG for images
- **Security**: All files are publicly accessible (by design for your app)
- **Costs**: Monitor your storage usage to avoid unexpected charges
