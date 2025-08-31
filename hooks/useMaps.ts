import { useQuery } from '@tanstack/react-query';
import { MapsAPI } from '../services/api/SupabaseClient';

export function useMaps() {
  return useQuery({
    queryKey: ['maps'],
    queryFn: async () => {
      const maps = await MapsAPI.getMaps();
      
      // Transform the data to match your existing format
      return maps.map(map => ({
        id: map.slug, // Use slug as id for compatibility
        name: map.name,
        displayName: map.display_name,
        image: map.image_url || require('../assets/maps/de_dust2.jpg'), // Fallback
        active: map.is_active,
        competitivePool: map.competitive_pool,
      }));
    },
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
  });
}
