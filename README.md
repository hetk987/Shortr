# Shortr - URL Shortener

A modern URL shortener application built with Node.js backend and Next.js frontend, containerized with Docker.

## 🚀 Quick Start

### Option 1: Start Combined Single Container (Recommended)

```bash
make start-combined
```

### Option 2: Start Both Services Separately

```bash
make start-all
```

### Option 3: Start Services Individually

```bash
# Start backend only
make start-backend

# Start frontend only (requires backend to be running)
make start-frontend
```

## 📋 Available Commands

Run `make help` to see all available commands:

- `make start-combined` - Start combined single container
- `make start-all` - Start both services together
- `make start-backend` - Start backend service only
- `make start-frontend` - Start frontend service only
- `make stop-all` - Stop all services
- `make build-backend` - Build backend Docker image
- `make build-frontend` - Build frontend Docker image
- `make logs-all` - View logs from all services
- `make logs-backend` - View backend logs only
- `make logs-frontend` - View frontend logs only
- `make clean` - Remove all containers and images

## 🌐 Access Points

Once running, you can access:

### Combined Container (Recommended)

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Health Check**: http://localhost:8080/

### Separate Services

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8081
- **API Health Check**: http://localhost:8081/

## 🏗️ Architecture

### Services

1. **Backend** (`./backend/`)

   - Express.js API server
   - SQLite database with Prisma ORM
   - Runs on port 80 (mapped to 8081 externally)
   - Handles URL shortening, redirects, and statistics

2. **Frontend** (`./frontend/`)
   - Next.js React application
   - Modern UI with shadcn/ui components
   - Runs on port 3000 (mapped to 3001 externally)
   - Communicates with backend API

### Docker Setup

- **Combined Container**: Single container running both services with `supervisord`
- **Individual Services**: Each service has its own `docker-compose.yml` for independent operation
- **Combined Setup**: Root `docker-compose.yml` orchestrates both services
- **Network**: Services communicate via Docker network `shortr-network`
- **Health Checks**: Both services include health checks for reliability

## 🔧 Development

### Prerequisites

- Docker and Docker Compose
- Make (optional, for convenience commands)

### Manual Docker Commands

If you prefer not to use Make:

```bash
# Start combined single container
docker-compose -f docker-compose.combined.yml up -d --build

# Start both services separately
docker-compose up -d --build

# Start backend only
cd backend && docker-compose up -d

# Start frontend only
cd frontend && docker-compose up -d

# View logs
docker-compose logs -f

# Stop all
docker-compose down
```

### Environment Variables

The services use these environment variables:

**Backend:**

- `NODE_ENV=production`
- `DATABASE_URL=file:/app/prisma/dev.db`
- `PORT=80`

**Frontend:**

- `NODE_ENV=production`
- `NEXT_PUBLIC_API_URL=http://backend:80` (when using combined setup)
- `NEXT_PUBLIC_API_URL=http://localhost:8081` (when running standalone)

## 📁 Project Structure

```
Shortr/
├── backend/                 # Backend API service
│   ├── src/
│   ├── prisma/
│   ├── Dockerfile
│   └── docker-compose.yml
├── frontend/               # Frontend web application
│   ├── src/
│   ├── Dockerfile
│   └── docker-compose.yml
├── Dockerfile              # Combined container
├── supervisord.conf        # Process manager config
├── docker-compose.yml      # Multi-service orchestration
├── docker-compose.combined.yml # Single container setup
├── Makefile               # Convenience commands
└── README.md
```

## 🛠️ API Endpoints

- `GET /` - List all short links
- `POST /` - Create new short link
- `GET /:alias` - Redirect to target URL
- `DELETE /:alias` - Delete short link
- `PUT /` - Update short link

## 🔍 Troubleshooting

### Service Communication Issues

If the frontend can't connect to the backend:

1. Ensure both services are running: `docker-compose ps`
2. Check backend health: `curl http://localhost:8081/`
3. Verify network connectivity: `docker network ls`

### Database Issues

If the database isn't working:

1. Check if Prisma migrations ran: `docker-compose logs backend`
2. Restart the backend service: `make stop-all && make start-all`

### Port Conflicts

If ports are already in use:

- Backend: Change port 8081 in `docker-compose.yml`
- Frontend: Change port 3001 in `docker-compose.yml`

## 🧹 Cleanup

To completely remove all Docker resources:

```bash
make clean
```

This will remove all containers, images, and volumes associated with the project.
