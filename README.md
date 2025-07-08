# Shortr - URL Shortener

A modern URL shortener application built with Node.js backend and Next.js frontend, containerized with Docker and served via a single Nginx instance.

## 🚀 Quick Start

Start the application using the nginx setup:

```bash
./start-shortr.sh
```

This will build and start all services (backend, frontend, and nginx) in separate containers, with a single Nginx instance proxying both the frontend UI and redirector endpoints.

## 🌐 Access Points

- **Frontend UI**: http://localhost:3005
- **Redirector**: http://localhost (port 80)

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│              Single Nginx               │
│              Container                  │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │   Port 3005 │  │    Port 80      │   │
│  │  (Frontend) │  │  (Redirector)   │   │
│  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────┘
```

- **Backend** (`./backend/`): Express.js API server, SQLite with Prisma ORM, runs on port 8080 (internal)
- **Frontend** (`./frontend/`): Next.js React app, runs on port 3000 (internal)
- **Nginx**: Single container, proxies:
  - Port 80 → backend for redirects (e.g. http://localhost/abc123)
  - Port 3005 → frontend UI (e.g. http://localhost:3005)
  - /api on port 3005 → backend

## 🛠️ How to Use

1. **Start the application:**
   ```bash
   ./start-shortr.sh
   ```
2. **Access the UI:**
   - Visit http://localhost:3005 to use the Shortr UI
   - Short URLs like http://localhost/abc123 will redirect
3. **View logs:**
   ```bash
   docker-compose -f docker-compose.yml logs -f
   ```
4. **Stop the application:**
   ```bash
   docker-compose -f docker-compose.yml down
   ```

## 📁 Project Structure

```
Shortr/
├── backend/                 # Backend API service
│   ├── src/
│   ├── prisma/
│   ├── Dockerfile
│   └── ...
├── frontend/                # Frontend web application
│   ├── src/
│   ├── Dockerfile
│   └── ...
├── nginx.conf      # Single Nginx config for both frontend and redirector
├── docker-compose.yml # Docker Compose for single-nginx setup
├── start-shortr.sh   # Startup script
└── README.md
```

## 🛠️ API Endpoints

- `GET /` - List all short links
- `POST /` - Create new short link
- `GET /:alias` - Redirect to target URL
- `DELETE /:alias` - Delete short link
- `PUT /` - Update short link

## 🔍 Troubleshooting

- **Port 80 in use:** Make sure no other service is using port 80 before starting.
- **Frontend not loading:** Ensure all containers are healthy (`docker-compose -f docker-compose.yml ps`).
- **Database issues:** Check backend logs for errors.

## 🧹 Cleanup

To completely remove all Docker resources:

```bash
docker-compose -f docker-compose.yml down -v --rmi all
```

This will remove all containers, images, and volumes associated with the project.
