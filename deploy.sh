#!/bin/bash
set -e

# Configuration
PROJECT_ID="kppahare-gtd"
REGION="us-central1"
DB_INSTANCE="gtd-family-db"
DB_NAME="gtd_family"
BACKEND_SERVICE="gtd-backend"
FRONTEND_BUCKET="gtd-frontend-$PROJECT_ID"

echo "=== GTD Family GCP Deployment ==="

# Set project
gcloud config set project $PROJECT_ID

# Create database
echo "Creating database..."
gcloud sql databases create $DB_NAME --instance=$DB_INSTANCE 2>/dev/null || echo "Database already exists"

# Create database user
DB_PASSWORD=$(openssl rand -base64 24)
gcloud sql users create gtd_user --instance=$DB_INSTANCE --password="$DB_PASSWORD" 2>/dev/null || echo "User already exists"

# Store secrets
echo "Storing secrets..."
echo -n "$DB_PASSWORD" | gcloud secrets create db-password --data-file=- 2>/dev/null || \
  echo -n "$DB_PASSWORD" | gcloud secrets versions add db-password --data-file=-

JWT_SECRET=$(openssl rand -base64 32)
echo -n "$JWT_SECRET" | gcloud secrets create jwt-secret --data-file=- 2>/dev/null || true

# Get Cloud SQL connection name
CONNECTION_NAME=$(gcloud sql instances describe $DB_INSTANCE --format='value(connectionName)')

# Build and deploy backend
echo "Deploying backend to Cloud Run..."
cd backend
gcloud run deploy $BACKEND_SERVICE \
  --source . \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --add-cloudsql-instances $CONNECTION_NAME \
  --set-env-vars "DATABASE_URL=postgresql://gtd_user:${DB_PASSWORD}@/${DB_NAME}?host=/cloudsql/${CONNECTION_NAME}" \
  --set-env-vars "SECRET_KEY=${JWT_SECRET}"
cd ..

# Get backend URL
BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region=$REGION --format='value(status.url)')
echo "Backend deployed at: $BACKEND_URL"

# Build frontend with backend URL
echo "Building frontend..."
cd web
echo "VITE_API_URL=$BACKEND_URL" > .env.production
npm run build
cd ..

# Create storage bucket for frontend
echo "Deploying frontend..."
gsutil mb -p $PROJECT_ID -l $REGION gs://$FRONTEND_BUCKET 2>/dev/null || echo "Bucket already exists"
gsutil -m rsync -r -d web/dist gs://$FRONTEND_BUCKET
gsutil iam ch allUsers:objectViewer gs://$FRONTEND_BUCKET
gsutil web set -m index.html -e index.html gs://$FRONTEND_BUCKET

echo ""
echo "=== Deployment Complete ==="
echo "Backend:  $BACKEND_URL"
echo "Frontend: https://storage.googleapis.com/$FRONTEND_BUCKET/index.html"
echo ""
echo "For a custom domain, set up a load balancer with Cloud CDN."
