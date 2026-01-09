# Sora Video Generation Pipeline - Implementation Plan

## 📋 Overview

This document outlines the complete implementation for generating career videos using OpenAI's Sora API, storing them in Supabase Storage, and updating video URLs in Sanity CMS.

## 🎯 Objectives

1. Generate 70 cinematic career videos from custom prompts
2. Store videos in Supabase Storage for public access
3. Update Sanity career documents with video URLs
4. Provide resumable processing for long-running operations
5. Include cost controls and error handling

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CSV Input (70 careers)                   │
│              vhwda_sora_prompts_updated.csv                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   CSV Parser (lib/csv-parser.ts)             │
│  • Validates career names and prompts                        │
│  • Generates URL-safe slugs                                  │
│  • Returns typed ParsedCareer[]                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               Batch Processor (generate-videos.ts)           │
│  • Processes 5 videos at a time (configurable)               │
│  • Tracks progress in progress.json                          │
│  • Handles errors with retry logic                           │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│   Sora Client    │    │ Progress Tracker  │
│ (lib/sora-*.ts)  │    │(lib/progress-*.ts)│
│                  │    │                   │
│ • Generate video │    │ • Save state      │
│ • Poll status    │    │ • Resume support  │
│ • Download MP4   │    │ • Error log       │
└────────┬─────────┘    └───────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│            Supabase Client (lib/supabase-client.ts)          │
│  • Create career-videos bucket (if not exists)               │
│  • Upload video files ({slug}.mp4)                           │
│  • Return public URL                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│             Sanity Client (lib/sanity-client.ts)             │
│  • Query career by title.en                                  │
│  • Patch career document with videoUrl                       │
│  • Handle draft vs published documents                       │
└─────────────────────────────────────────────────────────────┘
```

## 📦 File Structure

```
sora/
├── generate-videos.ts          # Main orchestration script (260 lines)
├── lib/
│   ├── csv-parser.ts          # Parse CSV, validate, create slugs
│   ├── sora-client.ts         # OpenAI Sora API wrapper
│   ├── supabase-client.ts     # Supabase Storage operations
│   ├── sanity-client.ts       # Sanity CMS mutations
│   └── progress-tracker.ts    # State persistence
├── setup.sh                   # Automated setup script
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
├── .gitignore                 # Protect secrets & temp files
├── README.md                  # Full documentation
├── QUICKSTART.md              # Quick start guide
└── IMPLEMENTATION_NOTES.md    # Technical details

Generated files (gitignored):
├── .env                       # API credentials
├── videos/                    # Temp download folder
├── progress.json              # Resume state
└── node_modules/              # Dependencies
```

## 🔧 Components

### 1. CSV Parser (`lib/csv-parser.ts`)

**Purpose:** Parse career prompts from CSV file

**Key Functions:**
- `parseCareerPrompts(csvPath)` - Main parser
- `createSlug(careerName)` - URL-safe slug generation
- `getDefaultCsvPath()` - Default CSV location

**Validation:**
- Uses Zod schema for type safety
- Validates non-empty career names and prompts
- Filters out incomplete records

**Output:**
```typescript
interface ParsedCareer {
  career: string;    // "Dental Assistant"
  prompt: string;    // Full Sora prompt
  slug: string;      // "dental-assistant"
}
```

### 2. Sora Client (`lib/sora-client.ts`)

**Purpose:** Generate videos using OpenAI Sora API

**Key Methods:**
- `generateVideo(options)` - Main generation method
- `pollForCompletion(videoId)` - Wait for video to be ready
- `downloadVideo(url, videoId)` - Download to local storage

**Features:**
- Retry logic (3 attempts with exponential backoff)
- Async polling (10s intervals, 60 max attempts)
- Temp file management in `videos/` directory
- Configurable duration and quality

**Error Handling:**
- Network failures → Retry
- API errors → Log and skip
- Timeout after 10 minutes

### 3. Supabase Client (`lib/supabase-client.ts`)

**Purpose:** Upload videos to Supabase Storage

**Key Methods:**
- `ensureBucketExists()` - Auto-create bucket
- `uploadVideo(localPath, slug)` - Upload with upsert
- `deleteVideo(slug)` - Cleanup utility
- `listVideos()` - Audit utility

**Configuration:**
- Bucket: `career-videos`
- Public access: Yes
- File naming: `{slug}.mp4`
- Max size: 100MB
- MIME type: `video/mp4`

**Output:**
```typescript
interface UploadResult {
  publicUrl: string;  // https://...supabase.co/.../dental-assistant.mp4
  path: string;       // dental-assistant.mp4
}
```

### 4. Sanity Client (`lib/sanity-client.ts`)

**Purpose:** Update career documents in Sanity CMS

**Key Methods:**
- `findCareerByTitle(careerTitle)` - Query by title.en
- `updateVideoUrl(careerId, videoUrl)` - Patch document
- `hasVideoUrl(careerTitle)` - Check if already processed
- `getCareersWithVideos()` - Validation utility

**GROQ Query:**
```groq
*[_type == "career" && title.en == $careerTitle][0] {
  _id, _type, title, slug, videoUrl
}
```

**Mutation:**
```typescript
.patch(careerId).set({ videoUrl }).commit()
```

### 5. Progress Tracker (`lib/progress-tracker.ts`)

**Purpose:** Enable resumable processing

**State Structure:**
```typescript
interface ProgressState {
  startedAt: string;
  lastUpdatedAt: string;
  totalCareers: number;
  completed: ProcessedCareer[];
  failed: FailedCareer[];
  currentBatch: number;
}
```

**Key Methods:**
- `markCompleted(career, slug, videoUrl)` - Save success
- `markFailed(career, slug, error)` - Log failure
- `isCompleted(careerName)` - Check if done
- `getSummary()` - Generate report

**Persistence:**
- Saves to `progress.json` after each career
- Allows resume from any point
- Audit trail for debugging

### 6. Main Script (`generate-videos.ts`)

**Purpose:** Orchestrate entire pipeline

**Command-Line Interface:**
```bash
pnpm tsx generate-videos.ts [options]

