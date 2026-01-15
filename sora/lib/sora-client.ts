import OpenAI from 'openai';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

export interface VideoGenerationOptions {
  prompt: string;
}

export interface GeneratedVideo {
  localPath: string;
  videoId: string;
  duration: number;
}

interface SoraVideoResponse {
  id: string;
  object: string;
  model: string;
  status: string;
  progress?: number;
  url?: string;
  download_url?: string;
  error?: string | object | any;
}

/**
 * OpenAI Sora API client for video generation
 */
export class SoraClient {
  private client: OpenAI;
  private videosDir: string;
  private maxRetries: number = 3;
  private retryDelay: number = 5000; // 5 seconds

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
    this.videosDir = path.join(process.cwd(), 'videos');

    // Create videos directory if it doesn't exist
    if (!existsSync(this.videosDir)) {
      mkdirSync(this.videosDir, { recursive: true });
    }
  }

  /**
   * Generate a video using Sora API with retry logic
   */
  async generateVideo(options: VideoGenerationOptions): Promise<GeneratedVideo> {
    const { prompt } = options;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`  Generating video (attempt ${attempt}/${this.maxRetries})...`);

        // Create video generation request using raw HTTP to /v1/videos endpoint
        const response = await fetch('https://api.openai.com/v1/videos', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.client.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'sora-2-pro',
            prompt: prompt,
            seconds: "8",
            size: '1024x1792',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json() as any;
          throw new Error(`Sora API error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json() as SoraVideoResponse;
        const videoId = data.id;
        console.log(`  ✓ Video generation initiated (ID: ${videoId})`);

        // Poll for completion
        await this.pollForCompletion(videoId);

        // Download video using the /content endpoint
        const localPath = await this.downloadVideo(videoId);

        return {
          localPath,
          videoId,
          duration: 8,
        };
      } catch (error) {
        lastError = error as Error;
        console.error(`  ✗ Attempt ${attempt} failed:`, error);

        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
          console.log(`  Waiting ${delay / 1000}s before retry...`);
          await this.sleep(delay);
        }
      }
    }

    throw new Error(`Failed to generate video after ${this.maxRetries} attempts: ${lastError?.message}`);
  }

  /**
   * Poll Sora API until video is ready
   */
  private async pollForCompletion(videoId: string, maxAttempts: number = 120): Promise<void> {
    const pollInterval = 10000; // 10 seconds

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Poll video status using raw HTTP
        const response = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.client.apiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.log(`  Polling attempt ${attempt} - HTTP ${response.status}`);
          await this.sleep(pollInterval);
          continue;
        }

        const status = await response.json() as SoraVideoResponse;

        if (status.status === 'completed') {
          console.log(`  ✓ Video generation completed`);
          // Video is ready, exit polling loop
          return;
        } else if (status.status === 'failed') {
          // Properly serialize the error object to see what went wrong
          const errorMessage = typeof status.error === 'object'
            ? JSON.stringify(status.error, null, 2)
            : (status.error || 'Unknown error');
          throw new Error(`Video generation failed: ${errorMessage}`);
        }

        // Still processing (status is 'queued' or 'processing')
        const progress = status.progress || 0;
        console.log(`  Polling... (${attempt}/${maxAttempts}) - Progress: ${progress}%`);
        await this.sleep(pollInterval);
      } catch (error) {
        // If it's not a polling error but an actual failure, throw it
        if (error instanceof Error && error.message.includes('Video generation failed')) {
          throw error;
        }
        // Otherwise continue polling
        console.log(`  Polling attempt ${attempt} - waiting...`);
        await this.sleep(pollInterval);
      }
    }

    throw new Error(`Video generation timed out after ${maxAttempts * pollInterval / 1000}s`);
  }

  /**
   * Download video from Sora API to local storage
   */
  private async downloadVideo(videoId: string): Promise<string> {
    console.log(`  Downloading video...`);

    try {
      // Use the /content endpoint to download the video file
      const contentUrl = `https://api.openai.com/v1/videos/${videoId}/content`;

      const response = await fetch(contentUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.client.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download video: ${response.status} ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const localPath = path.join(this.videosDir, `${videoId}.mp4`);

      writeFileSync(localPath, Buffer.from(buffer));
      console.log(`  ✓ Video saved to ${localPath} (${(buffer.byteLength / 1024 / 1024).toFixed(2)} MB)`);

      return localPath;
    } catch (error) {
      throw new Error(`Error downloading video: ${error}`);
    }
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

