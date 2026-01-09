# Sora Video Generation Pipeline

Automated pipeline to generate career videos using OpenAI Sora API, upload to Supabase Storage, and update Sanity CMS.

## Setup

### Quick Start

Run the setup script:
```bash
cd sora
chmod +x setup.sh
./setup.sh
```

### Manual Setup

1. **Configure environment variables:**
   
   Create a `.env` file in the `sora/` directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   SANITY_TOKEN=your_sanity_write_token
   SANITY_PROJECT_ID=j0yc55ca
   SANITY_DATASET=production
   ```

   **Where to get credentials:**
   - **OpenAI API key**: platform.openai.com/api-keys (requires Sora access)
   - **Supabase URL/Key**: Your Supabase project settings → API
   - **Sanity Token**: manage.sanity.io → Your project → API → Tokens → Add API token (Editor or Admin role)

2. **Install dependencies:**
   ```bash
   cd /Users/leswins/VHWDA
   pnpm install
   ```

3. **Supabase bucket:**
   - The script auto-creates the `career-videos` bucket on first run
   - Or manually create it in Supabase dashboard (public access, video/mp4 allowed)

## Usage

```bash
# Dry run (validate without API calls)
pnpm tsx generate-videos.ts --dry-run

# Process all careers in batches
pnpm tsx generate-videos.ts

# Resume from last checkpoint
pnpm tsx generate-videos.ts --resume

# Process specific careers only
pnpm tsx generate-videos.ts --careers "Dentist,Nurse Practitioner"

# Custom batch size
pnpm tsx generate-videos.ts --batch-size 10
```

## Cost Warning

⚠️ **This pipeline is expensive!**
- Sora API: ~$10-30 per video
- 70 careers = $700-2100 total
- Processing time: 6-12 hours

## Architecture

1. Parse CSV with career prompts
2. Generate videos via Sora API (async)
3. Upload to Supabase Storage
4. Update Sanity career documents
5. Track progress for resumability

## Files

- `generate-videos.ts` - Main orchestration script
- `lib/csv-parser.ts` - CSV parsing utility
- `lib/sora-client.ts` - OpenAI Sora API wrapper
- `lib/supabase-client.ts` - Supabase upload handler
- `lib/sanity-client.ts` - Sanity update handler
- `lib/progress-tracker.ts` - State persistence

