-- Quick Storage Setup for CS2 Nades App
-- Run this in your Supabase SQL Editor

-- Create the three buckets we need
INSERT INTO storage.buckets (id, name, public) VALUES
('lineup-videos', 'lineup-videos', true),
('lineup-thumbnails', 'lineup-thumbnails', true),
('lineup-gifs', 'lineup-gifs', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all buckets
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (true);

-- Allow uploads (you can restrict this later if needed)
CREATE POLICY "Allow uploads" ON storage.objects
FOR INSERT WITH CHECK (true);
