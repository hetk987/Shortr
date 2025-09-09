.PHONY: help build-backend build-frontend start-backend start-frontend start-all stop-all clean logs-backend logs-frontend logs-all

# Default target
help:
	@echo "Shortr Docker Management Commands:"
	@echo ""
	@echo "Individual Services:"
	@echo "  build-backend    - Build backend Docker image"
	@echo "  build-frontend   - Build frontend Docker image"
	@echo "  start-backend    - Start backend service only"
	@echo "  start-frontend   - Start frontend service only"
	@echo ""
	@echo "Full Application:"
	@echo "  start-all        - Start both services together"
	@echo "  start-combined   - Start combined single container"
	@echo "  stop-all         - Stop all services"
	@echo "  logs-all         - View logs from all services"
	@echo ""
	@echo "Maintenance:"
	@echo "  clean            - Remove all containers and images"
	@echo "  logs-backend     - View backend logs"
	@echo "  logs-frontend    - View frontend logs"

# Build individual services
build-backend:
	@echo "Building backend..."
	cd backend && docker-compose build

build-frontend:
	@echo "Building frontend..."
	cd frontend && docker-compose build

# Start individual services
start-backend:
	@echo "Starting backend service..."
	cd backend && docker-compose up -d

start-frontend:
	@echo "Starting frontend service..."
	cd frontend && docker-compose up -d

# Start all services together
start-all:
	@echo "Starting all services..."
	docker-compose up -d --build

# Start combined single container
start-combined:
	@echo "Starting combined single container..."
	docker-compose -f docker-compose.yml up -d --build

# Stop all services
stop-all:
	@echo "Stopping all services..."
	docker-compose down
	docker-compose -f docker-compose.yml down
	cd backend && docker-compose down
	cd frontend && docker-compose down

# View logs
logs-backend:
	cd backend && docker-compose logs -f

logs-frontend:
	cd frontend && docker-compose logs -f

logs-all:
	docker-compose logs -f

# Clean up
clean:
	@echo "Cleaning up Docker resources..."
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.yml down -v --rmi all
	cd backend && docker-compose down -v --rmi all
	cd frontend && docker-compose down -v --rmi all
	docker system prune -f 