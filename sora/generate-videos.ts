#!/usr/bin/env node
import 'dotenv/config';
import { parseCareerPrompts, getDefaultCsvPath, ParsedCareer } from './lib/csv-parser.js';
import { SoraClient } from './lib/sora-client.js';
import { SupabaseStorageClient } from './lib/supabase-client.js';
import { SanityClient } from './lib/sanity-client.js';
import { ProgressTracker } from './lib/progress-tracker.js';
import { unlinkSync } from 'fs';
import PQueue from 'p-queue';

// Configuration from environment variables
const CONFIG = {
  openaiApiKey: process.env.OPENAI_API_KEY!,
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY!,
  sanityToken: process.env.SANITY_TOKEN!,
  sanityProjectId: process.env.SANITY_PROJECT_ID || 'j0yc55ca',
  sanityDataset: process.env.SANITY_DATASET || 'production',
  batchSize: parseInt(process.env.BATCH_SIZE || '5'),
};

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const shouldResume = args.includes('--resume');

// Parse batch size (--batch-size=N or --batch-size N)
const batchSizeIndex = args.findIndex(arg => arg === '--batch-size' || arg.startsWith('--batch-size='));
if (batchSizeIndex !== -1) {
  const arg = args[batchSizeIndex];
  if (arg.includes('=')) {
    CONFIG.batchSize = parseInt(arg.split('=')[1]);
  } else if (args[batchSizeIndex + 1]) {
    CONFIG.batchSize = parseInt(args[batchSizeIndex + 1]);
  }
}

// Parse careers (--careers="A,B" or --careers "A,B")
const careersIndex = args.findIndex(arg => arg === '--careers' || arg.startsWith('--careers='));
let specificCareers: string[] | undefined;
if (careersIndex !== -1) {
  const arg = args[careersIndex];
  let careersList: string;
  if (arg.includes('=')) {
    careersList = arg.split('=')[1];
  } else if (args[careersIndex + 1]) {
    careersList = args[careersIndex + 1];
  } else {
    careersList = '';
  }
  specificCareers = careersList.split(',').map(c => c.trim()).filter(c => c.length > 0);
}

/**
 * Validate environment configuration
 */
