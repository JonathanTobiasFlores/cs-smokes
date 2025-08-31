import { supabase } from '../api/SupabaseClient';

export class SupabaseStorageService {
  private videoBucket = 'lineup-videos';
  private thumbnailBucket = 'lineup-thumbnails';
  private gifBucket = 'lineup-gifs';

  // Upload video file
  async uploadVideo(file: File, fileName: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from(this.videoBucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload video: ${error.message}`);
    }

    return this.getPublicUrl(this.videoBucket, fileName);
  }

  // Upload thumbnail image
  async uploadThumbnail(file: File, fileName: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from(this.thumbnailBucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error details:', error);
      throw new Error(`Failed to upload thumbnail: ${error.message}`);
    }

    return this.getPublicUrl(this.thumbnailBucket, fileName);
  }

  // Upload GIF
  async uploadGif(file: File, fileName: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from(this.gifBucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload GIF: ${error.message}`);
    }

    return this.getPublicUrl(this.gifBucket, fileName);
  }

  // Get public URL for a file
  getPublicUrl(bucket: string, fileName: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  }

  // Delete a file
  async deleteFile(bucket: string, fileName: string): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  // List files in a bucket
  async listFiles(bucket: string, folder?: string): Promise<string[]> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder || '');

    if (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }

    return data.map(file => file.name);
  }

  // Generate unique filename
  generateFileName(originalName: string, lineupId: string): string {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    return `${lineupId}_${timestamp}.${extension}`;
  }
}
