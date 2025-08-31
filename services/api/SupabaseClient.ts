// src/services/api/SupabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

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
  async getMapLineups(mapId: string) {
    const { data, error } = await supabase
      .from('lineups')
      .select('*')
      .eq('map_id', mapId)
      .order('views', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getEssentialLineups(mapId: string) {
    // Get only the most important lineups for quick loading
    const { data, error } = await supabase
      .from('lineups')
      .select('*')
      .eq('map_id', mapId)
      .in('tags', ['essential', 'must-know'])
      .limit(10);
    
    if (error) throw error;
    return data;
  },

  async incrementView(lineupId: string) {
    // Fire and forget - don't wait for response
    supabase.rpc('increment_views', { lineup_id: lineupId });
  }
};