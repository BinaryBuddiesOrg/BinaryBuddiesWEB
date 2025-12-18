#!/bin/bash
# Diagnostic script to test Docker image and static asset serving

set -e

echo "🔍 Building Docker image..."
docker build -t binary-buddies-web-test .

echo ""
echo "🚀 Starting container..."
docker run -d -p 6533:6533 --name bb-web-test binary-buddies-web-test

echo ""
echo "⏳ Waiting for container to start (5 seconds)..."
sleep 5

echo ""
echo "📁 Checking files in container..."
echo "=== Root directory ==="
docker exec bb-web-test ls -la /usr/share/nginx/html/

echo ""
echo "=== Images directory ==="
docker exec bb-web-test ls -la /usr/share/nginx/html/images/ 2>/dev/null || echo "Images directory not found!"

echo ""
echo "=== File permissions check ==="
docker exec bb-web-test ls -lR /usr/share/nginx/html/ | grep -E '\.(jpg|png)'

echo ""
echo "🌐 Testing HTTP endpoints..."
echo "=== Testing /logo.jpg ==="
curl -I http://localhost:6533/logo.jpg

echo ""
echo "=== Testing /images/chatbot/hero.png ==="
curl -I http://localhost:6533/images/chatbot/hero.png

echo ""
echo "=== Testing main page ==="
curl -I http://localhost:6533/

echo ""
echo "🧹 Cleaning up..."
docker stop bb-web-test
docker rm bb-web-test

echo ""
echo "✅ Diagnostic complete!"
echo ""
echo "If you saw 200 OK responses for the image files, the fix is working!"
echo "If you saw 404 Not Found, please share the output above."
