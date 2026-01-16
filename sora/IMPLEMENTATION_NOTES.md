# Sora Video Generation Pipeline - Implementation Notes

## ✅ Implementation Complete

All components of the Sora video generation pipeline have been successfully implemented:

### Completed Components

1. **Environment Configuration** ✓
   - `.gitignore` configured to protect sensitive files
   - Environment variable structure defined
   - README with setup instructions

2. **Package Configuration** ✓
   - `package.json` with all required dependencies
   - `tsconfig.json` for TypeScript compilation
   - NPM scripts for easy execution

3. **Core Libraries** ✓
   - `lib/csv-parser.ts` - Parse career prompts from CSV
   - `lib/sora-client.ts` - OpenAI Sora API integration
   - `lib/supabase-client.ts` - Video upload to Supabase Storage
   - `lib/sanity-client.ts` - Update career documents in Sanity
   - `lib/progress-tracker.ts` - Resumable processing with state persistence

4. **Main Script** ✓
   - `generate-videos.ts` - Orchestration with batch processing
   - Command-line arguments support (--dry-run, --resume, --batch-size, --careers)
   - Error handling and retry logic
   - Progress tracking and reporting

5. **Supabase Integration** ✓
   - Auto-create storage bucket
   - Upload videos with proper naming
   - Public URL generation

## 📋 Manual Testing Required

Due to sandbox limitations, the following steps need to be completed manually:

### Step 1: Environment Setup

Create `/Users/leswins/VHWDA/sora/.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
SANITY_TOKEN=your_sanity_write_token
SANITY_PROJECT_ID=j0yc55ca
SANITY_DATASET=production
```

### Step 2: Install Dependencies

```bash
cd /Users/leswins/VHWDA
pnpm install
```

This will install dependencies for the new `sora` workspace package.

### Step 3: Test Dry Run

```bash
cd /Users/leswins/VHWDA/sora
pnpm tsx generate-videos.ts --dry-run
```

**Expected Output:**
- ✓ Validates environment variables
- ✓ Parses 70 careers from CSV
- ✓ Connects to Sanity and finds career documents
- ✓ Simulates video generation (no actual API calls)
- ✓ Shows progress summary

### Step 4: Test First Batch (Optional)

⚠️ **Warning:** This will incur real costs (~$100-150 for 5 videos)

```bash
cd /Users/leswins/VHWDA/sora
pnpm tsx generate-videos.ts --batch-size 5 --careers "Dental Assistant,Dental Hygienist,Dentist,Registered Dietitian,Assisted Living Facility Administrator"
```

**What happens:**
1. Generates videos via Sora API (~5-10 min per video)
2. Uploads to Supabase Storage
3. Updates Sanity career documents
4. Saves progress to `progress.json`

### Step 5: Full Production Run

⚠️ **Major Cost Warning:** $700-2100 for all 70 careers

```bash
cd /Users/leswins/VHWDA/sora
pnpm tsx generate-videos.ts
```

To resume if interrupted:
```bash
pnpm tsx generate-videos.ts --resume
```

## 🏗️ Architecture

```
CSV File (70 careers)
    ↓
Parse & Filter
    ↓
Batch Processor (5 at a time)
    ↓
For each career:
    1. Generate video (Sora API) → ~7 min
    2. Download to temp folder
    3. Upload to Supabase Storage
    4. Update Sanity career document
    5. Save progress
    6. Clean up temp file
    ↓
Summary Report
```

## 🔧 Troubleshooting

### "Missing environment variables"
- Ensure `.env` file exists in `sora/` directory
- Check all required variables are set

### "Career not found in Sanity"
- Career name in CSV must match `title.en` in Sanity exactly
- Check for typos or casing differences

### "Failed to upload to Supabase"
- Verify Supabase service key has storage permissions
- Check bucket name is `career-videos`
- Ensure bucket is public

### "Sora API error"
- Confirm you have Sora API access (currently limited beta)
- Check API key is valid
- Verify rate limits haven't been exceeded

## 📊 Progress Tracking

The pipeline creates `progress.json` to track:
- Completed careers with video URLs
- Failed careers with error messages
- Current batch number
- Timestamps

This allows resuming from interruptions without re-generating expensive videos.

## 🎯 Next Steps After Implementation

1. **Validate dry run** - Ensure all 70 careers are found in Sanity
2. **Test with 1-2 careers** - Verify end-to-end flow works
3. **Check costs** - Monitor OpenAI usage dashboard
4. **Run in batches** - Process 5-10 at a time to manage costs
5. **Verify videos** - Check Supabase bucket and Sanity fields
6. **Test playback** - Ensure videos work on career detail pages

## 🔐 Security Notes

- `.env` is gitignored - never commit credentials
- Supabase service key has full access - protect it
- Videos are public in Supabase Storage
- Progress file may contain career names (no sensitive data)

## 💡 Tips

- Start small (1-2 careers) to test the full workflow
- Monitor OpenAI usage to track costs in real-time
- Use `--resume` flag if script is interrupted
- Keep `progress.json` for audit trail
- Videos are large (~50-100MB each) - ensure adequate storage

## 🐛 Known Limitations

1. **Sora API Availability** - Currently in limited beta, not widely available
2. **Cost** - Sora videos are expensive ($10-30 each)
3. **Time** - 5-10 minutes per video = 6-12 hours total
4. **Rate Limits** - OpenAI may have undocumented rate limits
5. **Video Quality** - AI-generated videos may need manual review

## 📞 Support

For issues with:
- **OpenAI Sora**: platform.openai.com/docs
- **Supabase**: supabase.com/docs
- **Sanity**: sanity.io/docs
- **This script**: Check error messages in console and `progress.json`

