# Shortr - URL Shortener

A modern, elegant URL shortener with a beautiful frontend and robust backend API.

## 🚀 Features

- **🔗 URL Shortening**: Create custom short links with your own aliases
- **📊 Analytics**: Track click counts for each short link
- **🎨 Modern UI**: Beautiful, responsive frontend built with Next.js and shadcn/ui
- **⚡ Fast API**: Lightweight Express.js backend with SQLite database
- **📱 Mobile Friendly**: Works perfectly on all devices
- **🌙 Dark Mode**: Automatic dark mode support
- **🔒 Secure**: Input validation and error handling

## 🏗️ Architecture

- **Backend**: Node.js + Express.js + Prisma + SQLite
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
- **Database**: SQLite with WAL mode for better concurrency

## 📁 Project Structure

```
Shortr/
├── src/                    # Backend API source code
├── prisma/                 # Database schema and migrations
├── lib/                    # Backend utilities
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   └── components/    # React components
│   └── package.json
├── package.json           # Backend dependencies
└── compose.yaml          # Docker Compose configuration
```

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (optional, for containerized deployment)

### Backend Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up the database:

   ```bash
   npx prisma migrate dev
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

The API will be available at `http://localhost:80`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Run the setup script:

   ```bash
   ./setup.sh
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## 🐳 Docker Deployment

Use Docker Compose to run both services:

```bash
docker-compose up --build
```

This will start:

- Backend API on port 80
- Frontend on port 3000

## 📚 API Endpoints

### Backend API (`http://localhost:80`)

- `GET /` - Get all short links
- `POST /` - Create a new short link
- `GET /:alias` - Redirect to target URL
- `DELETE /:alias` - Delete a short link
- `PUT /` - Update a short link

### Request/Response Examples

**Create a short link:**

```bash
curl -X POST http://localhost:80/ \
  -H "Content-Type: application/json" \
  -d '{"alias": "my-link", "url": "https://example.com"}'
```

**Get all links:**

```bash
curl http://localhost:80/
```

## 🎨 Frontend Features

- **Create Links**: Simple form to create new short links
- **Manage Links**: View, copy, and delete existing links
- **Analytics**: See click counts for each link
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Automatic refresh after actions
- **Toast Notifications**: User-friendly feedback

## 🔧 Configuration

### Backend Environment Variables

The backend uses default SQLite database. For production, consider using PostgreSQL.

### Frontend Environment Variables

Create `.env.local` in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:80
```

## 🧪 Development

### Backend Development

```bash
# Start development server
npm start

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio
```

### Frontend Development

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## 📦 Production Deployment

### Backend

1. Build the Docker image:

   ```bash
   docker build -t shortr-backend .
   ```

2. Run with environment variables:
   ```bash
   docker run -p 80:80 shortr-backend
   ```

### Frontend

1. Build the application:

   ```bash
   cd frontend
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Prisma](https://www.prisma.io/) for the database toolkit
