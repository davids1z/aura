#!/bin/bash
set -e

echo "=== Building Angular app ==="
npx ng build --configuration production

echo "=== Copying build to backend ==="
rm -rf ../backend/wwwroot/mobile-angular/*
cp -r dist/mobile-angular/browser/* ../backend/wwwroot/mobile-angular/

echo "=== Committing and pushing ==="
cd ..
git add backend/wwwroot/mobile-angular/
git commit -m "Update mobile-angular build"
git push origin main

echo "=== Deploying to server ==="
ssh aura "cd /opt/aura && sudo git fetch origin && sudo git reset --hard origin/main && sudo docker compose down && sudo docker compose build --no-cache && sudo docker compose up -d"

echo "=== Done! Site is live ==="
