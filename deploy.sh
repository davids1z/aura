#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

SERVER_DEPLOY='cd /opt/aura && sudo git config --global --add safe.directory /opt/aura && sudo git fetch origin && sudo git reset --hard origin/main && sudo docker compose down && sudo docker compose build --no-cache && sudo docker compose up -d'

usage() {
    echo "Usage: ./deploy.sh [project]"
    echo ""
    echo "Projects:"
    echo "  mobile-angular   Deploy Angular mobile app"
    echo "  mobile           Deploy Flutter mobile app"
    echo "  backend          Deploy backend changes"
    echo "  admin            Deploy admin panel"
    echo "  all              Deploy everything"
    exit 1
}

build_mobile_angular() {
    echo "=== Building mobile-angular ==="
    cd "$ROOT/mobile-angular"
    npx ng build --configuration production
    rm -rf "$ROOT/backend/wwwroot/mobile-angular/"*
    cp -r dist/mobile-angular/browser/* "$ROOT/backend/wwwroot/mobile-angular/"
    cd "$ROOT"
    git add backend/wwwroot/mobile-angular/
}

build_mobile() {
    echo "=== Building mobile (Flutter) ==="
    cd "$ROOT/mobile"
    flutter build web --base-href "/mobile/"
    rm -rf "$ROOT/backend/wwwroot/mobile/"*
    cp -r build/web/* "$ROOT/backend/wwwroot/mobile/"
    cd "$ROOT"
    git add backend/wwwroot/mobile/
}

build_admin() {
    echo "=== Copying admin ==="
    cp "$ROOT/admin/index.html" "$ROOT/backend/wwwroot/admin.html"
    git add backend/wwwroot/admin.html
}

build_backend() {
    echo "=== Backend ==="
    git add backend/
}

push_and_deploy() {
    echo "=== Committing and pushing ==="
    git commit -m "Deploy: $1"
    git push origin main

    echo "=== Deploying to server ==="
    ssh aura "$SERVER_DEPLOY"

    echo ""
    echo "=== Done! $1 is live ==="
}

case "${1}" in
    mobile-angular)
        build_mobile_angular
        push_and_deploy "mobile-angular"
        ;;
    mobile)
        build_mobile
        push_and_deploy "mobile (Flutter)"
        ;;
    admin)
        build_admin
        push_and_deploy "admin"
        ;;
    backend)
        build_backend
        push_and_deploy "backend"
        ;;
    all)
        build_mobile_angular
        build_mobile
        build_admin
        build_backend
        push_and_deploy "all projects"
        ;;
    *)
        usage
        ;;
esac
