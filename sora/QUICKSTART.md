# 🎬 Sora Video Pipeline - Quick Start

## What Was Built

A complete TypeScript pipeline that:
1. Reads 70 career prompts from `vhwda_sora_prompts_updated.csv`
2. Generates videos using OpenAI Sora API
3. Uploads videos to Supabase Storage (`career-videos` bucket)
4. Updates Sanity career documents with video URLs
5. Tracks progress for resumability

## Get Started in 3 Steps

### 1️⃣ Create Environment File

Create `sora/.env`:
```env
OPENAI_API_KEY=sk-proj-...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhb...
SANITY_TOKEN=sk...
SANITY_PROJECT_ID=j0yc55ca
SANITY_DATASET=production
```

**Get Credentials:**
- OpenAI: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Supabase: Project Settings → API
- Sanity: [manage.sanity.io](https://manage.sanity.io) → API → Tokens

### 2️⃣ Install Dependencies

```bash
cd /Users/leswins/VHWDA
pnpm install
```

### 3️⃣ Run Pipeline

**Test first (no cost):**
```bash
cd sora
pnpm tsx generate-videos.ts --dry-run
```

**Process all videos ($700-2100 total):**
```bash
pnpm tsx generate-videos.ts
```

**Or start small (test with 2 careers):**
```bash
pnpm tsx generate-videos.ts --careers "Dental Assistant,Dental Hygienist"
```

## Commands

| Command | Description |
|---------|-------------|
| `--dry-run` | Validate without generating videos |
| `--resume` | Continue from last checkpoint |
| `--batch-size N` | Process N videos at a time (default: 5) |
| `--careers "A,B"` | Only process specific careers |

## Files Created

```
sora/
├── generate-videos.ts        # Main orchestration script
├── lib/
│   ├── csv-parser.ts         # Parse CSV prompts
│   ├── sora-client.ts        # OpenAI Sora API
│   ├── supabase-client.ts    # Upload to Supabase
│   ├── sanity-client.ts      # Update Sanity CMS
│   └── progress-tracker.ts   # Resumable processing
├── setup.sh                  # Automated setup
├── package.json              # Dependencies
└── README.md                 # Full documentation
```

## What Happens When You Run It

1. **Parse CSV** - Reads all 70 career prompts
2. **Batch Processing** - Processes 5 videos at a time
3. **For each career:**
   - Generate video via Sora (~7 minutes)
   - Download to temp folder
   - Upload to Supabase Storage
   - Update Sanity `videoUrl` field
   - Save progress to `progress.json`
   - Clean up temp file
4. **Summary Report** - Shows completed/failed counts

## Cost & Time

| Metric | Estimate |
|--------|----------|
| Cost per video | $10-30 |
| Total cost (70) | $700-2100 |
| Time per video | 5-10 minutes |
| Total time | 6-12 hours |
| Storage (Supabase) | ~5GB (~$0.10/month) |

## Safety Features

✅ **Progress Tracking** - Resumes from interruptions  
✅ **Error Handling** - Retries failed videos (3 attempts)  
✅ **Batch Processing** - Rate limiting to avoid API issues  
✅ **Dry Run Mode** - Test without spending money  
✅ **Specific Career Mode** - Test with 1-2 careers first  

## Validation After Running

1. **Check Supabase:**
   ```
   Storage → career-videos bucket → Should have 70 .mp4 files
   ```

2. **Check Sanity:**
   ```groq
   *[_type == "career" && defined(videoUrl)] | length
   // Should return 70
   ```

3. **Test on Website:**
   - Visit a career detail page
   - Video should auto-play or have play button

## Troubleshooting

**"Missing environment variables"**
→ Create `.env` file with all required credentials

**"Career not found in Sanity"**
→ CSV career name must match Sanity `title.en` exactly

**"Sora API error"**
→ Confirm you have Sora API access (limited beta)

**"Upload failed"**
→ Check Supabase service key permissions

## Next Steps

1. ✅ Run dry-run to validate setup
2. ✅ Test with 1-2 careers first
3. ✅ Monitor costs in OpenAI dashboard
4. ✅ Run full batch when ready
5. ✅ Verify all videos on website

## Need Help?

- **Full Documentation**: `README.md`
- **Implementation Details**: `IMPLEMENTATION_NOTES.md`
- **OpenAI Sora Docs**: [platform.openai.com/docs](https://platform.openai.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

---

**⚠️ Important:** Start with `--dry-run` and test with 1-2 careers before processing all 70!

