import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

export interface UploadResult {
  publicUrl: string;
  path: string;
}

/**
 * Supabase storage client for video uploads
 */
export class SupabaseStorageClient {
  private client: SupabaseClient;
  private bucketName: string = 'career-videos';

  constructor(supabaseUrl: string, serviceKey: string) {
    this.client = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  /**
   * Ensure the storage bucket exists, create if not
   */
  async ensureBucketExists(): Promise<void> {
    try {
      const { data: buckets, error: listError } = await this.client.storage.listBuckets();

      if (listError) {
        throw new Error(`Failed to list buckets: ${listError.message}`);
      }

      const bucketExists = buckets?.some(bucket => bucket.name === this.bucketName);

      if (!bucketExists) {
        console.log(`Creating storage bucket: ${this.bucketName}...`);
        
        const { error: createError } = await this.client.storage.createBucket(this.bucketName, {
          public: true,
        });

        if (createError) {
          throw new Error(`Failed to create bucket: ${createError.message}`);
        }

        console.log(`✓ Bucket '${this.bucketName}' created successfully`);
      } else {
        console.log(`✓ Bucket '${this.bucketName}' already exists`);
      }
    } catch (error) {
      throw new Error(`Error ensuring bucket exists: ${error}`);
    }
  }

  /**
   * Upload a video file to Supabase storage
   * @param localPath - Path to the local video file
   * @param slug - Career slug to use as filename
   * @returns Public URL of the uploaded video
   */
  async uploadVideo(localPath: string, slug: string): Promise<UploadResult> {
    try {
      console.log(`  Uploading video to Supabase...`);

      // Read file
      const fileBuffer = readFileSync(localPath);
      const filePath = `${slug}.mp4`;

      // Upload to Supabase
      const { data, error } = await this.client.storage
        .from(this.bucketName)
        .upload(filePath, fileBuffer, {
          contentType: 'video/mp4',
          upsert: true, // Overwrite if exists
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = this.client.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      console.log(`  ✓ Video uploaded: ${urlData.publicUrl}`);

      return {
        publicUrl: urlData.publicUrl,
        path: filePath,
      };
    } catch (error) {
      throw new Error(`Error uploading video: ${error}`);
    }
  }

  /**
   * Delete a video from storage (cleanup utility)
   */
  async deleteVideo(slug: string): Promise<void> {
    const filePath = `${slug}.mp4`;
    
    const { error } = await this.client.storage
      .from(this.bucketName)
      .remove([filePath]);

    if (error) {
      throw new Error(`Failed to delete video: ${error.message}`);
    }
  }

  /**
   * List all videos in the bucket
   */
  async listVideos(): Promise<string[]> {
    const { data, error } = await this.client.storage
      .from(this.bucketName)
      .list();

    if (error) {
      throw new Error(`Failed to list videos: ${error.message}`);
    }

    return data?.map(file => file.name) || [];
  }
}

