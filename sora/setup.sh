#!/bin/bash

# Setup script for Sora Video Generation Pipeline
# Run this script before using the video generator

echo "🎬 Setting up Sora Video Generation Pipeline..."
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
  echo "⚠️  .env file not found!"
  echo "Please create a .env file with your API credentials."
  echo "You can copy the example below:"
  echo ""
  echo "OPENAI_API_KEY=your_openai_api_key_here"
  echo "SUPABASE_URL=your_supabase_project_url"
  echo "SUPABASE_SERVICE_KEY=your_supabase_service_role_key"
  echo "SANITY_TOKEN=your_sanity_write_token"
  echo "SANITY_PROJECT_ID=j0yc55ca"
  echo "SANITY_DATASET=production"
  echo ""
  exit 1
fi

echo "✓ .env file found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

if [ $? -ne 0 ]; then
  echo "❌ Failed to install dependencies"
  exit 1
fi

echo ""
echo "✓ Dependencies installed"

# Create videos directory
mkdir -p videos

echo "✓ Videos directory created"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "  1. Test with dry run: pnpm tsx generate-videos.ts --dry-run"
echo "  2. Process all videos: pnpm tsx generate-videos.ts"
echo "  3. Or resume: pnpm tsx generate-videos.ts --resume"
echo ""

