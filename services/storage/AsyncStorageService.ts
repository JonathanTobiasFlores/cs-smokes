// src/services/storage/AsyncStorageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageService {
  // Ultra-fast key-value operations
  async setLineups(mapId: string, lineups: any[]) {
    try {
      await AsyncStorage.setItem(`lineups_${mapId}`, JSON.stringify(lineups));
    } catch (error) {
      console.error('Error setting lineups:', error);
    }
  }

  async getLineups(mapId: string): Promise<any[] | null> {
    try {
      const data = await AsyncStorage.getItem(`lineups_${mapId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting lineups:', error);
      return null;
    }
  }

  // Store last viewed for quick access
  async setLastViewed(lineupIds: string[]) {
    try {
      await AsyncStorage.setItem('last_viewed', JSON.stringify(lineupIds));
    } catch (error) {
      console.error('Error setting last viewed:', error);
    }
  }

  async getLastViewed(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem('last_viewed');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting last viewed:', error);
      return [];
    }
  }

  // Clear all cached data
  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const lineupKeys = keys.filter(key => key.startsWith('lineups_'));
      await AsyncStorage.multiRemove(lineupKeys);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}