Options:
  --dry-run              # Validate without API calls
  --resume               # Continue from checkpoint
  --batch-size N         # Override batch size
  --careers "A,B,C"      # Process specific careers only
```

**Processing Flow:**
1. Load and validate environment variables
2. Initialize all clients (Sora, Supabase, Sanity)
3. Parse CSV and filter careers
4. Process in batches:
   - Generate video (Sora API)
   - Download to temp storage
   - Upload to Supabase
   - Update Sanity
   - Save progress
   - Clean up temp file
5. Display summary report

**Error Handling:**
- Retry failed Sora requests (3x)
- Continue processing on single failure
- Log all errors to progress tracker
- Clean up temp files even on error

**Rate Limiting:**
- Process 1 video at a time within batch
- 60-second pause between batches
- Respect OpenAI API limits

## 🔐 Environment Configuration

Required variables in `.env`:

```env
# OpenAI Sora API
OPENAI_API_KEY=sk-proj-...

# Supabase Storage
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbG...

# Sanity CMS
SANITY_TOKEN=sk...
SANITY_PROJECT_ID=j0yc55ca
SANITY_DATASET=production

# Optional overrides
BATCH_SIZE=5
VIDEO_DURATION=10
```

## 📊 Cost & Performance

### Cost Breakdown

| Item | Unit Cost | Quantity | Total |
|------|-----------|----------|-------|
| Sora API | $10-30/video | 70 | $700-2100 |
| Supabase Storage | $0.02/GB/month | 5GB | $0.10/month |
| Sanity API | Free | ∞ | $0 |
| **Total** | | | **$700-2100** |

### Performance

| Metric | Value |
|--------|-------|
| Video generation time | 5-10 min/video |
| Total processing time | 6-12 hours |
| Batch size | 5 videos |
| Batches required | 14 batches |
| Network bandwidth | ~3.5-7GB download + upload |

### Optimization

- **Parallel processing**: Limited to 1 per batch for rate limiting
- **Resume capability**: No rework needed after interruption
- **Incremental uploads**: Videos uploaded as they complete
- **Temp file cleanup**: Automatic deletion after upload

## 🧪 Testing Strategy

### Phase 1: Dry Run (No Cost)
```bash
pnpm tsx generate-videos.ts --dry-run
```

**Validates:**
- ✓ Environment variables present
- ✓ CSV parsing works
- ✓ All 70 careers found in Sanity
- ✓ Slug generation correct
- ✓ No duplicate slugs

### Phase 2: Single Career Test (~$20)
```bash
pnpm tsx generate-videos.ts --careers "Dental Assistant"
```

**Validates:**
- ✓ Sora API authentication
- ✓ Video generation works
- ✓ Supabase upload succeeds
- ✓ Sanity update works
- ✓ Progress tracking saves
- ✓ Video playback on website

### Phase 3: Small Batch (~$100)
```bash
pnpm tsx generate-videos.ts --batch-size 5 --careers "Dental Assistant,Dental Hygienist,Dentist,Registered Dietitian,Assisted Living Facility Administrator"
```

**Validates:**
- ✓ Batch processing logic
- ✓ Rate limiting works
- ✓ Progress persists between batches
- ✓ Error handling for failures
- ✓ Summary report accuracy

### Phase 4: Full Production ($700-2100)
```bash
pnpm tsx generate-videos.ts
```

**Validates:**
- ✓ All 70 videos generated
- ✓ All uploaded to Supabase
- ✓ All Sanity documents updated
- ✓ No duplicates or errors

## 🔍 Validation

### Post-Completion Checks

**1. Supabase Bucket:**
```bash
# Check via Supabase dashboard
Storage → career-videos → Should show 70 files
Total size: ~3.5-7GB
```

**2. Sanity Query:**
```groq
*[_type == "career" && defined(videoUrl)] | length
// Expected: 70

