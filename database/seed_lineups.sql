-- Insert lineup data
-- Note: You'll need to replace the map_id UUIDs with actual UUIDs from your maps table
-- Run this after inserting maps and getting their UUIDs

INSERT INTO lineups (map_id, name, description, type, side, throw_type, difficulty, start_position, end_position, video_url, thumbnail_url, tags, is_pro, views) VALUES
-- Dust 2 Lineups
(
  (SELECT id FROM maps WHERE slug = 'dust2'),
  'Xbox Smoke from T Spawn',
  'Perfect smoke to block vision from CT mid to Xbox. Essential for taking short control.',
  'smoke',
  'T',
  'normal',
  'easy',
  '{"x": 0.7, "y": 0.8, "callout": "T Spawn"}',
  '{"x": 0.5, "y": 0.4, "callout": "Xbox"}',
  'https://example.com/video1.mp4',
  'https://example.com/thumb1.jpg',
  ARRAY['essential', 'mid-control', 'beginner'],
  true,
  15420
),
(
  (SELECT id FROM maps WHERE slug = 'dust2'),
  'CT Spawn Cross Smoke',
  'Smoke to safely cross to B site without getting picked from CT spawn.',
  'smoke',
  'T',
  'normal',
  'easy',
  '{"x": 0.6, "y": 0.7, "callout": "Upper Tunnel"}',
  '{"x": 0.3, "y": 0.5, "callout": "CT Cross"}',
  'https://example.com/video2.mp4',
  'https://example.com/thumb2.jpg',
  ARRAY['essential', 'b-site', 'beginner'],
  false,
  8920
);

-- Add more lineups here following the same pattern
