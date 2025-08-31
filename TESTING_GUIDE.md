# Upload System Testing Guide

## 🧪 How to Test Your Upload System

### **Prerequisites**
1. ✅ Supabase project set up
2. ✅ Storage buckets created (run `setup_storage.sql`)
3. ✅ Environment variables configured (`.env` file)
4. ✅ App running on device/simulator

### **Step 1: Access the Test Screen**
1. Open your app
2. On the home screen, tap **"Test Upload System"** button
3. You'll see the upload test interface

### **Step 2: Test Video Upload**
1. **Tap "Upload Video"**
2. **Select a video file** from your device
   - Use a short MP4 file (under 50MB for testing)
   - You can use any CS2 lineup video you have
3. **Wait for upload** - you'll see a loading indicator
4. **Check the success message** - it will show the uploaded URL
5. **Verify in Supabase**:
   - Go to your Supabase Dashboard
   - Navigate to **Storage** → `lineup-videos`
   - You should see your uploaded file

### **Step 3: Test Thumbnail Upload**
1. **Tap "Upload Thumbnail"**
2. **Select an image** (JPG/PNG)
3. **Verify upload** and check the URL
4. **Check Supabase Storage** → `lineup-thumbnails`

### **Step 4: Test GIF Upload**
1. **Tap "Upload GIF"**
2. **Select a GIF file**
3. **Verify upload** and check the URL
4. **Check Supabase Storage** → `lineup-gifs`

### **Step 5: Test Utility Functions**
1. **Tap "Test Public URL Generation"**
   - This tests the URL generation function
   - Should show a sample Supabase URL

2. **Tap "List Files in Bucket"**
   - This lists all files in the videos bucket
   - Should show your uploaded files

### **Step 6: Verify File Access**
1. **Copy a video URL** from the success message
2. **Paste it in a browser** or video player
3. **Verify the video plays** correctly
4. **Check the URL format**:
   ```
   https://your-project.supabase.co/storage/v1/object/public/lineup-videos/filename.mp4
   ```

## 🎯 What to Look For

### **✅ Success Indicators:**
- Upload completes without errors
- Success alert shows correct URL
- File appears in Supabase Storage
- URL is accessible in browser
- File list shows uploaded files

### **❌ Common Issues:**
- **"Failed to upload"** - Check internet connection and Supabase credentials
- **"Permission denied"** - Verify storage policies are set correctly
- **"File too large"** - Use smaller files for testing
- **"Invalid file type"** - Use supported formats (MP4, JPG, PNG, GIF)

## 🔧 Troubleshooting

### **If Uploads Fail:**
1. **Check your `.env` file**:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Verify storage buckets exist**:
   - Go to Supabase Dashboard → Storage
   - Should see: `lineup-videos`, `lineup-thumbnails`, `lineup-gifs`

3. **Check storage policies**:
   - Run `setup_storage.sql` again if needed

4. **Test with smaller files**:
   - Start with files under 10MB

### **If URLs Don't Work:**
1. **Check bucket permissions** - should be public
2. **Verify file exists** in Supabase Storage
3. **Check URL format** - should start with your project URL

## 📱 Sample Test Files

For testing, you can use:
- **Videos**: Any short MP4 file (5-30 seconds)
- **Thumbnails**: Screenshots or lineup images
- **GIFs**: Short animated GIFs

## 🎉 Success!

Once everything works:
1. **Remove the test button** from HomeScreen
2. **Integrate FileUploader** into your lineup creation flow
3. **Start uploading real CS2 lineup content**
4. **Update your database** with the uploaded URLs

Your upload system is ready for production! 🚀