*[_type == "career" && defined(videoUrl)] {
  "career": title.en,
  videoUrl
}
// Expected: All 70 with valid URLs
```

**3. Website Test:**
- Visit career detail pages
- Verify video player appears
- Check autoplay works
- Test on mobile/desktop

**4. Progress Audit:**
```bash
cat progress.json
# Check completed.length === 70
# Check failed.length === 0
```

## 🐛 Troubleshooting

### Common Issues

**Issue:** "Missing environment variables"
- **Cause:** .env file not found or incomplete
- **Fix:** Create .env with all required variables

**Issue:** "Career not found in Sanity"
- **Cause:** CSV name doesn't match Sanity title.en
- **Fix:** Check spelling/casing in CSV vs Sanity

**Issue:** "Sora API error: Unauthorized"
- **Cause:** Invalid API key or no Sora access
- **Fix:** Verify key at platform.openai.com

**Issue:** "Upload failed: Permission denied"
- **Cause:** Invalid Supabase service key
- **Fix:** Get service_role key from project settings

**Issue:** "Timeout waiting for video"
- **Cause:** Sora API slow or overloaded
- **Fix:** Script auto-retries, or resume later

## 🚀 Deployment

### Prerequisites

1. **OpenAI Sora Access** (currently limited beta)
2. **Supabase Project** with Storage enabled
3. **Sanity Project** with write token
4. **Node.js** 18+ and pnpm

### Setup Steps

1. **Clone and configure:**
   ```bash
   cd /Users/leswins/VHWDA/sora
   cp .env.example .env  # Edit with your credentials
   ```

2. **Install dependencies:**
   ```bash
   cd /Users/leswins/VHWDA
   pnpm install
   ```

3. **Test setup:**
   ```bash
   cd sora
   pnpm tsx generate-videos.ts --dry-run
   ```

4. **Run production:**
   ```bash
   pnpm tsx generate-videos.ts
   ```

## 📈 Monitoring

### During Execution

Monitor these dashboards:
- **OpenAI Usage**: platform.openai.com/usage
- **Supabase Storage**: Dashboard → Storage → career-videos
- **Console Output**: Real-time progress in terminal
- **progress.json**: Live state file

### After Completion

Review:
- Cost reports in OpenAI dashboard
- Storage usage in Supabase
- Sanity document updates
- Video playback on website

## 🎓 Lessons Learned

### Design Decisions

1. **Batch Processing**: Prevents rate limits and provides progress checkpoints
2. **Progress Tracking**: Essential for $2100 pipeline that takes 12 hours
3. **Retry Logic**: Sora API can be flaky, retries save costs
4. **Dry Run Mode**: Validate everything before spending money
5. **TypeScript**: Type safety prevents runtime errors in production

### Future Improvements

1. **Webhook Integration**: Get notified when videos complete
2. **Thumbnail Generation**: Extract frame for video preview
3. **Quality Variants**: Generate 720p and 1080p versions
4. **CDN Integration**: Serve via CDN for better performance
5. **Batch Resume UI**: Web dashboard for monitoring progress

## 📚 References

- [OpenAI Sora Documentation](https://platform.openai.com/docs/guides/sora)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Sanity Client API](https://www.sanity.io/docs/js-client)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Status:** ✅ Implementation Complete - Ready for Testing

**Next Steps:**
1. Create .env file with credentials
2. Run `pnpm install` from workspace root
3. Test with `--dry-run` flag
4. Process first batch for validation
5. Run full production when ready

For questions or issues, refer to IMPLEMENTATION_NOTES.md or README.md