function validateConfig(): boolean {
  const required = [
    'openaiApiKey',
    'supabaseUrl',
    'supabaseServiceKey',
    'sanityToken',
  ] as const;

  const missing = required.filter(key => !CONFIG[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key.toUpperCase()}`));
    console.error('\nPlease check your .env file');
    return false;
  }

  return true;
}

/**
 * Process a single career video
 */
async function processCareer(
  career: ParsedCareer,
  soraClient: SoraClient,
  supabaseClient: SupabaseStorageClient,
  sanityClient: SanityClient,
  tracker: ProgressTracker,
  isDryRun: boolean
): Promise<boolean> {
  console.log(`\n📹 Processing: ${career.career}`);
  console.log(`   Slug: ${career.slug}`);

  try {
    // Check if career exists in Sanity
    const sanityCareer = await sanityClient.findCareerByTitle(career.career);
    if (!sanityCareer) {
      throw new Error(`Career "${career.career}" not found in Sanity`);
    }
    console.log(`   ✓ Found in Sanity: ${sanityCareer._id}`);

    if (isDryRun) {
      console.log(`   [DRY RUN] Would generate video with prompt:`);
      console.log(`   "${career.prompt.substring(0, 100)}..."`);
      tracker.markCompleted(career.career, career.slug, 'dry-run-url');
      return true;
    }

    // Generate video with Sora
    const video = await soraClient.generateVideo({
      prompt: career.prompt,
    });

    // Upload to Supabase
    const uploadResult = await supabaseClient.uploadVideo(video.localPath, career.slug);

    // Update Sanity
    await sanityClient.updateVideoUrl(sanityCareer._id, uploadResult.publicUrl);

    // Clean up local file
    try {
      unlinkSync(video.localPath);
      console.log(`   ✓ Cleaned up temporary file`);
    } catch (error) {
      console.warn(`   ⚠ Failed to delete temp file: ${video.localPath}`);
    }

    // Track progress
    tracker.markCompleted(career.career, career.slug, uploadResult.publicUrl, video.videoId);

    console.log(`   ✅ Complete: ${career.career}`);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    tracker.markFailed(career.career, career.slug, errorMessage);
    console.error(`   ❌ Failed: ${career.career}`);
    console.error(`   Error: ${errorMessage}`);
    return false;
  }
}

/**
 * Process careers in batches
 */
async function processBatch(
  careers: ParsedCareer[],
  batchNumber: number,
  soraClient: SoraClient,
  supabaseClient: SupabaseStorageClient,
  sanityClient: SanityClient,
  tracker: ProgressTracker,
  isDryRun: boolean
): Promise<void> {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  BATCH ${batchNumber} (${careers.length} careers)`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  tracker.setBatch(batchNumber);

  // Process careers sequentially within batch (rate limiting)
  const queue = new PQueue({ concurrency: 1 });

  for (const career of careers) {
    await queue.add(() =>
      processCareer(career, soraClient, supabaseClient, sanityClient, tracker, isDryRun)
    );
  }

  await queue.onIdle();
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🎬 Sora Video Generation Pipeline\n');

  // Validate configuration
  if (!validateConfig()) {
    process.exit(1);
  }

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No videos will be generated\n');
  }

  // Initialize clients
  const soraClient = new SoraClient(CONFIG.openaiApiKey);
  const supabaseClient = new SupabaseStorageClient(
    CONFIG.supabaseUrl,
    CONFIG.supabaseServiceKey
  );
  const sanityClient = new SanityClient(
    CONFIG.sanityProjectId,
    CONFIG.sanityDataset,
    CONFIG.sanityToken
  );
  const tracker = new ProgressTracker();

  // Ensure Supabase bucket exists
  if (!isDryRun) {
    await supabaseClient.ensureBucketExists();
  }

  // Parse CSV
  const csvPath = getDefaultCsvPath();
  console.log(`📄 Reading prompts from: ${csvPath}\n`);
  const allCareers = parseCareerPrompts(csvPath);

  // Filter careers
  let careersToProcess = allCareers;

  // Filter by specific careers if provided
  if (specificCareers) {
    careersToProcess = careersToProcess.filter(c =>
      specificCareers.some(name => c.career.toLowerCase() === name.toLowerCase())
    );
    console.log(`\n🎯 Processing ${careersToProcess.length} specific career(s)`);
  }

  // Filter out already completed careers (unless it's a fresh start)
  if (shouldResume) {
    const completedNames = tracker.getCompletedNames();
    const beforeCount = careersToProcess.length;
    careersToProcess = careersToProcess.filter(c => !completedNames.includes(c.career));
    console.log(`\n↻ Resuming: Skipping ${beforeCount - careersToProcess.length} completed careers`);
  }

  if (careersToProcess.length === 0) {
    console.log('\n✅ All careers have been processed!');
    console.log(tracker.getSummary());
    return;
  }

  // Initialize tracker
  tracker.initialize(allCareers.length);

  // Split into batches
  const batches: ParsedCareer[][] = [];
  for (let i = 0; i < careersToProcess.length; i += CONFIG.batchSize) {
    batches.push(careersToProcess.slice(i, i + CONFIG.batchSize));
  }

  console.log(`\n📊 Processing ${careersToProcess.length} careers in ${batches.length} batch(es)`);
  console.log(`   Batch size: ${CONFIG.batchSize}`);
  console.log(`   Video duration: 8s (1024x1792)`);

  // Estimate costs
  if (!isDryRun) {
    const estimatedCost = careersToProcess.length * 20; // $20 average per video
    console.log(`\n💰 Estimated cost: $${estimatedCost} (±50%)`);
    console.log(`⏱️  Estimated time: ${Math.ceil(careersToProcess.length * 7 / 60)} hours`);
    console.log('\n⚠️  This will incur real costs! Press Ctrl+C to cancel.\n');
    
    // Wait 5 seconds before starting
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // Process batches
  const startTime = Date.now();

  for (let i = 0; i < batches.length; i++) {
    await processBatch(
      batches[i],
      i + 1,
      soraClient,
      supabaseClient,
      sanityClient,
      tracker,
      isDryRun
    );

    // Wait between batches (except for last batch)
    if (i < batches.length - 1) {
      console.log(`\n⏸️  Waiting 60 seconds before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
  }

  // Final summary
  const elapsedTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n\n✨ Processing complete! (${elapsedTime} minutes)`);
  console.log(tracker.getSummary());

  // Validation reminder
  if (!isDryRun) {
    console.log(`\n📋 Next steps:`);
    console.log(`   1. Check Supabase bucket for ${tracker.getState().completed.length} videos`);
    console.log(`   2. Verify Sanity careers have videoUrl field populated`);
    console.log(`   3. Test video playback on career detail pages`);
  }
}

// Run main with error handling
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

