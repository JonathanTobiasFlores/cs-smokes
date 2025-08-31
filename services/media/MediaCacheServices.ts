// src/services/media/MediaCacheService.ts
import * as FileSystem from 'expo-file-system';
import * as VideoThumbnails from 'expo-video-thumbnails';

export class MediaCacheService {
  private cacheDir = `${FileSystem.cacheDirectory}lineup-media/`;
  private maxCacheSize = 500 * 1024 * 1024; // 500MB

  async initialize() {
    const dirInfo = await FileSystem.getInfoAsync(this.cacheDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.cacheDir, { intermediates: true });
    }
  }

  async cacheVideo(url: string): Promise<string> {
    const filename = this.getFilenameFromUrl(url);
    const localPath = `${this.cacheDir}${filename}`;
    
    const fileInfo = await FileSystem.getInfoAsync(localPath);
    if (fileInfo.exists) {
      return localPath; // Already cached
    }

    // Download with progress callback for loading states
    const downloadResult = await FileSystem.createDownloadResumable(
      url,
      localPath,
      {},
      (progress) => {
        // Update UI with download progress
        console.log(`Downloading: ${progress.totalBytesWritten / progress.totalBytesExpectedToWrite}`);
      }
    ).downloadAsync();

    return downloadResult?.uri || url;
  }

  async preloadEssentialVideos(mapId: string, lineups: any[]) {
    // Pre-cache top 5 most viewed lineups for instant playback
    const topLineups = lineups
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const cachePromises = topLineups.map(lineup => 
      this.cacheVideo(lineup.video_url).catch(err => console.log('Cache failed:', err))
    );

    await Promise.all(cachePromises);
  }

  async generateThumbnail(videoUrl: string): Promise<string> {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUrl, {
        time: 1000, // 1 second into video
      });
      return uri;
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
      return '';
    }
  }

  private getFilenameFromUrl(url: string): string {
    return url.split('/').pop() || `${Date.now()}.mp4`;
  }

  async clearOldCache() {
    // Implement LRU cache clearing
    const files = await FileSystem.readDirectoryAsync(this.cacheDir);
    // Sort by access time and delete oldest if over limit
  }
}