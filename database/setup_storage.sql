-- Create storage buckets for different media types
INSERT INTO storage.buckets (id, name, public) VALUES
('lineup-videos', 'lineup-videos', true),
('lineup-thumbnails', 'lineup-thumbnails', true),
('lineup-gifs', 'lineup-gifs', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for public read access
CREATE POLICY "Public read access for lineup videos" ON storage.objects
FOR SELECT USING (bucket_id = 'lineup-videos');

CREATE POLICY "Public read access for lineup thumbnails" ON storage.objects
FOR SELECT USING (bucket_id = 'lineup-thumbnails');

CREATE POLICY "Public read access for lineup gifs" ON storage.objects
FOR SELECT USING (bucket_id = 'lineup-gifs');

-- Create policy for authenticated users to upload (optional - for admin panel)
CREATE POLICY "Authenticated users can upload videos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'lineup-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload thumbnails" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'lineup-thumbnails' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload gifs" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'lineup-gifs' AND auth.role() = 'authenticated');
