#!/bin/bash

echo "🚀 Starting Shortr with nginx setup..."

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start the services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo "📊 Service status:"
docker-compose ps

echo ""
echo "✅ Shortr is now running!"
echo ""
echo "🌐 Frontend UI: http://localhost:3005"
echo "🔗 Redirector: http://localhost"
echo ""
echo "📝 Usage:"
echo "  - Visit http://localhost:3005 to use the Shortr UI"
echo "  - Short URLs like http://localhost/abc123 will redirect"
echo ""
echo "🔍 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down" 