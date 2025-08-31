-- Fix Storage Policies for Anonymous Uploads
-- Run this in your Supabase SQL Editor

-- First, drop existing policies
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for lineup videos" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for lineup thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for lineup gifs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload gifs" ON storage.objects;

-- Create new policies that allow anonymous access
-- Allow anyone to read files from our buckets
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (
  bucket_id IN ('lineup-videos', 'lineup-thumbnails', 'lineup-gifs')
);

-- Allow anyone to upload to our buckets (for now - you can restrict this later)
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id IN ('lineup-videos', 'lineup-thumbnails', 'lineup-gifs')
);

-- Allow anyone to update files in our buckets
CREATE POLICY "Allow public updates" ON storage.objects
FOR UPDATE USING (
  bucket_id IN ('lineup-videos', 'lineup-thumbnails', 'lineup-gifs')
);

-- Allow anyone to delete files in our buckets
CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE USING (
  bucket_id IN ('lineup-videos', 'lineup-thumbnails', 'lineup-gifs')
);
