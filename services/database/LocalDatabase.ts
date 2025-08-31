// src/services/database/LocalDatabase.ts
import * as SQLite from 'expo-sqlite';

export class LocalDatabase {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync('lineups.db');
    this.initialize();
  }

  private async initialize() {
    // Create tables for offline storage
    this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS lineups (
        id TEXT PRIMARY KEY,
        map_id TEXT,
        data TEXT,
        updated_at INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS cached_media (
        url TEXT PRIMARY KEY,
        local_path TEXT,
        size INTEGER,
        accessed_at INTEGER
      );
    `);
  }

  async cacheLineup(lineup: any) {
    const result = await this.db.runAsync(
      'INSERT OR REPLACE INTO lineups (id, map_id, data, updated_at) VALUES (?, ?, ?, ?)',
      [lineup.id, lineup.map_id, JSON.stringify(lineup), Date.now()]
    );
    return result;
  }

  async getMapLineups(mapId: string): Promise<any[]> {
    const result = await this.db.getAllAsync(
      'SELECT data FROM lineups WHERE map_id = ? ORDER BY updated_at DESC',
      [mapId]
    );
    
    return result.map((row: any) => JSON.parse(row.data));
  }
}