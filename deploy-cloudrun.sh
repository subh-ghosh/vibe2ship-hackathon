#!/bin/bash
set -e
echo "🚀 Deploying FULL STACK CivicOS to Google Cloud Run..."

# Enable APIs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --quiet

# ── 1. BACKEND ─────────────────────────────────────────────────────────────
echo "📦 Deploying Spring Boot backend..."
gcloud run deploy civicos-backend \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --max-instances 2 \
  --set-env-vars "DATABASE_URL=jdbc:postgresql://<NEON_HOST>/neondb?sslmode=require,DATABASE_USERNAME=neondb_owner,DATABASE_PASSWORD=<YOUR_NEON_PASSWORD>,GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>" \
  --quiet

BACKEND_URL=$(gcloud run services describe civicos-backend --region asia-south1 --format 'value(status.url)')
echo "✅ Backend: $BACKEND_URL"

# ── 2. FRONTEND BUILD ───────────────────────────────────────────────────────
echo "⚙️  Building frontend with Cloud Run backend URL..."
VITE_API_URL=$BACKEND_URL npm run build

# ── 3. FRONTEND DOCKERFILE (nginx) ─────────────────────────────────────────
cat > /tmp/Dockerfile.frontend << 'EOF'
FROM nginx:alpine
COPY dist /usr/share/nginx/html
RUN sed -i 's/listen  *80;/listen 8080;/g' /etc/nginx/conf.d/default.conf && \
    sed -i '/index  index.html index.htm;/a\        try_files $uri $uri/ /index.html;' /etc/nginx/conf.d/default.conf
EXPOSE 8080
EOF
cp /tmp/Dockerfile.frontend ./Dockerfile.frontend

# ── 4. FRONTEND CLOUD RUN ──────────────────────────────────────────────────
echo "🌐 Deploying React frontend to Cloud Run..."
gcloud run deploy civicos-frontend \
  --source . \
  --dockerfile Dockerfile.frontend \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --max-instances 2 \
  --quiet

FRONTEND_URL=$(gcloud run services describe civicos-frontend --region asia-south1 --format 'value(status.url)')
echo "✅ Frontend: $FRONTEND_URL"

# ── 5. ALSO UPDATE FIREBASE ────────────────────────────────────────────────
echo "🔥 Also updating Firebase..."
firebase deploy --project vibe2ship-civicos-1efcb --quiet

# ── DONE ───────────────────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║          🎉 FULL GOOGLE CLOUD DEPLOYMENT DONE!           ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║  Frontend (Cloud Run):  $FRONTEND_URL"
echo "║  Backend  (Cloud Run):  $BACKEND_URL"
echo "║  Firebase (also live):  https://vibe2ship-civicos-1efcb.web.app"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Submit this link: $FRONTEND_URL"
