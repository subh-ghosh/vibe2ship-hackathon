#!/bin/bash
echo "🚀 Building the self-sufficient frontend ecosystem..."
npm run build

echo "☁️ Deploying to Google Cloud Run (Free Tier)..."
echo "Note: If prompted to enable APIs or choose a region, type 'y' or select a region (e.g., us-central1)."
gcloud run deploy civicos-demo \
    --source . \
    --port 8080 \
    --allow-unauthenticated \
    --region us-central1 \
    --max-instances 1 \
    --memory 256Mi

echo "✅ Deployment triggered! Watch for the .run.app link in the output above."
