#!/bin/bash

set -e

PROJECT_DIR="$HOME/chronicles"

echo "========================================"
echo "Chronicles Deployment Started"
echo "========================================"

cd "$PROJECT_DIR"

echo "Pulling latest code..."
git fetch origin
git checkout main
git pull origin main

echo "Stopping old containers..."
docker compose down

echo "Building images..."
docker compose build

echo "Starting containers..."
docker compose up -d

echo "Removing unused images..."
docker image prune -f

echo "Waiting for containers..."
sleep 20

echo "Container Status:"
docker compose ps

echo "Verifying required services..."
REQUIRED_SERVICES=("mysql" "backend" "frontend")

for service in "${REQUIRED_SERVICES[@]}"; do
  # Check if service is listed and its status contains 'Up' or 'running'
  if ! docker compose ps | grep -q "$service.*Up"; then
    echo "❌ Error: Required service '$service' is not running!"
    echo "--- Logs for $service ---"
    docker compose logs "$service"
    exit 1
  fi
done

echo "========================================"
echo "✅ Deployment Completed Successfully"
echo "========================================"