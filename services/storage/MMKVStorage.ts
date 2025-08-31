// src/services/storage/MMKVStorage.ts
import { MMKV } from 'react-native-mmkv';

export class MMKVStorage {
  private storage: MMKV;

  constructor() {
    this.storage = new MMKV({
      id: 'cs-lineups-cache',
      encryptionKey: 'optional-encryption-key'
    });
  }

  // Ultra-fast key-value operations
  setLineups(mapId: string, lineups: any[]) {
    this.storage.set(`lineups_${mapId}`, JSON.stringify(lineups));
  }

  getLineups(mapId: string): any[] | null {
    const data = this.storage.getString(`lineups_${mapId}`);
    return data ? JSON.parse(data) : null;
  }

  // Store last viewed for quick access
  setLastViewed(lineupIds: string[]) {
    this.storage.set('last_viewed', JSON.stringify(lineupIds));
  }

  getLastViewed(): string[] {
    const data = this.storage.getString('last_viewed');
    return data ? JSON.parse(data) : [];
  }
}