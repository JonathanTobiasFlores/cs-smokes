// src/hooks/useLineups.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LineupAPI } from '../services/api/SupabaseClient';
import { MMKVStorage } from '../services/storage/MMKVStorage';
import { LocalDatabase } from '../services/database/LocalDatabase';
import NetInfo from '@react-native-community/netinfo';

const storage = new MMKVStorage();
const localDb = new LocalDatabase();

export function useMapLineups(mapId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['lineups', mapId],
    queryFn: async () => {
      // 1. Check MMKV for instant data (< 1ms)
      const cachedData = storage.getLineups(mapId);
      if (cachedData) {
        // Return cached data immediately
        queryClient.setQueryData(['lineups', mapId], cachedData);
        
        // Fetch fresh data in background
        LineupAPI.getMapLineups(mapId).then(freshData => {
          storage.setLineups(mapId, freshData);
          queryClient.setQueryData(['lineups', mapId], freshData);
        });
        
        return cachedData;
      }

      // 2. Check if online
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        // Offline: use SQLite
        return localDb.getMapLineups(mapId);
      }

      // 3. Fetch from Supabase
      const data = await LineupAPI.getMapLineups(mapId);
      
      // Cache for next time
      storage.setLineups(mapId, data);
      data.forEach(lineup => localDb.cacheLineup(lineup));
      
      return data;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });
}