// src/services/api/SupabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:');
  console.error('EXPO_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '***' : 'missing');
  throw new Error('Supabase environment variables are required. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Optimized queries
export const LineupAPI = {
  async getMapLineups(mapSlug: string) {
    // First get the map's UUID using the slug
    const { data: mapData, error: mapError } = await supabase
      .from('maps')
      .select('id')
      .eq('slug', mapSlug)
      .single();
    
    if (mapError) throw mapError;
    if (!mapData) throw new Error(`Map with slug '${mapSlug}' not found`);

    // Then get lineups using the map's UUID
    const { data, error } = await supabase
      .from('lineups')
      .select('*')
      .eq('map_id', mapData.id)
      .order('views', { ascending: false });
    
    if (error) throw error;
    
    // Transform snake_case to camelCase for frontend compatibility
    return data?.map(lineup => ({
      id: lineup.id,
      mapId: lineup.map_id,
      name: lineup.name,
      description: lineup.description,
      type: lineup.type,
      side: lineup.side,
      throwType: lineup.throw_type,
      difficulty: lineup.difficulty,
      startPosition: lineup.start_position,
      endPosition: lineup.end_position,
      videoUrl: lineup.video_url,
      gifUrl: lineup.gif_url,
      thumbnailUrl: lineup.thumbnail_url,
      tags: lineup.tags || [],
      isPro: lineup.is_pro,
      views: lineup.views || 0,
      isFavorite: false, // Default value
    })) || [];
  },

  async getEssentialLineups(mapSlug: string) {
    // First get the map's UUID using the slug
    const { data: mapData, error: mapError } = await supabase
      .from('maps')
      .select('id')
      .eq('slug', mapSlug)
      .single();
    
    if (mapError) throw mapError;
    if (!mapData) throw new Error(`Map with slug '${mapSlug}' not found`);

    // Get only the most important lineups for quick loading
    const { data, error } = await supabase
      .from('lineups')
      .select('*')
      .eq('map_id', mapData.id)
      .in('tags', ['essential', 'must-know'])
      .limit(10);
    
    if (error) throw error;
    
    // Transform snake_case to camelCase for frontend compatibility
    return data?.map(lineup => ({
      id: lineup.id,
      mapId: lineup.map_id,
      name: lineup.name,
      description: lineup.description,
      type: lineup.type,
      side: lineup.side,
      throwType: lineup.throw_type,
      difficulty: lineup.difficulty,
      startPosition: lineup.start_position,
      endPosition: lineup.end_position,
      videoUrl: lineup.video_url,
      gifUrl: lineup.gif_url,
      thumbnailUrl: lineup.thumbnail_url,
      tags: lineup.tags || [],
      isPro: lineup.is_pro,
      views: lineup.views || 0,
      isFavorite: false, // Default value
    })) || [];
  },

  async incrementView(lineupId: string) {
    // Fire and forget - don't wait for response
    supabase.rpc('increment_views', { lineup_id: lineupId });
  }
};

export const MapsAPI = {
  async getMaps() {
    const { data, error } = await supabase
      .from('maps')
      .select('*')
      .eq('is_active', true)
      .order('display_name', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getMapBySlug(slug: string) {
    const { data, error } = await supabase
      .from('maps')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Utility function to fix placeholder URLs in the database
export const URLFixer = {
  async fixPlaceholderUrls() {
    try {
      // Get the correct Supabase URL
      const correctUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      if (!correctUrl) {
        throw new Error('Supabase URL not found in environment variables');
      }

      // Extract the project reference from the URL
      const projectRef = correctUrl.replace('https://', '').replace('.supabase.co', '');
      
      console.log('Fixing URLs with project reference:', projectRef);

      // First, get all lineups that need fixing
      const { data: lineups, error: fetchError } = await supabase
        .from('lineups')
        .select('id, video_url, thumbnail_url')
        .or('video_url.like.%your-project%,thumbnail_url.like.%your-project%');

      if (fetchError) throw fetchError;

      if (!lineups || lineups.length === 0) {
        return { success: true, message: 'No URLs need fixing' };
      }

      // Update each lineup individually
      for (const lineup of lineups) {
        const updates: any = {};
        
        if (lineup.video_url && lineup.video_url.includes('your-project')) {
          updates.video_url = lineup.video_url.replace('your-project', projectRef);
        }
        
        if (lineup.thumbnail_url && lineup.thumbnail_url.includes('your-project')) {
          updates.thumbnail_url = lineup.thumbnail_url.replace('your-project', projectRef);
        }

        if (Object.keys(updates).length > 0) {
          const { error: updateError } = await supabase
            .from('lineups')
            .update(updates)
            .eq('id', lineup.id);

          if (updateError) {
            console.error(`Error updating lineup ${lineup.id}:`, updateError);
          }
        }
      }

      return { success: true, projectRef, updatedCount: lineups.length };
    } catch (error) {
      console.error('Error fixing URLs:', error);
      throw error;
    }
  },

  async checkUrlStatus() {
    try {
      const { data, error } = await supabase
        .from('lineups')
        .select('id, name, video_url, thumbnail_url')
        .or('video_url.like.%your-project%,thumbnail_url.like.%your-project%');

      if (error) throw error;

      return {
        needsFixing: data.length > 0,
        count: data.length,
        items: data
      };
    } catch (error) {
      console.error('Error checking URL status:', error);
      throw error;
    }
  }
};