#!/usr/bin/env node
/**
 * Recovery script to download and process an already-generated Sora video
 * Usage: pnpm tsx recover-video.ts <videoId> <careerName>
 * Example: pnpm tsx recover-video.ts video_6961185a2e048193bf69fb16e924412d0b1458fc66a81279 "Registered Nurse"
 */

import 'dotenv/config';
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { SupabaseStorageClient } from './lib/supabase-client.js';
import { SanityClient } from './lib/sanity-client.js';
import { ProgressTracker } from './lib/progress-tracker.js';
import { parseCareerPrompts, getDefaultCsvPath } from './lib/csv-parser.js';

// Configuration
const CONFIG = {
  openaiApiKey: process.env.OPENAI_API_KEY!,
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY!,
  sanityToken: process.env.SANITY_TOKEN!,
  sanityProjectId: process.env.SANITY_PROJECT_ID || 'j0yc55ca',
  sanityDataset: process.env.SANITY_DATASET || 'production',
};

interface VideoStatusResponse {
  id: string;
  status: string;
  url?: string;
  download_url?: string;
  video_url?: string;
  output_url?: string;
  error?: string;
  [key: string]: any;
}

/**
 * Fetch video status from Sora API
 */
async function getVideoStatus(videoId: string): Promise<VideoStatusResponse> {
  const response = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CONFIG.openaiApiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch video status: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Download video directly from Sora API
 */
async function downloadVideo(videoId: string): Promise<string> {
  console.log(`\n📥 Downloading video...`);

  const videosDir = path.join(process.cwd(), 'videos');
  if (!existsSync(videosDir)) {
    mkdirSync(videosDir, { recursive: true });
  }

  // Try the /content endpoint (similar to OpenAI files API pattern)
  const contentUrl = `https://api.openai.com/v1/videos/${videoId}/content`;
  console.log(`   Endpoint: ${contentUrl}`);

  const response = await fetch(contentUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CONFIG.openaiApiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.status} ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  const localPath = path.join(videosDir, `${videoId}.mp4`);

  writeFileSync(localPath, Buffer.from(buffer));
  console.log(`   ✓ Video saved to ${localPath} (${(buffer.byteLength / 1024 / 1024).toFixed(2)} MB)`);

  return localPath;
}

/**
 * Main recovery function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: pnpm tsx recover-video.ts <videoId> <careerName>');
    console.error('Example: pnpm tsx recover-video.ts video_6961185a2e048193bf69fb16e924412d0b1458fc66a81279 "Registered Nurse"');
    process.exit(1);
  }

  const [videoId, careerName] = args;

  console.log('\n🔧 Video Recovery Tool\n');
  console.log(`   Video ID: ${videoId}`);
  console.log(`   Career: ${careerName}\n`);

  try {
    // Step 1: Fetch video status
    console.log('1️⃣  Fetching video status from Sora API...');
    const status = await getVideoStatus(videoId);
    
    console.log(`   Status: ${status.status}`);

    if (status.status !== 'completed') {
      console.error(`\n❌ Video is not completed yet (status: ${status.status})`);
      if (status.error) {
        console.error(`   Error: ${status.error}`);
      }
      process.exit(1);
    }

    console.log(`   ✓ Video generation completed\n`);

    // Step 2: Find career in CSV and Sanity
    console.log('2️⃣  Looking up career information...');
    const csvPath = getDefaultCsvPath();
    const allCareers = parseCareerPrompts(csvPath);
    const careerInfo = allCareers.find(c => c.career.toLowerCase() === careerName.toLowerCase());
    
    if (!careerInfo) {
      console.error(`\n❌ Career "${careerName}" not found in CSV`);
      process.exit(1);
    }

    console.log(`   Slug: ${careerInfo.slug}`);

    // Initialize clients
    const sanityClient = new SanityClient(
      CONFIG.sanityProjectId,
      CONFIG.sanityDataset,
      CONFIG.sanityToken
    );

    const sanityCareer = await sanityClient.findCareerByTitle(careerName);
    if (!sanityCareer) {
      console.error(`\n❌ Career "${careerName}" not found in Sanity`);
      process.exit(1);
    }

    console.log(`   ✓ Found in Sanity: ${sanityCareer._id}\n`);

    // Step 3: Download video
    console.log('3️⃣  Downloading video...');
    const localPath = await downloadVideo(videoId);
    console.log(`   ✓ Download complete\n`);

    // Step 4: Upload to Supabase
    console.log('4️⃣  Uploading to Supabase...');
    const supabaseClient = new SupabaseStorageClient(
      CONFIG.supabaseUrl,
      CONFIG.supabaseServiceKey
    );
    
    await supabaseClient.ensureBucketExists();
    const uploadResult = await supabaseClient.uploadVideo(localPath, careerInfo.slug);
    console.log(`   ✓ Uploaded: ${uploadResult.publicUrl}\n`);

    // Step 5: Update Sanity
    console.log('5️⃣  Updating Sanity...');
    await sanityClient.updateVideoUrl(sanityCareer._id, uploadResult.publicUrl);
    console.log(`   ✓ Sanity updated\n`);

    // Step 6: Update progress tracker
    console.log('6️⃣  Updating progress tracker...');
    const tracker = new ProgressTracker();
    tracker.markCompleted(careerName, careerInfo.slug, uploadResult.publicUrl, videoId);
    console.log(`   ✓ Progress saved\n`);

    // Step 7: Clean up
    console.log('7️⃣  Cleaning up...');
    try {
      unlinkSync(localPath);
      console.log(`   ✓ Temporary file deleted\n`);
    } catch (error) {
      console.warn(`   ⚠ Failed to delete temp file: ${localPath}\n`);
    }

    console.log('✅ Recovery complete!\n');
    console.log(`   Career: ${careerName}`);
    console.log(`   Video URL: ${uploadResult.publicUrl}`);
    console.log(`   Sanity ID: ${sanityCareer._id}\n`);

  } catch (error) {
    console.error('\n❌ Recovery failed:', error);
    process.exit(1);
  }
}

main();

