-- Insert maps data
INSERT INTO maps (slug, name, display_name, is_active, competitive_pool) VALUES
('dust2', 'dust2', 'Dust 2', true, true),
('mirage', 'mirage', 'Mirage', true, true),
('inferno', 'inferno', 'Inferno', true, true),
('nuke', 'nuke', 'Nuke', true, true),
('overpass', 'overpass', 'Overpass', true, true),
('ancient', 'ancient', 'Ancient', true, true),
('anubis', 'anubis', 'Anubis', true, false),
('vertigo', 'vertigo', 'Vertigo', true, false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  is_active = EXCLUDED.is_active,
  competitive_pool = EXCLUDED.competitive_pool,
  updated_at = NOW();
